import xml.etree.ElementTree as ET
from datetime import datetime
from backend.utils import get_data_file_path  # Import function for correct path handling

def parse_momo_sms():
    """
    Parses the XML file containing MoMo transaction messages.
    
    Returns:
        list: A list of dictionaries containing transaction details.
    """
    transactions = []
    xml_file = get_data_file_path()  # Get correct XML file path
    
    try:
        tree = ET.parse(xml_file)
        root = tree.getroot()
        
        for message in root.findall(".//sms"):  # Locate all SMS entries
            content = message.get("body")  # Extract SMS body
            
            if content and "Mobile Money" in content:
                parsed_data = extract_transaction_details(content)
                if parsed_data:
                    transactions.append(parsed_data)
    except Exception as e:
        print(f"Error parsing XML file: {e}")
    
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
        # Example: Extract amount, phone number, type, and timestamp from SMS
        words = sms_body.split()
        amount = int(words[words.index("RWF") - 1])  # Assuming amount is before "RWF"
        phone_number = words[-1]  # Assumes phone number is last
        transaction_type = "Deposit" if "received" in sms_body else "Withdrawal"
        timestamp = datetime.utcnow()
        
        return {
            "phone_number": phone_number,
            "amount": amount,
            "transaction_type": transaction_type,
            "timestamp": timestamp
        }
    except Exception as e:
        print(f"Error extracting transaction details: {e}")
        return None

# Example usage:
if __name__ == "__main__":
    transactions = parse_momo_sms()
    for tx in transactions:
        print(tx)
