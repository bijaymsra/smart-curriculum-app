import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { useAdmin } from '../../context/AdminContext';
import API_BASE from "../../config/api";
import { authFetch } from "../../utils/authFetch";

export default function AddStudent() {
  const navigate = useNavigate();
  const { admin } = useAdmin();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    gender: "",
    dateOfBirth: "",
    course: "",
    department: "",
    batch: "",
    semester: "",
    section: "",
    admissionType: "Regular",
    rollNo: "",
    address: "",
    city: "",
    state: "",
    guardianName: "",
    guardianPhone: "",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState({ departments: false });


 const fetchDepartments = useCallback(async () => {
    setLoading(prev => ({ ...prev, departments: true }));
    try {
      const res = await authFetch(
        `${API_BASE}/api/admin/departments?institutionId=${admin.institutionId}`,
        { 
          signal: AbortSignal.timeout(10000)
        }
      );
      
      if (!res.ok) throw new Error(`Failed to fetch departments: ${res.status}`);
      
      const data = await res.json();
      setDepartments(data);


    if (!data.some(d => d.departmentCode === form.department)) {
      update("department", "");
    }
      
      setError(null);
    } catch (err) {
      console.error('Fetch departments error:', err);
      setError('Unable to load departments. Please try again.');
    } finally {
      setLoading(prev => ({ ...prev, departments: false }));
    }
    }, [admin?.institutionId, form.department]);


    useEffect(() => {
      if (!admin?.institutionId) return;
      fetchDepartments();      
    }, [admin?.institutionId, fetchDepartments]);


const handleSubmit = async () => {
    setError("");

    // Check if admin is logged in
    if (!admin) {
      setError("Please log in to add students");
      navigate('/login');
      return;
    }

    if (departments.length === 0) {
      setError("Please create a department before adding students.");
      return;
    }

    if (!form.fullName || !form.email || !form.course || !form.department || !form.batch || !form.semester || !form.section) {
      setError("Please fill all required fields (*)");
      return;
    }

    setSaving(true);

    try {
      // Use admin.adminId from context
      const res = await authFetch(
        `${API_BASE}/api/admin/students?adminId=${admin.adminId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fullName: form.fullName,
            email: form.email,
            phone: form.phone,
            gender: form.gender || null,
            dateOfBirth: form.dateOfBirth || null,
            course: form.course,
            department: form.department,
            batch: form.batch,
            semester: Number(form.semester),
            section: form.section,
            admissionType: form.admissionType,
            rollNo: form.rollNo,
            address: form.address,
            city: form.city,
            state: form.state,
            guardianName: form.guardianName,
            guardianPhone: form.guardianPhone,
          }),
        }
      );

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "Failed to create student");
      }

      setSuccess(true);
      
      // Reset form
      setForm({
        fullName: "",
        email: "",
        phone: "",
        gender: "",
        dateOfBirth: "",
        course: "",
        department: "",
        batch: "",
        semester: "",
        section: "",
        admissionType: "Regular",
        rollNo: "",
        address: "",
        city: "",
        state: "",
        guardianName: "",
        guardianPhone: "",
      });

    } catch (err) {
      console.error(err);
      setError("Failed to create student. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const update = (k, v) => setForm({ ...form, [k]: v });

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

      <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 space-y-8">

        <div>
          <h2 className="text-2xl font-bold text-white">Add New Student</h2>
          <p className="text-slate-400 text-sm">
            Student will be created in{" "}
            <span className="text-yellow-400 font-semibold">PENDING</span> status.
            Credentials are sent only after approval.
          </p>
          <p className="text-red-400 text-xs mt-2">
          * Marked fields are mandatory.
          </p>
        </div>


        {/* BASIC INFO */}
        <section className="space-y-4">
          <h4 className="text-white font-semibold">Basic Information</h4>

          <div className="grid grid-cols-2 gap-4">
            <input
              placeholder="Full Name *"
              value={form.fullName}
              onChange={e => update("fullName", e.target.value)}
              className="input"
            />
            <input
              placeholder="Email *"
              value={form.email}
              onChange={e => update("email", e.target.value)}
              className="input"
            />
            <input
              placeholder="Phone"
              value={form.phone}
              onChange={e => update("phone", e.target.value)}
              className="input"
            />
            <input
              placeholder="Roll No"
              value={form.rollNo}
              onChange={e => update("rollNo", e.target.value)}
              className="input"
            />
          </div>

            <div className="grid grid-cols-2 gap-4">
            <select
                value={form.gender}
                onChange={e => update("gender", e.target.value)}
                className="input"
            >
                <option value="">Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
            </select>

            <input
                type="date"
                value={form.dateOfBirth}
                onChange={e => update("dateOfBirth", e.target.value)}
                className="input"
                placeholder="Date of Birth"
            />

            </div>

        </section>

        {/* ACADEMIC */}
        <section className="space-y-4">
          <h4 className="text-white font-semibold">Academic Details</h4>

          <div className="grid grid-cols-3 gap-4">
            <input
            placeholder="Degree Program *"
            className="input"
            value={form.course}
            onChange={e => update("course", e.target.value)}
            />

          <select
            className="input"
            value={form.department}
            onChange={e => update("department", e.target.value)}
            disabled={loading.departments || departments.length === 0}
          >
            {/* Loading State */}
            {loading.departments && (
              <option value="">Loading departments...</option>
            )}

            {/* No Department Found */}
            {!loading.departments && departments.length === 0 && (
              <option value="">
                Create Department at Course Management.
              </option>
            )}


            {/* Normal State */}
            {!loading.departments && departments.length > 0 && (
              <>
                <option value="">Select Department *</option>
                {departments.map((dept) => (
                  <option
                    key={dept.departmentId || dept.id}
                    value={dept.departmentCode}   
                  >
                    {dept.departmentName} ({dept.departmentCode})
                  </option>
                ))}
              </>
            )}
          </select>

            <input
            placeholder="Batch *"
            className="input"
            value={form.batch}
            onChange={e => update("batch", e.target.value)}
            />

            <select
            className="input"
            value={form.semester}
            onChange={e => update("semester", e.target.value)}
            >
            <option value="">Semester *</option>
            {[1,2,3,4,5,6,7,8].map(s => (
                <option key={s} value={s}>{s}</option>
            ))}
            </select>


            <select
            className="input"
            value={form.section}
            onChange={e => update("section", e.target.value)}
            >
            <option value="">Section *</option>
            {["A","B","C","D"].map(s => (
                <option key={s} value={s}>{s}</option>
            ))}
            </select>


          </div>
        </section>

        {/* ADDRESS */}
        <section className="space-y-4">
        <h4 className="text-white font-semibold">Address Details</h4>

        <textarea
            placeholder="Address"
            value={form.address}
            onChange={e => update("address", e.target.value)}
            className="input resize-none"
            rows={3}
        />

        <div className="grid grid-cols-2 gap-4">
            <input
            placeholder="City"
            value={form.city}
            onChange={e => update("city", e.target.value)}
            className="input"
            />
            <input
            placeholder="State"
            value={form.state}
            onChange={e => update("state", e.target.value)}
            className="input"
            />
        </div>
        </section>


        {/* GUARDIAN */}
        <section className="space-y-4">
          <h4 className="text-white font-semibold">Guardian Information</h4>

          <div className="grid grid-cols-2 gap-4">
            <input
            placeholder="Guardian Name"
            className="input"
            value={form.guardianName}
            onChange={e => update("guardianName", e.target.value)}
            />

            <input
            placeholder="Guardian Phone"
            className="input"
            value={form.guardianPhone}
            onChange={e => update("guardianPhone", e.target.value)}
            />
          </div>
        </section>


        {success && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4">
            <p className="text-emerald-400 font-medium">
            Student created successfully.
            </p>
            <p className="text-slate-400 text-sm mt-1">
            Student is currently in <b>PENDING</b> status. Credentials will be sent after approval.
            </p>
        </div>
        )}

        {error && (
        <p className="text-red-400 text-sm">
            {error}
        </p>
        )}


        {/* ACTIONS */}
        <div className="flex gap-3 pt-4 border-t border-slate-700">

          {!success ? (
            <button
              onClick={handleSubmit}
              disabled={saving}
              className={`flex-1 px-6 py-3 rounded-xl font-medium transition
                ${
                  saving
                    ? "bg-slate-600 text-slate-300 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600 text-white"
                }
              `}
            >
              {saving ? "Creating student..." : "Create Student"}
            </button>
          ) : (
            <button
              onClick={() => setSuccess(false)}
              className="flex-1 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl"
            >
              Add Another Student
            </button>
          )}

          <button
            onClick={() => navigate(-1)}
            className="flex-1 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl"
          >
            Back to Students
          </button>

        </div>


      </div>
    </div>
  );
}
