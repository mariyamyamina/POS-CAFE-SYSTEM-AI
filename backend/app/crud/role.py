from sqlalchemy.orm import Session
from app.models.role import Role

def get_role_by_name(db: Session, name: str) -> Role | None:
    return db.query(Role).filter(Role.name == name).first()

def get_role_by_id(db: Session, role_id: int) -> Role | None:
    return db.query(Role).filter(Role.id == role_id).first()

def get_all_roles(db: Session, skip: int = 0, limit: int = 100) -> list[Role]:
    return db.query(Role).offset(skip).limit(limit).all()

def create_role(db: Session, *, name: str, permissions: dict) -> Role:
    role = Role(name=name, permissions=permissions)
    db.add(role)
    db.commit()
    db.refresh(role)
    return role

def update_role(db: Session, role_id: int, *, name: str | None = None, permissions: dict | None = None) -> Role:
    role = get_role_by_id(db, role_id)
    if not role:
        raise ValueError("Role not found")
    
    if name is not None:
        role.name = name
    if permissions is not None:
        role.permissions = permissions
        
    db.add(role)
    db.commit()
    db.refresh(role)
    return role

def delete_role(db: Session, role_id: int) -> None:
    role = get_role_by_id(db, role_id)
    if not role:
        raise ValueError("Role not found")
    db.delete(role)
    db.commit()
