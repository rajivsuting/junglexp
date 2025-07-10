import { AboutSection } from "@/components/about-section";
import { ActivitiesSection } from "@/components/activities-section";
import { CallToActionStaySection } from "@/components/call-to-action-stay-section";
import { FAQSection } from "@/components/faq-section";
import { FeatureStepsSection } from "@/components/feature-steps-section";
import { FeaturedForestStays } from "@/components/featured-forest-stay";
import { FeaturedResorts } from "@/components/featured-resorts";
import { Footer } from "@/components/footer";
import { HeroSection } from "@/components/hero-section";
import { NaturalistSection } from "@/components/naturalist-section";
import { Navigation } from "@/components/navigation";
import { PackagesSection } from "@/components/packages-section";
import { SafariSection } from "@/components/safari-section";
import { SouvenirsSection } from "@/components/souvenirs-section";
import { WhyChooseUsSection } from "@/components/why-choose-us-section";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <HeroSection />
        <AboutSection />
        <FeaturedResorts />
        <FeaturedForestStays />
        {/* <FeatureStepsSection /> */}
        <CallToActionStaySection />
        <PackagesSection />
        <WhyChooseUsSection />
        <SafariSection />
        <NaturalistSection />
        <ActivitiesSection />

        <SouvenirsSection />
        <FAQSection />
      </main>
      <Footer />
    </div>
  );
}
