from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.crud.category import (
    get_categories, 
    get_category, 
    create_category, 
    update_category, 
    delete_category
)
from app.schemas.category import CategoryCreate, CategoryUpdate, CategoryResponse

router = APIRouter()


@router.get("/categories", response_model=List[CategoryResponse])
def get_all_categories(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get all categories."""
    return get_categories(db, skip=skip, limit=limit)


@router.get("/categories/{category_id}", response_model=CategoryResponse)
def get_category_by_id(category_id: int, db: Session = Depends(get_db)):
    """Get a single category by ID."""
    category = get_category(db, category_id)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return category


@router.post("/categories", response_model=CategoryResponse)
def create_new_category(category: CategoryCreate, db: Session = Depends(get_db)):
    """Create a new category."""
    # Check if category with same name already exists
    from app.crud.category import get_category_by_name
    existing = get_category_by_name(db, category.name)
    if existing:
        raise HTTPException(status_code=400, detail="Category with this name already exists")
    
    return create_category(db, name=category.name, icon=category.icon, description=category.description)


@router.put("/categories/{category_id}", response_model=CategoryResponse)
def update_existing_category(category_id: int, category: CategoryUpdate, db: Session = Depends(get_db)):
    """Update an existing category."""
    updated = update_category(db, category_id, name=category.name, icon=category.icon, description=category.description)
    if not updated:
        raise HTTPException(status_code=404, detail="Category not found")
    return updated


@router.delete("/categories/{category_id}")
def delete_existing_category(category_id: int, db: Session = Depends(get_db)):
    """Delete a category."""
    deleted = delete_category(db, category_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Category not found")
    return {"message": "Category deleted successfully"}
