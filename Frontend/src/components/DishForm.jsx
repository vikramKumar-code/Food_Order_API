import React, { useState, useEffect } from "react";
import { VegIcon, NonVegIcon } from "./Icons";

const initialForm = {
  name: "",
  category: "Main Course",
  price: "",
  img: "",
  description: "",
  preparationTime: "20 mins",
  veg: true,
  availability: "Available",
};

export function DishForm({
  title = "Dish Information",
  subtitle = "Fill in the details below to save the dish.",
  submitLabel = "Save Dish",
  initialData = null,
  onSubmitDish,
  onCancel,
}) {
  const [formData, setFormData] = useState(initialForm);
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        category: initialData.category || "Main Course",
        price: initialData.price || "",
        img: initialData.img || initialData.imageUrl || "",
        description: initialData.description || "",
        preparationTime: initialData.preparationTime || "20 mins",
        veg: initialData.veg !== undefined ? initialData.veg : true,
        availability: initialData.availability || initialData.availablity || "Available",
      });
    } else {
      setFormData(initialForm);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (error) setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError("Please provide a dish name.");
      return;
    }
    if (!formData.price || Number(formData.price) <= 0) {
      setError("Please provide a valid price.");
      return;
    }

    if (onSubmitDish) {
      onSubmitDish({
        ...formData,
        price: Number(formData.price),
      });
    }

    if (!initialData) {
      setFormData(initialForm);
    }
  };

  return (
    <section className="page-section" style={{ padding: "1.8rem" }}>
      <div style={{ marginBottom: "1.4rem" }}>
        <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.35rem", fontWeight: 800 }}>
          {title}
        </h3>
        <p style={{ color: "var(--color-slate-400)", fontSize: "0.9rem" }}>{subtitle}</p>
      </div>

      {error && (
        <div style={{
          padding: "0.75rem 1rem",
          background: "var(--color-nonveg-bg)",
          color: "var(--color-nonveg)",
          borderRadius: "var(--radius-md)",
          fontSize: "0.88rem",
          fontWeight: 600,
          marginBottom: "1rem"
        }}>
          ⚠️ {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="dish-form-modern">
        <label>
          Dish Name *
          <input
            type="text"
            name="name"
            placeholder="e.g. Paneer Butter Masala"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Category *
          <select name="category" value={formData.category} onChange={handleChange}>
            <option value="Main Course">Main Course</option>
            <option value="Breakfast">Breakfast</option>
            <option value="Snacks">Snacks</option>
            <option value="Dessert">Dessert</option>
            <option value="Beverages">Beverages</option>
          </select>
        </label>

        <label>
          Price (₹) *
          <input
            type="number"
            name="price"
            placeholder="250"
            min="1"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Dietary Type *
          <div style={{ display: "flex", gap: "0.85rem", marginTop: "0.4rem" }}>
            <button
              type="button"
              className={`chip-btn ${formData.veg ? "active" : ""}`}
              style={{
                background: formData.veg ? "var(--color-veg-bg)" : "var(--color-slate-100)",
                color: formData.veg ? "var(--color-veg)" : "var(--color-slate-600)",
                borderColor: formData.veg ? "var(--color-veg)" : "transparent",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                padding: "0.6rem 1rem",
              }}
              onClick={() => setFormData((p) => ({ ...p, veg: true }))}
            >
              <VegIcon size={16} /> Pure Veg
            </button>
            <button
              type="button"
              className={`chip-btn ${!formData.veg ? "active" : ""}`}
              style={{
                background: !formData.veg ? "var(--color-nonveg-bg)" : "var(--color-slate-100)",
                color: !formData.veg ? "var(--color-nonveg)" : "var(--color-slate-600)",
                borderColor: !formData.veg ? "var(--color-nonveg)" : "transparent",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                padding: "0.6rem 1rem",
              }}
              onClick={() => setFormData((p) => ({ ...p, veg: false }))}
            >
              <NonVegIcon size={16} /> Non-Veg
            </button>
          </div>
        </label>

        <label className="full-col">
          Image URL
          <input
            type="url"
            name="img"
            placeholder="https://images.unsplash.com/..."
            value={formData.img}
            onChange={handleChange}
          />
          {formData.img && (
            <div className="img-preview-box">
              <img
                src={formData.img}
                alt="Dish Preview"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            </div>
          )}
        </label>

        <label className="full-col">
          Description
          <textarea
            rows="3"
            name="description"
            placeholder="A short mouth-watering description..."
            value={formData.description}
            onChange={handleChange}
          ></textarea>
        </label>

        <label>
          Preparation Time
          <input
            type="text"
            name="preparationTime"
            placeholder="25 mins"
            value={formData.preparationTime}
            onChange={handleChange}
          />
        </label>

        <label>
          Availability
          <select name="availability" value={formData.availability} onChange={handleChange}>
            <option value="Available">Available</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>
        </label>

        <div className="full-col" style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
          <button type="submit" style={{ flex: 1 }}>
            {submitLabel}
          </button>
          {onCancel && (
            <button type="button" className="secondary-button" onClick={onCancel}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </section>
  );
}
