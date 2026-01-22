import { render } from "@testing-library/react";
import PixelCanvas from "./PixelCanvas";

// Mock ResizeObserver
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.ResizeObserver = ResizeObserverMock as any;

// Mock Canvas context
const mockContext = {
  save: jest.fn(),
  restore: jest.fn(),
  fillRect: jest.fn(),
  clearRect: jest.fn(),
  beginPath: jest.fn(),
  fill: jest.fn(),
  globalAlpha: 1,
  fillStyle: "#000",
};

// Mock getContext
// We need to type cast properly or use Object.defineProperty
Object.defineProperty(HTMLCanvasElement.prototype, "getContext", {
  value: jest.fn(() => mockContext),
  configurable: true,
});

describe("PixelCanvas", () => {
  it("renders without crashing", () => {
    const { container } = render(<PixelCanvas />);
    // Verify class name using standard Jest matchers
    const element = container.firstElementChild;
    const className = element?.getAttribute("class") || "";
    expect(className).toContain("pixel-canvas");
  });
});
