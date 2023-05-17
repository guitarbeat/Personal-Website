import "./sass/main.scss";

import React, { lazy, Suspense } from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import NavBar from "./components/NavBar";
import Header from "./components/Header";
import About from "./components/About";
import Projects from "./components/Projects";
import Work from "./components/Work";

// Lazy loading components
const AR = lazy(() => import("./pages/ar"));
const AR2 = lazy(() => import("./pages/ar2"));
const Therosafe = lazy(() => import("./pages/therosafe"));

const App = () => (
  <BrowserRouter>
    <div>
      <div className="vignete-top" />
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
      <div className="vignete-bottom" />
    </div>
  </BrowserRouter>
);

export default App;
