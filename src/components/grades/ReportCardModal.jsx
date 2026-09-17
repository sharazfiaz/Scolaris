import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { Printer, Download, School, Award, FileSpreadsheet, CheckCircle2 } from 'lucide-react';

export const ReportCardModal = ({ isOpen, onClose, studentId, initialTerm = 'Term 1' }) => {
  const { students, schoolInfo, calculateStudentReportCard } = useSchool();
  const [term, setTerm] = useState(initialTerm);

  const student = students.find(s => s.id === studentId);
  if (!student) return null;

  const cardData = calculateStudentReportCard(student.id, term, schoolInfo.currentAcademicYear);
  if (!cardData) return null;

  const handlePrint = () => {
    window.print();
  };

  const isPassing = cardData.overallAverage >= 10;
  
  // Congolese Academic Honor distinctions
  let distinction = 'Needs Improvement';
  if (cardData.overallAverage >= 16) distinction = 'Very Good (Très Bien) — Honors';
  else if (cardData.overallAverage >= 14) distinction = 'Good (Bien) — Encouragement';
  else if (cardData.overallAverage >= 12) distinction = 'Fairly Good (Assez Bien)';
  else if (cardData.overallAverage >= 10) distinction = 'Pass (Passable)';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Official Term Report Card"
      subtitle={`Academic Performance & Class Ranking for ${student.firstName} ${student.lastName}`}
      maxWidth="max-w-4xl"
    >
      <div className="space-y-6">
        
        {/* Controls Bar (Hidden in Print) */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl no-print">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-700">Evaluation Period:</span>
            <select
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              className="text-xs font-bold rounded-lg border border-slate-300 px-3 py-1.5 bg-white"
            >
              <option value="Term 1">1st Trimester (Premier Trimestre)</option>
              <option value="Term 2">2nd Trimester (Deuxième Trimestre)</option>
              <option value="Term 3">3rd Trimester (Troisième Trimestre)</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-md transition-all active:scale-95"
            >
              <Printer className="w-3.5 h-3.5" />
              Print Official Report Card
            </button>
          </div>
        </div>

        {/* ================= PRINTABLE OFFICIAL REPORT CARD (A4 Optimized) ================= */}
        <div className="printable-document p-8 bg-white border-2 border-slate-300 print:border-black rounded-2xl shadow-sm text-slate-900 space-y-6">
          
          {/* Official Header */}
          <div className="flex items-start justify-between border-b-2 border-black pb-4">
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-600 print:text-black tracking-widest">
                REPUBLIC OF THE CONGO • MINISTRY OF PRIMARY & SECONDARY EDUCATION (MEPPSA)
              </div>
              <h2 className="text-xl font-black uppercase tracking-tight text-slate-900 mt-0.5">
                {schoolInfo.name}
              </h2>
              <p className="text-xs font-semibold text-slate-700">{schoolInfo.address}</p>
              <p className="text-xs text-slate-600">{schoolInfo.phone} • {schoolInfo.email}</p>
            </div>
            
            <div className="text-right">
              <div className="inline-block px-3 py-1 bg-slate-100 print:bg-white border border-black rounded text-xs font-bold font-mono">
                SESSION: {schoolInfo.currentAcademicYear}
              </div>
              <div className="text-xs font-bold uppercase mt-2 text-teal-900 print:text-black">
                {term.toUpperCase()} REPORT CARD
              </div>
            </div>
          </div>

          {/* Student Dossier Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50/80 print:bg-white p-4 rounded-xl border border-black text-xs">
            <div>
              <span className="text-slate-500 print:text-black text-[10px] uppercase font-semibold block">Student Name:</span>
              <strong className="text-sm font-bold">{student.lastName.toUpperCase()}, {student.firstName}</strong>
            </div>
            <div>
              <span className="text-slate-500 print:text-black text-[10px] uppercase font-semibold block">Student ID:</span>
              <strong className="font-mono text-sm">{student.id}</strong>
            </div>
            <div>
              <span className="text-slate-500 print:text-black text-[10px] uppercase font-semibold block">Class / Track:</span>
              <strong className="text-sm font-bold">
                {cardData.studentClass?.name} {cardData.track ? `(${cardData.track.code})` : ''}
              </strong>
            </div>
            <div>
              <span className="text-slate-500 print:text-black text-[10px] uppercase font-semibold block">Date & Place of Birth:</span>
              <span className="font-semibold">{student.dateOfBirth} ({student.placeOfBirth})</span>
            </div>
          </div>

          {/* Academic Grades Table */}
          <div>
            <table className="w-full text-left text-xs border border-black">
              <thead className="bg-slate-100 print:bg-slate-100 font-bold border-b border-black text-black">
                <tr>
                  <th className="p-2 border-r border-black">Subjects / Disciplines</th>
                  <th className="p-2 border-r border-black text-center w-16">Coeff</th>
                  <th className="p-2 border-r border-black text-center w-20">CA (/20)</th>
                  <th className="p-2 border-r border-black text-center w-20">Exam (/20)</th>
                  <th className="p-2 border-r border-black text-center w-24">Subject Avg (/20)</th>
                  <th className="p-2 border-r border-black text-center w-24">Weighted (Avg×Coeff)</th>
                  <th className="p-2">Teacher Remarks & Appraisal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black">
                {cardData.subjectRows.map((row, index) => {
                  const hasGrade = row.average !== null;
                  return (
                    <tr key={index} className="font-medium">
                      <td className="p-2 border-r border-black font-bold text-slate-900">
                        {row.subject.name}
                      </td>
                      <td className="p-2 border-r border-black text-center font-bold font-mono">
                        {row.coeff}
                      </td>
                      <td className="p-2 border-r border-black text-center font-mono">
                        {row.caScore !== null ? Number(row.caScore).toFixed(2) : '-'}
                      </td>
                      <td className="p-2 border-r border-black text-center font-mono">
                        {row.examScore !== null ? Number(row.examScore).toFixed(2) : '-'}
                      </td>
                      <td className="p-2 border-r border-black text-center font-mono font-bold">
                        {hasGrade ? Number(row.average).toFixed(2) : '-'}
                      </td>
                      <td className="p-2 border-r border-black text-center font-mono font-bold">
                        {row.weightedAverage !== null ? Number(row.weightedAverage).toFixed(2) : '-'}
                      </td>
                      <td className="p-2 text-slate-700 print:text-black text-[11px] italic">
                        {row.teacherComment || 'Satisfactory academic participation.'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot className="border-t-2 border-black bg-slate-100 font-bold text-xs">
                <tr>
                  <td className="p-2 border-r border-black font-black uppercase">Totals & Coefficients:</td>
                  <td className="p-2 border-r border-black text-center font-black">{cardData.totalCoefficients}</td>
                  <td colSpan="3" className="p-2 border-r border-black text-right uppercase">Total Weighted Score:</td>
                  <td className="p-2 border-r border-black text-center font-black text-sm">{cardData.totalWeightedScore}</td>
                  <td className="p-2"></td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Academic Deliberation & Rank Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border border-black p-4 rounded-xl bg-slate-50 print:bg-white text-xs">
            {/* Student General Average */}
            <div className="text-center p-3 bg-white border border-black rounded-lg">
              <span className="text-[10px] uppercase font-bold text-slate-500 print:text-black block">Overall Term Average:</span>
              <span className="text-2xl font-black text-slate-900 block font-mono mt-1">
                {cardData.overallAverage.toFixed(2)} <span className="text-sm">/ 20</span>
              </span>
              <span className={`inline-block text-[11px] font-bold mt-1 px-2 py-0.5 rounded border border-black ${
                isPassing ? 'bg-emerald-100 text-emerald-900' : 'bg-rose-100 text-rose-900'
              }`}>
                {isPassing ? 'PASSED (ADMIS)' : 'INSUFFICIENT'}
              </span>
            </div>

            {/* Class Ranking */}
            <div className="text-center p-3 bg-white border border-black rounded-lg">
              <span className="text-[10px] uppercase font-bold text-slate-500 print:text-black block">Class Rank:</span>
              <span className="text-2xl font-black text-slate-900 block font-mono mt-1">
                {cardData.rank} <span className="text-sm text-slate-500 font-normal">/ {cardData.totalStudentsInClass}</span>
              </span>
              <span className="text-[11px] text-slate-600 block mt-1 font-semibold">
                Honor: {distinction}
              </span>
            </div>

            {/* Class Statistics */}
            <div className="p-3 bg-white border border-black rounded-lg text-[11px] space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-500 print:text-black block mb-1">Class Statistics:</span>
              <div className="flex justify-between">
                <span>Class Average (Moyenne):</span>
                <strong>{cardData.classMean.toFixed(2)} / 20</strong>
              </div>
              <div className="flex justify-between">
                <span>Highest Average (Plus Forte):</span>
                <strong>{cardData.highestAverage.toFixed(2)} / 20</strong>
              </div>
              <div className="flex justify-between">
                <span>Lowest Average (Plus Faible):</span>
                <strong>{cardData.lowestAverage.toFixed(2)} / 20</strong>
              </div>
            </div>
          </div>

          {/* Final Institutional Signatures & Deliberation Remarks */}
          <div className="grid grid-cols-2 gap-8 pt-6 text-xs">
            <div className="border border-black p-4 rounded-xl min-h-[110px] flex flex-col justify-between">
              <p className="font-bold uppercase text-[10px]">Homeroom Teacher / Class Council Appraisal:</p>
              <p className="text-xs italic text-slate-700 font-serif">
                {cardData.overallAverage >= 12
                  ? 'Strong academic dedication. Encourage sustained effort in final state examination preparations.'
                  : 'Regular attendance observed. Needs greater rigor in scientific revisions and coursework.'}
              </p>
              <p className="text-right text-[10px] text-slate-400 italic">Signature</p>
            </div>

            <div className="border border-black p-4 rounded-xl min-h-[110px] flex flex-col justify-between text-right">
              <div>
                <p className="font-bold uppercase text-[10px]">Headmaster / Principal Decision:</p>
                <p className="text-xs font-bold text-slate-900 mt-1">
                  {cardData.overallAverage >= 10 ? 'Admitted to Continue (Tableau d\'Honneur)' : 'Academic Warning (Avertissement)'}
                </p>
              </div>
              <p className="text-[10px] text-slate-400 italic text-center">[Official School Stamp & Seal]</p>
            </div>
          </div>

        </div>

      </div>
    </Modal>
  );
};
