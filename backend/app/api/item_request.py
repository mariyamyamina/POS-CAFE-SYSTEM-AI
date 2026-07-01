from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.crud.item_request import (
    create_item_request,
    get_item_request,
    get_item_requests,
    update_item_request,
    delete_item_request,
    receive_item_request,
)
from app.crud.inventory import get_item as get_inventory_item
from app.schemas.item_request import ItemRequestCreate, ItemRequestUpdate, ItemRequestResponse

router = APIRouter()


def _to_response(hdr) -> dict:
    return {
        "id": hdr.id,
        "request_no": hdr.request_no,
        "subject": hdr.subject,
        "requested_by": hdr.requested_by,
        "requested_by_name": hdr.requester.full_name if hdr.requester else None,
        "requested_date": hdr.requested_date,
        "expected_delivery": hdr.expected_delivery,
        "status": hdr.status,
        "created_at": hdr.created_at,
        "updated_at": hdr.updated_at,
        "items": hdr.details,
    }


def _validate_items_exist(db: Session, items):
    """Ensures every item_id in the request actually exists in inventory before saving."""
    for line in items:
        if not get_inventory_item(db, line.item_id):
            raise HTTPException(status_code=400, detail=f"Inventory item {line.item_id} does not exist")


@router.post("/item-requests/save", response_model=ItemRequestResponse)
def save_item_request_draft(
    request_data: ItemRequestCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    'Save' button — creates the request with status=Pending.
    """
    if not request_data.items:
        raise HTTPException(status_code=400, detail="Request must include at least one item")
    _validate_items_exist(db, request_data.items)

    hdr = create_item_request(db, request_data, requested_by=current_user.id, status="Pending")
    return _to_response(hdr)


@router.post("/item-requests/submit", response_model=ItemRequestResponse)
def submit_item_request(
    request_data: ItemRequestCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    'Submit Request' button — creates the request with status="On the way".
    """
    if not request_data.items:
        raise HTTPException(status_code=400, detail="Request must include at least one item")
    _validate_items_exist(db, request_data.items)

    hdr = create_item_request(db, request_data, requested_by=current_user.id, status="On the way")
    return _to_response(hdr)


@router.get("/item-requests/{request_id}", response_model=ItemRequestResponse)
def get_item_request_by_id(request_id: int, current_user = Depends(get_current_user), db: Session = Depends(get_db)):
    hdr = get_item_request(db, request_id)
    if not hdr:
        raise HTTPException(status_code=404, detail="Item request not found")
    return _to_response(hdr)


@router.get("/item-requests", response_model=List[ItemRequestResponse])
def get_all_item_requests(current_user = Depends(get_current_user), skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    hdrs = get_item_requests(db, skip=skip, limit=limit)
    return [_to_response(h) for h in hdrs]


@router.put("/item-requests/{request_id}", response_model=ItemRequestResponse)
def update_existing_item_request(
    request_id: int,
    request_data: ItemRequestUpdate,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if request_data.items is not None:
        _validate_items_exist(db, request_data.items)

    updated = update_item_request(db, request_id, request_data)
    if not updated:
        raise HTTPException(status_code=404, detail="Item request not found")
    return _to_response(updated)


@router.delete("/item-requests/{request_id}")
def delete_existing_item_request(request_id: int, current_user = Depends(get_current_user), db: Session = Depends(get_db)):
    deleted = delete_item_request(db, request_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Item request not found")
    return {"message": "Item request deleted successfully"}

@router.put("/item-requests/{request_id}/receive", response_model=ItemRequestResponse)
def receive_existing_item_request(
    request_id: int,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    hdr = receive_item_request(db, request_id)

    if not hdr:
        raise HTTPException(status_code=404, detail="Item request not found")

    return _to_response(hdr)