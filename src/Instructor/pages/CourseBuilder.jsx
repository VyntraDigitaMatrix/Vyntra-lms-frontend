import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FaChevronLeft } from "react-icons/fa";
import {
    MdSettings, MdSwapVert, MdVisibilityOff, MdMenuBook,
    MdQuiz, MdAdd, MdClose, MdExpandMore, MdExpandLess,
    MdDeleteOutline, MdDragIndicator, MdOpenInFull,
    MdVideoLibrary, MdAudiotrack, MdPictureAsPdf,
    MdArticle, MdAssignment, MdSearch,
} from 'react-icons/md';

// API imports
import { instructorCourseApi, instructorModuleApi, instructorLessonApi } from "../auth/api";

const LESSON_TYPES = [
    { id: "VIDEO", label: "Video", Icon: MdVideoLibrary, color: "#22c55e", bg: "#f0fdf4" },
    { id: "AUDIO", label: "Audio", Icon: MdAudiotrack, color: "#f97316", bg: "#fff7ed" },
    { id: "PDF", label: "PDF", Icon: MdPictureAsPdf, color: "#ef4444", bg: "#fef2f2" },
    { id: "ARTICLE", label: "Article", Icon: MdArticle, color: "#3b82f6", bg: "#eff6ff" },
    { id: "QUIZ", label: "Section Quiz", Icon: MdQuiz, color: "#8b5cf6", bg: "#f5f3ff" },
    { id: "ASSIGNMENT", label: "Assignment", Icon: MdAssignment, color: "#14b8a6", bg: "#f0fdfa" },
];

/* ── Reusable Right Panel ──────────────────────────── */
function RightPanel({ title, subtitle, onClose, children, onSave, saveLabel = "SAVE", saveDisabled }) {
    return (
        <div className="w-[420px] flex-shrink-0 border-l border-gray-200 bg-white flex flex-col h-full overflow-hidden">
            <div className="px-6 pt-6 pb-4 border-b border-gray-100">
                <div className="flex items-start justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">{title}</h2>
                        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-500 transition flex-shrink-0"
                    >
                        <MdClose className="text-lg" />
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6">
                {children}
            </div>

            <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
                <button
                    onClick={onSave}
                    disabled={saveDisabled}
                    className="flex-1 py-2.5 bg-green-600 hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-bold rounded-lg transition"
                >
                    {saveLabel}
                </button>
                <button
                    onClick={onClose}
                    className="flex-1 py-2.5 border border-gray-200 bg-white text-gray-600 text-sm font-semibold rounded-lg hover:bg-gray-50 transition"
                >
                    CANCEL
                </button>
            </div>
        </div>
    );
}

/* ── Add Lesson Panel ────────────────────────────────── */
function AddLessonPanel({ onClose, onSave }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [lessonType, setLessonType] = useState("VIDEO");
    const [sortOrder, setSortOrder] = useState(1);
    const [previewAllowed, setPreviewAllowed] = useState(true);
    const [mandatory, setMandatory] = useState(true);

    // Thumbnail - File and URL
    const [thumbnailFile, setThumbnailFile] = useState(null);
    const [thumbnailUrl, setThumbnailUrl] = useState("");
    const [thumbnailInputType, setThumbnailInputType] = useState("FILE_UPLOAD");
    const [thumbnailPreview, setThumbnailPreview] = useState(null);

    // Video - File and URL
    const [videoFile, setVideoFile] = useState(null);
    const [videoUrl, setVideoUrl] = useState("");
    const [videoInputType, setVideoInputType] = useState("FILE_UPLOAD");
    const [videoPreview, setVideoPreview] = useState(null);

    const canSave = title.trim() && description.trim() && lessonType &&
        ((thumbnailInputType === "FILE_UPLOAD" && thumbnailFile) ||
            (thumbnailInputType === "URL" && thumbnailUrl.trim())) &&
        ((videoInputType === "FILE_UPLOAD" && videoFile) ||
            (videoInputType === "URL" && videoUrl.trim()));

    // Handle thumbnail file selection
    const handleThumbnailFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setThumbnailFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setThumbnailPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Handle video file selection
    const handleVideoFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setVideoFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setVideoPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        if (!canSave) return;

        const formData = new FormData();

        // Required fields (marked with * in Swagger)
        formData.append("title", title.trim());
        formData.append("description", description.trim());
        formData.append("lessonType", lessonType);
        formData.append("sortOrder", sortOrder.toString());
        formData.append("previewAllowed", previewAllowed.toString());
        formData.append("mandatory", mandatory.toString());

        // Optional fields
        formData.append("durationInMinutes", "1");

        // Thumbnail - only one should be sent
        if (thumbnailInputType === "URL" && thumbnailUrl.trim()) {
            formData.append("thumbnailInputType", "URL");
            formData.append("thumbnailUrl", thumbnailUrl.trim());
            // Send empty value for thumbnailFile when using URL
            formData.append("thumbnailFile", "");
        } else if (thumbnailInputType === "FILE_UPLOAD" && thumbnailFile) {
            formData.append("thumbnailInputType", "FILE_UPLOAD");
            formData.append("thumbnailFile", thumbnailFile);
            formData.append("thumbnailUrl", "");
        }

        if (videoInputType === "URL") {
            formData.append("videoInputType", "URL");
            formData.append("videoUrl", videoUrl);
        } else if (videoInputType === "FILE_UPLOAD" && videoFile) {
            formData.append("videoInputType", "FILE_UPLOAD");
            formData.append("videoFile", videoFile);
            formData.append("videoUrl", "");
        }

        // Log FormData entries for debugging
        console.log("FormData entries:");
        for (let [key, value] of formData.entries()) {
            console.log(key, value instanceof File ? `File: ${value.name}` : value);
        }

        onSave(formData);
    };

    return (
        <RightPanel
            title="Add Lesson"
            subtitle="Create a new lesson with content"
            onClose={onClose}
            onSave={handleSave}
            saveLabel="CREATE LESSON"
            saveDisabled={!canSave}
        >
            <div className="space-y-5">
                {/* Title */}
                <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-1.5">
                        Lesson Title <span className="text-red-500">*</span>
                    </label>
                    <input
                        value={title}
                        maxLength={100}
                        autoFocus
                        onChange={e => setTitle(e.target.value)}
                        placeholder="e.g. Introduction to Variables"
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-800 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition"
                    />
                    <p className="text-xs text-gray-400 mt-1">{title.length}/100 characters</p>
                </div>

                {/* Description */}
                <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-1.5">
                        Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                        placeholder="Enter lesson description"
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-800 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition resize-none"
                    />
                    <p className="text-xs text-gray-400 mt-1">{description.length} characters</p>
                </div>

                {/* Lesson Type */}
                <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-2">
                        Lesson Type <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                        {LESSON_TYPES.map(t => {
                            const selected = lessonType === t.id;
                            return (
                                <button
                                    key={t.id}
                                    type="button"
                                    onClick={() => setLessonType(t.id)}
                                    className="flex flex-col items-center py-3 px-2 rounded-xl border-2 transition cursor-pointer"
                                    style={{
                                        borderColor: selected ? t.color : "#e5e7eb",
                                        background: selected ? t.bg : "#fff",
                                    }}
                                >
                                    <t.Icon className="text-2xl mb-1.5" style={{ color: selected ? t.color : "#9ca3af" }} />
                                    <span className="text-[10px] font-semibold leading-tight text-center" style={{ color: selected ? t.color : "#6b7280" }}>
                                        {t.label}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Sort Order */}
                <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-1.5">
                        Sort Order <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="number"
                        min={0}
                        value={sortOrder}
                        onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-800 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition"
                    />
                </div>

                {/* Settings - Preview Allowed & Mandatory */}
                <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-2">Settings</label>
                    <div className="flex items-center gap-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={previewAllowed}
                                onChange={(e) => setPreviewAllowed(e.target.checked)}
                                className="w-4 h-4 rounded border-gray-300 accent-violet-600"
                            />
                            <span className="text-sm text-gray-600">Preview Allowed</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={mandatory}
                                onChange={(e) => setMandatory(e.target.checked)}
                                className="w-4 h-4 rounded border-gray-300 accent-violet-600"
                            />
                            <span className="text-sm text-gray-600">Mandatory</span>
                        </label>
                    </div>
                </div>

                {/* Thumbnail */}
                <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-1.5">
                        Thumbnail <span className="text-red-500">*</span>
                    </label>
                    <div className="space-y-3">
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => {
                                    setThumbnailInputType("FILE_UPLOAD");
                                    setThumbnailUrl("");
                                }}
                                className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${thumbnailInputType === "FILE_UPLOAD"
                                        ? "bg-violet-600 text-white"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    }`}
                            >
                                File Upload
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setThumbnailInputType("URL");
                                    setThumbnailFile(null);
                                    setThumbnailPreview(null);
                                }}
                                className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${thumbnailInputType === "URL"
                                        ? "bg-violet-600 text-white"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    }`}
                            >
                                URL
                            </button>
                        </div>

                        {thumbnailInputType === "FILE_UPLOAD" ? (
                            <div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleThumbnailFileChange}
                                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100 transition"
                                />
                                {thumbnailPreview && (
                                    <div className="mt-2">
                                        <img
                                            src={thumbnailPreview}
                                            alt="Thumbnail preview"
                                            className="w-32 h-20 object-cover rounded-lg border border-gray-200"
                                        />
                                        <p className="text-xs text-gray-400 mt-1">{thumbnailFile?.name}</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div>
                                <input
                                    type="url"
                                    value={thumbnailUrl}
                                    onChange={(e) => setThumbnailUrl(e.target.value)}
                                    placeholder="Enter thumbnail URL (e.g. https://example.com/image.jpg)"
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-800 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition"
                                />
                                {thumbnailUrl && (
                                    <div className="mt-2">
                                        <img
                                            src={thumbnailUrl}
                                            alt="Thumbnail preview"
                                            className="w-32 h-20 object-cover rounded-lg border border-gray-200"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Video */}
                <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-1.5">
                        Video <span className="text-red-500">*</span>
                    </label>
                    <div className="space-y-3">
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => {
                                    setVideoInputType("FILE_UPLOAD");
                                    setVideoUrl("");
                                }}
                                className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${videoInputType === "FILE_UPLOAD"
                                        ? "bg-violet-600 text-white"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    }`}
                            >
                                File Upload
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setVideoInputType("URL");
                                    setVideoFile(null);
                                    setVideoPreview(null);
                                }}
                                className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${videoInputType === "URL"
                                        ? "bg-violet-600 text-white"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    }`}
                            >
                                URL
                            </button>
                        </div>

                        {videoInputType === "FILE_UPLOAD" ? (
                            <div>
                                <input
                                    type="file"
                                    accept="video/*"
                                    onChange={handleVideoFileChange}
                                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100 transition"
                                />
                                {videoFile && (
                                    <div className="mt-2">
                                        <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg border border-gray-200">
                                            <MdVideoLibrary className="text-violet-500 text-xl" />
                                            <span className="text-sm text-gray-700">{videoFile.name}</span>
                                            <span className="text-xs text-gray-400 ml-auto">
                                                {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div>
                                <input
                                    type="url"
                                    value={videoUrl}
                                    onChange={(e) => setVideoUrl(e.target.value)}
                                    placeholder="Enter video URL (e.g. https://example.com/video.mp4)"
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-800 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition"
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </RightPanel>
    );
}

/* ── Section Row ────────────────────────────────────── */
function SectionRow({ section, sectionIdx, onDelete, onAddLesson, onDeleteLesson, onOpenLesson, onEditSection }) {
    const [expanded, setExpanded] = useState(true);
    const quizCount = section.lessons?.filter(l => l.lessonType === "QUIZ").length || 0;

    return (
        <div className="border border-gray-200 rounded-xl overflow-hidden">
            <div
                className="flex items-center gap-3 px-4 py-3.5 bg-gray-50 cursor-pointer hover:bg-gray-100/70 transition select-none"
                onClick={() => setExpanded(e => !e)}
            >
                <MdDragIndicator className="text-gray-300 text-lg flex-shrink-0" />
                {expanded
                    ? <MdExpandLess className="text-gray-400 text-xl flex-shrink-0" />
                    : <MdExpandMore className="text-gray-400 text-xl flex-shrink-0" />
                }
                <span className="w-7 h-7 rounded-md bg-violet-100 text-violet-700 text-xs font-black flex items-center justify-center flex-shrink-0">
                    {sectionIdx + 1}
                </span>
                <span className="flex-1 text-sm font-bold text-gray-800 truncate">{section.title}</span>
                <span className="text-xs text-gray-400 mr-1 hidden sm:inline">
                    {section.lessons?.length || 0} Lessons • {quizCount} Quizzes
                </span>
                <div className="flex gap-1" onClick={e => e.stopPropagation()}>
                    <button
                        onClick={() => onEditSection(sectionIdx)}
                        className="w-7 h-7 rounded-md hover:bg-gray-200 flex items-center justify-center text-gray-400 hover:text-violet-600 transition"
                    >
                        <MdSettings className="text-sm" />
                    </button>
                    <button
                        onClick={() => onDelete(sectionIdx)}
                        className="w-7 h-7 rounded-md hover:bg-red-50 flex items-center justify-center text-gray-400 hover:text-red-500 transition"
                    >
                        <MdDeleteOutline className="text-sm" />
                    </button>
                </div>
            </div>

            {expanded && (
                <div>
                    {(!section.lessons || section.lessons.length === 0) && (
                        <div className="px-5 py-7 text-center text-sm text-gray-400">
                            No lessons yet — add your first one below.
                        </div>
                    )}
                    {section.lessons?.map((lesson, li) => {
                        const typeInfo = LESSON_TYPES.find(t => t.id === lesson.lessonType) || LESSON_TYPES[0];
                        return (
                            <div
                                key={li}
                                className="flex items-center gap-3 px-4 py-3 border-t border-gray-100 hover:bg-gray-50/60 cursor-pointer group transition"
                                onClick={() => onOpenLesson(sectionIdx, li)}
                            >
                                <MdDragIndicator className="text-gray-200 group-hover:text-gray-300 text-lg flex-shrink-0" />
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: typeInfo.bg }}>
                                    <typeInfo.Icon className="text-sm" style={{ color: typeInfo.color }} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-gray-800 truncate">{lesson.title}</p>
                                    <p className="text-xs text-gray-400">{typeInfo.label}</p>
                                </div>
                                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full hidden sm:inline" style={{ background: typeInfo.bg, color: typeInfo.color }}>
                                    {typeInfo.label}
                                </span>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDeleteLesson(sectionIdx, li);
                                    }}
                                    className="w-7 h-7 rounded-md opacity-0 group-hover:opacity-100 hover:bg-red-50 flex items-center justify-center text-gray-300 hover:text-red-500 transition"
                                >
                                    <MdDeleteOutline className="text-sm" />
                                </button>
                                <MdOpenInFull className="text-gray-300 group-hover:text-gray-400 text-sm transition" />
                            </div>
                        );
                    })}

                    <div className="px-4 py-3 border-t border-gray-100">
                        <button
                            onClick={() => onAddLesson(sectionIdx)}
                            className="w-full py-2.5 border-2 border-dashed border-gray-200 hover:border-violet-300 rounded-xl text-sm font-semibold text-gray-400 hover:text-violet-600 hover:bg-violet-50/30 transition flex items-center justify-center gap-2"
                        >
                            <MdAdd className="text-base" /> Add Lesson
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

/* ── Main Component ────────────────────────────────── */
const CourseBuilderView = ({ onBack }) => {
    const { courseSlug } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [error, setError] = useState("");

    const [panel, setPanel] = useState(null);
    const [targetSectionIdx, setTargetSectionIdx] = useState(null);

    const [deleteModal, setDeleteModal] = useState({
        open: false,
        type: "",
        sectionIdx: null,
        lessonIdx: null,
        title: "",
    });

    useEffect(() => {
        loadCourse();
    }, [courseSlug]);

    const loadCourse = async () => {
        try {
            setLoading(true);
            const courseRes = await instructorCourseApi.getInstructorCourseBySlug(courseSlug);
            setCourse(courseRes.data.data);
            const moduleRes = await instructorModuleApi.getCourseModules(courseSlug);
            const modules = moduleRes.data.data.content || [];
            const modulesWithLessons = await Promise.all(
                modules.map(async (module) => {
                    const lessonRes = await instructorLessonApi.getModuleLessons(module.slug);
                    return {
                        ...module,
                        lessons: lessonRes.data.data.content || []
                    };
                })
            );
            setSections(modulesWithLessons);
        } catch (err) {
            console.log(err);
            setError(err.response?.data?.message || "Failed to load course");
        } finally {
            setLoading(false);
        }
    };

    const isPublished = course?.status === "PUBLISHED";
    const isEncrypted = course?.contentSecurity === "ENCRYPTION" || course?.encrypted === true;

    const totalLessons = sections.reduce((s, sec) => s + (sec.lessons?.length || 0), 0);
    const totalQuizzes = sections.reduce((s, sec) => s + (sec.lessons?.filter(l => l.lessonType === "QUIZ").length || 0), 0);
    const hiddenLessons = 0;

    const addSection = async (title) => {
        try {
            const payload = {
                title,
                description: "",
                sortOrder: sections.length + 1,
                previewAllowed: true,
            };
            await instructorModuleApi.createModule(course.slug, payload);
            await loadCourse();
            setPanel(null);
        } catch (err) {
            console.log(err);
            alert(err.response?.data?.message || "Failed to create section");
        }
    };

    const editSection = async (idx, title) => {
        try {
            const module = sections[idx];
            await instructorModuleApi.updateModule(module.slug, { title });
            await loadCourse();
            setPanel(null);
        } catch (err) {
            console.log(err);
            alert(err.response?.data?.message || "Failed to update section");
        }
    };

    const deleteSection = (idx) => {
        setDeleteModal({
            open: true,
            type: "section",
            sectionIdx: idx,
            lessonIdx: null,
            title: sections[idx].title,
        });
    };

    const addLesson = async (formData) => {
        try {
            const module = sections[targetSectionIdx];
            await instructorLessonApi.createLesson(module.slug, formData);
            await loadCourse();
            setPanel(null);
        } catch (err) {
            console.log(err);
            alert(err.response?.data?.message || "Failed to create lesson");
        }
    };

    const deleteLesson = (secIdx, lessonIdx) => {
        const lesson = sections[secIdx].lessons[lessonIdx];
        setDeleteModal({
            open: true,
            type: "lesson",
            sectionIdx: secIdx,
            lessonIdx: lessonIdx,
            title: lesson.title,
        });
    };

    const confirmDelete = async () => {
        try {
            if (deleteModal.type === "section") {
                await instructorModuleApi.deleteModule(
                    sections[deleteModal.sectionIdx].slug
                );
            } else {
                const lesson = sections[deleteModal.sectionIdx].lessons[deleteModal.lessonIdx];
                await instructorLessonApi.deleteLesson(lesson.lessonSlug);
            }

            setDeleteModal({
                open: false,
                type: "",
                sectionIdx: null,
                lessonIdx: null,
                title: "",
            });

            await loadCourse();
        } catch (err) {
            console.log(err);
            alert(err.response?.data?.message || "Failed to delete");
        }
    };

    const openLesson = (secIdx, lessonIdx) => {
        const lesson = sections[secIdx].lessons[lessonIdx];
        const section = sections[secIdx];

        navigate("/instructor/lesson-builder", {
            state: {
                lesson,
                section,
                course,
                sectionIndex: secIdx,
                lessonIndex: lessonIdx
            }
        });
    };

    const filteredSections = search.trim()
        ? sections.filter(s => s.title?.toLowerCase().includes(search.toLowerCase()) ||
            s.lessons?.some(l => l.title?.toLowerCase().includes(search.toLowerCase())))
        : sections;

    const showingAddSection = panel === "section";
    const showingEditSection = panel?.type === "editSection";
    const showingAddLesson = panel === "lesson";

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <AiOutlineLoading3Quarters className="animate-spin text-violet-500 text-3xl" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
                <p className="text-red-600 font-semibold">{error}</p>
                <button onClick={onBack || (() => navigate(-1))}
                    className="px-5 py-2 bg-violet-600 text-white rounded-xl text-sm font-semibold hover:bg-violet-700 transition">
                    Back to Courses
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white flex flex-col">
            {/* Top bar */}
            <div className="border-b border-gray-100 px-4 sm:px-6 py-3 bg-white z-10 flex-shrink-0">
                <button
                    onClick={onBack || (() => navigate(-1))}
                    className="flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-violet-600 transition"
                >
                    <FaChevronLeft className="text-xs" />
                    Back to Dashboard
                </button>
            </div>

            {/* Body */}
            <div className="flex flex-1 overflow-hidden h-[calc(100vh-49px)]">

                {/* LEFT: Course builder */}
                <div className="flex-1 overflow-y-auto">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">

                        {/* Status badges */}
                        <div className="flex items-center gap-2 mb-3 flex-wrap">
                            <span className={`text-xs font-bold px-3 py-1 rounded-md ${isPublished ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                                {isPublished ? "Published" : "Unpublished"}
                            </span>
                            {isEncrypted && (
                                <span className="text-xs font-bold px-3 py-1 rounded-md bg-teal-100 text-teal-700">
                                    Encrypted
                                </span>
                            )}
                            <span className="text-xs font-bold px-3 py-1 rounded-md bg-blue-100 text-blue-700">
                                {totalLessons} Lessons
                            </span>
                            <span className="text-xs font-bold px-3 py-1 rounded-md bg-purple-100 text-purple-700">
                                {totalQuizzes} Quizzes
                            </span>
                        </div>

                        {/* Title + action buttons */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                            <div>
                                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
                                    {course?.title ?? "Untitled Course"}
                                </h1>
                                {course?.description && (
                                    <p className="text-sm text-gray-500 mt-1">{course.description}</p>
                                )}
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
                                <button
                                    onClick={() => navigate(`/instructor/section-settings/${courseSlug}`)}
                                    className="flex items-center gap-1.5 h-9 px-4 rounded-lg border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition">
                                    <MdSettings className="text-base" /> SETTINGS
                                </button>
                                <button className="flex items-center gap-1.5 h-9 px-4 rounded-lg border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition">
                                    <MdSwapVert className="text-base" /> REORDER
                                </button>
                            </div>
                        </div>

                        {/* Search + stats */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
                            <div className="flex items-center rounded-lg border border-gray-200 overflow-hidden w-full sm:w-auto">
                                <input
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    placeholder="Search lessons..."
                                    className="h-9 px-3 bg-white text-sm text-gray-700 outline-none placeholder:text-gray-400 w-full sm:w-48"
                                />
                                <button className="h-9 px-4 bg-gray-800 hover:bg-gray-900 text-white text-xs font-bold transition">
                                    SEARCH
                                </button>
                            </div>
                            <div className="flex items-center gap-5 text-xs font-medium text-gray-500 ml-auto">
                                <span className="flex items-center gap-1.5">
                                    <MdVisibilityOff className="text-base text-gray-400" /> {hiddenLessons}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <MdMenuBook className="text-base text-gray-400" /> {totalLessons}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <MdQuiz className="text-base text-gray-400" /> {totalQuizzes}
                                </span>
                            </div>
                        </div>

                        {/* Sections */}
                        {filteredSections.length === 0 && !search ? (
                            <div className="border border-gray-200 rounded-xl py-16 flex flex-col items-center justify-center text-center px-4">
                                <svg width="120" height="110" viewBox="0 0 120 110" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-6 opacity-80">
                                    <circle cx="42" cy="22" r="10" fill="#CBD5E1" />
                                    <rect x="30" y="34" width="24" height="30" rx="6" fill="#94A3B8" />
                                    <rect x="18" y="36" width="12" height="8" rx="4" fill="#94A3B8" />
                                    <rect x="54" y="36" width="12" height="8" rx="4" fill="#94A3B8" />
                                    <rect x="34" y="64" width="8" height="20" rx="4" fill="#94A3B8" />
                                    <rect x="46" y="64" width="8" height="20" rx="4" fill="#94A3B8" />
                                    <rect x="60" y="14" width="52" height="66" rx="6" fill="#E2E8F0" />
                                    <rect x="68" y="26" width="36" height="4" rx="2" fill="#CBD5E1" />
                                    <rect x="68" y="36" width="28" height="4" rx="2" fill="#CBD5E1" />
                                    <rect x="68" y="46" width="32" height="4" rx="2" fill="#CBD5E1" />
                                    <rect x="68" y="56" width="24" height="4" rx="2" fill="#CBD5E1" />
                                    <rect x="68" y="66" width="30" height="4" rx="2" fill="#CBD5E1" />
                                </svg>
                                <h3 className="text-base font-bold text-gray-700 mb-1.5">Add Section</h3>
                                <p className="text-sm text-gray-400 mb-6">Start adding sections to build your course</p>
                                <button
                                    onClick={() => setPanel("section")}
                                    className="flex items-center gap-2 h-10 px-6 rounded-xl bg-green-600 hover:bg-green-700 text-white text-sm font-bold transition shadow-sm"
                                >
                                    <MdAdd className="text-lg" /> ADD SECTION
                                </button>
                            </div>
                        ) : filteredSections.length === 0 ? (
                            <div className="border border-gray-200 rounded-xl py-12 text-center">
                                <p className="text-sm text-gray-400">No sections match "{search}"</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {filteredSections.map((sec, si) => (
                                    <SectionRow
                                        key={sec.slug || si}
                                        section={sec}
                                        sectionIdx={si}
                                        onDelete={deleteSection}
                                        onEditSection={(idx) => setPanel({ type: "editSection", idx })}
                                        onAddLesson={(idx) => { setTargetSectionIdx(idx); setPanel("lesson"); }}
                                        onDeleteLesson={deleteLesson}
                                        onOpenLesson={openLesson}
                                    />
                                ))}

                                <button
                                    onClick={() => setPanel("section")}
                                    className="w-full flex items-center justify-center gap-2 h-11 rounded-xl border-2 border-dashed border-gray-200 text-sm font-semibold text-gray-400 hover:border-green-400 hover:text-green-600 hover:bg-green-50/40 transition"
                                >
                                    <MdAdd className="text-lg" /> ADD SECTION
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT: Inline panel */}
                {(showingAddSection || showingEditSection || showingAddLesson) && (
                    <>
                        {showingAddSection && (
                            <AddSectionPanel
                                onClose={() => setPanel(null)}
                                onSave={addSection}
                            />
                        )}
                        {showingEditSection && (
                            <AddSectionPanel
                                onClose={() => setPanel(null)}
                                onSave={(title) => editSection(panel.idx, title)}
                                editData={sections[panel.idx]}
                            />
                        )}
                        {showingAddLesson && (
                            <AddLessonPanel
                                onClose={() => setPanel(null)}
                                onSave={addLesson}
                            />
                        )}
                    </>
                )}
            </div>

            {/* Delete Modal */}
            {deleteModal.open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
                        <div className="flex justify-center mb-5">
                            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                                <MdDeleteOutline className="text-red-600 text-3xl" />
                            </div>
                        </div>

                        <h2 className="text-xl font-bold text-center">
                            Delete {deleteModal.type === "section" ? "Section" : "Lesson"}
                        </h2>

                        <p className="text-gray-500 text-center mt-3">
                            Are you sure you want to delete
                        </p>

                        <p className="font-semibold text-center mt-2">
                            "{deleteModal.title}"
                        </p>

                        <p className="text-gray-400 text-center text-sm mt-1">
                            This action cannot be undone.
                        </p>

                        <div className="flex gap-3 mt-8">
                            <button
                                onClick={() =>
                                    setDeleteModal({
                                        open: false,
                                        type: "",
                                        sectionIdx: null,
                                        lessonIdx: null,
                                        title: "",
                                    })
                                }
                                className="flex-1 h-11 border border-gray-200 rounded-xl font-semibold text-gray-600 hover:bg-gray-50 transition"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={confirmDelete}
                                className="flex-1 h-11 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold transition"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CourseBuilderView;