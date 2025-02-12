from flask import Flask

def create_app():
    app = Flask(__name__)

    from backend.routes import app_routes  # Import after app is created
    app.register_blueprint(app_routes)

    return app
