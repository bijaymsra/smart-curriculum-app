import React, { useState, useEffect, useCallback } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Briefcase, GraduationCap, Building, Award, Plus, X, Save, AlertCircle, Heart, ArrowLeft, BookOpen, Shield, Book, Users, Flag, University, PhoneCall, CheckCircle, ExternalLink, Eye, Lock, Send} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';
import API_BASE from "../../config/api";
import { authFetch } from "../../utils/authFetch";

export default function AddFaculty() {
  const { admin, loading } = useAdmin();
  const institutionId = admin?.institutionId;
  const [departments, setDepartments] = useState([]);


  const navigate = useNavigate();
  const [loadingState, setLoading] = useState({
    departments: false,
  });



    const fetchDepartments = useCallback(async () => {
      if (!institutionId) return;

      setLoading(prev => ({ ...prev, departments: true }));

      try {
        const res = await authFetch(
          `${API_BASE}/api/admin/departments?institutionId=${institutionId}`,
          { signal: AbortSignal.timeout(10000) }
        );

        if (!res.ok) throw new Error(`Failed to fetch departments`);

        const data = await res.json();
        setDepartments(data);

      } catch (err) {
        console.error("Fetch departments error:", err);
      } finally {
        setLoading(prev => ({ ...prev, departments: false }));
      }
    }, [institutionId]);


    useEffect(() => {
      if (!admin?.institutionId) return;
      fetchDepartments();      
    }, [admin?.institutionId, fetchDepartments]);

  
  // Form state with all required fields
  const [formData, setFormData] = useState({
    // Section 1: Core Identity (Required)
    full_name: '',
    email: '',
    
    // Section 2: Employment Details (Required)
    departmentCode: '',
    designation: '',
    employment_type: 'PERMANENT',
    join_date: '',
    
    // Section 3: Contact Information (Required)
    phone: '',
    emergency_contact: '',
    alternate_phone: '',
    
    // Section 4: Address Details (Required)
    address: '',
    city: '',
    state: '',
    pincode: '',
    
    // Section 5: Academic Profile (Required)
    qualification: '',
    specialization: '',
    experience_years: '',
    institution_name: '',
    year_of_passing: '',
    
    // Section 6: Personal Info (Mostly Required)
    gender: '',
    date_of_birth: '',
    blood_group: '',
    marital_status: '',
    nationality: '',
    
    // Section 7: Optional Fields
    research_area: '',
  });
  
  // Form flow state
  const [currentStep, setCurrentStep] = useState(1); 
  
  
  const designations = [
    'Assistant Professor',
    'Associate Professor',
    'Professor',
    'Head of Department (HOD)',
    'Dean',
    'Visiting Faculty',
    'Adjunct Professor',
    'Guest Lecturer'
  ];
  
  const employmentTypes = [
    { value: 'PERMANENT', label: 'Permanent' },
    { value: 'CONTRACT', label: 'Contract' },
    { value: 'ADJUNCT', label: 'Adjunct' },
    { value: 'VISITING', label: 'Visiting' },
    { value: 'GUEST', label: 'Guest' }
  ];
  
  const qualifications = [
    'PhD',
    'M.Tech',
    'M.E.',
    'M.Sc.',
    'M.A.',
    'MBA',
    'B.Tech',
    'B.E.',
    'B.Sc.',
    'B.A.'
  ];
  
  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
  const genders = ['Male', 'Female', 'Other'];
  const maritalStatuses = ['Single', 'Married', 'Divorced', 'Widowed'];
  const nationalities = ['Indian', 'Other'];
  
  
  const handleChange = async (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "pincode" && value.length === 6) {
      try {
        const res = await fetch(
          `https://api.postalpincode.in/pincode/${value}`
        );
        const data = await res.json();

        if (data[0].Status === "Success") {
          const postOffice = data[0].PostOffice[0];

          setFormData((prev) => ({
            ...prev,
            city: postOffice.District,
            state: postOffice.State,
          }));
        }
      } catch (error) {
        console.error("Error fetching pincode data:", error);
      }
    }
  };


const buildFacultyPayload = () => ({
  fullName: formData.full_name,
  email: formData.email,
  phone: formData.phone,
  emergencyContact: formData.emergency_contact,
  alternatePhone: formData.alternate_phone,

  address: formData.address,
  city: formData.city,
  state: formData.state,
  pincode: formData.pincode,

  designation: formData.designation,
  departmentCode: formData.departmentCode,
  joinDate: formData.join_date,
  employmentType: formData.employment_type,

  experienceYears: Number(formData.experience_years),
  qualification: formData.qualification,
  institutionName: formData.institution_name,
  specialization: formData.specialization,
  researchArea: formData.research_area,

  gender: formData.gender?.toUpperCase(),
  dateOfBirth: formData.date_of_birth,
  bloodGroup: formData.blood_group,
  maritalStatus: formData.marital_status,
  nationality: formData.nationality,
  yearOfPassing: Number(formData.year_of_passing),
});


    const handleSubmit = async (e) => {
      e.preventDefault();

      try {
        if (loading) {
          alert("Admin data still loading. Please wait.");
          return;
        }


        const payload = buildFacultyPayload();

        const res = await authFetch(
          `${API_BASE}/api/admin/faculty?institutionId=${institutionId}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );

        if (!res.ok) {
          const err = await res.json();
          alert(err.message || "Failed to create faculty");
          return;
        }

        const createdFaculty = await res.json();

        localStorage.setItem("lastCreatedFaculty", createdFaculty.publicId);
        setCurrentStep(2);

      } catch (error) {
        console.error(error);
        alert("Server error while creating faculty");
      }
    };

  
  const isBasicInfoComplete = () => {
    const requiredFields = [
      'full_name', 'email',
      'departmentCode', 'designation', 'employment_type', 'join_date',
      'phone', 'emergency_contact',
      'address', 'city', 'state', 'pincode',
      'qualification', 'specialization', 'experience_years',
      'institution_name', 'year_of_passing',
      'gender', 'date_of_birth', 'blood_group',
      'marital_status', 'nationality'
    ];
    
    return requiredFields.every(field => {
      const value = formData[field];
      return value !== null && value !== undefined && value.toString().trim() !== '';
    });
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Not provided';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Step 1: Basic Information Form
  const renderBasicInfoForm = () => (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Section 1: Core Identity */}
      <div className="bg-slate-800/30 backdrop-blur-xl rounded-2xl border border-slate-700/50 overflow-hidden">
        <div className="p-6 border-b border-slate-700/50 bg-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl">
              <User className="text-purple-400" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Core Identity</h2>
              <p className="text-slate-400 text-sm">Basic identification details</p>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                <span className="flex items-center gap-2">
                  <User size={16} />
                  Full Name
                  <span className="text-red-400">*</span>
                </span>
              </label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                placeholder="Enter full name"
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                required
              />
            </div>
            
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                <span className="flex items-center gap-2">
                  <Mail size={16} />
                  Email Address
                  <span className="text-red-400">*</span>
                </span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="faculty@institution.edu"
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                required
              />
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Employment Details */}
      <div className="bg-slate-800/30 backdrop-blur-xl rounded-2xl border border-slate-700/50 overflow-hidden">
        <div className="p-6 border-b border-slate-700/50 bg-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl">
              <Briefcase className="text-blue-400" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Employment Details</h2>
              <p className="text-slate-400 text-sm">Official role and position</p>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

            {/* Department */}

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              <span className="flex items-center gap-2">
                <Building size={16} />
                Department
                <span className="text-red-400">*</span>
              </span>
            </label>

            <select
              name="departmentCode"
              value={formData.departmentCode || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  departmentCode: e.target.value,
                }))
              }
              disabled={loadingState.departments}
              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
              required
            >
              {loadingState.departments && (
                <option value="">Loading departments...</option>
              )}

              {!loadingState.departments && departments.length === 0 && (
                <option value="">
                  No departments found. Create one first.
                </option>
              )}

              {!loadingState.departments && departments.length > 0 && (
                <>
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option
                      key={dept.id}
                      value={dept.departmentCode}
                    >
                      {dept.departmentName} ({dept.departmentCode})
                    </option>
                  ))}
                </>
              )}
            </select>
          </div>
            
            {/* Designation */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                <span className="flex items-center gap-2">
                  <Award size={16} />
                  Designation
                  <span className="text-red-400">*</span>
                </span>
              </label>
              <select
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                required
              >
                <option value="">Select Designation</option>
                {designations.map(desg => (
                  <option key={desg} value={desg}>{desg}</option>
                ))}
              </select>
            </div>
            
            {/* Employment Type */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                <span className="flex items-center gap-2">
                  <Briefcase size={16} />
                  Employment Type
                  <span className="text-red-400">*</span>
                </span>
              </label>
              <select
                name="employment_type"
                value={formData.employment_type}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                required
              >
                {employmentTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
            
            {/* Join Date */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                <span className="flex items-center gap-2">
                  <Calendar size={16} />
                  Join Date
                  <span className="text-red-400">*</span>
                </span>
              </label>
              <input
                type="date"
                name="join_date"
                value={formData.join_date}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                required
              />
            </div>
          </div>
        </div>
      </div>

      {/* Section 3 & 4: Contact & Address */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Contact Information */}
        <div className="bg-slate-800/30 backdrop-blur-xl rounded-2xl border border-slate-700/50 overflow-hidden">
          <div className="p-6 border-b border-slate-700/50 bg-slate-800/50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl">
                <Phone className="text-green-400" size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Contact Information</h2>
                <p className="text-slate-400 text-sm">Primary & emergency contacts</p>
              </div>
            </div>
          </div>
          
          <div className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                <span className="flex items-center gap-2">
                  <Phone size={16} />
                  Phone Number
                  <span className="text-red-400">*</span>
                </span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 9876543210"
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                <span className="flex items-center gap-2">
                  <PhoneCall size={16} />
                  Alternate Phone
                </span>
              </label>
              <input
                type="tel"
                name="alternate_phone"
                value={formData.alternate_phone}
                onChange={handleChange}
                placeholder="+91 9876543210"
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                <span className="flex items-center gap-2">
                  <AlertCircle size={16} />
                  Emergency Contact
                  <span className="text-red-400">*</span>
                </span>
              </label>
              <input
                type="tel"
                name="emergency_contact"
                value={formData.emergency_contact}
                onChange={handleChange}
                placeholder="+91 9876543210"
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                required
              />
              <p className="text-slate-500 text-xs mt-2">Contact number for emergencies</p>
            </div>
          </div>
        </div>

        {/* Address Details */}
        <div className="bg-slate-800/30 backdrop-blur-xl rounded-2xl border border-slate-700/50 overflow-hidden">
          <div className="p-6 border-b border-slate-700/50 bg-slate-800/50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-orange-500/20 to-amber-500/20 rounded-xl">
                <MapPin className="text-orange-400" size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Address Details</h2>
                <p className="text-slate-400 text-sm">Residential address</p>
              </div>
            </div>
          </div>
          
          <div className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                <span className="flex items-center gap-2">
                  <MapPin size={16} />
                  Complete Address
                  <span className="text-red-400">*</span>
                </span>
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="House no, Street, Area"
                rows="3"
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all resize-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Pincode<span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                placeholder="560001"
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  City<span className="text-red-400">*</span>
                </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    placeholder="autofetching..."
                    readOnly
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white"
                  />

              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  State<span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  placeholder="autofetching..."
                  readOnly
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white"
                />
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Section 5: Academic Profile */}
      <div className="bg-slate-800/30 backdrop-blur-xl rounded-2xl border border-slate-700/50 overflow-hidden">
        <div className="p-6 border-b border-slate-700/50 bg-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 rounded-xl">
              <GraduationCap className="text-yellow-400" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Academic Profile</h2>
              <p className="text-slate-400 text-sm">Educational background</p>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Highest Qualification */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                <span className="flex items-center gap-2">
                  <GraduationCap size={16} />
                  Highest Qualification
                  <span className="text-red-400">*</span>
                </span>
              </label>
              <select
                name="qualification"
                value={formData.qualification}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                required
              >
                <option value="">Select Qualification</option>
                {qualifications.map(qual => (
                  <option key={qual} value={qual}>{qual}</option>
                ))}
              </select>
            </div>
            
            {/* Specialization */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                <span className="flex items-center gap-2">
                  <BookOpen size={16} />
                  Specialization
                  <span className="text-red-400">*</span>
                </span>
              </label>
              <input
                type="text"
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                placeholder="e.g., Artificial Intelligence"
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                required
              />
            </div>
            
            {/* Institute Name */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                <span className="flex items-center gap-2">
                  <University size={16} />
                  Institution Name
                  <span className="text-red-400">*</span>
                </span>
              </label>
              <input
                type="text"
                name="institution_name"
                value={formData.institution_name}
                onChange={handleChange}
                placeholder="Institute name"
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                required
              />
            </div>
            
            {/* Year of Passing */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                <span className="flex items-center gap-2">
                  <Calendar size={16} />
                  Year of Passing
                  <span className="text-red-400">*</span>
                </span>
              </label>
              <input
                type="number"
                name="year_of_passing"
                value={formData.year_of_passing}
                onChange={handleChange}
                placeholder="2020"
                min="1950"
                max={new Date().getFullYear()}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all [appearance:textfield]"
                required
              />
            </div>
            
            {/* Experience */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                <span className="flex items-center gap-2">
                  <Briefcase size={16} />
                  Experience (Years)
                  <span className="text-red-400">*</span>
                </span>
              </label>
              <input
                type="number"
                name="experience_years"
                value={formData.experience_years}
                onChange={handleChange}
                placeholder="5"
                min="0"
                max="50"
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all [appearance:textfield]"
                required
              />
            </div>
            
            {/* Research Area (Optional) */}
            <div className="lg:col-span-3">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                <span className="flex items-center gap-2">
                  <Book size={16} />
                  Research Area (Optional)
                </span>
              </label>
              <input
                type="text"
                name="research_area"
                value={formData.research_area}
                onChange={handleChange}
                placeholder="e.g., Machine Learning, Renewable Energy, etc."
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Section 6: Personal Information */}
      <div className="bg-slate-800/30 backdrop-blur-xl rounded-2xl border border-slate-700/50 overflow-hidden">
        <div className="p-6 border-b border-slate-700/50 bg-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-pink-500/20 to-rose-500/20 rounded-xl">
              <Users className="text-pink-400" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Personal Information</h2>
              <p className="text-slate-400 text-sm">Demographic details for HR records</p>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                <span className="flex items-center gap-2">
                  <User size={16} />
                  Gender
                  <span className="text-red-400">*</span>
                </span>
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                required
              >
                <option value="">Select Gender</option>
                {genders.map(gender => (
                  <option key={gender} value={gender}>{gender}</option>
                ))}
              </select>
            </div>
            
            {/* Date of Birth */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                <span className="flex items-center gap-2">
                  <Calendar size={16} />
                  Date of Birth
                  <span className="text-red-400">*</span>
                </span>
              </label>
              <input
                type="date"
                name="date_of_birth"
                value={formData.date_of_birth}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                required
              />
            </div>
            
            {/* Blood Group */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                <span className="flex items-center gap-2">
                  <Heart size={16} />
                  Blood Group
                  <span className="text-red-400">*</span>
                </span>
              </label>
              <select
                name="blood_group"
                value={formData.blood_group}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                required
              >
                <option value="">Select Blood Group</option>
                {bloodGroups.map(group => (
                  <option key={group} value={group}>{group}</option>
                ))}
              </select>
            </div>
            
            {/* Marital Status */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                <span className="flex items-center gap-2">
                  <Users size={16} />
                  Marital Status
                  <span className="text-red-400">*</span>
                </span>
              </label>
              <select
                name="marital_status"
                value={formData.marital_status}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                required
              >
                <option value="">Select Status</option>
                {maritalStatuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            
            {/* Nationality */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                <span className="flex items-center gap-2">
                  <Flag size={16} />
                  Nationality
                  <span className="text-red-400">*</span>
                </span>
              </label>
              <select
                name="nationality"
                value={formData.nationality}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                required
              >
                <option value="">Select Nationality</option>
                {nationalities.map(nat => (
                  <option key={nat} value={nat}>{nat}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Excluded Fields Notice */}
      <div className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-slate-700/50 rounded-lg">
            <Shield className="text-slate-400" size={24} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">System-Handled Information</h3>
            <p className="text-slate-300 mb-3">
              The following fields are automatically managed by the system and <span className="font-medium text-yellow-400">NOT required during faculty creation</span>:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-slate-800/30 p-3 rounded-lg">
                <p className="text-slate-400 text-sm font-medium">Security & Auth</p>
                <p className="text-slate-500 text-xs">Password, Login credentials, Faculty ID</p>
              </div>
              <div className="bg-slate-800/30 p-3 rounded-lg">
                <p className="text-slate-400 text-sm font-medium">Performance</p>
                <p className="text-slate-500 text-xs">Workload, Utilization, Rating, Attendance</p>
              </div>
              <div className="bg-slate-800/30 p-3 rounded-lg">
                <p className="text-slate-400 text-sm font-medium">Administrative</p>
                <p className="text-slate-500 text-xs">Payroll, Leaves, Documents, Permissions</p>
              </div>
            </div>
            <div className="mt-4 p-3 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
              <p className="text-yellow-300 text-sm font-medium flex items-center gap-2">
                <Lock size={16} />
                Status: Faculty will be created with <span className="text-yellow-400 ml-1">INACTIVE</span> status
              </p>
              <p className="text-slate-300 text-sm mt-1">
                Login credentials will be sent only after admin activates the account via the <span className="text-blue-300 font-medium">Eye button → Activate Account</span> in Faculty Management.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-6 border-t border-slate-700/50">
        <button
          type="button"
          onClick={() => navigate('/admin/faculty')}
          className="px-6 py-3 bg-slate-700/50 hover:bg-slate-700 text-white rounded-xl font-medium flex items-center gap-2 transition-all border border-slate-600/50"
        >
          <X size={20} />
          Cancel
        </button>
        
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => {
              const emptyForm = Object.fromEntries(
                Object.keys(formData).map(key => [key, ''])
              );
              setFormData({...emptyForm, employment_type: 'PERMANENT'});
            }}
            className="px-6 py-3 bg-slate-700/50 hover:bg-slate-700 text-white rounded-xl font-medium transition-all border border-slate-600/50"
          >
            Clear All
          </button>
  
            <button
              type="submit"
              disabled={!isBasicInfoComplete() || loading || !institutionId}
              className={`px-8 py-3 rounded-xl font-medium flex items-center gap-2 transition-all ${
                isBasicInfoComplete() && !loading && institutionId
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg hover:shadow-purple-500/20 hover:scale-105'
                  : 'bg-slate-700/50 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Save size={20} />
              {loading ? 'Loading...' : 
              !institutionId ? 'Institution ID Missing' : 
              !isBasicInfoComplete() ? 'Fill All Required Fields' :
              'Review & Create Faculty'}
            </button>
        </div>
      </div>
    </form>
  );

  // Step 2: Review & Confirmation
  const renderReviewConfirmation = () => (
    <div className="space-y-8">
      {/* Success Banner */}
      <div className="bg-gradient-to-r from-emerald-900/30 to-green-900/30 border border-emerald-500/30 rounded-2xl p-8 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center">
            <CheckCircle className="text-white" size={40} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Faculty Profile Created Successfully!</h2>
            <p className="text-slate-300 mt-3">
              A unique Faculty ID has been generated and the profile has been saved with <span className="text-yellow-400 font-medium">INACTIVE</span> status.
            </p>
          </div>
        </div>
      </div>

      {/* Next Steps */}
      <div className="bg-slate-800/30 backdrop-blur-xl rounded-2xl border border-slate-700/50 overflow-hidden">
        <div className="p-6 border-b border-slate-700/50 bg-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl">
              <Send className="text-blue-400" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Next Steps Required</h2>
              <p className="text-slate-400 text-sm">Complete the faculty onboarding process</p>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="space-y-6">
            <div className="flex items-start gap-4 p-4 bg-slate-800/50 rounded-xl">
              <div className="p-2 bg-yellow-500/20 rounded-lg">
                <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">1</span>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold mb-1">Activate Account (Admin Action Required)</h3>
                <p className="text-slate-300 text-sm">
                  Go to <span className="text-blue-300 font-medium">Admin Portal → Faculty Management</span>, 
                  find the new faculty member, click the <span className="text-yellow-300 font-medium">Eye button</span>, 
                  and select <span className="text-green-300 font-medium">"Activate Account"</span> to:
                </p>
                <ul className="text-slate-400 text-sm mt-2 space-y-1 ml-4 list-disc">
                  <li>Change status from INACTIVE to ACTIVE</li>
                  <li>Generate and send login credentials via email</li>
                  <li>Enable system access permissions</li>
                </ul>
              </div>
            </div>
            
            <div className="flex items-start gap-4 p-4 bg-slate-800/50 rounded-xl">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">2</span>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold mb-1">Assign Subjects & Schedule</h3>
                <p className="text-slate-300 text-sm">
                  After activation, assign subjects, set workload, and create teaching schedule 
                  through the faculty's detailed profile page.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 p-4 bg-slate-800/50 rounded-xl">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">3</span>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold mb-1">Upload Documents (Optional)</h3>
                <p className="text-slate-300 text-sm">
                  Faculty can upload required documents (degree certificates, ID proofs, etc.) 
                  after they log in to their account.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button
          onClick={() => navigate('/admin/faculty')}
          className="p-6 bg-slate-800/30 backdrop-blur-xl rounded-2xl border border-slate-700/50 hover:border-blue-500/50 transition-all group text-left"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-blue-500/20 rounded-xl group-hover:bg-blue-500/30 transition-colors">
              <Eye className="text-blue-400" size={24} />
            </div>
            <div>
              <h3 className="text-white font-semibold">View in Faculty Management</h3>
              <p className="text-slate-400 text-sm">Go to faculty list to activate account</p>
            </div>
          </div>
          <p className="text-slate-300 text-sm">
            Navigate to the faculty management panel where you can view all faculty members, 
            activate this new account, and manage permissions.
          </p>
        </button>
        
        <button
          onClick={() => {
            const emptyForm = Object.fromEntries(
              Object.keys(formData).map(key => [key, ''])
            );
            setFormData({...emptyForm, employment_type: 'PERMANENT'});
            setCurrentStep(1);
          }}
          className="p-6 bg-slate-800/30 backdrop-blur-xl rounded-2xl border border-slate-700/50 hover:border-purple-500/50 transition-all group text-left"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-purple-500/20 rounded-xl group-hover:bg-purple-500/30 transition-colors">
              <Plus className="text-purple-400" size={24} />
            </div>
            <div>
              <h3 className="text-white font-semibold">Add Another Faculty</h3>
              <p className="text-slate-400 text-sm">Create another faculty profile</p>
            </div>
          </div>
          <p className="text-slate-300 text-sm">
            Start creating another faculty member profile with a fresh form. 
            All previously entered data will be cleared.
          </p>
        </button>
      </div>

      {/* Summary of Created Profile */}
      <div className="bg-slate-800/30 backdrop-blur-xl rounded-2xl border border-slate-700/50 overflow-hidden">
        <div className="p-6 border-b border-slate-700/50 bg-slate-800/50">
          <h3 className="text-xl font-bold text-white">Created Profile Summary</h3>
          <p className="text-slate-400 text-sm">Details of the newly created faculty member</p>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <p className="text-slate-400 text-sm">Full Name</p>
                <p className="text-white font-medium">{formData.full_name}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Email</p>
                <p className="text-white font-medium">{formData.email}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Department</p>
                <p className="text-white font-medium">
                  {departments.find(d => d.id === formData.department_id)?.name || 'Not specified'}
                </p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Designation</p>
                <p className="text-white font-medium">{formData.designation}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-slate-400 text-sm">Phone</p>
                <p className="text-white font-medium">{formData.phone}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Join Date</p>
                <p className="text-white font-medium">{formatDate(formData.join_date)}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Qualification</p>
                <p className="text-white font-medium">{formData.qualification} in {formData.specialization}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Experience</p>
                <p className="text-white font-medium">{formData.experience_years} years</p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-slate-700/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Current Status</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                  <span className="text-yellow-400 font-medium">INACTIVE ACTIVATION</span>
                </div>
              </div>
              <button
                onClick={() => navigate('/admin/faculty')}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-medium flex items-center gap-2 hover:shadow-lg hover:shadow-blue-500/20 transition-all"
              >
                <ExternalLink size={20} />
                Go to Faculty Management
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => navigate('/admin/faculty')}
              className="p-2 hover:bg-slate-700/50 rounded-xl transition-colors"
            >
              <ArrowLeft className="text-slate-300" size={24} />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-white">
                {currentStep === 1 ? 'Add New Faculty' : 'Faculty Created Successfully'}
              </h1>
              <p className="text-slate-400 mt-1">
                {currentStep === 1 
                  ? 'Create a new faculty member with all required details' 
                  : 'Review the created profile and next steps'
                }
              </p>
            </div>
          </div>
          
          {/* Simplified Progress Indicator */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                currentStep === 1 
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg shadow-purple-500/20' 
                  : 'bg-gradient-to-r from-emerald-500 to-green-500'
              }`}>
                {currentStep === 1 ? (
                  <span className="text-white font-semibold text-lg">1</span>
                ) : (
                  <CheckCircle className="text-white" size={24} />
                )}
              </div>
              <div>
                <span className="text-white font-medium">Basic Information</span>
                <p className="text-slate-400 text-xs">All required details</p>
              </div>
            </div>
            
            <div className="h-px w-8 bg-slate-600"></div>
            
            <div className="flex items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                currentStep === 2 
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg shadow-purple-500/20' 
                  : 'bg-slate-700 border border-slate-600'
              }`}>
                <span className={`font-semibold text-lg ${currentStep === 2 ? 'text-white' : 'text-slate-400'}`}>
                  2
                </span>
              </div>
              <div>
                <span className={`font-medium ${currentStep === 2 ? 'text-white' : 'text-slate-400'}`}>
                  Review & Confirmation
                </span>
                <p className="text-slate-400 text-xs">Profile creation summary</p>
              </div>
            </div>
          </div>
          
          {/* Status Banner */}
          <div className="bg-gradient-to-r from-yellow-900/30 to-amber-900/30 border border-yellow-500/30 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <Lock className="text-yellow-400 mt-0.5" size={20} />
              <div>
                <p className="text-white font-medium">
                  Default Status: <span className="text-yellow-400">INACTIVE</span>
                </p>
                <p className="text-slate-300 text-sm mt-1">
                  Faculty will be created with <span className="text-yellow-400 font-medium">INACTIVE</span> status. 
                  Login credentials will be sent only after admin activates the account via the{' '}
                  <span className="text-blue-300 font-medium">Eye button → Activate Account</span> in Faculty Management section.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        {currentStep === 1 ? renderBasicInfoForm() : renderReviewConfirmation()}
        
        {/* Field Requirements Summary (Only in step 1) */}
        {currentStep === 1 && (
          <div className="mt-8 p-6 bg-slate-800/30 backdrop-blur-xl rounded-2xl border border-slate-700/50">
            <h3 className="text-lg font-semibold text-white mb-4">Field Requirements Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div>
                  <p className="text-slate-300 font-medium flex items-center gap-2">
                    <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                    Required Fields (22)
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {['Full Name', 'Email', 'Department', 'Designation', 
                      'Employment Type', 'Join Date', 'Phone', 'Emergency Contact', 
                      'Address', 'City', 'State', 'Pincode', 'Qualification', 
                      'Specialization', 'Experience', 'University', 
                      'Year of Passing', 'Gender', 'Date of Birth', 
                      'Blood Group', 'Marital Status', 'Nationality'].map((field) => (
                      <span key={field} className="px-3 py-1.5 bg-red-500/10 text-red-300 rounded-lg text-xs border border-red-500/20">
                        {field}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <p className="text-slate-300 font-medium flex items-center gap-2">
                    <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                    Optional Fields (2)
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {['Alternate Phone', 'Research Area'].map((field) => (
                      <span key={field} className="px-3 py-1.5 bg-blue-500/10 text-blue-300 rounded-lg text-xs border border-blue-500/20">
                        {field}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-slate-700/50">
                  <p className="text-slate-300 font-medium flex items-center gap-2">
                    <span className="w-3 h-3 bg-slate-500 rounded-full"></span>
                    Auto-Generated by System (8)
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {['Faculty ID', 'Public ID', 'Status', 'Password', 
                      'Created Date', 'Permissions', 'Workload', 'Utilization'].map((field) => (
                      <span key={field} className="px-3 py-1.5 bg-slate-500/10 text-slate-400 rounded-lg text-xs border border-slate-500/20">
                        {field}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
