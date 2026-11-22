import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem("foodly_cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [coupon, setCoupon] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem("foodly_cart", JSON.stringify(cartItems));
    } catch (e) {
      console.error("Failed to save cart to localStorage", e);
    }
  }, [cartItems]);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 2800);
  };

  const addToCart = (dish, qty = 1) => {
    const dishId = dish._id || dish.id;
    setCartItems((prev) => {
      const existingIndex = prev.findIndex((item) => (item._id || item.id) === dishId);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + qty,
        };
        return updated;
      } else {
        return [
          ...prev,
          {
            id: dishId,
            _id: dishId,
            name: dish.name,
            price: Number(dish.price),
            category: dish.category || "General",
            veg: dish.veg !== undefined ? dish.veg : true,
            img: dish.img || dish.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
            quantity: qty,
          },
        ];
      }
    });
    showToast(`Added "${dish.name}" to cart! 🛒`);
  };

  const updateQuantity = (dishId, newQty) => {
    if (newQty <= 0) {
      deleteItem(dishId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        (item._id || item.id) === dishId ? { ...item, quantity: newQty } : item
      )
    );
  };

  const deleteItem = (dishId) => {
    setCartItems((prev) => {
      const itemToRemove = prev.find((i) => (i._id || i.id) === dishId);
      if (itemToRemove) {
        showToast(`Removed "${itemToRemove.name}" from cart`, "info");
      }
      return prev.filter((item) => (item._id || item.id) !== dishId);
    });
  };

  const clearCart = () => {
    setCartItems([]);
    setCoupon("");
    setDiscountPercent(0);
    showToast("Cart has been cleared", "info");
  };

  const applyCoupon = (code) => {
    const normalized = (code || "").trim().toUpperCase();
    if (normalized === "FOODLY20") {
      setCoupon("FOODLY20");
      setDiscountPercent(20);
      showToast("Coupon 'FOODLY20' applied! 20% OFF 🎉", "success");
      return { success: true, message: "20% discount applied!" };
    } else if (normalized === "WELCOME50") {
      setCoupon("WELCOME50");
      setDiscountPercent(50);
      showToast("Coupon 'WELCOME50' applied! 50% OFF 🚀", "success");
      return { success: true, message: "50% discount applied!" };
    } else {
      showToast("Invalid coupon code", "error");
      return { success: false, message: "Invalid coupon. Try 'FOODLY20' or 'WELCOME50'." };
    }
  };

  const removeCoupon = () => {
    setCoupon("");
    setDiscountPercent(0);
    showToast("Coupon removed", "info");
  };

  const totalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = Math.round((subtotal * discountPercent) / 100);
  const deliveryFee = subtotal > 350 || subtotal === 0 ? 0 : 40;
  const taxes = Math.round(subtotal * 0.05);
  const grandTotal = Math.max(0, subtotal - discount + deliveryFee + taxes);

  const getItemQuantity = (dishId) => {
    const found = cartItems.find((item) => (item._id || item.id) === dishId);
    return found ? found.quantity : 0;
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        totalCount,
        subtotal,
        deliveryFee,
        taxes,
        discount,
        coupon,
        discountPercent,
        grandTotal,
        addToCart,
        updateQuantity,
        deleteItem,
        clearCart,
        applyCoupon,
        removeCoupon,
        getItemQuantity,
        toast,
        showToast,
      }}
    >
      {children}
      {toast && (
        <aside
          role="status"
          aria-live="polite"
          className={`toast-alert toast-${toast.type || "success"}`}
        >
          <span>{toast.message}</span>
        </aside>
      )}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

