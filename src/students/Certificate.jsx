import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
    FaCertificate, FaCheckCircle, FaHourglassHalf, FaTimesCircle,
    FaDownload, FaEye, FaTimes, FaSpinner, FaExclamationCircle,
    FaGraduationCap, FaUserTie, FaCalendarAlt, FaHashtag,
} from "react-icons/fa";
import { MdOutlineVerified } from "react-icons/md";
import { studentCertificateApi, studentEnrolledCourseApi } from "./auth/api";
import logoFull from "../assets/logo-plain.jpg";
import logoMark from "../assets/logo.jpg.jpeg";

const BRAND = "#043573";
const GOLD = "#F5A623";

// ─── Toggle this to switch between mock data and the real API ──────────────
const USE_MOCK_DATA = true;

const MOCK_CERTIFICATES = [
    {
        certificateId: "cert-001",
        certificateNumber: "VYNTRA-FSD-2026-001",
        courseId: "course-001",
        courseTitle: "Full Stack Web Development",
        studentName: "Kammari Harika",
        status: "APPROVED",
        createdAt: "2026-06-10T10:00:00",
        issuedAt: "2026-06-15T10:00:00",
        approvedByInstructorName: "Ravi Teja",
    },
    {
        certificateId: "cert-002",
        certificateNumber: "VYNTRA-DM-2026-002",
        courseId: "course-002",
        courseTitle: "Digital Marketing Fundamentals",
        studentName: "Kammari Harika",
        status: "PENDING",
        createdAt: "2026-07-18T10:00:00",
        issuedAt: null,
        approvedByInstructorName: null,
    },
    {
        certificateId: "cert-003",
        certificateNumber: "VYNTRA-PY-2026-003",
        courseId: "course-003",
        courseTitle: "Python Programming",
        studentName: "Kammari Harika",
        status: "REJECTED",
        createdAt: "2026-07-10T10:00:00",
        issuedAt: null,
        approvedByInstructorName: null,
    },
    {
        certificateId: "cert-004",
        certificateNumber: "VYNTRA-SEO-2026-004",
        courseId: "course-004",
        courseTitle: "SEO & Keyword Research",
        studentName: "Kammari Harika",
        status: "APPROVED",
        createdAt: "2026-05-01T10:00:00",
        issuedAt: "2026-05-04T10:00:00",
        approvedByInstructorName: "Ananya Rao",
    },
];

// Detail-level mock, keyed by certificateNumber — used by the modal since the
// real getCertificate() endpoint returns a richer object than the list does.
const MOCK_CERTIFICATE_DETAILS = {
    "VYNTRA-FSD-2026-001": {
        certificateId: "cert-001",
        certificateNumber: "VYNTRA-FSD-2026-001",
        studentId: "student-001",
        studentCode: "STU-AAD1DD6C",
        studentName: "Kammari Harika",
        courseId: "course-001",
        courseCode: "COURSE-FSD01",
        courseTitle: "Full Stack Web Development",
        status: "APPROVED",
        approvedByInstructorCode: "INS-001",
        approvedByInstructorName: "Ravi Teja",
        approvedAt: "2026-06-14T10:00:00",
        issuedAt: "2026-06-15T10:00:00",
        requested: true,
    },
    "VYNTRA-DM-2026-002": {
        certificateId: "cert-002",
        certificateNumber: "VYNTRA-DM-2026-002",
        studentId: "student-001",
        studentCode: "STU-AAD1DD6C",
        studentName: "Kammari Harika",
        courseId: "course-002",
        courseCode: "COURSE-DM02",
        courseTitle: "Digital Marketing Fundamentals",
        status: "PENDING",
        approvedByInstructorCode: null,
        approvedByInstructorName: null,
        approvedAt: null,
        issuedAt: null,
        requested: true,
    },
    "VYNTRA-PY-2026-003": {
        certificateId: "cert-003",
        certificateNumber: "VYNTRA-PY-2026-003",
        studentId: "student-001",
        studentCode: "STU-AAD1DD6C",
        studentName: "Kammari Harika",
        courseId: "course-003",
        courseCode: "COURSE-PY03",
        courseTitle: "Python Programming",
        status: "REJECTED",
        approvedByInstructorCode: null,
        approvedByInstructorName: null,
        approvedAt: null,
        issuedAt: null,
        requested: true,
    },
    "VYNTRA-SEO-2026-004": {
        certificateId: "cert-004",
        certificateNumber: "VYNTRA-SEO-2026-004",
        studentId: "student-001",
        studentCode: "STU-AAD1DD6C",
        studentName: "Kammari Harika",
        courseId: "course-004",
        courseCode: "COURSE-SEO04",
        courseTitle: "SEO & Keyword Research",
        status: "APPROVED",
        approvedByInstructorCode: "INS-002",
        approvedByInstructorName: "Ananya Rao",
        approvedAt: "2026-05-03T10:00:00",
        issuedAt: "2026-05-04T10:00:00",
        requested: true,
    },
};

// Mock "eligible for certificate" courses — used by RequestCertificatePanel
const MOCK_ELIGIBLE_COURSES = [
    { id: "course-005", courseId: "course-005", slug: "advanced-javascript", title: "Advanced JavaScript", progressPercentage: 100 },
    { id: "course-006", courseId: "course-006", slug: "ui-ux-design-basics", title: "UI/UX Design Basics", progressPercentage: 100 },
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '—';

const STATUS_CONFIG = {
    PENDING: { label: "Pending Approval", icon: FaHourglassHalf, badge: "bg-amber-50 text-amber-700 border-amber-200", dot: "bg-amber-500" },
    APPROVED: { label: "Approved", icon: FaCheckCircle, badge: "bg-emerald-50 text-emerald-700 border-emerald-200", dot: "bg-emerald-500" },
    REJECTED: { label: "Rejected", icon: FaTimesCircle, badge: "bg-red-50 text-red-700 border-red-200", dot: "bg-red-500" },
};
const statusConfig = (s) => STATUS_CONFIG[s] || { label: s || "Unknown", icon: FaCertificate, badge: "bg-gray-50 text-gray-600 border-gray-200", dot: "bg-gray-400" };

/* ── The actual certificate artwork — built since the API has no image field ── */
const CertificateArtwork = ({ cert }) => (
    <div
        id="certificate-artwork"
        className="relative w-full aspect-[1.414/1] bg-white rounded-2xl overflow-hidden shadow-inner"
        style={{ border: `10px solid ${BRAND}` }}
    >
        <div
            className="absolute inset-3 border-2 rounded-xl"
            style={{ borderColor: GOLD }}
        />

        <img
            src={logoMark}
            alt=""
            className="absolute top-1/2 left-1/2 w-96 h-96 -translate-x-1/2 -translate-y-1/2 opacity-[0.05] pointer-events-none object-contain"
        />

        <div className="relative h-full flex flex-col items-center justify-center text-center px-10 sm:px-16 py-8">
            <img src={logoFull} alt="Vyntra One" className="h-8 sm:h-20 mb-6 object-contain" />

            <p className="text-[10px] sm:text-xs font-semibold tracking-[0.3em] uppercase" style={{ color: GOLD }}>
                Certificate of Completion
            </p>

            <p className="text-xs sm:text-sm text-slate-400 mt-6">This certifies that</p>
            <h2 className="text-2xl sm:text-4xl font-bold mt-2 mb-2" style={{ color: BRAND, fontFamily: 'Georgia, serif' }}>
                {cert.studentName}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">has successfully completed the course</p>
            <h3 className="text-lg sm:text-2xl font-semibold text-slate-800 mt-2 max-w-lg">
                {cert.courseTitle}
            </h3>

            <div className="flex items-center gap-8 sm:gap-14 mt-8 sm:mt-10">
                <div className="text-center">
                    <p className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-wide">Issued</p>
                    <p className="text-xs sm:text-sm font-semibold text-slate-700 mt-0.5">{formatDate(cert.issuedAt)}</p>
                </div>
                <div className="w-px h-8 bg-slate-200" />
                <div className="text-center">
                    <p className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-wide">Certificate No.</p>
                    <p className="text-xs sm:text-sm font-semibold text-slate-700 mt-0.5 font-mono">{cert.certificateNumber}</p>
                </div>
                {cert.approvedByInstructorName && (
                    <>
                        <div className="w-px h-8 bg-slate-200" />
                        <div className="text-center">
                            <p className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-wide">Approved by</p>
                            <p className="text-xs sm:text-sm font-semibold text-slate-700 mt-0.5">{cert.approvedByInstructorName}</p>
                        </div>
                    </>
                )}
            </div>

            <div className="absolute bottom-6 right-8 flex items-center gap-1.5 text-[10px] font-semibold" style={{ color: BRAND }}>
                <MdOutlineVerified /> Verified by Vyntra One
            </div>
        </div>
    </div>
);

/* ── Preview / Detail Modal — fetches full record since the list endpoint is minimal ── */
const CertificateModal = ({ certificateNumber, onClose }) => {
    const [cert, setCert] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        (async () => {
            setLoading(true);
            setError("");
            try {
                if (USE_MOCK_DATA) {
                    await sleep(400);
                    const mock = MOCK_CERTIFICATE_DETAILS[certificateNumber];
                    if (mock) {
                        setCert(mock);
                    } else {
                        setError("Certificate not found.");
                    }
                    return;
                }
                const res = await studentCertificateApi.getCertificate(certificateNumber);
                if (res.data.success) {
                    setCert(res.data.data);
                } else {
                    setError(res.data.message || "Failed to load certificate.");
                }
            } catch (err) {
                console.error("getCertificate:", err);
                setError(err.response?.data?.message || "Failed to load certificate.");
            } finally {
                setLoading(false);
            }
        })();
    }, [certificateNumber]);

    const handleDownload = () => {
        window.print();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 print:bg-white print:p-0" onClick={onClose}>
            <style>{`
                @media print {
                    body * { visibility: hidden; }
                    #certificate-artwork, #certificate-artwork * { visibility: visible; }
                    #certificate-artwork { position: fixed; inset: 0; width: 100vw; height: auto; border-radius: 0; }
                }
            `}</style>
            <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden print:shadow-none print:rounded-none print:max-w-none" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 print:hidden">
                    <h2 className="text-base font-bold text-gray-900">Certificate Preview</h2>
                    <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition text-gray-500">
                        <FaTimes />
                    </button>
                </div>

                <div className="p-5">
                    {loading ? (
                        <div className="py-20 text-center text-gray-400">
                            <FaSpinner className="animate-spin text-2xl mx-auto mb-2" />
                            <p className="text-sm">Loading certificate...</p>
                        </div>
                    ) : error ? (
                        <div className="py-20 text-center text-red-400">
                            <FaExclamationCircle className="text-2xl mx-auto mb-2" />
                            <p className="text-sm">{error}</p>
                        </div>
                    ) : cert?.status === "APPROVED" ? (
                        <CertificateArtwork cert={cert} />
                    ) : cert ? (
                        <div className="py-14 text-center">
                            {(() => {
                                const { icon: Icon, badge, label } = statusConfig(cert.status);
                                return (
                                    <>
                                        <div className={`w-16 h-16 rounded-full border flex items-center justify-center mx-auto mb-4 ${badge}`}>
                                            <Icon className="text-2xl" />
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-900">{cert.courseTitle}</h3>
                                        <span className={`inline-flex items-center gap-1.5 mt-3 text-xs font-bold px-3 py-1.5 rounded-full border ${badge}`}>
                                            <Icon size={11} /> {label}
                                        </span>
                                        <p className="text-sm text-gray-500 mt-4 max-w-sm mx-auto leading-relaxed">
                                            {cert.status === "PENDING"
                                                ? "Your certificate request is awaiting instructor approval. You'll be able to view and download it once approved."
                                                : "This certificate request was not approved. Contact your instructor for details."}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-4 font-mono">Certificate No. {cert.certificateNumber}</p>
                                    </>
                                );
                            })()}
                        </div>
                    ) : null}
                </div>

                {!loading && !error && cert?.status === "APPROVED" && (
                    <div className="px-5 pb-5 print:hidden">
                        <button
                            onClick={handleDownload}
                            className="w-full flex items-center justify-center gap-2 h-11 rounded-xl text-white text-sm font-semibold transition"
                            style={{ background: BRAND }}
                        >
                            <FaDownload className="text-xs" /> Download as PDF
                        </button>
                    </div>
                )}
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

    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                if (USE_MOCK_DATA) {
                    await sleep(300);
                    setCourses(MOCK_ELIGIBLE_COURSES);
                    return;
                }
                const res = await studentEnrolledCourseApi.getMyEnrolledCourses(0, 50);
                if (res.data.success) {
                    setCourses(res.data.data.content || []);
                }
            } catch (err) {
                console.error("getMyEnrolledCourses:", err);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    // Field names for progress/slug/completion aren't confirmed from this
    // conversation's API docs — falling back across the likeliest names.
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
            if (res.data.success) {
                onRequested();
            } else {
                setRequestError(res.data.message || "Failed to request certificate.");
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
                            <FaGraduationCap className="text-gray-400 flex-shrink-0" />
                            <span className="text-sm font-medium text-gray-700 truncate">{course.title || course.courseTitle}</span>
                        </div>
                        <button
                            onClick={() => handleRequest(course)}
                            disabled={requestingId === getId(course)}
                            className="flex-shrink-0 flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-lg text-white transition disabled:opacity-60"
                            style={{ background: BRAND }}
                        >
                            {requestingId === getId(course) ? (<><FaSpinner className="animate-spin" size={10} /> Requesting...</>) : "Request Certificate"}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

/* ══════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════ */
const Certificate = () => {
    const [activeTab, setActiveTab] = useState("All");
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [previewNumber, setPreviewNumber] = useState(null);

    const fetchCertificates = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            if (USE_MOCK_DATA) {
                await sleep(500);
                setCertificates(MOCK_CERTIFICATES);
                return;
            }
            const res = await studentCertificateApi.getMyCertificates(0, 50);
            if (res.data.success) {
                setCertificates(res.data.data.content || []);
            } else {
                setError(res.data.message || "Failed to load certificates.");
            }
        } catch (err) {
            console.error("getMyCertificates:", err);
            setError(err.response?.data?.message || "Failed to load certificates.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchCertificates(); }, [fetchCertificates]);

    const filtered = activeTab === "All"
        ? certificates
        : certificates.filter((c) => c.status === activeTab);

    const stats = {
        total: certificates.length,
        approved: certificates.filter((c) => c.status === "APPROVED").length,
        pending: certificates.filter((c) => c.status === "PENDING").length,
        rejected: certificates.filter((c) => c.status === "REJECTED").length,
    };

    // Used by RequestCertificatePanel to avoid duplicate requests for courses
    // that already have a certificate record (any status).
    const existingCourseIds = new Set(certificates.map((c) => c.courseId).filter(Boolean));

    return (
        <div className="p-3 sm:p-4 md:p-6 min-h-screen bg-[#f7f8fc]">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col gap-4 mb-5">
                    <div>
                        <p className="text-xs sm:text-sm text-gray-400 mb-1 sm:mb-2">
                            <Link to="/student/dashboard" className="transition" style={{ color: BRAND }}>Dashboard</Link>
                            <span className="mx-1 sm:mx-2">&gt;</span>
                            <span className="text-gray-600 font-medium">Certificates</span>
                        </p>
                        <h1 className="text-lg sm:text-xl font-bold text-gray-900">My Certificates</h1>
                        <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">
                            Request, track, and download certificates for your completed courses.
                        </p>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-5 sm:mb-6">
                    {[
                        { label: "Total Requested", value: stats.total, icon: <FaCertificate className="text-lg sm:text-2xl" style={{ color: BRAND }} />, bg: `${BRAND}0d` },
                        { label: "Approved", value: stats.approved, icon: <FaCheckCircle className="text-green-600 text-lg sm:text-2xl" />, bg: "#ecfdf5" },
                        { label: "Pending", value: stats.pending, icon: <FaHourglassHalf className="text-amber-500 text-lg sm:text-2xl" />, bg: "#fffbeb" },
                        { label: "Rejected", value: stats.rejected, icon: <FaTimesCircle className="text-red-500 text-lg sm:text-2xl" />, bg: "#fef2f2" },
                    ].map((s) => (
                        <div key={s.label} className="bg-white border border-gray-200 rounded-xl p-3 sm:p-4 flex items-center gap-2 sm:gap-4 shadow-sm hover:shadow-md transition">
                            <div className="w-12 h-12 sm:w-[58px] sm:h-[58px] rounded-xl flex items-center justify-center shrink-0" style={{ background: s.bg }}>
                                {s.icon}
                            </div>
                            <div>
                                <p className="text-[10px] sm:text-sm font-semibold text-gray-700 leading-tight">{s.label}</p>
                                <h2 className="text-lg sm:text-2xl font-bold text-gray-900 leading-none mt-1 sm:mt-2">{s.value}</h2>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Request panel — only renders if eligible courses exist */}
                <RequestCertificatePanel existingCourseIds={existingCourseIds} onRequested={fetchCertificates} />

                {/* Tabs */}
                <div className="flex items-center gap-4 sm:gap-6 md:gap-10 border-b border-gray-200 pb-2 sm:pb-3 mb-5 sm:mb-6 overflow-x-auto">
                    {["All", "PENDING", "APPROVED", "REJECTED"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className="font-semibold text-xs sm:text-sm pb-2 sm:pb-3 whitespace-nowrap border-b-2 transition"
                            style={activeTab === tab ? { color: BRAND, borderColor: BRAND } : { color: '#6b7280', borderColor: 'transparent' }}
                        >
                            {tab === "All" ? "All Certificates" : statusConfig(tab).label}
                        </button>
                    ))}
                </div>

                {/* List */}
                {loading ? (
                    <div className="py-20 text-center text-gray-400">
                        <FaSpinner className="animate-spin text-2xl mx-auto mb-2" />
                        <p className="text-sm">Loading certificates...</p>
                    </div>
                ) : error ? (
                    <div className="py-20 text-center text-red-400">
                        <FaExclamationCircle className="text-2xl mx-auto mb-2" />
                        <p className="text-sm">{error}</p>
                    </div>
                ) : filtered.length > 0 ? (
                    <div className="space-y-3">
                        {filtered.map((item) => {
                            const { icon: Icon, badge, label, dot } = statusConfig(item.status);
                            return (
                                <div key={item.certificateId} className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 shadow-sm hover:shadow-md transition flex items-center gap-4">
                                    <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${BRAND}0d` }}>
                                        <FaCertificate style={{ color: BRAND }} />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h3 className="text-sm sm:text-base font-bold text-gray-900 truncate">{item.courseTitle}</h3>
                                            <span className={`inline-flex items-center gap-1 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold border ${badge}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${dot}`} /> {label}
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5 text-[11px] sm:text-xs text-gray-500">
                                            <span className="flex items-center gap-1">
                                                <FaHashtag size={9} className="text-gray-300" /> {item.certificateNumber}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <FaCalendarAlt size={9} className="text-gray-300" /> Requested {formatDate(item.createdAt)}
                                            </span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => setPreviewNumber(item.certificateNumber)}
                                        className="flex-shrink-0 flex items-center gap-1.5 text-xs sm:text-sm font-semibold px-3 sm:px-4 py-2 rounded-lg border transition hover:bg-gray-50"
                                        style={{ borderColor: `${BRAND}40`, color: BRAND }}
                                    >
                                        <FaEye className="text-xs" /> View
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="bg-white border border-dashed border-gray-300 rounded-xl p-8 sm:p-14 text-center shadow-sm">
                        <FaCertificate className="mx-auto text-3xl sm:text-5xl text-gray-300 mb-3 sm:mb-4" />
                        <h2 className="text-lg sm:text-2xl font-bold text-gray-700">No Certificates Found</h2>
                        <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">
                            {activeTab === "All" ? "Complete a course to request your first certificate." : "No certificates in this category."}
                        </p>
                    </div>
                )}
            </div>

            {previewNumber && (
                <CertificateModal certificateNumber={previewNumber} onClose={() => setPreviewNumber(null)} />
            )}
        </div>
    );
};

export default Certificate;