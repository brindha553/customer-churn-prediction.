import pandas as pd
import numpy as np
import os

def generate_customer_dataset(n_samples=5000, random_state=42):
    """
    Generates a realistic synthetic customer churn dataset with known correlations
    representing telecom / SaaS subscription customers.
    """
    np.random.seed(random_state)
    
    customer_ids = [f"CUST-{1000 + i}" for i in range(n_samples)]
    
    # Customer Demographics
    first_names = ["James", "Mary", "Robert", "Patricia", "John", "Jennifer", "Michael", "Linda", 
                   "David", "Elizabeth", "William", "Barbara", "Richard", "Susan", "Joseph", "Jessica",
                   "Thomas", "Sarah", "Charles", "Karen", "Christopher", "Nancy", "Daniel", "Lisa",
                   "Matthew", "Betty", "Anthony", "Margaret", "Mark", "Sandra", "Donald", "Ashley",
                   "Steven", "Kimberly", "Paul", "Emily", "Andrew", "Donna", "Joshua", "Michelle",
                   "Rahul", "Priya", "Amit", "Ananya", "Vikram", "Sneha", "Arjun", "Pooja", "Rajesh", "Kavita"]
    last_names = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis",
                  "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson",
                  "Thomas", "Taylor", "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson",
                  "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson", "Walker",
                  "Young", "Allen", "King", "Wright", "Scott", "Torres", "Nguyen", "Hill", "Flores",
                  "Sharma", "Patel", "Verma", "Gupta", "Kumar", "Singh", "Reddy", "Nair", "Rao", "Joshi"]
    
    names = [f"{np.random.choice(first_names)} {np.random.choice(last_names)}" for _ in range(n_samples)]
    
    ages = np.random.randint(18, 75, size=n_samples)
    genders = np.random.choice(["Male", "Female"], size=n_samples)
    
    # Contract & Services
    contract_types = np.random.choice(["Month-to-Month", "One Year", "Two Year"], size=n_samples, p=[0.55, 0.25, 0.20])
    subscription_types = np.random.choice(["Basic", "Standard", "Premium"], size=n_samples, p=[0.35, 0.40, 0.25])
    internet_services = np.random.choice(["DSL", "Fiber Optic", "No"], size=n_samples, p=[0.40, 0.45, 0.15])
    payment_methods = np.random.choice(["Electronic Check", "Mailed Check", "Bank Transfer", "Credit Card"], 
                                      size=n_samples, p=[0.35, 0.20, 0.25, 0.20])
    
    # Tenure (in months) - skewed towards shorter tenure for Month-to-Month
    tenures = []
    for c in contract_types:
        if c == "Month-to-Month":
            tenures.append(int(np.clip(np.random.exponential(scale=14), 1, 72)))
        elif c == "One Year":
            tenures.append(int(np.clip(np.random.normal(loc=28, scale=10), 12, 60)))
        else: # Two Year
            tenures.append(int(np.clip(np.random.normal(loc=52, scale=12), 24, 72)))
    tenures = np.array(tenures)
    
    # Monthly Charges ($18 to $120) based on subscription and internet service
    monthly_charges = []
    for sub, net in zip(subscription_types, internet_services):
        base = 25.0
        if sub == "Standard": base += 25.0
        elif sub == "Premium": base += 50.0
        
        if net == "Fiber Optic": base += 35.0
        elif net == "DSL": base += 15.0
        
        charge = round(float(np.clip(base + np.random.normal(0, 5), 18.0, 125.0)), 2)
        monthly_charges.append(charge)
    monthly_charges = np.array(monthly_charges)
    
    # Total Charges = Monthly * Tenure (+ noise)
    total_charges = np.round(monthly_charges * tenures + np.random.normal(0, 10, size=n_samples), 2)
    total_charges = np.clip(total_charges, 18.0, None)
    
    # Customer Service Calls
    # More calls often correlates with issues & higher churn
    customer_service_calls = np.random.poisson(lam=1.5, size=n_samples)
    customer_service_calls = np.clip(customer_service_calls, 0, 9)
    
    # Tech Support & Online Security
    tech_supports = np.random.choice(["Yes", "No"], size=n_samples, p=[0.40, 0.60])
    online_securities = np.random.choice(["Yes", "No"], size=n_samples, p=[0.45, 0.55])
    
    # Realistic Churn Probability Score Calculation
    churn_logits = (
        - 1.8
        + 0.015 * (ages - 40)
        - 0.045 * tenures
        + 0.018 * (monthly_charges - 60)
        + 0.45 * customer_service_calls
        + (1.1 * (contract_types == "Month-to-Month"))
        - (0.8 * (contract_types == "Two Year"))
        + (0.6 * (payment_methods == "Electronic Check"))
        + (0.5 * (internet_services == "Fiber Optic"))
        - (0.4 * (tech_supports == "Yes"))
        - (0.35 * (online_securities == "Yes"))
    )
    
    # Sigmoid function for probability
    churn_probabilities = 1 / (1 + np.exp(-churn_logits))
    
    # Actual churn outcome
    churn = (np.random.rand(n_samples) < churn_probabilities).astype(int)
    
    # Risk Categories
    risk_levels = []
    for p in churn_probabilities:
        if p >= 0.70:
            risk_levels.append("High Risk")
        elif p >= 0.40:
            risk_levels.append("Medium Risk")
        else:
            risk_levels.append("Low Risk")
            
    customer_statuses = ["Churned" if c == 1 else "Active" for c in churn]
    
    # Additional Fields requested by user
    locations = np.random.choice(["New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", "San Antonio", "San Diego", "Dallas", "San Jose"], size=n_samples)
    usage_frequencies = np.random.choice(["Daily", "Weekly", "Monthly", "Rarely"], size=n_samples, p=[0.4, 0.3, 0.2, 0.1])
    service_usages = np.random.choice(["High", "Medium", "Low"], size=n_samples, p=[0.3, 0.5, 0.2])
    last_activities = np.random.choice(["Today", "Yesterday", "2 Days Ago", "1 Week Ago", "1 Month Ago", "More than a month ago"], size=n_samples, p=[0.2, 0.2, 0.2, 0.2, 0.1, 0.1])
    
    df = pd.DataFrame({
        "CustomerID": customer_ids,
        "CustomerName": names,
        "Age": ages,
        "Gender": genders,
        "Location": locations,
        "Tenure": tenures,
        "SubscriptionType": subscription_types,
        "ContractType": contract_types,
        "InternetService": internet_services,
        "PaymentMethod": payment_methods,
        "TechSupport": tech_supports,
        "OnlineSecurity": online_securities,
        "CustomerServiceCalls": customer_service_calls,
        "MonthlyCharges": monthly_charges,
        "TotalCharges": total_charges,
        "UsageFrequency": usage_frequencies,
        "ServiceUsage": service_usages,
        "LastActivity": last_activities,
        "ChurnProbability": np.round(churn_probabilities * 100, 1),
        "RiskLevel": risk_levels,
        "CustomerStatus": customer_statuses,
        "Churn": churn
    })
    
    return df

if __name__ == "__main__":
    df = generate_customer_dataset(5000)
    data_dir = os.path.dirname(__file__)
    csv_path = os.path.join(data_dir, "customers_dataset.csv")
    df.to_csv(csv_path, index=False)
    print(f"Dataset generated successfully with {len(df)} records at {csv_path}")
    print(df.head())
    print("\nChurn distribution:\n", df['Churn'].value_counts(normalize=True))
    print("\nRisk Level distribution:\n", df['RiskLevel'].value_counts())
