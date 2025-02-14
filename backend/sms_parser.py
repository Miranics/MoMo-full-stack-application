import os
import re
import xml.etree.ElementTree as ET
from datetime import datetime
from bs4 import BeautifulSoup

# Set correct path to data file
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_FILE_PATH = os.path.join(BASE_DIR, "data", "momo_sms.xml")

def clean_xml(file_path):
    """Clean and validate XML file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            content = file.read()
        soup = BeautifulSoup(content, 'xml')
        return str(soup)
    except Exception as e:
        print(f"Error cleaning XML: {e}")
        return None

def parse_momo_sms(xml_file=DATA_FILE_PATH):
    """Parse MoMo SMS messages from XML file"""
    transactions = []
    try:
        tree = ET.parse(xml_file)
        root = tree.getroot()
        for message in root.findall(".//sms"):
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
    """Extracts transaction details from SMS content"""
    try:
        # Amount pattern
        amount_match = re.search(r"(\d{1,3}(?:,\d{3})*)\s*RWF", sms_body)
        
        # Phone number pattern
        phone_match = re.search(r"\((\d{10,12})\)", sms_body)
        
        # Transaction type patterns
        deposit_pattern = re.search(r"received|deposited", sms_body, re.IGNORECASE)
        withdrawal_pattern = re.search(r"withdrawn|sent", sms_body, re.IGNORECASE)
        
        # Date pattern
        date_match = re.search(r"(\d{2}/\d{2}/\d{4}\s+\d{2}:\d{2})", sms_body)
        
        if not amount_match:
            return None
            
        # Clean and convert amount
        amount = int(amount_match.group(1).replace(",", ""))
        
        # Get phone number
        phone_number = phone_match.group(1) if phone_match else "UNKNOWN"
        
        # Determine transaction type
        if deposit_pattern:
            transaction_type = "DEPOSIT"
        elif withdrawal_pattern:
            transaction_type = "WITHDRAWAL"
        else:
            transaction_type = "UNKNOWN"
            
        # Parse timestamp
        timestamp = datetime.now()
        if date_match:
            try:
                timestamp = datetime.strptime(date_match.group(1), "%d/%m/%Y %H:%M")
            except ValueError:
                pass
                
        return {
            "phone_number": phone_number,
            "amount": amount,
            "transaction_type": transaction_type,
            "timestamp": timestamp
        }
        
    except Exception as e:
        print(f"Error parsing SMS body: {e}")
        return None

if __name__ == "__main__":
    transactions = parse_momo_sms()
    print(f"Found {len(transactions)} transactions")
    if transactions:
        print("Sample transaction:", transactions[0])