import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    FaChevronLeft, FaPlus, FaSearch, FaEdit, FaTrash, FaCopy,
    FaEllipsisV, FaGift
} from "react-icons/fa";
import {
    MdPayment, MdArchive, MdContentCopy, MdCheckCircle, MdWarning,
    MdClose, MdAdd
} from "react-icons/md";
import { AiOutlineLoading3Quarters, AiOutlineCalendar } from "react-icons/ai";
import { FaApple } from "react-icons/fa";
import { MdAccessTime } from "react-icons/md";

/* ══════════════════════════════════════════════════════════
   TOAST
══════════════════════════════════════════════════════════ */
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

function EditPlanView({ plan, onBack, onSave }) {
    const [activeTab, setActiveTab] = useState("edit_plan");
    const [publishState, setPublishState] = useState("PUBLISHED");
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({
        title: plan?.title || "One Time Payment Plan",
        shortDesc: plan?.shortDesc || "",
        longDesc: plan?.longDesc || "",
        privacy: plan?.privacy || "public",
        price: plan?.price || "",
        discountPrice: plan?.discountPrice || "",
        location: "Rest Of The World",
        renewalPlan: "",
        paymentGateway: "Razorpay",
        couponCode: true,
        planType: "normal",
        validityType: "validity",
        validity: "365",
    });

    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

    const handleSave = async () => {
        setSaving(true);
        await new Promise(r => setTimeout(r, 800));
        setSaving(false);
        onSave?.(form);
    };

    /* ── Tab: Edit Plan ── */
    const renderEditPlan = () => (
        <div className="space-y-6 max-w-2xl">
            {/* Title */}
            <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1.5">Plan Title</label>
                <input value={form.title} onChange={e => set("title", e.target.value)}
                    placeholder="One Time Payment Plan"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition" />
            </div>

            {/* Short Desc */}
            <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1.5">Short Description</label>
                <input value={form.shortDesc} onChange={e => set("shortDesc", e.target.value)}
                    placeholder="Enter a short description"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition" />
            </div>

            {/* Long Desc */}
            <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1.5">Long Description</label>
                <textarea value={form.longDesc} onChange={e => set("longDesc", e.target.value)}
                    placeholder="Enter a long description" rows={5}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition resize-none" />
            </div>

            {/* Privacy */}
            <div>
                <label className="text-sm font-semibold text-gray-700 block mb-2">Privacy</label>
                <p className="text-xs text-gray-500 mb-3">Select a privacy for your pricing plan</p>
                <div className="space-y-3">
                    {[
                        { val: "public", label: "Public", desc: "Make it public to allow easy access to all learners without any restriction" },
                        { val: "private", label: "Private", desc: "Make it private to allow access only to invited students you share with" },
                    ].map(opt => (
                        <label key={opt.val} onClick={() => set("privacy", opt.val)}
                            className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition
                ${form.privacy === opt.val ? "border-violet-400 bg-violet-50" : "border-gray-200 hover:border-gray-300"}`}>
                            <div className={`w-4 h-4 rounded-full border-2 mt-0.5 flex-shrink-0 flex items-center justify-center
                ${form.privacy === opt.val ? "border-violet-500 bg-violet-500" : "border-gray-300"}`}>
                                {form.privacy === opt.val && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-800">{opt.label}</p>
                                <p className="text-xs text-gray-500 mt-0.5">{opt.desc}</p>
                            </div>
                        </label>
                    ))}
                </div>
            </div>

            {/* Price */}
            <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1.5">Price*</label>
                <p className="text-xs text-gray-500 mb-2">Set price for your learners</p>
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden focus-within:border-violet-400 focus-within:ring-2 focus-within:ring-violet-100 transition">
                    <span className="px-4 py-2.5 bg-gray-50 border-r border-gray-200 text-gray-600 font-semibold text-sm">₹</span>
                    <input type="number" value={form.price} onChange={e => set("price", e.target.value)}
                        placeholder="0" className="flex-1 px-4 py-2.5 text-sm text-gray-800 outline-none" />
                </div>
            </div>

            {/* Discount Price */}
            <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1.5">Discount Price</label>
                <p className="text-xs text-gray-500 mb-2">Enter discounted price here</p>
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden focus-within:border-violet-400 focus-within:ring-2 focus-within:ring-violet-100 transition">
                    <span className="px-4 py-2.5 bg-gray-50 border-r border-gray-200 text-gray-600 font-semibold text-sm">₹</span>
                    <input type="number" value={form.discountPrice} onChange={e => set("discountPrice", e.target.value)}
                        placeholder="0" className="flex-1 px-4 py-2.5 text-sm text-gray-800 outline-none" />
                </div>
            </div>

            {/* Location */}
            <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1.5">Location</label>
                <select value={form.location} onChange={e => set("location", e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition bg-white">
                    <option>Rest Of The World</option>
                    <option>India</option>
                    <option>United States</option>
                    <option>United Kingdom</option>
                    <option>Australia</option>
                </select>
            </div>

            {/* Renewal Plan */}
            <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1.5">Renewal Plan</label>
                <p className="text-xs text-gray-500 mb-2">Note: Not applicable for subscriptions and tiers</p>
                <select value={form.renewalPlan} onChange={e => set("renewalPlan", e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition bg-white">
                    <option value="">Select Plan</option>
                    <option value="monthly">Monthly Renewal</option>
                    <option value="quarterly">Quarterly Renewal</option>
                    <option value="yearly">Yearly Renewal</option>
                </select>
            </div>

            {/* Payment Gateway */}
            <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1.5">Payment Gateway*</label>
                <p className="text-xs text-gray-500 mb-2">Learners will purchase through the selected gateway.</p>
                <select value={form.paymentGateway} onChange={e => set("paymentGateway", e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition bg-white">
                    <option>Razorpay</option>
                    <option>Stripe</option>
                    <option>PayPal</option>
                    <option>PayU</option>
                    <option>Instamojo</option>
                </select>
            </div>

            {/* Coupon Code */}
            <div>
                <label className="text-sm font-semibold text-gray-700 block mb-2">Coupon Code</label>
                <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" checked={form.couponCode} onChange={e => set("couponCode", e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 mt-0.5" style={{ accentColor: "#7c3aed" }} />
                    <span className="text-sm text-gray-700">Enable learners to apply coupon code at purchase</span>
                </label>
            </div>

            {/* Plan Type */}
            <div>
                <label className="text-sm font-semibold text-gray-700 block mb-3">Plan Type</label>
                <div className="space-y-3">
                    {[
                        { val: "normal", label: "Normal", desc: "Visible exclusively to new learners." },
                        { val: "renewal", label: "Renewal", desc: "Visible exclusively to renewal learners." },
                    ].map(opt => (
                        <label key={opt.val} onClick={() => set("planType", opt.val)}
                            className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition
                ${form.planType === opt.val ? "border-violet-400 bg-violet-50" : "border-gray-200 hover:border-gray-300"}`}>
                            <div className={`w-4 h-4 rounded-full border-2 mt-0.5 flex-shrink-0 flex items-center justify-center
                ${form.planType === opt.val ? "border-violet-500 bg-violet-500" : "border-gray-300"}`}>
                                {form.planType === opt.val && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-800">{opt.label}</p>
                                <p className="text-xs text-gray-500 mt-0.5">{opt.desc}</p>
                            </div>
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );

    /* ── Tab: Publish Status ── */
    const renderPublishStatus = () => (
        <div className="max-w-2xl">
            <p className="text-sm text-gray-500 mb-6">Publish / Unpublish plan for your learners</p>
            <div className="space-y-3">
                {[
                    { val: "DRAFT", label: "Draft", desc: "Editable; not visible to learners.", tag: "Current State", tagColor: "bg-gray-100 text-gray-700", sel: "border-gray-400 bg-gray-50" },
                    { val: "PUBLISHED", label: "Published", desc: "Learners can enroll & access.", tag: null, tagColor: "", sel: "border-violet-400 bg-violet-50" },
                    { val: "UNPUBLISHED", label: "Unpublished", desc: "Hidden from learners.", tag: null, tagColor: "", sel: "border-red-400 bg-red-50" },
                    { val: "DELETED", label: "Deleted", desc: "Non-editable; not visible to learners.", tag: null, tagColor: "", sel: "border-slate-400 bg-slate-50" },
                ].map(opt => (
                    <div key={opt.val} onClick={() => setPublishState(opt.val)}
                        className={`border rounded-xl p-5 cursor-pointer transition
              ${publishState === opt.val ? opt.sel : "border-gray-200 hover:border-gray-300"}`}>
                        <div className="flex items-start gap-3">
                            <div className={`w-4 h-4 rounded-full border-2 mt-0.5 flex-shrink-0 flex items-center justify-center
                ${publishState === opt.val ? "border-violet-500 bg-violet-500" : "border-gray-300"}`}>
                                {publishState === opt.val && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <p className="text-sm font-semibold text-gray-800">{opt.label}</p>
                                    {opt.tag && <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${opt.tagColor}`}>{opt.tag}</span>}
                                </div>
                                <p className="text-xs text-gray-500 mt-0.5">{opt.desc}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex gap-3 mt-6">
                <button className="px-6 py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold rounded-lg transition">SAVE</button>
                <button className="px-6 py-2.5 border border-gray-200 bg-white text-gray-600 text-sm font-semibold rounded-lg hover:bg-gray-50 transition">CANCEL</button>
            </div>
        </div>
    );

    /* ── Tab: Checkout ── */
    const renderCheckout = () => (
        <div className="max-w-2xl space-y-5">
            <div className="p-5 border border-gray-200 rounded-xl space-y-4">
                <h3 className="text-sm font-bold text-gray-800">Checkout Settings</h3>
                <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-1.5">Checkout Page Title</label>
                    <input placeholder="Enter checkout page title"
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition" />
                </div>
                <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-1.5">Redirect URL after Purchase</label>
                    <input placeholder="https://yoursite.com/thank-you"
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition" />
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-gray-300" style={{ accentColor: "#7c3aed" }} />
                    <span className="text-sm text-gray-700">Enable GST collection at checkout</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300" style={{ accentColor: "#7c3aed" }} />
                    <span className="text-sm text-gray-700">Collect phone number at checkout</span>
                </label>
            </div>
        </div>
    );

    /* ── Tab: Archive ── */
    const renderArchive = () => (
        <div className="max-w-2xl">
            <div className="p-5 bg-amber-50 border border-amber-200 rounded-2xl">
                <p className="text-sm font-semibold text-amber-700 mb-1">⚠ Archive this pricing plan</p>
                <p className="text-xs text-amber-600 mb-4">Archiving hides the plan from learners. Existing enrollments are not affected.</p>
                <button className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold rounded-xl transition flex items-center gap-2">
                    <MdArchive /> Archive Plan
                </button>
            </div>
        </div>
    );

    const hasFooter = activeTab === "edit_plan" || activeTab === "checkout";

    return (
        <div className="min-h-screen bg-white flex flex-col">
            {/* Top bar */}
            <div className="border-b border-gray-100 px-6 py-3 flex items-center justify-between">
                <button onClick={onBack}
                    className="flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-violet-600 transition">
                    <FaChevronLeft className="text-xs" /> Back
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-50 transition">
                    <MdContentCopy className="text-sm" /> CLONE
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto flex flex-col">
                <div className="flex-1 px-8 py-6">
                    {/* Page heading */}
                    {activeTab !== "publish_status" && (
                        <div className="mb-6">
                            <h2 className="text-xl font-bold text-gray-900">
                                {{ edit_plan: "Edit Plan", checkout: "Checkout", archive_plan: "Archive Plan" }[activeTab]}
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">
                                {{ edit_plan: "Edit your pricing plan and validity", checkout: "Configure checkout settings for this plan", archive_plan: "Archive this pricing plan" }[activeTab]}
                            </p>
                        </div>
                    )}
                    {activeTab === "edit_plan" && renderEditPlan()}
                    {activeTab === "publish_status" && renderPublishStatus()}
                    {activeTab === "checkout" && renderCheckout()}
                    {activeTab === "archive_plan" && renderArchive()}
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

/* ══════════════════════════════════════════════════════════
   PRICING PLANS DASHBOARD
══════════════════════════════════════════════════════════ */
function PricingPlansDashboard({ onBack, onCreatePlan, onSelectPlan }) {
    const navigate = useNavigate();
    const [activeFilter, setActiveFilter] = useState("ALL");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedPlans, setSelectedPlans] = useState([]);
    const [plans] = useState([
        { id: 1, title: "Basic Plan", type: "One Time Payment", price: 49, discountPrice: null, status: "PUBLISHED", validity: "365 days", createdAt: "2024-01-15", learners: 156 },
        { id: 2, title: "Premium Plan", type: "One Time Payment", price: 99, discountPrice: null, status: "DRAFT", validity: "365 days", createdAt: "2024-02-20", learners: 0 },
        { id: 3, title: "Pro Subscription", type: "Instalment Plan", price: 199, discountPrice: null, status: "PUBLISHED", validity: "30 days", createdAt: "2024-03-01", learners: 89 },
        { id: 4, title: "Holiday Special", type: "Limited Time Offer", price: 149, discountPrice: 99, status: "UNPUBLISHED", validity: "14 days", createdAt: "2024-03-10", learners: 0 },
    ]);

    const STATUS_COLORS = {
        PUBLISHED: "bg-emerald-100 text-emerald-700 border border-emerald-200",
        DRAFT: "bg-gray-100    text-gray-600    border border-gray-200",
        UNPUBLISHED: "bg-amber-100   text-amber-700   border border-amber-200",
        ARCHIVED: "bg-red-100     text-red-700     border border-red-200",
    };

    const filters = ["ALL", "DRAFT", "PUBLISHED", "UNPUBLISHED", "ARCHIVED"];

    const filtered = plans.filter(p =>
        (activeFilter === "ALL" || p.status === activeFilter) &&
        (p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.type.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="min-h-screen">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div>
                            <h1 className="text-lg font-bold text-gray-900">Pricing Plans</h1>
                            <p className="text-xs text-gray-500">Manage pricing and expiry details for your product</p>
                        </div>
                    </div>
                    <button onClick={onCreatePlan}
                        className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition flex items-center gap-2 text-sm font-semibold shadow-sm">
                        <FaPlus className="text-xs" /> Create Plan
                    </button>
                </div>
            </div>

            <div className="px-6 py-6">

                {/* Search */}
                <div className="relative mb-5 max-w-md">
                    <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                    <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                        placeholder="Search by Title (alt+k or cmd+k)"
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition" />
                </div>

                {/* Table */}
                {filtered.length > 0 ? (
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-4 py-3 w-10">
                                        <input type="checkbox" className="w-4 h-4 rounded border-gray-300" style={{ accentColor: "#7c3aed" }}
                                            onChange={e => setSelectedPlans(e.target.checked ? filtered.map(p => p.id) : [])} />
                                    </th>
                                    {["Plan Title", "Plan Type", "Price", "Validity", "Actions"].map(h => (
                                        <th key={h} className={`px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider ${h === "Actions" ? "text-right" : "text-left"}`}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filtered.map(plan => (
                                    <tr key={plan.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-4">
                                            <input type="checkbox" checked={selectedPlans.includes(plan.id)} style={{ accentColor: "#7c3aed" }}
                                                onChange={() => setSelectedPlans(p => p.includes(plan.id) ? p.filter(id => id !== plan.id) : [...p, plan.id])}
                                                className="w-4 h-4 rounded border-gray-300" />
                                        </td>
                                        <td className="px-4 py-4">
                                            <p className="text-sm font-semibold text-gray-800">{plan.title}</p>
                                            <p className="text-xs text-gray-400 mt-0.5">{plan.createdAt}</p>
                                        </td>
                                        <td className="px-4 py-4 text-sm text-gray-600">{plan.type}</td>
                                        <td className="px-4 py-4">
                                            {plan.discountPrice
                                                ? <><span className="text-sm font-bold text-gray-900">₹{plan.discountPrice}</span><span className="text-xs text-gray-400 line-through ml-1.5">₹{plan.price}</span></>
                                                : <span className="text-sm font-bold text-gray-900">₹{plan.price}</span>}
                                        </td>
                                        <td className="px-4 py-4 text-sm text-gray-600">{plan.validity}</td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center justify-end gap-1">
                                                <button onClick={() => onSelectPlan(plan)} title="Edit"
                                                    className="p-1.5 text-gray-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition">
                                                    <FaEdit className="text-sm" />
                                                </button>
                                                <button title="Clone"
                                                    className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition">
                                                    <FaCopy className="text-sm" />
                                                </button>
                                                <button title="Delete"
                                                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition">
                                                    <FaTrash className="text-sm" />
                                                </button>
                                                <button className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition">
                                                    <FaEllipsisV className="text-sm" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
                        <FaSearch className="text-3xl text-gray-300 mx-auto mb-3" />
                        <p className="text-sm font-semibold text-gray-500">No results found</p>
                        <p className="text-xs text-gray-400 mt-1">Try adjusting your filters or search term</p>
                    </div>
                )}

                {/* Bulk actions */}
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

/* CHOOSE PRICING PLAN TYPE */
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

/* ══════════════════════════════════════════════════════════
   CREATE PRICING PLAN FORM
══════════════════════════════════════════════════════════ */
function CreatePricingPlan({ planType, onBack, onSave }) {
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({
        title: "", shortDescription: "", longDescription: "", privacy: "public",
        price: "", discountPrice: "", location: "Rest Of The World",
        renewalPlan: "", paymentGateway: "Razorpay", couponCode: true,
        planType: "normal", validityType: "validity", validity: "365", trialDuration: "0",
    });

    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

    const PLAN_LABEL = {
        free: "Free Plan", "one-time": "One Time Payment",
        instalment: "Instalment Purchase Plan", "limited-time": "Limited Time Offer Plan",
    };
    const planLabel = PLAN_LABEL[planType] || "Pricing Plan";

    const handleSubmit = async () => {
        setSaving(true);
        await new Promise(r => setTimeout(r, 900));
        setSaving(false);
        onSave(form);
    };

    const inputCls = "w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition bg-white";

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
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

                <div className="bg-white rounded-xl border border-gray-200 p-8 space-y-6 shadow-sm">
                    {/* Title */}
                    <div>
                        <div className="flex justify-between mb-1.5">
                            <label className="text-sm font-semibold text-gray-700">Plan Title</label>
                            <span className="text-xs text-gray-400">{form.title.length}/60</span>
                        </div>
                        <input value={form.title} onChange={e => set("title", e.target.value)} maxLength={60}
                            placeholder="One Time Payment Plan" className={inputCls} />
                    </div>

                    {/* Short Desc */}
                    <div>
                        <label className="text-sm font-semibold text-gray-700 block mb-1.5">Short Description</label>
                        <input value={form.shortDescription} onChange={e => set("shortDescription", e.target.value)}
                            placeholder="Set a short description for your pricing plan" className={inputCls} />
                    </div>

                    {/* Long Desc */}
                    <div>
                        <label className="text-sm font-semibold text-gray-700 block mb-1.5">Long Description</label>
                        <textarea value={form.longDescription} onChange={e => set("longDescription", e.target.value)}
                            placeholder="Set a long description for your pricing plan" rows={4}
                            className={`${inputCls} resize-none`} />
                    </div>

                    {/* Privacy */}
                    <div>
                        <label className="text-sm font-semibold text-gray-700 block mb-3">Privacy</label>
                        <div className="space-y-3">
                            {[
                                { val: "public", label: "Public", desc: "Allow easy access to all learners without any restriction" },
                                { val: "private", label: "Private", desc: "Allow access only to invited students you share with" },
                            ].map(opt => (
                                <label key={opt.val} onClick={() => set("privacy", opt.val)}
                                    className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition
                    ${form.privacy === opt.val ? "border-violet-400 bg-violet-50" : "border-gray-200 hover:border-gray-300"}`}>
                                    <div className={`w-4 h-4 rounded-full border-2 mt-0.5 flex-shrink-0 flex items-center justify-center
                    ${form.privacy === opt.val ? "border-violet-500 bg-violet-500" : "border-gray-300"}`}>
                                        {form.privacy === opt.val && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-800">{opt.label}</p>
                                        <p className="text-xs text-gray-500 mt-0.5">{opt.desc}</p>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Price */}
                    <div>
                        <label className="text-sm font-semibold text-gray-700 block mb-1.5">Price*</label>
                        <p className="text-xs text-gray-500 mb-2">Set price for your learners</p>
                        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden focus-within:border-violet-400 focus-within:ring-2 focus-within:ring-violet-100 transition">
                            <span className="px-4 py-2.5 bg-gray-50 border-r border-gray-200 text-gray-600 font-semibold text-sm">₹</span>
                            <input type="number" value={form.price} onChange={e => set("price", e.target.value)}
                                placeholder="0" className="flex-1 px-4 py-2.5 text-sm text-gray-800 outline-none" />
                        </div>
                    </div>

                    {/* Discount Price */}
                    <div>
                        <label className="text-sm font-semibold text-gray-700 block mb-1.5">Discount Price</label>
                        <p className="text-xs text-gray-500 mb-2">Enter discounted price here</p>
                        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden focus-within:border-violet-400 focus-within:ring-2 focus-within:ring-violet-100 transition">
                            <span className="px-4 py-2.5 bg-gray-50 border-r border-gray-200 text-gray-600 font-semibold text-sm">₹</span>
                            <input type="number" value={form.discountPrice} onChange={e => set("discountPrice", e.target.value)}
                                placeholder="0" className="flex-1 px-4 py-2.5 text-sm text-gray-800 outline-none" />
                        </div>
                    </div>

                    {/* Validity Type */}
                    <div>
                        <label className="text-sm font-semibold text-gray-700 block mb-2">Choose Type Of Validity*</label>
                        <p className="text-xs text-gray-500 mb-3">Set validity or expiry for your product</p>
                        <div className="flex gap-6">
                            {[{ val: "validity", label: "Set Validity" }, { val: "expiry", label: "Set Expiry" }].map(o => (
                                <label key={o.val} className="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" name="validityType" value={o.val} checked={form.validityType === o.val}
                                        onChange={() => set("validityType", o.val)}
                                        className="w-4 h-4 text-violet-600" style={{ accentColor: "#7c3aed" }} />
                                    <span className="text-sm font-medium text-gray-700">{o.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Validity days */}
                    <div>
                        <label className="text-sm font-semibold text-gray-700 block mb-1.5">Validity</label>
                        <div className="flex gap-3 items-center">
                            <input type="number" value={form.validity} onChange={e => set("validity", e.target.value)}
                                className="w-32 px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition" />
                            <span className="text-sm text-gray-600">Day(s)</span>
                        </div>
                    </div>

                    {/* Trial Duration */}
                    <div>
                        <label className="text-sm font-semibold text-gray-700 block mb-1.5">Trial Duration</label>
                        <p className="text-xs text-gray-500 mb-2">Not applicable for subscriptions and tiers</p>
                        <div className="flex gap-3 items-center">
                            <input type="number" value={form.trialDuration} onChange={e => set("trialDuration", e.target.value)}
                                className="w-32 px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition" />
                            <span className="text-sm text-gray-600">Day(s)</span>
                        </div>
                    </div>

                    {/* Location */}
                    <div>
                        <label className="text-sm font-semibold text-gray-700 block mb-1.5">Location</label>
                        <select value={form.location} onChange={e => set("location", e.target.value)} className={inputCls}>
                            <option>Rest Of The World</option>
                            <option>India</option>
                            <option>United States</option>
                            <option>United Kingdom</option>
                            <option>Australia</option>
                        </select>
                    </div>

                    {/* Renewal Plan */}
                    <div>
                        <label className="text-sm font-semibold text-gray-700 block mb-1.5">Renewal Plan</label>
                        <p className="text-xs text-gray-500 mb-2">Not applicable for subscriptions and tiers</p>
                        <select value={form.renewalPlan} onChange={e => set("renewalPlan", e.target.value)} className={inputCls}>
                            <option value="">Select Plan</option>
                            <option value="monthly">Monthly Renewal</option>
                            <option value="quarterly">Quarterly Renewal</option>
                            <option value="yearly">Yearly Renewal</option>
                        </select>
                    </div>

                    {/* Payment Gateway */}
                    <div>
                        <label className="text-sm font-semibold text-gray-700 block mb-1.5">Payment Gateway*</label>
                        <p className="text-xs text-gray-500 mb-2">Learners will purchase through the selected gateway.</p>
                        <select value={form.paymentGateway} onChange={e => set("paymentGateway", e.target.value)} className={inputCls}>
                            <option>Razorpay</option>
                            <option>Stripe</option>
                            <option>PayPal</option>
                            <option>PayU</option>
                            <option>Instamojo</option>
                        </select>
                    </div>

                    {/* Coupon Code */}
                    <div>
                        <label className="text-sm font-semibold text-gray-700 block mb-2">Coupon Code</label>
                        <label className="flex items-start gap-3 cursor-pointer">
                            <input type="checkbox" checked={form.couponCode} onChange={e => set("couponCode", e.target.checked)}
                                className="w-4 h-4 rounded border-gray-300 mt-0.5" style={{ accentColor: "#7c3aed" }} />
                            <span className="text-sm text-gray-700">Enable learners to apply coupon code at purchase</span>
                        </label>
                    </div>

                    {/* Plan Type */}
                    <div>
                        <label className="text-sm font-semibold text-gray-700 block mb-3">Plan Type</label>
                        <div className="space-y-3">
                            {[
                                { val: "normal", label: "Normal", desc: "Visible exclusively to new learners." },
                                { val: "renewal", label: "Renewal", desc: "Visible exclusively to renewal learners." },
                            ].map(opt => (
                                <label key={opt.val} onClick={() => set("planType", opt.val)}
                                    className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition
                    ${form.planType === opt.val ? "border-violet-400 bg-violet-50" : "border-gray-200 hover:border-gray-300"}`}>
                                    <div className={`w-4 h-4 rounded-full border-2 mt-0.5 flex-shrink-0 flex items-center justify-center
                    ${form.planType === opt.val ? "border-violet-500 bg-violet-500" : "border-gray-300"}`}>
                                        {form.planType === opt.val && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-800">{opt.label}</p>
                                        <p className="text-xs text-gray-500 mt-0.5">{opt.desc}</p>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>
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

/* ══════════════════════════════════════════════════════════
   PRICING PLANS MANAGER  ← default export (orchestrator)
══════════════════════════════════════════════════════════ */
export default function PricingPlans({ onBack }) {
    const navigate = useNavigate();
    const [view, setView] = useState("dashboard"); // dashboard | choose | create | edit
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