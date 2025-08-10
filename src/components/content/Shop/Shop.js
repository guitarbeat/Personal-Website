import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Checkout from './Checkout';
import ErrorDisplay from '../../shared/ErrorDisplay';
import { getPrintfulConfig, createPrintfulHeaders } from '../../../utils/printfulConfig';
import { handlePrintfulError, parsePrintfulProduct } from '../../../utils/printfulHelpers';
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
                const { apiKey, storeId } = getPrintfulConfig();

                // Get the list of products
                const response = await axios.get(`/store/products?store_id=${storeId}`, {
                    headers: createPrintfulHeaders(apiKey),
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
                                headers: createPrintfulHeaders(apiKey),
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
                    return firstVariant?.id;
                });

                if (validProductsWithDetails.length === 0) {
                    throw new Error('No valid products with complete details found');
                }

                setProducts(validProductsWithDetails);
            } catch (err) {
                const errorMessage = handlePrintfulError(err, 'API Error');
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
        alert(`Order created successfully! Order ID: ${orderData?.id || 'N/A'}`);
        handleCheckoutClose();
    };

    if (loading) return <p>Loading products...</p>;
    if (error) return (
        <section id="shop" className="shop-section">
            <h1>Shop</h1>
            <ErrorDisplay error={error} />
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
                            const { syncProduct, firstVariant, price } = parsePrintfulProduct(product);
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
                                        type="button"
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