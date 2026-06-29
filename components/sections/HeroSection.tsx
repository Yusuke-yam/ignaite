import { SectionFrame } from "@/components/sections/SectionFrame";
import { ASSETS } from "@/lib/assets";
import styles from "@/app/page.module.css";

const HERO_BADGES = ["キャリアチェンジ", "キャリアアップ", "副業", "個人事業", "起業"] as const;

export function HeroSection() {
  return (
    <SectionFrame id="hero" className={styles.hero}>
      <div className={styles.heroBackdrop} aria-hidden="true" />
      <div className={styles.heroText}>
        <div className={styles.heroBadges}>
          {HERO_BADGES.map((badge) => <span key={badge}><i>{badge}</i></span>)}
        </div>
        <h1>
          <span className={styles.heroTitleLine}>
            <span className={styles.heroGold} data-hero-gold="true">コーチング</span>
            で人生ビジョンを描き、
          </span>
          <span className={styles.heroTitleLine}>
            <span className={styles.heroGold} data-hero-gold="true">AI</span>
            でビジョンを現実にしていく。
          </span>
        </h1>
        <p className={styles.heroLead}>
          <span className={styles.heroLeadEmph}>認知科学コーチングとAI活用支援の2段階支援<span className={styles.heroLeadDe}>で</span></span><br className={styles.heroLeadBreak} />
          あなたの理想のキャリアビジョンを明確にし、<br />
          それを現実にしていく実践型伴走プログラム。
        </p>
      </div>
      <div className={styles.heroVisual}>
        <video
          aria-label="IgnAIteの紹介ムービー"
          autoPlay
          className={styles.heroMovie}
          data-testid="hero-movie"
          loop
          muted
          playsInline
          src={`/${ASSETS.heroMovie}`}
        />
      </div>
    </SectionFrame>
  );
}
