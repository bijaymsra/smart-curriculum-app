import React, { useEffect, useState } from "react";
import API_BASE from "../../config/api";
import { authFetch } from "../../utils/authFetch";
import {
  User,
  Mail,
  Phone,
  Calendar,
  GraduationCap,
  Building,
} from "lucide-react";

const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-4 py-3 border-b border-slate-700/40">
    <Icon className="text-slate-500 mt-1" size={18} />
    <div>
      <div className="text-sm text-slate-400">{label}</div>
      <div className="text-white font-medium">
        {value || <span className="text-slate-500">Not Provided</span>}
      </div>
    </div>
  </div>
);

const StudentProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await authFetch(`${API_BASE}/api/student/profile`);
      const data = await res.json();
      setProfile(data);
    } catch (err) {
      console.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-14 w-14 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-8 rounded-2xl border border-slate-700">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 bg-blue-500/20 rounded-full flex items-center justify-center">
            <User className="text-blue-400" size={40} />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white">
              {profile.fullName}
            </h2>
            <p className="text-slate-400 mt-1">
              {profile.registrationNo}
            </p>
            <p className="text-sm text-emerald-400 mt-2">
              {profile.status}
            </p>
          </div>
        </div>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Personal Info */}
        <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700">
          <h3 className="text-white text-lg font-semibold mb-4">
            Personal Information
          </h3>

          <InfoRow icon={Mail} label="Email" value={profile.email} />
          <InfoRow icon={Phone} label="Phone" value={profile.phone} />
          <InfoRow icon={Calendar} label="Date of Birth" value={profile.dateOfBirth} />
        </div>

        {/* Academic Info */}
        <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700">
          <h3 className="text-white text-lg font-semibold mb-4">
            Academic Information
          </h3>

          <InfoRow icon={GraduationCap} label="Course" value={profile.course} />
          <InfoRow icon={GraduationCap} label="Department" value={profile.department} />
          <InfoRow icon={GraduationCap} label="Semester" value={profile.semester} />
          <InfoRow icon={GraduationCap} label="Section" value={profile.section} />
          <InfoRow icon={GraduationCap} label="Batch" value={profile.batch} />
          <InfoRow icon={GraduationCap} label="Roll No" value={profile.rollNo} />
          <InfoRow icon={GraduationCap} label="Admission Type" value={profile.admissionType} />
        </div>

      </div>

      {/* Institution */}
      <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700">
        <h3 className="text-white text-lg font-semibold mb-4">
          Institution Details
        </h3>

        <InfoRow icon={Building} label="Institution" value={profile.institutionName} />
        <InfoRow icon={Calendar} label="Joined Date" value={profile.joinedDate} />
      </div>

    </div>
  );
};

export default StudentProfile;
