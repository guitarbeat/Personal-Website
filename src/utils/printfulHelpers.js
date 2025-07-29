import { useState } from 'react';

/**
 * Shared utilities for Printful API interactions
 */

/**
 * Handles Printful API errors with specific CORS error detection
 * @param {Error} err - The error object from axios or other source
 * @param {string} context - Context for the error (e.g., 'API Error', 'Failed to create order')
 * @returns {string} - Formatted error message
 */
export const handlePrintfulError = (err, context = 'API Error') => {
    let errorMessage = `${context}: ${err.response?.status} - ${err.response?.statusText || err.message}`;

    // Handle CORS errors specifically
    if (err.message === 'Network Error' || err.code === 'ERR_NETWORK') {
        errorMessage = 'CORS Error: Unable to connect to Printful API. Please ensure the development server is running with the correct proxy configuration.';
    }

    return errorMessage;
};

/**
 * Parses Printful product data to extract key information
 * @param {Object} product - The product object from Printful API
 * @returns {Object} - Parsed product data with sync_product, sync_variants, firstVariant, and price
 */
export const parsePrintfulProduct = (product) => {
    const syncProduct = product.sync_product;
    const syncVariants = product.sync_variants;
    const firstVariant = syncVariants?.[0];
    const price = firstVariant?.retail_price || 0;

    return {
        syncProduct,
        syncVariants,
        firstVariant,
        price
    };
};

/**
 * Custom hook for managing loading and error states in Printful components
 * @returns {Object} - State and handlers for loading/error management
 */
export const usePrintfulState = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleError = (err, context) => {
        const errorMessage = handlePrintfulError(err, context);
        setError(errorMessage);
        setLoading(false);
    };

    const startLoading = () => {
        setLoading(true);
        setError(null);
    };

    const stopLoading = () => {
        setLoading(false);
    };

    return {
        loading,
        error,
        setError,
        handleError,
        startLoading,
        stopLoading
    };
};