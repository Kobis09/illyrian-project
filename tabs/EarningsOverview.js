import { useEffect, useState } from "react";
import { doc, onSnapshot, getDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function EarningsOverview({ user }) {
  const [investment, setInvestment] = useState("");
  const [profit, setProfit] = useState(null);
  const [userData, setUserData] = useState(null);
  const [updatedTime, setUpdatedTime] = useState("");
  const [fade, setFade] = useState(false);
  const [activeTab, setActiveTab] = useState("calculator");
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [selectedMining, setSelectedMining] = useState(null);

  // 🔄 Load default info instantly + enable realtime updates
  useEffect(() => {
    if (!user) return;

    // Show default info right away
    setUserData({
      email: user.email || "—",
      username: "—",
      network: "—",
      usdtWallet: "—",
      tokenWallet: "—",
    });

    const ref = doc(db, "users", user.uid);

    // One-time initial load
    getDoc(ref).then((snap) => {
      if (snap.exists()) {
        setUserData((prev) => ({ ...prev, ...snap.data() }));
      }
    });

    // Real-time updates
    const unsubscribe = onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        setUserData((prev) => ({ ...prev, ...snap.data() }));
        const now = new Date().toLocaleTimeString();
        setUpdatedTime(now);
        setFade(true);
        setTimeout(() => setFade(false), 6000); // animation fade-out
      }
    });

    return () => unsubscribe();
  }, [user]);

  const investOffers = [
    { amount: 50, tokens: 200, id: 1 },
    { amount: 100, tokens: 400, id: 2 },
    { amount: 200, tokens: 800, id: 3 },
    { amount: 400, tokens: 1600, id: 4 },
    { amount: 800, tokens: 3200, id: 5 },
    { amount: 1000, tokens: 4000, id: 6 },
    { amount: 2000, tokens: 8000, id: 7 },
    { amount: 5000, tokens: 25000, id: 8 },
  ];

  const miningOptions = [
    { fee: 20, tokens: 200, id: 1 },
    { fee: 40, tokens: 400, id: 2 },
    { fee: 80, tokens: 800, id: 3 },
    { fee: 120, tokens: 1200, id: 4 },
  ];

  const handleCalculate = () => {
    const investValue = parseFloat(investment);
    if (isNaN(investValue) || investValue <= 0) {
      setProfit(null);
      return;
    }
    const match = investOffers.find((o) => o.amount === investValue);
    if (match) {
      const gain = ((match.tokens / match.amount - 1) * 100).toFixed(0);
      setProfit({ tokens: match.tokens, percent: gain, amount: match.amount });
    } else {
      setProfit(null);
    }
  };

  const getProfitColor = (percent) => {
    if (percent >= 300) return "#22c55e"; // Green for highest profits
    if (percent >= 200) return "#84cc16"; // Lime green
    if (percent >= 100) return "#eab308"; // Yellow
    return "#ef4444"; // Red for lower profits
  };

  const calculateROI = (tokens, cost) => {
    return ((tokens / cost - 1) * 100).toFixed(0);
  };

  return (
    <div style={styles.page}>
      {/* Hero Section */}
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <div style={styles.titleContainer}>
            <h1 style={styles.mainTitle}>
              <span style={styles.titleGradient}>Earnings</span>
              <span style={styles.titleSymbol}>Overview</span>
            </h1>
            <div style={styles.titleGlow}></div>
          </div>

          <p style={styles.heroSubtitle}>
            Track your{" "}
            <span style={styles.highlight}>investment performance</span>,
            calculate potential profits, and{" "}
            <span style={styles.highlight}>optimize your strategy</span>
          </p>

          <div style={styles.ctaBadges}>
            <span style={styles.ctaBadge}>📈 Live Updates</span>
            <span style={styles.ctaBadge}>💎 Best ROI</span>
            <span style={styles.ctaBadge}>⚡ Fast Calculations</span>
          </div>
        </div>
      </section>

      {/* User Info Section */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Account Overview</h2>
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h3 style={styles.cardTitle}>👤 User Information</h3>
            {updatedTime && (
              <div
                style={{
                  ...styles.updateIndicator,
                  opacity: fade ? 1 : 0.7,
                }}
              >
                <div style={styles.pulseDot}></div>
                Live Data
              </div>
            )}
          </div>

          {userData ? (
            <div style={styles.userGrid}>
              <div style={styles.userField}>
                <span style={styles.fieldLabel}>Email Address</span>
                <span style={styles.fieldValue}>{userData.email || "—"}</span>
              </div>
              <div style={styles.userField}>
                <span style={styles.fieldLabel}>Username</span>
                <span style={styles.fieldValue}>
                  {userData.username || "—"}
                </span>
              </div>
              <div style={styles.userField}>
                <span style={styles.fieldLabel}>USDT Network</span>
                <span
                  style={{
                    ...styles.fieldValue,
                    color:
                      userData.network !== "—"
                        ? "#7dd3fc"
                        : "rgba(255,255,255,0.6)",
                  }}
                >
                  {userData.network || "—"}
                </span>
              </div>
              <div style={{ ...styles.userField, gridColumn: "1 / -1" }}>
                <span style={styles.fieldLabel}>USDT Wallet</span>
                <code style={styles.addressCode}>
                  {userData.usdtWallet || "—"}
                </code>
              </div>
              <div style={{ ...styles.userField, gridColumn: "1 / -1" }}>
                <span style={styles.fieldLabel}>Token Wallet</span>
                <code style={styles.addressCode}>
                  {userData.tokenWallet || "—"}
                </code>
              </div>
            </div>
          ) : (
            <div style={styles.loadingState}>
              <div style={styles.loadingSpinner}></div>
              <span>Loading user information...</span>
            </div>
          )}

          {updatedTime && (
            <div style={styles.updatedFooter}>
              <span style={styles.updatedText}>
                🔄 Last updated: {updatedTime}
              </span>
            </div>
          )}
        </div>
      </section>

      {/* Calculator & Offers Section */}
      <section style={styles.section}>
        <div style={styles.tabContainer}>
          <div style={styles.tabHeader}>
            <button
              style={{
                ...styles.tabButton,
                ...(activeTab === "calculator" ? styles.tabActive : {}),
              }}
              onClick={() => setActiveTab("calculator")}
            >
              💰 Profit Calculator
            </button>
            <button
              style={{
                ...styles.tabButton,
                ...(activeTab === "offers" ? styles.tabActive : {}),
              }}
              onClick={() => setActiveTab("offers")}
            >
              💼 Investment Offers
            </button>
            <button
              style={{
                ...styles.tabButton,
                ...(activeTab === "mining" ? styles.tabActive : {}),
              }}
              onClick={() => setActiveTab("mining")}
            >
              ⛏️ Mining Options
            </button>
          </div>

          <div style={styles.tabContent}>
            {activeTab === "calculator" && (
              <div style={styles.calculatorCard}>
                <h3 style={styles.cardTitle}>Quick Profit Calculator</h3>
                <p style={styles.cardDescription}>
                  Enter any amount to calculate your potential ILLYRIAN token returns
                  and profit percentage.
                </p>

                <div style={styles.calcInputGroup}>
                  <input
                    type="number"
                    placeholder="Enter investment amount ($)"
                    value={investment}
                    onChange={(e) => setInvestment(e.target.value)}
                    style={styles.calcInput}
                  />
                  <button onClick={handleCalculate} style={styles.primaryBtn}>
                    Calculate ROI
                  </button>
                </div>

                {profit && (
                  <div style={styles.resultCard}>
                    <div style={styles.resultHeader}>
                      <h4 style={styles.resultTitle}>Investment Result</h4>
                      <span
                        style={{
                          ...styles.profitBadge,
                          background: `linear-gradient(135deg, ${getProfitColor(
                            profit.percent
                          )}20, ${getProfitColor(profit.percent)}40)`,
                          borderColor: getProfitColor(profit.percent),
                          color: getProfitColor(profit.percent),
                        }}
                      >
                        +{profit.percent}% ROI
                      </span>
                    </div>
                    <div style={styles.resultGrid}>
                      <div style={styles.resultItem}>
                        <span>Investment</span>
                        <strong>${profit.amount}</strong>
                      </div>
                      <div style={styles.resultItem}>
                        <span>You Receive</span>
                        <strong style={{ color: "#7dd3fc" }}>
                          {profit.tokens} ILLYRIAN
                        </strong>
                      </div>
                      <div style={styles.resultItem}>
                        <span>Profit Margin</span>
                        <strong
                          style={{ color: getProfitColor(profit.percent) }}
                        >
                          +{profit.percent}%
                        </strong>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "offers" && (
              <div style={styles.offersGrid}>
                {investOffers.map((offer) => {
                  const roi = calculateROI(offer.tokens, offer.amount);
                  return (
                    <div
                      key={offer.id}
                      style={{
                        ...styles.offerCard,
                        transform:
                          selectedOffer === offer.id
                            ? "scale(1.02)"
                            : "scale(1)",
                        borderColor:
                          selectedOffer === offer.id
                            ? "#8b5cf6"
                            : "rgba(255,255,255,0.1)",
                      }}
                      onClick={() => setSelectedOffer(offer.id)}
                    >
                      <div style={styles.offerHeader}>
                        <h4 style={styles.offerAmount}>${offer.amount}</h4>
                        <span
                          style={{
                            ...styles.roiBadge,
                            background: `linear-gradient(135deg, ${getProfitColor(
                              roi
                            )}20, ${getProfitColor(roi)}40)`,
                            borderColor: getProfitColor(roi),
                            color: getProfitColor(roi),
                          }}
                        >
                          +{roi}%
                        </span>
                      </div>
                      <div style={styles.offerBody}>
                        <div style={styles.tokenAmount}>
                          <span style={styles.tokenLabel}>Receive</span>
                          <strong style={styles.tokenValue}>
                            {offer.tokens} ILLYRIAN
                          </strong>
                        </div>
                        <div style={styles.profitInfo}>
                          <span style={{ color: "#7dd3fc" }}>Net Profit</span>
                          <span style={{ color: getProfitColor(roi) }}>
                            +{offer.tokens - offer.amount} ILLYRIAN
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {activeTab === "mining" && (
              <div style={styles.miningGrid}>
                {miningOptions.map((option) => {
                  const roi = calculateROI(option.tokens, option.fee);
                  return (
                    <div
                      key={option.id}
                      style={{
                        ...styles.miningCard,
                        transform:
                          selectedMining === option.id
                            ? "scale(1.02)"
                            : "scale(1)",
                        borderColor:
                          selectedMining === option.id
                            ? "#3b82f6"
                            : "rgba(255,255,255,0.1)",
                      }}
                      onClick={() => setSelectedMining(option.id)}
                    >
                      <div style={styles.miningHeader}>
                        <h4 style={styles.miningFee}>${option.fee} Fee</h4>
                        <span
                          style={{
                            ...styles.roiBadge,
                            background: `linear-gradient(135deg, ${getProfitColor(
                              roi
                            )}20, ${getProfitColor(roi)}40)`,
                            borderColor: getProfitColor(roi),
                            color: getProfitColor(roi),
                          }}
                        >
                          +{roi}%
                        </span>
                      </div>
                      <div style={styles.miningBody}>
                        <div style={styles.miningReward}>
                          <span style={styles.rewardLabel}>Mining Reward</span>
                          <strong style={styles.rewardValue}>
                            {option.tokens} ILLYRIAN
                          </strong>
                        </div>
                        <div style={styles.miningProfit}>
                          <span style={{ color: "#7dd3fc" }}>Net Gain</span>
                          <span style={{ color: getProfitColor(roi) }}>
                            +{option.tokens - option.fee} ILLYRIAN
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Investment Comparison</h2>
        <div style={styles.comparisonGrid}>
          <div style={styles.comparisonCard}>
            <h3 style={styles.cardTitle}>💰 Best Investment ROI</h3>
            <div style={styles.bestOffer}>
              {investOffers
                .map((offer) => ({
                  ...offer,
                  roi: calculateROI(offer.tokens, offer.amount),
                }))
                .sort((a, b) => b.roi - a.roi)
                .slice(0, 3)
                .map((offer, index) => (
                  <div key={offer.id} style={styles.bestItem}>
                    <div style={styles.rankBadge}>#{index + 1}</div>
                    <div style={styles.bestContent}>
                      <span style={styles.bestAmount}>${offer.amount}</span>
                      <span
                        style={{
                          ...styles.bestRoi,
                          color: getProfitColor(offer.roi),
                        }}
                      >
                        +{offer.roi}% ROI
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div style={styles.comparisonCard}>
            <h3 style={styles.cardTitle}>⚡ Best Mining ROI</h3>
            <div style={styles.bestOffer}>
              {miningOptions
                .map((option) => ({
                  ...option,
                  roi: calculateROI(option.tokens, option.fee),
                }))
                .sort((a, b) => b.roi - a.roi)
                .slice(0, 3)
                .map((option, index) => (
                  <div key={option.id} style={styles.bestItem}>
                    <div style={styles.rankBadge}>#{index + 1}</div>
                    <div style={styles.bestContent}>
                      <span style={styles.bestAmount}>${option.fee} Fee</span>
                      <span
                        style={{
                          ...styles.bestRoi,
                          color: getProfitColor(option.roi),
                        }}
                      >
                        +{option.roi}% ROI
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </section>

      {/* Sync Indicator */}
      {fade && (
        <div style={styles.syncIndicator}>
          <div style={styles.pulseCircle}></div>
          <span style={styles.syncText}>✨ Earnings Updated in Real-time</span>
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
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
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
    fontFamily:
      "'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
    padding: "16px",
  },

  hero: {
    position: "relative",
    padding: "32px 16px 48px",
    zIndex: 2,
    textAlign: "center",
  },

  heroContent: {
    maxWidth: "800px",
    margin: "0 auto",
    zIndex: 2,
  },

  titleContainer: {
    position: "relative",
    marginBottom: "24px",
  },

  mainTitle: {
    fontSize: "clamp(2rem, 8vw, 3.5rem)",
    fontWeight: 800,
    letterSpacing: "-0.02em",
    lineHeight: 1.1,
    margin: "0 0 8px 0",
  },

  titleGradient: {
    background:
      "linear-gradient(135deg, #8b5cf6 0%, #3b82f6 50%, #06b6d4 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    display: "block",
  },

  titleSymbol: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: "0.4em",
    verticalAlign: "super",
    marginLeft: "8px",
  },

  titleGlow: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "100%",
    height: "100%",
    background:
      "radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 70%)",
    filter: "blur(60px)",
    zIndex: -1,
  },

  heroSubtitle: {
    fontSize: "clamp(1rem, 4vw, 1.25rem)",
    color: "rgba(255, 255, 255, 0.8)",
    lineHeight: 1.6,
    margin: "0 auto 32px",
    maxWidth: "600px",
    fontWeight: 300,
  },

  highlight: {
    background: "linear-gradient(45deg, #8b5cf6, #3b82f6)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    fontWeight: 600,
  },

  ctaBadges: {
    display: "flex",
    gap: "12px",
    justifyContent: "center",
    flexWrap: "wrap",
  },

  ctaBadge: {
    background: "rgba(139, 92, 246, 0.15)",
    border: "1px solid rgba(139, 92, 246, 0.3)",
    color: "#8b5cf6",
    padding: "10px 16px",
    borderRadius: "50px",
    fontSize: "14px",
    fontWeight: 600,
    backdropFilter: "blur(10px)",
    transition: "all 0.3s ease",
  },

  section: {
    position: "relative",
    padding: "32px 16px",
    zIndex: 2,
  },

  sectionTitle: {
    fontSize: "clamp(1.75rem, 6vw, 2.5rem)",
    textAlign: "center",
    margin: "0 auto 32px",
    background: "linear-gradient(135deg, #fff 0%, #a5b4fc 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    fontWeight: 700,
  },

  card: {
    background: "rgba(255, 255, 255, 0.05)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "16px",
    padding: "24px",
    transition: "all 0.3s ease",
    maxWidth: "1000px",
    margin: "0 auto",
  },

  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    flexWrap: "wrap",
    gap: "12px",
  },

  cardTitle: {
    fontSize: "1.25rem",
    fontWeight: 700,
    margin: 0,
    background: "linear-gradient(135deg, #fff, #a5b4fc)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },

  cardDescription: {
    fontSize: "0.9rem",
    color: "rgba(255, 255, 255, 0.8)",
    lineHeight: 1.6,
    margin: "0 0 20px 0",
  },

  // User Info Styles
  userGrid: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "16px",
  },

  userField: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },

  fieldLabel: {
    fontSize: "13px",
    color: "rgba(255, 255, 255, 0.7)",
    fontWeight: 500,
  },

  fieldValue: {
    fontSize: "15px",
    color: "rgba(255, 255, 255, 0.9)",
    fontWeight: 600,
  },

  addressCode: {
    background: "rgba(0, 0, 0, 0.3)",
    padding: "10px 12px",
    borderRadius: "8px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    fontSize: "13px",
    color: "#e2e8f0",
    wordBreak: "break-all",
    fontFamily: "monospace",
    lineHeight: 1.4,
  },

  updateIndicator: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    background: "rgba(34, 197, 94, 0.1)",
    border: "1px solid rgba(34, 197, 94, 0.3)",
    color: "#22c55e",
    padding: "6px 12px",
    borderRadius: "10px",
    fontSize: "13px",
    fontWeight: 500,
    transition: "all 0.3s ease",
  },

  pulseDot: {
    width: "6px",
    height: "6px",
    background: "#22c55e",
    borderRadius: "50%",
    animation: "pulse 2s ease-in-out infinite",
  },

  loadingState: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    padding: "32px",
    color: "rgba(255, 255, 255, 0.7)",
  },

  loadingSpinner: {
    width: "18px",
    height: "18px",
    border: "2px solid rgba(255, 255, 255, 0.3)",
    borderTop: "2px solid #8b5cf6",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },

  updatedFooter: {
    marginTop: "16px",
    paddingTop: "16px",
    borderTop: "1px solid rgba(255, 255, 255, 0.1)",
    textAlign: "center",
  },

  updatedText: {
    fontSize: "13px",
    color: "rgba(255, 255, 255, 0.6)",
    fontStyle: "italic",
  },

  // Tab Styles
  tabContainer: {
    background: "rgba(255, 255, 255, 0.05)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "16px",
    overflow: "hidden",
    maxWidth: "1000px",
    margin: "0 auto",
  },

  tabHeader: {
    display: "flex",
    flexDirection: "column",
    background: "rgba(255, 255, 255, 0.03)",
    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
  },

  tabButton: {
    flex: 1,
    padding: "16px 12px",
    background: "none",
    border: "none",
    color: "rgba(255, 255, 255, 0.7)",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "14px",
    transition: "all 0.3s ease",
    textAlign: "center",
  },

  tabActive: {
    background: "rgba(139, 92, 246, 0.15)",
    color: "#8b5cf6",
    borderBottom: "2px solid #8b5cf6",
  },

  tabContent: {
    padding: "24px",
  },

  // Calculator Styles
  calculatorCard: {
    textAlign: "center",
  },

  calcInputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    marginBottom: "24px",
    maxWidth: "400px",
    margin: "0 auto 24px",
  },

  calcInput: {
    flex: 1,
    padding: "12px 16px",
    borderRadius: "10px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    background: "rgba(255, 255, 255, 0.08)",
    color: "#fff",
    fontSize: "16px",
    outline: "none",
    transition: "all 0.3s ease",
  },

  primaryBtn: {
    padding: "12px 20px",
    borderRadius: "10px",
    border: "none",
    background: "linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "14px",
    transition: "all 0.3s ease",
    backdropFilter: "blur(10px)",
    whiteSpace: "nowrap",
  },

  resultCard: {
    background: "rgba(255, 255, 255, 0.03)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "12px",
    padding: "20px",
    marginTop: "16px",
    textAlign: "left",
  },

  resultHeader: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    marginBottom: "16px",
  },

  resultTitle: {
    margin: 0,
    fontSize: "1.1rem",
    color: "rgba(255, 255, 255, 0.9)",
  },

  profitBadge: {
    padding: "6px 12px",
    borderRadius: "16px",
    fontSize: "13px",
    fontWeight: 600,
    border: "1px solid",
    alignSelf: "flex-start",
  },

  resultGrid: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "12px",
  },

  resultItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "14px",
    padding: "8px 0",
    borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
  },

  // Offers & Mining Grids
  offersGrid: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "16px",
  },

  miningGrid: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "16px",
  },

  offerCard: {
    background: "rgba(255, 255, 255, 0.03)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "12px",
    padding: "20px",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },

  miningCard: {
    background: "rgba(255, 255, 255, 0.03)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "12px",
    padding: "20px",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },

  offerHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px",
  },

  miningHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px",
  },

  offerAmount: {
    fontSize: "1.25rem",
    fontWeight: 700,
    margin: 0,
    color: "rgba(255, 255, 255, 0.9)",
  },

  miningFee: {
    fontSize: "1.25rem",
    fontWeight: 700,
    margin: 0,
    color: "rgba(255, 255, 255, 0.9)",
  },

  roiBadge: {
    padding: "4px 10px",
    borderRadius: "10px",
    fontSize: "11px",
    fontWeight: 600,
    border: "1px solid",
  },

  offerBody: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  miningBody: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  tokenAmount: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  miningReward: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  tokenLabel: {
    fontSize: "13px",
    color: "rgba(255, 255, 255, 0.7)",
  },

  rewardLabel: {
    fontSize: "13px",
    color: "rgba(255, 255, 255, 0.7)",
  },

  tokenValue: {
    fontSize: "1.1rem",
    fontWeight: 600,
    color: "#7dd3fc",
  },

  rewardValue: {
    fontSize: "1.1rem",
    fontWeight: 600,
    color: "#7dd3fc",
  },

  profitInfo: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "13px",
  },

  miningProfit: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "13px",
  },

  // Comparison Section
  comparisonGrid: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "20px",
    maxWidth: "1000px",
    margin: "0 auto",
  },

  comparisonCard: {
    background: "rgba(255, 255, 255, 0.05)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "16px",
    padding: "24px",
  },

  bestOffer: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  bestItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    background: "rgba(255, 255, 255, 0.03)",
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid rgba(255, 255, 255, 0.08)",
  },

  rankBadge: {
    background: "linear-gradient(135deg, #8b5cf6, #3b82f6)",
    color: "white",
    padding: "6px 10px",
    borderRadius: "6px",
    fontSize: "11px",
    fontWeight: 700,
    minWidth: "35px",
    textAlign: "center",
  },

  bestContent: {
    display: "flex",
    flexDirection: "column",
    gap: "3px",
    flex: 1,
  },

  bestAmount: {
    fontSize: "15px",
    fontWeight: 600,
    color: "rgba(255, 255, 255, 0.9)",
  },

  bestRoi: {
    fontSize: "13px",
    fontWeight: 600,
  },

  // Sync Indicator
  syncIndicator: {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    background: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    borderRadius: "50px",
    padding: "10px 16px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    zIndex: 1000,
    animation: "pulse 2s ease-in-out infinite",
    maxWidth: "calc(100vw - 40px)",
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
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },

  // Media queries for larger screens
  "@media (min-width: 768px)": {
    page: {
      padding: "20px",
    },
    hero: {
      padding: "40px 20px 60px",
    },
    section: {
      padding: "40px 20px",
    },
    card: {
      padding: "40px",
      borderRadius: "20px",
    },
    tabHeader: {
      flexDirection: "row",
    },
    tabButton: {
      padding: "20px",
    },
    tabContent: {
      padding: "40px",
    },
    userGrid: {
      gridTemplateColumns: "1fr 1fr",
      gap: "20px",
    },
    calcInputGroup: {
      flexDirection: "row",
      gap: "15px",
    },
    offersGrid: {
      gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
      gap: "20px",
    },
    miningGrid: {
      gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
      gap: "20px",
    },
    comparisonGrid: {
      gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
      gap: "25px",
    },
    resultHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    resultGrid: {
      gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
      gap: "15px",
    },
    syncIndicator: {
      bottom: "30px",
      right: "30px",
      padding: "12px 20px",
    },
    syncText: {
      fontSize: "14px",
    },
  },

  "@media (min-width: 1024px)": {
    offersGrid: {
      gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    },
    miningGrid: {
      gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    },
  },
};