import React from 'react';
import { useSchool } from '../../context/SchoolContext';
import { Modal } from '../common/Modal';
import { Printer, Clock, FileText, School, CheckCircle2 } from 'lucide-react';

export const TeacherHoursStatement = ({ isOpen, onClose, teacherId }) => {
  const { teachers, classes, subjects, schoolInfo } = useSchool();

  const teacher = teachers.find(t => t.id === teacherId);
  if (!teacher) return null;

  const handlePrint = () => {
    window.print();
  };

  const assignments = teacher.assignments || [];
  const totalWeeklyHours = assignments.reduce((sum, a) => sum + (Number(a.weeklyHours) || 0), 0);
  const totalMonthlyHours = totalWeeklyHours * 4;
  const hourlyRate = teacher.hourlyRate || 4000;
  const estimatedGross = totalMonthlyHours * hourlyRate;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Official Teacher Workload & Hours Statement"
      subtitle="Certified statement of teaching assignments and hourly workload for pay settlement and multi-institution verification"
      maxWidth="max-w-3xl"
    >
      <div className="space-y-6">
        
        {/* Controls */}
        <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl no-print">
          <div className="text-xs text-slate-600">
            Click print to generate a certified official A4 black-and-white statement for teacher records.
          </div>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-md"
          >
            <Printer className="w-4 h-4" />
            Print Official Statement
          </button>
        </div>

        {/* Printable Document Box */}
        <div className="printable-document p-8 bg-white border-2 border-slate-300 print:border-black rounded-2xl shadow-sm text-slate-900 space-y-6">
          
          {/* Header */}
          <div className="flex items-start justify-between border-b-2 border-black pb-4">
            <div>
              <h2 className="text-lg font-black uppercase tracking-tight">{schoolInfo.name}</h2>
              <p className="text-xs font-semibold text-slate-700">{schoolInfo.address}</p>
              <p className="text-xs text-slate-600">{schoolInfo.phone} • {schoolInfo.email}</p>
              <div className="text-[10px] font-bold text-teal-800 uppercase mt-1">
                Republic of the Congo • Ministry of Education (MEPPSA)
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono font-bold px-2.5 py-1 bg-slate-100 border border-black rounded">
                REF: STMT-{teacher.id}-{schoolInfo.currentAcademicYear}
              </span>
              <p className="text-xs text-slate-600 mt-2 font-medium">
                Academic Session: <strong>{schoolInfo.currentAcademicYear}</strong>
              </p>
              <p className="text-[11px] text-slate-500">
                Date: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>

          {/* Title */}
          <div className="text-center py-2 bg-slate-50 print:bg-slate-100 border border-black rounded-xl">
            <h3 className="text-sm font-black uppercase tracking-wider">
              CERTIFICATE OF TEACHING WORKLOAD & HOURLY ASSIGNMENTS
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              (Attestation d'Heures et d'Affectation Pédagogique)
            </p>
          </div>

          {/* Teacher Profile Summary */}
          <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50/70 p-4 rounded-xl border border-slate-200 print:border-black">
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Teacher Name:</span>
              <strong className="text-sm font-bold text-slate-900">{teacher.firstName} {teacher.lastName}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Teacher ID:</span>
              <strong className="text-sm font-mono font-bold text-slate-900">{teacher.id}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Contact Phone:</span>
              <span className="font-semibold text-slate-800">{teacher.phone || 'N/A'}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Compensation Category:</span>
              <span className="font-bold text-teal-800">
                {teacher.payType === 'fixed' ? 'Preschool/Primary Homeroom (Fixed Salary)' : 'Secondary (Hourly Pay - Rate: ' + hourlyRate.toLocaleString() + ' FCFA/hr)'}
              </span>
            </div>
          </div>

          {/* Detailed Workload Table */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider mb-2">Class-by-Class Teaching Breakdown:</h4>
            <table className="w-full text-left text-xs border border-black">
              <thead className="bg-slate-100 font-bold border-b border-black text-black">
                <tr>
                  <th className="p-2 border-r border-black">Assigned Class</th>
                  <th className="p-2 border-r border-black">Discipline / Subject</th>
                  <th className="p-2 border-r border-black text-center">Weekly Hours</th>
                  <th className="p-2 border-r border-black text-center">Monthly Workload (4 Wks)</th>
                  <th className="p-2 text-right">Subtotal Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black">
                {assignments.map((a, idx) => {
                  const cls = classes.find(c => c.id === a.classId);
                  const subj = subjects.find(s => s.id === a.subjectId);
                  const monthlyHrs = a.weeklyHours * 4;
                  const rowSubtotal = monthlyHrs * hourlyRate;

                  return (
                    <tr key={idx} className="font-medium">
                      <td className="p-2 border-r border-black font-bold">{cls?.name || a.classId}</td>
                      <td className="p-2 border-r border-black">{subj?.name || a.subjectId} ({subj?.code})</td>
                      <td className="p-2 border-r border-black text-center font-bold">{a.weeklyHours} hrs/wk</td>
                      <td className="p-2 border-r border-black text-center">{monthlyHrs} hrs/mo</td>
                      <td className="p-2 text-right font-bold">{rowSubtotal.toLocaleString()} FCFA</td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot className="border-t-2 border-black bg-slate-100 font-bold text-xs">
                <tr>
                  <td colSpan="2" className="p-2 border-r border-black text-right uppercase">Consolidated Totals:</td>
                  <td className="p-2 border-r border-black text-center font-black text-sm">{totalWeeklyHours} hrs</td>
                  <td className="p-2 border-r border-black text-center font-black text-sm">{totalMonthlyHours} hrs</td>
                  <td className="p-2 text-right font-black text-sm text-teal-900">{estimatedGross.toLocaleString()} FCFA</td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Legal / Institutional Attestation Notice */}
          <p className="text-[10px] text-slate-600 leading-relaxed italic border-l-2 border-slate-400 pl-3">
            "This statement serves as official supporting documentation of teaching hours completed at {schoolInfo.name} for the {schoolInfo.currentAcademicYear} school year. In accordance with Congolese educational management practices, this document certifies the weekly workload across assigned classes."
          </p>

          {/* Signatures */}
          <div className="grid grid-cols-2 gap-8 pt-8 text-xs">
            <div className="text-center space-y-12">
              <p className="font-bold">The Teacher (L'Enseignant)</p>
              <p className="text-slate-400 text-[10px] italic">[Signature & Date]</p>
            </div>
            <div className="text-center space-y-12">
              <div>
                <p className="font-bold">The Headmaster / Principal</p>
                <p className="text-[10px] text-slate-500">Complexe Scolaire La Renaissance</p>
              </div>
              <p className="text-slate-400 text-[10px] italic">[Official School Stamp & Signature]</p>
            </div>
          </div>

        </div>

      </div>
    </Modal>
  );
};
