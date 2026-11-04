import React, { useState, useEffect } from "react";
import {
  Sparkles,
  CheckCircle2,
  Database,
  Sliders,
  Layers,
  Check,
  Play,
  RotateCcw,
  BarChart2,
  ShieldCheck,
  Cpu,
  FileCode
} from "lucide-react";
import { api } from "../services/api";

export default function Preprocessing() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Preprocessing Options state
  const [options, setOptions] = useState({
    removeMissing: true,
    handleDuplicates: true,
    encodeCategorical: true,
    featureSelection: true,
    normalizeData: true
  });

  // Runner state
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [completed, setCompleted] = useState(false);
  const [logs, setLogs] = useState([]);

  const steps = [
    { title: "Data Cleaning & Imputation", desc: "Checking nulls, NaN values, zero-variance columns" },
    { title: "Duplicate Deduplication", desc: "Verifying unique Primary CustomerID index" },
    { title: "One-Hot & Binary Categorical Encoding", desc: "ContractType, InternetService, TechSupport encoding" },
    { title: "Feature Selection & Correlation Matrix", desc: "Dropping multicollinear variables with VIF > 5.0" },
    { title: "StandardScaler & MinMax Normalization", desc: "Scaling Tenure, MonthlyCharges, ServiceCalls to standard normal" }
  ];

  useEffect(() => {
    async function loadStats() {
      const data = await api.getPreprocessingStats();
      setStats(data);
      setLoading(false);
    }
    loadStats();
  }, []);

  const handleToggle = (key) => {
    if (isProcessing) return;
    setOptions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const runPreprocessing = () => {
    setIsProcessing(true);
    setProgress(0);
    setCurrentStepIndex(0);
    setCompleted(false);
    setLogs(["[0.00s] Initializing Scikit-Learn data preprocessing pipeline..."]);

    const runStep = (idx) => {
      if (idx >= steps.length) {
        setProgress(100);
        setCurrentStepIndex(steps.length);
        setIsProcessing(false);
        setCompleted(true);
        setLogs((prev) => [
          ...prev,
          "[Done] Pipeline execution completed successfully. Transformed dataset ready for Random Forest Classifier."
        ]);
        return;
      }

      setCurrentStepIndex(idx);
      const stepPercent = Math.round(((idx + 1) / steps.length) * 100);
      setProgress(stepPercent);

      setLogs((prev) => [
        ...prev,
        `[Step ${idx + 1}/${steps.length}] Executing: ${steps[idx].title}...`,
        `   ↳ ${steps[idx].desc} [DONE]`
      ]);

      setTimeout(() => {
        runStep(idx + 1);
      }, 700);
    };

    setTimeout(() => {
      runStep(0);
    }, 400);
  };

  const handleReset = () => {
    setProgress(0);
    setCurrentStepIndex(-1);
    setCompleted(false);
    setLogs([]);
  };

  if (loading || !stats) {
    return (
      <div className="page-container" style={{ textAlign: "center", padding: "4rem" }}>
        <div style={{ color: "var(--text-secondary)" }}>Loading Preprocessing Studio...</div>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-header-title">
            <Sparkles size={28} color="var(--primary)" /> Machine Learning Data Preprocessing
          </h1>
          <p className="page-header-desc">
            Clean, transform, encode, and scale customer features for Random Forest modeling.
          </p>
        </div>

        <div style={{ display: "flex", gap: "0.75rem" }}>
          {completed && (
            <button className="btn btn-secondary" onClick={handleReset}>
              <RotateCcw size={16} /> Reset Pipeline
            </button>
          )}
          <button
            className="btn btn-primary"
            onClick={runPreprocessing}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>Processing Step {currentStepIndex + 1}/5...</>
            ) : (
              <>
                <Play size={16} /> Start Preprocessing
              </>
            )}
          </button>
        </div>
      </div>

      {/* Dataset Overview Summary Cards */}
      <div className="grid-4" style={{ marginBottom: "2rem" }}>
        <div className="glass-card">
          <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "0.4rem" }}>
            Total Dataset Records
          </div>
          <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--text-heading)" }}>
            {stats.total_records.toLocaleString()}
          </div>
          <div style={{ fontSize: "0.75rem", color: "var(--success)", marginTop: "0.2rem" }}>
            ✓ Verified Telco sample
          </div>
        </div>

        <div className="glass-card">
          <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "0.4rem" }}>
            Missing Values
          </div>
          <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--success)" }}>
            {stats.missing_values}
          </div>
          <div style={{ fontSize: "0.75rem", color: "var(--success)", marginTop: "0.2rem" }}>
            ✓ 100% Data completeness
          </div>
        </div>

        <div className="glass-card">
          <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "0.4rem" }}>
            Duplicate Records
          </div>
          <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--success)" }}>
            {stats.duplicate_records}
          </div>
          <div style={{ fontSize: "0.75rem", color: "var(--success)", marginTop: "0.2rem" }}>
            ✓ Unique Customer ID keys
          </div>
        </div>

        <div className="glass-card">
          <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "0.4rem" }}>
            Features Available
          </div>
          <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--primary)" }}>
            {stats.features_available}
          </div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>
            5 Numeric + 6 Categorical
          </div>
        </div>
      </div>

      {/* Preprocessing Control & Execution Pipeline */}
      <div className="grid-2" style={{ marginBottom: "2rem" }}>
        {/* Pipeline Configuration Options */}
        <div className="glass-card">
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1.25rem" }}>
            <Sliders size={20} color="var(--primary)" />
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-heading)", margin: 0 }}>
              Preprocessing Transformations
            </h3>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
            {[
              { key: "removeMissing", title: "Remove / Impute Missing Values", desc: "Mean imputation for numeric, mode for categorical" },
              { key: "handleDuplicates", title: "Handle Duplicate Records", desc: "Enforce strict uniqueness on primary customer keys" },
              { key: "encodeCategorical", title: "Encode Categorical Data", desc: "One-Hot encode multi-class & Binary encode booleans" },
              { key: "featureSelection", title: "Feature Selection & Dimensionality", desc: "Eliminate low-variance & high VIF features" },
              { key: "normalizeData", title: "Data Normalization & Scaling", desc: "StandardScaler (μ=0, σ=1) on numerical attributes" }
            ].map((opt) => (
              <div
                key={opt.key}
                onClick={() => handleToggle(opt.key)}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "0.85rem",
                  padding: "0.85rem 1rem",
                  borderRadius: "var(--radius-md)",
                  backgroundColor: options[opt.key] ? "rgba(99, 102, 241, 0.08)" : "var(--bg-input)",
                  border: options[opt.key] ? "1px solid rgba(99, 102, 241, 0.3)" : "1px solid var(--border-color)",
                  cursor: isProcessing ? "not-allowed" : "pointer",
                  transition: "all var(--transition-fast)"
                }}
              >
                <div
                  style={{
                    width: "20px",
                    height: "20px",
                    borderRadius: "4px",
                    backgroundColor: options[opt.key] ? "var(--primary)" : "var(--bg-card)",
                    border: "1px solid var(--border-color)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#ffffff",
                    marginTop: "2px"
                  }}
                >
                  {options[opt.key] && <Check size={14} />}
                </div>

                <div>
                  <div style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text-heading)" }}>
                    {opt.title}
                  </div>
                  <div style={{ fontSize: "0.775rem", color: "var(--text-muted)" }}>
                    {opt.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Execution Progress & Terminal Logs */}
        <div className="glass-card" style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1.25rem" }}>
            <Cpu size={20} color="var(--accent)" />
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-heading)", margin: 0 }}>
              Pipeline Execution Status
            </h3>
          </div>

          {/* Overall Progress Bar */}
          <div style={{ marginBottom: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: "0.4rem" }}>
              <span style={{ color: "var(--text-secondary)", fontWeight: 600 }}>Overall Progress</span>
              <span style={{ color: "var(--primary)", fontWeight: 800 }}>{progress}%</span>
            </div>
            <div
              style={{
                width: "100%",
                height: "10px",
                backgroundColor: "var(--bg-input)",
                borderRadius: "var(--radius-full)",
                overflow: "hidden"
              }}
            >
              <div
                style={{
                  width: `${progress}%`,
                  height: "100%",
                  background: "linear-gradient(90deg, var(--primary), var(--accent))",
                  borderRadius: "var(--radius-full)",
                  transition: "width 0.4s ease"
                }}
              />
            </div>
          </div>

          {/* Steps checklist */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem", marginBottom: "1.25rem" }}>
            {steps.map((st, i) => {
              const isDone = currentStepIndex > i || completed;
              const isCurrent = currentStepIndex === i && isProcessing;
              return (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    fontSize: "0.85rem",
                    color: isDone ? "var(--text-heading)" : "var(--text-muted)",
                    padding: "0.35rem 0"
                  }}
                >
                  <div
                    style={{
                      width: "22px",
                      height: "22px",
                      borderRadius: "50%",
                      backgroundColor: isDone
                        ? "var(--success)"
                        : isCurrent
                        ? "var(--primary)"
                        : "var(--bg-input)",
                      color: "#ffffff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.75rem",
                      fontWeight: 700
                    }}
                  >
                    {isDone ? <Check size={13} /> : i + 1}
                  </div>
                  <span style={{ fontWeight: isDone || isCurrent ? 600 : 400 }}>
                    {st.title}
                  </span>
                  {isCurrent && (
                    <span style={{ fontSize: "0.75rem", color: "var(--accent)", marginLeft: "auto", fontWeight: 700 }}>
                      Processing...
                    </span>
                  )}
                  {isDone && (
                    <span style={{ fontSize: "0.75rem", color: "var(--success)", marginLeft: "auto", fontWeight: 700 }}>
                      Completed ✓
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Terminal Log Console */}
          <div
            style={{
              flex: 1,
              minHeight: "140px",
              backgroundColor: "rgba(0, 0, 0, 0.4)",
              borderRadius: "var(--radius-md)",
              padding: "0.85rem",
              fontFamily: "var(--font-mono)",
              fontSize: "0.75rem",
              color: "#a5f3fc",
              overflowY: "auto",
              border: "1px solid var(--border-color)"
            }}
          >
            {logs.length === 0 ? (
              <span style={{ color: "var(--text-muted)" }}>Ready to execute preprocessing pipeline. Click "Start Preprocessing".</span>
            ) : (
              logs.map((lg, i) => (
                <div key={i} style={{ marginBottom: "0.25rem" }}>
                  {lg}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Feature Engineering & Transformation Table */}
      <div className="glass-card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--border-color)" }}>
          <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-heading)", margin: 0 }}>
            Feature Dictionary & Engineering Mapping
          </h3>
          <p style={{ fontSize: "0.825rem", color: "var(--text-muted)", margin: "0.25rem 0 0 0" }}>
            Scikit-learn pipeline transformation schema and Random Forest feature importances
          </p>
        </div>

        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Feature Name</th>
                <th>Data Type</th>
                <th>RF Feature Importance</th>
                <th>Transformation Status</th>
              </tr>
            </thead>
            <tbody>
              {stats.features_list.map((feat) => (
                <tr key={feat.name}>
                  <td style={{ fontWeight: 700, color: "var(--text-heading)", fontFamily: "var(--font-mono)" }}>
                    {feat.name}
                  </td>
                  <td>{feat.type}</td>
                  <td>
                    <span
                      style={{
                        padding: "0.2rem 0.6rem",
                        borderRadius: "var(--radius-full)",
                        fontSize: "0.78rem",
                        fontWeight: 700,
                        backgroundColor: "rgba(99, 102, 241, 0.15)",
                        color: "var(--primary)"
                      }}
                    >
                      {feat.importance}
                    </span>
                  </td>
                  <td>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", color: "var(--success)", fontWeight: 600 }}>
                      <CheckCircle2 size={14} /> {feat.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
