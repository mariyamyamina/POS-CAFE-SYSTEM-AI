import os
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.core.config import settings
from app.core.database import Base, engine, SessionLocal
from app.api import reserved_bill

# ---------------------------
# Import ALL models
# ---------------------------
# These imports are required so SQLAlchemy registers every table.
# Adjust the import paths if your models are in different files.

try:
    from app.models.user import User
except Exception:
    pass

try:
    from app.models.role import Role
except Exception:
    pass

try:
    from app.models.category import Category
except Exception:
    pass

try:
    from app.models.inventory import InventoryItem
except Exception:
    pass

try:
    from app.models.sales import SalesHdr, SalesDtl
except Exception:
    pass

try:
    from app.models.item_request import ItemRequestHdr, ItemRequestDtl
except Exception:
    pass


from app.api.auth import router as auth_router
from app.api.roles import router as roles_router
from app.api.settings import router as settings_router
from app.api.categories import router as categories_router
from app.api.inventory import router as inventory_router
from app.api.sales import router as sales_router
from app.api.dashboard import router as dashboard_router
from app.api import item_request

from app.crud.user import get_user_by_username, create_user
from app.crud.role import get_role_by_name, create_role


@asynccontextmanager
async def lifespan(app: FastAPI):

    # Create all database tables
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()

    try:
        # Create default Admin role
        admin_role = get_role_by_name(db, "Admin")

        if not admin_role:
            create_role(
                db,
                name="Admin",
                permissions={
                    "dashboard": True,
                    "billing": True,
                    "inventory": True,
                    "itemRequest": True,
                    "salesReport": True,
                    "users": True,
                    "settings": True,
                },
            )

        # Create default Admin user
        admin_user = get_user_by_username(db, "admin")

        if not admin_user:
            create_user(
                db,
                full_name="Administrator",
                username="admin",
                email="admin@example.com",
                password="Admin@1234",
                phone="9876543210",
                role="Admin",
            )

    finally:
        db.close()

    yield


app = FastAPI(
    title="POS Cafe AI API",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.FRONTEND_ORIGIN,
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_origin_regex=r"https?://(localhost|127\.0\.0\.1)(:\d+)?",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(auth_router)
app.include_router(roles_router)
app.include_router(settings_router)
app.include_router(categories_router)
app.include_router(inventory_router)
app.include_router(sales_router)
app.include_router(dashboard_router)
app.include_router(item_request.router, prefix="/api", tags=["Item Request"])
app.include_router(reserved_bill.router, tags=["Reserved Bills"])

# Static uploads
os.makedirs("uploads/inventory", exist_ok=True)

app.mount(
    "/uploads",
    StaticFiles(directory="uploads"),
    name="uploads",
)


@app.get("/health")
def health_check():
    return {"status": "ok"}