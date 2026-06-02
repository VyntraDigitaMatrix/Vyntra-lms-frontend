import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  UserPlus,
  Eye,
  Edit,
  Trash2,
  Filter,
  Download,
  Mail,
  MoreVertical,
  GraduationCap,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  Users
} from "lucide-react";

const AllStudents = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
const [showStudentModal, setShowStudentModal] = useState(false);

const handleViewStudent = (student) => {
  setSelectedStudent(student);
  setShowStudentModal(true);
};

  // Mock Students Data
  const studentsData = [
    { id: 1, name: "Alice Johnson", email: "alice@example.com", course: "Web Development", progress: 75, status: "active", enrollmentDate: "2024-01-15", lastActive: "2024-03-20", completedCourses: 3, totalCourses: 5, averageGrade: 85, phone: "+1 234-567-8901", country: "USA" },
    { id: 2, name: "Bob Smith", email: "bob@example.com", course: "Data Science", progress: 45, status: "active", enrollmentDate: "2024-02-01", lastActive: "2024-03-19", completedCourses: 2, totalCourses: 6, averageGrade: 78, phone: "+1 234-567-8902", country: "Canada" },
    { id: 3, name: "Carol Davis", email: "carol@example.com", course: "UI/UX Design", progress: 90, status: "inactive", enrollmentDate: "2023-12-10", lastActive: "2024-03-15", completedCourses: 4, totalCourses: 4, averageGrade: 92, phone: "+1 234-567-8903", country: "UK" },
    { id: 4, name: "David Wilson", email: "david@example.com", course: "Web Development", progress: 60, status: "active", enrollmentDate: "2024-01-20", lastActive: "2024-03-18", completedCourses: 3, totalCourses: 5, averageGrade: 82, phone: "+1 234-567-8904", country: "Australia" },
    { id: 5, name: "Emma Brown", email: "emma@example.com", course: "Data Science", progress: 85, status: "active", enrollmentDate: "2024-01-10", lastActive: "2024-03-21", completedCourses: 5, totalCourses: 6, averageGrade: 88, phone: "+1 234-567-8905", country: "USA" },
    { id: 6, name: "Frank Miller", email: "frank@example.com", course: "UI/UX Design", progress: 30, status: "suspended", enrollmentDate: "2024-02-15", lastActive: "2024-03-10", completedCourses: 1, totalCourses: 4, averageGrade: 65, phone: "+1 234-567-8906", country: "Canada" },
    { id: 7, name: "Grace Lee", email: "grace@example.com", course: "Web Development", progress: 95, status: "active", enrollmentDate: "2023-11-01", lastActive: "2024-03-21", completedCourses: 4, totalCourses: 5, averageGrade: 94, phone: "+1 234-567-8907", country: "UK" },
    { id: 8, name: "Henry Taylor", email: "henry@example.com", course: "Data Science", progress: 55, status: "active", enrollmentDate: "2024-01-25", lastActive: "2024-03-17", completedCourses: 3, totalCourses: 6, averageGrade: 75, phone: "+1 234-567-8908", country: "Australia" },
  ];

  const courses = ["Web Development", "Data Science", "UI/UX Design"];
  const statuses = ["active", "inactive", "suspended"];

  // Filter students
  const filteredStudents = studentsData.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "all" || student.status === selectedStatus;
    const matchesCourse = selectedCourse === "all" || student.course === selectedCourse;
    return matchesSearch && matchesStatus && matchesCourse;
  });

  // Sort students
  const sortedStudents = [...filteredStudents].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];
    
    if (sortField === "name") {
      aVal = a.name;
      bVal = b.name;
    } else if (sortField === "progress") {
      aVal = a.progress;
      bVal = b.progress;
    } else if (sortField === "enrollmentDate") {
      aVal = new Date(a.enrollmentDate);
      bVal = new Date(b.enrollmentDate);
    }
    
    if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
    if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentStudents = sortedStudents.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedStudents.length / itemsPerPage);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleSelectAll = () => {
    if (selectedStudents.length === currentStudents.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(currentStudents.map(s => s.id));
    }
  };

  const handleSelectStudent = (id) => {
    if (selectedStudents.includes(id)) {
      setSelectedStudents(selectedStudents.filter(sid => sid !== id));
    } else {
      setSelectedStudents([...selectedStudents, id]);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'suspended': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 70) return 'from-[#2BB2A9] to-[#249b93]';
    if (progress >= 40) return 'from-yellow-500 to-yellow-600';
    return 'from-red-500 to-red-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="p-6">
        {/* Header */}
        {/* Left Side */}
         <div>
  <p className="text-sm text-gray-400 mb-1 flex items-center">
    <Link
      to="/admin/dashboard"
      className="hover:text-[#2BB2A9] transition"
    >
      Dashboard
    </Link>

    <span className="mx-2">&gt;</span>

    <span className="text-none font-medium">
      All Students
    </span>
  </p>
</div>
        <div className="mb-6">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            All Students
          </h1>
          <p className="text-sm text-gray-500 mt-1">Manage and monitor all students in the system</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-[#2BB2A9] hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Total Students</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{studentsData.length}</p>
              </div>
              <div className="bg-[#e6f4f3] p-3 rounded-lg group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6 text-[#2BB2A9]" />
              </div>
            </div>
            <div className="mt-2 text-xs text-green-600">↑ 12% from last month</div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-green-500 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Active Students</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">
                  {studentsData.filter(s => s.status === 'active').length}
                </p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="mt-2 text-xs text-green-600">↑ 5% from last month</div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-purple-500 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Avg. Progress</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">
                  {Math.round(studentsData.reduce((acc, s) => acc + s.progress, 0) / studentsData.length)}%
                </p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg">
                <GraduationCap className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-2 text-xs text-green-600">↑ 8% improvement</div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-orange-500 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Avg. Grade</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">
                  {Math.round(studentsData.reduce((acc, s) => acc + s.averageGrade, 0) / studentsData.length)}%
                </p>
              </div>
              <div className="bg-[#e6f4f3] p-3 rounded-lg">
                <Award className="w-6 h-6 text-[#2BB2A9]" />
              </div>
            </div>
            <div className="mt-2 text-xs text-green-600">↑ 3% from last month</div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm p-5 mb-6 hover:shadow-md transition-all duration-300">
          <div className="flex flex-col lg:flex-row justify-between gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search students by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#2BB2A9] focus:border-transparent transition-all duration-300 hover:border-[#2BB2A9]"
              />
            </div>
            
            <div className="flex gap-3">
              <div className="relative">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2BB2A9] focus:border-transparent bg-white text-gray-700 appearance-none cursor-pointer transition-all duration-300 hover:border-[#2BB2A9]"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%232BB2A9' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 0.75rem center',
                    backgroundSize: '1rem'
                  }}
                >
                  <option value="all">All Status</option>
                  {statuses.map(status => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="relative">
                <select
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className="px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#2BB2A9] focus:border-transparent bg-white text-gray-700 appearance-none cursor-pointer transition-all duration-300 hover:border-[#2BB2A9]"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%232BB2A9' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 0.75rem center',
                    backgroundSize: '1rem'
                  }}
                >
                  <option value="all">All Courses</option>
                  {courses.map(course => (
                    <option key={course} value={course}>{course}</option>
                  ))}
                </select>
              </div>
              
              <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#2BB2A9] to-[#249b93] text-white rounded-lg hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0">
                <Filter className="w-4 h-4" />
                <span>Filter</span>
              </button>
            </div>
          </div>
        </div>

        {/* Actions Bar */}
        {selectedStudents.length > 0 && (
          <div className="bg-[#e6f4f3] rounded-lg p-3 mb-6 flex items-center justify-between animate-fadeIn">
            <span className="text-sm font-medium text-[#2BB2A9]">
              {selectedStudents.length} student(s) selected
            </span>
            <div className="flex gap-2">
              <button className="px-3 py-1 bg-white text-[#2BB2A9] rounded-md hover:bg-gray-50 hover:shadow-md transition-all duration-300 text-sm">
                <Mail className="w-4 h-4 inline mr-1" />
                Email
              </button>
              <button className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 hover:shadow-md transition-all duration-300 text-sm">
                <Trash2 className="w-4 h-4 inline mr-1" />
                Delete
              </button>
            </div>
          </div>
        )}

        {/* Students Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-x-auto scrollbar-hide hover:shadow-md transition-all duration-300">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-6 py-4 text-left w-12">
                  <input
                    type="checkbox"
                    checked={selectedStudents.length === currentStudents.length && currentStudents.length > 0}
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-[#2BB2A9] focus:ring-[#2BB2A9] rounded border-gray-300 cursor-pointer hover:scale-110 transition-transform"
                  />
                </th>
                <th 
                  className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-[#2BB2A9] w-[20%] transition-colors duration-300 group"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center gap-1">
                    Student
                    {sortField === 'name' && (
                      sortDirection === 'asc' ? <ChevronUp className="w-3 h-3 text-[#2BB2A9]" /> : <ChevronDown className="w-3 h-3 text-[#2BB2A9]" />
                    )}
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[15%]">Course</th>
                <th 
                  className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-[#2BB2A9] w-[15%] transition-colors duration-300"
                  onClick={() => handleSort('progress')}
                >
                  <div className="flex items-center gap-1">
                    Progress
                    {sortField === 'progress' && (
                      sortDirection === 'asc' ? <ChevronUp className="w-3 h-3 text-[#2BB2A9]" /> : <ChevronDown className="w-3 h-3 text-[#2BB2A9]" />
                    )}
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[10%]">Status</th>
                <th 
                  className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-[#2BB2A9] w-[12%] transition-colors duration-300"
                  onClick={() => handleSort('enrollmentDate')}
                >
                  <div className="flex items-center gap-1">
                    Enrolled
                    {sortField === 'enrollmentDate' && (
                      sortDirection === 'asc' ? <ChevronUp className="w-3 h-3 text-[#2BB2A9]" /> : <ChevronDown className="w-3 h-3 text-[#2BB2A9]" />
                    )}
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[12%]">Last Active</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[10%]">Avg. Grade</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[10%]">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50 transition-colors duration-200 group">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedStudents.includes(student.id)}
                      onChange={() => handleSelectStudent(student.id)}
                      className="w-4 h-4 text-[#2BB2A9] focus:ring-[#2BB2A9] rounded border-gray-300 cursor-pointer hover:scale-110 transition-transform"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="min-w-[200px]">
                      <div className="font-medium text-gray-900 truncate group-hover:text-[#2BB2A9] transition-colors duration-200">{student.name}</div>
                      <div className="text-sm text-gray-500 truncate">{student.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="min-w-[130px]">
                      <span className="px-2 py-1 bg-[#e6f4f3] text-[#2BB2A9] text-xs rounded-full whitespace-nowrap hover:bg-[#2BB2A9] hover:text-white transition-all duration-300 cursor-pointer">
                        {student.course}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="min-w-[120px]">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                          <div 
                            className={`bg-gradient-to-r ${getProgressColor(student.progress)} h-2 rounded-full transition-all duration-500 transform hover:scale-x-105`} 
                            style={{ width: `${student.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-600 min-w-[40px]">{student.progress}%</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="min-w-[90px]">
                      <span className={`px-2 py-1 text-xs rounded-full whitespace-nowrap inline-flex items-center ${getStatusColor(student.status)} transition-all duration-300 hover:scale-105 cursor-pointer`}>
                        <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1 ${
                          student.status === 'active' ? 'bg-green-500' : 
                          student.status === 'inactive' ? 'bg-red-500' : 'bg-yellow-500'
                        }`}></span>
                        <span className="capitalize">{student.status}</span>
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="min-w-[100px]">
                      <div className="flex items-center gap-1 text-sm text-gray-500 hover:text-[#2BB2A9] transition-colors duration-200">
                        <Calendar className="w-3 h-3 flex-shrink-0" />
                        <span className="whitespace-nowrap">{student.enrollmentDate}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="min-w-[100px]">
                      <div className="flex items-center gap-1 text-sm text-gray-500 hover:text-[#2BB2A9] transition-colors duration-200">
                        <Clock className="w-3 h-3 flex-shrink-0" />
                        <span className="whitespace-nowrap">{student.lastActive}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="min-w-[70px]">
                      <div className="flex items-center gap-1">
                        <span className="font-semibold text-gray-800 group-hover:text-[#2BB2A9] transition-colors duration-200">{student.averageGrade}%</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="min-w-[100px]">
                      <div className="flex space-x-2">
                        <button
  onClick={() => handleViewStudent(student)}
  className="p-1 text-[#2BB2A9] hover:bg-[#e6f4f3] rounded transition-all duration-200 hover:scale-110"
>
  <Eye className="w-4 h-4" />
</button>
                        <button className="p-1 text-[#2BB2A9] hover:bg-[#e6f4f3] rounded transition-all duration-200 hover:scale-110">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-red-600 hover:bg-red-50 rounded transition-all duration-200 hover:scale-110">
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-gray-600 hover:bg-gray-100 rounded transition-all duration-200 hover:scale-110">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, sortedStudents.length)} of {sortedStudents.length} students
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#e6f4f3] hover:text-[#2BB2A9] hover:border-[#2BB2A9] transition-all duration-300 text-gray-700"
                >
                  Previous
                </button>
                <span className="px-3 py-1 bg-[#2BB2A9] text-white rounded-md text-sm hover:bg-[#249b93] transition-all duration-300">
                  {currentPage}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#e6f4f3] hover:text-[#2BB2A9] hover:border-[#2BB2A9] transition-all duration-300 text-gray-700"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Export Button */}
        <div className="mt-6 flex justify-end">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-[#e6f4f3] hover:text-[#2BB2A9] hover:border-[#2BB2A9] transition-all duration-300 transform hover:-translate-y-0.5">
            <Download className="w-4 h-4" />
            <span>Export Student Data</span>
          </button>
        </div>
      </div>

      {/* Custom styles for dropdown hover - This is the key fix */}
      <style jsx global>{`
        /* Remove default blue highlight from select dropdown options */
        select option:hover,
        select option:focus,
        select option:active,
        select option:checked {
          background-color: #2BB2A9 !important;
          color: white !important;
        }
        
        /* For Firefox */
        select option:hover,
        select option:focus {
          background-color: #2BB2A9 !important;
          color: white !important;
        }
        
        /* For Chrome/Safari/Edge */
        select option:checked {
          background-color: #2BB2A9 !important;
          color: white !important;
        }
        
        /* Custom select focus styles */
        select:focus {
          outline: none;
          border-color: #2BB2A9 !important;
          ring-color: #2BB2A9 !important;
        }
        
        /* Remove blue default outline from all elements */
        *:focus {
          outline: none;
        }
        
        input:focus, 
        select:focus, 
        button:focus,
        textarea:focus {
          outline: none;
          ring-color: #2BB2A9 !important;
        }
      `}</style>
      {showStudentModal && selectedStudent && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
    <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-6 relative">
      <button
        onClick={() => setShowStudentModal(false)}
        className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
      >
        ✕
      </button>

      <div className="text-center mb-5">
        <div className="w-20 h-20 mx-auto rounded-full bg-[#e6f4f3] flex items-center justify-center text-[#2BB2A9] text-2xl font-bold">
          {selectedStudent.name.charAt(0)}
        </div>

        <h2 className="text-xl font-bold text-gray-800 mt-3">
          {selectedStudent.name}
        </h2>

        <p className="text-sm text-gray-500">{selectedStudent.email}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-gray-500">Course</p>
          <p className="font-semibold">{selectedStudent.course}</p>
        </div>

        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-gray-500">Status</p>
          <p className="font-semibold capitalize">{selectedStudent.status}</p>
        </div>

        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-gray-500">Progress</p>
          <p className="font-semibold">{selectedStudent.progress}%</p>
        </div>

        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-gray-500">Average Grade</p>
          <p className="font-semibold">{selectedStudent.averageGrade}%</p>
        </div>

        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-gray-500">Completed Courses</p>
          <p className="font-semibold">
            {selectedStudent.completedCourses} / {selectedStudent.totalCourses}
          </p>
        </div>

        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-gray-500">Country</p>
          <p className="font-semibold">{selectedStudent.country}</p>
        </div>

        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-gray-500">Phone</p>
          <p className="font-semibold">{selectedStudent.phone}</p>
        </div>

        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-gray-500">Last Active</p>
          <p className="font-semibold">{selectedStudent.lastActive}</p>
        </div>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

// Add missing Award icon component
const Award = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="8" r="6" />
    <path d="M12 14v7" />
    <path d="M9 21h6" />
    <path d="M15 16.5L12 14l-3 2.5" />
  </svg>
);

export default AllStudents;