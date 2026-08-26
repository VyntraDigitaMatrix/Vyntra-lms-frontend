import React from 'react';

const ReferralCard = () => {
  return (
    <div className="w-full px-4 md:px-8 xl:px-16 pt-16 pb-4">
      <div className="max-w-[1280px] mx-auto w-auto rounded-[24px] border border-[#DEDFE0] overflow-hidden flex flex-col lg:flex-row items-center justify-between px-6 sm:px-10 md:px-14 lg:px-20 py-12 shadow-sm"
           style={{ background: 'linear-gradient(90deg, #FFF0C5 0%, #F8F7F4 50%, #F6F8FB 100%)' }}>
        
        <div className="flex flex-col items-start max-w-[800px] mb-8 md:mb-0">
          <span style={{ fontFamily: 'Inter', fontWeight: 700, fontStyle: 'Bold', fontSize: '10px', color: '#16539D', marginBottom: '12px' }}>
            REFERRAL PROGRAM
          </span>
          <h2 style={{ fontFamily: 'Sk-Modernist', fontWeight: 700, fontStyle: 'Bold', fontSize: '30px', color: '#111B2C', marginBottom: '12px' }}>
            Learn Together. Grow Together.
          </h2>
          <p style={{ fontFamily: 'Inter', fontWeight: 400, fontStyle: 'Regular', fontSize: '12px', color: '#52637A' }}>
            Invite friends, classmates, and peers to discover Vyntra using your unique referral code.<br className="hidden lg:block"/>
            Eligible successful referrals may unlock discounts, rewards, and additional recognition.
          </p>
        </div>

        <div className="flex-shrink-0 md:ml-8">
          <button style={{ fontFamily: 'Inter', fontWeight: 700, fontStyle: 'Bold', fontSize: '15px', color: '#FFFFFF', marginBottom: '12px' }} className="bg-[#080F1D] hover:bg-[#1F2937] px-7 py-3 rounded-full transition-all whitespace-nowrap shadow-md">
            Invite & Earn
          </button>
        </div>
        
      </div>
    </div>
  );
};

export default ReferralCard;
