import React, { useState, useEffect } from "react";
import {
  FileText,
  CheckCircle,
  Clock,
  TrendingUp,
  Award,
  Zap,
  Plus,
  Calendar,
  Trash2,
  ChevronDown
} from "lucide-react";
import API_BASE from "../../config/api";
import { authFetch } from "../../utils/authFetch";

const StudentTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("dueDate");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "medium",
    category: "assignment",
    estimatedTime: 60
  });

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const res = await authFetch(`${API_BASE}/api/student/tasks`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setTasks(data.tasks || []);
      setStats(data.stats || null);
    } catch (err) {
      console.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async () => {
    if (!newTask.title.trim()) return;

    try {
      const res = await authFetch(`${API_BASE}/api/student/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTask)
      });

      if (res.ok) {
        await loadTasks();
        setShowCreateModal(false);
        setNewTask({
          title: "",
          description: "",
          dueDate: "",
          priority: "medium",
          category: "assignment",
          estimatedTime: 60
        });
      }
    } catch (err) {
      console.error("Error creating task");
    }
  };

  const handleToggleComplete = async (taskId) => {
    try {
      await authFetch(`${API_BASE}/api/student/tasks/${taskId}/complete`, {
        method: "POST"
      });
      await loadTasks();
    } catch (err) {
      console.error("Error toggling task");
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await authFetch(`${API_BASE}/api/student/tasks/${taskId}`, {
        method: "DELETE"
      });
      await loadTasks();
    } catch (err) {
      console.error("Error deleting task");
    }
  };

  const filteredTasks = tasks
    .filter((task) => {
      if (filter === "all") return true;
      if (filter === "completed") return task.completed;
      if (filter === "pending") return !task.completed;
      if (filter === "overdue") return task.overdue;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "priority") {
        const order = { high: 3, medium: 2, low: 1 };
        return order[b.priority] - order[a.priority];
      }
      return new Date(a.dueDate) - new Date(b.dueDate);
    });

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-14 w-14 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* STATS */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard
            title="Total Tasks"
            value={stats.total}
            subtitle={`${stats.completed} completed`}
            icon={<FileText />}
          />
          <StatCard
            title="Completion Rate"
            value={`${stats.completionRate}%`}
            icon={<TrendingUp />}
          />
          <StatCard
            title="Points Earned"
            value={stats.pointsEarned}
            icon={<Award />}
          />
          <StatCard
            title="Streak"
            value={`${stats.streak} days`}
            icon={<Zap />}
          />
        </div>
      )}

      {/* FILTERS */}
      <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700 flex justify-between items-center">
        <div className="flex gap-2">
          {["all", "pending", "completed", "overdue"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm ${
                filter === f
                  ? "bg-emerald-500 text-white"
                  : "bg-slate-700 text-slate-300"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="flex gap-3">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-slate-700 text-white px-3 py-2 rounded-lg"
          >
            <option value="dueDate">Sort by Due Date</option>
            <option value="priority">Sort by Priority</option>
          </select>

          <button
            onClick={() => setShowCreateModal(true)}
            className="px-5 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl flex items-center gap-2"
          >
            <Plus size={16} /> New Task
          </button>
        </div>
      </div>

      {/* TASK LIST */}
      <div className="space-y-4">
        {filteredTasks.length === 0 ? (
          <div className="text-center text-slate-400 py-12">
            No tasks found.
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700 flex justify-between items-start"
            >
              <div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleToggleComplete(task.id)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      task.completed
                        ? "bg-emerald-500 border-emerald-500"
                        : "border-slate-600"
                    }`}
                  >
                    {task.completed && (
                      <CheckCircle size={14} className="text-white" />
                    )}
                  </button>
                  <h3
                    className={`text-lg font-semibold ${
                      task.completed
                        ? "line-through text-slate-500"
                        : "text-white"
                    }`}
                  >
                    {task.title}
                  </h3>
                </div>

                <p className="text-slate-400 mt-2">{task.description}</p>

                <div className="flex gap-4 mt-3 text-sm text-slate-400">
                  <span>
                    <Calendar size={14} className="inline mr-1" />
                    {task.dueDate}
                  </span>
                  <span>
                    <Clock size={14} className="inline mr-1" />
                    {task.estimatedTime} mins
                  </span>
                  <span>
                    <Award size={14} className="inline mr-1 text-amber-400" />
                    +{task.points}
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleDeleteTask(task.id)}
                className="p-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg"
              >
                <Trash2 size={16} className="text-red-400" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* CREATE MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center">
          <div className="bg-slate-800 p-8 rounded-2xl w-full max-w-xl space-y-4">
            <h3 className="text-xl text-white font-bold">
              Create New Task
            </h3>

            <input
              placeholder="Title"
              value={newTask.title}
              onChange={(e) =>
                setNewTask({ ...newTask, title: e.target.value })
              }
              className="w-full bg-slate-900 border border-slate-700 p-3 rounded-lg text-white"
            />

            <textarea
              placeholder="Description"
              value={newTask.description}
              onChange={(e) =>
                setNewTask({ ...newTask, description: e.target.value })
              }
              className="w-full bg-slate-900 border border-slate-700 p-3 rounded-lg text-white"
            />

            <input
              type="date"
              value={newTask.dueDate}
              onChange={(e) =>
                setNewTask({ ...newTask, dueDate: e.target.value })
              }
              className="w-full bg-slate-900 border border-slate-700 p-3 rounded-lg text-white"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 bg-slate-700 rounded-lg text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTask}
                className="px-4 py-2 bg-emerald-500 rounded-lg text-white"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ title, value, subtitle, icon }) => (
  <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700">
    <div className="flex justify-between items-center">
      <div>
        <p className="text-sm text-slate-400">{title}</p>
        <p className="text-2xl font-bold text-white mt-2">{value}</p>
        {subtitle && (
          <p className="text-xs text-slate-400 mt-1">{subtitle}</p>
        )}
      </div>
      <div className="text-emerald-400">{icon}</div>
    </div>
  </div>
);

export default StudentTasks;
