// Import styles
import "./sass/main.scss";

// Import dependencies
import React, { lazy, Suspense } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import GoogleSheetsProvider from "react-db-google-sheets";

// Import components
import { NavBar, Header, About, Projects, Work } from "./components";
import MagicComponent from "./Magic";
import ThemeSwitcher from "./themeSwitcher";

// Lazy loading components
const AR = lazy(() => import("./pages/ar"));
const AR2 = lazy(() => import("./pages/ar2"));
const Therosafe = lazy(() => import("./pages/therosafe"));
const Friends = lazy(() => import("./pages/fun/friends"));

// Custom loading component with CSS animation
const CustomLoadingComponent = () => (
  <div id="magicContainer">
    <MagicComponent />
  </div>
);

// Configuration for main Google Sheet
const config = {
  apiKey: "AIzaSyBeKUeUWLmgbvcqggGItv9BPrQN1yyxRbE",
  discoveryDocs: ["https://sheets.googleapis.com/$discovery/rest?version=v4"],
  spreadsheetId: "1kYcFtsMQOap_52pKlTfWCYJk1O5DD66LlZ90TWCgAyA",
  dataLoading: {
    component: CustomLoadingComponent,
  },
};

// NavBar items
const navBarItems = {
  About: "/#about",
  Projects: "/#projects",
  Work: "/#work",
  Friends: "/friends",
};

// NavBar items
const navBarHome = {
  Home: "/#header",
};

const LayoutWithNavBar = ({ children }) => (
  <>
    <div className="vignete-top" />
    <NavBar items={navBarItems} />
    {children}
    <div className="vignete-bottom" />
    <div id="magicContainer">
      <MagicComponent />
    </div>
  </>
);

const LayoutWithoutNavBar = ({ children }) => (
  <>
    <div className="vignete-top" />
    <NavBar items={navBarHome} />
    {children}
    <div className="vignete-bottom" />
    <div id="magicContainer">
      <MagicComponent />
    </div>
  </>
);

// Higher-order components
const withLayout = (Component) => (props) =>
  (
    <LayoutWithNavBar>
      <Component {...props} />
    </LayoutWithNavBar>
  );

const withFriendsLayout = (Component) => (props) =>
  (
    <LayoutWithoutNavBar>
      <Component {...props} />
    </LayoutWithoutNavBar>
  );

const App = () => (
  <GoogleSheetsProvider config={config}>
    <ThemeSwitcher />
    <BrowserRouter>
      <Switch>
        <Suspense fallback={null}>
          {/* Home route */}
          <Route
            exact
            path="/"
            component={withLayout(() => (
              <>
                <Header />
                <About />
                <Projects />
                <Work />
              </>
            ))}
          />
          <Route exact path="/ar" component={withLayout(AR)} />
          <Route exact path="/ar2" component={withLayout(AR2)} />
          <Route exact path="/therosafe" component={withLayout(Therosafe)} />
          <Route exact path="/friends" component={withFriendsLayout(Friends)} />
        </Suspense>
      </Switch>
    </BrowserRouter>
  </GoogleSheetsProvider>
);

export default App;
