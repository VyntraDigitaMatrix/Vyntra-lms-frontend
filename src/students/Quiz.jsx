import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { studentQuizApi } from "./auth/api";
import { Link } from "react-router-dom";
import {
    FaClipboardCheck, FaCheckCircle, FaTrophy, FaChevronRight,
    FaCalendarAlt, FaCheck, FaHourglassHalf, FaTimes, FaRedo,
    FaPlay, FaLock, FaChartBar, FaListUl, FaRegClock, FaAward,
    FaArrowLeft, FaArrowRight, FaBullseye, FaClock, FaFire,
    FaChevronDown, FaChevronUp, FaMedal,
} from "react-icons/fa";
import { MdQuiz } from "react-icons/md";
import { HiOutlineClock } from "react-icons/hi";

/* ═══════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════ */
const quizDetails = {
    1: {
        description: "Test your understanding of core digital marketing concepts including SEM, content strategy, and campaign planning.",
        topics: ["Campaign Basics", "Target Audience", "Conversion Funnels", "KPIs & Metrics", "Brand Positioning"],
        attempt: { attempted: 15, correct: 14, wrong: 1, skipped: 0, timeTaken: "17 mins" },
        breakdown: [
            { label: "Campaign Basics", score: 5, total: 5 },
            { label: "Target Audience", score: 3, total: 3 },
            { label: "Conversion Funnels", score: 3, total: 4 },
            { label: "KPIs & Metrics", score: 3, total: 3 },
        ],
        passMark: "70%", certificate: true,
        questions: [
            { q: "What does SEM stand for?", options: ["Search Engine Marketing", "Social Engine Media", "Site Engagement Metric", "Search Expansion Mode"], correct: 0 },
            { q: "Which metric measures cost per click?", options: ["CPM", "CTR", "CPC", "CPA"], correct: 2 },
            { q: "A conversion funnel starts with which stage?", options: ["Decision", "Action", "Awareness", "Interest"], correct: 2 },
            { q: "KPI stands for:", options: ["Key Performance Indicator", "Key Process Input", "Known Performance Index", "Key Priority Item"], correct: 0 },
            { q: "Brand positioning helps differentiate:", options: ["Price only", "Your brand from competitors", "Internal processes", "Supply chain"], correct: 1 },
            { q: "What is CTR?", options: ["Click Through Rate", "Cost Transfer Rate", "Campaign Tracking Report", "Content Traffic Ratio"], correct: 0 },
            { q: "Which channel is best for B2B lead generation?", options: ["TikTok", "LinkedIn", "Snapchat", "Pinterest"], correct: 1 },
            { q: "What does ROI stand for?", options: ["Rate of Interest", "Return on Investment", "Revenue on Income", "Report of Insights"], correct: 1 },
            { q: "A buyer persona represents:", options: ["A real customer", "A fictional ideal customer", "A competitor", "A marketing budget"], correct: 1 },
            { q: "Content marketing primarily builds:", options: ["Paid traffic", "Brand awareness and trust", "Direct sales only", "Employee satisfaction"], correct: 1 },
            { q: "What is a landing page?", options: ["The homepage", "A dedicated page for conversions", "A blog post", "A social media profile"], correct: 1 },
            { q: "AIDA model stands for:", options: ["Awareness Interest Desire Action", "Attract Inform Deliver Achieve", "Advertise Inform Drive Acquire", "Analyze Index Deploy Automate"], correct: 0 },
            { q: "Which is an outbound marketing tactic?", options: ["SEO", "Content blogging", "Cold email campaigns", "Inbound social posts"], correct: 2 },
            { q: "CPM means:", options: ["Cost Per Month", "Cost Per Mille", "Campaign Performance Metric", "Content Per Media"], correct: 1 },
            { q: "A/B testing compares:", options: ["Two different products", "Two versions of a campaign element", "Two target markets", "Two ad budgets"], correct: 1 },
        ],
    },
    2: {
        description: "Evaluate your knowledge of search engine optimization strategies, keyword research, on-page and off-page techniques.",
        topics: ["Keyword Research", "On-Page SEO", "Backlinks", "Technical SEO", "Analytics"],
        attempt: { attempted: 20, correct: 17, wrong: 2, skipped: 1, timeTaken: "22 mins" },
        breakdown: [
            { label: "Keyword Research", score: 4, total: 5 },
            { label: "On-Page SEO", score: 5, total: 5 },
            { label: "Backlinks", score: 4, total: 5 },
            { label: "Technical SEO", score: 4, total: 5 },
        ],
        passMark: "70%", certificate: true,
        questions: [
            { q: "What is a long-tail keyword?", options: ["Short popular phrase", "Specific multi-word phrase", "Single brand word", "Competitor keyword"], correct: 1 },
            { q: "Which HTML tag is most important for on-page SEO?", options: ["<div>", "<span>", "<title>", "<header>"], correct: 2 },
            { q: "Backlinks from high-authority sites are called:", options: ["Spam links", "Dofollow links", "Quality backlinks", "Internal links"], correct: 2 },
            { q: "Page speed affects which SEO factor?", options: ["Domain age", "Core Web Vitals", "Anchor text", "Meta keywords"], correct: 1 },
            { q: "Google Analytics measures:", options: ["Server logs only", "User behavior & traffic", "Competitor rankings", "Email opens"], correct: 1 },
            { q: "What is a robots.txt file used for?", options: ["Styling pages", "Blocking search engines from certain pages", "Storing passwords", "Setting up emails"], correct: 1 },
            { q: "Canonical tags solve which issue?", options: ["Slow loading", "Duplicate content", "Broken links", "Missing images"], correct: 1 },
            { q: "What does SERP stand for?", options: ["Search Engine Result Page", "Site Evaluation Report Page", "Social Engagement Rank Position", "Search Entry Rate Protocol"], correct: 0 },
            { q: "Anchor text in a link is:", options: ["The URL itself", "The clickable visible text", "The alt attribute", "The meta description"], correct: 1 },
            { q: "Which is a white-hat SEO technique?", options: ["Keyword stuffing", "Link farming", "Guest posting on relevant sites", "Cloaking content"], correct: 2 },
            { q: "Domain Authority was created by:", options: ["Google", "Moz", "Ahrefs", "SEMrush"], correct: 1 },
            { q: "An XML sitemap helps search engines:", options: ["Load pages faster", "Discover and index pages", "Rank images", "Block spam"], correct: 1 },
            { q: "Bounce rate measures:", options: ["Pages visited per session", "Users who leave after one page", "Total site visits", "Ad click rate"], correct: 1 },
            { q: "Schema markup helps with:", options: ["Page speed", "Rich snippets in search results", "Social shares", "Email delivery"], correct: 1 },
            { q: "Which tool shows which keywords a site ranks for?", options: ["Google Fonts", "Google Search Console", "Google Translate", "Google Forms"], correct: 1 },
            { q: "Internal linking helps SEO by:", options: ["Reducing bounce rate only", "Distributing page authority across the site", "Increasing ad revenue", "Blocking competitors"], correct: 1 },
            { q: "E-E-A-T stands for:", options: ["Experience Expertise Authority Trust", "Engagement Evaluation Analytics Tracking", "Estimated Earnings And Traffic", "Error Evaluation And Testing"], correct: 0 },
            { q: "Core Web Vitals include:", options: ["LCP, FID, CLS", "CTR, CPM, CPC", "DA, PA, TF", "HTML, CSS, JS"], correct: 0 },
            { q: "A 301 redirect is:", options: ["Temporary redirect", "Permanent redirect", "Internal redirect", "Error page"], correct: 1 },
            { q: "Keyword density refers to:", options: ["Number of keywords in meta tags", "How often a keyword appears in content", "Keyword bid price", "Number of ranking keywords"], correct: 1 },
        ],
    },
    3: {
        description: "Test your understanding of social media strategies, content planning, engagement metrics and paid social campaigns.",
        topics: ["Content Strategy", "Platform Algorithms", "Paid Ads", "Analytics", "Community Management"],
        attempt: { attempted: 7, correct: 6, wrong: 1, skipped: 8, timeTaken: "In progress" },
        breakdown: [
            { label: "Content Strategy", score: 3, total: 4 },
            { label: "Platform Algorithms", score: 2, total: 3 },
            { label: "Paid Ads", score: 1, total: 4 },
            { label: "Analytics", score: 0, total: 4 },
        ],
        passMark: "70%", certificate: false,
        resumeFrom: 7,
        questions: [
            { q: "Content pillars help with:", options: ["Ad budgeting", "Consistent content themes", "Follower removal", "Platform migration"], correct: 1 },
            { q: "Instagram's algorithm prioritizes:", options: ["Oldest posts", "Random content", "Engagement & relevance", "Only paid content"], correct: 2 },
            { q: "CPM in paid social means:", options: ["Cost Per Message", "Cost Per Mille (1000 impressions)", "Clicks Per Month", "Campaign Per Market"], correct: 1 },
            { q: "Engagement rate is calculated using:", options: ["Likes ÷ Followers × 100", "Shares only", "Impressions × 2", "Follower count"], correct: 0 },
            { q: "Community management includes:", options: ["Only scheduling posts", "Responding to comments & DMs", "Deleting negative feedback", "Ad creation only"], correct: 1 },
            { q: "What is a social media content calendar?", options: ["A billing schedule", "A planned schedule of posts", "An analytics dashboard", "A follower list"], correct: 1 },
            { q: "User-generated content (UGC) is:", options: ["Ads created by brands", "Content created by customers/users", "Automated bot posts", "Influencer-only content"], correct: 1 },
            { q: "Which metric shows how many people saw your post?", options: ["Engagement", "Reach/Impressions", "Click rate", "Saves"], correct: 1 },
            { q: "A social media audit involves:", options: ["Deleting all old posts", "Reviewing current performance and profiles", "Buying followers", "Disabling comments"], correct: 1 },
            { q: "TikTok's algorithm heavily weights:", options: ["Follower count", "Watch time and completion rate", "Post length", "Profile picture quality"], correct: 1 },
            { q: "What is a lookalike audience?", options: ["Real customers only", "People similar to your existing audience", "Competitor audiences", "Bot accounts"], correct: 1 },
            { q: "Facebook Pixel is used to:", options: ["Design ads", "Track website conversions from Facebook ads", "Message customers", "Schedule posts"], correct: 1 },
            { q: "Which platform is best for video-first marketing?", options: ["LinkedIn", "Twitter/X", "YouTube", "Reddit"], correct: 2 },
            { q: "Influencer marketing works best when:", options: ["The influencer has millions of followers", "The influencer's audience matches your target", "The post is unpaid", "The product is free"], correct: 1 },
            { q: "Social proof in marketing refers to:", options: ["Legal verification", "Reviews, testimonials, and follower counts", "Paid endorsements only", "Algorithm boosts"], correct: 1 },
        ],
    },
    4: {
        description: "Covers Google Ads campaign setup, bidding strategies, Quality Score, ad extensions and performance tracking.",
        topics: ["Campaign Types", "Bidding Strategies", "Quality Score", "Ad Extensions", "Conversion Tracking"],
        attempt: null, breakdown: [], passMark: "70%", certificate: false,
        startsIn: "1 Day", scheduledDate: "28 May 2024",
        questions: [
            { q: "Which Google Ads campaign type shows ads on websites?", options: ["Search", "Display", "Shopping", "Video"], correct: 1 },
            { q: "Quality Score is based on:", options: ["Budget size", "Ad relevance, CTR & landing page", "Number of keywords", "Campaign age"], correct: 1 },
            { q: "Target CPA bidding optimizes for:", options: ["Maximum clicks", "Specific cost per acquisition", "Brand awareness", "Impression share"], correct: 1 },
            { q: "Ad extensions can improve:", options: ["Quality Score only", "CTR and ad visibility", "Organic rankings", "Campaign budget"], correct: 1 },
            { q: "Conversion tracking requires placing:", options: ["A sitemap", "A tracking tag/pixel", "Meta description", "Robots.txt file"], correct: 1 },
            { q: "What is the Google Display Network?", options: ["A search results page", "A network of websites showing Google ads", "A keyword tool", "An email system"], correct: 1 },
            { q: "Smart Bidding uses:", options: ["Manual CPC only", "Machine learning to optimize bids", "Fixed bid amounts", "Social data"], correct: 1 },
            { q: "A negative keyword:", options: ["Lowers ad quality", "Prevents ads from showing for certain searches", "Increases CPC", "Blocks competitor ads"], correct: 1 },
            { q: "ROAS stands for:", options: ["Return on Ad Spend", "Rate of Ad Sales", "Revenue on Advertising System", "Report of Ad Statistics"], correct: 0 },
            { q: "Ad Rank determines:", options: ["Your monthly budget", "Your ad's position in search results", "Your keyword list size", "Your account age"], correct: 1 },
            { q: "What is a responsive search ad?", options: ["An ad that loads fast", "An ad that tests multiple headlines/descriptions automatically", "A mobile-only ad", "A video ad format"], correct: 1 },
            { q: "Impression share measures:", options: ["How often your ad was clicked", "How often your ad showed vs. how often it could have", "Total ad spend", "Number of conversions"], correct: 1 },
            { q: "Which bidding strategy maximizes conversions?", options: ["Manual CPC", "Target Impression Share", "Maximize Conversions", "Enhanced CPC only"], correct: 2 },
            { q: "Google Shopping ads show:", options: ["Text only", "Product image, name, and price", "Video content", "Display banners"], correct: 1 },
            { q: "A search term report shows:", options: ["Your keyword list", "Actual queries that triggered your ads", "Competitor keywords", "Quality scores"], correct: 1 },
            { q: "Call extensions add:", options: ["More text to ads", "A phone number to the ad", "Images to ads", "Sitelinks"], correct: 1 },
            { q: "What does 'broad match' mean for keywords?", options: ["Exact phrase only", "Ads show for related searches and variations", "Only exact keyword matches", "Negative match"], correct: 1 },
            { q: "Conversion lag refers to:", options: ["Page load delay", "Time between click and conversion", "Ad approval delay", "Bidding delay"], correct: 1 },
            { q: "Which report shows which devices users use?", options: ["Keyword report", "Device report", "Search term report", "Auction insights"], correct: 1 },
            { q: "Google Ads auction happens:", options: ["Once per day", "Every time a search is performed", "Weekly", "Monthly"], correct: 1 },
        ],
    },
    5: {
        description: "Explore email marketing best practices including list segmentation, automation workflows, A/B testing and deliverability.",
        topics: ["List Segmentation", "Email Automation", "A/B Testing", "Deliverability", "Analytics & Reporting"],
        attempt: null, breakdown: [], passMark: "70%", certificate: false,
        questions: [
            { q: "List segmentation divides subscribers by:", options: ["Random order", "Behavior, demographics & preferences", "Email client only", "Send time"], correct: 1 },
            { q: "A drip campaign is an example of:", options: ["Spam", "Email automation", "Cold outreach", "Newsletter only"], correct: 1 },
            { q: "A/B testing in email tests:", options: ["Server settings", "Subject lines, content or CTAs", "DNS records", "Bounce rates only"], correct: 1 },
            { q: "Email deliverability is harmed by:", options: ["Good sender reputation", "Clean lists", "Spam trigger words", "Plain text emails"], correct: 2 },
            { q: "Open rate measures:", options: ["How many clicked", "How many opened the email", "Unsubscribes", "Bounces"], correct: 1 },
            { q: "What is a soft bounce?", options: ["Permanent delivery failure", "Temporary delivery failure", "Spam complaint", "Unsubscribe"], correct: 1 },
            { q: "CAN-SPAM Act requires:", options: ["No unsubscribe option", "A clear unsubscribe option in every email", "Daily email frequency", "Free product offers"], correct: 1 },
            { q: "Double opt-in means:", options: ["Two promotional emails", "Subscriber confirms via a verification email", "Two subject line variants", "Sending to two lists"], correct: 1 },
            { q: "Click-to-open rate (CTOR) measures:", options: ["Total opens", "Clicks as a percentage of opens", "Delivery rate", "Forward rate"], correct: 1 },
            { q: "What is email list hygiene?", options: ["Designing beautiful emails", "Regularly cleaning invalid/inactive addresses", "Adding more subscribers", "Changing email templates"], correct: 1 },
            { q: "An autoresponder is triggered by:", options: ["Random timing", "A specific user action or event", "Manual sending", "Admin approval"], correct: 1 },
            { q: "SPF record helps with:", options: ["Email design", "Email authentication and deliverability", "List segmentation", "A/B testing"], correct: 1 },
            { q: "Preheader text appears:", options: ["Inside the email body", "Next to/below the subject line in inbox", "In the footer", "As the sender name"], correct: 1 },
            { q: "Churn rate in email marketing refers to:", options: ["New subscriber rate", "Rate of unsubscribes and list decay", "Open rate drop", "Bounce increase"], correct: 1 },
            { q: "Transactional emails are:", options: ["Promotional newsletters", "Order confirmations, receipts, password resets", "Cold outreach emails", "Re-engagement campaigns"], correct: 1 },
        ],
    },
};

const colorMap = {
    purple: { bg: "bg-[#f3ebff]", text: "text-[#7c3aed]", accent: "#7c3aed", light: "#f3ebff" },
    blue: { bg: "bg-[#eaf2ff]", text: "text-[#2563eb]", accent: "#2563eb", light: "#eaf2ff" },
    orange: { bg: "bg-[#fff5e7]", text: "text-[#f59e0b]", accent: "#f59e0b", light: "#fff5e7" },
    sky: { bg: "bg-[#edf6ff]", text: "text-[#3b82f6]", accent: "#3b82f6", light: "#edf6ff" },
    gray: { bg: "bg-[#f3f4f6]", text: "text-gray-500", accent: "#6b7280", light: "#f3f4f6" },
};

/* ═══════════════════════════════════════════════
   QUIZ PLAYER — FULLSCREEN
═══════════════════════════════════════════════ */
const QuizPlayer = ({ quiz, mode, onClose, onComplete, isRequestSent, onSendRequest }) => {
    const detail = quizDetails[quiz.id];
    const questions = detail.questions || [];
    const startIdx = mode === "resume" ? (detail.resumeFrom || 0) : 0;

    const [current, setCurrent] = useState(startIdx);
    const [answers, setAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [timeLeft, setTimeLeft] = useState(questions.length * 60);
    const [showConfirm, setShowConfirm] = useState(false);

    React.useEffect(() => {
        if (submitted) return;
        const t = setInterval(() => setTimeLeft(p => {
            if (p <= 1) { setSubmitted(true); return 0; }
            return p - 1;
        }), 1000);
        return () => clearInterval(t);
    }, [submitted]);

    const mins = String(Math.floor(timeLeft / 60)).padStart(2, "0");
    const secs = String(timeLeft % 60).padStart(2, "0");
    const progress = ((current + 1) / questions.length) * 100;
    const score = submitted
        ? Object.entries(answers).filter(([i, a]) => questions[Number(i)]?.correct === a).length
        : 0;
    const pct = submitted ? Math.round((score / questions.length) * 100) : 0;
    const c = colorMap[quiz.color] || colorMap.gray;
    const answeredCount = Object.keys(answers).length;

    const handleSubmit = () => {
        setSubmitted(true);
        onComplete && onComplete(quiz.id, pct);
    };

    /* ── RESULT SCREEN ── */
    if (submitted) {
        return (
            <div className="fixed inset-0 z-50 flex flex-col bg-white overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl ${c.bg} flex items-center justify-center`}>
                            <MdQuiz className={`${c.text} text-lg`} />
                        </div>
                        <div>
                            <p className="text-[11px] text-gray-400 font-medium">{quiz.module}</p>
                            <p className="text-sm font-bold text-[#1d1642]">{quiz.title}</p>
                        </div>
                    </div>
                    <button onClick={onClose}
                        className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition">
                        <FaTimes className="text-gray-400 text-xs" />
                    </button>
                </div>

                {/* Scrollable result body */}
                <div className="flex-1 overflow-y-auto flex items-start justify-center py-10 px-4">
                    <div className="w-full max-w-xl">
                        {/* Score hero */}
                        <div className="rounded-3xl overflow-hidden mb-6" style={{ background: pct >= 70 ? "linear-gradient(135deg,#eafaf0,#d1fae5)" : "linear-gradient(135deg,#fff1f2,#fecdd3)" }}>
                            <div className="px-8 pt-10 pb-6 text-center">
                                <div className="text-6xl mb-3">{pct >= 70 ? "🎉" : "📚"}</div>
                                <h2 className="text-2xl font-black text-[#1d1642]">{pct >= 70 ? "Well Done!" : "Keep Practicing!"}</h2>
                                <p className="text-sm text-gray-500 mt-1">{quiz.title}</p>
                                <div className="mt-5 inline-flex items-center justify-center">
                                    <svg width="110" height="110" viewBox="0 0 110 110">
                                        <circle cx="55" cy="55" r="44" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                                        <circle cx="55" cy="55" r="44" fill="none"
                                            stroke={pct >= 70 ? "#16a34a" : "#dc2626"} strokeWidth="8"
                                            strokeDasharray={`${(pct / 100) * 276.5} 276.5`}
                                            strokeLinecap="round" transform="rotate(-90 55 55)" />
                                        <text x="55" y="61" textAnchor="middle" fontSize="22" fontWeight="900" fill={pct >= 70 ? "#16a34a" : "#dc2626"}>{pct}%</text>
                                    </svg>
                                </div>
                            </div>

                            {/* Stats strip */}
                            <div className="grid grid-cols-3 gap-px bg-white/30">
                                {[
                                    { label: "Correct", val: score, color: "#16a34a", bg: "rgba(255,255,255,0.7)" },
                                    { label: "Wrong", val: questions.length - score - (Object.keys(answers).length < questions.length ? questions.length - Object.keys(answers).length : 0), color: "#dc2626", bg: "rgba(255,255,255,0.7)" },
                                    { label: "Skipped", val: questions.length - Object.keys(answers).length, color: "#6b7280", bg: "rgba(255,255,255,0.7)" },
                                ].map(s => (
                                    <div key={s.label} className="flex flex-col items-center py-5" style={{ background: s.bg }}>
                                        <span className="text-2xl font-black" style={{ color: s.color }}>{s.val}</span>
                                        <span className="text-xs text-gray-400 font-medium mt-0.5">{s.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Question Review */}
                        <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100">
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Question Review</p>
                            </div>
                            <div className="px-6 py-4 space-y-2">
                                {questions.map((q, i) => {
                                    const userAns = answers[i];
                                    const isCorrect = userAns === q.correct;
                                    const skipped = userAns === undefined;
                                    return (
                                        <div key={i} className="flex items-start gap-3 p-3 rounded-xl"
                                            style={{ background: skipped ? "#f9fafb" : isCorrect ? "#eafaf0" : "#fff1f1" }}>
                                            <span className="text-sm font-bold shrink-0 mt-0.5"
                                                style={{ color: skipped ? "#9ca3af" : isCorrect ? "#16a34a" : "#dc2626" }}>
                                                {skipped ? "–" : isCorrect ? "✓" : "✗"}
                                            </span>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-medium text-gray-700">{i + 1}. {q.q}</p>
                                                {!skipped && !isCorrect && (
                                                    <p className="text-xs text-green-600 mt-0.5 font-medium">Correct: {q.options[q.correct]}</p>
                                                )}
                                                {!skipped && isCorrect && (
                                                    <p className="text-xs text-gray-400 mt-0.5">Your answer: {q.options[userAns]}</p>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex-shrink-0 px-6 py-4 border-t border-gray-100 bg-white">
                    <div className="max-w-xl mx-auto space-y-3">
                        {isRequestSent ? (
                            <div className="w-full p-2.5 bg-blue-50 border border-blue-100 rounded-xl text-center text-xs text-blue-700 font-semibold flex items-center justify-center gap-1.5">
                                <FaCheckCircle className="text-blue-500" /> Already quiz request sent
                            </div>
                        ) : (
                            <button onClick={() => onSendRequest(quiz.id)}
                                className="w-full h-11 rounded-xl text-white text-sm font-bold hover:opacity-90 transition flex items-center justify-center gap-2 border-none cursor-pointer"
                                style={{ background: "#2563eb" }}>
                                Send Quiz Request
                            </button>
                        )}
                        <button onClick={onClose}
                            className="w-full h-12 rounded-2xl text-white font-bold text-sm transition hover:opacity-90 border-none cursor-pointer"
                            style={{ background: c.accent }}>
                            Done
                        </button>
                    </div>
                </div>

                <style>{`@keyframes popIn{from{transform:scale(.85);opacity:0}to{transform:scale(1);opacity:1}}`}</style>
            </div>
        );
    }

    const q = questions[current];

    return (
        <div className="fixed inset-0 z-50 flex flex-col bg-white overflow-hidden">

            {/* ── TOP BAR ── */}
            <div className="flex-shrink-0 flex items-center justify-between px-6 py-3 border-b border-gray-100 bg-white">
                <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl ${c.bg} flex items-center justify-center`}>
                        <MdQuiz className={`${c.text} text-lg`} />
                    </div>
                    <div>
                        <p className="text-[11px] text-gray-400 font-medium">{quiz.module}</p>
                        <p className="text-sm font-bold text-[#1d1642] max-w-[260px] lg:max-w-none truncate">{quiz.title}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${timeLeft <= 30 ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-600"}`}>
                        <FaRegClock className="text-[10px]" />
                        {mins}:{secs}
                    </div>
                    <button onClick={() => setShowConfirm(true)}
                        className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition">
                        <FaTimes className="text-gray-400 text-xs" />
                    </button>
                </div>
            </div>

            {/* ── PROGRESS BAR ── */}
            <div className="flex-shrink-0 h-1 bg-gray-100">
                <div className="h-full transition-all duration-500 rounded-full"
                    style={{ width: `${progress}%`, background: c.accent }} />
            </div>

            {/* ── MAIN CONTENT ── */}
            <div className="flex-1 flex overflow-hidden">

                {/* LEFT — Question Panel */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Scrollable question area */}
                    <div className="flex-1 overflow-y-auto px-6 lg:px-16 py-8">
                        <div className="max-w-2xl mx-auto">
                            <div className="flex items-center justify-between mb-6">
                                <span className="text-xs font-semibold px-3 py-1.5 rounded-full"
                                    style={{ background: c.light, color: c.accent }}>
                                    Question {current + 1} of {questions.length}
                                </span>
                                <span className="text-xs text-gray-400 font-medium">
                                    {answeredCount}/{questions.length} answered
                                </span>
                            </div>

                            <h3 className="text-xl lg:text-2xl font-bold text-[#1d1642] mb-8 leading-snug">
                                {q.q}
                            </h3>

                            <div className="space-y-3">
                                {q.options.map((opt, i) => {
                                    const selected = answers[current] === i;
                                    return (
                                        <button key={i}
                                            onClick={() => setAnswers(prev => ({ ...prev, [current]: i }))}
                                            className="w-full text-left px-5 py-4 rounded-2xl border-2 text-sm font-medium transition-all duration-150"
                                            style={{
                                                borderColor: selected ? c.accent : "#e5e7eb",
                                                background: selected ? c.light : "#fff",
                                                color: selected ? c.accent : "#374151",
                                                transform: selected ? "scale(1.01)" : "scale(1)",
                                            }}>
                                            <span className="inline-flex items-center gap-4">
                                                <span className="w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold shrink-0"
                                                    style={{
                                                        borderColor: selected ? c.accent : "#d1d5db",
                                                        background: selected ? c.accent : "transparent",
                                                        color: selected ? "#fff" : "#9ca3af"
                                                    }}>
                                                    {String.fromCharCode(65 + i)}
                                                </span>
                                                {opt}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* ── BOTTOM NAV BAR ── */}
                    <div className="flex-shrink-0 px-6 lg:px-16 py-4 border-t border-gray-100 bg-white">
                        <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
                            <button
                                onClick={() => setCurrent(p => Math.max(0, p - 1))}
                                disabled={current === 0}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-500 hover:bg-gray-50 transition disabled:opacity-30 disabled:cursor-not-allowed">
                                <FaArrowLeft className="text-xs" /> Previous
                            </button>

                            {/* Dot navigation — scrollable */}
                            <div className="flex-1 flex items-center justify-center overflow-x-auto py-1">
                                <div className="flex gap-1.5">
                                    {questions.map((_, i) => (
                                        <button key={i} onClick={() => setCurrent(i)}
                                            className="rounded-full flex-shrink-0 transition-all duration-200"
                                            style={{
                                                width: i === current ? 22 : 8,
                                                height: 8,
                                                background: i === current ? c.accent : answers[i] !== undefined ? "#d1fae5" : "#e5e7eb"
                                            }} />
                                    ))}
                                </div>
                            </div>

                            {current < questions.length - 1 ? (
                                <button onClick={() => setCurrent(p => p + 1)}
                                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition"
                                    style={{ background: c.accent }}>
                                    Next <FaArrowRight className="text-xs" />
                                </button>
                            ) : (
                                <button onClick={handleSubmit}
                                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-white text-sm font-bold hover:opacity-90 transition"
                                    style={{ background: "#16a34a" }}>
                                    <FaCheck className="text-xs" /> Submit
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* RIGHT — Sidebar (hidden on small screens) */}
                <div className="hidden lg:flex flex-col w-72 border-l border-gray-100 bg-gray-50 overflow-y-auto">
                    <div className="px-5 py-5 flex-1">
                        {/* Progress stats */}
                        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3">Progress</p>
                        <div className="grid grid-cols-2 gap-2 mb-5">
                            {[
                                { label: "Answered", val: answeredCount, color: "#16a34a", bg: "#eafaf0" },
                                { label: "Remaining", val: questions.length - answeredCount, color: "#f59e0b", bg: "#fff7e8" },
                                { label: "Total", val: questions.length, color: "#2563eb", bg: "#eaf2ff" },
                                { label: "Time Left", val: `${mins}:${secs}`, color: timeLeft <= 30 ? "#dc2626" : "#6b7280", bg: timeLeft <= 30 ? "#fff1f1" : "#f3f4f6" },
                            ].map(s => (
                                <div key={s.label} className="rounded-xl p-3 flex flex-col gap-0.5" style={{ background: s.bg }}>
                                    <span className="text-[10px] font-medium text-gray-400">{s.label}</span>
                                    <span className="text-lg font-black leading-none" style={{ color: s.color }}>{s.val}</span>
                                </div>
                            ))}
                        </div>

                        {/* Overall progress bar */}
                        <div className="mb-5">
                            <div className="flex justify-between text-[11px] text-gray-400 mb-1.5">
                                <span>Completion</span>
                                <span className="font-bold" style={{ color: c.accent }}>
                                    {Math.round((answeredCount / questions.length) * 100)}%
                                </span>
                            </div>
                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div className="h-full rounded-full transition-all duration-500"
                                    style={{ width: `${(answeredCount / questions.length) * 100}%`, background: c.accent }} />
                            </div>
                        </div>

                        {/* Question Grid Navigator */}
                        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3">Questions</p>
                        <div className="grid grid-cols-5 gap-1.5">
                            {questions.map((_, i) => {
                                const isCurrent = i === current;
                                const isAnswered = answers[i] !== undefined;
                                return (
                                    <button key={i} onClick={() => setCurrent(i)}
                                        className="h-9 rounded-lg text-xs font-bold transition-all"
                                        style={{
                                            background: isCurrent ? c.accent : isAnswered ? "#d1fae5" : "#fff",
                                            color: isCurrent ? "#fff" : isAnswered ? "#059669" : "#9ca3af",
                                            border: isCurrent ? `2px solid ${c.accent}` : "1.5px solid #e5e7eb",
                                        }}>
                                        {i + 1}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Submit button in sidebar */}
                    <div className="flex-shrink-0 px-5 pb-5">
                        <button onClick={handleSubmit}
                            className="w-full h-11 rounded-xl text-white font-bold text-sm hover:opacity-90 transition flex items-center justify-center gap-2"
                            style={{ background: "#16a34a" }}>
                            <FaCheck className="text-xs" /> Submit Quiz
                        </button>
                    </div>
                </div>
            </div>

            {/* ── CONFIRM EXIT MODAL ── */}
            {showConfirm && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center" style={{ background: "rgba(0,0,0,0.45)" }}>
                    <div className="bg-white rounded-2xl shadow-xl p-6 w-80 text-center" style={{ animation: "popIn .2s ease" }}>
                        <div className="text-4xl mb-3">⚠️</div>
                        <h3 className="text-base font-bold text-[#1d1642]">Exit Quiz?</h3>
                        <p className="text-sm text-gray-500 mt-1 mb-5">Your progress will be lost.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setShowConfirm(false)}
                                className="flex-1 h-10 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition">
                                Stay
                            </button>
                            <button onClick={onClose}
                                className="flex-1 h-10 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition">
                                Exit
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`@keyframes popIn{from{transform:scale(.85);opacity:0}to{transform:scale(1);opacity:1}}`}</style>
        </div>
    );
};

/* ═══════════════════════════════════════════════
   ANALYTICS MODAL
═══════════════════════════════════════════════ */
const AnalyticsModal = ({ quiz, onClose }) => {
    const detail = quizDetails[quiz.id];
    const c = colorMap[quiz.color] || colorMap.gray;
    const pct = parseInt(quiz.score);
    const [tab, setTab] = useState("overview");

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)" }}>
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col" style={{ maxHeight: "90vh", animation: "popIn .3s cubic-bezier(.34,1.56,.64,1)" }}>

                {/* Header */}
                <div className="px-6 py-5 flex items-center justify-between border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl ${c.bg} flex items-center justify-center`}>
                            <FaChartBar className={`text-base ${c.text}`} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-400">Analytics Report</p>
                            <h2 className="text-sm font-bold text-[#1d1642] max-w-[240px] truncate">{quiz.title}</h2>
                        </div>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition">
                        <FaTimes className="text-gray-400 text-xs" />
                    </button>
                </div>

                {/* Score hero */}
                <div className="px-6 py-5" style={{ background: `linear-gradient(135deg, ${c.light}, #fff)` }}>
                    <div className="flex items-center gap-5">
                        <svg width="88" height="88" viewBox="0 0 88 88">
                            <circle cx="44" cy="44" r="36" fill="none" stroke="#e5e7eb" strokeWidth="7" />
                            <circle cx="44" cy="44" r="36" fill="none" stroke={c.accent} strokeWidth="7"
                                strokeDasharray={`${(pct / 100) * 226.2} 226.2`} strokeLinecap="round" transform="rotate(-90 44 44)" />
                            <text x="44" y="49" textAnchor="middle" fontSize="16" fontWeight="900" fill={c.accent}>{pct}%</text>
                        </svg>
                        <div>
                            <p className="text-xs text-gray-400 font-medium mb-1">Final Score</p>
                            <p className="text-3xl font-black" style={{ color: c.accent }}>{quiz.score}</p>
                            <span className={`inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full text-xs font-bold ${pct >= 70 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                                {pct >= 70 ? <><FaMedal /> Passed</> : "❌ Not Passed"}
                            </span>
                            {detail.certificate && pct >= 70 && (
                                <p className="text-xs text-amber-600 font-semibold mt-1.5 flex items-center gap-1"><FaAward /> Certificate Earned</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-100 px-6">
                    {["overview", "breakdown", "details"].map(t => (
                        <button key={t} onClick={() => setTab(t)}
                            className={`pb-3 pt-3 mr-6 text-xs font-semibold capitalize border-b-2 transition ${tab === t ? "border-[#6d28d9] text-[#6d28d9]" : "border-transparent text-gray-400"}`}>
                            {t}
                        </button>
                    ))}
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-5">
                    {tab === "overview" && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { label: "Correct", val: detail.attempt.correct, icon: "✅", color: "#16a34a", bg: "#eafaf0" },
                                    { label: "Wrong", val: detail.attempt.wrong, icon: "❌", color: "#dc2626", bg: "#fff1f1" },
                                    { label: "Skipped", val: detail.attempt.skipped, icon: "⏭️", color: "#6b7280", bg: "#f3f4f6" },
                                    { label: "Time", val: detail.attempt.timeTaken, icon: "⏱️", color: "#2563eb", bg: "#eaf2ff" },
                                ].map(s => (
                                    <div key={s.label} className="rounded-2xl p-4 flex items-center gap-3" style={{ background: s.bg }}>
                                        <span className="text-xl">{s.icon}</span>
                                        <div>
                                            <p className="text-xs text-gray-400">{s.label}</p>
                                            <p className="text-xl font-black" style={{ color: s.color }}>{s.val}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="bg-gray-50 rounded-2xl p-4">
                                <div className="flex justify-between text-xs mb-2">
                                    <span className="font-semibold text-gray-500">Accuracy</span>
                                    <span className="font-bold" style={{ color: c.accent }}>{pct}%</span>
                                </div>
                                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                                    <div className="h-full rounded-full transition-all duration-700"
                                        style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${c.accent}, ${c.accent}dd)` }} />
                                </div>
                                <div className="flex justify-between text-[10px] text-gray-400 mt-1.5">
                                    <span>0%</span><span>Pass: 70%</span><span>100%</span>
                                </div>
                            </div>
                            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex items-center gap-4">
                                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-2xl">
                                    {pct >= 90 ? "🥇" : pct >= 75 ? "🥈" : "🥉"}
                                </div>
                                <div>
                                    <p className="text-xs text-amber-500 font-semibold uppercase tracking-wide">Performance</p>
                                    <p className="text-base font-black text-amber-700">
                                        {pct >= 90 ? "Excellent" : pct >= 75 ? "Good" : pct >= 70 ? "Satisfactory" : "Needs Improvement"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {tab === "breakdown" && (
                        <div className="space-y-4">
                            <p className="text-xs text-gray-400 font-medium">Performance across topics</p>
                            {detail.breakdown.map((s) => {
                                const sp = Math.round((s.score / s.total) * 100);
                                return (
                                    <div key={s.label} className="bg-gray-50 rounded-2xl p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-semibold text-[#1d1642]">{s.label}</span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-gray-400">{s.score}/{s.total}</span>
                                                <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                                                    style={{ background: sp >= 70 ? "#eafaf0" : "#fff1f1", color: sp >= 70 ? "#16a34a" : "#dc2626" }}>
                                                    {sp}%
                                                </span>
                                            </div>
                                        </div>
                                        <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
                                            <div className="h-full rounded-full transition-all duration-500"
                                                style={{ width: `${sp}%`, background: sp >= 70 ? "#16a34a" : "#f59e0b" }} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {tab === "details" && (
                        <div className="space-y-2">
                            <p className="text-xs text-gray-400 font-medium mb-3">Quiz information</p>
                            {[
                                { label: "Module", val: quiz.module },
                                { label: "Total Questions", val: quiz.questions },
                                { label: "Duration Allowed", val: quiz.duration },
                                { label: "Date Taken", val: quiz.date },
                                { label: "Pass Mark", val: detail.passMark },
                                { label: "Certificate", val: detail.certificate ? "Yes — Earned" : "No" },
                            ].map(r => (
                                <div key={r.label} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                                    <span className="text-xs text-gray-400 font-medium">{r.label}</span>
                                    <span className="text-xs font-bold text-[#1d1642]">{r.val}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="px-6 py-4 border-t border-gray-100">
                    <button onClick={onClose}
                        className="w-full h-11 rounded-2xl text-white font-bold text-sm hover:opacity-90 transition"
                        style={{ background: c.accent }}>
                        Close Report
                    </button>
                </div>
            </div>
            <style>{`@keyframes popIn{from{transform:scale(.85);opacity:0}to{transform:scale(1);opacity:1}}`}</style>
        </div>
    );
};

/* ═══════════════════════════════════════════════
   DRAWER
═══════════════════════════════════════════════ */
const QuizDetailDrawer = ({ quiz, onClose, onStartQuiz, onResumeQuiz, onRetakeQuiz, onViewAnalytics, isRequestSent, onSendRequest }) => {
    if (!quiz) return null;
    const detail = quizDetails[quiz.id];
    const c = colorMap[quiz.color] || colorMap.gray;

    return (
        <>
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" onClick={onClose} />
            <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col overflow-hidden"
                style={{ animation: "slideIn .25s ease" }}>

                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl ${c.bg} flex items-center justify-center`}>
                            <MdQuiz className={`text-xl ${c.text}`} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 font-medium">{quiz.module}</p>
                            <h2 className="text-sm font-bold text-[#1d1642] leading-tight max-w-[240px]">{quiz.title}</h2>
                        </div>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition">
                        <FaTimes className="text-gray-500 text-xs" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6">
                    <div className="flex items-center justify-between">
                        <StatusBadge status={quiz.status} />
                        <span className="text-xs text-gray-400 flex items-center gap-1"><FaCalendarAlt /> {quiz.date}</span>
                    </div>

                    <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">About</p>
                        <p className="text-sm text-gray-600 leading-relaxed">{detail.description}</p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <MetaPill icon={<FaListUl />} label={quiz.questions} />
                        <MetaPill icon={<HiOutlineClock />} label={quiz.duration} />
                        <MetaPill icon={<FaAward />} label={`Pass: ${detail.passMark}`} />
                    </div>

                    <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Topics Covered</p>
                        <div className="flex flex-wrap gap-2">
                            {detail.topics.map(t => (
                                <span key={t} className="px-3 py-1 rounded-full text-xs font-semibold"
                                    style={{ background: c.light, color: c.accent }}>{t}</span>
                            ))}
                        </div>
                    </div>

                    {quiz.status === "Completed" && detail.attempt && (
                        <>
                            <div>
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Your Attempt</p>
                                <div className="grid grid-cols-2 gap-3">
                                    <StatBox label="Correct" value={detail.attempt.correct} color="#16a34a" bg="#eafaf0" />
                                    <StatBox label="Wrong" value={detail.attempt.wrong} color="#dc2626" bg="#fff1f1" />
                                    <StatBox label="Skipped" value={detail.attempt.skipped} color="#6b7280" bg="#f3f4f6" />
                                    <StatBox label="Time Taken" value={detail.attempt.timeTaken} color="#2563eb" bg="#eaf2ff" />
                                </div>
                            </div>
                            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4 flex items-center gap-5 border border-green-100">
                                <ScoreRing score={parseInt(quiz.score)} color="#16a34a" />
                                <div>
                                    <p className="text-xs text-gray-500">Final Score</p>
                                    <p className="text-3xl font-black text-green-600">{quiz.score}</p>
                                    <p className="text-xs text-green-600 font-semibold mt-0.5">{parseInt(quiz.score) >= 70 ? "✅ Passed" : "❌ Failed"}</p>
                                    {detail.certificate && <p className="text-xs text-amber-600 font-semibold mt-1 flex items-center gap-1"><FaAward /> Certificate Earned</p>}
                                </div>
                            </div>

                            {/* Quiz Request status inline card */}
                            <div className="pt-2">
                                {isRequestSent ? (
                                    <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-center text-xs text-blue-700 font-semibold flex items-center justify-center gap-1.5 shadow-sm">
                                        <FaCheckCircle className="text-blue-500" />
                                        Already quiz request sent
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => onSendRequest(quiz.id)}
                                        className="w-full h-10 rounded-xl border border-dashed border-teal-300 text-teal-700 bg-teal-50 hover:bg-teal-100 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                                    >
                                        Send Quiz Request
                                    </button>
                                )}
                            </div>

                            {detail.breakdown.length > 0 && (
                                <div>
                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Section Breakdown</p>
                                    <div className="space-y-3">
                                        {detail.breakdown.map(s => (
                                            <div key={s.label}>
                                                <div className="flex justify-between text-xs mb-1">
                                                    <span className="text-gray-600 font-medium">{s.label}</span>
                                                    <span className="font-bold" style={{ color: c.accent }}>{s.score}/{s.total}</span>
                                                </div>
                                                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                                    <div className="h-full rounded-full transition-all duration-500"
                                                        style={{ width: `${(s.score / s.total) * 100}%`, background: c.accent }} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    {quiz.status === "In Progress" && detail.attempt && (
                        <div>
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Progress So Far</p>
                            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Answered</span>
                                    <span className="font-bold text-[#1d1642]">{quiz.score}</span>
                                </div>
                                <div className="h-2 bg-amber-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-amber-400 rounded-full" style={{ width: `${(parseInt(quiz.score) / 15) * 100}%` }} />
                                </div>
                                <p className="text-xs text-amber-600 font-medium">Resume to complete your attempt</p>
                            </div>
                        </div>
                    )}

                    {quiz.status === "Upcoming" && (
                        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                                <FaRegClock className="text-blue-500 text-xl" />
                            </div>
                            <div>
                                <p className="text-xs text-blue-400 font-semibold uppercase tracking-wide">Starts In</p>
                                <p className="text-2xl font-black text-blue-600">{detail.startsIn}</p>
                                <p className="text-xs text-gray-400 mt-0.5">Scheduled: {detail.scheduledDate}</p>
                            </div>
                        </div>
                    )}

                    {quiz.status === "Not Attempted" && (
                        <div className="bg-gray-50 border border-dashed border-gray-200 rounded-2xl p-6 text-center">
                            <FaLock className="text-gray-300 text-3xl mx-auto mb-3" />
                            <p className="text-sm font-semibold text-gray-400">Not attempted yet</p>
                            <p className="text-xs text-gray-400 mt-1">Start this quiz to track your progress.</p>
                        </div>
                    )}
                </div>

                {/* Footer CTAs */}
                <div className="px-5 py-4 border-t border-gray-100">
                    {quiz.status === "Completed" && (
                        <div className="space-y-3">
                            {isRequestSent ? (
                                <div className="p-2.5 bg-blue-50 border border-blue-100 rounded-xl text-center text-xs text-blue-700 font-semibold flex items-center justify-center gap-1.5 shadow-sm">
                                    <FaCheckCircle className="text-blue-500" /> Already quiz request sent
                                </div>
                            ) : (
                                <button onClick={() => onSendRequest(quiz.id)}
                                    className="w-full h-11 rounded-xl text-white text-sm font-bold hover:opacity-90 transition flex items-center justify-center gap-2 border-none cursor-pointer"
                                    style={{ background: "#2563eb" }}>
                                    Send Quiz Request
                                </button>
                            )}
                            <div className="flex gap-3">
                                <button onClick={() => { onClose(); onViewAnalytics(quiz); }}
                                    className="flex-1 h-11 rounded-xl border-2 text-sm font-bold transition flex items-center justify-center gap-2 hover:opacity-80 cursor-pointer"
                                    style={{ borderColor: c.accent, color: c.accent, background: c.light }}>
                                    <FaChartBar /> Analytics
                                </button>
                                <button onClick={() => { onClose(); onRetakeQuiz(quiz); }}
                                    className="flex-1 h-11 rounded-xl text-white text-sm font-bold hover:opacity-90 transition flex items-center justify-center gap-2 border-none cursor-pointer"
                                    style={{ background: c.accent }}>
                                    <FaRedo /> Retake
                                </button>
                            </div>
                        </div>
                    )}
                    {quiz.status === "In Progress" && (
                        <button onClick={() => { onClose(); onResumeQuiz(quiz); }}
                            className="w-full h-11 rounded-xl text-white text-sm font-bold hover:opacity-90 transition flex items-center justify-center gap-2"
                            style={{ background: c.accent }}>
                            <FaPlay /> Resume Quiz
                        </button>
                    )}
                    {quiz.status === "Upcoming" && (
                        <button className="w-full h-11 rounded-xl bg-gray-100 text-gray-400 text-sm font-semibold cursor-not-allowed flex items-center justify-center gap-2">
                            <FaLock /> Not Available Yet
                        </button>
                    )}
                    {quiz.status === "Not Attempted" && (
                        <button onClick={() => { onClose(); onStartQuiz(quiz); }}
                            className="w-full h-11 rounded-xl text-white text-sm font-bold hover:opacity-90 transition flex items-center justify-center gap-2"
                            style={{ background: c.accent }}>
                            <FaPlay /> Start Quiz
                        </button>
                    )}
                </div>
            </div>
            <style>{`@keyframes slideIn{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}`}</style>
        </>
    );
};

/* ═══════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════ */
const StatusBadge = ({ status }) => {
    const map = {
        Completed: { bg: "bg-[#eafaf0]", text: "text-[#16a34a]", icon: <FaCheck className="text-[10px]" /> },
        "In Progress": { bg: "bg-[#fff7e8]", text: "text-[#f59e0b]", icon: <FaTrophy className="text-[10px]" /> },
        Upcoming: { bg: "bg-[#edf4ff]", text: "text-[#2563eb]", icon: <FaHourglassHalf className="text-[10px]" /> },
        "Not Attempted": { bg: "bg-gray-100", text: "text-gray-500", icon: null },
    };
    const s = map[status] || map["Not Attempted"];
    return (
        <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${s.bg} ${s.text}`}>
            {s.icon}{status}
        </span>
    );
};
const MetaPill = ({ icon, label }) => (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-full text-xs font-medium text-gray-600">{icon} {label}</span>
);
const StatBox = ({ label, value, color, bg }) => (
    <div className="rounded-xl p-3 flex items-center gap-3" style={{ background: bg }}>
        <div><p className="text-xs text-gray-400">{label}</p><p className="text-xl font-black leading-none mt-0.5" style={{ color }}>{value}</p></div>
    </div>
);
const ScoreRing = ({ score, color }) => {
    const r = 28, circ = 2 * Math.PI * r, dash = (score / 100) * circ;
    return (
        <svg width="72" height="72" viewBox="0 0 72 72">
            <circle cx="36" cy="36" r={r} fill="none" stroke="#e5e7eb" strokeWidth="6" />
            <circle cx="36" cy="36" r={r} fill="none" stroke={color} strokeWidth="6"
                strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" transform="rotate(-90 36 36)" />
            <text x="36" y="41" textAnchor="middle" fontSize="13" fontWeight="800" fill={color}>{score}%</text>
        </svg>
    );
};

/* ═══════════════════════════════════════════════
   MAIN
═══════════════════════════════════════════════ */
const Quizzes = () => {
    const { courseId, moduleId, lessonId } = useParams();
    const [activeTab, setActiveTab] = useState("All Quizzes");
    const [selectedCourse, setSelectedCourse] = useState("All Courses");
    const [selectedQuiz, setSelectedQuiz] = useState(null);
    const [quizPlayerState, setQuizPlayerState] = useState(null); // { quiz, mode }
    const [analyticsQuiz, setAnalyticsQuiz] = useState(null);

    const [sentRequests, setSentRequests] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem("quiz_sent_requests") || "{}");
        } catch {
            return {};
        }
    });

    const handleSendRequest = (quizId) => {
        const updated = { ...sentRequests, [quizId]: true };
        setSentRequests(updated);
        localStorage.setItem("quiz_sent_requests", JSON.stringify(updated));
        alert("Quiz request sent successfully!");
    };

    const [quizzes, setQuizzes] = useState([]);

    const fetchQuizzes = async () => {
        try {
            const response = await studentQuizApi.getAllQuizzes();

            console.log("API Response:", response.data);
            console.log("Data:", response.data?.data);
            console.log("Is Array:", Array.isArray(response.data?.data));

            setQuizzes(response.data?.data?.content || []);
        } catch (error) {
            console.error("Error fetching quizzes:", error);
        }
    };

    useEffect(() => {
        fetchQuizzes();
    }, []);

    useEffect(() => {
        if (courseId || moduleId || lessonId) {
            fetchQuizzes();
        }
    }, [courseId, moduleId, lessonId]);

    const quizArray = Array.isArray(quizzes) ? quizzes : [];

    const tabFiltered = activeTab === "All Quizzes" ? quizArray
        : activeTab === "Upcoming" ? quizArray.filter(i => i.status === "Upcoming")
            : activeTab === "Attempted" ? quizArray.filter(i => i.status === "Completed" || i.status === "In Progress")
                : activeTab === "Quiz Results" ? quizArray.filter(i => i.status === "Completed")
                    : quizzes;

    const filteredQuizzes = selectedCourse === "All Courses"
        ? tabFiltered : tabFiltered.filter(i => i.course === selectedCourse);

    

    const totalQuizzes = quizArray.length;

    const attemptedQuizzes = quizArray.filter(
        q => q.status === "Completed" || q.status === "In Progress"
    ).length;

    const completedQuizzes = quizArray.filter(
        q => q.status === "Completed"
    );

    const avgScore =
        completedQuizzes.length > 0
            ? Math.round(
                completedQuizzes.reduce(
                    (sum, q) => sum + Number(q.score || 0),
                    0
                ) / completedQuizzes.length
            )
            : 0;

    const correctAnswers =
        completedQuizzes.length > 0
            ? Math.round(
                completedQuizzes.reduce(
                    (sum, q) => sum + Number(q.score || 0),
                    0
                ) / completedQuizzes.length
            )
            : 0;

    return (
        <div className="p-3 sm:p-5 md:p-6 min-h-screen bg-[#f7f8fc]">
            <div className="max-w-7xl mx-auto">

                {/* HEADER */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                    <div>
                        <p className="text-sm text-gray-400 mb-1">
                            <Link to="/student/dashboard" className="hover:text-blue-600 transition">Dashboard</Link>
                            <span className="mx-2">&gt;</span>
                            <span className="text-gray-600 font-medium">Quizzes</span>
                        </p>
                        <h1 className="text-xl font-bold text-[#1d1642]">Quizzes</h1>
                        <p className="text-sm text-gray-500 mt-2">Test your knowledge and track your progress</p>
                    </div>
                    <select value={selectedCourse} onChange={e => setSelectedCourse(e.target.value)}
                        style={{ padding: "10px 18px", background: "#f8fafc", border: "1.5px solid #e2e8f0", borderRadius: 11, cursor: "pointer", fontWeight: 600, fontSize: 13, color: "#475569" }}>
                        <option>All Courses</option>
                        <option>Marketing</option><option>SEO</option><option>Google Ads</option><option>Email Marketing</option>
                    </select>
                </div>

                {/* STATS */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {[
                        {
                            label: "Total Quizzes",
                            val: totalQuizzes,
                            icon: <MdQuiz className="text-[#7c3aed] text-[24px]" />,
                            bg: "bg-[#f3ebff]"
                        },
                        {
                            label: "Attempted",
                            val: attemptedQuizzes,
                            icon: <FaClipboardCheck className="text-[#2563eb] text-[22px]" />,
                            bg: "bg-[#e9f2ff]"
                        },
                        {
                            label: "Correct Answers",
                            val: `${correctAnswers}%`,
                            icon: <FaCheckCircle className="text-[#16a34a] text-[22px]" />,
                            bg: "bg-[#eafaf0]"
                        },
                        {
                            label: "Avg. Score",
                            val: `${avgScore}%`,
                            icon: <FaTrophy className="text-[#f59e0b] text-[22px]" />,
                            bg: "bg-[#fff5e7]"
                        }
                    ].map(s => (
                        <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3 shadow-sm">
                            <div className={`w-[52px] h-[52px] rounded-xl ${s.bg} flex items-center justify-center`}>{s.icon}</div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium">{s.label}</p>
                                <h2 className="text-2xl font-bold text-[#1d1642]">{s.val}</h2>
                            </div>
                        </div>
                    ))}
                </div>

                {/* TABS */}
                <div className="flex items-center gap-8 border-b border-gray-200 overflow-x-auto mb-6">
                    {["All Quizzes", "Upcoming", "Attempted", "Quiz Results"].map(tab => (
                        <button key={tab} onClick={() => setActiveTab(tab)}
                            className={`pb-4 whitespace-nowrap text-sm font-semibold border-b-[3px] transition ${activeTab === tab ? "border-[#6d28d9] text-[#6d28d9]" : "border-transparent text-gray-500"}`}>
                            {tab}
                        </button>
                    ))}
                </div>

                {/* QUIZ LIST */}
                <div className="space-y-4">
                    {filteredQuizzes.map(quiz => {
                        const c = colorMap[quiz.color] || colorMap.gray;
                        return (
                            <div key={quiz.id} className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-5 shadow-sm">
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <div className={`w-[60px] h-[60px] rounded-full flex items-center justify-center shrink-0 ${c.bg}`}>
                                        <MdQuiz className={`text-[30px] ${c.text}`} />
                                    </div>
                                    <div>
                                        <h2 className="text-sm font-bold text-[#1d1642]">{quiz.title}</h2>
                                        <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-500">
                                            <span>{quiz.module}</span><span>•</span><span>{quiz.questions}</span>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-gray-500">
                                            <div className="flex items-center gap-2"><FaCalendarAlt /><span>{quiz.date}</span></div>
                                            <span>•</span>
                                            <div className="flex items-center gap-2"><HiOutlineClock /><span>{quiz.duration}</span></div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between lg:justify-end gap-6">
                                    <div className="text-right flex flex-col items-end gap-2">
                                        {quiz.status === "Completed" && (
                                            <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
                                                {sentRequests[quiz.id] ? (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-xs font-bold text-blue-600">
                                                        <FaCheckCircle className="text-blue-500 text-[10px]" /> Request Sent
                                                    </span>
                                                ) : (
                                                    <button onClick={(e) => { e.stopPropagation(); handleSendRequest(quiz.id); }}
                                                        className="px-3 py-1.5 rounded-full border border-dashed border-teal-300 text-teal-600 bg-teal-50 hover:bg-teal-100 text-xs font-bold transition cursor-pointer">
                                                        Send Request
                                                    </button>
                                                )}
                                                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#eafaf0] text-[#16a34a] text-sm font-semibold"><FaCheck className="text-[11px]" />Completed</span>
                                            </div>
                                        )}
                                        {quiz.status === "In Progress" && <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#fff7e8] text-[#f59e0b] text-sm font-semibold"><FaTrophy className="text-[11px]" />In Progress</span>}
                                        {quiz.status === "Upcoming" && <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#edf4ff] text-[#2563eb] text-sm font-semibold"><FaHourglassHalf className="text-[11px]" />Upcoming</span>}
                                        {quiz.status === "Not Attempted" && <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-gray-600 text-sm font-semibold">Not Attempted</span>}
                                        <div className="mt-1">
                                            {quiz.status === "Completed" && (
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center"><FaTrophy className="text-green-600 text-lg" /></div>
                                                    <div className="flex flex-col text-center">
                                                        <span className="text-xs text-gray-500">Score</span>
                                                        <span className="text-2xl font-bold text-green-600 leading-none mt-1">{quiz.score}</span>
                                                    </div>
                                                </div>
                                            )}
                                            {quiz.status === "In Progress" && (<><h2 className="text-2xl font-bold text-[#1d1642] text-center">{quiz.score}</h2><p className="text-sm text-gray-500 text-center">Answered</p></>)}
                                            {quiz.status === "Upcoming" && (<><p className="text-sm text-gray-500 text-center">Starts in</p><h2 className="text-2xl font-bold text-[#1d1642] text-center">{quiz.score}</h2></>)}
                                        </div>
                                    </div>
                                    <button onClick={() => setSelectedQuiz(quiz)}
                                        className="w-[40px] h-[40px] rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition">
                                        <FaChevronRight className="text-gray-500" />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {quizArray.length === 0 && (
                <div className="text-center py-10 bg-gray-100 rounded-xl">
                    No quizzes available
                </div>
            )}

                {/* BOTTOM CTA */}
                <div className="mt-8 bg-[#f6f0ff] border border-[#ede2ff] rounded-xl p-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
                    <div>
                        <h2 className="text-2xl font-bold text-[#4320a5]">Ready for a Challenge?</h2>
                        <p className="text-gray-600 mt-2 text-sm">Take quizzes regularly to boost your learning.</p>
                    </div>
                    <button className="h-[50px] px-8 bg-[#6d28d9] hover:bg-[#5b21b6] transition rounded-xl text-white font-semibold text-sm">
                        Browse All Quizzes →
                    </button>
                </div>
            </div>

            {/* DRAWER */}
            {selectedQuiz && (
                <QuizDetailDrawer
                    quiz={selectedQuiz}
                    onClose={() => setSelectedQuiz(null)}
                    onStartQuiz={q => setQuizPlayerState({ quiz: q, mode: "start" })}
                    onResumeQuiz={q => setQuizPlayerState({ quiz: q, mode: "resume" })}
                    onRetakeQuiz={q => setQuizPlayerState({ quiz: q, mode: "retake" })}
                    onViewAnalytics={q => setAnalyticsQuiz(q)}
                    isRequestSent={sentRequests[selectedQuiz.id]}
                    onSendRequest={handleSendRequest}
                />
            )}

            {/* QUIZ PLAYER — fullscreen */}
            {quizPlayerState && (
                <QuizPlayer
                    quiz={quizPlayerState.quiz}
                    mode={quizPlayerState.mode}
                    onClose={() => setQuizPlayerState(null)}
                    onComplete={(id, pct) => console.log(`Quiz ${id} completed: ${pct}%`)}
                    isRequestSent={sentRequests[quizPlayerState.quiz.id]}
                    onSendRequest={handleSendRequest}
                />
            )}

            {/* ANALYTICS */}
            {analyticsQuiz && (
                <AnalyticsModal quiz={analyticsQuiz} onClose={() => setAnalyticsQuiz(null)} />
            )}
        </div>
    );
};

export default Quizzes;