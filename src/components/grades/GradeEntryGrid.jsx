import React, { useState, useEffect, useMemo } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import {
  FileSpreadsheet,
  Save,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Download,
  Filter,
  Layers,
  Sparkles
} from 'lucide-react';

export const GradeEntryGrid = () => {
  const { classes, subjects, students, grades, saveBatchGrades, schoolInfo } = useSchool();
  const { showSuccess, showWarning } = useToast();
  const { user, activeTeacherId } = useAuth();

  const [selectedClassId, setSelectedClassId] = useState(classes[0]?.id || '');
  const [selectedSubjectId, setSelectedSubjectId] = useState(subjects[0]?.id || '');
  const [selectedTerm, setSelectedTerm] = useState('Term 1');

  const selectedClass = classes.find(c => c.id === selectedClassId);
  const selectedSubject = subjects.find(s => s.id === selectedSubjectId);

  const caWeight = selectedSubject?.caWeight !== undefined ? selectedSubject.caWeight : 40;
  const examWeight = selectedSubject?.examWeight !== undefined ? selectedSubject.examWeight : 60;

  // Active students in this class
  const classStudents = useMemo(() => {
    return students.filter(s => s.classId === selectedClassId && s.status === 'Enrolled');
  }, [students, selectedClassId]);

  // Local grid state for fast keyboard data entry
  const [gridData, setGridData] = useState({});

  useEffect(() => {
    const initialMap = {};
    classStudents.forEach(student => {
      const existingGrade = grades.find(
        g => g.studentId === student.id &&
             g.subjectId === selectedSubjectId &&
             g.term === selectedTerm &&
             g.academicYear === schoolInfo.currentAcademicYear
      );

      const ca = existingGrade ? existingGrade.caScore : '';
      const exam = existingGrade ? existingGrade.examScore : '';
      let avg = '';
      if (ca !== '' && exam !== '') {
        avg = parseFloat(((Number(ca) * (caWeight / 100)) + (Number(exam) * (examWeight / 100))).toFixed(2));
      }

      initialMap[student.id] = {
        caScore: ca,
        examScore: exam,
        average: avg,
        teacherComment: existingGrade?.teacherComment || ''
      };
    });
    setGridData(initialMap);
  }, [selectedClassId, selectedSubjectId, selectedTerm, classStudents, grades, caWeight, examWeight, schoolInfo]);

  const handleCellChange = (studentId, field, value) => {
    // Validate grade range (0 to 20)
    let numVal = value;
    if (field === 'caScore' || field === 'examScore') {
      if (value !== '') {
        const parsed = parseFloat(value);
        if (isNaN(parsed) || parsed < 0 || parsed > 20) {
          return; // ignore invalid inputs outside 0-20
        }
        numVal = parsed;
      }
    }

    setGridData(prev => {
      const current = prev[studentId] || { caScore: '', examScore: '', average: '', teacherComment: '' };
      const updated = { ...current, [field]: numVal };

      if (updated.caScore !== '' && updated.examScore !== '') {
        updated.average = parseFloat(
          ((Number(updated.caScore) * (caWeight / 100)) + (Number(updated.examScore) * (examWeight / 100))).toFixed(2)
        );
      } else {
        updated.average = '';
      }

      return { ...prev, [studentId]: updated };
    });
  };

  const handleSaveAll = () => {
    const listToSave = [];
    Object.entries(gridData).forEach(([studentId, data]) => {
      if (data.caScore !== '' || data.examScore !== '') {
        listToSave.push({
          studentId,
          classId: selectedClassId,
          subjectId: selectedSubjectId,
          term: selectedTerm,
          academicYear: schoolInfo.currentAcademicYear,
          caScore: Number(data.caScore) || 0,
          examScore: Number(data.examScore) || 0,
          average: Number(data.average) || 0,
          teacherComment: data.teacherComment || ''
        });
      }
    });

    if (listToSave.length === 0) {
      showWarning('No grades entered to save.');
      return;
    }

    saveBatchGrades(listToSave, user.name);
    showSuccess(`Successfully recorded grades for ${listToSave.length} students in ${selectedSubject?.name}!`);
  };

  // Export current grade sheet to CSV
  const handleExportGrid = () => {
    const headers = ['Student ID', 'Full Name', 'Continuous Assessment (CA / 20)', 'Exam Grade (/ 20)', 'Calculated Average (/ 20)', 'Teacher Comments'];
    const rows = classStudents.map(s => {
      const cell = gridData[s.id] || {};
      return [
        s.id,
        `${s.firstName} ${s.lastName}`,
        cell.caScore !== '' ? cell.caScore : '-',
        cell.examScore !== '' ? cell.examScore : '-',
        cell.average !== '' ? cell.average : '-',
        cell.teacherComment || ''
      ].map(v => `"${v}"`).join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encoded = encodeURI(csvContent);
    const link = document.createElement('a');
    link.href = encoded;
    link.download = `Grades_${selectedClass?.name}_${selectedSubject?.code}_${selectedTerm}.csv`;
    link.click();
    showSuccess('Grades sheet exported to CSV.');
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Teacher Grade Records (Spreadsheet Grid)</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Digital equivalent of paper grade sheets: enter Continuous Assessment & Exam marks with instant average weighting
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportGrid}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-sm"
          >
            <Download className="w-4 h-4 text-slate-500" />
            Export Sheet
          </button>

          <button
            onClick={handleSaveAll}
            className="flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white shadow-lg shadow-teal-900/20 active:scale-[0.98] transition-all"
          >
            <Save className="w-4 h-4" />
            Save Grade Sheet
          </button>
        </div>
      </div>

      {/* Selector Controls */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-center gap-4">
        
        {/* Class */}
        <div className="w-full md:w-1/3">
          <label className="block text-xs font-semibold text-slate-700 mb-1">Target Class *</label>
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="w-full text-xs font-semibold rounded-xl border border-slate-300 px-3 py-2 bg-slate-50 focus:bg-white"
          >
            {classes.map(c => (
              <option key={c.id} value={c.id}>
                {c.name} ({students.filter(s => s.classId === c.id).length} students)
              </option>
            ))}
          </select>
        </div>

        {/* Subject */}
        <div className="w-full md:w-1/3">
          <label className="block text-xs font-semibold text-slate-700 mb-1">Subject / Discipline *</label>
          <select
            value={selectedSubjectId}
            onChange={(e) => setSelectedSubjectId(e.target.value)}
            className="w-full text-xs font-semibold rounded-xl border border-slate-300 px-3 py-2 bg-slate-50 focus:bg-white"
          >
            {subjects
              .filter(s => !s.applicableCycles || s.applicableCycles.includes(selectedClass?.cycleId))
              .map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.code} - Coeff: {s.defaultWeight})
                </option>
              ))}
          </select>
        </div>

        {/* Term */}
        <div className="w-full md:w-1/3">
          <label className="block text-xs font-semibold text-slate-700 mb-1">Evaluation Period *</label>
          <select
            value={selectedTerm}
            onChange={(e) => setSelectedTerm(e.target.value)}
            className="w-full text-xs font-semibold rounded-xl border border-slate-300 px-3 py-2 bg-slate-50 focus:bg-white"
          >
            <option value="Term 1">1st Trimester (Premier Trimestre)</option>
            <option value="Term 2">2nd Trimester (Deuxième Trimestre)</option>
            <option value="Term 3">3rd Trimester (Troisième Trimestre)</option>
          </select>
        </div>

      </div>

      {/* Formula & Weighting Banner */}
      <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl flex items-center justify-between text-xs text-teal-900">
        <div className="flex items-center gap-2 font-medium">
          <Sparkles className="w-4 h-4 text-teal-600" />
          <span>Active Subject Calculation Formula:</span>
          <code className="bg-white/80 px-2 py-0.5 rounded font-mono font-bold text-teal-800 border border-teal-200">
            Average = (CA × {caWeight}%) + (Exam × {examWeight}%)
          </code>
        </div>
        <span className="text-[11px] text-teal-700 font-semibold">
          Grading Scale: 0.00 to 20.00
        </span>
      </div>

      {/* Grade Entry Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <span className="text-xs font-bold text-slate-700">
            Enrolled Students in {selectedClass?.name}: <strong className="text-teal-700">{classStudents.length}</strong>
          </span>
          <span className="text-[11px] text-slate-500 font-medium">
            Subject: <strong>{selectedSubject?.name}</strong> • {selectedTerm}
          </span>
        </div>

        {classStudents.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            No students enrolled in this class.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200/80 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4 w-12 text-center">#</th>
                  <th className="py-3 px-4">Student ID & Name</th>
                  <th className="py-3 px-4 w-40 text-center">
                    Continuous Assessment (CA / 20)
                    <span className="block text-[9px] text-slate-400 font-normal">Weight: {caWeight}%</span>
                  </th>
                  <th className="py-3 px-4 w-40 text-center">
                    Terminal Exam (/ 20)
                    <span className="block text-[9px] text-slate-400 font-normal">Weight: {examWeight}%</span>
                  </th>
                  <th className="py-3 px-4 w-32 text-center">
                    Subject Average (/ 20)
                    <span className="block text-[9px] text-slate-400 font-normal">Auto-calculated</span>
                  </th>
                  <th className="py-3 px-4">Appraisal / Teacher Note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {classStudents.map((student, idx) => {
                  const data = gridData[student.id] || { caScore: '', examScore: '', average: '', teacherComment: '' };
                  const isPassing = data.average !== '' && Number(data.average) >= 10;

                  return (
                    <tr key={student.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4 text-center font-bold text-slate-400">{idx + 1}</td>
                      
                      {/* Name */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{student.firstName} {student.lastName}</div>
                        <span className="font-mono text-[11px] text-slate-500">{student.id}</span>
                      </td>

                      {/* CA Score */}
                      <td className="py-3 px-4 text-center">
                        <input
                          type="number"
                          step="0.25"
                          min="0"
                          max="20"
                          placeholder="0.00"
                          value={data.caScore}
                          onChange={(e) => handleCellChange(student.id, 'caScore', e.target.value)}
                          className="w-24 text-center font-mono font-bold text-sm border border-slate-300 rounded-xl px-2 py-1.5 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white"
                        />
                      </td>

                      {/* Exam Score */}
                      <td className="py-3 px-4 text-center">
                        <input
                          type="number"
                          step="0.25"
                          min="0"
                          max="20"
                          placeholder="0.00"
                          value={data.examScore}
                          onChange={(e) => handleCellChange(student.id, 'examScore', e.target.value)}
                          className="w-24 text-center font-mono font-bold text-sm border border-slate-300 rounded-xl px-2 py-1.5 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white"
                        />
                      </td>

                      {/* Calculated Average */}
                      <td className="py-3 px-4 text-center">
                        {data.average !== '' ? (
                          <span className={`inline-block font-mono font-black text-sm px-3 py-1 rounded-xl border ${
                            isPassing
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : 'bg-rose-50 text-rose-800 border-rose-200'
                          }`}>
                            {Number(data.average).toFixed(2)}
                          </span>
                        ) : (
                          <span className="text-slate-300 font-mono text-xs">--</span>
                        )}
                      </td>

                      {/* Teacher Comment */}
                      <td className="py-3 px-4">
                        <input
                          type="text"
                          placeholder="e.g. Good progress, active participation..."
                          value={data.teacherComment}
                          onChange={(e) => handleCellChange(student.id, 'teacherComment', e.target.value)}
                          className="w-full text-xs border border-slate-200 rounded-xl px-3 py-1.5 bg-slate-50 focus:bg-white"
                        />
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
