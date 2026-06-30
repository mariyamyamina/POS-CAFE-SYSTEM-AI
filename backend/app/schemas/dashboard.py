from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


class DashboardStats(BaseModel):
    total_sales: float
    total_orders: int
    total_users: int
    average_order_value: float
    total_products: int


class LowStockItem(BaseModel):
    id: int
    name: str
    unit: str
    stock: int
    image_url: Optional[str] = None
    level: str


class SalesDataPoint(BaseModel):
    date: str
    total: float


class TopSellingItem(BaseModel):
    item_name: str
    total_sold: int
    total_revenue: float


class RecentTransaction(BaseModel):
    id: int
    bill_no: str
    total_amount: float
    created_at: datetime
    table_no: Optional[str] = None
    
    class Config:
        from_attributes = True


class DashboardResponse(BaseModel):
    stats: DashboardStats
    low_stock_items: List[LowStockItem]
    sales_overview: List[SalesDataPoint]
    top_selling_items: List[TopSellingItem]
    recent_transactions: List[RecentTransaction]
