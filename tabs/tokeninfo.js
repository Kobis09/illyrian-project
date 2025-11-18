// tabs/tokeninfo.js — HOLOGRAPHIC TECH GOLD EDITION
// PC = 3D hologram tracking + scans + subtle rotation
// Mobile = breathing + hologram scans (no spin)
// Dual-tone title (white → gold)
// Ultra premium futuristic UI

import { useEffect, useRef, useState, useMemo } from "react";

export default function TokenInfo() {
  const coinRef = useRef(null);
  const hologramRef = useRef(null);
  const shineRef = useRef(null);

  const [isMobile, setIsMobile] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  /* -------------------------------------------------------------
     DEVICE DETECTION + FEATURE ROTATION
  ------------------------------------------------------------- */
  useEffect(() => {
    const detect = () => setIsMobile(window.innerWidth <= 768);
    detect();
    window.addEventListener("resize", detect);

    const rot = setInterval(() => {
      setActiveFeature((p) => (p + 1) % 4);
    }, 3500);

    return () => {
      window.removeEventListener("resize", detect);
      clearInterval(rot);
    };
  }, []);

  /* -------------------------------------------------------------
     PC MODE — 3D MOUSE TRACKING
  ------------------------------------------------------------- */
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (isMobile) return;

    const handleMove = (e) => {
      if (!coinRef.current) return;
      const { innerWidth, innerHeight } = window;

      const x = ((e.clientX / innerWidth) - 0.5) * 40;
      const y = ((e.clientY / innerHeight) - 0.5) * -40;

      coinRef.current.style.transform = `
        rotateY(${x}deg)
        rotateX(${y}deg)
        translateZ(20px)
      `;
    };

    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [isMobile]);

  /* -------------------------------------------------------------
     MOBILE MODE — BREATHING FLOATING ANIMATION
  ------------------------------------------------------------- */
  useEffect(() => {
    if (!isMobile) return;
    if (!coinRef.current) return;

    let frame = 0;
    let raf;

    const breathe = () => {
      if (!coinRef.current) return;

      const offset = Math.sin(frame / 60) * 8;
      coinRef.current.style.transform = `translateY(${offset}px)`;

      frame++;
      raf = requestAnimationFrame(breathe);
    };

    breathe();
    return () => cancelAnimationFrame(raf);
  }, [isMobile]);

  /* -------------------------------------------------------------
     TOKEN META DATA
  ------------------------------------------------------------- */
  const stats = useMemo(
    () => [
      { label: "TOKEN SYMBOL", value: "ILLYRIAN" },
      { label: "TOKEN NAME", value: "Illyrian Token" },
      { label: "BLOCKCHAIN", value: "BNB Smart Chain" },
      { label: "BINANCE LISTING", value: "2026" },
    ],
    []
  );

  const features = useMemo(
    () => [
      {
        icon: "🔒",
        title: "Secure & Transparent",
        description:
          "Verifiable on-chain activity with strict operational controls.",
      },
      {
        icon: "🚀",
        title: "High Growth Potential",
        description:
          "Early investor alignment and structured distribution model.",
      },
      {
        icon: "🌍",
        title: "Global Ecosystem",
        description:
          "Built for broad accessibility, aiming for Binance in 2026.",
      },
      {
        icon: "⚡",
        title: "Lightning Fast",
        description:
          "BNB chain ensures ultra-low fees and near-instant confirmations.",
      },
    ],
    []
  );

  /* -------------------------------------------------------------
     RENDER START
  ------------------------------------------------------------- */
  return (
    <div style={S.page}>

      {/* Floating gold particles */}
      <div style={S.particlesLayer} />

      {/* ================= HERO ================= */}
      <section style={S.hero}>
        <div style={S.heroInner}>

          {/* TITLE */}
          <div style={S.titleWrap}>
            <h1 style={S.title}>
              <span style={S.titleWhite}>ILLYRIAN </span>
              <span style={S.titleGold}>TOKEN</span>
            </h1>
            <div style={S.titleSymbol}>(ILLYRIAN)</div>
          </div>

          {/* ================= HOLOGRAPHIC COIN AREA ================= */}
          <div style={S.coinZone}>

            {/* Barely-visible gold neon ring */}
            <div style={S.neonRing} />

            {/* Radial hologram waves */}
            <div style={S.radialWave} />

            {/* Vertical hologram scan */}
            <div ref={hologramRef} style={S.verticalScan} />

            {/* Shine sweep animation */}
            <div ref={shineRef} style={S.shineSweep} />

            {/* Coin */}
            <img
              ref={coinRef}
              src="/images/illyriantokencircle.png"
              style={S.coin}
              draggable={false}
            />
          </div>

          {/* SUBTITLE */}
          <p style={S.subtitle}>
            The <span style={S.highlight}>next-generation</span> cryptocurrency
            engineered for <span style={S.highlight}>innovation</span>,
            <span style={S.highlight}>transparency</span>, and unstoppable{" "}
            <span style={S.highlight}>growth</span>.
          </p>

          {/* BADGES */}
          <div style={S.badges}>
            <span style={S.badge}>🚀 Early Access</span>
            <span style={S.badge}>💎 Limited Supply</span>
            <span style={S.badge}>🛰️ Tech-Enhanced</span>
          </div>
        </div>
      </section>

      {/* ================= TOKEN METRICS ================= */}
      <section style={S.section}>
        <h2 style={S.sectionTitle}>Token Metrics</h2>

        <div style={S.statsGrid}>
          {stats.map((s, i) => (
            <div key={i} style={S.statCard}>
              <div style={S.statLabel}>{s.label}</div>
              <div style={S.statValue}>{s.value}</div>
            </div>
          ))}
        </div>
      </section>
      {/* ================= FEATURES ================= */}
      <section style={S.section}>
        <h2 style={S.sectionTitle}>Why Choose ILLYRIAN?</h2>

        <div style={S.featuresGrid}>
          {features.map((f, i) => (
            <article
              key={i}
              style={{
                ...S.featureCard,
                transform: activeFeature === i ? "scale(1.05)" : "scale(0.96)",
                opacity: activeFeature === i ? 1 : 0.7,
              }}
            >
              <div style={S.featureIcon}>{f.icon}</div>
              <h3 style={S.featureTitle}>{f.title}</h3>
              <p style={S.featureDesc}>{f.description}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

/* ===============================================================
   STYLES — PREMIUM HOLOGRAPHIC TECH GOLD UI
=============================================================== */
const S = {
  page: {
    minHeight: "100vh",
    color: "#fff",
    fontFamily: "'Inter','SF Pro Display',sans-serif",
    background: "#050914",
    position: "relative",
    overflowX: "hidden",
  },

  /* Floating Particles */
  particlesLayer: {
    position: "absolute",
    width: "100%",
    height: "100%",
    background:
      "radial-gradient(circle at 50% -20%, rgba(240,216,134,0.05), transparent 75%)",
    zIndex: 0,
    pointerEvents: "none",
  },

  /* ================= HERO ================= */
  hero: { padding: "40px 14px 30px", textAlign: "center", position: "relative" },
  heroInner: { maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 2 },

  /* ================= TITLE ================= */
  titleWrap: { marginBottom: 6 },
  title: {
    margin: 0,
    fontWeight: 900,
    fontSize: "clamp(2.2rem,7vw,3.5rem)",
    letterSpacing: "-0.03em",
    lineHeight: 1.1,
  },

  titleWhite: {
    color: "#ffffff",
  },

  titleGold: {
    background: "linear-gradient(135deg,#C9A34A,#E1C46D,#F0D886)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },

  titleSymbol: {
    color: "rgba(230,230,230,0.75)",
    fontSize: "0.9rem",
    marginTop: 4,
    letterSpacing: "0.05em",
  },

  /* ================= COIN ZONE ================= */
  coinZone: {
    position: "relative",
    width: "min(450px,85vw)",
    height: "min(450px,85vw)",
    margin: "20px auto 30px",
    transformStyle: "preserve-3d",
  },

  /* Barely Visible Gold Neon Ring */
  neonRing: {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: "100%",
    height: "100%",
    transform: "translate(-50%, -50%)",
    borderRadius: "50%",
    boxShadow: "0 0 35px rgba(240,216,134,0.25), inset 0 0 25px rgba(240,216,134,0.15)",
    opacity: 0.22,
    pointerEvents: "none",
  },

  /* Radial Hologram Pulse */
  radialWave: {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: "140%",
    height: "140%",
    transform: "translate(-50%,-50%)",
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(240,216,134,0.15) 0%, transparent 60%)",
    animation: "pulseWave 4s ease-in-out infinite",
    pointerEvents: "none",
  },

  /* Vertical Hologram Scan Bar */
  verticalScan: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "10%",
    height: "100%",
    background:
      "linear-gradient(90deg, transparent, rgba(240,216,134,0.22), transparent)",
    animation: "scanVertical 3.2s linear infinite",
    pointerEvents: "none",
  },

  /* Shine Sweep */
  shineSweep: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background:
      "linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.25) 50%, transparent 100%)",
    transform: "translateX(-150%)",
    animation: "shine 6s ease-in-out infinite",
    opacity: 0.3,
    pointerEvents: "none",
  },

  /* COIN */
  coin: {
    position: "relative",
    width: "100%",
    height: "100%",
    objectFit: "contain",
    transformStyle: "preserve-3d",
    transition: "transform 0.12s ease-out",
    pointerEvents: "none",
    userSelect: "none",
  },

  /* ================= SUBTITLE ================= */
  subtitle: {
    fontSize: "1rem",
    color: "rgba(255,255,255,.86)",
    margin: "0 auto",
    maxWidth: 720,
    lineHeight: 1.6,
  },

  highlight: {
    background: "linear-gradient(135deg,#C9A34A,#E1C46D)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    fontWeight: 700,
  },

  /* ================= BADGES ================= */
  badges: {
    display: "flex",
    justifyContent: "center",
    gap: 10,
    marginTop: 16,
    flexWrap: "wrap",
  },

  badge: {
    background: "rgba(240,216,134,.08)",
    border: "1px solid rgba(240,216,134,.25)",
    color: "#F0D886",
    padding: "8px 16px",
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 800,
  },

  /* ================= SECTION TITLES ================= */
  section: { padding: "38px 14px" },

  sectionTitle: {
    textAlign: "center",
    marginBottom: 26,
    fontSize: "clamp(1.8rem,5vw,2.4rem)",
    background: "linear-gradient(135deg,#F0D886,#E1C46D)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    fontWeight: 800,
  },

  /* ================= TOKEN METRICS ================= */
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))",
    gap: 18,
    maxWidth: 980,
    margin: "0 auto",
  },

  statCard: {
    background: "rgba(255,255,255,.05)",
    border: "1px solid rgba(255,255,255,.1)",
    padding: "22px 18px",
    borderRadius: 16,
    textAlign: "center",
    backdropFilter: "blur(4px)",
  },

  statLabel: {
    fontSize: 12,
    color: "rgba(255,255,255,.7)",
    marginBottom: 6,
  },

  statValue: {
    fontSize: 18,
    fontWeight: 900,
    background: "linear-gradient(135deg,#F0D886,#ffffff)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },

  /* ================= FEATURES ================= */
  featuresGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
    gap: 22,
    maxWidth: 1100,
    margin: "0 auto",
  },

  featureCard: {
    background: "rgba(255,255,255,.05)",
    border: "1px solid rgba(255,255,255,.1)",
    padding: "24px 20px",
    borderRadius: 16,
    textAlign: "center",
    transition: "all .3s ease",
    backdropFilter: "blur(6px)",
  },

  featureIcon: { fontSize: "2.4rem", marginBottom: 10 },

  featureTitle: {
    fontSize: "1.1rem",
    marginBottom: 8,
    background: "linear-gradient(135deg,#F8EAA0,#ffffff)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    fontWeight: 800,
  },

  featureDesc: {
    fontSize: ".95rem",
    color: "rgba(255,255,255,.85)",
    lineHeight: 1.6,
  },
};

/* ===============================================================
   KEYFRAMES — HOLOGRAM + SHINE + PULSE
=============================================================== */
<style>
{`
@keyframes scanVertical {
  0% { transform: translateX(-150%); }
  100% { transform: translateX(250%); }
}

@keyframes shine {
  0% { transform: translateX(-180%); }
  100% { transform: translateX(180%); }
}

@keyframes pulseWave {
  0% { opacity: 0.12; transform: translate(-50%,-50%) scale(1); }
  50% { opacity: 0.22; transform: translate(-50%,-50%) scale(1.12); }
  100% { opacity: 0.12; transform: translate(-50%,-50%) scale(1); }
}
`}
</style>
