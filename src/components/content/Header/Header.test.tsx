import { fireEvent, render } from "@testing-library/react";

import Header from "./Header";

describe("ChatBubble interactions", () => {
  it("reveals the first hint and updates the prompt when activated via keyboard", () => {
    const { container } = render(<Header />);
    const chatBubble = container.querySelector(".chat-bubble");
    const firstHint = container.querySelector(".hint-section.first");
    let prompt = container.querySelector(".hint-prompt");

    expect(chatBubble).not.toBeNull();
    expect(firstHint).not.toBeNull();
    expect(prompt).not.toBeNull();
    expect(firstHint!.classList.contains("visible")).toBe(false);
    expect(prompt!.textContent).toBe("Tap for more...");

    fireEvent.keyUp(chatBubble!, { key: "Enter" });

    const updatedFirstHint = container.querySelector(".hint-section.first");
    expect(updatedFirstHint!.classList.contains("visible")).toBe(true);
    prompt = container.querySelector(".hint-prompt");
    expect(prompt).not.toBeNull();
    expect(prompt!.textContent).toBe("One more line...");
  });

  it("advances hints up to the maximum level on repeated interactions", () => {
    const { container } = render(<Header />);
    const chatBubble = container.querySelector(".chat-bubble");
    const secondHint = container.querySelector(".hint-section.second");

    expect(chatBubble).not.toBeNull();
    expect(secondHint).not.toBeNull();
    expect(secondHint!.classList.contains("visible")).toBe(false);

    fireEvent.click(chatBubble!);
    fireEvent.click(chatBubble!);

    expect(secondHint!.classList.contains("visible")).toBe(true);
    expect(container.querySelector(".hint-prompt")).toBeNull();

    fireEvent.click(chatBubble!);

    expect(chatBubble!.classList.contains("level-2")).toBe(true);
    expect(chatBubble!.classList.contains("level-3")).toBe(false);
  });
});
