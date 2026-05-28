import React, { useState } from "react";
import { Link } from "react-router-dom";
const AllCourses = () => {
    const [sortBy, setSortBy] = useState("Popular");
  const courses = [
    {
        id: 1,
      title: "Digital Marketing Fundamentals",
      badge: "Bestseller",
      image: "https://images.unsplash.com/photo-1557838923-2985c318be48?q=80&w=1200&auto=format&fit=crop",
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
      image: "https://images.unsplash.com/photo-1562577309-4932fdd64cd1?q=80&w=1200&auto=format&fit=crop",
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
      image: "https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?q=80&w=1200&auto=format&fit=crop",
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
      image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1200&auto=format&fit=crop",
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
      image: "https://images.unsplash.com/photo-1611162616475-46b635cb6868?q=80&w=1200&auto=format&fit=crop",
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
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop",
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
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop",
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
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=1200&auto=format&fit=crop",
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
  return (
    <div className="min-h-screen bg-[#f7f8fc] p-6">
      <div className="max-w-7xl mx-auto">
    <div className="flex items-center justify-between mb-5">
  
  {/* Left Side */}
  <div>
    <p className="text-sm text-gray-400 mb-1">
      <Link
        to="/student/dashboard"
        className="hover:text-blue-600 transition"
      >
        Dashboard
      </Link>

      <span className="mx-2">&gt;</span>

      <span className="text-gray-600 font-medium">
        All Courses
      </span>
    </p>

    <h1 className="text-2xl font-bold text-gray-900">
      All Courses
    </h1>

    <p className="text-sm text-gray-500 mt-2">
      Explore our comprehensive digital marketing courses and enhance your skills.
    </p>
  </div>
</div>

        <div className="flex items-center justify-between -mt-4 mb-3">
          <p className="text-sm text-gray-500">Showing 1-8 of 24 courses</p>

         <select
  value={sortBy}
  onChange={(e) => setSortBy(e.target.value)}
  className="h-10 px-5 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:ring-0 focus:border-gray-200"
>
  <option value="Popular">Sort by: Popular</option>
  <option value="Latest">Sort by: Latest</option>
  <option value="Price Low">Sort by: Price Low</option>
  <option value="Price High">Sort by: Price High</option>
</select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
          {sortedCourses.map((course, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300"
            >
              <div className="relative">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-[130px] object-cover"
                />

                {course.badge && (
                  <span className="absolute top-3 left-3 bg-blue-600 text-white text-[11px] font-bold px-3 py-1 rounded-full">
                    {course.badge}
                  </span>
                )}
              </div>

              <div className="p-4">
                <h2 className="font-bold text-gray-900 text-sm leading-5 min-h-[40px]">
                  {course.title}
                </h2>

                <div className="flex items-center gap-3 mt-3 text-xs text-gray-500">
                  <span className="text-yellow-400">★</span>
                  <span>{course.rating} ({course.reviews})</span>
                  <span>{course.lessons}</span>
                </div>

                <p className="text-xs text-gray-500 mt-3 leading-5 min-h-[40px]">
                  {course.desc}
                </p>

                <div className="flex items-center gap-2 mt-3">
                  <span className="font-bold text-gray-900">{course.price}</span>
                  <span className="text-xs text-gray-400 line-through">
                    {course.oldPrice}
                  </span>
                  <span className="text-xs text-green-600 font-bold">
                    {course.offer}
                  </span>
                </div>

                <button className="w-full h-10 mt-4 rounded-lg border border-blue-500 text-blue-600 text-sm font-semibold hover:bg-blue-600 hover:text-white transition">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllCourses;