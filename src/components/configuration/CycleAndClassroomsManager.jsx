import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { Modal } from '../common/Modal';
import { Plus, Edit, Trash2, Building, Layers, Users } from 'lucide-react';

export const CycleAndClassroomsManager = () => {
  const { classes, classrooms, cycles, tracks, teachers, addClass, updateClass, addClassroom, updateClassroom } = useSchool();
  const { showSuccess, showWarning } = useToast();
  const { user } = useAuth();

  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [classToEdit, setClassToEdit] = useState(null);

  const [classFormData, setClassFormData] = useState({
    name: '',
    cycleId: 'lower_secondary',
    levelId: 'sec_6th',
    roomId: classrooms[0]?.id || '',
    trackId: '',
    capacity: 40,
    homeroomTeacherId: ''
  });

  const handleOpenAddClass = () => {
    setClassToEdit(null);
    setClassFormData({
      name: '',
      cycleId: 'lower_secondary',
      levelId: 'sec_6th',
      roomId: classrooms[0]?.id || '',
      trackId: '',
      capacity: 40,
      homeroomTeacherId: ''
    });
    setIsClassModalOpen(true);
  };

  const handleOpenEditClass = (cls) => {
    setClassToEdit(cls);
    setClassFormData({
      name: cls.name,
      cycleId: cls.cycleId,
      levelId: cls.levelId,
      roomId: cls.roomId || classrooms[0]?.id || '',
      trackId: cls.trackId || '',
      capacity: cls.capacity || 40,
      homeroomTeacherId: cls.homeroomTeacherId || ''
    });
    setIsClassModalOpen(true);
  };

  const handleSaveClass = (e) => {
    e.preventDefault();
    if (!classFormData.name.trim()) {
      showWarning('Please enter a class name.');
      return;
    }

    if (classToEdit) {
      updateClass(classToEdit.id, classFormData, user.name);
      showSuccess(`Class cohort ${classFormData.name} updated.`);
    } else {
      addClass(classFormData, user.name);
      showSuccess(`Class cohort ${classFormData.name} added.`);
    }
    setIsClassModalOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">Classroom Cohorts & Physical Capacity</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure school classes, assign physical rooms, and set maximum student capacities
          </p>
        </div>

        <button
          onClick={handleOpenAddClass}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-md"
        >
          <Plus className="w-4 h-4" />
          Add Class Cohort
        </button>
      </div>

      {/* Classes Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200/80 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Class Name</th>
                <th className="py-3 px-4">Education Cycle</th>
                <th className="py-3 px-4">Physical Room</th>
                <th className="py-3 px-4">Track (If Upper Sec)</th>
                <th className="py-3 px-4 text-center">Max Capacity</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {classes.map(c => {
                const room = classrooms.find(r => r.id === c.roomId);
                const trk = tracks.find(t => t.id === c.trackId);
                const cycle = cycles.find(cy => cy.id === c.cycleId);

                return (
                  <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">{c.name}</td>
                    <td className="py-3.5 px-4 text-slate-600 font-medium">{cycle?.name || c.cycleId}</td>
                    <td className="py-3.5 px-4 text-slate-600 font-mono text-[11px]">{room?.name || 'Unassigned'}</td>
                    <td className="py-3.5 px-4">
                      {trk ? (
                        <span className="text-[10px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                          {trk.code}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[10px]">-</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-900">
                      {c.capacity || 40} seats
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => handleOpenEditClass(c)}
                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Class Modal */}
      {isClassModalOpen && (
        <Modal
          isOpen={isClassModalOpen}
          onClose={() => setIsClassModalOpen(false)}
          title={classToEdit ? 'Edit Class Cohort' : 'Add Class Cohort'}
          subtitle="Configure cohort name, assigned education cycle, physical room and capacity"
          maxWidth="max-w-xl"
        >
          <form onSubmit={handleSaveClass} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Class Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. 6th Grade C (6ème C)"
                value={classFormData.name}
                onChange={(e) => setClassFormData({ ...classFormData, name: e.target.value })}
                className="w-full text-xs font-bold border border-slate-300 rounded-xl px-3 py-2"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Education Cycle *</label>
                <select
                  value={classFormData.cycleId}
                  onChange={(e) => setClassFormData({ ...classFormData, cycleId: e.target.value })}
                  className="w-full text-xs font-semibold border border-slate-300 rounded-xl px-3 py-2 bg-white"
                >
                  {cycles.map(cy => <option key={cy.id} value={cy.id}>{cy.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Assigned Room *</label>
                <select
                  value={classFormData.roomId}
                  onChange={(e) => setClassFormData({ ...classFormData, roomId: e.target.value })}
                  className="w-full text-xs font-semibold border border-slate-300 rounded-xl px-3 py-2 bg-white"
                >
                  {classrooms.map(r => (
                    <option key={r.id} value={r.id}>{r.name} (Cap: {r.capacity})</option>
                  ))}
                </select>
              </div>
            </div>

            {classFormData.cycleId === 'upper_secondary' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Specialization Track</label>
                <select
                  value={classFormData.trackId}
                  onChange={(e) => setClassFormData({ ...classFormData, trackId: e.target.value })}
                  className="w-full text-xs font-semibold border border-slate-300 rounded-xl px-3 py-2 bg-white"
                >
                  <option value="">General (No Track)</option>
                  {tracks.map(t => <option key={t.id} value={t.id}>{t.code} — {t.name}</option>)}
                </select>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Maximum Student Capacity (Seats) *</label>
              <input
                type="number"
                min="10"
                max="80"
                value={classFormData.capacity}
                onChange={(e) => setClassFormData({ ...classFormData, capacity: Number(e.target.value) })}
                className="w-full text-xs font-mono font-bold border border-slate-300 rounded-xl px-3 py-2"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setIsClassModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold rounded-xl text-white bg-teal-600 hover:bg-teal-700 shadow-md"
              >
                Save Class
              </button>
            </div>
          </form>
        </Modal>
      )}

    </div>
  );
};
