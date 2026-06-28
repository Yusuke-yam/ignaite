import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";

import { AboutSection } from "@/components/sections/AboutSection";

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

it("About見出しをIgnAIteと2段階支援の説明へ変更する", () => {
  const { container } = render(<AboutSection />);
  const heading = screen.getByRole("heading", { level: 2, name: "IgnAIteとは" });
  const aboutGold = container.querySelectorAll('[data-about-gold="true"]');

  expect(heading).toBeVisible();
  expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent(
    "認知科学コーチングとAI活用支援の2段階支援で結果にこだわる実践型サービス",
  );
  expect(aboutGold).toHaveLength(2);
  expect(aboutGold[0]).toHaveTextContent("認知科学コーチング");
  expect(aboutGold[1]).toHaveTextContent("AI活用支援");
  expect(screen.queryByText(/d デジハク/)).not.toBeInTheDocument();
  expect(screen.queryByText(/生成AI × 実務力/)).not.toBeInTheDocument();
  expect(screen.queryByText(/実践型スクール/)).not.toBeInTheDocument();
});

it("About本文をコーチングとAI活用支援の両方が必要な説明へ変更する", () => {
  render(<AboutSection />);

  expect(
    screen.getByText("なぜ「コーチングだけ」「AI活用支援だけ」ではないのか。"),
  ).toBeVisible();
  expect(screen.getByText("コーチングだけだと▶︎")).toBeVisible();
  expect(
    screen.getByText(/自分のやりたいこと\/人生の方向性は明確になったが/),
  ).toBeVisible();
  expect(screen.getByText("AI活用支援だけだと▶︎")).toBeVisible();
  expect(
    screen.getByText(/最新情報に溺れて自分に必要なAI知識が身につかず/),
  ).toBeVisible();
  expect(screen.getByText("だからIgnAIteは両方を支援します。")).toBeVisible();
  expect(
    screen.getByText(/コーチング×AI活用支援で着実に現実を変えていく支援を行います。/),
  ).toBeVisible();
  expect(screen.queryByText(/デジハクは、AIスキルを学ぶだけ/)).not.toBeInTheDocument();
  expect(screen.queryByText(/スキル習得、実践、収益化まで/)).not.toBeInTheDocument();
});

it("Aboutのゴールド強調色を保持する", () => {
  expect(ruleFor(".aboutGold")).toContain("color: var(--color-gold)");
});

it("About右側の画像はコーチング×AI活用支援の素材を使用する", () => {
  render(<AboutSection />);
  const aboutImage = screen.getByAltText("専任講師のマンツーマンサポート");
  const renderedSrc = decodeURIComponent(aboutImage?.getAttribute("src") ?? "");

  expect(renderedSrc).toContain("coaching-ai-support-2.png");
});

it("About右側の画像は丸角と斜め効果を外し、全体表示する", () => {
  expect(ruleFor(".aboutVisual")).toContain("border-radius: 0");
  expect(ruleFor(".aboutVisual")).toContain("transform: none");
  expect(ruleFor(".aboutVisual")).toContain("overflow: visible");
  expect(ruleFor(".aboutVisual")).toContain("aspect-ratio: 16 / 9");
  expect(ruleFor(".aboutVisual::after")).toContain("display: none");
  expect(ruleFor(".aboutVisual :is(img, [data-safe-image])")).toContain("object-fit: contain");
});

it("About右側の画像は文章に被せず、表示範囲を画面内に収める", () => {
  render(<AboutSection />);

  expect(screen.queryByText("学びを、成果へ。")).not.toBeInTheDocument();
  expect(ruleFor(".aboutCopy")).toContain("position: relative");
  expect(ruleFor(".aboutCopy")).toContain("z-index: 2");
  expect(ruleFor(".aboutVisual")).toContain("width: min(201%, calc(100vw - 252px))");
  expect(ruleFor(".aboutVisual")).toContain("max-width: none");
  expect(ruleFor(".aboutVisual")).toContain("margin-left: 20%");
  expect(ruleFor(".aboutVisual")).toContain("z-index: 1");
});
