// dashboard.js — FIXED VERSION (NO SSR CRASH, SAFE-STARS, FULL UPDATE)
import { useEffect, useState } from "react";
import Head from "next/head";
import { auth, db } from "../firebase";
import { useRouter } from "next/router";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

import TabsNav from "../components/TabsNav";
import TokenInfo from "../tabs/tokeninfo";
import Instructions from "../tabs/instructions";
import EarningsOverview from "../tabs/EarningsOverview";
import Contact from "../tabs/contact";
import InvestMine from "../components/InvestMine";
import ReferralBonus from "../components/ReferralBonus";
import About from "../tabs/about";

export default function Dashboard() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [selectedTab, setSelectedTab] = useState("tokenInfo");

  const [stars, setStars] = useState([]);
  const [fade, setFade] = useState(false);

  // ⭐ MUST BE SAFE — detect mobile ONLY in browser
  const [isMobile, setIsMobile] = useState(false);

  // ❗ PREVENT STATIC EXPORT CRASH
  const [client, setClient] = useState(false);
  useEffect(() => {
    setClient(true);
  }, []);

  // ⭐ MOBILE CHECK — browser ONLY, never on server
  useEffect(() => {
    if (!client) return;

    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();

    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [client]);

  // ⭐ AUTH STATE LISTENER
  useEffect(() => {
    if (!client) return;

    const unsub = auth.onAuthStateChanged(async (u) => {
      if (!u) {
        router.push("/");
        return;
      }

      setUser(u);

      try {
        const docRef = doc(db, "users", u.uid);
        const snap = await getDoc(docRef);

        if (snap.exists() && snap.data().username) {
          setUsername(snap.data().username);
        }
      } catch (e) {
        console.error("username fetch failed:", e);
      }
    });

    return () => unsub();
  }, [client, router]);

  // ⭐ SAFE STAR GENERATION — runs ONLY in browser
  useEffect(() => {
    if (!client) return;

    const count = isMobile ? 40 : 80;

    const generated = Array.from({ length: count }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: `${Math.random() * (isMobile ? 2 : 3) + 1}px`,
      opacity: Math.random() * 0.6 + 0.2,
      delay: `${Math.random() * 5}s`,
    }));

    setStars(generated);
    setFade(true);
    const t = setTimeout(() => setFade(false), 5000);

    return () => clearTimeout(t);
  }, [client, isMobile]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };

  // ❗ FIRST RENDER ON SERVER — protect against SSR crash
  if (!client)
    return (
      <p
        style={{
          color: "#9fb4cc",
          textAlign: "center",
          marginTop: 60,
          fontSize: 15,
        }}
      >
        Loading...
      </p>
    );

  // Wait for auth
  if (!user)
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,              // <-- added
        bottom: 0,             // <-- added
        width: "100vw",
        height: "100vh",
        background: "#0a0a18",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",    // <-- added (prevents 1–2px overflow)
        zIndex: 9999,
      }}
    >
      <p
        style={{
          color: "#9fb4cc",
          fontSize: 16,
          margin: 0,
        }}
      >
        ✨ Loading your dashboard...
      </p>
    </div>
  );



  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover"
        />
      </Head>

      <div style={styles.wrapper}>
        {/* BACKGROUND */}
        <div style={styles.backgroundElements}>
          <div style={styles.starsContainer}>
            {stars.map((star) => (
              <div
                key={star.id}
                style={{
                  ...styles.star,
                  left: star.left,
                  top: star.top,
                  width: star.size,
                  height: star.size,
                  opacity: star.opacity,
                  animationDelay: star.delay,
                }}
              />
            ))}
          </div>

          <div style={styles.glowOrb1}></div>
          <div style={styles.glowOrb2}></div>
          <div style={styles.glowOrb3}></div>
          <div style={styles.gridOverlay}></div>
        </div>

        {/* PAGE */}
        <div style={styles.page}>
          <section style={styles.hero}>
            <div style={styles.heroContent}>
              <div style={styles.titleContainer}>
                <h1 style={styles.mainTitle}>
                  <span style={styles.titleGradient}>Welcome</span>
                  <span style={styles.titleSymbol}>
                    {username ? ` ${username}` : ""}
                  </span>
                </h1>
                <div style={styles.titleGlow}></div>
              </div>

              <p style={styles.heroSubtitle}>
                Ready to explore your{" "}
                <span style={styles.highlight}>Illyrian Token</span> dashboard
                and <span style={styles.highlight}>maximize your earnings</span>
              </p>

              <div style={styles.headerActions}>
                <button style={styles.logoutBtn} onClick={handleLogout}>
                  🚪 Logout
                </button>
              </div>
            </div>
          </section>

          {/* NAV */}
          <TabsNav selectedTab={selectedTab} setSelectedTab={setSelectedTab} />

          {/* CONTENT */}
          <div style={styles.contentBox}>
            {selectedTab === "tokenInfo" && <TokenInfo />}
            {selectedTab === "instructions" && <Instructions />}
            {selectedTab === "investMine" && <InvestMine user={user} />}
            {selectedTab === "referralBonus" && <ReferralBonus user={user} />}
            {selectedTab === "earnings" && <EarningsOverview user={user} />}
            {selectedTab === "contact" && <Contact />}
            {selectedTab === "about" && <About />}
          </div>

          {/* SYNC */}
          {fade && (
            <div style={styles.syncIndicator}>
              <div style={styles.pulseCircle}></div>
              <span style={styles.syncText}>✨ Dashboard Synchronized</span>
            </div>
          )}
        </div>

        {/* GLOBAL FIXES */}
        <style jsx global>{`
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          html,
          body {
            margin: 0;
            padding: 0;
            background-color: #0a0a18 !important;
            overflow-x: hidden;
            font-family: Inter, sans-serif;
          }
        `}</style>
      </div>
    </>
  );
}
/* ----------------------------- MOBILE OPTIMIZED + SAFE EXPORT STYLES ----------------------------- */
const styles = {
  wrapper: {
    position: "relative",
    width: "100%",
    minHeight: "100vh",
    overflowX: "hidden",
    overflowY: "visible",
    paddingTop: "env(safe-area-inset-top)",
    paddingBottom: "env(safe-area-inset-bottom)",
    background: `
      linear-gradient(135deg, #0a0a18 0%, #151528 40%, #1a1a2e 100%),
      radial-gradient(circle at 20% 30%, rgba(139, 92, 246, 0.08) 0%, transparent 70%),
      radial-gradient(circle at 80% 70%, rgba(59, 130, 246, 0.06) 0%, transparent 70%),
      radial-gradient(circle at 40% 80%, rgba(16, 185, 129, 0.04) 0%, transparent 70%)
    `,
    backgroundAttachment: "scroll",
    margin: 0,
    fontFamily:
      "'Inter','SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
    WebkitOverflowScrolling: "touch",
  },

  /* BACKGROUND ELEMENTS */
  backgroundElements: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    pointerEvents: "none",
    zIndex: 0,
    overflow: "hidden",
  },

  starsContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  },

  star: {
    position: "absolute",
    background: "rgba(255,255,255,0.85)",
    borderRadius: "50%",
    animation: "starTwinkle 4s ease-in-out infinite",
  },

  glowOrb1: {
    position: "absolute",
    top: "10%",
    left: "5%",
    width: "230px",
    height: "230px",
    background: `
      radial-gradient(
        circle,
        rgba(139, 92, 246, 0.12) 0%,
        rgba(139, 92, 246, 0.05) 40%,
        transparent 80%
      )
    `,
    borderRadius: "50%",
    filter: "blur(45px)",
    opacity: 0.25,
  },

  glowOrb2: {
    position: "absolute",
    bottom: "20%",
    right: "5%",
    width: "260px",
    height: "260px",
    background: `
      radial-gradient(
        circle,
        rgba(59, 130, 246, 0.12) 0%,
        rgba(59, 130, 246, 0.05) 40%,
        transparent 80%
      )
    `,
    borderRadius: "50%",
    filter: "blur(45px)",
    opacity: 0.25,
  },

  glowOrb3: {
    position: "absolute",
    top: "55%",
    left: "50%",
    width: "270px",
    height: "270px",
    transform: "translate(-50%, -50%)",
    background: `
      radial-gradient(
        circle,
        rgba(16, 185, 129, 0.12) 0%,
        rgba(16, 185, 129, 0.03) 40%,
        transparent 80%
      )
    `,
    borderRadius: "50%",
    filter: "blur(50px)",
    opacity: 0.23,
  },

  gridOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundImage: `
      linear-gradient(rgba(99, 102, 241, 0.025) 1px, transparent 1px),
      linear-gradient(90deg, rgba(99, 102, 241, 0.025) 1px, transparent 1px)
    `,
    backgroundSize: "40px 40px",
    opacity: 0.35,
  },

  /* PAGE */
  page: {
    position: "relative",
    zIndex: 2,
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    padding: "20px 15px 40px",
    width: "100%",
    maxWidth: "1200px",
    margin: "0 auto",
  },

  /* HERO SECTION */
  hero: {
    textAlign: "center",
    padding: "10px 0 5px",
  },

  heroContent: {
    maxWidth: "100%",
    margin: "0 auto",
  },

  titleContainer: {
    position: "relative",
    marginBottom: "15px",
  },

  mainTitle: {
    fontSize: "clamp(2rem, 8vw, 3rem)",
    fontWeight: 800,
    background:
      "linear-gradient(135deg, #8b5cf6, #3b82f6, #06b6d4)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    margin: 0,
    lineHeight: 1.15,
  },

  titleGradient: {
    display: "inline",
  },

  titleSymbol: {
    color: "rgba(255,255,255,0.9)",
    marginLeft: "6px",
  },

  titleGlow: {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: "100%",
    height: "100%",
    transform: "translate(-50%, -50%)",
    background:
      "radial-gradient(circle, rgba(139,92,246,0.3), transparent 70%)",
    filter: "blur(40px)",
    zIndex: -1,
  },

  heroSubtitle: {
    fontSize: "clamp(0.9rem, 4vw, 1rem)",
    color: "rgba(255,255,255,0.85)",
    maxWidth: "340px",
    margin: "5px auto 20px",
    lineHeight: 1.45,
  },

  highlight: {
    background: "linear-gradient(45deg,#93c5fd,#c084fc)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    fontWeight: 600,
  },

  headerActions: {
    display: "flex",
    justifyContent: "center",
  },

  logoutBtn: {
    padding: "12px 20px",
    borderRadius: "12px",
    background: "linear-gradient(135deg,#8b5cf6,#3b82f6)",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "14px",
    boxShadow: "0 8px 20px rgba(139,92,246,0.3)",
  },

  /* CONTENT BOX */
  contentBox: {
    background: "rgba(10,14,22,0.92)",
    borderRadius: "20px",
    border: "1px solid rgba(255,255,255,0.08)",
    boxShadow: "0 15px 35px rgba(0,0,0,0.45)",
    padding: "0",
    minHeight: "420px",
    overflow: "hidden",
    backdropFilter: "blur(15px)",
  },

  /* SYNC INDICATOR */
  syncIndicator: {
    position: "fixed",
    bottom: "25px",
    right: "20px",
    background: "rgba(255,255,255,0.08)",
    padding: "10px 14px",
    borderRadius: "18px",
    border: "1px solid rgba(255,255,255,0.15)",
    backdropFilter: "blur(18px)",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    zIndex: 999,
    animation: "pulse 2s infinite",
  },

  pulseCircle: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    background: "#10b981",
    animation: "pulse 1.5s infinite",
  },

  syncText: {
    fontSize: "12px",
    color: "rgba(255,255,255,0.9)",
    fontWeight: 500,
  },
};
