import React, { useState } from 'react';
import { Users,Target, Calendar, AlertTriangle, Activity, TrendingDown, TrendingUp, BarChart3, Clock } from 'lucide-react';


export default function Analytics() {
  const [timeRange, setTimeRange] = useState('week');
  const [selectedMetric, setSelectedMetric] = useState('overview');

  // Sample data - replace with real API calls
  const kpiData = {
    classroomUtilization: 68,
    facultyEfficiency: 72,
    attendanceRate: 81,
    timeWastage: 15
  };

  const idleClassrooms = [
    { room: 'Room A-101', idleHours: 12, peakSlots: '10-12 AM, 2-4 PM' },
    { room: 'Room B-203', idleHours: 8, peakSlots: '9-11 AM' },
    { room: 'Lab C-305', idleHours: 15, peakSlots: '1-3 PM' }
  ];

  const facultyWorkload = [
    { name: 'Dr. Smith', classes: 18, idle: 6, overlap: 2, efficiency: 85 },
    { name: 'Prof. Johnson', classes: 12, idle: 12, overlap: 0, efficiency: 65 },
    { name: 'Dr. Williams', classes: 20, idle: 3, overlap: 1, efficiency: 92 },
    { name: 'Prof. Brown', classes: 8, idle: 16, overlap: 0, efficiency: 48 }
  ];

  const attendanceTrends = [
    { course: 'CS-101', avg: 89, trend: 'up', change: 5 },
    { course: 'CS-201', avg: 72, trend: 'down', change: -8 },
    { course: 'CS-301', avg: 68, trend: 'down', change: -12 },
    { course: 'MATH-101', avg: 91, trend: 'up', change: 3 }
  ];

  const alerts = [
    { type: 'critical', message: 'CS-301 attendance below 75% threshold', time: '2 hours ago' },
    { type: 'warning', message: '3 classrooms idle during peak hours', time: '1 day ago' },
    { type: 'info', message: 'Faculty overlap detected in schedule', time: '2 days ago' }
  ];

  return (
    <div className="space-y-6">
      {/* Top Controls */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {['overview', 'wastage', 'utilization', 'faculty'].map((metric) => (
            <button
              key={metric}
              onClick={() => setSelectedMetric(metric)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedMetric === metric
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              {metric.charAt(0).toUpperCase() + metric.slice(1)}
            </button>
          ))}
        </div>
        
        <div className="flex gap-2">
          {['day', 'week', 'month'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                timeRange === range
                  ? 'bg-slate-700 text-white'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700/50">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <Target className="text-blue-400" size={24} />
            </div>
            <span className="text-xs text-slate-400">vs last {timeRange}</span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">{kpiData.classroomUtilization}%</h3>
          <p className="text-sm text-slate-400">Classroom Utilization</p>
          <div className="mt-3 flex items-center gap-2">
            <TrendingUp size={16} className="text-green-400" />
            <span className="text-sm text-green-400">+5%</span>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700/50">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-500/20 rounded-lg">
              <Users className="text-purple-400" size={24} />
            </div>
            <span className="text-xs text-slate-400">vs last {timeRange}</span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">{kpiData.facultyEfficiency}%</h3>
          <p className="text-sm text-slate-400">Faculty Efficiency</p>
          <div className="mt-3 flex items-center gap-2">
            <TrendingUp size={16} className="text-green-400" />
            <span className="text-sm text-green-400">+3%</span>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700/50">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-500/20 rounded-lg">
              <Activity className="text-green-400" size={24} />
            </div>
            <span className="text-xs text-slate-400">vs last {timeRange}</span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">{kpiData.attendanceRate}%</h3>
          <p className="text-sm text-slate-400">Attendance Rate</p>
          <div className="mt-3 flex items-center gap-2">
            <TrendingDown size={16} className="text-red-400" />
            <span className="text-sm text-red-400">-2%</span>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700/50">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-500/20 rounded-lg">
              <Clock className="text-orange-400" size={24} />
            </div>
            <span className="text-xs text-slate-400">hours/{timeRange}</span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">{kpiData.timeWastage}h</h3>
          <p className="text-sm text-slate-400">Time Wastage</p>
          <div className="mt-3 flex items-center gap-2">
            <TrendingDown size={16} className="text-green-400" />
            <span className="text-sm text-green-400">-4h improvement</span>
          </div>
        </div>
      </div>

      {/* Alerts Section */}
      <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700/50">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="text-orange-400" size={24} />
          <h3 className="text-xl font-bold text-white">Critical Alerts</h3>
        </div>
        <div className="space-y-3">
          {alerts.map((alert, idx) => (
            <div key={idx} className={`p-4 rounded-lg border ${
              alert.type === 'critical' ? 'bg-red-500/10 border-red-500/30' :
              alert.type === 'warning' ? 'bg-orange-500/10 border-orange-500/30' :
              'bg-blue-500/10 border-blue-500/30'
            }`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-white font-medium">{alert.message}</p>
                  <p className="text-xs text-slate-400 mt-1">{alert.time}</p>
                </div>
                <button className="px-3 py-1 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs text-white transition-colors">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Area - Changes based on selected metric */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Idle Classrooms */}
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700/50">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">Idle Classrooms</h3>
            <BarChart3 className="text-slate-400" size={20} />
          </div>
          <div className="space-y-4">
            {idleClassrooms.map((room, idx) => (
              <div key={idx} className="p-4 bg-slate-700/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-white">{room.room}</span>
                  <span className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-xs font-medium">
                    {room.idleHours}h idle
                  </span>
                </div>
                <p className="text-sm text-slate-400">Peak availability: {room.peakSlots}</p>
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-400">Utilization</span>
                    <span className="text-slate-300">{Math.round((24-room.idleHours)/24*100)}%</span>
                  </div>
                  <div className="w-full bg-slate-600 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                      style={{ width: `${Math.round((24-room.idleHours)/24*100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Faculty Workload */}
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700/50">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">Faculty Workload</h3>
            <Users className="text-slate-400" size={20} />
          </div>
          <div className="space-y-4">
            {facultyWorkload.map((faculty, idx) => (
              <div key={idx} className="p-4 bg-slate-700/50 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold text-white">{faculty.name}</span>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      faculty.efficiency >= 80 ? 'bg-green-500/20 text-green-400' :
                      faculty.efficiency >= 60 ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {faculty.efficiency}% efficient
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 text-sm">
                  <div>
                    <p className="text-slate-400">Classes</p>
                    <p className="text-white font-semibold">{faculty.classes}/week</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Idle Hours</p>
                    <p className="text-white font-semibold">{faculty.idle}h</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Overlaps</p>
                    <p className={`font-semibold ${faculty.overlap > 0 ? 'text-red-400' : 'text-green-400'}`}>
                      {faculty.overlap}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Attendance Trends */}
      <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700/50">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Attendance Trends by Course</h3>
          <Calendar className="text-slate-400" size={20} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {attendanceTrends.map((course, idx) => (
            <div key={idx} className="p-4 bg-slate-700/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-white">{course.course}</span>
                {course.trend === 'up' ? (
                  <TrendingUp size={16} className="text-green-400" />
                ) : (
                  <TrendingDown size={16} className="text-red-400" />
                )}
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-white">{course.avg}%</span>
                <span className={`text-sm ${course.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                  {course.change > 0 ? '+' : ''}{course.change}%
                </span>
              </div>
              <div className="mt-3">
                <div className="w-full bg-slate-600 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${course.avg >= 75 ? 'bg-green-500' : 'bg-red-500'}`}
                    style={{ width: `${course.avg}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-xl rounded-xl p-6 border border-blue-500/30">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-blue-500/20 rounded-lg">
            <Target className="text-blue-400" size={24} />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white mb-2">AI Recommendations</h3>
            <ul className="space-y-2 text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">•</span>
                <span>Reassign Room A-101 idle slots to high-demand courses to improve utilization by 12%</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">•</span>
                <span>Distribute Prof. Brown's workload to reduce idle hours and improve efficiency</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">•</span>
                <span>CS-301 requires intervention - attendance dropped 12% in the last week</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
