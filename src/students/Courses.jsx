import React, { useMemo, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import S6 from "../assets/s6.jpg";
import S7 from "../assets/s7.jpg";
import S8 from "../assets/s8.jpg";
import S9 from "../assets/s9.jpg";
import S10 from "../assets/s10.jpg";
import S11 from "../assets/s11.jpg";
import S12 from "../assets/s12.jpg";
import S13 from "../assets/s13.jpg";

import { FaEye, FaDownload, FaHeartBroken, FaHeart } from "react-icons/fa"

const Courses = () => {
  const navigate = useNavigate();
  const [openMenuId, setOpenMenuId] = useState(null);
  const [activeTab, setActiveTab] = useState("All Courses");
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("All");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const courses = [
    {
      id: 1,
      title: "Digital Marketing ",
      instructor: "Sarah Johnson",
      progress: 65,
      status: "In Progress",
      time: "6h 20m",
      wishlist: true,
      image: S6,
      button: "Continue Learning",
    },
    {
      id: 2,
      title: "SEO Mastery Course",
      instructor: "Alex Thompson",
      progress: 40,
      status: "In Progress",
      time: "4h 15m",
      wishlist: false,
      image: S8,
      button: "Continue Learning",
    },
    {
      id: 3,
      title: "Google Ads for Beginners",
      instructor: "Michael Smith",
      progress: 20,
      status: "In Progress",
      time: "3h 10m",
      wishlist: true,
      image: S9,
      button: "Continue Learning",
    },
    {
      id: 4,
      title: "Email Marketing Strategy",
      instructor: "Priya Sharma",
      progress: 100,
      status: "Completed",
      time: "5h 30m",
      wishlist: false,
      image: S10,
      button: "Review Course",
    },
    {
      id: 5,
      title: "Social Media Marketing",
      instructor: "Neha Patel",
      progress: 75,
      status: "In Progress",
      time: "4h 50m",
      wishlist: true,
      image: S7,
      button: "Continue Learning",
    },
    {
      id: 6,
      title: "Web Analytics with GA4",
      instructor: "David Wilson",
      progress: 0,
      status: "Not Started",
      time: "0h",
      wishlist: false,
      image: S11,
      button: "Start Learning",
    },
    {
      id: 7,
      title: "Content Marketing Basics",
      instructor: "Anjali Mehta",
      progress: 100,
      status: "Completed",
      time: "4h 30m",
      wishlist: false,
      image: S12,
      button: "Review Course",
    },
    {
      id: 8,
      title: "Marketing Automation",
      instructor: "Kiran Rao",
      progress: 0,
      status: "Not Started",
      time: "0h",
      wishlist: true,
      image: S13,
      button: "Start Learning",
    },
  ];

  const [wishlistSet, setWishlistSet] = useState(
    () => new Set(courses.filter((c) => c.wishlist).map((c) => c.id))
  );

  const toggleWishlist = (id) => {
    setWishlistSet((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  useEffect(() => {
    const handleClick = () => setOpenMenuId(null);
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);



  const tabs = ["All Courses", "In Progress", "Completed", "Wishlist"];

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchesSearch =
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesTab =
        activeTab === "All Courses" ||
        course.status === activeTab ||
        (activeTab === "Wishlist" && course.wishlist);

      const matchesFilter =
        filter === "All" ||
        course.status === filter ||
        (filter === "Wishlist" && course.wishlist);

      return matchesSearch && matchesTab && matchesFilter;
    });
  }, [activeTab, searchTerm, filter]);

  const enrolledCount = courses.length;
  const inProgressCount = courses.filter(
    (course) => course.status === "In Progress"
  ).length;
  const completedCount = courses.filter(
    (course) => course.status === "Completed"
  ).length;
  const wishlistCount = wishlistSet.size;

  return (
    <div className="min-h-screen bg-[#f6f7fb] p-3 sm:p-4 md:p-5">
      <div className="max-w-7xl mx-auto">
        {/* Header Section - Responsive */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4 sm:mb-5">
          <div className="w-full lg:w-auto">
            <p className="text-xs sm:text-sm text-gray-400 mb-1">
              <Link
                to="/student/dashboard"
                className="hover:text-blue-600 transition"
              >
                Dashboard
              </Link>
              <span className="mx-2">&gt;</span>
              <span className="text-gray-600 font-medium">My Courses</span>
            </p>
            <h1 className="text-lg sm:text-xl font-bold text-gray-900">
              My Courses
            </h1>

            {/* Tabs - Horizontal scroll on mobile */}
            <div className="flex gap-4 sm:gap-6 md:gap-8 mt-3 sm:mt-4 text-xs sm:text-sm font-semibold overflow-x-auto pb-2">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-2 transition whitespace-nowrap ${activeTab === tab
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-blue-600"
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Search and Filter - Stack on mobile, row on desktop */}
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <input
              type="text"
              placeholder="Search my courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-[260px] h-10 sm:h-11 px-3 sm:px-4 rounded-xl border border-gray-200 outline-none text-sm focus:border-blue-500 bg-white"
            />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full sm:w-auto h-10 sm:h-11 px-3 sm:px-4 rounded-xl border border-gray-200 text-sm font-semibold bg-white outline-none hover:bg-blue-50 focus:outline-none focus:ring-0 focus:border-gray-200"
            >
              <option>All</option>
              <option>In Progress</option>
              <option>Completed</option>
              <option>Not Started</option>
              <option>Wishlist</option>
            </select>
          </div>
        </div>

        {/* Stats Cards - Responsive grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-5">
          <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-gray-100 shadow-sm hover:shadow-md transition">
            <p className="text-xs sm:text-sm text-gray-500">Enrolled Courses</p>
            <h2 className="text-xl sm:text-2xl font-bold mt-1 text-gray-800">
              {enrolledCount}
            </h2>
          </div>
          <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-gray-100 shadow-sm hover:shadow-md transition">
            <p className="text-xs sm:text-sm text-gray-500">In Progress</p>
            <h2 className="text-xl sm:text-2xl font-bold mt-1 text-gray-800">
              {inProgressCount}
            </h2>
          </div>
          <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-gray-100 shadow-sm hover:shadow-md transition">
            <p className="text-xs sm:text-sm text-gray-500">Completed</p>
            <h2 className="text-xl sm:text-2xl font-bold mt-1 text-gray-800">
              {completedCount}
            </h2>
          </div>
          <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-gray-100 shadow-sm hover:shadow-md transition">
            <p className="text-xs sm:text-sm text-gray-500">Wishlist</p>
            <h2 className="text-xl sm:text-2xl font-bold mt-1 text-gray-800">
              {wishlistCount}
            </h2>
          </div>
        </div>

        {/* Courses Grid - Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-xl sm:rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300"
            >
              <div className="relative">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-[120px] sm:h-[130px] object-cover"
                />
                <span className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-blue-600 text-white text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full">
                  {course.progress}%
                </span>
                <button
                  onClick={(e) => { e.stopPropagation(); toggleWishlist(course.id); }}
                  className="absolute top-2 left-2 bg-white rounded-full w-7 h-7 flex items-center justify-center shadow-sm hover:scale-110 transition"
                  aria-label={wishlistSet.has(course.id) ? "Remove from wishlist" : "Add to wishlist"}
                >
                  {wishlistSet.has(course.id) ? (
                    <svg className="w-4 h-4 text-red-500 fill-red-500" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
                  ) : (
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                  )}
                </button>
              </div>
              <div className="p-3 sm:p-4">
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <h2 className="font-bold text-gray-900 text-xs sm:text-sm leading-5">
                      {course.title}
                    </h2>
                    <p className="text-[11px] sm:text-xs text-gray-500 mt-1 sm:mt-2 truncate">
                      By {course.instructor}
                    </p>
                  </div>
                  <div className="relative">
                    <button
                      onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === course.id ? null : course.id); }}
                      className="text-gray-400 text-xl hover:text-blue-600 shrink-0 px-1 rounded hover:bg-gray-100 transition"
                      aria-label="Course options"
                    >
                      ⋮
                    </button>

                    {openMenuId === course.id && (
                      <div className="absolute right-0 top-7 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
                        <button onClick={() => { navigate(`/student/continue-learning/${course.id}`); setOpenMenuId(null); }}
                          className="flex items-center gap-2 w-full px-4 py-2.5 text-xs text-gray-700 hover:bg-gray-50 transition">
                          <FaEye className="text-blue-600" /> View Details
                        </button>

                        <button onClick={() => { /* download logic */ setOpenMenuId(null); }}
                          className="flex items-center gap-2 w-full px-4 py-2.5 text-xs text-gray-700 hover:bg-gray-50 transition">
                          <FaDownload className="text-green-600" /> Download Certificate
                        </button>
                        <hr className="border-gray-100" />
                        <button
                          onClick={() => {
                            toggleWishlist(course.id);
                            setOpenMenuId(null);
                          }}
                          className="flex items-center gap-2 w-full px-4 py-2.5 text-xs text-gray-700 hover:bg-gray-50 transition"
                        >
                          {wishlistSet.has(course.id) ? (
                            <>
                              <FaHeartBroken className="text-red-500" />
                              Remove from Wishlist
                            </>
                          ) : (
                            <>
                              <FaHeart className="text-pink-500" />
                              Add to Wishlist
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="mt-3 sm:mt-4">
                  <div className="w-full h-1.5 sm:h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full transition-all"
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>

                  <div className="flex justify-between mt-1.5 sm:mt-2">
                    <span className="text-[10px] sm:text-xs text-gray-500">
                      {course.status}
                    </span>
                    <span className="text-[10px] sm:text-xs text-gray-500">
                      {course.progress}% Complete
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => navigate(`/student/continue-learning/${course.id}`)}
                  className="w-full mt-3 sm:mt-4 h-9 sm:h-10 rounded-lg border border-blue-200 text-blue-600 text-xs sm:text-sm font-semibold hover:bg-blue-600 hover:text-white transition"
                >
                  {course.button}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* No Results Found */}
        {filteredCourses.length === 0 && (
          <div className="bg-white mt-6 rounded-xl sm:rounded-2xl p-6 sm:p-8 text-center text-gray-500 text-sm sm:text-base">
            No courses found
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;