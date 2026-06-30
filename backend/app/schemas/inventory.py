from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class InventoryItemBase(BaseModel):
    name: str
    description: Optional[str] = None
    category_id: int
    price: float
    unit: str
    in_stock: int = 0
    purchased: int = 0
    supplier: Optional[str] = None


class InventoryItemCreate(InventoryItemBase):
    pass


class InventoryItemUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    category_id: Optional[int] = None
    price: Optional[float] = None
    unit: Optional[str] = None
    in_stock: Optional[int] = None
    purchased: Optional[int] = None
    supplier: Optional[str] = None


class InventoryItemResponse(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    category_id: int
    category_name: Optional[str] = None  # flattened from the Category relationship for easy frontend use
    price: float
    unit: str
    in_stock: int
    purchased: int
    sold: int
    supplier: Optional[str] = None
    image_url: Optional[str] = None
    status: str  # computed: "Out of Stock" | "Low Stock" | "In Stock"
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True