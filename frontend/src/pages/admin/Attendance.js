import React, { useState } from "react";
import {  Radio, Star, BarChart3, Calendar } from "lucide-react";
import SessionsTab from "./components/SessionsTab";
import ReviewsTab from "./components/ReviewsTab";

export default function Attendance() {
  const [activeTab, setActiveTab] = useState("sessions");

  const tabs = [
    { key: "sessions", label: "Live Monitoring", icon: Radio },
    { key: "reviews", label: "Reviews & Flagged", icon: Star },
  ];

  return (
    <div className="space-y-8">
      {/* Header Section with Date */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-400 mt-1 flex items-center gap-2">
            <Calendar size={16} />
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
        
        {/* Quick Stats Badge */}
        <div className="flex items-center gap-3 bg-slate-800/50 px-4 py-2 rounded-xl border border-slate-700/50">
          <BarChart3 className="text-blue-400" size={20} />
          <span className="text-sm text-slate-300">Real-time updates</span>
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
        </div>
      </div>

      {/* Enhanced Tabs */}
      <div className="bg-slate-800/30 p-2 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
        <div className="flex gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`
                  flex-1 flex items-center justify-center gap-3 px-6 py-3 
                  rounded-xl font-medium transition-all duration-300
                  ${isActive 
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25 scale-[1.02]' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/30'
                  }
                `}
              >
                <Icon size={20} className={isActive ? 'animate-pulse' : ''} />
                {tab.label}
                
                {/* Micro-interaction dot for active tab */}
                {isActive && (
                  <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content with smooth transition */}
      <div className="transition-all duration-300">
        {renderTab()}
      </div>
    </div>
  );
  
  function renderTab() {
    switch (activeTab) {
      case "sessions":
        return <SessionsTab />;
      case "reviews":
        return <ReviewsTab />;
      default:
        return <SessionsTab />;
    }
  }
}