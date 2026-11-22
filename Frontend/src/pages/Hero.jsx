import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SearchIcon, SparklesIcon, StarIcon, ArrowRightIcon } from "../components/Icons";
import { useCart } from "../context/CartContext";

const Hero = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/dishes?q=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate("/dishes");
    }
  };

  const handleCategoryClick = (category) => {
    navigate(`/dishes?category=${encodeURIComponent(category)}`);
  };

  const featuredDish = {
    id: 1,
    _id: "hero-featured-1",
    name: "Paneer Butter Masala",
    price: 220,
    category: "Main Course",
    veg: true,
    img: "https://images.unsplash.com/photo-1546833999-b9f581a1996d",
    description: "Cottage cheese cubes bathed in slow-cooked creamy tomato makhani with Kashmiri chillies.",
    preparationTime: "25 mins",
  };

  return (
    <section className="hero-container">
      <div className="hero-content">
        <span className="hero-pill">
          <SparklesIcon size={15} /> 100% Authentic Indian Flavors
        </span>

        <h1 className="hero-title">
          Taste the Authentic <br />
          <span className="highlight">Flavors Delivered</span> Fast.
        </h1>

        <p className="hero-description">
          From fragrant handi biryanis to buttery gravies and artisanal desserts.
          Freshly cooked by master chefs and delivered hot right to your doorstep.
        </p>

        {/* Live Search Bar */}
        <form onSubmit={handleSearchSubmit} className="hero-search-box">
          <input
            type="text"
            placeholder="Search butter chicken, dosa, biryani..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit">
            Search <SearchIcon size={16} />
          </button>
        </form>

        {/* Quick Category Chips */}
        <div className="quick-chips-wrapper">
          <span className="label">Popular:</span>
          <button type="button" className="chip-btn" onClick={() => handleCategoryClick("Main Course")}>
            🍛 Main Course
          </button>
          <button type="button" className="chip-btn" onClick={() => handleCategoryClick("Breakfast")}>
            🥞 Breakfast
          </button>
          <button type="button" className="chip-btn" onClick={() => handleCategoryClick("Snacks")}>
            🥟 Snacks
          </button>
          <button type="button" className="chip-btn" onClick={() => handleCategoryClick("Dessert")}>
            🍨 Desserts
          </button>
        </div>

        {/* Trust Badges */}
        <div className="hero-stats">
          <div className="stat-item">
            <h3>4.9★</h3>
            <p>15k+ Reviews</p>
          </div>
          <div className="stat-item">
            <h3>30m</h3>
            <p>Speedy Delivery</p>
          </div>
          <div className="stat-item">
            <h3>50+</h3>
            <p>Signature Dishes</p>
          </div>
        </div>
      </div>

      {/* Hero Visual Card */}
      <div className="hero-visual">
        <div className="hero-card-featured">
          <div className="hero-card-img-wrap">
            <img
              src="https://images.unsplash.com/photo-1546833999-b9f581a1996d"
              alt="Paneer Butter Masala"
            />
            <span className="floating-badge">
              <StarIcon size={14} /> Chef’s #1 Pick
            </span>
          </div>

          <div className="hero-card-info">
            <div className="hero-card-title-row">
              <h4>{featuredDish.name}</h4>
              <span className="hero-card-price">₹{featuredDish.price}</span>
            </div>

            <p className="hero-card-desc">
              {featuredDish.description}
            </p>

            <div style={{ display: "flex", gap: "0.6rem" }}>
              <button
                type="button"
                style={{ flex: 1 }}
                onClick={() => addToCart(featuredDish)}
              >
                Add to Cart +
              </button>
              <button
                type="button"
                className="secondary-button"
                onClick={() => navigate("/dish/1")}
              >
                Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
