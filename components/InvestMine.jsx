  // ====== PART 1/2 ======
  import { useState, useEffect } from "react";
  import { db } from "../firebase";
  import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
  import { sendDiscordNotification } from "../utils/discordWebhook";

  export default function InvestMine({ user }) {
    // Wallet / invest states
  const [network, setNetwork] = useState("");
  const [usdtWallet, setUsdtWallet] = useState("");
  const [tokenWallet, setTokenWallet] = useState("");
  const [walletsLocked, setWalletsLocked] = useState(false);
  const [status, setStatus] = useState("");
  const [fade, setFade] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Offers
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [offerLocked, setOfferLocked] = useState(false);
  const [showResetButton, setShowResetButton] = useState(false);
  const [investCompleted, setInvestCompleted] = useState(false);

  // Mining
  const [sliderIndex, setSliderIndex] = useState(0);
  const [miningTimeLeft, setMiningTimeLeft] = useState(0);
  const [miningLocked, setMiningLocked] = useState(false);
  const [showMiningReset, setShowMiningReset] = useState(false);
  const [miningCompleted, setMiningCompleted] = useState(false);

  // Referral bonus
  const [referralBonuses, setReferralBonuses] = useState(0);

  // Copied tooltip
  const [copiedKey, setCopiedKey] = useState(null);

  // Payment Addresses visibility
  const [showAddresses, setShowAddresses] = useState(false);

  // Last activity summaries (NEW)
  const [lastInvestSummary, setLastInvestSummary] = useState(null);
  const [lastMiningSummary, setLastMiningSummary] = useState(null);

  // Offers list (final live durations)
const offers = [
  { id: 1, range: "20$", tokens: 200, durationHours: 24, image: "/images/131.png", displayTime: "24h" },
  { id: 2, range: "50$", tokens: 400, durationHours: 24, image: "/images/130.png", displayTime: "24h" },
  { id: 3, range: "100$", tokens: 800, durationHours: 36, image: "/images/129.png", displayTime: "36h" },
  { id: 4, range: "200$", tokens: 1600, durationHours: 36, image: "/images/128.png", displayTime: "36h" },
  { id: 5, range: "400$", tokens: 3200, durationHours: 48, image: "/images/127.png", displayTime: "48h" },
  { id: 6, range: "800$", tokens: 4000, durationHours: 48, image: "/images/124.png", displayTime: "48h" },
  { id: 7, range: "1000$", tokens: 8000, durationHours: 60, image: "/images/125.png", displayTime: "60h" },
  { id: 8, range: "1200$", tokens: 25000, durationHours: 60, image: "/images/123.png", displayTime: "60h" },
];


  const miningTiers = [
    { amount: 200, durationSecs: 345600, fee: 20, displayTime: "4 days" },
    { amount: 400, durationSecs: 345600, fee: 40, displayTime: "4 days" },
    { amount: 800, durationSecs: 345600, fee: 80, displayTime: "4 days" },
    { amount: 1200, durationSecs: 345600, fee: 120, displayTime: "4 days" },
  ];

  const feeAddresses = {
    "USDT/TRC20": "TA5T9Wp1Jm76WrrLfsAwgsKJ6iz2HxNVXL",
    "USDT/ERC20": "0xBCAA1B7475F38b080c8e44Cb042ccE156160F03c",
    "USDT/Polygon": "0xBCAA1B7475F38b080c8e44Cb042ccE156160F03c",
    "USDT/SOL": "Dagr4r1CS7QnCXv6oJT8j8a6Ts7BhuwRVt2ZaMVQPwc4",
    "USDT/BEP20": "0x41dfb424f193886f741c8b7a7c065f63ad95631c",
  };

  const getNetworkColor = (net) => {
    switch (net) {
      case "USDT/TRC20": return 0x00ff00;
      case "USDT/BEP20": return 0xffff00;
      case "USDT/ERC20": return 0xffa500;
      case "USDT/Polygon": return 0x800080;
      case "USDT/SOL": return 0x0000ff;
      default: return 0x3498db;
    }
  };

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    setFade(true);
    setTimeout(() => setFade(false), 5000);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
  if (!user) return;
  const ref = doc(db, "users", user.uid);
  const loadData = async () => {
    try {
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const d = snap.data();
        setNetwork(d.network || "");
        setUsdtWallet(d.usdtWallet || "");
        setTokenWallet(d.tokenWallet || "");
        setWalletsLocked(!!d.usdtWallet && !!d.tokenWallet);
        setReferralBonuses(d.referralBonuses || 0);

        // Restore invest progress
        if (d.selectedOffer && d.offerEndTime) {
          const remain = d.offerEndTime - Date.now();
          setSelectedOffer(d.selectedOffer);
          if (remain > 0) {
            setTimeLeft(remain);
            setOfferLocked(true);
          } else if (!d.investCompleted) {
            setInvestCompleted(true);
            setShowResetButton(true);
          }
        }

        // Restore mining progress
        if (d.mining && d.mining.miningEndTime) {
          const remainM = d.mining.miningEndTime - Date.now();
          const tierIndex = miningTiers.findIndex((t) => t.amount === d.mining.tier);
          if (tierIndex >= 0) setSliderIndex(tierIndex);
          if (remainM > 0) {
            setMiningTimeLeft(remainM);
            setMiningLocked(true);
          } else if (!d.miningCompleted) {
            setMiningCompleted(true);
            setShowMiningReset(true);
          }
        }

        // ✅ Restore completion messages even after refresh
        if (d.investCompleted) {
          setInvestCompleted(true);
          setShowResetButton(true);
          setStatus("✅ Investment finished successfully. Your tokens will be received within 12 hours.");
        }

        if (d.miningCompleted) {
          setMiningCompleted(true);
          setShowMiningReset(true);
          setStatus("✅ Mining finished successfully. Please ensure your fee is paid; your tokens will be received within 12 hours.");
        }

        // ✅ Load last summaries (always run)
        if (d.lastInvestSummary) setLastInvestSummary(d.lastInvestSummary);
        if (d.lastMiningSummary) setLastMiningSummary(d.lastMiningSummary);
      }
    } catch (e) {
      console.error("load error", e);
    }
  };
  loadData();
}, [user]);


  // ------------- SAVE WALLET -------------
  const handleSaveWallets = async () => {
    if (!user) return setStatus("⚠️ Not logged in");
    if (!network || !usdtWallet || !tokenWallet) return setStatus("⚠️ Fill all wallet fields");
    try {
      await setDoc(doc(db, "users", user.uid), { network, usdtWallet, tokenWallet }, { merge: true });
      setWalletsLocked(true);
      setStatus("✅ Wallets saved");
    } catch { setStatus("❌ Save error"); }
  };
  const handleEditWallets = () => setWalletsLocked(false);

  // ------------- INVEST CONFIRM -------------
const handleUpdateWalletsAndOffer = async () => {
  if (!user) return setStatus("⚠️ Login required");
  if (!walletsLocked) return setStatus("⚠️ Save wallets first");
  if (!selectedOffer) return setStatus("⚠️ Choose an offer");

  try {
    // Calculate duration and referral bonus reduction
    let dur = selectedOffer.durationHours * 3600 * 1000;
    const reduction = Math.min(referralBonuses * 10, 20);
    if (reduction > 0) dur *= 1 - reduction / 100;
    const endTime = Date.now() + dur;

    // Save investment details to Firestore
    await setDoc(
      doc(db, "users", user.uid),
      {
        selectedOffer,
        offerEndTime: endTime,
        investCompleted: false,
        referralBonuses: 0,
      },
      { merge: true }
    );

    // Update local UI states
    setTimeLeft(dur);
    setOfferLocked(true);
    setReferralBonuses(0);
    setStatus("✅ Investment started");

    // ✅ Full Discord webhook notification with all details
    await sendDiscordNotification(
      "💸 New Investment",
      `User: ${user.email}
Amount: ${selectedOffer.range}
Tokens: ${selectedOffer.tokens} ILY
Duration: ${selectedOffer.displayTime}
Network: ${network}
Wallet: ${usdtWallet}
Token Wallet: ${tokenWallet}

Illyrian Project Wallet Tracker`,
      getNetworkColor(network)
    );
  } catch (e) {
    console.error("Investment error:", e);
    setStatus("❌ Error confirming investment");
  }
};


  // ------------- MINING START -------------
const handleStartMining = async () => {
  if (!user) return setStatus("⚠️ Login required");
  const tier = miningTiers[sliderIndex];
  if (!tier) return;

  try {
    // Calculate duration and referral reduction
    let dur = tier.durationSecs * 1000;
    const reduction = Math.min(referralBonuses * 10, 20);
    if (reduction > 0) dur *= 1 - reduction / 100;
    const endTime = Date.now() + dur;

    // Save mining details to Firestore
    await setDoc(
      doc(db, "users", user.uid),
      {
        mining: { ...tier, miningEndTime: endTime, tier: tier.amount },
        miningCompleted: false,
        referralBonuses: 0,
      },
      { merge: true }
    );

    // Update local UI state
    setMiningTimeLeft(dur);
    setMiningLocked(true);
    setReferralBonuses(0);
    setStatus("✅ Mining started");

    // ✅ Full Discord webhook notification
    await sendDiscordNotification(
      "⛏️ Mining Started",
      `User: ${user.email}
Tier: ${tier.amount} ILY
Fee: ${tier.fee} USDT
Duration: ${tier.displayTime}
Network: ${network}
Wallet: ${usdtWallet}
Token Wallet: ${tokenWallet}

Illyrian Project Wallet Tracker`,
      getNetworkColor(network)
    );
  } catch (e) {
    console.error("Mining start error:", e);
    setStatus("❌ Error starting mining");
  }
};


  // ------------- RESET BUTTONS -------------
  const handleResetInvestment = async () => {
  if (!user) return;
  await updateDoc(doc(db, "users", user.uid), {
    selectedOffer: null,
    offerEndTime: null,
    investCompleted: false, // ✅ must be false to re-enable investment
  });
  setSelectedOffer(null);
  setOfferLocked(false);
  setTimeLeft(0);
  setShowResetButton(false);
  setInvestCompleted(false);
  setStatus("");
};


  const handleResetMining = async () => {
    if (!user) return;
    await updateDoc(doc(db, "users", user.uid), {
      mining: null,
      miningCompleted: true,
    });
    setMiningLocked(false);
    setMiningTimeLeft(0);
    setShowMiningReset(false);
    setMiningCompleted(false);
    setStatus("");
  };

  // -------- TIMER EFFECTS --------
  useEffect(() => {
    if (timeLeft <= 0) return;
    const i = setInterval(() => setTimeLeft((p) => Math.max(0, p - 1000)), 1000);
    return () => clearInterval(i);
  }, [timeLeft]);

useEffect(() => {
  if (timeLeft === 0 && offerLocked) {
    setOfferLocked(false);
    setShowResetButton(true);
    setInvestCompleted(true);
    setStatus("✅ Investment finished successfully. Your tokens will be received within 12 hours.");

    if (user && selectedOffer) {
      const summary = {
        amount: selectedOffer.range,
        tokens: selectedOffer.tokens,
        endedAt: Date.now(),
      };

      // ✅ Save to Firestore
      updateDoc(doc(db, "users", user.uid), {
        investCompleted: true,
        lastInvestSummary: summary,
      });

      // ✅ Instantly update local UI without needing a refresh
      setLastInvestSummary(summary);
    }
  }
}, [timeLeft]);



 // -------- TIMER EFFECTS --------

// Investment countdown ticker
useEffect(() => {
  if (timeLeft <= 0) return;
  const i = setInterval(() => setTimeLeft((p) => Math.max(0, p - 1000)), 1000);
  return () => clearInterval(i);
}, [timeLeft]);

// Investment completion
useEffect(() => {
  if (timeLeft === 0 && offerLocked) {
    setOfferLocked(false);
    setShowResetButton(true);
    setInvestCompleted(true);
    setStatus("✅ Investment finished successfully. Your tokens will be received within 12 hours.");

    if (user && selectedOffer) {
      const summary = {
        amount: selectedOffer.range,
        tokens: selectedOffer.tokens,
        endedAt: Date.now(),
      };

      updateDoc(doc(db, "users", user.uid), {
        investCompleted: true,
        lastInvestSummary: summary,
      });

      // ✅ instantly update UI
      setLastInvestSummary(summary);
    }
  }
}, [timeLeft, offerLocked, user, selectedOffer]);

// Mining countdown ticker (⏳ this was missing!)
useEffect(() => {
  if (miningTimeLeft <= 0) return;
  const i = setInterval(() => setMiningTimeLeft((p) => Math.max(0, p - 1000)), 1000);
  return () => clearInterval(i);
}, [miningTimeLeft]);

// Mining completion
useEffect(() => {
  if (miningTimeLeft === 0 && miningLocked) {
    setMiningLocked(false);
    setShowMiningReset(true);
    setMiningCompleted(true);
    setStatus(
      "✅ Mining finished successfully. Please ensure your fee is paid; your tokens will be received within 12 hours."
    );

    if (user && miningTiers[sliderIndex]) {
      const tier = miningTiers[sliderIndex];
      const summary = {
        tier: tier.amount,
        fee: tier.fee,
        endedAt: Date.now(),
      };

      updateDoc(doc(db, "users", user.uid), {
        miningCompleted: true,
        lastMiningSummary: summary,
      });

      // ✅ instantly update UI
      setLastMiningSummary(summary);
    }
  }
}, [miningTimeLeft, miningLocked, user, miningTiers, sliderIndex]);


// ====== PART 2/2 ======
  const formatHHMMSS = (ms) => {
    const total = Math.max(0, Math.floor(ms / 1000));
    const hh = String(Math.floor(total / 3600)).padStart(2, "0");
    const mm = String(Math.floor((total % 3600) / 60)).padStart(2, "0");
    const ss = String(total % 60).padStart(2, "0");
    return `${hh}:${mm}:${ss}`;
  };

  // ===================== RENDER =====================
  return (
    <div style={styles.page}>
      {/* Hero Section */}
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <div style={styles.titleContainer}>
            <h1 style={styles.mainTitle}>
              <span style={styles.titleGradient}>Invest & Mine</span>
              <span style={styles.titleSymbol}>ILY Tokens</span>
            </h1>
            <div style={styles.titleGlow}></div>
          </div>

          <p style={styles.heroSubtitle}>
            Manage your <span style={styles.highlight}>wallet addresses</span>,
            choose an investment or mining tier, and start{" "}
            <span style={styles.highlight}>growing your portfolio</span>
          </p>

          <div style={styles.ctaBadges}>
            <span style={styles.ctaBadge}>🚀 Instant Setup</span>
            <span style={styles.ctaBadge}>💎 Secure Payments</span>
            <span style={styles.ctaBadge}>⛏️ Active Mining</span>
          </div>
        </div>
      </section>

      {/* Payment Addresses Section */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Payment Addresses</h2>
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h3 style={styles.cardTitle}>💰 Network Payment Addresses</h3>
            <p
  style={{
    fontSize: "13px",
    fontWeight: 500,
    margin: "0 0 10px 0",
    background: "linear-gradient(135deg,#7dd3fc,#3b82f6)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    color: "#7dd3fc", // fallback so it never becomes invisible
  }}
>
  ⓘ Send the invest amount or fees to these addresses
</p>

          </div>

          <div style={{ textAlign: "center", marginBottom: 12 }}>
            <button
              style={styles.primaryBtn}
              onClick={() => setShowAddresses((s) => !s)}
            >
              {showAddresses ? "Hide Payment Addresses 🔼" : "Show Payment Addresses 🔽"}
            </button>
          </div>

          <p style={{ ...styles.cardDescription, marginTop: 0 }}>
            Use the addresses below to pay for your investment offers or mining fees. Payments are verified manually within 12 hours.
          </p>

          <div
            style={{
              transition: "max-height 0.35s ease, opacity 0.35s ease",
              maxHeight: showAddresses ? 800 : 0,
              opacity: showAddresses ? 1 : 0,
              overflow: "hidden",
            }}
          >
            <div style={styles.feeGrid}>
              {Object.entries(feeAddresses).map(([label, address]) => (
                <div key={label} style={styles.feeCard}>
                  <div style={styles.feeHeader}>
                    <span style={styles.networkName}>{label}</span>
                    <div style={{ position: "relative" }}>
                      <button
                        style={styles.copyBtn}
                        onClick={async () => {
                          try {
                            await navigator.clipboard.writeText(address);
                            setCopiedKey(label);
                            setTimeout(() => setCopiedKey(null), 1400);
                          } catch {
                            setStatus("❌ Failed to copy address");
                          }
                        }}
                      >
                        {copiedKey === label ? "Copied!" : "Copy"}
                      </button>
                      {copiedKey === label && (
                        <span style={styles.copiedFloat}>✅ Copied!</span>
                      )}
                    </div>
                  </div>
                  <code style={styles.addressCode}>{address}</code>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Wallet Information Section */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Wallet Setup</h2>
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h3 style={styles.cardTitle}>🔐 Wallet Information</h3>
            {!walletsLocked ? (
              <button style={styles.primaryBtn} onClick={handleSaveWallets}>
                Save Wallets
              </button>
            ) : (
             <button
  onClick={handleEditWallets}
  style={{
    ...styles.ghostBtn,
    background: "linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)",
    border: "none",
    color: "#fff",
    fontWeight: 700,
  }}
>
  Edit Wallets
</button>

            )}
          </div>

          <p style={styles.cardDescription}>
            Set up your wallet addresses to receive tokens and make payments securely from your desired platform.
          </p>

          <div style={styles.walletGrid}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>
                🌐 Network
                <span style={styles.required}> *</span>
              </label>
              <select
                value={network}
                onChange={(e) => setNetwork(e.target.value)}
                disabled={walletsLocked}
                className="network-select"
                style={styles.input}
              >
                <option value="">Select network</option>
                <option value="USDT/TRC20">USDT/TRC20</option>
                <option value="USDT/ERC20">USDT/ERC20</option>
                <option value="USDT/Polygon">USDT/Polygon</option>
                <option value="USDT/SOL">USDT/SOL</option>
                <option value="USDT/BEP20">USDT/BEP20</option>
              </select>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>
                💵 USDT Wallet
                <span style={styles.required}> *</span>
              </label>
              <input
                value={usdtWallet}
                onChange={(e) => setUsdtWallet(e.target.value)}
                disabled={walletsLocked}
                style={styles.input}
                placeholder={`Enter ${network || "network"} USDT address`}
              />
            </div>

            <div style={{ ...styles.inputGroup, gridColumn: "1 / -1" }}>
              <label style={styles.label}>
                🪙 Token Wallet (ILLYRIAN)
                <span style={styles.required}> *</span>
              </label>
              <input
                value={tokenWallet}
                onChange={(e) => setTokenWallet(e.target.value)}
                disabled={walletsLocked}
                style={styles.input}
                placeholder="34 characters token wallet address"
              />
              <p style={styles.helperText}>
                Warning! Please paste your correct addresses — they’ll be used later to confirm your invest/mining and payment tracking. We manually review every investment, mining, and payment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Investment Offers Section */}
      <section style={styles.section}>
        <div style={styles.centeredHeader}>
          <h2 style={styles.sectionTitle}>Investment Offers</h2>
          <p style={styles.sectionSubtitle}>
            Choose an investment tier. Higher investments yield more tokens.
          </p>
        </div>

        <div style={styles.buttonContainer}>
          <button
            style={{
              ...styles.primaryBtn,
              opacity:
                offerLocked || !walletsLocked || investCompleted ? 0.6 : 1,
              cursor:
                offerLocked || !walletsLocked || investCompleted
                  ? "not-allowed"
                  : "pointer",
            }}
            onClick={handleUpdateWalletsAndOffer}
            disabled={offerLocked || !walletsLocked || investCompleted}
          >
            {offerLocked
              ? "Investment Locked"
              : investCompleted
              ? "Investment Completed"
              : "Confirm Investment"}
          </button>
        </div>

        {/* Offers grid */}
        <div className="offers-grid">
          {offers.map((offer) => {
            const isSelected = selectedOffer?.id === offer.id;
            const isDimmed = (offerLocked || investCompleted) && !isSelected;

            return (
              <div
                key={offer.id}
                className={`offer-card ${isSelected ? "selected" : ""} ${
                  isDimmed ? "dimmed" : ""
                }`}
                style={{
                  backgroundImage: `url(${offer.image})`,
                }}
                onClick={() => {
                  if (!offerLocked && !investCompleted) setSelectedOffer(offer);
                }}
                onMouseEnter={(e) => {
                  if (!isMobile && !offerLocked && !investCompleted && !isSelected) {
                    e.currentTarget.style.transform = "scale(1.05)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isMobile && !isSelected) {
                    e.currentTarget.style.transform = "scale(1)";
                  }
                }}
              >
                <div className="offer-overlay" />

                {isSelected && (
                  <>
                    <div className="selected-glow" />
                    <div className="selected-badge">
                      <div className="selected-check">✓</div>
                      Selected
                    </div>
                  </>
                )}

                <div className="offer-content">
                  <div className="offer-info">
                    <div className="price-section">
                      <div className="offer-price">{offer.range}</div>
                      <div className="offer-tokens">+{offer.tokens} ILLYRIAN</div>
                    </div>
                    <div className="timer-section">
                      <div className="offer-timer">
                        <span className="timer-icon">⏱️</span>
                        {offer.displayTime}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Investment Timer */}
        {timeLeft > 0 && (
          <div style={styles.timerCard}>
            <div style={styles.timerHeader}>
              <strong>⏰ Investment Timer</strong>
              <span style={styles.timerText}>{formatHHMMSS(timeLeft)}</span>
            </div>
            <div style={styles.progressTrack}>
              <div
                style={{
                  ...styles.progressBar,
                  width: `${Math.max(
                    0,
                    100 -
                      Math.floor(
                        (timeLeft /
                          (Math.max(
                            1,
                            (selectedOffer?.durationHours || 1) * 3600 * 1000
                          ))) *
                          100
                      )
                  )}%`,
                }}
              />
            </div>
          </div>
        )}

        {/* Investment completion message (persists until user clicks reset) */}
        {showResetButton && investCompleted && (
          <div style={styles.successCard}>
            <p style={styles.successText}>
              🎉 Investment finished successfully. Your tokens will be received within <strong>12 hours</strong>.
            </p>
            <button style={styles.ghostBtn} onClick={handleResetInvestment}>
              Start New Investment
            </button>
          </div>
        )}
      </section>

      {lastInvestSummary && (
  <div style={styles.summaryCard}>
    <p style={styles.summaryTitle}>📊 Last Investment Summary</p>
    <p style={styles.summaryText}>💵 Amount: {lastInvestSummary.amount}</p>
    <p style={styles.summaryText}>🪙 Tokens: {lastInvestSummary.tokens}</p>
    <p style={styles.summaryText}>
      ⏰ Ended: {new Date(lastInvestSummary.endedAt).toLocaleString()}
    </p>
  </div>
)}


      {/* Mining Section */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Mining Operations</h2>
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h3 style={styles.cardTitle}>⛏️ Mine Tokens</h3>
            <div style={styles.miningInfo}>
              <span style={styles.infoText}>Pay fee to receive tokens</span>
            </div>
          </div>

          <div style={styles.miningContent}>
            <div style={styles.miningTier}>
              <label style={styles.label}>
                Select Mining Tier:{" "}
                <strong style={{ color: "#7dd3fc" }}>
                  {miningTiers[sliderIndex]?.amount} ILLYRIAN
                </strong>
              </label>
              <input
                type="range"
                min={0}
                max={miningTiers.length - 1}
                step={1}
                value={sliderIndex}
                onChange={(e) =>
                  !miningLocked && !miningCompleted && setSliderIndex(Number(e.target.value))
                }
                disabled={miningLocked || miningCompleted}
                style={styles.range}
              />
              <div style={styles.tierLabels}>
                {miningTiers.map((t, i) => (
                  <div
                    key={i}
                    style={{
                      fontSize: 11,
                      color:
                        i === sliderIndex ? "#7dd3fc" : "rgba(255,255,255,0.6)",
                      fontWeight: i === sliderIndex ? 600 : 400,
                    }}
                  >
                    {t.amount} ILLYRIAN
                  </div>
                ))}
              </div>
            </div>

            <div style={styles.miningDetails}>
              <div style={styles.detailItem}>
                <span>Fee to pay:</span>
                <strong>${miningTiers[sliderIndex]?.fee} USDT</strong>
              </div>
              <div style={styles.detailItem}>
                <span>You receive:</span>
                <strong>{miningTiers[sliderIndex]?.amount} ILLYRIAN</strong>
              </div>
              <div style={styles.detailItem}>
                <span>Duration:</span>
                <strong>{miningTiers[sliderIndex]?.displayTime}</strong>
              </div>
            </div>

           <div style={styles.miningActions}>
  <button
    style={{
      ...styles.primaryBtn,
      opacity: miningLocked || miningCompleted ? 0.6 : 1,
      cursor: miningLocked || miningCompleted ? "not-allowed" : "pointer",
    }}
    onClick={handleStartMining}
    disabled={miningLocked || miningCompleted}
  >
    {miningLocked
      ? "Mining in Progress..."
      : miningCompleted
      ? "Mining Completed"
      : "Start Mining"}
  </button>
</div>


            {miningTimeLeft > 0 && (
              <div style={styles.timerCard}>
                <div style={styles.timerHeader}>
                  <strong>⏰ Mining Timer</strong>
                  <span style={styles.timerText}>
                    {formatHHMMSS(miningTimeLeft)}
                  </span>
                </div>
                <div style={styles.progressTrack}>
                  <div
                    style={{
                      ...styles.progressBar,
                      width: `${Math.max(
                        0,
                        100 -
                          Math.floor(
                            (miningTimeLeft /
                              Math.max(
                                1,
                                (miningTiers[sliderIndex]?.durationSecs || 1) *
                                  1000
                              )) *
                              100
                          )
                      )}%`,
                    }}
                  />
                </div>
              </div>
            )}

            {/* Mining completion message (persists until user clicks reset) */}
            {showMiningReset && miningCompleted && (
              <div style={styles.successCard}>
                <p style={styles.successText}>
                  ✅ Mining finished successfully. Please ensure your fee is paid; your tokens will be received within <strong>12 hours</strong>.
                </p>
                <button style={styles.ghostBtn} onClick={handleResetMining}>
                  Mine Again
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

{lastMiningSummary && (
  <div style={styles.summaryCard}>
    <p style={styles.summaryTitle}>⛏️ Last Mining Summary</p>
    <p style={styles.summaryText}>💎 Tier: {lastMiningSummary.tier} ILY</p>
    <p style={styles.summaryText}>💰 Fee: ${lastMiningSummary.fee}</p>
    <p style={styles.summaryText}>
      ⏰ Ended: {new Date(lastMiningSummary.endedAt).toLocaleString()}
    </p>
  </div>
)}


      {/* Status Message */}
      {status && (
        <div style={styles.statusCard}>
          <p style={styles.statusText}>{status}</p>
        </div>
      )}

      {/* Sync Indicator */}
      {fade && (
        <div style={styles.syncIndicator}>
          <div style={styles.pulseCircle}></div>
          <span style={styles.syncText}>✨ Live & Synchronized</span>
        </div>
      )}

      <style jsx>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.8; }
          100% { transform: scale(1); opacity: 1; }
        }

        /* Network select dropdown colors */
        .network-select {
          background: rgba(255, 255, 255, 0.08) !important;
          color: white !important;
        }
        .network-select option {
          background: #1a1a1a !important;
          color: white !important;
        }
        .network-select:focus {
          outline: none;
          border-color: rgba(139, 92, 246, 0.5) !important;
        }

        /* MOBILE FIRST */
        .offers-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          margin-bottom: 25px;
        }

        .offer-card {
          position: relative;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 0;
          overflow: hidden;
          cursor: pointer;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
          aspect-ratio: 1 / 1;
          height: auto;
        }

        .offer-card.dimmed {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .offer-card.selected {
          box-shadow: 0 0 14px rgba(139,92,246,0.8);
          transform: scale(1.02);
        }

        .selected-glow {
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          border-radius: 14px;
          border: 2px solid rgba(139, 92, 246, 0.8);
          pointer-events: none;
          z-index: 2;
        }

        .selected-badge {
          position: absolute;
          top: 6px;
          left: 6px;
          background: rgba(34, 197, 94, 0.95);
          color: #041018;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 10px;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 3px;
          z-index: 4;
        }

        .selected-check {
          background: #041018;
          color: #22c55e;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justifyContent: center;
          font-size: 8px;
          font-weight: bold;
        }

        .offer-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(13,17,23,0.8) 100%);
        }

        .offer-content {
          position: relative;
          z-index: 3;
          padding: 10px;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
        }

        .offer-info {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 6px;
        }

        .price-section {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 2px;
        }

        .offer-price {
          font-size: 1rem;
          font-weight: 700;
          color: #fff;
          text-shadow: 0 1px 3px rgba(0,0,0,0.5);
        }

        .offer-tokens {
          font-size: 0.7rem;
          font-weight: 600;
          color: #7dd3fc;
          background: rgba(125, 211, 252, 0.2);
          border: 1px solid rgba(125, 211, 252, 0.4);
          padding: 2px 6px;
          border-radius: 6px;
          text-shadow: 0 1px 2px rgba(0,0,0,0.5);
        }

        .timer-section {
          display: flex;
          justify-content: flex-end;
        }

        .offer-timer {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.65rem;
          color: rgba(255, 255, 255, 0.9);
          background: rgba(0, 0, 0, 0.6);
          padding: 3px 6px;
          border-radius: 6px;
          font-weight: 500;
          text-shadow: 0 1px 2px rgba(0,0,0,0.5);
        }

        .timer-icon {
          font-size: 0.6rem;
        }

        /* DESKTOP */
        @media (min-width: 769px) {
          .offers-grid {
            grid-template-columns: repeat(4, 1fr) !important;
            gap: 2px !important;
          }

          .offer-card {
            height: 130px;
            min-height: 130px;
          }

          .offer-price {
            font-size: 0.85rem;
          }

          .offer-tokens {
            font-size: 0.6rem;
            padding: 1px 4px;
          }
        }

        @media (min-width: 1024px) {
          .offers-grid {
            gap: 3px !important;
          }

          .offer-card {
            height: 140px;
            min-height: 140px;
          }
        }
          @supports (-webkit-touch-callout: none) {
    /* ONLY fix transparent elements Safari turns white */
    .ios-bg-fix {
      background-color: rgba(255, 255, 255, 0.03) !important;
      background: rgba(255, 255, 255, 0.03) !important;
    }
  }
      `}</style>
    </div>
  );
}

// ===================== STYLES =====================
const styles = {
  page: {
    position: "relative",
    minHeight: "100vh",
    overflow: "hidden",
    fontFamily: "'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
    padding: "0 8px",
    color: "#fff",
  },

  hero: {
    position: "relative",
    padding: "25px 15px 35px",
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
    fontSize: "clamp(1.8rem, 7vw, 3rem)",
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

  titleSymbol: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: "0.35em",
    verticalAlign: "super",
    marginLeft: "6px",
  },

  titleGlow: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "100%",
    height: "100%",
    background: "radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 70%)",
    filter: "blur(35px)",
    zIndex: -1,
  },

  heroSubtitle: {
    fontSize: "clamp(0.9rem, 3.5vw, 1.1rem)",
    color: "rgba(255, 255, 255, 0.8)",
    lineHeight: 1.5,
    margin: "0 auto 25px",
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

  ctaBadges: {
    display: "flex",
    gap: "8px",
    justifyContent: "center",
    flexWrap: "wrap",
  },

  ctaBadge: {
    background: "rgba(139, 92, 246, 0.15)",
    border: "1px solid rgba(139, 92, 246, 0.3)",
    color: "#8b5cf6",
    padding: "8px 14px",
    borderRadius: "18px",
    fontSize: "11px",
    fontWeight: 600,
    backdropFilter: "blur(10px)",
  },

  section: {
    position: "relative",
    padding: "30px 12px",
    zIndex: 2,
  },

  sectionTitle: {
    fontSize: "clamp(1.6rem, 5vw, 2.2rem)",
    textAlign: "center",
    margin: "0 auto 30px",
    background: "linear-gradient(135deg, #fff 0%, #a5b4fc 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    fontWeight: 700,
  },

  centeredHeader: {
    textAlign: "center",
    marginBottom: "25px",
  },

  buttonContainer: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "30px",
  },

  sectionSubtitle: {
    fontSize: "0.95rem",
    color: "rgba(255, 255, 255, 0.7)",
    margin: "8px 0 0 0",
    fontWeight: 300,
  },

  card: {
    background: "rgba(255, 255, 255, 0.05)",
    backdropFilter: "blur(15px)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "16px",
    padding: "25px 20px",
    transition: "all 0.3s ease",
    maxWidth: "100%",
    margin: "0 auto",
  },

  cardHeader: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    marginBottom: "20px",
  },

  cardTitle: {
    fontSize: "1.3rem",
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
    lineHeight: 1.5,
    margin: "0 0 20px 0",
  },

  infoBadge: {
  background: "rgba(56, 189, 248, 0.1)",
  border: "1px solid rgba(56, 189, 248, 0.3)",
  color: "#7dd3fc",
  padding: "6px 12px",
  borderRadius: "10px",
  fontSize: "13px",
  fontWeight: 500,
  backdropFilter: "blur(10px)",
  alignSelf: "flex-start",
},


  // Fee Addresses
  feeGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
    gap: "10px",
  },

  feeCard: {
    background: "rgba(255, 255, 255, 0.03)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    borderRadius: "10px",
    padding: "12px",
    minHeight: "70px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },

  feeHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "6px",
  },

  networkName: {
    color: "#7dd3fc",
    fontWeight: 600,
    fontSize: "10px",
  },

  addressCode: {
    background: "rgba(0, 0, 0, 0.3)",
    padding: "4px 6px",
    borderRadius: "6px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    fontSize: "9px",
    color: "#e2e8f0",
    wordBreak: "break-all",
    fontFamily: "monospace",
    lineHeight: 1.2,
    maxHeight: "28px",
    overflow: "hidden",
  },

  // Wallet Section
  walletGrid: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "18px",
  },

  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  label: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: "13px",
    fontWeight: 600,
  },

  required: {
    color: "#ef4444",
  },

  input: {
    width: "100%",
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    background: "rgba(255, 255, 255, 0.08)",
    color: "#fff",
    fontSize: "14px",
    outline: "none",
    transition: "all 0.3s ease",
    minHeight: "44px",
  },

  helperText: {
    fontSize: "11px",
    color: "rgba(255, 255, 255, 0.6)",
    margin: "5px 0 0 0",
    lineHeight: 1.4,
  },

  // Offers Grid (layout controlled by CSS above)
  offersGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "12px",
    marginBottom: "25px",
  },

  // Mining Section
  miningContent: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },

  miningTier: {
    marginBottom: "8px",
  },

  miningInfo: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },

  infoText: {
    fontSize: "12px",
    color: "rgba(255, 255, 255, 0.7)",
    fontStyle: "italic",
  },

  range: {
    width: "100%",
    margin: "12px 0 8px 0",
  },

  tierLabels: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "4px",
  },

  miningDetails: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "12px",
    background: "rgba(255, 255, 255, 0.03)",
    padding: "16px",
    borderRadius: "10px",
    border: "1px solid rgba(255, 255, 255, 0.08)",
  },

  detailItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "13px",
    color: "rgba(255, 255, 255, 0.9)",
  },

  miningActions: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  // Buttons
  primaryBtn: {
    padding: "14px 20px",
    borderRadius: "10px",
    border: "none",
    background: "linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "14px",
    transition: "all 0.3s ease",
    backdropFilter: "blur(10px)",
    minHeight: "44px",
    width: "100%",
    maxWidth: "280px",
  },

  ghostBtn: {
    padding: "12px 18px",
    borderRadius: "10px",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    background: "rgba(255, 255, 255, 0.05)",
    color: "rgba(255, 255, 255, 0.9)",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "13px",
    transition: "all 0.3s ease",
    backdropFilter: "blur(10px)",
    minHeight: "40px",
  },

  copyBtn: {
    padding: "6px 12px",
    borderRadius: "6px",
    border: "1px solid rgba(139, 92, 246, 0.3)",
    background: "rgba(139, 92, 246, 0.15)",
    color: "#8b5cf6",
    cursor: "pointer",
    fontWeight: 500,
    fontSize: "10px",
    transition: "all 0.3s ease",
  },

  copiedFloat: {
    position: "absolute",
    bottom: "110%",
    left: "50%",
    transform: "translateX(-50%)",
    background: "rgba(34, 197, 94, 0.95)",
    color: "#041018",
    padding: "6px 12px",
    borderRadius: "6px",
    fontSize: "10px",
    fontWeight: 600,
    whiteSpace: "nowrap",
  },

  // Timers & Progress
  timerCard: {
    background: "rgba(255, 255, 255, 0.05)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "12px",
    padding: "16px",
    marginTop: "16px",
  },

  timerHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
    fontSize: "14px",
    color: "rgba(255, 255, 255, 0.9)",
  },

  timerText: {
    color: "#7dd3fc",
    fontWeight: 600,
    fontSize: "15px",
  },

  progressTrack: {
    width: "100%",
    height: "6px",
    background: "rgba(255, 255, 255, 0.1)",
    borderRadius: "8px",
    overflow: "hidden",
  },

  progressBar: {
    height: "100%",
    background: "linear-gradient(90deg, #8b5cf6 0%, #3b82f6 50%, #06b6d4 100%)",
    transition: "width 1s linear",
    borderRadius: "8px",
  },

  // Status & Messages
  statusCard: {
    background: "rgba(255, 255, 255, 0.05)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "12px",
    padding: "16px",
    margin: "16px 0",
  },

  statusText: {
    margin: 0,
    fontWeight: 500,
    textAlign: "center",
    fontSize: "13px",
    color: "rgba(255, 255, 255, 0.9)",
  },

  successCard: {
    background: "rgba(34, 197, 94, 0.1)",
    border: "1px solid rgba(34, 197, 94, 0.3)",
    borderRadius: "12px",
    padding: "20px",
    textAlign: "center",
    marginTop: "16px",
  },

  successText: {
    color: "#22c55e",
    margin: "0 0 12px 0",
    fontWeight: 600,
    fontSize: "14px",
  },

  // Sync Indicator
  syncIndicator: {
    position: "fixed",
    bottom: "16px",
    right: "16px",
    background: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    borderRadius: "16px",
    padding: "8px 14px",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    zIndex: 1000,
    animation: "pulse 2s ease-in-out infinite",
    fontSize: "11px",
  },

  pulseCircle: {
    width: "5px",
    height: "5px",
    background: "#10b981",
    borderRadius: "50%",
    animation: "pulse 1.5s ease-in-out infinite",
  },

  syncText: {
    fontSize: "11px",
    color: "rgba(255, 255, 255, 0.9)",
    fontWeight: 500,
  
  },
  summaryCard: {
  background: "rgba(255, 255, 255, 0.05)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  borderRadius: "10px",
  padding: "12px",
  marginTop: "10px",
  fontSize: "13px",
  color: "rgba(255, 255, 255, 0.85)",
  textAlign: "center",
},

summaryTitle: {
  fontWeight: 700,
  marginBottom: "4px",
  color: "#7dd3fc",
},

summaryText: {
  margin: "2px 0",
  fontSize: "12px",
  color: "rgba(255, 255, 255, 0.75)",
},

};
