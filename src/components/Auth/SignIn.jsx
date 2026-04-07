import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import logo from "../../assets/img/logo 1.svg";

// Icon components (inline to avoid react-icons dependency issues in preview)
const EyeIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

const DiamondIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2L2 9l10 13L22 9z" />
  </svg>
);

export const SignIn = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [focusedField, setFocusedField] = useState(null);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const attemptLogin = async (email, password) => {
    setIsLoading(true);
    setError("");

    // Dummy user data
    const dummyUsers = {
      "superadmin@dgi.com": {
        id: "superadmin-1",
        name: "Super Admin",
        email: "superadmin@dgi.com",
        role: "superadmin",
        permissions: ["all"],
        createdAt: "2023-01-01T00:00:00Z",
      },
      "vendor@dgi.com": {
        id: "v-001",
        name: "Ramesh Jewellers",
        email: "vendor@dgi.com",
        role: "vendor",
        businessName: "Ramesh Jewellers Pvt Ltd",
        gstin: "27AABCU9603R1ZX",
        kycStatus: "verified",
        phone: "+91-9876543210",
        address: "123 MG Road, Mumbai, Maharashtra 400001",
        totalRevenue: 1250000,
        totalOrders: 15,
        createdAt: "2023-01-15T10:00:00Z",
      },
    };

    // Credentials
    const validCredentials = {
      "superadmin@dgi.com": "admin123",
      "vendor@dgi.com": "vendor123",
    };

    try {
      await new Promise((r) => setTimeout(r, 500)); // Simulate network delay

      const user = dummyUsers[email];
      const correctPassword = validCredentials[email];

      // Check if user exists and password is correct
      if (user && password === correctPassword) {
        // Use AuthContext login with user object (triggers demo mode)
        const dummyToken = `demo-token-${Date.now()}`;
        const result = await login(user, dummyToken);

        if (result.success) {
          // Small delay for better UX
          await new Promise((r) => setTimeout(r, 300));

          // Redirect based on role
          if (user.role === "vendor") {
            navigate("/vendor/dashboard");
          } else if (user.role === "superadmin") {
            navigate("/superadmin/dashboard");
          }
        } else {
          setError(result.error || "Login failed");
        }
      } else {
        setError("Invalid email or password. Try demo buttons below.");
      }
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignInClick = (e) => {
    e.preventDefault();
    attemptLogin(formData.email, formData.password);
  };

  const fillDemo = (role) => {
    const creds =
      role === "superadmin"
        ? { email: "superadmin@dgi.com", password: "admin123" }
        : { email: "vendor@dgi.com", password: "vendor123" };
    setFormData(creds);
    attemptLogin(creds.email, creds.password);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .signin-root {
          min-height: 100vh;
          width: 100%;
          display: grid;
          grid-template-columns: 1fr 1fr;
          font-family: 'DM Sans', sans-serif;
          background: #0d0a08;
          overflow: hidden;
        }

        /* ── LEFT PANEL ── */
        .left-panel {
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 64px 56px;
          overflow: hidden;
          background: #0d0a08;
        }

        /* Radial glow behind content */
        .left-panel::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 70% 60% at 30% 40%, rgba(196,155,69,0.13) 0%, transparent 70%),
            radial-gradient(ellipse 50% 80% at 80% 80%, rgba(120,70,20,0.08) 0%, transparent 60%);
          pointer-events: none;
        }

        /* Fine diagonal grid lines */
        .left-panel::after {
          content: '';
          position: absolute;
          inset: 0;
          background-image: repeating-linear-gradient(
            135deg,
            rgba(196,155,69,0.04) 0px,
            rgba(196,155,69,0.04) 1px,
            transparent 1px,
            transparent 48px
          );
          pointer-events: none;
        }

        .brand-mark {
          position: relative;
          z-index: 1;
          margin-bottom: 48px;
        }

        .brand-logo {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 8px;
        }

        .brand-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2rem;
          font-weight: 600;
          letter-spacing: 0.12em;
          color: #e8c878;
          text-transform: uppercase;
        }

        .brand-sub {
          font-size: 0.68rem;
          letter-spacing: 0.3em;
          color: #7a6040;
          text-transform: uppercase;
          margin-left: 58px;
        }

        .divider-line {
          width: 48px;
          height: 1px;
          background: linear-gradient(90deg, #c49b45, transparent);
          margin: 32px 0;
        }

        .left-headline {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2.6rem;
          font-weight: 300;
          line-height: 1.25;
          color: #f0e6d0;
          margin-bottom: 12px;
        }

        .left-headline em {
          font-style: italic;
          color: #c49b45;
        }

        .left-sub {
          font-size: 0.8rem;
          color: #6a5840;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          margin-bottom: 40px;
        }

        .features-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .features-list li {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          font-size: 0.82rem;
          color: #9a8570;
          line-height: 1.5;
        }

        .feature-dot {
          color: #c49b45;
          margin-top: 2px;
          flex-shrink: 0;
        }

        .feature-strong {
          color: #c8b080;
          font-weight: 500;
        }

        .trust-badge {
          position: relative;
          z-index: 1;
          margin-top: auto;
          padding-top: 40px;
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.72rem;
          color: #4a3820;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .trust-badge::before {
          content: '';
          width: 24px;
          height: 1px;
          background: #4a3820;
        }

        /* ── RIGHT PANEL ── */
        .right-panel {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 48px 40px;
          background: #faf8f5;
          position: relative;
        }

        /* Subtle top-left gold corner accent */
        .right-panel::before {
          content: '';
          position: absolute;
          top: 0; left: 0;
          width: 120px; height: 3px;
          background: linear-gradient(90deg, #c49b45, transparent);
        }

        .form-container {
          width: 100%;
          max-width: 400px;
          animation: fadeUp 0.6s ease both;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .form-header {
          margin-bottom: 36px;
        }

        .form-eyebrow {
          font-size: 0.68rem;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: #c49b45;
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .form-eyebrow::after {
          content: '';
          flex: 1;
          height: 1px;
          background: linear-gradient(90deg, rgba(196,155,69,0.3), transparent);
        }

        .form-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2.4rem;
          font-weight: 500;
          color: #1a1208;
          letter-spacing: -0.01em;
        }

        .form-title span {
          color: #c49b45;
        }

        /* Error */
        .error-box {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #fff5f5;
          border: 1px solid #fecaca;
          border-left: 3px solid #ef4444;
          border-radius: 6px;
          padding: 10px 14px;
          font-size: 0.8rem;
          color: #c53030;
          margin-bottom: 20px;
          animation: shake 0.3s ease;
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }

        /* Field */
        .field-group {
          margin-bottom: 20px;
        }

        .field-label {
          display: block;
          font-size: 0.72rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #7a6850;
          margin-bottom: 8px;
          font-weight: 500;
        }

        .field-wrapper {
          position: relative;
        }

        .field-input {
          width: 100%;
          padding: 14px 16px;
          background: #ffffff;
          border: 1.5px solid #e8e0d4;
          border-radius: 8px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.9rem;
          color: #1a1208;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          -webkit-appearance: none;
        }

        .field-input::placeholder { color: #c0b8ac; }

        .field-input:focus {
          border-color: #c49b45;
          box-shadow: 0 0 0 3px rgba(196,155,69,0.12);
        }

        .field-input.has-icon { padding-right: 46px; }

        .eye-btn {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: #a09080;
          display: flex;
          align-items: center;
          padding: 0;
          transition: color 0.2s;
        }
        .eye-btn:hover { color: #c49b45; }

        /* Remember + Forgot */
        .form-options {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 28px;
        }

        .remember-label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.8rem;
          color: #7a6850;
          cursor: pointer;
          user-select: none;
        }

        .remember-label input[type="checkbox"] {
          width: 16px;
          height: 16px;
          accent-color: #c49b45;
          cursor: pointer;
        }

        .forgot-link {
          font-size: 0.8rem;
          color: #c49b45;
          text-decoration: none;
          letter-spacing: 0.05em;
          border-bottom: 1px solid transparent;
          transition: border-color 0.2s;
        }
        .forgot-link:hover { border-color: #c49b45; }

        /* Submit button */
        .submit-btn {
          width: 100%;
          padding: 15px;
          background: linear-gradient(135deg, #b8892e 0%, #d4aa50 50%, #b8892e 100%);
          background-size: 200% auto;
          border: none;
          border-radius: 8px;
          color: #0d0a08;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.85rem;
          font-weight: 600;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          cursor: pointer;
          transition: background-position 0.4s, transform 0.15s, opacity 0.2s;
          position: relative;
          overflow: hidden;
          margin-bottom: 24px;
        }

        .submit-btn:hover:not(:disabled) {
          background-position: right center;
          transform: translateY(-1px);
        }

        .submit-btn:active:not(:disabled) { transform: translateY(0); }
        .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .submit-btn .loader {
          display: inline-block;
          width: 14px;
          height: 14px;
          border: 2px solid rgba(0,0,0,0.2);
          border-top-color: #0d0a08;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
          vertical-align: middle;
          margin-right: 8px;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        /* Demo divider */
        .demo-divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 14px;
        }

        .demo-divider span {
          font-size: 0.7rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #c0b0a0;
          white-space: nowrap;
        }

        .demo-divider::before,
        .demo-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: #e8e0d4;
        }

        /* Demo buttons */
        .demo-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .demo-btn {
          padding: 11px 12px;
          border-radius: 7px;
          border: 1.5px dashed;
          background: transparent;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }

        .demo-btn:hover { transform: translateY(-1px); }
        .demo-btn:active { transform: translateY(0); }

        .demo-btn.admin {
          border-color: #d4aa50;
          color: #9a7020;
        }
        .demo-btn.admin:hover { background: rgba(196,155,69,0.08); }

        .demo-btn.vendor {
          border-color: #7eb8d4;
          color: #2878a0;
        }
        .demo-btn.vendor:hover { background: rgba(96,168,210,0.08); }

        /* Responsive */
        @media (max-width: 900px) {
          .signin-root { grid-template-columns: 1fr; }
          .left-panel { display: none; }
          .right-panel { padding: 32px 24px; background: #faf8f5; }
        }
      `}</style>

      <div className="signin-root">
        {/* ── LEFT ── */}
        <div className="left-panel">
          <div
            className="brand-mark"
            style={{ position: "relative", zIndex: 1 }}
          >
            <div className="brand-logo">
              <div>
                <img src={logo} alt="DgiGold logo" className="h-30 mb-6" />
              </div>
            </div>
          </div>

          <div style={{ position: "relative", zIndex: 1 }}>
            <div className="divider-line" />
            <h1 className="left-headline">
              The future of
              <br />
              <em>precious metals</em>
              <br />
              is digital.
            </h1>
            <p className="left-sub">Secure · Transparent · Instant</p>

            <ul className="features-list">
              {[
                ["Buy 24K Gold from ₹1", ".999 Fine Silver at live rates"],
                ["99.9% Pure Metals", "Always priced at live market rates"],
                [
                  "Bank-grade Security",
                  "Insured storage · Zero hidden charges",
                ],
                ["Instant Transactions", "Easy withdrawals · Gifting enabled"],
              ].map(([bold, rest], i) => (
                <li key={i}>
                  <span className="feature-dot">
                    <DiamondIcon />
                  </span>
                  <span>
                    <span className="feature-strong">{bold}</span> — {rest}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="trust-badge">
            Thousands investing in digital metals
          </div>
        </div>

        {/* ── RIGHT ── */}
        <div className="right-panel">
          <div className="form-container">
            <div className="form-header">
              <div className="form-eyebrow">Secure Portal</div>
              <h2 className="form-title">
                Welcome <span>back.</span>
              </h2>
            </div>

            {error && (
              <div className="error-box">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {error}
              </div>
            )}

            <form onSubmit={handleSignInClick}>
              <div className="field-group">
                <label className="field-label">Email Address</label>
                <div className="field-wrapper">
                  <input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    className="field-input"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="field-group">
                <label className="field-label">Password</label>
                <div className="field-wrapper">
                  <input
                    type={passwordVisible ? "text" : "password"}
                    name="password"
                    placeholder="Enter your password"
                    className="field-input has-icon"
                    value={formData.password}
                    onChange={handleChange}
                    minLength={8}
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="eye-btn"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                    aria-label={
                      passwordVisible ? "Hide password" : "Show password"
                    }
                  >
                    {passwordVisible ? <EyeIcon /> : <EyeOffIcon />}
                  </button>
                </div>
              </div>

              <div className="form-options">
                <label className="remember-label">
                  <input type="checkbox" />
                  Remember me
                </label>
                <a href="/forgot-password" className="forgot-link">
                  Forgot password?
                </a>
              </div>

              <button type="submit" className="submit-btn" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <span className="loader" />
                    Signing In…
                  </>
                ) : (
                  "Sign In to Dashboard"
                )}
              </button>

              <div className="demo-divider">
                <span>Quick demo access</span>
              </div>

              <div className="demo-grid">
                <button
                  type="button"
                  className="demo-btn admin"
                  onClick={() => fillDemo("superadmin")}
                  disabled={isLoading}
                >
                  👑 Super Admin
                </button>
                <button
                  type="button"
                  className="demo-btn vendor"
                  onClick={() => fillDemo("vendor")}
                  disabled={isLoading}
                >
                  🏪 Vendor
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignIn;