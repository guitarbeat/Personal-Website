import "@testing-library/jest-dom";
import React from "react";
import { render, screen, act } from "@testing-library/react";
import InfiniteScrollEffect from "../InfiniteScrollEffect";

describe("InfiniteScrollEffect", () => {
  it("renders children multiple times in shop mode", () => {
    render(
      <InfiniteScrollEffect shopMode={true}>
        <div data-testid="item">Item</div>
      </InfiniteScrollEffect>
    );

    // BUFFER_COUNT is 5
    const items = screen.getAllByTestId("item");
    expect(items).toHaveLength(5);
  });

  it("updates content height on resize", () => {
    const { container } = render(
      <InfiniteScrollEffect shopMode={true}>
        <div style={{ height: "100px" }} data-testid="item">Item</div>
      </InfiniteScrollEffect>
    );

    // Trigger resize
    act(() => {
      window.dispatchEvent(new Event("resize"));
    });

    // Just checking no crash
    expect(screen.getAllByTestId("item")).toHaveLength(5);
  });
});
