# backend/scripts/seed_demo_data.py

import os
import sys
from pathlib import Path

# 1) Add backend root to PYTHONPATH
BACKEND_DIR = Path(__file__).resolve().parent.parent
sys.path.append(str(BACKEND_DIR))

# 2) Now these imports will work
from app.db.session import SessionLocal, engine
from app.model import Base  # ← Import Base
from app.model.buyer import Buyer
from app.model.merchant import Merchant
from app.model.user import User
from app.model.invoice import Invoice  # ← Add this too
from app.core.security import hash_password

def seed_demo_data():
    """Populate demo data."""
    
    # CREATE ALL TABLES FIRST
    Base.metadata.create_all(bind=engine)
    print("✅ Tables created")
    
    db = SessionLocal()
    try:
        # 1. Create Users
        existing_user = db.query(User).filter(User.email == "merchant1@credpulse.com").first()
        if existing_user:
            print("⚠️  User already exists, skipping...")
            user1 = existing_user
        else:
            user1 = User(
                email="merchant1@credpulse.com",
                password_hash=hash_password("demo123"),
                role="merchant",
                is_active=True
            )
            db.add(user1)
            db.commit()
            db.refresh(user1)
            print("✅ User created")

        # 2. Create Merchants
        existing_merchant = db.query(Merchant).filter(Merchant.user_id == user1.id).first()
        if existing_merchant:
            print("⚠️  Merchant already exists, skipping...")
        else:
            merchant1 = Merchant(
                user_id=user1.id,
                name="Tech Supplies Inc",
                gstin="29AAMFT2479M1ZM",
                kyc_status="approved",
                business_type="B2B Supplier"
            )
            db.add(merchant1)
            db.commit()
            print("✅ Merchant created")

        # 3. Create Buyers (IMPORTANT: Buyers for agent demo)
        buyers = [
            Buyer(
                id=101,
                gstin="27AACCM9910C1ZP",
                name="Excellent Corp - Fast Payer",
                credit_limit=500000,
                payment_history_score=950,
                avg_payment_days=18,
                on_time_rate=0.95,
                total_invoices=25,
                risk_score=850
            ),
            Buyer(
                id=102,
                gstin="07AAACG4567Q1ZP",
                name="Good Business Ltd",
                credit_limit=300000,
                payment_history_score=720,
                avg_payment_days=35,
                on_time_rate=0.82,
                total_invoices=12,
                risk_score=680
            ),
            Buyer(
                id=103,
                gstin="19AABCC8799K1ZW",
                name="High Risk Corp",
                credit_limit=100000,
                payment_history_score=550,
                avg_payment_days=60,
                on_time_rate=0.65,
                total_invoices=8,
                risk_score=450
            )
        ]

        for buyer in buyers:
            existing = db.query(Buyer).filter(Buyer.id == buyer.id).first()
            if not existing:
                db.add(buyer)
                db.commit()
                print(f"✅ Buyer {buyer.id} created: {buyer.name}")
            else:
                print(f"⚠️  Buyer {buyer.id} already exists")

        print("\n" + "="*60)
        print("✅ Demo data seeded successfully!")
        print(f"  📧 Login: merchant1@credpulse.com / demo123")
        print(f"  🏢 Merchant: Tech Supplies Inc")
        print(f"  👥 Buyers: 3 test buyers with different risk profiles")
        print(f"  🚀 Ready for invoice upload & agent analysis!")
        print("="*60)

    except Exception as e:
        db.rollback()
        print(f"❌ Seeding failed: {str(e)}")
        import traceback
        traceback.print_exc()

    finally:
        db.close()

if __name__ == "__main__":
    seed_demo_data()
