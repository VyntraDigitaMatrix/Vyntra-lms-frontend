import React, { useEffect, useState, useRef } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import blogDetailImg from "./assets/Blog-Details.png.jpg";
import priyaImg from "./assets/Priya-Sharma.png";
import moreInfo1 from "./assets/More-info-1.png";
import moreInfo2 from "./assets/More-info-2.png";
import moreInfo3 from "./assets/More-info-3.png";
import featuredStory2 from "./assets/Featured-Story-2.png";
import article1 from "./assets/Article-1.png";
import article2 from "./assets/Article-2.png";
import article3 from "./assets/Article-3.png";
import article4 from "./assets/Article-4.png";
import "./index.css";

const relatedBlogsData = [
  {
    id: 1,
    category: "Learning",
    title: "The Power of Live Learning: Why It Works",
    date: "Mar 4, 2025",
    readTime: "5 min read",
    image: article1,
  },
  {
    id: 2,
    category: "Student Stories",
    title: "From Learner to Marketer: A Vyntra One Success Story",
    date: "Mar 2, 2025",
    readTime: "6 min read",
    image: article2,
  },
  {
    id: 3,
    category: "Technology",
    title: "Full Stack vs. Data Analytics: Which Career Path Is Right for You?",
    date: "Feb 28, 2025",
    readTime: "7 min read",
    image: article3,
  },
  {
    id: 4,
    category: "Technology",
    title: "How to Build a Simple Investment Strategy",
    date: "Feb 25, 2025",
    readTime: "6 min read",
    image: article4,
  },
];

const relatedArticles = [
  {
    id: 1,
    title: "10 Python Projects That Will Boost Your Portfolio",
    date: "Mar 8, 2025",
    readTime: "7 min read",
    image: featuredStory2,
  },
  {
    id: 2,
    title: "How to Prepare for Tech Interviews in 2025",
    date: "Mar 5, 2025",
    readTime: "6 min read",
    image: moreInfo1,
  },
  {
    id: 3,
    title: "Top 5 Mutual Funds for Long-Term Growth",
    date: "Feb 28, 2025",
    readTime: "6 min read",
    image: moreInfo2,
  },
  {
    id: 4,
    title: "Risk Management Strategies for Beginner Traders",
    date: "Feb 20, 2025",
    readTime: "6 min read",
    image: moreInfo3,
  },
];

const keyTerms = [
  {
    title: "Share",
    desc: "A unit of ownership in a company.",
    icon: (
      <svg className="w-5 h-5 text-[#8B5CF6]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
      </svg>
    ),
    bg: "bg-[#F0EBFF]",
  },
  {
    title: "Stock Exchange",
    desc: "A platform where shares are bought and sold (e.g., NSE, BSE).",
    icon: (
      <svg className="w-5 h-5 text-[#10B981]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    ),
    bg: "bg-[#E6F8F0]",
  },
  {
    title: "Dividend",
    desc: "A portion of company profits distributed to shareholders.",
    icon: (
      <svg className="w-5 h-5 text-[#F59E0B]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    bg: "bg-[#FFF1DF]",
  },
  {
    title: "Market Capitalization",
    desc: "The total value of a company's outstanding shares.",
    icon: (
      <svg className="w-5 h-5 text-[#6366F1]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    bg: "bg-[#F0EBFF]",
  },
  {
    title: "Bull Market",
    desc: "A period of rising prices.",
    icon: (
      <svg className="w-5 h-5 text-[#10B981]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
    bg: "bg-[#E6F8F0]",
  },
  {
    title: "Bear Market",
    desc: "A period of falling prices.",
    icon: (
      <svg className="w-5 h-5 text-[#EF4444]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
      </svg>
    ),
    bg: "bg-[#FFF0F0]",
  },
];

const tocItems = [
  "What is the Stock Market?",
  "Key Terms You Should Know",
  "Why Invest in the Stock Market?",
  "How to Get Started",
  "Common Mistakes to Avoid",
  "Final Thoughts",
];

const BlogDetail = () => {
  const [activeToc, setActiveToc] = useState(0);
  const [email, setEmail] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const stickyRef = useRef(null);
  const [stickyTopValue, setStickyTopValue] = useState(96);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Calculate sticky top so the entire sidebar scrolls until Card 6 is visible, then stops
  useEffect(() => {
    const calculateStickyTop = () => {
      const isLg = window.innerWidth >= 1024;
      if (stickyRef.current && isLg) {
        const stickyHeight = stickyRef.current.offsetHeight;
        const viewportHeight = window.innerHeight;
        const bottomPadding = 24; // px from bottom of viewport
        if (stickyHeight > viewportHeight - 96) {
          // Container is taller than viewport: use negative top so bottom aligns with viewport bottom
          setStickyTopValue(-(stickyHeight - viewportHeight + bottomPadding));
        } else {
          setStickyTopValue(96); // fits in viewport, pin at top-24
        }
      }
    };

    calculateStickyTop();
    window.addEventListener('resize', calculateStickyTop);
    return () => window.removeEventListener('resize', calculateStickyTop);
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      alert("Thank you for subscribing!");
      setEmail("");
    }
  };

  return (
    <div className="website-homepage-scope font-sans antialiased text-gray-900 bg-white min-h-screen flex flex-col">
      {/* Navigation */}
      <Navbar />

      {/* Main Container */}
      <main className="flex-grow max-w-full w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-20 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 relative">

          {/* LEFT COLUMN: Main Article Content (lg:col-span-8) */}
          <article className="lg:col-span-8">

            {/* Category Tag */}
            <span
              className="inline-block px-3 py-2 rounded-full bg-[#E6F8F0] mb-3"
              style={{ fontFamily: "Inter", fontWeight: 700, fontSize: "12px", color: "#0B9867" }}
            >
              Stock Market
            </span>

            {/* Article Main Title */}
            <h1
              className="mb-4"
              style={{ fontFamily: "Inter", fontWeight: 700, fontSize: "39px", color: "#10213A" }}
            >
              Understanding Stock Market Basics: A Beginner’s Guide
            </h1>

            {/* Sub-description */}
            <p
              className="mb-6"
              style={{ fontFamily: "Inter", fontWeight: 400, fontStyle: "Regular", fontSize: "15px", color: "#62728A" }}
            >
              A simple and practical introduction to the stock market, how it works, key terms you should know, and how to start your investing journey with confidence.
            </p>

            {/* Author & Share Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 py-3 border-y border-[#F0F4F8] mb-6">
              <div className="flex items-center gap-3">
                <img
                  src={priyaImg}
                  alt="Priya Sharma"
                  className="w-10 h-10 rounded-full object-cover shrink-0 border border-gray-200"
                />
                <div>
                  <p className="text-[#071424] font-semibold text-[13px] leading-tight" style={{ fontFamily: "Inter", fontWeight: 700, fontSize: "12px", color: "#17253B" }}>
                    By Priya Sharma
                  </p>
                  <p style={{ fontFamily: "Inter", fontWeight: 400, fontSize: "10px", color: "#738096" }}>
                    Mar 10, 2025 &nbsp;&middot;&nbsp; 6 min read
                  </p>
                </div>
              </div>

              {/* Share & Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsLiked(!isLiked)}
                  className={`w-9 h-9 rounded-full border border-[#E2E8F0] flex items-center justify-center transition-colors ${isLiked ? "bg-red-50 text-red-500 border-red-200" : "bg-white text-gray-500 hover:bg-gray-50"
                    }`}
                  aria-label="Like post"
                >
                  <svg className="w-4 h-4" fill={isLiked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
                <button
                  onClick={() => setIsBookmarked(!isBookmarked)}
                  className={`w-9 h-9 rounded-full border border-[#E2E8F0] flex items-center justify-center transition-colors ${isBookmarked ? "bg-blue-50 text-blue-600 border-blue-200" : "bg-white text-gray-500 hover:bg-gray-50"
                    }`}
                  aria-label="Save post"
                >
                  <svg className="w-4 h-4" fill={isBookmarked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                </button>
                <span className="text-[#8190A2] text-[12px] font-medium ml-1 mr-1" style={{ fontFamily: "Inter" }}>
                  Share
                </span>
                <button className="w-8 h-8 rounded-full bg-[#E8F0FE] text-[#1B6EF3] flex items-center justify-center font-bold text-[12px] hover:bg-blue-100 transition-colors">
                  in
                </button>
                <button className="w-8 h-8 rounded-full bg-[#F0F4F8] text-[#071424] flex items-center justify-center font-bold text-[12px] hover:bg-gray-200 transition-colors">
                  x
                </button>
                <button className="w-8 h-8 rounded-full bg-[#E8F0FE] text-[#1B6EF3] flex items-center justify-center font-bold text-[12px] hover:bg-blue-100 transition-colors">
                  f
                </button>
              </div>
            </div>

            {/* Featured Blog Image */}
            <div className="w-full rounded-[20px] overflow-hidden mb-8 shadow-xs border border-[#EAEEF2]">
              <img
                src={blogDetailImg}
                alt="Stock Market Basics"
                className="w-full h-auto object-cover max-h-[440px]"
              />
            </div>

            {/* Intro Paragraph */}
            <p className="mb-6" style={{ fontFamily: "Inter", fontWeight: 400, fontStyle: "Regular", fontSize: "14px", color: "#586981" }}>
              The stock market often feels like a complicated world filled with charts, numbers and jargon. But at its core, it's a simple idea — a place where people buy and sell shares of companies to build wealth over time. In this guide, we'll break down the basics of the stock market in a clear and easy-to-understand way, so you can start your journey with confidence.
            </p>

            {/* Section 1: What is the Stock Market? */}
            <section id="section-1" className="mb-8">
              <h2
                className="text-[#071424] font-bold text-[22px] sm:text-[24px] mb-3"
                style={{ fontFamily: "Inter", fontWeight: 400, fontSize: "23px", color: "#11213A" }}
              >
                What is the Stock Market?
              </h2>
              <p className="mb-5" style={{ fontFamily: "Inter", fontWeight: 400, fontSize: "14px", color: "#586981", fontStyle: "Regular" }}>
                The stock market is a marketplace where shares of publicly listed companies are bought and sold. When you buy a share, you own a small piece of that company. If the company grows, the value of your share can increase, and you can make a profit.
              </p>

              {/* Quote Callout Box */}
              <div className="rounded-xl p-5 my-6 flex items-start gap-4"
                style={{
                  background:
                    "linear-gradient(130.1deg, #F4F9FF 14.74%, rgba(229, 240, 255, 0.7) 85.26%)",
                }}>
                <div className="w-9 h-9 rounded-full bg-[#FFFFFF] flex items-center justify-center shrink-0 text-[#13A16D] mt-0.5">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                </div>
                <div>
                  <p className="text-[#071424] font-semibold text-[15px] leading-snug mb-1" style={{ fontFamily: "Inter", fontWeight: 700, fontStyle: "Bold", fontSize: "14px", color: "#1671C8" }}>
                    "Investing is not about timing the market, but about time in the market."
                  </p>
                  <span className="text-[#64748B] text-[12.5px] font-medium" style={{ fontFamily: "Inter", fontWeight: 400, fontStyle: "Regular", fontSize: "11px", color: "#67758B" }}>
                    &mdash; Warren Buffett
                  </span>
                </div>
              </div>
            </section>

            {/* Section 2: Key Terms You Should Know */}
            <section id="section-2" className="mb-8">
              <h2 className="mb-2" style={{ fontFamily: "Inter", fontWeight: 400, fontSize: "23px", color: "#11213A" }}>
                Key Terms You Should Know
              </h2>
              <p className="mb-5" style={{ fontFamily: "Inter", fontWeight: 400, fontSize: "14px", color: "#586981", fontStyle: "Regular" }}>
                Before you start investing, here are some important terms to understand:
              </p>

              {/* 2x3 Grid of Key Terms Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {keyTerms.map((term, index) => (
                  <div
                    key={index}
                    className="bg-[#F8FAFC] rounded-[16px] p-4 flex items-start gap-3.5 hover:shadow-xs transition-shadow"
                  >
                    <div className={`w-9 h-9 rounded-full ${term.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                      {term.icon}
                    </div>
                    <div>
                      <h3 className="text-[#071424] font-bold text-[14.5px] mb-0.5" style={{ fontFamily: "Inter", fontWeight: 700, fontStyle: "Bold", fontSize: "12px", color: "#17253B" }}>
                        {term.title}
                      </h3>
                      <p className="text-[#64748B] text-[12.5px] leading-[1.4]" style={{ fontFamily: "Inter", fontWeight: 400, fontStyle: "Regular", fontSize: "10px", color: "#6D7A90" }}>
                        {term.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 3: Why Invest in the Stock Market? */}
            <section id="section-3" className="mb-8">
              <h2 className="mb-2" style={{ fontFamily: "Inter", fontWeight: 400, fontSize: "23px", color: "#11213A", fontStyle: "Regular", color: "#11213A" }}>
                Why Invest in the Stock Market?
              </h2>
              <p className="mb-4" style={{ fontFamily: "Inter", fontWeight: 400, fontSize: "14px", color: "#586981", fontStyle: "Regular" }}>
                Investing in the stock market can help you:
              </p>

              <div className="flex flex-col gap-3">
                {[
                  "Build long-term wealth",
                  "Beat inflation",
                  "Achieve financial goals (like buying a house, higher education, or retirement)",
                  "Gain partial ownership in successful companies",
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#10B981] flex items-center justify-center text-white text-[11px] font-bold shrink-0">
                      ✓
                    </div>
                    <span style={{ fontFamily: "Inter", fontWeight: 400, fontStyle: "Regular", fontSize: "13px", color: "#53647D" }}>
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 4: How to Get Started */}
            <section id="section-4" className="mb-8">
              <h2 className="mb-5" style={{ fontFamily: "Inter", fontWeight: 400, fontSize: "23px", color: "#11213A", fontStyle: "Regular" }}>
                How to Get Started
              </h2>

              <div className="relative flex flex-col gap-7 pl-1">
                {[
                  {
                    step: 1,
                    title: "Open a Demat and Trading Account",
                    desc: "Choose a trusted and SEBI-registered broker.",
                  },
                  {
                    step: 2,
                    title: "Learn and Research",
                    desc: "Start by learning the basics and analysing companies.",
                  },
                  {
                    step: 3,
                    title: "Invest Small",
                    desc: "Begin with a small amount and invest in well-known, stable companies.",
                  },
                  {
                    step: 4,
                    title: "Stay Consistent",
                    desc: "Invest regularly and think long-term.",
                  },
                ].map((st, idx, arr) => (
                  <div key={st.step} className="relative flex items-start gap-4">
                    {/* Vertical Connecting Line between steps */}
                    {idx < arr.length - 1 && (
                      <span
                        className="absolute left-[19px] top-[38px] bottom-[-28px] w-[2px] bg-[#DCE7F8]"
                        aria-hidden="true"
                      />
                    )}
                    <div className="w-10 h-10 rounded-full bg-[#EAF1FF] text-[#1763CE] font-bold text-[15px] flex items-center justify-center shrink-0 z-10">
                      {st.step}
                    </div>
                    <div className="pt-0.5">
                      <h3 style={{ fontFamily: "Inter", fontWeight: 700, fontSize: "14px", color: "#17253B", fontStyle: "Bold" }}>
                        {st.title}
                      </h3>
                      <p style={{ fontFamily: "Inter", fontWeight: 400, fontSize: "12px", color: "#708096", fontStyle: "Regular", marginTop: "2px" }}>
                        {st.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Bottom Callout Banner */}
            <div className="bg-[#E9FAF3] border border-[#CCEFE0] rounded-[20px] p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-8">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#21A45E] shrink-0 shadow-xs">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div>
                  <h4 style={{ fontFamily: "Inter", fontWeight: 700, fontSize: "13px", color: "#0C9865" }}>
                    Your investing journey starts with a single step.
                  </h4>
                  <p style={{ fontFamily: "Inter", fontWeight: 400, fontSize: "10px", color: "#668177" }}>
                    Explore Vyntra One's Stock Market Program and learn with experts.
                  </p>
                </div>
              </div>
              <button
                onClick={() => (window.location.href = "/UserLogin")}
                className="bg-[#08A66B] hover:bg-[#1b8a4e] px-5 py-2.5 rounded-full transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer shadow-xs"
                style={{ fontFamily: "Inter", fontWeight: 700, fontSize: "11px", color: "#FFFFFF", fontStyle: "Bold" }}
              >
                <span>Explore Programs</span>
                <span>&rarr;</span>
              </button>
            </div>

          </article>

          {/* RIGHT SIDEBAR COLUMN (lg:col-span-4) */}
          <aside className="lg:col-span-4 flex flex-col gap-6">

            {/* Author & TOC: Scroll naturally with content */}
            <div className="flex flex-col gap-6">
              {/* Card 1: Author Card */}
              <div className="bg-[#F7F9FC] border-[1px] border-[#EEF1F5] rounded-[20px] p-6 text-center shadow-xs">
                <img
                  src={priyaImg}
                  alt="Priya Sharma"
                  className="w-18 h-18 rounded-full object-cover mx-auto mb-3.5 border-2 border-white shadow-sm"
                />
                <h3 className="mb-0.5" style={{ fontFamily: "Inter", fontWeight: 500, fontSize: "15px", color: "#15253E", fontStyle: "Medium" }}>
                  Priya Sharma
                </h3>
                <p className="mb-3" style={{ fontFamily: "Inter", fontWeight: 400, fontSize: "11px", color: "#5F6F85", fontStyle: "Medium" }}>
                  Content Creator &amp; Educator
                </p>
                <p className="mb-4" style={{ fontFamily: "Inter", fontWeight: 400, fontSize: "10px", color: "#66758B", fontStyle: "Regular" }}>
                  Priya loves simplifying complex topics in finance and technology. At Vyntra One, she creates content that helps learners build real-world skills for a brighter future.
                </p>
                <div className="flex items-center justify-center gap-3 text-gray-500">
                  <a href="#linkedin" className="w-7 h-7 rounded-full bg-white border border-[#E2E8F0] flex items-center justify-center text-[12px] font-bold text-[#0077B5] hover:scale-105 transition-transform">in</a>
                  <a href="#twitter" className="w-7 h-7 rounded-full bg-white border border-[#E2E8F0] flex items-center justify-center text-[12px] font-bold text-red-500 hover:scale-105 transition-transform">&hearts;</a>
                  <a
                    href="#youtube"
                    className="w-8 h-8 rounded-full bg-white border border-[#E2E8F0] flex items-center justify-center hover:scale-105 transition-transform"
                  >
                    <svg
                      className="w-4 h-4 text-red-600"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Card 2: Table of Contents */}
              <div className="bg-[#F7F9FC] border-[1px] border-[#EEF1F5] rounded-[20px] p-5 shadow-xs">
                <h3 className="mb-4" style={{ fontFamily: "Inter", fontWeight: 600, fontSize: "18px", color: "#14243C" }}>
                  Table of Contents
                </h3>
                <ul className="flex flex-col gap-1">
                  {tocItems.map((item, index) => (
                    <li key={index}>
                      <button
                        onClick={() => setActiveToc(index)}
                        className={`w-full text-left transition-all duration-200 ${activeToc === index
                          ? "bg-white border-l-[4px] border-[#0AB278] pl-4 pr-3 py-3 font-bold text-[#17253B] shadow-2xs rounded-r-md"
                          : "text-[#5D638D] hover:text-[#071424] hover:bg-white/50 px-3 py-2 text-[13px] font-normal flex items-center gap-2"
                          }`}
                        style={{ fontFamily: "Inter" }}
                      >
                        {activeToc === index ? (
                          <span className="text-[13.5px]" style={{ fontWeight: 700, color: "#071424" }}>
                            {item}
                          </span>
                        ) : (
                          <>
                            <span className="text-[14px] text-[#94A3B8] font-bold select-none">&middot;</span>
                            <span className="text-[13px]">{item}</span>
                          </>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Sticky Container: Sticks while left content continues scrolling */}
            <div
              ref={stickyRef}
              className="flex flex-col gap-6 lg:sticky"
              style={{ top: `${stickyTopValue}px` }}
            >
              {/* Card 3: Related Articles */}
              <div className="bg-[#F7F9FC] border border-[#EEF1F5] rounded-[20px] p-5 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <h3 style={{ fontFamily: "Inter", fontWeight: 400, fontSize: "16px", color: "#14243C", fontStyle: "Regular" }}>
                    Related Articles
                  </h3>
                  <a
                    href="/blogs"
                    className="text-[#1677ED] font-semibold text-[12px] hover:underline"
                    style={{ fontFamily: "Inter", fontWeight: 700, fontSize: "10px", color: "#2878DC" }}
                  >
                    View All &rarr;
                  </a>
                </div>

                <div className="flex flex-col gap-3.5">
                  {relatedArticles.map((art) => (
                    <div
                      key={art.id}
                      onClick={() => (window.location.href = "/blog-detail")}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <div className="w-[68px] h-[52px] rounded-[10px] overflow-hidden shrink-0 bg-gray-100">
                        <img
                          src={art.image}
                          alt={art.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4
                          className="line-clamp-2 group-hover:text-[#1677ED] transition-colors"
                          style={{ fontFamily: "Inter", fontWeight: 700, fontSize: "11px", color: "#17253B" }}
                        >
                          {art.title}
                        </h4>
                        <p className="mt-0.5" style={{ fontFamily: "Inter", fontWeight: 400, fontSize: "9px", color: "#8290A3", fontStyle: "Regular" }}>
                          {art.date} &nbsp;&middot;&nbsp; {art.readTime}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card 4: Newsletter Card */}
              <div
                className="rounded-[22px] p-6 text-white shadow-md relative overflow-hidden"
                style={{ background: "linear-gradient(180deg, #083F82 20%, #0758AC 80%)" }}
              >
                <div className="flex items-center gap-1.5 mb-2 text-[10px] font-bold tracking-widest text-white/80 uppercase" style={{ fontFamily: "Inter", fontWeight: 700, fontSize: "10px", color: "#D8E7FA", fontStyle: "Bold" }}>
                  <span>—</span>
                  <span>STAY UPDATED</span>
                </div>
                <h3 className="text-white font-bold text-[22px] leading-tight mb-2" style={{ fontFamily: "Inter" }}>
                  Join our newsletter
                </h3>
                <p className="text-[#DCEEFF] text-[11px] leading-[1.5] mb-5" style={{ fontFamily: "Inter" }}>
                  Get the latest articles, learning tips and career opportunities from Vyntra One.
                </p>

                <form onSubmit={handleSubscribe} className="relative">
                  <div className="bg-white rounded-full p-1.5 flex items-center shadow-xs">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                      className="w-full bg-transparent text-[13px] px-3.5 py-1 text-gray-800 placeholder-gray-400 focus:outline-none"
                      style={{ fontFamily: "Inter" }}
                    />
                    <button
                      type="submit"
                      className="bg-[#FFAD1A] hover:bg-[#e09912] text-white px-4 py-1.5 rounded-full font-bold text-[12px] transition-colors shrink-0 flex items-center gap-1 cursor-pointer"
                      style={{ fontFamily: "Inter" }}
                    >
                      <span>Subscribe</span>
                      <span>&rarr;</span>
                    </button>
                  </div>
                </form>

                <div className="mt-3 flex items-center gap-1 text-[11px] text-white/75" style={{ fontFamily: "Inter" }}>
                  <span>&check;</span>
                  <span>No spam. Unsubscribe anytime.</span>
                </div>
              </div>

              {/* Card 5: Tags */}
              <div className="bg-[#F7F9FC] border border-[#EEF1F5] rounded-[20px] p-5 shadow-xs">
                <h3 className="mb-3" style={{ fontFamily: "Inter", fontWeight: 400, fontSize: "16px", color: "#14243C", fontStyle: "Regular" }}>
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    { name: "Stock Market", active: true },
                    { name: "Investing", active: false },
                    { name: "Beginner Guide", active: false },
                    { name: "Personal Finance", active: false },
                    { name: "Wealth Building", active: false },
                    { name: "Trading Basics", active: false },
                  ].map((tg, idx) => (
                    <span
                      key={idx}
                      className={`px-3 py-1.5 rounded-lg text-[11.5px] font-medium cursor-pointer transition-colors ${tg.active
                        ? "bg-[#E6FAF4] text-[#00916E] font-semibold"
                        : "bg-white text-[#475467] border border-[#E2E8F0] hover:bg-gray-100"
                        }`}
                      style={{ fontFamily: "Inter" }}
                    >
                      {tg.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card 6: Learn Stock Market */}
              <div className="border border-[#DCE8FA] rounded-[20px] p-5 shadow-xs"
                style={{ background: "linear-gradient(180deg, #EDF4FF 20%, #F4F7FF 80%)" }}>
                <h3 className="mb-1.5" style={{ fontFamily: "Inter", fontWeight: 400, fontSize: "14px", color: "#1660BF" }}>
                  Learn Stock Market with Expert Guidance
                </h3>
                <p className="mb-4" style={{ fontFamily: "Inter", fontWeight: 400, fontSize: "10px", color: "#68788F", fontStyle: "Regular" }}>
                  Join our structured program with live sessions, practical assignments and real market insights.
                </p>
                <button
                  onClick={() => (window.location.href = "/UserLogin")}
                  className="bg-[#09284D] hover:bg-[#111927] px-4 py-2 rounded-full transition-colors cursor-pointer"
                  style={{ fontFamily: "Inter", fontWeight: 700, fontSize: "10px", color: "#FFFFFF", fontStyle: "Bold" }}
                >
                  Explore Course &rarr;
                </button>
              </div>
            </div>

          </aside>

        </div>
      </main>

      {/* Related Blogs Section (Single Row of 4 Cards) */}
      <section className="w-full py-10 sm:py-8 bg-white mb-10">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-20">
          <h2
            className="text-[#071424] mb-6 sm:mb-8"
            style={{ fontFamily: "Gilroy-SemiBold, Inter, sans-serif", fontWeight: 400, fontSize: "25px", color: "#071424" }}
          >
            Related Blogs
          </h2>

          {/* 4-column single row grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {relatedBlogsData.map((blog) => (
              <div
                key={blog.id}
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="bg-white rounded-[20px] border border-[#ACACAC] p-3 sm:p-3.5 flex flex-col justify-between cursor-pointer group hover:shadow-md transition-shadow duration-300"
              >
                <div>
                  {/* Image Container with Pill Badge */}
                  <div className="relative w-full aspect-[268/160] rounded-[14px] overflow-hidden mb-3.5 bg-gray-100">
                    <img
                      src={blog.image}
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span
                      className="absolute top-2.5 left-2.5 px-3 py-1 bg-white/95 backdrop-blur-sm rounded-full text-[11px] font-semibold text-[#071424] shadow-xs"
                      style={{ fontFamily: "Inter", fontWeight: 600, fontSize: "11px", color: "#071424" }}
                    >
                      {blog.category}
                    </span>
                  </div>

                  {/* Article Title */}
                  <h3
                    className="mb-2 line-clamp-2 leading-[1.35] group-hover:text-[#1677ED] transition-colors"
                    style={{ fontFamily: "Inter", fontWeight: 600, fontSize: "14.5px", color: "#071424" }}
                  >
                    {blog.title}
                  </h3>
                </div>

                {/* Date & Read Time */}
                <p
                  className="mt-2 text-[#8190A2]"
                  style={{ fontFamily: "Inter", fontWeight: 400, fontSize: "11.5px", color: "#8190A2" }}
                >
                  {blog.date}&nbsp;&nbsp;&middot;&nbsp;&nbsp;{blog.readTime}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default BlogDetail;
