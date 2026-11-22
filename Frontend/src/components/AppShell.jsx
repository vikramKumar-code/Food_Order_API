import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { CartIcon } from "./Icons";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export function AppShell({ children }) {
  const { totalCount, grandTotal } = useCart();
  const { user, isAuthenticated, logout, isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);

  return (
    <div className="app-shell">
      <header className="topbar">
        <Link to="/" className="brand-wrapper" onClick={() => setMobileMenuOpen(false)}>
          <div className="brand-icon-box">
            <span>🍲</span>
          </div>
          <div className="brand-text">
            <h1>Food<span>ly</span></h1>
            <span className="brand-badge">Premium Kitchen</span>
          </div>
        </Link>

        <nav className={`topbar-nav ${mobileMenuOpen ? "mobile-open" : ""}`} aria-label="Main Navigation">
          <NavLink
            to="/"
            end
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Home
          </NavLink>
          <NavLink
            to="/dishes"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Explore Menu
          </NavLink>
          {isAdmin && (
            <NavLink
              to="/add-dish"
              className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              + Add Dish
            </NavLink>
          )}
          <NavLink
            to="/admin/manage"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Admin Panel
          </NavLink>
        </nav>

        <div className="topbar-actions">
          {/* Cart Button */}
          <Link to="/cart" className="cart-pill-btn" aria-label="View Shopping Cart">
            <CartIcon size={20} />
            <span>₹{grandTotal > 0 ? grandTotal : 0}</span>
            <span className="cart-counter-badge">{totalCount}</span>
          </Link>

          {/* User Auth Pill / Button */}
          {isAuthenticated ? (
            <div style={{ position: "relative" }}>
              <button
                type="button"
                className="secondary-button"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.5rem 0.95rem",
                  fontSize: "0.85rem",
                  borderRadius: "var(--radius-full)"
                }}
                onClick={() => setUserDropdown(!userDropdown)}
              >
                <span style={{
                  width: "24px",
                  height: "24px",
                  borderRadius: "50%",
                  background: "var(--color-primary)",
                  color: "#fff",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.75rem",
                  fontWeight: 800
                }}>
                  {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                </span>
                <span>{user.name.split(" ")[0]}</span>
                {isAdmin && <span style={{ fontSize: "0.7rem", color: "var(--color-primary)", fontWeight: 800 }}>🛡️</span>}
              </button>

              {userDropdown && (
                <div style={{
                  position: "absolute",
                  top: "calc(100% + 0.5rem)",
                  right: 0,
                  background: "#ffffff",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "var(--radius-md)",
                  padding: "0.75rem",
                  boxShadow: "var(--shadow-lg)",
                  minWidth: "180px",
                  zIndex: 200,
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.4rem"
                }}>
                  <div style={{ padding: "0.25rem 0.5rem", borderBottom: "1px solid var(--color-slate-100)", marginBottom: "0.3rem" }}>
                    <p style={{ fontWeight: 700, fontSize: "0.88rem", color: "var(--color-secondary)" }}>{user.name}</p>
                    <p style={{ fontSize: "0.75rem", color: "var(--color-slate-400)" }}>{user.email}</p>
                  </div>
                  <Link
                    to="/auth"
                    style={{ fontSize: "0.85rem", padding: "0.4rem 0.5rem", borderRadius: "6px", fontWeight: 600 }}
                    onClick={() => setUserDropdown(false)}
                  >
                    👤 My Profile
                  </Link>
                  <button
                    type="button"
                    className="danger-button"
                    style={{
                      width: "100%",
                      justifyContent: "flex-start",
                      padding: "0.45rem 0.6rem",
                      fontSize: "0.82rem",
                      borderRadius: "6px"
                    }}
                    onClick={() => {
                      logout();
                      setUserDropdown(false);
                    }}
                  >
                    🚪 Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/auth">
              <button
                type="button"
                className="secondary-button"
                style={{ padding: "0.55rem 1.1rem", fontSize: "0.88rem" }}
              >
                Sign In
              </button>
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Mobile Navigation"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              {mobileMenuOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </>
              ) : (
                <>
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </>
              )}
            </svg>
          </button>
        </div>
      </header>

      <main className="page-stack">{children}</main>

      <footer className="app-footer">
        <div className="footer-links">
          <Link to="/">Home</Link>
          <Link to="/dishes">Menu</Link>
          <Link to="/cart">Cart</Link>
          <Link to="/admin/manage">Admin</Link>
          <Link to="/auth">Account</Link>
        </div>
        <p>© {new Date().getFullYear()} Foodly Inc. Fresh gourmet dishes delivered fast with care.</p>
      </footer>
    </div>
  );
}
