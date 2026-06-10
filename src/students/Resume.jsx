import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaGraduationCap,
  FaBriefcase,
  FaCode,
  FaDownload,
  FaFileAlt,
  FaLinkedin,
  FaGithub,
} from "react-icons/fa";

const ResumeBuilder = () => {
  const resumeRef = useRef(null);
  const [showResume, setShowResume] = useState(false);
  
  // Form state for student details
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    linkedin: "",
    github: "",
    degree: "",
    university: "",
    graduationYear: "",
    cgpa: "",
    skills: "",
    experience: "",
    projects: "",
    certifications: "",
    languages: "",
    summary: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleGenerateResume = () => {
    setShowResume(true);
    setTimeout(() => {
      const element = resumeRef.current;
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  const handleDownload = () => {
    if (!showResume || !formData.fullName) return;
    window.print();
  };

  const skillsList = formData.skills ? formData.skills.split(',').map(s => s.trim()).filter(s => s) : [];
  const languagesList = formData.languages ? formData.languages.split(',').map(l => l.trim()).filter(l => l) : [];
  const experienceLines = formData.experience ? formData.experience.split('\n').filter(l => l.trim()) : [];
  const projectLines = formData.projects ? formData.projects.split('\n').filter(l => l.trim()) : [];
  const certificationLines = formData.certifications ? formData.certifications.split('\n').filter(c => c.trim()) : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-3 sm:p-4 md:p-5">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <p className="text-xs sm:text-sm text-gray-400">
            <Link to="/student/dashboard" className="hover:text-blue-600 transition">
              Dashboard
            </Link>
            <span className="mx-1 sm:mx-2">&gt;</span>
            <span className="text-gray-600 font-medium">Resume</span>
          </p>
        </div>
        
        <div className="mb-4 sm:mb-5">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-800">Resume Builder</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">Fill in your details and generate a professional resume</p>
        </div>

        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-4 sm:gap-6">
          {/* Left Column - Form Card */}
          <div className="w-full lg:col-span-5">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-blue-600 flex items-center justify-center">
                    <FaFileAlt className="text-white text-sm sm:text-lg" />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-gray-800">Student Details</h2>
                    <p className="text-[10px] sm:text-xs text-gray-500">Enter your information below</p>
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-6 max-h-[60vh] sm:max-h-[calc(100vh-200px)] overflow-y-auto">
                {/* Personal Information */}
                <div className="mb-5 sm:mb-6">
                  <h3 className="text-xs sm:text-sm font-semibold text-gray-700 mb-3 sm:mb-4 flex items-center gap-2">
                    <FaUser className="text-blue-500 text-xs sm:text-sm" /> Personal Information
                  </h3>
                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <label className="block text-[10px] sm:text-xs font-medium text-gray-600 mb-1">Full Name *</label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className="w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-xs sm:text-sm"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] sm:text-xs font-medium text-gray-600 mb-1">Email *</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="john@example.com"
                          className="w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-xs sm:text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] sm:text-xs font-medium text-gray-600 mb-1">Phone</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+1 234 567 8900"
                          className="w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-xs sm:text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] sm:text-xs font-medium text-gray-600 mb-1">Address</label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="City, Country"
                        className="w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-xs sm:text-sm"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] sm:text-xs font-medium text-gray-600 mb-1">LinkedIn</label>
                        <input
                          type="text"
                          name="linkedin"
                          value={formData.linkedin}
                          onChange={handleChange}
                          placeholder="linkedin.com/in/username"
                          className="w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-xs sm:text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] sm:text-xs font-medium text-gray-600 mb-1">GitHub</label>
                        <input
                          type="text"
                          name="github"
                          value={formData.github}
                          onChange={handleChange}
                          placeholder="github.com/username"
                          className="w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-xs sm:text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Education */}
                <div className="mb-5 sm:mb-6">
                  <h3 className="text-xs sm:text-sm font-semibold text-gray-700 mb-3 sm:mb-4 flex items-center gap-2">
                    <FaGraduationCap className="text-green-500 text-xs sm:text-sm" /> Education
                  </h3>
                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <label className="block text-[10px] sm:text-xs font-medium text-gray-600 mb-1">Degree</label>
                      <input
                        type="text"
                        name="degree"
                        value={formData.degree}
                        onChange={handleChange}
                        placeholder="B.Sc. Computer Science"
                        className="w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-xs sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] sm:text-xs font-medium text-gray-600 mb-1">University/College</label>
                      <input
                        type="text"
                        name="university"
                        value={formData.university}
                        onChange={handleChange}
                        placeholder="University Name"
                        className="w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-xs sm:text-sm"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] sm:text-xs font-medium text-gray-600 mb-1">Graduation Year</label>
                        <input
                          type="text"
                          name="graduationYear"
                          value={formData.graduationYear}
                          onChange={handleChange}
                          placeholder="2024"
                          className="w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-xs sm:text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] sm:text-xs font-medium text-gray-600 mb-1">CGPA/Percentage</label>
                        <input
                          type="text"
                          name="cgpa"
                          value={formData.cgpa}
                          onChange={handleChange}
                          placeholder="8.5 CGPA"
                          className="w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-xs sm:text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Skills */}
                <div className="mb-5 sm:mb-6">
                  <h3 className="text-xs sm:text-sm font-semibold text-gray-700 mb-3 sm:mb-4 flex items-center gap-2">
                    <FaCode className="text-purple-500 text-xs sm:text-sm" /> Technical Skills
                  </h3>
                  <textarea
                    name="skills"
                    value={formData.skills}
                    onChange={handleChange}
                    placeholder="React, Python, JavaScript, Node.js, SQL"
                    rows="3"
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-xs sm:text-sm resize-none"
                  />
                </div>

                {/* Experience */}
                <div className="mb-5 sm:mb-6">
                  <h3 className="text-xs sm:text-sm font-semibold text-gray-700 mb-3 sm:mb-4 flex items-center gap-2">
                    <FaBriefcase className="text-orange-500 text-xs sm:text-sm" /> Work Experience
                  </h3>
                  <textarea
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    placeholder="Software Engineer Intern at Tech Corp (2023-Present)&#10;• Developed features for web application&#10;• Collaborated with cross-functional teams"
                    rows="4"
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-xs sm:text-sm resize-none"
                  />
                </div>

                {/* Projects */}
                <div className="mb-5 sm:mb-6">
                  <h3 className="text-xs sm:text-sm font-semibold text-gray-700 mb-3 sm:mb-4 flex items-center gap-2">
                    <FaCode className="text-indigo-500 text-xs sm:text-sm" /> Projects
                  </h3>
                  <textarea
                    name="projects"
                    value={formData.projects}
                    onChange={handleChange}
                    placeholder="E-commerce Website - Built with React and Node.js&#10;• Implemented payment integration&#10;• Optimized database queries"
                    rows="4"
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-xs sm:text-sm resize-none"
                  />
                </div>

                {/* Certifications */}
                <div className="mb-5 sm:mb-6">
                  <h3 className="text-xs sm:text-sm font-semibold text-gray-700 mb-3 sm:mb-4">Certifications</h3>
                  <textarea
                    name="certifications"
                    value={formData.certifications}
                    onChange={handleChange}
                    placeholder="AWS Certified Cloud Practitioner&#10;Google Data Analytics Certificate"
                    rows="3"
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-xs sm:text-sm resize-none"
                  />
                </div>

                {/* Languages */}
                <div className="mb-5 sm:mb-6">
                  <h3 className="text-xs sm:text-sm font-semibold text-gray-700 mb-3 sm:mb-4">Languages</h3>
                  <textarea
                    name="languages"
                    value={formData.languages}
                    onChange={handleChange}
                    placeholder="English (Fluent), Hindi (Native), Spanish (Basic)"
                    rows="2"
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-xs sm:text-sm resize-none"
                  />
                </div>

                {/* Professional Summary */}
                <div className="mb-5 sm:mb-6">
                  <h3 className="text-xs sm:text-sm font-semibold text-gray-700 mb-3 sm:mb-4">Professional Summary</h3>
                  <textarea
                    name="summary"
                    value={formData.summary}
                    onChange={handleChange}
                    placeholder="Enthusiastic computer science student with strong problem-solving skills..."
                    rows="4"
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-xs sm:text-sm resize-none"
                  />
                </div>
              </div>

              <div className="px-4 sm:px-6 py-4 sm:py-5 border-t border-gray-100 bg-gray-50">
                <button
                  onClick={handleGenerateResume}
                  disabled={!formData.fullName || !formData.email}
                  className={`w-full py-2.5 sm:py-3 rounded-xl font-semibold text-white transition-all flex items-center justify-center gap-2 text-sm sm:text-base ${
                    !formData.fullName || !formData.email
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg"
                  }`}
                >
                  <FaFileAlt className="text-xs sm:text-sm" />
                  Create Resume
                </button>
                {(!formData.fullName || !formData.email) && (
                  <p className="text-[10px] sm:text-xs text-gray-500 text-center mt-2">
                    * Full Name and Email are required
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Two Cards */}
          <div className="w-full lg:col-span-7 space-y-3 sm:space-y-4 mt-4 lg:mt-0">
            {/* Resume Preview Card */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-green-600 flex items-center justify-center">
                    <FaFileAlt className="text-white text-sm sm:text-lg" />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-gray-800">Resume Preview</h2>
                    <p className="text-[10px] sm:text-xs text-gray-500">Auto-generated from your details</p>
                  </div>
                </div>
                {showResume && formData.fullName && (
                  <button
                    onClick={handleDownload}
                    className="flex items-center justify-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs sm:text-sm font-semibold transition-all shadow-sm"
                  >
                    <FaDownload className="text-xs sm:text-sm" /> Download PDF
                  </button>
                )}
              </div>

              <div className="p-3 sm:p-6 bg-gray-50 max-h-[600px] sm:max-h-[800px] overflow-y-auto">
                {showResume && formData.fullName ? (
                  <div ref={resumeRef} className="resume-preview-wrapper">
                    <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden">
                      {/* Resume Header */}
                      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 px-4 sm:px-8 py-5 sm:py-8 text-white">
                        <h1 className="text-xl sm:text-3xl font-bold mb-1 sm:mb-2">{formData.fullName}</h1>
                        <p className="text-blue-100 text-xs sm:text-base">
                          {formData.degree ? `${formData.degree} Student` : "Student"}
                        </p>
                        <div className="flex flex-wrap gap-2 sm:gap-4 mt-3 sm:mt-5 text-[10px] sm:text-sm text-blue-100">
                          {formData.email && (
                            <span className="flex items-center gap-1 sm:gap-2">📧 {formData.email}</span>
                          )}
                          {formData.phone && (
                            <span className="flex items-center gap-1 sm:gap-2">📞 {formData.phone}</span>
                          )}
                          {formData.address && (
                            <span className="flex items-center gap-1 sm:gap-2">📍 {formData.address}</span>
                          )}
                        </div>
                        {(formData.linkedin || formData.github) && (
                          <div className="flex flex-wrap gap-2 sm:gap-4 mt-1 sm:mt-2 text-[10px] sm:text-sm text-blue-100">
                            {formData.linkedin && (
                              <span className="flex items-center gap-1 sm:gap-2">🔗 {formData.linkedin}</span>
                            )}
                            {formData.github && (
                              <span className="flex items-center gap-1 sm:gap-2">🐙 {formData.github}</span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Resume Body */}
                      <div className="flex flex-col md:grid md:grid-cols-3 gap-0">
                        {/* Sidebar */}
                        <div className="bg-gray-50 p-4 sm:p-6 border-r border-gray-200">
                          {skillsList.length > 0 && (
                            <div className="mb-5 sm:mb-6">
                              <h3 className="text-xs sm:text-sm font-bold text-gray-700 mb-2 sm:mb-3 flex items-center gap-2">
                                💻 Technical Skills
                              </h3>
                              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                {skillsList.map((skill, i) => (
                                  <span key={i} className="bg-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs text-gray-700 shadow-sm border border-gray-200">
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {languagesList.length > 0 && (
                            <div className="mb-5 sm:mb-6">
                              <h3 className="text-xs sm:text-sm font-bold text-gray-700 mb-2 sm:mb-3">🌐 Languages</h3>
                              <div className="space-y-1">
                                {languagesList.map((lang, i) => (
                                  <p key={i} className="text-[11px] sm:text-sm text-gray-600">{lang}</p>
                                ))}
                              </div>
                            </div>
                          )}

                          {certificationLines.length > 0 && (
                            <div className="mb-5 sm:mb-6">
                              <h3 className="text-xs sm:text-sm font-bold text-gray-700 mb-2 sm:mb-3">🏆 Certifications</h3>
                              <div className="space-y-1 sm:space-y-2">
                                {certificationLines.map((cert, i) => (
                                  <p key={i} className="text-[11px] sm:text-sm text-gray-600">• {cert}</p>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Main Content */}
                        <div className="md:col-span-2 p-4 sm:p-6">
                          {formData.summary && (
                            <div className="mb-5 sm:mb-6">
                              <h3 className="text-sm sm:text-base font-bold text-gray-800 mb-2 sm:mb-3 border-b-2 border-gray-200 pb-1 sm:pb-2">
                                📋 Professional Summary
                              </h3>
                              <p className="text-[11px] sm:text-sm text-gray-600 leading-relaxed">{formData.summary}</p>
                            </div>
                          )}

                          {(formData.degree || formData.university) && (
                            <div className="mb-5 sm:mb-6">
                              <h3 className="text-sm sm:text-base font-bold text-gray-800 mb-2 sm:mb-3 border-b-2 border-gray-200 pb-1 sm:pb-2">
                                🎓 Education
                              </h3>
                              <div>
                                <p className="font-semibold text-gray-800 text-xs sm:text-sm">{formData.degree}</p>
                                <p className="text-[11px] sm:text-sm text-gray-600">{formData.university}</p>
                                <p className="text-[10px] sm:text-sm text-gray-500">
                                  {formData.graduationYear} {formData.cgpa && `| ${formData.cgpa}`}
                                </p>
                              </div>
                            </div>
                          )}

                          {experienceLines.length > 0 && (
                            <div className="mb-5 sm:mb-6">
                              <h3 className="text-sm sm:text-base font-bold text-gray-800 mb-2 sm:mb-3 border-b-2 border-gray-200 pb-1 sm:pb-2">
                                💼 Work Experience
                              </h3>
                              <div className="space-y-1">
                                {experienceLines.map((line, i) => (
                                  <p key={i} className="text-[11px] sm:text-sm text-gray-600">
                                    {line.startsWith('•') ? line : `• ${line}`}
                                  </p>
                                ))}
                              </div>
                            </div>
                          )}

                          {projectLines.length > 0 && (
                            <div className="mb-5 sm:mb-6">
                              <h3 className="text-sm sm:text-base font-bold text-gray-800 mb-2 sm:mb-3 border-b-2 border-gray-200 pb-1 sm:pb-2">
                                🚀 Projects
                              </h3>
                              <div className="space-y-1">
                                {projectLines.map((line, i) => (
                                  <p key={i} className="text-[11px] sm:text-sm text-gray-600">
                                    {line.startsWith('•') ? line : `• ${line}`}
                                  </p>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 sm:py-16 text-center">
                    <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-gray-200 flex items-center justify-center mb-3 sm:mb-4">
                      <FaFileAlt className="text-2xl sm:text-4xl text-gray-400" />
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">No Resume Generated Yet</h3>
                    <p className="text-xs sm:text-sm text-gray-500 max-w-md px-4">
                      Fill in your details in the form and click "Create Resume" to generate a professional resume preview here.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Tips Card */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-blue-100">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                  <FaFileAlt className="text-blue-600 text-sm sm:text-lg" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 text-sm sm:text-base mb-1">Resume Tips</h3>
                  <p className="text-[11px] sm:text-sm text-gray-600 space-y-1">
                    • Use action verbs to describe your experience<br />
                    • Quantify your achievements where possible<br />
                    • Keep your resume concise and focused on relevant skills<br />
                    • Make sure to include your latest projects and skills
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;