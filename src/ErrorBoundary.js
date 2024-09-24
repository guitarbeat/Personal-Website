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
  * Special React component used to handle JavaScript errors anywhere in the child component tree.
  * @component
  * @example
  *   <ErrorBoundary>
  *     <ChildComponent />
  *   </ErrorBoundary>
  * @prop {node} children - The components that the ErrorBoundary is wrapping
  * @description
  *   - This component catches JavaScript errors in its child component tree and displays a fallback UI.
  *   - It uses the lifecycle method `componentDidCatch()` to catch errors thrown during rendering.
  *   - The `hasError` state determines whether the fallback UI or the children should be rendered.
  *   - Ensure you only use this component as a wrapper for other components, not for individual elements.
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