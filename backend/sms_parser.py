import xml.etree.ElementTree as ET
import re
import os
from datetime import datetime

# Set correct path to data file
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # Go up to project root
DATA_FILE_PATH = os.path.join(BASE_DIR, "data", "momo_sms.xml")  # Correct file path

def clean_xml(file_path):
    """Removes invalid characters from the XML file before parsing."""
    with open(file_path, "r", encoding="utf-8") as file:
        content = file.read()

    # Remove non-printable characters (except newlines)
    cleaned_content = re.sub(r"[^\x20-\x7E\n\r]", "", content)

    with open(file_path, "w", encoding="utf-8") as file:
        file.write(cleaned_content)

def parse_momo_sms(xml_file=DATA_FILE_PATH):
    """
    Parses the XML file containing MoMo transaction messages.

    Args:
        xml_file (str): Path to the XML file.

    Returns:
        list: A list of dictionaries containing transaction details.
    """
    transactions = []

    # Clean XML file before parsing
    clean_xml(xml_file)

    try:
        tree = ET.parse(xml_file)
        root = tree.getroot()

        for message in root.findall(".//sms"):  # Locate all SMS entries
            content = message.get("body")  # Extract SMS body
            print(f"Extracted SMS: {content}")  # Debugging line
            
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
    """
    Extracts transaction details from SMS content.

    Args:
        sms_body (str): SMS text containing transaction details.

    Returns:
        dict: Extracted transaction details or None if parsing fails.
    """
    try:
        # Extract amount
        amount_match = re.search(r"payment of ([\d,]+) RWF", sms_body)
        amount = int(amount_match.group(1).replace(",", "")) if amount_match else None

        # Extract phone number (Assuming it's the last number in the message)
        phone_match = re.findall(r"\b\d{5}\b", sms_body)
        phone_number = phone_match[-1] if phone_match else None

        # Determine transaction type
        transaction_type = "Deposit" if "received" in sms_body else "Payment"

        # Extract timestamp
        timestamp_match = re.search(r"at (\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})", sms_body)
        timestamp = datetime.strptime(timestamp_match.group(1), "%Y-%m-%d %H:%M:%S") if timestamp_match else datetime.utcnow()

        if amount is None or phone_number is None:
            print(f"Error: Could not extract transaction details from SMS: {sms_body}")
            return None

        return {
            "phone_number": phone_number,
            "amount": amount,
            "transaction_type": transaction_type,
            "timestamp": timestamp
        }
    except Exception as e:
        print(f"Unexpected error extracting transaction details: {e}")
        return None

# Example usage
if __name__ == "__main__":
    transactions = parse_momo_sms()
    for tx in transactions:
        print(tx)
