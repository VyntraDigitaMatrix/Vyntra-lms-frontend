import React, { useEffect, useState } from "react";
import { FaSpinner, FaExclamationCircle } from "react-icons/fa";
import CertificateView, { buildCertData } from "./CertificateView";
import { studentCertificateApi } from "../../students/mockCertificateApi";

/**
 * CourseCompletionCertificate
 * ----------------------------
 * Fetches the logged-in student's certificate for `courseSlug` and
 * renders it ONLY if the course has actually been completed
 * (the backend/mock throws otherwise). Uses CertificateView for the
 * actual rendering + PDF download, so this page and the preview
 * modals elsewhere in the app all render the certificate identically.
 *
 * Usage:
 *   <CourseCompletionCertificate courseSlug="react-for-beginners" />
 */
const CourseCompletionCertificate = ({ courseSlug }) => {
    const [certificate, setCertificate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let ignore = false;

        const fetchCertificate = async () => {
            setLoading(true);
            setError("");
            try {
                const res = await studentCertificateApi.getCertificateForCourse(courseSlug);
                if (!ignore) setCertificate(res.data?.data || null);
            } catch (err) {
                if (!ignore) {
                    console.error(err);
                    setCertificate(null);
                    setError(
                        err.response?.data?.message ||
                            "This certificate isn't available yet. Complete the course to unlock it."
                    );
                }
            } finally {
                if (!ignore) setLoading(false);
            }
        };

        if (courseSlug) fetchCertificate();
        return () => {
            ignore = true;
        };
    }, [courseSlug]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-24 text-gray-400">
                <FaSpinner className="animate-spin text-3xl mb-3" />
                <p className="text-sm">Loading your certificate…</p>
            </div>
        );
    }

    if (error || !certificate) {
        return (
            <div className="flex flex-col items-center justify-center py-24 text-center px-4">
                <FaExclamationCircle className="text-4xl text-amber-400 mb-3" />
                <h3 className="text-base font-bold text-gray-700 mb-1">Certificate Not Available</h3>
                <p className="text-sm text-gray-500 max-w-sm">{error}</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center gap-6 py-6 px-3">
            <CertificateView certData={buildCertData(certificate)} previewWidth={900} />
        </div>
    );
};

export default CourseCompletionCertificate;