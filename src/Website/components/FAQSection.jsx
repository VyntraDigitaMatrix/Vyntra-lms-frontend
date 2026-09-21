import React, { useState } from 'react';

const faqsData = [
  {
    question: 'What makes Vyntra1 different from a standard LMS?',
    answer:
      'Vyntra1 is a unified Learning & Career Ecosystem. While a standard LMS only hosts courses, Vyntra1 integrates practical learning, competitive leaderboards, verified achievement badges, resume building, and direct job applications into a single platform.',
  },
  {
    question: 'Do I need prior experience to join the IT or Stock Market programs?',
    answer:
      'No prior experience is required. All our programs are structured progressively from scratch, with hands-on practice, personalized mentor reviews, and live doubt clearance sessions.',
  },
  {
    question: 'How does the gamification and reward system work?',
    answer:
      'Learners earn XP points and streak badges by attending live sessions, passing weekly assessments, and solving real-world challenges, helping you rank on leaderboards and win exclusive rewards.',
  },
  {
    question: 'Does Vyntra1 guarantee job placement?',
    answer:
      'We offer 100% dedicated placement support, including live mock interviews, ATS resume optimization, portfolio reviews, and direct interview scheduling with our network of top hiring partners.',
  },
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section id="faq" className="w-full py-16 sm:py-24 bg-white relative overflow-hidden scroll-mt-24">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-stretch justify-between gap-8 lg:gap-12">
          {/* Left Column: Badge, Heading, Subtitle, Location Card */}
          <div className="w-full lg:w-[340px] xl:w-[360px] shrink-0 flex flex-col justify-between self-stretch">
            <div>
              {/* Badge + Divider Line */}
              <div className="flex items-center gap-3 mb-3.5">
                <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#F0F1F4] shrink-0 shadow-xs">
                  <span style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '13px', color: '#111318' }}>
                    FAQ'S
                  </span>
                </div>
                <div className="w-10 sm:w-12 h-[2px] bg-[#314158] rounded-full" />
              </div>

              {/* Heading */}
              <h2
                className="leading-[1.15] mb-3 tracking-tight"
                style={{ fontFamily: "'Gilroy-SemiBold', 'Gilroy', Inter, sans-serif", fontWeight: 400, color: '#111318', fontSize: '40px' }}
              >
                Frequently<br />
                <span className="text-[#FFBA00]">asked</span><br />
                questions
              </h2>

              {/* Subtitle */}
              <p
                className="max-w-[340px] mb-4"
                style={{ fontFamily: 'Inter', fontWeight: 400, fontStyle: 'Regular', fontSize: '15px', color: '#90A1B9' }}
              >
                Everything you need to know about the Vyntraone ecosystem, course structures, billing, and career support. Can't find the answer you're looking for?
              </p>
            </div>

            {/* Location Map & Address Card - Aligned with the bottom */}
            <div className="w-full max-w-[340px] rounded-[20px] overflow-hidden shadow-xs border border-[#E7ECF1] bg-white relative h-[160px] sm:h-[165px] shrink-0 mt-auto">
              {/* Interactive Google Map iframe */}
              <iframe
                title="Vyntra Nexus Location"
                src="https://maps.google.com/maps?q=17.4501047,78.3864174&hl=en&z=16&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full object-cover"
              />

              {/* Overlaid Address Card */}
              <a
                href="https://maps.app.goo.gl/UTDuW52xAHGCWEm66"
                target="_blank"
                rel="noopener noreferrer"
                title="Open location in Google Maps"
                className="absolute top-2 left-2 max-w-[185px] bg-white/95 backdrop-blur-md rounded-[14px] p-2.5 shadow-md border border-gray-100 hover:bg-white transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6.5 h-6.5 rounded-full bg-[#F5C362] flex items-center justify-center text-white shrink-0 shadow-xs">
                    {/* Briefcase Icon */}
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                      <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                    </svg>
                  </div>
                  <h4 className="text-[#11162A] font-bold text-[12px] leading-tight group-hover:text-[#1167D8] transition-colors">
                    Work
                  </h4>
                </div>

                <p
                  className="text-[#64748B] text-[10.5px] leading-[1.38]"
                  style={{ fontFamily: 'Inter', fontWeight: 400 }}
                >
                  House No. 1-98/9/3/30,<br />
                  First Floor, Silicon Valley,<br />
                  Madhapur, Hyderabad,<br />
                  Telangana 500081, India.
                </p>
              </a>
            </div>
          </div>

          {/* Right Column: FAQ Accordion List */}
          <div className="w-full flex-1 flex flex-col gap-3.5 sm:gap-4">
            {faqsData.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={idx}
                  onClick={() => toggleFAQ(idx)}
                  className="bg-[#1D293D] rounded-[20px] sm:rounded-[22px] p-5 sm:p-6 transition-all duration-300 cursor-pointer select-none hover:bg-[#233149] border border-[#314158] hover:border-[#3A4A63]"
                >
                  <div className="flex items-center justify-between gap-4">
                    <h3
                      style={{ fontFamily: 'Inter', fontWeight: 700, fontStyle: 'Bold', color: '#F1F5F9', fontSize: '19px' }}
                    >
                      {faq.question}
                    </h3>

                    {/* Toggle Icon */}
                    {isOpen ? (
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white flex items-center justify-center text-[#11152F] shrink-0 shadow-xs transition-transform duration-300">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7V17" />
                        </svg>
                      </div>
                    ) : (
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#2B3950] flex items-center justify-center text-[#8C97A7] shrink-0 transition-transform duration-300">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Collapsible Answer */}
                  {isOpen && (
                    <div className="mt-4 pt-1">
                      <p
                        style={{ fontFamily: 'Inter', fontWeight: 400, fontStyle: 'Regular', fontSize: '14px', color: '#CAD5E2' }}
                      >
                        {faq.answer}
                      </p>
                    </div>
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

export default FAQSection;
