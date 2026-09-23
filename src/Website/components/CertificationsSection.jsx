import React from "react";
import certificateImg from "../assets/Certificate.png";
import AchievementIcon from "../assets/achievement-icon1.png";

const points = [
  "Globally recognized certificate",
  "Share on LinkedIn & in your resume",
  "Validate your practical knowledge",
  "Stand out in your career journey",
];

const CertificationsSection = () => {
  const handleClick = () => {
    window.location.href = "/UserLogin";
  };

  return (
    <section className="w-full py-10 sm:py-14 bg-white">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8 sm:mb-10">
          <h2
            className="mb-1.5"
            style={{
              fontFamily: "Inter",
              fontWeight: 700,
              fontSize: "26px",
              color: "#10213D",
              fontStyle: "Bold",
            }}
          >
            Certifications
          </h2>
          <p
            className="text-[13.5px]"
            style={{ fontFamily: "Inter", fontWeight: 400, fontStyle: "Regular", color: "#65758A", fontSize: "13px" }}
          >
            Get certified and showcase your skills to stand out.
          </p>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">

          {/* Left: Certificate Preview Image with Medal Overlay */}
          <div className="lg:col-span-7 flex justify-start relative left-[20%]">
            <div className="relative w-full max-w-[480px] sm:max-w-[500px]">

              {/* Green Ribbon Medal Overlay Icon */}
              <div className="absolute -top-3 -left-3 w-10 h-10 rounded-[12px] flex items-center justify-center z-10">
                <img src={AchievementIcon} alt="Achievement Medal Icon" className="w-12 h-12" />
              </div>

              <img
                src={certificateImg}
                alt="Vyntra One Certificate of Achievement"
                className="w-full h-auto object-contain rounded-[14px] shadow-sm border border-[#E2E8F0]"
              />
            </div>
          </div>

          {/* Right: Feature Checklist & Button */}
          <div className="lg:col-span-5 flex flex-col justify-center items-start lg:pl-4">

            {/* Checklist */}
            <div className="flex flex-col gap-3.5 mb-8">
              {points.map((pt, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-[#25AE72] shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span
                    style={{ fontFamily: "Inter", fontWeight: 400, fontStyle: "Regular", color: "#607086", fontSize: "14px" }}
                  >
                    {pt}
                  </span>
                </div>
              ))}
            </div>

            {/* View Certificate CTA Button */}
            <button
              onClick={handleClick}
              className="bg-[#071424] hover:bg-[#111927] text-white px-7 py-3.5 rounded-[12px] font-bold text-[14px] transition-colors shadow-md inline-flex items-center gap-2 cursor-pointer"
              style={{ fontFamily: "Inter" }}
            >
              <span>View Certificate</span>
              <span>&rarr;</span>
            </button>

          </div>

        </div>

      </div>
    </section>
  );
};

export default CertificationsSection;
