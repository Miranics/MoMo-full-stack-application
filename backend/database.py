# database.py - Initialize the database connection using SQLAlchemy

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

# Get database credentials from environment variables
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_HOST = os.getenv("DB_HOST")
DB_PORT = os.getenv("DB_PORT")
DB_NAME = os.getenv("DB_NAME")

# Construct database URL without ssl-mode in query string
DATABASE_URL = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

# Create the database engine with SSL support
engine = create_engine(DATABASE_URL, connect_args={"ssl": {"ssl_mode": "REQUIRED"}})

# Create a session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for models
Base = declarative_base()

def init_app(app):
    """
    Initialize the Flask app with the database connection.
    """
    # We are not calling db.init_app here as in the SQLAlchemy setup from Flask-SQLAlchemy
    pass

def get_db():
    """
    Dependency that provides a session to interact with the database.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
