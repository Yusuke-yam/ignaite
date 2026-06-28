import { render, screen } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { expect, it } from "vitest";

import { FlowSection } from "@/components/sections/FlowSection";

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

it("Flowセクションの3ステップ文言を無料相談会とセッション開始向けに変更する", () => {
  render(<FlowSection />);

  expect(
    screen.getByRole("heading", {
      level: 3,
      name: "オンライン無料相談会",
    }),
  ).toBeVisible();
  expect(screen.getByText("オンラインで無料相談会に参加")).toBeVisible();

  expect(
    screen.getByText(/お申込み後、\s*最短で5日後から受講を始められます。\s*\(事前ワークがあります\)/),
  ).toBeVisible();

  expect(
    screen.getByRole("heading", {
      level: 3,
      name: "セッション開始",
    }),
  ).toBeVisible();
  expect(
    screen.getByText(/担当コーチが、\s*マンツーマンであなたを支援していきます。/),
  ).toBeVisible();

  expect(screen.queryByText("オンライン説明会")).not.toBeInTheDocument();
  expect(screen.queryByText(/毎日10:00〜22:00/)).not.toBeInTheDocument();
  expect(screen.queryByText("学習スタート")).not.toBeInTheDocument();
  expect(screen.queryByText(/担当講師/)).not.toBeInTheDocument();
});

it("STEP 01からSTEP 03までをそれぞれ独立したカードとして表示する", () => {
  render(<FlowSection />);

  ["STEP 01", "STEP 02", "STEP 03"].forEach((step) => {
    expect(screen.getByText(step)).toBeVisible();
  });
  expect(ruleFor(".flowGrid article")).toContain("background: #FFFFFF");
  expect(ruleFor(".flowGrid article")).toContain("border: 1px solid rgba(2,39,105,.16)");
  expect(ruleFor(".flowGrid article")).toContain("border-radius: 24px");
  expect(ruleFor(".flowGrid article")).toContain("box-shadow: 0 18px 34px rgba(2,39,105,.08)");
  expect(ruleFor(".flowGrid article")).toContain("padding: 24px 22px 28px");
});
