import React, { useState, useEffect } from 'react';
import { Users,Briefcase, BookOpen, TrendingUp, Edit, Eye, Mail, Calendar, FileText, Shield, Activity, Save, Trash2, Upload, CreditCard, CheckCircle, Star, Target, CalendarDays, Clock3, ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';
const facultyManagementApi = {
  // Get faculty by ID - Updated to match your working pattern
    getFacultyById: async (facultyId, institutionId) => {
      const token = localStorage.getItem('token');
      
      // Convert to number if it's numeric
      const id = isNaN(facultyId) ? facultyId : Number(facultyId);
      
      const response = await fetch(
        `http://localhost:8080/api/admin/faculty/${id}?institutionId=${institutionId}`,
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
      `http://localhost:8080/api/admin/faculty/search?institutionId=${institutionId}&query=${encodeURIComponent(query)}`,
      {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
        }
      }
    );
    if (!response.ok) throw new Error('Failed to search faculty');
    return response.json();
  },

  // Update performance - Use query parameters like faculty.js filter
  updatePerformance: async (facultyId, institutionId, performanceData) => {
    const token = localStorage.getItem('token');
    let url = `http://localhost:8080/api/admin/faculty-management/${facultyId}/performance?institutionId=${institutionId}`;
    
    // Add all parameters
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

  // Update workload - Match pattern
  updateWorkload: async (facultyId, institutionId, workloadData) => {
    const token = localStorage.getItem('token');
    let url = `http://localhost:8080/api/admin/faculty-management/${facultyId}/workload?institutionId=${institutionId}`;
    
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

  // Update leaves - Match pattern
  updateLeaves: async (facultyId, institutionId, leavesData) => {
    const token = localStorage.getItem('token');
    let url = `http://localhost:8080/api/admin/faculty-management/${facultyId}/leaves?institutionId=${institutionId}`;
    
    const params = new URLSearchParams();
    if (leavesData.leavesTaken !== undefined) 
      params.append('leavesTaken', leavesData.leavesTaken);
    if (leavesData.leavesAvailable !== undefined) 
      params.append('leavesAvailable', leavesData.leavesAvailable);
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

  // Get documents
  getDocuments: async (facultyId) => {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `http://localhost:8080/api/admin/faculty-management/${facultyId}/documents`,
      {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
        }
      }
    );
    if (!response.ok) throw new Error('Failed to fetch documents');
    return response.json();
  },

  // Update permissions
  updatePermissions: async (facultyId, institutionId, permissions) => {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `http://localhost:8080/api/admin/faculty/${facultyId}/permissions?institutionId=${institutionId}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          attendanceAccess: permissions.attendanceAccess,
          studentManagement: permissions.studentManagement,
          marksEntry: permissions.marksEntry,
          courseCreation: permissions.courseCreation,
          adminAccess: permissions.adminAccess
        })
      }
    );
    if (!response.ok) throw new Error('Failed to update permissions');
    return response.json();
  },

  // Get permissions
  getPermissions: async (facultyId, institutionId) => {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `http://localhost:8080/api/admin/faculty/${facultyId}/permissions?institutionId=${institutionId}`,
      {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
        }
      }
    );
    if (!response.ok) throw new Error('Failed to fetch permissions');
    return response.json();
  },

  // Get related faculty - Use filter endpoint like faculty.js
  getRelatedFaculty: async (institutionId, department) => {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `http://localhost:8080/api/admin/faculty/filter?institutionId=${institutionId}&department=${department}`,
      {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
        }
      }
    );
    if (!response.ok) throw new Error('Failed to fetch related faculty');
    return response.json();
  },


    // Update faculty status
  updateFacultyStatus: async (facultyId, institutionId, newStatus) => {
    const token = localStorage.getItem('token');
    const url = `http://localhost:8080/api/admin/faculty/${facultyId}/status?status=${newStatus}&institutionId=${institutionId}`;
    console.log('🔗 Status update URL:', url);
    
    const response = await fetch(url, {
      method: 'PATCH', // Note: It's PATCH, not PUT
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        // No Content-Type needed since we're using query params
      }
    });
    
    // Debug logging
    const responseText = await response.text();
    console.log('📝 Status update response:', {
      status: response.status,
      statusText: response.statusText,
      body: responseText
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update faculty status: ${response.status} - ${responseText}`);
    }
    
    return response.ok; // Returns true if successful
  },



  // Update faculty basic info - Use your update endpoint
  updateFacultyBasicInfo: async (facultyId, institutionId, facultyData) => {
    const token = localStorage.getItem('token');
    
    // Debug logging
    console.log('📝 Faculty data received in API function:', facultyData);
    console.log('📝 maritalStatus value:', facultyData.maritalStatus);
    console.log('📝 nationality value:', facultyData.nationality);
    
    const requestBody = {
      // Map to your FacultyUpdateRequest DTO
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
    
    console.log('📝 Request body being sent:', requestBody);
    
    const response = await fetch(
      `http://localhost:8080/api/admin/faculty/${facultyId}?institutionId=${institutionId}`,
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
    console.log('📝 Response status:', response.status);
    console.log('📝 Response text:', responseText);
    
    if (!response.ok) {
      throw new Error(`Failed to update faculty info: ${response.status} - ${responseText}`);
    }
    
    // Parse the JSON from the text we already read
    return responseText ? JSON.parse(responseText) : {};
  },


   
  deleteFaculty: async (facultyId, institutionId) => {
    const token = localStorage.getItem('token');
    
    const response = await fetch(
      `http://localhost:8080/api/admin/faculty/${facultyId}?institutionId=${institutionId}`,
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
    console.log('🗑️ Delete response:', {
      status: response.status,
      statusText: response.statusText,
      body: responseText
    });
    
    if (!response.ok) {
      throw new Error(`Failed to delete faculty: ${response.status} - ${responseText}`);
    }
    
    return response.ok;
  },


  // Delete document
  deleteDocument: async (documentId) => {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `http://localhost:8080/api/admin/faculty-management/documents/${documentId}`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
        }
      }
    );
    if (!response.ok) throw new Error('Failed to delete document');
    return response.ok;
  }
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
  const [documents, setDocuments] = useState([]);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
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
        
        // const institutionId = admin.institutionId || 1;
        const institutionId = admin?.institutionId;

        console.log('🔍 Fetching faculty with:', {
          facultyId,
          type: typeof facultyId,
          isNumeric: !isNaN(facultyId),
          institutionId
        });
        
        const facultyResponse = await facultyManagementApi.getFacultyById(facultyId, institutionId);
        console.log('✅ Faculty response:', facultyResponse);
        
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
          leavesTaken: facultyResponse.leavesTaken || 0,
          leavesAvailable: facultyResponse.leavesAvailable || 0,
          researchPapers: facultyResponse.researchPapers || 0,
          conferences: facultyResponse.conferences || 0,
          projects: facultyResponse.projects || 0,
          publications: facultyResponse.publications || 0,
          rating: facultyResponse.rating || 0,
          lastActive: facultyResponse.lastActive || 'N/A',
          permissions: {
            attendanceAccess: false,
            studentManagement: false,
            marksEntry: false,
            courseCreation: false,
            adminAccess: false
          }
        };
        
        setSelectedFaculty(mappedFaculty);
        setEditedFaculty({ ...mappedFaculty });
        
        try {
          const permissionsResponse = await facultyManagementApi.getPermissions(facultyId, institutionId);
          
          if (permissionsResponse && typeof permissionsResponse === 'object') {
            const updatedPermissions = {
              attendanceAccess: permissionsResponse.attendanceAccess || false,
              studentManagement: permissionsResponse.studentManagement || false,
              marksEntry: permissionsResponse.marksEntry || false,
              courseCreation: permissionsResponse.courseCreation || false,
              adminAccess: permissionsResponse.adminAccess || false
            };
            
            setSelectedFaculty(prev => ({
              ...prev,
              permissions: updatedPermissions
            }));
            setEditedFaculty(prev => ({
              ...prev,
              permissions: updatedPermissions
            }));
          }
        } catch (permissionsError) {
          console.warn('Could not fetch permissions:', permissionsError);
        }
        
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

  useEffect(() => {
    if (!selectedFaculty) return;
    
    const fetchDocuments = async () => {
      try {
        const docs = await facultyManagementApi.getDocuments(selectedFaculty.publicId || selectedFaculty.id);
        setDocuments(docs);
      } catch (error) {
        console.error('Error fetching documents:', error);
        setDocuments([]);
      }
    };
    
    fetchDocuments();
  }, [selectedFaculty]);

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

    // 1. First update status if it changed
    if (editedFaculty.status !== selectedFaculty.status) {
      console.log(`🔄 Updating status to: ${editedFaculty.status}`);
      await facultyManagementApi.updateFacultyStatus(publicId, institutionId, editedFaculty.status);
    }

    // 2. Then update other faculty details (without status)
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

    console.log('📤 Sending update data:', updateData);
    
    await facultyManagementApi.updateFacultyBasicInfo(publicId, institutionId, updateData);
    
    // 3. Update permissions if changed
    if (JSON.stringify(editedFaculty.permissions) !== JSON.stringify(selectedFaculty.permissions)) {
      await facultyManagementApi.updatePermissions(publicId, institutionId, editedFaculty.permissions);
    }
    
    // 4. Update local state
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


  const handlePermissionToggle = async (permission) => {
    if (isEditing && editedFaculty) {
      const newPermissions = {
        ...editedFaculty.permissions,
        [permission]: !editedFaculty.permissions[permission]
      };
      
      setEditedFaculty(prev => ({
        ...prev,
        permissions: newPermissions
      }));
      
      try {
        // const institutionId = admin.institutionId || 1;
        const institutionId = admin?.institutionId;
        await facultyManagementApi.updatePermissions(
          selectedFaculty.publicId || selectedFaculty.id,
          institutionId,
          newPermissions
        );
      } catch (error) {
        console.error('Error updating permissions:', error);
        setEditedFaculty(prev => ({
          ...prev,
          permissions: editedFaculty.permissions
        }));
      }
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
      
      console.log('🗑️ Attempting to delete faculty:', { facultyId, institutionId });
      
      await facultyManagementApi.deleteFaculty(facultyId, institutionId);
      
      alert(`Faculty "${selectedFaculty.fullName}" deleted successfully!`);
      
      setTimeout(() => {
        navigate('/admin/faculty');
      }, 1000);
      
    } catch (error) {
      console.error('❌ Error deleting faculty:', error);
      alert(`Failed to delete faculty: ${error.message}`);
    } finally {
      setDeleting(false);
    }
  };


const handleStatusChange = (newStatus) => {
  if (isEditing && editedFaculty) {
    // Only update local state, don't call API
    setEditedFaculty(prev => ({
      ...prev,
      status: newStatus
    }));
    
    console.log(`📝 Status changed locally to: ${newStatus} (will be saved when clicking Save)`);
  }
};


  const handleDeleteDocument = async (docId, docName) => {
    if (!window.confirm(`Delete "${docName}"?`)) return;
    
    try {
      await facultyManagementApi.deleteDocument(docId);
      setDocuments(prev => prev.filter(d => d.id !== docId));
      alert('Document deleted!');
    } catch (error) {
      alert('Delete failed: ' + error.message);
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
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-white">Faculty Management</h1>
          <p className="text-slate-400 text-sm">Manage faculty details and permissions</p>
        </div>
      </div>

      <div className="bg-slate-800/30 backdrop-blur-xl rounded-2xl border border-slate-700/50 overflow-hidden">
        <div className="p-6 border-b border-slate-700/50 bg-slate-800/50 flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
                {selectedFaculty.fullName.split(' ').map(n => n[0]).join('')}
              </div>
              {!isEditing && (
                <div className={`absolute -bottom-2 -right-2 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(selectedFaculty.status)}`}>
                  {selectedFaculty.status}
                </div>
              )}
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">{selectedFaculty.fullName}</h3>
              <p className="text-slate-400">
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
              { id: 'permissions', label: 'Permissions', icon: Shield },
              { id: 'attendance', label: 'Attendance', icon: CalendarDays },
              { id: 'documents', label: 'Documents', icon: FileText }
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
                    <p className="text-slate-500 text-xs mt-1">{selectedFaculty.leavesTaken} leaves taken</p>
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
                      {selectedFaculty.leavesTaken} leaves taken, {selectedFaculty.leavesAvailable} available
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

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-700/50">
                  <h4 className="text-white font-semibold mb-4">Monthly Performance</h4>
                  <div className="space-y-3">
                    {[
                      { month: 'Jan', attendance: 95, utilization: 88 },
                      { month: 'Feb', attendance: 92, utilization: 85 },
                      { month: 'Mar', attendance: 94, utilization: 90 },
                      { month: 'Apr', attendance: 91, utilization: 82 },
                      { month: 'May', attendance: 96, utilization: 89 }
                    ].map((monthData, idx) => (
                      <div key={idx} className="flex items-center gap-4">
                        <span className="text-slate-400 text-sm w-12">{monthData.month}</span>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-slate-700 rounded-full h-2">
                              <div className="h-2 bg-blue-500 rounded-full" style={{ width: `${monthData.attendance}%` }}></div>
                            </div>
                            <span className="text-white text-xs w-10">{monthData.attendance}%</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-slate-700 rounded-full h-2">
                              <div className="h-2 bg-purple-500 rounded-full" style={{ width: `${monthData.utilization}%` }}></div>
                            </div>
                            <span className="text-white text-xs w-10">{monthData.utilization}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-700/50">
                  <h4 className="text-white font-semibold mb-4">Peer Comparison</h4>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-slate-400 text-sm">Department Rank</span>
                        <span className="text-white font-medium">#3 of 28</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div className="h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" style={{ width: '85%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-slate-400 text-sm">College Rank</span>
                        <span className="text-white font-medium">#12 of 142</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div className="h-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full" style={{ width: '75%' }}></div>
                      </div>
                    </div>
                    <div className="pt-4 border-t border-slate-700/50">
                      <h5 className="text-white font-medium mb-3">Strengths</h5>
                      <div className="flex flex-wrap gap-2">
                        {['Research', 'Student Feedback', 'Punctuality', 'Communication'].map((strength, idx) => (
                          <span key={idx} className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded-full">
                            {strength}
                          </span>
                        ))}
                      </div>
                    </div>
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
                    { label: 'Basic Salary', value: '₹85,000' },
                    { label: 'HRA', value: '₹25,500' },
                    { label: 'Special Allowance', value: '₹15,000' },
                    { label: 'Medical Allowance', value: '₹5,000' },
                    { label: 'Total Gross', value: '₹1,30,500' },
                    { label: 'Net Salary', value: '₹1,18,250' }
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
                    <p className="text-slate-400 text-sm mb-1">Leaves Taken</p>
                    <p className="text-white font-bold text-2xl">{selectedFaculty.leavesTaken}</p>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="text-slate-400 text-sm mb-1">Leaves Available</p>
                    <p className="text-white font-bold text-2xl">{selectedFaculty.leavesAvailable}</p>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="text-slate-400 text-sm mb-1">Medical Leaves</p>
                    <p className="text-white font-bold text-2xl">3</p>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="text-slate-400 text-sm mb-1">Casual Leaves</p>
                    <p className="text-white font-bold text-2xl">5</p>
                  </div>
                </div>
                
                <div>
                  <h5 className="text-white font-medium mb-3">Benefits</h5>
                  <div className="space-y-2">
                    {[
                      'Health Insurance Coverage',
                      'Provident Fund (12% Contribution)',
                      'Gratuity Eligible',
                      'Professional Development Allowance',
                      'Travel Allowance',
                      'Research Grant'
                    ].map((benefit, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <CheckCircle size={16} className="text-emerald-400" />
                        <span className="text-slate-300 text-sm">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}


          {activeTab === 'permissions' && (
            <div className="space-y-6">
              <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-700/50">
                <h4 className="text-white font-semibold mb-4">System Permissions</h4>
                <div className="space-y-4">
                  {Object.entries(selectedFaculty.permissions || {}).map(([permission, enabled]) => (
                    <div key={permission} className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-medium capitalize">{permission.replace(/([A-Z])/g, ' $1')}</p>
                        <p className="text-slate-400 text-xs">
                          {permission === 'attendanceAccess' && 'Mark student attendance and view reports'}
                          {permission === 'studentManagement' && 'Add/edit student information'}
                          {permission === 'marksEntry' && 'Enter and modify student marks'}
                          {permission === 'courseCreation' && 'Create and manage courses'}
                          {permission === 'adminAccess' && 'Full administrative privileges'}
                        </p>
                      </div>
                      {isEditing ? (
                        <button
                          onClick={() => handlePermissionToggle(permission)}
                          className={`w-12 h-6 rounded-full transition-colors ${
                            editedFaculty.permissions[permission]
                              ? 'bg-emerald-500'
                              : 'bg-slate-600'
                          }`}
                        >
                          <div
                            className={`w-4 h-4 rounded-full bg-white transform transition-transform ${
                              editedFaculty.permissions[permission]
                                ? 'translate-x-7'
                                : 'translate-x-1'
                            }`}
                          ></div>
                        </button>
                      ) : (
                        <span className={`px-3 py-1 rounded-full text-xs ${
                          enabled
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-slate-700/50 text-slate-400'
                        }`}>
                          {enabled ? 'Enabled' : 'Disabled'}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

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



{/* need to fix this */}

          {activeTab === 'attendance' && (
            <div className="space-y-6">
              <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-700/50">
                <h4 className="text-white font-semibold mb-4">Attendance Overview</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="text-slate-400 text-sm mb-1">Total Days</p>
                    <p className="text-white font-bold text-2xl">142</p>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="text-slate-400 text-sm mb-1">Present</p>
                    <p className="text-white font-bold text-2xl">134</p>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="text-slate-400 text-sm mb-1">Absent</p>
                    <p className="text-white font-bold text-2xl">8</p>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="text-slate-400 text-sm mb-1">Attendance %</p>
                    <p className="text-white font-bold text-2xl">{selectedFaculty.attendance}%</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-700/50">
                <h4 className="text-white font-semibold mb-4">Monthly Calendar</h4>
                <div className="grid grid-cols-7 gap-2">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                    <div key={day} className="text-center py-2">
                      <span className="text-slate-400 text-sm">{day}</span>
                    </div>
                  ))}
                  {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                    <div key={day} className={`aspect-square rounded-lg flex items-center justify-center ${
                      day <= 20 ? 'bg-emerald-500/20' : 'bg-slate-800/50'
                    }`}>
                      <span className={`text-sm ${
                        day <= 20 ? 'text-emerald-400' : 'text-slate-400'
                      }`}>{day}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-700/50">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-emerald-500/20 rounded"></div>
                    <span className="text-slate-400 text-sm">Present</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-slate-800/50 rounded"></div>
                    <span className="text-slate-400 text-sm">Future</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="space-y-6">
              <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-700/50">
                <h4 className="text-white font-semibold mb-4">Upload Documents</h4>
                <div className="border-2 border-dashed border-slate-700/50 rounded-xl p-8 text-center">
                  <Upload className="mx-auto text-slate-400" size={48} />
                  <p className="text-slate-400 mt-2">
                    Document upload requires backend integration
                  </p>
                  <p className="text-slate-500 text-sm mt-2">
                    Contact admin to implement file upload
                  </p>
                </div>
              </div>

              <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-700/50">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-white font-semibold">Uploaded Documents</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 text-sm">
                      {documents.length} document{documents.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
                
                {documents.length > 0 ? (
                  <div className="space-y-3">
                    {documents.map((doc) => (
                      <div key={doc.id || doc.docId} className="flex items-center justify-between p-4 bg-slate-800/30 rounded-xl hover:bg-slate-800/50 transition-colors">
                        <div className="flex items-center gap-4 flex-1">
                          <div className={`p-3 rounded-lg ${
                            doc.documentType === 'pdf' ? 'bg-red-500/10' :
                            doc.documentType?.includes('image') ? 'bg-blue-500/10' :
                            'bg-purple-500/10'
                          }`}>
                            <FileText className={
                              doc.documentType === 'pdf' ? "text-red-400" :
                              doc.documentType?.includes('image') ? "text-blue-400" :
                              "text-purple-400"
                            } size={20} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="text-white font-medium truncate max-w-xs">
                                {doc.documentName || doc.name}
                              </p>
                              <span className="px-2 py-0.5 bg-slate-700/50 text-slate-400 text-xs rounded">
                                {doc.category || 'Document'}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 mt-1">
                              <p className="text-slate-400 text-xs">
                                {doc.fileSize ? `${(doc.fileSize / (1024 * 1024)).toFixed(2)} MB` : 'N/A'}
                              </p>
                              <span className="text-slate-600">•</span>
                              <p className="text-slate-400 text-xs">Type: {doc.documentType || 'Unknown'}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {doc.filePath && (
                            <a 
                              href={`http://localhost:8080${doc.filePath}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 hover:bg-blue-500/20 rounded-lg transition-colors"
                              title="View"
                            >
                              <Eye size={18} className="text-slate-400 hover:text-blue-400" />
                            </a>
                          )}
                          <button 
                            className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                            title="Delete"
                            onClick={() => handleDeleteDocument(doc.id || doc.docId, doc.documentName || doc.name)}
                          >
                            <Trash2 size={18} className="text-slate-400 hover:text-red-400" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="mx-auto text-slate-500" size={48} />
                    <p className="text-slate-400 mt-2">No documents uploaded yet</p>
                    <p className="text-slate-500 text-sm mt-1">
                      Documents will appear here when uploaded via backend
                    </p>
                  </div>
                )}
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