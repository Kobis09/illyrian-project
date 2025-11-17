// components/TabsNav.jsx - PERFECT SYMMETRY MOBILE & DESKTOP
import { useState, useEffect } from "react";

export default function TabsNav({ selectedTab, setSelectedTab }) {
  const [isMobile, setIsMobile] = useState(false);
  const [gridCols, setGridCols] = useState(4); // 4 for most mobiles, 3 for very small screens

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      setIsMobile(w <= 768);
      setGridCols(w <= 480 ? 3 : 4); // small phones => 3 columns, otherwise 4
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const tabs = [
    { key: "tokenInfo", label: "Token Info", shortLabel: "Token", icon: "🪙" },
    { key: "instructions", label: "Instructions", shortLabel: "Guide", icon: "📚" },
    { key: "investMine", label: "Invest & Mine", shortLabel: "Invest", icon: "💎" },
    { key: "referralBonus", label: "Referral Bonus", shortLabel: "Referral", icon: "👥" },
    { key: "earnings", label: "Earnings", shortLabel: "Earnings", icon: "📊" },
    { key: "contact", label: "Contact", shortLabel: "Contact", icon: "💬" },
    { key: "about", label: "About", shortLabel: "About", icon: "🌟" },
  ];

  // Dynamic grid styles so mobile looks perfect at both 3 & 4 columns
  const gridRowStyle = (cols) => ({
    display: "grid",
    gridTemplateColumns: `repeat(${cols}, 1fr)`,
    gap: "6px",
    alignItems: "stretch",
  });
  const centeredRowStyle = (cols) => ({
    display: "grid",
    gridTemplateColumns: `repeat(${cols}, 1fr)`,
    gap: "6px",
    alignItems: "stretch",
  });
  const emptyCell = { };

  return (
    <div style={styles.navWrapper}>
      <div style={styles.navContainer}>
        {isMobile ? (
          // MOBILE
          <div style={styles.tabsGridContainer}>
            {gridCols === 4 ? (
              <>
                {/* 4-col: row of 4, then centered row of 3 */}
                <div style={gridRowStyle(4)}>
                  {tabs.slice(0, 4).map((tab) => (
                    <TabButton
                      key={tab.key}
                      tab={tab}
                      selectedTab={selectedTab}
                      setSelectedTab={setSelectedTab}
                      isMobile
                    />
                  ))}
                </div>
                <div style={centeredRowStyle(4)}>
                  <div style={emptyCell} />
                  {tabs.slice(4, 7).map((tab) => (
                    <TabButton
                      key={tab.key}
                      tab={tab}
                      selectedTab={selectedTab}
                      setSelectedTab={setSelectedTab}
                      isMobile
                    />
                  ))}
                </div>
              </>
            ) : (
              <>
                {/* 3-col: row of 3, row of 3, then centered row of 1 */}
                <div style={gridRowStyle(3)}>
                  {tabs.slice(0, 3).map((tab) => (
                    <TabButton
                      key={tab.key}
                      tab={tab}
                      selectedTab={selectedTab}
                      setSelectedTab={setSelectedTab}
                      isMobile
                    />
                  ))}
                </div>
                <div style={gridRowStyle(3)}>
                  {tabs.slice(3, 6).map((tab) => (
                    <TabButton
                      key={tab.key}
                      tab={tab}
                      selectedTab={selectedTab}
                      setSelectedTab={setSelectedTab}
                      isMobile
                    />
                  ))}
                </div>
                <div style={centeredRowStyle(3)}>
                  <div style={emptyCell} />
                  <TabButton
                    tab={tabs[6]}
                    selectedTab={selectedTab}
                    setSelectedTab={setSelectedTab}
                    isMobile
                  />
                  <div style={emptyCell} />
                </div>
              </>
            )}
          </div>
        ) : (
          // DESKTOP (centered row)
          <div style={styles.tabsScrollContainer}>
            {tabs.map((tab) => (
              <TabButton
                key={tab.key}
                tab={tab}
                selectedTab={selectedTab}
                setSelectedTab={setSelectedTab}
              />
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .tab-item {
          transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        .tab-item:hover {
          transform: translateY(-2px) scale(1.02);
        }
        @keyframes pulseGlow {
          0% { box-shadow: 0 0 0 0 rgba(139, 92, 246, 0.4); }
          70% { box-shadow: 0 0 0 6px rgba(139, 92, 246, 0); }
          100% { box-shadow: 0 0 0 0 rgba(139, 92, 246, 0); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%) skewX(-15deg); }
          100% { transform: translateX(200%) skewX(-15deg); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-1px); }
        }
        @keyframes bounce {
          0%,20%,50%,80%,100% { transform: translateY(0); }
          40% { transform: translateY(-2px); }
          60% { transform: translateY(-1px); }
        }
        @media (max-width: 768px) {
          .tab-item:hover { transform: none; }
          .tab-item:active { transform: scale(0.95); transition: transform 0.1s ease; }
        }
      `}</style>
    </div>
  );
}

// Separate component for tab button
function TabButton({ tab, selectedTab, setSelectedTab, isMobile }) {
  return (
    <div
      style={{
        ...styles.tabItem,
        ...(selectedTab === tab.key ? styles.tabItemActive : {}),
        ...(isMobile ? styles.tabItemMobile : {}),
      }}
      onClick={() => setSelectedTab(tab.key)}
      className="tab-item"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setSelectedTab(tab.key)}
    >
      <div style={styles.tabContent}>
        <div style={{ ...styles.tabIcon, ...(isMobile ? styles.tabIconMobile : {}) }}>
          {tab.icon}
        </div>
        <div style={{ ...styles.tabLabel, ...(isMobile ? styles.tabLabelMobile : {}) }}>
          {isMobile ? tab.shortLabel : tab.label}
        </div>
      </div>

      {/* Active indicator */}
      {selectedTab === tab.key && (
        <>
          <div style={styles.activeGlow} />
          <div style={styles.activePulse} />
          <div style={styles.activeDot} />
        </>
      )}
    </div>
  );
}

const styles = {
  navWrapper: {
    position: "relative",
    padding: "15px 12px 8px 12px",
    zIndex: 10,
  },
  navContainer: {
    width: "100%",
    background: "rgba(255, 255, 255, 0.03)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "16px",
    boxShadow: "0 12px 30px rgba(0, 0, 0, 0.3)",
    overflow: "hidden",
  },

  // Desktop centered layout
  tabsScrollContainer: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    padding: "12px 12px",
    overflowX: "hidden",
  },

  // Mobile container
  tabsGridContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    padding: "12px 10px",
  },

  tabItem: {
    position: "relative",
    background: "rgba(255, 255, 255, 0.05)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "12px",
    padding: "12px 16px",
    cursor: "pointer",
    overflow: "hidden",
    transition: "all 0.3s ease",
    minWidth: "110px",
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "52px",
  },
  tabItemMobile: {
    minWidth: "auto",
    width: "100%",
    padding: "10px 6px",
    minHeight: "60px",
    borderRadius: "10px",
  },

  tabItemActive: {
    background: "rgba(139, 92, 246, 0.15)",
    border: "1px solid rgba(139, 92, 246, 0.5)",
    boxShadow: "0 6px 20px rgba(139, 92, 246, 0.2)",
    animation: "pulseGlow 3s ease-in-out infinite",
  },

  tabContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "6px",
    zIndex: 2,
    position: "relative",
    width: "100%",
  },
  tabIcon: {
    fontSize: "16px",
    width: "28px",
    height: "28px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(139, 92, 246, 0.1)",
    borderRadius: "8px",
    flexShrink: 0,
    animation: "float 3s ease-in-out infinite",
  },
  tabIconMobile: {
    width: "22px",
    height: "22px",
    fontSize: "13px",
  },
  tabLabel: {
    fontSize: "13px",
    fontWeight: 600,
    color: "rgba(255, 255, 255, 0.95)",
    background: "linear-gradient(135deg, #fff, #a5b4fc)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    whiteSpace: "nowrap",
    textAlign: "center",
  },
  tabLabelMobile: {
    fontSize: "10px",
    lineHeight: 1.2,
    whiteSpace: "normal",
    wordWrap: "break-word",
    maxWidth: "100%",
  },

  activeGlow: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(59, 130, 246, 0.1))",
    borderRadius: "12px",
    zIndex: 1,
    pointerEvents: "none", // don't block taps
  },
  activePulse: {
    position: "absolute",
    top: 0,
    left: "-100%",
    width: "50%",
    height: "100%",
    background:
      "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)",
    animation: "shimmer 3s ease-in-out infinite",
    zIndex: 1,
    pointerEvents: "none", // don't block taps
  },
  activeDot: {
    position: "absolute",
    top: "6px",
    right: "6px",
    width: "6px",
    height: "6px",
    background: "#10b981",
    borderRadius: "50%",
    animation: "bounce 2s ease-in-out infinite",
    zIndex: 2,
    pointerEvents: "none",
  },
};
