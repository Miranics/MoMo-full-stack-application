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
        # Clean XML first
        cleaned_xml = clean_xml(xml_file)
        if not cleaned_xml:
            return transactions
            
        root = ET.fromstring(cleaned_xml)
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
        # Transaction type patterns with more specific categories
        transaction_patterns = {
            r"received money from": "Incoming Money",
            r"paid to": "Payment",
            r"transferred to": "Transfer",
            r"deposited": "Deposit",
            r"withdrawn at": "Withdrawal",
            r"bought airtime": "Airtime Purchase",
            r"paid electricity": "Utility Payment",
            r"paid water": "Utility Payment",
            r"bank transfer to": "Bank Transfer",
            r"internet bundle": "Internet Bundle"
        }

        # Amount pattern
        amount_match = re.search(r"(\d{1,3}(?:,\d{3})*)\s*RWF", sms_body)
        if not amount_match:
            return None
        
        # Clean and convert amount
        amount = float(amount_match.group(1).replace(",", ""))
        
        # Phone number pattern
        phone_match = re.search(r"\((\d{10,12})\)", sms_body)
        phone_number = phone_match.group(1) if phone_match else "UNKNOWN"
        
        # Determine transaction type
        transaction_type = "Unknown"
        for pattern, ttype in transaction_patterns.items():
            if re.search(pattern, sms_body, re.IGNORECASE):
                transaction_type = ttype
                break
        
        # Date pattern - support multiple formats
        date_patterns = [
            r"(\d{2}/\d{2}/\d{4}\s+\d{2}:\d{2})",
            r"(\d{2}-\d{2}-\d{4}\s+\d{2}:\d{2})",
            r"(\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2})"
        ]
        
        timestamp = datetime.now()
        for pattern in date_patterns:
            date_match = re.search(pattern, sms_body)
            if date_match:
                try:
                    date_str = date_match.group(1)
                    if "/" in date_str:
                        timestamp = datetime.strptime(date_str, "%d/%m/%Y %H:%M")
                    elif "-" in date_str:
                        if date_str[4] == "-":  # YYYY-MM-DD format
                            timestamp = datetime.strptime(date_str, "%Y-%m-%d %H:%M")
                        else:  # DD-MM-YYYY format
                            timestamp = datetime.strptime(date_str, "%d-%m-%Y %H:%M")
                    break
                except ValueError:
                    continue
                
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