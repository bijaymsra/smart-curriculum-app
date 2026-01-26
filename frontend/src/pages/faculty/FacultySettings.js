// src/pages/faculty/FacultySettings.js
import React from 'react';
import { Settings, Shield, Bell, User } from 'lucide-react';

const FacultySettings = () => {
  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 backdrop-blur-lg rounded-2xl p-8 border border-slate-700/50">
        <div className="flex items-start gap-6">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
            <Settings size={32} className="text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Settings</h2>
            <p className="text-slate-300 max-w-2xl">
              Customize your preferences, manage notification settings, and update your profile information.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50">
        <div className="text-center py-12">
          <User className="mx-auto text-slate-600 mb-4" size={64} />
          <h3 className="text-2xl font-bold text-white mb-2">Settings Management</h3>
          <p className="text-slate-400 max-w-md mx-auto mb-6">
            Profile settings, notification preferences, and system configurations 
            will be available in the next update.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg">
            <Shield size={16} />
            <span className="text-sm">Available Soon</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultySettings;