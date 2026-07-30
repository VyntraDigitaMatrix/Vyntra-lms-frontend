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

import AddSectionPanel from "../components/CourseBuilder/AddSectionPanel";
import AddLessonPanel from "../components/CourseBuilder/AddLessonPanel";
import SectionRow from "../components/CourseBuilder/SectionRow";
import { LESSON_TYPES } from "../components/CourseBuilder/utils";

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
        const currentLessonSlug = lesson?.slug || lesson?.lessonSlug || "new";

        navigate(`/instructor/lesson-builder/${courseSlug}/${currentLessonSlug}`, {
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
                                {course?.shortDescription && (
                                    <p className="text-sm text-gray-500 mt-1">{course.shortDescription}</p>
                                )}
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
                                <button
                                    onClick={() => navigate(`/instructor/section-settings/${courseSlug}`)}
                                    className="flex items-center gap-1.5 h-9 px-4 rounded-lg border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition">
                                    <MdSettings className="text-base" /> SETTINGS
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