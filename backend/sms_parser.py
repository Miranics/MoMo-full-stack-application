import xml.etree.ElementTree as ET
import re
import os
from datetime import datetime

# Set correct path to data file
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_FILE_PATH = os.path.join(BASE_DIR, "data", "momo_sms.xml")

def clean_xml(file_path):
    """Removes invalid characters from the XML file before parsing."""
    with open(file_path, "r", encoding="utf-8") as file:
        content = file.read()
    cleaned_content = re.sub(r"[^\x20-\x7E\n\r]", "", content)
    with open(file_path, "w", encoding="utf-8") as file:
        file.write(cleaned_content)

def parse_momo_sms(xml_file=DATA_FILE_PATH):
    """Parses the XML file containing MoMo transaction messages."""
    transactions = []
    clean_xml(xml_file)
    try:
        tree = ET.parse(xml_file)
        root = tree.getroot()
        for message in root.findall(".//sms"):  # Locate all SMS entries
            content = message.get("body")
            if content:
                parsed_data = extract_transaction_details(content)
                if parsed_data:
                    transactions.append(parsed_data)
    except ET.ParseError as e:
        print(f"XML Parsing Error: {e}")
    except FileNotFoundError:
        print(f"Error: The file {xml_file} was not found.")
    except Exception as e:
        print(f"Unexpected error: {e}")
    return transactions

def extract_transaction_details(sms_body):
    """Extracts transaction details from SMS content."""
    try:
        amount_match = re.search(r"(\d{1,})\s*RWF", sms_body)
        receiver_match = re.search(r"to\s+([A-Za-z]+\s+[A-Za-z]+)", sms_body)
        phone_match = re.search(r"\((\d{9,12})\)", sms_body)
        tx_id_match = re.search(r"TxId:\s*(\d+)", sms_body)
        date_match = re.search(r"(\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2})", sms_body)
        
        if not all([amount_match, receiver_match, date_match]):
            print(f"Error: Could not extract transaction details from SMS: {sms_body}")
            return None
        
        amount = int(amount_match.group(1))
        receiver = receiver_match.group(1)
        phone_number = phone_match.group(1) if phone_match else None
        tx_id = tx_id_match.group(1) if tx_id_match else None
        timestamp = datetime.strptime(date_match.group(1), "%Y-%m-%d %H:%M:%S")
        
        return {
            "phone_number": phone_number,
            "receiver": receiver,
            "amount": amount,
            "transaction_type": "Deposit" if "received" in sms_body else "Withdrawal",
            "timestamp": timestamp,
            "transaction_id": tx_id
        }
    except Exception as e:
        print(f"Unexpected error extracting transaction details: {e}")
        return None

# Example usage
if __name__ == "__main__":
    transactions = parse_momo_sms()
    for tx in transactions:
        print(tx)
