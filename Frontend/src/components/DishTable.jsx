import React, { useState } from "react";
import { VegIcon, NonVegIcon, EditIcon, TrashIcon, SearchIcon } from "./Icons";
import { useDishes } from "../context/DishesContext";

export function DishTable({ onEditDish }) {
  const { dishes, deleteDish } = useDishes();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredDishes = dishes.filter((dish) =>
    (dish.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (dish.category || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}" from the menu?`)) {
      deleteDish(id);
    }
  };

  return (
    <section className="page-section" style={{ padding: "1.8rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.2rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.35rem", fontWeight: 800 }}>
            Live Menu Inventory
          </h3>
          <p style={{ color: "var(--color-slate-400)", fontSize: "0.9rem" }}>
            Showing {filteredDishes.length} items in catalogue
          </p>
        </div>

        <div className="search-input-wrap" style={{ maxWidth: "260px" }}>
          <span className="search-input-icon"><SearchIcon size={16} /></span>
          <input
            type="text"
            placeholder="Filter table..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table className="dish-table-modern">
          <thead>
            <tr>
              <th>Dish</th>
              <th>Category</th>
              <th>Price</th>
              <th>Status</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDishes.map((dish) => {
              const dishId = dish._id || dish.id;
              const isVeg = dish.veg === true || dish.veg === "true";
              const isAvailable = (dish.availability ?? dish.availablity) !== "Out of Stock";

              return (
                <tr key={dishId}>
                  <td>
                    <div className="table-dish-item">
                      <div className="table-dish-thumb">
                        <img
                          src={dish.img || dish.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"}
                          alt={dish.name}
                          onError={(e) => {
                            e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c";
                          }}
                        />
                      </div>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                          {isVeg ? <VegIcon size={14} /> : <NonVegIcon size={14} />}
                          <strong style={{ color: "var(--color-secondary)" }}>{dish.name}</strong>
                        </div>
                        <span style={{ fontSize: "0.78rem", color: "var(--color-slate-400)" }}>
                          {dish.preparationTime || "20m"}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span style={{
                      background: "var(--color-slate-100)",
                      padding: "0.25rem 0.65rem",
                      borderRadius: "var(--radius-full)",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      color: "var(--color-slate-600)"
                    }}>
                      {dish.category}
                    </span>
                  </td>
                  <td>
                    <strong style={{ fontFamily: "var(--font-heading)", color: "var(--color-secondary)" }}>
                      ₹{dish.price}
                    </strong>
                  </td>
                  <td>
                    <span style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.3rem",
                      fontSize: "0.8rem",
                      fontWeight: 700,
                      color: isAvailable ? "var(--color-veg)" : "var(--color-nonveg)"
                    }}>
                      <span style={{
                        width: "7px",
                        height: "7px",
                        borderRadius: "50%",
                        background: isAvailable ? "var(--color-veg)" : "var(--color-nonveg)"
                      }}></span>
                      {isAvailable ? "Available" : "Sold Out"}
                    </span>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <div style={{ display: "inline-flex", gap: "0.4rem" }}>
                      {onEditDish && (
                        <button
                          type="button"
                          className="secondary-button"
                          style={{ padding: "0.45rem 0.75rem", fontSize: "0.82rem" }}
                          onClick={() => onEditDish(dish)}
                          title="Edit Dish"
                        >
                          <EditIcon size={14} /> Edit
                        </button>
                      )}
                      <button
                        type="button"
                        className="danger-button"
                        style={{ padding: "0.45rem 0.75rem", fontSize: "0.82rem" }}
                        onClick={() => handleDelete(dishId, dish.name)}
                        title="Delete Dish"
                      >
                        <TrashIcon size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
