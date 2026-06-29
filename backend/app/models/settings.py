from sqlalchemy import Column, Integer, String, Text, DateTime, func, LargeBinary
from sqlalchemy.orm import declarative_base

from app.core.database import Base


class Settings(Base):
    __tablename__ = "settings"

    id = Column(Integer, primary_key=True, index=True)
    cafe_name = Column(String(255), nullable=False, default="POS Cafe")
    time_format = Column(String(50), nullable=False, default="hh:mm A")
    logo = Column(Text, nullable=True)  # Store logo as base64 string
    low_stock_threshold = Column(Integer, nullable=False, default=10)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
