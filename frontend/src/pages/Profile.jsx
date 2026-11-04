import React, { useState } from "react";
import {
  User,
  Mail,
  Building,
  Briefcase,
  Shield,
  Edit2,
  Check,
  Server,
  Cpu,
  Moon,
  Sun
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCustomers } from "../context/CustomerContext";

export default function Profile() {
  const { currentUser, updateProfile, theme, toggleTheme } = useAuth();
  const { backendOnline, showToast } = useCustomers();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser?.name || "Alex Morgan",
    email: currentUser?.email || "alex.morgan@churnpredict.ai",
    organization: currentUser?.organization || "Enterprise Telecom AI Labs",
    role: currentUser?.role || "Senior Retention Analyst"
  });

  const handleSave = (e) => {
    e.preventDefault();
    updateProfile(formData);
    setIsEditing(false);
    showToast("Profile details updated successfully!", "success");
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-header-title">
            <User size={28} color="var(--primary)" /> User Profile & System Configuration
          </h1>
          <p className="page-header-desc">
            Manage your account details, model telemetry configurations, and application preferences.
          </p>
        </div>
      </div>

      <div className="grid-2" style={{ gap: "2rem" }}>
        {/* Profile Card */}
        <div className="glass-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
            <h3 style={{ fontSize: "1.15rem", fontWeight: 700, color: "var(--text-heading)", margin: 0 }}>
              Account Information
            </h3>
            <button
              className={`btn btn-sm ${isEditing ? "btn-secondary" : "btn-primary"}`}
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? "Cancel" : <><Edit2 size={14} /> Edit Profile</>}
            </button>
          </div>

          <div
            style={{
              padding: "1.25rem 1.5rem",
              borderRadius: "var(--radius-lg)",
              backgroundColor: "rgba(99, 102, 241, 0.08)",
              border: "1px solid rgba(99, 102, 241, 0.2)",
              marginBottom: "1.75rem"
            }}
          >
            <div style={{ fontSize: "1.35rem", fontWeight: 800, color: "var(--text-heading)" }}>
              {currentUser?.name}
            </div>
            <div style={{ fontSize: "0.85rem", color: "var(--primary)", fontWeight: 600, marginTop: "0.25rem" }}>
              {currentUser?.role}
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.3rem" }}>
              Member since {currentUser?.memberSince || "August 2025"}
            </div>
          </div>

          {isEditing ? (
            <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-control"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Organization / University</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.organization}
                  onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Role Title</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ marginTop: "0.5rem" }}>
                <Check size={16} /> Save Changes
              </button>
            </form>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ padding: "0.85rem 1rem", backgroundColor: "var(--bg-input)", borderRadius: "var(--radius-md)", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <Mail size={18} color="var(--primary)" />
                <div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Email</div>
                  <div style={{ fontWeight: 600, color: "var(--text-heading)", fontSize: "0.9rem" }}>{currentUser?.email}</div>
                </div>
              </div>

              <div style={{ padding: "0.85rem 1rem", backgroundColor: "var(--bg-input)", borderRadius: "var(--radius-md)", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <Building size={18} color="var(--primary)" />
                <div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Organization</div>
                  <div style={{ fontWeight: 600, color: "var(--text-heading)", fontSize: "0.9rem" }}>{currentUser?.organization}</div>
                </div>
              </div>

              <div style={{ padding: "0.85rem 1rem", backgroundColor: "var(--bg-input)", borderRadius: "var(--radius-md)", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <Briefcase size={18} color="var(--primary)" />
                <div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Role & Access</div>
                  <div style={{ fontWeight: 600, color: "var(--text-heading)", fontSize: "0.9rem" }}>{currentUser?.role} (Administrator)</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* System & ML Configuration */}
        <div className="glass-card">
          <h3 style={{ fontSize: "1.15rem", fontWeight: 700, color: "var(--text-heading)", marginBottom: "1.25rem" }}>
            Machine Learning System Status
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {/* Backend Engine Status */}
            <div
              style={{
                padding: "1rem",
                borderRadius: "var(--radius-md)",
                backgroundColor: backendOnline ? "rgba(16, 185, 129, 0.08)" : "rgba(99, 102, 241, 0.08)",
                border: `1px solid ${backendOnline ? "rgba(16, 185, 129, 0.3)" : "rgba(99, 102, 241, 0.3)"}`,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <Server size={22} color={backendOnline ? "var(--success)" : "var(--primary)"} />
                <div>
                  <div style={{ fontWeight: 700, color: "var(--text-heading)", fontSize: "0.9rem" }}>
                    Flask ML REST API Backend
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                    http://localhost:5000 (Python Scikit-Learn Server)
                  </div>
                </div>
              </div>

              <span className={`badge ${backendOnline ? "badge-low" : "badge-active"}`}>
                {backendOnline ? "Active Server" : "Client Engine Ready"}
              </span>
            </div>

            {/* Model Architecture Info */}
            <div style={{ padding: "1rem", backgroundColor: "var(--bg-input)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-heading)", fontWeight: 700, fontSize: "0.9rem", marginBottom: "0.5rem" }}>
                <Cpu size={16} color="var(--primary)" /> Classifier Architecture
              </div>
              <ul style={{ paddingLeft: "1.25rem", color: "var(--text-secondary)", fontSize: "0.825rem", display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                <li><b>Algorithm:</b> Random Forest Classifier (150 Estimators, max_depth=12)</li>
                <li><b>Optimization Metric:</b> ROC-AUC Score (82.2%) & F1-Score</li>
                <li><b>Preprocessing:</b> StandardScaler + ColumnTransformer OneHotEncoder</li>
                <li><b>Database:</b> MySQL / In-Memory DataFrame Storage</li>
              </ul>
            </div>

            {/* Appearance Theme Selector */}
            <div style={{ padding: "1rem", backgroundColor: "var(--bg-input)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontWeight: 600, color: "var(--text-heading)", fontSize: "0.9rem" }}>
                  Display Appearance Theme
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                  Toggle between high-contrast dark mode and clean light theme
                </div>
              </div>

              <button className="btn btn-secondary btn-sm" onClick={toggleTheme}>
                {theme === "dark" ? <><Sun size={15} /> Light Theme</> : <><Moon size={15} /> Dark Theme</>}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
