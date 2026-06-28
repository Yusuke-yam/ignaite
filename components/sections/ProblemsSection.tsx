import { Fragment } from "react";
import { SectionFrame } from "@/components/sections/SectionFrame";
import { SafeImage } from "@/components/ui/SafeImage";
import { ASSETS } from "@/lib/assets";
import styles from "@/app/page.module.css";

const PROBLEM_COLUMNS = [
  [
    "毎日同じ日々が繰り返されつまらない",
    "自分が今後何をしたいのか分からない",
    "生き方の正解や成功方法を、\n他人・SNS・本に探してしまう",
    "AIをどう活用すればいいかよく分かっていない。",
  ],
  [
    "「いつか何かできたらいいな」と思いながら、何も変わっていない",
    "自己啓発本は好きでよく読むが、現実は何も変わっていない",
    "副業や個人事業に憧れるが、「どうせ自分には無理」と思い込んでいる",
  ],
] as const;

function ProblemList({
  problems,
  side,
}: {
  problems: readonly string[];
  side: "left" | "right";
}) {
  const sideClass =
    side === "left" ? styles.problemBubblesLeft : styles.problemBubblesRight;

  return (
    <ul
      className={`${styles.problemBubbles} ${sideClass}`}
      data-problem-side={side}
    >
      {problems.map((problem) => (
        <li key={problem} className={styles.problemBubble}>
          {problem.split("\n").map((line, index) => (
            <Fragment key={index}>
              {index > 0 && <br />}
              {line}
            </Fragment>
          ))}
        </li>
      ))}
    </ul>
  );
}

function DotArrow() {
  // 赤いドットで構成した下向きシェブロン（参考デザインの矢印を再現）
  const dots: { cx: number; cy: number }[] = [];
  const n = 6;
  const dx = 13;
  const dy = 11;
  const rows = 3;
  const rowGap = 11;
  const center = 75;
  const x0 = 10;
  const y0 = 8;
  for (let r = 0; r < rows; r += 1) {
    for (let i = 0; i < n; i += 1) {
      const cy = y0 + i * dy + r * rowGap;
      const cxLeft = x0 + i * dx;
      dots.push({ cx: cxLeft, cy });
      dots.push({ cx: 2 * center - cxLeft, cy });
    }
  }
  return (
    <svg
      className={styles.problemArrow}
      viewBox="0 0 150 100"
      role="img"
      aria-label="下へ"
      focusable="false"
    >
      {dots.map((dot, index) => (
        <circle key={index} cx={dot.cx} cy={dot.cy} r={3.4} fill="#EE4338" />
      ))}
    </svg>
  );
}

export function ProblemsSection() {
  return (
    <SectionFrame id="problems" className={styles.problems}>
      <h2 className={`${styles.problemHeading} ${styles.uline}`}>こんなお悩みありませんか？</h2>
      <div className={styles.problemStage} data-problem-stage="true">
        <div className={styles.problemPerson} data-problem-person="true">
          <SafeImage
            src={ASSETS.problemOnayami}
            alt="悩みを抱える人"
            width={1254}
            height={1254}
          />
        </div>
        <ProblemList problems={PROBLEM_COLUMNS[0]} side="left" />
        <ProblemList problems={PROBLEM_COLUMNS[1]} side="right" />
      </div>
      <div className={styles.problemConclusion}>
        <DotArrow />
        <p className={styles.problemConclusionText}>
          自分の理想のキャリアビジョンを明確にして、<br />
          AIを活用してビジョンを実現していく実践型プログラム。<br />
          コーチング×AI活用支援で、新しい自分に出会えます。
        </p>
      </div>
    </SectionFrame>
  );
}
