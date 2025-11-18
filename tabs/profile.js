// tabs/profile.js — CLEAN + MATCHES DEFAULT UI STYLE
import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [usdtWallet, setUsdtWallet] = useState("");
  const [tokenWallet, setTokenWallet] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const u = auth.currentUser;
    if (!u) return;

    setUser(u);

    const load = async () => {
      try {
        const snap = await getDoc(doc(db, "users", u.uid));
        if (snap.exists()) {
          const data = snap.data();
          setUsername(data.username || "");
          setUsdtWallet(data.usdtWallet || "");
          setTokenWallet(data.tokenWallet || "");
        }
      } catch (err) {
        console.log("Profile load failed:", err);
      }
      setLoading(false);
    };

    load();
  }, []);

  if (loading)
    return (
      <p style={{ textAlign: "center", padding: 30, color: "#bbb" }}>
        Loading profile...
      </p>
    );

  return (
    <div style={S.page}>
      <h2 style={S.title}>Your Profile</h2>

      {/* USER BOX */}
      <div style={S.card}>
        <h3 style={S.cardTitle}>👤 Account Info</h3>
        <div style={S.row}>
          <span style={S.label}>Username:</span>
          <span style={S.value}>{username}</span>
        </div>
        <div style={S.row}>
          <span style={S.label}>Email:</span>
          <span style={S.value}>{user?.email}</span>
        </div>
        <div style={S.row}>
          <span style={S.label}>User ID:</span>
          <span style={S.value}>{user?.uid}</span>
        </div>
      </div>

      {/* WALLETS BOX */}
      <div style={S.card}>
        <h3 style={S.cardTitle}>💰 Wallet Information</h3>
        <div style={S.row}>
          <span style={S.label}>USDT Wallet:</span>
          <span style={S.value}>{usdtWallet || "Not set"}</span>
        </div>
        <div style={S.row}>
          <span style={S.label}>Token Wallet:</span>
          <span style={S.value}>{tokenWallet || "Not set"}</span>
        </div>
      </div>

      {/* NOTICE */}
      <p style={S.notice}>
        To update your wallets, go to the <strong>Invest & Mine</strong> tab.
      </p>
    </div>
  );
}

const S = {
  page: {
    padding: "26px 16px 40px",
    color: "white",
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

  card: {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "18px",
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
    maxWidth: "60%",
    wordBreak: "break-word",
  },

  notice: {
    marginTop: "12px",
    textAlign: "center",
    color: "rgba(255,255,255,0.65)",
    fontSize: "0.9rem",
  },
};
