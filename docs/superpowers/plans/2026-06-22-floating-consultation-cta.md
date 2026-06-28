# Floating Consultation CTA Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** LPの全スクロール位置で右下に常時表示される、上下二分割の円形「無料相談」CTAを追加する。

**Architecture:** `FloatingConsultationCta`を独立したUIコンポーネントとして作成し、専用CSS Moduleで固定位置と二分割デザインを管理する。`HomePage`の主要レイアウト外へ1回だけ配置し、既存方針どおり無効な`button`として表示する。

**Tech Stack:** Next.js 15、React 19、TypeScript、CSS Modules、Vitest、Testing Library、アプリ内ブラウザ

## Global Constraints

- Desktopは直径160px、右24px・下24px。
- 809.98px以下は直径118px、右12px・下12px。
- 上半分はブランド赤と白文字「無料相談」、下半分は白〜淡いピンクとブランド赤文字「予約はこちら→」。
- CTAは`disabled`かつ`aria-disabled="true"`で、リンク・フォーム・外部通信を生成しない。
- iPhone等の下部セーフエリアを考慮し、横スクロールを発生させない。
- `.git`は読み取り専用のためコミット工程は実行しない。`git push`も実行しない。
- 禁止ファイル、認証情報、外部通信へアクセスしない。

---

### Task 1: 右下固定の円形CTA

**Files:**
- Create: `components/ui/FloatingConsultationCta.tsx`
- Create: `components/ui/FloatingConsultationCta.module.css`
- Modify: `app/page.tsx`
- Create: `tests/floating-consultation-cta.test.tsx`

**Interfaces:**
- Consumes: React Server Componentとしての`HomePage`、既存のブランドカラー`#ff282d`。
- Produces: `FloatingConsultationCta(): JSX.Element`。ページ内に1個だけ存在する無効ボタン。

- [ ] **Step 1: DOMとCSS契約の失敗テストを書く**

```tsx
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { render, screen, within } from "@testing-library/react";
import { expect, it } from "vitest";

import HomePage from "@/app/page";

const stylesheet = readFileSync(
  resolve(process.cwd(), "components/ui/FloatingConsultationCta.module.css"),
  "utf8",
);

it("右下固定の円形無料相談CTAを1個だけ無効表示する", () => {
  render(<HomePage />);

  const cta = screen.getByTestId("floating-consultation-cta");
  expect(cta).toHaveRole("button", { name: "無料相談 予約はこちら" });
  expect(cta).toBeDisabled();
  expect(cta).toHaveAttribute("aria-disabled", "true");
  expect(within(cta).getByText("無料相談")).toBeVisible();
  expect(within(cta).getByText("予約はこちら")).toBeVisible();
  expect(screen.queryAllByTestId("floating-consultation-cta")).toHaveLength(1);
  expect(within(cta).queryByRole("link")).not.toBeInTheDocument();
});

it("DesktopとMobileで円形・固定位置・二分割配色を保持する", () => {
  expect(stylesheet).toMatch(/\.floatingCta \{[\s\S]*?position: fixed/);
  expect(stylesheet).toMatch(/\.floatingCta \{[\s\S]*?height: 160px/);
  expect(stylesheet).toMatch(/\.floatingCta \{[\s\S]*?width: 160px/);
  expect(stylesheet).toMatch(/\.floatingCta \{[\s\S]*?border-radius: 50%/);
  expect(stylesheet).toMatch(/\.top \{[\s\S]*?background: #ff282d/);
  expect(stylesheet).toMatch(/\.bottom \{[\s\S]*?background: #fffafa/);
  expect(stylesheet).toMatch(
    /@media \(max-width: 809\.98px\)[\s\S]*?\.floatingCta \{[^}]*height: 118px[^}]*right: 12px[^}]*width: 118px/,
  );
});
```

- [ ] **Step 2: テストが機能不足で失敗することを確認する**

Run: `npm test -- --run tests/floating-consultation-cta.test.tsx`

Expected: FAIL。コンポーネントとCSSファイルがまだ存在しないため、CTA契約を満たさない。

- [ ] **Step 3: 最小コンポーネントを作成する**

```tsx
import styles from "./FloatingConsultationCta.module.css";

export function FloatingConsultationCta() {
  return (
    <button
      type="button"
      disabled
      aria-disabled="true"
      aria-label="無料相談 予約はこちら"
      className={styles.floatingCta}
      data-testid="floating-consultation-cta"
    >
      <span className={styles.top}>無料相談</span>
      <span className={styles.bottom}>
        予約はこちら<span aria-hidden="true">→</span>
      </span>
    </button>
  );
}
```

- [ ] **Step 4: 固定位置と二分割デザインを実装する**

```css
.floatingCta {
  background: transparent;
  border: 3px solid #fff;
  border-radius: 50%;
  bottom: max(24px, calc(env(safe-area-inset-bottom) + 12px));
  box-shadow: 0 10px 30px rgba(61, 6, 8, 0.28);
  display: flex;
  flex-direction: column;
  height: 160px;
  overflow: hidden;
  padding: 0;
  position: fixed;
  right: 24px;
  width: 160px;
  z-index: 1000;
}

.top,
.bottom {
  align-items: center;
  display: flex;
  flex: 1;
  justify-content: center;
  width: 100%;
}

.top {
  background: #ff282d;
  color: #fff;
  font-size: 27px;
  font-weight: 800;
}

.bottom {
  background: #fffafa;
  color: #ff282d;
  font-size: 15px;
  font-weight: 800;
  gap: 3px;
}

@media (max-width: 809.98px) {
  .floatingCta {
    bottom: max(12px, calc(env(safe-area-inset-bottom) + 8px));
    height: 118px;
    right: 12px;
    width: 118px;
  }

  .top {
    font-size: 20px;
  }

  .bottom {
    font-size: 11px;
  }
}
```

- [ ] **Step 5: `HomePage`へ1回だけ配置する**

```tsx
import { FloatingConsultationCta } from "@/components/ui/FloatingConsultationCta";

export default function HomePage() {
  return (
    <>
      <Header />
      <main id="main-content">{/* 既存セクション */}</main>
      <Footer />
      <FloatingConsultationCta />
    </>
  );
}
```

- [ ] **Step 6: 対象テストと全テストを通す**

Run: `npm test -- --run tests/floating-consultation-cta.test.tsx`

Expected: 2 tests PASS。

Run: `npm test`

Expected: 全テストPASS。

- [ ] **Step 7: 型・本番ビルド・セキュリティを検証する**

Run: `npx tsc --noEmit`

Expected: exit 0。

Run: `npm run build`

Expected: production build PASS。

Run: `rg -n -e 'https?://' -e 'gtag' app components content lib`

Expected: 外部URL・解析コードの追加なし。

- [ ] **Step 8: アプリ内ブラウザで目視確認する**

1. `http://127.0.0.1:3100/`をリロードする。
2. Desktopで直径160px、右24px、右下固定を確認する。
3. 390px相当で直径118px、右12px、下部セーフエリアを確認する。
4. ページをスクロールし、CTAが同じビューポート位置へ残ることを確認する。
5. ボタンが無効で、クリックしても遷移・送信が発生しないことを確認する。
