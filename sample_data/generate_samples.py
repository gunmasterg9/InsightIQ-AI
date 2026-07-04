import os
import csv
import random
from datetime import datetime, timedelta

def generate_data(num_rows=10000):
    os.makedirs('sample_data', exist_ok=True)
    filepath = os.path.join('sample_data', 'business_transactions.csv')
    
    categories = ['Electronics', 'Software', 'Hardware', 'Cloud Services', 'Consulting']
    payment_methods = ['Credit Card', 'Bank Transfer', 'Digital Wallet', 'ACH']
    countries = ['USA', 'India', 'Singapore', 'UK', 'Germany']
    segments = ['Retail', 'MSME', 'Finance', 'Healthcare', 'Supply Chain']
    
    # Generate static customer bank
    customers = []
    for i in range(1, 101):
        cust_id = f"CUST{1000 + i}"
        cust_name = f"Enterprise Client {1000 + i}"
        segment = random.choice(segments)
        country = random.choice(countries)
        base_risk = random.randint(10, 60)
        customers.append((cust_id, cust_name, segment, country, base_risk))
        
    start_date = datetime.now() - timedelta(days=540) # Last 18 months
    
    with open(filepath, mode='w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow([
            'Transaction_ID', 'Customer_ID', 'Customer_Name', 'Segment', 'Country',
            'Transaction_Date', 'Amount', 'Product_Category', 'Payment_Method', 
            'Fraud_Flag', 'Risk_Score', 'CPU_Processing_Time_ms', 'GPU_Processing_Time_ms'
        ])
        
        for i in range(1, num_rows + 1):
            txn_id = f"TXN{100000 + i}"
            cust_id, cust_name, segment, country, base_risk = random.choice(customers)
            
            # Date distribution: slightly more transactions towards recent dates
            days_ago = random.randint(0, 540)
            # Add some seasonal trends (e.g. higher transaction amounts in Nov/Dec)
            txn_date = start_date + timedelta(days=days_ago)
            month = txn_date.month
            
            # Amount distribution: normal business amounts with outlier transactions
            if random.random() < 0.02: # 2% outliers
                amount = round(random.uniform(50000, 250000), 2)
                is_outlier = True
            else:
                amount = round(random.uniform(100, 15000), 2)
                is_outlier = False
                
            # Seasonality modifier
            if month in [11, 12]:
                amount = round(amount * random.uniform(1.15, 1.35), 2)
            
            category = random.choice(categories)
            pay_method = random.choice(payment_methods)
            
            # Fraud determination: high risk if amount is outlier or specific conditions
            is_fraud = 0
            risk_score = base_risk
            
            # Risk logic
            if is_outlier:
                risk_score += random.randint(20, 35)
            if pay_method == 'Credit Card' and amount > 10000:
                risk_score += random.randint(10, 20)
            if random.random() < 0.03: # 3% random fraud rate for testing ML models
                is_fraud = 1
                risk_score = min(100, risk_score + random.randint(30, 45))
            else:
                if risk_score > 75 and random.random() < 0.4:
                    is_fraud = 1
                    
            risk_score = min(100, max(0, risk_score))
            
            # Benchmarking metrics
            # Simulating raw processing time (CPU: ~0.15ms per row, GPU: ~0.01ms per row)
            cpu_time = round(random.uniform(0.12, 0.22), 4)
            gpu_time = round(cpu_time / random.uniform(10.0, 15.0), 4)
            
            writer.writerow([
                txn_id, cust_id, cust_name, segment, country,
                txn_date.strftime('%Y-%m-%d %H:%M:%S'), amount, category, pay_method,
                is_fraud, risk_score, cpu_time, gpu_time
            ])
            
    print(f"Successfully generated {num_rows} records at {filepath}")

if __name__ == "__main__":
    generate_data(10000)
