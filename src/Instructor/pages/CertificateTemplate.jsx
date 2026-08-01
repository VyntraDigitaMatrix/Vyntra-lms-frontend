import React, { forwardRef } from "react";
import logo from "../../assets/logooo.png";

/**
 * CertificateTemplate — clean, modern, professional layout.
 * Fixed at 1123×794px (A4 landscape @ 96dpi) so it maps 1:1 onto
 * an A4 PDF page with no distortion when captured by html2canvas.
 *
 * Props:
 *   data: {
 *     studentName: string,
 *     courseTitle: string,
 *     completionDate: string,        // pre-formatted, e.g. "July 17, 2026"
 *     certificateNumber: string,
 *     instructorName?: string,
 *     companyName?: string,
 *   }
 */
const CertificateTemplate = forwardRef(({ data }, ref) => {
  const {
    studentName,
    courseTitle,
    completionDate,
    certificateNumber,
    instructorName,
    companyName = "EduPlatform Academy",
  } = data || {};

  return (
    <div
      ref={ref}
      style={{
        width: "1123px",
        height: "794px",
        background: "#ffffff",
        fontFamily: "'Segoe UI', Arial, Helvetica, sans-serif",
        color: "#1a1a1a",
        position: "relative",
        boxSizing: "border-box",
        padding: "56px 72px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Top accent bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "10px",
          background: "linear-gradient(90deg, #4f46e5 0%, #7c3aed 50%, #4f46e5 100%)",
        }}
      />

      {/* Thin outer border */}
      <div
        style={{
          position: "absolute",
          inset: "24px",
          border: "1px solid #e2e2e2",
          pointerEvents: "none",
        }}
      />

      {/* Header row: company name (left) + logo (right) */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginTop: "20px",
        }}
      >
        <div>
          <p
            style={{
              fontSize: "13px",
              fontWeight: 700,
              letterSpacing: "3px",
              color: "#4f46e5",
              textTransform: "uppercase",
              margin: 0,
            }}
          >
            {companyName}
          </p>
          <p style={{ fontSize: "11px", color: "#9ca3af", margin: "4px 0 0" }}>
            Certificate No. {certificateNumber}
          </p>
        </div>

        {logo && (
          <img
            src={logo}
            alt="Company Logo"
            style={{ width: "72px", height: "72px", objectFit: "contain" }}
          />
        )}
      </div>

      {/* Main content — vertically centered in remaining space */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontSize: "13px",
            letterSpacing: "4px",
            textTransform: "uppercase",
            color: "#9ca3af",
            margin: "0 0 10px",
          }}
        >
          Certificate of Completion
        </p>

        <h1
          style={{
            fontSize: "34px",
            fontWeight: 800,
            color: "#111827",
            margin: "0 0 28px",
          }}
        >
          This certifies that
        </h1>

        <h2
          style={{
            fontSize: "42px",
            fontWeight: 700,
            color: "#4f46e5",
            margin: "0 0 8px",
            borderBottom: "2px solid #e5e7eb",
            paddingBottom: "14px",
            display: "inline-block",
            minWidth: "420px",
          }}
        >
          {studentName}
        </h2>

        <p
          style={{
            fontSize: "16px",
            color: "#4b5563",
            maxWidth: "620px",
            lineHeight: 1.6,
            margin: "26px 0 0",
          }}
        >
          has successfully completed the course
        </p>

        <h3
          style={{
            fontSize: "24px",
            fontWeight: 700,
            color: "#111827",
            margin: "10px 0 0",
          }}
        >
          {courseTitle}
        </h3>
      </div>

      {/* Footer: details row + signatures */}
      <div>
        {/* Detail chips */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "48px",
            marginBottom: "40px",
          }}
        >
          <DetailItem label="Completion Date" value={completionDate} />
          <DetailItem label="Certificate ID" value={certificateNumber} />
          {instructorName && <DetailItem label="Instructor" value={instructorName} />}
        </div>

        {/* Signature line */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            paddingTop: "8px",
          }}
        >
          <SignatureBlock role="Instructor" name={instructorName || "Course Instructor"} />

          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              border: "2px solid #4f46e5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "10px",
              fontWeight: 700,
              color: "#4f46e5",
              textAlign: "center",
              lineHeight: 1.2,
            }}
          >
            VERIFIED
          </div>

          <SignatureBlock role="Authorized Signatory" name={companyName} />
        </div>
      </div>
    </div>
  );
});

CertificateTemplate.displayName = "CertificateTemplate";

const DetailItem = ({ label, value }) => (
  <div style={{ textAlign: "center" }}>
    <p
      style={{
        fontSize: "10px",
        letterSpacing: "1.5px",
        textTransform: "uppercase",
        color: "#9ca3af",
        margin: "0 0 4px",
      }}
    >
      {label}
    </p>
    <p style={{ fontSize: "14px", fontWeight: 600, color: "#111827", margin: 0 }}>
      {value}
    </p>
  </div>
);

const SignatureBlock = ({ role, name }) => (
  <div style={{ textAlign: "center", width: "200px" }}>
    <p
      style={{
        fontSize: "14px",
        fontWeight: 600,
        color: "#374151",
        margin: "0 0 6px",
        borderBottom: "1px solid #d1d5db",
        paddingBottom: "8px",
      }}
    >
      {name}
    </p>
    <p style={{ fontSize: "11px", color: "#9ca3af", margin: 0 }}>{role}</p>
  </div>
);

export default CertificateTemplate;