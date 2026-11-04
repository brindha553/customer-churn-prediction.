import React, { useMemo } from "react";
import { LineChart, Lightbulb, DollarSign, Calendar, PhoneCall } from "lucide-react";
import { useCustomers } from "../context/CustomerContext";

import {
  Chart as ChartJS, CategoryScale, LinearScale,
  BarElement, PointElement, LineElement, ArcElement,
  Title, Tooltip, Legend
} from "chart.js";
import { Bar, Line, Doughnut } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Title, Tooltip, Legend);

const tooltipOpts = {
  backgroundColor: "rgba(11,15,25,0.95)",
  titleFont: { family: "Outfit", size: 13 },
  bodyFont: { family: "Plus Jakarta Sans", size: 12 },
  padding: 10,
  borderColor: "rgba(255,255,255,0.1)",
  borderWidth: 1
};

export default function BehaviorAnalysis() {
  const { customers, stats, loading } = useCustomers();

  // ---- All chart data computed directly from the customer array ----
  const tenureChartData = useMemo(() => ({
    labels: stats.tenureChurnRates.map((t) => t.label),
    datasets: [{
      label: "Churn Rate (%)",
      data: stats.tenureChurnRates.map((t) => t.rate),
      backgroundColor: ["#ef4444", "#f59e0b", "#06b6d4", "#10b981"],
      borderRadius: 8
    }]
  }), [stats]);

  const chargesChartData = useMemo(() => ({
    labels: stats.chargeChurnRates.map((c) => c.label),
    datasets: [{
      label: "Churn Probability (%)",
      data: stats.chargeChurnRates.map((c) => c.rate),
      borderColor: "#f59e0b",
      backgroundColor: "rgba(245,158,11,0.12)",
      fill: true,
      tension: 0.38,
      pointBackgroundColor: "#f59e0b",
      pointRadius: 5
    }]
  }), [stats]);

  const contractChartData = useMemo(() => {
    const entries = Object.entries(stats.contractGroups);
    return {
      labels: entries.map(([k]) => k),
      datasets: [{
        label: "Churn Rate (%)",
        data: entries.map(([, v]) => v.total > 0 ? Math.round((v.churned / v.total) * 1000) / 10 : 0),
        backgroundColor: ["#ef4444", "#f59e0b", "#10b981"],
        borderRadius: 8
      }]
    };
  }, [stats]);

  const paymentChartData = useMemo(() => {
    const entries = Object.entries(stats.paymentGroups);
    return {
      labels: entries.map(([k]) => k),
      datasets: [{
        data: entries.map(([, v]) => v.total > 0 ? Math.round((v.churned / v.total) * 1000) / 10 : 0),
        backgroundColor: ["#ef4444", "#f59e0b", "#6366f1", "#10b981"],
        borderColor: "var(--bg-card)",
        borderWidth: 2
      }]
    };
  }, [stats]);

  const callsChartData = useMemo(() => {
    const entries = Object.entries(stats.callBuckets).sort(([a], [b]) => {
      const n = (x) => x === "6+" ? 6 : Number(x);
      return n(a) - n(b);
    });
    return {
      labels: entries.map(([k]) => `${k} Calls`),
      datasets: [{
        label: "Churn Risk (%)",
        data: entries.map(([, v]) => v.total > 0 ? Math.round((v.churned / v.total) * 1000) / 10 : 0),
        borderColor: "#ef4444",
        backgroundColor: "rgba(239,68,68,0.12)",
        fill: true,
        tension: 0.38,
        pointBackgroundColor: "#ef4444",
        pointRadius: 6
      }]
    };
  }, [stats]);

  // ---- Dynamic insights computed from actual data ----
  const insights = useMemo(() => {
    const highTenureChurn = stats.tenureChurnRates[0]?.rate ?? 0;
    const lowTenureChurn = stats.tenureChurnRates[3]?.rate ?? 0;
    const highChargeChurn = stats.chargeChurnRates[3]?.rate ?? 0;
    const contractEntries = Object.entries(stats.contractGroups);
    const m2mChurn = contractEntries.find(([k]) => k === "Month-to-Month")?.[1];
    const m2mRate = m2mChurn && m2mChurn.total > 0 ? Math.round((m2mChurn.churned / m2mChurn.total) * 100) : 0;

    const payEntries = Object.entries(stats.paymentGroups);
    const echeckRate = payEntries.reduce((worst, [k, v]) => {
      const r = v.total > 0 ? v.churned / v.total : 0;
      return r > worst.rate ? { k, rate: r } : worst;
    }, { k: "", rate: 0 });

    return [
      {
        title: "Customer Tenure Impact",
        text: `Customers in first 12 months show ${highTenureChurn}% churn vs only ${lowTenureChurn}% for 49-72 month veterans. Early engagement is critical.`,
        type: "warning"
      },
      {
        title: "Pricing Sensitivity",
        text: `Subscribers billed above $100/month face ${highChargeChurn}% churn — offer bundled discounts for price-sensitive high-spend cohorts.`,
        type: "danger"
      },
      {
        title: "Contract Commitment Drives Retention",
        text: `Month-to-Month plan customers show ${m2mRate}% churn rate. Incentivising annual upgrades significantly reduces attrition risk.`,
        type: "critical"
      },
      {
        title: "Payment Friction Matters",
        text: `${echeckRate.k} users show the highest churn rate (${Math.round(echeckRate.rate * 100)}%). Consider converting them to automated payment options.`,
        type: "info"
      }
    ];
  }, [stats]);

  if (loading) {
    return (
      <div className="page-container" style={{ textAlign: "center", padding: "4rem" }}>
        <div style={{ color: "var(--text-secondary)" }}>Loading Behavior Analytics...</div>
      </div>
    );
  }

  const scaleOpts = {
    x: { grid: { color: "rgba(255,255,255,0.04)" }, ticks: { color: "#64748b", font: { size: 11 } } },
    y: { grid: { color: "rgba(255,255,255,0.04)" }, ticks: { color: "#64748b" } }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-header-title">
            <LineChart size={28} color="var(--primary)" /> Customer Behavior Analysis
          </h1>
          <p className="page-header-desc">
            All charts computed live from <strong>{customers.length}</strong> customer records — updates automatically when data changes.
          </p>
        </div>
      </div>

      {/* Dynamic AI Insights */}
      <div className="glass-card" style={{ marginBottom: "2rem", borderLeft: "4px solid var(--primary)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
          <Lightbulb size={22} color="var(--warning)" />
          <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-heading)", margin: 0 }}>
            Live AI Behavioral Insights
          </h3>
          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginLeft: "auto" }}>
            Derived from {customers.length} customer records
          </span>
        </div>
        <div className="grid-2">
          {insights.map((ins, i) => (
            <div
              key={i}
              style={{
                padding: "1rem",
                backgroundColor: ins.type === "danger" || ins.type === "critical"
                  ? "rgba(239,68,68,0.07)"
                  : ins.type === "warning"
                  ? "rgba(245,158,11,0.07)"
                  : "rgba(59,130,246,0.07)",
                borderRadius: "var(--radius-md)",
                border: `1px solid ${ins.type === "danger" || ins.type === "critical"
                  ? "rgba(239,68,68,0.2)"
                  : ins.type === "warning"
                  ? "rgba(245,158,11,0.2)"
                  : "rgba(59,130,246,0.2)"}`
              }}
            >
              <div style={{
                fontWeight: 700,
                color: ins.type === "danger" || ins.type === "critical" ? "var(--danger)" : ins.type === "warning" ? "var(--warning)" : "var(--info)",
                fontSize: "0.9rem", marginBottom: "0.3rem"
              }}>
                {ins.title}
              </div>
              <div style={{ fontSize: "0.84rem", color: "var(--text-secondary)" }}>{ins.text}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid-2" style={{ marginBottom: "2rem" }}>
        <div className="glass-card">
          <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-heading)", marginBottom: "0.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Calendar size={17} color="var(--primary)" /> Tenure Cohort Churn Rate
          </h3>
          <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginBottom: "1rem" }}>Computed from {customers.length} customers</p>
          <div style={{ height: "240px" }}>
            <Bar data={tenureChartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: tooltipOpts }, scales: scaleOpts }} />
          </div>
        </div>

        <div className="glass-card">
          <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-heading)", marginBottom: "0.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <DollarSign size={17} color="var(--warning)" /> Monthly Charges vs Churn
          </h3>
          <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginBottom: "1rem" }}>Real churn correlation by price bracket</p>
          <div style={{ height: "240px" }}>
            <Line data={chargesChartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: tooltipOpts }, scales: scaleOpts }} />
          </div>
        </div>
      </div>

      <div className="grid-3">
        <div className="glass-card">
          <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--text-heading)", marginBottom: "0.25rem" }}>Contract Type Churn</h3>
          <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "1rem" }}>Live breakdown from dataset</p>
          <div style={{ height: "210px" }}>
            <Bar data={contractChartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: tooltipOpts }, scales: { ...scaleOpts, x: { ...scaleOpts.x, grid: { display: false } } } }} />
          </div>
        </div>

        <div className="glass-card">
          <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--text-heading)", marginBottom: "0.25rem" }}>Payment Method Risk (%)</h3>
          <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "1rem" }}>Churn rates per payment type</p>
          <div style={{ height: "210px" }}>
            <Doughnut data={paymentChartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: "bottom", labels: { color: "#94a3b8", font: { size: 10 }, boxWidth: 10 } }, tooltip: tooltipOpts }, cutout: "58%" }} />
          </div>
        </div>

        <div className="glass-card">
          <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--text-heading)", marginBottom: "0.25rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <PhoneCall size={15} color="var(--danger)" /> Support Calls Escalation
          </h3>
          <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "1rem" }}>Churn risk spikes above 3 calls</p>
          <div style={{ height: "210px" }}>
            <Line data={callsChartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: tooltipOpts }, scales: { ...scaleOpts, x: { ...scaleOpts.x, grid: { display: false } } } }} />
          </div>
        </div>
      </div>
    </div>
  );
}
