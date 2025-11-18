// components/TabsNav.jsx - FINAL VERSION WITH PROFILE + SETTINGS + LOGOUT
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

  // ⭐ ADDED PROFILE + SETTINGS TABS
  const tabs = [
    { key: "tokenInfo", label: "Token Info", shortLabel: "Token", icon: "🪙" },
    { key: "instructions", label: "Instructions", shortLabel: "Guide", icon: "📚" },
    { key: "investMine", label: "Invest & Mine", shortLabel: "Invest", icon: "💎" },
    { key: "referralBonus", label: "Referral Bonus", shortLabel: "Referral", icon: "👥" },
    { key: "earnings", label: "Earnings", shortLabel: "Earn", icon: "📊" },
    { key: "contact", label: "Contact", shortLabel: "Contact", icon: "💬" },
    { key: "about", label: "About", shortLabel: "About", icon: "🌟" },

    // ⭐ ADDED NEW TABS
    { key: "profile", label: "Profile", shortLabel: "Profile", icon: "👤" },
    { key: "settings", label: "Settings", shortLabel: "Settings", icon: "⚙️" },
  ];

  // ⭐ SPECIAL LOGOUT BUTTON (not part of tabs)
  const logoutButton = {
    key: "logout",
    label: "Logout",
    shortLabel: "Exit",
    icon: "🚪",
  };

  const gridRowStyle = (cols) => ({
    display: "grid",
    gridTemplateColumns: `repeat(${cols}, 1fr)`,
    gap: "6px",
    alignItems: "stretch",
  });

  const emptyCell = {};

  return (
    <div style={styles.navWrapper}>
      <div style={styles.navContainer}>
        {isMobile ? (
          // ⭐ MOBILE VERSION (UNCHANGED, JUST ADDED PROFILE + SETTINGS)
          <div style={styles.tabsGridContainer}>
            {gridCols === 4 ? (
              <>
                <div style={gridRowStyle(4)}>
                  {tabs.slice(0, 4).map((tab) => (
                    <TabButton
                      key={tab.key}
                      tab={tab}
                      isMobile
                      selectedTab={selectedTab}
                      setSelectedTab={setSelectedTab}
                    />
                  ))}
                </div>

                <div style={gridRowStyle(4)}>
                  {tabs.slice(4, 8).map((tab) => (
                    <TabButton
                      key={tab.key}
                      tab={tab}
                      isMobile
                      selectedTab={selectedTab}
                      setSelectedTab={setSelectedTab}
                    />
                  ))}
                </div>

                <div style={gridRowStyle(4)}>
                  {tabs.slice(8, 9).map((tab) => (
                    <TabButton
                      key={tab.key}
                      tab={tab}
                      isMobile
                      selectedTab={selectedTab}
                      setSelectedTab={setSelectedTab}
                    />
                  ))}

                  {/* LOGOUT on bottom row mobile */}
                  <TabButton
                    tab={logoutButton}
                    isMobile
                    selectedTab={selectedTab}
                    setSelectedTab={() => onLogout()}
                  />
                </div>
              </>
            ) : (
              // 3-COLUMN VERSION
              <>
                <div style={gridRowStyle(3)}>
                  {tabs.slice(0, 3).map((tab) => (
                    <TabButton
                      key={tab.key}
                      tab={tab}
                      isMobile
                      selectedTab={selectedTab}
                      setSelectedTab={setSelectedTab}
                    />
                  ))}
                </div>

                <div style={gridRowStyle(3)}>
                  {tabs.slice(3, 6).map((tab) => (
                    <TabButton
                      key={tab.key}
                      tab={tab}
                      isMobile
                      selectedTab={selectedTab}
                      setSelectedTab={setSelectedTab}
                    />
                  ))}
                </div>

                <div style={gridRowStyle(3)}>
                  {tabs.slice(6, 9).map((tab) => (
                    <TabButton
                      key={tab.key}
                      tab={tab}
                      isMobile
                      selectedTab={selectedTab}
                      setSelectedTab={setSelectedTab}
                    />
                  ))}

                  <TabButton
                    tab={logoutButton}
                    isMobile
                    selectedTab={selectedTab}
                    setSelectedTab={() => onLogout()}
                  />
                </div>
              </>
            )}
          </div>
        ) : (
          // ⭐ DESKTOP VERSION — CLEAN, CENTERED + LOGOUT TO THE RIGHT
          <div style={styles.tabsScrollContainer}>
            {/* Left tabs */}
            <div style={styles.leftTabs}>
              {tabs.map((tab) => (
                <TabButton
                  key={tab.key}
                  tab={tab}
                  selectedTab={selectedTab}
                  setSelectedTab={setSelectedTab}
                />
              ))}
            </div>

            {/* Right side logout button */}
            <div style={styles.rightLogout}>
              <TabButton
                tab={logoutButton}
                selectedTab={"logout"}
                setSelectedTab={() => onLogout()}
              />
            </div>
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
          }
        }
      `}</style>
    </div>
  );
}

/* ⭐ TAB BUTTON */
function TabButton({ tab, selectedTab, setSelectedTab, isMobile }) {
  return (
    <div
      className="tab-item"
      onClick={() => setSelectedTab(tab.key)}
      style={{
        ...styles.tabItem,
        ...(selectedTab === tab.key ? styles.tabItemActive : {}),
        ...(isMobile ? styles.tabItemMobile : {}),
      }}
    >
      <div style={styles.tabContent}>
        <div style={{ ...styles.tabIcon, ...(isMobile ? styles.tabIconMobile : {}) }}>
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
        <div style={styles.activePulse} />
      )}
    </div>
  );
}

/* ⭐ STYLES */
const styles = {
  navWrapper: {
    position: "relative",
    padding: "12px 10px 6px 10px",
    zIndex: 10,
  },

  navContainer: {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "16px",
    backdropFilter: "blur(16px)",
    overflow: "hidden",
  },

  tabsGridContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    padding: "12px 8px",
  },

  tabsScrollContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px",
    gap: "10px",
  },

  leftTabs: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
  },

  rightLogout: {
    display: "flex",
    justifyContent: "flex-end",
  },

  tabItem: {
    background: "rgba(255,255,255,0.05)",
    padding: "12px 14px",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.08)",
    minWidth: "110px",
    cursor: "pointer",
    position: "relative",
  },

  tabItemMobile: {
    width: "100%",
    padding: "10px",
  },

  tabItemActive: {
    background: "rgba(139,92,246,0.18)",
    boxShadow: "0 4px 14px rgba(139,92,246,0.3)",
    border: "1px solid rgba(139,92,246,0.45)",
  },

  tabContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "6px",
  },

  tabIcon: {
    fontSize: "18px",
    width: "30px",
    height: "30px",
    background: "rgba(139,92,246,0.12)",
    borderRadius: "8px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  tabIconMobile: {
    width: "24px",
    height: "24px",
    fontSize: "16px",
  },

  tabLabel: {
    fontSize: "13px",
    fontWeight: 600,
  },

  tabLabelMobile: {
    fontSize: "10px",
  },

  activePulse: {
    position: "absolute",
    top: 0,
    left: "-100%",
    width: "60%",
    height: "100%",
    background:
      "linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)",
    animation: "shimmer 2.6s infinite",
  },
};
