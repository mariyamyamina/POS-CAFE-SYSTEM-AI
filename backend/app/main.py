from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.core.config import settings
from app.core.database import Base, engine, SessionLocal
from app.api.auth import router as auth_router
from app.api.roles import router as roles_router
from app.crud.user import get_user_by_username, create_user
from app.crud.role import get_role_by_name, create_role

@asynccontextmanager
async def lifespan(app: FastAPI):
    # run startup script here
    db = SessionLocal()
    try:
        # Create default Admin role if it doesn't exist
        admin_role = get_role_by_name(db, "Admin")
        if not admin_role:
            create_role(db, name="Admin", permissions={
                "dashboard": True, 
                "billing": True, 
                "inventory": True, 
                "itemRequest": True, 
                "salesReport": True, 
                "users": True, 
                "settings": True
            })
        
        # Create default Admin user if it doesn't exist
        admin_user = get_user_by_username(db, "admin")
        if not admin_user:
            create_user(
                db, 
                full_name="Administrator", 
                username="admin", 
                email="admin@example.com", 
                password="Admin@1234", 
                phone="9876543210", 
                role="Admin"
            )
    finally:
        db.close()
    yield

app = FastAPI(title="POS Cafe AI API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.FRONTEND_ORIGIN,
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_origin_regex=r"https?://(localhost|127\.0\.0\.1)(:\\d+)?",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(roles_router)


@app.get("/health")
def health_check():
    return {"status": "ok"}