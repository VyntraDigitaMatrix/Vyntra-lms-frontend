import React from "react";
import { FaFileAlt, FaFilePdf, FaFileExcel, FaFilePowerpoint, FaDownload } from "react-icons/fa";

/* Helper: safely extract array from any API shape */
export function extractArray(responseData) {
    if (!responseData) return [];
    const candidates = [
        responseData?.data?.content,
        responseData?.data,
        responseData?.content,
        responseData,
    ];
    for (const c of candidates) {
        if (Array.isArray(c) && c.length > 0) return c;
    }
    for (const c of candidates) {
        if (c && typeof c === "object" && !Array.isArray(c) && c.id) return [c];
    }
    return [];
}

function normalizeFiles(sub) {
    if (!sub) return [];

    // helper: guess file type from URL or mime string
    const guessType = (url = "", mime = "") => {
        const str = (url + mime).toLowerCase();
        if (str.includes("pdf")) return "pdf";
        if (str.includes("xls")) return "xlsx";
        if (str.includes("ppt")) return "pptx";
        if (str.includes("doc")) return "doc";
        if (str.includes("zip")) return "zip";
        return "default";
    };

    // helper: extract filename from URL
    const nameFromUrl = (url = "") => {
        try {
            const parts = new URL(url).pathname.split("/");
            const last = parts[parts.length - 1];
            return decodeURIComponent(last) || "File";
        } catch {
            return url.split("/").pop() || "File";
        }
    };

    // helper: format bytes
    const fmtSize = (bytes) => {
        if (!bytes) return "";
        const kb = bytes / 1024;
        if (kb < 1024) return `${Math.round(kb)} KB`;
        return `${(kb / 1024).toFixed(1)} MB`;
    };

    // helper: turn one raw object into our shape
    const shape = (obj) => {
        if (typeof obj === "string") {
            return { name: nameFromUrl(obj), size: "", type: guessType(obj), url: obj };
        }
        const url = obj.url || obj.fileUrl || obj.downloadUrl || obj.link || "";
        const name = obj.name || obj.fileName || obj.originalName ||
            obj.filename || nameFromUrl(url) || "File";
        const size = fmtSize(obj.size || obj.fileSize || obj.contentLength);
        const type = guessType(url, obj.type || obj.fileType || obj.mimeType || "");
        return { name, size, type, url };
    };

    // Try every known field name, first non-empty wins
    const candidates = [
        sub.submittedFiles,   // already shaped
        sub.files,            // common generic name
        sub.attachments,      // another common name
        sub.fileUrls,         // array of strings
        sub.documents,        // yet another variant
    ];

    for (const c of candidates) {
        if (Array.isArray(c) && c.length > 0) {
            return c.map(shape).filter((f) => f.url);
        }
    }

    // Single file fields
    const singleCandidates = [sub.file, sub.attachment, sub.document];
    for (const c of singleCandidates) {
        if (c && typeof c === "object" && (c.url || c.fileUrl)) {
            return [shape(c)];
        }
    }

    // Plain string URL fields
    const strCandidates = [sub.fileUrl, sub.attachmentUrl, sub.downloadUrl];
    for (const c of strCandidates) {
        if (typeof c === "string" && c) return [shape(c)];
    }

    return [];
}

function parseSubmittedDate(sub) {
    if (!sub) return null;

    // All field names the backend might use, in priority order
    const raw =
        sub.submittedDate ??
        sub.submissionDate ??
        sub.submittedAt ??
        sub.submissionAt ??
        sub.submitted_at ??
        sub.submission_date ??
        sub.uploadedAt ??
        sub.createdAt ??
        sub.created_at ??
        sub.timestamp ??
        null;

    if (raw === null || raw === undefined) return null;

    // Java LocalDateTime array e.g. [2025, 6, 10, 14, 30, 0]
    if (Array.isArray(raw)) {
        const [y, mo, d, h = 0, m = 0, s = 0] = raw;
        // Java months are 1-based, JS months are 0-based
        const date = new Date(y, mo - 1, d, h, m, s);
        return isNaN(date.getTime()) ? null : date.toISOString();
    }

    // Unix timestamp in seconds (10 digits) → convert to ms
    if (typeof raw === "number") {
        const ms = raw < 1e12 ? raw * 1000 : raw;
        const date = new Date(ms);
        return isNaN(date.getTime()) ? null : date.toISOString();
    }

    // String — try direct parse first
    if (typeof raw === "string") {
        const date = new Date(raw);
        if (!isNaN(date.getTime())) return date.toISOString();

        // Fallback: try numeric string (unix timestamp as string)
        const num = Number(raw);
        if (!isNaN(num)) {
            const ms = num < 1e12 ? num * 1000 : num;
            const d2 = new Date(ms);
            return isNaN(d2.getTime()) ? null : d2.toISOString();
        }
    }

    return null;
}

export function transformAssignment(item, submissionMap = {}) {
    const itemId = item.id ?? item.assignmentId ?? item._id ?? null;
    const itemSlug = item.slug ?? item.assignmentSlug ?? null;

    const sub =
        (itemId !== null && submissionMap[itemId]) ||
        submissionMap[item.id] ||
        submissionMap[item.assignmentId] ||
        submissionMap[item._id] ||
        null;

    // Debug: log what the submission object looks like so you can
    // verify the file fields in browser console
    if (sub) {
        console.log("[transformAssignment] raw submission for", itemId, sub);
        console.log("[transformAssignment] normalizedFiles:", normalizeFiles(sub));
        console.log("[transformAssignment] submittedDate raw value:",
            sub.submittedDate ?? sub.submissionDate ?? sub.submittedAt ??
            sub.submissionAt ?? sub.submitted_at ?? sub.submission_date ??
            sub.uploadedAt ?? sub.createdAt ?? sub.created_at ??
            sub.timestamp ?? "(none found)"
        );
        console.log("[transformAssignment] parsed date:", parseSubmittedDate(sub));
    }

    let status = "Pending";

if (sub) {
    status =
        sub.graded === true ||
        sub.obtainedMarks !== null &&
        sub.obtainedMarks !== undefined
            ? "Graded"
            : "Submitted";
}

    return {
        id: itemId,
        slug: itemSlug,
        assignmentSlug: itemSlug,
        title: item.title,
        description: item.description,
        instructions: item.instructions,
        maxMarks: item.maxMarks,
        dueDate: item.dueDate,
        active: item.active,
        allowLateSubmission: item.allowLateSubmission,
        allowResubmission: item.allowResubmission,
        moduleId: item.moduleId,
        status,
        submittedDate: parseSubmittedDate(sub),
        scoredMarks: sub?.obtainedMarks ?? sub?.score ?? null,
        feedback: sub?.feedback ?? sub?.instructorFeedback ?? null,
        gradedBy: sub?.gradedBy || sub?.instructor || null,
        gradedOn: sub?.gradedAt ?? sub?.gradedOn ?? null,
        submittedFiles: normalizeFiles(sub),   // ← robust normalizer replaces the old one-liner
        submissionNote: sub?.notes || sub?.submissionNote || sub?.comment || null,
        rubric: sub?.rubric || item.rubric || null,
        history: sub?.history || [],
    };
}

/* Build submission map indexed by ALL possible ID fields */
export function buildSubmissionMap(submissionsData) {
    const map = {};
    submissionsData.forEach((sub) => {
        const candidates = [
            sub.assignmentId,
            sub.assignment?.id,
            sub.assignment_id,
            sub.id,
        ];
        candidates.forEach((aId) => {
            if (aId !== undefined && aId !== null) {
                map[aId] = sub;
            }
        });
    });
    return map;
}

/* ─────────────────────────────────────────────
   Style maps
───────────────────────────────────────────── */
export const statusStyle = {
    Pending: "bg-orange-100 text-orange-600",
    Submitted: "bg-green-100 text-green-600",
    Graded: "bg-blue-100 text-blue-600",
};
export const iconBg = {
    Pending: "bg-orange-100 text-orange-500",
    Submitted: "bg-green-100 text-green-500",
    Graded: "bg-blue-100 text-blue-500",
};

/* ─────────────────────────────────────────────
   Shared UI Components
───────────────────────────────────────────── */
export function Badge({ status }) {
    return (
        <span
            className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold ${statusStyle[status] || "bg-gray-100 text-gray-500"
                }`}
        >
            {status}
        </span>
    );
}

export function SectionLabel({ children }) {
    return (
        <p className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 sm:mb-3">
            {children}
        </p>
    );
}

export function InfoBox({ label, value, valueClass = "text-gray-800", icon: Icon }) {
    return (
        <div className="bg-gray-50 rounded-xl p-2 sm:p-3 border border-gray-100">
            <div className="flex items-center gap-1.5 mb-1">
                {Icon && <Icon className="text-gray-400 text-[10px] sm:text-xs" />}
                <p className="text-[10px] sm:text-xs text-gray-400 font-semibold uppercase tracking-wide">
                    {label}
                </p>
            </div>
            <p className={`text-xs sm:text-sm font-bold ${valueClass}`}>{value ?? "—"}</p>
        </div>
    );
}

export function FileRow({ name, size, type, url, onDownload }) {
    const icons = {
        pdf: <FaFilePdf className="text-red-500    text-sm sm:text-base" />,
        xlsx: <FaFileExcel className="text-green-600  text-sm sm:text-base" />,
        pptx: <FaFilePowerpoint className="text-orange-500 text-sm sm:text-base" />,
        default: <FaFileAlt className="text-blue-500   text-sm sm:text-base" />,
    };
    const bg = {
        pdf: "bg-red-50",
        xlsx: "bg-green-50",
        pptx: "bg-orange-50",
        default: "bg-blue-50",
    };
    const ext = type || "default";
    const handleDownload = onDownload || (url ? () => window.open(url, "_blank") : undefined);

    return (
        <div className="flex items-center gap-2 sm:gap-3 bg-gray-50 rounded-xl p-2 sm:p-3 border border-gray-100">
            <div
                className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${bg[ext] || bg.default
                    }`}
            >
                {icons[ext] || icons.default}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-semibold text-gray-800 truncate">{name || "File"}</p>
                {size && <p className="text-[10px] sm:text-xs text-gray-400">{size}</p>}
            </div>
            {handleDownload && (
                <button
                    onClick={handleDownload}
                    className="text-gray-400 hover:text-blue-600 transition p-1"
                    aria-label="Download"
                >
                    <FaDownload className="text-xs sm:text-sm" />
                </button>
            )}
        </div>
    );
}

export function Tabs({ tabs, active, onChange }) {
    return (
        <div className="flex border-b border-gray-200 mb-4 sm:mb-6 overflow-x-auto">
            {tabs.map((t) => (
                <button
                    key={t}
                    onClick={() => onChange(t)}
                    className={`pb-2 sm:pb-3 px-2 sm:px-1 mr-4 sm:mr-8 text-xs sm:text-sm font-semibold transition border-b-2 whitespace-nowrap ${active === t
                            ? "border-blue-600 text-blue-600"
                            : "border-transparent text-gray-400 hover:text-gray-700"
                        }`}
                >
                    {t}
                </button>
            ))}
        </div>
    );
}