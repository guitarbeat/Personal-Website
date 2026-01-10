import { render, fireEvent } from '@testing-library/react';
import InfiniteScrollEffect from './InfiniteScrollEffect';

// Mock ResizeObserver
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
window.ResizeObserver = ResizeObserver;

describe('InfiniteScrollEffect Performance', () => {
  let offsetHeightGetter: jest.SpyInstance;

  beforeEach(() => {
    // Mock offsetHeight
    offsetHeightGetter = jest.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(1000);
    Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: 800 });
    Object.defineProperty(window, 'scrollY', { writable: true, configurable: true, value: 0 });
    window.scrollTo = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('DOES NOT access offsetHeight on scroll in shopMode (optimized)', () => {
    render(
      <InfiniteScrollEffect shopMode={true}>
        <div style={{ height: '1000px' }}>Content</div>
      </InfiniteScrollEffect>
    );

    // Initial render might access offsetHeight for initial scroll position or ResizeObserver setup
    offsetHeightGetter.mockClear();

    // Simulate scroll
    fireEvent.scroll(window, { target: { scrollY: 100 } });

    // Expect offsetHeight to NOT be accessed during scroll
    expect(offsetHeightGetter).not.toHaveBeenCalled();
  });
});
