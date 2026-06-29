from sqlalchemy.orm import Session
from app.models.category import Category


def get_categories(db: Session, skip: int = 0, limit: int = 100):
    """Get all categories."""
    return db.query(Category).offset(skip).limit(limit).all()


def get_category(db: Session, category_id: int):
    """Get a single category by ID."""
    return db.query(Category).filter(Category.id == category_id).first()


def get_category_by_name(db: Session, name: str):
    """Get a category by name."""
    return db.query(Category).filter(Category.name == name).first()


def create_category(db: Session, name: str, icon: str = "category", description: str = None):
    """Create a new category."""
    category = Category(name=name, icon=icon, description=description)
    db.add(category)
    db.commit()
    db.refresh(category)
    return category


def update_category(db: Session, category_id: int, name: str = None, icon: str = None, description: str = None):
    """Update an existing category."""
    category = get_category(db, category_id)
    if not category:
        return None
    
    if name is not None:
        category.name = name
    if icon is not None:
        category.icon = icon
    if description is not None:
        category.description = description
    
    db.commit()
    db.refresh(category)
    return category


def delete_category(db: Session, category_id: int):
    """Delete a category."""
    category = get_category(db, category_id)
    if not category:
        return False
    
    db.delete(category)
    db.commit()
    return True
