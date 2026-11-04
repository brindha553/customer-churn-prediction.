import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendDirection = "up",
  color = "primary",
  onClick
}) {
  const colorMap = {
    primary: {
      bg: "rgba(99, 102, 241, 0.12)",
      text: "#818cf8",
      border: "rgba(99, 102, 241, 0.25)",
      glow: "rgba(99, 102, 241, 0.2)"
    },
    success: {
      bg: "rgba(16, 185, 129, 0.12)",
      text: "#34d399",
      border: "rgba(16, 185, 129, 0.25)",
      glow: "rgba(16, 185, 129, 0.2)"
    },
    danger: {
      bg: "rgba(239, 68, 68, 0.12)",
      text: "#f87171",
      border: "rgba(239, 68, 68, 0.25)",
      glow: "rgba(239, 68, 68, 0.25)"
    },
    warning: {
      bg: "rgba(245, 158, 11, 0.12)",
      text: "#fbbf24",
      border: "rgba(245, 158, 11, 0.25)",
      glow: "rgba(245, 158, 11, 0.2)"
    },
    accent: {
      bg: "rgba(6, 182, 212, 0.12)",
      text: "#22d3ee",
      border: "rgba(6, 182, 212, 0.25)",
      glow: "rgba(6, 182, 212, 0.2)"
    }
  };

  const scheme = colorMap[color] || colorMap.primary;

  return (
    <div
      className={`glass-card ${onClick ? "interactive" : ""}`}
      onClick={onClick}
      style={{
        borderLeft: `4px solid ${scheme.text}`,
        position: "relative"
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
        <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
          {title}
        </span>
        {Icon && (
          <div
            style={{
              padding: "0.6rem",
              borderRadius: "var(--radius-md)",
              backgroundColor: scheme.bg,
              color: scheme.text,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: `0 0 12px ${scheme.glow}`
            }}
          >
            <Icon size={20} />
          </div>
        )}
      </div>

      <div style={{ fontSize: "1.9rem", fontWeight: 800, color: "var(--text-heading)", fontFamily: "var(--font-heading)", marginBottom: "0.4rem" }}>
        {value}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.825rem" }}>
        {trend && (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.2rem",
              fontWeight: 700,
              color: trendDirection === "down" ? "var(--success)" : "var(--danger)",
              backgroundColor: trendDirection === "down" ? "var(--success-light)" : "var(--danger-light)",
              padding: "0.15rem 0.45rem",
              borderRadius: "var(--radius-sm)"
            }}
          >
            {trendDirection === "up" ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
            {trend}
          </span>
        )}
        <span style={{ color: "var(--text-muted)" }}>{subtitle}</span>
      </div>
    </div>
  );
}
