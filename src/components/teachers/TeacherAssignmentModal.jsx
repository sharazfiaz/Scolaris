import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { Modal } from '../common/Modal';
import { Plus, Trash2, Clock, BookOpen, Layers, CheckCircle2 } from 'lucide-react';

export const TeacherAssignmentModal = ({ isOpen, onClose, teacherId }) => {
  const { teachers, classes, subjects, updateTeacherAssignments, updateClass, schoolInfo } = useSchool();
  const { showSuccess, showWarning } = useToast();
  const { user } = useAuth();

  const teacher = teachers.find(t => t.id === teacherId);
  
  const [assignments, setAssignments] = useState(() => {
    return teacher?.assignments ? JSON.parse(JSON.stringify(teacher.assignments)) : [];
  });

  const [homeroomClassId, setHomeroomClassId] = useState(teacher?.homeroomClassId || '');

  if (!teacher) return null;

  const isPrimaryOrPreschool = teacher.payType === 'fixed';

  const handleAddRow = () => {
    setAssignments([
      ...assignments,
      {
        classId: classes[0]?.id || '',
        subjectId: subjects[0]?.id || '',
        weeklyHours: 4
      }
    ]);
  };

  const handleRemoveRow = (index) => {
    setAssignments(assignments.filter((_, i) => i !== index));
  };

  const handleUpdateRow = (index, field, value) => {
    const updated = [...assignments];
    updated[index][field] = field === 'weeklyHours' ? Number(value) : value;
    setAssignments(updated);
  };

  const totalWeeklyHours = assignments.reduce((sum, a) => sum + (Number(a.weeklyHours) || 0), 0);

  const handleSave = (e) => {
    e.preventDefault();
    updateTeacherAssignments(teacher.id, assignments, user.name);

    if (isPrimaryOrPreschool && homeroomClassId) {
      updateClass(homeroomClassId, { homeroomTeacherId: teacher.id });
    }

    showSuccess(`Class assignments and workload updated for ${teacher.firstName} ${teacher.lastName}.`);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Class & Hours Assignment"
      subtitle={`Teacher: ${teacher.firstName} ${teacher.lastName} (${teacher.payType === 'fixed' ? 'Preschool/Primary Homeroom' : 'Secondary Hourly Workload'})`}
      maxWidth="max-w-3xl"
    >
      <form onSubmit={handleSave} className="space-y-5">
        
        {isPrimaryOrPreschool ? (
          /* Primary/Preschool Homeroom Teacher Model */
          <div className="p-4 bg-teal-50 border border-teal-200 rounded-xl space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-teal-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-teal-700" />
              Primary / Preschool Homeroom Assignment
            </h4>
            <p className="text-xs text-teal-800">
              In Congolese primary & preschool education, the teacher is assigned as homeroom teacher to a whole class (teaching all core disciplines without hourly breakdown).
            </p>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Assigned Homeroom Class *</label>
              <select
                value={homeroomClassId}
                onChange={(e) => setHomeroomClassId(e.target.value)}
                className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2 bg-white font-medium"
              >
                <option value="">Select Homeroom Class...</option>
                {classes.filter(c => c.cycleId === 'preschool' || c.cycleId === 'primary').map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.cycleId.toUpperCase()})
                  </option>
                ))}
              </select>
            </div>
          </div>
        ) : (
          /* Secondary Multi-class & Hourly Workload Model */
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-teal-600" />
                  Secondary Teaching Workload (Teacher × Class × Subject × Hours)
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Secondary teachers often work across multiple classes & institutions.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddRow}
                className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg bg-teal-50 text-teal-700 border border-teal-200 hover:bg-teal-100"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Assignment
              </button>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
              {assignments.map((row, index) => (
                <div key={index} className="p-3 bg-slate-50/50 flex flex-col sm:flex-row items-center gap-3">
                  <div className="flex-1 w-full">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Class</label>
                    <select
                      value={row.classId}
                      onChange={(e) => handleUpdateRow(index, 'classId', e.target.value)}
                      className="w-full text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white"
                    >
                      {classes.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex-1 w-full">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Subject</label>
                    <select
                      value={row.subjectId}
                      onChange={(e) => handleUpdateRow(index, 'subjectId', e.target.value)}
                      className="w-full text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white"
                    >
                      {subjects.map(s => (
                        <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                      ))}
                    </select>
                  </div>

                  <div className="w-full sm:w-28">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Weekly Hours</label>
                    <input
                      type="number"
                      min="1"
                      max="30"
                      value={row.weeklyHours}
                      onChange={(e) => handleUpdateRow(index, 'weeklyHours', e.target.value)}
                      className="w-full text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white font-bold"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveRow(index)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 mt-4 sm:mt-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Total Workload Summary */}
            <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl flex items-center justify-between text-xs">
              <div>
                <span className="font-semibold text-teal-900">Total Weekly Workload: </span>
                <strong className="text-teal-950 font-black">{totalWeeklyHours} Hours / Week</strong>
                <span className="text-teal-700 ml-2">({totalWeeklyHours * 4} Hours / Month)</span>
              </div>
              <div>
                <span className="text-teal-900 font-semibold">Configured Rate: </span>
                <strong className="text-brand-900 font-bold">{teacher.hourlyRate?.toLocaleString()} FCFA/hr</strong>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-3">
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
            Save Assignments
          </button>
        </div>

      </form>
    </Modal>
  );
};
