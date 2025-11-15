// External dependencies
import React, { StrictMode, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";

// Local imports
const App = lazy(() => import("./App.js"));
const ErrorBoundary = lazy(() => import("./components/Core/ErrorBoundary.js"));

// Root element validation
const root = document.getElementById("root");
if (!root) {
	console.error(
		"Fatal Error: Root element with id 'root' not found. Make sure your HTML file includes <div id='root'></div>",
	);
	throw new Error("Root element not found");
}

// Initialize React root with error handling
try {
	const reactRoot = createRoot(root);

	reactRoot.render(
		<StrictMode>
			<Suspense fallback={null}>
				<ErrorBoundary>
					<App />
				</ErrorBoundary>
			</Suspense>
		</StrictMode>,
	);
} catch (error) {
	console.error("Failed to initialize React application:", error);
	root.innerHTML =
		'<div style="color: red; padding: 20px;">Failed to load application. Please refresh the page.</div>';
}
