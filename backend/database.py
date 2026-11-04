from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Customer(db.Model):
    __tablename__ = 'customers'
    
    id = db.Column(db.String(50), primary_key=True)
    customer_name = db.Column(db.String(100), nullable=False)
    age = db.Column(db.Integer, nullable=False)
    gender = db.Column(db.String(20), nullable=False)
    location = db.Column(db.String(100), nullable=False)
    tenure = db.Column(db.Integer, nullable=False)
    subscription_type = db.Column(db.String(50), nullable=False)
    contract_type = db.Column(db.String(50), nullable=False)
    monthly_charges = db.Column(db.Float, nullable=False)
    total_charges = db.Column(db.Float, nullable=False)
    usage_frequency = db.Column(db.String(50), nullable=False)
    payment_method = db.Column(db.String(50), nullable=False)
    internet_service = db.Column(db.String(50), nullable=False, default="No")
    tech_support = db.Column(db.String(20), nullable=False, default="No")
    online_security = db.Column(db.String(20), nullable=False, default="No")
    support_calls = db.Column(db.Integer, nullable=False)
    service_usage = db.Column(db.String(50), nullable=False)
    last_activity = db.Column(db.String(50), nullable=False)
    
    # ML Prediction fields
    churn_probability = db.Column(db.Float, nullable=True)
    risk_level = db.Column(db.String(50), nullable=True)
    recommendation = db.Column(db.Text, nullable=True)
    churn = db.Column(db.Integer, nullable=True) # 1 or 0
    customer_status = db.Column(db.String(50), nullable=True) # "Churned" or "Active"
    
    def to_dict(self):
        return {
            "CustomerID": self.id,
            "CustomerName": self.customer_name,
            "Age": self.age,
            "Gender": self.gender,
            "Location": self.location,
            "Tenure": self.tenure,
            "SubscriptionType": self.subscription_type,
            "ContractType": self.contract_type,
            "MonthlyCharges": self.monthly_charges,
            "TotalCharges": self.total_charges,
            "UsageFrequency": self.usage_frequency,
            "PaymentMethod": self.payment_method,
            "InternetService": self.internet_service,
            "TechSupport": self.tech_support,
            "OnlineSecurity": self.online_security,
            "SupportCalls": self.support_calls,
            "ServiceUsage": self.service_usage,
            "LastActivity": self.last_activity,
            "ChurnProbability": self.churn_probability,
            "RiskLevel": self.risk_level,
            "Recommendation": self.recommendation,
            "Churn": self.churn,
            "CustomerStatus": self.customer_status
        }
