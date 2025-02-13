#!/usr/bin/env bash
# Run the Flask application

# virtual environment activated 
source venv/bin/activate

# Flask environment variable all set up
export FLASK_APP=backend/app.py

# Run Flask server
flask run
