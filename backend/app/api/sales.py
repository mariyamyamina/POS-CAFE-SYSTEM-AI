from typing import Optional, List
from datetime import date

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.api.deps import get_current_user  # ⚠️ assumed path/name — adjust if your auth dependency differs
from app.models.user import User
from app.crud.sales import create_sale, get_sale, get_sales, get_sales_report_rows
from app.schemas.sales import SaleCreate, SaleResponse, SalesReportRow

router = APIRouter()


def _to_sale_response(hdr) -> dict:
    return {
        "id": hdr.id,
        "bill_no": hdr.bill_no,
        "table_no": hdr.table_no,
        "cover_no": hdr.cover_no,
        "total_amt": hdr.total_amt,
        "gst": hdr.gst,
        "payable": hdr.payable,
        "tender": hdr.tender,
        "change_amt": hdr.change_amt,
        "cashier_id": hdr.cashier_id,
        "cashier_name": hdr.cashier.full_name if hdr.cashier else None,
        "created_at": hdr.created_at,
        "items": hdr.details,
    }


@router.post("/sales", response_model=SaleResponse)
def create_new_sale(
    sale: SaleCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Records a completed sale: header + line items, in one transaction.
    cashier_id is taken from the authenticated user, not the request body,
    so the frontend never needs to send it.
    """
    if not sale.items:
        raise HTTPException(status_code=400, detail="Sale must include at least one item")

    hdr = create_sale(db, sale, cashier_id=current_user.id)
    return _to_sale_response(hdr)


@router.get("/sales/{sale_id}", response_model=SaleResponse)
def get_sale_by_id(sale_id: int, db: Session = Depends(get_db)):
    hdr = get_sale(db, sale_id)
    if not hdr:
        raise HTTPException(status_code=404, detail="Sale not found")
    return _to_sale_response(hdr)


@router.get("/sales", response_model=List[SaleResponse])
def get_all_sales(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    hdrs = get_sales(db, skip=skip, limit=limit)
    return [_to_sale_response(h) for h in hdrs]


@router.get("/sales-report", response_model=List[SalesReportRow])
def get_sales_report(
    date_from: Optional[date] = None,
    date_to: Optional[date] = None,
    item_name: Optional[str] = None,
    db: Session = Depends(get_db),
):
    """
    Powers SalesReportTable.jsx — flattened item-level rows, optionally
    filtered by date range and/or item name to match SalesReportFilterBar.
    """
    return get_sales_report_rows(db, date_from=date_from, date_to=date_to, item_name=item_name)