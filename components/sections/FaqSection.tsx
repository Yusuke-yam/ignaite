import { SectionFrame } from "@/components/sections/SectionFrame";
import { FaqAccordion } from "@/components/ui/FaqAccordion";
import { FAQ_ITEMS } from "@/content/lp-content";
import styles from "@/app/page.module.css";

export function FaqSection() {
  return (
    <SectionFrame id="faq" className={styles.faq}>
      <div className={styles.sectionHeading}><p>FAQ</p><h2>よくある質問</h2></div>
      <FaqAccordion items={FAQ_ITEMS} initialOpenIndex={0} className={styles.faqList} />
    </SectionFrame>
  );
}
