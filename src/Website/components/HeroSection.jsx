import React from 'react';
import bgVector1 from '../assets/bg-vector.png';
import bgVector2 from '../assets/bg-vector2.png';

const HeroSection = () => {
  return (
    <>
      {/* Background Vector Graphics */}
      <img src={bgVector1} alt="" className="absolute top-[3%] right-0 w-[40vw] max-w-[800px] z-0 pointer-events-none opacity-80" />
      <img src={bgVector2} alt="" className="absolute top-[3%] left-0 w-[45vw] max-w-[800px] z-0 pointer-events-none opacity-80" />

      {/* Top Badge */}
      <div
        className="flex items-center gap-3 backdrop-blur-sm px-1.5 py-1 rounded-full border border-gray-200 shadow-sm mb-10 z-10"
        style={{ background: 'linear-gradient(148.25deg, #FAF5DB 2.92%, rgba(255, 255, 255, 0.33) 80.89%)' }}
      >
        <span style={{ fontFamily: 'Inter', fontWeight: 700, fontStyle: 'Bold', fontSize: '10px', color: '#1B4B8F' }} className="pl-3">CAREER-FIRST TECH EDUCATION</span>
        <a href="#" style={{ fontFamily: 'Inter', fontWeight: 400, fontStyle: 'Regular', fontSize: '11px', color: '#000000' }} className="flex items-center gap-1 bg-[#F5A624] hover:bg-amber-600 px-3 py-1 rounded-full transition-colors">
          Check it out
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
        </a>
      </div>

      {/* Hero Text */}
      <h1 className="text-[40px] sm:text-[50px] lg:text-[65px] text-center" style={{ fontFamily: 'Outfit', fontWeight: 500, color: '#000000', lineHeight: 1.1 }}>
        Learn. Build. Get hired.
      </h1>
      <p style={{ fontFamily: 'Poppins', fontWeight: 275, fontStyle: 'ExtraLight', fontSize: '15px', color: '#000000' }} className="max-w-[42rem] text-center mb-10 leading-relaxed px-4 z-10">
        VyntraOne pairs project-based courses with a real hiring pipeline — so what you
        <br className="hidden md:block" />
        ship is what gets you hired, not a certificate that just says you learned.
      </p>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-10 z-10">
        <button style={{ fontFamily: 'Inter', fontWeight: 700, fontStyle: 'Bold', fontSize: '13px', color: '#FFFFFF' }} className="bg-[#0A2647] hover:bg-[#1E2B43] px-6 py-3 rounded-full shadow-lg transition-all w-full sm:w-auto">
          Start Your Journey
        </button>
        <button style={{ fontFamily: 'Inter', fontWeight: 700, fontStyle: 'Bold', fontSize: '13px', color: '#0A2647' }} className="flex items-center justify-center gap-2 bg-transparent border border-[#1B3459] hover:[#1B3459]/50 px-6 py-3 rounded-full transition-all w-full sm:w-auto">
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          See how hiring works
        </button>
      </div>
    </>
  );
};

export default HeroSection;
