import React from 'react';

const CTASection = () => {
  return (
    <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 py-15 flex justify-center">
      <div className="max-w-full 2xl:max-w-[1536px] w-full bg-[#000000] rounded-[30px] relative overflow-hidden flex flex-col items-center text-center py-12 md:py-16 z-10">
        {/* Background Glows */}
        <div className="absolute w-[445px] h-[445px] bg-[#0056C1] rounded-full -top-[332px] left-0 md:-left-[100px] pointer-events-none opacity-80" style={{ filter: 'blur(150px)' }} />
        <div className="absolute w-[445px] h-[445px] bg-[#FEC453] rounded-full top-[300px] md:top-[300px] left-[50%] md:left-[970px] pointer-events-none opacity-60" style={{ filter: 'blur(150px)' }} />

        <div className="relative z-10 flex flex-col items-center w-full px-4">
          <span className="uppercase mb-8" style={{ fontFamily: 'Inter', fontWeight: 700, fontStyle: 'Bold', fontSize: '11px', color: '#F0B429' }}>GET STARTED</span>

          <h2 className="text-4xl sm:text-5xl md:text-6xl text-white mb-6 leading-tight relative z-20 px-4" style={{ fontFamily: 'Sk-Modernist', fontWeight: 400 }}>
            <div className="flex flex-wrap justify-center items-center gap-x-3 md:gap-x-4">
              <span>Your</span>
              <span className="bg-[#FEC453] text-[#000000] px-6 md:px-8 py-1 md:py-1 rounded-[42px] inline-flex items-center justify-center -mt-1 md:-mt-2 text-[45px] md:text-[60px]">journey</span>
              <span>starts here.</span>
            </div>

          </h2>

          <p className="text-gray-300 text-[14px] sm:text-[15px] max-w-2xl mx-auto mb-10 px-6 relative z-20" style={{ fontFamily: 'Inter', fontWeight: 400, fontStyle: 'Regular', color: '#B9AE95' }}>
            Start building practical skills, track your progress, earn recognition, and discover
            <br className="hidden md:block" />
            opportunities designed to help you move forward.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-5">
            <button className="bg-gradient-to-r from-[#F0B429] to-[#C9922A] hover:from-[#e0a820] hover:to-[#b88425] px-8 py-3 rounded-full transition-all w-full sm:w-auto shadow-[0_0_20px_rgba(240,180,41,0.3)]" style={{ fontFamily: 'Inter', fontWeight: 700, fontStyle: 'Bold', fontSize: '14px', color: '#15130F' }}>
              Start Learning
            </button>
            <button className="bg-transparent border border-[#ffffff] hover:border-[#9CA3AF] px-8 py-3 rounded-full transition-all w-full sm:w-auto" style={{ fontFamily: 'Inter', fontWeight: 700, fontStyle: 'Bold', fontSize: '14px', color: '#FFFFFF' }}>
              Explore the Ecosystem
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CTASection;
