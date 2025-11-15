import { render, screen } from "@testing-library/react";
import React from "react";
import Matrix from "../Matrix";

describe("Matrix", () => {
	it("does not render the test easter egg button", () => {
		render(<Matrix isVisible={true} />);
		const button = screen.queryByRole("button", { name: /test easter egg/i });
		expect(button).not.toBeInTheDocument();
	});
});
