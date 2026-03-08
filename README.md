# BorNeo - MSME Business Intelligence & Loan Pre-Eligibility System

A modern SaaS-style web application for Micro, Small & Medium Enterprises (MSMEs) built with Next.js 14 and FastAPI.

## 🚀 Features

### 🤖 ML-Powered Features
- **Random Forest Loan Scoring** - Auto-trained after 20 sales records
- **ARIMA Forecasting** - Statistical time-series forecasting (7+ days data)
- **Anomaly Detection** - Isolation Forest to detect unusual patterns

### 📊 Dashboard
- Real-time KPI metrics (revenue, profit, products, transactions)
- Monthly revenue trend visualization with Recharts
- Top products analysis

### 🏢 Business Registration
- Business profile setup and management
- Form validation with modern UI components

### 💳 Loan Center
- Intelligent loan scoring algorithm
- Maximum eligible loan amount calculation
- Loan provider recommendations

### 🎨 Modern UI/UX
- Next.js 14 with App Router
- TailwindCSS for styling
- shadcn/ui components
- Framer Motion animations
- Glassmorphism design
- Responsive mobile layout

## 🏗️ Architecture

```
├── frontend/          # Next.js 14 Application
│   ├── app/          # App Router pages
│   ├── components/   # Reusable UI components
│   └── lib/          # Utilities
└── backend/          # FastAPI Application
    ├── api.py        # Main API endpoints
    └── requirements.txt
```

## 📦 Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **React 18** - UI library
- **TypeScript** - Type safety
- **TailwindCSS** - Utility-first CSS
- **shadcn/ui** - Modern UI components
- **Recharts** - Data visualization
- **Framer Motion** - Animations
- **Axios** - HTTP client

### Backend
- **FastAPI** - Modern Python web framework
- **Pandas** - Data manipulation
- **Scikit-learn** - Machine learning
- **Statsmodels** - Statistical modeling
- **Uvicorn** - ASGI server

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Python 3.11+
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Start the FastAPI server:
```bash
python api.py
```

The API will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 🔧 API Endpoints

### Business Management
- `POST /api/business` - Create/update business profile
- `GET /api/business` - Get business profile

### Product Management
- `POST /api/products` - Add new product
- `GET /api/products` - Get all products

### Sales Management
- `POST /api/sales` - Record a sale
- `GET /api/sales` - Get all sales

### Data Import
- `POST /api/upload-csv` - Upload sales data from CSV

### Analytics
- `GET /api/analytics` - Get analytics data
- `GET /api/forecast` - Get demand forecast
- `POST /api/simulation` - Run what-if simulation

### Loan Services
- `GET /api/loan-score` - Get loan eligibility score

## 🎯 Usage

1. **Business Registration**: Start by registering your business profile (or click the 🎬 *Load Demo Data* button to preload a sample business, products and sales).
2. **Add Products**: Set up your product catalog or load the demo data on the POS page.
3. **Record Sales**: Add sales transactions manually or upload CSV; demo data is available via the Upload page.
4. **View Analytics**: Monitor your business performance with real metrics once data is loaded.
5. **Check Loan Eligibility**: Get your loan score and explore financing options (demo data automatically trains the ML model).

**Demo API**: POST `/api/demo` seeds the backend with sample business, products and sales. Use this endpoint for testing or let the front-end buttons call it automatically.

## 🤖 Machine Learning Models

### Random Forest Classifier
- **Purpose**: Loan eligibility scoring
- **Training**: Automatic after 20+ sales records
- **Features**: Revenue stability, profit margin, cash flow, debt ratio

### ARIMA Model
- **Purpose**: Time series forecasting
- **Data Requirement**: 7+ days of sales data
- **Output**: 30-day revenue forecast with confidence intervals

### Isolation Forest
- **Purpose**: Anomaly detection in sales patterns
- **Usage**: Identifies unusual sales transactions

## 📱 Responsive Design

The application is fully responsive and works seamlessly on:
- Desktop computers
- Tablets
- Mobile phones

## 🔒 Security

- CORS enabled for frontend-backend communication
- Input validation on all API endpoints
- Secure data handling practices

## 🚀 Deployment

### Backend Deployment
```bash
# Using Uvicorn
uvicorn api:app --host 0.0.0.0 --port 8000

# Or using Docker
docker build -t borneo-backend .
docker run -p 8000:8000 borneo-backend
```

### Frontend Deployment
```bash
# Build for production
npm run build

# Start production server
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support and questions, please open an issue on GitHub.

---

Built with ❤️ for MSMEs in Malaysia