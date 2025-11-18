// tabs/profile.js — SIMPLE • CLEAN • PREMIUM
import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [editing, setEditing] = useState(false);

  const [usdtWallet, setUsdtWallet] = useState("");
  const [tokenWallet, setTokenWallet] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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
          setNewUsername(data.username || "");
          setUsdtWallet(data.usdtWallet || "");
          setTokenWallet(data.tokenWallet || "");
        }
      } catch (e) {
        console.log("failed loading profile:", e);
      }

      setLoading(false);
    };

    load();
  }, []);

  const saveUsername = async () => {
    if (!newUsername.trim()) return;

    setSaving(true);

    try {
      await updateDoc(doc(db, "users", user.uid), {
        username: newUsername.trim(),
      });

      setUsername(newUsername.trim());
      setEditing(false);
    } catch (e) {
      console.log("username update failed:", e);
    }

    setSaving(false);
  };

  if (loading)
    return (
      <p style={{ textAlign: "center", padding: 30, color: "#bbb" }}>
        Loading profile...
      </p>
    );

  return (
    <div style={S.page}>
      <h2 style={S.title}>Your Profile</h2>

      {/* USERNAME BOX */}
      <div style={S.card}>
        <h3 style={S.cardTitle}>👤 Username</h3>

        {!editing ? (
          <>
            <p style={S.valueBig}>{username}</p>
            <button style={S.btn} onClick={() => setEditing(true)}>
              ✏️ Edit Username
            </button>
          </>
        ) : (
          <>
            <input
              style={S.input}
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
            />
            <div style={S.editRow}>
              <button
                style={S.saveBtn}
                onClick={saveUsername}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save"}
              </button>
              <button style={S.cancelBtn} onClick={() => setEditing(false)}>
                Cancel
              </button>
            </div>
          </>
        )}
      </div>

      {/* EMAIL */}
      <div style={S.card}>
        <h3 style={S.cardTitle}>📧 Email</h3>
        <p style={S.value}>{user?.email}</p>
      </div>

      {/* WALLETS */}
      <div style={S.card}>
        <h3 style={S.cardTitle}>💰 Wallet (USDT)</h3>
        <p style={S.value}>{usdtWallet || "Not set"}</p>
      </div>

      <div style={S.card}>
        <h3 style={S.cardTitle}>🪙 Token Wallet</h3>
        <p style={S.value}>{tokenWallet || "Not set"}</p>
      </div>
    </div>
  );
}

// ---------------------- UI STYLES ----------------------
const S = {
  page: {
    padding: "24px 16px 50px",
    color: "white",
  },

  title: {
    textAlign: "center",
    fontSize: "clamp(1.8rem, 6vw, 2.3rem)",
    marginBottom: "20px",
    background: "linear-gradient(135deg,#8b5cf6,#3b82f6,#06b6d4)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    fontWeight: 800,
  },

  card: {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "18px",
    padding: "18px 16px",
    marginBottom: "20px",
    backdropFilter: "blur(12px)",
  },

  cardTitle: {
    fontSize: "1.15rem",
    marginBottom: "12px",
    fontWeight: 700,
    background: "linear-gradient(135deg,#fff,#c7d2fe)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },

  valueBig: {
    color: "rgba(255,255,255,0.95)",
    fontWeight: 700,
    fontSize: "1.1rem",
    marginBottom: "12px",
    wordBreak: "break-word",
  },

  value: {
    color: "rgba(255,255,255,0.85)",
    fontWeight: 600,
    fontSize: "0.95rem",
    wordBreak: "break-word",
  },

  btn: {
    background: "rgba(255,255,255,0.1)",
    border: "1px solid rgba(255,255,255,0.25)",
    color: "white",
    padding: "8px 16px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: 600,
  },

  input: {
    width: "100%",
    padding: "10px",
    borderRadius: "10px",
    border: "1px solid rgba(255,255,255,0.25)",
    background: "rgba(0,0,0,0.3)",
    color: "white",
    marginBottom: "12px",
    fontSize: "1rem",
  },

  editRow: {
    display: "flex",
    gap: "10px",
  },

  saveBtn: {
    flex: 1,
    background: "linear-gradient(135deg,#10b981,#059669)",
    border: "none",
    padding: "10px 14px",
    borderRadius: "10px",
    color: "white",
    cursor: "pointer",
    fontWeight: 700,
  },

  cancelBtn: {
    flex: 1,
    background: "rgba(255,255,255,0.1)",
    border: "1px solid rgba(255,255,255,0.25)",
    padding: "10px 14px",
    borderRadius: "10px",
    color: "white",
    cursor: "pointer",
    fontWeight: 600,
  },
};
