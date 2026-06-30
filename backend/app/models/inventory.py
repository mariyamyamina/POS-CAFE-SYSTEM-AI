from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship

from app.core.database import Base


class InventoryItem(Base):
    __tablename__ = "inventory_items"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String(150), nullable=False)
    description = Column(String(500), nullable=True)

    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False)
    category = relationship("Category")

    price = Column(Float, nullable=False, default=0.0)
    unit = Column(String(30), nullable=False)

    in_stock = Column(Integer, nullable=False, default=0)
    purchased = Column(Integer, nullable=False, default=0)
    sold = Column(Integer, nullable=False, default=0)

    supplier = Column(String(100), nullable=True)

    # Stored as a relative static path, e.g. "/uploads/inventory/<uuid>.jpg"
    # Frontend falls back to the default app logo icon if this is null.
    image_url = Column(String(255), nullable=True)

    is_active = Column(Boolean, nullable=False, default=True)  # soft delete flag

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())