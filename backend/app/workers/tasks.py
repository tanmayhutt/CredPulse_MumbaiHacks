from celery import shared_task
from app.workers.celery_app import celery_app
import logging
import time
import requests
import json
from datetime import datetime

logger = logging.getLogger(__name__)

@celery_app.task(name="tasks.verify_invoice", bind=True)
def verify_invoice_task(self, invoice_id, merchant_id):
    """Verify invoice with mock IRP service."""
    logger.info(f"🔍 Verifying invoice {invoice_id}")
    
    try:
        # Simulate IRP call
        time.sleep(2)
        
        # Mock IRP response
        irn = f"IRN{invoice_id:06d}ABC123DEF"
        qr_base64 = "iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAIAAAASLn"  # Truncated for demo
        
        result = {
            "invoice_id": invoice_id,
            "irn": irn,
            "qr_code": qr_base64,
            "status": "verified",
            "timestamp": datetime.utcnow().isoformat()
        }
        
        logger.info(f"✅ Invoice {invoice_id} verified with IRN: {irn}")
        return result
        
    except Exception as e:
        logger.error(f"❌ Verification failed for {invoice_id}: {str(e)}")
        self.retry(exc=e, countdown=5, max_retries=3)

@celery_app.task(name="tasks.score_invoice", bind=True)
def score_invoice_task(self, invoice_id):
    """Score invoice using ML model."""
    logger.info(f"📊 Scoring invoice {invoice_id}")
    
    try:
        from app.ml.credit_model import scorer
        
        time.sleep(2)
        
        # Mock buyer history
        buyer_history = {
            "avg_payment_days": 22,
            "on_time_rate": 0.93,
            "total_invoices": 18
        }
        
        # Mock invoice data
        invoice_data = {
            "amount": 75000,
            "age_days": 5
        }
        
        # Score
        score_result = scorer.score(invoice_data, buyer_history)
        
        logger.info(f"✅ Invoice {invoice_id} scored: {score_result['score']}")
        return score_result
        
    except Exception as e:
        logger.error(f"❌ Scoring failed: {str(e)}")
        self.retry(exc=e, countdown=5, max_retries=3)

@celery_app.task(name="tasks.generate_offer", bind=True)
def generate_offer_task(self, invoice_id, score_result):
    """Generate financing offer."""
    logger.info(f"💰 Generating offer for invoice {invoice_id}")
    
    try:
        from app.services.pricing_service import PricingService
        
        time.sleep(1)
        
        # Calculate offer
        pricing = PricingService.calculate_offer(
            invoice_amount=75000,
            credit_score=score_result['score'],
            tenor_days=30
        )
        
        result = {
            "invoice_id": invoice_id,
            "offer_id": f"OFF{invoice_id:06d}",
            "offer_amount": pricing['offer_amount'],
            "net_amount": pricing['net_amount'],
            "rate": pricing['rate'],
            "tenor_days": pricing['tenor_days'],
            "monthly_cost": pricing['monthly_cost'],
            "breakdown": pricing['breakdown'],
            "score": score_result['score'],
            "score_tier": score_result['tier'],
            "reasons": score_result['reasons']
        }
        
        logger.info(f"✅ Offer generated: {pricing['offer_amount']} @ {pricing['rate']}%")
        return result
        
    except Exception as e:
        logger.error(f"❌ Offer generation failed: {str(e)}")
        self.retry(exc=e, countdown=5, max_retries=3)
