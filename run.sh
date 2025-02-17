#!/usr/bin/env bash
# Running Flask application with Gunicorn

# Detect the OS and activate the virtual environment accordingly
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" ]]; then
    # For Windows (Git Bash)
    source venv/Scripts/activate
else
    # For Linux/macOS
    source venv/bin/activate
fi

# Install Gunicorn if it's missing
if ! pip list | grep -q gunicorn; then
    echo "Gunicorn not found. Installing..."
    pip install gunicorn
fi

# Run Gunicorn with 4 workers, binding to port 5000
gunicorn -w 4 -b 0.0.0.0:5001 app:app
