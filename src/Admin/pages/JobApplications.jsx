import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { adminJobsApi } from "../auth/api";
import { ArrowLeft, Users, FileText, CheckCircle, XCircle, Clock } from "lucide-react";

export default function JobApplications() {
  const { jobSlug } = useParams();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusUpdating, setStatusUpdating] = useState(null);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await adminJobsApi.getJobApplications(jobSlug, 0, 100);
      setApplications(res.data?.data?.content || []);
    } catch (err) {
      console.error("Failed to fetch applications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [jobSlug]);

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      setStatusUpdating(applicationId);
      await adminJobsApi.updateApplicationStatus(applicationId, { status: newStatus });
      
      // Update local state instead of refetching everything to be faster
      setApplications(prev => 
        prev.map(app => 
          app.applicationId === applicationId ? { ...app, status: newStatus } : app
        )
      );
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Failed to update application status.");
    } finally {
      setStatusUpdating(null);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "PENDING":
        return <Clock size={16} className="text-amber-500" />;
      case "SHORTLISTED":
        return <CheckCircle size={16} className="text-blue-500" />;
      case "HIRED":
        return <CheckCircle size={16} className="text-emerald-500" />;
      case "REJECTED":
        return <XCircle size={16} className="text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate("/admin/jobs")}
            className="w-10 h-10 flex items-center justify-center bg-white rounded-lg border border-gray-200 text-gray-500 hover:text-[#2BB2A9] transition shadow-sm"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Users className="text-[#2BB2A9]" />
              Applications
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Review and manage applications for this job
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h2 className="font-semibold text-gray-800">
              Total Applicants ({applications.length})
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4">Applicant Name</th>
                  <th className="px-6 py-4">Applied Date</th>
                  <th className="px-6 py-4">Documents</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="text-center py-10 text-gray-500">
                      Loading applications...
                    </td>
                  </tr>
                ) : applications.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-10 text-gray-500">
                      No applications received yet.
                    </td>
                  </tr>
                ) : (
                  applications.map((app) => (
                    <tr key={app.applicationId} className="hover:bg-gray-50/50 transition">
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {app.studentName}
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {new Date(app.appliedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-3">
                          {app.resumeUrl && (
                            <a
                              href={app.resumeUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center gap-1 text-[#2BB2A9] hover:underline text-xs font-medium"
                            >
                              <FileText size={14} /> Resume
                            </a>
                          )}
                          {app.coverLetter && (
                            <a
                              href={app.coverLetter}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center gap-1 text-blue-600 hover:underline text-xs font-medium"
                            >
                              <FileText size={14} /> Cover Letter
                            </a>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5">
                          {getStatusIcon(app.status)}
                          <span className="font-medium text-gray-700">
                            {app.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={app.status}
                          onChange={(e) => handleStatusChange(app.applicationId, e.target.value)}
                          disabled={statusUpdating === app.applicationId}
                          className="bg-white border border-gray-200 rounded-lg text-sm px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#2BB2A9] disabled:opacity-50"
                        >
                          <option value="PENDING">Pending</option>
                          <option value="SHORTLISTED">Shortlisted</option>
                          <option value="HIRED">Hired</option>
                          <option value="REJECTED">Rejected</option>
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
