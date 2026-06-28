import { SectionFrame } from "@/components/sections/SectionFrame";
import { SafeImage } from "@/components/ui/SafeImage";
import { ASSETS } from "@/lib/assets";
import styles from "@/app/page.module.css";

const STEPS = [
  ["オンライン無料相談会", "オンラインで無料相談会に参加"],
  ["受講お申し込み", <>お申込み後、担当コーチと<br />受講開始日の調整をしていきます。<br />(事前ワークもあります)</>],
  ["受講開始", <>担当コーチが、<br />マンツーマンであなたを支援していきます。</>],
] as const;

export function FlowSection() {
  return (
    <SectionFrame id="flow" className={styles.flow}>
      <div className={styles.sectionHeading}><h2 className={styles.uline}>受講スタートまでの<strong>3ステップ</strong></h2></div>
      <div className={styles.flowGrid}>{STEPS.map(([title, text], index) => <article key={title}><div className={styles.flowArt}><SafeImage src={ASSETS.flowIllustrations[index]} alt="" width={596} height={386} loading="eager" /></div><small>STEP {String(index + 1).padStart(2, "0")}</small><h3>{title}</h3><p>{text}</p></article>)}</div>
    </SectionFrame>
  );
}
