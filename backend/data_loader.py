import os
from sqlalchemy.orm import sessionmaker
from backend.database import engine
from backend.models import Transaction
from backend.sms_parser import parse_momo_sms

# Set correct path to data file
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # Go to project root
DATA_FILE_PATH = os.path.join(BASE_DIR, "data", "momo_sms.xml")  # Ensure correct path

# Create a new database session
SessionLocal = sessionmaker(bind=engine)
session = SessionLocal()

def insert_transactions(xml_file=DATA_FILE_PATH):
    """
    Inserts parsed transactions from an XML file into the database.

    Args:
        xml_file (str): Path to the XML file containing transaction data.
    """
    transactions = parse_momo_sms(xml_file)

    if not transactions:
        print("No transactions to insert.")
        return

    try:
        # Iterate over transactions and add them to the session
        for tx in transactions:
            new_tx = Transaction(
                phone_number=tx["phone_number"],
                amount=tx["amount"],
                transaction_type=tx["transaction_type"],
                timestamp=tx["timestamp"]
            )
            session.add(new_tx)
        
        # Commit all changes to the database
        session.commit()
        print(f"Successfully inserted {len(transactions)} transactions into the database.")

    except Exception as e:
        session.rollback()  # Rollback in case of error
        print(f"Error inserting transactions: {e}")

    finally:
        session.close()  # Close the session

# Example usage
if __name__ == "__main__":
    insert_transactions()
