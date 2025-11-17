import { useState, useEffect } from "react";
import Head from "next/head";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import {
  doc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { useRouter } from "next/router";
import Link from "next/link";

export default function Signup() {
  // FORM STATES
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // UI CONTROL STATES
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // USERNAME CHECK STATES
  const [usernameAvailable, setUsernameAvailable] = useState(null);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);

  // PASSWORD STRENGTH
  const [passwordStrength, setPasswordStrength] = useState("idle");

  // CONFIRM PASSWORD MATCH
  const passwordMatch =
    confirmPassword.length > 0 && confirmPassword === password;

  const router = useRouter();

  // EMAIL DOMAINS
  const emailDomains = [
    "gmail.com",
    "yahoo.com",
    "hotmail.com",
    "outlook.com",
    "icloud.com",
  ];

  // CHECK USERNAME
  const checkUsernameAvailability = async (name) => {
    if (name.length < 3) {
      setUsernameAvailable(null);
      return;
    }

    setIsCheckingUsername(true);

    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("username", "==", name.toLowerCase()));
      const querySnapshot = await getDocs(q);

      setUsernameAvailable(querySnapshot.empty);
    } catch {
      setUsernameAvailable(null);
    } finally {
      setIsCheckingUsername(false);
    }
  };

  // USERNAME INPUT
  const handleUsernameChange = (e) => {
    const value = e.target.value;
    setUsername(value);

    if (value.length >= 3) {
      if (window.__ily_user_timer) clearTimeout(window.__ily_user_timer);
      window.__ily_user_timer = setTimeout(() => {
        checkUsernameAvailability(value.toLowerCase());
      }, 350);
    } else {
      setUsernameAvailable(null);
    }
  };

  // PASSWORD VALIDATION
  const validatePassword = (pwd) => {
    if (!pwd) {
      setPasswordStrength("idle");
      return null;
    }
    if (pwd.length < 8) {
      setPasswordStrength("tooShort");
      return "Password must be at least 8 characters long";
    }
    if (!/(?=.*[A-Z])/.test(pwd)) {
      setPasswordStrength("noCaps");
      return "Password must contain at least one capital letter";
    }
    setPasswordStrength("strong");
    return null;
  };

  // PASSWORD INPUT
  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    validatePassword(value);
  };

  // QUICK EMAIL DOMAIN BUTTON
  const handleEmailDomainClick = (domain) => {
    const local = email.split("@")[0];
    setEmail(`${local}@${domain}`);
  };

  // SIGNUP
  const handleSignup = async () => {
    setStatus("");

    if (!email || !username || !password || !confirmPassword) {
      setStatus("⚠️ Please complete all fields");
      return;
    }
    if (username.length < 3) {
      setStatus("❌ Username must be at least 3 characters long");
      return;
    }
    if (usernameAvailable === false) {
      setStatus("❌ Username is already taken");
      return;
    }
    if (!passwordMatch) {
      setStatus("❌ Passwords do not match");
      return;
    }

    const pwdErr = validatePassword(password);
    if (pwdErr) {
      setStatus(`❌ ${pwdErr}`);
      return;
    }

    setIsLoading(true);
    setStatus("⏳ Creating your account...");

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const uid = res.user.uid;

      await setDoc(doc(db, "users", uid), {
        email,
        username: username.toLowerCase(),
        usdtWallet: "",
        tokenWallet: "",
        network: "",
        selectedOffer: null,
        mining: null,
        referralCode: null,
        referralBonuses: 0,
        referredBy: null,
        createdAt: new Date(),
      });

      setStatus("✅ Account created! Redirecting...");
      setTimeout(() => router.push("/dashboard"), 1000);
    } catch (e) {
      if (e.code === "auth/email-already-in-use") {
        setStatus("❌ Email already in use.");
      } else {
        setStatus("❌ Signup failed. Try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover"
        />
        <meta name="theme-color" content="#0a0a18" />
      </Head>

      <div style={S.page}>
        {/* Safe areas */}
        <div style={S.safeTop}></div>
        <div style={S.background}>
          <div style={S.glow1}></div>
          <div style={S.glow2}></div>
          <div style={S.glow3}></div>
          <div style={S.grid}></div>
        </div>

        <div style={S.container}>
          {/* HERO */}
          <section style={S.hero}>
            <h1 style={S.title}>
              <span style={S.gradient}>Create Account </span>
            </h1>

            <p style={S.subtitle}>
              Join the <span style={S.highlight}>Illyrian Token</span> ecosystem.
            </p>

            <div style={S.badges}>
              <span style={S.badge}>🚀 Early</span>
              <span style={S.badge}>💎 Premium</span>
              <span style={S.badge}>🛡 Secure</span>
            </div>
          </section>

          {/* CARD */}
          <div style={S.card}>
            <div style={S.cardHead}>
              <h3 style={S.cardTitle}>Sign Up</h3>
              <div style={S.secure}>ⓘ Secure</div>
            </div>

            <div style={S.form}>
              {/* EMAIL */}
              <div style={S.group}>
                <label style={S.label}>
                  Email <span style={S.req}>*</span>
                </label>

                <input
                  style={S.input}
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />

                <div style={S.domainWrap}>
                  {emailDomains.map((d) => (
                    <button
                      key={d}
                      style={S.domainBtn}
                      onClick={() => handleEmailDomainClick(d)}
                    >
                      @{d}
                    </button>
                  ))}
                </div>
              </div>

              {/* USERNAME */}
              <div style={S.group}>
                <label style={S.label}>
                  Username <span style={S.req}>*</span>
                </label>

                <input
                  style={{
                    ...S.input,
                    borderColor:
                      usernameAvailable === false
                        ? "rgba(239,68,68,.5)"
                        : usernameAvailable === true
                        ? "rgba(16,185,129,.6)"
                        : "rgba(255,255,255,.12)",
                  }}
                  type="text"
                  placeholder="Choose a username"
                  value={username}
                  onChange={handleUsernameChange}
                  disabled={isLoading}
                />

                <div style={S.feedback}>
                  {isCheckingUsername && (
                    <span style={S.checking}>Checking...</span>
                  )}
                  {!isCheckingUsername &&
                    usernameAvailable === true &&
                    username.length >= 3 && (
                      <span style={S.available}>✔ Available</span>
                    )}
                  {!isCheckingUsername &&
                    usernameAvailable === false && (
                      <span style={S.unavailable}>✖ Taken</span>
                    )}
                </div>
              </div>

              {/* PASSWORD */}
              <div style={S.group}>
                <label style={S.label}>
                  Password <span style={S.req}>*</span>
                </label>

                <div style={S.passWrap}>
                  <input
                    style={{ ...S.input, paddingRight: "38px" }}
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    value={password}
                    onChange={handlePasswordChange}
                    disabled={isLoading}
                  />

                  <span
                    style={S.eye}
                    onClick={() => setShowPassword((s) => !s)}
                  >
                    {showPassword ? "👁️‍🗨️" : "👁️"}
                  </span>
                </div>

                <div style={S.hint}>
                  {passwordStrength === "idle" && (
                    <span style={S.hintNeutral}>Enter a secure password to continue</span>
                  )}
                  {passwordStrength === "tooShort" && (
                    <span style={S.hintWeak}>Min 8 characters</span>
                  )}
                  {passwordStrength === "noCaps" && (
                    <span style={S.hintWeak}>Add one capital letter</span>
                  )}
                  {passwordStrength === "strong" && (
                    <span style={S.hintStrong}>Strong ✔</span>
                  )}
                </div>
              </div>

              {/* CONFIRM PASSWORD */}
              <div style={S.group}>
                <label style={S.label}>
                  Confirm Password <span style={S.req}>*</span>
                </label>

                <div style={S.passWrap}>
                  <input
                    style={{ ...S.input, paddingRight: "38px" }}
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Re-enter password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isLoading}
                  />

                  <span
                    style={S.eye}
                    onClick={() => setShowConfirmPassword((s) => !s)}
                  >
                    {showConfirmPassword ? "👁️‍🗨️" : "👁️"}
                  </span>
                </div>

                <div style={S.hint}>
                  {confirmPassword.length === 0 ? (
                    <span style={S.hintNeutral}>Re-enter password</span>
                  ) : passwordMatch ? (
                    <span style={S.hintStrong}>✔ Passwords match</span>
                  ) : (
                    <span style={S.unavailable}>✖ Passwords do not match</span>
                  )}
                </div>
              </div>

              {/* BUTTON */}
              <button
                style={{
                  ...S.btn,
                  opacity: isLoading ? 0.7 : 1,
                  cursor: isLoading ? "not-allowed" : "pointer",
                }}
                onClick={handleSignup}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div style={S.spin}></div>
                    Creating...
                  </>
                ) : (
                  "Create Account 🎉"
                )}
              </button>

              {/* STATUS */}
              {status && (
                <div
                  style={{
                    ...S.statusBox,
                    borderColor: status.includes("❌")
                      ? "rgba(239,68,68,0.3)"
                      : status.includes("⚠️")
                      ? "rgba(234,179,8,0.3)"
                      : "rgba(34,197,94,0.3)",
                  }}
                >
                  <p style={S.status}>{status}</p>
                </div>
              )}

              {/* FOOTER */}
              <div style={S.footer}>
                <p style={S.footerText}>
                  Already have an account?
                  <Link href="/" style={S.link}>
                    {" "}
                    Sign In
                  </Link>
                </p>

                <p style={S.termsNote}>
                  View Terms & Privacy on the Sign-In page.
                </p>
              </div>
            </div>
          </div>

          <div style={S.featureRow}>
            <div style={S.feature}>🛡 Secure</div>
            <div style={S.feature}>⚡ Fast</div>
            <div style={S.feature}>🌍 Global</div>
          </div>
        </div>

        <div style={S.safeBot}></div>

        <style jsx global>{`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    -webkit-tap-highlight-color: transparent;
  }

  html,
  body,
  #__next {
    width: 100%;
    height: 100%;
    background: #0a0a18;
    overflow-x: hidden;
  }

  /* 🔥 GLOBAL FONT FIX — matches TokenInfo + Login */
  *, body, input, button {
    font-family: 'Inter','SF Pro Display','Segoe UI',sans-serif !important;
  }

  input,
  select,
  textarea {
    font-size: 16px !important;
  }
`}</style>

      </div>
    </>
  );
}

/* ============================
   STYLES (SHORTER INPUTS + BETTER FIT)
============================ */
const S = {
  page: {
    minHeight: "100vh",
    background: "#0a0a18",
    position: "relative",
    overflowY: "auto",
  },

  safeTop: { height: "env(safe-area-inset-top)" },
  safeBot: { height: "env(safe-area-inset-bottom)" },

  background: {
    position: "absolute",
    inset: 0,
    zIndex: 0,
    pointerEvents: "none",
  },

  glow1: {
    position: "absolute",
    top: "8%",
    left: "7%",
    width: 220,
    height: 220,
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(139,92,246,.22), transparent 70%)",
    filter: "blur(45px)",
  },

  glow2: {
    position: "absolute",
    bottom: "20%",
    right: "9%",
    width: 250,
    height: 250,
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(59,130,246,.18), transparent 70%)",
    filter: "blur(55px)",
  },

  glow3: {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: 310,
    height: 310,
    transform: "translate(-50%,-50%)",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(16,185,129,.1), transparent 75%)",
    filter: "blur(65px)",
  },

  gridOverlay: {
  position: "absolute",
  inset: 0,
  backgroundImage: `
    linear-gradient(rgba(99,102,241,0.005) 1px, transparent 1px),
    linear-gradient(90deg, rgba(99,102,241,0.005) 1px, transparent 1px)
  `,
  backgroundSize: "40px 40px",
  opacity: 0.25,
},


  container: {
    position: "relative",
    zIndex: 2,
    maxWidth: 400,
    width: "100%",
    margin: "0 auto",
    padding: "16px 14px 40px",
  },

  hero: { textAlign: "center", marginTop: 10 },

  title: {
    fontSize: "clamp(1.9rem, 8vw, 2.4rem)",
    fontWeight: 800,
    margin: 0,
  },

  gradient: {
    background: "linear-gradient(135deg,#8b5cf6,#3b82f6,#06b6d4)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },

  subtitle: {
    fontSize: "clamp(.9rem,4vw,1rem)",
    color: "rgba(255,255,255,.82)",
    maxWidth: 330,
    margin: "8px auto 0",
  },

  highlight: {
    background: "linear-gradient(45deg,#93c5fd,#c084fc)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },

  badges: {
    marginTop: 12,
    display: "flex",
    justifyContent: "center",
    gap: 8,
    flexWrap: "wrap",
  },

  badge: {
    fontSize: 11,
    padding: "5px 10px",
    borderRadius: 16,
    background: "rgba(139,92,246,.15)",
    border: "1px solid rgba(139,92,246,.3)",
    color: "#c4b5fd",
    fontWeight: 600,
  },

  card: {
    marginTop: 20,
    background: "rgba(255,255,255,.06)",
    borderRadius: 16,
    padding: "18px 16px",
    border: "1px solid rgba(255,255,255,.12)",
    backdropFilter: "blur(18px)",
  },

  cardHead: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 14,
  },

  cardTitle: {
    fontSize: "1.25rem",
    fontWeight: 700,
    color: "#fff",
  },

  secure: {
    background: "rgba(56,189,248,.15)",
    border: "1px solid rgba(56,189,248,.3)",
    color: "#7dd3fc",
    fontSize: 10,
    padding: "4px 8px",
    borderRadius: 8,
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: 14,
  },

  group: { display: "flex", flexDirection: "column", gap: 6 },

  label: {
    color: "rgba(255,255,255,.9)",
    fontSize: 12,
    fontWeight: 600,
  },

  req: { color: "#ef4444" },

  input: {
    background: "rgba(255,255,255,.08)",
    border: "1px solid rgba(255,255,255,.12)",
    padding: "10px 12px",
    borderRadius: 10,
    fontSize: 15,
    color: "#fff",
    width: "100%",
    minHeight: 40,
    outline: "none",
  },

  domainWrap: {
    marginTop: 4,
    display: "flex",
    flexWrap: "wrap",
    gap: 6,
  },

  domainBtn: {
    padding: "4px 8px",
    fontSize: 10,
    borderRadius: 6,
    background: "rgba(59,130,246,.18)",
    border: "1px solid rgba(59,130,246,.3)",
    color: "#93c5fd",
    cursor: "pointer",
  },

  feedback: { fontSize: 10, minHeight: 12 },
  checking: { color: "#fbbf24" },
  available: { color: "#10b981" },
  unavailable: { color: "#ef4444" },

  passWrap: { position: "relative" },
  eye: {
    position: "absolute",
    right: 12,
    top: "50%",
    transform: "translateY(-50%)",
    cursor: "pointer",
    color: "rgba(255,255,255,.75)",
    fontSize: 16,
  },

  hint: { fontSize: 10, minHeight: 12 },
  hintNeutral: { color: "#9ca3af" },
  hintWeak: { color: "#f59e0b" },
  hintStrong: { color: "#10b981" },

  btn: {
    marginTop: 6,
    padding: "12px 16px",
    borderRadius: 10,
    background: "linear-gradient(135deg,#8b5cf6,#3b82f6)",
    color: "#fff",
    fontWeight: 600,
    fontSize: 15,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    border: "none",
    boxShadow: "0 6px 15px rgba(139,92,246,.3)",
  },

  spin: {
    width: 16,
    height: 16,
    border: "2px solid rgba(255,255,255,.3)",
    borderTopColor: "#fff",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },

  statusBox: {
    padding: 10,
    borderRadius: 8,
    textAlign: "center",
    background: "rgba(255,255,255,.06)",
    border: "1px solid rgba(255,255,255,.12)",
  },

  status: { color: "#fff", fontSize: 12 },

  footer: { marginTop: 6, textAlign: "center" },

  footerText: {
    fontSize: 12,
    color: "white",
  },

  link: {
    color: "#8b5cf6",
    fontWeight: 600,
    textDecoration: "none",
  },

  termsNote: {
    marginTop: 6,
    fontSize: 11,
    color: "rgba(255,255,255,.5)",
  },

  featureRow: {
    marginTop: 16,
    display: "flex",
    gap: 8,
    justifyContent: "center",
  },

  feature: {
    padding: "6px 12px",
    borderRadius: 16,
    background: "rgba(255,255,255,.06)",
    border: "1px solid rgba(255,255,255,.12)",
    color: "rgba(255,255,255,.85)",
    fontSize: 11,
  },
};
