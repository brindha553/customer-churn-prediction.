import os
import pandas as pd
from sqlalchemy import create_engine

DB_NAME = 'churn_db'
CSV_PATH = os.path.join(os.path.dirname(__file__), 'customers_dataset.csv')

def setup_database():
    print("Setting up SQLite database...")
    db_file = os.path.join(os.path.dirname(os.path.abspath(__file__)), f"{DB_NAME}.sqlite")
    engine = create_engine(f"sqlite:///{db_file.replace(os.sep, '/')}")
    
    if os.path.exists(CSV_PATH):
        print(f"Loading data from {CSV_PATH}...")
        df = pd.read_csv(CSV_PATH)
        
        # Rename columns to match database model
        df = df.rename(columns={
            "CustomerID": "id",
            "CustomerName": "customer_name",
            "Age": "age",
            "Gender": "gender",
            "Location": "location",
            "Tenure": "tenure",
            "SubscriptionType": "subscription_type",
            "ContractType": "contract_type",
            "InternetService": "internet_service",
            "PaymentMethod": "payment_method",
            "TechSupport": "tech_support",
            "OnlineSecurity": "online_security",
            "CustomerServiceCalls": "support_calls",
            "MonthlyCharges": "monthly_charges",
            "TotalCharges": "total_charges",
            "UsageFrequency": "usage_frequency",
            "ServiceUsage": "service_usage",
            "LastActivity": "last_activity",
            "ChurnProbability": "churn_probability",
            "RiskLevel": "risk_level",
            "CustomerStatus": "customer_status",
            "Churn": "churn"
        })
        if "recommendation" not in df.columns:
            df["recommendation"] = "Review account engagement and usage."
        
        df.to_sql('customers', con=engine, if_exists='replace', index=False)
        print(f"Successfully imported {len(df)} records into 'customers' table.")
    else:
        print(f"CSV file not found at {CSV_PATH}")

if __name__ == "__main__":
    setup_database()
