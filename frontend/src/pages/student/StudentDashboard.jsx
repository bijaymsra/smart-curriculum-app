import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  LogOut, Calendar, BarChart3, BookOpen, User, Clock,
  CheckCircle, Bell, Settings, QrCode, Camera, AlertCircle,
  TrendingUp, Target, Zap, Users, FileText, Award, ChevronRight,
  Smartphone, Shield, Download, Upload, HelpCircle
} from "lucide-react";
import Chart from "chart.js/auto";

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [attendanceSession, setAttendanceSession] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [recommendations, setRecommendations] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [tasks, setTasks] = useState([]);

  // Initialize student data
  useEffect(() => {
    const studentData = {
      id: sessionStorage.getItem("studentId"),
      registrationNo: sessionStorage.getItem("studentRegistrationNo"),
      fullName: sessionStorage.getItem("studentName"),
      status: sessionStorage.getItem("studentStatus"),
      institutionName: sessionStorage.getItem("institutionName"),
      institutionPublicId: sessionStorage.getItem("institutionPublicId"),
      department: "Computer Science",
      year: "3rd Year",
      email: `${sessionStorage.getItem("studentRegistrationNo")?.toLowerCase()}@university.edu` || "student@university.edu"
    };

    if (!studentData.id) {
      navigate("/login");
      return;
    }

    setStudent(studentData);
    loadStudentData();
  }, [navigate]);

  // Load mock data (Replace with API calls)
  const loadStudentData = () => {
    // Mock attendance data
    const mockAttendance = {
      overall: 92,
      today: 75,
      weekly: 90,
      subjectBreakdown: [
        { subject: "Data Structures", attended: 12, total: 14, percentage: 86, status: "good" },
        { subject: "Web Development", attended: 13, total: 14, percentage: 93, status: "excellent" },
        { subject: "Database Management", attended: 9, total: 14, percentage: 65, status: "warning" },
        { subject: "Operating Systems", attended: 11, total: 13, percentage: 85, status: "good" },
      ]
    };

    // Mock recommendations
    const mockRecommendations = [
      {
        id: 1,
        title: "Complete Database Assignment",
        description: "Due in 2 days. Your attendance is low in this subject.",
        priority: "high",
        category: "Assignment",
        suggestedTime: "90 minutes",
        suggestedSlot: "Today, 2:00 PM - 3:30 PM",
        reason: "Attendance in Database Management is below 75%"
      },
      {
        id: 2,
        title: "Review Data Structures - Trees",
        description: "Upcoming test next week. Focus on tree traversal algorithms.",
        priority: "medium",
        category: "Study",
        suggestedTime: "60 minutes",
        suggestedSlot: "Today, 5:00 PM - 6:00 PM",
        reason: "Test scheduled for next Monday"
      },
      {
        id: 3,
        title: "Practice Coding Problems",
        description: "Improve problem-solving skills with LeetCode.",
        priority: "low",
        category: "Skill Development",
        suggestedTime: "45 minutes",
        suggestedSlot: "Tomorrow, 10:00 AM - 10:45 AM",
        reason: "Consistent practice improves retention"
      }
    ];

    // Mock tasks
    const mockTasks = [
      { id: 1, title: "Submit Database Assignment", description: "Complete all questions from Chapter 5", dueDate: "2025-11-08", priority: "high", category: "Assignment", completed: false, overdue: true },
      { id: 2, title: "Prepare for Data Structures Test", description: "Topics: Trees, Graphs, Hashing", dueDate: "2025-11-11", priority: "medium", category: "Study", completed: false, overdue: false },
      { id: 3, title: "Complete React Tutorial", description: "Learn useState, useEffect, and useContext", dueDate: "2025-11-08", priority: "low", category: "Self-Study", completed: false, overdue: false },
      { id: 4, title: "Web Development Lab", description: "Create responsive portfolio with HTML/CSS", dueDate: "2025-11-03", priority: "medium", category: "Lab Work", completed: true, overdue: false },
    ];

    // Mock notifications
    const mockNotifications = [
      { id: 1, title: "Low Attendance Warning", message: "Your attendance in Database Management (65%) is below threshold", type: "urgent", time: "2 hours ago", read: false },
      { id: 2, title: "Assignment Reminder", message: "Database Assignment due in 2 days", type: "reminder", time: "5 hours ago", read: false },
      { id: 3, title: "Attendance Marked", message: "Successfully marked for Data Structures", type: "success", time: "3 hours ago", read: true },
    ];

    setRecommendations(mockRecommendations);
    setTasks(mockTasks);
    setNotifications(mockNotifications);
    setLoading(false);

    // Initialize charts
    setTimeout(initCharts, 100);
  };

  // Initialize charts
  const initCharts = () => {
    // Attendance Trend Chart
    const ctx = document.getElementById('attendanceChart');
    if (ctx) {
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
          datasets: [{
            label: 'Attendance %',
            data: [82, 85, 90, 87, 92, 88],
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            borderWidth: 3,
            tension: 0.4,
            fill: true
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: false }
          },
          scales: {
            y: {
              beginAtZero: false,
              min: 70,
              max: 100,
              grid: { color: 'rgba(255,255,255,0.1)' }
            },
            x: { grid: { color: 'rgba(255,255,255,0.1)' } }
          }
        }
      });
    }

    // Subject Performance Chart
    const subjectCtx = document.getElementById('subjectPerformanceChart');
    if (subjectCtx) {
      new Chart(subjectCtx, {
        type: 'bar',
        data: {
          labels: ['Data Structures', 'Web Dev', 'Database', 'OS', 'Networks'],
          datasets: [{
            label: 'Attendance %',
            data: [86, 93, 65, 85, 78],
            backgroundColor: [
              '#10b981',
              '#3b82f6',
              '#ef4444',
              '#8b5cf6',
              '#f59e0b'
            ],
            borderRadius: 6
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: false }
          },
          scales: {
            y: {
              beginAtZero: true,
              max: 100,
              grid: { color: 'rgba(255,255,255,0.1)' }
            },
            x: { grid: { color: 'rgba(255,255,255,0.1)' } }
          }
        }
      });
    }
  };

  // Handle attendance marking
  const handleMarkAttendance = () => {
    setAttendanceSession({
      active: true,
      remainingTime: 120, // 2 minutes in seconds
      qrCode: "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=attendance-session-" + Date.now()
    });

    // Countdown timer
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setAttendanceSession(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Handle recommendation acceptance
  const handleAcceptRecommendation = (id) => {
    setRecommendations(prev => prev.filter(rec => rec.id !== id));
    // Add to tasks
    const rec = recommendations.find(r => r.id === id);
    if (rec) {
      const newTask = {
        id: tasks.length + 1,
        title: rec.title,
        description: rec.description,
        dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
        priority: rec.priority,
        category: rec.category,
        completed: false,
        overdue: false
      };
      setTasks(prev => [...prev, newTask]);
    }
  };

  // Handle task completion
  const handleTaskComplete = (id) => {
    setTasks(prev => prev.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  // Handle logout
  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-slate-300 text-lg">Loading your personalized dashboard...</p>
          <p className="text-sm text-slate-500 mt-2">Preparing recommendations based on your attendance</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-950 text-white">
      {/* Header */}
      <header className="bg-slate-800/50 backdrop-blur-lg border-b border-slate-700/50 sticky top-0 z-50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <Award size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                  Attenza Portal
                </h1>
                <p className="text-sm text-slate-400">Smart Attendance & Academic Planner</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Notification Bell */}
              <div className="relative">
                <button className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors relative">
                  <Bell size={20} />
                  {notifications.filter(n => !n.read).length > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center">
                      {notifications.filter(n => !n.read).length}
                    </span>
                  )}
                </button>
              </div>
              
              {/* User Profile */}
              <div className="flex items-center gap-3">
                <div className="hidden md:block text-right">
                  <p className="font-medium">{student.fullName}</p>
                  <p className="text-sm text-slate-400">{student.registrationNo} • {student.department}</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="font-semibold">{student.fullName.charAt(0)}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg transition-colors"
                >
                  <LogOut size={18} />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-slate-800/30 backdrop-blur-lg border-r border-slate-700/30 min-h-[calc(100vh-80px)] p-6 hidden lg:block">
          <div className="mb-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
              <User size={32} />
            </div>
            <h2 className="text-xl font-semibold text-center">Welcome back, {student.fullName.split(' ')[0]}!</h2>
            <p className="text-sm text-slate-400 text-center mt-1">{student.institutionName}</p>
            <div className="mt-4 flex items-center justify-center gap-2">
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                student.status === 'ACTIVE' 
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                  : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
              }`}>
                {student.status} • {student.year}
              </div>
            </div>
          </div>

          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === "dashboard"
                  ? "bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 border border-green-500/30"
                  : "text-slate-400 hover:text-white hover:bg-slate-700/30"
              }`}
            >
              <BarChart3 size={20} />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab("attendance")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === "attendance"
                  ? "bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-400 border border-blue-500/30"
                  : "text-slate-400 hover:text-white hover:bg-slate-700/30"
              }`}
            >
              <CheckCircle size={20} />
              <span>Attendance</span>
            </button>

            <button
              onClick={() => setActiveTab("planner")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === "planner"
                  ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-400 border border-purple-500/30"
                  : "text-slate-400 hover:text-white hover:bg-slate-700/30"
              }`}
            >
              <Target size={20} />
              <span>Smart Planner</span>
            </button>

            <button
              onClick={() => setActiveTab("schedule")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === "schedule"
                  ? "bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400 border border-amber-500/30"
                  : "text-slate-400 hover:text-white hover:bg-slate-700/30"
              }`}
            >
              <Calendar size={20} />
              <span>Schedule</span>
            </button>

            <button
              onClick={() => setActiveTab("tasks")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === "tasks"
                  ? "bg-gradient-to-r from-red-500/20 to-rose-500/20 text-red-400 border border-red-500/30"
                  : "text-slate-400 hover:text-white hover:bg-slate-700/30"
              }`}
            >
              <FileText size={20} />
              <span>Tasks</span>
            </button>

            <button
              onClick={() => setActiveTab("profile")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === "profile"
                  ? "bg-gradient-to-r from-slate-500/20 to-slate-600/20 text-slate-300 border border-slate-500/30"
                  : "text-slate-400 hover:text-white hover:bg-slate-700/30"
              }`}
            >
              <User size={20} />
              <span>Profile</span>
            </button>
          </nav>

          {/* Quick Stats */}
          <div className="mt-8 p-4 bg-slate-800/30 rounded-xl border border-slate-700/30">
            <h3 className="text-sm font-medium text-slate-400 mb-2">Quick Stats</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Attendance</span>
                <span className="font-semibold text-green-400">92%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Active Tasks</span>
                <span className="font-semibold text-blue-400">{tasks.filter(t => !t.completed).length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Today's Classes</span>
                <span className="font-semibold text-amber-400">3</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Dashboard Content */}
          {activeTab === "dashboard" && (
            <>
              {/* Welcome Card */}
              <div className="bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-teal-500/10 border border-green-500/20 rounded-2xl p-8 mb-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center">
                      <Zap size={36} className="text-white" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold mb-2">Welcome to Your Smart Dashboard</h2>
                      <p className="text-slate-300 max-w-2xl">
                        Hello <span className="font-semibold text-green-400">{student.fullName}</span>! 
                        Based on your attendance patterns and upcoming deadlines, here's your personalized overview.
                      </p>
                    </div>
                  </div>
                  {attendanceSession?.active && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                      <div className="flex items-center gap-3">
                        <Clock className="text-red-400" size={24} />
                        <div>
                          <p className="font-semibold">Attendance in Progress</p>
                          <p className="text-sm text-slate-300">{Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')} remaining</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-slate-800/30 backdrop-blur-lg rounded-2xl p-6 border border-slate-700/30 hover:border-green-500/30 transition-all group">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-400">Attendance Score</p>
                      <p className="text-3xl font-bold mt-2 group-hover:text-green-400 transition-colors">92%</p>
                    </div>
                    <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center group-hover:bg-green-500/30 transition-colors">
                      <TrendingUp className="text-green-400" size={24} />
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="w-full bg-slate-700/50 rounded-full h-2">
                      <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                    </div>
                    <p className="text-xs text-slate-400 mt-2">Above 75% requirement • +2% from last week</p>
                  </div>
                </div>

                <div className="bg-slate-800/30 backdrop-blur-lg rounded-2xl p-6 border border-slate-700/30 hover:border-blue-500/30 transition-all group">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-400">Pending Tasks</p>
                      <p className="text-3xl font-bold mt-2 group-hover:text-blue-400 transition-colors">
                        {tasks.filter(t => !t.completed).length}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                      <FileText className="text-blue-400" size={24} />
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 mt-4">
                    {tasks.filter(t => t.overdue && !t.completed).length} overdue • 
                    {tasks.filter(t => t.priority === 'high' && !t.completed).length} high priority
                  </p>
                </div>

                <div className="bg-slate-800/30 backdrop-blur-lg rounded-2xl p-6 border border-slate-700/30 hover:border-purple-500/30 transition-all group">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-400">Today's Classes</p>
                      <p className="text-3xl font-bold mt-2 group-hover:text-purple-400 transition-colors">3</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center group-hover:bg-purple-500/30 transition-colors">
                      <Calendar className="text-purple-400" size={24} />
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 mt-4">Next: Database Management • 3:30 PM</p>
                </div>

                <div className="bg-slate-800/30 backdrop-blur-lg rounded-2xl p-6 border border-slate-700/30 hover:border-amber-500/30 transition-all group">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-400">Risk Level</p>
                      <p className="text-3xl font-bold mt-2 group-hover:text-amber-400 transition-colors">Low</p>
                    </div>
                    <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center group-hover:bg-amber-500/30 transition-colors">
                      <Shield className="text-amber-400" size={24} />
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 mt-4">1 subject below threshold • 92% overall safe</p>
                </div>
              </div>

              {/* Quick Actions & Schedule */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Quick Actions */}
                <div className="lg:col-span-2 bg-slate-800/30 backdrop-blur-lg rounded-2xl p-6 border border-slate-700/30">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold">Quick Actions</h3>
                    <span className="text-sm text-slate-400">Most used features</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                      onClick={handleMarkAttendance}
                      className="group bg-gradient-to-r from-green-500/10 to-emerald-500/10 hover:from-green-500/20 hover:to-emerald-500/20 border border-green-500/30 rounded-xl p-4 text-left transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center group-hover:bg-green-500/30">
                          <QrCode className="text-green-400" size={24} />
                        </div>
                        <div>
                          <p className="font-semibold">Mark Attendance</p>
                          <p className="text-sm text-slate-400">Scan QR code with camera</p>
                        </div>
                      </div>
                    </button>

                    <button className="group bg-gradient-to-r from-blue-500/10 to-cyan-500/10 hover:from-blue-500/20 hover:to-cyan-500/20 border border-blue-500/30 rounded-xl p-4 text-left transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center group-hover:bg-blue-500/30">
                          <Camera className="text-blue-400" size={24} />
                        </div>
                        <div>
                          <p className="font-semibold">Face Verification</p>
                          <p className="text-sm text-slate-400">Take live photo for attendance</p>
                        </div>
                      </div>
                    </button>

                    <button className="group bg-gradient-to-r from-purple-500/10 to-pink-500/10 hover:from-purple-500/20 hover:to-pink-500/20 border border-purple-500/30 rounded-xl p-4 text-left transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center group-hover:bg-purple-500/30">
                          <BookOpen className="text-purple-400" size={24} />
                        </div>
                        <div>
                          <p className="font-semibold">Course Materials</p>
                          <p className="text-sm text-slate-400">Access notes & assignments</p>
                        </div>
                      </div>
                    </button>

                    <button className="group bg-gradient-to-r from-amber-500/10 to-orange-500/10 hover:from-amber-500/20 hover:to-orange-500/20 border border-amber-500/30 rounded-xl p-4 text-left transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-amber-500/20 rounded-lg flex items-center justify-center group-hover:bg-amber-500/30">
                          <BarChart3 className="text-amber-400" size={24} />
                        </div>
                        <div>
                          <p className="font-semibold">Performance Report</p>
                          <p className="text-sm text-slate-400">View analytics & insights</p>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Today's Schedule */}
                <div className="bg-slate-800/30 backdrop-blur-lg rounded-2xl p-6 border border-slate-700/30">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold">Today's Schedule</h3>
                    <span className="text-sm text-slate-400">{new Date().toLocaleDateString('en-US', { weekday: 'long' })}</span>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/30">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold">Data Structures</p>
                          <p className="text-sm text-slate-400">10:00 AM - 11:30 AM • Room 302</p>
                        </div>
                        <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
                          Completed
                        </span>
                      </div>
                    </div>

                    <div className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/30">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold">Database Systems</p>
                          <p className="text-sm text-slate-400">1:00 PM - 3:00 PM • Lab 101</p>
                        </div>
                        <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">
                          Upcoming
                        </span>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold">Web Technologies</p>
                          <p className="text-sm text-slate-400">3:30 PM - 5:00 PM • Room 205</p>
                        </div>
                        <span className="px-3 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full">
                          Next
                        </span>
                      </div>
                      <button className="mt-3 w-full py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
                        Join Class
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div className="bg-slate-800/30 backdrop-blur-lg rounded-2xl p-6 border border-slate-700/30 mb-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-semibold">AI-Powered Recommendations</h3>
                    <p className="text-sm text-slate-400">Personalized suggestions based on your attendance patterns</p>
                  </div>
                  <Zap className="text-amber-400" size={24} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {recommendations.slice(0, 3).map(rec => (
                    <div key={rec.id} className={`border rounded-xl p-4 ${
                      rec.priority === 'high' 
                        ? 'border-red-500/30 bg-red-500/5' 
                        : rec.priority === 'medium'
                        ? 'border-amber-500/30 bg-amber-500/5'
                        : 'border-blue-500/30 bg-blue-500/5'
                    }`}>
                      <div className="flex justify-between items-start mb-3">
                        <span className={`px-2 py-1 text-xs rounded ${
                          rec.priority === 'high' 
                            ? 'bg-red-500/20 text-red-400' 
                            : rec.priority === 'medium'
                            ? 'bg-amber-500/20 text-amber-400'
                            : 'bg-blue-500/20 text-blue-400'
                        }`}>
                          {rec.priority.toUpperCase()} PRIORITY
                        </span>
                        <span className="text-xs text-slate-400">{rec.category}</span>
                      </div>
                      <h4 className="font-semibold mb-2">{rec.title}</h4>
                      <p className="text-sm text-slate-400 mb-3">{rec.description}</p>
                      <div className="text-xs text-slate-500 mb-3">
                        <div className="flex items-center gap-1">
                          <Clock size={12} />
                          <span>{rec.suggestedTime} • {rec.suggestedSlot}</span>
                        </div>
                        <div className="mt-1">{rec.reason}</div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAcceptRecommendation(rec.id)}
                          className="flex-1 py-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                        >
                          Accept
                        </button>
                        <button className="px-4 py-2 bg-slate-700/50 rounded-lg text-sm hover:bg-slate-700 transition-colors">
                          Dismiss
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Attendance Tab */}
          {activeTab === "attendance" && (
            <div className="space-y-8">
              <div className="bg-slate-800/30 backdrop-blur-lg rounded-2xl p-6 border border-slate-700/30">
                <h2 className="text-2xl font-bold mb-6">Attendance Management</h2>
                
                {/* Attendance Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                  <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl p-4">
                    <div className="text-3xl font-bold text-green-400 mb-2">92%</div>
                    <div className="text-sm text-slate-400">Overall Attendance</div>
                  </div>
                  <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-xl p-4">
                    <div className="text-3xl font-bold text-blue-400 mb-2">90%</div>
                    <div className="text-sm text-slate-400">This Week</div>
                  </div>
                  <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-xl p-4">
                    <div className="text-3xl font-bold text-amber-400 mb-2">75%</div>
                    <div className="text-sm text-slate-400">Today</div>
                  </div>
                  <div className="bg-gradient-to-r from-red-500/10 to-rose-500/10 border border-red-500/30 rounded-xl p-4">
                    <div className="text-3xl font-bold text-red-400 mb-2">65%</div>
                    <div className="text-sm text-slate-400">Database Management</div>
                  </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  <div className="bg-slate-800/50 rounded-xl p-4">
                    <h4 className="font-semibold mb-4">Attendance Trend</h4>
                    <canvas id="attendanceChart" height="200"></canvas>
                  </div>
                  <div className="bg-slate-800/50 rounded-xl p-4">
                    <h4 className="font-semibold mb-4">Subject Performance</h4>
                    <canvas id="subjectPerformanceChart" height="200"></canvas>
                  </div>
                </div>

                {/* Subject-wise Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-700/50">
                        <th className="text-left py-3 px-4 text-slate-400">Subject</th>
                        <th className="text-left py-3 px-4 text-slate-400">Attended</th>
                        <th className="text-left py-3 px-4 text-slate-400">Total</th>
                        <th className="text-left py-3 px-4 text-slate-400">Percentage</th>
                        <th className="text-left py-3 px-4 text-slate-400">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { subject: "Data Structures", attended: 12, total: 14, percentage: 86, status: "good" },
                        { subject: "Web Development", attended: 13, total: 14, percentage: 93, status: "excellent" },
                        { subject: "Database Management", attended: 9, total: 14, percentage: 65, status: "warning" },
                        { subject: "Operating Systems", attended: 11, total: 13, percentage: 85, status: "good" },
                        { subject: "Computer Networks", attended: 7, total: 9, percentage: 78, status: "good" },
                      ].map((item, index) => (
                        <tr key={index} className="border-b border-slate-800/30 hover:bg-slate-700/20">
                          <td className="py-3 px-4">{item.subject}</td>
                          <td className="py-3 px-4">{item.attended}</td>
                          <td className="py-3 px-4">{item.total}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <div className="w-16 bg-slate-700 rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full ${
                                    item.percentage >= 85 ? 'bg-green-500' :
                                    item.percentage >= 75 ? 'bg-amber-500' : 'bg-red-500'
                                  }`}
                                  style={{ width: `${item.percentage}%` }}
                                ></div>
                              </div>
                              <span>{item.percentage}%</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-3 py-1 rounded-full text-xs ${
                              item.status === 'excellent' ? 'bg-green-500/20 text-green-400' :
                              item.status === 'good' ? 'bg-blue-500/20 text-blue-400' :
                              'bg-red-500/20 text-red-400'
                            }`}>
                              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Planner Tab */}
          {activeTab === "planner" && (
            <div className="space-y-8">
              <div className="bg-slate-800/30 backdrop-blur-lg rounded-2xl p-6 border border-slate-700/30">
                <h2 className="text-2xl font-bold mb-6">Smart Planner</h2>
                
                {/* Free Time Slots */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold">Available Free Slots Today</h3>
                    <span className="text-sm text-slate-400">Based on your schedule</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { time: "10:00 AM - 11:00 AM", duration: "60 minutes", suggested: "Study Data Structures" },
                      { time: "2:00 PM - 3:30 PM", duration: "90 minutes", suggested: "Database Assignment" },
                      { time: "5:00 PM - 6:30 PM", duration: "90 minutes", suggested: "Web Dev Practice" },
                    ].map((slot, index) => (
                      <div key={index} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <div className="font-semibold">{slot.time}</div>
                            <div className="text-sm text-slate-400">{slot.duration}</div>
                          </div>
                          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                            <Clock size={16} />
                          </div>
                        </div>
                        <div className="text-sm text-slate-300 mb-4">{slot.suggested}</div>
                        <button className="w-full py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg text-sm font-medium hover:bg-purple-500/30 transition-colors">
                          Plan Activity
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Goals Section */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold">Your Goals</h3>
                    <button className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
                      + Add Goal
                    </button>
                  </div>
                  <div className="space-y-3">
                    {[
                      { title: "Improve Database attendance to 75%", progress: 65 },
                      { title: "Complete all assignments on time", progress: 80 },
                      { title: "Learn React.js fundamentals", progress: 100, completed: true },
                      { title: "Maintain 90%+ overall attendance", progress: 92 },
                    ].map((goal, index) => (
                      <div key={index} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <input type="checkbox" checked={goal.completed} readOnly className="w-5 h-5 rounded border-slate-600" />
                            <span className={goal.completed ? "line-through text-slate-500" : ""}>
                              {goal.title}
                            </span>
                          </div>
                          <span className="text-sm font-medium">{goal.progress}%</span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              goal.progress >= 90 ? 'bg-green-500' :
                              goal.progress >= 75 ? 'bg-blue-500' :
                              goal.progress >= 50 ? 'bg-amber-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${goal.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tasks Tab */}
          {activeTab === "tasks" && (
            <div className="space-y-8">
              <div className="bg-slate-800/30 backdrop-blur-lg rounded-2xl p-6 border border-slate-700/30">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold">Tasks & To-Dos</h2>
                    <p className="text-slate-400">Manage your assignments and study tasks</p>
                  </div>
                  <button className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg font-medium hover:opacity-90 transition-opacity">
                    + Add Task
                  </button>
                </div>

                {/* Task Filters */}
                <div className="flex gap-2 mb-6">
                  {['All', 'Pending', 'Completed', 'Overdue'].map(filter => (
                    <button
                      key={filter}
                      className="px-4 py-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 transition-colors"
                    >
                      {filter}
                    </button>
                  ))}
                </div>

                {/* Tasks List */}
                <div className="space-y-3">
                  {tasks.map(task => (
                    <div key={task.id} className={`bg-slate-800/50 border rounded-xl p-4 ${
                      task.overdue ? 'border-red-500/30' :
                      task.completed ? 'border-green-500/30' : 'border-slate-700/50'
                    }`}>
                      <div className="flex items-start gap-4">
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => handleTaskComplete(task.id)}
                          className="mt-1 w-5 h-5 rounded border-slate-600"
                        />
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className={`font-semibold ${task.completed ? 'line-through text-slate-500' : ''}`}>
                                {task.title}
                              </h4>
                              <p className="text-sm text-slate-400 mt-1">{task.description}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-1 text-xs rounded ${
                                task.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                                task.priority === 'medium' ? 'bg-amber-500/20 text-amber-400' :
                                'bg-blue-500/20 text-blue-400'
                              }`}>
                                {task.priority}
                              </span>
                              <span className="text-sm text-slate-400">{task.category}</span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center mt-4">
                            <div className="flex items-center gap-4">
                              <span className={`text-sm ${
                                task.overdue ? 'text-red-400' : 'text-slate-400'
                              }`}>
                                Due: {task.dueDate}
                              </span>
                              {task.overdue && (
                                <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded">
                                  Overdue
                                </span>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <button className="px-3 py-1 bg-slate-700 rounded text-sm hover:bg-slate-600 transition-colors">
                                Edit
                              </button>
                              <button className="px-3 py-1 bg-red-500/20 text-red-400 rounded text-sm hover:bg-red-500/30 transition-colors">
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="space-y-8">
              <div className="bg-slate-800/30 backdrop-blur-lg rounded-2xl p-6 border border-slate-700/30">
                <h2 className="text-2xl font-bold mb-6">Profile & Settings</h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Profile Info */}
                  <div className="lg:col-span-2 space-y-6">
                    <div className="bg-slate-800/50 rounded-xl p-6">
                      <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm text-slate-400">Full Name</label>
                          <div className="font-medium mt-1">{student.fullName}</div>
                        </div>
                        <div>
                          <label className="text-sm text-slate-400">Student ID</label>
                          <div className="font-medium mt-1">{student.registrationNo}</div>
                        </div>
                        <div>
                          <label className="text-sm text-slate-400">Email</label>
                          <div className="font-medium mt-1">{student.email}</div>
                        </div>
                        <div>
                          <label className="text-sm text-slate-400">Department</label>
                          <div className="font-medium mt-1">{student.department}</div>
                        </div>
                        <div>
                          <label className="text-sm text-slate-400">Year</label>
                          <div className="font-medium mt-1">{student.year}</div>
                        </div>
                        <div>
                          <label className="text-sm text-slate-400">Institution</label>
                          <div className="font-medium mt-1">{student.institutionName}</div>
                        </div>
                      </div>
                    </div>

                    {/* Device Permissions */}
                    <div className="bg-slate-800/50 rounded-xl p-6">
                      <h3 className="text-lg font-semibold mb-4">Device Permissions</h3>
                      <div className="space-y-4">
                        {[
                          { name: "Camera Access", description: "Required for face recognition attendance", status: "granted" },
                          { name: "Location Access", description: "Required for proximity-based attendance", status: "granted" },
                          { name: "Notification Access", description: "Receive alerts about attendance", status: "granted" },
                          { name: "Bluetooth Access", description: "Optional for proximity check-in", status: "denied" },
                        ].map((perm, index) => (
                          <div key={index} className="flex items-center justify-between py-3 border-b border-slate-700/50 last:border-0">
                            <div>
                              <div className="font-medium">{perm.name}</div>
                              <div className="text-sm text-slate-400">{perm.description}</div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`px-3 py-1 rounded-full text-sm ${
                                perm.status === 'granted' 
                                  ? 'bg-green-500/20 text-green-400' 
                                  : 'bg-red-500/20 text-red-400'
                              }`}>
                                {perm.status === 'granted' ? '✓ Granted' : '✗ Denied'}
                              </span>
                              <button className="px-3 py-1 bg-slate-700 rounded text-sm hover:bg-slate-600 transition-colors">
                                {perm.status === 'granted' ? 'Revoke' : 'Grant'}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="space-y-6">
                    <div className="bg-slate-800/50 rounded-xl p-6">
                      <h3 className="text-lg font-semibold mb-4">Quick Settings</h3>
                      <div className="space-y-3">
                        <button className="w-full flex items-center justify-between p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors">
                          <span>Change Password</span>
                          <ChevronRight size={16} />
                        </button>
                        <button className="w-full flex items-center justify-between p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors">
                          <span>Two-Factor Authentication</span>
                          <ChevronRight size={16} />
                        </button>
                        <button className="w-full flex items-center justify-between p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors">
                          <span>Notification Preferences</span>
                          <ChevronRight size={16} />
                        </button>
                        <button className="w-full flex items-center justify-between p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors">
                          <span>Privacy Settings</span>
                          <ChevronRight size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-xl p-6">
                      <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
                        <Download className="text-blue-400" size={24} />
                      </div>
                      <h4 className="font-semibold mb-2">Export Data</h4>
                      <p className="text-sm text-slate-400 mb-4">Download your attendance reports and academic data</p>
                      <button className="w-full py-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg font-medium hover:opacity-90 transition-opacity">
                        Export All Data
                      </button>
                    </div>

                    <div className="bg-gradient-to-r from-red-500/10 to-rose-500/10 border border-red-500/30 rounded-xl p-6">
                      <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center mb-4">
                        <HelpCircle className="text-red-400" size={24} />
                      </div>
                      <h4 className="font-semibold mb-2">Need Help?</h4>
                      <p className="text-sm text-slate-400 mb-4">Contact support or view documentation</p>
                      <button className="w-full py-2 bg-gradient-to-r from-red-500 to-rose-500 rounded-lg font-medium hover:opacity-90 transition-opacity">
                        Contact Support
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="mt-8 text-center">
            <div className="text-sm text-slate-500">
              <p>Attenza Smart Student Portal • {student.institutionName} • v2.0</p>
              <p className="mt-1">Last sync: {new Date().toLocaleString()} • 
                <span className="mx-2">•</span>
                <span className="text-green-400">System Status: Operational</span>
              </p>
            </div>
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-slate-800/90 backdrop-blur-lg border-t border-slate-700/50">
        <div className="flex justify-around p-3">
          {[
            { icon: BarChart3, tab: "dashboard" },
            { icon: CheckCircle, tab: "attendance" },
            { icon: Target, tab: "planner" },
            { icon: FileText, tab: "tasks" },
            { icon: User, tab: "profile" },
          ].map((item, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(item.tab)}
              className={`p-3 rounded-xl transition-colors ${
                activeTab === item.tab
                  ? "bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400"
                  : "text-slate-400"
              }`}
            >
              <item.icon size={22} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}