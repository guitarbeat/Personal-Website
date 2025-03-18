// Third-party imports
import React, { Suspense, memo, useState, useCallback, useEffect } from "react";
import GoogleSheetsProvider from "react-db-google-sheets";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

// Styles
import "./sass/main.scss";

import {
	GOOGLE_SHEETS_CONFIG,
	NAV_ITEMS,
} from "./components/Core/constants.js";
// Import Tools components removed temporarily
import { BlurSection } from "./components/effects/Blur";
import LoadingSequence from "./components/effects/Loading/LoadingSequence.js";
// Local imports
import { AuthProvider, useAuth } from "./components/effects/Matrix/AuthContext.js";
import Matrix from "./components/effects/Matrix/Matrix.js";
import FrameEffect from "./components/effects/Loading/FrameEffect.js";
import MagicComponent from "./components/effects/Moiree/Moiree.js";
import { About, Header, NavBar, Projects, Work } from "./components/index.js";
import InfiniteScrollEffect from "./components/effects/InfiniteScrollEffect";

const CustomLoadingComponent = () => (
	<div className="loading-container">
		Loading...
	</div>
);
CustomLoadingComponent.displayName = "CustomLoadingComponent";

const Layout = memo(({ children, navItems, onMatrixActivate, hideNav }) => (
	<div className="app-layout">
		<LoadingSequence />
		<div className="vignette-top" />
		<div className="vignette-bottom" />
		<div className="vignette-left" />
		<div className="vignette-right" />
		{!hideNav && <NavBar items={navItems} onMatrixActivate={onMatrixActivate} />}
		<div id="magicContainer">
			<MagicComponent />
		</div>
		<FrameEffect>{children}</FrameEffect>
	</div>
));

Layout.displayName = "Layout";

const HomePageContent = () => {
	return (
		<div>
			<Header />
			<About />
			<Projects />
			<Work />
			{/* ToolsSection removed temporarily */}
		</div>
	);
};

const AppContent = () => {
	const [showMatrix, setShowMatrix] = useState(false);
	const { isUnlocked } = useAuth();

	// Clean up URL parameter if authenticated
	useEffect(() => {
		const urlParams = new URLSearchParams(window.location.search);
		if (urlParams.has("password")) {
			// Remove the password parameter from URL
			urlParams.delete("password");
			const newUrl =
				window.location.pathname +
				(urlParams.toString() ? `?${urlParams.toString()}` : "");
			window.history.replaceState({}, "", newUrl);
		}
	}, []);

	const handleMatrixActivate = useCallback(() => {
		setShowMatrix(true);
	}, []);

	const handleMatrixSuccess = useCallback(() => {
		setShowMatrix(false);
	}, []);

	return (
		<>
			<Matrix isVisible={showMatrix} onSuccess={handleMatrixSuccess} />
			<BrowserRouter>
				<Suspense fallback={<CustomLoadingComponent />}>
					<Routes>
						<Route
							exact
							path="/"
							element={
								<Layout
									navItems={NAV_ITEMS}
									onMatrixActivate={handleMatrixActivate}
								>
									<BlurSection as="div" disabled={!isUnlocked}>
										<InfiniteScrollEffect>
											<HomePageContent />
										</InfiniteScrollEffect>
									</BlurSection>
								</Layout>
							}
						/>
						{/* Tool routes temporarily removed */}
						<Route path="*" element={<Navigate to="/" replace />} />
					</Routes>
				</Suspense>
			</BrowserRouter>
		</>
	);
};

const App = () => (
	<GoogleSheetsProvider config={GOOGLE_SHEETS_CONFIG}>
		<AuthProvider>
			<AppContent />
		</AuthProvider>
	</GoogleSheetsProvider>
);

export default App;
