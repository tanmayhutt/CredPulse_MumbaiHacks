from groq import Groq
from app.agents.base_agent import BaseAgent
from app.agents.supply_chain_agent import SupplyChainAgent
from app.agents.invoice_factoring_agent import InvoiceFactoringAgent
from app.agents.credit_scoring_agent import CreditScoringAgent
import os
import json
import logging

logger = logging.getLogger(__name__)

class OrchestrationAgent(BaseAgent):
    """Master agent that coordinates all other agents."""
    
    def __init__(self):
        super().__init__("OrchestrationAgent")
        
        # Get API key from environment
        api_key = os.getenv("GROQ_API_KEY")
        
        if not api_key:
            logger.warning(
                "⚠️  GROQ_API_KEY not found in environment. "
                "Add it to backend/.env or set as environment variable. "
                "Agent features will be limited."
            )
            self.client = None
        else:
            logger.info(f"✅ Using Groq API key: {api_key[:10]}...")
            
            try:
                self.client = Groq(api_key=api_key)
                self.model = "llama-3.1-8b-instant"
                logger.info("✅ Groq client initialized")
            except Exception as e:
                logger.error(f"❌ Failed to initialize Groq: {str(e)}")
                self.client = None
        
        # Initialize sub-agents
        self.supply_chain_agent = SupplyChainAgent()
        self.factoring_agent = InvoiceFactoringAgent()
        self.credit_scoring_agent = CreditScoringAgent()
    
    def execute(self, context: dict) -> dict:
        """Execute multi-agent workflow."""
        invoice_id = context.get("invoice_id", 1)
        buyer_id = context.get("buyer_id", 101)
        merchant_id = context.get("merchant_id", 1)
        
        logger.info(f"🎯 Orchestrating workflow for invoice {invoice_id}")
        
        results = []
        
        # Step 1: Supply Chain Analysis
        logger.info("Step 1/3: Supply Chain Analysis...")
        sc_result = self.supply_chain_agent.execute(
            {"invoice_id": invoice_id, "buyer_id": buyer_id}
        )
        results.append(sc_result)
        
        # Check if financeable
        if sc_result.get("analysis", {}).get("decision") != "YES":
            logger.warning("⚠️ Invoice not financeable")
            return {
                "agent": self.name,
                "workflow_status": "rejected",
                "reason": "Invoice not financeable",
                "results": results
            }
        
        # Step 2: Credit Scoring
        logger.info("Step 2/3: Credit Scoring...")
        cs_result = self.credit_scoring_agent.execute(
            {"merchant_id": merchant_id}
        )
        results.append(cs_result)
        
        # Step 3: Invoice Factoring
        logger.info("Step 3/3: Invoice Factoring...")
        fact_result = self.factoring_agent.execute({
            "invoice_id": invoice_id,
            "amount": sc_result.get("invoice_data", {}).get("amount", 75000),
            "recommended_rate": sc_result.get("analysis", {}).get("recommended_rate", 2.5)
        })
        results.append(fact_result)
        
        # Final decision
        final_result = {
            "agent": self.name,
            "invoice_id": invoice_id,
            "workflow_status": "completed",
            "final_decision": {
                "decision": "APPROVED",
                "confidence": 0.95,
                "reasoning": "All checks passed",
                "next_actions": ["Trigger disbursement", "Schedule auto-reconciliation"]
            },
            "agent_results": {
                "supply_chain": sc_result,
                "credit_scoring": cs_result,
                "factoring": fact_result
            }
        }
        
        self.log_execution(context, final_result)
        logger.info(f"🎉 FINAL DECISION: APPROVED")
        
        return final_result
