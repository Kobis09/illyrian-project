// tabs/instructions.js - MOBILE OPTIMIZED
import { useEffect, useState } from "react";

export default function Instructions() {
  const [fade, setFade] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if mobile device
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);

    setFade(true);
    setTimeout(() => setFade(false), 5000);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const steps = [
    {
      number: "01",
      title: "Import the Token on MetaMask",
      shortTitle: "Import Token",
      description: "Add ILLYRIAN token to MetaMask to receive all payments and track your investments securely.",
      details: [
  "Open MetaMask and tap the '+' icon",
  "Select the BNB Chain network and paste the Token contract address",
  {
    type: "copy",
    label: "Token Contract",
    value: "0xC9Aa04758559DAcf7C5D9e41ed28E3595cC8ED58",
  },
  "Click Import",
  "Your ILLYRIAN balance will now be visible",
],

      icon: "📱",
      color: "#8b5cf6",
    },
    {
      number: "02",
      title: "Provide Your Wallet Addresses",
      shortTitle: "Wallet Setup",
      description: "Copy your token address and the USDT address used for payment, then paste them in the Invest & Mine tab.",
      details: [
        "Copy your 42-character ILLYRIAN wallet address",
        "Copy your USDT address that you gonna pay with",
        "Supported USDT networks: TRC20, ERC20, Solana, Polygon, BEP20",
        "Paste both addresses in the designated fields on our site and save them",
      ],
      icon: "💳",
      color: "#3b82f6",
    },
    {
      number: "03",
      title: "Investment Process & Verification",
      shortTitle: "Investment",
      description: "After investing, a timer ensures your tokens are prepared. We manually verify each transaction for accuracy and security.",
      details: [
        "Select your desired investment tier",
        "Complete the payment process from your desired platform. Must match the amount u choose from our offers",
        "Wait for manual transaction verification. If you didnt provide with the payment, tokens will not be received",
        "Tokens delivered within 24 hours post-verification if payment received",
      ],
      icon: "📊",
      color: "#06b6d4",
    },
    {
      number: "04",
      title: "Mining Operations",
      shortTitle: "Mining",
      description: "Higher mining tiers have higher fees. All fees must be paid to release mined tokens to your wallet.",
      details: [
        "Choose your preferred mining tier",
        "Pay the corresponding mining fee",
        "Start the mining process",
        "Receive tokens after fee verification",
      ],
      icon: "⛏️",
      color: "#10b981",
    },
    {
      number: "05",
      title: "Support & Assistance",
      shortTitle: "Support",
      description: "Any payment issues or questions? Contact us directly and we'll provide immediate assistance.",
      details: [
        "24/7 customer support available",
        "Direct messaging through Contact tab",
        "Quick response time guaranteed",
        "Secure resolution of all issues",
      ],
      icon: "🛡️",
      color: "#f59e0b",
    },
  ];

  return (
    <div style={styles.page}>
      {/* Hero Section - MOBILE OPTIMIZED */}
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <div style={styles.titleContainer}>
            <h1 style={styles.mainTitle}>
              <span style={styles.titleGradient}>Instructions</span>
              <span style={styles.titleSub}>Guide</span>
            </h1>
            <div style={styles.titleDecoration}>
              <div style={styles.titleLine}></div>
              <div style={styles.titleDot}></div>
            </div>
          </div>

          <p style={styles.heroSubtitle}>
            Follow these <span style={styles.highlight}>simple steps</span> to
            start your Illyrian Token journey. Each instruction is designed for{" "}
            <span style={styles.highlight}>maximum security</span> and ease of
            use.
          </p>

          {/* Progress Indicator - MOBILE OPTIMIZED */}
          <div style={styles.progressContainer}>
            <div style={styles.progressBar}>
              {steps.map((_, index) => (
                <div
                  key={index}
                  style={{
                    ...styles.progressSegment,
                    background: index === activeStep ? steps[index].color : "rgba(255,255,255,0.1)",
                    transform: index === activeStep ? "scale(1.1)" : "scale(1)",
                  }}
                  onClick={() => setActiveStep(index)}
                />
              ))}
            </div>
            <span style={styles.progressText}>
              Step {activeStep + 1} of {steps.length}
            </span>
          </div>
        </div>
      </section>

      {/* Interactive Steps Section - MOBILE OPTIMIZED */}
      <section style={styles.stepsSection}>
        <div style={styles.stepsContainer}>
          {/* Step Navigation - HORIZONTAL ON MOBILE */}
          <div style={styles.stepNavigation}>
            <div style={styles.stepNavScroll}>
              {steps.map((step, index) => (
                <button
                  key={index}
                  style={{
                    ...styles.stepNavButton,
                    ...(isMobile ? styles.stepNavButtonMobile : {}),
                    background: index === activeStep ? step.color : "rgba(255,255,255,0.05)",
                    borderColor: index === activeStep ? step.color : "rgba(255,255,255,0.1)",
                    transform: index === activeStep ? "translateY(-2px)" : "translateY(0)",
                  }}
                  onClick={() => setActiveStep(index)}
                >
                  <span style={styles.stepNavIcon}>{step.icon}</span>
                  <span style={styles.stepNavTitle}>
                    {isMobile ? step.shortTitle : step.title.split(" ")[0]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Active Step Content - MOBILE OPTIMIZED */}
          <div style={styles.activeStepContainer}>
            <div style={styles.stepHeader}>
              <div style={styles.stepNumberContainer}>
                <span style={styles.stepNumber}>
                  {steps[activeStep].number}
                </span>
                <div
                  style={{
                    ...styles.stepIcon,
                    ...(isMobile ? styles.stepIconMobile : {}),
                    background: steps[activeStep].color,
                  }}
                >
                  {steps[activeStep].icon}
                </div>
              </div>
              <div style={styles.stepTitleContent}>
                <h2 style={styles.stepTitle}>{steps[activeStep].title}</h2>
                <p style={styles.stepDescription}>
                  {steps[activeStep].description}
                </p>
              </div>
            </div>

            <div style={styles.stepDetails}>
              <h3 style={styles.detailsTitle}>Detailed Instructions:</h3>
              <div style={styles.detailsList}>
                {steps[activeStep].details.map((detail, index) => (
                  <div key={index} style={styles.detailItem}>
                    <div
                      style={{
                        ...styles.detailMarker,
                        ...(isMobile ? styles.detailMarkerMobile : {}),
                        background: steps[activeStep].color,
                      }}
                    >
                      {index + 1}
                    </div>
                    <span style={styles.detailText}>{detail}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Buttons - MOBILE OPTIMIZED */}
            <div style={styles.stepActions}>
              <button
                style={{
                  ...styles.navButton,
                  ...(isMobile ? styles.navButtonMobile : {}),
                  height: "38px",
                  padding: "8px 10px",
                  opacity: activeStep === 0 ? 0.5 : 1,
                  cursor: activeStep === 0 ? "not-allowed" : "pointer",
                }}
                onClick={() => setActiveStep((prev) => Math.max(0, prev - 1))}
                disabled={activeStep === 0}
              >
                ← Back
              </button>

              <div style={styles.stepIndicator}>
                <span style={styles.currentStep}>Step {activeStep + 1}</span>
                <span style={styles.totalSteps}>/{steps.length}</span>
              </div>

              <button
                style={{
                  ...styles.navButton,
                  ...(isMobile ? styles.navButtonMobile : {}),
                  background: steps[activeStep].color,
                  opacity: activeStep === steps.length - 1 ? 0.5 : 1,
                  cursor: activeStep === steps.length - 1 ? "not-allowed" : "pointer",
                }}
                onClick={() => setActiveStep((prev) => Math.min(steps.length - 1, prev + 1))}
                disabled={activeStep === steps.length - 1}
              >
                Next →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Tips Section - MOBILE OPTIMIZED */}
      <section style={styles.tipsSection}>
        <div style={styles.tipsContainer}>
          <h2 style={styles.tipsTitle}>💡 Pro Tips</h2>
          <div style={styles.tipsGrid}>
            <div style={styles.tipCard}>
              <div style={styles.tipIcon}>🔒</div>
              <h3 style={styles.tipHeading}>Security First</h3>
              <p style={styles.tipText}>
                Always double-check wallet addresses before sending payments
              </p>
            </div>
            <div style={styles.tipCard}>
              <div style={styles.tipIcon}>⏱️</div>
              <h3 style={styles.tipHeading}>Timing Matters</h3>
              <p style={styles.tipText}>
                Complete investments during business hours for faster verification
              </p>
            </div>
            <div style={styles.tipCard}>
              <div style={styles.tipIcon}>📞</div>
              <h3 style={styles.tipHeading}>Support Ready</h3>
              <p style={styles.tipText}>
                Our team responds within 2 hours to all support requests
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sync Indicator - MOBILE OPTIMIZED */}
      {fade && (
        <div style={styles.syncIndicator}>
          <div style={styles.pulseCircle}></div>
          <span style={styles.syncText}>✨ Guide Updated</span>
        </div>
      )}

      <style jsx>{`
        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.8;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes slideIn {
          from {
            transform: translateX(-20px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

const styles = {
  page: {
    position: "relative",
    minHeight: "100vh",
    overflow: "hidden",
    fontFamily: "'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
    padding: "0 5px",
  },

  // MOBILE OPTIMIZED Hero Section
  hero: {
    position: "relative",
    padding: "30px 15px 30px",
    zIndex: 2,
    textAlign: "center",
  },

  heroContent: {
    maxWidth: "100%",
    margin: "0 auto",
    zIndex: 2,
  },

  titleContainer: {
    position: "relative",
    marginBottom: "20px",
  },

  mainTitle: {
    fontSize: "clamp(2rem, 8vw, 3.5rem)",
    fontWeight: 800,
    letterSpacing: "-0.02em",
    lineHeight: 1.1,
    margin: "0 0 8px 0",
  },

  titleGradient: {
    background: "linear-gradient(135deg, #8b5cf6 0%, #3b82f6 50%, #06b6d4 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    display: "block",
  },

  titleSub: {
    color: "rgba(255, 255, 255, 0.9)",
    display: "block",
    fontSize: "0.5em",
    fontWeight: 300,
    letterSpacing: "1px",
    textTransform: "uppercase",
    marginTop: "8px",
  },

  titleDecoration: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "15px",
    marginTop: "15px",
  },

  titleLine: {
    width: "40px",
    height: "2px",
    background: "linear-gradient(90deg, transparent, #8b5cf6, transparent)",
  },

  titleDot: {
    width: "6px",
    height: "6px",
    background: "#8b5cf6",
    borderRadius: "50%",
    animation: "pulse 2s ease-in-out infinite",
  },

  heroSubtitle: {
    fontSize: "clamp(0.95rem, 3.5vw, 1.2rem)",
    color: "rgba(255, 255, 255, 0.8)",
    lineHeight: 1.5,
    margin: "0 auto 30px",
    maxWidth: "100%",
    fontWeight: 300,
    padding: "0 10px",
  },

  highlight: {
    background: "linear-gradient(45deg, #8b5cf6, #3b82f6)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    fontWeight: 600,
  },

  progressContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "12px",
    marginTop: "30px",
  },

  progressBar: {
    display: "flex",
    gap: "6px",
    background: "rgba(255, 255, 255, 0.05)",
    padding: "6px",
    borderRadius: "20px",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
  },

  progressSegment: {
    width: "30px",
    height: "4px",
    borderRadius: "2px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    minWidth: "20px",
  },

  progressText: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: "13px",
    fontWeight: 500,
  },

  // MOBILE OPTIMIZED Steps Section
  stepsSection: {
    position: "relative",
    padding: "30px 15px",
    zIndex: 2,
  },

  stepsContainer: {
    maxWidth: "100%",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },

  stepNavigation: {
    width: "100%",
    overflowX: "auto",
    overflowY: "hidden",
    scrollbarWidth: "none",
    msOverflowStyle: "none",
    WebkitOverflowScrolling: "touch",
  },

  stepNavScroll: {
    display: "flex",
    gap: "8px",
    padding: "5px",
    minWidth: "min-content",
  },

  stepNavButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "12px 16px",
    border: "1px solid",
    borderRadius: "10px",
    background: "linear-gradient(135deg, rgba(139,92,246,0.3), rgba(59,130,246,0.3))",
    color: "rgba(255, 255, 255, 0.9)",
    cursor: "pointer",
    transition: "all 0.3s ease",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    whiteSpace: "nowrap",
    flexShrink: 0,
    minHeight: "44px",
  },

  stepNavButtonMobile: {
    padding: "10px 14px",
    minWidth: "100px",
  },

  stepNavIcon: {
    fontSize: "16px",
  },

  stepNavTitle: {
    fontSize: "12px",
    fontWeight: 600,
  },

  activeStepContainer: {
    background: "rgba(255, 255, 255, 0.05)",
    backdropFilter: "blur(15px)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "16px",
    padding: "25px 20px",
    animation: "slideIn 0.5s ease-out",
  },

  stepHeader: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    marginBottom: "30px",
    alignItems: "center",
    textAlign: "center",
  },

  stepNumberContainer: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    justifyContent: "center",
  },

  stepNumber: {
    fontSize: "2.5rem",
    fontWeight: 800,
    background: "linear-gradient(135deg, #fff, #a5b4fc)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    lineHeight: 1,
  },

  stepIcon: {
    width: "50px",
    height: "50px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
  },

  stepIconMobile: {
    width: "45px",
    height: "45px",
    fontSize: "18px",
  },

  stepTitleContent: {
    flex: 1,
    width: "100%",
  },

  stepTitle: {
    fontSize: "clamp(1.3rem, 4vw, 1.8rem)",
    fontWeight: 700,
    margin: "0 0 12px 0",
    background: "linear-gradient(135deg, #fff, #a5b4fc)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    lineHeight: "1.3",
  },

  stepDescription: {
    fontSize: "clamp(0.9rem, 3vw, 1.1rem)",
    color: "rgba(255, 255, 255, 0.8)",
    lineHeight: 1.5,
    margin: 0,
  },

  stepDetails: {
    marginBottom: "30px",
  },

  detailsTitle: {
    fontSize: "1.1rem",
    fontWeight: 600,
    margin: "0 0 15px 0",
    color: "rgba(255, 255, 255, 0.9)",
  },

  detailsList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  detailItem: {
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
    padding: "12px",
    background: "rgba(255, 255, 255, 0.03)",
    borderRadius: "8px",
    border: "1px solid rgba(255, 255, 255, 0.05)",
  },

  detailMarker: {
    width: "22px",
    height: "22px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "11px",
    fontWeight: 600,
    color: "white",
    flexShrink: 0,
    marginTop: "1px",
  },

  detailMarkerMobile: {
    width: "20px",
    height: "20px",
    fontSize: "10px",
  },

  detailText: {
    color: "rgba(255, 255, 255, 0.8)",
    lineHeight: 1.4,
    fontSize: "14px",
    flex: 1,
  },

  stepActions: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "10px",
    padding: "0 8px",  
},


  navButton: {
    padding: "12px 16px",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    background: "linear-gradient(135deg, rgba(239,68,68,0.35), rgba(190,41,41,0.35))",
    color: "white",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: 600,
    transition: "all 0.3s ease",
    backdropFilter: "blur(10px)",
    fontSize: "14px",
    minHeight: "44px",
    flex: 1,
  },

  nextButton: {
    padding: "12px 20px",
    borderRadius: "10px",
    background: "linear-gradient(135deg,#a78bfa,#6366f1)",
    color: "#fff",
    fontWeight: 600,
    border: "none",
    minWidth: "110px",
    boxShadow: "0 0px 10px rgba(99,102,241,0.35)", // ⭐ smaller shadow
},



  stepIndicator: {
    display: "flex",
    alignItems: "baseline",
    gap: "2px",
    flexShrink: 0,
    padding: "0 10px",
  },

  currentStep: {
    fontSize: "16px",
    fontWeight: 700,
    color: "white",
  },

  totalSteps: {
    fontSize: "12px",
    color: "rgba(255, 255, 255, 0.6)",
  },

  // MOBILE OPTIMIZED Tips Section
  tipsSection: {
    position: "relative",
    padding: "40px 15px",
    zIndex: 2,
  },

  tipsContainer: {
    maxWidth: "100%",
    margin: "0 auto",
  },

  tipsTitle: {
    fontSize: "clamp(1.5rem, 5vw, 2rem)",
    textAlign: "center",
    margin: "0 auto 30px",
    background: "linear-gradient(135deg, #fff, #a5b4fc)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    fontWeight: 700,
  },

  tipsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "15px",
  },

  tipCard: {
    background: "rgba(255, 255, 255, 0.05)",
    backdropFilter: "blur(15px)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "12px",
    padding: "25px 20px",
    textAlign: "center",
    transition: "transform 0.3s ease",
    minHeight: "180px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },

  tipIcon: {
    fontSize: "2rem",
    marginBottom: "12px",
    filter: "drop-shadow(0 0 15px rgba(139, 92, 246, 0.3))",
  },

  tipHeading: {
    fontSize: "1.1rem",
    fontWeight: 600,
    margin: "0 0 8px 0",
    color: "white",
  },

  tipText: {
    color: "rgba(255, 255, 255, 0.7)",
    lineHeight: 1.4,
    margin: 0,
    fontSize: "14px",
  },

  // MOBILE OPTIMIZED Sync Indicator
  syncIndicator: {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    background: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    borderRadius: "20px",
    padding: "10px 16px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    zIndex: 1000,
    animation: "pulse 2s ease-in-out infinite",
    fontSize: "12px",
  },

  pulseCircle: {
    width: "6px",
    height: "6px",
    background: "#10b981",
    borderRadius: "50%",
    animation: "pulse 1.5s ease-in-out infinite",
  },

  syncText: {
    fontSize: "12px",
    color: "rgba(255, 255, 255, 0.9)",
    fontWeight: 500,
  },
  mainTitleUpdated: {
  fontSize: "clamp(1.8rem, 4.5vw, 2.7rem)",   // ⭐ smaller like Invest & Mine
  fontWeight: 800,
  lineHeight: 1.15,
  margin: "0 0 10px 0",
  textAlign: "center",
},

titleGradientUpdated: {
  background:
    "linear-gradient(135deg, #a78bfa 0%, #6366f1 35%, #3b82f6 65%, #06b6d4 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  display: "inline-block",
},

titleSubUpdated: {
  color: "rgba(255,255,255,0.9)",
  fontSize: "clamp(0.8rem, 2vw, 1rem)",
  letterSpacing: "1px",
  fontWeight: 400,
  display: "block",
  marginTop: "6px",
},

};