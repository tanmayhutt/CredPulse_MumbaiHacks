from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import hashlib
import qrcode
import io
import base64
from datetime import datetime
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="CredPulse Mock IRP",
    description="Mock GST e-Invoice Registration Portal",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class InvoiceData(BaseModel):
    invoice_number: str
    amount: float
    buyer_gstin: str
    seller_gstin: str
    invoice_date: str = None

@app.post("/generate-irn")
async def generate_irn(invoice: InvoiceData):
    """Generate IRN and QR code for invoice."""
    try:
        logger.info(f"Generating IRN for invoice {invoice.invoice_number}")
        
        # Generate deterministic IRN
        irn_input = f"{invoice.invoice_number}|{invoice.amount}|{invoice.buyer_gstin}|{invoice.seller_gstin}"
        irn_hash = hashlib.sha256(irn_input.encode()).hexdigest()
        irn = irn_hash[:2].upper() + irn_hash[2:16].upper()  # Format like real IRN
        
        # Generate QR code
        qr_data = f"01|{irn}|{invoice.invoice_number}|{invoice.amount}|{invoice.buyer_gstin}"
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=10,
            border=4,
        )
        qr.add_data(qr_data)
        qr.make(fit=True)
        
        qr_img = qr.make_image(fill_color="black", back_color="white")
        
        # Convert QR to base64
        buffered = io.BytesIO()
        qr_img.save(buffered, format="PNG")
        qr_base64 = base64.b64encode(buffered.getvalue()).decode()
        
        response = {
            "irn": irn,
            "qr_code": qr_base64,
            "status": "verified",
            "timestamp": datetime.utcnow().isoformat(),
            "message": "IRN generated successfully"
        }
        
        logger.info(f"✓ IRN generated: {irn}")
        return response
        
    except Exception as e:
        logger.error(f"Error generating IRN: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/verify-irn/{irn}")
async def verify_irn(irn: str):
    """Verify an IRN."""
    return {
        "irn": irn,
        "valid": True,
        "status": "verified",
        "timestamp": datetime.utcnow().isoformat()
    }

@app.get("/health")
async def health():
    return {"status": "ok", "service": "Mock IRP"}
