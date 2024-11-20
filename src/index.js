import React, { StrictMode } from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import ErrorBoundary from "./common/ErrorBoundary";

const root = document.getElementById("root");
const reactRoot = ReactDOM.createRoot(root);

reactRoot.render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
);