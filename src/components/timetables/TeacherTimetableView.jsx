import React, { useState, useMemo } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { useAuth } from '../../context/AuthContext';
import { Printer, Calendar, User, Clock, BookOpen } from 'lucide-react';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const TIME_SLOTS = [
  '08:00 - 10:00',
  '10:15 - 12:00',
  '14:00 - 16:00',
  '16:00 - 17:30'
];

export const TeacherTimetableView = ({ defaultTeacherId = null }) => {
  const { teachers, timetables, schoolInfo } = useSchool();
  const { activeTeacherId } = useAuth();
  
  const [selectedTeacherId, setSelectedTeacherId] = useState(defaultTeacherId || activeTeacherId || teachers[0]?.id || '');

  const teacher = teachers.find(t => t.id === selectedTeacherId);

  // Aggregate all schedule slots across all classes for this teacher
  const teacherSchedule = useMemo(() => {
    const slots = [];
    timetables.forEach(tEntry => {
      (tEntry.schedule || []).forEach(slot => {
        if (slot.teacherId === selectedTeacherId) {
          slots.push({
            ...slot,
            className: tEntry.className
          });
        }
      });
    });
    return slots;
  }, [timetables, selectedTeacherId]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 bg-white rounded-2xl border border-slate-200/80 shadow-sm no-print">
        <div>
          <h3 className="text-base font-bold text-slate-900">Teacher Consolidated Schedule</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Consolidated weekly timetable across all assigned classes and subject groups
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedTeacherId}
            onChange={(e) => setSelectedTeacherId(e.target.value)}
            className="text-xs font-bold rounded-xl border border-slate-300 px-3 py-2 bg-slate-50"
          >
            {teachers.map(t => (
              <option key={t.id} value={t.id}>
                {t.firstName} {t.lastName} ({t.payType === 'fixed' ? 'Primary' : 'Secondary'})
              </option>
            ))}
          </select>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-md"
          >
            <Printer className="w-3.5 h-3.5" />
            Print Teacher Schedule
          </button>
        </div>
      </div>

      {/* Printable Schedule */}
      <div className="printable-document bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b pb-3 print:border-black">
          <div>
            <h2 className="text-lg font-black text-slate-900 uppercase">
              {schoolInfo.name} — Instructor Master Timetable
            </h2>
            <p className="text-xs text-slate-600">
              Instructor: <strong>{teacher?.firstName} {teacher?.lastName}</strong> ({teacher?.id}) • Session: {schoolInfo.currentAcademicYear}
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
                    const match = teacherSchedule.find(s => s.day === day && s.timeSlot === slot);
                    return (
                      <td key={slot} className="p-2 border-r border-black align-middle font-medium">
                        {match ? (
                          <div className="p-2 bg-blue-50/80 print:bg-slate-100 border border-blue-200 print:border-black rounded-lg text-left space-y-0.5">
                            <div className="font-bold text-blue-950 print:text-black text-[11px]">
                              {match.subjectName}
                            </div>
                            <div className="text-[10px] text-teal-800 print:text-black font-semibold">
                              Class: {match.className}
                            </div>
                            <div className="text-[9px] text-slate-500 print:text-black font-mono">
                              Room: {match.room}
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
