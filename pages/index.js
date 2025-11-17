import { useState, useEffect } from "react";
import Head from "next/head";
import { auth } from "../firebase";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/router";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Modal states
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  const router = useRouter();

  // If logged in → redirect
  useEffect(() => {
    const un = onAuthStateChanged(auth, (user) => {
      if (user) router.push("/dashboard");
    });
    return () => un();
  }, [router]);

  // Login handler
  const handleLogin = async () => {
    if (!email || !password) {
      setStatus("⚠️ Please enter both email and password");
      return;
    }

    setIsLoading(true);
    setStatus("⏳ Logging in...");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setStatus("✅ Logged in! Redirecting...");
      setTimeout(() => router.push("/dashboard"), 800);
    } catch (e) {
      setStatus("❌ Incorrect email or password.");
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
        <meta name="theme-color" content="#050914" />
      </Head>

      {/* PAGE */}
      <div style={S.page}>

        {/* Background */}
        <div style={S.bg}>
          <div style={S.orb1}></div>
          <div style={S.orb2}></div>
          <div style={S.orb3}></div>
          <div style={S.grid}></div>
        </div>

        {/* MAIN CONTAINER */}
        <div style={S.container}>

          {/* HERO TITLE */}
          <section style={S.hero}>
            <h1 style={S.title}>
              <span style={S.titleGradient}>Welcome Back </span>
            </h1>

            <p style={S.subtitle}>
              Sign in to access your{" "}
              <span style={S.highlight}>Illyrian Token</span> dashboard
            </p>

            <div style={S.badges}>
              <span style={S.badge}>⚡ Fast</span>
              <span style={S.badge}>💎 Premium</span>
              <span style={S.badge}> 🛡️ Secure</span>
            </div>
          </section>

          {/* LOGIN CARD */}
          <div style={S.card}>
            <div style={S.cardHeader}>
              <h3 style={S.cardTitle}>Sign In</h3>
              <div style={S.infoBadge}>ⓘ Secure</div>
            </div>

            {/* FORM */}
            <div style={S.form}>

              {/* EMAIL */}
              <div style={S.inputGroup}>
                <label style={S.label}>
                  Email <span style={S.required}>*</span>
                </label>
                <input
                  style={S.input}
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              {/* PASSWORD */}
              <div style={S.inputGroup}>
                <label style={S.label}>
                  Password <span style={S.required}>*</span>
                </label>

                <div style={{ position: "relative", width: "100%" }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    style={{ ...S.input, paddingRight: "40px" }}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                  />

                  <span
                    onClick={() => setShowPassword((p) => !p)}
                    style={S.eyeIcon}
                  >
                    {showPassword ? "👁️‍🗨️" : "👁️"}
                  </span>
                </div>
              </div>

              {/* LOGIN BUTTON */}
              <button
                style={{
                  ...S.primaryBtn,
                  opacity: isLoading ? 0.7 : 1,
                }}
                onClick={handleLogin}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div style={S.spinner}></div>
                    Signing In...
                  </>
                ) : (
                  "🚀 Sign In"
                )}
              </button>

              {/* STATUS */}
              {status && (
                <div
                  style={{
                    ...S.statusCard,
                    borderColor: status.includes("❌")
                      ? "rgba(239,68,68,0.3)"
                      : status.includes("⚠️")
                      ? "rgba(234,179,8,0.3)"
                      : "rgba(34,197,94,0.3)",
                  }}
                >
                  <p style={S.statusText}>{status}</p>
                </div>
              )}

              {/* SIGNUP LINK */}
              <div style={S.footer}>
                <p style={S.footerText}>
                  No account?{" "}
                  <Link href="/signup" style={S.link}>
                    Create one
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* LEGAL LINKS BOTTOM LEFT */}
        <div style={S.legalWrapper}>
          <span style={S.legalLink} onClick={() => setShowTerms(true)}>
            Terms of Service
          </span>
          <span style={S.legalDivider}>•</span>
          <span style={S.legalLink} onClick={() => setShowPrivacy(true)}>
            Privacy Policy
          </span>
        </div>
        {/* TERMS OF SERVICE MODAL */}
        {showTerms && (
          <div style={S.modalOverlay} onClick={() => setShowTerms(false)}>
            <div style={S.modal} onClick={(e) => e.stopPropagation()}>
              <h3 style={S.modalTitle}>Terms of Service</h3>
              <p style={S.modalText}>
                By using Illyrian Token services, you agree that all activities
                performed on this platform are compliant with local regulations,
                and that you are solely responsible for the accuracy of any
                wallet addresses or transactions you submit.
                <br /><br />
                You acknowledge that cryptocurrency markets are highly volatile,
                and all investments carry risk. Illyrian Token does not provide
                financial advice, and users must evaluate risks independently.
                <br /><br />
                Any attempt to exploit, abuse, or manipulate the platform may
                result in suspension or removal of account access.
              </p>
              <button style={S.closeBtn} onClick={() => setShowTerms(false)}>
                Close
              </button>
            </div>
          </div>
        )}

        {/* PRIVACY POLICY MODAL */}
        {showPrivacy && (
          <div style={S.modalOverlay} onClick={() => setShowPrivacy(false)}>
            <div style={S.modal} onClick={(e) => e.stopPropagation()}>
              <h3 style={S.modalTitle}>Privacy Policy</h3>
              <p style={S.modalText}>
                Illyrian Token respects your privacy. We only store information
                required for account creation and platform functionality:
                <br /><br />
                <strong>• Email address</strong><br />
                <strong>• Username</strong><br />
                <strong>• Wallet addresses you provide</strong><br />
                <strong>• Investment and mining activity for dashboard usage</strong>
                <br /><br />
                We do NOT use cookies for tracking, do not sell data to third
                parties, and do not collect unnecessary information.
                <br /><br />
                Your information is used solely for platform functionality and
                secure user experience.
              </p>
              <button style={S.closeBtn} onClick={() => setShowPrivacy(false)}>
                Close
              </button>
            </div>
          </div>
        )}

        {/* GLOBAL CSS */}
        <style jsx global>{`
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            -webkit-tap-highlight-color: transparent;
          }
          body, html, #__next {
            background: #050914;
            height: 100%;
            overflow-x: hidden;
          }
          input, select, textarea {
            font-size: 16px !important;
            transform: scale(1);
          }
        `}</style>
      </div>
    </>
  );
}

/* ------------------------------------------------------
   STYLES
------------------------------------------------------ */
const S = {
  page: {
    position: "relative",
    minHeight: "100vh",
    background: "#050914",
    overflowY: "auto",
    WebkitOverflowScrolling: "touch",
    fontFamily: "'Inter','SF Pro Display',sans-serif",
  },

  /* Background */
  bg: {
    position: "absolute",
    inset: 0,
    zIndex: 0,
    pointerEvents: "none",
  },

  orb1: {
    position: "absolute",
    top: "5%",
    left: "8%",
    width: "260px",
    height: "260px",
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(139,92,246,0.22), transparent 70%)",
    filter: "blur(60px)",
  },

  orb2: {
    position: "absolute",
    bottom: "18%",
    right: "10%",
    width: "300px",
    height: "300px",
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(59,130,246,0.20), transparent 70%)",
    filter: "blur(70px)",
  },

  orb3: {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: "350px",
    height: "350px",
    transform: "translate(-50%, -50%)",
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(16,185,129,0.10), transparent 80%)",
    filter: "blur(80px)",
  },

  grid: {
    position: "absolute",
    inset: 0,
    backgroundImage: `
      linear-gradient(rgba(99,102,241,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(99,102,241,0.03) 1px, transparent 1px)
    `,
    backgroundSize: "50px 50px",
    opacity: 0.5,
  },

  container: {
    position: "relative",
    zIndex: 2,
    maxWidth: "420px",
    margin: "0 auto",
    padding: "40px 18px 60px",
    display: "flex",
    flexDirection: "column",
    gap: "30px",
  },

  /* HERO */
  hero: {
    textAlign: "center",
  },

  title: {
    fontSize: "clamp(2.2rem, 8vw, 3rem)",
    fontWeight: 900,
    marginBottom: "10px",
    letterSpacing: "-0.5px",
  },

  titleGradient: {
    background:
      "linear-gradient(135deg,#8b5cf6,#3b82f6,#06b6d4)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },

  subtitle: {
    fontSize: "clamp(0.9rem, 4vw, 1.05rem)",
    color: "rgba(255,255,255,0.85)",
    maxWidth: "350px",
    margin: "0 auto 12px",
    lineHeight: 1.45,
  },

  highlight: {
    background: "linear-gradient(45deg,#93c5fd,#c084fc)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    fontWeight: 600,
  },

  badges: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    flexWrap: "wrap",
  },

  badge: {
    padding: "6px 12px",
    borderRadius: "20px",
    background: "rgba(139,92,246,0.18)",
    border: "1px solid rgba(139,92,246,0.35)",
    color: "#c4b5fd",
    fontSize: "11px",
    fontWeight: 700,
    backdropFilter: "blur(10px)",
  },

  /* CARD */
  card: {
    background: "rgba(255,255,255,0.05)",
    borderRadius: "18px",
    border: "1px solid rgba(255,255,255,0.12)",
    padding: "24px 20px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
    backdropFilter: "blur(18px)",
  },

  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "18px",
  },

  cardTitle: {
    fontSize: "1.4rem",
    fontWeight: 700,
    color: "#fff",
  },

  infoBadge: {
    padding: "4px 8px",
    background: "rgba(56,189,248,0.15)",
    color: "#7dd3fc",
    borderRadius: "8px",
    fontSize: "11px",
    border: "1px solid rgba(56,189,248,0.3)",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },

  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },

  label: {
    fontSize: "13px",
    color: "rgba(255,255,255,0.9)",
    fontWeight: 600,
  },

  required: { color: "#ef4444" },

  input: {
    width: "100%",
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: "12px",
    padding: "13px 16px",
    fontSize: "16px",
    color: "#fff",
    outline: "none",
    WebkitAppearance: "none",
  },

  eyeIcon: {
    position: "absolute",
    right: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    cursor: "pointer",
    color: "rgba(255,255,255,0.65)",
    fontSize: "17px",
  },

  primaryBtn: {
    padding: "15px 20px",
    borderRadius: "12px",
    background: "linear-gradient(135deg,#8b5cf6,#3b82f6)",
    color: "#fff",
    fontWeight: 700,
    fontSize: "15px",
    border: "none",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    boxShadow: "0 8px 20px rgba(139,92,246,0.3)",
  },

  spinner: {
    width: "16px",
    height: "16px",
    border: "2px solid rgba(255,255,255,0.35)",
    borderTopColor: "#fff",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },

  statusCard: {
    padding: "10px",
    borderRadius: "10px",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.12)",
    textAlign: "center",
  },

  statusText: {
    color: "#fff",
    fontSize: "12px",
    fontWeight: 500,
  },

  footer: {
    textAlign: "center",
    marginTop: "6px",
  },

  footerText: {
    color: "rgba(255,255,255,0.8)",
    fontSize: "12px",
  },

  link: {
    color: "#8b5cf6",
    fontWeight: 600,
    marginLeft: "4px",
    textDecoration: "none",
  },

  /* Legal bottom */
  legalWrapper: {
    position: "fixed",
    bottom: "14px",
    left: "16px",
    display: "flex",
    gap: "6px",
    zIndex: 20,
  },

  legalLink: {
    color: "rgba(165,180,252,0.9)",
    fontSize: "12px",
    cursor: "pointer",
    textDecoration: "underline",
  },

  legalDivider: {
    color: "rgba(255,255,255,0.5)",
  },

  /* Modals */
  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.65)",
    backdropFilter: "blur(6px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    zIndex: 999,
  },

  modal: {
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: "14px",
    padding: "22px",
    maxWidth: "430px",
    width: "100%",
    boxShadow: "0 0 25px rgba(0,0,0,0.4)",
    color: "#fff",
    fontSize: "14px",
    lineHeight: 1.55,
  },

  modalTitle: {
    fontSize: "1.3rem",
    fontWeight: 700,
    marginBottom: "12px",
    background: "linear-gradient(135deg,#fff,#a5b4fc)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },

  modalText: {
    color: "rgba(255,255,255,0.88)",
    marginBottom: "18px",
  },

  closeBtn: {
    padding: "10px 16px",
    borderRadius: "10px",
    background: "linear-gradient(135deg,#8b5cf6,#3b82f6)",
    color: "#fff",
    fontWeight: 600,
    border: "none",
    width: "100%",
    cursor: "pointer",
  },
};
