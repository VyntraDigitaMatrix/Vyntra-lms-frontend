import React from "react";
import globeImg from "../assets/Globe.png";

const BlogsCTA = () => {
  const handleClick = () => {
    window.location.href = "/UserLogin";
  };

  return (
    <section className="w-full py-10 sm:py-14 bg-white relative">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-20">
        <div className="relative w-full rounded-[24px] sm:rounded-[28px] overflow-hidden bg-[#060D17] shadow-xl min-h-[260px] sm:min-h-[290px] lg:min-h-[310px] flex items-center p-6 sm:p-10 lg:p-12">

          {/* Background Globe Image anchored at right end */}
          <div className="absolute top-1/2 -right-12 sm:-right-16 lg:right-10 -translate-y-1/2 w-[320px] sm:w-[450px] md:w-[550px] lg:w-[640px] h-[320px] sm:h-[450px] md:h-[550px] lg:h-[640px] pointer-events-none flex items-center justify-center">
            <img
              src={globeImg}
              alt="Global Skills"
              className="w-full h-full object-cover rotate-[-45deg] opacity-95"
            />
          </div>

          {/* Dark Gradient Overlay from left to right */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(90deg, #060D17 0%, rgba(6,13,23,0.92) 40%, rgba(6,13,23,0.4) 75%, rgba(6,13,23,0.05) 100%)",
            }}
          />

          {/* Left Text Content */}
          <div className="relative z-10 max-w-[500px]">
            {/* Top Tagline */}
            <div className="flex items-center gap-2 mb-3">
              <span className="w-4 h-[1.5px] bg-[#B9C9D7]" />
              <span
                style={{
                  fontFamily: "Inter",
                  fontWeight: 700,
                  fontSize: "10px",
                  color: "#B9C9D7",
                }}
              >
                INSIGHTS FOR A BRIGHTER TOMORROW
              </span>
            </div>

            {/* Main Headline */}
            <h2
              className="mb-3"
              style={{
                fontFamily: "Inter",
                fontWeight: 700,
                fontSize: "32px",
                color: "#FFFFFF",
              }}
            >
              Learn today. Build tomorrow.
            </h2>

            {/* Description */}
            <p
              className="mb-7"
              style={{
                fontFamily: "Inter",
                fontWeight: 400,
                fontStyle: "Regular",
                fontSize: "12px",
                color: "#B5C4D0",
              }}
            >
              Explore expert insights, career guidance and real learner stories
              from the Vyntra One community.
            </p>

            {/* CTA Button */}
            <button
              onClick={handleClick}
              className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-white text-[#071424] font-semibold text-[13.5px] hover:bg-gray-100 hover:scale-[1.03] transition-all duration-300 shadow-md cursor-pointer"
              style={{ fontFamily: "Inter", fontWeight: 700, fontStyle: "Bold", fontSize: "11px", color: "#12243A" }}
            >
              <span>Explore All Blogs</span>
              <svg
                className="w-4 h-4 text-[#071424]"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </button>
          </div>

          {/* Right Side Handwritten Text Overlay */}
          <div className="hidden sm:flex absolute bottom-20 right-8 lg:right-14 xl:right-10 flex-col items-center pointer-events-none z-20 text-white font-['Handlee'] -rotate-[19deg]">
            <span
              className="text-[20px] lg:text-[23px] leading-[1.15] drop-shadow-md" style={{ fontFamily: "Handlee", fontWeight: 400, fontSize: "22px", color: "#FFFFFF", fontStyle: "Regular" }}>Global Skills
            </span>
            <span className="text-[20px] lg:text-[23px] leading-[1.15] drop-shadow-md" style={{ fontFamily: "Handlee", fontWeight: 400, fontSize: "22px", color: "#FFFFFF", fontStyle: "Regular" }}>
              Greater
            </span>
            <span className="text-[20px] lg:text-[23px] leading-[1.15] drop-shadow-md" style={{ fontFamily: "Handlee", fontWeight: 400, fontSize: "22px", color: "#FFFFFF", fontStyle: "Regular" }}>
              Opportunities
            </span>
            {/* Curved arrow pointing down-left toward the globe */}
            <svg
              className="w-15 h-15 text-white mt-1 drop-shadow-md"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              {/* the curve */}
              <path d="M17.5 2.5C20 9 18 16 7.5 21" />
              {/* the arrowhead */}
              <path d="M12.4 22.1L7.5 21L10 16.6" />
            </svg>
          </div>

        </div>
      </div>
    </section>
  );
};

export default BlogsCTA;
