import React from 'react';
import Pinned from '../assets/Pin-1.png';
import vector from '../assets/Vector.png';
import vector1 from '../assets/Vector-1.png';
import vector2 from '../assets/Vector-2.png';

const steps = [
  {
    number: "01",
    title: "Structured Courses",
    description: "Industry-relevant courses designed by experts to build in-demand skills.",
    colorText: "text-[#6B46C1]  ",
    bgColor: "bg-gradient-to-br from-[#FAF6FF] to-[#F2E9FF]",
    icon: <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>,
    isPinnedRight: true,
    rotateClass: "-rotate-11"
  },
  {
    number: "02",
    title: "Practice & Assess",
    description: "Hands-on assignments, quizzes and tests to evaluate and improve your skills.",
    colorText: "text-[#10B981]",
    bgColor: "bg-gradient-to-br from-[#F4FFF7] to-[#EAF8EC]",
    icon: <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
  },
  {
    number: "03",
    title: "Live Classes",
    description: "Learn live from industry experts and get your queries resolved instantly.",
    colorText: "text-[#EA580C]",
    bgColor: "bg-gradient-to-br from-[#FFF8F3] to-[#FFF0E8]",
    icon: <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
  },
  {
    number: "04",
    title: "Engage & Connect",
    description: "Join discussions, collaborate with peers and grow together in a learning community.",
    colorText: "text-[#0284C7]",
    bgColor: "bg-gradient-to-br from-[#F2FBFF] to-[#E8F6FF]",
    icon: <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
  },
  {
    number: "05",
    title: "Achieve & Earn",
    description: "Earn certificates, badges and rewards as you achieve new milestones.",
    colorText: "text-[#D97706]",
    bgColor: "bg-gradient-to-br from-[#FFFDF4] to-[#FFF7DF]",
    icon: <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
  },
  {
    number: "06",
    title: "Compete & Lead",
    description: "Climb leaderboards, compete with top learners and showcase your excellence.",
    colorText: "text-[#DB2777]",
    bgColor: "bg-gradient-to-br from-[#FFF5F9] to-[#FFEDF4]",
    icon: <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></svg>
  },
  {
    number: "07",
    title: "Refer & Earn",
    description: "Invite friends using your referral code and earn exciting rewards together.",
    colorText: "text-[#0D9488]",
    bgColor: "bg-gradient-to-br from-[#F5FEFC] to-[#E5F9F6]",
    icon: <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"></path></svg>
  },
  {
    number: "08",
    title: "Career Ready",
    description: "Build your resume, explore job opportunities and take the next step in your career.",
    colorText: "text-[#4F46E5]",
    bgColor: "bg-gradient-to-br from-[#F8F6FF] to-[#EEEBFF]",
    icon: <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"></path></svg>,
    isPinnedLeft: true,
    rotateClass: "rotate-[8deg]"
  }
];

const StepCard = ({ number, title, description, colorText, bgColor, icon, isPinnedRight, isPinnedLeft, rotateClass }) => (
  <div className={`relative bg-white p-[14px] rounded-[32px] shadow-[0_15px_40px_-15px_rgba(0,0,0,0.1)] w-[280px] flex-shrink-0 ${rotateClass || ''} hover:-translate-y-2 transition-transform duration-300 z-10`}>
    {(isPinnedLeft || isPinnedRight) && (
      <div className={`absolute -top-6 ${isPinnedLeft ? 'left-6' : 'right-6'} w-14 h-14 z-20`}>
        <img src={Pinned} className="w-full h-full object-contain" alt="Pin" />
      </div>
    )}
    <div className={`w-full h-full min-h-[200px] rounded-[24px] px-6 py-6 flex flex-col ${bgColor}`}>
      <div className="flex justify-between items-start mb-3">
        <span className={`text-[40px] font-light ${colorText} leading-none`} style={{ fontFamily: '"Handlee", cursive', fontWeight: 400, fontStyle: "normal", fontSize: "40px" }}>{number}</span>
        <div className={`${colorText} mt-1`}>{icon}</div>
      </div>
      <h4 className="text-[18px] font-bold text-gray-900 mb-2 leading-tight" style={{ fontFamily: '"SF Pro", -apple-system, BlinkMacSystemFont, sans-serif' }}>{title}</h4>
      <p className="text-[13px] text-gray-600 leading-relaxed font-medium">{description}</p>
    </div>
  </div>
);

const HowItWorksSection = () => {
  return (
    <>
      {/* Badge */}
      <div className="flex justify-center w-full mb-16 relative z-20 mt-10">
        <div className="flex items-center gap-2 px-4 py-2.5 bg-[#FFF8DF] border border-[#F0D98B] rounded-full shadow-sm">
          <svg className="w-[18px] h-[18px] text-[#F5A624]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"></path></svg>
          <span className="text-[12px] font-bold text-[#D97706] tracking-widest uppercase">HOW IT WORKS</span>
        </div>
      </div>

      {/* Grid Container */}
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 md:px-8 relative z-10 w-full mb-10">
        {/* Desktop dashed line connection images */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0 hidden lg:block">
          <img src={vector} alt="" className="absolute opacity-60" style={{ top: '10%', left: '20%' }} />
          <img src={vector1} alt="" className="absolute opacity-60 w-[950px]" style={{ top: '20%', right: '10%' }} />
          <img src={vector2} alt="" className="absolute opacity-60" style={{ top: '55%', left: '30%' }} />
        </div>
        <div className="flex flex-wrap justify-center gap-15">
          {steps.map((step, index) => (
            <StepCard key={index} {...step} />
          ))}
        </div>
      </div>
    </>
  );
};

export default HowItWorksSection;
