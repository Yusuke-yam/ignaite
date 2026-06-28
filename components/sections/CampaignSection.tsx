import { SectionFrame } from "@/components/sections/SectionFrame";
import { SafeImage } from "@/components/ui/SafeImage";
import { ASSETS } from "@/lib/assets";
import styles from "@/app/page.module.css";

export function CampaignSection() {
  return (
    <SectionFrame id="campaign" className={styles.campaign}>
      <div className={styles.mobileCampaignImages}>
        <SafeImage src={ASSETS.guaranteeBanner} alt="全額返金保証" width={1140} height={340} />
        <SafeImage src={ASSETS.campaignBanner} alt="受講料割引キャンペーン" width={1024} height={312} />
      </div>
    </SectionFrame>
  );
}
