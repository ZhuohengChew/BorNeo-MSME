from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from typing import List, Dict, Optional
import uvicorn
from pydantic import BaseModel

# ML Models
from sklearn.ensemble import RandomForestClassifier, IsolationForest
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
try:
    from statsmodels.tsa.arima.model import ARIMA
    ARIMA_AVAILABLE = True
except:
    ARIMA_AVAILABLE = False

app = FastAPI(title="BorNeo MSME API", version="1.0.0")

@app.get("/")
def root():
    return {"message": "FastAPI backend is working!"}

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],  # Next.js dev server (support both ports)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# simple request logging
@app.middleware("http")
async def log_requests(request, call_next):
    print(f"-> {request.method} {request.url}")
    response = await call_next(request)
    print(f"<- {response.status_code} {request.url}")
    return response

# In-memory storage (in production, use database)
import uuid as _uuid

businesses: List[Dict] = []          # list of business profiles, each has an 'id' key
active_business_id: Optional[str] = None  # currently selected business id

# Per-business data keyed by business id
_products_store: Dict[str, list] = {}   # business_id -> products list
_sales_store: Dict[str, list] = {}      # business_id -> sales list

loan_model = None
scaler = StandardScaler()

# -----------  helpers to keep the rest of the code unchanged  -----------
def _active_business() -> dict:
    """Return the active business profile dict (or empty dict)."""
    global active_business_id
    if not active_business_id:
        return {}
    for b in businesses:
        if b['id'] == active_business_id:
            return b
    return {}

def _get_products() -> list:
    return _products_store.get(active_business_id or '', [])

def _get_sales() -> list:
    return _sales_store.get(active_business_id or '', [])



# Pydantic models
class BusinessProfile(BaseModel):
    business_name: str
    business_type: str
    years_operating: int
    monthly_revenue: float
    profit_margin: float
    existing_loan_commitment: float
    id: Optional[str] = None  # assigned by server

class Product(BaseModel):
    name: str
    category: str
    price: float
    cost: float
    stock: int

class Sale(BaseModel):
    product: str
    quantity: int
    date: str
    revenue: float

class LoanScore(BaseModel):
    score: float
    max_loan_amount: float
    eligibility: str
    status: str

# ML Functions
def train_loan_model():
    """Train Random Forest model for loan scoring"""
    sales = _get_sales()
    if len(sales) < 20:
        return False

    try:
        global loan_model, scaler

        # Prepare training features
        df = pd.DataFrame(sales)
        df['date'] = pd.to_datetime(df['date'])

        profile = _active_business()

        # Feature engineering
        features = {
            'total_revenue': [calculate_total_revenue()],
            'profit_margin': [profile.get('profit_margin', 0)],
            'years_operating': [profile.get('years_operating', 0)],
            'monthly_revenue': [profile.get('monthly_revenue', 0)],
            'existing_commitment': [profile.get('existing_loan_commitment', 0)],
            'num_products': [len(_get_products())],
            'num_sales': [len(sales)],
            'revenue_stability': [_calculate_revenue_stability()],
        }

        X = pd.DataFrame(features)
        X_scaled = scaler.fit_transform(X)

        # Create synthetic labels
        y = np.array([1 if (X['total_revenue'].values[0] > 500000 and
                            X['profit_margin'].values[0] > 20) else 0])

        # Train Random Forest
        model = RandomForestClassifier(n_estimators=100, random_state=42, max_depth=5)
        model.fit(X_scaled, y)

        loan_model = model
        return True

    except Exception as e:
        print(f"Could not train loan model: {str(e)}")
        return False

def _calculate_revenue_stability():
    """Calculate revenue stability"""
    sales = _get_sales()
    if not sales:
        return 0

    df = pd.DataFrame(sales)
    df['date'] = pd.to_datetime(df['date'])
    daily_revenue = df.groupby('date')['revenue'].sum()

    if len(daily_revenue) > 1:
        cv = daily_revenue.std() / daily_revenue.mean() if daily_revenue.mean() > 0 else 1
        return max(0, 1 - cv)
    return 0.5

def forecast_with_arima(days=30):
    """ARIMA forecasting"""
    sales = _get_sales()
    if not ARIMA_AVAILABLE or not sales:
        return None

    try:
        df = pd.DataFrame(sales)
        df['date'] = pd.to_datetime(df['date'])

        forecast_input = df.groupby('date')['revenue'].sum().reset_index()
        forecast_input = forecast_input.sort_values('date')

        if len(forecast_input) < 7:
            return None

        model = ARIMA(forecast_input['revenue'], order=(1, 1, 1))
        results = model.fit()

        forecast = results.get_forecast(steps=days)
        forecast_df = forecast.conf_int(alpha=0.2)
        forecast_df['yhat'] = forecast.predicted_mean

        return forecast_df

    except:
        return None

# Analytics functions
def calculate_total_revenue():
    """Calculate total revenue"""
    sales = _get_sales()
    if not sales:
        return 0
    df = pd.DataFrame(sales)
    return df['revenue'].sum()

def calculate_monthly_trend():
    """Calculate monthly revenue trend"""
    sales = _get_sales()
    if not sales:
        return []

    df = pd.DataFrame(sales)
    df['date'] = pd.to_datetime(df['date'])
    monthly = df.groupby(df['date'].dt.to_period('M'))['revenue'].sum()
    monthly.index = monthly.index.to_timestamp()

    return monthly.reset_index().to_dict('records')

def calculate_top_products(top_n=5):
    """Get top selling products"""
    sales = _get_sales()
    if not sales:
        return []

    df = pd.DataFrame(sales)
    top = df.groupby('product')['quantity'].sum().nlargest(top_n).reset_index()
    top.columns = ['product', 'quantity_sold']
    return top.to_dict('records')

def calculate_loan_score():
    """Calculate loan eligibility score"""
    sales = _get_sales()
    # Try to train model if we have enough data
    if loan_model is None and len(sales) >= 20:
        train_loan_model()

    # Use ML model if trained
    if loan_model is not None:
        try:
            profile = _active_business()

            features = {
                'total_revenue': [calculate_total_revenue()],
                'profit_margin': [profile.get('profit_margin', 0)],
                'years_operating': [profile.get('years_operating', 0)],
                'monthly_revenue': [profile.get('monthly_revenue', 0)],
                'existing_commitment': [profile.get('existing_loan_commitment', 0)],
                'num_products': [len(_get_products())],
                'num_sales': [len(sales)],
                'revenue_stability': [_calculate_revenue_stability()],
            }

            X = pd.DataFrame(features)
            X_scaled = scaler.transform(X)

            ml_score = loan_model.predict_proba(X_scaled)[0][1]
            return ml_score
        except:
            pass

    # Fallback: Rule-based scoring
    biz = _active_business()
    total_revenue = calculate_total_revenue()
    profit_margin = biz.get('profit_margin', 0)
    monthly_revenue = biz.get('monthly_revenue', 0)
    existing_commitment = biz.get('existing_loan_commitment', 0)

    revenue_stability = _calculate_revenue_stability()

    profit_score = min(1, profit_margin / 50)

    if monthly_revenue > 0:
        cash_flow = total_revenue / (monthly_revenue * 12) if monthly_revenue > 0 else 0
        cash_flow_ratio = min(1, cash_flow / 2)
    else:
        cash_flow_ratio = 0

    if monthly_revenue > 0:
        debt_ratio = existing_commitment / (monthly_revenue * 12) if monthly_revenue > 0 else 1
        debt_inverse = max(0, 1 - debt_ratio)
    else:
        debt_inverse = 0.5

    score = (
        0.4 * revenue_stability +
        0.3 * profit_score +
        0.2 * cash_flow_ratio +
        0.1 * debt_inverse
    )

    return min(1, max(0, score))

# API Endpoints
@app.post("/api/business")
async def create_business(profile: BusinessProfile):
    """Create a new business profile (or update if id provided)"""
    global active_business_id
    data = profile.dict()

    if data.get('id'):
        # Update existing
        for i, b in enumerate(businesses):
            if b['id'] == data['id']:
                businesses[i] = data
                return {"message": "Business profile updated successfully", "data": data}
        raise HTTPException(status_code=404, detail="Business not found")

    # Create new
    new_id = str(_uuid.uuid4())[:8]
    data['id'] = new_id
    businesses.append(data)
    # Initialise per-business stores
    _products_store[new_id] = []
    _sales_store[new_id] = []
    # Auto-activate if it's the first business or no active business
    if active_business_id is None or len(businesses) == 1:
        active_business_id = new_id
    return {"message": "Business profile created successfully", "data": data}

@app.get("/api/business")
async def get_business():
    """Get the active business profile"""
    return _active_business()

@app.get("/api/businesses")
async def get_all_businesses():
    """Get all registered businesses"""
    return {"businesses": businesses, "active_id": active_business_id}

@app.put("/api/businesses/{business_id}/activate")
async def activate_business(business_id: str):
    """Set a business as the active one"""
    global active_business_id
    for b in businesses:
        if b['id'] == business_id:
            active_business_id = business_id
            return {"message": f"Switched to {b['business_name']}", "data": b}
    raise HTTPException(status_code=404, detail="Business not found")

@app.delete("/api/businesses/{business_id}")
async def delete_business(business_id: str):
    """Delete a business profile"""
    global active_business_id, businesses
    businesses = [b for b in businesses if b['id'] != business_id]
    _products_store.pop(business_id, None)
    _sales_store.pop(business_id, None)
    if active_business_id == business_id:
        active_business_id = businesses[0]['id'] if businesses else None
    return {"message": "Business deleted"}

@app.post("/api/products")
async def create_product(product: Product):
    """Add new product"""
    products = _get_products()
    products.append(product.dict())
    return {"message": "Product added successfully", "data": product.dict()}

@app.get("/api/products")
async def get_products():
    """Get all products"""
    return _get_products()

@app.post("/api/sales")
async def create_sale(sale: Sale):
    """Record a sale"""
    sales = _get_sales()
    sales.append(sale.dict())
    return {"message": "Sale recorded successfully", "data": sale.dict()}

@app.get("/api/sales")
async def get_sales():
    """Get all sales"""
    return _get_sales()

@app.post("/api/upload-csv")
async def upload_csv(file: UploadFile = File(...)):
    """Upload CSV file with sales data"""
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="File must be CSV")

    try:
        df = pd.read_csv(file.file)
        required_columns = ['product', 'quantity', 'date', 'revenue']

        if not all(col in df.columns for col in required_columns):
            raise HTTPException(status_code=400, detail="CSV must contain columns: product, quantity, date, revenue")

        # Convert to dict and add to sales
        new_sales = df.to_dict('records')
        _get_sales().extend(new_sales)

        return {"message": f"Successfully uploaded {len(new_sales)} sales records"}

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error processing CSV: {str(e)}")

@app.get("/api/analytics")
async def get_analytics():
    """Get analytics data"""
    # Product performance analysis
    product_performance = []
    sales = _get_sales()
    products = _get_products()
    if sales and products:
        df = pd.DataFrame(sales)
        for product in products:
            product_sales = df[df['product'] == product['name']]
            if not product_sales.empty:
                total_quantity = product_sales['quantity'].sum()
                total_revenue = product_sales['revenue'].sum()
                cost_per_unit = product.get('cost', 0)
                price_per_unit = product.get('price', 0)
                total_cost = total_quantity * cost_per_unit
                total_profit = total_revenue - total_cost
                profit_margin = (total_profit / total_revenue * 100) if total_revenue > 0 else 0
                
                product_performance.append({
                    'product': product['name'],
                    'category': product.get('category', 'Unknown'),
                    'qty_sold': int(total_quantity),
                    'total_revenue': float(total_revenue),
                    'total_cost': float(total_cost),
                    'total_profit': float(total_profit),
                    'profit_margin_%': round(profit_margin, 1),
                    'price_unit': float(price_per_unit),
                    'cost_unit': float(cost_per_unit),
                    'stock': product.get('stock', 0)
                })
        
        # Sort by profit
        product_performance.sort(key=lambda x: x['total_profit'], reverse=True)

    return {
        "total_revenue": calculate_total_revenue(),
        "monthly_trend": calculate_monthly_trend(),
        "top_products": calculate_top_products(),
        "total_products": len(_get_products()),
        "total_sales": len(_get_sales()),
        "product_performance": product_performance
    }

@app.get("/api/forecast")
async def get_forecast(days: int = 30):
    """Get demand forecast"""
    forecast = forecast_with_arima(days)

    if forecast is None:
        return {"message": "Not enough data for forecasting"}

    return {
        "forecast": forecast.to_dict('records'),
        "days": days
    }

@app.post("/api/simulation")
async def run_simulation(scenario: Dict):
    """Run what-if simulation"""
    # Simple simulation logic
    current_revenue = calculate_total_revenue()
    discount = scenario.get('discount', 0)
    marketing_boost = scenario.get('marketing_boost', 0)

    # Simulate impact
    simulated_revenue = current_revenue * (1 + marketing_boost/100) * (1 - discount/100)

    return {
        "current_revenue": current_revenue,
        "simulated_revenue": simulated_revenue,
        "change_percentage": ((simulated_revenue - current_revenue) / current_revenue) * 100
    }

@app.get("/api/anomalies")
async def get_anomalies():
    """Detect sales anomalies using Isolation Forest"""
    if len(_get_sales()) < 5:
        return {"anomalies": [], "message": "Not enough data for anomaly detection"}
    
    try:
        df = pd.DataFrame(_get_sales())
        
        # Features for anomaly detection
        X = df[['quantity', 'revenue']].values
        
        if len(X) >= 5:
            iso_forest = IsolationForest(contamination=0.1, random_state=42)
            predictions = iso_forest.fit_predict(X)
            
            # Get anomalies (predictions == -1)
            anomaly_indices = [i for i, pred in enumerate(predictions) if pred == -1]
            anomalies = []
            
            for idx in anomaly_indices:
                row = df.iloc[idx]
                anomalies.append({
                    "product": row['product'],
                    "quantity": int(row['quantity']),
                    "revenue": float(row['revenue']),
                    "date": row['date'],
                    "reason": "Unusual sales pattern detected"
                })
            
            return {"anomalies": anomalies}
        
        return {"anomalies": []}
    
    except Exception as e:
        return {"anomalies": [], "error": str(e)}

@app.get("/api/loan-score")
async def get_loan_score():
    """Get loan eligibility score"""
    score = calculate_loan_score()

    # Calculate max loan amount based on score
    monthly_revenue = _active_business().get('monthly_revenue', 0)
    max_loan = min(monthly_revenue * 12 * score * 2, 5000000)  # Cap at 5M

    eligibility = "Eligible" if score >= 0.5 else "Not Eligible"
    status = "Ready for Application" if score >= 0.5 else "Needs Improvement"

    return LoanScore(
        score=score,
        max_loan_amount=max_loan,
        eligibility=eligibility,
        status=status
    )


# --------------------------------------------------
# Demo / Sample data endpoint
# --------------------------------------------------
@app.post("/api/demo")
async def load_demo_data():
    """Seed the server with sample business profile, products, and sales data."""
    global active_business_id

    # business profile sample
    demo_id = "demo0001"
    demo_profile = {
        'id': demo_id,
        'business_name': 'Nasi Kuah Corner',
        'business_type': 'FNB (Food & Beverage)',
        'years_operating': 3,
        'monthly_revenue': 35000.0,
        'profit_margin': 30.0,
        'existing_loan_commitment': 8000.0
    }

    # product samples
    demo_products = [
        {'name': 'Biryani', 'category': 'Main Course', 'price': 8.0, 'cost': 6.50, 'stock': 12},
        {'name': 'Ais Kosong', 'category': 'Beverage', 'price': 1.00, 'cost': 0.70, 'stock': 22},
        {'name': 'ABC', 'category': 'Beverage', 'price': 6.00, 'cost': 2.50, 'stock': 8},
    ]

    # sales samples - 14 days for each product
    from datetime import date, timedelta
    base_date = date.today()
    biryani_sales = [3,4,5,6,7,8,9,10,11,9,10,12,11,13]
    ais_sales = [6,7,8,7,8,9,8,9,10,9,11,10,12,13]
    abc_sales = [2,3,2,3,2,3,2,3,2,4,3,2,4,3]

    demo_sales = []
    for i in range(len(biryani_sales)):
        dt = (base_date - timedelta(days=len(biryani_sales)-1-i)).isoformat()
        demo_sales.append({'product': 'Biryani', 'quantity': biryani_sales[i], 'date': dt, 'revenue': biryani_sales[i]*8.0})
        demo_sales.append({'product': 'Ais Kosong', 'quantity': ais_sales[i], 'date': dt, 'revenue': ais_sales[i]*1.0})
        demo_sales.append({'product': 'ABC', 'quantity': abc_sales[i], 'date': dt, 'revenue': abc_sales[i]*6.0})

    # Remove previous demo business if it exists
    for i, b in enumerate(businesses):
        if b['id'] == demo_id:
            businesses.pop(i)
            break

    businesses.append(demo_profile)
    _products_store[demo_id] = demo_products.copy()
    _sales_store[demo_id] = demo_sales.copy()
    active_business_id = demo_id

    return {
        'business_profile': demo_profile,
        'products': demo_products,
        'sales': demo_sales
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)