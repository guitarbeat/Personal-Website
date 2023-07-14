import { StrictMode } from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "@google/model-viewer";

const rootElement = document.getElementById("root");

ReactDOM.createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);
