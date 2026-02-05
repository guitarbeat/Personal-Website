import { render, screen } from "@testing-library/react";
import React from "react";
import InfiniteScrollEffect from "./InfiniteScrollEffect";

// Mock ResizeObserver
beforeAll(() => {
  global.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

describe("InfiniteScrollEffect", () => {
  it("renders children multiple times in normal mode", () => {
    render(
      <InfiniteScrollEffect>
        <div data-testid="child">Test Content</div>
      </InfiniteScrollEffect>
    );

    const children = screen.getAllByTestId("child");
    // Normal mode renders 2 copies
    expect(children).toHaveLength(2);
  });

  it("renders children multiple times in shop mode", () => {
    render(
      <InfiniteScrollEffect shopMode={true}>
        <div data-testid="child">Test Content</div>
      </InfiniteScrollEffect>
    );

    const children = screen.getAllByTestId("child");
    // Shop mode renders 5 copies
    expect(children).toHaveLength(5);
  });
});
