import React, { useState, useRef } from "react";
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
      Course Video <span className="text-red-400">*</span>
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
  language: "", level: "", status: "",
};

const CreateCourseModal = ({ onClose, onCreate }) => {
  const [form, setForm] = useState(emptyForm);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [step, setStep] = useState(1);
  const [videoTab, setVideoTab] = useState("upload");
  const [videoFile, setVideoFile] = useState(null);
  const [videoProgress, setVideoProgress] = useState(0);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState(null);
  const [videoDragging, setVideoDragging] = useState(false);
  const [videoUploading, setVideoUploading] = useState(false);
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
      setForm((prev) => ({ ...prev, thumbnailUrl: file.name }));
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

  const handleCreate = () => {
    const newCourse = {
      id: Date.now(),
      title: form.title,
      slug: form.slug,
      description: form.description,
      thumbnailUrl: form.thumbnailUrl,
      promoVideoUrl: form.promoVideoUrl,
      price: form.price ? `₹${form.price}` : "",
      oldPrice: "",
      offer: "",
      priceValue: Number(form.price) || 0,
      discountPrice: form.discountPrice,
      language: form.language,
      level: form.level,
      status: form.status,
      instructorId: 1,
      rating: "4.5",
      reviews: "0",
      lessons: "0",
      students: "0",
      earnings: "₹0",
      image: thumbnailPreview || S1,
      badge: form.status === "Published" ? "New" : "",
    };
    onCreate(newCourse);
    onClose();
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
          <button type="button" onClick={onClose} className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-red-50 hover:text-red-500 flex items-center justify-center text-gray-500 transition">
            <FaTimes className="text-xs" />
          </button>
        </div>

        <StepIndicator step={step} setStep={setStep} />

        <div className="px-6 py-4 space-y-4">
          {step === 1 && (
            <>
              <div>
                <label className={labelClass}>Course Title <span className="text-red-400">*</span></label>
                <input name="title" value={form.title} onChange={handleChange} placeholder="e.g. Digital Marketing Fundamentals" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Slug</label>
                <div className="relative">
                  <input name="slug" value={form.slug} onChange={handleChange} placeholder="auto-generated from title" className={`${inputClass} pr-16 text-violet-600`} />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded">auto</span>
                </div>
              </div>
              <div>
                <label className={labelClass}>Description <span className="text-red-400">*</span></label>
                <textarea name="description" value={form.description} onChange={handleChange} placeholder="Describe what students will learn in this course..." rows={4} className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-800 outline-none focus:border-violet-400 focus:bg-white transition placeholder:text-gray-400 resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Language <span className="text-red-400">*</span></label>
                  <select name="language" value={form.language} onChange={handleChange} className={inputClass}>
                    <option value="">Select language</option>
                    <option>English</option><option>Hindi</option><option>Telugu</option><option>Tamil</option><option>Kannada</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Level <span className="text-red-400">*</span></label>
                  <select name="level" value={form.level} onChange={handleChange} className={inputClass}>
                    <option value="">Select level</option>
                    <option>Beginner</option><option>Intermediate</option><option>Advanced</option><option>All Levels</option>
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
                    <input name="price" type="number" value={form.price} onChange={handleChange} placeholder="0.00" className={`${inputClass} pl-7`} />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Discount Price (₹)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">₹</span>
                    <input name="discountPrice" type="number" value={form.discountPrice} onChange={handleChange} placeholder="0.00" className={`${inputClass} pl-7`} />
                  </div>
                </div>
              </div>
              {form.price && form.discountPrice && Number(form.discountPrice) < Number(form.price) && (
                <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-2.5 flex items-center justify-between">
                  <span className="text-xs text-green-700 font-medium">Discount applied</span>
                  <span className="text-sm font-bold text-green-700">{Math.round(((form.price - form.discountPrice) / form.price) * 100)}% OFF</span>
                </div>
              )}
              <div>
                <label className={labelClass}>Status <span className="text-red-400">*</span></label>
                <div className="grid grid-cols-3 gap-2 mt-1">
                  {["Draft", "Published", "Archived"].map((s) => (
                    <button type="button" key={s} onClick={() => setForm((prev) => ({ ...prev, status: s }))}
                      className={`h-10 rounded-lg border text-xs font-semibold transition ${form.status === s
                          ? s === "Published" ? "bg-green-600 border-green-600 text-white"
                            : s === "Draft" ? "bg-yellow-500 border-yellow-500 text-white"
                              : "bg-gray-500 border-gray-500 text-white"
                          : "border-gray-200 text-gray-500 hover:border-violet-300"
                        }`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div className="bg-violet-50 border border-violet-100 rounded-xl p-4">
                <p className="text-xs text-violet-700 font-semibold mb-1">💡 Tip</p>
                <p className="text-xs text-violet-600 leading-5">Save as <strong>Draft</strong> while building. Switch to <strong>Published</strong> when ready for students.</p>
              </div>
            </>
          )}

          {step === 3 && (
            <>
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
                  <input type="file" accept="image/*" className="hidden" onChange={handleThumbnailChange} />
                </label>
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

              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-2">
                <p className="text-xs font-bold text-gray-700 mb-2">Course Summary</p>
                {[
                  ["Title", form.title || "—"], ["Level", form.level || "—"], ["Language", form.language || "—"],
                  ["Price", form.price ? `₹${form.price}` : "—"], ["Discount Price", form.discountPrice ? `₹${form.discountPrice}` : "—"],
                  ["Status", form.status || "—"], ["Video", videoFile ? videoFile.name : form.promoVideoUrl ? "URL linked" : "—"],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between text-xs">
                    <span className="text-gray-400">{k}</span>
                    <span className="text-gray-700 font-medium truncate max-w-[60%] text-right">{v}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          <div className="flex items-center justify-between pt-2 pb-1">
            <button type="button" onClick={handleBack}
              className="h-10 px-5 rounded-xl border border-gray-200 text-sm text-gray-600 font-semibold hover:bg-gray-50 transition">
              {step === 1 ? "Cancel" : "← Back"}
            </button>
            {step < 3 ? (
              <button type="button" onClick={handleNext}
                className="h-10 px-6 rounded-xl bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 transition">
                Next →
              </button>
            ) : (
              <button type="button" onClick={handleCreate}
                className="h-10 px-6 rounded-xl bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 transition flex items-center gap-2">
                <FaPlus className="text-xs" /> Create Course
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
    id: course.id ?? "",
    title: course.title ?? "",
    slug: course.slug ?? course.title?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") ?? "",
    description: course.description ?? "",
    thumbnailUrl: course.thumbnailUrl ?? "",
    promoVideoUrl: course.promoVideoUrl ?? "",
    price: course.priceValue ?? "",
    discountPrice: course.discountPrice ?? "",
    language: course.language ?? "",
    level: course.level ?? "",
    status: course.status ?? "",
    instructorId: course.instructorId ?? "",
    image: course.image ?? null,
    rating: course.rating ?? "",
    reviews: course.reviews ?? "",
    lessons: course.lessons ?? "",
    students: course.students ?? "",
    earnings: course.earnings ?? "",
    badge: course.badge ?? "",
    oldPrice: course.oldPrice ?? "",
    offer: course.offer ?? "",
  });

  const [thumbnailPreview, setThumbnailPreview] = useState(course.image ?? null);
  const [step, setStep] = useState(1);
  const [videoTab, setVideoTab] = useState("upload");
  const [videoFile, setVideoFile] = useState(null);
  const [videoProgress, setVideoProgress] = useState(0);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState(null);
  const [videoDragging, setVideoDragging] = useState(false);
  const [videoUploading, setVideoUploading] = useState(false);
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
      setForm((prev) => ({ ...prev, thumbnailUrl: file.name }));
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

  const handleSave = () => {
    const updatedCourse = {
      ...course,
      ...form,
      priceValue: Number(form.price) || 0,
      price: form.price ? `₹${form.price}` : course.price,
      image: thumbnailPreview || course.image,
    };
    onUpdate(updatedCourse);
    onClose();
  };

  const inputClass = "w-full h-10 px-3 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-800 outline-none focus:border-violet-400 focus:bg-white transition placeholder:text-gray-400";
  const labelClass = "block text-xs font-semibold text-gray-600 mb-1";
  const formatFileSize = (bytes) => bytes < 1024 * 1024 ? `${(bytes / 1024).toFixed(0)} KB` : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10 rounded-t-2xl">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-gray-900">Edit Course</h2>
              <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded font-semibold">ID: {form.id}</span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">Update course details and save changes</p>
          </div>
          <button type="button" onClick={onClose} className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-red-50 hover:text-red-500 flex items-center justify-center text-gray-500 transition">
            <FaTimes className="text-xs" />
          </button>
        </div>

        <StepIndicator step={step} setStep={setStep} />

        <div className="px-6 py-4 space-y-4">
          {step === 1 && (
            <>
              <div>
                <label className={labelClass}>Course ID</label>
                <input value={form.id} readOnly className={`${inputClass} bg-gray-100 text-gray-400 cursor-not-allowed`} />
              </div>
              <div>
                <label className={labelClass}>Instructor ID <span className="text-red-400">*</span></label>
                <input name="instructorId" type="number" value={form.instructorId} onChange={handleChange} placeholder="e.g. 101" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Course Title <span className="text-red-400">*</span></label>
                <input name="title" value={form.title} onChange={handleChange} placeholder="e.g. Digital Marketing Fundamentals" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Slug</label>
                <div className="relative">
                  <input name="slug" value={form.slug} onChange={handleChange} placeholder="auto-generated from title" className={`${inputClass} pr-16 text-violet-600`} />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded">auto</span>
                </div>
              </div>
              <div>
                <label className={labelClass}>Description <span className="text-red-400">*</span></label>
                <textarea name="description" value={form.description} onChange={handleChange}
                  placeholder="Describe what students will learn in this course..."
                  rows={4}
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-800 outline-none focus:border-violet-400 focus:bg-white transition placeholder:text-gray-400 resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Language <span className="text-red-400">*</span></label>
                  <select name="language" value={form.language} onChange={handleChange} className={inputClass}>
                    <option value="">Select language</option>
                    <option>English</option><option>Hindi</option><option>Telugu</option><option>Tamil</option><option>Kannada</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Level <span className="text-red-400">*</span></label>
                  <select name="level" value={form.level} onChange={handleChange} className={inputClass}>
                    <option value="">Select level</option>
                    <option>Beginner</option><option>Intermediate</option><option>Advanced</option><option>All Levels</option>
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
                    <input name="price" type="number" value={form.price} onChange={handleChange} placeholder="0.00" className={`${inputClass} pl-7`} />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Discount Price (₹)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">₹</span>
                    <input name="discountPrice" type="number" value={form.discountPrice} onChange={handleChange} placeholder="0.00" className={`${inputClass} pl-7`} />
                  </div>
                </div>
              </div>
              {form.price && form.discountPrice && Number(form.discountPrice) < Number(form.price) && (
                <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-2.5 flex items-center justify-between">
                  <span className="text-xs text-green-700 font-medium">Discount applied</span>
                  <span className="text-sm font-bold text-green-700">{Math.round(((form.price - form.discountPrice) / form.price) * 100)}% OFF</span>
                </div>
              )}
              <div>
                <label className={labelClass}>Status <span className="text-red-400">*</span></label>
                <div className="grid grid-cols-3 gap-2 mt-1">
                  {["Draft", "Published", "Archived"].map((s) => (
                    <button type="button" key={s} onClick={() => setForm((prev) => ({ ...prev, status: s }))}
                      className={`h-10 rounded-lg border text-xs font-semibold transition ${form.status === s
                          ? s === "Published" ? "bg-green-600 border-green-600 text-white"
                            : s === "Draft" ? "bg-yellow-500 border-yellow-500 text-white"
                              : "bg-gray-500 border-gray-500 text-white"
                          : "border-gray-200 text-gray-500 hover:border-violet-300"
                        }`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                <p className="text-xs text-amber-700 font-semibold mb-1">⚠️ Editing live course</p>
                <p className="text-xs text-amber-600 leading-5">Changes to a <strong>Published</strong> course are visible to enrolled students immediately after saving.</p>
              </div>
            </>
          )}

          {step === 3 && (
            <>
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
                      <span className="text-xs font-medium">Click to replace thumbnail</span>
                      <span className="text-[11px]">PNG, JPG up to 5MB</span>
                    </div>
                  )}
                  <input type="file" accept="image/*" className="hidden" onChange={handleThumbnailChange} />
                </label>
              </div>

              {form.promoVideoUrl && (
                <div className="flex items-center gap-2 bg-violet-50 border border-violet-100 rounded-lg px-3 py-2.5">
                  <FaLink className="text-violet-400 text-xs flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] text-violet-500 font-semibold mb-0.5">Current video URL</p>
                    <p className="text-xs text-violet-700 truncate">{form.promoVideoUrl}</p>
                  </div>
                  <span className="text-[10px] bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded-full whitespace-nowrap">Active</span>
                </div>
              )}

              <VideoUploadSection
                videoTab={videoTab} setVideoTab={setVideoTab}
                videoFile={videoFile} videoProgress={videoProgress} videoPreviewUrl={videoPreviewUrl}
                videoDragging={videoDragging} setVideoDragging={setVideoDragging} videoUploading={videoUploading}
                videoInputRef={videoInputRef} startVideoUpload={startVideoUpload} resetVideo={resetVideo}
                promoVideoUrl={form.promoVideoUrl}
                onPromoChange={(e) => setForm(p => ({ ...p, promoVideoUrl: e.target.value }))}
                inputClass={inputClass} labelClass={labelClass} formatFileSize={formatFileSize}
              />

              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-2">
                <p className="text-xs font-bold text-gray-700 mb-2">Edit Summary</p>
                {[
                  ["ID", form.id || "—"],
                  ["Instructor ID", form.instructorId || "—"],
                  ["Title", form.title || "—"],
                  ["Slug", form.slug || "—"],
                  ["Level", form.level || "—"],
                  ["Language", form.language || "—"],
                  ["Price", form.price ? `₹${form.price}` : "—"],
                  ["Discount Price", form.discountPrice ? `₹${form.discountPrice}` : "—"],
                  ["Status", form.status || "—"],
                  ["Video", videoFile ? videoFile.name : form.promoVideoUrl ? "URL linked" : "—"],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between text-xs">
                    <span className="text-gray-400">{k}</span>
                    <span className="text-gray-700 font-medium truncate max-w-[60%] text-right">{v}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          <div className="flex items-center justify-between pt-2 pb-1">
            <button type="button" onClick={handleBack}
              className="h-10 px-5 rounded-xl border border-gray-200 text-sm text-gray-600 font-semibold hover:bg-gray-50 transition">
              {step === 1 ? "Cancel" : "← Back"}
            </button>
            {step < 3 ? (
              <button type="button" onClick={handleNext}
                className="h-10 px-6 rounded-xl bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 transition">
                Next →
              </button>
            ) : (
              <button type="button" onClick={handleSave}
                className="h-10 px-6 rounded-xl bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 transition flex items-center gap-2">
                <FaEdit className="text-xs" /> Save Changes
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────
   INSTRUCTOR COURSES PAGE (FULLY CORRECTED)
───────────────────────────────────────── */
const InstructorCourses = () => {
  const [sortBy, setSortBy] = useState("Popular");
  const [currentPage, setCurrentPage] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editCourse, setEditCourse] = useState(null);
  const [viewDetailsCourse, setViewDetailsCourse] = useState(null); // ADDED THIS LINE
  const coursesPerPage = 6;

  const [courses, setCourses] = useState([
    {
      id: 1, title: "Digital Marketing Fundamentals", badge: "Bestseller", image: S1,
      rating: "4.7", reviews: "1,250", lessons: "28 Lessons",
      description: "Learn the basics of digital marketing and kickstart your career.",
      price: "₹999", oldPrice: "₹2,499", offer: "60% OFF", priceValue: 999,
      students: "3,420", status: "Published", earnings: "₹34,180",
      language: "English", level: "Beginner", instructorId: 101,
      thumbnailUrl: "", promoVideoUrl: "", discountPrice: "",
    },
    {
      id: 2, title: "Search Engine Optimization (SEO)", badge: "Popular", image: S2,
      rating: "4.6", reviews: "980", lessons: "26 Lessons",
      description: "Master SEO strategies to rank higher on search engines.",
      price: "₹1,199", oldPrice: "₹2,999", offer: "60% OFF", priceValue: 1199,
      students: "2,110", status: "Published", earnings: "₹25,310",
      language: "English", level: "Intermediate", instructorId: 101,
      thumbnailUrl: "", promoVideoUrl: "", discountPrice: "",
    },
    {
      id: 3, title: "Social Media Marketing Mastery", badge: "Trending", image: S3,
      rating: "4.8", reviews: "1,450", lessons: "30 Lessons",
      description: "Build brand awareness using powerful social platforms.",
      price: "₹1,299", oldPrice: "₹2,999", offer: "57% OFF", priceValue: 1299,
      students: "4,050", status: "Published", earnings: "₹52,610",
      language: "Telugu", level: "All Levels", instructorId: 102,
      thumbnailUrl: "", promoVideoUrl: "", discountPrice: "",
    },
    {
      id: 4, title: "Email Marketing Essentials", badge: "", image: S4,
      rating: "4.5", reviews: "760", lessons: "18 Lessons",
      description: "Learn email marketing strategies that drive results.",
      price: "₹899", oldPrice: "₹1,999", offer: "55% OFF", priceValue: 899,
      students: "1,340", status: "Draft", earnings: "₹12,040",
      language: "Hindi", level: "Beginner", instructorId: 101,
      thumbnailUrl: "", promoVideoUrl: "", discountPrice: "",
    },
    {
      id: 5, title: "YouTube Marketing Success", badge: "", image: S5,
      rating: "4.7", reviews: "820", lessons: "22 Lessons",
      description: "Grow your YouTube channel and brand with proven strategies.",
      price: "₹1,099", oldPrice: "₹2,699", offer: "50% OFF", priceValue: 1099,
      students: "1,890", status: "Published", earnings: "₹20,770",
      language: "English", level: "Intermediate", instructorId: 103,
      thumbnailUrl: "", promoVideoUrl: "", discountPrice: "",
    },
    {
      id: 6, title: "Google Ads Campaigns", badge: "", image: S6,
      rating: "4.6", reviews: "650", lessons: "20 Lessons",
      description: "Run profitable ad campaigns and get high ROI.",
      price: "₹1,299", oldPrice: "₹2,999", offer: "57% OFF", priceValue: 1299,
      students: "1,560", status: "Published", earnings: "₹20,260",
      language: "English", level: "Advanced", instructorId: 101,
      thumbnailUrl: "", promoVideoUrl: "", discountPrice: "",
    },
    {
      id: 7, title: "Google Analytics Mastery", badge: "", image: S7,
      rating: "4.6", reviews: "540", lessons: "16 Lessons",
      description: "Analyze data and make smart marketing decisions.",
      price: "₹899", oldPrice: "₹1,999", offer: "55% OFF", priceValue: 899,
      students: "980", status: "Draft", earnings: "₹8,810",
      language: "Tamil", level: "Intermediate", instructorId: 102,
      thumbnailUrl: "", promoVideoUrl: "", discountPrice: "",
    },
    {
      id: 8, title: "E-commerce Marketing Strategies", badge: "", image: S8,
      rating: "4.7", reviews: "610", lessons: "24 Lessons",
      description: "Boost sales and grow your online business.",
      price: "₹1,199", oldPrice: "₹2,499", offer: "52% OFF", priceValue: 1199,
      students: "1,230", status: "Published", earnings: "₹14,750",
      language: "English", level: "All Levels", instructorId: 101,
      thumbnailUrl: "", promoVideoUrl: "", discountPrice: "",
    },
  ]);

  const handleUpdateCourse = (updatedCourse) => {
    setCourses(prevCourses =>
      prevCourses.map(course =>
        course.id === updatedCourse.id ? updatedCourse : course
      )
    );
  };

  const handleCreateCourse = (newCourse) => {
    const newId = Math.max(...courses.map(c => c.id), 0) + 1;
    setCourses(prev => [{ ...newCourse, id: newId }, ...prev]);
  };

  const handleDeleteCourse = (courseId) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      setCourses(prev => prev.filter(course => course.id !== courseId));
    }
  };

  const sortedCourses = [...courses].sort((a, b) => {
    if (sortBy === "Popular") return Number(b.rating) - Number(a.rating);
    if (sortBy === "Latest") return b.id - a.id;
    if (sortBy === "Price Low") return a.priceValue - b.priceValue;
    if (sortBy === "Price High") return b.priceValue - a.priceValue;
    return 0;
  });

  const totalPages = Math.ceil(sortedCourses.length / coursesPerPage);
  const paginatedCourses = sortedCourses.slice((currentPage - 1) * coursesPerPage, currentPage * coursesPerPage);
  const changePage = (page) => { if (page >= 1 && page <= totalPages) setCurrentPage(page); };

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
      {/* MODAL RENDERED HERE - OUTSIDE THE MAP LOOP */}
      {viewDetailsCourse && (
        <CourseViewDetails 
          course={viewDetailsCourse} 
          onClose={() => setViewDetailsCourse(null)} 
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

        <div className="flex items-center justify-between mb-3">
          <p className="text-sm text-gray-500">Showing {paginatedCourses.length} of {courses.length} courses</p>
          <select value={sortBy} onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
            className="h-10 px-5 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:ring-0 focus:border-gray-200">
            <option value="Popular">Sort by: Popular</option>
            <option value="Latest">Sort by: Latest</option>
            <option value="Price Low">Sort by: Price Low</option>
            <option value="Price High">Sort by: Price High</option>
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
          {paginatedCourses.map((course) => (
            <div key={course.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300">
              <div className="relative">
                <img src={course.image} alt={course.title} className="w-full h-[130px] object-cover" />
                {course.badge && (
                  <span className="absolute top-3 left-3 bg-violet-600 text-white text-[11px] font-bold px-3 py-1 rounded-full">{course.badge}</span>
                )}
                <span className={`absolute top-3 right-3 text-[11px] font-bold px-3 py-1 rounded-full ${course.status === "Published" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                  {course.status}
                </span>
              </div>
              <div className="p-4">
                <h2 className="font-bold text-gray-900 text-sm leading-5 min-h-[40px]">{course.title}</h2>
                <div className="flex items-center gap-3 mt-3 text-xs text-gray-500">
                  <span className="text-yellow-400">★</span>
                  <span>{course.rating} ({course.reviews})</span>
                  <span>{course.lessons}</span>
                </div>
                <p className="text-xs text-gray-500 mt-3 leading-5 min-h-[40px]">{course.description}</p>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                  <div className="text-center">
                    <p className="text-[11px] text-gray-400">Students</p>
                    <p className="text-sm font-bold text-gray-800">{course.students}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[11px] text-gray-400">Price</p>
                    <p className="text-sm font-bold text-gray-800">{course.price}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[11px] text-gray-400">Earnings</p>
                    <p className="text-sm font-bold text-green-600">{course.earnings}</p>
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
                    className="h-9 w-9 rounded-lg border border-red-200 text-red-400 text-xs hover:bg-red-50 hover:text-red-600 transition flex items-center justify-center"
                  >
                    <FaTrash className="text-[11px]" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {totalPages > 1 && (
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