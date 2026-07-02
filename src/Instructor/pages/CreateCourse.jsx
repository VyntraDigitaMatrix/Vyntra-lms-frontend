import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import CourseBuilderView from "./CourseBuilder";
import {
    instructorCourseApi,
    instructorModuleApi,
    instructorLessonApi,
    instructorPricingApi,
} from "../auth/api";
import {
    MdSettings, MdSwapVert, MdVisibilityOff, MdMenuBook,
    MdQuiz, MdAdd, MdExpandMore, MdExpandLess, MdEdit,
    MdDelete, MdVideoLibrary, MdClose, MdCheck,
} from "react-icons/md";
import { FaChevronLeft, FaPlus } from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const MAX_TITLE = 60;

/* ─── helpers ─── */
const extractObj = (res) => res?.data?.data ?? res?.data ?? {};
const extractList = (res) => {
    const b = res?.data?.data ?? res?.data;
    if (Array.isArray(b)) return b;
    if (Array.isArray(b?.content)) return b.content;
    return [];
};

/* ══════════════════════════════════════════
   ADD SECTION MODAL
══════════════════════════════════════════ */
const AddSectionModal = ({ courseId, onClose, onCreated }) => {
    const [title, setTitle] = useState("");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const handleSave = async () => {
        if (!title.trim()) { setError("Section title is required."); return; }
        setSaving(true);
        setError("");
        try {
            await instructorModuleApi.createModule(courseId, { title: title.trim() });
            onCreated();
            onClose();
        } catch (err) {
            setError(err?.response?.data?.message || "Failed to create section.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
                <div className="flex items-center justify-between mb-5">
                    <h3 className="text-base font-bold text-gray-900">Add New Section</h3>
                    <button onClick={onClose} className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-red-50 hover:text-red-500 flex items-center justify-center text-gray-500 transition">
                        <MdClose />
                    </button>
                </div>
                {error && <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2 mb-4">{error}</p>}
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Section Title *</label>
                <input
                    autoFocus
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleSave()}
                    placeholder="e.g. Introduction to the Course"
                    className="w-full h-10 px-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 outline-none focus:border-violet-400 focus:bg-white transition placeholder:text-gray-400 mb-5"
                />
                <div className="flex gap-2">
                    <button onClick={onClose} className="flex-1 h-10 rounded-xl border border-gray-200 text-sm text-gray-600 font-semibold hover:bg-gray-50 transition">
                        Cancel
                    </button>
                    <button onClick={handleSave} disabled={saving || !title.trim()}
                        className="flex-1 h-10 rounded-xl bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white text-sm font-bold transition flex items-center justify-center gap-2">
                        {saving ? <AiOutlineLoading3Quarters className="animate-spin text-sm" /> : <MdCheck />}
                        {saving ? "Creating..." : "Create Section"}
                    </button>
                </div>
            </div>
        </div>
    );
};

/* ══════════════════════════════════════════
   ADD LESSON MODAL
══════════════════════════════════════════ */
const AddLessonModal = ({ moduleId, onClose, onCreated }) => {
    const [title, setTitle] = useState("");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const handleSave = async () => {
        if (!title.trim()) { setError("Lesson title is required."); return; }
        setSaving(true);
        setError("");
        try {
            const fd = new FormData();
            fd.append("title", title.trim());
            await instructorLessonApi.createLesson(moduleId, fd);
            onCreated();
            onClose();
        } catch (err) {
            setError(err?.response?.data?.message || "Failed to create lesson.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
                <div className="flex items-center justify-between mb-5">
                    <h3 className="text-base font-bold text-gray-900">Add New Lesson</h3>
                    <button onClick={onClose} className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-red-50 hover:text-red-500 flex items-center justify-center text-gray-500 transition">
                        <MdClose />
                    </button>
                </div>
                {error && <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2 mb-4">{error}</p>}
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Lesson Title *</label>
                <input
                    autoFocus
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleSave()}
                    placeholder="e.g. What is React?"
                    className="w-full h-10 px-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 outline-none focus:border-violet-400 focus:bg-white transition placeholder:text-gray-400 mb-5"
                />
                <div className="flex gap-2">
                    <button onClick={onClose} className="flex-1 h-10 rounded-xl border border-gray-200 text-sm text-gray-600 font-semibold hover:bg-gray-50 transition">
                        Cancel
                    </button>
                    <button onClick={handleSave} disabled={saving || !title.trim()}
                        className="flex-1 h-10 rounded-xl bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white text-sm font-bold transition flex items-center justify-center gap-2">
                        {saving ? <AiOutlineLoading3Quarters className="animate-spin text-sm" /> : <MdAdd />}
                        {saving ? "Adding..." : "Add Lesson"}
                    </button>
                </div>
            </div>
        </div>
    );
};

/* ══════════════════════════════════════════
   SECTION ROW
══════════════════════════════════════════ */
const SectionRow = ({ module, onRefresh }) => {
    const [expanded, setExpanded] = useState(true);
    const [lessons, setLessons] = useState([]);
    const [loadingLessons, setLoadingLessons] = useState(false);
    const [showAddLesson, setShowAddLesson] = useState(false);
    const [editingTitle, setEditingTitle] = useState(false);
    const [sectionTitle, setSectionTitle] = useState(module.title);
    const [savingTitle, setSavingTitle] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const fetchLessons = async () => {
        setLoadingLessons(true);
        try {
            const res = await instructorLessonApi.getModuleLessons(module.id);
            setLessons(extractList(res));
        } catch { setLessons([]); }
        finally { setLoadingLessons(false); }
    };

    useEffect(() => { fetchLessons(); }, [module.id]);

    const handleSaveTitle = async () => {
        if (!sectionTitle.trim() || sectionTitle === module.title) { setEditingTitle(false); return; }
        setSavingTitle(true);
        try {
            await instructorModuleApi.updateModule(module.id, { title: sectionTitle.trim() });
            onRefresh();
        } catch { setSectionTitle(module.title); }
        finally { setSavingTitle(false); setEditingTitle(false); }
    };

    const handleDeleteSection = async () => {
        if (!window.confirm(`Delete section "${module.title}" and all its lessons?`)) return;
        setDeleting(true);
        try {
            await instructorModuleApi.deleteModule(module.id);
            onRefresh();
        } catch { setDeleting(false); }
    };

    const handleDeleteLesson = async (lessonId, lessonTitle) => {
        if (!window.confirm(`Delete lesson "${lessonTitle}"?`)) return;
        try {
            await instructorLessonApi.deleteLesson(lessonId);
            fetchLessons();
        } catch { }
    };

    return (
        <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
            {/* Section header */}
            <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 border-b border-gray-100">
                <button onClick={() => setExpanded(v => !v)} className="text-gray-400 hover:text-gray-600 transition flex-shrink-0">
                    {expanded ? <MdExpandLess className="text-lg" /> : <MdExpandMore className="text-lg" />}
                </button>

                {editingTitle ? (
                    <input
                        autoFocus
                        value={sectionTitle}
                        onChange={e => setSectionTitle(e.target.value)}
                        onBlur={handleSaveTitle}
                        onKeyDown={e => {
                            if (e.key === "Enter") handleSaveTitle();
                            if (e.key === "Escape") { setSectionTitle(module.title); setEditingTitle(false); }
                        }}
                        className="flex-1 h-8 px-2 rounded-lg border border-violet-400 bg-white text-sm font-semibold text-gray-800 outline-none"
                        disabled={savingTitle}
                    />
                ) : (
                    <span className="flex-1 text-sm font-bold text-gray-800 truncate">{module.title}</span>
                )}

                <div className="flex items-center gap-1 flex-shrink-0">
                    <span className="text-[11px] text-gray-400 font-medium mr-2">
                        {lessons.length} lesson{lessons.length !== 1 ? "s" : ""}
                    </span>
                    <button onClick={() => setEditingTitle(true)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-violet-50 hover:text-violet-600 transition">
                        <MdEdit className="text-sm" />
                    </button>
                    <button onClick={handleDeleteSection} disabled={deleting}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 transition disabled:opacity-40">
                        {deleting ? <AiOutlineLoading3Quarters className="animate-spin text-xs" /> : <MdDelete className="text-sm" />}
                    </button>
                </div>
            </div>

            {/* Lessons */}
            {expanded && (
                <div>
                    {loadingLessons ? (
                        <div className="flex items-center justify-center py-6">
                            <AiOutlineLoading3Quarters className="animate-spin text-violet-400 text-lg" />
                        </div>
                    ) : lessons.length === 0 ? (
                        <div className="py-6 text-center">
                            <MdVideoLibrary className="text-3xl text-gray-200 mx-auto mb-2" />
                            <p className="text-xs text-gray-400">No lessons yet</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-50">
                            {lessons.map((lesson, i) => (
                                <div key={lesson.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50/60 transition group">
                                    <span className="w-5 h-5 rounded-md bg-violet-100 text-violet-600 text-[10px] font-black flex items-center justify-center flex-shrink-0">
                                        {i + 1}
                                    </span>
                                    <MdVideoLibrary className="text-gray-300 text-base flex-shrink-0" />
                                    <span className="flex-1 text-xs font-medium text-gray-700 truncate">{lesson.title}</span>
                                    {lesson.hidden && (
                                        <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded font-medium flex-shrink-0">Hidden</span>
                                    )}
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition flex-shrink-0">
                                        <button onClick={() => handleDeleteLesson(lesson.id, lesson.title)}
                                            className="w-6 h-6 rounded-lg flex items-center justify-center text-gray-300 hover:bg-red-50 hover:text-red-400 transition">
                                            <MdDelete className="text-sm" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    <div className="px-4 py-3 border-t border-dashed border-gray-200">
                        <button onClick={() => setShowAddLesson(true)}
                            className="flex items-center gap-1.5 text-xs font-semibold text-violet-600 hover:text-violet-700 transition">
                            <FaPlus className="text-[9px]" /> Add Lesson
                        </button>
                    </div>
                </div>
            )}

            {showAddLesson && (
                <AddLessonModal
                    moduleId={module.id}
                    onClose={() => setShowAddLesson(false)}
                    onCreated={() => { fetchLessons(); onRefresh(); }}
                />
            )}
        </div>
    );
};

const DEFAULT_PRICING_PLAN_ID =
    "21820685-0920-42bc-89ec-5df3ed0684fc";
/* MAIN: CREATE COURSE FORM */
const CreateCourse = () => {
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [price, setPrice] = useState("");
    const [isFree, setIsFree] = useState(false);
    const [encryption, setEncryption] = useState("ENCRYPTION");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [plans, setPlans] = useState([]);
    const [selectedPlan, setSelectedPlan] = useState("");

    const handleFreeToggle = (e) => {
        setIsFree(e.target.checked);
        if (e.target.checked) setPrice("0");
        else setPrice("");
    };

    const handleSubmit = async () => {
        if (!title.trim()) {
            setError("Title is required.");
            return;
        }

        setSubmitting(true);
        setError("");

        try {
    const body = {
        title: title.trim(),
        free: isFree,
        pricingPlanId: selectedPlan || DEFAULT_PRICING_PLAN_ID,
        encrypted: encryption === "ENCRYPTION",
    };

    const res = await instructorCourseApi.createCourse(body);
    const course = res.data.data;

    navigate(`/instructor/course-builder/${course.slug}`);
} catch (err) {
    console.log("Status:", err.response?.status);
    console.log("Response:", err.response?.data);
    setError(err.response?.data?.message || "Failed to create course.");
} finally {
    setSubmitting(false);
}
    };

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const res = await instructorPricingApi.getPricingPlans();
                setPlans(res.data.data || []);
            } catch (err) {
                console.error("Failed to fetch pricing plans:", err);
                setPlans([]);
            }
        };
        fetchPlans();
    }, []);


    // ── Create form ──
    return (
        <div className="min-h-screen bg-white p-5">
            <div className="max-w-7xl mx-auto">
                <p className="text-xs text-gray-400 mb-2">
                    <Link to="/instructor/courses" className="hover:text-violet-600 transition font-medium">
                        Courses
                    </Link>
                    <span className="mx-2">&gt;</span>
                    <span className="text-gray-600">Create Course</span>
                </p>
            </div>

            <h1 className="text-xl font-bold text-gray-900">Create Course</h1>
            <p className="text-sm text-gray-500 mt-1 mb-8">Start creating a new course</p>

            {error && (
                <div className="mb-5 p-3 bg-red-50 border border-red-100 text-red-700 rounded-xl text-sm font-medium">
                    ⚠️ {error}
                </div>
            )}

            <div className="space-y-7">
                {/* Title */}
                <div>
                    <div className="flex items-center justify-between mb-1.5">
                        <label className="text-sm font-semibold text-gray-800">
                            Title<span className="text-red-500">*</span>
                        </label>
                        <span className="text-xs text-gray-400 font-medium">{title.length}/{MAX_TITLE}</span>
                    </div>
                    <input
                        type="text"
                        maxLength={MAX_TITLE}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. Complete Digital Marketing Course"
                        className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 outline-none focus:border-violet-400 focus:bg-white transition placeholder:text-gray-400"
                        disabled={submitting}
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-1.5">Pricing Plan</label>
                    <select
                        value={selectedPlan}
                        onChange={(e) => {
    setSelectedPlan(e.target.value);
    const plan = plans.find(p => p.id === e.target.value);
    if (plan) setPrice(plan.discountPrice || plan.actualPrice);
}}
                        className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 outline-none focus:border-violet-400 focus:bg-white transition"
                        disabled={submitting}
                    >
                        <option value="">Select Pricing Plan</option>
                        {plans.map(plan => (
    <option key={plan.id} value={plan.id}>{plan.planTitle}</option>
))}
                    </select>
                </div>

                {/* Price */}
                <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-1.5">Price</label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold text-sm select-none">₹</span>
                        <input
                            type="number"
                            min={0}
                            value={isFree ? "" : price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder={isFree ? "Free" : "0"}
                            disabled={isFree || submitting}
                            className="w-full h-11 pl-9 pr-4 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 outline-none focus:border-violet-400 focus:bg-white transition placeholder:text-gray-400 disabled:opacity-60 disabled:cursor-not-allowed"
                        />
                    </div>
                    <label className="flex items-center gap-2.5 mt-3 cursor-pointer w-fit">
                        <input
                            type="checkbox"
                            checked={isFree}
                            onChange={handleFreeToggle}
                            disabled={submitting}
                            className="w-4 h-4 rounded border-gray-300 accent-violet-600 cursor-pointer"
                        />
                        <span className="text-sm text-gray-700">Make this a free course</span>
                    </label>
                </div>

                {/* Content Security */}
                <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-3">Content Security</label>
                    <div className="space-y-3">
                        <label className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition ${encryption === "ENCRYPTION" ? "border-violet-500 bg-violet-50/40" : "border-gray-200 hover:border-gray-300"
                            }`}>
                            <div className="mt-0.5 flex-shrink-0">
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition ${encryption === "ENCRYPTION" ? "border-violet-600 bg-violet-600" : "border-gray-300"
                                    }`}>
                                    {encryption === "ENCRYPTION" && <div className="w-2 h-2 rounded-full bg-white" />}
                                </div>
                            </div>
                            <input type="radio" name="security" value="ENCRYPTION"
                                checked={encryption === "ENCRYPTION"}
                                onChange={() => setEncryption("ENCRYPTION")}
                                className="hidden" disabled={submitting} />
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-semibold text-gray-900">Encryption</span>
                                    <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">Recommended</span>
                                </div>
                                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                                    Secure content will be encrypted using DRM system and will be protected against piracy.
                                </p>
                            </div>
                        </label>

                        <label className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition ${encryption === "NONE" ? "border-violet-500 bg-violet-50/40" : "border-gray-200 hover:border-gray-300"
                            }`}>
                            <div className="mt-0.5 flex-shrink-0">
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition ${encryption === "NONE" ? "border-violet-600 bg-violet-600" : "border-gray-300"
                                    }`}>
                                    {encryption === "NONE" && <div className="w-2 h-2 rounded-full bg-white" />}
                                </div>
                            </div>
                            <input type="radio" name="security" value="NONE"
                                checked={encryption === "NONE"}
                                onChange={() => setEncryption("NONE")}
                                className="hidden" disabled={submitting} />
                            <div>
                                <span className="text-sm font-semibold text-gray-900">No Encryption</span>
                                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                                    Content will not be encrypted. Unsecure content can be easily downloaded and pirated.
                                </p>
                            </div>
                        </label>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 pt-2">
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={submitting || !title.trim()}
                        className="h-10 px-8 rounded-xl bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold transition shadow-sm"
                    >
                        {submitting ? "Creating..." : "CREATE"}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate("/instructor/my-courses")}
                        disabled={submitting}
                        className="h-10 px-6 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition"
                    >
                        CANCEL
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateCourse;