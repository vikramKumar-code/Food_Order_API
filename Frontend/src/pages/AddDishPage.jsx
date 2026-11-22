import React from "react";
import { useNavigate } from "react-router-dom";
import { DishForm } from "../components/DishForm";
import { SectionHeading } from "../components/SectionHeading";
import { useDishes } from "../context/DishesContext";
import { useCart } from "../context/CartContext";

export function AddDishPage() {
  const navigate = useNavigate();
  const { addDish } = useDishes();
  const { showToast } = useCart();

  const handleAddDish = (dishData) => {
    addDish(dishData);
    showToast(`Dish "${dishData.name}" created successfully! 🍽️`);
    navigate("/dishes");
  };

  return (
    <section id="add-dish" className="page-section">
      <SectionHeading
        eyebrow="Admin Culinary Studio"
        title="Create & Publish a New Dish"
        description="Add a new gastronomic creation to your live digital menu with real-time image preview and dietary tags."
      />

      <div style={{ maxWidth: "760px", margin: "0 auto" }}>
        <DishForm
          title="Dish Information"
          subtitle="Provide mouth-watering details to entice hungry food lovers."
          submitLabel="Publish to Menu 🚀"
          onSubmitDish={handleAddDish}
          onCancel={() => navigate("/dishes")}
        />
      </div>
    </section>
  );
}
