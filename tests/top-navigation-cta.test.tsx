import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { render, screen, within } from "@testing-library/react";
import { expect, it } from "vitest";

import HomePage from "@/app/page";

const stylesheet = readFileSync(
  resolve(process.cwd(), "app/page.module.css"),
  "utf8",
);

function ruleFor(selector: string) {
  const start = stylesheet.indexOf(`${selector} {`);
  expect(start).toBeGreaterThanOrEqual(0);
  const end = stylesheet.indexOf("}", start);
  return stylesheet.slice(start, end + 1);
}

it("右下固定の円形CTAを表示しない", () => {
  render(<HomePage />);

  expect(screen.queryByTestId("floating-consultation-cta")).not.toBeInTheDocument();
});

it("画面上部中央にIgnAIteロゴ付きの横長CTAナビを表示する", () => {
  render(<HomePage />);

  const header = screen.getByRole("banner");
  const nav = within(header).getByRole("navigation", {
    name: "主要ナビゲーション",
  });
  const logo = within(header).getByRole("img", { name: "IgnAIte" });

  expect(logo).toBeVisible();
  expect(decodeURIComponent(logo.getAttribute("src") ?? "")).toContain(
    "/assets/images/service-logo-cropped.png",
  );
  ["IgnAIteとは", "特徴", "概要", "流れ", "FAQ"].forEach((label) => {
    expect(within(nav).getByRole("link", { name: label })).toBeVisible();
  });
  expect(
    within(header).getByRole("button", {
      name: "無料相談会に参加する▶︎ 簡単30秒",
    }),
  ).toBeDisabled();
});

it("上部CTAナビは左右中央上部に固定し横長ピル形状にする", () => {
  expect(ruleFor(".header")).toContain("position: fixed");
  expect(ruleFor(".header")).toContain("left: 50%");
  expect(ruleFor(".header")).toContain("top: 28px");
  expect(ruleFor(".header")).toContain("transform: translateX(-50%) scale(.86)");
  expect(ruleFor(".header")).toContain("border-radius: 999px");
  expect(ruleFor(".header")).toContain("width: min(860px, calc(100% - 48px))");
  expect(ruleFor(".desktopNav")).toContain("display: flex");
  expect(ruleFor(".headerCta")).toContain("background: var(--gradient-gold)");
  expect(ruleFor(".headerCta")).toContain("border-radius: 999px");
});

it("上部CTAナビのロゴは小さくし右端の余白を詰める", () => {
  expect(ruleFor(".header")).toContain("gap: 34px");
  expect(ruleFor(".header")).toContain("justify-content: flex-start");
  expect(ruleFor(".headerLogo :is(img, [data-safe-image])")).toContain("height: 46px");
  expect(ruleFor(".headerLogo :is(img, [data-safe-image])")).toContain("width: 162px");
  expect(ruleFor(".desktopNav")).toContain("flex: 0 1 auto");
  expect(ruleFor(".desktopNav")).toContain("gap: 34px");
  expect(ruleFor(".desktopNav")).toContain("justify-content: flex-start");
  expect(ruleFor(".headerCta")).toContain("min-width: 236px");
  expect(ruleFor(".headerCta")).toContain("padding: 0 18px");
  expect(ruleFor(".headerCta")).not.toContain("margin-left: auto");
});
