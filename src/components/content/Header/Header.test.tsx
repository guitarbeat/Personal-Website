import { fireEvent, render } from "@testing-library/react";
import "@testing-library/jest-dom";

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
    expect(firstHint?.classList.contains("visible")).toBe(false);
    expect(prompt?.textContent).toBe("Tap for more...");

    if (chatBubble) {
      fireEvent.click(chatBubble);
    }

    expect(firstHint?.classList.contains("visible")).toBe(true);
    prompt = container.querySelector(".hint-prompt");
    expect(prompt).not.toBeNull();
    expect(prompt?.textContent).toBe("One more line...");
  });

  it("advances hints up to the maximum level on repeated interactions", () => {
    const { container } = render(<Header />);
    const chatBubble = container.querySelector(".chat-bubble");
    const secondHint = container.querySelector(".hint-section.second");

    expect(chatBubble).not.toBeNull();
    expect(secondHint).not.toBeNull();
    expect(secondHint?.classList.contains("visible")).toBe(false);

    if (chatBubble) {
      fireEvent.click(chatBubble);
      fireEvent.click(chatBubble);
    }

    expect(secondHint?.classList.contains("visible")).toBe(true);
    expect(container.querySelector(".hint-prompt")).toBeNull();

    if (chatBubble) {
      fireEvent.click(chatBubble);
    }

    expect(chatBubble?.classList.contains("level-2")).toBe(true);
    expect(chatBubble?.classList.contains("level-3")).toBe(false);
  });
});

describe("SocialMedia interactions", () => {
  it("renders social media icons as accessible links", () => {
    const { container } = render(<Header />);

    // Check for GitHub link
    const githubLink = container.querySelector(
      'a[href="https://github.com/guitarbeat"]',
    );
    expect(githubLink).not.toBeNull();
    expect(githubLink).toHaveAttribute("target", "_blank");
    expect(githubLink).toHaveAttribute("rel", "noopener noreferrer");
    // We expect the aria-label to be on the link itself for better accessibility
    // The tooltip text in the component is "GitHub: guitarbeat"
    expect(githubLink).toHaveAttribute("aria-label", "GitHub: guitarbeat");

    // Check for Email link
    const emailLink = container.querySelector(
      'a[href="mailto:alwoods@utexas.edu"]',
    );
    expect(emailLink).not.toBeNull();
  });
});
