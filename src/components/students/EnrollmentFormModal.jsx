import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { Modal } from '../common/Modal';
import {
  User,
  Users,
  Shield,
  FileText,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Briefcase,
  AlertCircle,
  CheckCircle2,
  Upload
} from 'lucide-react';

export const EnrollmentFormModal = ({ isOpen, onClose, onEnrollSuccess }) => {
  const { classes, classrooms, tracks, feeStructure, enrollStudent, students, schoolInfo } = useSchool();
  const { showSuccess, showWarning } = useToast();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    gender: 'Male',
    dateOfBirth: '2016-01-01',
    placeOfBirth: 'Brazzaville',
    classId: classes[0]?.id || '',
    trackId: '',
    enrollmentType: 'New Enrollment',
    guardians: {
      father: { name: '', phone: '', profession: '', email: '' },
      mother: { name: '', phone: '', profession: '', email: '' },
      emergency: { name: '', phone: '', relation: 'Parent' }
    },
    siblings: [],
    uploadedDocuments: {
      birthCertificate: true,
      previousReportCard: false
    }
  });

  const selectedClass = classes.find(c => c.id === formData.classId);
  const selectedRoom = classrooms.find(r => r.id === selectedClass?.roomId);
  
  // Calculate current headcount of this class
  const classHeadcount = students.filter(s => s.classId === formData.classId && s.status === 'Enrolled').length;
  const maxCapacity = selectedClass?.capacity || selectedRoom?.capacity || 40;
  const isFull = classHeadcount >= maxCapacity;
  const isNearFull = classHeadcount >= maxCapacity - 2;

  // Fee calculation preview
  const cycleFees = feeStructure[selectedClass?.cycleId] || feeStructure.primary;
  const enrollmentFee = cycleFees?.enrollmentFee || 30000;
  const annualTuition = cycleFees?.tuitionAnnual || 225000;
  const totalDue = enrollmentFee + annualTuition;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      showWarning('Please enter both First Name and Last Name.');
      return;
    }

    if (isFull) {
      showWarning(`Cannot enroll: Classroom ${selectedClass?.name} has reached maximum capacity (${maxCapacity} seats).`);
      return;
    }

    const created = enrollStudent(formData, user.name);
    showSuccess(`Student ${created.firstName} ${created.lastName} enrolled successfully with ID: ${created.id}`);
    if (onEnrollSuccess) onEnrollSuccess(created);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="New Student Enrollment"
      subtitle="Enter new student credentials, assign class/track, and generate initial billing"
      maxWidth="max-w-3xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Section 1: Student Identity */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-teal-800 flex items-center gap-2 mb-3">
            <User className="w-4 h-4 text-teal-600" />
            1. Student Personal Identity
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">First Name(s) *</label>
              <input
                type="text"
                required
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                placeholder="e.g. Emmanuel Junior"
                className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Last Name *</label>
              <input
                type="text"
                required
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                placeholder="e.g. Mouanda"
                className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Gender *</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Date of Birth *</label>
              <input
                type="date"
                required
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Place of Birth *</label>
              <input
                type="text"
                required
                value={formData.placeOfBirth}
                onChange={(e) => setFormData({ ...formData, placeOfBirth: e.target.value })}
                placeholder="e.g. Brazzaville (Moungali)"
                className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Class & Track Assignment with Capacity Alert */}
        <div className="pt-4 border-t border-slate-200">
          <h4 className="text-xs font-bold uppercase tracking-wider text-teal-800 flex items-center gap-2 mb-3">
            <Calendar className="w-4 h-4 text-teal-600" />
            2. Class Assignment & Room Capacity Check
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Assigned Class *</label>
              <select
                value={formData.classId}
                onChange={(e) => {
                  const cls = classes.find(c => c.id === e.target.value);
                  setFormData({
                    ...formData,
                    classId: e.target.value,
                    trackId: cls?.trackId || ''
                  });
                }}
                className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 font-medium"
              >
                {classes.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.cycleId.replace('_', ' ').toUpperCase()})
                  </option>
                ))}
              </select>
            </div>

            {/* If Upper Secondary, Track Selection */}
            {selectedClass?.cycleId === 'upper_secondary' ? (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Specialization Track *</label>
                <select
                  value={formData.trackId}
                  onChange={(e) => setFormData({ ...formData, trackId: e.target.value })}
                  className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 font-medium"
                >
                  <option value="">Select a Track...</option>
                  {tracks.map(t => (
                    <option key={t.id} value={t.id}>{t.code} — {t.name}</option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="flex items-center text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-200">
                General Curriculum (No Track required for this cycle)
              </div>
            )}
          </div>

          {/* Real-time Room Capacity Indicator */}
          <div className="mt-3 p-3 rounded-xl border flex items-center justify-between gap-3 bg-slate-50 border-slate-200">
            <div>
              <span className="text-xs font-semibold text-slate-700">Classroom Occupancy: </span>
              <span className="text-xs font-bold text-slate-900">{classHeadcount} / {maxCapacity} students</span>
              <span className="text-xs text-slate-500 ml-1">({maxCapacity - classHeadcount} available seats)</span>
            </div>
            {isFull ? (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 bg-rose-100 px-2.5 py-1 rounded-full">
                <AlertCircle className="w-3.5 h-3.5" /> Class Full
              </span>
            ) : isNearFull ? (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full">
                <AlertCircle className="w-3.5 h-3.5" /> Nearing Capacity
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5" /> Seat Available
              </span>
            )}
          </div>
        </div>

        {/* Section 3: Legal Guardians & Contact */}
        <div className="pt-4 border-t border-slate-200">
          <h4 className="text-xs font-bold uppercase tracking-wider text-teal-800 flex items-center gap-2 mb-3">
            <Users className="w-4 h-4 text-teal-600" />
            3. Legal Guardians & Contact Details
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Father / Guardian 1 */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
              <span className="text-xs font-bold text-slate-800">Father / Primary Guardian</span>
              <input
                type="text"
                placeholder="Full Name"
                value={formData.guardians.father.name}
                onChange={(e) => setFormData({
                  ...formData,
                  guardians: { ...formData.guardians, father: { ...formData.guardians.father, name: e.target.value } }
                })}
                className="w-full text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white"
              />
              <input
                type="text"
                placeholder="Phone (e.g. +242 06 600 00 00)"
                value={formData.guardians.father.phone}
                onChange={(e) => setFormData({
                  ...formData,
                  guardians: { ...formData.guardians, father: { ...formData.guardians.father, phone: e.target.value } }
                })}
                className="w-full text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white"
              />
              <input
                type="text"
                placeholder="Profession"
                value={formData.guardians.father.profession}
                onChange={(e) => setFormData({
                  ...formData,
                  guardians: { ...formData.guardians, father: { ...formData.guardians.father, profession: e.target.value } }
                })}
                className="w-full text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white"
              />
            </div>

            {/* Mother / Guardian 2 */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
              <span className="text-xs font-bold text-slate-800">Mother / Secondary Guardian</span>
              <input
                type="text"
                placeholder="Full Name"
                value={formData.guardians.mother.name}
                onChange={(e) => setFormData({
                  ...formData,
                  guardians: { ...formData.guardians, mother: { ...formData.guardians.mother, name: e.target.value } }
                })}
                className="w-full text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white"
              />
              <input
                type="text"
                placeholder="Phone"
                value={formData.guardians.mother.phone}
                onChange={(e) => setFormData({
                  ...formData,
                  guardians: { ...formData.guardians, mother: { ...formData.guardians.mother, phone: e.target.value } }
                })}
                className="w-full text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white"
              />
              <input
                type="text"
                placeholder="Profession"
                value={formData.guardians.mother.profession}
                onChange={(e) => setFormData({
                  ...formData,
                  guardians: { ...formData.guardians, mother: { ...formData.guardians.mother, profession: e.target.value } }
                })}
                className="w-full text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Billing Preview */}
        <div className="p-4 bg-teal-50/70 border border-teal-200 rounded-xl flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-teal-900">Automatic Billing & Invoice Preview</div>
            <div className="text-xs text-teal-700 mt-0.5">
              Registration Fee: <strong>{enrollmentFee.toLocaleString()} FCFA</strong> + Annual Tuition: <strong>{annualTuition.toLocaleString()} FCFA</strong>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[11px] uppercase font-bold text-teal-800">Total Initial Due</div>
            <div className="text-lg font-black text-brand-900">{totalDue.toLocaleString()} FCFA</div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isFull}
            className={`px-5 py-2.5 text-sm font-bold rounded-xl text-white shadow-lg transition-all ${
              isFull
                ? 'bg-slate-400 cursor-not-allowed'
                : 'bg-teal-600 hover:bg-teal-700 shadow-teal-900/20 active:scale-[0.98]'
            }`}
          >
            Complete Enrollment & Issue ID
          </button>
        </div>

      </form>
    </Modal>
  );
};
