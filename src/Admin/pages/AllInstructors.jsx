import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  UserPlus,
  Star,
  Edit,
  Trash2,
  X,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Copy,
  Archive,
  Download,
  Eye,
  CheckSquare,
  Square,
  Users,
  BookOpen,
  Award,
  TrendingUp,
  TrendingDown,
  Calendar,
  User,
  Mail,
  Phone,
  Briefcase,
  GraduationCap,
} from "lucide-react";

// ------------------------------------------------------------
// Professional Instructors Management - Table Format
// Matches AllCourses styling: clean table, reduced spacing
// ------------------------------------------------------------
const InstructorsManagement = () => {
  // ---------- Mock Data ----------
  const [instructors, setInstructors] = useState([
    {
      id: 1,
      name: "Dr. Rahul Sharma",
      email: "rahul.sharma@example.com",
      phone: "+91 98765 43210",
      department: "Computer Science",
      specialization: "React, Node.js, TypeScript",
      courses: 6,
      students: 3240,
      rating: 4.8,
      experience: "8 years",
      location: "Mumbai, India",
      status: "active",
      joinedDate: "Jan 15, 2022",
      avatar: "RS",
      trend: "+12%",
    },
    {
      id: 2,
      name: "Prof. Priya Reddy",
      email: "priya.reddy@example.com",
      phone: "+91 87654 32109",
      department: "Design",
      specialization: "UI/UX Design, Figma, Adobe XD",
      courses: 4,
      students: 1890,
      rating: 4.6,
      experience: "5 years",
      location: "Hyderabad, India",
      status: "active",
      joinedDate: "Mar 10, 2022",
      avatar: "PR",
      trend: "+8%",
    },
    {
      id: 3,
      name: "Mr. Arjun Kumar",
      email: "arjun.kumar@example.com",
      phone: "+91 76543 21098",
      department: "Data Science",
      specialization: "Python, Machine Learning, AI",
      courses: 5,
      students: 2780,
      rating: 4.7,
      experience: "6 years",
      location: "Bangalore, India",
      status: "inactive",
      joinedDate: "Jun 05, 2022",
      avatar: "AK",
      trend: "-3%",
    },
    {
      id: 4,
      name: "Ms. Sneha Patel",
      email: "sneha.patel@example.com",
      phone: "+91 65432 10987",
      department: "Marketing",
      specialization: "Digital Marketing, SEO, Analytics",
      courses: 3,
      students: 1450,
      rating: 4.5,
      experience: "4 years",
      location: "Ahmedabad, India",
      status: "active",
      joinedDate: "Aug 20, 2022",
      avatar: "SP",
      trend: "+15%",
    },
    {
      id: 5,
      name: "Dr. Vikram Mehta",
      email: "vikram.mehta@example.com",
      phone: "+91 54321 09876",
      department: "Business",
      specialization: "Leadership, Management, Strategy",
      courses: 7,
      students: 4520,
      rating: 4.9,
      experience: "12 years",
      location: "Delhi, India",
      status: "active",
      joinedDate: "Jan 10, 2021",
      avatar: "VM",
      trend: "+22%",
    },
    {
      id: 6,
      name: "Prof. Anjali Desai",
      email: "anjali.desai@example.com",
      phone: "+91 99887 66554",
      department: "Computer Science",
      specialization: "Cybersecurity, Network Security",
      courses: 4,
      students: 2100,
      rating: 4.7,
      experience: "7 years",
      location: "Pune, India",
      status: "active",
      joinedDate: "Feb 18, 2022",
      avatar: "AD",
      trend: "+10%",
    },
  ]);

  // ---------- UI State ----------
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All Departments");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [sortBy, setSortBy] = useState("Newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [showModal, setShowModal] = useState(false);
  const [editInstructor, setEditInstructor] = useState(null);
  const [selectedInstructors, setSelectedInstructors] = useState([]);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [viewInstructor, setViewInstructor] = useState(null);
  const [actionMenu, setActionMenu] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    department: "Computer Science",
    specialization: "",
    experience: "",
    location: "",
    status: "active",
  });

  // ---------- Data Lists ----------
  const departments = [
    "Computer Science",
    "Design",
    "Data Science",
    "Marketing",
    "Business",
  ];

  // Helper functions
  const resetFilters = () => {
    setSearchTerm("");
    setDepartmentFilter("All Departments");
    setStatusFilter("All Status");
    setCurrentPage(1);
  };

  const openAddModal = () => {
    setEditInstructor(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      department: "Computer Science",
      specialization: "",
      experience: "",
      location: "",
      status: "active",
    });
    setShowModal(true);
  };

  const openEditModal = (instructor) => {
    setEditInstructor(instructor);
    setFormData(instructor);
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editInstructor) {
      setInstructors(
        instructors.map((inst) =>
          inst.id === editInstructor.id
            ? { ...formData, id: editInstructor.id, avatar: formData.name.charAt(0) + (formData.name.split(" ")[1]?.charAt(0) || "") }
            : inst
        )
      );
    } else {
      const newInstructor = {
        ...formData,
        id: Date.now(),
        courses: 0,
        students: 0,
        rating: 0,
        joinedDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        avatar: formData.name.charAt(0) + (formData.name.split(" ")[1]?.charAt(0) || ""),
        trend: "0%",
      };
      setInstructors([newInstructor, ...instructors]);
    }
    setShowModal(false);
  };

  const handleDeleteClick = (id) => {
    setDeleteConfirm({ type: "single", id });
  };

  const confirmDelete = () => {
    if (!deleteConfirm) return;
    if (deleteConfirm.type === "single") {
      setInstructors(instructors.filter((i) => i.id !== deleteConfirm.id));
      setSelectedInstructors(selectedInstructors.filter((id) => id !== deleteConfirm.id));
    } else if (deleteConfirm.type === "bulk") {
      setInstructors(instructors.filter((i) => !deleteConfirm.ids.includes(i.id)));
      setSelectedInstructors([]);
    }
    setDeleteConfirm(null);
  };

  const duplicateInstructor = (instructor) => {
    const newInstructor = {
      ...instructor,
      id: Date.now(),
      name: `${instructor.name} (Copy)`,
      email: `copy_${instructor.email}`,
      courses: 0,
      students: 0,
      joinedDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      trend: "0%",
    };
    setInstructors([newInstructor, ...instructors]);
    setActionMenu(null);
  };

  const archiveInstructor = (id) => {
    setInstructors(instructors.map(i => i.id === id ? { ...i, status: "archived" } : i));
    setActionMenu(null);
  };

  const toggleSelectInstructor = (id) => {
    setSelectedInstructors((prev) =>
      prev.includes(id) ? prev.filter((iid) => iid !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedInstructors.length === paginatedInstructors.length && paginatedInstructors.length > 0) {
      setSelectedInstructors([]);
    } else {
      setSelectedInstructors(paginatedInstructors.map((i) => i.id));
    }
  };

  const handleBulkDelete = () => {
    if (selectedInstructors.length === 0) return;
    setDeleteConfirm({ type: "bulk", ids: [...selectedInstructors] });
  };

  const exportToCSV = () => {
    const headers = ["ID", "Name", "Email", "Department", "Specialization", "Courses", "Students", "Rating", "Status", "Experience", "Location"];
    const rows = filteredInstructors.map((i) => [
      i.id,
      i.name,
      i.email,
      i.department,
      i.specialization,
      i.courses,
      i.students,
      i.rating,
      i.status,
      i.experience,
      i.location,
    ]);
    const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "instructors_export.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  // Filtering & Sorting
  const filteredInstructors = useMemo(() => {
    let result = [...instructors.filter(i => i.status !== "archived")];

    result = result.filter((instructor) => {
      const matchesSearch =
        instructor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        instructor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        instructor.department.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDepartment = departmentFilter === "All Departments" || instructor.department === departmentFilter;
      const matchesStatus = statusFilter === "All Status" || instructor.status === statusFilter;
      return matchesSearch && matchesDepartment && matchesStatus;
    });

    if (sortBy === "Students") {
      result.sort((a, b) => b.students - a.students);
    } else if (sortBy === "Courses") {
      result.sort((a, b) => b.courses - a.courses);
    } else if (sortBy === "Rating") {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "Newest") {
      result.sort((a, b) => new Date(b.joinedDate) - new Date(a.joinedDate));
    }
    return result;
  }, [instructors, searchTerm, departmentFilter, statusFilter, sortBy]);

  const totalPages = Math.ceil(filteredInstructors.length / itemsPerPage);
  const paginatedInstructors = filteredInstructors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Stats
  const totalInstructors = instructors.filter(i => i.status !== "archived").length;
  const activeInstructors = instructors.filter(i => i.status === "active").length;
  const inactiveInstructors = instructors.filter(i => i.status === "inactive").length;
  const totalStudents = instructors.reduce((sum, i) => sum + i.students, 0);

  const getTrendIcon = (trend) => {
    const val = parseFloat(trend);
    if (val > 0) return <TrendingUp size={12} className="text-green-600" />;
    if (val < 0) return <TrendingDown size={12} className="text-red-600" />;
    return null;
  };

  const getDepartmentColor = (department) => {
    const map = {
      "Computer Science": "bg-teal-50 text-teal-700",
      "Design": "bg-amber-50 text-amber-700",
      "Data Science": "bg-purple-50 text-purple-700",
      "Marketing": "bg-pink-50 text-pink-700",
      "Business": "bg-blue-50 text-blue-700",
    };
    return map[department] || "bg-gray-50 text-gray-700";
  };

  return (
    <div className="min-h-screen bg-gray-50">
       <div>
  <p className="text-sm text-gray-400 mb-1 flex items-center pl-5 mt-4">
    <Link
      to="/admin/dashboard"
      className="hover:text-[#2BB2A9] transition"
    >
      Dashboard
    </Link>

    <span className="mx-2">&gt;</span>

    <span className="text-none font-medium">
      All Instructors
    </span>
  </p>
</div>
      {/* Header */}
        <div className="max-w-7xl mx-auto px-6 py-4 -mt-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Instructors Management</h1>
              <p className="text-sm text-gray-500 mt-0.5">Manage your teaching staff, track performance, and monitor engagement</p>
            </div>
            <button onClick={openAddModal} className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition shadow-sm">
              <UserPlus size={18} />
              Add Instructor
            </button>
          </div>
        </div>
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-5 py-6 -mt-4">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard icon={<Users size={18} />} title="Total Instructors" value={totalInstructors} trend="+3" color="teal" />
          <StatCard icon={<Award size={18} />} title="Active" value={activeInstructors} trend="+2" color="green" />
          <StatCard icon={<UserPlus size={18} />} title="Inactive" value={inactiveInstructors} trend="-1" color="amber" />
          <StatCard icon={<GraduationCap size={18} />} title="Total Students" value={totalStudents} trend="+18%" color="blue" />
        </div>

        {/* Filter Bar & Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden   shadow-sm">
          {/* Filters */}
          <div className="p-4 flex flex-wrap items-center gap-3 border-b border-gray-100">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search by name, email or department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-1.5 text-sm focus:ring-1 focus:ring-teal-500 focus:border-teal-500 outline-none"
              />
            </div>
            <SelectBox value={departmentFilter} onChange={setDepartmentFilter}>
              <option>All Departments</option>
              {departments.map(dept => <option key={dept}>{dept}</option>)}
            </SelectBox>
            <SelectBox value={statusFilter} onChange={setStatusFilter}>
              <option>All Status</option>
              <option>active</option>
              <option>inactive</option>
            </SelectBox>
            <SelectBox value={sortBy} onChange={setSortBy}>
              <option>Newest</option>
              <option>Students</option>
              <option>Courses</option>
              <option>Rating</option>
            </SelectBox>
            <button onClick={resetFilters} className="flex items-center gap-1 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 text-sm text-gray-600 transition">
              <X size={14} />
              Clear
            </button>
            <button onClick={exportToCSV} className="flex items-center gap-1 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 text-sm text-gray-600 transition">
              <Download size={14} />
              Export
            </button>
          </div>

          {/* Bulk Actions Bar */}
          {selectedInstructors.length > 0 && (
            <div className="bg-teal-50/40 px-4 py-2 flex items-center justify-between border-b border-gray-100">
              <div className="flex items-center gap-2">
                <CheckSquare size={14} className="text-teal-700" />
                <span className="text-xs font-medium text-teal-800">{selectedInstructors.length} instructor(s) selected</span>
              </div>
              <button onClick={handleBulkDelete} className="flex items-center gap-1 text-xs bg-white border border-red-200 text-red-600 px-2 py-1 rounded hover:bg-red-50 transition">
                <Trash2 size={12} />
                Delete Selected
              </button>
            </div>
          )}

          {/* Instructors Table */}
          <div className="overflow-x-auto scrollbar-hide">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 w-10">
                    <button 
                      onClick={toggleSelectAll} 
                      className="text-gray-400 hover:text-teal-600 transition"
                      disabled={paginatedInstructors.length === 0}
                    >
                      {selectedInstructors.length === paginatedInstructors.length && paginatedInstructors.length > 0 ? 
                        <CheckSquare size={14} /> : <Square size={14} />
                      }
                    </button>
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Instructor</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Department</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Specialization</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Courses</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Students</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Rating</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Joined</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedInstructors.map((instructor) => (
                  <tr key={instructor.id} className="hover:bg-gray-50 transition group">
                    <td className="px-4 py-3">
                      <button onClick={() => toggleSelectInstructor(instructor.id)} className="text-gray-400 hover:text-teal-600 transition">
                        {selectedInstructors.includes(instructor.id) ? <CheckSquare size={14} /> : <Square size={14} />}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center shadow-sm">
                          <span className="text-white font-semibold text-sm">{instructor.avatar}</span>
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900 text-sm">{instructor.name}</h3>
                          <div className="flex items-center gap-2 mt-0.5">
                            <Mail size={11} className="text-gray-400" />
                            <span className="text-xs text-gray-500">{instructor.email}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${getDepartmentColor(instructor.department)}`}>
                        {instructor.department}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs max-w-xs truncate">{instructor.specialization}</td>
                    <td className="px-4 py-3 font-medium text-gray-700 text-sm">{instructor.courses}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <span className="font-medium text-gray-700 text-sm">{instructor.students.toLocaleString()}</span>
                        {instructor.trend && (
                          <div className="flex items-center gap-0.5">
                            {getTrendIcon(instructor.trend)}
                            <span className={`text-xs ${parseFloat(instructor.trend) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {instructor.trend}
                            </span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Star size={12} className="text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-700">{instructor.rating}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        instructor.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}>
                        {instructor.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">{instructor.joinedDate}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button 
                          onClick={() => setViewInstructor(instructor)} 
                          className="p-1.5 rounded border border-gray-200 text-gray-500 hover:bg-gray-50 transition" 
                          title="View details"
                        >
                          <Eye size={14} />
                        </button>
                        <button 
                          onClick={() => openEditModal(instructor)} 
                          className="p-1.5 rounded border border-gray-200 text-gray-500 hover:bg-gray-50 transition" 
                          title="Edit instructor"
                        >
                          <Edit size={14} />
                        </button>
                        <div className="relative">
                          <button 
                            onClick={() => setActionMenu(actionMenu === instructor.id ? null : instructor.id)} 
                            className="p-1.5 rounded border border-gray-200 text-gray-500 hover:bg-gray-50 transition"
                          >
                            <MoreVertical size={14} />
                          </button>
                          {actionMenu === instructor.id && (
                            <div className="absolute right-0 mt-1 w-32 bg-white rounded-lg shadow-lg border border-gray-100 z-20 py-1">
                              <button onClick={() => { duplicateInstructor(instructor); setActionMenu(null); }} className="w-full text-left px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                                <Copy size={12} /> Duplicate
                              </button>
                              <button onClick={() => { archiveInstructor(instructor.id); setActionMenu(null); }} className="w-full text-left px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                                <Archive size={12} /> Archive
                              </button>
                              <button onClick={() => { handleDeleteClick(instructor.id); setActionMenu(null); }} className="w-full text-left px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2">
                                <Trash2 size={12} /> Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
                {paginatedInstructors.length === 0 && (
                  <tr>
                    <td colSpan="10" className="text-center py-16 text-gray-400">
                      <div className="flex flex-col items-center gap-3">
                        <Users size={48} strokeWidth={1} />
                        <p className="text-sm">No instructors found. Try adjusting your filters or add a new instructor.</p>
                        <button onClick={resetFilters} className="text-teal-600 text-sm hover:text-teal-700 font-medium">Clear all filters</button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filteredInstructors.length > 0 && (
            <div className="px-4 py-3 border-t border-gray-100 flex flex-wrap justify-between items-center gap-3">
              <div className="text-xs text-gray-500">
                Showing {paginatedInstructors.length} of {filteredInstructors.length} instructors
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-gray-500">Rows per page:</span>
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
                    className="p-1.5 rounded border border-gray-200 disabled:opacity-50 hover:bg-gray-50 transition"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  <span className="px-3 py-1 bg-teal-600 text-white rounded text-xs font-medium">{currentPage}</span>
                  <button 
                    onClick={() => setCurrentPage(p => Math.min(p+1, totalPages))} 
                    disabled={currentPage === totalPages || totalPages === 0} 
                    className="p-1.5 rounded border border-gray-200 disabled:opacity-50 hover:bg-gray-50 transition"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md shadow-xl">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold text-gray-800">{editInstructor ? "Edit Instructor" : "Add New Instructor"}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 transition"><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-3">
              <input 
                required 
                placeholder="Full name" 
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})} 
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-teal-500 outline-none"
              />
              <input 
                required 
                type="email" 
                placeholder="Email address" 
                value={formData.email} 
                onChange={e => setFormData({...formData, email: e.target.value})} 
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
              />
              <input 
                placeholder="Phone number" 
                value={formData.phone} 
                onChange={e => setFormData({...formData, phone: e.target.value})} 
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
              />
              <select 
                value={formData.department} 
                onChange={e => setFormData({...formData, department: e.target.value})} 
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white"
              >
                {departments.map(dept => <option key={dept}>{dept}</option>)}
              </select>
              <input 
                placeholder="Specialization (e.g., React, Python)" 
                value={formData.specialization} 
                onChange={e => setFormData({...formData, specialization: e.target.value})} 
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
              />
              <input 
                placeholder="Experience (e.g., 5 years)" 
                value={formData.experience} 
                onChange={e => setFormData({...formData, experience: e.target.value})} 
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
              />
              <input 
                placeholder="Location" 
                value={formData.location} 
                onChange={e => setFormData({...formData, location: e.target.value})} 
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
              />
              <select 
                value={formData.status} 
                onChange={e => setFormData({...formData, status: e.target.value})} 
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <button type="submit" className="w-full bg-teal-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-teal-700 transition mt-2">
                {editInstructor ? "Update Instructor" : "Add Instructor"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {viewInstructor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-lg w-full shadow-xl">
            <div className="flex justify-between items-center p-4 border-b bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-800">Instructor Details</h2>
              <button onClick={() => setViewInstructor(null)} className="text-gray-400 hover:text-gray-600 transition"><X size={18} /></button>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex items-center gap-4 pb-3 border-b">
                <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center shadow-sm">
                  <span className="text-white font-bold text-xl">{viewInstructor.avatar}</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">{viewInstructor.name}</h3>
                  <p className="text-sm text-gray-500">{viewInstructor.department}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Star size={14} className="text-yellow-400 fill-current" />
                    <span className="text-sm font-medium">{viewInstructor.rating}</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <Mail size={14} className="text-gray-400" />
                  <span><span className="font-medium">Email:</span> {viewInstructor.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={14} className="text-gray-400" />
                  <span><span className="font-medium">Phone:</span> {viewInstructor.phone || "—"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase size={14} className="text-gray-400" />
                  <span><span className="font-medium">Specialization:</span> {viewInstructor.specialization}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={14} className="text-gray-400" />
                  <span><span className="font-medium">Experience:</span> {viewInstructor.experience || "—"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User size={14} className="text-gray-400" />
                  <span><span className="font-medium">Location:</span> {viewInstructor.location || "—"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={14} className="text-gray-400" />
                  <span><span className="font-medium">Joined:</span> {viewInstructor.joinedDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen size={14} className="text-gray-400" />
                  <span><span className="font-medium">Courses:</span> {viewInstructor.courses}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users size={14} className="text-gray-400" />
                  <span><span className="font-medium">Students:</span> {viewInstructor.students.toLocaleString()}</span>
                </div>
              </div>
            </div>
            <div className="p-4 bg-gray-50 flex justify-end gap-2 rounded-b-lg">
              <button 
                onClick={() => { setViewInstructor(null); openEditModal(viewInstructor); }} 
                className="px-3 py-1.5 bg-teal-600 text-white rounded-lg text-sm hover:bg-teal-700 transition"
              >
                Edit Instructor
              </button>
              <button onClick={() => setViewInstructor(null)} className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-100 transition">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-sm w-full p-5 text-center shadow-xl">
            <div className="mx-auto w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mb-3">
              <Trash2 className="text-red-600" size={20} />
            </div>
            <h3 className="text-md font-semibold text-gray-800">Confirm Deletion</h3>
            <p className="text-gray-500 mt-1 text-sm">
              {deleteConfirm.type === "bulk" 
                ? `Are you sure you want to delete ${deleteConfirm.ids.length} instructor(s)? This action cannot be undone.` 
                : "Are you sure you want to delete this instructor? This action cannot be undone."}
            </p>
            <div className="flex gap-2 mt-5">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 border border-gray-200 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition">
                Cancel
              </button>
              <button onClick={confirmDelete} className="flex-1 bg-red-600 text-white py-2 rounded-lg text-sm hover:bg-red-700 transition">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

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
      className="appearance-none border border-gray-200 rounded-lg px-3 py-1.5 pr-7 bg-white focus:ring-1 focus:ring-teal-500 outline-none text-sm cursor-pointer"
    >
      {children}
    </select>
    <ChevronDown size={12} className="absolute right-2 top-2.5 text-gray-400 pointer-events-none" />
  </div>
);

export default InstructorsManagement;