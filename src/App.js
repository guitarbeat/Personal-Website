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
import "./sass/main.scss";
import {
  GOOGLE_SHEETS_CONFIG,
  NAV_ITEMS,
} from "./components/Core/constants.js";
import { ToolsSection } from "./components/Tools";
import { BlurSection } from "./components/effects/Blur";
import InfiniteScrollEffect from "./components/effects/InfiniteScrollEffect";
import FrameEffect from "./components/effects/Loading/FrameEffect.js";
import LoadingSequence from "./components/effects/Loading/LoadingSequence.js";
import {
  AuthProvider,
  useAuth,
} from "./components/effects/Matrix/AuthContext.js";
import Matrix from "./components/effects/Matrix/Matrix.js";
import MagicComponent from "./components/effects/Moiree/Moiree.js";
import {
  About,
  Header,
  NavBar,
  Projects,
  Shop,
  Work,
} from "./components/index.js";

// * Loading fallback
const CustomLoadingComponent = () => (
  <div className="loading-container">Loading...</div>
);
CustomLoadingComponent.displayName = "CustomLoadingComponent";

// * Layout wrapper
const Layout = memo(
  ({ children, navItems, onMatrixActivate, onShopActivate, isInShop }) => (
    <div className="app-layout">
      <LoadingSequence />
      <div className="vignette-top" />
      <div className="vignette-bottom" />
      <div className="vignette-left" />
      <div className="vignette-right" />
      {!isInShop && (
        <NavBar
          items={navItems}
          onMatrixActivate={onMatrixActivate}
          onShopActivate={onShopActivate}
          isInShop={isInShop}
        />
      )}
      <MagicComponent />
      <FrameEffect>{children}</FrameEffect>
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
    <ToolsSection />
  </div>
);

// * Matrix modal wrapper
const MatrixModal = ({ showMatrix, onSuccess }) => (
  <Matrix isVisible={showMatrix} onSuccess={onSuccess} />
);

// * Shop blur and infinite scroll wrapper
const ShopBlurWrapper = ({ isShopMode, isUnlocked, children }) => (
  <BlurSection
    as="div"
    disabled={!isUnlocked}
    blurCap={isShopMode ? 30 : 10}
    blurAxis={isShopMode ? "both" : "y"}
  >
    <InfiniteScrollEffect shopMode={isShopMode}>
      {children}
    </InfiniteScrollEffect>
  </BlurSection>
);

// * Main routes
const MainRoutes = ({
  navItems,
  onMatrixActivate,
  onShopActivate,
  isShopMode,
  isUnlocked,
  isInShop,
}) => {
  const location = useLocation();
  const currentIsInShop = location.pathname === "/shop" || isInShop;

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Layout
            navItems={navItems}
            onMatrixActivate={onMatrixActivate}
            onShopActivate={onShopActivate}
            isInShop={currentIsInShop}
          >
            {currentIsInShop ? (
              <Shop />
            ) : (
              <ShopBlurWrapper isShopMode={isShopMode} isUnlocked={isUnlocked}>
                <HomePageContent />
              </ShopBlurWrapper>
            )}
          </Layout>
        }
      />
      <Route
        path="/shop"
        element={
          <Layout
            navItems={navItems}
            onMatrixActivate={onMatrixActivate}
            onShopActivate={onShopActivate}
            isInShop={true}
          >
            <Shop />
          </Layout>
        }
      />
      <Route
        path="/tools"
        element={
          <Layout
            navItems={navItems}
            onMatrixActivate={onMatrixActivate}
            onShopActivate={onShopActivate}
            isInShop={currentIsInShop}
          >
            <ShopBlurWrapper isShopMode={isShopMode} isUnlocked={isUnlocked}>
              <ToolsSection />
            </ShopBlurWrapper>
          </Layout>
        }
      />
      <Route
        path="/tools/:toolId/fullscreen"
        element={
          <Layout
            navItems={navItems}
            onMatrixActivate={onMatrixActivate}
            onShopActivate={onShopActivate}
            isInShop={currentIsInShop}
          >
            <ShopBlurWrapper isShopMode={isShopMode} isUnlocked={isUnlocked}>
              <ToolsSection />
            </ShopBlurWrapper>
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
  const { isUnlocked } = useAuth();
  const [isShopMode, setIsShopMode] = useState(false);
  const [isInShop, setIsInShop] = useState(false);
  const scrollAnimationRef = useRef();
  const shopScrollSpeedRef = useRef(400);

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
    shopScrollSpeedRef.current = 400;
  }, []);

  // Shop mode: fast, accelerating scroll
  useEffect(() => {
    if (!isShopMode) {
      cleanupScrollAnimation();
      return;
    }
    const scrollStep = () => {
      window.scrollBy({
        top: shopScrollSpeedRef.current,
        left: 0,
        behavior: "auto",
      });
      shopScrollSpeedRef.current = Math.min(
        shopScrollSpeedRef.current + 40,
        2000,
      );
      scrollAnimationRef.current = requestAnimationFrame(scrollStep);
    };
    shopScrollSpeedRef.current = 400;
    scrollAnimationRef.current = requestAnimationFrame(scrollStep);
    return cleanupScrollAnimation;
  }, [isShopMode, cleanupScrollAnimation]);

  // Shop transition and shop page: handle key press to enter/exit
  useEffect(() => {
    if (!isShopMode && !isInShop) {
      return;
    }
    const handleKeyDown = () => {
      if (isShopMode) {
        setIsShopMode(false);
        setIsInShop(true);
      } else if (isInShop) {
        setIsInShop(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isShopMode, isInShop]);

  // --- Handlers ---
  const handleMatrixActivate = useCallback(() => setShowMatrix(true), []);
  const handleMatrixSuccess = useCallback(() => setShowMatrix(false), []);
  const handleShopActivate = useCallback(() => setIsShopMode(true), []);

  // --- Render ---
  return (
    <>
      <MatrixModal showMatrix={showMatrix} onSuccess={handleMatrixSuccess} />
      <BrowserRouter>
        <Suspense fallback={<CustomLoadingComponent />}>
          <MainRoutes
            navItems={NAV_ITEMS}
            onMatrixActivate={handleMatrixActivate}
            onShopActivate={handleShopActivate}
            isShopMode={isShopMode}
            isUnlocked={isUnlocked}
            isInShop={isInShop}
          />
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
    </AuthProvider>
  </GoogleSheetsProvider>
);

export default App;
