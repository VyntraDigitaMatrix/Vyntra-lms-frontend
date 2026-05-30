import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaSearch,
  FaPlus,
  FaFilePdf,
  FaFilePowerpoint,
  FaFileWord,
  FaVideo,
  FaDownload,
  FaEye,
  FaStar,
  FaCloudUploadAlt,
  FaTimes,
  FaBookOpen,
  FaArrowDown,
  FaBookmark,
  FaGraduationCap,
  FaFilter,
  FaSortAmountDown,
  FaEllipsisV,
  FaShare,
  FaTrash,
  FaUserGraduate,
  FaCalendarAlt,
  FaChevronDown,
} from "react-icons/fa";
import { MdQuiz, MdAssignment, MdFolder } from "react-icons/md";

function Resources() {
  const [search, setSearch] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [filterType, setFilterType] = useState("All");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [messageModal, setMessageModal] = useState({
    show: false,
    type: "",
    message: "",
  });

  const [resources, setResources] = useState([
    {
      id: 1,
      title: "React Hooks Complete Guide",
      course: "React JS",
      type: "PDF",
      size: "2.4 MB",
      downloads: 120,
      saved: true,
      uploadedBy: "Dr. Sarah Johnson",
      date: "May 20, 2026",
      status: "Public",
      iconType: "PDF",
      description: "Comprehensive guide to React Hooks with practical examples",
    },
    {
      id: 2,
      title: "JavaScript ES6+ Mastery",
      course: "JavaScript",
      type: "PPT",
      size: "5.1 MB",
      downloads: 95,
      saved: false,
      uploadedBy: "Prof. Michael Chen",
      date: "May 18, 2026",
      status: "Public",
      iconType: "PPT",
      description: "Advanced JavaScript concepts and modern features",
    },
    {
      id: 3,
      title: "CSS Grid & Flexbox Workshop",
      course: "Frontend Design",
      type: "DOC",
      size: "1.8 MB",
      downloads: 60,
      saved: true,
      uploadedBy: "Emily Rodriguez",
      date: "May 15, 2026",
      status: "Private",
      iconType: "DOC",
      description: "Practical guide to modern CSS layouts",
    },
    {
      id: 4,
      title: "React Router v6 Tutorial",
      course: "React JS",
      type: "Video",
      size: "120 MB",
      downloads: 45,
      saved: false,
      uploadedBy: "Instructor Team",
      date: "May 12, 2026",
      status: "Public",
      iconType: "Video",
      description: "Step-by-step video tutorial on React Router",
    },
  ]);

  const [formData, setFormData] = useState({
    title: "",
    course: "",
    type: "",
    size: "",
    uploadedBy: "",
    status: "Public",
    description: "",
  });

  const filterOptions = ["All", "PDF", "PPT", "DOC", "Video"];

  const getIcon = (type) => {
    switch(type) {
      case "PDF": return <FaFilePdf className="text-red-500" />;
      case "PPT": return <FaFilePowerpoint className="text-orange-500" />;
      case "DOC": return <FaFileWord className="text-blue-500" />;
      case "Video": return <FaVideo className="text-purple-500" />;
      default: return <FaFilePdf className="text-red-500" />;
    }
  };

  const getIconBg = (type) => {
    switch(type) {
      case "PDF": return "bg-red-50";
      case "PPT": return "bg-orange-50";
      case "DOC": return "bg-blue-50";
      case "Video": return "bg-purple-50";
      default: return "bg-gray-50";
    }
  };

  const stats = useMemo(() => {
    return {
      totalResources: resources.length,
      downloads: resources.reduce((sum, item) => sum + item.downloads, 0),
      saved: resources.filter((item) => item.saved).length,
      courses: new Set(resources.map((item) => item.course)).size,
    };
  }, [resources]);

  const filteredResources = resources.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) ||
                         item.description.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === "All" || item.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleUploadSubmit = (e) => {
    e.preventDefault();

    if (!formData.title || !formData.course || !formData.type) {
      setMessageModal({
        show: true,
        type: "error",
        message: "Please fill all required fields.",
      });
      return;
    }

    const newResource = {
      id: Date.now(),
      title: formData.title,
      course: formData.course,
      type: formData.type,
      size: formData.size || "1.0 MB",
      downloads: 0,
      saved: false,
      uploadedBy: formData.uploadedBy || "Current User",
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: formData.status,
      iconType: formData.type,
      description: formData.description || "No description provided",
    };

    setResources((prev) => [newResource, ...prev]);

    setFormData({
      title: "",
      course: "",
      type: "",
      size: "",
      uploadedBy: "",
      status: "Public",
      description: "",
    });

    setShowUploadModal(false);

    setTimeout(() => {
      setMessageModal({
        show: true,
        type: "success",
        message: "Resource Successfully Added!",
      });
    }, 200);
  };

  const handleSaveResource = (id) => {
    setResources(prev => prev.map(resource =>
      resource.id === id ? { ...resource, saved: !resource.saved } : resource
    ));
    setMessageModal({
      show: true,
      type: "success",
      message: "Resource saved to your library!",
    });
    setTimeout(() => {
      setMessageModal({ show: false, type: "", message: "" });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header Section */}
      <div className="flex items-center justify-between -mb-5 px-6 pt-6 ">
                <p className="text-sm text-gray-400">
                  <Link to="/student/dashboard" className="hover:text-blue-600 transition">
                    Dashboard
                  </Link>
                  <span className="mx-2">&gt;</span>
                  <span className="text-gray-600 font-medium">Resources</span>
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 pl-2 border-l border-gray-200"></div>
                </div>
              </div>
      <div className="max-w-7xl mx-auto px-5 py-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Learning Resources</h1>
                <p className="text-sm text-gray-500">Access study materials, notes, and educational content</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowUploadModal(true)}
            className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold flex items-center gap-2 hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg"
          >
            <FaPlus className="text-sm" />
            Upload Resource
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 py-6 -mt-5">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition">
            <div className="flex items-center gap-3">
              <div className="w-[52px] h-[52px] rounded-xl bg-blue-50 flex items-center justify-center">
                <MdQuiz className="text-blue-600 text-[24px]" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Total Resources</p>
                <h2 className="text-2xl font-bold text-gray-800">{stats.totalResources}</h2>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition">
            <div className="flex items-center gap-3">
              <div className="w-[52px] h-[52px] rounded-xl bg-green-50 flex items-center justify-center">
                <FaArrowDown className="text-green-600 text-[22px]" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Total Downloads</p>
                <h2 className="text-2xl font-bold text-gray-800">{stats.downloads}</h2>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition">
            <div className="flex items-center gap-3">
              <div className="w-[52px] h-[52px] rounded-xl bg-yellow-50 flex items-center justify-center">
                <FaBookmark className="text-yellow-600 text-[22px]" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Saved Items</p>
                <h2 className="text-2xl font-bold text-gray-800">{stats.saved}</h2>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition">
            <div className="flex items-center gap-3">
              <div className="w-[52px] h-[52px] rounded-xl bg-purple-50 flex items-center justify-center">
                <FaGraduationCap className="text-purple-600 text-[22px]" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Courses Covered</p>
                <h2 className="text-2xl font-bold text-gray-800">{stats.courses}</h2>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search resources by title, description, or course..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              />
            </div>
            
            <div className="relative">
              <button
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className="h-11 px-5 border border-gray-200 rounded-lg flex items-center gap-2 text-gray-700 hover:bg-gray-50 transition"
              >
                <FaFilter className="text-sm" />
                <span className="font-medium">Filter: {filterType}</span>
                <FaChevronDown className={`text-xs transition-transform ${showFilterDropdown ? 'rotate-180' : ''}`} />
              </button>

              {showFilterDropdown && (
                <div className="absolute top-12 right-0 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-30 py-2 animate-fadeIn">
                  {filterOptions.map((type) => (
                    <button
                      key={type}
                      onClick={() => {
                        setFilterType(type);
                        setShowFilterDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-all duration-200 ${
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
          </div>
        </div>

        {/* Upload Area & Categories */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 mb-6">
          {/* Upload Area */}
          <div
            onClick={() => setShowUploadModal(true)}
            className="xl:col-span-3 bg-white rounded-xl border-2 border-dashed border-blue-300 p-8 flex items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-all"
          >
            <div className="text-center">
              <FaCloudUploadAlt className="text-blue-500 text-5xl mx-auto mb-3" />
              <h3 className="text-xl font-bold text-gray-800 mb-1">
                Drag & Drop Resources Here
              </h3>
              <p className="text-gray-500 text-sm">
                Support for PDF, PPT, DOC, Video files up to 100MB
              </p>
              <button className="mt-4 px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition shadow-sm">
                Browse Files
              </button>
            </div>
          </div>

          {/* Categories Card */}
          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <MdFolder className="text-blue-600" />
              Categories
            </h3>

            {filterOptions.filter(f => f !== "All").map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`w-full flex items-center justify-between py-2.5 px-3 rounded-lg transition-all duration-200 ${
                  filterType === type
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <div className="flex items-center gap-2">
                  {getIcon(type)}
                  <span className="text-sm font-medium">{type}</span>
                </div>
                <span className={`text-sm font-semibold ${
                  filterType === type ? "text-blue-600" : "text-gray-500"
                }`}>
                  {resources.filter((item) => item.type === type).length}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Resources Grid */}
        {filteredResources.length > 0 ? (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {filteredResources.map((item) => (
              <div
                key={item.id}
                className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="h-1 bg-gradient-to-r from-blue-500 to-blue-600"></div>
                
                <div className="p-4">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={`w-[54px] h-[54px] rounded-xl ${getIconBg(item.iconType)} flex items-center justify-center text-2xl shrink-0`}>
                      {getIcon(item.iconType)}
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* Header */}
                      <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-gray-400">
            <Link to="/student/dashboard" className="hover:text-blue-600 transition">
              Dashboard
            </Link>
            <span className="mx-2">&gt;</span>
            <span className="text-gray-600 font-medium">Resources</span>
          </p>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 pl-2 border-l border-gray-200"></div>
          </div>
        </div>
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex-1 min-w-0">
                          <h2 className="text-lg font-bold text-gray-800 truncate hover:text-blue-600 transition">
                            {item.title}
                          </h2>
                          <p className="text-gray-500 text-xs mt-1">
                            {item.course} • {item.type} • {item.size}
                          </p>
                        </div>

                        <span
                          className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-medium ${
                            item.status === "Public"
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {item.description}
                      </p>

                      {/* Meta Info */}
                      <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 mb-3">
                        <span className="flex items-center gap-1">
                          <FaUserGraduate className="text-blue-500" />
                          {item.uploadedBy}
                        </span>
                        <span className="flex items-center gap-1">
                          <FaCalendarAlt className="text-gray-400" />
                          {item.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <FaDownload className="text-green-500" />
                          {item.downloads} downloads
                        </span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-2">
                        <button className="h-[34px] px-3 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium flex items-center gap-1.5 hover:bg-blue-100 transition">
                          <FaEye size={12} />
                          Preview
                        </button>

                        <button 
                          onClick={() => handleSaveResource(item.id)}
                          className={`h-[34px] px-3 rounded-lg text-sm font-medium flex items-center gap-1.5 transition ${
                            item.saved
                              ? "bg-yellow-50 text-yellow-600 hover:bg-yellow-100"
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          }`}
                        >
                          <FaStar size={12} />
                          {item.saved ? "Saved" : "Save"}
                        </button>

                        <button className="h-[34px] px-3 bg-blue-600 text-white rounded-lg text-sm font-medium flex items-center gap-1.5 hover:bg-blue-700 transition shadow-sm">
                          <FaDownload size={12} />
                          Download
                        </button>

                        <button className="h-[34px] px-3 text-gray-500 hover:text-blue-600 rounded-lg text-sm flex items-center gap-1.5 transition">
                          <FaShare size={12} />
                          Share
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-200">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaFilePdf className="text-4xl text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No resources found</h3>
            <p className="text-gray-500 mb-4">Try adjusting your search or filter criteria</p>
            <button
              onClick={() => {
                setSearch("");
                setFilterType("All");
              }}
              className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Upload New Resource</h2>
                <p className="text-sm text-gray-500 mt-1">Share learning materials with the community</p>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition"
              >
                <FaTimes className="text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Resource Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter resource title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Course <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={formData.course}
                    onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none appearance-none cursor-pointer bg-white"
                    required
                  >
                    <option value="">Select Course</option>
                    <option value="React JS">React JS</option>
                    <option value="JavaScript">JavaScript</option>
                    <option value="Frontend Design">Frontend Design</option>
                    <option value="Node.js">Node.js</option>
                    <option value="Python">Python</option>
                  </select>
                  <FaChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none text-sm" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  File Type <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none appearance-none cursor-pointer bg-white"
                    required
                  >
                    <option value="">Select File Type</option>
                    <option value="PDF">PDF Document</option>
                    <option value="PPT">PowerPoint Presentation</option>
                    <option value="DOC">Word Document</option>
                    <option value="Video">Video File</option>
                  </select>
                  <FaChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none text-sm" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  placeholder="Brief description of the resource"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="3"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    File Size
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., 2.5 MB"
                    value={formData.size}
                    onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Status
                  </label>
                  <div className="relative">
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none appearance-none cursor-pointer bg-white"
                    >
                      <option value="Public">Public</option>
                      <option value="Private">Private</option>
                    </select>
                    <FaChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none text-sm" />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-5 py-2.5 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition shadow-md"
                >
                  Upload Resource
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Message Modal */}
      {messageModal.show && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-3">
          <div className="w-96 bg-white rounded-2xl p-6 shadow-xl text-center animate-fadeIn">
            <div
              className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center text-3xl mb-4 ${
                messageModal.type === "success"
                  ? "bg-green-100 text-green-600"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {messageModal.type === "success" ? "✓" : "!"}
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {messageModal.type === "success" ? "Success!" : "Error!"}
            </h2>

            <p className="text-gray-500 mb-6">{messageModal.message}</p>

            <button
              type="button"
              onClick={() =>
                setMessageModal({
                  show: false,
                  type: "",
                  message: "",
                })
              }
              className={`w-full py-2.5 rounded-lg text-white font-semibold ${
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

export default Resources;