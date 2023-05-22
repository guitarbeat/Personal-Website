// File: App.js

// Import styles
import "./sass/main.scss";

// Import dependencies
import React, { lazy, Suspense } from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

// Import components
import { NavBar, Header, About, Projects, Work } from "./components";
// import MoireEffect from "./components/MoireEffectBackground";

// Lazy loading components
const AR = lazy(() => import("./pages/ar"));
const AR2 = lazy(() => import("./pages/ar2"));
const Therosafe = lazy(() => import("./pages/therosafe"));

const App = () => (
  <BrowserRouter>
    <div>
      <div className="vignete-top" />

      {/* Add the Moire background component here */}
      {/* <MoireEffect /> */}

      {/* Render the navigation bar */}
      <NavBar
        items={{
          About: "/#about",
          Projects: "/#projects",
          Work: "/#work",
          Models: "/ar",
          // CV: "/cv.pdf",
          Therosafe: "/therosafe",
        }}
      />

      <Switch>
        <Suspense fallback={<div>Loading...</div>}>
          {/* Home route */}
          <Route
            exact
            path="/"
            render={() => (
              <>
                {/* Render the header */}
                <Header />

                {/* Render the About section */}
                <About />

                {/* Render the Projects section */}
                <Projects />

                {/* Render the Work section */}
                <Work />
              </>
            )}
          />

          {/* Route for AR component */}
          <Route exact path="/ar" component={AR} />

          {/* Route for AR2 component */}
          <Route exact path="/ar2" component={AR2} />

          {/* Route for Therosafe component */}
          <Route exact path="/therosafe" component={Therosafe} />

          {/* Redirect all other routes to the home page */}
          <Route path="*" render={() => <Redirect to="/" />} />
        </Suspense>
      </Switch>

      <div className="vignete-bottom" />
    </div>
  </BrowserRouter>
);

export default App;
