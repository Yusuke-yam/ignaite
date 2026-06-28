"use client";

import { useEffect } from "react";

/**
 * 各セクション([data-lp-section])がビューポートに入ったら in-view を付与し、
 * 外れたら外す。これにより「スクロールで表示時にふわっと出現」し、
 * スクロールで戻った際にも再度アニメーションする。
 * 実際の見た目は globals.css の .reveal-enabled [data-lp-section] が担当。
 */
export function ScrollReveal() {
  useEffect(() => {
    const targets = Array.from(
      document.querySelectorAll<HTMLElement>("[data-lp-section]"),
    );
    if (targets.length === 0) return;

    // モーション抑制設定時、または非対応環境では即時表示してアニメーションしない
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced || !("IntersectionObserver" in window)) {
      targets.forEach((el) => el.classList.add("in-view"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          entry.target.classList.toggle("in-view", entry.isIntersecting);
        }
      },
      { threshold: 0.1 },
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return null;
}
