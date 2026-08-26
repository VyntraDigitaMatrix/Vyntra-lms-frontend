import React from 'react';
import LearningPaths from './components/LearningPaths';
import JobPortal from './components/JobPortal';
import YourJourney from './components/YourJourney';
import CTASection from './components/CTASection';
import ReferralCard from './components/ReferralCard';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';

import HeroSection from './components/HeroSection';
import PhonesSection from './components/PhonesSection';
import LearningShouldntStopSection from './components/LearningShouldntStopSection';
import BetterLearningExperiencesSection from './components/BetterLearningExperiencesSection';
import HowItWorksSection from './components/HowItWorksSection';

const Home = () => {
  return (
    <div className="relative w-full overflow-hidden flex flex-col items-center pt-12 bg-[#FFFFFF]">

      
      <HeroSection />
      <PhonesSection />
      <LearningShouldntStopSection />
      <BetterLearningExperiencesSection />
      
      <div className="w-full bg-[#F2F2F2] pb-8 relative overflow-hidden flex flex-col items-center">
        <HowItWorksSection />
        <LearningPaths />
        <JobPortal />
        <YourJourney />
        <Testimonials />
        <ReferralCard />
        <CTASection />
      </div>
      <Footer />
    </div>
  );
};

export default Home;