import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    FaBriefcase, FaMapMarkerAlt, FaClock, FaDollarSign, FaBookmark, FaRegBookmark,
    FaShareAlt, FaUsers, FaCalendarAlt, FaFilter, FaSearch, FaBell, FaCheckCircle,
    FaChartLine, FaBullhorn, FaRocket, FaEnvelope, FaPenFancy, FaArrowRight,
    FaStar, FaChevronDown, FaArrowLeft, FaCheck, FaBuilding, FaGlobe, FaTimes,
    FaWhatsapp, FaLinkedin, FaEnvelope as FaEnvelopeSolid, FaLink, FaCopy,
    FaSlidersH, FaSortAmountDown, FaSortAmountUp
} from 'react-icons/fa';
import { studentJobApi } from "./auth/api";

const badgeConfig = {
    Hot: 'bg-red-50 text-red-600',
    Urgent: 'bg-orange-50 text-orange-600',
    Featured: 'bg-blue-50 text-blue-600',
    New: 'bg-green-50 text-green-600',
};
const badgeDotConfig = {
    Hot: 'bg-red-500', Urgent: 'bg-orange-500', Featured: 'bg-blue-500', New: 'bg-green-500',
};

const inputCls = 'w-full border border-slate-200 rounded-lg px-3 py-2.5 text-[13.5px] text-slate-800 bg-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-slate-400';

const Field = ({ label, required = false, children }) => (
    <div>
        <label className="block text-[12.5px] font-medium text-slate-600 mb-1.5">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        {children}
    </div>
);

const Section = ({ title, children }) => (
    <div className="mb-6">
        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-3">{title}</p>
        {children}
    </div>
);

// Toast notification component
const Toast = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className={`fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg animate-in slide-in-from-right-5 ${
            type === 'success' ? 'bg-green-600 text-white' : 'bg-blue-600 text-white'
        }`}>
            {type === 'success' ? <FaCheckCircle className="text-white" /> : <FaBell className="text-white" />}
            <span className="text-sm font-medium">{message}</span>
            <button onClick={onClose} className="ml-2 hover:opacity-80"><FaTimes className="text-white text-xs" /></button>
        </div>
    );
};

// Share modal component
const ShareModal = ({ job, onClose }) => {
    const [copied, setCopied] = useState(false);
    const shareUrl = `https://careerflow.com/job/${job.id}-${job.title.toLowerCase().replace(/\s+/g, '-')}`;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const shareLinks = [
        { name: 'WhatsApp', icon: FaWhatsapp, color: 'bg-green-500', url: `https://wa.me/?text=${encodeURIComponent(`Check out this job: ${job.title} at ${job.companyName} - ${shareUrl}`)}` },
        { name: 'LinkedIn', icon: FaLinkedin, color: 'bg-blue-700', url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}` },
        { name: 'Email', icon: FaEnvelopeSolid, color: 'bg-gray-600', url: `mailto:?subject=${encodeURIComponent(`Job Opportunity: ${job.title} at ${job.companyName}`)}&body=${encodeURIComponent(`Hi,\n\nCheck out this amazing opportunity:\n\n${job.title} at ${job.companyName}\n${shareUrl}\n\n${job.description}\n\nBest regards!`)}` },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between p-5 border-b border-slate-100">
                    <h3 className="font-bold text-slate-800">Share this job</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors"><FaTimes /></button>
                </div>
                <div className="p-5">
                    <div className="flex items-center gap-3 mb-5 p-3 bg-slate-50 rounded-xl">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-xs ${job.logoColor || 'bg-blue-600'}`}>{job.logo || job.companyName?.charAt(0) || 'J'}</div>
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold text-slate-800 text-sm truncate">{job.title}</p>
                            <p className="text-xs text-slate-500 truncate">{job.companyName}</p>
                        </div>
                    </div>
                    <div className="flex gap-3 mb-5 justify-center">
                        {shareLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`${link.color} w-12 h-12 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform`}
                            >
                                <link.icon size={20} />
                            </a>
                        ))}
                    </div>
                    <div className="flex gap-2">
                        <input type="text" value={shareUrl} readOnly className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600" />
                        <button onClick={copyToClipboard} className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2">
                            {copied ? <FaCheck size={14} /> : <FaCopy size={14} />}
                            {copied ? 'Copied!' : 'Copy'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Filter modal component
const FilterModal = ({ filters, onApply, onClose }) => {
    const [localFilters, setLocalFilters] = useState({
        jobType: filters.jobType || [],
        salaryRange: filters.salaryRange || [],
        sortBy: filters.sortBy || 'match'
    });

    const filterOptions = {
        jobType: ['Full-time', 'Contract', 'Internship'],
        salaryRange: ['₹10L - ₹20L', '₹20L - ₹30L', '₹30L+', 'Internship stipend'],
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 max-h-[90vh] overflow-auto animate-in slide-in-from-bottom-5 duration-200">
                <div className="flex items-center justify-between p-5 border-b border-slate-100 sticky top-0 bg-white">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2"><FaSlidersH size={16} /> Filter Jobs</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><FaTimes /></button>
                </div>
                <div className="p-5 space-y-5">
                    {Object.entries(filterOptions).map(([key, options]) => (
                        <div key={key}>
                            <label className="block text-sm font-semibold text-slate-700 mb-2 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</label>
                            <div className="flex flex-wrap gap-2">
                                {options.map(opt => (
                                    <button
                                        key={opt}
                                        type="button"
                                        onClick={() => {
                                            const current = localFilters[key] || [];
                                            const updated = current.includes(opt) ? current.filter(v => v !== opt) : [...current, opt];
                                            setLocalFilters({ ...localFilters, [key]: updated });
                                        }}
                                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                                            (localFilters[key] || []).includes(opt) 
                                                ? 'bg-blue-600 text-white shadow-md' 
                                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                        }`}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                    <div className="border-t border-slate-100 pt-4">
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Sort by</label>
                        <select 
                            value={localFilters.sortBy} 
                            onChange={e => setLocalFilters({ ...localFilters, sortBy: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                        >
                            <option value="match">Best Match</option>
                            <option value="recent">Most Recent</option>
                            <option value="salary-high">Salary (High to Low)</option>
                            <option value="salary-low">Salary (Low to High)</option>
                        </select>
                    </div>
                </div>
                <div className="p-5 border-t border-slate-100 flex gap-3 sticky bottom-0 bg-white">
                    <button 
                        onClick={() => { 
                            setLocalFilters({ jobType: [], salaryRange: [], sortBy: 'match' });
                            onApply({}); 
                        }} 
                        className="flex-1 px-4 py-2 border border-slate-200 rounded-lg font-medium hover:border-slate-300 transition-colors"
                    >
                        Reset
                    </button>
                    <button 
                        onClick={() => onApply(localFilters)} 
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                        Apply Filters
                    </button>
                </div>
            </div>
        </div>
    );
};

// Notifications panel
const NotificationsPanel = ({ notifications, onClose }) => {
    return (
        <div className="absolute top-12 right-0 w-80 bg-white rounded-xl shadow-2xl border border-slate-100 z-50">
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
                <h3 className="font-bold text-slate-800 flex items-center gap-2"><FaBell size={14} /> Notifications</h3>
                <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><FaTimes size={12} /></button>
            </div>
            <div className="max-h-96 overflow-auto">
                {notifications.length === 0 ? (
                    <div className="p-8 text-center text-slate-400 text-sm">No new notifications</div>
                ) : (
                    notifications.map(notif => (
                        <div key={notif.id} className="p-3 border-b border-slate-50 hover:bg-slate-50 cursor-pointer transition-colors">
                            <p className="text-sm text-slate-700">{notif.message}</p>
                            <p className="text-xs text-slate-400 mt-1">{notif.time}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

/* ─── APPLY PAGE ─────────────────────────────────────────────────────────── */
const STEPS = ['Your info', 'Resume & cover', 'Review'];

const ApplyPage = ({ job, onBack }) => {
    const [error, setError] = useState("");
    const [step, setStep] = useState(0);
    const [submitted, setSubmitted] = useState(false);
    const [form, setForm] = useState({
        name: '', email: '', phone: '', experience: '',
        resume: '', ctc: '', cover: '', startDate: '',
    });

    useEffect(() => { window.scrollTo(0, 0); }, []);

    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

    const validateStep1 = () => {
        if (!form.name || !form.email || !form.phone || !form.experience) {
            setError("Please fill all required fields");
            return false;
        }
        setError("");
        return true;
    };


    if (submitted) {
        return (
            <div className="min-h-screen bg-[#f7f8fc] flex flex-col">
                <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-4 flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs text-white flex-shrink-0 ${job.logoColor || 'bg-blue-600'}`}>{job.logo || job.companyName?.charAt(0) || 'J'}</div>
                    <div>
                        <p className="text-[13px] font-semibold text-slate-900 leading-tight">{job.title}</p>
                        <p className="text-[11.5px] text-slate-500">{job.companyName}</p>
                    </div>
                </div>
                <div className="flex-1 flex items-center justify-center p-6">
                    <div className="text-center max-w-sm">
                        <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
                            <FaCheck className="text-green-500 text-2xl" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 mb-2">Application submitted!</h2>
                        <p className="text-[13.5px] text-slate-500 leading-relaxed mb-6">
                            Your application for <strong className="text-slate-700">{job.title}</strong> at {job.companyName} has been sent. You'll hear back within 5–7 business days.
                        </p>
                        <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6 text-left">
                            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-3">What's next</p>
                            {['Application review (2–3 days)', 'Screening call with HR', 'Technical / case round', 'Final interview & offer'].map((s, i) => (
                                <div key={i} className="flex items-center gap-3 mb-2.5 last:mb-0">
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0 ${i === 0 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>{i + 1}</div>
                                    <span className={`text-[13px] ${i === 0 ? 'text-slate-700 font-medium' : 'text-slate-400'}`}>{s}</span>
                                </div>
                            ))}
                        </div>
                        <button onClick={onBack} className="w-full bg-blue-600 text-white rounded-xl py-3 text-[14px] font-semibold hover:bg-blue-700 transition-colors">
                            Back to job listings
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f7f8fc]">
            <div className="sticky top-0 z-10 bg-white border-b border-slate-200 px-4 sm:px-6 py-3.5 flex items-center justify-between gap-3">
                <button onClick={onBack} className="flex items-center gap-2 text-[13px] text-slate-600 hover:text-blue-600 transition-colors font-medium">
                    <FaArrowLeft className="text-xs" /> Back to jobs
                </button>
                <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-[11px] text-white flex-shrink-0 ${job.logoColor || 'bg-blue-600'}`}>{job.logo || job.companyName?.charAt(0) || 'J'}</div>
                    <div className="hidden sm:block">
                        <p className="text-[12.5px] font-semibold text-slate-900 leading-tight">{job.title}</p>
                        <p className="text-[11px] text-slate-500">{job.companyName}</p>
                    </div>
                </div>
                <div className="text-[12px] text-slate-400">Step {step + 1}/{STEPS.length}</div>
            </div>

            <div className="mx-auto px-4 sm:px-6 py-6 sm:py-10">
                <div className="mb-6 sm:mb-8">
                    <div className="flex items-center justify-between mb-2">
                        {STEPS.map((s, i) => (
                            <div key={i} className="flex items-center gap-1.5">
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-bold transition-all
                                    ${i < step ? 'bg-blue-600 text-white' : i === step ? 'bg-blue-600 text-white ring-4 ring-blue-100' : 'bg-slate-200 text-slate-400'}`}>
                                    {i < step ? <FaCheck className="text-[10px]" /> : i + 1}
                                </div>
                                <span className={`text-[12px] font-medium hidden sm:block ${i === step ? 'text-blue-600' : i < step ? 'text-slate-500' : 'text-slate-300'}`}>{s}</span>
                                {i < STEPS.length - 1 && (
                                    <div className={`h-px w-8 sm:w-16 md:w-24 mx-1 sm:mx-2 transition-colors ${i < step ? 'bg-blue-600' : 'bg-slate-200'}`} />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-4 mb-5 flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm text-white flex-shrink-0 ${job.logoColor || 'bg-blue-600'}`}>{job.logo || job.companyName?.charAt(0) || 'J'}</div>
                    <div className="flex-1 min-w-0">
                        <p className="text-[13.5px] font-semibold text-slate-900 truncate">{job.title}</p>
                        <div className="flex flex-wrap gap-2 mt-0.5">
                            <span className="text-[12px] text-slate-500">{job.companyName}</span>
                            <span className="text-slate-300">·</span>
                            <span className="text-[12px] text-slate-500">{job.salary}</span>
                            <span className="text-slate-300">·</span>
                            <span className={`text-[12px] font-semibold ${job.matchScore > 89 ? 'text-green-600' : 'text-blue-600'}`}>{job.matchScore}% match</span>
                        </div>
                    </div>
                    {job.badge && (
                        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase flex-shrink-0 ${badgeConfig[job.badge]}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${badgeDotConfig[job.badge]}`} />{job.badge}
                        </span>
                    )}
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 mb-5">
                    <h2 className="text-[16px] font-bold text-slate-900 mb-1">{STEPS[step]}</h2>
                    <p className="text-[13px] text-slate-400 mb-5">
                        {step === 0 && 'Tell us a bit about yourself.'}
                        {step === 1 && 'Share your resume and a note about why you\'re a great fit.'}
                        {step === 2 && 'Review your details before submitting.'}
                    </p>

                    {step === 0 && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Field label="Full name">
                                    <input type="text" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Priya Sharma" className={inputCls} required />
                                </Field>
                                <Field label="Email address">
                                    <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="priya@example.com" className={inputCls} required />
                                </Field>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Field label="Phone number">
                                    <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+91 98765 43210" className={inputCls} required />
                                </Field>
                                <Field label="Years of experience">
                                    <select value={form.experience} onChange={e => set('experience', e.target.value)} className={inputCls} required>
                                        <option value="">Select…</option>
                                        {['0–1 year', '1–3 years', '3–5 years', '5–8 years', '8+ years'].map(o => <option key={o}>{o}</option>)}
                                    </select>
                                </Field>
                            </div>
                        </div>
                    )}

                    {step === 1 && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Field label="Resume / LinkedIn URL">
                                    <input type="url" value={form.resume} onChange={e => set('resume', e.target.value)} placeholder="https://linkedin.com/in/yourprofile" className={inputCls} />
                                </Field>
                                <Field label="Current CTC (optional)">
                                    <input type="text" value={form.ctc} onChange={e => set('ctc', e.target.value)} placeholder="e.g. ₹14 LPA" className={inputCls} />
                                </Field>
                            </div>
                            <Field label="Cover note">
                                <textarea value={form.cover} onChange={e => set('cover', e.target.value)}
                                    placeholder="Tell us what excites you about this role and what you'd bring to the team…"
                                    rows={5} className={`${inputCls} resize-none`} />
                            </Field>
                            <Field label="Earliest start date">
                                <input type="date" value={form.startDate} onChange={e => set('startDate', e.target.value)} className={inputCls} />
                            </Field>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {[
                                    { label: 'Name', value: form.name || '—' },
                                    { label: 'Email', value: form.email || '—' },
                                    { label: 'Phone', value: form.phone || '—' },
                                    { label: 'Experience', value: form.experience || '—' },
                                    { label: 'Current CTC', value: form.ctc || '—' },
                                    { label: 'Start date', value: form.startDate ? new Date(form.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—' },
                                ].map(({ label, value }) => (
                                    <div key={label} className="bg-slate-50 rounded-lg px-3.5 py-3">
                                        <p className="text-[11px] text-slate-400 font-medium mb-0.5">{label}</p>
                                        <p className="text-[13px] text-slate-700 font-medium truncate">{value}</p>
                                    </div>
                                ))}
                            </div>
                            {form.resume && (
                                <div className="bg-slate-50 rounded-lg px-3.5 py-3">
                                    <p className="text-[11px] text-slate-400 font-medium mb-0.5">Resume / LinkedIn</p>
                                    <p className="text-[13px] text-blue-600 font-medium truncate">{form.resume}</p>
                                </div>
                            )}
                            {form.cover && (
                                <div className="bg-slate-50 rounded-lg px-3.5 py-3">
                                    <p className="text-[11px] text-slate-400 font-medium mb-1">Cover note</p>
                                    <p className="text-[13px] text-slate-600 leading-relaxed line-clamp-4">{form.cover}</p>
                                </div>
                            )}
                            <p className="text-[12px] text-slate-400 leading-relaxed pt-1">
                                By submitting, you confirm all information is accurate and consent to sharing your details with {job.companyName}.
                            </p>
                        </div>
                    )}
                </div>
                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                <div className="flex items-center justify-between gap-3">
                    {step > 0 ? (
                        <button onClick={() => setStep(s => s - 1)}
                            className="flex items-center gap-2 px-5 py-3 text-[13.5px] font-medium text-slate-600 border border-slate-200 rounded-xl hover:border-blue-400 hover:text-blue-600 transition-colors bg-white">
                            <FaArrowLeft className="text-xs" /> Back
                        </button>
                    ) : (
                        <button onClick={onBack}
                            className="flex items-center gap-2 px-5 py-3 text-[13.5px] font-medium text-slate-500 border border-slate-200 rounded-xl hover:border-slate-300 transition-colors bg-white">
                            Cancel
                        </button>
                    )}
                    <button
                        onClick={() => {
                            if (step === 0) {
                                if (validateStep1()) setStep(1);
                            } else if (step === 1) {
                                setStep(2);
                            } else {
                                setSubmitted(true);
                            }
                        }}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-blue-600 text-white rounded-xl px-6 py-3 text-[13.5px] font-semibold hover:bg-blue-700 transition-colors"
                    >
                        {step === 2 ? 'Submit application' : 'Continue'}
                    </button>
                </div>
            </div>
        </div>
    );
};

/* ─── DETAIL PAGE ────────────────────────────────────────────────────────── */
const DetailPage = ({ job, onBack, onApply }) => {
    useEffect(() => { window.scrollTo(0, 0); }, []);

    return (
        <div className="min-h-screen bg-[#f7f8fc]">
            <div className="sticky top-0 z-10 bg-white border-b border-slate-200 px-4 sm:px-6 py-3.5 flex items-center justify-between gap-3">
                <button onClick={onBack} className="flex items-center gap-2 text-[13px] text-slate-600 hover:text-blue-600 transition-colors font-medium">
                    <FaArrowLeft className="text-xs" /> Back to jobs
                </button>
                <button
                    onClick={() => onApply(job)}
                    className="flex items-center gap-1.5 bg-blue-600 text-white rounded-lg px-4 py-2 text-[13px] font-semibold hover:bg-blue-700 transition-colors"
                >
                    Quick Apply <FaArrowRight className="text-[10px]" />
                </button>
            </div>

            <div className="mx-auto px-4 sm:px-6 py-6 sm:py-8">
                <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-7 mb-4">
                    <div className="flex gap-4 items-start mb-4">
                        <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center font-bold text-base sm:text-lg text-white flex-shrink-0 ${job.logoColor || 'bg-blue-600'}`}>
                            {job.logo || job.companyName?.charAt(0) || 'J'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                                <h1 className="text-[17px] sm:text-[19px] font-bold text-slate-900">{job.title}</h1>
                                {job.badge && (
                                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase ${badgeConfig[job.badge]}`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${badgeDotConfig[job.badge]}`} />{job.badge}
                                    </span>
                                )}
                            </div>
                            <p className="text-slate-600 text-[14px] font-medium">{job.companyName}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                        {[
                            { icon: FaMapMarkerAlt, label: 'Location', value: job.location },
                            { icon: FaDollarSign, label: 'Salary', value: job.salary },
                            { icon: FaBriefcase, label: 'Type', value: job.type || job.experienceLevel },
                            { icon: FaCalendarAlt, label: 'Deadline', value: job.applicationDeadline ? new Date(job.applicationDeadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'Not specified' },
                        ].map(({ icon: Icon, label, value }) => (
                            <div key={label} className="bg-slate-50 rounded-xl p-3">
                                <div className="flex items-center gap-1.5 mb-1">
                                    <Icon className="text-slate-400 text-[11px]" />
                                    <span className="text-[11px] text-slate-400 font-medium">{label}</span>
                                </div>
                                <p className="text-[13px] font-semibold text-slate-700">{value}</p>
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-wrap gap-3 items-center justify-between">
                        <div className="flex flex-wrap gap-1.5">
                            {job.skills?.map(s => (
                                <span key={s} className="bg-blue-50 text-blue-700 rounded-lg px-2.5 py-1 text-xs font-medium">{s}</span>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-7 mb-4">
                    <Section title="About the company">
                        <p className="text-slate-500 text-[13.5px] leading-relaxed">{job.about || job.companyName || 'Leading company in the industry'}</p>
                    </Section>
                    <Section title="About the role">
                        <p className="text-slate-500 text-[13.5px] leading-relaxed">{job.description}</p>
                    </Section>
                    <Section title="Requirements">
                        <ul className="space-y-2.5">
                            {job.requirements ? (
                                typeof job.requirements === 'string' ? (
                                    job.requirements.split('\n').map((r, i) => (
                                        <li key={i} className="flex items-start gap-2.5">
                                            <FaCheckCircle className="text-green-500 text-xs flex-shrink-0 mt-1" />
                                            <span className="text-slate-500 text-[13.5px] leading-relaxed">{r}</span>
                                        </li>
                                    ))
                                ) : (
                                    job.requirements.map((r, i) => (
                                        <li key={i} className="flex items-start gap-2.5">
                                            <FaCheckCircle className="text-green-500 text-xs flex-shrink-0 mt-1" />
                                            <span className="text-slate-500 text-[13.5px] leading-relaxed">{r}</span>
                                        </li>
                                    ))
                                )
                            ) : (
                                <li className="flex items-start gap-2.5">
                                    <FaCheckCircle className="text-green-500 text-xs flex-shrink-0 mt-1" />
                                    <span className="text-slate-500 text-[13.5px] leading-relaxed">{job.requirements || 'No specific requirements listed'}</span>
                                </li>
                            )}
                        </ul>
                    </Section>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-7 mb-6">
                    <Section title="Perks & benefits">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            {job.perks?.map((p, i) => (
                                <div key={i} className="flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-3">
                                    <FaCheckCircle className="text-green-500 text-xs flex-shrink-0" />
                                    <span className="text-[13px] text-slate-600">{p}</span>
                                </div>
                            ))}
                        </div>
                    </Section>
                </div>

                <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 z-10">
                    <button onClick={() => onApply(job)}
                        className="w-full bg-blue-600 text-white rounded-xl py-3.5 text-[14px] font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                        Quick Apply <FaArrowRight className="text-xs" />
                    </button>
                </div>
                <div className="hidden sm:flex items-center justify-between bg-white rounded-2xl border border-slate-200 p-5 sm:p-6">
                    <div>
                        <p className="text-[13.5px] font-semibold text-slate-900">{job.title}</p>
                        <p className="text-[12.5px] text-slate-500">{job.companyName} · {job.salary}</p>
                    </div>
                    <button onClick={() => onApply(job)}
                        className="flex items-center gap-2 bg-blue-600 text-white rounded-xl px-6 py-3 text-[14px] font-semibold hover:bg-blue-700 transition-colors">
                        Quick Apply <FaArrowRight className="text-xs" />
                    </button>
                </div>
                <div className="sm:hidden h-20" />
            </div>
        </div>
    );
};

/* ─── MAIN COMPONENT ─────────────────────────────────────────────────────── */
const JobNotification = () => {
    const [view, setView] = useState('list');
    const [selectedJob, setSelectedJob] = useState(null);
    const [bookmarkedJobs, setBookmarkedJobs] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            setLoading(true);
            const response = await studentJobApi.getJobs(0, 10);
            console.log("Jobs API Response:", response.data);
            
            let jobsData = response.data?.data?.content || response.data?.content || response.data?.data || [];
            
            // Transform API data to match UI expectations
            const transformedJobs = jobsData.map(job => ({
                id: job.id,
                title: job.title,
                companyName: job.companyName,
                company: job.companyName,
                description: job.description,
                requirements: job.requirements,
                location: job.location,
                salary: job.salary,
                experienceLevel: job.experienceLevel,
                type: job.experienceLevel || 'Full-time',
                applicationDeadline: job.applicationDeadline,
                active: job.active,
                // UI-specific fields with defaults
                logoColor: 'bg-blue-600',
                logo: job.companyName?.charAt(0) || 'J',
                badge: job.experienceLevel === 'Internship' ? 'New' : 
                       job.experienceLevel === 'Senior' ? 'Hot' : 
                       job.experienceLevel === 'Mid Level' ? 'Featured' : null,
                matchScore: Math.floor(Math.random() * 30) + 65,
                posted: '2 days ago',
                skills: ['React', 'JavaScript', 'CSS'],
                perks: ['Flexible hours', 'Health insurance', 'Learning stipend'],
                about: `${job.companyName} is a leading technology company focused on delivering innovative solutions.`,
                responsibilities: [
                    'Develop and maintain web applications',
                    'Collaborate with cross-functional teams',
                    'Write clean and scalable code',
                    'Participate in code reviews'
                ],
                category: job.experienceLevel === 'Internship' ? 'internship' : 'paid-media'
            }));
            
            setJobs(transformedJobs);
        } catch (err) {
            console.error("Jobs fetch error:", err);
            setError(err?.response?.data?.message || "Failed to load jobs");
        } finally {
            setLoading(false);
        }
    };
    
    const [showNotifications, setShowNotifications] = useState(false);
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [shareJob, setShareJob] = useState(null);
    const [toast, setToast] = useState(null);
    const [activeFilters, setActiveFilters] = useState({});
    const [notifications, setNotifications] = useState([
        { id: 1, message: 'New Senior Product Manager role matches your profile!', time: '5 min ago', read: false },
        { id: 2, message: 'Your application for GrowthHive Agency was viewed', time: '2 hours ago', read: false },
        { id: 3, message: 'Interview scheduled with BrandNarrative Co.', time: '1 day ago', read: true },
    ]);

    const openDetail = async (job) => {
        try {
            const response = await studentJobApi.getJobById(job.id);
            const jobData = response.data?.data || response.data;
            
            // Transform detail data
            const transformedJob = {
                ...job,
                ...jobData,
                companyName: jobData.companyName || job.companyName,
                description: jobData.description || job.description,
                requirements: jobData.requirements || job.requirements,
                location: jobData.location || job.location,
                salary: jobData.salary || job.salary,
                experienceLevel: jobData.experienceLevel || job.experienceLevel,
                applicationDeadline: jobData.applicationDeadline || job.applicationDeadline
            };
            
            setSelectedJob(transformedJob);
            setView("detail");
        } catch (error) {
            console.error("Job detail error:", error);
            setSelectedJob(job);
            setView("detail");
        }
    };
    
    const openApply = (job) => { setSelectedJob(job); setView('apply'); };
    const goBack = () => { setView('list'); };

    const handleShare = (job, e) => {
        e.stopPropagation();
        setShareJob(job);
    };

    const toggleBookmark = (jobId) => {
        const wasBookmarked = bookmarkedJobs.includes(jobId);
        setBookmarkedJobs(prev => prev.includes(jobId) ? prev.filter(id => id !== jobId) : [...prev, jobId]);
        setToast({
            message: wasBookmarked ? 'Removed from saved jobs' : 'Job saved successfully!',
            type: 'success'
        });
    };

    const handleNotificationClick = () => {
        setShowNotifications(!showNotifications);
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const applyFilters = (filters) => {
        setActiveFilters(filters);
        setShowFilterModal(false);
        if (Object.keys(filters).length > 0 && (filters.jobType?.length > 0 || filters.salaryRange?.length > 0 || filters.sortBy !== 'match')) {
            setToast({ message: 'Filters applied successfully', type: 'success' });
        }
    };

    const getFilteredJobs = () => {
        let filtered = jobs.filter(job => {
            const matchesCategory = selectedCategory === 'all' || job.category === selectedCategory;
            const matchesSearch = searchTerm === '' ||
                job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                job.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                job.skills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
            
            let matchesJobType = true;
            if (activeFilters.jobType && activeFilters.jobType.length > 0) {
                matchesJobType = activeFilters.jobType.includes(job.type);
            }
            
            let matchesSalary = true;
            if (activeFilters.salaryRange && activeFilters.salaryRange.length > 0) {
                const salaryStr = job.salary;
                matchesSalary = activeFilters.salaryRange.some(range => {
                    if (range === 'Internship stipend') return job.type === 'Internship';
                    if (range === '₹10L - ₹20L') return salaryStr.includes('₹10L') || salaryStr.includes('₹12L') || salaryStr.includes('₹16L');
                    if (range === '₹20L - ₹30L') return salaryStr.includes('₹22L') || salaryStr.includes('₹28L');
                    if (range === '₹30L+') return salaryStr.includes('₹35L');
                    return true;
                });
            }
            
            return matchesCategory && matchesSearch && matchesJobType && matchesSalary;
        });
        
        const sortBy = activeFilters.sortBy;
        if (sortBy === 'recent') {
            const order = { '2 hours ago': 1, '1 day ago': 2, '2 days ago': 3, '3 days ago': 4, '5 days ago': 5, '1 week ago': 6 };
            filtered = [...filtered].sort((a, b) => (order[a.posted] || 99) - (order[b.posted] || 99));
        } else if (sortBy === 'salary-high') {
            filtered = [...filtered].sort((a, b) => {
                const getMax = (s) => parseInt(s.match(/₹(\d+)L/)?.[1] || s.match(/₹(\d+)k/)?.[1] || 0);
                return getMax(b.salary) - getMax(a.salary);
            });
        } else if (sortBy === 'salary-low') {
            filtered = [...filtered].sort((a, b) => {
                const getMin = (s) => parseInt(s.match(/₹(\d+)L/)?.[1] || s.match(/₹(\d+)k/)?.[1] || 0);
                return getMin(a.salary) - getMin(b.salary);
            });
        } else {
            filtered = [...filtered].sort((a, b) => b.matchScore - a.matchScore);
        }
        
        return filtered;
    };

    const filteredJobs = getFilteredJobs();

    const categories = [
        { id: 'all', name: 'All Roles', icon: FaBriefcase, count: jobs.length },
        { id: 'paid-media', name: 'Paid Media', icon: FaChartLine, count: jobs.filter(j => j.category === 'paid-media').length },
        { id: 'content', name: 'Content', icon: FaPenFancy, count: jobs.filter(j => j.category === 'content').length },
        { id: 'analytics', name: 'Analytics', icon: FaRocket, count: jobs.filter(j => j.category === 'analytics').length },
        { id: 'email', name: 'Email', icon: FaEnvelope, count: jobs.filter(j => j.category === 'email').length },
        { id: 'internship', name: 'Internships', icon: FaStar, count: jobs.filter(j => j.category === 'internship').length },
    ];

    const stats = [
        { label: 'Total Jobs', value: jobs.length, icon: FaBriefcase, iconColor: 'text-blue-600', iconBg: 'bg-blue-50' },
        { label: 'Applications Sent', value: 12, icon: FaCheckCircle, iconColor: 'text-green-600', iconBg: 'bg-green-50' },
        { label: 'Interviews', value: 3, icon: FaUsers, iconColor: 'text-amber-600', iconBg: 'bg-amber-50' },
        { label: 'Saved Jobs', value: bookmarkedJobs.length, icon: FaBookmark, iconColor: 'text-violet-600', iconBg: 'bg-violet-50' },
    ];

    if (view === 'detail' && selectedJob) return <DetailPage job={selectedJob} onBack={goBack} onApply={openApply} />;
    if (view === 'apply' && selectedJob) return <ApplyPage job={selectedJob} onBack={goBack} />;

    const activeFilterCount = (activeFilters.jobType?.length || 0) + (activeFilters.salaryRange?.length || 0);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen text-red-500">
                {error}
            </div>
        );
    }

    return (
        <div className="p-3 sm:p-5 md:p-6 min-h-screen bg-[#f7f8fc]">
            <div className="max-w-7xl mx-auto">
                <p className="text-sm text-gray-400 mb-2">
                    <Link to="/student/dashboard" className="hover:text-blue-600 transition">Dashboard</Link>
                    <span className="mx-2">&gt;</span>
                    <span className="text-gray-600 font-medium">Job Notifications</span>
                </p>

                <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 m-0">Job Notifications</h1>
                        <p className="text-sm text-gray-500 mt-1">Curated digital marketing roles matched to your profile</p>
                    </div>
                    <div className="relative">
                        <button 
                            onClick={handleNotificationClick}
                            className="bg-white border border-slate-200 rounded-lg w-9 h-9 flex items-center justify-center cursor-pointer hover:border-blue-500 transition-colors relative"
                        >
                            <FaBell className="text-slate-500 text-sm" />
                            {notifications.filter(n => !n.read).length > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                                    {notifications.filter(n => !n.read).length}
                                </span>
                            )}
                        </button>
                        {showNotifications && (
                            <NotificationsPanel 
                                notifications={notifications.filter(n => !n.read).concat(notifications.filter(n => n.read).slice(0, 3))}
                                onClose={() => setShowNotifications(false)}
                            />
                        )}
                    </div>
                </div>

                <div className="rounded-xl p-5 sm:p-6 mb-5 relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-600 to-blue-400">
                    <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full bg-white/5 pointer-events-none" />
                    <div className="absolute -bottom-16 left-1/3 w-60 h-60 rounded-full bg-white/[0.04] pointer-events-none" />
                    <div className="relative z-10 flex items-center justify-between flex-wrap gap-4">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <FaBullhorn className="text-blue-300 text-xs" />
                                <span className="text-blue-200 text-xs font-medium tracking-wider uppercase">Digital Marketing Hub</span>
                            </div>
                            <h2 className="text-lg font-bold text-white m-0">Your Career Opportunities</h2>
                            <p className="text-blue-300 text-xs mt-1 max-w-sm">Roles in SEO, paid media, content & analytics — updated daily.</p>
                        </div>
                        <div className="flex gap-3">
                            {[{ val: jobs.length, label: 'Live Roles' }, { val: '94%', label: 'Top Match' }].map((s, i) => (
                                <div key={i} className="bg-white/10 rounded-xl px-4 sm:px-5 py-3 text-center">
                                    <p className="text-white text-xl font-bold m-0">{s.val}</p>
                                    <p className="text-blue-300 text-[11px] mt-0.5 font-medium uppercase tracking-wider">{s.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
                    {stats.map((s, i) => {
                        const Icon = s.icon;
                        return (
                            <div key={i} className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-slate-400 text-xs font-medium m-0">{s.label}</p>
                                        <p className="text-slate-900 text-2xl font-bold mt-0.5 m-0">{s.value}</p>
                                    </div>
                                    <div className={`${s.iconBg} rounded-xl p-2.5`}>
                                        <Icon className={`${s.iconColor} text-base`} />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-3 mb-4">
                    <div className="flex gap-2.5 flex-wrap">
                        <div className="flex-1 min-w-48 relative">
                            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                            <input
                                type="text"
                                placeholder="Search by role, company, or skill…"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-[13.5px] text-slate-800 bg-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-slate-400"
                            />
                        </div>
                        <button 
                            onClick={() => setShowFilterModal(true)}
                            className="flex items-center gap-1.5 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg font-medium text-[13px] text-slate-600 hover:border-blue-400 hover:text-blue-600 transition-colors relative"
                        >
                            <FaFilter className="text-[11px]" /> Filter 
                            {activeFilterCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                                    {activeFilterCount}
                                </span>
                            )}
                            <FaChevronDown className="text-[10px]" />
                        </button>
                    </div>
                    {activeFilterCount > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3 pt-2 border-t border-slate-100">
                            {activeFilters.jobType?.map(v => (
                                <span key={v} className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                                    {v}
                                    <button onClick={() => {
                                        const newFilters = { ...activeFilters };
                                        newFilters.jobType = newFilters.jobType.filter(x => x !== v);
                                        if (newFilters.jobType.length === 0) delete newFilters.jobType;
                                        setActiveFilters(newFilters);
                                    }}><FaTimes size={10} /></button>
                                </span>
                            ))}
                            {activeFilters.salaryRange?.map(v => (
                                <span key={v} className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                                    {v}
                                    <button onClick={() => {
                                        const newFilters = { ...activeFilters };
                                        newFilters.salaryRange = newFilters.salaryRange.filter(x => x !== v);
                                        if (newFilters.salaryRange.length === 0) delete newFilters.salaryRange;
                                        setActiveFilters(newFilters);
                                    }}><FaTimes size={10} /></button>
                                </span>
                            ))}
                            <button onClick={() => setActiveFilters({})} className="text-xs text-slate-400 hover:text-red-500">Clear all</button>
                        </div>
                    )}
                </div>

                <div className="overflow-x-auto mb-4">
                    <div className="flex gap-2 min-w-max pb-0.5">
                        {categories.map(cat => {
                            const Icon = cat.icon;
                            const isActive = selectedCategory === cat.id;
                            return (
                                <button
                                    key={cat.id}
                                    onClick={() => setSelectedCategory(cat.id)}
                                    className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[13px] font-medium border whitespace-nowrap cursor-pointer transition-all
                                        ${isActive ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-500 border-slate-200 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50'}`}
                                >
                                    <Icon size={12} />
                                    {cat.name}
                                    <span className={`rounded px-1.5 py-px text-[11px] font-semibold ${isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                        {cat.count}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="flex items-center justify-between mb-3">
                    <p className="text-slate-500 text-[13px]">
                        Showing <span className="text-blue-600 font-semibold">{filteredJobs.length}</span> opportunities
                    </p>
                    <p className="text-slate-400 text-xs">Sorted by: <span className="text-slate-600 font-medium">
                        {activeFilters.sortBy === 'recent' ? 'Most Recent' : 
                         activeFilters.sortBy === 'salary-high' ? 'Salary (High-Low)' :
                         activeFilters.sortBy === 'salary-low' ? 'Salary (Low-High)' : 'Best Match'}
                    </span></p>
                </div>

                <div className="flex flex-col gap-3">
                    {filteredJobs.length > 0 ? filteredJobs.map(job => {
                        const isBookmarked = bookmarkedJobs.includes(job.id);
                        return (
                            <div key={job.id} className="bg-white rounded-xl border border-slate-200 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-px transition-all duration-200">
                                <div className="p-4 sm:p-5">
                                    <div className="flex gap-3 sm:gap-3.5 items-start">
                                        <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center font-bold text-[12px] sm:text-[13px] text-white flex-shrink-0 ${job.logoColor}`}>
                                            {job.logo}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2 mb-0.5">
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <h3 className="text-[13.5px] sm:text-[14px] font-semibold text-slate-900 m-0">{job.title}</h3>
                                                        {job.badge && (
                                                            <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] sm:text-[11px] font-semibold uppercase ${badgeConfig[job.badge]}`}>
                                                                <span className={`w-1.5 h-1.5 rounded-full ${badgeDotConfig[job.badge]}`} />{job.badge}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-slate-500 text-[12.5px] sm:text-[13px] mt-0.5">{job.companyName}</p>
                                                </div>
                                                <div className="flex gap-1.5 flex-shrink-0">
                                                    <button
                                                        onClick={() => toggleBookmark(job.id)}
                                                        className={`w-8 h-8 flex items-center justify-center rounded-lg border cursor-pointer transition-all
                                                            ${isBookmarked ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-blue-500 hover:bg-blue-50'}`}
                                                    >
                                                        {isBookmarked ? <FaBookmark className="text-blue-600 text-xs" /> : <FaRegBookmark className="text-slate-400 text-xs" />}
                                                    </button>
                                                    <button 
                                                        onClick={(e) => handleShare(job, e)}
                                                        className="w-8 h-8 hidden sm:flex items-center justify-center rounded-lg border border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition-all"
                                                    >
                                                        <FaShareAlt className="text-slate-400 text-xs" />
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap gap-2 sm:gap-3 my-2">
                                                <span className="flex items-center gap-1 text-[11.5px] sm:text-[12.5px] text-slate-500">
                                                    <FaMapMarkerAlt className="text-slate-400 text-[10px]" />{job.location}
                                                </span>
                                                <span className="flex items-center gap-1 text-[11.5px] sm:text-[12.5px] text-slate-500">
                                                    <FaClock className="text-slate-400 text-[10px]" />{job.posted}
                                                </span>
                                                <span className="flex items-center gap-1 text-[11.5px] sm:text-[12.5px] text-slate-500">
                                                    <FaDollarSign className="text-slate-400 text-[10px]" />{job.salary}
                                                </span>
                                                <span className="bg-blue-50 text-blue-600 rounded-full px-2.5 py-px text-[11px] sm:text-[11.5px] font-medium">{job.type}</span>
                                            </div>

                                            <p className="text-slate-500 text-[12.5px] sm:text-[13px] leading-relaxed mb-2.5 line-clamp-2">{job.description}</p>

                                            <div className="flex flex-wrap gap-1.5 mb-3">
                                                {job.skills.map(skill => (
                                                    <span key={skill} className="bg-blue-50 text-blue-700 rounded px-2 py-0.5 text-[11px] sm:text-xs font-medium">{skill}</span>
                                                ))}
                                            </div>

                                            <div className="h-px bg-slate-100 my-3" />

                                            <div className="flex items-center justify-between flex-wrap gap-2">
                                                <div className="hidden sm:flex items-center gap-4">
                                                    <span className="flex items-center gap-1 text-[12px] text-blue-600 font-medium">
                                                        <FaCalendarAlt className="text-[10px]" />
                                                        Apply by {job.applicationDeadline ? new Date(job.applicationDeadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'Not specified'}
                                                    </span>
                                                </div>

                                                <div className="flex gap-2 ml-auto sm:ml-0">
                                                    <button
                                                        onClick={() => openDetail(job)}
                                                        className="bg-white text-slate-700 border border-slate-200 rounded-lg px-3 sm:px-3.5 py-1.5 text-[12px] sm:text-[13px] font-medium hover:border-blue-500 hover:text-blue-600 transition-all"
                                                    >
                                                        View Details
                                                    </button>
                                                    <button
                                                        onClick={() => openApply(job)}
                                                        className="bg-blue-600 text-white rounded-lg px-3 sm:px-4 py-1.5 text-[12px] sm:text-[13px] font-semibold hover:bg-blue-700 transition-colors flex items-center gap-1.5"
                                                    >
                                                        Quick Apply <FaArrowRight className="text-[9px]" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    }) : (
                        <div className="bg-white rounded-xl border border-slate-200 py-12 text-center">
                            <FaBullhorn className="text-slate-300 text-3xl mx-auto mb-2.5" />
                            <h3 className="text-slate-600 text-[15px] font-semibold">No roles found</h3>
                            <p className="text-slate-400 text-[13px]">Try adjusting your search or filter.</p>
                        </div>
                    )}
                </div>
            </div>

            {showFilterModal && (
                <FilterModal 
                    filters={activeFilters}
                    onApply={applyFilters}
                    onClose={() => setShowFilterModal(false)}
                />
            )}
            {shareJob && (
                <ShareModal 
                    job={shareJob}
                    onClose={() => setShareJob(null)}
                />
            )}
            {toast && (
                <Toast 
                    message={toast.message} 
                    type={toast.type} 
                    onClose={() => setToast(null)} 
                />
            )}
        </div>
    );
};

export default JobNotification;