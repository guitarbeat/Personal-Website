/**
 * Throttle function to limit execution frequency
 * Works for both JavaScript and TypeScript contexts
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
 * Alternative throttle implementation with leading and trailing options
 * @param {Function} func - The function to throttle
 * @param {number} limit - The time limit in milliseconds
 * @param {Object} options - Configuration options
 * @param {boolean} options.leading - Execute on the leading edge (default: true)
 * @param {boolean} options.trailing - Execute on the trailing edge (default: true)
 * @returns {Function} - The throttled function
 */
export const throttleAdvanced = (func, limit, options = { leading: true, trailing: true }) => {
	let timeout;
	let previous = 0;
	let result;

	const later = function (context, args) {
		previous = options.leading === false ? 0 : Date.now();
		timeout = null;
		result = func.apply(context, args);
		// Clean up references to prevent memory leaks
		context = null;
		args = null;
	};

	const throttled = function (...args) {
		const now = Date.now();
		if (!previous && options.leading === false) previous = now;
		const remaining = limit - (now - previous);

		if (remaining <= 0 || remaining > limit) {
			if (timeout) {
				clearTimeout(timeout);
				timeout = null;
			}
			previous = now;
			result = func.apply(this, args);
		} else if (!timeout && options.trailing !== false) {
			timeout = setTimeout(() => later(this, args), remaining);
		}

		return result;
	};

	throttled.cancel = function () {
		if (timeout) {
			clearTimeout(timeout);
			timeout = null;
		}
		previous = 0;
	};

	return throttled;
};

// Legacy alias for backward compatibility
export const throttleTS = throttle;