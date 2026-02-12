import React, { useState, useEffect, useCallback } from 'react';
import {Users, BookOpen, Plus, X, Search, Trash2,Loader2, AlertCircle, CheckCircle,Building2, GraduationCap, Clock} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import './Courses.css'; 
import API_BASE from "../../config/api";
import { authFetch } from "../../utils/authFetch";


export default function Courses() {
  const { admin } = useAdmin();

  /* =========================
     ENHANCED STATE MANAGEMENT
     ========================= */
  const [view, setView] = useState('courses');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState({ courses: true, departments: true });
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [activeFilters, setActiveFilters] = useState({
    semester: 'all',
    credits: 'all'
  });

  /* =========================
     DATA STATE
     ========================= */
  const [courses, setCourses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [existingCodes, setExistingCodes] = useState({
    departments: new Set(),
    courses: new Set()
  });

  /* =========================
     FORM STATE
     ========================= */
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    description: '',
    departmentId: '',
    credits: 3,
    semester: 1
  });

  const [deptFormData, setDeptFormData] = useState({
    code: '',
    name: '',
    description: ''
  });

  /* =========================
     ENHANCED FETCHERS WITH ERROR HANDLING
     ========================= */
  const fetchCourses = useCallback(async () => {
    setLoading(prev => ({ ...prev, courses: true }));
    try {
      const res = await authFetch(
        `${API_BASE}/api/admin/subjects?institutionId=${admin.institutionId}`,
        { 
          signal: AbortSignal.timeout(10000)
        }
      );
      
      if (!res.ok) throw new Error(`Failed to fetch courses: ${res.status}`);
      
      const data = await res.json();
      setCourses(
        data.map(s => ({
          id: s.id,
          code: s.subjectCode,
          name: s.subjectName,
          description: s.description || '',
          credits: s.credits,
          semester: s.semester,
          departmentId: s.departmentId
        }))
      );
      
      // Update existing course codes for validation
      setExistingCodes(prev => ({
        ...prev,
        courses: new Set(data.map(c => c.subjectCode.toUpperCase()))
      }));
      
      setError(null);
    } catch (err) {
      console.error('Fetch courses error:', err);
      setError('Unable to load courses. Please try again.');
    } finally {
      setLoading(prev => ({ ...prev, courses: false }));
    }
  }, [admin?.institutionId]);

  const fetchDepartments = useCallback(async () => {
    setLoading(prev => ({ ...prev, departments: true }));
    try {
      const res = await authFetch(
        `${API_BASE}/api/admin/departments?institutionId=${admin.institutionId}`,
        { 
          signal: AbortSignal.timeout(10000)
        }
      );
      
      if (!res.ok) throw new Error(`Failed to fetch departments: ${res.status}`);
      
      const data = await res.json();
      setDepartments(data);
      
      // Update existing department codes for validation
      setExistingCodes(prev => ({
        ...prev,
        departments: new Set(data.map(d => d.departmentCode.toUpperCase()))
      }));
      
      setError(null);
    } catch (err) {
      console.error('Fetch departments error:', err);
      setError('Unable to load departments. Please try again.');
    } finally {
      setLoading(prev => ({ ...prev, departments: false }));
    }
  }, [admin?.institutionId]);

  useEffect(() => {
    if (!admin?.institutionId) return;
    
    fetchCourses();
    fetchDepartments();
    
    // Refresh every 30 seconds for real-time updates
    const interval = setInterval(() => {
      fetchCourses();
      fetchDepartments();
    }, 30000);
    
    return () => clearInterval(interval);
  }, [admin, fetchCourses, fetchDepartments]);

  /* =========================
     ENHANCED VALIDATION FUNCTIONS
     ========================= */
  const validateCourseForm = () => {
    const errors = {};
    
    if (!formData.id.trim()) {
      errors.id = 'Course code is required';
    } else if (existingCodes.courses.has(formData.id.toUpperCase())) {
      errors.id = 'Course code already exists';
    }
    
    if (!formData.name.trim()) {
      errors.name = 'Course name is required';
    }
    
    if (!formData.departmentId) {
      errors.departmentId = 'Department is required';
    }
    
    if (!formData.credits || formData.credits < 1 || formData.credits > 10) {
      errors.credits = 'Credits must be between 1 and 10';
    }
    
    if (!formData.semester || formData.semester < 1 || formData.semester > 8) {
      errors.semester = 'Semester must be between 1 and 8';
    }
    
    return errors;
  };

  const validateDepartmentForm = () => {
    const errors = {};
    
    if (!deptFormData.code.trim()) {
      errors.code = 'Department code is required';
    } else if (existingCodes.departments.has(deptFormData.code.toUpperCase())) {
      errors.code = 'Department code already exists';
    } else if (!/^[A-Z]{2,6}$/.test(deptFormData.code)) {
      errors.code = 'Code must be 2-6 uppercase letters';
    }
    
    if (!deptFormData.name.trim()) {
      errors.name = 'Department name is required';
    }
    
    return errors;
  };

  /* =========================
     ENHANCED HANDLERS WITH FEEDBACK
     ========================= */
  const handleAddCourse = async () => {
    const errors = validateCourseForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    
    setValidationErrors({});
    setLoading(prev => ({ ...prev, courses: true }));
    
    try {
      await authFetch(`${API_BASE}/api/admin/subjects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          subjectCode: formData.id.trim(),
          subjectName: formData.name.trim(),
          description: formData.description.trim(),
          credits: formData.credits,
          semester: formData.semester,
          departmentId: formData.departmentId
        })
      });
      
      setSuccessMessage('Course added successfully!');
      setShowAddModal(false);
      resetCourseForm();
      fetchCourses();
      
      // Auto-hide success message
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Failed to add course. Please try again.');
    } finally {
      setLoading(prev => ({ ...prev, courses: false }));
    }
  };

  const handleDeleteCourse = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    
    setDeletingId(id);
    
    try {
      await authFetch(`${API_BASE}/api/admin/subjects/${id}`, {
        method: 'DELETE'
      });
      
      setCourses(prev => {
        const updated = prev.filter(c => c.id !== id);
        
        // Remove from existing codes
        const deletedCourse = prev.find(c => c.id === id);
        if (deletedCourse) {
          setExistingCodes(prevCodes => ({
            ...prevCodes,
            courses: new Set([...prevCodes.courses].filter(code => 
              code !== deletedCourse.code.toUpperCase()
            ))
          }));
        }
        
        return updated;
      });
      
      setSuccessMessage('Course deleted successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Failed to delete course. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleAddDepartment = async () => {
    const errors = validateDepartmentForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    
    setValidationErrors({});
    setLoading(prev => ({ ...prev, departments: true }));
    
    try {
      await authFetch(`${API_BASE}/api/admin/departments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          code: deptFormData.code.trim().toUpperCase(),
          name: deptFormData.name.trim(),
          description: deptFormData.description.trim(),
          institutionId: admin.institutionId
        })
      });
      
      setSuccessMessage('Department added successfully!');
      setShowAddModal(false);
      resetDepartmentForm();
      fetchDepartments();
      
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Failed to add department. Please try again.');
    } finally {
      setLoading(prev => ({ ...prev, departments: false }));
    }
  };

  const handleDeleteDepartment = async (id, name) => {
    // Check if any courses are using this department
    const hasCourses = courses.some(c => c.departmentId === id);
    if (hasCourses) {
      setError(`Cannot delete "${name}" - it has associated courses`);
      setTimeout(() => setError(null), 5000);
      return;
    }
    
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    
    setDeletingId(id);
    
    try {
      await authFetch(
        `${API_BASE}/api/admin/departments/${id}?institutionId=${admin.institutionId}`,
        {
          method: 'DELETE'
        }
      );
      
      setDepartments(prev => {
        const updated = prev.filter(d => d.id !== id);
        
        // Remove from existing codes
        const deletedDept = prev.find(d => d.id === id);
        if (deletedDept) {
          setExistingCodes(prevCodes => ({
            ...prevCodes,
            departments: new Set([...prevCodes.departments].filter(code => 
              code !== deletedDept.departmentCode.toUpperCase()
            ))
          }));
        }
        
        return updated;
      });
      
      setSuccessMessage('Department deleted successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Failed to delete department. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  /* =========================
     FORM RESET FUNCTIONS
     ========================= */
  const resetCourseForm = () => {
    setFormData({
      id: '',
      name: '',
      description: '',
      departmentId: '',
      credits: 3,
      semester: 1
    });
    setValidationErrors({});
  };

  const resetDepartmentForm = () => {
    setDeptFormData({
      code: '',
      name: '',
      description: ''
    });
    setValidationErrors({});
  };

  /* =========================
     ENHANCED FILTERS
     ========================= */
  const filteredCourses = courses.filter(c => {
    const matchesSearch = 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.code.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSemester = 
      activeFilters.semester === 'all' || 
      c.semester.toString() === activeFilters.semester;
    
    const matchesCredits = 
      activeFilters.credits === 'all' || 
      c.credits.toString() === activeFilters.credits;
    
    return matchesSearch && matchesSemester && matchesCredits;
  });

  const filteredDepartments = departments.filter(d =>
    d.departmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.departmentCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /* =========================
     UI COMPONENTS
     ========================= */
  const StatsSection = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard 
        title="Total Courses" 
        value={courses.length} 
        icon={BookOpen}
        color="blue"
        loading={loading.courses}
      />
      <StatCard 
        title="Departments" 
        value={departments.length} 
        icon={Users}
        color="purple"
        loading={loading.departments}
      />
      <StatCard 
        title="Average Credits" 
        value={courses.length > 0 
          ? (courses.reduce((acc, c) => acc + c.credits, 0) / courses.length).toFixed(1)
          : '0'
        } 
        icon={GraduationCap}
        color="green"
        loading={loading.courses}
      />
      <StatCard 
        title="Active Semesters" 
        value={new Set(courses.map(c => c.semester)).size} 
        icon={Clock}
        color="orange"
        loading={loading.courses}
      />
    </div>
  );

  const ViewToggle = () => (
    <div className="flex gap-2 bg-slate-900/50 p-1.5 rounded-xl backdrop-blur-sm border border-slate-700/50">
      <button
        onClick={() => setView('courses')}
        className={`flex items-center gap-2 px-5 py-2.5 rounded-lg transition-all duration-300 ${
          view === 'courses' 
            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25' 
            : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
        }`}
      >
        <BookOpen size={18} />
        Courses ({courses.length})
      </button>
      <button
        onClick={() => setView('departments')}
        className={`flex items-center gap-2 px-5 py-2.5 rounded-lg transition-all duration-300 ${
          view === 'departments' 
            ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/25' 
            : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
        }`}
      >
        <Building2 size={18} />
        Departments ({departments.length})
      </button>
    </div>
  );

  const SearchAndAddBar = () => (
    <div className="flex flex-col md:flex-row justify-between items-center gap-4 p-4 bg-slate-900/30 rounded-xl border border-slate-700/30">
      <div className="relative w-full md:w-auto">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
        <input
          placeholder={`Search ${view} by name or code...`}
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 py-2.5 w-full md:w-80 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
      </div>
      
      {view === 'courses' && (
        <div className="flex gap-2">
          <select
            value={activeFilters.semester}
            onChange={e => setActiveFilters(prev => ({ ...prev, semester: e.target.value }))}
            className="px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Semesters</option>
            {[1,2,3,4,5,6,7,8].map(num => (
              <option key={num} value={num}>Semester {num}</option>
            ))}
          </select>
          <select
            value={activeFilters.credits}
            onChange={e => setActiveFilters(prev => ({ ...prev, credits: e.target.value }))}
            className="px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Credits</option>
            {[1,2,3,4,5,6].map(num => (
              <option key={num} value={num}>{num} Credit{num !== 1 ? 's' : ''}</option>
            ))}
          </select>
        </div>
      )}
      
      <button
        onClick={() => {
          if (view === 'courses') resetCourseForm();
          else resetDepartmentForm();
          setShowAddModal(true);
        }}
        className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 active:scale-95 transition-all duration-300 shadow-lg shadow-blue-500/25"
      >
        <Plus size={18} />
        Add {view === 'courses' ? 'Course' : 'Department'}
      </button>
    </div>
  );

  const CourseList = () => {
    if (loading.courses) {
      return (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <Loader2 className="animate-spin text-blue-500" size={48} />
          <p className="text-slate-400">Loading courses...</p>
        </div>
      );
    }

    if (error && !courses.length) {
      return (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <AlertCircle className="text-red-500" size={48} />
          <p className="text-slate-300">{error}</p>
          <button
            onClick={fetchCourses}
            className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600"
          >
            Retry
          </button>
        </div>
      );
    }

    if (!filteredCourses.length) {
      return (
        <div className="text-center py-20">
          <BookOpen className="mx-auto text-slate-400 mb-4" size={48} />
          <p className="text-slate-400 text-lg">No courses found</p>
          <p className="text-slate-500">Try changing your search or filters</p>
        </div>
      );
    }


    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredCourses.map(course => {
          const dept = departments.find(d => d.id === course.departmentId);
          return (
            <div 
              key={course.id} 
              className="group bg-gradient-to-br from-slate-800/50 to-slate-900/50 p-5 rounded-xl border border-slate-700/50 hover:border-blue-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="font-mono text-sm bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full border border-blue-500/30">
                      {course.code}
                    </span>
                    <span className="text-xs text-slate-400 bg-slate-800/50 px-2 py-1 rounded">
                      {course.credits} credit{course.credits !== 1 ? 's' : ''}
                    </span>
                    <span className="text-xs text-slate-400 bg-slate-800/50 px-2 py-1 rounded">
                      Sem {course.semester}
                    </span>
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-blue-300 transition-colors">
                    {course.name}
                  </h3>
                  {course.description && (
                    <p className="text-slate-400 text-sm mb-4 line-clamp-2">
                      {course.description}
                    </p>
                  )}
                  {dept && (
                    <div className="flex items-center gap-2 text-sm">
                      <Building2 size={14} className="text-purple-400" />
                      <span className="text-slate-400">Department:</span>
                      <span className="text-purple-300">{dept.departmentName}</span>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => handleDeleteCourse(course.id, course.name)}
                  disabled={deletingId === course.id}
                  className="opacity-0 group-hover:opacity-100 ml-4 p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all duration-300 disabled:opacity-50"
                >
                  {deletingId === course.id ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Trash2 size={18} />
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const DepartmentList = () => {
    if (loading.departments) {
      return (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <Loader2 className="animate-spin text-purple-500" size={48} />
          <p className="text-slate-400">Loading departments...</p>
        </div>
      );
    }

    if (error && !departments.length) {
      return (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <AlertCircle className="text-red-500" size={48} />
          <p className="text-slate-300">{error}</p>
          <button
            onClick={fetchDepartments}
            className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600"
          >
            Retry
          </button>
        </div>
      );
    }

    if (!filteredDepartments.length) {
      return (
        <div className="text-center py-20">
          <Building2 className="mx-auto text-slate-400 mb-4" size={48} />
          <p className="text-slate-400 text-lg">No departments found</p>
          <p className="text-slate-500">Try changing your search</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredDepartments.map(dept => {
          const deptCourses = courses.filter(c => c.departmentId === dept.id);
          return (
            <div 
              key={dept.id} 
              className="group bg-gradient-to-br from-slate-800/50 to-slate-900/50 p-5 rounded-xl border border-slate-700/50 hover:border-purple-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="font-mono text-lg font-bold bg-gradient-to-r from-purple-500 to-purple-600 text-transparent bg-clip-text">
                      {dept.departmentCode}
                    </span>
                    <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                    <span className="text-xs text-slate-400 bg-slate-800/50 px-2 py-1 rounded">
                      {deptCourses.length} course{deptCourses.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <h3 className="text-white font-bold text-xl mb-3 group-hover:text-purple-300 transition-colors">
                    {dept.departmentName}
                  </h3>
                  {dept.description && (
                    <p className="text-slate-400 mb-4">
                      {dept.description}
                    </p>
                  )}
                  {deptCourses.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm text-slate-400 mb-2">Sample courses:</p>
                      <div className="flex flex-wrap gap-2">
                        {deptCourses.slice(0, 3).map(c => (
                          <span key={c.id} className="text-xs bg-slate-800/70 text-slate-300 px-2 py-1 rounded">
                            {c.code}
                          </span>
                        ))}
                        {deptCourses.length > 3 && (
                          <span className="text-xs text-slate-500">
                            +{deptCourses.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => handleDeleteDepartment(dept.id, dept.departmentName)}
                  disabled={deletingId === dept.id}
                  className="opacity-0 group-hover:opacity-100 ml-4 p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all duration-300 disabled:opacity-50"
                >
                  {deletingId === dept.id ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Trash2 size={18} />
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    );
  };








  useEffect(() => {
    console.table(
      courses.map(c => ({
        code: c.code,
        deptId: c.departmentId
      }))
    );
  }, [courses]);






  return (
    <div className="courses-container space-y-6 p-4 md:p-6">
      {/* NOTIFICATION BANNERS */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 rounded-lg flex items-center gap-3 animate-fade-in">
          <AlertCircle size={20} />
          <p>{error}</p>
          <button onClick={() => setError(null)} className="ml-auto">
            <X size={18} />
          </button>
        </div>
      )}

      {successMessage && (
        <div className="bg-green-500/10 border border-green-500/30 text-green-300 px-4 py-3 rounded-lg flex items-center gap-3 animate-fade-in">
          <CheckCircle size={20} />
          <p>{successMessage}</p>
        </div>
      )}

      {/* STATS SECTION */}
      <StatsSection />

      {/* VIEW TOGGLE */}
      <ViewToggle />

      {/* SEARCH AND ADD BAR */}
      <SearchAndAddBar />

      {/* CONTENT */}
      <div className="mt-6">
        {view === 'courses' ? <CourseList /> : <DepartmentList />}
      </div>

      {/* ADD MODAL */}
      {showAddModal && (
        <EnhancedModal onClose={() => setShowAddModal(false)}>
          <div className="p-1">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-white">
                  Add {view === 'courses' ? 'New Course' : 'New Department'}
                </h3>
                <p className="text-slate-400 text-sm mt-1">
                  Fill in the details below
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {view === 'courses' ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Course Code *
                    </label>
                    <input
                      className={`w-full px-4 py-3 bg-slate-800/50 border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all ${
                        validationErrors.id 
                          ? 'border-red-500 focus:ring-red-500' 
                          : 'border-slate-700 focus:ring-blue-500 focus:border-transparent'
                      }`}
                      placeholder="e.g., CS101"
                      value={formData.id}
                      onChange={e => setFormData({ ...formData, id: e.target.value })}
                    />
                    {validationErrors.id && (
                      <p className="text-red-400 text-sm mt-1">{validationErrors.id}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Course Name *
                    </label>
                    <input
                      className={`w-full px-4 py-3 bg-slate-800/50 border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all ${
                        validationErrors.name 
                          ? 'border-red-500 focus:ring-red-500' 
                          : 'border-slate-700 focus:ring-blue-500 focus:border-transparent'
                      }`}
                      placeholder="e.g., Introduction to Programming"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                    />
                    {validationErrors.name && (
                      <p className="text-red-400 text-sm mt-1">{validationErrors.name}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Description
                  </label>
                  <textarea
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all"
                    rows={3}
                    placeholder="Course description..."
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Department *
                  </label>
                  <select
                    className={`w-full px-4 py-3 bg-slate-800/50 border rounded-lg text-white focus:outline-none focus:ring-2 transition-all ${
                      validationErrors.departmentId 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-slate-700 focus:ring-blue-500 focus:border-transparent'
                    }`}
                    value={formData.departmentId}
                    onChange={e => setFormData({ ...formData, departmentId: e.target.value })}
                  >
                    <option value="">Select a department</option>
                    {departments.map(d => (
                      <option key={d.id} value={d.id}>
                        {d.departmentCode} - {d.departmentName}
                      </option>
                    ))}
                  </select>
                  {validationErrors.departmentId && (
                    <p className="text-red-400 text-sm mt-1">{validationErrors.departmentId}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Credits *
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="1"
                        max="10"
                        className={`w-full px-4 py-3 bg-slate-800/50 border rounded-lg text-white focus:outline-none focus:ring-2 transition-all ${
                          validationErrors.credits 
                            ? 'border-red-500 focus:ring-red-500' 
                            : 'border-slate-700 focus:ring-blue-500 focus:border-transparent'
                        }`}
                        value={formData.credits}
                        onChange={e => setFormData({ ...formData, credits: parseInt(e.target.value) || '' })}
                      />
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400">
                        credits
                      </span>
                    </div>
                    {validationErrors.credits && (
                      <p className="text-red-400 text-sm mt-1">{validationErrors.credits}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Semester *
                    </label>
                    <div className="relative">
                      <select
                        className={`w-full px-4 py-3 bg-slate-800/50 border rounded-lg text-white focus:outline-none focus:ring-2 transition-all ${
                          validationErrors.semester 
                            ? 'border-red-500 focus:ring-red-500' 
                            : 'border-slate-700 focus:ring-blue-500 focus:border-transparent'
                        }`}
                        value={formData.semester}
                        onChange={e => setFormData({ ...formData, semester: parseInt(e.target.value) || '' })}
                      >
                        {[1,2,3,4,5,6,7,8].map(num => (
                          <option key={num} value={num}>Semester {num}</option>
                        ))}
                      </select>
                    </div>
                    {validationErrors.semester && (
                      <p className="text-red-400 text-sm mt-1">{validationErrors.semester}</p>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleAddCourse}
                    disabled={loading.courses}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading.courses ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 size={18} className="animate-spin" />
                        Adding Course...
                      </span>
                    ) : (
                      'Add Course'
                    )}
                  </button>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="px-6 py-3 bg-slate-700 text-white rounded-lg font-medium hover:bg-slate-600 active:scale-95 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Department Code *
                    </label>
                    <input
                      className={`w-full px-4 py-3 bg-slate-800/50 border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all ${
                        validationErrors.code 
                          ? 'border-red-500 focus:ring-red-500' 
                          : 'border-slate-700 focus:ring-purple-500 focus:border-transparent'
                      }`}
                      placeholder="e.g., CSE"
                      value={deptFormData.code}
                      onChange={e => setDeptFormData({ ...deptFormData, code: e.target.value.toUpperCase() })}
                    />
                    {validationErrors.code && (
                      <p className="text-red-400 text-sm mt-1">{validationErrors.code}</p>
                    )}
                    <p className="text-xs text-slate-500 mt-1">2-6 uppercase letters</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Department Name *
                    </label>
                    <input
                      className={`w-full px-4 py-3 bg-slate-800/50 border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all ${
                        validationErrors.name 
                          ? 'border-red-500 focus:ring-red-500' 
                          : 'border-slate-700 focus:ring-purple-500 focus:border-transparent'
                      }`}
                      placeholder="e.g., Computer Science"
                      value={deptFormData.name}
                      onChange={e => setDeptFormData({ ...deptFormData, name: e.target.value })}
                    />
                    {validationErrors.name && (
                      <p className="text-red-400 text-sm mt-1">{validationErrors.name}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Description
                  </label>
                  <textarea
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none transition-all"
                    rows={3}
                    placeholder="Department description..."
                    value={deptFormData.description}
                    onChange={e => setDeptFormData({ ...deptFormData, description: e.target.value })}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleAddDepartment}
                    disabled={loading.departments}
                    className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 text-white py-3 rounded-lg font-medium hover:from-purple-600 hover:to-purple-700 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading.departments ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 size={18} className="animate-spin" />
                        Adding Department...
                      </span>
                    ) : (
                      'Add Department'
                    )}
                  </button>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="px-6 py-3 bg-slate-700 text-white rounded-lg font-medium hover:bg-slate-600 active:scale-95 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </EnhancedModal>


      )}
    </div>
  );
}

/* =========================
   ENHANCED UI COMPONENTS
   ========================= */
function StatCard({ title, value, icon: Icon, color, loading }) {
  const colorClasses = {
    blue: 'from-blue-500/20 to-blue-600/20 border-blue-500/30',
    purple: 'from-purple-500/20 to-purple-600/20 border-purple-500/30',
    green: 'from-green-500/20 to-green-600/20 border-green-500/30',
    orange: 'from-orange-500/20 to-orange-600/20 border-orange-500/30'
  };

  const iconColors = {
    blue: 'text-blue-400',
    purple: 'text-purple-400',
    green: 'text-green-400',
    orange: 'text-orange-400'
  };

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} p-5 rounded-xl border backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-lg`}>
      <div className="flex justify-between items-center">
        <div>
          <p className="text-slate-400 text-sm mb-2">{title}</p>
          {loading ? (
            <div className="flex items-center gap-2">
              <Loader2 size={20} className={`animate-spin ${iconColors[color]}`} />
              <span className="text-white text-2xl font-bold">...</span>
            </div>
          ) : (
            <h3 className="text-white text-3xl font-bold">{value}</h3>
          )}
        </div>
        <div className={`p-3 rounded-full bg-slate-900/50 ${iconColors[color]}`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
}

// function EnhancedModal({ children, onClose }) {
//   return (
//     <div 
//       className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
//       onClick={onClose}
//     >
//       <div 
//         className="bg-gradient-to-b from-slate-900 to-slate-800 rounded-2xl border border-slate-700/50 w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-slide-up"
//         onClick={e => e.stopPropagation()}
//       >
//         {children}
//       </div>
//     </div>
//   );
// }


function EnhancedModal({ children, onClose }) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    // Add scoped class to body
    document.body.classList.add('courses-modal-open');
    
    // Store original styles
    const originalOverflow = document.body.style.overflow;
    const originalPosition = document.body.style.position;
    const originalTop = document.body.style.top;
    const originalWidth = document.body.style.width;
    const originalHeight = document.body.style.height;
    
    // Store scroll position
    const scrollY = window.scrollY;
    
    // Apply styles to prevent scrolling
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    document.body.style.height = '100%';
    
    return () => {
      // Remove scoped class
      document.body.classList.remove('courses-modal-open');
      
      // Restore original styles
      document.body.style.overflow = originalOverflow;
      document.body.style.position = originalPosition;
      document.body.style.top = originalTop;
      document.body.style.width = originalWidth;
      document.body.style.height = originalHeight;
      
      // Restore scroll position
      if (originalPosition !== 'fixed') {
        window.scrollTo(0, scrollY);
      }
    };
  }, []);

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEscape);
    
    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 bg-black/70 courses-modal-overlay backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-gradient-to-b from-slate-900 to-slate-800 rounded-2xl border border-slate-700/50 w-full max-w-2xl courses-modal-content animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}