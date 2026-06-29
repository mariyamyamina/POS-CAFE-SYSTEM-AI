from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.crud.role import (
    get_all_roles,
    get_role_by_id,
    get_role_by_name,
    create_role,
    update_role,
    delete_role,
)
from app.schemas.role import RoleCreate, RoleUpdate, RoleOut
from app.api.deps import get_current_user, require_admin
from app.models.user import User

router = APIRouter(prefix="/auth/roles", tags=["roles"])

@router.get("", response_model=list[RoleOut])
def read_roles(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return get_all_roles(db)

@router.post("", response_model=RoleOut, status_code=status.HTTP_201_CREATED)
def create_new_role(payload: RoleCreate, current_user: User = Depends(require_admin), db: Session = Depends(get_db)):
    if get_role_by_name(db, payload.name):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Role name already exists")
    
    return create_role(db, name=payload.name, permissions=payload.permissions)

@router.put("/{role_id}", response_model=RoleOut)
def update_existing_role(role_id: int, payload: RoleUpdate, current_user: User = Depends(require_admin), db: Session = Depends(get_db)):
    if payload.name:
        existing_role = get_role_by_name(db, payload.name)
        if existing_role and existing_role.id != role_id:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Role name already exists")
    try:
        return update_role(db, role_id, name=payload.name, permissions=payload.permissions)
    except ValueError:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Role not found")

@router.delete("/{role_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_existing_role(role_id: int, current_user: User = Depends(require_admin), db: Session = Depends(get_db)):
    role = get_role_by_id(db, role_id)
    if not role:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Role not found")
    if role.name == "Admin":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Cannot delete Admin role")
        
    delete_role(db, role_id)
    return None
