import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, CheckCircle, Clock, AlertCircle, Smartphone, Calendar, ChevronRight} from 'lucide-react';
import { Html5Qrcode } from "html5-qrcode";
import API_BASE from "../../config/api";
import { authFetch } from "../../utils/authFetch";


const StudentAttendance = () => {
  const navigate = useNavigate();
  const [scanning, setScanning] = useState(false);
  const [attendanceData, setAttendanceData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const qrScannerRef = useRef(null);


useEffect(() => {
  const fetchAttendanceHistory = async () => {
    try {
      const res = await authFetch(`${API_BASE}/api/student/attendance`);

      if (!res.ok) throw new Error("Failed to fetch attendance history");

      const data = await res.json();

      const normalized = data.map((item, index) => ({
        id: index,
        subject: item.courseName,
        date: item.date,
        time: "—",
        status: item.status.toLowerCase(),
      }));

      setAttendanceHistory(normalized);
    } catch (err) {
      console.error("Attendance history error:", err);
    }
  };

  fetchAttendanceHistory();
}, []);


    useEffect(() => {

    return () => {
        if (qrScannerRef.current) {
        qrScannerRef.current.stop().catch(() => {});
        qrScannerRef.current.clear().catch(() => {});
        qrScannerRef.current = null;
        }
    };
    }, []);



const startCamera = async () => {
  setError(null);
  setScanning(true);

  setTimeout(async () => {
    try {
      const scanner = new Html5Qrcode("qr-reader");
      qrScannerRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: 250 },
        (decodedText) => {
          handleQrDetected(decodedText);
        }
      );
    } catch (err) {
      console.error("Camera start failed:", err);
      setError("Unable to start camera");
      setScanning(false);
    }
  }, 100); 
};


const stopCamera = async () => {
  if (qrScannerRef.current) {
    try {
      await qrScannerRef.current.stop();
      await qrScannerRef.current.clear();
    } catch (e) {
      console.warn("Scanner already stopped");
    }
    qrScannerRef.current = null;
  }
  setScanning(false);
};



const handleQrDetected = async (decodedText) => {
  // Expected format: attn:<secureToken>
  if (!decodedText.startsWith("attn:")) {
    setError("Invalid attendance QR code");
    await stopCamera();
    return;
  }

  const token = decodedText.replace("attn:", "").trim();

  if (!token || token.length < 20) {
    setError("Invalid or corrupted QR token");
    await stopCamera();
    return;
  }

  setAttendanceData({ qrToken: token });

  await stopCamera();
};


const submitAttendance = async (qrToken) => {
  setLoading(true);
  setError(null);

  try {
    const res = await authFetch(
      `${API_BASE}/api/attendance/submit`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          qrToken,
          studentId: Number(sessionStorage.getItem("studentId")),
        }),
      }
    );

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Attendance submission failed");
    }

    const data = await res.json();

    setAttendanceData(data);
    setShowSuccess(true);

    // auto-hide success after 5s
    setTimeout(() => setShowSuccess(false), 5000);
  } catch (err) {
    console.error(err);
    setError(err.message || "Unable to submit attendance");
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  if (attendanceData?.qrToken && !showSuccess) {
    submitAttendance(attendanceData.qrToken);
  }
}, [attendanceData?.qrToken]);




  return (
    <div className="space-y-8">

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

        {/* QR Scanner Panel */}
        <div className="lg:col-span-2">
          <div className="bg-slate-800/50 backdrop-blur-md rounded-3xl p-8 border border-slate-700/50 h-fit shadow-2xl flex flex-col">
            
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  Live Attendance Scanner
                </h3>
                <p className="text-slate-400 text-sm mt-1">
                  Position the QR code within the frame to verify your presence.
                </p>
              </div>
              <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-slate-900/50 rounded-2xl border border-slate-700/50">
                <Smartphone className="text-blue-400" size={18} />
                <span className="text-xs font-medium text-slate-300 uppercase tracking-wider">Secure Verification</span>
              </div>
            </div>
            
            {/* Scanner Area */}
            <div className="relative flex-grow flex flex-col justify-center">
              {!scanning ? (
                <div className="aspect-video bg-slate-900/80 rounded-2xl border-2 border-dashed border-slate-700/50 flex flex-col items-center justify-center p-12 transition-all duration-300 hover:border-emerald-500/30 group">
                  <div className="w-28 h-28 bg-slate-800 rounded-3xl flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform duration-500">
                    <Camera className="text-slate-500 group-hover:text-emerald-400" size={48} />
                  </div>
                  <h4 className="text-white font-semibold text-lg mb-2">Camera Ready</h4>
                  <p className="text-slate-400 text-center max-w-xs mb-8 text-sm leading-relaxed">
                    Please ensure you are in a well-lit environment for faster QR detection.
                  </p>
                  <button
                    onClick={startCamera}
                    disabled={loading}
                    className="px-10 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold shadow-lg shadow-emerald-900/20 transition-all active:scale-95 flex items-center gap-3 disabled:opacity-50"
                  >
                    <Camera size={22} />
                    Start Scanning
                  </button>
                </div>
              ) : (
                <div className="relative aspect-video bg-black rounded-2xl overflow-hidden border-2 border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
                  
                  <div className="absolute inset-0 pointer-events-none z-10">
                    <div className="absolute top-8 left-8 w-12 h-12 border-t-4 border-l-4 border-emerald-500 rounded-tl-lg" />
                    <div className="absolute top-8 right-8 w-12 h-12 border-t-4 border-r-4 border-emerald-500 rounded-tr-lg" />
                    <div className="absolute bottom-8 left-8 w-12 h-12 border-b-4 border-l-4 border-emerald-500 rounded-bl-lg" />
                    <div className="absolute bottom-8 right-8 w-12 h-12 border-b-4 border-r-4 border-emerald-500 rounded-br-lg" />
                    
                    {/* Animated Laser Line */}
                    <div className="w-full h-0.5 bg-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.8)] absolute top-0 animate-scanLine" />
                  </div>

                  <div className="w-full h-full flex justify-center items-center bg-slate-950">
                    <div id="qr-reader" className="w-full max-w-md h-full" />
                  </div>

                  {/* Controls */}
                  <div className="absolute bottom-6 left-0 right-0 flex justify-center z-20">
                    <button
                      onClick={stopCamera}
                      className="px-8 py-2.5 bg-red-500/10 hover:bg-red-500 backdrop-blur-md text-red-500 hover:text-white border border-red-500/20 rounded-xl font-semibold transition-all"
                    >
                      Cancel Scan
                    </button>
                  </div>
                </div>
              )}

              {/* Dynamic Status Overlays */}
              {attendanceData?.qrToken && !showSuccess && (
                <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center gap-3 text-blue-400 animate-pulse">
                  <div className="w-2 h-2 bg-blue-400 rounded-full" />
                  <span className="font-medium text-sm">Processing Token... Communicating with server</span>
                </div>
              )}
              
              {error && (
                <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-400">
                  <AlertCircle size={20} />
                  <span className="text-sm font-medium">{error}</span>
                </div>
              )}
              
              {showSuccess && (
                <div className="mt-6 p-8 bg-gradient-to-br from-emerald-500/20 to-slate-800/50 border border-emerald-500/30 rounded-3xl animate-in fade-in zoom-in duration-500">
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/40 shrink-0">
                      <CheckCircle className="text-white" size={40} />
                    </div>
                    <div>
                      <h4 className="text-2xl font-bold text-white mb-1">Attendance Verified</h4>
                      <p className="text-emerald-400/80 font-medium">Verified by ATLAS Secure Link</p>
                      <div className="mt-4 py-2 px-4 bg-emerald-500/10 rounded-lg inline-block border border-emerald-500/20">
                        <span className="text-xs text-slate-400 uppercase mr-2">Timestamp:</span>
                        <span className="text-white font-mono text-sm">{new Date().toLocaleTimeString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>


        {/* Recent History */}
        <div className="space-y-6 lg:sticky lg:top-8">
          <div className="bg-slate-800/40 backdrop-blur-xl rounded-3xl p-6 border border-white/5 shadow-2xl max-h-[calc(100vh-120px)] flex flex-col transition-all duration-500 hover:border-blue-500/20">
            
            {/* Header Section */}
            <div className="flex items-center justify-between mb-6">
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                  Recent Activity
                  <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                </h3>
                <p className="text-slate-400 text-xs font-medium uppercase tracking-widest">
                  Latest Logs
                </p>
              </div>
              <div className="p-2.5 bg-blue-500/10 rounded-xl border border-blue-500/20 group-hover:rotate-12 transition-transform">
                <Calendar className="text-blue-400" size={20} />
              </div>
            </div>

            {/* Scrollable List Container */}
            <div className="space-y-3 overflow-y-auto pr-2 flex-grow custom-scrollbar mb-4">
              {attendanceHistory.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-slate-500 bg-slate-900/20 rounded-2xl border border-dashed border-slate-700/50">
                  <div className="p-4 bg-slate-800/50 rounded-full mb-4">
                    <Calendar size={32} className="opacity-20 text-blue-400" />
                  </div>
                  <p className="text-sm font-medium">No records found yet</p>
                  <p className="text-[10px] text-slate-600 uppercase tracking-tighter">Start scanning to sync</p>
                </div>
              ) : (
                attendanceHistory.map((record, idx) => (
                  <div 
                    key={record.id || idx} 
                    className="group relative p-4 bg-slate-900/40 hover:bg-slate-800/80 rounded-2xl border border-white/5 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {/* Visual Status Glow */}
                        <div className={`relative w-1 h-10 rounded-full overflow-hidden`}>
                          <div className={`absolute inset-0 blur-[2px] opacity-50 ${
                              record.status.toLowerCase() === "present" ? "bg-emerald-400" : "bg-red-400"
                          }`} />
                          <div className={`relative w-full h-full ${
                              record.status.toLowerCase() === "present" ? "bg-emerald-500" : "bg-red-500"
                          }`} />
                        </div>

                        <div>
                          <p className="text-slate-100 font-bold text-sm leading-tight group-hover:text-blue-400 transition-colors">
                            {record.subject}
                          </p>
                          <div className="flex items-center gap-3 mt-1">
                            <p className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
                              <Clock size={12} className="text-slate-600" /> 
                              {record.date}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end gap-1">
                        <span className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-tighter rounded-md border ${
                          record.status.toLowerCase() === "present"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : "bg-red-500/10 text-red-400 border-red-500/20"
                        }`}>
                          {record.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            {/* Footer Action */}
            <button 
              onClick={() => navigate('/student/tasks')}
              className="group/btn w-full py-4 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 hover:from-blue-600 hover:to-indigo-600 text-blue-400 hover:text-white border border-blue-500/20 rounded-2xl text-xs font-black uppercase tracking-widest transition-all duration-500 shadow-lg flex items-center justify-center gap-2"
            >
              Full Analytics Report
              <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>


      </div>
      
    </div>
  );
};

export default StudentAttendance;
