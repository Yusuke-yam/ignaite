# セクション2「お悩み」再設計 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** セクション2を、中央の人物へ左右3件ずつの吹き出しが向く6つの悩み提示へ変更し、スマホでは見出し・人物・吹き出し6件の1列にする。

**Architecture:** `ProblemsSection`を見出しと3列ステージに分け、ステージのDOM順を「人物・左列・右列」とする。DesktopはCSS Gridのarea指定で左列・人物・右列へ並べ替え、MobileはDOM順をそのまま縦積みにする。吹き出し先端はCSS疑似要素で生成し、Mobileでは非表示にする。

**Tech Stack:** Next.js 15、React、TypeScript、CSS Modules、Vitest、Testing Library

## Global Constraints

- 新見出しは「こんなお悩みありませんか？」。
- 悩みは承認済みの6件を指定順で表示する。
- Desktopは「左3件｜人物｜右3件」、Mobileは「見出し → 人物 → 吹き出し6件」。
- 人物素材 `ASSETS.problemIllustration` と上下位置の印象を維持し、水平方向を中央へ移動する。
- セクション上余白をDesktop 60px、Mobile 48pxとし、現状から約30%上へ寄せる。
- 左列の吹き出しは右向き、右列は左向き。Mobileでは先端を非表示にする。
- 旧導入、旧4件、旧結論コピー、`.problemConclusion`を削除する。
- セクション2以外の文言・配置・CTAを変更しない。
- 外部通信、解析コード、認証情報、追加依存関係を導入しない。
- `.git`は読み取り専用で有効なHEADがないため、Git add・commit・pushを行わない。

---

### Task 1: ProblemsSectionの文言・吹き出しレイアウト・レスポンシブ更新

**Files:**
- Create: `tests/problems-section-redesign.test.tsx`
- Modify: `components/sections/ProblemsSection.tsx`
- Modify: `app/page.module.css`
- Modify: `tests/similarity-fixes.test.tsx`

**Interfaces:**
- Consumes: `SectionFrame`、`SafeImage`、`ASSETS.problemIllustration`、`styles.problem*`。
- Produces: `ProblemsSection()`、`data-problem-stage`、`data-problem-person`、`data-problem-side="left|right"`、6つのlistitem。

- [ ] **Step 1: 新文言・DOM順・CSS契約の失敗テストを書く**

`tests/problems-section-redesign.test.tsx`を次の内容で作成する。

```tsx
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { render, screen, within } from "@testing-library/react";
import { expect, it } from "vitest";

import { ProblemsSection } from "@/components/sections/ProblemsSection";

const NEW_PROBLEMS = [
  "毎日同じ日々が繰り返され人生がつまらない",
  "自分が今後何をしたいのか分からない",
  "生き方の正解や成功方法を、他人・SNS・本に探してしまう",
  "「いつか何かできたらいいな」と思いながら、何も変わっていない",
  "自己啓発本は好きでよく読むが、現実は何も変わっていない",
  "副業や個人事業に憧れるが、「どうせ自分には無理」と思い込んでいる",
] as const;

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

it("見出しと6つの悩みを指定順で表示し旧コピーを削除する", () => {
  render(<ProblemsSection />);

  expect(
    screen.getByRole("heading", { level: 2, name: "こんなお悩みありませんか？" }),
  ).toBeVisible();
  expect(screen.getAllByRole("listitem").map((item) => item.textContent)).toEqual(
    NEW_PROBLEMS,
  );
  expect(screen.queryByText(/AIに興味はあるけど/)).not.toBeInTheDocument();
  expect(screen.queryByText(/ChatGPT触っただけで/)).not.toBeInTheDocument();
  expect(screen.queryByText(/収入に直結するスキル/)).not.toBeInTheDocument();
  expect(screen.queryByText(/生成AIが、あなたの武器/)).not.toBeInTheDocument();
});

it("人物をDOM上で先に置き左右3件ずつの意味的グループを持つ", () => {
  const { container } = render(<ProblemsSection />);
  const stage = container.querySelector('[data-problem-stage="true"]');
  const person = container.querySelector('[data-problem-person="true"]');
  const left = container.querySelector('[data-problem-side="left"]');
  const right = container.querySelector('[data-problem-side="right"]');

  expect(stage).not.toBeNull();
  expect(person).not.toBeNull();
  expect(stage?.firstElementChild).toBe(person);
  expect(within(left as HTMLElement).getAllByRole("listitem")).toHaveLength(3);
  expect(within(right as HTMLElement).getAllByRole("listitem")).toHaveLength(3);
  expect(screen.getByRole("img", { name: "悩みを抱える人" })).toBeVisible();
});

it("Desktopの中央人物・左右吹き出しと約30%上寄せをCSSで定義する", () => {
  expect(ruleFor(".problems")).toContain("padding: 60px 24px 96px");
  expect(ruleFor(".problemHeading")).toContain("text-align: center");
  expect(ruleFor(".problemStage")).toContain('grid-template-areas: "left person right"');
  expect(ruleFor(".problemPerson")).toContain("grid-area: person");
  expect(ruleFor(".problemBubblesLeft")).toContain("grid-area: left");
  expect(ruleFor(".problemBubblesRight")).toContain("grid-area: right");
  expect(stylesheet).toContain(".problemBubblesLeft .problemBubble::before");
  expect(stylesheet).toContain(".problemBubblesRight .problemBubble::before");
  expect(stylesheet).not.toContain(".problemConclusion");
});

it("Mobileを人物先頭の1列にし吹き出し先端を非表示にする", () => {
  expect(stylesheet).toMatch(
    /@media \(max-width: 809\.98px\)[\s\S]*?\.problems \{[^}]*padding: 48px 16px 82px/,
  );
  expect(stylesheet).toMatch(
    /@media \(max-width: 809\.98px\)[\s\S]*?\.problemStage \{[^}]*display: flex;[^}]*flex-direction: column/,
  );
  expect(stylesheet).toMatch(
    /@media \(max-width: 809\.98px\)[\s\S]*?\.problemPerson \{[^}]*margin: 0 auto/,
  );
  expect(stylesheet).toMatch(
    /@media \(max-width: 809\.98px\)[\s\S]*?\.problemBubble::before[^}]*display: none/,
  );
});
```

- [ ] **Step 2: 対象テストが旧実装のため失敗することを確認する**

Run: `npm test -- --run tests/problems-section-redesign.test.tsx`

Expected: FAIL。新見出し、6件のlistitem、`data-problem-*`、新CSSセレクタが未実装のため失敗する。

- [ ] **Step 3: ProblemsSectionを新しい意味構造へ最小変更する**

`components/sections/ProblemsSection.tsx`を次の構造へ変更する。

```tsx
import { SectionFrame } from "@/components/sections/SectionFrame";
import { SafeImage } from "@/components/ui/SafeImage";
import { ASSETS } from "@/lib/assets";
import styles from "@/app/page.module.css";

const PROBLEM_COLUMNS = [
  [
    "毎日同じ日々が繰り返され人生がつまらない",
    "自分が今後何をしたいのか分からない",
    "生き方の正解や成功方法を、他人・SNS・本に探してしまう",
  ],
  [
    "「いつか何かできたらいいな」と思いながら、何も変わっていない",
    "自己啓発本は好きでよく読むが、現実は何も変わっていない",
    "副業や個人事業に憧れるが、「どうせ自分には無理」と思い込んでいる",
  ],
] as const;

function ProblemList({
  problems,
  side,
}: {
  problems: readonly string[];
  side: "left" | "right";
}) {
  const sideClass =
    side === "left" ? styles.problemBubblesLeft : styles.problemBubblesRight;

  return (
    <ul
      className={`${styles.problemBubbles} ${sideClass}`}
      data-problem-side={side}
    >
      {problems.map((problem) => (
        <li key={problem} className={styles.problemBubble}>{problem}</li>
      ))}
    </ul>
  );
}

export function ProblemsSection() {
  return (
    <SectionFrame id="problems" className={styles.problems}>
      <h2 className={styles.problemHeading}>こんなお悩みありませんか？</h2>
      <div className={styles.problemStage} data-problem-stage="true">
        <div className={styles.problemPerson} data-problem-person="true">
          <SafeImage
            src={ASSETS.problemIllustration}
            alt="悩みを抱える人"
            width={512}
            height={381}
          />
        </div>
        <ProblemList problems={PROBLEM_COLUMNS[0]} side="left" />
        <ProblemList problems={PROBLEM_COLUMNS[1]} side="right" />
      </div>
    </SectionFrame>
  );
}
```

- [ ] **Step 4: DesktopとMobileのCSSを置換する**

`app/page.module.css`の既存`.problems`から`.problemConclusion span`までを削除し、次の規則へ置換する。

```css
.problems {
  background: #fff9f9;
  padding: 60px 24px 96px;
}

.problemHeading {
  font-size: 31px;
  letter-spacing: 0.05em;
  line-height: 1.3;
  margin: 0 auto 42px;
  text-align: center;
}

.problemStage {
  align-items: center;
  display: grid;
  gap: 32px;
  grid-template-areas: "left person right";
  grid-template-columns: minmax(0, 1fr) minmax(260px, 320px) minmax(0, 1fr);
  margin: 0 auto;
  max-width: 1120px;
}

.problemPerson {
  grid-area: person;
  margin: 0 auto;
  width: 100%;
}

.problemPerson :is(img, [data-safe-image]) {
  display: block;
  height: auto;
  margin: 0 auto;
  width: 100%;
}

.problemBubbles {
  display: grid;
  gap: 18px;
  list-style: none;
  margin: 0;
  padding: 0;
}

.problemBubblesLeft { grid-area: left; }
.problemBubblesRight { grid-area: right; }

.problemBubble {
  background: #fff;
  border: 1px solid #f3cfd4;
  border-radius: 14px;
  font-size: 14px;
  line-height: 1.65;
  margin: 0;
  min-height: 76px;
  padding: 14px 18px;
  position: relative;
}

.problemBubblesLeft .problemBubble::before,
.problemBubblesLeft .problemBubble::after,
.problemBubblesRight .problemBubble::before,
.problemBubblesRight .problemBubble::after {
  border: solid transparent;
  content: "";
  height: 0;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 0;
}

.problemBubblesLeft .problemBubble::before {
  border-left-color: #f3cfd4;
  border-width: 11px;
  right: -22px;
}

.problemBubblesLeft .problemBubble::after {
  border-left-color: #fff;
  border-width: 9px;
  right: -18px;
}

.problemBubblesRight .problemBubble::before {
  border-right-color: #f3cfd4;
  border-width: 11px;
  left: -22px;
}

.problemBubblesRight .problemBubble::after {
  border-right-color: #fff;
  border-width: 9px;
  left: -18px;
}
```

`@media (max-width: 809.98px)`内の旧Problem規則を削除し、次へ置換する。

```css
.problems { padding: 48px 16px 82px; }
.problemHeading { font-size: 24px; margin-bottom: 30px; }
.problemStage {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin: 0 auto;
  max-width: 520px;
}
.problemPerson { margin: 0 auto; max-width: 358px; order: 0; }
.problemBubbles { gap: 12px; width: 100%; }
.problemBubblesLeft { order: 1; }
.problemBubblesRight { order: 2; }
.problemBubble { min-height: 0; padding: 13px 16px; }
.problemBubble::before,
.problemBubble::after { display: none; }
```

`@media (max-width: 430px)`内の`.problemConclusion p`規則も削除する。

- [ ] **Step 5: 対象テストをGREENにする**

Run: `npm test -- --run tests/problems-section-redesign.test.tsx`

Expected: 4 tests PASS。

- [ ] **Step 6: 既存Mobile契約テストを新構造へ最小更新する**

`tests/similarity-fixes.test.tsx`の旧`.problemCopy`期待値を次へ置換する。

```tsx
expect(stylesheet).toMatch(
  /@media \(max-width: 809\.98px\)[\s\S]*?\.problemStage \{[^}]*max-width: 520px/,
);
```

- [ ] **Step 7: 全テストと型検査を実行する**

Run: `npm test`

Expected: 既存53件と新規4件を含む57件すべてPASS。

Run: `npx tsc --noEmit`

Expected: exit 0、未使用import・型エラーなし。

- [ ] **Step 8: セキュリティ検索を実行する**

Run: `rg -n -e 'https?://' -e 'gtag' app components content lib`

Expected: exit 1、該当なし。外部URL・解析コードの追加なし。

Run: `rg -n -e 'API[_-]?KEY' -e 'PASSWORD\\s*=' -e 'SECRET\\s*=' app components content lib tests`

Expected: exit 1、該当なし。認証情報パターンの追加なし。

- [ ] **Step 9: 開発サーバー停止後に本番ビルドする**

起動中の開発サーバーと`next build`は`.next`を共有するため、開発サーバーを停止してから実行する。

Run: `npm run build`

Expected: production build PASS。

- [ ] **Step 10: 開発サーバーを再起動し実ブラウザで確認する**

1. `http://127.0.0.1:3100/`をリロードする。
2. Desktopで見出しが中央かつ従来より約30%上、人物が中央、左右3件の吹き出し先端が人物方向であることを確認する。
3. 390pxで「見出し → 人物 → 吹き出し6件」の順序を確認する。
4. Desktop/Mobileとも横スクロール、要素の重なり、吹き出し文字切れがないことを確認する。
5. セクション末尾の旧結論コピーが存在しないことを確認する。

- [ ] **Step 11: 作業記録を保存する**

`.superpowers/sdd/problems-section-task-1-report.md`へ、RED/GREEN、全テスト件数、型検査、ビルド、ブラウザ確認、セキュリティ確認を日本語で記録する。Git操作は行わない。
