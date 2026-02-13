import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { QrCode, Users, Projector, Smartphone, Flag, ThumbsDown, Clock3, CheckCircle, XCircle, Shield} from 'lucide-react';
import API_BASE from "../../config/api";
import { authFetch } from "../../utils/authFetch";

const FacultyAttendance = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // State Management
  const [attendanceSession, setAttendanceSession] = useState(null);
  const [qrCode, setQrCode] = useState(null);
  const [countdown, setCountdown] = useState(120); 
  const [qrRefreshTimer, setQrRefreshTimer] = useState(30);
  const [attendanceList, setAttendanceList] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [sessionSummary, setSessionSummary] = useState(null);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [todayClasses, setTodayClasses] = useState([]);
  const [classesLoading, setClassesLoading] = useState(true);





  
  // Refs for RQ Session Timer
  const countdownRef = useRef(null);
  const qrRefreshRef = useRef(null);

  // Check if session expired
  const isSessionExpired = attendanceSession?.status !== "ACTIVE" || countdown <= 0;



      // Get faculty data
      const faculty = {
        id: sessionStorage.getItem("facultyId"),
        facultyId: sessionStorage.getItem("facultyId"),
        fullName: sessionStorage.getItem("facultyName"),
      };

useEffect(() => {
        fetchTodayClasses();
      }, []);

    const fetchTodayClasses = async () => {
      try {
        setClassesLoading(true);

        const res = await authFetch(`${API_BASE}/api/admin/timetable/entries/ui`);


        if (!res.ok) throw new Error("Failed to fetch timetable");

        const raw = await res.json();

        const today = new Date()
          .toLocaleString("en-US", { weekday: "long" })
          .toUpperCase();

        const normalized = raw
          .filter(e =>
            e.day?.toUpperCase() === today &&
            String(e.facultyId) === String(faculty.facultyId)
          )
          .map(e => ({
          id: e.timetableId,
          courseCode: e.subjectCode,
          courseName: e.subjectName,
          time: e.time,
          room: e.roomCode,
          totalStudents: e.totalStudents,
          attendanceStatus: e.attendanceStatus || null
        }));


        setTodayClasses(normalized);
      } catch (err) {
        console.error("Error loading today's classes", err);
      } finally {
        setClassesLoading(false);
      }
    };


    

  // Check for class data passed from dashboard
  useEffect(() => {
    if (location.state?.class) {
      setSelectedClass(location.state.class);
      setShowSessionModal(true);
      startAttendance(location.state.class);
    }




    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
      if (qrRefreshRef.current) clearInterval(qrRefreshRef.current);
    };
  }, [location]);

  // Format time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

// Start attendance session
const startAttendance = async (classData) => {
  setLoading(true);

  // RESET STATE FIRST (VERY IMPORTANT)
  setCountdown(120);
  setQrRefreshTimer(30);
  setAttendanceList([]);
  setQrCode(null);

  // Clear any old timers
  if (countdownRef.current) clearInterval(countdownRef.current);
  if (qrRefreshRef.current) clearInterval(qrRefreshRef.current);

  try {
    setSelectedClass(classData);
    setShowSessionModal(true);

    // Call backend API
    const res = await authFetch(
      `${API_BASE}/api/attendance/session/start`,
      {
        method: "POST",
        body: JSON.stringify({
          facultyId: faculty.facultyId,
          classId: classData.id
        })
      }
    );


    if (!res.ok) throw new Error("Failed to start attendance session");

    const data = await res.json();
    const sessionId = data.sessionId;

    const newSession = {
      id: sessionId,
      classId: classData.id,
      className: classData.courseName,
      startTime: new Date().toISOString(),
      expiryTime: new Date(Date.now() + 2 * 60 * 1000).toISOString(),
      status: "ACTIVE",
      totalStudents: classData.totalStudents,
      submittedCount: 0
    };

    setAttendanceSession(newSession);

    // 🔥 Generate first QR immediately
    generateQRCode(sessionId);

    // Start countdown timer
    countdownRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownRef.current);
          handleAutoExpire();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Start QR refresh timer
    qrRefreshRef.current = setInterval(() => {
      setQrRefreshTimer(prev => {

        if (prev <= 1) {
          generateQRCode(sessionId);
          return 30;
        }

        return prev - 1;
      });
    }, 1000);

  } catch (err) {
    console.error(err);
    alert("Unable to start attendance. Please try again.");
  } finally {
    setLoading(false);
  }
};



const generateQRCode = async (sessionId) => {
  if (!sessionId) return;

  try {
    const res = await authFetch(`${API_BASE}/api/attendance/session/${sessionId}/qr-token`);


    if (!res.ok) throw new Error("Failed to fetch QR token");

    const token = await res.text();

    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
      "attn:" + token
    )}`;

    setQrCode(qrUrl);

  } catch (err) {
    console.error("QR generation failed", err);
  }
};




  // real-time listener
  useEffect(() => {
  if (!attendanceSession?.id) return;

  const eventSource = new EventSource(
    `${API_BASE}/api/attendance/session/${attendanceSession.id}/stream`
  );


  eventSource.onmessage = (event) => {
    const data = JSON.parse(event.data);

    const normalized = {
      submissionId: data.submissionId ?? data.id,
      studentId: data.studentId,
      studentName: data.studentName,
      status: data.status,
      time: data.submittedAt
        ? new Date(data.submittedAt).toLocaleTimeString()
        : data.time || ""
    };

    setAttendanceList(prev => {
      const idx = prev.findIndex(
        s => String(s.submissionId) === String(normalized.submissionId)
      );

      if (idx !== -1) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], ...normalized };
        return copy;
      }

      return [...prev, normalized];
    });
  };




  return () => eventSource.close();
}, [attendanceSession?.id]);



  const handleAutoExpire = async () => {
    if (!attendanceSession?.id) return;

    try {
      await authFetch(`${API_BASE}/api/attendance/session/${attendanceSession.id}/complete`,
      {
        method: "POST",
      }
    );

      endAttendanceSession(); 

    } catch (err) {
      console.error("Auto-expire failed", err);
      alert("Failed to complete session automatically.");
    }
  };





  // End attendance session
  const endAttendanceSession = () => {
    if (!attendanceSession) return;

    if (attendanceSession.status === "FINALIZED") {
      setShowSessionModal(false);
      setShowSummaryModal(true);

      return;
    }


    // Clear timers
    if (countdownRef.current) clearInterval(countdownRef.current);
    if (qrRefreshRef.current) clearInterval(qrRefreshRef.current);

    setQrRefreshTimer(0);

    const totalStudents = attendanceSession.totalStudents || 0;
    const submitted = attendanceList.length || 0;

    const summary = {
      totalStudents,
      submittedCount: submitted,
      absentCount: totalStudents - submitted,
      attendanceRate:
        totalStudents > 0
          ? Math.round((submitted / totalStudents) * 100)
          : 0
    };


    setSessionSummary(summary);
    setAttendanceSession(prev => prev ? { ...prev, status: "FINALIZED" } : null);
    setShowSessionModal(false);
    setShowSummaryModal(true);

  };



  // Cancel attendance session
const cancelAttendance = () => {
  if (countdownRef.current) clearInterval(countdownRef.current);
  if (qrRefreshRef.current) clearInterval(qrRefreshRef.current);

  setAttendanceSession(null);
  setAttendanceList([]);
  setShowSessionModal(false);
  alert('Attendance session cancelled.');
};



  // Submit final attendance
const submitAttendance = async () => {
  if (!attendanceSession?.id) return;

  try {
    await authFetch(
      `${API_BASE}/api/attendance/session/${attendanceSession.id}/finalize`,
      {
        method: "POST",
      }
    );

    // Clear timers
    if (countdownRef.current) clearInterval(countdownRef.current);
    if (qrRefreshRef.current) clearInterval(qrRefreshRef.current);

    setShowSummaryModal(false);
    setAttendanceSession(null);
    setSessionSummary(null);


    navigate('/faculty/attendance');
    window.location.reload();

  } catch (err) {
    console.error("Finalization failed", err);
    alert("Unable to finalize attendance.");
  }
};




const reviewSubmission = async (submissionId, action) => {

  const statusMap = {
    approve: "APPROVED",
    reject: "REJECTED",
    flag: "FLAGGED"
  };

  try {
    const res = await authFetch(
      `${API_BASE}/api/attendance/review/${submissionId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: statusMap[action]
        }),
      }
    );

    if (!res.ok) throw new Error("Review failed");

  } catch (err) {
    console.error("Review failed", err);
    alert("Unable to update attendance status");
  }
};



// background fix for review section
useEffect(() => {
  if (showSummaryModal) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "auto";
  }

  return () => {
    document.body.style.overflow = "auto";
  };
}, [showSummaryModal]);


// backgound fix for Attendance QR code

useEffect(() => {
  if (showSessionModal || showSummaryModal) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "auto";
  }

  return () => {
    document.body.style.overflow = "auto";
  };
}, [showSessionModal, showSummaryModal]);




  return (
    <div className="space-y-8">


      {/* Starting page */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">Today Attendance Session</h3>
            <p className="text-slate-400">Select a class to begin attendance. The QR code will be displayed for 2 minutes.</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Shield size={16} />
            <span>Secure QR • Auto-refresh • Live verification</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classesLoading ? (
            <div className="col-span-full text-center text-slate-400">
              Loading today’s classes...
            </div>
          ) : todayClasses.length === 0 ? (
            <div className="col-span-full text-center text-slate-400">
              No classes scheduled for today.
            </div>
          ) : (
            todayClasses.map((classItem) => (
              <div 
                key={classItem.id} 
                className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 hover:border-blue-500/30 transition-all duration-300 hover:scale-[1.02] group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl font-bold text-white">
                        {classItem.courseCode}
                      </span>

                      {classItem.attendanceStatus !== "FINALIZED" && (
                        <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">
                          Upcoming
                        </span>
                      )}


                    </div>
                    <h4 className="text-lg font-semibold text-white mb-1">
                      {classItem.courseName}
                    </h4>
                    <p className="text-slate-400 text-sm">
                      {classItem.time} • {classItem.room}
                    </p>
                  </div>
                  <Users
                    className="text-slate-600 group-hover:text-blue-400 transition-colors"
                    size={24}
                  />
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-400">Total Students</span>
                    <span className="text-white font-medium">
                      {classItem.totalStudents}
                    </span>
                  </div>

                </div>

                <button
                  onClick={() =>
                    classItem.attendanceStatus !== "FINALIZED" &&
                    startAttendance(classItem)
                  }
                  disabled={classItem.attendanceStatus === "FINALIZED"}
                  className={`w-full py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2
                    ${
                      classItem.attendanceStatus === "FINALIZED"
                        ? "bg-slate-600 text-slate-300 cursor-not-allowed"
                        : "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg hover:shadow-blue-500/20"
                    }
                  `}
                >
                  <span>
                    {classItem.attendanceStatus === "FINALIZED"
                      ? "Attendance Submitted"
                      : "Start Attendance Session"}
                  </span>
                </button>

              </div>
            ))
          )}
        </div>

      </div>




      {/* ====================
          MODALS
      ==================== */}

      {/* Attendance Session Modal */}
      {showSessionModal && selectedClass && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-lg z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-2xl border border-slate-700/50 w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">

            {/* Modal Header */}
            <div className="p-6 border-b border-slate-700/50 bg-slate-800/50 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <QrCode className="text-white" size={24} />
                  </div>
                  <div>
                    <div>Attendance Session: {selectedClass.courseName}</div>
                    <p className="text-slate-400 text-sm mt-1">
                      Session ID: {attendanceSession?.id} • {isSessionExpired ? "Session Ended" : `${formatTime(countdown)} remaining`}
                    </p>
                  </div>
                </h3>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={cancelAttendance}
                  className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg font-medium transition-colors"
                >
                  Cancel Session
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-auto p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* QR Code Panel */}
                <div className="lg:col-span-1">
                  <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-700/50">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-white font-semibold">QR Code Display</h4>
                      <div className="flex items-center gap-2">
                        <Clock3 className="text-amber-400" size={16} />
                        <span className={`text-sm font-mono ${isSessionExpired ? "text-slate-500" : "text-amber-400"}`}>
                          {isSessionExpired ? "00:00" : formatTime(qrRefreshTimer)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="relative aspect-square bg-white rounded-xl p-4 flex items-center justify-center mb-4">
                      {qrCode ? (
                        <>
                          <img
                            src={qrCode}
                            alt="Attendance QR Code"
                            className={`w-64 h-64 transition-all duration-300 ${isSessionExpired ? "blur-md opacity-40" : ""}`}
                          />
                          {isSessionExpired && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-xl">
                              <div className="text-center p-4">
                                <XCircle className="text-red-400 mx-auto mb-2" size={32} />
                                <p className="text-white font-semibold text-lg">Session Ended</p>
                                <p className="text-slate-300 text-sm mt-1">QR code is no longer valid</p>
                              </div>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
                          <p className="text-slate-500">Generating QR code...</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-slate-400">
                        <Projector size={16} />
                        <span className="text-sm">Display this QR code on projector</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-400">
                        <Smartphone size={16} />
                        <span className="text-sm">Students scan with their phones</span>
                      </div>
                    </div>
                  </div>
                </div>



                {/* Real-time Submissions Panel show */}
                <div className="lg:col-span-2">
                  <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-700/50 h-full">
                    <div className="flex items-center justify-between mb-6">
                      <h4 className="text-white font-semibold">Real-time Submissions</h4>
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-white">{attendanceList.length}</div>
                          <div className="text-xs text-slate-400">Submitted</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-white">
                            {selectedClass.totalStudents - attendanceList.length}
                          </div>
                          <div className="text-xs text-slate-400">Pending</div>
                        </div>
                      </div>
                    </div>

                    <div className="h-[400px] overflow-y-auto space-y-3">
                      {attendanceList.length > 0 ? (
                        attendanceList.map((student) => (
                          <div key={student.submissionId} className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 hover:border-blue-500/30 transition-colors">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-white font-bold">
                                  {student.studentName.split(' ').map(n => n[0]).join('')}
                                </div>

                                  <div>
                                    <p className="text-white font-medium">{student.studentName}</p>
                                  </div>
                              </div>
                              
                              <div className="flex items-center gap-3">
                                
                                <span className="text-slate-400 text-sm font-medium">
                                  Current Status:
                                </span>

                                {/* Status Badge */}
                                <span
                                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                    student.status === "PENDING"
                                      ? "bg-blue-500/20 text-blue-400"
                                      : student.status === "FLAGGED"
                                      ? "bg-amber-500/20 text-amber-400"
                                      : student.status === "REJECTED"
                                      ? "bg-red-500/20 text-red-400"
                                      : "bg-slate-500/20 text-slate-400"
                                  }`}
                                >
                                  {student.status === "PENDING" ? "SUBMITTED" : student.status}
                                </span>

                                <div className="h-4 w-[1px] bg-slate-700 mx-1" aria-hidden="true" />

                                {/* Show Flag if NOT already flagged */}
                                {student.status !== "FLAGGED" && (
                                  <button
                                    onClick={() => reviewSubmission(student.submissionId, "flag")}
                                    className="px-3 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 rounded-lg text-sm flex items-center gap-1"
                                  >
                                    <Flag size={14} />
                                    Flag
                                  </button>
                                )}

                                {student.status !== "REJECTED" && (
                                  <button
                                    onClick={() => reviewSubmission(student.submissionId, "reject")}
                                    className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-sm flex items-center gap-1"
                                  >
                                    <ThumbsDown size={14} />
                                    Reject
                                  </button>
                                )}

                              </div>

                            </div>


                          </div>
                        ))
                      ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center py-12">
                          <Users className="text-slate-600 mb-4" size={64} />
                          <p className="text-slate-400 text-lg">Waiting for student submissions...</p>
                          <p className="text-slate-500 text-sm mt-2">Students should scan the QR code with their phones</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>



            {/* Modal Footer */}
            <div className="p-6 border-t border-slate-700/50 bg-slate-800/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{formatTime(countdown)}</div>
                    <div className="text-xs text-slate-400">Time Remaining</div>
                  </div>
                  <div className="h-8 w-px bg-slate-700/50"></div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">
                      {attendanceList.length}/{selectedClass.totalStudents}
                    </div>
                    <div className="text-xs text-slate-400">Students Submitted</div>
                  </div>
                  <div className="h-8 w-px bg-slate-700/50"></div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-amber-400">{attendanceList.filter(s => s.status === "FLAGGED").length}</div>
                    <div className="text-xs text-slate-400">Flagged Entries</div>
                  </div>
                </div>
                
                <button
                  onClick={endAttendanceSession}
                  className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2
                    ${
                      attendanceSession?.status === "COMPLETED"
                        ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:shadow-lg hover:shadow-blue-500/30"
                        : "bg-gradient-to-r from-emerald-500 to-green-500 text-white hover:shadow-lg hover:shadow-emerald-500/20"
                    }
                  `}
                >
                  <CheckCircle size={20} />
                  End Session & Review
                </button>

              </div>
            </div>
          </div>
        </div>
      )}




      {/* Attendance Session Summary */}
      {showSummaryModal && sessionSummary && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-lg z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-2xl border border-slate-700/50 w-full max-w-2xl max-h-[90vh] flex flex-col">

            <div className="p-6 border-b border-slate-700/50">
              <center><h3 className="text-2xl font-bold text-white">Attendance Session Summary</h3></center>
            <center> <p className="text-slate-400">Review and finalize the attendance for {selectedClass?.courseName} Class</p></center> 

            </div>
            
            <div className="p-6 overflow-y-auto flex-1">

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-900/50 rounded-xl p-4">
                  <div className="text-3xl font-bold text-white mb-2">{sessionSummary.submittedCount}</div>
                  <div className="text-slate-400">Students Submitted</div>
                </div>
                <div className="bg-slate-900/50 rounded-xl p-4">
                  <div className="text-3xl font-bold text-white mb-2">{sessionSummary.absentCount}</div>
                  <div className="text-slate-400">Students Absent</div>
                </div>
                <div className="bg-slate-900/50 rounded-xl p-4">
                  <div className="text-3xl font-bold text-emerald-400 mb-2">{sessionSummary.attendanceRate}%</div>
                  <div className="text-slate-400">Attendance Rate</div>
                </div>
                <div className="bg-slate-900/50 rounded-xl p-4">
                  <div className="text-3xl font-bold text-amber-400 mb-2">
                  {attendanceList.filter(s => s.status === "FLAGGED").length}
                  </div>

                  <div className="text-slate-400">Flagged Entries</div>
                </div>
              </div>
              
              {attendanceList.filter(s => s.status === "FLAGGED").length > 0 && (
                <div className="mb-6">
                  <h4 className="text-white font-semibold mb-3">Flagged Students Requiring Review</h4>
                  <div className="space-y-2">
                   
                   
                  {attendanceList
                    .filter(s => s.status === "FLAGGED")
                    .map((student) => (
                      <div
                        key={student.submissionId}
                        className="flex items-center justify-between bg-amber-500/10 border border-amber-500/30 rounded-lg p-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-amber-500/20 rounded-lg flex items-center justify-center">
                            <Flag className="text-amber-400" size={16} />
                          </div>
                          <span className="text-white font-medium">
                            {student.studentName}
                          </span>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              reviewSubmission(student.submissionId, "approve")
                            }
                            className="px-3 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 rounded-lg text-sm transition-colors"
                          >
                            Approve
                          </button>

                          <button
                            onClick={() =>
                              reviewSubmission(student.submissionId, "reject")
                            }
                            className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-sm transition-colors"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                  ))}


                  </div>
                </div>
              )}
              

              <div className="mb-6">
                <h4 className="text-white font-semibold mb-3">
                  Important Notice
                </h4>

                <div className="bg-slate-900/50 rounded-lg p-4 border border-amber-500/30">
                  <p className="text-slate-300 leading-relaxed">
                    All students who have successfully scanned the QR code will initially appear with a 
                    <span className="text-blue-400 font-semibold"> SUBMITTED </span>
                    status.
                    <br /><br />
                    When you click the 
                    <span className="text-emerald-400 font-semibold"> "Submit Attendance" </span>
                    button, the system will automatically convert all 
                    <span className="text-blue-400 font-semibold"> SUBMITTED </span>
                    entries to 
                    <span className="text-emerald-400 font-semibold"> APPROVED </span>.
                    <br /><br />
                    Only students marked as 
                    <span className="text-amber-400 font-semibold"> FLAGGED </span>
                    or 
                    <span className="text-red-400 font-semibold"> REJECTED </span>
                    will remain unchanged.
                  </p>
                </div>
              </div>

            </div>
            
            <div className="p-6 border-t border-slate-700/50 flex justify-between">
              <button
                onClick={() => {
                  setShowSummaryModal(false);
                  setAttendanceSession(null);
                  setAttendanceList([]);
                }}
                className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-medium transition-colors"
              >
                Cancel
              </button>
              <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowSummaryModal(false);
                  setShowSessionModal(true); 
                }}
                className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-medium transition-colors"
              >
                Review Again
              </button>

                <button
                  onClick={submitAttendance}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-blue-500/20 transition-all"
                >
                  Submit Attendance
                </button>
              </div>
            </div>
          </div>
        </div>
      )}



    </div>
  );
};

export default FacultyAttendance;