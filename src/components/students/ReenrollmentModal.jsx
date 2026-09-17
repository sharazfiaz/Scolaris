import React, { useState, useMemo } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { Modal } from '../common/Modal';
import {
  Search,
  UserCheck,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  Calendar,
  Layers,
  AlertCircle
} from 'lucide-react';

export const ReenrollmentModal = ({ isOpen, onClose, defaultStudentId = null, onReenrollSuccess }) => {
  const { students, classes, tracks, feeStructure, reenrollStudent, schoolInfo, classrooms } = useSchool();
  const { showSuccess, showWarning } = useToast();
  const { user } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState(defaultStudentId || '');
  const [targetClassId, setTargetClassId] = useState('');
  const [targetTrackId, setTargetTrackId] = useState('');
  const [promotionMode, setPromotionMode] = useState('promoted'); // 'promoted' or 'repeat'

  // Filter students for search dropdown
  const filteredStudents = useMemo(() => {
    if (!searchQuery.trim()) return students.slice(0, 10);
    const q = searchQuery.toLowerCase();
    return students.filter(
      s => s.id.toLowerCase().includes(q) ||
           s.firstName.toLowerCase().includes(q) ||
           s.lastName.toLowerCase().includes(q)
    );
  }, [students, searchQuery]);

  const selectedStudent = students.find(s => s.id === selectedStudentId);
  const currentClass = classes.find(c => c.id === selectedStudent?.classId);

  // Determine smart next class recommendation
  const proposedClass = useMemo(() => {
    if (!currentClass) return null;
    const currentIndex = classes.findIndex(c => c.id === currentClass.id);
    if (currentIndex >= 0 && currentIndex < classes.length - 1) {
      return classes[currentIndex + 1];
    }
    return currentClass;
  }, [currentClass, classes]);

  // Set default target class when student is chosen
  const handleSelectStudent = (sId) => {
    setSelectedStudentId(sId);
    const std = students.find(s => s.id === sId);
    const currCls = classes.find(c => c.id === std?.classId);
    const cIndex = classes.findIndex(c => c.id === currCls?.id);
    const nextCls = (cIndex >= 0 && cIndex < classes.length - 1) ? classes[cIndex + 1] : currCls;
    
    setTargetClassId(nextCls?.id || classes[0]?.id || '');
    setTargetTrackId(std?.trackId || nextCls?.trackId || '');
  };

  const targetClass = classes.find(c => c.id === targetClassId);
  const targetRoom = classrooms.find(r => r.id === targetClass?.roomId);
  const classHeadcount = students.filter(s => s.classId === targetClassId && s.status === 'Enrolled').length;
  const maxCapacity = targetClass?.capacity || targetRoom?.capacity || 40;
  const isFull = classHeadcount >= maxCapacity;

  // Re-enrollment fee preview
  const cycleFees = feeStructure[targetClass?.cycleId] || feeStructure.primary;
  const reenrollFee = cycleFees?.reenrollmentFee || 20000;
  const annualTuition = cycleFees?.tuitionAnnual || 225000;
  const totalDue = reenrollFee + annualTuition;

  const handleReenroll = (e) => {
    e.preventDefault();
    if (!selectedStudentId) {
      showWarning('Please select a student to re-enroll.');
      return;
    }
    if (!targetClassId) {
      showWarning('Please assign a destination class.');
      return;
    }

    const updated = reenrollStudent(selectedStudentId, targetClassId, targetTrackId, user.name);
    showSuccess(`Student ${updated.firstName} ${updated.lastName} successfully re-enrolled into ${targetClass?.name} for ${schoolInfo.currentAcademicYear}!`);
    if (onReenrollSuccess) onReenrollSuccess(updated);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Rapid Student Re-enrollment"
      subtitle="Re-enroll returning students, process automatic promotion, and generate academic year ID card"
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleReenroll} className="space-y-5">
        
        {/* Step 1: Find Returning Student */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            1. Search Returning Student (By Name or ID)
          </label>
          
          <div className="relative mb-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Type student name or ID (e.g. ES-2026-00101)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-sm border border-slate-300 rounded-xl pl-9 pr-3 py-2 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            />
          </div>

          <div className="max-h-36 overflow-y-auto border border-slate-200 rounded-xl divide-y divide-slate-100 bg-white">
            {filteredStudents.map(s => {
              const isSelected = s.id === selectedStudentId;
              const sClass = classes.find(c => c.id === s.classId);
              return (
                <button
                  type="button"
                  key={s.id}
                  onClick={() => handleSelectStudent(s.id)}
                  className={`w-full px-3 py-2 text-left flex items-center justify-between text-xs transition-colors ${
                    isSelected ? 'bg-teal-50 font-bold text-teal-900' : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div>
                    <span className="font-semibold">{s.firstName} {s.lastName}</span>
                    <span className="text-slate-400 ml-2 font-mono text-[11px]">{s.id}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px]">
                      {sClass?.name || 'Class N/A'}
                    </span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-teal-600" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Student Context Card */}
        {selectedStudent && (
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500">Student Profile:</span>
                <h4 className="font-bold text-sm text-slate-900">
                  {selectedStudent.firstName} {selectedStudent.lastName}
                </h4>
                <p className="text-xs text-slate-500 font-mono">
                  ID: {selectedStudent.id} • DOB: {selectedStudent.dateOfBirth}
                </p>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-100 text-blue-800">
                Current Class: {currentClass?.name}
              </span>
            </div>

            {/* Promotion or Repeat Option */}
            <div className="pt-2 border-t border-slate-200 flex items-center gap-4">
              <label className="text-xs font-semibold text-slate-700">Academic Decision:</label>
              <div className="flex items-center gap-3 text-xs">
                <label className="flex items-center gap-1.5 cursor-pointer font-medium text-teal-800">
                  <input
                    type="radio"
                    name="promo"
                    checked={promotionMode === 'promoted'}
                    onChange={() => {
                      setPromotionMode('promoted');
                      if (proposedClass) setTargetClassId(proposedClass.id);
                    }}
                    className="text-teal-600 focus:ring-teal-500"
                  />
                  Promoted to Next Level
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer font-medium text-amber-800">
                  <input
                    type="radio"
                    name="promo"
                    checked={promotionMode === 'repeat'}
                    onChange={() => {
                      setPromotionMode('repeat');
                      if (currentClass) setTargetClassId(currentClass.id);
                    }}
                    className="text-teal-600 focus:ring-teal-500"
                  />
                  Grade Repetition (Redoublement)
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Target Class & Track Selection */}
        {selectedStudent && (
          <div className="pt-3 border-t border-slate-200">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              2. New School Year ({schoolInfo.currentAcademicYear}) Assignment
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Target Class *</label>
                <select
                  value={targetClassId}
                  onChange={(e) => {
                    const cls = classes.find(c => c.id === e.target.value);
                    setTargetClassId(e.target.value);
                    if (cls?.trackId) setTargetTrackId(cls.trackId);
                  }}
                  className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2 font-medium"
                >
                  {classes.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.cycleId.replace('_', ' ').toUpperCase()})
                    </option>
                  ))}
                </select>
              </div>

              {targetClass?.cycleId === 'upper_secondary' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">High School Track *</label>
                  <select
                    value={targetTrackId}
                    onChange={(e) => setTargetTrackId(e.target.value)}
                    className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2 font-medium"
                  >
                    <option value="">Select Track...</option>
                    {tracks.map(t => (
                      <option key={t.id} value={t.id}>{t.code} — {t.name}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Re-enrollment Billing Preview */}
            <div className="mt-4 p-3 bg-teal-50 border border-teal-200 rounded-xl flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-teal-900">Re-enrollment Fee: </span>
                <span className="text-teal-700">{reenrollFee.toLocaleString()} FCFA (Reduced fee for returning students)</span>
              </div>
              <div>
                <span className="font-bold text-teal-900">Annual Tuition: </span>
                <span className="text-brand-900 font-extrabold">{annualTuition.toLocaleString()} FCFA</span>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!selectedStudentId || isFull}
            className={`px-5 py-2.5 text-sm font-bold rounded-xl text-white shadow-lg transition-all ${
              !selectedStudentId || isFull
                ? 'bg-slate-400 cursor-not-allowed'
                : 'bg-teal-600 hover:bg-teal-700 shadow-teal-900/20 active:scale-[0.98]'
            }`}
          >
            Confirm Re-enrollment & Issue Card
          </button>
        </div>

      </form>
    </Modal>
  );
};
