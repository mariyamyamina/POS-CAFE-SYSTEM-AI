from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import logging

from app.core.database import get_db
from app.crud.settings import get_settings, update_settings
from app.schemas.settings import SettingsResponse, SettingsUpdate

logger = logging.getLogger(__name__)

router = APIRouter()


@router.get("/settings", response_model=SettingsResponse)
def get_current_settings(db: Session = Depends(get_db)):
    """Get current application settings."""
    try:
        return get_settings(db)
    except Exception as e:
        logger.error(f"Error getting settings: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/settings", response_model=SettingsResponse)
def update_current_settings(settings_update: SettingsUpdate, db: Session = Depends(get_db)):
    """Update application settings."""
    try:
        settings_data = settings_update.model_dump(exclude_unset=True)
        logger.info(f"Updating settings with data: {list(settings_data.keys())}")
        
        # Handle logo separately if it's too large
        if 'logo' in settings_data and settings_data['logo']:
            logo_length = len(settings_data['logo'])
            logger.info(f"Logo data length: {logo_length} characters")
            if logo_length > 1000000:  # 1MB limit
                raise HTTPException(status_code=400, detail="Logo image is too large")
        
        return update_settings(db, settings_data)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating settings: {e}")
        raise HTTPException(status_code=500, detail=str(e))
