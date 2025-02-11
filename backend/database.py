# database.py - Initialize the database connection using SQLAlchemy

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

# Get the database URL from environment variables
DATABASE_URL = os.getenv("DATABASE_URL")

# Create the database engine
engine = create_engine(DATABASE_URL)

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

