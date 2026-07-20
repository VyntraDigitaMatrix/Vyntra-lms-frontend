import React, { useState } from "react";
import { FaChevronLeft } from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { instructorPricingApi } from "../../auth/api";
import { extractErrorMessage, buildPricingPayload } from "./utils";

export default function EditPlanView({ plan, onBack, onSave, setError }) {
    const [activeTab, setActiveTab] = useState("edit_plan");
    const [publishState, setPublishState] = useState(plan?.active ? "PUBLISHED" : "UNPUBLISHED");
    const [saving, setSaving] = useState(false);
    const [localError, setLocalError] = useState("");
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
        setLocalError("");
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
            setLocalError(msg);
        } finally {
            setSaving(false);
        }
    };

    const renderEditPlan = () => (
        <div className="space-y-6 max-w-2xl">
            {localError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                    {localError}
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
