from typing import Literal, List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.crud.dashboard import (
    get_dashboard_stats,
    get_low_stock_items,
    get_sales_overview,
    get_top_selling_items,
    get_recent_transactions
)
from app.schemas.dashboard import DashboardResponse, TopSellingItem
from app.api.deps import get_current_user

router = APIRouter()


@router.get("/api/dashboard", response_model=DashboardResponse)
def get_dashboard_data(current_user = Depends(get_current_user), db: Session = Depends(get_db)):
    """Get all dashboard data in a single call."""
    stats = get_dashboard_stats(db)
    low_stock_items = get_low_stock_items(db)
    sales_overview = get_sales_overview(db)
    top_selling_items = get_top_selling_items(db)
    recent_transactions = get_recent_transactions(db)

    return DashboardResponse(
        stats=stats,
        low_stock_items=low_stock_items,
        sales_overview=sales_overview,
        top_selling_items=top_selling_items,
        recent_transactions=recent_transactions
    )


@router.get("/api/dashboard/top-selling-items", response_model=List[TopSellingItem])
def get_top_selling_items_by_period(
    period: Literal["this_week", "last_week", "this_month"] = "this_week",
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get top selling items filtered to a given period."""
    return get_top_selling_items(db, period=period)