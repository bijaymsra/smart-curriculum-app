import React, { useEffect, useState } from "react";
import API_BASE from "../../config/api";
import { authFetch } from "../../utils/authFetch";
import {
  TrendingUp,
  Users,
  Clock,
  AlertCircle
} from "lucide-react";

const StudentDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [aiRecommendations, setAiRecommendations] = useState([]);


  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const res = await authFetch(
        `${API_BASE}/api/student/dashboard`
      );

      if (!res.ok) throw new Error("Failed to load");

      const data = await res.json();
      setDashboard(data);
    } catch (err) {
      setError("Unable to load dashboard");
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
  const fetchAI = async () => {
    try {
      const studentId = sessionStorage.getItem("studentId");

      if (!studentId) return;

      const res = await authFetch(
        `${API_BASE}/api/ai/admin/student/${studentId}/recommend`
      );

      if (!res.ok) throw new Error("AI fetch failed");

      const data = await res.json();
      setAiRecommendations(data);

    } catch (err) {
      console.error("Student AI error:", err);
    }
  };

  fetchAI();
}, []);


  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-14 w-14 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (error || !dashboard) {
    return (
      <div className="text-center py-20 text-red-400">
        Failed to load dashboard.
      </div>
    );
  }

  const risk = dashboard.attendancePercentage < 75;

  const rankPercent =
    dashboard.totalStudents > 0
      ? ((dashboard.totalStudents - dashboard.rank) /
          dashboard.totalStudents) *
        100
      : 0;

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-8 rounded-2xl border border-slate-700">
        <div className="flex justify-between items-center">

          <div>
            <h1 className="text-2xl font-bold text-white">
              Welcome, {dashboard.fullName}
            </h1>
            <p className="text-slate-400 mt-1">
              {dashboard.department} • Semester {dashboard.semester} • Section {dashboard.section}
            </p>
          </div>

          <div className="text-right">
            <div className="text-sm text-slate-400">
              Attendance
            </div>
            <div className={`text-3xl font-bold ${risk ? "text-red-400" : "text-emerald-400"}`}>
              {dashboard.attendancePercentage}%
            </div>
            {risk && (
              <div className="text-xs text-red-400 mt-1">
                ⚠ Below minimum requirement
              </div>
            )}
          </div>

        </div>
      </div>

      {/* 🔥 STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Attendance Card */}
        <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700">
          <div className="flex justify-between items-center">
            <h3 className="text-white text-lg font-semibold">
              Attendance Overview
            </h3>
            <TrendingUp className="text-emerald-400" size={22} />
          </div>

          <div className="mt-6">
            <div className="w-full bg-slate-700 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all duration-700 ${
                  risk ? "bg-red-500" : "bg-emerald-500"
                }`}
                style={{ width: `${dashboard.attendancePercentage}%` }}
              />
            </div>

            <div className="flex justify-between text-sm text-slate-400 mt-3">
              <span>Present: {dashboard.attendedClasses}</span>
              <span>Missed: {dashboard.missedClasses}</span>
              <span>Total: {dashboard.totalClasses}</span>
            </div>
          </div>
        </div>

        {/* Rank Card */}
        <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700">
          <div className="flex justify-between items-center">
            <h3 className="text-white text-lg font-semibold">
              Class Ranking
            </h3>
            <Users className="text-blue-400" size={22} />
          </div>

          <div className="mt-6 text-center">
            <div className="text-4xl font-bold text-blue-400">
              #{dashboard.rank}
            </div>
            <div className="text-sm text-slate-400 mt-2">
              Out of {dashboard.totalStudents} students
            </div>

            <div className="mt-4 w-full bg-slate-700 h-2 rounded-full">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: `${rankPercent}%` }}
              />
            </div>
          </div>
        </div>

      </div>

      {/* 🔥 TODAY SCHEDULE */}
      <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-white text-lg font-semibold">
            Today's Classes
          </h3>
          <Clock className="text-slate-500" size={20} />
        </div>

        {dashboard.todayClasses.length === 0 ? (
          <div className="text-center text-slate-400 py-6">
            🎉 No classes today
          </div>
        ) : (
          <div className="space-y-3">
            {dashboard.todayClasses.map((cls) => (
              <div
                key={cls.timetableId}
                className="p-4 bg-slate-900 rounded-xl border border-slate-700"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-white font-semibold">
                      {cls.subjectName}
                    </div>
                    <div className="text-sm text-slate-400">
                      {cls.startTime} - {cls.endTime} • {cls.roomCode}
                    </div>
                  </div>

                  <div
                    className={`text-xs px-3 py-1 rounded-full ${
                      cls.status === "LIVE"
                        ? "bg-emerald-500/20 text-emerald-400"
                        : cls.status === "UPCOMING"
                        ? "bg-blue-500/20 text-blue-400"
                        : "bg-slate-700 text-slate-400"
                    }`}
                  >
                    {cls.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>


{/* 🧠 AI Study Intelligence */}
{aiRecommendations.length > 0 && (
  <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700">
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-white text-lg font-semibold flex items-center gap-2">
        <AlertCircle className="text-indigo-400" size={20} />
        Smart Study Intelligence
      </h3>
    </div>

    <div className="space-y-4">
      {aiRecommendations.map((rec, idx) => {

        let style = {
          bg: "bg-indigo-500/10",
          border: "border-indigo-500/30",
          text: "text-indigo-400"
        };

        if (rec.severity === "ALERT") {
          style = {
            bg: "bg-red-500/10",
            border: "border-red-500/30",
            text: "text-red-400"
          };
        }

        if (rec.severity === "SUGGESTION") {
          style = {
            bg: "bg-amber-500/10",
            border: "border-amber-500/30",
            text: "text-amber-400"
          };
        }

        return (
          <div
            key={idx}
            className={`${style.bg} border ${style.border} rounded-xl p-4`}
          >
            <p className={`text-sm ${style.text} font-medium`}>
              {rec.message}
            </p>
          </div>
        );
      })}
    </div>
  </div>
)}

















    </div>
  );
};

export default StudentDashboard;