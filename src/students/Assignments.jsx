import React, { useMemo, useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
  FaFileAlt,
  FaFilePdf,
  FaFileExcel,
  FaFilePowerpoint,
  FaDownload,
  FaArrowLeft,
  FaUpload,
  FaRedo,
  FaCommentAlt,
  FaCheckCircle,
  FaEye,
  FaQuoteLeft,
  FaClipboardList,
  FaClock,
  FaExclamationTriangle,
  FaLightbulb,
  FaListUl,
  FaStar,
  FaChartBar,
  FaCalendarAlt,
  FaUser,
  FaTrophy,
  FaInfoCircle,
} from "react-icons/fa";

/* ─────────────────────────────────────────────
   Static data
───────────────────────────────────────────── */
const assignments = [
  {
    id: 1,
    title: "SEO Keywords Research Report",
    course: "Search Engine Optimization (SEO)",
    desc: "Find and analyze 10 SEO keywords for a given niche.",
    fullDesc:
      "You are required to research and analyze 10 high-value SEO keywords for a niche of your choice. Use industry-standard tools such as Google Keyword Planner, Ahrefs, SEMrush, or Ubersuggest to gather data. Your report must include search volume, keyword difficulty, CPC, and a clear rationale for each selection. Additionally, provide a competitive analysis of the top 3 ranking pages for your primary keyword and suggest a content strategy based on your findings.",
    dueDate: "20 May 2024, 11:59 PM",
    submittedDate: null,
    marks: 100,
    scored: null,
    status: "Pending",
    rubric: [
      { label: "Keyword selection quality", total: 25 },
      { label: "Data accuracy & tool usage", total: 25 },
      { label: "Competitive analysis depth", total: 25 },
      { label: "Content strategy recommendation", total: 25 },
    ],
    resources: [
      { name: "Assignment_Guidelines.pdf", size: "1.2 MB", type: "pdf" },
      { name: "Keyword_Research_Template.xlsx", size: "340 KB", type: "xlsx" },
    ],
    tips: [
      "Use at least 2 different keyword research tools and cross-reference the data.",
      "Focus on long-tail keywords with moderate difficulty for better ranking chances.",
      "Include screenshot evidence from your tools to support your findings.",
      "Cite your sources and mention the date data was collected.",
    ],
    checklist: [
      "Identified 10 relevant keywords with supporting data",
      "Included search volume, difficulty, and CPC for each",
      "Provided competitive analysis for primary keyword",
      "Proposed a content strategy with at least 3 content ideas",
      "Report is formatted clearly with sections and headings",
    ],
  },
  {
    id: 2,
    title: "Social Media Strategy Plan",
    course: "Social Media Marketing",
    desc: "Create a 7-day social media strategy.",
    fullDesc:
      "Design a comprehensive 7-day social media content strategy for a brand of your choice. The plan must cover at least 2 platforms (Instagram, LinkedIn, Twitter/X, TikTok, or Facebook). Include post types, content pillars, captions, hashtag strategy, optimal posting times, and engagement tactics. Your strategy should align with specific marketing goals (e.g., brand awareness, lead generation).",
    dueDate: "22 May 2024, 11:59 PM",
    submittedDate: "21 May 2024, 9:43 PM",
    marks: 100,
    scored: null,
    status: "Submitted",
    resources: [
      { name: "Social_Strategy_7Day.pdf", size: "2.8 MB", type: "pdf" },
      { name: "Strategy_Deck.pptx", size: "5.1 MB", type: "pptx" },
    ],
    submissionNote:
      "I focused on Instagram and LinkedIn for the 7-day plan as they align best with the target audience. Let me know if you'd like me to add TikTok coverage.",
    history: [
      { label: "Final submission", time: "21 May 2024, 9:43 PM", type: "success" },
      { label: "Draft saved", time: "20 May 2024, 6:15 PM", type: "draft" },
      { label: "Assignment viewed", time: "18 May 2024, 2:00 PM", type: "view" },
    ],
  },
  {
    id: 3,
    title: "Google Ads Campaign Setup",
    course: "Google Ads & PPC",
    desc: "Set up a Google Ads campaign and share the report.",
    fullDesc:
      "Set up a complete Google Ads Search campaign for a product or service. Your submission must include campaign structure, ad groups, keyword lists with match types, responsive search ads, and a budget/bidding strategy. Export a performance report from Google Ads and analyse the key metrics. Include screenshots of your campaign dashboard.",
    dueDate: "25 May 2024, 11:59 PM",
    submittedDate: "24 May 2024, 4:10 PM",
    marks: 100,
    scored: 87,
    status: "Graded",
    grade: "B+",
    gradedBy: "Instructor Sarah K.",
    gradedOn: "27 May 2024",
    feedback:
      "Great campaign structure and keyword selection. The ad copy was compelling, though the negative keyword list could be more comprehensive. Budget allocation across ad groups was well thought out. Overall strong effort!",
    rubric: [
      { label: "Campaign structure & setup", score: 27, total: 30 },
      { label: "Keyword strategy", score: 22, total: 25 },
      { label: "Ad copy quality", score: 20, total: 25 },
      { label: "Budget & bidding", score: 16, total: 20 },
    ],
    resources: [
      { name: "GoogleAds_Campaign_Report.pdf", size: "3.4 MB", type: "pdf" },
    ],
  },
  {
    id: 4,
    title: "Email Marketing Plan",
    course: "Email Marketing",
    desc: "Design an email marketing plan.",
    fullDesc:
      "Create a full email marketing campaign plan for a product launch. Your plan must include: audience segmentation strategy, welcome/nurture sequence (minimum 5 emails), subject line variants for A/B testing, email design wireframes or mockups, and KPIs you would track. Explain your ESP choice and how automation would be configured.",
    dueDate: "28 May 2024, 11:59 PM",
    submittedDate: null,
    marks: 100,
    scored: null,
    status: "Pending",
    rubric: [
      { label: "Audience segmentation", total: 20 },
      { label: "Email sequence quality", total: 30 },
      { label: "Design & copy", total: 25 },
      { label: "Analytics & KPIs", total: 25 },
    ],
    resources: [
      { name: "Email_Plan_Guidelines.pdf", size: "980 KB", type: "pdf" },
      { name: "Email_Wireframe_Template.pdf", size: "1.5 MB", type: "pdf" },
    ],
    tips: [
      "Map each email in your sequence to a specific stage of the buyer journey.",
      "Write at least 3 subject line variants per email for A/B testing.",
      "Reference real ESP platforms like Mailchimp, Klaviyo, or HubSpot.",
      "Include open rate and CTR benchmarks for your industry as a baseline.",
    ],
    checklist: [
      "Defined audience segments with rationale",
      "Planned a minimum 5-email nurture sequence",
      "Written subject line A/B test variants",
      "Included email design wireframes or mockups",
      "Identified KPIs and how you would measure success",
    ],
  },
];

/* ─────────────────────────────────────────────
   Shared UI Components - Responsive
───────────────────────────────────────────── */
const statusStyle = {
  Pending: "bg-orange-100 text-orange-600",
  Submitted: "bg-green-100 text-green-600",
  Graded: "bg-blue-100 text-blue-600",
};
const iconBg = {
  Pending: "bg-orange-100 text-orange-500",
  Submitted: "bg-green-100 text-green-500",
  Graded: "bg-blue-100 text-blue-500",
};

function Badge({ status }) {
  return (
    <span className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold ${statusStyle[status]}`}>
      {status}
    </span>
  );
}

function SectionLabel({ children }) {
  return (
    <p className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 sm:mb-3">
      {children}
    </p>
  );
}

function InfoBox({ label, value, valueClass = "text-gray-800" }) {
  return (
    <div className="bg-gray-50 rounded-xl p-2 sm:p-3 border border-gray-100">
      <p className="text-[10px] sm:text-xs text-gray-400 font-semibold uppercase tracking-wide mb-1">{label}</p>
      <p className={`text-xs sm:text-sm font-bold ${valueClass}`}>{value}</p>
    </div>
  );
}

function FileRow({ name, size, type }) {
  const icons = {
    pdf: <FaFilePdf className="text-red-500 text-sm sm:text-base" />,
    xlsx: <FaFileExcel className="text-green-600 text-sm sm:text-base" />,
    pptx: <FaFilePowerpoint className="text-orange-500 text-sm sm:text-base" />,
    default: <FaFileAlt className="text-blue-500 text-sm sm:text-base" />,
  };
  const bg = { pdf: "bg-red-50", xlsx: "bg-green-50", pptx: "bg-orange-50", default: "bg-blue-50" };
  const ext = type || "default";
  return (
    <div className="flex items-center gap-2 sm:gap-3 bg-gray-50 rounded-xl p-2 sm:p-3 border border-gray-100">
      <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${bg[ext] || bg.default}`}>
        {icons[ext] || icons.default}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs sm:text-sm font-semibold text-gray-800 truncate">{name}</p>
        <p className="text-[10px] sm:text-xs text-gray-400">{size}</p>
      </div>
      <button className="text-gray-400 hover:text-blue-600 transition p-1" aria-label="Download">
        <FaDownload className="text-xs sm:text-sm" />
      </button>
    </div>
  );
}

function Tabs({ tabs, active, onChange }) {
  return (
    <div className="flex border-b border-gray-200 mb-4 sm:mb-6 overflow-x-auto">
      {tabs.map((t) => (
        <button
          key={t}
          onClick={() => onChange(t)}
          className={`pb-2 sm:pb-3 px-2 sm:px-1 mr-4 sm:mr-8 text-xs sm:text-sm font-semibold transition border-b-2 whitespace-nowrap ${active === t
            ? "border-blue-600 text-blue-600"
            : "border-transparent text-gray-400 hover:text-gray-700"
            }`}
        >
          {t}
        </button>
      ))}
    </div>
  );
}

/* Full-screen: Pending Detail - Responsive */
function PendingDetail({ assignment, onBack }) {
  const [uploadedFile, setUploadedFile] = useState(null);
  const fileInputRef = useRef(null);
  const daysLeft = (() => {
    const due = new Date(assignment.dueDate);
    const now = new Date(2024, 4, 18);
    return Math.max(0, Math.ceil((due - now) / 86400000));
  })();

  return (
    <div className="min-h-screen bg-[#f6f7fb] p-3 sm:p-4 md:p-5">
      {/* Breadcrumb */}
      <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-400 mb-2 sm:mb-4">
        <Link to="/student/dashboard" className="hover:text-blue-600">Dashboard</Link>
        <span>&gt;</span>
        <button onClick={onBack} className="hover:text-blue-600">Assignments</button>
        <span>&gt;</span>
        <span className="text-gray-600 font-medium truncate">{assignment.title}</span>
      </div>

      {/* Back button + title */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4 sm:mb-6">
        <button onClick={onBack} className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-xl bg-white border border-gray-200 text-gray-500 hover:bg-gray-100 transition shadow-sm">
          <FaArrowLeft className="text-xs sm:text-sm" />
        </button>
        <div className="flex-1">
          <h1 className="text-base sm:text-xl font-bold text-gray-900">{assignment.title}</h1>
          <p className="text-xs sm:text-sm text-gray-500">{assignment.course}</p>
        </div>
        <div className="sm:ml-auto">
          <Badge status={assignment.status} />
        </div>
      </div>

      <div className="flex flex-col lg:grid lg:grid-cols-12 gap-4 sm:gap-5">
        {/* Left column */}
        <div className="w-full lg:col-span-8 space-y-4 sm:space-y-5">
          <div className={`flex items-center gap-2 sm:gap-3 rounded-xl px-3 sm:px-4 py-2 sm:py-3 ${daysLeft <= 2 ? "bg-red-50 border border-red-200" : "bg-orange-50 border border-orange-200"}`}>
            <FaExclamationTriangle className={`flex-shrink-0 text-xs sm:text-sm ${daysLeft <= 2 ? "text-red-500" : "text-orange-400"}`} />
            <p className={`text-[11px] sm:text-sm font-semibold ${daysLeft <= 2 ? "text-red-600" : "text-orange-600"}`}>
              {daysLeft === 0 ? "Due today — submit before 11:59 PM!" : `${daysLeft} day${daysLeft > 1 ? "s" : ""} remaining`}
            </p>
            <span className="ml-auto text-[10px] sm:text-xs font-bold text-gray-400">{assignment.dueDate}</span>
          </div>

          <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6">
            <SectionLabel>Assignment Description</SectionLabel>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{assignment.fullDesc}</p>
          </div>

          {assignment.checklist && (
            <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6">
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <FaListUl className="text-blue-500 text-xs sm:text-sm" />
                <SectionLabel>Submission Checklist</SectionLabel>
              </div>
              <div className="space-y-2 sm:space-y-3">
                {assignment.checklist.map((item, i) => (
                  <label key={i} className="flex items-start gap-2 sm:gap-3 cursor-pointer group">
                    <input type="checkbox" className="mt-0.5 w-3.5 h-3.5 sm:w-4 sm:h-4 accent-blue-600 flex-shrink-0" />
                    <span className="text-[11px] sm:text-sm text-gray-600 group-hover:text-gray-900 transition">{item}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {assignment.tips && (
            <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6">
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <FaLightbulb className="text-yellow-500 text-xs sm:text-sm" />
                <SectionLabel>Tips for Success</SectionLabel>
              </div>
              <div className="space-y-2 sm:space-y-3">
                {assignment.tips.map((tip, i) => (
                  <div key={i} className="flex items-start gap-2 sm:gap-3">
                    <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-yellow-100 text-yellow-600 text-[10px] sm:text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <p className="text-[11px] sm:text-sm text-gray-600">{tip}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6">
            <SectionLabel>Submit Your Work</SectionLabel>
            <div
              className={`border-2 border-dashed rounded-xl p-4 sm:p-8 text-center transition cursor-pointer ${uploadedFile ? "border-green-400 bg-green-50" : "border-gray-200 hover:border-blue-400 hover:bg-blue-50"
                }`}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                ref={fileInputRef}
                accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx"
                style={{ display: "none" }}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setUploadedFile(file);
                }}
              />
              {uploadedFile ? (
                <>
                  <FaCheckCircle className="text-green-500 text-2xl sm:text-3xl mx-auto mb-2" />
                  <p className="text-xs sm:text-sm font-semibold text-green-700">File uploaded: {uploadedFile.name}</p>
                  <p className="text-[10px] sm:text-xs text-green-500 mt-1">Click to change file</p>
                </>
              ) : (
                <>
                  <FaUpload className="text-gray-300 text-2xl sm:text-3xl mx-auto mb-2" />
                  <p className="text-xs sm:text-sm font-semibold text-gray-500">Drag & drop your file here</p>
                  <p className="text-[10px] sm:text-xs text-gray-400 mt-1">or click to browse</p>
                </>
              )}
            </div>
            {uploadedFile && (
              <div className="mt-3 sm:mt-4">
                <label className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">
                  Notes to instructor (optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Add any notes or context about your submission..."
                  className="w-full border border-gray-200 rounded-xl p-2 sm:p-3 text-xs sm:text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none"
                />
              </div>
            )}
            <div className="flex justify-end gap-2 sm:gap-3 mt-3 sm:mt-4">
              <button onClick={onBack} className="px-3 sm:px-5 py-1.5 sm:py-2 rounded-xl border border-gray-200 text-xs sm:text-sm font-semibold text-gray-600 hover:bg-gray-100 transition">
                Cancel
              </button>
              <button
                disabled={!uploadedFile}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${uploadedFile
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
              >
                <FaUpload className="text-[10px] sm:text-xs" />
                Submit
              </button>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="w-full lg:col-span-4 space-y-4 sm:space-y-5">
          <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5">
            <SectionLabel>Assignment Info</SectionLabel>
            <div className="space-y-2 sm:space-y-3">
              <InfoBox label="Due Date" value={assignment.dueDate} valueClass="text-red-500" />
              <InfoBox label="Total Marks" value={assignment.marks} />
              <InfoBox label="Status" value="Not submitted" />
              <InfoBox label="Submission Type" value="File upload" />
            </div>
          </div>

          {assignment.rubric && (
            <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5">
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <FaChartBar className="text-blue-400 text-xs sm:text-sm" />
                <SectionLabel>Grading Rubric</SectionLabel>
              </div>
              <div className="space-y-2 sm:space-y-3">
                {assignment.rubric.map((r, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-[11px] sm:text-sm text-gray-600 flex-1 pr-2 sm:pr-3">{r.label}</span>
                    <span className="text-[11px] sm:text-sm font-bold text-gray-800 flex-shrink-0">{r.total} pts</span>
                  </div>
                ))}
                <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-bold text-gray-800">Total</span>
                  <span className="text-xs sm:text-sm font-bold text-blue-600">
                    {assignment.rubric.reduce((a, r) => a + r.total, 0)} pts
                  </span>
                </div>
              </div>
            </div>
          )}

          {assignment.resources && (
            <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5">
              <SectionLabel>Resources</SectionLabel>
              <div className="space-y-2">
                {assignment.resources.map((f, i) => (
                  <FileRow key={i} name={f.name} size={f.size} type={f.type} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* Full-screen: Submitted Detail - Responsive */
function SubmittedDetail({ assignment, onBack }) {
  const [tab, setTab] = useState("Submitted Files");
  const historyIconMap = {
    success: <FaCheckCircle className="text-green-500 text-xs sm:text-sm" />,
    draft: <FaRedo className="text-orange-400 text-xs sm:text-sm" />,
    view: <FaEye className="text-gray-400 text-xs sm:text-sm" />,
  };

  return (
    <div className="min-h-screen bg-[#f6f7fb] p-3 sm:p-4 md:p-5">
      <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-400 mb-2 sm:mb-4">
        <Link to="/student/dashboard" className="hover:text-blue-600">Dashboard</Link>
        <span>&gt;</span>
        <button onClick={onBack} className="hover:text-blue-600">Assignments</button>
        <span>&gt;</span>
        <span className="text-gray-600 font-medium truncate">{assignment.title}</span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4 sm:mb-6">
        <button onClick={onBack} className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-xl bg-white border border-gray-200 text-gray-500 hover:bg-gray-100 transition shadow-sm">
          <FaArrowLeft className="text-xs sm:text-sm" />
        </button>
        <div className="flex-1">
          <h1 className="text-base sm:text-xl font-bold text-gray-900">{assignment.title}</h1>
          <p className="text-xs sm:text-sm text-gray-500">{assignment.course}</p>
        </div>
        <div className="sm:ml-auto">
          <Badge status={assignment.status} />
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 bg-green-50 border border-green-200 rounded-xl px-3 sm:px-4 py-2 sm:py-3 mb-4 sm:mb-6">
        <FaCheckCircle className="text-green-500 flex-shrink-0 text-xs sm:text-sm" />
        <p className="text-[11px] sm:text-sm font-semibold text-green-700">
          Submitted on time — {assignment.submittedDate}
        </p>
      </div>

      <div className="flex flex-col lg:grid lg:grid-cols-12 gap-4 sm:gap-5">
        <div className="w-full lg:col-span-8">
          <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6">
            <Tabs tabs={["Submitted Files", "Submission History"]} active={tab} onChange={setTab} />
            {tab === "Submitted Files" && (
              <div className="space-y-4 sm:space-y-5">
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  <InfoBox label="Submitted on" value={assignment.submittedDate} />
                  <InfoBox label="Status" value="On time ✓" valueClass="text-green-600" />
                  <InfoBox label="Total Marks" value={assignment.marks} />
                  <InfoBox label="Grading" value="Awaiting review" valueClass="text-orange-500" />
                </div>
                <div>
                  <SectionLabel>Your Submitted Files</SectionLabel>
                  <div className="space-y-2">
                    {assignment.resources.map((f, i) => (
                      <FileRow key={i} name={f.name} size={f.size} type={f.type} />
                    ))}
                  </div>
                </div>
                {assignment.submissionNote && (
                  <div>
                    <SectionLabel>Notes to Instructor</SectionLabel>
                    <div className="bg-gray-50 rounded-xl p-3 sm:p-4 text-xs sm:text-sm text-gray-600 leading-relaxed border border-gray-100">
                      {assignment.submissionNote}
                    </div>
                  </div>
                )}
              </div>
            )}
            {tab === "Submission History" && (
              <div className="space-y-0">
                {assignment.history.map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-3 sm:py-4 border-b border-gray-100 last:border-0">
                    <div className="flex items-center gap-2 sm:gap-3 text-[11px] sm:text-sm text-gray-700">
                      {historyIconMap[item.type]}
                      {item.label}
                    </div>
                    <span className="text-[10px] sm:text-xs text-gray-400">{item.time}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="w-full lg:col-span-4 space-y-4 sm:space-y-5">
          <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5">
            <SectionLabel>Assignment Info</SectionLabel>
            <div className="space-y-2 sm:space-y-3">
              <InfoBox label="Due Date" value={assignment.dueDate} />
              <InfoBox label="Total Marks" value={assignment.marks} />
              <InfoBox label="Course" value={assignment.course} />
            </div>
          </div>
          <div className="flex gap-2 sm:gap-3">
            <button onClick={onBack} className="flex-1 py-2 sm:py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm font-semibold text-gray-600 hover:bg-gray-100 transition">
              Back
            </button>
            <button className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-2 sm:py-2.5 rounded-xl bg-blue-600 text-white text-xs sm:text-sm font-semibold hover:bg-blue-700 transition">
              <FaRedo className="text-[10px] sm:text-xs" /> Resubmit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Full-screen: Graded Detail - Responsive */
function GradedDetail({ assignment, onBack }) {
  const [tab, setTab] = useState("Grade & Feedback");
  const totalScore = assignment.rubric?.reduce((a, r) => a + r.score, 0) ?? 0;
  const totalMax = assignment.rubric?.reduce((a, r) => a + r.total, 0) ?? 100;
  const pct = Math.round((totalScore / totalMax) * 100);
  const gradeColor = pct >= 90 ? "text-green-600" : pct >= 75 ? "text-blue-600" : pct >= 60 ? "text-orange-500" : "text-red-500";
  const ringColor = pct >= 90 ? "border-green-400" : pct >= 75 ? "border-blue-400" : pct >= 60 ? "border-orange-400" : "border-red-400";
  const ringBg = pct >= 90 ? "bg-green-50" : pct >= 75 ? "bg-blue-50" : pct >= 60 ? "bg-orange-50" : "bg-red-50";

  return (
    <div className="min-h-screen bg-[#f6f7fb] p-3 sm:p-4 md:p-5">
      <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-400 mb-2 sm:mb-4">
        <Link to="/student/dashboard" className="hover:text-blue-600">Dashboard</Link>
        <span>&gt;</span>
        <button onClick={onBack} className="hover:text-blue-600">Assignments</button>
        <span>&gt;</span>
        <span className="text-gray-600 font-medium truncate">{assignment.title}</span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4 sm:mb-6">
        <button onClick={onBack} className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-xl bg-white border border-gray-200 text-gray-500 hover:bg-gray-100 transition shadow-sm">
          <FaArrowLeft className="text-xs sm:text-sm" />
        </button>
        <div className="flex-1">
          <h1 className="text-base sm:text-xl font-bold text-gray-900">{assignment.title}</h1>
          <p className="text-xs sm:text-sm text-gray-500">{assignment.course}</p>
        </div>
        <div className="sm:ml-auto">
          <Badge status={assignment.status} />
        </div>
      </div>

      <div className="flex flex-col lg:grid lg:grid-cols-12 gap-4 sm:gap-5">
        <div className="w-full lg:col-span-8">
          <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6">
            <Tabs tabs={["Grade & Feedback", "Rubric Breakdown"]} active={tab} onChange={setTab} />
            {tab === "Grade & Feedback" && (
              <div className="space-y-4 sm:space-y-6">
                <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 bg-gray-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-100">
                  <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 ${ringColor} ${ringBg} flex flex-col items-center justify-center flex-shrink-0`}>
                    <span className={`text-2xl sm:text-3xl font-black leading-none ${gradeColor}`}>{totalScore}</span>
                    <span className="text-[10px] sm:text-xs text-gray-400 font-semibold">/ {totalMax}</span>
                  </div>
                  <div className="text-center sm:text-left">
                    <div className="flex items-center gap-2 sm:gap-3 mb-1 justify-center sm:justify-start">
                      <span className={`text-xl sm:text-2xl font-black ${gradeColor}`}>{assignment.grade}</span>
                      <FaTrophy className="text-yellow-400 text-base sm:text-lg" />
                    </div>
                    <p className="text-xs sm:text-sm text-gray-500 mb-2">
                      You scored <strong className={gradeColor}>{pct}%</strong> on this assignment.
                    </p>
                    <div className="flex gap-1.5 sm:gap-2 flex-wrap justify-center sm:justify-start">
                      <span className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold ${statusStyle.Graded}`}>Graded</span>
                      <span className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold bg-gray-100 text-gray-600">
                        {pct >= 90 ? "Excellent" : pct >= 75 ? "Good work" : pct >= 60 ? "Satisfactory" : "Needs improvement"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  <InfoBox label="Graded by" value={assignment.gradedBy} />
                  <InfoBox label="Graded on" value={assignment.gradedOn} />
                  <InfoBox label="Marks scored" value={`${totalScore} / ${totalMax}`} valueClass={gradeColor} />
                  <InfoBox label="Percentage" value={`${pct}%`} valueClass={gradeColor} />
                </div>
                <div>
                  <SectionLabel>Instructor Feedback</SectionLabel>
                  <div className="bg-green-50 rounded-xl p-3 sm:p-5 text-xs sm:text-sm text-green-800 leading-relaxed border border-green-100">
                    <FaQuoteLeft className="inline mr-1 sm:mr-2 text-green-400 text-[10px] sm:text-xs mb-0.5" />
                    {assignment.feedback}
                  </div>
                </div>
                <div>
                  <SectionLabel>Your Submission</SectionLabel>
                  <div className="space-y-2">
                    {assignment.resources.map((f, i) => (
                      <FileRow key={i} name={f.name} size={f.size} type={f.type} />
                    ))}
                  </div>
                </div>
              </div>
            )}
            {tab === "Rubric Breakdown" && (
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between bg-blue-50 rounded-xl p-3 sm:p-4 border border-blue-100 mb-4 sm:mb-6">
                  <div>
                    <p className="text-[10px] sm:text-xs text-blue-400 font-bold uppercase tracking-wide mb-1">Total Score</p>
                    <p className={`text-xl sm:text-2xl font-black ${gradeColor}`}>{totalScore} <span className="text-xs sm:text-sm font-semibold text-gray-400">/ {totalMax}</span></p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] sm:text-xs text-blue-400 font-bold uppercase tracking-wide mb-1">Grade</p>
                    <p className={`text-xl sm:text-2xl font-black ${gradeColor}`}>{assignment.grade}</p>
                  </div>
                </div>
                {assignment.rubric?.map((r, i) => {
                  const rPct = Math.round((r.score / r.total) * 100);
                  const barColor = rPct >= 90 ? "bg-green-500" : rPct >= 75 ? "bg-blue-500" : rPct >= 60 ? "bg-orange-400" : "bg-red-400";
                  return (
                    <div key={i} className="bg-gray-50 rounded-xl p-3 sm:p-4 border border-gray-100">
                      <div className="flex justify-between text-[11px] sm:text-sm mb-2">
                        <span className="text-gray-700 font-semibold">{r.label}</span>
                        <span className="font-bold text-gray-900">{r.score} / {r.total}</span>
                      </div>
                      <div className="h-1.5 sm:h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all duration-700 ${barColor}`} style={{ width: `${rPct}%` }} />
                      </div>
                      <p className="text-[10px] sm:text-xs text-gray-400 mt-1">{rPct}% of available marks</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
        <div className="w-full lg:col-span-4 space-y-4 sm:space-y-5">
          <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5 text-center">
            <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full border-4 ${ringColor} ${ringBg} flex flex-col items-center justify-center mx-auto mb-2 sm:mb-3`}>
              <span className={`text-lg sm:text-xl font-black leading-none ${gradeColor}`}>{pct}%</span>
            </div>
            <p className="text-xs sm:text-sm font-bold text-gray-900">{totalScore} / {totalMax} marks</p>
            <p className="text-[10px] sm:text-xs text-gray-400 mt-1">
              {pct >= 90 ? "Outstanding performance!" : pct >= 75 ? "Good performance" : pct >= 60 ? "Passing grade" : "Below passing grade"}
            </p>
          </div>
          <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5">
            <SectionLabel>Assignment Info</SectionLabel>
            <div className="space-y-2 sm:space-y-3">
              <InfoBox label="Total Marks" value={assignment.marks} />
              <InfoBox label="Marks Scored" value={totalScore} valueClass={gradeColor} />
              <InfoBox label="Due Date" value={assignment.dueDate} />
              <InfoBox label="Submitted" value={assignment.submittedDate} />
            </div>
          </div>
          <button className="w-full flex items-center justify-center gap-1.5 sm:gap-2 py-2 sm:py-2.5 rounded-xl bg-blue-600 text-white text-xs sm:text-sm font-semibold hover:bg-blue-700 transition">
            <FaCommentAlt className="text-[10px] sm:text-xs" />
            Message Instructor
          </button>
        </div>
      </div>
    </div>
  );
}

function parseDueDate(str) {
  // "20 May 2024, 11:59 PM" → Date object (day only)
  const [day, month, yearComma] = str.split(" ");
  const year = yearComma.replace(",", "");
  return new Date(`${month} ${day}, ${year}`);
}

/* Main Assignments page - Responsive */
const Assignments = () => {
  const [selectedCalDate, setSelectedCalDate] = useState(null);
  const [activeTab, setActiveTab] = useState("All");
  const [selected, setSelected] = useState(null);
  const tabs = ["All", "Pending", "Submitted", "Graded"];
  const filtered = useMemo(() => {
    if (activeTab === "All") return assignments;
    return assignments.filter((a) => a.status === activeTab);
  }, [activeTab]);
  const overview = [
    { label: "Total Assignments", value: assignments.length, color: "bg-blue-100 text-blue-600" },
    { label: "Pending", value: assignments.filter((a) => a.status === "Pending").length, color: "bg-orange-100 text-orange-600" },
    { label: "Submitted", value: assignments.filter((a) => a.status === "Submitted").length, color: "bg-green-100 text-green-600" },
    { label: "Graded", value: assignments.filter((a) => a.status === "Graded").length, color: "bg-purple-100 text-purple-600" },
  ];
  const [currentDate, setCurrentDate] = useState(new Date(2024, 4, 1));
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const calendarDays = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];

  function buttonLabel(status) {
    if (status === "Submitted") return "View Submission";
    if (status === "Graded") return "View Grade";
    return "View Details";
  }

  if (selected) {
    const a = selected;
    const onBack = () => setSelected(null);
    if (a.status === "Pending") return <PendingDetail assignment={a} onBack={onBack} />;
    if (a.status === "Submitted") return <SubmittedDetail assignment={a} onBack={onBack} />;
    if (a.status === "Graded") return <GradedDetail assignment={a} onBack={onBack} />;
  }

  const dueDateMap = useMemo(() => {
  const map = {};
  assignments.forEach((a) => {
    const d = parseDueDate(a.dueDate);
    const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    if (!map[key]) map[key] = [];
    map[key].push(a);
  });
  return map;
}, []);

  return (
    <div className="min-h-screen bg-[#f6f7fb] p-3 sm:p-4 md:p-5">
      <div className="flex flex-col lg:grid lg:grid-cols-12 gap-4 sm:gap-5">
        {/* Left Section */}
        <div className="w-full lg:col-span-9">
          <div className="mb-4 sm:mb-5">
            <p className="text-xs sm:text-sm text-gray-400 mb-1">
              <Link to="/student/dashboard" className="hover:text-blue-600 transition">Dashboard</Link>
              <span className="mx-1 sm:mx-2">&gt;</span>
              <span className="text-gray-600 font-medium">Assignments</span>
            </p>
            <h1 className="text-lg sm:text-xl font-bold text-gray-900">Assignments</h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">
              Complete assignments to enhance your learning and track your progress.
            </p>
          </div>

          <div className="flex gap-4 sm:gap-8 border-b border-gray-200 mb-4 sm:mb-6 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-2 sm:pb-3 text-xs sm:text-sm font-semibold transition whitespace-nowrap ${activeTab === tab
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-blue-600"
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="space-y-3 sm:space-y-4">
            {filtered.map((item) => (
              <div key={item.id} className="bg-white border border-gray-100 rounded-xl p-3 sm:p-4 shadow-sm hover:shadow-md transition">
                <div className="flex flex-col gap-3">
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-full flex items-center justify-center flex-shrink-0 ${iconBg[item.status]}`}>
                      <FaFileAlt className="text-base sm:text-xl" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="font-bold text-gray-900 text-sm sm:text-base">{item.title}</h2>
                      <p className="text-[11px] sm:text-sm font-semibold text-gray-700 mt-0.5 sm:mt-1">{item.course}</p>
                      <p className="text-[10px] sm:text-sm text-gray-500 mt-0.5 sm:mt-1 line-clamp-2">{item.desc}</p>
                    </div>
                    <div className="flex-shrink-0">
                      <Badge status={item.status} />
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-gray-100">
                    <div>
                      <p className="text-[9px] sm:text-xs text-gray-400 font-semibold">Due Date</p>
                      <p className="text-[10px] sm:text-sm font-bold text-red-500">{item.dueDate.split(',')[0]}</p>
                    </div>
                    <div>
                      <p className="text-[9px] sm:text-xs text-gray-400 font-semibold">Marks</p>
                      {item.status === "Graded" ? (
                        <p className="text-[10px] sm:text-sm font-bold text-blue-600">{item.scored}/{item.marks}</p>
                      ) : (
                        <p className="text-[10px] sm:text-sm font-bold text-gray-800">{item.marks}</p>
                      )}
                    </div>
                    <button onClick={() => setSelected(item)} className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg border border-blue-500 text-blue-600 text-[10px] sm:text-sm font-semibold hover:bg-blue-600 hover:text-white transition">
                      {buttonLabel(item.status)}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Sidebar - Responsive */}
        <div className="w-full lg:col-span-3 space-y-4 sm:space-y-5">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 sm:p-5">
            <h2 className="font-bold text-gray-900 text-sm sm:text-base mb-3 sm:mb-5">Assignment Overview</h2>
            <div className="space-y-2.5 sm:space-y-3">
              {overview.map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className={`w-7 h-7 sm:w-9 sm:h-9 rounded-full flex items-center justify-center ${item.color}`}>
                      <FaClipboardList className="text-xs sm:text-sm" />
                    </div>
                    <span className="text-[11px] sm:text-sm font-semibold text-gray-700">{item.label}</span>
                  </div>
                  <span className="font-bold text-gray-900 text-xs sm:text-sm">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5">
  {/* Header */}
  <div className="flex items-center justify-between mb-3 sm:mb-5">
    <button
      onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
      className="text-gray-400 text-base sm:text-xl hover:text-blue-600"
    >‹</button>
    <h2 className="font-bold text-gray-900 text-sm sm:text-base">
      {monthNames[month]} {year}
    </h2>
    <button
      onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
      className="text-gray-400 text-base sm:text-xl hover:text-blue-600"
    >›</button>
  </div>

  {/* Day name headers */}
  <div className="grid grid-cols-7 gap-1 sm:gap-3 text-center text-[9px] sm:text-xs text-gray-400 mb-2 sm:mb-3">
    {["Su","Mo","Tu","We","Th","Fr","Sa"].map((d) => <span key={d}>{d}</span>)}
  </div>

  {/* Day cells */}
  <div className="grid grid-cols-7 gap-1 sm:gap-3 text-center text-xs sm:text-sm">
    {calendarDays.map((date, i) => {
      if (!date) return <span key={i} />;
      const key = `${year}-${month}-${date}`;
      const items = dueDateMap[key];
      const statusColor = items
        ? items.some((a) => a.status === "Pending")
          ? "bg-orange-100 text-orange-600"
          : items.some((a) => a.status === "Submitted")
          ? "bg-green-100 text-green-600"
          : "bg-blue-100 text-blue-600"
        : "";
      const isSelected = selectedCalDate === key;
      return (
        <span
          key={i}
          onClick={() => items && setSelectedCalDate(isSelected ? null : key)}
          className={`w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center rounded-full mx-auto text-[11px] sm:text-sm relative
            ${items ? `cursor-pointer font-semibold ${statusColor}` : "text-gray-600"}
            ${isSelected ? "ring-2 ring-blue-500 ring-offset-1" : ""}
          `}
          title={items ? items.map((a) => a.title).join(", ") : ""}
        >
          {date}
          {items && (
            <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full
              ${items.some((a) => a.status === "Pending") ? "bg-orange-500"
                : items.some((a) => a.status === "Submitted") ? "bg-green-500"
                : "bg-blue-500"}`}
            />
          )}
        </span>
      );
    })}
  </div>

  {/* Legend */}
  <div className="flex flex-wrap gap-2 sm:gap-3 mt-3 pt-3 border-t border-gray-100">
    {[["bg-orange-500","Pending"],["bg-green-500","Submitted"],["bg-blue-500","Graded"]].map(([color, label]) => (
      <div key={label} className="flex items-center gap-1.5 text-[10px] sm:text-xs text-gray-500">
        <span className={`w-2 h-2 rounded-full ${color}`} />
        {label}
      </div>
    ))}
  </div>

  {/* Selected day panel */}
  {selectedCalDate && dueDateMap[selectedCalDate] ? (
    <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
      {dueDateMap[selectedCalDate].map((a, i) => (
        <div
          key={i}
          onClick={() => setSelected(a)}
          className="flex items-center justify-between bg-gray-50 rounded-xl p-2 sm:p-3 border border-gray-100 cursor-pointer hover:border-blue-200 hover:bg-blue-50 transition"
        >
          <div>
            <p className="text-[11px] sm:text-xs font-semibold text-gray-800 leading-tight">{a.title}</p>
            <p className="text-[10px] sm:text-xs text-gray-400 mt-0.5">Due {a.dueDate.split(",")[1]?.trim()}</p>
          </div>
          <Badge status={a.status} />
        </div>
      ))}
    </div>
  ) : selectedCalDate ? null : (
    <p className="text-[10px] sm:text-xs text-gray-400 text-center mt-3 pt-3 border-t border-gray-100">
      Tap a highlighted date to see due assignments
    </p>
  )}
</div>
        </div>
      </div>
    </div>
  );
};

export default Assignments;