#!/usr/bin/env bash
# Running Flask application with this shell script

# Detect the OS and activate the virtual environment accordingly
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" ]]; then
    # For Windows (Git Bash)
    source venv/Scripts/activate
else
    # For Linux/macOS
    source venv/bin/activate
fi

# Install missing dependencies
pip install -r backend/requirements.txt

# Set Flask environment variable
export FLASK_APP=backend/app.py

# Run Flask server (accessible externally)
flask run --host=0.0.0.0 --port=8000
