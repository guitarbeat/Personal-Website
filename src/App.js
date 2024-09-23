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
* Renders the main application routing structure with specific layouts
* @example
* <App />
* Renders the React application with routing and Google Sheets integration.
* @param {Object} config - Configuration object for Google Sheets Provider.
* @returns {JSX.Element} The main React component with routers and layout.
* @description
*   - This component uses `GoogleSheetsProvider` to connect with Google Sheets.
*   - `BrowserRouter` and `Switch` handle routing within the app.
*   - `Suspense` with `fallback` adds loading state during lazy loading.
*   - `Redirect` ensures undefined routes redirect to the homepage.
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
