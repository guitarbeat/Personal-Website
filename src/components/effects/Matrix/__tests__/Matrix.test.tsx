import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom"; // Import custom matchers
import { AuthProvider } from "../AuthContext";
import Matrix from "../Matrix";

describe("Matrix", () => {
  it("does not render the test easter egg button", () => {
    // Mock canvas context
    const mockGetContext = jest.fn();
    HTMLCanvasElement.prototype.getContext = mockGetContext;

    // Mock audio
    window.HTMLMediaElement.prototype.play = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    window.HTMLMediaElement.prototype.pause = jest.fn();

    render(
      <AuthProvider>
        <Matrix isVisible={true} />
      </AuthProvider>,
    );
    const button = screen.queryByRole("button", { name: /test easter egg/i });
    expect(button).not.toBeInTheDocument();
  });
});
