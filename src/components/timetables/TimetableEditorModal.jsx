import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { Modal } from '../common/Modal';
import { Plus, Trash2, Clock, Calendar, Save } from 'lucide-react';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const TIME_SLOTS = [
  '08:00 - 10:00',
  '10:15 - 12:00',
  '14:00 - 16:00',
  '16:00 - 17:30'
];

export const TimetableEditorModal = ({ isOpen, onClose, classId }) => {
  const { classes, subjects, teachers, classrooms, timetables, updateTimetable } = useSchool();
  const { showSuccess } = useToast();
  const { user } = useAuth();

  const selectedClass = classes.find(c => c.id === classId);
  const timetableEntry = timetables.find(t => t.classId === classId);

  const [schedule, setSchedule] = useState(() => {
    return timetableEntry?.schedule ? JSON.parse(JSON.stringify(timetableEntry.schedule)) : [];
  });

  if (!selectedClass) return null;

  const handleAddSlot = () => {
    setSchedule([
      ...schedule,
      {
        day: 'Monday',
        timeSlot: '08:00 - 10:00',
        subjectId: subjects[0]?.id || '',
        subjectName: subjects[0]?.name || '',
        teacherId: teachers[0]?.id || '',
        teacherName: `${teachers[0]?.firstName} ${teachers[0]?.lastName}`,
        room: selectedClass.roomId ? classrooms.find(r => r.id === selectedClass.roomId)?.name : 'Room 101'
      }
    ]);
  };

  const handleRemoveSlot = (index) => {
    setSchedule(schedule.filter((_, i) => i !== index));
  };

  const handleSlotChange = (index, field, value) => {
    const updated = [...schedule];
    updated[index][field] = value;
    if (field === 'subjectId') {
      const s = subjects.find(sub => sub.id === value);
      updated[index].subjectName = s?.name || '';
    }
    if (field === 'teacherId') {
      const t = teachers.find(tch => tch.id === value);
      updated[index].teacherName = t ? `${t.firstName} ${t.lastName}` : '';
    }
    setSchedule(updated);
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateTimetable(selectedClass.id, schedule, user.name);
    showSuccess(`Timetable updated for ${selectedClass.name} with ${schedule.length} schedule slots.`);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Class Timetable"
      subtitle={`Configure timetable slots for ${selectedClass.name}`}
      maxWidth="max-w-3xl"
    >
      <form onSubmit={handleSave} className="space-y-4">
        
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 uppercase">
            Active Schedule Periods ({schedule.length})
          </span>
          <button
            type="button"
            onClick={handleAddSlot}
            className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg bg-teal-50 text-teal-700 border border-teal-200 hover:bg-teal-100"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Time Slot
          </button>
        </div>

        <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1">
          {schedule.map((slot, index) => (
            <div key={index} className="p-3 bg-slate-50 border border-slate-200 rounded-xl grid grid-cols-1 sm:grid-cols-5 gap-2 items-center text-xs">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Day</label>
                <select
                  value={slot.day}
                  onChange={(e) => handleSlotChange(index, 'day', e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-1.5 bg-white text-xs font-medium"
                >
                  {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Time Slot</label>
                <select
                  value={slot.timeSlot}
                  onChange={(e) => handleSlotChange(index, 'timeSlot', e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-1.5 bg-white text-xs font-medium"
                >
                  {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Subject</label>
                <select
                  value={slot.subjectId}
                  onChange={(e) => handleSlotChange(index, 'subjectId', e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-1.5 bg-white text-xs font-medium"
                >
                  {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Teacher</label>
                <select
                  value={slot.teacherId}
                  onChange={(e) => handleSlotChange(index, 'teacherId', e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-1.5 bg-white text-xs font-medium"
                >
                  {teachers.map(t => <option key={t.id} value={t.id}>{t.firstName} {t.lastName}</option>)}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Room</label>
                  <input
                    type="text"
                    value={slot.room}
                    onChange={(e) => handleSlotChange(index, 'room', e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-1.5 bg-white text-xs"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveSlot(index)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg mt-3"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 rounded-xl"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 text-sm font-bold rounded-xl text-white bg-teal-600 hover:bg-teal-700 shadow-md"
          >
            Save Timetable
          </button>
        </div>

      </form>
    </Modal>
  );
};
