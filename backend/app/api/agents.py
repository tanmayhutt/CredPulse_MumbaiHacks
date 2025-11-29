from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

# Global orchestrator (initialized lazily on first use)
_orchestrator = None

def get_orchestrator():
    """Get or initialize orchestrator (lazy loading)."""
    global _orchestrator
    
    if _orchestrator is None:
        try:
            # Only import when needed
            from app.agents.orchestration_agent import OrchestrationAgent
            _orchestrator = OrchestrationAgent()
            logger.info("✅ OrchestrationAgent initialized")
        except Exception as e:
            logger.error(f"❌ Failed to initialize agent: {str(e)}")
            raise
    
    return _orchestrator

class AgentAnalysisRequest(BaseModel):
    invoice_id: int
    buyer_id: int
    merchant_id: int = 1

@router.post("/analyze")
async def analyze_with_agents(request: AgentAnalysisRequest):
    """
    Run full agentic AI workflow on invoice.
    """
    try:
        logger.info(f"🚀 Starting agentic analysis for invoice {request.invoice_id}")
        
        orchestrator = get_orchestrator()  # Initialize on first call
        
        result = orchestrator.execute({
            "invoice_id": request.invoice_id,
            "buyer_id": request.buyer_id,
            "merchant_id": request.merchant_id
        })
        
        return result
        
    except Exception as e:
        logger.error(f"❌ Agent analysis failed: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/health")
async def agent_health():
    """Check if agents are available."""
    return {
        "status": "ok",
        "agents": [
            "SupplyChainAgent",
            "InvoiceFactoringAgent",
            "CreditScoringAgent",
            "OrchestrationAgent"
        ],
        "model": "llama-3.1-70b-versatile (Groq)",
        "note": "Agents initialized on first API call"
    }
