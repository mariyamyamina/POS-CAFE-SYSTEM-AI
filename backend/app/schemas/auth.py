from pydantic import BaseModel, EmailStr, Field, ConfigDict
from datetime import datetime


class RegisterRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    full_name: str = Field(alias="fullName", min_length=2, max_length=150)
    username: str = Field(min_length=3, max_length=50, pattern=r"^[a-zA-Z0-9_.]+$")
    email: EmailStr
    password: str = Field(min_length=6, max_length=128)
    phone: str | None = None


class AdminCreateUserRequest(RegisterRequest):
    role: str = "Cashier"
    is_active: bool = Field(True, alias="isActive")


class LoginRequest(BaseModel):
    username: str
    password: str


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

    id: int
    full_name: str = Field(alias="fullName")
    username: str
    email: EmailStr
    role: str
    is_active: bool = Field(alias="isActive")
    phone: str | None = None
    created_at: datetime


class TokenPair(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: UserOut


class AccessTokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"


class RefreshRequest(BaseModel):
    refresh_token: str


class UpdateUserRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    full_name: str | None = Field(None, alias="fullName", min_length=2, max_length=150)
    username: str | None = Field(None, min_length=3, max_length=50, pattern=r"^[a-zA-Z0-9_.]+$")
    email: EmailStr | None = None
    password: str | None = Field(None, min_length=6, max_length=128)
    role: str | None = None
    is_active: bool | None = Field(None, alias="isActive")
    phone: str | None = None