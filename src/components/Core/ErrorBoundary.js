import PropTypes from "prop-types";
import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorInfo,
    });
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "100dvh",
            width: "100dvw",
            position: "fixed",
            top: 0,
            left: 0,
            padding: "20px",
            backgroundColor: "rgba(0,0,0,0.9)",
            color: "white",
          }}
        >
          <h1>Something went wrong</h1>
          {process.env.NODE_ENV === "development" && (
            <>
              <pre style={{ maxWidth: "80%", overflow: "auto" }}>
                {this.state.error?.toString()}
              </pre>
              <pre style={{ maxWidth: "80%", overflow: "auto" }}>
                {this.state.errorInfo?.componentStack}
              </pre>
            </>
          )}
          <button
            type="button"
            onClick={() => window.location.reload()}
            style={{
              padding: "10px 20px",
              marginTop: "20px",
              backgroundColor: "white",
              color: "black",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ErrorBoundary;
