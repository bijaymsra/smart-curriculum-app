import React, { useState, useEffect } from 'react';
import { Users, GraduationCap, BookOpen, TrendingUp, Calendar, BarChart3} from 'lucide-react';
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
    return response.json();
  },


    // AI - Institution Insight
    getAIInsight: async () => {
      const response = await authFetch(`${API_BASE}/ai/test/admin/insight`);
      return response.json();
    },

    // AI - Department Insights
    getAIDepartments: async (institutionId) => {
      const response = await authFetch(
        `${API_BASE}/ai/test/admin/departments/${institutionId}`
      );
      return response.json();
    },

    // AI - Timetable Efficiency
    getAIEfficiency: async () => {
      const response = await authFetch(
        `${API_BASE}/ai/test/admin/efficiency`
      );
      return response.json();
    },

    // AI - Student Risk
    getAIStudentRisk: async () => {
      const response = await authFetch(
        `${API_BASE}/ai/test/admin/student-risk`
      );
      return response.json();
    }

    };


export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalFaculty: 0,
    totalCourses: 0
  });
  const { admin, loading: adminLoading } = useAdmin();

  /* ===== NEW AI STATE ===== */
const [aiInsight, setAiInsight] = useState(null);
const [departmentInsights, setDepartmentInsights] = useState([]);
const [efficiency, setEfficiency] = useState(null);
const [riskSummary, setRiskSummary] = useState(null);


  const navigate = useNavigate();

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
        const [
          studentStats,
          facultyStats,
          courseStats
        ] = await Promise.all([
          dashboardApi.getStudentStats(institutionId),
          dashboardApi.getFacultyStats(institutionId),
          dashboardApi.getCourseStats(institutionId),
        ]);

        const [
          insight,
          departments,
          efficiencyData,
          riskData
        ] = await Promise.all([
          dashboardApi.getAIInsight(),
          dashboardApi.getAIDepartments(institutionId),
          dashboardApi.getAIEfficiency(),
          dashboardApi.getAIStudentRisk()
        ]);

        setAiInsight(insight);
        setDepartmentInsights(departments);
        setEfficiency(efficiencyData);
        setRiskSummary(riskData);


        console.log('Dashboard data:', { studentStats, facultyStats, courseStats });

        // Set stats based on API response structure
        setStats({
          totalStudents: studentStats.totalStudents || studentStats.total || 0,
          totalFaculty: facultyStats.totalFaculty || facultyStats.total || 0,
          totalCourses: courseStats.totalCourses || 0
        });

        setAiInsight(insight);
        setDepartmentInsights(departments || []);
        setEfficiency(efficiencyData);
        setRiskSummary(riskData);

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Set fallback data
        setStats({
          totalStudents: 0,
          totalFaculty: 0,
          totalCourses: 0
        });
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
    },
    { 
      title: 'Total Faculty', 
      value: formatNumber(stats.totalFaculty), 
      icon: GraduationCap, 
      color: 'from-purple-500 to-purple-600', 
    },
    { 
      title: 'Total Courses', 
      value: formatNumber(stats.totalCourses), 
      icon: BookOpen, 
      color: 'from-pink-500 to-pink-600', 
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


      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kpiCards.map((card, idx) => (
          <div key={idx} className="group relative bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1">
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 bg-gradient-to-r ${card.color} rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                <card.icon size={24} className="text-white" />
              </div>
            </div>
            <h3 className="text-slate-400 text-sm mb-2">{card.title}</h3>
            <p className="text-3xl font-bold text-white">{card.value}</p>
          </div>
        ))}
      </div>


    {/* Smart Intelligence */}
    {aiInsight && (
      <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <TrendingUp size={24} className="text-indigo-400" />
          Smart Overview
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="bg-slate-900/40 p-4 rounded-xl">
            <p className="text-slate-400 text-sm">Institution Attendance</p>
            <p className="text-2xl font-bold text-white">
              {aiInsight.institutionAttendanceAverage?.toFixed(1)}%
            </p>
          </div>

          <div className="bg-slate-900/40 p-4 rounded-xl">
            <p className="text-slate-400 text-sm">At-Risk Students</p>
            <p className="text-2xl font-bold text-red-400">
              {aiInsight.atRiskStudents}
            </p>
          </div>

          <div className="bg-slate-900/40 p-4 rounded-xl">
            <p className="text-slate-400 text-sm">Underutilized Faculty</p>
            <p className="text-2xl font-bold text-yellow-400">
              {aiInsight.underUtilizedFaculty}
            </p>
          </div>

        </div>
      </div>
    )}


    {efficiency && (
      <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
        <h3 className="text-xl font-bold text-white mb-6">
          Timetable Efficiency
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <p className="text-slate-400 text-sm">Efficiency Score</p>
            <p className="text-2xl font-bold text-emerald-400">
              {efficiency.efficiencyScore?.toFixed(1)}
            </p>
          </div>

          <div>
            <p className="text-slate-400 text-sm">Lunch Compliance</p>
            <p className="text-2xl font-bold text-indigo-400">
              {efficiency.lunchComplianceRate?.toFixed(1)}%
            </p>
          </div>

          <div>
            <p className="text-slate-400 text-sm">Overload Rate</p>
            <p className="text-2xl font-bold text-orange-400">
              {efficiency.overloadRate?.toFixed(1)}%
            </p>
          </div>

          <div>
            <p className="text-slate-400 text-sm">Average Gap</p>
            <p className="text-2xl font-bold text-white">
              {efficiency.averageGapMinutes?.toFixed(0)} min
            </p>
          </div>
        </div>
      </div>
    )}


    {departmentInsights.length > 0 && (
      <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
        <h3 className="text-xl font-bold text-white mb-6">
          Department Risk Analysis
        </h3>

        <div className="space-y-4">
          {departmentInsights.slice(0, 5).map((dept, idx) => (
            <div key={idx} className="flex justify-between items-center bg-slate-900/40 p-4 rounded-xl">
              <div>
                <p className="text-white font-medium">{dept.departmentName}</p>
                <p className="text-sm text-slate-400">
                  Faculty: {dept.facultyCount} • Students: {dept.studentCount}
                </p>
              </div>

              <span className={`px-3 py-1 rounded-full text-xs font-semibold
                ${dept.riskLevel === 'HIGH'
                  ? 'bg-red-500/20 text-red-400'
                  : dept.riskLevel === 'MEDIUM'
                  ? 'bg-yellow-500/20 text-yellow-400'
                  : 'bg-emerald-500/20 text-emerald-400'
                }`}>
                {dept.riskLevel}
              </span>
            </div>
          ))}
        </div>
      </div>
    )}

    </div>
  );
};