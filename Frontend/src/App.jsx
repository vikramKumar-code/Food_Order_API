import React from "react";
import { Routes, Route } from "react-router-dom";
import { AppShell } from "./components/AppShell";
import Hero from "./pages/Hero";
import { DishesPage } from "./pages/DishesPage";
import { DishDetailsPage } from "./pages/DishDetailsPage";
import { AddDishPage } from "./pages/AddDishPage";
import { AdminManagePage } from "./pages/AdminManagePage";
import { CartPage } from "./pages/CartPage";
import { DishesProvider } from "./context/DishesContext";
import { CartProvider } from "./context/CartContext";

function App() {
  return (
    <DishesProvider>
      <CartProvider>
        <AppShell>
          <Routes>
            <Route path="/" element={<Hero />} />
            <Route path="/dishes" element={<DishesPage />} />
            <Route path="/dish/:id" element={<DishDetailsPage />} />
            <Route path="/add-dish" element={<AddDishPage />} />
            <Route path="/admin/manage" element={<AdminManagePage />} />
            <Route path="/cart" element={<CartPage />} />
            {/* Fallback to Home */}
            <Route path="*" element={<Hero />} />
          </Routes>
        </AppShell>
      </CartProvider>
    </DishesProvider>
  );
}

export default App;
