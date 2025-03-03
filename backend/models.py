from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from backend.database import Base

class User(Base):
    __tablename__ = 'users'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    phone_number = Column(String(15), unique=True, nullable=False)

    # Relationship: One user can have many transactions
    transactions = relationship("Transaction", back_populates="user")

class Transaction(Base):
    __tablename__ = 'transactions'

    id = Column(Integer, primary_key=True, autoincrement=True)
    phone_number = Column(String(20))  # Increased length to handle masked numbers
    amount = Column(Float, nullable=False)
    transaction_type = Column(String(100), nullable=False)  # Increased length
    timestamp = Column(DateTime, nullable=False)

    # Relationship back to User
    user = relationship("User", back_populates="transactions")
