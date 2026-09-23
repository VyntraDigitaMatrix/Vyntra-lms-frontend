import React, { useState } from "react";

const blogFaqs = [
  {
    id: 1,
    question: "1. Do I need any prior knowledge to join?",
    answer:
      "No prior knowledge is required! All our programs are structured progressively from scratch to help beginners learn with confidence.",
    col: "left",
  },
  {
    id: 2,
    question: "2. Are the live sessions recorded?",
    answer:
      "Yes, all live sessions are recorded and made available in your student dashboard within 24 hours so you never miss a lesson.",
    col: "right",
  },
  {
    id: 3,
    question: "3. Will I get a certificate after completion?",
    answer:
      "Yes! You will receive an official verified completion certificate and skill badge that you can add to your resume and LinkedIn profile.",
    col: "left",
  },
  {
    id: 4,
    question: "4. Is there any placement support?",
    answer:
      "Yes! We provide dedicated placement assistance, ATS resume optimization, mock interviews, and direct hiring partner referrals.",
    col: "right",
  },
  {
    id: 5,
    question: "5. Can I access the courses on mobile?",
    answer:
      "Yes, all Vyntra One courses, learning materials, quizzes, and recorded sessions are fully responsive and accessible on mobile devices.",
    col: "left",
  },
  {
    id: 6,
    question: "6. Can I learn at my own pace?",
    answer:
      "Absolutely! Along with live interactive classes, all recorded video lessons, assignments, and study resources are available 24/7 for self-paced learning.",
    col: "right",
  },
];

const BlogFAQ = () => {
  const [openId, setOpenId] = useState(null);

  const toggleFaq = (id) => {
    setOpenId(openId === id ? null : id);
  };

  const leftFaqs = blogFaqs.filter((f) => f.col === "left");
  const rightFaqs = blogFaqs.filter((f) => f.col === "right");

  return (
    <section className="w-full py-10 sm:py-14 bg-white">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 sm:mb-10 gap-3">
          <div>
            <h2
              className="mb-1"
              style={{
                fontFamily: "Inter",
                fontWeight: 700,
                fontStyle: "Bold",
                fontSize: "27px",
                color: "#10213D",
              }}
            >
              Frequently Asked Questions
            </h2>
            <p
              style={{ fontFamily: "Inter", fontWeight: 400, fontStyle: "Regular", fontSize: "12px", color: "#65758A" }}
            >
              Have questions? We've got answers.
            </p>
          </div>

          <a
            href="/UserLogin"
            className="text-[#1677ED] hover:underline font-semibold text-[13px] inline-flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
            style={{ fontFamily: "Inter", fontWeight: 700, fontStyle: "Bold", fontSize: "12px", color: "#1760E9" }}
          >
            <span>View All FAQs</span>
            <span>&rarr;</span>
          </a>
        </div>

        {/* 2-Column FAQ Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-2 items-start">

          {/* Left Column */}
          <div className="flex flex-col">
            {leftFaqs.map((faq) => {
              const isOpen = openId === faq.id;
              return (
                <div
                  key={faq.id}
                  onClick={() => toggleFaq(faq.id)}
                  className="border-b border-[#E8EDF2] py-4 px-1 cursor-pointer group transition-colors"
                >
                  <div className="flex items-center justify-between gap-4">
                    <h3
                      className={`text-[14px] font-medium transition-colors ${isOpen ? "text-[#1677ED] font-semibold" : "text-[#334155] group-hover:text-[#1760E9]"
                        }`}
                      style={{ fontFamily: "Inter", fontWeight: 400, fontStyle: "Regular", color: "#47566D" }}
                    >
                      {faq.question}
                    </h3>
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-[15px] font-bold shrink-0 transition-colors ${isOpen
                        ? "bg-[#1677ED] text-white"
                        : "bg-[#E8F0FE] text-[#1677ED] group-hover:bg-[#1677ED] group-hover:text-white"
                        }`}
                    >
                      {isOpen ? "−" : "+"}
                    </div>
                  </div>
                  {isOpen && (
                    <p
                      className="text-[#64748B] text-[12px] leading-[1.55] pt-2.5 pb-1"
                      style={{ fontFamily: "Inter" }}
                    >
                      {faq.answer}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right Column */}
          <div className="flex flex-col">
            {rightFaqs.map((faq) => {
              const isOpen = openId === faq.id;
              return (
                <div
                  key={faq.id}
                  onClick={() => toggleFaq(faq.id)}
                  className="border-b border-[#E8EDF2] py-4 px-1 cursor-pointer group transition-colors"
                >
                  <div className="flex items-center justify-between gap-4">
                    <h3
                      className={`text-[14px] font-medium transition-colors ${isOpen ? "text-[#1677ED] font-semibold" : "text-[#334155] group-hover:text-[#1760E9]"
                        }`}
                      style={{ fontFamily: "Inter", fontWeight: 400, fontStyle: "Regular", color: "#47566D" }}
                    >
                      {faq.question}
                    </h3>
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-[15px] font-bold shrink-0 transition-colors ${isOpen
                        ? "bg-[#1677ED] text-white"
                        : "bg-[#E8F0FE] text-[#1677ED] group-hover:bg-[#1677ED] group-hover:text-white"
                        }`}
                    >
                      {isOpen ? "−" : "+"}
                    </div>
                  </div>
                  {isOpen && (
                    <p
                      className="text-[#64748B] text-[14px] leading-[1.55] pt-2.5 pb-1"
                      style={{ fontFamily: "Inter", fontWeight: 400, fontStyle: "Regular", color: "#65758A" }}
                    >
                      {faq.answer}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
};

export default BlogFAQ;
