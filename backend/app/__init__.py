from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_cors import CORS
from pathlib import Path

db = SQLAlchemy()
limiter = Limiter(key_func=get_remote_address)
cors = CORS()

def create_app():
    app = Flask(__name__)

    BASE_DIR = Path(__file__).parent.parent
    DATABASE_PATH = BASE_DIR / 'database' / 'antigone.db'
    
    # Configuration
    app.config.from_mapping(
        SQLALCHEMY_DATABASE_URI=f'sqlite:///{DATABASE_PATH}',
        SQLALCHEMY_TRACK_MODIFICATIONS=False,
        CORS_ORIGINS=["https://brodeeclontz.com"]
    )

    # Initialize extensions
    db.init_app(app)
    limiter.init_app(app)
    cors.init_app(app, resources={
        r"/AntigoneApp/*": {
            "origins": app.config['CORS_ORIGINS'],
            "methods": ["GET", "POST"],
            "allow_headers": ["Content-Type"]
        }
    })

    # Register blueprints
    from app import routes
    app.register_blueprint(routes.bp)

    return app