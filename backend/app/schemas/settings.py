from pydantic import BaseModel
from typing import Optional


class SettingsBase(BaseModel):
    cafe_name: Optional[str] = None
    time_format: Optional[str] = None
    logo: Optional[str] = None
    low_stock_threshold: Optional[int] = None


class SettingsResponse(SettingsBase):
    id: int
    cafe_name: str
    time_format: str
    logo: Optional[str] = None
    low_stock_threshold: int
    
    class Config:
        from_attributes = True


class SettingsUpdate(SettingsBase):
    pass
