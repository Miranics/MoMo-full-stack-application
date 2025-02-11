import xml.etree.ElementTree as ET

def parse_sms_transactions(xml_file):
    """
    Parses an XML file containing MoMo SMS transactions.

    Args:
        xml_file (str): Path to the XML file.

    Returns:
        list: A list of dictionaries containing transaction details.
    """
    transactions = []
    
    try:
        # Parse the XML file
        tree = ET.parse(xml_file)
        root = tree.getroot()

        # Iterate through all 'transaction' elements
        for transaction in root.findall("transaction"):
            phone_number = transaction.find("phone_number").text
            amount = int(transaction.find("amount").text)
            transaction_type = transaction.find("transaction_type").text
            timestamp = transaction.find("timestamp").text

            transactions.append({
                "phone_number": phone_number,
                "amount": amount,
                "transaction_type": transaction_type,
                "timestamp": timestamp
            })
        
        return transactions

    except Exception as e:
        print(f"Error parsing XML file: {e}")
        return []
