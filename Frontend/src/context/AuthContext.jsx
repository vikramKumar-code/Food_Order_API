import React, { createContext, useContext, useState, useEffect } from "react";
import { useCart } from "./CartContext";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const { showToast } = useCart();
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("foodly_user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem("foodly_token") || null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      if (user && token) {
        localStorage.setItem("foodly_user", JSON.stringify(user));
        localStorage.setItem("foodly_token", token);
      } else {
        localStorage.removeItem("foodly_user");
        localStorage.removeItem("foodly_token");
      }
    } catch (e) {
      console.error("Failed to sync auth with localStorage", e);
    }
  }, [user, token]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await fetch("/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (res.ok && data.status === "success") {
        setUser(data.data);
        setToken(data.token);
        showToast(`Welcome back, ${data.data.name}! 👋`, "success");
        return { success: true };
      } else {
        const errorMsg = data.message || "Invalid email or password";
        showToast(errorMsg, "error");
        return { success: false, message: errorMsg };
      }
    } catch (err) {
      // Fallback demo mock if backend server is not running
      if (email.includes("admin")) {
        const adminUser = { name: "Admin Chef", email, role: "admin" };
        setUser(adminUser);
        setToken("mock_admin_token_jwt");
        showToast("Logged in as Admin (Demo Mode) 🛡️", "info");
        return { success: true };
      } else {
        const normalUser = { name: email.split("@")[0] || "Foodie User", email, role: "user" };
        setUser(normalUser);
        setToken("mock_user_token_jwt");
        showToast(`Welcome, ${normalUser.name}! (Demo Mode) 👋`, "info");
        return { success: true };
      }
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const res = await fetch("/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();

      if (res.ok && data.status === "success") {
        setUser(data.data);
        setToken(data.token);
        showToast(`Account created! Welcome, ${data.data.name}! 🎉`, "success");
        return { success: true };
      } else {
        const errorMsg = data.message || "Registration failed";
        showToast(errorMsg, "error");
        return { success: false, message: errorMsg };
      }
    } catch (err) {
      // Fallback demo mock if backend server is not running
      const newUser = { name, email, role: "user" };
      setUser(newUser);
      setToken("mock_new_user_token");
      showToast(`Account created for ${name}! (Demo Mode) 🎉`, "info");
      return { success: true };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    showToast("Logged out successfully 👋", "info");
  };

  const isAdmin = user?.role === "admin";
  const isAuthenticated = Boolean(user && token);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated,
        isAdmin,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
