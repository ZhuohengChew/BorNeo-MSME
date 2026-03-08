import requests
import json

try:
    r = requests.get('http://localhost:8000/api/forecast')
    data = r.json()
    
    print("API Response Status:", r.status_code)
    print("Response keys:", list(data.keys()))
    print("Full response:", json.dumps(data, indent=2, default=str)[:500])
    
    if 'forecast' in data:
        print("\nFirst 3 forecast items:")
        for i in range(3):
            item = data['forecast'][i]
            print(f"  Day {item['day']}: yhat={item['yhat']:.0f}, lower={item['yhat_lower']:.0f}, upper={item['yhat_upper']:.0f}")
        
        print(f"\nAverage yhat: {sum(item['yhat'] for item in data['forecast'])/len(data['forecast']):.0f}")
except Exception as e:
    print(f"Error: {e}")
