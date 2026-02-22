import React, { useState, useEffect } from 'react';
import { Users, AlertCircle, Search, Filter, Eye, Ban, CheckCircle, Clock, Plus, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, GraduationCap, Calendar, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';
import API_BASE from "../../config/api";
import { authFetch } from "../../utils/authFetch";

export default function Student() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCourse, setFilterCourse] = useState('all');
  const [filterSemester, setFilterSemester] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  
  const [students, setStudents] = useState([]);
  const [stats, setStats] = useState([]);
  const { admin, loading: adminLoading } = useAdmin();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const STAT_CONFIG = {
    total: {
      label: 'Total Students',
      icon: Users,
      color: 'from-blue-500 to-blue-600'
    },
    active: {
      label: 'Active',
      icon: CheckCircle,
      color: 'from-emerald-500 to-emerald-600'
    },
    warning: {
      label: 'Warning',
      icon: AlertCircle,
      color: 'from-orange-500 to-orange-600'
    },
    suspended: {
      label: 'Suspended',
      icon: Ban,
      color: 'from-red-500 to-red-600'
    }
  };

  // ✅ Redirect effect
  useEffect(() => {
    if (!adminLoading && !admin) {
      navigate('/login');
    }
  }, [adminLoading, admin, navigate]);

  // ✅ Fetch students effect
  useEffect(() => {
    if (adminLoading || !admin || !admin.adminId) return;
    
    setLoading(true);
    setError(null);
    
    console.log("Fetching students for admin:", admin.adminId);

    Promise.all([
      authFetch(`${API_BASE}/api/admin/students?adminId=${admin.adminId}`),
      authFetch(`${API_BASE}/api/admin/students/stats?adminId=${admin.adminId}`)
    ])
    .then(async ([studentsRes, statsRes]) => {
      if (!studentsRes.ok) throw new Error(`Failed to fetch students: ${studentsRes.status}`);
      if (!statsRes.ok) throw new Error(`Failed to fetch stats: ${statsRes.status}`);
      
      const studentsData = await studentsRes.json();
      const statsData = await statsRes.json();
      
      setStudents(Array.isArray(studentsData) ? studentsData : []);
      setTotalElements(Array.isArray(studentsData) ? studentsData.length : 0);
      
      setStats(
        Object.keys(STAT_CONFIG).map(key => ({
          ...STAT_CONFIG[key],
          value: statsData[key] ?? 0,
          change: STAT_CONFIG[key].change
        }))
      );
    })
    .catch(err => {
      console.error("Error fetching student data:", err);
      setError(err.message || 'Failed to load student data. Please try again.');
    })
    .finally(() => {
      setLoading(false);
    });
    
  }, [admin, adminLoading]);

  // ✅ Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus, filterCourse, filterSemester]);

  // Filter students based on search and filters
  const filteredStudents = Array.isArray(students)
    ? students.filter(student => {
        const matchesSearch =
          student.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.rollNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.department?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus =
          filterStatus === 'all' ||
          student.status?.toLowerCase() === filterStatus.toLowerCase();

        const matchesCourse =
          filterCourse === 'all' ||
          student.department === filterCourse;

        const matchesSemester =
          filterSemester === 'all' ||
          String(student.semester) === filterSemester;

        return matchesSearch && matchesStatus && matchesCourse && matchesSemester;
      })
    : [];

  // Calculate pagination values
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredStudents.length);
  const paginatedStudents = filteredStudents.slice(startIndex, endIndex);

  // Pagination handlers
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Generate page numbers with ellipsis
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    
    return pages;
  };

  const getAttendanceColor = (attendance) => {
    if (attendance >= 90) return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    if (attendance >= 75) return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
    return 'bg-red-500/20 text-red-400 border-red-500/30';
  };

  const getStatusConfig = (status = 'ACTIVE') => {
    const configs = {
      ACTIVE: { color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30', icon: CheckCircle },
      WARNING: { color: 'bg-orange-500/20 text-orange-400 border-orange-500/30', icon: AlertCircle },
      SUSPENDED: { color: 'bg-red-500/20 text-red-400 border-red-500/30', icon: Ban },
      PENDING: { color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', icon: Clock },
      GRADUATED: { color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', icon: GraduationCap }
    };
    return configs[status] || configs.ACTIVE;
  };

  const handleEditStudent = (studentId) => {
    navigate(`/admin/students/edit/${studentId}`);
  };

  const departments = ['CSE', 'ECE', 'ME', 'IT', 'EEE', 'Civil'];

  // ========== INDUSTRY-LEVEL LOADING & ERROR STATES ==========

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-950 flex items-center justify-center p-4">
        <div className="text-center p-8 bg-red-900/20 border border-red-700/50 rounded-2xl backdrop-blur-xl max-w-md w-full">
          <AlertCircle className="text-red-400 mx-auto mb-4 animate-pulse" size={56} />
          <h2 className="text-2xl font-bold text-white mb-3">Error Loading Student Data</h2>
          <p className="text-slate-300 mb-6 bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
            {error}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-red-500/20 transition-all flex items-center justify-center gap-2"
            >
              <AlertCircle size={18} />
              Retry Loading
            </button>
            <button 
              onClick={() => navigate('/admin')}
              className="px-6 py-3 bg-slate-700/50 hover:bg-slate-700 text-white rounded-xl font-medium border border-slate-600/50 transition-all"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (adminLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-950 flex items-center justify-center p-4">
        <div className="text-center">
          {/* Animated gradient spinner */}
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 animate-spin opacity-30 blur-sm"></div>
            <div className="absolute inset-2 rounded-full bg-gradient-to-br from-slate-900 to-slate-800"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-t-2 border-b-2 border-purple-500 rounded-full animate-spin animate-reverse"></div>
            </div>
          </div>
          
          {/* Loading text with dots animation */}
          <div className="space-y-3">
            <p className="text-slate-300 text-lg font-medium flex items-center justify-center gap-2">
              Loading student management
              <span className="flex gap-1">
                <span className="animate-bounce">.</span>
                <span className="animate-bounce" style={{ animationDelay: '0.1s' }}>.</span>
                <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>.</span>
              </span>
            </p>
            <p className="text-slate-500 text-sm max-w-md mx-auto">
              Fetching student data, attendance records, and performance analytics...
            </p>
          </div>
          
          {/* Progress bar */}
          <div className="mt-8 max-w-md mx-auto">
            <div className="w-full h-2 bg-slate-800/50 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-progress"></div>
            </div>
            <p className="text-slate-400 text-xs mt-2">Initializing Student dashboard components</p>
          </div>
        </div>
      </div>
    );
  }

  if (!admin) {
    return null; // Will redirect via useEffect
  }

  // ========== MAIN COMPONENT RENDER ==========
  
  return (
    <div className="space-y-6">

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

      {/* Enhanced Stats with Trends */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="group bg-slate-800/30 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 hover:border-blue-500/30 transition-all hover:transform hover:scale-[1.02]">
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 bg-gradient-to-r ${stat.color} rounded-xl group-hover:shadow-lg transition-shadow`}>
                <stat.icon size={24} className="text-white" />
              </div>
            </div>
            <p className="text-slate-400 text-sm mb-1">{stat.label}</p>
            <p className="text-3xl font-bold text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="bg-slate-800/30 backdrop-blur-xl rounded-2xl border border-slate-700/50 overflow-hidden">
        {/* Enhanced Header */}
        <div className="p-6 border-b border-slate-700/50 bg-slate-800/50">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">Student Management</h2>
              <p className="text-slate-400 text-sm">
                Showing <span className="text-white font-medium">{filteredStudents.length}</span> of{' '}
                <span className="text-white font-medium">{totalElements}</span> students
                {searchTerm && ` for "${searchTerm}"`}
                {filterStatus !== 'all' && ` with status: ${filterStatus}`}
                {filterCourse !== 'all' && ` in ${filterCourse}`}
                {filterSemester !== 'all' && ` in semester ${filterSemester}`}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex-1 lg:flex-none lg:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="text"
                  placeholder="Search by name, roll no, email, department..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>

              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-3 bg-slate-700/50 hover:bg-slate-700 text-white rounded-xl transition-colors flex items-center gap-2 border border-slate-600/50"
              >
                <Filter size={20} />
                Filters
              </button>

              <button
                onClick={() => navigate("/admin/students/new")}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium flex items-center gap-2 hover:shadow-lg hover:shadow-blue-500/20 transition-all"
              >
                <Plus size={20} />
                Add Student
              </button>
            </div>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="mt-4 p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-slate-400 text-xs mb-2 block">Status</label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="all">All Status</option>
                    <option value="ACTIVE">Active</option>
                    <option value="WARNING">Warning</option>
                    <option value="SUSPENDED">Suspended</option>
                    <option value="PENDING">Pending</option>
                    <option value="GRADUATED">Graduated</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 text-xs mb-2 block">Department</label>
                  <select
                    value={filterCourse}
                    onChange={(e) => setFilterCourse(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="all">All Departments</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 text-xs mb-2 block">Semester</label>
                  <select
                    value={filterSemester}
                    onChange={(e) => setFilterSemester(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="all">All Semesters</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                      <option key={sem} value={sem}>Semester {sem}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end">
                  <button 
                    onClick={() => {
                      setFilterStatus('all');
                      setFilterCourse('all');
                      setFilterSemester('all');
                      setSearchTerm('');
                      setCurrentPage(1);
                    }}
                    className="w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                  >
                    Clear All Filters
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Table Controls Bar - Integrated below filters */}
          <div className="mt-4 pt-4 border-t border-slate-700/50">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Quick Pagination & Controls */}
              <div className="flex flex-wrap items-center gap-4">
                {/* Rows per page */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-400">Show</span>
                  <div className="flex bg-slate-800/50 rounded-lg border border-slate-700 p-0.5">
                    {[10, 25, 50, 100].map((size) => (
                      <button
                        key={size}
                        onClick={() => {
                          setItemsPerPage(size);
                          setCurrentPage(1);
                        }}
                        className={`px-3 py-1 text-sm rounded-md transition-all ${
                          itemsPerPage === size
                            ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/20'
                            : 'text-slate-300 hover:bg-slate-700/50'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                  <span className="text-sm text-slate-400">entries</span>
                </div>

                {/* Records info */}
                <div className="hidden md:block border-l border-slate-700/50 pl-4">
                  <p className="text-sm text-slate-400">
                    <span className="text-white font-medium">{startIndex + 1}</span>-
                    <span className="text-white font-medium">{Math.min(endIndex, filteredStudents.length)}</span> of{' '}
                    <span className="text-white font-medium">{filteredStudents.length}</span> records
                  </p>
                </div>
              </div>

              {/* Page Navigation - Compact */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => goToPage(1)}
                  disabled={currentPage === 1}
                  className="p-2 hover:bg-slate-700/50 rounded-lg transition-all border border-slate-600/50 disabled:opacity-40 disabled:cursor-not-allowed"
                  title="First Page"
                >
                  <ChevronsLeft size={18} className="text-slate-400" />
                </button>

                <button
                  onClick={prevPage}
                  disabled={currentPage === 1}
                  className="px-3 py-2 hover:bg-slate-700/50 rounded-lg transition-all border border-slate-600/50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={16} className="text-slate-400" />
                </button>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-400">Page</span>
                  <input
                    type="number"
                    min="1"
                    max={totalPages}
                    value={currentPage}
                    onChange={(e) => {
                      const page = Math.max(1, Math.min(totalPages, Number(e.target.value) || 1));
                      goToPage(page);
                    }}
                    className="w-14 bg-slate-800/50 border border-slate-700 rounded-lg px-2 py-1 text-sm text-white text-center focus:outline-none focus:border-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <span className="text-sm text-slate-400">of {totalPages}</span>
                </div>

                <button
                  onClick={nextPage}
                  disabled={currentPage >= totalPages}
                  className="px-3 py-2 hover:bg-slate-700/50 rounded-lg transition-all border border-slate-600/50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={16} className="text-slate-400" />
                </button>

                <button
                  onClick={() => goToPage(totalPages)}
                  disabled={currentPage >= totalPages}
                  className="p-2 hover:bg-slate-700/50 rounded-lg transition-all border border-slate-600/50 disabled:opacity-40 disabled:cursor-not-allowed"
                  title="Last Page"
                >
                  <ChevronsRight size={18} className="text-slate-400" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-900/50 sticky top-0 border-b border-slate-700/60">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-widest">Student</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-widest">Registration Number</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-widest">Department</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-widest">Semester</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-widest">Section</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-widest">Attendance</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-widest">Performance</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {paginatedStudents.length > 0 ? (
                paginatedStudents.map((student, idx) => (
                  <tr key={idx} className="group transition-colors hover:bg-slate-800/40">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-semibold shadow-lg">
                            {student.fullName?.split(' ').map(n => n[0]).join('') || '??'}
                          </div>
                          <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-slate-800 ${
                            student.status === 'ACTIVE' ? 'bg-green-400' : 
                            student.status === 'WARNING' ? 'bg-orange-400' : 
                            student.status === 'GRADUATED' ? 'bg-blue-400' :
                            'bg-red-400'
                          }`}></div>
                        </div>
                        <div>
                          <p className="text-white font-medium group-hover:text-blue-400 transition-colors">{student.fullName}</p>
                          <p className="text-slate-400 text-xs">{student.email}</p>
                          <p className="text-slate-500 text-xs mt-1">Batch: {student.batch || 'N/A'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-slate-300 font-mono text-sm bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-700/50">
                        {student.registrationNo || student.rollNo || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-xs font-medium border border-blue-500/30">
                        {student.department || 'Not assigned'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1.5 bg-slate-700/50 text-slate-300 rounded-lg text-xs font-medium border border-slate-600/50">
                        Sem {student.semester || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1.5 bg-slate-800/30 text-slate-300 rounded-lg text-xs font-semibold border border-slate-700">
                        {student.section || 'N/A'}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {/* Modern Circular Progress */}
                        <div className="relative w-11 h-11">
                          {/* Base circle with shadow */}
                          <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 rounded-full shadow-inner"></div>
                          
                          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                            {/* Subtle track */}
                            <circle 
                              cx="18" 
                              cy="18" 
                              r="15.5" 
                              fill="none" 
                              className="stroke-slate-700/60" 
                              strokeWidth="2.5"
                            />
                            
                            {/* Glowing progress */}
                            <circle
                              cx="18"
                              cy="18"
                              r="15.5"
                              fill="none"
                              className={`stroke-current transition-all duration-500 ${
                                (student.attendancePercentage || 0) >= 90 ? 'text-emerald-500' :
                                (student.attendancePercentage || 0) >= 75 ? 'text-amber-500' :
                                'text-rose-500'
                              }`}
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeDasharray="97.4"
                              strokeDashoffset={97.4 - ((student.attendancePercentage || 0) * 0.974)}
                              style={{
                                filter: `drop-shadow(0 0 4px ${
                                  (student.attendancePercentage || 0) >= 90 ? 'rgba(16, 185, 129, 0.3)' :
                                  (student.attendancePercentage || 0) >= 75 ? 'rgba(245, 158, 11, 0.3)' :
                                  'rgba(244, 63, 94, 0.3)'
                                })`
                              }}
                            />
                          </svg>
                          
                          {/* Center with glass effect */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-slate-800/70 backdrop-blur-sm rounded-full w-7 h-7 flex items-center justify-center border border-slate-700/50 shadow-sm">
                              <span className={`text-[10px] font-bold ${
                                (student.attendancePercentage || 0) >= 90 ? 'text-emerald-300' :
                                (student.attendancePercentage || 0) >= 75 ? 'text-amber-300' :
                                'text-rose-300'
                              }`}>
                                {Math.round(student.attendancePercentage || 0)}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Clean status */}
                        <div className="flex flex-col">
                          <span className={`text-xs font-semibold ${
                            (student.attendancePercentage || 0) >= 90 ? 'text-emerald-400' :
                            (student.attendancePercentage || 0) >= 75 ? 'text-amber-400' :
                            'text-rose-400'
                          }`}>
                            {(student.attendancePercentage || 0).toFixed(1)}%
                          </span>
                          <span className="text-[10px] text-slate-500 capitalize">
                            {(student.attendancePercentage || 0) >= 90 ? 'excellent' :
                            (student.attendancePercentage || 0) >= 75 ? 'good' :
                            (student.attendancePercentage || 0) >= 60 ? 'fair' : 'low'}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className={`px-3 py-1 rounded-lg text-xs font-semibold text-center border ${
                          (student.cgpa || 0) >= 9 ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                          (student.cgpa || 0) >= 7.5 ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                          (student.cgpa || 0) >= 6 ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' :
                          'bg-red-500/20 text-red-400 border-red-500/30'
                        }`}>
                          CGPA: {(student.cgpa || 0).toFixed(2)}
                        </span>
                        {(student.backlogs || 0) > 0 && (
                          <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs rounded-lg text-center">
                            {student.backlogs} backlog{(student.backlogs || 0) !== 1 ? 's' : ''}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold border inline-flex items-center gap-1.5 ${getStatusConfig(student.status).color}`}>
                        {React.createElement(getStatusConfig(student.status).icon, { size: 12 })}
                        {student.status || 'ACTIVE'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => navigate(`/admin/students/${student.id || student.publicId}`)}
                          className="p-2 hover:bg-blue-500/20 rounded-lg transition-all group/btn"
                          title="View Details"
                        >
                          <Eye size={18} className="text-slate-400 group-hover/btn:text-blue-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="bg-transparent hover:bg-transparent">
                  <td colSpan="9" className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center gap-4">
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl flex items-center justify-center">
                        <Users className="text-slate-500" size={48} />
                      </div>
                      <div className="max-w-md">
                        <p className="text-slate-300 font-medium text-lg mb-2">No students found</p>
                        <p className="text-slate-500 text-sm">
                          {searchTerm || filterStatus !== 'all' || filterCourse !== 'all' || filterSemester !== 'all'
                            ? 'Try adjusting your search or filter criteria to find students.'
                            : 'Get started by adding your first student to the system.'
                          }
                        </p>
                        {!searchTerm && filterStatus === 'all' && filterCourse === 'all' && filterSemester === 'all' && (
                          <button
                            onClick={() => navigate("/admin/students/new")}
                            className="mt-4 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium text-sm hover:shadow-lg hover:shadow-blue-500/20 transition-all"
                          >
                            <Plus size={16} className="inline mr-2" />
                            Add First Student
                          </button>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Bottom Pagination - Enhanced & Sticky */}
        {filteredStudents.length > 0 && (
          <div className="sticky bottom-0 z-10 px-6 py-4 border-t border-slate-700/50 bg-slate-800/50 backdrop-blur-sm">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              {/* Records Info */}
              <div className="text-sm text-slate-400">
                Showing <span className="text-white font-medium">{startIndex + 1}</span>-
                <span className="text-white font-medium">{Math.min(endIndex, filteredStudents.length)}</span> of{' '}
                <span className="text-white font-medium">{filteredStudents.length}</span> entries
                <span className="ml-3 text-slate-500">|</span>
                <span className="ml-3">
                  Page <span className="text-white font-medium">{currentPage}</span> of{' '}
                  <span className="text-white font-medium">{totalPages}</span>
                </span>
              </div>

              {/* Full Pagination Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => goToPage(1)}
                  disabled={currentPage === 1}
                  className="p-2 hover:bg-slate-700/50 rounded-lg transition-all border border-slate-600/50 disabled:opacity-40 disabled:cursor-not-allowed"
                  title="First Page"
                >
                  <ChevronsLeft size={18} className="text-slate-400" />
                </button>

                <button
                  onClick={prevPage}
                  disabled={currentPage === 1}
                  className="p-2 hover:bg-slate-700/50 rounded-lg transition-all border border-slate-600/50 disabled:opacity-40 disabled:cursor-not-allowed"
                  title="Previous Page"
                >
                  <ChevronLeft size={18} className="text-slate-400" />
                </button>

                {/* Page Numbers */}
                <div className="flex items-center gap-1 mx-2">
                  {getPageNumbers().map((page, index) => (
                    page === '...' ? (
                      <span key={`ellipsis-${index}`} className="px-2 text-slate-500">
                        ...
                      </span>
                    ) : (
                      <button
                        key={page}
                        onClick={() => goToPage(page)}
                        className={`min-w-9 h-9 flex items-center justify-center rounded-lg transition-all border ${
                          currentPage === page
                            ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/20'
                            : 'bg-slate-700/50 text-white border-slate-600/50 hover:bg-slate-700'
                        }`}
                      >
                        {page}
                      </button>
                    )
                  ))}
                </div>

                <button
                  onClick={nextPage}
                  disabled={currentPage >= totalPages}
                  className="p-2 hover:bg-slate-700/50 rounded-lg transition-all border border-slate-600/50 disabled:opacity-40 disabled:cursor-not-allowed"
                  title="Next Page"
                >
                  <ChevronRight size={18} className="text-slate-400" />
                </button>

                <button
                  onClick={() => goToPage(totalPages)}
                  disabled={currentPage >= totalPages}
                  className="p-2 hover:bg-slate-700/50 rounded-lg transition-all border border-slate-600/50 disabled:opacity-40 disabled:cursor-not-allowed"
                  title="Last Page"
                >
                  <ChevronsRight size={18} className="text-slate-400" />
                </button>
              </div>

              {/* Go to Page */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-400">Go to page:</span>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max={totalPages}
                    value={currentPage}
                    onChange={(e) => {
                      const page = Math.max(1, Math.min(totalPages, Number(e.target.value) || 1));
                      goToPage(page);
                    }}
                    className="w-16 bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-slate-500">
                    /{totalPages}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Floating Quick Navigation (appears when scrolled) */}
        {filteredStudents.length > 10 && (
          <div className="fixed bottom-6 right-6 z-50 hidden lg:block">
            <div className="bg-slate-800/90 backdrop-blur-sm border border-slate-700 rounded-xl shadow-2xl p-3 flex flex-col gap-2">
              <div className="text-xs text-slate-400 text-center mb-1">Quick Nav</div>
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => goToPage(1)}
                  disabled={currentPage === 1}
                  className="p-2 hover:bg-slate-700/50 rounded-lg transition-all disabled:opacity-40"
                  title="First Page"
                >
                  <ChevronsLeft size={14} className="text-slate-400" />
                </button>
                <button
                  onClick={prevPage}
                  disabled={currentPage === 1}
                  className="p-2 hover:bg-slate-700/50 rounded-lg transition-all disabled:opacity-40"
                  title="Previous Page"
                >
                  <ChevronLeft size={14} className="text-slate-400" />
                </button>
                <div className="text-center text-xs text-slate-300 py-1">
                  {currentPage}<span className="text-slate-500">/{totalPages}</span>
                </div>
                <button
                  onClick={nextPage}
                  disabled={currentPage >= totalPages}
                  className="p-2 hover:bg-slate-700/50 rounded-lg transition-all disabled:opacity-40"
                  title="Next Page"
                >
                  <ChevronRight size={14} className="text-slate-400" />
                </button>
                <button
                  onClick={() => goToPage(totalPages)}
                  disabled={currentPage >= totalPages}
                  className="p-2 hover:bg-slate-700/50 rounded-lg transition-all disabled:opacity-40"
                  title="Last Page"
                >
                  <ChevronsRight size={14} className="text-slate-400" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}