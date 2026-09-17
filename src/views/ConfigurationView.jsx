import React, { useState } from 'react';
import { TrackManager } from '../components/configuration/TrackManager';
import { SubjectManager } from '../components/configuration/SubjectManager';
import { CycleAndClassroomsManager } from '../components/configuration/CycleAndClassroomsManager';
import { FeeStructureConfig } from '../components/configuration/FeeStructureConfig';
import { BackupRestoreManager } from '../components/configuration/BackupRestoreManager';
import { Layers, BookOpen, Building, DollarSign, HardDrive } from 'lucide-react';

export const ConfigurationView = () => {
  const [activeTab, setActiveTab] = useState('tracks'); // 'tracks', 'subjects', 'classrooms', 'fees', 'backup'

  return (
    <div className="space-y-6">
      
      {/* Tab Switcher */}
      <div className="p-1.5 bg-slate-200/60 rounded-2xl flex flex-wrap items-center gap-2 max-w-3xl no-print">
        <button
          onClick={() => setActiveTab('tracks')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'tracks' ? 'bg-white text-teal-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Layers className="w-4 h-4" />
          Tracks (A, C, D...)
        </button>

        <button
          onClick={() => setActiveTab('subjects')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'subjects' ? 'bg-white text-teal-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Subjects & Weights
        </button>

        <button
          onClick={() => setActiveTab('classrooms')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'classrooms' ? 'bg-white text-teal-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Building className="w-4 h-4" />
          Rooms & Cohorts
        </button>

        <button
          onClick={() => setActiveTab('fees')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'fees' ? 'bg-white text-teal-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          Fee Schedules
        </button>

        <button
          onClick={() => setActiveTab('backup')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'backup' ? 'bg-white text-teal-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <HardDrive className="w-4 h-4" />
          USB Backup & Info
        </button>
      </div>

      {activeTab === 'tracks' && <TrackManager />}
      {activeTab === 'subjects' && <SubjectManager />}
      {activeTab === 'classrooms' && <CycleAndClassroomsManager />}
      {activeTab === 'fees' && <FeeStructureConfig />}
      {activeTab === 'backup' && <BackupRestoreManager />}

    </div>
  );
};
