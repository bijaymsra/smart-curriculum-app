import { useEffect, useState } from "react";
import { useAdmin } from "../../context/AdminContext";

export default function SystemStatus() {
  const [lastSync, setLastSync] = useState("just now");
  const { admin } = useAdmin();

  // Simulated heartbeat (replace with API later)
  useEffect(() => {
    const interval = setInterval(() => {
      setLastSync("just now");
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative group flex items-center gap-3 cursor-default">
      
      {/* Blinking Active Indicator */}
      {/* <div className="relative">
        <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping"></span>
        <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500"></span>
      </div> */}

      {/* Status Text */}
      {/* <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
       {admin?.fullName?.toUpperCase()} • ACTIVE
      </span> */}

      {/* Tooltip */}
      <div className="absolute top-8 left-0 z-50 hidden group-hover:block">
        <div className="rounded-md bg-gray-900 text-white text-xs px-3 py-2 shadow-lg">
          Last synced: {lastSync}
        </div>
      </div>
    </div>
  );
}

