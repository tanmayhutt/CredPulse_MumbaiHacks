# backend/app/agents/invoice_factoring_agent.py

from groq import Groq
from app.agents.base_agent import BaseAgent
import os
import json
import logging

logger = logging.getLogger(__name__)

class InvoiceFactoringAgent(BaseAgent):
    """
    Agent that handles invoice factoring workflow.
    
    Tools:
    - match_po: Verify invoice matches purchase order
    - calculate_offer: Compute factoring terms
    - simulate_disbursement: Mock payout
    """
    
    def __init__(self):
        super().__init__("InvoiceFactoringAgent")
        self.client = Groq(api_key=os.getenv("GROQ_API_KEY"))
        self.model = "llama-3.1-8b-instant"
    
    def match_po(self, invoice_id: int) -> dict:
        """Check if invoice matches PO."""
        return {
            "invoice_id": invoice_id,
            "po_matched": True,
            "po_number": f"PO{invoice_id:04d}",
            "delivery_confirmed": True
        }
    
    def calculate_offer(self, amount: float, rate: float, tenor_days: int = 30) -> dict:
        """Calculate factoring offer."""
        offer_amount = amount * 0.90  # 90% advance
        daily_rate = rate / 365 / 100
        discount = offer_amount * daily_rate * tenor_days
        processing_fee = offer_amount * 0.01
        net_amount = offer_amount - discount - processing_fee
        
        return {
            "invoice_amount": amount,
            "offer_amount": offer_amount,
            "discount": discount,
            "processing_fee": processing_fee,
            "net_amount": net_amount,
            "rate": rate,
            "tenor_days": tenor_days
        }
    
    def simulate_disbursement(self, invoice_id: int, amount: float) -> dict:
        """Simulate disbursement."""
        return {
            "invoice_id": invoice_id,
            "disbursed_amount": amount,
            "status": "simulated",
            "transaction_id": f"TXN{invoice_id:08d}"
        }
    
    def execute(self, context: dict) -> dict:
        """Execute factoring workflow."""
        invoice_id = context.get("invoice_id", 1)
        amount = context.get("amount", 75000)
        recommended_rate = context.get("recommended_rate", 2.5)
        
        logger.info(f"💰 Factoring Agent processing invoice {invoice_id}")
        
        # Gather data
        po_match = self.match_po(invoice_id)
        offer_calc = self.calculate_offer(amount, recommended_rate)
        
        # AI reasoning
        prompt = f"""You are an Invoice Factoring Agent.

INVOICE: {invoice_id}
AMOUNT: ₹{amount:,}
PO MATCHED: {po_match['po_matched']}
DELIVERY CONFIRMED: {po_match['delivery_confirmed']}

OFFER CALCULATION:
- Advance: ₹{offer_calc['offer_amount']:,} (90% of invoice)
- Rate: {recommended_rate}% annual
- Discount: ₹{offer_calc['discount']:,.2f}
- Processing Fee: ₹{offer_calc['processing_fee']:,.2f}
- Net to Merchant: ₹{offer_calc['net_amount']:,.2f}

DECISION: Should we proceed with factoring? Consider:
1. PO match status
2. Delivery confirmation
3. Offer terms fairness

Respond in JSON:
{{
  "proceed": true or false,
  "reasoning": "explanation",
  "offer_summary": "brief summary for merchant"
}}"""

        try:
            completion = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "You are a factoring expert. Respond in JSON."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.1,
                max_tokens=400,
                response_format={"type": "json_object"}
            )
            
            ai_response = json.loads(completion.choices[0].message.content)
            
            # If approved, simulate disbursement
            disbursement = None
            if ai_response.get("proceed"):
                disbursement = self.simulate_disbursement(invoice_id, offer_calc['net_amount'])
            
            result = {
                "agent": self.name,
                "invoice_id": invoice_id,
                "decision": ai_response,
                "offer_details": offer_calc,
                "disbursement": disbursement
            }
            
            self.log_execution(context, result)
            logger.info(f"✅ Factoring {'APPROVED' if ai_response.get('proceed') else 'REJECTED'}")
            
            return result
            
        except Exception as e:
            logger.error(f"❌ Factoring Agent failed: {str(e)}")
            return {"agent": self.name, "error": str(e)}
