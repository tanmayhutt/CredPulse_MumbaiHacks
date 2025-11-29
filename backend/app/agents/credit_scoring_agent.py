# backend/app/agents/credit_scoring_agent.py

from groq import Groq
from app.agents.base_agent import BaseAgent
import os
import json
import logging

logger = logging.getLogger(__name__)

class CreditScoringAgent(BaseAgent):
    """
    Agent that performs alternative credit scoring.
    
    Tools:
    - fetch_cashflow: Get merchant's cash flow data
    - check_gst_compliance: Verify GST filing status
    - analyze_upi_velocity: Check UPI transaction patterns
    """
    
    def __init__(self):
        super().__init__("CreditScoringAgent")
        self.client = Groq(api_key=os.getenv("GROQ_API_KEY"))
        self.model = "llama-3.1-8b-instant"
    
    def fetch_cashflow(self, merchant_id: int) -> dict:
        """Get merchant cashflow."""
        return {
            "monthly_inflow": 250000,
            "monthly_outflow": 200000,
            "avg_balance": 80000,
            "consistency_score": 0.88
        }
    
    def check_gst_compliance(self, merchant_id: int) -> dict:
        """Check GST filing."""
        return {
            "filed_on_time": True,
            "consecutive_months": 6,
            "avg_revenue": 300000
        }
    
    def analyze_upi_velocity(self, merchant_id: int) -> dict:
        """Analyze UPI patterns."""
        return {
            "monthly_transactions": 120,
            "avg_transaction_value": 8500,
            "trend": "stable"
        }
    
    def execute(self, context: dict) -> dict:
        """Execute credit scoring."""
        merchant_id = context.get("merchant_id", 1)
        
        logger.info(f"📊 Credit Scoring Agent analyzing merchant {merchant_id}")
        
        # Gather data
        cashflow = self.fetch_cashflow(merchant_id)
        gst = self.check_gst_compliance(merchant_id)
        upi = self.analyze_upi_velocity(merchant_id)
        
        prompt = f"""You are a Credit Scoring Agent using alternative data.

MERCHANT: {merchant_id}

CASHFLOW DATA:
- Monthly Inflow: ₹{cashflow['monthly_inflow']:,}
- Monthly Outflow: ₹{cashflow['monthly_outflow']:,}
- Average Balance: ₹{cashflow['avg_balance']:,}
- Consistency: {cashflow['consistency_score']*100}%

GST COMPLIANCE:
- Filed On-Time: {gst['filed_on_time']}
- Consecutive Months: {gst['consecutive_months']}
- Avg Revenue: ₹{gst['avg_revenue']:,}

UPI ACTIVITY:
- Monthly Transactions: {upi['monthly_transactions']}
- Avg Transaction: ₹{upi['avg_transaction_value']:,}
- Trend: {upi['trend']}

TASK: Calculate credit score (0-1000) and risk tier.

Respond in JSON:
{{
  "credit_score": 780,
  "tier": "excellent" | "very_good" | "good" | "medium" | "risky",
  "reasoning": ["reason1", "reason2"],
  "recommended_limit": 100000
}}"""

        try:
            completion = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "You are a credit analyst. Respond in JSON."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.1,
                max_tokens=500,
                response_format={"type": "json_object"}
            )
            
            ai_response = json.loads(completion.choices[0].message.content)
            
            result = {
                "agent": self.name,
                "merchant_id": merchant_id,
                "score": ai_response,
                "data_sources": {
                    "cashflow": cashflow,
                    "gst": gst,
                    "upi": upi
                }
            }
            
            self.log_execution(context, result)
            logger.info(f"✅ Credit Score: {ai_response.get('credit_score')}/1000 ({ai_response.get('tier')})")
            
            return result
            
        except Exception as e:
            logger.error(f"❌ Credit Scoring Agent failed: {str(e)}")
            return {"agent": self.name, "error": str(e)}
