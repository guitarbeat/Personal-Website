/**
 * Format a date string into a human-readable format
 * @param {string} dateString - ISO date string to format
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString) => {
	try {
		return new Date(dateString).toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	} catch (error) {
		console.error("Error formatting date:", error);
		return "Invalid Date";
	}
};

/**
 * Get a relative time string (e.g., "2 hours ago")
 * @param {string} dateString - ISO date string to compare
 * @returns {string} Relative time string
 */
export const getRelativeTime = (dateString) => {
	try {
		const date = new Date(dateString);
		const now = new Date();
		const diff = now - date;
		const minutes = Math.floor(diff / 60000);
		const hours = Math.floor(minutes / 60);
		const days = Math.floor(hours / 24);

		if (minutes < 1) {
    return "just now";
  }
		if (minutes < 60) {
    return `${minutes} minutes ago`;
  }
		if (hours < 24) {
    return `${hours} hours ago`;
  }
		if (days < 7) {
    return `${days} days ago`;
  }

		return formatDate(dateString);
	} catch (error) {
		console.error("Error calculating relative time:", error);
		return "Invalid Date";
	}
};
