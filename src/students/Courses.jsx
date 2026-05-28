import React, { useMemo, useState } from "react";
import S6 from "../assets/s6.jpg";
import S7 from "../assets/s7.jpg";
import S8 from "../assets/s8.jpg";
import S9 from "../assets/s9.jpg";
import S10 from "../assets/s10.jpg";
import S11 from "../assets/s11.jpg";
import S12 from "../assets/s12.jpg";
import S13 from "../assets/s13.jpg";
const Courses = () => {
  const [activeTab, setActiveTab] = useState("All Courses");
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("All");

  const courses = [
    {
      title: "Digital Marketing ",
      instructor: "Sarah Johnson",
      progress: 65,
      status: "In Progress",
      time: "6h 20m",
      wishlist: true,
      image:
        S6,
      button: "Continue Learning",
    },
    {
      title: "SEO Mastery Course",
      instructor: "Alex Thompson",
      progress: 40,
      status: "In Progress",
      time: "4h 15m",
      wishlist: false,
      image:
        S8,
      button: "Continue Learning",
    },
    {
      title: "Google Ads for Beginners",
      instructor: "Michael Smith",
      progress: 20,
      status: "In Progress",
      time: "3h 10m",
      wishlist: true,
      image:
        S9,
      button: "Continue Learning",
    },
    {
      title: "Email Marketing Strategy",
      instructor: "Priya Sharma",
      progress: 100,
      status: "Completed",
      time: "5h 30m",
      wishlist: false,
      image:
        S10,
      button: "Review Course",
    },
    {
      title: "Social Media Marketing",
      instructor: "Neha Patel",
      progress: 75,
      status: "In Progress",
      time: "4h 50m",
      wishlist: true,
      image:
        S7,
      button: "Continue Learning",
    },
    {
      title: "Web Analytics with GA4",
      instructor: "David Wilson",
      progress: 0,
      status: "Not Started",
      time: "0h",
      wishlist: false,
      image:
        S11,
      button: "Start Learning",
    },
    {
      title: "Content Marketing Basics",
      instructor: "Anjali Mehta",
      progress: 100,
      status: "Completed",
      time: "4h 30m",
      wishlist: false,
      image:
        S12,
      button: "Review Course",
    },
    {
      title: "Marketing Automation",
      instructor: "Kiran Rao",
      progress: 0,
      status: "Not Started",
      time: "0h",
      wishlist: true,
      image:
        S13,
      button: "Start Learning",
    },
  ];

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
  const wishlistCount = courses.filter((course) => course.wishlist).length;

  return (
    <div className="min-h-screen bg-[#f7f8fc] p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Courses</h1>

            <div className="flex gap-8 mt-5 text-sm font-semibold">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-2 transition ${
                    activeTab === tab
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-500 hover:text-blue-600"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Search my courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-[260px] h-11 px-4 rounded-xl border border-gray-200 outline-none text-sm focus:border-blue-500"
            />

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="h-11 px-4 rounded-xl border border-gray-200 text-sm font-semibold bg-white outline-none hover:bg-blue-50 focus:outline-none focus:ring-0 focus:border-gray-200"
            >
              <option>All</option>
              <option>In Progress</option>
              <option>Completed</option>
              <option>Not Started</option>
              <option>Wishlist</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-5">
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition">
            <p className="text-sm text-gray-500">Enrolled Courses</p>
            <h2 className="text-2xl font-bold mt-1 text-none-600">
              {enrolledCount}
            </h2>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition">
            <p className="text-sm text-gray-500">In Progress</p>
            <h2 className="text-2xl font-bold mt-1 text-none-600">
              {inProgressCount}
            </h2>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition">
            <p className="text-sm text-gray-500">Completed</p>
            <h2 className="text-2xl font-bold mt-1 text-none-600">
              {completedCount}
            </h2>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition">
            <p className="text-sm text-gray-500">Wishlist</p>
            <h2 className="text-2xl font-bold mt-1 text-none-600">
              {wishlistCount}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          {filteredCourses.map((course, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300"
            >
              <div className="relative">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-[130px] object-cover"
                />

                <span className="absolute top-3 right-3 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                  {course.progress}%
                </span>

                {course.wishlist && (
                  <span className="absolute top-3 left-3 bg-white text-blue-600 text-xs font-bold px-3 py-1 rounded-full">
                    Wishlist
                  </span>
                )}
              </div>

              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="font-bold text-gray-900 text-sm leading-5">
                      {course.title}
                    </h2>
                    <p className="text-xs text-gray-500 mt-2">
                      By {course.instructor}
                    </p>
                  </div>

                  <button className="text-gray-400 text-xl hover:text-blue-600">
                    ⋮
                  </button>
                </div>

                <div className="mt-4">
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full"
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>

                  <div className="flex justify-between mt-2">
                    <span className="text-xs text-gray-500">
                      {course.status}
                    </span>
                    <span className="text-xs text-gray-500">
                      {course.progress}% Complete
                    </span>
                  </div>
                </div>

                <button className="w-full mt-4 h-10 rounded-lg border border-blue-200 text-blue-600 text-sm font-semibold hover:bg-blue-600 hover:text-white transition">
                  {course.button}
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="bg-white mt-6 rounded-2xl p-8 text-center text-gray-500">
            No courses found
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;