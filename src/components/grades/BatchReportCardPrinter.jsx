import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { ReportCardModal } from './ReportCardModal';
import { Printer, FileSpreadsheet, Users } from 'lucide-react';

export const BatchReportCardPrinter = ({ onOpenSingleReportCard }) => {
  const { classes, students, schoolInfo } = useSchool();
  const [selectedClassId, setSelectedClassId] = useState(classes[0]?.id || '');
  const [term, setTerm] = useState('Term 1');

  const selectedClass = classes.find(c => c.id === selectedClassId);
  const classStudents = students.filter(s => s.classId === selectedClassId && s.status === 'Enrolled');

  return (
    <div className="space-y-6">
      
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 bg-white rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h3 className="text-base font-bold text-slate-900">Batch Report Card Generation</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Generate and inspect complete term grade bulletins and ranking rosters by class cohort
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            className="text-xs font-semibold rounded-xl border border-slate-300 px-3 py-2 bg-slate-50"
          >
            <option value="Term 1">1st Trimester</option>
            <option value="Term 2">2nd Trimester</option>
            <option value="Term 3">3rd Trimester</option>
          </select>

          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="text-xs font-semibold rounded-xl border border-slate-300 px-3 py-2 bg-slate-50"
          >
            {classes.map(c => (
              <option key={c.id} value={c.id}>
                {c.name} ({students.filter(s => s.classId === c.id).length} Students)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Student List in this class */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <span className="text-xs font-bold text-slate-700">
            Cohort: <strong className="text-teal-700">{selectedClass?.name}</strong> • {classStudents.length} Students
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200/80 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Student ID & Name</th>
                <th className="py-3 px-4">Gender</th>
                <th className="py-3 px-4">Session</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {classStudents.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{s.firstName} {s.lastName}</div>
                    <span className="font-mono text-[11px] text-teal-700 font-semibold">{s.id}</span>
                  </td>
                  <td className="py-3 px-4 text-slate-600">{s.gender}</td>
                  <td className="py-3 px-4 text-slate-600 font-mono">{s.academicYear}</td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => onOpenSingleReportCard(s.id, term)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-xs font-bold transition-colors"
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5 text-teal-600" />
                      View & Print Report Card
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
