import React from "react";
import { Navigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ArrowRightIcon } from "./Icons";

export function ProtectedRoute({ children, adminOnly = false }) {
  const { isAuthenticated, isAdmin, user } = useAuth();
  const location = useLocation();

  // 1. Not logged in -> Redirect to /auth with the attempted path saved
  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
  }

  // 2. Logged in, but route requires admin and user is NOT admin
  if (adminOnly && !isAdmin) {
    return (
      <section className="page-section" style={{ maxWidth: "580px", margin: "3rem auto", textAlign: "center", padding: "3.5rem 2rem" }}>
        <div style={{
          width: "72px",
          height: "72px",
          borderRadius: "50%",
          background: "var(--color-nonveg-bg)",
          color: "var(--color-nonveg)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "2rem",
          margin: "0 auto 1.2rem",
        }}>
          🛡️
        </div>

        <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.9rem", fontWeight: 800, marginBottom: "0.6rem" }}>
          Admin Privileges Required
        </h2>

        <p style={{ color: "var(--color-slate-600)", lineHeight: 1.6, marginBottom: "1.8rem" }}>
          You are currently signed in as <strong>{user?.name}</strong> (<em>role: {user?.role || "user"}</em>).
          Only administrators have permission to access and modify the dashboard.
        </p>

        <div style={{ display: "flex", gap: "0.85rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link to="/">
            <button type="button">Back to Home <ArrowRightIcon size={16} /></button>
          </Link>
          <Link to="/auth">
            <button type="button" className="secondary-button">
              Sign In as Admin
            </button>
          </Link>
        </div>
      </section>
    );
  }

  // 3. User is authorized
  return children;
}
