from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship

from app.core.database import Base


class SalesHdr(Base):
    __tablename__ = "sales_hdr"

    id = Column(Integer, primary_key=True, index=True)

    table_no = Column(String(20), nullable=True)
    cover_no = Column(Integer, nullable=True)

    total_amt = Column(Float, nullable=False)   # pre-GST total
    gst = Column(Float, nullable=False)          # GST amount
    payable = Column(Float, nullable=False)      # total_amt + gst
    tender = Column(Float, nullable=False)
    change_amt = Column(Float, nullable=False)

    cashier_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    cashier = relationship("User")

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    details = relationship("SalesDtl", back_populates="sale", cascade="all, delete-orphan")

    @property
    def bill_no(self):
        return f"BILL-{self.id}"


class SalesDtl(Base):
    __tablename__ = "sales_dtl"

    id = Column(Integer, primary_key=True, index=True)

    sale_id = Column(Integer, ForeignKey("sales_hdr.id"), nullable=False)
    sale = relationship("SalesHdr", back_populates="details")

    item_id = Column(Integer, ForeignKey("inventory_items.id"), nullable=True)  # nullable: item could be deleted later, sale record still valid
    item_name = Column(String(150), nullable=False)  # snapshot at sale time — survives item renames/deletion

    qty = Column(Integer, nullable=False)
    unit_price = Column(Float, nullable=False)
    total = Column(Float, nullable=False)  # qty * unit_price, stored to avoid recompute drift