from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class PaymentWebhook(BaseModel):
    offer_id: int
    amount: float
    status: str

class DeliveryWebhook(BaseModel):
    invoice_id: int
    delivery_status: str

@router.post("/payment")
async def payment_webhook(data: PaymentWebhook):
    """Handle payment webhook."""
    return {
        "status": "received",
        "offer_id": data.offer_id,
        "message": "Payment received and reconciled"
    }

@router.post("/delivery")
async def delivery_webhook(data: DeliveryWebhook):
    """Handle delivery webhook."""
    return {
        "status": "received",
        "invoice_id": data.invoice_id,
        "message": "Delivery status updated"
    }