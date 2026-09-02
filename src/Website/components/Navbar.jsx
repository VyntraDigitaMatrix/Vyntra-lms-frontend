import React from 'react';
import Logo from '../assets/vyntra-mark.png';
import LogoName from '../assets/logo-plain.jpg';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <header className="w-full relative z-50">
      {/* Top Banner */}
      <div className="w-full bg-[#0A2647] py-3 px-4 flex justify-center items-center gap-6">
        <div className="flex items-center gap-8">
          <span className="font-inter font-normal text-[13px] sm:text-[14px] md:text-[21px] lg:text-[13px] xl:text-[14px] 2xl:text-[16px] text-[#EAF0FA]">Next Full-Stack Career Track cohort opens Aug 18</span>
          <a href="/UserLogin" className="font-inter font-bold text-[13px] sm:text-[14px] md:text-[21px] lg:text-[13px] xl:text-[14px] 2xl:text-[16px] text-[#F5A623] hover:underline flex items-center ml-2">
            Reserve a seat <span className="ml-1">&rarr;</span>
          </a>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="w-full relative bg-[#F5F7FBDB] py-2 px-6 md:px-12 flex justify-between items-center h-[64px] md:h-auto">

        {/* Mobile Menu Icon (Visible on small screens) */}
        <div className="md:hidden flex items-center z-20">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-[#0A2647] focus:outline-none p-1">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              )}
            </svg>
          </button>
        </div>

        {/* Logo */}
        <div className="absolute left-1/2 transform -translate-x-1/2 md:static md:translate-x-0 md:left-auto flex items-center cursor-pointer z-10">
          <div className="flex items-center">
            <img src={Logo} className='w-full h-[28px]' />
          </div>
          <img src={LogoName} className='w-full h-[48px]' />
        </div>

        {/* Mobile Right Spacer (to balance absolute center if flex container flexes differently) */}
        <div className="md:hidden w-6 h-6"></div>

        {/* Links */}
        <div className="font-inter font-normal text-[16px] md:text-[14px] lg:text-[15px] xl:text-[17px] 2xl:text-[18px] text-[#43506A] hidden md:flex items-center gap-8 lg:gap-12 xl:gap-15 2xl:gap-20">
          <a href="/#how-it-works" className="hover:text-[#03448E] transition-colors">How it Works</a>
          <a href="/#progress" className="hover:text-[#03448E] transition-colors">Progress</a>
          <a href="/#courses" className="hover:text-[#03448E] transition-colors">Courses</a>
          <a href="/#job-portal" className="hover:text-[#03448E] transition-colors">Job Portal</a>
          <a href="/#testimonials" className="hover:text-[#03448E] transition-colors">Testimonials</a>
        </div>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center space-x-4 lg:space-x-6 xl:space-x-8">
          <a href="/login" className="font-inter font-bold text-[16px] md:text-[14px] lg:text-[15px] xl:text-[17px] 2xl:text-[18px] text-[#0A2647]">Log in</a>
          <button onClick={() => window.location.href = '/UserLogin'} className="font-inter font-bold text-[15px] md:text-[13px] lg:text-[14px] xl:text-[16px] 2xl:text-[17px] text-[#FFFFFF] bg-[#0B2748] px-4 py-2 lg:px-5 lg:py-2.5 xl:px-6 xl:py-3 rounded-2xl">
            Start Learning
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-xl z-40 border-t border-gray-100 pb-6 px-6 pt-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col gap-6 font-inter font-normal text-[20px] text-[#43506A] px-2 py-4">
            <a href="/#how-it-works" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#03448E] py-3 border-b border-gray-50">How it Works</a>
            <a href="/#progress" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#03448E] py-3 border-b border-gray-50">Progress</a>
            <a href="/#courses" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#03448E] py-3 border-b border-gray-50">Courses</a>
            <a href="/#job-portal" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#03448E] py-3 border-b border-gray-50">Job Portal</a>
            <a href="/#testimonials" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#03448E] py-3 border-b border-gray-50">Testimonials</a>

            <div className="flex flex-col gap-4 mt-6">
              <a href="/login" className="font-bold text-[#0A2647] text-[20px] text-center py-3">Log in</a>
              <button onClick={() => window.location.href = '/UserLogin'} className="font-bold text-[18px] text-[#FFFFFF] bg-[#0B2748] px-5 py-4 rounded-2xl w-full text-center">
                Start Learning
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
