import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, CheckCircle, AlertCircle, Smartphone, Calendar} from 'lucide-react';
import { Html5Qrcode } from "html5-qrcode";
import API_BASE from "../../config/api";


const StudentAttendance = () => {
  const navigate = useNavigate();
  const [scanning, setScanning] = useState(false);
  const [attendanceData, setAttendanceData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [token, setToken] = useState(null);


  
  const qrScannerRef = useRef(null);



  useEffect(() => {
  console.log("TOKEN FROM sessionStorage:", sessionStorage.getItem("token"));
}, []);


useEffect(() => {
  const storedToken = localStorage.getItem("token");
  setToken(storedToken);

  console.log("TOKEN FROM localStorage:", storedToken);
}, []);



useEffect(() => {
  if (!token) return;

  const fetchAttendanceHistory = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/student/attendance`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch attendance history");

      const data = await res.json();

      console.log("ATTENDANCE DATA:", data); // 🔥 important

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
}, [token]);















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
    const res = await fetch(
      `${API_BASE}/api/attendance/submit`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
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
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 h-full">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold text-white">Scan QR Code</h3>
                <p className="text-sm text-slate-400">Point your camera at the QR code displayed in class</p>
              </div>
              <div className="flex items-center gap-2">
                <Smartphone className="text-slate-500" size={20} />
                <span className="text-sm text-slate-400">Camera required</span>
              </div>
            </div>
            
            {/* Scanner Area */}
            <div className="relative">
              {!scanning ? (
                <div className="aspect-video bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border-2 border-dashed border-slate-700/50 flex flex-col items-center justify-center p-8">
                  <div className="w-24 h-24 bg-gradient-to-r from-slate-700 to-slate-800 rounded-2xl flex items-center justify-center mb-4">
                    <Camera className="text-slate-500" size={40} />
                  </div>
                  <p className="text-slate-400 text-center mb-6">
                    Click "Start Camera" to begin scanning the QR code
                  </p>
                  <button
                    onClick={startCamera}
                    disabled={loading}
                    className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-green-500/20 transition-all flex items-center gap-2 disabled:opacity-50"
                  >
                    <Camera size={20} />
                    Start Camera
                  </button>
                </div>
              ) : (
                <div className="relative aspect-video bg-black rounded-xl overflow-hidden border-2 border-emerald-500/30">

                {/* SCANNER */}
                <div className="w-full flex justify-center">
                <div
                    id="qr-reader"
                    className="w-[280px] h-[280px] bg-black rounded-xl"
                />
                </div>

                  {/* Controls */}
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
                    <button
                      onClick={stopCamera}
                      className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors"
                    >
                      Stop Camera
                    </button>
                  </div>
                </div>
              )}


              {attendanceData?.qrToken && !showSuccess && (
            <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg text-blue-300">
                QR detected. Submitting attendance…
            </div>
            )}
              
              {/* Error Message */}
              {error && (
                <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                  <div className="flex items-center gap-2 text-red-400">
                    <AlertCircle size={20} />
                    <span>{error}</span>
                  </div>
                </div>
              )}
              
              {/* Success Message */}
              {showSuccess && attendanceData && (
                <div className="mt-4 p-6 bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-500/30 rounded-xl animate-fadeIn">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl flex items-center justify-center">
                      <CheckCircle className="text-white" size={32} />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-semibold text-white mb-1">Attendance Marked Successfully!</h4>
                        <p className="text-slate-300">
                          Your attendance has been successfully recorded.
                        </p>

                      <div className="flex items-center gap-6 mt-3">
                        <div className="text-center">
                        <div className="text-2xl font-bold text-green-400">
                          Just now
                        </div>

                          <div className="text-xs text-slate-400">Time</div>
                        </div>
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
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Recent Attendance</h3>
              <Calendar className="text-slate-500" size={20} />
            </div>
            
   <div className="space-y-3 max-h-64 overflow-y-auto">
  {attendanceHistory.length === 0 ? (
    <div className="text-slate-400 text-sm text-center py-6">
      No attendance records yet
    </div>
  ) : (
    attendanceHistory.map((record) => (

                
                <div key={record.id} className="p-3 bg-slate-800/30 rounded-lg border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">{record.subject}</p>
                      <p className="text-sm text-slate-400">{record.date}</p>
                    </div>
<span
  className={`px-2 py-1 text-xs rounded-full ${
    record.status === "present"
      ? "bg-emerald-500/20 text-emerald-400"
      : "bg-red-500/20 text-red-400"
  }`}
>
  {record.status}
</span>

                  </div>
                </div>
                )
              ))}

            </div>
            
            <button 
              onClick={() => navigate('/student/attendance/history')}
              className="w-full mt-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-medium transition-colors"
            >
              View Full History
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentAttendance;
