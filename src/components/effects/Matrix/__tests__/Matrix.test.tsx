import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import React, { act } from "react";
import { AuthProvider } from "../AuthContext";
import Matrix from "../Matrix";

// Mock HTMLCanvasElement.getContext to verify gradient creation calls
const mockGetContext = jest.fn();
const mockCreateLinearGradient = jest.fn();
const mockCreateRadialGradient = jest.fn();
const mockFillText = jest.fn();
const mockFillRect = jest.fn();
const mockAddColorStop = jest.fn();

beforeAll(() => {
  // Mock requestAnimationFrame
  jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
    return setTimeout(() => cb(Date.now()), 16);
  });

  // Mock cancelAnimationFrame
  jest.spyOn(window, 'cancelAnimationFrame').mockImplementation((id) => {
    clearTimeout(id);
  });

  // Mock Canvas API
  HTMLCanvasElement.prototype.getContext = mockGetContext;

  mockCreateLinearGradient.mockReturnValue({
    addColorStop: mockAddColorStop,
  });

  mockCreateRadialGradient.mockReturnValue({
    addColorStop: mockAddColorStop,
  });

  mockGetContext.mockReturnValue({
    createLinearGradient: mockCreateLinearGradient,
    createRadialGradient: mockCreateRadialGradient,
    fillText: mockFillText,
    fillRect: mockFillRect,
    fillStyle: "",
    shadowColor: "",
    shadowBlur: 0,
    font: "",
  });
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("Matrix", () => {
  it("does not render the test easter egg button", () => {
    render(
      <AuthProvider>
        <Matrix isVisible={true} />
      </AuthProvider>
    );
    const button = screen.queryByRole("button", { name: /test easter egg/i });
    expect(button).not.toBeInTheDocument();
  });

  it("does NOT create gradients in the render loop (optimized behavior)", async () => {
    render(
      <AuthProvider>
        <Matrix isVisible={true} />
      </AuthProvider>
    );

    // Wait for the animation to run a few frames
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    // Check that createLinearGradient was NOT called (it was removed)
    expect(mockCreateLinearGradient).not.toHaveBeenCalled();
    // Check that createRadialGradient was NOT called (it was removed)
    expect(mockCreateRadialGradient).not.toHaveBeenCalled();

    // Check that getContext was called, meaning the component is rendering
    expect(mockGetContext).toHaveBeenCalled();
  });
});
