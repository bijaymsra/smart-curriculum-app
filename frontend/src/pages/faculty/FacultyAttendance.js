import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { QrCode, PlayCircle, Users, HelpCircle, Projector, Smartphone, Flag, ThumbsUp, ThumbsDown, Clock3, CheckCircle, XCircle, Download, ChevronRight, Shield, Timer} from 'lucide-react';
import API_BASE from "../../config/api";

const FacultyAttendance = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // State Management
  const [attendanceSession, setAttendanceSession] = useState(null);
  const [qrCode, setQrCode] = useState(null);
  const [countdown, setCountdown] = useState(120); // 2 minutes
  const [qrRefreshTimer, setQrRefreshTimer] = useState(30);
  const [attendanceList, setAttendanceList] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [sessionSummary, setSessionSummary] = useState(null);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [todayClasses, setTodayClasses] = useState([]);
  const [classesLoading, setClassesLoading] = useState(true);
  const [randomCheckCooldown, setRandomCheckCooldown] = useState(null); // seconds
  const randomTimerRef = useRef(null);



  
  // Refs for timers
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

    const res = await fetch(
      `${API_BASE}/api/admin/timetable/entries/ui`,
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
    );

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
        attendanceRate: 100,
        status: "upcoming",
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

    // if (randomTimerRef.current) clearInterval(randomTimerRef.current);



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
    try {
      setSelectedClass(classData);
      setShowSessionModal(true);


      // Call backend API
      const res = await fetch(`${API_BASE}/api/attendance/session/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          facultyId: faculty.facultyId,
          classId: classData.id
        })
      });

      if (!res.ok) throw new Error("Failed to start attendance session");

      const data = await res.json();
      const sessionId = data.sessionId;

      // Create session state
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
      generateQRCode(sessionId);

      // Start countdown timer
      countdownRef.current = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(countdownRef.current);
            setTimeout(endAttendanceSession, 0);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Start QR refresh timer
      setQrRefreshTimer(30);
      qrRefreshRef.current = setInterval(() => {
        setQrRefreshTimer(prev => {
          if (countdown <= 0) return 0;
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
        const res = await fetch(
          `${API_BASE}/api/attendance/session/${sessionId}/qr-token`,
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
          }
        );

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
  submissionId: data.id ?? data.submissionId, // ✅ KEY FIX
  studentId: data.studentId,
  studentName: data.studentName,
  status: data.status,
  time: data.submittedAt || data.time
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

  // ONLY add if truly new submission
  return [...prev, normalized];
});




};



  return () => eventSource.close();
}, [attendanceSession?.id]);


  // End attendance session
  const endAttendanceSession = () => {
    if (!attendanceSession) return;

if (attendanceSession.status === "COMPLETED") {
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
      flaggedCount: attendanceList.filter(s => s.status === "FLAGGED").length,
      attendanceRate: totalStudents > 0 ? Math.round((submitted / totalStudents) * 100) : 0
    };

    setSessionSummary(summary);
    setAttendanceSession(prev => prev ? { ...prev, status: "COMPLETED" } : null);
    setShowSessionModal(false);
    setShowSummaryModal(true);

    // timer setting for 30 min
if (randomTimerRef.current) clearInterval(randomTimerRef.current);

const COOLDOWN_SECONDS = 8; // here for checking only -> later we can put 30 min
setRandomCheckCooldown(COOLDOWN_SECONDS);

randomTimerRef.current = setInterval(() => {
  setRandomCheckCooldown(prev => {
    if (prev <= 1) {
      clearInterval(randomTimerRef.current);
      return null; // cooldown finished
    }
    return prev - 1;
  });
}, 1000);

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


useEffect(() => {
  if (randomCheckCooldown === null) return;

  // ⛔ prevent duplicate intervals
  if (randomTimerRef.current) return;

  randomTimerRef.current = setInterval(() => {
    setRandomCheckCooldown(prev => {
      if (prev <= 1) {
        clearInterval(randomTimerRef.current);
        randomTimerRef.current = null;
        return null;
      }
      return prev - 1;
    });
  }, 1000);

  return () => {
    if (randomTimerRef.current) {
      clearInterval(randomTimerRef.current);
      randomTimerRef.current = null;
    }
  };
}, [randomCheckCooldown]);










  // Submit final attendance
const submitAttendance = () => {
  // RESET TIMERS
  if (countdownRef.current) clearInterval(countdownRef.current);
  if (qrRefreshRef.current) clearInterval(qrRefreshRef.current);

  countdownRef.current = null;
  qrRefreshRef.current = null;

  //  RESET STATE
  setCountdown(120);
  setQrRefreshTimer(30);
setAttendanceSession({ status: "COMPLETED" });
  setAttendanceList([]);
  setSessionSummary(null);

  setShowSummaryModal(false);
  navigate('/faculty/attendance');
};



  const reviewSubmission = async (submissionId, action) => {
  try {
    await fetch(
      `${API_BASE}/api/attendance/review/${submissionId}/${action}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
    );
    // DO NOT update state here — SSE will do it
  } catch (err) {
    console.error("Review failed", err);
    alert("Unable to update attendance status");
  }
};

  return (
    <div className="space-y-8">
      {/* Header Card */}
      <div className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 backdrop-blur-lg rounded-2xl p-8 border border-slate-700/50">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
         
          <div className="flex items-start gap-6">

        {/* Instructions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: 1,
                title: "Start Session",
                description: "Click 'Start Attendance' on your class. A 2-minute timer begins.",
                icon: PlayCircle,
                color: "from-blue-500 to-cyan-500"
              },
              {
                step: 2,
                title: "Display QR Code",
                description: "Project the QR code. Students scan with their phones to submit attendance.",
                icon: QrCode,
                color: "from-purple-500 to-pink-500"
              },
              {
                step: 3,
                title: "Verify & Submit",
                description: "Monitor submissions in real-time, flag suspicious entries, and finalize.",
                icon: CheckCircle,
                color: "from-emerald-500 to-green-500"
              }
            ].map((step, idx) => (
              <div key={idx} className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
                <div className={`w-12 h-12 bg-gradient-to-r ${step.color} rounded-xl flex items-center justify-center mb-4`}>
                  <step.icon className="text-white" size={24} />
                </div>
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-sm font-semibold text-slate-400">STEP {step.step}</span>
                </div>
                <h5 className="text-white font-semibold text-lg mb-2">{step.title}</h5>
                <p className="text-slate-400 text-sm">{step.description}</p>
              </div>
            ))}
          </div>

          </div>
          
          {attendanceSession?.status === 'ACTIVE' && (
            <div className="bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-500/30 rounded-xl p-4 min-w-[300px]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                    <Timer className="text-emerald-400" size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-white">Session Active</p>
                    <p className="text-sm text-slate-300">{formatTime(countdown)} remaining</p>
                  </div>
                </div>
                <button
                  onClick={endAttendanceSession}
                  className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg font-medium transition-colors"
                >
                  End Session
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Classes Grid */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">Start Attendance Session</h3>
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
                      <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">
                        Upcoming
                      </span>
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

                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Expected Attendance</span>
                      <span className="text-emerald-400">
                        {classItem.attendanceRate}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div
                        className="h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-500"
                        style={{ width: `${classItem.attendanceRate}%` }}
                      />
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => startAttendance(classItem)}
                  disabled={loading || randomCheckCooldown !== null}
                  className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-blue-500/20 transition-all flex items-center justify-center gap-2 group"
                >

                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white" />
                    <span>Starting...</span>
                  </>
                ) : randomCheckCooldown !== null ? (
                  <span className="text-slate-300">
                    Presence Check Available In{" "}
                    {Math.floor(randomCheckCooldown / 60)}:
                    {(randomCheckCooldown % 60).toString().padStart(2, "0")}
                  </span>
                ) : (
                  <>
                    <PlayCircle size={20} />
                    <span>Start Attendance Session</span>
                  </>
                )}

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

                {/* Real-time Submissions Panel */}
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

                                    {student.status === "APPROVED" && (
                                      <p className="text-slate-400 text-sm">
                                        Submitted at {student.time}
                                      </p>
                                    )}
                                  </div>


                              </div>
                              
                              <div className="flex items-center gap-3">
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                  student.status === 'SUBMITTED' ? 'bg-blue-500/20 text-blue-400' :
                                  student.status === 'FLAGGED' ? 'bg-amber-500/20 text-amber-400' :
                                  student.status === 'APPROVED' ? 'bg-emerald-500/20 text-emerald-400' :
                                  'bg-red-500/20 text-red-400'
                                }`}>
                                  {student.status}
                                </span>
                                  
                                {student.status === 'APPROVED' && (
                                  
                                  <>
                                <button onClick={() => reviewSubmission(student.submissionId, "flag")} className="px-3 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 rounded-lg text-sm flex items-center gap-1">
                                  <Flag size={14} />
                                  Flag
                                </button>


                                    <button
                                      onClick={() => reviewSubmission(student.submissionId, "approve")}
                                      className="px-3 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 rounded-lg text-sm flex items-center gap-1"
                                    >
                                      <ThumbsUp size={14} />
                                      Approve
                                    </button>

                                    <button
                                      onClick={() => reviewSubmission(student.submissionId, "reject")}
                                      className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-sm flex items-center gap-1"
                                    >
                                      <ThumbsDown size={14} />
                                      Reject
                                    </button>

                                  </>
 
                                )}

                                                                                    
                             {student.status === 'FLAGGED' && (
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => reviewSubmission(student.submissionId, "approve")}
                                      className="px-3 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 rounded-lg text-sm flex items-center gap-1"
                                    >
                                      <ThumbsUp size={14} />
                                      Approve
                                    </button>

                                    <button
                                      onClick={() => reviewSubmission(student.submissionId, "reject")}
                                      className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-sm flex items-center gap-1"
                                    >
                                      <ThumbsDown size={14} />
                                      Reject
                                    </button>
                                  </div>
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

      {/* Summary Modal */}
      {showSummaryModal && sessionSummary && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-lg z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-2xl border border-slate-700/50 w-full max-w-2xl">
            <div className="p-6 border-b border-slate-700/50">
              <h3 className="text-2xl font-bold text-white">Attendance Session Summary</h3>
              <p className="text-slate-400">Review and finalize the attendance for {selectedClass?.courseName}</p>
            </div>
            
            <div className="p-6">
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
                  <div className="text-3xl font-bold text-amber-400 mb-2">{sessionSummary.flaggedCount}</div>
                  <div className="text-slate-400">Flagged Entries</div>
                </div>
              </div>
              
              {sessionSummary.flaggedCount > 0 && (
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
                <h4 className="text-white font-semibold mb-3">Missing Students (Did Not Submit)</h4>
                <div className="bg-slate-900/50 rounded-lg p-4">
                  <p className="text-slate-400">
                    {sessionSummary.absentCount} students did not submit attendance within the 2-minute window.
                    They will be marked as <span className="text-red-400 font-medium">ABSENT</span>.
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


