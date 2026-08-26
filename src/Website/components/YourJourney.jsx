import React from 'react';
import exploreVisual from '../assets/explore.png';
import learnVisual from '../assets/video-window1.png';
import practiceVisual from '../assets/practise.png';
import achieveVisual from '../assets/visual4.png';
import Arrow1 from '../assets/arrow1.png';
import Arrow2 from '../assets/arrow2.png';
import Arrow3 from '../assets/arrow3.png';
import Arrow4 from '../assets/arrow4.png';

const YourJourney = () => {
  return (
    <div className="w-full bg-transparent pt-20  relative overflow-hidden flex flex-col items-center">
      <div className="w-full max-w-full 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 flex flex-col items-center z-10">

        {/* Title Section */}
        <div className="mb-16 relative text-center">
          <h2
            className="text-4xl md:text-[48px] lg:text-[50px] text-[#15130F] leading-tight"
            style={{ fontFamily: 'Sk-Modernist', fontWeight: 400 }}
          >
            Your Journey.
            <br />
            Your Progress. <span style={{ fontFamily: 'Playfair Display', fontStyle: 'italic', color: '#1C385A' }}>Your VyntraOne.</span>
          </h2>
        </div>

        {/* Grid Container */}
        <div className="w-full max-w-[960px] relative z-10">

          {/* Handwritten Annotations (Hidden on very small screens, visible md+) */}
          <div className="hidden lg:block absolute -top-[10%] -left-[6%] text-[#8D8D8D] font-['Handlee'] text-[22px] transform rotate-[16.35deg] z-30 pointer-events-none text-center flex flex-col items-center">
            find the <br /> right path <br />  for you!
            <img src={Arrow1} className="w-12 h-12 absolute left-[100%] top-[30%]" />
          </div>

          <div className="hidden lg:block absolute -top-[6%] -right-[10%] text-[#8D8D8D] font-['Handlee'] text-[22px] transform -rotate-[38.67deg] z-30 pointer-events-none text-center flex flex-col items-center">
            engaging <br /> learning <br /> experiences
            <img src={Arrow2} className="w-15 h-15 absolute -left-[20%] -top-[50%] rotate-[18deg]" />
          </div>


          <div className="hidden lg:block absolute bottom-[5%] -left-[8%] text-[#8D8D8D] font-['Handlee'] text-[22px] transform rotate-[-22.36deg] z-30 pointer-events-none text-center flex flex-col items-center">
            practice makes <br /> progress
            <img src={Arrow3} className="w-15 h-15 absolute bottom-[80%] left-[50%]" />
          </div>

          <div className="hidden lg:block absolute bottom-[5%] -right-[10%] text-[#8D8D8D] font-['Handlee'] text-[22px] transform rotate-[16.35deg] z-30 pointer-events-none text-center flex flex-col items-center">
            achieve more, <br /> get recognized
            <img src={Arrow4} className="w-12 h-12 absolute bottom-[100%] right-[60%]" />
          </div>


          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative p-4">

            {/* Card 1: Explore */}
            <div className="bg-[#FFFFFF] rounded-[32px] p-5 flex flex-col min-h-[420px] hover:-translate-y-1 transition-transform duration-300 shadow-sm border border-[#F2F2F2]">
              <div className="flex flex-col mb-4">
                <div className="mb-4 px-2 pt-2">
                  <span className="text-[#6B7280] text-[16px] font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>Step 1</span>
                </div>

                {/* Visual */}
                <div className="w-full h-[160px] flex flex-col items-center justify-center mb-0 relative">
                  <div className="w-full max-w-[340px] flex justify-center items-start relative">
                    <img src={exploreVisual} alt="Explore" className="w-full h-[180px] object-contain drop-shadow-sm rounded-[10px]" />
                  </div>
                </div>
              </div>

              <div
                className="bg-[#FFF3E8] rounded-[24px] px-6 pt-3 pb-6 mt-auto min-h-[150px] flex flex-col"
                style={{ clipPath: 'polygon(0 0, 65% 0, 75% 32px, 100% 32px, 100% 100%, 0 100%)' }}
              >
                <h3 className="text-[#F97316] text-[22px] font-bold pb-2.5 border-b border-[#5A5A5A21] mb-2.5 mt-2" style={{ fontFamily: 'Inter, sans-serif' }}>Explore</h3>
                <p className="text-[#6B7280] font-normal leading-relaxed text-[14px]" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Discover courses across Digital Marketing, Stock Market, and Information Technology.
                </p>
              </div>
            </div>

            {/* Card 2: Learn */}
            <div className="bg-[#FFFFFF] rounded-[32px] p-5 flex flex-col min-h-[420px] hover:-translate-y-1 transition-transform duration-300 shadow-sm border border-[#F2F2F2]">
              <div className="flex flex-col mb-4">
                <div className="mb-4 px-2 pt-2">
                  <span className="text-[#6B7280] text-[16px] font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>Step 2</span>
                </div>

                {/* Visual */}
                <div className="w-full h-[160px] flex flex-col items-center justify-center mb-0 relative">
                  <div className="w-full max-w-[320px] flex justify-center items-center relative">

                    <img src={learnVisual} alt="Learn" className="w-full h-auto object-contain drop-shadow-sm rounded-[10px]" />
                  </div>
                </div>
              </div>

              <div
                className="bg-[#EBF4FF] rounded-[24px] px-6 pt-3 pb-6 mt-auto min-h-[150px] flex flex-col"
                style={{ clipPath: 'polygon(0 0, 65% 0, 75% 32px, 100% 32px, 100% 100%, 0 100%)' }}
              >
                <h3 className="text-[#0A84FF] text-[22px] font-bold pb-2.5 border-b border-[#5A5A5A21] mb-2.5 mt-2" style={{ fontFamily: 'Inter, sans-serif' }}>Learn</h3>
                <p className="text-[#6B7280] font-normal leading-relaxed text-[14px]" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Learn from expert-led video lessons, live classes, and downloadable resources.
                </p>
              </div>
            </div>

            {/* Card 3: Practice */}
            <div className="bg-[#FFFFFF] rounded-[32px] p-5 flex flex-col min-h-[420px] hover:-translate-y-1 transition-transform duration-300 shadow-sm border border-[#F2F2F2]">
              <div className="flex flex-col mb-4">
                <div className="mb-4 px-2 pt-2">
                  <span className="text-[#6B7280] text-[16px] font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>Step 3</span>
                </div>

                {/* Visual */}
                <div className="w-full h-[160px] flex flex-col items-center justify-center mb-0 relative">
                  <div className="w-full max-w-[320px] flex justify-center items-center relative">
                    <img src={practiceVisual} alt="Practice" className="w-full h-[180px] object-contain drop-shadow-sm" />
                  </div>
                </div>
              </div>

              <div
                className="bg-[#F3EEFF] rounded-[24px] px-6 pt-3 pb-6 mt-auto min-h-[150px] flex flex-col"
                style={{ clipPath: 'polygon(0 0, 65% 0, 75% 32px, 100% 32px, 100% 100%, 0 100%)' }}
              >
                <h3 className="text-[#8B5CF6] text-[22px] font-bold pb-2.5 border-b border-[#5A5A5A21] mb-2.5 mt-2" style={{ fontFamily: 'Inter, sans-serif' }}>Practice</h3>
                <p className="text-[#6B7280] font-normal leading-relaxed text-[14px]" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Reinforce your skills with quizzes, assignments, projects, and real-world practice.
                </p>
              </div>
            </div>

            {/* Card 4: Achieve */}
            <div className="bg-[#FFFFFF] rounded-[32px] p-5 flex flex-col min-h-[420px] hover:-translate-y-1 transition-transform duration-300 shadow-sm border border-[#F2F2F2]">
              <div className="flex flex-col mb-4">
                <div className="mb-4 px-2 pt-2">
                  <span className="text-[#6B7280] text-[16px] font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>Step 4</span>
                </div>

                {/* Visual */}
                <div className="w-full h-[160px] flex flex-col items-center justify-center mb-0 relative">
                  <div className="w-full max-w-[320px] flex justify-center items-center relative">
                    <img src={achieveVisual} alt="Achieve" className="w-full h-auto object-contain drop-shadow-sm" />
                  </div>
                </div>
              </div>

              <div
                className="bg-[#E6F8F3] rounded-[24px] px-6 pt-3 pb-6 mt-auto min-h-[150px] flex flex-col"
                style={{ clipPath: 'polygon(0 0, 65% 0, 75% 32px, 100% 32px, 100% 100%, 0 100%)' }}
              >
                <h3 className="text-[#10B981] text-[22px] font-bold pb-2.5 border-b border-[#5A5A5A21] mb-2.5 mt-2" style={{ fontFamily: 'Inter, sans-serif' }}>Achieve</h3>
                <p className="text-[#6B7280] font-normal leading-relaxed text-[14px]" style={{ fontFamily: 'Inter' }}>
                  Earn certificates, unlock achievements, and climb the leaderboards.
                </p>
              </div>
            </div>

          </div>

          {/* Explore the Ecosystem Button */}
          <div className="mt-8 pb-12 flex justify-center">
            <button className="bg-white border-[2px] border-[#00000047] px-8 py-3 rounded-full hover:bg-gray-50 transition-colors shadow-sm" style={{ fontFamily: 'Inter', fontWeight: 400, fontStyle: 'Regular', fontStyle: '14px', color: '#000000' }}>
              Explore the Ecosystem
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YourJourney;
