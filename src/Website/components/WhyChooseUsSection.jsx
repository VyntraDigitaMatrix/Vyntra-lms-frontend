import React from 'react';
import portraitCard from '../assets/portrait-card1.png';
import portfolioImage from '../assets/portfolio-image2.png';
import sreemanImg from '../assets/Sreeman.png';

const WhyChooseUsSection = () => {
  return (
    <section className="w-full py-16 sm:py-14 bg-white relative overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section: Badge, Heading, Description, Button in the same line */}
        <div className="w-full flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 lg:gap-5 mb-12 sm:mb-10">
          {/* Pill Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-[#F0F1F4] shrink-0 shadow-xs">
            <span
              style={{ fontFamily: 'Inter', fontWeight: 700, fontStyle: 'Bold', fontSize: '13px', color: '#111318' }}
            >
              Why choose VyntraOne
            </span>
          </div>

          {/* Heading */}
          <h2
            className="leading-[1.18] shrink-0"
            style={{ fontFamily: "'Gilroy-SemiBold', 'Gilroy', sans-serif", fontWeight: 700, fontSize: '40px', color: '#111827' }}
          >
            We take the stress<br />
            out of <span className="text-[#1167D8]">Learning</span>
          </h2>

          {/* Description */}
          <p
            className="max-w-[300px] shrink-0"
            style={{ fontFamily: 'Inter', fontWeight: 400, fontStyle: 'Regular', fontSize: '13px', color: '#73799A' }}
          >
            A complete learning and career ecosystem designed to give you the right skills, guidance and opportunities — so you can simply show up and grow.
          </p>

          {/* Action Button */}
          <button
            onClick={() => window.location.href = '/UserLogin'}
            className="inline-flex items-center gap-1.5 bg-[#7239F7] hover:bg-[#6D28D9] px-5 py-2.5 rounded-full shadow-md shadow-purple-500/20 transition-all cursor-pointer hover:scale-105 active:scale-95 shrink-0"
            style={{ fontFamily: 'Inter', fontWeight: 700, fontStyle: 'Bold', fontSize: '13px', color: '#FFFFFF' }}
          >
            Explore
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7V17" />
            </svg>
          </button>
        </div>

        {/* Content Section: 3-Column Layout */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-8">
          {/* Column 1: Left Portrait Card (portrait-card1.png) */}
          <div className="w-full lg:w-auto flex justify-center">
            <div className="relative w-[300px] sm:w-[320px] rounded-xl overflow-hidden shadow-xl shadow-gray-200/70 border border-gray-100 group hover:shadow-2xl transition-all duration-300">
              <img
                src={portraitCard}
                alt="Learn Practice Grow"
                className="w-full h-auto object-cover group-hover:scale-102 transition-transform duration-500"
              />
            </div>
          </div>

          {/* Column 2: Center Feature Highlights (3 Rows) */}
          <div className="w-full lg:flex-1 max-w-[580px] flex flex-col gap-8 sm:gap-10 py-2">
            {/* Feature 1: Personalized learning experience */}
            <div className="flex items-start gap-4 sm:gap-5">
              <div className="w-12 h-12 rounded-full bg-[#FFF0E6] flex items-center justify-center shrink-0 shadow-xs">
                <svg className="w-6 h-6 text-[#F97316]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 flex-1">
                <h3 className="sm:w-[195px] shrink-0" style={{ fontFamily: 'Inter', fontWeight: 700, fontStyle: 'Bold', fontSize: '17px', color: '#11162A' }}>
                  Personalized learning<br className="hidden sm:inline" /> experience
                </h3>
                <p className="max-w-[340px]" style={{ fontFamily: 'Inter', fontWeight: 400, fontStyle: 'Regular', fontSize: '13px', color: '#73799A' }}>
                  Customized learning paths designed to match your goals, pace, and interests.
                </p>
              </div>
            </div>

            {/* Feature 2: Learn anytime, anywhere */}
            <div className="flex items-start gap-4 sm:gap-5">
              <div className="w-12 h-12 rounded-full bg-[#F3E8FF] flex items-center justify-center shrink-0 shadow-xs">
                <svg className="w-6 h-6 text-[#9333EA]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <rect x="5" y="2" width="14" height="20" rx="3" ry="3" />
                  <line x1="12" y1="18" x2="12.01" y2="18" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 flex-1">
                <h3 className="sm:w-[195px] shrink-0" style={{ fontFamily: 'Inter', fontWeight: 700, fontStyle: 'Bold', fontSize: '17px', color: '#11162A' }}>
                  Learn anytime,<br className="hidden sm:inline" /> anywhere
                </h3>
                <p className="max-w-[340px]" style={{ fontFamily: 'Inter', fontWeight: 400, fontStyle: 'Regular', fontSize: '13px', color: '#73799A' }}>
                  Access your courses, notes and live classes on any device with complete flexibility.
                </p>
              </div>
            </div>

            {/* Feature 3: Track progress with insights */}
            <div className="flex items-start gap-4 sm:gap-5">
              <div className="w-12 h-12 rounded-full bg-[#FFEAE8] flex items-center justify-center shrink-0 shadow-xs">
                <svg className="w-6 h-6 text-[#EF4444]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 20V10M12 20V4M6 20v-6" />
                </svg>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 flex-1">
                <h3 className="sm:w-[195px] shrink-0" style={{ fontFamily: 'Inter', fontWeight: 700, fontStyle: 'Bold', fontSize: '17px', color: '#11162A' }}>
                  Track progress<br className="hidden sm:inline" /> with insights
                </h3>
                <p className="max-w-[340px]" style={{ fontFamily: 'Inter', fontWeight: 400, fontStyle: 'Regular', fontSize: '13px', color: '#73799A' }}>
                  Leverage powerful analytics to identify strengths, track progress, and achieve your goals faster.
                </p>
              </div>
            </div>
          </div>

          {/* Column 3: Right Student Card (portfolio-image2.png) with Rotating Badge */}
          <div className="w-full lg:w-auto flex justify-center">
            <div className="relative w-[280px] sm:w-[210px] rounded-xl bg-white border border-gray-100 shadow-xl shadow-gray-200/70 p-3.5 flex justify-center items-center group">
              <div className="w-[210px] h-[210px] rounded-[26px] overflow-hidden bg-white">
                <img
                  src={portfolioImage}
                  alt="Vyntra Student with books"
                  className="w-[210px] h-[210px] object-cover group-hover:scale-102 transition-transform duration-500"
                />
              </div>

              {/* Overlapping Floating Stamp / Rotating Badge */}
              <div className="absolute bottom-6 -left-8 sm:-left-10 z-20 w-20 h-20 sm:w-25 sm:h-25 rounded-full bg-white shadow-2xl flex items-center justify-center border border-gray-100 select-none pointer-events-none">
                {/* Rotating SVG circular text */}
                <svg
                  className="w-full h-full animate-spin-slow"
                  viewBox="0 0 100 100"
                  style={{ animationDuration: '24s' }}
                >
                  <defs>
                    <path
                      id="stampCirclePath"
                      d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0"
                    />
                  </defs>
                  <text className="text-[10px] font-extrabold tracking-[2.7px] fill-gray-900 uppercase" style={{ fontFamily: 'Inter', fontWeight: 700, fontStyle: 'Bold', fontSize: '10px', color: '#000000' }}>
                    <textPath href="#stampCirclePath">
                      • VYNTRA ONE • VYNTRA ONE
                    </textPath>
                  </text>
                </svg>

                {/* Inner Purple Cap Circle */}
                <div className="absolute w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#7C3AED] flex items-center justify-center text-white shadow-inner">
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                    <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CEO Quote / Statement Section */}
        <div className="mt-20 sm:mt-20 flex flex-col items-center text-center">
          <h3
            className="leading-snug sm:leading-tight max-w-4xl"
            style={{ fontFamily: 'Inter', fontWeight: 400, fontStyle: 'Regular', fontSize: '38px', color: '#11162A' }}
          >
            Vyntra One’s AI-powered learning platform<br />
            helps learners achieve their goals <span className="text-[#6434f4] font-bold">70% faster</span><br />
            <span className="text-[#858BA8]">with real skill improvements.</span>
          </h3>

          {/* Author info */}
          <div className="mt-6 flex items-center gap-3">
            <img
              src={sreemanImg}
              alt="Sreeman Reddy Mallu"
              className="w-13 h-13 rounded-full object-cover shadow-xs border border-gray-100"
            />
            <div className="flex flex-col text-left">
              <span
                style={{ fontFamily: 'Inter', fontWeight: 700, fontStyle: 'Bold', fontSize: '14px', color: '#11162A' }}
              >
                SREEMAN REDDY MALLU
              </span>
              <span
                style={{ fontFamily: 'Inter', fontWeight: 400, fontStyle: 'Regular', fontSize: '13px', color: '#8A8FA8' }}
              >
                CEO, Vyntra One
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUsSection;
