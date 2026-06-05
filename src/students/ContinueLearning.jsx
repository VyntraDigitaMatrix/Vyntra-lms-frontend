import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import S6 from "../assets/s6.jpg";
import S7 from "../assets/s7.jpg";
import S8 from "../assets/s8.jpg";
import S9 from "../assets/s9.jpg";
import S10 from "../assets/s10.jpg";
import S11 from "../assets/s11.jpg";
import S12 from "../assets/s12.jpg";
import S13 from "../assets/s13.jpg";

import {
    FaStar, FaUser, FaBook, FaClock, FaTrophy,
    FaCheckCircle, FaPlay, FaLinkedin, FaBullhorn,
    FaUsers, FaPenNib, FaGoogle, FaFilter, FaChartLine,
    FaSearch,
    FaKey,
    FaFileAlt,
    FaCogs,
    FaLink,
    FaChartBar,
    FaGlobe,
    FaPenFancy,
    FaImages,
    FaShoppingCart,
    FaEnvelope,
    FaMagnet,
    FaPalette,
    FaBolt,
    FaUserCog,
    FaMailBulk,
    FaCog,
    FaBullseye,
    FaSearchPlus,
    FaTags,
    FaClipboardList,
    FaMapMarkedAlt,
    FaVideo,
    FaCalendarAlt,
    FaSyncAlt,
    FaRobot,
    FaTools,
    FaPlug,
    FaLock,
    FaChevronDown,
    FaChevronUp,
    FaPlayCircle,
} from "react-icons/fa";
import { AiOutlinePlaySquare } from "react-icons/ai";

/* ── helpers to generate lesson lists per module ── */
// Durations are derived deterministically from the lesson index — no Math.random()
// so they never change on re-render.
const FIXED_DURATIONS = [
    "10:24", "14:37", "18:05", "12:50", "16:42",
    "11:18", "19:33", "13:07", "15:55", "17:21",
    "10:48", "14:02", "12:36", "16:14", "18:59",
    "11:43", "13:28", "15:06", "17:39", "19:12",
];

const generateLessons = (moduleTitle, count) => {
    const prefixes = [
        "Introduction to",
        "Understanding",
        "Deep Dive into",
        "Practical Guide to",
        "Advanced",
        "Hands-on",
        "Mastering",
    ];
    const topics = moduleTitle.replace(/Module \d+:\s*/i, "").split(" & ");
    return Array.from({ length: count }, (_, i) => ({
        id: i + 1,
        title: `${prefixes[i % prefixes.length]} ${topics[i % topics.length]}`,
        duration: FIXED_DURATIONS[i % FIXED_DURATIONS.length],
        isPreview: i === 0,
    }));
};

/* ── Course-Specific Data ── */
const coursesData = {
    1: {
        id: 1,
        title: "Digital Marketing",
        badge: "Bestseller",
        image: S6,
        rating: "4.7",
        reviews: "1,250",
        lessons: "28",
        duration: "18h 30m",
        students: "14,200",
        level: "Beginner",
        desc: "Master the complete digital marketing landscape — from brand building to paid ads — and launch your career in the fastest-growing industry.",
        price: "₹999",
        oldPrice: "₹2,499",
        offer: "60% OFF",
        priceValue: 999,
        button: "Continue Learning",
        instructor: {
            name: "Sarah Johnson",
            initial: "S",
            title: "Digital Marketing Strategist",
            rating: "4.8",
            students: "14,200",
            bio: "15+ years in digital marketing. Ex-Google & HubSpot consultant. Built marketing strategies for 200+ brands across FMCG, EdTech, and SaaS verticals. Passionate about making digital skills accessible to everyone.",
        },
        learnings: [
            "Build a complete digital marketing strategy from scratch",
            "Run and optimise paid campaigns across Google & Meta",
            "Understand the customer journey and funnel marketing",
            "Create a personal brand online",
            "Analyse campaign data and improve ROI",
            "Land a digital marketing job or freelance client",
        ],
        modules: [
            { title: "Module 1: Digital Marketing Fundamentals", lessons: 5, color: "#7C3AED", icon: <FaBullhorn className="text-purple-600 text-lg" /> },
            { title: "Module 2: Audience Research & Personas", lessons: 4, color: "#EA580C", icon: <FaUsers className="text-orange-600 text-lg" /> },
            { title: "Module 3: Content Strategy & Copywriting", lessons: 5, color: "#059669", icon: <FaPenNib className="text-green-600 text-lg" /> },
            { title: "Module 4: Paid Advertising (Google & Meta)", lessons: 6, color: "#2563EB", icon: <FaGoogle className="text-blue-600 text-lg" /> },
            { title: "Module 5: Marketing Funnels & CRO", lessons: 4, color: "#DB2777", icon: <FaFilter className="text-pink-600 text-lg" /> },
            { title: "Module 6: Analytics & Reporting", lessons: 4, color: "#D97706", icon: <FaChartLine className="text-amber-600 text-lg" /> },
        ],
        faqs: [
            { q: "Do I need any prior marketing knowledge?", a: "No prior experience needed. This course starts from the very basics and builds up step-by-step." },
            { q: "Will I get a certificate?", a: "Yes, a verified certificate of completion is awarded at the end of the course." },
            { q: "Is the content updated regularly?", a: "Yes, course content is updated quarterly to reflect the latest platform changes and industry trends." },
            { q: "Can I get freelance projects after this course?", a: "Absolutely. Module 6 includes a dedicated section on landing your first freelance client." },
        ],
    },
    2: {
        id: 2,
        title: "SEO Mastery Course",
        badge: "Bestseller",
        image: S8,
        rating: "4.8",
        reviews: "980",
        lessons: "32",
        duration: "22h 10m",
        students: "9,800",
        level: "Intermediate",
        desc: "Go from zero to SEO pro. Learn technical SEO, on-page optimisation, link building, and rank any website on page 1 of Google.",
        price: "₹999",
        oldPrice: "₹2,499",
        offer: "60% OFF",
        priceValue: 999,
        button: "Continue Learning",
        instructor: {
            name: "Alex Thompson",
            initial: "A",
            title: "SEO Consultant & Growth Marketer",
            rating: "4.9",
            students: "9,800",
            bio: "10 years of hands-on SEO experience. Has ranked websites in competitive niches including finance, health, and e-commerce. Ex-Moz contributor and speaker at BrightonSEO. Clients include Fortune 500 companies.",
        },
        learnings: [
            "Conduct in-depth keyword research using Ahrefs & SEMrush",
            "Perform a full technical SEO audit",
            "Optimise on-page elements for maximum rankings",
            "Build high-quality backlinks with white-hat strategies",
            "Understand Google's core algorithm updates",
            "Rank local businesses with Local SEO tactics",
        ],
        modules: [
            { title: "Module 1: SEO Fundamentals & How Google Works", lessons: 4, color: "#7C3AED", icon: <FaSearch className="text-purple-600 text-lg" /> },
            { title: "Module 2: Keyword Research & Search Intent", lessons: 6, color: "#EA580C", icon: <FaKey className="text-orange-600 text-lg" /> },
            { title: "Module 3: On-Page Optimisation", lessons: 6, color: "#059669", icon: <FaFileAlt className="text-green-600 text-lg" /> },
            { title: "Module 4: Technical SEO", lessons: 7, color: "#2563EB", icon: <FaCogs className="text-blue-600 text-lg" /> },
            { title: "Module 5: Link Building & Off-Page SEO", lessons: 5, color: "#DB2777", icon: <FaLink className="text-pink-600 text-lg" /> },
            { title: "Module 6: Tracking & Reporting with GSC & GA4", lessons: 4, color: "#D97706", icon: <FaChartBar className="text-amber-600 text-lg" /> },
        ],
        faqs: [
            { q: "Do I need a website to practice?", a: "It's helpful but not required. We provide sandbox exercises throughout the course." },
            { q: "Which tools are covered?", a: "Ahrefs, SEMrush, Google Search Console, Screaming Frog, and GA4 are all covered in depth." },
            { q: "Is this course updated for the latest Google algorithm?", a: "Yes — the course covers all major updates including Helpful Content, Core Web Vitals, and E-E-A-T." },
            { q: "How long until I see results on my website?", a: "SEO takes time. Most students see measurable improvements within 3–6 months of applying the techniques." },
        ],
    },
    3: {
        id: 3,
        title: "Google Ads for Beginners",
        badge: "New",
        image: S9,
        rating: "4.6",
        reviews: "720",
        lessons: "24",
        duration: "15h 45m",
        students: "6,500",
        level: "Beginner",
        desc: "Launch profitable Google Ads campaigns from day one. Learn Search, Display, Shopping, and YouTube ads with real campaign walkthroughs.",
        price: "₹999",
        oldPrice: "₹2,499",
        offer: "60% OFF",
        priceValue: 999,
        button: "Continue Learning",
        instructor: {
            name: "Michael Smith",
            initial: "M",
            title: "Certified Google Ads Specialist",
            rating: "4.7",
            students: "6,500",
            bio: "Google Certified Partner with $2M+ in ad spend managed. Specialises in helping small businesses compete with big budgets. Trainer at Google's Garage India programme. Known for making PPC simple and results-driven.",
        },
        learnings: [
            "Set up and navigate Google Ads Manager confidently",
            "Create Search, Display, Shopping & YouTube campaigns",
            "Write high-converting ad copy that gets clicks",
            "Use keyword match types and negative keywords strategically",
            "Optimise Quality Score and reduce Cost Per Click",
            "Read campaign reports and make data-driven decisions",
        ],
        modules: [
            { title: "Module 1: Google Ads Ecosystem Overview", lessons: 3, color: "#7C3AED", icon: <FaGlobe className="text-purple-600 text-lg" /> },
            { title: "Module 2: Search Campaigns & Keyword Strategy", lessons: 6, color: "#EA580C", icon: <FaSearch className="text-orange-600 text-lg" /> },
            { title: "Module 3: Ad Copywriting & Extensions", lessons: 4, color: "#059669", icon: <FaPenFancy className="text-green-600 text-lg" /> },
            { title: "Module 4: Display & Remarketing Campaigns", lessons: 4, color: "#2563EB", icon: <FaImages className="text-blue-600 text-lg" /> },
            { title: "Module 5: Shopping & YouTube Ads", lessons: 4, color: "#DB2777", icon: <FaShoppingCart className="text-pink-600 text-lg" /> },
            { title: "Module 6: Bidding, Budgets & Optimisation", lessons: 3, color: "#D97706", icon: <FaChartLine className="text-amber-600 text-lg" /> },
        ],
        faqs: [
            { q: "Do I need a Google Ads account to start?", a: "Yes. We walk you through setting up a free account in the very first lesson." },
            { q: "How much ad budget do I need to practice?", a: "You can start with as little as ₹500/day. We teach you to maximise every rupee." },
            { q: "Will this help me pass the Google Ads certification?", a: "Yes — the course content closely aligns with the official Google Ads certification exam." },
            { q: "Can I use this for my business or only for clients?", a: "Both! Whether you're a business owner or an aspiring PPC manager, this course applies." },
        ],
    },
    4: {
        id: 4,
        title: "Email Marketing Strategy",
        badge: "Bestseller",
        image: S10,
        rating: "4.9",
        reviews: "1,540",
        lessons: "26",
        duration: "16h 20m",
        students: "11,300",
        level: "Beginner",
        desc: "Build, grow, and monetise an email list. Master automation, segmentation, and copywriting to achieve open rates that beat industry averages.",
        price: "₹999",
        oldPrice: "₹2,499",
        offer: "60% OFF",
        priceValue: 999,
        button: "Review Course",
        instructor: {
            name: "Priya Sharma",
            initial: "P",
            title: "Email Marketing & Automation Expert",
            rating: "4.9",
            students: "11,300",
            bio: "Former CRM head at a leading D2C brand. Managed email lists of 500,000+ subscribers. Specialises in lifecycle email marketing, drip sequences, and re-engagement campaigns. Keynote speaker at Email Evolution Conference 2023.",
        },
        learnings: [
            "Build a high-quality email list from scratch using lead magnets",
            "Design beautiful emails that render across all devices",
            "Write subject lines that achieve 40%+ open rates",
            "Set up automated welcome sequences and drip campaigns",
            "Segment your audience for hyper-targeted messaging",
            "Measure and improve deliverability, open rate, and CTR",
        ],
        modules: [
            { title: "Module 1: Email Marketing Fundamentals", lessons: 4, color: "#7C3AED", icon: <FaEnvelope className="text-purple-600 text-lg" /> },
            { title: "Module 2: List Building & Lead Magnets", lessons: 5, color: "#EA580C", icon: <FaMagnet className="text-orange-600 text-lg" /> },
            { title: "Module 3: Email Design & Copywriting", lessons: 5, color: "#059669", icon: <FaPalette className="text-green-600 text-lg" /> },
            { title: "Module 4: Automation & Drip Sequences", lessons: 6, color: "#2563EB", icon: <FaBolt className="text-blue-600 text-lg" /> },
            { title: "Module 5: Segmentation & Personalisation", lessons: 4, color: "#DB2777", icon: <FaUserCog className="text-pink-600 text-lg" /> },
            { title: "Module 6: Analytics, A/B Testing & Deliverability", lessons: 2, color: "#D97706", icon: <FaMailBulk className="text-amber-600 text-lg" /> },
        ],
        faqs: [
            { q: "Which email platforms are covered?", a: "Mailchimp, Klaviyo, and ConvertKit are covered in detail with hands-on walkthroughs." },
            { q: "Is email marketing still relevant?", a: "Absolutely. Email has the highest ROI of any marketing channel — $42 for every $1 spent on average." },
            { q: "Can I use this for an e-commerce store?", a: "Yes! Module 5 has a dedicated section on e-commerce email flows including abandoned cart and post-purchase sequences." },
            { q: "Will I learn how to avoid the spam folder?", a: "Yes — Module 6 covers deliverability best practices in depth." },
        ],
    },
    5: {
        id: 5,
        title: "Social Media Marketing",
        badge: "Trending",
        image: S7,
        rating: "4.7",
        reviews: "1,100",
        lessons: "30",
        duration: "20h 00m",
        students: "13,000",
        level: "Beginner",
        desc: "Grow brands on Instagram, LinkedIn, YouTube, and X. Learn content creation, community management, and organic growth strategies that actually work.",
        price: "₹999",
        oldPrice: "₹2,499",
        offer: "60% OFF",
        priceValue: 999,
        button: "Continue Learning",
        instructor: {
            name: "Neha Patel",
            initial: "N",
            title: "Social Media Strategist & Content Creator",
            rating: "4.8",
            students: "13,000",
            bio: "Built multiple brand accounts from 0 to 100K followers. Social media consultant for startups and public figures. Her Instagram growth framework has been featured in YourStory and Inc42. 7 years of hands-on experience.",
        },
        learnings: [
            "Develop a platform-specific social media strategy",
            "Create scroll-stopping content for Reels, Shorts, and Carousels",
            "Grow an organic following using hashtags and trends",
            "Manage brand communities and handle crises professionally",
            "Collaborate with influencers and run UGC campaigns",
            "Measure social performance with native analytics tools",
        ],
        modules: [
            { title: "Module 1: Social Media Strategy Foundations", lessons: 4, color: "#7C3AED", icon: "📱" },
            { title: "Module 2: Instagram & Reels Mastery", lessons: 6, color: "#EA580C", icon: "📸" },
            { title: "Module 3: LinkedIn for B2B Growth", lessons: 5, color: "#059669", icon: "💼" },
            { title: "Module 4: YouTube & Short-Form Video", lessons: 6, color: "#2563EB", icon: "▶️" },
            { title: "Module 5: Community Management & Influencers", lessons: 5, color: "#DB2777", icon: "🤝" },
            { title: "Module 6: Analytics & Growth Hacking", lessons: 4, color: "#D97706", icon: "🚀" },
        ],
        faqs: [
            { q: "Do I need expensive equipment for content creation?", a: "No. We teach you how to create professional content with just a smartphone." },
            { q: "Is this course focused on organic growth only?", a: "Primarily yes, but we also cover paid social fundamentals in Module 6." },
            { q: "Which platforms are covered?", a: "Instagram, LinkedIn, YouTube, X (Twitter), and a brief overview of Pinterest and Threads." },
            { q: "How quickly can I grow my account?", a: "With consistent application, most students see meaningful growth within 60–90 days." },
        ],
    },
    6: {
        id: 6,
        title: "Web Analytics with GA4",
        badge: "New",
        image: S11,
        rating: "4.6",
        reviews: "430",
        lessons: "22",
        duration: "14h 30m",
        students: "4,200",
        level: "Intermediate",
        desc: "Unlock the full power of Google Analytics 4. Track user behaviour, set up conversions, build custom reports, and make decisions backed by real data.",
        price: "₹999",
        oldPrice: "₹2,499",
        offer: "60% OFF",
        priceValue: 999,
        button: "Start Learning",
        instructor: {
            name: "David Wilson",
            initial: "D",
            title: "Data Analytics & GA4 Specialist",
            rating: "4.7",
            students: "4,200",
            bio: "Analytics consultant for e-commerce and SaaS companies. Migrated 80+ clients from Universal Analytics to GA4. Certified in Google Analytics, Tag Manager, and Looker Studio. Contributor to Analytics Mania blog.",
        },
        learnings: [
            "Set up GA4 from scratch and configure data streams",
            "Understand sessions, users, events, and the GA4 data model",
            "Create custom events and conversions",
            "Build insightful reports and explorations",
            "Connect GA4 with Google Tag Manager",
            "Integrate GA4 data into Looker Studio dashboards",
        ],
        modules: [
            { title: "Module 1: Introduction to GA4 & the Data Model", lessons: 4, color: "#7C3AED", icon: <FaChartBar className="text-purple-600 text-lg" /> },
            { title: "Module 2: GA4 Setup & Configuration", lessons: 4, color: "#EA580C", icon: <FaCog className="text-orange-600 text-lg" /> },
            { title: "Module 3: Events, Conversions & Goals", lessons: 5, color: "#059669", icon: <FaBullseye className="text-green-600 text-lg" /> },
            { title: "Module 4: Reports, Explorations & Funnels", lessons: 4, color: "#2563EB", icon: <FaSearchPlus className="text-blue-600 text-lg" /> },
            { title: "Module 5: Google Tag Manager Integration", lessons: 3, color: "#DB2777", icon: <FaTags className="text-pink-600 text-lg" /> },
            { title: "Module 6: Looker Studio Dashboards", lessons: 2, color: "#D97706", icon: <FaClipboardList className="text-amber-600 text-lg" /> },
        ],
        faqs: [
            { q: "Is GA4 replacing Universal Analytics?", a: "Yes. Universal Analytics was sunset in July 2023. GA4 is the current standard — this course prepares you fully." },
            { q: "Do I need Google Tag Manager knowledge?", a: "No. Module 5 teaches GTM from scratch specifically for GA4 integration." },
            { q: "Will I learn how to set up e-commerce tracking?", a: "Yes — enhanced e-commerce tracking is covered in Module 3." },
            { q: "Is coding knowledge required?", a: "Basic HTML familiarity helps but is not required. All technical steps are explained clearly." },
        ],
    },
    7: {
        id: 7,
        title: "Content Marketing Basics",
        badge: "Bestseller",
        image: S12,
        rating: "4.8",
        reviews: "890",
        lessons: "25",
        duration: "17h 00m",
        students: "8,700",
        level: "Beginner",
        desc: "Create content that ranks, resonates, and converts. Learn blogging, video scripts, social content, and how to build a content engine for any brand.",
        price: "₹999",
        oldPrice: "₹2,499",
        offer: "60% OFF",
        priceValue: 999,
        button: "Review Course",
        instructor: {
            name: "Anjali Mehta",
            initial: "A",
            title: "Content Strategist & Brand Storyteller",
            rating: "4.8",
            students: "8,700",
            bio: "10 years creating content for startups and Fortune 500 brands. Former Content Head at a leading EdTech unicorn. Her content frameworks have generated 5M+ organic visits. Mentor at Google's Women Techmakers programme.",
        },
        learnings: [
            "Build a content marketing strategy aligned to business goals",
            "Write long-form blog posts that rank on Google",
            "Script and storyboard YouTube and social videos",
            "Create content calendars and editorial workflows",
            "Repurpose content across multiple channels efficiently",
            "Measure content performance with the right KPIs",
        ],
        modules: [
            { title: "Module 1: Content Strategy & Audience Mapping", lessons: 4, color: "#7C3AED", icon: <FaMapMarkedAlt className="text-purple-600 text-lg" /> },
            { title: "Module 2: Blogging & Long-Form Writing", lessons: 5, color: "#EA580C", icon: <FaPenFancy className="text-orange-600 text-lg" /> },
            { title: "Module 3: Video Scripts & Storytelling", lessons: 5, color: "#059669", icon: <FaVideo className="text-green-600 text-lg" /> },
            { title: "Module 4: Content Calendar & Workflow", lessons: 4, color: "#2563EB", icon: <FaCalendarAlt className="text-blue-600 text-lg" /> },
            { title: "Module 5: Content Distribution & Repurposing", lessons: 4, color: "#DB2777", icon: <FaSyncAlt className="text-pink-600 text-lg" /> },
            { title: "Module 6: Measuring & Scaling Content", lessons: 3, color: "#D97706", icon: <FaChartLine className="text-amber-600 text-lg" /> },
        ],
        faqs: [
            { q: "Do I need to be a good writer to take this course?", a: "Not at all. We teach writing from scratch with practical frameworks and templates." },
            { q: "Is this course for individuals or marketing teams?", a: "Both. The content calendar and workflow modules are especially useful for teams." },
            { q: "Will I learn SEO writing?", a: "Yes — Module 2 covers keyword-optimised writing and on-page SEO specifically for blog content." },
            { q: "Do I get content templates?", a: "Yes, you get 15+ ready-to-use templates including blog outlines, video scripts, and content calendars." },
        ],
    },
    8: {
        id: 8,
        title: "Marketing Automation",
        badge: "Advanced",
        image: S13,
        rating: "4.7",
        reviews: "560",
        lessons: "28",
        duration: "19h 45m",
        students: "5,100",
        level: "Advanced",
        desc: "Automate your marketing at scale. Master HubSpot, Zapier, and CRM workflows to nurture leads, retain customers, and grow revenue on autopilot.",
        price: "₹999",
        oldPrice: "₹2,499",
        offer: "60% OFF",
        priceValue: 999,
        button: "Start Learning",
        instructor: {
            name: "Kiran Rao",
            initial: "K",
            title: "Marketing Automation & CRM Expert",
            rating: "4.8",
            students: "5,100",
            bio: "HubSpot Platinum Partner and certified CRM consultant. Has implemented automation systems for 100+ B2B and B2C companies. Previously VP of Marketing at a Series B SaaS startup. Speaks at MarTech conferences across Asia.",
        },
        learnings: [
            "Design end-to-end marketing automation workflows",
            "Set up HubSpot CRM and marketing hub from scratch",
            "Build lead scoring models to prioritise sales outreach",
            "Create multi-step drip campaigns triggered by user behaviour",
            "Connect tools using Zapier and API integrations",
            "Measure automation ROI and optimise workflows over time",
        ],
        modules: [
            { title: "Module 1: Marketing Automation Fundamentals", lessons: 4, color: "#7C3AED", icon: <FaRobot className="text-purple-600 text-lg" /> },
            { title: "Module 2: HubSpot CRM Setup & Configuration", lessons: 5, color: "#EA580C", icon: <FaTools className="text-orange-600 text-lg" /> },
            { title: "Module 3: Lead Scoring & Nurture Workflows", lessons: 5, color: "#059669", icon: <FaBullseye className="text-green-600 text-lg" /> },
            { title: "Module 4: Behavioural Triggers & Drip Campaigns", lessons: 6, color: "#2563EB", icon: <FaBolt className="text-blue-600 text-lg" /> },
            { title: "Module 5: Zapier & Tool Integrations", lessons: 5, color: "#DB2777", icon: <FaPlug className="text-pink-600 text-lg" /> },
            { title: "Module 6: Reporting, Optimisation & Scaling", lessons: 3, color: "#D97706", icon: <FaChartLine className="text-amber-600 text-lg" /> },
        ],
        faqs: [
            { q: "Which tools are covered?", a: "HubSpot (primary), Zapier, ActiveCampaign, and Mailchimp automation are all covered." },
            { q: "Do I need prior CRM experience?", a: "Basic familiarity with email marketing is helpful, but the course starts with CRM fundamentals." },
            { q: "Is HubSpot free or paid?", a: "HubSpot has a free tier which is sufficient for all exercises in this course. No paid subscription needed." },
            { q: "Will this help me get a marketing operations job?", a: "Yes — marketing automation is one of the highest-paying digital marketing specialisations, and this course prepares you for MOps roles." },
        ],
    },
};

/* ══════════════════════════════════════════════
   MODULE ACCORDION ITEM
   ══════════════════════════════════════════════ */
const FREE_MODULES = 2; // first N modules are free

const ModuleAccordionItem = ({ mod, index, courseId, navigate, activeLesson, setActiveLesson }) => {
    const [open, setOpen] = useState(false);
    const isFree = index < FREE_MODULES;
    // useMemo keeps lessons (and durations) stable across re-renders
    const lessons = React.useMemo(() => generateLessons(mod.title, mod.lessons), [mod.title, mod.lessons]);

    const handleLessonClick = (lessonIndex) => {
        if (!isFree) return;
        const lessonKey = `${index + 1}-${lessonIndex + 1}`;
        setActiveLesson(lessonKey);
        navigate(`/student/course/${courseId}/module/${index + 1}/lesson/${lessonIndex + 1}`);
    };

    return (
        <div
            className={`border rounded-xl overflow-hidden transition-all duration-200 ${
                open ? "border-blue-200 shadow-sm" : "border-gray-100"
            } bg-white`}
        >
            {/* ── Module Header ── */}
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 transition text-left"
            >
                {/* icon */}
                <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-lg flex-shrink-0"
                    style={{ backgroundColor: mod.color + "18" }}
                >
                    {mod.icon}
                </div>

                {/* title + meta */}
                <div className="flex-1 min-w-0">
                    <span className="text-sm font-semibold text-gray-800 block truncate">{mod.title}</span>
                    <span className="text-xs text-gray-400">{mod.lessons} Lessons</span>
                </div>

                {/* free / lock badge */}
                {isFree ? (
                    <span className="text-xs font-bold bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded-full flex-shrink-0">
                        Free
                    </span>
                ) : (
                    <span className="text-xs font-bold bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full flex items-center gap-1 flex-shrink-0">
                        <FaLock className="text-[10px]" /> Premium
                    </span>
                )}

                {/* chevron */}
                <span className="ml-2 text-gray-400 flex-shrink-0">
                    {open ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
                </span>
            </button>

            {/* ── Lesson List (dropdown) ── */}
            {open && (
                <div className="border-t border-gray-100">
                    {lessons.map((lesson, li) => {
                        const lessonKey = `${index + 1}-${li + 1}`;
                        const isActive = activeLesson === lessonKey;
                        return (
                        <div
                            key={li}
                            onClick={() => handleLessonClick(li)}
                            className={`flex items-center gap-3 px-5 py-2.5 transition-colors ${
                                isFree ? "cursor-pointer group" : "cursor-not-allowed opacity-60"
                            } ${isActive ? "bg-blue-50 border-l-2 border-blue-500" : isFree ? "hover:bg-blue-50" : ""} ${
                                li !== lessons.length - 1 ? "border-b border-gray-50" : ""
                            }`}
                        >
                            {/* play / lock icon */}
                            <div className="w-7 h-7 flex-shrink-0 flex items-center justify-center">
                                {isFree ? (
                                    <FaPlayCircle
                                        className={`transition-colors ${isActive ? "text-blue-600" : "text-blue-400 group-hover:text-blue-600"}`}
                                        size={16}
                                    />
                                ) : (
                                    <FaLock className="text-gray-300" size={13} />
                                )}
                            </div>

                            {/* lesson title */}
                            <span
                                className={`flex-1 text-xs truncate ${
                                    isActive
                                        ? "text-blue-700 font-semibold"
                                        : isFree
                                        ? "text-gray-700 font-medium group-hover:text-blue-700"
                                        : "text-gray-400 font-medium"
                                }`}
                            >
                                {`${li + 1}. ${lesson.title}`}
                            </span>

                            {/* preview badge */}
                            {lesson.isPreview && isFree && (
                                <span className="text-[10px] font-semibold bg-blue-100 text-blue-500 px-1.5 py-0.5 rounded flex-shrink-0">
                                    Preview
                                </span>
                            )}

                            {/* duration */}
                            <span className={`text-[11px] flex-shrink-0 ml-1 ${isActive ? "text-blue-500" : "text-gray-400"}`}>
                                {lesson.duration}
                            </span>
                        </div>
                        );
                    })}

                    {/* upsell banner for locked modules */}
                    {!isFree && (
                        <div className="flex items-center gap-2 px-5 py-3 bg-amber-50 border-t border-amber-100">
                            <FaLock className="text-amber-400 flex-shrink-0" size={13} />
                            <p className="text-xs text-amber-700 font-medium flex-1">
                                Enrol in the full course to unlock this module.
                            </p>
                            <button className="text-xs bg-amber-400 hover:bg-amber-500 text-white font-bold px-3 py-1 rounded-lg transition-colors flex-shrink-0">
                                Enrol Now
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

/* ══════════════════════════════════════════════
   CURRICULUM SECTION (shared between tabs)
   ══════════════════════════════════════════════ */
const CurriculumSection = ({ moduleList, courseId, navigate }) => {
    const [activeLesson, setActiveLesson] = useState(null);

    return (
    <div>
        {/* free-access notice */}
        <div className="flex items-start gap-2 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 mb-4">
            <FaPlayCircle className="text-blue-500 mt-0.5 flex-shrink-0" size={15} />
            <p className="text-xs text-blue-700">
                <span className="font-bold">Free Preview: </span>
                The first 2 modules are available for free. Enrol to unlock all {moduleList.length} modules.
            </p>
        </div>

        <div className="space-y-2">
            {moduleList.map((mod, i) => (
                <ModuleAccordionItem
                    key={i}
                    mod={mod}
                    index={i}
                    courseId={courseId}
                    navigate={navigate}
                    activeLesson={activeLesson}
                    setActiveLesson={setActiveLesson}
                />
            ))}
        </div>
    </div>
    );
};

/* ══════════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════════ */
const ContinueLearning = () => {
    const [rating, setRating] = useState(0);
    const [reviews, setReviews] = useState([
        { name: "Rajesh Kumar", initial: "R", rating: 5, time: "2 weeks ago", text: "Excellent course! Very detailed and practical examples." },
        { name: "Priya Sharma", initial: "P", rating: 4, time: "1 month ago", text: "Great content, very helpful for my career." },
        { name: "Amit Patel", initial: "A", rating: 5, time: "2 months ago", text: "Best course I've taken! Highly recommend." },
    ]);
    const [newReview, setNewReview] = useState({ name: "", rating: 5, text: "" });
    const navigate = useNavigate();
    const { courseId } = useParams();
    const course = coursesData[courseId] || coursesData[1];

    const [activeTab, setActiveTab] = useState("overview");
    const [timeLeft, setTimeLeft] = useState({ days: 2, hours: 15, minutes: 48, seconds: 36 });

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
                if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
                if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
                if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
                return prev;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const handleRatingSubmit = (r) => {
        alert(`Thank you for rating ${r} stars!`);
    };

    const handleReviewSubmit = () => {
        if (!newReview.name || !newReview.text) return;
        setReviews([
            {
                name: newReview.name,
                initial: newReview.name.charAt(0).toUpperCase(),
                rating: newReview.rating,
                time: "Just now",
                text: newReview.text,
            },
            ...reviews,
        ]);
        setNewReview({ name: "", rating: 5, text: "" });
    };

    const tabs = [
        { key: "overview", label: "Overview" },
        { key: "curriculum", label: "Curriculum" },
        { key: "instructor", label: "Instructor" },
        { key: "reviews", label: `Reviews (${course.reviews})` },
        { key: "faqs", label: "FAQs" },
    ];

    const moduleList = course.modules || [];

    return (
        <div className="min-h-screen bg-[#f6f7fb] p-5">
            <div className="max-w-7xl mx-auto">

                <div className="flex items-start justify-between mb-5">
                    <div>
                        <p className="text-sm text-gray-400 mb-1">
                            <Link to="/student/courses" className="hover:text-blue-600 transition-colors">My Courses</Link>
                            <span className="text-gray-300"> &gt; </span>
                            <span className="text-gray-700 font-medium">{course.title}</span>
                        </p>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 items-start">

                    {/* ══ LEFT COLUMN ══ */}
                    <div className="flex-1 min-w-0 space-y-6">

                        {/* Hero Row */}
                        <div className="flex flex-col sm:flex-row gap-6">
                            <div className="relative w-full sm:w-72 h-48 rounded-2xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
                                <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                    <FaPlay className="text-white w-8 h-8" />
                                </div>
                            </div>

                            <div className="flex-1 space-y-4">
                                <div>
                                    <span className="inline-block text-xs font-bold bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full mb-2">{course.badge}</span>
                                    <h1 className="text-xl font-extrabold text-gray-900 leading-tight mb-2">{course.title}</h1>
                                    <p className="text-sm text-gray-500">{course.desc}</p>
                                </div>

                                <div className="flex flex-wrap items-center gap-5 text-sm text-gray-600">
                                    <div className="flex items-center gap-1">
                                        <FaStar className="w-4 h-4 text-yellow-400" />
                                        <span className="font-bold text-gray-900">{course.rating}</span>
                                        <span className="text-gray-400">({course.reviews} ratings)</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-gray-500">
                                        <FaUser className="w-4 h-4" />
                                        <span>{course.students} Students Enrolled</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-gray-500">
                                        <span className="w-2 h-2 rounded-full bg-gray-400 inline-block" />
                                        <span>{course.level} Level</span>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-1">
                                    {[
                                        { Icon: FaBook, text: `${course.lessons} Lessons` },
                                        { Icon: AiOutlinePlaySquare, text: `${moduleList.length} Modules` },
                                        { Icon: FaClock, text: `${course.duration}` },
                                        { Icon: FaTrophy, text: "Certificate" },
                                    ].map(({ Icon, text }, i) => (
                                        <div key={i} className="flex items-center gap-1.5 border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-medium text-gray-600 bg-white">
                                            <span className="text-gray-400"><Icon /></span>
                                            {text}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="border-b border-gray-200">
                            <div className="flex overflow-x-auto">
                                {tabs.map(({ key, label }) => (
                                    <button
                                        key={key}
                                        onClick={() => setActiveTab(key)}
                                        className={`relative px-5 pb-3 pt-1 text-sm font-semibold whitespace-nowrap transition-colors ${activeTab === key ? "text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
                                    >
                                        {label}
                                        {activeTab === key && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Tab Panels */}
                        <div>

                            {/* OVERVIEW */}
                            {activeTab === "overview" && (
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 mb-3">About this course</h3>
                                        <p className="text-sm text-gray-600 leading-relaxed mb-5">{course.desc}</p>
                                        <h4 className="text-sm font-bold text-gray-900 mb-3">What you'll learn</h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2.5 gap-x-6">
                                            {course.learnings.map((item, i) => (
                                                <div key={i} className="flex items-start gap-2 text-sm text-gray-700">
                                                    <FaCheckCircle className="text-blue-600 mt-0.5 flex-shrink-0" />
                                                    {item}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 mb-4">Course Curriculum</h3>
                                        <CurriculumSection moduleList={moduleList} courseId={course.id} navigate={navigate} />
                                    </div>
                                </div>
                            )}

                            {/* CURRICULUM */}
                            {activeTab === "curriculum" && (
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-4">Course Curriculum</h3>
                                    <CurriculumSection moduleList={moduleList} courseId={course.id} navigate={navigate} />
                                </div>
                            )}

                            {/* INSTRUCTOR */}
                            {activeTab === "instructor" && (
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-4">About the Instructor</h3>
                                    <div className="flex gap-4 p-5 bg-blue-50 rounded-2xl">
                                        <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                                            {course.instructor.initial}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 text-base">{course.instructor.name}</h4>
                                            <p className="text-sm text-blue-600 mb-3">{course.instructor.title}</p>
                                            <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                                                <span className="flex items-center gap-1"><FaStar className="w-3 h-3 text-yellow-400" /> {course.instructor.rating} Rating</span>
                                                <span className="flex items-center gap-1"><FaUser className="w-3 h-3" /> {course.instructor.students} Students</span>
                                            </div>
                                            <p className="text-sm text-gray-600 leading-relaxed">{course.instructor.bio}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* REVIEWS */}
                            {activeTab === "reviews" && (
                                <div>
                                    <div className="flex items-center gap-8 p-5 bg-amber-50 border border-amber-100 rounded-2xl mb-6">
                                        <div className="text-center">
                                            <div className="text-5xl font-extrabold text-gray-900 leading-none">{course.rating}</div>
                                            <div className="flex justify-center mt-2 mb-1">
                                                {[1, 2, 3, 4, 5].map(s => <FaStar key={s} className="w-4 h-4 text-yellow-400" />)}
                                            </div>
                                            <div className="text-xs text-gray-400">Course Rating</div>
                                        </div>
                                        <div className="flex-1 space-y-1.5">
                                            {[5, 4, 3, 2, 1].map(s => (
                                                <div key={s} className="flex items-center gap-2">
                                                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                        <div className="h-full bg-yellow-400 rounded-full" style={{ width: s === 5 ? "70%" : s === 4 ? "20%" : s === 3 ? "6%" : "3%" }} />
                                                    </div>
                                                    <div className="flex gap-0.5 w-16 justify-end">
                                                        {Array(s).fill(0).map((_, i) => <FaStar key={i} className="w-3 h-3 text-yellow-400" />)}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
                                        <h3 className="text-lg font-bold text-gray-900 mb-2">Rate this Course</h3>
                                        <p className="text-sm text-gray-500 mb-5">How would you rate your learning experience?</p>
                                        <div className="flex items-center gap-2 mb-5">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button key={star} onClick={() => setRating(star)} className="transition-transform hover:scale-110">
                                                    <FaStar size={32} className={star <= rating ? "text-yellow-400" : "text-gray-300"} />
                                                </button>
                                            ))}
                                        </div>
                                        <button onClick={() => handleRatingSubmit(rating)} disabled={!rating} className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300">
                                            Submit Rating
                                        </button>
                                    </div>

                                    <div className="divide-y divide-gray-100">
                                        {reviews.map((r, i) => (
                                            <div key={i} className="py-5">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm flex-shrink-0">
                                                        {r.initial}
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-sm text-gray-900">{r.name}</div>
                                                        <div className="flex items-center gap-2 mt-0.5">
                                                            <div className="flex gap-0.5">
                                                                {Array(5).fill(0).map((_, j) => (
                                                                    <svg key={j} viewBox="0 0 24 24" fill={j < r.rating ? "#FBBF24" : "#E5E7EB"} className="w-3 h-3">
                                                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                                                    </svg>
                                                                ))}
                                                            </div>
                                                            <span className="text-xs text-gray-400">{r.time}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <p className="text-sm text-gray-600 pl-12">{r.text}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* FAQs */}
                            {activeTab === "faqs" && (
                                <div className="space-y-3">
                                    {course.faqs.map((faq, i) => (
                                        <div key={i} className="border border-gray-200 rounded-xl p-4 bg-white">
                                            <div className="font-semibold text-sm text-gray-900 mb-1.5">{faq.q}</div>
                                            <p className="text-sm text-gray-600">{faq.a}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContinueLearning;