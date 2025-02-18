# MTN MoMo Data Analytics Platform 📊

![MTN MoMo Analytics Dashboard](![image](https://github.com/user-attachments/assets/ed95645d-76c9-4d48-8ba4-a746f3c22efd)
)

A comprehensive full-stack web application for analyzing MTN Mobile Money (MoMo) transaction data. This platform provides real-time insights, interactive visualizations, and detailed transaction analysis for mobile payment data.

## 📌 Table of Contents
- [Features](#-features)
- [Technology Stack](#%EF%B8%8F-technology-stack)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [API Documentation](#-api-documentation)
- [Database Schema](#-database-schema)
- [Frontend Components](#-frontend-components)
- [Security](#-security)
- [Development](#-development)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

## 🚀 Features

### Dashboard Analytics
- Real-time transaction monitoring and analysis
- Interactive charts using Chart.js
- Transaction volume visualization
- Distribution analysis by transaction type
- Key metrics overview (total transactions, amounts, trends)

### Transaction Management
- Comprehensive transaction listing with pagination
- Advanced filtering system by:
  - Transaction type
  - Date range
  - Amount
  - User/Phone number
- Detailed transaction view with historical data

### Data Visualization
- Bar charts for transaction volume analysis
- Pie charts for transaction type distribution
- Time-series analysis
- Custom date range selection
- Export capabilities

### User Interface
- Modern, responsive design
- Intuitive navigation
- Mobile-friendly layout
- Real-time data updates
- Interactive components

## 🛠️ Technology Stack

### Backend (Python)
- **Framework**: Flask 2.0+
- **Database**: MySQL (Aiven Cloud Database)
- **ORM**: SQLAlchemy
- **API**: RESTful Architecture
- **Security**: CORS, SSL/TLS
- **Documentation**: OpenAPI/Swagger

### Frontend (JavaScript)
- **HTML5/CSS3**: Modern layout and responsive design
- **JavaScript**: ES6+ features
- **Charts**: Chart.js for data visualization
- **API Integration**: Fetch API
- **Styling**: Custom CSS with responsive design

### DevOps & Infrastructure
- **Hosting**: AWS EC2
- **Database**: Aiven MySQL Cloud
- **Web Server**: Nginx
- **SSL/TLS**: Required for database connections
- **Version Control**: Git

## 📂 Project Structure

```
momo-full-stack-application/
├── backend/
│   ├── __init__.py
│   ├── app.py              # Main Flask application
│   ├── config.py           # Configuration management
│   ├── database.py         # Database connection
│   ├── models.py           # SQLAlchemy models
│   ├── routes.py           # API endpoints
│   └── requirements.txt    # Python dependencies
├── frontend/
│   ├── index.html         # Welcome page
│   ├── dashboard.html     # Main dashboard
│   ├── transactions.html  # Transaction list
│   ├── visualizations.html# Data visualizations
│   ├── styles.css         # Stylesheets
│   ├── api.js            # API integration
│   ├── script.js         # Main JavaScript
│   └── charts.js         # Chart configurations
└── README.md
```

## 🔧 Installation

1. Clone the repository:
```bash
git clone https://github.com/Miranics/MoMo-full-stack-application.git
cd MoMo-full-stack-application
```

2. Set up the backend:
```bash
cd backend
python -m venv mimi
source mimi/bin/activate  # Windows: mimi\Scripts\activate
pip install -r requirements.txt
```

3. Configure environment variables:
```bash
# Create .env file in backend directory
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=your_db_host
DB_PORT=3306
DB_NAME=your_db_name
```

4. Initialize the database:
```python
from backend.database import Base, engine
Base.metadata.create_all(bind=engine)
```

## ⚙️ Configuration

### Backend Configuration (config.py)
```python
class Config:
    SQLALCHEMY_DATABASE_URI = "mysql+pymysql://..."
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SSL_ARGS = {"ssl": {"ssl_mode": "REQUIRED"}}
```

### Frontend Configuration (api.js)
```javascript
const API_BASE_URL = 'http://your-api-domain:8000/api';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache
```

## 📡 API Documentation

### Transaction Endpoints
```
GET /api/transactions          # Get all transactions
GET /api/transactions/stats    # Get transaction statistics
GET /api/users                # Get all users
GET /api/health               # Health check endpoint
```

### Response Format
```json
{
  "transactions": [
    {
      "id": 1,
      "phone_number": "123456789",
      "amount": 1000.00,
      "transaction_type": "PAYMENT",
      "timestamp": "2024-02-18T15:52:58"
    }
  ]
}
```

## 💾 Database Schema

### Users Table
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(15) UNIQUE NOT NULL
);
```

### Transactions Table
```sql
CREATE TABLE transactions (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    phone_number VARCHAR(15) NOT NULL,
    amount FLOAT NOT NULL,
    transaction_type VARCHAR(50) NOT NULL,
    timestamp DATETIME NOT NULL,
    FOREIGN KEY (phone_number) REFERENCES users(phone_number)
);
```

## 🎨 Frontend Components

### Transaction Types
- Incoming Money
- Payments to Code Holders
- Transfers to Mobile Numbers
- Bank Deposits
- Airtime Bill Payments
- Cash Power Bill Payments
- Third Party Transactions
- Agent Withdrawals
- Bank Transfers
- Internet/Voice Bundles

### Visualization Components
- Transaction Volume Chart
- Distribution Pie Chart
- Time Series Analysis
- Custom Date Range Selector

## 🔒 Security

- SSL/TLS encryption for database connections
- CORS protection
- Environment variable management
- SQL injection prevention
- Input validation and sanitization
- Rate limiting
- Error handling and logging

## 🔧 Development

### Running Locally
```bash
# Backend
cd backend
flask run --debug

# Frontend
cd frontend
# Use live server or open HTML files directly
```

### Testing
```bash
# Run Python tests
python -m pytest

# Check API endpoints
curl http://localhost:5000/api/health
```

## 🚀 Deployment

### AWS EC2 Deployment
1. Configure EC2 instance
2. Set up Nginx
3. Configure SSL/TLS
4. Set up environment variables
5. Run application with gunicorn

### Database Setup
```bash
mysql -h your-aiven-host -u your-user -p
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Authors

**Miracle** - [Miranics](https://github.com/Miranics)

## 📞 Support

For support:
- Create an issue in the repository
- Contact: [African Leadership University]
- Documentation: [https://github.com/Miranics/MoMo-full-stack-application/edit/main/README.md]

## 🙏 Acknowledgments

- MTN for inspiration and support
- Chart.js team for visualization library
- Flask and SQLAlchemy communities

---
Last updated: 2025-02-18
