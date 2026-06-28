import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { expect, it } from "vitest";

const cssFiles = [
  "app/globals.css",
  "app/page.module.css",
  "components/ui/FloatingConsultationCta.module.css",
] as const;

const stylesheets = cssFiles
  .map((file) => readFileSync(resolve(process.cwd(), file), "utf8"))
  .join("\n");

it("LP全体の基準カラーをNavy、Gold Gradient、White、Inkへ変更する", () => {
  expect(stylesheets).toContain("--color-navy: #022769");
  expect(stylesheets).toContain("--color-ink: #16181D");
  expect(stylesheets).toContain("--gradient-gold: linear-gradient(135deg, #E7A200 0%, #FEE21C 100%)");
  expect(stylesheets).toContain("--color-red: #022769");
});

it("旧レッド・ピンク・イエロー・グリーン系の直書き色を残さない", () => {
  [
    "#ff282d",
    "#850507",
    "#fff7f7",
    "#fff9f9",
    "#fff8f8",
    "#fffafa",
    "#ffe8eb",
    "#ffd9de",
    "#f3cfd4",
    "#f3cfd2",
    "#f5d6d8",
    "#cb8c8e",
    "#fa4d50",
    "#ff2930",
    "#ff5258",
    "#ff6f73",
    "#ff3d42",
    "#ffe600",
    "#12c978",
  ].forEach((oldColor) => {
    expect(stylesheets.toLowerCase()).not.toContain(oldColor);
  });
});
