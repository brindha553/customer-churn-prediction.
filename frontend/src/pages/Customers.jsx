import React, { useState } from "react";
import {
  Search,
  UserPlus,
  Filter,
  Eye,
  Trash2,
  Edit,
  Download,
  Upload,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Users
} from "lucide-react";
import RiskBadge from "../components/RiskBadge";
import { useCustomers } from "../context/CustomerContext";

export default function Customers() {
  const {
    customers,
    deleteCustomer,
    openViewModal,
    openEditModal,
    setIsAddModalOpen,
    uploadCSVFile,
    showToast
  } = useCustomers();

  const [searchTerm, setSearchTerm] = useState("");
  const [riskFilter, setRiskFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [subscriptionFilter, setSubscriptionFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Filter logic
  const filteredCustomers = customers.filter((cust) => {
    const matchesSearch =
      cust.CustomerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cust.CustomerID.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRisk = riskFilter === "All" || cust.RiskLevel === riskFilter;
    const matchesStatus = statusFilter === "All" || cust.CustomerStatus === statusFilter;
    const matchesSub = subscriptionFilter === "All" || cust.SubscriptionType === subscriptionFilter;

    return matchesSearch && matchesRisk && matchesStatus && matchesSub;
  });

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCustomers = filteredCustomers.slice(startIndex, startIndex + itemsPerPage);

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete customer record for "${name}" (${id})?`)) {
      deleteCustomer(id);
    }
  };

  const exportCSV = () => {
    const headers = [
      "CustomerID,CustomerName,Age,Gender,Tenure,SubscriptionType,MonthlyCharges,TotalCharges,ChurnProbability,RiskLevel,CustomerStatus"
    ];
    const rows = filteredCustomers.map(
      (c) =>
        `"${c.CustomerID}","${c.CustomerName}",${c.Age},"${c.Gender}",${c.Tenure},"${c.SubscriptionType}",${c.MonthlyCharges},${c.TotalCharges},${c.ChurnProbability},"${c.RiskLevel}","${c.CustomerStatus}"`
    );
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `churnpredict_customers_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Customer database exported to CSV successfully!");
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.name.endsWith(".csv")) {
        showToast("Please upload a CSV file.", "error");
        return;
      }
      uploadCSVFile(file);
    }
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-header-title">
            <Users size={28} color="var(--primary)" /> Customer Data Management
          </h1>
          <p className="page-header-desc">
            Manage subscriber records, examine churn telemetry, and execute retention workflows.
          </p>
        </div>

        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          <input 
            type="file" 
            id="csv-upload" 
            style={{ display: 'none' }} 
            accept=".csv" 
            onChange={handleFileUpload} 
          />
          <button className="btn btn-secondary" onClick={() => document.getElementById('csv-upload').click()}>
            <Upload size={16} /> Upload CSV
          </button>
          <button className="btn btn-secondary" onClick={exportCSV}>
            <Download size={16} /> Export CSV
          </button>
          <button className="btn btn-primary" onClick={() => setIsAddModalOpen(true)}>
            <UserPlus size={16} /> Add New Customer
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
            placeholder="Search by customer name or ID (e.g. Sarah, CUST-1001)..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <select
            className="form-control"
            style={{ width: "auto" }}
            value={riskFilter}
            onChange={(e) => {
              setRiskFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="All">All Risk Levels</option>
            <option value="High Risk">High Risk (&gt;70%)</option>
            <option value="Medium Risk">Medium Risk (40-70%)</option>
            <option value="Low Risk">Low Risk (&lt;40%)</option>
          </select>

          <select
            className="form-control"
            style={{ width: "auto" }}
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Churned">Churned</option>
          </select>

          <select
            className="form-control"
            style={{ width: "auto" }}
            value={subscriptionFilter}
            onChange={(e) => {
              setSubscriptionFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="All">All Plans</option>
            <option value="Basic">Basic</option>
            <option value="Standard">Standard</option>
            <option value="Premium">Premium</option>
          </select>
        </div>
      </div>

      {/* Customer Table */}
      <div className="glass-card" style={{ padding: 0, overflow: "hidden" }}>
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Customer ID</th>
                <th>Customer Name</th>
                <th>Age</th>
                <th>Gender</th>
                <th>Tenure</th>
                <th>Subscription</th>
                <th>Monthly Charges</th>
                <th>Total Charges</th>
                <th>Risk Level</th>
                <th>Customer Status</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedCustomers.length === 0 ? (
                <tr>
                  <td colSpan={11} style={{ textAlign: "center", padding: "3rem", color: "var(--text-muted)" }}>
                    No customer records matching your filter criteria.
                  </td>
                </tr>
              ) : (
                paginatedCustomers.map((c) => (
                  <tr key={c.CustomerID}>
                    <td style={{ fontFamily: "var(--font-mono)", fontWeight: 600, color: "var(--primary)" }}>
                      {c.CustomerID}
                    </td>
                    <td>
                      <div style={{ fontWeight: 700, color: "var(--text-heading)" }}>{c.CustomerName}</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{c.ContractType}</div>
                    </td>
                    <td>{c.Age}</td>
                    <td>{c.Gender}</td>
                    <td>{c.Tenure} mos</td>
                    <td>
                      <span
                        style={{
                          padding: "0.2rem 0.5rem",
                          borderRadius: "var(--radius-sm)",
                          fontSize: "0.8rem",
                          backgroundColor: "var(--bg-input)",
                          border: "1px solid var(--border-color)"
                        }}
                      >
                        {c.SubscriptionType}
                      </span>
                    </td>
                    <td style={{ fontWeight: 600 }}>${Number(c.MonthlyCharges).toFixed(2)}</td>
                    <td style={{ color: "var(--text-secondary)" }}>${Number(c.TotalCharges).toFixed(2)}</td>
                    <td>
                      <RiskBadge level={c.RiskLevel} />
                    </td>
                    <td>
                      <RiskBadge status={c.CustomerStatus} />
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <div style={{ display: "inline-flex", gap: "0.4rem" }}>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => openViewModal(c)}
                          title="View Customer Profile & Risk Details"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => openEditModal(c)}
                          title="Edit Customer Info"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => handleDelete(c.CustomerID, c.CustomerName)}
                          title="Delete Customer Record"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "1rem 1.5rem",
            borderTop: "1px solid var(--border-color)",
            backgroundColor: "rgba(0, 0, 0, 0.05)"
          }}
        >
          <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
            Showing <b>{startIndex + 1}</b> to <b>{Math.min(startIndex + itemsPerPage, filteredCustomers.length)}</b> of{" "}
            <b>{filteredCustomers.length}</b> customer entries
          </div>

          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              className="btn btn-secondary btn-sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </button>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "0 0.75rem",
                fontSize: "0.85rem",
                fontWeight: 600,
                color: "var(--text-secondary)"
              }}
            >
              Page {currentPage} of {totalPages}
            </div>
            <button
              className="btn btn-secondary btn-sm"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
