import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import ScrollToTopButton from "../ScrollToTopButton.jsx";
import { useScrollThreshold } from "../../../../hooks/useScrollThreshold";

jest.mock("../../../../hooks/useScrollThreshold", () => ({
  useScrollThreshold: jest.fn(),
}));

describe("ScrollToTopButton", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.scrollTo = jest.fn();
  });

  it("asks the scroll threshold hook for the default matrix values", () => {
    useScrollThreshold.mockReturnValue(false);

    render(<ScrollToTopButton />);

    expect(useScrollThreshold).toHaveBeenCalledWith(300, 100);
  });

  it("does not render when the scroll position is below the threshold", () => {
    useScrollThreshold.mockReturnValue(false);

    const { container } = render(<ScrollToTopButton />);

    expect(container.firstChild).toBeNull();
    expect(window.scrollTo).not.toHaveBeenCalled();
  });

  it("scrolls smoothly to the top when the button is clicked", async () => {
    useScrollThreshold.mockReturnValue(true);

    render(<ScrollToTopButton />);

    const button = screen.getByRole("button", { name: /scroll to top/i });
    const user = userEvent.setup();
    await user.click(button);

    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
  });
});
