from flask import Blueprint, request, jsonify
from backend.database import SessionLocal
from backend.models import Transaction, User

# Correct Blueprint name (should match app.py)
api = Blueprint("api", __name__)  # Renamed from 'app_routes' to 'api'

@api.route("/transactions", methods=["GET"])
def get_transactions():
    session = SessionLocal()
    transactions = session.query(Transaction).all()
    session.close()
    return jsonify([{
        "id": tx.id,
        "phone_number": tx.phone_number,
        "amount": tx.amount,
        "transaction_type": tx.transaction_type,
        "timestamp": tx.timestamp
    } for tx in transactions])

@api.route("/users", methods=["GET"])
def get_users():
    session = SessionLocal()
    users = session.query(User).all()
    session.close()
    return jsonify([{
        "id": user.id,
        "name": user.name,
        "phone_number": user.phone_number
    } for user in users])
