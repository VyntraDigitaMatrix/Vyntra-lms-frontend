/**
 * MOCK certificate API — for local UI testing without a backend.
 *
 * Location: src/students/mockCertificateApi.js
 *   In Certificate.jsx (student):     import { studentCertificateApi } from "./mockCertificateApi";
 *   In Instructor/pages/Certificate:  import { instructorCertificateApi } from "../../students/mockCertificateApi";
 *
 * Mimics axios response shape: res.data.data.{content,totalPages} or res.data.data (single object).
 *
 * No certificate image assets are used anywhere — every certificate is
 * rendered dynamically from data via CertificateTemplate.jsx.
 */

// ─────────────────────────────────────────────────────────────
// Raw dummy dataset — shared "database" both APIs read from
// ─────────────────────────────────────────────────────────────
let CERTS = [
    {
        certificateId: 1,
        certificateNumber: "CERT-2025-000101",
        studentName: "Emily Johnson",
        studentEmail: "emily.johnson@example.com",
        courseTitle: "React for Beginners",
        courseSlug: "react-for-beginners",
        status: "APPROVED",
        createdAt: "2025-06-02T09:15:00Z",
        approvedAt: "2025-06-04T11:00:00Z",
        approvedByInstructorName: "Dr. Sarah Johnson",
    },
    {
        certificateId: 2,
        certificateNumber: "CERT-2025-000102",
        studentName: "Michael Smith",
        studentEmail: "michael.smith@example.com",
        courseTitle: "Advanced Python",
        courseSlug: "advanced-python",
        status: "PENDING",
        createdAt: "2025-09-10T14:22:00Z",
        approvedAt: null,
        approvedByInstructorName: null,
    },
    {
        certificateId: 3,
        certificateNumber: "CERT-2025-000103",
        studentName: "Sarah Lee",
        studentEmail: "sarah.lee@example.com",
        courseTitle: "Data Science with Python",
        courseSlug: "data-science-with-python",
        status: "PENDING",
        createdAt: "2025-09-12T08:05:00Z",
        approvedAt: null,
        approvedByInstructorName: null,
    },
    {
        certificateId: 4,
        certificateNumber: "CERT-2025-000104",
        studentName: "David Kim",
        studentEmail: "david.kim@example.com",
        courseTitle: "UI/UX Design Masterclass",
        courseSlug: "ui-ux-design-masterclass",
        status: "REJECTED",
        createdAt: "2025-08-20T16:40:00Z",
        approvedAt: "2025-08-22T10:10:00Z",
        approvedByInstructorName: "Dr. Sarah Johnson",
    },
    {
        certificateId: 5,
        certificateNumber: "CERT-2025-000105",
        studentName: "Jane Smith",
        studentEmail: "jane.smith@example.com",
        courseTitle: "Web Dev Bootcamp",
        courseSlug: "web-dev-bootcamp",
        status: "APPROVED",
        createdAt: "2025-07-01T12:00:00Z",
        approvedAt: "2025-07-03T09:30:00Z",
        approvedByInstructorName: "Dr. Sarah Johnson",
    },
    {
        certificateId: 6,
        certificateNumber: "CERT-2025-000106",
        studentName: "Mark Wilson",
        studentEmail: "mark.wilson@example.com",
        courseTitle: "Data Science with Python",
        courseSlug: "data-science-with-python",
        status: "PENDING",
        createdAt: "2025-09-14T18:50:00Z",
        approvedAt: null,
        approvedByInstructorName: null,
    },
    {
        certificateId: 7,
        certificateNumber: "CERT-2025-000107",
        studentName: "Priya Sharma",
        studentEmail: "priya.sharma@example.com",
        courseTitle: "SEO and Digital Marketing Essentials",
        courseSlug: "seo-and-digital-marketing-essentials",
        status: "APPROVED",
        createdAt: "2025-05-18T10:00:00Z",
        approvedAt: "2025-05-19T13:15:00Z",
        approvedByInstructorName: "Dr. Sarah Johnson",
    },
    {
        certificateId: 8,
        certificateNumber: "CERT-2025-000108",
        studentName: "Emily Johnson",
        studentEmail: "emily.johnson@example.com",
        courseTitle: "SEO and Digital Marketing Essentials",
        courseSlug: "seo-and-digital-marketing-essentials",
        status: "REJECTED",
        createdAt: "2025-05-20T10:00:00Z",
        approvedAt: "2025-05-21T13:15:00Z",
        approvedByInstructorName: "Dr. Sarah Johnson",
    },
];

// The "logged in student" for the student-facing API
const CURRENT_STUDENT_NAME = "Emily Johnson";

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────
const delay = (ms = 400) => new Promise((res) => setTimeout(res, ms));

const paginate = (list, page = 0, size = 10) => {
    const start = page * size;
    const content = list.slice(start, start + size);
    return {
        content,
        totalPages: Math.max(1, Math.ceil(list.length / size)),
        totalElements: list.length,
        number: page,
        size,
    };
};

const wrap = (data) => ({ data: { data, success: true, message: "OK" } });

// ─────────────────────────────────────────────────────────────
// STUDENT API — mirrors studentCertificateApi from "./auth/api"
// ─────────────────────────────────────────────────────────────
export const studentCertificateApi = {
    // GET /api/student/certificates
    getMyCertificates: async (page = 0, size = 10) => {
        await delay();
        const mine = CERTS.filter((c) => c.studentName === CURRENT_STUDENT_NAME);
        return wrap(paginate(mine, page, size));
    },

    // GET /api/student/certificates/{courseSlug}
    // Used by CourseCompletionCertificate.jsx — only returns a cert if
    // the course has actually been completed & approved. Throws otherwise.
    getCertificateForCourse: async (courseSlug) => {
        await delay(300);
        const found = CERTS.find(
            (c) =>
                c.courseSlug === courseSlug &&
                c.studentName === CURRENT_STUDENT_NAME &&
                c.status === "APPROVED"
        );
        if (!found) {
            const err = new Error("Not available");
            err.response = {
                data: { message: "This certificate isn't available yet. Complete the course to unlock it." },
            };
            throw err;
        }
        return wrap(found);
    },

    // POST /api/student/certificates/{courseSlug}/request
    requestCertificate: async (courseSlug) => {
        await delay();
        const alreadyRequested = CERTS.find(
            (c) => c.courseSlug === courseSlug && c.studentName === CURRENT_STUDENT_NAME
        );
        if (alreadyRequested) {
            const err = new Error("Certificate already requested for this course.");
            err.response = { data: { message: "You already requested a certificate for this course." } };
            throw err;
        }
        const newCert = {
            certificateId: CERTS.length + 1,
            certificateNumber: `CERT-2025-0001${String(CERTS.length + 10)}`,
            studentName: CURRENT_STUDENT_NAME,
            studentEmail: "emily.johnson@example.com",
            courseTitle: courseSlug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
            courseSlug,
            status: "PENDING",
            createdAt: new Date().toISOString(),
            approvedAt: null,
            approvedByInstructorName: null,
        };
        CERTS = [newCert, ...CERTS];
        return wrap(newCert);
    },
};

// ─────────────────────────────────────────────────────────────
// INSTRUCTOR API — mirrors instructorCertificateApi from "../auth/api"
// ─────────────────────────────────────────────────────────────
export const instructorCertificateApi = {
    // GET pending certs (global, no course filter)
    getPendingCertificates: async (page = 0, size = 20) => {
        await delay();
        const pending = CERTS.filter((c) => c.status === "PENDING");
        return wrap(paginate(pending, page, size));
    },

    // GET certs for one course (any status)
    getCertificatesByCourse: async (courseSlug, page = 0, size = 20) => {
        await delay();
        const forCourse = CERTS.filter((c) => c.courseSlug === courseSlug);
        return wrap(paginate(forCourse, page, size));
    },

    // GET single cert by certificate number (used to populate the detail modal)
    getCertificateByNumber: async (certificateNumber) => {
        await delay(200);
        const found = CERTS.find((c) => c.certificateNumber === certificateNumber);
        if (!found) {
            const err = new Error("Not found");
            err.response = { data: { message: "Certificate not found." } };
            throw err;
        }
        return wrap(found);
    },

    // PATCH/POST approve
    approveCertificate: async (certificateId) => {
        await delay();
        CERTS = CERTS.map((c) =>
            c.certificateId === certificateId
                ? {
                      ...c,
                      status: "APPROVED",
                      approvedAt: new Date().toISOString(),
                      approvedByInstructorName: "Dr. Sarah Johnson",
                  }
                : c
        );
        return wrap(CERTS.find((c) => c.certificateId === certificateId));
    },

    // PATCH/POST reject
    rejectCertificate: async (certificateId) => {
        await delay();
        CERTS = CERTS.map((c) =>
            c.certificateId === certificateId
                ? {
                      ...c,
                      status: "REJECTED",
                      approvedAt: new Date().toISOString(),
                      approvedByInstructorName: "Dr. Sarah Johnson",
                  }
                : c
        );
        return wrap(CERTS.find((c) => c.certificateId === certificateId));
    },
};