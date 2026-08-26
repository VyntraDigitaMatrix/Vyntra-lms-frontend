import React from 'react';
import categoryIcon1 from '../assets/category-icon1.png';
import categoryIcon2 from '../assets/category-icon2.png';
import categoryIcon3 from '../assets/category-icon3.png';
import image106 from '../assets/image 106.png';
import image107 from '../assets/image 107.png';
import image108 from '../assets/image 108.png';

const LearningPaths = () => {
  return (
    <div className="w-full bg-transparent py-20 flex flex-col items-center">

      {/* Header */}
      <div className="w-full max-w-full 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 flex justify-between items-end mb-10">
        <div className="flex flex-col text-left">
          <h2 style={{ fontFamily: 'Outfit', fontWeight: 600, fontSize: '32px', color: '#1B2347' }} className="mb-2">
            Learning Paths
          </h2>
          <p style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: '15px', color: '#656C88' }} className="max-w-2xl">
            Choose from carefully curated paths designed to take you from beginner to expert in your chosen field.
          </p>
        </div>
        <button className="hidden md:flex items-center gap-2 text-[#0A2640] font-semibold text-[15px] group hover:opacity-80 transition-opacity">
          Explore Paths
          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
        </button>
      </div>

      {/* Cards Grid */}
      <div className="w-full max-w-full 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8 xl:gap-10">

        {/* Digital Marketing Card */}
        <div className="bg-[linear-gradient(90deg,_#C6F29A_13.97%,_#D9F9A8_50%,_#BFF09C_86.03%)] rounded-[32px] p-8 relative flex flex-col h-[340px] hover:-translate-y-2 transition-transform duration-300">
          <div className="absolute top-8 right-8 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm cursor-pointer hover:scale-105 transition-transform z-10">
            <svg className="w-5 h-5 text-[#11152F]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"></path></svg>
          </div>

          <div className="flex flex-col flex-grow">
            <div className="w-12 h-12 rounded-xl shadow-sm flex items-center justify-center overflow-hidden mb-4 mt-6">
              <img src={categoryIcon1} alt="Digital Marketing" className="w-full h-full object-cover" />
            </div>
            <h3 style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '25px', color: '#11152F' }} className="mb-4 leading-tight pr-4">
              Digital<br />Marketing
            </h3>
            <p style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: '12px', color: '#20283B' }} className="mb-3">
              Learn SEO, Social Media, Google Ads, Content Marketing & more.
            </p>
          </div>

          <div className="flex justify-between items-center mt-auto">
            <span className="bg-white/80 px-3 py-1.5 rounded-full" style={{fontFamily: 'Inter', fontWeight: 700, fontStyle: 'Bold', fontSize: '12px', color: '#278C16'}}>
              12+ Courses
            </span>
            <div className="flex items-center -space-x-2">
              <img src={image108} alt="Student" className="w-8 h-8 rounded-full border-[1.5px] border-[#D8F399] object-cover relative z-10" />
              <img src={image107} alt="Student" className="w-8 h-8 rounded-full border-[1.5px] border-[#D8F399] object-cover relative z-20" />
              <img src={image106} alt="Student" className="w-8 h-8 rounded-full border-[1.5px] border-[#D8F399] object-cover relative z-30" />
              <div className="w-8 h-8 rounded-full border-[1.5px] border-[#D8F399] bg-white flex items-center justify-center text-[12px] font-inter text-[#11152F] relative z-40">
                +8
              </div>
            </div>
          </div>
        </div>

        {/* Stock Market Card */}
        <div className="bg-[linear-gradient(90deg,_#FFD19E_13.97%,_#FFD7AD_50%,_#FFCB9D_86.03%)] rounded-[32px] p-8 relative flex flex-col h-[340px] hover:-translate-y-2 transition-transform duration-300">
          <div className="absolute top-8 right-8 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm cursor-pointer hover:scale-105 transition-transform z-10">
            <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"></path></svg>
          </div>

          <div className="flex flex-col flex-grow">
            <div className="w-12 h-12 rounded-xl shadow-sm flex items-center justify-center overflow-hidden mb-4 mt-6">
              <img src={categoryIcon2} alt="Stock Market" className="w-full h-full object-cover" />
            </div>
            <h3 style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '25px', color: '#11152F' }} className="mb-4 leading-tight pr-4">
              Stock<br />Market
            </h3>
            <p style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: '12px', color: '#20283B' }} className="mb-4">
              Master trading, technical analysis, investing, portfolio management & more.
            </p>
          </div>

          <div className="flex justify-between items-center mt-auto">
            <span className="bg-white/80 px-3 py-1.5 rounded-full" style={{fontFamily: 'Inter', fontWeight: 700, fontStyle: 'Bold', fontSize: '12px', color: '#e46112'}}>
              10+ Courses
            </span>
            <div className="flex items-center -space-x-2">
              <img src={image108} alt="Student" className="w-8 h-8 rounded-full border-[1.5px] border-[#FFD1A6] object-cover relative z-10" />
              <img src={image107} alt="Student" className="w-8 h-8 rounded-full border-[1.5px] border-[#FFD1A6] object-cover relative z-20" />
              <img src={image106} alt="Student" className="w-8 h-8 rounded-full border-[1.5px] border-[#FFD1A6] object-cover relative z-30" />
              <div className="w-8 h-8 rounded-full border-[1.5px] border-[#FFD1A6] bg-white flex items-center justify-center text-[12px] font-Inter-700 text-[#24283A] relative z-40">
                +6
              </div>
            </div>
          </div>
        </div>

        {/* Information Technology Card */}
        <div className="bg-[linear-gradient(90deg,_#B9D1F9_13.97%,_#C8DCFA_50%,_#C1D6F7_86.03%)] rounded-[32px] p-8 relative flex flex-col h-[340px] hover:-translate-y-2 transition-transform duration-300">
          <div className="absolute top-8 right-8 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm cursor-pointer hover:scale-105 transition-transform z-10">
            <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"></path></svg>
          </div>

          <div className="flex flex-col flex-grow">
            <div className="w-12 h-12 rounded-xl shadow-sm flex items-center justify-center overflow-hidden mb-4 mt-6">
              <img src={categoryIcon3} alt="Information Technology" className="w-full h-full object-cover" />
            </div>
            <h3 style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '25px', color: '#11152F' }} className="mb-4 leading-tight pr-4">
              Information<br />Technology
            </h3>
            <p style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: '12px', color: '#20283B' }} className="mb-4">
              Learn programming, web development, data structures, cloud & more.
            </p>
          </div>

          <div className="flex justify-between items-center mt-auto">
            <span className="bg-white/80 px-3 py-1.5 rounded-full" style={{fontFamily: 'Inter', fontWeight: 700, fontStyle: 'Bold', fontSize: '12px', color: '#3375D7'}}>
              15+ Courses
            </span>
            <div className="flex items-center -space-x-2">
              <img src={image108} alt="Student" className="w-8 h-8 rounded-full border-[1.5px] border-[#BFD4FF] object-cover relative z-10" />
              <img src={image107} alt="Student" className="w-8 h-8 rounded-full border-[1.5px] border-[#BFD4FF] object-cover relative z-20" />
              <img src={image106} alt="Student" className="w-8 h-8 rounded-full border-[1.5px] border-[#BFD4FF] object-cover relative z-30" />
              <div className="w-8 h-8 rounded-full border-[1.5px] border-[#BFD4FF] bg-white flex items-center justify-center text-[12px] font-Inter-700 text-[#24283A] relative z-40">
                +10
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Pagination Indicators */}
      <div className="mt-12 flex justify-center items-center gap-3">
        <div className="w-12 h-2 rounded-full bg-[#4F24D8]"></div>
        <div className="w-8 h-2 rounded-full bg-[#E2E2E8]"></div>
        <div className="w-8 h-2 rounded-full bg-[#E2E2EB]"></div>
        <div className="w-8 h-2 rounded-full bg-[#E2E2EB]"></div>
        <div className="w-8 h-2 rounded-full bg-[#E2E2EB]"></div>
      </div>
    </div>
  );
};

export default LearningPaths;
