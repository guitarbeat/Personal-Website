import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import PixelCanvas from "./PixelCanvas";

describe("PixelCanvas", () => {
  let originalResizeObserver: any;

  beforeAll(() => {
    originalResizeObserver = global.ResizeObserver;
    // Mock ResizeObserver
    global.ResizeObserver = class ResizeObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
    };

    // Mock HTMLCanvasElement.getContext
    jest.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation((contextId) => {
        if (contextId === '2d') {
            return {
                save: jest.fn(),
                restore: jest.fn(),
                fillRect: jest.fn(),
                clearRect: jest.fn(),
                beginPath: jest.fn(),
                moveTo: jest.fn(),
                lineTo: jest.fn(),
                stroke: jest.fn(),
                fill: jest.fn(),
                arc: jest.fn(),
                scale: jest.fn(),
                translate: jest.fn(),
                rotate: jest.fn(),
                globalAlpha: 1,
                fillStyle: '',
            } as unknown as CanvasRenderingContext2D;
        }
        return null;
    });
  });

  afterAll(() => {
    global.ResizeObserver = originalResizeObserver;
    jest.restoreAllMocks();
  });

  it("renders without crashing", () => {
    const { container } = render(<PixelCanvas />);
    expect(container.firstChild).toHaveClass("pixel-canvas");
  });
});
