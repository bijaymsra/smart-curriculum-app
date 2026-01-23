import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/common/Dashboard";
import About from "./pages/common/About";
import Docs from "./pages/common/Docs";
import Login from "./pages/login/Login";
import Signup from "./pages/login/Signup";


import { AdminProvider } from "./context/AdminContext";

import Admin from "./pages/admin/Admin";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminStudents from "./pages/admin/Student";
import AdminStudentManagement from "./pages/admin/StudentManagement";
import AdminFacultyManagement from "./pages/admin/FacultyManagement";
import AdminAddStudent from "./pages/admin/AddStudent";
import AdminAddFaculty from "./pages/admin/AddFaculty";
import AdminFaculty from "./pages/admin/Faculty";
import AdminCourses from "./pages/admin/Courses";
import AdminAttendance from "./pages/admin/Attendance";
import AdminSettings from "./pages/admin/Settings";
import AdminTimetable from "./pages/admin/Timetable";
import AdminAnalytics from "./pages/admin/Analytics";

import StudentDashboard from "./pages/student/StudentDashboard";

import FacultyDashboard from "./pages/faculty/FacultyDashboard";

export default function App() {
  return (
    <Routes>

      {/* ===== GENERAL PUBLIC LAYOUT ===== */}
      <Route path="/" element={<Dashboard />} />
      <Route path="/about" element={<About />} />
      <Route path="/docs" element={<Docs />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />


      {/* ===== ADMIN LAYOUT ===== */}
      <Route path="/admin" element={ <AdminProvider><Admin /></AdminProvider>}>
      <Route index element={<AdminDashboard />} />


        {/* admin portal -> student section */}
      <Route path="students" element={<AdminStudents />} />
      <Route path="students/new" element={<AdminAddStudent />} />
      <Route path="students/:studentId" element={<AdminStudentManagement />} />


        {/* admin portal -> faculty section */}
      <Route path="faculty" element={<AdminFaculty />} />
      <Route path="faculty/new" element={<AdminAddFaculty />} />
      <Route path="faculty/:facultyId" element={<AdminFacultyManagement />} />


      <Route path="courses" element={<AdminCourses />} />
      <Route path="attendance" element={<AdminAttendance />} />
      <Route path="timetable" element={<AdminTimetable />} />
      <Route path="analytics" element={<AdminAnalytics />} />
      <Route path="settings" element={<AdminSettings />} />
      </Route>


      {/* ===== STUDENT LAYOUT DASHBOARD ===== */}
      <Route path="/student/dashboard" element={<StudentDashboard />} />


      {/* ===== FACULTY LAYOUT DASHBOARD ===== */}
      <Route path="/faculty/dashboard" element={<FacultyDashboard />} />

    </Routes>
  );
}
