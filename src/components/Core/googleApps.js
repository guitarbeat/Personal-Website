// Google Apps Script Configuration
export const GOOGLE_APPS_CONFIG = {
	SCRIPT_URL:
		"https://script.google.com/macros/s/AKfycbyBhGbMdj2e7FOfioUNrnTJcpG8ZM0MAsD5iWfO2ZO1Ucx-FUo-SZO9M-PvyHu8o2c/exec",
	SHEETS: {
		BINGO: {
			ID: "1kYcFtsMQOap_52pKlTfWCYJk1O5DD66LlZ90TWCgAyA",
			RANGE: "bingo!A:D",
		},
		NEEDS: {
			ID: "1kYcFtsMQOap_52pKlTfWCYJk1O5DD66LlZ90TWCgAyA",
			RANGE: "needs!A:Z",
		},
		ABOUT: {
			ID: "1kYcFtsMQOap_52pKlTfWCYJk1O5DD66LlZ90TWCgAyA",
			RANGE: "about!A:Z",
		},
		PROJECTS: {
			ID: "1kYcFtsMQOap_52pKlTfWCYJk1O5DD66LlZ90TWCgAyA",
			RANGE: "projects!A:Z",
		},
		WORK: {
			ID: "1kYcFtsMQOap_52pKlTfWCYJk1O5DD66LlZ90TWCgAyA",
			RANGE: "work!A:Z",
		},
		SNAKE: {
			ID: "1kYcFtsMQOap_52pKlTfWCYJk1O5DD66LlZ90TWCgAyA",
			RANGE: "snake!A:C",
		},
	},
};

// Google Apps Script deployment URL
const APPS_SCRIPT_URL = GOOGLE_APPS_CONFIG.SCRIPT_URL;

// Sheet column configurations
export const SHEET_COLUMNS = {
	BINGO: {
		CHECK: "Check",
		CATEGORY: "Category",
		GOAL: "Goal",
		DESCRIPTION: "Description",
		ID: "ID",
	},
	ABOUT: {
		TITLE: "Title",
		CONTENT: "Content",
	},
	PROJECTS: {
		NAME: "Name",
		DESCRIPTION: "Description",
		LINK: "Link",
		IMAGE: "Image",
	},
	WORK: {
		COMPANY: "Company",
		ROLE: "Role",
		PERIOD: "Period",
		DESCRIPTION: "Description",
	},
};

// Helper function to generate a unique callback name
const generateCallbackName = () => {
	return `googleAppsCallback_${Math.random().toString(36).substr(2, 9)}`;
};

// Helper function to create a script tag for JSONP
const createScriptTag = (url) => {
	const script = document.createElement("script");
	script.src = url;
	script.async = true;
	return script;
};

// Helper function to call Apps Script using JSONP
export const callAppsScript = (action, data = {}) => {
	return new Promise((resolve, reject) => {
		const callbackName = generateCallbackName();
		const timeoutDuration = 10000; // 10 seconds timeout
		let timeoutId;
		let script;

		// Create the callback function
		window[callbackName] = (response) => {
			clearTimeout(timeoutId);
			cleanup();

			if (response.error) {
				reject(new Error(response.error));
			} else {
				resolve(response);
			}
		};

		// Cleanup function to remove script tag and callback
		const cleanup = () => {
			if (script?.parentNode) {
				script.parentNode.removeChild(script);
			}
			delete window[callbackName];
		};

		// Handle timeouts
		timeoutId = setTimeout(() => {
			cleanup();
			reject(new Error("Request timed out"));
		}, timeoutDuration);

		try {
			// Build URL with parameters
			const params = new URLSearchParams({
				action,
				data: JSON.stringify(data),
				callback: callbackName,
			});

			// Create and append script tag
			script = createScriptTag(`${APPS_SCRIPT_URL}?${params}`);
			document.body.appendChild(script);

			// Handle script load errors
			script.onerror = () => {
				clearTimeout(timeoutId);
				cleanup();
				reject(new Error("Failed to load script"));
			};
		} catch (error) {
			clearTimeout(timeoutId);
			cleanup();
			reject(error);
		}
	});
};

// Helper function to get Apps Script URL
export const getAppsScriptUrl = () => GOOGLE_APPS_CONFIG.SCRIPT_URL;

// Helper function to make API calls to Apps Script
export const makeApiCall = async (action, data = null) => {
	const url = new URL(getAppsScriptUrl());
	url.searchParams.append("action", action);
	if (data) {
		url.searchParams.append("data", JSON.stringify(data));
	}

	try {
		const response = await fetch(url.toString());
		const result = await response.json();

		if (!result.success && result.error) {
			throw new Error(result.error);
		}

		return result;
	} catch (error) {
		console.error(`Error calling Apps Script (${action}):`, error);
		throw error;
	}
};

// Helper functions for specific tabs
export const getSheetData = async (tabName) => {
	return callAppsScript("getSheetData", { tabName: tabName.toLowerCase() });
};

export const updateSheetData = async (tabName, rowIndex, columnName, value) => {
	return callAppsScript("updateSheetData", {
		tabName: tabName.toLowerCase(),
		rowIndex: rowIndex,
		columnName: columnName,
		value: value,
	});
};

// Test function to check Google Apps Script integration
const testGoogleAppsIntegration = async () => {
	try {
		const bingoResult = await callAppsScript("getSheetData", {
			tabName: "bingo",
		});

		if (bingoResult.success && bingoResult.data.length > 0) {
			const firstItem = bingoResult.data[0];

					// Helper function for updating bingo check status
		const updateBingoCheck = async (value) => {
			return await callAppsScript("updateSheetData", {
				tabName: "bingo",
				rowIndex: 0,
				columnName: SHEET_COLUMNS.BINGO.CHECK,
				value: value,
			});
		};

		// Toggle the check status
		const currentCheck = firstItem[SHEET_COLUMNS.BINGO.CHECK] === "1";
		const updateResult = await updateBingoCheck(currentCheck ? "0" : "1");

		// Revert back to original state
		await updateBingoCheck(currentCheck ? "1" : "0");

			return { success: true, message: "All tests passed!" };
		}

		return { success: false, message: "No data found in bingo sheet" };
	} catch (error) {
                // eslint-disable-next-line no-console
                console.error("Test failed:", error);
		return { success: false, message: error.message };
	}
};

// Make functions available globally for testing
if (typeof window !== "undefined") {
	window.googleAppsTest = {
		testIntegration: testGoogleAppsIntegration,
		callAppsScript,
		SHEET_COLUMNS,
	};
}
