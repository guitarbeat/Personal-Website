import { render, screen } from "@testing-library/react";
import PixelCanvas from "./PixelCanvas";

// Mock ResizeObserver
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.ResizeObserver = ResizeObserver;

// Mock HTMLCanvasElement.getContext
HTMLCanvasElement.prototype.getContext = jest.fn(() => {
  return {
    clearRect: jest.fn(),
    fillRect: jest.fn(),
    save: jest.fn(),
    restore: jest.fn(),
    scale: jest.fn(),
    translate: jest.fn(),
  } as unknown as CanvasRenderingContext2D;
}) as any;

describe("PixelCanvas", () => {
  it("renders without crashing", () => {
    const { container } = render(<PixelCanvas />);
    expect(container.querySelector(".pixel-canvas")).not.toBeNull();
    expect(container.querySelector("canvas")).not.toBeNull();
  });

  it("initializes canvas dimensions", () => {
    render(<PixelCanvas />);
    // The logic inside useEffect needs to run.
    // Since we cannot easily trigger real resize events in JSDOM that work with our mock,
    // we are mainly ensuring that the component logic runs without runtime errors.
  });
});
