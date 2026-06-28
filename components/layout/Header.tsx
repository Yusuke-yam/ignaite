"use client";

import { useEffect, useState } from "react";
import { CtaLink } from "@/components/ui/CtaLink";
import { SafeImage } from "@/components/ui/SafeImage";
import { ASSETS } from "@/lib/assets";
import styles from "@/app/page.module.css";

const NAV_ITEMS = [
  { href: "#about", label: "IgnAIteとは" },
  { href: "#feature", label: "特徴" },
  { href: "#reviews", label: "実績" },
  { href: "#feature-program-overview", label: "概要" },
  { href: "#flow", label: "流れ" },
] as const;

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  // ドロワー表示中は背面スクロールを止める
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header className={styles.header}>
        <a className={styles.headerLogo} href="#hero" aria-label="IgnAIte トップへ">
          <SafeImage
            src={ASSETS.serviceLogo}
            alt="IgnAIte"
            width={838}
            height={260}
          />
        </a>
        <nav className={styles.desktopNav} aria-label="主要ナビゲーション">
          {NAV_ITEMS.map((item) => (
            <a key={item.href} href={item.href}>{item.label}</a>
          ))}
        </nav>
        <CtaLink
          aria-label="無料相談会に参加する▶︎ 簡単30秒"
          className={styles.headerCta}
        >
          <span>無料相談会に参加する</span><i aria-hidden="true">▶︎</i><small>簡単30秒</small>
        </CtaLink>
        {/* モバイル：常時表示はロゴ＋このトグルのみ（押すとバー直下にメニュー展開） */}
        <button
          type="button"
          className={styles.menuIcon}
          aria-label={menuOpen ? "メニューを閉じる" : "メニューを開く"}
          aria-expanded={menuOpen}
          aria-controls="mobile-drawer"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? (
            <span className={styles.menuClose} aria-hidden="true">×</span>
          ) : (
            <>
              <i aria-hidden="true" />
              <i aria-hidden="true" />
              <i aria-hidden="true" />
            </>
          )}
        </button>
      </header>

      {/* モバイル用ドロップダウン（PCでは menuIcon 非表示のため開かれない） */}
      <div
        className={`${styles.navOverlay} ${menuOpen ? styles.navOverlayOpen : ""}`}
        onClick={closeMenu}
        aria-hidden="true"
      />
      <div
        id="mobile-drawer"
        className={`${styles.mobileDrawer} ${menuOpen ? styles.mobileDrawerOpen : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="メニュー"
        aria-hidden={!menuOpen}
      >
        <nav className={styles.drawerNav} aria-label="モバイルナビゲーション">
          {NAV_ITEMS.map((item) => (
            <a key={item.href} href={item.href} onClick={closeMenu}>
              {item.label}
            </a>
          ))}
        </nav>
        <CtaLink
          aria-label="無料相談会に参加する 簡単30秒"
          className={styles.drawerCta}
        >
          <small aria-hidden="true">簡単30秒</small>
          <span>無料相談会に参加する</span>
          <i aria-hidden="true">→</i>
        </CtaLink>
      </div>
    </>
  );
}
