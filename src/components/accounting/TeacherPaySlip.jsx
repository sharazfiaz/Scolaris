import React from 'react';
import { useSchool } from '../../context/SchoolContext';
import { Modal } from '../common/Modal';
import { Printer, CheckCircle2, DollarSign, School } from 'lucide-react';

export const TeacherPaySlip = ({ isOpen, onClose, paymentId }) => {
  const { teacherPayments, schoolInfo, teachers } = useSchool();

  const payment = teacherPayments.find(p => p.id === paymentId);
  if (!payment) return null;

  const teacher = teachers.find(t => t.id === payment.teacherId);

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Official Teacher Payroll Voucher"
      subtitle={`Voucher #${payment.id} • Issued to ${payment.teacherName}`}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-6">
        
        {/* Controls */}
        <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl no-print">
          <div className="text-xs text-slate-600">
            Official monthly pay slip voucher for teacher remuneration archive.
          </div>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-md"
          >
            <Printer className="w-4 h-4" />
            Print Pay Slip
          </button>
        </div>

        {/* Printable Voucher */}
        <div className="printable-document p-8 bg-white border-2 border-slate-300 print:border-black rounded-2xl shadow-sm text-slate-900 space-y-5">
          
          {/* Header */}
          <div className="flex items-start justify-between border-b-2 border-black pb-3">
            <div>
              <h3 className="text-base font-black uppercase">{schoolInfo.name}</h3>
              <p className="text-xs font-semibold text-slate-700">{schoolInfo.address}</p>
              <p className="text-xs text-slate-500">{schoolInfo.phone}</p>
              <div className="text-[10px] uppercase font-bold text-teal-800 tracking-wider mt-0.5">
                Teacher Payroll & Remuneration Service
              </div>
            </div>
            <div className="text-right">
              <span className="font-mono text-sm font-black px-2.5 py-1 bg-slate-100 border border-black rounded inline-block">
                PAY VOUCHER #{payment.id}
              </span>
              <p className="text-xs text-slate-600 mt-1.5">Period: <strong>{payment.period}</strong></p>
              <p className="text-xs text-slate-500">Disbursed: {payment.date}</p>
            </div>
          </div>

          {/* Title */}
          <div className="text-center py-1.5 bg-slate-100 print:bg-slate-100 border border-black rounded-lg">
            <h4 className="text-xs font-black uppercase tracking-wider">
              OFFICIAL TEACHER PAY SLIP (BULLETIN DE PAIE ENSEIGNANT)
            </h4>
          </div>

          {/* Beneficiary Box */}
          <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 print:bg-white p-3.5 rounded-xl border border-black">
            <div>
              <span className="text-[10px] uppercase font-semibold text-slate-500 block">Instructor:</span>
              <strong className="text-sm font-bold text-slate-900">{payment.teacherName}</strong>
            </div>
            <div>
              <span className="text-[10px] uppercase font-semibold text-slate-500 block">Teacher ID:</span>
              <strong className="text-sm font-mono text-slate-900">{payment.teacherId}</strong>
            </div>
            <div>
              <span className="text-[10px] uppercase font-semibold text-slate-500 block">Cycle / Scope:</span>
              <span className="font-semibold text-slate-800">{payment.cycle}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-semibold text-slate-500 block">Compensation Model:</span>
              <span className="font-bold text-teal-900">{payment.payType}</span>
            </div>
          </div>

          {/* Breakdown Table */}
          <table className="w-full text-left text-xs border border-black">
            <thead className="bg-slate-100 font-bold border-b border-black text-black">
              <tr>
                <th className="p-2 border-r border-black">Remuneration Element</th>
                <th className="p-2 border-r border-black text-center w-24">Hours</th>
                <th className="p-2 border-r border-black text-center w-28">Rate</th>
                <th className="p-2 text-right w-36">Total Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black">
              {payment.hoursBreakdown && payment.hoursBreakdown.length > 0 ? (
                payment.hoursBreakdown.map((item, idx) => (
                  <tr key={idx}>
                    <td className="p-2 border-r border-black font-medium">
                      Teaching in {item.className} ({item.subjectName})
                    </td>
                    <td className="p-2 border-r border-black text-center font-mono font-bold">
                      {item.monthlyHours} hrs
                    </td>
                    <td className="p-2 border-r border-black text-center font-mono">
                      {(payment.hourlyRate || 0).toLocaleString()} FCFA
                    </td>
                    <td className="p-2 text-right font-bold font-mono">
                      {(item.amount || (item.monthlyHours * payment.hourlyRate)).toLocaleString()} FCFA
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="p-2 border-r border-black font-medium">Fixed Monthly Base Salary (Primary/Preschool)</td>
                  <td className="p-2 border-r border-black text-center font-mono">-</td>
                  <td className="p-2 border-r border-black text-center font-mono">-</td>
                  <td className="p-2 text-right font-bold font-mono">{Number(payment.grossAmount).toLocaleString()} FCFA</td>
                </tr>
              )}
            </tbody>
            <tfoot className="border-t-2 border-black bg-slate-100 font-bold text-xs">
              <tr>
                <td colSpan="3" className="p-2 border-r border-black text-right uppercase">Gross Total:</td>
                <td className="p-2 text-right font-black text-slate-900">{Number(payment.grossAmount).toLocaleString()} FCFA</td>
              </tr>
              {Number(payment.deductions) > 0 && (
                <tr>
                  <td colSpan="3" className="p-2 border-r border-black text-right uppercase text-rose-700">Deductions / Advance:</td>
                  <td className="p-2 text-right font-bold text-rose-700">-{Number(payment.deductions).toLocaleString()} FCFA</td>
                </tr>
              )}
              <tr className="border-t border-black">
                <td colSpan="3" className="p-2.5 border-r border-black text-right uppercase font-black text-sm">Net Disbursed:</td>
                <td className="p-2.5 text-right font-black text-base text-teal-950">{Number(payment.netPaid).toLocaleString()} FCFA</td>
              </tr>
            </tfoot>
          </table>

          {/* Signatures */}
          <div className="grid grid-cols-2 gap-8 pt-6 text-xs">
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-500">Beneficiary Teacher Acknowledgment:</p>
              <div className="h-10 border-b border-dashed border-slate-400"></div>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase font-bold text-slate-500">Chief Accountant / Disbursement Officer:</p>
              <p className="font-bold text-slate-800 mt-1">{payment.processedBy}</p>
              <p className="text-[10px] text-slate-400 italic mt-3">[Stamp & Signature]</p>
            </div>
          </div>

        </div>

      </div>
    </Modal>
  );
};
