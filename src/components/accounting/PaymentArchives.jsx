import React, { useState, useMemo } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { Badge } from '../common/Badge';
import {
  History,
  Search,
  Download,
  Filter,
  Receipt,
  DollarSign,
  User,
  GraduationCap,
  Calendar,
  CreditCard
} from 'lucide-react';

export const PaymentArchives = ({ onOpenStudentReceipt, onOpenTeacherPaySlip }) => {
  const { studentReceipts, teacherPayments, schoolInfo } = useSchool();

  const [activeTab, setActiveTab] = useState('students'); // 'students' or 'teachers'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('all');

  // Filter student receipts
  const filteredStudentReceipts = useMemo(() => {
    return studentReceipts.filter(r => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = r.studentName.toLowerCase().includes(q);
        const matchId = r.id.toLowerCase().includes(q) || r.studentId.toLowerCase().includes(q);
        if (!matchName && !matchId) return false;
      }
      if (selectedMethod !== 'all' && r.paymentMethod !== selectedMethod) return false;
      return true;
    });
  }, [studentReceipts, searchQuery, selectedMethod]);

  // Filter teacher payments
  const filteredTeacherPayments = useMemo(() => {
    return teacherPayments.filter(p => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = p.teacherName.toLowerCase().includes(q);
        const matchId = p.id.toLowerCase().includes(q) || p.teacherId.toLowerCase().includes(q);
        const matchPeriod = p.period.toLowerCase().includes(q);
        if (!matchName && !matchId && !matchPeriod) return false;
      }
      if (selectedMethod !== 'all' && p.paymentMethod !== selectedMethod) return false;
      return true;
    });
  }, [teacherPayments, searchQuery, selectedMethod]);

  // Export to CSV
  const handleExportCSV = () => {
    let headers = [];
    let rows = [];

    if (activeTab === 'students') {
      headers = ['Receipt Number', 'Date', 'Student ID', 'Student Name', 'Class', 'Fee Type', 'Method', 'Amount (FCFA)', 'Remaining Balance', 'Cashier'];
      rows = filteredStudentReceipts.map(r => [
        r.id,
        r.date,
        r.studentId,
        r.studentName,
        r.className,
        r.feeType,
        r.paymentMethod,
        r.amount,
        r.remainingBalance,
        r.receivedBy
      ]);
    } else {
      headers = ['Voucher ID', 'Date', 'Period', 'Teacher ID', 'Teacher Name', 'Pay Type', 'Hours Worked', 'Method', 'Gross (FCFA)', 'Net Disbursed (FCFA)', 'Disbursed By'];
      rows = filteredTeacherPayments.map(p => [
        p.id,
        p.date,
        p.period,
        p.teacherId,
        p.teacherName,
        p.payType,
        p.monthlyHours || '-',
        p.paymentMethod,
        p.grossAmount,
        p.netPaid,
        p.processedBy
      ]);
    }

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.map(v => `"${v}"`).join(','))].join('\n');
    const encoded = encodeURI(csvContent);
    const link = document.createElement('a');
    link.href = encoded;
    link.download = `SCOLARIS_${activeTab}_Payments_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Payment & Transaction Archives</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Complete searchable ledger of student fee receipts and teacher payroll vouchers
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-sm"
        >
          <Download className="w-4 h-4 text-slate-500" />
          Export {activeTab === 'students' ? 'Student Receipts' : 'Teacher Slips'} to CSV
        </button>
      </div>

      {/* Tabs Switcher & Filter Bar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Tabs */}
          <div className="flex items-center p-1 bg-slate-100 rounded-xl w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('students')}
              className={`flex-1 sm:flex-initial flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'students'
                  ? 'bg-white text-teal-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Receipt className="w-3.5 h-3.5" />
              Student Fee Receipts ({studentReceipts.length})
            </button>
            <button
              onClick={() => setActiveTab('teachers')}
              className={`flex-1 sm:flex-initial flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'teachers'
                  ? 'bg-white text-teal-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <DollarSign className="w-3.5 h-3.5" />
              Teacher Pay Vouchers ({teacherPayments.length})
            </button>
          </div>

          {/* Search & Method */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search by ID, name or period..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs pl-8 pr-3 py-1.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white"
              />
            </div>

            <select
              value={selectedMethod}
              onChange={(e) => setSelectedMethod(e.target.value)}
              className="text-xs font-semibold rounded-xl border border-slate-200 px-3 py-1.5 bg-slate-50"
            >
              <option value="all">All Methods</option>
              <option value="Cash">Cash</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Cheque">Cheque</option>
            </select>
          </div>

        </div>
      </div>

      {/* Tables */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {activeTab === 'students' ? (
          /* Student Receipts Table */
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200/80 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Receipt #</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Student Name & ID</th>
                  <th className="py-3 px-4">Fee Purpose</th>
                  <th className="py-3 px-4">Method</th>
                  <th className="py-3 px-4 text-right">Amount Paid</th>
                  <th className="py-3 px-4 text-right">Balance</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudentReceipts.map(r => (
                  <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-teal-700">{r.id}</td>
                    <td className="py-3.5 px-4 text-slate-600">{r.date}</td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{r.studentName}</div>
                      <span className="font-mono text-[11px] text-slate-400">{r.studentId}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">{r.feeType}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-100 font-semibold text-[10px] text-slate-700">
                        {r.paymentMethod}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-black text-slate-900">
                      {Number(r.amount).toLocaleString()} FCFA
                    </td>
                    <td className="py-3.5 px-4 text-right font-semibold text-slate-500">
                      {Number(r.remainingBalance || 0).toLocaleString()} FCFA
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => onOpenStudentReceipt(r.id)}
                        className="p-1.5 text-slate-500 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-colors"
                        title="View & Print Official Receipt"
                      >
                        <Receipt className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          /* Teacher Payments Table */
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200/80 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Voucher #</th>
                  <th className="py-3 px-4">Disbursed Date</th>
                  <th className="py-3 px-4">Period</th>
                  <th className="py-3 px-4">Teacher Name & Scope</th>
                  <th className="py-3 px-4">Model & Workload</th>
                  <th className="py-3 px-4">Method</th>
                  <th className="py-3 px-4 text-right">Net Paid</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTeacherPayments.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-teal-700">{p.id}</td>
                    <td className="py-3.5 px-4 text-slate-600">{p.date}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-800">{p.period}</td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{p.teacherName}</div>
                      <span className="text-[11px] text-slate-400">{p.cycle}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant={p.payType === 'Fixed Monthly Salary' ? 'primary' : 'purple'} size="sm">
                        {p.payType}
                      </Badge>
                      {p.monthlyHours && (
                        <span className="text-[10px] text-slate-500 font-mono ml-1.5">
                          ({p.monthlyHours} hrs)
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-semibold">{p.paymentMethod}</td>
                    <td className="py-3.5 px-4 text-right font-black text-slate-900">
                      {Number(p.netPaid).toLocaleString()} FCFA
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => onOpenTeacherPaySlip(p.id)}
                        className="p-1.5 text-slate-500 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-colors"
                        title="View & Print Official Pay Slip"
                      >
                        <DollarSign className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
