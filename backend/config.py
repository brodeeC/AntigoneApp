import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', os.urandom(32).hex())
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URI', 'sqlite:///backend/database/antigone.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    RATE_LIMITS = {
        'default': '300 per day, 100 per hour',
        'search': '10 per minute'
    }