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
    FaInfoCircle,
    FaLock,
    FaUnlock,
    FaCheckCircle,
    FaTimesCircle,
    FaImage,
    FaExternalLinkAlt,
} from "react-icons/fa";
import { MdQuiz, MdAssignment, MdArticle, MdSlideshow } from "react-icons/md";

// ─── helper: convert a YouTube / Vimeo watch URL into an embeddable src ───────
const getEmbedUrl = (url) => {
    if (!url) return null;

    // YouTube
    const ytMatch = url.match(
        /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/
    );
    if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;

    // Vimeo
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;

    // Loom
    const loomMatch = url.match(/loom\.com\/share\/([a-f0-9]+)/);
    if (loomMatch) return `https://www.loom.com/embed/${loomMatch[1]}`;

    return null; // direct file URL — use <video> tag
};

// ─── helper: derive a thumbnail src from settings ─────────────────────────────
const getThumbnailSrc = (lessonData) => {
    if (!lessonData) return null;
    if (lessonData.thumbnailInputType === "FILE_UPLOAD" && lessonData.thumbnailFile)
        return URL.createObjectURL(lessonData.thumbnailFile);
    if (lessonData.thumbnailUrl) return lessonData.thumbnailUrl;
    return null;
};

// ─── helper: extract filename from url ──────────────────────────────────────────
const getFilenameFromUrl = (url) => {
    if (!url) return "Resource Link";
    try {
        const decodedUrl = decodeURIComponent(url);
        const filename = decodedUrl.split('/').pop();
        return filename.split('?')[0] || "Resource Link";
    } catch (e) {
        return url.split('/').pop().split('?')[0] || "Resource Link";
    }
};

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
    const [lessonData, setLessonData] = useState(lesson || {});
    const [attachments, setAttachments] = useState([]);
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);

    // Sync attachments with lesson resources
    useEffect(() => {
        const newAttachments = [];
        let fileUrl = null;

        if (lessonData?.resourceFile) {
            fileUrl = URL.createObjectURL(lessonData.resourceFile);
            newAttachments.push({
                id: "res-file",
                name: lessonData.resourceFile.name,
                type: "file",
                size: (lessonData.resourceFile.size / (1024 * 1024)).toFixed(2) + " MB",
                url: fileUrl
            });
        } else if (lessonData?.resourceUrl) {
            newAttachments.push({
                id: "res-url",
                name: getFilenameFromUrl(lessonData.resourceUrl),
                type: "link",
                size: "Link",
                url: lessonData.resourceUrl
            });
        }
        setAttachments(newAttachments);

        return () => {
            if (fileUrl) {
                URL.revokeObjectURL(fileUrl);
            }
        };
    }, [lessonData]);

    // Re-sync local state when navigating back from Settings with updated lesson data
    useEffect(() => {
        if (lesson) {
            setLessonTitle(lesson.title || "Untitled Lesson");
            setLessonDescription(lesson.description || "");
            setLessonData(lesson);
        }
    }, [location.state]);

    // Auto-hide save success banner
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
            formData.append("title", lessonTitle || "");
            formData.append("lessonTitle", lessonTitle || ""); // Fallback for backend
            formData.append("name", lessonTitle || ""); // Additional fallback

            if (lessonDescription) {
                formData.append("description", lessonDescription);
            }

            const type = lessonData.lessonType || lesson?.lessonType || "VIDEO";
            formData.append("lessonType", type);

            if (lessonData.content || lesson?.content) {
                formData.append("content", lessonData.content || lesson?.content);
            }

            if (type === "VIDEO" || lessonData.videoInputType || lesson?.videoInputType) {
                formData.append("videoInputType", lessonData.videoInputType || lesson?.videoInputType || "URL");
                if (videoFile) {
                    formData.append("videoFile", videoFile);
                } else if (lessonData.videoUrl || lesson?.videoUrl) {
                    formData.append("videoUrl", lessonData.videoUrl || lesson?.videoUrl);
                }
            }

            if (lessonData.resourceInputType || lesson?.resourceInputType) {
                formData.append("resourceInputType", lessonData.resourceInputType || lesson?.resourceInputType);
            }
            if (lessonData.resourceUrl || lesson?.resourceUrl) {
                formData.append("resourceUrl", lessonData.resourceUrl || lesson?.resourceUrl);
            }

            formData.append("durationInMinutes", lessonData.durationInMinutes || lesson?.durationInMinutes || 15);
            formData.append("sortOrder", lessonData.sortOrder || lesson?.sortOrder || 1);
            formData.append("previewAllowed", lessonData.previewAllowed ?? lesson?.previewAllowed ?? true);
            formData.append("mandatory", lessonData.mandatory ?? lesson?.mandatory ?? true);

            await instructorLessonApi.updateLesson(lessonSlug, formData);
            setSaveSuccess(true);
        } catch (err) {
            console.log(err.response?.data);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Delete lesson?")) return;
        try {
            await instructorLessonApi.deleteLesson(lessonSlug);
            navigate(`/instructor/course-builder/${courseSlug}`);
        } catch (err) {
            console.error("Delete lesson error:", err);
            const errorData = err.response?.data;
            alert(typeof errorData === 'object' ? JSON.stringify(errorData) : err.message || "Failed to delete lesson");
        }
    };

    const getLessonTypeIcon = () => {
        const type = lessonData?.lessonType || "VIDEO";
        switch (type) {
            case "QUIZ": return <MdQuiz className="text-purple-600" />;
            case "ASSIGNMENT": return <MdAssignment className="text-teal-600" />;
            case "ARTICLE": return <MdArticle className="text-blue-600" />;
            case "SLIDES": return <MdSlideshow className="text-yellow-600" />;
            default: return <FaVideo className="text-violet-600" />;
        }
    };

    const getLessonTypeLabel = () => {
        const type = lessonData?.lessonType || "VIDEO";
        const types = {
            VIDEO: "Video Lesson",
            TEXT: "Text Lesson",
            AUDIO: "Audio Lesson",
            PDF: "PDF Document",
            SLIDES: "Slides Presentation",
            LIVE: "Live Session",
            LIVE_CLASS: "Live Class",
            ARTICLE: "Article",
            SCORM: "SCORM/Tincan",
            QUIZ: "Quiz",
            ASSIGNMENT: "Assignment",
        };
        return types[type] || type || "Lesson";
    };

    // ── derived values from settings ──────────────────────────────────────────
    const lessonType = lessonData?.lessonType || "VIDEO";
    const isVideoOrAudio = lessonType === "VIDEO" || lessonType === "AUDIO";

    // Determine what to display in the video area
    const settingsVideoUrl = lessonData?.videoUrl || "";
    const settingsVideoType = lessonData?.videoInputType || "URL";
    const settingsVideoFile = lessonData?.videoFile || null; // set by settings FILE_UPLOAD

    // A video is "configured" when settings provided one
    const hasConfiguredVideoUrl = settingsVideoType === "URL" && settingsVideoUrl;
    const hasConfiguredVideoFile = settingsVideoType === "FILE_UPLOAD" && settingsVideoFile;
    const hasConfiguredVideo = hasConfiguredVideoUrl || hasConfiguredVideoFile;
    const embedSrc = hasConfiguredVideoUrl ? getEmbedUrl(settingsVideoUrl) : null;

    // Thumbnail
    const thumbnailSrc = getThumbnailSrc(lessonData);

    // Duration
    const durationMinutes = lessonData?.durationInMinutes || 15;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* ── Header ── */}
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
                                onClick={handleSave}
                                disabled={isSaving}
                                className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors duration-200 flex items-center gap-2 text-sm font-medium disabled:opacity-50"
                            >
                                <FaSave />
                                {isSaving ? "Saving..." : "Save Lesson"}
                            </button>

                            <button
                                onClick={() =>
                                    navigate(`/instructor/lesson-settings/${courseSlug}/${lessonSlug}`, {
                                        state: {
                                            lesson: { ...lesson, ...lessonData, title: lessonTitle, description: lessonDescription },
                                            section,
                                            course,
                                        },
                                    })
                                }
                                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center gap-2 text-sm"
                            >
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

            {/* ── Main Content ── */}
            <div className="max-w-7xl mx-auto px-6 py-6">
                {/* Save Success Banner */}
                {saveSuccess && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-700">
                        <FaInfoCircle className="text-green-500" />
                        <span className="text-sm font-medium">Lesson saved successfully!</span>
                    </div>
                )}

                <div className="grid grid-cols-12 gap-6">
                    {/* ── Main Content Area ── */}
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

                        {/* ── Media / Content Card ── */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">

                            {/* Card header */}
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-sm font-semibold flex items-center gap-2">
                                    {getLessonTypeIcon()}
                                    {getLessonTypeLabel()}
                                </h2>

                                {/* Upload-source toggle — only for VIDEO when no configured video yet */}
                                {lessonType === "VIDEO" && !hasConfiguredVideo && (
                                    <div className="flex gap-2">
                                        {["upload", "embed", "cloud"].map((src) => (
                                            <button
                                                key={src}
                                                onClick={() => setVideoSource(src)}
                                                className={`px-3 py-1 text-xs rounded-lg capitalize transition-colors ${videoSource === src
                                                    ? "bg-violet-100 text-violet-700"
                                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                                    }`}
                                            >
                                                {src}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {/* "Change video" link when a video IS configured */}
                                {isVideoOrAudio && hasConfiguredVideo && (
                                    <button
                                        onClick={() =>
                                            navigate(`/instructor/lesson-settings/${courseSlug}/${lessonSlug}`, {
                                                state: {
                                                    lesson: { ...lesson, ...lessonData, title: lessonTitle, description: lessonDescription },
                                                    section,
                                                    course,
                                                },
                                            })
                                        }
                                        className="flex items-center gap-1.5 text-xs text-violet-600 hover:text-violet-700 transition-colors"
                                    >
                                        <FaCog className="text-xs" />
                                        Change video
                                    </button>
                                )}
                            </div>

                            {/* ── VIDEO / AUDIO area ── */}
                            {isVideoOrAudio && (
                                <>
                                    {/* ── Case 1: Video URL configured in settings (iframe embed or direct) ── */}
                                    {hasConfiguredVideoUrl && (
                                        <div className="rounded-xl overflow-hidden border border-gray-200 bg-black relative group">
                                            {thumbnailSrc && !isPlaying ? (
                                                <div className="relative w-full aspect-video cursor-pointer" onClick={() => setIsPlaying(true)}>
                                                    <img src={thumbnailSrc} alt="Lesson thumbnail" className="w-full h-full object-cover" />
                                                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center transition-all hover:bg-black/40">
                                                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm shadow-lg hover:scale-110 transition-transform">
                                                            <FaPlay className="text-white text-2xl ml-1" />
                                                        </div>
                                                    </div>
                                                    {/* Change Thumbnail button */}
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            navigate(`/instructor/lesson-settings/${courseSlug}/${lessonSlug}`, {
                                                                state: {
                                                                    lesson: { ...lesson, ...lessonData, title: lessonTitle, description: lessonDescription },
                                                                    section,
                                                                    course,
                                                                },
                                                            });
                                                        }}
                                                        className="absolute top-4 right-4 text-white text-xs bg-black/50 hover:bg-black/70 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
                                                    >
                                                        <FaImage /> Change Thumbnail
                                                    </button>
                                                </div>
                                            ) : embedSrc ? (
                                                <iframe
                                                    src={thumbnailSrc && isPlaying ? `${embedSrc}${embedSrc.includes('?') ? '&' : '?'}autoplay=1` : embedSrc}
                                                    title="Lesson video"
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                    allowFullScreen
                                                    className="w-full aspect-video"
                                                />
                                            ) : (
                                                /* Direct URL — use <video> */
                                                <video
                                                    controls
                                                    autoPlay={isPlaying}
                                                    className="w-full aspect-video"
                                                    src={settingsVideoUrl}
                                                    poster={thumbnailSrc}
                                                >
                                                    Your browser does not support the video tag.
                                                </video>
                                            )}
                                            {/* URL badge */}
                                            <div className="bg-gray-50 border-t border-gray-200 px-4 py-2 flex items-center gap-2">
                                                <FaLink className="text-gray-400 text-xs flex-shrink-0" />
                                                <span className="text-xs text-gray-500 truncate">{settingsVideoUrl}</span>
                                                <a
                                                    href={settingsVideoUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="ml-auto flex-shrink-0 text-violet-500 hover:text-violet-700 transition-colors"
                                                >
                                                    <FaExternalLinkAlt className="text-xs" />
                                                </a>
                                            </div>
                                        </div>
                                    )}

                                    {/* ── Case 2: Video FILE configured in settings ── */}
                                    {hasConfiguredVideoFile && !hasConfiguredVideoUrl && (
                                        <div className="rounded-xl overflow-hidden border border-gray-200 relative">
                                            {thumbnailSrc && !isPlaying ? (
                                                <div className="relative w-full aspect-video cursor-pointer" onClick={() => setIsPlaying(true)}>
                                                    <img src={thumbnailSrc} alt="Lesson thumbnail" className="w-full h-full object-cover" />
                                                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center transition-all hover:bg-black/40">
                                                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm shadow-lg hover:scale-110 transition-transform">
                                                            <FaPlay className="text-white text-2xl ml-1" />
                                                        </div>
                                                    </div>
                                                    {/* Change Thumbnail button */}
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            navigate(`/instructor/lesson-settings/${courseSlug}/${lessonSlug}`, {
                                                                state: {
                                                                    lesson: { ...lesson, ...lessonData, title: lessonTitle, description: lessonDescription },
                                                                    section,
                                                                    course,
                                                                },
                                                            });
                                                        }}
                                                        className="absolute top-4 right-4 text-white text-xs bg-black/50 hover:bg-black/70 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
                                                    >
                                                        <FaImage /> Change Thumbnail
                                                    </button>
                                                </div>
                                            ) : (
                                                <video
                                                    controls
                                                    autoPlay={isPlaying}
                                                    className="w-full aspect-video bg-black"
                                                    src={URL.createObjectURL(settingsVideoFile)}
                                                    poster={thumbnailSrc}
                                                />
                                            )}
                                            <div className="bg-gray-50 border-t border-gray-200 px-4 py-2 flex items-center gap-2">
                                                <FaVideo className="text-violet-400 text-xs" />
                                                <span className="text-xs text-gray-700 font-medium truncate">
                                                    {settingsVideoFile.name}
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    {/* ── Case 3: No configured video — show the upload/embed/cloud UI ── */}
                                    {!hasConfiguredVideo && (
                                        <div
                                            className={`h-[400px] border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-all duration-200 ${isDragging
                                                ? "border-violet-500 bg-violet-50"
                                                : "border-gray-300 hover:border-violet-400 hover:bg-gray-50"
                                                }`}
                                            onDragOver={handleDragOver}
                                            onDragLeave={handleDragLeave}
                                            onDrop={handleDrop}
                                        >
                                            {/* Upload tab */}
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

                                                    <p className="text-xs text-gray-400 mt-2">or drag & drop a file here</p>

                                                    {videoFile && (
                                                        <div className="mt-4 text-center">
                                                            <p className="text-sm font-semibold text-green-600">{videoFile.name}</p>
                                                            <video
                                                                controls
                                                                className="mt-3 w-full max-w-xl rounded-lg"
                                                                src={URL.createObjectURL(videoFile)}
                                                            />
                                                        </div>
                                                    )}

                                                    {!videoFile && (
                                                        <p className="text-xs text-gray-400 mt-3">
                                                            Or set a URL via{" "}
                                                            <button
                                                                className="text-violet-500 underline"
                                                                onClick={() =>
                                                                    navigate(`/instructor/lesson-settings/${courseSlug}/${lessonSlug}`, {
                                                                        state: {
                                                                            lesson: { ...lesson, ...lessonData, title: lessonTitle, description: lessonDescription },
                                                                            section,
                                                                            course,
                                                                        },
                                                                    })
                                                                }
                                                            >
                                                                Settings
                                                            </button>
                                                        </p>
                                                    )}
                                                </>
                                            )}

                                            {/* Embed tab */}
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
                                                        Supported: YouTube, Vimeo, Loom, and more
                                                    </p>
                                                </div>
                                            )}

                                            {/* Cloud tab */}
                                            {videoSource === "cloud" && (
                                                <div className="text-center">
                                                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                                                        <FaCloudUploadAlt className="text-3xl text-blue-600" />
                                                    </div>
                                                    <p className="text-gray-600 font-medium text-sm">Connect cloud storage</p>
                                                    <div className="flex gap-3 mt-4 text-sm">
                                                        <button className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                                                            Google Drive
                                                        </button>
                                                        <button className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                                                            Dropbox
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </>
                            )}

                            {/* ── NON-VIDEO RESOURCE AREA ── */}
                            {lessonType !== "VIDEO" && (
                                <>
                                    {/* Configured Resource */}
                                    {(lessonData?.resourceUrl || lessonData?.resourceFile) ? (
                                        <div className="rounded-xl overflow-hidden border border-gray-200 bg-gray-50 p-6 flex flex-col items-center justify-center min-h-[220px]">
                                            <FaPaperclip className="text-4xl text-violet-400 mb-4" />
                                            <p className="text-gray-700 font-medium mb-1">Resource Attached</p>
                                            <p className="text-sm text-gray-500 mb-4 text-center max-w-md truncate">
                                                <a
                                                    href={attachments[0]?.url || "#"}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-violet-600 hover:underline"
                                                >
                                                    {lessonData.resourceInputType === "FILE_UPLOAD"
                                                        ? lessonData.resourceFile?.name || "Uploaded resource"
                                                        : getFilenameFromUrl(lessonData.resourceUrl)}
                                                </a>
                                            </p>
                                            <button
                                                onClick={() =>
                                                    navigate(`/instructor/lesson-settings/${courseSlug}/${lessonSlug}`, {
                                                        state: {
                                                            lesson: { ...lesson, ...lessonData, title: lessonTitle, description: lessonDescription },
                                                            section,
                                                            course,
                                                        },
                                                    })
                                                }
                                                className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
                                            >
                                                Change Resource
                                            </button>
                                        </div>
                                    ) : (
                                        /* Unconfigured Resource Placeholder */
                                        <div className="h-[220px] flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 hover:bg-gray-100 hover:border-violet-300 transition-colors">
                                            {lessonType === "PDF" ? (
                                                <FaFilePdf className="text-5xl text-red-300 mb-3" />
                                            ) : lessonType === "ARTICLE" || lessonType === "TEXT" ? (
                                                <MdArticle className="text-5xl text-blue-300 mb-3" />
                                            ) : lessonType === "QUIZ" ? (
                                                <MdQuiz className="text-5xl text-purple-300 mb-3" />
                                            ) : lessonType === "ASSIGNMENT" ? (
                                                <MdAssignment className="text-5xl text-teal-300 mb-3" />
                                            ) : (
                                                <FaPaperclip className="text-5xl text-gray-300 mb-3" />
                                            )}
                                            <p className="text-gray-600 font-medium">Resource Required</p>
                                            <p className="text-gray-400 text-sm mt-1 mb-4">Please attach a resource for this lesson type</p>
                                            <button
                                                onClick={() =>
                                                    navigate(`/instructor/lesson-settings/${courseSlug}/${lessonSlug}`, {
                                                        state: {
                                                            lesson: { ...lesson, ...lessonData, title: lessonTitle, description: lessonDescription },
                                                            section,
                                                            course,
                                                        },
                                                    })
                                                }
                                                className="px-5 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors text-sm shadow-sm"
                                            >
                                                Add Resource in Settings
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        {/* ── Description ── */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="font-semibold mb-3 text-sm flex items-center gap-2">
                                <FaInfoCircle className="text-gray-400" />
                                Description
                            </h3>
                            <textarea
                                className="w-full h-24 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none resize-none text-sm"
                                placeholder="Provide a brief description..."
                                value={lessonDescription}
                                onChange={(e) => setLessonDescription(e.target.value)}
                            />
                        </div>

                        {/* ── Long Description (from settings) ── */}
                        {lessonData?.longDescription && (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h3 className="font-semibold mb-3 text-sm">Long Description</h3>
                                <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                                    {lessonData.longDescription}
                                </p>
                            </div>
                        )}

                        {/* ── Rich-text Content (from settings editor) ── */}
                        {lessonData?.content && (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h3 className="font-semibold mb-3 text-sm">Content</h3>
                                <div
                                    className="prose max-w-none text-sm text-gray-700"
                                    dangerouslySetInnerHTML={{ __html: lessonData.content }}
                                />
                            </div>
                        )}
                    </div>

                    {/* ── Right Sidebar ── */}
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
                                        <span className="font-medium text-right max-w-[160px] truncate">
                                            {course?.title || "—"}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Section</span>
                                        <span className="font-medium text-right max-w-[160px] truncate">
                                            {section?.title || "—"}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Type</span>
                                        <span className="font-medium">{getLessonTypeLabel()}</span>
                                    </div>
                                    {sectionIndex !== undefined && lessonIndex !== undefined && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Position</span>
                                            <span className="font-medium">
                                                Section {sectionIndex + 1}, Lesson {lessonIndex + 1}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* ── Lesson Settings summary card ── */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Lesson Settings
                                    </h3>
                                    <button
                                        onClick={() =>
                                            navigate(`/instructor/lesson-settings/${courseSlug}/${lessonSlug}`, {
                                                state: {
                                                    lesson: { ...lesson, ...lessonData, title: lessonTitle, description: lessonDescription },
                                                    section,
                                                    course,
                                                },
                                            })
                                        }
                                        className="text-xs text-violet-600 hover:text-violet-700 transition-colors flex items-center gap-1"
                                    >
                                        <FaCog className="text-xs" />
                                        Edit
                                    </button>
                                </div>
                                <div className="space-y-2.5 text-sm">
                                    {/* Preview Allowed */}
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-500 flex items-center gap-1.5">
                                            <FaEye className="text-gray-400 text-xs" />
                                            Preview
                                        </span>
                                        {lessonData?.previewAllowed ?? true ? (
                                            <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
                                                <FaCheckCircle className="text-green-500" />
                                                Allowed
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                                                <FaTimesCircle className="text-gray-400" />
                                                Disabled
                                            </span>
                                        )}
                                    </div>

                                    {/* Mandatory */}
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-500 flex items-center gap-1.5">
                                            {lessonData?.mandatory ?? true
                                                ? <FaLock className="text-gray-400 text-xs" />
                                                : <FaUnlock className="text-gray-400 text-xs" />}
                                            Mandatory
                                        </span>
                                        {lessonData?.mandatory ?? true ? (
                                            <span className="inline-flex items-center gap-1 text-xs font-medium text-violet-700 bg-violet-50 px-2 py-0.5 rounded-full">
                                                <FaCheckCircle className="text-violet-500" />
                                                Yes
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                                                <FaTimesCircle className="text-gray-400" />
                                                No
                                            </span>
                                        )}
                                    </div>

                                    {/* Sort Order */}
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-500">Sort Order</span>
                                        <span className="text-xs font-semibold text-gray-700 bg-gray-100 px-2 py-0.5 rounded-full">
                                            #{lessonData?.sortOrder ?? 1}
                                        </span>
                                    </div>
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
                                                    <a
                                                        href={file.url || "#"}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="font-medium text-xs truncate text-gray-700 hover:text-violet-600 hover:underline block"
                                                    >
                                                        {file.name}
                                                    </a>
                                                    <p className="text-xs text-gray-500">{file.size}</p>
                                                </div>
                                            </div>
                                            <button className="text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                                                <FaTimes className="text-xs" />
                                            </button>
                                        </div>
                                    ))}
                                </div>



                            </div>

                            {/* ── Lesson Stats ── */}
                            <div className="bg-gradient-to-br from-violet-50 to-indigo-50 rounded-xl p-4 border border-violet-100">
                                <h4 className="font-semibold text-gray-700 mb-2 text-sm flex items-center gap-2">
                                    <FaClock className="text-violet-600" />
                                    Lesson Stats
                                </h4>

                                <div className="space-y-2 text-xs">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Duration</span>
                                        <span className="font-medium">{durationMinutes} min</span>
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