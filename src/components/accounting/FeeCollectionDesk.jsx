import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import {
  Receipt,
  Search,
  CheckCircle2,
  DollarSign,
  CreditCard,
  Building,
  User,
  Calendar,
  AlertCircle
} from 'lucide-react';

export const FeeCollectionDesk = ({ defaultStudentId = null, onReceiptCreated }) => {
  const { students, classes, recordStudentPayment, schoolInfo } = useSchool();
  const { showSuccess, showWarning } = useToast();
  const { user } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState(defaultStudentId || '');
  
  const [formData, setFormData] = useState({
    amount: '',
    paymentMethod: 'Cash',
    feeType: '1st Term Tuition Installment',
    referenceNo: '',
    notes: '',
    date: new Date().toISOString().split('T')[0]
  });

  const selectedStudent = students.find(s => s.id === selectedStudentId);
  const currentClass = classes.find(c => c.id === selectedStudent?.classId);
  const feeStatus = selectedStudent?.feeStatus || { totalDue: 0, paid: 0, balance: 0, paymentStatus: 'Unpaid' };

  // Filter students
  const studentResults = students.filter(s => {
    if (!searchQuery.trim()) return false;
    const q = searchQuery.toLowerCase();
    return s.id.toLowerCase().includes(q) ||
           `${s.firstName} ${s.lastName}`.toLowerCase().includes(q) ||
           s.guardians?.father?.phone?.includes(q) ||
           s.guardians?.mother?.phone?.includes(q);
  }).slice(0, 6);

  const handleSelectStudent = (std) => {
    setSelectedStudentId(std.id);
    setSearchQuery('');
    // suggest remaining balance as default payment amount
    if (std.feeStatus?.balance > 0) {
      setFormData(prev => ({ ...prev, amount: std.feeStatus.balance }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedStudentId) {
      showWarning('Please select a student for payment.');
      return;
    }
    const amt = Number(formData.amount);
    if (!amt || amt <= 0) {
      showWarning('Please enter a valid payment amount in FCFA.');
      return;
    }

    const receipt = recordStudentPayment({
      studentId: selectedStudent.id,
      studentName: `${selectedStudent.firstName} ${selectedStudent.lastName}`,
      classId: selectedStudent.classId,
      className: currentClass?.name || 'Class N/A',
      academicYear: schoolInfo.currentAcademicYear,
      amount: amt,
      paymentMethod: formData.paymentMethod,
      feeType: formData.feeType,
      referenceNo: formData.referenceNo,
      notes: formData.notes,
      date: formData.date
    }, user.name);

    showSuccess(`Receipt #${receipt.id} generated! Recorded ${amt.toLocaleString()} FCFA from ${selectedStudent.firstName} ${selectedStudent.lastName}.`);
    
    // Reset amount
    setFormData(prev => ({ ...prev, amount: '', referenceNo: '', notes: '' }));

    if (onReceiptCreated) {
      onReceiptCreated(receipt.id);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-6">
      
      {/* Header */}
      <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Receipt className="w-5 h-5 text-teal-600" />
            School Fee Cashier & Collection Desk
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Immediate desk payment recording in FCFA with instant printable voucher issuance
          </p>
        </div>
        <span className="text-xs font-mono font-bold bg-teal-50 text-teal-800 px-3 py-1 rounded-lg border border-teal-200">
          Cur: {schoolInfo.currency} (FCFA)
        </span>
      </div>

      {/* Step 1: Student Lookup */}
      <div className="space-y-2">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
          1. Student Lookup & Balance Verification
        </label>
        
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search student by name, ID (ES-2026-00101) or phone number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs sm:text-sm pl-10 pr-4 py-2 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-teal-500"
          />
        </div>

        {/* Live Search Results Dropdown */}
        {studentResults.length > 0 && (
          <div className="border border-slate-200 rounded-xl shadow-lg divide-y divide-slate-100 bg-white z-10">
            {studentResults.map(s => {
              const cls = classes.find(c => c.id === s.classId);
              return (
                <button
                  type="button"
                  key={s.id}
                  onClick={() => handleSelectStudent(s)}
                  className="w-full p-3 text-left hover:bg-teal-50/60 flex items-center justify-between text-xs transition-colors"
                >
                  <div>
                    <span className="font-bold text-slate-900">{s.firstName} {s.lastName}</span>
                    <span className="text-slate-400 ml-2 font-mono">{s.id}</span>
                  </div>
                  <div className="text-right">
                    <span className="px-2 py-0.5 rounded bg-slate-100 font-semibold text-[10px]">{cls?.name}</span>
                    <span className="text-rose-600 font-bold ml-2">Due: {(s.feeStatus?.balance || 0).toLocaleString()} FCFA</span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Selected Student Ledger */}
      {selectedStudent ? (
        <div className="p-4 bg-teal-50/70 border border-teal-200 rounded-2xl space-y-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs text-teal-800 font-bold">Selected Student Profile:</span>
              <h4 className="text-base font-extrabold text-brand-900">
                {selectedStudent.firstName} {selectedStudent.lastName}
              </h4>
              <p className="text-xs text-teal-700 font-mono">
                ID: {selectedStudent.id} • Class: {currentClass?.name} • Contact: {selectedStudent.guardians?.father?.phone || selectedStudent.guardians?.mother?.phone || 'N/A'}
              </p>
            </div>

            <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-teal-200">
              <div className="text-right">
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">Total Due</span>
                <strong className="text-xs font-mono">{feeStatus.totalDue.toLocaleString()} FCFA</strong>
              </div>
              <div className="text-right border-l border-slate-200 pl-3">
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">Paid So Far</span>
                <strong className="text-xs font-mono text-emerald-700">{feeStatus.paid.toLocaleString()} FCFA</strong>
              </div>
              <div className="text-right border-l border-slate-200 pl-3">
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">Remaining</span>
                <strong className="text-sm font-mono font-black text-rose-700">{feeStatus.balance.toLocaleString()} FCFA</strong>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500 italic text-center">
          No student selected. Use the search bar above to look up a student record.
        </div>
      )}

      {/* Step 2: Payment Details Form */}
      <form onSubmit={handleSubmit} className="space-y-4 pt-2">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
          2. Transaction Details & Cash Collection
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Amount Collected (FCFA) *</label>
            <input
              type="number"
              required
              min="1000"
              placeholder="e.g. 50000"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="w-full text-sm font-bold border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Payment Method *</label>
            <select
              value={formData.paymentMethod}
              onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
              className="w-full text-xs font-semibold border border-slate-300 rounded-xl px-3 py-2 bg-white"
            >
              <option value="Cash">Cash at Desk (Espèces)</option>
              <option value="Bank Transfer">Bank Transfer (Virement)</option>
              <option value="Cheque">Bank Cheque (Chèque)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Fee Purpose / Description *</label>
            <select
              value={formData.feeType}
              onChange={(e) => setFormData({ ...formData, feeType: e.target.value })}
              className="w-full text-xs font-semibold border border-slate-300 rounded-xl px-3 py-2 bg-white"
            >
              <option value="1st Term Tuition Installment">1st Trimester Tuition Installment</option>
              <option value="2nd Term Tuition Installment">2nd Trimester Tuition Installment</option>
              <option value="3rd Term Tuition Installment">3rd Trimester Tuition Installment</option>
              <option value="Full Year Tuition Settlement">Full Year Tuition Settlement</option>
              <option value="Enrollment & Registration Fee">Enrollment & Registration Fee</option>
              <option value="State Examination Fee (CEP/BEPC/Bac)">State Examination Registration Fee</option>
              <option value="School Uniform & Activity Kit">School Uniform & Activity Kit</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Cheque / Bank Reference #</label>
            <input
              type="text"
              placeholder="e.g. BGFI-TX-9901 or CHQ #4412"
              value={formData.referenceNo}
              onChange={(e) => setFormData({ ...formData, referenceNo: e.target.value })}
              className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Transaction Date *</label>
            <input
              type="date"
              required
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Cashier / Receiver</label>
            <input
              type="text"
              disabled
              value={user.name}
              className="w-full text-xs border border-slate-200 bg-slate-100 rounded-xl px-3 py-2 text-slate-600 font-medium"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Optional Notes / Remarks on Receipt</label>
          <input
            type="text"
            placeholder="e.g. Paid in full for Trimester 1, balance remaining for Trimester 2..."
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2"
          />
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3 pt-3">
          <button
            type="submit"
            disabled={!selectedStudentId || !formData.amount}
            className="px-6 py-2.5 text-xs font-bold rounded-xl text-white bg-teal-600 hover:bg-teal-700 shadow-lg shadow-teal-900/20 active:scale-[0.98] disabled:bg-slate-300 transition-all flex items-center gap-2"
          >
            <Receipt className="w-4 h-4" />
            Record Payment & Generate Receipt
          </button>
        </div>

      </form>
    </div>
  );
};
