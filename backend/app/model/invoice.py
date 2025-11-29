from sqlalchemy import Column, Integer, String, Float, Date, DateTime, ForeignKey
from datetime import datetime
from app.model import Base  # ← Import shared Base

class Invoice(Base):
    __tablename__ = "invoices"
    
    id = Column(Integer, primary_key=True)
    merchant_id = Column(Integer, ForeignKey("merchants.id"), nullable=False)
    buyer_id = Column(Integer, ForeignKey("buyers.id"), nullable=False)
    invoice_number = Column(String(40), nullable=False)
    amount = Column(Float, default=0)
    status = Column(String(24), default="uploaded")
    irn = Column(String(64), nullable=True)
    qr_code = Column(String, nullable=True)
    file_path = Column(String(255), nullable=True)
    file_size = Column(Integer, nullable=True)
    invoice_date = Column(Date, nullable=True)
    due_date = Column(Date, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
