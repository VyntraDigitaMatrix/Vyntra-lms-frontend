import React, { useState, useRef, useEffect, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { studentEnrolledCourseApi } from "./auth/api";
import {
    FaPlay, FaCheckCircle, FaChevronLeft, FaChevronRight,
    FaChevronDown, FaChevronUp, FaClock, FaBook, FaTrophy,
    FaDownload, FaListUl, FaBullhorn, FaBullseye, FaPenNib,
    FaMoneyBillWave, FaSignal, FaFilter, FaClipboardList,
    FaUpload, FaStar, FaLightbulb, FaPaperclip, FaCheck,
    FaTimes, FaRedo, FaLock, FaHourglassHalf, FaStickyNote,
    FaTrash, FaPlus, FaPen, FaHighlighter, FaBold, FaItalic,
    FaUnderline, FaListUl as FaListUlIcon, FaListOl, FaSave,
    FaExpand, FaCompress, FaThumbtack, FaEdit
} from "react-icons/fa";
import { AiOutlinePlaySquare } from "react-icons/ai";
import { MdOutlineQuiz, MdAssignment, MdInfoOutline, MdCloudUpload } from "react-icons/md";

/* ══════════════════════════════════════════════════════════════
   QUIZ DATA — keyed by courseId → moduleId
══════════════════════════════════════════════════════════════ */
const quizData = {
    1: {
        1: {
            title: "Module 1 Quiz — Digital Marketing Fundamentals",
            questions: [
                { id: 1, question: "Which of the following is NOT a digital marketing channel?", options: ["Search Engine Optimisation (SEO)", "Television Advertising", "Pay-Per-Click (PPC) Ads", "Email Marketing"], correct: 1, explanation: "Television advertising is a traditional (offline) marketing channel, not a digital one." },
                { id: 2, question: "What does 'CTR' stand for in digital marketing?", options: ["Cost To Reach", "Click-Through Rate", "Customer Targeting Ratio", "Conversion Tracking Report"], correct: 1, explanation: "CTR (Click-Through Rate) measures how often people click on an ad or link relative to total impressions." },
                { id: 3, question: "Which SMART goal component asks: 'Can we actually achieve this with our resources?'", options: ["Specific", "Measurable", "Achievable", "Time-bound"], correct: 2, explanation: "The 'A' in SMART stands for Achievable — your goal must be realistic given your budget, team and timeframe." },
                { id: 4, question: "A brand gains 10,000 website visits and 200 purchases. What is the conversion rate?", options: ["0.2%", "2%", "20%", "50%"], correct: 1, explanation: "Conversion rate = (Conversions / Visits) × 100 = (200 / 10,000) × 100 = 2%." },
                { id: 5, question: "What is the primary advantage of digital marketing over traditional marketing?", options: ["Higher production costs", "Precise targeting and measurable results", "Wider reach with no internet connection", "Guaranteed offline visibility"], correct: 1, explanation: "Digital marketing allows precise audience targeting and real-time performance measurement — impossible with most traditional methods." },
            ]
        },
        2: {
            title: "Module 2 Quiz — Audience Research & Personas",
            questions: [
                { id: 1, question: "A buyer persona is best described as:", options: ["A real customer profile taken from your CRM", "A semi-fictional representation of your ideal customer", "A legal document about your target audience", "A competitor analysis report"], correct: 1, explanation: "Buyer personas are research-backed, semi-fictional archetypes representing segments of your ideal audience." },
                { id: 2, question: "Which stage of the customer journey is someone in if they are comparing product reviews?", options: ["Awareness", "Consideration", "Decision", "Retention"], correct: 1, explanation: "During the Consideration stage, prospects actively research and compare options before making a purchase decision." },
                { id: 3, question: "Which of these is a psychographic attribute?", options: ["Age 25–34", "Lives in Mumbai", "Values sustainability", "Female"], correct: 2, explanation: "Psychographics cover values, attitudes and lifestyles — unlike demographics which cover age, gender and location." },
                { id: 4, question: "Customer journey mapping is used to:", options: ["Track GPS locations of customers", "Visualise every touchpoint a customer has with a brand", "Calculate the cost per acquisition", "Map out your website's sitemap"], correct: 1, explanation: "Journey maps visualise all interactions a customer has with a brand — from first awareness through to post-purchase." },
                { id: 5, question: "Which tool is commonly used for primary audience research?", options: ["Google Search Console", "Surveys and interviews", "Google Ads Manager", "HubSpot workflows"], correct: 1, explanation: "Primary research (surveys, interviews, focus groups) gathers first-hand data directly from your target audience." },
            ]
        },
        3: {
            title: "Module 3 Quiz — Content Strategy & Copywriting",
            questions: [
                { id: 1, question: "What is a content pillar?", options: ["A technical SEO term for page hierarchy", "A core topic your brand creates content around", "A type of email newsletter format", "A paid advertising strategy"], correct: 1, explanation: "Content pillars are broad themes or topics that anchor your content strategy and reflect your brand's expertise." },
                { id: 2, question: "The acronym AIDA in copywriting stands for:", options: ["Attract, Interest, Desire, Action", "Awareness, Intent, Decision, Acquisition", "Attention, Interest, Desire, Action", "Authority, Influence, Data, Analysis"], correct: 2, explanation: "AIDA (Attention, Interest, Desire, Action) is a classic copywriting framework guiding readers from discovery to conversion." },
                { id: 3, question: "Which headline technique uses a specific number to attract readers?", options: ["Question headline", "How-to headline", "Listicle headline", "Command headline"], correct: 2, explanation: "Listicle headlines ('7 Ways to...', '10 Tips for...') use specific numbers to set expectations and improve click-through rates." },
                { id: 4, question: "A content calendar is primarily used to:", options: ["Schedule social media ads budgets", "Plan, organise and schedule content publication", "Track competitor content rankings", "Automate email sends"], correct: 1, explanation: "Content calendars help teams plan topics, formats, publishing dates and owners across all content channels." },
                { id: 5, question: "Which CTA (call to action) is most likely to convert?", options: ["Click here", "Submit", "Get Your Free 7-Day Trial", "Learn More"], correct: 2, explanation: "Specific, benefit-led CTAs like 'Get Your Free 7-Day Trial' outperform vague labels by communicating clear value." },
            ]
        },
        4: {
            title: "Module 4 Quiz — Paid Advertising",
            questions: [
                { id: 1, question: "What does CPM stand for in paid advertising?", options: ["Cost Per Month", "Cost Per Mille (per 1,000 impressions)", "Clicks Per Minute", "Campaign Performance Metric"], correct: 1, explanation: "CPM = Cost Per Mille, meaning the cost for every 1,000 ad impressions — a common metric in display advertising." },
                { id: 2, question: "In Google Ads, which match type shows your ad only for searches that are very close variations of your exact keyword?", options: ["Broad match", "Phrase match", "Exact match", "Negative match"], correct: 2, explanation: "Exact match shows ads for searches identical or very close to your keyword, giving you the most control over targeting." },
                { id: 3, question: "A lookalike audience is:", options: ["People who look like your existing customers demographically", "A custom audience based on website visitors", "People similar to your existing customers found by the platform's algorithm", "Retargeted users from your email list"], correct: 2, explanation: "Platforms like Meta use machine learning to find new users who share characteristics with your best existing customers." },
                { id: 4, question: "What is the primary purpose of retargeting ads?", options: ["Reach cold audiences who've never heard of your brand", "Re-engage users who've previously interacted with your brand", "Promote organic content to paid audiences", "Test new creative for awareness campaigns"], correct: 1, explanation: "Retargeting reconnects with warm audiences — people who visited your site, viewed products or engaged with your content." },
                { id: 5, question: "If your ad spend is £500 and you generate £2,500 in revenue, what is your ROAS?", options: ["5x", "2x", "0.5x", "500%"], correct: 0, explanation: "ROAS = Revenue ÷ Ad Spend = £2,500 ÷ £500 = 5x. For every £1 spent, you generated £5 in revenue." },
            ]
        },
        5: {
            title: "Module 5 Quiz — Marketing Funnels & CRO",
            questions: [
                { id: 1, question: "Which funnel stage targets prospects who are aware of a problem but not yet considering a solution?", options: ["Middle of Funnel (MOFU)", "Bottom of Funnel (BOFU)", "Top of Funnel (TOFU)", "Post-purchase"], correct: 2, explanation: "TOFU content (blogs, videos, social posts) targets broad audiences at the awareness stage before they're solution-aware." },
                { id: 2, question: "CRO stands for:", options: ["Customer Retention Optimisation", "Conversion Rate Optimisation", "Content Reach Output", "Click Revenue Objective"], correct: 1, explanation: "CRO (Conversion Rate Optimisation) is the process of increasing the percentage of users who complete desired actions." },
                { id: 3, question: "In an A/B test, what is the 'control'?", options: ["The new variant being tested", "The original version you're testing against", "The statistical significance threshold", "The winning variation"], correct: 1, explanation: "The control is the original, unchanged version — you compare the new variant (B) against it to determine which performs better." },
                { id: 4, question: "Which landing page element typically has the HIGHEST impact on conversion rate?", options: ["Footer navigation links", "The headline and primary CTA", "Social media follow buttons", "Cookie consent banner"], correct: 1, explanation: "The headline and primary CTA communicate value and direct action — they are the most critical conversion elements on any page." },
                { id: 5, question: "Statistical significance in A/B testing means:", options: ["The test ran for more than 2 weeks", "You're confident the result isn't due to random chance", "Variant B always outperforms the control", "The sample size exceeded 1,000"], correct: 1, explanation: "Statistical significance (typically 95%+) means you can be confident the observed difference is a real effect, not random variation." },
            ]
        },
        6: {
            title: "Final Assessment — Analytics & Reporting",
            questions: [
                { id: 1, question: "GA4 uses which data model to track user behaviour?", options: ["Session-based model", "Pageview-based model", "Event-based model", "Cookie-based model"], correct: 2, explanation: "GA4 records all interactions as events (page_view, scroll, click, etc.) rather than sessions, enabling more flexible analysis." },
                { id: 2, question: "What does a 'bounce rate' measure in website analytics?", options: ["Pages with slow load times", "Percentage of sessions where users viewed only one page", "Number of failed transactions", "Exit rate from checkout pages"], correct: 1, explanation: "Bounce rate = % of sessions where the user left without interacting further. High bounce rates can indicate poor page relevance." },
                { id: 3, question: "Which KPI measures the total revenue generated for every pound spent on marketing?", options: ["CTR", "ROAS", "CPA", "CPM"], correct: 1, explanation: "ROAS (Return on Ad Spend) = Revenue ÷ Ad Spend. It's the primary measure of advertising profitability." },
                { id: 4, question: "UTM parameters are used to:", options: ["Speed up website load time", "Track the source and campaign of website traffic", "Improve SEO rankings", "Encrypt user data in analytics"], correct: 1, explanation: "UTM parameters (utm_source, utm_medium, utm_campaign) tag URLs so analytics tools can attribute traffic to specific campaigns." },
                { id: 5, question: "If your CPA target is £20 and your current CPA is £35, what should you do?", options: ["Increase your ad budget immediately", "Pause all campaigns", "Optimise targeting, creative or landing pages to reduce cost", "Switch to CPM bidding"], correct: 2, explanation: "When CPA exceeds target, optimise the campaign — test better audiences, ad creative, landing pages or bidding strategies." },
            ]
        },
    },
};

const getGenericQuiz = (courseId, moduleId, allModules) => {
    const mod = allModules[moduleId - 1];
    const modName = mod?.title?.split(": ")[1] || "this module";
    return {
        title: `Module ${moduleId} Quiz — ${modName}`,
        questions: [
            { id: 1, question: `What is the primary goal of ${modName}?`, options: ["To increase ad spend", "To build a sustainable, measurable strategy", "To reduce website traffic", "To eliminate competitor brands"], correct: 1, explanation: `${modName} is designed to help you build practical, results-driven skills that deliver measurable outcomes.` },
            { id: 2, question: "Which metric is most important when measuring the success of a campaign?", options: ["Number of likes", "KPIs aligned to your stated business goal", "Total impressions only", "Follower count"], correct: 1, explanation: "The right metric depends on your goal — always measure against KPIs that directly reflect your campaign objectives." },
            { id: 3, question: "What does 'testing and iteration' mean in a marketing context?", options: ["Sending surveys to your team", "Continuously running A/B experiments to improve performance", "Testing software before launch", "Iterating on your logo design"], correct: 1, explanation: "Testing and iteration means running structured experiments, learning from data and continually improving your campaigns." },
            { id: 4, question: "Why is audience segmentation important?", options: ["It reduces your overall marketing budget to zero", "It allows you to tailor messaging to specific groups for higher relevance", "It is only relevant for large enterprise brands", "It replaces the need for content creation"], correct: 1, explanation: "Segmentation lets you personalise messages for specific audience groups, significantly improving engagement and conversion." },
            { id: 5, question: "Which approach leads to the best long-term marketing results?", options: ["Focusing only on short-term wins", "Balancing brand building with performance marketing", "Maximising paid spend with no organic strategy", "Avoiding data analysis"], correct: 1, explanation: "A balanced approach — combining brand awareness with performance campaigns — drives sustainable, compounding results over time." },
        ]
    };
};

/* ══════════════════════════════════════════════════════════════
   ASSIGNMENT DATA
══════════════════════════════════════════════════════════════ */
const assignmentData = {
    1: {
        1: { title: "Digital Marketing Audit", brief: "Choose any brand (or your own project) and conduct a mini digital marketing audit. Analyse their presence across at least 3 channels and identify 3 strengths and 3 opportunities for improvement.", objectives: ["Identify and evaluate digital marketing channels in use", "Apply the channel overview framework from Lesson 3", "Set at least 2 SMART marketing goals for the brand"], deliverables: ["PDF or Google Doc report (500–800 words)", "Optional: slide deck summary (max 6 slides)"], rubric: [{ criterion: "Channel Analysis", marks: 30 }, { criterion: "SMART Goal Setting", marks: 25 }, { criterion: "Insight Quality", marks: 25 }, { criterion: "Presentation & Clarity", marks: 20 }] },
        2: { title: "Build a Buyer Persona", brief: "Create a detailed buyer persona for a product or service of your choice. Use primary or secondary research to back up your assumptions and map their customer journey from awareness to purchase.", objectives: ["Define demographic, psychographic and behavioural attributes", "Document the customer journey across all key touchpoints", "Identify pain points and motivations at each stage"], deliverables: ["Persona one-pager (template provided)", "Customer journey map (diagram or table)"], rubric: [{ criterion: "Persona Depth & Accuracy", marks: 35 }, { criterion: "Journey Map Coverage", marks: 30 }, { criterion: "Research Quality", marks: 20 }, { criterion: "Visual Presentation", marks: 15 }] },
        3: { title: "Content Strategy Brief", brief: "Write a content strategy brief for a brand of your choice. Include audience insights, a content pillar framework, 5 sample content ideas with headlines, and a 4-week content calendar outline.", objectives: ["Define content pillars aligned to audience needs", "Write 5 compelling headline variations using module techniques", "Create a realistic 4-week content calendar"], deliverables: ["Strategy brief (Google Doc or PDF)", "Content calendar (spreadsheet or Notion table)"], rubric: [{ criterion: "Content Pillar Framework", marks: 30 }, { criterion: "Headline Quality", marks: 25 }, { criterion: "Calendar Practicality", marks: 25 }, { criterion: "Writing & Clarity", marks: 20 }] },
        4: { title: "Paid Ad Campaign Plan", brief: "Design a full paid advertising campaign plan for a product launch. Include Google Search and one Meta campaign, with ad copy, targeting, budget split and KPIs for a £1,000/month hypothetical budget.", objectives: ["Structure a Google Search campaign with ad groups and keywords", "Write 2 responsive search ads per ad group", "Define a Meta audience with targeting rationale"], deliverables: ["Campaign plan document", "2 ad copy examples per platform", "Budget allocation table"], rubric: [{ criterion: "Campaign Structure", marks: 30 }, { criterion: "Ad Copy Quality", marks: 30 }, { criterion: "Budget & KPI Planning", marks: 25 }, { criterion: "Targeting Rationale", marks: 15 }] },
        5: { title: "Landing Page CRO Review", brief: "Choose a live landing page and perform a Conversion Rate Optimisation audit. Propose an A/B test hypothesis with a clear control and variant, and predict the expected impact.", objectives: ["Apply the marketing funnel framework to identify drop-off points", "Audit the landing page against CRO best practices", "Formulate a testable A/B hypothesis with measurable KPIs"], deliverables: ["Written audit report (400–600 words)", "A/B test hypothesis document"], rubric: [{ criterion: "Funnel Analysis", marks: 30 }, { criterion: "CRO Audit Depth", marks: 30 }, { criterion: "A/B Hypothesis Quality", marks: 25 }, { criterion: "Clarity of Recommendations", marks: 15 }] },
        6: { title: "Analytics Dashboard Report", brief: "Using GA4 (your own account or a demo account), pull a 30-day performance report. Build a simple dashboard and write a 300-word executive summary with actionable recommendations.", objectives: ["Configure and navigate GA4 standard reports", "Identify at least 3 meaningful KPIs and interpret the data", "Present findings clearly in a visual dashboard"], deliverables: ["Dashboard screenshot or shared link", "Executive summary (PDF or Doc)"], rubric: [{ criterion: "Data Accuracy & Coverage", marks: 30 }, { criterion: "Insight Quality", marks: 30 }, { criterion: "Dashboard Clarity", marks: 25 }, { criterion: "Recommendations", marks: 15 }] },
    },
};

const getGenericAssignment = (moduleId, allModules) => {
    const mod = allModules[moduleId - 1];
    const modName = mod?.title?.split(": ")[1] || "this module";
    return {
        title: `${modName} — Practical Assignment`,
        brief: `Apply the key concepts from ${modName} to a real or hypothetical brand of your choice. You will research, plan and present a professional deliverable that demonstrates your understanding of the module's core frameworks and techniques.`,
        objectives: [`Demonstrate practical understanding of the core ${modName} concepts`, "Apply at least two frameworks or tools introduced in this module", "Present findings clearly with data-backed recommendations"],
        deliverables: ["Written report or presentation (PDF/Google Doc)", "Supporting data, charts or diagrams where relevant"],
        rubric: [{ criterion: "Concept Application", marks: 35 }, { criterion: "Research & Analysis Quality", marks: 30 }, { criterion: "Recommendations", marks: 20 }, { criterion: "Clarity & Presentation", marks: 15 }],
    };
};

/* ══════════════════════════════════════════════════════════════
   MODULE DATA
══════════════════════════════════════════════════════════════ */
const rawCourseModulesData = {
    1: [
        { id: 1, title: "Module 1: Digital Marketing Fundamentals", icon: <FaBullhorn className="text-violet-600 text-lg" />, color: "#7C3AED", lessons: [{ id: 1, title: "What is Digital Marketing?", duration: "08:32", type: "video", completed: true }, { id: 2, title: "Traditional vs Digital Marketing", duration: "11:14", type: "video", completed: true }, { id: 3, title: "Key Channels Overview", duration: "09:45", type: "video", completed: false }, { id: 4, title: "Setting Your Marketing Goals", duration: "07:20", type: "video", completed: false }] },
        { id: 2, title: "Module 2: Audience Research & Personas", icon: <FaBullseye className="text-orange-600 text-lg" />, color: "#EA580C", lessons: [{ id: 1, title: "Understanding Your Target Audience", duration: "10:20", type: "video", completed: false }, { id: 2, title: "Building Buyer Personas", duration: "12:05", type: "video", completed: false }, { id: 3, title: "Customer Journey Mapping", duration: "09:15", type: "video", completed: false }] },
        { id: 3, title: "Module 3: Content Strategy & Copywriting", icon: <FaPenNib className="text-green-600 text-lg" />, color: "#059669", lessons: [{ id: 1, title: "Content Strategy Essentials", duration: "11:30", type: "video", completed: false }, { id: 2, title: "Writing Compelling Copy", duration: "13:45", type: "video", completed: false }, { id: 3, title: "Headlines & CTAs That Convert", duration: "08:50", type: "video", completed: false }, { id: 4, title: "Content Calendar Planning", duration: "10:10", type: "video", completed: false }] },
        { id: 4, title: "Module 4: Paid Advertising (Google & Meta)", icon: <FaMoneyBillWave className="text-blue-600 text-lg" />, color: "#2563EB", lessons: [{ id: 1, title: "Introduction to Paid Ads", duration: "09:00", type: "video", completed: false }, { id: 2, title: "Google Search Campaigns", duration: "14:20", type: "video", completed: false }, { id: 3, title: "Meta (Facebook & Instagram) Ads", duration: "15:00", type: "video", completed: false }, { id: 4, title: "Ad Budgeting & Bidding Strategies", duration: "11:30", type: "video", completed: false }, { id: 5, title: "Retargeting & Lookalike Audiences", duration: "10:45", type: "video", completed: false }] },
        { id: 5, title: "Module 5: Marketing Funnels & CRO", icon: <FaFilter className="text-orange-600" />, color: "#DB2777", lessons: [{ id: 1, title: "Understanding the Marketing Funnel", duration: "10:00", type: "video", completed: false }, { id: 2, title: "Landing Page Optimisation", duration: "12:30", type: "video", completed: false }, { id: 3, title: "A/B Testing Fundamentals", duration: "09:45", type: "video", completed: false }] },
        { id: 6, title: "Module 6: Analytics & Reporting", icon: <FaSignal className="text-orange-600 text-lg" />, color: "#D97706", lessons: [{ id: 1, title: "Google Analytics 4 Basics", duration: "13:10", type: "video", completed: false }, { id: 2, title: "Reading Campaign Reports", duration: "10:20", type: "video", completed: false }, { id: 3, title: "KPIs & ROI Measurement", duration: "09:00", type: "video", completed: false }] },
    ],
    2: [
        { id: 1, title: "Module 1: SEO Fundamentals & How Google Works", icon: "🔍", color: "#7C3AED", lessons: [{ id: 1, title: "How Search Engines Work", duration: "10:05", type: "video", completed: true }, { id: 2, title: "Google's Ranking Factors", duration: "12:20", type: "video", completed: false }, { id: 3, title: "White Hat vs Black Hat SEO", duration: "08:45", type: "video", completed: false }] },
        { id: 2, title: "Module 2: Keyword Research & Search Intent", icon: "🗝️", color: "#EA580C", lessons: [{ id: 1, title: "What is Keyword Research?", duration: "09:30", type: "video", completed: false }, { id: 2, title: "Using Ahrefs & SEMrush", duration: "14:00", type: "video", completed: false }, { id: 3, title: "Understanding Search Intent", duration: "11:15", type: "video", completed: false }, { id: 4, title: "Long-Tail vs Short-Tail Keywords", duration: "08:30", type: "video", completed: false }] },
        { id: 3, title: "Module 3: On-Page Optimisation", icon: "📄", color: "#059669", lessons: [{ id: 1, title: "Title Tags & Meta Descriptions", duration: "09:00", type: "video", completed: false }, { id: 2, title: "Header Tags & Content Structure", duration: "10:30", type: "video", completed: false }, { id: 3, title: "Internal Linking Strategy", duration: "08:45", type: "video", completed: false }, { id: 4, title: "Image Optimisation & Alt Text", duration: "07:20", type: "video", completed: false }] },
        { id: 4, title: "Module 4: Technical SEO", icon: "⚙️", color: "#2563EB", lessons: [{ id: 1, title: "Site Speed & Core Web Vitals", duration: "13:00", type: "video", completed: false }, { id: 2, title: "Crawlability & Indexation", duration: "10:15", type: "video", completed: false }, { id: 3, title: "XML Sitemaps & Robots.txt", duration: "08:30", type: "video", completed: false }] },
        { id: 5, title: "Module 5: Link Building & Off-Page SEO", icon: "🔗", color: "#DB2777", lessons: [{ id: 1, title: "Why Backlinks Matter", duration: "09:10", type: "video", completed: false }, { id: 2, title: "Guest Posting Strategy", duration: "11:30", type: "video", completed: false }, { id: 3, title: "Digital PR & Outreach", duration: "12:00", type: "video", completed: false }] },
        { id: 6, title: "Module 6: Tracking & Reporting with GSC & GA4", icon: "📊", color: "#D97706", lessons: [{ id: 1, title: "Google Search Console Setup", duration: "10:00", type: "video", completed: false }, { id: 2, title: "Reading GSC Reports", duration: "11:15", type: "video", completed: false }, { id: 3, title: "GA4 for SEO Insights", duration: "12:30", type: "video", completed: false }] },
    ],
    3: [
        { id: 1, title: "Module 1: Google Ads Ecosystem Overview", icon: "🌐", color: "#7C3AED", lessons: [{ id: 1, title: "How Google Ads Works", duration: "09:00", type: "video", completed: false }, { id: 2, title: "Campaign Types Overview", duration: "10:30", type: "video", completed: false }, { id: 3, title: "Setting Up Your Account", duration: "08:15", type: "video", completed: false }] },
        { id: 2, title: "Module 2: Search Campaigns & Keyword Strategy", icon: "🔎", color: "#EA580C", lessons: [{ id: 1, title: "Keyword Match Types Explained", duration: "11:00", type: "video", completed: false }, { id: 2, title: "Building Your Keyword List", duration: "13:30", type: "video", completed: false }, { id: 3, title: "Negative Keywords Strategy", duration: "09:45", type: "video", completed: false }] },
        { id: 3, title: "Module 3: Ad Copywriting & Extensions", icon: "✍️", color: "#059669", lessons: [{ id: 1, title: "Writing Responsive Search Ads", duration: "10:30", type: "video", completed: false }, { id: 2, title: "Ad Extensions Deep Dive", duration: "09:00", type: "video", completed: false }, { id: 3, title: "A/B Testing Your Ads", duration: "08:30", type: "video", completed: false }] },
        { id: 4, title: "Module 4: Display & Remarketing Campaigns", icon: "🖼️", color: "#2563EB", lessons: [{ id: 1, title: "Google Display Network Basics", duration: "11:00", type: "video", completed: false }, { id: 2, title: "Audience Targeting Options", duration: "10:30", type: "video", completed: false }, { id: 3, title: "Setting Up Remarketing Lists", duration: "12:15", type: "video", completed: false }] },
        { id: 5, title: "Module 5: Shopping & YouTube Ads", icon: "🛒", color: "#DB2777", lessons: [{ id: 1, title: "Google Shopping Campaigns Setup", duration: "13:00", type: "video", completed: false }, { id: 2, title: "Product Feed Optimisation", duration: "10:00", type: "video", completed: false }, { id: 3, title: "YouTube In-Stream Ads", duration: "11:30", type: "video", completed: false }] },
        { id: 6, title: "Module 6: Bidding, Budgets & Optimisation", icon: "💹", color: "#D97706", lessons: [{ id: 1, title: "Manual vs Smart Bidding", duration: "10:00", type: "video", completed: false }, { id: 2, title: "Budget Allocation Strategies", duration: "09:15", type: "video", completed: false }] },
    ],
    4: [
        { id: 1, title: "Module 1: Email Marketing Fundamentals", icon: "✉️", color: "#7C3AED", lessons: [{ id: 1, title: "Why Email Marketing Still Wins", duration: "08:00", type: "video", completed: true }, { id: 2, title: "Types of Marketing Emails", duration: "10:30", type: "video", completed: false }, { id: 3, title: "Choosing the Right ESP", duration: "09:15", type: "video", completed: false }] },
        { id: 2, title: "Module 2: List Building & Lead Magnets", icon: "🧲", color: "#EA580C", lessons: [{ id: 1, title: "What is a Lead Magnet?", duration: "09:00", type: "video", completed: false }, { id: 2, title: "Creating High-Converting Opt-In Forms", duration: "11:30", type: "video", completed: false }, { id: 3, title: "Landing Page Best Practices", duration: "10:45", type: "video", completed: false }] },
        { id: 3, title: "Module 3: Email Design & Copywriting", icon: "🎨", color: "#059669", lessons: [{ id: 1, title: "Email Design Principles", duration: "11:00", type: "video", completed: false }, { id: 2, title: "Subject Lines That Get Opens", duration: "10:15", type: "video", completed: false }, { id: 3, title: "Writing the Perfect Email Body", duration: "13:00", type: "video", completed: false }] },
        { id: 4, title: "Module 4: Automation & Drip Sequences", icon: "⚡", color: "#2563EB", lessons: [{ id: 1, title: "Welcome Sequence Setup", duration: "12:30", type: "video", completed: false }, { id: 2, title: "Nurture Drip Campaigns", duration: "13:00", type: "video", completed: false }, { id: 3, title: "Re-Engagement Campaigns", duration: "10:00", type: "video", completed: false }] },
        { id: 5, title: "Module 5: Segmentation & Personalisation", icon: "👤", color: "#DB2777", lessons: [{ id: 1, title: "List Segmentation Strategies", duration: "10:30", type: "video", completed: false }, { id: 2, title: "Dynamic Content & Personalisation", duration: "11:45", type: "video", completed: false }, { id: 3, title: "Behavioural Triggers", duration: "10:00", type: "video", completed: false }] },
        { id: 6, title: "Module 6: Analytics, A/B Testing & Deliverability", icon: "📬", color: "#D97706", lessons: [{ id: 1, title: "Key Email Metrics Explained", duration: "09:00", type: "video", completed: false }, { id: 2, title: "A/B Testing Emails", duration: "10:30", type: "video", completed: false }] },
    ],
    5: [
        { id: 1, title: "Module 1: Social Media Strategy Foundations", icon: "📱", color: "#7C3AED", lessons: [{ id: 1, title: "Building a Social Media Strategy", duration: "10:00", type: "video", completed: true }, { id: 2, title: "Choosing the Right Platforms", duration: "08:30", type: "video", completed: false }, { id: 3, title: "Brand Voice & Tone on Social", duration: "09:15", type: "video", completed: false }] },
        { id: 2, title: "Module 2: Instagram & Reels Mastery", icon: "📸", color: "#EA580C", lessons: [{ id: 1, title: "Optimising Your Instagram Profile", duration: "09:00", type: "video", completed: false }, { id: 2, title: "Creating High-Performing Reels", duration: "13:30", type: "video", completed: false }, { id: 3, title: "Carousel & Story Strategies", duration: "10:45", type: "video", completed: false }] },
        { id: 3, title: "Module 3: LinkedIn for B2B Growth", icon: "💼", color: "#059669", lessons: [{ id: 1, title: "LinkedIn Profile Optimisation", duration: "10:00", type: "video", completed: false }, { id: 2, title: "Content Strategy for LinkedIn", duration: "11:30", type: "video", completed: false }, { id: 3, title: "LinkedIn Company Pages", duration: "09:15", type: "video", completed: false }] },
        { id: 4, title: "Module 4: YouTube & Short-Form Video", icon: "▶️", color: "#2563EB", lessons: [{ id: 1, title: "YouTube Channel Setup & SEO", duration: "12:00", type: "video", completed: false }, { id: 2, title: "Scripting & Filming Tips", duration: "13:30", type: "video", completed: false }, { id: 3, title: "YouTube Shorts Strategy", duration: "09:00", type: "video", completed: false }] },
        { id: 5, title: "Module 5: Community Management & Influencers", icon: "🤝", color: "#DB2777", lessons: [{ id: 1, title: "Building an Engaged Community", duration: "10:30", type: "video", completed: false }, { id: 2, title: "Handling Negative Comments & Crises", duration: "09:45", type: "video", completed: false }, { id: 3, title: "Influencer Marketing 101", duration: "12:00", type: "video", completed: false }] },
        { id: 6, title: "Module 6: Analytics & Growth Hacking", icon: "🚀", color: "#D97706", lessons: [{ id: 1, title: "Social Media KPIs & Metrics", duration: "09:30", type: "video", completed: false }, { id: 2, title: "Growth Hacking Tactics", duration: "11:00", type: "video", completed: false }, { id: 3, title: "Using Native Analytics Tools", duration: "10:15", type: "video", completed: false }] },
    ],
    6: [
        { id: 1, title: "Module 1: Introduction to GA4 & the Data Model", icon: "📊", color: "#7C3AED", lessons: [{ id: 1, title: "GA4 vs Universal Analytics", duration: "10:00", type: "video", completed: false }, { id: 2, title: "Understanding the Event-Based Model", duration: "11:30", type: "video", completed: false }, { id: 3, title: "Key Dimensions & Metrics", duration: "09:15", type: "video", completed: false }] },
        { id: 2, title: "Module 2: GA4 Setup & Configuration", icon: "⚙️", color: "#EA580C", lessons: [{ id: 1, title: "Creating a GA4 Property", duration: "08:30", type: "video", completed: false }, { id: 2, title: "Connecting Data Streams", duration: "10:00", type: "video", completed: false }, { id: 3, title: "User Roles & Permissions", duration: "07:45", type: "video", completed: false }] },
        { id: 3, title: "Module 3: Events, Conversions & Goals", icon: "🎯", color: "#059669", lessons: [{ id: 1, title: "Automatic vs Custom Events", duration: "11:00", type: "video", completed: false }, { id: 2, title: "Setting Up Conversion Events", duration: "10:30", type: "video", completed: false }, { id: 3, title: "Enhanced E-Commerce Tracking", duration: "13:00", type: "video", completed: false }] },
        { id: 4, title: "Module 4: Reports, Explorations & Funnels", icon: "🔬", color: "#2563EB", lessons: [{ id: 1, title: "Standard Reports Overview", duration: "10:00", type: "video", completed: false }, { id: 2, title: "Exploration Reports Deep Dive", duration: "12:30", type: "video", completed: false }, { id: 3, title: "Funnel Exploration & Path Analysis", duration: "11:15", type: "video", completed: false }] },
        { id: 5, title: "Module 5: Google Tag Manager Integration", icon: "🏷️", color: "#DB2777", lessons: [{ id: 1, title: "GTM Basics for GA4", duration: "11:00", type: "video", completed: false }, { id: 2, title: "Creating Tags & Triggers", duration: "12:30", type: "video", completed: false }] },
        { id: 6, title: "Module 6: Looker Studio Dashboards", icon: "📋", color: "#D97706", lessons: [{ id: 1, title: "Connecting GA4 to Looker Studio", duration: "10:00", type: "video", completed: false }, { id: 2, title: "Building Your First Dashboard", duration: "12:00", type: "video", completed: false }] },
    ],
    7: [
        { id: 1, title: "Module 1: Content Strategy & Audience Mapping", icon: "🗺️", color: "#7C3AED", lessons: [{ id: 1, title: "What is a Content Strategy?", duration: "09:00", type: "video", completed: true }, { id: 2, title: "Mapping Content to the Buyer Journey", duration: "11:00", type: "video", completed: false }, { id: 3, title: "Audience Research for Content", duration: "10:15", type: "video", completed: false }] },
        { id: 2, title: "Module 2: Blogging & Long-Form Writing", icon: "📝", color: "#EA580C", lessons: [{ id: 1, title: "Anatomy of a Great Blog Post", duration: "12:00", type: "video", completed: false }, { id: 2, title: "SEO Writing Fundamentals", duration: "13:30", type: "video", completed: false }, { id: 3, title: "Writing Headlines That Work", duration: "08:45", type: "video", completed: false }] },
        { id: 3, title: "Module 3: Video Scripts & Storytelling", icon: "🎬", color: "#059669", lessons: [{ id: 1, title: "Storytelling Frameworks", duration: "10:30", type: "video", completed: false }, { id: 2, title: "Writing a YouTube Script", duration: "12:00", type: "video", completed: false }, { id: 3, title: "Short-Form Video Scripting", duration: "09:00", type: "video", completed: false }] },
        { id: 4, title: "Module 4: Content Calendar & Workflow", icon: "📅", color: "#2563EB", lessons: [{ id: 1, title: "Building Your Content Calendar", duration: "11:00", type: "video", completed: false }, { id: 2, title: "Editorial Workflows for Teams", duration: "10:30", type: "video", completed: false }, { id: 3, title: "Content Batching Strategies", duration: "09:15", type: "video", completed: false }] },
        { id: 5, title: "Module 5: Content Distribution & Repurposing", icon: "🔄", color: "#DB2777", lessons: [{ id: 1, title: "Owned, Earned & Paid Distribution", duration: "10:00", type: "video", completed: false }, { id: 2, title: "Repurposing Content Across Channels", duration: "11:30", type: "video", completed: false }, { id: 3, title: "Content Syndication", duration: "08:45", type: "video", completed: false }] },
        { id: 6, title: "Module 6: Measuring & Scaling Content", icon: "📈", color: "#D97706", lessons: [{ id: 1, title: "Content KPIs & Analytics", duration: "10:30", type: "video", completed: false }, { id: 2, title: "Scaling Your Content Operation", duration: "11:00", type: "video", completed: false }] },
    ],
    8: [
        { id: 1, title: "Module 1: Marketing Automation Fundamentals", icon: "🤖", color: "#7C3AED", lessons: [{ id: 1, title: "What is Marketing Automation?", duration: "09:30", type: "video", completed: false }, { id: 2, title: "The MarTech Stack Explained", duration: "11:00", type: "video", completed: false }, { id: 3, title: "Automation Use Cases by Industry", duration: "10:15", type: "video", completed: false }] },
        { id: 2, title: "Module 2: HubSpot CRM Setup & Configuration", icon: "🏗️", color: "#EA580C", lessons: [{ id: 1, title: "HubSpot Account Setup", duration: "10:00", type: "video", completed: false }, { id: 2, title: "Contacts, Companies & Deals", duration: "12:30", type: "video", completed: false }, { id: 3, title: "Pipelines & Deal Stages", duration: "11:00", type: "video", completed: false }] },
        { id: 3, title: "Module 3: Lead Scoring & Nurture Workflows", icon: "🎯", color: "#059669", lessons: [{ id: 1, title: "Building a Lead Scoring Model", duration: "12:00", type: "video", completed: false }, { id: 2, title: "Creating Nurture Workflows in HubSpot", duration: "13:30", type: "video", completed: false }, { id: 3, title: "MQL vs SQL — When to Hand Off to Sales", duration: "09:45", type: "video", completed: false }] },
        { id: 4, title: "Module 4: Behavioural Triggers & Drip Campaigns", icon: "⚡", color: "#2563EB", lessons: [{ id: 1, title: "Trigger-Based Automation Explained", duration: "10:30", type: "video", completed: false }, { id: 2, title: "Building Multi-Step Drip Campaigns", duration: "13:00", type: "video", completed: false }, { id: 3, title: "Time-Based vs Behaviour-Based Triggers", duration: "11:15", type: "video", completed: false }] },
        { id: 5, title: "Module 5: Zapier & Tool Integrations", icon: "🔌", color: "#DB2777", lessons: [{ id: 1, title: "Zapier Basics & Zap Structure", duration: "10:00", type: "video", completed: false }, { id: 2, title: "Connecting HubSpot with Other Tools", duration: "12:30", type: "video", completed: false }, { id: 3, title: "Multi-Step Zap Workflows", duration: "11:00", type: "video", completed: false }] },
        { id: 6, title: "Module 6: Reporting, Optimisation & Scaling", icon: "📊", color: "#D97706", lessons: [{ id: 1, title: "Automation ROI Measurement", duration: "10:00", type: "video", completed: false }, { id: 2, title: "Optimising Underperforming Workflows", duration: "11:30", type: "video", completed: false }] },
    ],
};

const buildModules = (modules) =>
    modules.map((mod) => ({
        ...mod,
        lessons: [
            ...mod.lessons,
            { id: mod.lessons.length + 1, title: `Module ${mod.id} Quiz`, duration: "5 Qs", type: "quiz", completed: false },
            { id: mod.lessons.length + 2, title: `Module ${mod.id} Assignment`, duration: "Submit", type: "assignment", completed: false },
        ],
    }));

const courseModulesData = Object.fromEntries(
    Object.entries(rawCourseModulesData).map(([k, v]) => [k, buildModules(v)])
);

const getContent = (moduleId, lessonId, allModules) => {
    const mod = allModules[moduleId - 1];
    const lesson = mod?.lessons[lessonId - 1];
    return {
        title: lesson?.title || "Lesson",
        description: `This lesson covers "${lesson?.title || "key concepts"}" as part of ${mod?.title || "this module"}. Watch the video carefully and use the key takeaways below to guide your learning.`,
        keyPoints: [
            "Follow along with the video at your own pace",
            "Note down any terms or concepts you want to revisit",
            "Complete the module quiz to test your understanding",
            "Download the resources below for additional study material",
        ],
        resources: [{ name: `${lesson?.title || "Lesson"} Notes (PDF)`, size: "600 KB" }],
    };
};

/* ══════════════════════════════════════════════════════════════
   NOTE COLORS CONFIG
══════════════════════════════════════════════════════════════ */
const NOTE_COLORS = [
    { bg: "bg-yellow-50", border: "border-yellow-200", dot: "bg-yellow-400", label: "Yellow" },
    { bg: "bg-blue-50", border: "border-blue-200", dot: "bg-blue-400", label: "Blue" },
    { bg: "bg-green-50", border: "border-green-200", dot: "bg-green-400", label: "Green" },
    { bg: "bg-pink-50", border: "border-pink-200", dot: "bg-pink-400", label: "Pink" },
    { bg: "bg-purple-50", border: "border-purple-200", dot: "bg-purple-400", label: "Purple" },
];

/* ══════════════════════════════════════════════════════════════
   TAKE NOTES PANEL COMPONENT
══════════════════════════════════════════════════════════════ */
const TakeNotesPanel = ({ lessonId, lessonTitle, onClose }) => {
    const [notes, setNotes] = useState(() => {
        try { return JSON.parse(localStorage.getItem(`notes_${lessonId}`) || "[]"); } catch { return []; }
    });
    const [activeNoteId, setActiveNoteId] = useState(null);
    const [draftText, setDraftText] = useState("");
    const [draftColor, setDraftColor] = useState(0);
    const [draftTitle, setDraftTitle] = useState("");
    const [isExpanded, setIsExpanded] = useState(false);
    const [savedFlash, setSavedFlash] = useState(false);
    const textareaRef = useRef(null);

    const activeNote = notes.find(n => n.id === activeNoteId);

    useEffect(() => {
        try { localStorage.setItem(`notes_${lessonId}`, JSON.stringify(notes)); } catch {}
    }, [notes, lessonId]);

    useEffect(() => {
        if (textareaRef.current) textareaRef.current.focus();
    }, [activeNoteId]);

    const createNote = () => {
        const newNote = {
            id: Date.now(),
            title: `Note ${notes.length + 1}`,
            text: "",
            color: 0,
            createdAt: new Date().toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }),
            pinned: false,
        };
        setNotes(prev => [newNote, ...prev]);
        setActiveNoteId(newNote.id);
        setDraftText("");
        setDraftTitle(newNote.title);
        setDraftColor(0);
    };

    const openNote = (note) => {
        setActiveNoteId(note.id);
        setDraftText(note.text);
        setDraftTitle(note.title);
        setDraftColor(note.color);
    };

    const saveNote = () => {
        if (!activeNoteId) return;
        setNotes(prev => prev.map(n => n.id === activeNoteId ? { ...n, text: draftText, title: draftTitle || n.title, color: draftColor } : n));
        setSavedFlash(true);
        setTimeout(() => setSavedFlash(false), 1500);
    };

    const deleteNote = (id) => {
        setNotes(prev => prev.filter(n => n.id !== id));
        if (activeNoteId === id) { setActiveNoteId(null); setDraftText(""); setDraftTitle(""); }
    };

    const togglePin = (id) => {
        setNotes(prev => prev.map(n => n.id === id ? { ...n, pinned: !n.pinned } : n));
    };

    const insertFormat = (type) => {
        const ta = textareaRef.current;
        if (!ta) return;
        const start = ta.selectionStart, end = ta.selectionEnd;
        const sel = draftText.slice(start, end);
        let ins = "";
        if (type === "bold") ins = `**${sel || "bold text"}**`;
        if (type === "italic") ins = `_${sel || "italic text"}_`;
        if (type === "underline") ins = `__${sel || "underline text"}__`;
        if (type === "bullet") ins = `\n• ${sel || "item"}`;
        if (type === "number") ins = `\n1. ${sel || "item"}`;
        if (type === "highlight") ins = `==${sel || "highlighted"}==`;
        const newText = draftText.slice(0, start) + ins + draftText.slice(end);
        setDraftText(newText);
        setTimeout(() => { ta.selectionStart = ta.selectionEnd = start + ins.length; ta.focus(); }, 0);
    };

    const sortedNotes = [...notes].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));

    const panelClass = isExpanded
        ? "fixed inset-4 z-50 bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden"
        : "fixed bottom-0 right-0 w-full sm:w-[420px] h-[70vh] sm:h-[75vh] z-50 bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl border border-gray-200 sm:bottom-4 sm:right-4 flex flex-col overflow-hidden";

    return (
        <>
            {/* Backdrop for mobile */}
            <div className="fixed inset-0 bg-black/20 z-40 sm:hidden" onClick={onClose} />

            <div className={panelClass}>
                {/* Header */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-t-2xl flex-shrink-0">
                    <FaStickyNote className="text-white text-sm" />
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-black text-white leading-none">My Notes</p>
                        <p className="text-[10px] text-blue-200 truncate mt-0.5">{lessonTitle}</p>
                    </div>
                    <div className="flex items-center gap-1">
                        <button onClick={() => setIsExpanded(v => !v)} className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/20 text-white hover:bg-white/30 transition text-xs">
                            {isExpanded ? <FaCompress /> : <FaExpand />}
                        </button>
                        <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/20 text-white hover:bg-white/30 transition text-xs">
                            <FaTimes />
                        </button>
                    </div>
                </div>

                <div className="flex flex-1 overflow-hidden">
                    {/* Notes List Sidebar */}
                    <div className="w-36 sm:w-44 border-r border-gray-100 flex flex-col bg-gray-50 flex-shrink-0">
                        <div className="px-2.5 py-2 border-b border-gray-100">
                            <button onClick={createNote}
                                className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition">
                                <FaPlus className="text-[9px]" /> New Note
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto py-1.5 space-y-1 px-1.5">
                            {sortedNotes.length === 0 && (
                                <div className="text-center py-8 px-2">
                                    <FaStickyNote className="text-gray-200 text-2xl mx-auto mb-2" />
                                    <p className="text-[10px] text-gray-400">No notes yet</p>
                                </div>
                            )}
                            {sortedNotes.map(note => {
                                const c = NOTE_COLORS[note.color];
                                return (
                                    <div key={note.id}
                                        onClick={() => openNote(note)}
                                        className={`relative rounded-lg p-2 cursor-pointer border transition group ${activeNoteId === note.id ? "border-blue-400 bg-blue-50 shadow-sm" : `${c.border} ${c.bg} hover:shadow-sm`}`}>
                                        {note.pinned && <FaThumbtack className="absolute top-1.5 right-1.5 text-[8px] text-amber-400" />}
                                        <p className="text-[11px] font-bold text-gray-800 truncate leading-tight">{note.title}</p>
                                        <p className="text-[9px] text-gray-400 mt-0.5 line-clamp-2 leading-tight">{note.text || "Empty note"}</p>
                                        <p className="text-[8px] text-gray-300 mt-1">{note.createdAt}</p>
                                        <button onClick={(e) => { e.stopPropagation(); deleteNote(note.id); }}
                                            className="absolute bottom-1.5 right-1.5 hidden group-hover:flex items-center justify-center w-4 h-4 rounded bg-red-100 hover:bg-red-200 text-red-400 transition">
                                            <FaTrash className="text-[7px]" />
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="px-2.5 py-2 border-t border-gray-100">
                            <p className="text-[9px] text-gray-400 text-center">{notes.length} note{notes.length !== 1 ? "s" : ""}</p>
                        </div>
                    </div>

                    {/* Note Editor */}
                    <div className="flex-1 flex flex-col overflow-hidden">
                        {!activeNoteId ? (
                            <div className="flex-1 flex flex-col items-center justify-center gap-3 p-6 text-center">
                                <div className="w-16 h-16 rounded-2xl bg-blue-50 border-2 border-dashed border-blue-200 flex items-center justify-center">
                                    <FaEdit className="text-blue-300 text-xl" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-700 mb-1">Start taking notes</p>
                                    <p className="text-xs text-gray-400">Create a new note or select one from the list to begin editing.</p>
                                </div>
                                <button onClick={createNote} className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition">
                                    <FaPlus className="text-[9px]" /> Create First Note
                                </button>
                            </div>
                        ) : (
                            <>
                                {/* Note Title + Color Picker */}
                                <div className="px-3 py-2.5 border-b border-gray-100 flex items-center gap-2">
                                    <input value={draftTitle} onChange={e => setDraftTitle(e.target.value)}
                                        className="flex-1 text-sm font-bold text-gray-800 border-none outline-none bg-transparent placeholder-gray-300 min-w-0"
                                        placeholder="Note title..." />
                                    <div className="flex items-center gap-1 flex-shrink-0">
                                        {NOTE_COLORS.map((c, i) => (
                                            <button key={i} onClick={() => setDraftColor(i)} title={c.label}
                                                className={`w-4 h-4 rounded-full ${c.dot} transition-transform ${draftColor === i ? "scale-125 ring-2 ring-offset-1 ring-gray-400" : "hover:scale-110"}`} />
                                        ))}
                                        <button onClick={() => togglePin(activeNoteId)} title="Pin note"
                                            className={`ml-1 w-6 h-6 flex items-center justify-center rounded-lg text-[10px] transition ${activeNote?.pinned ? "text-amber-500 bg-amber-50" : "text-gray-300 hover:text-amber-400"}`}>
                                            <FaThumbtack />
                                        </button>
                                    </div>
                                </div>

                                {/* Formatting Toolbar */}
                                <div className="px-3 py-1.5 border-b border-gray-100 flex items-center gap-1 flex-wrap bg-gray-50">
                                    {[
                                        { icon: <FaBold />, action: "bold", tip: "Bold" },
                                        { icon: <FaItalic />, action: "italic", tip: "Italic" },
                                        { icon: <FaUnderline />, action: "underline", tip: "Underline" },
                                        { icon: <FaHighlighter />, action: "highlight", tip: "Highlight" },
                                        { icon: <FaListUl />, action: "bullet", tip: "Bullet list" },
                                        { icon: <FaListOl />, action: "number", tip: "Numbered list" },
                                    ].map(({ icon, action, tip }) => (
                                        <button key={action} onClick={() => insertFormat(action)} title={tip}
                                            className="w-6 h-6 flex items-center justify-center rounded text-[10px] text-gray-500 hover:bg-blue-100 hover:text-blue-600 transition">
                                            {icon}
                                        </button>
                                    ))}
                                    <div className="flex-1" />
                                    <button onClick={saveNote}
                                        className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold transition ${savedFlash ? "bg-green-100 text-green-600" : "bg-blue-600 text-white hover:bg-blue-700"}`}>
                                        {savedFlash ? <><FaCheck className="text-[8px]" /> Saved!</> : <><FaSave className="text-[8px]" /> Save</>}
                                    </button>
                                </div>

                                {/* Textarea */}
                                <div className={`flex-1 overflow-hidden ${NOTE_COLORS[draftColor].bg}`}>
                                    <textarea
                                        ref={textareaRef}
                                        value={draftText}
                                        onChange={e => setDraftText(e.target.value)}
                                        onKeyDown={e => { if ((e.ctrlKey || e.metaKey) && e.key === "s") { e.preventDefault(); saveNote(); } }}
                                        placeholder={"Start writing your notes here...\n\nTip: Use the toolbar above to format text, or press Ctrl+S to save."}
                                        className={`w-full h-full resize-none border-none outline-none px-4 py-3 text-xs sm:text-sm text-gray-700 leading-relaxed bg-transparent placeholder-gray-300 font-mono`}
                                    />
                                </div>

                                {/* Footer */}
                                <div className="px-3 py-1.5 border-t border-gray-100 bg-white flex items-center justify-between">
                                    <p className="text-[9px] text-gray-400">{draftText.length} chars · {draftText.split(/\s+/).filter(Boolean).length} words</p>
                                    <p className="text-[9px] text-gray-300">{activeNote?.createdAt}</p>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

/* ══════════════════════════════════════════════════════════════
   QUIZ COMPONENT
══════════════════════════════════════════════════════════════ */
const QuizView = ({ quiz, moduleColor, onComplete, isCompleted }) => {
    const [current, setCurrent] = useState(0);
    const [selected, setSelected] = useState(null);
    const [answers, setAnswers] = useState({});
    const [showExplanation, setShowExplanation] = useState(false);
    const [finished, setFinished] = useState(isCompleted);
    const [score, setScore] = useState(0);

    const q = quiz.questions[current];
    const totalQ = quiz.questions.length;
    const isAnswered = selected !== null;
    const isCorrect = selected === q.correct;

    const handleSelect = (idx) => {
        if (isAnswered) return;
        setSelected(idx);
        setShowExplanation(true);
        setAnswers((prev) => ({ ...prev, [current]: idx }));
    };

    const handleNext = () => {
        if (current < totalQ - 1) {
            setCurrent(current + 1);
            setSelected(answers[current + 1] ?? null);
            setShowExplanation(answers[current + 1] !== undefined);
        } else {
            const s = quiz.questions.filter((q2, i) => answers[i] === q2.correct).length;
            setScore(s);
            setFinished(true);
            onComplete();
        }
    };

    const handleRetry = () => {
        setCurrent(0); setSelected(null); setAnswers({});
        setShowExplanation(false); setFinished(false); setScore(0);
    };

    const [requestSent, setRequestSent] = useState(() => {
        try {
            return localStorage.getItem(`quiz_req_${quiz.title || quiz.id}`) === "true";
        } catch {
            return false;
        }
    });

    const triggerSendRequest = () => {
        try {
            localStorage.setItem(`quiz_req_${quiz.title || quiz.id}`, "true");
            setRequestSent(true);
            alert("Quiz request sent successfully!");
        } catch (err) {
            console.error(err);
        }
    };

    if (finished) {
        const pct = Math.round((score / totalQ) * 100);
        const passed = pct >= 60;
        return (
            <div className="w-full min-h-[460px] flex flex-col items-center justify-center p-8 text-center bg-slate-900 text-white">
                <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 text-4xl border-2 shadow-2xl animate-bounce ${passed ? "border-emerald-500/30 bg-emerald-500/10" : "border-rose-500/30 bg-rose-500/10"}`}>
                    {passed ? "🎉" : "📚"}
                </div>
                <h2 className="text-3xl font-black tracking-tight mb-2">{passed ? "Module Assessment Cleared!" : "Review Material & Retry"}</h2>
                <p className="text-slate-400 text-sm max-w-sm mb-6">
                    You achieved a score of <span className="font-bold text-white px-2 py-0.5 rounded bg-slate-800" style={{ color: moduleColor }}>{score} out of {totalQ}</span> ({pct}%)
                </p>
                <div className="flex gap-2.5 flex-wrap justify-center mb-8 bg-slate-800/40 p-3 rounded-2xl border border-slate-700/50">
                    {quiz.questions.map((qq, i) => (
                        <div key={i} className={`w-10 h-10 rounded-xl flex flex-col items-center justify-center font-bold text-xs shadow-sm ${answers[i] === qq.correct ? "bg-emerald-500 text-white" : "bg-rose-500 text-white"}`}>
                            <span className="text-[9px] opacity-60 font-medium">Q{i + 1}</span>
                            {answers[i] === qq.correct ? "✓" : "✕"}
                        </div>
                    ))}
                </div>
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold mb-6 border ${passed ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-rose-500/10 border-rose-500/20 text-rose-400"}`}>
                    <div className={`w-2 h-2 rounded-full ${passed ? "bg-emerald-400 animate-pulse" : "bg-rose-400"}`}></div>
                    {passed ? "Minimum Passing Criteria Met (60%)" : "Requires 60% Passing Grade"}
                </div>
                
                <div className="mb-6 flex flex-col items-center">
                    {requestSent ? (
                        <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold shadow-sm">
                            <FaCheckCircle className="text-blue-400" /> Already quiz request sent
                        </div>
                    ) : (
                        <button
                            onClick={triggerSendRequest}
                            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-slate-900 bg-white hover:bg-slate-100 transition shadow-md border-none cursor-pointer"
                        >
                            Send Quiz Request
                        </button>
                    )}
                </div>

                {!passed && (
                    <button onClick={handleRetry} className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white transition-all hover:scale-[1.02] border-none cursor-pointer" style={{ background: moduleColor }}>
                        <FaRedo className="w-3 h-3" /> Re-attempt Assessment
                    </button>
                )}
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col overflow-hidden bg-slate-900 border border-slate-800 text-white rounded-2xl">
            <div className="px-6 py-5 bg-slate-950/40 border-b border-slate-800/60">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <span className="flex items-center justify-center w-5 h-5 rounded-md bg-indigo-500/10 text-indigo-400 text-xs font-bold border border-indigo-500/20">Q</span>
                        <span className="text-xs font-bold tracking-wider uppercase text-slate-400">Progress Map</span>
                    </div>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold">{current + 1} / {totalQ} Questions</span>
                </div>
                <div className="flex gap-1.5 w-full">
                    {quiz.questions.map((_, idx) => (
                        <div key={idx} className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${idx === current ? "bg-indigo-500" : idx < current ? "bg-slate-700" : "bg-slate-800"}`} />
                    ))}
                </div>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5 min-h-[280px]">
                <div className="bg-slate-950/20 border border-slate-800/40 rounded-xl p-4">
                    <h3 className="text-base font-bold text-slate-100 leading-relaxed">{q.question}</h3>
                </div>
                <div className="grid grid-cols-1 gap-3">
                    {q.options.map((opt, i) => {
                        let itemStyles = "w-full text-left px-4 py-3.5 rounded-xl border transition-all duration-200 flex items-center justify-between group outline-none ";
                        let prefixStyles = "w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold transition-all border shadow-inner ";
                        if (!isAnswered) {
                            itemStyles += "border-slate-800 bg-slate-950/40 hover:border-slate-700 hover:bg-slate-800/40 text-slate-300 focus:border-indigo-500";
                            prefixStyles += "border-slate-800 bg-slate-900 text-slate-400 group-hover:bg-slate-700 group-hover:text-white";
                        } else if (i === q.correct) {
                            itemStyles += "border-emerald-500/40 bg-emerald-500/10 text-emerald-200 font-medium";
                            prefixStyles += "border-emerald-400/30 bg-emerald-500 text-white";
                        } else if (i === selected && selected !== q.correct) {
                            itemStyles += "border-rose-500/40 bg-rose-500/10 text-rose-200";
                            prefixStyles += "border-rose-400/30 bg-rose-500 text-white";
                        } else {
                            itemStyles += "border-slate-800/40 bg-slate-950/10 text-slate-500 cursor-not-allowed";
                            prefixStyles += "border-slate-800/40 bg-slate-900/40 text-slate-600";
                        }
                        return (
                            <button key={i} className={itemStyles} onClick={() => handleSelect(i)} disabled={isAnswered}>
                                <span className="flex items-center gap-3.5 pr-2">
                                    <span className={prefixStyles}>{String.fromCharCode(65 + i)}</span>
                                    <span className="text-sm leading-tight font-medium">{opt}</span>
                                </span>
                                {isAnswered && i === q.correct && <FaCheckCircle className="text-emerald-400 w-4 h-4 flex-shrink-0" />}
                                {isAnswered && i === selected && selected !== q.correct && <FaTimes className="text-rose-400 w-4 h-4 flex-shrink-0" />}
                            </button>
                        );
                    })}
                </div>
                {showExplanation && (
                    <div className={`p-4 rounded-xl border ${isCorrect ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-300" : "bg-amber-500/5 border-amber-500/20 text-amber-300"}`}>
                        <div className="flex items-center gap-2 mb-1.5 font-bold text-xs tracking-wider uppercase">
                            <MdInfoOutline className="text-sm" />
                            <span>{isCorrect ? "Core Insight" : "Learning Bridge"}</span>
                        </div>
                        <p className="text-xs leading-relaxed opacity-90">{q.explanation}</p>
                    </div>
                )}
            </div>
            <div className="px-6 py-4 bg-slate-950/40 border-t border-slate-800/60 flex justify-between items-center">
                <button onClick={() => { if (current > 0) { setCurrent(current - 1); setSelected(answers[current - 1] ?? null); setShowExplanation(answers[current - 1] !== undefined); } }} disabled={current === 0}
                    className="text-xs font-bold text-slate-400 disabled:opacity-20 hover:text-white flex items-center gap-1.5 transition px-3 py-1.5 rounded-lg hover:bg-slate-800/60">
                    <FaChevronLeft className="w-2.5 h-2.5" /> Back
                </button>
                <button onClick={handleNext} disabled={!isAnswered}
                    className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-90 active:scale-95"
                    style={{ background: isAnswered ? moduleColor : "#334155" }}>
                    {current === totalQ - 1 ? "Finish Assessment" : "Next Segment"} <FaChevronRight className="w-2.5 h-2.5" />
                </button>
            </div>
        </div>
    );
};

/* ══════════════════════════════════════════════════════════════
   ASSIGNMENT COMPONENT
══════════════════════════════════════════════════════════════ */
const AssignmentView = ({ assignment, moduleColor, onSubmit, isSubmitted }) => {
    const [files, setFiles] = useState([]);
    const [notes, setNotes] = useState("");
    const [submitted, setSubmitted] = useState(isSubmitted);
    const [activeTab, setActiveTab] = useState("brief");
    const [dragActive, setDragActive] = useState(false);

    const totalMarks = assignment.rubric.reduce((s, r) => s + r.marks, 0);

    const handleSubmit = () => { if (files.length === 0) return; setSubmitted(true); onSubmit(); };
    const handleDrag = (e) => {
        e.preventDefault(); e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
        else if (e.type === "dragleave") setDragActive(false);
    };
    const handleDrop = (e) => {
        e.preventDefault(); e.stopPropagation(); setDragActive(false);
        if (e.dataTransfer.files?.[0]) setFiles(prev => [...prev, ...Array.from(e.dataTransfer.files)]);
    };

    if (submitted) {
        return (
            <div className="w-full min-h-[460px] flex flex-col items-center justify-center p-8 text-center bg-slate-50 border border-slate-200 rounded-2xl">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500 text-white flex items-center justify-center mb-5 shadow-xl shadow-emerald-500/20">
                    <FaCheck className="text-xl" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-1">Deliverable Transmitted</h2>
                <p className="text-slate-500 text-xs max-w-xs mb-6">Your submission has passed initial verification and is pending grading assessment by your course coordinator.</p>
                <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-xl border border-slate-200/80 shadow-sm text-left max-w-sm">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center flex-shrink-0">
                        <FaHourglassHalf className="text-sm animate-spin" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-800">Status Assessment Open</p>
                        <p className="text-[11px] text-slate-400">Target response window: 3–5 Business Days</p>
                    </div>
                </div>
            </div>
        );
    }

    const tabs = [{ id: "brief", label: "Project Brief" }, { id: "rubric", label: "Evaluation Criteria" }, { id: "submit", label: "Submission Panel" }];

    return (
        <div className="w-full flex flex-col overflow-hidden bg-white border border-slate-200 rounded-2xl shadow-sm">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white" style={{ background: moduleColor }}>
                        <MdAssignment className="text-base" />
                    </div>
                    <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Practical Assessment</span>
                        <h2 className="text-sm font-black text-slate-800 tracking-tight leading-none mt-0.5">{assignment.title}</h2>
                    </div>
                </div>
                <div className="bg-slate-50 border border-slate-200/60 rounded-xl px-3 py-1 text-center min-w-[70px]">
                    <span className="block text-xs font-black tracking-tight text-slate-800 leading-none">{totalMarks}</span>
                    <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold leading-none">Total Pts</span>
                </div>
            </div>
            <div className="flex border-b border-slate-100 bg-slate-50/50 p-1 gap-1">
                {tabs.map(t => (
                    <button key={t.id} onClick={() => setActiveTab(t.id)}
                        className={`flex-1 py-2 text-xs font-bold transition-all rounded-lg ${activeTab === t.id ? "bg-white text-slate-800 shadow-xs border border-slate-200/40" : "text-slate-400 hover:text-slate-600 hover:bg-slate-100/50"}`}
                        style={activeTab === t.id ? { color: moduleColor } : {}}>
                        {t.label}
                    </button>
                ))}
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-5 min-h-[300px]">
                {activeTab === "brief" && (
                    <div className="space-y-5">
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1">Objectives Context</h4>
                            <p className="text-xs text-slate-600 leading-relaxed font-medium">{assignment.brief}</p>
                        </div>
                        <div>
                            <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-2">Technical Goals</h4>
                            <div className="grid grid-cols-1 gap-2">
                                {assignment.objectives.map((obj, i) => (
                                    <div key={i} className="flex items-start gap-3 bg-white p-2.5 border border-slate-100 rounded-lg">
                                        <span className="flex-shrink-0 w-5 h-5 rounded-md text-xs font-bold flex items-center justify-center bg-slate-100 text-slate-500 border border-slate-200/50">{i + 1}</span>
                                        <span className="text-xs text-slate-600 font-medium pt-0.5">{obj}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-2">Expected Deliverables</h4>
                            <div className="flex flex-wrap gap-2">
                                {assignment.deliverables.map((d, i) => (
                                    <div key={i} className="inline-flex items-center gap-2 bg-emerald-500/5 text-emerald-700 border border-emerald-500/10 px-3 py-1.5 rounded-lg text-xs font-medium">
                                        <FaCheckCircle className="text-emerald-500 flex-shrink-0" /><span>{d}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
                {activeTab === "rubric" && (
                    <div className="space-y-3">
                        {assignment.rubric.map((r, i) => (
                            <div key={i} className="bg-white rounded-xl p-3 border border-slate-200/80 flex items-center justify-between">
                                <div className="flex-1 pr-4">
                                    <span className="text-xs font-bold text-slate-700">{r.criterion}</span>
                                    <div className="w-full h-1 bg-slate-100 rounded-full mt-1.5 overflow-hidden">
                                        <div className="h-full rounded-full" style={{ width: `${(r.marks / totalMarks) * 100}%`, background: moduleColor }} />
                                    </div>
                                </div>
                                <span className="text-xs font-black px-2 py-1 rounded-md bg-slate-50 border border-slate-100 text-slate-600">{r.marks} pts</span>
                            </div>
                        ))}
                    </div>
                )}
                {activeTab === "submit" && (
                    <div className="space-y-4">
                        <div onDragEnter={handleDrag} onDragOver={handleDrag} onDragLeave={handleDrag} onDrop={handleDrop}
                            onClick={() => document.getElementById("assign-file-upload").click()}
                            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200 ${dragActive ? "border-indigo-500 bg-indigo-50/40" : "border-slate-200 bg-slate-50/50 hover:border-slate-300 hover:bg-slate-50"}`}>
                            <MdCloudUpload className="text-slate-400 text-3xl mx-auto mb-1.5" />
                            <p className="text-xs font-bold text-slate-700">Drop your file assets here or browse</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">Maximum unified payload footprint: 20MB</p>
                            <input id="assign-file-upload" type="file" multiple className="hidden" onChange={(e) => setFiles(prev => [...prev, ...Array.from(e.target.files)])} />
                        </div>
                        {files.length > 0 && (
                            <div className="grid grid-cols-1 gap-1.5">
                                {files.map((f, i) => (
                                    <div key={i} className="flex items-center justify-between bg-slate-50 rounded-xl px-3 py-2 border border-slate-200/60">
                                        <div className="flex items-center gap-2 min-w-0 pr-2">
                                            <FaPaperclip className="text-slate-400 w-3 h-3 flex-shrink-0" />
                                            <span className="text-xs font-semibold text-slate-600 truncate">{f.name}</span>
                                        </div>
                                        <button onClick={(e) => { e.stopPropagation(); setFiles(files.filter((_, j) => j !== i)); }} className="text-slate-400 hover:text-rose-500 p-1 text-[11px] transition">✕</button>
                                    </div>
                                ))}
                            </div>
                        )}
                        <textarea className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 resize-none focus:outline-none focus:ring-2 focus:ring-slate-100 placeholder-slate-400" rows={3}
                            placeholder="Add verification notes or context comments for reviewer evaluation..." value={notes} onChange={(e) => setNotes(e.target.value)} />
                        <button onClick={handleSubmit} disabled={files.length === 0}
                            className="w-full py-2.5 rounded-xl text-xs font-bold text-white transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-95"
                            style={{ background: files.length > 0 ? moduleColor : "#CBD5E1" }}>
                            <FaUpload className="w-3 h-3" /> Execute Submission Packet
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

/* ══════════════════════════════════════════════════════════════
   MAIN MODULE LESSON COMPONENT
══════════════════════════════════════════════════════════════ */
const ModuleLesson = () => {
    const { courseId, moduleId, lessonId } = useParams();
    const navigate = useNavigate();

    const cId = parseInt(courseId) || 1;
    const mId = parseInt(moduleId) || 1;
    const lId = parseInt(lessonId) || 1;

    const allModules = courseModulesData[cId] || courseModulesData[1];
    const currentModule = allModules[mId - 1] || allModules[0];
    const currentLesson = currentModule.lessons[lId - 1] || currentModule.lessons[0];
    const staticContent = getContent(mId, lId, allModules);

    // ── API: fetch real lesson data ──
    const [lessonData, setLessonData] = useState(null);
    const [lessonLoading, setLessonLoading] = useState(true);
    const [lessonError, setLessonError] = useState("");

    const fetchLesson = useCallback(async () => {
        if (!courseId || !lessonId) return;
        setLessonLoading(true);
        setLessonError("");
        try {
            const res = await studentEnrolledCourseApi.getLessonById(courseId, lessonId);
            if (res.data?.data) setLessonData(res.data.data);
        } catch (err) {
            console.error("Lesson fetch failed:", err);
            setLessonError("Could not load lesson content from server.");
        } finally {
            setLessonLoading(false);
        }
    }, [courseId, lessonId]);

    useEffect(() => { fetchLesson(); }, [fetchLesson]);

    // Merge API data with static fallbacks
    const liveLessonType = lessonData?.lessonType?.toLowerCase();
    const isQuiz = currentLesson.type === "quiz";
    const isAssignment = currentLesson.type === "assignment";
    const isVideo = !isQuiz && !isAssignment && (liveLessonType === "video" || !liveLessonType);
    const isText = !isQuiz && !isAssignment && (liveLessonType === "text" || liveLessonType === "article");

    // Displayed content — prefer API data, fall back to static
    const content = {
        title: lessonData?.title || staticContent.title,
        description: lessonData?.description || staticContent.description,
        body: lessonData?.content || null,
        videoUrl: lessonData?.videoUrl || null,
        resourceUrl: lessonData?.resourceUrl || null,
        duration: lessonData?.durationInMinutes ? `${lessonData.durationInMinutes} min` : currentLesson.duration,
        keyPoints: staticContent.keyPoints,
        resources: lessonData?.resourceUrl
            ? [{ name: `${lessonData.title || "Lesson"} Resource`, url: lessonData.resourceUrl }]
            : staticContent.resources,
    };

    const quiz = quizData[cId]?.[mId] || getGenericQuiz(cId, mId, allModules);
    const assignment = assignmentData[cId]?.[mId] || getGenericAssignment(mId, allModules);

    const [completedLessons, setCompletedLessons] = useState(
        new Set(allModules.flatMap((m) => m.lessons.filter((l) => l.completed).map((l) => `${m.id}-${l.id}`)))
    );
    const [expandedModules, setExpandedModules] = useState(new Set([currentModule.id]));
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [notesOpen, setNotesOpen] = useState(false);

    const toggleModule = (id) => {
        setExpandedModules((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
    };
    const markComplete = () => setCompletedLessons((prev) => new Set(prev).add(`${mId}-${lId}`));

    const totalLessons = allModules.reduce((s, m) => s + m.lessons.length, 0);
    const completedCount = completedLessons.size;
    const progressPct = Math.round((completedCount / totalLessons) * 100);

    const flatLessons = allModules.flatMap((m) => m.lessons.map((l) => ({ moduleId: m.id, lessonId: l.id })));
    const currentFlatIdx = flatLessons.findIndex((f) => f.moduleId === mId && f.lessonId === lId);
    const prevLesson = flatLessons[currentFlatIdx - 1];
    const nextLesson = flatLessons[currentFlatIdx + 1];
    const goTo = (mod, les) => navigate(`/student/course/${cId}/module/${mod}/lesson/${les}`);

    const isDone = completedLessons.has(`${mId}-${lId}`);

    // Note count badge
    const noteCount = (() => {
        try { return JSON.parse(localStorage.getItem(`notes_${cId}-${mId}-${lId}`) || "[]").length; } catch { return 0; }
    })();

    return (
        <div className="min-h-screen bg-[#f8fafc] flex flex-col antialiased selection:bg-indigo-500/20">

            {/* ── Top Bar ── */}
            <div className="bg-white border-b border-slate-200/80 px-5 py-3 flex items-center justify-between sticky top-0 z-30 shadow-xs">
                <div className="flex items-center gap-3">
                    <Link to={`/student/continue-learning/${cId}`} className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-600 transition">
                        <FaChevronLeft className="w-2.5 h-2.5" /> Course Workspace
                    </Link>
                    <span className="text-slate-200 font-light">|</span>
                    <span className="text-xs font-bold text-slate-800 truncate max-w-[180px] sm:max-w-xs opacity-80">
                        {lessonLoading ? "Loading…" : content.title}
                    </span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="hidden sm:flex items-center gap-3 bg-slate-50 px-3 py-1.5 border border-slate-200/60 rounded-xl">
                        <div className="w-24 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-600 rounded-full transition-all duration-300" style={{ width: `${progressPct}%` }} />
                        </div>
                        <span className="text-[11px] text-blue-500 font-extrabold tracking-wide uppercase">{progressPct}% Complete</span>
                    </div>
                    {/* Take Notes button in top bar */}
                    <button
                        onClick={() => setNotesOpen(v => !v)}
                        className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all flex-shrink-0 ${notesOpen ? "bg-blue-600 border-blue-600 text-white shadow-md" : "bg-white border-gray-200 text-gray-600 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50"}`}>
                        <FaStickyNote className="text-[11px]" />
                        <span className="hidden sm:inline">Notes</span>
                        {noteCount > 0 && (
                            <span className={`absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full text-[9px] font-black flex items-center justify-center ${notesOpen ? "bg-white text-blue-600" : "bg-blue-600 text-white"}`}>
                                {noteCount}
                            </span>
                        )}
                    </button>
                    <button onClick={() => setSidebarOpen((v) => !v)}
                        className="flex items-center gap-1.5 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-xl px-3 py-2 hover:bg-slate-50 transition shadow-2xs">
                        <FaListUl className="w-3 h-3 text-slate-400" />
                        <span className="hidden sm:inline">{sidebarOpen ? "Minimize Layout" : "Expand Layout"}</span>
                    </button>
                </div>
            </div>

            {/* ── Workspace Body ── */}
            <div className="flex flex-1 overflow-hidden">
                <div className="flex-1 overflow-y-auto">
                    <div className="max-w-4xl mx-auto p-5 space-y-5">

                        {/* Breadcrumb + Take Notes button */}
                        <div className="flex items-center justify-between gap-3">
                            <p className="text-[11px] tracking-wide text-blue-400 font-bold uppercase flex items-center flex-wrap gap-x-1">
                                <Link to={`/student/continue-learning/${cId}`} className="hover:text-blue-700 transition">COURSE</Link>
                                <span className="font-normal text-blue-300">/</span>
                                <span className="hover:text-blue-700 cursor-pointer transition" onClick={() => goTo(mId, 1)}>Module Workspace</span>
                                <span className="font-normal text-blue-300">/</span>
                                <span className="text-blue-600 font-extrabold">{content.title}</span>
                            </p>
                            <button
                                onClick={() => setNotesOpen(v => !v)}
                                className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition flex-shrink-0 border ${notesOpen ? "bg-blue-600 text-white border-blue-600 shadow-md" : "bg-white text-gray-600 border-gray-200 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600"}`}>
                                <FaStickyNote className="w-3 h-3" />
                                {notesOpen ? "Close Notes" : "Take Notes"}
                                {noteCount > 0 && !notesOpen && (
                                    <span className="bg-blue-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">{noteCount}</span>
                                )}
                            </button>
                        </div>

                        {/* Main Stage */}
                        {lessonLoading ? (
                            <div className="rounded-2xl bg-slate-100 aspect-video flex items-center justify-center animate-pulse">
                                <div className="text-slate-400 text-sm font-semibold">Loading lesson…</div>
                            </div>
                        ) : lessonError ? (
                            <div className="rounded-2xl bg-red-50 border border-red-100 aspect-video flex flex-col items-center justify-center gap-3">
                                <p className="text-xs text-red-500 font-semibold">{lessonError}</p>
                                <button onClick={fetchLesson} className="text-xs bg-red-500 text-white font-bold px-4 py-2 rounded-xl hover:bg-red-600 transition">Retry</button>
                            </div>
                        ) : (
                        <div className={`rounded-2xl overflow-hidden ${isQuiz || isAssignment ? "bg-transparent" : "bg-black aspect-video shadow-md border border-slate-200"}`}>
                            {isQuiz ? (
                                <QuizView quiz={quiz} moduleColor={currentModule.color} onComplete={markComplete} isCompleted={isDone} />
                            ) : isAssignment ? (
                                <AssignmentView assignment={assignment} moduleColor={currentModule.color} onSubmit={markComplete} isSubmitted={isDone} />
                            ) : content.videoUrl ? (
                                <video className="w-full h-full object-cover" controls key={content.videoUrl}>
                                    <source src={content.videoUrl} />
                                    Your browser does not support the video tag.
                                </video>
                            ) : isText && content.body ? (
                                <div className="w-full h-full bg-white p-6 overflow-y-auto text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                                    {content.body}
                                </div>
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 gap-3">
                                    <div className="w-16 h-16 rounded-2xl bg-blue-600/20 flex items-center justify-center">
                                        <FaPlay className="text-blue-400 text-2xl" />
                                    </div>
                                    <p className="text-white/60 text-xs font-semibold">No video available for this lesson</p>
                                </div>
                            )}
                        </div>
                        )}

                        {/* Lesson Metadata */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 border border-slate-200/80 rounded-2xl shadow-2xs">
                            <div>
                                <div className="flex items-center gap-2 mb-1.5">
                                    <span className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-md text-[10px] font-extrabold tracking-wider uppercase text-white shadow-2xs" style={{ backgroundColor: currentModule.color }}>
                                        {currentModule.title.split(": ")[0]}
                                    </span>
                                    {isDone && (
                                        <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 font-bold px-2 py-0.5 rounded-md">
                                            ✓ {isAssignment ? "Archived Submission" : "Segment Complete"}
                                        </span>
                                    )}
                                </div>
                                <h1 className="text-lg font-black text-black tracking-tight">{content.title}</h1>
                                <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-400 font-medium">
                                    <span className="flex items-center gap-1 bg-slate-50 px-2 py-0.5 border border-slate-100 rounded-md">
                                        <FaClock className="w-2.5 h-2.5 text-slate-400" /> {content.duration || currentLesson.duration}
                                    </span>
                                    <span className="flex items-center gap-1 bg-slate-50 px-2 py-0.5 border border-slate-100 rounded-md">
                                        {isQuiz ? <MdOutlineQuiz className="w-3 h-3 text-slate-400" /> : isAssignment ? <MdAssignment className="w-3 h-3 text-slate-400" /> : <AiOutlinePlaySquare className="w-3 h-3 text-slate-400" />}
                                        {isQuiz ? "Evaluation Component" : isAssignment ? "Practical Exercise Artifact" : `Unit Index ${lId}/${currentModule.lessons.length}`}
                                    </span>
                                </div>
                            </div>
                            {!isDone && !isQuiz && !isAssignment && (
                                <button onClick={markComplete} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-xs flex-shrink-0 active:scale-98">
                                    <FaCheckCircle className="w-3.5 h-3.5" /> Mark as Complete
                                </button>
                            )}
                        </div>

                        {/* Video / Text Lesson Extras */}
                        {!isQuiz && !isAssignment && !lessonLoading && (
                            <div className="space-y-4">
                                {/* Description */}
                                {content.description && (
                                <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs">
                                    <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 mb-2">Lesson Scope Context</h3>
                                    <p className="text-xs font-medium text-slate-600 leading-relaxed">{content.description}</p>
                                </div>
                                )}
                                {/* Full text body if lesson type is text */}
                                {content.body && isText && (
                                <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs">
                                    <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 mb-3">Lesson Content</h3>
                                    <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{content.body}</div>
                                </div>
                                )}
                                <div className="bg-indigo-500/5 rounded-2xl p-5 border border-indigo-500/10 space-y-3">
                                    <h3 className="text-xs font-extrabold uppercase tracking-widest text-indigo-500">Key Execution Vectors</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                        {content.keyPoints.map((pt, i) => (
                                            <div key={i} className="flex items-start gap-2.5 text-xs font-medium text-slate-600 bg-white p-3 border border-indigo-500/5 rounded-xl shadow-2xs">
                                                <FaCheckCircle className="text-indigo-500 mt-0.5 flex-shrink-0 w-3 h-3" />
                                                <span>{pt}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs">
                                    <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 mb-3">Resource Documentation Assets</h3>
                                    <div className="space-y-2">
                                        {content.resources.map((r, i) => (
                                            <div key={i} className="flex items-center justify-between px-4 py-2.5 bg-slate-50 border border-slate-200/40 rounded-xl hover:bg-slate-100/60 transition cursor-pointer group">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-7 h-7 rounded-lg bg-white border border-slate-200/60 flex items-center justify-center shadow-2xs">
                                                        <FaBook className="text-slate-400 w-3 h-3" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-bold text-slate-700 transition group-hover:text-slate-900">{r.name}</p>
                                                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">{r.size}</p>
                                                    </div>
                                                </div>
                                                <FaDownload className="text-slate-400 group-hover:text-slate-800 w-3.5 h-3.5 transition" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Prev / Next Navigation */}
                        <div className="flex justify-between gap-3 pt-2 pb-8">
                            <button onClick={() => prevLesson && goTo(prevLesson.moduleId, prevLesson.lessonId)} disabled={!prevLesson}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold border transition ${prevLesson ? "border-slate-200 text-slate-700 bg-white hover:bg-slate-50 shadow-2xs" : "border-slate-100 text-slate-300 bg-slate-50/50 cursor-not-allowed"}`}>
                                <FaChevronLeft className="w-2.5 h-2.5" /> Prev Step
                            </button>
                            <button onClick={() => nextLesson && goTo(nextLesson.moduleId, nextLesson.lessonId)} disabled={!nextLesson}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${nextLesson ? "bg-blue-600 text-white shadow-xs hover:bg-blue-500" : "border-slate-100 text-slate-300 bg-slate-50/50 cursor-not-allowed"}`}>
                                Next Step <FaChevronRight className="w-2.5 h-2.5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* ── Right Sidebar ── */}
                {sidebarOpen && (
                    <div className="w-80 bg-white border-l border-slate-200 flex-shrink-0 overflow-y-auto hidden lg:block shadow-sm">
                        <div className="sticky top-0 bg-white border-b border-slate-100 px-4 py-4 z-10">
                            <h2 className="text-xs font-black text-blue-600 uppercase tracking-wider">Syllabus Matrix</h2>
                            <p className="text-[10px] font-bold text-slate-400 mt-0.5 uppercase tracking-wide">{completedCount} of {totalLessons} Steps Verified</p>
                            <div className="w-full h-1 bg-slate-100 rounded-full mt-2.5 overflow-hidden">
                                <div className="h-full bg-blue-600 rounded-full transition-all duration-300" style={{ width: `${progressPct}%` }} />
                            </div>
                        </div>
                        <div className="py-1">
                            {allModules.map((mod) => {
                                const isExpanded = expandedModules.has(mod.id);
                                const isActiveModule = mod.id === mId;
                                const modCompleted = mod.lessons.filter((l) => completedLessons.has(`${mod.id}-${l.id}`)).length;
                                return (
                                    <div key={mod.id} className="border-b border-slate-50">
                                        <button onClick={() => toggleModule(mod.id)}
                                            className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all ${isActiveModule ? "bg-slate-50/80" : "hover:bg-slate-50/40"}`}>
                                            <div className="w-6 h-6 rounded-md flex items-center justify-center text-xs flex-shrink-0 shadow-2xs border border-white" style={{ backgroundColor: mod.color + "15" }}>
                                                {mod.icon}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-bold text-slate-800 truncate leading-tight">{mod.title.split(": ")[1] || mod.title}</p>
                                                <p className="text-[10px] font-mono text-slate-400 mt-0.5">{modCompleted}/{mod.lessons.length} Done</p>
                                            </div>
                                            {isExpanded ? <FaChevronUp className="w-2.5 h-2.5 text-slate-400 flex-shrink-0" /> : <FaChevronDown className="w-2.5 h-2.5 text-slate-400 flex-shrink-0" />}
                                        </button>
                                        {isExpanded && (
                                            <div className="bg-slate-50/30 border-t border-slate-100/60 py-0.5">
                                                {mod.lessons.map((lesson) => {
                                                    const isActive = mod.id === mId && lesson.id === lId;
                                                    const isDoneLesson = completedLessons.has(`${mod.id}-${lesson.id}`);
                                                    const isAssignLesson = lesson.type === "assignment";
                                                    const isQuizLesson = lesson.type === "quiz";
                                                    let itemClass = "w-full flex items-center gap-3 px-4 py-2.5 text-left border-l-2 border-transparent transition-all ";
                                                    if (isActive) itemClass += "bg-blue-600 text-white font-semibold border-l-blue-600";
                                                    else if (isAssignLesson) itemClass += "hover:bg-amber-50/50 text-slate-700 hover:border-l-amber-300";
                                                    else itemClass += "hover:bg-slate-100/50 text-slate-600 hover:border-l-slate-300";
                                                    return (
                                                        <button key={lesson.id} onClick={() => goTo(mod.id, lesson.id)} className={itemClass}>
                                                            <div className="flex-shrink-0 w-4 h-4 flex items-center justify-center">
                                                                {isDoneLesson ? (
                                                                    <FaCheckCircle className={`w-3.5 h-3.5 ${isActive ? "text-white" : "text-emerald-500"}`} />
                                                                ) : isAssignLesson ? (
                                                                    <MdAssignment className={`w-3.5 h-3.5 ${isActive ? "text-white" : "text-amber-500"}`} />
                                                                ) : isQuizLesson ? (
                                                                    <MdOutlineQuiz className={`w-3.5 h-3.5 ${isActive ? "text-white" : "text-indigo-400"}`} />
                                                                ) : (
                                                                    <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${isActive ? "border-white/40" : "border-slate-300 bg-white"}`}>
                                                                        <FaPlay className={`w-1.5 h-1.5 ${isActive ? "text-white" : "text-slate-400"}`} />
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className={`text-xs truncate leading-tight ${isActive ? "text-white" : isAssignLesson ? "text-amber-800 font-semibold" : "text-slate-700 font-medium"}`}>
                                                                    {lesson.title}
                                                                </p>
                                                                <p className={`text-[10px] mt-0.5 ${isActive ? "text-grey-900" : isAssignLesson ? "text-amber-500" : "text-slate-400"}`}>
                                                                    {isAssignLesson ? "Artifact Brief" : isQuizLesson ? "Core Test" : lesson.duration}
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
                            <div className="m-4 bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-4 text-white text-center shadow-lg">
                                <FaTrophy className="w-7 h-7 mx-auto mb-2 text-amber-400" />
                                <p className="font-black text-xs tracking-wide uppercase">Track Concluded</p>
                                <p className="text-[10px] text-slate-400 mt-0.5">Verification credentials generated successfully.</p>
                                <button className="mt-3 w-full bg-white text-slate-900 text-xs font-bold py-2 rounded-xl hover:bg-slate-50 transition shadow-sm active:scale-98">
                                    Claim Certificate
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* ── Floating Notes Panel ── */}
            {notesOpen && (
                <TakeNotesPanel
                    lessonId={`${cId}-${mId}-${lId}`}
                    lessonTitle={currentLesson.title}
                    onClose={() => setNotesOpen(false)}
                />
            )}

        </div>
    );
};

export default ModuleLesson;