#!/usr/bin/env bash
# Running Flask application with this shell script

# Detect OS and activate the virtual environment
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" ]]; then
    source venv/Scripts/activate
else
    source mimi/bin/activate
fi

# Load environment variables from .env
export $(grep -v '^#' .env | xargs)

# Set Flask environment variable
export FLASK_APP=backend/app.py

# Run Flask server (accessible externally)
flask run --host=0.0.0.0 --port=8000

