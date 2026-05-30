import React, { useState } from "react";
import { Link } from "react-router-dom";

import {
    FaClipboardCheck,
    FaCheckCircle,
    FaTrophy,
    FaChevronRight,
    FaCalendarAlt,
    FaCheck,
    FaHourglassHalf,
    FaChevronDown,
} from "react-icons/fa";

import { MdQuiz } from "react-icons/md";
import { HiOutlineClock } from "react-icons/hi";

const Quizzes = () => {
    const [activeTab, setActiveTab] = useState("All Quizzes");
    const [selectedCourse, setSelectedCourse] = useState("All Courses");

    const quizzes = [
        {
            id: 1,
            title: "Digital Marketing Basics Quiz",
            module: "Module 1",
            questions: "15 Questions",
            date: "20 May 2024",
            duration: "20 mins",
            status: "Completed",
            score: "90%",
            color: "purple",
            course: "Marketing",
        },

        {
            id: 2,
            title: "SEO Fundamentals Quiz",
            module: "Module 2",
            questions: "20 Questions",
            date: "22 May 2024",
            duration: "25 mins",
            status: "Completed",
            score: "85%",
            color: "blue",
            course: "SEO",
        },

        {
            id: 3,
            title: "Social Media Marketing Quiz",
            module: "Module 3",
            questions: "15 Questions",
            date: "25 May 2024",
            duration: "20 mins",
            status: "In Progress",
            course: "Marketing",
            score: "7/15",
            color: "orange",
        },

        {
            id: 4,
            title: "Google Ads Quiz",
            module: "Module 4",
            questions: "20 Questions",
            date: "28 May 2024",
            duration: "25 mins",
            status: "Upcoming",
            score: "1 Day",
            color: "sky",
            course: "Google Ads",
        },

        {
            id: 5,
            title: "Email Marketing Quiz",
            module: "Module 5",
            questions: "15 Questions",
            date: "30 May 2024",
            duration: "20 mins",
            status: "Not Attempted",
            score: "",
            color: "gray",
            course: "Email Marketing",
        },
    ];

    const tabFilteredQuizzes = activeTab === "All Quizzes"
        ? quizzes
        : activeTab === "Upcoming"
            ? quizzes.filter((item) => item.status === "Upcoming")
            : activeTab === "Attempted"
                ? quizzes.filter(
                    (item) =>
                        item.status === "Completed" ||

                        item.status === "In Progress"
                )
                : activeTab === "Quiz Results"
                    ? quizzes.filter((item) => item.status === "Completed")
                    : quizzes;

    const filteredQuizzes =
        selectedCourse === "All Courses"
            ? tabFilteredQuizzes
            : tabFilteredQuizzes.filter(
                (item) => item.course === selectedCourse
            );

    return (
        <div className="p-3 sm:p-5 md:p-6 min-h-screen bg-[#f7f8fc]">
            <div className="max-w-7xl mx-auto">

                {/* HEADER */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">

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
                                Quizzes
                            </span>
                        </p>

                        <h1 className="text-xl font-bold text-[#1d1642]">
                            Quizzes
                        </h1>

                        <p className="text-sm text-gray-500 mt-2">
                            Test your knowledge and track your progress
                        </p>
                    </div>

                    {/* DROPDOWN */}
                    <select
                        value={selectedCourse}
                        onChange={(e) => setSelectedCourse(e.target.value)}
                        style={{ display: 'flex', alignItems: 'center', padding: '10px 18px', background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: 11, cursor: 'pointer', fontWeight: 600, fontSize: 13, color: '#475569' }}>
                        <option>All Courses</option>
                        <option>Marketing</option>
                        <option>SEO</option>
                        <option>Google Ads</option>
                        <option>Email Marketing</option>

                        <FaChevronDown style={{ fontSize: 10 }} />
                    </select>

                </div>

                {/* STATS */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">

                    {/* CARD */}
                    <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3 shadow-sm">
                        <div className="w-[52px] h-[52px] rounded-xl bg-[#f3ebff] flex items-center justify-center">
                            <MdQuiz className="text-[#7c3aed] text-[24px]" />
                        </div>

                        <div>
                            <p className="text-sm text-gray-500 font-medium">
                                Total Quizzes
                            </p>

                            <h2 className="text-2xl font-bold text-[#1d1642]">
                                24
                            </h2>
                        </div>
                    </div>

                    {/* CARD */}
                    <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3 shadow-sm">
                        <div className="w-[52px] h-[52px] rounded-xl bg-[#e9f2ff] flex items-center justify-center">
                            <FaClipboardCheck className="text-[#2563eb] text-[22px]" />
                        </div>

                        <div>
                            <p className="text-sm text-gray-500 font-medium">
                                Attempted
                            </p>

                            <h2 className="text-2xl font-bold text-[#1d1642]">
                                18
                            </h2>
                        </div>
                    </div>

                    {/* CARD */}
                    <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3 shadow-sm">
                        <div className="w-[52px] h-[52px] rounded-xl bg-[#eafaf0] flex items-center justify-center">
                            <FaCheckCircle className="text-[#16a34a] text-[22px]" />
                        </div>

                        <div>
                            <p className="text-sm text-gray-500 font-medium">
                                Correct Answers
                            </p>

                            <h2 className="text-2xl font-bold text-[#1d1642]">
                                76%
                            </h2>
                        </div>
                    </div>

                    {/* CARD */}
                    <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3 shadow-sm">
                        <div className="w-[52px] h-[52px] rounded-xl bg-[#fff5e7] flex items-center justify-center">
                            <FaTrophy className="text-[#f59e0b] text-[22px]" />
                        </div>

                        <div>
                            <p className="text-sm text-gray-500 font-medium">
                                Avg. Score
                            </p>

                            <h2 className="text-2xl font-bold text-[#1d1642]">
                                82%
                            </h2>
                        </div>
                    </div>
                </div>

                {/* TABS */}
                <div className="flex items-center gap-8 border-b border-gray-200 overflow-x-auto mb-6">

                    {[
                        "All Quizzes",
                        "Upcoming",
                        "Attempted",
                        "Quiz Results",
                    ].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-4 whitespace-nowrap text-sm font-semibold border-b-[3px] transition ${activeTab === tab
                                ? "border-[#6d28d9] text-[#6d28d9]"
                                : "border-transparent text-gray-500"
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* QUIZ LIST */}
                <div className="space-y-4">

                    {filteredQuizzes.map((quiz) => (
                        <div
                            key={quiz.id}
                            className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-5 shadow-sm"
                        >

                            {/* LEFT */}
                            <div className="flex flex-col sm:flex-row gap-4">

                                {/* ICON */}
                                <div
                                    className={`w-[60px] h-[60px] rounded-full flex items-center justify-center shrink-0
                                        ${quiz.color === "purple"
                                            ? "bg-[#f3ebff]"
                                            : quiz.color === "blue"
                                                ? "bg-[#eaf2ff]"
                                                : quiz.color === "orange"
                                                    ? "bg-[#fff5e7]"
                                                    : quiz.color === "sky"
                                                        ? "bg-[#edf6ff]"
                                                        : "bg-[#f3f4f6]"
                                        }
                    `}
                                >
                                    <MdQuiz
                                        className={`text-[30px]
                                            ${quiz.color === "purple"
                                                ? "text-[#7c3aed]"
                                                : quiz.color === "blue"
                                                    ? "text-[#2563eb]"
                                                    : quiz.color === "orange"
                                                        ? "text-[#f59e0b]"
                                                        : quiz.color === "sky"
                                                            ? "text-[#3b82f6]"
                                                            : "text-gray-500"
                                            }
                    `}
                                    />
                                </div>

                                {/* DETAILS */}
                                <div>

                                    <h2 className="text-sm font-bold text-[#1d1642]">
                                        {quiz.title}
                                    </h2>

                                    <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-500">
                                        <span>{quiz.module}</span>
                                        <span>•</span>
                                        <span>{quiz.questions}</span>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-gray-500">

                                        <div className="flex items-center gap-2">
                                            <FaCalendarAlt />
                                            <span>{quiz.date}</span>
                                        </div>

                                        <span>•</span>

                                        <div className="flex items-center gap-2">
                                            <HiOutlineClock />
                                            <span>{quiz.duration}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* RIGHT */}
                            <div className="flex items-center justify-between lg:justify-end gap-6">

                                {/* STATUS */}
                                <div className="text-right">

                                    {/* BADGE */}
                                    {quiz.status === "Completed" && (
                                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#eafaf0] text-[#16a34a] text-sm font-semibold">
                                            <FaCheck className="text-[11px]" />
                                            Completed
                                        </span>
                                    )}

                                    {quiz.status === "In Progress" && (
                                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#fff7e8] text-[#f59e0b] text-sm font-semibold">
                                            <FaTrophy className="text-[11px]" />
                                            In Progress
                                        </span>
                                    )}

                                    {quiz.status === "Upcoming" && (
                                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#edf4ff] text-[#2563eb] text-sm font-semibold">
                                            <FaHourglassHalf className="text-[11px]" />
                                            Upcoming
                                        </span>
                                    )}

                                    {quiz.status === "Not Attempted" && (
                                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-gray-600 text-sm font-semibold">
                                            Not Attempted
                                        </span>
                                    )}

                                    {/* SCORE */}
                                    <div className="mt-3">

                                        {quiz.status === "Completed" && (
                                            <div className="flex items-center gap-3">

                                                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                                                    <FaTrophy className="text-green-600 text-lg" />
                                                </div>

                                                <div className="flex flex-col text-center">
                                                    <span className="text-xs text-gray-500">
                                                        Score
                                                    </span>

                                                    <span className="text-2xl font-bold text-green-600 leading-none mt-1 ">
                                                        {quiz.score}
                                                    </span>
                                                </div>

                                            </div>
                                        )}

                                        {quiz.status === "In Progress" && (
                                            <>
                                                <h2 className="text-2xl font-bold text-[#1d1642] text-center">
                                                    {quiz.score}
                                                </h2>

                                                <p className="text-sm text-gray-500 text-center">
                                                    Answered
                                                </p>
                                            </>
                                        )}

                                        {quiz.status === "Upcoming" && (
                                            <>
                                                <p className="text-sm text-gray-500 text-center">
                                                    Starts in
                                                </p>

                                                <h2 className="text-2xl font-bold text-[#1d1642] text-center">
                                                    {quiz.score}
                                                </h2>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* ARROW */}
                                <button className="w-[40px] h-[40px] rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition">
                                    <FaChevronRight className="text-gray-500" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* BOTTOM CTA */}
                <div className="mt-8 bg-[#f6f0ff] border border-[#ede2ff] rounded-xl p-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

                    <div>
                        <h2 className="text-2xl font-bold text-[#4320a5]">
                            Ready for a Challenge?
                        </h2>

                        <p className="text-gray-600 mt-2 text-sm">
                            Take quizzes regularly to boost your learning.
                        </p>
                    </div>

                    <button className="h-[50px] px-8 bg-[#6d28d9] hover:bg-[#5b21b6] transition rounded-xl text-white font-semibold text-sm">
                        Browse All Quizzes →
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Quizzes;