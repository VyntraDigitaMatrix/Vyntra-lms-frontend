import React, { useState, useEffect, useCallback } from "react";
import {
    FaCertificate,
    FaCheckCircle,
    FaHourglassHalf,
    FaTimesCircle,
    FaEye,
    FaSearch,
    FaTimes,
    FaDownload,
    FaRedo,
} from "react-icons/fa";
import { instructorCertificateApi } from "../../students/mockCertificateApi";

/* ── Status → UI mapping ── */
const STATUS_META = {
    APPROVED: { label: "Approved", badgeClass: "bg-green-100 text-green-700", icon: <FaCheckCircle className="text-[10px]" /> },
    PENDING: { label: "Pending", badgeClass: "bg-amber-100 text-amber-700", icon: <FaHourglassHalf className="text-[10px]" /> },
    REJECTED: { label: "Rejected", badgeClass: "bg-red-100 text-red-700", icon: <FaTimesCircle className="text-[10px]" /> },
};

const STATUS_TABS = ["All", "PENDING", "APPROVED", "REJECTED"];
const STATUS_LABELS = { All: "All", PENDING: "Pending", APPROVED: "Approved", REJECTED: "Rejected" };

const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "—";

/* Triggers a browser download of the certificate image */
const downloadCertificate = (item) => {
    if (!item?.imageUrl) return;
    const link = document.createElement("a");
    link.href = item.imageUrl;
    link.download = `${item.certificateNumber || "certificate"}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

/* ── Certificate Detail Modal ── */
const DetailModal = ({ item, onClose, onApprove, onReject, actionLoading }) => {
    if (!item) return null;
    const meta = STATUS_META[item.status] || STATUS_META.PENDING;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                    <h2 className="text-base font-bold text-gray-900">Certificate Detail</h2>
                    <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition text-gray-500">
                        <FaTimes />
                    </button>
                </div>
                <div className="p-5 space-y-3">
                    <div className="flex items-center justify-center py-3 bg-purple-50 rounded-xl mb-1 overflow-hidden">
                        {item.imageUrl ? (
                            <img
                                src={item.imageUrl}
                                alt={item.courseTitle}
                                className="w-full h-44 object-cover rounded-lg"
                            />
                        ) : (
                            <FaCertificate className="text-purple-400 text-5xl py-3" />
                        )}
                    </div>
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${meta.badgeClass}`}>
                        {meta.icon} {meta.label}
                    </span>
                    <div className="space-y-2 text-sm">
                        <div>
                            <p className="text-[11px] text-gray-400">Student</p>
                            <p className="font-semibold text-gray-800">{item.studentName}</p>
                        </div>
                        <div>
                            <p className="text-[11px] text-gray-400">Course</p>
                            <p className="font-medium text-gray-700">{item.courseTitle}</p>
                        </div>
                        <div>
                            <p className="text-[11px] text-gray-400">Certificate Number</p>
                            <p className="font-mono text-xs text-gray-600 break-all">{item.certificateNumber}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <p className="text-[11px] text-gray-400">Requested</p>
                                <p className="text-gray-600">{formatDate(item.createdAt)}</p>
                            </div>
                            {item.approvedAt && (
                                <div>
                                    <p className="text-[11px] text-gray-400">Decided</p>
                                    <p className="text-gray-600">{formatDate(item.approvedAt)}</p>
                                </div>
                            )}
                        </div>
                        {item.approvedByInstructorName && (
                            <div>
                                <p className="text-[11px] text-gray-400">Decided By</p>
                                <p className="text-gray-600">{item.approvedByInstructorName}</p>
                            </div>
                        )}
                    </div>
                </div>

                {item.status === "PENDING" && (
                    <div className="px-5 pb-5 flex gap-3">
                        <button
                            onClick={() => onApprove(item)}
                            disabled={actionLoading}
                            className="flex-1 flex items-center justify-center gap-2 h-10 rounded-xl bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white text-sm font-semibold transition"
                        >
                            <FaCheckCircle className="text-xs" /> Approve
                        </button>
                        <button
                            onClick={() => onReject(item)}
                            disabled={actionLoading}
                            className="flex-1 flex items-center justify-center gap-2 h-10 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-50 text-sm font-semibold transition"
                        >
                            <FaTimesCircle className="text-xs" /> Reject
                        </button>
                    </div>
                )}

                {item.status === "APPROVED" && item.imageUrl && (
                    <div className="px-5 pb-5">
                        <button
                            onClick={() => downloadCertificate(item)}
                            className="w-full flex items-center justify-center gap-2 h-10 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-semibold transition"
                        >
                            <FaDownload className="text-xs" /> Download
                        </button>
                    </div>
                )}

                {item.status === "REJECTED" && (
                    <div className="px-5 pb-5">
                        <button
                            onClick={() => onApprove(item)}
                            disabled={actionLoading}
                            className="w-full flex items-center justify-center gap-2 h-10 rounded-xl border border-purple-200 text-purple-600 hover:bg-purple-50 disabled:opacity-50 text-sm font-semibold transition"
                            title="No dedicated 'reissue' endpoint exists — this re-runs the approve call."
                        >
                            <FaRedo className="text-xs" /> Reissue (Approve Again)
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

/* ══════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════ */
const InstructorCertificates = () => {
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [activeStatus, setActiveStatus] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");

    /* Course-slug lookup — the only way to see APPROVED/REJECTED certs,
       since the "pending" list is the only global endpoint available. */
    const [courseSlug, setCourseSlug] = useState("");
    const [viewMode, setViewMode] = useState("pending"); // "pending" | "course"

    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const PAGE_SIZE = 20;

    const [detailItem, setDetailItem] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [actionError, setActionError] = useState("");

    const fetchCertificates = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const res =
                viewMode === "course" && courseSlug.trim()
                    ? await instructorCertificateApi.getCertificatesByCourse(courseSlug.trim(), currentPage, PAGE_SIZE)
                    : await instructorCertificateApi.getPendingCertificates(currentPage, PAGE_SIZE);

            const pageData = res.data?.data;
            setCertificates(pageData?.content || []);
            setTotalPages(pageData?.totalPages || 0);
        } catch (err) {
            console.error(err);
            setError("Failed to load certificates. Please try again.");
        } finally {
            setLoading(false);
        }
    }, [viewMode, courseSlug, currentPage]);

    useEffect(() => {
        fetchCertificates();
    }, [fetchCertificates]);

    const handleCourseSearch = () => {
        if (!courseSlug.trim()) return;
        setViewMode("course");
        setCurrentPage(0);
    };

    const handleShowPending = () => {
        setViewMode("pending");
        setCourseSlug("");
        setCurrentPage(0);
    };

    const openDetail = async (item) => {
        // The summary list doesn't include approvedAt/approvedByInstructorName —
        // fetch the full record for the modal.
        try {
            const res = await instructorCertificateApi.getCertificateByNumber(item.certificateNumber);
            setDetailItem(res.data?.data || item);
        } catch (err) {
            console.error(err);
            setDetailItem(item);
        }
    };

    /*
     * IMPORTANT: after approving/rejecting we update the item IN PLACE in
     * local state instead of calling fetchCertificates() again.
     *
     * Why: in "pending" view mode, the list is fetched from the
     * pending-only endpoint. The moment a certificate is approved it is
     * no longer PENDING, so re-fetching that endpoint makes it vanish
     * from the list entirely — you'd never see it flip to "Approved"
     * under the Approved tab. Updating locally keeps it visible with
     * its new status until you navigate away or manually refresh.
     */
    const handleApprove = async (item) => {
        setActionLoading(true);
        setActionError("");
        try {
            const res = await instructorCertificateApi.approveCertificate(item.certificateId);
            const updated = res.data?.data;
            setCertificates((prev) =>
                prev.map((c) => (c.certificateId === item.certificateId ? { ...c, ...updated } : c))
            );
            setDetailItem(null);
        } catch (err) {
            console.error(err);
            setActionError(err.response?.data?.message || "Could not approve this certificate.");
        } finally {
            setActionLoading(false);
        }
    };

    const handleReject = async (item) => {
        if (!window.confirm(`Reject the certificate request for ${item.studentName}?`)) return;
        setActionLoading(true);
        setActionError("");
        try {
            const res = await instructorCertificateApi.rejectCertificate(item.certificateId);
            const updated = res.data?.data;
            setCertificates((prev) =>
                prev.map((c) => (c.certificateId === item.certificateId ? { ...c, ...updated } : c))
            );
            setDetailItem(null);
        } catch (err) {
            console.error(err);
            setActionError(err.response?.data?.message || "Could not reject this certificate.");
        } finally {
            setActionLoading(false);
        }
    };

    const filtered = certificates.filter((c) => {
        const matchesStatus = activeStatus === "All" || c.status === activeStatus;
        const q = searchTerm.trim().toLowerCase();
        const matchesSearch =
            !q ||
            c.studentName?.toLowerCase().includes(q) ||
            c.courseTitle?.toLowerCase().includes(q) ||
            c.certificateNumber?.toLowerCase().includes(q);
        return matchesStatus && matchesSearch;
    });

    const stats = {
        total: certificates.length,
        pending: certificates.filter((c) => c.status === "PENDING").length,
        approved: certificates.filter((c) => c.status === "APPROVED").length,
        rejected: certificates.filter((c) => c.status === "REJECTED").length,
    };

    return (
        <div className="p-4 sm:p-6 min-h-screen bg-[#f7f8fc]">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Certificates</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Review and manage student certificate requests.
                    </p>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
                    {[
                        { label: "Loaded", value: stats.total, icon: <FaCertificate className="text-purple-600 text-xl sm:text-2xl" />, bg: "bg-purple-50" },
                        { label: "Pending", value: stats.pending, icon: <FaHourglassHalf className="text-amber-600 text-xl sm:text-2xl" />, bg: "bg-amber-50" },
                        { label: "Approved", value: stats.approved, icon: <FaCheckCircle className="text-green-600 text-xl sm:text-2xl" />, bg: "bg-green-50" },
                        { label: "Rejected", value: stats.rejected, icon: <FaTimesCircle className="text-red-500 text-xl sm:text-2xl" />, bg: "bg-red-50" },
                    ].map((s) => (
                        <div key={s.label} className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3 shadow-sm">
                            <div className={`w-12 h-12 rounded-xl ${s.bg} flex items-center justify-center shrink-0`}>
                                {s.icon}
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-gray-700">{s.label}</p>
                                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 leading-none mt-1">
                                    {loading ? <span className="block w-6 h-6 bg-gray-200 rounded animate-pulse" /> : s.value}
                                </h2>
                            </div>
                        </div>
                    ))}
                </div>

                {/* View mode + search */}
                <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 shadow-sm space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                        <button
                            onClick={handleShowPending}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${viewMode === "pending" ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                        >
                            Pending Requests (global)
                        </button>
                        <span className="text-xs text-gray-400">or look up a specific course:</span>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                        <input
                            type="text"
                            value={courseSlug}
                            onChange={(e) => setCourseSlug(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleCourseSearch()}
                            placeholder="Enter course slug (e.g. seo-and-digital-marketing-essentials)"
                            className="flex-1 h-10 px-3 rounded-lg border border-gray-200 text-sm outline-none focus:border-purple-500"
                        />
                        <button
                            onClick={handleCourseSearch}
                            disabled={!courseSlug.trim()}
                            className="h-10 px-4 rounded-lg bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-sm font-semibold transition flex items-center justify-center gap-2"
                        >
                            <FaSearch className="text-xs" /> View Course Certificates
                        </button>
                    </div>

                    {/* Text filter + status tabs, applied to whatever's loaded */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-2 border-t border-gray-100">
                        <div className="relative flex-1">
                            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Filter by student, course, or certificate #..."
                                className="w-full h-9 pl-8 pr-3 rounded-lg border border-gray-200 text-xs outline-none focus:border-purple-500"
                            />
                        </div>
                        <div className="flex gap-1.5 overflow-x-auto">
                            {STATUS_TABS.map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveStatus(tab)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${activeStatus === tab ? "bg-gray-800 text-white" : "text-gray-500 hover:bg-gray-100"}`}
                                >
                                    {STATUS_LABELS[tab]}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-5 flex items-center justify-between">
                        <p className="text-xs text-red-600 font-semibold">{error}</p>
                        <button onClick={fetchCertificates} className="text-xs text-red-600 font-bold underline">Retry</button>
                    </div>
                )}
                {actionError && (
                    <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-5">
                        <p className="text-xs text-red-600 font-semibold">{actionError}</p>
                    </div>
                )}

                {/* Table — desktop */}
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden hidden md:block">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                <th className="px-4 py-3">Student</th>
                                <th className="px-4 py-3">Course</th>
                                <th className="px-4 py-3">Certificate #</th>
                                <th className="px-4 py-3">Requested</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} className="border-b border-gray-100">
                                        <td colSpan={6} className="px-4 py-4">
                                            <div className="h-4 bg-gray-100 rounded animate-pulse w-full" />
                                        </td>
                                    </tr>
                                ))
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-4 py-12 text-center">
                                        <FaCertificate className="mx-auto text-4xl text-gray-300 mb-3" />
                                        <p className="text-sm font-semibold text-gray-600">No certificates found</p>
                                        <p className="text-xs text-gray-400 mt-1">Try a different course slug or filter.</p>
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((item) => {
                                    const meta = STATUS_META[item.status] || STATUS_META.PENDING;
                                    return (
                                        <tr key={item.certificateId} className="border-b border-gray-100 hover:bg-gray-50 transition">
                                            <td className="px-4 py-3 font-semibold text-gray-800">{item.studentName}</td>
                                            <td className="px-4 py-3 text-gray-600">{item.courseTitle}</td>
                                            <td className="px-4 py-3 font-mono text-xs text-gray-500">{item.certificateNumber}</td>
                                            <td className="px-4 py-3 text-gray-500">{formatDate(item.createdAt)}</td>
                                            <td className="px-4 py-3">
                                                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold ${meta.badgeClass}`}>
                                                    {meta.icon} {meta.label}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <button
                                                        onClick={() => openDetail(item)}
                                                        className="w-8 h-8 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 transition flex items-center justify-center"
                                                        title="View"
                                                    >
                                                        <FaEye className="text-xs" />
                                                    </button>
                                                    <button
                                                        onClick={() => downloadCertificate(item)}
                                                        disabled={!item.imageUrl}
                                                        className={`w-8 h-8 rounded-lg border flex items-center justify-center transition ${item.imageUrl ? "border-gray-200 text-gray-500 hover:bg-gray-100" : "border-gray-100 text-gray-300 cursor-not-allowed"}`}
                                                        title={item.imageUrl ? "Download" : "No certificate file available"}
                                                    >
                                                        <FaDownload className="text-xs" />
                                                    </button>
                                                    {item.status === "REJECTED" && (
                                                        <button
                                                            onClick={() => handleApprove(item)}
                                                            className="w-8 h-8 rounded-lg border border-purple-200 text-purple-600 hover:bg-purple-50 transition flex items-center justify-center"
                                                            title="Reissue (approve again)"
                                                        >
                                                            <FaRedo className="text-xs" />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Cards — mobile */}
                <div className="space-y-3 md:hidden">
                    {loading ? (
                        Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm animate-pulse h-24" />
                        ))
                    ) : filtered.length === 0 ? (
                        <div className="bg-white border border-dashed border-gray-300 rounded-xl p-8 text-center">
                            <FaCertificate className="mx-auto text-3xl text-gray-300 mb-3" />
                            <p className="text-sm font-semibold text-gray-600">No certificates found</p>
                        </div>
                    ) : (
                        filtered.map((item) => {
                            const meta = STATUS_META[item.status] || STATUS_META.PENDING;
                            return (
                                <div key={item.certificateId} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-sm font-bold text-gray-900">{item.studentName}</h3>
                                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold ${meta.badgeClass}`}>
                                            {meta.icon} {meta.label}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-600 mb-1">{item.courseTitle}</p>
                                    <p className="text-[11px] font-mono text-gray-400 mb-1 break-all">{item.certificateNumber}</p>
                                    <p className="text-[11px] text-gray-400 mb-3">Requested {formatDate(item.createdAt)}</p>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => openDetail(item)}
                                            className="flex-1 h-9 rounded-lg border border-gray-200 text-gray-600 text-xs font-semibold flex items-center justify-center gap-1.5"
                                        >
                                            <FaEye className="text-[10px]" /> View
                                        </button>
                                        {item.imageUrl && (
                                            <button
                                                onClick={() => downloadCertificate(item)}
                                                className="flex-1 h-9 rounded-lg border border-gray-200 text-gray-600 text-xs font-semibold flex items-center justify-center gap-1.5"
                                            >
                                                <FaDownload className="text-[10px]" /> Download
                                            </button>
                                        )}
                                        {item.status === "REJECTED" && (
                                            <button
                                                onClick={() => handleApprove(item)}
                                                className="flex-1 h-9 rounded-lg border border-purple-200 text-purple-600 text-xs font-semibold flex items-center justify-center gap-1.5"
                                            >
                                                <FaRedo className="text-[10px]" /> Reissue
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Pagination */}
                {!loading && totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-6">
                        <button
                            onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                            disabled={currentPage === 0}
                            className="h-9 px-3 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                        >
                            Prev
                        </button>
                        <span className="text-xs text-gray-500 font-semibold">
                            Page {currentPage + 1} of {totalPages}
                        </span>
                        <button
                            onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
                            disabled={currentPage === totalPages - 1}
                            className="h-9 px-3 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>

            {detailItem && (
                <DetailModal
                    item={detailItem}
                    onClose={() => setDetailItem(null)}
                    onApprove={handleApprove}
                    onReject={handleReject}
                    actionLoading={actionLoading}
                />
            )}
        </div>
    );
};

export default InstructorCertificates;