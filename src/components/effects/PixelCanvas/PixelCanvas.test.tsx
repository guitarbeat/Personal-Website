import { render } from "@testing-library/react";
import PixelCanvas from "./PixelCanvas";

// Mock ResizeObserver
class ResizeObserverMock {
  callback: ResizeObserverCallback;

  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
  }

  observe(_target: Element) {
      // Simulate initial resize if needed, or just allow it to be called
  }
  unobserve() {}
  disconnect() {}
}

global.ResizeObserver = ResizeObserverMock as any;

describe("PixelCanvas", () => {
  let mockContext: any;

  beforeEach(() => {
    mockContext = {
      fillRect: jest.fn(),
      clearRect: jest.fn(),
      save: jest.fn(),
      restore: jest.fn(),
      canvas: {
          width: 100,
          height: 100,
          style: {}
      }
    };

    jest.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(() => mockContext);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("renders without crashing", () => {
    render(<PixelCanvas />);
    const container = document.querySelector(".pixel-canvas");
    expect(container).not.toBeNull();
  });

  it("initializes canvas on mount", () => {
      render(<PixelCanvas />);
      expect(HTMLCanvasElement.prototype.getContext).toHaveBeenCalledWith("2d");
  });
});
