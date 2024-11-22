import React, { StrictMode } from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import ErrorBoundary from "./common/ErrorBoundary";

const root = document.getElementById("root");
if (!root) {
  console.error("Fatal Error: Root element with id 'root' not found. Make sure your HTML file includes <div id='root'></div>");
  throw new Error("Root element not found");
}

const reactRoot = ReactDOM.createRoot(root);

reactRoot.render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
);