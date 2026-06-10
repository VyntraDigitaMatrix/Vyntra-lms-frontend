import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaSearch,
  FaFilePdf,
  FaVideo,
  FaFilePowerpoint,
  FaCertificate,
  FaDownload,
  FaEye,
  FaTrash,
  FaPause,
  FaPlay,
  FaStar,
  FaFolderOpen,
  FaArrowDown,
  FaCheckCircle,
  FaSpinner,
  FaClock,
  FaFilter,
  FaChevronDown,
  FaTimes,
  FaDatabase,
} from "react-icons/fa";
import { MdQuiz, MdAssignment, MdFolder } from "react-icons/md";

function Downloads() {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [messageModal, setMessageModal] = useState({
    show: false,
    type: "",
    message: "",
  });

  const [downloads, setDownloads] = useState([
    {
      id: 1,
      fileName: "React Hooks Complete Guide",
      course: "React JS",
      type: "PDF",
      size: 2.4,
      status: "Completed",
      progress: 100,
      date: "May 24, 2026",
      favorite: true,
      icon: <FaFilePdf />,
      description: "Comprehensive guide to React Hooks with practical examples",
    },
    {
      id: 2,
      fileName: "Routing Class Recording",
      course: "React JS",
      type: "Video",
      size: 120,
      status: "Downloading",
      progress: 65,
      date: "Today",
      favorite: false,
      icon: <FaVideo />,
      description: "Step-by-step video tutorial on React Router",
    },
    {
      id: 3,
      fileName: "JavaScript ES6+ Mastery",
      course: "JavaScript",
      type: "PPT",
      size: 5.1,
      status: "Completed",
      progress: 100,
      date: "May 22, 2026",
      favorite: false,
      icon: <FaFilePowerpoint />,
      description: "Advanced JavaScript concepts and modern features",
    },
    {
      id: 4,
      fileName: "Course Completion Certificate",
      course: "Frontend Design",
      type: "Certificate",
      size: 1.2,
      status: "Completed",
      progress: 100,
      date: "May 20, 2026",
      favorite: true,
      icon: <FaCertificate />,
      description: "Official certification for completing the course",
    },
  ]);

  const typeOptions = ["All", "PDF", "Video", "PPT", "Certificate"];
  const statusOptions = ["All", "Completed", "Downloading", "Paused"];

  const getIconBg = (type) => {
    switch(type) {
      case "PDF": return "bg-red-50 text-red-500";
      case "Video": return "bg-purple-50 text-purple-500";
      case "PPT": return "bg-orange-50 text-orange-500";
      case "Certificate": return "bg-green-50 text-green-500";
      default: return "bg-blue-50 text-blue-500";
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case "Completed":
        return { bg: "bg-green-50", text: "text-green-700", icon: <FaCheckCircle className="text-green-600 text-[9px] sm:text-xs" /> };
      case "Downloading":
        return { bg: "bg-blue-50", text: "text-blue-700", icon: <FaSpinner className="text-blue-600 text-[9px] sm:text-xs animate-spin" /> };
      default:
        return { bg: "bg-gray-100", text: "text-gray-600", icon: <FaClock className="text-gray-500 text-[9px] sm:text-xs" /> };
    }
  };

  const filteredDownloads = downloads.filter((item) => {
    const matchesSearch = item.fileName.toLowerCase().includes(search.toLowerCase()) ||
                         item.description.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === "All" || item.type === filterType;
    const matchesStatus = filterStatus === "All" || item.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const stats = useMemo(() => {
    return {
      total: downloads.length,
      completed: downloads.filter((item) => item.status === "Completed").length,
      active: downloads.filter((item) => item.status === "Downloading").length,
      storage: downloads.reduce((sum, item) => sum + item.size, 0).toFixed(1),
    };
  }, [downloads]);

  const handleFavoriteToggle = (id) => {
    setDownloads(prev => prev.map(item =>
      item.id === id ? { ...item, favorite: !item.favorite } : item
    ));
    setMessageModal({
      show: true,
      type: "success",
      message: "Item updated successfully!",
    });
    setTimeout(() => {
      setMessageModal({ show: false, type: "", message: "" });
    }, 2000);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      setDownloads(prev => prev.filter(item => item.id !== id));
      setMessageModal({
        show: true,
        type: "success",
        message: "Item deleted successfully!",
      });
      setTimeout(() => {
        setMessageModal({ show: false, type: "", message: "" });
      }, 2000);
    }
  };

  const handlePauseResume = (id) => {
    setDownloads(prev => prev.map(item =>
      item.id === id 
        ? { ...item, status: item.status === "Downloading" ? "Paused" : "Downloading" }
        : item
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Breadcrumb - Responsive */}
      <div className="px-3 sm:px-4 md:px-6 pt-4 sm:pt-6">
        <div className="flex items-center justify-between">
          <p className="text-xs sm:text-sm text-gray-400">
            <Link to="/student/dashboard" className="hover:text-blue-600 transition">
              Dashboard
            </Link>
            <span className="mx-1 sm:mx-2">&gt;</span>
            <span className="text-gray-600 font-medium">Downloads</span>
          </p>
        </div>
      </div>

      {/* Header Section - Responsive */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-5 py-3 sm:py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Downloads Manager</h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">Manage your offline files, videos, notes, and certificates</p>
          </div>

          <button className="px-3 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold flex items-center gap-1.5 sm:gap-2 hover:from-blue-700 hover:to-blue-800 transition-all shadow-md text-sm sm:text-base">
            <FaDownload className="text-xs sm:text-sm" />
            Download All
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-5 pb-6 sm:pb-8">
        {/* Stats Cards - Responsive Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-5 sm:mb-6">
          <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4 shadow-sm hover:shadow-md transition">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-10 h-10 sm:w-[52px] sm:h-[52px] rounded-xl bg-blue-50 flex items-center justify-center">
                <FaArrowDown className="text-blue-600 text-lg sm:text-2xl" />
              </div>
              <div>
                <p className="text-[10px] sm:text-sm text-gray-500 font-medium">Total Downloads</p>
                <h2 className="text-base sm:text-2xl font-bold text-gray-800">{stats.total}</h2>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4 shadow-sm hover:shadow-md transition">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-10 h-10 sm:w-[52px] sm:h-[52px] rounded-xl bg-green-50 flex items-center justify-center">
                <FaCheckCircle className="text-green-600 text-lg sm:text-2xl" />
              </div>
              <div>
                <p className="text-[10px] sm:text-sm text-gray-500 font-medium">Completed</p>
                <h2 className="text-base sm:text-2xl font-bold text-gray-800">{stats.completed}</h2>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4 shadow-sm hover:shadow-md transition">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-10 h-10 sm:w-[52px] sm:h-[52px] rounded-xl bg-purple-50 flex items-center justify-center">
                <FaSpinner className="text-purple-600 text-lg sm:text-2xl" />
              </div>
              <div>
                <p className="text-[10px] sm:text-sm text-gray-500 font-medium">Active Downloads</p>
                <h2 className="text-base sm:text-2xl font-bold text-gray-800">{stats.active}</h2>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4 shadow-sm hover:shadow-md transition">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-10 h-10 sm:w-[52px] sm:h-[52px] rounded-xl bg-orange-50 flex items-center justify-center">
                <FaDatabase className="text-orange-600 text-lg sm:text-2xl" />
              </div>
              <div>
                <p className="text-[10px] sm:text-sm text-gray-500 font-medium">Storage Used</p>
                <h2 className="text-base sm:text-2xl font-bold text-gray-800">{stats.storage} MB</h2>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters Bar - Responsive */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 mb-5 sm:mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs sm:text-sm" />
              <input
                type="text"
                placeholder="Search downloads..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-xs sm:text-sm"
              />
            </div>
            
            <div className="flex gap-2 sm:gap-3">
              {/* Type Filter Dropdown */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowTypeDropdown(!showTypeDropdown);
                    setShowStatusDropdown(false);
                  }}
                  className="h-9 sm:h-11 px-3 sm:px-5 border border-gray-200 rounded-lg flex items-center gap-1.5 sm:gap-2 text-gray-700 hover:bg-gray-50 transition text-xs sm:text-sm"
                >
                  <FaFilter className="text-xs sm:text-sm" />
                  <span className="font-medium hidden sm:inline">Type:</span>
                  <span>{filterType}</span>
                  <FaChevronDown className={`text-[8px] sm:text-xs transition-transform ${showTypeDropdown ? 'rotate-180' : ''}`} />
                </button>

                {showTypeDropdown && (
                  <div className="absolute top-10 sm:top-12 left-0 w-36 sm:w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-30 py-2 animate-fadeIn">
                    {typeOptions.map((type) => (
                      <button
                        key={type}
                        onClick={() => {
                          setFilterType(type);
                          setShowTypeDropdown(false);
                        }}
                        className={`w-full text-left px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm transition-all duration-200 ${
                          filterType === type
                            ? "bg-blue-50 text-blue-600 font-medium"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Status Filter Dropdown */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowStatusDropdown(!showStatusDropdown);
                    setShowTypeDropdown(false);
                  }}
                  className="h-9 sm:h-11 px-3 sm:px-5 border border-gray-200 rounded-lg flex items-center gap-1.5 sm:gap-2 text-gray-700 hover:bg-gray-50 transition text-xs sm:text-sm"
                >
                  <FaFilter className="text-xs sm:text-sm" />
                  <span className="font-medium hidden sm:inline">Status:</span>
                  <span>{filterStatus}</span>
                  <FaChevronDown className={`text-[8px] sm:text-xs transition-transform ${showStatusDropdown ? 'rotate-180' : ''}`} />
                </button>

                {showStatusDropdown && (
                  <div className="absolute top-10 sm:top-12 left-0 w-36 sm:w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-30 py-2 animate-fadeIn">
                    {statusOptions.map((status) => (
                      <button
                        key={status}
                        onClick={() => {
                          setFilterStatus(status);
                          setShowStatusDropdown(false);
                        }}
                        className={`w-full text-left px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm transition-all duration-200 ${
                          filterStatus === status
                            ? "bg-blue-50 text-blue-600 font-medium"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Storage Management Card - Responsive */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 sm:p-5 border border-blue-100 shadow-sm mb-5 sm:mb-6">
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <div>
              <h3 className="text-base sm:text-xl font-bold text-gray-800 flex items-center gap-1.5 sm:gap-2">
                <FaFolderOpen className="text-blue-600 text-sm sm:text-base" />
                Storage Management
              </h3>
              <p className="text-gray-600 text-[11px] sm:text-sm mt-0.5 sm:mt-1">
                Used <span className="font-semibold text-blue-600">{stats.storage} MB</span> of 500 MB available
              </p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
              <FaDatabase className="text-blue-500 text-lg sm:text-2xl" />
            </div>
          </div>

          <div className="w-full h-2 sm:h-3 bg-white/50 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
              style={{ width: `${Math.min((stats.storage / 500) * 100, 100)}%` }}
            ></div>
          </div>
          
          <div className="flex justify-between mt-1.5 sm:mt-2 text-[9px] sm:text-xs text-gray-500">
            <span>0 MB</span>
            <span>250 MB</span>
            <span>500 MB</span>
          </div>
        </div>

        {/* Downloads Grid - Responsive */}
        {filteredDownloads.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
            {filteredDownloads.map((item) => {
              const statusBadge = getStatusBadge(item.status);
              return (
                <div
                  key={item.id}
                  className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="h-1 bg-gradient-to-r from-blue-500 to-blue-600"></div>
                  
                  <div className="p-3 sm:p-5">
                    <div className="flex items-start gap-3 sm:gap-4">
                      {/* Icon */}
                      <div className={`w-12 h-12 sm:w-[54px] sm:h-[54px] rounded-xl ${getIconBg(item.type)} flex items-center justify-center text-xl sm:text-2xl shrink-0`}>
                        {item.icon}
                      </div>

                      <div className="flex-1 min-w-0">
                        {/* Header */}
                        <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                          <div className="flex-1 min-w-0">
                            <h2 className="text-sm sm:text-lg font-bold text-gray-800 truncate hover:text-blue-600 transition">
                              {item.fileName}
                            </h2>
                            <p className="text-gray-500 text-[10px] sm:text-xs mt-0.5 sm:mt-1">
                              {item.course} • {item.type} • {item.size} MB
                            </p>
                          </div>

                          <div className={`shrink-0 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-xs font-medium flex items-center gap-1 ${statusBadge.bg} ${statusBadge.text}`}>
                            {statusBadge.icon}
                            <span>{item.status}</span>
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-gray-600 text-[11px] sm:text-sm mb-2 sm:mb-3 line-clamp-2">
                          {item.description}
                        </p>

                        {/* Progress Bar */}
                        <div className="mb-2 sm:mb-3">
                          <div className="flex justify-between text-[9px] sm:text-xs text-gray-500 mb-0.5 sm:mb-1">
                            <span>Download Progress</span>
                            <span className="font-medium text-blue-600">{item.progress}%</span>
                          </div>
                          <div className="w-full h-1.5 sm:h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
                              style={{ width: `${item.progress}%` }}
                            ></div>
                          </div>
                        </div>

                        {/* Meta Info */}
                        <div className="flex flex-wrap items-center justify-between gap-1 sm:gap-2 text-[9px] sm:text-xs text-gray-500 mb-2 sm:mb-3">
                          <div className="flex items-center gap-1 sm:gap-2">
                            <FaClock className="text-gray-400 text-[8px] sm:text-xs" />
                            <span>{item.date}</span>
                          </div>
                          <div className="flex items-center gap-0.5 sm:gap-1">
                            <FaStar className={`text-[8px] sm:text-xs ${item.favorite ? 'text-yellow-500' : 'text-gray-300'}`} />
                            <span>{item.favorite ? "Saved" : "Not saved"}</span>
                          </div>
                        </div>

                        {/* Action Buttons - Wrap on mobile */}
                        <div className="flex flex-wrap gap-1.5 sm:gap-2">
                          <button className="h-7 sm:h-[34px] px-2 sm:px-3 bg-blue-50 text-blue-600 rounded-lg text-[10px] sm:text-sm font-medium flex items-center gap-1 hover:bg-blue-100 transition">
                            <FaEye size={10} className="sm:text-xs" />
                            Preview
                          </button>

                          {item.status === "Downloading" ? (
                            <button 
                              onClick={() => handlePauseResume(item.id)}
                              className="h-7 sm:h-[34px] px-2 sm:px-3 bg-gray-100 text-gray-600 rounded-lg text-[10px] sm:text-sm font-medium flex items-center gap-1 hover:bg-gray-200 transition"
                            >
                              <FaPause size={10} className="sm:text-xs" />
                              Pause
                            </button>
                          ) : item.status === "Paused" ? (
                            <button 
                              onClick={() => handlePauseResume(item.id)}
                              className="h-7 sm:h-[34px] px-2 sm:px-3 bg-blue-100 text-blue-600 rounded-lg text-[10px] sm:text-sm font-medium flex items-center gap-1 hover:bg-blue-200 transition"
                            >
                              <FaPlay size={10} className="sm:text-xs" />
                              Resume
                            </button>
                          ) : (
                            <button className="h-7 sm:h-[34px] px-2 sm:px-3 bg-gray-100 text-gray-600 rounded-lg text-[10px] sm:text-sm font-medium flex items-center gap-1 hover:bg-gray-200 transition">
                              <FaPlay size={10} className="sm:text-xs" />
                              Open
                            </button>
                          )}

                          <button 
                            onClick={() => handleFavoriteToggle(item.id)}
                            className={`h-7 sm:h-[34px] px-2 sm:px-3 rounded-lg text-[10px] sm:text-sm font-medium flex items-center gap-1 transition ${
                              item.favorite
                                ? "bg-yellow-50 text-yellow-600 hover:bg-yellow-100"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                          >
                            <FaStar size={10} className="sm:text-xs" />
                            {item.favorite ? "Saved" : "Save"}
                          </button>

                          <button 
                            onClick={() => handleDelete(item.id)}
                            className="h-7 sm:h-[34px] px-2 sm:px-3 bg-red-50 text-red-600 rounded-lg text-[10px] sm:text-sm font-medium flex items-center gap-1 hover:bg-red-100 transition"
                          >
                            <FaTrash size={10} className="sm:text-xs" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-xl p-8 sm:p-12 text-center shadow-sm border border-gray-200">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <FaDownload className="text-2xl sm:text-4xl text-gray-400" />
            </div>
            <h3 className="text-base sm:text-xl font-semibold text-gray-600 mb-1 sm:mb-2">No downloads found</h3>
            <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">Try adjusting your search or filter criteria</p>
            <button
              onClick={() => {
                setSearch("");
                setFilterType("All");
                setFilterStatus("All");
              }}
              className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Message Modal - Responsive */}
      {messageModal.show && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-3">
          <div className="w-80 sm:w-96 bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 shadow-xl text-center animate-fadeIn">
            <div
              className={`w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-full flex items-center justify-center text-2xl sm:text-3xl mb-3 sm:mb-4 ${
                messageModal.type === "success"
                  ? "bg-green-100 text-green-600"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {messageModal.type === "success" ? "✓" : "!"}
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1 sm:mb-2">
              {messageModal.type === "success" ? "Success!" : "Error!"}
            </h2>

            <p className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">{messageModal.message}</p>

            <button
              type="button"
              onClick={() =>
                setMessageModal({
                  show: false,
                  type: "",
                  message: "",
                })
              }
              className={`w-full py-2 sm:py-2.5 rounded-lg text-white font-semibold text-sm ${
                messageModal.type === "success"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700"
              } transition`}
            >
              OK
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}

export default Downloads;