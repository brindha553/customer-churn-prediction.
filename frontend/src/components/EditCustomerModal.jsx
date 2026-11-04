import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import { Edit2, Sparkles } from "lucide-react";
import { useCustomers } from "../context/CustomerContext";

export default function EditCustomerModal() {
  const { isEditModalOpen, setIsEditModalOpen, selectedCustomer, updateCustomer } = useCustomers();

  const [formData, setFormData] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Populate form whenever a customer is selected for editing
  useEffect(() => {
    if (selectedCustomer) {
      setFormData({
        CustomerName: selectedCustomer.CustomerName || "",
        Age: selectedCustomer.Age || 30,
        Gender: selectedCustomer.Gender || "Male",
        Tenure: selectedCustomer.Tenure || 12,
        SubscriptionType: selectedCustomer.SubscriptionType || "Standard",
        ContractType: selectedCustomer.ContractType || "Month-to-Month",
        InternetService: selectedCustomer.InternetService || "Fiber Optic",
        PaymentMethod: selectedCustomer.PaymentMethod || "Electronic Check",
        TechSupport: selectedCustomer.TechSupport || "No",
        OnlineSecurity: selectedCustomer.OnlineSecurity || "No",
        CustomerServiceCalls: selectedCustomer.CustomerServiceCalls ?? 2,
        MonthlyCharges: selectedCustomer.MonthlyCharges || 65.0,
        TotalCharges: selectedCustomer.TotalCharges || 780.0
      });
    }
  }, [selectedCustomer]);

  if (!selectedCustomer) return null;

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
    await updateCustomer(selectedCustomer.CustomerID, formData);
    setSubmitting(false);
    setIsEditModalOpen(false);
  };

  return (
    <Modal
      isOpen={isEditModalOpen}
      onClose={() => setIsEditModalOpen(false)}
      title={`Edit Customer — ${selectedCustomer.CustomerID}`}
      size="lg"
      footer={
        <>
          <button className="btn btn-secondary" onClick={() => setIsEditModalOpen(false)}>
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={submitting || !formData.CustomerName}
          >
            {submitting ? (
              "Re-running ML Prediction..."
            ) : (
              <>
                <Edit2 size={16} /> Save & Re-Predict Churn
              </>
            )}
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.15rem" }}>
        <div
          style={{
            padding: "0.8rem 1rem",
            background: "rgba(99,102,241,0.08)",
            borderRadius: "var(--radius-md)",
            border: "1px solid rgba(99,102,241,0.2)",
            display: "flex",
            alignItems: "center",
            gap: "0.6rem",
            fontSize: "0.85rem",
            color: "var(--text-secondary)"
          }}
        >
          <Sparkles size={16} color="var(--primary)" />
          Any changes will automatically re-run the Random Forest model to update churn probability and risk tier.
        </div>

        <div className="grid-2">
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Full Name *</label>
            <input
              type="text"
              name="CustomerName"
              className="form-control"
              value={formData.CustomerName || ""}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Age</label>
            <input type="number" name="Age" className="form-control" min="18" max="99"
              value={formData.Age || ""} onChange={handleChange} />
          </div>
        </div>

        <div className="grid-3">
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Gender</label>
            <select name="Gender" className="form-control" value={formData.Gender || "Male"} onChange={handleChange}>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Tenure (Months)</label>
            <input type="number" name="Tenure" className="form-control" min="1" max="72"
              value={formData.Tenure || ""} onChange={handleChange} />
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Contract Type</label>
            <select name="ContractType" className="form-control" value={formData.ContractType || ""} onChange={handleChange}>
              <option value="Month-to-Month">Month-to-Month</option>
              <option value="One Year">One Year</option>
              <option value="Two Year">Two Year</option>
            </select>
          </div>
        </div>

        <div className="grid-3">
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Subscription Tier</label>
            <select name="SubscriptionType" className="form-control" value={formData.SubscriptionType || ""} onChange={handleChange}>
              <option value="Basic">Basic</option>
              <option value="Standard">Standard</option>
              <option value="Premium">Premium</option>
            </select>
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Internet Service</label>
            <select name="InternetService" className="form-control" value={formData.InternetService || ""} onChange={handleChange}>
              <option value="Fiber Optic">Fiber Optic</option>
              <option value="DSL">DSL</option>
              <option value="No">No Internet</option>
            </select>
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Payment Method</label>
            <select name="PaymentMethod" className="form-control" value={formData.PaymentMethod || ""} onChange={handleChange}>
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
            <input type="number" step="0.01" name="MonthlyCharges" className="form-control"
              value={formData.MonthlyCharges || ""} onChange={handleChange} />
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Service Calls</label>
            <input type="number" name="CustomerServiceCalls" className="form-control" min="0" max="15"
              value={formData.CustomerServiceCalls ?? ""} onChange={handleChange} />
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Tech Support</label>
            <select name="TechSupport" className="form-control" value={formData.TechSupport || "No"} onChange={handleChange}>
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
          </div>
        </div>
      </form>
    </Modal>
  );
}
