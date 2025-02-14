import mysql.connector
from mysql.connector import Error
from backend.config import Config
from backend.sms_parser import parse_momo_sms
import os
import gc
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def insert_transactions(transactions, batch_size=10):  # Smaller batch size
    if not transactions:
        print("No transactions to insert.")
        return

    connection = None
    cursor = None
    total_inserted = 0

    try:
        connection = mysql.connector.connect(
            host=os.getenv('DB_HOST'),
            user=os.getenv('DB_USER'),
            password=os.getenv('DB_PASSWORD'),
            database=os.getenv('DB_NAME'),
            port=int(os.getenv('DB_PORT', 12210)),
            connect_timeout=30,
            buffered=True  # Use buffered cursor
        )

        if connection.is_connected():
            cursor = connection.cursor()
            
            # Process in smaller batches
            for i in range(0, len(transactions), batch_size):
                batch = transactions[i:i + batch_size]
                
                insert_query = """
                INSERT INTO transactions 
                (phone_number, amount, transaction_type, timestamp) 
                VALUES (%s, %s, %s, %s)
                """
                
                values = []
                for t in batch:
                    values.append((
                        str(t['phone_number'])[:20],
                        int(t['amount']),
                        str(t['transaction_type'])[:20],
                        t['timestamp']
                    ))
                
                cursor.executemany(insert_query, values)
                connection.commit()
                total_inserted += len(batch)
                print(f"Progress: {total_inserted}/{len(transactions)}")

                # Clear memory
                del batch
                del values
                gc.collect()  # Force garbage collection

    except Error as e:
        print(f"Database error: {e}")
        if connection and connection.is_connected():
            connection.rollback()
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()
            print("MySQL connection closed")

def load_data():
    try:
        transactions = parse_momo_sms()
        if transactions:
            print(f"Found {len(transactions)} transactions")
            # Process transactions in chunks
            chunk_size = 100
            for i in range(0, len(transactions), chunk_size):
                chunk = transactions[i:i + chunk_size]
                insert_transactions(chunk)
                del chunk
                gc.collect()
            print("Data loading completed")
    except Exception as e:
        print(f"Error in load_data: {e}")

if __name__ == "__main__":
    load_data()