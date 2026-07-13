import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
    FaArrowLeft,
    FaCommentAlt,
    FaQuoteLeft,
    FaStar,
    FaClock,
    FaChartBar,
    FaCalendarAlt,
    FaUser,
    FaTrophy,
} from "react-icons/fa";
import { Badge, SectionLabel, InfoBox, FileRow, Tabs, statusStyle } from "./AssignmentShared";

const GradedDetail = ({ assignment, onBack }) => {
    const [tab, setTab] = useState("Grade & Feedback");
    const scoredMarks = assignment.scoredMarks ?? 0;
    const totalMax = assignment.maxMarks || 100;
    const pct = totalMax > 0 ? Math.round((scoredMarks / totalMax) * 100) : 0;
    const gradeColor = pct >= 90 ? "text-green-600" : pct >= 75 ? "text-blue-600" : pct >= 60 ? "text-orange-500" : "text-red-500";
    const ringColor = pct >= 90 ? "border-green-400" : pct >= 75 ? "border-blue-400" : pct >= 60 ? "border-orange-400" : "border-red-400";
    const ringBg = pct >= 90 ? "bg-green-50" : pct >= 75 ? "bg-blue-50" : pct >= 60 ? "bg-orange-50" : "bg-red-50";

    const getGradeLetter = (p) => {
        if (p >= 90) return "A+";
        if (p >= 80) return "A";
        if (p >= 70) return "B+";
        if (p >= 60) return "B";
        if (p >= 50) return "C";
        return "D";
    };

    return (
        <div className="min-h-screen bg-[#f6f7fb] p-3 sm:p-4 md:p-5">
            <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-400 mb-2 sm:mb-4">
                <Link to="/student/dashboard" className="hover:text-blue-600">Dashboard</Link>
                <span>&gt;</span>
                <button onClick={onBack} className="hover:text-blue-600">Assignments</button>
                <span>&gt;</span>
                <span className="text-gray-600 font-medium truncate">{assignment.title}</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4 sm:mb-6">
                <button onClick={onBack} className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-xl bg-white border border-gray-200 text-gray-500 hover:bg-gray-100 transition shadow-sm">
                    <FaArrowLeft className="text-xs sm:text-sm" />
                </button>
                <div className="flex-1">
                    <h1 className="text-base sm:text-xl font-bold text-gray-900">{assignment.title}</h1>
                    <p className="text-[11px] sm:text-sm font-semibold text-gray-700 mt-0.5 sm:mt-1">
                        {assignment.courseTitle || assignment.courseName || `Course ${assignment.courseId}`}

                    </p>
                </div>
                <div className="sm:ml-auto">
                    <Badge status={assignment.status} />
                </div>
            </div>

            <div className="flex flex-col lg:grid lg:grid-cols-12 gap-4 sm:gap-5">
                <div className="w-full lg:col-span-8">
                    <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6">
                        <Tabs tabs={["Grade & Feedback", "Rubric Breakdown"]} active={tab} onChange={setTab} />
                        {tab === "Grade & Feedback" && (
                            <div className="space-y-4 sm:space-y-6">
                                <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 bg-gray-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-100">
                                    <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 ${ringColor} ${ringBg} flex flex-col items-center justify-center flex-shrink-0`}>
                                        <span className={`text-2xl sm:text-3xl font-black leading-none ${gradeColor}`}>{scoredMarks}</span>
                                        <span className="text-[10px] sm:text-xs text-gray-400 font-semibold">/ {totalMax}</span>
                                    </div>
                                    <div className="text-center sm:text-left">
                                        <div className="flex items-center gap-2 sm:gap-3 mb-1 justify-center sm:justify-start">
                                            <span className={`text-xl sm:text-2xl font-black ${gradeColor}`}>{getGradeLetter(pct)}</span>
                                            <FaTrophy className="text-yellow-400 text-base sm:text-lg" />
                                        </div>
                                        <p className="text-xs sm:text-sm text-gray-500 mb-2">
                                            You scored <strong className={gradeColor}>{pct}%</strong> on this assignment.
                                        </p>
                                        <div className="flex gap-1.5 sm:gap-2 flex-wrap justify-center sm:justify-start">
                                            <span className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold ${statusStyle.Graded}`}>Graded</span>
                                            <span className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold bg-gray-100 text-gray-600">
                                                {pct >= 90 ? "Excellent" : pct >= 75 ? "Good work" : pct >= 60 ? "Satisfactory" : "Needs improvement"}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                                    <InfoBox label="Graded by" value={assignment.gradedBy || "Instructor"} icon={FaUser} />
                                    <InfoBox label="Graded on" value={assignment.gradedOn ? new Date(assignment.gradedOn).toLocaleDateString() : "—"} icon={FaCalendarAlt} />
                                    <InfoBox label="Marks scored" value={`${scoredMarks} / ${totalMax}`} valueClass={gradeColor} icon={FaStar} />
                                    <InfoBox label="Percentage" value={`${pct}%`} valueClass={gradeColor} icon={FaChartBar} />
                                </div>

                                {assignment.feedback && (
                                    <div>
                                        <SectionLabel>Instructor Feedback</SectionLabel>
                                        <div className="bg-green-50 rounded-xl p-3 sm:p-5 text-xs sm:text-sm text-green-800 leading-relaxed border border-green-100">
                                            <FaQuoteLeft className="inline mr-1 sm:mr-2 text-green-400 text-[10px] sm:text-xs mb-0.5" />
                                            {assignment.feedback}
                                        </div>
                                    </div>
                                )}

                                {assignment.submittedFiles?.length > 0 && (
                                    <div>
                                        <SectionLabel>Your Submission</SectionLabel>
                                        <div className="space-y-2">
                                            {assignment.submittedFiles.map((f, i) => (
                                                <FileRow key={i} name={f.name} size={f.size} type={f.type} onDownload={() => window.open(f.url, "_blank")} />
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {tab === "Rubric Breakdown" && (
                            <div className="space-y-3 sm:space-y-4">
                                <div className="flex items-center justify-between bg-blue-50 rounded-xl p-3 sm:p-4 border border-blue-100 mb-4 sm:mb-6">
                                    <div>
                                        <p className="text-[10px] sm:text-xs text-blue-400 font-bold uppercase tracking-wide mb-1">Total Score</p>
                                        <p className={`text-xl sm:text-2xl font-black ${gradeColor}`}>
                                            {scoredMarks} <span className="text-xs sm:text-sm font-semibold text-gray-400">/ {totalMax}</span>
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] sm:text-xs text-blue-400 font-bold uppercase tracking-wide mb-1">Grade</p>
                                        <p className={`text-xl sm:text-2xl font-black ${gradeColor}`}>{getGradeLetter(pct)}</p>
                                    </div>
                                </div>
                                {assignment.rubric?.length > 0 ? (
                                    assignment.rubric.map((r, i) => {
                                        const rScore = r.score || 0;
                                        const rTotal = r.total || 0;
                                        const rPct = rTotal > 0 ? Math.round((rScore / rTotal) * 100) : 0;
                                        const barColor = rPct >= 90 ? "bg-green-500" : rPct >= 75 ? "bg-blue-500" : rPct >= 60 ? "bg-orange-400" : "bg-red-400";
                                        return (
                                            <div key={i} className="bg-gray-50 rounded-xl p-3 sm:p-4 border border-gray-100">
                                                <div className="flex justify-between text-[11px] sm:text-sm mb-2">
                                                    <span className="text-gray-700 font-semibold">{r.label}</span>
                                                    <span className="font-bold text-gray-900">{rScore} / {rTotal}</span>
                                                </div>
                                                <div className="h-1.5 sm:h-2 bg-gray-200 rounded-full overflow-hidden">
                                                    <div className={`h-full rounded-full transition-all duration-700 ${barColor}`} style={{ width: `${rPct}%` }} />
                                                </div>
                                                <p className="text-[10px] sm:text-xs text-gray-400 mt-1">{rPct}% of available marks</p>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <p className="text-center text-gray-400 text-sm py-6">No rubric available for this assignment.</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="w-full lg:col-span-4 space-y-4 sm:space-y-5">
                    <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5 text-center">
                        <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full border-4 ${ringColor} ${ringBg} flex flex-col items-center justify-center mx-auto mb-2 sm:mb-3`}>
                            <span className={`text-lg sm:text-xl font-black leading-none ${gradeColor}`}>{pct}%</span>
                        </div>
                        <p className="text-xs sm:text-sm font-bold text-gray-900">{scoredMarks} / {totalMax} marks</p>
                        <p className="text-[10px] sm:text-xs text-gray-400 mt-1">
                            {pct >= 90 ? "Outstanding performance!" : pct >= 75 ? "Good performance" : pct >= 60 ? "Passing grade" : "Below passing grade"}
                        </p>
                    </div>
                    <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5">
                        <SectionLabel>Assignment Info</SectionLabel>
                        <div className="space-y-2 sm:space-y-3">
                            <InfoBox label="Total Marks" value={assignment.maxMarks} icon={FaStar} />
                            <InfoBox label="Marks Scored" value={scoredMarks} valueClass={gradeColor} icon={FaTrophy} />
                            <InfoBox label="Due Date" value={assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString() : "—"} icon={FaCalendarAlt} />
                            <InfoBox label="Submitted" value={assignment.submittedDate ? new Date(assignment.submittedDate).toLocaleDateString() : "—"} icon={FaClock} />
                        </div>
                    </div>
                    <button className="w-full flex items-center justify-center gap-1.5 sm:gap-2 py-2 sm:py-2.5 rounded-xl bg-blue-600 text-white text-xs sm:text-sm font-semibold hover:bg-blue-700 transition">
                        <FaCommentAlt className="text-[10px] sm:text-xs" />
                        Message Instructor
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GradedDetail;