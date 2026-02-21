import React, { useState, useEffect, useRef } from "react";
import student from "../images/student.png";
import faculty from "../images/faculty.png";
import admin from "../images/admin.png";

export default function Dashboard() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const statsRef = useRef(null);
  const [statsVisible, setStatsVisible] = useState(false);
  const [scrolled, setScrolled] = useState(false);

useEffect(() => {
  const handleScroll = () => {
    setScrolled(window.scrollY > 50);
  };
  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, []);

  const slides = [
    {
      img: student,
      title: "Student Dashboard",
      desc: "Track attendance, manage tasks & schedules"
    },
    {
      img: faculty,
      title: "Faculty Dashboard",
      desc: "Live attendance tracking & management"
    },
    {
      img: admin,
      title: "Admin Dashboard",
      desc: "Institutional insights & analytics"
    }
  ];

  // Auto carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Stats animation trigger
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setStatsVisible(true);
      },
      { threshold: 0.5 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="bg-slate-950 text-white scroll-smooth">

      {/* ================= NAVBAR ================= */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-slate-900/90 backdrop-blur-xl shadow-lg shadow-black/20"
          : "bg-transparent"
      }`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

          <div className="flex items-center gap-3">
            <span className="text-xl font-bold tracking-wide text-blue-400">
              Attenza
            </span>
          </div>

          {/* Desktop Menu */}
          <ul className="hidden md:flex gap-8 text-sm font-medium text-slate-300">
            <li><a href="#home" className="hover:text-white">Home</a></li>
            <li><a href="#features" className="hover:text-white">Features</a></li>
            <li><a href="#how" className="hover:text-white">How It Works</a></li>
            <li><a href="#screenshots" className="hover:text-white">Screenshots</a></li>
            <li><a href="about" className="hover:text-white">About</a></li>
            <li><a href="docs" className="hover:text-white">Docs</a></li>
          </ul>

          <div className="hidden md:flex gap-4">
            <a href="login" className="px-4 py-2 border border-slate-700 rounded-lg hover:bg-slate-800 transition">
              Login
            </a>
            <a href="signup" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition">
              Get Started
            </a>
          </div>

          {/* Mobile Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-white"
          >
            ☰
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden bg-slate-900 px-6 pb-4 space-y-3 text-slate-300">
            <a href="#home" className="block">Home</a>
            <a href="#features" className="block">Features</a>
            <a href="#how" className="block">How It Works</a>
            <a href="#screenshots" className="block">Screenshots</a>
            <a href="about" className="block">About</a>
            <a href="docs" className="block">Docs</a>
          </div>
        )}
      </nav>

      {/* ================= HERO ================= */}
      <section
        id="home"
        className="relative min-h-screen flex items-center justify-center px-6 sm:px-8 lg:px-16 overflow-hidden"
      >

        {/* Background Glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/10 to-transparent blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left Content */}
          <div className="text-center lg:text-left">

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight">
              Smart Curriculum & Personalized Management System
            </h1>

            <p className="mt-6 text-slate-400 text-base sm:text-lg md:text-xl max-w-xl mx-auto lg:mx-0">
              Automate attendance with intelligent systems built for the future of education.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center lg:items-start gap-4 justify-center lg:justify-start">
              <a
                href="#how"
                className="px-6 py-3 rounded-lg border border-slate-700 hover:bg-slate-800 transition-all duration-300 text-sm sm:text-base"
              >
                Learn More
              </a>

              <a
                href="signup"
                className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition-all duration-300 text-sm sm:text-base shadow-lg shadow-blue-600/30"
              >
                Request Demo
              </a>
            </div>

          </div>

        </div>
      </section>


      <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>

      {/* ================= FEATURES ================= */}
      <section id="features" className="py-24 px-6 bg-slate-900">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold">Powerful Features</h2>
          <p className="mt-4 text-slate-400">Everything you need for modern education</p>

          <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Multi-Modal Attendance",
                desc: "QR-based secure and dynamic attendance system."
              },
              {
                title: "Personalized Planner",
                desc: "Intelligent academic and productivity recommendations."
              },
              {
                title: "Real-Time Insights",
                desc: "Live analytics and intelligent reporting."
              },
              {
                title: "Full Automation",
                desc: "Remove manual errors and save institutional time."
              },
              {
                title: "Advanced Analytics",
                desc: "Track trends and performance metrics easily."
              },
              {
                title: "Seamless Integration",
                desc: "Integrates with LMS, ERP and SIS systems."
              }
            ].map((f, i) => (
              <div
                key={i}
                className="p-8 bg-slate-800/60 backdrop-blur-xl rounded-2xl border border-slate-700 hover:border-blue-500 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-blue-500/10"
              >
                <h3 className="text-lg font-semibold">{f.title}</h3>
                <p className="mt-4 text-slate-400 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>

      {/* ================= HOW ================= */}
      <section id="how" className="py-28 px-6 relative overflow-hidden">

        {/* Background Glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/5 to-transparent blur-3xl"></div>

        <div className="relative max-w-6xl mx-auto text-center">

          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            How It Works
          </h2>

          <p className="mt-4 text-slate-400 max-w-2xl mx-auto">
            A secure, intelligent and fully automated attendance workflow
            designed for modern institutions.
          </p>

          {/* Steps Grid */}
          <div className="mt-20 grid md:grid-cols-3 gap-10">

            {/* Step 1 */}
            <div className="relative p-8 bg-slate-900/70 backdrop-blur-xl rounded-3xl border border-slate-800 hover:border-blue-500 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-blue-500/10">

              <div className="absolute -top-5 left-6 h-10 w-10 flex items-center justify-center rounded-full bg-blue-600 text-white font-bold shadow-lg shadow-blue-600/30">
                1
              </div>

              <h3 className="text-xl font-semibold mt-4">
                📱 QR Code Generation
              </h3>

              <p className="mt-4 text-slate-400 text-sm leading-relaxed">
                Faculty generates dynamic, time-limited QR codes for each session.
                Codes automatically refresh to prevent proxy attendance.
              </p>

            </div>

            {/* Step 2 */}
            <div className="relative p-8 bg-slate-900/70 backdrop-blur-xl rounded-3xl border border-slate-800 hover:border-blue-500 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-blue-500/10">

              <div className="absolute -top-5 left-6 h-10 w-10 flex items-center justify-center rounded-full bg-blue-600 text-white font-bold shadow-lg shadow-blue-600/30">
                2
              </div>

              <h3 className="text-xl font-semibold mt-4">
                🎯 Secure Attendance Capture
              </h3>

              <p className="mt-4 text-slate-400 text-sm leading-relaxed">
                Students scan the QR code through the app.
                Attendance is verified instantly using session and time validation.
              </p>

            </div>

            {/* Step 3 */}
            <div className="relative p-8 bg-slate-900/70 backdrop-blur-xl rounded-3xl border border-slate-800 hover:border-blue-500 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-blue-500/10">

              <div className="absolute -top-5 left-6 h-10 w-10 flex items-center justify-center rounded-full bg-blue-600 text-white font-bold shadow-lg shadow-blue-600/30">
                3
              </div>

              <h3 className="text-xl font-semibold mt-4">
                🧠 Personalized Insights
              </h3>

              <p className="mt-4 text-slate-400 text-sm leading-relaxed">
                Intelligent-powered recommendations analyze attendance patterns,
                productivity gaps and academic trends for smarter learning.
              </p>

            </div>

          </div>

        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>

      {/* ================= SCREENSHOTS ================= */}
      <section id="screenshots" className="py-24 px-6 bg-slate-900">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold">See It In Action</h2>

          <div className="relative mt-12 overflow-hidden rounded-2xl">
            <img
              src={slides[currentSlide].img}
              alt="dashboard"
              className="w-full rounded-2xl"
            />
            <div className="mt-4">
              <h4 className="font-semibold">{slides[currentSlide].title}</h4>
              <p className="text-slate-400 text-sm">{slides[currentSlide].desc}</p>
            </div>
          </div>

          <div className="flex justify-center gap-4 mt-6">
            {slides.map((_,i)=>(
              <button
                key={i}
                onClick={()=>setCurrentSlide(i)}
                className={`h-3 w-3 rounded-full ${i===currentSlide?"bg-blue-500":"bg-slate-600"}`}
              />
            ))}
          </div>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>

      {/* ================= CTA ================= */}
      <section className="relative py-32 px-6 overflow-hidden">

        {/* Background Glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/10 to-transparent blur-3xl"></div>

        <div className="relative max-w-5xl mx-auto text-center">

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
            Ready to Transform Your Institution?
          </h2>

          <p className="mt-6 text-slate-400 text-base sm:text-lg max-w-2xl mx-auto">
            Join forward-thinking institutions leveraging intelligent automation,
            real-time analytics and personalized academic insights.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-6">

            <a
              href="signup"
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-xl text-sm sm:text-base font-medium shadow-lg shadow-blue-600/30 transition-all duration-300 hover:-translate-y-1"
            >
              Request Demo
            </a>

            <a
              href="about"
              className="px-8 py-4 border border-slate-700 rounded-xl text-sm sm:text-base font-medium hover:bg-slate-800 transition-all duration-300 hover:-translate-y-1"
            >
              Contact Sales
            </a>

          </div>

        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-slate-950 border-t border-slate-800 pt-20 pb-10 px-6 text-slate-400 text-sm">

        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12">

          {/* Brand Column */}
          <div>
            <h3 className="text-white font-bold text-xl tracking-wide">
              Attenza
            </h3>

            <p className="mt-5 text-slate-400 leading-relaxed text-sm">
              Intelligent curriculum and attendance management platform
              built for modern educational ecosystems.
            </p>

            <div className="mt-6 flex gap-4 text-slate-500">
              <a href="#" className="hover:text-white transition">Twitter</a>
              <a href="#" className="hover:text-white transition">LinkedIn</a>
              <a href="#" className="hover:text-white transition">GitHub</a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-white font-semibold mb-5 tracking-wide">
              Product
            </h4>
            <ul className="space-y-3">
              <li><a href="#features" className="hover:text-white transition">Features</a></li>
              <li><a href="#how" className="hover:text-white transition">How It Works</a></li>
              <li><a href="docs" className="hover:text-white transition">Documentation</a></li>
              <li><a href="pricing" className="hover:text-white transition">Pricing</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold mb-5 tracking-wide">
              Company
            </h4>
            <ul className="space-y-3">
              <li><a href="about" className="hover:text-white transition">About</a></li>
              <li><a href="careers" className="hover:text-white transition">Careers</a></li>
              <li><a href="blog" className="hover:text-white transition">Blog</a></li>
              <li><a href="contact" className="hover:text-white transition">Contact</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold mb-5 tracking-wide">
              Legal
            </h4>
            <ul className="space-y-3">
              <li><a href="privacy.html" className="hover:text-white transition">Privacy Policy</a></li>
              <li><a href="terms.html" className="hover:text-white transition">Terms of Service</a></li>
              <li><a href="security.html" className="hover:text-white transition">Security</a></li>
              <li><a href="compliance.html" className="hover:text-white transition">Compliance</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom Line */}
        <div className="mt-16 border-t border-slate-800 pt-8 text-center text-slate-500 text-xs sm:text-sm">
          © {new Date().getFullYear()} Attenza. All rights reserved.
          <div className="mt-2 opacity-70">
            Developed by Bijay Kumar Mishra
          </div>
        </div>

      </footer>

    </div>
  );
}