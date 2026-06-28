import styles from "./FloatingConsultationCta.module.css";

export function FloatingConsultationCta() {
  return (
    <button
      type="button"
      disabled
      aria-disabled="true"
      aria-label="無料相談 予約はこちら"
      className={styles.floatingCta}
      data-testid="floating-consultation-cta"
    >
      <span className={styles.top}>無料相談</span>
      <span className={styles.bottom}>
        予約はこちら<span aria-hidden="true">→</span>
      </span>
    </button>
  );
}
