// components/TabsNav.jsx - FIXED + PROFILE/SETTINGS ROW ADDED
import { useState, useEffect } from "react";

export default function TabsNav({ selectedTab, setSelectedTab, onLogout }) {
  const [isMobile, setIsMobile] = useState(false);
  const [gridCols, setGridCols] = useState(4);

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      setIsMobile(w <= 768);
      setGridCols(w <= 480 ? 3 : 4);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 🔥 Your original tabs — NOT modified
  const tabs = [
    { key: "tokenInfo", label: "Token Info", shortLabel: "Token", icon: "🪙" },
    { key: "instructions", label: "Instructions", shortLabel: "Guide", icon: "📚" },
    { key: "investMine", label: "Invest & Mine", shortLabel: "Invest", icon: "💎" },
    { key: "referralBonus", label: "Referral Bonus", shortLabel: "Referral", icon: "👥" },
    { key: "earnings", label: "Earnings", shortLabel: "Earnings", icon: "📊" },
    { key: "contact", label: "Contact", shortLabel: "Contact", icon: "💬" },
    { key: "about", label: "About", shortLabel: "About", icon: "🌟" },
  ];

  const gridRowStyle = (cols) => ({
    display: "grid",
    gridTemplateColumns: `repeat(${cols},1fr)`,
    gap: "6px",
  });

  const centeredRowStyle = (cols) => ({
    display: "grid",
    gridTemplateColumns: `repeat(${cols},1fr)`,
    gap: "6px",
  });

  const emptyCell = {};

  return (
    <div style={styles.navWrapper}>
      
      {/* ⭐ NEW ROW ABOVE — Profile, Settings, Logout */}
      <div style={styles.accountRow}>
        <div
          style={styles.accountBtn}
          onClick={() => setSelectedTab("settings")}
        >
          ⚙ Settings
        </div>

        <div
          style={styles.accountBtn}
          onClick={() => setSelectedTab("profile")}
        >
          👤 Profile
        </div>

        <div
          style={styles.accountBtn}
          onClick={onLogout}
        >
          🚪 Logout
        </div>
      </div>

      {/* ⭐ ORIGINAL NAV BELOW — NOT TOUCHED */}
      <div style={styles.navContainer}>
        {isMobile ? (
          <div style={styles.tabsGridContainer}>
            {gridCols === 4 ? (
              <>
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
          transition: all 0.35s ease;
        }
        .tab-item:hover {
          transform: translateY(-2px) scale(1.02);
        }

        @media (max-width: 768px) {
          .tab-item:hover {
            transform: none !important;
          }
          .tab-item:active {
            transform: scale(0.96);
            transition: transform 0.1s ease;
          }
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  );
}
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
    >
      <div style={styles.tabContent}>
        <div
          style={{
            ...styles.tabIcon,
            ...(isMobile ? styles.tabIconMobile : {}),
          }}
        >
          {tab.icon}
        </div>

        <div
          style={{
            ...styles.tabLabel,
            ...(isMobile ? styles.tabLabelMobile : {}),
          }}
        >
          {isMobile ? tab.shortLabel : tab.label}
        </div>
      </div>

      {selectedTab === tab.key && (
        <>
          <div style={styles.activeGlow} />
          <div style={styles.activePulse} />
        </>
      )}
    </div>
  );
}

const styles = {
  navWrapper: {
    position: "relative",
    padding: "12px 10px 10px 10px",
    zIndex: 10,
  },

  /* ⭐ NEW ACCOUNT ROW */
  accountRow: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    marginBottom: "14px",
  },

  accountBtn: {
    padding: "10px 16px",
    borderRadius: "12px",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.12)",
    color: "white",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: 600,
    backdropFilter: "blur(12px)",
  },

  navContainer: {
    width: "100%",
    background: "rgba(255, 255, 255, 0.03)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "16px",
    boxShadow: "0 10px 28px rgba(0,0,0,0.25)",
    overflow: "hidden",
  },

  tabsScrollContainer: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "8px",
    padding: "14px 12px",
  },

  tabsGridContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    padding: "12px 8px",
  },

  tabItem: {
    position: "relative",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "12px",
    padding: "12px 14px",
    cursor: "pointer",
    minWidth: "110px",
    minHeight: "52px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.3s ease",
  },

  tabItemMobile: {
    width: "100%",
    padding: "10px 8px",
    minHeight: "58px",
  },

  tabItemActive: {
    background: "rgba(139,92,246,0.18)",
    border: "1px solid rgba(139,92,246,0.45)",
    boxShadow: "0 4px 18px rgba(139,92,246,0.3)",
  },

  tabContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "6px",
    position: "relative",
    zIndex: 2,
  },

  tabIcon: {
    fontSize: "18px",
    width: "30px",
    height: "30px",
    background: "rgba(139,92,246,0.12)",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  tabIconMobile: {
    width: "24px",
    height: "24px",
    fontSize: "15px",
  },

  tabLabel: {
    fontSize: "13px",
    fontWeight: 600,
    color: "white",
    opacity: 0.95,
    textAlign: "center",
  },

  tabLabelMobile: {
    fontSize: "10px",
    lineHeight: 1.2,
  },

  activeGlow: {
    position: "absolute",
    inset: 0,
    background: "rgba(139,92,246,0.15)",
    borderRadius: "12px",
  },

  activePulse: {
    position: "absolute",
    top: 0,
    left: "-100%",
    width: "60%",
    height: "100%",
    background:
      "linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)",
    animation: "shimmer 2.8s ease-in-out infinite",
  },
};
