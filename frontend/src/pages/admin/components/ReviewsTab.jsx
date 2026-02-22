import React, { useEffect, useState } from "react";
import API_BASE from "../../../config/api";
import { authFetch } from "../../../utils/authFetch";

export default function ReviewsTab() {
  const [submissions, setSubmissions] = useState([]);
  const [statusFilter, setStatusFilter] = useState("FLAGGED");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSubmissions();
  }, [statusFilter]);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await authFetch(
        `${API_BASE}/api/admin/attendance/reviews?status=${statusFilter}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch submissions");
      }

      const data = await response.json();
      setSubmissions(data);
    } catch (err) {
      console.error("Review fetch error:", err);
      setError("Unable to load submissions");
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (submissionId, decision) => {
    try {
      const response = await authFetch(
        `${API_BASE}/attendance/review`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            submissionId: submissionId,
            status: decision, // APPROVED or REJECTED
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Review failed");
      }

      fetchSubmissions(); // refresh list
    } catch (err) {
      console.error("Review action error:", err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "FLAGGED":
        return "text-red-400";
      case "PENDING":
        return "text-yellow-400";
      case "APPROVED":
        return "text-green-400";
      case "REJECTED":
        return "text-red-500";
      default:
        return "text-slate-400";
    }
  };

  if (loading) {
    return (
      <div className="text-center text-slate-400 py-10">
        Loading submissions...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-400 py-10">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter */}
      <div className="flex items-center gap-4">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
        >
          <option value="FLAGGED">Flagged</option>
          <option value="PENDING">Pending</option>
          <option value="">All</option>
        </select>
      </div>

      {/* Submissions Table */}
      <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-800/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs text-slate-400">
                  Submission ID
                </th>
                <th className="px-6 py-4 text-left text-xs text-slate-400">
                  Student ID
                </th>
                <th className="px-6 py-4 text-left text-xs text-slate-400">
                  Session ID
                </th>
                <th className="px-6 py-4 text-left text-xs text-slate-400">
                  Submitted At
                </th>
                <th className="px-6 py-4 text-left text-xs text-slate-400">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs text-slate-400">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-700/50">
              {submissions.length === 0 && (
                
                  <tr className="bg-transparent hover:bg-transparent">
                  <td
                    colSpan="6"
                    className="text-center py-8 text-slate-400"
                  >
                    No submissions found.
                  </td>
                </tr>
              )}

              {submissions.map((sub) => (
                <tr
                  key={sub.id}
                  className="hover:bg-slate-800/40 transition"
                >
                  <td className="px-6 py-4 text-slate-300">
                    {sub.id}
                  </td>
                  <td className="px-6 py-4 text-slate-300">
                    {sub.studentId}
                  </td>
                  <td className="px-6 py-4 text-slate-300">
                    {sub.sessionId}
                  </td>
                  <td className="px-6 py-4 text-slate-300">
                    {sub.submittedAt}
                  </td>
                  <td
                    className={`px-6 py-4 font-medium ${getStatusColor(
                      sub.status
                    )}`}
                  >
                    {sub.status}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          handleReview(sub.id, "APPROVED")
                        }
                        className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded"
                      >
                        Approve
                      </button>

                      <button
                        onClick={() =>
                          handleReview(sub.id, "REJECTED")
                        }
                        className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded"
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
