class AnonymizationService:
    """Service for data anonymization."""
    
    @staticmethod
    def pseudonymize(value: str) -> str:
        """Pseudonymize a value."""
        import hashlib
        return hashlib.sha256(value.encode()).hexdigest()[:16]