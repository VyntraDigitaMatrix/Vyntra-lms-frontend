import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
    FaArrowLeft,
    FaUpload,
    FaCheckCircle,
    FaCalendarAlt,
    FaStar,
    FaClock,
    FaExclamationTriangle,
    FaExclamationCircle,
    FaHourglassHalf,
    FaUndo,
    FaInfoCircle,
    FaSpinner,
} from "react-icons/fa";
import { Badge, SectionLabel, InfoBox } from "./AssignmentShared";

const PendingDetail = ({ assignment, onBack, onSubmit }) => {
    const [uploadedFile, setUploadedFile] = useState(null);
    const [notes, setNotes] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const fileInputRef = useRef(null);

    const dueDate = assignment.dueDate ? new Date(assignment.dueDate) : null;
    const now = new Date();
    const daysLeft = dueDate ? Math.max(0, Math.ceil((dueDate - now) / 86400000)) : null;
    const isOverdue = dueDate && now > dueDate;
    const isLate = isOverdue && assignment.allowLateSubmission;
    const deadlinePassed = isOverdue && !assignment.allowLateSubmission;

    const handleSubmit = async () => {
        if (!uploadedFile) return;
        setSubmitting(true);
        setUploadProgress(0);
        await onSubmit(
            assignment.id,
            notes,
            uploadedFile
        );
    };

    return (
        <div className="min-h-screen bg-[#f6f7fb] p-3 sm:p-4 md:p-5">
            {/* Breadcrumb */}
            <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-400 mb-2 sm:mb-4">
                <Link to="/student/dashboard" className="hover:text-blue-600">Dashboard</Link>
                <span>&gt;</span>
                <button onClick={onBack} className="hover:text-blue-600">Assignments</button>
                <span>&gt;</span>
                <span className="text-gray-600 font-medium truncate">{assignment.title}</span>
            </div>

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4 sm:mb-6">
                <button onClick={onBack} className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-xl bg-white border border-gray-200 text-gray-500 hover:bg-gray-100 transition shadow-sm">
                    <FaArrowLeft className="text-xs sm:text-sm" />
                </button>
                <div className="flex-1">
                    <h1 className="text-base sm:text-xl font-bold text-gray-900">{assignment.title}</h1>
                    <p className="text-xs sm:text-sm text-gray-500">Module {assignment.moduleId}</p>
                </div>
                <div className="sm:ml-auto">
                    <Badge status={assignment.status} />
                </div>
            </div>

            <div className="flex flex-col lg:grid lg:grid-cols-12 gap-4 sm:gap-5">
                {/* Main */}
                <div className="w-full lg:col-span-8 space-y-4 sm:space-y-5">
                    {/* Status banners */}
                    {deadlinePassed && (
                        <div className="flex items-center gap-2 sm:gap-3 rounded-xl px-3 sm:px-4 py-2 sm:py-3 bg-red-50 border border-red-200">
                            <FaExclamationCircle className="flex-shrink-0 text-xs sm:text-sm text-red-500" />
                            <p className="text-[11px] sm:text-sm font-semibold text-red-600">
                                Deadline has passed. Late submissions are not allowed for this assignment.
                            </p>
                        </div>
                    )}
                    {isLate && (
                        <div className="flex items-center gap-2 sm:gap-3 rounded-xl px-3 sm:px-4 py-2 sm:py-3 bg-yellow-50 border border-yellow-200">
                            <FaHourglassHalf className="flex-shrink-0 text-xs sm:text-sm text-yellow-600" />
                            <p className="text-[11px] sm:text-sm font-semibold text-yellow-700">Late submission accepted</p>
                        </div>
                    )}
                    {!isOverdue && daysLeft !== null && (
                        <div className={`flex items-center gap-2 sm:gap-3 rounded-xl px-3 sm:px-4 py-2 sm:py-3 ${daysLeft <= 2 ? "bg-red-50 border border-red-200" : "bg-orange-50 border border-orange-200"}`}>
                            <FaExclamationTriangle className={`flex-shrink-0 text-xs sm:text-sm ${daysLeft <= 2 ? "text-red-500" : "text-orange-400"}`} />
                            <p className={`text-[11px] sm:text-sm font-semibold ${daysLeft <= 2 ? "text-red-600" : "text-orange-600"}`}>
                                {daysLeft === 0 ? "Due today — submit before 11:59 PM!" : `${daysLeft} day${daysLeft !== 1 ? "s" : ""} remaining`}
                            </p>
                            {dueDate && <span className="ml-auto text-[10px] sm:text-xs font-bold text-gray-400">{dueDate.toLocaleDateString()}</span>}
                        </div>
                    )}

                    {/* Description */}
                    <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6">
                        <SectionLabel>Assignment Description</SectionLabel>
                        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-4">{assignment.description}</p>
                        {assignment.instructions && (
                            <>
                                <SectionLabel>Instructions</SectionLabel>
                                <div className="bg-blue-50 rounded-xl p-4 sm:p-5 border border-blue-100">
                                    <div className="flex items-start gap-2">
                                        <FaInfoCircle className="text-blue-500 text-xs sm:text-sm mt-0.5 flex-shrink-0" />
                                        <p className="text-xs sm:text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{assignment.instructions}</p>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Submit */}
                    <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6">
                        <SectionLabel>Submit Your Work</SectionLabel>
                        {deadlinePassed ? (
                            <div className="text-center py-8">
                                <FaExclamationCircle className="text-gray-300 text-3xl sm:text-4xl mx-auto mb-3" />
                                <p className="text-sm font-semibold text-gray-500">Submission Closed</p>
                                <p className="text-xs text-gray-400 mt-1">This assignment is no longer accepting submissions.</p>
                            </div>
                        ) : (
                            <>
                                <div
                                    className={`border-2 border-dashed rounded-xl p-4 sm:p-8 text-center transition cursor-pointer ${uploadedFile ? "border-green-400 bg-green-50" : "border-gray-200 hover:border-blue-400 hover:bg-blue-50"
                                        }`}
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.zip"
                                        style={{ display: "none" }}
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) setUploadedFile(file);
                                        }}
                                    />
                                    {uploadedFile ? (
                                        <>
                                            <FaCheckCircle className="text-green-500 text-2xl sm:text-3xl mx-auto mb-2" />
                                            <p className="text-xs sm:text-sm font-semibold text-green-700">File selected: {uploadedFile.name}</p>
                                            <p className="text-[10px] sm:text-xs text-green-500 mt-1">Click to change file</p>
                                        </>
                                    ) : (
                                        <>
                                            <FaUpload className="text-gray-300 text-2xl sm:text-3xl mx-auto mb-2" />
                                            <p className="text-xs sm:text-sm font-semibold text-gray-500">Drag & drop your file here</p>
                                            <p className="text-[10px] sm:text-xs text-gray-400 mt-1">or click to browse</p>
                                            <p className="text-[10px] text-gray-400 mt-2">Accepted: PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX, ZIP</p>
                                        </>
                                    )}
                                </div>

                                {uploadProgress > 0 && uploadProgress < 100 && (
                                    <div className="mt-3">
                                        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                            <div className="h-full bg-blue-600 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                                        </div>
                                        <p className="text-[10px] text-gray-400 mt-1 text-center">{uploadProgress}% uploaded</p>
                                    </div>
                                )}

                                {uploadedFile && (
                                    <div className="mt-3 sm:mt-4">
                                        <label className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">
                                            Notes to instructor (optional)
                                        </label>
                                        <textarea
                                            rows={3}
                                            value={notes}
                                            onChange={(e) => setNotes(e.target.value)}
                                            placeholder="Add any notes or context about your submission..."
                                            className="w-full border border-gray-200 rounded-xl p-2 sm:p-3 text-xs sm:text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none"
                                        />
                                    </div>
                                )}

                                <div className="flex justify-end gap-2 sm:gap-3 mt-3 sm:mt-4">
                                    <button onClick={onBack} className="px-3 sm:px-5 py-1.5 sm:py-2 rounded-xl border border-gray-200 text-xs sm:text-sm font-semibold text-gray-600 hover:bg-gray-100 transition">
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSubmit}
                                        disabled={!uploadedFile || submitting}
                                        className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${uploadedFile && !submitting
                                            ? "bg-blue-600 text-white hover:bg-blue-700"
                                            : "bg-gray-100 text-gray-400 cursor-not-allowed"
                                            }`}
                                    >
                                        {submitting ? <FaSpinner className="animate-spin text-[10px] sm:text-xs" /> : <FaUpload className="text-[10px] sm:text-xs" />}
                                        {submitting ? "Submitting..." : "Submit"}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="w-full lg:col-span-4 space-y-4 sm:space-y-5">
                    <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5">
                        <SectionLabel>Assignment Info</SectionLabel>
                        <div className="space-y-2 sm:space-y-3">
                            <InfoBox label="Due Date" value={dueDate ? dueDate.toLocaleDateString() : "Not set"} valueClass={deadlinePassed ? "text-red-500" : "text-red-500"} icon={FaCalendarAlt} />
                            <InfoBox label="Total Marks" value={assignment.maxMarks} icon={FaStar} />
                            <InfoBox label="Status" value={deadlinePassed ? "Closed" : "Not submitted"} valueClass={deadlinePassed ? "text-red-500" : "text-orange-500"} icon={FaClock} />
                            <InfoBox label="Submission Type" value="File upload" icon={FaUpload} />
                            {assignment.allowLateSubmission && (
                                <InfoBox label="Late Submission" value="Allowed" valueClass="text-yellow-600" icon={FaHourglassHalf} />
                            )}
                            {assignment.allowResubmission && (
                                <InfoBox label="Resubmission" value="Allowed" valueClass="text-green-600" icon={FaUndo} />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PendingDetail;