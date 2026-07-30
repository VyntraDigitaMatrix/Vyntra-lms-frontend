import React, { useState, useEffect, useRef } from 'react';
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { instructorCourseApi, instructorPricingApi } from "../auth/api";
import {
    FaChevronLeft, FaBold, FaItalic, FaUnderline, FaStrikethrough,
    FaAlignLeft, FaAlignCenter, FaAlignRight, FaUndo, FaRedo,
    FaListUl, FaListOl, FaQuoteLeft,
} from 'react-icons/fa';
import {
    MdSearch, MdBrush, MdLanguage, MdLabel, MdPerson, MdQuestionAnswer,
    MdAttachMoney, MdStar, MdForum, MdLeaderboard, MdFlashOn, MdCardMembership,
    MdWaterDrop, MdPeople, MdPublish, MdDelete, MdLink, MdPhoneAndroid,
    MdSettings, MdClose, MdAdd, MdImage, MdInfo, MdPhoneIphone,
    MdCheckCircle, MdWarning, MdVideocam, MdUpload,
} from 'react-icons/md';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import BrandingPage from "./BrandingPage";
import TagsPage from "./TagsPage";
import AuthorsPage from "./AuthorsPage";
import FaqsPage from "./FaqsPage";

/* SETTINGS GROUPS */
const SETTINGS_GROUPS = [
    {
        id: "general", label: "General", description: "Setup general account settings",
        items: [
            { id: "branding", label: "Branding", Icon: MdBrush, desc: "Add details about your course and manage brand…" },
            { id: "tags", label: "Tags", Icon: MdLabel, desc: "Add course tag to make the course easy to filter for…" },
            { id: "authors", label: "Authors", Icon: MdPerson, desc: "Add authors associated with the course" },
            { id: "faqs", label: "FAQs", Icon: MdQuestionAnswer, desc: "Add and manage frequently asked questions for your…" },
            { id: "pricing", label: "Pricing & Plans", Icon: MdAttachMoney, desc: "Set up pricing plans, free status, and encryption." },
        ],
    },
    {
        id: "features", label: "Features", description: "Use course features to enhance your course",
        items: [
            { id: "reviews", label: "Reviews & Ratings", Icon: MdStar, desc: "Course reviews allow learners to provide feedback and ratings" },
            { id: "discussions", label: "Discussions", Icon: MdForum, desc: "Allow learners to create discussions and bookmark…" },
            { id: "bookmarks", label: "Bookmarks", Icon: MdLabel, desc: "Allow learners to bookmark lessons in this course" },
            { id: "leaderboard", label: "Leaderboard", Icon: MdLeaderboard, desc: "Enable leaderboards to increase competition among learners" },
            { id: "certificates", label: "Certificates", Icon: MdCardMembership, desc: "Enable course certification for your learners to issue…" },
            { id: "web", label: "Web", Icon: MdLanguage, desc: "Allow learners to access this course through the web application." },
            { id: "android", label: "Android", Icon: MdPhoneAndroid, desc: "Allow learners to access this course using the Android mobile app." },
            { id: "ios", label: "iOS", Icon: MdPhoneIphone, desc: "Allow learners to access this course using the iOS mobile app." },
        ],
    },
    {
        id: "publish", label: "Publish/Archive Course", description: "Publish or archive course",
        items: [
            { id: "publish_course", label: "Publish Course", Icon: MdPublish, desc: "Publish/Unpublish the course for your learners" },
        ],
    },
];

/* TOAST */
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

/* MEDIA INPUT (URL ↔ File toggle) */
function MediaInput({ label, hint, placeholder, previewType, accept, inputType, onChangeType, urlValue, onChangeUrl, fileValue, onChangeFile }) {
    const fileRef = useRef(null);
    const previewUrl = typeof fileValue === "string"
        ? fileValue
        : fileValue instanceof File
            ? URL.createObjectURL(fileValue)
            : null;

    return (
        <div>
            {/* Label row with URL/File toggle */}
            <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-semibold text-gray-700">{label}</label>
                <div className="flex bg-gray-100 rounded-lg p-0.5 gap-0.5">
                    {["url", "file"].map(opt => (
                        <button key={opt} type="button"
                            onClick={() => onChangeType(opt)}
                            className={`px-3 py-1 rounded-md text-xs font-semibold transition flex items-center gap-1 capitalize
                                ${inputType === opt ? "bg-white text-violet-700 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
                            {opt === "url" ? <MdLink className="text-sm" /> : <MdUpload className="text-sm" />}
                            {opt.toUpperCase()}
                        </button>
                    ))}
                </div>
            </div>

            {hint && <p className="text-xs text-gray-500 mb-3">{hint}</p>}

            {/* URL input */}
            {inputType === "url" && (
                <div className="relative">
                    <MdLink className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-base pointer-events-none" />
                    <input
                        type="url"
                        value={urlValue || ""}
                        onChange={e => onChangeUrl(e.target.value)}
                        placeholder={placeholder || "https://..."}
                        className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 transition"
                    />
                </div>
            )}

            {/* File upload */}
            {inputType === "file" && (
                <>
                    <div className="border border-gray-200 rounded-xl overflow-hidden w-64">
                        <div className="h-36 bg-gray-50 flex items-center justify-center">
                            {previewUrl
                                ? previewType === "video"
                                    ? <video src={previewUrl} className="w-full h-full object-cover" controls />
                                    : <img src={previewUrl} alt="preview" className="w-full h-full object-cover" />
                                : previewType === "video"
                                    ? <MdVideocam className="text-4xl text-gray-300" />
                                    : <MdImage className="text-4xl text-gray-300" />
                            }
                        </div>
                        <div className="flex border-t border-gray-200">
                            <button type="button" onClick={() => onChangeFile(null)}
                                className="flex-1 py-2 text-xs font-semibold text-gray-500 hover:bg-gray-50 transition border-r border-gray-200">
                                REMOVE
                            </button>
                            <button type="button" onClick={() => fileRef.current?.click()}
                                className="flex-1 py-2 text-xs font-bold text-white bg-violet-600 hover:bg-violet-700 transition">
                                UPLOAD
                            </button>
                        </div>
                    </div>
                    <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                        <MdInfo className="text-sm flex-shrink-0" />
                        {previewType === "video"
                            ? "Upload MP4 / WebM promotional video for your course."
                            : "Upload image with resolution of 1024 × 576 pixels."}
                    </p>
                    <input ref={fileRef} type="file" className="hidden" accept={accept}
                        onChange={e => { const f = e.target.files?.[0]; if (f) onChangeFile(f); }} />
                </>
            )}
        </div>
    );
}

/* PERMISSIONS PAGE */
function PermissionsPage({ data, setData }) {
    const toggle = (key) => setData(d => ({ ...d, [key]: !d[key] }));
    const radio = (key, value) => setData(d => ({ ...d, [key]: value }));

    const Toggle = ({ k }) => (
        <button onClick={() => toggle(k)}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 rounded-full transition-colors ${data[k] ? "bg-violet-500" : "bg-gray-300"}`}>
            <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${data[k] ? "translate-x-5" : ""}`} />
        </button>
    );

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Permissions</h2>
            <p className="text-sm text-gray-500 mb-8">Manage permission settings for your course</p>
            <div className="space-y-6">
                {/* Sell Independently */}
                <div className="p-5 border border-gray-200 rounded-xl bg-white">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h3 className="text-sm font-semibold text-gray-800">Sell Independently</h3>
                            <p className="text-xs text-gray-500 mt-1">Enable to sell your course independently outside a bundle</p>
                        </div>
                        <Toggle k="sellIndependently" />
                    </div>
                </div>
                {/* Course Access Type */}
                <div className="p-5 border border-gray-200 rounded-xl bg-white">
                    <h3 className="text-sm font-semibold text-gray-800 mb-3">Course Access Type</h3>
                    <p className="text-xs text-gray-500 mb-4">Select course access type to make a course public / private / unlisted</p>
                    <div className="space-y-3">
                        {[
                            { val: "public", label: "Public Course", desc: "Allow easy access to all learners without any restriction" },
                            { val: "private", label: "Private Course", desc: "Allow access only to invited students" },
                            { val: "unlisted", label: "Unlisted Course", desc: "Remove this course from the list of all products" },
                        ].map(opt => (
                            <label key={opt.val} onClick={() => radio("courseAccess", opt.val)}
                                className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition ${data.courseAccess === opt.val ? "border-violet-400 bg-violet-50" : "border-gray-200 hover:border-gray-300"}`}>
                                <div className={`w-4 h-4 rounded-full border-2 mt-0.5 flex-shrink-0 flex items-center justify-center ${data.courseAccess === opt.val ? "border-violet-500 bg-violet-500" : "border-gray-300"}`}>
                                    {data.courseAccess === opt.val && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-800">{opt.label}</p>
                                    <p className="text-xs text-gray-500 mt-0.5">{opt.desc}</p>
                                </div>
                            </label>
                        ))}
                    </div>
                </div>
                {/* Offline Access */}
                <div className="p-5 border border-gray-200 rounded-xl bg-white">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h3 className="text-sm font-semibold text-gray-800">Offline Access</h3>
                            <p className="text-xs text-gray-500 mt-1">For offline access your school should have Android app subscription, encrypted courses & paid selling type.</p>
                        </div>
                        <Toggle k="offlineAccess" />
                    </div>
                </div>
            </div>
        </div>
    );
}

/* FEATURE PAGE (generic toggle) */
function FeaturePage({ title, desc, toggleKey, data, setData }) {
    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">{title}</h2>
            <p className="text-sm text-gray-500 mb-8">{desc}</p>
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                <div>
                    <p className="text-sm font-semibold text-gray-800">Enable {title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">Toggle to enable or disable this feature</p>
                </div>
                <div onClick={() => setData(d => ({ ...d, [toggleKey]: !d[toggleKey] }))}
                    className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer flex-shrink-0 ${data[toggleKey] ? "bg-violet-500" : "bg-gray-200"}`}>
                    <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${data[toggleKey] ? "translate-x-5" : "translate-x-0.5"}`} />
                </div>
            </div>
        </div>
    );
}

/* PUBLISH PAGE */
function PublishPage({ data, onPublish, onArchive, publishing }) {
    const isPublished = data.status === "PUBLISHED";
    const isArchived = data.status === "ARCHIVED";
    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Publish Course</h2>
            <p className="text-sm text-gray-500 mb-8">Publish, unpublish, or archive your course for learners</p>

            <div className={`p-5 rounded-2xl border-2 mb-4 ${isPublished ? "border-emerald-200 bg-emerald-50" : "border-gray-200 bg-gray-50"}`}>
                <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isPublished ? "bg-emerald-100" : "bg-gray-200"}`}>
                        <MdPublish className={`text-2xl ${isPublished ? "text-emerald-600" : "text-gray-400"}`} />
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-bold text-gray-800">{data.status}</p>
                        <p className="text-xs text-gray-500 mt-0.5">
                            {isPublished ? "Learners can see and enroll in this course" : "Learners cannot see this course yet"}
                        </p>
                    </div>
                    {!isPublished && (
                        <button onClick={onPublish} disabled={publishing}
                            className="px-5 py-2 rounded-xl text-sm font-bold transition bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50 flex items-center gap-2">
                            {publishing && <AiOutlineLoading3Quarters className="animate-spin text-sm" />} Publish
                        </button>
                    )}
                </div>
            </div>

            {!isArchived && (
                <div className="p-5 rounded-2xl border-2 border-amber-200 bg-amber-50">
                    <div className="flex items-center gap-4">
                        <div className="flex-1">
                            <p className="text-sm font-bold text-amber-800">Archive this course</p>
                            <p className="text-xs text-amber-600 mt-0.5">Hides the course from learners without deleting any content.</p>
                        </div>
                        <button onClick={onArchive} disabled={publishing}
                            className="px-5 py-2 rounded-xl text-sm font-bold transition bg-amber-500 hover:bg-amber-600 text-white disabled:opacity-50">
                            Archive
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

/* ══════════════════════════════════════════════════════════
}

/* ══════════════════════════════════════════════════════════
   PRICING PAGE
══════════════════════════════════════════════════════════ */
function PricingPage({ data, setData }) {
    const [plans, setPlans] = useState([]);
    
    useEffect(() => {
        instructorPricingApi.getPricingPlans(0, 100)
            .then(res => setPlans(res.data?.data?.content || []))
            .catch(err => console.error("Failed to fetch plans", err));
    }, []);

    const handleSelectPlan = (e) => {
        const planId = e.target.value;
        const selected = plans.find(p => p.id === planId);
        if (selected) {
            setData(d => ({
                ...d,
                pricingPlanId: selected.id,
                free: selected.pricingType === "FREE",
                pricingType: selected.pricingType || "ONE_TIME_PURCHASE",
                actualPrice: selected.actualPrice || 0,
                discountPrice: selected.discountPrice || 0,
                lifetimeAccess: selected.lifetimeAccess || false,
                validityInDays: selected.validityInDays || 0,
                offerStartDate: selected.offerStartDate || null,
                offerEndDate: selected.offerEndDate || null,
                installmentMonths: selected.installmentMonths || 0,
                amountPerMonth: selected.amountPerMonth || 0,
            }));
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Pricing & Plans</h2>
            <p className="text-sm text-gray-500 mb-8">Set up the pricing model, encryption, and display price for your course</p>
            
            <div className="space-y-6">
                {/* Select from existing plans */}
                <div className="p-5 border border-gray-200 rounded-xl bg-white">
                    <label className="text-sm font-semibold text-gray-800 block mb-2">Import from Global Plans</label>
                    <p className="text-xs text-gray-500 mb-3">Select a plan you've created in the Plans page to auto-fill these settings.</p>
                    <select 
                        onChange={handleSelectPlan}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition bg-white"
                        defaultValue=""
                    >
                        <option value="" disabled>-- Select a Plan --</option>
                        {plans.map(plan => (
                            <option key={plan.id} value={plan.id}>
                                {plan.planTitle} ({plan.pricingType === "FREE" ? "Free" : `₹${plan.actualPrice}`})
                            </option>
                        ))}
                    </select>
                </div>

                {/* Free Toggle */}
                <div className="p-5 border border-gray-200 rounded-xl bg-white flex items-start justify-between gap-4">
                    <div>
                        <h3 className="text-sm font-semibold text-gray-800">Free Course</h3>
                        <p className="text-xs text-gray-500 mt-1">Make this course entirely free for learners</p>
                    </div>
                    <button onClick={() => setData(d => ({ ...d, free: !d.free }))}
                        className={`relative inline-flex h-6 w-11 flex-shrink-0 rounded-full transition-colors ${data.free ? "bg-violet-500" : "bg-gray-300"}`}>
                        <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${data.free ? "translate-x-5" : ""}`} />
                    </button>
                </div>

                {!data.free && (
                    <>
                        <div className="p-5 border border-gray-200 rounded-xl bg-white">
                            <label className="text-sm font-semibold text-gray-800 block mb-2">Pricing Type</label>
                            <select 
                                value={data.pricingType || "ONE_TIME_PURCHASE"} 
                                onChange={e => setData(d => ({ ...d, pricingType: e.target.value }))}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition bg-white mb-4"
                            >
                                <option value="ONE_TIME_PURCHASE">One Time</option>
                                <option value="LIMITED_TIME_OFFER">Limited Offer</option>
                                <option value="INSTALLMENT_PURCHASE">Installment</option>
                            </select>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="text-sm font-semibold text-gray-800 block mb-2">Actual Price</label>
                                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden focus-within:border-violet-400 transition">
                                        <span className="px-4 py-2 bg-gray-50 border-r border-gray-200 text-gray-600 font-semibold text-sm">₹</span>
                                        <input 
                                            type="number" 
                                            value={data.actualPrice || 0} 
                                            onChange={e => setData(d => ({ ...d, actualPrice: parseFloat(e.target.value) || 0 }))}
                                            className="flex-1 px-4 py-2 text-sm text-gray-800 outline-none" 
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-semibold text-gray-800 block mb-2">Discount Price</label>
                                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden focus-within:border-violet-400 transition">
                                        <span className="px-4 py-2 bg-gray-50 border-r border-gray-200 text-gray-600 font-semibold text-sm">₹</span>
                                        <input 
                                            type="number" 
                                            value={data.discountPrice || 0} 
                                            onChange={e => setData(d => ({ ...d, discountPrice: parseFloat(e.target.value) || 0 }))}
                                            className="flex-1 px-4 py-2 text-sm text-gray-800 outline-none" 
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between mb-4">
                                <label className="text-sm font-semibold text-gray-800">Lifetime Access</label>
                                <button onClick={() => setData(d => ({ ...d, lifetimeAccess: !d.lifetimeAccess }))}
                                    className={`relative inline-flex h-6 w-11 flex-shrink-0 rounded-full transition-colors ${data.lifetimeAccess ? "bg-violet-500" : "bg-gray-300"}`}>
                                    <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${data.lifetimeAccess ? "translate-x-5" : ""}`} />
                                </button>
                            </div>

                            {!data.lifetimeAccess && (
                                <div className="mb-4">
                                    <label className="text-sm font-semibold text-gray-800 block mb-2">Validity In Days</label>
                                    <input 
                                        type="number" 
                                        value={data.validityInDays || 0} 
                                        onChange={e => setData(d => ({ ...d, validityInDays: parseInt(e.target.value, 10) || 0 }))}
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-violet-400 transition bg-white" 
                                    />
                                </div>
                            )}

                            {data.pricingType === "LIMITED_TIME_OFFER" && (
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="text-sm font-semibold text-gray-800 block mb-2">Offer Start Date</label>
                                        <input 
                                            type="datetime-local" 
                                            value={data.offerStartDate ? data.offerStartDate.slice(0, 16) : ""} 
                                            onChange={e => setData(d => ({ ...d, offerStartDate: e.target.value ? new Date(e.target.value).toISOString() : null }))}
                                            className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-violet-400 transition bg-white" 
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-semibold text-gray-800 block mb-2">Offer End Date</label>
                                        <input 
                                            type="datetime-local" 
                                            value={data.offerEndDate ? data.offerEndDate.slice(0, 16) : ""} 
                                            onChange={e => setData(d => ({ ...d, offerEndDate: e.target.value ? new Date(e.target.value).toISOString() : null }))}
                                            className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-violet-400 transition bg-white" 
                                        />
                                    </div>
                                </div>
                            )}

                            {data.pricingType === "INSTALLMENT_PURCHASE" && (
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="text-sm font-semibold text-gray-800 block mb-2">Installment Months</label>
                                        <input 
                                            type="number" 
                                            value={data.installmentMonths || 0} 
                                            onChange={e => setData(d => ({ ...d, installmentMonths: parseInt(e.target.value, 10) || 0 }))}
                                            className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-violet-400 transition bg-white" 
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-semibold text-gray-800 block mb-2">Amount Per Month</label>
                                        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden focus-within:border-violet-400 transition">
                                            <span className="px-4 py-2 bg-gray-50 border-r border-gray-200 text-gray-600 font-semibold text-sm">₹</span>
                                            <input 
                                                type="number" 
                                                value={data.amountPerMonth || 0} 
                                                onChange={e => setData(d => ({ ...d, amountPerMonth: parseFloat(e.target.value) || 0 }))}
                                                className="flex-1 px-4 py-2 text-sm text-gray-800 outline-none" 
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                )}

                {/* Encrypted Toggle */}
                <div className="p-5 border border-gray-200 rounded-xl bg-white flex items-start justify-between gap-4">
                    <div>
                        <h3 className="text-sm font-semibold text-gray-800">Encrypted Content</h3>
                        <p className="text-xs text-gray-500 mt-1">Enable video encryption to protect your content from unauthorized downloading</p>
                    </div>
                    <button onClick={() => setData(d => ({ ...d, encrypted: !d.encrypted }))}
                        className={`relative inline-flex h-6 w-11 flex-shrink-0 rounded-full transition-colors ${data.encrypted ? "bg-violet-500" : "bg-gray-300"}`}>
                        <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${data.encrypted ? "translate-x-5" : ""}`} />
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ══════════════════════════════════════════════════════════
   GENERIC PLACEHOLDER PAGE
══════════════════════════════════════════════════════════ */
function GenericPage({ title, description }) {
    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">{title}</h2>
            <p className="text-sm text-gray-500 mb-8">{description}</p>
            <div className="border-2 border-dashed border-gray-200 rounded-2xl py-16 text-center">
                <MdSettings className="text-5xl text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-400">{title} settings will appear here</p>
            </div>
        </div>
    );
}

/* ══════════════════════════════════════════════════════════
   DETAIL VIEW
══════════════════════════════════════════════════════════ */
function SettingDetailView({ group, activePage, courseSlug, onNavigate, onBack, courseData, setCourseData, onSave, saving, onPublish, onArchive, publishing }) {
    const groupData = SETTINGS_GROUPS.find(g => g.id === group);
    if (!groupData) return null;

    const renderPage = () => {
        switch (activePage) {
            case "branding": return <BrandingPage data={courseData} setData={setCourseData} />;
            case "tags": return <TagsPage data={courseData} setData={setCourseData} />;
            case "authors": return <AuthorsPage courseSlug={courseSlug} course={courseData} data={courseData} setData={setCourseData} />;
            case "faqs": return <FaqsPage data={courseData} setData={setCourseData} />;
            case "pricing": return <PricingPage data={courseData} setData={setCourseData} />;
            case "permissions": return <PermissionsPage data={courseData} setData={setCourseData} />;
            case "reviews": return <FeaturePage title="Reviews & Ratings" desc="Course reviews allow learners to provide feedback and ratings." toggleKey="reviewsEnabled" data={courseData} setData={setCourseData} />;
            case "discussions": return <FeaturePage title="Discussions" desc="Allow learners to create discussions." toggleKey="discussionsEnabled" data={courseData} setData={setCourseData} />;
            case "bookmarks": return <FeaturePage title="Bookmarks" desc="Allow learners to create bookmark lessons." toggleKey="bookmarksEnabled" data={courseData} setData={setCourseData} />;
            case "leaderboard": return <FeaturePage title="Leaderboard" desc="Enable leaderboards to increase competition among learners." toggleKey="leaderboardEnabled" data={courseData} setData={setCourseData} />;
            case "certificates": return <FeaturePage title="Certificates" desc="Enable course certification for your learners." toggleKey="certificatesEnabled" data={courseData} setData={setCourseData} />;
            case "web": return <FeaturePage title="Web" desc="Enable Web" toggleKey="webEnabled" data={courseData} setData={setCourseData} />;
            case "android": return <FeaturePage title="Android" desc="Enable Android" toggleKey="androidEnabled" data={courseData} setData={setCourseData} />;
            case "ios": return <FeaturePage title="iOS" desc="Enable iOS" toggleKey="iosEnabled" data={courseData} setData={setCourseData} />;
            case "publish_course": return <PublishPage data={courseData} onPublish={onPublish} onArchive={onArchive} publishing={publishing} />;
            default: {
                const item = groupData.items.find(i => i.id === activePage);
                return <GenericPage title={item?.label || ""} description={item?.desc || ""} />;
            }
        }
    };

    const noFooterPages = [
        "publish_course", "permissions", "authors",
    ];
    const hasFooter = !noFooterPages.includes(activePage);

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <div className="border-b border-gray-100 px-6 py-3">
                <button onClick={onBack} className="flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-violet-600 transition">
                    <FaChevronLeft className="text-xs" /> Back
                </button>
            </div>

            {/* Tab bar */}
            <div className="border-b border-gray-100 px-6">
                <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
                    {groupData.items.map(item => (
                        <button key={item.id} onClick={() => onNavigate(item.id)}
                            className={`px-4 py-3 text-sm font-semibold transition border-b-2 whitespace-nowrap flex items-center gap-2
                                ${activePage === item.id ? "border-violet-600 text-violet-700" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}
                                ${item.danger ? "text-red-500 hover:text-red-600" : ""}`}>
                            <item.Icon className={`text-base ${activePage === item.id ? "text-violet-600" : ""}`} />
                            {item.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
                <div className="flex-1 overflow-y-auto flex flex-col">
                    <div className="flex-1 px-10 py-8 max-w-full">
                        {renderPage()}
                    </div>
                    {hasFooter && (
                        <div className="border-t border-gray-200 px-10 py-4 flex gap-3 bg-white sticky bottom-0">
                            <button onClick={onSave} disabled={saving}
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
        </div>
    );
}

/* MAIN — Course Settings Dashboard */
export default function CourseSettings({ courseTitle = "Test Course", onBack }) {
    const { courseSlug, page } = useParams();
    const navigate = useNavigate();

    const [search, setSearch] = useState("");
    const [view, setView] = useState(null);

    useEffect(() => {
        if (!page) {
            setView(null);
            return;
        }

        let group = "general";

        if (
            [
                "ratings",
                "reviews",
                "discussions",
                "bookmarks",
                "leaderboard",
                "fast_checkout",
                "certificates",
                "web",
                "android",
                "ios",
            ].includes(page)
        ) {
            group = "features";
        }

        if (
            ["publish_course", "delete_course"].includes(page)
        ) {
            group = "publish";
        }

        setView({
            group,
            page,
        });
    }, [page]);
    const [courseData, setCourseData] = useState({ name: courseTitle, status: "DRAFT" });
    const [saving, setSaving] = useState(false);
    const [publishing, setPublishing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState(null);

    const showToast = (msg, type = "success") => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    /* ── Load course ── */
    useEffect(() => { loadCourse(); }, [courseSlug]);

    const loadCourse = async () => {
        if (!courseSlug) { setLoading(false); return; }
        setLoading(true);
        try {
            console.log("courseSlug =", courseSlug);
            const res = await instructorCourseApi.getInstructorCourseBySlug(courseSlug);
            const course = res?.data?.data ?? res?.data ?? {};
            const settings = course.settings || {};
            const platform = course.platformAvailability || {};
            setCourseData(prev => ({
                ...prev,
                // Basic info
                name: course.title ?? prev.name,
                shortDesc: course.shortDescription ?? "",
                description: course.description ?? "",
                // New fields
                language: course.language ?? "",
                level: course.level ?? "",
                visibility: course.visibility ?? "",
                // Thumbnail
                thumbnailInputType:
                    course.thumbnailInputType ??
                    (course.thumbnailUrl ? "URL" : "FILE_UPLOAD"),
                thumbnailUrl: course.thumbnailUrl ?? "",
                thumbnailFile: null,
                // Promo video
                promoVideoInputType:
                    course.promoVideoInputType ??
                    (course.promoVideoUrl ? "URL" : "FILE_UPLOAD"),
                promoVideoUrl: course.promoVideoUrl ?? "",
                promoVideoFile: null,
                // Legacy fallbacks
                image: course.thumbnailUrl ?? course.imageUrl ?? null,
                video: course.promoVideoUrl ?? course.previewVideoUrl ?? null,
                // Meta
                metaTitle: course.metaTitle ?? "",
                metaDesc: course.metaDescription ?? "",
                metaKeywords: course.metaKeywords ?? "",
                slug: course.slug ?? courseSlug,
                // Lists
                tags: Array.isArray(course.tags)
                    ? course.tags
                    : [],
                authors: course.instructors ?? course.authors ?? [],
                faqs: course.faqs ?? [],
                // Status
                status: course.status ?? "DRAFT",
                // Pricing
                free: course.free ?? false,
                encrypted: course.encrypted ?? false,
                pricingType: course.pricingType || "ONE_TIME_PURCHASE",
                actualPrice: course.actualPrice || 0,
                discountPrice: course.discountPrice || 0,
                lifetimeAccess: course.lifetimeAccess ?? true,
                validityInDays: course.validityInDays || 0,
                offerStartDate: course.offerStartDate || null,
                offerEndDate: course.offerEndDate || null,
                installmentMonths: course.installmentMonths || 0,
                amountPerMonth: course.amountPerMonth || 0,
                // Features — read from backend's nested settings and platformAvailability objects
                reviewsEnabled: settings.reviewsEnabled ?? false,
                discussionsEnabled: settings.discussionsEnabled ?? false,
                bookmarksEnabled: settings.bookmarksEnabled ?? false,
                leaderboardEnabled: settings.leaderboardEnabled ?? false,
                certificatesEnabled: settings.certificatesEnabled ?? false,
                webEnabled: platform.webEnabled ?? false,
                androidEnabled: platform.androidEnabled ?? false,
                iosEnabled: platform.iosEnabled ?? false,

                // Permissions
                sellIndependently: course.sellIndependently ?? true,
                courseAccess: course.courseAccess ?? "public",
                offlineAccess: course.offlineAccess ?? false,
            }));
        } catch (err) {
            console.error("Failed to load course:", err);
            showToast("Failed to load course details.", "error");
        } finally {
            setLoading(false);
        }
    };

    /* ── Save ── */
    const handleSave = async () => {
        if (!courseSlug) { showToast("Missing course slug.", "error"); return; }
        const page = view?.page;
        setSaving(true);
        try {
            let updatedCourse = null;
            switch (page) {
                case "branding": {
                    const fd = new FormData();

                    fd.append("title", courseData.name || "");
                    fd.append("shortDescription", courseData.shortDesc || "");
                    fd.append("description", courseData.description || "");
                    fd.append("language", courseData.language || "");
                    fd.append("level", courseData.level || "");
                    fd.append("visibility", courseData.visibility || "");

                    if (courseData.thumbnailInputType) {
                        fd.append("thumbnailInputType", courseData.thumbnailInputType);
                        if (courseData.thumbnailInputType === "URL") {
                            fd.append("thumbnailUrl", courseData.thumbnailUrl || "");
                        } else {
                            if (courseData.thumbnailFile) fd.append("thumbnailFile", courseData.thumbnailFile);
                        }
                    }

                    if (courseData.promoVideoInputType) {
                        fd.append("promoVideoInputType", courseData.promoVideoInputType);
                        if (courseData.promoVideoInputType === "URL") {
                            fd.append("promoVideoUrl", courseData.promoVideoUrl || "");
                        } else {
                            if (courseData.promoVideoFile) fd.append("promoVideoFile", courseData.promoVideoFile);
                        }
                    }

                    const res = await instructorCourseApi.updateBasicInfoMultipart(courseSlug, fd);
                    updatedCourse = res?.data?.data ?? res?.data;
                    break;
                }
                case "tags": {
                    console.log("Course Slug:", courseSlug);
                    console.log("Request Body:", {
                        tags: courseData.tags,
                    });
                    const res = await instructorCourseApi.updateTags(courseSlug, {
                        tags: courseData.tags,
                    });

                    console.log(res.data);
                    updatedCourse = res?.data?.data ?? res?.data;
                    break;
                }
                case "authors": {
                    const authorIds = (courseData.authors || []).map(a => a.id).filter(Boolean);
                    const res = await instructorCourseApi.updateCourseInstructors(courseSlug, { instructorIds: authorIds });
                    updatedCourse = res?.data?.data ?? res?.data;
                    break;
                }
                case "faqs": {
                    // Force displayOrder for all FAQs to avoid "null value in column display_order" constraint error
                    const formattedFaqs = (courseData.faqs || []).map((faq, index) => ({
                        ...faq,
                        displayOrder: index
                    }));
                    const res = await instructorCourseApi.updateFaqs(courseSlug, { faqs: formattedFaqs });
                    updatedCourse = res?.data?.data ?? res?.data;
                    break;
                }
                case "pricing": {
                    const payload = {
                        pricingPlanId: courseData.pricingPlanId || null,
                        free: courseData.free,
                        pricingType: courseData.free ? "FREE" : (courseData.pricingType || "ONE_TIME_PURCHASE"),
                        actualPrice: courseData.actualPrice || 0,
                        discountPrice: courseData.discountPrice || 0,
                        lifetimeAccess: courseData.lifetimeAccess || false,
                        validityInDays: courseData.validityInDays || 0,
                        offerStartDate: courseData.offerStartDate || null,
                        offerEndDate: courseData.offerEndDate || null,
                        installmentMonths: courseData.installmentMonths || 0,
                        amountPerMonth: courseData.amountPerMonth || 0,
                        encrypted: courseData.encrypted || false,
                    };
                    const res = await instructorCourseApi.updatePricing(courseSlug, payload);
                    updatedCourse = res?.data?.data ?? res?.data;
                    break;
                }
                case "reviews":
                case "discussions":
                case "bookmarks":
                case "leaderboard":
                case "certificates":
                case "web":
                case "android":
                case "ios": {
                    const featuresPayload = {
                        reviewsEnabled: courseData.reviewsEnabled,
                        discussionsEnabled: courseData.discussionsEnabled,
                        bookmarksEnabled: courseData.bookmarksEnabled,
                        leaderboardEnabled: courseData.leaderboardEnabled,
                        certificatesEnabled: courseData.certificatesEnabled,
                        webEnabled: courseData.webEnabled,
                        androidEnabled: courseData.androidEnabled,
                        iosEnabled: courseData.iosEnabled,
                    };
                    console.log("[Features Save] page:", page, "payload:", JSON.stringify(featuresPayload));
                    const res = await instructorCourseApi.updateFeatures(courseSlug, featuresPayload);
                    console.log("[Features Save] response:", JSON.stringify(res?.data));
                    // Merge saved values directly so UI reflects what was saved
                    setCourseData(prev => ({ ...prev, ...featuresPayload }));
                    showToast("Settings saved successfully!");
                    return;
                }
                case "permissions": {
                    const res = await instructorCourseApi.updateBasicInfo(courseSlug, {
                        sellIndependently: courseData.sellIndependently,
                        courseAccess: courseData.courseAccess,
                        offlineAccess: courseData.offlineAccess,
                    });
                    updatedCourse = res?.data?.data ?? res?.data;
                    break;
                }
                default:
                    break;
            }
            showToast("Settings saved successfully!");

            const newSlug = updatedCourse?.slug;
            if (newSlug && newSlug !== courseSlug) {
                if (view?.page) {
                    navigate(`/instructor/section-settings/${newSlug}/${view.page}`, { replace: true });
                } else {
                    navigate(`/instructor/section-settings/${newSlug}`, { replace: true });
                }
            } else {
                await loadCourse();
            }
        } catch (err) {
            console.log("FULL ERROR");
            console.log(err);

            if (axios.isAxiosError(err)) {
                console.log("Axios Error");
                console.log("Status:", err.response?.status);
                console.log("Data:", err.response?.data);
                console.log("URL:", err.config?.url);
            } else {
                console.log("Not an Axios error");
            }
        } finally {
            setSaving(false);
        }
    };

    /* ── Publish / Archive ── */
    const handlePublish = async () => {
        if (!courseSlug) return;
        setPublishing(true);
        try {
            await instructorCourseApi.publishCourse(courseSlug);
            showToast("Course published successfully!");
            await loadCourse();
        } catch (err) {
            showToast(err?.response?.data?.message || "Failed to publish course.", "error");
        } finally {
            setPublishing(false);
        }
    };

    const handleArchive = async () => {
        if (!courseSlug) return;
        if (!window.confirm("Archive this course? It will be hidden from learners.")) return;
        setPublishing(true);
        try {
            await instructorCourseApi.archiveCourse(courseSlug);
            showToast("Course archived.");
            await loadCourse();
        } catch (err) {
            showToast(err?.response?.data?.message || "Failed to archive course.", "error");
        } finally {
            setPublishing(false);
        }
    };

    const handleBack = onBack || (() => navigate(-1));

    const filteredGroups = SETTINGS_GROUPS.map(g => ({
        ...g,
        items: search
            ? g.items.filter(i =>
                i.label.toLowerCase().includes(search.toLowerCase()) ||
                i.desc.toLowerCase().includes(search.toLowerCase()))
            : g.items,
    })).filter(g => g.items.length > 0);

    /* ── Loading spinner ── */
    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <AiOutlineLoading3Quarters className="animate-spin text-violet-500 text-3xl" />
            </div>
        );
    }

    /* ── Detail view ── */
    if (view) {
        return (
            <>
                <Toast msg={toast?.msg} type={toast?.type} onClose={() => setToast(null)} />
                <SettingDetailView
                    group={view.group}
                    activePage={view.page}
                    courseSlug={courseSlug}
                    onNavigate={(page) =>
                        navigate(
                            `/instructor/section-settings/${courseSlug}/${page}`
                        )
                    }
                    onBack={() =>
                        navigate(`/instructor/section-settings/${courseSlug}`)
                    }
                    courseData={courseData}
                    setCourseData={setCourseData}
                    onSave={handleSave}
                    saving={saving}
                    onPublish={handlePublish}
                    onArchive={handleArchive}
                    publishing={publishing}
                />
            </>
        );
    }

    /* ── Dashboard grid ── */
    return (
        <div className="min-h-screen bg-white">
            <Toast msg={toast?.msg} type={toast?.type} onClose={() => setToast(null)} />

            <div className="border-b border-gray-100 px-6 py-3">
                <button onClick={handleBack}
                    className="flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-violet-600 transition">
                    <FaChevronLeft className="text-xs" /> Back
                </button>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-6">
                <h1 className="text-2xl font-black text-gray-800 mb-1">Course Settings</h1>
                <p className="text-sm text-gray-500 mb-8">{courseData.name} — Manage course settings and preferences</p>

                <div className="relative mb-10 max-w-md">
                    <MdSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                    <input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search (alt+k or cmd+k)"
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition"
                    />
                </div>

                {filteredGroups.map(group => (
                    <div key={group.id} className="mb-10">
                        <h2 className="text-sm font-black text-gray-900 mb-1">{group.label}</h2>
                        <p className="text-xs text-gray-500 mb-5">{group.description}</p>
                        <div className="grid grid-cols-3 gap-4">
                            {group.items.map(item => (
                                <button key={item.id}
                                    onClick={() =>
                                        navigate(
                                            `/instructor/section-settings/${courseSlug}/${item.id}`
                                        )
                                    }
                                    className={`flex items-start gap-3 p-4 rounded-xl border text-left hover:shadow-md transition group
                                        ${item.danger
                                            ? "border-red-100 hover:border-red-300 hover:bg-red-50"
                                            : "border-gray-200 hover:border-violet-200 hover:bg-violet-50/30"}`}>
                                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 transition
                                        ${item.danger ? "bg-red-100" : "bg-gray-100 group-hover:bg-violet-100"}`}>
                                        <item.Icon className={`text-sm transition
                                            ${item.danger ? "text-red-500" : "text-gray-500 group-hover:text-violet-600"}`} />
                                    </div>
                                    <div className="min-w-0">
                                        <p className={`text-sm font-bold mb-1 ${item.danger ? "text-red-600" : "text-gray-800"}`}>
                                            {item.label}
                                        </p>
                                        <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">{item.desc}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                ))}

                {filteredGroups.length === 0 && (
                    <div className="text-center py-16">
                        <MdSearch className="text-5xl text-gray-300 mx-auto mb-3" />
                        <p className="text-sm text-gray-400">No settings match "{search}"</p>
                    </div>
                )}
            </div>
        </div>
    );
}