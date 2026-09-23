import React from "react";

const otherCourses = [
  {
    id: 1,
    title: "Data Science for Finance",
    desc: "Learn data analysis and visualisation for real-world applications.",
    iconBg: "bg-[#E8E4FF]",
    iconColor: "text-[#2600FF]",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    id: 2,
    title: "Algorithmic Trading",
    desc: "Build and test trading strategies with Python.",
    iconBg: "bg-[#FFF4CC]",
    iconColor: "text-[#FFC800]",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
  },
  {
    id: 3,
    title: "Wealth Management",
    desc: "Learn to plan, manage and grow your wealth.",
    iconBg: "bg-[#E5F1FF]",
    iconColor: "text-[#1662EB]",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    id: 4,
    title: "Financial Freedom",
    desc: "Personal finance and investment planning.",
    iconBg: "bg-[#DCF8ED]",
    iconColor: "text-[#00B26C]",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
      </svg>
    ),
  },
];

const OtherCoursesSection = () => {
  const handleClick = () => {
    window.location.href = "/UserLogin";
  };

  return (
    <section className="w-full py-10 sm:py-14 bg-white">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-8 gap-3">
          <div>
            <span
              className="mb-1"
              style={{ fontFamily: "Inter", fontWeight: 700, fontStyle: "Bold", color: "#59697E", fontSize: "12px" }}
            >
              EXPLORE MORE
            </span>
            <h2
              className="mb-1"
              style={{
                fontFamily: "Inter",
                fontWeight: 700,
                fontSize: "27px",
                color: "#10213D",
                fontStyle: "Bold",
              }}
            >
              Other Courses We Offer
            </h2>
            <p
              style={{ fontFamily: "Inter", fontWeight: 400, fontStyle: "Regular", color: "#65758A", fontSize: "12.5px", fontStyle: "Regular" }}
            >
              Enhance your financial and tech skills with our additional programs.
            </p>
          </div>

          <button
            onClick={handleClick}
            className="hover:underline inline-flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
            style={{ fontFamily: "Inter", fontWeight: 700, fontStyle: "Bold", fontSize: "12px", color: "#1760E9" }}
          >
            <span>View All Courses</span>
            <span>&rarr;</span>
          </button>
        </div>

        {/* 4-Column Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {otherCourses.map((course) => (
            <div
              key={course.id}
              onClick={handleClick}
              className="bg-white border border-[#E9EEF3] rounded-[18px] p-5 flex items-start gap-4 cursor-pointer group hover:shadow-md transition-shadow duration-300"
            >
              {/* Icon Container */}
              <div
                className={`w-9 h-9 rounded-[12px] ${course.iconBg} ${course.iconColor} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}
              >
                {course.icon}
              </div>

              {/* Text & Link */}
              <div className="flex-1 min-w-0">
                <h3
                  className="text-[#071424] font-bold text-[15px] mb-1 leading-snug group-hover:text-[#1677ED] transition-colors"
                  style={{ fontFamily: "Inter", fontWeight: 400, fontStyle: "Regular", fontSize: "13px", color: "#10213D" }}
                >
                  {course.title}
                </h3>
                <p
                  className="text-[#8190A2] text-[12px] leading-[1.4] mb-3"
                  style={{ fontFamily: "Inter", fontWeight: 400, fontStyle: "Regular", fontSize: "11px", color: "#718095" }}
                >
                  {course.desc}
                </p>
                <div
                  className="text-[#1662EB] font-semibold text-[12px] inline-flex items-center gap-1 group-hover:gap-1.5 transition-all"
                  style={{ fontFamily: "Inter" }}
                >
                  <span>Explore</span>
                  <span>&rarr;</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default OtherCoursesSection;
