import React from 'react';
import studentImg from '../assets/Blogs-HeroImage.png';
import FeaturedStory from "../components/FeaturedStory";
import Arrow1 from '../assets/Arrow2.png';

const trendingItems = [
  {
    id: 1,
    lines: ['How to Start a Career in Digital', 'Marketing in 2025'],
  },
  {
    id: 2,
    lines: ['Top 5 Stocks to Watch This', 'Month'],
  },
  {
    id: 3,
    lines: ['Python Projects for Beginners'],
  },
  {
    id: 4,
    lines: ['How Vyntra One Helps You Get', 'Job-Ready'],
  },
];

const BlogsHero = () => {
  return (
    <section className="relative w-full overflow-hidden py-10 sm:py-14 lg:py-8">
      {/* Figma Background Glows: Ellipse 1 (Amber #FEC453, 392x392) & Ellipse 2 (Blue #76B3FF) */}
      <div
        className="absolute top-[48px] right-[2%] sm:right-[6%] lg:right-[11%] xl:right-[14%] w-[350px] sm:w-[392px] h-[350px] sm:h-[392px] bg-[#FEC453] rounded-full pointer-events-none z-0"
        style={{ filter: 'blur(150px)', opacity: 0.6 }}
      />

      <div className="relative z-10 max-w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-20 flex flex-col justify-between">
        {/* Top Grid: Left (Typography) & Right (Visual Graphic) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">

          {/* Left Column */}
          <div className="lg:col-span-7 flex flex-col justify-center items-start text-left">
            {/* Tag / Category Badge */}
            <div className="inline-flex items-center gap-2.5 mb-3 sm:mb-4">
              <span className="w-7 sm:w-8 h-[2.5px] bg-[#1677ED] rounded-full"></span>
              <span
                style={{
                  fontFamily: 'Inter',
                  fontWeight: 700,
                  fontStyle: 'Bold',
                  color: '#50719B',
                  fontSize: '13px',
                  letterSpacing: '0.12em',
                }}
              >
                VYNTRA ONE BLOGS
              </span>
            </div>

            {/* Main Headline */}
            <h1
              className="text-[#071424] font-bold text-[32px] sm:text-[40px] md:text-[44px] lg:text-[46px] xl:text-[50px] leading-[1.12] tracking-[-0.03em] mb-3 sm:mb-4"
              style={{
                fontFamily: "'Gilroy-SemiBold', 'Gilroy', Inter, sans-serif",
                fontWeight: 400,
                color: '#071424',
              }}
            >
              Ideas, skills &amp; stories <br />
              for your <span className="text-[#1677ED]">next career move.</span>
            </h1>

            {/* Subtitle */}
            <p
              className="text-[13.5px] sm:text-[14.5px] lg:text-[15px] leading-[1.55] max-w-[520px] font-normal"
              style={{
                fontFamily: 'Inter',
                fontWeight: 400,
                fontStyle: 'Regular',
                color: '#66768B',
              }}
            >
              Practical knowledge, industry insights and real learner stories to help you learn, grow and build a better future with Vyntra One.
            </p>
          </div>

          {/* Right Column: Hero Visual Graphic */}
          <div className="lg:col-span-5 flex justify-center lg:justify-center items-center relative mt-4 lg:mt-0 lg:-translate-x-8 xl:-translate-x-12">
            <div className="relative w-[300px] sm:w-[380px] md:w-[420px] lg:w-[450px] flex items-end justify-center">

              {/* Rounded Vector Card behind student */}
              <div
                className="absolute bottom-0 w-full max-w-[450px] h-[220px] sm:h-[250px] md:h-[280px] lg:h-[295px] rounded-[32px] sm:rounded-[72px] lg:rounded-[90px]"
                style={{
                  background:
                    'linear-gradient(130.1deg, #F4F9FF 14.74%, rgba(229, 240, 255, 0) 85.26%)',
                }}
              />

              {/* Floating Badge 1: Top Left — sits behind student image (z-0 < student z-10) */}
              <div className="absolute top-4 sm:top-15 -left-2 sm:left-15 z-0 bg-white/95 backdrop-blur-md rounded-xl sm:rounded-2xl px-3 sm:px-3.5 py-1.5 sm:py-5 shadow-[0_6px_20px_rgba(16,24,40,0.08)] border border-white flex items-center gap-2.5 mt-10">
                <div className="flex items-center gap-[7px]">
                  <span className="w-1 h-3.5 bg-[#25AE72]"></span>
                  <span className="w-1 h-3.5 bg-[#25AE72]"></span>
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[#25AE72] font-bold text-[12px] sm:text-[13px] leading-tight">
                    Better Skills
                  </span>
                  <span className="text-[#667085] text-[10px] sm:text-[11px] font-medium leading-tight mt-0.5">
                    Brighter Future
                  </span>
                </div>
              </div>

              {/* Floating Badge 2: Bottom Right */}
              <div className="absolute bottom-8 sm:bottom-12 -right-2 sm:right-4 z-0 bg-white/95 backdrop-blur-md rounded-xl sm:rounded-2xl px-3 sm:px-5 py-1.5 sm:py-5 shadow-[0_6px_20px_rgba(16,24,40,0.08)] border border-white flex items-center gap-2.5">
                <div className="flex flex-col text-left">
                  <span className="text-[#027A48] font-bold text-[12px] sm:text-[13px] leading-tight">
                    Better Skills
                  </span>
                  <span className="text-[#667085] text-[10px] sm:text-[11px] font-medium leading-tight mt-0.5">
                    Brighter Future
                  </span>
                </div>
              </div>

              {/* Doodle Curved Arrow & Handwritten Text: Top Right */}
              <div className="absolute top-1 sm:top-2 -right-1 sm:right-2 z-20 flex flex-col items-center pointer-events-none select-none scale-90 sm:scale-95 origin-top-right">
                {/* Curved Arrow */}
                <div className="w-12 h-8 relative -left-3">

                </div>
                {/* Handwritten Text */}
                {/* Handwritten Annotations (Hidden on very small screens, visible md+) */}


                <div className="hidden lg:block absolute top-25 -right-10 text-[#8D8D8D] font-['Handlee'] text-[22px] transform -rotate-[38.67deg] z-30 pointer-events-none text-center flex flex-col items-center">
                  engaging <br /> learning <br /> experiences
                  <img src={Arrow1} className="w-15 h-15 absolute -left-[20%] -top-[50%] rotate-[18deg]" />
                </div>
              </div>

              {/* Student Cutout Image (Height constrained so it fits screen) */}
              <img
                src={studentImg}
                alt="Vyntra Learner"
                className="relative z-10 h-[260px] sm:h-[310px] md:h-[340px] lg:h-[365px] w-auto max-w-full object-contain select-none pointer-events-none drop-shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* Bottom Floating Ticker / Trending Now Card - Fits cleanly in screen */}
        <div className="mt-4 sm:mt-5 lg:mt-6 w-full bg-white rounded-[16px] sm:rounded-[20px] border border-[#E2E8F0] shadow-[0_6px_24px_rgba(16,24,40,0.05)] px-2 sm:px-6 py-2 sm:py-6">
          <div className="w-full overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <div className="grid grid-cols-5 divide-x divide-[#DFE5EC] items-stretch w-full min-w-[760px]">

              {/* Item 0: Trending Now Badge */}
              <div className="flex items-center justify-start gap-2 px-3 sm:px-4 py-1.5 text-left">
                <span className="text-base sm:text-lg shrink-0">🔥</span>
                <span
                  className="text-[#101828] font-bold text-[13px] sm:text-[14px] whitespace-nowrap"
                  style={{ fontFamily: 'Inter', fontWeight: 700, fontStyle: 'Bold', fontSize: '14px', color: '#071424' }}
                >
                  Trending Now
                </span>
              </div>

              {/* Trending Links */}
              {trendingItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    const target = document.getElementById('blogs');
                    if (target) {
                      target.scrollIntoView({ behavior: 'smooth' });
                    } else {
                      window.location.href = '/UserLogin';
                    }
                  }}
                  className="px-3 sm:px-4 lg:px-5 py-1.5 flex flex-col justify-center cursor-pointer group transition-colors min-w-0"
                >
                  {item.lines.map((line, lIdx) => (
                    <span
                      key={lIdx}
                      className="text-[11.5px] sm:text-[12px] text-[#475467] font-medium leading-[1.35] group-hover:text-[#1677ED] transition-colors"
                      style={{ fontFamily: 'Inter', fontWeight: 400, fontStyle: 'Regular', fontSize: '12px', color: '#52647A' }}
                    >
                      {line}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
      <FeaturedStory />
    </section>
  );
};

export default BlogsHero;
