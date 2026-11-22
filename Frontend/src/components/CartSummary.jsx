import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { VegIcon, NonVegIcon, PlusIcon, MinusIcon, TrashIcon, ArrowRightIcon, CheckCircleIcon } from "./Icons";

export function CartSummary() {
  const navigate = useNavigate();
  const {
    cartItems,
    subtotal,
    deliveryFee,
    taxes,
    discount,
    coupon,
    applyCoupon,
    removeCoupon,
    grandTotal,
    updateQuantity,
    deleteItem,
    clearCart,
  } = useCart();

  const [couponInput, setCouponInput] = useState("");
  const [address, setAddress] = useState("Flat 402, Sunshine Heights, Tech Park Road, Bangalore");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [orderPlaced, setOrderPlaced] = useState(false);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    applyCoupon(couponInput);
    setCouponInput("");
  };

  const handlePlaceOrder = () => {
    setOrderPlaced(true);
    setTimeout(() => {
      clearCart();
    }, 1500);
  };

  if (orderPlaced) {
    return (
      <div className="page-section" style={{ textAlign: "center", padding: "4rem 2rem" }}>
        <div style={{
          width: "70px",
          height: "70px",
          borderRadius: "50%",
          background: "var(--color-veg-bg)",
          color: "var(--color-veg)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 1.5rem"
        }}>
          <CheckCircleIcon size={38} />
        </div>
        <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "2rem", fontWeight: 800, marginBottom: "0.5rem" }}>
          Order Placed Successfully! 🎉
        </h2>
        <p style={{ color: "var(--color-slate-600)", maxWidth: "480px", margin: "0 auto 2rem" }}>
          Thank you! Your delicious meal is being prepared with love and will arrive at <strong>{address}</strong> in ~30 minutes.
        </p>
        <button type="button" onClick={() => navigate("/dishes")}>
          Order More Food <ArrowRightIcon size={16} />
        </button>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="zero-state-box">
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🛒</div>
        <h3>Your Cart is Empty</h3>
        <p style={{ color: "var(--color-slate-400)", marginBottom: "1.5rem" }}>
          Explore our tasty dishes and treat yourself today!
        </p>
        <button type="button" onClick={() => navigate("/dishes")}>
          Browse Dishes Menu <ArrowRightIcon size={16} />
        </button>
      </div>
    );
  }

  return (
    <div className="cart-grid-layout">
      {/* Left Column: Items & Delivery Address */}
      <div className="cart-items-panel">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
          <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.3rem", fontWeight: 800 }}>
            Cart Items ({cartItems.length})
          </h3>
          <button
            type="button"
            className="secondary-button"
            style={{ padding: "0.4rem 0.85rem", fontSize: "0.82rem" }}
            onClick={clearCart}
          >
            Clear All
          </button>
        </div>

        {cartItems.map((item) => {
          const itemId = item._id || item.id;
          return (
            <article key={itemId} className="cart-item-row">
              <div className="cart-item-thumb">
                <img
                  src={item.img || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"}
                  alt={item.name}
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c";
                  }}
                />
              </div>

              <div className="cart-item-info">
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  {item.veg ? <VegIcon size={14} /> : <NonVegIcon size={14} />}
                  <h4>{item.name}</h4>
                </div>
                <span style={{ fontSize: "0.82rem", color: "var(--color-slate-400)" }}>
                  {item.category} • ₹{item.price} each
                </span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <div className="qty-stepper">
                  <button
                    type="button"
                    onClick={() => updateQuantity(itemId, item.quantity - 1)}
                    aria-label="Decrease quantity"
                  >
                    <MinusIcon size={13} />
                  </button>
                  <span className="qty-display">{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(itemId, item.quantity + 1)}
                    aria-label="Increase quantity"
                  >
                    <PlusIcon size={13} />
                  </button>
                </div>

                <span className="cart-item-price">₹{item.price * item.quantity}</span>

                <button
                  type="button"
                  className="danger-button"
                  style={{ padding: "0.45rem", borderRadius: "50%", minWidth: "32px", height: "32px" }}
                  onClick={() => deleteItem(itemId)}
                  title="Remove item"
                >
                  <TrashIcon size={14} />
                </button>
              </div>
            </article>
          );
        })}

        {/* Delivery Address & Instructions */}
        <div className="page-section" style={{ marginTop: "1rem", padding: "1.5rem" }}>
          <h4 style={{ fontFamily: "var(--font-heading)", fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.8rem" }}>
            📍 Delivery Details
          </h4>
          <input
            type="text"
            style={{
              width: "100%",
              padding: "0.75rem 1rem",
              border: "1px solid var(--border-subtle)",
              borderRadius: "var(--radius-md)",
              fontSize: "0.92rem",
              outline: "none",
            }}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter complete delivery address"
          />
        </div>

        {/* Payment Method Selector */}
        <div className="page-section" style={{ padding: "1.5rem" }}>
          <h4 style={{ fontFamily: "var(--font-heading)", fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.8rem" }}>
            💳 Payment Method
          </h4>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <label style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.75rem 1.1rem",
              border: `2px solid ${paymentMethod === "cod" ? "var(--color-primary)" : "var(--color-slate-200)"}`,
              borderRadius: "var(--radius-md)",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "0.92rem"
            }}>
              <input
                type="radio"
                name="paymentMethod"
                value="cod"
                checked={paymentMethod === "cod"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              💵 Cash on Delivery (COD)
            </label>

            <label style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.75rem 1.1rem",
              border: `2px solid ${paymentMethod === "stripe" ? "var(--color-primary)" : "var(--color-slate-200)"}`,
              borderRadius: "var(--radius-md)",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "0.92rem"
            }}>
              <input
                type="radio"
                name="paymentMethod"
                value="stripe"
                checked={paymentMethod === "stripe"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              💳 Online / Card (Stripe)
            </label>
          </div>
        </div>
      </div>

      {/* Right Column: Order Bill Breakdown */}
      <aside className="bill-summary-card">
        <h3>Order Summary</h3>

        <div className="bill-line-item">
          <span>Item Total</span>
          <strong>₹{subtotal}</strong>
        </div>

        <div className="bill-line-item">
          <span>Delivery Partner Fee</span>
          <strong>{deliveryFee === 0 ? <span style={{ color: "var(--color-veg)" }}>FREE</span> : `₹${deliveryFee}`}</strong>
        </div>

        <div className="bill-line-item">
          <span>Govt Taxes & Charges (5%)</span>
          <strong>₹{taxes}</strong>
        </div>

        {discount > 0 && (
          <div className="bill-line-item discount-line">
            <span>Coupon Discount ({coupon})</span>
            <strong>- ₹{discount}</strong>
          </div>
        )}

        {/* Promo Coupon Form */}
        <div style={{ marginTop: "1rem" }}>
          <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--color-slate-400)", textTransform: "uppercase" }}>
            Have a Promo Code? (Try: FOODLY20 or WELCOME50)
          </span>
          {coupon ? (
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: "var(--color-veg-bg)",
              padding: "0.6rem 0.9rem",
              borderRadius: "var(--radius-md)",
              marginTop: "0.4rem"
            }}>
              <span style={{ color: "var(--color-veg)", fontWeight: 700, fontSize: "0.88rem" }}>
                ✓ Coupon "{coupon}" applied
              </span>
              <button
                type="button"
                className="secondary-button"
                style={{ padding: "0.2rem 0.6rem", fontSize: "0.75rem", background: "transparent", border: "none" }}
                onClick={removeCoupon}
              >
                Remove
              </button>
            </div>
          ) : (
            <form onSubmit={handleApplyCoupon} className="coupon-input-wrap">
              <input
                type="text"
                placeholder="PROMO CODE"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
              />
              <button type="submit">Apply</button>
            </form>
          )}
        </div>

        <div className="bill-line-item total-line">
          <span>To Pay</span>
          <span style={{ color: "var(--color-primary)" }}>₹{grandTotal}</span>
        </div>

        <button
          type="button"
          style={{ width: "100%", marginTop: "1.4rem", padding: "0.95rem" }}
          onClick={handlePlaceOrder}
        >
          {paymentMethod === "stripe" ? "Proceed to Stripe Pay" : "Confirm & Place Order"} <ArrowRightIcon size={18} />
        </button>
      </aside>
    </div>
  );
}
