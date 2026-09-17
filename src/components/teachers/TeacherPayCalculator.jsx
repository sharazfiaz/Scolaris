import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { Modal } from '../common/Modal';
import { Calculator, DollarSign, Clock, CheckCircle2, Receipt } from 'lucide-react';

export const TeacherPayCalculator = ({ isOpen, onClose, teacherId, onPaymentGenerated }) => {
  const { teachers, calculateTeacherMonthlyPay, processTeacherPayment, schoolInfo } = useSchool();
  const { showSuccess, showWarning } = useToast();
  const { user } = useAuth();

  const teacher = teachers.find(t => t.id === teacherId);

  const [period, setPeriod] = useState('September 2026');
  const [paymentMethod, setPaymentMethod] = useState('Bank Transfer');
  const [deductions, setDeductions] = useState(0);
  const [bonus, setBonus] = useState(0);
  const [notes, setNotes] = useState('');

  if (!teacher) return null;

  const paySummary = calculateTeacherMonthlyPay(teacher);
  const netAmount = Math.max(0, paySummary.gross + Number(bonus) - Number(deductions));

  const handleProcessPayment = (e) => {
    e.preventDefault();
    if (netAmount <= 0) {
      showWarning('Net payment amount must be greater than zero.');
      return;
    }

    const payload = {
      teacherId: teacher.id,
      teacherName: `${teacher.firstName} ${teacher.lastName}`,
      cycle: teacher.cycles.join(', '),
      period,
      payType: paySummary.type,
      hourlyRate: paySummary.hourlyRate,
      weeklyHours: paySummary.weeklyHours,
      monthlyHours: paySummary.monthlyHours,
      hoursBreakdown: paySummary.details,
      grossAmount: paySummary.gross,
      deductions: Number(deductions),
      bonus: Number(bonus),
      netPaid: netAmount,
      paymentMethod,
      notes,
      date: new Date().toISOString().split('T')[0]
    };

    const paymentSlip = processTeacherPayment(payload, user.name);
    showSuccess(`Payroll slip ${paymentSlip.id} generated for ${teacher.firstName} ${teacher.lastName}: ${netAmount.toLocaleString()} FCFA.`);
    if (onPaymentGenerated) onPaymentGenerated(paymentSlip);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Teacher Payroll Calculation & Voucher Generation"
      subtitle={`Process monthly remuneration for ${teacher.firstName} ${teacher.lastName}`}
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleProcessPayment} className="space-y-5">
        
        {/* Calculation Framework Notice */}
        <div className="p-4 bg-teal-50 border border-teal-200 rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-900">
              {paySummary.type}
            </span>
            <span className="text-xs font-bold text-teal-800 font-mono">
              {teacher.payType === 'fixed' ? 'Primary/Preschool Fixed' : 'Secondary Workload Model'}
            </span>
          </div>

          {teacher.payType === 'fixed' ? (
            <p className="text-xs text-teal-800">
              Preschool & Primary teachers receive a fixed monthly salary independent of specific hour breakdowns.
            </p>
          ) : (
            <p className="text-xs text-teal-800">
              Secondary calculation strictly enforced: <strong>{paySummary.weeklyHours} hrs/wk</strong> × 4 weeks = <strong>{paySummary.monthlyHours} monthly hours</strong> × <strong>{paySummary.hourlyRate.toLocaleString()} FCFA/hr</strong>.
            </p>
          )}
        </div>

        {/* Form Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Pay Period *</label>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="w-full text-xs font-semibold border border-slate-300 rounded-xl px-3 py-2 bg-white"
            >
              <option value="September 2026">September 2026</option>
              <option value="October 2026">October 2026</option>
              <option value="November 2026">November 2026</option>
              <option value="December 2026">December 2026</option>
              <option value="January 2027">January 2027</option>
              <option value="February 2027">February 2027</option>
              <option value="March 2027">March 2027</option>
              <option value="April 2027">April 2027</option>
              <option value="May 2027">May 2027</option>
              <option value="June 2027">June 2027</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Disbursement Method *</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full text-xs font-semibold border border-slate-300 rounded-xl px-3 py-2 bg-white"
            >
              <option value="Bank Transfer">Bank Transfer (Virement)</option>
              <option value="Cash">Cash at Desk (Espèces)</option>
              <option value="Cheque">Bank Cheque (Chèque)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Performance Bonus / Allowances (FCFA)</label>
            <input
              type="number"
              value={bonus}
              onChange={(e) => setBonus(e.target.value)}
              className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Deductions / Advances (FCFA)</label>
            <input
              type="number"
              value={deductions}
              onChange={(e) => setDeductions(e.target.value)}
              className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2 text-rose-600"
            />
          </div>
        </div>

        {/* Financial Summary Card */}
        <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-2">
          <div className="flex justify-between text-xs text-slate-300">
            <span>Base Gross Remuneration:</span>
            <span>{paySummary.gross.toLocaleString()} FCFA</span>
          </div>
          {Number(bonus) > 0 && (
            <div className="flex justify-between text-xs text-emerald-300">
              <span>+ Allowances & Bonus:</span>
              <span>+{Number(bonus).toLocaleString()} FCFA</span>
            </div>
          )}
          {Number(deductions) > 0 && (
            <div className="flex justify-between text-xs text-rose-300">
              <span>- Deductions / Advance Retained:</span>
              <span>-{Number(deductions).toLocaleString()} FCFA</span>
            </div>
          )}
          <div className="pt-2 border-t border-slate-700 flex justify-between items-center">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-300">Net Payable Amount:</span>
            <span className="text-xl font-black text-white">{netAmount.toLocaleString()} FCFA</span>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 rounded-xl"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 text-sm font-bold rounded-xl text-white bg-teal-600 hover:bg-teal-700 shadow-md flex items-center gap-2"
          >
            <Receipt className="w-4 h-4" />
            Issue Pay Slip Voucher
          </button>
        </div>

      </form>
    </Modal>
  );
};
