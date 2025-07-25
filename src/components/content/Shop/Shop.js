import React, { useState, useEffect } from 'react';

import './shop.scss';
import axios from 'axios';

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const apiKey = process.env.REACT_APP_PRINTFUL_API_KEY; // Use as Bearer token for v2
                const response = await axios.get('/v2/catalog-products', {
                    headers: {
                        'Authorization': `Bearer ${apiKey}`,
                    },
                });
                setProducts(response.data.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) return <p>Loading products...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <section id="shop" className="shop-section">
            <h1>Shop</h1>
            <div className="shop-content">
                {products.map((product) => (
                    <div key={product.id} className="product-card">
                        <img src={product.image} alt={product.name} />
                        <h3>{product.name}</h3>
                        <p>{product.description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Shop; 