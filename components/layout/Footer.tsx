import { CtaLink } from "@/components/ui/CtaLink";
import { SafeImage } from "@/components/ui/SafeImage";
import styles from "@/app/page.module.css";
import { ASSETS } from "@/lib/assets";

const FOOTER_NAV_ITEMS = [
  { href: "#about", label: "IgnAIteとは" },
  { href: "#feature", label: "特徴" },
  { href: "#reviews", label: "実績" },
  { href: "#feature-program-overview", label: "概要" },
  { href: "#flow", label: "流れ" },
] as const;

export function Footer() {
  return (
    <footer id="footer" data-lp-section className={styles.footer}>
      <div className={styles.footerMain}>
        <div className={styles.footerBrand}>
          <a className={styles.footerLogo} href="#hero" aria-label="IgnAIte トップへ">
            <SafeImage
              src={ASSETS.footerLogo}
              alt="IgnAIte"
              width={834}
              height={260}
            />
          </a>
        </div>
        <div className={styles.footerActions}>
          <nav className={styles.footerNav} aria-label="フッターナビゲーション">
            {FOOTER_NAV_ITEMS.map((item) => <a key={item.href} href={item.href}>{item.label}</a>)}
          </nav>
          <div className={styles.footerCta}>
            <small>簡単30秒!</small>
            <CtaLink className={styles.redCta}>無料相談会に参加する</CtaLink>
          </div>
        </div>
      </div>
    </footer>
  );
}
