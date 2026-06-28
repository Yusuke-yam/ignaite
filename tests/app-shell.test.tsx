import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import HomePage from "@/app/page";

it("LPのメイン領域を表示する", () => {
  render(<HomePage />);
  expect(screen.getByRole("main")).toHaveAttribute("id", "main-content");
});
