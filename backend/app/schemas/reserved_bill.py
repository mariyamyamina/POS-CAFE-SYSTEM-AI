from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


class ReservedBillItem(BaseModel):
    id: int
    name: str
    quantity: int
    unitPrice: float
    image: Optional[str] = None


class ReservedBillCreate(BaseModel):
    table_number: Optional[str] = None
    covers: Optional[str] = None
    total: float
    items: List[ReservedBillItem]


class ReservedBillResponse(BaseModel):
    id: int
    table_number: Optional[str] = None
    covers: Optional[str] = None
    total: float
    items: List[ReservedBillItem]
    restored: bool
    created_at: datetime
    restored_at: Optional[datetime] = None

    class Config:
        from_attributes = True