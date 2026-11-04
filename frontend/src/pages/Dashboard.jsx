import React, { useMemo } from "react";
import {
  Users, UserCheck, UserX, AlertTriangle, Percent,
  Sparkles, ArrowRight, ShieldAlert, Clock, Eye, Zap,
  TrendingDown, TrendingUp
} from "lucide-react";
import StatCard from "../components/StatCard";
import RiskBadge from "../components/RiskBadge";
import { useCustomers } from "../context/CustomerContext";

import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, ArcElement, Title, Tooltip, Legend, Filler
} from "chart.js";
import heroImg from "../assets/dashboard_hero.jpg";
import { Line, Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, ArcElement, Title, Tooltip, Legend, Filler
);

// Chart.js options shared config
const chartTooltipDefaults = {
  backgroundColor: "rgba(11, 15, 25, 0.95)",
  titleFont: { family: "Outfit", size: 13 },
  bodyFont: { family: "Plus Jakarta Sans", size: 12 },
  padding: 10,
  borderColor: "rgba(255,255,255,0.1)",
  borderWidth: 1
};
const scaleDefaults = {
  x: { grid: { color: "rgba(255,255,255,0.04)" }, ticks: { color: "#64748b", font: { size: 11 } } },
  y: { grid: { color: "rgba(255,255,255,0.04)" }, ticks: { color: "#64748b", font: { size: 11 } } }
};

export default function Dashboard({ setActivePage }) {
  const { customers, predictions, stats, loading, openViewModal } = useCustomers();

  // Build chart datasets from live computed stats
  const trendChartData = useMemo(() => ({
    labels: stats.monthlyTrend.months,
    datasets: [
      {
        label: "Retained Customers",
        data: stats.monthlyTrend.retained,
        borderColor: "#10b981",
        backgroundColor: "rgba(16,185,129,0.10)",
        fill: true,
        tension: 0.38,
        pointBackgroundColor: "#10b981",
        pointBorderColor: "#ffffff",
        pointRadius: 4
      },
      {
        label: "Churned Customers",
        data: stats.monthlyTrend.churned,
        borderColor: "#ef4444",
        backgroundColor: "rgba(239,68,68,0.10)",
        fill: true,
        tension: 0.38,
        pointBackgroundColor: "#ef4444",
        pointBorderColor: "#ffffff",
        pointRadius: 4
      }
    ]
  }), [stats]);

  const riskDonutData = useMemo(() => ({
    labels: [
      `High Risk (>70%) — ${stats.highRisk}`,
      `Medium Risk (40-70%) — ${stats.mediumRisk}`,
      `Low Risk (<40%) — ${stats.lowRisk}`
    ],
    datasets: [{
      data: [stats.highRisk, stats.mediumRisk, stats.lowRisk],
      backgroundColor: ["#ef4444", "#f59e0b", "#10b981"],
      borderColor: "rgba(0,0,0,0.2)",
      borderWidth: 3,
      hoverOffset: 6
    }]
  }), [stats]);

  // Contract type breakdown bar for a mini chart in high-risk panel
  const highRiskCustomers = useMemo(
    () => customers.filter((c) => c.RiskLevel === "High Risk")
              .sort((a, b) => b.ChurnProbability - a.ChurnProbability)
              .slice(0, 7),
    [customers]
  );

  if (loading) {
    return (
      <div className="page-container" style={{ textAlign: "center", padding: "5rem" }}>
        <div style={{ color: "var(--text-secondary)", fontSize: "1.1rem" }}>
          Initialising AI Dashboard...
        </div>
      </div>
    );
  }

  const highRiskPct = stats.total > 0 ? Math.round((stats.highRisk / stats.total) * 100) : 0;
  const medRiskPct  = stats.total > 0 ? Math.round((stats.mediumRisk / stats.total) * 100) : 0;
  const lowRiskPct  = stats.total > 0 ? Math.round((stats.lowRisk / stats.total) * 100) : 0;

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-header-title">
            <Zap size={28} color="var(--primary)" /> Executive Retention Command Center
          </h1>
          <p className="page-header-desc">
            Live churn monitoring computed from <strong>{stats.total}</strong> customer
            records — risk scores auto-update when data changes.
          </p>
        </div>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button className="btn btn-secondary" onClick={() => setActivePage("behavior")}>
            Behavior Insights
          </button>
          <button className="btn btn-primary" onClick={() => setActivePage("prediction")}>
            <Sparkles size={16} /> New Prediction
          </button>
        </div>
      </div>

        {/* Hero Illustration */}
        <div className="glass-card hero-section" style={{ marginBottom: "2rem" }}>
          <img src={heroImg} alt="Dashboard Hero" className="hero-img" />
        </div>
        {/* ── 5 KPI Summary Cards (ALL LIVE) ── */}
      <div className="grid-5" style={{ marginBottom: "2rem" }}>
        <StatCard
          title="Total Customers"
          value={stats.total.toLocaleString()}
          subtitle="In monitored dataset"
          icon={Users}
          color="primary"
          onClick={() => setActivePage("customers")}
        />
        <StatCard
          title="Active Customers"
          value={stats.active.toLocaleString()}
          subtitle={`${stats.activeRetentionRate}% retention rate`}
          icon={UserCheck}
          trend={`${stats.activeRetentionRate}%`}
          trendDirection="down"
          color="success"
          onClick={() => setActivePage("customers")}
        />
        <StatCard
          title="Churned Customers"
          value={stats.churned.toLocaleString()}
          subtitle="Total attrition count"
          icon={UserX}
          trend={`${stats.churnRate}% rate`}
          trendDirection="up"
          color="danger"
          onClick={() => setActivePage("customers")}
        />
        <StatCard
          title="High Risk Customers"
          value={stats.highRisk.toLocaleString()}
          subtitle="Require immediate action"
          icon={AlertTriangle}
          trend={`${highRiskPct}% of base`}
          trendDirection="up"
          color="warning"
          onClick={() => setActivePage("risk")}
        />
        <StatCard
          title="Overall Churn Rate"
          value={`${stats.churnRate}%`}
          subtitle="Churned / Total customers"
          icon={Percent}
          trend={stats.churnRate > 18 ? "Above avg (18%)" : "Below avg (18%)"}
          trendDirection={stats.churnRate > 18 ? "up" : "down"}
          color="accent"
          onClick={() => setActivePage("behavior")}
        />
      </div>

      {/* ── Charts Row ── */}
      <div className="grid-3" style={{ marginBottom: "2rem" }}>
        {/* Churn Trend Line Chart — span 2 cols */}
        <div className="glass-card" style={{ gridColumn: "span 2" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
            <div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-heading)" }}>
                Monthly Churn &amp; Retention Trend
              </h3>
              <p style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
                Based on {stats.total} customer records — updates live when customers are added or removed
              </p>
            </div>
            <span className="badge badge-active">12-Month Rolling</span>
          </div>
          <div style={{ height: "290px", position: "relative" }}>
            <Line
              data={trendChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: "top", labels: { color: "#94a3b8", font: { family: "Plus Jakarta Sans", size: 12 } } },
                  tooltip: chartTooltipDefaults
                },
                scales: scaleDefaults
              }}
            />
          </div>
        </div>

        {/* Risk Distribution Donut */}
        <div className="glass-card">
          <div style={{ marginBottom: "1.25rem" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-heading)" }}>
              Risk Distribution
            </h3>
            <p style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
              Computed from actual churn probability scores
            </p>
          </div>
          <div style={{ height: "220px", position: "relative" }}>
            <Doughnut
              data={riskDonutData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: "bottom",
                    labels: { color: "#94a3b8", font: { family: "Plus Jakarta Sans", size: 10 }, boxWidth: 10, padding: 8 }
                  }
                },
                cutout: "68%"
              }}
            />
          </div>

          {/* Live count summary strip */}
          <div style={{
            marginTop: "1rem", padding: "0.75rem",
            background: "var(--bg-input)", borderRadius: "var(--radius-md)",
            display: "flex", justifyContent: "space-around", textAlign: "center"
          }}>
            <div>
              <div style={{ fontSize: "1.05rem", fontWeight: 800, color: "var(--danger)" }}>
                {stats.highRisk}
              </div>
              <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
                High ({highRiskPct}%)
              </div>
            </div>
            <div style={{ borderLeft: "1px solid var(--border-color)" }} />
            <div>
              <div style={{ fontSize: "1.05rem", fontWeight: 800, color: "var(--warning)" }}>
                {stats.mediumRisk}
              </div>
              <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
                Medium ({medRiskPct}%)
              </div>
            </div>
            <div style={{ borderLeft: "1px solid var(--border-color)" }} />
            <div>
              <div style={{ fontSize: "1.05rem", fontWeight: 800, color: "var(--success)" }}>
                {stats.lowRisk}
              </div>
              <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
                Low ({lowRiskPct}%)
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Quick Stats Strip ── */}
      <div className="grid-4" style={{ marginBottom: "2rem" }}>
        {Object.entries(stats.contractGroups).map(([contract, data]) => {
          const churnPct = data.total > 0 ? Math.round((data.churned / data.total) * 100) : 0;
          return (
            <div key={contract} className="glass-card" style={{ padding: "1rem 1.25rem" }}>
              <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: 600, marginBottom: "0.25rem" }}>
                {contract}
              </div>
              <div style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--text-heading)" }}>
                {data.total} Customers
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginTop: "0.35rem" }}>
                <div style={{ flex: 1, height: "6px", backgroundColor: "var(--bg-input)", borderRadius: "3px", overflow: "hidden" }}>
                  <div style={{
                    height: "100%", width: `${churnPct}%`, borderRadius: "3px",
                    backgroundColor: churnPct > 40 ? "var(--danger)" : churnPct > 20 ? "var(--warning)" : "var(--success)"
                  }} />
                </div>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: churnPct > 40 ? "var(--danger)" : churnPct > 20 ? "var(--warning)" : "var(--success)" }}>
                  {churnPct}% churn
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Bottom Section: High Risk Alert + Recent Predictions ── */}
      <div className="grid-2">
        {/* High-Risk Customer Alerts */}
        <div className="glass-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <ShieldAlert size={20} color="var(--danger)" />
              <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--text-heading)", margin: 0 }}>
                High-Risk Customer Alerts ({stats.highRisk})
              </h3>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={() => setActivePage("risk")}>
              View All <ArrowRight size={14} />
            </button>
          </div>

          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Contract</th>
                  <th>Monthly</th>
                  <th>Risk Score</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {highRiskCustomers.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)" }}>
                      No high-risk customers found. 🎉
                    </td>
                  </tr>
                ) : (
                  highRiskCustomers.map((cust) => (
                    <tr key={cust.CustomerID}>
                      <td>
                        <div style={{ fontWeight: 600, color: "var(--text-heading)" }}>{cust.CustomerName}</div>
                        <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                          {cust.CustomerID}
                        </div>
                      </td>
                      <td style={{ fontSize: "0.82rem" }}>{cust.ContractType}</td>
                      <td style={{ fontWeight: 600 }}>${Number(cust.MonthlyCharges).toFixed(2)}</td>
                      <td>
                        <span style={{ color: "var(--danger)", fontWeight: 800, fontSize: "0.95rem" }}>
                          {cust.ChurnProbability}%
                        </span>
                      </td>
                      <td>
                        <button className="btn btn-secondary btn-sm" onClick={() => openViewModal(cust)}>
                          <Eye size={13} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Prediction Activity Feed */}
        <div className="glass-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Clock size={20} color="var(--primary)" />
              <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--text-heading)", margin: 0 }}>
                Recent Prediction Activity
              </h3>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={() => setActivePage("history")}>
              Full Log <ArrowRight size={14} />
            </button>
          </div>

          {predictions.length === 0 ? (
            <div style={{ textAlign: "center", padding: "2.5rem 1rem", color: "var(--text-muted)" }}>
              <Sparkles size={32} color="var(--primary)" style={{ marginBottom: "0.5rem" }} />
              <div style={{ fontSize: "0.9rem" }}>No predictions yet. Run the first churn prediction!</div>
              <button className="btn btn-primary btn-sm" style={{ marginTop: "0.75rem" }} onClick={() => setActivePage("prediction")}>
                Go to Prediction Studio
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {predictions.slice(0, 6).map((pred) => (
                <div
                  key={pred.id}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "0.8rem 1rem",
                    backgroundColor: pred.churnProbability >= 70
                      ? "rgba(239,68,68,0.06)"
                      : pred.churnProbability >= 40
                      ? "rgba(245,158,11,0.06)"
                      : "rgba(16,185,129,0.06)",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--border-color)"
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, color: "var(--text-heading)", fontSize: "0.875rem" }}>
                      {pred.customerName}
                    </div>
                    <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", display: "flex", gap: "0.5rem" }}>
                      <span>{pred.id}</span><span>•</span><span>{pred.date}</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
                    <span style={{
                      fontWeight: 800, fontSize: "0.95rem",
                      color: pred.churnProbability >= 70 ? "var(--danger)" : pred.churnProbability >= 40 ? "var(--warning)" : "var(--success)"
                    }}>
                      {pred.churnProbability}%
                    </span>
                    <RiskBadge level={pred.riskLevel} size="sm" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
