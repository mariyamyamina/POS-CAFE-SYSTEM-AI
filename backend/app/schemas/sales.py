from decimal import Decimal
from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel


class SaleLineCreate(BaseModel):
    item_id: Optional[int] = None
    item_name: str
    qty: int
    unit_price: Decimal


class SaleCreate(BaseModel):
    table_no: Optional[str] = None
    cover_no: Optional[int] = None

    total_amt: Decimal
    gst: Decimal
    payable: Decimal
    tender: Decimal
    change_amt: Decimal

    items: List[SaleLineCreate]


class SaleLineResponse(BaseModel):
    id: int
    item_id: Optional[int] = None
    item_name: str
    qty: int
    unit_price: Decimal
    total: Decimal

    class Config:
        from_attributes = True


class SaleResponse(BaseModel):
    id: int
    bill_no: str

    table_no: Optional[str] = None
    cover_no: Optional[int] = None

    total_amt: Decimal
    gst: Decimal
    payable: Decimal
    tender: Decimal
    change_amt: Decimal

    cashier_id: int
    cashier_name: Optional[str] = None

    created_at: datetime

    items: List[SaleLineResponse] = []

    class Config:
        from_attributes = True


# Flattened row shape for the Sales Report table
class SalesReportRow(BaseModel):
    id: int
    sale_id: int
    bill_no: str

    item_name: str
    sold_quantity: int
    total_price: Decimal

    created_at: datetime

    class Config:
        from_attributes = True