export interface HSL {
  h: number;
  s: number;
  l: number;
}

/**
 * Default base colors with HSL values for tag generation
 */
export const DEFAULT_BASE_COLORS: Record<string, HSL> = {
  primary: { h: 220, s: 45, l: 65 }, // Muted Blue
  secondary: { h: 142, s: 35, l: 55 }, // Muted Green
  tertiary: { h: 0, s: 45, l: 65 }, // Muted Red
  quaternary: { h: 262, s: 35, l: 65 }, // Muted Purple
  quinary: { h: 24, s: 45, l: 60 }, // Muted Orange
  senary: { h: 190, s: 40, l: 60 }, // Muted Cyan
  septenary: { h: 328, s: 35, l: 65 }, // Muted Pink
};

/**
 * Generate HSL color string from color object
 * @param {Object} color - Color object with h, s, l properties
 * @returns {string} - HSL color string
 */
export const generateHslColor = (color: HSL): string => {
  return `hsl(${color.h}, ${color.s}%, ${color.l}%)`;
};

/**
 * Generate tag colors for a list of keywords
 * @param {Array} keywords - Array of keyword strings
 * @param {Object} baseColors - Base colors object (optional, uses default if not provided)
 * @returns {Object} - Object mapping keywords to HSL color strings
 */
export const generateTagColors = (
  keywords: string[],
  baseColors: Record<string, HSL> = DEFAULT_BASE_COLORS,
): Record<string, string> => {
  const colorValues = Object.values(baseColors);

  // Generate base HSL colors
  const adjustedColors = colorValues.map(generateHslColor);

  // Map keywords to colors, cycling through available colors
  return keywords.reduce((acc, keyword, index) => {
    acc[keyword] = adjustedColors[index % adjustedColors.length];
    return acc;
  }, {} as Record<string, string>);
};

/**
 * Generate unique colors for a list of items
 * @param {Array} items - Array of items to generate colors for
 * @param {string} keyProperty - Property name to use as key (default: 'keyword')
 * @param {Object} baseColors - Base colors object (optional)
 * @returns {Object} - Object mapping item keys to HSL color strings
 */
export const generateItemColors = (
  items: any[],
  keyProperty: string = "keyword",
  baseColors: Record<string, HSL> = DEFAULT_BASE_COLORS,
): Record<string, string> => {
  const uniqueKeys = Array.from(
    new Set(items.map((item) => item[keyProperty] as string)),
  );
  return generateTagColors(uniqueKeys, baseColors);
};
