import { INITIAL_CUSTOMERS, INITIAL_PREDICTIONS, runClientPrediction } from "./mockData";

const API_BASE_URL = "http://localhost:5000/api";

// Local storage keys
const CUSTOMERS_KEY = "churnpredict_customers";
const PREDICTIONS_KEY = "churnpredict_predictions";

export function getLocalCustomers() {
  const saved = localStorage.getItem(CUSTOMERS_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      // ignore
    }
  }
  localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(INITIAL_CUSTOMERS));
  return INITIAL_CUSTOMERS;
}

export function saveLocalCustomers(list) {
  localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(list));
}

export function getLocalPredictions() {
  const saved = localStorage.getItem(PREDICTIONS_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      // ignore
    }
  }
  localStorage.setItem(PREDICTIONS_KEY, JSON.stringify(INITIAL_PREDICTIONS));
  return INITIAL_PREDICTIONS;
}

export function saveLocalPredictions(list) {
  localStorage.setItem(PREDICTIONS_KEY, JSON.stringify(list));
}

// API Methods with automatic Flask-or-Mock fallback
export const api = {
  // Health check
  async checkBackend() {
    try {
      const res = await fetch(`${API_BASE_URL}/health`, { signal: AbortSignal.timeout(2000) });
      if (res.ok) return { online: true, data: await res.json() };
    } catch {
      // Backend offline
    }
    return { online: false, data: null };
  },

  // Get Dashboard Analytics
  async getDashboardAnalytics() {
    try {
      const res = await fetch(`${API_BASE_URL}/analytics/dashboard`, { signal: AbortSignal.timeout(3000) });
      if (res.ok) return await res.json();
    } catch {
      // fallback
    }

    const customers = getLocalCustomers();
    const total = 5000;
    const highRisk = 400;
    const churned = 750;
    const active = 3850;
    const mediumRisk = 1250;
    const lowRisk = 3350;
    const churnRate = 15.0;

    return {
      summary: {
        total_customers: total,
        active_customers: active,
        churned_customers: churned,
        high_risk_customers: highRisk,
        medium_risk_customers: mediumRisk,
        low_risk_customers: lowRisk,
        churn_rate: churnRate
      },
      trends: {
        months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        churned: [68, 72, 65, 80, 74, 88, 62, 70, 64, 58, 66, 60],
        retained: [420, 435, 440, 430, 450, 460, 480, 490, 510, 525, 530, 550],
        new_customers: [95, 110, 105, 120, 115, 130, 125, 140, 135, 150, 145, 160]
      },
      risk_distribution: {
        high_risk: highRisk,
        medium_risk: mediumRisk,
        low_risk: lowRisk
      },
      high_risk_sample: customers.filter(c => c.RiskLevel === "High Risk").slice(0, 5)
    };
  },

  // Predict Churn
  async predictChurn(customerData) {
    try {
      const res = await fetch(`${API_BASE_URL}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(customerData),
        signal: AbortSignal.timeout(3000)
      });
      if (res.ok) {
        const result = await res.json();
        // Log to history
        this.addPredictionHistory({
          customerName: customerData.CustomerName || "Guest Evaluation",
          customerID: customerData.CustomerID || `CUST-GUEST`,
          ...result
        });
        return result;
      }
    } catch {
      // Fallback
    }

    const clientResult = runClientPrediction(customerData);
    this.addPredictionHistory({
      customerName: customerData.CustomerName || "Guest Evaluation",
      customerID: customerData.CustomerID || `CUST-GUEST`,
      ...clientResult
    });
    return clientResult;
  },

  // Add to prediction history
  addPredictionHistory(item) {
    const list = getLocalPredictions();
    const newRecord = {
      id: `PRED-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: item.customerName || "Customer",
      customerID: item.customerID || "CUST-NEW",
      date: new Date().toISOString().replace("T", " ").substring(0, 16),
      churnProbability: item.churn_probability || item.churnProbability || 50,
      riskLevel: item.risk_level || item.riskLevel || "Medium Risk",
      predictionResult: item.prediction_result || item.predictionResult || "Customer is likely to CHURN",
      contractType: item.customer_data?.ContractType || "Month-to-Month",
      monthlyCharges: Number(item.customer_data?.MonthlyCharges) || 65
    };
    list.unshift(newRecord);
    saveLocalPredictions(list.slice(0, 100));
    return newRecord;
  },

  // Behavior Analytics
  async getBehaviorAnalytics() {
    try {
      const res = await fetch(`${API_BASE_URL}/behavior/analysis`, { signal: AbortSignal.timeout(3000) });
      if (res.ok) return await res.json();
    } catch {
      // fallback
    }

    return {
      tenure_analysis: {
        labels: ["0-12m", "13-24m", "25-48m", "49-72m"],
        churn_rate: [48.5, 29.2, 14.8, 6.5]
      },
      monthly_charges_analysis: {
        labels: ["<$40", "$40-$70", "$70-$100", ">$100"],
        churn_rate: [9.4, 18.2, 34.6, 52.8]
      },
      contract_analysis: {
        labels: ["Month-to-Month", "One Year", "Two Year"],
        churn_rate: [51.2, 16.4, 4.8],
        counts: [2750, 1250, 1000]
      },
      subscription_analysis: {
        labels: ["Basic", "Standard", "Premium"],
        churn_rate: [22.4, 17.8, 14.2],
        counts: [1750, 2000, 1250]
      },
      payment_analysis: {
        labels: ["Electronic Check", "Mailed Check", "Bank Transfer", "Credit Card"],
        churn_rate: [45.2, 19.5, 12.3, 11.0],
        counts: [1750, 1000, 1250, 1000]
      },
      service_calls_analysis: {
        labels: ["0 Calls", "1 Call", "2 Calls", "3 Calls", "4 Calls", "5+ Calls"],
        churn_rate: [7.2, 11.5, 22.4, 54.6, 78.2, 92.0]
      },
      insights: [
        {
          title: "Tenure Impact",
          text: "Customers with short tenure (0-12 months) have a 48.5% churn probability compared to only 6.5% for 48+ months.",
          type: "warning"
        },
        {
          title: "Pricing Sensitivity",
          text: "Customers with monthly charges exceeding $100 show a 52.8% churn risk — over 5x that of under-$40 plans.",
          type: "danger"
        },
        {
          title: "Month-to-Month Exposure",
          text: "Month-to-Month contracts represent 51.2% churn risk. Upgrading to annual contracts slashes churn by 68%.",
          type: "critical"
        },
        {
          title: "Customer Service Escalations",
          text: "Customers logging 3+ support tickets trigger a sharp inflection point with over 70% churn velocity.",
          type: "info"
        }
      ]
    };
  },

  // Preprocessing Stats
  async getPreprocessingStats() {
    try {
      const res = await fetch(`${API_BASE_URL}/preprocessing/stats`, { signal: AbortSignal.timeout(3000) });
      if (res.ok) return await res.json();
    } catch {
      // fallback
    }

    return {
      total_records: 5000,
      missing_values: 0,
      duplicate_records: 0,
      features_available: 11,
      features_list: [
        { name: "Tenure", type: "Numerical (months)", importance: "24.5%", status: "Scaled (StandardScaler)" }
      ]
    };
  },

  // -------------------- NEW API CALLS FOR REAL DB --------------------
  async getCustomers(page = 1, limit = 100) {
    try {
      const res = await fetch(`${API_BASE_URL}/customers?page=${page}&limit=${limit}`);
      if (res.ok) {
        const data = await res.json();
        return data.customers;
      }
    } catch (e) {
      console.error(e);
    }
    return getLocalCustomers();
  },

  async addCustomerDb(customerData) {
    try {
      const res = await fetch(`${API_BASE_URL}/customers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(customerData)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.error(e);
    }
    return null;
  },

  async updateCustomerDb(id, customerData) {
    try {
      const res = await fetch(`${API_BASE_URL}/customers/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(customerData)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.error(e);
    }
    return null;
  },

  async deleteCustomerDb(id) {
    try {
      const res = await fetch(`${API_BASE_URL}/customers/${id}`, { method: "DELETE" });
      if (res.ok) return await res.json();
    } catch (e) {
      console.error(e);
    }
    return null;
  },

  async uploadCSV(file) {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch(`${API_BASE_URL}/customers/upload`, {
        method: "POST",
        body: formData
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.error(e);
    }
    return { error: "Upload failed" };
  }
};
