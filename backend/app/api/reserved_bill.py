from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.crud.reserved_bill import (
    create_reserved_bill,
    get_reserved_bills,
    restore_reserved_bill,
)
from app.schemas.reserved_bill import ReservedBillCreate, ReservedBillResponse

router = APIRouter()


@router.post("/api/reserved-bills", response_model=ReservedBillResponse)
def reserve_bill(payload: ReservedBillCreate, db: Session = Depends(get_db)):
    """Save the current bill's items as a reserved bill."""
    if not payload.items:
        raise HTTPException(status_code=400, detail="Cannot reserve an empty bill")

    bill = create_reserved_bill(
        db,
        total=payload.total,
        items=payload.items,
        table_number=payload.table_number,
        covers=payload.covers,
    )
    return bill


@router.get("/api/reserved-bills", response_model=List[ReservedBillResponse])
def list_reserved_bills(db: Session = Depends(get_db)):
    """List all not-yet-restored reserved bills, newest first."""
    return get_reserved_bills(db)


@router.put("/api/reserved-bills/{bill_id}/restore", response_model=ReservedBillResponse)
def restore_bill(bill_id: int, db: Session = Depends(get_db)):
    """Mark a reserved bill as restored so its items can repopulate the bill table."""
    bill = restore_reserved_bill(db, bill_id)
    if not bill:
        raise HTTPException(status_code=404, detail="Reserved bill not found or already restored")
    return bill