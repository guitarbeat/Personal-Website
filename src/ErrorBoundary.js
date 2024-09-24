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
  * A higher-order component that catches JavaScript errors in its child component tree.
  * @component
  * @example
  *   <ErrorBoundary>
  *     <ChildComponent />
  *   </ErrorBoundary>
  * @prop {node} children - The child components to be wrapped by the error boundary.
  * @state {boolean} hasError - Indicates if an error was caught by the boundary.
  * @description
  *   - It renders a fallback UI with an error message when an error occurs.
  *   - It should be placed at the top-level of your app's component hierarchy.
  *   - This component abstracts away error handling logic from child components.
  *   - Utilize componentDidCatch lifecycle method to update the hasError state.
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