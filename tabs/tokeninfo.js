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
      {/* HERO SECTION - Sun.io inspired */}
      <section style={S.hero}>
        <div style={S.heroInner}>
          {/* Animated background elements */}
          <div style={S.heroBackground}>
            <div style={S.floatingOrb1}></div>
            <div style={S.floatingOrb2}></div>
            <div style={S.floatingOrb3}></div>
          </div>
          
          <div style={S.titleWrap}>
            <h1 style={S.title}>
              <span style={S.titleGradient}>ILLYRIAN TOKEN</span>
              <br />
              <span style={S.titleSymbol}>(ILLYRIAN)</span>
            </h1>
            <div style={S.titleGlow} />
          </div>

          {/* COIN with enhanced container */}
          <div style={S.coinContainer}>
            <div style={S.coinWrapper}>
              <img
                ref={coinRef}
                src="/images/illyriantokencircle.png"
                style={S.coin}
                draggable={false}
                alt="Illyrian Token"
              />
              <div style={S.coinGlow}></div>
            </div>
          </div>

          <p style={S.subtitle}>
            The <span style={S.highlight}>next-generation</span> cryptocurrency
            built on innovation, transparency, and{" "}
            <span style={S.highlight}>unprecedented growth</span>.
          </p>

          <div style={S.badges}>
            <span style={S.badge}>
              <span style={S.badgeIcon}>🚀</span>
              Early Access
            </span>
            <span style={S.badge}>
              <span style={S.badgeIcon}>💎</span>
              Limited Supply
            </span>
            <span style={S.badge}>
              <span style={S.badgeIcon}>🌙</span>
              Moon Potential
            </span>
          </div>
        </div>
      </section>

      {/* TOKEN METRICS - Sun.io card style */}
      <section style={S.section}>
        <div style={S.sectionHeader}>
          <h2 style={S.sectionTitle}>Token Metrics</h2>
          <div style={S.sectionDivider}></div>
        </div>
        <div style={S.statsGrid}>
          {stats.map((s, i) => (
            <div key={i} style={S.statCard}>
              <div style={S.statIconWrapper}>
                <div style={S.statIcon}></div>
              </div>
              <div style={S.statContent}>
                <div style={S.statLabel}>{s.label}</div>
                <div style={S.statValue}>{s.value}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES - Enhanced with Sun.io styling */}
      <section style={S.section}>
        <div style={S.sectionHeader}>
          <h2 style={S.sectionTitle}>Why Choose ILLYRIAN?</h2>
          <div style={S.sectionDivider}></div>
        </div>
        <div style={S.featuresGrid}>
          {features.map((f, i) => (
            <article
              key={i}
              style={{
                ...S.featureCard,
                transform: activeFeature === i ? "scale(1.02)" : "scale(1)",
                opacity: activeFeature === i ? 1 : 0.9,
                border: activeFeature === i ? "1px solid rgba(139, 92, 246, 0.4)" : "1px solid rgba(255, 255, 255, 0.1)",
              }}
              onMouseEnter={() => setActiveFeature(i)}
            >
              <div style={S.featureIconWrapper}>
                <div style={S.featureIcon}>{f.icon}</div>
                <div style={S.featureIconGlow}></div>
              </div>
              <h3 style={S.featureTitle}>{f.title}</h3>
              <p style={S.featureDesc}>{f.description}</p>
              <div style={S.featureHover}></div>
            </article>
          ))}
        </div>
      </section>

      {/* ADDITIONAL SUN.IO INSPIRED SECTION */}
      <section style={S.ctaSection}>
        <div style={S.ctaContent}>
          <h2 style={S.ctaTitle}>Ready to Join the Revolution?</h2>
          <p style={S.ctaText}>
            Be part of the next big thing in cryptocurrency. Early investors get exclusive benefits and priority access.
          </p>
          <div style={S.ctaButtons}>
            <button style={S.primaryButton}>
              Get Started
            </button>
            <button style={S.secondaryButton}>
              Learn More
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ===============================================================
   ENHANCED STYLES - Sun.io inspired design
=============================================================== */
const S = {
  page: {
    minHeight: "100vh",
    color: "#fff",
    fontFamily: "'Inter','SF Pro Display',sans-serif",
    background: `
      radial-gradient(circle at 0% 0%, rgba(139, 92, 246, 0.15) 0%, transparent 50%),
      radial-gradient(circle at 100% 0%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 100% 100%, rgba(6, 182, 212, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 0% 100%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
      #050914
    `,
    position: "relative",
    overflow: "hidden",
  },

  hero: { 
    padding: "60px 20px 40px", 
    textAlign: "center",
    position: "relative",
    minHeight: "80vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },

  heroInner: { 
    maxWidth: 1200, 
    margin: "0 auto",
    position: "relative",
    zIndex: 2
  },

  heroBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: "hidden",
    zIndex: 1
  },

  floatingOrb1: {
    position: "absolute",
    width: "300px",
    height: "300px",
    background: "radial-gradient(circle, rgba(139, 92, 246, 0.2) 0%, transparent 70%)",
    borderRadius: "50%",
    top: "10%",
    left: "10%",
    animation: "float 6s ease-in-out infinite",
    filter: "blur(40px)"
  },

  floatingOrb2: {
    position: "absolute",
    width: "200px",
    height: "200px",
    background: "radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)",
    borderRadius: "50%",
    top: "60%",
    right: "10%",
    animation: "float 8s ease-in-out infinite 1s",
    filter: "blur(30px)"
  },

  floatingOrb3: {
    position: "absolute",
    width: "150px",
    height: "150px",
    background: "radial-gradient(circle, rgba(6, 182, 212, 0.1) 0%, transparent 70%)",
    borderRadius: "50%",
    bottom: "20%",
    left: "20%",
    animation: "float 7s ease-in-out infinite 2s",
    filter: "blur(25px)"
  },

  titleWrap: { 
    marginBottom: "30px", 
    position: "relative" 
  },

  title: {
    margin: 0,
    fontWeight: 900,
    fontSize: "clamp(2.5rem, 8vw, 4.5rem)",
    lineHeight: 1.1,
  },

  titleGradient: {
    background: "linear-gradient(135deg, #8b5cf6 0%, #3b82f6 50%, #06b6d4 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundSize: "200% 200%",
    animation: "gradientShift 8s ease infinite",
  },

  titleSymbol: {
    color: "rgba(165, 180, 252, 0.8)",
    fontSize: "0.4em",
    fontWeight: 600,
    letterSpacing: "2px",
  },

  titleGlow: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "400px",
    height: "400px",
    background: "radial-gradient(circle, rgba(139, 92, 246, 0.25) 0%, transparent 70%)",
    filter: "blur(80px)",
    zIndex: -1,
  },

  coinContainer: {
    width: "min(300px, 70vw)",
    height: "min(300px, 70vw)",
    margin: "30px auto",
    perspective: "1000px",
    position: "relative",
  },

  coinWrapper: {
    position: "relative",
    width: "100%",
    height: "100%",
  },

  coin: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
    transformStyle: "preserve-3d",
    transition: "transform 0.2s ease-out",
    userSelect: "none",
    position: "relative",
    zIndex: 2,
  },

  coinGlow: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "120%",
    height: "120%",
    background: "radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 70%)",
    filter: "blur(30px)",
    zIndex: 1,
    animation: "pulse 4s ease-in-out infinite",
  },

  subtitle: {
    fontSize: "1.2rem",
    margin: "0 auto 30px",
    color: "rgba(255, 255, 255, 0.9)",
    maxWidth: 720,
    lineHeight: 1.6,
    fontWeight: 400,
  },

  highlight: {
    background: "linear-gradient(45deg, #8b5cf6, #3b82f6)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    fontWeight: 600,
  },

  badges: {
    display: "flex",
    justifyContent: "center",
    gap: "15px",
    marginTop: "30px",
    flexWrap: "wrap",
  },

  badge: {
    background: "rgba(255, 255, 255, 0.05)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    color: "rgba(255, 255, 255, 0.9)",
    padding: "12px 20px",
    borderRadius: "50px",
    fontSize: "14px",
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
    gap: "8px",
    transition: "all 0.3s ease",
    backdropFilter: "blur(10px)",
  },

  badgeIcon: {
    fontSize: "16px",
  },

  section: { 
    padding: "80px 20px",
    position: "relative",
  },

  sectionHeader: {
    textAlign: "center",
    marginBottom: "50px",
    position: "relative",
  },

  sectionTitle: {
    fontSize: "clamp(2rem, 6vw, 3rem)",
    fontWeight: 800,
    marginBottom: "20px",
    background: "linear-gradient(135deg, #fff, #a5b4fc)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },

  sectionDivider: {
    width: "60px",
    height: "4px",
    background: "linear-gradient(90deg, #8b5cf6, #3b82f6)",
    margin: "0 auto",
    borderRadius: "2px",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "25px",
    maxWidth: 1200,
    margin: "0 auto",
  },

  statCard: {
    background: "rgba(255, 255, 255, 0.03)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    padding: "30px 25px",
    borderRadius: "20px",
    display: "flex",
    alignItems: "center",
    gap: "20px",
    transition: "all 0.3s ease",
    backdropFilter: "blur(10px)",
    position: "relative",
    overflow: "hidden",
  },

  statIconWrapper: {
    flexShrink: 0,
  },

  statIcon: {
    width: "50px",
    height: "50px",
    background: "linear-gradient(135deg, #8b5cf6, #3b82f6)",
    borderRadius: "12px",
    position: "relative",
  },

  statIcon: {
    width: "50px",
    height: "50px",
    background: "linear-gradient(135deg, #8b5cf6, #3b82f6)",
    borderRadius: "12px",
    position: "relative",
  },

  statContent: {
    flex: 1,
  },

  statLabel: {
    fontSize: "14px",
    color: "rgba(255, 255, 255, 0.7)",
    marginBottom: "8px",
    fontWeight: 600,
    letterSpacing: "1px",
  },

  statValue: {
    fontSize: "20px",
    fontWeight: 800,
    background: "linear-gradient(135deg, #fff, #a5b4fc)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },

  featuresGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "30px",
    maxWidth: 1200,
    margin: "0 auto",
  },

  featureCard: {
    background: "rgba(255, 255, 255, 0.03)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    padding: "40px 30px",
    borderRadius: "20px",
    transition: "all 0.4s ease",
    textAlign: "center",
    position: "relative",
    overflow: "hidden",
    backdropFilter: "blur(10px)",
  },

  featureIconWrapper: {
    position: "relative",
    marginBottom: "20px",
  },

  featureIcon: { 
    fontSize: "3rem", 
    position: "relative",
    zIndex: 2
  },

  featureIconGlow: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "80px",
    height: "80px",
    background: "radial-gradient(circle, rgba(139, 92, 246, 0.2) 0%, transparent 70%)",
    filter: "blur(15px)",
    zIndex: 1,
  },

  featureTitle: {
    fontSize: "1.4rem",
    marginBottom: "15px",
    background: "linear-gradient(135deg, #fff, #a5b4fc)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    fontWeight: 700,
  },

  featureDesc: {
    fontSize: "1rem",
    color: "rgba(255, 255, 255, 0.8)",
    lineHeight: 1.6,
  },

  featureHover: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "linear-gradient(135deg, rgba(139, 92, 246, 0.05), rgba(59, 130, 246, 0.05))",
    opacity: 0,
    transition: "opacity 0.3s ease",
    borderRadius: "20px",
  },

  ctaSection: {
    padding: "100px 20px",
    textAlign: "center",
    background: "radial-gradient(circle at center, rgba(139, 92, 246, 0.1) 0%, transparent 70%)",
  },

  ctaContent: {
    maxWidth: 800,
    margin: "0 auto",
  },

  ctaTitle: {
    fontSize: "clamp(2rem, 6vw, 3rem)",
    fontWeight: 800,
    marginBottom: "20px",
    background: "linear-gradient(135deg, #fff, #a5b4fc)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },

  ctaText: {
    fontSize: "1.2rem",
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: "40px",
    lineHeight: 1.6,
  },

  ctaButtons: {
    display: "flex",
    gap: "20px",
    justifyContent: "center",
    flexWrap: "wrap",
  },

  primaryButton: {
    background: "linear-gradient(135deg, #8b5cf6, #3b82f6)",
    border: "none",
    color: "white",
    padding: "15px 30px",
    borderRadius: "50px",
    fontSize: "16px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.3s ease",
    minWidth: "160px",
  },

  secondaryButton: {
    background: "rgba(255, 255, 255, 0.05)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    color: "white",
    padding: "15px 30px",
    borderRadius: "50px",
    fontSize: "16px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.3s ease",
    minWidth: "160px",
    backdropFilter: "blur(10px)",
  },
};

// Add CSS animations
const styles = `
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(5deg); }
  }
  
  @keyframes gradientShift {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 0.6; transform: translate(-50%, -50%) scale(1); }
    50% { opacity: 0.8; transform: translate(-50%, -50%) scale(1.05); }
  }
  
  /* Add hover effects */
  .stat-card:hover {
    transform: translateY(-5px);
    border-color: rgba(139, 92, 246, 0.3);
  }
  
  .feature-card:hover .feature-hover {
    opacity: 1;
  }
  
  .badge:hover {
    background: rgba(139, 92, 246, 0.2);
    border-color: rgba(139, 92, 246, 0.5);
    transform: translateY(-2px);
  }
  
  .primary-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(139, 92, 246, 0.3);
  }
  
  .secondary-button:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}