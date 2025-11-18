// tabs/about.js — clean vertical layout (roadmap above text, no grid mess)
import { useEffect, useState } from "react";

export default function About() {
  const [fade, setFade] = useState(false);
  useEffect(() => {
    setFade(true);
    setTimeout(() => setFade(false), 5000);
  }, []);

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
      {/* Hero Section */}
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <div style={styles.titleContainer}>
            <h1 style={styles.mainTitle}>
              <span style={styles.titleGradient}>About Illyrian</span>
            </h1>
            <div style={styles.titleGlow}></div>
          </div>

          <p style={styles.heroSubtitle}>
            Building the <span style={styles.highlight}>future of finance</span>{" "}
            through innovation, community, and{" "}
            <span style={styles.highlight}>transformative technology</span>.
          </p>

          <div style={styles.ctaBadges}>
            <span style={styles.ctaBadge}>🚀 Innovative</span>
            <span style={styles.ctaBadge}>🌍 Global</span>
            <span style={styles.ctaBadge}>💫 Visionary</span>
          </div>
        </div>
      </section>

      {/* Journey Section */}
      <section style={styles.storySection}>
        <h2 style={styles.sectionTitle}>Our Journey</h2>

        {/* Roadmap FIRST */}
        <div style={styles.milestones}>
          <h3 style={styles.milestonesTitle}>Our Roadmap</h3>
          {milestones.map((milestone, index) => (
            <div key={index} style={styles.milestoneCard}>
              <div style={styles.milestoneYear}>{milestone.year}</div>
              <h4 style={styles.milestoneTitle}>{milestone.title}</h4>
              <ul style={styles.achievementsList}>
                {milestone.achievements.map((achievement, achIndex) => (
                  <li key={achIndex} style={styles.achievementItem}>
                    {achievement}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Then Story BELOW */}
        <div style={styles.storyText}>
          <p style={styles.storyParagraph}>
            Our token's success is fundamentally built on community trust and
            collective investment. As we cultivate a strong, engaged community,
            we establish the reputation necessary for sustainable growth and
            market presence. This foundation of trust is crucial as we progress
            toward our strategic goal of Binance listing by 2026, positioning
            ILLYRIAN Token for significant market impact and long-term success.{" "}
            <span style={styles.highlight}>We aim high</span> with{" "}
            <span style={styles.highlight}>early investors trust!</span>.
          </p>

          <p style={styles.storyParagraph}>
            To ensure seamless processing of your investments, please verify
            that all wallet addresses are entered accurately. Our team
            meticulously reviews every transaction, investment, and mining
            operation to maintain platform integrity and security.
          </p>

          <p style={styles.storyParagraph}>
            We are committed to delivering exceptional value to our investors.
            Each verified investment receives token allocations with a minimum
            guaranteed return of 300%, with potential for significantly higher
            yields based on market conditions and investment tiers.
          </p>

          <p style={styles.storyParagraph}>
            We strongly encourage all users to thoroughly review the
            "Instructions" section to fully understand our platform's
            operational framework. This knowledge will help you maximize your
            investment potential while gaining insight into our long-term
            vision and growth strategy.
          </p>

          <p style={styles.storyParagraph}>
            The trust and commitment of our early investors form the cornerstone
            of our ambitious growth strategy. We are positioned to exceed market
            expectations through innovative tokenomics, strategic partnerships,
            and continuous platform development.
          </p>

          {/* 🧾 Whitepaper Section */}
          <p style={styles.storyParagraph}>
            Dive deeper into our project’s foundation, vision, and future plans
            by exploring the{" "}
            <a
              href="https://illyrian-token-foundation.gitbook.io/illyrian-token-whitepaper"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background:
                  "linear-gradient(135deg, #8b5cf6, #3b82f6, #06b6d4)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontWeight: 700,
                textDecoration: "none",
                cursor: "pointer",
              }}
            >
              Whitepaper
            </a>
            . Learn more about how ILLYRIAN Token is building the future of
            decentralized finance.
          </p>
        </div>
      </section>

      {/* Connection Indicator */}
      {fade && (
        <div style={styles.syncIndicator}>
          <div style={styles.pulseCircle}></div>
          <span style={styles.syncText}>
            ✨ Connected to Illyrian Vision Network
          </span>
        </div>
      )}
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    overflowX: "hidden",
    fontFamily:
      "'Inter','SF Pro Display',-apple-system,BlinkMacSystemFont,sans-serif",
    padding: "0 16px",
  },

  hero: { padding: "40px 0", textAlign: "center" },
  heroContent: { maxWidth: "800px", margin: "0 auto" },
  titleContainer: { position: "relative", marginBottom: "30px" },
  mainTitle: {
    fontSize: "clamp(2.2rem, 6vw, 4rem)",
    fontWeight: 800,
  },
  titleGradient: {
    background: "linear-gradient(135deg,#8b5cf6,#3b82f6,#06b6d4)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  titleGlow: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%,-50%)",
    width: "100%",
    height: "100%",
    background:
      "radial-gradient(circle,rgba(139,92,246,0.3) 0%,transparent 70%)",
    filter: "blur(60px)",
    zIndex: -1,
  },
  heroSubtitle: {
    fontSize: "clamp(1rem,2.5vw,1.3rem)",
    color: "rgba(255,255,255,0.8)",
    margin: "0 auto 32px",
    maxWidth: "600px",
  },
  highlight: {
    background: "linear-gradient(45deg,#8b5cf6,#3b82f6)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    fontWeight: 600,
  },
  ctaBadges: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: "12px",
  },
  ctaBadge: {
    background: "rgba(139,92,246,0.15)",
    border: "1px solid rgba(139,92,246,0.3)",
    color: "#8b5cf6",
    padding: "10px 16px",
    borderRadius: "50px",
    fontWeight: 600,
  },

  storySection: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "40px 0 80px",
  },
  sectionTitle: {
    textAlign: "center",
    fontSize: "clamp(1.8rem, 5vw, 2.6rem)",
    marginBottom: "40px",
    background: "linear-gradient(135deg,#fff,#a5b4fc)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    fontWeight: 700,
  },

  milestones: {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "18px",
    padding: "28px 20px",
    marginBottom: "40px",
  },
  milestonesTitle: {
    fontSize: "1.4rem",
    fontWeight: 700,
    marginBottom: "20px",
    background: "linear-gradient(135deg,#8b5cf6,#3b82f6)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    textAlign: "center",
  },
  milestoneCard: {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "15px",
    padding: "18px 14px",
    marginBottom: "16px",
  },
  milestoneYear: {
    fontSize: "1.2rem",
    fontWeight: 700,
    background: "linear-gradient(135deg,#8b5cf6,#3b82f6)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    marginBottom: "6px",
    textAlign: "center",
  },
  milestoneTitle: {
    fontSize: "1rem",
    fontWeight: 600,
    color: "rgba(255,255,255,0.9)",
    marginBottom: "8px",
    textAlign: "center",
  },
  achievementsList: { listStyle: "none", padding: 0, margin: 0 },
  achievementItem: {
    fontSize: "0.9rem",
    color: "rgba(255,255,255,0.8)",
    padding: "4px 0",
    textAlign: "center",
  },

  storyText: {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "18px",
    padding: "35px 28px",
    textAlign: "justify",
  },
  storyParagraph: {
    fontSize: "1rem",
    color: "rgba(255,255,255,0.9)",
    lineHeight: 1.7,
    marginBottom: "22px",
  },

  syncIndicator: {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    background: "rgba(255,255,255,0.1)",
    border: "1px solid rgba(255,255,255,0.2)",
    borderRadius: "50px",
    padding: "10px 16px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    animation: "pulse 2s ease-in-out infinite",
  },
  pulseCircle: {
    width: "6px",
    height: "6px",
    background: "#10b981",
    borderRadius: "50%",
    animation: "pulse 1.5s ease-in-out infinite",
  },
  syncText: { fontSize: "12px", color: "rgba(255,255,255,0.9)" },
};
