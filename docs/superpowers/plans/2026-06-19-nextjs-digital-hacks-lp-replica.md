# デジハク生成AI LP 忠実再現 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 公開中のデジハク生成AI LPをNext.jsで再構築し、主要3ビューポートの全セクションで95%以上の視覚類似度を達成する。

**Architecture:** App Routerの単一ページを、独立したセクションコンポーネントとデータファイルから組み立てる。元LPの素材はローカルへ保存し、元素材を取得できずCSSでも再現困難なビジュアルだけをimage_genで生成する。実装後はブラウザで同一条件の比較画像を作成し、サブエージェントのセクション別採点を修正ループへ接続する。

**Tech Stack:** Next.js App Router、React、TypeScript、CSS Modules、Vitest、React Testing Library、Playwright、image_gen、Browser

## Global Constraints

- CTAは外部遷移、フォーム送信、LINE起動を一切行わない。
- 広告、解析、行動追跡、外部フォーム、Framer実行スクリプトは複製しない。
- 画像、動画、フォントは `public/assets` に保存し、実行時に外部通信しない。
- 1280px、768px、390pxの3幅を検証対象とする。
- `prefers-reduced-motion` では自動横スクロールと装飾アニメーションを停止する。
- `.env`、`.env.*`、`*.pem`、`*.key`、`~/.ssh`、`~/.aws`、`~/.gnupg` を読み取らない。
- `curl`、`wget`、`nc`、`rm -rf`、`git push` を実行しない。
- すべての機能実装は、失敗を確認したテストより後に行う。

---

## File Map

- `app/layout.tsx`: メタデータ、ローカルフォント、全体レイアウト。
- `app/page.tsx`: セクションの並び順のみ。
- `app/globals.css`: リセット、色、書体、共通幅、アニメーション抑制。
- `app/page.module.css`: ページ固有の背景、余白、レスポンシブ規則。
- `components/layout/Header.tsx`: 固定ヘッダーとページ内ナビゲーション。
- `components/layout/Footer.tsx`: フッター表示。
- `components/sections/*.tsx`: 13個のLPセクション。
- `components/ui/DisabledCta.tsx`: 無効化されたCTA。
- `components/ui/FaqAccordion.tsx`: アクセシブルなFAQ開閉。
- `components/ui/SafeImage.tsx`: 画像失敗時も寸法を維持する代替表示。
- `components/ui/Marquee.tsx`: 口コミ・講師の横スクロール。
- `content/lp-content.ts`: 文言、数値、料金、事例、FAQデータ。
- `lib/assets.ts`: 素材パスと代替表示情報。
- `public/assets/*`: 元LP素材と生成素材。
- `tests/page-structure.test.tsx`: セクション順序と主要文言。
- `tests/interactions.test.tsx`: CTA、FAQ、ナビゲーション。
- `tests/assets.test.ts`: 必須素材の存在確認。
- `e2e/visual.spec.ts`: 3ビューポートのセクション別画像取得。
- `playwright.config.ts`: ローカルサーバーと画像比較設定。

---

### Task 1: Next.jsとテスト基盤

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.ts`
- Create: `vitest.config.ts`
- Create: `tests/setup.ts`
- Create: `tests/app-shell.test.tsx`
- Create: `app/layout.tsx`
- Create: `app/page.tsx`
- Create: `app/globals.css`

**Interfaces:**
- Consumes: なし。
- Produces: `RootLayout({ children }: { children: React.ReactNode })` と既定エクスポート `HomePage()`。

- [ ] **Step 1: ツール設定だけを作成する**

```json
{
  "name": "ignai-te-lp",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test"
  },
  "dependencies": {
    "next": "^15.3.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@playwright/test": "^1.52.0",
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/react": "^16.3.0",
    "@types/node": "^22.15.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "jsdom": "^26.1.0",
    "typescript": "^5.8.0",
    "vite-tsconfig-paths": "^5.1.4",
    "vitest": "^3.1.0"
  }
}
```

`tsconfig.json` は `@/*` をリポジトリ直下へ解決し、`vitest.config.ts` は `jsdom` と `tests/setup.ts` を指定する。

- [ ] **Step 2: アプリシェルの失敗テストを書く**

```tsx
import { render, screen } from "@testing-library/react";
import HomePage from "@/app/page";

it("LPのメイン領域を表示する", () => {
  render(<HomePage />);
  expect(screen.getByRole("main")).toHaveAttribute("id", "main-content");
});
```

- [ ] **Step 3: 失敗を確認する**

Run: `npm install`、続けて `npm test -- tests/app-shell.test.tsx`

Expected: `Cannot find module '@/app/page'` でFAIL。

- [ ] **Step 4: 最小アプリシェルを実装する**

```tsx
// app/page.tsx
export default function HomePage() {
  return <main id="main-content" />;
}
```

```tsx
// app/layout.tsx
import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "デジハク生成AIスクール",
  description: "未経験からAI活用のプロを目指す実践型スクール",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <html lang="ja"><body>{children}</body></html>;
}
```

- [ ] **Step 5: テストを通す**

Run: `npm test -- tests/app-shell.test.tsx`

Expected: 1 test passed。

- [ ] **Step 6: ローカルコミットする**

```bash
git add package.json package-lock.json tsconfig.json next.config.ts vitest.config.ts tests app
git commit -m "chore: initialize Next.js test harness"
```

---

### Task 2: コンテンツモデルとセクション順序

**Files:**
- Create: `content/lp-content.ts`
- Create: `components/sections/SectionFrame.tsx`
- Create: `tests/page-structure.test.tsx`
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `HomePage()`。
- Produces: `SECTION_IDS`、`NAV_ITEMS`、`FAQ_ITEMS`、`SectionFrame({ id, children, className })`。

- [ ] **Step 1: 13セクションの順序テストを書く**

```tsx
import { render } from "@testing-library/react";
import HomePage from "@/app/page";

const expected = [
  "hero", "campaign", "problems", "about", "reviews", "feature",
  "stories", "curriculum", "price", "flow", "faq", "final-cta", "footer",
];

it("元LPと同じ主要セクション順で表示する", () => {
  const { container } = render(<HomePage />);
  const actual = Array.from(container.querySelectorAll("[data-lp-section]"))
    .map((node) => node.id);
  expect(actual).toEqual(expected);
});
```

- [ ] **Step 2: テストの失敗を確認する**

Run: `npm test -- tests/page-structure.test.tsx`

Expected: `expected [] to deeply equal [...]` でFAIL。

- [ ] **Step 3: 型付きコンテンツとセクション枠を実装する**

```ts
export const SECTION_IDS = [
  "hero", "campaign", "problems", "about", "reviews", "feature",
  "stories", "curriculum", "price", "flow", "faq", "final-cta", "footer",
] as const;

export type SectionId = (typeof SECTION_IDS)[number];

export const NAV_ITEMS = [
  { label: "デジハクとは", href: "#about" },
  { label: "特徴", href: "#feature" },
  { label: "料金", href: "#price" },
  { label: "流れ", href: "#flow" },
  { label: "FAQ", href: "#faq" },
] as const;

export const FAQ_ITEMS = [
  { question: "未経験でも受講できますか？", answer: "はい。未経験から実務で使える状態まで段階的に学べます。" },
  { question: "仕事をしながらでも学べますか？", answer: "オンライン教材と個別サポートを使い、自分のペースで進められます。" },
  { question: "受講に必要なものはありますか？", answer: "インターネット環境とパソコンをご用意ください。" },
  { question: "質問や相談はできますか？", answer: "チャットとオンライン面談で相談できます。" },
  { question: "卒業後も教材を見られますか？", answer: "卒業後も継続学習できる環境を利用できます。" },
] as const;
```

```tsx
import type { ReactNode } from "react";
import type { SectionId } from "@/content/lp-content";

export function SectionFrame({ id, children, className = "" }: {
  id: SectionId;
  children: ReactNode;
  className?: string;
}) {
  return <section id={id} data-lp-section className={className}>{children}</section>;
}
```

`app/page.tsx` では `SECTION_IDS.map((id) => <SectionFrame key={id} id={id} />)` を `main` 内に描画する。

- [ ] **Step 4: 順序テストを通す**

Run: `npm test -- tests/page-structure.test.tsx`

Expected: 1 test passed。

- [ ] **Step 5: ローカルコミットする**

```bash
git add content components/sections tests/page-structure.test.tsx app/page.tsx
git commit -m "feat: define LP content structure"
```

---

### Task 3: CTA無効化とFAQ

**Files:**
- Create: `components/ui/DisabledCta.tsx`
- Create: `components/ui/FaqAccordion.tsx`
- Create: `tests/interactions.test.tsx`

**Interfaces:**
- Produces: `DisabledCta({ children, className })`、`FaqAccordion({ items })`。

- [ ] **Step 1: CTAとFAQの失敗テストを書く**

```tsx
import { fireEvent, render, screen } from "@testing-library/react";
import { DisabledCta } from "@/components/ui/DisabledCta";
import { FaqAccordion } from "@/components/ui/FaqAccordion";

it("CTAをリンクにせず無効状態で表示する", () => {
  render(<DisabledCta>無料説明会に参加する</DisabledCta>);
  const cta = screen.getByRole("button", { name: "無料説明会に参加する" });
  expect(cta).toHaveAttribute("aria-disabled", "true");
  expect(cta).toBeDisabled();
  expect(screen.queryByRole("link")).not.toBeInTheDocument();
});

it("FAQのARIA状態と回答表示を同期する", () => {
  render(<FaqAccordion items={[{ question: "質問", answer: "回答" }]} />);
  const trigger = screen.getByRole("button", { name: "質問" });
  expect(trigger).toHaveAttribute("aria-expanded", "false");
  fireEvent.click(trigger);
  expect(trigger).toHaveAttribute("aria-expanded", "true");
  expect(screen.getByText("回答")).toBeVisible();
});
```

- [ ] **Step 2: 失敗を確認する**

Run: `npm test -- tests/interactions.test.tsx`

Expected: UIモジュール未作成でFAIL。

- [ ] **Step 3: 最小実装を追加する**

```tsx
import type { ReactNode } from "react";

export function DisabledCta({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <button type="button" disabled aria-disabled="true" className={className}>{children}</button>;
}
```

```tsx
"use client";
import { useId, useState } from "react";

type FaqItem = { question: string; answer: string };

export function FaqAccordion({ items }: { items: readonly FaqItem[] }) {
  const rootId = useId();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  return <div>{items.map((item, index) => {
    const open = openIndex === index;
    const panelId = `${rootId}-panel-${index}`;
    return <article key={item.question}>
      <button type="button" aria-expanded={open} aria-controls={panelId}
        onClick={() => setOpenIndex(open ? null : index)}>{item.question}</button>
      <div id={panelId} hidden={!open}>{item.answer}</div>
    </article>;
  })}</div>;
}
```

- [ ] **Step 4: テストを通す**

Run: `npm test -- tests/interactions.test.tsx`

Expected: 2 tests passed。

- [ ] **Step 5: ローカルコミットする**

```bash
git add components/ui tests/interactions.test.tsx
git commit -m "feat: add safe CTA and FAQ interactions"
```

---

### Task 4: 元LP素材のローカル化

**Files:**
- Create: `public/assets/images/*`
- Create: `public/assets/fonts/*`
- Create: `public/assets/video/*`
- Create: `lib/assets.ts`
- Create: `components/ui/SafeImage.tsx`
- Create: `tests/assets.test.ts`

**Interfaces:**
- Produces: `ASSETS.heroPerson`、`ASSETS.problemIllustration`、`ASSETS.campaignBanner`、`ASSETS.guaranteeBanner`、`ASSETS.storyPortraits`。

- [ ] **Step 1: 必須素材パスの失敗テストを書く**

```ts
import { existsSync } from "node:fs";
import { join } from "node:path";
import { fireEvent, render, screen } from "@testing-library/react";
import { SafeImage } from "@/components/ui/SafeImage";
import { ASSETS } from "@/lib/assets";

it.each(Object.values(ASSETS).flatMap((value) => Array.isArray(value) ? value : [value]))(
  "必須素材 %s がpublic配下に存在する",
  (assetPath) => expect(existsSync(join(process.cwd(), "public", assetPath))).toBe(true),
);
```

```tsx
it("画像失敗時に同じ表示枠の代替要素へ切り替える", () => {
  render(<SafeImage src="/assets/images/missing.png" alt="人物" width={640} height={480} />);
  fireEvent.error(screen.getByRole("img", { name: "人物" }));
  expect(screen.getByRole("img", { name: "人物を表示できません" })).toHaveStyle({ aspectRatio: "640 / 480" });
});
```

- [ ] **Step 2: 素材が未配置のため失敗することを確認する**

Run: `npm test -- tests/assets.test.ts`

Expected: 少なくとも1件の `expected false to be true` でFAIL。

- [ ] **Step 3: BrowserのpageAssetsで素材を取得する**

元LPをブラウザで最後まで読み込み、pageAssetsの `list()` で `framerusercontent.com`、`fonts.gstatic.com`、`framerstatic.com` の画像・フォント・動画だけを選ぶ。広告・解析ドメインを除外して `bundle()` し、出力を `public/assets` へコピーする。`curl` と `wget` は使用しない。

- [ ] **Step 4: 型付き素材マップを追加する**

```ts
export const ASSETS = {
  heroPerson: "assets/images/hero-person.png",
  heroBackground: "assets/images/hero-background.png",
  problemIllustration: "assets/images/problem-illustration.png",
  campaignBanner: "assets/images/campaign-banner.png",
  guaranteeBanner: "assets/images/guarantee-banner.png",
  storyPortraits: [
    "assets/images/story-01.jpg",
    "assets/images/story-02.jpg",
    "assets/images/story-03.jpg",
  ],
} as const;
```

```tsx
"use client";
import Image from "next/image";
import { useState } from "react";

export function SafeImage({ src, alt, width, height, className = "" }: {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return <span role="img" aria-label={`${alt}を表示できません`} className={className}
      style={{ display: "block", aspectRatio: `${width} / ${height}`, background: "#f4f1ef" }} />;
  }
  return <Image src={src} alt={alt} width={width} height={height} className={className}
    onError={() => setFailed(true)} />;
}
```

- [ ] **Step 5: 取得不能で再現困難な素材だけimage_genで生成する**

生成が必要な場合は、次の条件を基礎プロンプトにし、対象セクションの色・構図を追記する。

```text
日本の生成AIスクールLP向けの高品質な広告ビジュアル。明るい白背景、淡いコーラルレッドと温かいベージュ、清潔で信頼感のある写真表現。人物は自然な日本人の成人、ノートPCを使いながらAI活用を学んでいる。元のLPと同じアスペクト比と視線方向。ロゴ、文字、数字、透かしは入れない。Web用、高精細。
```

生成後は `public/assets/generated/<section>-visual.png` として保存し、`ASSETS` の対応プロパティだけを差し替える。

- [ ] **Step 6: 素材テストを通す**

Run: `npm test -- tests/assets.test.ts`

Expected: 全素材テストがPASS。

---

### Task 5: 全セクションの忠実な表示

**Files:**
- Create: `components/layout/Header.tsx`
- Create: `components/layout/Footer.tsx`
- Create: `components/sections/HeroSection.tsx`
- Create: `components/sections/CampaignSection.tsx`
- Create: `components/sections/ProblemsSection.tsx`
- Create: `components/sections/AboutSection.tsx`
- Create: `components/sections/ReviewsSection.tsx`
- Create: `components/sections/FeatureSection.tsx`
- Create: `components/sections/StoriesSection.tsx`
- Create: `components/sections/CurriculumSection.tsx`
- Create: `components/sections/PriceSection.tsx`
- Create: `components/sections/FlowSection.tsx`
- Create: `components/sections/FaqSection.tsx`
- Create: `components/sections/FinalCtaSection.tsx`
- Create: `components/ui/Marquee.tsx`
- Create: `app/page.module.css`
- Modify: `app/page.tsx`
- Modify: `app/globals.css`
- Modify: `tests/page-structure.test.tsx`

**Interfaces:**
- Consumes: `ASSETS`、`NAV_ITEMS`、`FAQ_ITEMS`、`DisabledCta`、`FaqAccordion`。
- Produces: 元LPと同じ順序・主要文言・画像・装飾を持つ完成ページ。

- [ ] **Step 1: 主要文言と部品の失敗テストを追加する**

```tsx
it("ファーストビューと料金と最終CTAを表示する", () => {
  render(<HomePage />);
  expect(screen.getByRole("heading", { level: 1, name: /未経験から最短で/ })).toBeVisible();
  expect(screen.getByText("AI活用のプロになる。")).toBeVisible();
  expect(screen.getByText("総受講生数")).toBeVisible();
  expect(screen.getByText("料金")).toBeVisible();
  expect(screen.getAllByRole("button", { name: /無料説明会/ }).length).toBeGreaterThan(0);
});
```

- [ ] **Step 2: 現在の空セクションで失敗することを確認する**

Run: `npm test -- tests/page-structure.test.tsx`

Expected: H1が見つからずFAIL。

- [ ] **Step 3: セクションコンポーネントを実装する**

各セクションは `SectionFrame` をルートにし、テキストをHTML、装飾をCSS、写真・複雑な合成だけを画像で表示する。`HomePage` の構成は次の形に固定する。

```tsx
export default function HomePage() {
  return <>
    <Header />
    <main id="main-content">
      <HeroSection /><CampaignSection /><ProblemsSection /><AboutSection />
      <ReviewsSection /><FeatureSection /><StoriesSection /><CurriculumSection />
      <PriceSection /><FlowSection /><FaqSection /><FinalCtaSection />
    </main>
    <Footer />
  </>;
}
```

`Footer` のルート要素は `<footer id="footer" data-lp-section>` とし、構造テストの13番目に含める。

共通CSS値は以下を起点にし、元LPのブラウザ計測値に合わせて各セクション固有値を上書きする。

```css
:root {
  --color-ink: #171717;
  --color-red: #ef3f3a;
  --color-red-dark: #d62d2d;
  --color-coral-soft: #fff3f0;
  --color-yellow: #ffe600;
  --color-gold: #dca13a;
  --content-width: 1000px;
  --wide-width: 1232px;
  --section-space: 120px;
}
html { scroll-behavior: smooth; }
body { margin: 0; color: var(--color-ink); background: #fff; font-family: "Noto Sans JP", sans-serif; }
*, *::before, *::after { box-sizing: border-box; }
@media (max-width: 767px) { :root { --section-space: 72px; } }
@media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: .01ms !important; animation-iteration-count: 1 !important; scroll-behavior: auto !important; } }
```

- [ ] **Step 4: 構造・機能テストを通す**

Run: `npm test`

Expected: 全テストPASS、未処理例外と警告なし。

---

### Task 6: 3ビューポートの視覚検証基盤

**Files:**
- Create: `playwright.config.ts`
- Create: `e2e/visual.spec.ts`
- Create: `artifacts/reference/.gitkeep`
- Create: `artifacts/current/.gitkeep`

**Interfaces:**
- Produces: `artifacts/current/{width}-{section}.png`。

- [ ] **Step 1: Playwright設定を追加する**

```ts
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  use: { baseURL: "http://127.0.0.1:3000", colorScheme: "light", reducedMotion: "reduce" },
  webServer: { command: "npm run dev", url: "http://127.0.0.1:3000", reuseExistingServer: true },
});
```

- [ ] **Step 2: セクション別撮影テストを書く**

```ts
import { expect, test } from "@playwright/test";

const widths = [1280, 768, 390] as const;
const sections = ["hero", "campaign", "problems", "about", "reviews", "feature", "stories", "curriculum", "price", "flow", "faq", "final-cta", "footer"] as const;

for (const width of widths) {
  test.describe(`${width}px`, () => {
    test.use({ viewport: { width, height: width === 390 ? 844 : 900 } });
    test("全セクションを撮影できる", async ({ page }) => {
      await page.goto("/");
      await page.evaluate(() => document.fonts.ready);
      for (const section of sections) {
        const locator = page.locator(`#${section}`);
        await expect(locator).toBeVisible();
        await locator.screenshot({ path: `artifacts/current/${width}-${section}.png`, animations: "disabled" });
      }
    });
  });
}
```

- [ ] **Step 3: 撮影を成功させる**

Run: `npm run test:e2e`

Expected: 3 tests passed、39枚の画像が生成される。

- [ ] **Step 4: 元LPも同条件で撮影する**

Browserで元LPを1280px、768px、390pxに切り替え、同一セクション境界で撮影し `artifacts/reference/{width}-{section}.png` に保存する。重い固定要素によるフルページ画像の反復を避けるため、必ずセクション単位で撮影する。

---

### Task 7: サブエージェントによる95%類似度検証と修正

**Files:**
- Create: `artifacts/similarity-report.md`
- Modify: 95点未満と報告された `components/sections/*.tsx`
- Modify: 95点未満と報告された `app/page.module.css`

**Interfaces:**
- Consumes: `artifacts/reference/*.png` と `artifacts/current/*.png`。
- Produces: セクション別スコア、差分、修正済みページ。

- [ ] **Step 1: 検証専用サブエージェントを起動する**

サブエージェントには実装編集を依頼せず、各幅・各セクションを次の形式で採点させる。

```markdown
| width | section | score | layout | color | typography | imagery | spacing | required fixes |
|---:|---|---:|---|---|---|---|---|---|
```

スコアは、レイアウト30点、色15点、タイポグラフィ15点、素材15点、余白15点、装飾・レスポンシブ10点の合計100点とする。

- [ ] **Step 2: 95点未満だけを修正する**

報告書の `required fixes` を1項目ずつ反映し、対象セクション以外へ影響を与えない。修正のたびに `npm test` を実行する。

- [ ] **Step 3: 対象画像を再撮影する**

Run: `npm run test:e2e`

Expected: 39枚を更新し、全E2EテストPASS。

- [ ] **Step 4: 再検証を依頼する**

全行が95点以上になるまでStep 1〜3を繰り返し、最終結果を `artifacts/similarity-report.md` に保存する。

---

### Task 8: 最終品質・セキュリティ確認

**Files:**
- Modify: `PROGRESS.md`

- [ ] **Step 1: 自動検証を実行する**

Run: `npm test`

Expected: 全テストPASS、エラー・警告なし。

Run: `npm run build`

Expected: Next.js production build成功。

Run: `npm run test:e2e`

Expected: 3 tests passed。

- [ ] **Step 2: 禁止要素を検索する**

Run: `rg -n 'https?://|gtag|googletagmanager|clarity|facebook\.net|lin\.ee|contact\.digital-hacks' app components content lib public --glob '!public/assets/**'`

Expected: 外部送信・解析・ホットリンクに該当する一致なし。

- [ ] **Step 3: 未使用コードを確認する**

Run: `npx tsc --noEmit`

Expected: TypeScriptエラーなし。

- [ ] **Step 4: 完了報告へ記録する**

`PROGRESS.md` にテスト、ビルド、3幅表示、最終類似度、セキュリティ確認の結果を追記する。`git push` は実行しない。
