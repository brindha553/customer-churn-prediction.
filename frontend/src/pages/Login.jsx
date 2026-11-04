import React, { useState } from "react";
import { Zap, Mail, Lock, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Login({ onSwitchToRegister }) {
  const { login } = useAuth();
  const [email, setEmail] = useState("analyst@churnpredict.ai");
  const [password, setPassword] = useState("password123");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      login(email, password);
      setLoading(false);
    }, 400);
  };

  const handleDemoLogin = () => {
    setEmail("admin@churnpredict.ai");
    setPassword("demo2026");
    login("admin@churnpredict.ai", "demo2026");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
        background: "radial-gradient(circle at 50% 20%, rgba(99, 102, 241, 0.15), transparent 70%), var(--bg-main)"
      }}
    >
      <div
        className="glass-card"
        style={{
          maxWidth: "460px",
          width: "100%",
          padding: "2.5rem 2rem",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
        }}
      >
        {/* Brand Header */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "var(--radius-lg)",
              background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #06b6d4 100%)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ffffff",
              marginBottom: "1rem",
              boxShadow: "0 0 25px rgba(99, 102, 241, 0.5)"
            }}
          >
            <Zap size={32} />
          </div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--text-heading)" }}>
            Welcome to <span style={{ color: "var(--primary)" }}>ChurnPredict AI</span>
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginTop: "0.4rem" }}>
            Smart Customer Retention & Churn Prediction Platform
          </p>
        </div>

        {/* Demo Fast-Login Button */}
        <button
          type="button"
          onClick={handleDemoLogin}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
            padding: "0.75rem",
            marginBottom: "1.5rem",
            backgroundColor: "rgba(99, 102, 241, 0.12)",
            border: "1px dashed rgba(99, 102, 241, 0.4)",
            borderRadius: "var(--radius-md)",
            color: "var(--primary)",
            fontWeight: 700,
            fontSize: "0.875rem",
            cursor: "pointer",
            transition: "all var(--transition-fast)"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(99, 102, 241, 0.22)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(99, 102, 241, 0.12)";
          }}
        >
          <ShieldCheck size={18} /> Quick Demo Login (One-Click Access)
        </button>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Email Address</label>
            <div className="search-box">
              <Mail size={18} />
              <input
                type="email"
                className="form-control"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
              <label className="form-label" style={{ margin: 0 }}>Password</label>
            </div>
            <div className="search-box">
              <Lock size={18} />
              <input
                type="password"
                className="form-control"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            style={{ width: "100%", marginTop: "0.5rem" }}
            disabled={loading}
          >
            {loading ? "Authenticating..." : <>Sign In <ArrowRight size={18} /></>}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "1.75rem", fontSize: "0.875rem", color: "var(--text-secondary)" }}>
          Don't have an account?{" "}
          <button
            onClick={onSwitchToRegister}
            style={{
              background: "none",
              border: "none",
              color: "var(--primary)",
              fontWeight: 700,
              cursor: "pointer",
              textDecoration: "underline"
            }}
          >
            Register Here
          </button>
        </div>
      </div>
    </div>
  );
}
