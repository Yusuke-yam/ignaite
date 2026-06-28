import { SectionFrame } from "@/components/sections/SectionFrame";
import { Marquee } from "@/components/ui/Marquee";
import { SafeImage } from "@/components/ui/SafeImage";
import { ASSETS } from "@/lib/assets";
import styles from "@/app/page.module.css";

const CUSTOMER_CASE_IMAGE_SIZE = {
  width: 360,
  height: 210,
} as const;

function CustomerCaseCards() {
  return (
    <>
      {ASSETS.customerCases.map((src, index) => (
        <article
          className={styles.customerCaseCard}
          data-customer-case-card="true"
          key={src}
        >
          <SafeImage
            src={src}
            alt={`顧客事例 ${index + 1}`}
            width={CUSTOMER_CASE_IMAGE_SIZE.width}
            height={CUSTOMER_CASE_IMAGE_SIZE.height}
            loading="eager"
          />
        </article>
      ))}
    </>
  );
}

export function ReviewsSection() {
  return (
    <SectionFrame id="reviews" className={styles.reviews}>
      <div className={styles.reviewsHeading}><h2 className={styles.uline}>IgnAIteを受講したお客様の声</h2></div>
      <Marquee className={styles.reviewMarquee} trackClassName={styles.marqueeTrack}><CustomerCaseCards /></Marquee>
      <Marquee className={styles.reviewMarquee} trackClassName={styles.marqueeTrack} reverse><CustomerCaseCards /></Marquee>
    </SectionFrame>
  );
}
