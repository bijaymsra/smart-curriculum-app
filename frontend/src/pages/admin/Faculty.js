import React, { useState, useEffect } from 'react';
import { Users, GraduationCap, TrendingUp, AlertCircle, Plus, Clock, Search, Filter, Download, Eye, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';
import API_BASE from "../../config/api";
import { authFetch } from "../../utils/authFetch";

// API Service functions
const facultyApi = {
  // Get all faculty (paginated)
  getAllFaculty: async (institutionId, page = 0, size = 10, sortBy = 'createdAt', sortDir = 'desc') => {
    const response = await authFetch(
      `${API_BASE}/api/admin/faculty?institutionId=${institutionId}&page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch faculty: ${response.status} - ${errorText}`);
    }
    return response.json();
  },

  // Search faculty
  searchFaculty: async (institutionId, query) => {
    const response = await authFetch(
      `${API_BASE}/api/admin/faculty/search?institutionId=${institutionId}&query=${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error('Failed to search faculty');
    return response.json();
  },

  // Get faculty stats
  getFacultyStats: async (institutionId) => {
    const response = await authFetch(
      `${API_BASE}/api/admin/faculty/stats?institutionId=${institutionId}`);
    if (!response.ok) throw new Error('Failed to fetch faculty stats');
    return response.json();
  },

  // Filter faculty
  filterFaculty: async (institutionId, filters) => {
    const { status, department, utilization, search } = filters;
    let url = `${API_BASE}/api/admin/faculty/filter?institutionId=${institutionId}`;
    
    if (status && status !== 'all') url += `&status=${status}`;
    if (department && department !== 'all') url += `&department=${department}`;
    if (utilization && utilization !== 'all') url += `&utilization=${utilization}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;
    
    const response = await authFetch(url);
    if (!response.ok) throw new Error('Failed to filter faculty');
    return response.json();
  }
};

export default function Faculty() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [filterUtilization, setFilterUtilization] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(0); // 0-based for API
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [error, setError] = useState(null);
  
  const [faculty, setFaculty] = useState([]);
  const [stats, setStats] = useState([]);
  const { admin, loading: adminLoading } = useAdmin();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const STAT_CONFIG = {
    total: {
      label: 'Total Faculty',
      icon: GraduationCap,
      color: 'from-purple-500 to-purple-600',
      trend: 'up'
    },
    active: {
      label: 'Active',
      icon: Users,
      color: 'from-emerald-500 to-emerald-600',
      trend: 'up'
    },
    avgUtilization: {
      label: 'Avg Utilization',
      icon: TrendingUp,
      color: 'from-blue-500 to-blue-600',
      trend: 'up'
    },
    avgPunctuality: {
      label: 'Avg Punctuality',
      icon: Clock,
      color: 'from-orange-500 to-orange-600',
      trend: 'up'
    }
  };


const departments = [
  { code: 'CSE', name: 'Computer Science and Engineering' },
  { code: 'ECE', name: 'Electronics and Communication Engineering' },
  { code: 'ME', name: 'Mechanical Engineering' },
  { code: 'CE', name: 'Civil Engineering' },
  { code: 'EEE', name: 'Electrical and Electronics Engineering' },
  { code: 'IT', name: 'Information Technology' },
  { code: 'MATHS', name: 'Mathematics' },
  { code: 'PHYSICS', name: 'Physics' },
  { code: 'CHEMISTRY', name: 'Chemistry' },
  { code: 'MANAGEMENT', name: 'Management Studies' }
];


  // Redirect effect
  useEffect(() => {
    if (!adminLoading && !admin) {
      navigate('/login');
    }
  }, [adminLoading, admin, navigate]);

// Main fetch faculty data effect - SIMPLIFIED VERSION

useEffect(() => {
  if (adminLoading || !admin) return;
  
  const fetchInitialData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const institutionId = admin.institutionId || 1;
      
      // Fetch faculty data from API
      const facultyResponse = await facultyApi.getAllFaculty(
        institutionId,
        currentPage,
        itemsPerPage,
        'createdAt',
        'desc'
      );
      
      console.log('API Response:', facultyResponse);
      
      // Map API response to UI data structure
      const formattedFaculty = facultyResponse.content ? facultyResponse.content.map(faculty => ({
        id: faculty.publicId, 
        publicId: faculty.publicId || faculty.facultyId,
        facultyId: faculty.facultyId || 'N/A',
        fullName: faculty.name || faculty.fullName || `${faculty.firstName || ''} ${faculty.lastName || ''}`.trim(),
        email: faculty.email || 'No email',
        phone: faculty.phone || faculty.mobile || '+91 XXXXX XXXXX',
        department: faculty.departmentName || faculty.department || 'Not assigned',
        designation: faculty.designation || 'Not specified',
        qualification: faculty.qualification || 'Not specified',
        experience: faculty.experience || '0 years',
        subjects: faculty.subjects || ['Not assigned'],
        workload: faculty.workload || faculty.weeklyWorkloadHours ? `${faculty.weeklyWorkloadHours} hrs/week` : 'Not specified',
        utilization: faculty.utilizationPercentage || faculty.utilization || 0,
        punctuality: faculty.punctualityPercentage || faculty.punctuality || 0,
        idleHours: faculty.idleHours || 0,
        status: faculty.status || 'ACTIVE',
        joinDate: faculty.joinDate || faculty.createdAt || 'N/A',
        attendance: faculty.attendancePercentage || 0,
        performanceScore: faculty.performanceScore || 0,
        leavesTaken: faculty.leavesTaken || 0,
        leavesAvailable: faculty.leavesAvailable || 0,
        rating: faculty.rating || 0,
        lastActive: faculty.lastActive || 'N/A',
      })) : [];
      
      setFaculty(formattedFaculty);
      setTotalPages(facultyResponse.totalPages || 1);
      setTotalElements(facultyResponse.totalElements || formattedFaculty.length);
      
      // Calculate stats
      const totalFaculty = formattedFaculty.length;
      const activeFaculty = formattedFaculty.filter(f => f.status === 'ACTIVE').length;
      const avgUtilization = formattedFaculty.length > 0 
        ? formattedFaculty.reduce((sum, f) => sum + (f.utilization || 0), 0) / totalFaculty 
        : 0;
      const avgPunctuality = formattedFaculty.length > 0
        ? formattedFaculty.reduce((sum, f) => sum + (f.punctuality || 0), 0) / totalFaculty
        : 0;
      
      setStats([
        { ...STAT_CONFIG.total, value: totalFaculty },
        { ...STAT_CONFIG.active, value: activeFaculty },
        { ...STAT_CONFIG.avgUtilization, value: `${avgUtilization.toFixed(1)}%` },
        { ...STAT_CONFIG.avgPunctuality, value: `${avgPunctuality.toFixed(1)}%` }
      ]);
      
    } catch (error) {
      console.error('Error fetching faculty data:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Only fetch initial data if there are no active filters or search
  if (searchTerm.trim() === '' && 
      filterStatus === 'all' && 
      filterDepartment === 'all' && 
      filterUtilization === 'all') {
    fetchInitialData();
  }
  
}, [admin, adminLoading, currentPage, itemsPerPage]);




// Handle search with smooth UX
useEffect(() => {
  if (!admin) return;
  
  const handleSearch = async () => {
    try {
      setLoading(true);
      const institutionId = admin.institutionId || 1;
      
      if (searchTerm.trim() === '') {
        // If search is cleared, call the refetch function
        refetchFacultyData();
      } else {
        // If there's a search term, perform search
        const searchResults = await facultyApi.searchFaculty(institutionId, searchTerm);
        
        // Format search results
        const formattedResults = searchResults.map(faculty => ({
          id: faculty.publicId,
          publicId: faculty.publicId,
          facultyId: faculty.facultyId,
          fullName: faculty.name || faculty.fullName,
          email: faculty.email,
          department: faculty.departmentName || 'Not assigned',
          status: faculty.status || 'ACTIVE',
          utilization: faculty.utilizationPercentage || 0,
          subjects: faculty.subjects || ['Not assigned'],
          workload: faculty.workload || 'Not specified',
        }));
        
        setFaculty(formattedResults);
        setTotalPages(1);
        setTotalElements(formattedResults.length);
        setCurrentPage(0);
      }
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Debounce search to prevent too many API calls
  const debounceTimer = setTimeout(handleSearch, 500);
  return () => clearTimeout(debounceTimer);
}, [searchTerm, admin]);



// Handle filters with smooth UX
useEffect(() => {
  if (!admin) return;
  
  const handleFilter = async () => {
    try {
      setLoading(true);
      const institutionId = admin.institutionId || 1;
      
      // Check if all filters are cleared
      const isAllFiltersCleared = filterStatus === 'all' && 
                                  filterDepartment === 'all' && 
                                  filterUtilization === 'all';
      
      if (isAllFiltersCleared) {
        // If all filters are cleared, call the refetch function
        refetchFacultyData();
      } else {
        // If there are active filters, perform filter
        const filteredResults = await facultyApi.filterFaculty(institutionId, {
          status: filterStatus,
          department: filterDepartment,
          utilization: filterUtilization,
          search: searchTerm
        });
        
        const formattedResults = Array.isArray(filteredResults) ? 
          filteredResults.map(faculty => ({
            id: faculty.publicId,
            publicId: faculty.publicId,
            facultyId: faculty.facultyId,
            fullName: faculty.name || faculty.fullName,
            email: faculty.email,
            department: faculty.departmentName || 'Not assigned',
            status: faculty.status || 'ACTIVE',
            utilization: faculty.utilizationPercentage || 0,
            subjects: faculty.subjects || ['Not assigned'],
            workload: faculty.workload || 'Not specified',
          })) : [];
        
        setFaculty(formattedResults);
        setTotalPages(1);
        setTotalElements(formattedResults.length);
        setCurrentPage(0);
      }
    } catch (error) {
      console.error('Filter failed:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Debounce filter changes
  const filterTimer = setTimeout(handleFilter, 300);
  return () => clearTimeout(filterTimer);
}, [filterStatus, filterDepartment, filterUtilization, admin, searchTerm]);

  // Reset to page 0 when filters change
  useEffect(() => {
    setCurrentPage(0);
  }, [filterStatus, filterDepartment, filterUtilization]);

  // Pagination calculations
  const totalPagesAPI = Math.max(1, totalPages);
  const currentPageUI = currentPage + 1; // Convert to 1-based for UI
  const startIndex = currentPage * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalElements);

  // Pagination handlers
  const goToPage = (page) => {
    const pageIndex = page - 1; // Convert to 0-based for API
    if (pageIndex >= 0 && pageIndex < totalPagesAPI) {
      setCurrentPage(pageIndex);
    }
  };

  const nextPage = () => {
    if (currentPage < totalPagesAPI - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToFirstPage = () => goToPage(1);
  const goToLastPage = () => goToPage(totalPagesAPI);

  // Generate page numbers with ellipsis
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPagesAPI <= maxVisiblePages) {
      for (let i = 1; i <= totalPagesAPI; i++) pages.push(i);
    } else {
      if (currentPageUI <= 3) {
        pages.push(1, 2, 3, '...', totalPagesAPI);
      } else if (currentPageUI >= totalPagesAPI - 2) {
        pages.push(1, '...', totalPagesAPI - 2, totalPagesAPI - 1, totalPagesAPI);
      } else {
        pages.push(1, '...', currentPageUI - 1, currentPageUI, currentPageUI + 1, '...', totalPagesAPI);
      }
    }
    
    return pages;
  };



  // Function to refetch main faculty data
const refetchFacultyData = async () => {
  try {
    setLoading(true);
    const institutionId = admin?.institutionId || 1;
    
    const facultyResponse = await facultyApi.getAllFaculty(
      institutionId,
      currentPage,
      itemsPerPage,
      'createdAt',
      'desc'
    );
    
    const formattedFaculty = facultyResponse.content ? facultyResponse.content.map(faculty => ({
      id: faculty.publicId, 
      publicId: faculty.publicId || faculty.facultyId,
      facultyId: faculty.facultyId || 'N/A',
      fullName: faculty.name || faculty.fullName || `${faculty.firstName || ''} ${faculty.lastName || ''}`.trim(),
      email: faculty.email || 'No email',
      phone: faculty.phone || faculty.mobile || '+91 XXXXX XXXXX',
      department: faculty.departmentName || faculty.department || 'Not assigned',
      designation: faculty.designation || 'Not specified',
      qualification: faculty.qualification || 'Not specified',
      experience: faculty.experience || '0 years',
      subjects: faculty.subjects || ['Not assigned'],
      workload: faculty.workload || faculty.weeklyWorkloadHours ? `${faculty.weeklyWorkloadHours} hrs/week` : 'Not specified',
      utilization: faculty.utilizationPercentage || faculty.utilization || 0,
      punctuality: faculty.punctualityPercentage || faculty.punctuality || 0,
      idleHours: faculty.idleHours || 0,
      status: faculty.status || 'ACTIVE',
      joinDate: faculty.joinDate || faculty.createdAt || 'N/A',
      attendance: faculty.attendancePercentage || 0,
      performanceScore: faculty.performanceScore || 0,
      leavesTaken: faculty.leavesTaken || 0,
      leavesAvailable: faculty.leavesAvailable || 0,
      rating: faculty.rating || 0,
      lastActive: faculty.lastActive || 'N/A',
    })) : [];
    
    setFaculty(formattedFaculty);
    setTotalPages(facultyResponse.totalPages || 1);
    setTotalElements(facultyResponse.totalElements || formattedFaculty.length);
    
  } catch (error) {
    console.error('Error refetching faculty data:', error);
    setError(error.message);
  } finally {
    setLoading(false);
  }
};





  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'WARNING': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'SUSPENDED': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'ON_LEAVE': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  // Get utilization color
  const getUtilizationColor = (utilization) => {
    if (utilization >= 90) return 'bg-red-500/20 text-red-400 border-red-500/30';
    if (utilization >= 75) return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    if (utilization >= 60) return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
    return 'bg-red-500/20 text-red-400 border-red-500/30';
  };

  // Calculate insights from real data
  const calculateInsights = () => {
    if (faculty.length === 0) return [];
    
    const highUtilization = faculty.filter(f => f.utilization >= 90).length;
    const optimalUtilization = faculty.filter(f => f.utilization >= 75 && f.utilization < 90).length;
    const lowUtilization = faculty.filter(f => f.utilization < 60).length;
    const optimalPercentage = faculty.length > 0 ? Math.round((optimalUtilization / faculty.length) * 100) : 0;
    
    return [
      {
        title: 'High Utilization Faculty',
        message: `${highUtilization} faculty member${highUtilization !== 1 ? 's' : ''} with >90% utilization`,
        count: highUtilization,
        color: 'from-red-500/10 to-red-600/5',
        border: 'border-red-500/20'
      },
      {
        title: 'Optimal Performance',
        message: `${optimalPercentage}% of faculty maintaining 75-90% utilization`,
        count: optimalPercentage,
        color: 'from-emerald-500/10 to-emerald-600/5',
        border: 'border-emerald-500/20'
      },
      {
        title: 'Low Utilization Alert',
        message: `${lowUtilization} faculty member${lowUtilization !== 1 ? 's' : ''} with <60% utilization`,
        count: lowUtilization,
        color: 'from-orange-500/10 to-orange-600/5',
        border: 'border-orange-500/20'
      }
    ];
  };

  const insights = calculateInsights();

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center p-8 bg-red-900/20 border border-red-700/50 rounded-2xl">
          <AlertCircle className="text-red-400 mx-auto mb-4" size={48} />
          <h2 className="text-2xl font-bold text-white mb-2">Error Loading Faculty Data</h2>
          <p className="text-slate-300 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (adminLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-4 text-slate-300 text-lg">Loading faculty management...</p>
        </div>
      </div>
    );
  }

  if (!admin) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="group bg-slate-800/30 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 hover:border-purple-500/30 transition-all hover:transform hover:scale-[1.02]">
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 bg-gradient-to-r ${stat.color} rounded-xl group-hover:shadow-lg transition-shadow`}>
                <stat.icon size={24} className="text-white" />
              </div>
              <div className={`flex items-center gap-1 text-xs font-medium ${stat.trend === 'up' ? 'text-green-400' : 'text-slate-400'}`}>
                <TrendingUp size={14} className={stat.trend === 'down' ? 'rotate-180' : ''} />
                {stat.trend === 'up' ? '+2.5%' : '-1.2%'}
              </div>
            </div>
            <p className="text-slate-400 text-sm mb-1">{stat.label}</p>
            <p className="text-3xl font-bold text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Insights Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {insights.map((insight, idx) => (
          <div key={idx} className={`bg-gradient-to-br ${insight.color} border ${insight.border} rounded-xl p-4`}>
            <div className="flex items-center gap-3">
              <AlertCircle className={
                idx === 0 ? "text-red-400" :
                idx === 1 ? "text-emerald-400" :
                "text-orange-400"
              } size={20} />
              <div>
                <p className="text-slate-400 text-xs">{insight.title}</p>
                <p className="text-white font-semibold">{insight.message}</p>
              </div>
            </div>
          </div>
        ))}
      </div>


      {/* Main Content */}
      <div className="bg-slate-800/30 backdrop-blur-xl rounded-2xl border border-slate-700/50 overflow-hidden">
        {/* Header with Enhanced Controls */}
        <div className="p-6 border-b border-slate-700/50 bg-slate-800/50">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">Faculty Management</h2>
              <p className="text-slate-400 text-sm">
                Showing <span className="text-white font-medium">{faculty.length}</span> of{' '}
                <span className="text-white font-medium">{totalElements}</span> faculty members
                {searchTerm && ` for "${searchTerm}"`}
                {filterStatus !== 'all' && ` with status: ${filterStatus}`}
                {filterDepartment !== 'all' && ` in ${departments.find(d => d.code === filterDepartment)?.name || filterDepartment}`}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex-1 lg:flex-none lg:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="text"
                  placeholder="Search by name, ID, email, department..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                />
              </div>

              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-3 bg-slate-700/50 hover:bg-slate-700 text-white rounded-xl transition-colors flex items-center gap-2 border border-slate-600/50"
              >
                <Filter size={20} />
                Filters
              </button>

              <button className="px-4 py-3 bg-slate-700/50 hover:bg-slate-700 text-white rounded-xl transition-colors flex items-center gap-2 border border-slate-600/50">
                <Download size={20} />
                Export
              </button>

              <button
                onClick={() => navigate("/admin/faculty/new")}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium flex items-center gap-2 hover:shadow-lg hover:shadow-purple-500/20 transition-all"
              >
                <Plus size={20} />
                Add Faculty
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
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="all">All Status</option>
                    <option value="ACTIVE">Active</option>
                    <option value="WARNING">Warning</option>
                    <option value="SUSPENDED">Suspended</option>
                    <option value="ON_LEAVE">On Leave</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 text-xs mb-2 block">Department</label>
                  <select
                    value={filterDepartment}
                    onChange={(e) => setFilterDepartment(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="all">All Departments</option>
                    {departments.map(dept => (
                      <option key={dept.code} value={dept.code}>{dept.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 text-xs mb-2 block">Utilization</label>
                  <select
                    value={filterUtilization}
                    onChange={(e) => setFilterUtilization(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="all">All</option>
                    <option value="high">High (&gt;90%)</option>
                    <option value="medium">Medium (70-90%)</option>
                    <option value="low">Low (&lt;70%)</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button 
                    onClick={() => {
                      setFilterStatus('all');
                      setFilterDepartment('all');
                      setFilterUtilization('all');
                      setSearchTerm('');
                      setCurrentPage(0);
                      if (admin) {
                        refetchFacultyData();
                      }
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
                          setCurrentPage(0);
                        }}
                        className={`px-3 py-1 text-sm rounded-md transition-all ${
                          itemsPerPage === size
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/20'
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
                    <span className="text-white font-medium">{Math.min(endIndex, totalElements)}</span> of{' '}
                    <span className="text-white font-medium">{totalElements}</span> records
                  </p>
                </div>
              </div>

              {/* Page Navigation - Compact */}
              <div className="flex items-center gap-2">
                <button
                  onClick={goToFirstPage}
                  disabled={currentPage === 0}
                  className="p-2 hover:bg-slate-700/50 rounded-lg transition-all border border-slate-600/50 disabled:opacity-40 disabled:cursor-not-allowed"
                  title="First Page"
                >
                  <ChevronsLeft size={18} className="text-slate-400" />
                </button>

                <button
                  onClick={prevPage}
                  disabled={currentPage === 0}
                  className="px-3 py-2 hover:bg-slate-700/50 rounded-lg transition-all border border-slate-600/50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={16} className="text-slate-400" />
                </button>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-400">Page</span>
                  <input
                    type="number"
                    min="1"
                    max={totalPagesAPI}
                    value={currentPage + 1}
                    onChange={(e) => {
                      const page = Math.max(1, Math.min(totalPagesAPI, Number(e.target.value) || 1));
                      goToPage(page);
                    }}
                    className="w-14 bg-slate-800/50 border border-slate-700 rounded-lg px-2 py-1 text-sm text-white text-center focus:outline-none focus:border-purple-500"
                  />
                  <span className="text-sm text-slate-400">of {totalPagesAPI}</span>
                </div>

                <button
                  onClick={nextPage}
                  disabled={currentPage >= totalPagesAPI - 1}
                  className="px-3 py-2 hover:bg-slate-700/50 rounded-lg transition-all border border-slate-600/50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={16} className="text-slate-400" />
                </button>

                <button
                  onClick={goToLastPage}
                  disabled={currentPage >= totalPagesAPI - 1}
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
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-widest">Faculty</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-widest">UID</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-widest">Department</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-widest">Subjects</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-widest">Workload</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-widest">Utilization</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {faculty.length > 0 ? (
                faculty.map((facultyItem, idx) => (
                  <tr key={idx} className="hover:bg-slate-700/20 transition-all group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-11 h-11 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white font-semibold shadow-lg">
                            {facultyItem.fullName.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-slate-800 ${
                            facultyItem.status === 'ACTIVE' ? 'bg-green-400' : 
                            facultyItem.status === 'WARNING' ? 'bg-orange-400' : 
                            'bg-red-400'
                          }`}></div>
                        </div>
                        <div>
                          <p className="text-white font-medium group-hover:text-purple-400 transition-colors">{facultyItem.fullName}</p>
                          <p className="text-slate-400 text-xs">{facultyItem.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-slate-300 font-mono text-sm">{facultyItem.facultyId}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-lg text-xs font-medium border border-purple-500/30">
                        {facultyItem.department || 'Not assigned'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {facultyItem.subjects?.slice(0, 2).map((subject, i) => (
                          <span key={i} className="px-2 py-1 bg-slate-700/50 text-slate-300 text-xs rounded-lg">
                            {subject}
                          </span>
                        ))}
                        {facultyItem.subjects?.length > 2 && (
                          <span className="px-2 py-1 bg-slate-700/50 text-slate-400 text-xs rounded-lg">
                            +{facultyItem.subjects.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-300">{facultyItem.workload}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-lg text-xs font-semibold border ${getUtilizationColor(facultyItem.utilization)}`}>
                        {facultyItem.utilization}%
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${getStatusColor(facultyItem.status)}`}>
                        {facultyItem.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => navigate(`/admin/faculty/${facultyItem.publicId}`)}
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
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <GraduationCap className="text-slate-500" size={48} />
                      <div>
                        <p className="text-slate-300 font-medium">No faculty members found</p>
                        <p className="text-slate-500 text-sm mt-1">
                          {searchTerm || filterStatus !== 'all' || filterDepartment !== 'all' 
                            ? 'Try changing your search or filter criteria'
                            : 'No faculty members in the system yet'
                          }
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Bottom Pagination - Enhanced & Sticky */}
        {faculty.length > 0 && (
          <div className="sticky bottom-0 z-10 px-6 py-4 border-t border-slate-700/50 bg-slate-800/50 backdrop-blur-sm">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              {/* Records Info */}
              <div className="text-sm text-slate-400">
                Showing <span className="text-white font-medium">{startIndex + 1}</span>-
                <span className="text-white font-medium">{Math.min(endIndex, totalElements)}</span> of{' '}
                <span className="text-white font-medium">{totalElements}</span> entries
                <span className="ml-3 text-slate-500">|</span>
                <span className="ml-3">
                  Page <span className="text-white font-medium">{currentPage + 1}</span> of{' '}
                  <span className="text-white font-medium">{totalPagesAPI}</span>
                </span>
              </div>

              {/* Full Pagination Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={goToFirstPage}
                  disabled={currentPage === 0}
                  className="p-2 hover:bg-slate-700/50 rounded-lg transition-all border border-slate-600/50 disabled:opacity-40 disabled:cursor-not-allowed"
                  title="First Page"
                >
                  <ChevronsLeft size={18} className="text-slate-400" />
                </button>

                <button
                  onClick={prevPage}
                  disabled={currentPage === 0}
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
                          currentPageUI === page
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/20'
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
                  disabled={currentPage >= totalPagesAPI - 1}
                  className="p-2 hover:bg-slate-700/50 rounded-lg transition-all border border-slate-600/50 disabled:opacity-40 disabled:cursor-not-allowed"
                  title="Next Page"
                >
                  <ChevronRight size={18} className="text-slate-400" />
                </button>

                <button
                  onClick={goToLastPage}
                  disabled={currentPage >= totalPagesAPI - 1}
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
                    max={totalPagesAPI}
                    value={currentPage + 1}
                    onChange={(e) => {
                      const page = Math.max(1, Math.min(totalPagesAPI, Number(e.target.value) || 1));
                      goToPage(page);
                    }}
                    className="w-16 bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-purple-500"
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-slate-500">
                    /{totalPagesAPI}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Floating Quick Navigation (appears when scrolled) */}
        {faculty.length > 10 && (
          <div className="fixed bottom-6 right-6 z-50 hidden lg:block">
            <div className="bg-slate-800/90 backdrop-blur-sm border border-slate-700 rounded-xl shadow-2xl p-3 flex flex-col gap-2">
              <div className="text-xs text-slate-400 text-center mb-1">Quick Nav</div>
              <div className="flex flex-col gap-1">
                <button
                  onClick={goToFirstPage}
                  disabled={currentPage === 0}
                  className="p-2 hover:bg-slate-700/50 rounded-lg transition-all disabled:opacity-40"
                  title="First Page"
                >
                  <ChevronsLeft size={14} className="text-slate-400" />
                </button>
                <button
                  onClick={prevPage}
                  disabled={currentPage === 0}
                  className="p-2 hover:bg-slate-700/50 rounded-lg transition-all disabled:opacity-40"
                  title="Previous Page"
                >
                  <ChevronLeft size={14} className="text-slate-400" />
                </button>
                <div className="text-center text-xs text-slate-300 py-1">
                  {currentPage + 1}<span className="text-slate-500">/{totalPagesAPI}</span>
                </div>
                <button
                  onClick={nextPage}
                  disabled={currentPage >= totalPagesAPI - 1}
                  className="p-2 hover:bg-slate-700/50 rounded-lg transition-all disabled:opacity-40"
                  title="Next Page"
                >
                  <ChevronRight size={14} className="text-slate-400" />
                </button>
                <button
                  onClick={goToLastPage}
                  disabled={currentPage >= totalPagesAPI - 1}
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
