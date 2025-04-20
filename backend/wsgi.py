import sys
from pathlib import Path

# Add backend to Python path
sys.path.insert(0, str(Path(__file__).parent))

from app import create_app
app = create_app()  # Changed from 'application' to 'app'

if __name__ == "__main__":
    app.run()