import React from 'react';
import GraduationCap from '../assets/GraduationCap.png';
import Achievement from '../assets/achievement-icon1.png';
import QuizIcon from '../assets/quiz-icon1.png';
import Group1 from '../assets/Group-1.png';
import Group2 from '../assets/Group-2.png';
import Group3 from '../assets/Group-3.png';
import Group4 from '../assets/Group-4.png';
import Group5 from '../assets/Group-5.png';
import Logo from '../assets/LOGO BG.jpg.jpeg';

const BetterLearningExperiencesSection = () => {
  return (
    <div className="w-full bg-gradient-to-b from-white to-[#F2F2F2] pt-20 pb-10">
      <div className="w-full max-w-full 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 md:px-8 lg:px-[125px] xl:px-32 2xl:px-40 flex flex-col md:flex-row items-center justify-between relative z-10 overflow-visible overflow-x-clip lg:overflow-visible">
        {/* Left Column - Text */}
        <div className="w-full md:w-[55%] lg:w-[60%] flex flex-col items-start transform -translate-y-4 lg:-translate-y-5">
          <h3 className="text-[32px] md:text-[36px] lg:text-[55px] leading-[1.1]" style={{ fontFamily: '"SF Pro", -apple-system, BlinkMacSystemFont, sans-serif', fontWeight: 590, fontStyle: 'normal', color: '#ABABAB' }}>
            Better learning
          </h3>
          <div className="flex flex-wrap items-center gap-3 mt-1">
            <h3 className="text-[32px] md:text-[36px] lg:text-[55px] leading-[1.1]" style={{ fontFamily: '"SF Pro", -apple-system, BlinkMacSystemFont, sans-serif', fontWeight: 590, fontStyle: 'normal', color: '#ABABAB' }}>
              experiences
            </h3>
            {/* Placeholder for 3D icons */}
            <div className="flex items-center -space-x-3 sm:-space-x-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center z-10">
                <img src={GraduationCap} />
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center z-10">
                <img src={Achievement} />
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center z-10">
                <img src={QuizIcon} />
              </div>
            </div>
            <h3 className="text-[32px] md:text-[36px] lg:text-[55px] leading-[1.1]" style={{ fontFamily: '"SF Pro", -apple-system, BlinkMacSystemFont, sans-serif', fontWeight: 590, fontStyle: 'normal', color: '#000000' }}>
              with
            </h3>
          </div>
          <h3 className="text-[32px] md:text-[36px] lg:text-[55px] leading-[1.1]" style={{ fontFamily: '"SF Pro", -apple-system, BlinkMacSystemFont, sans-serif', fontWeight: 590, fontStyle: 'normal', color: '#000000' }}>
            Vyntra One
          </h3>
          <h3 className="text-[32px] md:text-[36px] lg:text-[55px] leading-[1.1]" style={{ fontFamily: '"SF Pro", -apple-system, BlinkMacSystemFont, sans-serif', fontWeight: 590, fontStyle: 'normal', color: '#ABABAB' }}>
            everything you need,
          </h3>
          <div className="flex flex-wrap items-center gap-4 mt-3">
            {/* Custom Toggle Switch */}
            <div className="w-[80px] sm:w-[100px] h-[40px] sm:h-[45px] bg-[#FF9414] rounded-full flex items-center p-1 sm:p-1.5 shadow-inner">
              <div className="w-[30px] h-[30px] sm:w-[30px] sm:h-[30px] bg-white rounded-full shadow-md ml-auto"></div>
            </div>
            <h3 className="text-[32px] md:text-[36px] lg:text-[55px] leading-[1.1]" style={{ fontFamily: '"SF Pro", -apple-system, BlinkMacSystemFont, sans-serif', fontWeight: 590, fontStyle: 'normal', color: '#000000' }}>
              on platform.
            </h3>
          </div>
        </div>

        {/* Right Column - Circular Graphic */}
        <div className="w-full md:w-[45%] h-[300px] md:h-[400px] lg:h-[600px] md:-right-[5%] lg:-right-[15%] relative flex items-center justify-center mt-8 md:mt-0 transform scale-60 sm:scale-75 md:scale-[0.6] lg:scale-100 origin-center lg:origin-right">
          {/* Inner Ring */}
          <div className="absolute w-[250px] h-[250px] lg:w-[200px] lg:h-[200px] rounded-full border border-[#0A26471A]"></div>

          {/* Middle Ring - 3 Icons (Evenly spaced at 120 degrees) */}
          <div className="absolute w-[380px] h-[380px] lg:w-[350px] lg:h-[350px] rounded-full border border-[#0A26471A]">
            <div className="absolute inset-0 w-full h-full animate-spin-slow pointer-events-none" style={{ animationDuration: '30s' }}>
              {/* Icon 1: Right (0 degrees) */}
              <div className="absolute top-[50%] left-[100%] transform -translate-x-1/2 -translate-y-1/2 w-[50px] h-[50px] bg-white rounded-2xl shadow-lg flex items-center justify-center text-gray-700 animate-spin-reverse-slow pointer-events-auto" style={{ animationDuration: '30s' }}>
                <img src={Group3} className='w-8 h-8' />
              </div>
              {/* Icon 2: Top Left (120 degrees) */}
              <div className="absolute top-[20%] left-[10%] transform -translate-x-1/2 -translate-y-1/2 w-[60px] h-[60px] bg-white rounded-2xl shadow-lg flex items-center justify-center text-gray-700 animate-spin-reverse-slow pointer-events-auto" style={{ animationDuration: '30s' }}>
                <img src={Group4} className='w-8 h-8' />
              </div>
              {/* Icon 3: Bottom Left (240 degrees) */}
              <div className="absolute top-[93.3%] left-[25%] transform -translate-x-1/2 -translate-y-1/2 w-[60px] h-[60px] bg-white rounded-2xl shadow-lg flex items-center justify-center text-gray-700 animate-spin-reverse-slow pointer-events-auto" style={{ animationDuration: '30s' }}>
                <img src={Group5} className='w-8 h-8' />
              </div>
            </div>
          </div>

          {/* Outer Ring - 2 Icons (Evenly spaced at 180 degrees) */}
          <div className="absolute w-[510px] h-[510px] lg:w-[500px] lg:h-[500px] rounded-full border border-[#0A26471A]">
            <div className="absolute inset-0 w-full h-full animate-spin-slow pointer-events-none" style={{ animationDuration: '40s' }}>
              {/* Icon 4: Top */}
              <div className="absolute top-[0%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 w-[60px] h-[60px] bg-white rounded-2xl shadow-lg flex items-center justify-center text-gray-700 animate-spin-reverse-slow pointer-events-auto" style={{ animationDuration: '40s' }}>
                <img src={Group1} className='w-8 h-8' />
              </div>
              {/* Icon 5: Bottom */}
              <div className="absolute top-[100%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 w-[60px] h-[60px] bg-white rounded-2xl shadow-lg flex items-center justify-center text-gray-700 animate-spin-reverse-slow pointer-events-auto" style={{ animationDuration: '40s' }}>
                <img src={Group2} className='w-8 h-8' />
              </div>
            </div>
          </div>

          {/* Center Logo */}
          <div className="absolute w-[80px] h-[80px] lg:w-[80px] lg:h-[80px] bg-white rounded-full shadow-2xl flex items-center justify-center z-10">
            <img src={Logo} className='rounded-full' />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BetterLearningExperiencesSection;
