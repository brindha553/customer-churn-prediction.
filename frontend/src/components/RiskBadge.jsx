import React from "react";
import { AlertTriangle, CheckCircle, AlertCircle, ShieldAlert, UserCheck } from "lucide-react";

export default function RiskBadge({ level, status, showIcon = true, size = "md" }) {
  if (status) {
    if (status === "Churned") {
      return (
        <span className={`badge badge-churned ${size === "sm" ? "btn-sm" : ""}`}>
          {showIcon && <AlertCircle size={12} />}
          Churned
        </span>
      );
    }
    return (
      <span className={`badge badge-active ${size === "sm" ? "btn-sm" : ""}`}>
        {showIcon && <UserCheck size={12} />}
        Active
      </span>
    );
  }

  const normalized = (level || "").toLowerCase();

  if (normalized.includes("high")) {
    return (
      <span className={`badge badge-high ${size === "sm" ? "btn-sm" : ""}`}>
        {showIcon && <ShieldAlert size={12} />}
        High Risk
      </span>
    );
  }
  if (normalized.includes("medium") || normalized.includes("med")) {
    return (
      <span className={`badge badge-medium ${size === "sm" ? "btn-sm" : ""}`}>
        {showIcon && <AlertTriangle size={12} />}
        Medium Risk
      </span>
    );
  }
  return (
    <span className={`badge badge-low ${size === "sm" ? "btn-sm" : ""}`}>
      {showIcon && <CheckCircle size={12} />}
      Low Risk
    </span>
  );
}
