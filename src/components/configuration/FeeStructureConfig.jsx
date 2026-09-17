import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { DollarSign, Save, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const FeeStructureConfig = () => {
  const { feeStructure, updateFeeStructure, cycles, schoolInfo } = useSchool();
  const { showSuccess } = useToast();
  const { user } = useAuth();

  const [fees, setFees] = useState(() => JSON.parse(JSON.stringify(feeStructure)));

  const handleFieldChange = (cycleId, field, value) => {
    setFees(prev => ({
      ...prev,
      [cycleId]: {
        ...prev[cycleId],
        [field]: Number(value) || 0
      }
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateFeeStructure(fees, user.name);
    showSuccess('Annual and termly school fee structures updated successfully.');
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">Tuition & Enrollment Fee Configuration</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure official tuition, new enrollment, and re-enrollment rates (in FCFA) per education cycle
          </p>
        </div>

        <button
          type="submit"
          className="flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-md transition-all active:scale-95"
        >
          <Save className="w-4 h-4" />
          Save Fee Schedules
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cycles.map(c => {
          const cFees = fees[c.id] || { enrollmentFee: 30000, reenrollmentFee: 20000, tuitionAnnual: 225000, tuitionMonthly: 25000 };

          return (
            <div key={c.id} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <div>
                  <h4 className="font-bold text-sm text-slate-900">{c.name}</h4>
                  <p className="text-[11px] text-slate-500">{c.description}</p>
                </div>
                <span className="text-[10px] font-bold uppercase font-mono px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200">
                  {schoolInfo.currency}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">New Enrollment Fee</label>
                  <input
                    type="number"
                    value={cFees.enrollmentFee}
                    onChange={(e) => handleFieldChange(c.id, 'enrollmentFee', e.target.value)}
                    className="w-full font-mono font-bold border border-slate-300 rounded-xl px-3 py-1.5 bg-slate-50 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Re-enrollment Fee</label>
                  <input
                    type="number"
                    value={cFees.reenrollmentFee}
                    onChange={(e) => handleFieldChange(c.id, 'reenrollmentFee', e.target.value)}
                    className="w-full font-mono font-bold border border-slate-300 rounded-xl px-3 py-1.5 bg-slate-50 focus:bg-white text-teal-800"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Annual Tuition Total</label>
                  <input
                    type="number"
                    value={cFees.tuitionAnnual}
                    onChange={(e) => handleFieldChange(c.id, 'tuitionAnnual', e.target.value)}
                    className="w-full font-mono font-black border border-slate-300 rounded-xl px-3 py-1.5 bg-slate-50 focus:bg-white text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Monthly Equivalent</label>
                  <input
                    type="number"
                    value={cFees.tuitionMonthly}
                    onChange={(e) => handleFieldChange(c.id, 'tuitionMonthly', e.target.value)}
                    className="w-full font-mono font-bold border border-slate-300 rounded-xl px-3 py-1.5 bg-slate-50 focus:bg-white text-slate-600"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </form>
  );
};
