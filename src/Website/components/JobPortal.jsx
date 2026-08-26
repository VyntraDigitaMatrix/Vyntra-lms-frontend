import React from 'react';

const jobs = [
  {
    title: 'UI/UX Designer',
    company: 'Google',
    location: 'Bangalore, India',
    type: 'Full-time',
    time: '2d ago',
    tags: ['UI/UX', 'Product Design'],
    logoText: 'G',
    logoBg: 'bg-transparent',
    logoColor: 'text-[#2563EB]',
    isSquare: false
  },
  {
    title: 'Product Designer',
    company: 'Adobe',
    location: 'Noida, India',
    type: 'Full-time',
    time: '3d ago',
    tags: ['UI/UX', 'Product Design'],
    logoText: 'A',
    logoBg: 'bg-transparent',
    logoColor: 'text-[#DC2626]',
    isSquare: false
  },
  {
    title: 'UX Researcher',
    company: 'Meta',
    location: 'Hyderabad, India',
    type: 'Full-time',
    time: '1d ago',
    tags: ['Research', 'UX'],
    logoText: '∞',
    logoBg: 'bg-transparent',
    logoColor: 'text-[#0284C7]',
    isSquare: false
  },
  {
    title: 'Digital Marketing Specialist',
    company: 'HubSpot',
    location: 'Remote',
    type: 'Full-time',
    time: '4d ago',
    tags: ['Digital Marketing', 'SEO'],
    logoText: 'H',
    logoBg: 'bg-transparent',
    logoColor: 'text-[#EA580C]',
    isSquare: false
  },
  {
    title: 'Content Strategist',
    company: 'LinkedIn',
    location: 'Delhi, India',
    type: 'Full-time',
    time: '5d ago',
    tags: ['Content', 'Strategy'],
    logoText: 'in',
    logoBg: 'bg-[#0A66C2]',
    logoColor: 'text-white',
    isSquare: true
  },
  {
    title: 'Visual Designer',
    company: 'Dribbble',
    location: 'Mumbai, India',
    type: 'Full-time',
    time: '2d ago',
    tags: ['Visual Design', 'Branding'],
    logoText: '●',
    logoBg: 'bg-transparent',
    logoColor: 'text-[#DB2777]',
    isSquare: false
  },
  {
    title: 'Web Designer',
    company: 'Behance',
    location: 'Remote',
    type: 'Contract',
    time: '6d ago',
    tags: ['Web Design', 'HTML/CSS'],
    logoText: 'Bē',
    logoBg: 'bg-[#0057FF]',
    logoColor: 'text-white',
    isSquare: true
  },
  {
    title: 'UI Designer',
    company: 'Shopify',
    location: 'Bangalore, India',
    type: 'Full-time',
    time: '3d ago',
    tags: ['UI Design', 'E-commerce'],
    logoText: 'S',
    logoBg: 'bg-transparent',
    logoColor: 'text-[#16A34A]',
    isSquare: false
  },
  {
    title: 'Product Design Intern',
    company: 'Notion',
    location: 'Remote',
    type: 'Internship',
    time: '1d ago',
    tags: ['UI/UX', 'Product Design'],
    logoText: 'N',
    logoBg: 'bg-transparent',
    logoColor: 'text-black',
    isSquare: true
  }
];

const JobPortal = () => {
  return (
    <div className="w-full bg-transparent pt-10 flex flex-col items-center text-left">

      {/* Header Section */}
      <div className="w-full max-w-full 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 flex flex-col items-center text-left mb-16">
        {/* Badge */}
        <div className="bg-[linear-gradient(135deg,_#F1EDFF_15%,_#F8F5FF_85%)] px-5 py-3 rounded-xl mb-6" style={{fontFamily: 'Inter', fontWeight: 700, fontStyle: 'Bold', fontSize: '14px', color: '#000000'}}>
          Placements & Job Portal
        </div>

        {/* Main Title */}
        <h2 style={{ fontFamily: 'Sk-Modernist', fontWeight: 400, fontSize: '50px', color: '#111633' }} className="mb-4">
          Top Opportunities Just for You
        </h2>

        {/* Subtitle */}
        <p style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: '15px', color: '#656C88' }} className="max-w-[700px] leading-relaxed">
          Explore thousands of active job openings from top companies.<br />
          <span className='ml-2'>
          Find the right role that matches your skills and career goals.
          </span>
        </p>
      </div>

      {/* Grid Section */}
      <div className="w-full max-w-full 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 text-left">
        {jobs.map((job, index) => (
          <div key={index} className="bg-white rounded-[24px] p-5 flex flex-col justify-between border-2 border-transparent hover:border-[#4F46E5]/20 shadow-[0px_4px_20px_rgba(0,0,0,0.03)] hover:shadow-md transition-all duration-300 group cursor-pointer">
            {/* Header (Logo + Title + Company) */}
            <div className="flex items-center gap-4 mb-5">
              <div className={`w-12 h-12 flex flex-shrink-0 font-bold items-center justify-center shadow-sm rounded-[10px] ${job.logoText === 'N' ? 'border-[2px] border-[#111111] font-[Georgia] text-[#111111]' : 'border-[1px] border-[#F3F4F6] font-Arial'} ${['in', 'Bē'].includes(job.logoText) ? 'text-[21px]' : 'text-[31px]'} ${job.logoBg} ${job.logoColor}`}>
                {job.logoText}
              </div>
              <div>
                <h3 className="font-Inter font-bold text-[#11152F] text-[18px] leading-snug mb-0.5 group-hover:text-[#4F46E5] transition-colors">{job.title}</h3>
                <p className="font-Inter text-[#626A86] text-[14px]">{job.company}</p>
              </div>
            </div>

            {/* Details (Location, Type, Time) */}
            <div className="flex items-center justify-between lg:justify-start lg:gap-4 text-[#727B96] text-[13px] font-Inter mb-5 whitespace-nowrap">
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-[#727B96] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                <span>{job.location}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-[#727B96] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                <span>{job.type}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-[#727B96] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <span>{job.time}</span>
              </div>
            </div>

            {/* Tags */}
            <div className="flex gap-2 overflow-hidden mb-3">
              {job.tags.map((tag, i) => (
                <span key={i} className="bg-[#F4F5F7] text-[#59617C] text-[13px] px-3.5 py-1.5 rounded-full font-Inter whitespace-nowrap">
                  {tag}
                </span>
              ))}
            </div>

            {/* Link */}
            <div className="flex justify-end mt-auto">
              <a href="#" className="text-[#5931E9] font-Inter font-semibold-700 text-[15px]  flex items-center gap-1 whitespace-nowrap flex-shrink-0">
                View Job <span className="text-lg  leading-none">→</span>
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Explore More Button */}
      <div className="mt-16 flex justify-center">
        <button className="bg-white w-[210px] h-[55px] rounded-full border-[2px] border-black/[0.28] text-[#000000] font-Inter text-[15px] font-medium flex items-center justify-center gap-2 hover:bg-gray-50 hover:border-black/50 transition-all shadow-sm">
          Explore more jobs <span className="text-xl leading-none mb-0.5">→</span>
        </button>
      </div>

    </div>
  );
};

export default JobPortal;
