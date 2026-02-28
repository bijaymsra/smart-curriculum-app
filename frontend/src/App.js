import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/common/Dashboard";
import Login from "./pages/login/Login";
import Signup from "./pages/login/Signup";
import ProtectedRoute from "./protect/ProtectedRoute";
import { AdminProvider } from "./context/AdminContext";

// Admin Components
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


// Faculty Components
import FacultyLayout from './pages/faculty/FacultyLayout';
import FacultyDashboard from './pages/faculty/FacultyDashboard';
import FacultyAttendance from './pages/faculty/FacultyAttendance';
import FacultyAnalytics from './pages/faculty/FacultyAnalytics';
import FacultySettings from './pages/faculty/FacultySettings';


// Student Components
import StudentLayout from './pages/student/StudentLayout';
import StudentDashboard from './pages/student/StudentDashboard';
import StudentAttendance from './pages/student/StudentAttendance';
import StudentTasks from './pages/student/StudentTasks';
import StudentProfile from './pages/student/StudentProfile';


export default function App() {
  return (
    <Routes>
      {/* ===== GENERAL PUBLIC LAYOUT ===== */}
      <Route path="/" element={<Dashboard />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* ===== ADMIN LAYOUT ===== */}
      <Route path="/admin" element={<ProtectedRoute allowedRole="ADMIN"><AdminProvider><Admin /></AdminProvider></ProtectedRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="students" element={<AdminStudents />} />
        <Route path="students/new" element={<AdminAddStudent />} />
        <Route path="students/:studentId" element={<AdminStudentManagement />} />
        <Route path="faculty" element={<AdminFaculty />} />
        <Route path="faculty/new" element={<AdminAddFaculty />} />
        <Route path="faculty/:facultyId" element={<AdminFacultyManagement />} />
        <Route path="courses" element={<AdminCourses />} />
        <Route path="attendance" element={<AdminAttendance />} />
        <Route path="timetable" element={<AdminTimetable />} />
        <Route path="analytics" element={<AdminAnalytics />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>


      {/* ===== FACULTY PORTAL ===== */}
      <Route path="/faculty" element={<ProtectedRoute allowedRole="FACULTY"><FacultyLayout /></ProtectedRoute>}>
        <Route index element={<FacultyDashboard />} />
        <Route path="dashboard" element={<FacultyDashboard />} />
        <Route path="attendance" element={<FacultyAttendance />} />
        <Route path="analytics" element={<FacultyAnalytics />} />
        <Route path="settings" element={<FacultySettings />} />
      </Route>


      {/* ===== STUDENT PORTAL ===== */}
    <Route path="/student" element={<ProtectedRoute allowedRole="STUDENT"><StudentLayout /></ProtectedRoute>}>
      <Route index element={<StudentDashboard />} />
      <Route path="dashboard" element={<StudentDashboard />} />
      <Route path="attendance" element={<StudentAttendance />} />
      <Route path="tasks" element={<StudentTasks />} />
      <Route path="profile" element={<StudentProfile />} />
    </Route>

      
    </Routes>
  );
}