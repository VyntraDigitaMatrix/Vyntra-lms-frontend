import React, { useState, useEffect } from "react";
import { adminResourceApi } from "../auth/api";
import { FaFolder, FaTrash, FaFilePdf, FaFileVideo, FaFileAlt } from "react-icons/fa";

const Resources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(null);

  // Pagination
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchResources();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNumber]);

  const fetchResources = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await adminResourceApi.getAllResources(pageNumber, pageSize);
      if (res.data?.success) {
        setResources(res.data.data.content || []);
        setTotalPages(res.data.data.totalPages || 0);
      } else {
        setError("Failed to load resources.");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while fetching resources.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (resourceId) => {
    if (!window.confirm("Are you sure you want to delete this resource?")) return;
    
    setDeleteLoading(resourceId);
    try {
      const res = await adminResourceApi.deleteResource(resourceId);
      if (res.data?.success) {
        // Refresh current page
        fetchResources();
      } else {
        alert(res.data?.message || "Failed to delete resource");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while deleting the resource.");
    } finally {
      setDeleteLoading(null);
    }
  };

  const getResourceIcon = (type) => {
    switch (type) {
      case "PDF":
        return <FaFilePdf className="text-red-500" />;
      case "VIDEO":
        return <FaFileVideo className="text-blue-500" />;
      default:
        return <FaFileAlt className="text-gray-500" />;
    }
  };

  const formatBytes = (bytes, decimals = 2) => {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  };

  return (
    <div className="p-4 md:p-6 min-h-screen bg-[#f7f8fc]">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-[#2BB2A9]/10 rounded-xl flex items-center justify-center shadow-sm border border-[#2BB2A9]/10">
                <FaFolder className="text-[#2BB2A9]" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800">Resources</h1>
            </div>
            <p className="text-sm text-gray-500 font-medium">Manage and view all system resources</p>
          </div>
        </div>

        {error && <div className="p-4 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm">{error}</div>}

        {/* Data Table */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-5 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-5 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-5 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">File Size</th>
                  <th className="px-5 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Created At</th>
                  <th className="px-5 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {resources.length === 0 && !loading ? (
                  <tr>
                    <td colSpan="5" className="px-5 py-8 text-center text-gray-500 text-sm">No resources found.</td>
                  </tr>
                ) : (
                  resources.map((resource) => (
                    <tr key={resource.resourceId} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="text-xl bg-gray-100 p-2 rounded-lg">
                            {getResourceIcon(resource.resourceType)}
                          </div>
                          <span className="font-medium text-gray-800">{resource.title}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-[10px] font-bold rounded-full tracking-wide">
                          {resource.resourceType || "UNKNOWN"}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-600 font-mono">
                        {formatBytes(resource.fileSize)}
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-500">
                        {resource.createdAt ? new Date(resource.createdAt).toLocaleString() : "-"}
                      </td>
                      <td className="px-5 py-4">
                        <button
                          onClick={() => handleDelete(resource.resourceId)}
                          disabled={deleteLoading === resource.resourceId}
                          className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                          title="Delete Resource"
                        >
                          {deleteLoading === resource.resourceId ? (
                            <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <FaTrash />
                          )}
                        </button>
                      </td>
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
      </div>
    </div>
  );
};

export default Resources;