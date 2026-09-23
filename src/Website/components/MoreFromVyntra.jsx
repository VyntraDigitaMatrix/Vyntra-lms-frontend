import React, { useState } from "react";
import moreInfo1 from "../assets/More-info-1.png";
import moreInfo2 from "../assets/More-info-2.png";
import moreInfo3 from "../assets/More-info-3.png";

const sideArticles = [
  {
    id: 1,
    title: "Certifications That Actually Add Value to Your Career",
    date: "Feb 10, 2025",
    readTime: "5 min read",
    image: moreInfo1,
  },
  {
    id: 2,
    title: "How to Stay Consistent in Your Learning Journey",
    date: "Feb 8, 2025",
    readTime: "4 min read",
    image: moreInfo2,
  },
  {
    id: 3,
    title: "Top Tools Every Digital Marketer Should Know",
    date: "Feb 5, 2025",
    readTime: "6 min read",
    image: moreInfo3,
  },
];

const popularTopics = [
  "Digital Marketing",
  "Stock Market",
  "Technology",
  "Career",
  "Learning",
  "Student Stories",
];

const MoreFromVyntra = () => {
  const [email, setEmail] = useState("");

  const handleArticleClick = () => {
    window.location.href = "/UserLogin";
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      alert("Thank you for subscribing to Vyntra One!");
      setEmail("");
    }
  };

  return (
    <section className="w-full py-10 sm:py-8 bg-white relative">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-20">
        <div className="grid grid-cols-1 md:grid-cols-11 gap-6 lg:gap-6">

          {/* COLUMN 1: More from Vyntra One (Left ~4 cols) */}
          <div className="md:col-span-5 lg:col-span-4 pr-0 md:pr-6 lg:pr-8 border-b md:border-b-0 md:border-r border-[#E2E8F0] pb-6 md:pb-0">
            <h2
              className="text-[#071424] mb-6"
              style={{
                fontFamily: "Inter",
                fontWeight: 700,
                fontSize: "22px",
                color: "#071424",
              }}
            >
              More from Vyntra One
            </h2>

            <div className="flex flex-col gap-3.5">
              {sideArticles.map((article) => (
                <div
                  key={article.id}
                  onClick={handleArticleClick}
                  className="flex items-center gap-3.5 bg-white border border-[#E7EBF0] rounded-[18px] p-3 cursor-pointer group hover:shadow-md transition-shadow"
                >
                  <div className="w-[72px] h-[58px] rounded-[10px] overflow-hidden shrink-0 bg-gray-100">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400"
                    />
                  </div>
                  <div className="flex-1 min-w-0 pr-1">
                    <h3
                      className="text-[#071424] leading-[1.3] mb-1 line-clamp-2 group-hover:text-[#1677ED] transition-colors"
                      style={{
                        fontFamily: "Inter",
                        fontWeight: 400,
                        fontSize: "12px",
                        color: "#071424",
                      }}
                    >
                      {article.title}
                    </h3>
                    <p
                      className="text-[#8591A0]"
                      style={{ fontFamily: "Inter", fontWeight: 400, fontSize: "11px", color: "#8190A2", fontStyle: "Regular" }}
                    >
                      {article.date}&nbsp;&nbsp;&middot;&nbsp;&nbsp;{article.readTime}
                    </p>
                  </div>
                  <div className="shrink-0 text-[#071424] group-hover:text-gray-800 group-hover:translate-x-0.5 transition-all">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* COLUMN 2: Popular Topics (Middle ~4 cols) */}
          <div className="md:col-span-3 lg:col-span-3 px-0 md:px-6 lg:px-8">
            <h2
              className="mb-6"
              style={{
                fontFamily: "Inter",
                fontWeight: 700,
                fontSize: "22px",
                color: "#071424",
              }}
            >
              Popular Topics
            </h2>

            <div className="flex flex-col">
              {popularTopics.map((topic, idx) => (
                <div
                  key={idx}
                  onClick={handleArticleClick}
                  className="flex items-center justify-between py-3.5 border-b border-[#E6EBEF] cursor-pointer group hover:pl-1 transition-all"
                >
                  <span
                    className="group-hover:text-[#1677ED] transition-colors"
                    style={{
                      fontFamily: "Inter",
                      fontWeight: 400,
                      fontSize: "13px",
                      fontStyle: "Regular",
                      color: "#071424",
                    }}
                  >
                    {topic}
                  </span>
                  <span className="text-[#071424] text-[13px] group-hover:translate-x-1 transition-transform">
                    &rsaquo;
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* COLUMN 3: Newsletter & Featured Resource (Right ~4 cols) */}
          <div className="md:col-span-4 flex flex-col gap-4">

            {/* Top Card: Newsletter */}
            <div
              className="rounded-xl p-6 text-white shadow-md relative overflow-hidden"
              style={{ background: "linear-gradient(180deg, #0E94F3 0%, #0874EB 100%)" }}
            >
              <div className="flex items-center gap-1.5 mb-2 text-[10px] font-bold tracking-widest text-white/80 uppercase">
                <span>—</span>
                <span>STAY UPDATED</span>
              </div>
              <h3
                className="text-white font-bold text-[25px] leading-tight mb-2"
                style={{ fontFamily: "Inter", fontWeight: 700, fontSize: "22px", fontStyle: "Bold", color: "#FFFFFF" }}
              >
                Join our newsletter
              </h3>
              <p
                className="text-white/85 text-[13px] leading-[1.5] mb-5"
                style={{ fontFamily: "Inter", fontWeight: 400, fontSize: "11px", fontStyle: "Regular", color: "#DCEEFF" }}
              >
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
                    style={{ fontFamily: "Inter", fontWeight: 700, fontSize: "12px", color: "#979797" }}
                  />
                  <button
                    type="submit"
                    className="bg-[#FF9E00] hover:bg-[#e09912] text-white px-5 py-2 rounded-full font-bold text-[12.5px] transition-colors shrink-0 flex items-center gap-1 cursor-pointer"
                    style={{ fontFamily: "Inter", fontWeight: 700, fontSize: "9px", color: "#FFFFFF" }}
                  >
                    <span>Subscribe</span>
                    <span>&rarr;</span>
                  </button>
                </div>
              </form>

              <div className="mt-3 flex items-center gap-1 text-[11px] text-white/75" style={{ fontFamily: "Inter", fontWeight: 400, fontSize: "8px", color: "#E5F3FF" }}>
                <span>&#10004;</span>
                <span>No spam. Unsubscribe anytime.</span>
              </div>
            </div>

            {/* Bottom Card: Featured Resource */}
            <div className="bg-[#142536] rounded-xl p-5 text-white shadow-md">
              <span
                className="block text-[#94A3B8] text-[13px] font-medium mb-3"
                style={{ fontFamily: "Inter", fontWeight: 700, fontSize: "14px", color: "#B8C6D3" }}
              >
                Featured Resource
              </span>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-[12px] bg-[#1677ED] flex items-center justify-center text-white shrink-0 shadow-sm">
                  {/* Graduation Cap Icon */}
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" />
                  </svg>
                </div>
                <div>
                  <h4
                    style={{ fontFamily: "Inter", fontWeight: 400, fontSize: "14px", fontStyle: "Regular", color: "#FFFFFF" }}
                  >
                    Free Career Guide
                  </h4>
                  <p
                    className="mt-0.5"
                    style={{ fontFamily: "Inter", fontWeight: 400, fontSize: "9px", color: "#B7C4D0" }}
                  >
                    Step-by-step roadmap to build your dream career.
                  </p>
                </div>
              </div>

              <a
                href="/UserLogin"
                className="inline-flex items-center gap-1.5 text-[#FFAD1A] hover:text-[#ffbe42] font-semibold text-[13px] transition-colors cursor-pointer"
                style={{ fontFamily: "Inter", fontWeight: 700, fontSize: "9px", color: "#FF9E00" }}
              >
                <span>Download Now</span>
                <span>&rarr;</span>
              </a>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default MoreFromVyntra;
