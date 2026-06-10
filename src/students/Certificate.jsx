import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    FaCertificate,
    FaCheckCircle,
    FaHourglassHalf,
    FaClock,
    FaDownload,
    FaShareAlt,
    FaEye,
    FaTrash,
    FaTimes,
} from "react-icons/fa";
import { MdOutlineVerified } from "react-icons/md";
import certificate from "../assets/certificate.jpg";
import certificate2 from "../assets/certificate2.jpg";
import certificate3 from "../assets/certificate3.jpg";
import certificate4 from "../assets/certificate4.jpg";

/* ── Dropdown Menu (3-dots) ── */
const DotsMenu = ({ item, onView, onShare, onRemove }) => {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const handler = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    return (
        <div className="relative" ref={ref}>
            <button
                onClick={() => setOpen(v => !v)}
                className="w-9 h-9 sm:w-[38px] sm:h-[38px] rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-100 transition flex items-center justify-center text-lg font-bold"
            >
                ⋮
            </button>
            {open && (
                <div className="absolute right-0 top-11 w-44 bg-white border border-gray-200 rounded-xl shadow-xl z-50 py-1.5 overflow-hidden">
                    <button
                        onClick={() => { onView(item); setOpen(false); }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                    >
                        <FaEye className="text-blue-500 text-xs" /> View Certificate
                    </button>
                    {item.status === "Earned" && (
                        <button
                            onClick={() => { onShare(item); setOpen(false); }}
                            className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                        >
                            <FaShareAlt className="text-green-500 text-xs" /> Share
                        </button>
                    )}
                    <div className="border-t border-gray-100 my-1" />
                    <button
                        onClick={() => { onRemove(item); setOpen(false); }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                    >
                        <FaTrash className="text-xs" /> Remove
                    </button>
                </div>
            )}
        </div>
    );
};

/* ── Preview Modal ── */
const PreviewModal = ({ item, onClose }) => {
    if (!item) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
            <div
                className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                    <div>
                        <h2 className="text-base font-bold text-gray-900">{item.title}</h2>
                        {item.credential && (
                            <p className="text-xs text-gray-400 mt-0.5">ID: {item.credential}</p>
                        )}
                    </div>
                    <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition text-gray-500">
                        <FaTimes />
                    </button>
                </div>
                <div className="p-4">
                    <img src={item.image} alt={item.title} className="w-full rounded-xl border border-gray-200 object-cover" />
                </div>
                {item.status === "Earned" && (
                    <div className="px-5 pb-5 flex gap-3">
                        <button
                            onClick={() => handleDownload(item)}
                            className="flex-1 flex items-center justify-center gap-2 h-10 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold transition"
                        >
                            <FaDownload className="text-xs" /> Download
                        </button>
                        <button
                            onClick={() => handleShare(item)}
                            className="flex items-center justify-center gap-2 h-10 px-5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-semibold transition"
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
    const shareUrl = `https://yourplatform.com/verify/${item.credential}`;
    const [copied, setCopied] = useState(false);

    const copy = () => {
        navigator.clipboard.writeText(shareUrl).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                    <h2 className="text-base font-bold text-gray-900">Share Certificate</h2>
                    <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition text-gray-500">
                        <FaTimes />
                    </button>
                </div>
                <div className="p-5 space-y-4">
                    <p className="text-sm text-gray-500">Share your <span className="font-semibold text-gray-700">{item.title}</span> certificate via the link below.</p>
                    <div className="flex items-center gap-2">
                        <input
                            readOnly
                            value={shareUrl}
                            className="flex-1 text-xs border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50 text-gray-600 outline-none"
                        />
                        <button
                            onClick={copy}
                            className={`px-4 py-2.5 rounded-lg text-xs font-bold transition ${copied ? "bg-green-600 text-white" : "bg-purple-600 text-white hover:bg-purple-700"}`}
                        >
                            {copied ? "Copied!" : "Copy"}
                        </button>
                    </div>
                    <div className="flex gap-2 pt-1">
                        {["LinkedIn", "Twitter", "Facebook"].map(platform => (
                            <button key={platform}
                                onClick={() => {
                                    const urls = {
                                        LinkedIn: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
                                        Twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent("I just earned a certificate in " + item.title + "!")}`,
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

/* ── Download helper ── */
const handleDownload = (item) => {
    const link = document.createElement("a");
    link.href = item.image;
    link.download = `${item.title.replace(/\s+/g, "_")}_Certificate.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

/* ── Share helper (opens share modal) ── */
const handleShare = (item, setShareItem) => {
    if (setShareItem) setShareItem(item);
};

/* ══════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════ */
const Certificate = () => {
    const [activeTab, setActiveTab] = useState("All Certificates");
    const [previewItem, setPreviewItem] = useState(null);
    const [shareItem, setShareItem] = useState(null);
    const [certList, setCertList] = useState([
        {
            id: 1,
            title: "Digital Marketing Fundamentals",
            status: "Earned",
            issued: "25 May 2024",
            credential: "DL-DMF-2024-1256",
            image: certificate,
            button: "Download",
            badge: "Verified",
            color: "green",
        },
        {
            id: 2,
            title: "SEO & Keyword Research",
            status: "Earned",
            issued: "30 May 2024",
            credential: "DL-SEO-2024-1289",
            image: certificate2,
            button: "Download",
            badge: "Verified",
            color: "green",
        },
        {
            id: 3,
            title: "Social Media Marketing",
            status: "Earned",
            issued: "05 Jun 2024",
            credential: "DL-SMM-2024-1324",
            image: certificate3,
            button: "Download",
            badge: "Verified",
            color: "green",
        },
        {
            id: 4,
            title: "Google Ads & PPC",
            status: "In Progress",
            issued: "75% Completed",
            credential: "",
            image: certificate4,
            button: "Continue",
            badge: "In Progress",
            color: "blue",
        },
    ]);

    const filteredCertificates =
        activeTab === "All Certificates"
            ? certList
            : certList.filter((item) => item.status === activeTab);

    const stats = {
        total: certList.length,
        verified: certList.filter(c => c.status === "Earned").length,
        inProgress: certList.filter(c => c.status === "In Progress").length,
        expiring: 1,
    };

    const handleRemove = (item) => {
        if (window.confirm(`Remove "${item.title}" from your certificates?`)) {
            setCertList(prev => prev.filter(c => c.id !== item.id));
        }
    };

    return (
        <div className="p-3 sm:p-4 md:p-6 min-h-screen bg-[#f7f8fc]">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="flex flex-col gap-4 mb-5">
                    <div>
                        <p className="text-xs sm:text-sm text-gray-400 mb-1 sm:mb-2">
                            <Link to="/student/dashboard" className="hover:text-blue-600 transition">Dashboard</Link>
                            <span className="mx-1 sm:mx-2">&gt;</span>
                            <span className="text-gray-600 font-medium">Certificates</span>
                        </p>
                        <h1 className="text-lg sm:text-xl font-bold text-gray-900">My Certificates</h1>
                        <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">
                            View and download your earned certificates for completed courses.
                        </p>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-5 sm:mb-8">
                    {[
                        { label: "Total Certificates", value: stats.total, icon: <FaCertificate className="text-purple-600 text-lg sm:text-2xl" />, bg: "bg-purple-50" },
                        { label: "Verified Certificates", value: stats.verified, icon: <FaCheckCircle className="text-green-600 text-lg sm:text-2xl" />, bg: "bg-green-50" },
                        { label: "In Progress", value: stats.inProgress, icon: <FaHourglassHalf className="text-blue-600 text-lg sm:text-2xl" />, bg: "bg-blue-50" },
                        { label: "Expiring Soon", value: stats.expiring, icon: <FaClock className="text-orange-500 text-lg sm:text-2xl" />, bg: "bg-orange-50" },
                    ].map(s => (
                        <div key={s.label} className="bg-white border border-gray-200 rounded-xl p-3 sm:p-4 flex items-center gap-2 sm:gap-4 shadow-sm hover:shadow-md transition">
                            <div className={`w-12 h-12 sm:w-[58px] sm:h-[58px] rounded-xl ${s.bg} flex items-center justify-center shrink-0`}>
                                {s.icon}
                            </div>
                            <div>
                                <p className="text-[10px] sm:text-sm font-semibold text-gray-700 leading-tight">{s.label}</p>
                                <h2 className="text-lg sm:text-2xl font-bold text-gray-900 leading-none mt-1 sm:mt-2">{s.value}</h2>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-4 sm:gap-6 md:gap-10 border-b border-gray-200 pb-2 sm:pb-3 mb-5 sm:mb-6 overflow-x-auto">
                    {["All Certificates", "Earned", "In Progress", "Expired"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`font-semibold text-xs sm:text-sm pb-2 sm:pb-3 whitespace-nowrap border-b-2 transition ${activeTab === tab ? "text-purple-600 border-purple-600" : "text-gray-500 border-transparent hover:text-gray-700"}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Certificate Cards */}
                <div className="space-y-3 sm:space-y-4">
                    {filteredCertificates.length > 0 ? (
                        filteredCertificates.map((item) => (
                            <div key={item.id} className="bg-white border border-gray-200 rounded-xl p-3 sm:p-4 shadow-sm hover:shadow-md transition">
                                <div className="flex flex-col lg:flex-row lg:items-center gap-3 sm:gap-4">

                                    {/* Left */}
                                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 flex-1">
                                        {/* Thumbnail — click to preview */}
                                        <div
                                            className="w-full sm:w-[150px] h-[160px] sm:h-[100px] rounded-xl overflow-hidden border border-gray-200 shrink-0 bg-gray-50 cursor-pointer hover:opacity-90 transition"
                                            onClick={() => setPreviewItem(item)}
                                            title="Click to preview"
                                        >
                                            <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                        </div>

                                        {/* Details */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                                                <h2 className="text-sm sm:text-base font-bold text-gray-900 leading-tight">{item.title}</h2>
                                                <span className={`inline-flex items-center gap-1 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold ${item.color === "green" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}>
                                                    {item.color === "green" && <MdOutlineVerified className="text-[10px] sm:text-xs" />}
                                                    {item.color === "blue" && <FaHourglassHalf className="text-[10px] sm:text-xs" />}
                                                    {item.badge}
                                                </span>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[11px] sm:text-xs text-gray-500">
                                                    <span className="font-semibold text-gray-700">Issued on:</span> {item.issued}
                                                </p>
                                                {item.credential && (
                                                    <p className="text-[11px] sm:text-xs text-gray-500 break-all">
                                                        <span className="font-semibold text-gray-700">Credential ID:</span> {item.credential}
                                                    </p>
                                                )}
                                            </div>
                                            {item.status === "In Progress" && (
                                                <div className="mt-3">
                                                    <div className="w-full sm:w-[220px] h-1.5 sm:h-2 bg-gray-200 rounded-full overflow-hidden">
                                                        <div className="w-[75%] h-full bg-purple-600 rounded-full" />
                                                    </div>
                                                    <p className="text-[10px] sm:text-xs text-gray-500 mt-1.5">75% Completed</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Right: Action buttons */}
                                    <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto mt-2 lg:mt-0">
                                        {item.status === "Earned" ? (
                                            <button
                                                onClick={() => handleDownload(item)}
                                                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 text-xs sm:text-sm h-9 sm:h-[38px] px-3 sm:px-5 rounded-xl border border-purple-600 text-purple-600 font-semibold hover:bg-purple-50 transition"
                                            >
                                                <FaDownload className="text-[10px]" /> Download
                                            </button>
                                        ) : (
                                            <Link
                                                to="/student/continue-learning"
                                                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 text-xs sm:text-sm h-9 sm:h-[38px] px-3 sm:px-5 rounded-xl border border-purple-600 text-purple-600 font-semibold hover:bg-purple-50 transition"
                                            >
                                                Continue
                                            </Link>
                                        )}

                                        <DotsMenu
                                            item={item}
                                            onView={(i) => setPreviewItem(i)}
                                            onShare={(i) => setShareItem(i)}
                                            onRemove={handleRemove}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="bg-white border border-dashed border-gray-300 rounded-xl p-8 sm:p-14 text-center shadow-sm">
                            <FaCertificate className="mx-auto text-3xl sm:text-5xl text-gray-300 mb-3 sm:mb-4" />
                            <h2 className="text-lg sm:text-2xl font-bold text-gray-700">No Certificates Found</h2>
                            <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">
                                There are no certificates available in this section.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modals */}
            {previewItem && (
                <PreviewModal item={previewItem} onClose={() => setPreviewItem(null)} />
            )}
            {shareItem && (
                <ShareModal item={shareItem} onClose={() => setShareItem(null)} />
            )}
        </div>
    );
};

export default Certificate;