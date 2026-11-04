import React, { useState } from "react";
import {
  History as HistoryIcon,
  Search,
  Filter,
  Download,
  Eye,
  Calendar,
  Sparkles,
  RotateCcw
} from "lucide-react";
import RiskBadge from "../components/RiskBadge";
import { useCustomers } from "../context/CustomerContext";

export default function History({ setActivePage }) {
  const { predictions, showToast } = useCustomers();

  const [searchTerm, setSearchTerm] = useState("");
  const [riskFilter, setRiskFilter] = useState("All");
  const [resultFilter, setResultFilter] = useState("All");
  const [selectedPred, setSelectedPred] = useState(null);

  const filtered = predictions.filter((p) => {
    const matchesSearch =
      p.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRisk = riskFilter === "All" || p.riskLevel === riskFilter;
    const matchesResult =
      resultFilter === "All"
        ? true
        : resultFilter === "Churn"
        ? p.predictionResult.includes("likely to CHURN")
        : !p.predictionResult.includes("likely to CHURN");

    return matchesSearch && matchesRisk && matchesResult;
  });

  const exportHistoryCSV = () => {
    const headers = ["PredictionID,CustomerName,Date,ChurnProbability,RiskLevel,PredictionResult"];
    const rows = filtered.map(
      (p) =>
        `"${p.id}","${p.customerName}","${p.date}",${p.churnProbability},"${p.riskLevel}","${p.predictionResult}"`
    );
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `churnpredict_history_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Prediction audit history exported to CSV successfully!");
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-header-title">
            <HistoryIcon size={28} color="var(--primary)" /> Prediction History & Audit Trail
          </h1>
          <p className="page-header-desc">
            Historical log of all machine learning inference runs and churn risk classifications.
          </p>
        </div>

        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button className="btn btn-secondary" onClick={exportHistoryCSV}>
            <Download size={16} /> Export Audit Log
          </button>
          <button className="btn btn-primary" onClick={() => setActivePage("prediction")}>
            <Sparkles size={16} /> Run New Prediction
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div
        className="glass-card"
        style={{
          padding: "1.25rem",
          marginBottom: "1.5rem",
          display: "flex",
          gap: "1rem",
          alignItems: "center",
          flexWrap: "wrap",
          justifyContent: "space-between"
        }}
      >
        <div className="search-box" style={{ flex: 1, minWidth: "260px" }}>
          <Search size={18} />
          <input
            type="text"
            className="form-control"
            placeholder="Search by customer name or Prediction ID (e.g. PRED-9801)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div style={{ display: "flex", gap: "0.75rem" }}>
          <select
            className="form-control"
            style={{ width: "auto" }}
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
          >
            <option value="All">All Risk Levels</option>
            <option value="High Risk">High Risk (&gt;70%)</option>
            <option value="Medium Risk">Medium Risk (40-70%)</option>
            <option value="Low Risk">Low Risk (&lt;40%)</option>
          </select>

          <select
            className="form-control"
            style={{ width: "auto" }}
            value={resultFilter}
            onChange={(e) => setResultFilter(e.target.value)}
          >
            <option value="All">All Results</option>
            <option value="Churn">Likely to Churn</option>
            <option value="Retain">Likely to Retain</option>
          </select>
        </div>
      </div>

      {/* Prediction History Table */}
      <div className="glass-card" style={{ padding: 0, overflow: "hidden" }}>
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Prediction ID</th>
                <th>Customer Name</th>
                <th>Prediction Date</th>
                <th>Churn Probability</th>
                <th>Risk Level</th>
                <th>Prediction Result</th>
                <th style={{ textAlign: "right" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", padding: "3rem", color: "var(--text-muted)" }}>
                    No prediction records found matching query.
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p.id}>
                    <td style={{ fontFamily: "var(--font-mono)", fontWeight: 700, color: "var(--primary)" }}>
                      {p.id}
                    </td>
                    <td style={{ fontWeight: 700, color: "var(--text-heading)" }}>
                      {p.customerName}
                    </td>
                    <td style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                        <Calendar size={13} /> {p.date}
                      </div>
                    </td>
                    <td>
                      <span
                        style={{
                          fontWeight: 800,
                          fontSize: "0.95rem",
                          color:
                            p.churnProbability >= 70
                              ? "var(--danger)"
                              : p.churnProbability >= 40
                              ? "var(--warning)"
                              : "var(--success)"
                        }}
                      >
                        {p.churnProbability}%
                      </span>
                    </td>
                    <td>
                      <RiskBadge level={p.riskLevel} />
                    </td>
                    <td>
                      <span
                        style={{
                          fontWeight: 600,
                          fontSize: "0.85rem",
                          color: p.predictionResult.includes("likely to CHURN") ? "var(--danger)" : "var(--success)"
                        }}
                      >
                        {p.predictionResult}
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <span className="badge badge-active" style={{ fontSize: "0.7rem" }}>
                        Logged
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
