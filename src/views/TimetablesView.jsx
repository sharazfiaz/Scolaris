import React, { useState } from 'react';
import { ClassTimetableView } from '../components/timetables/ClassTimetableView';
import { TeacherTimetableView } from '../components/timetables/TeacherTimetableView';
import { TimetableEditorModal } from '../components/timetables/TimetableEditorModal';
import { Calendar, Users, GraduationCap } from 'lucide-react';

export const TimetablesView = () => {
  const [activeTab, setActiveTab] = useState('class'); // 'class' or 'teacher'
  const [editorClassId, setEditorClassId] = useState(null);

  return (
    <div className="space-y-6">
      
      {/* Tab Switcher */}
      <div className="p-1.5 bg-slate-200/60 rounded-2xl flex items-center gap-2 max-w-md no-print">
        <button
          onClick={() => setActiveTab('class')}
          className={`flex-1 py-2 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'class' ? 'bg-white text-teal-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Calendar className="w-4 h-4" />
          Class Schedules
        </button>

        <button
          onClick={() => setActiveTab('teacher')}
          className={`flex-1 py-2 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'teacher' ? 'bg-white text-teal-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          Teacher Consolidated
        </button>
      </div>

      {activeTab === 'class' ? (
        <ClassTimetableView onOpenEditor={(clsId) => setEditorClassId(clsId)} />
      ) : (
        <TeacherTimetableView />
      )}

      {/* Editor Modal */}
      {editorClassId && (
        <TimetableEditorModal
          isOpen={!!editorClassId}
          onClose={() => setEditorClassId(null)}
          classId={editorClassId}
        />
      )}

    </div>
  );
};
