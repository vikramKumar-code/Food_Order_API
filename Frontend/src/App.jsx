import React from "react";
import { Routes, Route } from "react-router-dom";
import { AppShell } from "./components/AppShell";
import Hero from "./pages/Hero";
import { DishesPage } from "./pages/DishesPage";
import { DishDetailsPage } from "./pages/DishDetailsPage";
import { AddDishPage } from "./pages/AddDishPage";
import { AdminManagePage } from "./pages/AdminManagePage";
import { CartPage } from "./pages/CartPage";
import { AuthPage } from "./pages/AuthPage";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { DishesProvider } from "./context/DishesContext";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <CartProvider>
      <AuthProvider>
        <DishesProvider>
          <AppShell>
            <Routes>
              <Route path="/" element={<Hero />} />
              <Route path="/dishes" element={<DishesPage />} />
              <Route path="/dish/:id" element={<DishDetailsPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/auth" element={<AuthPage />} />

              {/* Protected Admin Routes */}
              <Route
                path="/admin/manage"
                element={
                  <ProtectedRoute adminOnly={true}>
                    <AdminManagePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/add-dish"
                element={
                  <ProtectedRoute adminOnly={true}>
                    <AddDishPage />
                  </ProtectedRoute>
                }
              />

              {/* Fallback to Home */}
              <Route path="*" element={<Hero />} />
            </Routes>
          </AppShell>
        </DishesProvider>
      </AuthProvider>
    </CartProvider>
  );
}

export default App;
