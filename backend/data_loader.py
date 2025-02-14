import mysql.connector
from backend.sms_parser import parse_momo_sms
from backend.config import DB_CONFIG

def insert_transactions():
    """
    Inserts parsed transactions into the database.
    """
    transactions = parse_momo_sms()
    
    if not transactions:
        print("No transactions to insert.")
        return

    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor()

        insert_query = """
        INSERT INTO transactions (phone_number, amount, transaction_type, timestamp)
        VALUES (%s, %s, %s, %s)
        """

        for tx in transactions:
            cursor.execute(insert_query, (tx["phone_number"], tx["amount"], tx["transaction_type"], tx["timestamp"]))

        conn.commit()
        print(f"Inserted {cursor.rowcount} transactions successfully.")

    except mysql.connector.Error as e:
        print(f"Database error: {e}")
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

if __name__ == "__main__":
    insert_transactions()
