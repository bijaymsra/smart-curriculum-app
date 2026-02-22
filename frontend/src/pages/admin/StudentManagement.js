import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Users, Calendar, AlertCircle, Eye, BookOpen, Phone, MapPin, Ban, CheckCircle, Clock, Mail, User, Settings, ArrowLeft } from "lucide-react";
import { useAdmin } from '../../context/AdminContext';
import API_BASE from "../../config/api";
import { authFetch } from "../../utils/authFetch";

export default function StudentManagement() {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const { admin, loading: adminLoading } = useAdmin();

  const [student, setStudent] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  
  const [pendingStatus, setPendingStatus] = useState("");
  const [pendingSection, setPendingSection] = useState("");
  const [pendingSemester, setPendingSemester] = useState("");
  
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);


  const hasChanges = !!student && pendingStatus !== student.status;

  const getInitials = (name = "") =>
    name
      ?.trim()
      ?.split(/\s+/)
      ?.map(n => n[0])
      ?.join("")
      ?.toUpperCase() || "NA";

  // Redirect effect
  useEffect(() => {
    if (!adminLoading && !admin) {
      navigate('/login');
    }
  }, [adminLoading, admin, navigate]);

  // Fetch student data
  useEffect(() => {
    // Don't fetch if still loading admin or no admin
    if (adminLoading || !admin || !admin.adminId) return;
    
    setLoading(true);
    console.log("Fetching student with adminId:", admin.adminId);

    authFetch(`${API_BASE}/api/admin/students/${studentId}?adminId=${admin.adminId}`)
      .then(async (res) => {
        console.log("HTTP status:", res.status);
        const text = await res.text();
        console.log("Raw response:", text);

        if (!res.ok) {
          throw new Error("Request failed");
        }

        return JSON.parse(text);
      })
      .then((data) => {
        console.log("Parsed student object:", data);
        setStudent(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setLoading(false);
      });
  }, [studentId, admin, adminLoading]); 

  //  Update pending values when student changes
  useEffect(() => {
    if (student) {
      setPendingStatus(student.status);
      setPendingSection(student.section ?? "");
      setPendingSemester(student.semester ?? "");
    }
  }, [student]);

  const handleSave = async () => {
    if (!student || !hasChanges || saving || !admin) {
      if (!admin) navigate('/login');
      return;
    }

    setSaving(true);
    setSaveError("");
    setSaveSuccess(false);

    const payload = {
      status: pendingStatus,
    };

    try {
      const res = await authFetch(
        `${API_BASE}/api/admin/students/${student.id}/status?adminId=${admin.adminId}`,
        {
          method: "PATCH",
          headers: { 
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Update failed");
      }

      const updatedStudent = await res.json();

      // update UI state
      setStudent(updatedStudent);
      setPendingStatus(updatedStudent.status);

      // show success
      setSaveSuccess(true);

      // ⏳ auto-hide after 3s
      setTimeout(() => setSaveSuccess(false), 3000);

    } catch (err) {
      console.error("Save failed:", err);
      setSaveError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (!student) return;

    setPendingStatus(student.status);
    setPendingSection(student.section ?? "");
    setPendingSemester(student.semester ?? "");
  };

  const getStatusConfig = (status = "ACTIVE") => {
    const configs = {
      ACTIVE: {
        color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
        icon: CheckCircle,
      },
      WARNING: {
        color: "bg-orange-500/20 text-orange-400 border-orange-500/30",
        icon: AlertCircle,
      },
      SUSPENDED: {
        color: "bg-red-500/20 text-red-400 border-red-500/30",
        icon: Ban,
      },
      PENDING: {
        color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
        icon: Clock,
      },
    };
    return configs[status] || configs.ACTIVE;
  };

  // Early returns AFTER all hooks
  if (adminLoading) {
    return <div className="p-10 text-slate-400">Loading admin...</div>;
  }

  if (!admin) {
    return <div className="p-10 text-slate-400">Redirecting to login...</div>;
  }

  if (loading) {
    return <div className="p-10 text-slate-400">Loading student…</div>;
  }

  if (!student) {
    return <div className="p-10 text-red-400">Student not found</div>;
  }

  console.log({
    pendingStatus,
    currentStatus: student?.status,
    pendingSection,
    currentSection: student?.section,
    pendingSemester,
    currentSemester: student?.semester,
    hasChanges,
  });

  /* =======================
     PAGE START
  ======================= */
  return (
    <div className="min-h-screen bg-slate-900 p-6 space-y-6">

      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-400 hover:text-white"
      >
        <ArrowLeft size={18} />
        Back to Students
      </button>

      {/* =======================
         HEADER (EX-MODAL HEADER)
      ======================= */}
      <div className="bg-slate-800 rounded-2xl border border-slate-700 shadow-2xl overflow-hidden">

        <div className="p-6 border-b border-slate-700/50 bg-gradient-to-r from-blue-500/10 to-purple-500/10">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                  {getInitials(student.fullName)}
                </div>
                <div
                className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-4 border-slate-800 ${
                    student.status === "ACTIVE"
                    ? "bg-green-400"
                    : student.status === "WARNING"
                    ? "bg-orange-400"
                    : "bg-red-400"
                }`}
                />
              </div>

              <div>
                <h3 className="text-2xl font-bold text-white mb-1">
                  {student.fullName || "Unknown Student"}
                </h3>

                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-slate-400 text-sm font-mono">
                    {student.registrationNo || "N/A"}
                  </span>
                  <span className="text-slate-600">•</span>
                  <span className="text-slate-400 text-sm">
                    {student.publicId || "N/A"}
                  </span>

                  <span
                    className={`px-2 py-1 rounded-lg text-xs font-semibold border inline-flex items-center gap-1 ${getStatusConfig(
                      student.status
                    ).color}`}
                  >
                    {React.createElement(
                      getStatusConfig(student.status).icon,
                      { size: 12 }
                    )}
                    {student.status}
                  </span>
                </div>

                <p className="text-slate-500 text-xs mt-1">
                  Last active: {student.lastActive || "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* =======================
           TABS (UNCHANGED)
        ======================= */}
        <div className="border-b border-slate-700/50 bg-slate-800/50 px-6">
          <div className="flex gap-1 overflow-x-auto">
            {[
              { id: "overview", label: "Overview", icon: Eye },
              { id: "academic", label: "Academic", icon: BookOpen },
              { id: "personal", label: "Personal", icon: User },
              { id: "attendance", label: "Attendance", icon: Calendar },
              { id: "controls", label: "Controls", icon: Settings },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 font-medium transition-all relative flex items-center gap-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? "text-blue-400"
                    : "text-slate-400 hover:text-slate-300"
                }`}
              >
                {React.createElement(tab.icon, { size: 18 })}
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 overflow-y-auto">

          {/* ---- OVERVIEW ---- */}
{activeTab === "overview" && (
  <div className="space-y-6">

    {/* Quick Stats */}
    <div className="grid grid-cols-3 gap-4">
      <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/50">
        <div className="flex items-center gap-2 mb-2">
          <Calendar className="text-blue-400" size={16} />
          <p className="text-slate-400 text-xs">Attendance</p>
        </div>
        <p className="text-2xl font-bold text-white">
          {student.attendancePercentage ?? 0}%
        </p>
      </div>

      <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/50">
        <div className="flex items-center gap-2 mb-2">
          <BookOpen className="text-purple-400" size={16} />
          <p className="text-slate-400 text-xs">Semester</p>
        </div>
        <p className="text-2xl font-bold text-white">
          {student.semester ?? "N/A"}
        </p>
      </div>

      <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/50">
        <div className="flex items-center gap-2 mb-2">
          <Users className="text-green-400" size={16} />
          <p className="text-slate-400 text-xs">Section</p>
        </div>
        <p className="text-2xl font-bold text-white">
          {student.section ?? "N/A"}
        </p>
      </div>
    </div>

    {/* Key Information */}
    <div className="grid grid-cols-2 gap-6">

      {/* Left column */}
      <div className="space-y-4">
        <div>
          <p className="text-slate-400 text-sm mb-1.5">Program</p>
          <p className="text-white font-medium">
            {student.course ?? "N/A"}{" "}
            {/* {student.department ?? ""} */}
          </p>
        </div>

        <div>
          <p className="text-slate-400 text-sm mb-1.5">Email</p>
          <p className="text-white font-medium flex items-center gap-2">
            <Mail size={14} className="text-slate-500" />
            {student.email ?? "N/A"}
          </p>
        </div>

        <div>
          <p className="text-slate-400 text-sm mb-1.5">Phone</p>
          <p className="text-white font-medium flex items-center gap-2">
            <Phone size={14} className="text-slate-500" />
            {student.phone ?? "N/A"}
          </p>
        </div>
      </div>

      {/* Right column */}
      <div className="space-y-4">
        <div>
          <p className="text-slate-400 text-sm mb-1.5">Batch</p>
          <p className="text-white font-medium">
            {student.batch ?? "N/A"}
          </p>
        </div>

        <div>
          <p className="text-slate-400 text-sm mb-1.5">Admission Type</p>
          <p className="text-white font-medium">
            {student.admissionType ?? "N/A"}
          </p>
        </div>

        <div>
          <p className="text-slate-400 text-sm mb-1.5">Joined</p>
          <p className="text-white font-medium">
            {student.joinedDate ?? "N/A"}
          </p>
        </div>
      </div>

    </div>
  </div>
)}



 {/* ---- ACADEMIC ---- */}

{activeTab === "academic" && (
  <div className="space-y-6">

    {/* Student Identifiers */}
    <div className="grid grid-cols-2 gap-6">
      <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/50">
        <p className="text-slate-400 text-sm mb-2">Registration Number</p>
        <p className="text-white font-mono text-lg">
          {student.registrationNo ?? "N/A"}
        </p>
      </div>

      <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/50">
        <p className="text-slate-400 text-sm mb-2">Roll Number</p>
        <p className="text-white font-mono text-lg">
          {student.rollNo ?? "N/A"}
        </p>
      </div>
    </div>

    {/* Academic Details */}
    <div className="grid grid-cols-2 gap-6">
      <div>
        <p className="text-slate-400 text-sm mb-1.5">Program / Degree</p>
        <p className="text-white font-medium">
          {student.course ?? "N/A"}
        </p>
      </div>

      <div>
        <p className="text-slate-400 text-sm mb-1.5">Department</p>
        <p className="text-white font-medium">
          {student.department ?? "N/A"}
        </p>
      </div>

      <div>
        <p className="text-slate-400 text-sm mb-1.5">
          Academic Year / Batch
        </p>
        <p className="text-white font-medium">
          {student.batch ?? "N/A"}
        </p>
      </div>

      <div>
        <p className="text-slate-400 text-sm mb-1.5">
          Current Semester
        </p>
        <p className="text-white font-medium">
          {student.semester ?? "N/A"}
        </p>
      </div>

      <div>
        <p className="text-slate-400 text-sm mb-1.5">Section</p>
        <p className="text-white font-medium">
          {student.section ?? "N/A"}
        </p>
      </div>

      <div>
        <p className="text-slate-400 text-sm mb-1.5">
          Admission Type
        </p>
        <p className="text-white font-medium">
          {student.admissionType ?? "N/A"}
        </p>
      </div>
    </div>

    {/* Academic Status */}
    <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
      <div className="flex items-start gap-3">
        <BookOpen className="text-blue-400 mt-1" size={20} />
        <div>
          <p className="text-white font-medium mb-1">
            Current Academic Status
          </p>
          <p className="text-slate-400 text-sm">
            {student.status === "ACTIVE"
              ? `Active student in semester ${student.semester ?? "N/A"}, maintaining ${student.attendancePercentage ?? 0}% attendance rate.`
              : "Student is not currently active."}
          </p>
        </div>
      </div>
    </div>

  </div>
)}



          {/* ---- PERSONAL ---- */}
{activeTab === "personal" && (
  <div className="space-y-6">

    {/* Basic Personal Info */}
    <div className="grid grid-cols-2 gap-6">
      <div>
        <p className="text-slate-400 text-sm mb-1.5">Date of Birth</p>
        <p className="text-white font-medium">
          {student.dateOfBirth ?? "N/A"}
        </p>
      </div>

      <div>
        <p className="text-slate-400 text-sm mb-1.5">Gender</p>
        <p className="text-white font-medium">
          {student.gender ?? "N/A"}
        </p>
      </div>
    </div>

    {/* Email */}
    <div>
      <p className="text-slate-400 text-sm mb-1.5 flex items-center gap-2">
        <Mail size={14} />
        Email Address
      </p>
      <p className="text-white font-medium">
        {student.email ?? "N/A"}
      </p>
    </div>

    {/* Phone */}
    <div>
      <p className="text-slate-400 text-sm mb-1.5 flex items-center gap-2">
        <Phone size={14} />
        Phone Number
      </p>
      <p className="text-white font-medium">
        {student.phone ?? "N/A"}
      </p>
    </div>

    {/* Address */}
    <div>
      <p className="text-slate-400 text-sm mb-1.5 flex items-center gap-2">
        <MapPin size={14} />
        Address
      </p>
      <p className="text-white font-medium mb-2">
        {student.address ?? "N/A"}
      </p>
      <p className="text-slate-400 text-sm">
        {(student.city || "N/A")}{student.city && student.state ? ", " : ""}
        {student.state || ""}
      </p>
    </div>

    {/* Guardian Information */}
    <div className="border-t border-slate-700/50 pt-6">
      <h4 className="text-white font-semibold mb-4">
        Guardian Information
      </h4>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <p className="text-slate-400 text-sm mb-1.5">Guardian Name</p>
          <p className="text-white font-medium">
            {student.guardianName ?? "N/A"}
          </p>
        </div>

        <div>
          <p className="text-slate-400 text-sm mb-1.5">Guardian Phone</p>
          <p className="text-white font-medium">
            {student.guardianPhone ?? "N/A"}
          </p>
        </div>
      </div>
    </div>

  </div>
)}


{/* ---- ATTENDANCE ---- */}
{activeTab === "attendance" && (
  <div className="space-y-6">

    {/* Overall Attendance */}
    <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/5 border border-blue-500/20 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-slate-400 text-sm mb-1">
            Overall Attendance
          </p>
          <p className="text-4xl font-bold text-white">
            {student.attendancePercentage ?? 0}%
          </p>
        </div>

        <div className="w-24 h-24 rounded-full border-8 border-blue-500/20 flex items-center justify-center">
          <p className="text-2xl font-bold text-blue-400">
            {student.attendancePercentage ?? 0}%
          </p>
        </div>
      </div>

      <div className="w-full bg-slate-700/30 rounded-full h-3 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all"
          style={{
            width: `${student.attendancePercentage ?? 0}%`,
          }}
        />
      </div>
    </div>

    {/* Attendance Stats */}
    <div className="grid grid-cols-3 gap-4">
      <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/50">
        <p className="text-slate-400 text-xs mb-2">
          Classes Attended
        </p>
        <p className="text-2xl font-bold text-green-400">
          {student.classesAttended ?? "N/A"}
        </p>
      </div>

      <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/50">
        <p className="text-slate-400 text-xs mb-2">
          Classes Missed
        </p>
        <p className="text-2xl font-bold text-red-400">
          {student.classesMissed ?? "N/A"}
        </p>
      </div>

      <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/50">
        <p className="text-slate-400 text-xs mb-2">
          Total Classes
        </p>
        <p className="text-2xl font-bold text-white">
          {student.totalClasses ?? "N/A"}
        </p>
      </div>
    </div>

  </div>
)}




{/* control section */}

{activeTab === "controls" && student && (
  <div className="space-y-8">

    {/* ================= INFO ================= */}
    <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4">
      <div className="flex items-start gap-3">
        <AlertCircle className="text-orange-400 mt-1" size={20} />
        <div>
          <p className="text-white font-medium mb-1">Admin Controls</p>
          <p className="text-slate-400 text-sm">
            Changes are applied only after saving. Emails are sent automatically.
          </p>
        </div>
      </div>
    </div>

    {/* ================= STATUS MANAGEMENT ================= */}
    <div>
      <h4 className="text-white font-semibold mb-4">Student Status</h4>

      <div className="grid grid-cols-4 gap-4">
        {[
          {
            key: "ACTIVE",
            label: "Active",
            icon: CheckCircle,
            activeClass: "bg-green-500/20 border-green-500",
            textClass: "text-green-400",
          },
          {
            key: "PENDING",
            label: "Pending",
            icon: Clock,
            activeClass: "bg-yellow-500/20 border-yellow-500",
            textClass: "text-yellow-400",
          },
          {
            key: "WARNING",
            label: "Warning",
            icon: AlertCircle,
            activeClass: "bg-orange-500/20 border-orange-500",
            textClass: "text-orange-400",
          },
          {
            key: "SUSPENDED",
            label: "Suspended",
            icon: Ban,
            activeClass: "bg-red-500/20 border-red-500",
            textClass: "text-red-400",
          },
        ].map((s) => {
          const Icon = s.icon;
          const isSelected = pendingStatus === s.key;

          return (
            <button
              key={s.key}
              onClick={() => setPendingStatus(s.key)}
              className={`p-4 rounded-xl border transition-all text-left
                ${
                  isSelected
                    ? s.activeClass
                    : "bg-slate-900/50 border-slate-700 hover:bg-slate-800"
                }
              `}
            >
              <div className="flex items-center gap-3 mb-2">
                <Icon className={s.textClass} size={20} />
                <p className="text-white font-medium">{s.label}</p>
              </div>
              <p className="text-slate-400 text-xs">
                {isSelected ? "Selected" : "Click to select"}
              </p>
            </button>
          );
        })}
      </div>

      {/* Approval info */}
      {student.status === "PENDING" &&
        pendingStatus === "ACTIVE" &&
        !student.hasCredentials && (
          <div className="mt-4 bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 text-sm text-blue-300">
            On approval, the system will generate login credentials and email them to{" "}
            <span className="font-medium">{student.email}</span>.
          </div>
      )}

    </div>



{/* ================= FOOTER ================= */}
<div className="space-y-3 pt-4 border-t border-slate-700">

  {saveError && (
    <div className="bg-red-500/10 border border-red-500/20 text-red-300 text-sm rounded-lg p-3">
      {saveError}
    </div>
  )}

  {saveSuccess && (
    <div className="bg-green-500/10 border border-green-500/20 text-green-300 text-sm rounded-lg p-3 flex items-center gap-2">
      <CheckCircle size={16} />
      Changes saved successfully
    </div>
  )}

  <div className="flex gap-3">

      <button
      onClick={handleSave}
      disabled={!hasChanges || saving}
      className={`flex-1 px-6 py-3 rounded-xl font-medium transition-all
        ${
          saving
            ? "bg-blue-500/60 cursor-wait text-white"
            : hasChanges
            ? "bg-blue-500 hover:bg-blue-600 text-white"
            : "bg-slate-600 text-slate-400 cursor-not-allowed"
        }
      `}
    >
      {saving ? "Saving..." : "Save Changes"}
    </button>


    <button
      onClick={handleCancel}
      disabled={saving}
      className="flex-1 px-6 py-3 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white rounded-xl font-medium transition"
    >
      Cancel
    </button>
  </div>

  {!hasChanges && !saving && !saveSuccess && (
    <p className="text-slate-500 text-xs text-center">
      No changes to save
    </p>
  )}
</div>

  </div>
)}

        </div>
      </div>
    </div>
  );
}