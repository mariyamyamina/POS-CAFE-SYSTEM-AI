from typing import Optional, List

from sqlalchemy.orm import Session, joinedload

from app.models.item_request import ItemRequestHdr, ItemRequestDtl
from app.schemas.item_request import ItemRequestCreate, ItemRequestUpdate
from datetime import date
from app.models.inventory import InventoryItem


def create_item_request(
    db: Session,
    request_data: ItemRequestCreate,
    requested_by: int,
    status: str,
) -> ItemRequestHdr:
    """
    Creates an item_request_hdr row plus its item_request_dtl line items in
    one transaction. `status` is passed explicitly by the router based on
    which button (Save -> Pending, Submit -> On the way) triggered this.
    """
    hdr = ItemRequestHdr(
        subject=request_data.subject,
        requested_by=requested_by,
        requested_date=request_data.requested_date,
        expected_delivery=request_data.expected_delivery,
        status=status,
    )
    db.add(hdr)
    db.flush()  # assigns hdr.id without committing, needed for request_id FK below

    for line in request_data.items:
        db.add(ItemRequestDtl(
            request_id=hdr.id,
            item_id=line.item_id,
            item_name=line.item_name,
            quantity=line.quantity,
            item_date=line.item_date,
        ))

    db.commit()
    db.refresh(hdr)
    return hdr


def get_item_request(db: Session, request_id: int) -> Optional[ItemRequestHdr]:
    return (
        db.query(ItemRequestHdr)
        .options(joinedload(ItemRequestHdr.details), joinedload(ItemRequestHdr.requester))
        .filter(ItemRequestHdr.id == request_id)
        .first()
    )


def get_item_requests(db: Session, skip: int = 0, limit: int = 100):
    requests = (
        db.query(ItemRequestHdr)
        .options(
            joinedload(ItemRequestHdr.details),
            joinedload(ItemRequestHdr.requester)
        )
        .order_by(ItemRequestHdr.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )

    today = date.today()
    updated = False

    for req in requests:
        # Only process requests that are still on the way
        if (
            req.status == "On the way"
            and req.expected_delivery
            and req.expected_delivery <= today
        ):
            req.status = "Received"

            # Add requested quantity into inventory
            for line in req.details:
                inventory_item = (
                    db.query(InventoryItem)
                    .filter(InventoryItem.id == line.item_id)
                    .first()
                )

                if inventory_item:
                    inventory_item.in_stock = (inventory_item.in_stock or 0) + line.quantity

            updated = True

    if updated:
        db.commit()

    return requests


def update_item_request(
    db: Session,
    request_id: int,
    request_data: ItemRequestUpdate,
) -> Optional[ItemRequestHdr]:

    hdr = get_item_request(db, request_id)
    if not hdr:
        return None

    # Don't allow editing after the request is already completed or cancelled
    if hdr.status in ["Received", "Cancelled"]:
        return hdr

    if request_data.subject is not None:
        hdr.subject = request_data.subject

    if request_data.requested_date is not None:
        hdr.requested_date = request_data.requested_date

    if request_data.expected_delivery is not None:
        hdr.expected_delivery = request_data.expected_delivery

    if request_data.status is not None:
        hdr.status = request_data.status

    # Update line items
    if request_data.items is not None:
        existing_by_id = {line.id: line for line in hdr.details}
        incoming_ids = {line.id for line in request_data.items if line.id is not None}

        # Delete removed items
        for existing_id, existing_line in list(existing_by_id.items()):
            if existing_id not in incoming_ids:
                db.delete(existing_line)

        # Update existing / Add new
        for line in request_data.items:
            if line.id is not None and line.id in existing_by_id:
                target = existing_by_id[line.id]
                target.item_id = line.item_id
                target.item_name = line.item_name
                target.quantity = line.quantity
                target.item_date = line.item_date
            else:
                db.add(
                    ItemRequestDtl(
                        request_id=hdr.id,
                        item_id=line.item_id,
                        item_name=line.item_name,
                        quantity=line.quantity,
                        item_date=line.item_date,
                    )
                )

    # Automatically receive when expected delivery is today or earlier
    if (
        hdr.status == "On the way"
        and hdr.expected_delivery
        and hdr.expected_delivery <= date.today()
    ):

        hdr.status = "Received"

        # Add requested quantities into inventory
        for detail in hdr.details:

            inventory = (
                db.query(InventoryItem)
                .filter(InventoryItem.id == detail.item_id)
                .first()
            )

            if inventory:
               inventory.in_stock = (inventory.in_stock or 0) + detail.quantity

    db.commit()
    db.refresh(hdr)

    return hdr
   
def delete_item_request(db: Session, request_id: int) -> bool:
    hdr = get_item_request(db, request_id)
    if not hdr:
        return False
    db.delete(hdr)  # cascade="all, delete-orphan" on details handles line cleanup
    db.commit()
    return True

def receive_item_request(db: Session, request_id: int):
    hdr = get_item_request(db, request_id)

    if not hdr:
        return None

    if hdr.status == "Received":
        return hdr

    if hdr.status != "On the way":
        return hdr

    hdr.status = "Received"

    for detail in hdr.details:
        inventory = (
            db.query(InventoryItem)
            .filter(InventoryItem.id == detail.item_id)
            .first()
        )

        if inventory:
            inventory.in_stock = (inventory.in_stock or 0) + detail.quantity

    db.commit()
    db.refresh(hdr)

    return hdr