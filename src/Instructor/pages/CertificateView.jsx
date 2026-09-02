import React, { useRef, useState } from "react";
import { FaDownload, FaSpinner } from "react-icons/fa";
import CertificateTemplate from "./CertificateTemplate";

const CERT_WIDTH = 1123;
const CERT_HEIGHT = 794;

/**
 * CertificateView
 * ----------------
 * The single reusable place that actually renders the real certificate
 * design (CertificateTemplate) plus a "Download PDF" button.
 *
 * Used by:
 *   - CourseCompletionCertificate.jsx (full page view)
 *   - Certificate.jsx -> PreviewModal (student's certificate list)
 *   - InstructorCertificates.jsx -> DetailModal (instructor review list)
 *
 * Props:
 *   certData: {
 *     studentName, courseTitle, completionDate,
 *     certificateNumber, instructorName?, companyName?
 *   }
 *   previewWidth: number — visible width in px, defaults to 380 (fits inside modals)
 */
const CertificateView = ({ certData, previewWidth = 380 }) => {
  const captureRef = useRef(null);
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState("");

  const scale = previewWidth / CERT_WIDTH;

  const handleDownload = async () => {
    if (!captureRef.current) return;
    setDownloading(true);
    setDownloadError("");
    try {
      const canvas = await html2canvas(captureRef.current, {
        scale: 3, // high resolution for crisp print quality
        useCORS: true,
        backgroundColor: "#ffffff",
      });
      const imgData = canvas.toDataURL("image/png", 1.0);

      const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pageHeight, undefined, "FAST");
      pdf.save(`Certificate-${certData.certificateNumber}.pdf`);
    } catch (err) {
      console.error(err);
      setDownloadError("Could not generate the PDF. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  if (!certData) return null;

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Hidden, full-resolution copy — used only for PDF capture, never
          shown, so the scaled-down preview never affects output quality */}
      <div style={{ position: "fixed", top: 0, left: -99999, pointerEvents: "none" }} aria-hidden="true">
        <CertificateTemplate ref={captureRef} data={certData} />
      </div>

      {/* Visible, scaled-down preview */}
      <div
        className="shadow rounded-lg overflow-hidden border border-gray-200"
        style={{ width: CERT_WIDTH * scale, height: CERT_HEIGHT * scale }}
      >
        <div
          style={{
            width: CERT_WIDTH,
            height: CERT_HEIGHT,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
        >
          <CertificateTemplate data={certData} />
        </div>
      </div>

      {downloadError && <p className="text-xs text-red-500 font-medium">{downloadError}</p>}

      <button
        onClick={handleDownload}
        disabled={downloading}
        className="flex items-center gap-2 h-9 px-4 rounded-lg bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-xs font-semibold transition"
      >
        {downloading ? (
          <>
            <FaSpinner className="animate-spin text-xs" /> Generating PDF…
          </>
        ) : (
          <>
            <FaDownload className="text-xs" /> Download PDF
          </>
        )}
      </button>
    </div>
  );
};

/**
 * Helper — builds the `certData` shape CertificateTemplate expects
 * from a raw certificate record coming out of the API/mock.
 */
export const buildCertData = (item) => ({
  studentName: item.studentName,
  courseTitle: item.courseTitle,
  completionDate: item.approvedAt || item.createdAt
    ? new Date(item.approvedAt || item.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "",
  certificateNumber: item.certificateNumber,
  instructorName: item.approvedByInstructorName,
  companyName: item.companyName,
});

export default CertificateView;