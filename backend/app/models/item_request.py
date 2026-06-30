from sqlalchemy import Column, Integer, String, Date, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship

from app.core.database import Base


class ItemRequestHdr(Base):
    __tablename__ = "item_request_hdr"

    id = Column(Integer, primary_key=True, index=True)

    subject = Column(String(255), nullable=False)

    requested_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    requester = relationship("User")

    requested_date = Column(Date, nullable=False)
    expected_delivery = Column(Date, nullable=True)

    status = Column(String(20), nullable=False, default="Pending")  # Pending | On the way | Cancelled

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    details = relationship("ItemRequestDtl", back_populates="request", cascade="all, delete-orphan")

    @property
    def request_no(self):
        return f"REQ-{self.id}"


class ItemRequestDtl(Base):
    __tablename__ = "item_request_dtl"

    id = Column(Integer, primary_key=True, index=True)

    request_id = Column(Integer, ForeignKey("item_request_hdr.id"), nullable=False)
    request = relationship("ItemRequestHdr", back_populates="details")

    item_id = Column(Integer, ForeignKey("inventory_items.id"), nullable=False)
    item = relationship("InventoryItem")
    item_name = Column(String(150), nullable=False)  # snapshot at request time, mirrors sales_dtl pattern

    quantity = Column(Integer, nullable=False)
    item_date = Column(Date, nullable=True)