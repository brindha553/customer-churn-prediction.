# ChurnPredict AI - Customer Churn Prediction System
> **Tagline**: Smart Customer Retention and Churn Prediction Platform  
> **Target**: Final-Year College Project Demonstration & Enterprise SaaS Retention Analytics

---

## 🌟 Project Overview
**ChurnPredict AI** is a modern, enterprise-grade AI analytics platform designed to predict customer churn, classify attrition risk tiers, analyze customer behavioral patterns, and prescribe proactive retention strategies using Machine Learning.

---

## 🚀 Key Modules & Features

### 1. 🔐 Authentication & User Management
- Modern glassmorphism UI for **Login** and **Registration**.
- Demo one-click instant login button.
- User profile editing and session persistence.

### 2. 📊 Customer Analytics Dashboard
- Top Summary KPI cards:
  - **Total Customers**: 5,000
  - **Active Customers**: 3,850
  - **Churned Customers**: 750
  - **High Risk Customers**: 400
  - **Overall Churn Rate**: 15.0%
- Interactive 12-Month Customer Churn & Retention line chart.
- Customer Risk Distribution donut chart (High, Medium, Low).
- High-risk customer alert stream and real-time prediction activity feed.

### 3. 👥 Customer Data Management
- Complete customer database with search by Name and ID.
- Multi-dimensional filters (Risk Level, Status, Subscription Tier).
- Pagination and CSV export.
- **Add Customer Modal** with live ML probability calculation.
- **Customer View Modal** with churn probability gauge meter and direct retention deployment.
- Customer record deletion with confirmation.

### 4. 🧹 Data Preprocessing Pipeline
- Dataset profiling (Total Records, 0 Missing Values, 0 Duplicates, 11 Features).
- Interactive preprocessing options (Missing Imputation, Deduplication, One-Hot Encoding, Feature Selection, StandardScaler Normalization).
- **Interactive 5-Step Pipeline Runner** with real-time animated progress bars and terminal log simulation.
- Feature dictionary with Random Forest importance scores.

### 5. 📈 Customer Behavior Analysis
- Visual correlation analytics:
  - Monthly charges vs. Churn rate.
  - Customer tenure cohort breakdown.
  - Subscription tier distribution.
  - Payment method risk analysis.
  - Customer support calls escalation curve.
- Key AI Behavioral Insights callouts highlighting critical thresholds.

### 6. 🤖 AI Churn Prediction Studio
- Comprehensive parameter form:
  - Age, Gender, Tenure, Subscription Tier, Contract Type, Internet Service, Payment Method, Monthly Charges, Total Charges, Customer Service Calls.
- **"Predict Customer Churn"** trigger.
- Instant result card displaying:
  - Prediction Result (`Customer is likely to CHURN` / `Customer is NOT likely to churn`)
  - Churn Probability Meter (`78%` / `18%`)
  - Risk Level Badge (`HIGH RISK` / `LOW RISK`)
  - Top contributing driving factors (Feature importance breakdown)
  - Actionable retention recommendation checklist
- Quick one-click high-risk and low-risk preset test buttons.

### 7. ⚠️ Customer Risk Classification
- Three-tier cohort categorization:
  - **HIGH RISK**: Churn Probability &gt; 70%
  - **MEDIUM RISK**: Churn Probability 40% - 70%
  - **LOW RISK**: Churn Probability &lt; 40%
- Risk distribution pie chart.
- Segmented customer tables with tab navigation and playbook dispatch triggers.

### 8. 💡 Recommendation & Retention Strategy
- Actionable retention playbooks tailored for each risk tier:
  - **High Risk**: 20-30% retention discounts, VIP support routing, outbound manager outreach.
  - **Medium Risk**: Promotional offers, feature engagement guides, free upgrade trials.
  - **Low Risk**: Regular newsletters, loyalty rewards, referral bonuses.
- Interactive Campaign Dispatcher simulator.

### 9. 📜 Prediction Audit History
- Chronological audit trail of all previous ML predictions.
- Search and filter by risk tier and churn outcome.
- Export history to CSV.

### 10. 👤 User Profile & ML Settings
- Profile management (Name, Email, Organization, Role).
- System architecture details (Random Forest Classifier, 82.2% ROC-AUC, 150 Estimators).
- Dark/Light mode theme switch.
- Flask API server connectivity status.

---

## 🛠️ Technology Stack
- **Frontend**: React 18, Vite, Chart.js, React-Chartjs-2, Lucide React, Canvas-Confetti, Vanilla CSS Design System.
- **Backend API**: Python 3, Flask, Flask-CORS.
- **Machine Learning**: Scikit-Learn (RandomForestClassifier, StandardScaler, ColumnTransformer, OneHotEncoder).
- **Data Processing**: Pandas, NumPy, Joblib.

---

## ⚡ How to Run the Project

### 1. Launch Backend API (Terminal 1)
```bash
cd backend
python -m pip install -r requirements.txt
python app.py
```
*Backend runs on `http://localhost:5000`*

### 2. Launch React Frontend (Terminal 2)
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs on `http://localhost:5173`*

Or double-click `start_backend.bat` and `start_frontend.bat`!
