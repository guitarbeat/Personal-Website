import "@testing-library/jest-dom";
import { screen } from "@testing-library/react";
import { render } from "../../../../test-utils";
import Matrix from "../Matrix";

describe("Matrix", () => {
  beforeAll(() => {
    window.HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
      createRadialGradient: jest.fn(() => ({
        addColorStop: jest.fn(),
      })),
      createLinearGradient: jest.fn(() => ({
        addColorStop: jest.fn(),
      })),
      fillRect: jest.fn(),
      fillText: jest.fn(),
      scale: jest.fn(),
      translate: jest.fn(),
      save: jest.fn(),
      restore: jest.fn(),
      clearRect: jest.fn(),
      beginPath: jest.fn(),
      moveTo: jest.fn(),
      lineTo: jest.fn(),
      stroke: jest.fn(),
    }));
  });

  it("does not render the test easter egg button", () => {
    render(<Matrix isVisible={true} />);
    const button = screen.queryByRole("button", { name: /test easter egg/i });
    expect(button).not.toBeInTheDocument();
  });
});
