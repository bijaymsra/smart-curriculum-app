import React, { useEffect, useState } from "react";
import { Users, Target, AlertTriangle, Activity, Clock, Calendar, BarChart3} from "lucide-react";
import {LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, CartesianGrid} from "recharts";
import { useAdmin } from "../../context/AdminContext";
import API_BASE from "../../config/api";
import { authFetch } from "../../utils/authFetch";

const COLORS = ["#8B5CF6", "#3B82F6", "#10B981", "#F59E0B", "#EF4444"];

export default function Analytics() {
  const { admin } = useAdmin();

  const [timeRange, setTimeRange] = useState("week");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnalytics = async (range) => {
    try {
      setLoading(true);
      setError(null);

      const response = await authFetch(
        `${API_BASE}/api/admin/analytics/dashboard?range=${range}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch analytics");
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      console.error("Analytics error:", err);
      setError("Unable to load analytics dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics(timeRange);
  }, [timeRange]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="text-red-400 mx-auto mb-4" size={40} />
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  const kpis = data?.kpis || {};
  const attendanceTrend = data?.attendanceTrend || [];
  const utilizationData = data?.utilizationBreakdown || [];
  const performanceData = data?.performanceDistribution || [];

  return (
    <div className="space-y-8">

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

      {/* RANGE SELECTOR */}
      <div className="flex justify-end gap-2">
        {["day", "week", "month"].map((range) => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              timeRange === range
                ? "bg-purple-600 text-white shadow-lg"
                : "bg-slate-800 text-slate-400 hover:bg-slate-700"
            }`}
          >
            {range.toUpperCase()}
          </button>
        ))}
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard
          title="Classroom Utilization"
          value={`${kpis.classroomUtilization || 0}%`}
          icon={<Target className="text-blue-400" size={22} />}
        />

        <KpiCard
          title="Faculty Efficiency"
          value={`${kpis.facultyEfficiency || 0}%`}
          icon={<Users className="text-purple-400" size={22} />}
        />

        <KpiCard
          title="Attendance Rate"
          value={`${kpis.attendanceRate || 0}%`}
          icon={<Activity className="text-green-400" size={22} />}
        />

        <KpiCard
          title="Time Wastage"
          value={`${kpis.timeWastageHours || 0}h`}
          icon={<Clock className="text-orange-400" size={22} />}
        />
      </div>

      {/* CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Attendance Trend */}
        <ChartCard title="Attendance Trend">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={attendanceTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="label" stroke="#94A3B8" />
              <YAxis stroke="#94A3B8" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#8B5CF6"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Utilization Breakdown */}
        <ChartCard title="Classroom Utilization">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={utilizationData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#94A3B8" />
              <YAxis stroke="#94A3B8" />
              <Tooltip />
              <Bar dataKey="value" fill="#3B82F6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Performance Distribution */}
        <ChartCard title="Performance Distribution" fullWidth>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={performanceData}
                dataKey="value"
                nameKey="name"
                innerRadius={70}
                outerRadius={100}
                paddingAngle={4}
              >
                {performanceData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

      </div>
    </div>
  );
}

/* ===================== */
/* KPI CARD */
/* ===================== */

function KpiCard({ title, value, icon}) {
  return (
    <div className="bg-slate-800/60 backdrop-blur rounded-2xl p-6 border border-slate-700 hover:shadow-xl transition">
      <div className="flex justify-between items-center mb-4">
        <div className="p-2 bg-slate-700 rounded-lg">{icon}</div>
      </div>

      <h3 className="text-3xl font-bold text-white">{value}</h3>
      <p className="text-sm text-slate-400 mt-1">{title}</p>
    </div>
  );
}

/* ===================== */
/* CHART CARD WRAPPER */
/* ===================== */

function ChartCard({ title, children, fullWidth }) {
  return (
    <div
      className={`bg-slate-800/60 backdrop-blur rounded-2xl p-6 border border-slate-700 ${
        fullWidth ? "lg:col-span-2" : ""
      }`}
    >
      <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
      {children}
    </div>
  );
}