import React from "react";
import { useNavigate } from "react-router-dom";
import S1 from "../assets/s1.jpg";
import S2 from "../assets/s2.jpg";
import S3 from "../assets/s3.jpg";
import S4 from "../assets/s4.jpg";
import S5 from "../assets/s5.jpg";
import {
  FaBookOpen,
  FaPlayCircle,
  FaTrophy,
  FaClock,
  FaArrowRight,
  FaEllipsisV,
  FaMedal,
  FaChevronDown,
  FaTv,
  FaCheckCircle,
  FaClipboardCheck,
  FaFileUpload,
} from "react-icons/fa";
const Dashboard = () => {
  const navigate = useNavigate();
const [selectedDays, setSelectedDays] = React.useState("This Week");
const [showDays, setShowDays] = React.useState(false);
  const courses = [
    {
      title: "Digital Marketing Fundamentals",
      progress: "65%",
      image:
        S3,
    },
    {
      title: "Search Engine Optimization (SEO)",
      progress: "40%",
      image:
        S2,
    },
    {
      title: "Social Media Marketing",
      progress: "25%",
      image:
        S4,
    },
    {
      title: "Email Marketing Mastery",
      progress: "10%",
      image:
        S5,
    },
  ];

  return (
    <div className="bg-[#f6f7fb] min-h-screen p-5">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-[#111827]">
          Welcome back, Shankar! 
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Let's continue your learning journey.
        </p>
      </div>

      {/* Top Grid */}
      <div className="grid grid-cols-12 gap-4 mt-4">
        {/* Left */}
        <div className="col-span-9 space-y-3">
          {/* Stats */}
          <div className="grid grid-cols-4 gap-2">
           <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
  <div className="flex items-center gap-3">
    
    {/* Icon */}
    <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 text-xl shrink-0">
      <FaBookOpen />
    </div>

    {/* Text Content */}
    <div className="flex-1">
      <div className="flex items-center justify-between"></div>
      <div>
      <h2 className="text-xl font-semibold text-gray-800 whitespace-nowrap">6</h2>

      <p className="text-[11px] text-gray-500 mt-0 leading-4">
        Courses Enrolled
      </p>
      </div>

      <button
        onClick={() => navigate("/student/courses")}
        className="text-blue-600 font-semibold flex items-center gap-1 text-xs mt-2"
      >
        View All <FaArrowRight size={10} />
      </button>
      
    </div>

  </div>
</div>

           <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
  <div className="flex items-center gap-3">
    
    {/* Icon */}
    <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center text-green-600 text-xl shrink-0">
      <FaTv />
    </div>

    {/* Text Content */}
    <div className="flex-1">
      <div>
      <h2 className="text-xl font-semibold text-gray-800 whitespace-nowrap">28</h2>

     <p className="text-[11px] text-gray-500 mt-0 whitespace-nowrap">
        Lessons Completed
      </p>
      </div>

      <button className="text-blue-600 text-sm font-semibold mt-1">
                View all
              </button>
    </div>

  </div>
</div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
  <div className="flex items-center gap-3">
    
    {/* Icon */}
    <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 text-xl shrink-0">
      <FaTrophy />
    </div>

    {/* Text Content */}
   <div className="flex-1">
    <div>
      <h2 className="text-xl font-semibold text-gray-800 whitespace-nowrap">4</h2>

      <p className="text-[11px] text-gray-500 mt-0 leading-4">
        Certificates Earned
      </p>
    </div>

     <button className="text-blue-600 text-sm font-semibold mt-1">
                View all
              </button>
    </div>

  </div>
</div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
  <div className="flex items-center gap-3">
    
    {/* Icon */}
    <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center text-red-500 text-xl shrink-0">
      <FaClock />
    </div>

    {/* Text Content */}
   <div className="flex-1">
    <div>
      <h2 className="text-xl font-semibold text-gray-800 whitespace-nowrap">32h 45m</h2>

     <p className="text-[11px] text-gray-500 mt-0 whitespace-nowrap">
        Total Learning Hours
      </p>
      </div>

      <button className="text-blue-600 text-sm font-semibold mt-1">
                View all
              </button>
    </div>
    </div>
</div>
</div>
          {/* Continue Learning */}
          <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold font-bold">
                Continue Learning
              </h2>

              <button
  onClick={() => navigate("/student/courses")}
  className="text-blue-600 font-semibold flex items-center gap-2 text-sm"
>
  View All Courses <FaArrowRight />
</button>
            </div>

            <div className="flex items-center gap-5 mt-5">
              <img
                src={S1}
                alt=""
                className="w-[260px] h-[160px] rounded-xl object-cover shrink-0"
              />

              <div className="flex flex-col justify-between h-[160px] flex-1">
                <h1 className="text-[13px] font-bold text-[#111827] leading-tight  leading-4">
                  Digital Marketing Fundamentals
                </h1>

                <p className="text-sm text-gray-500 mt-2">
                  Module 1: Introduction to Digital Marketing
                </p>

                <div className="mt-3">
                  <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div className="w-[65%] h-full bg-blue-600 rounded-full"></div>
                  </div>

                  <div className="flex justify-between mt-2 text-sm">
                    <span className="text-gray-500">
                      Last lesson: 1.3 Key Components of Digital Marketing
                    </span>

                    <span className="font-semibold text-blue-600">
                      65% Complete
                    </span>
                  </div>
                </div>

                <button className="mt-3 w-fit bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition">
                  Continue Learning
                </button>
              </div>
            </div>
          </div>
          {/* Courses */}
<div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
  <div className="flex items-center justify-between mb-4 ">
    <h2 className="text-xl font-bold">My Courses</h2>

    <button
      onClick={() => navigate("/student/courses")}
      className="text-blue-600 font-semibold flex items-center gap-2 text-sm"
    >
      View All Courses <FaArrowRight />
    </button>
  </div>
  {/* Updated Grid */}
<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-2">
  {courses.map((course, index) => (
    <div
      key={index}
      className="w-full border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition duration-300 bg-white"
    >
      {/* Reduced Image Height */}
      <img
        src={course.image}
        alt=""
        className="w-full h-[100px] object-cover"
      />

      {/* Reduced Card Height */}
      <div className="p-3">
        <div className="flex justify-between items-start gap-2">
          <h3 className="font-semibold text-sm leading-5 flex-1">
            {course.title}
          </h3>

          <FaEllipsisV className="text-gray-400 text-xs mt-1 cursor-pointer" />
        </div>

        <div className="mt-3">
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full"
              style={{ width: course.progress }}
            ></div>
          </div>

          <div className="flex justify-between mt-2 text-[11px]">
            <span className="text-gray-400">
              Last accessed: Today
            </span>

            <span className="font-semibold text-blue-600">
              {course.progress}
            </span>
          </div>
        </div>
      </div>
    </div>
  ))}
</div>
</div>

          {/* Activity */}
          <div className="bg-white rounded-xl p-2 shadow-sm border border-gray-100">
  <div className="flex justify-between items-center">
    <h2 className="text-xl font-bold">Recent Activity</h2>

    <button className="text-blue-600 font-semibold flex items-center gap-2">
      View All Activity <FaArrowRight />
    </button>
  </div>

  <div className="space-y-2 mt-3">
    {[
      {
        icon: <FaCheckCircle className="text-green-500 text-lg" />,
        text: "You completed lesson 1.3 Key Components of Digital Marketing",
      },
      {
        icon: <FaClipboardCheck className="text-yellow-500 text-lg" />,
        text: "You scored 80% in quiz Digital Marketing Basics",
      },
      {
        icon: <FaFileUpload className="text-blue-500 text-lg" />,
        text: "You submitted assignment SEO Keywords Research",
      },
    ].map((item, index) => (
      <div
        key={index}
        className="flex justify-between items-center border border-gray-100 rounded-xl p-4 hover:shadow-md transition"
      >
        <div className="flex items-start gap-3">
          
          {/* Icon */}
          <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center">
            {item.icon}
          </div>

          <div>
            <h3 className="font-semibold text-sm leading-6">
              {item.text}
            </h3>

            <p className="text-gray-400 text-sm mt-1">
              Digital Marketing Fundamentals
            </p>
          </div>
        </div>

        <span className="text-sm text-gray-400 whitespace-nowrap">
          Today, 10:30 AM
        </span>
      </div>
    ))}
  </div>
</div>
        </div>

        {/* Right */}
        <div className="col-span-3 py-0 space-y-2">
          {/* Progress */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center">
             <p className="text-[15px] text-bold mt-0 leading-4">
                Learning Progress
              </p>
<div className="relative">
  <button
    onClick={() => setShowDays(!showDays)}
    className="text-sm text-gray-500 flex items-center gap-1"
  >
    {selectedDays}
    <FaChevronDown size={10} />
  </button>

  {showDays && (
    <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-100 rounded-xl shadow-lg z-50 overflow-hidden">
      {["This Week", "20 Days"].map((day) => (
        <button
          key={day}
          onClick={() => {
            setSelectedDays(day);
            setShowDays(false);
          }}
          className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600"
        >
          {day}
        </button>
      ))}
    </div>
  )}
</div>
            </div>

            <div className="flex flex-col items-center mt-2">
              <div className="w-32 h-32 rounded-full border-[8px] border-blue-600 border-t-gray-200 flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-2xl font-bold">65%</h1>
                  <p className="text-gray-400 text-xs">
                    Overall Progress
                  </p>
                </div>
              </div>

              <p className="text-[15px] text-gray-500 mt-2 leading-4">
                You're doing great! Keep it up.
              </p>
            </div>

           <div className="mt-3 space-y-2 text-[14px]">
  <div className="flex justify-between">
  <div className="flex items-center gap-2">
    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
    <span>Completed Lessons</span>
  </div>

  <span className="font-semibold">28</span>
</div>

<div className="flex justify-between">
  <div className="flex items-center gap-2">
    <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
    <span>In Progress</span>
  </div>

  <span className="font-semibold">14</span>
</div>

<div className="flex justify-between">
  <div className="flex items-center gap-2">
    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
    <span>Not Started</span>
  </div>

  <span className="font-semibold">12</span>
</div>

  <div className="flex justify-between pt-1 border-t border-gray-200">
    <span className="font-semibold text-gray-700">
      Total Lessons
    </span>

    <span className="font-bold text-blue-600">
      54
    </span>
  </div>
</div>
          </div>

          {/* Deadlines */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-[14px]">
            <div className="flex justify-between items-center">
              <p className="text-[15px] text-bold mt-0 leading-4">
                Upcoming Deadlines
              </p>

              <button className="text-blue-600 font-semibold text-sm">
                View All
              </button>
            </div>

            <div className="space-y-5 mt-5">
              <div>
                <h3 className=" text-bold font-semibold mt-0 leading-4">
                  Quiz: Digital Marketing Basics
                </h3>
                <p className="text-gray-400 text-sm">
                  Due in 2 days
                </p>
              </div>

              <div>
                <h3 className="font-semibold">
                  Assignment: SEO Keywords
                </h3>
                <p className="text-gray-400 text-sm">
                  Due in 5 days
                </p>
              </div>

              <div>
                <h3 className="font-semibold">
                  Quiz: Social Media Marketing
                </h3>
                <p className="text-gray-400 text-sm">
                  Due in 6 days
                </p>
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-[14px]">
            <div className="flex justify-between items-center">
              <h1 className="text-[15px] text-bold mt-0 leading-4">
                Recent Achievements
              </h1>

              <button className="text-blue-600 font-semibold text-sm">
                View All
              </button>
            </div>

            <div className="space-y-5 mt-5">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-yellow-300 flex items-center justify-center text-yellow-600">
                  <FaMedal />
                </div>

                <div>
                  <h3 className="font-semibold">Quick Learner</h3>
                  <p className="text-gray-400 text-sm">
                    Completed 5 lessons
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-blue-300 flex items-center justify-center text-blue-600">
                  <FaMedal />
                </div>

                <div>
                  <h3 className="font-semibold">
                    Consistent Learner
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Studied 7 days in a row
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-orange-300 flex items-center justify-center text-orange-600">
                  <FaMedal />
                </div>

                <div>
                  <h3 className="font-semibold">Rising Star</h3>
                  <p className="text-gray-400 text-sm">
                    Scored 90% in a quiz
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;