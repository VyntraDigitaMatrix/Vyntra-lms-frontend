import React, { useState, useRef } from "react";
import {
  FaUser, FaShieldAlt, FaBell, FaGraduationCap, FaLock,
  FaCertificate, FaBriefcase, FaPalette, FaHeadset,
  FaExclamationTriangle, FaCamera, FaCheck, FaTimes,
  FaEye, FaEyeSlash, FaUpload, FaDownload, FaTrash,
  FaGoogle, FaGithub, FaLinkedin, FaMoon, FaSun,
  FaChevronRight, FaEdit, FaExternalLinkAlt, FaSave, FaKey, FaMobile,
  FaEnvelope, FaMapMarkerAlt, FaGlobe,
} from "react-icons/fa";

/* ══════════════════════════════
   NAV CONFIG
══════════════════════════════ */
const NAV_ITEMS = [
  { key: "account", label: "Account", icon: FaUser, color: "#3b82f6" },
  { key: "security", label: "Security", icon: FaShieldAlt, color: "#22c55e" },
  { key: "notifications", label: "Notifications", icon: FaBell, color: "#f59e0b" },
  { key: "learning", label: "Learning", icon: FaGraduationCap, color: "#a855f7" },
  { key: "privacy", label: "Privacy", icon: FaLock, color: "#64748b" },
  { key: "certificates", label: "Certificates", icon: FaCertificate, color: "#eab308" },
  { key: "resume", label: "Resume", icon: FaBriefcase, color: "#14b8a6" },
  { key: "appearance", label: "Appearance", icon: FaPalette, color: "#ec4899" },
  { key: "support", label: "Support", icon: FaHeadset, color: "#6366f1" },
  { key: "danger", label: "Danger Zone", icon: FaExclamationTriangle, color: "#ef4444" },
];

/* ══════════════════════════════
   REUSABLE COMPONENTS
══════════════════════════════ */
const SectionHeader = ({ title, description, icon: Icon, color }) => (
  <div className="flex items-center gap-4 mb-8">
    <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
      style={{ backgroundColor: color + "18", color }}>
      <Icon style={{ fontSize: 20 }} />
    </div>
    <div>
      <h2 className="text-xl font-bold text-gray-900">{title}</h2>
      {description && <p className="text-sm text-gray-500 mt-0.5">{description}</p>}
    </div>
  </div>
);

const Card = ({ children, className = "" }) => (
  <div className={`bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden ${className}`}>{children}</div>
);

const CardSection = ({ title, children, noBorder }) => (
  <div className={`p-5 sm:p-6 ${!noBorder ? "border-b border-gray-50 last:border-b-0" : ""}`}>
    {title && (
      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4">{title}</p>
    )}
    {children}
  </div>
);

const Toggle = ({ enabled, onChange, label, description }) => (
  <div className="flex items-center justify-between gap-4 py-1">
    <div className="flex-1 min-w-0">
      <p className="text-sm font-semibold text-gray-800">{label}</p>
      {description && <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{description}</p>}
    </div>
    <button
      onClick={() => onChange(!enabled)}
      className={`relative w-12 h-6 rounded-full transition-all flex-shrink-0 focus:outline-none ${enabled ? "bg-blue-500" : "bg-gray-200"}`}
    >
      <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${enabled ? "translate-x-6" : "translate-x-0"}`} />
    </button>
  </div>
);

const InputField = ({ label, type = "text", value, onChange, placeholder, hint, rightElement }) => (
  <div>
    {label && <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">{label}</label>}
    <div className="relative">
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full text-sm border border-gray-200 rounded-xl px-4 py-2.5 bg-gray-50 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 focus:bg-white transition pr-10"
      />
      {rightElement && <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">{rightElement}</div>}
    </div>
    {hint && <p className="text-xs text-gray-400 mt-1.5">{hint}</p>}
  </div>
);

const SelectField = ({ label, value, onChange, options }) => (
  <div>
    {label && <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">{label}</label>}
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full text-sm border border-gray-200 rounded-xl px-4 py-2.5 bg-gray-50 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 focus:bg-white transition appearance-none"
    >
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  </div>
);

const SaveButton = ({ onClick, saved }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${saved
        ? "bg-green-500 text-white scale-95"
        : "bg-blue-500 hover:bg-blue-600 text-white shadow-sm hover:shadow-md"
      }`}
  >
    {saved ? <><FaCheck style={{ fontSize: 11 }} /> Saved</> : <><FaSave style={{ fontSize: 11 }} /> Save Changes</>}
  </button>
);

/* ══════════════════════════════
   SECTION: ACCOUNT
══════════════════════════════ */
const AccountSection = () => {
  const [saved, setSaved] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [form, setForm] = useState({
    firstName: "Arjun", lastName: "Sharma",
    email: "arjun.sharma@email.com", phone: "+91 98765 43210",
    bio: "Passionate digital marketer learning SEO, PPC and content strategy.",
    location: "Mumbai, India", website: "https://arjunsharma.in",
    language: "en", timezone: "Asia/Kolkata",
  });
  const fileRef = useRef(null);
  const set = (key) => (val) => setForm(p => ({ ...p, [key]: val }));
  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <div className="space-y-5">
      <SectionHeader title="Account Settings" description="Manage your personal information and profile." icon={FaUser} color="#3b82f6" />

      {/* Profile card */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-6 flex items-center gap-5">
        <div className="relative flex-shrink-0">
          <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-white text-2xl font-black overflow-hidden border-2 border-white/30">
            {avatar ? <img src={avatar} alt="avatar" className="w-full h-full object-cover" /> : "AS"}
          </div>
          <button onClick={() => fileRef.current?.click()}
            className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-full bg-white text-blue-600 flex items-center justify-center shadow-lg hover:scale-110 transition">
            <FaCamera style={{ fontSize: 10 }} />
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden"
            onChange={e => { const f = e.target.files?.[0]; if (f) setAvatar(URL.createObjectURL(f)); }} />
        </div>
        <div className="text-white min-w-0">
          <p className="font-bold text-lg leading-tight">Arjun Sharma</p>
          <p className="text-white/70 text-sm mt-0.5">Student · Joined Jan 2024</p>
          <div className="flex gap-2 mt-3">
            <button onClick={() => fileRef.current?.click()}
              className="text-xs font-semibold bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-lg transition">
              Change Photo
            </button>
            {avatar && (
              <button onClick={() => setAvatar(null)}
                className="text-xs font-semibold bg-white/10 hover:bg-white/20 text-white/80 px-3 py-1.5 rounded-lg transition">
                Remove
              </button>
            )}
          </div>
        </div>
      </div>

      <Card>
        <CardSection title="Personal Info">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField label="First Name" value={form.firstName} onChange={set("firstName")} placeholder="First name" />
            <InputField label="Last Name" value={form.lastName} onChange={set("lastName")} placeholder="Last name" />
            <InputField label="Email Address" type="email" value={form.email} onChange={set("email")} placeholder="you@email.com"
              hint="Used for login and notifications" />
            <InputField label="Phone Number" value={form.phone} onChange={set("phone")} placeholder="+91 00000 00000" />
            <InputField label="Location" value={form.location} onChange={set("location")} placeholder="City, Country"
              rightElement={<FaMapMarkerAlt style={{ fontSize: 12 }} />} />
            <InputField label="Website / Portfolio" value={form.website} onChange={set("website")} placeholder="https://"
              rightElement={<FaGlobe style={{ fontSize: 12 }} />} />
          </div>
          <div className="mt-4">
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Bio</label>
            <textarea value={form.bio} onChange={e => set("bio")(e.target.value)} rows={3}
              placeholder="Tell us about yourself..."
              className="w-full text-sm border border-gray-200 rounded-xl px-4 py-2.5 bg-gray-50 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 focus:bg-white transition resize-none" />
          </div>
        </CardSection>

        <CardSection title="Locale">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SelectField label="Language" value={form.language} onChange={set("language")}
              options={[{ value: "en", label: "English" }, { value: "hi", label: "Hindi" }, { value: "ta", label: "Tamil" }, { value: "te", label: "Telugu" }]} />
            <SelectField label="Timezone" value={form.timezone} onChange={set("timezone")}
              options={[{ value: "Asia/Kolkata", label: "IST — Asia/Kolkata" }, { value: "America/New_York", label: "EST — New York" }, { value: "Europe/London", label: "GMT — London" }, { value: "Asia/Dubai", label: "GST — Dubai" }]} />
          </div>
        </CardSection>

        <div className="p-5 sm:p-6 flex justify-end bg-gray-50/50">
          <SaveButton onClick={handleSave} saved={saved} />
        </div>
      </Card>
    </div>
  );
};

/* ══════════════════════════════
   SECTION: SECURITY
══════════════════════════════ */
const SecuritySection = () => {
  const [showPwd, setShowPwd] = useState({ current: false, new: false, confirm: false });
  const [pwd, setPwd] = useState({ current: "", new: "", confirm: "" });
  const [twoFA, setTwoFA] = useState(false);
  const [saved, setSaved] = useState(false);

  const connectedApps = [
    { name: "Google", icon: <FaGoogle style={{ color: "#ea4335" }} />, connected: true, email: "arjun@gmail.com" },
    { name: "GitHub", icon: <FaGithub style={{ color: "#1f2328" }} />, connected: false, email: "" },
    { name: "LinkedIn", icon: <FaLinkedin style={{ color: "#0077b5" }} />, connected: true, email: "arjun-sharma" },
  ];

  const sessions = [
    { device: "Chrome on Windows", location: "Mumbai, IN", time: "Now (current)", current: true },
    { device: "Safari on iPhone", location: "Mumbai, IN", time: "2 hours ago", current: false },
    { device: "Firefox on MacOS", location: "Pune, IN", time: "3 days ago", current: false },
  ];

  return (
    <div className="space-y-5">
      <SectionHeader title="Security" description="Manage your password, 2FA and active sessions." icon={FaShieldAlt} color="#22c55e" />

      <Card>
        <CardSection title="Change Password">
          <div className="space-y-4 max-w-md">
            {["current", "new", "confirm"].map(k => (
              <InputField key={k}
                label={k === "current" ? "Current Password" : k === "new" ? "New Password" : "Confirm Password"}
                type={showPwd[k] ? "text" : "password"}
                value={pwd[k]} onChange={v => setPwd(p => ({ ...p, [k]: v }))}
                placeholder={k === "current" ? "Enter current password" : k === "new" ? "Min. 8 characters" : "Re-enter new password"}
                rightElement={
                  <button onClick={() => setShowPwd(p => ({ ...p, [k]: !p[k] }))} className="text-gray-400 hover:text-gray-600 transition flex items-center justify-center p-1 focus:outline-none focus:ring-2 focus:ring-green-100 rounded">
                    {showPwd[k] ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                  </button>
                }
              />
            ))}
            {pwd.new && (
              <div className="flex gap-1.5">
                {["length", "upper", "number", "symbol"].map((req, i) => {
                  const checks = [pwd.new.length >= 8, /[A-Z]/.test(pwd.new), /\d/.test(pwd.new), /[!@#$%]/.test(pwd.new)];
                  return <div key={req} className={`h-1.5 flex-1 rounded-full transition-colors ${checks[i] ? "bg-green-400" : "bg-gray-200"}`} />;
                })}
              </div>
            )}
            <button onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); setPwd({ current: "", new: "", confirm: "" }); }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${saved ? "bg-green-500 text-white" : "bg-blue-500 hover:bg-blue-600 text-white"}`}>
              {saved ? <><FaCheck style={{ fontSize: 11 }} /> Updated!</> : <><FaKey style={{ fontSize: 11 }} /> Update Password</>}
            </button>
          </div>
        </CardSection>

        <CardSection title="Two-Factor Authentication">
          <div className="space-y-3">
            <Toggle enabled={twoFA} onChange={setTwoFA}
              label="Enable 2FA"
              description="Require a verification code in addition to your password." />
            {twoFA && (
              <div className="mt-3 p-3.5 bg-green-50 border border-green-100 rounded-xl flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
                  <FaMobile style={{ color: "#16a34a", fontSize: 14 }} />
                </div>
                <div>
                  <p className="text-xs font-bold text-green-700">Authenticator App Active</p>
                  <p className="text-xs text-green-600 mt-0.5">Linked to Google Authenticator.</p>
                </div>
              </div>
            )}
          </div>
        </CardSection>

        <CardSection title="Connected Accounts">
          <div className="space-y-3">
            {connectedApps.map(app => (
              <div key={app.name} className="flex items-center justify-between gap-3 p-3 rounded-xl hover:bg-gray-50 transition">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl border border-gray-100 bg-white flex items-center justify-center text-base shadow-sm">{app.icon}</div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{app.name}</p>
                    <p className="text-xs text-gray-400">{app.connected ? app.email : "Not connected"}</p>
                  </div>
                </div>
                <button className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition ${app.connected ? "border-red-200 text-red-500 hover:bg-red-50" : "border-blue-200 text-blue-500 hover:bg-blue-50"}`}>
                  {app.connected ? "Disconnect" : "Connect"}
                </button>
              </div>
            ))}
          </div>
        </CardSection>

        <CardSection title="Active Sessions">
          <div className="space-y-2">
            {sessions.map((s, i) => (
              <div key={i} className="flex items-center justify-between gap-3 p-3.5 rounded-xl bg-gray-50 border border-gray-100">
                <div>
                  <p className="text-xs font-bold text-gray-800">{s.device}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">{s.location} · {s.time}</p>
                </div>
                {s.current ? (
                  <span className="text-[10px] font-bold px-2.5 py-1 bg-green-100 text-green-700 rounded-lg">Current</span>
                ) : (
                  <button className="text-[10px] font-bold px-2.5 py-1 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 border border-red-100 transition">Revoke</button>
                )}
              </div>
            ))}
          </div>
        </CardSection>
      </Card>
    </div>
  );
};

/* ══════════════════════════════
   SECTION: NOTIFICATIONS
══════════════════════════════ */
const NotificationsSection = () => {
  const [saved, setSaved] = useState(false);
  const [prefs, setPrefs] = useState({
    emailAssignments: true, emailGrades: true, emailAnnouncements: false, emailNewCourse: true,
    pushAssignments: true, pushGrades: true, pushLive: true, pushAnnouncements: false,
    smsDeadlines: false, smsLive: true,
    weeklyDigest: true, marketingEmails: false,
    sound: true, doNotDisturb: false, dndStart: "22:00", dndEnd: "08:00",
  });
  const set = (key) => (val) => setPrefs(p => ({ ...p, [key]: val }));

  return (
    <div className="space-y-5">
      <SectionHeader title="Notifications" description="Choose when and how you want to be notified." icon={FaBell} color="#f59e0b" />
      <Card>
        <CardSection title="Email">
          <div className="space-y-4">
            <Toggle enabled={prefs.emailAssignments} onChange={set("emailAssignments")} label="Assignment Due Reminders" description="24-hour reminders before assignments are due." />
            <Toggle enabled={prefs.emailGrades} onChange={set("emailGrades")} label="Grades & Feedback" description="Notified when an instructor grades your work." />
            <Toggle enabled={prefs.emailAnnouncements} onChange={set("emailAnnouncements")} label="Course Announcements" description="Updates posted by your course instructors." />
            <Toggle enabled={prefs.emailNewCourse} onChange={set("emailNewCourse")} label="Course Recommendations" description="Personalised suggestions based on your learning." />
          </div>
        </CardSection>
        <CardSection title="Push">
          <div className="space-y-4">
            <Toggle enabled={prefs.pushAssignments} onChange={set("pushAssignments")} label="New Assignments" description="Real-time push for new assignments." />
            <Toggle enabled={prefs.pushGrades} onChange={set("pushGrades")} label="Grades Published" description="Instant push when results are out." />
            <Toggle enabled={prefs.pushLive} onChange={set("pushLive")} label="Live Class Reminders" description="30-minute reminder before any live session." />
            <Toggle enabled={prefs.pushAnnouncements} onChange={set("pushAnnouncements")} label="Announcements" description="Push notifications for instructor announcements." />
          </div>
        </CardSection>
        <CardSection title="SMS">
          <div className="space-y-4">
            <Toggle enabled={prefs.smsDeadlines} onChange={set("smsDeadlines")} label="Deadline Alerts" description="Text messages for assignment deadlines." />
            <Toggle enabled={prefs.smsLive} onChange={set("smsLive")} label="Live Class Reminder" description="SMS alert 15 minutes before live sessions." />
          </div>
        </CardSection>
        <CardSection title="Other">
          <div className="space-y-4">
            <Toggle enabled={prefs.weeklyDigest} onChange={set("weeklyDigest")} label="Weekly Digest" description="A weekly email summarising your learning activity." />
            <Toggle enabled={prefs.marketingEmails} onChange={set("marketingEmails")} label="Promotional Emails" description="Offers, discounts and product announcements." />
            <Toggle enabled={prefs.sound} onChange={set("sound")} label="Notification Sound" description="Play a sound when a new notification arrives." />
            <Toggle enabled={prefs.doNotDisturb} onChange={set("doNotDisturb")} label="Do Not Disturb" description={`Silence all notifications from ${prefs.dndStart} to ${prefs.dndEnd}.`} />
            {prefs.doNotDisturb && (
              <div className="flex gap-3 pt-1">
                <div className="flex-1">
                  <label className="text-xs text-gray-500 font-semibold mb-1 block uppercase tracking-wide">Start</label>
                  <input type="time" value={prefs.dndStart} onChange={e => set("dndStart")(e.target.value)}
                    className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 bg-gray-50 outline-none focus:ring-2 focus:ring-blue-100 transition" />
                </div>
                <div className="flex-1">
                  <label className="text-xs text-gray-500 font-semibold mb-1 block uppercase tracking-wide">End</label>
                  <input type="time" value={prefs.dndEnd} onChange={e => set("dndEnd")(e.target.value)}
                    className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 bg-gray-50 outline-none focus:ring-2 focus:ring-blue-100 transition" />
                </div>
              </div>
            )}
          </div>
        </CardSection>
        <div className="p-5 sm:p-6 flex justify-end bg-gray-50/50">
          <SaveButton onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); }} saved={saved} />
        </div>
      </Card>
    </div>
  );
};

/* ══════════════════════════════
   SECTION: LEARNING
══════════════════════════════ */
const LearningSection = () => {
  const [saved, setSaved] = useState(false);
  const [prefs, setPrefs] = useState({
    autoplay: true, subtitles: true, playbackSpeed: "1.0", subtitleLang: "en",
    videoQuality: "auto", dailyGoal: "30", weeklyTarget: "5",
    reminderTime: "09:00", showProgress: true, leaderboard: true,
    difficultyLevel: "intermediate", downloadOffline: false, continuousPlay: true,
  });
  const set = (k) => (v) => setPrefs(p => ({ ...p, [k]: v }));

  return (
    <div className="space-y-5">
      <SectionHeader title="Learning Preferences" description="Customise your learning experience and study goals." icon={FaGraduationCap} color="#a855f7" />
      <Card>
        <CardSection title="Video Player">
          <div className="space-y-4">
            <Toggle enabled={prefs.autoplay} onChange={set("autoplay")} label="Autoplay Next Lesson" description="Automatically start the next lesson." />
            <Toggle enabled={prefs.continuousPlay} onChange={set("continuousPlay")} label="Continuous Play" description="Play all lessons in a module without stopping." />
            <Toggle enabled={prefs.subtitles} onChange={set("subtitles")} label="Subtitles by Default" description="Show captions on video lessons." />
            <Toggle enabled={prefs.downloadOffline} onChange={set("downloadOffline")} label="Download for Offline" description="Allow downloading lessons for offline access." />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
              <SelectField label="Playback Speed" value={prefs.playbackSpeed} onChange={set("playbackSpeed")}
                options={["0.5", "0.75", "1.0", "1.25", "1.5", "1.75", "2.0"].map(v => ({ value: v, label: `${v}x` }))} />
              <SelectField label="Video Quality" value={prefs.videoQuality} onChange={set("videoQuality")}
                options={[{ value: "auto", label: "Auto" }, { value: "1080p", label: "1080p HD" }, { value: "720p", label: "720p" }, { value: "480p", label: "480p" }]} />
              <SelectField label="Subtitle Language" value={prefs.subtitleLang} onChange={set("subtitleLang")}
                options={[{ value: "en", label: "English" }, { value: "hi", label: "Hindi" }, { value: "ta", label: "Tamil" }, { value: "te", label: "Telugu" }]} />
            </div>
          </div>
        </CardSection>
        <CardSection title="Study Goals">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SelectField label="Daily Goal" value={prefs.dailyGoal} onChange={set("dailyGoal")}
              options={[{ value: "15", label: "15 minutes" }, { value: "30", label: "30 minutes" }, { value: "60", label: "1 hour" }, { value: "90", label: "1.5 hours" }, { value: "120", label: "2 hours" }]} />
            <SelectField label="Weekly Courses" value={prefs.weeklyTarget} onChange={set("weeklyTarget")}
              options={[{ value: "1", label: "1 course" }, { value: "2", label: "2 courses" }, { value: "3", label: "3 courses" }, { value: "5", label: "5 courses" }]} />
            <InputField label="Daily Reminder" type="time" value={prefs.reminderTime} onChange={set("reminderTime")} hint="We'll remind you to study at this time" />
            <SelectField label="Difficulty Level" value={prefs.difficultyLevel} onChange={set("difficultyLevel")}
              options={[{ value: "beginner", label: "Beginner" }, { value: "intermediate", label: "Intermediate" }, { value: "advanced", label: "Advanced" }]} />
          </div>
        </CardSection>
        <CardSection title="Community">
          <div className="space-y-4">
            <Toggle enabled={prefs.showProgress} onChange={set("showProgress")} label="Show Progress on Profile" description="Let others see your course completion." />
            <Toggle enabled={prefs.leaderboard} onChange={set("leaderboard")} label="Appear on Leaderboard" description="Show your name on course leaderboards." />
          </div>
        </CardSection>
        <div className="p-5 sm:p-6 flex justify-end bg-gray-50/50">
          <SaveButton onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); }} saved={saved} />
        </div>
      </Card>
    </div>
  );
};

/* ══════════════════════════════
   SECTION: PRIVACY
══════════════════════════════ */
const PrivacySection = () => {
  const [saved, setSaved] = useState(false);
  const [prefs, setPrefs] = useState({
    profileVisible: true, showEmail: false, showPhone: false,
    activityVisible: true, showCertificates: true, showCourses: true,
    analyticsTracking: true, personalizedAds: false, thirdPartySharing: false,
    searchIndexing: true, messageRequests: "connections",
  });
  const set = (k) => (v) => setPrefs(p => ({ ...p, [k]: v }));

  return (
    <div className="space-y-5">
      <SectionHeader title="Privacy" description="Control your visibility, data sharing and who can contact you." icon={FaLock} color="#64748b" />
      <Card>
        <CardSection title="Profile Visibility">
          <div className="space-y-4">
            <Toggle enabled={prefs.profileVisible} onChange={set("profileVisible")} label="Public Profile" description="Allow others to view your profile." />
            <Toggle enabled={prefs.showEmail} onChange={set("showEmail")} label="Show Email" description="Display your email on your public profile." />
            <Toggle enabled={prefs.showPhone} onChange={set("showPhone")} label="Show Phone" description="Display your phone number on your profile." />
            <Toggle enabled={prefs.activityVisible} onChange={set("activityVisible")} label="Show Activity" description="Let others see your recently viewed courses." />
            <Toggle enabled={prefs.showCertificates} onChange={set("showCertificates")} label="Show Certificates" description="Make earned certificates visible on your profile." />
            <Toggle enabled={prefs.showCourses} onChange={set("showCourses")} label="Show Enrolled Courses" description="Display courses you're enrolled in." />
          </div>
        </CardSection>
        <CardSection title="Data & Tracking">
          <div className="space-y-4">
            <Toggle enabled={prefs.analyticsTracking} onChange={set("analyticsTracking")} label="Usage Analytics" description="Help improve the platform with anonymised usage data." />
            <Toggle enabled={prefs.personalizedAds} onChange={set("personalizedAds")} label="Personalised Ads" description="Show ads tailored to your interests." />
            <Toggle enabled={prefs.thirdPartySharing} onChange={set("thirdPartySharing")} label="Third-Party Sharing" description="Share your data with trusted partner platforms." />
            <Toggle enabled={prefs.searchIndexing} onChange={set("searchIndexing")} label="Search Engine Indexing" description="Allow search engines to index your public profile." />
          </div>
        </CardSection>
        <CardSection title="Messaging">
          <SelectField label="Who Can Message You" value={prefs.messageRequests} onChange={set("messageRequests")}
            options={[{ value: "everyone", label: "Everyone" }, { value: "connections", label: "Connections Only" }, { value: "nobody", label: "Nobody" }]} />
        </CardSection>
        <CardSection>
          <div className="flex items-center justify-between gap-4 p-4 bg-blue-50 border border-blue-100 rounded-xl">
            <div>
              <p className="text-sm font-bold text-blue-800">Download Your Data</p>
              <p className="text-xs text-blue-500 mt-0.5">Export all your personal data and learning history.</p>
            </div>
            <button className="flex items-center gap-1.5 px-4 py-2 bg-blue-500 text-white text-xs font-bold rounded-xl hover:bg-blue-600 transition flex-shrink-0">
              <FaDownload style={{ fontSize: 10 }} /> Request
            </button>
          </div>
        </CardSection>
        <div className="p-5 sm:p-6 flex justify-end bg-gray-50/50">
          <SaveButton onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); }} saved={saved} />
        </div>
      </Card>
    </div>
  );
};

/* ══════════════════════════════
   SECTION: CERTIFICATES
══════════════════════════════ */
const CertificatesSection = () => {
  const certs = [
    { title: "Digital Marketing Fundamentals", date: "25 May 2024", id: "DL-DMF-2024-1256", status: "earned" },
    { title: "SEO & Keyword Research", date: "30 May 2024", id: "DL-SEO-2024-1289", status: "earned" },
    { title: "Social Media Marketing", date: "05 Jun 2024", id: "DL-SMM-2024-1324", status: "earned" },
    { title: "Google Ads & PPC", date: "75% complete", id: "", status: "progress" },
  ];

  return (
    <div className="space-y-5">
      <SectionHeader title="Certificates" description="Manage and share your earned credentials." icon={FaCertificate} color="#eab308" />
      <Card>
        <CardSection title="Certificate Preferences">
          <div className="space-y-4">
            <Toggle enabled={true} onChange={() => { }} label="Auto-Share to LinkedIn" description="Post earned certificates to LinkedIn automatically." />
            <Toggle enabled={false} onChange={() => { }} label="Email on Earn" description="Send yourself the certificate PDF when earned." />
            <Toggle enabled={true} onChange={() => { }} label="Show on Profile" description="Display earned certificates on your profile." />
          </div>
        </CardSection>
        <CardSection title="Your Certificates">
          <div className="space-y-2.5">
            {certs.map((c, i) => (
              <div key={i} className="flex items-center justify-between gap-3 p-3.5 rounded-xl border border-gray-100 bg-gray-50 hover:bg-white hover:border-gray-200 transition">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${c.status === "earned" ? "bg-green-100 text-green-600" : "bg-amber-100 text-amber-600"}`}>
                    <FaCertificate style={{ fontSize: 14 }} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{c.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{c.date}{c.id && ` · ${c.id}`}</p>
                  </div>
                </div>
                {c.status === "earned" ? (
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-blue-200 text-blue-500 hover:bg-blue-50 transition flex items-center gap-1">
                      <FaDownload style={{ fontSize: 9 }} /> PDF
                    </button>
                    <button className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 transition flex items-center gap-1">
                      <FaExternalLinkAlt style={{ fontSize: 9 }} /> Share
                    </button>
                  </div>
                ) : (
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-700 flex-shrink-0">In Progress</span>
                )}
              </div>
            ))}
          </div>
        </CardSection>
      </Card>
    </div>
  );
};

/* ══════════════════════════════
   SECTION: RESUME
══════════════════════════════ */
const ResumeSection = () => {
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    headline: "Digital Marketing Learner | SEO Enthusiast",
    skills: "SEO, Google Ads, Content Marketing, Email Marketing",
    experience: "", openToWork: true, jobAlerts: true,
    linkedinUrl: "", resumeFile: null,
  });
  const set = (k) => (v) => setForm(p => ({ ...p, [k]: v }));
  const fileRef = useRef(null);

  return (
    <div className="space-y-5">
      <SectionHeader title="Resume & Jobs" description="Build your professional profile and discover opportunities." icon={FaBriefcase} color="#14b8a6" />
      <Card>
        <CardSection title="Career Profile">
          <div className="space-y-4">
            <InputField label="Professional Headline" value={form.headline} onChange={set("headline")} placeholder="e.g. Digital Marketing Specialist" />
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Skills (comma separated)</label>
              <textarea value={form.skills} onChange={e => set("skills")(e.target.value)} rows={2} placeholder="SEO, Google Ads, Copywriting..."
                className="w-full text-sm border border-gray-200 rounded-xl px-4 py-2.5 bg-gray-50 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 focus:bg-white transition resize-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Work Experience Summary</label>
              <textarea value={form.experience} onChange={e => set("experience")(e.target.value)} rows={3} placeholder="Brief description of your work experience..."
                className="w-full text-sm border border-gray-200 rounded-xl px-4 py-2.5 bg-gray-50 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 focus:bg-white transition resize-none" />
            </div>
            <InputField label="LinkedIn URL" value={form.linkedinUrl} onChange={set("linkedinUrl")} placeholder="https://linkedin.com/in/your-profile"
              rightElement={<FaLinkedin style={{ color: "#0077b5", fontSize: 13 }} />} />
          </div>
        </CardSection>
        <CardSection title="Resume Upload">
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-blue-300 hover:bg-blue-50/30 transition cursor-pointer"
            onClick={() => fileRef.current?.click()}>
            <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-3">
              <FaUpload style={{ color: "#9ca3af", fontSize: 18 }} />
            </div>
            <p className="text-sm font-semibold text-gray-600">
              {form.resumeFile ? form.resumeFile.name : "Upload your resume"}
            </p>
            <p className="text-xs text-gray-400 mt-1">PDF or DOCX — max 5 MB</p>
            <input ref={fileRef} type="file" accept=".pdf,.doc,.docx" className="hidden"
              onChange={e => set("resumeFile")(e.target.files?.[0] || null)} />
          </div>
        </CardSection>
        <CardSection title="Job Preferences">
          <div className="space-y-4">
            <Toggle enabled={form.openToWork} onChange={set("openToWork")} label="Open to Work" description="Let recruiters know you're looking for opportunities." />
            <Toggle enabled={form.jobAlerts} onChange={set("jobAlerts")} label="Job Alert Emails" description="Receive alerts for jobs matching your profile." />
          </div>
        </CardSection>
        <div className="p-5 sm:p-6 flex justify-end bg-gray-50/50">
          <SaveButton onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); }} saved={saved} />
        </div>
      </Card>
    </div>
  );
};

/* ══════════════════════════════
   SECTION: APPEARANCE
══════════════════════════════ */
const AppearanceSection = () => {
  const [saved, setSaved] = useState(false);
  const [theme, setTheme] = useState("light");
  const [accent, setAccent] = useState("blue");
  const [fontSize, setFontSize] = useState("medium");
  const [sidebarCompact, setSidebarCompact] = useState(false);
  const [animations, setAnimations] = useState(true);
  const [density, setDensity] = useState("comfortable");

  const accents = [
    { key: "blue", hex: "#3b82f6" }, { key: "purple", hex: "#a855f7" },
    { key: "green", hex: "#22c55e" }, { key: "orange", hex: "#f97316" },
    { key: "rose", hex: "#f43f5e" }, { key: "teal", hex: "#14b8a6" },
  ];

  return (
    <div className="space-y-5">
      <SectionHeader title="Appearance" description="Personalise the look and feel of your dashboard." icon={FaPalette} color="#ec4899" />
      <Card>
        <CardSection title="Theme">
          <div className="grid grid-cols-3 gap-3">
            {["light", "dark", "system"].map(t => (
              <button key={t} onClick={() => setTheme(t)}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition ${theme === t ? "border-blue-500 bg-blue-50" : "border-gray-100 hover:border-gray-200 bg-gray-50"}`}>
                <div className={`w-12 h-8 rounded-lg flex items-center justify-center ${t === "dark" ? "bg-gray-900" : t === "system" ? "bg-gradient-to-r from-gray-100 to-gray-900" : "bg-white border border-gray-200"}`}>
                  {t === "dark" ? <FaMoon style={{ color: "#fbbf24", fontSize: 12 }} /> : t === "light" ? <FaSun style={{ color: "#f59e0b", fontSize: 12 }} /> : <span style={{ fontSize: 8, fontWeight: 700, color: "#6b7280" }}>AUTO</span>}
                </div>
                <span className="text-xs font-semibold text-gray-700 capitalize">{t}</span>
              </button>
            ))}
          </div>
        </CardSection>
        <CardSection title="Accent Colour">
          <div className="flex items-center gap-3">
            {accents.map(a => (
              <button key={a.key} onClick={() => setAccent(a.key)}
                style={{ backgroundColor: a.hex }}
                className={`w-9 h-9 rounded-xl transition-transform hover:scale-110 ${accent === a.key ? "ring-2 ring-offset-2 ring-gray-400 scale-110" : ""}`} />
            ))}
          </div>
        </CardSection>
        <CardSection title="Typography & Layout">
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <SelectField label="Font Size" value={fontSize} onChange={setFontSize}
                options={[{ value: "small", label: "Small" }, { value: "medium", label: "Medium" }, { value: "large", label: "Large" }, { value: "xlarge", label: "Extra Large" }]} />
              <SelectField label="Display Density" value={density} onChange={setDensity}
                options={[{ value: "compact", label: "Compact" }, { value: "comfortable", label: "Comfortable" }, { value: "spacious", label: "Spacious" }]} />
            </div>
            <Toggle enabled={sidebarCompact} onChange={setSidebarCompact} label="Compact Sidebar" description="Collapse sidebar to icons for more screen space." />
            <Toggle enabled={animations} onChange={setAnimations} label="Enable Animations" description="Show transitions and micro-interactions." />
          </div>
        </CardSection>
        <div className="p-5 sm:p-6 flex justify-end bg-gray-50/50">
          <SaveButton onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); }} saved={saved} />
        </div>
      </Card>
    </div>
  );
};

/* ══════════════════════════════
   SECTION: SUPPORT
══════════════════════════════ */
const SupportSection = () => {
  const [ticket, setTicket] = useState({ subject: "", category: "technical", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    { q: "How do I reset my password?", a: "Go to Security settings and click 'Update Password'. If locked out, use 'Forgot Password' on the login screen." },
    { q: "How do I download my certificate?", a: "Navigate to Certificates in Settings. Click the Download PDF button next to any earned certificate." },
    { q: "Can I access courses offline?", a: "Yes — enable 'Download for Offline Viewing' in Learning Preferences, then download lessons from the course player." },
    { q: "How do I contact my instructor?", a: "Open the course, go to the Q&A tab on any lesson. Instructors typically respond within 48 hours." },
    { q: "How is course progress calculated?", a: "Progress is based on completed lessons, quizzes and assignments. Mark a lesson complete after watching." },
  ];

  return (
    <div className="space-y-5">
      <SectionHeader title="Support" description="Get help, browse FAQs or contact our team." icon={FaHeadset} color="#6366f1" />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { icon: <FaHeadset style={{ color: "#3b82f6", fontSize: 20 }} />, label: "Live Chat", sub: "Avg. 2 min response", bg: "bg-blue-50 border-blue-100" },
          { icon: <FaEnvelope style={{ color: "#22c55e", fontSize: 20 }} />, label: "Email Support", sub: "support@platform.com", bg: "bg-green-50 border-green-100" },
          { icon: <FaGlobe style={{ color: "#a855f7", fontSize: 20 }} />, label: "Help Centre", sub: "200+ articles", bg: "bg-purple-50 border-purple-100" },
        ].map(l => (
          <button key={l.label} className={`flex items-center gap-3 p-4 rounded-2xl border ${l.bg} hover:shadow-sm transition text-left`}>
            {l.icon}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-800">{l.label}</p>
              <p className="text-xs text-gray-500 mt-0.5">{l.sub}</p>
            </div>
            <FaChevronRight style={{ color: "#d1d5db", fontSize: 10 }} />
          </button>
        ))}
      </div>

      <Card>
        <CardSection title="Frequently Asked Questions">
          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-gray-100 rounded-xl overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between gap-3 px-4 py-3.5 text-left hover:bg-gray-50 transition">
                  <span className="text-sm font-semibold text-gray-800">{faq.q}</span>
                  <FaChevronRight style={{ color: "#9ca3af", fontSize: 10, flexShrink: 0, transform: openFaq === i ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.2s" }} />
                </button>
                {openFaq === i && (
                  <div className="px-4 pb-4 border-t border-gray-50 bg-gray-50/50">
                    <p className="text-sm text-gray-600 mt-3 leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardSection>
      </Card>

      <Card>
        <CardSection title="Submit a Ticket">
          {submitted ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-2xl bg-green-100 flex items-center justify-center mx-auto mb-4">
                <FaCheck style={{ color: "#16a34a", fontSize: 24 }} />
              </div>
              <p className="text-base font-bold text-gray-800">Ticket Submitted!</p>
              <p className="text-sm text-gray-500 mt-1.5">We'll get back to you within 24 hours.</p>
              <button onClick={() => setSubmitted(false)} className="mt-4 text-xs text-blue-500 font-semibold hover:underline">Submit another</button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField label="Subject" value={ticket.subject} onChange={v => setTicket(p => ({ ...p, subject: v }))} placeholder="Describe your issue briefly" />
                <SelectField label="Category" value={ticket.category} onChange={v => setTicket(p => ({ ...p, category: v }))}
                  options={[{ value: "technical", label: "Technical Issue" }, { value: "billing", label: "Billing" }, { value: "course", label: "Course Content" }, { value: "account", label: "Account" }, { value: "other", label: "Other" }]} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Message</label>
                <textarea value={ticket.message} onChange={e => setTicket(p => ({ ...p, message: e.target.value }))} rows={4}
                  placeholder="Describe your issue in detail..."
                  className="w-full text-sm border border-gray-200 rounded-xl px-4 py-2.5 bg-gray-50 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 focus:bg-white transition resize-none" />
              </div>
              <button onClick={() => { if (ticket.subject && ticket.message) setSubmitted(true); }}
                disabled={!ticket.subject || !ticket.message}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-blue-500 hover:bg-blue-600 text-white transition disabled:opacity-40 disabled:cursor-not-allowed">
                <FaEnvelope style={{ fontSize: 11 }} /> Send Ticket
              </button>
            </div>
          )}
        </CardSection>
      </Card>
    </div>
  );
};

/* ══════════════════════════════
   SECTION: DANGER ZONE
══════════════════════════════ */
const DangerSection = () => {
  const [confirmModal, setConfirmModal] = useState(null);
  const [confirmText, setConfirmText] = useState("");

  const actions = [
    {
      key: "deactivate", Icon: FaEyeSlash, color: "#f59e0b", bgColor: "#fffbeb",
      title: "Deactivate Account",
      description: "Temporarily hide your account. All data is preserved and you can reactivate by logging back in.",
      button: "Deactivate", confirmWord: "DEACTIVATE",
      warning: "Your profile will be hidden and you'll lose access to all courses temporarily.",
    },
    {
      key: "export", Icon: FaDownload, color: "#3b82f6", bgColor: "#eff6ff",
      title: "Export All Data",
      description: "Download a complete archive of your data, progress, certificates and activity history.",
      button: "Request Export", confirmWord: null, warning: null,
    },
    {
      key: "delete", Icon: FaTrash, color: "#ef4444", bgColor: "#fef2f2",
      title: "Delete Account",
      description: "Permanently delete your account. This cannot be undone — all certificates and progress will be lost.",
      button: "Delete Account", confirmWord: "DELETE",
      warning: "All your courses, certificates, progress and data will be permanently deleted.",
    },
  ];

  return (
    <div className="space-y-5">
      <SectionHeader title="Danger Zone" description="Irreversible account actions. Read carefully before proceeding." icon={FaExclamationTriangle} color="#ef4444" />

      <div className="flex gap-3 p-4 bg-red-50 border border-red-100 rounded-2xl">
        <FaExclamationTriangle style={{ color: "#ef4444", fontSize: 14, flexShrink: 0, marginTop: 2 }} />
        <p className="text-sm text-red-700">These actions permanently affect your account. There is no undo for most of them.</p>
      </div>

      <div className="space-y-3">
        {actions.map(action => (
          <div key={action.key} style={{ backgroundColor: action.bgColor }}
            className="border border-gray-100 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: action.color + "20", color: action.color }}>
                <action.Icon style={{ fontSize: 16 }} />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">{action.title}</p>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed max-w-md">{action.description}</p>
              </div>
            </div>
            <button onClick={() => setConfirmModal(action)}
              style={{ color: action.color, borderColor: action.color + "40" }}
              className="flex-shrink-0 text-xs font-bold px-4 py-2.5 rounded-xl border bg-white hover:opacity-80 transition">
              {action.button}
            </button>
          </div>
        ))}
      </div>

      {confirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => { setConfirmModal(null); setConfirmText(""); }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-bold text-gray-900">{confirmModal.title}</h2>
              <button onClick={() => { setConfirmModal(null); setConfirmText(""); }}
                className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-gray-100 text-gray-400 transition">
                <FaTimes style={{ fontSize: 13 }} />
              </button>
            </div>
            {confirmModal.warning && (
              <div className="flex gap-3 p-3.5 bg-red-50 border border-red-100 rounded-xl mb-5">
                <FaExclamationTriangle style={{ color: "#ef4444", fontSize: 12, flexShrink: 0, marginTop: 2 }} />
                <p className="text-xs text-red-700 leading-relaxed">{confirmModal.warning}</p>
              </div>
            )}
            {confirmModal.confirmWord ? (
              <div className="mb-5">
                <p className="text-sm text-gray-600 mb-2">
                  Type <span className="font-bold" style={{ color: confirmModal.color }}>{confirmModal.confirmWord}</span> to confirm:
                </p>
                <input type="text" value={confirmText} onChange={e => setConfirmText(e.target.value)}
                  placeholder={confirmModal.confirmWord}
                  className="w-full text-sm border border-gray-200 rounded-xl px-4 py-2.5 bg-gray-50 outline-none focus:ring-2 focus:ring-red-100 focus:border-red-300 transition" />
              </div>
            ) : (
              <p className="text-sm text-gray-600 mb-5">Are you sure you want to proceed?</p>
            )}
            <div className="flex gap-3">
              <button onClick={() => { setConfirmModal(null); setConfirmText(""); }}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition">
                Cancel
              </button>
              <button
                disabled={!!(confirmModal.confirmWord && confirmText !== confirmModal.confirmWord)}
                onClick={() => { setConfirmModal(null); setConfirmText(""); }}
                style={{ backgroundColor: confirmModal.color }}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed">
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ══════════════════════════════
   SECTION MAP
══════════════════════════════ */
const SECTION_COMPONENTS = {
  account: AccountSection,
  security: SecuritySection,
  notifications: NotificationsSection,
  learning: LearningSection,
  privacy: PrivacySection,
  certificates: CertificatesSection,
  resume: ResumeSection,
  appearance: AppearanceSection,
  support: SupportSection,
  danger: DangerSection,
};

/* ══════════════════════════════
   MAIN SETTINGS COMPONENT
══════════════════════════════ */
const Settings = () => {
  const [activeSection, setActiveSection] = useState("account");
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);

  const ActiveComponent = SECTION_COMPONENTS[activeSection];
  const activeItem = NAV_ITEMS.find(n => n.key === activeSection);

  return (
    <div className="p-4 sm:p-6 md:p-8 min-h-screen bg-slate-50/60 max-w-7xl mx-auto space-y-6">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* ── Page Header ── */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/70 shadow-xs mb-6">
          <p className="text-xs text-slate-400 font-medium mb-1 flex items-center gap-1.5">
            <Link to="/student/dashboard" className="hover:text-[#043573] transition">Dashboard</Link>
            <span>&gt;</span>
            <span className="text-slate-700 font-semibold">Settings</span>
          </p>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Settings</h1>
          <p className="text-xs text-slate-500 mt-1">Manage your account, preferences, and privacy.</p>
        </div>

        {/* ── Tab nav (desktop) ── */}
        <div className="hidden sm:block mb-6">
          <div className="bg-white border border-slate-200/70 rounded-2xl p-1.5 shadow-xs overflow-x-auto scrollbar-hide">
            <div className="flex gap-1.5 min-w-max">
              {NAV_ITEMS.map(item => {
                const isActive = activeSection === item.key;
                const isDanger = item.key === "danger";
                return (
                  <button
                    key={item.key}
                    onClick={() => setActiveSection(item.key)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                      isActive
                        ? isDanger
                          ? "bg-rose-500 text-white shadow-xs"
                          : "bg-[#043573] text-white shadow-md shadow-[#043573]/20"
                        : isDanger
                          ? "text-rose-500 hover:bg-rose-50"
                          : "text-slate-600 hover:text-[#043573] hover:bg-slate-100/70"
                    }`}
                  >
                    <item.icon style={{
                      fontSize: 12,
                      color: isActive ? "#ffffff" : isDanger ? "#f43f5e" : item.color
                    }} />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Mobile dropdown nav ── */}
        <div className="sm:hidden mb-5 relative">
          <button
            onClick={() => setMobileDropdownOpen(!mobileDropdownOpen)}
            className="w-full flex items-center justify-between gap-3 bg-white border border-gray-100 rounded-2xl px-4 py-3 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: activeItem.color + "18", color: activeItem.color }}>
                <activeItem.icon style={{ fontSize: 14 }} />
              </div>
              <span className="text-sm font-semibold text-gray-800">{activeItem.label}</span>
            </div>
            <FaChevronRight style={{
              color: "#9ca3af", fontSize: 10,
              transform: mobileDropdownOpen ? "rotate(90deg)" : "rotate(0deg)",
              transition: "transform 0.2s"
            }} />
          </button>

          {mobileDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-100 rounded-2xl shadow-xl z-40 overflow-hidden">
              {NAV_ITEMS.map(item => (
                <button
                  key={item.key}
                  onClick={() => { setActiveSection(item.key); setMobileDropdownOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left transition ${activeSection === item.key ? "bg-blue-50" : "hover:bg-gray-50"
                    } ${item.key === "danger" ? "border-t border-gray-100" : ""}`}
                >
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: item.color + "18", color: item.color }}>
                    <item.icon style={{ fontSize: 12 }} />
                  </div>
                  <span className={`text-sm font-semibold ${activeSection === item.key ? "text-blue-700" : "text-gray-700"}`}>
                    {item.label}
                  </span>
                  {activeSection === item.key && (
                    <FaCheck style={{ color: "#3b82f6", fontSize: 10, marginLeft: "auto" }} />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Content ── */}
        <main className="pb-10">
          <ActiveComponent />
        </main>
      </div>
    </div>
  );
};

export default Settings;