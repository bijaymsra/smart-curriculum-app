import React, { useEffect, useState } from "react";
import { User, Save, Loader2 } from "lucide-react";
import API_BASE from "../../config/api";
import { authFetch } from "../../utils/authFetch";

const FacultySettings = () => {

  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await authFetch(
        `${API_BASE}/api/faculty/settings/me`
      );

      if (!res.ok) throw new Error("Failed to load profile");

      const data = await res.json();
      setProfile(data);
      setFormData({
        phone: data.phone || "",
        alternatePhone: data.alternatePhone || "",
        address: data.address || "",
        city: data.city || "",
        state: data.state || "",
        pincode: data.pincode || "",
        emergencyContact: data.emergencyContact || ""
      });

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setSuccess(false);

      const res = await authFetch(
        `${API_BASE}/api/faculty/settings/me`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData)
        }
      );

      if (!res.ok) throw new Error("Update failed");

      setSuccess(true);
      fetchProfile();

    } catch (err) {
      console.error(err);
      alert("Unable to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-slate-400">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="space-y-8">

      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <User className="text-blue-400" size={28} />
          <h2 className="text-2xl font-bold text-white">Faculty Profile Settings</h2>
        </div>

        {/* Read-only Info */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <Info label="Faculty ID" value={profile.facultyId} />
          <Info label="Full Name" value={profile.fullName} />
          <Info label="Designation" value={profile.designation} />
          <Info label="Department" value={profile.departmentName} />
          <Info label="Institution" value={profile.institutionName} />
          <Info label="Employment Type" value={profile.employmentType} />
          <Info label="Join Date" value={profile.joinDate} />
          <Info label="Status" value={profile.status} />
        </div>

        <hr className="border-slate-700 mb-8" />

        {/* Editable Section */}
        <h3 className="text-lg font-semibold text-white mb-6">
          Contact & Address Information
        </h3>

        <div className="grid md:grid-cols-2 gap-6">

          <Input label="Phone" name="phone" value={formData.phone} onChange={handleChange} />
          <Input label="Alternate Phone" name="alternatePhone" value={formData.alternatePhone} onChange={handleChange} />
          <Input label="Emergency Contact" name="emergencyContact" value={formData.emergencyContact} onChange={handleChange} />
          <Input label="Address" name="address" value={formData.address} onChange={handleChange} />
          <Input label="City" name="city" value={formData.city} onChange={handleChange} />
          <Input label="State" name="state" value={formData.state} onChange={handleChange} />
          <Input label="Pincode" name="pincode" value={formData.pincode} onChange={handleChange} />

        </div>

        {/* Save Button */}
        <div className="mt-10 flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50"
          >
            {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>

        {success && (
          <div className="mt-4 text-emerald-400 font-medium">
            Profile updated successfully.
          </div>
        )}

      </div>
    </div>
  );
};

const Info = ({ label, value }) => (
  <div>
    <label className="text-slate-400 text-sm">{label}</label>
    <div className="text-white font-medium mt-1">{value}</div>
  </div>
);

const Input = ({ label, ...props }) => (
  <div>
    <label className="text-slate-400 text-sm">{label}</label>
    <input
      {...props}
      className="w-full mt-1 p-3 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
);

export default FacultySettings;
