import logging

logger = logging.getLogger(__name__)

class ConsentService:
    """Service for consent management."""
    
    @staticmethod
    def grant_consent(user_id: int, party: str, fields: list) -> dict:
        """Grant consent."""
        logger.info(f"Granting consent for user {user_id} to party {party}")
        return {
            "user_id": user_id,
            "party": party,
            "fields": fields,
            "status": "granted"
        }