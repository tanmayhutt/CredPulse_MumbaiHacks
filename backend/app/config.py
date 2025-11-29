# backend/app/config.py

from pydantic_settings import BaseSettings
from typing import Optional
import os
from pathlib import Path

# Get the backend directory path
BASE_DIR = Path(__file__).resolve().parent.parent

class Settings(BaseSettings):
    # Database
    DATABASE_URL: str = "postgresql://credpulse:credpulse_dev@localhost:5432/credpulse"
    
    # Security
    SECRET_KEY: str = "change-this-to-a-strong-secret-key"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379"
    CELERY_BROKER_URL: str = "redis://localhost:6379/0"
    CELERY_RESULT_BACKEND: str = "redis://localhost:6379/0"
    
    # Groq API
    GROQ_API_KEY: Optional[str] = None
    
    # Environment
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    
    class Config:
        env_file = str(BASE_DIR / ".env")  # Look for .env in backend/
        env_file_encoding = 'utf-8'
        case_sensitive = True
        extra = "ignore"

settings = Settings()
