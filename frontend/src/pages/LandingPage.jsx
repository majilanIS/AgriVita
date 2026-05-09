import React from 'react';
import './LandingPage.css';
import Navbar from '../components/LandingPage-components/Navbar';
import HeroSection from '../components/LandingPage-components/HeroSection';
import FeaturesSection from '../components/LandingPage-components/FeaturesSection';
import StatsSection from '../components/LandingPage-components/StatsSection';
import HowItWorksSection from '../components/LandingPage-components/HowItWorksSection';
import CTASection from '../components/LandingPage-components/CTASection';
import Footer from '../components/LandingPage-components/Footer';

const LandingPage = () => {
  return (
    <div className="landing-page">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <StatsSection />
      <HowItWorksSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default LandingPage;
