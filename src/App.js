// Third-party imports
import React, { Suspense, memo, useState, useCallback } from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import GoogleSheetsProvider from "react-db-google-sheets";
import PropTypes from 'prop-types';

// Styles
import "./sass/main.scss";

// Local imports
import { AuthProvider } from './context/AuthContext';
import { NavBar, Header, About, Projects, Work, ThemeSwitcher } from "./components";
import Matrix from './components/Header/Matrix';
import MagicComponent from "./common/effects/Moiree.js";
import Bingo from './components/Tools/bingo/bingo.js';
import Needs from './components/Tools/needs/needs.js';
import FrameEffect from "./common/FrameEffect.js";
import LoadingSequence from './common/Loading/LoadingSequence.js';
import { GOOGLE_SHEETS_CONFIG, NAV_ITEMS } from './config/constants';
import ToolsSection from './components/Tools/ToolsSection';

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
          <Switch>
            <Route exact path="/">
              <Layout navItems={NAV_ITEMS} onMatrixActivate={handleMatrixActivate}>
                <HomePageContent />
              </Layout>
            </Route>
            <Route path="/bingo">
              <Layout navItems={NAV_ITEMS} onMatrixActivate={handleMatrixActivate}>
                <Bingo />
              </Layout>
            </Route>
            <Route path="/needs">
              <Layout navItems={NAV_ITEMS} onMatrixActivate={handleMatrixActivate}>
                <Needs />
              </Layout>
            </Route>
            <Redirect to="/" />
          </Switch>
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
