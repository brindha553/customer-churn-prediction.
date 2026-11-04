import React from "react";
import Modal from "./Modal";
import RiskBadge from "./RiskBadge";
import { User, Phone, Shield, Calendar, DollarSign, Activity, FileText, CheckCircle2, AlertTriangle, MapPin } from "lucide-react";
import { useCustomers } from "../context/CustomerContext";

export default function CustomerDetailModal() {
  const { selectedCustomer, isViewModalOpen, setIsViewModalOpen, showToast } = useCustomers();

  if (!selectedCustomer) return null;

  const handleApplyDiscount = () => {
    showToast(`Retention action dispatched to ${selectedCustomer.CustomerName}!`, "success");
    setIsViewModalOpen(false);
  };

  return (
    <Modal
      isOpen={isViewModalOpen}
      onClose={() => setIsViewModalOpen(false)}
      title="Customer Profile & Churn Risk Analysis"
      size="lg"
      footer={
        <>
          <button className="btn btn-secondary" onClick={() => setIsViewModalOpen(false)}>
            Close
          </button>
          <button className="btn btn-primary" onClick={handleApplyDiscount}>
            <Shield size={16} /> Deploy Retention Action
          </button>
        </>
      }
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {/* Customer Header Banner */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "1.25rem",
            backgroundColor: "var(--bg-input)",
            borderRadius: "var(--radius-lg)",
            border: "1px solid var(--border-color)",
            flexWrap: "wrap",
            gap: "1rem"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div
              style={{
                width: "52px",
                height: "52px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, var(--primary), var(--secondary))",
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.25rem",
                fontWeight: 700
              }}
            >
              {selectedCustomer.CustomerName?.charAt(0)}
            </div>
            <div>
              <div style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--text-heading)" }}>
                {selectedCustomer.CustomerName}
              </div>
              <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                {selectedCustomer.CustomerID}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <RiskBadge level={selectedCustomer.RiskLevel} />
            <RiskBadge status={selectedCustomer.CustomerStatus} />
          </div>
        </div>

        {/* Churn Prediction */}
        <div
          style={{
            padding: "1.25rem",
            background: "rgba(99, 102, 241, 0.05)",
            border: "1px solid rgba(99, 102, 241, 0.2)",
            borderRadius: "var(--radius-lg)"
          }}
        >
          <div style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--text-heading)", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Activity size={18} color="var(--primary)" /> Churn Prediction
          </div>

          <div className="grid-2" style={{ gap: "1rem", marginBottom: "1rem" }}>
            <div>
              <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Prediction</div>
              <div style={{ fontSize: "1.1rem", fontWeight: 700, color: selectedCustomer.Churn === 1 ? "var(--danger)" : "var(--success)" }}>
                {selectedCustomer.Churn === 1 ? "Churn" : "No Churn"}
              </div>
            </div>
            <div>
              <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Risk Level</div>
              <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-heading)" }}>
                {selectedCustomer.RiskLevel}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
            <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-secondary)" }}>
              Churn Probability Score
            </span>
            <span
              style={{
                fontSize: "1rem",
                fontWeight: 800,
                color:
                  selectedCustomer.ChurnProbability >= 70
                    ? "var(--danger)"
                    : selectedCustomer.ChurnProbability >= 40
                    ? "var(--warning)"
                    : "var(--success)"
              }}
            >
              {selectedCustomer.ChurnProbability}%
            </span>
          </div>

          <div
            style={{
              width: "100%",
              height: "10px",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              borderRadius: "var(--radius-full)",
              overflow: "hidden",
              marginBottom: "1rem"
            }}
          >
            <div
              style={{
                width: `${selectedCustomer.ChurnProbability}%`,
                height: "100%",
                background:
                  selectedCustomer.ChurnProbability >= 70
                    ? "linear-gradient(90deg, #f59e0b, #ef4444)"
                    : selectedCustomer.ChurnProbability >= 40
                    ? "linear-gradient(90deg, #10b981, #f59e0b)"
                    : "linear-gradient(90deg, #06b6d4, #10b981)",
                borderRadius: "var(--radius-full)",
                transition: "width 0.8s ease"
              }}
            />
          </div>

          <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
            <strong>Important Risk Factors:</strong>
            <ul style={{ paddingLeft: "1.2rem", marginTop: "0.3rem" }}>
              {selectedCustomer.ContractType === "Month-to-Month" && <li>High risk from Month-to-Month contract</li>}
              {selectedCustomer.Tenure <= 12 && <li>High risk from short tenure ({selectedCustomer.Tenure} months)</li>}
              {selectedCustomer.MonthlyCharges >= 80 && <li>Price sensitivity due to high monthly charges (${selectedCustomer.MonthlyCharges})</li>}
              {selectedCustomer.SupportCalls >= 3 && <li>Customer frustration indicated by {selectedCustomer.SupportCalls} support calls</li>}
              {selectedCustomer.ContractType !== "Month-to-Month" && selectedCustomer.Tenure > 12 && selectedCustomer.MonthlyCharges < 80 && selectedCustomer.SupportCalls < 3 && <li>No significant risk factors identified.</li>}
            </ul>
          </div>
        </div>

        {/* Customer Information Grid */}
        <div style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--text-heading)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <User size={18} color="var(--primary)" /> Customer Information
        </div>
        <div className="grid-3" style={{ gap: "1rem" }}>
          <div style={{ padding: "1rem", backgroundColor: "var(--bg-input)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "var(--text-muted)", fontSize: "0.8rem", marginBottom: "0.3rem" }}>
              <User size={14} /> Demographics
            </div>
            <div style={{ fontWeight: 600, color: "var(--text-heading)", fontSize: "0.95rem" }}>
              {selectedCustomer.Age} yrs • {selectedCustomer.Gender}
            </div>
          </div>

          <div style={{ padding: "1rem", backgroundColor: "var(--bg-input)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "var(--text-muted)", fontSize: "0.8rem", marginBottom: "0.3rem" }}>
              <MapPin size={14} /> Location
            </div>
            <div style={{ fontWeight: 600, color: "var(--text-heading)", fontSize: "0.95rem" }}>
              {selectedCustomer.Location || "Unknown"}
            </div>
          </div>

          <div style={{ padding: "1rem", backgroundColor: "var(--bg-input)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "var(--text-muted)", fontSize: "0.8rem", marginBottom: "0.3rem" }}>
              <Calendar size={14} /> Tenure & Activity
            </div>
            <div style={{ fontWeight: 600, color: "var(--text-heading)", fontSize: "0.95rem" }}>
              {selectedCustomer.Tenure} Mos • {selectedCustomer.LastActivity || "Today"}
            </div>
          </div>

          <div style={{ padding: "1rem", backgroundColor: "var(--bg-input)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "var(--text-muted)", fontSize: "0.8rem", marginBottom: "0.3rem" }}>
              <DollarSign size={14} /> Financials
            </div>
            <div style={{ fontWeight: 600, color: "var(--text-heading)", fontSize: "0.95rem" }}>
              ${Number(selectedCustomer.MonthlyCharges).toFixed(2)}/mo • {selectedCustomer.PaymentMethod}
            </div>
          </div>

          <div style={{ padding: "1rem", backgroundColor: "var(--bg-input)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "var(--text-muted)", fontSize: "0.8rem", marginBottom: "0.3rem" }}>
              <FileText size={14} /> Contract Plan
            </div>
            <div style={{ fontWeight: 600, color: "var(--text-heading)", fontSize: "0.95rem" }}>
              {selectedCustomer.ContractType}
            </div>
          </div>

          <div style={{ padding: "1rem", backgroundColor: "var(--bg-input)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "var(--text-muted)", fontSize: "0.8rem", marginBottom: "0.3rem" }}>
              <Activity size={14} /> Subscription & Usage
            </div>
            <div style={{ fontWeight: 600, color: "var(--text-heading)", fontSize: "0.95rem" }}>
              {selectedCustomer.SubscriptionType} • {selectedCustomer.UsageFrequency || "Weekly"}
            </div>
          </div>

          <div style={{ padding: "1rem", backgroundColor: "var(--bg-input)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)", gridColumn: "span 3" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "var(--text-muted)", fontSize: "0.8rem", marginBottom: "0.3rem" }}>
              <Phone size={14} /> Services & Support
            </div>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <span style={{ fontWeight: 600, color: "var(--text-heading)", fontSize: "0.95rem" }}>
                Service Usage: {selectedCustomer.ServiceUsage || "Medium"}
              </span>
              <span style={{ fontWeight: 600, color: "var(--text-heading)", fontSize: "0.95rem" }}>
                Internet: {selectedCustomer.InternetService || "N/A"}
              </span>
              <span style={{ fontWeight: 600, color: "var(--text-heading)", fontSize: "0.95rem" }}>
                Support Calls: <span style={{color: selectedCustomer.SupportCalls >= 3 ? "var(--danger)" : "inherit"}}>{selectedCustomer.SupportCalls || selectedCustomer.CustomerServiceCalls || 0}</span>
              </span>
            </div>
          </div>
        </div>

        {/* AI Recommendations */}
        <div style={{ padding: "1.25rem", backgroundColor: "var(--bg-input)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-color)" }}>
          <div style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--text-heading)", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <CheckCircle2 size={18} color="var(--primary)" /> Retention Recommendation
          </div>
          <div style={{ color: "var(--text-secondary)", fontSize: "0.9rem", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            <div>
              <strong>Recommended Action:</strong> {selectedCustomer.Recommendation || (selectedCustomer.RiskLevel === "High Risk" ? "Assign dedicated account manager and offer 20% retention discount on a 1-Year contract." : selectedCustomer.RiskLevel === "Medium Risk" ? "Send customer satisfaction check-in and engagement survey." : "Offer standard renewal benefits to maintain high retention status.")}
            </div>
            <div>
              <strong>Reason:</strong> Based on the calculated churn probability of {selectedCustomer.ChurnProbability}%, the model suggests this action to maximize retention likelihood for {selectedCustomer.CustomerName}'s specific profile.
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
