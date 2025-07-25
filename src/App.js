import React, { Suspense, memo, useState, useCallback, useEffect, useRef } from "react";
import GoogleSheetsProvider from "react-db-google-sheets";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./sass/main.scss";
import {
  GOOGLE_SHEETS_CONFIG,
  NAV_ITEMS,
} from "./components/Core/constants.js";
import { BlurSection } from "./components/effects/Blur";
import LoadingSequence from "./components/effects/Loading/LoadingSequence.js";
import {
  AuthProvider,
  useAuth,
} from "./components/effects/Matrix/AuthContext.js";
import Matrix from "./components/effects/Matrix/Matrix.js";
import FrameEffect from "./components/effects/Loading/FrameEffect.js";
import MagicComponent from "./components/effects/Moiree/Moiree.js";
import { About, Header, NavBar, Projects, Work } from "./components/index.js";
import InfiniteScrollEffect from "./components/effects/InfiniteScrollEffect";

const CustomLoadingComponent = () => (
  <div className="loading-container">Loading...</div>
);
CustomLoadingComponent.displayName = "CustomLoadingComponent";

const Layout = memo(({ children, navItems, onMatrixActivate, hideNav, onShopActivate }) => (
  <div className="app-layout">
    <LoadingSequence />
    <div className="vignette-top" />
    <div className="vignette-bottom" />
    <div className="vignette-left" />
    <div className="vignette-right" />
    {!hideNav && (
      <NavBar items={navItems} onMatrixActivate={onMatrixActivate} onShopActivate={onShopActivate} />
    )}
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
      {/* {ENABLE_TOOLS && <ToolsSection />} */}
    </div>
  );
};

const AppContent = () => {
  const [showMatrix, setShowMatrix] = useState(false);
  const { isUnlocked } = useAuth();
  // * Track if Shop mode is active
  const [isShopMode, setIsShopMode] = useState(false);
  const scrollAnimationRef = useRef();
  const shopScrollSpeedRef = useRef(400); // * Initial scroll speed for Shop mode

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

  useEffect(() => {
    if (!isShopMode) {
      if (scrollAnimationRef.current) {
        cancelAnimationFrame(scrollAnimationRef.current);
        scrollAnimationRef.current = null;
      }
      shopScrollSpeedRef.current = 400; // * Reset speed when exiting Shop mode
      return;
    }
    // * Start fast, accelerating continuous scroll
    const scrollStep = () => {
      window.scrollBy({ top: shopScrollSpeedRef.current, left: 0, behavior: "auto" });
      // Accelerate, but cap at 2000
      shopScrollSpeedRef.current = Math.min(shopScrollSpeedRef.current + 40, 2000);
      scrollAnimationRef.current = requestAnimationFrame(scrollStep);
    };
    shopScrollSpeedRef.current = 400; // * Reset speed when entering Shop mode
    scrollAnimationRef.current = requestAnimationFrame(scrollStep);
    return () => {
      if (scrollAnimationRef.current) {
        cancelAnimationFrame(scrollAnimationRef.current);
        scrollAnimationRef.current = null;
      }
      shopScrollSpeedRef.current = 400; // * Reset speed when exiting Shop mode
    };
  }, [isShopMode]);

  const handleMatrixActivate = useCallback(() => {
    setShowMatrix(true);
  }, []);

  const handleMatrixSuccess = useCallback(() => {
    setShowMatrix(false);
  }, []);

  const handleShopActivate = useCallback(() => {
    setIsShopMode(true);
  }, []);

  return (
    <>
      <Matrix isVisible={showMatrix} onSuccess={handleMatrixSuccess} />
      <BrowserRouter>
        <Suspense fallback={<CustomLoadingComponent />}>
          <Routes>
            <Route
              path="/"
              element={
                <Layout
                  navItems={NAV_ITEMS}
                  onMatrixActivate={handleMatrixActivate}
                  onShopActivate={handleShopActivate}
                >
                  <BlurSection as="div" disabled={!isUnlocked}>
                    <InfiniteScrollEffect shopMode={isShopMode}>
                      <HomePageContent />
                    </InfiniteScrollEffect>
                  </BlurSection>
                </Layout>
              }
            />
            {/* {ENABLE_TOOLS && (
            <Route
              path="/tools"
              element={
                <Layout
                  navItems={NAV_ITEMS}
                  onMatrixActivate={handleMatrixActivate}
                >
                  <BlurSection as="div" disabled={!isUnlocked}>
                    <ToolsSection />
                  </BlurSection>
                </Layout>
              }
            />
            <Route
              path="/tools/:toolId/fullscreen"
              element={
                <Layout
                  navItems={NAV_ITEMS}
                  onMatrixActivate={handleMatrixActivate}
                >
                  <BlurSection as="div" disabled={!isUnlocked}>
                    <ToolsSection />
                  </BlurSection>
                </Layout>
              }
            />
            )} */}
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
