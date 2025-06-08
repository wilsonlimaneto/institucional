
import Header from '@/components/landing/Header';
import HeroSection from '@/components/landing/HeroSection';
import ReasonsToChooseUsSection from '@/components/landing/ReasonsToChooseUsSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import TestimonialsSection from '@/components/landing/TestimonialsSection';
import GoogleCloudSuccessSection from '@/components/landing/GoogleCloudSuccessSection';
import MaestriaFlixSection from '@/components/landing/MaestriaFlixSection';
import BlogReferralSection from '@/components/landing/BlogReferralSection';
import EbookDownloadForm from '@/components/landing/EbookDownloadForm';
import FooterSection from '@/components/landing/FooterSection';

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-grow">
        <HeroSection />
        <ReasonsToChooseUsSection />
        <FeaturesSection />
        <TestimonialsSection />
        <GoogleCloudSuccessSection />
        <MaestriaFlixSection />
        <BlogReferralSection />
        <EbookDownloadForm />
      </main>
      <FooterSection />
    </div>
  );
}
