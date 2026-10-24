import React, { useState } from "react";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Sun,
  Moon,
  RefreshCw,
  BookOpen,
  Globe,
  Award,
  Layers,
  Zap,
  Check
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { LEARNING_STAGES, getStageById } from "../data/learningStages";
import { LEARNING_LANGUAGES, getLanguageById } from "../data/learningLanguages";
import { AVATAR_OPTIONS } from "../services/authService";

export default function SignUp({ onNavigate, onBack }) {
  const { signup, authNotice } = useAuth();
  const { toggleTheme, isDark } = useTheme();

  // Signup fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [stage, setStage] = useState("young");
  const [language, setLanguage] = useState("english");
  const [avatar, setAvatar] = useState("snake_blue");
  const [showPassword, setShowPassword] = useState(false);

  // Status feedback
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Password strength calculation
  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: "", color: "bg-slate-200" };
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass) && /[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 1) return { score: 25, label: "Weak", color: "#60a5fa" };
    if (score === 2) return { score: 50, label: "Fair", color: "#38bdf8" };
    if (score === 3) return { score: 75, label: "Good", color: "#3b82f6" };
    return { score: 100, label: "Strong", color: "#2563eb" };
  };

  const passwordStrength = getPasswordStrength(password);

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match. Please verify.");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters.");
      return;
    }

    setIsLoading(true);

    try {
      await signup({
        name,
        email,
        password,
        stage,
        language,
        avatar,
        bio: `Python explorer in ${getStageById(stage).label} stage.`
      });
      if (onNavigate) {
        onNavigate("home");
      }
    } catch (err) {
      setErrorMsg(err.message || "Failed to create account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page-wrapper">
      {/* Background Decorative Glows */}
      <div
        style={{
          position: "absolute",
          top: "-8rem",
          left: "-8rem",
          width: "26rem",
          height: "26rem",
          background: "rgba(37, 99, 235, 0.12)",
          borderRadius: "9999px",
          filter: "blur(60px)",
          pointerEvents: "none"
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-8rem",
          right: "-8rem",
          width: "26rem",
          height: "26rem",
          background: "rgba(59, 130, 246, 0.12)",
          borderRadius: "9999px",
          filter: "blur(60px)",
          pointerEvents: "none"
        }}
      />

      {/* Top Navigation Bar */}
      <header className="auth-header">
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          {onBack && (
            <button
              onClick={onBack}
              style={{
                padding: "0.45rem 0.75rem",
                borderRadius: "0.75rem",
                background: "var(--color-surface)",
                color: "var(--color-text)",
                border: "1px solid var(--color-border)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.35rem",
                fontSize: "0.8rem",
                fontWeight: "700",
                boxShadow: "var(--shadow-2xs)"
              }}
              title="Go back"
            >
              <ArrowLeft size={15} style={{ color: "#3b82f6" }} />
              <span>Back</span>
            </button>
          )}

          <div
            onClick={() => onNavigate && onNavigate("home")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
              cursor: "pointer"
            }}
          >
            <div
              style={{
                width: "2.5rem",
                height: "2.5rem",
                borderRadius: "0.875rem",
                background: "linear-gradient(135deg, #2563eb, #3b82f6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontWeight: "800",
                fontSize: "1rem",
                fontFamily: "monospace",
                boxShadow: "0 4px 12px rgba(59, 130, 246, 0.25)"
              }}
            >
              <span style={{ color: "#ffffff" }}>Py</span>
            </div>
            <div>
              <span
                style={{
                  fontWeight: "800",
                  fontSize: "1.05rem",
                  letterSpacing: "-0.02em",
                  display: "block",
                  lineHeight: 1.2
                }}
              >
                Python Adaptive
              </span>
              <span
                style={{
                  fontSize: "0.72rem",
                  fontWeight: "600",
                  color: "#60a5fa",
                  display: "block",
                  lineHeight: 1.2
                }}
              >
                Create Free Account
              </span>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            style={{
              padding: "0.55rem",
              borderRadius: "0.75rem",
              background: "var(--color-surface)",
              color: "var(--color-text)",
              border: "1px solid var(--color-border)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle Theme"
          >
            {isDark ? <Sun size={17} style={{ color: "#60a5fa" }} /> : <Moon size={17} />}
          </button>


        </div>
      </header>

      {/* Main Responsive Grid Layout */}
      <main className="auth-main-layout">
        {/* Left Branding & Highlights Column */}
        <div className="auth-hero-section">
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.4rem 0.85rem",
              borderRadius: "9999px",
              fontSize: "0.75rem",
              fontWeight: "800",
              background: "rgba(59, 130, 246, 0.1)",
              border: "1px solid rgba(59, 130, 246, 0.3)",
              color: "#60a5fa",
              alignSelf: "flex-start"
            }}
          >
            <Sparkles size={14} />
            <span>Personalized Learning Experience</span>
          </div>

          <h1
            style={{
              fontSize: "clamp(1.85rem, 4.2vw, 2.75rem)",
              fontWeight: "900",
              letterSpacing: "-0.03em",
              lineHeight: 1.15
            }}
          >
            Master Python at <br />
            <span
              style={{
                background: "linear-gradient(135deg, #60a5fa, #38bdf8)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}
            >
              Your Age & Language
            </span>
          </h1>

          <p
            style={{
              fontSize: "0.95rem",
              color: "var(--color-text-muted)",
              lineHeight: 1.6,
              maxWidth: "32rem"
            }}
          >
            Join Python Adaptive to unlock interactive lessons tailored specifically to your learning stage. Practice with real-time code runs, study in your mother tongue, and earn XP badges.
          </p>

          {/* Feature Highlights Grid */}
          <div className="auth-feature-grid">
            <div
              style={{
                padding: "0.85rem 1rem",
                borderRadius: "1rem",
                background: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                boxShadow: "var(--shadow-2xs)",
                display: "flex",
                alignItems: "flex-start",
                gap: "0.75rem"
              }}
            >
              <div
                style={{
                  width: "2rem",
                  height: "2rem",
                  borderRadius: "0.65rem",
                  background: "rgba(59, 130, 246, 0.12)",
                  color: "#38bdf8",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0
                }}
              >
                <Layers size={16} />
              </div>
              <div>
                <h4 style={{ fontSize: "0.85rem", fontWeight: "700", marginBottom: "0.15rem" }}>
                  4 Learning Stages
                </h4>
                <p style={{ fontSize: "0.75rem", color: "var(--color-text-subtle)", lineHeight: 1.4 }}>
                  Kids, Teens, College, and Professional modes with customized vocabulary.
                </p>
              </div>
            </div>

            <div
              style={{
                padding: "0.85rem 1rem",
                borderRadius: "1rem",
                background: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                boxShadow: "var(--shadow-2xs)",
                display: "flex",
                alignItems: "flex-start",
                gap: "0.75rem"
              }}
            >
              <div
                style={{
                  width: "2rem",
                  height: "2rem",
                  borderRadius: "0.65rem",
                  background: "rgba(59, 130, 246, 0.12)",
                  color: "#60a5fa",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0
                }}
              >
                <Globe size={16} />
              </div>
              <div>
                <h4 style={{ fontSize: "0.85rem", fontWeight: "700", marginBottom: "0.15rem" }}>
                  10+ Regional Languages
                </h4>
                <p style={{ fontSize: "0.75rem", color: "var(--color-text-subtle)", lineHeight: 1.4 }}>
                  Learn in Telugu, Hindi, Tamil, Kannada, Marathi, Gujarati & more.
                </p>
              </div>
            </div>

            <div
              style={{
                padding: "0.85rem 1rem",
                borderRadius: "1rem",
                background: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                boxShadow: "var(--shadow-2xs)",
                display: "flex",
                alignItems: "flex-start",
                gap: "0.75rem"
              }}
            >
              <div
                style={{
                  width: "2rem",
                  height: "2rem",
                  borderRadius: "0.65rem",
                  background: "rgba(59, 130, 246, 0.12)",
                  color: "#3b82f6",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0
                }}
              >
                <Award size={16} />
              </div>
              <div>
                <h4 style={{ fontSize: "0.85rem", fontWeight: "700", marginBottom: "0.15rem" }}>
                  XP & Achievements
                </h4>
                <p style={{ fontSize: "0.75rem", color: "var(--color-text-subtle)", lineHeight: 1.4 }}>
                  Earn milestones, solve challenges, and monitor your topic completion.
                </p>
              </div>
            </div>

            <div
              style={{
                padding: "0.85rem 1rem",
                borderRadius: "1rem",
                background: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                boxShadow: "var(--shadow-2xs)",
                display: "flex",
                alignItems: "flex-start",
                gap: "0.75rem"
              }}
            >
              <div
                style={{
                  width: "2rem",
                  height: "2rem",
                  borderRadius: "0.65rem",
                  background: "rgba(59, 130, 246, 0.12)",
                  color: "#2563eb",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0
                }}
              >
                <Zap size={16} />
              </div>
              <div>
                <h4 style={{ fontSize: "0.85rem", fontWeight: "700", marginBottom: "0.15rem" }}>
                  Zero Setup Required
                </h4>
                <p style={{ fontSize: "0.75rem", color: "var(--color-text-subtle)", lineHeight: 1.4 }}>
                  Code and experiment immediately in modern web sandbox without installs.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Authentication Card Column */}
        <div className="auth-card-section">
          <div className="auth-card">
            {/* Card Header */}
            <div
              style={{
                padding: "1.5rem",
                background: "linear-gradient(135deg, #2563eb, #3b82f6)",
                color: "#fff"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.35rem" }}>
                <div
                  style={{
                    width: "2rem",
                    height: "2rem",
                    borderRadius: "0.5rem",
                    background: "rgba(255, 255, 255, 0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <Sparkles size={18} />
                </div>
                <h2 style={{ fontSize: "1.3rem", fontWeight: "800", letterSpacing: "-0.02em", color: "#fff", margin: 0 }}>
                  Create Your Account
                </h2>
              </div>
              <p style={{ fontSize: "0.78rem", color: "#dbeafe", margin: 0 }}>
                Set up your personalized profile and start learning in 30 seconds.
              </p>
            </div>

            {/* Form Scroll Container */}
            <div
              style={{
                padding: "1.25rem 1.5rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.85rem",
                maxHeight: "68vh",
                overflowY: "auto"
              }}
            >
              {/* Context Notice Message */}
              {authNotice && (
                <div
                  style={{
                    padding: "0.85rem 1rem",
                    borderRadius: "0.75rem",
                    background: "rgba(37, 99, 235, 0.12)",
                    border: "1px solid rgba(59, 130, 246, 0.4)",
                    color: "#93c5fd",
                    fontSize: "0.8rem",
                    fontWeight: "600",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.6rem"
                  }}
                >
                  <Lock size={16} style={{ flexShrink: 0, color: "#60a5fa" }} />
                  <span>{authNotice}</span>
                </div>
              )}

              {/* Error Message */}
              {errorMsg && (
                <div
                  style={{
                    padding: "0.75rem",
                    borderRadius: "0.75rem",
                    background: "rgba(35, 52, 77, 0.6)",
                    border: "1px solid #3b82f6",
                    color: "#93c5fd",
                    fontSize: "0.75rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem"
                  }}
                >
                  <AlertCircle size={16} style={{ flexShrink: 0 }} />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Success Message */}
              {successMsg && (
                <div
                  style={{
                    padding: "0.75rem",
                    borderRadius: "0.75rem",
                    background: "rgba(35, 52, 77, 0.6)",
                    border: "1px solid #3b82f6",
                    color: "#60a5fa",
                    fontSize: "0.75rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem"
                  }}
                >
                  <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* SIGN UP FORM */}
              <form onSubmit={handleSignUpSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                {/* Full Name */}
                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: "700", marginBottom: "0.35rem" }}>
                    Full Name
                  </label>
                  <div style={{ position: "relative" }}>
                    <User
                      size={16}
                      style={{
                        position: "absolute",
                        left: "0.85rem",
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "var(--color-text-subtle)"
                      }}
                    />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Sneha Patel"
                      className="auth-form-input"
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: "700", marginBottom: "0.35rem" }}>
                    Email Address
                  </label>
                  <div style={{ position: "relative" }}>
                    <Mail
                      size={16}
                      style={{
                        position: "absolute",
                        left: "0.85rem",
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "var(--color-text-subtle)"
                      }}
                    />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="sneha@example.com"
                      className="auth-form-input"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: "700", marginBottom: "0.35rem" }}>
                    Password
                  </label>
                  <div style={{ position: "relative" }}>
                    <Lock
                      size={16}
                      style={{
                        position: "absolute",
                        left: "0.85rem",
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "var(--color-text-subtle)"
                      }}
                    />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      className="auth-form-input"
                      style={{ paddingRight: "2.5rem" }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: "absolute",
                        right: "0.75rem",
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "var(--color-text-subtle)",
                        padding: "0.2rem"
                      }}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>

                  {/* Password Strength Indicator */}
                  {password && (
                    <div style={{ marginTop: "0.4rem" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          fontSize: "0.7rem",
                          marginBottom: "0.2rem"
                        }}
                      >
                        <span style={{ color: "var(--color-text-subtle)", fontWeight: "600" }}>Password Strength</span>
                        <span style={{ fontWeight: "800", color: passwordStrength.color }}>
                          {passwordStrength.label}
                        </span>
                      </div>
                      <div
                        style={{
                          width: "100%",
                          background: "var(--color-surface-subtle)",
                          height: "4px",
                          borderRadius: "9999px",
                          overflow: "hidden"
                        }}
                      >
                        <div
                          style={{
                            height: "100%",
                            width: `${passwordStrength.score}%`,
                            background: passwordStrength.color,
                            transition: "all 0.3s ease"
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: "700", marginBottom: "0.35rem" }}>
                    Confirm Password
                  </label>
                  <div style={{ position: "relative" }}>
                    <Lock
                      size={16}
                      style={{
                        position: "absolute",
                        left: "0.85rem",
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "var(--color-text-subtle)"
                      }}
                    />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter your password"
                      className="auth-form-input"
                    />
                  </div>
                </div>

                {/* Pick Learning Stage & Language */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", paddingTop: "0.25rem" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.725rem", fontWeight: "700", marginBottom: "0.3rem" }}>
                      Learning Stage
                    </label>
                    <select
                      value={stage}
                      onChange={(e) => setStage(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "0.55rem 0.65rem",
                        borderRadius: "0.75rem",
                        border: "1px solid var(--color-border)",
                        background: "var(--color-surface-subtle)",
                        color: "var(--color-text)",
                        fontSize: "0.75rem",
                        fontWeight: "600",
                        cursor: "pointer"
                      }}
                    >
                      {LEARNING_STAGES.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.icon} {s.label} ({s.ageRange})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.725rem", fontWeight: "700", marginBottom: "0.3rem" }}>
                      Primary Language
                    </label>
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "0.55rem 0.65rem",
                        borderRadius: "0.75rem",
                        border: "1px solid var(--color-border)",
                        background: "var(--color-surface-subtle)",
                        color: "var(--color-text)",
                        fontSize: "0.75rem",
                        fontWeight: "600",
                        cursor: "pointer"
                      }}
                    >
                      {LEARNING_LANGUAGES.map((l) => (
                        <option key={l.id} value={l.id}>
                          {l.icon} {l.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Avatar Selector */}
                <div>
                  <label style={{ display: "block", fontSize: "0.725rem", fontWeight: "700", marginBottom: "0.35rem" }}>
                    Select Your Learning Avatar
                  </label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                    {AVATAR_OPTIONS.map((a) => (
                      <button
                        key={a.id}
                        type="button"
                        onClick={() => setAvatar(a.id)}
                        style={{
                          width: "2.35rem",
                          height: "2.35rem",
                          borderRadius: "0.65rem",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "1.1rem",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                          border: avatar === a.id ? "2px solid #3b82f6" : "1px solid var(--color-border)",
                          background: avatar === a.id ? "rgba(59, 130, 246, 0.2)" : "var(--color-surface-subtle)",
                          transform: avatar === a.id ? "scale(1.08)" : "scale(1)"
                        }}
                        title={a.label}
                      >
                        {a.emoji}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-vibrant-primary"
                  style={{
                    width: "100%",
                    padding: "0.8rem",
                    fontSize: "0.875rem",
                    marginTop: "0.25rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                    cursor: "pointer"
                  }}
                >
                  {isLoading ? (
                    <RefreshCw size={16} className="animate-spin" />
                  ) : (
                    <>
                      <Sparkles size={16} />
                      <span>Create Account & Start Learning</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Bottom Switch to Sign In */}
            <div
              style={{
                padding: "1rem 1.5rem",
                background: "var(--color-surface-subtle)",
                borderTop: "1px solid var(--color-border)",
                textAlign: "center",
                fontSize: "0.8rem",
                color: "var(--color-text-muted)"
              }}
            >
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => onNavigate && onNavigate("signin")}
                style={{
                  fontWeight: "800",
                  color: "#3b82f6",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  fontSize: "0.8rem"
                }}
              >
                Sign In Here →
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer
        style={{
          position: "relative",
          zIndex: 10,
          padding: "1rem",
          textAlign: "center",
          fontSize: "0.75rem",
          color: "var(--color-text-subtle)",
          borderTop: "1px solid var(--color-border-subtle)"
        }}
      >
        Python Adaptive Interactive Guide • All Learning Stages & Languages Supported
      </footer>
    </div>
  );
}
