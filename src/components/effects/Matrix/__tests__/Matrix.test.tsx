import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { AuthProvider } from "../AuthContext";
import Matrix from "../Matrix";

describe("Matrix", () => {
  it("does not render the test easter egg button", () => {
    render(
      <AuthProvider>
        <Matrix isVisible={true} />
      </AuthProvider>,
    );
    const button = screen.queryByRole("button", { name: /test easter egg/i });
    expect(button).not.toBeInTheDocument();
  });
});
