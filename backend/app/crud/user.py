from sqlalchemy.orm import Session

from app.models.user import User
from app.core.security import hash_password


def get_user_by_username(db: Session, username: str) -> User | None:
    return db.query(User).filter(User.username == username).first()


def get_user_by_email(db: Session, email: str) -> User | None:
    return db.query(User).filter(User.email == email).first()


def get_user_by_id(db: Session, user_id: int) -> User | None:
    return db.query(User).filter(User.id == user_id).first()


def create_user(db: Session, *, full_name: str, username: str, email: str, password: str, role: str = "Cashier", is_active: bool = True, phone: str | None = None) -> User:
    user = User(
        full_name=full_name,
        username=username,
        email=email,
        hashed_password=hash_password(password),
        role=role,
        is_active=is_active,
        phone=phone,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def set_refresh_token(db: Session, user: User, refresh_token: str | None) -> None:
    user.refresh_token = refresh_token
    db.add(user)
    db.commit()


def get_all_users(db: Session, skip: int = 0, limit: int = 100) -> list[User]:
    return db.query(User).offset(skip).limit(limit).all()


def update_user(db: Session, user_id: int, *, full_name: str | None = None, username: str | None = None, 
                email: str | None = None, password: str | None = None, role: str | None = None, 
                is_active: bool | None = None, phone: str | None = None) -> User:
    user = get_user_by_id(db, user_id)
    if not user:
        raise ValueError("User not found")
    
    if full_name is not None:
        user.full_name = full_name
    if username is not None:
        user.username = username
    if email is not None:
        user.email = email
    if password is not None:
        user.hashed_password = hash_password(password)
    if role is not None:
        user.role = role
    if is_active is not None:
        user.is_active = is_active
    if phone is not None:
        user.phone = phone
    
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def delete_user(db: Session, user_id: int) -> None:
    user = get_user_by_id(db, user_id)
    if not user:
        raise ValueError("User not found")
    db.delete(user)
    db.commit()