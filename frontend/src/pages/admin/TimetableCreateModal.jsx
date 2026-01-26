import React, { useEffect, useState } from "react";
import { X, AlertCircle, CheckCircle, Loader2, Clock, Building, Users, BookOpen, ChevronDown, ChevronUp } from "lucide-react";
import { useAdmin } from "../../context/AdminContext";
import API_BASE from "../../config/api";

/* =========================================================
   ENHANCED CREATE / EDIT TIMETABLE MODAL
   ========================================================= */

export default function TimetableCreateModal({ open, onClose, onSuccess, editData }) {
  const { admin, token, loading: adminLoading } = useAdmin();



  /* ---------------- STATE ---------------- */
  const [studentGroups, setStudentGroups] = useState([]);
  const [courseOfferings, setCourseOfferings] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [masterLoading, setMasterLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({
    studentGroupId: "",
    courseOfferingId: "",
    timeSlotId: "",
    roomId: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [previewData, setPreviewData] = useState(null);


/* =========================================================
   LOCK BACKGROUND SCROLL WHEN MODAL IS OPEN
   ========================================================= */

useEffect(() => {
  if (open) {
    // Lock background scroll
    document.body.style.overflow = "hidden";
  } else {
    // Restore scroll
    document.body.style.overflow = "";
  }

  // Cleanup in case component unmounts
  return () => {
    document.body.style.overflow = "";
  };
}, [open]);



  /* =========================================================
     MASTER DATA LOADING WITH VISUAL FEEDBACK
     ========================================================= */

  useEffect(() => {
    if (!open) return;

    const loadMasterData = async () => {
  try {
    setMasterLoading(true);
    setError("");

    const [groupsRes, coursesRes, slotsRes, roomsRes] = await Promise.all([
      fetch(
        `${API_BASE}/api/admin/timetable/student-groups?institutionId=${admin.institutionId}`,
        auth()
      ),
      fetch(`${API_BASE}/api/admin/timetable/course-offerings`, auth()),
      fetch(`${API_BASE}/api/admin/timetable/time-slots`, auth()),
      fetch(`${API_BASE}/api/admin/timetable/rooms`, auth()),
    ]);

    if (!groupsRes.ok || !coursesRes.ok || !slotsRes.ok || !roomsRes.ok) {
      throw new Error("Failed to load required data");
    }

    const [groups, courses, slots, rooms] = await Promise.all([
      groupsRes.json(),
      coursesRes.json(),
      slotsRes.json(),
      roomsRes.json(),
    ]);

    setStudentGroups(extractArray(groups));
    setCourseOfferings(extractArray(courses));
    setTimeSlots(extractArray(slots));
    setRooms(extractArray(rooms));
  } catch (err) {
    setError("Unable to load schedule data. Please try again.");
    console.error(err);
  } finally {
    setMasterLoading(false);
  }
};

    loadMasterData();
  }, [open]);

  /* =========================================================
     FORM INITIALIZATION
     ========================================================= */

  useEffect(() => {
    if (!open) return;

    if (editData) {
      setForm({
        studentGroupId: editData.studentGroupId ?? "",
        courseOfferingId: editData.courseOfferingId ?? "",
        timeSlotId: editData.timeSlotId ?? "",
        roomId: editData.roomId ?? "",
      });
      updatePreview(editData);
    } else {
      setForm({
        studentGroupId: "",
        courseOfferingId: "",
        timeSlotId: "",
        roomId: "",
      });
      setPreviewData(null);
    }
    
    setError("");
    setSuccess("");
    setFormErrors({});
  }, [open, editData]);

  /* =========================================================
     PREVIEW GENERATION
     ========================================================= */

  const updatePreview = (formData) => {
    const studentGroup = studentGroups.find(g => g.id === Number(formData.studentGroupId));
    const course = courseOfferings.find(c => c.id === Number(formData.courseOfferingId));
    const timeSlot = timeSlots.find(t => t.id === Number(formData.timeSlotId));
    const room = rooms.find(r => r.id === Number(formData.roomId));

    if (studentGroup && course && timeSlot && room) {
      setPreviewData({
        group: studentGroup.displayName || `Section ${studentGroup.section}`,
        subject: `${course.subject.subjectCode} - ${course.subject.subjectName}`,
        faculty: course.faculty.fullName,
        time: `${timeSlot.dayOfWeek} ${timeSlot.startTime} - ${timeSlot.endTime}`,
        room: `${room.roomCode} (Capacity: ${room.capacity})`,
      });
    }
  };

  useEffect(() => {
    if (form.studentGroupId && form.courseOfferingId && form.timeSlotId && form.roomId) {
      updatePreview(form);
    }
  }, [form, studentGroups, courseOfferings, timeSlots, rooms]);

  /* =========================================================
     VALIDATION
     ========================================================= */

  const validateForm = () => {
    const errors = {};
    if (!form.studentGroupId) errors.studentGroupId = "Student group is required";
    if (!form.courseOfferingId) errors.courseOfferingId = "Course offering is required";
    if (!form.timeSlotId) errors.timeSlotId = "Time slot is required";
    if (!form.roomId) errors.roomId = "Room is required";
    return errors;
  };

  /* =========================================================
     SUBMIT WITH ENHANCED FEEDBACK
     ========================================================= */

  const handleSubmit = async () => {
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setError("");
    setSuccess("");
    setFormErrors({});
    setLoading(true);

    try {
      const url = editData
        ? `${API_BASE}/api/admin/timetable/entries/${editData.timetableId}`
        : `${API_BASE}/api/admin/timetable/entries`;

      const method = editData ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Operation failed");
      }

      setSuccess(editData ? "Class updated successfully!" : "Class scheduled successfully!");
      
      // Enhanced success feedback with delay
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 800);
    } catch (err) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  /* =========================================================
     ENHANCED UI
     ========================================================= */

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop with blur */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Modal container */}
      <div className="relative bg-slate-900 w-full max-w-2xl rounded-3xl border border-slate-800 shadow-2xl transform transition-all duration-300 scale-100">
        {/* Header */}
        <div className="flex justify-between items-center px-8 py-6 border-b border-slate-800">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              {editData ? "Edit Class Schedule" : "Schedule New Class"}
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              {editData ? "Update class details" : "Add a new class to the timetable"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-xl transition-colors group"
          >
            <X className="text-slate-400 group-hover:text-white transition-colors" size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-8">
          {masterLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="relative mb-4">
                <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                <Loader2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-500 animate-spin" size={24} />
              </div>
              <p className="text-slate-400">Loading form data...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Status Messages */}
              {error && (
                <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl animate-fadeIn">
                  <AlertCircle size={20} />
                  <div className="flex-1">
                    <p className="font-medium">Error</p>
                    <p className="text-sm opacity-90">{error}</p>
                  </div>
                </div>
              )}

              {success && (
                <div className="flex items-center gap-3 bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-3 rounded-xl animate-fadeIn">
                  <CheckCircle size={20} />
                  <div className="flex-1">
                    <p className="font-medium">Success!</p>
                    <p className="text-sm opacity-90">{success}</p>
                  </div>
                </div>
              )}

              {/* Form Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Student Group */}
                <FormSelect
                  label="Student Group"
                  icon={<Users className="text-blue-400" size={18} />}
                  value={form.studentGroupId}
                  onChange={(v) => setForm({ ...form, studentGroupId: v, courseOfferingId: "" })}
                  options={studentGroups.map((g) => ({
                    value: g.id,
                    label: g.displayName || `Section ${g.section}`,
                    // description: `${g.students?.length || 0} students`,
                    description: `${g.studentCount ?? 0} students`,
                  }))}
                  error={formErrors.studentGroupId}
                  disabled={!!editData}
                />

                {/* Course Offering */}
                <FormSelect
                  label="Subject & Faculty"
                  icon={<BookOpen className="text-purple-400" size={18} />}
                  value={form.courseOfferingId}
                  onChange={(v) => setForm({ ...form, courseOfferingId: v })}
                  options={courseOfferings
                    .filter(c => !form.studentGroupId || c.studentGroup?.id === Number(form.studentGroupId))
                    .map((c) => ({
                      value: c.id,
                      label: `${c.subject.subjectCode} - ${c.subject.subjectName}`,
                      description: c.faculty.fullName,
                      credits: c.subject.credits,
                    }))}
                  error={formErrors.courseOfferingId}
                  disabled={!!editData}
                />

                {/* Time Slot */}
                <FormSelect
                  label="Time Slot"
                  icon={<Clock className="text-amber-400" size={18} />}
                  value={form.timeSlotId}
                  onChange={(v) => setForm({ ...form, timeSlotId: v })}
                  options={timeSlots.map((t) => ({
                    value: t.id,
                    label: `${t.dayOfWeek}`,
                    description: `${t.startTime} - ${t.endTime}`,
                    duration: t.duration,
                  }))}
                  error={formErrors.timeSlotId}
                />

                {/* Room */}
                <FormSelect
                  label="Room"
                  icon={<Building className="text-emerald-400" size={18} />}
                  value={form.roomId}
                  onChange={(v) => setForm({ ...form, roomId: v })}
                  options={rooms.map((r) => ({
                    value: r.id,
                    label: `Room ${r.roomCode}`,
                    description: `Capacity: ${r.capacity}`,
                    type: r.type,
                  }))}
                  error={formErrors.roomId}
                />
              </div>

              {/* Preview Section */}
              {previewData && (
                <div className="mt-8 p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700 rounded-2xl">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <CheckCircle className="text-emerald-400" size={20} />
                    Schedule Preview
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <PreviewItem label="Student Group" value={previewData.group} />
                    <PreviewItem label="Subject" value={previewData.subject} />
                    <PreviewItem label="Faculty" value={previewData.faculty} />
                    <PreviewItem label="Time" value={previewData.time} />
                    <PreviewItem label="Room" value={previewData.room} />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center px-8 py-6 border-t border-slate-800 bg-slate-900/50 rounded-b-3xl">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium transition-all duration-300 hover:scale-105 active:scale-95"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || masterLoading}
            className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl font-medium shadow-lg shadow-blue-500/25 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                {editData ? "Updating..." : "Scheduling..."}
              </>
            ) : (
              <>
                {editData ? "Update Schedule" : "Schedule Class"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   ENHANCED FORM COMPONENTS
   ========================================================= */

const FormSelect = ({ label, icon, value, onChange, options, error, disabled, description }) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find(opt => String(opt.value) === String(value));

  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
        {icon}
        {label}
      </label>
      
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          disabled={disabled}
          className={`w-full px-4 py-3 text-left rounded-xl border transition-all duration-200 flex items-center justify-between ${
            error
              ? "border-red-500/50 bg-red-500/5"
              : disabled
              ? "bg-slate-900 border-slate-800 text-slate-500 cursor-not-allowed"
              : "bg-slate-800 border-slate-700 hover:border-blue-500/50 text-white"
          }`}
        >
          <div className="flex-1 truncate">
            {selectedOption ? (
              <div>
                <div className="font-medium">{selectedOption.label}</div>
                {selectedOption.description && (
                  <div className="text-sm text-slate-400">{selectedOption.description}</div>
                )}
              </div>
            ) : (
              <span className="text-slate-500">Select {label}</span>
            )}
          </div>
          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>

        {isOpen && !disabled && (
          <>
            <div 
              className="fixed inset-0 z-10" 
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute z-20 w-full mt-1 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl max-h-64 overflow-y-auto scrollbar-thin">
              {options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    onChange(String(option.value));
                    setIsOpen(false);
                  }}
                  className={`w-full px-4 py-3 text-left hover:bg-slate-800 transition-colors ${
                    String(value) === String(option.value) 
                      ? "bg-blue-500/20 text-blue-400" 
                      : "text-slate-300"
                  }`}
                >
                  <div className="font-medium">{option.label}</div>
                  {option.description && (
                    <div className="text-sm text-slate-400 mt-1">{option.description}</div>
                  )}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
      
      {error && (
        <p className="text-sm text-red-400 flex items-center gap-1">
          <AlertCircle size={14} />
          {error}
        </p>
      )}
    </div>
  );
};

const PreviewItem = ({ label, value }) => (
  <div className="space-y-1">
    <p className="text-sm text-slate-400">{label}</p>
    <p className="text-white font-medium">{value}</p>
  </div>
);

/* =========================================================
   UTILITIES
   ========================================================= */

const auth = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

const extractArray = (res) => {
  if (Array.isArray(res)) return res;
  if (res?.data && Array.isArray(res.data)) return res.data;
  if (res?.content && Array.isArray(res.content)) return res.content;
  return [];
};