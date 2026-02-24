import React, { useEffect, useState } from "react";
import { Filter, Search, Calendar, Clock, User, RefreshCw, Download, Eye,CheckCircle, XCircle, AlertCircle, PlayCircle,ChevronLeft, ChevronRight, Info} from "lucide-react";
import API_BASE from "../../../config/api";
import { authFetch } from "../../../utils/authFetch";

export default function SessionsTab() {
  const [sessions, setSessions] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedSession, setSelectedSession] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    fetchSessions();
  }, [statusFilter]);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      setError(null);

      let url = `${API_BASE}/api/admin/attendance/sessions`;

      if (statusFilter) {
        url += `?status=${statusFilter}`;
      }

      const response = await authFetch(url);

      if (!response.ok) {
        throw new Error("Failed to fetch sessions");
      }

      const data = await response.json();
      setSessions(data);
      setCurrentPage(1); 
    } catch (err) {
      console.error("Sessions fetch error:", err);
      setError("Unable to load sessions");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      ACTIVE: { 
        color: "bg-blue-500/20 text-blue-400 border-blue-500/30", 
        icon: PlayCircle,
        label: "Active"
      },
      FINALIZED: { 
        color: "bg-green-500/20 text-green-400 border-green-500/30", 
        icon: CheckCircle,
        label: "Finalized"
      },
      EXPIRED: { 
        color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30", 
        icon: AlertCircle,
        label: "Expired"
      },
    };

    const config = statusConfig[status] || statusConfig.EXPIRED;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${config.color}`}>
        <Icon size={12} />
        {config.label}
      </span>
    );
  };

  const formatDateTime = (dateTimeStr) => {
    const date = new Date(dateTimeStr);
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };
  };

  // Filter sessions based on search
  const filteredSessions = sessions.filter(session => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      session.sessionId?.toLowerCase().includes(searchLower) ||
      session.facultyId?.toLowerCase().includes(searchLower)
    );
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSessions = filteredSessions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredSessions.length / itemsPerPage);

  // Calculate statistics
  const stats = {
    total: sessions.length,
    active: sessions.filter(s => s.status === 'ACTIVE').length,
    finalized: sessions.filter(s => s.status === 'FINALIZED').length,
    expired: sessions.filter(s => s.status === 'EXPIRED').length,
  };

  const handleRefresh = () => {
    fetchSessions();
  };

  const handleViewDetails = (session) => {
    setSelectedSession(session);
    setShowDetailsModal(true);
  };

  const handleExport = () => {
    // Create CSV
    const headers = ['Session ID', 'Faculty ID', 'Start Time', 'Expiry Time', 'Status'];
    const csvData = sessions.map(s => [
      s.sessionId,
      s.facultyId,
      s.startTime,
      s.expiryTime,
      s.status
    ]);
    
    const csv = [headers, ...csvData].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sessions_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Clock className="text-blue-400 animate-pulse" size={24} />
          </div>
        </div>
        <p className="text-slate-400 mt-4">Loading sessions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16 bg-slate-800/30 rounded-xl border border-slate-700/50">
        <XCircle className="text-red-400 mx-auto mb-4" size={48} />
        <p className="text-red-400 text-lg mb-2">Failed to load sessions</p>
        <p className="text-slate-400 text-sm mb-4">{error}</p>
        <button 
          onClick={handleRefresh}
          className="px-6 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white transition-all inline-flex items-center gap-2"
        >
          <RefreshCw size={16} />
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-xl p-4">
          <p className="text-slate-400 text-xs">Total Sessions</p>
          <p className="text-2xl font-bold text-white mt-1">{stats.total}</p>
        </div>
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-xl p-4">
          <p className="text-slate-400 text-xs flex items-center gap-1">
            <PlayCircle size={12} className="text-blue-400" />
            Active
          </p>
          <p className="text-2xl font-bold text-blue-400 mt-1">{stats.active}</p>
        </div>
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-xl p-4">
          <p className="text-slate-400 text-xs flex items-center gap-1">
            <CheckCircle size={12} className="text-green-400" />
            Finalized
          </p>
          <p className="text-2xl font-bold text-green-400 mt-1">{stats.finalized}</p>
        </div>
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-xl p-4">
          <p className="text-slate-400 text-xs flex items-center gap-1">
            <AlertCircle size={12} className="text-yellow-400" />
            Expired
          </p>
          <p className="text-2xl font-bold text-yellow-400 mt-1">{stats.expired}</p>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-slate-800/30 border border-slate-700/50 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search by ID or Faculty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 w-64"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 pr-8 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white appearance-none cursor-pointer focus:outline-none focus:border-blue-500"
            >
              <option value="">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="FINALIZED">Finalized</option>
              <option value="EXPIRED">Expired</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-all"
            title="Refresh"
          >
            <RefreshCw size={18} />
          </button>
          <button
            onClick={handleExport}
            className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-all"
            title="Export to CSV"
          >
            <Download size={18} />
          </button>
        </div>
      </div>

      {/* Sessions Table */}
      <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-800/50 border-b border-slate-700/50">
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <Info size={14} />
                    Session Details
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <User size={14} />
                    Faculty
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} />
                    Start Time
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <Clock size={14} />
                    Expiry Time
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-700/50">
              {currentSessions.length === 0 ? ( 
                  <tr className="bg-transparent hover:bg-transparent">
                  <td colSpan="6" className="text-center py-12">
                    <div className="flex flex-col items-center">
                      <Calendar className="text-slate-600 mb-3" size={40} />
                      <p className="text-slate-400 text-sm">No sessions found</p>
                      <p className="text-slate-500 text-xs mt-1">Try adjusting your filters</p>
                    </div>
                  </td>
                </tr>
              ) : (
                currentSessions.map((session) => {
                  const start = formatDateTime(session.startTime);
                  const expiry = formatDateTime(session.expiryTime);
                  
                  return (
                    <tr
                      key={session.sessionId}
                      className="hover:bg-slate-800/40 transition-all group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center group-hover:bg-slate-600 transition">
                            <span className="text-xs font-mono text-slate-300">
                              #{session.sessionId.slice(-4)}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-mono text-white">{session.sessionId}</p>
                            <p className="text-xs text-slate-500">ID: {session.sessionId}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center">
                            <User className="text-purple-400" size={16} />
                          </div>
                          <span className="text-sm text-slate-300">{session.facultyId}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm text-white">{start.date}</p>
                          <p className="text-xs text-slate-500">{start.time}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm text-white">{expiry.date}</p>
                          <p className="text-xs text-slate-500">{expiry.time}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(session.status)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleViewDetails(session)}
                          className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-all"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredSessions.length > 0 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-700/50">
            <p className="text-sm text-slate-400">
              Showing <span className="font-medium text-white">{indexOfFirstItem + 1}</span> to{' '}
              <span className="font-medium text-white">
                {Math.min(indexOfLastItem, filteredSessions.length)}
              </span>{' '}
              of <span className="font-medium text-white">{filteredSessions.length}</span> sessions
            </p>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft size={18} />
              </button>
              
              <span className="text-sm text-white px-3 py-1 bg-slate-800 rounded-lg">
                Page {currentPage} of {totalPages}
              </span>
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Session Details Modal */}
      {showDetailsModal && selectedSession && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-800 border border-slate-700 rounded-xl w-full max-w-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Session Details</h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-400">Session ID</p>
                  <p className="text-sm text-white font-mono mt-1">{selectedSession.sessionId}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Faculty ID</p>
                  <p className="text-sm text-white mt-1">{selectedSession.facultyId}</p>
                </div>
              </div>
              
              <div>
                <p className="text-xs text-slate-400">Start Time</p>
                <p className="text-sm text-white mt-1">
                  {new Date(selectedSession.startTime).toLocaleString()}
                </p>
              </div>
              
              <div>
                <p className="text-xs text-slate-400">Expiry Time</p>
                <p className="text-sm text-white mt-1">
                  {new Date(selectedSession.expiryTime).toLocaleString()}
                </p>
              </div>
              
              <div>
                <p className="text-xs text-slate-400">Status</p>
                <div className="mt-1">
                  {getStatusBadge(selectedSession.status)}
                </div>
              </div>
            </div>
            
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}