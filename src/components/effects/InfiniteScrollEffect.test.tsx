import React from 'react';
import { render } from '@testing-library/react';
import InfiniteScrollEffect from './InfiniteScrollEffect';

// Mock ResizeObserver
beforeAll(() => {
  global.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

describe('InfiniteScrollEffect Performance', () => {
  it('should not remount children on re-render when using stable keys', () => {
    const mountCount = jest.fn();

    const ChildComponent = () => {
      React.useEffect(() => {
        mountCount();
      }, []);
      return <div>Child Content</div>;
    };

    const { rerender } = render(
      <InfiniteScrollEffect shopMode={false}>
        <ChildComponent />
      </InfiniteScrollEffect>
    );

    // Initial render: 2 copies (default)
    expect(mountCount).toHaveBeenCalledTimes(2);

    // Re-render with same props
    rerender(
      <InfiniteScrollEffect shopMode={false}>
        <ChildComponent />
      </InfiniteScrollEffect>
    );

    // After optimization, children should NOT remount, so count remains 2.
    expect(mountCount).toHaveBeenCalledTimes(2);
  });
});
