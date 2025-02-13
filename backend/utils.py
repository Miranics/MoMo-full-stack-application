import os

def get_data_file_path():
    """Returns the absolute path to the momo_sms.xml file"""
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # Project root
    return os.path.join(base_dir, "data", "momo_sms.xml")
