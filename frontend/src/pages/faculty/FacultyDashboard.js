import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar, Clock, Users, CheckCircle, AlertCircle, QrCode, Camera, 
  Eye, Upload, Download, BarChart3, Bell, Settings, LogOut, 
  TrendingUp, TrendingDown, PlayCircle, StopCircle, Filter,
  UserCheck, UserX, RefreshCw, Save, X, ChevronRight, ChevronLeft,
  FileText, Award, Target, Zap, HelpCircle, Shield, Lock,
  CalendarDays, Clock3, Smartphone, Tablet, Laptop, Projector,
  CheckSquare, Square, Flag, ThumbsUp, ThumbsDown, Users2,
  PieChart, LineChart, Activity, Target as TargetIcon,
  ArrowUpRight, ArrowDownRight, ClipboardCheck
} from 'lucide-react';

export default function FacultyDashboard() {
  const navigate = useNavigate();
  const [faculty, setFaculty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [attendanceSession, setAttendanceSession] = useState(null);
  const [qrCode, setQrCode] = useState(null);
  const [countdown, setCountdown] = useState(120); // 2 minutes in seconds
  const [qrRefreshTimer, setQrRefreshTimer] = useState(30);
  const [attendanceList, setAttendanceList] = useState([]);
  const [flaggedStudents, setFlaggedStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [sessionSummary, setSessionSummary] = useState(null);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [realTimeUpdates, setRealTimeUpdates] = useState([]);
  const [currentClassStats, setCurrentClassStats] = useState(null);
  
  const countdownRef = useRef(null);
  const qrRefreshRef = useRef(null);
  const wsRef = useRef(null);

  // Initialize faculty data
  useEffect(() => {
    const facultyData = {
      id: sessionStorage.getItem("facultyId"),
      facultyId: sessionStorage.getItem("facultyId"),
      fullName: sessionStorage.getItem("facultyName"),
      email: sessionStorage.getItem("facultyEmail"),
      department: sessionStorage.getItem("facultyDepartment"),
      designation: "Assistant Professor",
      status: "ACTIVE"
    };

    if (!facultyData.id) {
      navigate("/faculty/login");
      return;
    }

    setFaculty(facultyData);
    loadFacultyData();
    
    // Cleanup on unmount
    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
      if (qrRefreshRef.current) clearInterval(qrRefreshRef.current);
      if (wsRef.current) wsRef.current.close();
    };
  }, [navigate]);

  // WebSocket for real-time updates
  useEffect(() => {
    if (!faculty) return;

    // Simulate WebSocket connection for real-time attendance
    const simulateRealTimeUpdates = () => {
      const updates = [
        { id: 1, studentName: 'Rajesh Kumar', time: '10:01:12', status: 'SUBMITTED', photo: null },
        { id: 2, studentName: 'Priya Sharma', time: '10:01:15', status: 'SUBMITTED', photo: null },
        { id: 3, studentName: 'Amit Patel', time: '10:01:30', status: 'SUBMITTED', photo: null },
        { id: 4, studentName: 'Sneha Reddy', time: '10:01:45', status: 'SUBMITTED', photo: null },
        { id: 5, studentName: 'Vikram Singh', time: '10:02:00', status: 'SUBMITTED', photo: null },
      ];
      
      setRealTimeUpdates(updates);
      setAttendanceList(updates);
    };

    simulateRealTimeUpdates();
  }, [faculty]);

  // Mock data loading
  const loadFacultyData = () => {
    setLoading(false);
  };

  // Mock classes data
  const todayClasses = [
    {
      id: 1,
      courseCode: 'CS201',
      courseName: 'Data Structures',
      time: '10:00 AM - 11:30 AM',
      room: 'Room 302',
      totalStudents: 45,
      presentCount: 42,
      attendanceRate: 93,
      status: 'completed',
      lowEngagement: false
    },
    {
      id: 2,
      courseCode: 'CS203',
      courseName: 'Database Management',
      time: '1:00 PM - 3:00 PM',
      room: 'Lab 101',
      totalStudents: 40,
      presentCount: 38,
      attendanceRate: 95,
      status: 'upcoming',
      lowEngagement: true
    },
    {
      id: 3,
      courseCode: 'CS205',
      courseName: 'Web Technologies',
      time: '3:30 PM - 5:00 PM',
      room: 'Room 205',
      totalStudents: 38,
      presentCount: 35,
      attendanceRate: 92,
      status: 'upcoming',
      lowEngagement: false
    }
  ];

  // Start attendance session
  const startAttendance = (classData) => {
    setSelectedClass(classData);
    setShowSessionModal(true);
    
    // Generate mock attendance session
    const sessionId = `ATT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newSession = {
      id: sessionId,
      classId: classData.id,
      className: classData.courseName,
      startTime: new Date().toISOString(),
      expiryTime: new Date(Date.now() + 2 * 60 * 1000).toISOString(), // 2 minutes from now
      status: 'ACTIVE',
      totalStudents: classData.totalStudents,
      submittedCount: 0
    };
    
    setAttendanceSession(newSession);
    generateQRCode(sessionId);
    
    // Start countdown timer
    setCountdown(120);
    countdownRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownRef.current);
          endAttendanceSession();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    // Start QR refresh timer
    setQrRefreshTimer(30);
    qrRefreshRef.current = setInterval(() => {
      setQrRefreshTimer(prev => {
        if (prev <= 1) {
          generateQRCode(sessionId);
          return 30;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Generate QR Code
  const generateQRCode = (sessionId) => {
    // In real implementation, this would call an API
    const qrData = {
      sessionId,
      classId: selectedClass?.id,
      timestamp: Date.now(),
      expiry: Date.now() + 120000 // 2 minutes
    };
    
    // Mock QR code generation
    const mockQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(JSON.stringify(qrData))}`;
    setQrCode(mockQrUrl);
  };

  // End attendance session
  const endAttendanceSession = () => {
    if (countdownRef.current) clearInterval(countdownRef.current);
    if (qrRefreshRef.current) clearInterval(qrRefreshRef.current);
    
    // Calculate summary
    const summary = {
      totalStudents: attendanceSession.totalStudents,
      submittedCount: attendanceList.length,
      absentCount: attendanceSession.totalStudents - attendanceList.length,
      flaggedCount: flaggedStudents.length,
      attendanceRate: Math.round((attendanceList.length / attendanceSession.totalStudents) * 100)
    };
    
    setSessionSummary(summary);
    setAttendanceSession({ ...attendanceSession, status: 'COMPLETED' });
    setShowSessionModal(false);
    setShowSummaryModal(true);
  };

  // Handle student flagging
  const handleFlagStudent = (studentId) => {
    const student = attendanceList.find(s => s.id === studentId);
    if (student && !flaggedStudents.includes(studentId)) {
      setFlaggedStudents(prev => [...prev, studentId]);
      setAttendanceList(prev => 
        prev.map(s => s.id === studentId ? { ...s, status: 'FLAGGED' } : s)
      );
    }
  };

  // Handle flag approval/rejection
  const handleFlagAction = (studentId, action) => {
    if (action === 'APPROVE') {
      setAttendanceList(prev => 
        prev.map(s => s.id === studentId ? { ...s, status: 'APPROVED' } : s)
      );
    } else {
      setAttendanceList(prev => 
        prev.map(s => s.id === studentId ? { ...s, status: 'REJECTED' } : s)
      );
    }
    
    setFlaggedStudents(prev => prev.filter(id => id !== studentId));
  };

  // Submit final attendance
  const submitAttendance = () => {
    // Here you would make API call to submit attendance
    console.log('Submitting attendance:', {
      session: attendanceSession,
      attendanceList,
      flaggedStudents
    });
    
    alert('Attendance submitted successfully!');
    setAttendanceSession(null);
    setAttendanceList([]);
    setFlaggedStudents([]);
    setShowSummaryModal(false);
  };

  // Cancel attendance session
  const cancelAttendance = () => {
    if (countdownRef.current) clearInterval(countdownRef.current);
    if (qrRefreshRef.current) clearInterval(qrRefreshRef.current);
    
    setAttendanceSession(null);
    setAttendanceList([]);
    setFlaggedStudents([]);
    setShowSessionModal(false);
    alert('Attendance session cancelled.');
  };

  // Mock statistics
  const stats = [
    { label: 'Total Classes Today', value: '3', change: '+1', trend: 'up', icon: Calendar, color: 'from-blue-500 to-blue-600' },
    { label: 'Avg Attendance', value: '93.3%', change: '+2.5%', trend: 'up', icon: Users, color: 'from-emerald-500 to-emerald-600' },
    { label: 'Students Present', value: '115', change: '+8', trend: 'up', icon: UserCheck, color: 'from-purple-500 to-purple-600' },
    { label: 'Pending Tasks', value: '2', change: '-1', trend: 'down', icon: ClipboardCheck, color: 'from-orange-500 to-orange-600' }
  ];

  // Mock insights
  const insights = [
    {
      type: 'warning',
      title: 'Low Post-Lunch Attendance',
      message: 'CS203 shows 15% lower attendance in post-lunch sessions. Consider rescheduling.',
      action: 'Review Schedule'
    },
    {
      type: 'info',
      title: 'High Engagement Alert',
      message: 'Your Data Structures class has 95% attendance consistently. Great work!',
      action: 'View Details'
    },
    {
      type: 'alert',
      title: '5 Students Need Attention',
      message: 'These students have missed 3+ consecutive classes in your course.',
      action: 'See List'
    }
  ];

  // Format time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-4 text-slate-300 text-lg">Loading your dashboard...</p>
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
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Users size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Faculty Portal</h1>
                <p className="text-sm text-slate-400">Attendance Tracking & Management</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Notification Bell */}
              <button className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors relative">
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center">
                  3
                </span>
              </button>
              
              {/* User Profile */}
              <div className="flex items-center gap-3">
                <div className="hidden md:block text-right">
                  <p className="font-medium">{faculty.fullName}</p>
                  <p className="text-sm text-slate-400">{faculty.department} • {faculty.designation}</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                  <span className="font-semibold">{faculty.fullName.charAt(0)}</span>
                </div>
                <button
                  onClick={() => {
                    sessionStorage.clear();
                    navigate("/faculty/login");
                  }}
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
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <Users size={32} />
            </div>
            <h2 className="text-xl font-semibold text-center">Welcome, {faculty.fullName.split(' ')[0]}!</h2>
            <p className="text-sm text-slate-400 text-center mt-1">{faculty.department}</p>
            <div className="mt-4 flex items-center justify-center gap-2">
              <div className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs font-medium border border-emerald-500/30">
                ACTIVE • {faculty.designation}
              </div>
            </div>
          </div>

          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === "dashboard"
                  ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-400 border border-purple-500/30"
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
              <ClipboardCheck size={20} />
              <span>Take Attendance</span>
            </button>

            <button
              onClick={() => setActiveTab("classes")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === "classes"
                  ? "bg-gradient-to-r from-emerald-500/20 to-green-500/20 text-emerald-400 border border-emerald-500/30"
                  : "text-slate-400 hover:text-white hover:bg-slate-700/30"
              }`}
            >
              <Calendar size={20} />
              <span>My Classes</span>
            </button>

            <button
              onClick={() => setActiveTab("students")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === "students"
                  ? "bg-gradient-to-r from-orange-500/20 to-amber-500/20 text-orange-400 border border-orange-500/30"
                  : "text-slate-400 hover:text-white hover:bg-slate-700/30"
              }`}
            >
              <Users2 size={20} />
              <span>Students</span>
            </button>

            <button
              onClick={() => setActiveTab("analytics")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === "analytics"
                  ? "bg-gradient-to-r from-pink-500/20 to-rose-500/20 text-pink-400 border border-pink-500/30"
                  : "text-slate-400 hover:text-white hover:bg-slate-700/30"
              }`}
            >
              <TrendingUp size={20} />
              <span>Analytics</span>
            </button>

            <button
              onClick={() => setActiveTab("settings")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === "settings"
                  ? "bg-gradient-to-r from-slate-500/20 to-slate-600/20 text-slate-300 border border-slate-500/30"
                  : "text-slate-400 hover:text-white hover:bg-slate-700/30"
              }`}
            >
              <Settings size={20} />
              <span>Settings</span>
            </button>
          </nav>

          {/* Quick Stats */}
          <div className="mt-8 p-4 bg-slate-800/30 rounded-xl border border-slate-700/30">
            <h3 className="text-sm font-medium text-slate-400 mb-2">Today's Overview</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Classes</span>
                <span className="font-semibold text-blue-400">3</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Attendance Rate</span>
                <span className="font-semibold text-emerald-400">93.3%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Pending</span>
                <span className="font-semibold text-orange-400">2</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Dashboard Tab */}
          {activeTab === "dashboard" && (
            <>
              {/* Welcome Card */}
              <div className="bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 border border-purple-500/20 rounded-2xl p-8 mb-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                      <ClipboardCheck size={36} className="text-white" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold mb-2">Smart Attendance Dashboard</h2>
                      <p className="text-slate-300 max-w-2xl">
                        Hello <span className="font-semibold text-purple-400">Prof. {faculty.fullName.split(' ')[0]}</span>! 
                        Here's your personalized overview for today's classes and attendance tracking.
                      </p>
                    </div>
                  </div>
                  {attendanceSession?.status === 'ACTIVE' && (
                    <div className="bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-500/30 rounded-xl p-4">
                      <div className="flex items-center gap-3">
                        <Clock className="text-emerald-400" size={24} />
                        <div>
                          <p className="font-semibold">Attendance in Progress</p>
                          <p className="text-sm text-slate-300">
                            {formatTime(countdown)} remaining • {attendanceSession.className}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, idx) => (
                  <div key={idx} className="bg-slate-800/30 backdrop-blur-lg rounded-2xl p-6 border border-slate-700/30 hover:border-purple-500/30 transition-all group">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-400">{stat.label}</p>
                        <p className="text-3xl font-bold mt-2 group-hover:text-purple-400 transition-colors">{stat.value}</p>
                      </div>
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center group-hover:bg-purple-500/30 transition-colors">
                        <stat.icon className="text-purple-400" size={24} />
                      </div>
                    </div>
                    <div className="flex items-center gap-1 mt-2">
                      {stat.trend === 'up' ? (
                        <ArrowUpRight size={16} className="text-emerald-400" />
                      ) : (
                        <ArrowDownRight size={16} className="text-red-400" />
                      )}
                      <span className={`text-xs ${stat.trend === 'up' ? 'text-emerald-400' : 'text-red-400'}`}>
                        {stat.change} from yesterday
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Today's Schedule & Insights */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Today's Classes */}
                <div className="lg:col-span-2 bg-slate-800/30 backdrop-blur-lg rounded-2xl p-6 border border-slate-700/30">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold flex items-center gap-2">
                      <Calendar className="text-blue-400" size={24} />
                      Today's Schedule
                    </h3>
                    <span className="text-sm text-slate-400">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                  
                  <div className="space-y-4">
                    {todayClasses.map((classItem) => (
                      <div key={classItem.id} className={`rounded-xl p-4 border transition-all ${
                        classItem.status === 'completed' 
                          ? 'bg-slate-700/30 border-slate-600/30'
                          : classItem.status === 'upcoming'
                          ? 'bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-blue-500/30'
                          : 'bg-slate-700/30 border-slate-600/30'
                      }`}>
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-bold text-lg">{classItem.courseCode}</span>
                              <span className="text-slate-400">•</span>
                              <span className="font-semibold">{classItem.courseName}</span>
                            </div>
                            <p className="text-slate-400 text-sm">{classItem.time} • {classItem.room}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              classItem.status === 'completed' 
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : 'bg-blue-500/20 text-blue-400'
                            }`}>
                              {classItem.status === 'completed' ? 'Completed' : 'Upcoming'}
                            </span>
                            {classItem.lowEngagement && (
                              <span className="px-2 py-1 bg-orange-500/20 text-orange-400 text-xs rounded-full">
                                Low Engagement
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div>
                              <p className="text-slate-400 text-xs">Attendance</p>
                              <p className="text-white font-semibold">
                                {classItem.presentCount}/{classItem.totalStudents} ({classItem.attendanceRate}%)
                              </p>
                            </div>
                            <div className="h-8 w-px bg-slate-700/50"></div>
                            <div>
                              <p className="text-slate-400 text-xs">Status</p>
                              <p className={`text-sm font-medium ${
                                classItem.attendanceRate >= 90 ? 'text-emerald-400' :
                                classItem.attendanceRate >= 75 ? 'text-orange-400' :
                                'text-red-400'
                              }`}>
                                {classItem.attendanceRate >= 90 ? 'Excellent' :
                                 classItem.attendanceRate >= 75 ? 'Good' : 'Needs Attention'}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            {classItem.status === 'upcoming' ? (
                              <button
                                onClick={() => startAttendance(classItem)}
                                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-purple-500/20 transition-all"
                              >
                                Start Attendance
                              </button>
                            ) : (
                              <button
                                onClick={() => navigate(`/faculty/classes/${classItem.id}`)}
                                className="px-4 py-2 bg-slate-700/50 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors"
                              >
                                View Details
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Insights Panel */}
                <div className="bg-slate-800/30 backdrop-blur-lg rounded-2xl p-6 border border-slate-700/30">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold flex items-center gap-2">
                      <Zap className="text-amber-400" size={24} />
                      AI Insights
                    </h3>
                    <RefreshCw size={20} className="text-slate-400 cursor-pointer hover:text-white" />
                  </div>
                  
                  <div className="space-y-4">
                    {insights.map((insight, idx) => (
                      <div key={idx} className={`rounded-xl p-4 border ${
                        insight.type === 'warning' ? 'bg-orange-500/10 border-orange-500/30' :
                        insight.type === 'alert' ? 'bg-red-500/10 border-red-500/30' :
                        'bg-blue-500/10 border-blue-500/30'
                      }`}>
                        <div className="flex items-start gap-3">
                          {insight.type === 'warning' ? (
                            <AlertCircle className="text-orange-400 mt-1" size={20} />
                          ) : insight.type === 'alert' ? (
                            <AlertCircle className="text-red-400 mt-1" size={20} />
                          ) : (
                            <AlertCircle className="text-blue-400 mt-1" size={20} />
                          )}
                          <div className="flex-1">
                            <h4 className="text-white font-semibold text-sm mb-1">{insight.title}</h4>
                            <p className="text-slate-300 text-xs mb-3">{insight.message}</p>
                            <button className="text-xs font-medium text-purple-400 hover:text-purple-300 transition-colors">
                              {insight.action} →
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Quick Actions */}
                  <div className="mt-6 pt-6 border-t border-slate-700/50">
                    <h4 className="text-white font-semibold mb-3">Quick Actions</h4>
                    <div className="space-y-2">
                      <button className="w-full flex items-center justify-between p-3 bg-slate-700/30 hover:bg-slate-700/50 rounded-lg transition-colors">
                        <span className="text-sm">Generate Monthly Report</span>
                        <FileText size={16} className="text-slate-400" />
                      </button>
                      <button className="w-full flex items-center justify-between p-3 bg-slate-700/30 hover:bg-slate-700/50 rounded-lg transition-colors">
                        <span className="text-sm">View Student Analytics</span>
                        <TrendingUp size={16} className="text-slate-400" />
                      </button>
                      <button className="w-full flex items-center justify-between p-3 bg-slate-700/30 hover:bg-slate-700/50 rounded-lg transition-colors">
                        <span className="text-sm">Attendance Settings</span>
                        <Settings size={16} className="text-slate-400" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-slate-800/30 backdrop-blur-lg rounded-2xl p-6 border border-slate-700/30">
                <h3 className="text-xl font-semibold mb-4">Recent Attendance Activity</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-700/50">
                        <th className="text-left py-3 text-sm text-slate-400 font-medium">Class</th>
                        <th className="text-left py-3 text-sm text-slate-400 font-medium">Date & Time</th>
                        <th className="text-left py-3 text-sm text-slate-400 font-medium">Students</th>
                        <th className="text-left py-3 text-sm text-slate-400 font-medium">Attendance Rate</th>
                        <th className="text-left py-3 text-sm text-slate-400 font-medium">Status</th>
                        <th className="text-left py-3 text-sm text-slate-400 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { class: 'CS201 - Data Structures', date: 'Today, 10:00 AM', students: '42/45', rate: '93%', status: 'Completed' },
                        { class: 'CS301 - Algorithms', date: 'Yesterday, 2:00 PM', students: '38/40', rate: '95%', status: 'Completed' },
                        { class: 'CS205 - Web Technologies', date: 'Jan 19, 3:30 PM', students: '35/38', rate: '92%', status: 'Completed' },
                        { class: 'CS203 - Database', date: 'Jan 18, 1:00 PM', students: '36/40', rate: '90%', status: 'Completed' },
                      ].map((activity, idx) => (
                        <tr key={idx} className="border-b border-slate-800/30 hover:bg-slate-700/20">
                          <td className="py-3 text-white font-medium">{activity.class}</td>
                          <td className="py-3 text-slate-300 text-sm">{activity.date}</td>
                          <td className="py-3 text-slate-300">{activity.students}</td>
                          <td className="py-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              parseInt(activity.rate) >= 90 ? 'bg-emerald-500/20 text-emerald-400' :
                              parseInt(activity.rate) >= 75 ? 'bg-orange-500/20 text-orange-400' :
                              'bg-red-500/20 text-red-400'
                            }`}>
                              {activity.rate}
                            </span>
                          </td>
                          <td className="py-3">
                            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs">
                              {activity.status}
                            </span>
                          </td>
                          <td className="py-3">
                            <button className="text-sm text-purple-400 hover:text-purple-300">
                              View Details →
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* Take Attendance Tab */}
          {activeTab === "attendance" && (
            <div className="space-y-8">
              {/* Attendance Header */}
              <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl p-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                      <QrCode size={32} className="text-white" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold mb-2">Smart Attendance System</h2>
                      <p className="text-slate-300 max-w-2xl">
                        Start attendance sessions with dynamic QR codes. Students scan with their phones and submit live photos for verification.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Current Session Status */}
              {attendanceSession?.status === 'ACTIVE' && (
                <div className="bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-500/30 rounded-2xl p-6">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                        <PlayCircle className="text-emerald-400" size={24} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">Attendance Session Active</h3>
                        <p className="text-slate-300">
                          {attendanceSession.className} • Started at {new Date(attendanceSession.startTime).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-white">{formatTime(countdown)}</div>
                        <div className="text-sm text-slate-400">Time Remaining</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-white">{attendanceList.length}/{attendanceSession.totalStudents}</div>
                        <div className="text-sm text-slate-400">Students Submitted</div>
                      </div>
                      <button
                        onClick={endAttendanceSession}
                        className="px-6 py-3 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-red-500/20 transition-all"
                      >
                        End Session
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Classes Available for Attendance */}
              <div className="bg-slate-800/30 backdrop-blur-lg rounded-2xl p-6 border border-slate-700/30">
                <h3 className="text-2xl font-bold mb-6">Start Attendance Session</h3>
                <p className="text-slate-400 mb-6">Select a class to begin attendance. The QR code will be displayed for 2 minutes.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {todayClasses.filter(c => c.status === 'upcoming').map((classItem) => (
                    <div key={classItem.id} className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50 hover:border-purple-500/30 transition-all group">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-2xl font-bold text-white">{classItem.courseCode}</span>
                            <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">Upcoming</span>
                          </div>
                          <h4 className="text-lg font-semibold text-white mb-1">{classItem.courseName}</h4>
                          <p className="text-slate-400 text-sm">{classItem.time} • {classItem.room}</p>
                        </div>
                        <Users className="text-slate-600 group-hover:text-purple-400" size={24} />
                      </div>
                      
                      <div className="mb-6">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-slate-400 text-sm">Total Students</span>
                          <span className="text-white font-medium">{classItem.totalStudents}</span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-2">
                          <div 
                            className="h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                            style={{ width: `${classItem.attendanceRate}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => startAttendance(classItem)}
                        className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-purple-500/20 transition-all flex items-center justify-center gap-2"
                      >
                        <PlayCircle size={20} />
                        Start Attendance Session
                      </button>
                    </div>
                  ))}
                </div>
                
                {/* Instructions */}
                <div className="mt-8 pt-6 border-t border-slate-700/50">
                  <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                    <HelpCircle className="text-blue-400" size={20} />
                    How It Works
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-slate-800/50 rounded-xl p-4">
                      <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center mb-3">
                        <span className="text-blue-400 font-bold">1</span>
                      </div>
                      <h5 className="text-white font-medium mb-2">Start Session</h5>
                      <p className="text-slate-400 text-sm">Click "Start Attendance" on your class. A 2-minute timer begins.</p>
                    </div>
                    <div className="bg-slate-800/50 rounded-xl p-4">
                      <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center mb-3">
                        <span className="text-purple-400 font-bold">2</span>
                      </div>
                      <h5 className="text-white font-medium mb-2">Display QR Code</h5>
                      <p className="text-slate-400 text-sm">Project the QR code. Students scan with their phones to submit attendance.</p>
                    </div>
                    <div className="bg-slate-800/50 rounded-xl p-4">
                      <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center mb-3">
                        <span className="text-emerald-400 font-bold">3</span>
                      </div>
                      <h5 className="text-white font-medium mb-2">Verify & Submit</h5>
                      <p className="text-slate-400 text-sm">Monitor submissions in real-time, flag suspicious entries, and finalize.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Previous Sessions */}
          <div className="mt-8">
            <h3 className="text-2xl font-bold mb-6">Previous Attendance Sessions</h3>
            <div className="bg-slate-800/30 backdrop-blur-lg rounded-2xl overflow-hidden border border-slate-700/30">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-900/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Date & Time</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Class</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Duration</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Students</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Attendance Rate</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/50">
                    {[
                      { date: 'Jan 20, 10:00 AM', class: 'CS201 - Data Structures', duration: '2:00', students: '42/45', rate: '93%', status: 'Completed' },
                      { date: 'Jan 19, 2:00 PM', class: 'CS301 - Algorithms', duration: '2:00', students: '38/40', rate: '95%', status: 'Completed' },
                      { date: 'Jan 18, 3:30 PM', class: 'CS205 - Web Tech', duration: '1:45', students: '35/38', rate: '92%', status: 'Completed' },
                      { date: 'Jan 17, 1:00 PM', class: 'CS203 - Database', duration: '2:00', students: '36/40', rate: '90%', status: 'Completed' },
                      { date: 'Jan 16, 10:00 AM', class: 'CS201 - Data Structures', duration: '2:00', students: '40/45', rate: '89%', status: 'Completed' },
                    ].map((session, idx) => (
                      <tr key={idx} className="hover:bg-slate-700/20 transition-colors">
                        <td className="px-6 py-4 text-sm text-slate-300">{session.date}</td>
                        <td className="px-6 py-4 text-white font-medium">{session.class}</td>
                        <td className="px-6 py-4 text-slate-300">{session.duration} min</td>
                        <td className="px-6 py-4 text-slate-300">{session.students}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            parseInt(session.rate) >= 90 ? 'bg-emerald-500/20 text-emerald-400' :
                            parseInt(session.rate) >= 75 ? 'bg-orange-500/20 text-orange-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {session.rate}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs">
                            {session.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button className="text-sm text-purple-400 hover:text-purple-300">
                            View Details →
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-slate-800/90 backdrop-blur-lg border-t border-slate-700/50">
        <div className="flex justify-around p-3">
          {[
            { icon: BarChart3, tab: "dashboard" },
            { icon: ClipboardCheck, tab: "attendance" },
            { icon: Calendar, tab: "classes" },
            { icon: Users2, tab: "students" },
            { icon: Settings, tab: "settings" },
          ].map((item, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(item.tab)}
              className={`p-3 rounded-xl transition-colors ${
                activeTab === item.tab
                  ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-400"
                  : "text-slate-400"
              }`}
            >
              <item.icon size={22} />
            </button>
          ))}
        </div>
      </div>

      {/* Attendance Session Modal */}
      {showSessionModal && selectedClass && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-2xl border border-slate-700 w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-700/50 bg-slate-800/50 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                  <QrCode className="text-purple-400" size={28} />
                  Attendance Session: {selectedClass.courseName}
                </h3>
                <p className="text-slate-400">
                  Session ID: ATT-{Date.now()} • Time remaining: {formatTime(countdown)}
                </p>
              </div>
              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to cancel this session?')) {
                    cancelAttendance();
                  }
                }}
                className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg font-medium hover:bg-red-500/30 transition-colors"
              >
                Cancel Session
              </button>
            </div>

            <div className="flex-1 overflow-auto p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* QR Code Panel */}
                <div className="lg:col-span-1">
                  <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-700/50">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-white font-semibold">QR Code Display</h4>
                      <div className="flex items-center gap-2">
                        <Clock3 className="text-amber-400" size={16} />
                        <span className="text-amber-400 text-sm font-mono">{formatTime(qrRefreshTimer)}</span>
                      </div>
                    </div>
                    
                    <div className="aspect-square bg-white rounded-xl p-4 flex items-center justify-center mb-4">
                      {qrCode ? (
                        <img src={qrCode} alt="Attendance QR Code" className="w-64 h-64" />
                      ) : (
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
                          <p className="text-slate-500">Generating QR code...</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="text-center">
                      <p className="text-slate-400 text-sm mb-2">
                        <Projector className="inline mr-2" size={16} />
                        Display this QR code on projector
                      </p>
                      <p className="text-slate-400 text-sm">
                        <Smartphone className="inline mr-2" size={16} />
                        Students scan with their phones
                      </p>
                    </div>
                  </div>

                  {/* Instructions */}
                  <div className="mt-4 bg-slate-900/50 rounded-xl p-4 border border-slate-700/50">
                    <h5 className="text-white font-semibold mb-2">Quick Instructions</h5>
                    <ul className="text-slate-400 text-sm space-y-1">
                      <li>• QR refreshes every 30 seconds for security</li>
                      <li>• Students have 2 minutes to submit attendance</li>
                      <li>• Each student must take a live photo</li>
                      <li>• Monitor submissions in real-time panel</li>
                      <li>• Flag suspicious entries if needed</li>
                    </ul>
                  </div>
                </div>

                {/* Real-time Submissions Panel */}
                <div className="lg:col-span-2">
                  <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-700/50 h-full">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-white font-semibold">Real-time Submissions</h4>
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-white">{attendanceList.length}</div>
                          <div className="text-slate-400 text-xs">Submitted</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-white">{selectedClass.totalStudents - attendanceList.length}</div>
                          <div className="text-slate-400 text-xs">Pending</div>
                        </div>
                      </div>
                    </div>

                    <div className="h-[400px] overflow-y-auto">
                      {attendanceList.length > 0 ? (
                        <div className="space-y-3">
                          {attendanceList.map((student) => (
                            <div key={student.id} className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 hover:border-purple-500/30 transition-colors">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-white font-semibold">
                                    {student.studentName.split(' ').map(n => n[0]).join('')}
                                  </div>
                                  <div>
                                    <p className="text-white font-medium">{student.studentName}</p>
                                    <p className="text-slate-400 text-sm">Submitted at {student.time}</p>
                                  </div>
                                </div>
                                
                                <div className="flex items-center gap-3">
                                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                    student.status === 'SUBMITTED' ? 'bg-blue-500/20 text-blue-400' :
                                    student.status === 'FLAGGED' ? 'bg-orange-500/20 text-orange-400' :
                                    student.status === 'APPROVED' ? 'bg-emerald-500/20 text-emerald-400' :
                                    'bg-red-500/20 text-red-400'
                                  }`}>
                                    {student.status}
                                  </span>
                                  
                                  {student.status === 'SUBMITTED' && (
                                    <button
                                      onClick={() => handleFlagStudent(student.id)}
                                      className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded-lg text-sm hover:bg-orange-500/30 transition-colors flex items-center gap-1"
                                    >
                                      <Flag size={14} />
                                      Flag
                                    </button>
                                  )}
                                  
                                  {student.status === 'FLAGGED' && (
                                    <div className="flex gap-2">
                                      <button
                                        onClick={() => handleFlagAction(student.id, 'APPROVE')}
                                        className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-lg text-sm hover:bg-emerald-500/30 transition-colors flex items-center gap-1"
                                      >
                                        <ThumbsUp size={14} />
                                        Approve
                                      </button>
                                      <button
                                        onClick={() => handleFlagAction(student.id, 'REJECT')}
                                        className="px-3 py-1 bg-red-500/20 text-red-400 rounded-lg text-sm hover:bg-red-500/30 transition-colors flex items-center gap-1"
                                      >
                                        <ThumbsDown size={14} />
                                        Reject
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              {/* Student Photo (if available) */}
                              {student.photo && (
                                <div className="mt-3 pt-3 border-t border-slate-700/50">
                                  <p className="text-slate-400 text-sm mb-2">Live Photo:</p>
                                  <div className="w-24 h-24 bg-slate-700/50 rounded-lg overflow-hidden">
                                    <img src={student.photo} alt="Student verification" className="w-full h-full object-cover" />
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="h-full flex flex-col items-center justify-center">
                          <Users className="text-slate-600" size={64} />
                          <p className="text-slate-400 mt-4">Waiting for student submissions...</p>
                          <p className="text-slate-500 text-sm mt-1">Students should scan the QR code with their phones</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-slate-700/50 bg-slate-800/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{formatTime(countdown)}</div>
                    <div className="text-slate-400 text-xs">Time Remaining</div>
                  </div>
                  <div className="h-8 w-px bg-slate-700/50"></div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{attendanceList.length}/{selectedClass.totalStudents}</div>
                    <div className="text-slate-400 text-xs">Students Submitted</div>
                  </div>
                  <div className="h-8 w-px bg-slate-700/50"></div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-400">{flaggedStudents.length}</div>
                    <div className="text-slate-400 text-xs">Flagged Entries</div>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={endAttendanceSession}
                    className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-emerald-500/20 transition-all"
                  >
                    End Session & Review
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Summary Modal */}
      {showSummaryModal && sessionSummary && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-2xl border border-slate-700 w-full max-w-2xl">
            <div className="p-6 border-b border-slate-700/50">
              <h3 className="text-2xl font-bold text-white">Attendance Session Summary</h3>
              <p className="text-slate-400">Review and finalize the attendance for {selectedClass?.courseName}</p>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-900/50 rounded-xl p-4">
                  <div className="text-3xl font-bold text-white mb-2">{sessionSummary.submittedCount}</div>
                  <div className="text-slate-400">Students Submitted</div>
                </div>
                <div className="bg-slate-900/50 rounded-xl p-4">
                  <div className="text-3xl font-bold text-white mb-2">{sessionSummary.absentCount}</div>
                  <div className="text-slate-400">Students Absent</div>
                </div>
                <div className="bg-slate-900/50 rounded-xl p-4">
                  <div className="text-3xl font-bold text-emerald-400 mb-2">{sessionSummary.attendanceRate}%</div>
                  <div className="text-slate-400">Attendance Rate</div>
                </div>
                <div className="bg-slate-900/50 rounded-xl p-4">
                  <div className="text-3xl font-bold text-orange-400 mb-2">{flaggedStudents.length}</div>
                  <div className="text-slate-400">Flagged Entries</div>
                </div>
              </div>
              
              {/* Flagged Students List */}
              {flaggedStudents.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-white font-semibold mb-3">Flagged Students Requiring Review</h4>
                  <div className="space-y-2">
                    {attendanceList.filter(s => s.status === 'FLAGGED').map((student) => (
                      <div key={student.id} className="flex items-center justify-between bg-orange-500/10 border border-orange-500/30 rounded-lg p-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center">
                            <Flag className="text-orange-400" size={16} />
                          </div>
                          <span className="text-white font-medium">{student.studentName}</span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleFlagAction(student.id, 'APPROVE')}
                            className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-lg text-sm hover:bg-emerald-500/30"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleFlagAction(student.id, 'REJECT')}
                            className="px-3 py-1 bg-red-500/20 text-red-400 rounded-lg text-sm hover:bg-red-500/30"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Missing Students */}
              <div className="mb-6">
                <h4 className="text-white font-semibold mb-3">Missing Students (Did Not Submit)</h4>
                <div className="bg-slate-900/50 rounded-lg p-4">
                  <p className="text-slate-400">
                    {sessionSummary.absentCount} students did not submit attendance within the 2-minute window.
                    They will be marked as <span className="text-red-400 font-medium">ABSENT</span>.
                  </p>
                  <p className="text-slate-400 text-sm mt-2">
                    You can manually override absences later from the class attendance page.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-slate-700/50 flex justify-between">
              <button
                onClick={() => {
                  setShowSummaryModal(false);
                  setAttendanceSession(null);
                  setAttendanceList([]);
                  setFlaggedStudents([]);
                }}
                className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-medium transition-colors"
              >
                Cancel
              </button>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowSummaryModal(false)}
                  className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-medium transition-colors"
                >
                  Review Again
                </button>
                <button
                  onClick={submitAttendance}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-purple-500/20 transition-all"
                >
                  Submit Attendance
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}