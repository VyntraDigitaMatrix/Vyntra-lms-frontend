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
          <span style={{fontFamily: 'Inter', fontWeight:400, fontStyle: 'Regular', fontSize: '11px', color: '#EAF0FA'}}>Next Full-Stack Career Track cohort opens Aug 18</span>
          <a href="#" style={{fontFamily: 'Inter', fontWeight: 700, fontStyle: 'Bold', fontSize: '11px', color: '#F5A623'}} className="hover:underline flex items-center ml-2">
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
             <img src={Logo} className='w-full h-[28px]'/>
          </div>
          <img src={LogoName} className='w-full h-[48px]' />
        </div>

        {/* Mobile Right Spacer (to balance absolute center if flex container flexes differently) */}
        <div className="md:hidden w-6 h-6"></div>

        {/* Links */}
        <div style={{fontFamily: 'Inter', fontWeight: 400, fontStyle: 'Regular', fontSize: '14px', color: '#43506A'}} className="hidden md:flex items-center gap-15">
          <a href="#" className="hover:text-[#03448E] transition-colors">How it Works</a>
          <a href="#" className="hover:text-[#03448E] transition-colors">Programs</a>
          <a href="#" className="hover:text-[#03448E] transition-colors">Courses</a>
          <a href="#" className="hover:text-[#03448E] transition-colors">Pricing</a>
          <a href="#" className="hover:text-[#03448E] transition-colors">About Us</a>
        </div>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center space-x-6">
          <a href="#" style={{fontFamily: 'Inter', fontWeight: 700, fontStyle: 'Bold', fontSize: '14px', color: '#0A2647'}}>Log in</a>
          <button style={{fontFamily: 'Inter', fontWeight: 700, fontStyle: 'Bold', fontSize: '13px', color: '#FFFFFF'}} className="bg-[#0B2748] px-5 py-2 rounded-2xl">
            Start Learning
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-xl z-40 border-t border-gray-100 pb-6 px-6 pt-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col gap-4" style={{fontFamily: 'Inter', fontWeight: 400, fontSize: '15px', color: '#43506A'}}>
            <a href="#" className="hover:text-[#03448E] py-2 border-b border-gray-50">How it Works</a>
            <a href="#" className="hover:text-[#03448E] py-2 border-b border-gray-50">Programs</a>
            <a href="#" className="hover:text-[#03448E] py-2 border-b border-gray-50">Courses</a>
            <a href="#" className="hover:text-[#03448E] py-2 border-b border-gray-50">Pricing</a>
            <a href="#" className="hover:text-[#03448E] py-2 border-b border-gray-50">About Us</a>
            
            <div className="flex flex-col gap-3 mt-2">
              <a href="#" style={{fontWeight: 700, color: '#0A2647'}} className="text-center py-2">Log in</a>
              <button style={{fontWeight: 700, fontSize: '14px', color: '#FFFFFF'}} className="bg-[#0B2748] px-5 py-3 rounded-2xl w-full text-center">
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
