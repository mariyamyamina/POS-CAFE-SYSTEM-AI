from pydantic import BaseModel
from typing import List, Optional
from datetime import date, datetime


class ItemRequestLineCreate(BaseModel):
    item_id: int
    item_name: str
    quantity: int
    item_date: Optional[date] = None


class ItemRequestLineUpdate(BaseModel):
    id: Optional[int] = None  # present for existing lines being edited, absent for new lines
    item_id: int
    item_name: str
    quantity: int
    item_date: Optional[date] = None


class ItemRequestCreate(BaseModel):
    subject: str
    requested_date: date
    expected_delivery: Optional[date] = None
    items: List[ItemRequestLineCreate]
    # status is NOT accepted from the client on create — it's derived from
    # which endpoint/action is used (save draft vs submit), set server-side


class ItemRequestUpdate(BaseModel):
    subject: Optional[str] = None
    requested_date: Optional[date] = None
    expected_delivery: Optional[date] = None
    status: Optional[str] = None  # allowed here since editing can change status manually (e.g. to Cancelled)
    items: Optional[List[ItemRequestLineUpdate]] = None


class ItemRequestLineResponse(BaseModel):
    id: int
    item_id: int
    item_name: str
    quantity: int
    item_date: Optional[date] = None

    class Config:
        from_attributes = True


class ItemRequestResponse(BaseModel):
    id: int
    request_no: str
    subject: str
    requested_by: int
    requested_by_name: Optional[str] = None  # flattened from User relationship
    requested_date: date
    expected_delivery: Optional[date] = None
    status: str
    created_at: datetime
    updated_at: datetime
    items: List[ItemRequestLineResponse] = []

    class Config:
        from_attributes = True