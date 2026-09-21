import React from 'react';
import liveImage1 from '../assets/LiveClasses-1.png';
import liveImage2 from '../assets/LiveClasses-2.png';
import liveImage3 from '../assets/LiveClasses-3.png';
import liveImage4 from '../assets/LiveClasses-4.png';
import liveImage5 from '../assets/LiveClasses-5.png';

const liveClassesData = [
  {
    id: 1,
    date: '12',
    month: 'Apr',
    title: 'SEO for Beginners',
    instructor: 'By Priya Sharma',
    time: '07:00 PM - 08:00 PM',
    image: liveImage2,
    imageBg: 'bg-[#F2ECE6]',
    imagePos: 'object-[center_45%]',
  },
  {
    id: 2,
    date: '14',
    month: 'Apr',
    title: 'Introduction to Stock Market',
    instructor: 'By Arjun Mehta',
    time: '06:00 PM - 07:00 PM',
    image: liveImage3,
    imageBg: 'bg-[#009ED8]',
    imagePos: 'object-[center_45%]',
  },
  {
    id: 3,
    date: '16',
    month: 'Apr',
    title: 'Build Your First Website',
    instructor: 'By Karan Verma',
    time: '07:00 PM - 08:30 PM',
    image: liveImage4,
    imageBg: 'bg-[#EAEAEA]',
    imagePos: 'object-[center_12%]',
  },
  {
    id: 4,
    date: '18',
    month: 'Apr',
    title: 'Social Media Strategy',
    instructor: 'By Neha Kapoor',
    time: '06:00 PM - 07:00 PM',
    image: liveImage5,
    imageBg: 'bg-[#CED7DE]',
    imagePos: 'object-[center_18%]',
  },
];

const LiveClasses = () => {
  return (
    <section id="live-classes" className="w-full py-16 sm:py-20 bg-white relative overflow-hidden scroll-mt-24">
      {/* Container matches Programs section width and padding exactly */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">

          {/* Left Column: Aligned straight with left edge of Programs */}
          <div className="lg:col-span-5 flex flex-col justify-between h-full">
            <div>
              {/* Badge */}
              <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#F0F1F4] shrink-0 shadow-xs mb-4">
                <span
                  style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '13px', color: '#111318' }}
                >
                  Live Classes
                </span>
              </div>

              {/* Heading */}
              <h2
                className="text-3xl sm:text-4xl lg:text-[45px] mb-3.5"
                style={{ fontFamily: "'Gilroy-SemiBold', 'Gilroy', Inter, sans-serif", fontWeight: 400, color: '#111318' }}
              >
                Join Our<br />
                Upcoming<br />
                <span className="text-[#F27617]">Live Classes</span>
              </h2>

              {/* Description */}
              <p
                className="max-w-[360px] mb-6"
                style={{ fontFamily: 'Inter', fontWeight: 400, fontStyle: 'Regular', fontSize: '16px', color: '#767983' }}
              >
                Learn directly from industry experts. Ask questions, get practical insights, and gain real-world knowledge.
              </p>
            </div>

            {/* Live Now Student Card - Fills column width straight down */}
            <div className="relative rounded-[24px] overflow-hidden w-full aspect-[18/11] shadow-md group">
              <img
                src={liveImage1}
                alt="Student studying live"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />

              {/* Gradient overlay on bottom */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />

              {/* Live Now Badge (Top Left) */}
              <div className="absolute top-4 left-4 z-10">
                <div className="inline-flex items-center gap-2 bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-full shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-xs font-bold text-[#111318]" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Live Now
                  </span>
                </div>
              </div>

              {/* Bottom Left Overlay Text */}
              <div className="absolute bottom-5 left-5 z-10">
                <h3
                  style={{ fontFamily: 'Inter', fontWeight: 400, fontStyle: 'Regular', fontSize: '20px', color: '#FFFFFF' }}
                >
                  Learn Today<br />
                  Build Tomorrow
                </h3>
              </div>
            </div>
          </div>

          {/* Right Column: 4 Live Class Cards + View All Button */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div className="flex flex-col gap-3.5 sm:gap-4">
              {liveClassesData.map((item) => (
                <div
                  key={item.id}
                  onClick={() => window.location.href = '/UserLogin'}
                  className="group bg-white rounded-[22px] p-4 sm:p-5 border border-[#ECEEF2] flex items-center justify-between gap-3 sm:gap-5 hover:border-gray-300 hover:shadow-md transition-all duration-300 cursor-pointer"
                >
                  {/* Left: Date */}
                  <div className="flex flex-col items-center justify-center w-11 sm:w-13 shrink-0 text-center">
                    <span
                      style={{ fontFamily: 'Inter', fontWeight: 700, fontStyle: 'Bold', fontSize: '22px', color: '#111318' }}
                    >
                      {item.date}
                    </span>
                    <span
                      style={{ fontFamily: 'Inter', fontWeight: 400, fontStyle: 'Regular', fontSize: '15px', color: '#111318' }}
                    >
                      {item.month}
                    </span>
                  </div>

                  {/* Thumbnail with centered faces */}
                  <div
                    className={`w-16 h-14 sm:w-[78px] sm:h-[62px] rounded-[16px] overflow-hidden shrink-0 flex items-center justify-center ${item.imageBg}`}
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className={`w-full h-full object-cover ${item.imagePos} group-hover:scale-105 transition-transform duration-300`}
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h4
                      style={{ fontFamily: 'Inter', fontWeight: 400, fontStyle: 'Regular', fontSize: '15px' }}
                    >
                      {item.title}
                    </h4>
                    <p
                      className="mt-0.5"
                      style={{ fontFamily: 'Inter', fontWeight: 400, fontStyle: 'Regular', fontSize: '13px', color: '#777983' }}
                    >
                      {item.instructor}
                    </p>
                    <div className="flex items-center gap-1.5 text-xs text-[#777983] mt-1.5">
                      <svg
                        className="w-3.5 h-3.5 text-[#464850] shrink-0"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        viewBox="0 0 24 24"
                      >
                        <circle cx="12" cy="12" r="9" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l3 2" />
                      </svg>
                      <span style={{ fontFamily: 'Inter', fontWeight: 400, fontStyle: 'Regular', fontSize: '13px', color: '#464850' }}>{item.time}</span>
                    </div>
                  </div>

                  {/* Arrow Button */}
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-[#D9DCE3] flex items-center justify-center text-[#11162A] group-hover:bg-[#111318] group-hover:text-white group-hover:border-[#111318] transition-all duration-300 shrink-0">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>

            {/* View All Classes Button */}
            <div className="flex justify-end mt-6">
              <button
                onClick={() => window.location.href = '/UserLogin'}
                className="inline-flex items-center gap-2 bg-[#07090C] text-white font-semibold text-xs sm:text-sm px-6 py-3 rounded-full hover:bg-gray-800 transition-all duration-300 shadow-sm cursor-pointer group"
                style={{ fontFamily: 'Inter' }}
              >
                <span>View All Classes</span>
                <svg
                  className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default LiveClasses;
