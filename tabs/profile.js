// tabs/profile.js — FULLY FUNCTIONAL PREMIUM VERSION (INLINE FIELDS)
import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import {
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import {
  sendEmailVerification,
  updateEmail,
  reauthenticateWithCredential,
  EmailAuthProvider,
  sendPasswordResetEmail,
} from "firebase/auth";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [usdtWallet, setUsdtWallet] = useState("");
  const [tokenWallet, setTokenWallet] = useState("");
  const [loading, setLoading] = useState(true);

  const [emailVerified, setEmailVerified] = useState(false);

  // Email change states
  const [newEmail, setNewEmail] = useState("");
  const [passwordForEmailChange, setPasswordForEmailChange] = useState("");

  // Username change states
  const [newUsername, setNewUsername] = useState("");

  // Status messages
  const [msg, setMsg] = useState("");

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

  const refreshUser = async () => {
    await auth.currentUser.reload();
    setEmailVerified(auth.currentUser.emailVerified);
  };

  /* ---------------- EMAIL VERIFICATION ---------------- */
  const handleSendVerification = async () => {
    try {
      await sendEmailVerification(auth.currentUser);
      setMsg("📩 Verification email sent!");
    } catch (err) {
      setMsg("❌ Could not send email.");
      console.log(err);
    }
  };

  /* ---------------- CHANGE USERNAME ---------------- */
  const handleUsernameChange = async () => {
    if (!newUsername.trim()) return;

    try {
      await updateDoc(doc(db, "users", user.uid), {
        username: newUsername,
      });
      setUsername(newUsername);
      setNewUsername("");
      setMsg("✅ Username updated!");
    } catch (err) {
      console.log(err);
      setMsg("❌ Failed to update username.");
    }
  };

  /* ---------------- CHANGE EMAIL ---------------- */
  const handleEmailChange = async () => {
    if (!newEmail.trim() || !passwordForEmailChange.trim()) return;

    try {
      const cred = EmailAuthProvider.credential(
        user.email,
        passwordForEmailChange
      );

      await reauthenticateWithCredential(user, cred);
      await updateEmail(user, newEmail);

      await updateDoc(doc(db, "users", user.uid), {
        email: newEmail,
      });

      setMsg("✅ Email updated — please verify your new email.");
      setNewEmail("");
      setPasswordForEmailChange("");

      refreshUser();
    } catch (err) {
      console.log(err);
      setMsg("❌ Email update failed.");
    }
  };

  /* ---------------- RESET PASSWORD ---------------- */
  const handlePasswordReset = async () => {
    if (!emailVerified) return;

    try {
      await sendPasswordResetEmail(auth, user.email);
      setMsg("📩 Reset email sent!");
    } catch (err) {
      console.log(err);
      setMsg("❌ Failed to send reset email.");
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

      {msg && <p style={S.msg}>{msg}</p>}

      {/* ACCOUNT INFO */}
      <div style={S.card}>
        <h3 style={S.cardTitle}>👤 Account Info</h3>

        <div style={S.row}>
          <span style={S.label}>Username:</span>
          <span style={S.value}>{username}</span>
        </div>

        <div style={S.inputRow}>
          <input
            style={S.input}
            placeholder="New username"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
          />
          <button style={S.smallBtn} onClick={handleUsernameChange}>
            Save
          </button>
        </div>

        <div style={S.row}>
          <span style={S.label}>Email:</span>
          <span style={S.value}>{user?.email}</span>
        </div>

        <div style={S.verifyRow}>
          {emailVerified ? (
            <span style={S.verified}>✔ Email Verified</span>
          ) : (
            <button style={S.verifyBtn} onClick={handleSendVerification}>
              Verify Email
            </button>
          )}
        </div>

        {/* Change Email */}
        <div style={S.subTitle}>Change Email</div>
        <div style={S.inputRow}>
          <input
            style={S.input}
            placeholder="New email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
          />
        </div>

        <div style={S.inputRow}>
          <input
            style={S.input}
            placeholder="Password"
            type="password"
            value={passwordForEmailChange}
            onChange={(e) => setPasswordForEmailChange(e.target.value)}
          />
          <button style={S.smallBtn} onClick={handleEmailChange}>
            Update
          </button>
        </div>

        {/* Reset Password */}
        <div style={S.subTitle}>Reset Password</div>
        <button
          style={{
            ...S.resetBtn,
            opacity: emailVerified ? 1 : 0.4,
            cursor: emailVerified ? "pointer" : "not-allowed",
          }}
          disabled={!emailVerified}
          onClick={handlePasswordReset}
        >
          Send Reset Email
        </button>
      </div>

      {/* WALLETS */}
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

      <p style={S.notice}>
        To update wallets, go to <strong>Invest & Mine</strong>.
      </p>
    </div>
  );
}

/* ---------------------------- STYLES ---------------------------- */
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
  msg: {
    background: "rgba(255,255,255,0.1)",
    padding: "10px 12px",
    borderRadius: "10px",
    marginBottom: "18px",
    textAlign: "center",
    color: "#d0e7ff",
    fontSize: "0.9rem",
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
  inputRow: {
    display: "flex",
    gap: "10px",
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
  input: {
    flex: 1,
    padding: "10px 12px",
    borderRadius: "10px",
    background: "rgba(255,255,255,0.07)",
    border: "1px solid rgba(255,255,255,0.15)",
    color: "white",
    fontSize: "0.9rem",
  },
  smallBtn: {
    padding: "10px 14px",
    background: "linear-gradient(135deg,#8b5cf6,#3b82f6)",
    border: "none",
    borderRadius: "10px",
    color: "white",
    fontWeight: 600,
    cursor: "pointer",
  },
  verifyRow: {
    marginBottom: "12px",
  },
  verified: {
    color: "#10b981",
    fontWeight: 700,
  },
  verifyBtn: {
    padding: "10px 16px",
    borderRadius: "10px",
    border: "1px solid rgba(255,255,255,0.25)",
    background: "rgba(255,255,255,0.05)",
    color: "white",
    cursor: "pointer",
  },
  subTitle: {
    marginTop: "14px",
    marginBottom: "6px",
    color: "rgba(255,255,255,0.75)",
    fontWeight: 600,
  },
  resetBtn: {
    marginTop: "10px",
    padding: "12px 16px",
    background: "rgba(255,255,255,0.07)",
    borderRadius: "10px",
    border: "1px solid rgba(255,255,255,0.15)",
    color: "white",
    fontWeight: 600,
  },
  notice: {
    textAlign: "center",
    color: "rgba(255,255,255,0.65)",
    fontSize: "0.9rem",
  },
};

