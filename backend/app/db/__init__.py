from sqlalchemy import text
from app.db.session import engine
from app.model import Base
import logging

logger = logging.getLogger(__name__)

def init_db():
    """Initialize database with complete schema."""
    try:
        # Create all tables from models
        Base.metadata.create_all(bind=engine)
        logger.info("✅ Database tables created successfully")
        
    except Exception as e:
        logger.error(f"❌ Database initialization failed: {str(e)}")
        raise
