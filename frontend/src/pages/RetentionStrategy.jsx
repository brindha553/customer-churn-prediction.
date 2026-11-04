import React, { useState } from "react";
import {
  Lightbulb,
  ShieldAlert,
  AlertTriangle,
  ShieldCheck,
  Send,
  Tag,
  Headphones,
  Gift,
  PhoneForwarded,
  Sparkles,
  TrendingDown,
  CheckCircle2,
  Zap
} from "lucide-react";
import { useCustomers } from "../context/CustomerContext";

export default function RetentionStrategy() {
  const { showToast } = useCustomers();
  const [activeStrategy, setActiveStrategy] = useState("all");
  const [dispatching, setDispatching] = useState(null);

  const handleTriggerCampaign = (name) => {
    setDispatching(name);
    setTimeout(() => {
      setDispatching(null);
      showToast(`Campaign "${name}" has been scheduled and dispatched to targeted customer cohort!`, "success");
    }, 800);
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-header-title">
            <Lightbulb size={28} color="var(--warning)" /> Retention & Recommendation Strategy
          </h1>
          <p className="page-header-desc">
            Prescriptive intervention playbooks engineered to proactively prevent subscriber churn across risk tiers.
          </p>
        </div>

        <div style={{ display: "flex", gap: "0.5rem" }}>
          {["all", "high", "medium", "low"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveStrategy(tab)}
              className={`btn btn-sm ${activeStrategy === tab ? "btn-primary" : "btn-secondary"}`}
              style={{ textTransform: "capitalize" }}
            >
              {tab === "all" ? "All Strategies" : `${tab} Risk`}
            </button>
          ))}
        </div>
      </div>

      {/* STRATEGY 1: HIGH RISK PLAYBOOK */}
      {(activeStrategy === "all" || activeStrategy === "high") && (
        <div
          className="glass-card"
          style={{
            marginBottom: "2rem",
            borderLeft: "5px solid var(--danger)",
            position: "relative"
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1.25rem",
              flexWrap: "wrap",
              gap: "1rem"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "var(--radius-md)",
                  backgroundColor: "rgba(239, 68, 68, 0.15)",
                  color: "var(--danger)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <ShieldAlert size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--text-heading)", margin: 0 }}>
                  High-Risk Customer Playbook (Churn &gt; 70%)
                </h3>
                <p style={{ fontSize: "0.825rem", color: "var(--text-muted)", margin: "0.2rem 0 0 0" }}>
                  Urgent intervention playbook targeting immediate retention and churn mitigation
                </p>
              </div>
            </div>

            <button
              className="btn btn-primary"
              style={{ backgroundColor: "var(--danger)", borderColor: "var(--danger)" }}
              onClick={() => handleTriggerCampaign("High Risk Emergency Intervention")}
              disabled={dispatching === "High Risk Emergency Intervention"}
            >
              {dispatching === "High Risk Emergency Intervention" ? (
                "Dispatching Automation..."
              ) : (
                <>
                  <Send size={15} /> Execute High-Risk Campaign
                </>
              )}
            </button>
          </div>

          <div className="grid-3" style={{ gap: "1.25rem" }}>
            {/* Action 1 */}
            <div
              style={{
                padding: "1.25rem",
                backgroundColor: "var(--bg-input)",
                borderRadius: "var(--radius-lg)",
                border: "1px solid var(--border-color)"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--danger)", fontWeight: 700, fontSize: "0.95rem", marginBottom: "0.5rem" }}>
                <Tag size={18} /> Offer Special Discounts
              </div>
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "1rem" }}>
                Deliver automated 20%-30% retention discounts on annual plan switch to immediately counter price sensitivity.
              </p>
              <span className="badge badge-high">Expected Impact: -34% Churn</span>
            </div>

            {/* Action 2 */}
            <div
              style={{
                padding: "1.25rem",
                backgroundColor: "var(--bg-input)",
                borderRadius: "var(--radius-lg)",
                border: "1px solid var(--border-color)"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--danger)", fontWeight: 700, fontSize: "0.95rem", marginBottom: "0.5rem" }}>
                <Headphones size={18} /> Improve Customer Support
              </div>
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "1rem" }}>
                Route subscribers with ≥3 calls into a dedicated VIP senior support queue for expedited resolution.
              </p>
              <span className="badge badge-high">Priority Support Queue</span>
            </div>

            {/* Action 3 */}
            <div
              style={{
                padding: "1.25rem",
                backgroundColor: "var(--bg-input)",
                borderRadius: "var(--radius-lg)",
                border: "1px solid var(--border-color)"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--danger)", fontWeight: 700, fontSize: "0.95rem", marginBottom: "0.5rem" }}>
                <PhoneForwarded size={18} /> Follow-Up Communication
              </div>
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "1rem" }}>
                Trigger personalized outbound outreach from an account manager within 24 hours of high-risk flag.
              </p>
              <span className="badge badge-high">Outbound Account Review</span>
            </div>
          </div>
        </div>
      )}

      {/* STRATEGY 2: MEDIUM RISK PLAYBOOK */}
      {(activeStrategy === "all" || activeStrategy === "medium") && (
        <div
          className="glass-card"
          style={{
            marginBottom: "2rem",
            borderLeft: "5px solid var(--warning)",
            position: "relative"
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1.25rem",
              flexWrap: "wrap",
              gap: "1rem"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "var(--radius-md)",
                  backgroundColor: "rgba(245, 158, 11, 0.15)",
                  color: "var(--warning)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <AlertTriangle size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--text-heading)", margin: 0 }}>
                  Medium-Risk Customer Playbook (Churn 40% - 70%)
                </h3>
                <p style={{ fontSize: "0.825rem", color: "var(--text-muted)", margin: "0.2rem 0 0 0" }}>
                  Proactive nurturing campaigns to boost engagement and usage adoption
                </p>
              </div>
            </div>

            <button
              className="btn btn-primary"
              style={{ backgroundColor: "var(--warning)", borderColor: "var(--warning)" }}
              onClick={() => handleTriggerCampaign("Medium Risk Engagement Campaign")}
              disabled={dispatching === "Medium Risk Engagement Campaign"}
            >
              {dispatching === "Medium Risk Engagement Campaign" ? (
                "Dispatching..."
              ) : (
                <>
                  <Send size={15} /> Launch Engagement Campaign
                </>
              )}
            </button>
          </div>

          <div className="grid-3" style={{ gap: "1.25rem" }}>
            <div
              style={{
                padding: "1.25rem",
                backgroundColor: "var(--bg-input)",
                borderRadius: "var(--radius-lg)",
                border: "1px solid var(--border-color)"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--warning)", fontWeight: 700, fontSize: "0.95rem", marginBottom: "0.5rem" }}>
                <Gift size={18} /> Send Promotional Offers
              </div>
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "1rem" }}>
                Deliver exclusive seasonal discount codes and bonus feature trials to renew product excitement.
              </p>
              <span className="badge badge-medium">10% Upgrade Promo</span>
            </div>

            <div
              style={{
                padding: "1.25rem",
                backgroundColor: "var(--bg-input)",
                borderRadius: "var(--radius-lg)",
                border: "1px solid var(--border-color)"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--warning)", fontWeight: 700, fontSize: "0.95rem", marginBottom: "0.5rem" }}>
                <Zap size={18} /> Increase Customer Engagement
              </div>
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "1rem" }}>
                Send automated email workflows with best-practice tutorials, webinars, and feature discovery guides.
              </p>
              <span className="badge badge-medium">Active Usage Boost</span>
            </div>

            <div
              style={{
                padding: "1.25rem",
                backgroundColor: "var(--bg-input)",
                borderRadius: "var(--radius-lg)",
                border: "1px solid var(--border-color)"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--warning)", fontWeight: 700, fontSize: "0.95rem", marginBottom: "0.5rem" }}>
                <Sparkles size={18} /> Provide Service Upgrades
              </div>
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "1rem" }}>
                Offer free 3-month trial of Premium Tech Support or speed enhancement bundle.
              </p>
              <span className="badge badge-medium">Value Add Boost</span>
            </div>
          </div>
        </div>
      )}

      {/* STRATEGY 3: LOW RISK PLAYBOOK */}
      {(activeStrategy === "all" || activeStrategy === "low") && (
        <div
          className="glass-card"
          style={{
            marginBottom: "2rem",
            borderLeft: "5px solid var(--success)",
            position: "relative"
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1.25rem",
              flexWrap: "wrap",
              gap: "1rem"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "var(--radius-md)",
                  backgroundColor: "rgba(16, 185, 129, 0.15)",
                  color: "var(--success)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <ShieldCheck size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--text-heading)", margin: 0 }}>
                  Low-Risk Customer Playbook (Churn &lt; 40%)
                </h3>
                <p style={{ fontSize: "0.825rem", color: "var(--text-muted)", margin: "0.2rem 0 0 0" }}>
                  Loyalty rewards, referral advocacy, and steady satisfaction maintenance
                </p>
              </div>
            </div>

            <button
              className="btn btn-primary"
              style={{ backgroundColor: "var(--success)", borderColor: "var(--success)" }}
              onClick={() => handleTriggerCampaign("Loyalty Rewards Program")}
              disabled={dispatching === "Loyalty Rewards Program"}
            >
              {dispatching === "Loyalty Rewards Program" ? (
                "Sending..."
              ) : (
                <>
                  <Send size={15} /> Send Loyalty Benefits
                </>
              )}
            </button>
          </div>

          <div className="grid-3" style={{ gap: "1.25rem" }}>
            <div
              style={{
                padding: "1.25rem",
                backgroundColor: "var(--bg-input)",
                borderRadius: "var(--radius-lg)",
                border: "1px solid var(--border-color)"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--success)", fontWeight: 700, fontSize: "0.95rem", marginBottom: "0.5rem" }}>
                <CheckCircle2 size={18} /> Maintain Regular Communication
              </div>
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "1rem" }}>
                Deliver quarterly product digests and milestone celebration newsletters to maintain brand warmth.
              </p>
              <span className="badge badge-low">Quarterly Touchpoint</span>
            </div>

            <div
              style={{
                padding: "1.25rem",
                backgroundColor: "var(--bg-input)",
                borderRadius: "var(--radius-lg)",
                border: "1px solid var(--border-color)"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--success)", fontWeight: 700, fontSize: "0.95rem", marginBottom: "0.5rem" }}>
                <Gift size={18} /> Provide Loyalty Benefits
              </div>
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "1rem" }}>
                Reward long-tenure subscribers with tenure milestone anniversary gifts and referral credit bonuses.
              </p>
              <span className="badge badge-low">Anniversary Credits</span>
            </div>

            <div
              style={{
                padding: "1.25rem",
                backgroundColor: "var(--bg-input)",
                borderRadius: "var(--radius-lg)",
                border: "1px solid var(--border-color)"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--success)", fontWeight: 700, fontSize: "0.95rem", marginBottom: "0.5rem" }}>
                <Headphones size={18} /> Normal High-Standard Service
              </div>
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "1rem" }}>
                Preserve consistent high-speed SLA resolution and self-service portal satisfaction.
              </p>
              <span className="badge badge-low">Standard SLA</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
