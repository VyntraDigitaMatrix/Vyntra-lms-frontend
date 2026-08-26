import React from 'react';

const LearningShouldntStopSection = () => {
  return (
    <div className="mt-3 max-w-4xl text-center px-4 z-40 relative">
      <h2 className="text-3xl sm:text-4xl lg:text-[50px] leading-tight" style={{ fontFamily: '"Sk-Modernist"', fontWeight: 400, fontStyle: 'normal', color: '#15130F' }}>
        Learning shouldn't stop at the <span className="text-3xl sm:text-4xl lg:text-[50px]" style={{ fontFamily: '"Playfair Display"', fontWeight: 400, fontStyle: 'italic', color: '#243E5C' }}>lesson.</span>
      </h2>
      <p style={{ fontFamily: 'Inter', fontWeight: 400, fontStyle: 'Regular', fontSize: '14px', color: '#544E42' }} className="mb-12 max-w-[42rem] mx-auto mt-4">
        Most platforms end at the video. Vyntra is built around the idea that learning should carry all the way through — from acquiring a new skill, to proving it, to being recognized for it, to actually using it to move your career forward.
      </p>

      {/* Badges */}
      <div className="flex flex-col sm:flex-row sm:flex-wrap justify-center w-full px-4 sm:px-0 gap-4">
        <span style={{ fontFamily: 'Inter', fontWeight: 700, fontStyle: 'Bold', fontSize: '13px' }} className="w-full sm:w-auto text-center px-6 py-2.5 rounded-full border border-[#15130F1A] bg-[#0A2647] text-white sm:bg-white sm:text-[#544E42] shadow-sm hover:bg-[#0A2647] hover:text-white hover:shadow-md transition-all cursor-default">Structured Courses</span>
        <span style={{ fontFamily: 'Inter', fontWeight: 700, fontStyle: 'Bold', fontSize: '13px' }} className="w-full sm:w-auto text-center px-6 py-2.5 rounded-full border border-[#15130F1A] bg-[#0A2647] text-white sm:bg-white sm:text-[#544E42] shadow-sm hover:bg-[#0A2647] hover:text-white hover:shadow-md transition-all cursor-default">Practical Assessments</span>
        <span style={{ fontFamily: 'Inter', fontWeight: 700, fontStyle: 'Bold', fontSize: '13px' }} className="w-full sm:w-auto text-center px-6 py-2.5 rounded-full border border-[#15130F1A] bg-[#0A2647] text-white sm:bg-white sm:text-[#544E42] shadow-sm hover:bg-[#0A2647] hover:text-white hover:shadow-md transition-all cursor-default">Expert Mentorship</span>
        <span style={{ fontFamily: 'Inter', fontWeight: 700, fontStyle: 'Bold', fontSize: '13px' }} className="w-full sm:w-auto text-center px-6 py-2.5 rounded-full border border-[#15130F1A] bg-[#0A2647] text-white sm:bg-white sm:text-[#544E42] shadow-sm hover:bg-[#0A2647] hover:text-white hover:shadow-md transition-all cursor-default">Career Support</span>
      </div>
    </div>
  );
};

export default LearningShouldntStopSection;
