import os
from dotenv import load_dotenv

# Load environment variables from the .env file
load_dotenv()

class Config:
    """Configuration settings for the application."""
    DB_USER = os.getenv("DB_USER")
    DB_PASSWORD = os.getenv("DB_PASSWORD")
    DB_HOST = os.getenv("DB_HOST")
    DB_PORT = os.getenv("DB_PORT")
    DB_NAME = os.getenv("DB_NAME")

    # Corrected MySQL connection URI
    SQLALCHEMY_DATABASE_URI = (
        f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    )

    SQLALCHEMY_TRACK_MODIFICATIONS = False  # Disabling modification tracking for performance

    # Provide SSL settings if required
    SSL_ARGS = {
        "ssl": {"ssl_mode": "REQUIRED"}
    }
