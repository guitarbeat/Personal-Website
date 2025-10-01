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
      
      {/* Additional content for infinite scroll effect */}
      <div className="shop-content">
        <div className="product-preview">
          <h3>Featured Products</h3>
          <div className="product-grid">
            <div className="product-item">
              <div className="product-placeholder">📱</div>
              <h4>Digital Art</h4>
              <p>Exclusive digital artwork</p>
            </div>
            <div className="product-item">
              <div className="product-placeholder">🎨</div>
              <h4>Merchandise</h4>
              <p>Limited edition items</p>
            </div>
            <div className="product-item">
              <div className="product-placeholder">💎</div>
              <h4>Premium Access</h4>
              <p>Special member benefits</p>
            </div>
            <div className="product-item">
              <div className="product-placeholder">🎵</div>
              <h4>Music & Audio</h4>
              <p>Original compositions</p>
            </div>
            <div className="product-item">
              <div className="product-placeholder">📚</div>
              <h4>Digital Guides</h4>
              <p>Expert tutorials</p>
            </div>
            <div className="product-item">
              <div className="product-placeholder">🎮</div>
              <h4>Interactive Content</h4>
              <p>Engaging experiences</p>
            </div>
          </div>
        </div>
        
        <div className="shop-info">
          <h3>About Our Shop</h3>
          <p>We're crafting unique digital experiences and physical products that reflect our creative vision. Each item is carefully designed and curated to bring you something special.</p>
          <p>Stay tuned for updates on our launch date and exclusive early access opportunities!</p>
        </div>
        
        <div className="coming-soon-features">
          <h3>What to Expect</h3>
          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-icon">⚡</div>
              <h4>Fast Delivery</h4>
              <p>Instant digital downloads</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🔒</div>
              <h4>Secure Payment</h4>
              <p>Safe and encrypted transactions</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🎁</div>
              <h4>Exclusive Content</h4>
              <p>Member-only special offers</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🌟</div>
              <h4>Premium Quality</h4>
              <p>Handpicked and curated items</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Shop;
