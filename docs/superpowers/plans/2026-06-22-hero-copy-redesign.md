# Hero Copy Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** セクション1の見出しと説明文を、コーチングとAIの二段階支援を伝えるコピーへ変更する。

**Architecture:** `HeroSection.tsx`の`h1`内部を行単位とゴールド強調単位へ分割し、既存の`page.module.css`で専用クラスを定義する。Heroの画像、バッジ、実績値、外接高は変更せず、新規テストで文言・強調・サイズ・旧装飾削除を拘束する。

**Tech Stack:** Next.js 15、React 19、TypeScript、CSS Modules、Vitest、Testing Library、アプリ内ブラウザ

## Global Constraints

- 見出しは「コーチングで人生のビジョンを描き、」「AIでビジョンを現実にしていく」の2行をPC・スマホとも明示改行する。
- 「コーチング」と「AI」のみ既存ゴールド`#dca13a`（`var(--color-gold)`）で表示する。
- その他の見出し文字は`#222`とし、旧赤文字と黄色下線を削除する。
- Desktop見出しは38px前後、Mobileは20pxを基準にして横へはみ出させない。
- 説明文は指定の3行を明示改行し、18px、左揃え、行高1.7とする。
- 狭い画面の説明文は18pxを維持し、指定行内の自然改行を許可する。
- バッジ、実績値、人物画像、背景、HUD、Hero外接高、円形CTAは変更しない。
- `.git`は読み取り専用のためコミット工程は実行しない。`git push`も実行しない。
- 禁止ファイル、認証情報、外部通信へアクセスしない。

---

### Task 1: Hero見出し・説明文の更新

**Files:**
- Modify: `components/sections/HeroSection.tsx`
- Modify: `app/page.module.css`
- Create: `tests/hero-copy-redesign.test.tsx`

**Interfaces:**
- Consumes: `HeroSection()`、`styles.heroTitleLine`、`styles.heroGold`、`styles.heroLead`。
- Produces: 2行見出し、2箇所のゴールド強調、3行説明文。Heroの他要素は従来どおり。

- [ ] **Step 1: 新文言とCSS契約の失敗テストを書く**

```tsx
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

it("HeroをコーチングとAIの2行見出しへ変更する", () => {
  const { container } = render(<HeroSection />);
  const heading = screen.getByRole("heading", { level: 1 });
  const goldWords = container.querySelectorAll('[data-hero-gold="true"]');

  expect(heading).toHaveTextContent(
    "コーチングで人生のビジョンを描き、AIでビジョンを現実にしていく",
  );
  expect(goldWords).toHaveLength(2);
  expect(goldWords[0]).toHaveTextContent("コーチング");
  expect(goldWords[1]).toHaveTextContent("AI");
  expect(screen.queryByText(/未経験から最短で/)).not.toBeInTheDocument();
  expect(screen.queryByText(/AI活用のプロになる/)).not.toBeInTheDocument();
});

it("Hero説明文を18pxの3行コピーへ変更する", () => {
  render(<HeroSection />);

  expect(
    screen.getByText(/認知科学コーチングとAI活用支援の2段階支援で/),
  ).toHaveTextContent(
    "認知科学コーチングとAI活用支援の2段階支援であなたが叶えたい理想のキャリアを発見し、それを現実にしていくサポートを行います",
  );
  expect(screen.queryByText(/生成AIをあなたの武器に変える/)).not.toBeInTheDocument();
  expect(ruleFor(".heroLead")).toContain("font-size: 18px");
  expect(ruleFor(".heroLead")).toContain("text-align: left");
  expect(ruleFor(".heroLead")).toContain("line-height: 1.7");
});

it("見出しのゴールド強調とレスポンシブサイズを保持する", () => {
  expect(ruleFor(".hero h1")).toContain("font-size: clamp(20px, 3vw, 38px)");
  expect(ruleFor(".heroTitleLine")).toContain("white-space: nowrap");
  expect(ruleFor(".heroGold")).toContain("color: var(--color-gold)");
  expect(stylesheet).not.toContain(".hero h1 strong::after");
  expect(stylesheet).toMatch(
    /@media \(max-width: 809\.98px\)[\s\S]*?\.hero h1 \{[^}]*font-size: 20px[^}]*letter-spacing: -0\.02em/,
  );
});
```

- [ ] **Step 2: 対象テストが旧文言のため失敗することを確認する**

Run: `npm test -- --run tests/hero-copy-redesign.test.tsx`

Expected: FAIL。新見出し、新説明文、`.heroGold`、`.heroTitleLine`がまだ存在しない。

- [ ] **Step 3: Heroのマークアップを最小変更する**

```tsx
<h1>
  <span className={styles.heroTitleLine}>
    <span className={styles.heroGold} data-hero-gold="true">コーチング</span>
    で人生のビジョンを描き、
  </span>
  <span className={styles.heroTitleLine}>
    <span className={styles.heroGold} data-hero-gold="true">AI</span>
    でビジョンを現実にしていく
  </span>
</h1>
<p className={styles.heroLead}>
  認知科学コーチングとAI活用支援の2段階支援で<br />
  あなたが叶えたい理想のキャリアを発見し、<br />
  それを現実にしていくサポートを行います
</p>
```

- [ ] **Step 4: Hero専用CSSを置換する**

```css
.hero h1 {
  color: var(--color-ink);
  font-family: "Zen Kaku Gothic New", "Noto Sans JP", sans-serif;
  font-size: clamp(20px, 3vw, 38px);
  font-weight: 700;
  letter-spacing: 0.02em;
  line-height: 1.35;
  margin: 0;
  position: relative;
}

.heroTitleLine {
  display: block;
  white-space: nowrap;
}

.heroGold {
  color: var(--color-gold);
}

.heroLead {
  font-size: 18px;
  line-height: 1.7;
  margin: 30px 0 45px;
  max-width: 100%;
  text-align: left;
  width: 600px;
}
```

旧`.hero h1 span`、`.hero h1 strong`、`.hero h1 strong::after`規則を削除する。

Mobile規則の既存`.hero h1`を次へ置換する。

```css
.hero h1 {
  font-size: 20px;
  letter-spacing: -0.02em;
  line-height: 1.35;
}
```

Mobileの`.heroLead`は18pxを維持し、既存の中央揃えを上書きする。

```css
.heroLead {
  font-size: 18px;
  margin: 22px auto 20px;
  max-width: 540px;
  text-align: left;
  width: auto;
}
```

- [ ] **Step 5: 対象テストと全テストを通す**

Run: `npm test -- --run tests/hero-copy-redesign.test.tsx`

Expected: 3 tests PASS。

Run: `npm test`

Expected: 全テストPASS。既存Heroテストの旧文言期待があれば、新見出しへ最小更新する。

- [ ] **Step 6: 型検査とセキュリティを確認する**

Run: `npx tsc --noEmit`

Expected: exit 0。

Run: `rg -n -e 'https?://' -e 'gtag' app components content lib`

Expected: 外部URL・解析コードの追加なし。

- [ ] **Step 7: 開発サーバー停止後に本番ビルドする**

起動中の開発サーバーと`next build`は`.next`を共有するため、コントローラが開発サーバーを停止してから実行する。

Run: `npm run build`

Expected: production build PASS。

- [ ] **Step 8: 開発サーバーを再起動しブラウザで確認する**

1. `http://127.0.0.1:3100/`をリロードする。
2. Desktopで2行見出し、ゴールド2箇所、18pxの3行説明文を確認する。
3. 390pxで見出しが横にはみ出さず、説明文が人物画像や実績値と重ならないことを確認する。
4. バッジ、実績値、人物画像、背景、円形CTAが維持されていることを確認する。
