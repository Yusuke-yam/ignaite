import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import HomePage from "@/app/page";

const expected = [
  "hero",
  "campaign",
  "problems",
  "about",
  "reviews",
  "feature",
  "flow",
  "final-cta",
  "faq",
  "footer",
];

it("元LPと同じ主要セクション順で表示する", () => {
  const { container } = render(<HomePage />);
  const actual = Array.from(
    container.querySelectorAll("[data-lp-section]"),
  ).map((node) => node.id);

  expect(actual).toEqual(expected);
});

it("ファーストビューと最終CTAを表示し、削除対象セクションは表示しない", () => {
  const { container } = render(<HomePage />);

  expect(
    screen.getByRole("heading", {
      level: 1,
      name: /コーチング.*人生のビジョンを描き、.*AI.*ビジョンを現実にしていく/,
    }),
  ).toBeVisible();
  expect(
    screen.getByText(/認知科学コーチングとAI活用支援の2段階支援で/),
  ).toBeVisible();
  expect(screen.queryByText("総受講生数")).not.toBeInTheDocument();
  expect(screen.queryByText("料金プラン＆サービス比較")).not.toBeInTheDocument();
  expect(screen.queryByText("講座カリキュラム詳細")).not.toBeInTheDocument();
  expect(screen.queryByText("Learn from professionals")).not.toBeInTheDocument();
  expect(screen.queryByText("現役プロから、実務を学ぶ。")).not.toBeInTheDocument();
  expect(container.querySelector("#price")).not.toBeInTheDocument();
  expect(container.querySelector("#curriculum")).not.toBeInTheDocument();
  expect(container.querySelector("#stories")).not.toBeInTheDocument();
  expect(screen.getAllByRole("button", { name: /無料説明会|無料相談会/ }).length).toBeGreaterThan(0);
  const finalCta = container.querySelector("#final-cta");
  expect(finalCta).toBeVisible();
  expect(finalCta).toHaveTextContent("まずは無料相談会に参加");
});

it("ページ内CTAをすべて無効状態で表示する", () => {
  const { container } = render(<HomePage />);

  const ctas = Array.from(
    container.querySelectorAll<HTMLButtonElement>(
      'button[aria-disabled="true"]',
    ),
  ).filter((button) => /無料説明会|無料相談会|空き日程|LINE/.test(button.textContent ?? ""));
  expect(ctas.length).toBeGreaterThan(0);
  ctas.forEach((cta) => {
    expect(cta).toBeDisabled();
    expect(cta).toHaveAttribute("aria-disabled", "true");
  });
});

it("フッターはIgnAIteロゴ・ナビ・規約リンク・現在の無料相談CTAを表示する", () => {
  const { container } = render(<HomePage />);
  const footer = container.querySelector("#footer");

  expect(footer).toBeVisible();
  expect(screen.getAllByAltText("IgnAIte").length).toBeGreaterThan(1);
  expect(footer).toHaveTextContent("挑戦を、カジュアルに。");
  ["IgnAIteとは", "特徴", "概要", "流れ", "FAQ"].forEach((label) => {
    expect(footer).toHaveTextContent(label);
  });
  ["プライバシーポリシー", "運営会社", "特定商取引法に基づく表記", "お問い合わせ"].forEach((label) => {
    expect(footer).toHaveTextContent(label);
  });
  expect(
    footer?.querySelector('button[aria-disabled="true"]'),
  ).toHaveTextContent("無料相談会に参加する");
  expect(footer).toHaveTextContent("Copyright © 2025 UNIT BASE, Inc. All rights reserved.");
});

it("FAQは初期状態で1問目だけを開く", () => {
  render(<HomePage />);

  const firstQuestion = screen.getByRole("button", {
    name: "未経験でも本当に大丈夫ですか？",
  });
  const secondQuestion = screen.getByRole("button", {
    name: "仕事や育児と両立できますか？",
  });

  expect(firstQuestion).toHaveAttribute("aria-expanded", "true");
  expect(secondQuestion).toHaveAttribute("aria-expanded", "false");
});
