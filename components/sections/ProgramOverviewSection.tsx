import styles from "@/app/page.module.css";

const SUPPORT_PROGRAMS = [
  {
    month: "1ヶ月目",
    title: "コーチング",
    body: "認知科学理論に基づいたコーチングにより、あなたが本当にやりたいこと、叶えたい人生を明らかにしてビジョン・ゴールとして設定していきます。",
  },
  {
    month: "2ヶ月目",
    title: "AI基礎教育",
    body: "あなたのビジョン・ゴールを現実にしていくために、必要最低限なAI知識を基礎からお伝えしていきます。必要なAI知識だけを初心者にも分かるようにお伝えするので、溢れているAI最新情報に振り回される心配がありません。",
  },
  {
    month: "3ヶ月目",
    title: "AI活用コンサル",
    body: "AI基礎知識を身につけた後は、ビジョン・ゴールの実現に向け実際にAIを活用していきます。ここもAIコンサルタントが伴走するので初心者も心配いりません。",
  },
] as const;

export function ProgramOverviewSection() {
  return (
    <section id="feature-program-overview" data-lp-section className={styles.programSection}>
      <div className={styles.supportProgramOverview} data-support-program-overview>
        <div className={styles.supportProgramHeading}>
          <h3 className={styles.uline}>IgnAIteの支援プログラムの概要</h3>
          <p>3ヶ月にわたる支援プログラムとなっています</p>
        </div>
        <div className={styles.supportProgramCards}>
          {SUPPORT_PROGRAMS.map((program) => (
            <article key={program.month} data-support-program-card>
              <span>{program.month}</span>
              <h4>{program.title}</h4>
              <p>{program.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
