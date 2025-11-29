from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class ConsentRequest(BaseModel):
    fields: list
    party: str

@router.post("/grant")
async def grant_consent(request: ConsentRequest):
    """Grant consent to share data."""
    return {"status": "consent_granted", "party": request.party}

@router.get("/list")
async def list_consents():
    """List all consents."""
    return {"consents": []}

@router.post("/{consent_id}/revoke")
async def revoke_consent(consent_id: int):
    """Revoke a consent."""
    return {"consent_id": consent_id, "status": "revoked"}