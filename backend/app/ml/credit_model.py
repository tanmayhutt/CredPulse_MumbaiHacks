import numpy as np
from sklearn.ensemble import RandomForestClassifier
import pickle
import os
import logging

logger = logging.getLogger(__name__)

class CreditScorer:
    def __init__(self):
        self.model = None
        self.load_or_train()
    
    def load_or_train(self):
        """Load model or train if not exists."""
        model_path = os.path.join(os.path.dirname(__file__), "model.pkl")
        
        if os.path.exists(model_path):
            logger.info("Loading existing credit model...")
            with open(model_path, 'rb') as f:
                self.model = pickle.load(f)
        else:
            logger.info("Training credit model...")
            self.train_model()
            
            # Save model
            with open(model_path, 'wb') as f:
                pickle.dump(self.model, f)
    
    def train_model(self):
        """Train on synthetic data."""
        # Features: [amount, buyer_payment_days, on_time_rate, invoice_age_days]
        X = np.array([
            [50000, 15, 0.95, 5],      # Excellent
            [100000, 25, 0.92, 7],     # Very Good
            [200000, 40, 0.85, 15],    # Good
            [30000, 10, 0.98, 3],      # Excellent
            [150000, 45, 0.80, 20],    # Medium
            [250000, 60, 0.70, 30],    # Risky
            [75000, 20, 0.90, 8],      # Very Good
            [120000, 35, 0.88, 12],    # Good
            [300000, 75, 0.65, 45],    # Very Risky
            [40000, 12, 0.96, 4],      # Excellent
        ])
        
        # Labels: 1 = good credit, 0 = risky credit
        y = np.array([1, 1, 1, 1, 1, 0, 1, 1, 0, 1])
        
        self.model = RandomForestClassifier(
            n_estimators=20,
            max_depth=5,
            random_state=42,
            verbose=0
        )
        self.model.fit(X, y)
        logger.info("Model trained successfully")
    
    def score(self, invoice_data: dict, buyer_history: dict) -> dict:
        """Score an invoice."""
        # Extract features
        features = np.array([[
            float(invoice_data.get('amount', 50000)),
            float(buyer_history.get('avg_payment_days', 30)),
            float(buyer_history.get('on_time_rate', 0.85)),
            float(invoice_data.get('age_days', 5))
        ]])
        
        # Predict probability
        prob = self.model.predict_proba(features)
        score = int(prob * 1000)  # Scale to 0-1000
        
        # Determine tier
        if score >= 800:
            tier = "excellent"
            tier_color = "green"
        elif score >= 700:
            tier = "very_good"
            tier_color = "blue"
        elif score >= 600:
            tier = "good"
            tier_color = "cyan"
        elif score >= 500:
            tier = "medium"
            tier_color = "yellow"
        else:
            tier = "risky"
            tier_color = "red"
        
        # Generate reasons
        reasons = self._generate_reasons(invoice_data, buyer_history, score)
        
        return {
            "score": score,
            "tier": tier,
            "tier_color": tier_color,
            "reasons": reasons,
            "confidence": round(prob * 100, 1),
            "features": {
                "amount": float(invoice_data.get('amount', 0)),
                "buyer_payment_days": float(buyer_history.get('avg_payment_days', 0)),
                "on_time_rate": float(buyer_history.get('on_time_rate', 0)),
                "invoice_age_days": float(invoice_data.get('age_days', 0))
            }
        }
    
    def _generate_reasons(self, invoice_data, buyer_history, score):
        """Generate explainable reasons for score."""
        reasons = []
        
        # Payment history reasoning
        on_time_rate = buyer_history.get('on_time_rate', 0)
        if on_time_rate >= 0.95:
            reasons.append("✓ Excellent payment history (>95% on-time)")
        elif on_time_rate >= 0.90:
            reasons.append("✓ Very good payment history (>90% on-time)")
        elif on_time_rate >= 0.80:
            reasons.append("✓ Good payment history (>80% on-time)")
        else:
            reasons.append("⚠ Payment history needs improvement")
        
        # Payment speed reasoning
        avg_days = buyer_history.get('avg_payment_days', 60)
        if avg_days <= 15:
            reasons.append("✓ Fast payment (avg <15 days)")
        elif avg_days <= 30:
            reasons.append("✓ Prompt payment (avg <30 days)")
        elif avg_days <= 45:
            reasons.append("✓ Reasonable payment cycle")
        else:
            reasons.append("⚠ Slow payment cycle detected")
        
        # Amount reasoning
        amount = invoice_data.get('amount', 0)
        if amount < 100000:
            reasons.append("✓ Conservative invoice amount")
        elif amount > 200000:
            reasons.append("⚠ High invoice amount increases risk")
        
        return reasons

# Global instance
scorer = CreditScorer()
