import React, { useState } from "react";
import {
  AlertTriangle, ShieldAlert, ShieldCheck,
  Eye, Send, ArrowRight
} from "lucide-react";
import RiskBadge from "../components/RiskBadge";
import { useCustomers } from "../context/CustomerContext";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function RiskClassification({ setActivePage }) {
  const { customers, stats, openViewModal, showToast } = useCustomers();
  const [activeTab, setActiveTab] = useState("High Risk");

  const highRisk   = customers.filter((c) => c.RiskLevel === "High Risk")
                              .sort((a, b) => b.ChurnProbability - a.ChurnProbability);
  const medRisk    = customers.filter((c) => c.RiskLevel === "Medium Risk")
                              .sort((a, b) => b.ChurnProbability - a.ChurnProbability);
  const lowRisk    = customers.filter((c) => c.RiskLevel === "Low Risk")
                              .sort((a, b) => a.ChurnProbability - b.ChurnProbability);

  const activeList = activeTab === "High Risk" ? highRisk : activeTab === "Medium Risk" ? medRisk : lowRisk;

  const total = stats.total || 1;
  const pieData = {
    labels: [
      `High Risk — ${stats.highRisk} (${Math.round((stats.highRisk / total) * 100)}%)`,
      `Medium Risk — ${stats.mediumRisk} (${Math.round((stats.mediumRisk / total) * 100)}%)`,
      `Low Risk — ${stats.lowRisk} (${Math.round((stats.lowRisk / total) * 100)}%)`
    ],
    datasets: [{
      data: [stats.highRisk, stats.mediumRisk, stats.lowRisk],
      backgroundColor: ["#ef4444", "#f59e0b", "#10b981"],
      borderColor: "var(--bg-card)",
      borderWidth: 2
    }]
  };

  const handleLaunchCampaign = (tier) => {
    showToast(`✅ Retention campaign launched for all ${tier} customers (${activeList.length} recipients)!`, "success");
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-header-title">
            <AlertTriangle size={28} color="var(--danger)" /> Customer Risk Classification
          </h1>
          <p className="page-header-desc">
            Live segmentation across <strong>{customers.length}</strong> customers by churn probability thresholds.
          </p>
        </div>
        <button className="btn btn-secondary" onClick={() => setActivePage("retention")}>
          Retention Playbooks <ArrowRight size={15} />
        </button>
      </div>

      {/* 3 Live Tier Summary Cards */}
      <div className="grid-3" style={{ marginBottom: "2rem" }}>
        {[
          {
            label: "High Risk Tier",
            count: stats.highRisk,
            subText: `Churn Probability > 70% — ${Math.round((stats.highRisk / total) * 100)}% of base`,
            badge: "badge-high",
            color: "var(--danger)",
            borderColor: "var(--danger)",
            bg: activeTab === "High Risk" ? "rgba(239,68,68,0.08)" : undefined,
            tab: "High Risk",
            icon: <ShieldAlert size={22} color="var(--danger)" />,
            tagText: "Immediate Retention Required"
          },
          {
            label: "Medium Risk Tier",
            count: stats.mediumRisk,
            subText: `Churn Probability 40%-70% — ${Math.round((stats.mediumRisk / total) * 100)}% of base`,
            badge: "badge-medium",
            color: "var(--warning)",
            borderColor: "var(--warning)",
            bg: activeTab === "Medium Risk" ? "rgba(245,158,11,0.08)" : undefined,
            tab: "Medium Risk",
            icon: <AlertTriangle size={22} color="var(--warning)" />,
            tagText: "Engagement & Offer Outreach"
          },
          {
            label: "Low Risk Tier",
            count: stats.lowRisk,
            subText: `Churn Probability < 40% — ${Math.round((stats.lowRisk / total) * 100)}% of base`,
            badge: "badge-low",
            color: "var(--success)",
            borderColor: "var(--success)",
            bg: activeTab === "Low Risk" ? "rgba(16,185,129,0.08)" : undefined,
            tab: "Low Risk",
            icon: <ShieldCheck size={22} color="var(--success)" />,
            tagText: "Healthy & Loyal Baseline"
          }
        ].map((tier) => (
          <div
            key={tier.tab}
            className="glass-card interactive"
            onClick={() => setActiveTab(tier.tab)}
            style={{ borderLeft: `4px solid ${tier.borderColor}`, backgroundColor: tier.bg, cursor: "pointer" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
              <span style={{ fontSize: "0.8rem", fontWeight: 700, color: tier.color, textTransform: "uppercase" }}>
                {tier.label}
              </span>
              {tier.icon}
            </div>
            <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text-heading)", marginBottom: "0.25rem" }}>
              {tier.count.toLocaleString()} Customers
            </div>
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.75rem" }}>
              {tier.subText}
            </div>
            <span className={`badge ${tier.badge}`}>{tier.tagText}</span>
          </div>
        ))}
      </div>

      {/* Pie Chart + Segmented Table */}
      <div className="grid-3" style={{ marginBottom: "2rem" }}>
        {/* Pie Chart */}
        <div className="glass-card">
          <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--text-heading)", marginBottom: "0.25rem" }}>
            Risk Distribution Pie
          </h3>
          <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "1.25rem" }}>
            {customers.length} customers total (live)
          </p>
          <div style={{ height: "230px", position: "relative" }}>
            <Pie
              data={pieData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: "bottom",
                    labels: { color: "#94a3b8", font: { size: 10 }, boxWidth: 12, padding: 8 }
                  }
                }
              }}
            />
          </div>
          <button
            className="btn btn-primary btn-sm"
            style={{ width: "100%", marginTop: "1.25rem" }}
            onClick={() => handleLaunchCampaign(activeTab)}
          >
            <Send size={14} /> Dispatch {activeTab} Playbook ({activeList.length})
          </button>
        </div>

        {/* Tabbed Segment Table */}
        <div className="glass-card" style={{ gridColumn: "span 2", padding: 0, overflow: "hidden" }}>
          <div style={{
            padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--border-color)",
            display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem"
          }}>
            <div>
              <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--text-heading)", margin: 0 }}>
                {activeTab} Customer Records ({activeList.length})
              </h3>
              <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", margin: "0.2rem 0 0 0" }}>
                Sorted by churn probability — click View to open retention modal
              </p>
            </div>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              {["High Risk", "Medium Risk", "Low Risk"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`btn btn-sm ${activeTab === tab ? "btn-primary" : "btn-secondary"}`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Customer ID</th>
                  <th>Name</th>
                  <th>Contract</th>
                  <th>Tenure</th>
                  <th>Monthly</th>
                  <th>Service Calls</th>
                  <th>Probability</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {activeList.slice(0, 8).map((c) => (
                  <tr key={c.CustomerID}>
                    <td style={{ fontFamily: "var(--font-mono)", fontWeight: 600, fontSize: "0.82rem", color: "var(--primary)" }}>
                      {c.CustomerID}
                    </td>
                    <td style={{ fontWeight: 700, color: "var(--text-heading)" }}>{c.CustomerName}</td>
                    <td style={{ fontSize: "0.82rem" }}>{c.ContractType}</td>
                    <td>{c.Tenure} mos</td>
                    <td style={{ fontWeight: 600 }}>${Number(c.MonthlyCharges).toFixed(2)}</td>
                    <td>{c.CustomerServiceCalls} calls</td>
                    <td>
                      <span style={{
                        fontWeight: 800,
                        color: c.ChurnProbability >= 70 ? "var(--danger)" : c.ChurnProbability >= 40 ? "var(--warning)" : "var(--success)"
                      }}>
                        {c.ChurnProbability}%
                      </span>
                    </td>
                    <td><RiskBadge status={c.CustomerStatus} size="sm" /></td>
                    <td>
                      <button className="btn btn-secondary btn-sm" onClick={() => openViewModal(c)}>
                        <Eye size={13} /> View
                      </button>
                    </td>
                  </tr>
                ))}
                {activeList.length === 0 && (
                  <tr>
                    <td colSpan={9} style={{ textAlign: "center", padding: "2.5rem", color: "var(--text-muted)" }}>
                      No customers in this risk tier.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {activeList.length > 8 && (
            <div style={{ padding: "0.75rem 1.5rem", borderTop: "1px solid var(--border-color)", fontSize: "0.82rem", color: "var(--text-muted)" }}>
              Showing 8 of {activeList.length} {activeTab} customers. Go to Customer Management to view all.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
