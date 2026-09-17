import React, { useState, useMemo } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { useToast } from '../../context/ToastContext';
import { Badge } from '../common/Badge';
import { TeacherFormModal } from './TeacherFormModal';
import { TeacherAssignmentModal } from './TeacherAssignmentModal';
import { TeacherHoursStatement } from './TeacherHoursStatement';
import { TeacherPayCalculator } from './TeacherPayCalculator';
import {
  GraduationCap,
  Plus,
  Search,
  Clock,
  DollarSign,
  FileText,
  Edit,
  Trash2,
  Layers,
  Phone,
  Mail,
  Calculator,
  UserCheck
} from 'lucide-react';

export const TeacherList = () => {
  const { teachers, classes, subjects, deleteTeacher, calculateTeacherMonthlyPay } = useSchool();
  const { showSuccess } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCycle, setSelectedCycle] = useState('all');

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [teacherToEdit, setTeacherToEdit] = useState(null);

  const [isAssignmentOpen, setIsAssignmentOpen] = useState(false);
  const [selectedTeacherId, setSelectedTeacherId] = useState(null);

  const [isStatementOpen, setIsStatementOpen] = useState(false);
  const [statementTeacherId, setStatementTeacherId] = useState(null);

  const [isPayCalcOpen, setIsPayCalcOpen] = useState(false);
  const [payCalcTeacherId, setPayCalcTeacherId] = useState(null);

  const filteredTeachers = useMemo(() => {
    return teachers.filter(t => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = `${t.firstName} ${t.lastName}`.toLowerCase().includes(q);
        const matchEmail = t.email?.toLowerCase().includes(q);
        const matchPhone = t.phone?.includes(q);
        if (!matchName && !matchEmail && !matchPhone) return false;
      }
      if (selectedCycle !== 'all' && !t.cycles?.includes(selectedCycle)) {
        return false;
      }
      return true;
    });
  }, [teachers, searchQuery, selectedCycle]);

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to remove teacher ${name}?`)) {
      deleteTeacher(id);
      showSuccess(`Teacher ${name} removed.`);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Faculty & Teacher Management</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage teaching staff, workload assignments, certified hours statements, and cycle-based payroll
          </p>
        </div>

        <button
          onClick={() => { setTeacherToEdit(null); setIsFormOpen(true); }}
          className="flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white shadow-lg shadow-teal-900/20 active:scale-[0.98] transition-all"
        >
          <Plus className="w-4 h-4" />
          Add New Teacher
        </button>
      </div>

      {/* Filter Bar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search teachers by name, email, phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs sm:text-sm pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div className="w-full sm:w-56">
          <select
            value={selectedCycle}
            onChange={(e) => setSelectedCycle(e.target.value)}
            className="w-full text-xs font-semibold rounded-xl border border-slate-200 px-3 py-2 bg-slate-50 focus:bg-white"
          >
            <option value="all">All Teaching Cycles</option>
            <option value="preschool">Preschool</option>
            <option value="primary">Primary Education</option>
            <option value="lower_secondary">Lower Secondary (1st Cycle)</option>
            <option value="upper_secondary">Upper Secondary (2nd Cycle)</option>
          </select>
        </div>
      </div>

      {/* Teachers Grid / Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <span className="text-xs font-bold text-slate-700">
            Total Staff: <strong className="text-teal-700">{filteredTeachers.length}</strong> Instructors
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200/80 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Instructor Name & Contact</th>
                <th className="py-3 px-4">Cycles & Subjects</th>
                <th className="py-3 px-4">Compensation Model</th>
                <th className="py-3 px-4 text-center">Workload / Homeroom</th>
                <th className="py-3 px-4 text-right">Est. Monthly Pay</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTeachers.map((teacher) => {
                const paySummary = calculateTeacherMonthlyPay(teacher);
                const homeroom = classes.find(c => c.id === teacher.homeroomClassId);

                return (
                  <tr key={teacher.id} className="hover:bg-slate-50/80 transition-colors group">
                    
                    {/* Name & Contact */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-800 font-bold flex items-center justify-center text-xs flex-shrink-0">
                          {teacher.firstName.charAt(0)}{teacher.lastName.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-sm">
                            {teacher.firstName} {teacher.lastName}
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono flex items-center gap-2 mt-0.5">
                            <span>{teacher.phone || 'No phone'}</span>
                            {teacher.email && <span>• {teacher.email}</span>}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Cycles & Subjects */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1 mb-1">
                        {(teacher.cycles || []).map(c => (
                          <span key={c} className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 capitalize">
                            {c.replace('_', ' ')}
                          </span>
                        ))}
                      </div>
                      {teacher.subjects && teacher.subjects.length > 0 && (
                        <div className="text-[11px] text-teal-700 font-medium">
                          {teacher.subjects.map(sId => subjects.find(s => s.id === sId)?.name).filter(Boolean).join(', ')}
                        </div>
                      )}
                    </td>

                    {/* Pay Type */}
                    <td className="py-3.5 px-4">
                      <Badge variant={teacher.payType === 'fixed' ? 'primary' : 'purple'} size="sm">
                        {teacher.payType === 'fixed' ? 'Fixed Salary' : 'Hourly Pay'}
                      </Badge>
                      <div className="text-[11px] text-slate-500 font-semibold mt-1">
                        {teacher.payType === 'fixed'
                          ? `${(teacher.monthlySalary || 0).toLocaleString()} FCFA/mo`
                          : `${(teacher.hourlyRate || 0).toLocaleString()} FCFA/hr`}
                      </div>
                    </td>

                    {/* Workload */}
                    <td className="py-3.5 px-4 text-center">
                      {teacher.payType === 'fixed' ? (
                        <span className="text-xs font-semibold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg">
                          Homeroom: {homeroom?.name || 'Assigned'}
                        </span>
                      ) : (
                        <div>
                          <span className="text-xs font-bold text-teal-900 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200">
                            {paySummary.weeklyHours} hrs/wk ({paySummary.monthlyHours} hrs/mo)
                          </span>
                          <div className="text-[10px] text-slate-500 mt-1">
                            {(teacher.assignments || []).length} Class Assignments
                          </div>
                        </div>
                      )}
                    </td>

                    {/* Monthly Pay Estimate */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="font-bold text-slate-900 text-sm">
                        {paySummary.gross.toLocaleString()} FCFA
                      </div>
                      <span className="text-[10px] text-slate-400">Gross Monthly</span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => { setSelectedTeacherId(teacher.id); setIsAssignmentOpen(true); }}
                          title="Assign Classes & Workload Hours"
                          className="p-1.5 text-slate-500 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-colors"
                        >
                          <Layers className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => { setStatementTeacherId(teacher.id); setIsStatementOpen(true); }}
                          title="Print Certified Hours Statement"
                          className="p-1.5 text-slate-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <FileText className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => { setPayCalcTeacherId(teacher.id); setIsPayCalcOpen(true); }}
                          title="Calculate Pay & Generate Pay Slip"
                          className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                        >
                          <Calculator className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => { setTeacherToEdit(teacher); setIsFormOpen(true); }}
                          title="Edit Teacher Profile"
                          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDelete(teacher.id, `${teacher.firstName} ${teacher.lastName}`)}
                          title="Delete Teacher"
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {isFormOpen && (
        <TeacherFormModal
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          teacherToEdit={teacherToEdit}
        />
      )}

      {isAssignmentOpen && selectedTeacherId && (
        <TeacherAssignmentModal
          isOpen={isAssignmentOpen}
          onClose={() => { setIsAssignmentOpen(false); setSelectedTeacherId(null); }}
          teacherId={selectedTeacherId}
        />
      )}

      {isStatementOpen && statementTeacherId && (
        <TeacherHoursStatement
          isOpen={isStatementOpen}
          onClose={() => { setIsStatementOpen(false); setStatementTeacherId(null); }}
          teacherId={statementTeacherId}
        />
      )}

      {isPayCalcOpen && payCalcTeacherId && (
        <TeacherPayCalculator
          isOpen={isPayCalcOpen}
          onClose={() => { setIsPayCalcOpen(false); setPayCalcTeacherId(null); }}
          teacherId={payCalcTeacherId}
        />
      )}

    </div>
  );
};
