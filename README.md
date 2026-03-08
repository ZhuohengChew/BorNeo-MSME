# BorNeo - MSME Business Intelligence & Loan System

[![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104.1-009688)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3.11+-3776AB)](https://python.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3.2-3178C6)](https://typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A modern SaaS-style web application for Micro, Small & Medium Enterprises (MSMEs) in Malaysia, providing AI-powered business intelligence, loan pre-eligibility assessment, and comprehensive analytics.

## ✨ What It Does

BorNeo transforms traditional business management for MSMEs by providing:

- **📊 Real-time Business Analytics**: Track revenue, profit margins, and product performance
- **🤖 AI-Powered Insights**: ML-driven demand forecasting, anomaly detection, and promotion strategies
- **💳 Loan Pre-Eligibility**: Intelligent scoring system matching businesses with suitable loan programs
- **🛒 Point-of-Sale System**: Complete inventory and sales management
- **📈 What-If Simulations**: Test discount and marketing scenarios before implementation

## 🚀 Why It's Useful

### For MSME Owners
- **Data-Driven Decisions**: Make informed choices backed by real analytics and AI insights
- **Loan Access**: Get pre-qualified for loans with personalized recommendations
- **Cost Optimization**: Identify optimal pricing and inventory strategies
- **Growth Planning**: Forecast demand and plan marketing campaigns effectively

### For Financial Institutions
- **Risk Assessment**: Access standardized business scoring for loan applications
- **Market Intelligence**: Understand MSME performance patterns and trends
- **Automated Matching**: Connect borrowers with appropriate loan products

## 🏗️ Architecture

```
├── frontend/          # Next.js 14 Application (TypeScript)
│   ├── app/          # App Router pages & API routes
│   ├── components/   # Reusable UI components (shadcn/ui)
│   └── lib/          # Utilities & configurations
└── backend/          # FastAPI Application (Python)
    ├── api.py        # Main API endpoints & ML models
    └── requirements.txt
```

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** with App Router - React framework
- **TypeScript** - Type safety and better DX
- **TailwindCSS** + **shadcn/ui** - Modern, accessible UI components
- **Recharts** - Data visualization
- **Axios** - HTTP client for API communication

### Backend
- **FastAPI** - High-performance async web framework
- **Pandas & NumPy** - Data manipulation and analysis
- **Scikit-learn** - Machine learning algorithms
- **Statsmodels** - Statistical modeling (ARIMA forecasting)

### Machine Learning Models
- **Random Forest Classifier** - Loan eligibility scoring
- **Isolation Forest** - Anomaly detection in sales patterns
- **ARIMA** - Time series forecasting for demand prediction

## 🚀 Quick Start

### Prerequisites
- **Node.js 18+** and **npm**
- **Python 3.11+**
- **Git**

### 1. Clone the Repository
```bash
git clone <repository-url>
cd borneo-msme-dashboard
```

### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Start the FastAPI server
python api.py
```
The API will be available at `http://localhost:8000`

### 3. Frontend Setup
```bash
# Open a new terminal and navigate to frontend directory
cd frontend

# Install Node.js dependencies
npm install

# Start the Next.js development server
npm run dev
```
The application will be available at `http://localhost:3000`

### 4. Access the Application
1. Open your browser and go to `http://localhost:3000`
2. Click **"🎬 Load Demo Business Profile"** to explore with sample data
3. Navigate through the different sections: Dashboard, POS, Analytics, Loan Center

## 📖 Usage Examples

### Business Registration
```typescript
// Register your business profile
const businessData = {
  business_name: "My Food Stall",
  business_type: "F&B",
  monthly_revenue: 15000,
  profit_margin: 25,
  years_operating: 3
}
```

### Recording Sales
```typescript
// Add products and record sales
const product = {
  name: "Nasi Lemak",
  price: 8.50,
  cost: 4.50,
  stock: 50
}

const sale = {
  product: "Nasi Lemak",
  quantity: 3,
  date: "2024-01-15"
}
```

### Analytics & Forecasting
```typescript
// Get AI-powered insights
const analytics = await api.get('/api/analytics')
const forecast = await api.get('/api/forecast')
const anomalies = await api.get('/api/anomalies')
```

## 🔧 Development

### Available Scripts

#### Frontend
```bash
cd frontend

# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

#### Backend
```bash
cd backend

# Activate virtual environment
venv\Scripts\activate  # Windows
source venv/bin/activate  # macOS/Linux

# Start development server
python api.py

# API Documentation (when running)
# http://localhost:8000/docs
```

### Project Structure
```
frontend/
├── app/                    # Next.js App Router
│   ├── (dashboard)/       # Protected dashboard routes
│   ├── api/               # Next.js API routes
│   └── globals.css        # Global styles
├── components/            # Reusable components
│   ├── ui/               # shadcn/ui components
│   └── dashboard-layout.tsx
└── lib/                   # Utilities

backend/
├── api.py                 # Main FastAPI application
└── requirements.txt       # Python dependencies
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details on:

- Setting up your development environment
- Code style and standards
- Submitting pull requests
- Reporting issues

### Development Workflow
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes and add tests
4. Run the full test suite: `npm test` (frontend) + manual testing
5. Submit a pull request

## 📚 Documentation

- **API Documentation**: Available at `http://localhost:8000/docs` when backend is running
- **Component Library**: shadcn/ui components documentation
- **FastAPI Guide**: [fastapi.tiangolo.com](https://fastapi.tiangolo.com/)
- **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)

## 🐛 Support & Help

### Getting Help
- **Issues**: [GitHub Issues](https://github.com/your-repo/issues) - Bug reports and feature requests
- **Discussions**: [GitHub Discussions](https://github.com/your-repo/discussions) - General questions and community support
- **Documentation**: Check the [API docs](http://localhost:8000/docs) for technical details

### Common Issues
- **Port conflicts**: Ensure ports 3000 (frontend) and 8000 (backend) are available
- **Python dependencies**: Always activate the virtual environment before running the backend
- **CORS errors**: Make sure both servers are running on the correct ports

## 👥 Maintainers

- **Project Lead**: [Your Name]
- **Contributors**: See [CONTRIBUTING.md](CONTRIBUTING.md) for the full list

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

Built with ❤️ for MSMEs in Malaysia. Special thanks to:

- The Malaysian SME community for inspiration
- Open source contributors to FastAPI, Next.js, and scikit-learn
- The shadcn/ui team for beautiful, accessible components

---

**Ready to transform your MSME?** Get started with BorNeo today! 🚀