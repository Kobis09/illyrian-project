// tabs/about.js — Illyrian Gold Modern Version (no glow, modern font)

import { useEffect, useState } from "react";

export default function About() {
  const [fade, setFade] = useState(false);

  useEffect(() => {
    setFade(true);
    setTimeout(() => setFade(false), 4500);
  }, []);

  const GOLD = "linear-gradient(135deg,#C9A34A,#E1C46D,#F0D886)";

  const milestones = [
    {
      year: "2024",
      title: "Project Inception",
      achievements: [
        "Core team assembly",
        "Tokenomics design",
        "Smart contract development",
        "Community foundation",
      ],
    },
    {
      year: "2025",
      title: "Growth Phase",
      achievements: [
        "Community building",
        "Strategic partnerships",
        "Platform development",
        "Global expansion initiatives",
      ],
    },
    {
      year: "2026",
      title: "Global Expansion",
      achievements: [
        "Binance listing preparation",
        "Ecosystem launch",
        "Global marketing campaign",
        "Mass adoption push",
      ],
    },
  ];

  return (
    <div style={styles.page}>
      {/* Floating Background */}
      <div style={styles.particlesLayer}></div>

      {/* HERO SECTION */}
      <section style={styles.hero}>
        <h1 style={styles.title}>
          <span style={styles.titleGradient}>About Illyrian Token</span>
        </h1>

        <p style={styles.heroSubtitle}>
          Building the <span style={styles.highlight}>future of finance</span>{" "}
          through innovation, community strength, and{" "}
          <span style={styles.highlight}>transformative vision</span>.
        </p>

        <div style={styles.badges}>
          <span style={styles.badge}>🚀 Innovative</span>
          <span style={styles.badge}>🌍 Global</span>
          <span style={styles.badge}>💫 Visionary</span>
        </div>
      </section>

      {/* ROADMAP SECTION */}
      <section style={styles.roadmapSection}>
        <h2 style={styles.sectionTitle}>Our Journey</h2>

        <div style={styles.roadmapWrapper}>
          <h3 style={styles.roadmapTitle}>Our Roadmap</h3>

          {milestones.map((milestone, idx) => (
            <div
              key={idx}
              style={{
                ...styles.milestoneCard,
                animation: `riseUp 0.5s ease ${idx * 0.12}s forwards`,
                opacity: 0,
              }}
            >
              <div style={styles.milestoneYear}>{milestone.year}</div>
              <div style={styles.milestoneSubtitle}>{milestone.title}</div>

              <ul style={styles.milestoneList}>
                {milestone.achievements.map((ach, aIdx) => (
                  <li key={aIdx} style={styles.milestoneItem}>
                    {ach}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* STORY SECTION */}
        <div style={styles.storyBox}>
          <p style={styles.storyText}>
            Our token's success is fundamentally built on community trust and
            collective investment. As we cultivate a strong, engaged community,
            we establish the reputation necessary for sustainable growth and
            market presence. This foundation is crucial as we progress toward
            our strategic goal of Binance listing by 2026.
          </p>

          <p style={styles.storyText}>
            To ensure seamless processing of your investments, please verify all
            wallet addresses. Our team meticulously reviews each transaction,
            investment, and mining operation to maintain platform integrity and
            security.
          </p>

          <p style={styles.storyText}>
            We deliver exceptional value to investors: each verified investment
            receives token allocations with a guaranteed minimum return of 300%.
            Additional returns may vary based on market performance and investor
            tier.
          </p>

          <p style={styles.storyText}>
            To maximize your opportunity, we encourage all users to review the
            platform instructions to better understand the Invest & Mine system,
            reward tiers, and long-term strategy.
          </p>

          <p style={styles.storyText}>
            Dive deeper into our foundation and long-term vision by exploring
            our{" "}
            <a
              href="https://illyrian-token-foundation.gitbook.io/illyrian-token-whitepaper"
              target="_blank"
              rel="noopener noreferrer"
              style={styles.whitepaperLink}
            >
              Whitepaper
            </a>
            .
          </p>
        </div>
      </section>

      {/* CONNECTION INDICATOR */}
      {fade && (
        <div style={styles.syncIndicator}>
          <div style={styles.pulseDot}></div>
          <span style={styles.syncLabel}>Connected to Illyrian Vision</span>
        </div>
      )}

      {/* KEYFRAMES */}
      <style>
        {`
        @keyframes riseUp {
          0% { transform: translateY(18px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }

        @keyframes float {
          0% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
          100% { transform: translateY(0); }
        }
      `}
      </style>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    padding: "0 18px 70px",
    position: "relative",
    background: "#0F1114",
    color: "white",
    overflowX: "hidden",
    fontFamily: "'Inter','SF Pro Display',sans-serif",
  },

  particlesLayer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background:
      "radial-gradient(circle at 50% 20%, rgba(255,215,140,0.045), transparent 70%)",
    animation: "float 10s ease-in-out infinite",
    zIndex: 0,
  },

  hero: {
    textAlign: "center",
    padding: "40px 0 30px",
    position: "relative",
    zIndex: 2,
  },

  title: {
    fontSize: "clamp(2.2rem, 6vw, 3.3rem)",
    fontWeight: 800,
    marginBottom: "12px",
    letterSpacing: "-0.5px",
  },

  titleGradient: {
    background: "linear-gradient(135deg,#C9A34A,#E1C46D,#F0D886)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },

  heroSubtitle: {
    color: "rgba(255,255,255,0.85)",
    fontSize: "1.05rem",
    maxWidth: "600px",
    margin: "0 auto 22px",
    lineHeight: 1.65,
  },

  highlight: {
    background: "linear-gradient(135deg,#C9A34A,#E1C46D)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    fontWeight: 600,
  },

  badges: {
    display: "flex",
    justifyContent: "center",
    gap: "12px",
    flexWrap: "wrap",
  },

  badge: {
    padding: "8px 14px",
    borderRadius: "50px",
    border: "1px solid rgba(240,216,134,0.32)",
    background: "rgba(240,216,134,0.06)",
    color: "#E1C46D",
    fontWeight: 600,
    fontSize: "0.9rem",
  },

  roadmapSection: {
    position: "relative",
    zIndex: 2,
    paddingBottom: "40px",
  },

  sectionTitle: {
    textAlign: "center",
    fontSize: "1.9rem",
    marginTop: "20px",
    marginBottom: "20px",
    fontWeight: 700,
    background: "linear-gradient(135deg,#F0D886,#E1C46D)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },

  roadmapWrapper: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.07)",
    padding: "25px 20px",
    borderRadius: "20px",
    marginBottom: "40px",
  },

  roadmapTitle: {
    textAlign: "center",
    fontSize: "1.25rem",
    marginBottom: "16px",
    background: "linear-gradient(135deg,#C9A34A,#E1C46D)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    fontWeight: 700,
  },

  milestoneCard: {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.07)",
    marginBottom: "16px",
    padding: "16px 14px",
    borderRadius: "14px",
    backdropFilter: "blur(4px)",
  },

  milestoneYear: {
    textAlign: "center",
    fontSize: "1.2rem",
    background: "linear-gradient(135deg,#C9A34A,#E1C46D)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    fontWeight: 700,
    marginBottom: "4px",
  },

  milestoneSubtitle: {
    textAlign: "center",
    fontSize: "1rem",
    marginBottom: "6px",
    color: "rgba(255,255,255,0.92)",
    fontWeight: 600,
  },

  milestoneList: {
    padding: 0,
    margin: 0,
    listStyle: "none",
    textAlign: "center",
  },

  milestoneItem: {
    padding: "4px 0",
    color: "rgba(255,255,255,0.75)",
    fontSize: "0.9rem",
  },

  storyBox: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.07)",
    padding: "26px",
    borderRadius: "16px",
    backdropFilter: "blur(6px)",
  },

  storyText: {
    marginBottom: "18px",
    color: "rgba(255,255,255,0.9)",
    lineHeight: 1.7,
    fontSize: "1rem",
  },

  whitepaperLink: {
    background: "linear-gradient(135deg,#C9A34A,#E1C46D,#F0D886)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    fontWeight: 700,
    cursor: "pointer",
    textDecoration: "none",
    transition: "0.2s",
  },

  syncIndicator: {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.15)",
    padding: "10px 16px",
    borderRadius: "50px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    backdropFilter: "blur(4px)",
    zIndex: 10,
  },

  pulseDot: {
    width: "6px",
    height: "6px",
    background: "#F0D886",
    borderRadius: "50%",
    animation: "pulse 1.4s ease-in-out infinite",
  },

  syncLabel: {
    fontSize: "12px",
    color: "rgba(255,255,255,0.9)",
  },
};
