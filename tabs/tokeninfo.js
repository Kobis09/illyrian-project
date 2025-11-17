// tabs/tokeninfo.js
import { useEffect, useRef, useState, useMemo } from "react";

export default function TokenInfo() {
  const coinRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  /* ---------- Detect mobile + feature auto-rotate ---------- */
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

  /* ---------------- PC — Mouse movement (UNCHANGED) ---------------- */
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (isMobile) return;

    const handleMove = (e) => {
      if (!coinRef.current) return;

      const { innerWidth, innerHeight } = window;

      const x = ((e.clientX / innerWidth) - 0.5) * 30;
      const y = ((e.clientY / innerHeight) - 0.5) * -30;

      coinRef.current.style.transform = `
        rotateY(${x}deg)
        rotateX(${y}deg)
        translateZ(0)
      `;
    };

    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [isMobile]);

  /* ---------------- MOBILE — Remove gyro + add breathing animation ---------------- */
  useEffect(() => {
    if (!isMobile) return;
    if (!coinRef.current) return;

    let frame = 0;
    let raf;

    const breathe = () => {
      if (!coinRef.current) return;

      // Smooth breathing effect
      const offset = Math.sin(frame / 60) * 6; // slow up/down
      coinRef.current.style.transform = `translateY(${offset}px)`;

      frame++;
      raf = requestAnimationFrame(breathe);
    };

    breathe();

    return () => cancelAnimationFrame(raf);
  }, [isMobile]);

  /* ---------------- DATA ---------------- */
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
          "Verifiable on-chain activity with best-practice operational controls.",
      },
      {
        icon: "🚀",
        title: "High Growth Potential",
        description:
          "Early investor alignment and structured token distribution.",
      },
      {
        icon: "🌍",
        title: "Global Ecosystem",
        description:
          "Built for broad accessibility; Binance listing targeted for 2026.",
      },
      {
        icon: "⚡",
        title: "Lightning Fast",
        description:
          "BNB network provides near-instant confirmation and low fees.",
      },
    ],
    []
  );
    /* ---------------- RENDER ---------------- */
  return (
    <div style={S.page}>
      {/* HERO */}
      <section style={S.hero}>
        <div style={S.heroInner}>
          <div style={S.titleWrap}>
            <h1 style={S.title}>
              <span style={S.titleGradient}>ILLYRIAN TOKEN</span>
              <br />
              <span style={S.titleSymbol}>(ILLYRIAN)</span>
            </h1>
            <div style={S.titleGlow} />
          </div>

          {/* COIN */}
          <div style={S.coinContainer}>
            <img
              ref={coinRef}
              src="/images/illyriantokencircle.png"
              style={S.coin}
              draggable={false}
            />
          </div>

          <p style={S.subtitle}>
            The <span style={S.highlight}>next-generation</span> cryptocurrency
            built on innovation, transparency, and{" "}
            <span style={S.highlight}>unprecedented growth</span>.
          </p>

          <div style={S.badges}>
            <span style={S.badge}>🚀 Early Access</span>
            <span style={S.badge}>💎 Limited Supply</span>
            <span style={S.badge}>🌙 Moon Potential</span>
          </div>
        </div>
      </section>

      {/* ======================== */}
      {/* TOKEN METRICS */}
      {/* ======================== */}
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

      {/* ======================== */}
      {/* FEATURES */}
      {/* ======================== */}
      <section style={S.section}>
        <h2 style={S.sectionTitle}>Why Choose ILLYRIAN?</h2>
        <div style={S.featuresGrid}>
          {features.map((f, i) => (
            <article
              key={i}
              style={{
                ...S.featureCard,
                transform: activeFeature === i ? "scale(1.05)" : "scale(0.96)",
                opacity: activeFeature === i ? 1 : 0.85,
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
   STYLES — SAME AS YOUR ORIGINAL DESIGN (NOTHING CHANGED)
=============================================================== */
const S = {
  page: {
    minHeight: "100vh",
    color: "#fff",
    fontFamily: "'Inter','SF Pro Display',sans-serif",
    background:
      "radial-gradient(circle at 20% -20%, rgba(139,92,246,.2), transparent 45%), radial-gradient(circle at 80% -20%, rgba(59,130,246,.2), transparent 45%), #050914",
  },

  hero: { padding: "34px 14px 30px", textAlign: "center" },
  heroInner: { maxWidth: 1100, margin: "0 auto" },

  titleWrap: { marginBottom: 10, position: "relative" },

  title: {
    margin: 0,
    fontWeight: 900,
    fontSize: "clamp(2.1rem,7vw,3.6rem)",
  },

  titleGradient: {
    background:
      "linear-gradient(135deg,#8b5cf6 0%,#3b82f6 50%,#06b6d4 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },

  titleSymbol: {
    color: "rgba(165,180,252,1)",
    fontSize: "0.45em",
  },

  titleGlow: {
    position: "absolute",
    top: 60,
    left: "50%",
    transform: "translateX(-50%)",
    width: 300,
    height: 300,
    background:
      "radial-gradient(circle, rgba(139,92,246,.35), transparent 70%)",
    filter: "blur(60px)",
    zIndex: -1,
  },

  coinContainer: {
    width: "min(420px,80vw)",
    height: "min(420px,80vw)",
    margin: "10px auto 22px",
    perspective: "800px",
  },

  coin: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
    transformStyle: "preserve-3d",
    transition: "transform 0.15s ease-out",
    userSelect: "none",
  },

  subtitle: {
    fontSize: "1rem",
    margin: "0 auto",
    color: "rgba(255,255,255,.86)",
    maxWidth: 720,
  },

  highlight: {
    background: "linear-gradient(45deg,#8b5cf6,#3b82f6)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },

  badges: {
    display: "flex",
    justifyContent: "center",
    gap: 10,
    marginTop: 16,
    flexWrap: "wrap",
  },

  badge: {
    background: "rgba(139,92,246,.15)",
    border: "1px solid rgba(139,92,246,.3)",
    color: "#8b5cf6",
    padding: "8px 16px",
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 800,
  },

  section: { padding: "38px 14px" },

  sectionTitle: {
    textAlign: "center",
    marginBottom: 26,
    fontSize: "clamp(1.8rem,5vw,2.4rem)",
    background: "linear-gradient(135deg,#fff,#a5b4fc)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))",
    gap: 16,
    maxWidth: 980,
    margin: "0 auto",
  },

  statCard: {
    background: "rgba(255,255,255,.05)",
    border: "1px solid rgba(255,255,255,.1)",
    padding: "22px 18px",
    borderRadius: 16,
    textAlign: "center",
  },

  statLabel: {
    fontSize: 12,
    color: "rgba(255,255,255,.7)",
    marginBottom: 6,
  },

  statValue: {
    fontSize: 18,
    fontWeight: 900,
    background: "linear-gradient(135deg,#fff,#a5b4fc)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },

  featuresGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
    gap: 20,
    maxWidth: 1100,
    margin: "0 auto",
  },

  featureCard: {
    background: "rgba(255,255,255,.05)",
    border: "1px solid rgba(255,255,255,.1)",
    padding: "24px 20px",
    borderRadius: 16,
    transition: "all .3s ease",
    textAlign: "center",
  },

  featureIcon: { fontSize: "2.4rem", marginBottom: 10 },

  featureTitle: {
    fontSize: "1.1rem",
    marginBottom: 8,
    background: "linear-gradient(135deg,#fff,#a5b4fc)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },

  featureDesc: {
    fontSize: ".95rem",
    color: "rgba(255,255,255,.85)",
    lineHeight: 1.6,
  },
};

