import os
import uuid
import shutil
from typing import Optional

from fastapi import UploadFile
from sqlalchemy.orm import Session, joinedload

from app.models.inventory import InventoryItem

UPLOAD_DIR = "uploads/inventory"
ALLOWED_EXTENSIONS = {".png", ".jpg", ".jpeg", ".webp"}
MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024  # 2MB, matches frontend hint text


def compute_status(in_stock: int, low_stock_threshold: int) -> str:
    """Mirrors the frontend's stock-tone logic in InventoryTable.jsx."""
    if in_stock == 0:
        return "Out of Stock"
    if in_stock <= low_stock_threshold:
        return "Low Stock"
    return "In Stock"


def to_response_dict(item: InventoryItem, low_stock_threshold: int) -> dict:
    """Builds the flattened response dict expected by InventoryItemResponse."""
    return {
        "id": item.id,
        "name": item.name,
        "description": item.description,
        "category_id": item.category_id,
        "category_name": item.category.name if item.category else None,
        "price": item.price,
        "unit": item.unit,
        "in_stock": item.in_stock,
        "purchased": item.purchased,
        "sold": item.sold,
        "supplier": item.supplier,
        "image_url": item.image_url,
        "status": compute_status(item.in_stock, low_stock_threshold),
        "is_active": item.is_active,
        "created_at": item.created_at,
        "updated_at": item.updated_at,
    }


def get_items(db: Session, skip: int = 0, limit: int = 100, include_inactive: bool = False):
    """Get all inventory items (active only by default, since this is soft-delete)."""
    query = db.query(InventoryItem).options(joinedload(InventoryItem.category))
    if not include_inactive:
        query = query.filter(InventoryItem.is_active == True)  # noqa: E712
    return query.order_by(InventoryItem.created_at.desc()).offset(skip).limit(limit).all()


def get_item(db: Session, item_id: int, include_inactive: bool = False):
    """Get a single inventory item by ID."""
    query = db.query(InventoryItem).options(joinedload(InventoryItem.category)).filter(InventoryItem.id == item_id)
    if not include_inactive:
        query = query.filter(InventoryItem.is_active == True)  # noqa: E712
    return query.first()


def create_item(
    db: Session,
    name: str,
    category_id: int,
    price: float,
    unit: str,
    description: Optional[str] = None,
    in_stock: int = 0,
    purchased: int = 0,
    supplier: Optional[str] = None,
    image_url: Optional[str] = None,
):
    """Create a new inventory item."""
    item = InventoryItem(
        name=name,
        description=description,
        category_id=category_id,
        price=price,
        unit=unit,
        in_stock=in_stock,
        purchased=purchased,
        sold=0,  # always starts at 0, only updated later by the Sales module
        supplier=supplier,
        image_url=image_url,
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


def update_item(
    db: Session,
    item_id: int,
    name: Optional[str] = None,
    description: Optional[str] = None,
    category_id: Optional[int] = None,
    price: Optional[float] = None,
    unit: Optional[str] = None,
    in_stock: Optional[int] = None,
    purchased: Optional[int] = None,
    supplier: Optional[str] = None,
    image_url: Optional[str] = None,
):
    """Update an existing inventory item. Only provided fields are changed."""
    item = get_item(db, item_id)
    if not item:
        return None

    if name is not None:
        item.name = name
    if description is not None:
        item.description = description
    if category_id is not None:
        item.category_id = category_id
    if price is not None:
        item.price = price
    if unit is not None:
        item.unit = unit
    if in_stock is not None:
        item.in_stock = in_stock
    if purchased is not None:
        item.purchased = purchased
    if supplier is not None:
        item.supplier = supplier
    if image_url is not None:
        item.image_url = image_url

    db.commit()
    db.refresh(item)
    return item


def soft_delete_item(db: Session, item_id: int):
    """Soft delete: flips is_active to False instead of removing the row."""
    item = get_item(db, item_id)
    if not item:
        return False

    item.is_active = False
    db.commit()
    return True


def save_item_image(file: UploadFile) -> str:
    """
    Saves an uploaded image to disk under UPLOAD_DIR with a random filename
    (avoids collisions/overwrites) and returns the relative URL path to store
    in InventoryItem.image_url.

    Raises ValueError on bad extension or oversized file so the router can
    turn that into a clean 400 response.
    """
    ext = os.path.splitext(file.filename or "")[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise ValueError(f"Unsupported file type '{ext}'. Allowed: PNG, JPG, JPEG, WEBP.")

    os.makedirs(UPLOAD_DIR, exist_ok=True)

    filename = f"{uuid.uuid4().hex}{ext}"
    filepath = os.path.join(UPLOAD_DIR, filename)

    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    if os.path.getsize(filepath) > MAX_FILE_SIZE_BYTES:
        os.remove(filepath)
        raise ValueError("Image exceeds 2MB size limit.")

    return f"/{UPLOAD_DIR}/{filename}"


def delete_item_image_file(image_url: Optional[str]):
    """Best-effort removal of an old image file when it's replaced. Never raises."""
    if not image_url:
        return
    filepath = image_url.lstrip("/")
    try:
        if os.path.isfile(filepath):
            os.remove(filepath)
    except OSError:
        pass