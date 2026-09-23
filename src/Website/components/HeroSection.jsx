import React from 'react';
import heroBg from '../../assets/HeroBg.png';
import heroImage from '../../assets/HeroImage.png';
import instructor1 from '../assets/image 106.png';
import instructor2 from '../assets/image 107.png';
import instructor3 from '../assets/image 108.png';
import bgVector from '../assets/bg-vector.png';

const HeroSection = () => {
  return (
    <section className="w-full pt-2 sm:pt-0 pb-4 sm:pb-3 bg-white relative overflow-visible">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-20 relative">
        {/* Figma Background Glows: Ellipse 2 (Blue #76B3FF at 60%) & Ellipse 1 (Amber #FEC453) */}
        <div
          className="absolute top-[340px] sm:top-[380px] left-[5%] sm:left-[18%] lg:left-[10%] w-[275px] h-[340px] bg-[#76B3FF] rounded-full pointer-events-none z-0"
          style={{ filter: 'blur(160px)', opacity: 0.6 }}
        />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-6 sm:gap-20 xl:gap-20">
          {/* Left Column: Content & Actions */}
          <div className="w-full lg:w-[480px] xl:w-[560px] shrink-0 flex flex-col items-start z-10 lg:-mt-8 xl:-mt-20">
            {/* Top Badge */}
            <div
              className="inline-flex items-center gap-2.5 bg-[#F4F5F8] backdrop-blur-sm px-1.5 py-1 rounded-full border border-gray-200/80 shadow-xs mb-3 sm:mb-2"

            >
              <span
                style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '11px', color: '#1B4B8F' }}
                className="pl-3 tracking-wide"
              >
                CAREER-FIRST TECH EDUCATION
              </span>
              <a
                href="/UserLogin"
                style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: '11px', color: '#000000' }}
                className="inline-flex items-center gap-1 bg-[#F5A624] hover:bg-amber-500 px-3 py-1 rounded-full transition-colors"
              >
                Check it out
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            </div>

            {/* Heading */}
            <h1
              className="text-3xl sm:text-4xl lg:text-[60px] xl:text-[60px] font-bold text-[#111827] tracking-tight leading-[1.08] mb-2 sm:mb-2.5 text-left"
              style={{ fontFamily: 'Outfit', fontWeight: 500, fontStyle: 'Medium', color: '#000000' }}
            >
              Learn. Build. Get<br />
              <span className="text-[#F7B139]">Placed</span>.
            </h1>

            {/* Subtitle */}
            <p
              className="text-[13px] sm:text-[14px] text-[#4B5563] max-w-[480px] leading-relaxed mb-3 text-left"
              style={{ fontFamily: 'Inter', fontWeight: 275, fontStyle: 'ExtraLight', color: '#000000' }}
            >
              VyntraOne pairs project-based courses with a real hiring pipeline — so what you ship is what gets you hired, not a certificate that just says you learned.
            </p>

            {/* Action CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 mb-3.5">
              <button
                onClick={() => window.location.href = '/UserLogin'}
                className="bg-[#009C59] hover:bg-[#00874e] active:scale-95 px-5 py-2 rounded-full shadow-md shadow-emerald-700/20 transition-all cursor-pointer"
                style={{ fontFamily: 'Inter', fontWeight: 700, fontStyle: 'Bold', fontSize: '14px', color: '#FFFFFF' }}
              >
                Start Your Journey
              </button>
              <button
                onClick={() => {
                  document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                  window.history.pushState(null, '', '/#how-it-works');
                }}
                className="flex items-center gap-2.5 bg-white border border-[#1B3459] text-[#1B3459] hover:bg-slate-50 active:scale-95 font-bold text-[14px] px-4 py-2 rounded-full transition-all cursor-pointer shadow-xs"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                <span className="w-5 h-5 rounded-full bg-[#1B3459] flex items-center justify-center shrink-0">
                  <svg className="w-2.5 h-2.5 fill-white ml-0.5" viewBox="0 0 24 24">
                    <polygon points="6 4 20 12 6 20" />
                  </svg>
                </span>
                See how hiring works
              </button>
            </div>

            {/* Value Propositions / Perks */}
            <div className="flex flex-col gap-2 mb-3.5 max-w-[460px] w-full">
              {/* Learn Skills */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-xs">
                  <svg className="w-4 h-4 text-gray-800" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 14v7" />
                  </svg>
                </div>
                <div>
                  <h4 style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: '13px', color: '#0A0A23' }}>Learn Skills</h4>
                  <p className="mt-0.5"
                    style={{ fontFamily: 'Inter', fontWeight: 400, fontStyle: 'Regular', fontSize: '12px', color: '#6B6B7C' }}>
                    Access expert-curated courses in Digital Marketing, Stock Market, IT and more.
                  </p>
                </div>
              </div>

              {/* Get Hired Faster */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-xs">
                  <svg className="w-4 h-4 fill-[#F5A624] text-[#F5A624]" viewBox="0 0 24 24">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                </div>
                <div>
                  <h4 style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: '13px', color: '#0A0A23' }}>Get Hired Faster</h4>
                  <p className="mt-0.5"
                    style={{ fontFamily: 'Inter', fontWeight: 400, fontStyle: 'Regular', fontSize: '12px', color: '#6B6B7C' }}>
                    Practice real-world projects, build your portfolio and connect with top recruiters.
                  </p>
                </div>
              </div>
            </div>

            {/* App Store & Google Play Badges */}
            <div className="flex flex-wrap items-center gap-3 mb-2">
              {/* App Store */}
              <a
                href="#download-ios"
                className="bg-black hover:bg-neutral-800 text-white px-3 py-1.5 rounded-xl flex items-center gap-2 transition-colors shadow-sm"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.61-.75 1.04-1.8 0.92-2.85-.9.04-2 .6-2.65 1.35-.58.67-1.09 1.74-.96 2.77 1 .08 2.07-.53 2.69-1.27z" />
                </svg>
                <div className="text-left leading-tight">
                  <div className="text-[8px] text-gray-300 font-medium">Download on the</div>
                  <div className="text-[12px] font-semibold tracking-tight" style={{ fontFamily: 'Inter, sans-serif' }}>
                    App Store
                  </div>
                </div>
              </a>

              {/* Google Play */}
              <a
                href="#download-android"
                className="bg-black hover:bg-neutral-800 text-white px-3 py-1.5 rounded-xl flex items-center gap-2 transition-colors shadow-sm"
              >
                <svg className="w-4.5 h-4.5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M3.61 1.81L13.88 12 3.61 22.19C3.24 21.75 3 21.1 3 20.31V3.69c0-.79.24-1.44.61-1.88z" />
                  <path fill="#FBBC04" d="M17.47 8.41L13.88 12l3.59 3.59 4.14-2.39c1.19-.68 1.19-1.8 0-2.48l-4.14-2.31z" />
                  <path fill="#EA4335" d="M13.88 12L3.61 1.81c.54-.54 1.4-.46 2.37.09l11.49 6.51L13.88 12z" />
                  <path fill="#34A853" d="M13.88 12l3.59 3.59-11.49 6.51c-.97.55-1.83.63-2.37.09L13.88 12z" />
                </svg>
                <div className="text-left leading-tight">
                  <div className="text-[8px] text-gray-300 font-medium uppercase">GET IT ON</div>
                  <div className="text-[12px] font-semibold tracking-tight" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Google Play
                  </div>
                </div>
              </a>
            </div>

            {/* Handwritten Annotation & Arrow */}
            {/* <div className="relative pl-4 pt-2 flex items-center gap-2">
            <span
              className="text-[#64748B] text-[16px] sm:text-[18px] leading-tight select-none rotate-[-4deg]"
              style={{ fontFamily: '"Handlee", cursive' }}
            >
              find the<br />
              right path<br />
              for you
            </span>
            <img
              src={arrow1}
              alt=""
              className="w-8 sm:w-10 h-auto object-contain mt-3 ml-1 select-none pointer-events-none"
            />
          </div> */}
          </div>

          {/* Right Column: Hero Image with Background Circle & Floating Cards */}
          <div className="relative w-full lg:w-auto flex justify-center lg:justify-start items-center mt-6 lg:mt-20 lg:-ml-2 xl:-ml-4 pt-20">
            {/* Warm cream background backdrop matching Figma */}
            <div
              className="absolute -top-10 sm:-top-10 -right-6 sm:-right-10 w-[420px] h-[420px] sm:w-[440px] sm:h-[440px] lg:w-[600px] lg:h-[600px] rounded-full bg-[#FAF5DB]/40 pointer-events-none z-0 blur-2xl"
            />

            {/* Background Vector Image from Figma (Vector 336: #F7B139 border at 6% - 25% opacity) */}
            <img
              src={bgVector}
              alt=""
              className="absolute -top-10 sm:top-15 -right-6 sm:-right-20 w-[460px] sm:w-[570px] lg:w-[440px] max-w-none pointer-events-none z-0"
              style={{
                filter: 'invert(72%) sepia(85%) saturate(700%) hue-rotate(345deg)',
                opacity: 0.65,
              }}
            />

            {/* Wrapper for Circle and Student */}
            <div className="relative z-[1] w-[340px] sm:w-[440px] lg:w-[480px] flex justify-center items-end">
              {/* Circular Blurred Campus Background (HeroBg) */}
              <div
                className="absolute top-8 sm:-top-15 right-6 sm:right-20 w-[310px] h-[310px] sm:w-[410px] sm:h-[410px] lg:w-[480px] lg:h-[480px] rounded-full overflow-hidden shadow-inner z-0"
                style={{
                  WebkitMaskImage: 'linear-gradient(180deg, #000000 0%, #000000 40%, rgba(0, 0, 0, 0.6) 55%, rgba(0, 0, 0, 0) 70%)',
                  maskImage: 'linear-gradient(180deg, #000000 0%, #000000 40%, rgba(0, 0, 0, 0.6) 55%, rgba(0, 0, 0, 0) 70%)',
                }}
              >
                <img
                  src={heroBg}
                  alt="Campus Background"
                  className="w-full h-full object-cover scale-105"
                />
              </div>

              {/* Student Image (HeroImage) with soft bottom fade matching Figma mask group */}
              <div className="relative z-10 w-[310px] -top-19 right-6 sm:right-15 sm:w-[410px] lg:w-[440px] flex justify-center">
                <img
                  src={heroImage}
                  alt="Vyntra Student"
                  className="w-full h-auto object-contain select-none pointer-events-none drop-shadow-md"
                  style={{
                    WebkitMaskImage: 'linear-gradient(180deg, #000000 0%, #000000 45%, rgba(0, 0, 0, 0.7) 60%, rgba(0, 0, 0, 0.25) 72%, rgba(0, 0, 0, 0) 82%)',
                    maskImage: 'linear-gradient(180deg, #000000 0%, #000000 45%, rgba(0, 0, 0, 0.7) 60%, rgba(0, 0, 0, 0.25) 72%, rgba(0, 0, 0, 0) 82%)',
                  }}
                />
              </div>

              {/* Floating Card 1: Live Classes (Top Left) */}
              <div className="absolute top-0 sm:-top-18 -left-2 sm:-left-8 lg:-left-15 z-30 bg-white/95 backdrop-blur-md rounded-2xl p-3 sm:p-3.5 shadow-[0_12px_32px_rgba(0,0,0,0.08)] border border-gray-100 min-w-[150px] rotate-[5deg]">
                <p style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '13px', color: '#000000', fontStyle: 'SemiBold' }}>
                  Live Classes
                </p>
                <p style={{ fontFamily: 'Poppins', fontWeight: 400, fontSize: '7px', color: '#000000', fontStyle: 'Regular' }}>
                  Learn from industry experts
                </p>
                <div className="flex items-center gap-2 mt-2.5">
                  <div className="flex items-center gap-1.5 bg-[#FF3B30] text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    <span>Live</span>
                  </div>
                  <div className="flex -space-x-1.5 items-center">
                    <img src={instructor1} alt="Instructor 1" className="w-5 h-5 rounded-full object-cover ring-1.5 ring-white" />
                    <img src={instructor2} alt="Instructor 2" className="w-5 h-5 rounded-full object-cover ring-1.5 ring-white" />
                    <img src={instructor3} alt="Instructor 3" className="w-5 h-5 rounded-full object-cover ring-1.5 ring-white" />
                    <div className="w-5 h-5 rounded-full bg-gray-100 ring-1.5 ring-white text-[8px] font-bold text-gray-600 flex items-center justify-center">
                      +8
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Card 2: Career Opportunities (Top Right) */}
              <div className="absolute top-16 sm:top-8 -right-2 sm:-right-6 lg:-right-8 z-30 bg-white/95 backdrop-blur-md rounded-full py-2 px-2 sm:px-4 shadow-[0_12px_32px_rgba(0,0,0,0.08)] border border-gray-100 flex items-center gap-2.5 sm:gap-3 rotate-[5deg]">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#E8F8F0] flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-[#009E60]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                  </svg>
                </div>
                <div>
                  <p style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '9px', color: '#000000', fontStyle: 'SemiBold' }}>Career Opportunities</p>
                  <p style={{ fontFamily: 'Poppins', fontWeight: 400, fontSize: '7px', color: '#000000', fontStyle: 'SemiBold' }}>Apply to top Companies</p>
                </div>
              </div>

              {/* Floating Card 3: Your Progress (Bottom Left) */}
              <div className="absolute bottom-12 sm:bottom-50 -left-2 sm:-left-4 lg:-left-15 z-30 bg-white/95 backdrop-blur-md rounded-full py-2 sm:py-2 px-3.5 sm:px-4 shadow-[0_12px_32px_rgba(0,0,0,0.08)] border border-gray-100 flex items-center gap-2.5 sm:gap-3 rotate-[-9deg]">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#E8F8F0] flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-[#009E60]" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                    <polyline points="17 6 23 6 23 12" />
                  </svg>
                </div>
                <div>
                  <p style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '11px', color: '#000000', fontStyle: 'SemiBold' }}>Your Progress</p>
                  <p style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '14px', color: '#000000', fontStyle: 'SemiBold' }}>75%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
