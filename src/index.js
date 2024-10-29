// Import the StrictMode component from React.
// StrictMode checks for common mistakes in your code and warns you about them.
// It is a good idea to always use StrictMode in production code.
import { StrictMode } from "react";

// Import the ReactDOM library from React.
// ReactDOM allows you to render React components to the DOM.
import ReactDOM from "react-dom/client";

// Import the App component from the App.js file.
// The App component is the root component of your React application.
import App from "./App";

// Import the ErrorBoundary component from the ErrorBoundary.js file.
// The ErrorBoundary component catches errors in its child components and displays a fallback UI.
import ErrorBoundary from "./common/ErrorBoundary";

// Get the DOM element with the ID of "root".
// This is the element where you will render your React application.
const appRoot = document.getElementById("root");

// Create a new React root at the specified DOM element and render the App component to it.
ReactDOM.createRoot(appRoot).render(
  // Wrap the App component in the StrictMode component.
  <StrictMode>
    {/* Wrap the App component in the ErrorBoundary component. */}
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
);