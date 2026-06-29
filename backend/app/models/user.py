from sqlalchemy import Column, Integer, String, Boolean, DateTime, func, ForeignKey
from sqlalchemy.orm import relationship

from app.core.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column("full_name", String(150), nullable=False)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column("hashed_password", String(255), nullable=False)

    role = Column(String(50), ForeignKey("roles.name"), nullable=False, default="Cashier")
    role_data = relationship("Role", foreign_keys=[role])
    is_active = Column(Boolean, nullable=False, default=True)
    phone = Column(String(20), nullable=True)

    @property
    def permissions(self):
        return self.role_data.permissions if self.role_data else {}

    # Stores the latest refresh token so /auth/refresh and /auth/logout
    # can invalidate it server-side instead of trusting a stateless JWT forever.
    refresh_token = Column(String(512), nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())