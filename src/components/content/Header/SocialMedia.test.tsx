import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { SocialMedia, type SocialMediaProps } from "./Header";

describe("SocialMedia", () => {
  const defaultProps: SocialMediaProps = {
    keyword: "TestLink",
    icon: "fa-test",
    link: "https://example.com",
    tooltip: "Test Tooltip",
  };

  it("renders an anchor tag with the correct href", () => {
    render(<SocialMedia {...defaultProps} />);
    const linkElement = screen.getByRole("link", { name: /Go to TestLink/i });
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute("href", "https://example.com");
  });

  it("has the correct aria-label", () => {
    render(<SocialMedia {...defaultProps} />);
    const linkElement = screen.getByRole("link");
    expect(linkElement).toHaveAttribute("aria-label", "Go to TestLink");
  });

  it("opens in a new tab with secure attributes", () => {
    render(<SocialMedia {...defaultProps} />);
    const linkElement = screen.getByRole("link");
    expect(linkElement).toHaveAttribute("target", "_blank");
    expect(linkElement).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("renders custom icon when provided", () => {
    const propsWithIcon = { ...defaultProps, customIcon: "custom.png" };
    const { container } = render(<SocialMedia {...propsWithIcon} />);
    const imgElement = container.querySelector("img");
    expect(imgElement).toHaveAttribute("src", "custom.png");
    expect(imgElement).toHaveAttribute("alt", "");
    expect(imgElement).toHaveClass("custom-icon");
  });
});
