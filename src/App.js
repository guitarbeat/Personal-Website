import "./sass/main.scss";
import React, { Suspense, memo } from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import GoogleSheetsProvider from "react-db-google-sheets";
import PropTypes from 'prop-types';
import { NavBar, Header, About, Projects, Work, ThemeSwitcher } from "./components";
import MagicComponent from "./Moiree";
import Bingo from './pages/bingo/bingo.js';
import FrameEffect from "./FrameEffect";
import LoadingSequence from './LoadingSequence';
import { GOOGLE_SHEETS_CONFIG, NAV_ITEMS } from './config/constants';

const CustomLoadingComponent = () => (
  <div id="magicContainer">
    <MagicComponent />
  </div>
);

const Layout = memo(({ children, navItems }) => (
  <div className="app-layout">
    <LoadingSequence />
    <div className="vignete-top" />
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
  </main>
);

const App = () => (
  <GoogleSheetsProvider config={GOOGLE_SHEETS_CONFIG}>
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
          <Redirect to="/" />
        </Switch>
      </Suspense>
    </BrowserRouter>
  </GoogleSheetsProvider>
);

export default App;
