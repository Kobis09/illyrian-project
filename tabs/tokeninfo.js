// tabs/tokeninfo.js — NEW HOME PAGE (No Errors, Fully Merged)
import { useEffect, useRef, useState } from "react";

/* ================================================================
   MAIN HOME COMPONENT
================================================================ */
export default function Home() {
  const coinRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  /* Detect Mobile */
  useEffect(() => {
    const detect = () => setIsMobile(window.innerWidth <= 768);
    detect();
    window.addEventListener("resize", detect);
    return () => window.removeEventListener("resize", detect);
  }, []);

  /* PC — Mouse Interaction */
  useEffect(() => {
    if (isMobile) return;
    const move = (e) => {
      if (!coinRef.current) return;
      const x = ((e.clientX / window.innerWidth) - 0.5) * 20;
      const y = ((e.clientY / window.innerHeight) - 0.5) * -20;
      coinRef.current.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [isMobile]);

  /* MOBILE — Float Animation */
  useEffect(() => {
    if (!isMobile || !coinRef.current) return;
    let frame = 0;
    let raf;
    const float = () => {
      const offset = Math.sin(frame / 40) * 5;
      coinRef.current.style.transform = `translateY(${offset}px)`;
      frame++;
      raf = requestAnimationFrame(float);
    };
    float();
    return () => cancelAnimationFrame(raf);
  }, [isMobile]);

  return (
    <div style={S.page}>
      {/* HERO */}
      <section style={S.hero}>
        <div style={S.heroInner}>

          {/* LEFT TEXT */}
          <div style={S.left}>
            <h1 style={S.titleMain}>
              Illyrian Token
            </h1>

            <p style={S.subtitle}>
              Premium, secure, next-generation digital asset designed for global adoption,
              long-term scalability, and strong investor value.
            </p>

            <div style={S.btnRow}>
              <a href="/dashboard" style={S.primaryBtn}>Enter Dashboard</a>
              <a href="https://illyrian-token-foundation.gitbook.io" target="_blank" style={S.secondaryBtn}>Whitepaper</a>
            </div>
          </div>

          {/* RIGHT COIN */}
          <div style={S.right}>
            <div style={S.coinWrap}>
              <div style={S.coinGlow}></div>
              <div style={S.coinScan}></div>
              <img
                ref={coinRef}
                src="/images/illyriantokencircle.png"
                style={S.coin}
                draggable={false}
              />
            </div>
          </div>

        </div>
      </section>

      {/* DIVIDER */}
      <div style={S.sectionDivider}></div>

      {/* Page sections (Part 2 continues) */}
    </div>
  );
}

/* ================================================================
   STYLES — GOLD + NAVY (FINAL)
================================================================ */
const S = {
  page: {
    minHeight: "100vh",
    width: "100%",
    color: "white",
    background: "linear-gradient(180deg,#05070D,#0A0F1A 60%,#05070D)",
    overflowX: "hidden",
    fontFamily: "'Inter','SF Pro Display',sans-serif"
  },

  hero: {
    padding: "50px 20px 80px",
    display: "flex",
    justifyContent: "center",
  },

  heroInner: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "40px",
    maxWidth: "1200px",
    width: "100%",
    flexWrap: "wrap",
  },

  /* LEFT */
  left: {
    flex: 1,
    minWidth: "280px",
  },

  titleMain: {
    fontSize: "clamp(2.2rem, 5vw, 3.8rem)",
    fontWeight: 800,
    background: "linear-gradient(135deg,#F0D886,#ffffff)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    marginBottom: "18px",
  },

  subtitle: {
    fontSize: "1.1rem",
    color: "rgba(255,255,255,0.85)",
    lineHeight: 1.6,
    maxWidth: "520px",
    marginBottom: "25px",
  },

  btnRow: {
    display: "flex",
    gap: "16px",
    flexWrap: "wrap",
  },

  primaryBtn: {
    padding: "12px 22px",
    background: "linear-gradient(135deg,#F0D886,#8C7846)",
    color: "#000",
    borderRadius: "10px",
    textDecoration: "none",
    fontWeight: 700,
    boxShadow: "0 0 15px rgba(240,216,134,0.3)",
  },

  secondaryBtn: {
    padding: "12px 22px",
    border: "1px solid rgba(255,255,255,0.3)",
    color: "white",
    borderRadius: "10px",
    textDecoration: "none",
    fontWeight: 600,
  },

  /* RIGHT */
  right: {
    flex: 1,
    minWidth: "260px",
    display: "flex",
    justifyContent: "center",
  },

  coinWrap: {
    position: "relative",
    width: "min(420px,85vw)",
    height: "min(420px,85vw)",
  },

  coin: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
    position: "relative",
    zIndex: 3,
  },

  coinGlow: {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: "120%",
    height: "120%",
    transform: "translate(-50%,-50%)",
    background: "radial-gradient(circle,rgba(240,216,134,0.18),transparent 70%)",
    filter: "blur(60px)",
    zIndex: 1,
  },

  coinScan: {
    position: "absolute",
    top: "0",
    left: "-150%",
    width: "150%",
    height: "100%",
    background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.25),transparent)",
    animation: "scan 3.5s infinite",
    zIndex: 2,
  },

  sectionDivider: {
    height: "1px",
    width: "100%",
    background: "linear-gradient(90deg,transparent,#2a2a2a,transparent)",
    margin: "30px 0",
  },
};
/* ================================================================
   PART 2 — METRICS + FEATURES + ROADMAP + FOOTER
================================================================ */

/* METRICS */
export function HomeSections() {
  return (
    <>
      <Metrics />
      <Features />
      <Roadmap />
      <Footer />

      <style>{`
        @keyframes scan {
          0% { transform: translateX(-150%); }
          100% { transform: translateX(250%); }
        }
      `}</style>
    </>
  );
}

/* ---------------- METRICS ---------------- */
function Metrics() {
  const data = [
    { label: "Total Supply", value: "1,000,000 ILY" },
    { label: "Blockchain", value: "BNB Smart Chain" },
    { label: "Target Listing", value: "Binance 2026" },
    { label: "Token Type", value: "Utility Asset" },
  ];

  return (
    <section style={S2.section}>
      <h2 style={S2.sectionTitle}>Illyrian Metrics</h2>
      <div style={S2.grid}>
        {data.map((m, i) => (
          <div key={i} style={S2.card}>
            <div style={S2.label}>{m.label}</div>
            <div style={S2.value}>{m.value}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- FEATURES ---------------- */
function Features() {
  const items = [
    {
      icon: "🔒",
      title: "Security First",
      desc: "Audited smart contract and strong operational controls.",
    },
    {
      icon: "🚀",
      title: "High Growth",
      desc: "Built with exponential expansion in mind.",
    },
    {
      icon: "🌍",
      title: "Global Vision",
      desc: "Designed for worldwide accessibility & utility.",
    },
    {
      icon: "⚡",
      title: "Fast & Efficient",
      desc: "BNB Smart Chain ensures fast confirmations.",
    },
  ];

  return (
    <section style={S2.section}>
      <h2 style={S2.sectionTitle}>Why Choose Illyrian?</h2>
      <div style={S2.grid}>
        {items.map((f, i) => (
          <div key={i} style={S2.card}>
            <div style={S2.icon}>{f.icon}</div>
            <h3 style={S2.cardTitle}>{f.title}</h3>
            <p style={S2.desc}>{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- ROADMAP ---------------- */
function Roadmap() {
  const steps = [
    {
      year: "2024",
      items: ["Project Inception", "Smart Contract", "Tokenomics", "Community"],
    },
    {
      year: "2025",
      items: ["Scaling", "Marketing", "Partnerships", "Ecosystem Launch"],
    },
    {
      year: "2026",
      items: ["Binance Listing Prep", "Expansion", "Global Push"],
    },
  ];

  return (
    <section style={S2.section}>
      <h2 style={S2.sectionTitle}>Roadmap</h2>
      <div style={S2.grid}>
        {steps.map((r, i) => (
          <div key={i} style={S2.card}>
            <div style={S2.year}>{r.year}</div>
            <ul style={S2.list}>
              {r.items.map((st, idx) => (
                <li key={idx} style={S2.listItem}>{st}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- FOOTER ---------------- */
function Footer() {
  return (
    <footer style={S2.footer}>
      <p style={S2.footerText}>© {new Date().getFullYear()} Illyrian Token</p>
    </footer>
  );
}

/* ================================================================
   STYLES FOR PART 2 (NO DUPLICATES)
================================================================ */
const S2 = {
  section: {
    padding: "40px 20px",
    textAlign: "center",
  },

  sectionTitle: {
    fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
    fontWeight: 800,
    marginBottom: "25px",
    background: "linear-gradient(135deg,#F0D886,#ffffff)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px,1fr))",
    gap: "20px",
    maxWidth: "1100px",
    margin: "0 auto",
  },

  card: {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    padding: "22px",
    borderRadius: "14px",
    backdropFilter: "blur(6px)",
  },

  label: {
    color: "rgba(255,255,255,0.65)",
    marginBottom: "6px",
  },

  value: {
    background: "linear-gradient(135deg,#F0D886,#ffffff)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    fontWeight: 800,
    fontSize: "1.2rem",
  },

  icon: { fontSize: "2.2rem", marginBottom: "12px" },

  cardTitle: {
    fontSize: "1.2rem",
    marginBottom: "8px",
    background: "linear-gradient(135deg,#F0D886,#ffffff)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },

  desc: {
    color: "rgba(255,255,255,0.85)",
  },

  year: {
    fontSize: "1.6rem",
    fontWeight: 800,
    background: "linear-gradient(135deg,#F0D886,#ffffff)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    marginBottom: "10px",
  },

  list: { padding: 0, listStyle: "none" },

  listItem: {
    color: "rgba(255,255,255,0.85)",
    marginBottom: 6,
  },

  footer: {
    marginTop: "40px",
    padding: "25px",
    borderTop: "1px solid rgba(255,255,255,0.1)",
  },

  footerText: {
    color: "rgba(255,255,255,0.6)",
  },
};
