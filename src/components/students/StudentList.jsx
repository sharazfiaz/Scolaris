import React, { useState, useMemo } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { useToast } from '../../context/ToastContext';
import { Badge } from '../common/Badge';
import {
  Search,
  Plus,
  RotateCcw,
  Users2,
  CreditCard,
  FileSpreadsheet,
  Receipt,
  Download,
  Filter,
  Trash2,
  Eye,
  SlidersHorizontal,
  GraduationCap
} from 'lucide-react';

export const StudentList = ({
  onOpenEnrollModal,
  onOpenReenrollModal,
  onOpenSiblingModal,
  onSelectStudent,
  onOpenIdCard,
  onOpenReportCard,
  onOpenPaymentDesk
}) => {
  const { students, classes, cycles, tracks, deleteStudent, schoolInfo } = useSchool();
  const { showSuccess, showWarning } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCycle, setSelectedCycle] = useState('all');
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedFeeStatus, setSelectedFeeStatus] = useState('all');
  const [selectedEnrollType, setSelectedEnrollType] = useState('all');

  // Filtered student list
  const filteredStudents = useMemo(() => {
    return students.filter(s => {
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = `${s.firstName} ${s.lastName}`.toLowerCase().includes(q);
        const matchesId = s.id.toLowerCase().includes(q);
        const matchesFather = s.guardians?.father?.name?.toLowerCase().includes(q);
        const matchesMother = s.guardians?.mother?.name?.toLowerCase().includes(q);
        const matchesPhone = s.guardians?.father?.phone?.includes(q) || s.guardians?.mother?.phone?.includes(q);
        if (!matchesName && !matchesId && !matchesFather && !matchesMother && !matchesPhone) return false;
      }

      // Cycle filter
      if (selectedCycle !== 'all' && s.cycleId !== selectedCycle) {
        const cls = classes.find(c => c.id === s.classId);
        if (cls?.cycleId !== selectedCycle) return false;
      }

      // Class filter
      if (selectedClass !== 'all' && s.classId !== selectedClass) return false;

      // Fee status filter
      if (selectedFeeStatus !== 'all') {
        const status = s.feeStatus?.paymentStatus || 'Unpaid';
        if (selectedFeeStatus !== status) return false;
      }

      // Enrollment type filter
      if (selectedEnrollType !== 'all') {
        if (s.enrollmentType !== selectedEnrollType) return false;
      }

      return true;
    });
  }, [students, classes, searchQuery, selectedCycle, selectedClass, selectedFeeStatus, selectedEnrollType]);

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ['Student ID', 'First Name', 'Last Name', 'Gender', 'DOB', 'Cycle', 'Class', 'Track', 'Enrollment Type', 'Total Fees Due', 'Fees Paid', 'Balance', 'Father Name', 'Father Phone'];
    const rows = filteredStudents.map(s => {
      const cls = classes.find(c => c.id === s.classId);
      const trk = tracks.find(t => t.id === s.trackId);
      return [
        s.id,
        s.firstName,
        s.lastName,
        s.gender,
        s.dateOfBirth,
        cls?.cycleId || s.cycleId,
        cls?.name || '',
        trk?.code || '',
        s.enrollmentType,
        s.feeStatus?.totalDue || 0,
        s.feeStatus?.paid || 0,
        s.feeStatus?.balance || 0,
        s.guardians?.father?.name || '',
        s.guardians?.father?.phone || ''
      ].map(val => `"${val}"`).join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SCOLARIS_Students_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showSuccess(`Exported ${filteredStudents.length} student records to CSV.`);
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to remove student ${name} (${id})?`)) {
      deleteStudent(id);
      showSuccess(`Student ${name} removed.`);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Student Directory & Admissions</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage student registrations, classroom assignments, sibling networks, and school records
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-sm transition-colors"
          >
            <Download className="w-4 h-4 text-slate-500" />
            Export CSV
          </button>

          <button
            onClick={onOpenSiblingModal}
            className="flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 shadow-sm transition-colors"
          >
            <Users2 className="w-4 h-4 text-purple-600" />
            Link Siblings
          </button>

          <button
            onClick={onOpenReenrollModal}
            className="flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 shadow-sm transition-colors"
          >
            <RotateCcw className="w-4 h-4 text-blue-600" />
            Re-enroll Student
          </button>

          <button
            onClick={onOpenEnrollModal}
            className="flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white shadow-lg shadow-teal-900/20 active:scale-[0.98] transition-all"
          >
            <Plus className="w-4 h-4" />
            New Enrollment
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          
          {/* Search Box */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by student name, ID (ES-2026-...), guardian or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs sm:text-sm pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            />
          </div>

          {/* Cycle Filter */}
          <div className="w-full md:w-48">
            <select
              value={selectedCycle}
              onChange={(e) => {
                setSelectedCycle(e.target.value);
                setSelectedClass('all');
              }}
              className="w-full text-xs font-semibold rounded-xl border border-slate-200 px-3 py-2 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-teal-500"
            >
              <option value="all">All Education Cycles</option>
              {cycles.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Class Filter */}
          <div className="w-full md:w-48">
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full text-xs font-semibold rounded-xl border border-slate-200 px-3 py-2 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-teal-500"
            >
              <option value="all">All Classes / Cohorts</option>
              {classes
                .filter(c => selectedCycle === 'all' || c.cycleId === selectedCycle)
                .map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
            </select>
          </div>

          {/* Fee Status Filter */}
          <div className="w-full md:w-44">
            <select
              value={selectedFeeStatus}
              onChange={(e) => setSelectedFeeStatus(e.target.value)}
              className="w-full text-xs font-semibold rounded-xl border border-slate-200 px-3 py-2 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-teal-500"
            >
              <option value="all">All Fee Statuses</option>
              <option value="Fully Paid">Fully Paid</option>
              <option value="Partial">Partial Balance</option>
              <option value="Unpaid">Unpaid</option>
            </select>
          </div>

        </div>
      </div>

      {/* Students Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <span className="text-xs font-bold text-slate-700">
            Showing <strong className="text-teal-700">{filteredStudents.length}</strong> enrolled students
          </span>
          <span className="text-[11px] text-slate-500 font-medium">
            Academic Session: {schoolInfo.currentAcademicYear}
          </span>
        </div>

        {filteredStudents.length === 0 ? (
          <div className="p-12 text-center">
            <GraduationCap className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h4 className="text-sm font-bold text-slate-800">No student records found</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Try adjusting your search criteria or register a new student using the button above.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200/80 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Student ID & Name</th>
                  <th className="py-3 px-4">Class / Track</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Legal Guardian Contact</th>
                  <th className="py-3 px-4 text-right">Fee Status</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map((student) => {
                  const currentClass = classes.find(c => c.id === student.classId);
                  const track = student.trackId ? tracks.find(t => t.id === student.trackId) : null;
                  const fee = student.feeStatus || { totalDue: 0, paid: 0, balance: 0, paymentStatus: 'Unpaid' };
                  const isSiblingsLinked = student.siblings && student.siblings.length > 0;

                  return (
                    <tr
                      key={student.id}
                      className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                      onClick={() => onSelectStudent(student.id)}
                    >
                      {/* ID & Name */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-800 font-bold flex items-center justify-center text-xs flex-shrink-0">
                            {student.firstName.charAt(0)}{student.lastName.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 text-sm group-hover:text-teal-700 transition-colors">
                              {student.firstName} {student.lastName}
                            </div>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="font-mono text-[11px] text-teal-700 font-semibold">{student.id}</span>
                              <span className="text-slate-400">•</span>
                              <span className="text-slate-500 text-[11px]">{student.gender}</span>
                              {isSiblingsLinked && (
                                <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-purple-700 bg-purple-100 px-1.5 py-0.2 rounded" title={`${student.siblings.length} sibling(s) linked`}>
                                  <Users2 className="w-2.5 h-2.5" /> Siblings
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Class & Track */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-800 text-xs">
                          {currentClass?.name || 'Class N/A'}
                        </div>
                        {track ? (
                          <div className="text-[11px] text-teal-700 font-medium">
                            {track.code}
                          </div>
                        ) : (
                          <div className="text-[11px] text-slate-400 capitalize">
                            {currentClass?.cycleId.replace('_', ' ')}
                          </div>
                        )}
                      </td>

                      {/* Enrollment Type */}
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          student.enrollmentType === 'New Enrollment'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        }`}>
                          {student.enrollmentType || 'Re-enrollment'}
                        </span>
                      </td>

                      {/* Guardian Contact */}
                      <td className="py-3.5 px-4">
                        <div className="text-xs text-slate-800 font-medium truncate max-w-[180px]">
                          {student.guardians?.father?.name || student.guardians?.mother?.name || 'Not specified'}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          {student.guardians?.father?.phone || student.guardians?.mother?.phone || 'No phone'}
                        </div>
                      </td>

                      {/* Fee Status */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="font-bold text-slate-900">
                          {fee.paid.toLocaleString()} <span className="text-[10px] text-slate-400">/ {fee.totalDue.toLocaleString()}</span>
                        </div>
                        <Badge
                          size="sm"
                          variant={
                            fee.paymentStatus === 'Fully Paid' ? 'success' :
                            fee.paymentStatus === 'Partial' ? 'warning' : 'danger'
                          }
                          className="mt-0.5"
                        >
                          {fee.paymentStatus}
                        </Badge>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => onOpenIdCard(student.id)}
                            title="Generate / Print School ID Card"
                            className="p-1.5 text-slate-500 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-colors"
                          >
                            <CreditCard className="w-4 h-4" />
                          </button>
                          
                          <button
                            onClick={() => onOpenReportCard(student.id)}
                            title="Generate Official Report Card"
                            className="p-1.5 text-slate-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <FileSpreadsheet className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => onOpenPaymentDesk(student.id)}
                            title="Collect Fee / Issue Receipt"
                            className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                          >
                            <Receipt className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleDelete(student.id, `${student.firstName} ${student.lastName}`)}
                            title="Delete Student Record"
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
        )}
      </div>

    </div>
  );
};
