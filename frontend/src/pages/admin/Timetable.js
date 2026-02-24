import React, { useEffect, useMemo, useState } from "react";
import {Users, Edit2, Calendar, Plus, Clock, Search, Trash2, Loader2, TrendingUp, X, Building, User, BookOpen, BarChart3} from "lucide-react";
import { useAdmin } from "../../context/AdminContext";
import API_BASE from "../../config/api";
import TimetableCreateModal from "./TimetableCreateModal";
import { authFetch } from "../../utils/authFetch";

export default function Timetable() {
  const { token } = useAdmin();

  /* ---------------- MODAL STATE ---------------- */
  const [openCreate, setOpenCreate] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);

  /* ---------------- UI STATE ---------------- */
  const [view, setView] = useState("calendar");
  const [selectedDay, setSelectedDay] = useState("MONDAY");
  const [searchTerm, setSearchTerm] = useState("");

  /* ---------------- DATA STATE ---------------- */
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const days = [
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
  ];


  useEffect(() => {
    let mounted = true;
    fetchTimetable(mounted);
    return () => { mounted = false; };
  }, []);

  const fetchTimetable = async (mounted = true) => {
    try {
      setLoading(true);

      const res = await authFetch(`${API_BASE}/api/admin/timetable/entries`);

      const raw = await res.json();

      const normalized = raw.map((e) => ({
        timetableId: e.id,
        day: e.timeSlot.dayOfWeek,
        time: `${e.timeSlot.startTime} - ${e.timeSlot.endTime}`,
        startTime: e.timeSlot.startTime,
        endTime: e.timeSlot.endTime,
        subjectCode: e.courseOffering.subject.subjectCode,
        subjectName: e.courseOffering.subject.subjectName,
        facultyId: e.faculty.id,
        facultyName: e.faculty.fullName,
        section: e.studentGroup.section,
        roomCode: e.room.roomCode,
        capacity: e.room.capacity,
        courseOfferingId: e.courseOffering.id,
        timeSlotId: e.timeSlot.id,
        roomId: e.room.id,
        studentGroupId: e.studentGroup.id,
        color: getSubjectColor(e.courseOffering.subject.subjectCode)
      }));

      if (mounted) {
        setTimetable(normalized);
      }
    } catch (err) {
      console.error("Failed to load timetable", err);
    } finally {
      if (mounted) {
        setTimeout(() => setLoading(false), 300);
      }
    }
  };

  const getSubjectColor = (code) => {
    const colors = [
      "from-blue-500 to-cyan-400",
      "from-purple-500 to-pink-500",
      "from-emerald-500 to-teal-400",
      "from-amber-500 to-orange-500",
      "from-indigo-500 to-purple-400",
      "from-rose-500 to-pink-400",
    ];
    const index = code.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[index % colors.length];
  };


    const filteredTimetable = useMemo(() => {
    return timetable.filter((item) => {
      if (view === "calendar" && item.day !== selectedDay) return false;

      if (!searchTerm) return true;

      const q = searchTerm.toLowerCase();
      return (
        item.subjectCode.toLowerCase().includes(q) ||
        item.subjectName.toLowerCase().includes(q) ||
        item.facultyName.toLowerCase().includes(q) ||
        item.roomCode.toLowerCase().includes(q)
      );
    });
  }, [timetable, view, selectedDay, searchTerm]);


  const stats = useMemo(() => {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
    const todayClasses = timetable.filter(t => t.day === today).length;
    const totalHours = timetable.reduce((acc, t) => {
      const [start] = t.startTime.split(":");
      const [end] = t.endTime.split(":");
      return acc + (parseInt(end) - parseInt(start));
    }, 0);

    return {
      totalClasses: timetable.length,
      uniqueRooms: new Set(timetable.map((t) => t.roomCode)).size,
      uniqueFaculty: new Set(timetable.map((t) => t.facultyId)).size,
      todayClasses,
      totalHours
    };
  }, [timetable]);



  const handleEdit = (item) => {
    setEditingEntry(item);
    setTimeout(() => setOpenCreate(true), 150);
  };

  const deleteEntry = async (id) => {
    if (!window.confirm("Are you sure you want to delete this class from the timetable?")) return;

    try {
      setDeletingId(id);
      const res = await authFetch(
        `${API_BASE}/api/admin/timetable/entries/${id}`,
        {
          method: "DELETE"
        }
      );

      if (!res.ok) throw new Error("Delete failed");

      await fetchTimetable();
    } catch (err) {
      console.error(err);
      alert("Unable to delete timetable entry");
    } finally {
      setDeletingId(null);
    }
  };


  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
          <Loader2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-500 animate-spin" size={24} />
        </div>
        <p className="text-slate-400 animate-pulse">Loading timetable...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">

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

      {/* ================= ENHANCED STATS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard 
          label="Total Classes" 
          value={stats.totalClasses} 
          icon={<Calendar className="text-blue-400" />} 
          trend={`${stats.todayClasses} today`}
          color="blue"
        />
        <StatCard 
          label="Active Rooms" 
          value={stats.uniqueRooms} 
          icon={<Building className="text-emerald-400" />} 
          trend="Utilized"
          color="emerald"
        />
        <StatCard 
          label="Faculty Assigned" 
          value={stats.uniqueFaculty} 
          icon={<Users className="text-purple-400" />} 
          trend="Active"
          color="purple"
        />
        <StatCard 
          label="Total Hours" 
          value={stats.totalHours} 
          icon={<Clock className="text-amber-400" />} 
          trend="Weekly"
          color="amber"
        />
      </div>

      {/* ================= SIMPLIFIED CONTROLS ================= */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center p-6 bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800">
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 bg-slate-800 rounded-xl p-1">
            <ToggleButton active={view === "calendar"} onClick={() => setView("calendar")} icon={<Calendar size={16} />}>
              Calendar
            </ToggleButton>
            <ToggleButton active={view === "list"} onClick={() => setView("list")} icon={<BookOpen size={16} />}>
              List
            </ToggleButton>
          </div>

        </div>

        <div className="flex gap-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-400 transition-colors" size={20} />
            <input
              placeholder="Search subject, faculty, room..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 py-2.5 w-72 bg-slate-800 border border-slate-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X size={18} />
              </button>
            )}
          </div>

          <button
            onClick={() => {
              setEditingEntry(null);
              setOpenCreate(true);
            }}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl font-medium shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95 group"
          >
            <Plus className="group-hover:rotate-90 transition-transform duration-300" size={20} />
            Add Class
          </button>
        </div>
      </div>

     

      {/* ================= CALENDAR VIEW ================= */}
      {view === "calendar" && (
        <>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
            {days.map((day) => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-6 py-3 rounded-xl font-medium min-w-[140px] transition-all duration-300 ${
                  selectedDay === day
                    ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/25"
                    : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white"
                }`}
              >
                {day.slice(0, 3)}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
            {filteredTimetable.length > 0 ? filteredTimetable.map((item) => (
              <TimetableCard
                key={item.timetableId}
                item={item}
                hovered={hoveredCard === item.timetableId}
                onHover={() => setHoveredCard(item.timetableId)}
                onLeave={() => setHoveredCard(null)}
                onEdit={() => handleEdit(item)}
                onDelete={() => deleteEntry(item.timetableId)}
                deleting={deletingId === item.timetableId}
              />
            )) : (
              <div className="col-span-2 flex flex-col items-center justify-center py-16 text-center">
                <Calendar className="text-slate-400 mb-4" size={48} />
                <h3 className="text-xl font-semibold text-white mb-2">No classes found</h3>

                <p className="text-slate-400 max-w-md">
                  {searchTerm
                    ? "No classes match your search criteria. Try a different keyword."
                    : "No classes scheduled for this day. Add your first class to get started."}
                </p>

              </div>
            )}
          </div>
        </>
      )}

      {/* ================= LIST VIEW ================= */}
      {view === "list" && (
        <div className="overflow-hidden rounded-2xl border border-slate-800">
          <div className="grid grid-cols-12 gap-4 p-4 bg-slate-900/50 border-b border-slate-800 text-sm font-medium text-slate-400">
            <div className="col-span-3">Subject & Faculty</div>
            <div className="col-span-2">Time</div>
            <div className="col-span-2">Room</div>
            <div className="col-span-2">Group</div>
            <div className="col-span-2">Day</div>
            <div className="col-span-1 text-right">Actions</div>
          </div>
          
          {filteredTimetable.length > 0 ? filteredTimetable.map((item) => (
            <TimetableRow
              key={item.timetableId}
              item={item}
              onEdit={() => handleEdit(item)}
              onDelete={() => deleteEntry(item.timetableId)}
              deleting={deletingId === item.timetableId}
            />
          )) : (
            <div className="p-12 text-center">
              <p className="text-slate-400">No timetable entries found</p>
            </div>
          )}
        </div>
      )}

      {/* ================= MODAL ================= */}
      <TimetableCreateModal
        open={openCreate}
        editData={editingEntry}
        onClose={() => {
          setOpenCreate(false);
          setTimeout(() => setEditingEntry(null), 300);
        }}
        onSuccess={fetchTimetable}
      />
    </div>
  );
}


const StatCard = ({ label, value, icon, trend, color }) => (
  <div className="group bg-slate-900/50 backdrop-blur-sm border border-slate-800 hover:border-slate-700 rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02]">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-slate-400 text-sm font-medium">{label}</p>
        <h3 className="text-3xl font-bold text-white mt-2">{value}</h3>
        {trend && (
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp className={`text-${color}-400`} size={14} />
            <span className={`text-${color}-400 text-sm`}>{trend}</span>
          </div>
        )}
      </div>
      <div className={`w-14 h-14 bg-gradient-to-br from-${color}-500/10 to-transparent rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
        <div className={`w-10 h-10 bg-${color}-500/20 rounded-lg flex items-center justify-center`}>
          {icon}
        </div>
      </div>
    </div>
  </div>
);

const ToggleButton = ({ active, onClick, icon, children }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all duration-300 ${
      active
        ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/25"
        : "text-slate-400 hover:text-white hover:bg-slate-700/50"
    }`}
  >
    {icon}
    {children}
  </button>
);


const TimetableCard = ({ item, hovered, onHover, onLeave, onEdit, onDelete, deleting }) => (
  <div
    className={`bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-5 transition-all duration-300 ${
      hovered ? "shadow-xl shadow-blue-500/10 transform -translate-y-1" : "hover:border-slate-700"
    } ${deleting ? "opacity-50 scale-95" : ""}`}
    onMouseEnter={onHover}
    onMouseLeave={onLeave}
  >
    <div className="flex justify-between items-start mb-4">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className={`px-3 py-1 bg-gradient-to-r ${item.color} rounded-full text-sm font-semibold text-white`}>
            {item.subjectCode}
          </span>
          <span className="text-xs text-slate-400 bg-slate-800 px-2 py-1 rounded">
            Section {item.section}
          </span>
        </div>
        <h3 className="text-lg font-semibold text-white mb-1">{item.subjectName}</h3>
      </div>
      <div className="flex gap-1">
        <button
          onClick={onEdit}
          className="p-2 hover:bg-slate-800 rounded-lg transition-colors group"
          title="Edit"
        >
          <Edit2 className="text-slate-400 group-hover:text-blue-400 transition-colors" size={18} />
        </button>
        <button
          onClick={onDelete}
          className="p-2 hover:bg-red-500/20 rounded-lg transition-colors group"
          title="Delete"
          disabled={deleting}
        >
          {deleting ? (
            <Loader2 className="animate-spin text-red-400" size={18} />
          ) : (
            <Trash2 className="text-red-400 group-hover:text-red-300 transition-colors" size={18} />
          )}
        </button>
      </div>
    </div>

    <div className="space-y-3">
      <div className="flex items-center gap-2 text-slate-400">
        <Clock size={16} />
        <span className="font-medium">{item.time}</span>
        <span className="text-slate-600">•</span>
        <span>{item.day}</span>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-slate-300">
          <User size={16} className="text-purple-400" />
          <span className="text-sm">{item.facultyName}</span>
        </div>
        <div className="flex items-center gap-2 text-slate-300">
          <Building size={16} className="text-emerald-400" />
          <span className="text-sm">Room {item.roomCode}</span>
          {item.capacity && (
            <span className="text-xs text-slate-500">(Cap: {item.capacity})</span>
          )}
        </div>
      </div>
    </div>
  </div>
);

const TimetableRow = ({ item, onEdit, onDelete, deleting }) => (
  <div className={`grid grid-cols-12 gap-4 p-4 items-center border-b border-slate-800/50 last:border-0 hover:bg-slate-900/30 transition-colors ${deleting ? "opacity-50" : ""}`}>
    <div className="col-span-3">
      <div className="flex items-center gap-3">
        <div className={`w-3 h-10 bg-gradient-to-b ${item.color} rounded-full`}></div>
        <div>
          <p className="font-semibold text-white">{item.subjectCode}</p>
          <p className="text-sm text-slate-400">{item.subjectName}</p>
          <p className="text-xs text-purple-400 flex items-center gap-1 mt-1">
            <User size={12} />
            {item.facultyName}
          </p>
        </div>
      </div>
    </div>
    <div className="col-span-2">
      <p className="text-white font-medium">{item.time}</p>
    </div>
    <div className="col-span-2">
      <span className="inline-flex items-center gap-2 px-3 py-1 bg-slate-800 rounded-lg">
        <Building size={14} className="text-emerald-400" />
        {item.roomCode}
      </span>
    </div>
    <div className="col-span-2">
      <span className="text-slate-300">Section {item.section}</span>
    </div>
    <div className="col-span-2">
      <span className="px-3 py-1 bg-slate-800 rounded-lg text-sm">{item.day}</span>
    </div>
    <div className="col-span-1 flex justify-end gap-2">
      <button
        onClick={onEdit}
        className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
        title="Edit"
      >
        <Edit2 className="text-slate-400 hover:text-blue-400" size={18} />
      </button>
      <button
        onClick={onDelete}
        className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
        title="Delete"
        disabled={deleting}
      >
        {deleting ? (
          <Loader2 className="animate-spin text-red-400" size={18} />
        ) : (
          <Trash2 className="text-red-400 hover:text-red-300" size={18} />
        )}
      </button>
    </div>
  </div>
);