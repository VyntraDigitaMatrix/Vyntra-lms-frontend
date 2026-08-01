import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
    FaCertificate,
    FaCheckCircle,
    FaHourglassHalf,
    FaTimesCircle,
    FaShareAlt,
    FaEye,
    FaTimes,
    FaCopy,
    FaSpinner,
} from "react-icons/fa";
import { MdOutlineVerified } from "react-icons/md";
import { studentCertificateApi } from "../students/mockCertificateApi";
import { studentEnrolledCourseApi } from "./auth/api";
import CertificateView, { buildCertData } from "../Instructor/pages/CertificateView";

const BRAND = "#043573";
const GOLD = "#F5A623";

const STATUS_META = {
    APPROVED: {
        label: "Approved",
        badgeClass: "bg-green-100 text-green-700",
        icon: <MdOutlineVerified className="text-[10px] sm:text-xs" />,
    },
    PENDING: {
        label: "Pending Review",
        badgeClass: "bg-blue-100 text-blue-700",
        icon: <FaHourglassHalf className="text-[10px] sm:text-xs" />,
    },
    REJECTED: {
        label: "Rejected",
        badgeClass: "bg-red-100 text-red-700",
        icon: <FaTimesCircle className="text-[10px] sm:text-xs" />,
    },
};

const TABS = ["All", "APPROVED", "PENDING", "REJECTED"];
const TAB_LABELS = { All: "All Certificates", APPROVED: "Approved", PENDING: "Pending", REJECTED: "Rejected" };

const formatDate = (d) =>
    d
        ? new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
        : "";

/* ── Preview Modal — shows the REAL rendered certificate once approved ── */
const PreviewModal = ({ item, onClose, onShare }) => {
    if (!item) return null;
    const meta = STATUS_META[item.status] || STATUS_META.PENDING;
    const isApproved = item.status === "APPROVED";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
            <div
                className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                    <h2 className="text-base font-bold text-gray-900">Certificate Details</h2>
                    <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition text-gray-500">
                        <FaTimes />
                    </button>
                </div>
                <div className="p-5 space-y-3">
                    <div className="flex items-center justify-center py-3 bg-purple-50 rounded-xl mb-1 overflow-hidden">
                        {isApproved ? (
                            <CertificateView certData={buildCertData(item)} previewWidth={340} />
                        ) : (
                            <FaCertificate className="text-purple-400 text-5xl py-3" />
                        )}
                    </div>
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${meta.badgeClass}`}>
                        {meta.icon} {meta.label}
                    </span>
                    <div className="space-y-2 text-sm">
                        <div>
                            <p className="text-[11px] text-gray-400">Course</p>
                            <p className="font-semibold text-gray-800">{item.courseTitle}</p>
                        </div>
                        <div>
                            <p className="text-[11px] text-gray-400">Student</p>
                            <p className="font-medium text-gray-700">{item.studentName}</p>
                        </div>
                        <div>
                            <p className="text-[11px] text-gray-400">Certificate Number</p>
                            <p className="font-mono text-xs text-gray-600 break-all">{item.certificateNumber}</p>
                        </div>
                        <div>
                            <p className="text-[11px] text-gray-400">Requested</p>
                            <p className="text-gray-600">{formatDate(item.createdAt)}</p>
                        </div>
                    </div>
                </div>
                {isApproved && (
                    <div className="px-5 pb-5">
                        <button
                            onClick={() => onShare(item)}
                            className="w-full flex items-center justify-center gap-2 h-10 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-semibold transition"
                        >
                            <FaShareAlt className="text-xs" /> Share
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

/* ── Share Modal ── */
const ShareModal = ({ item, onClose }) => {
    if (!item) return null;
    const shareUrl = `https://yourplatform.com/verify/${item.certificateNumber}`;
    const [copied, setCopied] = useState(false);

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
            <div
                className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                    <h2 className="text-base font-bold text-gray-900">Share Certificate</h2>
                    <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition text-gray-500">
                        <FaTimes />
                    </button>
                </div>
                <div className="p-5 space-y-4">
                    <p className="text-sm text-gray-500">
                        Share your <span className="font-semibold text-gray-700">{item.courseTitle}</span> certificate via the link below.
                    </p>
                    <div className="flex items-center gap-2">
                        <input
                            readOnly
                            value={shareUrl}
                            className="flex-1 text-xs border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50 text-gray-600 outline-none"
                        />
                        <button
                            onClick={copy}
                            className={`px-4 py-2.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${copied ? "bg-green-600 text-white" : "bg-purple-600 text-white hover:bg-purple-700"}`}
                        >
                            <FaCopy className="text-[10px]" /> {copied ? "Copied!" : "Copy"}
                        </button>
                    </div>
                    <div className="flex gap-2 pt-1">
                        {["LinkedIn", "Twitter", "Facebook"].map(platform => (
                            <button key={platform}
                                onClick={() => {
                                    const urls = {
                                        LinkedIn: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
                                        Twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent("I just earned a certificate in " + item.courseTitle + "!")}`,
                                        Facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
                                    };
                                    window.open(urls[platform], "_blank");
                                }}
                                className="flex-1 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition"
                            >
                                {platform}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

/* ── Request Certificate Panel ── */
const RequestCertificatePanel = ({ existingCourseIds, onRequested }) => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [requestingId, setRequestingId] = useState(null);
    const [requestError, setRequestError] = useState("");

    const USE_MOCK_DATA = true;
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                if (USE_MOCK_DATA) {
                    await sleep(300);
                    setCourses([
                        { id: "course-005", courseId: "course-005", slug: "advanced-javascript", title: "Advanced JavaScript", progressPercentage: 100 },
                        { id: "course-006", courseId: "course-006", slug: "ui-ux-design-basics", title: "UI/UX Design Basics", progressPercentage: 100 },
                    ]);
                    return;
                }
                const res = await studentEnrolledCourseApi.getMyEnrolledCourses(0, 50);
                if (res.data?.success) {
                    setCourses(res.data.data?.content || []);
                }
            } catch (err) {
                console.error("getMyEnrolledCourses:", err);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const getSlug = (c) => c.slug || c.courseSlug || c.id || c.courseId;
    const getProgress = (c) => c.progressPercentage ?? c.progress ?? c.completionPercentage ?? 0;
    const getId = (c) => c.id || c.courseId;

    const eligibleCourses = courses.filter(
        (c) => getProgress(c) >= 100 && !existingCourseIds.has(getId(c))
    );

    const handleRequest = async (course) => {
        const slug = getSlug(course);
        setRequestingId(getId(course));
        setRequestError("");
        try {
            if (USE_MOCK_DATA) {
                await sleep(500);
                setCourses((prev) => prev.filter((c) => getId(c) !== getId(course)));
                onRequested();
                return;
            }
            const res = await studentCertificateApi.requestCertificate(slug);
            if (res.data?.success) {
                onRequested();
            } else {
                setRequestError(res.data?.message || "Failed to request certificate.");
            }
        } catch (err) {
            console.error("requestCertificate:", err);
            setRequestError(err.response?.data?.message || "Failed to request certificate.");
        } finally {
            setRequestingId(null);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center gap-2 text-sm text-gray-400 py-4">
                <FaSpinner className="animate-spin" /> Checking eligible courses...
            </div>
        );
    }

    if (eligibleCourses.length === 0) {
        return null;
    }

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 mb-6">
            <h3 className="text-sm font-bold text-gray-800 mb-1">Eligible for a certificate</h3>
            <p className="text-xs text-gray-400 mb-4">You've completed these courses — request your certificate below.</p>
            {requestError && (
                <div className="mb-3 px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600">
                    {requestError}
                </div>
            )}
            <div className="space-y-2">
                {eligibleCourses.map((course) => (
                    <div key={getId(course)} className="flex items-center justify-between gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2.5 min-w-0">
                            <span className="text-sm font-medium text-gray-700 truncate">{course.title || course.courseTitle}</span>
                        </div>
                        <button
                            onClick={() => handleRequest(course)}
                            disabled={requestingId === getId(course)}
                            className="flex-shrink-0 flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-lg text-white transition disabled:opacity-60"
                            style={{ background: BRAND }}
                        >
                            {requestingId === getId(course) ? "Requesting..." : "Request Certificate"}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

/* ── Main Component ── */
const Certificate = () => {
    const [activeTab, setActiveTab] = useState("All");
    const [previewItem, setPreviewItem] = useState(null);
    const [shareItem, setShareItem] = useState(null);

    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const PAGE_SIZE = 10;

    /* ── Request-a-certificate form ── */
    const [requestSlug, setRequestSlug] = useState("");
    const [requesting, setRequesting] = useState(false);
    const [requestError, setRequestError] = useState("");

    const existingCourseIds = useMemo(
        () => new Set(certificates.map((c) => c.courseId || c.courseSlug || c.slug).filter(Boolean)),
        [certificates]
    );

    /* GET /api/student/certificates */
    const fetchCertificates = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const res = await studentCertificateApi.getMyCertificates(currentPage, PAGE_SIZE);
            const pageData = res.data?.data;
            setCertificates(pageData?.content || []);
            setTotalPages(pageData?.totalPages || 0);
        } catch (err) {
            console.error(err);
            setError("Failed to load your certificates. Please try again.");
        } finally {
            setLoading(false);
        }
    }, [currentPage]);

    useEffect(() => { fetchCertificates(); }, [fetchCertificates]);

    /* POST /api/student/certificates/{courseSlug}/request */
    const handleRequestCertificate = async () => {
        const slug = requestSlug.trim();
        if (!slug) return;

        setRequesting(true);
        setRequestError("");
        try {
            await studentCertificateApi.requestCertificate(slug);
            setRequestSlug("");
            fetchCertificates();
        } catch (err) {
            console.error(err);
            setRequestError(err.response?.data?.message || "Could not request a certificate for that course.");
        } finally {
            setRequesting(false);
        }
    };

    const filteredCertificates =
        activeTab === "All"
            ? certificates
            : certificates.filter((item) => item.status === activeTab);

    const stats = {
        total: certificates.length,
        approved: certificates.filter(c => c.status === "APPROVED").length,
        pending: certificates.filter(c => c.status === "PENDING").length,
        rejected: certificates.filter(c => c.status === "REJECTED").length,
    };

    return (
        <div className="p-4 sm:p-6 md:p-8 min-h-screen bg-slate-50/60 max-w-7xl mx-auto space-y-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/70 shadow-xs">
                    <p className="text-xs text-slate-400 mb-1 flex items-center gap-1.5 font-medium">
                        <Link to="/student/dashboard" className="hover:text-[#043573] transition">Dashboard</Link>
                        <span>&gt;</span>
                        <span className="text-slate-700 font-semibold">Certificates</span>
                    </p>
                    <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">My Certificates</h1>
                    <p className="text-xs text-slate-500 mt-1">
                        Track certificates you've requested and their approval status.
                    </p>
                </div>

                {/* Request a certificate */}
                <div className="bg-white border border-slate-200/70 rounded-2xl p-5 shadow-xs">
                    <p className="text-xs font-bold text-slate-800 mb-2">Request a certificate manually</p>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <input
                            type="text"
                            value={requestSlug}
                            onChange={(e) => setRequestSlug(e.target.value)}
                            placeholder="Enter the course slug (e.g. seo-and-digital-marketing-essentials)"
                            className="flex-1 h-11 px-4 rounded-xl border border-slate-200 text-xs font-medium outline-none focus:border-[#043573] bg-slate-50/50"
                        />
                        <button
                            onClick={handleRequestCertificate}
                            disabled={!requestSlug.trim() || requesting}
                            className="h-11 px-6 rounded-xl bg-[#043573] hover:bg-blue-900 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                        >
                            {requesting ? "Requesting…" : "Request Certificate"}
                        </button>
                    </div>
                    {requestError && <p className="text-xs text-rose-600 font-medium mt-2">{requestError}</p>}
                    <p className="text-[11px] text-slate-400 font-medium mt-2">
                        You can only request a certificate for a course you've completed. Course completion is normally where you'd trigger this — this box is here as a manual fallback.
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-5 sm:mb-6">
                    {[
                        { label: "Total Certificates", value: stats.total, icon: <FaCertificate className="text-purple-600 text-lg sm:text-2xl" />, bg: "bg-purple-50" },
                        { label: "Approved", value: stats.approved, icon: <FaCheckCircle className="text-green-600 text-lg sm:text-2xl" />, bg: "bg-green-50" },
                        { label: "Pending Review", value: stats.pending, icon: <FaHourglassHalf className="text-blue-600 text-lg sm:text-2xl" />, bg: "bg-blue-50" },
                        { label: "Rejected", value: stats.rejected, icon: <FaTimesCircle className="text-red-500 text-lg sm:text-2xl" />, bg: "bg-red-50" },
                    ].map(s => (
                        <div key={s.label} className="bg-white border border-gray-200 rounded-xl p-3 sm:p-4 flex items-center gap-2 sm:gap-4 shadow-sm hover:shadow-md transition">
                            <div className="w-12 h-12 sm:w-[58px] sm:h-[58px] rounded-xl flex items-center justify-center shrink-0" style={{ background: s.bg }}>
                                {s.icon}
                            </div>
                            <div>
                                <p className="text-[10px] sm:text-sm font-semibold text-gray-700 leading-tight">{s.label}</p>
                                <h2 className="text-lg sm:text-2xl font-bold text-gray-900 leading-none mt-1 sm:mt-2">
                                    {loading ? <span className="block w-6 h-6 bg-gray-200 rounded animate-pulse" /> : s.value}
                                </h2>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Request panel — only renders if eligible courses exist */}
                <RequestCertificatePanel existingCourseIds={existingCourseIds} onRequested={fetchCertificates} />

                {/* Tabs */}
                <div className="flex items-center gap-4 sm:gap-6 md:gap-10 border-b border-gray-200 pb-2 sm:pb-3 mb-5 sm:mb-6 overflow-x-auto">
                    {TABS.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className="font-semibold text-xs sm:text-sm pb-2 sm:pb-3 whitespace-nowrap border-b-2 transition"
                            style={activeTab === tab ? { color: BRAND, borderColor: BRAND } : { color: '#6b7280', borderColor: 'transparent' }}
                        >
                            {TAB_LABELS[tab]}
                        </button>
                    ))}
                </div>

                {/* Error state */}
                {error && (
                    <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-5 flex items-center justify-between">
                        <p className="text-xs text-red-600 font-semibold">{error}</p>
                        <button onClick={fetchCertificates} className="text-xs text-red-600 font-bold underline">Retry</button>
                    </div>
                )}

                {/* Certificate Cards */}
                <div className="space-y-3 sm:space-y-4">
                    {loading ? (
                        Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm animate-pulse h-24" />
                        ))
                    ) : filteredCertificates.length > 0 ? (
                        filteredCertificates.map((item) => {
                            const meta = STATUS_META[item.status] || STATUS_META.PENDING;
                            return (
                                <div key={item.certificateId} className="bg-white border border-gray-200 rounded-xl p-3 sm:p-4 shadow-sm hover:shadow-md transition">
                                    <div className="flex flex-col lg:flex-row lg:items-center gap-3 sm:gap-4">

                                        {/* Left */}
                                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 flex-1">
                                            <div
                                                className="w-full sm:w-[150px] h-[100px] rounded-xl border border-gray-200 shrink-0 overflow-hidden bg-purple-50 cursor-pointer hover:opacity-90 transition flex items-center justify-center"
                                                onClick={() => setPreviewItem(item)}
                                                title="Click to view details"
                                            >
                                                <FaCertificate className="text-purple-300 text-3xl" />
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                                                    <h2 className="text-sm sm:text-base font-bold text-gray-900 leading-tight">{item.courseTitle}</h2>
                                                    <span className={`inline-flex items-center gap-1 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold ${meta.badgeClass}`}>
                                                        {meta.icon} {meta.label}
                                                    </span>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-[11px] sm:text-xs text-gray-500">
                                                        <span className="font-semibold text-gray-700">Requested on:</span> {formatDate(item.createdAt)}
                                                    </p>
                                                    <p className="text-[11px] sm:text-xs text-gray-500 break-all">
                                                        <span className="font-semibold text-gray-700">Certificate #:</span> {item.certificateNumber}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right: Actions */}
                                        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto mt-2 lg:mt-0">
                                            <button
                                                onClick={() => setPreviewItem(item)}
                                                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 text-xs sm:text-sm h-9 sm:h-[38px] px-3 sm:px-5 rounded-xl border border-purple-600 text-purple-600 font-semibold hover:bg-purple-50 transition"
                                            >
                                                <FaEye className="text-[10px]" /> View
                                            </button>
                                            {item.status === "APPROVED" && (
                                                <button
                                                    onClick={() => setShareItem(item)}
                                                    className="w-9 h-9 sm:w-[38px] sm:h-[38px] rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-100 transition flex items-center justify-center"
                                                    title="Share"
                                                >
                                                    <FaShareAlt className="text-xs" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="bg-white border border-dashed border-gray-300 rounded-xl p-8 sm:p-14 text-center shadow-sm">
                            <FaCertificate className="mx-auto text-3xl sm:text-5xl text-gray-300 mb-3 sm:mb-4" />
                            <h2 className="text-lg sm:text-2xl font-bold text-gray-700">No Certificates Found</h2>
                            <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">
                                {activeTab === "All"
                                    ? "You haven't requested any certificates yet."
                                    : "There are no certificates in this section."}
                            </p>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {!loading && totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-8">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                            disabled={currentPage === 0}
                            className="h-9 px-3 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                        >
                            Prev
                        </button>
                        <span className="text-xs text-gray-500 font-semibold">
                            Page {currentPage + 1} of {totalPages}
                        </span>
                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
                            disabled={currentPage === totalPages - 1}
                            className="h-9 px-3 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>

            {/* Modals */}
            {previewItem && (
                <PreviewModal item={previewItem} onClose={() => setPreviewItem(null)} onShare={(it) => setShareItem(it)} />
            )}
            {shareItem && (
                <ShareModal item={shareItem} onClose={() => setShareItem(null)} />
            )}
        </div>
    );
};

export default Certificate;