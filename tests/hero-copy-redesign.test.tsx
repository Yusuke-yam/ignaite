import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";

import { HeroSection } from "@/components/sections/HeroSection";

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

function mobileRuleFor(selector: string) {
  const mediaStart = stylesheet.indexOf("@media (max-width: 809.98px)");
  expect(mediaStart).toBeGreaterThanOrEqual(0);
  const nextMediaStart = stylesheet.indexOf("@media", mediaStart + 1);
  const mobileStylesheet = stylesheet.slice(
    mediaStart,
    nextMediaStart >= 0 ? nextMediaStart : undefined,
  );
  const start = mobileStylesheet.indexOf(`${selector} {`);
  expect(start).toBeGreaterThanOrEqual(0);
  const end = mobileStylesheet.indexOf("}", start);
  return mobileStylesheet.slice(start, end + 1);
}

it("HeroをコーチングとAIの2行見出しへ変更する", () => {
  const { container } = render(<HeroSection />);
  const heading = screen.getByRole("heading", { level: 1 });
  const titleLines = heading.children;
  const goldWords = container.querySelectorAll('[data-hero-gold="true"]');

  expect(heading).toHaveTextContent(
    "コーチングで人生のビジョンを描き、AIでビジョンを現実にしていく",
  );
  expect(titleLines).toHaveLength(2);
  expect(titleLines[0]).toHaveTextContent("コーチングで人生のビジョンを描き、");
  expect(titleLines[1]).toHaveTextContent("AIでビジョンを現実にしていく");
  expect(goldWords).toHaveLength(2);
  expect(goldWords[0]).toHaveTextContent("コーチング");
  expect(goldWords[1]).toHaveTextContent("AI");
  expect(screen.queryByText(/未経験から最短で/)).not.toBeInTheDocument();
  expect(screen.queryByText(/AI活用のプロになる/)).not.toBeInTheDocument();
});

it("Heroの用途タグを5項目に変更しゴールドグラデーション文字にする", () => {
  render(<HeroSection />);

  expect(screen.getByText("キャリアチェンジ")).toBeVisible();
  expect(screen.getByText("キャリアアップ")).toBeVisible();
  expect(screen.getByText("副業")).toBeVisible();
  expect(screen.getByText("個人事業")).toBeVisible();
  expect(screen.getByText("起業")).toBeVisible();
  expect(screen.queryByText("転職")).not.toBeInTheDocument();
  expect(ruleFor(".heroBadges span")).toContain("background: var(--gradient-gold)");
  expect(ruleFor(".heroBadges span")).toContain("background-clip: text");
  expect(ruleFor(".heroBadges span")).toContain("color: transparent");
  expect(ruleFor(".heroBadges span")).toContain("-webkit-text-fill-color: transparent");
  expect(ruleFor(".heroBadges span")).toContain("isolation: isolate");
  expect(ruleFor(".heroBadges span")).toContain("position: relative");
  expect(ruleFor(".heroBadges span::before")).toContain("background: #022769");
  expect(ruleFor(".heroBadges span::before")).toContain("clip-path: polygon(5px 0, 100% 0, calc(100% - 5px) 100%, 0 100%)");
});

it("Hero説明文を18pxの3行コピーへ変更する", () => {
  render(<HeroSection />);

  const lead = screen.getByText(/認知科学コーチングとAI活用支援の2段階支援で/);

  expect(lead).toHaveTextContent(
    "認知科学コーチングとAI活用支援の2段階支援であなたが叶えたい理想のキャリアを発見し、それを現実にしていくサポートを行います",
  );
  expect(lead.querySelectorAll("br")).toHaveLength(2);
  expect(screen.queryByText(/生成AIをあなたの武器に変える/)).not.toBeInTheDocument();
  expect(ruleFor(".heroLead")).toContain("font-size: 18px");
  expect(ruleFor(".heroLead")).toContain('font-family: "Noto Sans CJK JP", "Noto Sans JP", sans-serif');
  expect(ruleFor(".heroLead")).toContain("text-align: left");
  expect(ruleFor(".heroLead")).toContain("line-height: 1.7");
});

it("Heroの実績表示と黄色HUDを表示しない", () => {
  const { container } = render(<HeroSection />);

  expect(screen.queryByText("総受講生数")).not.toBeInTheDocument();
  expect(screen.queryByText("受講生満足度")).not.toBeInTheDocument();
  expect(screen.queryByText("3500")).not.toBeInTheDocument();
  expect(screen.queryByText("94.0")).not.toBeInTheDocument();
  expect(container.querySelector('[data-testid="hero-hud"]')).not.toBeInTheDocument();
  expect(stylesheet).not.toContain(".heroHud");
  expect(stylesheet).not.toContain(".heroStats");
});

it("Hero右側のムービー1は人物が中央に寄る表示位置で埋め込む", () => {
  const { container } = render(<HeroSection />);
  const movie = container.querySelector<HTMLVideoElement>('[data-testid="hero-movie"]');

  expect(movie).not.toBeNull();
  expect(movie).toHaveAttribute("src", "/assets/videos/hero-movie-1.mp4");
  expect(movie).toHaveAttribute("autoplay");
  expect(movie).toHaveAttribute("loop");
  expect(movie?.muted).toBe(true);
  expect(movie).toHaveAttribute("playsinline");
  expect(screen.queryByAltText("AIスキルを学ぶ受講生")).not.toBeInTheDocument();
  expect(ruleFor(".heroMovie")).toContain("object-fit: cover");
  expect(ruleFor(".heroMovie")).toContain("object-position: 62% center");
});

it("見出しのゴールド強調とレスポンシブサイズを保持する", () => {
  expect(ruleFor(".hero h1")).toContain('font-family: "Zen Kaku Gothic New", "Noto Sans JP", sans-serif');
  expect(ruleFor(".hero h1")).toContain("font-size: 45px");
  expect(ruleFor(".heroTitleLine")).toContain("white-space: nowrap");
  expect(ruleFor(".heroGold")).toContain("color: var(--color-gold)");
  expect(stylesheet).not.toContain(".hero h1 strong::after");
  expect(mobileRuleFor(".heroLead")).toContain("font-size: 18px");
  expect(mobileRuleFor(".heroLead")).toContain("text-align: left");
});

it("狭幅でも見出しと実績値をHero画像領域に重ねない", () => {
  expect(mobileRuleFor(".heroText")).toContain("top: 78px");
  expect(mobileRuleFor(".heroBadges")).toContain("margin-bottom: 10px");
  expect(mobileRuleFor(".hero h1")).toContain(
    "font-size: clamp(16px, 5.1vw, 20px)",
  );
  expect(mobileRuleFor(".hero h1")).toContain("letter-spacing: -0.02em");
  expect(mobileRuleFor(".heroLead")).toContain("margin: 14px auto 8px");
  expect(mobileRuleFor(".hero")).toContain("height: 800px");
  expect(mobileRuleFor(".heroVisual")).toContain("height: 355px");
});
