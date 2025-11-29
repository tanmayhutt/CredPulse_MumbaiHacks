class ScoringService:
    """Service for credit scoring."""
    
    @staticmethod
    def score_invoice(invoice_id: int) -> dict:
        """Score invoice."""
        logger.info(f"Scoring invoice {invoice_id}")
        return {
            "invoice_id": invoice_id,
            "credit_score": 750,
            "risk_tier": "low"
        }