import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import S1 from "../../assets/S1.jpg";
import S2 from "../../assets/S2.jpg";
import S3 from "../../assets/S3.jpg";
import S4 from "../../assets/S4.jpg";
import S5 from "../../assets/S5.jpg";
import S6 from "../../assets/S6.jpg";
import S7 from "../../assets/S7.jpg";
import S8 from "../../assets/S8.jpg";
import {
  FaChevronLeft, FaChevronRight, FaEdit, FaTrash,
  FaEye, FaPlus, FaTimes, FaUpload, FaVideo, FaLink,
  FaCheckCircle,
} from "react-icons/fa";
import { instructorCourseApi } from "../auth/api";

const defaultImages = [S1, S2, S3, S4, S5, S6, S7, S8];

/* ─────────────────────────────────────────
   SHARED VIDEO UPLOAD SECTION
   ───────────────────────────────────────── */
const VideoUploadSection = ({
  videoTab, setVideoTab,
  videoFile, videoProgress, videoPreviewUrl,
  videoDragging, setVideoDragging, videoUploading,
  videoInputRef, startVideoUpload, resetVideo,
  promoVideoUrl, onPromoChange,
  inputClass, labelClass, formatFileSize,
}) => (
  <div>
    <label className={labelClass}>
      Course Promo Video
    </label>
    <div className="flex gap-2 mb-3">
      {[["upload", FaUpload, "Upload File"], ["url", FaLink, "Video URL"]].map(([tab, Icon, label]) => (
        <button
          key={tab} type="button"
          onClick={() => setVideoTab(tab)}
          className={`flex-1 h-9 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition ${videoTab === tab
              ? "bg-violet-600 border-violet-600 text-white"
              : "border-gray-200 text-gray-500 hover:border-violet-300"
            }`}
        >
          <Icon className="text-[10px]" /> {label}
        </button>
      ))}
    </div>

    {videoTab === "upload" && (
      <div className="space-y-3">
        {!videoFile ? (
          <div
            onDragOver={(e) => { e.preventDefault(); setVideoDragging(true); }}
            onDragLeave={() => setVideoDragging(false)}
            onDrop={(e) => {
              e.preventDefault(); setVideoDragging(false);
              const file = e.dataTransfer.files[0];
              if (file?.type.startsWith("video/")) startVideoUpload(file);
            }}
            onClick={() => videoInputRef.current?.click()}
            className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition ${videoDragging ? "border-violet-400 bg-violet-50" : "border-gray-200 hover:border-violet-400 hover:bg-violet-50"
              }`}
          >
            <FaVideo className="text-2xl text-gray-400 mb-2" />
            <span className="text-xs font-medium text-gray-500">Click or drag & drop to upload video</span>
            <span className="text-[11px] text-gray-400 mt-1">MP4, MOV, AVI, MKV · Max 2GB</span>
            <input
              ref={videoInputRef} type="file" accept="video/*" className="hidden"
              onChange={(e) => { if (e.target.files[0]) startVideoUpload(e.target.files[0]); }}
            />
          </div>
        ) : (
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-3.5 space-y-2.5">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center flex-shrink-0">
                  <FaVideo className="text-violet-600 text-sm" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-gray-800 truncate">{videoFile.name}</p>
                  <p className="text-[11px] text-gray-400">{formatFileSize(videoFile.size)}</p>
                </div>
              </div>
              <button
                type="button" onClick={resetVideo}
                className="flex-shrink-0 w-6 h-6 rounded-md flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 transition"
              >
                <FaTimes className="text-[10px]" />
              </button>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] text-gray-500">{videoUploading ? "Uploading..." : "Upload complete"}</span>
                <span className="text-[11px] font-semibold text-violet-600">{videoProgress}%</span>
              </div>
              <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-200"
                  style={{ width: `${videoProgress}%`, background: videoProgress === 100 ? "#16a34a" : "#7c3aed" }}
                />
              </div>
            </div>
            {videoProgress === 100 && (
              <div className="flex items-center gap-1.5">
                <FaCheckCircle className="text-green-500 text-xs" />
                <span className="text-[11px] text-green-600 font-semibold">Video uploaded successfully</span>
              </div>
            )}
          </div>
        )}
        {videoPreviewUrl && videoProgress === 100 && (
          <div>
            <label className={labelClass}>Video Preview</label>
            <video src={videoPreviewUrl} controls className="w-full rounded-xl border border-gray-200 bg-black max-h-48 mt-1" />
          </div>
        )}
      </div>
    )}

    {videoTab === "url" && (
      <div className="space-y-2">
        <input
          value={promoVideoUrl} onChange={onPromoChange}
          placeholder="https://youtube.com/watch?v=... or Vimeo URL"
          className={inputClass}
        />
        <p className="text-[11px] text-gray-400">Supports YouTube, Vimeo, or direct MP4 links</p>
        {promoVideoUrl?.startsWith("http") && (
          <div className="flex items-center gap-2 bg-violet-50 border border-violet-100 rounded-lg px-3 py-2">
            <FaLink className="text-violet-400 text-xs flex-shrink-0" />
            <span className="text-xs text-violet-700 font-medium truncate flex-1">{promoVideoUrl}</span>
            <span className="text-[10px] bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded-full whitespace-nowrap">✓ Linked</span>
          </div>
        )}
      </div>
    )}
  </div>
);

/* ─────────────────────────────────────────
   STEP INDICATOR (shared)
   ───────────────────────────────────────── */
const StepIndicator = ({ step, setStep }) => (
  <div className="flex items-center px-6 pt-4 pb-2">
    {["Basic Info", "Pricing & Details", "Media"].map((label, i) => (
      <React.Fragment key={i}>
        <button
          type="button"
          onClick={() => setStep(i + 1)}
          className={`flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full transition ${step === i + 1 ? "bg-violet-600 text-white" : step > i + 1 ? "bg-violet-100 text-violet-600" : "text-gray-400"
            }`}
        >
          <span className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-bold ${step === i + 1 ? "bg-white text-violet-600" : step > i + 1 ? "bg-violet-500 text-white" : "bg-gray-200 text-gray-500"
            }`}>
            {step > i + 1 ? "✓" : i + 1}
          </span>
          {label}
        </button>
        {i < 2 && <div className={`flex-1 h-px mx-1 ${step > i + 1 ? "bg-violet-400" : "bg-gray-200"}`} />}
      </React.Fragment>
    ))}
  </div>
);

/* ─────────────────────────────────────────
   CREATE COURSE MODAL
   ───────────────────────────────────────── */
const emptyForm = {
  title: "", slug: "", description: "",
  thumbnailUrl: "", promoVideoUrl: "",
  price: "", discountPrice: "",
  language: "", level: "", status: "Draft",
  lifetimeAccess: true, validityInDays: ""
};

const CreateCourseModal = ({ onClose, onCreate }) => {
  const [form, setForm] = useState(emptyForm);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [step, setStep] = useState(1);
  const [videoTab, setVideoTab] = useState("upload");
  const [videoFile, setVideoFile] = useState(null);
  const [videoProgress, setVideoProgress] = useState(0);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState(null);
  const [videoDragging, setVideoDragging] = useState(false);
  const [videoUploading, setVideoUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const videoInputRef = useRef(null);
  const uploadIntervalRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === "title") {
        updated.slug = value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      }
      return updated;
    });
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnailPreview(URL.createObjectURL(file));
      setThumbnailFile(file);
      setForm((prev) => ({ ...prev, thumbnailUrl: "" }));
    }
  };

  const startVideoUpload = (file) => {
    if (!file.type.startsWith("video/")) return;
    setVideoFile(file); setVideoProgress(0); setVideoUploading(true);
    setVideoPreviewUrl(URL.createObjectURL(file));
    let progress = 0;
    clearInterval(uploadIntervalRef.current);
    uploadIntervalRef.current = setInterval(() => {
      progress += Math.random() * 10 + 4;
      if (progress >= 100) { progress = 100; clearInterval(uploadIntervalRef.current); setVideoUploading(false); }
      setVideoProgress(Math.round(progress));
    }, 200);
  };

  const resetVideo = () => {
    clearInterval(uploadIntervalRef.current);
    setVideoFile(null); setVideoProgress(0); setVideoPreviewUrl(null); setVideoUploading(false);
    if (videoInputRef.current) videoInputRef.current.value = "";
  };

  const handleNext = () => setStep((s) => s + 1);
  const handleBack = () => step > 1 ? setStep((s) => s - 1) : onClose();

  const handleCreate = async () => {
    setSubmitting(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("language", form.language || "English");
      formData.append("level", form.level || "BEGINNER");
      formData.append("price", form.price);
      if (form.discountPrice) {
        formData.append("discountPrice", form.discountPrice);
      }
      formData.append("lifetimeAccess", form.lifetimeAccess ? "true" : "false");
      if (!form.lifetimeAccess && form.validityInDays) {
        formData.append("validityInDays", form.validityInDays);
      }

      // Thumbnail
      if (thumbnailFile) {
        formData.append("thumbnailInputType", "FILE_UPLOAD");
        formData.append("thumbnailFile", thumbnailFile);
      } else if (form.thumbnailUrl) {
        formData.append("thumbnailInputType", "URL");
        formData.append("thumbnailUrl", form.thumbnailUrl);
      } else {
        formData.append("thumbnailInputType", "URL");
        formData.append("thumbnailUrl", "");
      }

      // Video
      if (videoTab === "upload" && videoFile) {
        formData.append("promoVideoInputType", "FILE_UPLOAD");
        formData.append("promoVideoFile", videoFile);
      } else if (videoTab === "url" && form.promoVideoUrl) {
        formData.append("promoVideoInputType", "URL");
        formData.append("promoVideoUrl", form.promoVideoUrl);
      } else {
        formData.append("promoVideoInputType", "URL");
        formData.append("promoVideoUrl", "");
      }

      const res = await instructorCourseApi.createCourse(formData);
      if (res.data) {
        onCreate();
        onClose();
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to create course. Ensure Validity is specified if Lifetime Access is disabled.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = "w-full h-10 px-3 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-800 outline-none focus:border-violet-400 focus:bg-white transition placeholder:text-gray-400";
  const labelClass = "block text-xs font-semibold text-gray-600 mb-1";
  const formatFileSize = (bytes) => bytes < 1024 * 1024 ? `${(bytes / 1024).toFixed(0)} KB` : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10 rounded-t-2xl">
          <div>
            <h2 className="text-base font-bold text-gray-900">Create New Course</h2>
            <p className="text-xs text-gray-400 mt-0.5">Fill in the details to publish your course</p>
          </div>
          <button type="button" onClick={onClose} className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-red-50 hover:text-red-500 flex items-center justify-center text-gray-500 transition" disabled={submitting}>
            <FaTimes className="text-xs" />
          </button>
        </div>

        <StepIndicator step={step} setStep={setStep} />

        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-50 text-red-700 rounded-lg text-xs font-semibold">
            ⚠️ {error}
          </div>
        )}

        <div className="px-6 py-4 space-y-4">
          {step === 1 && (
            <>
              <div>
                <label className={labelClass}>Course Title <span className="text-red-400">*</span></label>
                <input name="title" value={form.title} onChange={handleChange} placeholder="e.g. Digital Marketing Fundamentals" className={inputClass} required disabled={submitting} />
              </div>
              <div>
                <label className={labelClass}>Slug</label>
                <div className="relative">
                  <input name="slug" value={form.slug} onChange={handleChange} placeholder="auto-generated from title" className={`${inputClass} pr-16 text-violet-600`} readOnly />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded">auto</span>
                </div>
              </div>
              <div>
                <label className={labelClass}>Description <span className="text-red-400">*</span></label>
                <textarea name="description" value={form.description} onChange={handleChange} placeholder="Describe what students will learn in this course..." rows={4} className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-800 outline-none focus:border-violet-400 focus:bg-white transition placeholder:text-gray-400 resize-none" required disabled={submitting} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Language <span className="text-red-400">*</span></label>
                  <select name="language" value={form.language} onChange={handleChange} className={inputClass} required disabled={submitting}>
                    <option value="">Select language</option>
                    <option>English</option><option>Hindi</option><option>Telugu</option><option>Tamil</option><option>Kannada</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Level <span className="text-red-400">*</span></label>
                  <select name="level" value={form.level} onChange={handleChange} className={inputClass} required disabled={submitting}>
                    <option value="">Select level</option>
                    <option value="BEGINNER">Beginner</option>
                    <option value="INTERMEDIATE">Intermediate</option>
                    <option value="ADVANCED">Advanced</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Price (₹) <span className="text-red-400">*</span></label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">₹</span>
                    <input name="price" type="number" value={form.price} onChange={handleChange} placeholder="0.00" className={`${inputClass} pl-7`} required disabled={submitting} />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Discount Price (₹)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">₹</span>
                    <input name="discountPrice" type="number" value={form.discountPrice} onChange={handleChange} placeholder="0.00" className={`${inputClass} pl-7`} disabled={submitting} />
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-3">
                <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.lifetimeAccess}
                    onChange={(e) => setForm(p => ({
                      ...p,
                      lifetimeAccess: e.target.checked,
                      validityInDays: e.target.checked ? "" : p.validityInDays
                    }))}
                    className="w-4 h-4 text-violet-600 border-gray-300 rounded focus:ring-violet-500"
                    disabled={submitting}
                  />
                  Lifetime Course Access
                </label>

                {!form.lifetimeAccess && (
                  <div>
                    <label className={labelClass}>Validity in Days <span className="text-red-400">*</span></label>
                    <input
                      name="validityInDays"
                      type="number"
                      value={form.validityInDays}
                      onChange={handleChange}
                      placeholder="e.g. 365"
                      className={inputClass}
                      required
                      disabled={submitting}
                    />
                  </div>
                )}
              </div>

              {form.price && form.discountPrice && Number(form.discountPrice) < Number(form.price) && (
                <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-2.5 flex items-center justify-between">
                  <span className="text-xs text-green-700 font-medium">Discount applied</span>
                  <span className="text-sm font-bold text-green-700">{Math.round(((form.price - form.discountPrice) / form.price) * 100)}% OFF</span>
                </div>
              )}
            </>
          )}

          {step === 3 && (
            <>
              <div>
                <label className={labelClass}>Course Thumbnail</label>
                <div className="flex gap-3 mb-3">
                  <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-violet-400 hover:bg-violet-50 transition overflow-hidden relative">
                    {thumbnailPreview ? (
                      <>
                        <img src={thumbnailPreview} alt="preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition flex flex-col items-center justify-center gap-1">
                          <FaUpload className="text-white text-lg" />
                          <span className="text-white text-xs font-semibold">Click to replace</span>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-gray-400">
                        <FaUpload className="text-2xl" />
                        <span className="text-xs font-medium">Click to upload thumbnail</span>
                        <span className="text-[11px]">PNG, JPG up to 5MB</span>
                      </div>
                    )}
                    <input type="file" accept="image/*" className="hidden" onChange={handleThumbnailChange} disabled={submitting} />
                  </label>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  <span>Or Thumbnail Url:</span>
                  <input name="thumbnailUrl" value={form.thumbnailUrl} onChange={(e) => {
                    setForm(p => ({ ...p, thumbnailUrl: e.target.value }));
                    setThumbnailPreview(e.target.value || null);
                    setThumbnailFile(null);
                  }} placeholder="Enter image URL instead of file upload" className={`${inputClass} mt-1`} disabled={submitting} />
                </div>
              </div>

              <VideoUploadSection
                videoTab={videoTab} setVideoTab={setVideoTab}
                videoFile={videoFile} videoProgress={videoProgress} videoPreviewUrl={videoPreviewUrl}
                videoDragging={videoDragging} setVideoDragging={setVideoDragging} videoUploading={videoUploading}
                videoInputRef={videoInputRef} startVideoUpload={startVideoUpload} resetVideo={resetVideo}
                promoVideoUrl={form.promoVideoUrl}
                onPromoChange={(e) => setForm(p => ({ ...p, promoVideoUrl: e.target.value }))}
                inputClass={inputClass} labelClass={labelClass} formatFileSize={formatFileSize}
              />
            </>
          )}

          <div className="flex items-center justify-between pt-2 pb-1">
            <button type="button" onClick={handleBack}
              className="h-10 px-5 rounded-xl border border-gray-200 text-sm text-gray-600 font-semibold hover:bg-gray-50 transition" disabled={submitting}>
              {step === 1 ? "Cancel" : "← Back"}
            </button>
            {step < 3 ? (
              <button type="button" onClick={handleNext}
                className="h-10 px-6 rounded-xl bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 transition">
                Next →
              </button>
            ) : (
              <button type="button" onClick={handleCreate} disabled={submitting}
                className="h-10 px-6 rounded-xl bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 transition flex items-center gap-2">
                {submitting ? "Creating..." : <><FaPlus className="text-xs" /> Create Course</>}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────
   EDIT COURSE MODAL
   ───────────────────────────────────────── */
const EditCourseModal = ({ course, onClose, onUpdate }) => {
  const [form, setForm] = useState({
    description: course.description ?? "",
    thumbnailUrl: course.thumbnailUrl ?? "",
    promoVideoUrl: course.promoVideoUrl ?? ""
  });

  const [thumbnailPreview, setThumbnailPreview] = useState(course.thumbnailUrl || null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [videoTab, setVideoTab] = useState(course.promoVideoUrl ? "url" : "upload");
  const [videoFile, setVideoFile] = useState(null);
  const [videoProgress, setVideoProgress] = useState(0);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState(null);
  const [videoDragging, setVideoDragging] = useState(false);
  const [videoUploading, setVideoUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const videoInputRef = useRef(null);
  const uploadIntervalRef = useRef(null);

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnailPreview(URL.createObjectURL(file));
      setThumbnailFile(file);
      setForm((prev) => ({ ...prev, thumbnailUrl: "" }));
    }
  };

  const startVideoUpload = (file) => {
    if (!file.type.startsWith("video/")) return;
    setVideoFile(file); setVideoProgress(0); setVideoUploading(true);
    setVideoPreviewUrl(URL.createObjectURL(file));
    let progress = 0;
    clearInterval(uploadIntervalRef.current);
    uploadIntervalRef.current = setInterval(() => {
      progress += Math.random() * 10 + 4;
      if (progress >= 100) { progress = 100; clearInterval(uploadIntervalRef.current); setVideoUploading(false); }
      setVideoProgress(Math.round(progress));
    }, 200);
  };

  const resetVideo = () => {
    clearInterval(uploadIntervalRef.current);
    setVideoFile(null); setVideoProgress(0); setVideoPreviewUrl(null); setVideoUploading(false);
    if (videoInputRef.current) videoInputRef.current.value = "";
  };

  const handleSave = async () => {
    setSubmitting(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("description", form.description);

      // Thumbnail
      if (thumbnailFile) {
        formData.append("thumbnailInputType", "FILE_UPLOAD");
        formData.append("thumbnailFile", thumbnailFile);
      } else if (form.thumbnailUrl) {
        formData.append("thumbnailInputType", "URL");
        formData.append("thumbnailUrl", form.thumbnailUrl);
      } else {
        formData.append("thumbnailInputType", "URL");
        formData.append("thumbnailUrl", course.thumbnailUrl || "");
      }

      // Video
      if (videoTab === "upload" && videoFile) {
        formData.append("promoVideoInputType", "FILE_UPLOAD");
        formData.append("promoVideoFile", videoFile);
      } else if (videoTab === "url" && form.promoVideoUrl) {
        formData.append("promoVideoInputType", "URL");
        formData.append("promoVideoUrl", form.promoVideoUrl);
      } else {
        formData.append("promoVideoInputType", "URL");
        formData.append("promoVideoUrl", course.promoVideoUrl || "");
      }

      const res = await instructorCourseApi.updateCourseContent(course.id, formData);
      if (res.data) {
        onUpdate();
        onClose();
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to update course content.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = "w-full h-10 px-3 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-800 outline-none focus:border-violet-400 focus:bg-white transition placeholder:text-gray-400";
  const labelClass = "block text-xs font-semibold text-gray-600 mb-1";
  const formatFileSize = (bytes) => bytes < 1024 * 1024 ? `${(bytes / 1024).toFixed(0)} KB` : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10 rounded-t-2xl">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-gray-900">Edit Course Content</h2>
              <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded font-semibold">ID: {course.id}</span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">Modify description and media content</p>
          </div>
          <button type="button" onClick={onClose} className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-red-50 hover:text-red-500 flex items-center justify-center text-gray-500 transition" disabled={submitting}>
            <FaTimes className="text-xs" />
          </button>
        </div>

        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-50 text-red-700 rounded-lg text-xs font-semibold">
            ⚠️ {error}
          </div>
        )}

        <div className="px-6 py-4 space-y-4">
          <div>
            <label className={labelClass}>Course Title (Read-Only)</label>
            <input value={course.title} readOnly className={`${inputClass} bg-gray-100 text-gray-400 cursor-not-allowed`} />
          </div>

          <div>
            <label className={labelClass}>Description <span className="text-red-400">*</span></label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Describe what students will learn..."
              rows={4}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-800 outline-none focus:border-violet-400 focus:bg-white transition placeholder:text-gray-400 resize-none"
              required
              disabled={submitting}
            />
          </div>

          <div>
            <label className={labelClass}>Course Thumbnail</label>
            <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-violet-400 hover:bg-violet-50 transition overflow-hidden relative">
              {thumbnailPreview ? (
                <>
                  <img src={thumbnailPreview} alt="preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition flex flex-col items-center justify-center gap-1">
                    <FaUpload className="text-white text-lg" />
                    <span className="text-white text-xs font-semibold">Click to replace</span>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center gap-2 text-gray-400">
                  <FaUpload className="text-2xl" />
                  <span className="text-xs font-medium">Click to upload thumbnail</span>
                  <span className="text-[11px]">PNG, JPG up to 5MB</span>
                </div>
              )}
              <input type="file" accept="image/*" className="hidden" onChange={handleThumbnailChange} disabled={submitting} />
            </label>
            <div className="mt-2 text-xs text-gray-500">
              <span>Or Thumbnail URL:</span>
              <input value={form.thumbnailUrl} onChange={(e) => {
                setForm(p => ({ ...p, thumbnailUrl: e.target.value }));
                setThumbnailPreview(e.target.value || null);
                setThumbnailFile(null);
              }} placeholder="Enter URL" className={`${inputClass} mt-1`} disabled={submitting} />
            </div>
          </div>

          <VideoUploadSection
            videoTab={videoTab} setVideoTab={setVideoTab}
            videoFile={videoFile} videoProgress={videoProgress} videoPreviewUrl={videoPreviewUrl}
            videoDragging={videoDragging} setVideoDragging={setVideoDragging} videoUploading={videoUploading}
            videoInputRef={videoInputRef} startVideoUpload={startVideoUpload} resetVideo={resetVideo}
            promoVideoUrl={form.promoVideoUrl}
            onPromoChange={(e) => setForm(p => ({ ...p, promoVideoUrl: e.target.value }))}
            inputClass={inputClass} labelClass={labelClass} formatFileSize={formatFileSize}
          />

          <div className="flex items-center justify-between pt-2 pb-1">
            <button type="button" onClick={onClose}
              className="h-10 px-5 rounded-xl border border-gray-200 text-sm text-gray-600 font-semibold hover:bg-gray-50 transition" disabled={submitting}>
              Cancel
            </button>
            <button type="button" onClick={handleSave} disabled={submitting}
              className="h-10 px-6 rounded-xl bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 transition flex items-center gap-2">
              {submitting ? "Saving..." : <><FaEdit className="text-xs" /> Save Changes</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────
   INSTRUCTOR COURSES PAGE
   ───────────────────────────────────────── */
const InstructorCourses = () => {
  const [courses, setCourses] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [sortBy, setSortBy] = useState("Popular");
  const [currentPage, setCurrentPage] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editCourse, setEditCourse] = useState(null);
  
  const coursesPerPage = 6;

  const fetchCourses = async () => {
    setLoading(true);
    setError("");
    try {
      const springPage = currentPage - 1;
      const res = await instructorCourseApi.getInstructorCourses(springPage, coursesPerPage);
      if (res.data && res.data.data) {
        setCourses(res.data.data.content || []);
        setTotalPages(res.data.data.totalPages || 0);
        setTotalElements(res.data.data.totalElements || 0);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch courses list from server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [currentPage]);

  const handleUpdateCourse = () => {
    fetchCourses();
  };

  const handleCreateCourse = () => {
    fetchCourses();
  };

  const handleDeleteCourse = (courseId) => {
    alert("Course deletion is disabled on the frontend. Please contact an administrator to request removal of a course.");
  };

  const sortedCourses = [...courses].sort((a, b) => {
    if (sortBy === "Popular") return (b.averageRating || 0) - (a.averageRating || 0);
    if (sortBy === "Latest") return b.id - a.id;
    if (sortBy === "Price Low") return (a.price || 0) - (b.price || 0);
    if (sortBy === "Price High") return (b.price || 0) - (a.price || 0);
    return 0;
  });

  const changePage = (page) => { 
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page); 
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f7fb] p-5">
      {showCreateModal && <CreateCourseModal onClose={() => setShowCreateModal(false)} onCreate={handleCreateCourse} />}
      {editCourse && (
        <EditCourseModal
          course={editCourse}
          onClose={() => setEditCourse(null)}
          onUpdate={handleUpdateCourse}
        />
      )}

      <div className="max-w-7xl mx-auto">
        <div className="flex items-start justify-between mb-5">
          <div>
            <p className="text-sm text-gray-400 mb-1">
              <Link to="/instructor/dashboard" className="hover:text-violet-600 transition">Dashboard</Link>
              <span className="mx-2">&gt;</span>
              <span className="text-gray-600">My Courses</span>
            </p>
            <h1 className="text-xl font-bold text-gray-900 mt-3">My Courses</h1>
            <p className="text-sm text-gray-500 mt-2">Manage and track all your created courses.</p>
          </div>
          <button type="button" onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 h-10 px-5 rounded-xl bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 transition shadow-sm mt-5">
            <FaPlus className="text-xs" /> Create New Course
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-100 mb-6 text-sm">
            {error}
          </div>
        )}

        <div className="flex items-center justify-between mb-3">
          <p className="text-sm text-gray-500">
            {loading ? "Loading..." : `Showing ${courses.length} of ${totalElements} courses`}
          </p>
          <select value={sortBy} onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
            className="h-10 px-5 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:ring-0 focus:border-gray-200">
            <option value="Popular">Sort by: Popular</option>
            <option value="Latest">Sort by: Latest</option>
            <option value="Price Low">Sort by: Price Low</option>
            <option value="Price High">Sort by: Price High</option>
          </select>
        </div>

        {loading ? (
          <div className="py-20 text-center text-gray-500">
            <div className="w-10 h-10 border-4 border-t-violet-600 border-gray-200 rounded-full animate-spin mx-auto mb-4"></div>
            <span>Fetching courses...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {sortedCourses.map((course, idx) => {
              const fallbackImage = defaultImages[idx % defaultImages.length];
              return (
                <div key={course.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300">
                  <div className="relative">
                    <img src={course.thumbnailUrl || fallbackImage} alt={course.title} className="w-full h-[180px] object-cover" />
                    <span className={`absolute top-3 right-3 text-[11px] font-bold px-3 py-1 rounded-full ${course.status === "PUBLISHED" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                      {course.status}
                    </span>
                  </div>
                  <div className="p-4">
                    <h2 className="font-bold text-gray-900 text-sm leading-5 min-h-[40px] line-clamp-2">{course.title}</h2>
                    <div className="flex items-center gap-3 mt-3 text-xs text-gray-500">
                      <span className="text-yellow-400">★</span>
                      <span>{course.averageRating || "0.0"} ({course.totalRatings || 0} reviews)</span>
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px] uppercase font-semibold">{course.level}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-3 leading-5 min-h-[40px] line-clamp-2">{course.description || "No description provided."}</p>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                      <div className="text-center">
                        <p className="text-[11px] text-gray-400">Language</p>
                        <p className="text-xs font-bold text-gray-800">{course.language || "English"}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-[11px] text-gray-400">Price</p>
                        <p className="text-sm font-bold text-gray-800">
                          {course.discountPrice ? `₹${course.discountPrice}` : `₹${course.price}`}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-[11px] text-gray-400">Discount</p>
                        <p className="text-xs font-bold text-green-600">
                          {course.discountPrice && course.price ? `${Math.round(((course.price - course.discountPrice) / course.price) * 100)}% OFF` : "None"}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Link
                        to={`/instructor/course-preview/${course.id}`}
                        className="flex-1 h-9 rounded-lg border border-violet-500 text-violet-600 text-xs font-semibold hover:bg-violet-600 hover:text-white transition flex items-center justify-center gap-1"
                      >
                        <FaEye className="text-[11px]" /> View Details
                      </Link>
                      <button type="button"
                        onClick={() => setEditCourse(course)}
                        className="flex-1 h-9 rounded-lg border border-gray-300 text-gray-600 text-xs font-semibold hover:bg-gray-100 transition flex items-center justify-center gap-1">
                        <FaEdit className="text-[11px]" /> Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteCourse(course.id)}
                        className="h-9 w-9 rounded-lg border border-red-200 text-red-400 text-xs hover:bg-red-50 hover:text-red-600 transition flex items-center justify-center animate-pulse"
                      >
                        <FaTrash className="text-[11px]" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!loading && totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-7">
            <button type="button" onClick={() => changePage(currentPage - 1)} disabled={currentPage === 1}
              className="w-9 h-9 rounded-md bg-gray-100 disabled:text-gray-300 flex items-center justify-center hover:bg-violet-50">
              <FaChevronLeft />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button type="button" key={page} onClick={() => changePage(page)}
                className={`w-9 h-9 rounded-md text-sm font-semibold ${currentPage === page ? "bg-violet-600 text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-violet-50"}`}>
                {page}
              </button>
            ))}
            <button type="button" onClick={() => changePage(currentPage + 1)} disabled={currentPage === totalPages}
              className="w-9 h-9 rounded-md bg-gray-100 disabled:text-gray-300 flex items-center justify-center hover:bg-violet-50">
              <FaChevronRight />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstructorCourses;