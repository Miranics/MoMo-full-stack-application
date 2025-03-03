import pymysql
import os
from dotenv import load_dotenv

load_dotenv()

def update_database_schema():
    connection = None
    try:
        connection = pymysql.connect(
            host=os.getenv('DB_HOST'),
            user=os.getenv('DB_USER'),
            password=os.getenv('DB_PASSWORD'),
            database=os.getenv('DB_NAME'),
            port=int(os.getenv('DB_PORT', 12210)),
            ssl={"ssl": True}
        )

        with connection.cursor() as cursor:
            # Drop existing table
            cursor.execute("DROP TABLE IF EXISTS transactions")

            # Create new table with updated schema
            cursor.execute("""
                CREATE TABLE transactions (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    phone_number VARCHAR(20) NOT NULL,
                    amount FLOAT NOT NULL,
                    transaction_type VARCHAR(100) NOT NULL,
                    timestamp DATETIME NOT NULL
                )
            """)
            connection.commit()
            print("Database schema updated successfully")

    except Exception as e:
        print(f"Error updating schema: {e}")
    finally:
        if connection:
            connection.close()

if __name__ == "__main__":
    update_database_schema()