import React, { useState, useMemo } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { Badge } from '../common/Badge';
import { AlertCircle, Search, Filter, Phone, Receipt, Download } from 'lucide-react';

export const OutstandingBalances = ({ onOpenPaymentDesk }) => {
  const { students, classes, cycles } = useSchool();
  const [selectedCycle, setSelectedCycle] = useState('all');
  const [selectedClass, setSelectedClass] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Find students with overdue balances
  const delinquentStudents = useMemo(() => {
    return students.filter(s => {
      const balance = s.feeStatus?.balance || 0;
      if (balance <= 0) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = `${s.firstName} ${s.lastName}`.toLowerCase().includes(q);
        const matchId = s.id.toLowerCase().includes(q);
        if (!matchName && !matchId) return false;
      }

      if (selectedCycle !== 'all') {
        const cls = classes.find(c => c.id === s.classId);
        if (cls?.cycleId !== selectedCycle) return false;
      }

      if (selectedClass !== 'all' && s.classId !== selectedClass) return false;

      return true;
    }).sort((a, b) => (b.feeStatus?.balance || 0) - (a.feeStatus?.balance || 0));
  }, [students, classes, searchQuery, selectedCycle, selectedClass]);

  const totalOutstanding = delinquentStudents.reduce((sum, s) => sum + (s.feeStatus?.balance || 0), 0);

  return (
    <div className="space-y-6">
      
      {/* KPI Alert Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 bg-rose-50 border border-rose-200 rounded-2xl">
          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700 block">
            Total Outstanding Receivables
          </span>
          <h3 className="text-2xl font-black text-rose-950 mt-1 font-mono">
            {totalOutstanding.toLocaleString()} FCFA
          </h3>
          <p className="text-xs text-rose-700 mt-1">Across all filtered classroom cohorts</p>
        </div>

        <div className="p-5 bg-amber-50 border border-amber-200 rounded-2xl">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 block">
            Students with Overdue Balance
          </span>
          <h3 className="text-2xl font-black text-amber-950 mt-1 font-mono">
            {delinquentStudents.length} Students
          </h3>
          <p className="text-xs text-amber-700 mt-1">Requiring reminder notices</p>
        </div>

        <div className="p-5 bg-teal-50 border border-teal-200 rounded-2xl">
          <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700 block">
            Collection Status
          </span>
          <h3 className="text-2xl font-black text-teal-950 mt-1">
            {students.length > 0 ? ((1 - (delinquentStudents.length / students.length)) * 100).toFixed(1) : 100}%
          </h3>
          <p className="text-xs text-teal-700 mt-1">Fully settled enrollment ratio</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search delinquent student by name or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs sm:text-sm pl-10 pr-4 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white"
          />
        </div>

        <div className="w-full sm:w-48">
          <select
            value={selectedCycle}
            onChange={(e) => setSelectedCycle(e.target.value)}
            className="w-full text-xs font-semibold rounded-xl border border-slate-200 px-3 py-2 bg-slate-50"
          >
            <option value="all">All Cycles</option>
            {cycles.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        <div className="w-full sm:w-48">
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="w-full text-xs font-semibold rounded-xl border border-slate-200 px-3 py-2 bg-slate-50"
          >
            <option value="all">All Classes</option>
            {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
      </div>

      {/* Delinquent Students Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <span className="text-xs font-bold text-slate-700">
            Overdue Roster: <strong className="text-rose-700">{delinquentStudents.length}</strong> Students with Outstanding Balance
          </span>
        </div>

        {delinquentStudents.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <AlertCircle className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
            <h4 className="font-bold text-sm text-slate-800">No overdue balances in this selection!</h4>
            <p className="text-xs text-slate-400 mt-0.5">All student accounts are up to date.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200/80 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Student Name & ID</th>
                  <th className="py-3 px-4">Class</th>
                  <th className="py-3 px-4">Parent / Guardian Contact</th>
                  <th className="py-3 px-4 text-right">Total Annual Fee</th>
                  <th className="py-3 px-4 text-right">Paid So Far</th>
                  <th className="py-3 px-4 text-right">Overdue Balance</th>
                  <th className="py-3 px-4 text-center">Desk Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {delinquentStudents.map(student => {
                  const currentClass = classes.find(c => c.id === student.classId);
                  const fee = student.feeStatus || { totalDue: 0, paid: 0, balance: 0 };
                  const phone = student.guardians?.father?.phone || student.guardians?.mother?.phone || 'No phone';

                  return (
                    <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{student.firstName} {student.lastName}</div>
                        <span className="font-mono text-[11px] text-teal-700 font-semibold">{student.id}</span>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-700">
                        {currentClass?.name}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="text-slate-800 font-medium">{student.guardians?.father?.name || student.guardians?.mother?.name || 'N/A'}</div>
                        <span className="font-mono text-[11px] text-slate-500">{phone}</span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono text-slate-600">
                        {fee.totalDue.toLocaleString()} FCFA
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono text-emerald-700 font-bold">
                        {fee.paid.toLocaleString()} FCFA
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono text-rose-700 font-black text-sm">
                        {fee.balance.toLocaleString()} FCFA
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => onOpenPaymentDesk(student.id)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition-colors"
                        >
                          <Receipt className="w-3.5 h-3.5 text-emerald-600" />
                          Collect Payment
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
