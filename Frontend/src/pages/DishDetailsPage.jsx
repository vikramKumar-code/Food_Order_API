import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDishes } from "../context/DishesContext";
import { useCart } from "../context/CartContext";
import { VegIcon, NonVegIcon, StarIcon, ClockIcon, PlusIcon, MinusIcon, ArrowRightIcon } from "../components/Icons";

export function DishDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { dishes } = useDishes();
  const { addToCart, updateQuantity, getItemQuantity } = useCart();
  const [qty, setQty] = useState(1);

  const dish = dishes.find(
    (d) => String(d._id || d.id) === String(id)
  );

  if (!dish) {
    return (
      <div className="page-section" style={{ textAlign: "center", padding: "4rem 2rem" }}>
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔍</div>
        <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "2rem", marginBottom: "0.5rem" }}>
          Dish Not Found
        </h2>
        <p style={{ color: "var(--color-slate-400)", marginBottom: "1.5rem" }}>
          The dish you are looking for may have been removed or is temporarily unavailable.
        </p>
        <Link to="/dishes">
          <button type="button">Back to Menu <ArrowRightIcon size={16} /></button>
        </Link>
      </div>
    );
  }

  const dishId = dish._id || dish.id;
  const isVeg = dish.veg === true || dish.veg === "true";
  const displayImage = dish.img || dish.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c";
  const currentCartQty = getItemQuantity(dishId);

  const handleAddToCart = () => {
    addToCart(dish, qty);
  };

  return (
    <section className="page-section">
      {/* Breadcrumb */}
      <nav className="breadcrumb-bar" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>
        <Link to="/dishes">Menu</Link>
        <span>/</span>
        <span style={{ color: "var(--color-secondary)" }}>{dish.name}</span>
      </nav>

      <div className="details-layout">
        {/* Left: Image Container */}
        <div className="details-image-card">
          <img
            src={displayImage}
            alt={dish.name}
            onError={(e) => {
              e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c";
            }}
          />
          <div className="card-top-tags">
            <span className="badge-tag">
              {dish.badge || "Signature Recipe"}
            </span>
            <span className="badge-rating">
              <StarIcon size={14} /> {dish.rating || 4.9} (120+ reviews)
            </span>
          </div>
        </div>

        {/* Right: Info Panel */}
        <div className="details-info-panel">
          <div className="details-top-badges">
            {isVeg ? (
              <span className="chip-btn" style={{ background: "var(--color-veg-bg)", color: "var(--color-veg)", display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
                <VegIcon size={16} /> Pure Vegetarian
              </span>
            ) : (
              <span className="chip-btn" style={{ background: "var(--color-nonveg-bg)", color: "var(--color-nonveg)", display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
                <NonVegIcon size={16} /> Non-Vegetarian
              </span>
            )}

            <span className="chip-btn">
              📁 {dish.category}
            </span>

            <span className="chip-btn" style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
              <ClockIcon size={14} /> {dish.preparationTime || "20-25 mins"}
            </span>
          </div>

          <h2>{dish.name}</h2>

          <div className="details-price-tag">
            ₹{dish.price}
          </div>

          <p style={{ color: "var(--color-slate-600)", fontSize: "1.05rem", lineHeight: 1.65 }}>
            {dish.description}
          </p>

          {/* Specifications Grid */}
          <div className="details-spec-grid">
            <div className="spec-box">
              <span>Category</span>
              <strong>{dish.category}</strong>
            </div>
            <div className="spec-box">
              <span>Preparation</span>
              <strong>{dish.preparationTime || "20 mins"}</strong>
            </div>
            <div className="spec-box">
              <span>Dietary</span>
              <strong>{isVeg ? "100% Veg 🌱" : "Non-Veg 🍗"}</strong>
            </div>
            <div className="spec-box">
              <span>Availability</span>
              <strong style={{ color: (dish.availability !== "Out of Stock") ? "var(--color-veg)" : "var(--color-nonveg)" }}>
                {dish.availability || "In Stock (Fresh)"}
              </strong>
            </div>
          </div>

          {/* Action Row */}
          <div className="details-actions-row">
            {currentCartQty > 0 ? (
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <span style={{ fontWeight: 700, fontSize: "0.95rem" }}>In Cart:</span>
                <div className="qty-stepper" style={{ padding: "0.3rem" }}>
                  <button
                    type="button"
                    onClick={() => updateQuantity(dishId, currentCartQty - 1)}
                    aria-label="Decrease quantity"
                  >
                    <MinusIcon size={16} />
                  </button>
                  <span className="qty-display" style={{ fontSize: "1.1rem", minWidth: "36px" }}>
                    {currentCartQty}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(dishId, currentCartQty + 1)}
                    aria-label="Increase quantity"
                  >
                    <PlusIcon size={16} />
                  </button>
                </div>
                <button type="button" onClick={() => navigate("/cart")}>
                  View in Cart <ArrowRightIcon size={16} />
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
                <div className="qty-stepper" style={{ padding: "0.2rem" }}>
                  <button
                    type="button"
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    aria-label="Decrease quantity"
                  >
                    <MinusIcon size={14} />
                  </button>
                  <span className="qty-display">{qty}</span>
                  <button
                    type="button"
                    onClick={() => setQty(qty + 1)}
                    aria-label="Increase quantity"
                  >
                    <PlusIcon size={14} />
                  </button>
                </div>

                <button type="button" onClick={handleAddToCart} style={{ padding: "0.85rem 1.8rem" }}>
                  Add to Cart (₹{dish.price * qty}) 🛒
                </button>

                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => navigate("/dishes")}
                >
                  Back to Menu
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
