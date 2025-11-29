# backend/app/agents/supply_chain_agent.py

from groq import Groq
from app.agents.base_agent import BaseAgent
import os
import json
import logging

from app.db.session import SessionLocal  # required for DB queries

logger = logging.getLogger(__name__)


class SupplyChainAgent(BaseAgent):
    """
    Agent that analyzes buyer-supplier relationships and flags financeable invoices.
    
    Tools:
    - buyer_payment_history: Get buyer's payment patterns
    - verify_invoice: Check invoice with IRP
    - flag_financeable: Mark invoice as eligible for financing
    """
    
    def __init__(self):
        super().__init__("SupplyChainAgent")
        self.client = Groq(api_key=os.getenv("GROQ_API_KEY"))
        self.model = "llama-3.1-8b-instant"  # Smart model for reasoning

    def buyer_payment_history(self, buyer_id: int) -> dict:
        """Get REAL buyer data from database."""
        db = SessionLocal()
        try:
            from app.model.buyer import Buyer
            buyer = db.query(Buyer).filter(Buyer.id == buyer_id).first()

            if not buyer:
                return {"error": "Buyer not found"}

            return {
                "buyer_id": buyer_id,
                "buyer_name": buyer.name,
                "avg_payment_days": buyer.avg_payment_days or 30,
                "on_time_rate": float(buyer.on_time_rate or 0.85),
                "total_invoices": buyer.total_invoices or 0,
                "risk_score": buyer.risk_score or 700
            }
        finally:
            db.close()

    def verify_invoice(self, invoice_id: int) -> dict:
        """Verify invoice with IRP."""
        # TODO: Call real IRP service
        return {
            "invoice_id": invoice_id,
            "irn": f"IRN{invoice_id:06d}ABC123",
            "verified": True,
            "amount": 75000,
            "buyer_gstin": "27AABCB1234A1Z5"
        }

    def flag_financeable(self, invoice_id: int, recommended_rate: float) -> dict:
        """Mark invoice as financeable."""
        return {
            "invoice_id": invoice_id,
            "status": "financeable",
            "recommended_rate": recommended_rate,
            "flagged_at": "2025-11-18T00:00:00"
        }

    def execute(self, context: dict) -> dict:
        """
        Execute supply chain analysis using Groq AI.
        
        Args:
            context: {"invoice_id": int, "buyer_id": int}
        
        Returns:
            Decision with reasoning
        """
        invoice_id = context.get("invoice_id", 1)
        buyer_id = context.get("buyer_id", 101)
        
        logger.info(f"🔍 Supply Chain Agent analyzing invoice {invoice_id} for buyer {buyer_id}")
        
        # Step 1: Gather data using tools
        buyer_history = self.buyer_payment_history(buyer_id)
        invoice_data = self.verify_invoice(invoice_id)
        
        # Step 2: Create prompt for Groq AI
        prompt = f"""You are a Supply Chain Intelligence Agent for invoice factoring.

TASK: Analyze if invoice {invoice_id} from buyer {buyer_id} is financeable.

BUYER PAYMENT HISTORY:
- Average Payment Days: {buyer_history['avg_payment_days']}
- On-Time Rate: {buyer_history['on_time_rate']*100}%
- Total Invoices: {buyer_history['total_invoices']}
- Risk Score: {buyer_history['risk_score']}/1000

INVOICE DATA:
- Invoice ID: {invoice_data['invoice_id']}
- IRN: {invoice_data['irn']}
- Verified: {invoice_data['verified']}
- Amount: ₹{invoice_data['amount']:,}

INSTRUCTIONS:
1. Analyze buyer's payment reliability
2. Assess invoice verification status
3. Determine if invoice is financeable (YES/NO)
4. If YES, recommend annual interest rate (2.0% - 5.0% range based on risk)
5. Provide clear reasoning

Respond in JSON format:
{{
  "decision": "YES" or "NO",
  "recommended_rate": 2.5,
  "reasoning": "Clear explanation",
  "risk_level": "low" or "medium" or "high"
}}"""

        # Step 3: Call Groq AI
        try:
            completion = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {
                        "role": "system",
                        "content": "You are an expert credit risk analyst. Always respond with valid JSON."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=0.1,  # Low temp for consistent decisions
                max_tokens=500,
                response_format={"type": "json_object"}  # Force JSON response
            )
            
            # Parse AI response
            ai_response = json.loads(completion.choices[0].message.content)
            
            # Step 4: If financeable, flag it
            if ai_response.get("decision") == "YES":
                flag_result = self.flag_financeable(invoice_id, ai_response.get("recommended_rate", 2.5))
                ai_response["flagged"] = True
            else:
                ai_response["flagged"] = False
            
            result = {
                "agent": self.name,
                "invoice_id": invoice_id,
                "buyer_id": buyer_id,
                "analysis": ai_response,
                "buyer_data": buyer_history,
                "invoice_data": invoice_data
            }
            
            self.log_execution(context, result)
            logger.info(f"✅ Decision: {ai_response.get('decision')} | Rate: {ai_response.get('recommended_rate')}%")
            
            return result
            
        except Exception as e:
            logger.error(f"❌ Supply Chain Agent failed: {str(e)}")
            return {
                "agent": self.name,
                "error": str(e),
                "fallback_decision": "Manual review required"
            }
