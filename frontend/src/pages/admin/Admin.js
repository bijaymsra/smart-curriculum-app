import React, { useState } from "react";
import { Outlet, useLocation, NavLink } from "react-router-dom";
import {Users, GraduationCap, Settings as SettingsIcon, BookOpen, Calendar, TrendingUp, Menu, X, BarChart3, Clock} from "lucide-react";
import { useAdmin } from "../../context/AdminContext";

// =======================
// Admin Layout Component
// =======================
const Admin = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { admin } = useAdmin();
  const location = useLocation();

  const navItems = [
    { label: "Dashboard Overview", icon: BarChart3, path: "/admin" },
    { label: "Student Management", icon: Users, path: "/admin/students" },
    { label: "Faculty Management", icon: GraduationCap, path: "/admin/faculty" },
    { label: "Course Management", icon: BookOpen, path: "/admin/courses" },
    { label: "Attendance Analytics", icon: Calendar, path: "/admin/attendance" },
    { label: "Timetable Management", icon: Clock, path: "/admin/timetable" },
    { label: "Analytics Overview", icon: TrendingUp, path: "/admin/analytics" },
    { label: "Admin Profile", icon: SettingsIcon, path: "/admin/settings" },
  ];

  // -----------------------
  // Active Header Label
  // -----------------------
  const getActiveLabel = () => {
    const path = location.pathname;

    // if (path === "/admin") return "Dashboard";
    if (path.startsWith("/admin/students")) return "Student Management";
    if (path.startsWith("/admin/faculty")) return "Faculty Management";
    if (path.startsWith("/admin/courses")) return "Courses Management";
    if (path.startsWith("/admin/attendance")) return "Attendance Analytics";
    if (path.startsWith("/admin/timetable")) return "Timetable Management";
    if (path.startsWith("/admin/analytics")) return "Analytics Overview";
    if (path.startsWith("/admin/settings")) return "Admin Profile";

    return "Dashboard Overview";
  };

  const activeLabel = getActiveLabel();

  // =======================
  // Render
  // =======================
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
        {/* Logo */}
        <div className="p-6 border-b border-slate-700/50">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                  ATTENZA
                </h1>
                <p className="text-xs text-slate-400 mt-1">Admin Portal</p>
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
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              end={item.path === "/admin"}
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
          <div className="px-8 py-6 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-white">
                {activeLabel}
              </h2>
              <p className="text-slate-400 mt-1">
                {activeLabel === "Dashboard Overview"
                  ? "Welcome, Here’s a summary of your platform’s activity."
                  : `Centralized controls and metrics for ${activeLabel.toLowerCase()}.`}
              </p>
            </div>

            <div className="flex items-center gap-4">
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

export default Admin;
