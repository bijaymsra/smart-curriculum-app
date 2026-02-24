import React, { useEffect, useState } from 'react';
import { BarChart3, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import API_BASE from "../../config/api";
import { authFetch } from "../../utils/authFetch";


const FacultyAnalytics = () => {

  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await authFetch(
        `${API_BASE}/api/faculty/analytics/me`
      );

      if (!res.ok) throw new Error("Failed to fetch analytics");

      const data = await res.json();
      setAnalytics(data);

    } catch (err) {
      console.error("Analytics error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-slate-400">
        Loading analytics...
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center py-20 text-red-400">
        Unable to load analytics.
      </div>
    );
  }

  return (
    <div className="space-y-8">

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        <Card
          title="Total Sessions"
          value={analytics.overview.totalSessions}
          icon={<BarChart3 size={24} />}
        />

        <Card
          title="Completion Rate"
          value={`${analytics.overview.completionRate.toFixed(1)}%`}
          icon={<CheckCircle size={24} />}
        />

        <Card
          title="Avg Session Duration"
          value={`${analytics.overview.averageSessionDurationMinutes} min`}
          icon={<Clock size={24} />}
        />

        <Card
          title="Expired Sessions"
          value={analytics.overview.expiredSessions}
          icon={<AlertCircle size={24} />}
        />

      </div>

      <SectionWrapper title="Attendance Performance">

        <StatRow
          label="Average Attendance"
          value={`${analytics.attendanceStats.averageAttendancePercentage.toFixed(1)}%`}
        />

        <StatRow
          label="Highest Attendance"
          value={`${analytics.attendanceStats.highestAttendancePercentage.toFixed(1)}%`}
        />

        <StatRow
          label="Lowest Attendance"
          value={`${analytics.attendanceStats.lowestAttendancePercentage.toFixed(1)}%`}
        />

      </SectionWrapper>

      <SectionWrapper title="Punctuality Metrics">

        <StatRow
          label="Punctuality Percentage"
          value={`${analytics.punctualityStats.punctualityPercentage.toFixed(1)}%`}
        />

        <StatRow
          label="On-Time Sessions"
          value={analytics.punctualityStats.onTimeSessions}
        />

        <StatRow
          label="Late Sessions"
          value={analytics.punctualityStats.lateSessions}
        />

        <StatRow
          label="Average Delay"
          value={`${analytics.punctualityStats.averageDelayMinutes.toFixed(1)} min`}
        />

      </SectionWrapper>

      <SectionWrapper title="Subject Performance">

        {analytics.subjectStats.length === 0 ? (
          <div className="text-slate-400 text-center py-6">
            No subject analytics available.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {analytics.subjectStats.map((subject, index) => (
              <div
                key={index}
                className="bg-slate-900/50 p-4 rounded-xl border border-slate-700"
              >
                <div className="text-lg font-bold text-white">
                  {subject.subjectCode}
                </div>
                <div className="text-slate-400 text-sm mb-2">
                  Sessions: {subject.sessionsConducted}
                </div>
                <div className="text-emerald-400 font-semibold">
                  Avg Attendance: {subject.averageAttendancePercentage.toFixed(1)}%
                </div>
              </div>
            ))}
          </div>
        )}

      </SectionWrapper>

    </div>
  );
};

const Card = ({ title, value, icon }) => (
  <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50">
    <div className="flex items-center justify-between mb-3 text-slate-400">
      <span className="text-sm">{title}</span>
      {icon}
    </div>
    <div className="text-3xl font-bold text-white">
      {value}
    </div>
  </div>
);

const SectionWrapper = ({ title, children }) => (
  <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50">
    <h3 className="text-xl font-bold text-white mb-4">
      {title}
    </h3>
    <div className="space-y-3">
      {children}
    </div>
  </div>
);

const StatRow = ({ label, value }) => (
  <div className="flex justify-between items-center bg-slate-900/50 p-3 rounded-lg">
    <span className="text-slate-400">{label}</span>
    <span className="text-white font-semibold">{value}</span>
  </div>
);

export default FacultyAnalytics;
