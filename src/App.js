// File: App.js

// Import styles
import "./sass/main.scss";

// Import dependencies
import React, { lazy, Suspense } from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import GoogleSheetsProvider from "react-db-google-sheets"; //https://github.com/athersharif/metis/tree/main

// Import components
import { NavBar, Header, About, Projects, Work } from "./components";
import MagicComponent from "./Magic";
import ThemeSwitcher from "./themeSwitcher";

// Lazy loading components
const AR = lazy(() => import("./pages/ar"));
const AR2 = lazy(() => import("./pages/ar2"));
const Therosafe = lazy(() => import("./pages/therosafe"));

// Custom loading component with CSS animation
const CustomLoadingComponent = () => (
  <div id="magicContainer">
    <MagicComponent />
  </div>
);

const config = {
  apiKey: "AIzaSyBeKUeUWLmgbvcqggGItv9BPrQN1yyxRbE", // Replace with your actual API key
  discoveryDocs: ["https://sheets.googleapis.com/$discovery/rest?version=v4"],
  spreadsheetId: "1kYcFtsMQOap_52pKlTfWCYJk1O5DD66LlZ90TWCgAyA", // Replace with your actual Spreadsheet ID
  dataLoading: {
    component: CustomLoadingComponent,
  },
};

const App = () => (
  <GoogleSheetsProvider config={config}>
    <ThemeSwitcher />
    <BrowserRouter>
      <div>
        <div className="vignete-top" />
        <NavBar
          items={{
            About: "/#about",
            Projects: "/#projects",
            Work: "/#work",
            // Models: "/ar",
            // Therosafe: "/therosafe",
          }}
        />
        <div>
          <Switch>
            <Suspense fallback={<div>Loading...</div>}>
              {/* Home route */}
              <Route
                exact
                path="/"
                render={() => (
                  <>
                    <Header />
                    <About />
                    <Projects />
                    <Work />
                  </>
                )}
              />

              <Route exact path="/ar" component={AR} />
              <Route exact path="/ar2" component={AR2} />
              <Route exact path="/therosafe" component={Therosafe} />
              <Route path="*" render={() => <Redirect to="/" />} />
            </Suspense>
          </Switch>
        </div>
        <div />
        <div id="magicContainer">
          <MagicComponent />
        </div>
        <div className="vignete-bottom" />
      </div>
    </BrowserRouter>
  </GoogleSheetsProvider>
);

export default App;
