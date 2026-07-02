// LessonBuilder.jsx
import React, { useState, useEffect } from "react";
import { instructorLessonApi } from "../auth/api";
import { useNavigate, useLocation } from "react-router-dom";
import {
    FaArrowLeft,
    FaCloudUploadAlt,
    FaPaperclip,
    FaVideo,
    FaFileAlt,
    FaLink,
    FaPlay,
    FaClock,
    FaSave,
    FaEye,
    FaTrashAlt,
    FaCog,
    FaFilePdf,
    FaFileWord,
    FaFileImage,
    FaTimes,
    FaInfoCircle
} from "react-icons/fa";
import { MdQuiz, MdAssignment, MdArticle, MdSlideshow } from "react-icons/md";

const LessonBuilder = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Get lesson data from navigation state
    const state = location.state || {};
    const { lesson, section, course, sectionIndex, lessonIndex } = state;
    const lessonSlug = lesson?.slug || lesson?.lessonSlug;
    const courseSlug = course?.slug || course?.courseSlug;

    const [isDragging, setIsDragging] = useState(false);
    const [videoSource, setVideoSource] = useState("upload");
    const [videoFile, setVideoFile] = useState(null);
    const [embedUrl, setEmbedUrl] = useState("");
    const [lessonTitle, setLessonTitle] = useState(lesson?.title || "Untitled Lesson");
    const [lessonDescription, setLessonDescription] = useState(lesson?.description || "");
    const [attachments, setAttachments] = useState([
        { id: 1, name: "Lesson Notes.pdf", type: "pdf", size: "2.4 MB" },
        { id: 2, name: "Exercise Sheet.docx", type: "doc", size: "1.1 MB" },
    ]);
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    // Auto-save effect
    useEffect(() => {
        if (saveSuccess) {
            const timer = setTimeout(() => setSaveSuccess(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [saveSuccess]);

    const getFileIcon = (type) => {
        switch (type) {
            case "pdf": return <FaFilePdf className="text-red-500" />;
            case "doc": return <FaFileWord className="text-blue-500" />;
            case "image": return <FaFileImage className="text-green-500" />;
            default: return <FaFileAlt className="text-gray-500" />;
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        console.log("Files dropped:", e.dataTransfer.files);
    };

    const handleSave = async () => {

        try {

            setIsSaving(true);

            const formData = new FormData();

            formData.append("title", lessonTitle);

            formData.append("description", lessonDescription);

            formData.append("lessonType", lesson.lessonType);

            formData.append("content", lesson.content || "");

            formData.append(
                "videoInputType",
                lesson.videoInputType || "URL"
            );

            if (videoFile) {
                formData.append("videoFile", videoFile);
            } else {
                formData.append(
                    "videoUrl",
                    lesson.videoUrl || ""
                );
            }

            formData.append(
                "resourceInputType",
                lesson.resourceInputType || "URL"
            );

            formData.append(
                "resourceUrl",
                lesson.resourceUrl || ""
            );

            formData.append(
                "durationInMinutes",
                lesson.durationInMinutes || 15
            );

            formData.append(
                "sortOrder",
                lesson.sortOrder || 1
            );

            formData.append(
                "previewAllowed",
                lesson.previewAllowed ?? true
            );

            formData.append(
                "mandatory",
                lesson.mandatory ?? true
            );

            await instructorLessonApi.updateLesson(
                lessonSlug,
                formData
            );

            setSaveSuccess(true);

        } catch (err) {

            console.log(err.response?.data);

        } finally {

            setIsSaving(false);

        }

    };

    const handleDelete = async () => {

        if (!window.confirm("Delete lesson?")) return;

        await instructorLessonApi.deleteLesson(
            lessonSlug
        );

        navigate(
            `/instructor/course-builder/${courseSlug}`
        );

    };

    const getLessonTypeIcon = () => {
        const type = lesson?.lessonType || "VIDEO";
        switch (type) {
            case "QUIZ": return <MdQuiz className="text-purple-600" />;
            case "ASSIGNMENT": return <MdAssignment className="text-teal-600" />;
            case "ARTICLE": return <MdArticle className="text-blue-600" />;
            case "SLIDES": return <MdSlideshow className="text-yellow-600" />;
            default: return <FaVideo className="text-violet-600" />;
        }
    };

    const getLessonTypeLabel = () => {
        const type = lesson?.lessonType || "VIDEO";
        const types = {
            VIDEO: "Video Lesson",
            AUDIO: "Audio Lesson",
            PDF: "PDF Document",
            SLIDES: "Slides Presentation",
            LIVE: "Live Session",
            ARTICLE: "Article",
            SCORM: "SCORM/Tincan",
            QUIZ: "Quiz",
            ASSIGNMENT: "Assignment"
        };
        return types[type] || "Lesson";
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate(`/instructor/course-builder/${courseSlug}`)}
                                className="flex items-center gap-2 text-gray-600 hover:text-violet-600 transition-colors duration-200 group"
                            >
                                <FaArrowLeft className="group-hover:-translate-x-1 transition-transform text-sm" />
                                <span className="text-sm font-medium">Back to Course</span>
                            </button>

                            <div className="h-6 w-px bg-gray-300"></div>

                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-medium text-gray-500">Section:</span>
                                    <span className="text-sm font-semibold text-gray-700">{section?.title || "Untitled Section"}</span>
                                </div>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-xs font-medium text-gray-500">Lesson:</span>
                                    <span className="text-sm font-semibold text-violet-600">{lessonTitle}</span>
                                    <span className="text-xs text-gray-400">({getLessonTypeLabel()})</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => handleSave()}
                                disabled={isSaving}
                                className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors duration-200 flex items-center gap-2 text-sm font-medium disabled:opacity-50"
                            >
                                <FaSave />
                                {isSaving ? "Saving..." : "Save Lesson"}
                            </button>

                            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center gap-2 text-sm">
                                <FaEye className="text-gray-600" />
                                Preview
                            </button>

                            <button
                                onClick={() => navigate("/instructor/lesson-settings")}
                                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center gap-2 text-sm">
                                <FaCog />
                                Settings
                            </button>

                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors duration-200 flex items-center gap-2 text-sm"
                            >
                                <FaTrashAlt />
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 py-6">
                {/* Save Success Message */}
                {saveSuccess && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-700">
                        <FaInfoCircle className="text-green-500" />
                        <span className="text-sm font-medium">Lesson saved successfully!</span>
                    </div>
                )}

                <div className="grid grid-cols-12 gap-6">
                    {/* Main Content Area */}
                    <div className="col-span-8 space-y-6">
                        {/* Lesson Title */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <label className="text-sm font-semibold text-gray-700 block mb-2">
                                Lesson Title
                            </label>
                            <input
                                type="text"
                                value={lessonTitle}
                                onChange={(e) => setLessonTitle(e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none text-lg font-semibold"
                                placeholder="Enter lesson title..."
                            />
                        </div>

                        {/* Video Section */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-sm font-semibold flex items-center gap-2">
                                    {getLessonTypeIcon()}
                                    {getLessonTypeLabel()}
                                </h2>
                                {lesson?.lessonType === "VIDEO" && (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setVideoSource("upload")}
                                            className={`px-3 py-1 text-xs rounded-lg transition-colors ${videoSource === "upload"
                                                ? "bg-violet-100 text-violet-700"
                                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                                }`}
                                        >
                                            Upload
                                        </button>
                                        <button
                                            onClick={() => setVideoSource("embed")}
                                            className={`px-3 py-1 text-xs rounded-lg transition-colors ${videoSource === "embed"
                                                ? "bg-violet-100 text-violet-700"
                                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                                }`}
                                        >
                                            Embed
                                        </button>
                                        <button
                                            onClick={() => setVideoSource("cloud")}
                                            className={`px-3 py-1 text-xs rounded-lg transition-colors ${videoSource === "cloud"
                                                ? "bg-violet-100 text-violet-700"
                                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                                }`}
                                        >
                                            Cloud
                                        </button>
                                    </div>
                                )}
                            </div>

                            {(lesson?.lessonType === "VIDEO" || lesson?.lessonType === "AUDIO") && (
                                <div
                                    className={`h-[400px] border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-all duration-200 ${isDragging
                                        ? "border-violet-500 bg-violet-50"
                                        : "border-gray-300 hover:border-violet-400 hover:bg-gray-50"
                                        }`}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                >
                                    {videoSource === "upload" && (
                                        <>
                                            <div className="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center mb-4">
                                                <FaCloudUploadAlt className="text-3xl text-violet-600" />
                                            </div>

                                            <input
                                                type="file"
                                                accept="video/*"
                                                id="videoUpload"
                                                hidden
                                                onChange={(e) => {
                                                    if (e.target.files.length > 0) {
                                                        setVideoFile(e.target.files[0]);
                                                    }
                                                }}
                                            />

                                            <label
                                                htmlFor="videoUpload"
                                                className="px-5 py-2 bg-violet-600 text-white rounded-lg cursor-pointer hover:bg-violet-700"
                                            >
                                                Upload Video
                                            </label>

                                            {videoFile && (
                                                <div className="mt-4 text-center">
                                                    <p className="text-sm font-semibold text-green-600">
                                                        {videoFile.name}
                                                    </p>

                                                    <video
                                                        controls
                                                        className="mt-3 w-full max-w-xl rounded-lg"
                                                        src={URL.createObjectURL(videoFile)}
                                                    />
                                                </div>
                                            )}
                                        </>
                                    )}

                                    {videoSource === "embed" && (
                                        <div className="w-full max-w-md px-4">
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    placeholder="Enter video URL (YouTube, Vimeo, etc.)"
                                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none text-sm"
                                                    value={embedUrl}
                                                    onChange={(e) => setEmbedUrl(e.target.value)}
                                                />
                                                <button className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors text-sm whitespace-nowrap">
                                                    Embed
                                                </button>
                                            </div>
                                            <p className="text-gray-400 text-xs mt-2">
                                                Supported platforms: YouTube, Vimeo, Loom, and more
                                            </p>
                                        </div>
                                    )}

                                    {videoSource === "cloud" && (
                                        <div className="text-center">
                                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                                                <FaCloudUploadAlt className="text-3xl text-blue-600" />
                                            </div>
                                            <p className="text-gray-600 font-medium text-sm">
                                                Connect cloud storage
                                            </p>
                                            <div className="flex gap-3 mt-4 text-sm">
                                                <button className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                                                    Google Drive
                                                </button>
                                                <button className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                                                    Dropbox
                                                </button>
                                                <button className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                                                    OneDrive
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {lesson?.lessonType === "QUIZ" && (
                                <div className="h-[300px] flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl">
                                    <MdQuiz className="text-6xl text-purple-300 mb-4" />
                                    <p className="text-gray-500 font-medium">Quiz Configuration</p>
                                    <p className="text-gray-400 text-sm mt-1">Add questions and set quiz options</p>
                                    <button className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm">
                                        Configure Quiz
                                    </button>
                                </div>
                            )}

                            {lesson?.lessonType === "ASSIGNMENT" && (
                                <div className="h-[300px] flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl">
                                    <MdAssignment className="text-6xl text-teal-300 mb-4" />
                                    <p className="text-gray-500 font-medium">Assignment Settings</p>
                                    <p className="text-gray-400 text-sm mt-1">Set assignment instructions and requirements</p>
                                    <button className="mt-4 px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-sm">
                                        Configure Assignment
                                    </button>
                                </div>
                            )}

                            {(lesson?.lessonType === "ARTICLE" || lesson?.lessonType === "PDF") && (
                                <div className="h-[300px] flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl">
                                    {lesson?.lessonType === "ARTICLE" ? (
                                        <MdArticle className="text-6xl text-blue-300 mb-4" />
                                    ) : (
                                        <FaFilePdf className="text-6xl text-red-300 mb-4" />
                                    )}
                                    <p className="text-gray-500 font-medium">Upload {lesson?.type === "ARTICLE" ? "Article" : "PDF"}</p>
                                    <p className="text-gray-400 text-sm mt-1">Drop your content here or browse</p>
                                    <button className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                                        Upload Content
                                    </button>
                                </div>
                            )}

                            {!lesson && (
                                <div className="h-[200px] flex items-center justify-center text-gray-400">
                                    Select a lesson type to begin
                                </div>
                            )}
                        </div>

                        {/* Lesson Description */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="font-semibold mb-3 text-sm flex items-center gap-2">
                                <FaInfoCircle className="text-gray-400" />
                                Lesson Description
                            </h3>
                            <textarea
                                className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none resize-none text-sm"
                                placeholder="Provide a detailed description of this lesson..."
                                value={lessonDescription}
                                onChange={(e) => setLessonDescription(e.target.value)}
                            />
                            <div className="flex justify-end mt-2">
                                <span className="text-xs text-gray-400">{lessonDescription.length}/500 characters</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Sidebar */}
                    <div className="col-span-4">
                        <div className="sticky top-6 space-y-6">
                            {/* Course Info */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                                    Course Information
                                </h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Course</span>
                                        <span className="font-medium">{course?.title || "Untitled Course"}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Section</span>
                                        <span className="font-medium">{section?.title || "Untitled Section"}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Type</span>
                                        <span className="font-medium">{getLessonTypeLabel()}</span>
                                    </div>
                                    {sectionIndex !== undefined && lessonIndex !== undefined && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Position</span>
                                            <span className="font-medium">Section {sectionIndex + 1}, Lesson {lessonIndex + 1}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Attachments */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center justify-between mb-2">
                                    <h2 className="text-sm font-semibold flex items-center gap-2">
                                        <FaPaperclip className="text-violet-600" />
                                        Attachments
                                    </h2>
                                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                        {attachments.length}
                                    </span>
                                </div>
                                <p className="text-gray-500 text-xs mb-4">
                                    Add supporting materials for your students
                                </p>

                                <div className="space-y-2 max-h-[300px] overflow-y-auto mb-4 pr-2">
                                    {attachments.map((file) => (
                                        <div
                                            key={file.id}
                                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                                        >
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm flex-shrink-0">
                                                    {getFileIcon(file.type)}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-medium text-xs truncate">{file.name}</p>
                                                    <p className="text-xs text-gray-500">{file.size}</p>
                                                </div>
                                            </div>
                                            <button className="text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                                                <FaTimes className="text-xs" />
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                <div className="border-t border-gray-200 pt-4">
                                    <div className="grid grid-cols-2 gap-2">
                                        <button className="flex items-center justify-center gap-2 px-3 py-2 bg-violet-50 text-violet-600 rounded-lg hover:bg-violet-100 transition-colors text-sm">
                                            <FaCloudUploadAlt />
                                            Upload
                                        </button>
                                        <button className="flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm">
                                            <FaLink />
                                            Link
                                        </button>
                                    </div>

                                    <div className="mt-3 space-y-1.5">
                                        <button className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                                            <FaFilePdf className="text-red-400" />
                                            Add PDF File
                                        </button>
                                        <button className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                                            <FaFileWord className="text-blue-400" />
                                            Add Document
                                        </button>
                                        <button className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                                            <FaFileImage className="text-green-400" />
                                            Add Image
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Lesson Stats */}
                            <div className="bg-gradient-to-br from-violet-50 to-indigo-50 rounded-xl p-4 border border-violet-100">
                                <h4 className="font-semibold text-gray-700 mb-2 text-sm flex items-center gap-2">
                                    <FaClock className="text-violet-600" />
                                    Lesson Stats
                                </h4>

                                <div className="space-y-2 text-xs">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Duration</span>
                                        <span className="font-medium">15 min</span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Students enrolled</span>
                                        <span className="font-medium">124</span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Completion rate</span>
                                        <span className="font-medium text-green-600">78%</span>
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

export default LessonBuilder;