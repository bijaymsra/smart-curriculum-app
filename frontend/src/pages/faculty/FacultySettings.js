import React from 'react';
import { Settings, Shield, Bell, User } from 'lucide-react';

const FacultySettings = () => {
  return (
    <div className="space-y-8">

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