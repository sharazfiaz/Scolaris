import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { Printer, Calendar, Clock, BookOpen, User, Plus, Edit } from 'lucide-react';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const TIME_SLOTS = [
  '08:00 - 10:00',
  '10:15 - 12:00',
  '14:00 - 16:00',
  '16:00 - 17:30'
];

export const ClassTimetableView = ({ onOpenEditor }) => {
  const { classes, timetables, schoolInfo } = useSchool();
  const [selectedClassId, setSelectedClassId] = useState(classes[0]?.id || '');

  const selectedClass = classes.find(c => c.id === selectedClassId);
  const timetableEntry = timetables.find(t => t.classId === selectedClassId);
  const schedule = timetableEntry?.schedule || [];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 bg-white rounded-2xl border border-slate-200/80 shadow-sm no-print">
        <div>
          <h3 className="text-base font-bold text-slate-900">Class Timetable & Weekly Schedules</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            View and manage weekly timetable slots, teacher allocations, and classroom locations
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="text-xs font-bold rounded-xl border border-slate-300 px-3 py-2 bg-slate-50"
          >
            {classes.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          {onOpenEditor && (
            <button
              onClick={() => onOpenEditor(selectedClassId)}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl border border-slate-300"
            >
              <Edit className="w-3.5 h-3.5" />
              Edit Timetable
            </button>
          )}

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-md"
          >
            <Printer className="w-3.5 h-3.5" />
            Print Timetable
          </button>
        </div>
      </div>

      {/* Timetable Grid Document */}
      <div className="printable-document bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b pb-3 print:border-black">
          <div>
            <h2 className="text-lg font-black text-slate-900 uppercase">
              {schoolInfo.name} — Class Weekly Timetable
            </h2>
            <p className="text-xs text-slate-600">
              Class: <strong>{selectedClass?.name}</strong> • Academic Session: {schoolInfo.currentAcademicYear}
            </p>
          </div>
          <div className="text-right text-xs font-mono font-bold text-teal-800 print:text-black">
            MEPPSA CONGO
          </div>
        </div>

        {/* Schedule Matrix */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs border border-black text-center">
            <thead className="bg-slate-100 font-bold border-b border-black text-black">
              <tr>
                <th className="p-2.5 border-r border-black w-28">Day</th>
                {TIME_SLOTS.map(slot => (
                  <th key={slot} className="p-2.5 border-r border-black">{slot}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-black">
              {DAYS.map(day => (
                <tr key={day} className="h-20">
                  <td className="p-2 border-r border-black font-bold bg-slate-50 print:bg-slate-100 text-slate-900">
                    {day}
                  </td>
                  {TIME_SLOTS.map(slot => {
                    const match = schedule.find(s => s.day === day && s.timeSlot === slot);
                    return (
                      <td key={slot} className="p-2 border-r border-black align-middle font-medium">
                        {match ? (
                          <div className="p-2 bg-teal-50/70 print:bg-slate-100 border border-teal-200 print:border-black rounded-lg text-left space-y-0.5">
                            <div className="font-bold text-teal-950 print:text-black text-[11px]">
                              {match.subjectName}
                            </div>
                            <div className="text-[10px] text-slate-600 print:text-black flex items-center gap-1">
                              <User className="w-2.5 h-2.5" />
                              {match.teacherName}
                            </div>
                            <div className="text-[9px] text-slate-400 print:text-black font-mono">
                              {match.room}
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-300 print:text-slate-400 italic text-[10px]">-</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};
