// tabs/Contact.js
import { useState } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  setDoc,
  doc
} from "firebase/firestore";

export default function Contact() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("general");
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fade, setFade] = useState(false);

  // NEW: show/hide categories toggle (hidden by default)
  const [showCategories, setShowCategories] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim() || !message.trim() || !subject.trim()) {
      setStatus("⚠️ Please fill in all required fields.");
      return;
    }

    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setStatus("⚠️ Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);
    setStatus("⏳ Sending your message...");

    try {
      // Save message in Firestore
      await addDoc(collection(db, "messages"), {
        email,
        subject,
        message,
        category,
        timestamp: serverTimestamp(),
        status: "new",
      });

      

      // Reset form fields
      setEmail("");
      setMessage("");
      setSubject("");
      setCategory("general");

      setStatus("✅ Message sent successfully! We'll reply within 24 hours.");
      setFade(true);
      setTimeout(() => setFade(false), 5000);

    } catch (err) {
      console.error("Error sending message:", err);
      setStatus("❌ Error sending message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // -------------------------------------------------------------
  // ✔️ UPDATED CATEGORIES (same as yours)
  // -------------------------------------------------------------
  const categories = [
    {
      id: "wallet",
      name: "Wallet Issues",
      icon: "👛",
      description: "Problems with wallet setup, addresses, or transactions",
    },
    {
      id: "investmine",
      name: "Invest & Mine Support",
      icon: "💎",
      description: "Help with investments, mining, payouts and bonuses",
    },
    {
      id: "referral",
      name: "Referral Program",
      icon: "👥",
      description: "Referral codes, bonuses, or sharing issues",
    },
    {
      id: "technical",
      name: "Technical Issues",
      icon: "🔧",
      description: "Website bugs, performance, or access problems",
    },
    {
      id: "partnership",
      name: "Partnership",
      icon: "🤝",
      description: "Business opportunities and collaborations",
    },
    {
      id: "general",
      name: "General Inquiry",
      icon: "💬",
      description: "Other questions or general information",
    },
  ];


  // -------------------------------------------------------------
  // ✔️ FAQ (unchanged)
  // -------------------------------------------------------------
  const faqs = [
    {
      question: "How long does support take to respond?",
      answer:
        "We typically respond within 2-12 hours depending on the inquiry type.",
    },
    {
      question: "Do you provide 24/7 support?",
      answer:
        "Yes, our support team is available 24/7 for urgent technical issues.",
    },
    {
      question: "Can I get help with wallet setup?",
      answer:
        "Absolutely! We provide detailed guidance for wallet configuration.",
    },
  ];

  return (
    <div style={styles.page}>
      {/* Hero Section */}
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <div style={styles.titleContainer}>
            <h1 style={styles.mainTitle}>
              <span style={styles.titleGradient}>Contact</span>
              <span style={styles.titleSymbol}> Support</span>
            </h1>
            <div style={styles.titleGlow}></div>
          </div>

          <p style={styles.heroSubtitle}>
            Get in touch with our <span style={styles.highlight}>support team</span> for assistance,
            questions, or partnership opportunities. We're here to{" "}
            <span style={styles.highlight}>help you succeed</span>.
          </p>

          <div style={styles.ctaBadges}>
            <span style={styles.ctaBadge}>🚀 Quick Response</span>
            <span style={styles.ctaBadge}>💎 Expert Support</span>
            <span style={styles.ctaBadge}>🌍 24/7 Available</span>
          </div>
        </div>
      </section>

      {/* 🔥 SUPPORT CHANNELS REMOVED COMPLETELY — AS REQUESTED */}
      {/* Contact Form */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Send us a Message</h2>

        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h3 style={styles.cardTitle}>📝 Contact Form</h3>
            <div style={styles.infoBadge}>ⓘ All fields are required</div>
          </div>

          <p style={styles.cardDescription}>
            Fill out the form below and our team will get back to you as soon as possible.
            Provide detailed information for faster assistance.
          </p>

          <div style={styles.formGrid}>
            {/* Email */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>
                Email Address<span style={styles.required}> *</span>
              </label>
              <input
                style={styles.input}
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
              />
            </div>

            {/* Subject */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>
                Subject<span style={styles.required}> *</span>
              </label>
              <input
                style={styles.input}
                type="text"
                placeholder="Brief description of your inquiry"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                disabled={isSubmitting}
              />
            </div>

            {/* Category Toggle Button */}
            <button
              style={styles.toggleBtn}
              onClick={() => setShowCategories(!showCategories)}
              type="button"
            >
              {showCategories ? "Hide Categories ▲" : "Show Categories ▼"}
            </button>

            {/* Categories */}
            {showCategories && (
              <div style={{ ...styles.inputGroup, gridColumn: "1 / -1" }}>
                <label style={styles.label}>
                  Category<span style={styles.required}> *</span>
                </label>

                <div style={styles.categoryGrid}>
                  {categories.map((cat) => (
                    <div
                      key={cat.id}
                      style={{
                        ...styles.categoryCard,
                        ...(category === cat.id ? styles.categoryCardSelected : {}),
                      }}
                      onClick={() => !isSubmitting && setCategory(cat.id)}
                    >
                      <div style={styles.categoryIcon}>{cat.icon}</div>

                      <div style={styles.categoryContent}>
                        <div style={styles.categoryName}>{cat.name}</div>
                        <div style={styles.categoryDesc}>{cat.description}</div>
                      </div>

                      {category === cat.id && (
                        <div style={styles.selectedIndicator}>✓</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Message */}
            <div style={{ ...styles.inputGroup, gridColumn: "1 / -1" }}>
              <label style={styles.label}>
                Your Message<span style={styles.required}> *</span>
              </label>

              <textarea
                style={styles.textarea}
                rows={6}
                placeholder="Please describe your issue or question in detail."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={isSubmitting}
              />

              <div style={styles.charCount}>
                {message.length} characters • Minimum 20 recommended
              </div>
            </div>
          </div>

          {/* Submit button */}
          <button
            style={{
              ...styles.primaryBtn,
              opacity: isSubmitting ? 0.7 : 1,
              cursor: isSubmitting ? "not-allowed" : "pointer",
            }}
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div style={styles.spinner}></div>
                Sending Message...
              </>
            ) : (
              "📨 Send Message"
            )}
          </button>

          {/* Status message */}
          {status && (
            <div
              style={{
                ...styles.statusCard,
                background: status.includes("✅")
                  ? "rgba(34, 197, 94, 0.12)"
                  : status.includes("❌")
                  ? "rgba(239, 68, 68, 0.12)"
                  : "rgba(56, 189, 248, 0.12)",
                border: status.includes("❌")
                  ? "1px solid rgba(239, 68, 68, 0.4)"
                  : status.includes("✅")
                  ? "1px solid rgba(34, 197, 94, 0.4)"
                  : "1px solid rgba(56, 189, 248, 0.4)",
              }}
            >
              <p
                style={{
                  ...styles.statusText,
                  color: status.includes("❌")
                    ? "#ef4444"
                    : status.includes("✅")
                    ? "#22c55e"
                    : "#38bdf8",
                }}
              >
                {status}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* FAQ Section */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Frequently Asked Questions</h2>

        <div style={styles.faqGrid}>
          {faqs.map((faq, index) => (
            <div key={index} style={styles.faqCard}>
              <h3 style={styles.faqQuestion}>{faq.question}</h3>
              <p style={styles.faqAnswer}>{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Sync Indicator */}
      {fade && (
        <div style={styles.syncIndicator}>
          <div style={styles.pulseCircle}></div>
          <span style={styles.syncText}>✨ Message Sent Successfully</span>
        </div>
      )}

      {/* Animations */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.7; }
          100% { transform: scale(1); opacity: 1; }
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

  // HERO
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
    display: "inline-block",
    fontWeight: 800,
  },

  titleSymbol: {
    color: "rgba(255, 255, 255, 0.92)",
    fontSize: "0.9em",
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
      "radial-gradient(circle, rgba(139,92,246,0.25) 0%, transparent 70%)",
    filter: "blur(60px)",
    zIndex: -1,
  },

  heroSubtitle: {
    fontSize: "clamp(1rem, 4vw, 1.25rem)",
    color: "rgba(255, 255, 255, 0.8)",
    lineHeight: 1.6,
    maxWidth: "600px",
    margin: "0 auto 32px",
  },

  highlight: {
    background: "linear-gradient(45deg, #8b5cf6, #3b82f6)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
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
    border: "1px solid rgba(139, 92, 246, 0.35)",
    color: "#a78bfa",
    padding: "10px 16px",
    borderRadius: "40px",
    fontSize: "14px",
    fontWeight: 600,
    backdropFilter: "blur(10px)",
  },

  // SECTION
  section: {
    padding: "32px 16px",
  },

  sectionTitle: {
    fontSize: "clamp(1.75rem, 6vw, 2.5rem)",
    textAlign: "center",
    margin: "0 auto 30px",
    background: "linear-gradient(135deg, #fff 0%, #c7d2fe 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    fontWeight: 700,
  },

  // FORM CARD
  card: {
    background: "rgba(255, 255, 255, 0.05)",
    borderRadius: "18px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    padding: "26px",
    maxWidth: "800px",
    margin: "0 auto",
    backdropFilter: "blur(15px)",
  },

  cardHeader: {
    marginBottom: "20px",
  },

  cardTitle: {
    fontSize: "1.25rem",
    fontWeight: 700,
    background: "linear-gradient(135deg, #fff, #dbeafe)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    margin: 0,
  },

  infoBadge: {
    marginTop: "8px",
    background: "rgba(56, 189, 248, 0.1)",
    border: "1px solid rgba(56, 189, 248, 0.35)",
    color: "#7dd3fc",
    padding: "6px 12px",
    borderRadius: "10px",
    fontSize: "13px",
    display: "inline-block",
  },

  cardDescription: {
    fontSize: "0.9rem",
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: "20px",
  },

  formGrid: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "16px",
  },

  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },

  label: {
    color: "rgba(255, 255, 255, 0.92)",
    fontSize: "14px",
    fontWeight: 600,
  },

  required: { color: "#ef4444" },

  input: {
    padding: "12px 14px",
    background: "rgba(255, 255, 255, 0.1)",
    border: "1px solid rgba(255, 255, 255, 0.15)",
    borderRadius: "10px",
    color: "#fff",
    outline: "none",
    fontSize: "14px",
  },

  toggleBtn: {
    gridColumn: "1 / -1",
    marginTop: "8px",
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid rgba(139, 92, 246, 0.3)",
    background: "rgba(139, 92, 246, 0.15)",
    color: "#d8b4fe",
    cursor: "pointer",
    textAlign: "center",
    fontSize: "14px",
    fontWeight: 600,
  },

  categoryGrid: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "12px",
    marginTop: "8px",
  },

  categoryCard: {
    background: "rgba(255, 255, 255, 0.05)",
    borderRadius: "12px",
    padding: "16px",
    display: "flex",
    gap: "12px",
    position: "relative",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    cursor: "pointer",
    transition: "0.25s",
  },

  categoryCardSelected: {
    background: "rgba(139, 92, 246, 0.2)",
    border: "1px solid rgba(139, 92, 246, 0.6)",
    transform: "scale(1.02)",
  },

  categoryIcon: {
    width: "38px",
    height: "38px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(139, 92, 246, 0.12)",
    fontSize: "20px",
  },

  categoryContent: { flex: 1 },

  categoryName: {
    fontSize: "14px",
    fontWeight: 600,
    color: "rgba(255, 255, 255, 0.95)",
    marginBottom: "4px",
  },

  categoryDesc: {
    fontSize: "12px",
    color: "rgba(255, 255, 255, 0.7)",
  },

  selectedIndicator: {
    position: "absolute",
    top: "8px",
    right: "8px",
    background: "#10b981",
    width: "20px",
    height: "20px",
    borderRadius: "50%",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "12px",
    fontWeight: "bold",
  },

  textarea: {
    padding: "12px 14px",
    background: "rgba(255, 255, 255, 0.1)",
    border: "1px solid rgba(255, 255, 255, 0.15)",
    borderRadius: "12px",
    color: "#fff",
    fontSize: "14px",
    minHeight: "120px",
    outline: "none",
    resize: "vertical",
    fontFamily: "inherit",
  },

  charCount: {
    fontSize: "12px",
    color: "rgba(255, 255, 255, 0.6)",
    marginTop: "4px",
  },

  primaryBtn: {
    width: "100%",
    padding: "16px",
    borderRadius: "12px",
    border: "none",
    background: "linear-gradient(135deg, #8b5cf6, #3b82f6)",
    color: "#fff",
    fontWeight: 600,
    fontSize: "15px",
    cursor: "pointer",
    display: "flex",
    justifyContent: "center",
    gap: "8px",
    marginTop: "10px",
  },

  spinner: {
    width: "16px",
    height: "16px",
    border: "2px solid rgba(255,255,255,0.3)",
    borderTop: "2px solid white",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },

  statusCard: {
    padding: "16px",
    borderRadius: "12px",
    textAlign: "center",
    marginTop: "16px",
  },

  statusText: {
    fontSize: "14px",
    fontWeight: 600,
    margin: 0,
  },

  faqGrid: {
    display: "grid",
    gap: "16px",
    gridTemplateColumns: "1fr",
    maxWidth: "1000px",
    margin: "0 auto",
  },

  faqCard: {
    background: "rgba(255, 255, 255, 0.06)",
    borderRadius: "14px",
    padding: "20px",
    border: "1px solid rgba(255, 255, 255, 0.12)",
    backdropFilter: "blur(15px)",
  },

  faqQuestion: {
    fontSize: "1rem",
    fontWeight: 600,
    color: "rgba(255, 255, 255, 0.95)",
    marginBottom: "6px",
  },

  faqAnswer: {
    fontSize: "13px",
    color: "rgba(255, 255, 255, 0.75)",
    lineHeight: 1.5,
  },

  syncIndicator: {
    position: "fixed",
    bottom: "22px",
    right: "22px",
    padding: "12px 18px",
    background: "rgba(255, 255, 255, 0.1)",
    borderRadius: "50px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    border: "1px solid rgba(255, 255, 255, 0.25)",
    backdropFilter: "blur(20px)",
  },

  pulseCircle: {
    width: "8px",
    height: "8px",
    background: "#10b981",
    borderRadius: "50%",
    animation: "pulse 1.4s infinite",
  },

  syncText: {
    fontSize: "13px",
    color: "#ffffff",
  },

  "@media (min-width: 480px)": {
    categoryGrid: { gridTemplateColumns: "1fr 1fr" },
  },

  "@media (min-width: 768px)": {
    formGrid: { gridTemplateColumns: "1fr 1fr", gap: "20px" },
    categoryGrid: { gridTemplateColumns: "1fr 1fr" },
    faqGrid: { gridTemplateColumns: "repeat(2, 1fr)" },
  },

  "@media (min-width: 1024px)": {
    faqGrid: {
      gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
    },
  },
};
