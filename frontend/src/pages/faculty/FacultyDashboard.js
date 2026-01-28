import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, AlertCircle, TrendingUp, PlayCircle, UserCheck, RefreshCw, FileText, Zap, ArrowUpRight, ArrowDownRight, ClipboardCheck, Calendar as CalendarIcon, ExternalLink, CheckCircle, XCircle, Percent, Eye, Settings as SettingsIcon } from 'lucide-react';

const FacultyDashboard = () => {
  const navigate = useNavigate();
  const [attendanceSession, setAttendanceSession] = useState(null);
  const [loading, setLoading] = useState(false);

  // Add authentication check
  useEffect(() => {
    const facultyId = sessionStorage.getItem("facultyId");
    if (!facultyId) {
      navigate("/login");
    }
  }, [navigate]);

  // Get faculty data
  const faculty = {
    id: sessionStorage.getItem("facultyId"),
    fullName: sessionStorage.getItem("facultyName"),
    department: sessionStorage.getItem("facultyDepartment"),
    designation: sessionStorage.getItem("facultyDesignation") || "Assistant Professor",
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

  // Stats data
  const stats = [
    { 
      label: 'Today\'s Classes', 
      value: '3', 
      change: '+1', 
      trend: 'up', 
      icon: CalendarIcon, 
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20'
    },
    { 
      label: 'Avg Attendance', 
      value: '93.3%', 
      change: '+2.5%', 
      trend: 'up', 
      icon: Percent, 
      color: 'from-emerald-500 to-green-500',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/20'
    },
    { 
      label: 'Students Present', 
      value: '115', 
      change: '+8', 
      trend: 'up', 
      icon: UserCheck, 
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20'
    },
    { 
      label: 'Pending Tasks', 
      value: '2', 
      change: '-1', 
      trend: 'down', 
      icon: ClipboardCheck, 
      color: 'from-amber-500 to-orange-500',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/20'
    }
  ];

  // Insights data
  const insights = [
    {
      type: 'warning',
      title: 'Low Post-Lunch Attendance',
      message: 'CS203 shows 15% lower attendance in post-lunch sessions.',
      action: 'Review Schedule',
      icon: AlertCircle,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/30'
    },
    {
      type: 'success',
      title: 'High Engagement Alert',
      message: 'Your Data Structures class has 95% attendance consistently.',
      action: 'View Details',
      icon: CheckCircle,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/30'
    },
    {
      type: 'alert',
      title: 'Students Need Attention',
      message: '5 students have missed 3+ consecutive classes.',
      action: 'See List',
      icon: XCircle,
      color: 'text-red-400',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/30'
    }
  ];

  const handleStartAttendance = (classItem) => {
    navigate('/faculty/attendance', { state: { class: classItem } });
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-slate-300 text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div 
            key={idx} 
            className={`${stat.bgColor} backdrop-blur-sm rounded-2xl p-6 border ${stat.borderColor} transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-black/20`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400 font-medium">{stat.label}</p>
                <p className="text-3xl font-bold text-white mt-2">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center`}>
                <stat.icon className="text-white" size={24} />
              </div>
            </div>
            <div className="flex items-center gap-2 mt-4">
              {stat.trend === 'up' ? (
                <ArrowUpRight size={16} className="text-emerald-400" />
              ) : (
                <ArrowDownRight size={16} className="text-red-400" />
              )}
              <span className={`text-sm font-medium ${stat.trend === 'up' ? 'text-emerald-400' : 'text-red-400'}`}>
                {stat.change} from yesterday
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Today's Classes & Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Today's Classes */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-white flex items-center gap-2">
              <CalendarIcon className="text-blue-400" size={24} />
              Today's Schedule
            </h3>
            <span className="text-sm text-slate-400">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </span>
          </div>
          
          <div className="space-y-4">
            {todayClasses.map((classItem) => (
              <div 
                key={classItem.id} 
                className={`bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border transition-all duration-300 hover:border-blue-500/30 ${
                  classItem.status === 'completed' 
                    ? 'border-slate-700/50' 
                    : 'border-blue-500/30 bg-gradient-to-r from-blue-500/5 to-cyan-500/5'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl font-bold text-white">{classItem.courseCode}</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        classItem.status === 'completed' 
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-blue-500/20 text-blue-400'
                      }`}>
                        {classItem.status === 'completed' ? 'Completed' : 'Upcoming'}
                      </span>
                      {classItem.lowEngagement && (
                        <span className="px-2 py-1 bg-amber-500/20 text-amber-400 text-xs rounded-full">
                          Low Engagement
                        </span>
                      )}
                    </div>
                    <h4 className="text-lg font-semibold text-white mb-1">{classItem.courseName}</h4>
                    <p className="text-slate-400 text-sm">
                      {classItem.time} • {classItem.room}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">
                        {classItem.attendanceRate}%
                      </div>
                      <div className="text-xs text-slate-400">Attendance</div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-4 border-t border-slate-700/50">
                  <div className="flex items-center gap-6">
                    <div>
                      <p className="text-sm text-slate-400">Students</p>
                      <p className="text-white font-medium">
                        {classItem.presentCount}/{classItem.totalStudents}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">Status</p>
                      <p className={`text-sm font-medium ${
                        classItem.attendanceRate >= 90 ? 'text-emerald-400' :
                        classItem.attendanceRate >= 75 ? 'text-amber-400' :
                        'text-red-400'
                      }`}>
                        {classItem.attendanceRate >= 90 ? 'Excellent' :
                         classItem.attendanceRate >= 75 ? 'Good' : 'Needs Attention'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    {classItem.status === 'upcoming' ? (
                      <button
                        onClick={() => handleStartAttendance(classItem)}
                        className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-blue-500/20 transition-all flex items-center gap-2"
                      >
                        <PlayCircle size={18} />
                        Start Attendance
                      </button>
                    ) : (
                      <button
                        onClick={() => navigate(`/faculty/classes/${classItem.id}`)}
                        className="px-6 py-2 bg-slate-700/50 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                      >
                        <Eye size={18} />
                        View Details
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Insights & Quick Actions */}
        <div className="space-y-6">
          {/* Insights */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Zap className="text-amber-400" size={24} />
                AI Insights
              </h3>
              <button className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors">
                <RefreshCw size={18} className="text-slate-400" />
              </button>
            </div>
            
            <div className="space-y-4">
              {insights.map((insight, idx) => (
                <div 
                  key={idx} 
                  className={`${insight.bgColor} rounded-xl p-4 border ${insight.borderColor}`}
                >
                  <div className="flex items-start gap-3">
                    <insight.icon className={`mt-1 ${insight.color}`} size={20} />
                    <div className="flex-1">
                      <h4 className="text-white font-semibold text-sm mb-1">{insight.title}</h4>
                      <p className="text-slate-300 text-xs mb-3">{insight.message}</p>
                      <button className="text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1">
                        {insight.action}
                        <ExternalLink size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
            <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-3 bg-slate-700/30 hover:bg-slate-700/50 rounded-lg transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <FileText size={16} className="text-blue-400" />
                  </div>
                  <span className="text-sm text-white">Generate Report</span>
                </div>
                <ExternalLink size={16} className="text-slate-400 group-hover:text-blue-400" />
              </button>
              
              <button className="w-full flex items-center justify-between p-3 bg-slate-700/30 hover:bg-slate-700/50 rounded-lg transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <TrendingUp size={16} className="text-purple-400" />
                  </div>
                  <span className="text-sm text-white">View Analytics</span>
                </div>
                <ExternalLink size={16} className="text-slate-400 group-hover:text-purple-400" />
              </button>
              
              <button className="w-full flex items-center justify-between p-3 bg-slate-700/30 hover:bg-slate-700/50 rounded-lg transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                    <SettingsIcon size={16} className="text-emerald-400" />  {/* Fixed here */}
                  </div>
                  <span className="text-sm text-white">Attendance Settings</span>
                </div>
                <ExternalLink size={16} className="text-slate-400 group-hover:text-emerald-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboard;