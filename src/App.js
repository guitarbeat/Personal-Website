// Import styles
import "./sass/main.scss";

// Import dependencies
import React, { Suspense, memo } from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import GoogleSheetsProvider from "react-db-google-sheets";

// Import components
import { NavBar, Header, About, Projects, Work } from "./components";
import MagicComponent from "./Magic";
import ThemeSwitcher from "./themeSwitcher";

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
};

// Layout component
const Layout = memo(({ children, withNavBar }) => (
  <React.Fragment>
    <div className="vignete-top" />
    {withNavBar ? (
      <NavBar items={navBarItems} />
    ) : (
      <NavBar items={{ Home: "/#header" }} />
    )}
    {children}
    <div className="vignete-bottom" />
    <div id="magicContainer">
      <MagicComponent />
    </div>
  </React.Fragment>
));

// Higher-order component to wrap a component in the Layout component
const withLayout = (Component) => (props) => (
  <Layout withNavBar>
    <Component {...props} />
  </Layout>
);

const App = () => (
  <GoogleSheetsProvider config={config}>
    <ThemeSwitcher />
    <BrowserRouter>
      <Suspense fallback={<CustomLoadingComponent />}>
        <Switch>
          <Route
            exact
            path="/"
            render={withLayout(() => (
              <React.Fragment>
                <Header />
                <About />
                <Projects />
                <Work />
              </React.Fragment>
            ))}
          />
          <Redirect to="/" />{" "}
        </Switch>
      </Suspense>
    </BrowserRouter>
  </GoogleSheetsProvider>
);

export default App;
