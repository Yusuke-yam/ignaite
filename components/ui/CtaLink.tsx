import type { ReactNode } from "react";

// 無料相談会の予約先（Googleカレンダー予約ページ）
export const CONSULTATION_URL = "https://calendar.app.google/3r6bj9TRcbnY3tQE9";

type CtaLinkProps = {
  children: ReactNode;
  className?: string;
  // ボタン由来の aria-label を引き継げるようにする
  "aria-label"?: string;
};

export function CtaLink({
  children,
  className = "",
  "aria-label": ariaLabel,
}: CtaLinkProps) {
  return (
    <a
      href={CONSULTATION_URL}
      // 別タブで予約ページを開き、LPを離脱させない
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      aria-label={ariaLabel}
    >
      {children}
    </a>
  );
}
