import React, { useState, useEffect } from 'react';
import { Users,Briefcase, BookOpen, TrendingUp, Edit, Mail, Calendar, Shield, Activity, Save, Trash2, CreditCard, Star, Target, Clock3, ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';
import API_BASE from "../../config/api";

const facultyManagementApi = {
    getFacultyById: async (facultyId, institutionId) => {
      const token = localStorage.getItem('token');
      
      const id = isNaN(facultyId) ? facultyId : Number(facultyId);
      
      const response = await fetch(
        `${API_BASE}/api/admin/faculty/${id}?institutionId=${institutionId}`,
        {
          headers: {
            'Authorization': token ? `Bearer ${token}` : '',
            'Content-Type': 'application/json',
          }
        }
      );
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch faculty details: ${response.status} - ${errorText}`);
      }
      
      return response.json();
    },

  searchFaculty: async (institutionId, query) => {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${API_BASE}/api/admin/faculty/search?institutionId=${institutionId}&query=${encodeURIComponent(query)}`,
      {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
        }
      }
    );
    if (!response.ok) throw new Error('Failed to search faculty');
    return response.json();
  },

  updatePerformance: async (facultyId, institutionId, performanceData) => {
    const token = localStorage.getItem('token');
    let url = `${API_BASE}/api/admin/faculty-management/${facultyId}/performance?institutionId=${institutionId}`;
    
    const params = new URLSearchParams();
    if (performanceData.utilizationPercentage !== undefined) 
      params.append('utilizationPercentage', performanceData.utilizationPercentage);
    if (performanceData.punctualityPercentage !== undefined) 
      params.append('punctualityPercentage', performanceData.punctualityPercentage);
    if (performanceData.performanceScore !== undefined) 
      params.append('performanceScore', performanceData.performanceScore);
    if (performanceData.attendancePercentage !== undefined) 
      params.append('attendancePercentage', performanceData.attendancePercentage);
    if (performanceData.rating !== undefined) 
      params.append('rating', performanceData.rating);
    
    if (params.toString()) {
      url += `&${params.toString()}`;
    }
    
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
      }
    });
    if (!response.ok) throw new Error('Failed to update performance');
    return response.ok;
  },

  updateWorkload: async (facultyId, institutionId, workloadData) => {
    const token = localStorage.getItem('token');
    let url = `${API_BASE}/api/admin/faculty-management/${facultyId}/workload?institutionId=${institutionId}`;
    
    const params = new URLSearchParams();
    if (workloadData.weeklyWorkloadHours !== undefined) 
      params.append('weeklyWorkloadHours', workloadData.weeklyWorkloadHours);
    if (workloadData.idleHours !== undefined) 
      params.append('idleHours', workloadData.idleHours);
    
    if (params.toString()) {
      url += `&${params.toString()}`;
    }
    
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
      }
    });
    if (!response.ok) throw new Error('Failed to update workload');
    return response.ok;
  },

  updateLeaves: async (facultyId, institutionId, leavesData) => {
    const token = localStorage.getItem('token');
    let url = `${API_BASE}/api/admin/faculty-management/${facultyId}/leaves?institutionId=${institutionId}`;
    
    const params = new URLSearchParams();
    if (leavesData.medicalLeavesAvailable !== undefined) 
      params.append('medicalLeavesAvailable', leavesData.medicalLeavesAvailable);
    if (leavesData.casualLeavesAvailable !== undefined) 
      params.append('casualLeavesAvailable', leavesData.casualLeavesAvailable);
    
    if (params.toString()) {
      url += `&${params.toString()}`;
    }
    
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
      }
    });
    if (!response.ok) throw new Error('Failed to update leaves');
    return response.ok;
  },

  getRelatedFaculty: async (institutionId, department) => {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${API_BASE}/api/admin/faculty/filter?institutionId=${institutionId}&department=${department}`,
      {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
        }
      }
    );
    if (!response.ok) throw new Error('Failed to fetch related faculty');
    return response.json();
  },


  updateFacultyStatus: async (facultyId, institutionId, newStatus) => {
    const token = localStorage.getItem('token');
    const url = `${API_BASE}/api/admin/faculty/${facultyId}/status?status=${newStatus}&institutionId=${institutionId}`;
    
    const response = await fetch(url, {
      method: 'PATCH', 
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
      }
    });
    
    const responseText = await response.text();
    
    if (!response.ok) {
      throw new Error(`Failed to update faculty status: ${response.status} - ${responseText}`);
    }
    
    return response.ok; 
  },


  updateFacultyBasicInfo: async (facultyId, institutionId, facultyData) => {
    const token = localStorage.getItem('token');
    
    
    const requestBody = {
      fullName: facultyData.fullName,
      email: facultyData.email,
      phone: facultyData.phone,
      address: facultyData.address,
      city: facultyData.city,
      state: facultyData.state,
      pincode: facultyData.pincode,
      emergencyContact: facultyData.emergencyContact,
      bloodGroup: facultyData.bloodGroup,
      designation: facultyData.designation,
      department: facultyData.department,
      qualification: facultyData.qualification,
      specialization: facultyData.specialization,
      yearOfPassing: facultyData.yearOfPassing,
      experienceYears: facultyData.experienceYears,
      institutionName: facultyData.institutionName,
      dateOfBirth: facultyData.dateOfBirth,
      gender: facultyData.gender,
      researchArea: facultyData.researchArea,
      maritalStatus: facultyData.maritalStatus, 
      nationality: facultyData.nationality,      
      alternatePhone: facultyData.alternatePhone
    };
    
    
    const response = await fetch(
      `${API_BASE}/api/admin/faculty/${facultyId}?institutionId=${institutionId}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      }
    );
    
    // Get the response text first
    const responseText = await response.text();
    
    if (!response.ok) {
      throw new Error(`Failed to update faculty info: ${response.status} - ${responseText}`);
    }
    
    // Parse the JSON from the text we already read
    return responseText ? JSON.parse(responseText) : {};
  },


   
  deleteFaculty: async (facultyId, institutionId) => {
    const token = localStorage.getItem('token');
    
    const response = await fetch(
      `${API_BASE}/api/admin/faculty/${facultyId}?institutionId=${institutionId}`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        }
      }
    );
    
    // Get the response text first
    const responseText = await response.text();
    
    if (!response.ok) {
      throw new Error(`Failed to delete faculty: ${response.status} - ${responseText}`);
    }
    
    return response.ok;
  },

};

export default function FacultyManagement() {
  const { facultyId } = useParams();
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [editedFaculty, setEditedFaculty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedFaculty, setRelatedFaculty] = useState([]);
  const { admin, loading: adminLoading } = useAdmin();
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!adminLoading && !admin) {
      navigate('/login');
    }
  }, [adminLoading, admin, navigate]);

  useEffect(() => {
    if (adminLoading || !admin || !facultyId) return;
    
    const fetchFacultyData = async () => {
      try {
        setLoading(true);
        setError(null);
        const institutionId = admin?.institutionId;        
        const facultyResponse = await facultyManagementApi.getFacultyById(facultyId, institutionId);
        
        const mappedFaculty = {
          id: facultyResponse.id || facultyResponse.facultyId || facultyId,
          publicId: facultyResponse.publicId || facultyResponse.id || facultyId,
          facultyId: facultyResponse.facultyId || 'N/A',
          fullName: facultyResponse.name || 
                   facultyResponse.fullName || 
                   `${facultyResponse.firstName || ''} ${facultyResponse.lastName || ''}`.trim(),
          email: facultyResponse.email || 'No email',
          phone: facultyResponse.phone || facultyResponse.mobile || '',
          dateOfBirth: facultyResponse.dateOfBirth || 'Not specified',
          gender: facultyResponse.gender || 'Not specified',
          department: facultyResponse.departmentName || facultyResponse.department || 'Not assigned',
          designation: facultyResponse.designation || 'Not specified',
          qualification: facultyResponse.qualification || 'Not specified',
          specialization: facultyResponse.specialization || 'Not specified',
          yearOfPassing: facultyResponse.yearOfPassing || 'Not specified',
          maritalStatus: facultyResponse.maritalStatus || 'Not specified',
          experienceYears: facultyResponse.experienceYears || '0 years',
          institutionName: facultyResponse.institutionName || 'Not specified',
          subjects: facultyResponse.subjects || facultyResponse.assignedSubjects || [],
          workload: facultyResponse.workload || 
                   (facultyResponse.weeklyWorkloadHours ? `${facultyResponse.weeklyWorkloadHours} hrs/week` : 'Not specified'),
          utilization: facultyResponse.utilizationPercentage || facultyResponse.utilization || 0,
          punctuality: facultyResponse.punctualityPercentage || facultyResponse.punctuality || 0,
          idleHours: facultyResponse.idleHours || 0,
          status: facultyResponse.status || 'ACTIVE',
          joinDate: facultyResponse.joinDate || facultyResponse.createdAt || 'N/A',
          address: facultyResponse.address || 'Not specified',
          city: facultyResponse.city || 'Not specified',
          state: facultyResponse.state || 'Not specified',
          alternatePhone: facultyResponse.alternatePhone || 'Not specified',
          pincode: facultyResponse.pincode || 'Not specified',
          emergencyContact: facultyResponse.emergencyContact || 'Not specified',
          researchArea: facultyResponse.researchArea || 'Not Specified',
          bloodGroup: facultyResponse.bloodGroup || 'Not specified',
          nationality: facultyResponse.nationality || 'Not specified',
          accountNumber: facultyResponse.accountNumber || '',
          bankName: facultyResponse.bankName || '',
          ifscCode: facultyResponse.ifscCode || '',
          attendance: facultyResponse.attendancePercentage || 0,
          performanceScore: facultyResponse.performanceScore || 0,
          researchPapers: facultyResponse.researchPapers || 0,
          conferences: facultyResponse.conferences || 0,
          projects: facultyResponse.projects || 0,
          publications: facultyResponse.publications || 0,
          rating: facultyResponse.rating || 0,
          lastActive: facultyResponse.lastActive || 'N/A'
        };
        
        setSelectedFaculty(mappedFaculty);
        setEditedFaculty({ ...mappedFaculty });
        
        try {
          const related = await facultyManagementApi.getRelatedFaculty(institutionId, mappedFaculty.department);
          
          if (Array.isArray(related)) {
            const formattedRelated = related
              .filter(f => (f.publicId || f.id) !== facultyId)
              .slice(0, 3)
              .map(f => ({
                id: f.id || f.facultyId,
                publicId: f.publicId || f.id,
                facultyId: f.facultyId || 'N/A',
                fullName: f.name || f.fullName || `${f.firstName || ''} ${f.lastName || ''}`.trim(),
                designation: f.designation || 'Not specified',
                department: f.departmentName || f.department || 'Not assigned',
                status: f.status || 'ACTIVE',
                utilization: f.utilizationPercentage || f.utilization || 0
              }));
            
            setRelatedFaculty(formattedRelated);
          }
        } catch (relatedError) {
          console.warn('Could not fetch related faculty:', relatedError);
          setRelatedFaculty([]);
        }
        
      } catch (error) {
        console.error('Error fetching faculty data:', error);
        setError(error.message);
        alert(`Failed to load faculty details: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFacultyData();
  }, [facultyId, admin, adminLoading]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'WARNING': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'SUSPENDED': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'ON_LEAVE': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };


const handleSaveChanges = async () => {
  if (!editedFaculty || !selectedFaculty) return;
  
  try {
    setSaving(true);
    
    const institutionId = admin?.institutionId;
    const publicId = selectedFaculty.publicId || selectedFaculty.id;

    if (editedFaculty.status !== selectedFaculty.status) {
      await facultyManagementApi.updateFacultyStatus(publicId, institutionId, editedFaculty.status);
    }

    const updateData = {
      fullName: editedFaculty.fullName,
      email: editedFaculty.email,
      phone: editedFaculty.phone,
      emergencyContact: editedFaculty.emergencyContact,
      address: editedFaculty.address,
      city: editedFaculty.city,
      state: editedFaculty.state,
      alternatePhone: editedFaculty.alternatePhone,
      pincode: editedFaculty.pincode,
      bloodGroup: editedFaculty.bloodGroup,
      designation: editedFaculty.designation,
      department: editedFaculty.department,
      qualification: editedFaculty.qualification,
      specialization: editedFaculty.specialization,
      yearOfPassing: editedFaculty.yearOfPassing,
      experienceYears: editedFaculty.experienceYears,
      institutionName: editedFaculty.institutionName,
      dateOfBirth: editedFaculty.dateOfBirth,  
      gender: editedFaculty.gender,
      researchArea: editedFaculty.researchArea,
      maritalStatus: editedFaculty.maritalStatus,  
      nationality: editedFaculty.nationality
    };

    
    await facultyManagementApi.updateFacultyBasicInfo(publicId, institutionId, updateData);
    
    if (JSON.stringify(editedFaculty.permissions) !== JSON.stringify(selectedFaculty.permissions)) {
      await facultyManagementApi.updatePermissions(publicId, institutionId, editedFaculty.permissions);
    }
    
    setSelectedFaculty(editedFaculty);
    setIsEditing(false);
    
    alert('Faculty details updated successfully!');
    
  } catch (error) {
    console.error('Error saving changes:', error);
    alert(`Failed to save changes: ${error.message}`);
  } finally {
    setSaving(false);
  }
};

    
  const handleDeleteFaculty = async () => {
    if (!selectedFaculty) return;
    
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${selectedFaculty.fullName}? This action cannot be undone.`
    );
    
    if (!confirmDelete) return;
    
    setDeleting(true);
    
    try {
      const institutionId = admin?.institutionId;
      const facultyId = selectedFaculty.publicId || selectedFaculty.id;
      
      await facultyManagementApi.deleteFaculty(facultyId, institutionId);
      
      alert(`Faculty "${selectedFaculty.fullName}" deleted successfully!`);
      
      setTimeout(() => {
        navigate('/admin/faculty');
      }, 1000);
      
    } catch (error) {
      alert(`Failed to delete faculty: ${error.message}`);
    } finally {
      setDeleting(false);
    }
  };


const handleStatusChange = (newStatus) => {
  if (isEditing && editedFaculty) {
    setEditedFaculty(prev => ({
      ...prev,
      status: newStatus
    }));
  }
};


  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-950 flex items-center justify-center p-6">
        <div className="text-center p-8 bg-red-900/20 border border-red-700/50 rounded-2xl max-w-md">
          <div className="text-red-400 mx-auto mb-4 text-4xl">⚠️</div>
          <h2 className="text-2xl font-bold text-white mb-2">Error Loading Faculty</h2>
          <p className="text-slate-300 mb-4">{error}</p>
          <div className="flex gap-3 justify-center">
            <button 
              onClick={() => navigate('/admin/faculty')}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg"
            >
              Back to List
            </button>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (adminLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-4 text-slate-300 text-lg">Loading faculty details...</p>
        </div>
      </div>
    );
  }

  if (!admin || !selectedFaculty) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/admin/faculty')}
          className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors flex items-center gap-2 text-slate-400 hover:text-white"
        >
          <ArrowLeft size={20} />
          Back to Faculty List
        </button>
        <div className="h-4 w-px bg-slate-700/50"></div>
      </div>

      <div className="bg-slate-800/30 backdrop-blur-xl rounded-2xl border border-slate-700/50 overflow-hidden">
        <div className="p-6 border-b border-slate-700/50 bg-slate-800/50 flex items-start justify-between">

          <div className="flex items-start gap-4 flex-wrap sm:flex-nowrap">

            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
                {selectedFaculty.fullName.split(' ').map(n => n[0]).join('')}
              </div>
            </div>

            {/* Info Section */}
            <div className="flex-1 min-w-0">
              
              {/* Name + Status Row */}
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="text-2xl font-bold text-white break-words">
                  {selectedFaculty.fullName}
                </h3>

                {!isEditing && (
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold border whitespace-nowrap ${getStatusColor(selectedFaculty.status)}`}
                  >
                    {selectedFaculty.status}
                  </span>
                )}
              </div>

              <p className="text-slate-400 mt-1">
                {selectedFaculty.designation} • {selectedFaculty.department}
              </p>

              <p className="text-slate-500 text-sm mt-1">
                Faculty ID: {selectedFaculty.facultyId} • Joined: {selectedFaculty.joinDate}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleSaveChanges}
                  disabled={saving}
                  className={`px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-lg font-medium flex items-center gap-2 hover:shadow-lg hover:shadow-emerald-500/20 transition-all ${saving ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {saving ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                  ) : (
                    <Save size={18} />
                  )}
                  {saving ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={handleEditToggle}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleEditToggle}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg font-medium flex items-center gap-2 hover:shadow-lg hover:shadow-blue-500/20 transition-all"
                >
                  <Edit size={18} />
                  Edit
                </button>
                <button
                  onClick={handleDeleteFaculty}
                  disabled={deleting}
                  className={`px-4 py-2 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-lg font-medium flex items-center gap-2 hover:shadow-lg hover:shadow-red-500/20 transition-all ${deleting ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {deleting ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                  ) : (
                    <Trash2 size={18} />
                  )}
                  {deleting ? 'Deleting...' : 'Delete'}
                </button>
              </>
            )}
          </div>

        </div>

        <div className="px-6 pt-4 border-b border-slate-700/50 bg-slate-800/30">
          <div className="flex space-x-1 overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview', icon: Activity },
              { id: 'personal', label: 'Personal', icon: Users },
              { id: 'academic', label: 'Academic & Career', icon: Briefcase },
              { id: 'performance', label: 'Performance', icon: TrendingUp },
              { id: 'financial', label: 'Financial', icon: CreditCard },
              { id: 'permissions', label: 'Permissions', icon: Shield }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 text-sm font-medium rounded-lg flex items-center gap-2 transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-400 border border-purple-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/30'
                }`}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-700/50">
                  <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                    <Mail className="text-purple-400" size={20} />
                    Contact Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-slate-400 text-sm mb-2 block">Email</label>
                      {isEditing ? (
                        <input
                          type="email"
                          value={editedFaculty.email}
                          onChange={(e) => setEditedFaculty({...editedFaculty, email: e.target.value})}
                          className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                        />
                      ) : (
                        <p className="text-white font-medium">{selectedFaculty.email}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-slate-400 text-sm mb-2 block">Phone</label>
                      {isEditing ? (
                        <input
                          type="tel"
                          value={editedFaculty.phone}
                          onChange={(e) => setEditedFaculty({...editedFaculty, phone: e.target.value})}
                          className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                        />
                      ) : (
                        <p className="text-white font-medium">{selectedFaculty.phone}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-slate-400 text-sm mb-2 block">Emergency Contact</label>
                      {isEditing ? (
                        <input
                          type="tel"
                          value={editedFaculty.emergencyContact}
                          onChange={(e) => setEditedFaculty({...editedFaculty, emergencyContact: e.target.value})}
                          className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                        />
                      ) : (
                        <p className="text-white font-medium">{selectedFaculty.emergencyContact}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-slate-400 text-sm mb-2 block">Address</label>
                      {isEditing ? (
                        <textarea
                          value={editedFaculty.address}
                          onChange={(e) => setEditedFaculty({...editedFaculty, address: e.target.value})}
                          className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                          rows="2"
                        />
                      ) : (
                        <p className="text-white font-medium">{selectedFaculty.address}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-700/50">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-white font-semibold flex items-center gap-2">
                      <BookOpen className="text-pink-400" size={20} />
                      Current Subjects
                    </h4>
                    <button className="px-3 py-1 bg-purple-500/20 text-purple-400 text-sm rounded-lg hover:bg-purple-500/30 transition-colors">
                      Manage Subjects
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedFaculty.subjects.map((subject, i) => (
                      <span key={i} className="px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-purple-300 text-sm rounded-lg font-medium">
                        {subject}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-700/50">
                  <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                    <TrendingUp className="text-blue-400" size={20} />
                    Performance Metrics
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-slate-400 text-sm">Utilization</span>
                        <span className="text-white font-medium">{selectedFaculty.utilization}%</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            selectedFaculty.utilization >= 90 ? 'bg-red-500' :
                            selectedFaculty.utilization >= 75 ? 'bg-emerald-500' :
                            selectedFaculty.utilization >= 60 ? 'bg-orange-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${selectedFaculty.utilization}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-slate-400 text-sm">Punctuality</span>
                        <span className="text-white font-medium">{selectedFaculty.punctuality}%</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            selectedFaculty.punctuality >= 95 ? 'bg-emerald-500' :
                            selectedFaculty.punctuality >= 90 ? 'bg-blue-500' :
                            selectedFaculty.punctuality >= 85 ? 'bg-orange-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${selectedFaculty.punctuality}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-slate-400 text-sm">Performance Score</span>
                        <span className="text-white font-medium">{selectedFaculty.performanceScore}/100</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            selectedFaculty.performanceScore >= 90 ? 'bg-emerald-500' :
                            selectedFaculty.performanceScore >= 75 ? 'bg-blue-500' :
                            selectedFaculty.performanceScore >= 60 ? 'bg-orange-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${selectedFaculty.performanceScore}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/50">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock3 className="text-amber-400" size={16} />
                      <span className="text-slate-400 text-sm">Workload</span>
                    </div>
                    <p className="text-white font-bold text-xl">{selectedFaculty.workload}</p>
                    <p className="text-slate-500 text-xs mt-1">{selectedFaculty.idleHours} idle hrs/week</p>
                  </div>
                  <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/50">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="text-purple-400" size={16} />
                      <span className="text-slate-400 text-sm">Attendance</span>
                    </div>
                    <p className="text-white font-bold text-xl">{selectedFaculty.attendance}%</p>
                  </div>
                  <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/50">
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="text-yellow-400" size={16} />
                      <span className="text-slate-400 text-sm">Rating</span>
                    </div>
                    <p className="text-white font-bold text-xl">{selectedFaculty.rating}/5.0</p>
                    <p className="text-slate-500 text-xs mt-1">Based on student feedback</p>
                  </div>
                  <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/50">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="text-cyan-400" size={16} />
                      <span className="text-slate-400 text-sm">Experience</span>
                    </div>
                    <p className="text-white font-bold text-xl">{selectedFaculty.experience}</p>
                    <p className="text-slate-500 text-xs mt-1">Joined {selectedFaculty.joinDate}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* personal details */}

          {activeTab === 'personal' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-700/50">
                <h4 className="text-white font-semibold mb-4">Personal Details</h4>
                <div className="space-y-4">
                  {[
                    { label: 'Full Name', value: 'fullName', editable: true },
                    { label: 'Date of Birth', value: 'dateOfBirth', editable: true },
                    { label: 'Gender', value: 'gender', editable: true },
                    { label: 'Marital Status', value: 'maritalStatus', editable: true },
                    { label: 'Blood Group', value: 'bloodGroup', editable: true },
                    { label: 'Nationality', value: 'nationality', editable: true }
                  ].map(field => (
                    <div key={field.value}>
                      <label className="text-slate-400 text-sm mb-1 block">{field.label}</label>
                      {isEditing && field.editable ? (
                        <input
                          type="text"
                          value={editedFaculty[field.value] || ''}
                          onChange={(e) => setEditedFaculty({...editedFaculty, [field.value]: e.target.value})}
                          className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                        />
                      ) : (
                        <p className="text-white font-medium">{selectedFaculty[field.value] || 'Not specified'}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-700/50">
                <h4 className="text-white font-semibold mb-4">Contact & Address</h4>
                <div className="space-y-4">
                  {[
                    { label: 'Permanent Address', value: 'address', editable: true },
                    { label: 'City', value: 'city', editable: true },
                    { label: 'State', value: 'state', editable: true },
                    { label: 'Pincode', value: 'pincode', editable: true },
                    { label: 'Alternative Phone', value: 'alternatePhone', editable: true },
                    { label: 'Emergency Contact', value: 'emergencyContact', editable: true }
                  ].map(field => (
                    <div key={field.value}>
                      <label className="text-slate-400 text-sm mb-1 block">{field.label}</label>
                      {isEditing && field.editable ? (
                        field.value === 'address' ? (
                          <textarea
                            value={editedFaculty[field.value] || ''}
                            onChange={(e) => setEditedFaculty({...editedFaculty, [field.value]: e.target.value})}
                            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                            rows="2"
                          />
                        ) : (
                          <input
                            type="text"
                            value={editedFaculty[field.value] || ''}
                            onChange={(e) => setEditedFaculty({...editedFaculty, [field.value]: e.target.value})}
                            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                          />
                        )
                      ) : (
                        <p className="text-white font-medium">{selectedFaculty[field.value] || 'Not specified'}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'academic' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-700/50">
                <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <Briefcase className="text-purple-400" size={20} />
                      Academic & Career
                </h4>
                <div className="space-y-4">
                  {[
                    { label: 'Highest Qualification', value: 'qualification', editable: true },
                    { label: 'Specialization', value: 'specialization', editable: true },
                    { label: 'Institution Name', value: 'institutionName', editable: true },
                    { label: 'Year of Passing', value: 'yearOfPassing', editable: true },
                    { label: 'Research Area', value: 'researchArea', editable: true },
                    { label: 'Years of Experience', value: 'experienceYears', editable: true }
                  ].map(field => (
                    <div key={field.value}>
                      <label className="text-slate-400 text-sm mb-1 block">{field.label}</label>
                      {isEditing && field.editable ? (
                        <input
                          type="text"
                          value={editedFaculty[field.value] || ''}
                          onChange={(e) => setEditedFaculty({...editedFaculty, [field.value]: e.target.value})}
                          className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                        />
                      ) : (
                        <p className="text-white font-medium">{selectedFaculty[field.value] || 'Not specified'}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-700/50">
                <h4 className="text-white font-semibold mb-4">Research & Publications</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="text-slate-400 text-sm mb-1">Research Papers</p>
                    <p className="text-white font-bold text-2xl">{selectedFaculty.researchPapers || 0}</p>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="text-slate-400 text-sm mb-1">Conferences</p>
                    <p className="text-white font-bold text-2xl">{selectedFaculty.conferences || 0}</p>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="text-slate-400 text-sm mb-1">Projects</p>
                    <p className="text-white font-bold text-2xl">{selectedFaculty.projects || 0}</p>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="text-slate-400 text-sm mb-1">Publications</p>
                    <p className="text-white font-bold text-2xl">{selectedFaculty.publications || 0}</p>
                  </div>
                </div>
                {isEditing && (
                  <div className="mt-4">
                    <label className="text-slate-400 text-sm mb-2 block">Add Publication</label>
                    <textarea
                      placeholder="Enter publication details..."
                      className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                      rows="3"
                    />
                    <button className="mt-2 px-4 py-2 bg-purple-500/20 text-purple-400 text-sm rounded-lg hover:bg-purple-500/30 transition-colors">
                      Add Publication
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'performance' && (
            <div className="space-y-6">
              <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-700/50">
                <h4 className="text-white font-semibold mb-4">Performance Overview</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-lg p-4">
                    <p className="text-slate-400 text-sm mb-1">Overall Rating</p>
                    <div className="flex items-center gap-2">
                      <p className="text-white font-bold text-2xl">{selectedFaculty.rating}/5.0</p>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            className={i < Math.floor(selectedFaculty.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-slate-600'}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-lg p-4">
                    <p className="text-slate-400 text-sm mb-1">Attendance Rate</p>
                    <p className="text-white font-bold text-2xl">{selectedFaculty.attendance}%</p>
                    <p className="text-slate-500 text-xs mt-1">
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-emerald-500/10 to-green-500/10 border border-emerald-500/30 rounded-lg p-4">
                    <p className="text-slate-400 text-sm mb-1">Workload Efficiency</p>
                    <p className="text-white font-bold text-2xl">{selectedFaculty.utilization}%</p>
                    <p className="text-slate-500 text-xs mt-1">
                      {selectedFaculty.workload} ({selectedFaculty.idleHours} idle hours)
                    </p>
                  </div>
                </div>
              </div>

            </div>
          )}

          {activeTab === 'financial' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-700/50">
                <h4 className="text-white font-semibold mb-4">Salary & Benefits</h4>
                <div className="space-y-4">
                  {[
                    { label: 'Basic Salary', value: 'NA' },
                    { label: 'HRA', value: 'NA' },
                    { label: 'Special Allowance', value: 'NA' },
                    { label: 'Medical Allowance', value: 'NA' },
                    { label: 'Total Gross', value: 'NA' },
                    { label: 'Net Salary', value: 'NA' }
                  ].map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center">
                      <span className="text-slate-400 text-sm">{item.label}</span>
                      <span className="text-white font-medium">{item.value}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-4 border-t border-slate-700/50">
                  <h5 className="text-white font-medium mb-3">Bank Details</h5>
                  <div className="space-y-3">
                    <div>
                      <label className="text-slate-400 text-sm mb-1 block">Account Number</label>
                      <p className="text-white font-mono">{selectedFaculty.accountNumber}</p>
                    </div>
                    <div>
                      <label className="text-slate-400 text-sm mb-1 block">Bank Name</label>
                      <p className="text-white">{selectedFaculty.bankName}</p>
                    </div>
                    <div>
                      <label className="text-slate-400 text-sm mb-1 block">IFSC Code</label>
                      <p className="text-white font-mono">{selectedFaculty.ifscCode}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-700/50">
                <h4 className="text-white font-semibold mb-4">Leaves & Benefits</h4>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="text-slate-400 text-sm mb-1">Medical Leaves</p>
                    <p className="text-white font-bold text-2xl">NA</p>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="text-slate-400 text-sm mb-1">Casual Leaves</p>
                    <p className="text-white font-bold text-2xl">NA</p>
                  </div>
                </div>
              </div>
            </div>
          )}


          {activeTab === 'permissions' && (
            <div className="space-y-6">

              <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-700/50">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-white font-semibold">Status Management</h4>
                  {isEditing && editedFaculty.status !== selectedFaculty.status && (
                    <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full animate-pulse">
                      Status changed - Click Save to apply
                    </span>
                  )}
                </div>


              <div className="flex flex-wrap gap-3">
                {[
                  { status: 'ACTIVE', label: 'Active', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
                  { status: 'ON_LEAVE', label: 'On Leave', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
                  { status: 'SUSPENDED', label: 'Suspended', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
                  { status: 'INACTIVE', label: 'Inactive', color: 'bg-slate-500/20 text-slate-400 border-slate-500/30' },
                  { status: 'RESIGNED', label: 'Resigned', color: 'bg-rose-500/20 text-rose-300 border-rose-500/30' },
                  { status: 'WARNING', label: 'Warning', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' }
                ].map((statusOption) => {
                  const isSelected = editedFaculty.status === statusOption.status;
                  const isDifferentFromOriginal = editedFaculty.status !== selectedFaculty.status;
                  const hasUnsavedChanges = isEditing && isSelected && isDifferentFromOriginal;
                  
                  return (
                    <button
                      key={statusOption.status}
                      onClick={() => handleStatusChange(statusOption.status)}
                      disabled={!isEditing}
                      className={`px-4 py-2 rounded-lg border transition-all relative ${
                        isSelected
                          ? statusOption.color + ' ring-2 ring-offset-2 ring-offset-slate-800'
                          : 'bg-slate-700/50 text-slate-400 border-slate-600/50'
                      } ${!isEditing ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'}`}
                      title={hasUnsavedChanges ? "Status changed - click Save to apply" : ""}
                    >
                      {statusOption.label}
                      {hasUnsavedChanges && (
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></span>
                      )}
                    </button>
                  );
                })}
              </div>

                <p className="text-slate-400 text-sm mt-4">
                    {selectedFaculty.status === 'ACTIVE' && 'Faculty is active and can perform all assigned duties.'}
                    {selectedFaculty.status === 'ON_LEAVE' && 'Faculty is currently on approved leave.'}
                    {selectedFaculty.status === 'SUSPENDED' && 'Faculty access is suspended pending investigation.'}
                    {selectedFaculty.status === 'INACTIVE' && 'Faculty is currently inactive and does not have system access.'}
                    {selectedFaculty.status === 'RESIGNED' && 'Faculty has officially resigned from their position.'}
                    {selectedFaculty.status === 'WARNING' && 'Faculty has performance issues that need attention.'}
                </p>
              </div>
            </div>
          )}

        </div>

      </div>

      <div className="bg-slate-800/30 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6">
        <h4 className="text-white font-semibold mb-4">Related Faculty ({selectedFaculty.department})</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {relatedFaculty.map(faculty => (
            <div 
              key={faculty.id} 
              className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/50 hover:border-purple-500/30 transition-all cursor-pointer"
              onClick={() => navigate(`/admin/faculty/${faculty.publicId}`)}  
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-white font-semibold">
                  {faculty.fullName.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="text-white font-medium">{faculty.fullName}</p>
                  <p className="text-slate-400 text-sm">{faculty.designation}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-2 py-0.5 text-xs rounded ${getStatusColor(faculty.status)}`}>
                      {faculty.status}
                    </span>
                    <span className="text-slate-500 text-xs">• {faculty.utilization}% util</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}