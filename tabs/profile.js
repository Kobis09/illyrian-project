// tabs/profile.js — FULLY PREMIUM ILLYRIAN VERSION
import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import {
  doc,
  getDoc,
  updateDoc
} from "firebase/firestore";
import {
  sendEmailVerification,
  updateEmail,
  reauthenticateWithCredential,
  EmailAuthProvider,
  sendPasswordResetEmail
} from "firebase/auth";

export default function Profile() {
  const [user, setUser] = useState(null);

  const [username, setUsername] = useState("");
  const [newUsername, setNewUsername] = useState("");

  const [newEmail, setNewEmail] = useState("");
  const [passwordForEmailChange, setPasswordForEmailChange] = useState("");

  const [usdtWallet, setUsdtWallet] = useState("");
  const [tokenWallet, setTokenWallet] = useState("");

  const [loading, setLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState("");

  const [emailVerified, setEmailVerified] = useState(false);

  useEffect(() => {
    const u = auth.currentUser;
    if (!u) return;

    setUser(u);
    setEmailVerified(u.emailVerified);

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
      } catch (err) {
        console.log("Profile load failed:", err);
      }

      setLoading(false);
    };

    load();
  }, []);

  const saveUsername = async () => {
    if (!newUsername.trim()) return;

    try {
      await updateDoc(doc(db, "users", user.uid), {
        username: newUsername.trim(),
      });

      setUsername(newUsername.trim());
      setStatusMsg("Username updated successfully!");
      setTimeout(() => setStatusMsg(""), 2500);
    } catch (err) {
      console.log("Failed to update username:", err);
    }
  };

  const startEmailVerification = async () => {
    try {
      await sendEmailVerification(auth.currentUser);
      setStatusMsg("Verification email sent! Check your inbox.");
      setTimeout(() => setStatusMsg(""), 3000);
    } catch (err) {
      console.log("Email verification error:", err);
      setStatusMsg("Error sending verification email.");
    }
  };

  const handleEmailChange = async () => {
    if (!newEmail.trim() || !passwordForEmailChange.trim()) return;

    try {
      const credential = EmailAuthProvider.credential(
        user.email,
        passwordForEmailChange
      );

      await reauthenticateWithCredential(user, credential);

      await updateEmail(user, newEmail.trim());

      await updateDoc(doc(db, "users", user.uid), {
        email: newEmail.trim(),
      });

      setStatusMsg("Email updated. Please verify your new email!");
      setTimeout(() => setStatusMsg(""), 3500);
    } catch (err) {
      console.log("Email change failed:", err);
      setStatusMsg("Email update failed.");
    }
  };

  const resetPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, user.email);
      setStatusMsg("Password reset email sent!");
      setTimeout(() => setStatusMsg(""), 3000);
    } catch (err) {
      console.log("Password reset error:", err);
      setStatusMsg("Failed to send reset email.");
    }
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

      {/* 🔥 EMAIL VERIFICATION BOX (AT TOP) */}
      {!emailVerified && (
        <div style={S.verifyBox}>
          <h3 style={S.verifyTitle}>⚠ Email Not Verified</h3>
          <p style={S.verifyDesc}>
            Please verify your email to fully secure your Illyrian account.
          </p>

          <div style={S.verifyBadge}>UNVERIFIED</div>

          <button style={S.verifyBtn} onClick={startEmailVerification}>
            Send Verification Email
          </button>
        </div>
      )}

      {emailVerified && (
        <div style={S.verifyBoxVerified}>
          <h3 style={S.verifyTitleVerified}>✔ Email Verified</h3>

          <div style={S.verifyBadgeVerified}>VERIFIED</div>
        </div>
      )}

      {/* USER INFO */}
      <div style={S.card}>
        <h3 style={S.cardTitle}>👤 Account Info</h3>

        <div style={S.row}>
          <span style={S.label}>Email:</span>
          <span style={S.value}>{user?.email}</span>
        </div>

        <div style={S.row}>
          <span style={S.label}>User ID:</span>
          <span style={S.value}>{user?.uid}</span>
        </div>
      </div>

      {/* USERNAME CHANGE */}
      <div style={S.card}>
        <h3 style={S.cardTitle}>✏ Change Username</h3>

        <input
          value={newUsername}
          onChange={(e) => setNewUsername(e.target.value)}
          style={S.input}
          placeholder="New username"
        />

        <button style={S.actionBtn} onClick={saveUsername}>
          Update Username
        </button>
      </div>

      {/* EMAIL CHANGE */}
      <div style={S.card}>
        <h3 style={S.cardTitle}>📧 Change Email</h3>

        <input
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          style={S.input}
          placeholder="New email address"
        />

        <input
          type="password"
          value={passwordForEmailChange}
          onChange={(e) => setPasswordForEmailChange(e.target.value)}
          style={S.input}
          placeholder="Enter password to confirm"
        />

        <button style={S.actionBtn} onClick={handleEmailChange}>
          Update Email
        </button>
      </div>

      {/* PASSWORD RESET */}
      <div style={S.card}>
        <h3 style={S.cardTitle}>🔐 Reset Password</h3>

        <button style={S.actionBtn} onClick={resetPassword}>
          Send Reset Email
        </button>
      </div>
      {/* WALLETS READ-ONLY */}
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

        <p style={S.notice}>
          To update your wallets, go to the <strong>Invest & Mine</strong> tab.
        </p>
      </div>

      {/* STATUS MESSAGE */}
      {statusMsg && <p style={S.statusMsg}>{statusMsg}</p>}
    </div>
  );
}

/* ========================= PREMIUM ILLYRIAN STYLES ========================= */

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

  /* EMAIL VERIFICATION BOX (UNVERIFIED) */
  verifyBox: {
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: "18px",
    padding: "22px 18px",
    marginBottom: "24px",
    backdropFilter: "blur(12px)",
    boxShadow: "0 0 35px rgba(255,165,0,0.18)",
    textAlign: "center",
  },

  verifyTitle: {
    fontSize: "1.2rem",
    marginBottom: "8px",
    fontWeight: 700,
    color: "rgba(255,190,120,1)",
  },

  verifyDesc: {
    fontSize: "0.95rem",
    color: "rgba(255,255,255,0.8)",
    marginBottom: "14px",
  },

  verifyBadge: {
    display: "inline-block",
    padding: "6px 18px",
    borderRadius: "30px",
    background: "rgba(255,165,0,0.18)",
    border: "1px solid rgba(255,165,0,0.45)",
    color: "orange",
    fontWeight: 700,
    marginBottom: "14px",
  },

  verifyBtn: {
    padding: "12px 20px",
    borderRadius: "12px",
    background: "linear-gradient(135deg,#8b5cf6,#3b82f6,#06b6d4)",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    width: "100%",
    fontWeight: 700,
    fontSize: "1rem",
    boxShadow: "0 6px 18px rgba(139,92,246,0.35)",
  },

  /* VERIFIED STYLE */
  verifyBoxVerified: {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "18px",
    padding: "22px 18px",
    marginBottom: "24px",
    backdropFilter: "blur(12px)",
    textAlign: "center",
    boxShadow: "0 0 30px rgba(16,185,129,0.22)",
  },

  verifyTitleVerified: {
    fontSize: "1.2rem",
    marginBottom: "8px",
    fontWeight: 700,
    color: "rgb(16,185,129)",
  },

  verifyBadgeVerified: {
    display: "inline-block",
    padding: "6px 20px",
    borderRadius: "30px",
    background: "rgba(16,185,129,0.15)",
    border: "1px solid rgba(16,185,129,0.45)",
    color: "rgb(16,185,129)",
    fontWeight: 700,
  },

  /* CARDS */
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

  /* ROWS */
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

  /* INPUTS */
  input: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.15)",
    background: "rgba(255,255,255,0.06)",
    color: "white",
    marginBottom: "12px",
    fontSize: "0.95rem",
  },

  actionBtn: {
    width: "100%",
    padding: "12px 20px",
    borderRadius: "12px",
    background: "linear-gradient(135deg,#8b5cf6,#3b82f6,#06b6d4)",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    fontWeight: 700,
    marginTop: "4px",
    boxShadow: "0 8px 20px rgba(139,92,246,0.28)",
  },

  notice: {
    marginTop: "8px",
    textAlign: "center",
    color: "rgba(255,255,255,0.65)",
    fontSize: "0.9rem",
  },

  statusMsg: {
    textAlign: "center",
    marginTop: "12px",
    fontSize: "0.95rem",
    color: "rgba(255,255,255,0.9)",
  },
};
