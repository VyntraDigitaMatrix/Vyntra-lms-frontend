import React, { useState, useEffect } from "react";
import { adminCertificateApi } from "../auth/api";
import { FaCertificate, FaSearch, FaTimes } from "react-icons/fa";

const Certificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Pagination
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  // Filters
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [courseSlugFilter, setCourseSlugFilter] = useState("");

  // Detail Modal
  const [selectedCert, setSelectedCert] = useState(null);
  const [certDetails, setCertDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    fetchCertificates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNumber]);

  const fetchCertificates = async () => {
    setLoading(true);
    setError("");
    try {
      let res;
      if (courseSlugFilter.trim() !== "") {
        res = await adminCertificateApi.getCertificatesByCourse(courseSlugFilter.trim(), pageNumber, pageSize);
      } else if (statusFilter !== "ALL") {
        res = await adminCertificateApi.getCertificatesByStatus(statusFilter, pageNumber, pageSize);
      } else {
        res = await adminCertificateApi.getAllCertificates(pageNumber, pageSize);
      }

      if (res.data?.success) {
        setCertificates(res.data.data.content || []);
        setTotalPages(res.data.data.totalPages || 0);
      } else {
        setError("Failed to load certificates.");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while fetching certificates.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPageNumber(0);
    fetchCertificates();
  };

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
    setCourseSlugFilter(""); // Clear course filter when status changes to avoid conflicting APIs
    setPageNumber(0);
  };

  // Ensure fetch is triggered if status changes
  useEffect(() => {
    fetchCertificates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const fetchCertificateDetails = async (certificateNumber) => {
    setSelectedCert(certificateNumber);
    setLoadingDetails(true);
    setCertDetails(null);
    try {
      const res = await adminCertificateApi.getCertificateDetails(certificateNumber);
      if (res.data?.success) {
        setCertDetails(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingDetails(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "APPROVED":
        return <span className="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded-full tracking-wide">APPROVED</span>;
      case "REJECTED":
        return <span className="px-2 py-1 bg-red-100 text-red-700 text-[10px] font-bold rounded-full tracking-wide">REJECTED</span>;
      case "PENDING":
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-[10px] font-bold rounded-full tracking-wide">PENDING</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-700 text-[10px] font-bold rounded-full tracking-wide">{status}</span>;
    }
  };

  return (
    <div className="p-4 md:p-6 min-h-screen bg-[#f7f8fc]">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-[#2BB2A9]/10 rounded-xl flex items-center justify-center shadow-sm border border-[#2BB2A9]/10">
                <FaCertificate className="text-[#2BB2A9]" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800">Certificates</h1>
            </div>
            <p className="text-sm text-gray-500 font-medium">Manage and view all student certificates</p>
          </div>
        </div>

        {error && <div className="p-4 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm">{error}</div>}

        {/* Filters */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 items-end">
            <div className="w-full md:w-48">
              <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Status</label>
              <select
                value={statusFilter}
                onChange={handleStatusChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2BB2A9]/10 appearance-none bg-white"
              >
                <option value="ALL">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>

            <div className="w-full md:w-64">
              <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Course Slug</label>
              <input
                type="text"
                placeholder="e.g. react-basics"
                value={courseSlugFilter}
                onChange={(e) => {
                  setCourseSlugFilter(e.target.value);
                  if (statusFilter !== "ALL") setStatusFilter("ALL"); // Clear status if searching by course
                }}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2BB2A9]/10 bg-white"
              />
            </div>

            <button type="submit" disabled={loading} className="w-full md:w-32 py-2 bg-[#2BB2A9] hover:bg-[#2BB2A9]/80 text-white rounded-xl text-sm font-semibold transition flex items-center justify-center gap-2 disabled:opacity-70">
              {loading ? "Loading..." : <><FaSearch /> Search</>}
            </button>
          </form>
        </div>

        {/* Data Table */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-5 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Certificate Number</th>
                  <th className="px-5 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Student Name</th>
                  <th className="px-5 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Course Title</th>
                  <th className="px-5 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-5 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Created At</th>
                  <th className="px-5 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {certificates.length === 0 && !loading ? (
                  <tr>
                    <td colSpan="6" className="px-5 py-8 text-center text-gray-500 text-sm">No certificates found.</td>
                  </tr>
                ) : (
                  certificates.map((cert, idx) => (
                    <tr
                      key={idx}
                      onClick={() => fetchCertificateDetails(cert.certificateNumber)}
                      className="hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <td className="px-5 py-3 font-medium text-[#2BB2A9]">{cert.certificateNumber}</td>
                      <td className="px-5 py-3 text-sm text-gray-700">{cert.studentName}</td>
                      <td className="px-5 py-3 text-sm text-gray-600 truncate max-w-[200px]">{cert.courseTitle}</td>
                      <td className="px-5 py-3">{getStatusBadge(cert.status)}</td>
                      <td className="px-5 py-3 text-xs text-gray-500">{cert.createdAt ? new Date(cert.createdAt).toLocaleString() : "-"}</td>
                      <td className="px-5 py-3 text-xs text-gray-400 font-mono truncate max-w-[100px]">{cert.certificateId}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50">
              <span className="text-sm text-gray-500">
                Page <span className="font-semibold text-gray-700">{pageNumber + 1}</span> of <span className="font-semibold text-gray-700">{totalPages}</span>
              </span>
              <div className="flex gap-2">
                <button
                  disabled={pageNumber === 0}
                  onClick={() => setPageNumber(p => Math.max(0, p - 1))}
                  className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  disabled={pageNumber >= totalPages - 1}
                  onClick={() => setPageNumber(p => Math.min(totalPages - 1, p + 1))}
                  className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Detail Modal */}
        {selectedCert && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-800">Certificate Details</h3>
                <button onClick={() => setSelectedCert(null)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                  <FaTimes />
                </button>
              </div>

              <div className="p-6 overflow-y-auto">
                {loadingDetails ? (
                  <div className="py-12 text-center text-gray-500">Loading details...</div>
                ) : certDetails ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <div>
                      <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">Certificate Number</label>
                      <div className="font-medium text-gray-800">{certDetails.certificateNumber || "-"}</div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">Status</label>
                      <div>{getStatusBadge(certDetails.status)}</div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">Student Name</label>
                      <div className="font-medium text-gray-800">{certDetails.studentName || "-"}</div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">Student Code</label>
                      <div className="text-sm text-gray-600 font-mono">{certDetails.studentCode || "-"}</div>
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">Course Title</label>
                      <div className="font-medium text-gray-800">{certDetails.courseTitle || "-"}</div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">Course Code</label>
                      <div className="text-sm text-gray-600 font-mono">{certDetails.courseCode || "-"}</div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">Requested</label>
                      <div className="text-sm text-gray-800">{certDetails.requested ? "Yes" : "No"}</div>
                    </div>

                    {/* Approver Details */}
                    <div className="md:col-span-2 border-t border-gray-100 pt-4 mt-2">
                      <h4 className="text-sm font-bold text-gray-700 mb-4">Approval Information</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                        <div>
                          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">Approved By (Name)</label>
                          <div className="text-sm text-gray-800">{certDetails.approvedByInstructorName || "-"}</div>
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">Approved By (Code)</label>
                          <div className="text-sm text-gray-600 font-mono">{certDetails.approvedByInstructorCode || "-"}</div>
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">Approved At</label>
                          <div className="text-sm text-gray-800">{certDetails.approvedAt ? new Date(certDetails.approvedAt).toLocaleString() : "-"}</div>
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">Issued At</label>
                          <div className="text-sm text-gray-800">{certDetails.issuedAt ? new Date(certDetails.issuedAt).toLocaleString() : "-"}</div>
                        </div>
                      </div>
                    </div>

                    {/* Internal IDs */}
                    <div className="md:col-span-2 border-t border-gray-100 pt-4 mt-2">
                      <h4 className="text-sm font-bold text-gray-700 mb-4">System IDs</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                        <div>
                          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">Certificate ID</label>
                          <div className="text-[11px] text-gray-500 font-mono break-all">{certDetails.certificateId || "-"}</div>
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">Student ID</label>
                          <div className="text-[11px] text-gray-500 font-mono break-all">{certDetails.studentId || "-"}</div>
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">Course ID</label>
                          <div className="text-[11px] text-gray-500 font-mono break-all">{certDetails.courseId || "-"}</div>
                        </div>
                      </div>
                    </div>

                  </div>
                ) : (
                  <div className="py-12 text-center text-red-500">Failed to load details.</div>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Certificates;
