import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    FaBriefcase,
    FaMapMarkerAlt,
    FaClock,
    FaDollarSign,
    FaBookmark,
    FaRegBookmark,
    FaShareAlt,
    FaUsers,
    FaCalendarAlt,
    FaFilter,
    FaSearch,
    FaBell,
    FaCheckCircle,
    FaChartLine,
    FaBullhorn,
    FaRocket,
    FaEnvelope,
    FaPenFancy,
    FaArrowRight,
    FaStar,
    FaChevronDown,
} from 'react-icons/fa';

const JobNotification = () => {
    const [bookmarkedJobs, setBookmarkedJobs] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    const jobNotifications = [
        {
            id: 1,
            title: 'Senior Digital Marketing Manager',
            company: 'GrowthHive Agency',
            location: 'Remote (India)',
            type: 'Full-time',
            salary: '₹18L – ₹28L',
            posted: '2 hours ago',
            logo: 'GH',
            logoColor: 'bg-blue-600',
            skills: ['SEO', 'Google Ads', 'Meta Ads'],
            category: 'paid-media',
            description:
                'Lead end-to-end digital marketing campaigns for Fortune 500 clients. Drive ROI through data-driven paid media, SEO strategy, and funnel optimisation.',
            applicants: 45,
            deadline: '2025-07-15',
            badge: 'Hot',
            matchScore: 94,
        },
        {
            id: 2,
            title: 'Content Marketing Strategist',
            company: 'BrandNarrative Co.',
            location: 'Bangalore, India',
            type: 'Full-time',
            salary: '₹12L – ₹20L',
            posted: '1 day ago',
            logo: 'BN',
            logoColor: 'bg-blue-800',
            skills: ['Content Strategy', 'SEO Writing', 'HubSpot'],
            category: 'content',
            description:
                'Craft compelling content ecosystems — from editorial calendars to long-form thought leadership — that drive organic growth and brand authority.',
            applicants: 78,
            deadline: '2025-07-20',
            badge: 'Featured',
            matchScore: 88,
        },
        {
            id: 3,
            title: 'Performance Marketing Lead',
            company: 'ScaleUp Digital',
            location: 'Hyderabad, India',
            type: 'Full-time',
            salary: '₹22L – ₹35L',
            posted: '3 days ago',
            logo: 'SD',
            logoColor: 'bg-blue-900',
            skills: ['Google Ads', 'Meta Ads', 'Analytics'],
            category: 'paid-media',
            description:
                'Own paid acquisition across Google, Meta, and programmatic channels. Build attribution models and optimise toward aggressive growth targets.',
            applicants: 32,
            deadline: '2025-07-10',
            badge: 'Urgent',
            matchScore: 91,
        },
        {
            id: 4,
            title: 'Social Media Marketing Intern',
            company: 'PixelBuzz Studio',
            location: 'Remote',
            type: 'Internship',
            salary: '₹15k – ₹25k/mo',
            posted: '5 days ago',
            logo: 'PB',
            logoColor: 'bg-blue-400',
            skills: ['Instagram', 'Canva', 'Copywriting'],
            category: 'internship',
            description:
                'Hands-on role creating viral content, managing communities, and running A/B creative tests for fast-growing D2C brands.',
            applicants: 156,
            deadline: '2025-07-25',
            badge: null,
            matchScore: 76,
        },
        {
            id: 5,
            title: 'Marketing Analytics Specialist',
            company: 'DataPulse Inc.',
            location: 'Pune, India',
            type: 'Full-time',
            salary: '₹16L – ₹26L',
            posted: '1 week ago',
            logo: 'DP',
            logoColor: 'bg-blue-700',
            skills: ['GA4', 'Looker Studio', 'SQL'],
            category: 'analytics',
            description:
                'Transform raw marketing data into actionable insights. Build dashboards, attribution models, and forecasting reports that inform growth strategy.',
            applicants: 67,
            deadline: '2025-07-18',
            badge: null,
            matchScore: 85,
        },
        {
            id: 6,
            title: 'Email Marketing Manager',
            company: 'InboxFirst',
            location: 'Mumbai, India',
            type: 'Contract',
            salary: '₹10L – ₹16L',
            posted: '2 days ago',
            logo: 'IF',
            logoColor: 'bg-blue-600',
            skills: ['Klaviyo', 'Mailchimp', 'Automation'],
            category: 'email',
            description:
                'Design lifecycle email programs that convert, retain, and re-engage. Own open rates, click-throughs, and revenue-per-email for a portfolio of ecom brands.',
            applicants: 41,
            deadline: '2025-07-22',
            badge: 'New',
            matchScore: 82,
        },
    ];

    const categories = [
        { id: 'all', name: 'All Roles', icon: FaBriefcase, count: jobNotifications.length },
        { id: 'paid-media', name: 'Paid Media', icon: FaChartLine, count: jobNotifications.filter(j => j.category === 'paid-media').length },
        { id: 'content', name: 'Content', icon: FaPenFancy, count: jobNotifications.filter(j => j.category === 'content').length },
        { id: 'analytics', name: 'Analytics', icon: FaRocket, count: jobNotifications.filter(j => j.category === 'analytics').length },
        { id: 'email', name: 'Email', icon: FaEnvelope, count: jobNotifications.filter(j => j.category === 'email').length },
        { id: 'internship', name: 'Internships', icon: FaStar, count: jobNotifications.filter(j => j.category === 'internship').length },
    ];

    const toggleBookmark = (jobId) => {
        setBookmarkedJobs(prev =>
            prev.includes(jobId) ? prev.filter(id => id !== jobId) : [...prev, jobId]
        );
    };

    const filteredJobs = jobNotifications.filter(job => {
        const matchesCategory = selectedCategory === 'all' || job.category === selectedCategory;
        const matchesSearch =
            searchTerm === '' ||
            job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
        return matchesCategory && matchesSearch;
    });

    const badgeConfig = {
        Hot: 'bg-red-50 text-red-600',
        Urgent: 'bg-orange-50 text-orange-600',
        Featured: 'bg-blue-50 text-blue-600',
        New: 'bg-green-50 text-green-600',
    };

    const badgeDotConfig = {
        Hot: 'bg-red-500',
        Urgent: 'bg-orange-500',
        Featured: 'bg-blue-500',
        New: 'bg-green-500',
    };

    const stats = [
        { label: 'Total Jobs', value: jobNotifications.length, icon: FaBriefcase, iconColor: 'text-blue-600', iconBg: 'bg-blue-50' },
        { label: 'Applications Sent', value: 12, icon: FaCheckCircle, iconColor: 'text-green-600', iconBg: 'bg-green-50' },
        { label: 'Interviews', value: 3, icon: FaUsers, iconColor: 'text-amber-600', iconBg: 'bg-amber-50' },
        { label: 'Saved Jobs', value: bookmarkedJobs.length, icon: FaBookmark, iconColor: 'text-violet-600', iconBg: 'bg-violet-50' },
    ];

    return (
        <div className="p-3 sm:p-5 md:p-6 min-h-screen bg-[#f7f8fc]">
            <div className="max-w-7xl mx-auto">

                {/* Breadcrumb */}
                <p className="text-sm text-gray-400 mb-2">
                    <Link
                        to="/student/dashboard"
                        className="hover:text-blue-600 transition"
                    >
                        Dashboard
                    </Link>

                    <span className="mx-2 ">&gt;</span>

                    <span className="text-gray-600 font-medium">
                        Job Notifications
                    </span>
                </p>

                {/* Page Title */}
                <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 m-0">Job Notifications</h1>
                        <p className="text-sm text-gray-500 mt-2">Curated digital marketing roles matched to your profile</p>
                    </div>
                    <div className="relative">
                        <button className="bg-white border border-slate-200 rounded-lg w-9 h-9 flex items-center justify-center cursor-pointer hover:border-blue-500 transition-colors">
                            <FaBell className="text-slate-500 text-sm" />
                        </button>
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                            3
                        </span>
                    </div>
                </div>

                {/* Hero Banner */}
                <div className="rounded-xl p-6 mb-5 relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-600 to-blue-400">
                    <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full bg-white/5 pointer-events-none" />
                    <div className="absolute -bottom-16 left-1/3 w-60 h-60 rounded-full bg-white/[0.04] pointer-events-none" />
                    <div className="relative z-10 flex items-center justify-between flex-wrap gap-4">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <FaBullhorn className="text-blue-300 text-xs" />
                                <span className="text-blue-200 text-xs font-medium tracking-wider uppercase">Digital Marketing Hub</span>
                            </div>
                            <h2 className="text-lg font-bold text-white m-0">Your Career Opportunities</h2>
                            <p className="text-blue-300 text-xs mt-1 max-w-sm">
                                Roles in SEO, paid media, content & analytics — updated daily.
                            </p>
                        </div>
                        <div className="flex gap-3">
                            {[
                                { val: jobNotifications.length, label: 'Live Roles' },
                                { val: '94%', label: 'Top Match' },
                            ].map((s, i) => (
                                <div key={i} className="bg-white/10 rounded-xl px-5 py-3 text-center">
                                    <p className="text-white text-xl font-bold m-0">{s.val}</p>
                                    <p className="text-blue-300 text-[11px] mt-0.5 font-medium uppercase tracking-wider">{s.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
                    {stats.map((s, i) => {
                        const Icon = s.icon;
                        return (
                            <div
                                key={i}
                                className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-slate-400 text-xs font-medium m-0">{s.label}</p>
                                        <p className="text-slate-900 text-2xl font-bold mt-0.5 m-0">{s.value}</p>
                                    </div>
                                    <div className={`${s.iconBg} rounded-xl p-2.5`}>
                                        <Icon className={`${s.iconColor} text-base`} />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Search Bar */}
                <div className="bg-white rounded-xl border border-slate-200 p-3 mb-4">
                    <div className="flex gap-2.5 flex-wrap">
                        <div className="flex-1 min-w-48 relative">
                            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                            <input
                                type="text"
                                placeholder="Search by role, company, or skill (e.g. SEO, Google Ads...)"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-[13.5px] text-slate-800 bg-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-slate-400"
                            />
                        </div>
                        <button className="flex items-center gap-1.5 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg font-medium text-[13px] text-slate-600 cursor-pointer hover:border-blue-400 hover:text-blue-600 transition-colors">
                            <FaFilter className="text-[11px]" />
                            Filter
                            <FaChevronDown className="text-[10px]" />
                        </button>
                    </div>
                </div>

                {/* Category Tabs */}
                <div className="overflow-x-auto mb-4">
                    <div className="flex gap-2 min-w-max pb-0.5">
                        {categories.map(cat => {
                            const Icon = cat.icon;
                            const isActive = selectedCategory === cat.id;
                            return (
                                <button
                                    key={cat.id}
                                    onClick={() => setSelectedCategory(cat.id)}
                                    className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[13px] font-medium border whitespace-nowrap cursor-pointer transition-all
                    ${isActive
                                            ? 'bg-blue-600 text-white border-blue-600'
                                            : 'bg-white text-slate-500 border-slate-200 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50'
                                        }`}
                                >
                                    <Icon size={12} />
                                    {cat.name}
                                    <span
                                        className={`rounded px-1.5 py-px text-[11px] font-semibold
                      ${isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-400'}`}
                                    >
                                        {cat.count}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Results header */}
                <div className="flex items-center justify-between mb-3">
                    <p className="text-slate-500 text-[13px]">
                        Showing <span className="text-blue-600 font-semibold">{filteredJobs.length}</span> opportunities
                    </p>
                    <p className="text-slate-400 text-xs">
                        Sorted by: <span className="text-slate-600 font-medium">Best Match</span>
                    </p>
                </div>

                {/* Job Cards */}
                <div className="flex flex-col gap-3">
                    {filteredJobs.length > 0 ? (
                        filteredJobs.map(job => {
                            const isBookmarked = bookmarkedJobs.includes(job.id);
                            return (
                                <div
                                    key={job.id}
                                    className="bg-white rounded-xl border border-slate-200 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-px transition-all duration-200"
                                >
                                    <div className="p-5">
                                        <div className="flex gap-3.5 items-start flex-wrap">

                                            {/* Logo */}
                                            <div
                                                className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-[13px] text-white flex-shrink-0 tracking-wide ${job.logoColor}`}
                                            >
                                                {job.logo}
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-60">

                                                {/* Title row */}
                                                <div className="flex items-start justify-between gap-2 flex-wrap mb-0.5">
                                                    <div>
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <h3 className="text-[14px] font-semibold text-slate-900 m-0">{job.title}</h3>
                                                            {job.badge && (
                                                                <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold tracking-wide uppercase ${badgeConfig[job.badge]}`}>
                                                                    <span className={`w-1.5 h-1.5 rounded-full ${badgeDotConfig[job.badge]}`} />
                                                                    {job.badge}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-slate-500 text-[13px] font-normal mt-0.5">{job.company}</p>
                                                    </div>
                                                    <div className="flex gap-1.5">
                                                        <button
                                                            onClick={() => toggleBookmark(job.id)}
                                                            className={`w-8 h-8 flex items-center justify-center rounded-lg border cursor-pointer transition-all
                                                                ${isBookmarked
                                                                    ? 'border-blue-500 bg-blue-50'
                                                                    : 'border-slate-200 bg-transparent hover:border-blue-500 hover:bg-blue-50'
                                                                }`}
                                                        >
                                                            {isBookmarked
                                                                ? <FaBookmark className="text-blue-600 text-xs" />
                                                                : <FaRegBookmark className="text-slate-400 text-xs" />
                                                            }
                                                        </button>
                                                        <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 bg-transparent cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all">
                                                            <FaShareAlt className="text-slate-400 text-xs" />
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Meta */}
                                                <div className="flex flex-wrap gap-3 my-2">
                                                    {[
                                                        { icon: FaMapMarkerAlt, text: job.location },
                                                        { icon: FaClock, text: job.posted },
                                                        { icon: FaDollarSign, text: job.salary },
                                                    ].map((m, i) => {
                                                        const Icon = m.icon;
                                                        return (
                                                            <span key={i} className="flex items-center gap-1 text-[12.5px] text-slate-500">
                                                                <Icon className="text-slate-400 text-[11px]" />
                                                                {m.text}
                                                            </span>
                                                        );
                                                    })}
                                                    <span className="bg-blue-50 text-blue-600 rounded-full px-2.5 py-px text-[11.5px] font-medium">
                                                        {job.type}
                                                    </span>
                                                </div>

                                                <p className="text-slate-500 text-[13px] leading-relaxed mb-2.5">{job.description}</p>

                                                {/* Skills */}
                                                <div className="flex flex-wrap gap-1.5 mb-3">
                                                    {job.skills.map(skill => (
                                                        <span
                                                            key={skill}
                                                            className="bg-blue-50 text-blue-700 rounded px-2 py-0.5 text-xs font-medium"
                                                        >
                                                            {skill}
                                                        </span>
                                                    ))}
                                                </div>

                                                <div className="h-px bg-slate-100 my-3" />

                                                {/* Footer */}
                                                <div className="flex items-center justify-between flex-wrap gap-2">
                                                    <div className="flex items-center gap-4">
                                                        <span className="flex items-center gap-1 text-[12.5px] text-slate-500">
                                                            <FaUsers className="text-slate-400 text-[11px]" />
                                                            {job.applicants} applicants
                                                        </span>
                                                        <span className="flex items-center gap-1 text-[12.5px] text-blue-600 font-medium">
                                                            <FaCalendarAlt className="text-[11px]" />
                                                            Apply by{' '}
                                                            {new Date(job.deadline).toLocaleDateString('en-IN', {
                                                                day: 'numeric',
                                                                month: 'short',
                                                            })}
                                                        </span>
                                                        <div className="flex flex-col gap-1">
                                                            <span className="text-[11px] text-slate-400">Match</span>
                                                            <div className="flex items-center gap-1.5">
                                                                <div className="w-13 h-[3px] bg-slate-200 rounded-full overflow-hidden" style={{ width: 52 }}>
                                                                    <div
                                                                        className={`h-full rounded-full ${job.matchScore > 89 ? 'bg-green-500' : 'bg-blue-500'}`}
                                                                        style={{ width: `${job.matchScore}%` }}
                                                                    />
                                                                </div>
                                                                <span
                                                                    className={`text-xs font-semibold ${job.matchScore > 89 ? 'text-green-600' : 'text-blue-600'}`}
                                                                >
                                                                    {job.matchScore}%
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <button className="bg-white text-slate-700 border border-slate-200 rounded-lg px-3.5 py-1.5 text-[13px] font-medium cursor-pointer hover:border-blue-500 hover:text-blue-600 transition-all">
                                                            View Details
                                                        </button>
                                                        <button className="bg-blue-600 text-white border-none rounded-lg px-4 py-1.5 text-[13px] font-semibold cursor-pointer hover:bg-blue-700 transition-colors flex items-center gap-1.5">
                                                            Quick Apply <FaArrowRight className="text-[10px]" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="bg-white rounded-xl border border-slate-200 py-12 text-center">
                            <FaBullhorn className="text-slate-300 text-3xl mx-auto mb-2.5" />
                            <h3 className="text-slate-600 text-[15px] font-semibold">No roles found</h3>
                            <p className="text-slate-400 text-[13px]">
                                Try adjusting your search or filter to discover more opportunities.
                            </p>
                        </div>
                    )}
                </div>

                {/* Load More */}
                {filteredJobs.length >= 5 && (
                    <div className="text-center mt-5">
                        <button className="bg-white border border-slate-200 rounded-lg px-7 py-2.5 font-medium text-[13.5px] text-slate-700 cursor-pointer hover:border-blue-400 hover:text-blue-600 transition-all inline-flex items-center gap-2">
                            Load More Opportunities <FaChevronDown className="text-[10px]" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default JobNotification;