from flask import Blueprint, request, jsonify
from database import SessionLocal
from models import Transaction, User

api = Blueprint("api", __name__)

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
