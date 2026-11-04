import React, { useState } from "react";
import {
  Cpu,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  ShieldAlert,
  Zap,
  ArrowRight,
  RefreshCw,
  Sliders,
  Check
} from "lucide-react";
import RiskBadge from "../components/RiskBadge";
import { api } from "../services/api";
import { useCustomers } from "../context/CustomerContext";
import confetti from "canvas-confetti";

export default function Prediction() {
  const { showToast } = useCustomers();

  // Form State
  const [formData, setFormData] = useState({
    CustomerName: "Michael Evans",
    Age: 45,
    Gender: "Male",
    Tenure: 3,
    SubscriptionType: "Basic",
    ContractType: "Month-to-Month",
    InternetService: "Fiber Optic",
    PaymentMethod: "Electronic Check",
    TechSupport: "No",
    OnlineSecurity: "No",
    CustomerServiceCalls: 4,
    MonthlyCharges: 85.50,
    TotalCharges: 256.50
  });

  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === "MonthlyCharges" || name === "Tenure") {
        const m = Number(name === "MonthlyCharges" ? value : prev.MonthlyCharges) || 0;
        const t = Number(name === "Tenure" ? value : prev.Tenure) || 1;
        updated.TotalCharges = (m * t).toFixed(2);
      }
      return updated;
    });
  };

  const handlePredict = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);

    try {
      const res = await api.predictChurn(formData);
      setPrediction(res);
      if (!res.will_churn) {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 }
        });
      }
      showToast(`Prediction complete: ${res.churn_probability}% Churn Probability (${res.risk_level})`);
    } catch (err) {
      showToast("Prediction failed, please try again", "danger");
    } finally {
      setLoading(false);
    }
  };

  // Quick Demo Presets
  const loadHighRiskPreset = () => {
    setFormData({
      CustomerName: "Sarah Jenkins (Demo Case)",
      Age: 42,
      Gender: "Female",
      Tenure: 2,
      SubscriptionType: "Basic",
      ContractType: "Month-to-Month",
      InternetService: "Fiber Optic",
      PaymentMethod: "Electronic Check",
      TechSupport: "No",
      OnlineSecurity: "No",
      CustomerServiceCalls: 5,
      MonthlyCharges: 89.50,
      TotalCharges: 179.00
    });
    setPrediction(null);
  };

  const loadLowRiskPreset = () => {
    setFormData({
      CustomerName: "David Miller (Demo Case)",
      Age: 54,
      Gender: "Male",
      Tenure: 48,
      SubscriptionType: "Premium",
      ContractType: "Two Year",
      InternetService: "Fiber Optic",
      PaymentMethod: "Credit Card",
      TechSupport: "Yes",
      OnlineSecurity: "Yes",
      CustomerServiceCalls: 0,
      MonthlyCharges: 95.00,
      TotalCharges: 4560.00
    });
    setPrediction(null);
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-header-title">
            <Cpu size={28} color="var(--primary)" /> AI Churn Prediction Studio
          </h1>
          <p className="page-header-desc">
            Evaluate individual customer profiles using our Scikit-Learn Random Forest Classifier model.
          </p>
        </div>

        {/* Preset quick buttons for college viva demo */}
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button className="btn btn-secondary btn-sm" onClick={loadHighRiskPreset}>
            Load High-Risk Example
          </button>
          <button className="btn btn-secondary btn-sm" onClick={loadLowRiskPreset}>
            Load Low-Risk Example
          </button>
        </div>
      </div>

      <div className="grid-2" style={{ alignItems: "start", gap: "2rem" }}>
        {/* Input Parameters Form */}
        <div className="glass-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
            <h3 style={{ fontSize: "1.15rem", fontWeight: 700, color: "var(--text-heading)", margin: 0, display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Sliders size={18} color="var(--primary)" /> Customer Attributes
            </h3>
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>10 Telemetry Variables</span>
          </div>

          <form onSubmit={handlePredict} style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
            <div className="grid-2">
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Customer Name</label>
                <input
                  type="text"
                  name="CustomerName"
                  className="form-control"
                  value={formData.CustomerName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Customer Age (Years)</label>
                <input
                  type="number"
                  name="Age"
                  className="form-control"
                  min="18"
                  max="95"
                  value={formData.Age}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid-3">
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Gender</label>
                <select name="Gender" className="form-control" value={formData.Gender} onChange={handleChange}>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Tenure (Months)</label>
                <input
                  type="number"
                  name="Tenure"
                  className="form-control"
                  min="1"
                  max="72"
                  value={formData.Tenure}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Contract Type</label>
                <select name="ContractType" className="form-control" value={formData.ContractType} onChange={handleChange}>
                  <option value="Month-to-Month">Month-to-Month</option>
                  <option value="One Year">One Year</option>
                  <option value="Two Year">Two Year</option>
                </select>
              </div>
            </div>

            <div className="grid-3">
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Subscription Tier</label>
                <select name="SubscriptionType" className="form-control" value={formData.SubscriptionType} onChange={handleChange}>
                  <option value="Basic">Basic</option>
                  <option value="Standard">Standard</option>
                  <option value="Premium">Premium</option>
                </select>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Internet Service</label>
                <select name="InternetService" className="form-control" value={formData.InternetService} onChange={handleChange}>
                  <option value="Fiber Optic">Fiber Optic</option>
                  <option value="DSL">DSL</option>
                  <option value="No">No Internet</option>
                </select>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Payment Method</label>
                <select name="PaymentMethod" className="form-control" value={formData.PaymentMethod} onChange={handleChange}>
                  <option value="Electronic Check">Electronic Check</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Mailed Check">Mailed Check</option>
                </select>
              </div>
            </div>

            <div className="grid-3">
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Monthly Charges ($)</label>
                <input
                  type="number"
                  step="0.01"
                  name="MonthlyCharges"
                  className="form-control"
                  value={formData.MonthlyCharges}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Total Charges ($)</label>
                <input
                  type="number"
                  step="0.01"
                  name="TotalCharges"
                  className="form-control"
                  value={formData.TotalCharges}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Service Calls</label>
                <input
                  type="number"
                  name="CustomerServiceCalls"
                  className="form-control"
                  min="0"
                  max="12"
                  value={formData.CustomerServiceCalls}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Submit Prediction Button */}
            <button
              type="submit"
              className="btn btn-primary btn-lg"
              style={{
                width: "100%",
                marginTop: "0.5rem",
                fontSize: "1.1rem",
                padding: "0.95rem",
                boxShadow: "0 4px 20px var(--primary-glow)"
              }}
              disabled={loading}
            >
              {loading ? (
                <>Calculating ML Probability...</>
              ) : (
                <>
                  <Zap size={20} /> Predict Customer Churn
                </>
              )}
            </button>
          </form>
        </div>

        {/* Prediction Results Display Card */}
        <div>
          {prediction ? (
            <div
              className="glass-card"
              style={{
                border: prediction.will_churn
                  ? "2px solid rgba(239, 68, 68, 0.4)"
                  : "2px solid rgba(16, 185, 129, 0.4)",
                boxShadow: prediction.will_churn
                  ? "0 0 30px rgba(239, 68, 68, 0.15)"
                  : "0 0 30px rgba(16, 185, 129, 0.15)",
                animation: "fadeIn 0.3s ease"
              }}
            >
              {/* Prediction Result Badge Banner */}
              <div
                style={{
                  padding: "1.25rem",
                  borderRadius: "var(--radius-md)",
                  backgroundColor: prediction.will_churn
                    ? "rgba(239, 68, 68, 0.12)"
                    : "rgba(16, 185, 129, 0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "1.5rem"
                }}
              >
                <div>
                  <div style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: prediction.will_churn ? "var(--danger)" : "var(--success)" }}>
                    Machine Learning Classification
                  </div>
                  <div style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--text-heading)", marginTop: "0.2rem" }}>
                    {prediction.prediction_result}
                  </div>
                </div>

                <div
                  style={{
                    padding: "0.6rem 1rem",
                    borderRadius: "var(--radius-full)",
                    fontWeight: 800,
                    fontSize: "0.9rem",
                    backgroundColor: prediction.will_churn ? "var(--danger)" : "var(--success)",
                    color: "#ffffff",
                    boxShadow: prediction.will_churn
                      ? "0 0 15px rgba(239, 68, 68, 0.5)"
                      : "0 0 15px rgba(16, 185, 129, 0.5)"
                  }}
                >
                  {prediction.risk_level.toUpperCase()}
                </div>
              </div>

              {/* Churn Probability Gauge Meter */}
              <div style={{ marginBottom: "1.75rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.5rem" }}>
                  <span style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text-secondary)" }}>
                    Calculated Churn Probability:
                  </span>
                  <span
                    style={{
                      fontSize: "2.2rem",
                      fontWeight: 800,
                      fontFamily: "var(--font-heading)",
                      color:
                        prediction.churn_probability >= 70
                          ? "var(--danger)"
                          : prediction.churn_probability >= 40
                          ? "var(--warning)"
                          : "var(--success)"
                    }}
                  >
                    {prediction.churn_probability}%
                  </span>
                </div>

                <div
                  style={{
                    width: "100%",
                    height: "14px",
                    backgroundColor: "var(--bg-input)",
                    borderRadius: "var(--radius-full)",
                    overflow: "hidden",
                    border: "1px solid var(--border-color)"
                  }}
                >
                  <div
                    style={{
                      width: `${prediction.churn_probability}%`,
                      height: "100%",
                      background:
                        prediction.churn_probability >= 70
                          ? "linear-gradient(90deg, #f59e0b, #ef4444)"
                          : prediction.churn_probability >= 40
                          ? "linear-gradient(90deg, #10b981, #f59e0b)"
                          : "linear-gradient(90deg, #06b6d4, #10b981)",
                      borderRadius: "var(--radius-full)",
                      transition: "width 0.8s ease"
                    }}
                  />
                </div>
              </div>

              {/* Key Contributing Factors */}
              {prediction.factors && prediction.factors.length > 0 && (
                <div style={{ marginBottom: "1.5rem" }}>
                  <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-secondary)", marginBottom: "0.6rem" }}>
                    Top Driving Risk Factors:
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                    {prediction.factors.map((f, idx) => (
                      <span
                        key={idx}
                        style={{
                          padding: "0.35rem 0.65rem",
                          borderRadius: "var(--radius-md)",
                          fontSize: "0.78rem",
                          fontWeight: 600,
                          backgroundColor:
                            f.type === "negative" ? "rgba(239, 68, 68, 0.12)" : "rgba(16, 185, 129, 0.12)",
                          color: f.type === "negative" ? "#f87171" : "#34d399",
                          border:
                            f.type === "negative"
                              ? "1px solid rgba(239, 68, 68, 0.3)"
                              : "1px solid rgba(16, 185, 129, 0.3)"
                        }}
                      >
                        {f.factor} ({f.impact})
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommended Retention Plan */}
              <div
                style={{
                  padding: "1.25rem",
                  backgroundColor: "var(--bg-input)",
                  borderRadius: "var(--radius-lg)",
                  border: "1px solid var(--border-color)"
                }}
              >
                <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--text-heading)", marginBottom: "0.6rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <Sparkles size={16} color="var(--primary)" /> Actionable Retention Recommendations:
                </div>
                <ul style={{ paddingLeft: "1.25rem", color: "var(--text-secondary)", fontSize: "0.85rem", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                  {prediction.recommendations?.map((rec, i) => (
                    <li key={i}>{rec}</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            /* Placeholder / Ready State */
            <div
              className="glass-card"
              style={{
                textAlign: "center",
                padding: "3.5rem 2rem",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <div
                style={{
                  width: "68px",
                  height: "68px",
                  borderRadius: "50%",
                  backgroundColor: "var(--bg-input)",
                  border: "1px dashed var(--primary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--primary)",
                  marginBottom: "1.25rem"
                }}
              >
                <Zap size={32} />
              </div>

              <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--text-heading)", marginBottom: "0.5rem" }}>
                Ready for Churn Evaluation
              </h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", maxWidth: "360px", marginBottom: "1.5rem" }}>
                Configure the customer attributes on the left and click "Predict Customer Churn" to run Random Forest classification.
              </p>

              <div style={{ display: "flex", gap: "0.75rem" }}>
                <button className="btn btn-secondary btn-sm" onClick={loadHighRiskPreset}>
                  Test High Risk Sample (78%)
                </button>
                <button className="btn btn-secondary btn-sm" onClick={loadLowRiskPreset}>
                  Test Low Risk Sample (18%)
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
