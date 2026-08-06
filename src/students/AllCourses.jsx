import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { studentLearningApi } from "./auth/api";
import S1 from "../assets/S1.jpg";
import S2 from "../assets/S2.jpg";
import S3 from "../assets/S3.jpg";
import S4 from "../assets/S4.jpg";
import S5 from "../assets/S5.jpg";
import S6 from "../assets/S6.jpg";
import S7 from "../assets/S7.jpg";
import S8 from "../assets/S8.jpg";
import { FaChevronLeft, FaChevronRight, FaGlobe, FaUserFriends } from "react-icons/fa";

const AllCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortBy, setSortBy] = useState("Popular");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const coursesPerPage = 6

  const fetchCourses = async () => {
    setLoading(true);
    setError("");
    try {
      let sortParam = "id,desc";
      if (sortBy === "Popular") sortParam = "averageRating,desc";
      else if (sortBy === "Latest") sortParam = "id,desc";

      const res = await studentLearningApi.getCourses(currentPage - 1, coursesPerPage, sortParam);
      if (res.data && res.data.data) {
        setCourses(res.data.data.content || []);
        setTotalPages(res.data.data.totalPages || 1);
        setTotalElements(res.data.data.totalElements || 0);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch courses catalog from server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [currentPage, sortBy]);

  const displayCourses = courses.map(course => ({
    ...course,
    id: course.courseId || course.id,
    title: course.title,
    badge: course.averageRating >= 4.7 ? "Bestseller" : "",
    image: course.thumbnailUrl || S1,
    rating: course.averageRating ? course.averageRating.toFixed(1) : "0.0",
    reviews: course.totalRatings || course.reviewCount || 0,
    lessons: `${course.totalModules || (course.modules || []).length || 0} Modules • ${course.totalLessons || (course.modules || []).reduce((acc, m) => acc + (m.lessons || []).length, 0) || 0} Lessons`,
    desc: course.shortDescription || "",
    price: course.free ? "Free" : (course.discountPrice ? `₹${course.discountPrice}` : (course.actualPrice ? `₹${course.actualPrice}` : (course.displayPrice ? `₹${course.displayPrice}` : ""))),
    oldPrice: course.free ? "" : (course.actualPrice && course.discountPrice ? `₹${course.actualPrice}` : ""),
    offer: course.free ? "" : (course.actualPrice && course.discountPrice ? `${Math.round(((course.actualPrice - course.discountPrice) / course.actualPrice) * 100)}% OFF` : ""),
    language: course.language || "English",
    totalEnrollments: course.totalEnrollments || 0,
    instructorNames: course.instructorNames || [],
    enrolled: course.enrolled || false
  }));

  const paginatedCourses = displayCourses;

  const changePage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="min-h-screen bg-navy-50/40 p-3 sm:p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Banner */}
        <div className="mb-4 sm:mb-5 bg-gradient-to-r from-navy-900 via-navy-800 to-navy-700 rounded-3xl p-5 sm:p-6 shadow-lg relative overflow-hidden">
          <div className="absolute -right-8 -top-10 w-40 h-40 rounded-full bg-brand-orange/15 blur-2xl pointer-events-none"></div>
          <p className="relative text-xs sm:text-sm text-navy-100/60 mb-1">
            <Link to="/student/dashboard" className="hover:text-brand-orange-light transition">
              Dashboard
            </Link>
            <span className="mx-2">&gt;</span>
            <span className="text-white font-medium text-xs sm:text-sm">All Courses</span>
          </p>
          <h1 className="relative text-lg sm:text-xl font-bold text-white mt-2 sm:mt-3">
            All Courses
          </h1>
          <div className="relative h-1 w-12 bg-brand-orange rounded-full mt-2 mb-2"></div>
          <p className="relative text-xs sm:text-sm text-navy-100/70">
            Explore our comprehensive digital marketing courses and enhance your skills.
          </p>
        </div>

        {/* Sort and Results Row - Responsive */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <p className="text-xs sm:text-sm text-gray-500 order-2 sm:order-1">
            Showing 1-{courses.length} of {totalElements} courses
          </p>
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              setCurrentPage(1);
            }}
            className="h-9 sm:h-10 px-3 sm:px-5 rounded-xl border border-gray-200 bg-white text-xs sm:text-sm outline-none focus:ring-1 focus:ring-navy-600 focus:border-navy-600 order-1 sm:order-2 w-full sm:w-auto"
          >
            <option value="Popular">Sort by: Popular</option>
            <option value="Latest">Sort by: Latest</option>
          </select>
        </div>

        {/* Courses Grid - Responsive */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="w-8 h-8 border-4 border-t-navy-800 border-gray-200 rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-center text-xs font-semibold">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
            {paginatedCourses.map((course, index) => (
              <div
                key={index}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300 flex flex-col h-full"
              >
                <div className="relative">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-[120px] sm:h-[150px] object-cover"
                  />
                  {course.badge && (
                    <span className="absolute top-2 sm:top-3 left-2 sm:left-3 bg-brand-orange text-white text-[10px] sm:text-[11px] font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full shadow-sm">
                      {course.badge}
                    </span>
                  )}
                </div>
                <div className="p-3 sm:p-4 flex flex-col flex-1">
                  <h2 className="font-bold text-gray-900 text-xs sm:text-sm leading-5 min-h-[36px] sm:min-h-[40px] line-clamp-2">
                    {course.title}
                  </h2>
                  {course.instructorNames?.length > 0 && (
                    <p className="text-[10px] sm:text-[11px] text-gray-400 mt-1 line-clamp-1">
                      By {course.instructorNames.join(", ")}
                    </p>
                  )}
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-2 sm:mt-3 text-[11px] sm:text-xs text-gray-500">
                    <div className="flex items-center gap-0.5">
                      <span className="text-yellow-400">★</span>
                      <span>{course.rating}</span>
                    </div>
                    <span>({course.reviews} reviews)</span>
                    <span>{course.lessons}</span>
                    {course.language && (
                      <span className="flex items-center gap-1"><FaGlobe size={10} /> {course.language}</span>
                    )}
                    {course.totalEnrollments > 0 && (
                      <span className="flex items-center gap-1"><FaUserFriends size={10} /> {course.totalEnrollments.toLocaleString()}</span>
                    )}
                  </div>
                  <p className="text-[11px] sm:text-xs text-gray-500 mt-2 sm:mt-3 leading-4 sm:leading-5 min-h-[32px] sm:min-h-[40px] line-clamp-2">
                    {course.desc}
                  </p>
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-auto pt-2 sm:pt-3">
                    <span className="font-bold text-gray-900 text-xs sm:text-sm">{course.price}</span>
                    <span className="text-[10px] sm:text-xs text-gray-400 line-through">
                      {course.oldPrice}
                    </span>
                    <span className="text-[10px] sm:text-xs text-green-600 font-bold">
                      {course.offer}
                    </span>
                  </div>
                  <Link
                    to={course.enrolled ? `/student/continue-learning/${course.slug || course.id}` : `/student/course-preview/${course.slug || course.courseId || course.id}`}
                    className={`block mt-3 sm:mt-4 text-center text-xs sm:text-sm font-medium px-3 py-1.5 sm:py-2 rounded-lg transition ${course.enrolled
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                      : "text-white bg-brand-orange hover:bg-brand-orange-dark"
                      }`}
                  >
                    {course.enrolled ? "Continue Learning" : "View Course"}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination - Responsive with horizontal scroll on mobile */}
        <div className="flex justify-center items-center gap-1 sm:gap-2 mt-6 sm:mt-7 overflow-x-auto pb-2">
          <button
            onClick={() => changePage(currentPage - 1)}
            disabled={currentPage === 1}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-md bg-gray-100 disabled:text-gray-300 flex items-center justify-center hover:bg-navy-100 transition-colors shrink-0"
          >
            <FaChevronLeft size={12} className="sm:text-sm" />
          </button>

          {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
            <button
              key={page}
              onClick={() => changePage(page)}
              className={`w-8 h-8 sm:w-9 sm:h-9 rounded-md text-xs sm:text-sm font-semibold transition-colors shrink-0 ${currentPage === page
                ? "bg-brand-orange text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:bg-navy-50"
                }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => changePage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-md bg-gray-100 disabled:text-gray-300 flex items-center justify-center hover:bg-navy-100 transition-colors shrink-0"
          >
            <FaChevronRight size={12} className="sm:text-sm" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AllCourses;