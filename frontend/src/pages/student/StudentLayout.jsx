import React, { useState } from "react";
import { Outlet, useLocation, NavLink, useNavigate } from "react-router-dom";
import { BarChart3, CheckCircle, Calendar, Target, FileText, User, Bell, LogOut, Award, Zap, Menu, X, Smartphone} from "lucide-react";

const StudentLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  // Get student data from session storage
  const studentData = {
    id: sessionStorage.getItem("studentId"),
    registrationNo: sessionStorage.getItem("studentRegistrationNo"),
    fullName: sessionStorage.getItem("studentName"),
    status: sessionStorage.getItem("studentStatus"),
    department: sessionStorage.getItem("studentDepartment") || "Computer Science",
    year: sessionStorage.getItem("studentYear") || "3rd Year",
    institutionName: sessionStorage.getItem("institutionName")
  };

  const navItems = [
    { label: "Dashboard", icon: BarChart3, path: "/student" },
    { label: "Attendance", icon: CheckCircle, path: "/student/attendance" },
    { label: "Schedule", icon: Calendar, path: "/student/schedule" },
    { label: "Smart Planner", icon: Target, path: "/student/planner" },
    { label: "Tasks", icon: FileText, path: "/student/tasks" },
    { label: "Profile", icon: User, path: "/student/profile" },
  ];

  // Get active label for header
  const getActiveLabel = () => {
    const path = location.pathname;
    
    if (path === "/student" || path === "/student/dashboard") return "Dashboard";
    if (path.startsWith("/student/attendance")) return "Attendance";
    if (path.startsWith("/student/schedule")) return "Schedule";
    if (path.startsWith("/student/planner")) return "Smart Planner";
    if (path.startsWith("/student/tasks")) return "Tasks & Assignments";
    if (path.startsWith("/student/profile")) return "Profile & Settings";
    
    return "Student Portal";
  };

  const activeLabel = getActiveLabel();

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/login");
  };

  // Calculate quick stats
  const quickStats = {
    attendance: 92,
    streak: 5,
    points: 1280
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* =======================
          Sidebar
      ======================= */}
      <aside
        className={`fixed left-0 top-0 h-full bg-slate-900/95 backdrop-blur-xl border-r border-slate-700/50 transition-all duration-300 z-50 ${
          sidebarOpen ? "w-64" : "w-20"
        }`}
      >
        {/* Logo & Student Info */}
        <div className="p-6 border-b border-slate-700/50">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                  STUDENT PORTAL
                </h1>
                <p className="text-xs text-slate-400 mt-1">Smart Attendance & Planner</p>
              </div>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-slate-800 rounded-lg transition-colors focus:outline-none"
            >
              {sidebarOpen ? (
                <X size={20} className="text-slate-400" />
              ) : (
                <Menu size={20} className="text-slate-400" />
              )}
            </button>
          </div>
          
          {/* Student Profile */}
          {sidebarOpen && (
            <div className="mt-6 flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                {studentData.fullName?.charAt(0) || "S"}
              </div>
              <div>
                <p className="text-white font-medium truncate">{studentData.fullName || "Student"}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-slate-400 truncate">{studentData.registrationNo}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    studentData.status === 'ACTIVE' 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {studentData.year}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              end={item.path === "/student"}
              className={({ isActive }) =>
                `w-full flex items-center gap-3 px-4 py-3 rounded-lg
                 transition-colors duration-200
                 focus:outline-none focus-visible:outline-none
                 ${
                   isActive
                     ? "bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 border border-green-500/30"
                     : "text-slate-400 hover:bg-slate-800 hover:text-white"
                 }`
              }
            >
              <item.icon size={20} />
              {sidebarOpen && (
                <span className="font-medium">{item.label}</span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Gamification Stats */}
        {sidebarOpen && (
          <div className="mt-8 mx-4 p-4 bg-gradient-to-br from-green-900/20 to-emerald-900/20 rounded-xl border border-emerald-700/30">
            <h3 className="text-sm font-medium text-slate-400 mb-3 flex items-center gap-2">
              <Award size={14} />
              Your Stats
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-300">Attendance</span>
                <span className="font-semibold text-emerald-400">{quickStats.attendance}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-300">Streak</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-amber-400">{quickStats.streak} days</span>
                  <Zap size={12} className="text-amber-400" />
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-300">Points</span>
                <span className="font-semibold text-purple-400">{quickStats.points}</span>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        {sidebarOpen && (
          <div className="mt-4 mx-4">
            <button className="w-full py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
              <Smartphone size={16} />
              Scan Attendance
            </button>
          </div>
        )}
      </aside>

      {/* =======================
          Main Content
      ======================= */}
      <main
        className={`transition-all duration-300 ${
          sidebarOpen ? "ml-64" : "ml-20"
        }`}
      >
        {/* Header */}
        <header className="bg-slate-900/50 backdrop-blur-xl border-b border-slate-700/50 sticky top-0 z-40">
          <div className="px-8 py-5 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-white">
                {activeLabel}
              </h2>
              <p className="text-slate-400 mt-1">
                {activeLabel === "Dashboard" 
                  ? `Welcome back, ${studentData.fullName?.split(' ')[0] || "Student"}! Here's your personalized overview.`
                  : `Manage your ${activeLabel.toLowerCase()} efficiently`}
              </p>
            </div>

            <div className="flex items-center gap-4">
              
              {/* Quick Actions */}
              <div className="flex items-center gap-2">
                <button className="p-3 relative bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors">
                  <Bell size={20} className="text-slate-300" />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                
                <button 
                  onClick={handleLogout}
                  className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors flex items-center gap-2"
                >
                  <LogOut size={20} className="text-slate-300" />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Routed Pages */}
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default StudentLayout;