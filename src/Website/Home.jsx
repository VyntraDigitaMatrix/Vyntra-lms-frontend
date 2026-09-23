import React from 'react';
import Programs from './components/Programs';
import LiveClasses from './components/LiveClasses';
import JobPortal from './components/JobPortal';
import Community from './components/Community';
import Blogs from './components/Blogs';
import CTASection from './components/CTASection';
import ReferralCard from './components/ReferralCard';
import FAQSection from './components/FAQSection';
import Footer from './components/Footer';

import HeroSection from './components/HeroSection';
import LearningShouldntStopSection from './components/LearningShouldntStopSection';
import BetterLearningExperiencesSection from './components/BetterLearningExperiencesSection';
import HowItWorksSection from './components/HowItWorksSection';
import WhyChooseUsSection from './components/WhyChooseUsSection';

const Home = () => {
  return (
    <div className="relative w-full overflow-hidden flex flex-col items-center bg-[#FFFFFF]">
      <HeroSection />


      <HowItWorksSection />
      <WhyChooseUsSection />
      <Programs />
      <LiveClasses />
      <JobPortal />
      <Community />
      <Blogs />
      <ReferralCard />
      <FAQSection />
      <CTASection />

      <Footer />
    </div>
  );
};

export default Home;