import React, { useEffect, useState } from "react";
import { Activity, AlertTriangle, CheckCircle, Clock, ArrowUp, ArrowDown,PieChart, BarChart3, Target, Eye} from "lucide-react";
import API_BASE from "../../../config/api";
import { authFetch } from "../../../utils/authFetch";
import {
  BarChart, Bar, PieChart as RePieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer
} from 'recharts';

export default function OverviewTab() {

  const [data, setData] = useState({
    activeSessions: 0,
    finalizedToday: 0,
    pendingReviews: 0,
    flaggedSubmissions: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOverview();
  }, []);

  const fetchOverview = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await authFetch(
        `${API_BASE}/api/admin/attendance/overview`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch overview stats");
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      console.error("Overview fetch error:", err);
      setError("Unable to load attendance overview");
    } finally {
      setLoading(false);
    }
  };

  // Prepare data for pie chart based on actual values
  const getPieChartData = () => {
    return [
      { name: 'Active Sessions', value: data.activeSessions, color: '#3B82F6' },
      { name: 'Finalized Today', value: data.finalizedToday, color: '#10B981' },
      { name: 'Pending Reviews', value: data.pendingReviews, color: '#F59E0B' },
      { name: 'Flagged', value: data.flaggedSubmissions, color: '#EF4444' },
    ].filter(item => item.value > 0); // Only show non-zero values
  };

  // Prepare data for comparison bar chart
  const getComparisonData = () => {
    return [
      { metric: 'Active', value: data.activeSessions, fullLabel: 'Active Sessions', color: '#3B82F6' },
      { metric: 'Finalized', value: data.finalizedToday, fullLabel: 'Finalized Today', color: '#10B981' },
      { metric: 'Pending', value: data.pendingReviews, fullLabel: 'Pending Reviews', color: '#F59E0B' },
      { metric: 'Flagged', value: data.flaggedSubmissions, fullLabel: 'Flagged Submissions', color: '#EF4444' },
    ];
  };

  // Calculate total for percentages
  const total = data.activeSessions + data.finalizedToday + data.pendingReviews + data.flaggedSubmissions;

  const Card = ({ title, value, icon, color, trend, subtitle }) => {
    // Calculate percentage of total if total > 0
    const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
    
    return (
      <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-xl p-6 hover:border-slate-600/50 transition-all group">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-slate-400 text-sm font-medium flex items-center gap-2">
              {title}
              {percentage > 0 && (
                <span className="text-xs bg-slate-700 px-2 py-0.5 rounded-full">
                  {percentage}%
                </span>
              )}
            </p>
            <div className="flex items-baseline gap-2 mt-2">
              <h3 className={`text-3xl font-bold ${color}`}>
                {value}
              </h3>
              {trend && (
                <span className={`flex items-center text-xs font-medium ${
                  trend > 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {trend > 0 ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                  {Math.abs(trend)}%
                </span>
              )}
            </div>
            {subtitle && (
              <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
            )}
          </div>
          <div className={`p-3 rounded-xl bg-${color.split('-')[1]}-500/10 group-hover:scale-110 transition-transform`}>
            {icon}
          </div>
        </div>
        
        {/* Mini progress bar */}
        <div className="mt-4 h-1 bg-slate-700 rounded-full overflow-hidden">
          <div 
            className={`h-full ${color.replace('text', 'bg')}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Activity className="text-blue-400 animate-pulse" size={24} />
          </div>
        </div>
        <p className="text-slate-400 mt-4">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16 bg-slate-800/30 rounded-xl border border-slate-700/50">
        <AlertTriangle className="text-red-400 mx-auto mb-4" size={48} />
        <p className="text-red-400 text-lg mb-2">Unable to load data</p>
        <p className="text-slate-400 text-sm mb-4">{error}</p>
        <button 
          onClick={fetchOverview}
          className="px-6 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white transition-all"
        >
          Try Again
        </button>
      </div>
    );
  }

  const pieData = getPieChartData();
  const comparisonData = getComparisonData();
  const hasData = total > 0;

  return (
    <div className="space-y-8">
      {/* Main Stats Grid - Your original cards enhanced */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card
          title="Active Sessions"
          value={data.activeSessions}
          color="text-blue-400"
          icon={<Activity className="text-blue-400" size={28} />}
          subtitle="Currently live"
        />

        <Card
          title="Finalized Today"
          value={data.finalizedToday}
          color="text-green-400"
          icon={<CheckCircle className="text-green-400" size={28} />}
          subtitle="Completed sessions"
        />

        <Card
          title="Pending Reviews"
          value={data.pendingReviews}
          color="text-yellow-400"
          icon={<Clock className="text-yellow-400" size={28} />}
          subtitle="Awaiting approval"
        />

        <Card
          title="Flagged Submissions"
          value={data.flaggedSubmissions}
          color="text-red-400"
          icon={<AlertTriangle className="text-red-400" size={28} />}
          subtitle="Need attention"
        />
      </div>

      {/* Charts Section - Only show if there's data */}
      {hasData ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pie Chart - Status Distribution */}
          <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-white font-semibold flex items-center gap-2">
                  <PieChart size={20} className="text-blue-400" />
                  Status Distribution
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Based on {total} total items
                </p>
              </div>
            </div>
            
            <ResponsiveContainer width="100%" height={300}>
              <RePieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  labelLine={{ stroke: '#64748B', strokeWidth: 1 }}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1E293B', 
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                  formatter={(value, name) => [`${value} items`, name]}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  formatter={(value) => <span className="text-slate-300 text-sm">{value}</span>}
                />
              </RePieChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart - Direct Comparison */}
          <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-white font-semibold flex items-center gap-2">
                  <BarChart3 size={20} className="text-blue-400" />
                  Metrics Comparison
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Direct comparison of all metrics
                </p>
              </div>
            </div>
            
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="metric" stroke="#94A3B8" />
                <YAxis stroke="#94A3B8" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1E293B', 
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                  formatter={(value, name, props) => [value, props.payload.fullLabel]}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {comparisonData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        // Empty state when no data
        <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-12 text-center">
          <Target className="text-slate-600 mx-auto mb-4" size={48} />
          <h3 className="text-white font-semibold mb-2">No Data Available</h3>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            Charts will appear here once there's activity in the system. 
            Current metrics show zero values.
          </p>
        </div>
      )}

      {/* Summary Footer - Shows when data exists */}
      {hasData && (
        <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <Eye className="text-slate-400" size={20} />
              <span className="text-sm text-slate-300">
                Quick Summary: {
                  data.activeSessions > 0 && `${data.activeSessions} active • `
                }
                {data.finalizedToday > 0 && `${data.finalizedToday} finalized • `}
                {data.pendingReviews > 0 && `${data.pendingReviews} pending • `}
                {data.flaggedSubmissions > 0 && `${data.flaggedSubmissions} flagged`}
              </span>
            </div>
            
            {/* Mini legend */}
            <div className="flex gap-3">
              {data.activeSessions > 0 && (
                <span className="flex items-center gap-1 text-xs">
                  <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                  <span className="text-slate-400">Active</span>
                </span>
              )}
              {data.finalizedToday > 0 && (
                <span className="flex items-center gap-1 text-xs">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  <span className="text-slate-400">Finalized</span>
                </span>
              )}
              {data.pendingReviews > 0 && (
                <span className="flex items-center gap-1 text-xs">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                  <span className="text-slate-400">Pending</span>
                </span>
              )}
              {data.flaggedSubmissions > 0 && (
                <span className="flex items-center gap-1 text-xs">
                  <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                  <span className="text-slate-400">Flagged</span>
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}