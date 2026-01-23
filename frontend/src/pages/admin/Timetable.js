import React, { useState } from 'react';
import { Users, Edit2, MapPin,Copy, Calendar, CheckCircle, AlertCircle, Plus, Clock, Search, Download, Trash2 } from 'lucide-react';

export default function Timetable(){
const [view, setView] = useState('calendar'); // 'calendar', 'list', 'conflicts'
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [filterType, setFilterType] = useState('all'); // 'all', 'faculty', 'room', 'course'
  const [searchTerm, setSearchTerm] = useState('');

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const timeSlots = [
    '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', 
    '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
  ];

  // Sample Timetable Data
  const [schedule, setSchedule] = useState([
    { id: 1, day: 'Monday', time: '9:00 AM - 10:30 AM', courseId: 'CS-101', section: 'A', faculty: 'Dr. Smith', room: 'Room 301', students: 25, color: 'blue' },
    { id: 2, day: 'Monday', time: '11:00 AM - 12:30 PM', courseId: 'MATH-101', section: 'A', faculty: 'Prof. Williams', room: 'Room 205', students: 52, color: 'green' },
    { id: 3, day: 'Monday', time: '2:00 PM - 3:30 PM', courseId: 'PHY-101', section: 'B', faculty: 'Dr. Brown', room: 'Lab 205', students: 41, color: 'purple' },
    
    { id: 4, day: 'Tuesday', time: '9:00 AM - 10:30 AM', courseId: 'CS-201', section: 'A', faculty: 'Dr. Johnson', room: 'Lab 101', students: 38, color: 'orange' },
    { id: 5, day: 'Tuesday', time: '11:00 AM - 12:30 PM', courseId: 'CS-101', section: 'B', faculty: 'Dr. Smith', room: 'Room 302', students: 20, color: 'blue' },
    { id: 6, day: 'Tuesday', time: '2:00 PM - 3:30 PM', courseId: 'MATH-101', section: 'B', faculty: 'Prof. Williams', room: 'Room 206', students: 48, color: 'green' },
    
    { id: 7, day: 'Wednesday', time: '9:00 AM - 10:30 AM', courseId: 'CS-101', section: 'A', faculty: 'Dr. Smith', room: 'Room 301', students: 25, color: 'blue' },
    { id: 8, day: 'Wednesday', time: '10:00 AM - 11:30 AM', courseId: 'PHY-101', section: 'A', faculty: 'Dr. Brown', room: 'Lab 201', students: 35, color: 'purple' },
    { id: 9, day: 'Wednesday', time: '2:00 PM - 3:30 PM', courseId: 'CHEM-101', section: 'A', faculty: 'Dr. Davis', room: 'Lab 301', students: 30, color: 'red' },
    
    { id: 10, day: 'Thursday', time: '9:00 AM - 10:30 AM', courseId: 'CS-201', section: 'A', faculty: 'Dr. Johnson', room: 'Lab 101', students: 38, color: 'orange' },
    { id: 11, day: 'Thursday', time: '11:00 AM - 12:30 PM', courseId: 'MATH-101', section: 'A', faculty: 'Prof. Williams', room: 'Room 205', students: 52, color: 'green' },
    
    { id: 12, day: 'Friday', time: '9:00 AM - 10:30 AM', courseId: 'CS-101', section: 'A', faculty: 'Dr. Smith', room: 'Room 301', students: 25, color: 'blue' },
    { id: 13, day: 'Friday', time: '11:00 AM - 12:30 PM', courseId: 'PHY-101', section: 'B', faculty: 'Dr. Brown', room: 'Lab 205', students: 41, color: 'purple' },
  ]);

  // Detected Conflicts
  const [conflicts, setConflicts] = useState([
    { type: 'faculty', message: 'Dr. Smith has overlapping classes', details: 'CS-101 (Room 301) and CS-102 (Room 302) on Monday 9:00 AM', severity: 'high' },
    { type: 'room', message: 'Room 301 double booked', details: 'CS-101 and MATH-201 scheduled simultaneously on Wednesday 2:00 PM', severity: 'high' },
    { type: 'idle', message: 'Room 205 idle during peak hours', details: 'No classes scheduled between 10:00 AM - 2:00 PM on Tuesday', severity: 'medium' },
    { type: 'workload', message: 'Dr. Johnson overloaded', details: '8 classes this week, 2 above average', severity: 'medium' }
  ]);

  // Stats
  const totalClasses = schedule.length;
  const uniqueRooms = new Set(schedule.map(s => s.room)).size;
  const uniqueFaculty = new Set(schedule.map(s => s.faculty)).size;
  const utilizationRate = 68.5; // Sample calculation

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-500/20 border-blue-500/30 text-blue-400',
      green: 'bg-green-500/20 border-green-500/30 text-green-400',
      purple: 'bg-purple-500/20 border-purple-500/30 text-purple-400',
      orange: 'bg-orange-500/20 border-orange-500/30 text-orange-400',
      red: 'bg-red-500/20 border-red-500/30 text-red-400'
    };
    return colors[color] || colors.blue;
  };

  const getConflictColor = (severity) => {
    return severity === 'high' ? 'border-red-500/30 bg-red-500/5' : 'border-yellow-500/30 bg-yellow-500/5';
  };

  const filteredSchedule = schedule.filter(item => {
    if (view === 'calendar') {
      return item.day === selectedDay;
    }
    const matchesSearch = 
      item.courseId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.faculty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.room.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Total Classes</p>
              <h3 className="text-3xl font-bold text-white mt-2">{totalClasses}</h3>
              <p className="text-slate-400 text-xs mt-1">This week</p>
            </div>
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <Calendar className="text-blue-400" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Active Rooms</p>
              <h3 className="text-3xl font-bold text-white mt-2">{uniqueRooms}</h3>
              <p className="text-slate-400 text-xs mt-1">In use</p>
            </div>
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
              <MapPin className="text-purple-400" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Faculty Assigned</p>
              <h3 className="text-3xl font-bold text-white mt-2">{uniqueFaculty}</h3>
              <p className="text-slate-400 text-xs mt-1">Teaching this week</p>
            </div>
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
              <Users className="text-green-400" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 border border-orange-500/20 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Utilization Rate</p>
              <h3 className="text-3xl font-bold text-white mt-2">{utilizationRate}%</h3>
              <p className="text-slate-400 text-xs mt-1">Room efficiency</p>
            </div>
            <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
              <Clock className="text-orange-400" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Conflict Alerts */}
      {conflicts.length > 0 && view !== 'conflicts' && (
        <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="text-red-400" size={20} />
              <h3 className="text-lg font-semibold text-white">Scheduling Conflicts Detected</h3>
            </div>
            <button 
              onClick={() => setView('conflicts')}
              className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-sm transition-colors"
            >
              View All ({conflicts.length})
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {conflicts.slice(0, 2).map((conflict, idx) => (
              <div key={idx} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
                <p className="text-white font-medium mb-1">{conflict.message}</p>
                <p className="text-slate-400 text-xs">{conflict.details}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* View Toggle & Actions */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex gap-2 bg-slate-800/50 p-1.5 rounded-xl border border-slate-700/50">
          <button
            onClick={() => setView('calendar')}
            className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
              view === 'calendar'
                ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Calendar View
          </button>
          <button
            onClick={() => setView('list')}
            className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
              view === 'list'
                ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            List View
          </button>
          <button
            onClick={() => setView('conflicts')}
            className={`px-6 py-2.5 rounded-lg font-medium transition-all relative ${
              view === 'conflicts'
                ? 'bg-red-500 text-white shadow-lg shadow-red-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Conflicts
            {conflicts.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {conflicts.length}
              </span>
            )}
          </button>
        </div>

        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-6 py-3 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 text-white rounded-xl font-medium transition-all">
            <Download size={20} />
            Export
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl font-medium transition-all shadow-lg shadow-blue-500/20">
            <Plus size={20} />
            Add Class
          </button>
        </div>
      </div>

      {/* Calendar View */}
      {view === 'calendar' && (
        <div className="space-y-4">
          {/* Day Selector */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {days.map(day => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-6 py-3 rounded-xl font-medium whitespace-nowrap transition-all ${
                  selectedDay === day
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/20'
                    : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-700/50'
                }`}
              >
                {day}
              </button>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl overflow-hidden">
            <div className="grid grid-cols-[120px_1fr] divide-x divide-slate-700/50">
              {/* Time Column */}
              <div className="bg-slate-800/50">
                <div className="p-4 border-b border-slate-700/50 h-16 flex items-center">
                  <span className="text-slate-400 text-sm font-medium">Time</span>
                </div>
                {timeSlots.map((time, idx) => (
                  <div key={idx} className="p-4 border-b border-slate-700/50 h-24 flex items-center">
                    <span className="text-slate-300 text-sm font-medium">{time}</span>
                  </div>
                ))}
              </div>

              {/* Schedule Column */}
              <div>
                <div className="p-4 border-b border-slate-700/50 h-16 flex items-center">
                  <span className="text-white font-semibold">{selectedDay}</span>
                </div>
                <div className="relative">
                  {timeSlots.map((time, idx) => (
                    <div key={idx} className="border-b border-slate-700/50 h-24 p-2 hover:bg-slate-800/20 transition-colors">
                      {filteredSchedule
                        .filter(item => item.time.startsWith(time.split(' ')[0]))
                        .map(item => (
                          <div
                            key={item.id}
                            className={`border rounded-xl p-3 h-full ${getColorClasses(item.color)}`}
                          >
                            <div className="flex items-start justify-between mb-1">
                              <div>
                                <span className="font-mono text-sm font-bold">{item.courseId}</span>
                                <span className="text-xs ml-2">Sec {item.section}</span>
                              </div>
                              <div className="flex gap-1">
                                <button className="p-1 hover:bg-white/10 rounded">
                                  <Edit2 size={12} />
                                </button>
                                <button className="p-1 hover:bg-white/10 rounded">
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            </div>
                            <div className="text-xs space-y-1">
                              <div className="flex items-center gap-1">
                                <MapPin size={10} />
                                <span>{item.room}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Users size={10} />
                                <span>{item.faculty}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* List View */}
      {view === 'list' && (
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search by course, faculty, or room..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500/50"
            />
          </div>

          {/* Grouped by Day */}
          {days.map(day => {
            const dayClasses = filteredSchedule.filter(item => item.day === day);
            if (dayClasses.length === 0) return null;

            return (
              <div key={day} className="bg-slate-800/30 border border-slate-700/50 rounded-2xl overflow-hidden">
                <div className="bg-slate-800/50 px-6 py-4 border-b border-slate-700/50">
                  <h3 className="text-lg font-semibold text-white">{day}</h3>
                  <p className="text-slate-400 text-sm">{dayClasses.length} classes scheduled</p>
                </div>
                <div className="divide-y divide-slate-700/50">
                  {dayClasses.map(item => (
                    <div key={item.id} className="p-6 hover:bg-slate-800/20 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <span className={`px-3 py-1 rounded-lg text-sm font-mono border ${getColorClasses(item.color)}`}>
                              {item.courseId}
                            </span>
                            <span className="px-2 py-1 bg-slate-700/50 text-slate-300 rounded text-xs">
                              Section {item.section}
                            </span>
                            <span className="text-slate-400 text-sm">{item.time}</span>
                          </div>
                          <div className="grid grid-cols-3 gap-4">
                            <div className="flex items-center gap-2 text-slate-300">
                              <Users size={16} className="text-slate-500" />
                              <span className="text-sm">{item.faculty}</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-300">
                              <MapPin size={16} className="text-slate-500" />
                              <span className="text-sm">{item.room}</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-300">
                              <Users size={16} className="text-slate-500" />
                              <span className="text-sm">{item.students} students</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors">
                            <Copy size={18} className="text-slate-400" />
                          </button>
                          <button className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors">
                            <Edit2 size={18} className="text-slate-400" />
                          </button>
                          <button className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors">
                            <Trash2 size={18} className="text-slate-400 hover:text-red-400" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Conflicts View */}
      {view === 'conflicts' && (
        <div className="space-y-4">
          <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Detected Conflicts & Optimization Opportunities</h3>
            <div className="space-y-3">
              {conflicts.map((conflict, idx) => (
                <div key={idx} className={`border rounded-xl p-5 ${getConflictColor(conflict.severity)}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <AlertCircle className={conflict.severity === 'high' ? 'text-red-400' : 'text-yellow-400'} size={20} />
                        <h4 className="text-white font-semibold">{conflict.message}</h4>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          conflict.severity === 'high' 
                            ? 'bg-red-500/20 text-red-400' 
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {conflict.severity.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-slate-300 text-sm ml-8">{conflict.details}</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg text-sm transition-colors">
                        Auto-Fix
                      </button>
                      <button className="px-4 py-2 bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded-lg text-sm transition-colors">
                        Ignore
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Optimization Suggestions */}
          <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="text-green-400" size={20} />
              <h3 className="text-lg font-semibold text-white">Optimization Suggestions</h3>
            </div>
            <div className="space-y-3">
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
                <p className="text-white font-medium mb-1">Room 301 can accommodate 3 more classes</p>
                <p className="text-slate-400 text-sm">Available slots: Mon 11-12, Wed 3-4, Fri 2-3</p>
              </div>
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
                <p className="text-white font-medium mb-1">Dr. Smith has 4 idle hours on Thursday</p>
                <p className="text-slate-400 text-sm">Consider scheduling CS-102 or tutorial sessions</p>
              </div>
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
                <p className="text-white font-medium mb-1">Lab 101 underutilized (45% capacity)</p>
                <p className="text-slate-400 text-sm">Available for additional practical sessions</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
