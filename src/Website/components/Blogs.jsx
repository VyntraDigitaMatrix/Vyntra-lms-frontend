import React, { useRef, useState } from 'react';
import blogImg1 from '../assets/Blogs-1.png';
import blogImg2 from '../assets/Blogs-2.png';

const blogsData = [
  {
    id: 1,
    title: 'The Power of Live Learning: Why It Works',
    description:
      'Live learning creates real-time interaction, instant feedback, and deeper engagement, making learning more effective and memorable.',
    date: 'Mar 4, 2025',
    readTime: '5 min read',
    image: blogImg1,
  },
  {
    id: 2,
    title: 'Full Stack or Data Analytics: Which Career Path Is Right for You?',
    description:
      'Full Stack and Data Analytics offer different career opportunities, skills, and growth paths—discover which one best matches your interests and goals.',
    date: 'Mar 4, 2025',
    readTime: '5 min read',
    image: blogImg2,
  },
  {
    id: 3,
    title: 'How to Build an Industry-Ready Tech Portfolio in 2025',
    description:
      'Learn what top hiring managers look for in modern developer portfolios, from real-world projects to clean GitHub documentation.',
    date: 'Mar 2, 2025',
    readTime: '6 min read',
    image: blogImg1,
  },
  {
    id: 4,
    title: 'Mastering Stock Market Trends: A Practical Beginner’s Guide',
    description:
      'Understand chart patterns, risk management, and market fundamentals to start your trading and investing journey with confidence.',
    date: 'Feb 28, 2025',
    readTime: '4 min read',
    image: blogImg2,
  },
  {
    id: 5,
    title: 'Switching to Tech from a Non-IT Background: Step-by-Step',
    description:
      'Discover how structured roadmaps, live mentorship, and consistent practice can help you transition into high-growth IT careers seamlessly.',
    date: 'Feb 25, 2025',
    readTime: '5 min read',
    image: blogImg1,
  },
  {
    id: 6,
    title: 'AI Tools Every Modern Developer & Creator Should Master',
    description:
      'Explore the latest developer tools, AI workflows, and productivity hacks that will supercharge your engineering efficiency.',
    date: 'Feb 20, 2025',
    readTime: '7 min read',
    image: blogImg2,
  },
];

const Blogs = () => {
  const sliderRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [hasMoved, setHasMoved] = useState(false);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setHasMoved(false);
    setStartX(e.pageX - sliderRef.current.offsetLeft);
    setScrollLeft(sliderRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    if (Math.abs(walk) > 5) {
      setHasMoved(true);
    }
    sliderRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleCardClick = (e) => {
    if (hasMoved) {
      e.preventDefault();
      return;
    }
    window.location.href = '/UserLogin';
  };

  return (
    <section id="blogs" className="w-full py-16 sm:py-20 bg-white relative overflow-hidden scroll-mt-24">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header: Badge on Left, Heading on Right as shown in image */}
        <div className="w-full flex items-center justify-between mb-8 sm:mb-10">
          {/* Pill Badge */}
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#F0F1F4] shrink-0 shadow-xs">
            <span style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '13px', color: '#111318', fontStyle: 'Bold' }}>
              Blogs
            </span>
          </div>

          {/* Heading on the right side */}
          <h2
            className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-[#111318] leading-tight text-right"
            style={{ fontFamily: "'Gilroy-SemiBold', 'Gilroy', Inter, sans-serif", fontWeight: 400, color: '#111318', fontSize: '42px' }}
          >
            Our Latest Blog
          </h2>
        </div>

        {/* Draggable & Scrollable Blog Cards Row */}
        <div
          ref={sliderRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          className="flex items-stretch gap-5 sm:gap-6 overflow-x-auto pb-4 cursor-grab active:cursor-grabbing select-none scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {blogsData.map((blog) => (
            <div
              key={blog.id}
              className="w-[310px] sm:w-[350px] lg:w-[365px] shrink-0 bg-[#F6F6F6] border border-[#E7ECF1] rounded-[24px] sm:rounded-[28px] p-4.5 sm:p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-md group cursor-pointer"
              onClick={handleCardClick}
            >
              <div>
                {/* Top Row: Image + Circular Arrow Button */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex-1 rounded-[16px] sm:rounded-[18px] overflow-hidden aspect-[336/226] bg-gray-200">
                    <img
                      src={blog.image}
                      alt={blog.title}
                      draggable="false"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 pointer-events-none"
                    />
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      window.location.href = '/UserLogin';
                    }}
                    aria-label="Read full article"
                    className="w-8.5 h-8.5 rounded-full bg-white shadow-xs flex items-center justify-center text-gray-800 group-hover:scale-110 transition-transform shrink-0 cursor-pointer mt-0.5"
                  >
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7V17" />
                    </svg>
                  </button>
                </div>

                {/* Title */}
                <h3
                  className="text-[#11162A] font-bold text-[17px] sm:text-[18px] leading-[1.35] mb-2.5 group-hover:text-[#1167D8] transition-colors line-clamp-2"
                  style={{ fontFamily: "Inter", fontWeight: 700, fontSize: "17px", fontStyle: "Bold", color: "#071424" }}
                >
                  {blog.title}
                </h3>

                {/* Description */}
                <p
                  className="mb-2 line-clamp-3"
                  style={{ fontFamily: 'Inter', fontWeight: 400, fontStyle: 'Regular', fontSize: '13px', color: '#767676' }}
                >
                  {blog.description}
                </p>
              </div>

              {/* Meta Info: Date and Read Time */}
              <div
                className="pt-1 flex items-center"
                style={{ fontFamily: 'Inter', fontWeight: 400, fontStyle: 'Regular', fontSize: '13px', color: '#8190A2' }}
              >
                <span>{blog.date}</span>
                <span className="mx-2">·</span>
                <span>{blog.readTime}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Blogs;
