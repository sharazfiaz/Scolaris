import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { Modal } from '../common/Modal';
import { User, Phone, Mail, GraduationCap, DollarSign, Clock } from 'lucide-react';

export const TeacherFormModal = ({ isOpen, onClose, teacherToEdit = null }) => {
  const { cycles, subjects, classes, addTeacher, updateTeacher } = useSchool();
  const { showSuccess, showWarning } = useToast();
  const { user } = useAuth();

  const [formData, setFormData] = useState(() => {
    if (teacherToEdit) {
      return { ...teacherToEdit };
    }
    return {
      firstName: '',
      lastName: '',
      gender: 'Male',
      phone: '',
      email: '',
      cycles: ['lower_secondary', 'upper_secondary'],
      payType: 'hourly', // 'fixed' (preschool/primary) or 'hourly' (secondary)
      monthlySalary: 210000,
      hourlyRate: 4500,
      subjects: ['subj_math'],
      homeroomClassId: '',
      hireDate: '2026-09-01'
    };
  });

  const handleCycleToggle = (cycleId) => {
    const exists = formData.cycles.includes(cycleId);
    let updated;
    if (exists) {
      updated = formData.cycles.filter(c => c !== cycleId);
    } else {
      updated = [...formData.cycles, cycleId];
    }
    
    // Auto-adjust payType recommendation
    const hasPrimaryOrPreschoolOnly = updated.every(c => c === 'preschool' || c === 'primary');
    setFormData({
      ...formData,
      cycles: updated,
      payType: hasPrimaryOrPreschoolOnly ? 'fixed' : 'hourly'
    });
  };

  const handleSubjectToggle = (subjId) => {
    const exists = formData.subjects?.includes(subjId);
    let updated;
    if (exists) {
      updated = formData.subjects.filter(s => s !== subjId);
    } else {
      updated = [...(formData.subjects || []), subjId];
    }
    setFormData({ ...formData, subjects: updated });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      showWarning('Please enter first and last name.');
      return;
    }

    if (teacherToEdit) {
      updateTeacher(teacherToEdit.id, formData, user.name);
      showSuccess(`Teacher profile for ${formData.firstName} ${formData.lastName} updated.`);
    } else {
      addTeacher(formData, user.name);
      showSuccess(`Teacher ${formData.firstName} ${formData.lastName} created.`);
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={teacherToEdit ? 'Edit Teacher Profile' : 'Add New Teacher Profile'}
      subtitle="Register teacher credentials, teaching cycles, and cycle-specific compensation model"
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* Personal Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">First Name *</label>
            <input
              type="text"
              required
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              placeholder="e.g. Dieudonné"
              className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Last Name *</label>
            <input
              type="text"
              required
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              placeholder="e.g. Kouassi"
              className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Gender</label>
            <select
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+242 06 600 00 00"
              className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2"
            />
          </div>
        </div>

        {/* Cycles of Activity */}
        <div className="pt-3 border-t border-slate-200">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            Cycles of Activity *
          </label>
          <div className="grid grid-cols-2 gap-2">
            {cycles.map(c => {
              const isChecked = formData.cycles.includes(c.id);
              return (
                <label
                  key={c.id}
                  className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-semibold cursor-pointer transition-colors ${
                    isChecked ? 'bg-teal-50 border-teal-300 text-teal-900' : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleCycleToggle(c.id)}
                    className="rounded text-teal-600 focus:ring-teal-500"
                  />
                  {c.name}
                </label>
              );
            })}
          </div>
        </div>

        {/* Compensation Structure (Strictly tied to Cycle per Congo framework) */}
        <div className="pt-3 border-t border-slate-200">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            Compensation Model (Congolese Framework)
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <label className={`p-3 rounded-xl border cursor-pointer text-xs ${
              formData.payType === 'fixed' ? 'bg-teal-50 border-teal-500 ring-2 ring-teal-500/20' : 'border-slate-200 bg-slate-50'
            }`}>
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <input
                  type="radio"
                  name="payType"
                  value="fixed"
                  checked={formData.payType === 'fixed'}
                  onChange={() => setFormData({ ...formData, payType: 'fixed' })}
                  className="text-teal-600"
                />
                Fixed Monthly Salary
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Preschool & Primary homeroom teachers (fixed monthly sum regardless of hours).
              </p>
            </label>

            <label className={`p-3 rounded-xl border cursor-pointer text-xs ${
              formData.payType === 'hourly' ? 'bg-teal-50 border-teal-500 ring-2 ring-teal-500/20' : 'border-slate-200 bg-slate-50'
            }`}>
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <input
                  type="radio"
                  name="payType"
                  value="hourly"
                  checked={formData.payType === 'hourly'}
                  onChange={() => setFormData({ ...formData, payType: 'hourly' })}
                  className="text-teal-600"
                />
                Hourly Pay (Hours × Rate)
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Lower & Upper Secondary: strictly hours worked × agreed rate (no lump sums).
              </p>
            </label>
          </div>

          {formData.payType === 'fixed' ? (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Fixed Monthly Salary (FCFA) *</label>
              <input
                type="number"
                value={formData.monthlySalary}
                onChange={(e) => setFormData({ ...formData, monthlySalary: Number(e.target.value) })}
                className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2 font-bold"
              />
            </div>
          ) : (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Configured Hourly Rate (FCFA / Hour) *</label>
              <input
                type="number"
                value={formData.hourlyRate}
                onChange={(e) => setFormData({ ...formData, hourlyRate: Number(e.target.value) })}
                className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2 font-bold"
              />
            </div>
          )}
        </div>

        {/* Action Buttons */}
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
            {teacherToEdit ? 'Save Profile Changes' : 'Create Teacher'}
          </button>
        </div>

      </form>
    </Modal>
  );
};
