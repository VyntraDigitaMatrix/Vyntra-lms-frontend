import React from 'react';
import phone1 from '../assets/Phone-1.jpg.png';
import phone2 from '../assets/Phone-2.png';
import phone3 from '../assets/Phone-3.png';

const PhonesSection = () => {
  return (
    <div className="relative w-full max-w-full 2xl:max-w-[1536px] mx-auto h-[280px] sm:h-[400px] md:h-[550px] lg:h-[650px] xl:h-[750px] 2xl:h-[850px] flex justify-center items-start [clip-path:polygon(-100%_-100%,_200%_-100%,_200%_100%,_-100%_100%)]">
      {/* Blurred Colored Glows (Ellipses) */}
      <div className="absolute top-[15%] left-1/2 -translate-x-[350px] w-[445px] h-[445px] bg-[#76B3FF] rounded-full pointer-events-none" style={{ filter: 'blur(200px)', zIndex: 0 }} />
      <div className="absolute top-[5%] left-1/2 translate-x-[50px] w-[400px] h-[250px] bg-[#FEC453] rounded-full pointer-events-none" style={{ filter: 'blur(150px)', zIndex: 0 }} />

      {/* Phones container with relative positioning and responsive scaling wrapper */}
      <div className="relative w-full h-full overflow-visible flex justify-center mt-4 md:mt-8 lg:mt-2">
        <div className="relative flex justify-center w-full origin-top scale-[0.45] sm:scale-75 md:scale-90 lg:scale-100 xl:scale-110 transition-transform duration-300">
          {/* Left Phone */}
          <div className="absolute w-[500px] transform -rotate-[12deg] -translate-x-[240px] translate-y-[56px]" style={{ zIndex: 10 }}>
            <img
              src={phone1}
              alt="Live Classes View"
              className="relative w-full mix-blend-multiply"
            />
          </div>

          {/* Right Phone */}
          <div className="absolute w-[480px] transform rotate-[12deg] translate-x-[260px] translate-y-[56px]" style={{ zIndex: 10 }}>
            <img
              src={phone2}
              alt="Jobs View"
              className="relative w-full mix-blend-multiply"
            />
          </div>

          {/* Center Phone - Opaque to block side phones */}
          <img
            src={phone3}
            alt="Main Dashboard View"
            className="absolute w-[300px] rounded-[3rem] shadow-2xl transform translate-y-[16px]"
            style={{ zIndex: 20 }}
          />
        </div>
      </div>

      {/* Bottom Fade and Side Layer Blurs for Phones */}
      <div className="absolute bottom-0 left-0 right-0 h-[100px] sm:h-[150px] md:h-[280px] bg-gradient-to-t from-white via-white/90 to-transparent z-30 pointer-events-none" />

      {/* Side Layer Blurs */}
      <div className="hidden md:block absolute -bottom-10 -left-10 w-[250px] h-[400px] bg-white rounded-full filter blur-[70px] z-30 pointer-events-none opacity-90" />
      <div className="hidden md:block absolute -bottom-10 -right-10 w-[250px] h-[300px] bg-white rounded-full filter blur-[60px] z-30 pointer-events-none opacity-70" />
      <div className="absolute bottom-[-150px] md:bottom-[-240px] left-1/2 -translate-x-1/2 w-[400px] md:w-[800px] h-[200px] md:h-[400px] bg-white rounded-[100%] filter blur-[60px] md:blur-[80px] z-30 pointer-events-none" />
    </div>
  );
};

export default PhonesSection;
