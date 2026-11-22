import React from "react";
import { useNavigate } from "react-router-dom";
import { VegIcon, NonVegIcon, StarIcon, ClockIcon, PlusIcon, MinusIcon } from "./Icons";
import { useCart } from "../context/CartContext";

export function FoodCard({
  id,
  _id,
  name,
  category,
  veg,
  availability,
  availablity,
  img,
  imageUrl,
  price,
  description,
  preparationTime = "20 mins",
  badge = "Popular",
  rating = 4.8,
}) {
  const navigate = useNavigate();
  const { addToCart, updateQuantity, getItemQuantity } = useCart();

  const dishId = _id || id;
  const isAvailable = (availability ?? availablity) !== "Out of Stock";
  const displayImage = img || imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c";
  const numPrice = typeof price === "number" ? price : Number(String(price).replace(/[^0-9.]/g, "")) || 0;
  const isVeg = veg === true || veg === "true";
  const currentQty = getItemQuantity(dishId);

  const dishObject = {
    id: dishId,
    _id: dishId,
    name,
    category,
    veg: isVeg,
    img: displayImage,
    price: numPrice,
    description,
    preparationTime,
  };

  return (
    <article className="food-card">
      <div className="food-card-image-wrap">
        <img
          src={displayImage}
          alt={name}
          loading="lazy"
          onError={(e) => {
            e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c";
          }}
        />
        <div className="card-top-tags">
          <span className="badge-tag">{badge}</span>
          <span className="badge-rating">
            <StarIcon size={14} />
            {rating}
          </span>
        </div>
      </div>

      <div className="food-card-body">
        <div className="food-card-header">
          <div className="food-title-row">
            {isVeg ? <VegIcon size={16} /> : <NonVegIcon size={16} />}
            <h3>{name}</h3>
          </div>
        </div>

        <div className="food-card-meta">
          <span>{category}</span>
          <span>•</span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "3px" }}>
            <ClockIcon size={13} /> {preparationTime}
          </span>
        </div>

        <p className="food-card-desc">{description}</p>

        <div className="food-card-footer">
          <span className="food-price">₹{numPrice}</span>

          <div className="food-card-actions">
            <button
              type="button"
              className="secondary-button"
              style={{ padding: "0.5rem 0.85rem", fontSize: "0.85rem" }}
              onClick={() => navigate(`/dish/${dishId}`)}
            >
              Details
            </button>

            {isAvailable ? (
              currentQty > 0 ? (
                <div className="qty-stepper">
                  <button
                    type="button"
                    onClick={() => updateQuantity(dishId, currentQty - 1)}
                    aria-label="Decrease quantity"
                  >
                    <MinusIcon size={14} />
                  </button>
                  <span className="qty-display">{currentQty}</span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(dishId, currentQty + 1)}
                    aria-label="Increase quantity"
                  >
                    <PlusIcon size={14} />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  style={{ padding: "0.5rem 1rem", fontSize: "0.85rem" }}
                  onClick={() => addToCart(dishObject)}
                >
                  Add +
                </button>
              )
            ) : (
              <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--color-slate-400)" }}>
                Sold Out
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
