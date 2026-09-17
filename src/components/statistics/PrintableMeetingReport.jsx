import React from 'react';
import { useSchool } from '../../context/SchoolContext';
import { Printer, TrendingUp, Users, Award, Receipt, Building, CheckCircle2 } from 'lucide-react';

export const PrintableMeetingReport = () => {
  const { students, classes, classrooms, teachers, studentReceipts, teacherPayments, schoolInfo, examStatistics } = useSchool();

  const handlePrint = () => {
    window.print();
  };

  const totalEnrolled = students.filter(s => s.status === 'Enrolled').length;
  const totalCapacity = classes.reduce((sum, c) => sum + (c.capacity || 40), 0);
  const occupancyRate = totalCapacity > 0 ? ((totalEnrolled / totalCapacity) * 100).toFixed(1) : 0;

  const newEnrollees = students.filter(s => s.enrollmentType === 'New Enrollment').length;
  const returningStudents = students.filter(s => s.enrollmentType === 'Re-enrollment').length;

  const totalFeeRevenue = studentReceipts.reduce((sum, r) => sum + (Number(r.amount) || 0), 0);
  const totalPayroll = teacherPayments.reduce((sum, p) => sum + (Number(p.netPaid) || 0), 0);
  const netCashflow = totalFeeRevenue - totalPayroll;

  return (
    <div className="space-y-6">
      
      {/* Controls */}
      <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-200 shadow-sm no-print">
        <div>
          <h3 className="text-base font-bold text-slate-900">Executive Management Meeting Report</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Consolidated briefing document for Board of Directors & Administrative Assembly
          </p>
        </div>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 shadow-md transition-all active:scale-95"
        >
          <Printer className="w-4 h-4" />
          Print Executive Briefing
        </button>
      </div>

      {/* Printable Briefing Document */}
      <div className="printable-document bg-white p-8 rounded-2xl border-2 border-slate-300 print:border-black shadow-sm text-slate-900 space-y-6">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b-2 border-black pb-4">
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-600 print:text-black tracking-widest">
              REPUBLIC OF THE CONGO • SCHOOL COMPLEX ADMINISTRATION
            </div>
            <h2 className="text-xl font-black uppercase text-slate-900 mt-0.5">
              {schoolInfo.name}
            </h2>
            <p className="text-xs font-semibold text-slate-700">{schoolInfo.address} • {schoolInfo.city}</p>
            <p className="text-xs text-slate-500">{schoolInfo.email} • {schoolInfo.phone}</p>
          </div>
          <div className="text-right">
            <span className="font-mono text-xs font-bold px-3 py-1 bg-slate-100 border border-black rounded inline-block">
              SESSION {schoolInfo.currentAcademicYear}
            </span>
            <p className="text-xs text-slate-500 mt-2">
              Generated: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>

        {/* Title */}
        <div className="text-center py-2 bg-slate-100 print:bg-slate-100 border border-black rounded-xl">
          <h3 className="text-sm font-black uppercase tracking-wider">
            EXECUTIVE MANAGEMENT BRIEFING & PERFORMANCE REVIEW
          </h3>
          <p className="text-xs text-slate-600 mt-0.5">
            (Rapport de Synthèse et Bilan d'Activité — Direction Générale)
          </p>
        </div>

        {/* 1. Academic Demographics & Capacity */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-black pb-1">
            1. Headcount & Campus Capacity Utilization
          </h4>
          <div className="grid grid-cols-3 gap-4 text-xs">
            <div className="p-3 bg-slate-50 border border-black rounded-lg">
              <span className="text-slate-500 block text-[10px] uppercase">Active Student Headcount</span>
              <strong className="text-base font-bold font-mono">{totalEnrolled} Students</strong>
            </div>
            <div className="p-3 bg-slate-50 border border-black rounded-lg">
              <span className="text-slate-500 block text-[10px] uppercase">Campus Physical Capacity</span>
              <strong className="text-base font-bold font-mono">{totalCapacity} Desks</strong>
            </div>
            <div className="p-3 bg-slate-50 border border-black rounded-lg">
              <span className="text-slate-500 block text-[10px] uppercase">Global Occupancy Rate</span>
              <strong className="text-base font-bold font-mono">{occupancyRate}%</strong>
            </div>
          </div>
        </div>

        {/* 2. Admissions & Retention */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-black pb-1">
            2. Admissions, Intake Dynamics & Retention
          </h4>
          <div className="grid grid-cols-3 gap-4 text-xs">
            <div className="p-3 bg-slate-50 border border-black rounded-lg">
              <span className="text-slate-500 block text-[10px] uppercase">New Admissions</span>
              <strong className="text-sm font-bold">{newEnrollees} Students ({((newEnrollees / (totalEnrolled || 1)) * 100).toFixed(0)}%)</strong>
            </div>
            <div className="p-3 bg-slate-50 border border-black rounded-lg">
              <span className="text-slate-500 block text-[10px] uppercase">Returning Cohort</span>
              <strong className="text-sm font-bold">{returningStudents} Students ({((returningStudents / (totalEnrolled || 1)) * 100).toFixed(0)}%)</strong>
            </div>
            <div className="p-3 bg-slate-50 border border-black rounded-lg">
              <span className="text-slate-500 block text-[10px] uppercase">YoY Retention Rate</span>
              <strong className="text-sm font-bold text-emerald-800">95.2% Retention</strong>
            </div>
          </div>
        </div>

        {/* 3. National Examination Pass Rates */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-black pb-1">
            3. Official National State Examination Performance (MEPPSA)
          </h4>
          <table className="w-full text-xs border border-black text-left">
            <thead className="bg-slate-100 font-bold border-b border-black text-black">
              <tr>
                <th className="p-2 border-r border-black">Diploma Examination</th>
                <th className="p-2 border-r border-black">Educational Cycle</th>
                <th className="p-2 border-r border-black text-center">2024 Pass Rate</th>
                <th className="p-2 border-r border-black text-center">2025 Pass Rate</th>
                <th className="p-2 text-center">2026 Latest Results</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black font-medium">
              <tr>
                <td className="p-2 border-r border-black font-bold">CEP</td>
                <td className="p-2 border-r border-black">Primary (CM2)</td>
                <td className="p-2 border-r border-black text-center font-mono">97.6%</td>
                <td className="p-2 border-r border-black text-center font-mono">100.0%</td>
                <td className="p-2 text-center font-mono font-bold text-emerald-800">97.8% (44/45)</td>
              </tr>
              <tr>
                <td className="p-2 border-r border-black font-bold">BEPC</td>
                <td className="p-2 border-r border-black">Lower Secondary (3ème)</td>
                <td className="p-2 border-r border-black text-center font-mono">91.3%</td>
                <td className="p-2 border-r border-black text-center font-mono">93.0%</td>
                <td className="p-2 text-center font-mono font-bold text-blue-800">94.3% (83/88)</td>
              </tr>
              <tr>
                <td className="p-2 border-r border-black font-bold">Baccalauréat (Track C - Sciences)</td>
                <td className="p-2 border-r border-black">Upper Secondary (Terminale C)</td>
                <td className="p-2 border-r border-black text-center font-mono">93.3%</td>
                <td className="p-2 border-r border-black text-center font-mono">97.1%</td>
                <td className="p-2 text-center font-mono font-bold text-purple-800">97.1% (34/35)</td>
              </tr>
              <tr>
                <td className="p-2 border-r border-black font-bold">Baccalauréat (Track A - Arts)</td>
                <td className="p-2 border-r border-black">Upper Secondary (Terminale A)</td>
                <td className="p-2 border-r border-black text-center font-mono">91.4%</td>
                <td className="p-2 border-r border-black text-center font-mono">94.7%</td>
                <td className="p-2 text-center font-mono font-bold text-amber-800">95.0% (38/40)</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 4. Financial Health & Operating Cashflow */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-black pb-1">
            4. Financial Operations & Cash Flow Consolidation
          </h4>
          <div className="grid grid-cols-3 gap-4 text-xs">
            <div className="p-3 bg-slate-50 border border-black rounded-lg">
              <span className="text-slate-500 block text-[10px] uppercase">Tuition Fee Revenue</span>
              <strong className="text-sm font-bold font-mono text-emerald-800">{totalFeeRevenue.toLocaleString()} FCFA</strong>
            </div>
            <div className="p-3 bg-slate-50 border border-black rounded-lg">
              <span className="text-slate-500 block text-[10px] uppercase">Teacher Payroll Disbursed</span>
              <strong className="text-sm font-bold font-mono text-purple-800">{totalPayroll.toLocaleString()} FCFA</strong>
            </div>
            <div className="p-3 bg-slate-50 border border-black rounded-lg">
              <span className="text-slate-500 block text-[10px] uppercase">Net Cashflow Surplus</span>
              <strong className="text-sm font-bold font-mono text-slate-900">{netCashflow.toLocaleString()} FCFA</strong>
            </div>
          </div>
        </div>

        {/* Signatures */}
        <div className="grid grid-cols-2 gap-8 pt-6 text-xs">
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-500">Chief Accountant:</p>
            <p className="font-bold text-slate-800 mt-1">Cécile Bantsimba</p>
            <div className="h-10 border-b border-dashed border-slate-400"></div>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase font-bold text-slate-500">Executive Director / Principal:</p>
            <p className="font-bold text-slate-800 mt-1">Dr. Cédric Mboutou</p>
            <p className="text-[10px] text-slate-400 italic mt-4">[Official School Seal]</p>
          </div>
        </div>

      </div>

    </div>
  );
};
