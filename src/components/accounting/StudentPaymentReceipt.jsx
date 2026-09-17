import React from 'react';
import { useSchool } from '../../context/SchoolContext';
import { Modal } from '../common/Modal';
import { Printer, CheckCircle2, Receipt, School, ShieldCheck } from 'lucide-react';

export const StudentPaymentReceipt = ({ isOpen, onClose, receiptId }) => {
  const { studentReceipts, schoolInfo, students, classes } = useSchool();

  const receipt = studentReceipts.find(r => r.id === receiptId);
  if (!receipt) return null;

  const student = students.find(s => s.id === receipt.studentId);
  const currentClass = classes.find(c => c.id === receipt.classId || c.id === student?.classId);

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Official Payment Receipt"
      subtitle={`Receipt #${receipt.id} • Issued to ${receipt.studentName}`}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-6">
        
        {/* Controls */}
        <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl no-print">
          <div className="text-xs text-slate-600">
            Immediate desk receipt issued upon fee collection. Optimized for black & white printer.
          </div>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-md"
          >
            <Printer className="w-4 h-4" />
            Print Official Receipt
          </button>
        </div>

        {/* Printable Receipt Voucher */}
        <div className="printable-document p-8 bg-white border-2 border-slate-300 print:border-black rounded-2xl shadow-sm text-slate-900 space-y-5">
          
          {/* Header */}
          <div className="flex items-start justify-between border-b-2 border-black pb-3">
            <div>
              <h3 className="text-base font-black uppercase">{schoolInfo.name}</h3>
              <p className="text-xs font-semibold text-slate-700">{schoolInfo.address}</p>
              <p className="text-xs text-slate-500">{schoolInfo.phone}</p>
              <div className="text-[10px] uppercase font-bold text-teal-800 tracking-wider mt-0.5">
                Secretariat & Accounting Desk • Brazzaville (Congo)
              </div>
            </div>
            <div className="text-right">
              <span className="font-mono text-sm font-black px-2.5 py-1 bg-slate-100 border border-black rounded inline-block">
                RECEIPT #{receipt.id}
              </span>
              <p className="text-xs text-slate-600 mt-1.5">Date: <strong>{receipt.date}</strong></p>
              <p className="text-xs text-slate-500">Session: {receipt.academicYear || schoolInfo.currentAcademicYear}</p>
            </div>
          </div>

          {/* Receipt Title */}
          <div className="text-center py-1.5 bg-slate-100 print:bg-slate-100 border border-black rounded-lg">
            <h4 className="text-xs font-black uppercase tracking-wider">
              OFFICIAL SCHOOL FEE PAYMENT VOUCHER (REÇU DE CAISSE)
            </h4>
          </div>

          {/* Student Info Box */}
          <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 print:bg-white p-3.5 rounded-xl border border-black">
            <div>
              <span className="text-[10px] uppercase font-semibold text-slate-500 block">Received From:</span>
              <strong className="text-sm font-bold text-slate-900">{receipt.studentName}</strong>
            </div>
            <div>
              <span className="text-[10px] uppercase font-semibold text-slate-500 block">Student ID:</span>
              <strong className="text-sm font-mono text-slate-900">{receipt.studentId}</strong>
            </div>
            <div>
              <span className="text-[10px] uppercase font-semibold text-slate-500 block">Class Cohort:</span>
              <span className="font-semibold text-slate-800">{receipt.className || currentClass?.name || 'Class N/A'}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-semibold text-slate-500 block">Payment Method:</span>
              <span className="font-bold text-teal-900 uppercase">
                {receipt.paymentMethod} {receipt.referenceNo ? `(Ref: ${receipt.referenceNo})` : ''}
              </span>
            </div>
          </div>

          {/* Line Item Table */}
          <table className="w-full text-left text-xs border border-black">
            <thead className="bg-slate-100 font-bold border-b border-black text-black">
              <tr>
                <th className="p-2.5 border-r border-black">Payment Description & Fee Type</th>
                <th className="p-2.5 text-right w-36">Amount Received</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-3 border-r border-black font-medium">
                  {receipt.feeType}
                  {receipt.notes && <div className="text-[11px] text-slate-500 italic mt-0.5">Note: {receipt.notes}</div>}
                </td>
                <td className="p-3 text-right font-black text-sm text-slate-900">
                  {Number(receipt.amount).toLocaleString()} FCFA
                </td>
              </tr>
            </tbody>
            <tfoot className="border-t-2 border-black bg-slate-100 font-bold text-xs">
              <tr>
                <td className="p-2.5 border-r border-black text-right uppercase">Net Amount Paid:</td>
                <td className="p-2.5 text-right font-black text-base text-teal-950">
                  {Number(receipt.amount).toLocaleString()} FCFA
                </td>
              </tr>
              <tr>
                <td className="p-2 border-r border-black text-right uppercase text-slate-600">Remaining Balance Due:</td>
                <td className="p-2 text-right font-black text-xs text-rose-800">
                  {receipt.remainingBalance !== undefined ? Number(receipt.remainingBalance).toLocaleString() : '0'} FCFA
                </td>
              </tr>
            </tfoot>
          </table>

          {/* Amount in words placeholder & Signature */}
          <div className="text-xs space-y-1 pt-1">
            <p className="text-[11px] text-slate-600 italic">
              * Official computerized receipt recorded at the cashier desk. Mobile money transactions are not accepted.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 pt-6 text-xs">
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-500">Payer / Guardian Signature:</p>
              <div className="h-12 border-b border-dashed border-slate-400"></div>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase font-bold text-slate-500">Cashier / Chief Accountant:</p>
              <p className="font-bold text-slate-800 mt-1">{receipt.receivedBy || 'Chief Accountant'}</p>
              <p className="text-[10px] text-slate-400 italic mt-4">[Stamp & Signature]</p>
            </div>
          </div>

        </div>

      </div>
    </Modal>
  );
};
