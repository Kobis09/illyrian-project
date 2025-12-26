import { useEffect, useState } from "react";
import Head from "next/head";
import { auth, db } from "../firebase";
import { useRouter } from "next/router";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

import TabsNav from "../components/TabsNav";

// EXISTING TABS
import TokenInfo from "../tabs/tokeninfo";
import Instructions from "../tabs/instructions";
import EarningsOverview from "../tabs/EarningsOverview";
import Contact from "../tabs/contact";
import InvestMine from "../components/InvestMine";
import ReferralBonus from "../components/ReferralBonus";
import About from "../tabs/about";

// ⭐ NEW TABS ⭐
import Profile from "../tabs/profile";

export default function Dashboard() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [selectedTab, setSelectedTab] = useState("tokenInfo");

  const [stars, setStars] = useState([]);
  const [fade, setFade] = useState(false);

  const [isMobile, setIsMobile] = useState(false);
  const [client, setClient] = useState(false);

  const [copied, setCopied] = useState(false); // Toast state

  useEffect(() => { setClient(true); }, []);

  // MOBILE CHECK
  useEffect(() => {
    if (!client) return;
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [client]);

  // AUTH
  useEffect(() => {
    if (!client) return;

    const unsub = auth.onAuthStateChanged(async (u) => {
      if (!u) {
        setUser(null);
        router.replace("/");
        return;
      }

      setUser(u);

      try {
        const snap = await getDoc(doc(db, "users", u.uid));
        if (snap.exists() && snap.data().username) {
          setUsername(snap.data().username);
        }
      } catch (err) {
        console.error("username fetch failed", err);
      }
    });

    return () => unsub();
  }, [client, router]);

  // STAR BG
  useEffect(() => {
    if (!client) return;

    const count = isMobile ? 35 : 75;
    const list = Array.from({ length: count }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: `${Math.random() * (isMobile ? 1.6 : 2.5) + 1}px`,
      opacity: Math.random() * 0.6 + 0.2,
      delay: `${Math.random() * 6}s`,
    }));

    setStars(list);
    setFade(true);
    const t = setTimeout(() => setFade(false), 4500);
    return () => clearTimeout(t);
  }, [client, isMobile]);

  const handleLogout = async () => {
    await signOut(auth);
    router.replace("/");
  };

  // SERVER RENDER
  if (!client)
    return (
      <p style={{ color: "#9fb4cc", textAlign: "center", marginTop: 60 }}>
        Loading...
      </p>
    );

  // WAIT FOR AUTH
  if (!user)
    return (
      <div style={styles.loadingScreen}>
        <p style={{ color: "#9fb4cc", fontSize: 16 }}>
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
            {stars.map((s) => (
              <div
                key={s.id}
                style={{
                  ...styles.star,
                  left: s.left,
                  top: s.top,
                  width: s.size,
                  height: s.size,
                  opacity: s.opacity,
                  animationDelay: s.delay,
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
          {/* HERO */}
          <section style={styles.hero}>
            <div style={styles.heroContent}>
              <div style={styles.titleContainer}>
                <h1 style={styles.mainTitle}>
                  <span style={styles.titleGradient}>Welcome</span>
                  {username && <span style={styles.titleSymbol}> {username}</span>}
                </h1>
                <div style={styles.titleGlow}></div>
              </div>

              <p style={styles.heroSubtitle}>
                Explore your{" "}
                <span style={styles.highlight}>Illyrian Token</span> dashboard
              </p>

              <div style={styles.headerActions}>
                <button style={styles.logoutBtn} onClick={handleLogout}>
                  🚪 Logout
                </button>
              </div>
            </div>
          </section>

          {/* TABS NAV */}
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

            {/* ⭐ PROFILE TAB WITH COPY BUTTON & TOAST ⭐ */}
            {selectedTab === "profile" && (
              <div style={{ position: "relative", minHeight: "200px", paddingBottom: "60px" }}>
                <Profile user={user} />

                {/* Copy Button */}
                <button
                  style={{
                    position: "absolute",
                    bottom: "20px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    padding: "12px 20px",
                    borderRadius: "12px",
                    background: "linear-gradient(135deg,#8b5cf6,#3b82f6)",
                    color: "#fff",
                    fontWeight: 600,
                    border: "none",
                    cursor: "pointer",
                    zIndex: 10,
                  }}
                  onClick={() => {
                    navigator.clipboard.writeText(
                      "0xC9Aa04758559DAcf7C5D9e41ed28E3595cC8ED58"
                    );
                    setCopied(true);
                    setTimeout(() => setCopied(false), 1500);
                  }}
                >
                  Copy Address
                </button>

                {/* Toast */}
                {copied && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: "70px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      background: "rgba(0,0,0,0.8)",
                      color: "#fff",
                      padding: "8px 16px",
                      borderRadius: "8px",
                      fontSize: "14px",
                      fontWeight: 500,
                      zIndex: 11,
                      opacity: 1,
                      transition: "opacity 0.3s",
                    }}
                  >
                    Address copied!
                  </div>
                )}
              </div>
            )}
          </div>
        {/* SYNC */}
        {fade && (
          <div style={styles.syncIndicator}>
            <div style={styles.pulseCircle}></div>
            <span style={styles.syncText}>✨ Dashboard Synchronized</span>
          </div>
        )}
      </div>

      {/* GLOBAL FIX */}
      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        html,
        body {
          background-color: #0a0a18 !important;
          overflow-x: hidden;
          font-family: Inter, sans-serif;
        }

        @keyframes starTwinkle {
          0% { opacity: 0.3; }
          50% { opacity: 0.8; }
          100% { opacity: 0.3; }
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.06); opacity: 0.85; }
        }
      `}</style>
    </div>
  </>
);
}

/* ----------------------------- POLISHED STYLES ----------------------------- */

const styles = {
loadingScreen: {
  position: "fixed",
  inset: 0,
  background: "#0a0a18",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 9999,
},

wrapper: {
  position: "relative",
  width: "100%",
  minHeight: "100vh",
  overflowX: "hidden",
  paddingTop: "env(safe-area-inset-top)",
  paddingBottom: "env(safe-area-inset-bottom)",
  background: `
    linear-gradient(135deg,#0a0a18,#151528,#1a1a2e),
    radial-gradient(circle at 20% 30%,rgba(139,92,246,0.1),transparent),
    radial-gradient(circle at 80% 70%,rgba(59,130,246,0.08),transparent)
  `,
},

backgroundElements: {
  position: "fixed",
  inset: 0,
  width: "100%",
  height: "100%",
  pointerEvents: "none",
  zIndex: 0,
},

starsContainer: {
  position: "absolute",
  inset: 0,
},

star: {
  position: "absolute",
  background: "rgba(255,255,255,0.9)",
  borderRadius: "50%",
  animation: "starTwinkle 4s infinite",
},

glowOrb1: {
  position: "absolute",
  top: "15%",
  left: "5%",
  width: "240px",
  height: "240px",
  borderRadius: "50%",
  background: "radial-gradient(circle,rgba(139,92,246,0.17),transparent 70%)",
  filter: "blur(55px)",
},

glowOrb2: {
  position: "absolute",
  bottom: "20%",
  right: "5%",
  width: "260px",
  height: "260px",
  borderRadius: "50%",
  background: "radial-gradient(circle,rgba(59,130,246,0.13),transparent 70%)",
  filter: "blur(55px)",
},

glowOrb3: {
  position: "absolute",
  top: "55%",
  left: "50%",
  width: "260px",
  height: "260px",
  transform: "translate(-50%,-50%)",
  borderRadius: "50%",
  background: "radial-gradient(circle,rgba(16,185,129,0.12),transparent 70%)",
  filter: "blur(50px)",
},

gridOverlay: {
  position: "absolute",
  inset: 0,
  backgroundImage: `
    linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)
  `,
  backgroundSize: "42px 42px",
},

page: {
  position: "relative",
  zIndex: 2,
  display: "flex",
  flexDirection: "column",
  gap: "20px",
  padding: "24px 14px 40px",
  maxWidth: "1200px",
  margin: "0 auto",
},

/* HERO */
hero: { textAlign: "center" },

heroContent: {
  maxWidth: "100%",
  margin: "0 auto",
},

titleContainer: { position: "relative", marginBottom: "12px" },

mainTitle: {
  fontSize: "clamp(2rem,7vw,3rem)",
  fontWeight: 800,
  background: "linear-gradient(135deg,#8b5cf6,#3b82f6,#06b6d4)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
},

titleSymbol: {
  color: "rgba(255,255,255,0.9)",
  marginLeft: "6px",
},

titleGlow: {
  position: "absolute",
  inset: 0,
  background: "radial-gradient(circle,rgba(139,92,246,0.3),transparent 70%)",
  filter: "blur(40px)",
  zIndex: -1,
},

heroSubtitle: {
  color: "rgba(255,255,255,0.85)",
  fontSize: "clamp(0.9rem,3vw,1.1rem)",
  maxWidth: "320px",
  margin: "4px auto 16px",
  lineHeight: 1.4,
},

highlight: {
  background: "linear-gradient(90deg,#8b5cf6,#3b82f6)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  fontWeight: 600,
},

headerActions: { display: "flex", justifyContent: "center" },

logoutBtn: {
  padding: "12px 20px",
  borderRadius: "12px",
  background: "linear-gradient(135deg,#8b5cf6,#3b82f6)",
  color: "#fff",
  fontWeight: 600,
  border: "none",
  cursor: "pointer",
  boxShadow: "0 8px 20px rgba(139,92,246,0.28)",
},

/* CONTENT BOX */
contentBox: {
  background: "rgba(10,14,22,0.94)",
  borderRadius: "20px",
  border: "1px solid rgba(255,255,255,0.08)",
  boxShadow: "0 18px 40px rgba(0,0,0,0.45)",
  backdropFilter: "blur(15px)",
  overflow: "hidden",
  position: "relative",
},

/* SYNC */
syncIndicator: {
  position: "fixed",
  bottom: "25px",
  right: "20px",
  background: "rgba(255,255,255,0.08)",
  padding: "10px 14px",
  borderRadius: "18px",
  border: "1px solid rgba(255,255,255,0.15)",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  backdropFilter: "blur(14px)",
  animation: "pulse 2s infinite",
  zIndex: 999,
},

pulseCircle: {
  width: "6px",
  height: "6px",
  borderRadius: "50%",
  background: "#10b981",
},

syncText: {
  fontSize: "12px",
  color: "rgba(255,255,255,0.9)",
  fontWeight: 500,
},
};
