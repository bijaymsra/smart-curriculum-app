import React, { useState, useEffect } from "react";
import { Eye, EyeOff, Lock, Loader2, User, Building, Shield, GraduationCap, Key, CheckCircle, AlertCircle, Smartphone, Fingerprint} from "lucide-react";
import logo from "../images/logo.png";
import API_BASE from "../../config/api";



export default function Login() {
  const [userType, setUserType] = useState("admin"); // "admin", "superadmin", "faculty", "student"
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [registrationNo, setRegistrationNo] = useState("");
  const [institutionId, setInstitutionId] = useState("");
  const [facultyId, setFacultyId] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  // Load saved credentials if "Remember Me" was checked
  useEffect(() => {
    const savedUserType = localStorage.getItem("attenza_userType");
    const savedEmail = localStorage.getItem("attenza_email");
    const savedRememberMe = localStorage.getItem("attenza_rememberMe");
    
    if (savedRememberMe === "true" && savedUserType && savedEmail) {
      setUserType(savedUserType);
      if (savedUserType === "admin") {
        setEmail(savedEmail);
      }
      setRememberMe(true);
    }
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation based on user type
    let validationError = "";
    
    switch (userType) {
      case "admin":
        if (!email || !password) validationError = "Email and password are required";
        break;
      case "superadmin":
        if (!username || !password) validationError = "Username and password are required";
        break;
      case "faculty":
        if (!institutionId || !facultyId || !password) {
          validationError = "Institution ID, Faculty ID, and password are required";
        }
        break;
      case "student":
        if (!registrationNo || !password || !institutionId) {
          validationError = "Registration number, password, and institution ID are required";
        }
        break;
      default:
        validationError = "Please select a valid user type";
    }

    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      // Save credentials if "Remember Me" is checked
      if (rememberMe) {
        localStorage.setItem("attenza_userType", userType);
        if (userType === "admin") {
          localStorage.setItem("attenza_email", email);
        }
        localStorage.setItem("attenza_rememberMe", "true");
      } else {
        localStorage.removeItem("attenza_userType");
        localStorage.removeItem("attenza_email");
        localStorage.removeItem("attenza_rememberMe");
      }

      let endpoint = "";
      let requestBody = {};

      switch (userType) {
        case "admin":
          endpoint = `${API_BASE}/api/admin-auth/login`
          requestBody = { email, password };
          break;
        case "superadmin":
          endpoint = `${API_BASE}/api/superadmin-auth/login`;
          requestBody = { username, password };
          break;
        case "faculty":
          endpoint = `${API_BASE}/api/faculty/auth/login`;
          requestBody = { institutionId, facultyId, password };
          break;
        case "student":
          endpoint = `${API_BASE}/api/student/auth/login`;
          requestBody = { registrationNo, password, institutionId };
          break;
      }

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || `Login failed for ${userType}`);
      }

      // Save session data based on user type
      switch (userType) {
        case "admin":
          sessionStorage.setItem("adminId", data.adminId);
          sessionStorage.setItem("adminEmail", data.email);
          sessionStorage.setItem("adminName", data.fullName);
          sessionStorage.setItem("institutionName", data.institutionName);
          sessionStorage.setItem("adminStatus", data.status);
          sessionStorage.setItem("institutionId", data.institutionId);
          sessionStorage.setItem("userType", "admin");
          window.location.href = "/admin";
          break;
        
        case "superadmin":
          sessionStorage.setItem("superAdminId", data.superAdminId);
          sessionStorage.setItem("superAdminUsername", data.username);
          sessionStorage.setItem("superAdminName", data.fullName);
          sessionStorage.setItem("superAdminRole", data.role);
          sessionStorage.setItem("userType", "superadmin");
          window.location.href = "/superadmin/dashboard";
          break;
        
        case "faculty":
          sessionStorage.setItem("facultyId", data.facultyId);
          sessionStorage.setItem("facultyEmail", data.email);
          sessionStorage.setItem("facultyName", data.fullName);
          sessionStorage.setItem("facultyDepartment", data.department);
          sessionStorage.setItem("institutionName", data.institutionName);
          sessionStorage.setItem("institutionId", data.institutionId);
          sessionStorage.setItem("userType", "faculty");
          window.location.href = "/faculty";
          break;
        
        case "student":
          localStorage.setItem("token", data.token);
          localStorage.setItem("studentId", data.studentId);
          sessionStorage.setItem("studentId", data.studentId);
          sessionStorage.setItem("studentRegistrationNo", data.registrationNo);
          sessionStorage.setItem("studentName", data.fullName);
          sessionStorage.setItem("studentStatus", data.status);
          sessionStorage.setItem("institutionName", data.institutionName);
          sessionStorage.setItem("institutionPublicId", data.institutionPublicId);
          sessionStorage.setItem("institutionId", data.institutionId);
          sessionStorage.setItem("userType", "student");
          window.location.href = "/student";
          break;
      }

      setSuccess(`Welcome back! Redirecting to ${userType} dashboard...`);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Get user type color scheme
  const getUserTypeColor = (type) => {
    switch (type) {
      case "admin": return { bg: "from-blue-500 to-purple-500", text: "text-blue-400", border: "border-blue-500/30", bgLight: "bg-blue-500/20" };
      case "superadmin": return { bg: "from-red-500 to-orange-500", text: "text-red-400", border: "border-red-500/30", bgLight: "bg-red-500/20" };
      case "faculty": return { bg: "from-indigo-500 to-violet-500", text: "text-indigo-400", border: "border-indigo-500/30", bgLight: "bg-indigo-500/20" };
      case "student": return { bg: "from-green-500 to-emerald-500", text: "text-green-400", border: "border-green-500/30", bgLight: "bg-green-500/20" };
      default: return { bg: "from-blue-500 to-purple-500", text: "text-blue-400", border: "border-blue-500/30", bgLight: "bg-blue-500/20" };
    }
  };

  // Clear all form fields
  const clearForm = () => {
    setEmail("");
    setUsername("");
    setPassword("");
    setRegistrationNo("");
    setInstitutionId("");
    setFacultyId("");
    setError("");
    setSuccess("");
  };

  // Handle user type change
  const handleUserTypeChange = (type) => {
    clearForm();
    setUserType(type);
  };

  // Get current color scheme
  const colors = getUserTypeColor(userType);

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      
      {/* LEFT BRANDING SECTION */}
      <div className="hidden lg:flex flex-col justify-between p-12 text-white relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5"></div>
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          <a href="/" className="inline-flex items-center gap-2 text-slate-300 hover:text-white transition-colors mb-12 group">
            <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </a>

          <div className="flex items-center gap-4 mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 blur-lg opacity-50"></div>
              <img src={logo} alt="Attenza" className="h-16 w-16 relative z-10" />
            </div>
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Attenza
              </h1>
              <p className="text-slate-400 text-sm mt-1">Smart Campus Management</p>
            </div>
          </div>

          <p className="text-slate-300 max-w-md text-lg mb-10">
            Unified platform for attendance tracking, academic planning, and institutional analytics.
          </p>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <CheckCircle className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Multi-User Access</h3>
                <p className="text-slate-400 text-sm">Seamless login for all institutional roles</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <Shield className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Enterprise Security</h3>
                <p className="text-slate-400 text-sm">Bank-level encryption & secure authentication</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Smartphone className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Real-time Analytics</h3>
                <p className="text-slate-400 text-sm">Instant insights and detailed reports</p>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-slate-700/50">
            <div className="flex items-center gap-4 text-sm text-slate-400">
              <Fingerprint className="w-5 h-5" />
              <span>Secure Login • Encrypted Connection • 24/7 Support</span>
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-500 relative z-10">
          © {new Date().getFullYear()} Attenza. All rights reserved.
        </p>
      </div>

      {/* RIGHT LOGIN SECTION */}
      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">
              Welcome to <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Attenza</span>
            </h2>
            <p className="text-slate-400">
              Sign in to your institutional account
            </p>
          </div>

          {/* User Type Selection */}
          <div className="grid grid-cols-2 gap-3 mb-8">
            <button
              type="button"
              onClick={() => handleUserTypeChange("admin")}
              className={`p-3 rounded-xl transition-all duration-300 ${userType === "admin" 
                ? "bg-blue-500/20 border border-blue-500/50 shadow-lg shadow-blue-500/10" 
                : "bg-slate-700/30 hover:bg-slate-700/50 border border-slate-700"}`}
            >
              <div className="flex flex-col items-center gap-2">
                <Building className={`w-5 h-5 ${userType === "admin" ? "text-blue-400" : "text-slate-400"}`} />
                <span className={`text-sm font-medium ${userType === "admin" ? "text-blue-300" : "text-slate-300"}`}>
                  Admin
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleUserTypeChange("superadmin")}
              className={`p-3 rounded-xl transition-all duration-300 ${userType === "superadmin" 
                ? "bg-red-500/20 border border-red-500/50 shadow-lg shadow-red-500/10" 
                : "bg-slate-700/30 hover:bg-slate-700/50 border border-slate-700"}`}
            >
              <div className="flex flex-col items-center gap-2">
                <Shield className={`w-5 h-5 ${userType === "superadmin" ? "text-red-400" : "text-slate-400"}`} />
                <span className={`text-sm font-medium ${userType === "superadmin" ? "text-red-300" : "text-slate-300"}`}>
                  Super Admin
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleUserTypeChange("faculty")}
              className={`p-3 rounded-xl transition-all duration-300 ${userType === "faculty" 
                ? "bg-indigo-500/20 border border-indigo-500/50 shadow-lg shadow-indigo-500/10" 
                : "bg-slate-700/30 hover:bg-slate-700/50 border border-slate-700"}`}
            >
              <div className="flex flex-col items-center gap-2">
                <GraduationCap className={`w-5 h-5 ${userType === "faculty" ? "text-indigo-400" : "text-slate-400"}`} />
                <span className={`text-sm font-medium ${userType === "faculty" ? "text-indigo-300" : "text-slate-300"}`}>
                  Faculty
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleUserTypeChange("student")}
              className={`p-3 rounded-xl transition-all duration-300 ${userType === "student" 
                ? "bg-green-500/20 border border-green-500/50 shadow-lg shadow-green-500/10" 
                : "bg-slate-700/30 hover:bg-slate-700/50 border border-slate-700"}`}
            >
              <div className="flex flex-col items-center gap-2">
                <User className={`w-5 h-5 ${userType === "student" ? "text-green-400" : "text-slate-400"}`} />
                <span className={`text-sm font-medium ${userType === "student" ? "text-green-300" : "text-slate-300"}`}>
                  Student
                </span>
              </div>
            </button>
          </div>

          {/* Status Messages */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-3 animate-fadeIn">
              <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-xl flex items-start gap-3 animate-fadeIn">
              <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
              <p className="text-green-400 text-sm">{success}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Institution ID (for Faculty & Student) */}
            {(userType === "faculty" || userType === "student") && (
              <div>
                <label className="text-sm text-slate-300 mb-2 block">
                  Institution ID
                </label>
                <div className="relative group">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-400" size={18} />
                  <input
                    type="text"
                    value={institutionId}
                    onChange={(e) => setInstitutionId(e.target.value.toUpperCase())}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-700/50 text-white border border-slate-600 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                    placeholder="INST-6B139E59"
                  />
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  Provided by your institution (e.g., INST-6B139E59)
                </p>
              </div>
            )}

            {/* Faculty ID (for Faculty only) */}
            {userType === "faculty" && (
              <div>
                <label className="text-sm text-slate-300 mb-2 block">
                  Faculty ID
                </label>
                <div className="relative group">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-400" size={18} />
                  <input
                    type="text"
                    value={facultyId}
                    onChange={(e) => setFacultyId(e.target.value.toUpperCase())}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-700/50 text-white border border-slate-600 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                    placeholder="FACA0E95"
                  />
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  Sent to your institutional email
                </p>
              </div>
            )}

            {/* Username / Email / Registration (NOT for Faculty) */}
            {userType !== "faculty" && (
              <div>
                <label className="text-sm text-slate-300 mb-2 block">
                  {userType === "admin"
                    ? "Email Address"
                    : userType === "superadmin"
                    ? "Username"
                    : "Registration Number"}
                </label>

                <div className="relative group">
                  <input
                    type={userType === "admin" ? "email" : "text"}
                    value={
                      userType === "admin"
                        ? email
                        : userType === "superadmin"
                        ? username
                        : registrationNo
                    }
                    onChange={(e) => {
                      if (userType === "admin") setEmail(e.target.value);
                      else if (userType === "superadmin") setUsername(e.target.value);
                      else setRegistrationNo(e.target.value);
                    }}
                    placeholder={
                      userType === "admin"
                        ? "admin@institution.edu"
                        : userType === "superadmin"
                        ? "superadmin"
                        : "REG123456"
                    }
                    className="w-full pl-4 pr-4 py-3 rounded-xl bg-slate-700/50 text-white border border-slate-600"
                  />
                </div>
              </div>
            )}



            {/* Password Field */}
            <div>
              <label className="text-sm text-slate-300 mb-2 block">
                Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-400" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 rounded-xl bg-slate-700/50 text-white border border-slate-600 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {(userType === "faculty" || userType === "student") && (
                <p className="mt-2 text-xs text-slate-500">
                  System-generated password sent to your email
                </p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-3 text-slate-300 cursor-pointer group">
                <div className="relative">
                  <input 
                    type="checkbox" 
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${
                    rememberMe 
                      ? `${colors.bgLight} border-${colors.text.split('text-')[1]}`
                      : "bg-slate-700/50 border-slate-600 group-hover:border-slate-500"
                  }`}>
                    {rememberMe && (
                      <CheckCircle className="w-4 h-4 text-blue-400" />
                    )}
                  </div>
                </div>
                <span className="select-none">Remember me</span>
              </label>
              
              <button
                type="button"
                onClick={() => {
                  const message = userType === "admin" || userType === "superadmin" 
                    ? "Contact system administrator for password reset"
                    : "Contact your institution administrator for password reset";
                  alert(message);
                }}
                className="text-blue-400 hover:text-blue-300 hover:underline transition-colors"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full relative overflow-hidden py-4 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] ${
                loading ? "opacity-80 cursor-not-allowed" : ""
              } bg-gradient-to-r ${colors.bg} text-white`}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-3">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Authenticating...</span>
                </div>
              ) : (
                <>
                  <div className="relative z-10 flex items-center justify-center gap-3">
                    {userType === "admin" && <Building className="w-5 h-5" />}
                    {userType === "superadmin" && <Shield className="w-5 h-5" />}
                    {userType === "faculty" && <GraduationCap className="w-5 h-5" />}
                    {userType === "student" && <User className="w-5 h-5" />}
                    <span>Sign In as {userType.charAt(0).toUpperCase() + userType.slice(1)}</span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity"></div>
                </>
              )}
            </button>
          </form>

          {/* Additional Info & Help */}
          <div className="mt-8 pt-6 border-t border-slate-700/50">
            <div className="text-center space-y-3">
              <p className="text-slate-400 text-sm">
                {userType === "admin" || userType === "superadmin" 
                  ? "Need help accessing your account?"
                  : "Having trouble logging in?"}{" "}
                <button
                  type="button"
                  onClick={() => alert("Please contact your institutional IT support team for assistance.")}
                  className={`${colors.text} hover:underline`}
                >
                  Contact Support
                </button>
              </p>
              
              <div className="text-xs text-slate-500 space-y-1">
                <p>Your credentials are encrypted and secure</p>
                <p>Session expires after 24 hours of inactivity</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}