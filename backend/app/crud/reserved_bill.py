from typing import List, Optional
from datetime import datetime, timezone

from sqlalchemy.orm import Session

from app.models.reserved_bill import ReservedBill
from app.schemas.reserved_bill import ReservedBillItem


def create_reserved_bill(
    db: Session,
    total: float,
    items: List[ReservedBillItem],
    table_number: Optional[str] = None,
    covers: Optional[str] = None,
):
    """Snapshot the current bill into a new reserved bill row."""
    bill = ReservedBill(
        table_number=table_number,
        covers=covers,
        total=total,
        items=[item.model_dump() for item in items],
        restored=False,
    )
    db.add(bill)
    db.commit()
    db.refresh(bill)
    return bill


def get_reserved_bills(db: Session, include_restored: bool = False):
    """Get reserved bills, active (not-yet-restored) only by default."""
    query = db.query(ReservedBill)
    if not include_restored:
        query = query.filter(ReservedBill.restored == False)  # noqa: E712
    return query.order_by(ReservedBill.created_at.desc()).all()


def get_reserved_bill(db: Session, bill_id: int):
    return db.query(ReservedBill).filter(ReservedBill.id == bill_id).first()


def restore_reserved_bill(db: Session, bill_id: int):
    """Marks a reserved bill as restored. Returns None if not found or already restored."""
    bill = get_reserved_bill(db, bill_id)
    if not bill or bill.restored:
        return None

    bill.restored = True
    bill.restored_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(bill)
    return bill