from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging

from app.config import settings
from app.db.session import engine
from app.db.init_db import init_db
from app.api import auth, invoices, offers, consent, audit, webhooks, agents

logger = logging.getLogger(__name__)

# Startup event
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("🚀 Starting CredPulse API...")
    init_db()  # ← This creates tables
    yield
    # Shutdown
    logger.info("🛑 Shutting down CredPulse API...")

app = FastAPI(
    title="CredPulse MVP",
    description="Agentic AI Platform for MSME Credit",
    version="0.1.0",
    lifespan=lifespan
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(invoices.router, prefix="/api/v1/invoices", tags=["invoices"])
app.include_router(offers.router, prefix="/api/v1/offers", tags=["offers"])
app.include_router(consent.router, prefix="/api/v1/consent", tags=["consent"])
app.include_router(audit.router, prefix="/api/v1/audit", tags=["audit"])
app.include_router(webhooks.router, prefix="/api/v1/webhooks", tags=["webhooks"])
app.include_router(agents.router, prefix="/api/v1/agents", tags=["Agentic AI"])

@app.get("/")
async def root():
    return {
        "message": "CredPulse MVP API",
        "version": "0.1.0",
        "docs": "/docs"
    }

@app.get("/health")
async def health():
    return {"status": "ok"}
