import Header from '@/components/landing/Header';
import HeroSection from '@/components/landing/HeroSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import MaestriaFlixSection from '@/components/landing/MaestriaFlixSection';
import BlogReferralSection from '@/components/landing/BlogReferralSection';
import EbookDownloadForm from '@/components/landing/EbookDownloadForm';
import TestimonialsSection from '@/components/landing/TestimonialsSection';
import FooterSection from '@/components/landing/FooterSection';

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-grow">
        <HeroSection />
        <FeaturesSection />
        <TestimonialsSection />
        <MaestriaFlixSection />
        <BlogReferralSection />
        <EbookDownloadForm />
      </main>
      <FooterSection />
    </div>
  );
}
