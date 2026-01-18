import { useState } from "react";

/**
 * Shop / Printful API Utilities
 * Centralized configuration and helpers for e-commerce integration.
 */

// ----------------------------------------------------------------------
// Configuration
// ----------------------------------------------------------------------

// Environment variable names
const API_KEY_VAR = "REACT_APP_PRINTFUL_API_KEY";
const STORE_ID_VAR = "REACT_APP_PRINTFUL_STORE_ID";

export interface PrintfulConfig {
  apiKey: string;
  storeId: string;
}

/**
 * Validates that required environment variables are set
 * @throws {Error} If required environment variables are missing
 */
export const validatePrintfulConfig = (): PrintfulConfig => {
  const apiKey = process.env[API_KEY_VAR];
  const storeId = process.env[STORE_ID_VAR];

  if (!apiKey) {
    throw new Error(`${API_KEY_VAR} is not set`);
  }
  if (!storeId) {
    throw new Error(`${STORE_ID_VAR} is not set`);
  }

  return { apiKey, storeId };
};

/**
 * Gets Printful configuration with validation
 * @returns {PrintfulConfig} Configuration object with apiKey and storeId
 */
export const getPrintfulConfig = (): PrintfulConfig => {
  return validatePrintfulConfig();
};

/**
 * Creates axios headers for Printful API calls
 */
export const createPrintfulHeaders = (
  apiKey: string,
): Record<string, string> => ({
  Authorization: `Bearer ${apiKey}`,
});

export const createPrintfulJsonHeaders = (
  apiKey: string,
): Record<string, string> => ({
  Authorization: `Bearer ${apiKey}`,
  "Content-Type": "application/json",
});

// ----------------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------------

/**
 * Handles Printful API errors with specific CORS error detection
 */
export const handlePrintfulError = (
  err: any,
  context = "API Error",
): string => {
  let errorMessage = `${context}: ${err.response?.status} - ${err.response?.statusText || err.message}`;

  // Handle CORS errors specifically
  if (err.message === "Network Error" || err.code === "ERR_NETWORK") {
    errorMessage =
      "CORS Error: Unable to connect to Printful API. Please ensure the development server is running with the correct proxy configuration.";
  }

  return errorMessage;
};

export interface ParsedProduct {
  syncProduct: any;
  syncVariants: any[];
  firstVariant: any;
  price: number;
}

/**
 * Parses Printful product data to extract key information
 */
export const parsePrintfulProduct = (product: any): ParsedProduct => {
  // Input validation
  if (!product || typeof product !== "object") {
    console.warn("parsePrintfulProduct: Invalid product object provided");
    return {
      syncProduct: null,
      syncVariants: [],
      firstVariant: null,
      price: 0,
    };
  }

  const syncProduct = product.sync_product || null;
  const syncVariants = product.sync_variants || [];
  const firstVariant = Array.isArray(syncVariants)
    ? syncVariants[0] || null
    : null;
  const price = Number(firstVariant?.retail_price) || 0;

  return {
    syncProduct,
    syncVariants,
    firstVariant,
    price,
  };
};

/**
 * Custom hook for managing loading and error states in Printful components
 */
export const useShopState = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleError = (err: any, context: string) => {
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
    stopLoading,
  };
};
