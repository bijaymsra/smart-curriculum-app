import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Award, Zap, TrendingUp, Users, Clock, AlertCircle, ChevronRight, Target as TargetIcon} from "lucide-react";
import API_BASE from "../../config/api";
import { authFetch } from "../../utils/authFetch";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    attendance: 0,
    streak: 0,
    points: 0,
    level: "NA",
    rank: 0,
    totalStudents: 0
  });
  const [todaySchedule, setTodaySchedule] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [upcomingTasks, setUpcomingTasks] = useState([]);

  useEffect(() => {
    // Initialize student data
    const studentData = {
      id: sessionStorage.getItem("studentId"),
      registrationNo: sessionStorage.getItem("studentRegistrationNo"),
      fullName: sessionStorage.getItem("studentName"),
      status: sessionStorage.getItem("studentStatus"),
      department: sessionStorage.getItem("studentDepartment") || "Computer Science",
      year: sessionStorage.getItem("studentYear") || "3rd Year",
      institutionName: sessionStorage.getItem("institutionName")
    };

    if (!studentData.id) {
      navigate("/login");
      return;
    }

    setStudent(studentData);
    loadDashboardData();
  }, [navigate]);

  const loadDashboardData = async () => {
    try {
      // Load today's schedule
      const today = new Date().toLocaleString('en-US', { weekday: 'long' }).toUpperCase();
      const scheduleRes = await authFetch(`${API_BASE}/api/student/schedule/${today}`);
      
      if (scheduleRes.ok) {
        const scheduleData = await scheduleRes.json();
        setTodaySchedule(scheduleData);
      }

      // Load attendance stats
      const statsRes = await authFetch(`${API_BASE}/api/student/attendance/stats`);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(prev => ({ ...prev, ...statsData }));
      }

      // Load recommendations
      const recRes = await authFetch(`${API_BASE}/api/student/recommendations`);

      if (recRes.ok) {
        const recData = await recRes.json();
        setRecommendations(recData);
      }

      // Load tasks
      const tasksRes = await authFetch(`${API_BASE}/api/student/tasks/upcoming`);

      if (tasksRes.ok) {
        const tasksData = await tasksRes.json();
        setUpcomingTasks(tasksData);
      }

    } catch (error) {
      console.error("Error loading dashboard data:", error);
      // Use mock data if API fails
      loadMockData();
    } finally {
      setLoading(false);
      // setTimeout(initCharts, 100);
    }
  };



  const loadMockData = () => {
    setTodaySchedule([
      { id: 0, subject: "NA", time: "NA", room: "NA", status: "completed" }
    ]);

    setRecommendations([
      { id: 1, title: "NA", description: "NA", priority: "NA", category: "NA" }
    ]);

    setUpcomingTasks([
      { id: 1, title: "NA", dueDate: "NA", priority: "NA", completed: false },
    ]);
  };


  const handleScanAttendance = () => {
    navigate("/student/attendance");
  };

  const handleJoinClass = (classId) => {
    console.log("Joining class:", classId);
    // Implement class joining logic
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-slate-300 text-lg">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Attendance Card */}
        <div className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 backdrop-blur-sm rounded-2xl p-6 border border-emerald-700/30 group hover:scale-[1.02] transition-transform duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Attendance Score</p>
              <p className="text-3xl font-bold mt-2 text-emerald-400">{stats.attendance}%</p>
            </div>
            <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center group-hover:bg-emerald-500/30">
              <TrendingUp className="text-emerald-400" size={24} />
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-slate-700/50 rounded-full h-2">
              <div 
                className="h-2 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full transition-all duration-500"
                style={{ width: `${stats.attendance}%` }}
              />
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Above 75% requirement • +2% from last week
            </p>
          </div>
        </div>

        {/* Streak Card */}
        <div className="bg-gradient-to-br from-amber-900/20 to-orange-900/20 backdrop-blur-sm rounded-2xl p-6 border border-amber-700/30 group hover:scale-[1.02] transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Current Streak</p>
              <p className="text-3xl font-bold mt-2 text-amber-400">{stats.streak} days</p>
            </div>
            <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center group-hover:bg-amber-500/30">
              <Zap className="text-amber-400" size={24} />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center gap-2">
              {[...Array(7)].map((_, i) => (
                <div 
                  key={i} 
                  className={`flex-1 h-2 rounded-full transition-all ${
                    i < stats.streak 
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500' 
                      : 'bg-slate-700/50'
                  }`}
                />
              ))}
            </div>
            <p className="text-xs text-slate-400 mt-2">
              {7 - stats.streak} more days for bonus points!
            </p>
          </div>
        </div>

        {/* Points & Level Card */}
        <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 backdrop-blur-sm rounded-2xl p-6 border border-purple-700/30 group hover:scale-[1.02] transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Points & Level</p>
              <div className="flex items-baseline gap-2 mt-2">
                <p className="text-3xl font-bold text-purple-400">{stats.points}</p>
                <span className="text-sm text-slate-400">points</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center group-hover:bg-purple-500/30">
              <Award className="text-purple-400" size={24} />
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-slate-700/50 rounded-full h-2">
              <div 
                className="h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                style={{ width: `${(stats.points % 1000) / 10}%` }}
              />
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Level <span className="text-amber-400 font-semibold">{stats.level}</span> • {1000 - (stats.points % 1000)} to next level
            </p>
          </div>
        </div>

        {/* Class Rank Card */}
        <div className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 backdrop-blur-sm rounded-2xl p-6 border border-blue-700/30 group hover:scale-[1.02] transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Class Rank</p>
              <p className="text-3xl font-bold mt-2 text-blue-400">#{stats.rank}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center group-hover:bg-blue-500/30">
              <Users className="text-blue-400" size={24} />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Top 10%</span>
              <span className="text-blue-400">Out of {stats.totalStudents}</span>
            </div>
            <div className="w-full bg-slate-700/50 rounded-full h-2 mt-1">
              <div 
                className="h-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                style={{ width: `${(stats.rank / stats.totalStudents) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Charts & Schedule Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Today's Schedule */}
        <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold text-white">Today's Schedule</h3>
              <p className="text-sm text-slate-400">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <Clock className="text-slate-500" size={20} />
          </div>
          
          <div className="space-y-3">
            {todaySchedule.map((classItem) => (
              <div 
                key={classItem.id} 
                className={`p-4 rounded-xl border transition-all ${
                  classItem.status === 'completed' 
                    ? 'bg-slate-800/50 border-slate-700/50' 
                    : classItem.status === 'upcoming'
                    ? 'bg-gradient-to-r from-blue-500/5 to-cyan-500/5 border-blue-500/30 hover:border-blue-500/50'
                    : 'bg-gradient-to-r from-emerald-500/5 to-green-500/5 border-emerald-500/30 hover:border-emerald-500/50'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-white">{classItem.subject}</p>
                    <p className="text-sm text-slate-400 mt-1">{classItem.time} • {classItem.room}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    classItem.status === 'completed' 
                      ? 'bg-slate-700 text-slate-400'
                      : classItem.status === 'upcoming'
                      ? 'bg-blue-500/20 text-blue-400'
                      : 'bg-emerald-500/20 text-emerald-400'
                  }`}>
                    {classItem.status === 'completed' ? 'Completed' : 
                     classItem.status === 'upcoming' ? 'Upcoming' : 'In Progress'}
                  </span>
                </div>
                {classItem.status === 'upcoming' && (
                  <button
                    onClick={() => handleJoinClass(classItem.id)}
                    className="mt-3 w-full py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                  >
                    Join Class
                  </button>
                )}
              </div>
            ))}
          </div>
          
          <button className="w-full mt-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
            View Full Schedule
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Recommendations & Tasks Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Recommendations */}
        <div className="lg:col-span-2 bg-slate-800/30 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold text-white">AI Recommendations</h3>
              <p className="text-sm text-slate-400">Personalized suggestions based on your patterns</p>
            </div>
            <TargetIcon className="text-amber-400" size={24} />
          </div>
          
          <div className="space-y-4">
            {recommendations.map((rec) => (
              <div 
                key={rec.id} 
                className={`p-4 rounded-xl border ${
                  rec.priority === 'high' 
                    ? 'bg-gradient-to-r from-red-500/5 to-rose-500/5 border-red-500/30'
                    : rec.priority === 'medium'
                    ? 'bg-gradient-to-r from-amber-500/5 to-orange-500/5 border-amber-500/30'
                    : 'bg-gradient-to-r from-blue-500/5 to-cyan-500/5 border-blue-500/30'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 text-xs rounded ${
                        rec.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                        rec.priority === 'medium' ? 'bg-amber-500/20 text-amber-400' :
                        'bg-blue-500/20 text-blue-400'
                      }`}>
                        {rec.priority.toUpperCase()} PRIORITY
                      </span>
                      <span className="text-xs text-slate-400">{rec.category}</span>
                    </div>
                    <h4 className="font-semibold text-white">{rec.title}</h4>
                    <p className="text-sm text-slate-400 mt-1">{rec.description}</p>
                  </div>
                  <button className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
                    Accept
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Tasks */}
        <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold text-white">Upcoming Tasks</h3>
              <p className="text-sm text-slate-400">Assignments & deadlines</p>
            </div>
            <AlertCircle className="text-amber-400" size={24} />
          </div>
          
          <div className="space-y-3">
            {upcomingTasks.map((task) => (
              <div key={task.id} className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                <div className="flex items-start gap-3">
                  <input 
                    type="checkbox" 
                    checked={task.completed}
                    onChange={() => {}}
                    className="mt-1 w-4 h-4 rounded border-slate-600"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className={`font-medium ${task.completed ? 'line-through text-slate-500' : 'text-white'}`}>
                        {task.title}
                      </h4>
                      <span className={`px-2 py-1 text-xs rounded ${
                        task.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                        task.priority === 'medium' ? 'bg-amber-500/20 text-amber-400' :
                        'bg-blue-500/20 text-blue-400'
                      }`}>
                        {task.priority}
                      </span>
                    </div>
                    <p className="text-sm text-slate-400 mt-1">Due: {task.dueDate}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <button className="w-full mt-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
            View All Tasks
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;