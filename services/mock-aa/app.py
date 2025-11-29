# services/mock-aa/app.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime, timedelta
import random

app = FastAPI(title="Mock Account Aggregator", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ConsentRequest(BaseModel):
    merchant_id: int
    data_fields: list
    purpose: str

class DataFetchRequest(BaseModel):
    consent_id: str
    merchant_id: int

@app.post("/consent/request")
async def request_consent(request: ConsentRequest):
    consent_id = f"CONSENT{request.merchant_id:06d}{random.randint(1000, 9999)}"
    return {
        "consent_id": consent_id,
        "status": "granted",
        "merchant_id": request.merchant_id,
        "data_fields": request.data_fields,
        "purpose": request.purpose,
        "granted_at": datetime.utcnow().isoformat(),
        "expires_at": (datetime.utcnow() + timedelta(days=90)).isoformat()
    }

@app.post("/data/fetch")
async def fetch_financial_data(request: DataFetchRequest):
    # Mock bank statements
    bank_statements = []
    for i in range(60):
        bank_statements.append({
            "date": (datetime.now() - timedelta(days=i*3)).isoformat(),
            "description": random.choice(["Payment received", "Supplier payment", "GST payment"]),
            "credit": random.randint(20000, 80000) if random.random() > 0.4 else 0,
            "debit": random.randint(10000, 50000) if random.random() > 0.6 else 0,
            "balance": random.randint(50000, 200000)
        })
    
    return {
        "consent_id": request.consent_id,
        "merchant_id": request.merchant_id,
        "data": {
            "bank_statements": bank_statements,
            "upi_transactions": [],
            "gst_returns": []
        },
        "fetched_at": datetime.utcnow().isoformat()
    }

@app.get("/health")
async def health():
    return {"status": "ok", "service": "Mock Account Aggregator"}
