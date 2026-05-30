import React, { useState } from 'react';
import {
    FaEnvelope,
    FaPhone,
    FaMapMarkerAlt,
    FaShieldAlt,
    FaUser,
    FaEdit,
    FaGlobe,
    FaCalendarAlt,
    FaChartLine,
    FaUsers,
    FaBookOpen,
    FaCheckCircle,
    FaAward,
    FaClock
} from 'react-icons/fa';

const InstructorProfile = () => {
    const [isEditing, setIsEditing] = useState(false);

    return (

        <div className="min-h-screen">
            {/* Hero Cover Section */}
            {/* Top Banner */}
            <div className="relative bg-white rounded-3xl overflow-hidden shadow-md">

                {/* Cover */}
                <div
                    className="h-64 relative bg-cover bg-center"
                    style={{
                        backgroundImage:
                            "url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1600')",
                    }}
                >
                    <div className="absolute inset-0 bg-black/30"></div>

                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="absolute top-6 right-6 z-10 bg-white text-[#7c3aed] px-5 py-3 rounded-xl font-semibold flex items-center gap-2 shadow"
                    >
                        <FaEdit />
                        {isEditing ? "Save Profile" : "Edit Profile"}
                    </button>
                </div>
            </div>


            {/* Profile Content */}
            <div className="px-8 pb-8">
                <div className="flex flex-col md:flex-row md:items-end gap-6 -mt-16">

                    {/* Profile Image */}
                    <div className="relative">
                        <img
                            src="https://ui-avatars.com/api/?name=Harika&background=7c3aed&color=fff&size=200"
                            alt="Profile"
                            className="w-40 h-40 rounded-full border-4 border-white shadow-lg object-cover"
                        />

                        <div className="absolute bottom-3 right-3 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
                        
                    </div>
                    {/* Name and Title */}
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Harika</h1>
                        <p className="text-sm text-slate-500">Senior Full-stack Instructor</p>
                    </div>

                    
                </div>
                {/* Quick Stats Bar */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-gray-100 border-t border-gray-100 rounded-lg overflow-hidden mt-6">
                    {[
                        { label: 'Total Students', value: '2,847', icon: FaUsers, color: 'text-blue-600' },
                        { label: 'Courses', value: '24', icon: FaBookOpen, color: 'text-emerald-600' },
                        { label: 'Completion Rate', value: '98%', icon: FaChartLine, color: 'text-purple-600' },
                        { label: 'Years Exp.', value: '12+', icon: FaCalendarAlt, color: 'text-amber-600' }
                    ].map((stat, idx) => (
                        <div key={idx} className="bg-white px-4 py-3 flex items-center gap-3">
                            <div className={`p-2 rounded-xl bg-gray-50 ${stat.color}`}>
                                <stat.icon className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
                                <p className="text-xs text-slate-500 uppercase tracking-wide">{stat.label}</p>
                            </div>
                        </div>
                    ))}

                </div>



            </div>
            {/* Profile Main Content */}
            <div className="max-w-7xl mx-auto px-6 pb-12">


                {/* Main Grid: Profile Details + Sidebar */}
                <div className="grid lg:grid-cols-3 gap-8 mt-8">
                    {/* Left Panel: Detailed Information */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* About Section */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition">
                            <div className="flex items-center gap-2 border-b border-gray-100 pb-4 mb-5">
                                <FaUser className="text-[#7c3aed] text-xl" />
                                <h2 className="text-xl font-bold text-slate-800">Professional Profile</h2>
                            </div>
                            {isEditing ? (
                                <textarea
                                    rows={5}
                                    defaultValue="Senior Full-stack instructor..."
                                    className="w-full border rounded-xl p-4"
                                />
                            ) : (
                                <p className="text-slate-600 leading-relaxed">
                                    Senior Full-stack instructor and curriculum designer with over 12 years of industry experience.
                                    Specialized in React, Node.js, and cloud architecture. Passionate about mentoring the next generation
                                    of developers and creating engaging, project-based learning experiences. Certified AWS Solutions Architect
                                    and Google Developer Expert.
                                </p>
                            )}
                            <div className="mt-5 flex flex-wrap gap-2">
                                {['React.js', 'Node.js', 'TypeScript', 'Tailwind CSS', 'GraphQL', 'Python'].map(skill => (
                                    <span key={skill} className="bg-slate-100 text-slate-700 text-xs font-medium px-3 py-1.5 rounded-full">#{skill}</span>
                                ))}
                            </div>
                        </div>

                        {/* Contact & Personal Information Grid */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-xl font-bold text-slate-800 border-b border-gray-100 pb-4 mb-5 flex items-center gap-2">
                                <FaEnvelope className="text-[#7c3aed]" />
                                Contact Information
                            </h2>
                            <div className="grid md:grid-cols-2 gap-5">
                                <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50/50 hover:bg-slate-50 transition">
                                    <div className="p-2.5 bg-[#7c3aed]/20 rounded-xl text-[#7c3aed]">
                                        <FaEnvelope className="text-lg" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 uppercase tracking-wide">Email Address</p>
                                        {isEditing ? (
                                            <input
                                                type="email"
                                                defaultValue="admin@lms.com"
                                                className="border rounded-lg px-3 py-2 w-full mt-1"
                                            />
                                        ) : (
                                            <p className="font-medium text-slate-800">
                                                admin@lms.com
                                            </p>
                                        )}
                                        <p className="text-xs text-slate-400">Primary</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50/50 hover:bg-slate-50 transition">
                                    <div className="p-2.5 bg-[#7c3aed]/20 rounded-xl text-[#7c3aed]">
                                        <FaPhone className="text-lg" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 uppercase tracking-wide">Phone Number</p>
                                        {isEditing ? (
                                            <input
                                                type="tel"
                                                defaultValue="+1 (555) 789-3421"
                                                className="border rounded-lg px-3 py-2 w-full mt-1"
                                            />
                                        ) : (
                                            <p className="font-medium text-slate-800">
                                                +1 (555) 789-3421
                                            </p>
                                        )}
                                        <p className="text-xs text-slate-400">Available for urgent</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50/50 hover:bg-slate-50 transition">
                                    <div className="p-2.5 bg-[#7c3aed]/20 rounded-xl text-[#7c3aed]">
                                        <FaMapMarkerAlt className="text-lg" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 uppercase tracking-wide">Location</p>
                                        <p className="font-medium text-slate-800">Austin, Texas, USA</p>
                                        <p className="text-xs text-slate-400">Central Time Zone</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50/50 hover:bg-slate-50 transition">
                                    <div className="p-2.5 bg-[#7c3aed]/20 rounded-xl text-[#7c3aed]">
                                        <FaGlobe className="text-lg" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 uppercase tracking-wide">Languages</p>
                                        <p className="font-medium text-slate-800">English, Mandarin, Spanish</p>
                                        <p className="text-xs text-slate-400">Fluent</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Activity Timeline or Recent Achievements */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-xl font-bold text-slate-800 border-b border-gray-100 pb-4 mb-5 flex items-center gap-2">
                                <FaClock className="text-[#7c3aed]" />
                                Recent Activity
                            </h2>
                            <div className="space-y-4">
                                {[
                                    { action: 'Published new course', detail: 'Advanced React Patterns', time: '2 days ago', icon: FaBookOpen },
                                    { action: 'Live webinar session', detail: 'Building scalable APIs with Node.js', time: '5 days ago', icon: FaUsers },
                                    { action: 'Achievement unlocked', detail: 'Top Rated Instructor 2025', time: '1 week ago', icon: FaAward },
                                ].map((activity, idx) => (
                                    <div key={idx} className="flex items-start gap-4 p-3 rounded-xl hover:bg-slate-50 transition">
                                        <div className="p-2 bg-[#7c3aed] rounded-full text-white">
                                            <activity.icon className="w-4 h-4" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between flex-wrap">
                                                <p className="font-semibold text-slate-800">{activity.action}</p>
                                                <span className="text-xs text-slate-400">{activity.time}</span>
                                            </div>
                                            <p className="text-sm text-slate-500">{activity.detail}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Panel: Status & Metrics */}
                    <div className="space-y-6">
                        {/* Account Status Card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <div className="flex items-center justify-between mb-5">
                                <h2 className="text-xl font-bold text-slate-800">Account Health</h2>
                                <FaShieldAlt className="text-[#7c3aed] text-xl" />
                            </div>
                            <div className="space-y-5">
                                <div>
                                    <div className="flex justify-between text-sm font-medium mb-1">
                                        <span className="text-slate-600">Profile Completion</span>
                                        <span className="text-[#7c3aed] font-bold">94%</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-2">
                                        <div className="bg-gradient-to-r from-[#7c3aed] to-[#f] h-2 rounded-full w-[94%]"></div>
                                    </div>
                                    <p className="text-xs text-slate-400 mt-1">Missing bio and social links</p>
                                </div>
                                <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                                    <span className="text-slate-600">Account Type</span>
                                    <span className="font-semibold bg-[#7c3aed]/20 text-[#7c3aed] px-3 py-1 rounded-full text-sm">Pro Instructor</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                                    <span className="text-slate-600">Member Since</span>
                                    <span className="font-medium text-slate-800">March 2018</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                                    <span className="text-slate-600">Last Login</span>
                                    <span className="font-medium text-slate-800 flex items-center gap-1"><span className="w-2 h-2 bg-green-500 rounded-full"></span> Today, 09:42 AM</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-600">Verification</span>
                                    <span className="flex items-center gap-1 text-emerald-600 font-medium"><FaCheckCircle /> Verified</span>
                                </div>
                            </div>
                        </div>

                        {/* Quick Stats Card - Instructor Performance */}
                        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-xl p-6 text-white">
                            <h3 className="text-lg font-semibold opacity-90 mb-4">Performance Insights</h3>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-sm">
                                        <span>Course Rating</span>
                                        <span className="font-bold">4.9 ⭐</span>
                                    </div>
                                    <div className="w-full bg-white/20 rounded-full h-1.5 mt-1">
                                        <div className="bg-amber-400 h-1.5 rounded-full w-[98%]"></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-sm">
                                        <span>Student Satisfaction</span>
                                        <span className="font-bold">97%</span>
                                    </div>
                                    <div className="w-full bg-white/20 rounded-full h-1.5 mt-1">
                                        <div className="bg-emerald-400 h-1.5 rounded-full w-[97%]"></div>
                                    </div>
                                </div>
                                <div className="pt-3 border-t border-white/20">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm opacity-80">Total Reviews</span>
                                        <span className="font-bold text-xl">1,284</span>
                                    </div>
                                    <div className="flex justify-between items-center mt-2">
                                        <span className="text-sm opacity-80">Response Rate</span>
                                        <span className="font-bold text-lg">100%</span>
                                    </div>
                                </div>
                            </div>
                            <button className="w-full mt-5 py-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-medium transition backdrop-blur-sm">
                                View Full Analytics
                            </button>
                        </div>

                        {/* Role & Badges */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-[#7c3aed] rounded-xl">
                                    <FaShieldAlt className="text-white" />
                                </div>
                                <h3 className="font-bold text-slate-800">Role & Permissions</h3>
                            </div>
                            <div className="bg-slate-50 rounded-xl p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-slate-500">Current Role</p>
                                        <p className="font-bold text-slate-800 text-lg">Senior Instructor</p>
                                    </div>
                                    <span className="px-3 py-1 bg-[#7c3aed]/20 text-[#7c3aed] text-xs rounded-full text-center">Admin Access</span>
                                </div>
                                <div className="mt-3 flex flex-wrap gap-2">
                                    <span className="text-xs bg-white px-2 py-1 rounded border">Manage Courses</span>
                                    <span className="text-xs bg-white px-2 py-1 rounded border">Grade Submissions</span>
                                    <span className="text-xs bg-white px-2 py-1 rounded border">Create Quizzes</span>
                                    <span className="text-xs bg-white px-2 py-1 rounded border">Live Sessions</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer / subtle note */}
                <div className="mt-10 text-center text-xs text-slate-400 border-t border-gray-200 pt-6">
                    <p>© 2025 Instructor Portal — Secure & verified account</p>
                </div>
            </div>

        </div>

    );
};


export default InstructorProfile;