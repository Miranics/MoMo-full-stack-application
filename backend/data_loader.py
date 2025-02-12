from sqlalchemy.orm import sessionmaker
from database import engine
from models import Transaction
from sms_parser import parse_sms_transactions

# Create a new database session
SessionLocal = sessionmaker(bind=engine)
session = SessionLocal()

def insert_transactions(xml_file):
    """
    Inserts parsed transactions from an XML file into the database.

    Args:
        xml_file (str): Path to the XML file containing transaction data.
    """
    transactions = parse_sms_transactions(xml_file)

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
    insert_transactions("data/momo_sms.xml")
