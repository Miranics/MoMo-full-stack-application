#!/usr/bin/env python 
# app.py - Main Flask application

import logging
from flask import Flask
from flask_cors import CORS  # Import CORS
from backend.routes import api  # Fix import
from backend.database import engine, Base

# Setting up logging
logging.basicConfig(
    filename='backend/logs/data_processing.log',  # Log file
    level=logging.DEBUG,  # Log level
    format='%(asctime)s - %(levelname)s - %(message)s',  # Log format
    filemode='a'  # Append to the log file, don't overwrite
)

logging.info('Flask app starting...')

# Initialize Flask app
app = Flask(__name__)

# Enable CORS for all routes
CORS(app)

# Load configuration
app.config.from_object('backend.config.Config')

# Create database tables (if they don't exist)
Base.metadata.create_all(bind=engine)

# Register Blueprints with URL prefix
app.register_blueprint(api, url_prefix="/api")  # 

@app.route('/')
def home():
    logging.info('Home route accessed')
    return " App is running! @ Miracle ); WELL DONE!!"

if __name__ == "__main__":
    logging.info('Starting the application...')
    app.run(debug=True)
