/**
 * Utility functions for Maslow's Hierarchy of Needs pyramid calculations
 */

/**
 * Calculates the capped value for a pyramid level
 * @param {number} value - The input value to calculate
 * @param {number} maxAllowed - Maximum allowed value
 * @returns {number} - Capped value
 */
export const calculateLevelValue = (value, maxAllowed) => {
  if (typeof value !== 'number' || typeof maxAllowed !== 'number') {
    console.warn('Invalid input types for calculateLevelValue');
    return 0;
  }
  return Math.max(0, Math.min(value, maxAllowed));
};

/**
 * Updates level values while maintaining hierarchy constraints
 * @param {number[]} values - Current level values
 * @param {number} index - Index of level being updated
 * @param {number} newValue - New value for the level
 * @param {number} [allowance=15] - Maximum allowed difference between levels
 * @returns {number[]} - Updated level values
 */
export const updateLevelValues = (values, index, newValue, allowance = 15) => {
  if (!Array.isArray(values) || typeof index !== 'number') {
    console.warn('Invalid input types for updateLevelValues');
    return values;
  }

  const safeNewValue = Math.max(0, newValue);
  
  return values.map((v, i) => {
    if (i === index) return safeNewValue;
    if (i > index && v > safeNewValue + allowance) {
      return safeNewValue + allowance;
    }
    if (i < index && v < safeNewValue - allowance) {
      return safeNewValue - allowance;
    }
    return v;
  });
};

/**
 * Formats level data for rendering
 * @param {Object[]} levels - Level definitions
 * @param {number[]} values - Current level values
 * @returns {Object[]} - Formatted level data
 */
export const formatLevelData = (levels, values) => {
  if (!Array.isArray(levels) || !Array.isArray(values)) {
    console.warn('Invalid input types for formatLevelData');
    return [];
  }

  return levels.map((level, index) => ({
    ...level,
    width: values[index] || 0,
    percentage: Math.round((values[index] || 0) * 100 / 100),
  }));
};

/**
 * Creates a map of level descriptions
 * @param {Object[]} levels - Level definitions
 * @returns {Object} - Map of level descriptions
 */
export const createDescriptionsMap = (levels) => {
  if (!Array.isArray(levels)) {
    console.warn('Invalid input type for createDescriptionsMap');
    return {};
  }

  return levels.reduce((acc, level) => ({
    ...acc,
    [level.level]: level.description || ''
  }), {});
};

/**
 * Validates pyramid data structure
 * @param {Object[]} data - Pyramid data to validate
 * @returns {boolean} - Whether data is valid
 */
export const validatePyramidData = (data) => {
  if (!Array.isArray(data)) return false;
  
  return data.every(level => 
    level &&
    typeof level.level === 'string' &&
    typeof level.description === 'string' &&
    typeof level.color === 'string'
  );
};