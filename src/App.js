import "./sass/main.scss";
import React, { Suspense, memo } from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import GoogleSheetsProvider from "react-db-google-sheets";
import { NavBar, Header, About, Projects, Work, ThemeSwitcher} from "./components";
import MagicComponent from "./Moiree";
import Bingo from './pages/bingo/bingo.js';


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
    <div className="vignete-top" />
    <NavBar items={navItems} />
    {children}
    <div className="vignete-bottom" />
    <div id="magicContainer">
      <MagicComponent />
    </div>
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

const App = () => (
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
);

export default App;
