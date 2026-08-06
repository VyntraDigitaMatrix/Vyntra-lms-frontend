import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  BookOpen,
  GraduationCap,
  UserPlus,
  Clock,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Award,
  Briefcase,
  Star,
  PlusCircle,
} from "lucide-react";
import { adminDashboardApi } from "../auth/api";

const currency = (n) =>
  `₹${Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [courseCounts, setCourseCounts] = useState(null);
  const [registeredStudents, setRegisteredStudents] = useState(null);
  const [enrollmentCount, setEnrollmentCount] = useState(null);
  const [transactionCounts, setTransactionCounts] = useState(null);
  const [pendingTransactions, setPendingTransactions] = useState(null);
  const [instructorCount, setInstructorCount] = useState(null);
  const [jobCount, setJobCount] = useState(null);
  const [certificateCount, setCertificateCount] = useState(null);
  const [courseRatingCount, setCourseRatingCount] = useState(null);
  const [revenueByCourse, setRevenueByCourse] = useState([]);
  const [ratingsByCourse, setRatingsByCourse] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const [
          courseCountsRes,
          studentsRes,
          enrollmentsRes,
          transactionsRes,
          pendingTxRes,
          instructorsRes,
          jobsRes,
          certificatesRes,
          ratingCountRes,
          revenueByCourseRes,
          ratingsByCourseRes,
        ] = await Promise.all([
          adminDashboardApi.getCourseCounts(),
          adminDashboardApi.getRegisteredStudentCount(),
          adminDashboardApi.getEnrollmentCount(),
          adminDashboardApi.getTransactionCounts(),
          adminDashboardApi.getPendingTransactionCount(),
          adminDashboardApi.getInstructorCount(),
          adminDashboardApi.getJobCount(),
          adminDashboardApi.getCertificateCount(),
          adminDashboardApi.getCourseRatingCount(),
          adminDashboardApi.getRevenueByCourse(),
          adminDashboardApi.getCourseRatingCountByCourse(),
        ]);

        if (!isMounted) return;

        setCourseCounts(courseCountsRes.data?.data || null);
        setRegisteredStudents(studentsRes.data?.data || null);
        setEnrollmentCount(enrollmentsRes.data?.data || null);
        setTransactionCounts(transactionsRes.data?.data || null);
        setPendingTransactions(pendingTxRes.data?.data || null);
        setInstructorCount(instructorsRes.data?.data || null);
        setJobCount(jobsRes.data?.data || null);
        setCertificateCount(certificatesRes.data?.data || null);
        setCourseRatingCount(ratingCountRes.data?.data || null);
        setRevenueByCourse(revenueByCourseRes.data?.data || []);
        setRatingsByCourse(ratingsByCourseRes.data?.data || []);
      } catch (err) {
        console.error("Failed to load admin dashboard stats", err);
        if (isMounted) setError("Failed to load dashboard data from the server.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const totalRevenue = revenueByCourse.reduce((sum, c) => sum + Number(c.revenue || 0), 0);

  const stats = [
    {
      title: "Registered Students",
      value: registeredStudents?.totalRegisteredStudents ?? 0,
      icon: GraduationCap,
      bgColor: "bg-navy-50",
      iconColor: "text-navy-700",
      borderColor: "border-navy-700",
    },
    {
      title: "Instructors",
      value: instructorCount?.totalInstructors ?? 0,
      icon: Users,
      bgColor: "bg-brand-orange-50",
      iconColor: "text-brand-orange-dark",
      borderColor: "border-brand-orange",
    },
    {
      title: "Courses",
      value: courseCounts?.totalCourses ?? 0,
      subtitle: courseCounts ? `${courseCounts.publishedCourses} published · ${courseCounts.unpublishedCourses} unpublished` : "",
      icon: BookOpen,
      bgColor: "bg-navy-50",
      iconColor: "text-navy-700",
      borderColor: "border-navy-700",
    },
    {
      title: "Total Enrollments",
      value: enrollmentCount?.totalEnrollments ?? 0,
      icon: TrendingUp,
      bgColor: "bg-brand-orange-50",
      iconColor: "text-brand-orange-dark",
      borderColor: "border-brand-orange",
    },
    {
      title: "Revenue (by course)",
      value: currency(totalRevenue),
      icon: DollarSign,
      bgColor: "bg-navy-50",
      iconColor: "text-navy-700",
      borderColor: "border-navy-700",
    },
    {
      title: "Pending Transactions",
      value: pendingTransactions?.pendingTransactions ?? 0,
      subtitle: transactionCounts ? `${transactionCounts.totalTransactions} total · ${transactionCounts.failedTransactions} failed` : "",
      icon: Clock,
      bgColor: "bg-brand-orange-50",
      iconColor: "text-brand-orange-dark",
      borderColor: "border-brand-orange",
    },
  ];

  const secondaryStats = [
    { title: "Open Job Postings", value: jobCount?.totalJobs ?? 0, icon: Briefcase },
    { title: "Certificates Issued", value: certificateCount?.totalCertificatesIssued ?? 0, icon: Award },
    { title: "Course Ratings", value: courseRatingCount?.totalCourseRatings ?? 0, icon: Star },
  ];

  const quickActions = [
    { label: "Create Course", icon: PlusCircle, tone: "orange", onClick: () => navigate("/admin/create-course") },
    { label: "View Students", icon: GraduationCap, tone: "navy", onClick: () => navigate("/admin/all-students") },
    { label: "View Instructors", icon: UserPlus, tone: "navy", onClick: () => navigate("/admin/all-instructors") },
    { label: "View Courses", icon: BookOpen, tone: "orange", onClick: () => navigate("/admin/all-courses") },
  ];

  const quickActionTones = {
    navy: "from-navy-800 to-navy-900 text-white",
    orange: "from-brand-orange to-brand-orange-dark text-white",
  };

  return (
    <div className="min-h-screen bg-navy-50/40">
      {/* Header banner */}
      <div className="mx-5 mt-5 rounded-2xl bg-gradient-to-r from-navy-900 via-navy-800 to-navy-700 px-6 py-6 shadow-lg relative overflow-hidden">
        <div className="absolute -right-8 -top-10 w-40 h-40 rounded-full bg-brand-orange/10 blur-2xl" />
        <div className="absolute right-16 bottom-0 w-24 h-24 rounded-full bg-brand-orange/20 blur-xl" />
        <div className="relative">
          <h1 className="text-2xl font-bold text-white">
            Admin Dashboard
          </h1>
          <div className="h-1 w-12 bg-brand-orange rounded-full mt-2 mb-2" />
          <p className="text-sm text-navy-100/70">Live overview of students, instructors, and course activity</p>
        </div>
      </div>

      <div className="p-5 space-y-5">
        {error && (
          <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm font-semibold">
            ⚠️ {error}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className={`bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border-l-4 ${stat.borderColor} overflow-hidden group`}
              >
                <div className="p-5">
                  <div className={`${stat.bgColor} p-2 rounded-lg w-fit group-hover:scale-110 transition-transform duration-200 mb-3`}>
                    <Icon className={`w-5 h-5 ${stat.iconColor}`} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold text-navy-900">{loading ? "…" : stat.value}</p>
                    {stat.subtitle && <p className="text-[11px] text-gray-400 mt-1">{stat.subtitle}</p>}
                  </div>
                </div>
                <div className={`h-1 ${stat.bgColor}`}></div>
              </div>
            );
          })}
        </div>

        {/* Secondary stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {secondaryStats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="bg-white rounded-xl shadow-sm p-5 flex items-center gap-4">
                <div className="w-11 h-11 rounded-lg bg-navy-50 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-navy-700" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">{stat.title}</p>
                  <p className="text-xl font-bold text-navy-900">{loading ? "…" : stat.value}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Revenue & Ratings by Course */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="p-5 border-b border-navy-100 flex items-center gap-2">
              <span className="w-1.5 h-5 rounded-full bg-brand-orange" />
              <h2 className="font-semibold text-navy-900">Revenue by Course</h2>
            </div>
            <div className="p-5">
              {loading ? (
                <p className="text-sm text-gray-400">Loading…</p>
              ) : revenueByCourse.length === 0 ? (
                <p className="text-sm text-gray-400">No revenue data yet.</p>
              ) : (
                <div className="space-y-3">
                  {revenueByCourse
                    .slice()
                    .sort((a, b) => Number(b.revenue || 0) - Number(a.revenue || 0))
                    .slice(0, 8)
                    .map((c, i) => {
                      const max = Math.max(...revenueByCourse.map((x) => Number(x.revenue || 0)), 1);
                      const pct = Math.round((Number(c.revenue || 0) / max) * 100);
                      return (
                        <div key={c.courseSlug || i}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="font-medium text-navy-800 truncate max-w-[70%]">{c.courseTitle}</span>
                            <span className="text-gray-500">{currency(c.revenue)}</span>
                          </div>
                          <div className="w-full bg-navy-50 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-brand-orange to-brand-orange-dark h-2 rounded-full transition-all duration-500"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="p-5 border-b border-navy-100 flex items-center gap-2">
              <span className="w-1.5 h-5 rounded-full bg-navy-700" />
              <h2 className="font-semibold text-navy-900">Ratings by Course</h2>
            </div>
            <div className="p-5">
              {loading ? (
                <p className="text-sm text-gray-400">Loading…</p>
              ) : ratingsByCourse.length === 0 ? (
                <p className="text-sm text-gray-400">No ratings data yet.</p>
              ) : (
                <div className="space-y-3">
                  {ratingsByCourse
                    .slice()
                    .sort((a, b) => Number(b.totalRatings || 0) - Number(a.totalRatings || 0))
                    .slice(0, 8)
                    .map((c, i) => (
                      <div key={c.courseSlug || i} className="flex items-center justify-between p-2.5 hover:bg-navy-50/60 rounded-lg transition-colors">
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-navy-800 truncate">{c.courseTitle}</p>
                          <p className="text-xs text-gray-400">{c.totalRatings} rating(s)</p>
                        </div>
                        <div className="flex items-center gap-1 text-brand-orange flex-shrink-0">
                          <Star className="w-4 h-4 fill-brand-orange" />
                          <span className="text-sm font-semibold text-navy-800">{Number(c.averageRating || 0).toFixed(1)}</span>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <div className="p-5 border-b border-navy-100 flex items-center gap-2">
            <span className="w-1.5 h-5 rounded-full bg-brand-orange" />
            <h2 className="font-semibold text-navy-900">Quick Actions</h2>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {quickActions.map((action, i) => {
                const Icon = action.icon;
                return (
                  <button
                    key={i}
                    onClick={action.onClick}
                    className={`flex flex-col items-center justify-center space-y-2 p-4 bg-gradient-to-br ${quickActionTones[action.tone]} rounded-xl hover:shadow-lg transition-all transform hover:-translate-y-1 group border-none cursor-pointer`}
                  >
                    <div className="p-2 bg-white/15 rounded-full group-hover:scale-110 group-hover:bg-white/25 transition-all">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-medium">{action.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
