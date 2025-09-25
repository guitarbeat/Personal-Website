import React from "react";
import "./shop.scss";

const Shop = () => {
  return (
    <section id="shop" className="shop-section">
      <div className="coming-soon-container">
        <h1>Shop</h1>
        <div className="coming-soon-content">
          <div className="coming-soon-icon">🛍️</div>
          <h2>Coming Soon</h2>
          <p>We're working on something amazing for you!</p>
          <p>Check back soon for our exclusive products and merchandise.</p>
        </div>
      </div>
    </section>
  );
};

export default Shop;
