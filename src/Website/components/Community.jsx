import React, { useState } from 'react';
import snehaAvatar from '../assets/sneha.jpg';
import rahulAvatar from '../assets/rahul.jpg';
import liveImage2 from '../assets/LiveClasses-2.png';
import liveImage4 from '../assets/LiveClasses-4.png';

const testimonials = [
  {
    id: 1,
    quote: 'Vyntra One helped me switch my career to digital marketing. The live classes and mentor support made learning so easy!',
    name: 'Sneha Reddy',
    role: 'Digital Marketing Learner',
    avatar: snehaAvatar,
    quoteColor: '#23D89A',
    bgColor: 'bg-[#F8F9FC]',
    borderColor: 'border-[#EAEFF7]',
  },
  {
    id: 2,
    quote: 'The stock market course is simple and practical. I now feel confident to start investing.',
    name: 'Rahul Mehta',
    role: 'Stock Market Learner',
    avatar: rahulAvatar,
    quoteColor: '#F29A14',
    bgColor: 'bg-[#FAF6ED]',
    borderColor: 'border-[#F2ECE0]',
  },
  {
    id: 3,
    quote: 'The structured full-stack curriculum and practical hands-on assignments gave me the exact skills needed to crack tech interviews.',
    name: 'Priya Sharma',
    role: 'Web Development Learner',
    avatar: liveImage2,
    quoteColor: '#3B82F6',
    bgColor: 'bg-[#F4F7FC]',
    borderColor: 'border-[#E2EAF8]',
  },
  {
    id: 4,
    quote: 'From zero coding experience to deploying live applications, the mentorship and peer community kept me motivated every single day.',
    name: 'Karan Verma',
    role: 'Full Stack Learner',
    avatar: liveImage4,
    quoteColor: '#8B5CF6',
    bgColor: 'bg-[#FAF5FF]',
    borderColor: 'border-[#F0E6FD]',
  },
];

const Community = () => {
  const [startIndex, setStartIndex] = useState(0);
  const [activeArrow, setActiveArrow] = useState('next');

  const handlePrev = () => {
    setActiveArrow('prev');
    setStartIndex((prev) => (prev === 0 ? testimonials.length - 2 : prev - 1));
  };

  const handleNext = () => {
    setActiveArrow('next');
    setStartIndex((prev) => (prev >= testimonials.length - 2 ? 0 : prev + 1));
  };

  // Get current 2 items to display
  const visibleCards = [
    testimonials[startIndex],
    testimonials[(startIndex + 1) % testimonials.length],
  ];

  return (
    <section id="community" className="w-full py-16 sm:py-20 bg-white relative overflow-hidden scroll-mt-24">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-20">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-10 lg:gap-12">

          {/* Left Column: Badge, Heading, Description, Navigation */}
          <div className="w-full lg:w-[320px] xl:w-[340px] shrink-0 flex flex-col justify-between self-stretch">
            <div>
              {/* Badge */}
              <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#F0F1F4] shrink-0 shadow-xs mb-5">
                <span
                  style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '13px', color: '#111318' }}
                >
                  Community
                </span>
              </div>

              {/* Heading */}
              <h2
                className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-[#11162A] leading-[1.15] mb-4"
                style={{ fontFamily: "'Gilroy-SemiBold', 'Gilroy', Inter, sans-serif", fontWeight: 400, color: '#111318', fontSize: '42px' }}
              >
                From Our<br />
                <span className="text-[#129B59]">Vyntra One</span><br />
                Community
              </h2>

              {/* Description */}
              <p
                className="max-w-[300px]"
                style={{ fontFamily: 'Inter', fontWeight: 400, fontStyle: 'Regular', fontSize: '14px', color: '#767983' }}
              >
                Real learners. Real stories. See how Vyntra One is helping people build new skills and brighter careers.
              </p>
            </div>

            {/* Navigation Arrows (Bottom Left) */}
            <div className="flex items-center gap-3 mt-8 lg:mt-8">
              <button
                onClick={handlePrev}
                aria-label="Previous testimonial"
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-95 ${activeArrow === 'prev'
                    ? 'bg-[#0B0F19] text-white border border-[#0B0F19] hover:bg-gray-800'
                    : 'bg-white text-gray-700 border border-[#D9DCE3] hover:bg-gray-50'
                  }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={handleNext}
                aria-label="Next testimonial"
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-95 ${activeArrow === 'next'
                    ? 'bg-[#0B0F19] text-white border border-[#0B0F19] hover:bg-gray-800'
                    : 'bg-white text-gray-700 border border-[#D9DCE3] hover:bg-gray-50'
                  }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Right Column: 2 Cards Grid */}
          <div className="w-full flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
            {visibleCards.map((item, idx) => (
              <div
                key={`${item.id}-${idx}`}
                className={`${item.bgColor} ${item.borderColor} border rounded-[28px] p-6 sm:p-8 flex flex-col justify-between min-h-[340px] sm:min-h-[360px] shadow-xs hover:shadow-md transition-all duration-300 group`}
              >
                {/* Top Row: Quote Icon + Top Right Arrow */}
                <div className="flex items-start justify-between">
                  <span
                    className="text-4xl sm:text-5xl font-serif font-black leading-none select-none"
                    style={{ color: item.quoteColor }}
                  >
                    “
                  </span>
                  <button
                    onClick={() => window.location.href = '/UserLogin'}
                    className="w-8.5 h-8.5 rounded-full bg-white shadow-xs flex items-center justify-center text-gray-800 group-hover:scale-110 transition-transform cursor-pointer"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7V17" />
                    </svg>
                  </button>
                </div>

                {/* Middle: Testimonial Quote */}
                <p
                  className="text-[#11162A] text-[15px] sm:text-[16px] font-normal leading-relaxed my-6 sm:my-6"
                  style={{ fontFamily: 'Inter', fontWeight: 400, fontStyle: 'Regular', fontSize: '16px', color: '#111318' }}
                >
                  {item.quote}
                </p>

                {/* Bottom Row: User Avatar & Info */}
                <div className="flex items-center gap-3.5">
                  <img
                    src={item.avatar}
                    alt={item.name}
                    className="w-11 h-11 sm:w-12 sm:h-12 rounded-full object-cover shrink-0 border border-white shadow-xs"
                  />
                  <div>
                    <h4
                      style={{ fontFamily: 'Inter', fontWeight: 700, fontStyle: 'Bold', fontSize: '14px', color: '#111318' }}
                    >
                      {item.name}
                    </h4>
                    <p
                      className="mt-0.5"
                      style={{ fontFamily: 'Inter', fontWeight: 400, fontStyle: 'Regular', fontSize: '12px', color: '#7A7B82' }}
                    >
                      {item.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default Community;
