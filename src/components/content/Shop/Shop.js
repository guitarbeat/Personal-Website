import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Checkout from './Checkout';
import './shop.scss';

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showCheckout, setShowCheckout] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const apiKey = process.env.REACT_APP_PRINTFUL_API_KEY;
                const storeId = process.env.REACT_APP_PRINTFUL_STORE_ID;

                // Validate environment variables
                if (!apiKey) {
                    throw new Error('REACT_APP_PRINTFUL_API_KEY is not set');
                }
                if (!storeId) {
                    throw new Error('REACT_APP_PRINTFUL_STORE_ID is not set');
                }

                // Get the list of products
                const response = await axios.get(`/store/products?store_id=${storeId}`, {
                    headers: {
                        'Authorization': `Bearer ${apiKey}`,
                    },
                });

                const productsList = response.data.result || [];

                // Filter out products without valid IDs
                const validProducts = productsList.filter(product => product.id);

                if (validProducts.length === 0) {
                    throw new Error('No valid products found in store');
                }

                // Fetch complete details for each product including variants
                const productsWithDetails = await Promise.all(
                    validProducts.map(async (product) => {
                        try {
                            const detailResponse = await axios.get(`/store/products/${product.id}?store_id=${storeId}`, {
                                headers: {
                                    'Authorization': `Bearer ${apiKey}`,
                                },
                            });
                            return detailResponse.data.result;
                        } catch (err) {
                            console.error(`Failed to fetch details for product ${product.id}:`, err);
                            return product; // Return original product if details fetch fails
                        }
                    })
                );

                // Filter out products without proper structure
                const validProductsWithDetails = productsWithDetails.filter(product => {
                    if (!product || !product.sync_product) return false;
                    if (!product.sync_variants || product.sync_variants.length === 0) return false;
                    const firstVariant = product.sync_variants[0];
                    return firstVariant && firstVariant.id;
                });

                if (validProductsWithDetails.length === 0) {
                    throw new Error('No valid products with complete details found');
                }

                setProducts(validProductsWithDetails);
            } catch (err) {
                let errorMessage = `API Error: ${err.response?.status} - ${err.response?.statusText || err.message}`;

                // Handle CORS errors specifically
                if (err.message === 'Network Error' || err.code === 'ERR_NETWORK') {
                    errorMessage = 'CORS Error: Unable to connect to Printful API. Please ensure the development server is running with the correct proxy configuration.';
                }

                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const handleCheckout = (product) => {
        // Validate product structure
        if (!product || !product.sync_product) {
            alert('Error: Invalid product data');
            return;
        }

        setSelectedProduct(product);
        setShowCheckout(true);
    };

    const handleCheckoutClose = () => {
        setShowCheckout(false);
        setSelectedProduct(null);
    };

    const handleOrderSuccess = (orderData) => {
        console.log('Order created successfully:', orderData);
        // You could show a success message or redirect to an order confirmation page
        alert(`Order created successfully! Order ID: ${orderData.id}`);
        handleCheckoutClose();
    };

    if (loading) return <p>Loading products...</p>;
    if (error) return (
        <section id="shop" className="shop-section">
            <h1>Shop</h1>
            <div className="error-message">
                <p>{error}</p>
                {error.includes('not set') && (
                    <div className="env-help">
                        <h3>Environment Variables Required</h3>
                        <p>To use the shop functionality, you need to set the following environment variables:</p>
                        <ul>
                            <li><code>REACT_APP_PRINTFUL_API_KEY</code> - Your Printful API key</li>
                            <li><code>REACT_APP_PRINTFUL_STORE_ID</code> - Your Printful store ID</li>
                        </ul>
                        <p>Create a <code>.env</code> file in the project root with these variables.</p>
                    </div>
                )}
                {error.includes('CORS Error') && (
                    <div className="env-help">
                        <h3>Proxy Configuration Issue</h3>
                        <p>The application is configured to use a proxy to avoid CORS issues with the Printful API.</p>
                        <p>Please ensure:</p>
                        <ul>
                            <li>The development server is running with <code>npm start</code></li>
                            <li>The proxy configuration in <code>package.json</code> is set to <code>"proxy": "https://api.printful.com"</code></li>
                            <li>You've restarted the development server after making changes</li>
                        </ul>
                    </div>
                )}
            </div>
        </section>
    );

    return (
        <>
            <section id="shop" className="shop-section">
                <h1>Shop</h1>
                <div className="shop-content">
                    {products.length === 0 ? (
                        <p>No products found in your store.</p>
                    ) : (
                        products.map((product, index) => {
                            // Get the sync product and variants
                            const syncProduct = product.sync_product;
                            const syncVariants = product.sync_variants;
                            const firstVariant = syncVariants?.[0];
                            const price = firstVariant?.retail_price;
                            const currency = firstVariant?.currency || 'USD';

                            // Create a unique key using sync product ID or index
                            const uniqueKey = syncProduct?.id || syncProduct?.external_id || `product-${index}`;

                            return (
                                <div key={uniqueKey} className="product-card">
                                    <img
                                        src={syncProduct?.thumbnail_url || syncProduct?.image || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjMzMzMzMzIi8+Cjx0ZXh0IHg9IjE1MCIgeT0iMTUwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+UHJvZHVjdCBJbWFnZTwvdGV4dD4KPC9zdmc+'}
                                        alt={syncProduct?.name}
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.nextSibling.style.display = 'block';
                                        }}
                                    />
                                    <div className="product-placeholder" style={{ display: 'none' }}>
                                        <div className="placeholder-content">
                                            <span>Product Image</span>
                                        </div>
                                    </div>
                                    <h3>{syncProduct?.name}</h3>
                                    <p>{syncProduct?.description}</p>
                                    {price && (
                                        <p className="price">${price} {currency}</p>
                                    )}
                                    <button
                                        onClick={() => handleCheckout(product)}
                                        className="buy-button"
                                    >
                                        Checkout
                                    </button>
                                </div>
                            );
                        })
                    )}
                </div>
            </section>

            {showCheckout && selectedProduct && (
                <Checkout
                    product={selectedProduct}
                    onClose={handleCheckoutClose}
                    onSuccess={handleOrderSuccess}
                />
            )}
        </>
    );
};

export default Shop; 