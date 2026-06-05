import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import S1 from "../assets/S1.jpg";
import S2 from "../assets/S2.jpg";
import S3 from "../assets/S3.jpg";
import S4 from "../assets/S4.jpg";
import S5 from "../assets/S5.jpg";
import S6 from "../assets/S6.jpg";
import S7 from "../assets/S7.jpg";
import S8 from "../assets/S8.jpg";

import {
    FaStar, FaUser, FaBook, FaClock, FaTrophy, FaCheckCircle,
    FaChevronDown, FaChevronUp, FaPlay, FaLock, FaShieldAlt, FaLinkedin,
    FaBullhorn, FaSearch, FaInstagram, FaPenNib, FaEnvelope, FaChartLine,
    FaPlayCircle,
} from "react-icons/fa";
import { AiOutlinePlaySquare } from "react-icons/ai";
import { IoCartOutline } from "react-icons/io5";

/* ── Stable lesson durations ── */
const FIXED_DURATIONS = [
    "10:24", "14:37", "18:05", "12:50", "16:42",
    "11:18", "19:33", "13:07", "15:55", "17:21",
    "10:48", "14:02", "12:36", "16:14", "18:59",
];

const generateLessons = (moduleTitle, count) => {
    const prefixes = [
        "Introduction to", "Understanding", "Deep Dive into",
        "Practical Guide to", "Advanced", "Hands-on", "Mastering",
    ];
    const topics = moduleTitle.replace(/Module \d+:\s*/i, "").split(" & ");
    return Array.from({ length: count }, (_, i) => ({
        id: i + 1,
        title: `${prefixes[i % prefixes.length]} ${topics[i % topics.length]}`,
        duration: FIXED_DURATIONS[i % FIXED_DURATIONS.length],
        isPreview: i === 0,
    }));
};

/* ── Data ── */
const coursesData = {
    1: {
        id: 1,
        title: "Digital Marketing Fundamentals",
        badge: "Bestseller",
        image: S1,
        rating: "4.7",
        reviews: "1,250",
        lessons: "28",
        desc: "Learn the basics of digital marketing and kickstart your career.",
        price: "₹999",
        oldPrice: "₹2,499",
        offer: "60% OFF",
        priceValue: 999,
    },
    2: {
        id: 2,
        title: "Search Engine Optimization (SEO)",
        badge: "Popular",
        image: S2,
        rating: "4.6",
        reviews: "980",
        lessons: "26",
        desc: "Master SEO strategies to rank higher on search engines.",
        price: "₹1,199",
        oldPrice: "₹2,999",
        offer: "60% OFF",
        priceValue: 1199,
    },
    3: {
        id: 3,
        title: "Social Media Marketing Mastery",
        badge: "Trending",
        image: S3,
        rating: "4.8",
        reviews: "1,450",
        lessons: "30",
        desc: "Build brand awareness using powerful social platforms.",
        price: "₹1,299",
        oldPrice: "₹2,999",
        offer: "57% OFF",
        priceValue: 1299,
    },
    4: {
        id: 4,
        title: "Email Marketing Essentials",
        badge: "",
        image: S4,
        rating: "4.5",
        reviews: "760",
        lessons: "18",
        desc: "Learn email marketing strategies that drive results.",
        price: "₹899",
        oldPrice: "₹1,999",
        offer: "55% OFF",
        priceValue: 899,
    },
    5: {
        id: 5,
        title: "YouTube Marketing Success",
        badge: "",
        image: S5,
        rating: "4.7",
        reviews: "820",
        lessons: "22",
        desc: "Grow your YouTube channel and brand with proven strategies.",
        price: "₹1,099",
        oldPrice: "₹2,699",
        offer: "50% OFF",
        priceValue: 1099,
    },
    6: {
        id: 6,
        title: "Google Ads Campaigns",
        badge: "",
        image: S6,
        rating: "4.6",
        reviews: "650",
        lessons: "20",
        desc: "Run profitable ad campaigns and get high ROI.",
        price: "₹1,299",
        oldPrice: "₹2,999",
        offer: "57% OFF",
        priceValue: 1299,
    },
    7: {
        id: 7,
        title: "Google Analytics Mastery",
        badge: "",
        image: S7,
        rating: "4.6",
        reviews: "540",
        lessons: "16",
        desc: "Analyze data and make smart marketing decisions.",
        price: "₹899",
        oldPrice: "₹1,999",
        offer: "55% OFF",
        priceValue: 899,
    },
    8: {
        id: 8,
        title: "E-commerce Marketing Strategies",
        badge: "",
        image: S8,
        rating: "4.7",
        reviews: "610",
        lessons: "24",
        desc: "Boost sales and grow your online business.",
        price: "₹1,199",
        oldPrice: "₹2,499",
        offer: "52% OFF",
        priceValue: 1199,
    },
};

const modulesData = [
    { title: "Module 1: Introduction to Digital Marketing", lessons: 5, color: "#7C3AED", icon: <FaBullhorn className="text-purple-600 text-lg" /> },
    { title: "Module 2: Search Engine Optimization (SEO)", lessons: 6, color: "#EA580C", icon: <FaSearch className="text-orange-600 text-lg" /> },
    { title: "Module 3: Social Media Marketing", lessons: 6, color: "#059669", icon: <FaInstagram className="text-green-600 text-lg" /> },
    { title: "Module 4: Content Marketing", lessons: 4, color: "#2563EB", icon: <FaPenNib className="text-blue-600 text-lg" /> },
    { title: "Module 5: Email Marketing", lessons: 4, color: "#DB2777", icon: <FaEnvelope className="text-pink-600 text-lg" /> },
    { title: "Module 6: Google Ads & Analytics", lessons: 3, color: "#D97706", icon: <FaChartLine className="text-amber-600 text-lg" /> },
];

const reviewsData = [
    { name: "Rajesh Kumar", initial: "R", rating: 5, time: "2 weeks ago", text: "Excellent course! Very detailed and practical examples." },
    { name: "Priya Sharma", initial: "P", rating: 4, time: "1 month ago", text: "Great content, very helpful for my career." },
    { name: "Amit Patel", initial: "A", rating: 5, time: "2 months ago", text: "Best course I've taken! Highly recommend." },
];

const faqsData = [
    { q: "Is this course for beginners?", a: "Yes, this course is designed for absolute beginners with no prior experience." },
    { q: "Will I get a certificate?", a: "Yes, you will receive a certificate of completion after finishing the course." },
    { q: "How long do I have access?", a: "You get lifetime access to all course materials." },
    { q: "Is there any support?", a: "Yes, you can ask questions in the discussion forum and get instructor support." },
];

/* ══════════════════════════════════════════════
   MODULE ACCORDION ITEM
   ══════════════════════════════════════════════ */
const FREE_MODULES = 2;

const ModuleAccordionItem = ({ mod, index, navigate, activeLesson, setActiveLesson }) => {
    const [open, setOpen] = useState(false);
    const isFree = index < FREE_MODULES;
    const lessons = React.useMemo(() => generateLessons(mod.title, mod.lessons), [mod.title, mod.lessons]);

    const handleLessonClick = (lessonIndex) => {
        if (!isFree) return;
        const lessonKey = `${index + 1}-${lessonIndex + 1}`;
        setActiveLesson(lessonKey);
        navigate(`/student/module/${index + 1}/lesson/${lessonIndex + 1}`);
    };

    return (
        <div className={`border rounded-xl overflow-hidden transition-all duration-200 ${open ? "border-blue-200 shadow-sm" : "border-gray-100"} bg-white`}>

            {/* ── Module Header ── */}
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 transition text-left"
            >
                <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-lg flex-shrink-0"
                    style={{ backgroundColor: mod.color + "18" }}
                >
                    {mod.icon}
                </div>

                <div className="flex-1 min-w-0">
                    <span className="text-sm font-semibold text-gray-800 block truncate">{mod.title}</span>
                    <span className="text-xs text-gray-400">{mod.lessons} Lessons</span>
                </div>

                {/* free / lock badge */}
                {isFree ? (
                    <span className="text-xs font-bold bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded-full flex-shrink-0">
                        Free
                    </span>
                ) : (
                    <span className="text-xs font-bold bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full flex items-center gap-1 flex-shrink-0">
                        <FaLock size={9} /> Premium
                    </span>
                )}

                <span className="ml-2 text-gray-400 flex-shrink-0">
                    {open ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
                </span>
            </button>

            {/* ── Lesson List (dropdown) ── */}
            {open && (
                <div className="border-t border-gray-100">
                    {lessons.map((lesson, li) => {
                        const lessonKey = `${index + 1}-${li + 1}`;
                        const isActive = activeLesson === lessonKey;
                        return (
                            <div
                                key={li}
                                onClick={() => handleLessonClick(li)}
                                className={`flex items-center gap-3 px-5 py-2.5 transition-colors ${
                                    isFree ? "cursor-pointer group" : "cursor-not-allowed opacity-60"
                                } ${isActive ? "bg-blue-50 border-l-2 border-blue-500" : isFree ? "hover:bg-blue-50" : ""} ${
                                    li !== lessons.length - 1 ? "border-b border-gray-50" : ""
                                }`}
                            >
                                <div className="w-7 h-7 flex-shrink-0 flex items-center justify-center">
                                    {isFree ? (
                                        <FaPlayCircle
                                            className={`transition-colors ${isActive ? "text-blue-600" : "text-blue-400 group-hover:text-blue-600"}`}
                                            size={16}
                                        />
                                    ) : (
                                        <FaLock className="text-gray-300" size={13} />
                                    )}
                                </div>

                                <span className={`flex-1 text-xs truncate ${
                                    isActive ? "text-blue-700 font-semibold"
                                    : isFree ? "text-gray-700 font-medium group-hover:text-blue-700"
                                    : "text-gray-400 font-medium"
                                }`}>
                                    {`${li + 1}. ${lesson.title}`}
                                </span>

                                {lesson.isPreview && isFree && (
                                    <span className="text-[10px] font-semibold bg-blue-100 text-blue-500 px-1.5 py-0.5 rounded flex-shrink-0">
                                        Preview
                                    </span>
                                )}

                                <span className={`text-[11px] flex-shrink-0 ml-1 ${isActive ? "text-blue-500" : "text-gray-400"}`}>
                                    {lesson.duration}
                                </span>
                            </div>
                        );
                    })}

                    {/* upsell banner for locked modules */}
                    {!isFree && (
                        <div className="flex items-center gap-2 px-5 py-3 bg-amber-50 border-t border-amber-100">
                            <FaLock className="text-amber-400 flex-shrink-0" size={13} />
                            <p className="text-xs text-amber-700 font-medium flex-1">
                                Enrol in the full course to unlock this module.
                            </p>
                            <button className="text-xs bg-amber-400 hover:bg-amber-500 text-white font-bold px-3 py-1 rounded-lg transition-colors flex-shrink-0">
                                Enrol Now
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

/* ══════════════════════════════════════════════
   CURRICULUM SECTION
   ══════════════════════════════════════════════ */
const CurriculumSection = ({ navigate }) => {
    const [activeLesson, setActiveLesson] = useState(null);

    return (
        <div>
            {/* free-access notice */}
            <div className="flex items-start gap-2 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 mb-4">
                <FaPlayCircle className="text-blue-500 mt-0.5 flex-shrink-0" size={15} />
                <p className="text-xs text-blue-700">
                    <span className="font-bold">Free Preview: </span>
                    The first 2 modules are available for free. Enrol to unlock all {modulesData.length} modules.
                </p>
            </div>

            <div className="space-y-2">
                {modulesData.map((mod, i) => (
                    <ModuleAccordionItem
                        key={i}
                        mod={mod}
                        index={i}
                        navigate={navigate}
                        activeLesson={activeLesson}
                        setActiveLesson={setActiveLesson}
                    />
                ))}
            </div>
        </div>
    );
};

/* ══════════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════════ */
const ViewCourse = () => {
    const [reviews, setReviews] = useState(reviewsData);
    const [newReview, setNewReview] = useState({ name: "", rating: 5, text: "" });
    const navigate = useNavigate();
    const { courseId } = useParams();
    const course = coursesData[courseId] || coursesData[1];

    const [activeTab, setActiveTab] = useState("overview");
    const [timeLeft, setTimeLeft] = useState({ days: 2, hours: 15, minutes: 48, seconds: 36 });

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
                if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
                if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
                if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
                return prev;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const handleReviewSubmit = () => {
        if (!newReview.name || !newReview.text) return;
        setReviews([{
            name: newReview.name,
            initial: newReview.name.charAt(0).toUpperCase(),
            rating: newReview.rating,
            time: "Just now",
            text: newReview.text,
        }, ...reviews]);
        setNewReview({ name: "", rating: 5, text: "" });
    };

    const pad = (n) => String(n).padStart(2, "0");

    const tabs = [
        { key: "overview", label: "Overview" },
        { key: "curriculum", label: "Curriculum" },
        { key: "instructor", label: "Instructor" },
        { key: "reviews", label: `Reviews (${course.reviews})` },
        { key: "faqs", label: "FAQs" },
    ];

    return (
        <div className="min-h-screen bg-[#f6f7fb] p-5">
            <div className="max-w-7xl mx-auto">

                <div className="flex items-start justify-between mb-5">
                    <p className="text-sm text-gray-400 mb-1">
                        <Link to="/student/all-courses" className="hover:text-blue-600 transition-colors">All Courses</Link>
                        <span className="text-gray-300"> &gt; </span>
                        <span className="text-gray-700 font-medium">{course.title}</span>
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 items-start">

                    {/* ══ LEFT COLUMN ══ */}
                    <div className="flex-1 min-w-0 space-y-6">

                        {/* Hero Row */}
                        <div className="flex flex-col sm:flex-row gap-6">
                            <div className="relative w-full sm:w-72 h-48 rounded-2xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
                                <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                    <FaPlay className="text-white w-8 h-8" />
                                </div>
                            </div>

                            <div className="flex-1 space-y-4">
                                <div>
                                    {course.badge && (
                                        <span className="inline-block text-xs font-bold bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full mb-2">{course.badge}</span>
                                    )}
                                    <h1 className="text-xl font-extrabold text-gray-900 leading-tight mb-2">{course.title}</h1>
                                    <p className="text-sm text-gray-500">{course.desc}</p>
                                </div>

                                <div className="flex flex-wrap items-center gap-5 text-sm text-gray-600">
                                    <div className="flex items-center gap-1">
                                        <FaStar className="w-4 h-4 text-yellow-400" />
                                        <span className="font-bold text-gray-900">{course.rating}</span>
                                        <span className="text-gray-400">({course.reviews} ratings)</span>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-1">
                                    {[
                                        { Icon: FaBook, text: `${course.lessons} Lessons` },
                                        { Icon: AiOutlinePlaySquare, text: `${modulesData.length} Modules` },
                                        { Icon: FaTrophy, text: "Certificate" },
                                    ].map(({ Icon, text }, i) => (
                                        <div key={i} className="flex items-center gap-1.5 border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-medium text-gray-600 bg-white">
                                            <span className="text-gray-400"><Icon /></span>
                                            {text}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="border-b border-gray-200">
                            <div className="flex overflow-x-auto">
                                {tabs.map(({ key, label }) => (
                                    <button
                                        key={key}
                                        onClick={() => setActiveTab(key)}
                                        className={`relative px-5 pb-3 pt-1 text-sm font-semibold whitespace-nowrap transition-colors ${activeTab === key ? "text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
                                    >
                                        {label}
                                        {activeTab === key && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Tab Panels */}
                        <div>

                            {/* OVERVIEW */}
                            {activeTab === "overview" && (
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 mb-3">About this course</h3>
                                        <p className="text-sm text-gray-600 leading-relaxed mb-5">
                                            This course covers all the essential concepts of digital marketing including SEO,
                                            Social Media Marketing, Content Marketing, Email Marketing, Google Ads and Analytics.
                                        </p>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2.5 gap-x-6">
                                            {[
                                                "Understand Digital Marketing Basics",
                                                "Run Google Ads Campaigns",
                                                "Learn SEO and Keyword Research",
                                                "Track Performance using Analytics",
                                                "Create Social Media Marketing Strategy",
                                                "Build a Career in Digital Marketing",
                                            ].map((item, i) => (
                                                <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                                                    <FaCheckCircle className="text-blue-600 flex-shrink-0" />
                                                    {item}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 mb-4">Course Curriculum</h3>
                                        <CurriculumSection navigate={navigate} />
                                    </div>
                                </div>
                            )}

                            {/* CURRICULUM */}
                            {activeTab === "curriculum" && (
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-4">Course Curriculum</h3>
                                    <CurriculumSection navigate={navigate} />
                                </div>
                            )}

                            {/* INSTRUCTOR */}
                            {activeTab === "instructor" && (
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-4">About the Instructor</h3>
                                    <div className="flex gap-4 p-5 bg-blue-50 rounded-2xl">
                                        <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                                            R
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 text-base">Rahul Mehta</h4>
                                            <p className="text-sm text-blue-600 mb-3">Digital Marketing Expert &amp; Educator</p>
                                            <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                                                <span className="flex items-center gap-1"><FaStar className="w-3 h-3 text-yellow-400" /> 4.8 Rating</span>
                                                <span className="flex items-center gap-1"><FaUser className="w-3 h-3" /> 12,500 Students</span>
                                            </div>
                                            <p className="text-sm text-gray-600 leading-relaxed">
                                                10+ years of experience in digital marketing. Worked with top brands across India.
                                                Specializes in SEO, Google Ads, and Social Media strategy. Helped 50,000+ students launch their careers.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* REVIEWS */}
                            {activeTab === "reviews" && (
                                <div>
                                    <div className="flex items-center gap-8 p-5 bg-amber-50 border border-amber-100 rounded-2xl mb-6">
                                        <div className="text-center">
                                            <div className="text-5xl font-extrabold text-gray-900 leading-none">{course.rating}</div>
                                            <div className="flex justify-center mt-2 mb-1">
                                                {[1, 2, 3, 4, 5].map(s => <FaStar key={s} className="w-4 h-4 text-yellow-400" />)}
                                            </div>
                                            <div className="text-xs text-gray-400">Course Rating</div>
                                        </div>
                                        <div className="flex-1 space-y-1.5">
                                            {[5, 4, 3, 2, 1].map(s => (
                                                <div key={s} className="flex items-center gap-2">
                                                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                        <div className="h-full bg-yellow-400 rounded-full"
                                                            style={{ width: s === 5 ? "70%" : s === 4 ? "20%" : s === 3 ? "6%" : "3%" }} />
                                                    </div>
                                                    <div className="flex gap-0.5 w-16 justify-end">
                                                        {Array(s).fill(0).map((_, i) => <FaStar key={i} className="w-3 h-3 text-yellow-400" />)}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-6">
                                        <h3 className="text-lg font-bold text-gray-900 mb-4">Write a Review</h3>
                                        <input
                                            type="text"
                                            placeholder="Your Name"
                                            value={newReview.name}
                                            onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                                            className="w-full border border-gray-200 rounded-lg px-4 py-2 mb-3 text-sm"
                                        />
                                        <select
                                            value={newReview.rating}
                                            onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })}
                                            className="w-full border border-gray-200 rounded-lg px-4 py-2 mb-3 text-sm"
                                        >
                                            <option value={5}>⭐⭐⭐⭐⭐ 5 Stars</option>
                                            <option value={4}>⭐⭐⭐⭐ 4 Stars</option>
                                            <option value={3}>⭐⭐⭐ 3 Stars</option>
                                            <option value={2}>⭐⭐ 2 Stars</option>
                                            <option value={1}>⭐ 1 Star</option>
                                        </select>
                                        <textarea
                                            rows="4"
                                            placeholder="Share your experience..."
                                            value={newReview.text}
                                            onChange={(e) => setNewReview({ ...newReview, text: e.target.value })}
                                            className="w-full border border-gray-200 rounded-lg px-4 py-3 mb-4 text-sm"
                                        />
                                        <button
                                            onClick={handleReviewSubmit}
                                            className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700 text-sm"
                                        >
                                            Submit Review
                                        </button>
                                    </div>

                                    <div className="divide-y divide-gray-100">
                                        {reviews.map((r, i) => (
                                            <div key={i} className="py-5">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm flex-shrink-0">
                                                        {r.initial}
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-sm text-gray-900">{r.name}</div>
                                                        <div className="flex items-center gap-2 mt-0.5">
                                                            <div className="flex gap-0.5">
                                                                {Array(5).fill(0).map((_, j) => (
                                                                    <svg key={j} viewBox="0 0 24 24" fill={j < r.rating ? "#FBBF24" : "#E5E7EB"} className="w-3 h-3">
                                                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                                                    </svg>
                                                                ))}
                                                            </div>
                                                            <span className="text-xs text-gray-400">{r.time}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <p className="text-sm text-gray-600 pl-12">{r.text}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* FAQs */}
                            {activeTab === "faqs" && (
                                <div className="space-y-3">
                                    {faqsData.map((faq, i) => (
                                        <div key={i} className="border border-gray-200 rounded-xl p-4 bg-white">
                                            <div className="font-semibold text-sm text-gray-900 mb-1.5">{faq.q}</div>
                                            <p className="text-sm text-gray-600">{faq.a}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ══ RIGHT COLUMN – Price Card ══ */}
                    <div className="w-full lg:w-[300px] flex-shrink-0">
                        <div className="sticky top-6">
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden">

                                {/* Best Deal ribbon */}
                                <div className="relative">
                                    <div className="absolute top-0 right-0 z-10 bg-blue-600 text-white text-xs font-extrabold px-3 py-2 rounded-bl-xl text-center leading-tight">
                                        Best<br />Deal
                                    </div>
                                </div>

                                <div className="p-5 space-y-4">

                                    {/* Price */}
                                    <div>
                                        <p className="text-xs font-semibold text-gray-500 mb-1">Course Price</p>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-xl font-extrabold text-gray-900">{course.price}</span>
                                            <span className="text-sm text-gray-400 line-through">{course.oldPrice}</span>
                                            <span className="text-xs bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded-full">{course.offer}</span>
                                        </div>
                                    </div>

                                    {/* Countdown */}
                                    <div>
                                        <p className="text-xs text-red-500 font-semibold mb-2">Limited time offer! Offer ends in</p>
                                        <div className="grid grid-cols-4 gap-2">
                                            {[
                                                { v: pad(timeLeft.days), l: "Days" },
                                                { v: pad(timeLeft.hours), l: "Hours" },
                                                { v: pad(timeLeft.minutes), l: "Mins" },
                                                { v: pad(timeLeft.seconds), l: "Secs" },
                                            ].map((t, i) => (
                                                <div key={i} className="bg-gray-100 rounded-xl text-center py-2.5">
                                                    <div className="text-sm font-extrabold text-gray-900 tabular-nums">{t.v}</div>
                                                    <div className="text-xs text-gray-500 mt-0.5">{t.l}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* CTA Buttons */}
                                    <div className="space-y-2.5">
                                        <button className="w-full h-12 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition flex items-center justify-center gap-2">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="w-4 h-4">
                                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                            </svg>
                                            Pay Now
                                        </button>
                                        <button className="w-full h-12 rounded-xl border-2 border-blue-600 text-blue-700 font-bold text-sm hover:bg-blue-50 transition flex items-center justify-center gap-2">
                                            <IoCartOutline className="w-4 h-4" />
                                            Add to Cart
                                        </button>
                                    </div>

                                    {/* Secure badge */}
                                    <div className="flex items-center justify-center gap-1.5">
                                        <FaShieldAlt className="text-green-500" />
                                        <span className="text-xs text-green-600 font-semibold">Secure 100% Payment</span>
                                    </div>

                                    {/* Payment Methods */}
                                    <div className="border-t border-gray-100 pt-4">
                                        <p className="text-sm font-bold text-gray-800 mb-3">Payment Methods</p>
                                        <div className="space-y-3">
                                            {/* UPI */}
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center flex-shrink-0">
                                                    <svg viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" className="w-3.5 h-3.5">
                                                        <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" />
                                                    </svg>
                                                </div>
                                                <span className="text-sm text-gray-700 font-medium w-16 flex-shrink-0">UPI</span>
                                                <div className="flex items-center gap-1.5 flex-wrap">
                                                    <span className="text-xs font-bold text-blue-500 px-2 py-0.5 bg-blue-50 rounded">G Pay</span>
                                                    <span className="text-xs font-bold text-purple-600 px-2 py-0.5 bg-purple-50 rounded">PhonePe</span>
                                                    <span className="text-xs font-bold text-sky-500 px-2 py-0.5 bg-sky-50 rounded">paytm</span>
                                                </div>
                                            </div>
                                            {/* Card */}
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center flex-shrink-0">
                                                    <svg viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" className="w-3.5 h-3.5">
                                                        <rect x="1" y="4" width="22" height="16" rx="2" /><line x1="1" y1="10" x2="23" y2="10" />
                                                    </svg>
                                                </div>
                                                <span className="text-xs text-gray-700 font-medium w-16 flex-shrink-0 leading-tight">Credit / Debit Card</span>
                                                <div className="flex items-center gap-1.5">
                                                    <span className="text-xs font-extrabold text-blue-800 px-2 py-0.5 bg-blue-50 rounded italic">VISA</span>
                                                    <div className="relative w-7 h-5 flex items-center">
                                                        <div className="absolute left-0 w-4 h-4 rounded-full bg-red-500 opacity-90" />
                                                        <div className="absolute right-0 w-4 h-4 rounded-full bg-yellow-400 opacity-90" />
                                                    </div>
                                                    <span className="text-xs font-bold text-blue-900 px-2 py-0.5 bg-blue-50 rounded">RuPay</span>
                                                </div>
                                            </div>
                                            {/* Net Banking */}
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center flex-shrink-0">
                                                    <svg viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" className="w-3.5 h-3.5">
                                                        <line x1="3" y1="22" x2="21" y2="22" /><polygon points="12 2 20 7 4 7" />
                                                        <line x1="6" y1="18" x2="6" y2="11" /><line x1="10" y1="18" x2="10" y2="11" />
                                                        <line x1="14" y1="18" x2="14" y2="11" /><line x1="18" y1="18" x2="18" y2="11" />
                                                    </svg>
                                                </div>
                                                <span className="text-sm text-gray-700 font-medium flex-1">Net Banking</span>
                                                <svg viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" className="w-4 h-4">
                                                    <polyline points="9 18 15 12 9 6" />
                                                </svg>
                                            </div>
                                            {/* Wallets */}
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center flex-shrink-0">
                                                    <svg viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" className="w-3.5 h-3.5">
                                                        <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" /><path d="M3 5v14a2 2 0 0 0 2 2h16v-5" /><path d="M18 12a2 2 0 0 0 0 4h4v-4z" />
                                                    </svg>
                                                </div>
                                                <span className="text-sm text-gray-700 font-medium w-16 flex-shrink-0">Wallets</span>
                                                <div className="flex items-center gap-1.5">
                                                    <span className="text-xs font-bold text-sky-500 px-2 py-0.5 bg-sky-50 rounded">paytm</span>
                                                    <span className="text-xs font-bold text-blue-600 px-2 py-0.5 bg-blue-50 rounded">PhonePe</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Guarantees */}
                                    <div className="border-t border-gray-100 pt-4 space-y-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                                                <svg viewBox="0 0 24 24" fill="#16A34A" className="w-5 h-5">
                                                    <path fillRule="evenodd" d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-gray-800">30-Day Money Back</p>
                                                <p className="text-xs text-gray-500">Guarantee</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                                <svg viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" className="w-5 h-5">
                                                    <path d="M12 12c-2-2.5-4-4-6-4a4 4 0 0 0 0 8c2 0 4-1.5 6-4zm0 0c2 2.5 4 4 6 4a4 4 0 0 0 0-8c-2 0-4 1.5-6 4z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-gray-800">Lifetime Access</p>
                                                <p className="text-xs text-gray-500">Learn at your own pace</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                                                <svg viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2" className="w-5 h-5">
                                                    <circle cx="12" cy="8" r="6" /><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-gray-800">Certificate of Completion</p>
                                                <button className="text-xs text-[#0077B5] font-medium flex items-center gap-1 mt-0.5 hover:underline">
                                                    <FaLinkedin className="w-3 h-3" /> Share on LinkedIn
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ViewCourse;