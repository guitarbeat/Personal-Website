import React from "react";
import { render, screen, waitFor, act } from "@testing-library/react";

import Projects from "./Projects";
import { generateItemColors } from "../../../utils/colorUtils";

jest.mock("react-db-google-sheets", () => ({
  withGoogleSheets: () => (Component) => Component,
}));

jest.mock("../../../utils/colorUtils", () => {
  const actual = jest.requireActual("../../../utils/colorUtils");
  return {
    ...actual,
    generateItemColors: jest.fn(),
  };
});

const MOCK_PROJECTS = [
  {
    title: "Project One",
    slug: "project-one",
    date: "2024",
    keyword: "React",
    link: "https://example.com/react",
    content: "React project",
    image: null,
  },
  {
    title: "Project Two",
    slug: "project-two",
    date: "2023",
    keyword: "Node",
    link: "https://example.com/node",
    content: "Node project",
    image: null,
  },
];

describe("Projects", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("regenerates tag colors when the theme changes", async () => {
    generateItemColors
      .mockImplementationOnce(() => ({
        React: "hsl(0, 0%, 50%)",
        Node: "hsl(120, 100%, 50%)",
      }))
      .mockImplementation(() => ({
        React: "hsl(200, 60%, 55%)",
        Node: "hsl(40, 80%, 60%)",
      }));

    render(<Projects db={{ projects: MOCK_PROJECTS }} />);

    const reactFilter = await screen.findByRole("button", { name: "React" });

    await waitFor(() => {
      expect(reactFilter.style.borderLeft).toBe(
        "4px solid hsl(0, 0%, 50%)",
      );
    });

    act(() => {
      document.body.dispatchEvent(new CustomEvent("theme-changed"));
    });

    expect(generateItemColors).toHaveBeenCalledTimes(2);
    expect(generateItemColors).toHaveBeenLastCalledWith(
      MOCK_PROJECTS,
      "keyword",
    );

    await waitFor(() => {
      expect(reactFilter.style.borderLeft).toBe(
        "4px solid hsl(200, 60%, 55%)",
      );
      expect(reactFilter.className).toContain("active");
    });
  });
});
