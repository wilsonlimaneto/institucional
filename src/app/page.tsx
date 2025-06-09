
'use client';

import React, { useState } from 'react';
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
import CallToActionSection from '@/components/landing/CallToActionSection';
import ContactModal from '@/components/landing/ContactModal'; // Importando o novo modal

export default function LandingPage() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const openContactModal = () => setIsContactModalOpen(true);

  return (
    <div className="flex min-h-screen flex-col">
      <Header onOpenContactModal={openContactModal} />
      <main className="flex-grow">
        <HeroSection onOpenContactModal={openContactModal} />
        <DiferenciaisSection />
        <GoogleCloudSuccessSection />
        <CallToActionSection /> 
        <ReasonsToChooseUsSection />
        <TestimonialsSection />
        <FeaturesSection />
        <CallToActionSection /> 
        <MaestriaFlixSection />
        <EbookDownloadForm />
        {/* <BlogReferralSection /> */}
      </main>
      <FooterSection />
      <ContactModal isOpen={isContactModalOpen} onOpenChange={setIsContactModalOpen} />
    </div>
  );
}
