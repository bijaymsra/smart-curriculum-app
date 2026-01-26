import React from 'react';
import { Calendar, BookOpen, Clock, Users } from 'lucide-react';

const FacultyClasses = () => {
  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 backdrop-blur-lg rounded-2xl p-8 border border-slate-700/50">
        <div className="flex items-start gap-6">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
            <Calendar size={32} className="text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">My Classes</h2>
            <p className="text-slate-300 max-w-2xl">
              Manage your course schedules, class timings, and view detailed attendance records for each class.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50">
        <div className="text-center py-12">
          <BookOpen className="mx-auto text-slate-600 mb-4" size={64} />
          <h3 className="text-2xl font-bold text-white mb-2">Classes Management</h3>
          <p className="text-slate-400 max-w-md mx-auto mb-6">
            This feature is currently under development. You'll be able to view all your classes, 
            manage schedules, and access detailed attendance analytics.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg">
            <Clock size={16} />
            <span className="text-sm">Coming Soon</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyClasses;