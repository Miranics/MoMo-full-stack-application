#!/usr/bin/env python
# app.py - Main Flask application

from flask import Flask
from backend.routes import app_routes
from backend.database import db

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
    return "MoMo Data Analysis App is running!"

# Run the Flask application
if __name__ == "__main__":
    app.run(debug=True)
