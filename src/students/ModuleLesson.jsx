import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
    FaPlay, FaCheckCircle, FaChevronLeft,
    FaChevronRight, FaChevronDown, FaChevronUp,
    FaClock, FaBook, FaTrophy, FaDownload, FaListUl,
    FaBullhorn, FaBullseye, FaPenNib, FaMoneyBillWave,
    FaChartLine, FaSignal, FaFilter

} from "react-icons/fa";
import { AiOutlinePlaySquare } from "react-icons/ai";
import { MdOutlineQuiz } from "react-icons/md";

/* ══════════════════════════════════════
   ALL COURSE MODULES — keyed by courseId
══════════════════════════════════════ */
const courseModulesData = {
    1: [
        {
            id: 1, title: "Module 1: Digital Marketing Fundamentals", icon: <FaBullhorn className="text-violet-600 text-lg" />, color: "#7C3AED",
            lessons: [
                { id: 1, title: "What is Digital Marketing?", duration: "08:32", type: "video", completed: true },
                { id: 2, title: "Traditional vs Digital Marketing", duration: "11:14", type: "video", completed: true },
                { id: 3, title: "Key Channels Overview", duration: "09:45", type: "video", completed: false },
                { id: 4, title: "Setting Your Marketing Goals", duration: "07:20", type: "video", completed: false },
                { id: 5, title: "Module 1 Quiz", duration: "10 Qs", type: "quiz", completed: false },
            ],
        },
        {
            id: 2, title: "Module 2: Audience Research & Personas", icon: <FaBullseye className="text-orange-600 text-lg" />, color: "#EA580C",

            lessons: [
                { id: 1, title: "Understanding Your Target Audience", duration: "10:20", type: "video", completed: false },
                { id: 2, title: "Building Buyer Personas", duration: "12:05", type: "video", completed: false },
                { id: 3, title: "Customer Journey Mapping", duration: "09:15", type: "video", completed: false },
                { id: 4, title: "Module 2 Quiz", duration: "8 Qs", type: "quiz", completed: false },
            ],
        },
        {
            id: 3, title: "Module 3: Content Strategy & Copywriting", icon: <FaPenNib className="text-green-600 text-lg" />, color: "#059669",
            lessons: [
                { id: 1, title: "Content Strategy Essentials", duration: "11:30", type: "video", completed: false },
                { id: 2, title: "Writing Compelling Copy", duration: "13:45", type: "video", completed: false },
                { id: 3, title: "Headlines & CTAs That Convert", duration: "08:50", type: "video", completed: false },
                { id: 4, title: "Content Calendar Planning", duration: "10:10", type: "video", completed: false },
                { id: 5, title: "Module 3 Quiz", duration: "10 Qs", type: "quiz", completed: false },
            ],
        },
        {
            id: 4, title: "Module 4: Paid Advertising (Google & Meta)", icon: <FaMoneyBillWave className="text-blue-600 text-lg" />, color: "#2563EB",
            lessons: [
                { id: 1, title: "Introduction to Paid Ads", duration: "09:00", type: "video", completed: false },
                { id: 2, title: "Google Search Campaigns", duration: "14:20", type: "video", completed: false },
                { id: 3, title: "Meta (Facebook & Instagram) Ads", duration: "15:00", type: "video", completed: false },
                { id: 4, title: "Ad Budgeting & Bidding Strategies", duration: "11:30", type: "video", completed: false },
                { id: 5, title: "Retargeting & Lookalike Audiences", duration: "10:45", type: "video", completed: false },
                { id: 6, title: "Module 4 Quiz", duration: "12 Qs", type: "quiz", completed: false },
            ],
        },
        {
            id: 5, title: "Module 5: Marketing Funnels & CRO", icon: <FaFilter className="text-orange-600" />, color: "#DB2777",
            lessons: [
                { id: 1, title: "Understanding the Marketing Funnel", duration: "10:00", type: "video", completed: false },
                { id: 2, title: "Landing Page Optimisation", duration: "12:30", type: "video", completed: false },
                { id: 3, title: "A/B Testing Fundamentals", duration: "09:45", type: "video", completed: false },
                { id: 4, title: "Module 5 Quiz", duration: "8 Qs", type: "quiz", completed: false },
            ],
        },
        {
            id: 6, title: "Module 6: Analytics & Reporting", icon: <FaSignal className="text-orange-600 text-lg" />, color: "#D97706",
            lessons: [
                { id: 1, title: "Google Analytics 4 Basics", duration: "13:10", type: "video", completed: false },
                { id: 2, title: "Reading Campaign Reports", duration: "10:20", type: "video", completed: false },
                { id: 3, title: "KPIs & ROI Measurement", duration: "09:00", type: "video", completed: false },
                { id: 4, title: "Final Assessment", duration: "20 Qs", type: "quiz", completed: false },
            ],
        },
    ],
    2: [
        {
            id: 1, title: "Module 1: SEO Fundamentals & How Google Works", icon: "🔍", color: "#7C3AED",
            lessons: [
                { id: 1, title: "How Search Engines Work", duration: "10:05", type: "video", completed: true },
                { id: 2, title: "Google's Ranking Factors", duration: "12:20", type: "video", completed: false },
                { id: 3, title: "White Hat vs Black Hat SEO", duration: "08:45", type: "video", completed: false },
                { id: 4, title: "Module 1 Quiz", duration: "8 Qs", type: "quiz", completed: false },
            ],
        },
        {
            id: 2, title: "Module 2: Keyword Research & Search Intent", icon: "🗝️", color: "#EA580C",
            lessons: [
                { id: 1, title: "What is Keyword Research?", duration: "09:30", type: "video", completed: false },
                { id: 2, title: "Using Ahrefs & SEMrush", duration: "14:00", type: "video", completed: false },
                { id: 3, title: "Understanding Search Intent", duration: "11:15", type: "video", completed: false },
                { id: 4, title: "Long-Tail vs Short-Tail Keywords", duration: "08:30", type: "video", completed: false },
                { id: 5, title: "Competitor Keyword Analysis", duration: "10:45", type: "video", completed: false },
                { id: 6, title: "Module 2 Quiz", duration: "10 Qs", type: "quiz", completed: false },
            ],
        },
        {
            id: 3, title: "Module 3: On-Page Optimisation", icon: "📄", color: "#059669",
            lessons: [
                { id: 1, title: "Title Tags & Meta Descriptions", duration: "09:00", type: "video", completed: false },
                { id: 2, title: "Header Tags & Content Structure", duration: "10:30", type: "video", completed: false },
                { id: 3, title: "Internal Linking Strategy", duration: "08:45", type: "video", completed: false },
                { id: 4, title: "Image Optimisation & Alt Text", duration: "07:20", type: "video", completed: false },
                { id: 5, title: "Schema Markup Basics", duration: "11:00", type: "video", completed: false },
                { id: 6, title: "Module 3 Quiz", duration: "12 Qs", type: "quiz", completed: false },
            ],
        },
        {
            id: 4, title: "Module 4: Technical SEO", icon: "⚙️", color: "#2563EB",
            lessons: [
                { id: 1, title: "Site Speed & Core Web Vitals", duration: "13:00", type: "video", completed: false },
                { id: 2, title: "Crawlability & Indexation", duration: "10:15", type: "video", completed: false },
                { id: 3, title: "XML Sitemaps & Robots.txt", duration: "08:30", type: "video", completed: false },
                { id: 4, title: "Mobile-First Indexing", duration: "09:45", type: "video", completed: false },
                { id: 5, title: "HTTPS & Site Security", duration: "07:00", type: "video", completed: false },
                { id: 6, title: "Screaming Frog Audit Walkthrough", duration: "14:30", type: "video", completed: false },
                { id: 7, title: "Module 4 Quiz", duration: "12 Qs", type: "quiz", completed: false },
            ],
        },
        {
            id: 5, title: "Module 5: Link Building & Off-Page SEO", icon: "🔗", color: "#DB2777",
            lessons: [
                { id: 1, title: "Why Backlinks Matter", duration: "09:10", type: "video", completed: false },
                { id: 2, title: "Guest Posting Strategy", duration: "11:30", type: "video", completed: false },
                { id: 3, title: "Digital PR & Outreach", duration: "12:00", type: "video", completed: false },
                { id: 4, title: "Broken Link Building", duration: "08:45", type: "video", completed: false },
                { id: 5, title: "Module 5 Quiz", duration: "10 Qs", type: "quiz", completed: false },
            ],
        },
        {
            id: 6, title: "Module 6: Tracking & Reporting with GSC & GA4", icon: "📊", color: "#D97706",
            lessons: [
                { id: 1, title: "Google Search Console Setup", duration: "10:00", type: "video", completed: false },
                { id: 2, title: "Reading GSC Reports", duration: "11:15", type: "video", completed: false },
                { id: 3, title: "GA4 for SEO Insights", duration: "12:30", type: "video", completed: false },
                { id: 4, title: "Final Assessment", duration: "15 Qs", type: "quiz", completed: false },
            ],
        },
    ],
    3: [
        {
            id: 1, title: "Module 1: Google Ads Ecosystem Overview", icon: "🌐", color: "#7C3AED",
            lessons: [
                { id: 1, title: "How Google Ads Works", duration: "09:00", type: "video", completed: false },
                { id: 2, title: "Campaign Types Overview", duration: "10:30", type: "video", completed: false },
                { id: 3, title: "Setting Up Your Account", duration: "08:15", type: "video", completed: false },
            ],
        },
        {
            id: 2, title: "Module 2: Search Campaigns & Keyword Strategy", icon: "🔎", color: "#EA580C",
            lessons: [
                { id: 1, title: "Keyword Match Types Explained", duration: "11:00", type: "video", completed: false },
                { id: 2, title: "Building Your Keyword List", duration: "13:30", type: "video", completed: false },
                { id: 3, title: "Negative Keywords Strategy", duration: "09:45", type: "video", completed: false },
                { id: 4, title: "Ad Groups & Campaign Structure", duration: "12:00", type: "video", completed: false },
                { id: 5, title: "Quality Score Explained", duration: "10:15", type: "video", completed: false },
                { id: 6, title: "Module 2 Quiz", duration: "10 Qs", type: "quiz", completed: false },
            ],
        },
        {
            id: 3, title: "Module 3: Ad Copywriting & Extensions", icon: "✍️", color: "#059669",
            lessons: [
                { id: 1, title: "Writing Responsive Search Ads", duration: "10:30", type: "video", completed: false },
                { id: 2, title: "Ad Extensions Deep Dive", duration: "09:00", type: "video", completed: false },
                { id: 3, title: "A/B Testing Your Ads", duration: "08:30", type: "video", completed: false },
                { id: 4, title: "Module 3 Quiz", duration: "8 Qs", type: "quiz", completed: false },
            ],
        },
        {
            id: 4, title: "Module 4: Display & Remarketing Campaigns", icon: "🖼️", color: "#2563EB",
            lessons: [
                { id: 1, title: "Google Display Network Basics", duration: "11:00", type: "video", completed: false },
                { id: 2, title: "Audience Targeting Options", duration: "10:30", type: "video", completed: false },
                { id: 3, title: "Setting Up Remarketing Lists", duration: "12:15", type: "video", completed: false },
                { id: 4, title: "Module 4 Quiz", duration: "8 Qs", type: "quiz", completed: false },
            ],
        },
        {
            id: 5, title: "Module 5: Shopping & YouTube Ads", icon: "🛒", color: "#DB2777",
            lessons: [
                { id: 1, title: "Google Shopping Campaigns Setup", duration: "13:00", type: "video", completed: false },
                { id: 2, title: "Product Feed Optimisation", duration: "10:00", type: "video", completed: false },
                { id: 3, title: "YouTube In-Stream Ads", duration: "11:30", type: "video", completed: false },
                { id: 4, title: "Module 5 Quiz", duration: "8 Qs", type: "quiz", completed: false },
            ],
        },
        {
            id: 6, title: "Module 6: Bidding, Budgets & Optimisation", icon: "💹", color: "#D97706",
            lessons: [
                { id: 1, title: "Manual vs Smart Bidding", duration: "10:00", type: "video", completed: false },
                { id: 2, title: "Budget Allocation Strategies", duration: "09:15", type: "video", completed: false },
                { id: 3, title: "Final Assessment", duration: "15 Qs", type: "quiz", completed: false },
            ],
        },
    ],
    4: [
        {
            id: 1, title: "Module 1: Email Marketing Fundamentals", icon: "✉️", color: "#7C3AED",
            lessons: [
                { id: 1, title: "Why Email Marketing Still Wins", duration: "08:00", type: "video", completed: true },
                { id: 2, title: "Types of Marketing Emails", duration: "10:30", type: "video", completed: false },
                { id: 3, title: "Choosing the Right ESP", duration: "09:15", type: "video", completed: false },
                { id: 4, title: "Module 1 Quiz", duration: "8 Qs", type: "quiz", completed: false },
            ],
        },
        {
            id: 2, title: "Module 2: List Building & Lead Magnets", icon: "🧲", color: "#EA580C",
            lessons: [
                { id: 1, title: "What is a Lead Magnet?", duration: "09:00", type: "video", completed: false },
                { id: 2, title: "Creating High-Converting Opt-In Forms", duration: "11:30", type: "video", completed: false },
                { id: 3, title: "Landing Page Best Practices", duration: "10:45", type: "video", completed: false },
                { id: 4, title: "Growing Your List Organically", duration: "12:00", type: "video", completed: false },
                { id: 5, title: "Module 2 Quiz", duration: "8 Qs", type: "quiz", completed: false },
            ],
        },
        {
            id: 3, title: "Module 3: Email Design & Copywriting", icon: "🎨", color: "#059669",
            lessons: [
                { id: 1, title: "Email Design Principles", duration: "11:00", type: "video", completed: false },
                { id: 2, title: "Subject Lines That Get Opens", duration: "10:15", type: "video", completed: false },
                { id: 3, title: "Writing the Perfect Email Body", duration: "13:00", type: "video", completed: false },
                { id: 4, title: "Mobile-Responsive Email Templates", duration: "09:30", type: "video", completed: false },
                { id: 5, title: "Module 3 Quiz", duration: "10 Qs", type: "quiz", completed: false },
            ],
        },
        {
            id: 4, title: "Module 4: Automation & Drip Sequences", icon: "⚡", color: "#2563EB",
            lessons: [
                { id: 1, title: "Welcome Sequence Setup", duration: "12:30", type: "video", completed: false },
                { id: 2, title: "Nurture Drip Campaigns", duration: "13:00", type: "video", completed: false },
                { id: 3, title: "Re-Engagement Campaigns", duration: "10:00", type: "video", completed: false },
                { id: 4, title: "Abandoned Cart Email Flows", duration: "11:15", type: "video", completed: false },
                { id: 5, title: "Post-Purchase Sequences", duration: "09:45", type: "video", completed: false },
                { id: 6, title: "Module 4 Quiz", duration: "12 Qs", type: "quiz", completed: false },
            ],
        },
        {
            id: 5, title: "Module 5: Segmentation & Personalisation", icon: "👤", color: "#DB2777",
            lessons: [
                { id: 1, title: "List Segmentation Strategies", duration: "10:30", type: "video", completed: false },
                { id: 2, title: "Dynamic Content & Personalisation", duration: "11:45", type: "video", completed: false },
                { id: 3, title: "Behavioural Triggers", duration: "10:00", type: "video", completed: false },
                { id: 4, title: "Module 5 Quiz", duration: "8 Qs", type: "quiz", completed: false },
            ],
        },
        {
            id: 6, title: "Module 6: Analytics, A/B Testing & Deliverability", icon: "📬", color: "#D97706",
            lessons: [
                { id: 1, title: "Key Email Metrics Explained", duration: "09:00", type: "video", completed: false },
                { id: 2, title: "Final Assessment", duration: "15 Qs", type: "quiz", completed: false },
            ],
        },
    ],
    5: [
        {
            id: 1, title: "Module 1: Social Media Strategy Foundations", icon: "📱", color: "#7C3AED",
            lessons: [
                { id: 1, title: "Building a Social Media Strategy", duration: "10:00", type: "video", completed: true },
                { id: 2, title: "Choosing the Right Platforms", duration: "08:30", type: "video", completed: false },
                { id: 3, title: "Brand Voice & Tone on Social", duration: "09:15", type: "video", completed: false },
                { id: 4, title: "Module 1 Quiz", duration: "8 Qs", type: "quiz", completed: false },
            ],
        },
        {
            id: 2, title: "Module 2: Instagram & Reels Mastery", icon: "📸", color: "#EA580C",
            lessons: [
                { id: 1, title: "Optimising Your Instagram Profile", duration: "09:00", type: "video", completed: false },
                { id: 2, title: "Creating High-Performing Reels", duration: "13:30", type: "video", completed: false },
                { id: 3, title: "Carousel & Story Strategies", duration: "10:45", type: "video", completed: false },
                { id: 4, title: "Hashtag Research & Usage", duration: "08:30", type: "video", completed: false },
                { id: 5, title: "Instagram Analytics Deep Dive", duration: "11:00", type: "video", completed: false },
                { id: 6, title: "Module 2 Quiz", duration: "10 Qs", type: "quiz", completed: false },
            ],
        },
        {
            id: 3, title: "Module 3: LinkedIn for B2B Growth", icon: "💼", color: "#059669",
            lessons: [
                { id: 1, title: "LinkedIn Profile Optimisation", duration: "10:00", type: "video", completed: false },
                { id: 2, title: "Content Strategy for LinkedIn", duration: "11:30", type: "video", completed: false },
                { id: 3, title: "LinkedIn Company Pages", duration: "09:15", type: "video", completed: false },
                { id: 4, title: "LinkedIn Newsletter & Articles", duration: "08:45", type: "video", completed: false },
                { id: 5, title: "Module 3 Quiz", duration: "10 Qs", type: "quiz", completed: false },
            ],
        },
        {
            id: 4, title: "Module 4: YouTube & Short-Form Video", icon: "▶️", color: "#2563EB",
            lessons: [
                { id: 1, title: "YouTube Channel Setup & SEO", duration: "12:00", type: "video", completed: false },
                { id: 2, title: "Scripting & Filming Tips", duration: "13:30", type: "video", completed: false },
                { id: 3, title: "YouTube Shorts Strategy", duration: "09:00", type: "video", completed: false },
                { id: 4, title: "Thumbnails & Titles That Get Clicks", duration: "10:15", type: "video", completed: false },
                { id: 5, title: "Channel Monetisation Basics", duration: "11:00", type: "video", completed: false },
                { id: 6, title: "Module 4 Quiz", duration: "10 Qs", type: "quiz", completed: false },
            ],
        },
        {
            id: 5, title: "Module 5: Community Management & Influencers", icon: "🤝", color: "#DB2777",
            lessons: [
                { id: 1, title: "Building an Engaged Community", duration: "10:30", type: "video", completed: false },
                { id: 2, title: "Handling Negative Comments & Crises", duration: "09:45", type: "video", completed: false },
                { id: 3, title: "Influencer Marketing 101", duration: "12:00", type: "video", completed: false },
                { id: 4, title: "UGC Campaigns & Brand Collabs", duration: "10:00", type: "video", completed: false },
                { id: 5, title: "Module 5 Quiz", duration: "10 Qs", type: "quiz", completed: false },
            ],
        },
        {
            id: 6, title: "Module 6: Analytics & Growth Hacking", icon: "🚀", color: "#D97706",
            lessons: [
                { id: 1, title: "Social Media KPIs & Metrics", duration: "09:30", type: "video", completed: false },
                { id: 2, title: "Growth Hacking Tactics", duration: "11:00", type: "video", completed: false },
                { id: 3, title: "Using Native Analytics Tools", duration: "10:15", type: "video", completed: false },
                { id: 4, title: "Final Assessment", duration: "15 Qs", type: "quiz", completed: false },
            ],
        },
    ],
    6: [
        {
            id: 1, title: "Module 1: Introduction to GA4 & the Data Model", icon: "📊", color: "#7C3AED",
            lessons: [
                { id: 1, title: "GA4 vs Universal Analytics", duration: "10:00", type: "video", completed: false },
                { id: 2, title: "Understanding the Event-Based Model", duration: "11:30", type: "video", completed: false },
                { id: 3, title: "Key Dimensions & Metrics", duration: "09:15", type: "video", completed: false },
                { id: 4, title: "Module 1 Quiz", duration: "8 Qs", type: "quiz", completed: false },
            ],
        },
        {
            id: 2, title: "Module 2: GA4 Setup & Configuration", icon: "⚙️", color: "#EA580C",
            lessons: [
                { id: 1, title: "Creating a GA4 Property", duration: "08:30", type: "video", completed: false },
                { id: 2, title: "Connecting Data Streams", duration: "10:00", type: "video", completed: false },
                { id: 3, title: "User Roles & Permissions", duration: "07:45", type: "video", completed: false },
                { id: 4, title: "Module 2 Quiz", duration: "8 Qs", type: "quiz", completed: false },
            ],
        },
        {
            id: 3, title: "Module 3: Events, Conversions & Goals", icon: "🎯", color: "#059669",
            lessons: [
                { id: 1, title: "Automatic vs Custom Events", duration: "11:00", type: "video", completed: false },
                { id: 2, title: "Setting Up Conversion Events", duration: "10:30", type: "video", completed: false },
                { id: 3, title: "Enhanced E-Commerce Tracking", duration: "13:00", type: "video", completed: false },
                { id: 4, title: "Debugging Events with DebugView", duration: "09:00", type: "video", completed: false },
                { id: 5, title: "Module 3 Quiz", duration: "10 Qs", type: "quiz", completed: false },
            ],
        },
        {
            id: 4, title: "Module 4: Reports, Explorations & Funnels", icon: "🔬", color: "#2563EB",
            lessons: [
                { id: 1, title: "Standard Reports Overview", duration: "10:00", type: "video", completed: false },
                { id: 2, title: "Exploration Reports Deep Dive", duration: "12:30", type: "video", completed: false },
                { id: 3, title: "Funnel Exploration & Path Analysis", duration: "11:15", type: "video", completed: false },
                { id: 4, title: "Module 4 Quiz", duration: "8 Qs", type: "quiz", completed: false },
            ],
        },
        {
            id: 5, title: "Module 5: Google Tag Manager Integration", icon: "🏷️", color: "#DB2777",
            lessons: [
                { id: 1, title: "GTM Basics for GA4", duration: "11:00", type: "video", completed: false },
                { id: 2, title: "Creating Tags & Triggers", duration: "12:30", type: "video", completed: false },
                { id: 3, title: "Module 5 Quiz", duration: "8 Qs", type: "quiz", completed: false },
            ],
        },
        {
            id: 6, title: "Module 6: Looker Studio Dashboards", icon: "📋", color: "#D97706",
            lessons: [
                { id: 1, title: "Connecting GA4 to Looker Studio", duration: "10:00", type: "video", completed: false },
                { id: 2, title: "Final Assessment", duration: "15 Qs", type: "quiz", completed: false },
            ],
        },
    ],
    7: [
        {
            id: 1, title: "Module 1: Content Strategy & Audience Mapping", icon: "🗺️", color: "#7C3AED",
            lessons: [
                { id: 1, title: "What is a Content Strategy?", duration: "09:00", type: "video", completed: true },
                { id: 2, title: "Mapping Content to the Buyer Journey", duration: "11:00", type: "video", completed: false },
                { id: 3, title: "Audience Research for Content", duration: "10:15", type: "video", completed: false },
                { id: 4, title: "Module 1 Quiz", duration: "8 Qs", type: "quiz", completed: false },
            ],
        },
        {
            id: 2, title: "Module 2: Blogging & Long-Form Writing", icon: "📝", color: "#EA580C",
            lessons: [
                { id: 1, title: "Anatomy of a Great Blog Post", duration: "12:00", type: "video", completed: false },
                { id: 2, title: "SEO Writing Fundamentals", duration: "13:30", type: "video", completed: false },
                { id: 3, title: "Writing Headlines That Work", duration: "08:45", type: "video", completed: false },
                { id: 4, title: "Editing & Polishing Your Content", duration: "10:00", type: "video", completed: false },
                { id: 5, title: "Module 2 Quiz", duration: "10 Qs", type: "quiz", completed: false },
            ],
        },
        {
            id: 3, title: "Module 3: Video Scripts & Storytelling", icon: "🎬", color: "#059669",
            lessons: [
                { id: 1, title: "Storytelling Frameworks", duration: "10:30", type: "video", completed: false },
                { id: 2, title: "Writing a YouTube Script", duration: "12:00", type: "video", completed: false },
                { id: 3, title: "Short-Form Video Scripting", duration: "09:00", type: "video", completed: false },
                { id: 4, title: "Storyboarding Basics", duration: "08:30", type: "video", completed: false },
                { id: 5, title: "Module 3 Quiz", duration: "8 Qs", type: "quiz", completed: false },
            ],
        },
        {
            id: 4, title: "Module 4: Content Calendar & Workflow", icon: "📅", color: "#2563EB",
            lessons: [
                { id: 1, title: "Building Your Content Calendar", duration: "11:00", type: "video", completed: false },
                { id: 2, title: "Editorial Workflows for Teams", duration: "10:30", type: "video", completed: false },
                { id: 3, title: "Content Batching Strategies", duration: "09:15", type: "video", completed: false },
                { id: 4, title: "Module 4 Quiz", duration: "8 Qs", type: "quiz", completed: false },
            ],
        },
        {
            id: 5, title: "Module 5: Content Distribution & Repurposing", icon: "🔄", color: "#DB2777",
            lessons: [
                { id: 1, title: "Owned, Earned & Paid Distribution", duration: "10:00", type: "video", completed: false },
                { id: 2, title: "Repurposing Content Across Channels", duration: "11:30", type: "video", completed: false },
                { id: 3, title: "Content Syndication", duration: "08:45", type: "video", completed: false },
                { id: 4, title: "Module 5 Quiz", duration: "8 Qs", type: "quiz", completed: false },
            ],
        },
        {
            id: 6, title: "Module 6: Measuring & Scaling Content", icon: "📈", color: "#D97706",
            lessons: [
                { id: 1, title: "Content KPIs & Analytics", duration: "10:30", type: "video", completed: false },
                { id: 2, title: "Scaling Your Content Operation", duration: "11:00", type: "video", completed: false },
                { id: 3, title: "Final Assessment", duration: "15 Qs", type: "quiz", completed: false },
            ],
        },
    ],
    8: [
        {
            id: 1, title: "Module 1: Marketing Automation Fundamentals", icon: "🤖", color: "#7C3AED",
            lessons: [
                { id: 1, title: "What is Marketing Automation?", duration: "09:30", type: "video", completed: false },
                { id: 2, title: "The MarTech Stack Explained", duration: "11:00", type: "video", completed: false },
                { id: 3, title: "Automation Use Cases by Industry", duration: "10:15", type: "video", completed: false },
                { id: 4, title: "Module 1 Quiz", duration: "8 Qs", type: "quiz", completed: false },
            ],
        },
        {
            id: 2, title: "Module 2: HubSpot CRM Setup & Configuration", icon: "🏗️", color: "#EA580C",
            lessons: [
                { id: 1, title: "HubSpot Account Setup", duration: "10:00", type: "video", completed: false },
                { id: 2, title: "Contacts, Companies & Deals", duration: "12:30", type: "video", completed: false },
                { id: 3, title: "Pipelines & Deal Stages", duration: "11:00", type: "video", completed: false },
                { id: 4, title: "Properties & Custom Fields", duration: "09:30", type: "video", completed: false },
                { id: 5, title: "Module 2 Quiz", duration: "10 Qs", type: "quiz", completed: false },
            ],
        },
        {
            id: 3, title: "Module 3: Lead Scoring & Nurture Workflows", icon: "🎯", color: "#059669",
            lessons: [
                { id: 1, title: "Building a Lead Scoring Model", duration: "12:00", type: "video", completed: false },
                { id: 2, title: "Creating Nurture Workflows in HubSpot", duration: "13:30", type: "video", completed: false },
                { id: 3, title: "MQL vs SQL — When to Hand Off to Sales", duration: "09:45", type: "video", completed: false },
                { id: 4, title: "Workflow Branching Logic", duration: "11:00", type: "video", completed: false },
                { id: 5, title: "Module 3 Quiz", duration: "10 Qs", type: "quiz", completed: false },
            ],
        },
        {
            id: 4, title: "Module 4: Behavioural Triggers & Drip Campaigns", icon: "⚡", color: "#2563EB",
            lessons: [
                { id: 1, title: "Trigger-Based Automation Explained", duration: "10:30", type: "video", completed: false },
                { id: 2, title: "Building Multi-Step Drip Campaigns", duration: "13:00", type: "video", completed: false },
                { id: 3, title: "Time-Based vs Behaviour-Based Triggers", duration: "11:15", type: "video", completed: false },
                { id: 4, title: "Testing & Optimising Your Workflows", duration: "10:00", type: "video", completed: false },
                { id: 5, title: "Real Campaign Walkthrough", duration: "14:00", type: "video", completed: false },
                { id: 6, title: "Module 4 Quiz", duration: "12 Qs", type: "quiz", completed: false },
            ],
        },
        {
            id: 5, title: "Module 5: Zapier & Tool Integrations", icon: "🔌", color: "#DB2777",
            lessons: [
                { id: 1, title: "Zapier Basics & Zap Structure", duration: "10:00", type: "video", completed: false },
                { id: 2, title: "Connecting HubSpot with Other Tools", duration: "12:30", type: "video", completed: false },
                { id: 3, title: "Multi-Step Zap Workflows", duration: "11:00", type: "video", completed: false },
                { id: 4, title: "Webhooks & API Basics for Marketers", duration: "10:30", type: "video", completed: false },
                { id: 5, title: "Module 5 Quiz", duration: "10 Qs", type: "quiz", completed: false },
            ],
        },
        {
            id: 6, title: "Module 6: Reporting, Optimisation & Scaling", icon: "📊", color: "#D97706",
            lessons: [
                { id: 1, title: "Automation ROI Measurement", duration: "10:00", type: "video", completed: false },
                { id: 2, title: "Optimising Underperforming Workflows", duration: "11:30", type: "video", completed: false },
                { id: 3, title: "Final Assessment", duration: "20 Qs", type: "quiz", completed: false },
            ],
        },
    ],
};

/* ── Lesson video content (shared across courses) ── */
const lessonContent = {
    "1-1": {
        videoId: "bixR-KIJKYM",
        description: "In this lesson we explore the foundational concepts of this module. Follow along carefully and take notes — the quiz at the end will test these ideas.",
        keyPoints: [
            "Pay attention to the core concepts introduced in this lesson",
            "Real-world examples are used throughout to cement your understanding",
            "Pause and rewind freely — learn at your own pace",
            "Download the resources below to reinforce your learning",
        ],
        resources: [{ name: "Lesson Slides (PDF)", size: "1.2 MB" }, { name: "Glossary", size: "450 KB" }],
    },
};

const getContent = (moduleId, lessonId, allModules) => {
    const mod = allModules[moduleId - 1];
    const lesson = mod?.lessons[lessonId - 1];
    return {
        title: lesson?.title || "Lesson",
        videoId: "bixR-KIJKYM",
        description: `This lesson covers "${lesson?.title || 'key concepts'}" as part of ${mod?.title || 'this module'}. Watch the video carefully and use the key takeaways below to guide your learning.`,
        keyPoints: [
            "Follow along with the video at your own pace",
            "Note down any terms or concepts you want to revisit",
            "Complete the module quiz to test your understanding",
            "Download the resources below for additional study material",
        ],
        resources: [{ name: `${lesson?.title || 'Lesson'} Notes (PDF)`, size: "600 KB" }],
    };
};

/* MAIN COMPONENT */
const ModuleLesson = () => {
    const { courseId, moduleId, lessonId } = useParams();
    const navigate = useNavigate();

    const cId = parseInt(courseId) || 1;
    const mId = parseInt(moduleId) || 1;
    const lId = parseInt(lessonId) || 1;

    const allModules = courseModulesData[cId] || courseModulesData[1];
    const currentModule = allModules[mId - 1] || allModules[0];
    const currentLesson = currentModule.lessons[lId - 1] || currentModule.lessons[0];
    const content = getContent(mId, lId, allModules);

    const [completedLessons, setCompletedLessons] = useState(
        new Set(
            allModules.flatMap((m) =>
                m.lessons.filter((l) => l.completed).map((l) => `${m.id}-${l.id}`)
            )
        )
    );
    const [expandedModules, setExpandedModules] = useState(new Set([currentModule.id]));
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const toggleModule = (id) => {
        setExpandedModules((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const markComplete = () => {
        setCompletedLessons((prev) => new Set(prev).add(`${mId}-${lId}`));
    };

    const totalLessons = allModules.reduce((s, m) => s + m.lessons.length, 0);
    const completedCount = completedLessons.size;
    const progressPct = Math.round((completedCount / totalLessons) * 100);

    const flatLessons = allModules.flatMap((m) =>
        m.lessons.map((l) => ({ moduleId: m.id, lessonId: l.id }))
    );
    const currentFlatIdx = flatLessons.findIndex(
        (f) => f.moduleId === mId && f.lessonId === lId
    );
    const prevLesson = flatLessons[currentFlatIdx - 1];
    const nextLesson = flatLessons[currentFlatIdx + 1];

    const goTo = (mod, les) => navigate(`/student/course/${cId}/module/${mod}/lesson/${les}`);

    return (
        <div className="min-h-screen bg-[#f6f7fb] flex flex-col">

            {/* ── Top Bar ── */}
            <div className="bg-white border-b border-gray-200 px-5 py-3 flex items-center justify-between sticky top-0 z-30">
                <div className="flex items-center gap-3">
                    <Link
                        to={`/student/continue-learning/${cId}`}
                        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 transition"
                    >
                        <FaChevronLeft className="w-3 h-3" />
                        Back to Course
                    </Link>
                    <span className="text-gray-300">/</span>
                    <span className="text-sm font-semibold text-gray-800 truncate max-w-[180px] sm:max-w-xs">
                        {currentModule.title}
                    </span>
                </div>

                <div className="flex items-center gap-3">
                    <div className="hidden sm:flex items-center gap-2">
                        <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-600 rounded-full transition-all" style={{ width: `${progressPct}%` }} />
                        </div>
                        <span className="text-xs text-gray-500 font-medium">{progressPct}% complete</span>
                    </div>
                    <button
                        onClick={() => setSidebarOpen((v) => !v)}
                        className="flex items-center gap-1.5 text-sm text-gray-600 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition"
                    >
                        <FaListUl className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">{sidebarOpen ? "Hide" : "Show"} Contents</span>
                    </button>
                </div>
            </div>

            {/* ── Body ── */}
            <div className="flex flex-1 overflow-hidden">

                {/* ════ MAIN CONTENT ════ */}
                <div className="flex-1 overflow-y-auto">
                    <div className="max-w-4xl mx-auto p-5 space-y-6">

                        {/* Breadcrumb */}
                        <p className="text-xs text-gray-400">
                            <Link to={`/student/continue-learning/${cId}`} className="hover:text-blue-600 transition">
                                Course Overview
                            </Link>
                            <span className="mx-1.5">›</span>
                            <span
                                className="hover:text-blue-600 cursor-pointer transition"
                                onClick={() => goTo(mId, 1)}
                            >
                                {currentModule.title}
                            </span>
                            <span className="mx-1.5">›</span>
                            <span className="text-gray-600">{content.title}</span>
                        </p>

                        {/* ── Video Player ── */}
                        <div className="rounded-2xl overflow-hidden shadow-md bg-black aspect-video">
                            {currentLesson.type === "quiz" ? (
                                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-8 text-center">
                                    <MdOutlineQuiz className="w-16 h-16 mb-4 opacity-90" />
                                    <h2 className="text-2xl font-bold mb-2">Module Quiz</h2>
                                    <p className="text-blue-100 text-sm mb-6 max-w-sm">
                                        Test your understanding of {currentModule.title} before moving on.
                                    </p>
                                    <button
                                        onClick={markComplete}
                                        className="bg-white text-blue-700 font-bold px-8 py-3 rounded-xl hover:bg-blue-50 transition"
                                    >
                                        Start Quiz
                                    </button>
                                </div>
                            ) : (
                                <video
                                    className="w-full h-full"
                                    controls
                                >
                                    <source
                                        src="https://www.w3schools.com/html/mov_bbb.mp4"
                                        type="video/mp4"
                                    />
                                </video>
                            )}
                        </div>

                        {/* ── Lesson Header ── */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span
                                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold text-white"
                                        style={{ backgroundColor: currentModule.color }}
                                    >
                                        {currentModule.title.split(": ")[0]}
                                    </span>
                                    {completedLessons.has(`${mId}-${lId}`) && (
                                        <span className="flex items-center gap-1 text-xs text-green-600 font-semibold">
                                            <FaCheckCircle className="w-3 h-3" /> Completed
                                        </span>
                                    )}
                                </div>
                                <h1 className="text-xl font-extrabold text-gray-900">{content.title}</h1>
                                <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                                    <span className="flex items-center gap-1">
                                        <FaClock className="w-3 h-3" />
                                        {currentLesson.duration}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <AiOutlinePlaySquare className="w-3.5 h-3.5" />
                                        Lesson {lId} of {currentModule.lessons.length}
                                    </span>
                                </div>
                            </div>

                            {!completedLessons.has(`${mId}-${lId}`) && currentLesson.type !== "quiz" && (
                                <button
                                    onClick={markComplete}
                                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition flex-shrink-0"
                                >
                                    <FaCheckCircle className="w-4 h-4" />
                                    Mark as Complete
                                </button>
                            )}
                        </div>

                        {/* ── About this lesson ── */}
                        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                            <h3 className="text-base font-bold text-gray-900 mb-2">About this lesson</h3>
                            <p className="text-sm text-gray-600 leading-relaxed">{content.description}</p>
                        </div>

                        {/* ── Key Takeaways ── */}
                        <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
                            <h3 className="text-base font-bold text-gray-900 mb-3">Key Takeaways</h3>
                            <div className="space-y-2">
                                {content.keyPoints.map((pt, i) => (
                                    <div key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
                                        <FaCheckCircle className="text-blue-600 mt-0.5 flex-shrink-0 w-3.5 h-3.5" />
                                        {pt}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* ── Resources ── */}
                        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                            <h3 className="text-base font-bold text-gray-900 mb-3">Resources</h3>
                            <div className="space-y-2">
                                {content.resources.map((r, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-xl hover:bg-blue-50 transition cursor-pointer group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                                                <FaBook className="text-blue-600 w-3.5 h-3.5" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-800 group-hover:text-blue-700">{r.name}</p>
                                                <p className="text-xs text-gray-400">{r.size}</p>
                                            </div>
                                        </div>
                                        <FaDownload className="text-gray-400 group-hover:text-blue-600 w-4 h-4 transition" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* ── Prev / Next ── */}
                        <div className="flex justify-between gap-3 pb-8">
                            <button
                                onClick={() => prevLesson && goTo(prevLesson.moduleId, prevLesson.lessonId)}
                                disabled={!prevLesson}
                                className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold border transition
                  ${prevLesson ? "border-gray-200 text-gray-700 bg-white hover:bg-gray-50" : "border-gray-100 text-gray-300 bg-gray-50 cursor-not-allowed"}`}
                            >
                                <FaChevronLeft className="w-3 h-3" /> Previous Lesson
                            </button>

                            <button
                                onClick={() => nextLesson && goTo(nextLesson.moduleId, nextLesson.lessonId)}
                                disabled={!nextLesson}
                                className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold border transition
                  ${nextLesson ? "bg-blue-600 border-blue-600 text-white hover:bg-blue-700" : "border-gray-100 text-gray-300 bg-gray-50 cursor-not-allowed"}`}
                            >
                                Next Lesson <FaChevronRight className="w-3 h-3" />
                            </button>
                        </div>

                    </div>
                </div>

                {/* ════ RIGHT SIDEBAR ════ */}
                {sidebarOpen && (
                    <div className="w-80 bg-white border-l border-gray-200 flex-shrink-0 overflow-y-auto hidden lg:block">
                        <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-3 z-10">
                            <h2 className="text-sm font-bold text-gray-900">Course Contents</h2>
                            <p className="text-xs text-gray-400 mt-0.5">{completedCount}/{totalLessons} lessons completed</p>
                            <div className="w-full h-1.5 bg-gray-100 rounded-full mt-2 overflow-hidden">
                                <div className="h-full bg-blue-600 rounded-full transition-all" style={{ width: `${progressPct}%` }} />
                            </div>
                        </div>

                        <div className="py-2">
                            {allModules.map((mod) => {
                                const isExpanded = expandedModules.has(mod.id);
                                const isActiveModule = mod.id === mId;
                                const modCompleted = mod.lessons.filter((l) => completedLessons.has(`${mod.id}-${l.id}`)).length;

                                return (
                                    <div key={mod.id}>
                                        <button
                                            onClick={() => toggleModule(mod.id)}
                                            className={`w-full flex items-center gap-3 px-4 py-3 text-left transition hover:bg-gray-50 ${isActiveModule ? "bg-blue-50" : ""}`}
                                        >
                                            <div
                                                className="w-7 h-7 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
                                                style={{ backgroundColor: mod.color + "20" }}
                                            >
                                                {mod.icon}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-bold text-gray-800 leading-snug truncate">{mod.title}</p>
                                                <p className="text-xs text-gray-400 mt-0.5">{modCompleted}/{mod.lessons.length} completed</p>
                                            </div>
                                            {isExpanded ? <FaChevronUp className="w-3 h-3 text-gray-400 flex-shrink-0" /> : <FaChevronDown className="w-3 h-3 text-gray-400 flex-shrink-0" />}
                                        </button>

                                        {isExpanded && (
                                            <div className="border-t border-gray-50">
                                                {mod.lessons.map((lesson) => {
                                                    const isActive = mod.id === mId && lesson.id === lId;
                                                    const isDone = completedLessons.has(`${mod.id}-${lesson.id}`);

                                                    return (
                                                        <button
                                                            key={lesson.id}
                                                            onClick={() => goTo(mod.id, lesson.id)}
                                                            className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition
                                ${isActive ? "bg-blue-600 text-white" : "hover:bg-gray-50 text-gray-700"}`}
                                                        >
                                                            <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                                                                {isDone ? (
                                                                    <FaCheckCircle className={`w-4 h-4 ${isActive ? "text-white" : "text-green-500"}`} />
                                                                ) : lesson.type === "quiz" ? (
                                                                    <MdOutlineQuiz className={`w-4 h-4 ${isActive ? "text-white" : "text-blue-400"}`} />
                                                                ) : (
                                                                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${isActive ? "border-white" : "border-gray-300"}`}>
                                                                        <FaPlay className={`w-2 h-2 ${isActive ? "text-white" : "text-gray-400"}`} />
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className={`text-xs font-medium leading-snug truncate ${isActive ? "text-white" : ""}`}>{lesson.title}</p>
                                                                <p className={`text-xs mt-0.5 ${isActive ? "text-blue-200" : "text-gray-400"}`}>
                                                                    {lesson.type === "quiz" ? "Quiz" : lesson.duration}
                                                                </p>
                                                            </div>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {progressPct === 100 && (
                            <div className="m-4 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-4 text-white text-center">
                                <FaTrophy className="w-8 h-8 mx-auto mb-2 text-yellow-300" />
                                <p className="font-bold text-sm">Course Complete!</p>
                                <p className="text-xs text-blue-200 mt-1">Your certificate is ready to download.</p>
                                <button className="mt-3 w-full bg-white text-blue-700 text-xs font-bold py-2 rounded-lg hover:bg-blue-50 transition">
                                    Download Certificate
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ModuleLesson;