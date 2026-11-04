import React, { useState } from "react";
import Modal from "./Modal";
import { UserPlus, Sparkles } from "lucide-react";
import { useCustomers } from "../context/CustomerContext";

export default function AddCustomerModal() {
  const { isAddModalOpen, setIsAddModalOpen, addCustomer } = useCustomers();

  const [formData, setFormData] = useState({
    CustomerID: "",
    CustomerName: "",
    Age: 32,
    Gender: "Male",
    Location: "New York",
    Tenure: 12,
    SubscriptionType: "Standard",
    ContractType: "Month-to-Month",
    InternetService: "Fiber Optic",
    PaymentMethod: "Electronic Check",
    TechSupport: "No",
    OnlineSecurity: "No",
    SupportCalls: 2,
    MonthlyCharges: 65.0,
    TotalCharges: 780.0,
    UsageFrequency: "Weekly",
    ServiceUsage: "Medium",
    LastActivity: "Today",
  });

  const [submitting, setSubmitting] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.CustomerName.trim()) return;

    setSubmitting(true);
    await addCustomer(formData);
    setSubmitting(false);
    setIsAddModalOpen(false);
    setFormData({
      CustomerID: "",
      CustomerName: "",
      Age: 32,
      Gender: "Male",
      Location: "New York",
      Tenure: 12,
      SubscriptionType: "Standard",
      ContractType: "Month-to-Month",
      InternetService: "Fiber Optic",
      PaymentMethod: "Electronic Check",
      TechSupport: "No",
      OnlineSecurity: "No",
      SupportCalls: 2,
      MonthlyCharges: 65.0,
      TotalCharges: 780.0,
      UsageFrequency: "Weekly",
      ServiceUsage: "Medium",
      LastActivity: "Today",
    });
  };

  return (
    <Modal
      isOpen={isAddModalOpen}
      onClose={() => setIsAddModalOpen(false)}
      title="Add New Customer Profile"
      size="lg"
      footer={
        <>
          <button className="btn btn-secondary" onClick={() => setIsAddModalOpen(false)}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={submitting || !formData.CustomerName}>
            {submitting ? (
              "Running ML Predictor..."
            ) : (
              <>
                <UserPlus size={16} /> Save & Predict Churn
              </>
            )}
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        <div
          style={{
            padding: "0.85rem 1rem",
            background: "rgba(99, 102, 241, 0.08)",
            borderRadius: "var(--radius-md)",
            border: "1px solid rgba(99, 102, 241, 0.2)",
            display: "flex",
            alignItems: "center",
            gap: "0.6rem",
            fontSize: "0.85rem",
            color: "var(--text-secondary)"
          }}
        >
          <Sparkles size={18} color="var(--primary)" />
          Our Scikit-learn Machine Learning pipeline will automatically evaluate this customer upon creation.
        </div>

        <div className="grid-3">
          <div className="form-group">
            <label className="form-label">Customer ID (Auto if blank)</label>
            <input
              type="text"
              name="CustomerID"
              className="form-control"
              placeholder="e.g. CUST-9999"
              value={formData.CustomerID}
              onChange={handleChange}
            />
          </div>

          <div className="form-group" style={{ gridColumn: "span 2" }}>
            <label className="form-label">Full Name *</label>
            <input
              type="text"
              name="CustomerName"
              className="form-control"
              placeholder="e.g. Jennifer Lopez"
              value={formData.CustomerName}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="grid-3">
          <div className="form-group">
            <label className="form-label">Age</label>
            <input
              type="number"
              name="Age"
              className="form-control"
              min="18"
              max="99"
              value={formData.Age}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Gender</label>
            <select name="Gender" className="form-control" value={formData.Gender} onChange={handleChange}>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Location</label>
            <input
              type="text"
              name="Location"
              className="form-control"
              value={formData.Location}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="grid-3">
          <div className="form-group">
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

          <div className="form-group">
            <label className="form-label">Contract Type</label>
            <select name="ContractType" className="form-control" value={formData.ContractType} onChange={handleChange}>
              <option value="Month-to-Month">Month-to-Month</option>
              <option value="One Year">One Year</option>
              <option value="Two Year">Two Year</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Subscription Tier</label>
            <select name="SubscriptionType" className="form-control" value={formData.SubscriptionType} onChange={handleChange}>
              <option value="Basic">Basic</option>
              <option value="Standard">Standard</option>
              <option value="Premium">Premium</option>
            </select>
          </div>
        </div>

        <div className="grid-3">
          <div className="form-group">
            <label className="form-label">Usage Frequency</label>
            <select name="UsageFrequency" className="form-control" value={formData.UsageFrequency} onChange={handleChange}>
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
              <option value="Rarely">Rarely</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Service Usage</label>
            <select name="ServiceUsage" className="form-control" value={formData.ServiceUsage} onChange={handleChange}>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Last Activity</label>
            <select name="LastActivity" className="form-control" value={formData.LastActivity} onChange={handleChange}>
              <option value="Today">Today</option>
              <option value="Yesterday">Yesterday</option>
              <option value="2 Days Ago">2 Days Ago</option>
              <option value="1 Week Ago">1 Week Ago</option>
              <option value="1 Month Ago">1 Month Ago</option>
            </select>
          </div>
        </div>

        <div className="grid-3">
          <div className="form-group">
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

          <div className="form-group">
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

          <div className="form-group">
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
          <div className="form-group">
            <label className="form-label">Support Calls</label>
            <input
              type="number"
              name="SupportCalls"
              className="form-control"
              min="0"
              max="15"
              value={formData.SupportCalls}
              onChange={handleChange}
            />
          </div>
        </div>
      </form>
    </Modal>
  );
}
