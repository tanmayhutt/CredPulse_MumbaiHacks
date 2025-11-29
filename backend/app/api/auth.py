from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from datetime import timedelta
import logging

from app.db.session import get_db
from app.core.security import create_access_token, verify_password, hash_password

logger = logging.getLogger(__name__)
router = APIRouter()

class LoginRequest(BaseModel):
    email: str
    password: str

class RegisterRequest(BaseModel):
    email: str
    password: str
    merchant_name: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int

@router.post("/register", response_model=dict)
async def register(request: RegisterRequest, db: Session = Depends(get_db)):
    """Register new merchant."""
    logger.info(f"Registering merchant: {request.email}")
    
    # Simplified demo - in production, check if user exists
    hashed_password = hash_password(request.password)
    
    return {
        "email": request.email,
        "merchant_name": request.merchant_name,
        "status": "registered",
        "message": "Merchant registered successfully"
    }

@router.post("/login", response_model=TokenResponse)
async def login(request: LoginRequest, db: Session = Depends(get_db)):
    """Login merchant."""
    logger.info(f"Login attempt: {request.email}")
    
    # Simplified demo - in production, query user from DB
    access_token = create_access_token(
        data={"sub": request.email},
        expires_delta=timedelta(hours=24)
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "expires_in": 86400
    }

@router.post("/refresh")
async def refresh_token(authorization: str = None):
    """Refresh JWT token."""
    if not authorization:
        raise HTTPException(status_code=401, detail="No token provided")
    
    access_token = create_access_token(
        data={"sub": "user@example.com"},
        expires_delta=timedelta(hours=24)
    )
    return {"access_token": access_token, "token_type": "bearer"}
