import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { SectionHeading } from "../components/SectionHeading";
import { ArrowRightIcon, SparklesIcon } from "../components/Icons";

export function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register, loading, user } = useAuth();

  const [mode, setMode] = useState("login"); // "login" | "register"
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const from = location.state?.from || "/";

  // If already logged in, show account info
  if (user) {
    return (
      <section className="page-section" style={{ maxWidth: "560px", margin: "2rem auto", textAlign: "center", padding: "3rem 2rem" }}>
        <div style={{
          width: "72px",
          height: "72px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #ff6b3d, #ff4d15)",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "2rem",
          margin: "0 auto 1.2rem",
          fontWeight: 800,
        }}>
          {user.name ? user.name.charAt(0).toUpperCase() : "U"}
        </div>
        <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.8rem", fontWeight: 800 }}>
          {user.name}
        </h2>
        <p style={{ color: "var(--color-slate-400)", marginBottom: "0.5rem" }}>{user.email}</p>
        <span style={{
          display: "inline-block",
          background: user.role === "admin" ? "var(--color-primary-light)" : "var(--color-slate-100)",
          color: user.role === "admin" ? "var(--color-primary)" : "var(--color-slate-600)",
          fontWeight: 700,
          padding: "0.3rem 0.85rem",
          borderRadius: "var(--radius-full)",
          fontSize: "0.82rem",
          textTransform: "uppercase",
          marginBottom: "2rem",
        }}>
          Role: {user.role || "user"}
        </span>

        <div style={{ display: "flex", gap: "0.85rem", justifyContent: "center" }}>
          <button type="button" onClick={() => navigate("/dishes")}>
            Explore Menu <ArrowRightIcon size={16} />
          </button>
          {user.role === "admin" && (
            <button type="button" className="secondary-button" onClick={() => navigate("/admin/manage")}>
              Admin Panel
            </button>
          )}
        </div>
      </section>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (mode === "register") {
      if (!name.trim()) {
        setError("Please enter your name");
        return;
      }
      if (password.length < 6) {
        setError("Password should be at least 6 characters");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }
      const res = await register(name, email, password);
      if (res.success) {
        navigate(from, { replace: true });
      } else {
        setError(res.message || "Failed to register");
      }
    } else {
      if (!email || !password) {
        setError("Please enter email and password");
        return;
      }
      const res = await login(email, password);
      if (res.success) {
        navigate(from, { replace: true });
      } else {
        setError(res.message || "Invalid credentials");
      }
    }
  };

  const handleFillDemo = (type) => {
    if (type === "admin") {
      setEmail("admin@test.com");
      setPassword("admin123");
    } else {
      setEmail("user@test.com");
      setPassword("password123");
    }
    setError("");
  };

  return (
    <section className="page-section" style={{ maxWidth: "540px", margin: "1.5rem auto", padding: "2.5rem 2rem" }}>
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <span className="eyebrow">
          <SparklesIcon size={14} /> Foodly Account
        </span>
        <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "2rem", fontWeight: 800, marginTop: "0.4rem" }}>
          {mode === "login" ? "Welcome Back, Foodie!" : "Join Foodly Kitchen"}
        </h2>
        <p style={{ color: "var(--color-slate-600)", fontSize: "0.95rem" }}>
          {mode === "login"
            ? "Sign in to track orders, manage your cart, and checkout faster."
            : "Create your account to unlock special culinary discounts."}
        </p>
      </div>

      {/* Tabs */}
      <div style={{
        display: "flex",
        background: "var(--color-slate-100)",
        padding: "0.35rem",
        borderRadius: "var(--radius-full)",
        marginBottom: "1.8rem"
      }}>
        <button
          type="button"
          style={{
            flex: 1,
            padding: "0.65rem",
            fontSize: "0.9rem",
            borderRadius: "var(--radius-full)",
            background: mode === "login" ? "#ffffff" : "transparent",
            color: mode === "login" ? "var(--color-secondary)" : "var(--color-slate-600)",
            boxShadow: mode === "login" ? "var(--shadow-sm)" : "none",
            border: "none",
          }}
          onClick={() => { setMode("login"); setError(""); }}
        >
          Sign In
        </button>
        <button
          type="button"
          style={{
            flex: 1,
            padding: "0.65rem",
            fontSize: "0.9rem",
            borderRadius: "var(--radius-full)",
            background: mode === "register" ? "#ffffff" : "transparent",
            color: mode === "register" ? "var(--color-secondary)" : "var(--color-slate-600)",
            boxShadow: mode === "register" ? "var(--shadow-sm)" : "none",
            border: "none",
          }}
          onClick={() => { setMode("register"); setError(""); }}
        >
          Create Account
        </button>
      </div>

      {error && (
        <div style={{
          padding: "0.75rem 1rem",
          background: "var(--color-nonveg-bg)",
          color: "var(--color-nonveg)",
          borderRadius: "var(--radius-md)",
          fontSize: "0.88rem",
          fontWeight: 600,
          marginBottom: "1.2rem"
        }}>
          ⚠️ {error}
        </div>
      )}

      {/* Auth Form */}
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
        {mode === "register" && (
          <label style={{ display: "flex", flexDirection: "column", gap: "0.4rem", fontSize: "0.88rem", fontWeight: 600 }}>
            Full Name
            <input
              type="text"
              placeholder="e.g. Rahul Sharma"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                padding: "0.85rem 1rem",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-subtle)",
                background: "var(--color-slate-50)",
                outline: "none",
              }}
              required
            />
          </label>
        )}

        <label style={{ display: "flex", flexDirection: "column", gap: "0.4rem", fontSize: "0.88rem", fontWeight: 600 }}>
          Email Address
          <input
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              padding: "0.85rem 1rem",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--border-subtle)",
              background: "var(--color-slate-50)",
              outline: "none",
            }}
            required
          />
        </label>

        <label style={{ display: "flex", flexDirection: "column", gap: "0.4rem", fontSize: "0.88rem", fontWeight: 600 }}>
          Password
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              padding: "0.85rem 1rem",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--border-subtle)",
              background: "var(--color-slate-50)",
              outline: "none",
            }}
            required
          />
        </label>

        {mode === "register" && (
          <label style={{ display: "flex", flexDirection: "column", gap: "0.4rem", fontSize: "0.88rem", fontWeight: 600 }}>
            Confirm Password
            <input
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={{
                padding: "0.85rem 1rem",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-subtle)",
                background: "var(--color-slate-50)",
                outline: "none",
              }}
              required
            />
          </label>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{ width: "100%", padding: "0.95rem", marginTop: "0.5rem" }}
        >
          {loading ? "Processing..." : (mode === "login" ? "Sign In to Foodly" : "Create My Account")}
          {!loading && <ArrowRightIcon size={16} />}
        </button>
      </form>

      {/* Quick Demo Credentials */}
      <div style={{ marginTop: "2rem", paddingTop: "1.4rem", borderTop: "1px solid var(--color-slate-100)", textAlign: "center" }}>
        <p style={{ fontSize: "0.8rem", color: "var(--color-slate-400)", fontWeight: 700, textTransform: "uppercase", marginBottom: "0.75rem" }}>
          ⚡ One-Click Demo Credentials
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: "0.6rem", flexWrap: "wrap" }}>
          <button
            type="button"
            className="secondary-button"
            style={{ padding: "0.45rem 0.85rem", fontSize: "0.8rem" }}
            onClick={() => handleFillDemo("user")}
          >
            👤 Demo User (user@test.com)
          </button>
          <button
            type="button"
            className="secondary-button"
            style={{ padding: "0.45rem 0.85rem", fontSize: "0.8rem" }}
            onClick={() => handleFillDemo("admin")}
          >
            🛡️ Demo Admin (admin@test.com)
          </button>
        </div>
      </div>
    </section>
  );
}
