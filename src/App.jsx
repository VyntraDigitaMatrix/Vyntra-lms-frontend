import { BrowserRouter, Routes, Route, Outlet, Navigate } from "react-router-dom";
import Home from "./Home";
import { AuthProvider } from "./students/auth/AuthContext";
import PrivateRoute from "./students/auth/PrivateRoute";
import OAuth2RedirectHandler from "./students/auth/OAuth2RedirectHandler";
import ForgotPassword from "./students/ForgotPassword";
import ResetPassword from "./students/ResetPassword";


import { AdminAuthProvider } from "./Admin/auth/AuthContext";
import AdminPrivateRoute from "./Admin/auth/PrivateRoute";

import AdminLogin from "./Admin/components/AdminLogin";

import { InstructorAuthProvider } from "./Instructor/auth/AuthContext";
import InstructorPrivateRoute from "./Instructor/auth/PrivateRoute";
import InstructorForgotPassword from "./Instructor/InstructorForgotPassword";
import InstructorResetPassword from "./Instructor/InstructorResetPassword";


import UserLogin from "./students/UserLogin";
import Certificate from "./students/Certificate";
import DashboardLayout from "./students/DashboardLayout";
import Dashboard from "./students/Dashboard";
import Assignments from "./students/Assignments";
import Courses from "./students/Courses";
import Classes from "./students/Classes";
import ChangePassword from "./students/ChangePassword";
import Schedule from "./students/Schedule";
import Recordings from "./students/Recordings";
import Discussions from "./students/Discussions";
import Resources from "./students/Resources";
import Notes from "./students/NotesComponent";
import Downloads from "./students/Downloads";
import Settings from "./students/Settings";
import Profile from "./students/Profile";
import ContactSupport from "./students/ContactSupport";
import ViewCourse from "./students/ViewCourse";
import ModuleView from "./students/ModuleView";
import ModuleLesson from "./students/ModuleLesson";
import ContinueLearning from "./students/ContinueLearning";
import NoteEditor from "./students/NotesComponent";
import Notifications from "./students/Notifications";
import AllStudents from "./Admin/pages/AllStudents";
import AllInstructors from "./Admin/pages/AllInstructors";
import AllCourses from "./Admin/pages/AllCourses";
import AdminCreateCourse from "./Admin/pages/CreateCourse";
import AdminCourseSettings from "./Admin/pages/CourseSettings";
import AdminPlans from "./Admin/pages/Plans";
import AllClasses from "./Admin/pages/AllClasses";
import AdminCertificates from "./Admin/pages/Certificates";
import AllAssignments from "./Admin/pages/AllAssignments";
import Schedule1 from "./Admin/pages/Schedule";
import Recordings1 from "./Admin/pages/Recordings";
import Discussions1 from "./Admin/pages/Discussions";
import Quizzes from "./students/Quiz";
import Resources1 from "./Admin/pages/Resources";
import Notes1 from "./Admin/pages/Notes";
import Downloads1 from "./Admin/pages/Downloads";
import AdminJobsList from "./Admin/pages/JobsList";
import AdminJobCreateEdit from "./Admin/pages/JobCreateEdit";
import AdminJobApplications from "./Admin/pages/JobApplications";
import MyCourses from "./Instructor/pages/MyCourses";
import InstructorStudents from "./Instructor/pages/Students";
import InstructorSchedules from "./Instructor/pages/Schedules";
import InstructorRecordings from "./Instructor/pages/Recordings";
import InstructorDiscussions from "./Instructor/pages/Discussions";
import InstructorResources from "./Instructor/pages/Resources";
import InstructorNotes from "./Instructor/pages/Notes";
import InstructorReports from "./Instructor/pages/Reports";
import InstructorChangePassword from "./Instructor/pages/ChangePassword";
import InstructorAssignments from "./Instructor/pages/Assignments";
import InstructorProfile from "./Instructor/pages/InstructorProfile";
import StudentAllCourses from "./students/AllCourses";
import AdminCourseViewDetails from "./Admin/pages/CourseViewDetails";
import AdminLessonView from "./Admin/pages/LessonView";
import AdminAttendance from "./Admin/pages/Attendance";
import LessonView from "./Instructor/pages/LessonView";
import Resume from "./students/Resume";
import JobNotifications from "./students/JobNotification";
import AssignmentDetail from "./students/AssignmentDetail";
import Quiz from "./Instructor/pages/Quizzes";
import QuizResults from "./Instructor/pages/QuizResults";
import CreateCourse from "./Instructor/pages/CreateCourse";
import CourseBuilder from "./Instructor/pages/CourseBuilder";
import LessonBuilder from "./Instructor/pages/LessonBuilder";
import LessonSettings from "./Instructor/pages/LessonSettings";
import SectionSettings from "./Instructor/pages/SectionSettings";
import Plans from "./Instructor/pages/Plans";
import BrandingPage from "./Instructor/pages/BrandingPage";
import ZoomMeetings from "./Instructor/pages/ZoomMeetings";
import PendingDetail from "./students/components/PendingDetail";
import Attendance from "./students/Attendance";
import AdminProfile from "./Admin/pages/Profile";
// create these admin files
import AdminDashboardLayout from "./Admin/components/AdminDashboardLayout";
import AdminDashboard from "./Admin/components/AdminDashboard";

// Instructor files
import InstructorLogin from "./Instructor/InstructorLogin";
import InstructorDashboardLayout from "./Instructor/DashboardLayout";
import InstructorDashboard from "./Instructor/InstructorDashboard";

import InstructorCertificates from "./Instructor/pages/Certificate";

function StudentLayoutRoutes() {
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
}

function AdminLayoutRoutes() {
  return (
    <AdminDashboardLayout>
      <Outlet />
    </AdminDashboardLayout>
  );
}

function InstructorLayoutRoutes() {
  return (
    <InstructorDashboardLayout>
      <Outlet />
    </InstructorDashboardLayout>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AdminAuthProvider>
          <InstructorAuthProvider>
            <Routes>
              {/* Default route */}
              <Route path="/" element={<Home />} />

              {/* Login pages */}
              <Route path="/AdminLogin" element={<AdminLogin />} />
              <Route path="/UserLogin" element={<UserLogin />} />
              <Route path="/InstructorLogin" element={<InstructorLogin />} />

              {/* Forgot & Reset Password */}
              <Route path="/ForgotPassword" element={<ForgotPassword />} />
              <Route path="/ResetPassword" element={<ResetPassword />} />

              {/* Instructor Forgot & Reset Password */}
              <Route path="/instructor/forgot-password" element={<InstructorForgotPassword />} />
              <Route path="/instructor/reset-password" element={<InstructorResetPassword />} />

              {/* Google OAuth redirect handler */}
              <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />
              <Route path="/login/oauth2/code/google" element={<OAuth2RedirectHandler />} />

              {/* Protected Student Routes */}
              <Route element={<PrivateRoute />}>
                <Route path="/student" element={<StudentLayoutRoutes />}>
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="/student/all-courses" element={<StudentAllCourses />} />
                  <Route path="/student/course-preview/:courseSlug" element={<ViewCourse />} />
                  <Route path="assignments" element={<Assignments />} />
                  <Route path="courses" element={<Courses />} />
                  <Route path="classes" element={<Classes />} />
                  <Route path="change-password" element={<ChangePassword />} />
                  <Route path="schedule" element={<Schedule />} />
                  <Route path="recordings" element={<Recordings />} />
                  <Route path="discussions" element={<Discussions />} />
                  <Route path="resources" element={<Resources />} />
                  <Route path="notes" element={<Notes />} />
                  <Route path="downloads" element={<Downloads />} />
                  <Route path="settings" element={<Settings />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="contact-support" element={<ContactSupport />} />
                  <Route path="resume" element={<Resume />} />
                  <Route path="certificates" element={<Certificate />} />
                  <Route path="quiz" element={<Quizzes />} />
                  <Route path="job-notifications" element={<JobNotifications />} />
                  <Route path="/student/notes/new" element={<NoteEditor />} />
                  <Route path="notifications" element={<Notifications />} />
                  <Route path="assignments/:assignmentSlug" element={<Assignments />} />
                  <Route path="/student/attendance" element={<Attendance />} />

                  <Route path="/student/continue-learning/:courseSlug" element={<ContinueLearning />} />

                  <Route
                    path="/student/course/:courseId/module/:moduleId/assignment/:assignmentId"
                    element={<AssignmentDetail />}
                  />
                </Route>


                <Route path="/student/module/:moduleSlug/lesson/:lessonSlug" element={<ModuleView />} />
                <Route path="/student/course/:courseId/module/:moduleSlug/lesson/:lessonSlug" element={<ModuleLesson />} />
              </Route>

              {/* Protected Admin Routes */}
              <Route element={<AdminPrivateRoute />}>
                <Route path="/admin" element={<AdminLayoutRoutes />}>
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="all-students" element={<AllStudents />} />
                  <Route path="all-instructors" element={<AllInstructors />} />
                  <Route path="create-course" element={<AdminCreateCourse />} />
                  <Route path="course-settings/:courseSlug" element={<AdminCourseSettings />} />
                  <Route path="plans" element={<AdminPlans />} />
                  <Route path="all-courses" element={<AllCourses />} />
                  <Route path="course-preview/:id" element={<AdminCourseViewDetails />} />
                  <Route path="all-classes" element={<AllClasses />} />
                  <Route path="all-assignments" element={<AllAssignments />} />
                  <Route path="schedule" element={<Schedule1 />} />
                  <Route path="recordings" element={<Recordings1 />} />
                  <Route path="discussions" element={<Discussions1 />} />
                  <Route path="resources" element={<Resources1 />} />
                  <Route path="notes" element={<Notes1 />} />
                  <Route path="downloads" element={<Downloads1 />} />
                  <Route path="jobs" element={<AdminJobsList />} />
                  <Route path="jobs/create" element={<AdminJobCreateEdit />} />
                  <Route path="jobs/edit/:jobSlug" element={<AdminJobCreateEdit />} />
                  <Route path="jobs/:jobSlug/applications" element={<AdminJobApplications />} />
                  <Route path="attendance" element={<AdminAttendance />} />
                  <Route path="certificates" element={<AdminCertificates />} />
                  <Route path="profile" element={<AdminProfile />} />
                </Route>
                <Route path="/admin/course/:courseId/lesson/:lessonId" element={<AdminLessonView />} />
              </Route>

              {/* Protected Instructor Routes */}
              <Route element={<InstructorPrivateRoute />}>
                <Route path="/instructor" element={<InstructorLayoutRoutes />}>
                  <Route path="dashboard" element={<InstructorDashboard />} />
                  <Route path="courses" element={<MyCourses />} />
                  <Route path="students" element={<InstructorStudents />} />
                  <Route path="schedule" element={<InstructorSchedules />} />
                  <Route path="zoom-meetings" element={<ZoomMeetings />} />
                  <Route path="recordings" element={<InstructorRecordings />} />
                  <Route path="discussions" element={<InstructorDiscussions />} />
                  <Route path="resources" element={<InstructorResources />} />
                  <Route path="notes" element={<InstructorNotes />} />
                  <Route path="reports" element={<InstructorReports />} />
                  <Route path="change-password" element={<InstructorChangePassword />} />
                  <Route path="assignments" element={<InstructorAssignments />} />
                  <Route path="assignments/:assignmentSlug" element={<InstructorAssignments />} />
                  <Route path="assignments/:assignmentSlug/submissions" element={<InstructorAssignments />} />
                  <Route path="profile" element={<InstructorProfile />} />
                  <Route path="certificates" element={<InstructorCertificates />} />
                  <Route path="quiz" element={<Quiz />} />
                  <Route path="/instructor/create-course" element={<CreateCourse />} />
                  <Route path="/instructor/course-builder/:courseSlug" element={<CourseBuilder />} />
                  <Route path="/instructor/lesson-builder/:courseSlug/:lessonSlug" element={<LessonBuilder />} />
                  <Route path="/instructor/lesson-settings/:courseSlug/:lessonSlug" element={<LessonSettings />} />
                  <Route path="/instructor/section-settings/:courseSlug/:page?" element={<SectionSettings />} />
                  <Route path="/instructor/plans" element={<Plans />} />
                  <Route path="/instructor/branding" element={<BrandingPage />} />
                </Route>
                <Route path="/instructor/course/:courseId/lesson/:lessonId" element={<LessonView />} />
                <Route path="/instructor/quiz/:quizId/results" element={<QuizResults />} />
              </Route>
            </Routes>
          </InstructorAuthProvider>
        </AdminAuthProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;