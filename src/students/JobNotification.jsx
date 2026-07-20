import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    FaBriefcase, FaMapMarkerAlt, FaClock, FaMoneyBillWave, FaCalendarAlt,
    FaSearch, FaCheckCircle, FaArrowRight, FaArrowLeft, FaCheck,
    FaLink, FaSpinner, FaExclamationCircle, FaListUl, FaFileUpload, FaBuilding,
} from 'react-icons/fa';
import { studentJobApi } from "./auth/api";

const BRAND = "#043573";

const inputCls = 'w-full border border-slate-200 rounded-lg px-3 py-2.5 text-[13.5px] text-slate-800 bg-white outline-none focus:border-[#043573] focus:ring-2 focus:ring-[#043573]/10 transition-all placeholder:text-slate-400';

const Field = ({ label, required = false, children }) => (
    <div>
        <label className="block text-[12.5px] font-medium text-slate-600 mb-1.5">
            {label}{required && <span className="text-red-500 ml-1">*</span>}
        </label>
        {children}
    </div>
);

const Section = ({ title, children }) => (
    <div className="mb-7 last:mb-0">
        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-3">{title}</p>
        {children}
    </div>
);

const STATUS_STYLE = {
    PENDING: "bg-amber-50 text-amber-700",
    ACCEPTED: "bg-emerald-50 text-emerald-700",
    REJECTED: "bg-red-50 text-red-700",
    SHORTLISTED: "bg-blue-50 text-blue-700",
};
const statusStyle = (s) => STATUS_STYLE[s] || "bg-gray-50 text-gray-600";

const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';
const formatDateTime = (d) => d ? new Date(d).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—';
const isDeadlinePassed = (deadline) => deadline ? new Date(deadline) < new Date(new Date().toDateString()) : false;
const initials = (name = '') => name?.charAt(0)?.toUpperCase() || 'J';

/* ─── MY APPLICATIONS PAGE ───────────────────────────────────────────────── */
const MyApplicationsPage = ({ applications, onBack }) => (
    <div className="min-h-screen bg-[#f7f8fc]">
        <div className="sticky top-0 z-10 bg-white border-b border-slate-200 px-6 lg:px-10 py-4 flex items-center gap-3">
            <button onClick={onBack} className="flex items-center gap-2 text-[13px] text-slate-600 hover:text-[#043573] transition-colors font-medium">
                <FaArrowLeft className="text-xs" /> Back to jobs
            </button>
        </div>
        <div className="px-6 lg:px-10 py-8 max-w-6xl mx-auto w-full">
            <h1 className="text-2xl font-bold text-slate-900 mb-6">My Applications</h1>
            {applications.length === 0 ? (
                <div className="bg-white rounded-xl border border-slate-200 p-10 text-center text-slate-500 text-sm">
                    You haven't applied to any jobs yet.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {applications.map(app => (
                        <div key={app.applicationId} className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow flex flex-col h-full">
                            <div className="flex justify-between items-start mb-3">
                                <h3 className="text-[15px] font-bold text-slate-900 leading-tight">{app.jobTitle}</h3>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide flex-shrink-0 ${statusStyle(app.status)}`}>
                                    {app.status || 'PENDING'}
                                </span>
                            </div>
                            <div className="space-y-2 mb-4 flex-1 text-[13px]">
                                <p className="flex justify-between text-slate-600">
                                    <span className="text-slate-400">Applicant:</span>
                                    <span className="font-medium text-slate-800">{app.studentName || '—'}</span>
                                </p>
                                <p className="flex justify-between text-slate-600">
                                    <span className="text-slate-400">Applied on:</span>
                                    <span className="font-medium text-slate-800">{formatDateTime(app.appliedAt || app.createdAt)}</span>
                                </p>
                                {app.resumeUrl && (
                                    <p className="flex justify-between text-slate-600">
                                        <span className="text-slate-400">Resume:</span>
                                        <a href={app.resumeUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 font-medium" style={{ color: BRAND }}>
                                            <FaLink className="text-[10px]" /> View Resume
                                        </a>
                                    </p>
                                )}
                            </div>
                            {app.coverLetter && (
                                <div className="bg-slate-50 rounded-lg p-3 text-[12px] text-slate-600 mt-auto">
                                    <p className="font-semibold text-slate-800 mb-1">Cover Letter</p>
                                    <p className="line-clamp-4 leading-relaxed">{app.coverLetter}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    </div>
);

/* ─── APPLY PAGE ─────────────────────────────────────────────────────────── */
const ApplyPage = ({ job, onBack, onApplied }) => {
    const [error, setError] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [resumeFile, setResumeFile] = useState(null);
    const [cover, setCover] = useState("");

    useEffect(() => { window.scrollTo(0, 0); }, []);

    if (submitted) {
        return (
            <div className="min-h-screen bg-[#f7f8fc] flex flex-col">
                <div className="bg-white border-b border-slate-200 px-6 lg:px-10 py-4 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs text-white flex-shrink-0" style={{ background: BRAND }}>{initials(job.companyName)}</div>
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
                            Your application for <strong className="text-slate-700">{job.title}</strong> at {job.companyName} has been sent.
                        </p>
                        <button onClick={onBack} className="w-full text-white rounded-xl py-3 text-[14px] font-semibold transition-colors" style={{ background: BRAND }}>
                            Back to job listings
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const handleSubmit = async () => {
        setSubmitting(true);
        setError("");
        try {
            const formData = new FormData();
            formData.append("resumeFile", resumeFile);
            await studentJobApi.applyForJob(job.slug, formData, cover);
            setSubmitted(true);
            onApplied?.(job.id);
        } catch (err) {
            console.error("Apply error:", err);
            setError(err?.response?.data?.message || "Failed to submit application. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f7f8fc]">
            <div className="sticky top-0 z-10 bg-white border-b border-slate-200 px-6 lg:px-10 py-4 flex items-center justify-between gap-3">
                <button onClick={onBack} className="flex items-center gap-2 text-[13px] text-slate-600 hover:text-[#043573] transition-colors font-medium">
                    <FaArrowLeft className="text-xs" /> Back to jobs
                </button>
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-[11px] text-white flex-shrink-0" style={{ background: BRAND }}>{initials(job.companyName)}</div>
                    <div className="hidden sm:block">
                        <p className="text-[12.5px] font-semibold text-slate-900 leading-tight">{job.title}</p>
                        <p className="text-[11px] text-slate-500">{job.companyName}</p>
                    </div>
                </div>
            </div>

            <div className="px-6 lg:px-10 py-8 max-w-3xl mx-auto w-full">
                <div className="bg-white rounded-xl border border-slate-200 p-4 mb-5 flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm text-white flex-shrink-0" style={{ background: BRAND }}>{initials(job.companyName)}</div>
                    <div className="flex-1 min-w-0">
                        <p className="text-[13.5px] font-semibold text-slate-900 truncate">{job.title}</p>
                        <div className="flex flex-wrap gap-2 mt-0.5">
                            <span className="text-[12px] text-slate-500">{job.companyName}</span>
                            {job.salary && (<><span className="text-slate-300">·</span><span className="text-[12px] text-slate-500">{job.salary}</span></>)}
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 mb-5">
                    <h2 className="text-[16px] font-bold text-slate-900 mb-1">Submit Application</h2>
                    <p className="text-[13px] text-slate-400 mb-6">Share your resume and a note about why you're a great fit.</p>

                    <div className="space-y-5">
                        <Field label="Resume (PDF, DOCX)" required>
                            <input
                                type="file"
                                accept=".pdf,.doc,.docx"
                                onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-[13.5px] text-slate-800 bg-white outline-none focus:border-[#043573] transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold"
                            />
                        </Field>

                        <Field label="Cover Letter">
                            <textarea
                                value={cover}
                                onChange={e => setCover(e.target.value)}
                                placeholder="Tell us what excites you about this role and what you'd bring to the team…"
                                rows={6}
                                className={`${inputCls} resize-none`}
                            />
                        </Field>

                        <p className="text-[12px] text-slate-400 leading-relaxed pt-2 border-t border-slate-100">
                            By submitting, you confirm all information is accurate and consent to sharing your details with {job.companyName}.
                        </p>
                    </div>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm flex items-center gap-2">
                        <FaExclamationCircle /> {error}
                    </div>
                )}

                <div className="flex items-center justify-between gap-3">
                    <button onClick={onBack} className="flex items-center gap-2 px-5 py-3 text-[13.5px] font-medium text-slate-500 border border-slate-200 rounded-xl hover:border-slate-300 transition-colors bg-white">
                        Cancel
                    </button>
                    <button
                        disabled={submitting || !resumeFile}
                        onClick={handleSubmit}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-[13.5px] font-semibold text-white transition-colors disabled:cursor-not-allowed"
                        style={{ background: !resumeFile ? '#94a3b8' : BRAND }}
                    >
                        {submitting ? (<><FaSpinner className="animate-spin" /> Submitting...</>) : (<><FaFileUpload size={12} /> Submit application</>)}
                    </button>
                </div>
            </div>
        </div>
    );
};

/* ─── DETAIL PAGE — full-screen, two-column layout ───────────────────────── */
const DetailPage = ({ job, onBack, onApply }) => {
    useEffect(() => { window.scrollTo(0, 0); }, []);
    const deadlinePassed = isDeadlinePassed(job.applicationDeadline);

    const facts = [
        { icon: FaMapMarkerAlt, label: 'Location', value: job.location },
        { icon: FaMoneyBillWave, label: 'Salary', value: job.salary || 'Not specified' },
        { icon: FaListUl, label: 'Experience', value: job.experienceLevel },
        { icon: FaCalendarAlt, label: 'Deadline', value: formatDate(job.applicationDeadline), danger: deadlinePassed },
    ];

    return (
        <div className="min-h-screen bg-[#f7f8fc]">
            {/* Sticky top bar spans full width */}
            <div className="sticky top-0 z-10 bg-white border-b border-slate-200 px-6 lg:px-10 py-3.5 flex items-center justify-between gap-3">
                <button onClick={onBack} className="flex items-center gap-2 text-[13px] text-slate-600 hover:text-[#043573] transition-colors font-medium">
                    <FaArrowLeft className="text-xs" /> Back to jobs
                </button>
                <div className="hidden sm:block">
                    {job.applied ? (
                        <button disabled className="flex items-center gap-1.5 bg-green-100 text-green-700 rounded-lg px-4 py-2 text-[13px] font-semibold cursor-not-allowed">
                            <FaCheckCircle className="text-[10px]" /> Applied
                        </button>
                    ) : (
                        <button
                            onClick={() => onApply(job)}
                            disabled={deadlinePassed || !job.active}
                            className="flex items-center gap-1.5 text-white rounded-lg px-5 py-2 text-[13px] font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{ background: BRAND }}
                        >
                            {deadlinePassed ? "Applications closed" : "Quick Apply"} {!deadlinePassed && <FaArrowRight className="text-[10px]" />}
                        </button>
                    )}
                </div>
            </div>

            {/* Full-bleed hero banner */}
            <div className="relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${BRAND} 0%, #0a4d99 100%)` }}>
                <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full bg-white/5" />
                <div className="absolute -bottom-20 left-1/4 w-80 h-80 rounded-full bg-white/[0.04]" />
                <div className="relative px-6 lg:px-10 py-10 max-w-7xl mx-auto">
                    <div className="flex flex-wrap items-start gap-5">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white flex items-center justify-center font-bold text-xl sm:text-2xl flex-shrink-0 shadow-lg" style={{ color: BRAND }}>
                            {initials(job.companyName)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight">{job.title}</h1>
                            <p className="text-blue-100 text-sm sm:text-base font-medium mt-1 flex items-center gap-1.5">
                                <FaBuilding size={12} /> {job.companyName}
                            </p>
                            {!job.active && (
                                <span className="inline-block mt-2 text-[11px] font-semibold text-white/70 bg-white/10 px-2.5 py-1 rounded-full">
                                    This listing is currently inactive
                                </span>
                            )}
                        </div>
                        {job.applied && (
                            <span className="flex-shrink-0 text-xs font-bold px-3 py-1.5 rounded-full bg-white/15 text-white flex items-center gap-1.5">
                                <FaCheckCircle size={11} /> Applied
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Two-column full-width body */}
            <div className="px-6 lg:px-10 py-8 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
                {/* Main content */}
                <div className="space-y-5 min-w-0">
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 lg:p-8">
                        {job.description && (
                            <Section title="About the role">
                                <p className="text-slate-600 text-[14px] leading-relaxed whitespace-pre-wrap">{job.description}</p>
                            </Section>
                        )}
                        {job.requirements && (
                            <Section title="Requirements">
                                <p className="text-slate-600 text-[14px] leading-relaxed whitespace-pre-wrap">{job.requirements}</p>
                            </Section>
                        )}
                        {job.skills?.length > 0 && (
                            <Section title="Skills">
                                <div className="flex flex-wrap gap-2">
                                    {job.skills.map(s => (
                                        <span key={s} className="rounded-lg px-3 py-1.5 text-[13px] font-medium" style={{ background: `${BRAND}0d`, color: BRAND }}>{s}</span>
                                    ))}
                                </div>
                            </Section>
                        )}
                        {job.attachmentUrl && (
                            <div className="pt-6 mt-1 border-t border-slate-100 flex items-center justify-between flex-wrap gap-3">
                                <div>
                                    <h4 className="text-[13px] font-semibold text-slate-800">Job Attachment</h4>
                                    <p className="text-[12px] text-slate-500">Additional details or brochure</p>
                                </div>
                                <a href={job.attachmentUrl} target="_blank" rel="noreferrer"
                                    className="flex items-center gap-2 bg-slate-50 border border-slate-200 text-slate-600 rounded-lg px-4 py-2 text-[12px] font-semibold hover:bg-slate-100 transition-colors">
                                    <FaLink className="text-[10px]" /> View Attachment
                                </a>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sticky sidebar */}
                <div className="space-y-4 lg:sticky lg:top-[76px] lg:self-start">
                    <div className="bg-white rounded-2xl border border-slate-200 p-5">
                        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-4">Job Details</p>
                        <div className="space-y-4">
                            {facts.map(({ icon: Icon, label, value, danger }) => (
                                <div key={label} className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${BRAND}0d` }}>
                                        <Icon className="text-[12px]" style={{ color: BRAND }} />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[11px] text-slate-400 font-medium">{label}</p>
                                        <p className={`text-[13.5px] font-semibold ${danger ? 'text-red-500' : 'text-slate-800'}`}>{value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200 p-5">
                        {job.applied ? (
                            <button disabled className="w-full bg-green-100 text-green-700 rounded-xl py-3 text-[14px] font-semibold flex items-center justify-center gap-2 cursor-not-allowed">
                                <FaCheckCircle className="text-xs" /> Applied
                            </button>
                        ) : (
                            <button
                                onClick={() => onApply(job)}
                                disabled={deadlinePassed || !job.active}
                                className="w-full text-white rounded-xl py-3 text-[14px] font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                style={{ background: BRAND }}
                            >
                                {deadlinePassed ? "Applications closed" : "Quick Apply"} {!deadlinePassed && <FaArrowRight className="text-xs" />}
                            </button>
                        )}
                        <p className="text-[11px] text-slate-400 text-center mt-3 leading-relaxed">
                            {deadlinePassed ? "The application window for this role has closed." : `Applications close on ${formatDate(job.applicationDeadline)}`}
                        </p>
                    </div>
                </div>
            </div>

            {/* Mobile sticky apply bar */}
            <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 z-10">
                {job.applied ? (
                    <button disabled className="w-full bg-green-100 text-green-700 rounded-xl py-3.5 text-[14px] font-semibold flex items-center justify-center gap-2 cursor-not-allowed">
                        <FaCheckCircle className="text-xs" /> Applied
                    </button>
                ) : (
                    <button onClick={() => onApply(job)} disabled={deadlinePassed || !job.active}
                        className="w-full text-white rounded-xl py-3.5 text-[14px] font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                        style={{ background: BRAND }}>
                        {deadlinePassed ? "Applications closed" : "Quick Apply"} {!deadlinePassed && <FaArrowRight className="text-xs" />}
                    </button>
                )}
            </div>
            <div className="sm:hidden h-20" />
        </div>
    );
};

/* ─── MAIN COMPONENT ─────────────────────────────────────────────────────── */
const JobNotification = () => {
    const [view, setView] = useState('list');
    const [selectedJob, setSelectedJob] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [jobs, setJobs] = useState([]);
    const [myApplications, setMyApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchJobs();
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            const res = await studentJobApi.getMyApplications();
            setMyApplications(res.data?.data?.content || []);
        } catch (e) {
            console.error("Failed to fetch applications:", e);
        }
    };

    const fetchJobs = async () => {
        try {
            setLoading(true);
            setError("");
            const res = await studentJobApi.getJobs(0, 50);
            setJobs(res.data?.data?.content || []);
        } catch (err) {
            console.error("Jobs fetch error:", err);
            setError(err?.response?.data?.message || "Failed to load jobs");
        } finally {
            setLoading(false);
        }
    };

    const openDetail = async (job) => {
        try {
            const res = await studentJobApi.getJobBySlug(job.slug);
            const detail = res.data?.data;
            setSelectedJob({ ...detail, applied: job.applied });
            setView("detail");
        } catch (err) {
            console.error("Job detail error:", err);
            setSelectedJob(job);
            setView("detail");
        }
    };

    const openApply = (job) => { setSelectedJob(job); setView('apply'); };
    const goBack = () => setView('list');

    const filteredJobs = jobs.filter(job =>
        searchTerm === '' ||
        job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (view === 'detail' && selectedJob) return <DetailPage job={selectedJob} onBack={goBack} onApply={openApply} />;
    if (view === 'apply' && selectedJob) return (
        <ApplyPage
            job={selectedJob}
            onBack={goBack}
            onApplied={(jobId) => {
                setJobs(prev => prev.map(j => j.id === jobId ? { ...j, applied: true } : j));
                fetchApplications();
            }}
        />
    );
    if (view === 'applications') return <MyApplicationsPage applications={myApplications} onBack={goBack} />;

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen gap-3">
                <FaSpinner className="animate-spin text-3xl" style={{ color: BRAND }} />
                <p className="text-sm text-slate-500">Loading jobs...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen gap-2 text-red-500">
                <FaExclamationCircle className="text-2xl" />
                <p className="text-sm">{error}</p>
            </div>
        );
    }

    return (
        <div className="p-3 sm:p-4 md:p-6 min-h-screen bg-[#f7f8fc]">
            <div className="max-w-7xl mx-auto">
                <p className="text-sm text-gray-400 mb-2">
                    <Link to="/student/dashboard" className="transition" style={{ color: BRAND }}>Dashboard</Link>
                    <span className="mx-2">&gt;</span>
                    <span className="text-gray-600 font-medium">Jobs</span>
                </p>

                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 m-0">Job Opportunities</h1>
                        <p className="text-sm text-gray-500 mt-1">Browse open roles and track your applications</p>
                    </div>

                    {/* Tabs — one click to My Applications, no longer buried */}
                    <div className="flex p-1 bg-white border border-slate-200 rounded-lg">
                        <button
                            onClick={() => setView('list')}
                            className="px-4 py-2 rounded-md text-sm font-semibold transition-all"
                            style={{ background: BRAND, color: 'white' }}
                        >
                            Browse Jobs
                        </button>
                        <button
                            onClick={() => setView('applications')}
                            className="px-4 py-2 rounded-md text-sm font-semibold transition-all text-slate-600 hover:text-slate-900 flex items-center gap-1.5"
                        >
                            My Applications
                            {myApplications.length > 0 && (
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: `${BRAND}15`, color: BRAND }}>
                                    {myApplications.length}
                                </span>
                            )}
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                    {[
                        { label: 'Total Jobs', value: jobs.length, icon: FaBriefcase },
                        { label: 'Applications Sent', value: myApplications.length, icon: FaCheckCircle, onClick: () => setView('applications') },
                    ].map((s, i) => {
                        const Icon = s.icon;
                        return (
                            <div
                                key={i}
                                onClick={s.onClick}
                                className={`bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-shadow ${s.onClick ? 'cursor-pointer' : ''}`}
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-slate-400 text-xs font-medium m-0">{s.label}</p>
                                        <p className="text-slate-900 text-2xl font-bold mt-0.5 m-0">{s.value}</p>
                                    </div>
                                    <div className="rounded-xl p-2.5" style={{ background: `${BRAND}0d` }}>
                                        <Icon className="text-base" style={{ color: BRAND }} />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-3 mb-5">
                    <div className="relative">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                        <input
                            type="text"
                            placeholder="Search by role, company, or location…"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-[13.5px] text-slate-800 bg-white outline-none focus:border-[#043573] focus:ring-2 focus:ring-[#043573]/10 transition-all placeholder:text-slate-400"
                        />
                    </div>
                </div>

                <p className="text-slate-500 text-[13px] mb-3">
                    Showing <span className="font-semibold" style={{ color: BRAND }}>{filteredJobs.length}</span> opportunities
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                    {filteredJobs.length > 0 ? filteredJobs.map(job => {
                        const deadlinePassed = isDeadlinePassed(job.applicationDeadline);
                        return (
                            <div key={job.id} className="bg-white rounded-xl border border-slate-200 hover:shadow-lg transition-all duration-200"
                                onMouseEnter={(e) => e.currentTarget.style.borderColor = BRAND}
                                onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                            >
                                <div className="p-4 sm:p-5">
                                    <div className="flex gap-3 sm:gap-3.5 items-start">
                                        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center font-bold text-[12px] sm:text-[13px] text-white flex-shrink-0" style={{ background: BRAND }}>
                                            {initials(job.companyName)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2 mb-0.5">
                                                <div className="min-w-0 flex-1">
                                                    <h3 className="text-[13.5px] sm:text-[14px] font-semibold text-slate-900 m-0">{job.title}</h3>
                                                    <p className="text-slate-500 text-[12.5px] sm:text-[13px] mt-0.5">{job.companyName}</p>
                                                </div>
                                                {job.applied && (
                                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700 flex-shrink-0 flex items-center gap-1">
                                                        <FaCheckCircle size={9} /> Applied
                                                    </span>
                                                )}
                                            </div>

                                            <div className="flex flex-wrap gap-2 sm:gap-3 my-2">
                                                <span className="flex items-center gap-1 text-[11.5px] sm:text-[12.5px] text-slate-500">
                                                    <FaMapMarkerAlt className="text-slate-400 text-[10px]" />{job.location}
                                                </span>
                                                <span className="flex items-center gap-1 text-[11.5px] sm:text-[12.5px] text-slate-500">
                                                    <FaListUl className="text-slate-400 text-[10px]" />{job.experienceLevel}
                                                </span>
                                                <span className={`flex items-center gap-1 text-[11.5px] sm:text-[12.5px] ${deadlinePassed ? 'text-red-500 font-semibold' : 'text-slate-500'}`}>
                                                    <FaClock className="text-[10px]" />
                                                    {deadlinePassed ? "Deadline passed" : `Apply by ${formatDate(job.applicationDeadline)}`}
                                                </span>
                                                {!job.active && (
                                                    <span className="text-[11px] font-semibold text-gray-400">Inactive</span>
                                                )}
                                            </div>

                                            <div className="h-px bg-slate-100 my-3" />

                                            <div className="flex gap-2 justify-end">
                                                <button
                                                    onClick={() => openDetail(job)}
                                                    className="bg-white text-slate-700 border border-slate-200 rounded-lg px-3 sm:px-3.5 py-1.5 text-[12px] sm:text-[13px] font-medium hover:border-[#043573] hover:text-[#043573] transition-all"
                                                >
                                                    View Details
                                                </button>
                                                {job.applied ? (
                                                    <button disabled className="bg-green-100 text-green-700 rounded-lg px-3 sm:px-4 py-1.5 text-[12px] sm:text-[13px] font-semibold flex items-center gap-1.5 cursor-not-allowed">
                                                        <FaCheckCircle className="text-[10px]" /> Applied
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => openApply(job)}
                                                        disabled={deadlinePassed || !job.active}
                                                        className="text-white rounded-lg px-3 sm:px-4 py-1.5 text-[12px] sm:text-[13px] font-semibold transition-colors flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                                                        style={{ background: BRAND }}
                                                    >
                                                        Quick Apply <FaArrowRight className="text-[9px]" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    }) : (
                        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 py-12 text-center">
                            <FaBriefcase className="text-slate-300 text-3xl mx-auto mb-2.5" />
                            <h3 className="text-slate-600 text-[15px] font-semibold">No roles found</h3>
                            <p className="text-slate-400 text-[13px]">Try a different search term.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default JobNotification;