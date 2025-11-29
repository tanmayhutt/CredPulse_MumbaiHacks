from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class OfferResponse(BaseModel):
    id: int
    invoice_id: int
    offer_amount: float
    rate: float
    tenor_days: int
    status: str

@router.get("/list")
async def list_offers():
    """List available offers."""
    return {"offers": []}

@router.post("/{offer_id}/accept")
async def accept_offer(offer_id: int):
    """Accept an offer."""
    return {"offer_id": offer_id, "status": "accepted"}