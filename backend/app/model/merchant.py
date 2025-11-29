from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from datetime import datetime
from app.model import Base  # ← Import shared Base

class Merchant(Base):
    __tablename__ = "merchants"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    name = Column(String(128), nullable=False)
    gstin = Column(String(20), unique=True, nullable=False)
    kyc_status = Column(String(20), default="pending")
    business_type = Column(String(50))
    registration_number = Column(String(50))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
