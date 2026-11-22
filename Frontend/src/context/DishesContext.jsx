import React, { createContext, useContext, useState, useEffect } from "react";
import indianDishes from "../data.js";
import { v4 as uuidV4 } from "uuid";

const DishesContext = createContext();

export function DishesProvider({ children }) {
  const [dishes, setDishes] = useState(() => {
    try {
      const saved = localStorage.getItem("foodly_dishes");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error("Failed to load dishes from localStorage", e);
    }
    return indianDishes;
  });

  useEffect(() => {
    try {
      localStorage.setItem("foodly_dishes", JSON.stringify(dishes));
    } catch (e) {
      console.error("Failed to save dishes to localStorage", e);
    }
  }, [dishes]);

  const addDish = (dishData) => {
    const newDish = {
      id: uuidV4(),
      name: dishData.name.trim(),
      category: dishData.category || "Main Course",
      price: Number(dishData.price) || 199,
      img: dishData.img || dishData.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
      description: dishData.description || "Freshly made with authentic herbs and rich spices.",
      preparationTime: dishData.preparationTime || "25 mins",
      veg: dishData.veg !== undefined ? (dishData.veg === true || dishData.veg === "true") : true,
      availability: dishData.availability || dishData.availablity || "Available",
      badge: "New",
      rating: 4.8,
    };

    setDishes((prev) => [newDish, ...prev]);
    return newDish;
  };

  const updateDish = (id, updatedFields) => {
    setDishes((prev) =>
      prev.map((dish) => {
        if ((dish._id || dish.id) === id) {
          return {
            ...dish,
            ...updatedFields,
            price: Number(updatedFields.price !== undefined ? updatedFields.price : dish.price),
            veg: updatedFields.veg !== undefined ? (updatedFields.veg === true || updatedFields.veg === "true") : dish.veg,
          };
        }
        return dish;
      })
    );
  };

  const deleteDish = (id) => {
    setDishes((prev) => prev.filter((d) => (d._id || d.id) !== id));
  };

  const resetToDefault = () => {
    setDishes(indianDishes);
    localStorage.setItem("foodly_dishes", JSON.stringify(indianDishes));
  };

  return (
    <DishesContext.Provider
      value={{
        dishes,
        addDish,
        updateDish,
        deleteDish,
        resetToDefault,
      }}
    >
      {children}
    </DishesContext.Provider>
  );
}

export function useDishes() {
  const context = useContext(DishesContext);
  if (!context) {
    throw new Error("useDishes must be used within a DishesProvider");
  }
  return context;
}

