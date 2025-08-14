import React from "react";
import { ENV_VARS, ERROR_TYPES } from "../../constants/printful";

const ErrorDisplay = ({ error }) => {
  if (!error) return null;

  return (
    <div className="error-message">
      <p>{error}</p>
      {error.includes(ERROR_TYPES.ENV_VAR_MISSING) && (
        <div className="env-help">
          <h3>Environment Variables Required</h3>
          <p>
            To use this functionality, you need to set the following environment
            variables:
          </p>
          <ul>
            <li>
              <code>{ENV_VARS.API_KEY}</code> - Your Printful API key
            </li>
            <li>
              <code>{ENV_VARS.STORE_ID}</code> - Your Printful store ID
            </li>
          </ul>
          <p>
            Create a <code>.env</code> file in the project root with these
            variables.
          </p>
        </div>
      )}
      {error.includes(ERROR_TYPES.CORS_ERROR) && (
        <div className="env-help">
          <h3>Proxy Configuration Issue</h3>
          <p>
            The application is configured to use a proxy to avoid CORS issues
            with the Printful API.
          </p>
          <p>Please ensure:</p>
          <ul>
            <li>
              The development server is running with <code>npm start</code>
            </li>
            <li>
              The proxy configuration in <code>package.json</code> is set to{" "}
              <code>"proxy": "https://api.printful.com"</code>
            </li>
            <li>
              You've restarted the development server after making changes
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ErrorDisplay;
