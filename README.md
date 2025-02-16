# MoMo-full-stack-application
# MoMo Full-Stack Application 🚀💻

## 📝 Project Overview
This MoMo Full-Stack Application is an enterprise-level web application designed to categorize raw data, process it into a MySQL database, and provide an interactive user interface. The backend is built using Python with Flask and SQLAlchemy, with data extraction using `lxml`, `beautifulsoup4`, and `pandas`.

---
## ⚙️ Prerequisites
- Python 3.10+
- Virtual Environment
- MySQL Database
- .env file for environment variables

---
## 📦 Dependencies
Ensure you have Python installed. The following packages are installed in the virtual environment:
- `flask`
- `flask_sqlalchemy`
- `flask_migrate`
- `mysql-connector-python`
- `lxml`
- `beautifulsoup4`
- `pandas`

---
## 🛠️ Setup Instructions
1. **Clone the repository:**  
   ```bash
   git clone https://github.com/Miranics/MoMo-full-stack-application.git
   cd MoMo-full-stack-application
   ```
2. **Create a virtual environment:**  
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```
3. **Install dependencies:**  
   ```bash
   pip install -r requirements.txt
   ```
4. **Set environment variables:**  
   Create a `.env` file with the necessary configurations (e.g., database URL).

---
## 🚀 Running the Application
- **Development Mode:**  
  ```bash
  flask run --host=0.0.0.0 --port=5000
  ```
- **Check Health Status:**  
  ```bash
  curl http://127.0.0.1:5000/health
  ```

---
## 📡 API Endpoints
- `GET /transactions` - Retrieve all transactions.
- `GET /users` - Retrieve all users.
- `GET /health` - Check API health.

---
## 🖼️ App Dispay
```markdown
![App Dispay](images/mtn_logo.svg)
```

---
## 🤝 Contributors
- Nanen Miracle Mbanaade (002nasya@gmail.com)
- Akachi David Nwanze (d.akachi@alustudent.com)
- Abraham Chan Deng (a.garang@alustudent.com)
- Joan Kariza (j.kariza@alustudent.com)

---
## 🎥 Demo Video 📽️
[Paste Demo Video Link Here]

💙 Thank you for exploring our project! 🚀✨