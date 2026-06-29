from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import (
    verify_password,
    create_access_token,
    create_refresh_token,
    decode_token,
    JWTError,
)
from app.crud.user import (
    get_user_by_username,
    get_user_by_email,
    get_user_by_id,
    create_user,
    set_refresh_token,
    get_all_users,
    update_user,
    delete_user,
)
from app.schemas.auth import (
    RegisterRequest,
    AdminCreateUserRequest,
    LoginRequest,
    TokenPair,
    AccessTokenOut,
    RefreshRequest,
    UserOut,
    UpdateUserRequest,
)
from app.api.deps import get_current_user
from app.models.user import User

router = APIRouter(prefix="/auth", tags=["auth"])


def _issue_token_pair(db: Session, user: User) -> TokenPair:
    access_token = create_access_token(user.id)
    refresh_token = create_refresh_token(user.id)
    set_refresh_token(db, user, refresh_token)
    return TokenPair(
        access_token=access_token,
        refresh_token=refresh_token,
        user=UserOut.model_validate(user),
    )


@router.post("/register", response_model=TokenPair, status_code=status.HTTP_201_CREATED)
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    if get_user_by_username(db, payload.username):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Username is already taken")
    if get_user_by_email(db, payload.email):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email is already registered")

    user = create_user(
        db,
        full_name=payload.full_name,
        username=payload.username,
        email=payload.email,
        password=payload.password,
    )
    return _issue_token_pair(db, user)


@router.post("/login", response_model=TokenPair)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = get_user_by_username(db, payload.username)
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
        )
    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="User is inactive")

    return _issue_token_pair(db, user)


@router.post("/refresh", response_model=AccessTokenOut)
def refresh_access_token(payload: RefreshRequest, db: Session = Depends(get_db)):
    invalid_exc = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or expired refresh token",
    )

    try:
        decoded = decode_token(payload.refresh_token)
    except JWTError:
        raise invalid_exc

    if decoded.get("type") != "refresh":
        raise invalid_exc

    user_id = decoded.get("sub")
    if user_id is None:
        raise invalid_exc

    user = get_user_by_id(db, int(user_id))
    if not user or user.refresh_token != payload.refresh_token:
        raise invalid_exc

    new_access_token = create_access_token(user.id)
    return AccessTokenOut(access_token=new_access_token)


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
def logout(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    set_refresh_token(db, current_user, None)
    return None


@router.get("/me", response_model=UserOut)
def read_current_user(current_user: User = Depends(get_current_user)):
    return current_user


@router.get("/users", response_model=list[UserOut])
def get_users(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return get_all_users(db)


@router.post("/users", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def create_new_user(payload: AdminCreateUserRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if get_user_by_username(db, payload.username):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Username is already taken")
    if get_user_by_email(db, payload.email):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email is already registered")

    user = create_user(
        db,
        full_name=payload.full_name,
        username=payload.username,
        email=payload.email,
        password=payload.password,
        role=getattr(payload, "role", "Cashier"),
        is_active=getattr(payload, "is_active", True),
        phone=payload.phone,
    )
    return user


@router.put("/users/{user_id}", response_model=UserOut)
def update_existing_user(user_id: int, payload: UpdateUserRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Check if username is taken by another user
    if payload.username:
        existing_user = get_user_by_username(db, payload.username)
        if existing_user and existing_user.id != user_id:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Username is already taken")
    
    # Check if email is taken by another user
    if payload.email:
        existing_user = get_user_by_email(db, payload.email)
        if existing_user and existing_user.id != user_id:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email is already registered")

    user = update_user(
        db,
        user_id,
        full_name=payload.full_name,
        username=payload.username,
        email=payload.email,
        password=payload.password,
        role=payload.role,
        is_active=payload.is_active,
        phone=payload.phone,
    )
    return user


@router.delete("/users/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_existing_user(user_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Prevent deleting the current user
    if current_user.id == user_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Cannot delete your own account")
    
    delete_user(db, user_id)
    return None