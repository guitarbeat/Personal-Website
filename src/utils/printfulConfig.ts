/**
 * Printful API Configuration Utilities
 * Centralized configuration and validation for Printful API integration
 */

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
 * @param {string} apiKey - The Printful API key
 * @returns {Object} Headers object for axios requests
 */
export const createPrintfulHeaders = (
  apiKey: string,
): Record<string, string> => ({
  Authorization: `Bearer ${apiKey}`,
});

/**
 * Creates axios headers for Printful API calls with JSON content type
 * @param {string} apiKey - The Printful API key
 * @returns {Object} Headers object for axios requests with JSON content type
 */
export const createPrintfulJsonHeaders = (
  apiKey: string,
): Record<string, string> => ({
  Authorization: `Bearer ${apiKey}`,
  "Content-Type": "application/json",
});
