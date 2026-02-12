import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, CheckCircle, Clock, AlertCircle, Smartphone, Calendar} from 'lucide-react';
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
  console.log("QR detected:", decodedText);

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

  console.log("Secure QR token extracted:", token);

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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

{/* QR Scanner Panel */}
<div className="lg:col-span-2">
  <div className="bg-slate-800/50 backdrop-blur-md rounded-3xl p-8 border border-slate-700/50 h-full shadow-2xl flex flex-col">
    
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
          
          {/* THE HUD OVERLAY (The "Tech" Feel) */}
          <div className="absolute inset-0 pointer-events-none z-10">
            {/* Corner Brackets */}
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
              <p className="text-emerald-400/80 font-medium">Verified by ATTENZA Secure Link</p>
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
          <div className="space-y-6">
            {/* Increased padding (p-8), added shadow, and set a comfortable minimum height */}
            <div className="bg-slate-800/50 backdrop-blur-md rounded-3xl p-8 border border-slate-700/50 shadow-2xl min-h-[500px] flex flex-col">
              
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-white tracking-tight">Recent Attendance</h3>
                  <p className="text-slate-400 text-sm mt-1">Your latest session records</p>
                </div>
                <div className="p-3 bg-slate-700/30 rounded-xl">
                  <Calendar className="text-blue-400" size={24} />
                </div>
              </div>
              
              {/* Flex-grow allows this area to fill the space, pushing the button to the bottom */}
              <div className="space-y-4 overflow-y-auto pr-2 flex-grow custom-scrollbar">
                {attendanceHistory.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 text-slate-500 space-y-3">
                    <div className="p-4 bg-slate-900/50 rounded-full">
                      <Calendar size={40} className="opacity-20" />
                    </div>
                    <p className="text-sm">No attendance records found yet</p>
                  </div>
                ) : (
                  attendanceHistory.map((record) => (
                    <div 
                      key={record.id} 
                      className="group p-4 bg-slate-900/40 hover:bg-slate-800/60 rounded-xl border border-slate-700/50 transition-all duration-200 hover:border-slate-500/50"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          {/* Visual indicator for status */}
                          <div className={`w-1.5 h-10 rounded-full ${
                            record.status === "present" ? "bg-emerald-500" : "bg-red-500"
                          }`} />
                          <div>
                            <p className="text-white font-semibold text-lg">{record.subject}</p>
                            <p className="text-sm text-slate-400 flex items-center gap-1">
                              <Clock size={12} /> {record.date}
                            </p>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-lg border ${
                            record.status === "present"
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
              
              {/* Prominent Footer Button */}
              <button 
                onClick={() => navigate('/student/planner')}
                className="w-full mt-8 py-4 bg-blue-600/10 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-600/20 rounded-xl text-sm font-bold transition-all duration-300 shadow-lg"
              >
                View Full History Report
              </button>
            </div>
          </div>

      </div>
    </div>
  );
};

export default StudentAttendance;
