
import Header from '@/components/landing/Header';
import HeroSection from '@/components/landing/HeroSection';
import DiferenciaisSection from '@/components/landing/DiferenciaisSection';
import ReasonsToChooseUsSection from '@/components/landing/ReasonsToChooseUsSection';
import TestimonialsSection from '@/components/landing/TestimonialsSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import GoogleCloudSuccessSection from '@/components/landing/GoogleCloudSuccessSection';
import MaestriaFlixSection from '@/components/landing/MaestriaFlixSection';
// import BlogReferralSection from '@/components/landing/BlogReferralSection';
import EbookDownloadForm from '@/components/landing/EbookDownloadForm';
import FooterSection from '@/components/landing/FooterSection';

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-grow">
        <HeroSection />
        <DiferenciaisSection />
        <GoogleCloudSuccessSection />
        <ReasonsToChooseUsSection />
        <TestimonialsSection />
        <FeaturesSection />
        <MaestriaFlixSection />
        <EbookDownloadForm />
        {/* <BlogReferralSection /> */}
      </main>
      <FooterSection />
    </div>
  );
}
