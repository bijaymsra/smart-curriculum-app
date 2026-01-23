import React, { useState, useEffect, useRef } from "react";
import { 
  Eye, EyeOff, Mail, Lock, Loader2, User, Building, 
  Shield, GraduationCap, Key, CheckCircle, AlertCircle,
  Smartphone, Fingerprint, Sparkles, Cpu, ShieldCheck,
  LogIn, ArrowRight, ChevronRight
} from "lucide-react";
import logo from "../images/logo.png";

export default function Login() {
  const [userType, setUserType] = useState("admin");
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
  const [activeField, setActiveField] = useState("");
  
  const formRef = useRef(null);

  // Particle animation
  useEffect(() => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '1';
    document.body.appendChild(canvas);

    let particles = [];
    let animationId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.color = `rgba(${Math.random() * 100 + 155}, ${Math.random() * 100 + 155}, 255, 0.1)`;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x > canvas.width) this.x = 0;
        else if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        else if (this.y < 0) this.y = canvas.height;
      }
      draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const init = () => {
      particles = [];
      for (let i = 0; i < 50; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });
      animationId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resize);
    resize();
    init();
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
      document.body.removeChild(canvas);
    };
  }, []);

  // Load saved credentials
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation
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
    }

    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      // Save credentials
      if (rememberMe) {
        localStorage.setItem("attenza_userType", userType);
        if (userType === "admin") localStorage.setItem("attenza_email", email);
        localStorage.setItem("attenza_rememberMe", "true");
      }

      let endpoint = "";
      let requestBody = {};

      switch (userType) {
        case "admin":
          endpoint = "http://localhost:8080/api/admin-auth/login";
          requestBody = { email, password };
          break;
        case "superadmin":
          endpoint = "http://localhost:8080/api/superadmin-auth/login";
          requestBody = { username, password };
          break;
        case "faculty":
          endpoint = "http://localhost:8080/api/faculty-auth/login";
          requestBody = { institutionId, facultyId, password };
          break;
        case "student":
          endpoint = "http://localhost:8080/api/student/auth/login";
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

      // Save session data
      switch (userType) {
        case "admin":
          sessionStorage.setItem("adminId", data.adminId);
          sessionStorage.setItem("adminEmail", data.email);
          sessionStorage.setItem("adminName", data.fullName);
          sessionStorage.setItem("institutionName", data.institutionName);
          sessionStorage.setItem("adminStatus", data.status);
          sessionStorage.setItem("institutionId", data.institutionId);
          sessionStorage.setItem("userType", "admin");
          setSuccess("Welcome back! Redirecting to Admin Dashboard...");
          setTimeout(() => window.location.href = "/admin", 1500);
          break;
        
        case "superadmin":
          sessionStorage.setItem("superAdminId", data.superAdminId);
          sessionStorage.setItem("superAdminUsername", data.username);
          sessionStorage.setItem("superAdminName", data.fullName);
          sessionStorage.setItem("superAdminRole", data.role);
          sessionStorage.setItem("userType", "superadmin");
          setSuccess("Welcome Super Admin! Redirecting...");
          setTimeout(() => window.location.href = "/superadmin/dashboard", 1500);
          break;
        
        case "faculty":
          sessionStorage.setItem("facultyId", data.facultyId);
          sessionStorage.setItem("facultyEmail", data.email);
          sessionStorage.setItem("facultyName", data.fullName);
          sessionStorage.setItem("facultyDepartment", data.department);
          sessionStorage.setItem("institutionName", data.institutionName);
          sessionStorage.setItem("institutionId", data.institutionId);
          sessionStorage.setItem("userType", "faculty");
          setSuccess("Welcome Professor! Redirecting to Faculty Portal...");
          setTimeout(() => window.location.href = "/faculty/dashboard", 1500);
          break;
        
        case "student":
          sessionStorage.setItem("studentId", data.studentId);
          sessionStorage.setItem("studentRegistrationNo", data.registrationNo);
          sessionStorage.setItem("studentName", data.fullName);
          sessionStorage.setItem("studentStatus", data.status);
          sessionStorage.setItem("institutionName", data.institutionName);
          sessionStorage.setItem("institutionPublicId", data.institutionPublicId);
          sessionStorage.setItem("institutionId", data.institutionId);
          sessionStorage.setItem("userType", "student");
          setSuccess("Welcome Student! Redirecting to Dashboard...");
          setTimeout(() => window.location.href = "/student/dashboard", 1500);
          break;
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getUserTypeConfig = (type) => {
    switch (type) {
      case "admin": 
        return {
          gradient: "from-blue-600 via-indigo-600 to-purple-600",
          color: "blue",
          icon: Building,
          title: "Institutional Admin",
          desc: "Manage institution settings & analytics"
        };
      case "superadmin": 
        return {
          gradient: "from-rose-600 via-red-600 to-orange-600",
          color: "red",
          icon: Shield,
          title: "System Super Admin",
          desc: "Full system control & management"
        };
      case "faculty": 
        return {
          gradient: "from-indigo-600 via-purple-600 to-violet-600",
          color: "indigo",
          icon: GraduationCap,
          title: "Faculty Member",
          desc: "Access teaching materials & analytics"
        };
      case "student": 
        return {
          gradient: "from-emerald-600 via-green-600 to-teal-600",
          color: "green",
          icon: User,
          title: "Student",
          desc: "Access courses & attendance"
        };
      default: return {
        gradient: "from-blue-600 to-purple-600",
        color: "blue",
        icon: Building
      };
    }
  };

  const config = getUserTypeConfig(userType);

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

  const handleUserTypeChange = (type) => {
    clearForm();
    setUserType(type);
  };

  // Field components for reusability
  const InputField = ({ 
    label, 
    value, 
    onChange, 
    type = "text", 
    placeholder, 
    icon: Icon, 
    fieldKey,
    autoCapitalize = false 
  }) => (
    <div className="space-y-2">
      <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
        <span>{label}</span>
        {activeField === fieldKey && (
          <span className="inline-flex items-center gap-1 text-xs text-blue-400">
            <ChevronRight size={12} />
            Active
          </span>
        )}
      </label>
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl blur-sm group-focus-within:blur-md transition-all duration-300 opacity-0 group-focus-within:opacity-100"></div>
        <div className="relative">
          <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-400 transition-colors z-10" size={20} />
          <input
            type={type}
            value={value}
            onChange={(e) => onChange(autoCapitalize ? e.target.value.toUpperCase() : e.target.value)}
            onFocus={() => setActiveField(fieldKey)}
            onBlur={() => setActiveField("")}
            className="w-full pl-12 pr-4 py-4 bg-slate-900/60 backdrop-blur-sm border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all duration-300 relative z-10"
            placeholder={placeholder}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4 overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Main Container */}
      <div className="relative w-full max-w-7xl mx-auto z-10">
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Left Panel - Brand & Features */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur-xl opacity-30"></div>
                  <img src={logo} alt="Attenza" className="h-14 w-14 relative z-10" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent animate-gradient">
                    Attenza
                  </h1>
                  <p className="text-slate-400 text-sm">Enterprise Campus Management</p>
                </div>
              </div>
              <a 
                href="/" 
                className="group flex items-center gap-2 text-slate-400 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-slate-800/50"
              >
                <ArrowRight className="w-4 h-4 rotate-180" />
                <span className="text-sm font-medium">Back to Home</span>
              </a>
            </div>

            {/* Hero Section */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-slate-800/50 rounded-full border border-slate-700">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-slate-300">Industry-Grade Authentication System</span>
              </div>
              <h2 className="text-5xl font-bold text-white leading-tight">
                Secure Access to Your <br />
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Institutional Portal
                </span>
              </h2>
              <p className="text-xl text-slate-400 max-w-2xl">
                Unified platform for administrators, faculty, and students with enterprise-level security and real-time analytics.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-3 gap-6 pt-8">
              <div className="group p-6 bg-slate-900/40 backdrop-blur-sm rounded-2xl border border-slate-800 hover:border-blue-500/50 transition-all duration-300 hover:scale-[1.02]">
                <div className="p-3 bg-blue-500/10 rounded-xl w-fit mb-4">
                  <ShieldCheck className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Military-Grade Security</h3>
                <p className="text-slate-400 text-sm">256-bit encryption, 2FA ready, SOC2 compliant infrastructure.</p>
              </div>

              <div className="group p-6 bg-slate-900/40 backdrop-blur-sm rounded-2xl border border-slate-800 hover:border-purple-500/50 transition-all duration-300 hover:scale-[1.02]">
                <div className="p-3 bg-purple-500/10 rounded-xl w-fit mb-4">
                  <Cpu className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Real-time Analytics</h3>
                <p className="text-slate-400 text-sm">Live dashboards, predictive insights, and automated reports.</p>
              </div>

              <div className="group p-6 bg-slate-900/40 backdrop-blur-sm rounded-2xl border border-slate-800 hover:border-green-500/50 transition-all duration-300 hover:scale-[1.02]">
                <div className="p-3 bg-green-500/10 rounded-xl w-fit mb-4">
                  <Smartphone className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Cross-Platform</h3>
                <p className="text-slate-400 text-sm">Access anywhere, any device with responsive design.</p>
              </div>
            </div>
          </div>

          {/* Right Panel - Login Card */}
          <div className="lg:col-span-1">
            <div className="relative">
              {/* Glowing effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl blur-lg opacity-20"></div>
              
              <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-800/50 p-8 shadow-2xl">
                {/* User Type Tabs */}
                <div className="grid grid-cols-4 gap-2 mb-8 p-1 bg-slate-800/30 rounded-xl">
                  {["admin", "superadmin", "faculty", "student"].map((type) => {
                    const typeConfig = getUserTypeConfig(type);
                    const Icon = typeConfig.icon;
                    const isActive = userType === type;
                    
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => handleUserTypeChange(type)}
                        className={`relative py-3 px-2 rounded-lg transition-all duration-300 ${
                          isActive 
                            ? `bg-gradient-to-b ${typeConfig.gradient} text-white shadow-lg`
                            : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                        }`}
                      >
                        <div className="flex flex-col items-center gap-1">
                          <Icon className="w-5 h-5" />
                          <span className="text-xs font-medium capitalize">{type}</span>
                        </div>
                        {isActive && (
                          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"></div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Current User Type Info */}
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-lg bg-gradient-to-br ${config.gradient}`}>
                      <config.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{config.title}</h3>
                      <p className="text-sm text-slate-400">{config.desc}</p>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                {error && (
                  <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl animate-fadeIn">
                    <div className="flex items-center gap-3">
                      <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                      <p className="text-red-400 text-sm">{error}</p>
                    </div>
                  </div>
                )}

                {success && (
                  <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-xl animate-fadeIn">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <p className="text-green-400 text-sm">{success}</p>
                    </div>
                  </div>
                )}

                {/* Login Form */}
                <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
                  {/* Institution ID (for Faculty & Student) */}
                  {(userType === "faculty" || userType === "student") && (
                    <InputField
                      label="Institution ID"
                      value={institutionId}
                      onChange={setInstitutionId}
                      placeholder="INST-6B139E59"
                      icon={Building}
                      fieldKey="institutionId"
                      autoCapitalize={true}
                    />
                  )}

                  {/* Faculty ID (Only for Faculty) */}
                  {userType === "faculty" && (
                    <InputField
                      label="Faculty ID"
                      value={facultyId}
                      onChange={setFacultyId}
                      placeholder="FACA0E95"
                      icon={Key}
                      fieldKey="facultyId"
                      autoCapitalize={true}
                    />
                  )}

                  {/* Main Identifier Field */}
                  {userType === "admin" && (
                    <InputField
                      label="Email Address"
                      value={email}
                      onChange={setEmail}
                      type="email"
                      placeholder="admin@institution.edu"
                      icon={Mail}
                      fieldKey="email"
                    />
                  )}

                  {userType === "superadmin" && (
                    <InputField
                      label="Username"
                      value={username}
                      onChange={setUsername}
                      placeholder="superadmin"
                      icon={Shield}
                      fieldKey="username"
                    />
                  )}

                  {userType === "student" && (
                    <InputField
                      label="Registration Number"
                      value={registrationNo}
                      onChange={setRegistrationNo}
                      placeholder="REG12345678"
                      icon={User}
                      fieldKey="registrationNo"
                    />
                  )}

                  {/* Password Field */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300 flex items-center justify-between">
                      <span>Password</span>
                      <button
                        type="button"
                        onClick={() => {
                          const message = userType === "admin" || userType === "superadmin" 
                            ? "Contact system administrator for password reset"
                            : "Contact your institutional IT department";
                          alert(message);
                        }}
                        className="text-xs text-blue-400 hover:text-blue-300 hover:underline"
                      >
                        Forgot Password?
                      </button>
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl blur-sm group-focus-within:blur-md transition-all duration-300 opacity-0 group-focus-within:opacity-100"></div>
                      <div className="relative flex items-center">
                        <Lock className="absolute left-4 text-slate-400 group-focus-within:text-blue-400 transition-colors z-10" size={20} />
                        <input
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          onFocus={() => setActiveField("password")}
                          onBlur={() => setActiveField("")}
                          className="w-full pl-12 pr-12 py-4 bg-slate-900/60 backdrop-blur-sm border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all duration-300 relative z-10"
                          placeholder="Enter your password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 text-slate-400 hover:text-white transition-colors z-10"
                        >
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </div>
                    {(userType === "faculty" || userType === "student") && (
                      <p className="text-xs text-slate-500">
                        Initial password sent to your institutional email
                      </p>
                    )}
                  </div>

                  {/* Remember Me */}
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative">
                        <input 
                          type="checkbox" 
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="sr-only"
                        />
                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${
                          rememberMe 
                            ? `bg-gradient-to-br ${config.gradient} border-transparent`
                            : "bg-slate-800/60 border-slate-600 group-hover:border-slate-500"
                        }`}>
                          {rememberMe && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                        </div>
                      </div>
                      <span className="text-sm text-slate-300 select-none">Remember this device</span>
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full relative overflow-hidden py-4 rounded-xl font-semibold transition-all duration-500 ${
                      loading 
                        ? "opacity-80 cursor-not-allowed" 
                        : "hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98]"
                    } bg-gradient-to-r ${config.gradient} text-white`}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-3">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Authenticating...</span>
                      </div>
                    ) : (
                      <>
                        <div className="relative z-10 flex items-center justify-center gap-3">
                          <LogIn className="w-5 h-5" />
                          <span>Sign In as {config.title}</span>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                      </>
                    )}
                  </button>
                </form>

                {/* Additional Info */}
                <div className="mt-8 pt-6 border-t border-slate-800">
                  <div className="flex items-center justify-center gap-2 text-slate-500 text-sm">
                    <Fingerprint className="w-4 h-4" />
                    <span>Secure SSL Connection • Encrypted Session</span>
                  </div>
                  <p className="text-center text-xs text-slate-600 mt-3">
                    By signing in, you agree to our Terms of Service and Privacy Policy
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="fixed bottom-6 left-0 right-0 text-center z-10">
        <p className="text-sm text-slate-600">
          © {new Date().getFullYear()} Attenza Systems. All Rights Reserved. v2.1.0
        </p>
      </div>

      {/* Add custom animations */}
      <style jsx>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}