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
            for i in range(0, len(transactions), batch_size):
                batch = transactions[i:i + batch_size]
                
                insert_query = """
                INSERT INTO transactions 
                (phone_number, amount, transaction_type, timestamp) 
                VALUES (%s, %s, %s, %s)
                """
                
                values = [
                    (str(t['phone_number'])[:20],
                     int(t['amount']),
                     str(t['transaction_type'])[:20],
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
        transactions = parse_momo_sms()
        if transactions:
            print(f"Found {len(transactions)} transactions")
            # Process in smaller chunks
            for i in range(0, len(transactions), 50):
                chunk = transactions[i:i+50]
                insert_transactions(chunk, batch_size=5)
                del chunk
                gc.collect()
    except Exception as e:
        print(f"Error in load_data: {e}")

if __name__ == "__main__":
    load_data()