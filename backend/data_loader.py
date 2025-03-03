import pymysql
from pymysql import Error
from backend.config import Config
from backend.sms_parser import parse_momo_sms
import os
import gc
from dotenv import load_dotenv

load_dotenv()

def get_connection():
    dbconfig = {
        "host": os.getenv('DB_HOST'),
        "user": os.getenv('DB_USER'),
        "password": os.getenv('DB_PASSWORD'),
        "database": os.getenv('DB_NAME'),
        "port": int(os.getenv('DB_PORT', 12210)),
        "ssl": {"ssl": True}
    }
    return pymysql.connect(**dbconfig)

def insert_transactions(transactions, batch_size=5):
    if not transactions:
        return

    try:
        connection = get_connection()
        with connection.cursor() as cursor:
            # First, alter the table to accommodate longer transaction types
            alter_query = """
            ALTER TABLE transactions 
            MODIFY COLUMN transaction_type VARCHAR(100),
            MODIFY COLUMN phone_number VARCHAR(20)
            """
            cursor.execute(alter_query)
            connection.commit()

            # Insert transactions
            insert_query = """
            INSERT INTO transactions 
            (phone_number, amount, transaction_type, timestamp) 
            VALUES (%s, %s, %s, %s)
            """
            
            for i in range(0, len(transactions), batch_size):
                batch = transactions[i:i + batch_size]
                values = [
                    (str(t['phone_number'])[:20],
                     float(t['amount']),  # Changed to float
                     str(t['transaction_type'])[:100],  # Increased length
                     t['timestamp']) for t in batch
                ]
                
                cursor.executemany(insert_query, values)
                connection.commit()
                print(f"Inserted batch {i//batch_size + 1}")
                
                del values
                del batch
                gc.collect()

    except Error as e:
        print(f"Database error: {e}")
    finally:
        if connection:
            connection.close()

def load_data():
    try:
        # Drop existing transactions
        connection = get_connection()
        with connection.cursor() as cursor:
            cursor.execute("TRUNCATE TABLE transactions")
            connection.commit()
        connection.close()

        # Load new transactions
        transactions = parse_momo_sms()
        if transactions:
            print(f"Found {len(transactions)} transactions")
            for i in range(0, len(transactions), 50):
                chunk = transactions[i:i+50]
                insert_transactions(chunk, batch_size=5)
                del chunk
                gc.collect()
            print("Data loading completed successfully")
    except Exception as e:
        print(f"Error in load_data: {e}")

if __name__ == "__main__":
    load_data()