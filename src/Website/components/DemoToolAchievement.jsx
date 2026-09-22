import React from "react";
import {
  FaCheckCircle,
  FaArrowRight,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaStar,
  FaCheck,
} from "react-icons/fa";

// Background image already saved in assets
import takeFirstStepBg from "../../Website/assets/TakeTheFirstStep_BG.png";

// TODO: confirm these match your actual saved filenames in the assets folder
import tradingViewLogo from "../../Website/assets/TradingView.png";
import zerodhaLogo from "../../Website/assets/Zerodha.png";
import nseLogo from "../../Website/assets/NSE.png";
import bseLogo from "../../Website/assets/BSE.png";
import screenerLogo from "../../Website/assets/Screener.png";
import moneycontrolLogo from "../../Website/assets/Moneycontrol.png";
import growwLogo from "../../Website/assets/Groww.png";
import upstoxLogo from "../../Website/assets/upstox.png";
import sensibullLogo from "../../Website/assets/Sensibull.png";
import tickertapeLogo from "../../Website/assets/TickerTape.png";
import bloombergLogo from "../../Website/assets/Bloomberg.png";
import investingLogo from "../../Website/assets/Investing.com.png";

const DemoToolAchievement = () => {
  const tools = [
    {  logo: tradingViewLogo },
    {  logo: zerodhaLogo },
    { logo: nseLogo },
    { logo: bseLogo },
    {  logo: screenerLogo },
    {  logo: moneycontrolLogo },
    {  logo: growwLogo },
    { logo: upstoxLogo },
    { logo: sensibullLogo },
    {  logo: tickertapeLogo },
    {  logo: bloombergLogo },
    {  logo: investingLogo },
  ];

  const achievements = [
    {
      icon: <FaUserGraduate className="text-[#08A866] text-[18px]" />,
      value: "25K+",
      label: "Students Trained",
    },
    {
      icon: <FaChalkboardTeacher className="text-[#08A866] text-[18px]" />,
      value: "500+",
      label: "Live Classes Conducted",
    },
    {
      icon: <FaStar className="text-[#08A866] text-[18px]" />,
      value: "4.8/5",
      label: "Average Rating",
    },
    {
      icon: <FaCheck className="text-[#08A866] text-[18px]" />,
      value: "90%",
      label: "Apply Learnings in Real Life",
    },
  ];

  return (
    <>
      {/* ========================================================= */}
      {/* TAKE THE FIRST STEP (own section) */}
      {/* ========================================================= */}
      <section className="w-full bg-white py-12 sm:py-08">
        <div className="max-w-[1500px] mx-auto px-5 py-4 sm:px-8 lg:px-12 xl:px-16">
  <div
    className="
      relative
      w-full
      h-[320px]
      sm:h-[360px]
      lg:h-[400px]
      rounded-[22px]
      overflow-hidden
    "
    style={{
      backgroundImage: `url(${takeFirstStepBg})`,
      backgroundSize: "100% 100%",
      backgroundPosition: "center",
    }}
  >
            <div
              className="
                grid
                grid-cols-1
                lg:grid-cols-2
                gap-6
                lg:gap-4
                items-left
                p-6
                sm:p-6
                lg:p-10
              "
            >
              {/* ================= LEFT CONTENT ================= */}
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-7 h-[2px] bg-white/60"></div>
                  <span
                    className="
                      text-[9px]
                      sm:text-[10px]
                      font-semibold
                      tracking-wide
                      text-white/70
                      uppercase
                    "
                  >
                    Take the First Step
                  </span>
                </div>

                <h2
                  className="
                    text-[24px]
                    sm:text-[30px]
                    lg:text-[32px]
                    font-bold
                    text-white
                    leading-tight
                  "
                >
                  Start Your Stock Market
                  <br />
                  Learning Journey
                </h2>

                <p
                  className="
                    text-[12px]
                    sm:text-[13px]
                    leading-5
                    text-white/70
                    mt-4
                    max-w-[380px]
                  "
                >
                  Book a free demo session and get guidance on the right
                  learning path for you.
                </p>

                <div className="flex flex-col gap-3 mt-6">
                  {[
                    "Free 1:1 Guidance Session",
                    "Course Recommendations",
                    "Clarify Doubts with Experts",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-3">
                      <FaCheckCircle className="text-[#08A866] text-[14px] shrink-0" />
                      <p className="text-[12px] sm:text-[13px] text-white/90">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* ================= RIGHT FORM ================= */}
              <div className="relative z-10 w-full max-w-[480px] mx-auto lg:mx-0 lg:ml-auto right-[50%]">
  <div
    className="
      bg-white
      rounded-2xl
      shadow-2xl
      p-5
      sm:p-6

      
    "
  >
    <h3 className="text-[15px] sm:text-[16px] font-bold text-[#13233F] mb-3">
      Book a Free Demo Session
    </h3>

    <div className="flex flex-col gap-2.5">
      <input
        type="text"
        placeholder="Full Name"
        className="
          w-full
          border
          border-[#E2E8F0]
          rounded-lg
          px-3
          py-2
          text-[12px]
          text-[#13233F]
          placeholder:text-[#94A3B8]
          focus:outline-none
          focus:border-[#08A866]
        "
      />

      <input
        type="email"
        placeholder="Email Address"
        className="
          w-full
          border
          border-[#E2E8F0]
          rounded-lg
          px-3
          py-2
          text-[12px]
          text-[#13233F]
          placeholder:text-[#94A3B8]
          focus:outline-none
          focus:border-[#08A866]
        "
      />

      <div className="grid grid-cols-[80px_1fr] gap-2">
        <input
          type="text"
          defaultValue="+91 IND"
          className="
            w-full
            border
            border-[#E2E8F0]
            rounded-lg
            px-2
            py-2
            text-[12px]
            text-[#13233F]
            focus:outline-none
            focus:border-[#08A866]
          "
        />

        <input
          type="tel"
          placeholder="Phone Number"
          className="
            w-full
            border
            border-[#E2E8F0]
            rounded-lg
            px-3
            py-2
            text-[12px]
            text-[#13233F]
            placeholder:text-[#94A3B8]
            focus:outline-none
            focus:border-[#08A866]
          "
        />
      </div>

      <textarea
        placeholder="Write Your Query Here..."
        rows={1}
        className="
          w-full
          border
          border-[#E2E8F0]
          rounded-lg
          px-3
          py-2
          text-[12px]
          text-[#13233F]
          placeholder:text-[#94A3B8]
          resize-none
          focus:outline-none
          focus:border-[#08A866]
        "
      />

      <button
        className="
          w-full
          bg-[#08A866]
          text-white
          rounded-lg
          py-2.5
          text-[12px]
          font-semibold
          flex
          items-center
          justify-center
          gap-2
          hover:bg-[#078F5D]
          transition-all
          duration-200
        "
      >
        Book Free Demo
        <FaArrowRight className="text-[10px]" />
      </button>

      <p className="text-[10px] text-[#94A3B8] text-center mt-0.5">
        No spam. Just a free learning session.
      </p>
    </div>
  </div>
</div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* TOOLS WE COVER (own section) */}
      {/* ========================================================= */}

      <section className="w-full bg-white py-14 sm:py-16">
        <div className="max-w-full mx-auto px-5 sm:px-8 lg:px-16 xl:px-20">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
            <div>
              <p className="text-[9px] sm:text-[12px] font-semibold uppercase tracking-wide text-[#64748B] mb-2">
                Tools We Cover
              </p>

              <h2 className="text-[22px] sm:text-[26px] lg:text-[28px] font-bold text-[#13233F] leading-tight">
                Tools We Cover in Stock Market Training
              </h2>

              <p className="text-[11px] sm:text-[16px] text-[#64748B] mt-2">
                Get hands-on experience with industry-leading tools and
                platforms.
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
              View All Tools
              <FaArrowRight className="text-[9px]" />
            </button>
          </div>

          <div
            className="
              grid
              grid-cols-2
              sm:grid-cols-3
              lg:grid-cols-6
              gap-3
            "
          >
            {tools.map((tool) => (
              <div
                key={tool.name}
                className="
                  border
                  border-[#E2E8F0]
                  rounded-xl
                  px-4
                  py-4
                  flex
                  items-center
                  justify-center
                  gap-2
                  hover:border-[#08A866]
                  hover:shadow-sm
                  transition-all
                  duration-200
                "
              >
                <img
                  src={tool.logo}
                  alt={tool.name}
                  className="h-[16px] w-auto object-contain"
                />
                <span className="text-[11px] sm:text-[12px] font-semibold text-[#13233F] whitespace-nowrap">
                  {tool.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* OUR ACHIEVEMENTS (own section) */}
      {/* ========================================================= */}

      <section className="w-full bg-[#FAFBFD] py-14 sm:py-16">
        <div className="max-w-full mx-auto px-5 sm:px-8 lg:px-16 xl:px-20">
          <div className="mb-8">
            <p className="text-[9px] sm:text-[12px] font-semibold uppercase tracking-wide text-[#08A866] mb-2">
              Our Achievements
            </p>

            <p className="text-[12px] sm:text-[16px] text-[#64748B]">
              Trusted by thousands of learners across India.
            </p>
          </div>

          <div
            className="
              grid
              grid-cols-2
              lg:grid-cols-4
              gap-4
            "
          >
            {achievements.map((item) => (
              <div
                key={item.label}
                className="
                  bg-white
                  border
                  border-[#E2E8F0]
                  rounded-xl
                  p-5
                  flex
                  items-center
                  gap-3
                  hover:shadow-md
                  transition-all
                  duration-300
                "
              >
                <div
                  className="
                    w-9
                    h-9
                    rounded-lg
                    bg-[#DDF8ED]
                    flex
                    items-center
                    justify-center
                    shrink-0
                  "
                >
                  {item.icon}
                </div>

                <div>
                  <p className="text-[16px] sm:text-[18px] font-bold text-[#13233F] leading-tight">
                    {item.value}
                  </p>
                  <p className="text-[10px] sm:text-[11px] text-[#64748B] mt-0.5">
                    {item.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default DemoToolAchievement;