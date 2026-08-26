import React from 'react';

const testimonialsData = [
  {
    quote: "Vyntra has completely transformed the way I learn. The courses are practical, engaging, and easy to follow. I've gained skills that actually helped me land my first job!",
    name: "Ananya Sharma",
    role: "Digital Marketing Executive",
    location: "Bangalore, India",
    quoteColor: "text-red-400",
    avatar: "https://i.pravatar.cc/150?u=ananya"
  },
  {
    quote: "The live classes and doubt solving sessions on Vyntra are amazing! The instructors explain everything so clearly and the projects help me build real confidence.",
    name: "Rohit Verma",
    role: "Business Analyst",
    location: "Pune, India",
    quoteColor: "text-orange-400",
    avatar: "https://i.pravatar.cc/150?u=rohit"
  },
  {
    quote: "From learning Stock Market basics to analyzing charts, Vyntra has everything in one place. The resources, quizzes, and community keep me motivated every day.",
    name: "Meera Iyer",
    role: "Stock Market Enthusiast",
    location: "Mumbai, India",
    quoteColor: "text-yellow-400",
    avatar: "https://i.pravatar.cc/150?u=meera"
  },
  {
    quote: "I love how Vyntra keeps learning fun and active. The assignments, leaderboards, and achievements push me to do better every day!",
    name: "Arjun Patel",
    role: "Full Stack Developer",
    location: "Ahmedabad, India",
    quoteColor: "text-green-400",
    avatar: "https://i.pravatar.cc/150?u=arjun"
  },
  {
    quote: "The structured courses and practical projects helped me switch my career from non-tech to IT. Vyntra gave me the right path and support.",
    name: "Neha Kapoor",
    role: "Software Developer",
    location: "Hyderabad, India",
    quoteColor: "text-blue-400",
    avatar: "https://i.pravatar.cc/150?u=neha"
  },
  {
    quote: "Vyntra's resume builder and job opportunities section helped me apply to the right jobs and track my progress easily.",
    name: "Karan Singh",
    role: "Data Analyst",
    location: "Delhi, India",
    quoteColor: "text-purple-400",
    avatar: "https://i.pravatar.cc/150?u=karan"
  },
  {
    quote: "The community and peer discussions on Vyntra make learning more enjoyable. You never feel alone in your journey!",
    name: "Sara Khan",
    role: "UI/UX Designer",
    location: "Chennai, India",
    quoteColor: "text-pink-400",
    avatar: "https://i.pravatar.cc/150?u=sara"
  }
];

const TestimonialCard = ({ testimonial }) => (
  <div className="bg-white rounded-[24px] p-8 shadow-sm flex flex-col h-full hover:shadow-md transition-shadow">
    <div className={`text-4xl font-serif leading-none mb-4 ${testimonial.quoteColor}`}>
      “
    </div>
    <p style={{ fontFamily: 'Inter', fontWeight: 400, fontStyle: 'Regular', fontSize: '14px', color: '#111318', marginBottom: '15px' }}>
      {testimonial.quote}
    </p>
    <div className="flex items-center gap-3 mt-auto">
      <img 
        src={testimonial.avatar} 
        alt={testimonial.name} 
        className="w-10 h-10 rounded-full object-cover"
      />
      <div>
        <h4 style={{ fontFamily: 'Inter', fontWeight: 700, fontStyle: 'Bold', fontSize: '13px', color: '#111318' }}>{testimonial.name}</h4>
        <p style={{ fontFamily: 'Inter', fontWeight: 400, fontStyle: 'Regular', fontSize: '11px', color: '#24272D' }}>{testimonial.role}</p>
        <p style={{ fontFamily: 'Inter', fontWeight: 400, fontStyle: 'Regular', fontSize: '11px', color: '#24272D' }}>{testimonial.location}</p>
      </div>
    </div>
  </div>
);

const Testimonials = () => {
  const row1 = testimonialsData.slice(0, 3);
  const row2 = testimonialsData.slice(3, 7);
  
  // Duplicate arrays to allow seamless infinite scrolling
  const duplicatedRow1 = [...row1, ...row1, ...row1];
  const duplicatedRow2 = [...row2, ...row2, ...row2];

  return (
    <div className="w-full pt-20 pb-10 overflow-hidden relative">
      <div className="max-w-[1440px] mx-auto w-full flex flex-col px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20">
        
        {/* Header Area */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 w-full mb-14">
          <div className="flex flex-col items-start xl:col-span-2">
            <div className="flex items-center gap-2 px-4 py-1.5 bg-[#EDE8FF] rounded-full mb-6">
              <span className="text-[#9333EA] text-[13px]">❤️</span>
              <span style={{ fontFamily: 'Inter', fontWeight: 400, fontStyle: 'Regular', fontSize: '11px', color: '#292553' }}>Loved by Learners</span>
            </div>
            
            <h2 style={{ fontFamily: 'Sk-Modernist', fontWeight: 400, fontStyle: 'Regular', fontSize: '45px', color: '#111318' }}>
              What people are saying about Vyntra?
            </h2>
            
            <p style={{ fontFamily: 'Inter', fontWeight: 400, fontStyle: 'Regular', fontSize: '15px', color: '#484B53', marginTop: '18px', marginBottom: '15px' }}>
              Don't just take our word for it—see what our learners have to say
              <br className="hidden md:block" />
              about their learning experience!
            </p>
          </div>
        </div>
      </div>

      {/* Marquee Rows Container */}
      <div className="w-full flex flex-col gap-6">
        {/* Top Row: Scrolls Left */}
        <div className="flex w-max animate-marquee-left pause-on-hover gap-6">
          {duplicatedRow1.map((testimonial, index) => (
            <div key={index} className="w-[320px] md:w-[380px] flex-shrink-0">
              <TestimonialCard testimonial={testimonial} />
            </div>
          ))}
        </div>
        
        {/* Bottom Row: Scrolls Right */}
        <div className="flex w-max animate-marquee-right pause-on-hover gap-6 ml-[-200px]">
          {duplicatedRow2.map((testimonial, index) => (
            <div key={index} className="w-[320px] md:w-[380px] flex-shrink-0">
              <TestimonialCard testimonial={testimonial} />
            </div>
          ))}
        </div>
      </div>
      
    </div>
  );
};

export default Testimonials;
