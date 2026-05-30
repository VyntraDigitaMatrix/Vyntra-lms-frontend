import { BrowserRouter, Routes, Route, Outlet, Navigate } from "react-router-dom";

import AdminLogin from "./Admin/components/AdminLogin";

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
import Notes from "./students/Notes";
import Downloads from "./students/Downloads";
import Settings from "./students/Settings";
import Profile from "./students/Profile";
import ContactSupport from "./students/ContactSupport";
import AllStudents from "./Admin/pages/AllStudents";
import AllInstructors from "./Admin/pages/AllInstructors";
import AllCourses from "./Admin/pages/AllCourses";
import AllClasses from "./Admin/pages/AllClasses";
import AllAssignments from "./Admin/pages/AllAssignments";
import Schedule1 from "./Admin/pages/Schedule";
import Recordings1 from "./Admin/pages/Recordings";
import Discussions1 from "./Admin/pages/Discussions";
import Quizzes from "./students/Quiz";
import Resources1 from "./Admin/pages/Resources";
import Notes1 from "./Admin/pages/Notes";
import Downloads1 from "./Admin/pages/Downloads";
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
import Resume from "./students/Resume";
import JobNotifications from "./students/JobNotification";
// create these admin files
import AdminDashboardLayout from "./Admin/components/AdminDashboardLayout";
import AdminDashboard from "./Admin/components/AdminDashboard";

// Instructor files
import InstructorLogin from "./Instructor/InstructorLogin";
import InstructorDashboardLayout from "./Instructor/DashboardLayout";
import InstructorDashboard from "./Instructor/InstructorDashboard";

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
      <Routes>
        {/* Default route */}
        <Route path="/" element={<Navigate to="/UserLogin" replace />} />

        {/* Login pages */}
        <Route path="/AdminLogin" element={<AdminLogin />} />
        <Route path="/UserLogin" element={<UserLogin />} />
        <Route path="/InstructorLogin" element={<InstructorLogin />} />

        {/* Student Dashboard */}
        <Route path="/student" element={<StudentLayoutRoutes />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="/student/all-courses" element={<StudentAllCourses />} />
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
        </Route>

        {/* Admin Dashboard */}
        <Route path="/admin" element={<AdminLayoutRoutes />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="all-students" element={<AllStudents />} />
          <Route path="all-instructors" element={<AllInstructors />} />
          <Route path="all-courses" element={<AllCourses />} />
          <Route path="all-classes" element={<AllClasses />} />
          <Route path="all-assignments" element={<AllAssignments />} />
          <Route path="schedule" element={<Schedule1 />} />
          <Route path="recordings" element={<Recordings1 />} />
          <Route path="discussions" element={<Discussions1 />} />
          <Route path="resources" element={<Resources1 />} />
          <Route path="notes" element={<Notes1 />} />
          <Route path="downloads" element={<Downloads1 />} />
        </Route>

        {/* Instructor Dashboard */}
        <Route path="/instructor" element={<InstructorLayoutRoutes />}>
          <Route path="dashboard" element={<InstructorDashboard />} />
          <Route path="courses" element={<MyCourses />} />
          <Route path="students" element={<InstructorStudents />} />
          <Route path="schedule" element={<InstructorSchedules />} />
          <Route path="recordings" element={<InstructorRecordings />} />
          <Route path="discussions" element={<InstructorDiscussions />} />
          <Route path="resources" element={<InstructorResources />} />
          <Route path="notes" element={<InstructorNotes />} />
          <Route path="reports" element={<InstructorReports />} />
          <Route path="change-password" element={<InstructorChangePassword />} />
          <Route path="assignments" element={<InstructorAssignments />} />
          <Route path="profile" element={<InstructorProfile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;