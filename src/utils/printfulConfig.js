/**
 * Printful API Configuration Utilities
 * Centralized configuration and validation for Printful API integration
 */

import { ENV_VARS, ERROR_MESSAGES } from "../constants/printful";

/**
 * Validates that required environment variables are set
 * @throws {Error} If required environment variables are missing
 */
export const validatePrintfulConfig = () => {
  const apiKey = process.env[ENV_VARS.API_KEY];
  const storeId = process.env[ENV_VARS.STORE_ID];

  if (!apiKey) {
    throw new Error(ERROR_MESSAGES.API_KEY_MISSING);
  }
  if (!storeId) {
    throw new Error(ERROR_MESSAGES.STORE_ID_MISSING);
  }

  return { apiKey, storeId };
};

/**
 * Gets Printful configuration with validation
 * @returns {Object} Configuration object with apiKey and storeId
 */
export const getPrintfulConfig = () => {
  return validatePrintfulConfig();
};

/**
 * Creates axios headers for Printful API calls
 * @param {string} apiKey - The Printful API key
 * @returns {Object} Headers object for axios requests
 */
export const createPrintfulHeaders = (apiKey) => ({
  Authorization: `Bearer ${apiKey}`,
});

/**
 * Creates axios headers for Printful API calls with JSON content type
 * @param {string} apiKey - The Printful API key
 * @returns {Object} Headers object for axios requests with JSON content type
 */
export const createPrintfulJsonHeaders = (apiKey) => ({
  Authorization: `Bearer ${apiKey}`,
  "Content-Type": "application/json",
});
