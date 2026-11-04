import React from "react";
import {
  LayoutDashboard,
  Users,
  Sparkles,
  LineChart,
  Cpu,
  AlertTriangle,
  Lightbulb,
  History,
  User,
  LogOut,
  ChevronRight,
  Zap
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCustomers } from "../context/CustomerContext";

export default function Sidebar({ activePage, setActivePage, isMobileOpen, setIsMobileOpen }) {
  const { logout, currentUser } = useAuth();
  const { customers } = useCustomers();

  const highRiskCount = customers.filter((c) => c.RiskLevel === "High Risk").length;

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, badge: null },
    { id: "customers", label: "Customer Management", icon: Users, badge: customers.length },
    { id: "preprocessing", label: "Data Preprocessing", icon: Sparkles, badge: null },
    { id: "behavior", label: "Behavior Analysis", icon: LineChart, badge: null },
    { id: "prediction", label: "Churn Prediction", icon: Cpu, badge: "AI" },
    { id: "risk", label: "Risk Classification", icon: AlertTriangle, badge: highRiskCount ? `${highRiskCount}` : null, badgeColor: "danger" },
    { id: "retention", label: "Retention Strategy", icon: Lightbulb, badge: null },
    { id: "history", label: "Prediction History", icon: History, badge: null },
    { id: "profile", label: "Profile", icon: User, badge: null }
  ];

  const handleNavClick = (id) => {
    setActivePage(id);
    if (setIsMobileOpen) setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            zIndex: 90,
            backdropFilter: "blur(4px)"
          }}
        />
      )}

      <aside
        style={{
          width: "280px",
          minWidth: "280px",
          backgroundColor: "var(--bg-sidebar)",
          borderRight: "1px solid var(--border-card)",
          display: "flex",
          flexDirection: "column",
          position: "sticky",
          top: 0,
          height: "100vh",
          zIndex: 95,
          transition: "transform var(--transition-normal)",
          transform: isMobileOpen ? "translateX(0)" : undefined
        }}
        className={isMobileOpen ? "mobile-sidebar-open" : "desktop-sidebar"}
      >
        {/* Brand Header */}
        <div
          style={{
            padding: "1.5rem 1.5rem 1.25rem 1.5rem",
            borderBottom: "1px solid var(--border-color)",
            display: "flex",
            alignItems: "center",
            gap: "0.85rem"
          }}
        >
          <div
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "var(--radius-md)",
              background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #06b6d4 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ffffff",
              boxShadow: "0 0 15px rgba(99, 102, 241, 0.4)"
            }}
          >
            <Zap size={24} />
          </div>
          <div>
            <div style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--text-heading)", letterSpacing: "-0.02em" }}>
              ChurnPredict <span style={{ color: "var(--primary)" }}>AI</span>
            </div>
            <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 500, letterSpacing: "0.02em" }}>
              RETENTION & CHURN SUITE
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <div
          style={{
            flex: 1,
            padding: "1rem 0.85rem",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "0.3rem"
          }}
        >
          <div
            style={{
              fontSize: "0.7rem",
              fontWeight: 700,
              textTransform: "uppercase",
              color: "var(--text-muted)",
              letterSpacing: "0.08em",
              padding: "0.5rem 0.75rem"
            }}
          >
            Navigation
          </div>

          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                  padding: "0.7rem 0.9rem",
                  borderRadius: "var(--radius-md)",
                  border: "none",
                  backgroundColor: isActive ? "var(--primary-light)" : "transparent",
                  color: isActive ? "var(--primary)" : "var(--text-secondary)",
                  fontWeight: isActive ? 700 : 500,
                  fontSize: "0.9rem",
                  cursor: "pointer",
                  transition: "all var(--transition-fast)",
                  textAlign: "left"
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = "var(--bg-table-row-hover)";
                    e.currentTarget.style.color = "var(--text-heading)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = "var(--text-secondary)";
                  }
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <Icon size={19} color={isActive ? "var(--primary)" : "currentColor"} />
                  <span>{item.label}</span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  {item.badge && (
                    <span
                      style={{
                        fontSize: "0.7rem",
                        padding: "0.15rem 0.5rem",
                        borderRadius: "var(--radius-full)",
                        fontWeight: 700,
                        backgroundColor:
                          item.badgeColor === "danger"
                            ? "var(--danger-light)"
                            : isActive
                            ? "var(--primary)"
                            : "var(--bg-input)",
                        color:
                          item.badgeColor === "danger"
                            ? "var(--danger)"
                            : isActive
                            ? "#ffffff"
                            : "var(--text-muted)",
                        border:
                          item.badgeColor === "danger"
                            ? "1px solid rgba(239, 68, 68, 0.3)"
                            : "1px solid var(--border-color)"
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                  {isActive && <ChevronRight size={15} color="var(--primary)" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* User Card & Logout Footer */}
        <div
          style={{
            padding: "1rem 1.25rem",
            borderTop: "1px solid var(--border-color)",
            backgroundColor: "rgba(0, 0, 0, 0.15)"
          }}
        >
          <div
            style={{
              marginBottom: "0.85rem",
              padding: "0.35rem 0.25rem"
            }}
          >
            <div
              style={{
                fontSize: "0.875rem",
                fontWeight: 700,
                color: "var(--text-heading)",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap"
              }}
            >
              {currentUser?.name || "Admin"}
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.15rem" }}>
              {currentUser?.role || "ML Engineer"}
            </div>
          </div>

          <button
            onClick={logout}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              width: "100%",
              padding: "0.55rem",
              borderRadius: "var(--radius-md)",
              border: "1px solid rgba(239, 68, 68, 0.25)",
              backgroundColor: "rgba(239, 68, 68, 0.08)",
              color: "var(--danger)",
              fontSize: "0.825rem",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all var(--transition-fast)"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(239, 68, 68, 0.18)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(239, 68, 68, 0.08)";
            }}
          >
            <LogOut size={15} /> Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
