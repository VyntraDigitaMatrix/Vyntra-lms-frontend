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

const LessonSettings = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state || {};
    const { lesson, section, course } = state;

    const [activeTab, setActiveTab] = useState('branding');
    const [formData, setFormData] = useState({
        title: lesson?.title || 'Music Lesson 1',
        lessonType: lesson?.lessonType || 'paid',
        shortDescription: lesson?.shortDescription || '',
        description: lesson?.description || '',
        thumbnail: lesson?.thumbnail || null,
        displayInSyllabus: lesson?.displayInSyllabus || 'show',
        tags: lesson?.tags || ['Beginner', 'Music Theory'],
        features: lesson?.features || [
            { id: 1, name: 'Video Content', enabled: true, icon: 'video' },
            { id: 2, name: 'Downloadable Materials', enabled: true, icon: 'download' },
            { id: 3, name: 'Interactive Quiz', enabled: false, icon: 'quiz' },
            { id: 4, name: 'Discussion Forum', enabled: true, icon: 'comments' },
            { id: 5, name: 'Certificate of Completion', enabled: false, icon: 'certificate' },
            { id: 6, name: 'Peer Review', enabled: false, icon: 'users' },
        ],
        visibility: lesson?.visibility || 'public',
        duration: lesson?.duration || 15,
        prerequisites: lesson?.prerequisites || 'Basic understanding of music',
        difficulty: lesson?.difficulty || 'intermediate'
    });

    const [newTag, setNewTag] = useState('');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        console.log('Saving lesson settings:', formData);
        navigate('/instructor/lesson-builder', {
            state: {
                lesson: { ...lesson, ...formData },
                section,
                course
            }
        });
    };

    const handleBack = () => {
        navigate('/instructor/lesson-builder', {
            state: { lesson, section, course }
        });
    };

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this lesson?')) {
            console.log('Deleting lesson');
            navigate('/instructor/course-builder');
        }
    };

    const addTag = () => {
        if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
            setFormData(prev => ({
                ...prev,
                tags: [...prev.tags, newTag.trim()]
            }));
            setNewTag('');
        }
    };

    const removeTag = (tagToRemove) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove)
        }));
    };

    const toggleFeature = (featureId) => {
        setFormData(prev => ({
            ...prev,
            features: prev.features.map(feature =>
                feature.id === featureId
                    ? { ...feature, enabled: !feature.enabled }
                    : feature
            )
        }));
    };

    const getFeatureIcon = (iconName) => {
        const icons = {
            video: FaVideo,
            download: FaDownload,
            quiz: FaQuestionCircle,
            comments: FaComments,
            certificate: FaStar,
            users: FaUsers
        };
        const Icon = icons[iconName] || FaFileAlt;
        return <Icon className="text-xl" />;
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
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center gap-2 text-sm font-medium"
                            >
                                <FaSave />
                                Save Changes
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
                            onClick={() => setActiveTab('lesson-tag')}
                            className={`py-4 px-2 text-sm font-semibold transition-colors relative ${activeTab === 'lesson-tag'
                                ? 'text-violet-600'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Lesson Tag
                            {activeTab === 'lesson-tag' && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-600"></div>
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab('features')}
                            className={`py-4 px-2 text-sm font-semibold transition-colors relative ${activeTab === 'features'
                                ? 'text-violet-600'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Features
                            {activeTab === 'features' && (
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

// Branding Tab Component
const BrandingTab = ({ formData, onInputChange }) => {
    const editorRef = useRef(null);
    const execCommand = (command, value = null) => {
        editorRef.current?.focus();
        document.execCommand(command, false, value);
    };
    return (
        <div className="max-w-3xl">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Branding</h3>
            <p className="text-sm text-gray-500 mb-6">
                Add details about your lesson and manage brand settings
            </p>

            {/* Title */}
            <div className="mb-6">
                <div className="flex justify-between mb-2">
                    <label className="text-sm font-semibold text-gray-700">Title</label>
                    <span className="text-xs text-gray-400">{formData.title.length}/60</span>
                </div>
                <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => onInputChange('title', e.target.value)}
                    maxLength={60}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none text-sm"
                    placeholder="Enter lesson title"
                />
            </div>

            {/* Lesson Type */}
            <div className="mb-6">
                <label className="text-sm font-semibold text-gray-700 block mb-2">
                    Lesson Type
                </label>
                <p className="text-xs text-gray-500 mb-3">
                    Select paid or trial lesson type. Trial lessons are free to enroll
                </p>
                <div className="flex gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            name="lessonType"
                            value="paid"
                            checked={formData.lessonType === 'paid'}
                            onChange={(e) => onInputChange('lessonType', e.target.value)}
                            className="w-4 h-4 text-violet-600 focus:ring-violet-500"
                        />
                        <span className="text-sm font-medium text-gray-700">Paid Lesson</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            name="lessonType"
                            value="trial"
                            checked={formData.lessonType === 'trial'}
                            onChange={(e) => onInputChange('lessonType', e.target.value)}
                            className="w-4 h-4 text-violet-600 focus:ring-violet-500"
                        />
                        <span className="text-sm font-medium text-gray-700">Trial Lesson</span>
                    </label>
                </div>
            </div>

            {/* Short Description */}
            <div className="mb-6">
                <div className="flex justify-between mb-2">
                    <label className="text-sm font-semibold text-gray-700">
                        Short Description
                    </label>
                    <span className="text-xs text-gray-400">{formData.shortDescription.length}/255</span>
                </div>
                <input
                    type="text"
                    value={formData.shortDescription}
                    onChange={(e) => onInputChange('shortDescription', e.target.value)}
                    maxLength={255}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none text-sm"
                    placeholder="Brief description of the lesson"
                />
            </div>

            {/* Description with Rich Text Editor */}
            <div className="mb-6">
                <div className="flex justify-between mb-2">
                    <label className="text-sm font-semibold text-gray-700">Description</label>
                </div>
                <div className="border border-gray-300 rounded-lg overflow-hidden">
                    {/* Toolbar */}
                    <div className="flex items-center gap-1 p-2 border-b border-gray-200 bg-gray-50 flex-wrap">
                        <button
                            type="button"
                            onClick={() => execCommand("increaseFontSize")}
                            className="p-1.5 hover:bg-gray-200 rounded transition-colors"
                        >
                            <FaPlus className="text-gray-600 text-sm" />
                        </button>

                        <button
                            type="button"
                            onClick={() => execCommand("decreaseFontSize")}
                            className="p-1.5 hover:bg-gray-200 rounded transition-colors"
                        >
                            <FaMinus className="text-gray-600 text-sm" />
                        </button>
                        <div className="w-px h-6 bg-gray-300 mx-1"></div>
                        <button
                            type="button"
                            onClick={() => execCommand("bold")}
                            className="p-1.5 hover:bg-gray-200 rounded transition-colors">
                            <FaBold className="text-gray-600 text-sm" />
                        </button>
                        <button
                            type="button"
                            onClick={() => execCommand("italic")}
                            className="p-1.5 hover:bg-gray-200 rounded transition-colors">
                            <FaItalic className="text-gray-600 text-sm" />
                        </button>
                        <button
                            type="button"
                            onClick={() => execCommand("underline")}
                            className="p-1.5 hover:bg-gray-200 rounded transition-colors">
                            <FaUnderline className="text-gray-600 text-sm" />
                        </button>
                        <button
                            type="button"
                            onClick={() => execCommand("strikethrough")}
                            className="p-1.5 hover:bg-gray-200 rounded transition-colors">
                            <FaStrikethrough className="text-gray-600 text-sm" />
                        </button>
                        <div className="w-px h-6 bg-gray-300 mx-1"></div>
                        <button
                            type="button"
                            onClick={() => execCommand("insertUnorderedList")}
                            className="p-1.5 hover:bg-gray-200 rounded transition-colors"
                        >
                            <FaListUl className="text-gray-600 text-sm" />
                        </button>

                        <button
                            type="button"
                            onClick={() => execCommand("insertOrderedList")}
                            className="p-1.5 hover:bg-gray-200 rounded transition-colors"
                        >
                            <FaListOl className="text-gray-600 text-sm" />
                        </button>

                        <div className="w-px h-6 bg-gray-300 mx-1"></div>

                        <button
                            type="button"
                            onClick={() => execCommand("justifyLeft")}
                            className="p-1.5 hover:bg-gray-200 rounded transition-colors"
                        >
                            <FaAlignLeft className="text-gray-600 text-sm" />
                        </button>

                        <button
                            type="button"
                            onClick={() => execCommand("justifyCenter")}
                            className="p-1.5 hover:bg-gray-200 rounded transition-colors"
                        >
                            <FaAlignCenter className="text-gray-600 text-sm" />
                        </button>

                        <button
                            type="button"
                            onClick={() => execCommand("justifyRight")}
                            className="p-1.5 hover:bg-gray-200 rounded transition-colors"
                        >
                            <FaAlignRight className="text-gray-600 text-sm" />
                        </button>

                        <div className="w-px h-6 bg-gray-300 mx-1"></div>

                        <button
                            type="button"
                            onClick={() => {
                                const url = prompt("Enter URL:");
                                if (url) document.execCommand("createLink", false, url);
                            }}
                            className="p-1.5 hover:bg-gray-200 rounded transition-colors"
                        >
                            <FaLink className="text-gray-600 text-sm" />
                        </button>

                        <button
                            type="button"
                            onClick={() => execCommand("formatBlock", "<pre>")}
                            className="p-1.5 hover:bg-gray-200 rounded transition-colors"
                        >
                            <FaCode className="text-gray-600 text-sm" />
                        </button>

                        <button
                            type="button"
                            onClick={() => execCommand("formatBlock", "<blockquote>")}
                            className="p-1.5 hover:bg-gray-200 rounded transition-colors"
                        >
                            <FaQuoteRight className="text-gray-600 text-sm" />
                        </button>
                    </div>
                    {/* Text Area */}
                    <div
                        ref={editorRef}
                        id="editor"
                        contentEditable
                        suppressContentEditableWarning
                        className="w-full min-h-[250px] px-4 py-3 outline-none text-sm"
                    >
                        {formData.description}
                    </div>
                </div>
            </div>

            {/* Thumbnail */}
            <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-4">Lesson Thumbnail</h4>
                <p className="text-sm text-gray-500 mb-4">
                    Upload a relatable lesson image for visual presentation
                </p>

                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-violet-400 hover:bg-gray-50 transition-all duration-200">
                    {formData.thumbnail ? (
                        <div className="relative inline-block">
                            <img
                                src={formData.thumbnail}
                                alt="Lesson thumbnail"
                                className="max-h-48 rounded-lg"
                            />
                            <button
                                onClick={() => onInputChange('thumbnail', null)}
                                className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                            >
                                <FaTimes className="text-sm" />
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="w-20 h-20 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FaImage className="text-3xl text-violet-600" />
                            </div>
                            <p className="text-gray-600 text-sm font-medium">
                                Drop your image here or
                                <span className="text-violet-600 ml-1 cursor-pointer hover:underline">
                                    browse files
                                </span>
                            </p>
                            <div className="mt-2 flex gap-4 justify-center text-xs text-gray-400">
                                <span>Upload image with resolution of</span>
                                <span className="font-semibold text-gray-600">1024 x 576 pixels</span>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

// Lesson Tag Tab Component
const LessonTagTab = ({ formData, onInputChange, newTag, setNewTag, addTag, removeTag }) => {
    const predefinedTags = [
        'Beginner', 'Intermediate', 'Advanced', 'Expert',
        'Music Theory', 'Practical', 'Exercises', 'Technique',
        'Popular', 'Classical', 'Jazz', 'Blues',
        'Rock', 'Pop', 'Folk', 'Electronic',
        'Live Performance', 'Studio Recording', 'Production'
    ];

    return (
        <div className="max-w-3xl">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Lesson Tags</h3>
            <p className="text-sm text-gray-500 mb-6">
                Add tags to help students find your lesson and improve discoverability
            </p>

            {/* Add New Tag */}
            <div className="mb-8">
                <label className="text-sm font-semibold text-gray-700 block mb-2">
                    Add New Tag
                </label>
                <div className="flex gap-3">
                    <input
                        type="text"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addTag()}
                        placeholder="Type a tag and press Enter"
                        className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none text-sm"
                    />
                    <button
                        onClick={addTag}
                        className="px-6 py-2.5 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors flex items-center gap-2 text-sm font-semibold"
                    >
                        <FaPlus />
                        Add Tag
                    </button>
                </div>
            </div>

            {/* Current Tags */}
            <div className="mb-8">
                <label className="text-sm font-semibold text-gray-700 block mb-3">
                    Current Tags ({formData.tags.length})
                </label>
                <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                        <span
                            key={index}
                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-violet-100 text-violet-700 rounded-full text-sm font-medium"
                        >
                            <FaTag className="text-xs" />
                            {tag}
                            <button
                                onClick={() => removeTag(tag)}
                                className="hover:text-red-500 transition-colors"
                            >
                                <FaTimes className="text-xs" />
                            </button>
                        </span>
                    ))}
                    {formData.tags.length === 0 && (
                        <p className="text-sm text-gray-400">No tags added yet</p>
                    )}
                </div>
            </div>

            {/* Popular Tags */}
            <div>
                <label className="text-sm font-semibold text-gray-700 block mb-3">
                    Popular Tags
                </label>
                <div className="flex flex-wrap gap-2">
                    {predefinedTags.map((tag, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                if (!formData.tags.includes(tag)) {
                                    onInputChange('tags', [...formData.tags, tag]);
                                }
                            }}
                            className={`px-3 py-1.5 rounded-full text-sm transition-colors ${formData.tags.includes(tag)
                                ? 'bg-violet-600 text-white cursor-default'
                                : 'bg-gray-100 text-gray-700 hover:bg-violet-100 hover:text-violet-700'
                                }`}
                            disabled={formData.tags.includes(tag)}
                        >
                            {formData.tags.includes(tag) ? (
                                <span className="flex items-center gap-1">
                                    <FaCheck className="text-xs" />
                                    {tag}
                                </span>
                            ) : (
                                tag
                            )}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

// Features Tab Component
// Features Tab Component - Fixed Version
const FeaturesTab = ({ formData, onInputChange, toggleFeature }) => {
    // Helper function to get the correct icon component
    const getFeatureIcon = (iconName) => {
        const iconMap = {
            video: FaVideo,
            download: FaDownload,
            quiz: FaQuestionCircle,
            comments: FaComments,
            certificate: FaStar,
            users: FaUsers
        };

        const IconComponent = iconMap[iconName] || FaFileAlt;
        return IconComponent;
    };

    return (
        <div className="max-w-3xl">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Features</h3>
            <p className="text-sm text-gray-500">
                Enable or disable features for this lesson to enhance the learning experience
            </p>

            {/* Lesson Visibility */}
            <div className="mb-3 p-6 bg-gray-50 rounded-xl">
                <h4 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                    <FaCog className="text-violet-600" />
                    Lesson Visibility
                </h4>
                <div className="grid grid-cols-2 gap-4">
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input
                            type="radio"
                            name="visibility"
                            value="public"
                            checked={formData.visibility === 'public'}
                            onChange={(e) => onInputChange('visibility', e.target.value)}
                            className="w-4 h-4 text-violet-600 focus:ring-violet-500"
                        />
                        <div>
                            <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                <FaUnlock className="text-green-600" />
                                Public
                            </span>
                            <p className="text-xs text-gray-500">Visible to all students</p>
                        </div>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input
                            type="radio"
                            name="visibility"
                            value="private"
                            checked={formData.visibility === 'private'}
                            onChange={(e) => onInputChange('visibility', e.target.value)}
                            className="w-4 h-4 text-violet-600 focus:ring-violet-500"
                        />
                        <div>
                            <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                <FaLock className="text-red-600" />
                                Private
                            </span>
                            <p className="text-xs text-gray-500">Only enrolled students can access</p>
                        </div>
                    </label>
                </div>
            </div>

            {/* Feature Toggles */}
            <div className="space-y-6">
                <h4 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                    <FaStar className="text-violet-600" />
                    Available Features
                </h4>

                <div className="grid grid-cols-2 gap-4">
                    {formData.features && formData.features.length > 0 ? (
                        formData.features.map((feature) => {
                            const IconComponent = getFeatureIcon(feature.icon);
                            return (
                                <div
                                    key={feature.id}
                                    className={`p-4 rounded-xl border transition-all duration-200 ${feature.enabled
                                        ? 'border-violet-300 bg-violet-50'
                                        : 'border-gray-200 bg-white hover:border-gray-300'
                                        }`}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start gap-3">
                                            <div className={`mt-0.5 p-2 rounded-lg ${feature.enabled ? 'bg-violet-100' : 'bg-gray-100'
                                                }`}>
                                                <IconComponent className={`text-xl ${feature.enabled ? 'text-violet-600' : 'text-gray-400'
                                                    }`} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-gray-700">{feature.name}</p>
                                                <p className="text-xs text-gray-500 mt-0.5">
                                                    {feature.enabled ? 'Enabled' : 'Disabled'}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => toggleFeature(feature.id)}
                                            className={`relative w-12 h-6 rounded-full transition-colors duration-200 flex-shrink-0 ${feature.enabled ? 'bg-violet-600' : 'bg-gray-300'
                                                }`}
                                        >
                                            <div
                                                className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-200 ${feature.enabled ? 'left-7' : 'left-1'
                                                    }`}
                                            />
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="col-span-2 text-center py-8 text-gray-500">
                            No features available
                        </div>
                    )}
                </div>
            </div>

            {/* Display in Syllabus */}
            <div className="mt-6 pt-4 border-t border-gray-200">
                <label className="text-sm font-semibold text-gray-700 block mb-3">
                    Display in syllabus
                </label>
                <div className="flex gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            name="displayInSyllabus"
                            value="hide"
                            checked={formData.displayInSyllabus === 'hide'}
                            onChange={(e) => onInputChange('displayInSyllabus', e.target.value)}
                            className="w-4 h-4 text-violet-600 focus:ring-violet-500"
                        />
                        <span className="text-sm font-medium text-gray-700">Hide</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            name="displayInSyllabus"
                            value="show"
                            checked={formData.displayInSyllabus === 'show'}
                            onChange={(e) => onInputChange('displayInSyllabus', e.target.value)}
                            className="w-4 h-4 text-violet-600 focus:ring-violet-500"
                        />
                        <span className="text-sm font-medium text-gray-700">Show</span>
                    </label>
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