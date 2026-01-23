import { render } from "@testing-library/react";
import PixelCanvas from "./PixelCanvas";

describe("PixelCanvas", () => {
  let originalResizeObserver: any;
  let originalGetContext: any;

  beforeAll(() => {
    // Mock ResizeObserver
    originalResizeObserver = global.ResizeObserver;
    global.ResizeObserver = class ResizeObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
    };

    // Mock Canvas getContext
    originalGetContext = window.HTMLCanvasElement.prototype.getContext;
    window.HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
        save: jest.fn(),
        restore: jest.fn(),
        fillRect: jest.fn(),
        clearRect: jest.fn(),
        beginPath: jest.fn(),
        closePath: jest.fn(),
        fill: jest.fn(),
        arc: jest.fn(),
    })) as any;
  });

  afterAll(() => {
    global.ResizeObserver = originalResizeObserver;
    window.HTMLCanvasElement.prototype.getContext = originalGetContext;
  });

  it("renders without crashing", () => {
    render(<PixelCanvas />);
  });

  it("initializes canvas with correct dimensions", () => {
    const { container } = render(<PixelCanvas />);
    const canvas = container.querySelector("canvas");
    expect(canvas).not.toBeNull();
  });
});
