// tabs/EarningsOverview.js — PART 1/2
import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

export default function EarningsOverview() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // LAST actions
  const [lastInvest, setLastInvest] = useState(null);
  const [lastMining, setLastMining] = useState(null);

  // TOTAL earnings (calculated)
  const [totalTokensEarned, setTotalTokensEarned] = useState(0);
  const [totalInvestments, setTotalInvestments] = useState(0);
  const [totalMiningOperations, setTotalMiningOperations] = useState(0);

  useEffect(() => {
    const u = auth.currentUser;
    if (!u) return;

    setUser(u);

    const load = async () => {
      try {
        const snap = await getDoc(doc(db, "users", u.uid));
        if (snap.exists()) {
          const d = snap.data();

          // Last Investment
          if (d.lastInvestSummary) {
            setLastInvest(d.lastInvestSummary);
            setTotalInvestments(1);
            setTotalTokensEarned((prev) => prev + (d.lastInvestSummary.tokens || 0));
          }

          // Last Mining
          if (d.lastMiningSummary) {
            setLastMining(d.lastMiningSummary);
            setTotalMiningOperations(1);
            setTotalTokensEarned((prev) => prev + (d.lastMiningSummary.tier || 0));
          }
        }
      } catch (e) {
        console.log("earnings load error", e);
      }

      setLoading(false);
    };

    load();
  }, []);

  if (loading)
    return (
      <p style={{ textAlign: "center", color: "#bbb", padding: 40 }}>
        Loading earnings...
      </p>
    );

  return (
    <div style={S.page}>

      {/* ===== SUMMARY HEADER ===== */}
      <h2 style={S.title}>Your Earnings</h2>

      <div style={S.summaryBox}>
        <div style={S.summaryItem}>
          <p style={S.summaryValue}>{totalTokensEarned}</p>
          <p style={S.summaryLabel}>Total ILY Earned</p>
        </div>

        <div style={S.summaryItem}>
          <p style={S.summaryValue}>{totalInvestments}</p>
          <p style={S.summaryLabel}>Completed Investments</p>
        </div>

        <div style={S.summaryItem}>
          <p style={S.summaryValue}>{totalMiningOperations}</p>
          <p style={S.summaryLabel}>Completed Mining</p>
        </div>
      </div>

      {/* ===== LAST INVESTMENT ===== */}
      {lastInvest ? (
        <div style={S.card}>
          <h3 style={S.cardTitle}>💸 Last Investment</h3>

          <div style={S.row}>
            <span style={S.label}>Amount:</span>
            <span style={S.value}>{lastInvest.amount}</span>
          </div>

          <div style={S.row}>
            <span style={S.label}>Tokens Received:</span>
            <span style={S.value}>{lastInvest.tokens} ILY</span>
          </div>

          <div style={S.row}>
            <span style={S.label}>Completed At:</span>
            <span style={S.value}>
              {new Date(lastInvest.endedAt).toLocaleString()}
            </span>
          </div>
        </div>
      ) : (
        <p style={S.noData}>No investments completed yet.</p>
      )}

      {/* ===== LAST MINING ===== */}
      {lastMining ? (
        <div style={S.card}>
          <h3 style={S.cardTitle}>⛏️ Last Mining</h3>

          <div style={S.row}>
            <span style={S.label}>Tier:</span>
            <span style={S.value}>{lastMining.tier} ILY</span>
          </div>

          <div style={S.row}>
            <span style={S.label}>Fee Paid:</span>
            <span style={S.value}>${lastMining.fee}</span>
          </div>

          <div style={S.row}>
            <span style={S.label}>Completed At:</span>
            <span style={S.value}>
              {new Date(lastMining.endedAt).toLocaleString()}
            </span>
          </div>
        </div>
      ) : (
        <p style={S.noData}>No mining completed yet.</p>
      )}
      {/* END OF MAIN CONTENT */}
    </div>
  );
}

/* ====================== STYLES ====================== */
const S = {
  page: {
    padding: "26px 16px 40px",
    color: "white",
    fontFamily: "'Inter', sans-serif",
  },

  title: {
    textAlign: "center",
    fontSize: "clamp(1.8rem, 6vw, 2.4rem)",
    marginBottom: "26px",
    background: "linear-gradient(135deg,#8b5cf6,#3b82f6,#06b6d4)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    fontWeight: 800,
  },

  summaryBox: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "14px",
    marginBottom: "32px",
  },

  summaryItem: {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "14px",
    padding: "16px 8px",
    textAlign: "center",
    backdropFilter: "blur(12px)",
  },

  summaryValue: {
    fontSize: "1.4rem",
    fontWeight: 700,
    color: "#7dd3fc",
    margin: 0,
  },

  summaryLabel: {
    marginTop: "4px",
    fontSize: "0.8rem",
    color: "rgba(255,255,255,0.6)",
  },

  card: {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "16px",
    padding: "22px 18px",
    marginBottom: "22px",
    backdropFilter: "blur(12px)",
  },

  cardTitle: {
    fontSize: "1.2rem",
    marginBottom: "16px",
    fontWeight: 700,
    background: "linear-gradient(135deg,#fff,#c7d2fe)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },

  row: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "12px",
  },

  label: {
    color: "rgba(255,255,255,0.7)",
    fontSize: "0.95rem",
  },

  value: {
    color: "rgba(255,255,255,0.95)",
    fontWeight: 600,
    textAlign: "right",
    maxWidth: "55%",
    wordBreak: "break-word",
  },

  noData: {
    textAlign: "center",
    margin: "10px 0 22px",
    color: "rgba(255,255,255,0.5)",
    fontSize: "0.9rem",
  },
};

