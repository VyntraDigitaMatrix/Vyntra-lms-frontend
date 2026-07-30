import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { adminJobsApi } from "../auth/api";
import { Plus, Edit, Trash2, Eye, Briefcase, Search, FileText } from "lucide-react";

export default function JobsList() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await adminJobsApi.getAllJobs(0, 100);
      setJobs(res.data?.data?.content || []);
    } catch (err) {
      console.error("Failed to fetch jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleDelete = async (slug) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    try {
      await adminJobsApi.deleteJob(slug);
      fetchJobs();
    } catch (err) {
      console.error("Failed to delete job:", err);
      alert("Error deleting job.");
    }
  };

  const filteredJobs = jobs.filter(
    (job) =>
      job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.companyName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Briefcase className="text-[#2BB2A9]" />
              Job Notifications
            </h1>
            <p className="text-gray-500 text-sm mt-1">Manage and publish job opportunities</p>
          </div>
          <Link
            to="/admin/jobs/create"
            className="flex items-center gap-2 bg-[#2BB2A9] text-white px-4 py-2 rounded-lg font-medium hover:bg-teal-600 transition shadow-sm w-fit"
          >
            <Plus size={18} />
            Post New Job
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search jobs..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2BB2A9]/20 focus:border-[#2BB2A9] text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="text-sm text-gray-500 font-medium">
              Total: {filteredJobs.length} Jobs
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4">Job Title</th>
                  <th className="px-6 py-4">Company</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Deadline</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="text-center py-10 text-gray-500">
                      Loading jobs...
                    </td>
                  </tr>
                ) : filteredJobs.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-10 text-gray-500">
                      No jobs found.
                    </td>
                  </tr>
                ) : (
                  filteredJobs.map((job) => (
                    <tr key={job.id} className="hover:bg-gray-50/50 transition">
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {job.title}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {job.companyName}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {job.location || "-"}
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {job.applicationDeadline || "-"}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            job.active
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {job.active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <button
                            onClick={() => navigate(`/admin/jobs/${job.slug}/applications`)}
                            title="View Applications"
                            className="text-blue-500 hover:text-blue-700 transition"
                          >
                            <FileText size={18} />
                          </button>
                          <Link
                            to={`/admin/jobs/edit/${job.slug}`}
                            title="Edit Job"
                            className="text-gray-500 hover:text-[#2BB2A9] transition"
                          >
                            <Edit size={18} />
                          </Link>
                          <button
                            onClick={() => handleDelete(job.slug)}
                            title="Delete Job"
                            className="text-gray-400 hover:text-red-500 transition"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
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
