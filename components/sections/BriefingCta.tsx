import { CtaLink } from "@/components/ui/CtaLink";
import styles from "@/app/page.module.css";

export function BriefingCta() {
  return (
    <div className={styles.finalCta} data-briefing-cta="true">
      <div className={styles.ctaContent}>
        <h2>まずは無料相談会に参加</h2>
        <p>あなたの人生を前進させるヒントや、<br />あなたのAI活用方法のヒントが得られる60分！</p>
        <div className={styles.ctaGrid}>
          <div><CtaLink className={styles.whiteCta}>今すぐ空き日程を確認する</CtaLink><small>30秒で簡単に予約できます。ご都合に合わせた日程をその場で選べるので、最短で当日参加も可能です。</small></div>
        </div>
      </div>
    </div>
  );
}
