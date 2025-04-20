from app import create_app, db
from sqlalchemy import text  # Required for raw SQL
from sqlalchemy import inspect

def verify_db_connection():
    """Verify connection to existing database without modifications"""
    app = create_app()
    with app.app_context():
        try:
            # Test connection with proper text() wrapper
            db.session.execute(text("SELECT 1")).scalar()
            print("✅ Database connection successful!")
            
            # Verify database path
            engine = db.get_engine()
            print(f"🔹 Database location: {engine.url}")
            
            # List all tables
            inspector = inspect(engine)
            tables = inspector.get_table_names()
            print(f"🔹 Found tables: {tables}")
            
            # Verify your key tables exist
            required_tables = {'full_text', 'lemma_data', 'lemma_definitions'}
            missing_tables = required_tables - set(tables)
            if missing_tables:
                print(f"⚠️  Missing tables: {missing_tables}")
            else:
                print("🔹 All required tables present")
                
            return True
            
        except Exception as e:
            print(f"❌ Database verification failed: {str(e)}")
            return False

if __name__ == '__main__':
    verify_db_connection()