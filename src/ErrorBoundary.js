import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.log(error, errorInfo);
  }

  /**
  * ErrorBoundary component used to catch JavaScript errors anywhere in the child component tree.
  * @component
  * @example
  *   <ErrorBoundary>
  *     <ChildComponent />
  *   </ErrorBoundary>
  * @prop {node} children - The child components that the ErrorBoundary is wrapping.
  * @description
  *   - This component acts as a middleware to catch errors in child components and display a fallback UI.
  *   - The state variable `hasError` is used to determine if an error has been caught.
  *   - The render method checks `hasError` and renders a fallback UI or passes the children through.
  *   - Style object in the fallback UI is for centering the error message on the screen.
  */
  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          width: '100vw',
          position: 'fixed',
          top: 0,
          left: 0,
        }}>
          <h1>Something went wrong.</h1>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;