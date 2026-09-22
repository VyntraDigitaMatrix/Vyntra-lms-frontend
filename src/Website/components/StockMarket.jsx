import React from "react";
import stockMarketHero from "../../Website/assets/StockMarketHero.png";
import Navbar from "./Navbar";

// TODO: replace these with your actual filenames from the assets folder
import stockFoundationImg from "../../Website/assets/stockMarcketFoundation.png";
import technicalAnalysisImg from "../../Website/assets/FundamentalAnalysis.png";
import futuresOptionsImg from "../../Website/assets/Futureandoptions.png";
import riskManagementImg from "../../Website/assets/RiskManagement.png";

import {
  FaUserGraduate,
  FaChalkboardTeacher,
  FaChartLine,
  FaBriefcase,
  FaBookOpen,
  FaSatelliteDish,
  FaHandsHelping,
  FaArrowRight,
} from "react-icons/fa";

import ExpertsAndReviews from "../components/ExpertsandReviews";
import DemoToolAchievement from "../components/DemoToolAchievement";

const StockMarket = () => {
  return (
    <div
      className="min-h-screen bg-white"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* ================= NAVBAR ================= */}
      <Navbar />

      {/* ========================================================= */}
      {/* HERO — STOCK MARKET TRAINING IN INDIA                     */}
      {/* ========================================================= */}
      <section className="relative w-full bg-[#F8FAFC] overflow-hidden">
        {/* ================= BACKGROUND GLOWS (behind everything) ================= */}
        {/* Left Blue Ellipse */}
        <div
          className="
            absolute
            top-[80px] sm:top-[88px] lg:top-[68px]
            left-[2%] sm:left-[30%] lg:left-[11%] xl:left-[14%]
            w-[350px] sm:w-[392px]
            h-[450px] sm:h-[750px]
            rounded-full
            pointer-events-none
            z-0
          "
          style={{
            backgroundColor: "#76B3FF",
            filter: "blur(450px)",
            opacity: 0.5,
          }}
        />

        {/* Right Amber Ellipse */}
        <div
          className="
            absolute
            top-[58px]
            right-[2%] sm:right-[6%] lg:right-[11%] xl:right-[14%]
            w-[350px] sm:w-[392px]
            h-[350px] sm:h-[750px]
            bg-[#FEC453]
            rounded-full
            pointer-events-none
            z-0
          "
          style={{ filter: "blur(240px)", opacity: 0.6 }}
        />

        {/* ================= HERO CONTENT ================= */}
        <div className="relative z-10 max-w-full mx-auto px-5 sm:px-8 lg:px-16 xl:px-20 py-8 sm:py-10 lg:py-8 pb-16 sm:pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-[45%_55%] items-center">
            {/* LEFT CONTENT */}
            <div className="relative z-10 pr-2 lg:pr-3 xl:pr-4">
              {/* Small Label */}
              <div className="flex items-center gap-3 mb-7">
                <div className="w-7 h-[2px] bg-[#08A866]"></div>
                <span className="text-[9px] sm:text-[10px] font-semibold tracking-wide text-[#64748B] uppercase">
                  Stock Market Training in India
                </span>
              </div>

              {/* Heading */}
              <h1 className="text-[36px] sm:text-[43px] lg:text-[42px] xl:text-[48px] leading-[1.05] font-bold text-[#13233F]">
                Learn Stock Market
                <br />
                <span className="text-[#08A866]">
                  with Practical Training
                </span>
                <br />
                &amp; Expert Guidance
              </h1>

              {/* Description */}
              <p className="mt-6 max-w-[480px] text-[12px] sm:text-[13px] lg:text-[13px] leading-5 text-[#64748B]">
                Build your skills in trading, investing and market analysis
                with hands-on training, live market sessions and real-world
                strategies.
              </p>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mt-7">
                <button className="bg-[#08A866] text-white rounded-lg px-5 py-3 text-[12px] font-semibold flex items-center justify-center gap-2 hover:bg-[#078F5D] transition-all duration-200">
                  Book Free Demo
                  <span className="text-sm">→</span>
                </button>
                <button className="bg-white text-[#13233F] border border-[#94A3B8] rounded-lg px-6 py-3 text-[12px] font-semibold flex items-center justify-center gap-2 hover:bg-gray-50 transition-all duration-200">
                  Explore Courses
                  <span className="text-sm">→</span>
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-5 mt-9 max-w-[580px]">
                <div className="flex items-start gap-4">
                  <div className="w-7 h-7 flex items-center justify-center text-[#08A866] text-[17px] shrink-0">
                    <FaChalkboardTeacher />
                  </div>
                  <div>
                    <p className="font-bold text-[12px] text-[#13233F] leading-tight">
                      20+
                    </p>
                    <p className="text-[9px] text-[#64748B] leading-3 mt-0.5 whitespace-nowrap">
                      Years Experience
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-7 h-7 flex items-center justify-center text-[#08A866] text-[16px] shrink-0">
                    <FaUserGraduate />
                  </div>
                  <div>
                    <p className="font-bold text-[12px] text-[#13233F] leading-tight">
                      5,000+
                    </p>
                    <p className="text-[9px] text-[#64748B] leading-3 mt-0.5 whitespace-nowrap">
                      Students Trained
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-7 h-7 flex items-center justify-center text-[#08A866] text-[16px] shrink-0">
                    <FaChartLine />
                  </div>
                  <div>
                    <p className="font-bold text-[12px] text-[#13233F] leading-tight whitespace-nowrap">
                      Live Market
                    </p>
                    <p className="text-[9px] text-[#64748B] leading-3 mt-0.5">
                      Sessions
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-7 h-7 flex items-center justify-center text-[#08A866] text-[16px] shrink-0">
                    <FaBriefcase />
                  </div>
                  <div>
                    <p className="font-bold text-[12px] text-[#13233F] leading-tight whitespace-nowrap">
                      Job Ready
                    </p>
                    <p className="text-[9px] text-[#64748B] leading-3 mt-0.5">
                      Practical Skills
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT IMAGE */}
            <div className="relative w-full z-10">
              <div className="relative w-full h-[400px] sm:h-[470px] md:h-[500px] lg:h-[500px] xl:h-[520px] rounded-[22px] overflow-visible">
                <img
                  src={stockMarketHero}
                  alt="Stock Market Training"
                  className="w-full h-full object-cover rounded-[22px]"
                />

                {/* NIFTY Card */}
                <div className="absolute top-10 -left-10 sm:-left-9 lg:-left-8 bg-white rounded-xl px-4 py-3 shadow-lg z-20 min-w-[132px]">
                  <p className="text-[11px] font-bold text-[#13233F]">
                    NIFTY 24,612.30
                  </p>
                  <p className="text-[9px] font-bold text-[#08A866] mt-1">
                    +256.40 (1.05%)
                  </p>
                </div>

                {/* Learning Progress Card */}
                <div className="absolute bottom-8 -right-5 sm:-right-7 bg-white rounded-xl px-4 py-3 shadow-lg w-[178px] sm:w-[190px] z-20">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <div className="w-3.5 h-3.5 rounded-full border border-[#13233F]"></div>
                      <span className="text-[10px] font-bold text-[#13233F]">
                        65%
                      </span>
                    </div>
                    <span className="text-[8px] text-[#64748B] whitespace-nowrap">
                      Your Learning Progress
                    </span>
                  </div>

                  <p className="text-[8px] text-[#94A3B8] mt-1">
                    12/20 Modules
                  </p>

                  <div className="w-full h-1 bg-[#E2E8F0] rounded-full mt-2">
                    <div className="h-full w-[65%] bg-[#08A866] rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= WHY CHOOSE SECTION ================= */}
        <section className="w-full py-14 sm:py-0 relative z-10">
          <div className="max-w-full mx-auto px-5 sm:px-8 lg:px-16 xl:px-20">
            <div className="mb-7">
              <p className="text-[10px] sm:text-[12px] font-semibold uppercase tracking-wide text-[#64748B] mb-3">
                Why Choose Vyntra One
              </p>

              <h2 className="text-[26px] sm:text-[30px] lg:text-[32px] font-bold text-[#13233F] leading-tight">
                Why Learn Stock Market from Vyntra One?
              </h2>

              <p className="text-[11px] sm:text-[14px] text-[#64748B] mt-2">
                We make stock market education simple, practical and
                career-focused.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* CARD 1 */}
              <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 min-h-[136px] hover:shadow-md transition-all duration-300">
                <div className="w-9 h-9 rounded-lg bg-[#DDF8ED] flex items-center justify-center mb-4">
                  <FaBookOpen className="text-[#08A866] text-[16px]" />
                </div>
                <h3 className="text-[14px] font-medium text-[#13233F]">
                  Structured Curriculum
                </h3>
                <p className="text-[12px] leading-4 text-[#718096] mt-1">
                  From basics to advanced strategies, learn step by step.
                </p>
              </div>

              {/* CARD 2 */}
              <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 min-h-[136px] hover:shadow-md transition-all duration-300">
                <div className="w-9 h-9 rounded-lg bg-[#E7F0FF] flex items-center justify-center mb-4">
                  <FaSatelliteDish className="text-[#3B82F6] text-[15px]" />
                </div>
                <h3 className="text-[14px] font-medium text-[#13233F]">
                  Live Market Sessions
                </h3>
                <p className="text-[12px] leading-4 text-[#718096] mt-1">
                  Learn with real market examples and expert analysis.
                </p>
              </div>

              {/* CARD 3 */}
              <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 min-h-[136px] hover:shadow-md transition-all duration-300">
                <div className="w-9 h-9 rounded-lg bg-[#EEE8FF] flex items-center justify-center mb-4">
                  <FaHandsHelping className="text-[#8B5CF6] text-[15px]" />
                </div>
                <h3 className="text-[14px] font-medium text-[#13233F]">
                  Hands-on Practice
                </h3>
                <p className="text-[12px] leading-4 text-[#718096] mt-1">
                  Paper trading, case studies and simulation tools.
                </p>
              </div>

              {/* CARD 4 */}
              <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 min-h-[136px] hover:shadow-md transition-all duration-300">
                <div className="w-9 h-9 rounded-lg bg-[#FFF0DC] flex items-center justify-center mb-4">
                  <FaBriefcase className="text-[#F59E0B] text-[15px]" />
                </div>
                <h3 className="text-[14px] font-medium text-[#13233F]">
                  Career Support
                </h3>
                <p className="text-[12px] leading-4 text-[#718096] mt-1">
                  Get certified and access career opportunities.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================= OUR PROGRAMS ================= */}
        <section className="w-full bg-gradient-to-br py-14 sm:py-17 relative z-10">
          <div className="max-w-full mx-auto px-5 sm:px-8 lg:px-16 xl:px-20">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
              <div>
                <p className="text-[9px] sm:text-[12px] font-semibold uppercase tracking-wide text-[#64748B] mb-2">
                  Our Programs
                </p>
                <h2 className="text-[25px] sm:text-[29px] lg:text-[31px] font-bold text-[#13233F] leading-tight">
                  Stock Market Training Programs We Offer
                </h2>
                <p className="text-[11px] sm:text-[14px] text-[#64748B] mt-2">
                  Choose from our curated programs designed by industry
                  experts.
                </p>
              </div>

              <button className="text-[#1769FF] text-[11px] font-semibold flex items-center gap-1 hover:gap-2 transition-all duration-200 whitespace-nowrap">
                View All Programs
                <FaArrowRight className="text-[9px]" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* PROGRAM 1 */}
              <div className="bg-white rounded-2xl overflow-hidden border border-[#CBD5E1] hover:shadow-lg transition-all duration-300">
                <div className="relative h-[105px] overflow-hidden">
                  <img
                    src={stockFoundationImg}
                    alt="Stock Market Foundation"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-3 left-3 bg-white px-3 py-1 rounded-full text-[9px] font-semibold text-[#13233F] shadow-sm">
                    Beginner
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="text-[14px] font-medium text-[#13233F]">
                    Stock Market Foundation
                  </h3>
                  <p className="text-[12px] leading-4 text-[#718096] mt-1 min-h-[32px]">
                    Learn the basics of investing, market terminology and how
                    the market works.
                  </p>
                  <div className="flex items-center gap-3 mt-4">
                    <span className="text-[10px] text-[#64748B] flex items-center gap-1">
                      ▣ 12 Lessons
                    </span>
                    <span className="text-[10px] text-[#64748B] flex items-center gap-1">
                      ◷ 4 Weeks
                    </span>
                  </div>
                  <button className="mt-4 text-[#1769FF] text-[9px] font-semibold flex items-center gap-1 hover:gap-2 transition-all">
                    View Details
                    <FaArrowRight className="text-[8px]" />
                  </button>
                </div>
              </div>

              {/* PROGRAM 2 */}
              <div className="bg-white rounded-2xl overflow-hidden border border-[#CBD5E1] hover:shadow-lg transition-all duration-300">
                <div className="relative h-[105px] overflow-hidden">
                  <img
                    src={technicalAnalysisImg}
                    alt="Technical and Fundamental Analysis"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-3 left-3 bg-white px-3 py-1 rounded-full text-[9px] font-semibold text-[#13233F] shadow-sm">
                    Intermediate
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="text-[14px] font-medium text-[#13233F]">
                    Technical + Fundamental Analysis
                  </h3>
                  <p className="text-[12px] leading-4 text-[#718096] mt-1 min-h-[32px]">
                    Master chart patterns, indicators and company analysis.
                  </p>
                  <div className="flex items-center gap-3 mt-4">
                    <span className="text-[10px] text-[#64748B]">
                      ▣ 20 Lessons
                    </span>
                    <span className="text-[10px] text-[#64748B]">
                      ◷ 6 Weeks
                    </span>
                  </div>
                  <button className="mt-4 text-[#1769FF] text-[9px] font-semibold flex items-center gap-1 hover:gap-2 transition-all">
                    View Details
                    <FaArrowRight className="text-[8px]" />
                  </button>
                </div>
              </div>

              {/* PROGRAM 3 */}
              <div className="bg-white rounded-2xl overflow-hidden border border-[#CBD5E1] hover:shadow-lg transition-all duration-300">
                <div className="relative h-[105px] overflow-hidden">
                  <img
                    src={futuresOptionsImg}
                    alt="Futures and Options"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-3 left-3 bg-white px-3 py-1 rounded-full text-[9px] font-semibold text-[#13233F] shadow-sm">
                    Advanced
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="text-[14px] font-medium text-[#13233F]">
                    Futures &amp; Options (F&amp;O)
                  </h3>
                  <p className="text-[12px] leading-4 text-[#718096] mt-1 min-h-[32px]">
                    Understand derivatives trading strategies with real
                    examples.
                  </p>
                  <div className="flex items-center gap-3 mt-4">
                    <span className="text-[10px] text-[#64748B]">
                      ▣ 16 Lessons
                    </span>
                    <span className="text-[10px] text-[#64748B]">
                      ◷ 6 Weeks
                    </span>
                  </div>
                  <button className="mt-4 text-[#1769FF] text-[9px] font-semibold flex items-center gap-1 hover:gap-2 transition-all">
                    View Details
                    <FaArrowRight className="text-[8px]" />
                  </button>
                </div>
              </div>

              {/* PROGRAM 4 */}
              <div className="bg-white rounded-2xl overflow-hidden border border-[#CBD5E1] hover:shadow-lg transition-all duration-300">
                <div className="relative h-[105px] overflow-hidden">
                  <img
                    src={riskManagementImg}
                    alt="Professional Trading and Risk Management"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-3 left-3 bg-white px-3 py-1 rounded-full text-[9px] font-semibold text-[#13233F] shadow-sm">
                    Professional
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="text-[14px] font-medium text-[#13233F]">
                    Professional Trading &amp; Risk Management
                  </h3>
                  <p className="text-[12px] leading-4 text-[#718096] mt-1 min-h-[32px]">
                    Build advanced strategies and learn risk management for
                    long-term success.
                  </p>
                  <div className="flex items-center gap-3 mt-4">
                    <span className="text-[10px] text-[#64748B]">
                      ▣ 16 Lessons
                    </span>
                    <span className="text-[10px] text-[#64748B]">
                      ◷ 6 Weeks
                    </span>
                  </div>
                  <button className="mt-4 text-[#1769FF] text-[9px] font-semibold flex items-center gap-1 hover:gap-2 transition-all">
                    View Details
                    <FaArrowRight className="text-[8px]" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
        <ExpertsAndReviews />
      <DemoToolAchievement />
      </section>

      
    </div>
  );
};

export default StockMarket;