/**
 * Printful API Constants
 * Centralized constants for Printful API integration
 */

// API Endpoints
export const PRINTFUL_ENDPOINTS = {
    STORE_PRODUCTS: '/store/products',
    STORE_ORDERS: '/store/orders',
};

// Error Messages
export const ERROR_MESSAGES = {
    API_KEY_MISSING: 'REACT_APP_PRINTFUL_API_KEY is not set',
    STORE_ID_MISSING: 'REACT_APP_PRINTFUL_STORE_ID is not set',
    PRODUCT_ID_MISSING: 'Product ID not found',
    NO_VARIANTS: 'No variants found for this product',
    VARIANT_ID_MISSING: 'Variant ID is missing',
    NO_VALID_PRODUCTS: 'No valid products found in store',
    NO_VALID_PRODUCTS_DETAILS: 'No valid products with complete details found',
    CORS_ERROR: 'CORS Error: Unable to connect to Printful API. Please ensure the development server is running with the correct proxy configuration.',
};

// Environment Variable Names
export const ENV_VARS = {
    API_KEY: 'REACT_APP_PRINTFUL_API_KEY',
    STORE_ID: 'REACT_APP_PRINTFUL_STORE_ID',
};

// Default Values
export const DEFAULTS = {
    CURRENCY: 'USD',
    QUANTITY: 1,
    COUNTRY: 'US',
};

// Error Types
export const ERROR_TYPES = {
    ENV_VAR_MISSING: 'not set',
    CORS_ERROR: 'CORS Error',
    NETWORK_ERROR: 'Network Error',
}; 