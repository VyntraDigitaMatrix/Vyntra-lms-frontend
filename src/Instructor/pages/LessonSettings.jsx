// LessonSettings.jsx
import React, { useState, useRef } from 'react';
import {
    FaArrowLeft,
    FaSave,
    FaTimes,
    FaImage,
    FaTag,
    FaCog,
    FaTrashAlt,
    FaUpload,
    FaPlus,
    FaMinus,
    FaBold,
    FaItalic,
    FaUnderline,
    FaStrikethrough,
    FaListUl,
    FaListOl,
    FaAlignLeft,
    FaAlignCenter,
    FaAlignRight,
    FaLink,
    FaCode,
    FaQuoteRight,
    FaCheck,
    FaClock,
    FaVideo,
    FaFileAlt,
    FaStar,
    FaLock,
    FaUnlock,
    FaUsers,
    FaChartLine,
    FaDownload,
    FaPrint,
    FaShare,
    FaComments,
    FaQuestionCircle,
    FaClipboardList,
    FaBookOpen
} from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import { instructorLessonApi } from '../auth/api';

const LessonSettings = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state || {};
    const { lesson, section, course } = state;

    const [activeTab, setActiveTab] = useState('branding');
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        title: lesson?.title || '',
        description: lesson?.description || '',
        longDescription: lesson?.longDescription || '',
        content: lesson?.content || '',
        lessonType: lesson?.lessonType || 'VIDEO',
        thumbnailInputType: lesson?.thumbnailInputType || 'URL',
        thumbnailUrl: lesson?.thumbnailUrl || '',
        thumbnailFile: null,
        videoInputType: lesson?.videoInputType || 'URL',
        videoUrl: lesson?.videoUrl || '',
        videoFile: null,
        resourceInputType: lesson?.resourceInputType || 'URL',
        resourceUrl: lesson?.resourceUrl || '',
        resourceFile: null,
        durationInMinutes: lesson?.durationInMinutes || 1,
        sortOrder: lesson?.sortOrder || 1,
        previewAllowed: lesson?.previewAllowed ?? true,
        mandatory: lesson?.mandatory ?? true,
    });

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        const targetSlug = lesson?.slug || lesson?.lessonSlug;
        if (!targetSlug) {
            alert("No lesson slug found.");
            return;
        }
        setSaving(true);
        try {
            const fd = new FormData();
            fd.append("title", formData.title || "");
            fd.append("lessonTitle", formData.title || ""); // Fallback for backend
            fd.append("name", formData.title || ""); // Additional fallback

            if (formData.description) fd.append("description", formData.description);
            if (formData.longDescription) fd.append("longDescription", formData.longDescription);
            if (formData.content) fd.append("content", formData.content);

            fd.append("lessonType", formData.lessonType || "VIDEO");
            fd.append("content", formData.content || "");
            if (formData.thumbnailInputType) {
                fd.append("thumbnailInputType", formData.thumbnailInputType);
                if (formData.thumbnailInputType === "URL") {
                    fd.append("thumbnailUrl", formData.thumbnailUrl || "");
                } else if (formData.thumbnailInputType === "FILE_UPLOAD") {
                    if (formData.thumbnailFile) fd.append("thumbnailFile", formData.thumbnailFile);
                }
            }

            if (formData.videoInputType) {
                fd.append("videoInputType", formData.videoInputType);
                if (formData.videoInputType === "URL") {
                    fd.append("videoUrl", formData.videoUrl || "");
                } else if (formData.videoInputType === "FILE_UPLOAD") {
                    if (formData.videoFile) fd.append("videoFile", formData.videoFile);
                }
            }

            if (formData.resourceInputType) {
                fd.append("resourceInputType", formData.resourceInputType);
                if (formData.resourceInputType === "URL") {
                    fd.append("resourceUrl", formData.resourceUrl || "");
                } else if (formData.resourceInputType === "FILE_UPLOAD") {
                    if (formData.resourceFile) fd.append("resourceFile", formData.resourceFile);
                }
            }
            fd.append("durationInMinutes", formData.durationInMinutes || 1);
            fd.append("sortOrder", formData.sortOrder || 1);
            fd.append("previewAllowed", formData.previewAllowed);
            fd.append("mandatory", formData.mandatory);

            await instructorLessonApi.updateLesson(targetSlug, fd);
            alert("Lesson saved successfully!");
            const cSlug = course?.slug || course?.courseSlug;
            navigate(`/instructor/lesson-builder/${cSlug}/${targetSlug}`, {
                state: { lesson: { ...lesson, ...formData }, section, course }
            });
        } catch (error) {
            console.error(error);
            alert(error?.response?.data?.message || "Failed to save lesson");
        } finally {
            setSaving(false);
        }
    };

    const handleBack = () => {
        const targetSlug = lesson?.slug || lesson?.lessonSlug;
        const cSlug = course?.slug || course?.courseSlug;
        navigate(`/instructor/lesson-builder/${cSlug}/${targetSlug}`, {
            state: { lesson: { ...lesson, ...formData }, section, course }
        });
    };

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this lesson?')) {
            console.log('Deleting lesson');
            navigate('/instructor/course-builder');
        }
    };



    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={handleBack}
                                className="flex items-center gap-2 text-gray-600 hover:text-violet-600 transition-colors duration-200 group"
                            >
                                <FaArrowLeft className="group-hover:-translate-x-1 transition-transform text-sm" />
                                <span className="text-sm font-medium">Back to Lesson</span>
                            </button>

                            <div className="h-6 w-px bg-gray-300"></div>

                            <div>
                                <h1 className="text-lg font-bold text-gray-900">Lesson Settings</h1>
                                <p className="text-xs text-gray-500">{course?.title || 'Course'} / {section?.title || 'Section'}</p>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors duration-200 flex items-center gap-2 text-sm font-medium"
                            >
                                <FaSave />
                                {saving ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex gap-8">
                        <button
                            onClick={() => setActiveTab('branding')}
                            className={`py-4 px-2 text-sm font-semibold transition-colors relative ${activeTab === 'branding'
                                ? 'text-violet-600'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Branding
                            {activeTab === 'branding' && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-600"></div>
                            )}
                        </button>


                        <button
                            onClick={() => setActiveTab('delete')}
                            className={`py-4 px-2 text-sm font-semibold transition-colors relative ml-auto ${activeTab === 'delete'
                                ? 'text-red-600'
                                : 'text-gray-500 hover:text-red-600'
                                }`}
                        >
                            Delete
                            {activeTab === 'delete' && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600"></div>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-6 py-8">
                {activeTab === 'branding' && (
                    <BrandingTab
                        formData={formData}
                        onInputChange={handleInputChange}
                    />
                )}
                {activeTab === 'lesson-tag' && (
                    <LessonTagTab
                        formData={formData}
                        onInputChange={handleInputChange}
                        newTag={newTag}
                        setNewTag={setNewTag}
                        addTag={addTag}
                        removeTag={removeTag}
                    />
                )}
                {activeTab === 'features' && (
                    <FeaturesTab
                        formData={formData}
                        onInputChange={handleInputChange}
                        toggleFeature={toggleFeature}
                    />
                )}
                {activeTab === 'delete' && (
                    <DeleteTab
                        onDelete={handleDelete}
                    />
                )}
            </div>
        </div>
    );
};

const MediaInput = ({ label, hint, inputType, onChangeType, urlValue, onChangeUrl, fileValue, onChangeFile, accept }) => {
    const fileRef = useRef(null);
    return (
        <div className="mb-6">
            <label className="text-sm font-semibold text-gray-700 block mb-1">{label}</label>
            {hint && <p className="text-xs text-gray-500 mb-3">{hint}</p>}
            
            <select value={inputType || ""} onChange={e => onChangeType(e.target.value)} className="w-full mb-3 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none text-sm">
                <option value="">--</option>
                <option value="URL">URL</option>
                <option value="FILE_UPLOAD">FILE_UPLOAD</option>
            </select>

            {inputType === "URL" && (
                <input type="text" value={urlValue || ""} onChange={e => onChangeUrl(e.target.value)} placeholder="Enter URL" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none text-sm" />
            )}
            
            {inputType === "FILE_UPLOAD" && (
                <div className="flex gap-2 items-center">
                    <input type="file" ref={fileRef} onChange={e => onChangeFile(e.target.files?.[0])} accept={accept} className="hidden" />
                    <button type="button" onClick={() => fileRef.current?.click()} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors">Choose File</button>
                    <span className="text-sm text-gray-500 truncate max-w-[200px]">{fileValue ? fileValue.name : "No file chosen"}</span>
                </div>
            )}
        </div>
    );
};

// Branding Tab Component
const BrandingTab = ({ formData, onInputChange }) => {
    const editorRef = useRef(null);
    const execCommand = (command, value = null) => {
        editorRef.current?.focus();
        document.execCommand(command, false, value);
    };

    const handleContentBlur = () => {
        if (editorRef.current) {
            onInputChange('content', editorRef.current.innerHTML);
        }
    };

    return (
        <div className="max-w-3xl">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Lesson Details</h3>
            <p className="text-sm text-gray-500 mb-6">
                Add information and media for this lesson.
            </p>

            <div className="mb-6">
                <label className="text-sm font-semibold text-gray-700">Title</label>
                <input type="text" value={formData.title} onChange={e => onInputChange('title', e.target.value)} maxLength={60} className="w-full mt-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none text-sm" placeholder="Lesson title" />
            </div>

            <div className="mb-6">
                <label className="text-sm font-semibold text-gray-700 block mb-2">Lesson Type</label>
                <select value={formData.lessonType} onChange={e => onInputChange('lessonType', e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none text-sm">
                    <option value="">--</option>
                    <option value="VIDEO">VIDEO</option>
                    <option value="TEXT">TEXT</option>
                    <option value="PDF">PDF</option>
                    <option value="QUIZ">QUIZ</option>
                    <option value="ARTICLE">ARTICLE</option>
                    <option value="ASSIGNMENT">ASSIGNMENT</option>
                    <option value="LIVE_CLASS">LIVE_CLASS</option>
                </select>
            </div>

            <div className="mb-6">
                <label className="text-sm font-semibold text-gray-700">Description</label>
                <textarea value={formData.description} onChange={e => onInputChange('description', e.target.value)} rows={3} className="w-full mt-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none text-sm" placeholder="Brief description" />
            </div>

            <div className="mb-6">
                <label className="text-sm font-semibold text-gray-700">Long Description</label>
                <textarea value={formData.longDescription} onChange={e => onInputChange('longDescription', e.target.value)} rows={5} className="w-full mt-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none text-sm" placeholder="Detailed description" />
            </div>

            {/* Media Inputs */}
            <MediaInput label="Thumbnail" inputType={formData.thumbnailInputType} onChangeType={v => onInputChange('thumbnailInputType', v)} urlValue={formData.thumbnailUrl} onChangeUrl={v => onInputChange('thumbnailUrl', v)} fileValue={formData.thumbnailFile} onChangeFile={v => onInputChange('thumbnailFile', v)} accept="image/*" />
            <MediaInput label="Video" inputType={formData.videoInputType} onChangeType={v => onInputChange('videoInputType', v)} urlValue={formData.videoUrl} onChangeUrl={v => onInputChange('videoUrl', v)} fileValue={formData.videoFile} onChangeFile={v => onInputChange('videoFile', v)} accept="video/*" />
            <MediaInput label="Resource" inputType={formData.resourceInputType} onChangeType={v => onInputChange('resourceInputType', v)} urlValue={formData.resourceUrl} onChangeUrl={v => onInputChange('resourceUrl', v)} fileValue={formData.resourceFile} onChangeFile={v => onInputChange('resourceFile', v)} accept="*/*" />

            <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                    <label className="text-sm font-semibold text-gray-700">Duration (Minutes)</label>
                    <input type="number" min="1" value={formData.durationInMinutes} onChange={e => onInputChange('durationInMinutes', parseInt(e.target.value) || 1)} className="w-full mt-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none text-sm" />
                </div>
                <div>
                    <label className="text-sm font-semibold text-gray-700">Sort Order</label>
                    <input type="number" min="1" value={formData.sortOrder} onChange={e => onInputChange('sortOrder', parseInt(e.target.value) || 1)} className="w-full mt-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none text-sm" />
                </div>
            </div>

            <div className="flex gap-8 mb-6">
                <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={formData.previewAllowed} onChange={e => onInputChange('previewAllowed', e.target.checked)} className="w-4 h-4 text-violet-600 focus:ring-violet-500 rounded border-gray-300" />
                    <span className="text-sm font-medium text-gray-700">Preview Allowed</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={formData.mandatory} onChange={e => onInputChange('mandatory', e.target.checked)} className="w-4 h-4 text-violet-600 focus:ring-violet-500 rounded border-gray-300" />
                    <span className="text-sm font-medium text-gray-700">Mandatory</span>
                </label>
            </div>

            <div className="mb-6">
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Content</label>
                <div className="border border-gray-300 rounded-lg overflow-hidden">
                    <div className="flex items-center gap-1 p-2 border-b border-gray-200 bg-gray-50 flex-wrap">
                        <button type="button" onClick={() => execCommand("bold")} className="p-1.5 hover:bg-gray-200 rounded transition-colors"><FaBold className="text-gray-600 text-sm" /></button>
                        <button type="button" onClick={() => execCommand("italic")} className="p-1.5 hover:bg-gray-200 rounded transition-colors"><FaItalic className="text-gray-600 text-sm" /></button>
                        <button type="button" onClick={() => execCommand("underline")} className="p-1.5 hover:bg-gray-200 rounded transition-colors"><FaUnderline className="text-gray-600 text-sm" /></button>
                        <div className="w-px h-6 bg-gray-300 mx-1"></div>
                        <button type="button" onClick={() => execCommand("insertUnorderedList")} className="p-1.5 hover:bg-gray-200 rounded transition-colors"><FaListUl className="text-gray-600 text-sm" /></button>
                        <button type="button" onClick={() => execCommand("insertOrderedList")} className="p-1.5 hover:bg-gray-200 rounded transition-colors"><FaListOl className="text-gray-600 text-sm" /></button>
                    </div>
                    <div
                        ref={editorRef}
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={handleContentBlur}
                        className="w-full min-h-[250px] px-4 py-3 outline-none text-sm"
                        dangerouslySetInnerHTML={{ __html: formData.content }}
                    />
                </div>
            </div>
        </div>
    );
};

// Delete Tab Component
const DeleteTab = ({ onDelete }) => {
    const [confirmText, setConfirmText] = useState('');

    return (
        <div className="max-w-3xl">
            <h3 className="text-xl font-bold text-red-600 mb-6">Delete Lesson</h3>
            <div className="bg-red-50 border border-red-200 rounded-xl p-8">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <FaTrashAlt className="text-2xl text-red-600" />
                    </div>
                    <div>
                        <h4 className="text-lg font-bold text-red-700">Permanently Delete Lesson</h4>
                        <p className="text-sm text-red-600">
                            This action cannot be undone. All content and student progress will be lost.
                        </p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-semibold text-gray-700 block mb-2">
                            Type "DELETE" to confirm
                        </label>
                        <input
                            type="text"
                            value={confirmText}
                            onChange={(e) => setConfirmText(e.target.value)}
                            placeholder="Type DELETE to confirm"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none text-sm"
                        />
                    </div>

                    <button
                        onClick={onDelete}
                        disabled={confirmText !== 'DELETE'}
                        className="w-full px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold flex items-center justify-center gap-2"
                    >
                        <FaTrashAlt />
                        Permanently Delete Lesson
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LessonSettings;