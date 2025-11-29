from sqlalchemy import text
from app.db.session import engine
import logging

logger = logging.getLogger(__name__)

def init_db():
    """Initialize database with complete schema."""
    try:
        # Import all models so they're registered with Base
        from app.model import Base
        from app.model.user import User
        from app.model.merchant import Merchant
        from app.model.buyer import Buyer
        from app.model.invoice import Invoice
        
        # Create all tables
        Base.metadata.create_all(bind=engine)
        logger.info("✅ Database tables created successfully")
        
        # Log what tables were created
        logger.info(f"📋 Tables: {list(Base.metadata.tables.keys())}")
        
    except Exception as e:
        logger.error(f"❌ Database initialization failed: {str(e)}")
        import traceback
        traceback.print_exc()
        raise
