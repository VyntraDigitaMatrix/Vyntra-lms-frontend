import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
    FaBell, FaCheckDouble, FaTrash, FaFilter, FaSearch,
    FaGraduationCap, FaTrophy, FaCalendarAlt, FaCommentDots,
    FaExclamationCircle, FaCheck, FaBullhorn, FaBookOpen,
    FaStar, FaClock, FaChevronRight, FaTimes, FaDotCircle,
} from "react-icons/fa";
import { MdAssignment, MdQuiz, MdLiveTv, MdPayment } from "react-icons/md";

/* ── Notification types config ── */
const TYPE_CONFIG = {
    course:      { icon: <FaBookOpen />,          bg: "bg-blue-100",   text: "text-blue-600",   label: "Course"      },
    assignment:  { icon: <MdAssignment />,         bg: "bg-amber-100",  text: "text-amber-600",  label: "Assignment"  },
    quiz:        { icon: <MdQuiz />,               bg: "bg-purple-100", text: "text-purple-600", label: "Quiz"        },
    achievement: { icon: <FaTrophy />,             bg: "bg-yellow-100", text: "text-yellow-600", label: "Achievement" },
    live:        { icon: <MdLiveTv />,             bg: "bg-red-100",    text: "text-red-600",    label: "Live Class"  },
    grade:       { icon: <FaStar />,               bg: "bg-green-100",  text: "text-green-600",  label: "Grade"       },
    deadline:    { icon: <FaClock />,              bg: "bg-orange-100", text: "text-orange-600", label: "Deadline"    },
    announcement:{ icon: <FaBullhorn />,           bg: "bg-indigo-100", text: "text-indigo-600", label: "Announcement"},
    payment:     { icon: <MdPayment />,            bg: "bg-teal-100",   text: "text-teal-600",   label: "Payment"     },
    feedback:    { icon: <FaCommentDots />,        bg: "bg-pink-100",   text: "text-pink-600",   label: "Feedback"    },
};

/* ── Seed data ── */
const INITIAL_NOTIFICATIONS = [
    {
        id: 1, type: "assignment", read: false,
        title: "Assignment Due Tomorrow",
        message: "Your 'Digital Marketing Audit' assignment for Module 1 is due tomorrow at 11:59 PM. Make sure to submit before the deadline.",
        time: "2 hours ago", date: "Today",
        action: { label: "View Assignment", href: "/student/assignments" },
        priority: "high",
    },
    {
        id: 2, type: "grade", read: false,
        title: "Assignment Graded",
        message: "Your 'Buyer Persona' assignment has been graded. You scored 87/100. Check the feedback from your instructor.",
        time: "5 hours ago", date: "Today",
        action: { label: "See Feedback", href: "/student/assignments" },
        priority: "normal",
    },
    {
        id: 3, type: "live", read: false,
        title: "Live Class Starting in 30 Minutes",
        message: "Your scheduled live session 'Advanced SEO Techniques' with Instructor Sarah begins at 3:00 PM today. Join the session on time.",
        time: "30 min ago", date: "Today",
        action: { label: "Join Now", href: "/student/classes" },
        priority: "high",
    },
    {
        id: 4, type: "achievement", read: false,
        title: "🏆 Badge Unlocked — Quick Learner",
        message: "Congratulations! You completed 5 lessons in a single day and unlocked the 'Quick Learner' badge. Keep up the great work!",
        time: "Yesterday, 4:30 PM", date: "Yesterday",
        action: { label: "View Badges", href: "/student/certificates" },
        priority: "normal",
    },
    {
        id: 5, type: "quiz", read: true,
        title: "New Quiz Available: Module 3",
        message: "A new quiz for 'Content Strategy & Copywriting' is now available. Complete it to unlock the next module.",
        time: "Yesterday, 11:00 AM", date: "Yesterday",
        action: { label: "Start Quiz", href: "/student/quiz" },
        priority: "normal",
    },
    {
        id: 6, type: "course", read: true,
        title: "New Module Unlocked",
        message: "You've unlocked Module 4: Paid Advertising (Google & Meta). Continue your learning journey and explore the new content.",
        time: "2 days ago", date: "This Week",
        action: { label: "Start Learning", href: "/student/courses" },
        priority: "normal",
    },
    {
        id: 7, type: "announcement", read: true,
        title: "Platform Maintenance Notice",
        message: "The platform will undergo scheduled maintenance on Sunday, June 15 from 2:00 AM to 4:00 AM IST. Please save your work beforehand.",
        time: "2 days ago", date: "This Week",
        action: null,
        priority: "normal",
    },
    {
        id: 8, type: "deadline", read: true,
        title: "Course Deadline Approaching",
        message: "You have 7 days left to complete the 'Digital Marketing Fundamentals' course. You're 65% through — keep going!",
        time: "3 days ago", date: "This Week",
        action: { label: "Resume Course", href: "/student/courses" },
        priority: "high",
    },
    {
        id: 9, type: "feedback", read: true,
        title: "Instructor Left Feedback",
        message: "Your instructor has left detailed feedback on your 'Content Strategy Brief' assignment. Review the comments to improve.",
        time: "4 days ago", date: "This Week",
        action: { label: "Read Feedback", href: "/student/courses" },
        priority: "normal",
    },
    {
        id: 10, type: "payment", read: true,
        title: "Payment Successful",
        message: "Your payment of ₹4,999 for 'Google Ads Mastery' course has been confirmed. You can now access all course materials.",
        time: "5 days ago", date: "This Week",
        action: { label: "View Course", href: "/student/courses" },
        priority: "normal",
    },
    {
        id: 11, type: "achievement", read: true,
        title: "🎯 Milestone Reached — 50% Course Complete",
        message: "You've completed 50% of your Digital Marketing course. You're halfway there! Stay consistent to earn your certificate.",
        time: "6 days ago", date: "This Week",
        action: { label: "Continue", href: "/student/courses" },
        priority: "normal",
    },
    {
        id: 12, type: "course", read: true,
        title: "New Resource Added",
        message: "Your instructor added a new PDF resource 'Advanced PPC Strategies' to Module 4. Download it from the resources section.",
        time: "1 week ago", date: "Older",
        action: { label: "Download", href: "/student/resources" },
        priority: "normal",
    },
    {
        id: 13, type: "quiz", read: true,
        title: "Quiz Result: Module 2",
        message: "You scored 4/5 (80%) on the Audience Research & Personas quiz. Great job! Review the explanation for Question 3.",
        time: "1 week ago", date: "Older",
        action: { label: "Review Quiz", href: "/student/quiz" },
        priority: "normal",
    },
    {
        id: 14, type: "announcement", read: true,
        title: "New Course Released: Email Marketing",
        message: "A new course 'Email Marketing Mastery' is now live on the platform. Enrol today and get 20% early bird discount.",
        time: "2 weeks ago", date: "Older",
        action: { label: "Explore Course", href: "/student/dashboard" },
        priority: "normal",
    },
];

const FILTER_TABS = ["All", "Unread", "Course", "Assignment", "Quiz", "Achievement", "Live Class", "Deadline"];

/* ══════════════════════════════════════════════════════════════
   NOTIFICATION CARD
══════════════════════════════════════════════════════════════ */
const NotificationCard = ({ notif, onRead, onDelete }) => {
    const cfg = TYPE_CONFIG[notif.type] || TYPE_CONFIG.announcement;

    return (
        <div className={`group relative bg-white border rounded-xl p-3 sm:p-4 transition-all duration-200 hover:shadow-md ${!notif.read ? "border-blue-200 bg-blue-50/30" : "border-gray-200"}`}>
            {/* Unread dot */}
            {!notif.read && (
                <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-blue-500 sm:top-4 sm:right-4" />
            )}

            <div className="flex gap-3 sm:gap-4">
                {/* Icon */}
                <div className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl ${cfg.bg} ${cfg.text} flex items-center justify-center text-sm sm:text-base flex-shrink-0 mt-0.5`}>
                    {cfg.icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pr-5 sm:pr-0">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 sm:gap-2 mb-1">
                        <div className="flex items-center gap-2 flex-wrap">
                            <h3 className={`text-sm font-bold leading-snug ${!notif.read ? "text-gray-900" : "text-gray-700"}`}>
                                {notif.title}
                            </h3>
                            {notif.priority === "high" && (
                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-red-50 border border-red-100 text-red-600 text-[9px] font-bold uppercase tracking-wide">
                                    <FaExclamationCircle className="text-[8px]" /> Urgent
                                </span>
                            )}
                        </div>
                        <span className="text-[10px] sm:text-xs text-gray-400 whitespace-nowrap flex-shrink-0">{notif.time}</span>
                    </div>

                    <p className="text-xs sm:text-sm text-gray-500 leading-relaxed mb-2.5 line-clamp-2">{notif.message}</p>

                    <div className="flex items-center gap-2 flex-wrap">
                        {/* Type badge */}
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${cfg.bg} ${cfg.text}`}>
                            {cfg.label}
                        </span>

                        {/* Action link */}
                        {notif.action && (
                            <Link
                                to={notif.action.href}
                                onClick={() => !notif.read && onRead(notif.id)}
                                className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 transition"
                            >
                                {notif.action.label} <FaChevronRight className="text-[8px]" />
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            {/* Hover action buttons */}
            <div className="absolute top-2 right-6 sm:right-2 hidden group-hover:flex items-center gap-1 bg-white border border-gray-100 rounded-lg shadow-sm p-0.5">
                {!notif.read && (
                    <button
                        onClick={() => onRead(notif.id)}
                        title="Mark as read"
                        className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-blue-50 text-blue-500 transition text-xs"
                    >
                        <FaCheck />
                    </button>
                )}
                <button
                    onClick={() => onDelete(notif.id)}
                    title="Delete"
                    className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-red-50 text-red-400 transition text-xs"
                >
                    <FaTrash />
                </button>
            </div>
        </div>
    );
};

/* ══════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════ */
const Notifications = () => {
    const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
    const [activeFilter, setActiveFilter] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");
    const [showClearConfirm, setShowClearConfirm] = useState(false);

    const unreadCount = notifications.filter(n => !n.read).length;

    /* ── Actions ── */
    const markRead = (id) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    const deleteOne = (id) => setNotifications(prev => prev.filter(n => n.id !== id));
    const clearAll = () => { setNotifications([]); setShowClearConfirm(false); };

    /* ── Filtering ── */
    const filtered = useMemo(() => {
        let list = [...notifications];

        if (searchTerm.trim()) {
            const q = searchTerm.toLowerCase();
            list = list.filter(n =>
                n.title.toLowerCase().includes(q) ||
                n.message.toLowerCase().includes(q)
            );
        }

        if (activeFilter === "Unread") list = list.filter(n => !n.read);
        else if (activeFilter !== "All") {
            const typeKey = Object.entries(TYPE_CONFIG).find(([, v]) => v.label === activeFilter)?.[0];
            if (typeKey) list = list.filter(n => n.type === typeKey);
        }

        return list;
    }, [notifications, activeFilter, searchTerm]);

    /* ── Group by date ── */
    const grouped = useMemo(() => {
        const groups = {};
        filtered.forEach(n => {
            if (!groups[n.date]) groups[n.date] = [];
            groups[n.date].push(n);
        });
        return groups;
    }, [filtered]);

    const dateOrder = ["Today", "Yesterday", "This Week", "Older"];

    /* ── Stats ── */
    const stats = [
        { label: "Total", value: notifications.length, icon: <FaBell />, color: "blue" },
        { label: "Unread", value: unreadCount, icon: <FaDotCircle />, color: "red" },
        { label: "Assignments", value: notifications.filter(n => n.type === "assignment").length, icon: <MdAssignment />, color: "amber" },
        { label: "Achievements", value: notifications.filter(n => n.type === "achievement").length, icon: <FaTrophy />, color: "yellow" },
    ];

    const statColors = {
        blue:   { bg: "bg-blue-50",   text: "text-blue-600"   },
        red:    { bg: "bg-red-50",    text: "text-red-600"    },
        amber:  { bg: "bg-amber-50",  text: "text-amber-600"  },
        yellow: { bg: "bg-yellow-50", text: "text-yellow-600" },
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="px-3 sm:px-4 md:px-6 pt-4 sm:pt-6">

                {/* Breadcrumb */}
                <p className="text-xs sm:text-sm text-gray-400 mb-3 sm:mb-4">
                    <Link to="/student/dashboard" className="hover:text-blue-600 transition">Dashboard</Link>
                    <span className="mx-1.5">&gt;</span>
                    <span className="text-gray-600 font-medium">Notifications</span>
                </p>

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
                    <div>
                        <h1 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
                            <FaBell className="text-blue-500" />
                            Notifications
                            {unreadCount > 0 && (
                                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-black">
                                    {unreadCount}
                                </span>
                            )}
                        </h1>
                        <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                            Stay updated with your course activity and announcements
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllRead}
                                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-200 rounded-xl hover:bg-blue-100 transition"
                            >
                                <FaCheckDouble className="text-[10px]" /> Mark all read
                            </button>
                        )}
                        {notifications.length > 0 && (
                            <button
                                onClick={() => setShowClearConfirm(true)}
                                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-red-500 bg-red-50 border border-red-200 rounded-xl hover:bg-red-100 transition"
                            >
                                <FaTrash className="text-[10px]" /> Clear all
                            </button>
                        )}
                    </div>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                    {stats.map(s => {
                        const c = statColors[s.color];
                        return (
                            <div key={s.label} className="bg-white border border-gray-200 rounded-xl p-3 sm:p-4 flex items-center gap-3 shadow-sm">
                                <div className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl ${c.bg} ${c.text} flex items-center justify-center text-sm sm:text-base flex-shrink-0`}>
                                    {s.icon}
                                </div>
                                <div>
                                    <p className="text-[10px] sm:text-xs text-gray-400 font-medium">{s.label}</p>
                                    <p className="text-base sm:text-xl font-bold text-gray-900 leading-none mt-0.5">{s.value}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Search + Filter */}
                <div className="bg-white border border-gray-200 rounded-xl p-3 sm:p-4 mb-4 shadow-sm space-y-3">
                    {/* Search */}
                    <div className="relative">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                        <input
                            type="text"
                            placeholder="Search notifications..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition bg-gray-50"
                        />
                        {searchTerm && (
                            <button onClick={() => setSearchTerm("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition">
                                <FaTimes className="text-xs" />
                            </button>
                        )}
                    </div>

                    {/* Filter tabs — horizontal scroll */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-0.5 scrollbar-hide">
                        {FILTER_TABS.map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveFilter(tab)}
                                className={`flex-shrink-0 text-[11px] sm:text-xs font-semibold px-3 py-1.5 rounded-full border transition ${activeFilter === tab
                                    ? "bg-blue-600 text-white border-blue-600"
                                    : "bg-gray-50 text-gray-500 border-gray-200 hover:border-blue-300 hover:text-blue-600"
                                }`}
                            >
                                {tab}
                                {tab === "Unread" && unreadCount > 0 && (
                                    <span className="ml-1.5 bg-white text-blue-600 text-[9px] font-black px-1 rounded-full">{unreadCount}</span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Notification list */}
                {filtered.length === 0 ? (
                    <div className="bg-white border border-dashed border-gray-300 rounded-xl p-10 sm:p-16 text-center shadow-sm">
                        <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
                            <FaBell className="text-gray-300 text-3xl" />
                        </div>
                        <h2 className="text-base sm:text-lg font-bold text-gray-600 mb-1">No notifications found</h2>
                        <p className="text-xs sm:text-sm text-gray-400">
                            {searchTerm ? "Try a different search term." : "You're all caught up!"}
                        </p>
                        {(searchTerm || activeFilter !== "All") && (
                            <button
                                onClick={() => { setSearchTerm(""); setActiveFilter("All"); }}
                                className="mt-4 text-xs text-blue-600 font-semibold hover:underline"
                            >
                                Clear filters
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="space-y-5">
                        {dateOrder
                            .filter(d => grouped[d])
                            .map(dateGroup => (
                                <div key={dateGroup}>
                                    {/* Date header */}
                                    <div className="flex items-center gap-3 mb-3">
                                        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider">{dateGroup}</h2>
                                        <div className="flex-1 h-px bg-gray-200" />
                                        <span className="text-[10px] text-gray-400">{grouped[dateGroup].length} notification{grouped[dateGroup].length !== 1 ? "s" : ""}</span>
                                    </div>

                                    <div className="space-y-2 sm:space-y-2.5">
                                        {grouped[dateGroup].map(notif => (
                                            <NotificationCard
                                                key={notif.id}
                                                notif={notif}
                                                onRead={markRead}
                                                onDelete={deleteOne}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ))}
                    </div>
                )}

                {/* Result summary */}
                {filtered.length > 0 && (
                    <p className="text-center text-xs text-gray-400 mt-6">
                        Showing {filtered.length} of {notifications.length} notifications
                    </p>
                )}
            </div>

            {/* Clear All Confirm Modal */}
            {showClearConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowClearConfirm(false)}>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center" onClick={e => e.stopPropagation()}>
                        <div className="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center mx-auto mb-4">
                            <FaTrash className="text-red-500 text-xl" />
                        </div>
                        <h2 className="text-base font-bold text-gray-900 mb-1">Clear All Notifications?</h2>
                        <p className="text-sm text-gray-500 mb-5">This will permanently remove all {notifications.length} notifications. This action cannot be undone.</p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowClearConfirm(false)}
                                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={clearAll}
                                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition"
                            >
                                Clear All
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Notifications;