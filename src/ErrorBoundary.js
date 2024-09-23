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
  * Error boundary component to catch JavaScript errors anywhere in the child component tree.
  * @component
  * @example
  *   <ErrorBoundary>
  *     <ChildComponent />
  *   </ErrorBoundary>
  * @prop {ReactNode} children - The child components that ErrorBoundary is wrapping
  * @description
  *   - This component uses React lifecycle method componentDidCatch to handle exceptions.
  *   - It renders a fallback UI instead of the component tree that threw an error.
  *   - State variable hasError determines what is rendered by the component.
  *   - Customize the style of the fallback UI as needed.
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