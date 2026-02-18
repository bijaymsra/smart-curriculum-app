import React, { useEffect, useState } from "react";
import {
  Users,
  Target,
  Calendar,
  AlertTriangle,
  Activity,
  TrendingDown,
  TrendingUp,
  Clock,
} from "lucide-react";

import { useAdmin } from "../../context/AdminContext";
import API_BASE from "../../config/api";
import { authFetch } from "../../utils/authFetch";

export default function Analytics() {
  const { admin } = useAdmin();

  const [timeRange, setTimeRange] = useState("week");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ==============================
  // FETCH DASHBOARD ANALYTICS
  // ==============================

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

  // ==============================
  // LOADING
  // ==============================

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-purple-500"></div>
      </div>
    );
  }

  // ==============================
  // ERROR
  // ==============================

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="text-red-400 mx-auto mb-4" size={40} />
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  const kpis = data?.kpis || {};

  return (
    <div className="space-y-6">
      {/* ========================= */}
      {/* RANGE SELECTOR */}
      {/* ========================= */}
      <div className="flex justify-end gap-2">
        {["day", "week", "month"].map((range) => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              timeRange === range
                ? "bg-purple-600 text-white"
                : "bg-slate-800 text-slate-400 hover:bg-slate-700"
            }`}
          >
            {range.toUpperCase()}
          </button>
        ))}
      </div>

      {/* ========================= */}
      {/* KPI CARDS */}
      {/* ========================= */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Classroom Utilization */}
        <KpiCard
          title="Classroom Utilization"
          value={`${kpis.classroomUtilization || 0}%`}
          icon={<Target className="text-blue-400" size={22} />}
          trendUp
        />

        {/* Faculty Efficiency */}
        <KpiCard
          title="Faculty Efficiency"
          value={`${kpis.facultyEfficiency || 0}%`}
          icon={<Users className="text-purple-400" size={22} />}
          trendUp
        />

        {/* Attendance Rate */}
        <KpiCard
          title="Attendance Rate"
          value={`${kpis.attendanceRate || 0}%`}
          icon={<Activity className="text-green-400" size={22} />}
        />

        {/* Time Wastage */}
        <KpiCard
          title="Time Wastage"
          value={`${kpis.timeWastageHours || 0}h`}
          icon={<Clock className="text-orange-400" size={22} />}
        />
      </div>

      {/* ========================= */}
      {/* EMPTY STATE FOR NEXT PHASE */}
      {/* ========================= */}

      <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
        <h3 className="text-white font-semibold mb-2">
          Detailed Analytics (Coming Next)
        </h3>
        <p className="text-slate-400 text-sm">
          Room utilization, faculty workload, attendance trends and smart alerts
          will appear here.
        </p>
      </div>
    </div>
  );
}

// ======================================
// KPI CARD COMPONENT
// ======================================

function KpiCard({ title, value, icon, trendUp }) {
  return (
    <div className="bg-slate-800/50 backdrop-blur rounded-xl p-6 border border-slate-700">
      <div className="flex justify-between items-center mb-4">
        <div className="p-2 bg-slate-700 rounded-lg">{icon}</div>
      </div>

      <h3 className="text-2xl font-bold text-white">{value}</h3>
      <p className="text-sm text-slate-400 mt-1">{title}</p>

      <div className="mt-3 flex items-center gap-2">
        {trendUp ? (
          <TrendingUp size={16} className="text-green-400" />
        ) : (
          <TrendingDown size={16} className="text-red-400" />
        )}
      </div>
    </div>
  );
}
