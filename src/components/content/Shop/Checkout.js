import React, { useState } from 'react';
import axios from 'axios';
import ErrorDisplay from '../../shared/ErrorDisplay';
import { getPrintfulConfig, createPrintfulHeaders, createPrintfulJsonHeaders } from '../../../utils/printfulConfig';
import { handlePrintfulError, parsePrintfulProduct } from '../../../utils/printfulHelpers';
import './checkout.scss';

const Checkout = ({ product, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        address1: '',
        address2: '',
        city: '',
        state: '',
        zip: '',
        country: 'US',
        phone: ''
    });
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const { apiKey, storeId } = getPrintfulConfig();

            // First, get the product variants
            const productId = product.sync_product?.id || product.id;
            if (!productId) {
                throw new Error('Product ID not found');
            }

            const variantsResponse = await axios.get(`/store/products/${productId}?store_id=${storeId}`, {
                headers: createPrintfulHeaders(apiKey),
            });

            const productWithVariants = variantsResponse.data.result;
            const syncProduct = productWithVariants.sync_product;
            const syncVariants = productWithVariants.sync_variants;
            const firstVariant = syncVariants?.[0];

            if (!firstVariant) {
                throw new Error('No variants found for this product');
            }

            if (!firstVariant.id) {
                throw new Error('Variant ID is missing');
            }

            // Create the order payload
            const orderData = {
                recipient: {
                    name: formData.name,
                    email: formData.email,
                    address1: formData.address1,
                    address2: formData.address2,
                    city: formData.city,
                    state: formData.state,
                    zip: formData.zip,
                    country: formData.country,
                    phone: formData.phone
                },
                items: [{
                    variant_id: firstVariant.variant_id,
                    quantity: quantity
                }]
            };

            const response = await axios.post(`/store/orders?store_id=${storeId}`, orderData, {
                headers: createPrintfulJsonHeaders(apiKey)
            });

            onSuccess(response.data.result);
        } catch (err) {
            const errorMessage = handlePrintfulError(err, 'Failed to create order');
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const { syncProduct, syncVariants, firstVariant, price } = parsePrintfulProduct(product);
    const total = price * quantity;

    return (
        <div className="checkout-overlay">
            <div className="checkout-modal">
                <button className="close-button" onClick={onClose}>&times;</button>

                <div className="checkout-header">
                    <h2>Checkout</h2>
                    <div className="product-summary">
                        <img src={syncProduct?.thumbnail_url} alt={syncProduct?.name} />
                        <div>
                            <h3>{syncProduct?.name}</h3>
                            <p>${price} USD</p>
                        </div>
                    </div>
                </div>

                {error && <ErrorDisplay error={error} />}

                <form onSubmit={handleSubmit} className="checkout-form">
                    <div className="form-section">
                        <h3>Contact Information</h3>
                        <input
                            type="text"
                            name="name"
                            placeholder="Full Name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                        />
                        <input
                            type="tel"
                            name="phone"
                            placeholder="Phone Number"
                            value={formData.phone}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="form-section">
                        <h3>Shipping Address</h3>
                        <input
                            type="text"
                            name="address1"
                            placeholder="Address Line 1"
                            value={formData.address1}
                            onChange={handleInputChange}
                            required
                        />
                        <input
                            type="text"
                            name="address2"
                            placeholder="Address Line 2 (Optional)"
                            value={formData.address2}
                            onChange={handleInputChange}
                        />
                        <div className="address-row">
                            <input
                                type="text"
                                name="city"
                                placeholder="City"
                                value={formData.city}
                                onChange={handleInputChange}
                                required
                            />
                            <input
                                type="text"
                                name="state"
                                placeholder="State"
                                value={formData.state}
                                onChange={handleInputChange}
                                required
                            />
                            <input
                                type="text"
                                name="zip"
                                placeholder="ZIP Code"
                                value={formData.zip}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-section">
                        <h3>Quantity</h3>
                        <div className="quantity-selector">
                            <button
                                type="button"
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                disabled={quantity <= 1}
                            >
                                -
                            </button>
                            <span>{quantity}</span>
                            <button
                                type="button"
                                onClick={() => setQuantity(quantity + 1)}
                            >
                                +
                            </button>
                        </div>
                    </div>

                    <div className="order-summary">
                        <div className="summary-row">
                            <span>Subtotal:</span>
                            <span>${(price * quantity).toFixed(2)}</span>
                        </div>
                        <div className="summary-row total">
                            <span>Total:</span>
                            <span>${total.toFixed(2)} USD</span>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="submit-button"
                        disabled={loading}
                    >
                        {loading ? 'Creating Order...' : 'Place Order'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Checkout; 