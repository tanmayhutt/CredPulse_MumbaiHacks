from fastapi import APIRouter, Depends, File, UploadFile, Form, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
import logging
import uuid
import os
from pathlib import Path

from app.db.session import get_db
from app.services.invoice_service import InvoiceService

logger = logging.getLogger(__name__)
router = APIRouter()

# Create uploads directory if not exists
BACKEND_DIR = Path(__file__).resolve().parent.parent.parent
UPLOAD_DIR = BACKEND_DIR / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True, parents=True)

logger.info(f"✅ Upload directory ready: {UPLOAD_DIR}")

class InvoiceCreate(BaseModel):
    merchant_id: int
    buyer_id: int
    invoice_number: str
    amount: float

class InvoiceResponse(BaseModel):
    id: int
    invoice_number: str
    amount: float
    status: str
    irn: Optional[str] = None
    qr_code: Optional[str] = None

@router.post("/upload")
async def upload_invoice(
    file: UploadFile = File(...),
    merchant_id: int = Form(...),
    db: Session = Depends(get_db)
):
    """
    Upload invoice PDF/image file.
    
    Accepts multipart/form-data with:
    - file: PDF or image file
    - merchant_id: Integer ID of merchant
    """
    
    # Validate file
    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail="File name is required"
        )
    
    # Validate file type
    allowed_extensions = {'.pdf', '.jpg', '.jpeg', '.png', '.xlsx', '.xls'}
    file_ext = Path(file.filename).suffix.lower()
    
    if file_ext not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail=f"File type {file_ext} not allowed. Allowed: {', '.join(allowed_extensions)}"
        )
    
    # Validate file size (max 10MB)
    max_size = 10 * 1024 * 1024
    file_content = await file.read()
    
    if len(file_content) > max_size:
        raise HTTPException(
            status_code=413,
            detail=f"File size exceeds 10MB limit. Size: {len(file_content) / 1024 / 1024:.2f}MB"
        )
    
    try:
        logger.info(f"📤 Uploading invoice for merchant {merchant_id}: {file.filename}")
        
        # Generate unique file ID
        file_id = str(uuid.uuid4())
        file_path = UPLOAD_DIR / f"{file_id}_{file.filename}"
        
        # Save file to disk
        with open(file_path, "wb") as f:
            f.write(file_content)
        
        logger.info(f"✅ File saved: {file_path}")
        
        # Use service to process
        result = InvoiceService.upload_invoice(
            file_id=file_id,
            merchant_id=merchant_id,
            filename=file.filename,
            file_path=str(file_path),
            file_size=len(file_content),
            db=db
        )
        
        return {
            "status": "success",
            "message": "Invoice uploaded successfully",
            "data": result
        }
        
    except Exception as e:
        logger.error(f"❌ Upload failed: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Upload failed: {str(e)}"
        )

@router.get("/list")
async def list_invoices(
    merchant_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    """List merchant's invoices."""
    logger.info(f"Listing invoices for merchant {merchant_id}")
    
    invoices = InvoiceService.list_invoices(merchant_id, db)
    
    return {
        "status": "success",
        "merchant_id": merchant_id,
        "invoices": invoices
    }

@router.get("/{invoice_id}")
async def get_invoice(
    invoice_id: int,
    db: Session = Depends(get_db)
):
    """Get invoice details."""
    invoice = InvoiceService.get_invoice(invoice_id, db)
    
    if not invoice:
        raise HTTPException(
            status_code=404,
            detail=f"Invoice {invoice_id} not found"
        )
    
    return {
        "status": "success",
        "data": invoice
    }

@router.post("/{invoice_id}/verify")
async def trigger_verification(
    invoice_id: int,
    db: Session = Depends(get_db)
):
    """Trigger invoice verification with IRP."""
    logger.info(f"Triggering verification for invoice {invoice_id}")
    
    return {
        "status": "success",
        "invoice_id": invoice_id,
        "message": "Verification initiated",
        "next_step": "Monitor verification status"
    }
