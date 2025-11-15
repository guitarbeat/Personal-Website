// * Version utility for displaying build and version information
// Provides git commit hash, build date, and version information

/**
 * Get the current git commit hash (short version)
 * @returns {string} Short git commit hash
 */
export const getGitCommitHash = () => {
	// * In production builds, this will be replaced by webpack DefinePlugin
	// * For development, we'll try to get it from git
	if (process.env.REACT_APP_GIT_COMMIT_HASH) {
		return process.env.REACT_APP_GIT_COMMIT_HASH.substring(0, 8);
	}

	// * Fallback for development - this won't work in production
	return "dev-build";
};

/**
 * Get the build date in a readable format
 * @returns {string} Formatted build date
 */
export const getBuildDate = () => {
	// * In production builds, this will be replaced by webpack DefinePlugin
	if (process.env.REACT_APP_BUILD_DATE) {
		return new Date(process.env.REACT_APP_BUILD_DATE).toLocaleString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
			hour12: true,
		});
	}

	// * Fallback to current date for development
	return new Date().toLocaleString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
		hour12: true,
	});
};

/**
 * Get the package version
 * @returns {string} Package version from package.json
 */
export const getPackageVersion = () => {
	return process.env.REACT_APP_VERSION || "0.1.0";
};

/**
 * Get the complete version information string
 * @returns {string} Formatted version string
 */
export const getVersionInfo = () => {
	const commitHash = getGitCommitHash();
	const buildDate = getBuildDate();

	return `✨ Crafted with Aaron's Love - (${commitHash}) - ${buildDate}`;
};

/**
 * Get version info for debugging/development
 * @returns {object} Complete version information object
 */
export const getVersionDetails = () => {
	return {
		version: getPackageVersion(),
		commitHash: getGitCommitHash(),
		buildDate: getBuildDate(),
		fullString: getVersionInfo(),
	};
};
