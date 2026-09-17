import React, { useState } from 'react';
import { useSchool } from '../context/SchoolContext';
import { GradeEntryGrid } from '../components/grades/GradeEntryGrid';
import { BatchReportCardPrinter } from '../components/grades/BatchReportCardPrinter';
import { ReportCardModal } from '../components/grades/ReportCardModal';
import { FileSpreadsheet, Award, Printer } from 'lucide-react';

export const GradesView = () => {
  const { students } = useSchool();
  const [activeTab, setActiveTab] = useState('grid'); // 'grid' or 'batch'
  const [reportCardStudentId, setReportCardStudentId] = useState(null);
  const [reportCardTerm, setReportCardTerm] = useState('Term 1');

  const handleOpenSingleReportCard = (studentId, term = 'Term 1') => {
    setReportCardStudentId(studentId);
    setReportCardTerm(term);
  };

  return (
    <div className="space-y-6">
      
      {/* Tab Switcher */}
      <div className="p-1.5 bg-slate-200/60 rounded-2xl flex items-center gap-2 max-w-md no-print">
        <button
          onClick={() => setActiveTab('grid')}
          className={`flex-1 py-2 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'grid' ? 'bg-white text-teal-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          Teacher Grade Entry (Spreadsheet)
        </button>

        <button
          onClick={() => setActiveTab('batch')}
          className={`flex-1 py-2 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'batch' ? 'bg-white text-teal-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Award className="w-4 h-4" />
          Report Cards by Class
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'grid' && (
        <GradeEntryGrid />
      )}

      {activeTab === 'batch' && (
        <BatchReportCardPrinter
          onOpenSingleReportCard={handleOpenSingleReportCard}
        />
      )}

      {/* Single Report Card Modal */}
      {reportCardStudentId && (
        <ReportCardModal
          isOpen={!!reportCardStudentId}
          onClose={() => setReportCardStudentId(null)}
          studentId={reportCardStudentId}
          initialTerm={reportCardTerm}
        />
      )}

    </div>
  );
};
