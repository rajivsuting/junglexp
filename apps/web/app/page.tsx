import { ActivitiesSection } from '@/components/activities-section';
import { CallToActionStaySection } from '@/components/call-to-action-stay-section';
import { FAQSection } from '@/components/faq-section';
import { FeatureStepsSection } from '@/components/feature-steps-section';
import { FeaturedResorts } from '@/components/featured-resorts';
import { Footer } from '@/components/footer';
import { HeroSection } from '@/components/hero-section';
import { Navigation } from '@/components/navigation';
import { PackagesSection } from '@/components/packages-section';
import { SafariSection } from '@/components/safari-section';
import { WhyChooseUsSection } from '@/components/why-choose-us-section';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <HeroSection />
        <FeaturedResorts />
        <FeatureStepsSection />
        <CallToActionStaySection />
        <PackagesSection />
        <WhyChooseUsSection />
        <SafariSection />
        <ActivitiesSection />
        <FAQSection />
      </main>
      <Footer />
    </div>
  );
}
