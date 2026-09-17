import React, { useState } from 'react';
import { useSchool } from '../context/SchoolContext';
import { SchoolIdCard } from '../components/idCards/SchoolIdCard';
import { BatchIdCardPrinter } from '../components/idCards/BatchIdCardPrinter';
import { QrCodeVerifierModal } from '../components/idCards/QrCodeVerifierModal';
import { CreditCard, Users, QrCode, Search, ShieldCheck, Printer } from 'lucide-react';

export const IdCardsView = () => {
  const { students, classes } = useSchool();

  const [activeTab, setActiveTab] = useState('single'); // 'single', 'batch', 'verify'
  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [isVerifierOpen, setIsVerifierOpen] = useState(false);

  const filteredStudents = students.filter(s => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return s.id.toLowerCase().includes(q) || `${s.firstName} ${s.lastName}`.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">School ID Badges & QR Security</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Generate, print, batch export, and verify tamper-proof student identification cards with embedded QR codes
          </p>
        </div>

        <button
          onClick={() => setIsVerifierOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-xl shadow-sm transition-all"
        >
          <QrCode className="w-4 h-4 text-teal-600" />
          Test QR Verifier Scanner
        </button>
      </div>

      {/* Tabs Switcher */}
      <div className="p-1.5 bg-slate-200/60 rounded-2xl flex items-center gap-2 max-w-md no-print">
        <button
          onClick={() => setActiveTab('single')}
          className={`flex-1 py-2 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'single' ? 'bg-white text-teal-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          Single Card View
        </button>

        <button
          onClick={() => setActiveTab('batch')}
          className={`flex-1 py-2 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'batch' ? 'bg-white text-teal-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Users className="w-4 h-4" />
          Batch Class Printing
        </button>
      </div>

      {/* Tab 1: Single Card Preview */}
      {activeTab === 'single' && (
        <div className="space-y-6">
          {/* Student Selector Card */}
          <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center gap-3 no-print">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Find student for ID badge..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs pl-10 pr-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white"
              />
            </div>

            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="w-full sm:w-80 text-xs font-bold border border-slate-300 rounded-xl px-3 py-2 bg-slate-50"
            >
              {filteredStudents.map(s => {
                const cls = classes.find(c => c.id === s.classId);
                return (
                  <option key={s.id} value={s.id}>
                    {s.firstName} {s.lastName} ({s.id} - {cls?.name})
                  </option>
                );
              })}
            </select>
          </div>

          {/* School ID Card Component */}
          {selectedStudentId && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
              <SchoolIdCard
                studentId={selectedStudentId}
                onOpenVerifier={() => setIsVerifierOpen(true)}
                showControls={true}
              />
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Batch Class Printer */}
      {activeTab === 'batch' && (
        <BatchIdCardPrinter />
      )}

      {/* QR Verifier Modal */}
      {isVerifierOpen && (
        <QrCodeVerifierModal
          isOpen={isVerifierOpen}
          onClose={() => setIsVerifierOpen(false)}
          defaultStudent={students.find(s => s.id === selectedStudentId)}
        />
      )}

    </div>
  );
};
