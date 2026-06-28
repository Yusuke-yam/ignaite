import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { render, screen, within } from "@testing-library/react";
import { expect, it } from "vitest";

import HomePage from "@/app/page";

const stylesheet = readFileSync(
  resolve(process.cwd(), "app/page.module.css"),
  "utf8",
);
const visualE2e = readFileSync(
  resolve(process.cwd(), "e2e/visual.spec.ts"),
  "utf8",
);
const nextConfig = readFileSync(
  resolve(process.cwd(), "next.config.ts"),
  "utf8",
);

function ruleFor(selector: string) {
  const start = stylesheet.indexOf(`${selector} {`);
  expect(start, `${selector} のCSSルール`).toBeGreaterThanOrEqual(0);
  const end = stylesheet.indexOf("}", start);
  return stylesheet.slice(start, end + 1);
}

it("LPスタイルシートのブロック構文を閉じる", () => {
  const openingBraces = stylesheet.match(/\{/g) ?? [];
  const closingBraces = stylesheet.match(/\}/g) ?? [];

  expect(closingBraces).toHaveLength(openingBraces.length);
});

it("画像代替要素も主要レイアウトの画像CSSを継承する", () => {
  expect(stylesheet).toContain(":is(img, [data-safe-image])");
  expect(stylesheet).not.toMatch(/\.heroVisual img\s*\{/);
  expect(stylesheet).not.toMatch(/\.aboutVisual img\s*\{/);
  expect(stylesheet).not.toMatch(/\.voiceScroller img\s*\{/);
});

it("Visual E2Eは遅延画像をeager化しdecode完了後に撮影する", () => {
  expect(visualE2e).toContain("document.images");
  expect(visualE2e).toContain('image.loading = "eager"');
  expect(visualE2e).toContain("image.decode()");
});

it("Visual E2EへNext.js開発インジケーターを写り込ませない", () => {
  expect(nextConfig).toContain("devIndicators: false");
});

it("Heroは上部CTAナビを表示し実績とHUDを表示しない", () => {
  const { container } = render(<HomePage />);
  const header = container.querySelector("header");

  expect(header).not.toBeNull();
  expect(
    within(header as HTMLElement).getByRole("navigation", {
      name: "主要ナビゲーション",
    }),
  ).toBeInTheDocument();
  expect(within(header as HTMLElement).queryByTestId("menu-icon")).not.toBeInTheDocument();
  expect(screen.queryByText("総受講生数")).not.toBeInTheDocument();
  expect(screen.queryByText("受講生満足度")).not.toBeInTheDocument();
  expect(screen.queryByText("副業成功率")).not.toBeInTheDocument();
  expect(screen.queryByTestId("hero-hud")).not.toBeInTheDocument();

  expect(ruleFor(".header")).toContain("width: min(860px, calc(100% - 48px))");
  expect(ruleFor(".heroText")).toContain("top: 161px");
  expect(ruleFor(".heroVisual")).toContain("width: 57.2%");
  expect(ruleFor(".heroVisual")).toContain("clip-path: polygon(18% 0, 100% 0, 100% 100%, 0 100%)");
});

it("Campaignはデスクトップ割引ピルを表示せずモバイル用2画像を持つ", () => {
  render(<HomePage />);

  expect(screen.queryByTestId("desktop-campaign-pill")).not.toBeInTheDocument();
  expect(screen.getByAltText("全額返金保証")).toBeVisible();
  expect(screen.getByAltText("受講料割引キャンペーン")).toBeVisible();
  expect(ruleFor(".campaign")).toContain("min-height: 0");
});

it("DesktopのFeature周辺を参照の4138px予算へ圧縮する", () => {
  render(<HomePage />);

  expect(document.querySelector("#feature01")).toHaveAttribute("data-feature-card", "01");
  expect(document.querySelector("#feature02")).toHaveAttribute("data-feature-card", "02");
  expect(ruleFor(".feature")).toContain("padding: 70px 0 20px");
  expect(ruleFor(".feature > .sectionHeading")).toContain("margin-bottom: 40px");
  expect(ruleFor(".featureCardPrimary")).toContain("min-height: 600px");
  expect(ruleFor(".featureCardSecondary")).toContain("min-height: 630px");
  expect(ruleFor(".featureCardSecondary")).toContain("padding: 56px 64px");
  expect(ruleFor(".curriculum")).toContain("padding: 12px 24px 20px");
  expect(ruleFor(".curriculumTabs")).toContain("margin: 4px auto 0");
  expect(ruleFor(".curriculumPanel")).toContain("min-height: 280px");
  expect(ruleFor(".curriculumPanel")).toContain("padding: 16px");
  expect(ruleFor(".learningArea")).toContain("margin: 4px auto 0");
  expect(ruleFor(".learningArea")).toContain("padding: 12px");
  expect(ruleFor(".learningArea > h3, .supportSystem > h3")).toContain("margin: 0");
  expect(ruleFor(".learningArea > h3, .supportSystem > h3")).toContain("font-size: 24px");
  expect(ruleFor(".learningSteps article > div")).toContain("height: 36px");
  expect(ruleFor(".supportSystem")).toContain("margin-top: 8px");
});

it("Desktopの口コミ帯と共通CTAを内容を保ったまま圧縮する", () => {
  expect(ruleFor(".reviews")).toContain("padding: 60px 0 75px");
  expect(ruleFor(".reviewsHeading")).toContain("margin-bottom: 30px");
  expect(ruleFor(".reviewMarquee")).toContain("margin: 6px 0");
  expect(ruleFor(".reviewMarquee article")).toContain("min-height: 122px");
  expect(ruleFor(".finalCta")).toContain("min-height: 400px");
  expect(ruleFor(".finalCta")).toContain("background: #022769");
  expect(ruleFor(".finalCta")).toContain("border-radius: 28px");
  expect(ruleFor(".finalCta")).toContain("max-width: 1120px");
  expect(ruleFor(".finalCta")).toContain("padding: 42px 96px 32px");
  expect(ruleFor(".finalCta::before")).toContain("border: 74px solid rgba(255,255,255,.08)");
  expect(ruleFor(".ctaGrid")).toContain("background: #FFFFFF");
  expect(ruleFor(".ctaGrid")).toContain("grid-template-columns: 1fr");
  expect(ruleFor(".ctaGrid")).toContain("margin: 34px auto 0");
  expect(ruleFor(".ctaGrid .whiteCta")).toContain("background: transparent");
});

it("最終CTAとFooterを参照のFAQ開始・ページ終端へ合わせる", () => {
  expect(ruleFor(":global(#final-cta) .finalCta")).toContain("min-height: 465px");
  expect(ruleFor(".footer")).toContain("background: #022769");
  expect(ruleFor(".footer")).toContain("padding: 58px max(24px, calc((100% - 1120px) / 2)) 22px");
  expect(ruleFor(".footerLogo")).toContain("background: transparent");
  expect(ruleFor(".footerActions")).toContain("justify-content: flex-end");
  expect(ruleFor(".footerNav")).toContain("background: #FFFFFF");
  expect(ruleFor(".redCta")).toContain("background: var(--gradient-gold)");
  expect(ruleFor(".footerBottom")).toContain("margin-top: 52px");
});

it("口コミ帯は左右フェードを持つ", () => {
  expect(ruleFor(".reviewMarquee")).toContain("mask-image: linear-gradient");
});

it("Priceは2002px高と620px比較表を持つ", () => {
  expect(ruleFor(".price")).toContain("min-height: 2002px");
  expect(ruleFor(".planGrid")).toContain("margin: 55px auto 679px");
  expect(ruleFor(".comparisonTable")).toContain("height: 620px");
  expect(ruleFor(".comparisonTable")).toContain("width: 1000px");
  expect(ruleFor(".comparisonTable th, .comparisonTable td")).toContain("height: 110px");
});

it("FlowとFAQとFooterは参照境界高を持つ", () => {
  expect(ruleFor(".flowArt")).toContain("height: 171px");
  expect(ruleFor(".flowArt")).toContain("border-radius: 0");
  expect(ruleFor(".faq")).toContain("min-height: 801px");
  expect(ruleFor(".footer")).toContain("min-height: 333px");
});

it("共通相談会CTAを2回表示しFlow直前CTAを除去する", () => {
  const { container } = render(<HomePage />);
  const panels = container.querySelectorAll('[data-briefing-cta="true"]');

  expect(panels).toHaveLength(2);
  expect(panels[0]).toHaveTextContent("まずは無料相談会に参加");
  expect(panels[0]).toHaveTextContent("あなたの人生を前進させるヒントや、あなたのAI活用方法のヒントが得られる60分！");
  expect(panels[0]).not.toHaveTextContent("まずは無料で説明会に参加");
  expect(panels[0]).not.toHaveTextContent("Attend a briefing session");
  expect(panels[0]).not.toHaveTextContent("累計 6,000人以上が参加");
  expect(panels[0]).not.toHaveTextContent("学習の進め方から収益化のステップまで");
  expect(panels[0]).not.toHaveTextContent("LINEでお問い合わせ");
  const flow = container.querySelector("#flow");
  expect(flow?.previousElementSibling).toHaveAttribute("id", "feature");
  const faq = container.querySelector("#faq");
  expect(faq).not.toBeNull();
  expect(
    panels[1].compareDocumentPosition(faq as Element) &
      Node.DOCUMENT_POSITION_FOLLOWING,
  ).toBeTruthy();
  panels.forEach((panel) => {
    within(panel as HTMLElement).getAllByRole("button").forEach((button) => {
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute("aria-disabled", "true");
    });
  });
});

it("Mobile向けのProblem幅とFeature・Price・Flow・FAQ高を保持する", () => {
  expect(stylesheet).toMatch(/@media \(max-width: 809\.98px\)[\s\S]*?\.heroVisual \{[^}]*bottom: 0;[^}]*top: auto/);
  expect(stylesheet).toMatch(/@media \(max-width: 809\.98px\)[\s\S]*?\.campaign \{[^}]*min-height: 330px;[^}]*padding: 68px 16px 50px/);
  expect(stylesheet).toMatch(
    /@media \(max-width: 809\.98px\)[\s\S]*?\.problemStage \{[^}]*max-width: 520px/,
  );
  expect(stylesheet).toMatch(/@media \(max-width: 809\.98px\)[\s\S]*?\.featureCardPrimary \{[^}]*min-height: 780px/);
  expect(stylesheet).toMatch(/@media \(max-width: 809\.98px\)[\s\S]*?\.featureCardSecondary \{[^}]*min-height: 720px/);
  expect(stylesheet).toMatch(/@media \(max-width: 809\.98px\)[\s\S]*?\.planGrid \{[^}]*margin-bottom: 270px/);
  expect(stylesheet).toMatch(/@media \(max-width: 809\.98px\)[\s\S]*?\.learningArea \{[^}]*margin-top: 45px;[^}]*padding: 28px 16px/);
  expect(stylesheet).toMatch(/@media \(max-width: 809\.98px\)[\s\S]*?\.price \{[^}]*min-height: 2047px/);
  expect(stylesheet).toMatch(/@media \(max-width: 809\.98px\)[\s\S]*?\.flow \{[^}]*min-height: 2411px/);
  expect(stylesheet).toMatch(/@media \(max-width: 809\.98px\)[\s\S]*?\.faq \{[^}]*min-height: 792px/);
  expect(stylesheet).toMatch(/@media \(max-width: 430px\)[\s\S]*?\.flowGrid article \{[^}]*min-height: 620px/);
});
