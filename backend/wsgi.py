import sys
from pathlib import Path

# Add backend to Python path
sys.path.insert(0, str(Path(__file__).parent))

from app import create_app
application = create_app()

if __name__ == "__main__":
    application.run()