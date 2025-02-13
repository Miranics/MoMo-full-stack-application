import xml.etree.ElementTree as ET

def validate_xml(xml_file):
    try:
        tree = ET.parse(xml_file)
        root = tree.getroot()
        print("XML is well-formed!")
        return True
    except ET.ParseError as e:
        print(f"XML validation error: {str(e)}")
        # Get line and column numbers from the error
        line_num = e.position[0]
        col_num = e.position[1]
        print(f"Error at line {line_num}, column {col_num}")
        
        # Print the problematic line
        with open(xml_file, 'r', encoding='utf-8') as f:
            lines = f.readlines()
            if line_num <= len(lines):
                print("\nProblematic line:")
                print(lines[line_num - 1])
                print(" " * (col_num - 1) + "^")
        return False

if __name__ == "__main__":
    xml_file = "data/momo_sms.xml"
    validate_xml(xml_file)