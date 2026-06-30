from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.crud.inventory import (
    get_items,
    get_item,
    create_item,
    update_item,
    soft_delete_item,
    save_item_image,
    delete_item_image_file,
    to_response_dict,
)
from app.crud.category import get_category
from app.crud.settings import get_settings  # existing settings CRUD, holds low_stock_threshold
from app.schemas.inventory import InventoryItemResponse

router = APIRouter()


def _low_stock_threshold(db: Session) -> int:
    """Reads the configured low-stock threshold from Settings (falls back to 10)."""
    settings = get_settings(db)
    return getattr(settings, "low_stock_threshold", 10) if settings else 10


@router.get("/api/inventory", response_model=List[InventoryItemResponse])
def get_all_items(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get all active inventory items."""
    threshold = _low_stock_threshold(db)
    items = get_items(db, skip=skip, limit=limit)
    return [to_response_dict(item, threshold) for item in items]


@router.get("/api/inventory/{item_id}", response_model=InventoryItemResponse)
def get_item_by_id(item_id: int, db: Session = Depends(get_db)):
    """Get a single inventory item by ID."""
    item = get_item(db, item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Inventory item not found")
    threshold = _low_stock_threshold(db)
    return to_response_dict(item, threshold)


@router.post("/api/inventory", response_model=InventoryItemResponse)
def create_new_item(
    name: str = Form(...),
    category_id: int = Form(...),
    price: float = Form(...),
    unit: str = Form(...),
    description: Optional[str] = Form(None),
    in_stock: int = Form(0),
    purchased: int = Form(0),
    supplier: Optional[str] = Form(None),
    image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
):
    """
    Create a new inventory item. Sent as multipart/form-data since an
    optional image file travels alongside the regular fields.
    """
    category = get_category(db, category_id)
    if not category:
        raise HTTPException(status_code=400, detail="Selected category does not exist")

    image_url = None
    if image is not None and image.filename:
        try:
            image_url = save_item_image(image)
        except ValueError as exc:
            raise HTTPException(status_code=400, detail=str(exc))

    item = create_item(
        db,
        name=name,
        category_id=category_id,
        price=price,
        unit=unit,
        description=description,
        in_stock=in_stock,
        purchased=purchased,
        supplier=supplier,
        image_url=image_url,
    )
    threshold = _low_stock_threshold(db)
    return to_response_dict(item, threshold)


@router.put("/api/inventory/{item_id}", response_model=InventoryItemResponse)
def update_existing_item(
    item_id: int,
    name: Optional[str] = Form(None),
    category_id: Optional[int] = Form(None),
    price: Optional[float] = Form(None),
    unit: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    in_stock: Optional[int] = Form(None),
    purchased: Optional[int] = Form(None),
    supplier: Optional[str] = Form(None),
    image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
):
    """Update an existing inventory item. Only provided fields are changed."""
    existing = get_item(db, item_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Inventory item not found")

    if category_id is not None:
        category = get_category(db, category_id)
        if not category:
            raise HTTPException(status_code=400, detail="Selected category does not exist")

    image_url = None
    if image is not None and image.filename:
        try:
            image_url = save_item_image(image)
        except ValueError as exc:
            raise HTTPException(status_code=400, detail=str(exc))
        # Clean up the old file now that we have a successfully saved replacement
        delete_item_image_file(existing.image_url)

    updated = update_item(
        db,
        item_id,
        name=name,
        description=description,
        category_id=category_id,
        price=price,
        unit=unit,
        in_stock=in_stock,
        purchased=purchased,
        supplier=supplier,
        image_url=image_url,
    )
    threshold = _low_stock_threshold(db)
    return to_response_dict(updated, threshold)


@router.delete("/api/inventory/{item_id}")
def delete_existing_item(item_id: int, db: Session = Depends(get_db)):
    """Soft delete an inventory item (sets is_active=False, row is kept)."""
    deleted = soft_delete_item(db, item_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Inventory item not found")
    return {"message": "Inventory item deleted successfully"}