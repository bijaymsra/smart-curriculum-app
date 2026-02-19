import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {  AlertCircle,ClipboardCheck,Percent, TrendingUp, PlayCircle, RefreshCw, FileText, Zap, ArrowUpRight, ArrowDownRight, Calendar as CalendarIcon, ExternalLink, CheckCircle, XCircle, Eye } from 'lucide-react';
import API_BASE from "../../config/api";
import { authFetch } from "../../utils/authFetch";


const FacultyDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [insights, setInsights] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [aiRecommendations, setAiRecommendations] = useState([]);


  // Logic to determine what to show
  const classesToShow = isExpanded 
    ? dashboardData?.todayClasses 
    : dashboardData?.todayClasses?.slice(0, 1);

  const hasMoreClasses = (dashboardData?.todayClasses?.length || 0) > 1;


  useEffect(() => {
    const facultyId = sessionStorage.getItem("facultyId");
    if (!facultyId) {
      navigate("/login");
    }
  }, [navigate]);


useEffect(() => {
  const fetchDashboard = async () => {
    try {

      const res = await authFetch(`${API_BASE}/api/faculty/dashboard`);


      if (!res.ok) throw new Error("Failed to fetch dashboard");

      const data = await res.json();
      console.log("Dashboard API:", data);

      setDashboardData(data);

    } catch (err) {
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchDashboard();
}, []);


useEffect(() => {
  const fetchInsights = async () => {
    try {
      const res = await authFetch(
        `${API_BASE}/api/faculty/dashboard/insights`
      );

      if (!res.ok) throw new Error("Failed to fetch insights");

      const data = await res.json();
      setInsights(data);

    } catch (err) {
      console.error("Insights error:", err);
    }
  };

  fetchInsights();
}, []);


useEffect(() => {
  const fetchAIRecommendations = async () => {
    try {
      const facultyId = sessionStorage.getItem("facultyId");
      if (!facultyId) return;

      const res = await authFetch(
        `${API_BASE}/ai/test/faculty/${facultyId}/recommend`
      );

      if (!res.ok) throw new Error("Failed to fetch AI recommendations");

      const data = await res.json();
      setAiRecommendations(data);

    } catch (err) {
      console.error("AI Recommendation error:", err);
    }
  };

  fetchAIRecommendations();
}, []);



  // Insights data , will use script for this :
const getInsightStyle = (type) => {
  switch (type) {
    case "success":
      return {
        icon: CheckCircle,
        color: "text-emerald-400",
        bgColor: "bg-emerald-500/10",
        borderColor: "border-emerald-500/30"
      };
    case "warning":
      return {
        icon: AlertCircle,
        color: "text-amber-400",
        bgColor: "bg-amber-500/10",
        borderColor: "border-amber-500/30"
      };
    case "alert":
      return {
        icon: XCircle,
        color: "text-red-400",
        bgColor: "bg-red-500/10",
        borderColor: "border-red-500/30"
      };
    default:
      return {};
  }
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

const stats = dashboardData
  ? [
      {
        label: "Today's Lectures",
        value: dashboardData.todayClassesCount,
        icon: CalendarIcon,
        color: "from-blue-500 to-cyan-500",
        bgColor: "bg-blue-500/10",
        borderColor: "border-blue-500/20"
      },
      {
        label: "Lectures Conducted",
        value: dashboardData.totalSessionsConducted,
        icon: ClipboardCheck,
        color: "from-purple-500 to-pink-500",
        bgColor: "bg-purple-500/10",
        borderColor: "border-purple-500/20"
      },
      {
        label: "Active Session",
        value: dashboardData.activeSession ? "Yes" : "No",
        icon: PlayCircle,
        color: "from-emerald-500 to-green-500",
        bgColor: "bg-emerald-500/10",
        borderColor: "border-emerald-500/20"
      },
      {
        label: "Profile Completion",
        value: dashboardData.profileCompletionPercentage + "%",
        icon: Percent,
        color: "from-amber-500 to-orange-500",
        bgColor: "bg-amber-500/10",
        borderColor: "border-amber-500/20"
      }
    ]
  : [];

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
      {/* Map through the sliced array instead of the full one */}
      {classesToShow?.map((classItem, idx) => (
        <div 
          key={classItem.timetableId || idx}
          className={`bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border transition-all duration-300 hover:border-blue-500/30 ${
            classItem.status === 'completed' 
              ? 'border-slate-700/50' 
              : 'border-blue-500/30 bg-gradient-to-r from-blue-500/5 to-cyan-500/5'
          }`}
        >
          {/* ... Your existing class card content ... */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl font-bold text-white">{classItem.subjectCode}</span>
              </div>
              <h4 className="text-lg font-semibold text-white mb-1">{classItem.subjectName}</h4>
              <p className="text-slate-400 text-sm">
                {classItem.time} • {classItem.roomCode}
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">
                  <div className="text-sm text-slate-400">Scheduled Class</div>
                </div>
                <div className="text-xs text-slate-400">Attendance</div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-4 border-t border-slate-700/50">
            <div className="flex items-center gap-6"></div>
            
            <div className="flex gap-3">
                <button
                  onClick={() => navigate('/faculty/attendance')}
                  className="px-6 py-2 bg-slate-700/50 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <Eye size={18} />
                  View Details
                </button>
            </div>
          </div>
        </div>
      ))}

      {/* View All / Show Less Toggle Button */}
      {hasMoreClasses && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full py-3 mt-2 border border-dashed border-slate-700 hover:border-blue-500/50 hover:bg-blue-500/5 text-slate-400 hover:text-blue-400 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 text-sm font-medium"
        >
          {isExpanded ? (
            <>Show Less</>
          ) : (
            <>View All Classes ({dashboardData.todayClasses.length - 1} more)</>
          )}
        </button>
      )}
    </div>
  </div>

        {/* Insights & Quick Actions */}
        <div className="space-y-6">
          {/* Insights */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Zap className="text-amber-400" size={24} />
                Smart Insights
              </h3>
              <button className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors">
                <RefreshCw size={18} className="text-slate-400" />
              </button>
            </div>
            
            <div className="space-y-4">
              {insights.map((insight, idx) => {
                const style = getInsightStyle(insight.type);
                const Icon = style.icon;

                return (
                  <div key={idx} className={`${style.bgColor} rounded-xl p-4 border ${style.borderColor}`}>
                    <div className="flex items-start gap-3">
                      <Icon className={`mt-1 ${style.color}`} size={20} />

                      <div className="flex-1">
                        <h4 className="text-white font-semibold text-sm mb-1">{insight.title}</h4>
                        <p className="text-slate-300 text-xs mb-3">{insight.message}</p>
                      {/* Dynamic Status Badge */}
                        <div className="flex">
                          <div className={`flex items-center gap-2 px-2.5 py-1 rounded-full select-none backdrop-blur-md border ${style.bgColor} ${style.borderColor}`}>
                            <span className="relative flex h-2 w-2">
                              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${style.color.replace('text', 'bg')}`}></span>
                              <span className={`relative inline-flex rounded-full h-2 w-2 ${style.color.replace('text', 'bg')}`}></span>
                            </span>
                            <span className={`text-[10px] font-bold uppercase tracking-widest ${style.color}`}>
                              {insight.action}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* AI Timetable Intelligence */}
          {aiRecommendations.length > 0 && (
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
              <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
                <TrendingUp className="text-indigo-400" size={22} />
                Smart Intelligence
              </h3>

              <div className="space-y-4">
                {aiRecommendations.map((rec, idx) => {

                  let style = {
                    bg: "bg-indigo-500/10",
                    border: "border-indigo-500/30",
                    text: "text-indigo-400",
                    icon: TrendingUp
                  };

                  if (rec.severity === "ALERT") {
                    style = {
                      bg: "bg-red-500/10",
                      border: "border-red-500/30",
                      text: "text-red-400",
                      icon: AlertCircle
                    };
                  }

                  if (rec.severity === "SUGGESTION") {
                    style = {
                      bg: "bg-amber-500/10",
                      border: "border-amber-500/30",
                      text: "text-amber-400",
                      icon: ClipboardCheck
                    };
                  }

                  const Icon = style.icon;

                  return (
                    <div
                      key={idx}
                      className={`${style.bg} border ${style.border} rounded-xl p-4`}
                    >
                      <div className="flex items-start gap-3">
                        <Icon className={`${style.text} mt-1`} size={20} />
                        <div>
                          <p className="text-white text-sm font-medium">
                            {rec.message}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

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
              
              <button 
                onClick={() => navigate('/faculty/analytics')}
                className="w-full flex items-center justify-between p-3 bg-slate-700/30 hover:bg-slate-700/50 rounded-lg transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <TrendingUp size={16} className="text-purple-400" />
                  </div>
                  <span className="text-sm text-white">View Analytics</span>
                </div>
                <ExternalLink size={16} className="text-slate-400 group-hover:text-purple-400" />
              </button>
              
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default FacultyDashboard;