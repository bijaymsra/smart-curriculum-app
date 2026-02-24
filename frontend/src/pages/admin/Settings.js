import React, { useState, useEffect } from 'react';
import { User, Lock, Globe, Briefcase, Mail, Phone, Shield, EyeOff, MapPin, Copy, Building2, Calendar, CheckCircle, Bell, Eye, LogOut, AlertCircle, Loader2, Key, BarChart3} from 'lucide-react';
import API_BASE from "../../config/api";
import { authFetch } from "../../utils/authFetch";

export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile');
  const [darkMode, setDarkMode] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


// useEffect(() => {
//   if (darkMode) {
//     document.documentElement.classList.add("dark");
//   } else {
//     document.documentElement.classList.remove("dark");
//   }
// }, [darkMode]);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // const [notificationSettings, setNotificationSettings] = useState({
  //   emailNotifications: true,
  //   pushNotifications: true,
  //   attendanceAlerts: true,
  //   systemUpdates: false,
  //   weeklyReports: true
  // });

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'institution', label: 'Institution', icon: Building2 },
    { id: 'security', label: 'Security', icon: Lock },
    // { id: 'notifications', label: 'Notifications', icon: Bell },
    // { id: 'preferences', label: 'Preferences', icon: Globe }
  ];

  const handleCopyEmail = () => {
    if (adminData?.email) {
      navigator.clipboard.writeText(adminData.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePasswordChange = async () => {
    setPasswordError("");
    setPasswordSuccess("");

    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setPasswordError("All fields are required");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("New password and confirm password do not match");
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters");
      return;
    }

    const adminId = sessionStorage.getItem("adminId");
    setPasswordLoading(true);

    try {
      const res = await authFetch(
        "${API_BASE}/api/admin/security/change-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            adminId,
            currentPassword: passwordForm.currentPassword,
            newPassword: passwordForm.newPassword
          })
        }
      );

      const message = await res.text();

      if (!res.ok) {
        throw new Error(message);
      }

      setPasswordSuccess("Password updated successfully");

      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });

      setTimeout(() => setPasswordSuccess(""), 3000);

    } catch (err) {
      setPasswordError(err.message || "Failed to update password");
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleLogout = () => {
    if (!window.confirm("Are you sure you want to logout?")) return;
    sessionStorage.clear();
    window.location.href = "/login";
  };

  const getStatusBadge = (status) => {
    const styles = {
      APPROVED: 'bg-green-500/20 text-green-400 border-green-500/30',
      ACTIVE: 'bg-green-500/20 text-green-400 border-green-500/30',
      PENDING: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      REJECTED: 'bg-red-500/20 text-red-400 border-red-500/30',
      SUSPENDED: 'bg-red-500/20 text-red-400 border-red-500/30'
    };
    return styles[status] || styles.PENDING;
  };

  const getTypeDisplay = (type) => {
    const types = {
      university: 'University',
      college: 'College',
      school: 'School',
      institute: 'Training Institute'
    };
    return types[type] || type;
  };

  useEffect(() => {
    const adminId = sessionStorage.getItem("adminId");

    if (!adminId) {
      setError("Admin not logged in. Please log in again.");
      setLoading(false);
      return;
    }

    const loadData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Load admin profile
        const profileRes = await authFetch(
          `${API_BASE}/api/admin/me?adminId=${adminId}`
        );
        if (!profileRes.ok) {
          throw new Error("Failed to load admin profile");
        }
        const profileData = await profileRes.json();
        setAdminData(profileData);

        // Load notification settings
        // const notifRes = await authFetch(
        //   `${API_BASE}/api/admin/notifications?adminId=${adminId}`
        // );
        // if (notifRes.ok) {
        //   const notifData = await notifRes.json();
        //   setNotificationSettings({
        //     emailNotifications: notifData.emailNotifications ?? true,
        //     pushNotifications: notifData.pushNotifications ?? true,
        //     attendanceAlerts: notifData.attendanceAlerts ?? true,
        //     systemUpdates: notifData.systemUpdates ?? false,
        //     weeklyReports: notifData.weeklyReports ?? true
        //   });
        // }

        // Load preference settings
        // const prefRes = await authFetch(
        //   `${API_BASE}/api/admin/preferences?adminId=${adminId}`
        // );
        // if (prefRes.ok) {
        //   const prefData = await prefRes.json();
        //   setDarkMode(prefData.theme === "dark");
        // }

      } catch (err) {
        console.error("Settings load error:", err);
        setError(err.message || "Failed to load settings data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // const handleNotificationToggle = async (key) => {
  //   const adminId = sessionStorage.getItem("adminId");
  //   if (!adminId || !adminData) return;

  //   const updatedSettings = {
  //     ...notificationSettings,
  //     [key]: !notificationSettings[key]
  //   };

  //   // Optimistic UI update
  //   setNotificationSettings(updatedSettings);

  //   try {
  //     const res = await authFetch(
  //       `${API_BASE}/api/admin/notifications?adminId=${adminId}`,
  //       {
  //         method: "PUT",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify(updatedSettings)
  //       }
  //     );

  //     if (!res.ok) {
  //       throw new Error("Failed to update notification settings");
  //     }
  //   } catch (err) {
  //     console.error(err);
  //     setNotificationSettings(notificationSettings); 
  //   }
  // };

// const toggleTheme = async () => {
//   const adminId = sessionStorage.getItem("adminId");
//   const newTheme = darkMode ? "light" : "dark";

//   setDarkMode(newTheme === "dark");

//   try {
//     await authFetch(
//       `${API_BASE}/api/admin/preferences/theme?adminId=${adminId}&theme=${newTheme}`,
//       { method: "PUT" }
//     );
//   } catch (e) {
//     console.error("Theme update error:", e);
//   }
// };

  // ========== INDUSTRY-LEVEL LOADING & ERROR STATES ==========

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-950 flex items-center justify-center p-4">
        <div className="text-center">
          {/* Animated gradient spinner */}
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 animate-spin opacity-30 blur-sm"></div>
            <div className="absolute inset-2 rounded-full bg-gradient-to-br from-slate-900 to-slate-800"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-t-2 border-b-2 border-purple-500 rounded-full animate-spin animate-reverse"></div>
            </div>
          </div>
          
          {/* Loading text with dots animation */}
          <div className="space-y-3">
            <p className="text-slate-300 text-lg font-medium flex items-center justify-center gap-2">
              Loading your settings
              <span className="flex gap-1">
                <span className="animate-bounce">.</span>
                <span className="animate-bounce" style={{ animationDelay: '0.1s' }}>.</span>
                <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>.</span>
              </span>
            </p>
            <p className="text-slate-500 text-sm max-w-md mx-auto">
              Loading profile information, and security settings...
            </p>
          </div>
          
          {/* Progress bar */}
          <div className="mt-8 max-w-md mx-auto">
            <div className="w-full h-2 bg-slate-800/50 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-progress"></div>
            </div>
            <p className="text-slate-400 text-xs mt-2">Initializing settings dashboard</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-950 flex items-center justify-center p-4">
        <div className="text-center p-8 bg-red-900/20 border border-red-700/50 rounded-2xl backdrop-blur-xl max-w-md w-full">
          <AlertCircle className="text-red-400 mx-auto mb-4 animate-pulse" size={56} />
          <h2 className="text-2xl font-bold text-white mb-3">Error Loading Settings</h2>
          <p className="text-slate-300 mb-6 bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
            {error}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-red-500/20 transition-all flex items-center justify-center gap-2"
            >
              <Loader2 size={18} />
              Retry Loading
            </button>
            <button 
              onClick={() => window.location.href = '/admin'}
              className="px-6 py-3 bg-slate-700/50 hover:bg-slate-700 text-white rounded-xl font-medium border border-slate-600/50 transition-all"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!adminData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-950 flex items-center justify-center p-4">
        <div className="text-center p-8 bg-slate-800/30 border border-slate-700/50 rounded-2xl backdrop-blur-xl max-w-md w-full">
          <User className="text-slate-400 mx-auto mb-4" size={56} />
          <h2 className="text-2xl font-bold text-white mb-3">No Admin Data</h2>
          <p className="text-slate-300 mb-6">
            Unable to load admin profile data. Please check your connection and try again.
          </p>
          <button 
            onClick={() => window.location.href = '/login'}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-blue-500/20 transition-all"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // ========== MAIN COMPONENT RENDER ==========

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-400 mt-1 flex items-center gap-2">
            <Calendar size={16} />
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
        
        {/* Quick Stats Badge */}
        <div className="flex items-center gap-3 bg-slate-800/50 px-4 py-2 rounded-xl border border-slate-700/50">
          <BarChart3 className="text-blue-400" size={20} />
          <span className="text-sm text-slate-300">Real-time updates</span>
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-2 border border-slate-700/50">
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/20'
                  : 'text-slate-400 hover:bg-slate-700/50 hover:text-white hover:scale-105'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-1 bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl font-bold text-white shadow-lg">
                {adminData.fullName?.charAt(0)?.toUpperCase() || 'A'}
              </div>
              <h3 className="text-xl font-bold text-white mb-1">{adminData.fullName?.toUpperCase() || 'ADMIN'}</h3>
              <p className="text-slate-400 text-sm mb-3">{adminData.designation || 'Administrator'}</p>
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${getStatusBadge(adminData.status)}`}>
                <CheckCircle size={16} />
                <span className="text-sm font-medium">{adminData.status || 'ACTIVE'}</span>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-700">
                <div className="flex items-center justify-center gap-2 text-slate-400 text-sm">
                  <Calendar size={16} />
                  <span>Joined {new Date(adminData.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              
              {/* Logout Button in Profile Card */}
              <button
                onClick={handleLogout}
                className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl font-medium transition-all hover:shadow-lg hover:shadow-red-500/20"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <User size={20} />
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Full Name</label>
                  <div className="bg-slate-700/50 rounded-lg px-4 py-3 text-white">
                    {adminData.fullName || 'N/A'}
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Designation</label>
                  <div className="bg-slate-700/50 rounded-lg px-4 py-3 text-white flex items-center gap-2">
                    <Briefcase size={16} className="text-slate-400" />
                    {adminData.designation || 'N/A'}
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Email Address</label>
                  <div className="bg-slate-700/50 rounded-lg px-4 py-3 text-white flex items-center justify-between group">
                    <div className="flex items-center gap-2 flex-1 truncate">
                      <Mail size={16} className="text-slate-400 flex-shrink-0" />
                      <span className="truncate">{adminData.email || 'N/A'}</span>
                    </div>
                    <button
                      onClick={handleCopyEmail}
                      className="ml-2 p-2 hover:bg-slate-600 rounded-lg transition-colors flex-shrink-0"
                      title="Copy email"
                    >
                      {copied ? (
                        <CheckCircle size={16} className="text-green-400" />
                      ) : (
                        <Copy size={16} className="text-slate-400" />
                      )}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Phone Number</label>
                  <div className="bg-slate-700/50 rounded-lg px-4 py-3 text-white flex items-center gap-2">
                    <Phone size={16} className="text-slate-400" />
                    {adminData.phone || 'N/A'}
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Role</label>
                  <div className="bg-slate-700/50 rounded-lg px-4 py-3 text-white flex items-center gap-2">
                    <Shield size={16} className="text-slate-400" />
                    {adminData.role || 'Administrator'}
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Admin ID</label>
                  <div className="bg-slate-700/50 rounded-lg px-4 py-3 text-white font-mono">
                    {adminData.publicId || adminData.adminId || 'N/A'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Institution Tab */}
      {activeTab === 'institution' && (
        <div className="space-y-6">
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  {adminData?.institutionName || 'Institution Name'}
                </h3>
                <div className="flex items-center gap-3">
                  <span className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium border border-blue-500/30">
                    {getTypeDisplay(adminData.institutionType) || 'Educational Institution'}
                  </span>
                  <span className="text-slate-400 text-sm">
                    ID: {adminData.institutionPublicId || adminData.institutionId || 'N/A'}
                  </span>
                </div>
              </div>
              <Building2 size={48} className="text-slate-600" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-slate-700/30 rounded-xl p-4 hover:bg-slate-700/40 transition-all">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <Mail size={20} className="text-blue-400" />
                  </div>
                  <span className="text-sm text-slate-400">Email</span>
                </div>
                <p className="text-white font-medium truncate">{adminData.institutionEmail || 'N/A'}</p>
              </div>

              <div className="bg-slate-700/30 rounded-xl p-4 hover:bg-slate-700/40 transition-all">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <Phone size={20} className="text-purple-400" />
                  </div>
                  <span className="text-sm text-slate-400">Phone</span>
                </div>
                <p className="text-white font-medium">{adminData.institutionPhone || 'N/A'}</p>
              </div>

              <div className="bg-slate-700/30 rounded-xl p-4 hover:bg-slate-700/40 transition-all">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-pink-500/20 rounded-lg">
                    <Calendar size={20} className="text-pink-400" />
                  </div>
                  <span className="text-sm text-slate-400">Established</span>
                </div>
                <p className="text-white font-medium">
                  {adminData.institutionCreatedAt 
                    ? new Date(adminData.institutionCreatedAt).toLocaleDateString() 
                    : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <MapPin size={20} />
              Location Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-slate-400 mb-2">Address</label>
                <div className="bg-slate-700/50 rounded-lg px-4 py-3 text-white">
                  {adminData.institutionAddress || 'N/A'}
                </div>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">City</label>
                <div className="bg-slate-700/50 rounded-lg px-4 py-3 text-white">
                  {adminData.institutionCity || 'N/A'}
                </div>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">State</label>
                <div className="bg-slate-700/50 rounded-lg px-4 py-3 text-white">
                  {adminData.institutionState || 'N/A'}
                </div>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">ZIP Code</label>
                <div className="bg-slate-700/50 rounded-lg px-4 py-3 text-white">
                  {adminData.institutionZipCode || 'N/A'}
                </div>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Country</label>
                <div className="bg-slate-700/50 rounded-lg px-4 py-3 text-white">
                  {adminData.institutionCountry || 'N/A'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Key size={20} />
            Change Password
          </h3>
          <div className="space-y-6 max-w-2xl">
            <div>
              <label className="block text-sm text-slate-400 mb-2">Current Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                  className="w-full bg-slate-700/50 rounded-lg px-4 py-3 text-white border border-slate-600 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                  placeholder="Enter current password"
                  disabled={passwordLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white disabled:opacity-50"
                  disabled={passwordLoading}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-2">New Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                className="w-full bg-slate-700/50 rounded-lg px-4 py-3 text-white border border-slate-600 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                placeholder="Enter new password"
                disabled={passwordLoading}
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-2">Confirm New Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                className="w-full bg-slate-700/50 rounded-lg px-4 py-3 text-white border border-slate-600 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                placeholder="Confirm new password"
                disabled={passwordLoading}
              />
            </div>

            {/* Error Message */}
            {passwordError && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm flex items-center gap-2 animate-fadeIn">
                <AlertCircle size={16} />
                {passwordError}
              </div>
            )}

            {/* Success Message */}
            {passwordSuccess && (
              <div className="bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-3 rounded-lg text-sm flex items-center gap-2 animate-fadeIn">
                <CheckCircle size={16} />
                {passwordSuccess}
              </div>
            )}

            <button
              onClick={handlePasswordChange}
              disabled={passwordLoading}
              className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 w-full
                ${passwordLoading
                  ? "bg-slate-600 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-500 to-purple-500 hover:shadow-lg hover:shadow-blue-500/20 text-white hover:scale-105 active:scale-95"
                }`}
            >
              {passwordLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Updating Password...
                </>
              ) : (
                'Update Password'
              )}
            </button>

          </div>
        </div>
      )}

      {/* Notifications Tab */}
      {/* {activeTab === 'notifications' && (
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Bell size={20} />
            Notification Preferences
          </h3>
          <div className="space-y-4 max-w-2xl">
            {Object.entries(notificationSettings).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between p-4 bg-slate-700/30 rounded-xl hover:bg-slate-700/40 transition-all">
                <div>
                  <p className="text-white font-medium">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </p>
                  <p className="text-sm text-slate-400 mt-1">
                    {key === 'emailNotifications' && 'Receive notifications via email'}
                    {key === 'pushNotifications' && 'Get push notifications in browser'}
                    {key === 'attendanceAlerts' && 'Alert when attendance is below threshold'}
                    {key === 'systemUpdates' && 'System maintenance and updates'}
                    {key === 'weeklyReports' && 'Weekly summary reports'}
                  </p>
                </div>
                <button
                  onClick={() => handleNotificationToggle(key)}
                  className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${
                    value ? 'bg-blue-500' : 'bg-slate-600'
                  }`}
                >
                  <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform duration-300 ${
                    value ? 'translate-x-7' : 'translate-x-0'
                  }`}></div>
                </button>
              </div>
            ))}
          </div>
        </div>
      )} */}

      {/* Preferences Tab */}
      {/* {activeTab === 'preferences' && (
        <div className="space-y-6">
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Globe size={20} />
              Appearance
            </h3>
            <div className="space-y-4 max-w-2xl">
              <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-xl hover:bg-slate-700/40 transition-all">
                <div className="flex items-center gap-3">
                  {darkMode ? (
                    <Moon size={20} className="text-blue-400" />
                  ) : (
                    <Sun size={20} className="text-yellow-400" />
                  )}
                  <div>
                    <p className="text-white font-medium">Theme Mode</p>
                    <p className="text-sm text-slate-400 mt-1">Switch between light and dark mode</p>
                  </div>
                </div>
                <button
                  onClick={toggleTheme}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-lg transition-all hover:scale-105 active:scale-95"
                >
                  {darkMode ? 'Switch to Light' : 'Switch to Dark'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
}