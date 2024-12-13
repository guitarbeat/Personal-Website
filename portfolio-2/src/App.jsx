// Third-party imports
import React, { Suspense, memo, useState, useCallback, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import GoogleSheetsProvider from "react-db-google-sheets";
import PropTypes from 'prop-types';

// Styles
import "./sass/main.scss";

// Local imports
import { AuthProvider } from './context/AuthContext.jsx';
import { NavBar, Header, About, Projects, Work, ThemeSwitcher } from "./components/index.jsx";
import Matrix from './components/Header/Matrix.jsx';
import MagicComponent from "./common/effects/Moiree.jsx";
import Bingo from './components/Tools/bingo/bingo.jsx';
import Needs from './components/Tools/needs/needs.jsx';
import FrameEffect from "./common/FrameEffect.jsx";
import LoadingSequence from './common/Loading/LoadingSequence.jsx';
import { GOOGLE_SHEETS_CONFIG, NAV_ITEMS } from './config/constants.jsx';
import ToolsSection from './components/Tools/ToolsSection.jsx';

const CustomLoadingComponent = () => (
  <div id="magicContainer">
    <MagicComponent />
  </div>
);
CustomLoadingComponent.displayName = 'CustomLoadingComponent';

const Layout = memo(({ children, navItems, onMatrixActivate }) => (
  <div className="app-layout">
    <LoadingSequence />
    <div className="vignete-top" />
    <div className="vignete-sides left" />
    <div className="vignete-sides right" />
    <NavBar items={navItems} onMatrixActivate={onMatrixActivate} />
    <FrameEffect>
      {children}
    </FrameEffect>
    <div className="vignete-bottom" />
    <div id="magicContainer">
      <MagicComponent />
    </div>
  </div>
));
Layout.displayName = 'Layout';

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  navItems: PropTypes.objectOf(PropTypes.string).isRequired,
  onMatrixActivate: PropTypes.func
};

const HomePageContent = () => (
  <main>
    <Header />
    <About />
    <Projects />
    <Work />
    <ToolsSection />
  </main>
);

const AppContent = () => {
  const [showMatrix, setShowMatrix] = useState(false);

  // Clean up URL parameter if authenticated
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('password')) {
      // Remove the password parameter from URL
      urlParams.delete('password');
      const newUrl = window.location.pathname + (urlParams.toString() ? `?${urlParams.toString()}` : '');
      window.history.replaceState({}, '', newUrl);
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
            <Route exact path="/" element={
              <Layout navItems={NAV_ITEMS} onMatrixActivate={handleMatrixActivate}>
                <HomePageContent />
              </Layout>
            } />
            <Route path="/bingo" element={
              <Layout navItems={NAV_ITEMS} onMatrixActivate={handleMatrixActivate}>
                <Bingo />
              </Layout>
            } />
            <Route path="/needs" element={
              <Layout navItems={NAV_ITEMS} onMatrixActivate={handleMatrixActivate}>
                <Needs />
              </Layout>
            } />
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
      <ThemeSwitcher />
      <AppContent />
    </AuthProvider>
  </GoogleSheetsProvider>
);

export default App;
