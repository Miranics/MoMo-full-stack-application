import re

def escape_xml_chars(text):
    """Escape XML special characters in text"""
    replacements = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&apos;'
    }
    for char, escape in replacements.items():
        text = text.replace(char, escape)
    return text

def fix_xml_file(input_file, output_file):
    with open(input_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find all body="..." attributes and escape their content
    def replace_body(match):
        body_content = match.group(1)
        escaped_content = escape_xml_chars(body_content)
        return f'body="{escaped_content}"'
    
    fixed_content = re.sub(r'body="([^"]*)"', replace_body, content)
    
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(fixed_content)

if __name__ == '__main__':
    input_file = 'data/momo_sms.xml'
    output_file = 'data/momo_sms_fixed.xml'
    fix_xml_file(input_file, output_file)
    print("XML file fixed successfully!")