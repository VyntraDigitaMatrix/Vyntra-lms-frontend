import React, { useState, useEffect, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { studentLearningApi, studentPaymentApi } from "./auth/api";
import { useAuth } from "./auth/AuthContext";
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
import { HiOutlineLightBulb, HiOutlineArrowRight } from "react-icons/hi";
import InstructorRating from "./components/InstructorRating";
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
    1: { id: 1, title: "Digital Marketing Fundamentals", badge: "Bestseller", image: S1, rating: "4.7", reviews: "1,250", lessons: "28", desc: "Learn the basics of digital marketing and kickstart your career.", price: "₹999", oldPrice: "₹2,499", offer: "60% OFF" },
    2: { id: 2, title: "Search Engine Optimization (SEO)", badge: "Popular", image: S2, rating: "4.6", reviews: "980", lessons: "26", desc: "Master SEO strategies to rank higher on search engines.", price: "₹1,199", oldPrice: "₹2,999", offer: "60% OFF" },
    3: { id: 3, title: "Social Media Marketing Mastery", badge: "Trending", image: S3, rating: "4.8", reviews: "1,450", lessons: "30", desc: "Build brand awareness using powerful social platforms.", price: "₹1,299", oldPrice: "₹2,999", offer: "57% OFF" },
    4: { id: 4, title: "Email Marketing Essentials", badge: "", image: S4, rating: "4.5", reviews: "760", lessons: "18", desc: "Learn email marketing strategies that drive results.", price: "₹899", oldPrice: "₹1,999", offer: "55% OFF" },
    5: { id: 5, title: "YouTube Marketing Success", badge: "", image: S5, rating: "4.7", reviews: "820", lessons: "22", desc: "Grow your YouTube channel and brand with proven strategies.", price: "₹1,099", oldPrice: "₹2,699", offer: "50% OFF" },
    6: { id: 6, title: "Google Ads Campaigns", badge: "", image: S6, rating: "4.6", reviews: "650", lessons: "20", desc: "Run profitable ad campaigns and get high ROI.", price: "₹1,299", oldPrice: "₹2,999", offer: "57% OFF" },
    7: { id: 7, title: "Google Analytics Mastery", badge: "", image: S7, rating: "4.6", reviews: "540", lessons: "16", desc: "Analyze data and make smart marketing decisions.", price: "₹899", oldPrice: "₹1,999", offer: "55% OFF" },
    8: { id: 8, title: "E-commerce Marketing Strategies", badge: "", image: S8, rating: "4.7", reviews: "610", lessons: "24", desc: "Boost sales and grow your online business.", price: "₹1,199", oldPrice: "₹2,499", offer: "52% OFF" },
};

const modulesData = [
    { title: "Module 1: Introduction to Digital Marketing", lessons: 5, color: "#7C3AED", icon: <FaBullhorn className="text-purple-600 text-base" /> },
    { title: "Module 2: Search Engine Optimization (SEO)", lessons: 6, color: "#EA580C", icon: <FaSearch className="text-orange-600 text-base" /> },
    { title: "Module 3: Social Media Marketing", lessons: 6, color: "#059669", icon: <FaInstagram className="text-green-600 text-base" /> },
    { title: "Module 4: Content Marketing", lessons: 4, color: "#2563EB", icon: <FaPenNib className="text-blue-600 text-base" /> },
    { title: "Module 5: Email Marketing", lessons: 4, color: "#DB2777", icon: <FaEnvelope className="text-pink-600 text-base" /> },
    { title: "Module 6: Google Ads & Analytics", lessons: 3, color: "#D97706", icon: <FaChartLine className="text-amber-600 text-base" /> },
];






const ModuleAccordionItem = ({ mod, index, navigate, activeLesson, setActiveLesson, isEnrolled, courseId }) => {
    const [open, setOpen] = useState(false);
    const lessons = mod.lessons || [];

    const isModuleFree = isEnrolled || lessons.some(l => l.previewAllowed);

    const handleLessonClick = (lesson) => {
        const canAccess = isEnrolled || lesson.previewAllowed;
        if (!canAccess) return;

        const mId = mod.slug ?? mod.moduleId ?? mod.id;
        const lId = lesson.slug ?? lesson.lessonId ?? lesson.id;
        const lessonKey = `${mId}-${lId}`;
        setActiveLesson(lessonKey);

        if (isEnrolled) {
            navigate(`/student/course/${courseId}/module/${mId}/lesson/${lId}`);
        } else {
            navigate(`/student/module/${mId}/lesson/${lId}`);
        }
    };

    return (
        <div className={`border rounded-xl overflow-hidden transition-all duration-200 ${open ? "border-blue-200 shadow-sm" : "border-gray-100"} bg-white`}>
            <button onClick={() => setOpen(!open)} className="w-full flex items-center gap-3 p-3.5 hover:bg-gray-50 transition text-left">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center text-base flex-shrink-0 bg-blue-50">
                    📚
                </div>
                <div className="flex-1 min-w-0">
                    <span className="text-xs sm:text-sm font-semibold text-gray-800 block truncate">{mod.title}</span>
                    <span className="text-[10px] sm:text-xs text-gray-400">{lessons.length} Lessons</span>
                </div>
                {isModuleFree ? (
                    <span className="text-[10px] sm:text-xs font-bold bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded-full flex-shrink-0">Free</span>
                ) : (
                    <span className="text-[10px] sm:text-xs font-bold bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full flex items-center gap-1 flex-shrink-0">
                        <FaLock size={8} /> Premium
                    </span>
                )}
                <span className="ml-1 text-gray-400 flex-shrink-0">
                    {open ? <FaChevronUp size={10} /> : <FaChevronDown size={10} />}
                </span>
            </button>

            {open && (
                <div className="border-t border-gray-100">
                    {lessons.length === 0 ? (
                        <p className="text-[11px] text-gray-400 italic p-3 text-center">No lessons in this module.</p>
                    ) : (
                        lessons.map((lesson, li) => {
                            const canAccess = isEnrolled || lesson.previewAllowed;
                            const lessonKey = `${mod.id}-${lesson.id}`;
                            const isActive = activeLesson === lessonKey;
                            return (
                                <div
                                    key={lesson.id || li}
                                    onClick={() => handleLessonClick(lesson)}
                                    className={`flex items-center gap-3 px-4 py-2.5 transition-colors ${canAccess ? "cursor-pointer group" : "cursor-not-allowed opacity-60"
                                        } ${isActive ? "bg-blue-50 border-l-2 border-blue-500" : canAccess ? "hover:bg-blue-50" : ""} ${li !== lessons.length - 1 ? "border-b border-gray-50" : ""
                                        }`}
                                >
                                    <div className="w-6 h-6 flex-shrink-0 flex items-center justify-center">
                                        {canAccess ? (
                                            <FaPlayCircle className={`transition-colors ${isActive ? "text-blue-600" : "text-blue-400 group-hover:text-blue-600"}`} size={13} />
                                        ) : (
                                            <FaLock className="text-gray-300" size={11} />
                                        )}
                                    </div>
                                    <span className={`flex-1 text-[11px] sm:text-xs truncate ${isActive ? "text-blue-700 font-semibold" : canAccess ? "text-gray-700 font-medium group-hover:text-blue-700" : "text-gray-400 font-medium"}`}>
                                        {`${li + 1}. ${lesson.title}`}
                                    </span>
                                    {lesson.durationInMinutes && (
                                        <span className={`text-[10px] sm:text-[11px] flex-shrink-0 ml-1 ${isActive ? "text-blue-500" : "text-gray-400"}`}>
                                            {lesson.durationInMinutes} mins
                                        </span>
                                    )}
                                </div>
                            );
                        })
                    )}
                    {!isModuleFree && (
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 p-3 bg-amber-50 border-t border-amber-100">
                            <div className="flex items-center gap-2">
                                <FaLock className="text-amber-400 flex-shrink-0" size={11} />
                                <p className="text-[11px] sm:text-xs text-amber-700 font-medium">Enrol in the full course to unlock this module.</p>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

/* ── CURRICULUM SECTION ── */
const CurriculumSection = ({ modules, isEnrolled, courseId, navigate }) => {
    const [activeLesson, setActiveLesson] = useState(null);
    const hasFreeModules = !isEnrolled && modules.some(m => m.lessons && m.lessons.some(l => l.previewAllowed));

    return (
        <div>
            {hasFreeModules && (
                <div className="flex items-start gap-2 bg-blue-50 border border-blue-100 rounded-xl p-3 mb-4">
                    <FaPlayCircle className="text-blue-500 mt-0.5 flex-shrink-0" size={13} />
                    <p className="text-[11px] sm:text-xs text-blue-700">
                        <span className="font-bold">Free Preview: </span>
                        Some lessons are available as a free preview. Enrol to unlock all modules.
                    </p>
                </div>
            )}
            <div className="space-y-2">
                {modules.map((mod, i) => (
                    <ModuleAccordionItem
                        key={mod.slug || mod.moduleId || mod.id || i}
                        mod={mod}
                        index={i}
                        navigate={navigate}
                        activeLesson={activeLesson}
                        setActiveLesson={setActiveLesson}
                        isEnrolled={isEnrolled}
                        courseId={courseId}
                    />
                ))}
            </div>
        </div>
    );
};

const loadRazorpayScript = () => {
    return new Promise((resolve) => {
        if (window.Razorpay) {
            resolve(true);
            return;
        }
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

/* ── FAQ ACCORDION ── */
const FaqAccordionItem = ({ faq }) => {
    const [open, setOpen] = useState(false);
    return (
        <div className={`border rounded-xl overflow-hidden transition-all duration-200 bg-white ${open ? "border-blue-200 shadow-sm" : "border-gray-100"}`}>
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between gap-3 p-3.5 hover:bg-gray-50 transition text-left"
            >
                <span className="text-xs sm:text-sm font-semibold text-gray-800 flex-1">{faq.question}</span>
                <span className="text-gray-400 flex-shrink-0">
                    {open ? <FaChevronUp size={11} /> : <FaChevronDown size={11} />}
                </span>
            </button>
            {open && (
                <div className="px-4 pb-4 pt-0 border-t border-gray-100">
                    <p className="text-xs text-gray-600 leading-relaxed pt-3">{faq.answer}</p>
                </div>
            )}
        </div>
    );
};

const ViewCourse = () => {
    const { courseSlug } = useParams();
    const [courseData, setCourseData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [reviews, setReviews] = useState([]);
    const [reviewsLoading, setReviewsLoading] = useState(false);
    const [reviewsError, setReviewsError] = useState(false);
    const [myReviewData, setMyReviewData] = useState(null);
    const [isEditingReview, setIsEditingReview] = useState(false);
    const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
    const [hasReviewed, setHasReviewed] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [submitError, setSubmitError] = useState("");
    const [submitSuccess, setSubmitSuccess] = useState("");
    const navigate = useNavigate();

    const { student, isAuthenticated } = useAuth();
    const [paymentLoading, setPaymentLoading] = useState(false);

    const courseId = courseData?.courseId;

    const handlePayment = async () => {
        if (!isAuthenticated) {
            navigate("/UserLogin");
            return;
        }
        if (paymentLoading) return;
        setPaymentLoading(true);

        try {
            const scriptLoaded = await loadRazorpayScript();
            if (!scriptLoaded) {
                alert("Razorpay SDK failed to load. Please check your internet connection.");
                setPaymentLoading(false);
                return;
            }

            const orderRes = await studentPaymentApi.createOrder(courseId);
            if (!orderRes.data || !orderRes.data.data) {
                throw new Error("Failed to create order");
            }

            const orderData = orderRes.data.data;
            const options = {
                key: orderData.keyId,
                amount: orderData.amount,          // backend already returns paise
                currency: orderData.currency || "INR",
                name: "Vyntra LMS",
                description: orderData.courseTitle || courseData?.title || "Course Enrollment",
                order_id: orderData.razorpayOrderId,
                handler: async (response) => {
                    try {
                        setPaymentLoading(true);
                        const verifyRes = await studentPaymentApi.verifyPayment({
                            razorpayOrderId: response.razorpay_order_id,
                            razorpayPaymentId: response.razorpay_payment_id,
                            razorpaySignature: response.razorpay_signature
                        });
                        if (verifyRes.status === 200 || (verifyRes.data && verifyRes.data.success)) {
                            alert("Payment successful! You are now enrolled.");
                            fetchCourseStructure();
                        } else {
                            alert("Verification failed. Please contact support.");
                        }
                    } catch (err) {
                        console.error(err);
                        alert("Error verifying payment: " + (err.response?.data?.message || err.message));
                    } finally {
                        setPaymentLoading(false);
                    }
                },
                prefill: {
                    name: student?.fullName || student?.name || "",
                    email: student?.email || "",
                    contact: student?.phone || student?.phoneNumber || ""
                },
                theme: {
                    color: "#2563EB"
                },
                modal: {
                    ondismiss: () => {
                        setPaymentLoading(false);
                    }
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', function (response) {
                alert("Payment failed: " + response.error.description);
                setPaymentLoading(false);
            });
            rzp.open();
        } catch (err) {
            console.error(err);
            alert("Error placing order: " + (err.response?.data?.message || err.message));
            setPaymentLoading(false);
        }
    };

    const [activeTab, setActiveTab] = useState("overview");
    const [timeLeft, setTimeLeft] = useState({ days: 2, hours: 15, minutes: 48, seconds: 36 });

    const fetchCourseStructure = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await studentLearningApi.getCourseBySlug(courseSlug);
            if (res.data && res.data.data) {
                setCourseData(res.data.data);
            }
        } catch (err) {
            console.error(err);
            setError("Failed to fetch course details from server.");
        } finally {
            setLoading(false);
        }
    };

    const fetchReviews = async () => {
        if (!courseSlug) return;
        setReviewsLoading(true);
        setReviewsError(false);
        try {
            const res = await studentLearningApi.getCourseReviews(courseSlug);
            if (res.data && res.data.data) {
                const raw = res.data.data;
                const list = Array.isArray(raw) ? raw : (raw.content || []);
                setReviews(list);
            }
            if (isAuthenticated) {
                try {
                    const myRatingRes = await studentLearningApi.getMyRating(courseSlug);
                    if (myRatingRes.data && myRatingRes.data.data) {
                        const myReview = myRatingRes.data.data;
                        setMyReviewData(myReview);
                        setNewReview({ rating: myReview.rating || 5, comment: myReview.review || "" });
                        setHasReviewed(true);
                    } else {
                        setMyReviewData(null);
                        setHasReviewed(false);
                    }
                } catch (e) {
                    // Ignore if no rating exists
                }
            }
        } catch (err) {
            // API may not be available yet — fail silently
            setReviewsError(true);
        } finally {
            setReviewsLoading(false);
        }
    };

    useEffect(() => {
        if (courseSlug) {
            fetchCourseStructure();
            fetchReviews();
        }
    }, [courseSlug]);

    const actualReviewCount = Math.max(
        courseData?.totalRatings || 0,
        reviews.length,
        myReviewData && !isEditingReview ? 1 : 0
    );

    const course = courseData ? {
        ...courseData,
        image: courseData.thumbnailUrl || S1,
        rating: courseData.averageRating ? courseData.averageRating.toFixed(1) : "0.0",
        reviews: actualReviewCount,
        lessons: courseData.totalLessons || (courseData.modules || []).reduce((acc, m) => acc + (m.lessons || []).length, 0) || 0,
        modules: courseData.totalModules || (courseData.modules || []).length || 0,
        desc: courseData.description || "",
        price: courseData.free ? "Free" : (courseData.discountPrice ? `₹${courseData.discountPrice}` : (courseData.actualPrice ? `₹${courseData.actualPrice}` : "")),
        oldPrice: courseData.free ? "" : (courseData.actualPrice && courseData.discountPrice ? `₹${courseData.actualPrice}` : ""),
        offer: courseData.free ? "" : (courseData.discountPrice && courseData.actualPrice ? `${Math.round(((courseData.actualPrice - courseData.discountPrice) / courseData.actualPrice) * 100)}% OFF` : ""),
        isEnrolled: courseData.enrolled ?? courseData.isEnrolled ?? false,
    } : {
        title: "Loading Course...",
        image: S1,
        rating: "0.0",
        reviews: 0,
        lessons: 0,
        modules: 0,
        desc: "",
        price: "",
        oldPrice: "",
        offer: ""
    };

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

    const handleReviewSubmit = async () => {
        if (!newReview.comment.trim()) return;
        setSubmitLoading(true);
        setSubmitError("");
        setSubmitSuccess("");
        try {
            const payload = {
                rating: newReview.rating,
                review: newReview.comment,
            };
            if (hasReviewed) {
                await studentLearningApi.updateCourseReview(courseSlug, payload);
                setSubmitSuccess("Review updated successfully!");
                setIsEditingReview(false);
            } else {
                await studentLearningApi.submitCourseReview(courseSlug, payload);
                setSubmitSuccess("Review submitted successfully!");
                setHasReviewed(true);
                setIsEditingReview(false);
            }
            fetchReviews();
        } catch (err) {
            console.error(err);
            setSubmitError(err.response?.data?.message || "Failed to submit review. Please try again.");
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleReviewDelete = async () => {
        if (!window.confirm("Are you sure you want to delete your review?")) return;
        try {
            await studentLearningApi.deleteCourseReview(courseSlug);
            setHasReviewed(false);
            setMyReviewData(null);
            setNewReview({ rating: 5, comment: "" });
            setIsEditingReview(false);
            fetchReviews();
        } catch (err) {
            console.error("Failed to delete review", err);
            alert("Failed to delete review");
        }
    };

    // Auto-dismiss success message
    useEffect(() => {
        if (submitSuccess) {
            const timer = setTimeout(() => setSubmitSuccess(""), 3000);
            return () => clearTimeout(timer);
        }
    }, [submitSuccess]);

    const pad = (n) => String(n).padStart(2, "0");

    const tabs = [
        { key: "overview", label: "Overview" },
        { key: "curriculum", label: "Curriculum" },
        { key: "instructor", label: "Instructor" },
        { key: "reviews", label: `Reviews (${course.reviews})` },
        { key: "faqs", label: "FAQs" },
    ];

    /* ── Price Card Component ── */
    const PriceCard = () => (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden">
            <div className="relative">
                <div className="absolute top-0 right-0 z-10 bg-blue-600 text-white text-[10px] font-extrabold px-3 py-1.5 rounded-bl-xl text-center leading-tight">
                    Best Deal
                </div>
            </div>
            <div className="p-4 sm:p-5 space-y-4">
                <div>
                    <p className="text-xs font-semibold text-gray-500 mb-1">Course Price</p>
                    <div className="flex items-baseline gap-2">
                        <span className="text-xl font-extrabold text-gray-900">{course.price}</span>
                        <span className="text-sm text-gray-400 line-through">{course.oldPrice}</span>
                        <span className="text-xs bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded-full">{course.offer}</span>
                    </div>
                </div>

                <div>
                    <p className="text-[11px] text-red-500 font-semibold mb-2">Limited time offer! Offer ends in</p>
                    <div className="grid grid-cols-4 gap-1.5">
                        {[
                            { v: pad(timeLeft.days), l: "Days" },
                            { v: pad(timeLeft.hours), l: "Hrs" },
                            { v: pad(timeLeft.minutes), l: "Mins" },
                            { v: pad(timeLeft.seconds), l: "Secs" },
                        ].map((t, i) => (
                            <div key={i} className="bg-gray-50 rounded-xl text-center py-2">
                                <div className="text-xs font-extrabold text-gray-900 tabular-nums">{t.v}</div>
                                <div className="text-[9px] text-gray-400 mt-0.5">{t.l}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-2">
                    {course?.isEnrolled ? (
                        <button
                            type="button"
                            onClick={() => navigate(`/student/continue-learning/${courseData?.slug || courseSlug || courseData?.courseId}`)}
                            className="w-full h-11 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-sm transition flex items-center justify-center gap-2 border-none cursor-pointer"
                        >
                            Continue Learning
                        </button>
                    ) : (
                        <>
                            <button
                                type="button"
                                onClick={handlePayment}
                                disabled={paymentLoading}
                                className={`w-full h-11 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition flex items-center justify-center gap-2 border-none cursor-pointer ${paymentLoading ? "opacity-60 cursor-not-allowed" : ""}`}
                            >
                                {paymentLoading ? (
                                    <span className="w-4 h-4 border-2 border-t-white border-white/20 rounded-full animate-spin"></span>
                                ) : (
                                    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="w-4 h-4">
                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                    </svg>
                                )}
                                {paymentLoading ? "Processing..." : "Pay Now"}
                            </button>
                            <button
                                type="button"
                                className="w-full h-11 rounded-xl border-2 border-blue-600 text-blue-700 font-bold text-sm hover:bg-blue-50 transition flex items-center justify-center gap-2 border-none cursor-pointer bg-white"
                            >
                                <IoCartOutline className="w-4 h-4" />
                                Add to Cart
                            </button>
                        </>
                    )}
                </div>

                <div className="flex items-center justify-center gap-1.5 pt-1">
                    <FaShieldAlt className="text-green-500 text-xs" />
                    <span className="text-[11px] text-green-600 font-semibold">Secure 100% Verified Payment</span>
                </div>

                <div className="border-t border-gray-100 pt-3">
                    <p className="text-xs font-bold text-gray-800 mb-2.5">Payment Methods</p>
                    <div className="space-y-2 text-[11px]">
                        <div className="flex items-center gap-2">
                            <span className="text-gray-500 font-medium w-12">UPI:</span>
                            <div className="flex gap-1 flex-wrap">
                                <span className="font-bold text-blue-600 px-1.5 py-0.5 bg-blue-50 rounded text-[10px]">G Pay</span>
                                <span className="font-bold text-purple-600 px-1.5 py-0.5 bg-purple-50 rounded text-[10px]">PhonePe</span>
                                <span className="font-bold text-sky-500 px-1.5 py-0.5 bg-sky-50 rounded text-[10px]">Paytm</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-gray-500 font-medium w-12">Cards:</span>
                            <span className="font-extrabold text-blue-800 px-1.5 py-0.5 bg-blue-50 rounded italic text-[10px]">VISA</span>
                            <span className="font-bold text-blue-900 px-1.5 py-0.5 bg-blue-50 rounded text-[10px]">RuPay</span>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-100 pt-3 space-y-2">
                    <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
                            <FaCheckCircle className="text-green-600 text-xs" />
                        </div>
                        <div>
                            <p className="text-[11px] font-bold text-gray-800">30-Day Money Back Guarantee</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                            <FaClock className="text-blue-600 text-xs" />
                        </div>
                        <div>
                            <p className="text-[11px] font-bold text-gray-800">Lifetime Full Dashboard Access</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-amber-50 flex items-center justify-center flex-shrink-0">
                            <FaTrophy className="text-amber-600 text-xs" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[11px] font-bold text-gray-800 truncate">Certificate of Completion</p>
                            <button className="text-[10px] text-[#0077B5] font-semibold flex items-center gap-0.5 hover:underline">
                                <FaLinkedin size={10} /> Share
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f6f7fb] flex flex-col items-center justify-center p-5">
                <div className="w-10 h-10 border-4 border-t-blue-600 border-gray-200 rounded-full animate-spin mb-4"></div>
                <span className="text-sm text-gray-500 font-semibold font-sans">Loading course details...</span>
            </div>
        );
    }

    if (error || !courseData) {
        return (
            <div className="min-h-screen bg-[#f6f7fb] flex flex-col items-center justify-center p-5">
                <div className="bg-red-50 text-red-700 p-6 rounded-2xl border border-red-100 max-w-md text-center">
                    <p className="text-sm font-bold mb-2">⚠️ Error Loading Course</p>
                    <p className="text-xs text-gray-600 mb-4">{error || "Course details not found"}</p>
                    <Link
                        to="/student/all-courses"
                        className="inline-flex items-center justify-center h-10 px-5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition"
                    >
                        Back to All Courses
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f6f7fb] p-3 sm:p-4 md:p-6 pb-24 md:pb-6">
            <div className="max-w-7xl mx-auto">
                {/* Breadcrumb */}
                <div className="mb-4">
                    <p className="text-[11px] sm:text-xs text-gray-400">
                        <Link to="/student/all-courses" className="hover:text-blue-600 transition-colors">All Courses</Link>
                        <span className="text-gray-300"> &gt; </span>
                        <span className="text-gray-700 font-medium truncate inline-block max-w-[180px] align-bottom">{course.title}</span>
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-5 lg:gap-8 items-start">
                    {/* ══ LEFT MAIN PANEL ══ */}
                    <div className="w-full flex-1 min-w-0 space-y-5">
                        {/* Hero Section */}
                        <div className="flex flex-col md:flex-row gap-4 bg-white p-3 sm:p-4 rounded-2xl border border-gray-100 shadow-sm">
                            <div className="relative w-full md:w-60 lg:w-64 h-40 sm:h-44 rounded-xl overflow-hidden flex-shrink-0 bg-slate-900">
                                <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                    <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/40">
                                        <FaPlay className="text-white ml-0.5 text-xs" />
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 flex flex-col justify-between py-0.5 space-y-3 md:space-y-0">
                                <div className="space-y-1.5">
                                    {course.badge && (
                                        <span className="inline-block text-[10px] font-bold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md">{course.badge}</span>
                                    )}
                                    <h1 className="text-base sm:text-lg md:text-xl font-extrabold text-gray-900 leading-snug">{course.title}</h1>
                                    <p className="text-xs text-gray-500 line-clamp-2 md:line-clamp-none">{course.shortDescription}</p>
                                </div>

                                <div className="space-y-2.5 pt-1">
                                    <div className="flex items-center gap-1.5 text-xs text-gray-700">
                                        <FaStar className="text-yellow-400" size={13} />
                                        <span className="font-bold">{course.rating}</span>
                                        <span className="text-gray-400 text-[11px]">({course.reviews} reviews)</span>
                                    </div>
                                    <div className="flex flex-wrap gap-1.5">
                                        {[
                                            { Icon: FaBook, text: `${course.lessons} Lessons` },
                                            { Icon: AiOutlinePlaySquare, text: `${course.modules} Modules` },
                                            { Icon: FaTrophy, text: "Certificate" },
                                        ].map(({ Icon, text }, i) => (
                                            <div key={i} className="flex items-center gap-1 border border-gray-100 rounded-md px-2 py-1 text-[10px] font-medium text-gray-600 bg-gray-50">
                                                <Icon className="text-gray-400" size={10} />
                                                {text}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Inline Inline Pricing Card for tablet/middle views */}
                        <div className="block lg:hidden">
                            <PriceCard />
                        </div>

                        {/* Slideable Horizontally Segmented Tabs */}
                        <div className="border-b border-gray-200 overflow-x-auto scrollbar-none -mx-3 px-3 sm:mx-0 sm:px-0">
                            <div className="flex gap-4 md:gap-8 min-w-max">
                                {tabs.map(({ key, label }) => (
                                    <button
                                        key={key}
                                        onClick={() => setActiveTab(key)}
                                        className={`relative pb-2.5 text-xs sm:text-sm font-bold transition-colors whitespace-nowrap ${activeTab === key ? "text-blue-600" : "text-gray-400 hover:text-gray-600"}`}
                                    >
                                        {label}
                                        {activeTab === key && <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-blue-600 rounded-full" />}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Tab Content Display Elements */}
                        <div className="pt-1">
                            {/* OVERVIEW PANEL */}
                            {activeTab === "overview" && (
                                <div className="space-y-5">
                                    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                                        <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-2.5">About This Course</h3>
                                        <div
                                            className="course-description text-sm text-gray-600 leading-relaxed"
                                            dangerouslySetInnerHTML={{ __html: course.description || "" }}
                                        />
                                    </div>
                                    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                                        <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-3">Course Syllabus</h3>
                                        <CurriculumSection
                                            modules={courseData?.modules || []}
                                            isEnrolled={courseData?.enrolled || false}
                                            courseId={courseData?.courseId}
                                            navigate={navigate}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* CURRICULUM PANEL */}
                            {activeTab === "curriculum" && (
                                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                                    <CurriculumSection
                                        modules={courseData?.modules || []}
                                        isEnrolled={courseData?.enrolled || false}
                                        courseId={courseData?.courseId}
                                        navigate={navigate}
                                    />
                                </div>
                            )}

                            {/* INSTRUCTOR PANEL */}
                            {activeTab === "instructor" && (
                                <div className="space-y-3">
                                    {(courseData?.instructors || []).length === 0 ? (
                                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center text-xs text-gray-400">No instructor information available.</div>
                                    ) : (
                                        (courseData.instructors).map((inst) => (
                                            <div key={inst.instructorId} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                                                <div className="flex flex-col sm:flex-row gap-3.5 items-center sm:items-start text-center sm:text-left">
                                                    {inst.profileImage ? (
                                                        <img src={inst.profileImage} alt={inst.fullName} className="w-14 h-14 rounded-full object-cover flex-shrink-0 border-2 border-blue-100" />
                                                    ) : (
                                                        <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                                                            {inst.fullName?.charAt(0).toUpperCase()}
                                                        </div>
                                                    )}
                                                    <div className="space-y-1.5 flex-1">
                                                        <h4 className="font-bold text-gray-900 text-sm sm:text-base">{inst.fullName}</h4>
                                                        {inst.headline && <p className="text-xs text-blue-600 font-medium">{inst.headline}</p>}
                                                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-[11px] text-gray-400">
                                                            {inst.averageRating > 0 && (
                                                                <span className="flex items-center gap-0.5"><FaStar className="text-yellow-400" size={10} /> {inst.averageRating.toFixed(1)} Rating</span>
                                                            )}
                                                            {inst.totalStudents > 0 && (
                                                                <span className="flex items-center gap-0.5"><FaUser size={9} /> {inst.totalStudents.toLocaleString()} Students</span>
                                                            )}
                                                            {inst.totalCourses > 0 && (
                                                                <span className="flex items-center gap-0.5"><FaBook size={9} /> {inst.totalCourses} Courses</span>
                                                            )}
                                                            {inst.yearsOfExperience > 0 && (
                                                                <span className="flex items-center gap-0.5"><FaClock size={9} /> {inst.yearsOfExperience}+ yrs exp</span>
                                                            )}
                                                        </div>
                                                        {inst.shortBio && (
                                                            <p className="text-xs text-gray-600 leading-relaxed pt-1 mb-3">{inst.shortBio}</p>
                                                        )}
                                                        
                                                        {/* Render instructor's other courses if provided by the new API format */}
                                                        {inst.courses && inst.courses.length > 0 && (
                                                            <div className="mb-3">
                                                                <h5 className="text-[11px] font-bold text-gray-800 mb-1.5">Other Courses</h5>
                                                                <div className="flex flex-wrap gap-1.5">
                                                                    {inst.courses.map(c => (
                                                                        <Link key={c.courseId} to={`/student/course/${c.slug}`} className="text-[9px] bg-white border border-blue-100 text-blue-600 px-1.5 py-0.5 rounded hover:bg-blue-50 transition">
                                                                            {c.title}
                                                                        </Link>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                        
                                                        {/* Instructor Rating Component (Only if enrolled) */}
                                                        {course.isEnrolled && (
                                                            <InstructorRating 
                                                                courseSlug={courseSlug} 
                                                                instructorId={inst.instructorId} 
                                                            />
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}

                            {/* REVIEWS PANEL */}
                            {activeTab === "reviews" && (
                                <div className="space-y-4">
                                    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center gap-4">
                                        <div className="text-center sm:border-r border-gray-100 sm:pr-6 flex-shrink-0">
                                            <div className="text-4xl font-black text-gray-900">{course.rating}</div>
                                            <div className="flex justify-center my-1 gap-0.5">
                                                {[1, 2, 3, 4, 5].map(s => (
                                                    <FaStar key={s} className={`w-2.5 h-2.5 ${s <= Math.round(courseData?.averageRating || 0) ? "text-yellow-400" : "text-gray-200"}`} />
                                                ))}
                                            </div>
                                            <div className="text-[10px] text-gray-400 font-medium">{actualReviewCount} Ratings</div>
                                        </div>
                                        <div className="flex-1 w-full space-y-1.5">
                                            {[5, 4, 3, 2, 1].map(s => (
                                                <div key={s} className="flex items-center gap-2">
                                                    <div className="flex gap-0.5 flex-shrink-0">
                                                        {Array(s).fill(0).map((_, i) => <FaStar key={i} className="w-2 h-2 text-yellow-400" />)}
                                                    </div>
                                                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                        <div className="h-full bg-yellow-400 rounded-full" style={{ width: s === 5 ? `${Math.min(100, Math.round((courseData?.averageRating || 0) >= 4.5 ? 70 : (courseData?.averageRating || 0) >= 3.5 ? 50 : 20))}%` : s === 4 ? "18%" : s === 3 ? "7%" : "3%" }} />
                                                    </div>
                                                    <span className="text-[10px] text-gray-400 w-6 text-right">{s}★</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {!reviewsError && isAuthenticated && hasReviewed && !isEditingReview && myReviewData && (
                                        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm space-y-3 relative">
                                            <div className="flex justify-between items-start">
                                                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">My Review</h3>
                                                <div className="flex gap-2">
                                                    <button onClick={() => setIsEditingReview(true)} className="text-xs text-blue-600 font-semibold hover:underline">Edit</button>
                                                    <button onClick={handleReviewDelete} className="text-xs text-red-600 font-semibold hover:underline">Delete</button>
                                                </div>
                                            </div>
                                            <div className="flex gap-1 mb-2">
                                                {[1, 2, 3, 4, 5].map(star => (
                                                    <FaStar key={star} className={`w-4 h-4 ${star <= (myReviewData.rating || 0) ? "text-yellow-400" : "text-gray-200"}`} />
                                                ))}
                                            </div>
                                            <p className="text-sm text-gray-700">{myReviewData.review}</p>
                                        </div>
                                    )}

                                    {!reviewsError && isAuthenticated && (!hasReviewed || isEditingReview) && (
                                        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm space-y-3 relative">
                                            <div className="flex justify-between items-center">
                                                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">{hasReviewed ? "Update Feedback" : "Leave Feedback"}</h3>
                                                {hasReviewed && (
                                                    <button onClick={() => setIsEditingReview(false)} className="text-[10px] text-gray-500 hover:text-gray-800">Cancel</button>
                                                )}
                                            </div>
                                            <div className="flex gap-2 items-center">
                                                {[1, 2, 3, 4, 5].map(star => (
                                                    <button
                                                        key={star}
                                                        type="button"
                                                        onClick={() => setNewReview(r => ({ ...r, rating: star }))}
                                                        className="focus:outline-none transition-transform hover:scale-110"
                                                    >
                                                        <FaStar className={`w-5 h-5 ${star <= newReview.rating ? "text-yellow-400" : "text-gray-200"}`} />
                                                    </button>
                                                ))}
                                                <span className="text-xs text-gray-500 ml-1">{newReview.rating}/5</span>
                                            </div>
                                            <textarea
                                                rows="3" placeholder="Share your experience..."
                                                value={newReview.comment}
                                                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                                                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
                                            />
                                            {submitError && <p className="text-[11px] text-red-500 font-medium">{submitError}</p>}
                                            {submitSuccess && <p className="text-[11px] text-green-600 font-medium">{submitSuccess}</p>}
                                            <button
                                                onClick={handleReviewSubmit}
                                                disabled={submitLoading || !newReview.comment.trim()}
                                                className={`bg-blue-600 text-white px-4 py-2 rounded-xl font-bold text-xs hover:bg-blue-700 transition ${submitLoading || !newReview.comment.trim() ? "opacity-60 cursor-not-allowed" : ""}`}
                                            >
                                                {submitLoading ? "Submitting..." : (hasReviewed ? "Update Review" : "Submit Review")}
                                            </button>
                                        </div>
                                    )}

                                    <div className="bg-white border border-gray-100 rounded-2xl px-4 shadow-sm">
                                        {reviewsLoading ? (
                                            <div className="flex justify-center py-8">
                                                <div className="w-6 h-6 border-2 border-t-blue-500 border-gray-200 rounded-full animate-spin" />
                                            </div>
                                        ) : reviewsError ? (
                                            <p className="text-center text-xs text-gray-400 py-8">Reviews are not available at the moment.</p>
                                        ) : reviews.length === 0 ? (
                                            <p className="text-center text-xs text-gray-400 py-8">No reviews yet. Be the first to review!</p>
                                        ) : (
                                            <div className="divide-y divide-gray-50">
                                                {reviews.map((r, i) => {
                                                    const name = r.studentName || r.student?.fullName || r.name || "Student";
                                                    const rating = r.rating ?? 0;
                                                    const comment = r.comment || r.review || r.text || "";
                                                    const date = r.createdAt ? new Date(r.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : (r.time || "");
                                                    const avatar = r.student?.profileImage || r.profileImage || null;
                                                    const initial = name.charAt(0).toUpperCase();
                                                    return (
                                                        <div key={r.id || i} className="py-3.5">
                                                            <div className="flex items-center gap-2.5 mb-1.5">
                                                                {avatar ? (
                                                                    <img src={avatar} alt={name} className="w-7 h-7 rounded-full object-cover flex-shrink-0" />
                                                                ) : (
                                                                    <div className="w-7 h-7 rounded-full bg-blue-50 text-blue-600 font-bold text-xs flex items-center justify-center flex-shrink-0">
                                                                        {initial}
                                                                    </div>
                                                                )}
                                                                <div className="min-w-0">
                                                                    <div className="font-bold text-xs text-gray-900 truncate">{name}</div>
                                                                    <div className="flex items-center gap-1.5">
                                                                        <div className="flex gap-0.5">
                                                                            {Array(5).fill(0).map((_, j) => (
                                                                                <FaStar key={j} className={`w-2 h-2 ${j < rating ? "text-yellow-400" : "text-gray-100"}`} />
                                                                            ))}
                                                                        </div>
                                                                        <span className="text-[10px] text-gray-400">{date}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <p className="text-xs text-gray-600 pl-9">{comment}</p>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* FAQS PANEL */}
                            {activeTab === "faqs" && (
                                <div className="space-y-2">
                                    {(courseData?.faqs || []).length === 0 ? (
                                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center text-xs text-gray-400">No FAQs available for this course.</div>
                                    ) : (
                                        [...(courseData.faqs)]
                                            .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
                                            .map((faq) => (
                                                <FaqAccordionItem key={faq.id} faq={faq} />
                                            ))
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ══ RIGHT DESKTOP ONLY STICKY PANEL ══ */}
                    <div className="hidden lg:block w-[310px] flex-shrink-0 sticky top-6">
                        <PriceCard />
                    </div>
                </div>
            </div>

            {/* ── MOBILE OVERLAY STICKY CONVERSION BAR ── */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] px-4 py-3 flex items-center justify-between z-50 transform-gpu">
                {courseData?.isEnrolled ? (
                    <button
                        type="button"
                        onClick={() => navigate(`/student/continue-learning/${courseData?.slug || courseSlug || courseId}`)}
                        className="w-full h-11 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-sm transition flex items-center justify-center gap-2 border-none cursor-pointer"
                    >
                        Continue Learning
                    </button>
                ) : (
                    <>
                        <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                                <span className="text-lg font-black text-gray-900">{course.price}</span>
                                <span className="text-xs text-gray-400 line-through">{course.oldPrice}</span>
                            </div>
                            <span className="inline-block text-[9px] font-bold bg-green-100 text-green-700 px-1.5 py-0.2 rounded mt-0.5">
                                {course.offer} SAVINGS
                            </span>
                        </div>
                        <button
                            type="button"
                            onClick={handlePayment}
                            disabled={paymentLoading}
                            className={`h-11 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-6 rounded-xl flex items-center justify-center gap-2 active:scale-[0.98] transition-transform border-none cursor-pointer ${paymentLoading ? "opacity-60 cursor-not-allowed" : ""}`}
                        >
                            {paymentLoading ? (
                                <span className="w-3.5 h-3.5 border-2 border-t-white border-white/20 rounded-full animate-spin"></span>
                            ) : (
                                <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" className="w-3.5 h-3.5">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                </svg>
                            )}
                            {paymentLoading ? "Processing..." : "Pay Now"}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default ViewCourse;