import { render, screen } from "@testing-library/react";
import Matrix from "../Matrix";
import "@testing-library/jest-dom";

// Mock AuthContext
jest.mock("../AuthContext", () => ({
  useAuth: () => ({
    completeHack: jest.fn(),
    showSuccessFeedback: false,
  }),
}));

// Mock Audio
if (typeof window.HTMLMediaElement.prototype.play === 'undefined') {
    Object.defineProperty(window.HTMLMediaElement.prototype, 'play', {
        configurable: true,
        // Define as a writable property or setter if needed, but simple mock is usually enough
        value: jest.fn().mockResolvedValue(undefined)
    });
} else {
    window.HTMLMediaElement.prototype.play = jest.fn().mockResolvedValue(undefined);
}

if (typeof window.HTMLMediaElement.prototype.pause === 'undefined') {
    Object.defineProperty(window.HTMLMediaElement.prototype, 'pause', {
        configurable: true,
        value: jest.fn()
    });
} else {
    window.HTMLMediaElement.prototype.pause = jest.fn();
}

// Mock Canvas
beforeAll(() => {
  // Mock requestAnimationFrame
  jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
    return setTimeout(() => cb(Date.now()), 0) as unknown as number;
  });

  jest.spyOn(window, 'cancelAnimationFrame').mockImplementation((id) => {
    clearTimeout(id);
  });

  // Mock Canvas context
  window.HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
    createRadialGradient: jest.fn(() => ({
      addColorStop: jest.fn(),
    })),
    createLinearGradient: jest.fn(() => ({
      addColorStop: jest.fn(),
    })),
    fillRect: jest.fn(),
    fillText: jest.fn(),
    canvas: {
      width: 100,
      height: 100,
    },
    // Add other methods used in Matrix.tsx
    fillStyle: '',
    shadowColor: '',
    shadowBlur: 0,
    font: '',
  })) as any;
});

afterAll(() => {
    jest.restoreAllMocks();
});

describe("Matrix", () => {
  it("does not render the test easter egg button", () => {
    render(<Matrix isVisible={true} />);
    const button = screen.queryByRole("button", { name: /test easter egg/i });
    expect(button).not.toBeInTheDocument();
  });

  it("renders canvas and terminal", () => {
    render(<Matrix isVisible={true} />);
    expect(screen.getByRole("img", { name: /Matrix rain animation/i })).toBeInTheDocument();
    expect(screen.getByText(/PHASE 1: FIREWALL PENETRATION/i)).toBeInTheDocument();
  });
});
