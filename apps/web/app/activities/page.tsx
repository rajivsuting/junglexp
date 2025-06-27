import { ActivitiesHero } from '@/components/activities-hero';
import { AdventureActivities } from '@/components/adventure-activities';
import { CustomerDetailsForm } from '@/components/customer-details-form';
import { Footer } from '@/components/footer';
import { SafariSection } from '@/components/safari-section';
import { WaterSports } from '@/components/water-sports';
import { WellnessActivities } from '@/components/wellness-activities';

export default function ActivitiesPage() {
  return (
    <div className="min-h-screen bg-background">
      <ActivitiesHero />
      <SafariSection />
      <AdventureActivities />
      <WaterSports />
      <WellnessActivities />
      <CustomerDetailsForm />
      <Footer />
    </div>
  );
}
