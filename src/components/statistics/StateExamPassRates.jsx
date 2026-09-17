import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { useToast } from '../../context/ToastContext';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import {
  Award,
  Plus,
  TrendingUp,
  Percent,
  CheckCircle2,
  XCircle,
  HelpCircle,
  FileCheck2,
  Calendar
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

export const StateExamPassRates = () => {
  const { examStatistics, recordExamResult, schoolInfo } = useSchool();
  const { showSuccess, showWarning } = useToast();

  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState('CEP');
  const [examYear, setExamYear] = useState('2026');
  const [selectedTrack, setSelectedTrack] = useState('Track A');
  const [candidatesCount, setCandidatesCount] = useState('');
  const [passedCount, setPassedCount] = useState('');

  const cepData = examStatistics.find(e => e.examCode === 'CEP');
  const bepcData = examStatistics.find(e => e.examCode === 'BEPC');
  const bacData = examStatistics.find(e => e.examCode === 'BAC');

  // Chart data preparing pass rates across 2023 - 2026
  const passRatesComparison = [
    { year: '2023', CEP: 94.7, BEPC: 87.8, BacTrackA: 87.5, BacTrackC: 89.3 },
    { year: '2024', CEP: 97.6, BEPC: 91.3, BacTrackA: 91.4, BacTrackC: 93.3 },
    { year: '2025', CEP: 100.0, BEPC: 93.0, BacTrackA: 94.7, BacTrackC: 97.1 },
    { year: '2026', CEP: 97.8, BEPC: 94.3, BacTrackA: 95.0, BacTrackC: 97.1 },
  ];

  const handleRecordSubmit = (e) => {
    e.preventDefault();
    const cand = Number(candidatesCount);
    const pass = Number(passedCount);

    if (!cand || cand <= 0) {
      showWarning('Please enter a valid number of candidates.');
      return;
    }
    if (pass < 0 || pass > cand) {
      showWarning('Number of passed students cannot exceed registered candidates.');
      return;
    }

    recordExamResult(selectedExam, examYear, {
      candidates: cand,
      passed: pass,
      trackCode: selectedExam === 'BAC' ? selectedTrack : undefined
    });

    showSuccess(`Recorded official ${selectedExam} results for ${examYear}: ${pass}/${cand} passed (${((pass / cand) * 100).toFixed(1)}%).`);
    setIsEntryModalOpen(false);
    setCandidatesCount('');
    setPassedCount('');
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Official State Examination Pass Rates</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Congolese National Diploma Results: CEP (Primary CM2), BEPC (Lower Secondary 3ème) and Baccalauréat (Terminale by Track)
          </p>
        </div>

        <button
          onClick={() => setIsEntryModalOpen(true)}
          className="flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white shadow-lg shadow-teal-900/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          Record State Exam Results
        </button>
      </div>

      {/* Multi-Year Pass Rate Line Chart */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">National Examination Success Rates (%)</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Historical pass percentage trends for CEP, BEPC, and Baccalauréat Tracks
            </p>
          </div>
          <span className="text-xs font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200">
            Binary Pass/Fail Official Metric
          </span>
        </div>

        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={passRatesComparison} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="year" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={11} domain={[70, 100]} tickLine={false} tickFormatter={(v) => `${v}%`} />
              <Tooltip
                formatter={(val) => [`${val}%`, '']}
                contentStyle={{ backgroundColor: '#0f172a', color: '#fff', borderRadius: '12px', border: 'none', fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Line type="monotone" dataKey="CEP" name="CEP (Primary CM2)" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="BEPC" name="BEPC (3rd Grade)" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="BacTrackC" name="Baccalauréat Track C (Sciences)" stroke="#8b5cf6" strokeWidth={2.5} strokeDasharray="4 4" dot={{ r: 4 }} />
              <Line type="monotone" dataKey="BacTrackA" name="Baccalauréat Track A (Arts)" stroke="#f59e0b" strokeWidth={2.5} strokeDasharray="4 4" dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3 Detailed Examination Result Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* 1. CEP (Primary) */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                Primary Education
              </span>
              <h4 className="font-extrabold text-sm text-slate-900 mt-1">CEP Examination</h4>
            </div>
            <Award className="w-6 h-6 text-emerald-600" />
          </div>
          <p className="text-xs text-slate-500">
            Certificat d'Études Primaires (CM2 continuous assessment reform).
          </p>
          <div className="space-y-2 text-xs pt-1">
            {cepData?.years.map(y => (
              <div key={y.year} className="flex items-center justify-between p-2 bg-slate-50 rounded-xl">
                <span className="font-bold text-slate-700">{y.year}:</span>
                <span className="text-slate-600">{y.passed} / {y.candidates} passed</span>
                <strong className="text-emerald-700 font-mono font-bold">{y.passRate}%</strong>
              </div>
            ))}
          </div>
        </div>

        {/* 2. BEPC (Lower Secondary) */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                Lower Secondary
              </span>
              <h4 className="font-extrabold text-sm text-slate-900 mt-1">BEPC Examination</h4>
            </div>
            <Award className="w-6 h-6 text-blue-600" />
          </div>
          <p className="text-xs text-slate-500">
            Brevet d'Études du Premier Cycle (3rd Grade / 3ème).
          </p>
          <div className="space-y-2 text-xs pt-1">
            {bepcData?.years.map(y => (
              <div key={y.year} className="flex items-center justify-between p-2 bg-slate-50 rounded-xl">
                <span className="font-bold text-slate-700">{y.year}:</span>
                <span className="text-slate-600">{y.passed} / {y.candidates} passed</span>
                <strong className="text-blue-700 font-mono font-bold">{y.passRate}%</strong>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Baccalauréat by Track */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                Upper Secondary
              </span>
              <h4 className="font-extrabold text-sm text-slate-900 mt-1">Baccalauréat (By Track)</h4>
            </div>
            <Award className="w-6 h-6 text-purple-600" />
          </div>
          <p className="text-xs text-slate-500">
            Official high school graduation diploma across tracks.
          </p>
          <div className="space-y-2 text-xs pt-1">
            <div className="font-bold text-[11px] text-teal-800">Track C (Sciences 2026):</div>
            <div className="flex items-center justify-between p-2 bg-teal-50/60 rounded-xl text-xs">
              <span>34 / 35 Candidates</span>
              <strong className="text-teal-900 font-mono font-bold">97.1% Pass Rate</strong>
            </div>

            <div className="font-bold text-[11px] text-amber-800 mt-2">Track A (Humanities 2026):</div>
            <div className="flex items-center justify-between p-2 bg-amber-50/60 rounded-xl text-xs">
              <span>38 / 40 Candidates</span>
              <strong className="text-amber-900 font-mono font-bold">95.0% Pass Rate</strong>
            </div>
          </div>
        </div>

      </div>

      {/* Record State Exam Results Modal */}
      {isEntryModalOpen && (
        <Modal
          isOpen={isEntryModalOpen}
          onClose={() => setIsEntryModalOpen(false)}
          title="Record Official State Examination Results"
          subtitle="Enter binary Pass / Fail candidate statistics published by MEPPSA"
          maxWidth="max-w-xl"
        >
          <form onSubmit={handleRecordSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">State Examination *</label>
              <select
                value={selectedExam}
                onChange={(e) => setSelectedExam(e.target.value)}
                className="w-full text-xs font-semibold border border-slate-300 rounded-xl px-3 py-2 bg-white"
              >
                <option value="CEP">CEP — Primary School Certificate (CM2)</option>
                <option value="BEPC">BEPC — Lower Secondary Diploma (3ème)</option>
                <option value="BAC">Baccalauréat Général (Terminale)</option>
              </select>
            </div>

            {selectedExam === 'BAC' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Specialization Track *</label>
                <select
                  value={selectedTrack}
                  onChange={(e) => setSelectedTrack(e.target.value)}
                  className="w-full text-xs font-semibold border border-slate-300 rounded-xl px-3 py-2 bg-white"
                >
                  <option value="Track A">Track A (Literature / Humanities)</option>
                  <option value="Track C">Track C (Mathematics & Physical Sciences)</option>
                  <option value="Track D">Track D (Life & Earth Sciences)</option>
                </select>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Exam Session Year *</label>
                <input
                  type="text"
                  value={examYear}
                  onChange={(e) => setExamYear(e.target.value)}
                  className="w-full text-xs font-mono font-bold border border-slate-300 rounded-xl px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Total Candidates *</label>
                <input
                  type="number"
                  min="1"
                  required
                  placeholder="e.g. 45"
                  value={candidatesCount}
                  onChange={(e) => setCandidatesCount(e.target.value)}
                  className="w-full text-xs font-bold border border-slate-300 rounded-xl px-3 py-2"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Number of Students Passed (Admis) *</label>
              <input
                type="number"
                min="0"
                required
                placeholder="e.g. 43"
                value={passedCount}
                onChange={(e) => setPassedCount(e.target.value)}
                className="w-full text-xs font-bold border border-slate-300 rounded-xl px-3 py-2 text-emerald-800"
              />
            </div>

            {candidatesCount && passedCount && Number(candidatesCount) > 0 && (
              <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl flex items-center justify-between text-xs">
                <span className="font-semibold text-teal-900">Computed Pass Rate:</span>
                <strong className="text-teal-950 font-black text-sm">
                  {((Number(passedCount) / Number(candidatesCount)) * 100).toFixed(1)}%
                </strong>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setIsEntryModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold rounded-xl text-white bg-teal-600 hover:bg-teal-700 shadow-md"
              >
                Save Official Results
              </button>
            </div>
          </form>
        </Modal>
      )}

    </div>
  );
};
