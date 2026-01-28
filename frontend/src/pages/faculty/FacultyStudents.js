import React from 'react';
import { Users, GraduationCap, TrendingUp, Book } from 'lucide-react';

const FacultyStudents = () => {
  return (
    <div className="space-y-8">

      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50">
        <div className="text-center py-12">
          <GraduationCap className="mx-auto text-slate-600 mb-4" size={64} />
          <h3 className="text-2xl font-bold text-white mb-2">Students Management</h3>
          <p className="text-slate-400 max-w-md mx-auto mb-6">
            Student management features including detailed profiles, attendance tracking, 
            and performance analytics will be available soon.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg">
            <TrendingUp size={16} />
            <span className="text-sm">Under Development</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyStudents;