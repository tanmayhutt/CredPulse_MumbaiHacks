from sqlalchemy import Column, Integer, String, Float, DateTime
from datetime import datetime
from app.model import Base  # ← Import shared Base

class Buyer(Base):
    __tablename__ = "buyers"
    
    id = Column(Integer, primary_key=True)
    gstin = Column(String(20), unique=True, nullable=False)
    name = Column(String(128), nullable=False)
    credit_limit = Column(Float, default=0)
    payment_history_score = Column(Float, nullable=True)
    avg_payment_days = Column(Integer, nullable=True)
    on_time_rate = Column(Float, nullable=True)
    total_invoices = Column(Integer, default=0)
    risk_score = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
