import mysql.connector
from mysql.connector import Error
from backend.config import Config
from backend.sms_parser import parse_momo_sms

def insert_transactions(transactions):
    """
    Inserts parsed transactions into the MySQL database.

    Args:
        transactions (list): A list of dictionaries containing transaction details.
    """
    if not transactions:
        print("No transactions to insert.")
        return

    try:
        # Establish database connection
        connection = mysql.connector.connect(
            host=Config.DB_HOST,
            user=Config.DB_USER,
            password=Config.DB_PASSWORD,
            database=Config.DB_NAME,
            port=Config.DB_PORT
        )

        if connection.is_connected():
            cursor = connection.cursor()
            
            insert_query = """
            INSERT INTO transactions (phone_number, amount, transaction_type, timestamp)
            VALUES (%s, %s, %s, %s)
            """

            transaction_data = [
                (tx["phone_number"], tx["amount"], tx["transaction_type"], tx["timestamp"])
                for tx in transactions
            ]

            cursor.executemany(insert_query, transaction_data)
            connection.commit()

            print(f"Inserted {cursor.rowcount} transactions successfully.")

    except Error as e:
        print(f"Database error: {e}")

    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()
            print("Database connection closed.")

if __name__ == "__main__":
    transactions = parse_momo_sms()
    insert_transactions(transactions)
