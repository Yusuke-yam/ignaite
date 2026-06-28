import { SectionFrame } from "@/components/sections/SectionFrame";
import { SafeImage } from "@/components/ui/SafeImage";
import { ASSETS } from "@/lib/assets";
import styles from "@/app/page.module.css";

export function AboutSection() {
  return (
    <SectionFrame id="about" className={styles.about}>
      <div className={styles.sectionHeading}><h2 className={styles.uline}>IgnAIte(イグナイト)とは</h2></div>
      <div className={styles.aboutBody}>
        <div className={styles.aboutCopy}>
          <h3>
            <span className={styles.aboutGold} data-about-gold="true">認知科学コーチング</span>と<span className={styles.aboutGold} data-about-gold="true">AI活用支援</span>の2段階支援で<br />
            結果にこだわる実践型サービス
          </h3>
          <p className={styles.aboutQuestion}>なぜ「コーチングだけ」「AI活用支援だけ」ではないのか。</p>
          <div className={styles.aboutReason}>
            <b>コーチングだけの場合</b>
            <p className={styles.aboutReasonPc}><strong>自分のやりたいこと/人生の方向性は明確になったが<br />実現するためのスキルが伴わず現実は変わらないまま<br />終わってしまう可能性がある。</strong></p>
            <p className={styles.aboutReasonMb}><strong>キャリアビジョンは明確になったが、<br />スキルが伴わず現実は変わらないまま<br />終わってしまう可能性がある。</strong></p>
          </div>
          <div className={styles.aboutReason}>
            <b>AI活用支援だけの場合</b>
            <p className={styles.aboutReasonPc}><strong>各AIツールの使い方は学べても、「それを何に使うのか」が<br />決まっていないので、ただ学んだだけになり現実は変わらない。<br />またAI関連の情報量が多く、目的がないまま学ぶと<br />全部大事そうに見えてしまい、何から実践すべきか分からなくなる。</strong></p>
            <p className={styles.aboutReasonMb}><strong>各AIツールの使い方は学べても、「それを何に使うのか」が決まっていないので、ただ学んだだけになり現実は変わらない。<br />またAI関連の情報量が多く、目的がないまま学ぶと全部大事そうに見えてしまい、何から実践すべきか分からなくなる。</strong></p>
          </div>
          <p>だからIgnAIteは両方を支援します。</p>
          <p className={styles.aboutConclusion}>コーチング×AI活用支援で着実に現実を変えていきます。</p>
        </div>
        <div className={styles.aboutVisual}>
          <div className={styles.aboutVisualItem}>
            <div className={styles.aboutVisualLabel}><span>コーチング</span></div>
            <SafeImage src={ASSETS.aboutAiShien} alt="コーチング" width={1448} height={1086} />
          </div>
          <div className={styles.aboutVisualItem}>
            <div className={`${styles.aboutVisualLabel} ${styles.aboutVisualLabelRight}`}><span>AI活用支援</span></div>
            <SafeImage src={ASSETS.aboutAiKatsuyo} alt="AI活用支援" width={1448} height={1086} />
          </div>
        </div>
      </div>
    </SectionFrame>
  );
}
