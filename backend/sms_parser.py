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
        # Updated transaction patterns to match actual SMS messages
        transaction_patterns = {
            r"received \d+\s*RWF from": "Incoming Money",
            r"payment of .+ to .+ has been completed": "Payment",
            r"transferred to .+ from \d+": "Transfer",
            r"bank deposit of": "Bank Deposit",
            r"withdrawn at": "Withdrawal",
            r"bought airtime": "Airtime Purchase",
            r"electricity": "Cash Power Bill Payment",
            r"DIRECT PAYMENT": "Third Party Payment",
            r"internet bundle": "Internet Bundle",
            r"bank transfer": "Bank Transfer"
        }

        # Amount pattern - updated to handle amounts with commas
        amount_match = re.search(r"(?:received|payment of|deposit of|transferred) (?:RWF\s*)?(\d{1,3}(?:,\d{3})*)\s*(?:RWF)?", sms_body)
        if not amount_match:
            return None
        
        # Clean and convert amount
        amount = float(amount_match.group(1).replace(",", ""))
        
        # Phone number pattern - updated to handle different formats
        phone_match = re.search(r"\(([*\d]{10,12})\)", sms_body)
        phone_number = phone_match.group(1) if phone_match else "UNKNOWN"
        
        # Determine transaction type
        transaction_type = "Unknown"
        for pattern, ttype in transaction_patterns.items():
            if re.search(pattern, sms_body, re.IGNORECASE):
                transaction_type = ttype
                break
        
        # Date pattern - support multiple formats
        date_patterns = [
            r"(\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2})",  # YYYY-MM-DD HH:MM:SS
            r"(\d{2}/\d{2}/\d{4}\s+\d{2}:\d{2})",        # DD/MM/YYYY HH:MM
            r"(\d{2}-\d{2}-\d{4}\s+\d{2}:\d{2})"         # DD-MM-YYYY HH:MM
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
                        if len(date_str.split("-")[0]) == 4:  # YYYY-MM-DD
                            if len(date_str) > 16:  # Has seconds
                                timestamp = datetime.strptime(date_str, "%Y-%m-%d %H:%M:%S")
                            else:
                                timestamp = datetime.strptime(date_str, "%Y-%m-%d %H:%M")
                        else:  # DD-MM-YYYY
                            timestamp = datetime.strptime(date_str, "%d-%m-%Y %H:%M")
                    break
                except ValueError as e:
                    print(f"Date parsing error: {e} for date_str: {date_str}")
                    continue
                
        return {
            "phone_number": phone_number,
            "amount": amount,
            "transaction_type": transaction_type,
            "timestamp": timestamp
        }
        
    except Exception as e:
        print(f"Error parsing SMS body: {e}")
        print(f"Problematic SMS: {sms_body[:100]}...")  # Print first 100 chars of problematic SMS
        return None

if __name__ == "__main__":
    transactions = parse_momo_sms()
    print(f"Found {len(transactions)} transactions")
    if transactions:
        print("Sample transaction:", transactions[0])