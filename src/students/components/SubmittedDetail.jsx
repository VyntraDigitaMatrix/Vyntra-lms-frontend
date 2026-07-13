import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
    FaArrowLeft,
    FaRedo,
    FaCheckCircle,
    FaEye,
    FaClock,
    FaStar,
    FaChartBar,
    FaCalendarAlt,
    FaInfoCircle,
    FaFileAlt,
} from "react-icons/fa";
import { Badge, SectionLabel, InfoBox, FileRow, Tabs } from "./AssignmentShared";

export default function SubmittedDetail({ assignment, onBack, onResubmit, allowResubmission }) {
    const [tab, setTab] = useState("Submitted Files");

    const historyIconMap = {
        success: <FaCheckCircle className="text-green-500 text-xs sm:text-sm" />,
        draft: <FaRedo className="text-orange-400 text-xs sm:text-sm" />,
        view: <FaEye className="text-gray-400 text-xs sm:text-sm" />,
    };

    return (
        <div className="min-h-screen bg-[#f6f7fb] p-3 sm:p-4 md:p-5">
            {/* Breadcrumb */}
            <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-400 mb-2 sm:mb-4">
                <Link to="/student/dashboard" className="hover:text-blue-600">
                    Dashboard
                </Link>
                <span>&gt;</span>
                <button onClick={onBack} className="hover:text-blue-600">
                    Assignments
                </button>
                <span>&gt;</span>
                <span className="text-gray-600 font-medium truncate">{assignment.title}</span>
            </div>

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4 sm:mb-6">
                <button
                    onClick={onBack}
                    className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-xl bg-white border border-gray-200 text-gray-500 hover:bg-gray-100 transition shadow-sm"
                >
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

            {/* Submission success banner */}
            <div className="flex items-center gap-2 sm:gap-3 bg-green-50 border border-green-200 rounded-xl px-3 sm:px-4 py-2 sm:py-3 mb-4 sm:mb-6">
                <FaCheckCircle className="text-green-500 flex-shrink-0 text-xs sm:text-sm" />
                <p className="text-[11px] sm:text-sm font-semibold text-green-700">
                    Submitted on —{" "}
                    {assignment.submittedDate
                        ? (() => {
                            const d = new Date(assignment.submittedDate);
                            return isNaN(d.getTime())
                                ? "Date not available"
                                : d.toLocaleDateString("en-GB");
                        })()
                        : "Date not available"}
                </p>
            </div>

            <div className="flex flex-col lg:grid lg:grid-cols-12 gap-4 sm:gap-5">
                {/* Main content */}
                <div className="w-full lg:col-span-8 space-y-4 sm:space-y-5">

                    {/* ── Assignment Description (always visible) ── */}
                    <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6">
                        <SectionLabel>Assignment Description</SectionLabel>
                        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-4">
                            {assignment.description || "No description provided."}
                        </p>

                        {assignment.instructions && (
                            <>
                                <SectionLabel>Instructions</SectionLabel>
                                <div className="bg-blue-50 rounded-xl p-4 sm:p-5 border border-blue-100">
                                    <div className="flex items-start gap-2">
                                        <FaInfoCircle className="text-blue-500 text-xs sm:text-sm mt-0.5 flex-shrink-0" />
                                        <p className="text-xs sm:text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                                            {assignment.instructions}
                                        </p>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* ── Tabs: Submitted Files / Submission History ── */}
                    <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6">
                        <Tabs
                            tabs={["Submitted Files", "Submission History"]}
                            active={tab}
                            onChange={setTab}
                        />

                        {tab === "Submitted Files" && (
                            <div className="space-y-4 sm:space-y-5">
                                {/* Info grid */}
                                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                                    <InfoBox
                                        label="Submitted on"
                                        value={(() => {
                                            if (!assignment.submittedDate) return "—";
                                            const d = new Date(assignment.submittedDate);
                                            return isNaN(d.getTime()) ? "—" : d.toLocaleDateString();
                                        })()}
                                        icon={FaCalendarAlt}
                                    />
                                    <InfoBox
                                        label="Status"
                                        value="Awaiting review"
                                        valueClass="text-orange-500"
                                        icon={FaClock}
                                    />
                                    <InfoBox label="Total Marks" value={assignment.maxMarks} icon={FaStar} />
                                    <InfoBox
                                        label="Grading"
                                        value="Pending"
                                        valueClass="text-orange-500"
                                        icon={FaChartBar}
                                    />
                                </div>

                                {/* Submitted files */}
                                {assignment.submittedFiles?.length > 0 ? (
                                    <div>
                                        <SectionLabel>Your Submitted Files</SectionLabel>
                                        <div className="space-y-2">
                                            {assignment.submittedFiles.map((f, i) => (
                                                <FileRow
                                                    key={i}
                                                    name={f.name}
                                                    size={f.size}
                                                    type={f.type}
                                                    onDownload={() => window.open(f.url, "_blank")}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-8 text-center">
                                        <FaFileAlt className="text-gray-200 text-3xl mb-3" />
                                        <p className="text-sm font-semibold text-gray-400">No files attached</p>
                                        <p className="text-xs text-gray-400 mt-1">
                                            No files were uploaded with this submission.
                                        </p>
                                    </div>
                                )}

                                {/* Submission note */}
                                {assignment.submissionNote && (
                                    <div>
                                        <SectionLabel>Notes to Instructor</SectionLabel>
                                        <div className="bg-gray-50 rounded-xl p-3 sm:p-4 text-xs sm:text-sm text-gray-600 leading-relaxed border border-gray-100">
                                            {assignment.submissionNote}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {tab === "Submission History" && (
                            <div className="space-y-0">
                                {(assignment.history || []).length > 0 ? (
                                    assignment.history.map((item, i) => (
                                        <div
                                            key={i}
                                            className="flex items-center justify-between py-3 sm:py-4 border-b border-gray-100 last:border-0"
                                        >
                                            <div className="flex items-center gap-2 sm:gap-3 text-[11px] sm:text-sm text-gray-700">
                                                {historyIconMap[item.type] || (
                                                    <FaEye className="text-gray-400 text-xs" />
                                                )}
                                                {item.label}
                                            </div>
                                            <span className="text-[10px] sm:text-xs text-gray-400">{item.time}</span>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-center text-gray-400 text-sm py-6">
                                        No history available.
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="w-full lg:col-span-4 space-y-4 sm:space-y-5">
                    <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5">
                        <SectionLabel>Assignment Info</SectionLabel>
                        <div className="space-y-2 sm:space-y-3">
                            <InfoBox
                                label="Due Date"
                                value={
                                    assignment.dueDate
                                        ? new Date(assignment.dueDate).toLocaleDateString()
                                        : "—"
                                }
                                icon={FaCalendarAlt}
                            />
                            <InfoBox label="Total Marks" value={assignment.maxMarks} icon={FaStar} />
                            <InfoBox
                                label="Module ID"
                                value={assignment.moduleId}
                                icon={FaInfoCircle}
                            />
                            <InfoBox
                                label="Course"
                                value={assignment.courseName || `Course ${assignment.courseId}`}
                                icon={FaInfoCircle}
                            />
                        </div>
                    </div>

                    <div className="flex gap-2 sm:gap-3">
                        <button
                            onClick={onBack}
                            className="flex-1 py-2 sm:py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm font-semibold text-gray-600 hover:bg-gray-100 transition"
                        >
                            Back
                        </button>
                        {allowResubmission && (
                            <button
                                onClick={() => onResubmit(assignment)}
                                className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-2 sm:py-2.5 rounded-xl bg-blue-600 text-white text-xs sm:text-sm font-semibold hover:bg-blue-700 transition"
                            >
                                <FaRedo className="text-[10px] sm:text-xs" /> Resubmit
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}