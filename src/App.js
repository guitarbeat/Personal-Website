import "./sass/main.scss";
import React, { Suspense, memo } from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import GoogleSheetsProvider from "react-db-google-sheets";
import { NavBar, Header, About, Projects, Work, ThemeSwitcher} from "./components";
import MagicComponent from "./Moiree";
import Bingo from './pages/bingo/bingo.js';
import FrameEffect from "./FrameEffect";
// import ShaderEffectComponent from './ShaderEffectComponent';
import LoadingSequence from './LoadingSequence';


const CustomLoadingComponent = () => (
  <div id="magicContainer">
    <MagicComponent />
  </div>
);

const config = {
  apiKey: "AIzaSyBeKUeUWLmgbvcqggGItv9BPrQN1yyxRbE",
  discoveryDocs: ["https://sheets.googleapis.com/$discovery/rest?version=v4"],
  spreadsheetId: "1kYcFtsMQOap_52pKlTfWCYJk1O5DD66LlZ90TWCgAyA",
  dataLoading: {
    component: CustomLoadingComponent,
  },
};

const navBarItems = {
  About: "/#about",
  Projects: "/#projects",
  Work: "/#work",
};

const Layout = memo(({ children, navItems }) => (
  
  <>
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
    {/* <ShaderEffectComponent /> */}
    </>
));

const withLayout = (Component, navItems) => (props) =>
  (
    <Layout navItems={navItems}>
      <Component {...props} />
    </Layout>
  );

const HomePageContent = () => (
  <>
    <Header />
    <About />
    <Projects />
    <Work />
  </>
);

/**
* Initializes the main app component with routing and Google Sheets integration
* @example
* <App />
* Renders the BrowserRouter with ThemeSwitcher and defined routes.
* @param {object} config - Google Sheets API configuration object.
* @returns {React.Component} A React component that provides the app structure with Google Sheets Provider, ThemeSwitcher, React Router, and routing logic.
* @description
*   - This is a high-order component wrapping the entire application.
*   - The 'config' parameter must conform to the shape required by the GoogleSheetsProvider.
*   - ThemeSwitcher allows dynamic theme changes throughout the app.
*   - Suspense and fallback are used for lazy loading and rendering a loading component until the route's component is loaded.
*/
const App = () => {
  return (
    <>
  
  <GoogleSheetsProvider config={config}>
    <ThemeSwitcher />
    <BrowserRouter>
      <Suspense fallback={<CustomLoadingComponent />}>
        <Switch>
          <Route exact path="/" render={withLayout(HomePageContent, navBarItems)} />
          <Route path="/bingo" component={Bingo} /> 
          <Redirect to="/" />
        </Switch>
      </Suspense>
    </BrowserRouter>
  </GoogleSheetsProvider>
    </>
  );
};

export default App;
