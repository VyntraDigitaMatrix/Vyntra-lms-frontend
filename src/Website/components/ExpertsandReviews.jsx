
import React from "react";

import {
  FaArrowRight,
  FaLinkedinIn,
  FaFacebookF,
  FaCheck,
  FaStar,
  FaQuoteLeft,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

// TODO: replace with your actual mentor photo filename from the assets folder
import mentorImg from "../../Website/assets/Mentor.png";

const ExpertsAndReviews = () => {
  return (
    <>
      {/* ========================================================= */}
      {/* LEARN FROM INDUSTRY EXPERTS (own section) */}
      {/* ========================================================= */}

      <section className="w-full bg-white py-14 sm:py-0">
        <div className="max-w-full mx-auto px-5 sm:px-8 lg:px-16 xl:px-20">
          {/* ================= SECTION HEADER ================= */}
          <div className="mb-9">
            <h2 className="text-[28px] sm:text-[28px] font-bold text-[#13233F] leading-tight " >
              Learn from Industry Experts
            </h2>
            <p className="text-[12px] sm:text-[15px] text-[#64748B] mt-1">
              Get mentored by experienced traders and market professionals
            </p>
          </div>

          {/* ================= MENTOR CARD ================= */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[280px_1fr_280px] gap-8 lg:gap-16 items-start">
            {/* ================= MENTOR PHOTO ================= */}
            <div className="relative w-full max-w-[280px]">
              <div className="relative w-full h-[240px] rounded-2xl overflow-hidden">
                <img
                  src={mentorImg}
                  alt="Mr. Upendra Nimmadi"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* YEARS EXPERIENCE BADGE */}
              <div
                className="
                  absolute
                  bottom-3
                  right-3
                  bg-white
                  rounded-xl
                  px-4
                  py-2
                  shadow-lg
                  text-center
                "
              >
                <p className="text-[15px] font-bold text-[#13233F] leading-tight">
                  7+
                </p>
                <p className="text-[9px] text-[#64748B] leading-3 mt-0.5 whitespace-nowrap">
                  Years Experience
                </p>
              </div>
            </div>

            {/* ================= MENTOR INFO ================= */}
            <div className="py-[18px]">
              <h3 className="text-[20px] sm:text-[22px] font-bold text-[#13233F]">
                Mr. Upendra Nimmadi
              </h3>

              <p className="text-[12px] font-medium text-[#08A866] mt-1">
                Founder &amp; Lead Mentor
              </p>

              <p className="text-[14px] leading-5 text-[#64748B] mt-3 max-w-[580px]">
                A stock market trainer and investor with 10+ years of
                experience in trading, investing and mentoring thousands of
                learners. His practical and simplified approach has helped
                many build financial confidence.
              </p>

              {/* SOCIAL ICONS */}
              <div className="flex items-center gap-3 mt-5">
                <a
                  href="#"
                  className="
                    w-8
                    h-8
                    rounded-full
                    bg-[#E7F0FF]
                    text-[#3B82F6]
                    flex
                    items-center
                    justify-center
                    text-[12px]
                    hover:bg-[#3B82F6]
                    hover:text-white
                    transition-all
                    duration-200
                  "
                >
                  <FaLinkedinIn />
                </a>

                <a
                  href="#"
                  className="
                    w-8
                    h-8
                    rounded-full
                    bg-[#F1F5F9]
                    text-[#13233F]
                    flex
                    items-center
                    justify-center
                    text-[11px]
                    hover:bg-[#13233F]
                    hover:text-white
                    transition-all
                    duration-200
                  "
                >
                  <FaXTwitter />
                </a>

                <a
                  href="#"
                  className="
                    w-8
                    h-8
                    rounded-full
                    bg-[#E7F0FF]
                    text-[#3B82F6]
                    flex
                    items-center
                    justify-center
                    text-[12px]
                    hover:bg-[#3B82F6]
                    hover:text-white
                    transition-all
                    duration-200
                  "
                >
                  <FaFacebookF />
                </a>
              </div>
            </div>

            {/* ================= HIGHLIGHTS LIST ================= */}
            <div className="flex flex-col gap-2 lg:min-w-[280px] py-[18px]">
              {[
                "7+ years of market experience",
                "Trained 25,000+ learners across India",
                "Specialized in technical analysis & risk management",
                "Passionate about making financial education accessible",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <div
                    className="
                      w-5
                      h-5
                      rounded-md
                      bg-[#DDF8ED]
                      text-[#08A866]
                      flex
                      items-center
                      justify-center
                      text-[9px]
                      shrink-0
                      mt-0.5
                    "
                  >
                    <FaCheck />
                  </div>
                  <p className="text-[11px] sm:text-[14px] text-[#334155] leading-5">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* OUR STUDENTS SPEAK (own section) */}
      {/* ========================================================= */}

      <section className="w-full bg-[#FAFBFD] py-14 sm:py-20">
        <div className="max-w-full mx-auto px-5 sm:px-8 lg:px-16 xl:px-20">
          {/* ================= SECTION HEADER ================= */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
            <div>
              <p className="text-[9px] sm:text-[12px] font-semibold uppercase tracking-wide text-[#64748B] mb-2">
                Our Students Speak
              </p>

              <h2 className="text-[25px] sm:text-[29px] lg:text-[31px] font-bold text-[#13233F] leading-tight">
                Real Stories. Real Progress
              </h2>

              <p className="text-[11px] sm:text-[15px] text-[#64748B] mt-2">
                See how Vyntra One has helped learners achieve their
                financial goals.
              </p>
            </div>

            <button
              className="
                text-[#1769FF]
                text-[11px]
                font-semibold
                flex
                items-center
                gap-1
                hover:gap-2
                transition-all
                duration-200
                whitespace-nowrap
              "
            >
              View All Reviews
              <FaArrowRight className="text-[9px]" />
            </button>
          </div>

          {/* ================= TESTIMONIAL CARDS ================= */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                initials: "RV",
                name: "Rohit Verma",
                role: "Student",
                quote:
                  "Vyntra One made stock market learning simple and practical. The live sessions and assignments really helped me build confidence.",
                avatarBg: "bg-[#64748B]",
              },
              {
                initials: "SP",
                name: "Sneha Patil",
                role: "Working Professional",
                quote:
                  "The courses are well structured and easy to follow. I now feel confident analysing stocks and making informed decisions.",
                avatarBg: "bg-[#94A3B8]",
              },
              {
                initials: "AS",
                name: "Aman Sharma",
                role: "Aspiring Trader",
                quote:
                  "Excellent mentors and great support. The practical approach helped me apply what I learned in real market scenarios.",
                avatarBg: "bg-[#475569]",
              },
            ].map((t) => (
              <div
                key={t.name}
                className="
                  bg-white
                  border
                  border-[#E2E8F0]
                  rounded-2xl
                  p-6
                  hover:shadow-md
                  transition-all
                  duration-300
                "
              >
                <FaQuoteLeft className="text-[#08A866] text-[16px] mb-3" />

                <p className="text-[12px] leading-5 text-[#475569]">
                  {t.quote}
                </p>

                <div className="flex items-center justify-between mt-6">
                  <div className="flex items-center gap-3">
                    <div
                      className={`
                        w-9
                        h-9
                        rounded-full
                        ${t.avatarBg}
                        text-white
                        text-[11px]
                        font-semibold
                        flex
                        items-center
                        justify-center
                        shrink-0
                      `}
                    >
                      {t.initials}
                    </div>

                    <div>
                      <p className="text-[12px] font-semibold text-[#13233F]">
                        {t.name}
                      </p>
                      <p className="text-[10px] text-[#94A3B8]">{t.role}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-0.5 text-[#F59E0B] text-[11px]">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <FaStar key={i} />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default ExpertsAndReviews;