import React from "react";
import "./shop.scss";

const Shop = () => {
  // Generate multiple sections to demonstrate infinite scroll
  const generateShopSections = () => {
    const sections = [];
    const products = [
      { name: "Digital Art Collection", price: "$29.99", description: "Exclusive digital artwork pieces" },
      { name: "Premium Templates", price: "$49.99", description: "Professional design templates" },
      { name: "Code Snippets Pack", price: "$19.99", description: "Reusable code components" },
      { name: "Design System", price: "$99.99", description: "Complete design system files" },
      { name: "Icon Library", price: "$39.99", description: "500+ custom icons" },
      { name: "Font Collection", price: "$79.99", description: "Curated typography selection" },
      { name: "Color Palettes", price: "$14.99", description: "Professional color schemes" },
      { name: "Mockup Templates", price: "$59.99", description: "High-quality product mockups" }
    ];

    for (let i = 0; i < 3; i++) {
      sections.push(
        <div key={`shop-section-${i}`} className="shop-section">
          <div className="shop-header">
            <h1>Digital Shop</h1>
            <p className="shop-subtitle">Premium digital products for creators</p>
          </div>
          
          <div className="products-grid">
            {products.map((product, index) => (
              <div key={`${i}-${index}`} className="product-card">
                <div className="product-image">
                  <div className="product-placeholder">
                    {product.name.charAt(0)}
                  </div>
                </div>
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p className="product-description">{product.description}</p>
                  <div className="product-price">{product.price}</div>
                  <button className="product-button">Add to Cart</button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="shop-features">
            <div className="feature">
              <h3>🚀 Instant Download</h3>
              <p>Get your files immediately after purchase</p>
            </div>
            <div className="feature">
              <h3>💎 High Quality</h3>
              <p>Professional-grade assets for your projects</p>
            </div>
            <div className="feature">
              <h3>🔄 Commercial License</h3>
              <p>Use in commercial projects without restrictions</p>
            </div>
          </div>
          
          <div className="shop-cta">
            <h2>Ready to Create Something Amazing?</h2>
            <p>Browse our collection of premium digital products designed for modern creators.</p>
            <button className="cta-button">Explore All Products</button>
          </div>
        </div>
      );
    }
    
    return sections;
  };

  return (
    <div className="shop-container">
      {generateShopSections()}
    </div>
  );
};

export default Shop;
