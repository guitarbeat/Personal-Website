/**
 * Throttle function to limit execution frequency
 * @param {Function} func - The function to throttle
 * @param {number} limit - The time limit in milliseconds
 * @returns {Function} - The throttled function
 */
export const throttle = (func, limit) => {
	let inThrottle;
	return function (...args) {
		if (!inThrottle) {
			func.apply(this, args);
			inThrottle = true;
			setTimeout(() => {
				inThrottle = false;
			}, limit);
		}
	};
};

/**
 * TypeScript version for TypeScript files
 * @template T
 * @param {T} func - The function to throttle
 * @param {number} limit - The time limit in milliseconds
 * @returns {(...args: Parameters<T>) => void} - The throttled function
 */
export const throttleTS = (func, limit) => {
	let inThrottle;
	return (...args) => {
		if (!inThrottle) {
			func(...args);
			inThrottle = true;
			setTimeout(() => {
				inThrottle = false;
			}, limit);
		}
	};
};