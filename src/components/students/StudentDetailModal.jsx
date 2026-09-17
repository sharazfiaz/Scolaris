import React from 'react';
import { useSchool } from '../../context/SchoolContext';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import {
  User,
  CreditCard,
  FileSpreadsheet,
  Receipt,
  RotateCcw,
  Users,
  Phone,
  Mail,
  Briefcase,
  MapPin,
  Calendar,
  Layers,
  GraduationCap
} from 'lucide-react';

export const StudentDetailModal = ({
  isOpen,
  onClose,
  studentId,
  onOpenIdCard,
  onOpenReportCard,
  onOpenPaymentDesk,
  onOpenReenrollment
}) => {
  const { students, classes, tracks, cycles, studentReceipts } = useSchool();

  const student = students.find(s => s.id === studentId);
  if (!student) return null;

  const currentClass = classes.find(c => c.id === student.classId);
  const currentCycle = cycles.find(c => c.id === currentClass?.cycleId);
  const currentTrack = student.trackId ? tracks.find(t => t.id === student.trackId) : null;
  const siblingStudents = students.filter(s => student.siblings?.includes(s.id));
  const receipts = studentReceipts.filter(r => r.studentId === student.id);

  const feeStatus = student.feeStatus || { totalDue: 0, paid: 0, balance: 0, paymentStatus: 'Unpaid' };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Student Dossier & Academic Profile"
      subtitle={`Student ID: ${student.id} • Academic Year: ${student.academicYear}`}
      maxWidth="max-w-4xl"
    >
      <div className="space-y-6">
        
        {/* Top Header Card */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 bg-gradient-to-r from-slate-900 to-brand-900 text-white rounded-2xl shadow-lg">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-teal-500/20 border-2 border-teal-400 flex items-center justify-center font-black text-2xl text-teal-300">
              {student.firstName.charAt(0)}{student.lastName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold">{student.firstName} {student.lastName}</h3>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-teal-400/20 text-teal-300 border border-teal-400/30">
                  {student.gender}
                </span>
              </div>
              <p className="text-xs text-slate-300 font-mono mt-0.5">
                ID: {student.id} • Registered: {student.registrationDate} ({student.enrollmentType})
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-white/10 text-white border border-white/10">
                  {currentClass?.name || 'Class N/A'}
                </span>
                {currentTrack && (
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-teal-500/30 text-teal-200 border border-teal-400/30">
                    {currentTrack.code} ({currentTrack.name})
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Fee Badge */}
          <div className="text-left sm:text-right bg-white/10 p-3 rounded-xl backdrop-blur-sm border border-white/10">
            <div className="text-[10px] uppercase font-bold text-teal-200">Financial Ledger</div>
            <div className="text-lg font-black text-white">{feeStatus.paid.toLocaleString()} / {feeStatus.totalDue.toLocaleString()} FCFA</div>
            <div className="text-xs text-slate-300">
              {feeStatus.balance > 0 ? (
                <span className="text-amber-300 font-semibold">Remaining: {feeStatus.balance.toLocaleString()} FCFA</span>
              ) : (
                <span className="text-emerald-300 font-semibold">Fully Settled</span>
              )}
            </div>
          </div>
        </div>

        {/* Quick Action Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => { onClose(); onOpenIdCard(student.id); }}
            className="flex items-center gap-2 text-xs font-bold px-3.5 py-2 rounded-xl bg-teal-50 text-teal-800 border border-teal-200 hover:bg-teal-100 transition-colors"
          >
            <CreditCard className="w-4 h-4 text-teal-600" />
            Print School ID Card
          </button>
          
          <button
            onClick={() => { onClose(); onOpenReportCard(student.id); }}
            className="flex items-center gap-2 text-xs font-bold px-3.5 py-2 rounded-xl bg-blue-50 text-blue-800 border border-blue-200 hover:bg-blue-100 transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4 text-blue-600" />
            Generate Report Card
          </button>

          <button
            onClick={() => { onClose(); onOpenPaymentDesk(student.id); }}
            className="flex items-center gap-2 text-xs font-bold px-3.5 py-2 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition-colors"
          >
            <Receipt className="w-4 h-4 text-emerald-600" />
            Collect Fee / Issue Receipt
          </button>

          <button
            onClick={() => { onClose(); onOpenReenrollment(student.id); }}
            className="flex items-center gap-2 text-xs font-bold px-3.5 py-2 rounded-xl bg-purple-50 text-purple-800 border border-purple-200 hover:bg-purple-100 transition-colors"
          >
            <RotateCcw className="w-4 h-4 text-purple-600" />
            Re-enroll Next Term/Year
          </button>
        </div>

        {/* Grid Information Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Identity & Origin */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <User className="w-4 h-4 text-teal-600" />
              Identity & Civil Status
            </h4>
            <div className="text-xs space-y-2 text-slate-700">
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Date of Birth:</span>
                <span className="font-semibold text-slate-900">{student.dateOfBirth}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Place of Birth:</span>
                <span className="font-semibold text-slate-900">{student.placeOfBirth}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Education Cycle:</span>
                <span className="font-semibold text-slate-900">{currentCycle?.name || 'Secondary'}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Enrollment Status:</span>
                <Badge variant={student.status === 'Enrolled' ? 'success' : 'neutral'}>
                  {student.status}
                </Badge>
              </div>
            </div>
          </div>

          {/* Legal Guardians */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <Users className="w-4 h-4 text-teal-600" />
              Guardians & Contacts
            </h4>
            <div className="text-xs space-y-2">
              {student.guardians?.father?.name && (
                <div className="p-2 bg-white rounded-xl border border-slate-200">
                  <div className="font-bold text-slate-800">Father: {student.guardians.father.name}</div>
                  <div className="text-slate-500 flex items-center gap-2 mt-0.5">
                    <span>{student.guardians.father.phone || 'No phone'}</span>
                    {student.guardians.father.profession && <span>• {student.guardians.father.profession}</span>}
                  </div>
                </div>
              )}
              {student.guardians?.mother?.name && (
                <div className="p-2 bg-white rounded-xl border border-slate-200">
                  <div className="font-bold text-slate-800">Mother: {student.guardians.mother.name}</div>
                  <div className="text-slate-500 flex items-center gap-2 mt-0.5">
                    <span>{student.guardians.mother.phone || 'No phone'}</span>
                    {student.guardians.mother.profession && <span>• {student.guardians.mother.profession}</span>}
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Siblings Connection Section */}
        {siblingStudents.length > 0 && (
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2 mb-3">
              <Users className="w-4 h-4 text-teal-600" />
              Linked Siblings in Complex ({siblingStudents.length})
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {siblingStudents.map(sib => (
                <div key={sib.id} className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-xs text-slate-900">{sib.firstName} {sib.lastName}</span>
                    <p className="text-[11px] text-slate-500 font-mono">{sib.id} • {classes.find(c => c.id === sib.classId)?.name}</p>
                  </div>
                  <Badge variant={sib.feeStatus?.balance === 0 ? 'success' : 'warning'} size="sm">
                    {sib.feeStatus?.balance === 0 ? 'Fees Paid' : 'Fees Due'}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Payment History Archive */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2 mb-3">
            <Receipt className="w-4 h-4 text-teal-600" />
            Payment & Receipt History ({receipts.length})
          </h4>
          {receipts.length === 0 ? (
            <p className="text-xs text-slate-500 italic">No payment receipts recorded yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-semibold">
                    <th className="pb-2">Receipt #</th>
                    <th className="pb-2">Date</th>
                    <th className="pb-2">Fee Description</th>
                    <th className="pb-2">Method</th>
                    <th className="pb-2 text-right">Amount</th>
                    <th className="pb-2 text-right">Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {receipts.map(r => (
                    <tr key={r.id} className="text-slate-800 font-medium">
                      <td className="py-2 font-mono text-teal-700 font-bold">{r.id}</td>
                      <td className="py-2">{r.date}</td>
                      <td className="py-2">{r.feeType}</td>
                      <td className="py-2">
                        <span className="px-2 py-0.5 rounded bg-slate-200/60 text-[11px]">{r.paymentMethod}</span>
                      </td>
                      <td className="py-2 text-right font-bold text-slate-900">{r.amount.toLocaleString()} FCFA</td>
                      <td className="py-2 text-right text-slate-500">{r.remainingBalance.toLocaleString()} FCFA</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </Modal>
  );
};
