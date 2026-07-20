import React, { useState } from "react";
import { MdVideoLibrary } from 'react-icons/md';
import RightPanel from "./RightPanel";
import { LESSON_TYPES } from "./utils";

function AddLessonPanel({ onClose, onSave }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [lessonType, setLessonType] = useState("VIDEO");
    const [sortOrder, setSortOrder] = useState(1);
    const [previewAllowed, setPreviewAllowed] = useState(true);
    const [mandatory, setMandatory] = useState(true);

    // Thumbnail - File and URL
    const [thumbnailFile, setThumbnailFile] = useState(null);
    const [thumbnailUrl, setThumbnailUrl] = useState("");
    const [thumbnailInputType, setThumbnailInputType] = useState("FILE_UPLOAD");
    const [thumbnailPreview, setThumbnailPreview] = useState(null);

    // Video - File and URL
    const [videoFile, setVideoFile] = useState(null);
    const [videoUrl, setVideoUrl] = useState("");
    const [videoInputType, setVideoInputType] = useState("FILE_UPLOAD");
    const [videoPreview, setVideoPreview] = useState(null);

    const canSave = title.trim() && description.trim() && lessonType &&
        (thumbnailInputType === "" || (thumbnailInputType === "FILE_UPLOAD" && thumbnailFile) ||
            (thumbnailInputType === "URL" && thumbnailUrl.trim())) &&
        (videoInputType === "" || (videoInputType === "FILE_UPLOAD" && videoFile) ||
            (videoInputType === "URL" && videoUrl.trim()));

    // Handle thumbnail file selection
    const handleThumbnailFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setThumbnailFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setThumbnailPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Handle video file selection
    const handleVideoFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setVideoFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setVideoPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        if (!canSave) return;

        const formData = new FormData();

        // Required fields
        formData.append("title", title.trim());
        if (description) formData.append("description", description.trim());
        formData.append("lessonType", lessonType);
        formData.append("sortOrder", sortOrder.toString());
        formData.append("previewAllowed", previewAllowed.toString());
        formData.append("mandatory", mandatory.toString());

        // Optional fields
        formData.append("durationInMinutes", "1");

        // Thumbnail
        if (thumbnailInputType) {
            formData.append("thumbnailInputType", thumbnailInputType);
            if (thumbnailInputType === "URL" && thumbnailUrl) {
                formData.append("thumbnailUrl", thumbnailUrl);
            } else if (thumbnailInputType === "FILE_UPLOAD" && thumbnailFile) {
                formData.append("thumbnailFile", thumbnailFile);
            }
        }

        // Video
        if (lessonType === "VIDEO" || videoInputType) {
            if (videoInputType) formData.append("videoInputType", videoInputType);
            if (videoInputType === "URL" && videoUrl) {
                formData.append("videoUrl", videoUrl);
            } else if (videoInputType === "FILE_UPLOAD" && videoFile) {
                formData.append("videoFile", videoFile);
            }
        }

        onSave(formData);
    };

    return (
        <RightPanel
            title="Add Lesson"
            subtitle="Create a new lesson with content"
            onClose={onClose}
            onSave={handleSave}
            saveLabel="CREATE LESSON"
            saveDisabled={!canSave}
        >
            <div className="space-y-5">
                {/* Title */}
                <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-1.5">
                        Lesson Title <span className="text-red-500">*</span>
                    </label>
                    <input
                        value={title}
                        maxLength={100}
                        autoFocus
                        onChange={e => setTitle(e.target.value)}
                        placeholder="e.g. Introduction to Variables"
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-800 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition"
                    />
                    <p className="text-xs text-gray-400 mt-1">{title.length}/100 characters</p>
                </div>

                {/* Description */}
                <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-1.5">
                        Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                        placeholder="Enter lesson description"
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-800 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition resize-none"
                    />
                    <p className="text-xs text-gray-400 mt-1">{description.length} characters</p>
                </div>

                {/* Lesson Type */}
                <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-2">
                        Lesson Type <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                        {LESSON_TYPES.map(t => {
                            const selected = lessonType === t.id;
                            return (
                                <button
                                    key={t.id}
                                    type="button"
                                    onClick={() => {
                                        setLessonType(t.id);
                                        if (t.id === "AUDIO") {
                                            setThumbnailInputType("");
                                            setThumbnailFile(null);
                                            setThumbnailPreview(null);
                                            setThumbnailUrl("");
                                            setVideoInputType("");
                                            setVideoFile(null);
                                            setVideoPreview(null);
                                            setVideoUrl("");
                                        }
                                    }}
                                    className="flex flex-col items-center py-3 px-2 rounded-xl border-2 transition cursor-pointer"
                                    style={{
                                        borderColor: selected ? t.color : "#e5e7eb",
                                        background: selected ? t.bg : "#fff",
                                    }}
                                >
                                    <t.Icon className="text-2xl mb-1.5" style={{ color: selected ? t.color : "#9ca3af" }} />
                                    <span className="text-[10px] font-semibold leading-tight text-center" style={{ color: selected ? t.color : "#6b7280" }}>
                                        {t.label}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Sort Order */}
                <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-1.5">
                        Sort Order <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="number"
                        min={0}
                        value={sortOrder}
                        onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-800 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition"
                    />
                </div>

                {/* Settings - Preview Allowed & Mandatory */}
                <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-2">Settings</label>
                    <div className="flex items-center gap-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={previewAllowed}
                                onChange={(e) => setPreviewAllowed(e.target.checked)}
                                className="w-4 h-4 rounded border-gray-300 accent-violet-600"
                            />
                            <span className="text-sm text-gray-600">Preview Allowed</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={mandatory}
                                onChange={(e) => setMandatory(e.target.checked)}
                                className="w-4 h-4 rounded border-gray-300 accent-violet-600"
                            />
                            <span className="text-sm text-gray-600">Mandatory</span>
                        </label>
                    </div>
                </div>

                {/* Thumbnail */}
                <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-1.5">
                        Thumbnail <span className="text-red-500">*</span>
                    </label>
                    <div className="space-y-3">
                        <select
                            value={thumbnailInputType || ""}
                            onChange={(e) => {
                                setThumbnailInputType(e.target.value);
                                if (e.target.value !== "FILE_UPLOAD") {
                                    setThumbnailFile(null);
                                    setThumbnailPreview(null);
                                }
                                if (e.target.value !== "URL") {
                                    setThumbnailUrl("");
                                }
                            }}
                            className="w-full px-4 py-2 mb-2 border border-gray-200 rounded-lg text-sm text-gray-800 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition"
                        >
                            <option value="">--</option>
                            <option value="URL">URL</option>
                            <option value="FILE_UPLOAD">FILE_UPLOAD</option>
                        </select>

                        {thumbnailInputType === "FILE_UPLOAD" && (
                            <div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleThumbnailFileChange}
                                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100 transition"
                                />
                                {thumbnailPreview && (
                                    <div className="mt-2">
                                        <img
                                            src={thumbnailPreview}
                                            alt="Thumbnail preview"
                                            className="w-32 h-20 object-cover rounded-lg border border-gray-200"
                                        />
                                        <p className="text-xs text-gray-400 mt-1">{thumbnailFile?.name}</p>
                                    </div>
                                )}
                            </div>
                        )}
                        {thumbnailInputType === "URL" && (
                            <div>
                                <input
                                    type="url"
                                    value={thumbnailUrl}
                                    onChange={(e) => setThumbnailUrl(e.target.value)}
                                    placeholder="Enter thumbnail URL (e.g. https://example.com/image.jpg)"
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-800 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition"
                                />
                                {thumbnailUrl && (
                                    <div className="mt-2">
                                        <img
                                            src={thumbnailUrl}
                                            alt="Thumbnail preview"
                                            className="w-32 h-20 object-cover rounded-lg border border-gray-200"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Video */}
                <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-1.5">
                        Video <span className="text-red-500">*</span>
                    </label>
                    <div className="space-y-3">
                        <select
                            value={videoInputType || ""}
                            onChange={(e) => {
                                setVideoInputType(e.target.value);
                                if (e.target.value !== "FILE_UPLOAD") {
                                    setVideoFile(null);
                                    setVideoPreview(null);
                                }
                                if (e.target.value !== "URL") {
                                    setVideoUrl("");
                                }
                            }}
                            className="w-full px-4 py-2 mb-2 border border-gray-200 rounded-lg text-sm text-gray-800 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition"
                        >
                            <option value="">--</option>
                            <option value="URL">URL</option>
                            <option value="FILE_UPLOAD">FILE_UPLOAD</option>
                        </select>

                        {videoInputType === "FILE_UPLOAD" && (
                            <div>
                                <input
                                    type="file"
                                    accept="video/*"
                                    onChange={handleVideoFileChange}
                                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100 transition"
                                />
                                {videoFile && (
                                    <div className="mt-2">
                                        <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg border border-gray-200">
                                            <MdVideoLibrary className="text-violet-500 text-xl" />
                                            <span className="text-sm text-gray-700">{videoFile.name}</span>
                                            <span className="text-xs text-gray-400 ml-auto">
                                                {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                        {videoInputType === "URL" && (
                            <div>
                                <input
                                    type="url"
                                    value={videoUrl}
                                    onChange={(e) => setVideoUrl(e.target.value)}
                                    placeholder="Enter video URL (e.g. https://example.com/video.mp4)"
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-800 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition"
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </RightPanel>
    );
}

export default AddLessonPanel;
