import { SectionFrame } from "@/components/sections/SectionFrame";
import { SafeImage } from "@/components/ui/SafeImage";
import { ASSETS } from "@/lib/assets";
import styles from "@/app/page.module.css";

const SUPPORT_ITEMS = [
  { iconSrc: ASSETS.supportIconPeople, label: (<>認知科学コーチによる<br />1on1セッションでの伴走</>) },
  { iconSrc: ASSETS.supportIconPeople, label: (<>AIコンサルタントによる<br />1on1セッションでのAI活用支援</>) },
  { iconSrc: ASSETS.supportIconChat, label: "いつでもチャット相談可能" },
] as const;

export function FeatureSection() {
  return (
    <SectionFrame id="feature" className={styles.feature}>
      <div className={styles.sectionHeading}><h2 className={styles.uline}>IgnAIteが選ばれる理由</h2></div>
      <article id="feature01" data-feature-card="01" className={`${styles.featureCard} ${styles.featureCardPrimary}`}>
        <SafeImage className={styles.featureBackdrop} src={ASSETS.featureBackdrop} alt="" width={1672} height={941} />
        <div className={styles.featureNumber}><span>01</span><i /></div>
        <div className={styles.featureColumns}>
          <div className={styles.featureCopy}>
            <h3>認定率5.7%のプロ認知科学コーチ兼<br />現役AIコンサルタントが伴走するから結果がでる。</h3>
            <p>オンラインでの1on1セッションと、LINEによるチャットサポートにて<br />マンツーマンであなたの人生に伴走します。</p>
            <p>コーチングセッションであなたのキャリアビジョン/ゴールを明確にした後、<br />AI基礎教育からAI活用コンサルティングまで行い、<br /><span className={styles.goldText}>AIを活用してビジョンを現実に</span>していける設計になっています。</p>
            <p>キャリアアップ、キャリアチェンジ、副業スタート、個人事業拡大など<br /><span className={styles.goldText}>短期間で成果獲得を目指せます。</span></p>
          </div>
          <div className={styles.featureProfileFrame}>
            <SafeImage
              className={styles.featureProfilePhoto}
              src={ASSETS.profilePhoto}
              alt="プロフィール写真"
              width={1198}
              height={1328}
            />
            <p className={styles.featureProfileCaption}>
              山本宥佑 | 認知科学コーチ 兼 AIコンサルタント
            </p>
          </div>
        </div>
        <div className={styles.featureSupportPanel} data-feature-support-panel>
          <p>サポート体制</p>
          <div className={styles.featureSupportCards}>
            {SUPPORT_ITEMS.map((item, index) => (
              <div key={index}>
                <span className={styles.featureSupportIcon}>
                  <SafeImage src={item.iconSrc} alt="" width={1254} height={1254} />
                </span>
                <b>{item.label}</b>
              </div>
            ))}
          </div>
        </div>
      </article>
      <article id="feature02" data-feature-card="02" className={`${styles.featureCard} ${styles.featureCardSecondary}`}>
        <SafeImage className={styles.featureBackdrop} src={ASSETS.featureBackdrop} alt="" width={1672} height={941} />
        <div className={styles.featureNumber}><span>02</span><i /></div>
        <div className={styles.featureColumns}>
          <div className={styles.supportVisual}>
            <SafeImage
              className={styles.supportHyakunin}
              src={ASSETS.featureHyakunin}
              alt="一人一人カスタマイズされた支援プログラム"
              width={1448}
              height={1086}
            />
          </div>
          <div className={styles.featureCopy}>
            <h3 className={styles.uline}>一人一人カスタマイズされた<br />プログラムを提供</h3>
            <p>コーチングによって発見される<br />「キャリアのビジョン/ゴール」は百人百様です。</p>
            <p>それを現実にしていくためのAI活用支援も、<br />一人一人カスタマイズし、あなただけの支援プログラムで伴走します。</p>
          </div>
        </div>
      </article>
    </SectionFrame>
  );
}
