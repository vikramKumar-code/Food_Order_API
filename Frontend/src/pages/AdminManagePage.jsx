import React, { useState } from "react";
import { DishForm } from "../components/DishForm";
import { DishTable } from "../components/DishTable";
import { SectionHeading } from "../components/SectionHeading";
import { useDishes } from "../context/DishesContext";
import { useCart } from "../context/CartContext";

export function AdminManagePage() {
  const { dishes, updateDish, addDish, resetToDefault } = useDishes();
  const { showToast } = useCart();
  const [editingDish, setEditingDish] = useState(null);

  const totalDishes = dishes.length;
  const vegCount = dishes.filter((d) => d.veg === true || d.veg === "true").length;
  const nonVegCount = totalDishes - vegCount;
  const avgPrice = totalDishes > 0
    ? Math.round(dishes.reduce((sum, d) => sum + (Number(d.price) || 0), 0) / totalDishes)
    : 0;

  const handleFormSubmit = (formData) => {
    if (editingDish) {
      const editId = editingDish._id || editingDish.id;
      updateDish(editId, formData);
      showToast(`Updated "${formData.name}" successfully! ✨`);
      setEditingDish(null);
    } else {
      addDish(formData);
      showToast(`Added new dish "${formData.name}" ✨`);
    }
  };

  return (
    <section id="admin" className="page-section">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
        <SectionHeading
          eyebrow="Admin Operations"
          title="Menu Inventory & Catalog Manager"
          description="Manage active menu offerings, update pricing and dish availability, or add signature specials."
        />

        <button
          type="button"
          className="secondary-button"
          style={{ fontSize: "0.85rem" }}
          onClick={() => {
            if (window.confirm("Reset catalog back to sample dishes?")) {
              resetToDefault();
              showToast("Catalog reset to defaults", "info");
            }
          }}
        >
          🔄 Reset to Default Menu
        </button>
      </div>

      {/* KPI Metrics Summary Row */}
      <div className="admin-metrics-row">
        <div className="metric-card">
          <span className="label">Total Dishes</span>
          <h3>{totalDishes}</h3>
        </div>
        <div className="metric-card">
          <span className="label">Pure Vegetarian</span>
          <h3 style={{ color: "var(--color-veg)" }}>{vegCount}</h3>
        </div>
        <div className="metric-card">
          <span className="label">Non-Vegetarian</span>
          <h3 style={{ color: "var(--color-nonveg)" }}>{nonVegCount}</h3>
        </div>
        <div className="metric-card">
          <span className="label">Average Dish Price</span>
          <h3 style={{ color: "var(--color-primary)" }}>₹{avgPrice}</h3>
        </div>
      </div>

      {/* Split Layout: Inventory Table + Edit/Add Form */}
      <div className="admin-layout-split">
        <DishTable onEditDish={(dish) => setEditingDish(dish)} />

        <DishForm
          key={editingDish ? (editingDish._id || editingDish.id) : "new"}
          title={editingDish ? `Edit: ${editingDish.name}` : "Create New Dish"}
          subtitle={
            editingDish
              ? "Modify prices, availability or ingredients below."
              : "Quickly publish an appetizer, main or dessert."
          }
          submitLabel={editingDish ? "Save Changes" : "Add to Inventory"}
          initialData={editingDish}
          onSubmitDish={handleFormSubmit}
          onCancel={editingDish ? () => setEditingDish(null) : undefined}
        />
      </div>
    </section>
  );
}
