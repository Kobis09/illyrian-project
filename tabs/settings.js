// tabs/settings.js — CLEAN, PREMIUM, MATCHES ILLYRIAN UI

import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { deleteUser, signOut } from "firebase/auth";
import { deleteDoc, doc, setDoc, getDoc } from "firebase/firestore";
import { useRouter } from "next/router";

export default function Settings() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  // Notifications toggles
  const [notifyMining, setNotifyMining] = useState(false);
  const [notifyReferral, setNotifyReferral] = useState(false);
  const [notifySecurity, setNotifySecurity] = useState(false);

  // Delete modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Security preview data
  const [ip, setIp] = useState("Loading...");
  const [device, setDevice] = useState("");
  const [lastLogin, setLastLogin] = useState("Unknown");

  useEffect(() => {
    const u = auth.currentUser;
    if (!u) return;
    setUser(u);

    loadSettings(u.uid);
    detectDevice();
    fetchIP();
  }, []);

  const loadSettings = async (uid) => {
    try {
      const snap = await getDoc(doc(db, "users", uid));
      if (snap.exists()) {
        const d = snap.data();
        setNotifyMining(d.notifyMining || false);
        setNotifyReferral(d.notifyReferral || false);
        setNotifySecurity(d.notifySecurity || false);

        setLastLogin(d.lastLogin || "Unknown");
      }
    } catch (err) {
      console.log("settings load fail:", err);
    }
  };

  const detectDevice = () => {
    const ua = navigator.userAgent;
    if (/android/i.test(ua)) setDevice("Android");
    else if (/iPhone|iPad|iPod/i.test(ua)) setDevice("iOS");
    else if (/Windows/i.test(ua)) setDevice("Windows");
    else if (/Mac/i.test(ua)) setDevice("MacOS");
    else setDevice("Unknown");
  };

  const fetchIP = async () => {
    try {
      const res = await fetch("https://api.ipify.org?format=json");
      const data = await res.json();
      setIp(data.ip);
    } catch {
      setIp("Unavailable");
    }
  };

  const updateToggle = async (field, value) => {
    if (!user) return;
    try {
      await setDoc(
        doc(db, "users", user.uid),
        { [field]: value },
        { merge: true }
      );
    } catch (err) {
      console.log("toggle update fail:", err);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;

    try {
      // 1. Delete Firestore user document
      await deleteDoc(doc(db, "users", user.uid));

      // 2. Delete Firebase Auth account
      await deleteUser(user);

      // 3. Logout + redirect
      await signOut(auth);
      router.replace("/");
    } catch (err) {
      console.log("Delete failed:", err);

      if (err.code === "auth/requires-recent-login") {
        alert("⚠ Please log out and log back in before deleting your account.");
      }
    }
  };

  if (!user)
    return (
      <p style={{ color: "#bbb", textAlign: "center", padding: 30 }}>
        Loading...
      </p>
    );

  return (
    <div style={S.page}>
      <h2 style={S.title}>Settings</h2>

      {/* NOTIFICATIONS */}
      <div style={S.card}>
        <h3 style={S.cardTitle}>🔔 Notifications</h3>

        <ToggleRow
          label="Notify when mining completes"
          value={notifyMining}
          onChange={(v) => {
            setNotifyMining(v);
            updateToggle("notifyMining", v);
          }}
        />

        <ToggleRow
          label="Notify on referral rewards"
          value={notifyReferral}
          onChange={(v) => {
            setNotifyReferral(v);
            updateToggle("notifyReferral", v);
          }}
        />

        <ToggleRow
          label="Notify on security alerts"
          value={notifySecurity}
          onChange={(v) => {
            setNotifySecurity(v);
            updateToggle("notifySecurity", v);
          }}
        />
      </div>

      {/* SECURITY PREVIEW */}
      <div style={S.card}>
        <h3 style={S.cardTitle}>🛡 Security Overview</h3>

        <InfoRow label="Device:" value={device} />
        <InfoRow label="IP Address:" value={ip} />
        <InfoRow label="Last Login:" value={lastLogin} />
      </div>

      {/* TERMS */}
      <div style={S.card}>
        <h3 style={S.cardTitle}>📄 Terms of Service</h3>
        <p style={S.text}>
          By using Illyrian Token services, you agree that all activities
          performed on this platform are compliant with local regulations, and
          that you are responsible for the accuracy of any wallet addresses or
          transactions you submit.
          <br />
          <br />
          Cryptocurrency markets are highly volatile; Illyrian Token does not
          provide financial advice, and users must evaluate risks independently.
          Any attempt to exploit the platform may result in suspension or
          removal of account access.
        </p>
      </div>

      {/* PRIVACY */}
      <div style={S.card}>
        <h3 style={S.cardTitle}>🔒 Privacy Policy</h3>
        <p style={S.text}>
          We only store information required for functionality:
          <br />
          <br />• Email <br />• Username <br />• Wallet addresses you provide{" "}
          <br />• Investment & mining activity
          <br />
          <br />
          We do NOT sell data or track users. Your information is used solely
          for a secure and smooth platform experience.
        </p>
      </div>

      {/* VERSION */}
      <div style={S.card}>
        <h3 style={S.cardTitle}>🧩 App Version</h3>
        <InfoRow label="Version:" value="1.0.1" />
        <InfoRow label="Last Updated:" value="Feb 2025" />
      </div>

      {/* DELETE ACCOUNT */}
      <div style={S.dangerCard}>
        <h3 style={S.dangerTitle}>⚠ Delete Account</h3>
        <p style={S.dangerText}>
          This will permanently delete your account and all related data.
        </p>

        <button style={S.deleteBtn} onClick={() => setShowDeleteModal(true)}>
          Delete Account
        </button>
      </div>

      {/* DELETE MODAL */}
      {showDeleteModal && (
        <div style={M.overlay}>
          <div style={M.modal}>
            <h3 style={M.modalTitle}>❌ Confirm Deletion</h3>
            <p style={M.modalText}>
              This action is permanent and cannot be undone.  
              Are you absolutely sure you want to delete your account?
            </p>

            <div style={M.modalButtons}>
              <button style={M.cancelBtn} onClick={() => setShowDeleteModal(false)}>
                Cancel
              </button>

              <button style={M.confirmBtn} onClick={handleDeleteAccount}>
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                               TOGGLE COMPONENT                              */
/* -------------------------------------------------------------------------- */

function ToggleRow({ label, value, onChange }) {
  return (
    <div style={S.row}>
      <span style={S.label}>{label}</span>
      <div
        style={{ ...S.toggle, background: value ? "#10b981" : "#555" }}
        onClick={() => onChange(!value)}
      >
        <div
          style={{
            ...S.knob,
            transform: value ? "translateX(22px)" : "translateX(0px)",
          }}
        />
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                               INFO ROW COMPONENT                            */
/* -------------------------------------------------------------------------- */

function InfoRow({ label, value }) {
  return (
    <div style={S.row}>
      <span style={S.label}>{label}</span>
      <span style={S.value}>{value}</span>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                 STYLES                                      */
/* -------------------------------------------------------------------------- */

const S = {
  page: {
    padding: "26px 16px 40px",
    color: "white",
  },

  title: {
    textAlign: "center",
    fontSize: "clamp(1.8rem, 6vw, 2.4rem)",
    marginBottom: "26px",
    fontWeight: 800,
    background: "linear-gradient(135deg,#8b5cf6,#3b82f6,#06b6d4)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
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

  text: {
    color: "rgba(255,255,255,0.85)",
    fontSize: "0.95rem",
    lineHeight: 1.5,
  },

  row: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "14px",
  },

  label: {
    color: "rgba(255,255,255,0.75)",
    fontSize: "0.95rem",
  },

  value: {
    color: "rgba(255,255,255,0.95)",
    fontWeight: 600,
  },

  toggle: {
    width: "48px",
    height: "24px",
    borderRadius: "30px",
    position: "relative",
    cursor: "pointer",
    transition: "0.2s",
  },

  knob: {
    position: "absolute",
    top: "2px",
    left: "2px",
    width: "20px",
    height: "20px",
    background: "white",
    borderRadius: "50%",
    transition: "0.2s",
  },

  /* Danger */
  dangerCard: {
    marginTop: "30px",
    padding: "22px",
    borderRadius: "18px",
    border: "1px solid rgba(255,80,80,0.3)",
    background: "rgba(255,50,50,0.08)",
  },

  dangerTitle: {
    fontSize: "1.2rem",
    color: "#ff6b6b",
    marginBottom: "12px",
  },

  dangerText: {
    color: "rgba(255,180,180,0.8)",
    fontSize: "0.95rem",
    marginBottom: "16px",
  },

  deleteBtn: {
    padding: "12px 20px",
    background: "rgba(255,60,60,0.3)",
    border: "1px solid rgba(255,80,80,0.4)",
    borderRadius: "12px",
    fontWeight: 600,
    color: "#ffbdbd",
    cursor: "pointer",
    width: "100%",
  },
};

/* -------------------------------------------------------------------------- */
/*                                MODAL STYLES                                */
/* -------------------------------------------------------------------------- */

const M = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },

  modal: {
    background: "rgba(20,20,35,0.95)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "16px",
    padding: "24px",
    width: "90%",
    maxWidth: "400px",
    backdropFilter: "blur(12px)",
  },

  modalTitle: {
    fontSize: "1.3rem",
    fontWeight: 700,
    color: "#ff6b6b",
    marginBottom: "12px",
  },

  modalText: {
    color: "rgba(255,255,255,0.85)",
    fontSize: "0.95rem",
    marginBottom: "20px",
  },

  modalButtons: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
  },

  cancelBtn: {
    flex: 1,
    padding: "12px 0",
    borderRadius: "10px",
    background: "rgba(255,255,255,0.1)",
    border: "1px solid rgba(255,255,255,0.2)",
    color: "#fff",
    cursor: "pointer",
  },

  confirmBtn: {
    flex: 1,
    padding: "12px 0",
    borderRadius: "10px",
    background: "rgba(255,50,50,0.4)",
    border: "1px solid rgba(255,80,80,0.4)",
    color: "#fff",
    cursor: "pointer",
  },
};
