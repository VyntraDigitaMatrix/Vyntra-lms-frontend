import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { adminJobsApi } from "../auth/api";
import { ArrowLeft, Save, Briefcase, Paperclip, X } from "lucide-react";

export default function JobCreateEdit() {
  const { jobSlug } = useParams();
  const isEdit = Boolean(jobSlug);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    companyName: "",
    description: "",
    requirements: "",
    skills: [],
    location: "",
    salary: "",
    experienceLevel: "",
    applicationDeadline: "",
    active: true,
  });

  const [skillInput, setSkillInput] = useState("");
  const [attachmentFile, setAttachmentFile] = useState(null);
  const [existingAttachment, setExistingAttachment] = useState("");
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isEdit) {
      const fetchJob = async () => {
        try {
          const res = await adminJobsApi.getJobBySlug(jobSlug);
          const job = res.data.data;
          setFormData({
            title: job.title || "",
            companyName: job.companyName || "",
            description: job.description || "",
            requirements: job.requirements || "",
            skills: job.skills || [],
            location: job.location || "",
            salary: job.salary || "",
            experienceLevel: job.experienceLevel || "",
            applicationDeadline: job.applicationDeadline || "",
            active: job.active ?? true,
          });
          setExistingAttachment(job.attachmentUrl || "");
        } catch (err) {
          console.error("Failed to load job details:", err);
          setError("Failed to load job details.");
        } finally {
          setLoading(false);
        }
      };
      fetchJob();
    }
  }, [jobSlug, isEdit]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddSkill = (e) => {
    if (e.key === "Enter" && skillInput.trim() !== "") {
      e.preventDefault();
      if (!formData.skills.includes(skillInput.trim())) {
        setFormData((prev) => ({
          ...prev,
          skills: [...prev.skills, skillInput.trim()],
        }));
      }
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (skill) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const data = new FormData();
    data.append("title", formData.title);
    data.append("companyName", formData.companyName);
    data.append("description", formData.description);
    data.append("requirements", formData.requirements);
    data.append("location", formData.location);
    data.append("salary", formData.salary);
    data.append("experienceLevel", formData.experienceLevel);
    data.append("applicationDeadline", formData.applicationDeadline);
    data.append("active", formData.active);
    
    // Append skills individually for an array format
    formData.skills.forEach((skill) => {
      data.append("skills", skill);
    });

    if (attachmentFile) {
      data.append("attachmentFile", attachmentFile);
    }

    try {
      if (isEdit) {
        await adminJobsApi.updateJob(jobSlug, data);
      } else {
        await adminJobsApi.createJob(data);
      }
      navigate("/admin/jobs");
    } catch (err) {
      console.error("Failed to save job:", err);
      let msg = err.response?.data?.message || "Failed to save job.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">Loading job details...</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate("/admin/jobs")}
            className="w-10 h-10 flex items-center justify-center bg-white rounded-lg border border-gray-200 text-gray-500 hover:text-[#2BB2A9] transition shadow-sm"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEdit ? "Edit Job" : "Create New Job"}
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {isEdit ? "Update existing job details" : "Fill out the details to post a new job"}
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 flex items-center gap-3">
            <X className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Job Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                  Job Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g. Senior Frontend Developer"
                  className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:border-[#2BB2A9] focus:bg-white transition outline-none"
                />
              </div>

              {/* Company Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="companyName"
                  required
                  value={formData.companyName}
                  onChange={handleInputChange}
                  placeholder="e.g. Tech Corp Inc."
                  className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:border-[#2BB2A9] focus:bg-white transition outline-none"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="e.g. Remote, New York"
                  className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:border-[#2BB2A9] focus:bg-white transition outline-none"
                />
              </div>

              {/* Salary */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                  Salary Range
                </label>
                <input
                  type="text"
                  name="salary"
                  value={formData.salary}
                  onChange={handleInputChange}
                  placeholder="e.g. $80k - $120k"
                  className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:border-[#2BB2A9] focus:bg-white transition outline-none"
                />
              </div>

              {/* Experience Level */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                  Experience Level
                </label>
                <input
                  type="text"
                  name="experienceLevel"
                  value={formData.experienceLevel}
                  onChange={handleInputChange}
                  placeholder="e.g. Mid-Level, 3+ years"
                  className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:border-[#2BB2A9] focus:bg-white transition outline-none"
                />
              </div>

              {/* Application Deadline */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                  Application Deadline
                </label>
                <input
                  type="date"
                  name="applicationDeadline"
                  value={formData.applicationDeadline}
                  onChange={handleInputChange}
                  className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:border-[#2BB2A9] focus:bg-white transition outline-none"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                Job Description
              </label>
              <textarea
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe the role and responsibilities..."
                className="w-full p-4 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:border-[#2BB2A9] focus:bg-white transition outline-none resize-none"
              ></textarea>
            </div>

            {/* Requirements */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                Requirements
              </label>
              <textarea
                name="requirements"
                rows={4}
                value={formData.requirements}
                onChange={handleInputChange}
                placeholder="List the job requirements..."
                className="w-full p-4 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:border-[#2BB2A9] focus:bg-white transition outline-none resize-none"
              ></textarea>
            </div>

            {/* Skills */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                Skills
              </label>
              <div className="w-full p-2 min-h-[44px] rounded-xl border border-gray-200 bg-gray-50 focus-within:border-[#2BB2A9] focus-within:bg-white transition flex flex-wrap gap-2 items-center">
                {formData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="flex items-center gap-1 bg-teal-100 text-teal-800 text-xs px-2 py-1 rounded-md"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="hover:text-red-500"
                    >
                      &times;
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={handleAddSkill}
                  placeholder="Type a skill and press enter..."
                  className="flex-1 bg-transparent border-none outline-none text-sm min-w-[200px]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              {/* Attachment File */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                  Attachment File (Optional)
                </label>
                <div className="relative">
                  <input
                    type="file"
                    onChange={(e) => setAttachmentFile(e.target.files[0])}
                    className="hidden"
                    id="attachment-upload"
                  />
                  <label
                    htmlFor="attachment-upload"
                    className="flex items-center gap-3 w-full h-11 px-4 rounded-xl border border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 cursor-pointer transition"
                  >
                    <Paperclip size={18} className="text-gray-400" />
                    <span className="text-sm text-gray-600 truncate">
                      {attachmentFile ? attachmentFile.name : (existingAttachment ? "Change attached file" : "Upload attachment")}
                    </span>
                  </label>
                </div>
                {existingAttachment && !attachmentFile && (
                  <p className="text-xs text-teal-600 mt-2 flex items-center gap-1">
                    <a href={existingAttachment} target="_blank" rel="noreferrer" className="hover:underline">
                      View current attachment
                    </a>
                  </p>
                )}
              </div>

              {/* Active Toggle */}
              <div className="flex items-center gap-3 mt-4 md:mt-0">
                <div
                  className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                    formData.active ? "bg-[#2BB2A9]" : "bg-gray-300"
                  }`}
                  onClick={() => setFormData((prev) => ({ ...prev, active: !prev.active }))}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform ${
                      formData.active ? "translate-x-6" : "translate-x-0"
                    }`}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-800">
                  Active (Visible to users)
                </span>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100 flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-2 bg-[#2BB2A9] hover:bg-teal-600 text-white px-6 py-2.5 rounded-xl font-medium transition shadow-sm disabled:opacity-50"
              >
                <Save size={18} />
                {submitting ? "Saving..." : (isEdit ? "Update Job" : "Create Job")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
