import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AboutSection } from "@/components/sections/AboutSection";
import { BriefingCta } from "@/components/sections/BriefingCta";
import { CampaignSection } from "@/components/sections/CampaignSection";
import { FeatureSection } from "@/components/sections/FeatureSection";
import { ProgramOverviewSection } from "@/components/sections/ProgramOverviewSection";
import { FinalCtaSection } from "@/components/sections/FinalCtaSection";
import { FlowSection } from "@/components/sections/FlowSection";
import { HeroSection } from "@/components/sections/HeroSection";
import { ProblemsSection } from "@/components/sections/ProblemsSection";
import { ReviewsSection } from "@/components/sections/ReviewsSection";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export default function HomePage() {
  return (
    <>
      <Header />
      <main id="main-content">
        <HeroSection />
        <CampaignSection />
        <ProblemsSection />
        <AboutSection />
        <ReviewsSection />
        <BriefingCta />
        <FeatureSection />
        <ProgramOverviewSection />
        <FlowSection />
        <FinalCtaSection />
      </main>
      <Footer />
      <ScrollReveal />
    </>
  );
}
