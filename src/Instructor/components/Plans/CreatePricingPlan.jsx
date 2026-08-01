import React, { useState } from "react";
import { FaChevronLeft } from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { instructorPricingApi } from "../../auth/api";
import { extractErrorMessage, buildPricingPayload } from "./utils";

export default function CreatePricingPlan({ planType, onBack, onSave }) {
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

    const inputCls = "w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition bg-white";

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="bg-white border-b border-slate-200 sticky top-0 z-10 px-6 py-4 flex items-center gap-4">
                <button onClick={onBack} className="flex items-center gap-2 text-slate-600 hover:text-[#043573] transition">
                    <FaChevronLeft className="text-sm" /><span className="text-sm font-medium">Back</span>
                </button>
                <div className="h-5 w-px bg-slate-200" />
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pricing Plans / {planLabel.toUpperCase()}</p>
            </div>

            <div className="px-6 py-4 max-w-7xl">
                <h2 className="text-2xl font-bold text-slate-900 mb-1">{planLabel}</h2>
                <p className="text-sm text-slate-500 mb-8">Add {planLabel.toLowerCase()} to your product</p>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                        {error}
                    </div>
                )}

                <div className="bg-white rounded-xl border border-slate-200 p-8 space-y-6 shadow-sm">
                    <div>
                        <label className="text-sm font-semibold text-slate-700 block mb-1.5">Plan Title*</label>
                        <input
                            value={form.title}
                            onChange={e => set("title", e.target.value)}
                            placeholder="Enter plan title"
                            className={inputCls}
                        />
                    </div>

                    <div>
                        <label className="text-sm font-semibold text-slate-700 block mb-1.5">Short Description</label>
                        <input
                            value={form.shortDescription}
                            onChange={e => set("shortDescription", e.target.value)}
                            placeholder="Set a short description for your pricing plan"
                            className={inputCls}
                        />
                    </div>

                    <div>
                        <label className="text-sm font-semibold text-slate-700 block mb-1.5">Long Description</label>
                        <textarea
                            value={form.longDescription}
                            onChange={e => set("longDescription", e.target.value)}
                            placeholder="Set a long description for your pricing plan"
                            rows={4}
                            className={`${inputCls} resize-none`}
                        />
                    </div>

                    <div>
                        <label className="text-sm font-semibold text-slate-700 block mb-1.5">Price*</label>
                        <p className="text-xs text-slate-500 mb-2">Set price for your learners</p>
                        <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition">
                            <span className="px-4 py-2.5 bg-slate-50 border-r border-slate-200 text-slate-600 font-semibold text-sm">₹</span>
                            <input
                                type="number"
                                value={form.price}
                                onChange={e => set("price", e.target.value)}
                                placeholder="0"
                                className="flex-1 px-4 py-2.5 text-sm text-slate-800 outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-semibold text-slate-700 block mb-1.5">Discount Price</label>
                        <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition">
                            <span className="px-4 py-2.5 bg-slate-50 border-r border-slate-200 text-slate-600 font-semibold text-sm">₹</span>
                            <input
                                type="number"
                                value={form.discountPrice}
                                onChange={e => set("discountPrice", e.target.value)}
                                placeholder="0"
                                className="flex-1 px-4 py-2.5 text-sm text-slate-800 outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-semibold text-slate-700 block mb-2">Choose Type Of Validity*</label>
                        <div className="flex gap-6">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="validityType"
                                    value="validity"
                                    checked={form.validityType === "validity"}
                                    onChange={() => set("validityType", "validity")}
                                    className="w-4 h-4 text-[#043573]"
                                    style={{ accentColor: "#043573" }}
                                />
                                <span className="text-sm font-medium text-slate-700">Set Validity</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="validityType"
                                    value="lifetime"
                                    checked={form.validityType === "lifetime"}
                                    onChange={() => set("validityType", "lifetime")}
                                    className="w-4 h-4 text-[#043573]"
                                    style={{ accentColor: "#043573" }}
                                />
                                <span className="text-sm font-medium text-slate-700">Lifetime</span>
                            </label>
                        </div>
                    </div>

                    {form.validityType === "validity" && (
                        <div>
                            <label className="text-sm font-semibold text-slate-700 block mb-1.5">Validity (Days)*</label>
                            <input
                                type="number"
                                value={form.validity}
                                onChange={e => set("validity", e.target.value)}
                                className="w-32 px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
                            />
                        </div>
                    )}

                    {/* Offer Start & End Date — only for Limited Time Offer Plan */}
                    {planType === "limited-time" && (
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-semibold text-slate-700 block mb-1.5">
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
                                <label className="text-sm font-semibold text-slate-700 block mb-1.5">
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
                        className="px-8 py-2.5 bg-[#043573] hover:bg-blue-900 disabled:opacity-60 text-white text-sm font-bold rounded-lg transition flex items-center gap-2 shadow-sm">
                        {saving && <AiOutlineLoading3Quarters className="animate-spin text-sm" />} ADD PRICING PLAN
                    </button>
                    <button onClick={onBack}
                        className="px-6 py-2.5 border border-slate-200 bg-white text-slate-600 text-sm font-semibold rounded-lg hover:bg-slate-50 transition">
                        CANCEL
                    </button>
                </div>
            </div>
        </div>
    );
}
