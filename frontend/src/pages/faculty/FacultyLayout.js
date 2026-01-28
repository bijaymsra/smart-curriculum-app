import React, { useState } from "react";
import { Outlet, useLocation, NavLink, useNavigate } from "react-router-dom";
import { BarChart3, ClipboardCheck, Calendar, Users2, TrendingUp, Settings as SettingsIcon, Menu, X, Bell, LogOut, FileText} from "lucide-react";

const FacultyLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  // Get faculty data from session storage
  const facultyData = {
    id: sessionStorage.getItem("facultyId"),
    fullName: sessionStorage.getItem("facultyName"),
    email: sessionStorage.getItem("facultyEmail"),
    department: sessionStorage.getItem("facultyDepartment"),
    designation: sessionStorage.getItem("facultyDesignation") || "Assistant Professor",
  };

const navItems = [
  { label: "Dashboard", icon: BarChart3, path: "/faculty" },
  { label: "Take Attendance", icon: ClipboardCheck, path: "/faculty/attendance" },
  { label: "My Classes", icon: Calendar, path: "/faculty/classes" },
  { label: "Students", icon: Users2, path: "/faculty/students" },
  { label: "Analytics", icon: TrendingUp, path: "/faculty/analytics" },
  { label: "Settings", icon: SettingsIcon, path: "/faculty/settings" }, 
];

  // Get active label for header
  const getActiveLabel = () => {
    const path = location.pathname;
    
    if (path === "/faculty" || path === "/faculty/dashboard") return "Dashboard";
    if (path.startsWith("/faculty/attendance")) return "Attendance Management";
    if (path.startsWith("/faculty/classes")) return "Class Management";
    if (path.startsWith("/faculty/students")) return "Student Management";
    if (path.startsWith("/faculty/analytics")) return "Analytics";
    if (path.startsWith("/faculty/settings")) return "Settings";
    
    return "Faculty Portal";
  };

  const activeLabel = getActiveLabel();

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/login");
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
        {/* Logo & Faculty Info */}
        <div className="p-6 border-b border-slate-700/50">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                  ATTENZA
                </h1>
                <p className="text-xs text-slate-400 mt-1">Faculty Portal</p>
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
          
          {/* Faculty Profile */}
          {sidebarOpen && (
            <div className="mt-6 flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                {facultyData.fullName?.charAt(0) || "F"}
              </div>

              <div>
                <p className="text-white font-medium truncate">{facultyData.fullName || "Faculty"}</p>
                <p className="text-xs text-slate-400 truncate">{facultyData.department || "Department"}</p>
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
              end={item.path === "/faculty"}
              className={({ isActive }) =>
                `w-full flex items-center gap-3 px-4 py-3 rounded-lg
                 transition-colors duration-200
                 focus:outline-none focus-visible:outline-none
                 ${
                   isActive
                     ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-400 border border-blue-500/30"
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

        {/* Quick Stats */}
        {sidebarOpen && (
          <div className="mt-8 mx-4 p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
            <h3 className="text-sm font-medium text-slate-400 mb-3">Today's Overview</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-300">Classes</span>
                <span className="font-semibold text-blue-400">3</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-300">Attendance</span>
                <span className="font-semibold text-emerald-400">93%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-300">Pending</span>
                <span className="font-semibold text-amber-400">2</span>
              </div>
            </div>
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
                  ? `Welcome back, ${facultyData.fullName?.split(' ')[0] || "Professor"}! Here's your overview.`
                  : `Manage ${activeLabel.toLowerCase()} efficiently`}
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

export default FacultyLayout;