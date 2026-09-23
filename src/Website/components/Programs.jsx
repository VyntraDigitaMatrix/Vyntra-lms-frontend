import React from 'react';
import program1 from '../assets/Programs-1.png';
import program2 from '../assets/Programs-2.png';
import program3 from '../assets/Programs-3.png';
import image106 from '../assets/image 106.png';
import image107 from '../assets/image 107.png';
import image108 from '../assets/image 108.png';

const Programs = () => {
  return (
    <section id="programs" className="w-full py-16 sm:py-20 bg-white relative overflow-hidden scroll-mt-24">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-20">
        {/* Header */}
        <div className="w-full flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-12 sm:mb-10">
          {/* Left: Badge + Heading */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-10">
            <div className="inline-flex items-center px-4 py-3 rounded-full bg-[#F0F1F4] shrink-0 shadow-xs mt-0 sm:-mt-10">
              <span
                style={{ fontFamily: 'Inter', fontWeight: 700, fontStyle: 'Bold', fontSize: '13px', color: '#111318' }}
              >
                Programs
              </span>
            </div>
            <h2
              className="text-3xl sm:text-4xl lg:text-[40px] font-bold text-[#11162A] leading-tight"
              style={{ fontFamily: "'Gilroy-SemiBold', 'Gilroy', Inter, sans-serif", fontWeight: 400, fontSize: '40px', color: '#111318' }}
            >
              Courses Designed<br />
              for <span className="text-[#1167D8]">All Levels</span>
            </h2>
          </div>

          {/* Right: Description */}
          <p
            className="text-[#73799A] text-xs sm:text-[13px] leading-relaxed max-w-[340px]"
            style={{ fontFamily: 'Inter', fontWeight: 400, fontStyle: 'Regular', fontSize: '14px', color: '#777983' }}
          >
            Whether you're a beginner looking for the right learning path, or looking to upgrade your skills, Vyntra One has the right programs for you.
          </p>
        </div>

        {/* 3 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Card 1: Stock Market */}
          <div
            className="relative rounded-[24px] p-5 sm:p-6 overflow-hidden flex flex-col justify-between min-h-[295px] sm:min-h-[305px] group hover:-translate-y-1.5 transition-all duration-300 shadow-sm hover:shadow-xl"
            style={{ background: 'linear-gradient(144.73deg, #FFD19E 13.97%, #FFFFFF 50%, #FFF3E5 86.03%)' }}
          >
            {/* Top Content: Avatars, Icon, Title, Description */}
            <div className="relative z-10 flex flex-col">
              {/* Avatar Stack */}
              <div className="inline-flex items-center self-start gap-1.5 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-full shadow-xs">
                <div className="flex items-center -space-x-2">
                  <img src={image108} alt="Student" className="w-5 h-5 rounded-full border border-white object-cover" />
                  <img src={image107} alt="Student" className="w-5 h-5 rounded-full border border-white object-cover" />
                  <img src={image106} alt="Student" className="w-5 h-5 rounded-full border border-white object-cover" />
                </div>
                <span className="text-[11px] font-bold text-gray-800 ml-0.5" style={{ fontFamily: 'Inter, sans-serif' }}>+8</span>
              </div>

              {/* Icon */}
              <div className="w-10 h-10 rounded-xl bg-[#ED6A14] text-white flex items-center justify-center shadow-xs mt-10">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 3v5m0 4v9m6-18v11m0 4v3m6-18v2m0 4v12M3 8h6M9 14h6M15 6h6" />
                </svg>
              </div>

              {/* Title */}
              <h3
                className="mt-2.5"
                style={{ fontFamily: 'Inter', fontWeight: 700, fontStyle: 'Bold', fontSize: '24px', color: '#11152F' }}
              >
                Stock<br />Market
              </h3>

              {/* Description */}
              <p
                className="mt-1.5 max-w-[215px]"
                style={{ fontFamily: 'Inter', fontWeight: 400, fontStyle: 'Regular', fontSize: '13px', color: '#20283B' }}
              >
                Master trading, technical analysis, investing, portfolio management & more.
              </p>
            </div>

            {/* Organic Floating Image on the Right */}
            <div className="absolute top-6 -right-2 sm:-right-2 w-[165px] h-[165px] sm:w-[170px] sm:h-[170px] overflow-hidden shadow-xs pointer-events-none z-0">
              <img
                src={program1}
                alt="Stock Market Trading"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Bottom Row */}
            <div className="flex items-center justify-between mt-4 relative z-10">
              <span
                className="bg-white text-[#EA580C] font-bold text-xs px-3.5 py-1.5 rounded-full shadow-xs"
                style={{ fontFamily: 'Inter', fontWeight: 700, fontStyle: 'Bold', fontSize: '12px', color: '#E46112' }}
              >
                10+ Courses
              </span>
             <button
  onClick={() => window.location.href = '/stock-market'}
  className="w-8.5 h-8.5 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-900 hover:scale-110 transition-transform cursor-pointer"
>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7V17" />
                </svg>
              </button>
            </div>
          </div>

          {/* Card 2: Digital Marketing */}
          <div
            className="relative rounded-[24px] p-5 sm:p-6 overflow-hidden flex flex-col justify-between min-h-[295px] sm:min-h-[305px] group hover:-translate-y-1.5 transition-all duration-300 shadow-sm hover:shadow-xl"
            style={{ background: 'linear-gradient(144.73deg, #C6F29A 13.97%, #FFFFFF 50%, #EEE7FF 86.03%)' }}
          >
            {/* Top Content: Avatars, Icon, Title, Description */}
            <div className="relative z-10 flex flex-col">
              {/* Avatar Stack */}
              <div className="inline-flex items-center self-start gap-1.5 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-full shadow-xs">
                <div className="flex items-center -space-x-2">
                  <img src={image108} alt="Student" className="w-5 h-5 rounded-full border border-white object-cover" />
                  <img src={image107} alt="Student" className="w-5 h-5 rounded-full border border-white object-cover" />
                  <img src={image106} alt="Student" className="w-5 h-5 rounded-full border border-white object-cover" />
                </div>
                <span className="text-[11px] font-bold text-gray-800 ml-0.5" style={{ fontFamily: 'Inter, sans-serif' }}>+8</span>
              </div>

              {/* Icon */}
              <div className="w-10 h-10 rounded-xl bg-[#22C55E] text-white flex items-center justify-center shadow-xs mt-10">
                <svg className="w-4.5 h-4.5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
              </div>

              {/* Title */}
              <h3
                className="mt-2.5"
                style={{ fontFamily: 'Inter', fontWeight: 700, fontStyle: 'Bold', fontSize: '24px', color: '#11152F' }}
              >
                Digital<br />Marketing
              </h3>

              {/* Description */}
              <p
                className="mt-1.5 max-w-[215px]"
                style={{ fontFamily: 'Inter', fontWeight: 400, fontStyle: 'Regular', fontSize: '13px', color: '#20283B' }}
              >
                Learn SEO, Social Media, Google Ads, Content Marketing & more.
              </p>
            </div>

            {/* Organic Floating Image on the Right */}
            <div className="absolute top-10 -right-2 sm:-right-13 w-[165px] sm:w-[250px] pointer-events-none z-0">
              <img
                src={program2}
                alt="Digital Marketing"
                className="w-full h-auto object-contain group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Bottom Row */}
            <div className="flex items-center justify-between mt-4 relative z-10">
              <span
                className="bg-white/95 text-[#16A34A] font-bold text-xs px-3.5 py-1.5 rounded-full shadow-xs"
                style={{ fontFamily: 'Inter', fontWeight: 700, fontStyle: 'Bold', fontSize: '12px', color: '#278C16' }}
              >
                Coming Soon
              </span>
              <button
                onClick={() => window.location.href = '/UserLogin'}
                className="w-8.5 h-8.5 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-900 hover:scale-110 transition-transform cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7V17" />
                </svg>
              </button>
            </div>
          </div>

          {/* Card 3: Information Technology */}
          <div
            className="relative rounded-[24px] p-5 sm:p-6 overflow-hidden flex flex-col justify-between min-h-[295px] sm:min-h-[305px] group hover:-translate-y-1.5 transition-all duration-300 shadow-sm hover:shadow-xl"
            style={{ background: 'linear-gradient(144.73deg, #B9D1F9 13.97%, #FFFFFF 50%, #D9E6FD 86.03%)' }}
          >
            {/* Top Content: Avatars, Icon, Title, Description */}
            <div className="relative z-10 flex flex-col">
              {/* Avatar Stack */}
              <div className="inline-flex items-center self-start gap-1.5 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-full shadow-xs">
                <div className="flex items-center -space-x-2">
                  <img src={image108} alt="Student" className="w-5 h-5 rounded-full border border-white object-cover" />
                  <img src={image107} alt="Student" className="w-5 h-5 rounded-full border border-white object-cover" />
                  <img src={image106} alt="Student" className="w-5 h-5 rounded-full border border-white object-cover" />
                </div>
                <span className="text-[11px] font-bold text-gray-800 ml-0.5" style={{ fontFamily: 'Inter, sans-serif' }}>+8</span>
              </div>

              {/* Icon */}
              <div className="w-10 h-10 rounded-xl bg-[#2563EB] text-white flex items-center justify-center shadow-xs mt-10">
                <svg className="w-4.5 h-4.5 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l-3 3 3 3m8-6l3 3-3 3" />
                </svg>
              </div>

              {/* Title */}
              <h3
                className="mt-2.5"
                style={{ fontFamily: 'Inter', fontWeight: 700, fontStyle: 'Bold', fontSize: '24px', color: '#11152F' }}
              >
                Information<br />Technology
              </h3>

              {/* Description */}
              <p
                className="mt-1.5 max-w-[215px]"
                style={{ fontFamily: 'Inter', fontWeight: 400, fontStyle: 'Regular', fontSize: '13px', color: '#20283B' }}
              >
                Learn programming, web development, data structures, cloud & more.
              </p>
            </div>

            {/* Organic Floating Image on the Right */}
            <div className="absolute top-6 -right-2 sm:-right-2 w-[165px] h-[165px] sm:w-[170px] sm:h-[170px] rounded-full overflow-hidden shadow-xs pointer-events-none z-0">
              <img
                src={program3}
                alt="Information Technology"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Bottom Row */}
            <div className="flex items-center justify-between mt-4 relative z-10">
              <span
                className="bg-white/95 text-[#2563EB] font-bold text-xs px-3.5 py-1.5 rounded-full shadow-xs"
                style={{ fontFamily: 'Inter', fontWeight: 700, fontStyle: 'Bold', fontSize: '12px', color: '#3375D7' }}
              >
                Coming Soon
              </span>
              <button
                onClick={() => window.location.href = '/UserLogin'}
                className="w-8.5 h-8.5 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-900 hover:scale-110 transition-transform cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7V17" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Programs;
