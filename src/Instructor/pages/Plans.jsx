import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { instructorPricingApi } from "../auth/api";
import {
    FaChevronLeft, FaPlus, FaSearch, FaEdit, FaTrash, FaCopy,
    FaEllipsisV, FaGift
} from "react-icons/fa";
import {
    MdPayment, MdArchive, MdContentCopy, MdCheckCircle, MdWarning,
    MdClose, MdAdd
} from "react-icons/md";
import { AiOutlineLoading3Quarters, AiOutlineCalendar } from "react-icons/ai";
import { MdAccessTime } from "react-icons/md";

function Toast({ msg, type = "success", onClose }) {
    if (!msg) return null;
    return (
        <div className="fixed top-5 right-5 z-[9999] bg-white border border-gray-200 rounded-xl px-4 py-3 flex items-center gap-3 shadow-xl min-w-[260px]">
            {type === "success"
                ? <MdCheckCircle className="text-emerald-500 text-xl flex-shrink-0" />
                : <MdWarning className="text-amber-500 text-xl flex-shrink-0" />}
            <span className="text-sm font-medium text-gray-800 flex-1">{msg}</span>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-lg leading-none">&times;</button>
        </div>
    );
}

function extractErrorMessage(err, fallback = "Something went wrong. Please try again.") {
    const respData = err?.response?.data;
    if (!respData) return err?.message || fallback;

    // Always log the full response for debugging
    console.log("=== FULL ERROR RESPONSE ===", JSON.stringify(respData, null, 2));

    // Check for "already exists" error
    if (respData?.message && respData.message.includes("already exists")) {
        return "A pricing plan of this type already exists. Please edit the existing plan or choose a different plan type.";
    }

    // data field is often the field-level validation map { fieldName: "error message" }
    if (respData?.data && typeof respData.data === "object") {
        const entries = Object.entries(respData.data);
        if (entries.length > 0) {
            const msgs = entries.map(([field, msg]) => `${field}: ${msg}`);
            return `Validation errors — ${msgs.join(" | ")}`;
        }
    }

    if (typeof respData?.data === "string" && respData.data) {
        return respData.data;
    }

    // errors array or object
    if (respData?.errors) {
        const errs = Array.isArray(respData.errors)
            ? respData.errors.map(e => e.message || e)
            : Object.values(respData.errors).flat();
        if (errs.length) return errs.join(", ");
    }

    return respData?.message || JSON.stringify(respData) || fallback;
}



function buildPricingPayload({
    title, longDesc, shortDesc, pricingType,
    price, discountPrice, validityType, validity,
    offerStartDate, offerEndDate,
}) {
    const isFree = pricingType === "FREE";
    const isInstallment = pricingType === "INSTALLMENT_PURCHASE";
    const isLimitedTime = pricingType === "LIMITED_TIME_OFFER";

    const actualPrice = isFree ? 0 : Number(price || 0);
    const parsedDiscount = discountPrice ? Number(discountPrice) : 0;
    // discountPrice must never exceed actualPrice; zero it out for FREE or if discount > actual
    const resolvedDiscount = isFree ? 0 : (parsedDiscount > actualPrice ? 0 : parsedDiscount);

    // Backend requires valid ISO date strings for offerStartDate/offerEndDate
    const now = new Date().toISOString();
    const resolvedStartDate = isLimitedTime && offerStartDate
        ? new Date(offerStartDate).toISOString()
        : now;
    const resolvedEndDate = isLimitedTime && offerEndDate
        ? new Date(offerEndDate).toISOString()
        : now;

    const payload = {
        planTitle: title.trim(),
        description: longDesc || "",
        shortDescription: shortDesc || "",
        pricingType,
        actualPrice,
        discountPrice: resolvedDiscount,
        lifetimeAccess: validityType === "lifetime",
        // Backend requires validityInDays > 0 always.
        // For lifetime plans use 36500 (100 years); for validity plans use the entered days
        validityInDays: validityType === "lifetime" ? 36500 : Math.max(1, Number(validity || 1)),
        offerStartDate: resolvedStartDate,
        offerEndDate: resolvedEndDate,
        active: true,
        defaultPlan: false,
    };

    // Only add installment fields for INSTALLMENT_PURCHASE
    // Backend validation: installmentMonths > 0 and amountPerMonth > 0 — only valid for installment plans
    if (isInstallment) {
        payload.installmentMonths = Number(validity || 0);
        payload.amountPerMonth = Number(price || 0);
    }


    console.log("=== PRICING PAYLOAD ===", JSON.stringify(payload, null, 2));
    return payload;
}



function EditPlanView({ plan, onBack, onSave }) {
    const [activeTab, setActiveTab] = useState("edit_plan");
    const [publishState, setPublishState] = useState(plan?.active ? "PUBLISHED" : "UNPUBLISHED");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [form, setForm] = useState({
        title: plan?.planTitle || plan?.title || "",
        shortDesc: plan?.shortDescription || plan?.shortDesc || "",
        longDesc: plan?.description || plan?.longDesc || "",
        privacy: plan?.privacy || "public",
        price: plan?.actualPrice ?? "",
        discountPrice: plan?.discountPrice ?? "",
        location: "Rest Of The World",
        renewalPlan: "",
        paymentGateway: "Razorpay",
        couponCode: true,
        planType: "normal",
        pricingType: plan?.pricingType || "ONE_TIME_PURCHASE",
        // If the plan has validityInDays > 0, use 'validity'; otherwise check lifetimeAccess
        validityType: (plan?.validityInDays && plan.validityInDays > 0) ? "validity" : (plan?.lifetimeAccess ? "lifetime" : "validity"),
        validity: (plan?.validityInDays && plan.validityInDays > 0 && plan.validityInDays < 36500) ? plan.validityInDays : 365,
    });

    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

    const handleSave = async () => {
        setError("");
        try {
            setSaving(true);

            const payload = buildPricingPayload({
                title: form.title,
                longDesc: form.longDesc,
                shortDesc: form.shortDesc,
                pricingType: form.pricingType,
                price: form.price,
                discountPrice: form.discountPrice,
                validityType: form.validityType,
                validity: form.validity,
            });

            await instructorPricingApi.updatePricingPlan(plan.id, payload);
            onSave?.();
        } catch (err) {
            const msg = extractErrorMessage(err, "Failed to update plan. Please try again.");
            setError(msg);
        } finally {
            setSaving(false);
        }
    };

    const renderEditPlan = () => (
        <div className="space-y-6 max-w-2xl">
            {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                    {error}
                </div>
            )}

            <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1.5">Plan Title</label>
                <input
                    value={form.title}
                    onChange={e => set("title", e.target.value)}
                    placeholder="Enter plan title"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition"
                />
            </div>

            <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1.5">Short Description</label>
                <input
                    value={form.shortDesc}
                    onChange={e => set("shortDesc", e.target.value)}
                    placeholder="Enter a short description"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition"
                />
            </div>

            <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1.5">Long Description</label>
                <textarea
                    value={form.longDesc}
                    onChange={e => set("longDesc", e.target.value)}
                    placeholder="Enter a long description"
                    rows={5}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition resize-none"
                />
            </div>

            <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1.5">Price*</label>
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden focus-within:border-violet-400 focus-within:ring-2 focus-within:ring-violet-100 transition">
                    <span className="px-4 py-2.5 bg-gray-50 border-r border-gray-200 text-gray-600 font-semibold text-sm">₹</span>
                    <input
                        type="number"
                        value={form.price}
                        onChange={e => set("price", e.target.value)}
                        placeholder="0"
                        className="flex-1 px-4 py-2.5 text-sm text-gray-800 outline-none"
                    />
                </div>
            </div>

            <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1.5">Discount Price</label>
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden focus-within:border-violet-400 focus-within:ring-2 focus-within:ring-violet-100 transition">
                    <span className="px-4 py-2.5 bg-gray-50 border-r border-gray-200 text-gray-600 font-semibold text-sm">₹</span>
                    <input
                        type="number"
                        value={form.discountPrice}
                        onChange={e => set("discountPrice", e.target.value)}
                        placeholder="0"
                        className="flex-1 px-4 py-2.5 text-sm text-gray-800 outline-none"
                    />
                </div>
            </div>

            <div>
                <label className="text-sm font-semibold text-gray-700 block mb-2">Validity Type</label>
                <div className="flex gap-6 mb-3">
                    {[{ val: "validity", label: "Set Validity" }, { val: "lifetime", label: "Lifetime" }].map(o => (
                        <label key={o.val} className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="editValidityType"
                                value={o.val}
                                checked={form.validityType === o.val}
                                onChange={() => set("validityType", o.val)}
                                className="w-4 h-4"
                                style={{ accentColor: "#7c3aed" }}
                            />
                            <span className="text-sm font-medium text-gray-700">{o.label}</span>
                        </label>
                    ))}
                </div>
                {form.validityType === "validity" && (
                    <div>
                        <label className="text-sm font-semibold text-gray-700 block mb-1.5">Validity (Days)*</label>
                        <input
                            type="number"
                            min="1"
                            value={form.validity}
                            onChange={e => set("validity", e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition"
                        />
                    </div>
                )}
            </div>
        </div>
    );

    const renderPublishStatus = () => (
        <div className="max-w-2xl">
            <p className="text-sm text-gray-500 mb-6">Publish / Unpublish plan for your learners</p>
            <div className="space-y-3">
                {[
                    { val: "PUBLISHED", label: "Published", desc: "Learners can enroll & access." },
                    { val: "UNPUBLISHED", label: "Unpublished", desc: "Hidden from learners." },
                ].map(opt => (
                    <div key={opt.val} onClick={() => setPublishState(opt.val)}
                        className={`border rounded-xl p-5 cursor-pointer transition
                            ${publishState === opt.val ? "border-violet-400 bg-violet-50" : "border-gray-200 hover:border-gray-300"}`}>
                        <div className="flex items-start gap-3">
                            <div className={`w-4 h-4 rounded-full border-2 mt-0.5 flex-shrink-0 flex items-center justify-center
                                ${publishState === opt.val ? "border-violet-500 bg-violet-500" : "border-gray-300"}`}>
                                {publishState === opt.val && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-800">{opt.label}</p>
                                <p className="text-xs text-gray-500 mt-0.5">{opt.desc}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const hasFooter = activeTab === "edit_plan";

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <div className="border-b border-gray-100 px-6 py-3 flex items-center justify-between">
                <button onClick={onBack}
                    className="flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-violet-600 transition">
                    <FaChevronLeft className="text-xs" /> Back
                </button>
            </div>

            <div className="flex-1 overflow-y-auto flex flex-col">
                <div className="flex-1 px-8 py-6">
                    <div className="mb-6">
                        <h2 className="text-xl font-bold text-gray-900">Edit Plan</h2>
                        <p className="text-sm text-gray-500 mt-1">Edit your pricing plan and validity</p>
                    </div>
                    {activeTab === "edit_plan" && renderEditPlan()}
                    {activeTab === "publish_status" && renderPublishStatus()}
                </div>

                {hasFooter && (
                    <div className="border-t border-gray-200 px-8 py-4 flex gap-3 bg-white sticky bottom-0">
                        <button onClick={handleSave} disabled={saving}
                            className="px-8 py-2.5 bg-gray-800 hover:bg-gray-900 disabled:opacity-60 text-white text-sm font-bold rounded-lg transition flex items-center gap-2">
                            {saving && <AiOutlineLoading3Quarters className="animate-spin text-sm" />} SAVE
                        </button>
                        <button onClick={onBack}
                            className="px-6 py-2.5 border border-gray-200 bg-white text-gray-600 text-sm font-semibold rounded-lg hover:bg-gray-50 transition">
                            CANCEL
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

function PricingPlansDashboard({ onBack, onCreatePlan, onSelectPlan }) {
    const [activeFilter, setActiveFilter] = useState("ALL");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedPlans, setSelectedPlans] = useState([]);
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadPlans = async () => {
            try {
                const res = await instructorPricingApi.getPricingPlans();
                const data = res.data?.data?.content || res.data?.data || [];
                setPlans(data);
            } catch (error) {
                console.error("Failed to load plans", error);
            } finally {
                setLoading(false);
            }
        };
        loadPlans();
    }, []);

    const handleDeletePlan = async (id, title) => {
        if (!window.confirm(`Are you sure you want to delete the plan "${title}"?`)) return;
        try {
            await instructorPricingApi.deletePricingPlan(id);
            setPlans(prev => prev.filter(p => p.id !== id));
        } catch (error) {
            console.error("Failed to delete plan", error);
        }
    };

    const filters = ["ALL", "PUBLISHED", "UNPUBLISHED"];

    const filtered = plans.filter(p => {
        const status = p.active ? "PUBLISHED" : "UNPUBLISHED";
        const title = p.planTitle || p.title || "";
        const type = p.pricingType || p.type || "";
        return (activeFilter === "ALL" || status === activeFilter) &&
            (title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                type.toLowerCase().includes(searchTerm.toLowerCase()));
    });

    return (
        <div className="min-h-screen">
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="px-6 py-4 flex items-center justify-between">
                    <div>
                        <h1 className="text-lg font-bold text-gray-900">Pricing Plans</h1>
                        <p className="text-xs text-gray-500">Manage pricing and expiry details for your product</p>
                    </div>
                    <button onClick={onCreatePlan}
                        className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition flex items-center gap-2 text-sm font-semibold shadow-sm">
                        <FaPlus className="text-xs" /> Create Plan
                    </button>
                </div>
            </div>

            <div className="px-6 py-6">
                <div className="relative mb-5 max-w-md">
                    <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                    <input
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        placeholder="Search by Title"
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition"
                    />
                </div>

                {filtered.length > 0 ? (
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-4 py-3 w-10">
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 rounded border-gray-300"
                                            style={{ accentColor: "#7c3aed" }}
                                            onChange={e => setSelectedPlans(e.target.checked ? filtered.map(p => p.id) : [])}
                                        />
                                    </th>
                                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-left">Plan Title</th>
                                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-left">Plan Type</th>
                                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-left">Price</th>
                                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-left">Validity</th>
                                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filtered.map(plan => {
                                    const title = plan.planTitle || plan.title;
                                    const type = plan.pricingType || plan.type;
                                    const price = plan.actualPrice ?? plan.price;
                                    const discount = plan.discountPrice;
                                    const validity = plan.validityInDays ? `${plan.validityInDays} days` : (plan.lifetimeAccess ? "Lifetime" : "N/A");

                                    return (
                                        <tr key={plan.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-4 py-4">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedPlans.includes(plan.id)}
                                                    style={{ accentColor: "#7c3aed" }}
                                                    onChange={() => setSelectedPlans(p => p.includes(plan.id) ? p.filter(id => id !== plan.id) : [...p, plan.id])}
                                                    className="w-4 h-4 rounded border-gray-300"
                                                />
                                            </td>
                                            <td className="px-4 py-4">
                                                <p className="text-sm font-semibold text-gray-800">{title}</p>
                                            </td>
                                            <td className="px-4 py-4 text-sm text-gray-600">{type}</td>
                                            <td className="px-4 py-4">
                                                {discount
                                                    ? <><span className="text-sm font-bold text-gray-900">₹{discount}</span><span className="text-xs text-gray-400 line-through ml-1.5">₹{price}</span></>
                                                    : <span className="text-sm font-bold text-gray-900">₹{price}</span>}
                                            </td>
                                            <td className="px-4 py-4 text-sm text-gray-600">{validity}</td>
                                            <td className="px-4 py-4">
                                                <div className="flex items-center justify-end gap-1">
                                                    <button onClick={() => onSelectPlan(plan)} title="Edit"
                                                        className="p-1.5 text-gray-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition">
                                                        <FaEdit className="text-sm" />
                                                    </button>
                                                    <button onClick={() => handleDeletePlan(plan.id, title)} title="Delete"
                                                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition">
                                                        <FaTrash className="text-sm" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
                        <p className="text-sm font-semibold text-gray-500">No plans found</p>
                        <p className="text-xs text-gray-400 mt-1">Create your first pricing plan</p>
                    </div>
                )}

                {selectedPlans.length > 0 && (
                    <div className="mt-4 flex items-center gap-3 px-1">
                        <span className="text-sm text-gray-600 font-medium">{selectedPlans.length} selected</span>
                        <button className="px-3 py-1.5 text-sm text-red-600 bg-red-50 border border-red-200 hover:bg-red-100 rounded-lg transition font-medium">
                            Delete Selected
                        </button>
                        <button onClick={() => setSelectedPlans([])}
                            className="text-xs text-gray-400 hover:text-gray-600 transition">Clear</button>
                    </div>
                )}
            </div>
        </div>
    );
}

const PLAN_TYPES = [
    { id: "free", title: "Free Plan", desc: "Set a free plan for your course", icon: <FaGift className="text-green-500" /> },
    { id: "one-time", title: "One Time Purchase Plan", desc: "Set a fixed purchase amount for your course", icon: <MdPayment className="text-blue-500" /> },
    { id: "instalment", title: "Instalment Purchase Plan", desc: "Allow learners to pay in instalments", icon: <AiOutlineCalendar className="text-orange-500" /> },
    { id: "limited-time", title: "Limited Time Offer Plan", desc: "Offer a discounted amount for a limited time", icon: <MdAccessTime className="text-red-500" /> },
];

function ChoosePricingPlan({ onBack, onSelectPlanType }) {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white border-b border-gray-200 px-6 py-4">
                <button onClick={onBack}
                    className="flex items-center gap-2 text-gray-600 hover:text-violet-600 transition">
                    <FaChevronLeft className="text-sm" />
                    <span className="text-sm font-medium">Back</span>
                </button>
            </div>
            <div className="px-6 py-4 max-w-7xl">
                <h2 className="text-2xl font-bold text-gray-900 mb-1">Choose Pricing Plan</h2>
                <p className="text-sm text-gray-500 mb-8">Select the type of pricing plan you want to create.</p>
                <div className="grid grid-cols-2 gap-4">
                    {PLAN_TYPES.map(plan => (
                        <button key={plan.id} onClick={() => onSelectPlanType(plan.id)}
                            className="p-6 bg-white border border-gray-200 rounded-xl text-left hover:border-violet-400 hover:shadow-md transition group">
                            <div className="text-3xl mb-3">{plan.icon}</div>
                            <h3 className="text-sm font-bold text-gray-900 mb-1.5 group-hover:text-violet-700 transition">{plan.title}</h3>
                            <p className="text-xs text-gray-500 leading-relaxed">{plan.desc}</p>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

function CreatePricingPlan({ planType, onBack, onSave }) {
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [form, setForm] = useState({
        title: "", shortDescription: "", longDescription: "",
        price: "", discountPrice: "",
        validityType: "validity", validity: 365,
        offerStartDate: "", offerEndDate: "",
    });

    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

    const PLAN_LABEL = {
        free: "Free Plan",
        "one-time": "One Time Payment",
        instalment: "Instalment Purchase Plan",
        "limited-time": "Limited Time Offer Plan",
    };
    const planLabel = PLAN_LABEL[planType] || "Pricing Plan";

    const handleSubmit = async () => {
        setError("");

        if (!form.title.trim()) {
            setError("Plan Title is required.");
            return;
        }

        const pricingType = planType === "free" ? "FREE"
            : planType === "one-time" ? "ONE_TIME_PURCHASE"
                : planType === "instalment" ? "INSTALLMENT_PURCHASE"
                    : "LIMITED_TIME_OFFER";

        if (pricingType !== "FREE" && !form.price) {
            setError("Price is required for paid plans.");
            return;
        }

        if (pricingType === "LIMITED_TIME_OFFER" && (!form.offerStartDate || !form.offerEndDate)) {
            setError("Offer Start Date and End Date are required for Limited Time Offer plans.");
            return;
        }

        try {
            setSaving(true);

            const payload = buildPricingPayload({
                title: form.title,
                longDesc: form.longDescription,
                shortDesc: form.shortDescription,
                pricingType,
                price: form.price,
                discountPrice: form.discountPrice,
                validityType: form.validityType,
                validity: form.validity,
                offerStartDate: form.offerStartDate,
                offerEndDate: form.offerEndDate,
            });
            console.log("Sending payload:", JSON.stringify(payload, null, 2));

            const response = await instructorPricingApi.createPricingPlan(payload);
            console.log("Response:", response);
            onSave();
        } catch (err) {
            // Log the full error for debugging
            console.error("Full error:", err);
            console.error("Error response:", err?.response);
            console.error("Error data:", err?.response?.data);

            const msg = extractErrorMessage(err, "Failed to create plan. Please try again.");
            setError(msg);
        } finally {
            setSaving(false);
        }
    };

    const inputCls = "w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition bg-white";

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10 px-6 py-4 flex items-center gap-4">
                <button onClick={onBack} className="flex items-center gap-2 text-gray-600 hover:text-violet-600 transition">
                    <FaChevronLeft className="text-sm" /><span className="text-sm font-medium">Back</span>
                </button>
                <div className="h-5 w-px bg-gray-200" />
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Pricing Plans / {planLabel.toUpperCase()}</p>
            </div>

            <div className="px-6 py-4 max-w-7xl">
                <h2 className="text-2xl font-bold text-gray-900 mb-1">{planLabel}</h2>
                <p className="text-sm text-gray-500 mb-8">Add {planLabel.toLowerCase()} to your product</p>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                        {error}
                    </div>
                )}

                <div className="bg-white rounded-xl border border-gray-200 p-8 space-y-6 shadow-sm">
                    <div>
                        <label className="text-sm font-semibold text-gray-700 block mb-1.5">Plan Title*</label>
                        <input
                            value={form.title}
                            onChange={e => set("title", e.target.value)}
                            placeholder="Enter plan title"
                            className={inputCls}
                        />
                    </div>

                    <div>
                        <label className="text-sm font-semibold text-gray-700 block mb-1.5">Short Description</label>
                        <input
                            value={form.shortDescription}
                            onChange={e => set("shortDescription", e.target.value)}
                            placeholder="Set a short description for your pricing plan"
                            className={inputCls}
                        />
                    </div>

                    <div>
                        <label className="text-sm font-semibold text-gray-700 block mb-1.5">Long Description</label>
                        <textarea
                            value={form.longDescription}
                            onChange={e => set("longDescription", e.target.value)}
                            placeholder="Set a long description for your pricing plan"
                            rows={4}
                            className={`${inputCls} resize-none`}
                        />
                    </div>

                    <div>
                        <label className="text-sm font-semibold text-gray-700 block mb-1.5">Price*</label>
                        <p className="text-xs text-gray-500 mb-2">Set price for your learners</p>
                        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden focus-within:border-violet-400 focus-within:ring-2 focus-within:ring-violet-100 transition">
                            <span className="px-4 py-2.5 bg-gray-50 border-r border-gray-200 text-gray-600 font-semibold text-sm">₹</span>
                            <input
                                type="number"
                                value={form.price}
                                onChange={e => set("price", e.target.value)}
                                placeholder="0"
                                className="flex-1 px-4 py-2.5 text-sm text-gray-800 outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-semibold text-gray-700 block mb-1.5">Discount Price</label>
                        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden focus-within:border-violet-400 focus-within:ring-2 focus-within:ring-violet-100 transition">
                            <span className="px-4 py-2.5 bg-gray-50 border-r border-gray-200 text-gray-600 font-semibold text-sm">₹</span>
                            <input
                                type="number"
                                value={form.discountPrice}
                                onChange={e => set("discountPrice", e.target.value)}
                                placeholder="0"
                                className="flex-1 px-4 py-2.5 text-sm text-gray-800 outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-semibold text-gray-700 block mb-2">Choose Type Of Validity*</label>
                        <div className="flex gap-6">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="validityType"
                                    value="validity"
                                    checked={form.validityType === "validity"}
                                    onChange={() => set("validityType", "validity")}
                                    className="w-4 h-4 text-violet-600"
                                    style={{ accentColor: "#7c3aed" }}
                                />
                                <span className="text-sm font-medium text-gray-700">Set Validity</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="validityType"
                                    value="lifetime"
                                    checked={form.validityType === "lifetime"}
                                    onChange={() => set("validityType", "lifetime")}
                                    className="w-4 h-4 text-violet-600"
                                    style={{ accentColor: "#7c3aed" }}
                                />
                                <span className="text-sm font-medium text-gray-700">Lifetime</span>
                            </label>
                        </div>
                    </div>

                    {form.validityType === "validity" && (
                        <div>
                            <label className="text-sm font-semibold text-gray-700 block mb-1.5">Validity (Days)*</label>
                            <input
                                type="number"
                                value={form.validity}
                                onChange={e => set("validity", e.target.value)}
                                className="w-32 px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition"
                            />
                        </div>
                    )}

                    {/* Offer Start & End Date — only for Limited Time Offer Plan */}
                    {planType === "limited-time" && (
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-semibold text-gray-700 block mb-1.5">
                                    Offer Start Date*
                                </label>
                                <input
                                    type="datetime-local"
                                    value={form.offerStartDate}
                                    onChange={e => set("offerStartDate", e.target.value)}
                                    className={inputCls}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-gray-700 block mb-1.5">
                                    Offer End Date*
                                </label>
                                <input
                                    type="datetime-local"
                                    value={form.offerEndDate}
                                    onChange={e => set("offerEndDate", e.target.value)}
                                    min={form.offerStartDate}
                                    className={inputCls}
                                />
                            </div>
                        </div>
                    )}

                </div>

                <div className="mt-6 flex gap-3">
                    <button onClick={handleSubmit} disabled={saving}
                        className="px-8 py-2.5 bg-violet-600 hover:bg-violet-700 disabled:opacity-60 text-white text-sm font-bold rounded-lg transition flex items-center gap-2 shadow-sm">
                        {saving && <AiOutlineLoading3Quarters className="animate-spin text-sm" />} ADD PRICING PLAN
                    </button>
                    <button onClick={onBack}
                        className="px-6 py-2.5 border border-gray-200 bg-white text-gray-600 text-sm font-semibold rounded-lg hover:bg-gray-50 transition">
                        CANCEL
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function PricingPlans({ onBack }) {
    const navigate = useNavigate();
    const [view, setView] = useState("dashboard");
    const [selectedPlanType, setSelectedPlanType] = useState(null);
    const [editingPlan, setEditingPlan] = useState(null);
    const [toast, setToast] = useState(null);

    const showToast = (msg, type = "success") => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleBack = onBack ?? (() => navigate(-1));

    return (
        <>
            <Toast msg={toast?.msg} type={toast?.type} onClose={() => setToast(null)} />

            {view === "dashboard" && (
                <PricingPlansDashboard
                    onBack={handleBack}
                    onCreatePlan={() => setView("choose")}
                    onSelectPlan={plan => { setEditingPlan(plan); setView("edit"); }}
                />
            )}

            {view === "choose" && (
                <ChoosePricingPlan
                    onBack={() => setView("dashboard")}
                    onSelectPlanType={type => { setSelectedPlanType(type); setView("create"); }}
                />
            )}

            {view === "create" && (
                <CreatePricingPlan
                    planType={selectedPlanType}
                    onBack={() => setView("choose")}
                    onSave={() => { showToast("Pricing plan created successfully!"); setView("dashboard"); }}
                />
            )}

            {view === "edit" && (
                <EditPlanView
                    plan={editingPlan}
                    onBack={() => setView("dashboard")}
                    onSave={() => { showToast("Plan updated successfully!"); setView("dashboard"); }}
                />
            )}
        </>
    );
}