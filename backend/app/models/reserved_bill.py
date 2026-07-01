from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, func
from sqlalchemy.dialects.postgresql import JSONB

from app.core.database import Base


class ReservedBill(Base):
    __tablename__ = "reserved_bills"

    id = Column(Integer, primary_key=True, index=True)

    table_number = Column(String(20), nullable=True)
    covers = Column(String(20), nullable=True)

    total = Column(Float, nullable=False, default=0.0)

    # Snapshot of the bill's line items at the moment of reservation, e.g.:
    # [{"id": 12, "name": "Cold Coffee", "quantity": 2, "unitPrice": 40.0, "image": "..."}]
    # Stored as JSONB rather than a separate item table since these are a
    # frozen snapshot, not live references that need to stay in sync with
    # InventoryItem (price/name changes after reservation shouldn't affect it).
    items = Column(JSONB, nullable=False, default=list)

    restored = Column(Boolean, nullable=False, default=False)  # soft "consumed" flag

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    restored_at = Column(DateTime(timezone=True), nullable=True)