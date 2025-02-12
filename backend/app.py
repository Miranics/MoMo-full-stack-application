#!/usr/bin/env python
# app.py - Main Flask application

import logging
from flask import Flask
from backend.routes import app_routes
from backend.database import db

# Setting up logging
logging.basicConfig(
    filename='backend/logs/data_processing.log',  # Log to this file
    level=logging.DEBUG,  # Log level (DEBUG for detailed logs)
    format='%(asctime)s - %(levelname)s - %(message)s',  # Log format
    filemode='a'  # Append to the log file, don't overwrite
)

# Log a message when the app starts
logging.info('Flask app starting...')

# Initializing the Flask app
app = Flask(__name__)

# Configuration from the config file
app.config.from_object('backend.config.Config')

# Initializing the database
db.init_app(app)

# Register routes
app.register_blueprint(app_routes)

# Route for testing if the app is running
@app.route('/')
def home():
    # Log when the route is accessed
    logging.info('Home route accessed')
    return "MoMo Data Analysis App is running!"

# Run the Flask application
if __name__ == "__main__":
    # Log when the application starts
    logging.info('Starting the application...')
    app.run(debug=True)
