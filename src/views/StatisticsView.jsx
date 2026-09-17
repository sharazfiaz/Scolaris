import React, { useState } from 'react';
import { GrowthDashboard } from '../components/statistics/GrowthDashboard';
import { AdmissionsAnalytics } from '../components/statistics/AdmissionsAnalytics';
import { StateExamPassRates } from '../components/statistics/StateExamPassRates';
import { PrintableMeetingReport } from '../components/statistics/PrintableMeetingReport';
import { TrendingUp, UserPlus, Award, FileText } from 'lucide-react';

export const StatisticsView = () => {
  const [activeTab, setActiveTab] = useState('growth'); // 'growth', 'admissions', 'exams', 'report'

  return (
    <div className="space-y-6">
      
      {/* Tab Switcher */}
      <div className="p-1.5 bg-slate-200/60 rounded-2xl flex flex-wrap items-center gap-2 max-w-2xl no-print">
        <button
          onClick={() => setActiveTab('growth')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'growth' ? 'bg-white text-teal-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          Enrollment & Capacity
        </button>

        <button
          onClick={() => setActiveTab('admissions')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'admissions' ? 'bg-white text-teal-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <UserPlus className="w-4 h-4" />
          Admissions & Retention
        </button>

        <button
          onClick={() => setActiveTab('exams')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'exams' ? 'bg-white text-teal-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Award className="w-4 h-4" />
          National State Exams
        </button>

        <button
          onClick={() => setActiveTab('report')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'report' ? 'bg-white text-teal-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          Executive Briefing
        </button>
      </div>

      {activeTab === 'growth' && <GrowthDashboard />}
      {activeTab === 'admissions' && <AdmissionsAnalytics />}
      {activeTab === 'exams' && <StateExamPassRates />}
      {activeTab === 'report' && <PrintableMeetingReport />}

    </div>
  );
};
