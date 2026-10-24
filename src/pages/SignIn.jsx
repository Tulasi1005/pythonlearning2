import React, { useState } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Flame,
  Zap,
  RefreshCw,
  LogIn,
  Sun,
  Moon,
  Compass,
  Layers,
  Globe
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export default function SignIn({ onNavigate, onBack }) {
  const { login, resetPassword, authNotice } = useAuth();
  const { toggleTheme, isDark } = useTheme();

  // Mode: 'signin' | 'forgot'
  const [viewMode, setViewMode] = useState("signin");

  // Sign In fields
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  // Forgot password fields
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotNewPassword, setForgotNewPassword] = useState("");

  // Feedback status
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setIsLoading(true);

    try {
      await login({
        emailOrUsername,
        password,
        rememberMe
      });
      if (onNavigate) {
        onNavigate("home");
      }
    } catch (err) {
      setErrorMsg(err.message || "Failed to sign in. Please verify your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemo = async (demoEmail, demoPass) => {
    setErrorMsg("");
    setSuccessMsg("");
    setIsLoading(true);
    try {
      await login({
        emailOrUsername: demoEmail,
        password: demoPass,
        rememberMe: true
      });
      if (onNavigate) {
        onNavigate("home");
      }
    } catch (err) {
      setErrorMsg(err.message || "Demo login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setIsLoading(true);

    try {
      await resetPassword(forgotEmail, forgotNewPassword);
      setSuccessMsg("Password reset successfully! You can now sign in with your new password.");
      setViewMode("signin");
      setPassword("");
    } catch (err) {
      setErrorMsg(err.message || "Password reset failed");
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
                Sign In to Your Journey
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
            <span>Welcome Back Explorer</span>
          </div>

          <h1
            style={{
              fontSize: "clamp(1.85rem, 4.2vw, 2.75rem)",
              fontWeight: "900",
              letterSpacing: "-0.03em",
              lineHeight: 1.15
            }}
          >
            Continue Your Python <br />
            <span
              style={{
                background: "linear-gradient(135deg, #60a5fa, #38bdf8)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}
            >
              Mastery Journey
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
            Sign in to access your saved bookmarks, sync your lesson progress, protect your daily learning streak, and keep your custom age stage & language preferences.
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
                  color: "#3b82f6",
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
                  Live Python Runner
                </h4>
                <p style={{ fontSize: "0.75rem", color: "var(--color-text-subtle)", lineHeight: 1.4 }}>
                  Execute real Python code in your browser with instant visual outputs.
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
                  color: "#38bdf8",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0
                }}
              >
                <Flame size={16} />
              </div>
              <div>
                <h4 style={{ fontSize: "0.85rem", fontWeight: "700", marginBottom: "0.15rem" }}>
                  Streak & Progress Sync
                </h4>
                <p style={{ fontSize: "0.75rem", color: "var(--color-text-subtle)", lineHeight: 1.4 }}>
                  Never lose completed topics, quiz scores, or bookmarks across devices.
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
                <Compass size={16} />
              </div>
              <div>
                <h4 style={{ fontSize: "0.85rem", fontWeight: "700", marginBottom: "0.15rem" }}>
                  Stage-Tailored Depth
                </h4>
                <p style={{ fontSize: "0.75rem", color: "var(--color-text-subtle)", lineHeight: 1.4 }}>
                  Explanations automatically match your preferred learning level.
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
                  Bilingual Dictionary
                </h4>
                <p style={{ fontSize: "0.75rem", color: "var(--color-text-subtle)", lineHeight: 1.4 }}>
                  Technical Python terms translated into your mother tongue on demand.
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
                  <LogIn size={18} />
                </div>
                <h2 style={{ fontSize: "1.3rem", fontWeight: "800", letterSpacing: "-0.02em", color: "#fff", margin: 0 }}>
                  {viewMode === "signin" ? "Sign In to Your Account" : "Reset Account Password"}
                </h2>
              </div>
              <p style={{ fontSize: "0.78rem", color: "#dbeafe", margin: 0 }}>
                {viewMode === "signin"
                  ? "Enter your email or username below to continue."
                  : "Enter your registered email and a new password."}
              </p>
            </div>

            {/* Form Container */}
            <div
              style={{
                padding: "1.5rem",
                display: "flex",
                flexDirection: "column",
                gap: "1rem"
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

              {/* SIGN IN FORM */}
              {viewMode === "signin" ? (
                <form onSubmit={handleSignInSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.75rem", fontWeight: "700", marginBottom: "0.35rem" }}>
                      Email or Username
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
                        type="text"
                        required
                        value={emailOrUsername}
                        onChange={(e) => setEmailOrUsername(e.target.value)}
                        placeholder="alex@example.com or Alex Johnson"
                        className="auth-form-input"
                      />
                    </div>
                  </div>

                  <div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: "0.35rem"
                      }}
                    >
                      <label style={{ fontSize: "0.75rem", fontWeight: "700" }}>
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setViewMode("forgot");
                          setErrorMsg("");
                          setSuccessMsg("");
                        }}
                        style={{
                          fontSize: "0.725rem",
                          fontWeight: "700",
                          color: "#3b82f6",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          padding: 0
                        }}
                      >
                        Forgot password?
                      </button>
                    </div>
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
                        placeholder="Enter your password"
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
                  </div>

                  <div style={{ display: "flex", alignItems: "center", fontSize: "0.75rem", color: "var(--color-text-muted)" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", userSelect: "none" }}>
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        style={{ width: "1rem", height: "1rem", cursor: "pointer" }}
                      />
                      <span>Keep me signed in on this device</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn-vibrant-primary"
                    style={{
                      width: "100%",
                      padding: "0.8rem",
                      fontSize: "0.875rem",
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
                        <LogIn size={16} />
                        <span>Sign In</span>
                        <ArrowRight size={16} />
                      </>
                    )}
                  </button>

                  {/* 1-Click Demo Accounts */}
                  <div style={{ paddingTop: "0.75rem", borderTop: "1px solid var(--color-border)" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.35rem",
                        fontSize: "0.725rem",
                        fontWeight: "700",
                        color: "var(--color-text-subtle)",
                        marginBottom: "0.5rem"
                      }}
                    >
                      <Sparkles size={13} style={{ color: "#60a5fa" }} />
                      <span>Quick Test Accounts</span>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                      <button
                        type="button"
                        onClick={() => handleQuickDemo("alex@example.com", "password123")}
                        style={{
                          padding: "0.6rem",
                          borderRadius: "0.75rem",
                          background: "var(--color-surface-subtle)",
                          border: "1px solid var(--color-border)",
                          textAlign: "left",
                          cursor: "pointer",
                          transition: "all 0.2s ease"
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", fontWeight: "700", fontSize: "0.75rem", color: "var(--color-text)" }}>
                          <span>🐍</span>
                          <span>Alex (College)</span>
                        </div>
                        <div style={{ fontSize: "0.65rem", color: "var(--color-text-subtle)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          alex@example.com
                        </div>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleQuickDemo("priya@example.com", "password123")}
                        style={{
                          padding: "0.6rem",
                          borderRadius: "0.75rem",
                          background: "var(--color-surface-subtle)",
                          border: "1px solid var(--color-border)",
                          textAlign: "left",
                          cursor: "pointer",
                          transition: "all 0.2s ease"
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", fontWeight: "700", fontSize: "0.75rem", color: "var(--color-text)" }}>
                          <span>✨</span>
                          <span>Priya (Graduate)</span>
                        </div>
                        <div style={{ fontSize: "0.65rem", color: "var(--color-text-subtle)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          priya@example.com
                        </div>
                      </button>
                    </div>
                  </div>
                </form>
              ) : (
                /* FORGOT PASSWORD FORM */
                <form onSubmit={handleForgotSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.75rem", fontWeight: "700", marginBottom: "0.35rem" }}>
                      Registered Account Email
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
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        placeholder="Enter your registered email"
                        className="auth-form-input"
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.75rem", fontWeight: "700", marginBottom: "0.35rem" }}>
                      New Password
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
                        type="password"
                        required
                        value={forgotNewPassword}
                        onChange={(e) => setForgotNewPassword(e.target.value)}
                        placeholder="At least 6 characters"
                        className="auth-form-input"
                      />
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      type="button"
                      onClick={() => {
                        setViewMode("signin");
                        setErrorMsg("");
                        setSuccessMsg("");
                      }}
                      className="btn-vibrant-secondary"
                      style={{ flex: 1, padding: "0.65rem", fontSize: "0.75rem" }}
                    >
                      Back to Sign In
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="btn-vibrant-primary"
                      style={{ flex: 1, padding: "0.65rem", fontSize: "0.75rem" }}
                    >
                      {isLoading ? <RefreshCw size={14} className="animate-spin" /> : "Save New Password"}
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Bottom Switch to Sign Up */}
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
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => onNavigate && onNavigate("signup")}
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
                Create Account Free →
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
