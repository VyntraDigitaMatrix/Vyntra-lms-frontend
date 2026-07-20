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

    const handleSubmit = async () => {
        if (!title.trim()) {
            setError("Title is required.");
            return;
        }
        if (!selectedPlan) {
            setError("Pricing Plan is required.");
            return;
        }

        setSubmitting(true);
        setError("");

        try {
            const body = {
                title: title.trim(),
                pricingPlanId: selectedPlan,
                encrypted: encryption === "ENCRYPTION",
                free: isFree,
            };

            const res = await instructorCourseApi.createCourse(body);
            const course = res.data.data;

            navigate(`/instructor/course-builder/${course.slug}`);
        } catch (err) {
            console.log("Status:", err.response?.status);
            console.log("Response:", err.response?.data);
            let msg = err.response?.data?.message || "Failed to create course.";
            if (err.response?.data?.errors && Array.isArray(err.response.data.errors)) {
                msg += ": " + err.response.data.errors.map(e => `${e.field} ${e.defaultMessage}`).join(", ");
            } else if (err.response?.data?.details) {
                msg += ": " + err.response.data.details;
            }
            setError(msg);
        } finally {
            setSubmitting(false);
        }
    };

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const res = await instructorPricingApi.getPricingPlans();
                setPlans(res.data?.data?.content || res.data?.data || []);
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
                            if (plan && (plan.pricingType || plan.type || "").toUpperCase() === "FREE") {
                                setIsFree(true);
                            }
                        }}
                        className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 outline-none focus:border-violet-400 focus:bg-white transition"
                        disabled={submitting}
                    >
                        <option value="">Select Pricing Plan</option>
                        {plans.map(plan => (
                            <option key={plan.id} value={plan.id}>{plan.planTitle || plan.title}</option>
                        ))}
                    </select>
                </div>

                {/* Price Display */}
                <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-1.5">Price Details</label>
                    {(() => {
                        const plan = plans.find(p => p.id === selectedPlan);
                        if (!plan) {
                            return (
                                <div className="p-4 border border-dashed border-gray-200 rounded-xl text-center">
                                    <p className="text-sm text-gray-500">Select a pricing plan to view details</p>
                                </div>
                            );
                        }

                        const type = (plan.pricingType || plan.type || "").toUpperCase();

                        if (type === "FREE") {
                            return (
                                <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
                                    <p className="text-sm font-semibold text-gray-800">Free Plan</p>
                                    <p className="text-xs text-gray-500 mt-1">Learners can access this course for free.</p>
                                </div>
                            );
                        }

                        if (type === "INSTALLMENT" || type === "INSTALMENT") {
                            return (
                                <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-semibold text-gray-800">Installment Plan</p>
                                        <p className="text-xs text-gray-500 mt-1">{plan.installmentMonths || 3} monthly payments</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-gray-900">₹{plan.amountPerMonth || 0} <span className="text-xs text-gray-500 font-normal">/ month</span></p>
                                    </div>
                                </div>
                            );
                        }

                        // ONE_TIME / LIMITED_OFFER
                        const price = plan.actualPrice ?? plan.price ?? 0;
                        const discount = plan.discountPrice;
                        return (
                            <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-semibold text-gray-800">{type.includes("LIMITED") ? "Limited Time Offer" : "One-Time Payment"}</p>
                                    <p className="text-xs text-gray-500 mt-1">Total price for the course</p>
                                </div>
                                <div className="text-right">
                                    {discount ? (
                                        <>
                                            <div className="flex items-baseline justify-end gap-1.5">
                                                <p className="text-sm font-bold text-gray-900">
                                                    ₹{(Number(price) - Number(discount)).toLocaleString()}
                                                </p>
                                                <p className="text-xs text-gray-400 line-through">₹{Number(price).toLocaleString()}</p>
                                            </div>
                                            <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 rounded px-1.5 py-0.5">
                                                Save ₹{Number(discount).toLocaleString()}
                                            </span>
                                        </>
                                    ) : (
                                        <p className="text-sm font-bold text-gray-900">₹{Number(price).toLocaleString()}</p>
                                    )}
                                </div>
                            </div>
                        );
                    })()}

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