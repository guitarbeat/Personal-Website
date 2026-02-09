import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import {
  lazy,
  memo,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
// import GoogleSheetsProvider from "react-db-google-sheets";
import { NotionProvider } from "./contexts/NotionContext";
import "./sass/main.scss";
import {
  // GOOGLE_SHEETS_CONFIG,
  NAV_ITEMS,
} from "./components/Core/constants";
import { BlurSection } from "./components/effects/Blur/index";
import CustomCursor from "./components/effects/CustomCursor/CustomCursor";
import InfiniteScrollEffect from "./components/effects/InfiniteScrollEffect";
import FrameEffect from "./components/effects/Loading/FrameEffect";
import LoadingSequence from "./components/effects/Loading/LoadingSequence";
import { AuthProvider, useAuth } from "./components/effects/Matrix/AuthContext";
import ScrollToTopButton from "./components/effects/Matrix/ScrollToTopButton";

const Matrix = lazy(() => import("./components/effects/Matrix/Matrix"));
const FeedbackSystem = () => null;
import MagicComponent from "./components/effects/Moire/Moire";
import { About, Header, NavBar, Projects, Work } from "./components/index";

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

// * Unlocked badge component
const UnlockedBadge = memo(() => {
  const { isUnlocked } = useAuth();

  if (!isUnlocked) {
    return null;
  }

  return (
    <div className="unlocked-badge" role="img" aria-label="Site unlocked">
      <i className="fas fa-unlock" aria-hidden="true" />
    </div>
  );
});
UnlockedBadge.displayName = "UnlockedBadge";

interface LayoutProps {
  children: React.ReactNode;
  navItems: Record<string, string>;
  onMatrixActivate: () => void;
  onScrollActivate: () => void;
  isInScroll: boolean;
  hideNavBar: boolean;
  showMatrix?: boolean;
  onMatrixReady?: (callback: () => void) => void;
  isUnlocked?: boolean;
}

// * Layout wrapper
const Layout = memo(
  ({
    children,
    navItems,
    onMatrixActivate,
    onScrollActivate,
    isInScroll,
    hideNavBar,
  }: LayoutProps) => (
    <div className="app-layout">
      <LoadingSequence onComplete={() => {}} />
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
      <UnlockedBadge />
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

interface MatrixModalProps {
  showMatrix: boolean;
  onSuccess: () => void;
  onMatrixReady: (callback: (() => void) | null) => void;
}

// * Matrix modal wrapper
const MatrixModal = ({
  showMatrix,
  onSuccess,
  onMatrixReady,
}: MatrixModalProps) => (
  <Matrix
    isVisible={showMatrix}
    onSuccess={onSuccess}
    onMatrixReady={onMatrixReady}
  />
);

const MATRIX_DISABLED_VALUES = new Set(["0", "false", "off", "no"]);
const MATRIX_ENABLED_VALUES = new Set(["1", "true", "on", "yes"]);

const shouldShowMatrixFromSearch = (search: string | URLSearchParams) => {
  const params =
    typeof search === "string" || search instanceof URLSearchParams
      ? new URLSearchParams(search)
      : new URLSearchParams();
  if (!params.has("matrix")) {
    return false;
  }

  const value = params.get("matrix");
  if (!value) {
    return false;
  }
  const normalizedValue = value.trim().toLowerCase();

  if (normalizedValue === "") {
    return false;
  }

  if (MATRIX_DISABLED_VALUES.has(normalizedValue)) {
    return false;
  }

  if (MATRIX_ENABLED_VALUES.has(normalizedValue)) {
    return true;
  }

  return false;
};

interface MatrixRouteSyncProps {
  showMatrix: boolean;
  onRouteMatrixChange: (shouldShow: boolean) => void;
}

const MatrixRouteSync = ({
  showMatrix,
  onRouteMatrixChange,
}: MatrixRouteSyncProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const shouldShow = shouldShowMatrixFromSearch(location.search);
    onRouteMatrixChange(shouldShow);
  }, [location.search, onRouteMatrixChange]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const shouldShow = shouldShowMatrixFromSearch(params);

    if (showMatrix) {
      const currentValue = params.get("matrix");
      if (shouldShow && currentValue === "1") {
        return;
      }
      params.set("matrix", "1");
    } else {
      if (!params.has("matrix")) {
        return;
      }
      params.delete("matrix");
    }

    const searchString = params.toString();
    navigate(
      {
        pathname: location.pathname,
        search: searchString ? `?${searchString}` : "",
        hash: location.hash,
      },
      { replace: true },
    );
  }, [showMatrix, location.pathname, location.search, location.hash, navigate]);

  return null;
};

interface MainRoutesProps {
  navItems: Record<string, string>;
  onMatrixActivate: () => void;
  onScrollActivate: () => void;
  isScrollMode: boolean;
  isUnlocked: boolean;
  isInScroll: boolean;
  showMatrix: boolean;
  onMatrixReady: (callback: () => void) => void;
}

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
}: MainRoutesProps) => {
  const location = useLocation();
  const currentIsInScroll = location.pathname === "/scroll" || isInScroll;

  const homePageContent = useMemo(() => <HomePageContent />, []);

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
            <BlurSection as="div" disabled={!isUnlocked} className="">
              <InfiniteScrollEffect shopMode={isScrollMode}>
                {homePageContent}
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
            <BlurSection as="div" disabled={false} className="">
              <InfiniteScrollEffect shopMode={true}>
                {homePageContent}
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
  const [showMatrix, setShowMatrix] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    return shouldShowMatrixFromSearch(window.location.search);
  });
  const { isUnlocked, showSuccessFeedback } = useAuth();
  const [isScrollMode, setIsScrollMode] = useState(false);
  const [isInScroll, setIsInScroll] = useState(false);
  const scrollAnimationRef = useRef<number | null>(null);
  const scrollSpeedRef = useRef<number>(400);

  // --- Effects ---

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
      scrollSpeedRef.current = Math.min(scrollSpeedRef.current + 40, 2000);
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
    const handleKeyDown = (event: KeyboardEvent) => {
      const { key } = event;
      const isToggleKey = key === "Enter" || key === " " || key === "Spacebar";

      if (!isToggleKey) {
        return;
      }

      if (key !== "Enter") {
        event.preventDefault();
      }

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
  const handleRouteMatrixChange = useCallback((shouldShow: boolean) => {
    setShowMatrix((prev) => (prev === shouldShow ? prev : shouldShow));
  }, []);
  const handleScrollActivate = useCallback(() => setIsScrollMode(true), []);

  // Matrix ready callback - will be set by Matrix component
  const matrixReadyCallbackRef = useRef<(() => void) | null>(null);
  const handleMatrixReady = useCallback((callback: (() => void) | null) => {
    matrixReadyCallbackRef.current =
      typeof callback === "function" ? callback : null;
  }, []);

  useEffect(() => {
    if (!showMatrix) {
      return;
    }

    matrixReadyCallbackRef.current?.();
  }, [showMatrix]);

  // --- Render ---
  return (
    <>
      <Suspense fallback={null}>
        <MatrixModal
          showMatrix={showMatrix}
          onSuccess={handleMatrixSuccess}
          onMatrixReady={handleMatrixReady}
        />
      </Suspense>
      <FeedbackSystem showSuccessFeedback={showSuccessFeedback} />
      {isUnlocked ? <CustomCursor /> : null}
      <BrowserRouter>
        <MatrixRouteSync
          showMatrix={showMatrix}
          onRouteMatrixChange={handleRouteMatrixChange}
        />
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
        </Suspense>
      </BrowserRouter>
    </>
  );
};

// * App entry point
const App = () => (
  <NotionProvider>
    <AuthProvider>
      <AppContent />
      <AnalyticsWrapper />
      <SpeedInsights />
    </AuthProvider>
  </NotionProvider>
);

export default App;
