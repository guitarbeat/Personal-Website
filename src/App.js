import "./sass/main.scss";
import React, { Suspense, memo } from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import GoogleSheetsProvider from "react-db-google-sheets";
import PropTypes from 'prop-types';
import { AuthProvider } from './context/AuthContext';

import { NavBar, Header, About, Projects, Work, ThemeSwitcher } from "./components";
import MagicComponent from "./common/effects/Moiree.js";
import Bingo from './components/Tools/bingo/bingo.js';
import Needs from './components/Tools/needs/needs.js';
import FrameEffect from "./common/FrameEffect.js";
import LoadingSequence from './common/Loading/LoadingSequence.js';
import { GOOGLE_SHEETS_CONFIG, NAV_ITEMS } from './config/constants';
import Tools from './components/Tools/Tools';
import ToolsSection from './components/Tools/ToolsSection';

const CustomLoadingComponent = () => (
  <div id="magicContainer">
    <MagicComponent />
  </div>
);
CustomLoadingComponent.displayName = 'CustomLoadingComponent';

const Layout = memo(({ children, navItems }) => (
  <div className="app-layout">
    <LoadingSequence />
    <div className="vignete-top" />
    <div className="vignete-sides left" />
    <div className="vignete-sides right" />
    <NavBar items={navItems} />
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
  navItems: PropTypes.objectOf(PropTypes.string).isRequired
};

const withLayout = (Component, navItems) => {
  const WrappedComponent = (props) => (
    <Layout navItems={navItems}>
      <Component {...props} />
    </Layout>
  );
  
  WrappedComponent.displayName = `withLayout(${Component.displayName || Component.name})`;
  return WrappedComponent;
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

const App = () => (
  <GoogleSheetsProvider config={GOOGLE_SHEETS_CONFIG}>
    <AuthProvider>
      <ThemeSwitcher />
      <BrowserRouter>
        <Suspense fallback={<CustomLoadingComponent />}>
          <Switch>
            <Route 
              exact 
              path="/" 
              render={withLayout(HomePageContent, NAV_ITEMS)} 
            />
            <Route path="/bingo" component={Bingo} />
            <Route path="/needs" component={Needs} />
            <Route 
              path="/secret-tools" 
              render={withLayout(Tools, NAV_ITEMS)} 
            />
            <Redirect to="/" />
          </Switch>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  </GoogleSheetsProvider>
);

export default App;
