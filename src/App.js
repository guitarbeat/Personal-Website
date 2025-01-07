import PropTypes from "prop-types";
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
import ToolsSection from "./components/Tools/ToolsSection.js";
import Bingo from "./components/Tools/bingo/bingo.js";
import Needs from "./components/Tools/needs/index.js";
import { BlurSection } from "./components/effects/Blur";
import LoadingSequence from "./components/effects/Loading/LoadingSequence.js";
// Local imports
import { AuthProvider } from "./components/effects/Matrix/AuthContext.js";
import Matrix from "./components/effects/Matrix/Matrix.js";
import FrameEffect from "./components/effects/Moiree/FrameEffect.js";
import MagicComponent from "./components/effects/Moiree/Moiree.js";
import {
	About,
	Header,
	NavBar,
	Projects,
	Work,
} from "./components/index.js";

const CustomLoadingComponent = () => (
	<div id="magicContainer">
		<MagicComponent />
	</div>
);
CustomLoadingComponent.displayName = "CustomLoadingComponent";

const Layout = memo(({ children, navItems, onMatrixActivate }) => (
	<div className="app-layout">
		<LoadingSequence />
		<div className="vignette-top" />
		<div className="vignette-bottom" />
		<div className="vignette-left" />
		<div className="vignette-right" />
		<NavBar items={navItems} onMatrixActivate={onMatrixActivate} />
		<FrameEffect>{children}</FrameEffect>
		<div id="magicContainer">
			<MagicComponent />
		</div>
	</div>
));
Layout.displayName = "Layout";

Layout.propTypes = {
	children: PropTypes.node.isRequired,
	navItems: PropTypes.objectOf(PropTypes.string).isRequired,
	onMatrixActivate: PropTypes.func,
};

const HomePageContent = () => (
	<BlurSection as="main">
		<Header />
		<About />
		<Projects />
		<Work />
		<ToolsSection />
	</BlurSection>
);

const AppContent = () => {
	const [showMatrix, setShowMatrix] = useState(false);

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
									<HomePageContent />
								</Layout>
							}
						/>
						<Route
							path="/bingo"
							element={
								<Layout
									navItems={NAV_ITEMS}
									onMatrixActivate={handleMatrixActivate}
								>
									<Bingo />
								</Layout>
							}
						/>
						<Route
							path="/needs"
							element={
								<Layout
									navItems={NAV_ITEMS}
									onMatrixActivate={handleMatrixActivate}
								>
									<Needs />
								</Layout>
							}
						/>
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
