import React, { useRef } from 'react';
import { FaBold, FaItalic, FaUnderline, FaStrikethrough, FaListUl, FaListOl, FaQuoteLeft, FaAlignLeft, FaAlignCenter, FaAlignRight, FaUndo, FaRedo } from "react-icons/fa";
import { MdLink, MdUpload, MdInfo, MdVideocam, MdImage } from "react-icons/md";

function RichEditor({ value, onChange, placeholder }) {
    const editorRef = useRef(null);
    const exec = (cmd, val = null) => {
        editorRef.current?.focus();
        document.execCommand(cmd, false, val);
        onChange(editorRef.current?.innerHTML || "");
    };
    const tools = [
        { icon: <FaBold />, cmd: "bold" },
        { icon: <FaItalic />, cmd: "italic" },
        { icon: <FaUnderline />, cmd: "underline" },
        { icon: <FaStrikethrough />, cmd: "strikeThrough" },
        { sep: true },
        { icon: <FaListUl />, cmd: "insertUnorderedList" },
        { icon: <FaListOl />, cmd: "insertOrderedList" },
        { icon: <FaQuoteLeft />, cmd: "formatBlock", val: "blockquote" },
        { sep: true },
        { icon: <FaAlignLeft />, cmd: "justifyLeft" },
        { icon: <FaAlignCenter />, cmd: "justifyCenter" },
        { icon: <FaAlignRight />, cmd: "justifyRight" },
        { sep: true },
        { icon: <FaUndo />, cmd: "undo" },
        { icon: <FaRedo />, cmd: "redo" },
    ];
    return (
        <div className="border border-gray-200 rounded-xl overflow-hidden focus-within:border-green-400 focus-within:ring-2 focus-within:ring-green-100 transition">
            <div className="flex items-center flex-wrap gap-0.5 px-2 py-2 border-b border-gray-100 bg-gray-50">
                {tools.map((t, i) =>
                    t.sep
                        ? <div key={i} className="w-px h-5 bg-gray-200 mx-1" />
                        : <button key={i} type="button"
                            onMouseDown={e => { e.preventDefault(); exec(t.cmd, t.val); }}
                            className="w-7 h-7 flex items-center justify-center rounded text-gray-500 hover:bg-gray-200 hover:text-gray-800 transition text-xs">
                            {t.icon}
                        </button>
                )}
            </div>
            <div
                ref={editorRef}
                contentEditable
                suppressContentEditableWarning
                data-placeholder={placeholder}
                onInput={e => onChange(e.currentTarget.innerHTML)}
                onBlur={e => onChange(e.currentTarget.innerHTML)}
                className="min-h-[180px] px-4 py-3 text-sm text-gray-800 outline-none [&:empty]:before:content-[attr(data-placeholder)] [&:empty]:before:text-gray-400"
            />
        </div>
    );
}

/* ══════════════════════════════════════════════════════════
   SELECT FIELD HELPER
══════════════════════════════════════════════════════════ */
function SelectField({ label, value, onChange, options }) {
    return (
        <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1.5">{label}</label>
            <div className="relative">
                <select
                    value={value || ""}
                    onChange={e => onChange(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 transition bg-white appearance-none pr-9">
                    {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
            </div>
        </div>
    );
}

/* ══════════════════════════════════════════════════════════
   MEDIA INPUT (URL ↔ File toggle)
══════════════════════════════════════════════════════════ */
function MediaInput({ label, hint, placeholder, previewType, accept, inputType, onChangeType, urlValue, onChangeUrl, fileValue, onChangeFile }) {
    const fileRef = useRef(null);
    const previewUrl = typeof fileValue === "string"
        ? fileValue
        : fileValue instanceof File
            ? URL.createObjectURL(fileValue)
            : null;

    return (
        <div>
            {/* Label row with URL/File toggle */}
            <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-semibold text-gray-700">{label}</label>
                <div className="flex bg-gray-100 rounded-lg p-0.5 gap-0.5">
                    {["url", "file"].map(opt => (
                        <button key={opt} type="button"
                            onClick={() => onChangeType(opt)}
                            className={`px-3 py-1 rounded-md text-xs font-semibold transition flex items-center gap-1 capitalize
                                ${inputType === opt ? "bg-white text-violet-700 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
                            {opt === "url" ? <MdLink className="text-sm" /> : <MdUpload className="text-sm" />}
                            {opt.toUpperCase()}
                        </button>
                    ))}
                </div>
            </div>

            {hint && <p className="text-xs text-gray-500 mb-3">{hint}</p>}

            {/* URL input */}
            {inputType === "url" && (
                <div className="relative">
                    <MdLink className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-base pointer-events-none" />
                    <input
                        type="url"
                        value={urlValue || ""}
                        onChange={e => onChangeUrl(e.target.value)}
                        placeholder={placeholder || "https://..."}
                        className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 transition"
                    />
                </div>
            )}

            {/* File upload */}
            {inputType === "file" && (
                <>
                    <div className="border border-gray-200 rounded-xl overflow-hidden w-64">
                        <div className="h-36 bg-gray-50 flex items-center justify-center">
                            {previewUrl
                                ? previewType === "video"
                                    ? <video src={previewUrl} className="w-full h-full object-cover" controls />
                                    : <img src={previewUrl} alt="preview" className="w-full h-full object-cover" />
                                : previewType === "video"
                                    ? <MdVideocam className="text-4xl text-gray-300" />
                                    : <MdImage className="text-4xl text-gray-300" />
                            }
                        </div>
                        <div className="flex border-t border-gray-200">
                            <button type="button" onClick={() => onChangeFile(null)}
                                className="flex-1 py-2 text-xs font-semibold text-gray-500 hover:bg-gray-50 transition border-r border-gray-200">
                                REMOVE
                            </button>
                            <button type="button" onClick={() => fileRef.current?.click()}
                                className="flex-1 py-2 text-xs font-bold text-white bg-violet-600 hover:bg-violet-700 transition">
                                UPLOAD
                            </button>
                        </div>
                    </div>
                    <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                        <MdInfo className="text-sm flex-shrink-0" />
                        {previewType === "video"
                            ? "Upload MP4 / WebM promotional video for your course."
                            : "Upload image with resolution of 1024 × 576 pixels."}
                    </p>
                    <input ref={fileRef} type="file" className="hidden" accept={accept}
                        onChange={e => { const f = e.target.files?.[0]; if (f) onChangeFile(f); }} />
                </>
            )}
        </div>
    );
}

const BrandingPage = ({ data, setData }) => {
    const set = (key, val) => setData(d => ({ ...d, [key]: val }));

    const thumbnailInputType =
        data.thumbnailInputType === "FILE_UPLOAD" ? "file" : "url";
    const promoVideoInputType = data.promoVideoInputType === "FILE_UPLOAD" ? "file" : "url";

    const LANGUAGE_OPTIONS = [
        { value: "", label: "Select Language" },
        { value: "ENGLISH", label: "English" },
        { value: "HINDI", label: "Hindi" },
        { value: "TELUGU", label: "Telugu" },
    ];

    const LEVEL_OPTIONS = [
        { value: "", label: "Select Level" },
        { value: "BEGINNER", label: "Beginner" },
        { value: "INTERMEDIATE", label: "Intermediate" },
        { value: "ADVANCED", label: "Advanced" },
    ];

    const VISIBILITY_OPTIONS = [
        { value: "", label: "Select Visibility" },
        { value: "PUBLIC", label: "Public" },
        { value: "PRIVATE", label: "Private" },
        { value: "UNLISTED", label: "Unlisted" },
    ];

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Branding</h2>
            <p className="text-sm text-gray-500 mb-8">Add details about your course and manage brand settings</p>

            <div className="space-y-6">

                {/* Course Name */}
                <div>
                    <div className="flex justify-between mb-1.5">
                        <label className="text-sm font-semibold text-gray-700">
                            Course Name <span className="text-red-400">*</span>
                        </label>
                        <span className="text-xs text-gray-400">{(data.name || "").length}/60</span>
                    </div>
                    <input
                        value={data.name || ""}
                        maxLength={60}
                        onChange={e => set("name", e.target.value)}
                        placeholder="e.g. Complete Web Development Course"
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 transition"
                    />
                </div>

                {/* Short Description */}
                <div>
                    <div className="flex justify-between mb-1.5">
                        <label className="text-sm font-semibold text-gray-700">Short Description</label>
                        <span className="text-xs text-gray-400">{(data.shortDesc || "").length}/255</span>
                    </div>
                    <textarea
                        value={data.shortDesc || ""}
                        maxLength={255}
                        onChange={e => set("shortDesc", e.target.value)}
                        placeholder="Write a short description about your course"
                        rows={3}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 transition resize-none"
                    />
                </div>

                {/* Description (Rich Text) */}
                <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-2">Description</label>
                    <RichEditor
                        value={data.description || ""}
                        onChange={v => set("description", v)}
                        placeholder="Write a detailed course description…"
                    />
                </div>

                {/* Language / Level / Visibility — 3 columns */}
                <div className="grid grid-cols-3 gap-4">
                    <SelectField
                        label="Language"
                        value={data.language}
                        onChange={v => set("language", v)}
                        options={LANGUAGE_OPTIONS}
                    />
                    <SelectField
                        label="Level"
                        value={data.level}
                        onChange={v => set("level", v)}
                        options={LEVEL_OPTIONS}
                    />
                    <SelectField
                        label="Visibility"
                        value={data.visibility}
                        onChange={v => set("visibility", v)}
                        options={VISIBILITY_OPTIONS}
                    />
                </div>

                {/* Media section header */}
                <div className="border-t border-gray-100 pt-4">
                    <p className="text-sm font-bold text-gray-700 mb-5">Media</p>
                </div>

                {/* Thumbnail */}
                <MediaInput
                    label="Course Thumbnail"
                    hint="Upload or link a course thumbnail image (recommended 1024 × 576 px)"
                    placeholder="https://example.com/thumbnail.jpg"
                    previewType="image"
                    accept="image/*"
                    inputType={thumbnailInputType}
                    onChangeType={(v) =>
                        set("thumbnailInputType", v === "file" ? "FILE_UPLOAD" : "URL")
                    }
                    urlValue={data.thumbnailUrl}
                    onChangeUrl={v => set("thumbnailUrl", v)}
                    fileValue={data.thumbnailFile || data.image}
                    onChangeFile={v => set("thumbnailFile", v)}
                />

                {/* Promo Video */}
                <MediaInput
                    label="Promotional Video"
                    hint="Upload or link a short promotional video for your course"
                    placeholder="https://youtube.com/watch?v=... or direct .mp4 URL"
                    previewType="video"
                    accept="video/*"
                    inputType={promoVideoInputType}
                    onChangeType={(v) =>
                        set("promoVideoInputType", v === "file" ? "FILE_UPLOAD" : "URL")
                    }
                    urlValue={data.promoVideoUrl}
                    onChangeUrl={v => set("promoVideoUrl", v)}
                    fileValue={data.promoVideoFile || data.video}
                    onChangeFile={v => set("promoVideoFile", v)}
                />

            </div>
        </div>
    );
}

export default BrandingPage