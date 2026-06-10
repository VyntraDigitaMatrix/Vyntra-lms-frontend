import React, { useState } from "react";
import { Link } from "react-router-dom";
import S1 from "../assets/S1.jpg";
import S2 from "../assets/S2.jpg";
import S3 from "../assets/S3.jpg";
import S4 from "../assets/S4.jpg";
import S5 from "../assets/S5.jpg";
import S6 from "../assets/S6.jpg";
import S7 from "../assets/S7.jpg";
import S8 from "../assets/S8.jpg";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const AllCourses = () => {
  const [sortBy, setSortBy] = useState("Popular");
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 4;

  const courses = [
    {
      id: 1,
      title: "Digital Marketing Fundamentals",
      badge: "Bestseller",
      image: S1,
      rating: "4.7",
      reviews: "1,250",
      lessons: "28 Lessons",
      desc: "Learn the basics of digital marketing and kickstart your career.",
      price: "₹999",
      oldPrice: "₹2,499",
      offer: "60% OFF",
      priceValue: 999,
    },
    {
      id: 2,
      title: "Search Engine Optimization (SEO)",
      badge: "Popular",
      image: S2,
      rating: "4.6",
      reviews: "980",
      lessons: "26 Lessons",
      desc: "Master SEO strategies to rank higher on search engines.",
      price: "₹1,199",
      oldPrice: "₹2,999",
      offer: "60% OFF",
      priceValue: 1199,
    },
    {
      id: 3,
      title: "Social Media Marketing Mastery",
      badge: "Trending",
      image: S3,
      rating: "4.8",
      reviews: "1,450",
      lessons: "30 Lessons",
      desc: "Build brand awareness using powerful social platforms.",
      price: "₹1,299",
      oldPrice: "₹2,999",
      offer: "57% OFF",
      priceValue: 1299,
    },
    {
      id: 4,
      title: "Email Marketing Essentials",
      badge: "",
      image: S4,
      rating: "4.5",
      reviews: "760",
      lessons: "18 Lessons",
      desc: "Learn email marketing strategies that drive results.",
      price: "₹899",
      oldPrice: "₹1,999",
      offer: "55% OFF",
      priceValue: 899,
    },
    {
      id: 5,
      title: "YouTube Marketing Success",
      badge: "",
      image: S5,
      rating: "4.7",
      reviews: "820",
      lessons: "22 Lessons",
      desc: "Grow your YouTube channel and brand with proven strategies.",
      price: "₹1,099",
      oldPrice: "₹2,699",
      offer: "50% OFF",
      priceValue: 1099,
    },
    {
      id: 6,
      title: "Google Ads Campaigns",
      badge: "",
      image: S6,
      rating: "4.6",
      reviews: "650",
      lessons: "20 Lessons",
      desc: "Run profitable ad campaigns and get high ROI.",
      price: "₹1,299",
      oldPrice: "₹2,999",
      offer: "57% OFF",
      priceValue: 1299,
    },
    {
      id: 7,
      title: "Google Analytics Mastery",
      badge: "",
      image: S7,
      rating: "4.6",
      reviews: "540",
      lessons: "16 Lessons",
      desc: "Analyze data and make smart marketing decisions.",
      price: "₹899",
      oldPrice: "₹1,999",
      offer: "55% OFF",
      priceValue: 899,
    },
    {
      id: 8,
      title: "E-commerce Marketing Strategies",
      badge: "",
      image: S8,
      rating: "4.7",
      reviews: "610",
      lessons: "24 Lessons",
      desc: "Boost sales and grow your online business.",
      price: "₹1,199",
      oldPrice: "₹2,499",
      offer: "52% OFF",
      priceValue: 1199,
    },
  ];

  const sortedCourses = [...courses].sort((a, b) => {
    if (sortBy === "Popular") return Number(b.rating) - Number(a.rating);
    if (sortBy === "Latest") return b.id - a.id;
    if (sortBy === "Price Low") return a.priceValue - b.priceValue;
    if (sortBy === "Price High") return b.priceValue - a.priceValue;
    return 0;
  });

  const totalPages = Math.ceil(sortedCourses.length / coursesPerPage);
  const paginatedCourses = sortedCourses.slice(
    (currentPage - 1) * coursesPerPage,
    currentPage * coursesPerPage
  );

  const changePage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f7fb] p-3 sm:p-4 md:p-5">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-4 sm:mb-5">
          <p className="text-xs sm:text-sm text-gray-400 mb-1">
            <Link to="/student/dashboard" className="hover:text-blue-600 transition">
              Dashboard
            </Link>
            <span className="mx-2">&gt;</span>
            <span className="text-gray-700 font-medium text-xs sm:text-sm">All Courses</span>
          </p>
          <h1 className="text-lg sm:text-xl font-bold text-gray-900 mt-2 sm:mt-3">
            All Courses
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">
            Explore our comprehensive digital marketing courses and enhance your skills.
          </p>
        </div>

        {/* Sort and Results Row - Responsive */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <p className="text-xs sm:text-sm text-gray-500 order-2 sm:order-1">
            Showing 1-{sortedCourses.length} of {sortedCourses.length} courses
          </p>
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              setCurrentPage(1);
            }}
            className="h-9 sm:h-10 px-3 sm:px-5 rounded-xl border border-gray-200 bg-white text-xs sm:text-sm outline-none focus:ring-0 focus:border-gray-200 order-1 sm:order-2 w-full sm:w-auto"
          >
            <option value="Popular">Sort by: Popular</option>
            <option value="Latest">Sort by: Latest</option>
            <option value="Price Low">Sort by: Price Low</option>
            <option value="Price High">Sort by: Price High</option>
          </select>
        </div>

        {/* Courses Grid - Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {paginatedCourses.map((course, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300"
            >
              <div className="relative">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-[120px] sm:h-[130px] object-cover"
                />
                {course.badge && (
                  <span className="absolute top-2 sm:top-3 left-2 sm:left-3 bg-blue-600 text-white text-[10px] sm:text-[11px] font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full">
                    {course.badge}
                  </span>
                )}
              </div>
              <div className="p-3 sm:p-4">
                <h2 className="font-bold text-gray-900 text-xs sm:text-sm leading-5 min-h-[36px] sm:min-h-[40px] line-clamp-2">
                  {course.title}
                </h2>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-2 sm:mt-3 text-[11px] sm:text-xs text-gray-500">
                  <div className="flex items-center gap-0.5">
                    <span className="text-yellow-400">★</span>
                    <span>{course.rating}</span>
                  </div>
                  <span>({course.reviews})</span>
                  <span>{course.lessons}</span>
                </div>
                <p className="text-[11px] sm:text-xs text-gray-500 mt-2 sm:mt-3 leading-4 sm:leading-5 min-h-[32px] sm:min-h-[40px] line-clamp-2">
                  {course.desc}
                </p>
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-2 sm:mt-3">
                  <span className="font-bold text-gray-900 text-xs sm:text-sm">{course.price}</span>
                  <span className="text-[10px] sm:text-xs text-gray-400 line-through">
                    {course.oldPrice}
                  </span>
                  <span className="text-[10px] sm:text-xs text-green-600 font-bold">
                    {course.offer}
                  </span>
                </div>
                <Link
                  to={`/student/course-preview/${course.id}`}
                  className="block mt-3 sm:mt-4 text-center text-xs sm:text-sm font-medium text-white bg-blue-600 px-3 py-1.5 sm:py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  View Course
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination - Responsive with horizontal scroll on mobile */}
        <div className="flex justify-center items-center gap-1 sm:gap-2 mt-6 sm:mt-7 overflow-x-auto pb-2">
          <button
            onClick={() => changePage(currentPage - 1)}
            disabled={currentPage === 1}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-md bg-gray-100 disabled:text-gray-300 flex items-center justify-center hover:bg-blue-50 transition-colors shrink-0"
          >
            <FaChevronLeft size={12} className="sm:text-sm" />
          </button>

          {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
            <button
              key={page}
              onClick={() => changePage(page)}
              className={`w-8 h-8 sm:w-9 sm:h-9 rounded-md text-xs sm:text-sm font-semibold transition-colors shrink-0 ${
                currentPage === page
                  ? "bg-blue-600 text-white"
                  : "bg-white border border-gray-200 text-gray-600 hover:bg-blue-50"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => changePage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-md bg-gray-100 disabled:text-gray-300 flex items-center justify-center hover:bg-blue-50 transition-colors shrink-0"
          >
            <FaChevronRight size={12} className="sm:text-sm" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AllCourses;