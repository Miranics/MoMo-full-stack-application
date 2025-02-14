import os
from bs4 import BeautifulSoup

def check_xml():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    xml_path = os.path.join(base_dir, 'data', 'momo_sms.xml')
    
    try:
        with open(xml_path, 'r') as file:
            content = file.read()
            soup = BeautifulSoup(content, 'xml')
            
            # Check root element
            root = soup.find('smses')
            print(f"\nRoot element attributes: {root.attrs if root else 'Not found'}")
            
            # Find all SMS messages
            sms_messages = soup.find_all('sms')
            print(f"\nFound {len(sms_messages)} SMS messages")
            
            if sms_messages:
                print("\nFirst SMS details:")
                first_sms = sms_messages[0]
                print(f"Address: {first_sms.get('address')}")
                print(f"Date: {first_sms.get('date')}")
                print(f"Type: {first_sms.get('type')}")
                print(f"Body: {first_sms.get('body')[:100]}...")
    
    except Exception as e:
        print(f"Error: {str(e)}")

if __name__ == "__main__":
    check_xml()