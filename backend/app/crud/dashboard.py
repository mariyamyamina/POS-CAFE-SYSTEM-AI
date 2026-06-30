from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import date, timedelta

from app.models.sales import SalesHdr, SalesDtl
from app.models.inventory import InventoryItem
from app.models.user import User
from app.models.settings import Settings


def get_dashboard_stats(db: Session):
    """Get overall dashboard statistics."""
    # Total Sales (sum of all sales payable amounts)
    total_sales = db.query(func.sum(SalesHdr.payable)).scalar() or 0
    
    # Total Orders (count of sales_hdr records)
    total_orders = db.query(func.count(SalesHdr.id)).scalar() or 0
    
    # Total Users (count of users)
    total_users = db.query(func.count(User.id)).scalar() or 0
    
    # Average Order Value
    avg_order_value = total_sales / total_orders if total_orders > 0 else 0
    
    # Total Products (count of active inventory items)
    total_products = db.query(func.count(InventoryItem.id)).filter(InventoryItem.is_active == True).scalar() or 0
    
    return {
        "total_sales": float(total_sales),
        "total_orders": total_orders,
        "total_users": total_users,
        "average_order_value": float(avg_order_value),
        "total_products": total_products,
    }


def get_low_stock_items(db: Session, limit: int = 5):
    """Get items with low stock based on settings threshold."""
    # Get low stock threshold from settings
    settings = db.query(Settings).first()
    threshold = settings.low_stock_threshold if settings else 10
    
    # Get items with stock at or below threshold
    items = (
        db.query(InventoryItem)
        .filter(InventoryItem.is_active == True)
        .filter(InventoryItem.in_stock <= threshold)
        .order_by(InventoryItem.in_stock.asc())
        .limit(limit)
        .all()
    )
    
    result = []
    for item in items:
        level = "critical" if item.in_stock == 0 else "warning" if item.in_stock <= threshold else "ok"
        result.append({
            "id": item.id,
            "name": item.name,
            "unit": item.unit,
            "stock": item.in_stock,
            "image_url": item.image_url,
            "level": level,
        })
    
    return result


def get_sales_overview(db: Session, days: int = 7):
    """Get sales data for the last N days for chart."""
    end_date = date.today()
    start_date = end_date - timedelta(days=days-1)
    
    # Query sales grouped by date
    sales_by_date = (
        db.query(
            func.date(SalesHdr.created_at).label('date'),
            func.sum(SalesHdr.payable).label('total')
        )
        .filter(func.date(SalesHdr.created_at) >= start_date)
        .filter(func.date(SalesHdr.created_at) <= end_date)
        .group_by(func.date(SalesHdr.created_at))
        .order_by(func.date(SalesHdr.created_at))
        .all()
    )
    
    # Create a map of all dates in range with 0 sales
    date_map = {}
    current = start_date
    while current <= end_date:
        date_map[current.strftime('%Y-%m-%d')] = 0
        current += timedelta(days=1)
    
    # Fill in actual sales data
    for sale_date, total in sales_by_date:
        date_key = sale_date.strftime('%Y-%m-%d')
        date_map[date_key] = float(total)
    
    return [
        {"date": d, "total": date_map[d]}
        for d in sorted(date_map.keys())
    ]


def get_top_selling_items(db: Session, limit: int = 5):
    """Get top selling items by quantity sold."""
    top_items = (
        db.query(
            SalesDtl.item_name,
            SalesDtl.item_id,
            func.sum(SalesDtl.qty).label('total_sold'),
            func.sum(SalesDtl.total).label('total_revenue')
        )
        .group_by(SalesDtl.item_name, SalesDtl.item_id)
        .order_by(func.sum(SalesDtl.qty).desc())
        .limit(limit)
        .all()
    )
    
    result = []
    for item in top_items:
        # Get image URL from inventory if item_id exists
        image_url = None
        if item.item_id:
            inventory_item = db.query(InventoryItem).filter(InventoryItem.id == item.item_id).first()
            if inventory_item:
                image_url = inventory_item.image_url
        
        result.append({
            "item_name": item.item_name,
            "total_sold": item.total_sold,
            "total_revenue": float(item.total_revenue),
            "image_url": image_url
        })
    
    return result


def get_recent_transactions(db: Session, limit: int = 5):
    """Get recent sales transactions."""
    recent_sales = (
        db.query(SalesHdr)
        .order_by(SalesHdr.created_at.desc())
        .limit(limit)
        .all()
    )
    
    return [
        {
            "id": sale.id,
            "bill_no": f"BILL-{sale.id}",
            "total_amount": float(sale.payable),
            "created_at": sale.created_at,
            "table_no": sale.table_no,
        }
        for sale in recent_sales
    ]
