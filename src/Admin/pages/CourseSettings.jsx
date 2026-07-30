import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
    adminCourseApi,
    adminPricingApi,
} from "../auth/api";
import { FaChevronLeft, FaPlus, FaTrash, FaSave } from "react-icons/fa";

const CourseSettings = () => {
    const { courseSlug } = useParams();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("basic-info");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [plans, setPlans] = useState([]);

    // Tab states
    const [basicInfo, setBasicInfo] = useState({
        title: "", shortDescription: "", description: "", language: "ENGLISH", level: "BEGINNER", visibility: "PUBLIC",
        thumbnailInputType: "URL", thumbnailUrl: "", promoVideoInputType: "URL", promoVideoUrl: ""
    });
    
    const [pricing, setPricing] = useState({
        free: false, pricingPlanId: "", pricingType: "FREE", actualPrice: 0, discountPrice: 0,
        lifetimeAccess: true, validityInDays: 0, offerStartDate: "", offerEndDate: "", installmentMonths: 0, amountPerMonth: 0
    });

    const [features, setFeatures] = useState({
        reviewsEnabled: true, discussionsEnabled: true, bookmarksEnabled: true, leaderboardEnabled: true,
        certificatesEnabled: true, ratingsEnabled: true, webEnabled: true, androidEnabled: true, iosEnabled: true
    });

    const [faqs, setFaqs] = useState([]);
    const [tags, setTags] = useState([]);
    const [newTag, setNewTag] = useState("");

    useEffect(() => {
        loadData();
    }, [courseSlug]);

    const loadData = async () => {
        try {
            setLoading(true);
            const res = await adminCourseApi.getCourseBySlug(courseSlug);
            const data = res.data?.data;
            setCourse(data);
            
            // Populate states
            if (data) {
                setBasicInfo({
                    title: data.title || "",
                    shortDescription: data.shortDescription || "",
                    description: data.description || "",
                    language: data.language || "ENGLISH",
                    level: data.level || "BEGINNER",
                    visibility: data.visibility || "PUBLIC",
                    thumbnailInputType: "URL",
                    thumbnailUrl: data.thumbnailUrl || "",
                    promoVideoInputType: "URL",
                    promoVideoUrl: data.promoVideoUrl || ""
                });

                if (data.pricingPlan) {
                    setPricing({
                        free: data.free || false,
                        pricingPlanId: data.pricingPlan.id || "",
                        pricingType: data.pricingType || "FREE",
                        actualPrice: data.actualPrice || 0,
                        discountPrice: data.discountPrice || 0,
                        lifetimeAccess: data.lifetimeAccess !== false,
                        validityInDays: data.validityInDays || 0,
                        offerStartDate: data.offerStartDate || "",
                        offerEndDate: data.offerEndDate || "",
                        installmentMonths: data.installmentMonths || 0,
                        amountPerMonth: data.amountPerMonth || 0
                    });
                }

                if (data.settings) {
                    setFeatures({
                        ...data.settings,
                        ...(data.platformAvailability || {})
                    });
                }

                setFaqs(data.faqs || []);
                setTags(data.tags || []);
            }

            const plansRes = await adminPricingApi.getPricingPlans();
            setPlans(plansRes.data?.data?.content || plansRes.data?.data || []);

        } catch (err) {
            console.error(err);
            setError("Failed to load course details.");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSubmitting(true);
        setError("");
        setSuccess("");
        try {
            if (activeTab === "basic-info") {
                await adminCourseApi.updateBasicInfo(courseSlug, basicInfo);
            } else if (activeTab === "pricing") {
                await adminCourseApi.updatePricing(courseSlug, pricing);
            } else if (activeTab === "features") {
                await adminCourseApi.updateFeatures(courseSlug, features);
            } else if (activeTab === "faqs") {
                await adminCourseApi.updateFaqs(courseSlug, { faqs: faqs.map((f, i) => ({ ...f, displayOrder: i })) });
            } else if (activeTab === "tags") {
                await adminCourseApi.updateTags(courseSlug, { tags });
            }
            setSuccess("Saved successfully!");
            setTimeout(() => setSuccess(""), 3000);
            loadData();
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Failed to save changes.");
        } finally {
            setSubmitting(false);
        }
    };

    const handlePublish = async () => {
        if (!window.confirm("Publish this course?")) return;
        try {
            await adminCourseApi.publishCourse(courseSlug);
            alert("Course published!");
            loadData();
        } catch (err) {
            alert(err.response?.data?.message || "Failed to publish");
        }
    };

    const handleArchive = async () => {
        if (!window.confirm("Archive this course?")) return;
        try {
            await adminCourseApi.archiveCourse(courseSlug);
            alert("Course archived!");
            loadData();
        } catch (err) {
            alert(err.response?.data?.message || "Failed to archive");
        }
    };

    if (loading) return <div className="p-10 text-center">Loading course settings...</div>;
    if (!course) return <div className="p-10 text-center text-red-500">Course not found!</div>;

    const tabs = [
        { id: "basic-info", label: "Basic Info" },
        { id: "pricing", label: "Pricing" },
        { id: "features", label: "Features" },
        { id: "faqs", label: "FAQs" },
        { id: "tags", label: "Tags" },
    ];

    return (
        <div className="min-h-screen bg-[#f7f8fc] pb-10">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
                <div className="max-w-6xl mx-auto px-5 py-4">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <Link to="/admin/all-courses" className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50">
                                <FaChevronLeft size={12} />
                            </Link>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">{course.title}</h1>
                                <p className="text-sm text-gray-500 flex items-center gap-2">
                                    Course Settings • <span className={`px-2 py-0.5 rounded text-xs font-bold ${course.status === 'PUBLISHED' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>{course.status}</span>
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button onClick={handleArchive} className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">Archive</button>
                            <button onClick={handlePublish} className="px-4 py-2 text-sm font-semibold text-white bg-[#2BB2A9] rounded-lg hover:bg-[#2BB2A9]/90">Publish Course</button>
                        </div>
                    </div>
                    
                    {/* Tabs Navigation */}
                    <div className="flex items-center gap-1 overflow-x-auto">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-4 py-2.5 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${activeTab === tab.id ? 'border-[#2BB2A9] text-[#2BB2A9]' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-5 mt-8">
                {error && <div className="mb-4 p-3 bg-red-50 text-red-600 border border-red-100 rounded-lg text-sm">{error}</div>}
                {success && <div className="mb-4 p-3 bg-green-50 text-green-600 border border-green-100 rounded-lg text-sm">{success}</div>}

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    {/* BASIC INFO TAB */}
                    {activeTab === "basic-info" && (
                        <div className="space-y-5">
                            <h2 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-2">Basic Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Course Title</label>
                                    <input type="text" value={basicInfo.title} onChange={e => setBasicInfo({ ...basicInfo, title: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-[#2BB2A9]" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
                                    <textarea rows={2} value={basicInfo.shortDescription} onChange={e => setBasicInfo({ ...basicInfo, shortDescription: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-[#2BB2A9]" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Description</label>
                                    <textarea rows={5} value={basicInfo.description} onChange={e => setBasicInfo({ ...basicInfo, description: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-[#2BB2A9]" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                                    <select value={basicInfo.language} onChange={e => setBasicInfo({ ...basicInfo, language: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-[#2BB2A9]">
                                        <option value="ENGLISH">English</option>
                                        <option value="HINDI">Hindi</option>
                                        <option value="SPANISH">Spanish</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
                                    <select value={basicInfo.level} onChange={e => setBasicInfo({ ...basicInfo, level: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-[#2BB2A9]">
                                        <option value="BEGINNER">Beginner</option>
                                        <option value="INTERMEDIATE">Intermediate</option>
                                        <option value="ADVANCED">Advanced</option>
                                    </select>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Thumbnail URL</label>
                                    <input type="text" value={basicInfo.thumbnailUrl} onChange={e => setBasicInfo({ ...basicInfo, thumbnailUrl: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-[#2BB2A9]" />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* PRICING TAB */}
                    {activeTab === "pricing" && (
                        <div className="space-y-5">
                            <h2 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-2">Pricing Settings</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Select Pricing Plan</label>
                                    <select value={pricing.pricingPlanId} onChange={e => {
                                        const planId = e.target.value;
                                        const plan = plans.find(p => p.id === planId);
                                        setPricing({
                                            ...pricing,
                                            pricingPlanId: planId,
                                            pricingType: plan ? plan.pricingType : "FREE",
                                            free: plan ? plan.pricingType === "FREE" : true,
                                            actualPrice: plan ? (plan.actualPrice || 0) : 0,
                                            discountPrice: plan ? (plan.discountPrice || 0) : 0,
                                        });
                                    }} className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-[#2BB2A9]">
                                        <option value="">-- Choose Plan --</option>
                                        {plans.map(p => <option key={p.id} value={p.id}>{p.planTitle}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Pricing Type</label>
                                    <input type="text" readOnly value={pricing.pricingType} className="w-full border border-gray-200 bg-gray-50 rounded-lg px-3 py-2 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Is Free?</label>
                                    <input type="text" readOnly value={pricing.free ? "Yes" : "No"} className="w-full border border-gray-200 bg-gray-50 rounded-lg px-3 py-2 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Actual Price</label>
                                    <input type="number" readOnly={pricing.free} value={pricing.actualPrice} onChange={e => setPricing({...pricing, actualPrice: parseFloat(e.target.value)})} className={`w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-[#2BB2A9] ${pricing.free ? 'bg-gray-50' : ''}`} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Discount Price</label>
                                    <input type="number" readOnly={pricing.free} value={pricing.discountPrice} onChange={e => setPricing({...pricing, discountPrice: parseFloat(e.target.value)})} className={`w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-[#2BB2A9] ${pricing.free ? 'bg-gray-50' : ''}`} />
                                </div>
                                <div className="flex items-center gap-2 mt-4">
                                    <input type="checkbox" id="lifetime" checked={pricing.lifetimeAccess} onChange={e => setPricing({...pricing, lifetimeAccess: e.target.checked})} className="w-4 h-4 text-[#2BB2A9] rounded" />
                                    <label htmlFor="lifetime" className="text-sm font-medium text-gray-700">Lifetime Access</label>
                                </div>
                                {!pricing.lifetimeAccess && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Validity (Days)</label>
                                        <input type="number" value={pricing.validityInDays} onChange={e => setPricing({...pricing, validityInDays: parseInt(e.target.value)})} className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-[#2BB2A9]" />
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* FEATURES TAB */}
                    {activeTab === "features" && (
                        <div className="space-y-5">
                            <h2 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-2">Features & Platform Availability</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {Object.keys(features).map(key => (
                                    <div key={key} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg bg-gray-50">
                                        <span className="text-sm font-medium text-gray-700">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" checked={features[key]} onChange={e => setFeatures({...features, [key]: e.target.checked})} />
                                            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#2BB2A9]"></div>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* FAQS TAB */}
                    {activeTab === "faqs" && (
                        <div className="space-y-5">
                            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                                <h2 className="text-lg font-bold text-gray-800">Frequently Asked Questions</h2>
                                <button onClick={() => setFaqs([...faqs, { question: "", answer: "" }])} className="text-sm text-[#2BB2A9] font-medium flex items-center gap-1 hover:underline"><FaPlus size={10} /> Add FAQ</button>
                            </div>
                            
                            {faqs.length === 0 ? (
                                <p className="text-sm text-gray-500 text-center py-6">No FAQs added yet.</p>
                            ) : (
                                <div className="space-y-4">
                                    {faqs.map((faq, idx) => (
                                        <div key={idx} className="p-4 border border-gray-200 rounded-xl relative bg-gray-50">
                                            <button onClick={() => setFaqs(faqs.filter((_, i) => i !== idx))} className="absolute top-3 right-3 text-red-500 hover:text-red-700">
                                                <FaTrash size={14} />
                                            </button>
                                            <div className="space-y-3 mr-6">
                                                <input placeholder="Question" type="text" value={faq.question} onChange={e => {
                                                    const newFaqs = [...faqs];
                                                    newFaqs[idx].question = e.target.value;
                                                    setFaqs(newFaqs);
                                                }} className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-[#2BB2A9] text-sm font-medium text-gray-800" />
                                                <textarea placeholder="Answer" rows={2} value={faq.answer} onChange={e => {
                                                    const newFaqs = [...faqs];
                                                    newFaqs[idx].answer = e.target.value;
                                                    setFaqs(newFaqs);
                                                }} className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-[#2BB2A9] text-sm text-gray-600" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* TAGS TAB */}
                    {activeTab === "tags" && (
                        <div className="space-y-5">
                            <h2 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-2">Course Tags</h2>
                            
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                if(newTag.trim() && !tags.includes(newTag.trim())) {
                                    setTags([...tags, newTag.trim()]);
                                    setNewTag("");
                                }
                            }} className="flex items-center gap-2">
                                <input type="text" placeholder="Add a new tag..." value={newTag} onChange={e => setNewTag(e.target.value)} className="flex-1 border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-[#2BB2A9] text-sm" />
                                <button type="submit" className="px-4 py-2 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-800">Add</button>
                            </form>

                            <div className="flex flex-wrap gap-2 mt-4">
                                {tags.map((tag, idx) => (
                                    <div key={idx} className="flex items-center gap-2 bg-[#2BB2A9]/10 text-[#2BB2A9] px-3 py-1.5 rounded-full text-sm font-medium border border-[#2BB2A9]/20">
                                        {tag}
                                        <button onClick={() => setTags(tags.filter((_, i) => i !== idx))} className="hover:text-red-500 font-bold">&times;</button>
                                    </div>
                                ))}
                                {tags.length === 0 && <p className="text-sm text-gray-500 w-full">No tags added yet.</p>}
                            </div>
                        </div>
                    )}

                    {/* SAVE BUTTON */}
                    <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
                        <button 
                            onClick={handleSave} 
                            disabled={submitting}
                            className="flex items-center gap-2 px-6 py-2.5 bg-[#2BB2A9] hover:bg-[#2BB2A9]/90 text-white font-bold rounded-lg transition shadow-sm disabled:opacity-70"
                        >
                            {submitting ? "Saving..." : <><FaSave /> Save Changes</>}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseSettings;
