import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { render, screen, within } from "@testing-library/react";
import { expect, it } from "vitest";

import { FeatureSection } from "@/components/sections/FeatureSection";

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

it("Featuresセクションの見出しをIgnAIte向けに変更する", () => {
  render(<FeatureSection />);

  expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
    "IgnAIteが選ばれる理由",
  );
  expect(screen.queryByText("Features")).not.toBeInTheDocument();
  expect(screen.queryByText("選ばれる理由はこの2つ")).not.toBeInTheDocument();
});

it("Feature01をプロ認知科学コーチとAIコンサルタントの支援内容へ変更する", () => {
  render(<FeatureSection />);

  expect(
    screen.getByRole("heading", {
      level: 3,
      name: "認定率5.7%のプロ認知科学コーチと、 AIコンサルタントがサポートするから結果がでる。",
    }),
  ).toBeVisible();
  expect(
    screen.getByText(/オンラインでの1on1セッションとLINEによるチャットサポートにて/),
  ).toBeVisible();
  expect(screen.getByText(/マンツーマンであなたに伴走します。/)).toBeVisible();
  expect(screen.queryByText(/即戦力のAIスキル/)).not.toBeInTheDocument();
  expect(screen.queryByText(/学んだことがそのまま/)).not.toBeInTheDocument();
});

it("Feature01本文直下にサポート体制カードを3つ表示する", () => {
  const { container } = render(<FeatureSection />);
  const supportPanel = container.querySelector("[data-feature-support-panel]");

  expect(supportPanel).not.toBeNull();
  expect(within(supportPanel as HTMLElement).getByText("サポート体制")).toBeVisible();
  [
    "現役の認知科学コーチによる1on1支援",
    "現役のAIコンサルタントによる1on1支援",
    "いつでもチャット相談可能",
  ].forEach((label) => {
    expect(within(supportPanel as HTMLElement).getByText(label)).toBeVisible();
  });
  expect(within(supportPanel as HTMLElement).queryByText("現役プロ講師による1on1指導")).not.toBeInTheDocument();
  expect(within(supportPanel as HTMLElement).queryByText("案件獲得・キャリア支援")).not.toBeInTheDocument();
  expect(ruleFor(".featureSupportPanel")).toContain("background: rgba(2,39,105,.06)");
  expect(ruleFor(".featureSupportCards")).toContain("grid-template-columns: repeat(3,1fr)");
});

it("Feature01右側のカード画像をプロフィール写真へ差し替える", () => {
  render(<FeatureSection />);

  const profileImage = screen.getByRole("img", { name: "プロフィール写真" });

  expect(profileImage).toBeVisible();
  expect(decodeURIComponent(profileImage.getAttribute("src") ?? "")).toContain(
    "/assets/images/profile-photo.png",
  );
  expect(screen.queryByText("GENERATED")).not.toBeInTheDocument();
  expect(screen.queryByText("WORK")).not.toBeInTheDocument();
  expect(screen.queryByText("AIライティング")).not.toBeInTheDocument();
  expect(ruleFor(".featureProfilePhoto")).toContain("object-fit: cover");
  expect(ruleFor(".featureProfilePhoto")).not.toContain("rotate(");
  expect(ruleFor(".featureProfileFrame::before")).not.toContain("rotate(");
});

it("プロフィール写真の真下に人物紹介文を表示する", () => {
  render(<FeatureSection />);

  expect(
    screen.getByText("山本宥佑 | 認知科学コーチ 兼 AIコンサルタント"),
  ).toBeVisible();
  expect(ruleFor(".featureProfileCaption")).toContain("text-align: center");
});

it("Feature02を一人一人にカスタマイズされたプログラム内容へ変更する", () => {
  render(<FeatureSection />);

  expect(
    screen.getByRole("heading", {
      level: 3,
      name: "一人一人カスタマイズされたプログラムを提供",
    }),
  ).toBeVisible();
  expect(
    screen.getByText(/コーチングによって発見される「人生のビジョンやゴール」は百人百様です。/),
  ).toBeVisible();
  expect(
    screen.getByText(/当然一人一人カスタマイズし、あなただけの支援プログラムで伴走します。/),
  ).toBeVisible();
  expect(screen.queryByText(/専任サポートで/)).not.toBeInTheDocument();
  expect(screen.queryByText(/成果にコミット/)).not.toBeInTheDocument();
  expect(screen.queryByText(/学習サポートにとどまらず/)).not.toBeInTheDocument();
  expect(screen.queryByText(/案件獲得の相談/)).not.toBeInTheDocument();
});

it("Feature02直下にIgnAIteの3ヶ月支援プログラム概要を表示する", () => {
  const { container } = render(<FeatureSection />);
  const programSection = container.querySelector("[data-support-program-overview]");

  expect(programSection).not.toBeNull();
  expect(
    within(programSection as HTMLElement).getByRole("heading", {
      level: 3,
      name: "IgnAIteの支援プログラムの概要",
    }),
  ).toBeVisible();
  expect(
    within(programSection as HTMLElement).getByText(
      "3ヶ月にわたる支援プログラムとなっています",
    ),
  ).toBeVisible();

  [
    ["1ヶ月目", "コーチング", /あなたが本当にやりたいこと、叶えたい人生を明らかにして/],
    ["2ヶ月目", "AI基礎教育", /溢れているAI最新情報に振り回される心配がありません。/],
    ["3ヶ月目", "AI活用コンサル", /AIコンサルタントが伴走するので初心者も心配いりません。/],
  ].forEach(([month, title, bodyPattern]) => {
    const card = within(programSection as HTMLElement)
      .getByText(month as string)
      .closest("[data-support-program-card]");

    expect(card).not.toBeNull();
    expect(within(card as HTMLElement).getByText(title as string)).toBeVisible();
    expect(within(card as HTMLElement).getByText(bodyPattern as RegExp)).toBeVisible();
  });

  expect(ruleFor(".supportProgramCards")).toContain("grid-template-columns: repeat(3,1fr)");
  expect(stylesheet).toContain(".supportProgramCards { grid-template-columns: 1fr; }");
});

it("支援プログラムカードは3枚とも同じ淡色デザインにする", () => {
  render(<FeatureSection />);

  expect(ruleFor(".supportProgramCards article")).toContain("background: #FFFFFF");
  expect(ruleFor(".supportProgramCards article > span")).toContain("background: var(--color-red)");
  expect(stylesheet).not.toContain(".supportProgramCards article:nth-child(2)");
});
