import React, { useState } from "react";
import { Outlet, useLocation, NavLink, useNavigate } from "react-router-dom";
import { BarChart3, CheckCircle, FileText, User, LogOut, Menu, X} from "lucide-react";

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
    { label: "Mark Attendance", icon: CheckCircle, path: "/student/attendance" },
    { label: "Smart Planner", icon: FileText, path: "/student/tasks" },
    { label: "Profile", icon: User, path: "/student/profile" },
  ];

  // Get active label for header
  const getActiveLabel = () => {
    const path = location.pathname;
    
    if (path === "/student" || path === "/student/dashboard") return "Dashboard";
    if (path.startsWith("/student/attendance")) return "Attendance";
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
    attendance: 0,
    streak: 0,
    points: 0
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
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
                  ATTENZA
                </h1>
                <p className="text-xs text-slate-400 mt-1">Student Portal</p>
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
            <div className="mt-6 flex items-start gap-4 px-2 group">
              {/* Avatar Section */}
              <div className="relative flex-shrink-0 mt-0.5">
                {/* Emerald Outer Glow */}
                <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full opacity-20 group-hover:opacity-50 transition duration-300 blur-sm"></div>
                
                {/* Main Avatar Circle */}
                <div className="relative w-11 h-11 bg-slate-900 rounded-full flex items-center justify-center border border-slate-700/50 shadow-2xl overflow-hidden">
                  {/* Subtle Background Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-600/10" />
                  
                  {/* The Initial */}
                  <span className="relative z-10 bg-gradient-to-br from-white to-slate-400 bg-clip-text text-transparent font-bold text-lg">
                    {studentData.fullName?.charAt(0) || "S"}
                  </span>
                </div>
              </div>

                {/* Text Section */}
                <div className="flex flex-col min-w-0 flex-1">
                  {/* Name - Takes the top row */}
                <p className="text-white font-semibold text-sm truncate tracking-wide">
                    {studentData.fullName || "Student"}
                  </p>
                  
                  {/* Info Row - Optimized for space */}
                  <div className="flex flex-col gap-0.5 mt-1">
                    {/* Registration Number */}
                    <span className="text-[10px] text-slate-500 font-medium truncate leading-none">
                      {studentData.registrationNo}
                    </span>
                    
                    {/* Year Badge - Pushed to its own line or made very compact */}
                    <div className="mt-1">
                      <span className={`inline-flex items-center text-[9px] px-1.5 py-0.5 rounded-md font-bold border uppercase tracking-wider ${
                        studentData.status === 'ACTIVE' 
                          ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                          : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                      }`}>
                        {studentData.year}
                      </span>
                    </div>
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
      </aside>

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