import React, { useState, useEffect } from "react";
import {Menu,X,Star,Shield,Zap,Clock,Users,BarChart3,Brain,Sparkles,CheckCircle,ArrowRight,Play,Globe,BookOpen,Calendar,Moon,Sun} from "lucide-react";
import student from "../images/student.png";
import faculty from "../images/faculty.png";
import admin from "../images/admin.png";

export default function LandingPage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [darkMode, setDarkMode] = useState(true);
  const [scrolled, setScrolled] = useState(false);

  const slides = [
    {
      img: student,
      title: "For Students",
      desc: "Track attendance, manage tasks & get personalized insights"
    },
    {
      img: faculty,
      title: "For Faculty",
      desc: "Live attendance tracking & comprehensive class management"
    },
    {
      img: admin,
      title: "For Institutions",
      desc: "Complete institutional analytics & resource optimization"
    }
  ];

  // Auto carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('light');
  };

  return (
    <div className={`${darkMode ? 'dark' : ''}`}>
      <div className={`min-h-screen scroll-smooth transition-colors duration-300 ${
        darkMode 
          ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white' 
          : 'bg-gradient-to-br from-slate-50 via-white to-slate-50 text-slate-900'
      }`}>
        
        {/* ================= NAVBAR ================= */}
        <nav className={`fixed w-full z-50 transition-all duration-500 ${
          scrolled
            ? darkMode
              ? "bg-slate-900/95 backdrop-blur-xl shadow-2xl shadow-black/50 py-3"
              : "bg-white/95 backdrop-blur-xl shadow-lg py-3"
            : "bg-transparent py-5"
        }`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center">
              
              {/* Logo */}
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className={`absolute inset-0 bg-blue-500 blur-lg opacity-50 ${
                    darkMode ? 'block' : 'hidden'
                  }`}></div>
                  <div className={`relative w-10 h-10 rounded-xl flex items-center justify-center ${
                    darkMode 
                      ? 'bg-gradient-to-br from-blue-500 to-purple-600' 
                      : 'bg-gradient-to-br from-blue-600 to-purple-600'
                  }`}>
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div>
                  <span className={`text-xl font-bold ${
                    darkMode 
                      ? 'bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent'
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'
                  }`}>
                    ATLAS
                  </span>
                </div>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center gap-8">
                <div className="flex gap-8">
                  {['Features', 'Solutions', 'Pricing'].map((item) => (
                    <a
                      key={item}
                      href={`#${item.toLowerCase()}`}
                      className={`text-sm font-medium transition-colors relative group ${
                        darkMode ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {item}
                      <span className={`absolute -bottom-1 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300 ${
                        darkMode ? 'bg-blue-400' : 'bg-blue-600'
                      }`}></span>
                    </a>
                  ))}
                </div>

                <div className="flex items-center gap-4">
                  <button
                    onClick={toggleTheme}
                    className={`p-2 rounded-xl transition-colors ${
                      darkMode 
                        ? 'hover:bg-slate-800 text-slate-300' 
                        : 'hover:bg-slate-100 text-slate-600'
                    }`}
                  >
                    {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                  </button>

                  <a
                    href="login"
                    className={`px-4 py-2 text-sm font-medium rounded-xl transition-colors ${
                      darkMode
                        ? 'text-slate-300 hover:text-white hover:bg-slate-800'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    Log in
                  </a>

                  <a
                    href="signup"
                    className={`px-4 py-2 text-sm font-medium rounded-xl transition-all duration-300 hover:-translate-y-0.5 ${
                      darkMode
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg hover:shadow-blue-600/30'
                        : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg hover:shadow-blue-600/30'
                    }`}
                  >
                    Get Started Free
                  </a>
                </div>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className={`md:hidden p-2 rounded-xl transition-colors ${
                  darkMode 
                    ? 'hover:bg-slate-800 text-white' 
                    : 'hover:bg-slate-100 text-slate-900'
                }`}
              >
                {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileOpen && (
            <div className={`md:hidden border-t mt-3 ${
              darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <div className="px-4 py-4 space-y-4">
                {['features', 'Solutions', 'Pricing'].map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    className={`block py-2 text-sm font-medium ${
                      darkMode ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {item}
                  </a>
                ))}
                <div className="pt-4 flex gap-3">
                  <a
                    href="login"
                    className={`flex-1 px-4 py-2 text-center text-sm font-medium rounded-xl border ${
                      darkMode 
                        ? 'border-slate-700 text-slate-300 hover:bg-slate-800' 
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Log in
                  </a>
                  <a
                    href="signup"
                    className="flex-1 px-4 py-2 text-center text-sm font-medium rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                  >
                    Sign up
                  </a>
                </div>
              </div>
            </div>
          )}
        </nav>

        {/* ================= HERO SECTION ================= */}
        <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0">
            <div className={`absolute inset-0 blur-3xl animate-pulse ${
              darkMode 
                ? 'bg-gradient-to-br from-blue-600/20 via-purple-600/10 to-transparent'
                : 'bg-gradient-to-br from-blue-400/10 via-purple-400/10 to-transparent'
            }`}></div>
            <div className={`absolute top-20 left-10 w-72 h-72 rounded-full blur-3xl animate-float ${
              darkMode ? 'bg-blue-500/30' : 'bg-blue-400/20'
            }`}></div>
            <div className={`absolute bottom-20 right-10 w-96 h-96 rounded-full blur-3xl animate-float-delayed ${
              darkMode ? 'bg-purple-500/30' : 'bg-purple-400/20'
            }`}></div>
          </div>

          <div className="relative max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              
              {/* Left Content */}
              <div className="text-center lg:text-left">
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm mb-8 ${
                  darkMode 
                    ? 'bg-blue-500/10 border border-blue-500/20 text-blue-400'
                    : 'bg-blue-100 border border-blue-200 text-blue-700'
                }`}>
                  <Sparkles className="w-4 h-4" />
                  <span>AI-Powered Education Platform</span>
                </div>

                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight">
                  Automated Tracking &
                  <span className={`block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent`}>
                  Learning Assistant System
                  </span>
                </h1>

                <p className={`mt-6 text-lg md:text-xl max-w-2xl mx-auto lg:mx-0 ${
                  darkMode ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  Automate attendance with intelligent systems, gain real-time insights, and transform educational workflows for the future of learning.
                </p>

                <div className="mt-10 flex flex-col sm:flex-row items-center lg:items-start gap-4 justify-center lg:justify-start">
                  <a
                    href="signup"
                    className="group px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium shadow-lg shadow-blue-600/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex items-center gap-2"
                  >
                    Start Free Trial
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </a>

                  <a
                    href="#demo"
                    className={`group px-8 py-4 rounded-xl border font-medium transition-all duration-300 hover:-translate-y-1 flex items-center gap-2 ${
                      darkMode
                        ? 'border-slate-700 text-slate-300 hover:bg-slate-800'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Play className="w-4 h-4" />
                    Watch Demo
                  </a>
                </div>

                {/* Trust Indicators */}
                <div className="mt-12 flex flex-wrap items-center gap-8 justify-center lg:justify-start">
                  <div className="flex -space-x-2">
                    {[1,2,3,4].map((i) => (
                      <div
                        key={i}
                        className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-medium ${
                          darkMode
                            ? 'bg-slate-800 border-slate-700 text-white'
                            : 'bg-white border-slate-200 text-slate-900'
                        }`}
                      >
                        {String.fromCharCode(64 + i)}
                      </div>
                    ))}
                  </div>
                  <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    <span className={`font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>1000+</span> institutions trust us
                  </p>
                  <div className={`flex items-center gap-1 text-sm ${
                    darkMode ? 'text-yellow-400' : 'text-yellow-600'
                  }`}>
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <span className={`ml-2 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>4.9 (2.5k reviews)</span>
                  </div>
                </div>
              </div>

              {/* Right Content - Dashboard Preview */}
              <div className="relative lg:block">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl blur-2xl opacity-30"></div>
                  <div className={`relative rounded-3xl overflow-hidden shadow-2xl ${
                    darkMode ? 'bg-slate-800' : 'bg-white'
                  }`}>
                    <div className={`flex items-center gap-2 px-4 py-3 border-b ${
                      darkMode ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'
                    }`}>
                      <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      </div>
                      <span className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        preview
                      </span>
                    </div>
                    <img
                      src={slides[currentSlide].img}
                      alt="dashboard"
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Slide Indicators */}
                <div className="mt-6 flex justify-center gap-2">
                  {slides.map((slide, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentSlide(i)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        i === currentSlide
                          ? 'w-8 bg-blue-500'
                          : `w-2 ${darkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-300 hover:bg-slate-400'}`
                      }`}
                    />
                  ))}
                </div>

                {/* Slide Caption */}
                <div className="mt-4 text-center">
                  <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                    {slides[currentSlide].title}
                  </h3>
                  <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    {slides[currentSlide].desc}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= FEATURES SECTION ================= */}
        <section id="features" className={`py-24 px-4 sm:px-6 lg:px-8 ${
          darkMode ? 'bg-slate-900/50' : 'bg-slate-50'
        }`}>
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto">
              <span className={`text-sm font-semibold tracking-wider uppercase ${
                darkMode ? 'text-blue-400' : 'text-blue-600'
              }`}>Features</span>
              <h2 className={`mt-4 text-3xl md:text-4xl font-bold ${
                darkMode ? 'text-white' : 'text-slate-900'
              }`}>
                Everything You Need for Modern Education
              </h2>
              <p className={`mt-4 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                Powerful tools to streamline attendance, enhance learning, and drive institutional success
              </p>
            </div>

            <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: Zap,
                  title: "Lightning Fast QR",
                  desc: "Generate and scan QR codes in milliseconds with our optimized engine",
                  color: "from-yellow-500 to-orange-500"
                },
                {
                  icon: Brain,
                  title: "AI Predictions",
                  desc: "Predict attendance patterns and identify at-risk students early",
                  color: "from-purple-500 to-pink-500"
                },
                {
                  icon: BarChart3,
                  title: "Advanced Analytics",
                  desc: "Comprehensive dashboards with real-time insights and trends",
                  color: "from-blue-500 to-cyan-500"
                },
                {
                  icon: Users,
                  title: "Multi-role Access",
                  desc: "Customized experiences for students, faculty, and administrators",
                  color: "from-green-500 to-emerald-500"
                },
                {
                  icon: Calendar,
                  title: "Smart Scheduling",
                  desc: "Automated timetable generation and conflict resolution",
                  color: "from-red-500 to-pink-500"
                },
                {
                  icon: Shield,
                  title: "Enterprise Security",
                  desc: "Bank-level encryption and compliance with global standards",
                  color: "from-indigo-500 to-purple-500"
                }
              ].map((feature, i) => (
                <div
                  key={i}
                  className={`group relative p-8 rounded-2xl border transition-all duration-500 hover:-translate-y-2 ${
                    darkMode
                      ? 'bg-slate-800/30 backdrop-blur-xl border-slate-700 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/10'
                      : 'bg-white border-slate-200 hover:border-blue-500 hover:shadow-xl'
                  }`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-500`}></div>
                  <div className={`relative w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} p-3 mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-full h-full text-white" />
                  </div>
                  <h3 className={`text-xl font-semibold mb-3 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                    {feature.title}
                  </h3>
                  <p className={`text-sm leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= HOW IT WORKS ================= */}
        <section id="solutions" className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className={`absolute inset-0 blur-3xl ${
            darkMode 
              ? 'bg-gradient-to-br from-blue-600/10 via-purple-600/5 to-transparent'
              : 'bg-gradient-to-br from-blue-400/5 via-purple-400/5 to-transparent'
          }`}></div>
          
          <div className="relative max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto">
              <span className={`text-sm font-semibold tracking-wider uppercase ${
                darkMode ? 'text-blue-400' : 'text-blue-600'
              }`}>Process</span>
              <h2 className={`mt-4 text-3xl md:text-4xl font-bold ${
                darkMode ? 'text-white' : 'text-slate-900'
              }`}>
                How It Works
              </h2>
              <p className={`mt-4 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                Simple, secure, and intelligent workflow for modern institutions
              </p>
            </div>

            <div className="mt-20 grid md:grid-cols-3 gap-8">
              {[
                {
                  step: "01",
                  title: "QR Generation",
                  desc: "Faculty generates dynamic, time-limited QR codes that automatically refresh",
                  icon: Zap,
                  color: "from-blue-500 to-cyan-500"
                },
                {
                  step: "02",
                  title: "Secure Capture",
                  desc: "Students scan codes with instant verification and anti-proxy protection",
                  icon: CheckCircle,
                  color: "from-purple-500 to-pink-500"
                },
                {
                  step: "03",
                  title: "Smart Insights",
                  desc: "AI analyzes patterns and provides personalized recommendations",
                  icon: Brain,
                  color: "from-green-500 to-emerald-500"
                }
              ].map((item, i) => (
                <div key={i} className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur"></div>
                  <div className={`relative p-8 rounded-3xl border ${
                    darkMode
                      ? 'bg-slate-900 border-slate-800'
                      : 'bg-white border-slate-200'
                  }`}>
                    <div className="flex items-center justify-between mb-6">
                      <span className={`text-5xl font-black ${
                        darkMode ? 'text-slate-800' : 'text-slate-200'
                      }`}>{item.step}</span>
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${item.color} p-3`}>
                        <item.icon className="w-full h-full text-white" />
                      </div>
                    </div>
                    <h3 className={`text-xl font-semibold mb-3 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                      {item.title}
                    </h3>
                    <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= STATS SECTION ================= */}
        <section className={`py-16 px-4 sm:px-6 lg:px-8 ${
          darkMode ? 'bg-slate-900/50' : 'bg-slate-50'
        }`}>
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { label: "Active Institutions", value: "500+", icon: Users },
                { label: "Students Enrolled", value: "50K+", icon: BookOpen },
                { label: "Attendance Records", value: "2M+", icon: BarChart3 },
                { label: "Hours Saved", value: "10K+", icon: Clock }
              ].map((stat, i) => (
                <div key={i} className="text-center group">
                  <div className={`inline-flex p-4 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300 ${
                    darkMode ? 'bg-slate-800/50' : 'bg-white shadow-sm'
                  }`}>
                    <stat.icon className={`w-6 h-6 ${
                      darkMode ? 'text-blue-400' : 'text-blue-600'
                    }`} />
                  </div>
                  <div className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                    {stat.value}
                  </div>
                  <div className={`text-sm mt-2 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= TESTIMONIALS ================= */}
        <section className="py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto">
              <span className={`text-sm font-semibold tracking-wider uppercase ${
                darkMode ? 'text-blue-400' : 'text-blue-600'
              }`}>Testimonials</span>
              <h2 className={`mt-4 text-3xl md:text-4xl font-bold ${
                darkMode ? 'text-white' : 'text-slate-900'
              }`}>
                Trusted by Educators Worldwide
              </h2>
            </div>

            <div className="mt-16 grid md:grid-cols-3 gap-8">
              {[
                {
                  name: "Dr. Sarah Johnson",
                  role: "Dean, Stanford University",
                  content: "ATLAS has transformed how we manage attendance. The AI insights are invaluable for student success.",
                  rating: 5
                },
                {
                  name: "Prof. Michael Chen",
                  role: "Head of CS, MIT",
                  content: "The QR system is incredibly fast and reliable. Saved us countless hours of manual work.",
                  rating: 5
                },
                {
                  name: "Dr. Emily Rodriguez",
                  role: "Principal, Harvard",
                  content: "Implementation was seamless. The support team is exceptional and the analytics are comprehensive.",
                  rating: 5
                }
              ].map((testimonial, i) => (
                <div
                  key={i}
                  className={`p-8 rounded-2xl border ${
                    darkMode
                      ? 'bg-slate-800/30 border-slate-700'
                      : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="flex gap-1 mb-4 text-yellow-400">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-current" />
                    ))}
                  </div>
                  <p className={`text-lg mb-6 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    "{testimonial.content}"
                  </p>
                  <div>
                    <p className={`font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                      {testimonial.name}
                    </p>
                    <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= PRICING ================= */}
        <section id="pricing" className={`py-24 px-4 sm:px-6 lg:px-8 ${
          darkMode ? 'bg-slate-900/50' : 'bg-slate-50'
        }`}>
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto">
              <span className={`text-sm font-semibold tracking-wider uppercase ${
                darkMode ? 'text-blue-400' : 'text-blue-600'
              }`}>Pricing</span>
              <h2 className={`mt-4 text-3xl md:text-4xl font-bold ${
                darkMode ? 'text-white' : 'text-slate-900'
              }`}>
                Simple, Transparent Pricing
              </h2>
              <p className={`mt-4 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                Choose the plan that fits your institution's needs
              </p>
            </div>

            <div className="mt-16 grid md:grid-cols-3 gap-8">
              {[
                {
                  name: "Starter",
                  price: "$0",
                  period: "forever",
                  features: ["Up to 100 students", "Basic analytics", "QR attendance", "Email support"],
                  highlighted: false
                },
                {
                  name: "Professional",
                  price: "$299",
                  period: "per month",
                  features: ["Up to 1000 students", "Advanced analytics", "AI insights", "Priority support", "API access"],
                  highlighted: true
                },
                {
                  name: "Enterprise",
                  price: "Custom",
                  period: "contact us",
                  features: ["Unlimited students", "Custom features", "Dedicated support", "SLA guarantee", "On-premise option"],
                  highlighted: false
                }
              ].map((plan, i) => (
                <div
                  key={i}
                  className={`relative rounded-2xl border transition-all duration-300 hover:-translate-y-2 ${
                    plan.highlighted
                      ? darkMode
                        ? 'border-blue-500 bg-slate-800 shadow-xl shadow-blue-500/20'
                        : 'border-blue-500 bg-white shadow-xl shadow-blue-500/10'
                      : darkMode
                        ? 'border-slate-700 bg-slate-800/50'
                        : 'border-slate-200 bg-white'
                  }`}
                >
                  {plan.highlighted && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium rounded-full">
                      Most Popular
                    </div>
                  )}
                  <div className="p-8">
                    <h3 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                      {plan.name}
                    </h3>
                    <div className="mb-4">
                      <span className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                        {plan.price}
                      </span>
                      <span className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                        {" "}{plan.period}
                      </span>
                    </div>
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, j) => (
                        <li key={j} className="flex items-center gap-2 text-sm">
                          <CheckCircle className={`w-4 h-4 ${
                            darkMode ? 'text-blue-400' : 'text-blue-600'
                          }`} />
                          <span className={darkMode ? 'text-slate-300' : 'text-slate-700'}>
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <a
                      href="signup"
                      className={`block text-center px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                        plan.highlighted
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg hover:shadow-blue-600/30'
                          : darkMode
                            ? 'border border-slate-700 text-slate-300 hover:bg-slate-700'
                            : 'border border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      Get Started
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= CTA SECTION ================= */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 blur-3xl"></div>
          
          <div className="relative max-w-4xl mx-auto text-center">
            <h2 className={`text-3xl sm:text-4xl md:text-5xl font-bold ${
              darkMode ? 'text-white' : 'text-slate-900'
            }`}>
              Ready to Transform Your Institution?
            </h2>
            
            <p className={`mt-6 text-lg max-w-2xl mx-auto ${
              darkMode ? 'text-slate-400' : 'text-slate-600'
            }`}>
              Join 1000+ institutions already using ATLAS to automate attendance, gain insights, and improve student success rates.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
              <a
                href="signup"
                className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium shadow-lg shadow-blue-600/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex items-center justify-center gap-2"
              >
                Start Free Trial
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        </section>

        {/* ================= FOOTER ================= */}
        <footer className={`border-t pt-20 pb-10 px-4 sm:px-6 lg:px-8 ${
          darkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-12">
              
              {/* Brand */}
              <div className="lg:col-span-2">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <span className={`text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent`}>
                    ATLAS
                  </span>
                </div>
                <p className={`text-sm leading-relaxed max-w-md ${
                  darkMode ? 'text-slate-400' : 'text-slate-600'
                }`}>
                Automated Tracking & Learning Assistant System built for modern educational ecosystems.
                </p>
                     
              <div className="mt-6 flex">
                <a
                  href="https://bijaymsra.github.io/bijaymsraa/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    darkMode
                      ? 'bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Globe className="w-5 h-5" />
                  <span>Contact Me</span>
                </a>
              </div>
                      
              </div>

              {/* Links */}
              {[
                {
                  title: "features",
                  links: ['Features', 'Solutions', 'Pricing', 'Demo']
                },
                {
                  title: "Company",
                  links: ['About', 'Blog', 'Careers', 'Press']
                }
              ].map((column) => (
                <div key={column.title}>
                  <h4 className={`font-semibold mb-4 ${
                    darkMode ? 'text-white' : 'text-slate-900'
                  }`}>{column.title}</h4>
                  <ul className="space-y-3">
                    {column.links.map((link) => (
                      <li key={link}>
                        <a
                          href="#"
                          className={`text-sm transition-colors ${
                            darkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Bottom Bar */}
            <div className={`mt-16 pt-8 border-t flex flex-col md:flex-row md:items-center md:justify-between gap-4 ${
              darkMode ? 'border-slate-800' : 'border-slate-200'
            }`}>
              <p className={`text-sm ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                © {new Date().getFullYear()} ATLAS. All rights reserved.
              </p>
              <div className="flex gap-6 text-sm">
                <a href="#" className={darkMode ? 'text-slate-500 hover:text-white' : 'text-slate-400 hover:text-slate-900'}>
                  Privacy
                </a>
                <a href="#" className={darkMode ? 'text-slate-500 hover:text-white' : 'text-slate-400 hover:text-slate-900'}>
                  Terms
                </a>
                <a href="#" className={darkMode ? 'text-slate-500 hover:text-white' : 'text-slate-400 hover:text-slate-900'}>
                  Cookies
                </a>
              </div>
              <p className={`text-sm ${darkMode ? 'text-slate-600' : 'text-slate-400'}`}>
                Developed by by Bijay Kumar Mishra
              </p>
            </div>
          </div>
        </footer>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-30px); }
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 10s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}