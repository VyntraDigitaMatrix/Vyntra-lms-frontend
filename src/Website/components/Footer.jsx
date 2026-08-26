import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full bg-white pt-16 pb-8 border-t border-gray-100">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16 2xl:px-24 flex flex-col">
        {/* Top Section */}
        {/* Top Section */}
        <div className="flex flex-col lg:flex-row justify-between mb-15 gap-12 lg:gap-8">

          {/* Left Column - Newsletter & Social */}
          <div className="flex flex-col items-start max-w-lg lg:w-[45%]">
            <h3 style={{ fontFamily: 'Inter', fontWeight: 700, fontStyle: 'Bold', fontSize: '22px', color: '#111535', marginBottom: '20px' }}>
              Stay connected for early access to our newest courses and special events
            </h3>

            <div className="flex flex-wrap items-center gap-4">
              {/* Social Icons */}
              <a href="#" className="w-12 h-12 rounded-full border-[2px] border-[#D4D7DF] flex items-center justify-center hover:border-gray-500 transition-colors">
                <svg className="w-5 h-5 text-[#10142F]" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
              </a>
              <a href="#" className="w-12 h-12 rounded-full border-[2px] border-[#D4D7DF] flex items-center justify-center hover:border-gray-500 transition-colors">
                <svg className="w-5 h-5 text-[#10142F]" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
              </a>
              <a href="#" className="w-12 h-12 rounded-full border-[2px] border-[#D4D7DF] flex items-center justify-center hover:border-gray-500 transition-colors">
                <span className="font-bold text-[#10142F] text-[14px]">in</span>
              </a>
              <a href="#" className="w-12 h-12 rounded-full border-[2px] border-[#D4D7DF] flex items-center justify-center hover:border-gray-500 transition-colors">
                <svg className="w-4 h-4 text-[#10142F]" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
              </a>

              <button className="flex items-center gap-3 bg-[#F0EAFF] hover:bg-[#DED2F0] text-[#4323CA] font-medium text-[13px] md:text-[14px] px-4 py-3 rounded-full transition-colors ml-2">
                Sign up for our newsletter
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              </button>
            </div>
          </div>

          {/* Right Columns - Links */}
          <div className="flex flex-col sm:flex-row gap-12 sm:gap-16 lg:w-auto lg:justify-end">

            {/* Navigation */}
            <div className="flex flex-col">
              <h4 style={{ fontFamily: 'Inter', fontWeight: 700, fontStyle: 'Bold', fontSize: '15px', color: '#111535', marginBottom: '20px' }}>Navigation</h4>
              <ul className="flex flex-col gap-4">
                <li><a href="#" style={{ fontFamily: 'Inter', fontWeight: 400, fontStyle: 'Regular', fontSize: '14px', color: '#4D5268' }}>About Vyntra</a></li>
                <li><a href="#" style={{ fontFamily: 'Inter', fontWeight: 400, fontStyle: 'Regular', fontSize: '14px', color: '#4D5268' }}>Learning Paths</a></li>
                <li><a href="#" style={{ fontFamily: 'Inter', fontWeight: 400, fontStyle: 'Regular', fontSize: '14px', color: '#4D5268' }}>Sessions</a></li>
                <li><a href="#" style={{ fontFamily: 'Inter', fontWeight: 400, fontStyle: 'Regular', fontSize: '14px', color: '#4D5268' }}>Community</a></li>
              </ul>
            </div>

            {/* Divider */}
            <div className="hidden sm:block w-[3px] bg-[#D7D9E0] h-full min-h-[160px]"></div>

            {/* Explore */}
            <div className="flex flex-col">
              <h4 style={{ fontFamily: 'Inter', fontWeight: 700, fontStyle: 'Bold', fontSize: '15px', color: '#111535', marginBottom: '20px' }}>Explore</h4>
              <ul className="flex flex-col gap-4">
                <li><a href="#" style={{ fontFamily: 'Inter', fontWeight: 400, fontStyle: 'Regular', fontSize: '14px', color: '#4D5268' }}>Career Opportunities</a></li>
                <li><a href="#" style={{ fontFamily: 'Inter', fontWeight: 400, fontStyle: 'Regular', fontSize: '14px', color: '#4D5268' }}>Success Stories</a></li>
                <li><a href="#" style={{ fontFamily: 'Inter', fontWeight: 400, fontStyle: 'Regular', fontSize: '14px', color: '#4D5268' }}>Blog</a></li>
                <li><a href="#" style={{ fontFamily: 'Inter', fontWeight: 400, fontStyle: 'Regular', fontSize: '14px', color: '#4D5268' }}>Help Center</a></li>
                <li><a href="#" style={{ fontFamily: 'Inter', fontWeight: 400, fontStyle: 'Regular', fontSize: '14px', color: '#4D5268' }}>Contact Us</a></li>
              </ul>
            </div>

          </div>
        </div>

        {/* Huge Text Section */}
        <div className="w-full relative overflow-hidden flex justify-center mt-2 md:-mt-8">
          <h1 className="text-[55px] sm:text-[80px] md:text-[110px] lg:text-[140px] xl:text-[200px] whitespace-nowrap relative z-10" style={{ fontFamily: 'Inter', fontWeight: 700, fontStyle: 'Bold', color: '#111633', lineHeight: '0.9' }}>
            Vyntra One
          </h1>
          {/* Masking div to hide the text below the line */}
          <div className="absolute bottom-0 left-0 w-full h-[12%] bg-white border-t-[3px] border-[#DFE1E8] z-20"></div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center text-[#60646B] text-[13px] pt-8 font-inter border-t border-gray-100/50">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 md:gap-10">
            <span>© 2024 Vyntra</span>
            <span>All Rights Reserved</span>
            <a href="#" className="hover:text-[#0F172A] transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-[#0F172A] transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-[#0F172A] transition-colors">Refund Policy</a>
          </div>

          <button className="flex items-center gap-1 hover:text-[#0F172A] transition-colors ml-2">
            English
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </button>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
