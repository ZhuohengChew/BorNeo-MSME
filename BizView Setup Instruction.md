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
