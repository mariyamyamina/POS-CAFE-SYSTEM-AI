from sqlalchemy import (
    Column,
    Integer,
    String,
    Numeric,
    DateTime,
    ForeignKey,
    func,
)
from sqlalchemy.orm import relationship

from app.core.database import Base


class SalesHdr(Base):
    __tablename__ = "sales_hdr"

    id = Column(Integer, primary_key=True, index=True)

    table_no = Column(String(20), nullable=True)
    cover_no = Column(Integer, nullable=True)

    total_amt = Column(Numeric(10, 2), nullable=False)
    gst = Column(Numeric(10, 2), nullable=False)
    payable = Column(Numeric(10, 2), nullable=False)
    tender = Column(Numeric(10, 2), nullable=False)
    change_amt = Column(Numeric(10, 2), nullable=False)

    cashier_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    cashier = relationship("User")

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    details = relationship(
        "SalesDtl",
        back_populates="sale",
        cascade="all, delete-orphan",
    )

    @property
    def bill_no(self):
        return f"BILL-{self.id}"


class SalesDtl(Base):
    __tablename__ = "sales_dtl"

    id = Column(Integer, primary_key=True, index=True)

    sale_id = Column(Integer, ForeignKey("sales_hdr.id"), nullable=False)
    sale = relationship("SalesHdr", back_populates="details")

    item_id = Column(
        Integer,
        ForeignKey("inventory_items.id"),
        nullable=True,
    )

    item_name = Column(String(150), nullable=False)

    qty = Column(Integer, nullable=False)

    unit_price = Column(Numeric(10, 2), nullable=False)
    total = Column(Numeric(10, 2), nullable=False)