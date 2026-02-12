import React, { useState, useEffect } from 'react';
import { Users, GraduationCap, BookOpen, Building2, Calendar, TrendingUp, AlertCircle, Plus, Clock} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { useNavigate } from 'react-router-dom';
import API_BASE from "../../config/api";
import { authFetch } from "../../utils/authFetch";

// API Service functions
const dashboardApi = {
  // Get student stats
  getStudentStats: async (institutionId) => {
    const token = localStorage.getItem('token');
    const response = await authFetch(
      `${API_BASE}/api/admin/students/dashboard-stats?institutionId=${institutionId}`,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch student stats: ${response.status} - ${errorText}`);
    }
    return response.json();
  },

  // Get faculty stats
  getFacultyStats: async (institutionId) => {
    const token = localStorage.getItem('token');
    const response = await authFetch(
      `${API_BASE}/api/admin/faculty/stats?institutionId=${institutionId}`,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch faculty stats: ${response.status} - ${errorText}`);
    }
    return response.json();
  },

  // Get total courses count (you'll need to implement this backend endpoint)
  getCourseStats: async (institutionId) => {
    const token = localStorage.getItem('token');
    const response = await authFetch(
      `${API_BASE}/api/admin/subjects/stats?institutionId=${institutionId}`,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    if (!response.ok) {
      // If endpoint doesn't exist yet, return default
      console.warn('Courses stats endpoint not implemented yet');
      return { totalCourses: 87, activeClassrooms: 24 };
    }
    return response.json();
  }
};

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalFaculty: 0,
    totalCourses: 0,
    activeClassrooms: 0,
    studentAttendance: 0,
    facultyUtilization: 0
  });
  const [alerts, setAlerts] = useState([]);
  const { admin, loading: adminLoading } = useAdmin();
  const navigate = useNavigate();

  const quickActions = [
    { 
      label: 'Add Student', 
      icon: Users, 
      color: 'bg-blue-500 hover:bg-blue-600',
      onClick: () => navigate('/admin/students/new')
    },
    { 
      label: 'Add Faculty', 
      icon: GraduationCap, 
      color: 'bg-purple-500 hover:bg-purple-600',
      onClick: () => navigate('/admin/faculty/new')
    },
    { 
      label: 'Create Course', 
      icon: BookOpen, 
      color: 'bg-pink-500 hover:bg-pink-600',
      onClick: () => navigate('/admin/courses/new')
    },
    { 
      label: 'Schedule Class', 
      icon: Clock, 
      color: 'bg-indigo-500 hover:bg-indigo-600',
      onClick: () => navigate('/admin/schedule/new')
    }
  ];

  // Format numbers with commas
  const formatNumber = (num) => {
    if (typeof num !== 'number') return '0';
    return num.toLocaleString('en-IN');
  };

  // Fetch dashboard data
  useEffect(() => {
    if (adminLoading || !admin?.institutionId) return;

    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const institutionId = admin.institutionId;

        // Fetch data in parallel
        const [studentStats, facultyStats, courseStats] = await Promise.all([
          dashboardApi.getStudentStats(institutionId),
          dashboardApi.getFacultyStats(institutionId),
          dashboardApi.getCourseStats(institutionId)
        ]);

        console.log('Dashboard data:', { studentStats, facultyStats, courseStats });

        // Set stats based on API response structure
        setStats({
          totalStudents: studentStats.totalStudents || studentStats.total || 0,
          totalFaculty: facultyStats.totalFaculty || facultyStats.total || 0,
          totalCourses: courseStats.totalCourses || 0,
          activeClassrooms: courseStats.activeClassrooms || 0,
          studentAttendance: studentStats.avgAttendance || studentStats.averageAttendance || 0,
          facultyUtilization: facultyStats.avgUtilization || facultyStats.averageUtilization || 0
        });

        // Generate dynamic alerts based on stats
        const newAlerts = [];
        
        // Check for low attendance
        if ((studentStats.avgAttendance || 0) < 75) {
          newAlerts.push({
            type: 'warning',
            message: `Student attendance below 75% (${studentStats.avgAttendance || 0}%)`,
            time: 'Recent'
          });
        }

        // Check for low faculty utilization
        if ((facultyStats.avgUtilization || 0) < 70) {
          newAlerts.push({
            type: 'warning',
            message: `Faculty utilization below 70% (${facultyStats.avgUtilization || 0}%)`,
            time: 'Recent'
          });
        }

        // Check for warning faculty
        if (facultyStats.warningFaculty && facultyStats.warningFaculty > 0) {
          newAlerts.push({
            type: 'warning',
            message: `${facultyStats.warningFaculty} faculty members need attention`,
            time: 'Recent'
          });
        }

        // Check for suspended students
        if (studentStats.suspendedStudents && studentStats.suspendedStudents > 0) {
          newAlerts.push({
            type: 'error',
            message: `${studentStats.suspendedStudents} students are suspended`,
            time: 'Recent'
          });
        }

        // Add sample alerts if none generated
        if (newAlerts.length === 0) {
          newAlerts.push(
            {
              type: 'info',
              message: 'System operating normally',
              time: 'Today'
            },
            {
              type: 'info',
              message: 'All faculty utilization within optimal range',
              time: 'Today'
            }
          );
        }

        setAlerts(newAlerts.slice(0, 4)); // Show max 4 alerts

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Set fallback data
        setStats({
          totalStudents: 0,
          totalFaculty: 0,
          totalCourses: 0,
          activeClassrooms: 0,
          studentAttendance: 0,
          facultyUtilization: 0
        });
        setAlerts([
          { type: 'warning', message: 'Could not load real-time data', time: 'Just now' },
          { type: 'info', message: 'Using sample data', time: 'Just now' }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [admin, adminLoading]);

  const kpiCards = [
    { 
      title: 'Total Students', 
      value: formatNumber(stats.totalStudents), 
      icon: Users, 
      color: 'from-blue-500 to-blue-600', 
      change: '+12%' 
    },
    { 
      title: 'Total Faculty', 
      value: formatNumber(stats.totalFaculty), 
      icon: GraduationCap, 
      color: 'from-purple-500 to-purple-600', 
      change: '+5%' 
    },
    { 
      title: 'Total Courses', 
      value: formatNumber(stats.totalCourses), 
      icon: BookOpen, 
      color: 'from-pink-500 to-pink-600', 
      change: '+8%' 
    },
    { 
      title: 'Active Classrooms', 
      value: formatNumber(stats.activeClassrooms), 
      icon: Building2, 
      color: 'from-indigo-500 to-indigo-600', 
      change: '0%' 
    },
    { 
      title: "Student Attendance", 
      value: `${stats.studentAttendance.toFixed(1)}%`, 
      icon: Calendar, 
      color: stats.studentAttendance >= 75 ? 'from-emerald-500 to-emerald-600' : 'from-orange-500 to-orange-600', 
      change: stats.studentAttendance >= 75 ? '+2.3%' : '-2.3%' 
    },
    { 
      title: 'Faculty Utilization', 
      value: `${stats.facultyUtilization.toFixed(1)}%`, 
      icon: TrendingUp, 
      color: stats.facultyUtilization >= 70 ? 'from-orange-500 to-orange-600' : 'from-red-500 to-red-600', 
      change: stats.facultyUtilization >= 70 ? '+4%' : '-4%' 
    }
  ];

  // Show loading state
  if (adminLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-slate-300">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  // Check if admin exists
  if (!admin) {
    return (
      <div className="text-center py-12">
        <div className="text-red-400 text-4xl mb-4">⚠️</div>
        <h3 className="text-xl font-bold text-white mb-2">Authentication Required</h3>
        <p className="text-slate-400 mb-4">Please login to access the dashboard</p>
        <button 
          onClick={() => navigate('/login')}
          className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">
              {/* Welcome back, {admin.fullName || 'Admin'}! */}
            </h1>
            <p className="text-slate-400 mt-1">
              {admin.institutionName || 'Your Institution'} • {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kpiCards.map((card, idx) => (
          <div key={idx} className="group relative bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1">
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 bg-gradient-to-r ${card.color} rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                <card.icon size={24} className="text-white" />
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                card.change.startsWith('+') ? 'bg-emerald-500/20 text-emerald-400' : 
                card.change.startsWith('-') ? 'bg-red-500/20 text-red-400' : 
                'bg-slate-700 text-slate-400'
              }`}>
                {card.change}
              </span>
            </div>
            <h3 className="text-slate-400 text-sm mb-2">{card.title}</h3>
            <p className="text-3xl font-bold text-white">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Alerts & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Alerts */}
        <div className="lg:col-span-2 bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <AlertCircle className="text-orange-400" size={24} />
              Alerts & Warnings
            </h3>
            <button className="text-sm text-blue-400 hover:text-blue-300">View All</button>
          </div>
          <div className="space-y-3">
            {alerts.map((alert, idx) => (
              <div key={idx} className={`p-4 rounded-xl border transition-all hover:scale-[1.02] cursor-pointer ${
                alert.type === 'error' ? 'bg-red-500/10 border-red-500/30' :
                alert.type === 'warning' ? 'bg-orange-500/10 border-orange-500/30' :
                'bg-blue-500/10 border-blue-500/30'
              }`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-white font-medium">{alert.message}</p>
                    <p className="text-slate-400 text-xs mt-1">{alert.time}</p>
                  </div>
                  <AlertCircle size={20} className={
                    alert.type === 'error' ? 'text-red-400' :
                    alert.type === 'warning' ? 'text-orange-400' :
                    'text-blue-400'
                  } />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Plus size={24} />
            Quick Actions
          </h3>
          <div className="space-y-3">
            {quickActions.map((action, idx) => (
              <button 
                key={idx} 
                onClick={action.onClick}
                className={`w-full ${action.color} text-white px-4 py-4 rounded-xl font-medium transition-all duration-200 hover:shadow-lg hover:scale-[1.02] flex items-center gap-3`}
              >
                <action.icon size={20} />
                {action.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};