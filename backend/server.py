from flask import Flask
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from app.routes import api_blueprint
from app.errors import errors_blueprint
from app.database_helpers import get_db_connection
import logging

app = Flask(__name__)

# Configuration
CORS(app, resources={
    r"/AntigoneApp/*": {
        "origins": ["https://brodeeclontz.com"],
        "methods": ["GET", "POST"],
        "allow_headers": ["Content-Type"]
    }
})

limiter = Limiter(
    app=app,
    key_func=get_remote_address,
    default_limits=["200 per day", "50 per hour"]
)

# Register blueprints
app.register_blueprint(api_blueprint)
app.register_blueprint(errors_blueprint)

# Initialize logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)