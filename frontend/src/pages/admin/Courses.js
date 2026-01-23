import React, { useState } from 'react';
import { Users, Edit2, MapPin, BookOpen, Calendar, Plus, X, Clock, Search, Trash2 } from 'lucide-react';


export default function Courses () {
const [view, setView] = useState('courses'); // 'courses' or 'classes'
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [filterDept, setFilterDept] = useState('all');

  // Sample Data
  const [courses, setCourses] = useState([
    { id: 'CS-101', name: 'Introduction to Programming', department: 'Computer Science', credits: 3, semester: 1, students: 45, faculty: 'Dr. Smith' },
    { id: 'CS-201', name: 'Data Structures', department: 'Computer Science', credits: 4, semester: 2, students: 38, faculty: 'Dr. Johnson' },
    { id: 'MATH-101', name: 'Calculus I', department: 'Mathematics', credits: 3, semester: 1, students: 52, faculty: 'Prof. Williams' },
    { id: 'PHY-101', name: 'Physics Fundamentals', department: 'Physics', credits: 4, semester: 1, students: 41, faculty: 'Dr. Brown' }
  ]);

  const [classes, setClasses] = useState([
    { id: 1, courseId: 'CS-101', section: 'A', room: 'Room 301', time: '9:00 AM - 10:30 AM', days: 'Mon, Wed, Fri', faculty: 'Dr. Smith', students: 25 },
    { id: 2, courseId: 'CS-101', section: 'B', room: 'Room 302', time: '11:00 AM - 12:30 PM', days: 'Mon, Wed, Fri', faculty: 'Dr. Smith', students: 20 },
    { id: 3, courseId: 'CS-201', section: 'A', room: 'Lab 101', time: '2:00 PM - 3:30 PM', days: 'Tue, Thu', faculty: 'Dr. Johnson', students: 38 },
    { id: 4, courseId: 'MATH-101', section: 'A', room: 'Room 205', time: '10:00 AM - 11:30 AM', days: 'Mon, Wed, Fri', faculty: 'Prof. Williams', students: 52 }
  ]);

  const [formData, setFormData] = useState({
    id: '',
    name: '',
    department: '',
    credits: '',
    semester: '',
    faculty: ''
  });

  const [classFormData, setClassFormData] = useState({
    courseId: '',
    section: '',
    room: '',
    time: '',
    days: '',
    faculty: ''
  });

  const departments = ['Computer Science', 'Mathematics', 'Physics', 'Chemistry', 'Electronics'];

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         course.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = filterDept === 'all' || course.department === filterDept;
    return matchesSearch && matchesDept;
  });

  const handleAddCourse = () => {
    if (!formData.id || !formData.name || !formData.department) return;
    
    setCourses([...courses, {
      ...formData,
      credits: parseInt(formData.credits) || 3,
      semester: parseInt(formData.semester) || 1,
      students: 0
    }]);
    
    setFormData({ id: '', name: '', department: '', credits: '', semester: '', faculty: '' });
    setShowAddModal(false);
  };

  const handleAddClass = () => {
    if (!classFormData.courseId || !classFormData.section || !classFormData.room) return;
    
    setClasses([...classes, {
      id: classes.length + 1,
      ...classFormData,
      students: 0
    }]);
    
    setClassFormData({ courseId: '', section: '', room: '', time: '', days: '', faculty: '' });
    setShowAddModal(false);
  };

  const handleDeleteCourse = (id) => {
    setCourses(courses.filter(c => c.id !== id));
  };

  const handleDeleteClass = (id) => {
    setClasses(classes.filter(c => c.id !== id));
  };

  // Course Stats
  const totalCourses = courses.length;
  const totalClasses = classes.length;
  const avgStudentsPerCourse = Math.round(courses.reduce((sum, c) => sum + c.students, 0) / courses.length);
  const departmentCount = new Set(courses.map(c => c.department)).size;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Total Courses</p>
              <h3 className="text-3xl font-bold text-white mt-2">{totalCourses}</h3>
            </div>
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <BookOpen className="text-blue-400" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Total Classes</p>
              <h3 className="text-3xl font-bold text-white mt-2">{totalClasses}</h3>
            </div>
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
              <Clock className="text-purple-400" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Avg Students/Course</p>
              <h3 className="text-3xl font-bold text-white mt-2">{avgStudentsPerCourse}</h3>
            </div>
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
              <Users className="text-green-400" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 border border-orange-500/20 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Departments</p>
              <h3 className="text-3xl font-bold text-white mt-2">{departmentCount}</h3>
            </div>
            <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
              <BookOpen className="text-orange-400" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* View Toggle & Actions */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex gap-2 bg-slate-800/50 p-1.5 rounded-xl border border-slate-700/50">
          <button
            onClick={() => setView('courses')}
            className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
              view === 'courses'
                ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Courses
          </button>
          <button
            onClick={() => setView('classes')}
            className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
              view === 'classes'
                ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Classes
          </button>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl font-medium transition-all shadow-lg shadow-blue-500/20"
        >
          <Plus size={20} />
          Add {view === 'courses' ? 'Course' : 'Class'}
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-4 flex-wrap">
        <div className="flex-1 min-w-[300px] relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder={`Search ${view}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
        
        {view === 'courses' && (
          <select
            value={filterDept}
            onChange={(e) => setFilterDept(e.target.value)}
            className="px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white focus:outline-none focus:border-blue-500/50"
          >
            <option value="all">All Departments</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        )}
      </div>

      {/* Content Area */}
      {view === 'courses' ? (
        <div className="grid grid-cols-1 gap-4">
          {filteredCourses.map(course => (
            <div key={course.id} className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-6 hover:border-blue-500/30 transition-all">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-sm font-mono">{course.id}</span>
                    <h3 className="text-xl font-semibold text-white">{course.name}</h3>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    <div>
                      <p className="text-slate-500 text-xs mb-1">Department</p>
                      <p className="text-slate-300 font-medium">{course.department}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs mb-1">Credits</p>
                      <p className="text-slate-300 font-medium">{course.credits}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs mb-1">Semester</p>
                      <p className="text-slate-300 font-medium">{course.semester}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs mb-1">Students Enrolled</p>
                      <p className="text-green-400 font-medium">{course.students}</p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-2">
                    <Users size={16} className="text-slate-400" />
                    <span className="text-slate-400 text-sm">{course.faculty}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors">
                    <Edit2 size={18} className="text-slate-400 hover:text-blue-400" />
                  </button>
                  <button 
                    onClick={() => handleDeleteCourse(course.id)}
                    className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} className="text-slate-400 hover:text-red-400" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {classes.map(cls => (
            <div key={cls.id} className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-6 hover:border-purple-500/30 transition-all">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-lg text-sm font-mono">{cls.courseId}</span>
                    <span className="px-2 py-1 bg-slate-700/50 text-slate-300 rounded text-xs">Section {cls.section}</span>
                  </div>
                  <p className="text-slate-400 text-sm">{courses.find(c => c.id === cls.courseId)?.name}</p>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors">
                    <Edit2 size={16} className="text-slate-400 hover:text-purple-400" />
                  </button>
                  <button 
                    onClick={() => handleDeleteClass(cls.id)}
                    className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} className="text-slate-400 hover:text-red-400" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-slate-300">
                  <MapPin size={16} className="text-slate-500" />
                  <span className="text-sm">{cls.room}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Clock size={16} className="text-slate-500" />
                  <span className="text-sm">{cls.time}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Calendar size={16} className="text-slate-500" />
                  <span className="text-sm">{cls.days}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Users size={16} className="text-slate-500" />
                  <span className="text-sm">{cls.faculty} • {cls.students} students</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Add New {view === 'courses' ? 'Course' : 'Class'}</h3>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-slate-700 rounded-lg">
                <X size={20} className="text-slate-400" />
              </button>
            </div>

            {view === 'courses' ? (
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Course ID (e.g., CS-301)"
                  value={formData.id}
                  onChange={(e) => setFormData({...formData, id: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                />
                <input
                  type="text"
                  placeholder="Course Name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                />
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({...formData, department: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="">Select Department</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
                <input
                  type="number"
                  placeholder="Credits"
                  value={formData.credits}
                  onChange={(e) => setFormData({...formData, credits: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                />
                <input
                  type="number"
                  placeholder="Semester"
                  value={formData.semester}
                  onChange={(e) => setFormData({...formData, semester: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                />
                <input
                  type="text"
                  placeholder="Faculty Name"
                  value={formData.faculty}
                  onChange={(e) => setFormData({...formData, faculty: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                />
                <button
                  onClick={handleAddCourse}
                  className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl font-medium transition-all"
                >
                  Add Course
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <select
                  value={classFormData.courseId}
                  onChange={(e) => setClassFormData({...classFormData, courseId: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="">Select Course</option>
                  {courses.map(course => (
                    <option key={course.id} value={course.id}>{course.id} - {course.name}</option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Section (e.g., A)"
                  value={classFormData.section}
                  onChange={(e) => setClassFormData({...classFormData, section: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
                />
                <input
                  type="text"
                  placeholder="Room (e.g., Room 301)"
                  value={classFormData.room}
                  onChange={(e) => setClassFormData({...classFormData, room: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
                />
                <input
                  type="text"
                  placeholder="Time (e.g., 9:00 AM - 10:30 AM)"
                  value={classFormData.time}
                  onChange={(e) => setClassFormData({...classFormData, time: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
                />
                <input
                  type="text"
                  placeholder="Days (e.g., Mon, Wed, Fri)"
                  value={classFormData.days}
                  onChange={(e) => setClassFormData({...classFormData, days: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
                />
                <input
                  type="text"
                  placeholder="Faculty Name"
                  value={classFormData.faculty}
                  onChange={(e) => setClassFormData({...classFormData, faculty: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
                />
                <button
                  onClick={handleAddClass}
                  className="w-full py-3 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-xl font-medium transition-all"
                >
                  Add Class
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
