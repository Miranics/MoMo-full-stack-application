from sqlalchemy.orm import sessionmaker
from backend.database import engine
from backend.models import Transaction
from backend.sms_parser import parse_momo_sms  # Fix incorrect function name
from backend.utils import get_data_file_path  # Ensure correct XML path

# Create a new database session
SessionLocal = sessionmaker(bind=engine)
session = SessionLocal()

def insert_transactions():
    """
    Inserts parsed transactions from the XML file into the database.
    """
    xml_file = get_data_file_path()  # Get correct XML file path
    transactions = parse_momo_sms()  # Use the updated parser function

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
