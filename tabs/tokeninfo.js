// pages/Home.js — Illyrian Token Homepage (SunSwap Hybrid Edition)
// PC: coin on RIGHT, interactive 3D rotation, hologram layers
// Mobile: coin centered, breathing animation
// Colors: Dark navy/black + gold + silver highlights
// Layout: Hero (Left text / Right coin) + Sections

import { useEffect, useRef, useState } from "react";

export default function Home() {
  const coinRef = useRef(null);
  const isMobileRef = useRef(false);
  const [isMobile, setIsMobile] = useState(false);

  /* -------------------------------------------------------------
     DEVICE RESPONSIVE DETECTION
  ------------------------------------------------------------- */
  useEffect(() => {
    const detect = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      isMobileRef.current = mobile;
    };
    detect();
    window.addEventListener("resize", detect);
    return () => window.removeEventListener("resize", detect);
  }, []);

  /* -------------------------------------------------------------
     PC — 3D Mouse Tracking (Coin follows mouse)
  ------------------------------------------------------------- */
  useEffect(() => {
    if (!coinRef.current) return;

    const handleMove = (e) => {
      if (isMobileRef.current) return; // disable on mobile

      const { innerWidth, innerHeight } = window;
      const x = ((e.clientX / innerWidth) - 0.5) * 35;
      const y = ((e.clientY / innerHeight) - 0.5) * -35;

      coinRef.current.style.transform = `
        rotateY(${x}deg)
        rotateX(${y}deg)
        translateZ(20px)
      `;
    };

    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  /* -------------------------------------------------------------
     MOBILE — Breathing Floating Coin
  ------------------------------------------------------------- */
  useEffect(() => {
    if (!isMobile) return;
    if (!coinRef.current) return;

    let frame = 0;
    let raf;

    const breathe = () => {
      const offset = Math.sin(frame / 60) * 8;
      coinRef.current.style.transform = `translateY(${offset}px)`;
      frame++;
      raf = requestAnimationFrame(breathe);
    };

    breathe();
    return () => cancelAnimationFrame(raf);
  }, [isMobile]);

  /* -------------------------------------------------------------
     RENDER START
  ------------------------------------------------------------- */
  return (
    <div style={S.page}>

      {/* BACKGROUND EFFECTS */}
      <div style={S.gridOverlay} />
      <div style={S.particles} />

      {/* ======================================================
          HERO SECTION — TEXT LEFT / COIN RIGHT (SunSwap style)
      ====================================================== */}
      <section style={S.hero}>
        <div style={S.heroInner}>

          {/* LEFT SIDE — TEXT */}
          <div style={S.leftCol}>
            <h1 style={S.title}>
              <span style={S.white}>Welcome to </span>
              <span style={S.gold}>Illyrian Token</span>
            </h1>

            <p style={S.subtitle}>
              The next-generation asset powering the{" "}
              <span style={S.goldHighlight}>Illyrian decentralized ecosystem</span>.  
              Built for scalability, transparency, and powerful utility.
            </p>

            <div style={S.buttons}>
              <button style={S.primaryBtn}>Invest Now</button>
              <button style={S.secondaryBtn}>Read Whitepaper</button>
            </div>
          </div>

          {/* RIGHT SIDE — HOLOGRAPHIC COIN */}
          <div style={S.rightCol}>
            <div style={S.coinWrapper}>
              {/* Subtle gold/silver hologram ring */}
              <div style={S.holoRing} />

              {/* Radial pulse under coin */}
              <div style={S.radialPulse} />

              {/* Vertical hologram scan */}
              <div style={S.verticalScan} />

              {/* Coin Image */}
              <img
                ref={coinRef}
                src="/images/illyriantokencircle.png"
                style={S.coin}
                draggable={false}
                alt="Illyrian Token Coin"
              />
            </div>
          </div>

        </div>
      </section>

      {/* SECTION DIVIDER */}
      <div style={S.sectionDivider} />

      {/* !!! PART 2 CONTINUES BELOW !!! */}
      {/* Metrics Section */}
      {/* Features Section */}
      {/* Roadmap */}
      {/* Footer */}
      {/* Keyframes */}
    </div>
  );
}

/* ================================================================
   STYLES — NAVY/BLACK + GOLD + SILVER (Clean + Futuristic)
================================================================ */
const S = {
  page: {
    minHeight: "100vh",
    width: "100%",
    background: "linear-gradient(180deg,#05070D,#0A0F1A 60%,#05070D)",
    color: "white",
    overflowX: "hidden",
    fontFamily: "'Inter','SF Pro Display',sans-serif",
    position: "relative",
  },

  /* Background grid */
  gridOverlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    background:
      "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
    backgroundSize: "50px 50px",
    opacity: 0.15,
    pointerEvents: "none",
    zIndex: 1,
  },

  /* Floating Gold Dust */
  particles: {
    position: "absolute",
    width: "100%",
    height: "100%",
    background:
      "radial-gradient(circle at 50% 0%, rgba(240,216,134,0.08), transparent 70%)",
    zIndex: 0,
  },

  /* ================= HERO ================= */
  hero: {
    padding: "80px 20px",
    position: "relative",
    zIndex: 3,
  },

  heroInner: {
    maxWidth: 1400,
    margin: "0 auto",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
  },

  /* ================= LEFT SIDE ================= */
  leftCol: {
    flex: "1 1 480px",
    paddingRight: 30,
  },

  title: {
    fontSize: "clamp(2.2rem, 5vw, 3.6rem)",
    fontWeight: 800,
    marginBottom: 20,
    lineHeight: 1.1,
  },

  white: { color: "#ffffff" },

  gold: {
    background: "linear-gradient(135deg,#E2C875,#F3E6AB,#FFFFFF)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },

  subtitle: {
    fontSize: "1.1rem",
    color: "rgba(255,255,255,0.85)",
    maxWidth: 520,
    lineHeight: 1.7,
    marginBottom: 28,
  },

  goldHighlight: {
    background: "linear-gradient(135deg,#F0D886,#ffffff)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    fontWeight: 700,
  },

  buttons: {
    display: "flex",
    gap: 14,
    marginTop: 12,
    flexWrap: "wrap",
  },

  primaryBtn: {
    padding: "12px 26px",
    background: "linear-gradient(135deg,#F0D886,#E2C875)",
    border: "none",
    borderRadius: 12,
    color: "#000",
    fontSize: "1rem",
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 0 20px rgba(240,216,134,0.3)",
  },

  secondaryBtn: {
    padding: "12px 26px",
    background: "rgba(255,255,255,0.07)",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: 12,
    color: "#fff",
    fontSize: "1rem",
    fontWeight: 600,
    cursor: "pointer",
    backdropFilter: "blur(4px)",
  },

  /* ================= RIGHT SIDE (COIN) ================= */
  rightCol: {
    flex: "1 1 460px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 30,
  },

  coinWrapper: {
    position: "relative",
    width: "min(420px,80vw)",
    height: "min(420px,80vw)",
    transformStyle: "preserve-3d",
  },

  holoRing: {
    position: "absolute",
    inset: 0,
    borderRadius: "50%",
    boxShadow:
      "0 0 40px rgba(240,216,134,0.2), inset 0 0 25px rgba(255,255,255,0.1)",
    opacity: 0.25,
  },

  radialPulse: {
    position: "absolute",
    inset: "-20%",
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(255,255,255,0.12), transparent 70%)",
    animation: "pulse 4s ease-in-out infinite",
  },

  verticalScan: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "15%",
    height: "100%",
    background:
      "linear-gradient(90deg, transparent, rgba(240,216,134,0.3), transparent)",
    animation: "scan 3s linear infinite",
  },

  coin: {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "contain",
    transformStyle: "preserve-3d",
    transition: "transform 0.1s linear",
  },

  sectionDivider: {
    height: 80,
  },
};
/* ================================================================
   CONTINUATION — METRICS SECTION
================================================================ */
const S2 = {}; // dummy just to avoid errors if you paste both parts together

export default function ContinueHome() {
  return null;
}

// Just ignore this component — Part 2 continues below S object

/* ================================================================
   METRICS SECTION — SunSwap Inspired Cards
================================================================ */

const MetricsSection = () => {
  const metrics = [
    { label: "Total Supply", value: "1,000,000 ILY" },
    { label: "Blockchain", value: "BNB Smart Chain" },
    { label: "Target Listing", value: "Binance 2026" },
    { label: "Token Type", value: "Utility Asset" },
  ];

  return (
    <section style={S.metricsSection}>
      <h2 style={S.sectionTitle}>Illyrian Metrics</h2>

      <div style={S.metricsGrid}>
        {metrics.map((m, i) => (
          <div key={i} style={S.metricCard}>
            <div style={S.metricLabel}>{m.label}</div>
            <div style={S.metricValue}>{m.value}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

/* ================================================================
   FEATURES SECTION — Clean Gold Cards
================================================================ */
const FeaturesSection = () => {
  const features = [
    {
      icon: "🔒",
      title: "Security First",
      desc:
        "Built using cryptographically secure frameworks and audited smart contracts.",
    },
    {
      icon: "🚀",
      title: "High Growth",
      desc:
        "Designed for exponential expansion through strategic tokenomics.",
    },
    {
      icon: "🌍",
      title: "Global Vision",
      desc:
        "Developed for worldwide accessibility and ecosystem adoption.",
    },
    {
      icon: "⚡",
      title: "Fast & Efficient",
      desc:
        "BNB Smart Chain infrastructure ensures near-zero waiting times.",
    },
  ];

  return (
    <section style={S.featuresSection}>
      <h2 style={S.sectionTitle}>Why Choose Illyrian?</h2>

      <div style={S.featuresGrid}>
        {features.map((f, i) => (
          <div key={i} style={S.featureCard}>
            <div style={S.featureIcon}>{f.icon}</div>
            <h3 style={S.featureTitle}>{f.title}</h3>
            <p style={S.featureDesc}>{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

/* ================================================================
   ROADMAP SECTION
================================================================ */
const RoadmapSection = () => {
  const roadmap = [
    {
      year: "2024",
      steps: [
        "Project Inception",
        "Smart Contract Development",
        "Tokenomics Design",
        "Community Formation",
      ],
    },
    {
      year: "2025",
      steps: [
        "Platform Scaling",
        "Marketing Expansion",
        "Global Partnerships",
        "Ecosystem Launch",
      ],
    },
    {
      year: "2026",
      steps: [
        "Binance Listing Preparation",
        "Token Expansion",
        "Worldwide Scaling",
        "Major Exchange Integrations",
      ],
    },
  ];

  return (
    <section style={S.roadmapSection}>
      <h2 style={S.sectionTitle}>Roadmap</h2>

      <div style={S.roadmapGrid}>
        {roadmap.map((r, i) => (
          <div key={i} style={S.roadmapCard}>
            <div style={S.roadmapYear}>{r.year}</div>
            <ul style={S.roadmapList}>
              {r.steps.map((step, idx) => (
                <li key={idx} style={S.roadmapItem}>
                  {step}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
};

/* ================================================================
   FOOTER — Clean Minimal Footer
================================================================ */
const Footer = () => {
  return (
    <footer style={S.footer}>
      <div style={S.footerText}>© {new Date().getFullYear()} Illyrian Token</div>
      <div style={S.footerLinks}>
        <a href="#" style={S.footerLink}>Whitepaper</a>
        <a href="#" style={S.footerLink}>Docs</a>
        <a href="#" style={S.footerLink}>Support</a>
      </div>
    </footer>
  );
};

/* ================================================================
   MERGE SECTIONS INTO HOME — EXPORT FINAL HOME PAGE
================================================================ */
export function HomeSections() {
  return (
    <>
      <MetricsSection />
      <FeaturesSection />
      <RoadmapSection />
      <Footer />

      {/* KEYFRAME ANIMATIONS */}
      <style>{`
      @keyframes scan {
        0% { transform: translateX(-150%); }
        100% { transform: translateX(250%); }
      }

      @keyframes pulse {
        0% { opacity: 0.15; transform: scale(1); }
        50% { opacity: 0.30; transform: scale(1.12); }
        100% { opacity: 0.15; transform: scale(1); }
      }
      `}</style>
    </>
  );
}

/* ================================================================
   EXTENDED STYLES FOR PART 2 — CARDS / ROADMAP / FOOTER
================================================================ */
const S = {
  ...S, // merge with Part 1

  metricsSection: {
    padding: "40px 20px",
    textAlign: "center",
  },

  metricsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: 20,
    maxWidth: 1200,
    margin: "0 auto",
  },

  metricCard: {
    background: "rgba(255,255,255,0.05)",
    padding: "22px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.1)",
    backdropFilter: "blur(6px)",
  },

  metricLabel: {
    fontSize: ".9rem",
    color: "rgba(255,255,255,0.6)",
    marginBottom: 6,
  },

  metricValue: {
    fontSize: "1.2rem",
    fontWeight: 700,
    background: "linear-gradient(135deg,#F0D886,#ffffff)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },

  /* FEATURES */
  featuresSection: {
    padding: "50px 20px",
    textAlign: "center",
  },

  featuresGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: 20,
    maxWidth: 1200,
    margin: "0 auto",
  },

  featureCard: {
    background: "rgba(255,255,255,0.05)",
    padding: "24px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.1)",
    backdropFilter: "blur(8px)",
    transition: "0.25s ease",
  },

  featureCardHover: {
    transform: "scale(1.05)",
  },

  featureIcon: {
    fontSize: "2rem",
    marginBottom: 12,
  },

  featureTitle: {
    fontSize: "1.2rem",
    marginBottom: 8,
    background: "linear-gradient(135deg,#F0D886,#ffffff)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    fontWeight: 700,
  },

  featureDesc: {
    fontSize: ".95rem",
    color: "rgba(255,255,255,0.85)",
    lineHeight: 1.5,
  },

  /* ROADMAP */
  roadmapSection: {
    padding: "60px 20px",
    textAlign: "center",
  },

  roadmapGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: 22,
    maxWidth: 1200,
    margin: "0 auto",
  },

  roadmapCard: {
    background: "rgba(255,255,255,0.05)",
    borderRadius: 16,
    border: "1px solid rgba(255,255,255,0.1)",
    padding: "20px 18px",
    backdropFilter: "blur(6px)",
  },

  roadmapYear: {
    fontSize: "1.4rem",
    fontWeight: 800,
    background: "linear-gradient(135deg,#F0D886,#ffffff)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    marginBottom: 14,
  },

  roadmapList: {
    listStyle: "none",
    padding: 0,
  },

  roadmapItem: {
    color: "rgba(255,255,255,0.85)",
    marginBottom: 8,
  },

  /* FOOTER */
  footer: {
    padding: "40px 20px",
    marginTop: 40,
    background: "rgba(255,255,255,0.03)",
    borderTop: "1px solid rgba(255,255,255,0.1)",
    backdropFilter: "blur(4px)",
    textAlign: "center",
  },

  footerText: {
    color: "rgba(255,255,255,0.7)",
    marginBottom: 10,
  },

  footerLinks: {
    display: "flex",
    justifyContent: "center",
    gap: 20,
  },

  footerLink: {
    color: "rgba(255,255,255,0.9)",
    textDecoration: "none",
    fontWeight: 600,
  },
};
