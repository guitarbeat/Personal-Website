import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { AuthProvider } from "../AuthContext";
import Matrix from "../Matrix";

// Mock Canvas API which is not implemented in JSDOM
beforeAll(() => {
  window.HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
    scale: jest.fn(),
    createLinearGradient: jest.fn(() => ({ addColorStop: jest.fn() })),
    fillRect: jest.fn(),
    clearRect: jest.fn(),
    fillText: jest.fn(),
    shadowBlur: 0,
    shadowColor: "",
    fillStyle: "",
    font: "",
  })) as any;
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
});
