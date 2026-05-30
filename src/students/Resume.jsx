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
    // Personal Info
    fullName: "",
    email: "",
    phone: "",
    address: "",
    linkedin: "",
    github: "",
    // Education
    degree: "",
    university: "",
    graduationYear: "",
    cgpa: "",
    // Skills
    skills: "",
    // Experience
    experience: "",
    // Projects
    projects: "",
    // Certifications
    certifications: "",
    // Languages
    languages: "",
    // Summary
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

  // Complete CSS styles for the resume
  const getResumeStyles = () => {
    return `
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      
      body {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
        background: #f0f2f5;
        padding: 40px;
        line-height: 1.5;
      }
      
      .resume-container {
        max-width: 1000px;
        margin: 0 auto;
      }
      
      .resume-preview {
        background: white;
        border-radius: 20px;
        box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        overflow: hidden;
      }
      
      /* Header Styles */
      .resume-header {
        background: linear-gradient(135deg, #1e3a5f 0%, #0f2c4a 100%);
        color: white;
        padding: 32px 40px;
      }
      
      .resume-name {
        font-size: 32px;
        font-weight: 700;
        margin-bottom: 8px;
        letter-spacing: -0.5px;
      }
      
      .resume-title {
        font-size: 16px;
        opacity: 0.9;
        font-weight: 500;
      }
      
      .resume-contact {
        display: flex;
        flex-wrap: wrap;
        gap: 20px;
        margin-top: 20px;
        font-size: 13px;
      }
      
      .resume-contact-item {
        display: flex;
        align-items: center;
        gap: 6px;
        color: #e0e7ff;
      }
      
      .resume-contact-icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
      }
      
      /* Body Grid */
      .resume-body {
        display: grid;
        grid-template-columns: 300px 1fr;
        gap: 0;
      }
      
      /* Sidebar */
      .resume-sidebar {
        background: #f8fafc;
        padding: 32px;
        border-right: 1px solid #e2e8f0;
      }
      
      .resume-section {
        margin-bottom: 28px;
      }
      
      .resume-section-title {
        font-size: 14px;
        font-weight: 700;
        color: #1e3a5f;
        margin-bottom: 16px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        display: flex;
        align-items: center;
        gap: 8px;
      }
      
      .resume-section-content {
        font-size: 13px;
        color: #334155;
        line-height: 1.6;
      }
      
      .skills-list {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }
      
      .skill-tag {
        background: white;
        border: 1px solid #e2e8f0;
        padding: 6px 14px;
        border-radius: 20px;
        font-size: 12px;
        color: #1e3a5f;
        font-weight: 500;
        box-shadow: 0 1px 2px rgba(0,0,0,0.05);
      }
      
      .cert-item, .lang-item {
        margin-bottom: 6px;
        font-size: 13px;
        color: #334155;
      }
      
      /* Main Content */
      .resume-main {
        padding: 32px;
        background: white;
      }
      
      .main-section {
        margin-bottom: 28px;
      }
      
      .main-section-title {
        font-size: 16px;
        font-weight: 700;
        color: #1e3a5f;
        margin-bottom: 16px;
        padding-bottom: 8px;
        border-bottom: 2px solid #e2e8f0;
        display: flex;
        align-items: center;
        gap: 8px;
      }
      
      .summary-text {
        font-size: 13px;
        color: #334155;
        line-height: 1.6;
      }
      
      .education-details {
        margin-bottom: 12px;
      }
      
      .education-degree {
        font-weight: 700;
        color: #1e293b;
        font-size: 14px;
        margin-bottom: 4px;
      }
      
      .education-school {
        font-size: 13px;
        color: #475569;
        margin-bottom: 2px;
      }
      
      .education-meta {
        font-size: 12px;
        color: #64748b;
      }
      
      .bullet-list {
        list-style: none;
        padding-left: 0;
      }
      
      .bullet-item {
        font-size: 13px;
        color: #334155;
        margin-bottom: 8px;
        padding-left: 16px;
        position: relative;
      }
      
      .bullet-item:before {
        content: "•";
        position: absolute;
        left: 0;
        color: #3b82f6;
        font-weight: bold;
      }
      
      .inline-icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 18px;
        font-size: 14px;
      }
      
      @media print {
        body {
          background: white;
          padding: 0;
          margin: 0;
        }
        .resume-preview {
          box-shadow: none;
          border-radius: 0;
        }
        .resume-header {
          background: linear-gradient(135deg, #1e3a5f 0%, #0f2c4a 100%);
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        .resume-sidebar {
          background: #f8fafc;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        .skill-tag {
          background: white;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
      }
    `;
  };

  // Generate the complete HTML content for print
  const generatePrintHTML = () => {
    const skillsList = formData.skills ? formData.skills.split(',').map(s => s.trim()).filter(s => s) : [];
    const languagesList = formData.languages ? formData.languages.split(',').map(l => l.trim()).filter(l => l) : [];
    const experienceLines = formData.experience ? formData.experience.split('\n').filter(l => l.trim()) : [];
    const projectLines = formData.projects ? formData.projects.split('\n').filter(l => l.trim()) : [];
    const certificationLines = formData.certifications ? formData.certifications.split('\n').filter(c => c.trim()) : [];

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>${formData.fullName || 'Student'} - Resume</title>
          <style>${getResumeStyles()}</style>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
        </head>
        <body>
          <div class="resume-container">
            <div class="resume-preview">
              <!-- Header -->
              <div class="resume-header">
                <h1 class="resume-name">${formData.fullName || 'Student Name'}</h1>
                <p class="resume-title">${formData.degree ? `${formData.degree} Student` : 'Student'}</p>
                <div class="resume-contact">
                  ${formData.email ? `<span class="resume-contact-item">📧 ${formData.email}</span>` : ''}
                  ${formData.phone ? `<span class="resume-contact-item">📞 ${formData.phone}</span>` : ''}
                  ${formData.address ? `<span class="resume-contact-item">📍 ${formData.address}</span>` : ''}
                  ${formData.linkedin ? `<span class="resume-contact-item">🔗 ${formData.linkedin}</span>` : ''}
                  ${formData.github ? `<span class="resume-contact-item">🐙 ${formData.github}</span>` : ''}
                </div>
              </div>

              <!-- Body -->
              <div class="resume-body">
                <!-- Sidebar -->
                <div class="resume-sidebar">
                  ${skillsList.length > 0 ? `
                    <div class="resume-section">
                      <div class="resume-section-title">
                        💻 Technical Skills
                      </div>
                      <div class="skills-list">
                        ${skillsList.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                      </div>
                    </div>
                  ` : ''}
                  
                  ${languagesList.length > 0 ? `
                    <div class="resume-section">
                      <div class="resume-section-title">
                        🌐 Languages
                      </div>
                      <div class="resume-section-content">
                        ${languagesList.map(lang => `<div class="lang-item">${lang}</div>`).join('')}
                      </div>
                    </div>
                  ` : ''}
                  
                  ${certificationLines.length > 0 ? `
                    <div class="resume-section">
                      <div class="resume-section-title">
                        🏆 Certifications
                      </div>
                      <div class="resume-section-content">
                        ${certificationLines.map(cert => `<div class="cert-item">• ${cert}</div>`).join('')}
                      </div>
                    </div>
                  ` : ''}
                </div>

                <!-- Main Content -->
                <div class="resume-main">
                  ${formData.summary ? `
                    <div class="main-section">
                      <div class="main-section-title">
                        📋 Professional Summary
                      </div>
                      <div class="summary-text">${formData.summary}</div>
                    </div>
                  ` : ''}
                  
                  ${formData.degree || formData.university ? `
                    <div class="main-section">
                      <div class="main-section-title">
                        🎓 Education
                      </div>
                      <div class="education-details">
                        <div class="education-degree">${formData.degree || ''}</div>
                        <div class="education-school">${formData.university || ''}</div>
                        <div class="education-meta">
                          ${formData.graduationYear || ''} ${formData.cgpa ? `| ${formData.cgpa}` : ''}
                        </div>
                      </div>
                    </div>
                  ` : ''}
                  
                  ${experienceLines.length > 0 ? `
                    <div class="main-section">
                      <div class="main-section-title">
                        💼 Work Experience
                      </div>
                      <ul class="bullet-list">
                        ${experienceLines.map(line => `<li class="bullet-item">${line.replace(/^•\s*/, '')}</li>`).join('')}
                      </ul>
                    </div>
                  ` : ''}
                  
                  ${projectLines.length > 0 ? `
                    <div class="main-section">
                      <div class="main-section-title">
                        🚀 Projects
                      </div>
                      <ul class="bullet-list">
                        ${projectLines.map(line => `<li class="bullet-item">${line.replace(/^•\s*/, '')}</li>`).join('')}
                      </ul>
                    </div>
                  ` : ''}
                </div>
              </div>
            </div>
          </div>
          <script>
            window.onload = () => {
              setTimeout(() => {
                window.print();
              }, 500);
            };
          </script>
        </body>
      </html>
    `;
  };

  const handleDownload = () => {
    if (!showResume || !formData.fullName) return;
    
    const printHTML = generatePrintHTML();
    const printWindow = window.open('', '_blank');
    printWindow.document.write(printHTML);
    printWindow.document.close();
  };

  const skillsList = formData.skills ? formData.skills.split(',').map(s => s.trim()).filter(s => s) : [];
  const languagesList = formData.languages ? formData.languages.split(',').map(l => l.trim()).filter(l => l) : [];
  const experienceLines = formData.experience ? formData.experience.split('\n').filter(l => l.trim()) : [];
  const projectLines = formData.projects ? formData.projects.split('\n').filter(l => l.trim()) : [];
  const certificationLines = formData.certifications ? formData.certifications.split('\n').filter(c => c.trim()) : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-5">
      {/* Header */}
       <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-gray-400">
            <Link to="/student/dashboard" className="hover:text-blue-600 transition">
              Dashboard
            </Link>
            <span className="mx-2">&gt;</span>
            <span className="text-gray-600 font-medium">Resume</span>
          </p>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 pl-2 border-l border-gray-200"></div>
          </div>
        </div>
      <div className="mb-3">
        <h1 className="text-2xl font-bold tracking-tight text-gray-800">Resume Builder</h1>
        <p className="text-sm text-gray-500 mt-1">Fill in your details and generate a professional resume</p>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Left Column - Form Card */}
        <div className="col-span-12 lg:col-span-5">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden  sticky top-6">
            <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
                  <FaFileAlt className="text-white text-lg" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-800">Student Details</h2>
                  <p className="text-xs text-gray-500">Enter your information below</p>
                </div>
              </div>
            </div>

            <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto scrollbar-hide">
              {/* Personal Information */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                  <FaUser className="text-blue-500 text-sm" /> Personal Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Full Name *</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Email *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+1 234 567 8900"
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Address</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="City, Country"
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">LinkedIn</label>
                      <input
                        type="text"
                        name="linkedin"
                        value={formData.linkedin}
                        onChange={handleChange}
                        placeholder="linkedin.com/in/username"
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">GitHub</label>
                      <input
                        type="text"
                        name="github"
                        value={formData.github}
                        onChange={handleChange}
                        placeholder="github.com/username"
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Education */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                  <FaGraduationCap className="text-green-500 text-sm" /> Education
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Degree</label>
                    <input
                      type="text"
                      name="degree"
                      value={formData.degree}
                      onChange={handleChange}
                      placeholder="B.Sc. Computer Science"
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">University/College</label>
                    <input
                      type="text"
                      name="university"
                      value={formData.university}
                      onChange={handleChange}
                      placeholder="University Name"
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Graduation Year</label>
                      <input
                        type="text"
                        name="graduationYear"
                        value={formData.graduationYear}
                        onChange={handleChange}
                        placeholder="2024"
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">CGPA/Percentage</label>
                      <input
                        type="text"
                        name="cgpa"
                        value={formData.cgpa}
                        onChange={handleChange}
                        placeholder="8.5 CGPA"
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                  <FaCode className="text-purple-500 text-sm" /> Technical Skills
                </h3>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Skills (comma separated)
                  </label>
                  <textarea
                    name="skills"
                    value={formData.skills}
                    onChange={handleChange}
                    placeholder="React, Python, JavaScript, Node.js, SQL"
                    rows="3"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm resize-none"
                  />
                </div>
              </div>

              {/* Experience */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                  <FaBriefcase className="text-orange-500 text-sm" /> Work Experience
                </h3>
                <textarea
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  placeholder="Software Engineer Intern at Tech Corp (2023-Present)&#10;• Developed features for web application&#10;• Collaborated with cross-functional teams"
                  rows="4"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm resize-none"
                />
              </div>

              {/* Projects */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                  <FaCode className="text-indigo-500 text-sm" /> Projects
                </h3>
                <textarea
                  name="projects"
                  value={formData.projects}
                  onChange={handleChange}
                  placeholder="E-commerce Website - Built with React and Node.js&#10;• Implemented payment integration&#10;• Optimized database queries"
                  rows="4"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm resize-none"
                />
              </div>

              {/* Certifications */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-4">Certifications</h3>
                <textarea
                  name="certifications"
                  value={formData.certifications}
                  onChange={handleChange}
                  placeholder="AWS Certified Cloud Practitioner&#10;Google Data Analytics Certificate"
                  rows="3"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm resize-none"
                />
              </div>

              {/* Languages */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-4">Languages</h3>
                <textarea
                  name="languages"
                  value={formData.languages}
                  onChange={handleChange}
                  placeholder="English (Fluent), Hindi (Native), Spanish (Basic)"
                  rows="2"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm resize-none"
                />
              </div>

              {/* Professional Summary */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-4">Professional Summary</h3>
                <textarea
                  name="summary"
                  value={formData.summary}
                  onChange={handleChange}
                  placeholder="Enthusiastic computer science student with strong problem-solving skills..."
                  rows="4"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm resize-none"
                />
              </div>
            </div>

            <div className="px-6 py-5 border-t border-gray-100 bg-gray-50">
              <button
                onClick={handleGenerateResume}
                disabled={!formData.fullName || !formData.email}
                className={`w-full py-3 rounded-xl font-semibold text-white transition-all flex items-center justify-center gap-2 ${
                  !formData.fullName || !formData.email
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg"
                }`}
              >
                <FaFileAlt className="text-sm" />
                Create Resume
              </button>
              {(!formData.fullName || !formData.email) && (
                <p className="text-xs text-gray-500 text-center mt-2">
                  * Full Name and Email are required
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Two Cards */}
        <div className="col-span-12 lg:col-span-7 space-y-3 -ml-3 ">
          {/* Resume Preview Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-3 pl-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-600 flex items-center justify-center">
                  <FaFileAlt className="text-white text-lg" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-800">Resume Preview</h2>
                  <p className="text-xs text-gray-500">Auto-generated from your details</p>
                </div>
              </div>
              {showResume && formData.fullName && (
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-semibold transition-all shadow-sm"
                >
                  <FaDownload className="text-sm" /> Download PDF
                </button>
              )}
            </div>

            <div className="p-6 bg-gray-50 max-h-[800px] overflow-y-auto">
              {showResume && formData.fullName ? (
                <div ref={resumeRef} className="resume-preview-wrapper">
                  <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    {/* Resume Header */}
                    <div className="bg-gradient-to-r from-blue-700 to-indigo-800 px-8 py-8 text-white">
                      <h1 className="text-3xl font-bold mb-2">{formData.fullName}</h1>
                      <p className="text-blue-100 text-base">
                        {formData.degree ? `${formData.degree} Student` : "Student"}
                      </p>
                      <div className="flex flex-wrap gap-4 mt-5 text-sm text-blue-100">
                        {formData.email && (
                          <span className="flex items-center gap-2">
                            📧 {formData.email}
                          </span>
                        )}
                        {formData.phone && (
                          <span className="flex items-center gap-2">
                            📞 {formData.phone}
                          </span>
                        )}
                        {formData.address && (
                          <span className="flex items-center gap-2">
                            📍 {formData.address}
                          </span>
                        )}
                      </div>
                      {(formData.linkedin || formData.github) && (
                        <div className="flex flex-wrap gap-4 mt-2 text-sm text-blue-100">
                          {formData.linkedin && (
                            <span className="flex items-center gap-2">
                              🔗 {formData.linkedin}
                            </span>
                          )}
                          {formData.github && (
                            <span className="flex items-center gap-2">
                              🐙 {formData.github}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Resume Body */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
                      {/* Sidebar */}
                      <div className="bg-gray-50 p-6 border-r border-gray-200">
                        {skillsList.length > 0 && (
                          <div className="mb-6">
                            <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                              💻 Technical Skills
                            </h3>
                            <div className="flex flex-wrap gap-2">
                              {skillsList.map((skill, i) => (
                                <span key={i} className="bg-white px-3 py-1.5 rounded-full text-xs text-gray-700 shadow-sm border border-gray-200">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {languagesList.length > 0 && (
                          <div className="mb-6">
                            <h3 className="text-sm font-bold text-gray-700 mb-3">🌐 Languages</h3>
                            <div className="space-y-1">
                              {languagesList.map((lang, i) => (
                                <p key={i} className="text-sm text-gray-600">{lang}</p>
                              ))}
                            </div>
                          </div>
                        )}

                        {certificationLines.length > 0 && (
                          <div className="mb-6">
                            <h3 className="text-sm font-bold text-gray-700 mb-3">🏆 Certifications</h3>
                            <div className="space-y-2">
                              {certificationLines.map((cert, i) => (
                                <p key={i} className="text-sm text-gray-600">• {cert}</p>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Main Content */}
                      <div className="md:col-span-2 p-6">
                        {formData.summary && (
                          <div className="mb-6">
                            <h3 className="text-base font-bold text-gray-800 mb-3 border-b-2 border-gray-200 pb-2">
                              📋 Professional Summary
                            </h3>
                            <p className="text-sm text-gray-600 leading-relaxed">{formData.summary}</p>
                          </div>
                        )}

                        {(formData.degree || formData.university) && (
                          <div className="mb-6">
                            <h3 className="text-base font-bold text-gray-800 mb-3 border-b-2 border-gray-200 pb-2">
                              🎓 Education
                            </h3>
                            <div>
                              <p className="font-semibold text-gray-800">{formData.degree}</p>
                              <p className="text-sm text-gray-600">{formData.university}</p>
                              <p className="text-sm text-gray-500">
                                {formData.graduationYear} {formData.cgpa && `| ${formData.cgpa}`}
                              </p>
                            </div>
                          </div>
                        )}

                        {experienceLines.length > 0 && (
                          <div className="mb-6">
                            <h3 className="text-base font-bold text-gray-800 mb-3 border-b-2 border-gray-200 pb-2">
                              💼 Work Experience
                            </h3>
                            <div className="space-y-1">
                              {experienceLines.map((line, i) => (
                                <p key={i} className="text-sm text-gray-600">
                                  {line.startsWith('•') ? line : `• ${line}`}
                                </p>
                              ))}
                            </div>
                          </div>
                        )}

                        {projectLines.length > 0 && (
                          <div className="mb-6">
                            <h3 className="text-base font-bold text-gray-800 mb-3 border-b-2 border-gray-200 pb-2">
                              🚀 Projects
                            </h3>
                            <div className="space-y-1">
                              {projectLines.map((line, i) => (
                                <p key={i} className="text-sm text-gray-600">
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
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mb-4">
                    <FaFileAlt className="text-4xl text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">No Resume Generated Yet</h3>
                  <p className="text-sm text-gray-500 max-w-md">
                    Fill in your details in the form and click "Create Resume" to generate a professional resume preview here.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Tips Card */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-100">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                <FaFileAlt className="text-blue-600 text-lg" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Resume Tips</h3>
                <p className="text-sm text-gray-600">
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
  );
};

export default ResumeBuilder;