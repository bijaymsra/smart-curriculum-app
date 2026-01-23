import React, { useState } from 'react';
import { Calendar, CheckCircle, AlertTriangle, Activity, TrendingDown, TrendingUp, Clock, Search, Download } from 'lucide-react';


export default function Attendance () {
const [view, setView] = useState('live'); // 'live', 'history', 'analytics'
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Sample Live Attendance Data
  const [liveAttendance, setLiveAttendance] = useState([
    { id: 1, courseId: 'CS-101', section: 'A', faculty: 'Dr. Smith', room: 'Room 301', time: '9:00 AM - 10:30 AM', status: 'ongoing', present: 22, absent: 3, total: 25, startedAt: '9:02 AM', markedBy: 'Dr. Smith' },
    { id: 2, courseId: 'MATH-101', section: 'A', faculty: 'Prof. Williams', room: 'Room 205', time: '10:00 AM - 11:30 AM', status: 'completed', present: 48, absent: 4, total: 52, startedAt: '10:00 AM', markedBy: 'Prof. Williams' },
    { id: 3, courseId: 'CS-201', section: 'A', faculty: 'Dr. Johnson', room: 'Lab 101', time: '2:00 PM - 3:30 PM', status: 'upcoming', present: 0, absent: 0, total: 38, startedAt: '-', markedBy: '-' },
    { id: 4, courseId: 'PHY-101', section: 'B', faculty: 'Dr. Brown', room: 'Lab 205', time: '11:00 AM - 12:30 PM', status: 'late', present: 35, absent: 6, total: 41, startedAt: '11:15 AM', markedBy: 'Dr. Brown' }
  ]);

  // Attendance History
  const [attendanceHistory, setAttendanceHistory] = useState([
    { id: 1, date: '2026-01-14', courseId: 'CS-101', section: 'A', present: 23, absent: 2, total: 25, percentage: 92, markedBy: 'Dr. Smith', notes: '' },
    { id: 2, date: '2026-01-14', courseId: 'MATH-101', section: 'A', present: 48, absent: 4, total: 52, percentage: 92.3, markedBy: 'Prof. Williams', notes: '' },
    { id: 3, date: '2026-01-13', courseId: 'CS-101', section: 'A', present: 21, absent: 4, total: 25, percentage: 84, markedBy: 'Dr. Smith', notes: 'Raining, low attendance' },
    { id: 4, date: '2026-01-13', courseId: 'CS-201', section: 'A', present: 35, absent: 3, total: 38, percentage: 92.1, markedBy: 'Dr. Johnson', notes: '' },
    { id: 5, date: '2026-01-12', courseId: 'PHY-101', section: 'B', present: 38, absent: 3, total: 41, percentage: 92.7, markedBy: 'Dr. Brown', notes: '' }
  ]);

  // Alert/Warning Data
  const alerts = [
    { type: 'late', message: 'PHY-101 Section B started 15 minutes late', course: 'PHY-101', time: '11:15 AM' },
    { type: 'low', message: 'CS-101 Section A has only 88% attendance today', course: 'CS-101', time: '9:02 AM' },
    { type: 'proxy', message: 'Potential proxy detected in MATH-101', course: 'MATH-101', time: '10:05 AM' }
  ];

  // Analytics Data
  const analyticsData = {
    overallAttendance: 89.4,
    trend: 'up',
    trendValue: 2.3,
    chronicAbsentees: 12,
    punctualityScore: 87.5,
    topPerformers: [
      { courseId: 'MATH-101', percentage: 92.3 },
      { courseId: 'PHY-101', percentage: 92.7 },
      { courseId: 'CS-201', percentage: 92.1 }
    ],
    lowPerformers: [
      { courseId: 'CS-101', percentage: 84.0 },
      { courseId: 'ENG-101', percentage: 78.5 }
    ]
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'ongoing': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'late': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'upcoming': return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getAttendanceColor = (percentage) => {
    if (percentage >= 90) return 'text-green-400';
    if (percentage >= 75) return 'text-yellow-400';
    return 'text-red-400';
  };

  const filteredHistory = attendanceHistory.filter(record => {
    const matchesSearch = record.courseId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = record.date === selectedDate;
    return matchesSearch && matchesDate;
  });

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Today's Attendance</p>
              <h3 className="text-3xl font-bold text-white mt-2">92.4%</h3>
              <p className="text-green-400 text-xs mt-1 flex items-center gap-1">
                <TrendingUp size={12} />
                +3.2% from yesterday
              </p>
            </div>
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
              <CheckCircle className="text-green-400" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Classes Today</p>
              <h3 className="text-3xl font-bold text-white mt-2">24</h3>
              <p className="text-slate-400 text-xs mt-1">18 completed, 6 pending</p>
            </div>
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <Calendar className="text-blue-400" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 border border-orange-500/20 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Late Starts</p>
              <h3 className="text-3xl font-bold text-white mt-2">3</h3>
              <p className="text-orange-400 text-xs mt-1">Classes started late</p>
            </div>
            <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
              <Clock className="text-orange-400" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-500/10 to-red-600/5 border border-red-500/20 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Alerts</p>
              <h3 className="text-3xl font-bold text-white mt-2">{alerts.length}</h3>
              <p className="text-red-400 text-xs mt-1">Requires attention</p>
            </div>
            <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
              <AlertTriangle className="text-red-400" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Alerts Section */}
      {alerts.length > 0 && (
        <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="text-red-400" size={20} />
            <h3 className="text-lg font-semibold text-white">Active Alerts</h3>
          </div>
          <div className="space-y-3">
            {alerts.map((alert, idx) => (
              <div key={idx} className="flex items-center justify-between bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    alert.type === 'late' ? 'bg-orange-400' : 
                    alert.type === 'low' ? 'bg-yellow-400' : 
                    'bg-red-400'
                  }`}></div>
                  <div>
                    <p className="text-white font-medium">{alert.message}</p>
                    <p className="text-slate-400 text-xs mt-1">{alert.course} • {alert.time}</p>
                  </div>
                </div>
                <button className="px-4 py-2 bg-slate-700/50 hover:bg-slate-700 rounded-lg text-slate-300 text-sm transition-colors">
                  Review
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* View Toggle */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex gap-2 bg-slate-800/50 p-1.5 rounded-xl border border-slate-700/50">
          <button
            onClick={() => setView('live')}
            className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
              view === 'live'
                ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Live Status
          </button>
          <button
            onClick={() => setView('history')}
            className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
              view === 'history'
                ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            History
          </button>
          <button
            onClick={() => setView('analytics')}
            className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
              view === 'analytics'
                ? 'bg-green-500 text-white shadow-lg shadow-green-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Analytics
          </button>
        </div>

        <button className="flex items-center gap-2 px-6 py-3 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 text-white rounded-xl font-medium transition-all">
          <Download size={20} />
          Export Report
        </button>
      </div>

      {/* Content Area */}
      {view === 'live' && (
        <div className="space-y-4">
          {liveAttendance.map(record => (
            <div key={record.id} className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-6 hover:border-blue-500/30 transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-sm font-mono">{record.courseId}</span>
                  <span className="px-2 py-1 bg-slate-700/50 text-slate-300 rounded text-xs">Section {record.section}</span>
                  <span className={`px-3 py-1 rounded-lg text-xs font-medium border ${getStatusColor(record.status)}`}>
                    {record.status.toUpperCase()}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-slate-400 text-xs">Attendance</p>
                  <p className={`text-2xl font-bold ${getAttendanceColor((record.present / record.total) * 100)}`}>
                    {((record.present / record.total) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                <div>
                  <p className="text-slate-500 text-xs mb-1">Faculty</p>
                  <p className="text-slate-300 font-medium">{record.faculty}</p>
                </div>
                <div>
                  <p className="text-slate-500 text-xs mb-1">Room</p>
                  <p className="text-slate-300 font-medium">{record.room}</p>
                </div>
                <div>
                  <p className="text-slate-500 text-xs mb-1">Time</p>
                  <p className="text-slate-300 font-medium">{record.time}</p>
                </div>
                <div>
                  <p className="text-slate-500 text-xs mb-1">Started At</p>
                  <p className="text-slate-300 font-medium">{record.startedAt}</p>
                </div>
                <div>
                  <p className="text-slate-500 text-xs mb-1">Marked By</p>
                  <p className="text-slate-300 font-medium">{record.markedBy}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex-1 bg-slate-900/50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-400 text-xs">Present</span>
                    <span className="text-green-400 font-semibold">{record.present}</span>
                  </div>
                  <div className="w-full bg-slate-700/30 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-green-400 h-2 rounded-full transition-all"
                      style={{ width: `${(record.present / record.total) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="flex-1 bg-slate-900/50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-400 text-xs">Absent</span>
                    <span className="text-red-400 font-semibold">{record.absent}</span>
                  </div>
                  <div className="w-full bg-slate-700/30 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-red-500 to-red-400 h-2 rounded-full transition-all"
                      style={{ width: `${(record.absent / record.total) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {view === 'history' && (
        <div className="space-y-4">
          {/* Date Picker & Search */}
          <div className="flex gap-4 flex-wrap">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white focus:outline-none focus:border-blue-500/50"
            />
            <div className="flex-1 min-w-[300px] relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Search by course..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500/50"
              />
            </div>
          </div>

          {/* History Table */}
          <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-800/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Course</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Section</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Present</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Absent</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Percentage</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Marked By</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {filteredHistory.map(record => (
                    <tr key={record.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{record.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-sm font-mono">{record.courseId}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{record.section}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-400 font-medium">{record.present}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-red-400 font-medium">{record.absent}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm font-bold ${getAttendanceColor(record.percentage)}`}>
                          {record.percentage.toFixed(1)}%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{record.markedBy}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {view === 'analytics' && (
        <div className="space-y-6">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-slate-400 text-sm">Overall Attendance</h3>
                <Activity className="text-blue-400" size={20} />
              </div>
              <p className="text-4xl font-bold text-white mb-2">{analyticsData.overallAttendance}%</p>
              <p className={`text-sm flex items-center gap-1 ${analyticsData.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                {analyticsData.trend === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                {analyticsData.trendValue}% this week
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-slate-400 text-sm">Punctuality Score</h3>
                <Clock className="text-purple-400" size={20} />
              </div>
              <p className="text-4xl font-bold text-white mb-2">{analyticsData.punctualityScore}%</p>
              <p className="text-sm text-slate-400">Faculty on-time rate</p>
            </div>

            <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 border border-orange-500/20 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-slate-400 text-sm">Chronic Absentees</h3>
                <AlertTriangle className="text-orange-400" size={20} />
              </div>
              <p className="text-4xl font-bold text-white mb-2">{analyticsData.chronicAbsentees}</p>
              <p className="text-sm text-slate-400">Below 75% attendance</p>
            </div>
          </div>

          {/* Performance Lists */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Top Performers */}
            <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="text-green-400" size={20} />
                Top Performing Courses
              </h3>
              <div className="space-y-3">
                {analyticsData.topPerformers.map((course, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-slate-900/50 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold text-slate-600">#{idx + 1}</span>
                      <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-sm font-mono">{course.courseId}</span>
                    </div>
                    <span className="text-xl font-bold text-green-400">{course.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Low Performers */}
            <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <TrendingDown className="text-red-400" size={20} />
                Needs Attention
              </h3>
              <div className="space-y-3">
                {analyticsData.lowPerformers.map((course, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-slate-900/50 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="text-orange-400" size={20} />
                      <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-sm font-mono">{course.courseId}</span>
                    </div>
                    <span className="text-xl font-bold text-red-400">{course.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
