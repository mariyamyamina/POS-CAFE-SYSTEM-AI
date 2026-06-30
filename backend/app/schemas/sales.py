from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


class SaleLineCreate(BaseModel):
    item_id: Optional[int] = None
    item_name: str
    qty: int
    unit_price: float


class SaleCreate(BaseModel):
    table_no: Optional[str] = None
    cover_no: Optional[int] = None
    total_amt: float
    gst: float
    payable: float
    tender: float
    change_amt: float
    items: List[SaleLineCreate]


class SaleLineResponse(BaseModel):
    id: int
    item_id: Optional[int] = None
    item_name: str
    qty: int
    unit_price: float
    total: float

    class Config:
        from_attributes = True


class SaleResponse(BaseModel):
    id: int
    bill_no: str
    table_no: Optional[str] = None
    cover_no: Optional[int] = None
    total_amt: float
    gst: float
    payable: float
    tender: float
    change_amt: float
    cashier_id: int
    cashier_name: Optional[str] = None  # flattened from User relationship
    created_at: datetime
    items: List[SaleLineResponse] = []

    class Config:
        from_attributes = True


# Flattened row shape for the Sales Report table (one row per item sold,
# matching SalesReportTable.jsx's current itemName/soldQuantity/totalPrice columns)
class SalesReportRow(BaseModel):
    id: int  # sales_dtl.id, used as the table row key
    sale_id: int
    bill_no: str
    item_name: str
    sold_quantity: int
    total_price: float
    created_at: datetime