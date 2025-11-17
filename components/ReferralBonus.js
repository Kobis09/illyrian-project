import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db, app } from "../firebase";
import { getFunctions, httpsCallable } from "firebase/functions";

export default function ReferralBonus({ user }) {
  const [referralCode, setReferralCode] = useState("");
  const [bonus, setBonus] = useState(0);
  const [copied, setCopied] = useState(false);
  const [inputCode, setInputCode] = useState("");
  const [status, setStatus] = useState("");
  const [fade, setFade] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // 🔥 Cloud Function
  const functions = getFunctions(app, "us-central1");
  const applyReferralCF = httpsCallable(functions, "applyReferral");

  // Generate new code
  const generateReferralCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 8; i++)
      code += chars[Math.floor(Math.random() * chars.length)];
    return code;
  };

  // Detect mobile
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);

    setFade(true);
    setTimeout(() => setFade(false), 3000);

    return () => window.removeEventListener("resize", check);
  }, []);

  // Load user referral info
  useEffect(() => {
    if (!user) return;

    const load = async () => {
      try {
        const userRef = doc(db, "users", user.uid);
        const snap = await getDoc(userRef);

        if (!snap.exists()) {
          const newCode = generateReferralCode();
          await setDoc(userRef, {
            referralCode: newCode,
            referralBonuses: 0,
          });
          setReferralCode(newCode);
          setBonus(0);
          return;
        }

        const data = snap.data();
        if (!data.referralCode) {
          const newCode = generateReferralCode();
          await setDoc(userRef, { referralCode: newCode }, { merge: true });
          setReferralCode(newCode);
        } else {
          setReferralCode(data.referralCode);
        }

        setBonus(data.referralBonuses || 0);
      } catch (err) {
        console.error(err);
        setStatus("❌ Failed to load referral data.");
      }
    };

    load();
  }, [user]);

  // Copy code
  const handleCopy = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleApplyCode = async () => {
  if (!user) return setStatus("⚠️ Please log in first.");
  if (!inputCode.trim()) return setStatus("⚠️ Enter a referral code.");

  const entered = inputCode.trim().toUpperCase();

  if (entered === referralCode)
    return setStatus("❌ You cannot use your own code.");

  setStatus("⏳ Applying referral...");

  try {
    const result = await applyReferralCF({ code: entered });
    const data = result.data;

    if (!data.success) {
      setStatus("❌ " + data.message);
      return;
    }

    setBonus(data.bonus);
    setStatus("✅ " + data.message);
    setInputCode("");

  } catch (err) {
    console.error("Cloud Function error:", err);
    
    // Better error message extraction
    const errorMessage = err.message || "Unknown error occurred";
    setStatus("❌ " + errorMessage);
  }
};

  const getBonusPercentage = (n) => n * 10;
  return (
    <div style={styles.page}>
      {/* HERO */}
      <section style={styles.section}>
        <h1 style={styles.title}>
          <span style={styles.gradient}>Referral</span> Program
        </h1>
        <p style={styles.subtitle}>
          Invite friends and earn <strong>timer-reduction bonuses.</strong>
        </p>
      </section>

      {/* YOUR CODE */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Your Referral Code</h2>

        <div style={styles.card}>
          <h3 style={styles.cardTitle}>📋 Your Code</h3>

          <div style={styles.codeBox}>
            {referralCode || "Loading..."}
          </div>

          {/* COPY BUTTON */}
          <button
            onClick={handleCopy}
            style={{
              ...styles.btn,
              background: copied
                ? "linear-gradient(135deg,#10b981,#059669)"
                : "linear-gradient(135deg,#8b5cf6,#3b82f6)",
            }}
          >
            {copied ? "✅ Copied!" : "Copy Code"}
          </button>

          <p style={styles.helpText}>
            Share this code and earn up to <strong>20% faster</strong> mining timers.
          </p>

          {/* Stats Row */}
          <div style={styles.statsRow}>
            <div style={styles.statBox}>
              <span style={styles.statLabel}>Bonuses</span>
              <span style={styles.statValue}>{bonus}/2</span>
            </div>

            <div style={styles.statBox}>
              <span style={styles.statLabel}>Boost</span>
              <span style={styles.statValue}>
                {getBonusPercentage(bonus)}%
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* APPLY CODE */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Apply a Referral Code</h2>

        <div style={styles.card}>
          <input
            style={styles.input}
            placeholder="Enter referral code"
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value.toUpperCase())}
            maxLength={8}
          />

          <button
            style={{
              ...styles.btn,
              opacity: !inputCode.trim() ? 0.35 : 1,
              cursor: !inputCode.trim() ? "not-allowed" : "pointer",
            }}
            disabled={!inputCode.trim()}
            onClick={handleApplyCode}
          >
            Apply Code
          </button>

          {status && <p style={styles.status}>{status}</p>}
        </div>
      </section>

      {/* Small live indicator */}
      {fade && (
        <div style={styles.syncIndicator}>
          <div style={styles.pulseCircle}></div>
          <span style={styles.syncText}>⚡ Referral system active</span>
        </div>
      )}
    </div>
  );
}

/* ======================================================
   STYLES — DARK + GLOW + GRADIENTS (MATCHING YOUR UI)
====================================================== */

const styles = {
  page: {
    padding: "20px 12px",
    color: "#fff",
    fontFamily: "'Inter', sans-serif",
  },

  section: {
    marginBottom: "35px",
    textAlign: "center",
  },

  title: {
    fontSize: "2.5rem",
    fontWeight: 800,
  },

  gradient: {
    background: "linear-gradient(135deg,#8b5cf6,#3b82f6,#06b6d4)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },

  subtitle: {
    color: "rgba(255,255,255,.8)",
    maxWidth: "420px",
    margin: "10px auto",
  },

  sectionTitle: {
    fontSize: "1.8rem",
    background: "linear-gradient(135deg,#fff,#a5b4fc)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    marginBottom: "20px",
  },

  card: {
    background: "rgba(255,255,255,.06)",
    borderRadius: "14px",
    padding: "20px 16px",
    margin: "0 auto",
    maxWidth: "450px",
    border: "1px solid rgba(255,255,255,.12)",
    backdropFilter: "blur(14px)",
  },

  cardTitle: {
    fontSize: "1.2rem",
    marginBottom: "12px",
    background: "linear-gradient(135deg,#fff,#a5b4fc)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },

  codeBox: {
    background: "rgba(255,255,255,.1)",
    borderRadius: "10px",
    padding: "16px",
    marginBottom: "10px",
    fontSize: "1.4rem",
    letterSpacing: "2px",
    fontWeight: 700,
  },

  btn: {
    padding: "12px 18px",
    borderRadius: "10px",
    color: "#fff",
    fontSize: "15px",
    fontWeight: "600",
    border: "none",
    width: "100%",
    cursor: "pointer",
    marginTop: "10px",
    transition: "0.25s",
    background: "linear-gradient(135deg,#8b5cf6,#3b82f6)",
    boxShadow: "0 4px 18px rgba(139,92,246,0.25)",
  },

  helpText: {
    fontSize: "13px",
    opacity: 0.85,
    marginTop: "10px",
  },

  statsRow: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "16px",
  },

  statBox: {
    flex: 1,
    background: "rgba(255,255,255,.08)",
    padding: "14px",
    borderRadius: "10px",
    margin: "0 6px",
  },

 statLabel: {
  fontSize: "13px",
  fontWeight: 600,
  letterSpacing: "0.5px",
  color: "rgba(255,255,255,0.85)",
  textShadow: "0 0 6px rgba(139,92,246,0.35)", // subtle glow
},


  statValue: {
    fontSize: "1.3rem",
    fontWeight: 700,
  },

  input: {
    width: "100%",
    padding: "14px",
    borderRadius: "10px",
    border: "1px solid rgba(255,255,255,.15)",
    background: "rgba(255,255,255,.08)",
    color: "#fff",
    fontSize: "15px",
    marginBottom: "12px",
    letterSpacing: "1px",
    textTransform: "uppercase",
  },

  status: {
    marginTop: "12px",
    fontSize: "14px",
    fontWeight: "600",
  },

  syncIndicator: {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    background: "rgba(255,255,255,0.12)",
    borderRadius: "16px",
    padding: "10px 16px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    backdropFilter: "blur(18px)",
  },

  pulseCircle: {
    width: "8px",
    height: "8px",
    background: "#10b981",
    borderRadius: "50%",
    animation: "pulse 1.5s infinite",
  },

  syncText: {
    fontSize: "12px",
    color: "rgba(255,255,255,0.9)",
  },

  
};
