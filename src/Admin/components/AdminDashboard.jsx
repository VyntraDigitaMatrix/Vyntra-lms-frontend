import React, { useState } from "react";
import {
  Users,
  BookOpen,
  GraduationCap,
  BarChart3,
  Settings,
  Bell,
  Search,
  Filter,
  MoreVertical,
  UserPlus,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  MessageSquare,
  Calendar,
  TrendingUp,
  Award,
  FileText,
  Download,
  Eye,
  Mail,
  Phone,
  MapPin,
  Star,
  ChevronDown,
  PlusCircle,
  TrendingDown,
  Activity
} from "lucide-react";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  // Mock Data
  const students = [
    { id: 1, name: "Alice Johnson", email: "alice@example.com", course: "Web Development", progress: 75, status: "active", enrollmentDate: "2024-01-15", lastActive: "2024-03-20", completedCourses: 3, totalCourses: 5, averageGrade: 85 },
    { id: 2, name: "Bob Smith", email: "bob@example.com", course: "Data Science", progress: 45, status: "active", enrollmentDate: "2024-02-01", lastActive: "2024-03-19", completedCourses: 2, totalCourses: 6, averageGrade: 78 },
    { id: 3, name: "Carol Davis", email: "carol@example.com", course: "UI/UX Design", progress: 90, status: "inactive", enrollmentDate: "2023-12-10", lastActive: "2024-03-15", completedCourses: 4, totalCourses: 4, averageGrade: 92 },
  ];

  const instructors = [
    { id: 1, name: "Dr. John Williams", email: "john@example.com", department: "Computer Science", courses: 3, students: 45, rating: 4.8, status: "active", joinDate: "2023-06-01", lastActive: "2024-03-20", specialization: "Web Technologies", experience: "8 years" },
    { id: 2, name: "Prof. Sarah Brown", email: "sarah@example.com", department: "Mathematics", courses: 2, students: 32, rating: 4.9, status: "active", joinDate: "2023-08-15", lastActive: "2024-03-19", specialization: "Statistics", experience: "6 years" },
    { id: 3, name: "Michael Lee", email: "michael@example.com", department: "Design", courses: 2, students: 28, rating: 4.6, status: "inactive", joinDate: "2023-10-01", lastActive: "2024-03-10", specialization: "UI/UX", experience: "5 years" },
  ];

  const recentActivities = [
    { id: 1, user: "Alice Johnson", action: "Completed Module 5", type: "student", timestamp: "2 hours ago" },
    { id: 2, user: "Dr. John Williams", action: "Uploaded new lecture", type: "instructor", timestamp: "5 hours ago" },
    { id: 3, user: "Bob Smith", action: "Submitted assignment", type: "student", timestamp: "1 day ago" },
  ];

  const pendingApprovals = [
    { id: 1, name: "Emily White", type: "student", request: "Course Enrollment", date: "2024-03-20" },
    { id: 2, name: "David Green", type: "instructor", request: "Application to teach", date: "2024-03-19" },
  ];

  const stats = [
    {
      title: "Total Students",
      value: 156,
      change: "+12%",
      changeType: "increase",
      icon: GraduationCap,
      color: "blue",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      borderColor: "border-blue-200"
    },
    {
      title: "Total Instructors",
      value: 24,
      change: "+5%",
      changeType: "increase",
      icon: Users,
      color: "green",
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
      borderColor: "border-green-200"
    },
    {
      title: "Active Courses",
      value: 18,
      change: "+3",
      changeType: "increase",
      icon: BookOpen,
      color: "purple",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
      borderColor: "border-purple-200"
    },
    {
      title: "Completion Rate",
      value: "78%",
      change: "+8%",
      changeType: "increase",
      icon: TrendingUp,
      color: "yellow",
      bgColor: "bg-yellow-50",
      iconColor: "text-yellow-600",
      borderColor: "border-yellow-200"
    },
    {
      title: "Revenue",
      value: "$45,230",
      change: "+18%",
      changeType: "increase",
      icon: DollarSign,
      color: "emerald",
      bgColor: "bg-emerald-50",
      iconColor: "text-emerald-600",
      borderColor: "border-emerald-200"
    },
    {
      title: "Pending Payments",
      value: "$5,200",
      change: "+2%",
      changeType: "decrease",
      icon: Clock,
      color: "red",
      bgColor: "bg-red-50",
      iconColor: "text-red-600",
      borderColor: "border-red-200"
    }
  ];

  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredInstructors = instructors.filter(i =>
    i.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-sm text-gray-500 mt-1">Manage students, instructors, and course activities</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">

            </div>

          </div>
        </div>
      </div>
      <div className="p-5 -mt-3">
        {/* Overview Dashboard */}
        {activeTab === "overview" && (
          <div className="space-y-5">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={index}
                    className={`bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border-l-4 ${stat.borderColor} overflow-hidden group`}
                  >
                    <div className="p-5">
                      <div className="flex items-center justify-between mb-3">
                        <div className={`${stat.bgColor} p-2 rounded-lg group-hover:scale-110 transition-transform duration-200`}>
                          <Icon className={`w-5 h-5 ${stat.iconColor}`} />
                        </div>
                        <div className={`flex items-center space-x-1 text-xs font-medium ${stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                          }`}>
                          {stat.changeType === 'increase' ? (
                            <TrendingUp className="w-3 h-3" />
                          ) : (
                            <TrendingDown className="w-3 h-3" />
                          )}
                          <span>{stat.change}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{stat.title}</p>
                        <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                      </div>
                    </div>
                    <div className={`h-1 ${stat.bgColor}`}></div>
                  </div>
                );
              })}
            </div>

            {/* Pending Approvals Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Pending Approvals */}
              <div className="lg:col-span-1 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="p-5 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-gray-800">Pending Approvals</h2>
                    <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full">
                      {pendingApprovals.length} pending
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <div className="space-y-4">
                    {pendingApprovals.map((approval) => (
                      <div key={approval.id} className="flex items-center justify-between p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg hover:shadow-md transition-shadow">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${approval.type === 'student' ? 'bg-blue-100' : 'bg-purple-100'
                            }`}>
                            {approval.type === 'student' ?
                              <GraduationCap className="w-5 h-5 text-blue-600" /> :
                              <Users className="w-5 h-5 text-purple-600" />
                            }
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">{approval.name}</p>
                            <p className="text-xs text-gray-500">{approval.request} • {approval.date}</p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button className="p-1.5 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors">
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button className="p-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors">
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recent Activities */}
              <div className="lg:col-span-2 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="p-5 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-gray-800">Recent Activities</h2>
                    <button className="text-blue-600 text-sm hover:text-blue-700">View All</button>
                  </div>
                </div>
                <div className="p-5">
                  <div className="space-y-4">
                    {recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-start space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${activity.type === 'student' ? 'bg-blue-100' : 'bg-green-100'
                          }`}>
                          {activity.type === 'student' ?
                            <GraduationCap className="w-4 h-4 text-blue-600" /> :
                            <Users className="w-4 h-4 text-green-600" />
                          }
                        </div>
                        <div className="flex-1">
                          <p className="text-sm">
                            <span className="font-medium text-gray-800">{activity.user}</span>
                            <span className="text-gray-600"> {activity.action}</span>
                          </p>
                          <p className="text-xs text-gray-400 mt-1">{activity.timestamp}</p>
                        </div>
                        <button className="text-gray-400 hover:text-gray-600">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="p-5 border-b border-gray-200">
                <h2 className="font-semibold text-gray-800">Quick Actions</h2>
              </div>
              <div className="p-5">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <button className="flex flex-col items-center justify-center space-y-2 p-4 bg-gradient-to-br from-blue-50 to-blue-100 text-blue-700 rounded-xl hover:shadow-lg transition-all transform hover:-translate-y-1 group">
                    <div className="p-2 bg-white rounded-full shadow-sm group-hover:scale-110 transition-transform">
                      <UserPlus className="w-5 h-5 text-blue-600" />
                    </div>
                    <span className="text-sm font-medium">Add Student</span>
                  </button>
                  <button className="flex flex-col items-center justify-center space-y-2 p-4 bg-gradient-to-br from-green-50 to-green-100 text-green-700 rounded-xl hover:shadow-lg transition-all transform hover:-translate-y-1 group">
                    <div className="p-2 bg-white rounded-full shadow-sm group-hover:scale-110 transition-transform">
                      <Users className="w-5 h-5 text-green-600" />
                    </div>
                    <span className="text-sm font-medium">Add Instructor</span>
                  </button>
                  <button className="flex flex-col items-center justify-center space-y-2 p-4 bg-gradient-to-br from-purple-50 to-purple-100 text-purple-700 rounded-xl hover:shadow-lg transition-all transform hover:-translate-y-1 group">
                    <div className="p-2 bg-white rounded-full shadow-sm group-hover:scale-110 transition-transform">
                      <BookOpen className="w-5 h-5 text-purple-600" />
                    </div>
                    <span className="text-sm font-medium">Create Course</span>
                  </button>
                  <button className="flex flex-col items-center justify-center space-y-2 p-4 bg-gradient-to-br from-orange-50 to-orange-100 text-orange-700 rounded-xl hover:shadow-lg transition-all transform hover:-translate-y-1 group">
                    <div className="p-2 bg-white rounded-full shadow-sm group-hover:scale-110 transition-transform">
                      <MessageSquare className="w-5 h-5 text-orange-600" />
                    </div>
                    <span className="text-sm font-medium">Send Notification</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Students Management */}
        {activeTab === "students" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="relative flex-1 max-w-md w-full">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search students by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button className="flex items-center space-x-2 px-5 py-2 bg-[#2BB2A9] from-blue-600 to-blue-700 text-white rounded-lg hover:shadow-lg transition-all transform hover:-translate-y-0.5">
                <UserPlus className="w-4 h-4" />
                <span>Add New Student</span>
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Active</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="font-medium text-gray-900">{student.name}</div>
                          <div className="text-sm text-gray-500">{student.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">{student.course}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-1 w-24 bg-gray-200 rounded-full h-2 mr-2">
                            <div className="bg-[#2BB2A9] to-[#2BB2A9] h-2 rounded-full transition-all duration-500" style={{ width: `${student.progress}%` }}></div>
                          </div>
                          <span className="text-sm font-medium text-gray-600">{student.progress}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${student.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                          }`}>
                          <span className="inline-block w-1.5 h-1.5 rounded-full mr-1 ${
                            student.status === 'active' ? 'bg-green-500' : 'bg-red-500'
                          }"></span>
                          {student.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.lastActive}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex space-x-2">
                          <button className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {/* Activities Log */}
        {activeTab === "activities" && (
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h2 className="font-semibold text-gray-800 text-lg">System Activity Log</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {[...recentActivities, ...recentActivities].map((activity, idx) => (
                  <div key={idx} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${activity.type === 'student' ? 'bg-blue-100' : 'bg-green-100'
                      }`}>
                      {activity.type === 'student' ?
                        <GraduationCap className="w-5 h-5 text-blue-600" /> :
                        <Users className="w-5 h-5 text-green-600" />
                      }
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-medium text-gray-800">{activity.user}</span>
                        <span className="text-gray-600"> {activity.action}</span>
                      </p>
                      <p className="text-xs text-gray-400 mt-1">{activity.timestamp}</p>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Analytics */}
        {activeTab === "analytics" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-800 mb-4">Course Enrollment Trends</h3>
              <div className="h-64 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Chart Component Here</p>
                  <p className="text-xs text-gray-400 mt-1">Integration with charting library</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-800 mb-4">Student Performance Overview</h3>
              <div className="space-y-5">
                {["Web Development", "Data Science", "UI/UX Design", "Mobile Development"].map((course, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium text-gray-700">{course}</span>
                      <span className="text-gray-600">{85 - idx * 7}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-[#2BB2A9] to-[#2BB2A9] h-2.5 rounded-full transition-all duration-500"
                        style={{ width: `${85 - idx * 7}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Settings */}
        {activeTab === "settings" && (
          <div className="bg-white rounded-xl shadow-sm max-w-3xl mx-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">System Settings</h2>
              <p className="text-sm text-gray-500 mt-1">Configure your LMS platform settings</p>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Default Student Role</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option>Learner</option>
                    <option>Premium Learner</option>
                    <option>Guest Learner</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Courses Per Student</label>
                  <input
                    type="number"
                    defaultValue="5"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">Maximum number of courses a student can enroll in</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notification Settings</label>
                  <div className="space-y-3">
                    <label className="flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="mr-3 w-4 h-4 text-blue-600 focus:ring-blue-500" />
                      <span className="text-sm text-gray-700">Email notifications for new enrollments</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="mr-3 w-4 h-4 text-blue-600 focus:ring-blue-500" />
                      <span className="text-sm text-gray-700">Notify admin about pending approvals</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input type="checkbox" className="mr-3 w-4 h-4 text-blue-600 focus:ring-blue-500" />
                      <span className="text-sm text-gray-700">Send weekly performance reports</span>
                    </label>
                  </div>
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <button className="px-6 py-2 bg-[#2BB2A9] from-blue-600 to-blue-700 text-white rounded-lg hover:shadow-lg transition-all transform hover:-translate-y-0.5">
                    Save All Settings
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;