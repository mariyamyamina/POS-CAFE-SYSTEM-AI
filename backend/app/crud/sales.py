from typing import Optional
from datetime import datetime, date

from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func

from app.models.sales import SalesHdr, SalesDtl
from app.models.inventory import InventoryItem
from app.schemas.sales import SaleCreate


def create_sale(db: Session, sale_data: SaleCreate, cashier_id: int) -> SalesHdr:
    """
    Creates a sales_hdr row plus all its sales_dtl line items in a single
    DB transaction — if anything fails, nothing is committed (no orphaned
    header with missing lines, or vice versa).
    Also updates inventory: decreases in_stock and increases sold for each item.
    """
    hdr = SalesHdr(
        table_no=sale_data.table_no,
        cover_no=sale_data.cover_no,
        total_amt=sale_data.total_amt,
        gst=sale_data.gst,
        payable=sale_data.payable,
        tender=sale_data.tender,
        change_amt=sale_data.change_amt,
        cashier_id=cashier_id,
    )
    db.add(hdr)
    db.flush()  # assigns hdr.id without committing yet, needed for sale_id FK below

    for line in sale_data.items:
        db.add(SalesDtl(
            sale_id=hdr.id,
            item_id=line.item_id,
            item_name=line.item_name,
            qty=line.qty,
            unit_price=line.unit_price,
            total=line.qty * line.unit_price,
        ))

        # Update inventory: decrease in_stock and increase sold
        if line.item_id:
            inventory_item = db.query(InventoryItem).filter(InventoryItem.id == line.item_id).first()
            if inventory_item:
                inventory_item.in_stock -= line.qty
                inventory_item.sold += line.qty

    db.commit()
    db.refresh(hdr)
    return hdr


def get_sale(db: Session, sale_id: int) -> Optional[SalesHdr]:
    return (
        db.query(SalesHdr)
        .options(joinedload(SalesHdr.details), joinedload(SalesHdr.cashier))
        .filter(SalesHdr.id == sale_id)
        .first()
    )


def get_sales(db: Session, skip: int = 0, limit: int = 100):
    return (
        db.query(SalesHdr)
        .options(joinedload(SalesHdr.details), joinedload(SalesHdr.cashier))
        .order_by(SalesHdr.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )


def get_sales_report_rows(
    db: Session,
    date_from: Optional[date] = None,
    date_to: Optional[date] = None,
    item_name: Optional[str] = None,
):
    """
    Flattened item-level rows across all sales for the Sales Report table —
    one row per sales_dtl line, matching the existing frontend table shape.
    """
    query = (
        db.query(SalesDtl, SalesHdr.id.label("hdr_id"), SalesHdr.created_at)
        .join(SalesHdr, SalesDtl.sale_id == SalesHdr.id)
    )

    if date_from:
        query = query.filter(func.date(SalesHdr.created_at) >= date_from)
    if date_to:
        query = query.filter(func.date(SalesHdr.created_at) <= date_to)
    if item_name:
        query = query.filter(SalesDtl.item_name.ilike(f"%{item_name}%"))

    query = query.order_by(SalesHdr.created_at.desc())

    rows = []
    for dtl, hdr_id, created_at in query.all():
        rows.append({
            "id": dtl.id,
            "sale_id": hdr_id,
            "bill_no": f"BILL-{hdr_id}",
            "item_name": dtl.item_name,
            "sold_quantity": dtl.qty,
            "total_price": dtl.total,
            "created_at": created_at,
        })
    return rows