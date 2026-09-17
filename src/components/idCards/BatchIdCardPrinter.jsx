import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { SchoolIdCard } from './SchoolIdCard';
import { Printer, Users, Layers, Filter } from 'lucide-react';

export const BatchIdCardPrinter = () => {
  const { classes, students, cycles } = useSchool();
  const [selectedClassId, setSelectedClassId] = useState(classes[0]?.id || '');
  const [selectedCycleId, setSelectedCycleId] = useState('all');

  const filteredClasses = classes.filter(c => selectedCycleId === 'all' || c.cycleId === selectedCycleId);
  const classStudents = students.filter(s => s.classId === selectedClassId && s.status === 'Enrolled');
  const selectedClass = classes.find(c => c.id === selectedClassId);

  const handlePrintAll = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 bg-white rounded-2xl border border-slate-200/80 shadow-sm no-print">
        <div>
          <h3 className="text-base font-bold text-slate-900">Batch Class ID Card Printing</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Format all student identification cards of a class onto printable sheets for laser printing
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Cycle filter */}
          <select
            value={selectedCycleId}
            onChange={(e) => {
              setSelectedCycleId(e.target.value);
              const firstCls = classes.find(c => e.target.value === 'all' || c.cycleId === e.target.value);
              if (firstCls) setSelectedClassId(firstCls.id);
            }}
            className="text-xs font-semibold rounded-xl border border-slate-300 px-3 py-2 bg-slate-50"
          >
            <option value="all">All Cycles</option>
            {cycles.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>

          {/* Class Selector */}
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="text-xs font-semibold rounded-xl border border-slate-300 px-3 py-2 bg-slate-50"
          >
            {filteredClasses.map(c => (
              <option key={c.id} value={c.id}>{c.name} ({students.filter(s => s.classId === c.id).length} students)</option>
            ))}
          </select>

          <button
            onClick={handlePrintAll}
            disabled={classStudents.length === 0}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 shadow-md disabled:bg-slate-300 transition-all"
          >
            <Printer className="w-4 h-4" />
            Print Batch ({classStudents.length} Cards)
          </button>
        </div>
      </div>

      {/* Class Batch Grid */}
      {classStudents.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 no-print">
          <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <h4 className="text-sm font-bold text-slate-700">No active students in this class</h4>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="text-xs font-bold text-slate-700 px-2 no-print flex items-center justify-between">
            <span>Class Cohort: {selectedClass?.name} ({classStudents.length} Students)</span>
            <span className="text-slate-500">Ready for Black & White or Color Print</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {classStudents.map(student => (
              <div key={student.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm print:border-none print:shadow-none print:p-0 print:m-0">
                <SchoolIdCard studentId={student.id} showControls={false} />
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
