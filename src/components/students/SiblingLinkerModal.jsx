import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { useToast } from '../../context/ToastContext';
import { Modal } from '../common/Modal';
import { Users2, Link2, CheckCircle2, User } from 'lucide-react';

export const SiblingLinkerModal = ({ isOpen, onClose, primaryStudentId = null }) => {
  const { students, classes, linkSiblings } = useSchool();
  const { showSuccess, showWarning } = useToast();

  const [studentAId, setStudentAId] = useState(primaryStudentId || students[0]?.id || '');
  const [studentBId, setStudentBId] = useState('');

  const studentA = students.find(s => s.id === studentAId);
  const studentB = students.find(s => s.id === studentBId);

  const handleLink = (e) => {
    e.preventDefault();
    if (!studentAId || !studentBId) {
      showWarning('Please select two students to link as siblings.');
      return;
    }
    if (studentAId === studentBId) {
      showWarning('Cannot link a student to themselves.');
      return;
    }

    linkSiblings(studentAId, studentBId);
    showSuccess(`Linked ${studentA?.firstName} ${studentA?.lastName} and ${studentB?.firstName} ${studentB?.lastName} as siblings!`);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Link Sibling Records"
      subtitle="Connect brothers and sisters enrolled in the complex for group tracking and family billing"
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleLink} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">First Student *</label>
          <select
            value={studentAId}
            onChange={(e) => setStudentAId(e.target.value)}
            className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2 bg-white"
          >
            {students.map(s => {
              const cls = classes.find(c => c.id === s.classId);
              return (
                <option key={s.id} value={s.id}>
                  {s.firstName} {s.lastName} ({s.id} - {cls?.name})
                </option>
              );
            })}
          </select>
        </div>

        <div className="flex justify-center my-2">
          <div className="p-2 rounded-full bg-teal-50 text-teal-600 border border-teal-200">
            <Link2 className="w-5 h-5" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Second Student (Sibling) *</label>
          <select
            value={studentBId}
            onChange={(e) => setStudentBId(e.target.value)}
            className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2 bg-white"
          >
            <option value="">Select sibling student...</option>
            {students.filter(s => s.id !== studentAId).map(s => {
              const cls = classes.find(c => c.id === s.classId);
              return (
                <option key={s.id} value={s.id}>
                  {s.firstName} {s.lastName} ({s.id} - {cls?.name})
                </option>
              );
            })}
          </select>
        </div>

        {studentA && studentB && (
          <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl text-xs text-teal-800">
            <div className="font-bold flex items-center gap-1.5 mb-1">
              <CheckCircle2 className="w-4 h-4 text-teal-600" />
              Family Group Summary:
            </div>
            <p>
              • {studentA.firstName} {studentA.lastName} ({classes.find(c => c.id === studentA.classId)?.name})
            </p>
            <p>
              • {studentB.firstName} {studentB.lastName} ({classes.find(c => c.id === studentB.classId)?.name})
            </p>
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
            disabled={!studentBId}
            className="px-5 py-2.5 text-sm font-bold rounded-xl text-white bg-teal-600 hover:bg-teal-700 shadow-md disabled:bg-slate-400"
          >
            Confirm Sibling Connection
          </button>
        </div>
      </form>
    </Modal>
  );
};
