import React, {
  Suspense,
  memo,
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";
import GoogleSheetsProvider from "react-db-google-sheets";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import "./sass/main.scss";
import {
  GOOGLE_SHEETS_CONFIG,
  NAV_ITEMS,
} from "./components/Core/constants.js";
import { BlurSection } from "./components/effects/Blur";
import InfiniteScrollEffect from "./components/effects/InfiniteScrollEffect";
import FrameEffect from "./components/effects/Loading/FrameEffect.js";
import LoadingSequence from "./components/effects/Loading/LoadingSequence.js";
import {
  AuthProvider,
  useAuth,
} from "./components/effects/Matrix/AuthContext.js";
import Matrix from "./components/effects/Matrix/Matrix.js";
import PasscodeInput from "./components/effects/Matrix/PasscodeInput.jsx";
import ScrollToTopButton from "./components/effects/Matrix/ScrollToTopButton.jsx";
import FeedbackSystem from "./components/effects/Matrix/FeedbackSystem.js";
import MagicComponent from "./components/effects/Moiree/Moiree.js";
import {
  About,
  Header,
  NavBar,
  Projects,
  Work,
} from "./components/index.js";

// * Loading fallback
const CustomLoadingComponent = () => (
  <div className="loading-container">Loading...</div>
);
CustomLoadingComponent.displayName = "CustomLoadingComponent";

const AnalyticsWrapper = memo(() => {
  if (process.env.REACT_APP_ENABLE_VERCEL_ANALYTICS !== "true") {
    return null;
  }
  return <Analytics />;
});
AnalyticsWrapper.displayName = "AnalyticsWrapper";

// * Layout wrapper
const Layout = memo(
  ({ children, navItems, onMatrixActivate, onScrollActivate, isInScroll, showMatrix, onMatrixReady, isUnlocked, hideNavBar }) => (
    <div className="app-layout">
      <LoadingSequence />
      <div className="vignette-top" />
      <div className="vignette-bottom" />
      <div className="vignette-left" />
      <div className="vignette-right" />
      {!hideNavBar && (
        <NavBar
          items={navItems}
          onMatrixActivate={onMatrixActivate}
          onShopActivate={onScrollActivate}
          isInShop={isInScroll}
        />
      )}
      <MagicComponent />
      <FrameEffect>{children}</FrameEffect>
      <ScrollToTopButton />
    </div>
  ),
);
Layout.displayName = "Layout";

// * Home page content
const HomePageContent = () => (
  <div>
    <Header />
    <About />
    <Projects />
    <Work />
  </div>
);

// * Matrix modal wrapper
const MatrixModal = ({ showMatrix, onSuccess, onMatrixReady }) => (
  <Matrix isVisible={showMatrix} onSuccess={onSuccess} onMatrixReady={onMatrixReady} />
);

// * Main routes
const MainRoutes = ({
  navItems,
  onMatrixActivate,
  onScrollActivate,
  isScrollMode,
  isUnlocked,
  isInScroll,
  showMatrix,
  onMatrixReady,
}) => {
  const location = useLocation();
  const currentIsInScroll = location.pathname === "/scroll" || isInScroll;

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Layout
            navItems={navItems}
            onMatrixActivate={onMatrixActivate}
            onScrollActivate={onScrollActivate}
            isInScroll={currentIsInScroll}
            showMatrix={showMatrix}
            onMatrixReady={onMatrixReady}
            isUnlocked={isUnlocked}
            hideNavBar={false}
          >
            <BlurSection as="div" disabled={!isUnlocked}>
              <InfiniteScrollEffect shopMode={isScrollMode}>
                <HomePageContent />
              </InfiniteScrollEffect>
            </BlurSection>
          </Layout>
        }
      />
      <Route
        path="/scroll"
        element={
          <Layout
            navItems={navItems}
            onMatrixActivate={onMatrixActivate}
            onScrollActivate={onScrollActivate}
            isInScroll={true}
            showMatrix={showMatrix}
            onMatrixReady={onMatrixReady}
            isUnlocked={true}
            hideNavBar={true}
          >
            <BlurSection as="div" disabled={false}>
              <InfiniteScrollEffect shopMode={true}>
                <HomePageContent />
              </InfiniteScrollEffect>
            </BlurSection>
          </Layout>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

// * Main app content logic
const AppContent = () => {
  // --- State and refs ---
  const [showMatrix, setShowMatrix] = useState(false);
  const { isUnlocked, showIncorrectFeedback, showSuccessFeedback, failedAttempts, dismissFeedback } = useAuth();
  const [isScrollMode, setIsScrollMode] = useState(false);
  const [isInScroll, setIsInScroll] = useState(false);
  const scrollAnimationRef = useRef();
  const scrollSpeedRef = useRef(400);

  // --- Effects ---
  // Clean up URL parameter if authenticated
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has("password")) {
      urlParams.delete("password");
      const newUrl =
        window.location.pathname +
        (urlParams.toString() ? `?${urlParams.toString()}` : "");
      window.history.replaceState({}, "", newUrl);
    }
  }, []);

  // Utility function to cleanup scroll animation
  const cleanupScrollAnimation = useCallback(() => {
    if (scrollAnimationRef.current) {
      cancelAnimationFrame(scrollAnimationRef.current);
      scrollAnimationRef.current = null;
    }
    scrollSpeedRef.current = 400;
  }, []);

  // Scroll mode: fast, accelerating scroll
  useEffect(() => {
    if (!isScrollMode) {
      cleanupScrollAnimation();
      return;
    }
    const scrollStep = () => {
      window.scrollBy({
        top: scrollSpeedRef.current,
        left: 0,
        behavior: "auto",
      });
      scrollSpeedRef.current = Math.min(
        scrollSpeedRef.current + 40,
        2000,
      );
      scrollAnimationRef.current = requestAnimationFrame(scrollStep);
    };
    scrollSpeedRef.current = 400;
    scrollAnimationRef.current = requestAnimationFrame(scrollStep);
    return cleanupScrollAnimation;
  }, [isScrollMode, cleanupScrollAnimation]);

  // Scroll transition and scroll page: handle key press to enter/exit
  useEffect(() => {
    if (!isScrollMode && !isInScroll) {
      return;
    }
    const handleKeyDown = () => {
      if (isScrollMode) {
        setIsScrollMode(false);
        setIsInScroll(true);
      } else if (isInScroll) {
        setIsInScroll(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isScrollMode, isInScroll]);

  // --- Handlers ---
  const handleMatrixActivate = useCallback(() => setShowMatrix(true), []);
  const handleMatrixSuccess = useCallback(() => setShowMatrix(false), []);
  const handleScrollActivate = useCallback(() => setIsScrollMode(true), []);

  // Matrix ready callback - will be set by Matrix component
  const matrixReadyCallbackRef = useRef(null);
  const handleMatrixReady = useCallback((callback) => {
    matrixReadyCallbackRef.current = callback;
  }, []);

  // --- Render ---
  return (
    <>
      <MatrixModal showMatrix={showMatrix} onSuccess={handleMatrixSuccess} onMatrixReady={handleMatrixReady} />
      <FeedbackSystem
        showIncorrectFeedback={showIncorrectFeedback}
        showSuccessFeedback={showSuccessFeedback}
        failedAttempts={failedAttempts}
        dismissFeedback={dismissFeedback}
      />
      <BrowserRouter>
        <Suspense fallback={<CustomLoadingComponent />}>
          <MainRoutes
            navItems={NAV_ITEMS}
            onMatrixActivate={handleMatrixActivate}
            onScrollActivate={handleScrollActivate}
            isScrollMode={isScrollMode}
            isUnlocked={isUnlocked}
            isInScroll={isInScroll}
            showMatrix={showMatrix}
            onMatrixReady={handleMatrixReady}
          />
          <div className="auth-controls">
            <PasscodeInput />
          </div>
        </Suspense>
      </BrowserRouter>
    </>
  );
};

// * App entry point
const App = () => (
  <GoogleSheetsProvider config={GOOGLE_SHEETS_CONFIG}>
    <AuthProvider>
      <AppContent />
      <AnalyticsWrapper />
    </AuthProvider>
  </GoogleSheetsProvider>
);

export default App;
