import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
    adminCourseApi,
    adminPricingApi,
    adminManagement,
} from "../auth/api";

const MAX_TITLE = 60;

const CreateCourse = () => {
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [isFree, setIsFree] = useState(false);
    const [encryption, setEncryption] = useState("ENCRYPTION");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [plans, setPlans] = useState([]);
    const [selectedPlan, setSelectedPlan] = useState("");
    const [instructors, setInstructors] = useState([]);
    const [selectedInstructor, setSelectedInstructor] = useState("");

    const handleSubmit = async () => {
        if (!title.trim()) {
            setError("Title is required.");
            return;
        }
        if (!selectedPlan) {
            setError("Pricing Plan is required.");
            return;
        }
        if (!selectedInstructor) {
            setError("Instructor is required.");
            return;
        }

        setSubmitting(true);
        setError("");

        try {
            // Matches the backend's AdminCreateCourseRequestDTO exactly: title, free,
            // pricingPlanId (reference to an existing plan, not an embedded object),
            // encrypted, instructorIds. Everything else (description, tags, FAQs,
            // features, etc.) is edited afterwards on the Course Settings page.
            const body = {
                title: title.trim(),
                free: isFree,
                pricingPlanId: isFree ? null : (selectedPlan || null),
                encrypted: encryption === "ENCRYPTION",
                // NOTE: the admin instructor list (adminManagement.getAllInstructors) only
                // exposes instructorCode, not the instructor's UUID id, so this currently
                // cannot be populated with a value the backend will accept as a UUID.
                // Left as-is until the backend instructor summary DTO exposes an id field.
                instructorIds: selectedInstructor ? [selectedInstructor] : [],
            };

            const res = await adminCourseApi.createCourse(body);
            // Redirect to course settings
            navigate(`/admin/course-settings/${res.data.data.slug}`);
        } catch (err) {
            console.error("Status:", err.response?.status);
            console.error("Response:", err.response?.data);
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
        const fetchDependencies = async () => {
            try {
                const plansRes = await adminPricingApi.getPricingPlans();
                setPlans(plansRes.data?.data?.content || plansRes.data?.data || []);
            } catch (err) {
                console.error("Failed to fetch pricing plans:", err);
                setPlans([]);
            }

            try {
                const instRes = await adminManagement.getAllInstructors(null, 0, 500);
                setInstructors(instRes.data?.data?.content || instRes.data?.data || []);
            } catch (err) {
                console.error("Failed to fetch instructors:", err);
                setInstructors([]);
            }
        };
        fetchDependencies();
    }, []);


    return (
        <div className="min-h-screen bg-navy-50/40 p-5">
            <div className="max-w-4xl mx-auto">
                <p className="text-xs text-gray-400 mb-4">
                    <Link to="/admin/all-courses" className="hover:text-brand-orange-dark transition font-medium">
                        All Courses
                    </Link>
                    <span className="mx-2">&gt;</span>
                    <span className="text-gray-600">Create Course</span>
                </p>

                <div className="rounded-2xl bg-gradient-to-r from-navy-900 via-navy-800 to-navy-700 px-6 py-6 shadow-lg relative overflow-hidden mb-6">
                    <div className="absolute -right-8 -top-10 w-40 h-40 rounded-full bg-brand-orange/10 blur-2xl" />
                    <div className="absolute right-16 bottom-0 w-24 h-24 rounded-full bg-brand-orange/20 blur-xl" />
                    <div className="relative">
                        <h1 className="text-2xl font-bold text-white">Create Course</h1>
                        <div className="h-1 w-12 bg-brand-orange rounded-full mt-2 mb-2" />
                        <p className="text-sm text-navy-100/70">Start creating a new course for an instructor</p>
                    </div>
                </div>

                {error && (
                    <div className="mb-5 p-3 bg-red-50 border border-red-100 text-red-700 rounded-xl text-sm font-medium">
                        ⚠️ {error}
                    </div>
                )}

                <div className="space-y-7 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
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
                            className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 outline-none focus:border-navy-600 focus:bg-white transition placeholder:text-gray-400"
                            disabled={submitting}
                        />
                    </div>

                    {/* Instructor Selection (Admin Specific) */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                            Assign Instructor <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={selectedInstructor}
                            required
                            onChange={(e) => {
                                setSelectedInstructor(e.target.value);
                                setError("");
                            }}
                            className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 outline-none focus:border-navy-600 focus:bg-white transition"
                            disabled={submitting}
                        >
                            <option value="">Select Instructor</option>
                            {instructors.map((inst) => (
                                <option key={inst.instructorCode} value={inst.instructorCode}>
                                    {inst.fullName || "Unknown Name"} ({inst.email})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Pricing Plan */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                            Pricing Plan <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={selectedPlan}
                            required
                            onChange={(e) => {
                                setSelectedPlan(e.target.value);
                                const plan = plans.find((p) => p.id === e.target.value);
                                const type = (plan?.pricingType || plan?.type || "").toUpperCase();
                                setIsFree(type === "FREE");
                                setError("");
                            }}
                            className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 outline-none focus:border-navy-600 focus:bg-white transition"
                            disabled={submitting}
                        >
                            <option value="">Select Pricing Plan</option>
                            {plans.map((plan) => (
                                <option key={plan.id} value={plan.id}>
                                    {plan.planTitle || plan.title}
                                </option>
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
                            <label className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition ${encryption === "ENCRYPTION" ? "border-navy-600 bg-navy-50" : "border-gray-200 hover:border-gray-300"
                                }`}>
                                <div className="mt-0.5 flex-shrink-0">
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition ${encryption === "ENCRYPTION" ? "border-navy-600 bg-navy-600" : "border-gray-300"
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

                            <label className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition ${encryption === "NONE" ? "border-navy-600 bg-navy-50" : "border-gray-200 hover:border-gray-300"
                                }`}>
                                <div className="mt-0.5 flex-shrink-0">
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition ${encryption === "NONE" ? "border-navy-600 bg-navy-600" : "border-gray-300"
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
                    <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={submitting || !title.trim()}
                            className="h-10 px-8 rounded-xl bg-brand-orange hover:bg-brand-orange-dark disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold transition shadow-sm mt-4 border-none cursor-pointer"
                        >
                            {submitting ? "Creating..." : "CREATE COURSE"}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate("/admin/all-courses")}
                            disabled={submitting}
                            className="h-10 px-6 mt-4 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition"
                        >
                            CANCEL
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateCourse;
