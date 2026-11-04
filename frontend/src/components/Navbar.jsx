import React from "react";
import { Search, Sun, Moon, Server, Menu, Bell, UserPlus, Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCustomers } from "../context/CustomerContext";

export default function Navbar({ onMenuToggle, onOpenAddCustomer, activePage }) {
  const { theme, toggleTheme, currentUser } = useAuth();
  const { backendOnline, toastMessage } = useCustomers();

  const getPageTitle = (page) => {
    switch (page) {
      case "dashboard":
        return "Customer Analytics Dashboard";
      case "customers":
        return "Customer Data Management";
      case "preprocessing":
        return "Dataset Preprocessing Pipeline";
      case "behavior":
        return "Customer Behavior Analysis";
      case "prediction":
        return "AI Churn Prediction Studio";
      case "risk":
        return "Customer Risk Classification";
      case "retention":
        return "Retention & Campaign Strategy";
      case "history":
        return "Prediction Audit History";
      case "profile":
        return "User Profile & ML Settings";
      default:
        return "ChurnPredict AI";
    }
  };

  return (
    <header
      style={{
        height: "70px",
        backgroundColor: "var(--bg-card)",
        backdropFilter: "var(--glass-effect)",
        WebkitBackdropFilter: "var(--glass-effect)",
        borderBottom: "1px solid var(--border-card)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 2rem",
        position: "sticky",
        top: 0,
        zIndex: 80
      }}
    >
      {/* Toast Alert Banner */}
      {toastMessage && (
        <div
          style={{
            position: "fixed",
            top: "80px",
            right: "24px",
            zIndex: 1100,
            padding: "0.85rem 1.25rem",
            borderRadius: "var(--radius-md)",
            backgroundColor:
              toastMessage.type === "danger"
                ? "var(--danger)"
                : toastMessage.type === "info"
                ? "var(--info)"
                : "var(--success)",
            color: "#ffffff",
            fontWeight: 600,
            fontSize: "0.875rem",
            boxShadow: "var(--shadow-xl)",
            animation: "fadeIn 0.25s ease",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem"
          }}
        >
          <Sparkles size={16} /> {toastMessage.message}
        </div>
      )}

      {/* Left: Mobile Menu + Current Page Title */}
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <button
          onClick={onMenuToggle}
          style={{
            display: "none",
            background: "none",
            border: "none",
            color: "var(--text-primary)",
            cursor: "pointer",
            padding: "0.4rem"
          }}
          className="mobile-menu-btn"
        >
          <Menu size={22} />
        </button>

        <div>
          <h2 style={{ fontSize: "1.15rem", fontWeight: 700, margin: 0, color: "var(--text-heading)" }}>
            {getPageTitle(activePage)}
          </h2>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
            Random Forest ML Engine (Scikit-Learn)
          </div>
        </div>
      </div>

      {/* Right Controls */}
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        {/* Backend Status Indicator */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.45rem",
            padding: "0.35rem 0.75rem",
            borderRadius: "var(--radius-full)",
            fontSize: "0.75rem",
            fontWeight: 600,
            backgroundColor: backendOnline ? "rgba(16, 185, 129, 0.12)" : "rgba(99, 102, 241, 0.12)",
            color: backendOnline ? "var(--success)" : "var(--primary)",
            border: `1px solid ${backendOnline ? "rgba(16, 185, 129, 0.3)" : "rgba(99, 102, 241, 0.3)"}`
          }}
          title={backendOnline ? "Connected to Flask ML API (localhost:5000)" : "Running Hybrid Client/Server ML engine"}
        >
          <div
            style={{
              width: "7px",
              height: "7px",
              borderRadius: "50%",
              backgroundColor: backendOnline ? "var(--success)" : "var(--primary)",
              boxShadow: `0 0 6px ${backendOnline ? "var(--success)" : "var(--primary)"}`
            }}
          />
          <Server size={13} />
          {backendOnline ? "Flask ML Live" : "ML Engine Ready"}
        </div>

        {/* Quick Add Customer */}
        <button className="btn btn-primary btn-sm" onClick={onOpenAddCustomer}>
          <UserPlus size={15} /> Add Customer
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          style={{
            background: "var(--bg-input)",
            border: "1px solid var(--border-color)",
            color: "var(--text-secondary)",
            padding: "0.55rem",
            borderRadius: "var(--radius-md)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
          title={`Switch to ${theme === "dark" ? "Light" : "Dark"} mode`}
        >
          {theme === "dark" ? <Sun size={17} color="#fbbf24" /> : <Moon size={17} color="#6366f1" />}
        </button>
      </div>
    </header>
  );
}
