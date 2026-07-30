import React, { useMemo, useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { adminCourseApi, adminManagement } from "../auth/api";
import {
  BookOpen,
  PlayCircle,
  Clock,
  Users,
  Search,
  Plus,
  Edit,
  Trash2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Code2,
  BarChart3,
  Palette,
  Megaphone,
  Brain,
  X,
  CheckSquare,
  Square,
  Download,
  Eye,
  MoreVertical,
  Copy,
  Archive,
  TrendingUp,
  TrendingDown,
  Calendar,
  User,
  Tag,
  Upload,
  Video,
  ImageIcon,
  FileVideo,
  
} from "lucide-react";

// StatCard Component
const StatCard = ({ icon, title, value, trend, color }) => {
  const colorMap = {
    teal: "bg-teal-50 text-teal-600",
    green: "bg-green-50 text-green-600",
    amber: "bg-amber-50 text-amber-600",
    blue: "bg-blue-50 text-blue-600",
  };
  const trendValue = parseFloat(trend);
  const isPositive = trendValue > 0;
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className={`w-8 h-8 rounded-lg ${colorMap[color]} flex items-center justify-center`}>
          {icon}
        </div>
        {trend && (
          <div className={`flex items-center gap-0.5 text-xs font-medium ${isPositive ? 'text-green-600' : 'text-red-600'} bg-gray-50 px-1.5 py-0.5 rounded`}>
            {isPositive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
            {trend}%
          </div>
        )}
      </div>
      <div className="mt-2">
        <p className="text-gray-500 text-xs">{title}</p>
        <h3 className="text-xl font-bold text-gray-800">{value.toLocaleString()}</h3>
      </div>
    </div>
  );
};

// SelectBox Component
const SelectBox = ({ value, onChange, children }) => (
  <div className="relative">
    <select 
      value={value} 
      onChange={(e) => onChange(e.target.value)} 
      className="appearance-none border border-gray-200 rounded-lg px-3 py-1.5 pr-7 bg-white focus:ring-1 focus:ring-teal-500 focus:border-teal-500 outline-none text-sm cursor-pointer"
    >
      {children}
    </select>
    <ChevronDown size={12} className="absolute right-2 top-2.5 text-gray-400 pointer-events-none" />
  </div>
);

// Rich Text Editor Component
const RichTextEditor = ({ value, onChange, editorRef }) => {
  const [isFocused, setIsFocused] = useState(false);

  const applyFormat = (command) => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    document.execCommand(command, false, null);
    const newContent = editorRef.current.innerHTML;
    onChange(newContent);
  };

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value || "";
    }
  }, [value, editorRef]);

  return (
    <div className="w-full border border-gray-200 rounded-lg overflow-hidden">
      <div className="flex items-center gap-1 bg-gray-50 border-b border-gray-200 px-2 py-1.5 flex-wrap">
        <button type="button" onClick={() => applyFormat("bold")} className="px-2 py-1 text-xs font-bold border rounded hover:bg-white transition-colors">B</button>
        <button type="button" onClick={() => applyFormat("italic")} className="px-2 py-1 text-xs italic border rounded hover:bg-white transition-colors">I</button>
        <button type="button" onClick={() => applyFormat("underline")} className="px-2 py-1 text-xs underline border rounded hover:bg-white transition-colors">U</button>
        <div className="w-px h-5 bg-gray-300 mx-1"></div>
        <button type="button" onClick={() => applyFormat("insertUnorderedList")} className="px-2 py-1 text-xs border rounded hover:bg-white transition-colors">• List</button>
        <button type="button" onClick={() => applyFormat("insertOrderedList")} className="px-2 py-1 text-xs border rounded hover:bg-white transition-colors">1. List</button>
      </div>
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`min-h-[140px] w-full px-4 py-3 text-sm outline-none text-left whitespace-pre-wrap break-words ${
          isFocused ? 'ring-1 ring-teal-500' : ''
        }`}
        style={{ backgroundColor: '#fff' }}
      />
    </div>
  );
};

// Main AdminCourses Component
const AdminCourses = () => {
  const navigate = useNavigate();
  const editorRef = useRef(null);
  const videoInputRef = useRef(null);
  const imageInputRef = useRef(null);
  
  // ---------- API State ----------
  const [courses, setCourses] = useState([]);
  const [instructorsList, setInstructorsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ---------- UI State ----------
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [sortBy, setSortBy] = useState("Newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [showModal, setShowModal] = useState(false);
  const [editCourse, setEditCourse] = useState(null);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [actionMenu, setActionMenu] = useState(null);
  const [editorContent, setEditorContent] = useState("");
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [mediaType, setMediaType] = useState("image");
  const [actionLoading, setActionLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    thumbnailUrl: "",
    promoVideoUrl: "",
    price: "",
    discountPrice: "",
    language: "",
    level: "BEGINNER",
    status: "DRAFT",
    instructorId: "",
    lifetimeAccess: true,
    validityInDays: ""
  });

  // ---------- Data Lists ----------
  const categories = ["Development", "Data Science", "Design", "Programming", "Marketing"];

  const fetchCourses = async () => {
    setLoading(true);
    setError("");
    try {
      let res;
      if (statusFilter === "Pending Publish") {
        res = await adminCourseApi.getPendingPublishRequests(0, 500);
      } else {
        res = await adminCourseApi.getAllCourses(0, 500);
      }
      if (res.data && res.data.data) {
        setCourses(res.data.data.content || []);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch courses catalog from server.");
    } finally {
      setLoading(false);
    }
  };

  const fetchInstructors = async () => {
    try {
      const res = await adminManagement.getAllInstructors(null, 0, 500);
      if (res.data && res.data.data) {
        setInstructorsList(res.data.data.content || []);
      }
    } catch (err) {
      console.error("Failed to fetch instructors list for dropdown", err);
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchInstructors();
  }, [statusFilter]);

  const resetFilters = () => {
    setSearchTerm("");
    setCategoryFilter("All Categories");
    setStatusFilter("All Status");
    setCurrentPage(1);
  };

  const openAddModal = () => {
    navigate("/admin/create-course");
  };

  const openEditModal = (course) => {
    const matchedInst = instructorsList.find(i => i.instructorCode === course.instructorCode);
    const instId = matchedInst ? matchedInst.id : (course.instructorId || "");

    setEditCourse(course);
    setFormData({
      title: course.title || "",
      slug: course.slug || "",
      description: course.description || "",
      thumbnailUrl: course.thumbnailUrl || "",
      promoVideoUrl: course.promoVideoUrl || "",
      price: course.price || "",
      discountPrice: course.discountPrice || "",
      language: course.language || "English",
      level: course.level || "BEGINNER",
      status: course.status || "DRAFT",
      instructorId: instId || "",
      lifetimeAccess: course.lifetimeAccess ?? true,
      validityInDays: course.validityInDays || ""
    });
    setEditorContent(course.description || "");
    setThumbnailPreview(course.thumbnailUrl || "");
    setThumbnailFile(null);
    setVideoPreview(course.promoVideoUrl || "");
    setVideoFile(null);
    setMediaType(course.promoVideoUrl ? "video" : "image");
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!formData.instructorId) {
      alert("Instructor ID is required.");
      return;
    }

    try {
      const payload = new FormData();
      payload.append("title", formData.title.trim());
      payload.append("description", editorContent.trim());
      payload.append("price", formData.price);
      if (formData.discountPrice) {
        payload.append("discountPrice", formData.discountPrice);
      }
      payload.append("language", formData.language || "English");
      payload.append("level", formData.level);
      payload.append("instructorId", parseInt(formData.instructorId, 10));
      payload.append("lifetimeAccess", formData.lifetimeAccess ? "true" : "false");
      
      if (!formData.lifetimeAccess && formData.validityInDays) {
        payload.append("validityInDays", parseInt(formData.validityInDays, 10));
      }

      // Thumbnail
      if (thumbnailFile) {
        payload.append("thumbnailInputType", "FILE_UPLOAD");
        payload.append("thumbnailFile", thumbnailFile);
      } else if (formData.thumbnailUrl) {
        payload.append("thumbnailInputType", "URL");
        payload.append("thumbnailUrl", formData.thumbnailUrl);
      } else {
        payload.append("thumbnailInputType", "URL");
        payload.append("thumbnailUrl", "");
      }

      // Video
      if (videoFile) {
        payload.append("promoVideoInputType", "FILE_UPLOAD");
        payload.append("promoVideoFile", videoFile);
      } else if (formData.promoVideoUrl) {
        payload.append("promoVideoInputType", "URL");
        payload.append("promoVideoUrl", formData.promoVideoUrl);
      } else {
        payload.append("promoVideoInputType", "URL");
        payload.append("promoVideoUrl", "");
      }

      if (editCourse) {
        await adminCourseApi.updateCourse(editCourse.id, payload);
        alert("Course updated successfully!");
      } else {
        await adminCourseApi.createCourse(payload);
        alert("Course created successfully!");
      }

      setShowModal(false);
      fetchCourses();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to save course. Ensure Validity is specified if Lifetime Access is disabled.");
    }
  };

  const handlePublishCourse = async (courseId) => {
    if (window.confirm("Are you sure you want to PUBLISH this course? Students will be able to enroll immediately.")) {
      setActionLoading(true);
      try {
        await adminCourseApi.publishCourse(courseId);
        alert("Course published successfully!");
        fetchCourses();
      } catch (err) {
        console.error(err);
        alert(err.response?.data?.message || "Failed to publish course. Make sure the course contains modules & lessons.");
      } finally {
        setActionLoading(false);
      }
    }
  };

  const handleRejectPublish = async (courseId) => {
    if (window.confirm("Are you sure you want to REJECT the publish request for this course?")) {
      setActionLoading(true);
      try {
        await adminCourseApi.rejectPublishRequest(courseId);
        alert("Publish request rejected successfully.");
        fetchCourses();
      } catch (err) {
        console.error(err);
        alert(err.response?.data?.message || "Failed to reject publish request.");
      } finally {
        setActionLoading(false);
      }
    }
  };

  const handleArchiveCourse = async (courseId) => {
    if (window.confirm("Are you sure you want to ARCHIVE this course?")) {
      setActionLoading(true);
      try {
        await adminCourseApi.archiveCourse(courseId);
        alert("Course archived successfully!");
        fetchCourses();
      } catch (err) {
        console.error(err);
        alert(err.response?.data?.message || "Failed to archive course.");
      } finally {
        setActionLoading(false);
      }
    }
  };

  const toggleSelectCourse = (id) => {
    setSelectedCourses((prev) =>
      prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedCourses.length === paginatedCourses.length && paginatedCourses.length > 0) {
      setSelectedCourses([]);
    } else {
      setSelectedCourses(paginatedCourses.map((c) => c.id));
    }
  };

  const handleBulkArchive = async () => {
    if (selectedCourses.length === 0) return;
    if (window.confirm(`Are you sure you want to archive ${selectedCourses.length} course(s)?`)) {
      setActionLoading(true);
      try {
        await Promise.all(selectedCourses.map(id => adminCourseApi.archiveCourse(id)));
        alert("Selected courses archived successfully!");
        fetchCourses();
        setSelectedCourses([]);
      } catch (err) {
        console.error(err);
        alert("An error occurred during bulk archiving.");
      } finally {
        setActionLoading(false);
      }
    }
  };

  const exportToCSV = () => {
    const headers = ["ID", "Title", "Instructor", "Category", "Price", "Discount Price", "Status", "Publish Requested"];
    const rows = filteredCourses.map((c) => [
      c.id,
      c.title,
      c.instructorName,
      c.category || "Development",
      c.price,
      c.discountPrice || "",
      c.status,
      c.publishRequested ? "YES" : "NO",
    ]);
    const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "courses_export.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  // Filtering & Sorting
  const filteredCourses = useMemo(() => {
    let result = [...courses];

    result = result.filter((course) => {
      const matchesSearch =
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (course.instructorName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (course.category || "Development").toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === "All Categories" || (course.category || "Development") === categoryFilter;
      
      let matchesStatus = true;
      if (statusFilter === "Pending Publish") {
        matchesStatus = course.publishRequested && course.status !== "PUBLISHED";
      } else if (statusFilter !== "All Status") {
        matchesStatus = course.status === statusFilter.toUpperCase();
      }
      return matchesSearch && matchesCategory && matchesStatus;
    });

    if (sortBy === "Students") {
      result.sort((a, b) => (b.studentsEnrolled || 0) - (a.studentsEnrolled || 0));
    } else if (sortBy === "Course Name") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === "Newest") {
      result.sort((a, b) => b.id - a.id);
    }
    return result;
  }, [courses, searchTerm, categoryFilter, statusFilter, sortBy]);

  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);
  const paginatedCourses = filteredCourses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => setCurrentPage(1), [searchTerm, categoryFilter, statusFilter, sortBy, itemsPerPage]);

  // Stats calculation
  const totalCourses = courses.length;
  const publishedCourses = courses.filter(c => c.status === "PUBLISHED").length;
  const draftCourses = courses.filter(c => c.status === "DRAFT").length;
  const totalRequests = courses.filter(c => c.publishRequested && c.status !== "PUBLISHED").length;

  const getIcon = () => (
    <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white bg-teal-600 flex-shrink-0">
      <BookOpen size={18} />
    </div>
  );

  const getCategoryColor = (category) => {
    const map = {
      Development: "bg-teal-50 text-teal-700",
      "Data Science": "bg-purple-50 text-purple-700",
      Design: "bg-amber-50 text-amber-700",
      Programming: "bg-blue-50 text-blue-700",
      Marketing: "bg-pink-50 text-pink-700",
    };
    return map[category || "Development"] || "bg-gray-50 text-gray-700";
  };

  const handleEditorChange = (content) => {
    setEditorContent(content);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setThumbnailPreview(URL.createObjectURL(file));
    setThumbnailFile(file);
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setVideoPreview(URL.createObjectURL(file));
    setVideoFile(file);
  };

  const handleVideoUrlChange = (e) => {
    const url = e.target.value;
    setVideoPreview(url);
    setFormData({ ...formData, promoVideoUrl: url, thumbnailUrl: "" });
    if (url) {
      setMediaType("video");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-5 py-6">
        {/* Breadcrumb */}
        <div className="mb-4">
          <p className="text-sm text-gray-500 flex items-center">
            <Link to="/admin/dashboard" className="hover:text-teal-600 transition no-underline">
              Dashboard
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-700 font-medium">All Courses</span>
          </p>
        </div>
        
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Course Management</h1>
            <p className="text-gray-500 text-sm mt-0.5">Manage your course catalog, track performance, and organize content</p>
          </div>
          <div className="flex gap-2">
            <button onClick={exportToCSV} className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-gray-700 bg-white hover:bg-gray-50 text-sm transition font-semibold cursor-pointer">
              <Download size={16} />
              Export CSV
            </button>
            <button onClick={openAddModal} className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 text-sm transition shadow-sm font-semibold border-none cursor-pointer">
              <Plus size={16} />
              New Course
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard icon={<BookOpen size={18} />} title="Total Courses" value={totalCourses} trend="0%" color="teal" />
          <StatCard icon={<PlayCircle size={18} />} title="Published" value={publishedCourses} trend="0%" color="green" />
          <StatCard icon={<Clock size={18} />} title="Drafts" value={draftCourses} trend="0%" color="amber" />
          <StatCard icon={<Users size={18} />} title="Pending Publish" value={totalRequests} trend="0%" color="blue" />
        </div>

        {/* Filter Bar & Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
          {/* Filters */}
          <div className="p-4 flex flex-wrap items-center gap-3 border-b border-gray-100">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search courses by title, instructor or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-1.5 text-sm focus:ring-1 focus:ring-teal-500 focus:border-teal-500 outline-none"
              />
            </div>
            <SelectBox value={categoryFilter} onChange={setCategoryFilter}>
              <option>All Categories</option>
              {categories.map(cat => <option key={cat}>{cat}</option>)}
            </SelectBox>
            <SelectBox value={statusFilter} onChange={setStatusFilter}>
              <option>All Status</option>
              <option value="Draft">Draft</option>
              <option value="Published">Published</option>
              <option value="Pending Publish">Pending Publish</option>
            </SelectBox>
            <SelectBox value={sortBy} onChange={setSortBy}>
              <option>Newest</option>
              <option>Students</option>
              <option>Course Name</option>
            </SelectBox>
            <button onClick={resetFilters} className="flex items-center gap-1 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 text-sm text-gray-600 transition cursor-pointer">
              <X size={14} />
              Clear
            </button>
          </div>

          {/* Bulk Actions Bar */}
          {selectedCourses.length > 0 && (
            <div className="bg-teal-50/40 px-4 py-2 flex items-center justify-between border-b border-gray-100">
              <div className="flex items-center gap-2">
                <CheckSquare size={14} className="text-teal-700" />
                <span className="text-xs font-medium text-teal-800">{selectedCourses.length} course(s) selected</span>
              </div>
              <div className="flex gap-2">
                <button onClick={handleBulkArchive} className="flex items-center gap-1 text-xs bg-white border border-amber-200 text-amber-600 px-2 py-1 rounded hover:bg-amber-50 transition cursor-pointer">
                  <Archive size={12} />
                  Archive
                </button>
              </div>
            </div>
          )}

          {/* Courses Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 w-10">
                    <button 
                      onClick={toggleSelectAll} 
                      className="text-gray-400 hover:text-teal-600 transition border-none bg-transparent cursor-pointer"
                      disabled={paginatedCourses.length === 0}
                    >
                      {selectedCourses.length === paginatedCourses.length && paginatedCourses.length > 0 ? 
                        <CheckSquare size={14} /> : <Square size={14} />}
                    </button>
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Course</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Instructor</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Category</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Price</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="text-center py-12 text-gray-500">
                      <div className="w-8 h-8 border-4 border-t-teal-600 border-gray-200 rounded-full animate-spin mx-auto mb-2"></div>
                      <span>Loading courses catalog...</span>
                    </td>
                  </tr>
                ) : paginatedCourses.map((course, idx) => (
                  <tr key={course.id} className="hover:bg-gray-50 transition group">
                    <td className="px-4 py-3">
                      <button onClick={() => toggleSelectCourse(course.id)} className="text-gray-400 hover:text-teal-600 transition border-none bg-transparent cursor-pointer">
                        {selectedCourses.includes(course.id) ? <CheckSquare size={14} /> : <Square size={14} />}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {course.thumbnailUrl ? (
                          <img src={course.thumbnailUrl} alt="Thumbnail" className="w-10 h-10 object-cover rounded-lg border border-gray-200" />
                        ) : getIcon()}
                        <div>
                          <h3 className="font-semibold text-gray-900 text-sm">{course.title}</h3>
                          <p className="text-xs text-gray-400 line-clamp-1 max-w-xs">{course.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-700 text-sm font-medium">{course.instructorName || "Unassigned"}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wider ${getCategoryColor(course.category)}`}>
                        {course.category || "Development"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-700 text-sm font-semibold">
                      {course.discountPrice ? `₹${course.discountPrice}` : `₹${course.price}`}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        course.status === "PUBLISHED" 
                          ? "bg-green-100 text-green-700" 
                          : course.publishRequested 
                            ? "bg-blue-100 text-blue-700" 
                            : "bg-yellow-100 text-yellow-700"
                      }`}>
                        {course.status === "PUBLISHED" ? "PUBLISHED" : course.publishRequested ? "PENDING PUBLISH" : course.status || "DRAFT"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <Link 
                          to={`/admin/course-preview/${course.id}`} 
                          className="p-1.5 rounded border border-gray-200 text-gray-500 hover:bg-teal-50 hover:text-teal-600 transition flex items-center justify-center" 
                          title="View course details"
                        >
                          <Eye size={14} />
                        </Link>
                        <button 
                          onClick={() => openEditModal(course)} 
                          className="p-1.5 rounded border border-gray-200 text-gray-500 hover:bg-teal-50 hover:text-teal-600 transition cursor-pointer bg-transparent" 
                          title="Edit course"
                        >
                          <Edit size={14} />
                        </button>
                        <div className="relative">
                          <button 
                            onClick={() => setActionMenu(actionMenu === course.id ? null : course.id)} 
                            className="p-1.5 rounded border border-gray-200 text-gray-500 hover:bg-gray-100 transition cursor-pointer bg-transparent"
                          >
                            <MoreVertical size={14} />
                          </button>
                          {actionMenu === course.id && (
                            <div className="absolute right-0 mt-1 w-36 bg-white rounded-lg shadow-lg border border-gray-100 z-20 py-1 font-semibold text-xs">
                              {course.publishRequested && course.status !== "PUBLISHED" && (
                                <>
                                  <button onClick={() => { handlePublishCourse(course.id); setActionMenu(null); }} className="w-full text-left px-3 py-1.5 text-teal-600 hover:bg-teal-50 flex items-center gap-2 border-none bg-transparent cursor-pointer">
                                    <CheckSquare size={12} /> Publish
                                  </button>
                                  <button onClick={() => { handleRejectPublish(course.id); setActionMenu(null); }} className="w-full text-left px-3 py-1.5 text-red-600 hover:bg-red-50 flex items-center gap-2 border-none bg-transparent cursor-pointer">
                                    <X size={12} /> Reject Request
                                  </button>
                                </>
                              )}
                              {course.status === "PUBLISHED" && (
                                <button onClick={() => { handleArchiveCourse(course.id); setActionMenu(null); }} className="w-full text-left px-3 py-1.5 text-amber-600 hover:bg-amber-50 flex items-center gap-2 border-none bg-transparent cursor-pointer">
                                  <Archive size={12} /> Archive
                                </button>
                              )}
                              <button onClick={() => { alert("Deletion is disabled on the frontend. Re-assign or archive the course instead."); setActionMenu(null); }} className="w-full text-left px-3 py-1.5 text-gray-400 hover:bg-gray-50 flex items-center gap-2 border-none bg-transparent cursor-pointer">
                                <Trash2 size={12} /> Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
                {!loading && paginatedCourses.length === 0 && (
                  <tr>
                    <td colSpan="7" className="text-center py-16 text-gray-400">
                      <div className="flex flex-col items-center gap-3">
                        <BookOpen size={48} strokeWidth={1} />
                        <p className="text-sm font-medium">No courses found matching this catalog filter.</p>
                        <button onClick={resetFilters} className="text-teal-600 text-sm hover:text-teal-700 font-semibold border-none bg-transparent cursor-pointer">Clear all filters</button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-4 py-3 border-t border-gray-100 flex flex-wrap justify-between items-center gap-3">
            <div className="text-xs text-gray-500">
              Showing {paginatedCourses.length} of {filteredCourses.length} courses
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-gray-500 font-medium">Rows per page:</span>
                <select 
                  value={itemsPerPage} 
                  onChange={(e) => setItemsPerPage(Number(e.target.value))} 
                  className="border border-gray-200 rounded px-2 py-1 text-xs bg-white focus:ring-1 focus:ring-teal-500"
                >
                  {[8, 16, 24, 32].map(num => <option key={num}>{num}</option>)}
                </select>
              </div>
              <div className="flex gap-1.5">
                <button 
                  onClick={() => setCurrentPage(p => Math.max(p-1, 1))} 
                  disabled={currentPage === 1} 
                  className="p-1.5 rounded border border-gray-200 disabled:opacity-50 hover:bg-gray-50 transition cursor-pointer bg-white"
                >
                  <ChevronLeft size={14} />
                </button>
                <span className="px-3 py-1 bg-teal-600 text-white rounded text-xs font-semibold">{currentPage}</span>
                <button 
                  onClick={() => setCurrentPage(p => Math.min(p+1, totalPages))} 
                  disabled={currentPage === totalPages || totalPages === 0} 
                  className="p-1.5 rounded border border-gray-200 disabled:opacity-50 hover:bg-gray-50 transition cursor-pointer bg-white"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden" style={{ maxHeight: "90vh" }}>
            <div className="flex justify-between items-center px-6 py-4 border-b sticky top-0 bg-white z-10">
              <h2 className="text-base font-bold text-gray-800">{editCourse ? "Edit Course Content" : "Create New Course"}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 transition border-none bg-transparent cursor-pointer">
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto" style={{ maxHeight: "calc(90vh - 70px)" }}>
              {error && (
                <div className="p-3 bg-red-50 text-red-700 rounded-lg text-xs font-semibold">
                  ⚠️ {error}
                </div>
              )}

              {/* Course Title */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Course Title <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  placeholder="e.g., Search Engine Optimization (SEO)"
                  value={formData.title}
                  onChange={(e) => {
                    const title = e.target.value;
                    setFormData({
                      ...formData,
                      title,
                      slug: title
                        .toLowerCase()
                        .replace(/[^a-z0-9\s-]/g, "")
                        .trim()
                        .replace(/\s+/g, "-"),
                    });
                  }}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-teal-500 outline-none bg-gray-50/50"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Slug (URL)</label>
                <input
                  type="text"
                  placeholder="auto-generated from title"
                  value={formData.slug}
                  readOnly
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-100 text-gray-400 cursor-not-allowed"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <RichTextEditor value={editorContent} onChange={handleEditorChange} editorRef={editorRef} />
              </div>

              {/* Media Type Selection */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Media Type</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setMediaType("image")}
                    className={`flex-1 py-2 rounded-lg text-xs font-semibold transition flex items-center justify-center gap-2 border-none cursor-pointer ${
                      mediaType === "image"
                        ? "bg-teal-600 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    <ImageIcon size={14} />
                    Image File
                  </button>
                  <button
                    type="button"
                    onClick={() => setMediaType("video")}
                    className={`flex-1 py-2 rounded-lg text-xs font-semibold transition flex items-center justify-center gap-2 border-none cursor-pointer ${
                      mediaType === "video"
                        ? "bg-teal-600 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    <Video size={14} />
                    Video Promo
                  </button>
                </div>
              </div>

              {/* Image Upload */}
              {mediaType === "image" && (
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Course Thumbnail</label>
                  <label className="border-2 border-dashed border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer hover:border-teal-500 transition bg-gray-50/50">
                    {thumbnailPreview ? (
                      <img src={thumbnailPreview} alt="Thumbnail Preview" className="w-full h-40 object-cover rounded-lg" />
                    ) : (
                      <>
                        <Upload className="text-gray-400 mb-2" size={24} />
                        <p className="text-xs text-gray-600 font-semibold">Click to upload thumbnail image</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">PNG, JPG, JPEG supported</p>
                      </>
                    )}
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" ref={imageInputRef} />
                  </label>
                  <div className="mt-2">
                    <span className="text-xs text-gray-500 font-medium">Or enter image URL:</span>
                    <input type="text" value={formData.thumbnailUrl} onChange={(e) => {
                      setFormData({ ...formData, thumbnailUrl: e.target.value });
                      setThumbnailPreview(e.target.value || "");
                      setThumbnailFile(null);
                    }} placeholder="https://domain.com/photo.jpg" className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-teal-500 mt-1" />
                  </div>
                </div>
              )}

              {/* Video Upload */}
              {mediaType === "video" && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Upload Video File</label>
                    <label className="border-2 border-dashed border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer hover:border-teal-500 transition bg-gray-50/50">
                      {videoPreview ? (
                        <video controls className="w-full h-40 object-cover rounded-lg">
                          <source src={videoPreview} type="video/mp4" />
                        </video>
                      ) : (
                        <>
                          <FileVideo className="text-gray-400 mb-2" size={24} />
                          <p className="text-xs text-gray-600 font-semibold">Click to upload video file</p>
                          <p className="text-[10px] text-gray-400 mt-0.5">MP4, WebM formats up to 2GB</p>
                        </>
                      )}
                      <input type="file" accept="video/*" onChange={handleVideoUpload} className="hidden" ref={videoInputRef} />
                    </label>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Or Enter Video URL</label>
                    <input
                      type="text"
                      placeholder="https://example.com/video.mp4"
                      value={formData.promoVideoUrl}
                      onChange={handleVideoUrlChange}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-teal-500 outline-none bg-gray-50/50"
                    />
                  </div>
                </>
              )}

              {/* Price and Discount Price */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Price (₹) <span className="text-red-500">*</span></label>
                  <input required type="number" placeholder="0.00" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-teal-500 outline-none bg-gray-50/50" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Discount Price (₹)</label>
                  <input type="number" placeholder="0.00" value={formData.discountPrice} onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-teal-500 outline-none bg-gray-50/50" />
                </div>
              </div>

              {/* Language and Level */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Language <span className="text-red-500">*</span></label>
                  <input required placeholder="e.g., English" value={formData.language} onChange={(e) => setFormData({ ...formData, language: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-teal-500 outline-none bg-gray-50/50" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Level <span className="text-red-500">*</span></label>
                  <select required value={formData.level} onChange={(e) => setFormData({ ...formData, level: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:ring-1 focus:ring-teal-500 outline-none">
                    <option value="BEGINNER">Beginner</option>
                    <option value="INTERMEDIATE">Intermediate</option>
                    <option value="ADVANCED">Advanced</option>
                  </select>
                </div>
              </div>

              {/* Validity access toggles */}
              <div className="bg-gray-50 border border-gray-200/60 rounded-xl p-4 space-y-3">
                <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.lifetimeAccess}
                    onChange={(e) => setFormData(p => ({
                      ...p,
                      lifetimeAccess: e.target.checked,
                      validityInDays: e.target.checked ? "" : p.validityInDays
                    }))}
                    className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                  />
                  Lifetime Course Access
                </label>

                {!formData.lifetimeAccess && (
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Validity in Days <span className="text-red-400">*</span></label>
                    <input
                      type="number"
                      value={formData.validityInDays}
                      onChange={(e) => setFormData({ ...formData, validityInDays: e.target.value })}
                      placeholder="e.g. 365"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-teal-500 outline-none bg-white"
                      required
                    />
                  </div>
                )}
              </div>

              {/* Instructor Selection */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Assign Instructor <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.instructorId}
                  onChange={(e) => setFormData({ ...formData, instructorId: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:ring-1 focus:ring-teal-500 outline-none"
                >
                  <option value="">Select Instructor</option>
                  {instructorsList.map((inst) => (
                    <option key={inst.id} value={inst.id}>
                      {inst.fullName} ({inst.instructorCode})
                    </option>
                  ))}
                </select>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button type="submit" className="flex-1 bg-teal-600 text-white py-2 rounded-lg text-sm font-bold hover:bg-teal-700 transition border-none cursor-pointer">
                  {editCourse ? "Save Changes" : "Create Course"}
                </button>
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 border border-gray-200 text-gray-700 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50 transition bg-transparent cursor-pointer">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCourses;