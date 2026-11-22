import React, { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { FoodCard } from "../components/FoodCard";
import { SectionHeading } from "../components/SectionHeading";
import { SearchIcon, VegIcon } from "../components/Icons";
import { useDishes } from "../context/DishesContext";

const CATEGORIES = ["All", "Main Course", "Breakfast", "Snacks", "Dessert", "Beverages"];

export function DishesPage() {
  const { dishes } = useDishes();
  const [searchParams, setSearchParams] = useSearchParams();

  const queryParam = searchParams.get("q") || "";
  const categoryParam = searchParams.get("category") || "All";

  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [onlyVeg, setOnlyVeg] = useState(false);
  const [sortBy, setSortBy] = useState("recommended");

  const filteredDishes = useMemo(() => {
    return dishes.filter((dish) => {
      const matchesSearch =
        searchQuery === "" ||
        (dish.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (dish.description || "").toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" ||
        (dish.category || "").toLowerCase() === selectedCategory.toLowerCase();

      const matchesVeg = !onlyVeg || dish.veg === true || dish.veg === "true";

      return matchesSearch && matchesCategory && matchesVeg;
    }).sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      return 0; // recommended
    });
  }, [dishes, searchQuery, selectedCategory, onlyVeg, sortBy]);

  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat);
    if (cat === "All") {
      searchParams.delete("category");
    } else {
      searchParams.set("category", cat);
    }
    setSearchParams(searchParams);
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setOnlyVeg(false);
    setSortBy("recommended");
    setSearchParams({});
  };

  return (
    <section id="dishes" className="page-section">
      <SectionHeading
        eyebrow="Our Culinary Menu"
        title="Explore Handcrafted Delicacies"
        description="Freshly prepared using authentic spices, fresh farm produce, and traditional slow-cooking techniques."
      />

      {/* Filter and Search Controls */}
      <div className="menu-controls">
        <div className="controls-row-top">
          {/* Live Search */}
          <div className="search-input-wrap">
            <span className="search-input-icon">
              <SearchIcon size={18} />
            </span>
            <input
              type="text"
              placeholder="Search by dish name, flavor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap" }}>
            {/* Pure Veg Toggle */}
            <button
              type="button"
              className={`veg-toggle-btn ${onlyVeg ? "active" : ""}`}
              onClick={() => setOnlyVeg(!onlyVeg)}
            >
              <VegIcon size={16} /> Pure Veg Only
            </button>

            {/* Sort Select */}
            <div className="sort-select-wrap">
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="recommended">Recommended</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="filter-categories-pills">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`category-tab ${selectedCategory.toLowerCase() === cat.toLowerCase() ? "active" : ""}`}
              onClick={() => handleCategorySelect(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Dish Cards Grid */}
      {filteredDishes.length > 0 ? (
        <div className="card-grid">
          {filteredDishes.map((dish) => {
            const dishId = dish._id || dish.id;
            return (
              <FoodCard
                key={dishId}
                id={dishId}
                _id={dishId}
                name={dish.name}
                category={dish.category}
                veg={dish.veg}
                availability={dish.availability ?? dish.availablity}
                img={dish.img || dish.imageUrl}
                price={dish.price}
                description={dish.description}
                preparationTime={dish.preparationTime}
                badge={dish.badge || "Popular"}
                rating={dish.rating || 4.8}
              />
            );
          })}
        </div>
      ) : (
        <div className="zero-state-box">
          <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>🍽️</div>
          <h3>No dishes match your filters</h3>
          <p style={{ color: "var(--color-slate-400)", marginBottom: "1.2rem" }}>
            We couldn't find any dishes matching "{searchQuery}". Try searching for something else or resetting your filters.
          </p>
          <button type="button" className="secondary-button" onClick={handleResetFilters}>
            Reset Filters
          </button>
        </div>
      )}
    </section>
  );
}
