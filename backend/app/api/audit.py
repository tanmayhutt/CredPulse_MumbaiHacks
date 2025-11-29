from fastapi import APIRouter

router = APIRouter()

@router.get("/logs")
async def get_audit_logs(limit: int = 100):
    """Get audit logs."""
    return {
        "logs": [
            {
                "id": 1,
                "event": "invoice_uploaded",
                "timestamp": "2025-11-12T10:00:00",
                "details": "Invoice INV-001 uploaded"
            }
        ]
    }

@router.get("/logs/{event_id}")
async def get_audit_log(event_id: int):
    """Get specific audit log."""
    return {
        "id": event_id,
        "event": "invoice_uploaded",
        "timestamp": "2025-11-12T10:00:00",
        "details": "Invoice INV-001 uploaded"
    }