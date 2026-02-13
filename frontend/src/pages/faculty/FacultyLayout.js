import React, { useState,useEffect } from "react";
import { Outlet, useLocation, NavLink, useNavigate } from "react-router-dom";
import { BarChart3, ClipboardCheck, TrendingUp, Settings as SettingsIcon, Menu, X, Bell, LogOut} from "lucide-react";
import { authFetch } from "../../utils/authFetch";
import API_BASE from "../../config/api";

const FacultyLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [loadingNotifications, setLoadingNotifications] = useState(false);

  const unreadCount = notifications.filter(n => n.unread).length;



  useEffect(() => {
  fetchNotifications();
}, []);


  const fetchNotifications = async () => {
  try {
    setLoadingNotifications(true);

    const res = await authFetch(
      `${API_BASE}/api/faculty/notifications/me`
    );

    if (!res.ok) throw new Error("Failed to fetch notifications");

    const data = await res.json();
    setNotifications(data);

  } catch (err) {
    console.error("Notification error:", err);
  } finally {
    setLoadingNotifications(false);
  }
};



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
  { label: "Analytics", icon: TrendingUp, path: "/faculty/analytics" },
  { label: "Settings", icon: SettingsIcon, path: "/faculty/settings" }, 
];

  // Get active label for header
  const getActiveLabel = () => {
    const path = location.pathname;
    
    if (path === "/faculty" || path === "/faculty/dashboard") return "Dashboard";
    if (path.startsWith("/faculty/attendance")) return "Attendance Management";
    if (path.startsWith("/faculty/analytics")) return "Analytics";
    if (path.startsWith("/faculty/settings")) return "Settings";
    
    return "Faculty Portal";
  };

  const activeLabel = getActiveLabel();

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/login");
  };



  useEffect(() => {
  const token = sessionStorage.getItem("token");
  const role = sessionStorage.getItem("role");

  if (!token || role !== "FACULTY") {
    navigate("/login");
  }
}, [navigate]);


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
            <div className="mt-6 flex items-start gap-4 px-2 group">
              {/* Avatar Section */}
              <div className="relative flex-shrink-0 mt-0.5">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full opacity-20 group-hover:opacity-50 transition duration-300 blur-sm"></div>
                <div className="relative w-11 h-11 bg-slate-900 rounded-full flex items-center justify-center border border-slate-700/50 shadow-2xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-600/10" />
                  <span className="relative z-10 bg-gradient-to-br from-white to-slate-400 bg-clip-text text-transparent font-bold text-lg">
                    {facultyData.fullName?.charAt(0) || "F"}
                  </span>
                </div>
              </div>

              <div className="flex flex-col min-w-0 pr-2">
                <p className="text-white font-semibold text-sm truncate tracking-wide mb-0.5">
                  {facultyData.fullName || "Faculty"}
                </p>
                <p className="text-[10px] sm:text-xs text-slate-500 font-medium leading-tight line-clamp-2">
                  {facultyData.department || "Department"}
                </p>
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
                
            <div className="relative">

              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-3 relative bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
              >
                <Bell size={20} className="text-slate-300" />

                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
              <div className="absolute right-0 mt-3 w-96 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl z-50 max-h-[400px] overflow-y-auto">

                <div className="p-4 border-b border-slate-700">
                  <h4 className="text-white font-semibold">Notifications</h4>
                </div>

                {loadingNotifications ? (
                  <div className="p-6 text-center text-slate-400">
                    Loading...
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="p-6 text-center text-slate-400">
                    No notifications
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        setShowNotifications(false);
                        navigate(n.actionUrl);
                      }}
                      className={`p-4 border-b border-slate-800 cursor-pointer hover:bg-slate-800 transition ${
                        n.unread ? "bg-slate-800/40" : ""
                      }`}
                    >
                      <div className="flex items-start gap-3">

                        <div className={`w-2 h-2 mt-2 rounded-full ${
                          n.type === "ALERT" ? "bg-red-500" : "bg-blue-500"
                        }`} />

                        <div className="flex-1">
                          <p className="text-white font-medium text-sm">
                            {n.title}
                          </p>
                          <p className="text-slate-400 text-xs mt-1">
                            {n.message}
                          </p>
                          <p className="text-slate-500 text-[10px] mt-2">
                            {new Date(n.timestamp).toLocaleString()}
                          </p>
                        </div>

                      </div>
                    </div>
                  ))
                )}

              </div>
            )}
            </div>

                
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