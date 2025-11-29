class PricingService:
    @staticmethod
    def calculate_offer(invoice_amount: float, credit_score: int, tenor_days: int = 30):
        """Calculate factoring offer with dynamic pricing."""
        
        # Base annual rate
        base_rate = 2.5
        
        # Risk adjustment (lower score = higher rate)
        # Score 800-1000: 0% adjustment
        # Score 700-800: 0.5% adjustment
        # Score 600-700: 1.0% adjustment
        # Score < 600: 1.5% adjustment
        if credit_score >= 800:
            risk_adjustment = 0.0
        elif credit_score >= 700:
            risk_adjustment = 0.5
        elif credit_score >= 600:
            risk_adjustment = 1.0
        else:
            risk_adjustment = 1.5
        
        # Tenor adjustment (longer tenor = higher rate)
        # Per 30 days: +0.5%
        tenor_adjustment = (tenor_days / 30) * 0.5
        
        # Final annual rate
        final_rate = base_rate + risk_adjustment + tenor_adjustment
        
        # Offer amount (90% of invoice value for factoring)
        offer_amount = invoice_amount * 0.90
        
        # Calculate discount/fee for tenor
        daily_rate = final_rate / 365 / 100
        discount = offer_amount * daily_rate * tenor_days
        
        # Net amount (what merchant receives)
        net_amount = offer_amount - discount
        
        # Processing fee (1%)
        processing_fee = offer_amount * 0.01
        net_amount -= processing_fee
        
        return {
            "invoice_amount": round(invoice_amount, 2),
            "offer_amount": round(offer_amount, 2),
            "discount": round(discount, 2),
            "processing_fee": round(processing_fee, 2),
            "net_amount": round(net_amount, 2),
            "rate": round(final_rate, 2),
            "tenor_days": tenor_days,
            "breakdown": {
                "base_rate": base_rate,
                "risk_adjustment": round(risk_adjustment, 2),
                "tenor_adjustment": round(tenor_adjustment, 2),
                "effective_rate": round(final_rate, 2)
            },
            "monthly_cost": round((discount / tenor_days * 30), 2)
        }
