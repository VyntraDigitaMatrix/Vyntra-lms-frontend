import React from "react";
import featuredImg from "../assets/Featured-Story.png";
import storyImg1 from "../assets/Featured-Story-1.png";
import storyImg2 from "../assets/Featured-Story-2.png";
import storyImg3 from "../assets/Featured-Story-3.png";
import PriyaSharma from "../assets/Priya-Sharma.png";

const sideStories = [
  {
    id: 1,
    category: "Stock Market",
    categoryColor: "text-[#21A45E] bg-[#E8F8ED]",
    title: "Understanding Stock Market Basics: A Beginner's Guide",
    date: "Mar 10, 2025",
    readTime: "6 min read",
    image: storyImg1,
  },
  {
    id: 2,
    category: "Technology",
    categoryColor: "text-[#1979E8] bg-[#E8F2FF]",
    title: "10 Python Projects That Will Boost Your Portfolio",
    date: "Mar 8, 2025",
    readTime: "7 min read",
    image: storyImg2,
  },
  {
    id: 3,
    category: "Career",
    categoryColor: "text-[#F09B16] bg-[#FFF4DD]",
    title: "How to Prepare for Tech Interviews in 2025",
    date: "Mar 5, 2025",
    readTime: "6 min read",
    image: storyImg3,
  },
];

const FeaturedStory = () => {
  const handleClick = () => {
    window.location.href = "/blog-detail";
  };

  return (
    <section className="relative w-full py-10 sm:py-12 lg:py-4 bg-white overflow-hidden">
      {/* Figma Ellipse 2: #76B3FF at 60% opacity, 445×445, blur 500 */}
      <div
        className="absolute w-[300px] sm:w-[380px] lg:w-[445px] h-[300px] sm:h-[380px] lg:h-[445px] rounded-full bg-[#76B3FF] pointer-events-none z-0"
        style={{ filter: 'blur(130px)', opacity: 0.4, top: '0px', left: '15%' }}
      />

      <div className="relative z-10 max-w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-20 mt-6 sm:mt-8 lg:mt-4">
        {/* Section Heading */}
        <h2
          className="text-[#0D1117] mb-6 sm:mb-8"
          style={{ fontFamily: "Gilroy-SemiBold", fontWeight: 400, fontSize: "25px", color: "#071424" }}
        >
          Featured Story
        </h2>

        {/* Two-column grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_420px] gap-4 sm:gap-5">
          {/* LEFT: Large Featured Card */}
          <div
            onClick={handleClick}
            className="relative rounded-[20px] sm:rounded-[24px] overflow-hidden cursor-pointer group h-[340px] sm:h-[380px] lg:h-auto lg:min-h-[380px]"
          >
            <img
              src={featuredImg}
              alt="How Digital Marketing Can Kickstart Your Career"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              style={{ objectPosition: "center 20%" }}
            />
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(90deg, rgba(1,16,28,0.93) 0%, rgba(1,16,28,0.52) 50%, rgba(1,16,28,0.02) 100%)',
              }}
            />
            <div className="absolute inset-0 flex flex-col justify-between p-5 sm:p-6 lg:p-7">
              {/* Top Badges */}
              <div className="flex items-center gap-2">
                <span
                  className="px-3 py-2 rounded-full text-[11px] font-semibold text-white bg-white/14 backdrop-blur-sm border border-white/60"
                  style={{ fontFamily: "Inter" }}
                >
                  Digital Marketing
                </span>
                <span
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-[11px] font-semibold border border-[#FFAD1A] text-[#FEC453] bg-black/30 backdrop-blur-sm"
                  style={{ fontFamily: "Inter", fontWeight: 700, fontStyle: "Bold", fontSize: "11px", color: "#FFAD1A" }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FFAD1A] inline-block" />
                  Featured
                </span>
              </div>
              {/* Bottom Content */}
              <div>
                <h3
                  className="mb-2.5 max-w-[360px]"
                  style={{ fontFamily: "Inter", fontWeight: 400, fontSize: "25px", fontStyle: "Regular", color: "#FFFFFF" }}
                >
                  How Digital Marketing
                  <br />
                  Can Kickstart Your Career.
                  <br />
                  in 2025
                </h3>
                <p
                  className="mb-5 max-w-[380px] leading-[1.5]"
                  style={{ fontFamily: "Inter", fontWeight: 400, fontSize: "13px", fontStyle: "Regular", color: "#DCE7F0" }}
                >
                  Explore the skills, tools and opportunities in digital marketing
                  and how Vyntra One's live learning helps you get job-ready.
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-[#FEC453] flex items-center justify-center text-black text-[11px] font-bold shrink-0">
                      <img src={PriyaSharma} alt="Priya Sharma" className="w-7 h-7 rounded-full object-cover" />
                    </div>
                    <div>
                      <p style={{ fontFamily: "Inter", fontWeight: 700, fontStyle: "Bold", fontSize: "11px", color: "#FFFFFF" }}>
                        By Priya Sharma
                      </p>
                      <p style={{ fontFamily: "Inter", fontWeight: 400, fontSize: "10px", fontStyle: "Regular", color: "#FFFFFF" }}>
                        Mar 12, 2025 &nbsp;&middot;&nbsp; 8 min read
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleClick(); }}
                    className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform shrink-0"
                    aria-label="Read featured article"
                  >
                    <svg className="w-4 h-4 text-gray-900" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7V17" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Three smaller story cards stacked */}
          <div className="flex flex-col gap-3 sm:gap-4">
            {sideStories.map((story) => (
              <div
                key={story.id}
                onClick={handleClick}
                className="flex items-center gap-3 sm:gap-4 bg-white border border-[#EAEEF2] rounded-[16px] sm:rounded-[18px] p-3 sm:p-3.5 cursor-pointer group hover:shadow-md transition-shadow"
              >
                <div className="flex-1 min-w-0">
                  <span
                    className={`inline-block px-2.5 py-2 rounded-full text-[10.5px] font-semibold mb-1.5 ${story.categoryColor}`}
                    style={{ fontFamily: "Inter", fontWeight: 700, fontStyle: "Bold", fontSize: "10px" }}
                  >
                    {story.category}
                  </span>
                  <h4
                    className="mb-1.5 line-clamp-2 transition-colors"
                    style={{ fontFamily: "Inter", fontWeight: 400, fontSize: "17px", color: "#071424" }}
                  >
                    {story.title}
                  </h4>
                  <p style={{ fontFamily: "Inter", fontWeight: 400, fontStyle: "Regular", fontSize: "11px", color: "#718095" }}>
                    {story.date}&nbsp;&nbsp;&middot;&nbsp;&nbsp;{story.readTime}
                  </p>
                </div>
                <div className="relative shrink-0">
                  <div className="w-[80px] sm:w-[120px] h-[64px] sm:h-[82px] rounded-[10px] overflow-hidden bg-gray-100">
                    <img
                      src={story.image}
                      alt={story.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400"
                    />
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleClick(); }}
                    className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full bg-white border border-[#E2E8F0] shadow flex items-center justify-center group-hover:scale-110 transition-transform"
                    aria-label="Read article"
                  >
                    <svg className="w-3 h-3 text-gray-800" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7V17" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedStory;
