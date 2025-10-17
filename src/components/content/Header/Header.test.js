import { fireEvent, render } from "@testing-library/react";

jest.mock("./useScrambleEffect", () => jest.fn());

import Header from "./Header";

describe("ChatBubble accessibility", () => {
  it("does not throw when activated via keyboard", () => {
    const { container } = render(<Header />);
    const chatBubble = container.querySelector(".chat-bubble");

    expect(chatBubble).not.toBeNull();

    // Ensure no errors occur when triggering the keyboard interaction.
    expect(() => {
      fireEvent.keyUp(chatBubble, { key: "Enter" });
    }).not.toThrow();
  });
});
