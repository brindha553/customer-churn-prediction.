import os
import joblib
import pandas as pd
import numpy as np
import sqlite3
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score

MODEL_PATH = os.path.join(os.path.dirname(__file__), "churn_rf_model.pkl")
DB_PATH = os.path.join(os.path.dirname(__file__), "churn_db.sqlite")

NUMERICAL_FEATURES = ["Age", "Tenure", "MonthlyCharges", "TotalCharges", "CustomerServiceCalls"]
CATEGORICAL_FEATURES = ["Gender", "SubscriptionType", "ContractType", "InternetService", "PaymentMethod", "TechSupport", "OnlineSecurity", "Location", "UsageFrequency", "ServiceUsage", "LastActivity"]

def train_and_save_model():
    print("Loading training dataset from database...")
    if os.path.exists(DB_PATH):
        conn = sqlite3.connect(DB_PATH)
        df = pd.read_sql("SELECT * FROM customers", conn)
        conn.close()
        # Rename columns to match model expectations
        df = df.rename(columns={
            "age": "Age",
            "tenure": "Tenure",
            "monthly_charges": "MonthlyCharges",
            "total_charges": "TotalCharges",
            "support_calls": "CustomerServiceCalls",
            "gender": "Gender",
            "subscription_type": "SubscriptionType",
            "contract_type": "ContractType",
            "internet_service": "InternetService",
            "payment_method": "PaymentMethod",
            "tech_support": "TechSupport",
            "online_security": "OnlineSecurity",
            "location": "Location",
            "usage_frequency": "UsageFrequency",
            "service_usage": "ServiceUsage",
            "last_activity": "LastActivity",
            "churn": "Churn"
        })
    else:
        from dataset import generate_customer_dataset
        df = generate_customer_dataset(5000)
    
    X = df[NUMERICAL_FEATURES + CATEGORICAL_FEATURES]
    y = df["Churn"]
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    
    preprocessor = ColumnTransformer(
        transformers=[
            ("num", StandardScaler(), NUMERICAL_FEATURES),
            ("cat", OneHotEncoder(handle_unknown="ignore"), CATEGORICAL_FEATURES)
        ]
    )
    
    rf_classifier = RandomForestClassifier(
        n_estimators=150,
        max_depth=12,
        min_samples_split=5,
        min_samples_leaf=2,
        random_state=42,
        n_jobs=-1
    )
    
    pipeline = Pipeline(steps=[
        ("preprocessor", preprocessor),
        ("classifier", rf_classifier)
    ])
    
    print("Training Random Forest Classifier model...")
    pipeline.fit(X_train, y_train)
    
    # Evaluate
    y_pred = pipeline.predict(X_test)
    y_prob = pipeline.predict_proba(X_test)[:, 1]
    
    metrics = {
        "accuracy": round(accuracy_score(y_test, y_pred) * 100, 2),
        "precision": round(precision_score(y_test, y_pred) * 100, 2),
        "recall": round(recall_score(y_test, y_pred) * 100, 2),
        "f1": round(f1_score(y_test, y_pred) * 100, 2),
        "roc_auc": round(roc_auc_score(y_test, y_prob) * 100, 2)
    }
    
    print("Model Evaluation Metrics:")
    for k, v in metrics.items():
        print(f"  {k}: {v}%")
        
    # Extract feature importances
    onehot_features = pipeline.named_steps["preprocessor"].named_transformers_["cat"].get_feature_names_out(CATEGORICAL_FEATURES)
    all_feature_names = NUMERICAL_FEATURES + list(onehot_features)
    importances = pipeline.named_steps["classifier"].feature_importances_
    
    feat_imp = sorted(zip(all_feature_names, importances), key=lambda x: x[1], reverse=True)
    
    joblib.dump({
        "pipeline": pipeline,
        "metrics": metrics,
        "top_features": feat_imp[:10]
    }, MODEL_PATH)
    print(f"Model saved successfully to {MODEL_PATH}")
    return pipeline, metrics, feat_imp

def load_or_train_model():
    if os.path.exists(MODEL_PATH):
        try:
            data = joblib.load(MODEL_PATH)
            return data["pipeline"], data.get("metrics", {}), data.get("top_features", [])
        except Exception as e:
            print(f"Error loading model: {e}. Retraining...")
    return train_and_save_model()

def predict_single_customer(customer_dict):
    """
    Takes a dictionary representing customer features and returns:
    - churn_probability (0-100)
    - will_churn (bool)
    - risk_level ('High Risk', 'Medium Risk', 'Low Risk')
    - recommendation (str)
    - feature_importance / factors
    """
    pipeline, metrics, top_features = load_or_train_model()
    
    # Fill defaults if missing
    sample = {
        "Age": int(customer_dict.get("Age", 35)),
        "Gender": customer_dict.get("Gender", "Male"),
        "Tenure": int(customer_dict.get("Tenure", 12)),
        "SubscriptionType": customer_dict.get("SubscriptionType", "Basic"),
        "ContractType": customer_dict.get("ContractType", "Month-to-Month"),
        "InternetService": customer_dict.get("InternetService", "Fiber Optic"),
        "PaymentMethod": customer_dict.get("PaymentMethod", "Electronic Check"),
        "TechSupport": customer_dict.get("TechSupport", "No"),
        "OnlineSecurity": customer_dict.get("OnlineSecurity", "No"),
        "Location": customer_dict.get("Location", "New York"),
        "UsageFrequency": customer_dict.get("UsageFrequency", "Weekly"),
        "ServiceUsage": customer_dict.get("ServiceUsage", "Medium"),
        "LastActivity": customer_dict.get("LastActivity", "Today"),
        "CustomerServiceCalls": int(customer_dict.get("CustomerServiceCalls", 2)),
        "MonthlyCharges": float(customer_dict.get("MonthlyCharges", 65.0)),
        "TotalCharges": float(customer_dict.get("TotalCharges", float(customer_dict.get("MonthlyCharges", 65.0)) * int(customer_dict.get("Tenure", 12))))
    }
    
    input_df = pd.DataFrame([sample])
    
    prob = float(pipeline.predict_proba(input_df)[0][1])
    prob_percent = round(prob * 100, 1)
    will_churn = prob >= 0.5
    
    if prob_percent >= 70.0:
        risk_level = "High Risk"
        recommendations = [
            "Assign a dedicated account manager immediately",
            "Offer a 20% retention discount on a 1-Year or 2-Year contract commitment",
            "Schedule a proactive satisfaction call to resolve recent service issues",
            "Provide complimentary Tech Support / Online Security add-on for 6 months"
        ]
    elif prob_percent >= 40.0:
        risk_level = "Medium Risk"
        recommendations = [
            "Send an automated customer engagement email with new feature highlights",
            "Propose an attractive bundle upgrade with a minor promotional discount",
            "Send a customer feedback survey to identify pain points early",
            "Offer loyalty rewards points for consistent on-time billing"
        ]
    else:
        risk_level = "Low Risk"
        recommendations = [
            "Maintain standard high-quality customer service",
            "Offer loyalty appreciation perks or referral rewards",
            "Promote annual plan renewal with loyalty discount",
            "Send periodic satisfaction check-ins and quarterly newsletters"
        ]
        
    # Analyze key driving factors for this specific customer
    factors = []
    if sample["ContractType"] == "Month-to-Month":
        factors.append({"factor": "Month-to-Month Contract", "impact": "High Risk Factor", "type": "negative"})
    if sample["Tenure"] <= 6:
        factors.append({"factor": f"Short Tenure ({sample['Tenure']} months)", "impact": "High Risk Factor", "type": "negative"})
    elif sample["Tenure"] >= 36:
        factors.append({"factor": f"Long Tenure ({sample['Tenure']} months)", "impact": "Strong Retention Factor", "type": "positive"})
        
    if sample["CustomerServiceCalls"] >= 3:
        factors.append({"factor": f"High Service Calls ({sample['CustomerServiceCalls']} calls)", "impact": "Frustration Indicator", "type": "negative"})
        
    if sample["MonthlyCharges"] >= 80:
        factors.append({"factor": f"High Monthly Charges (${sample['MonthlyCharges']})", "impact": "Price Sensitivity", "type": "negative"})
        
    if sample["ContractType"] in ["One Year", "Two Year"]:
        factors.append({"factor": f"{sample['ContractType']} Contract", "impact": "High Commitment", "type": "positive"})
        
    if sample["TechSupport"] == "Yes":
        factors.append({"factor": "Active Tech Support", "impact": "Product Stickiness", "type": "positive"})
        
    return {
        "prediction_result": "Customer is likely to CHURN" if will_churn else "Customer is NOT likely to churn",
        "will_churn": will_churn,
        "churn_probability": prob_percent,
        "risk_level": risk_level,
        "recommendations": recommendations,
        "factors": factors,
        "customer_data": sample
    }

if __name__ == "__main__":
    train_and_save_model()
