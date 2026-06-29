from pydantic import BaseModel, ConfigDict
from typing import Dict, Any

class RoleBase(BaseModel):
    name: str
    permissions: Dict[str, bool]

class RoleCreate(RoleBase):
    pass

class RoleUpdate(BaseModel):
    name: str | None = None
    permissions: Dict[str, bool] | None = None

class RoleOut(RoleBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
