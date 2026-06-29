from sqlalchemy.orm import Session
from app.models.settings import Settings


def get_settings(db: Session) -> Settings:
    """Get the first (and only) settings record, or create default if none exists."""
    settings = db.query(Settings).first()
    if not settings:
        settings = Settings(
            cafe_name="POS Cafe",
            time_format="hh:mm A",
            low_stock_threshold=10
        )
        db.add(settings)
        db.commit()
        db.refresh(settings)
    return settings


def update_settings(db: Session, settings_data: dict) -> Settings:
    """Update the settings record."""
    settings = get_settings(db)
    
    for key, value in settings_data.items():
        if hasattr(settings, key) and value is not None:
            setattr(settings, key, value)
    
    db.commit()
    db.refresh(settings)
    return settings
