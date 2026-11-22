import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { CartIcon } from "./Icons";
import { useCart } from "../context/CartContext";

export function AppShell({ children }) {
  const { totalCount, grandTotal } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
          <NavLink
            to="/add-dish"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            + Add Dish
          </NavLink>
          <NavLink
            to="/admin/manage"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Admin Panel
          </NavLink>
        </nav>

        <div className="topbar-actions">
          <Link to="/cart" className="cart-pill-btn" aria-label="View Shopping Cart">
            <CartIcon size={20} />
            <span>₹{grandTotal > 0 ? grandTotal : 0}</span>
            <span className="cart-counter-badge">{totalCount}</span>
          </Link>

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
        </div>
        <p>© {new Date().getFullYear()} Foodly Inc. Fresh gourmet dishes delivered fast with care.</p>
      </footer>
    </div>
  );
}
