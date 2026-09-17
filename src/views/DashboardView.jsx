import React from 'react';
import { useSchool } from '../context/SchoolContext';
import { useAuth } from '../context/AuthContext';
import { StatCard } from '../components/common/StatCard';
import { Badge } from '../components/common/Badge';
import {
  Users,
  GraduationCap,
  Receipt,
  TrendingUp,
  CreditCard,
  FileSpreadsheet,
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Building,
  UserPlus,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export const DashboardView = ({
  onNavigateTab,
  onOpenEnrollModal,
  onOpenReenrollModal,
  onOpenPaymentDesk,
  onOpenStudentDetail
}) => {
  const { students, teachers, studentReceipts, teacherPayments, classes, classrooms, schoolInfo, examStatistics } = useSchool();
  const { user, currentRole } = useAuth();

  const totalEnrolled = students.filter(s => s.status === 'Enrolled').length;
  const totalRevenue = studentReceipts.reduce((sum, r) => sum + (Number(r.amount) || 0), 0);
  const totalPayroll = teacherPayments.reduce((sum, p) => sum + (Number(p.netPaid) || 0), 0);

  // Saturated class check
  const saturatedClasses = classes.filter(cls => {
    const enrolled = students.filter(s => s.classId === cls.id && s.status === 'Enrolled').length;
    const room = classrooms.find(r => r.id === cls.roomId);
    const maxCap = cls.capacity || room?.capacity || 40;
    return (enrolled / maxCap) >= 0.95;
  });

  const recentStudents = students.slice(0, 5);
  const recentReceipts = studentReceipts.slice(0, 4);

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner */}
      <div className="p-6 bg-gradient-to-r from-brand-900 via-teal-900 to-slate-900 text-white rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-1.5 z-10">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-teal-400/20 text-teal-300 border border-teal-400/30">
              Session {schoolInfo.currentAcademicYear} • {schoolInfo.currentTerm}
            </span>
            <span className="text-xs text-slate-300">
              Role: <strong className="text-white capitalize">{user.roleDetails.name}</strong>
            </span>
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white">
            Welcome back, {user.name}
          </h2>
          <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
            {schoolInfo.name} management dashboard. Monitoring academic progress, cash fee collections, teacher workloads, and Congolese educational reform statistics.
          </p>
        </div>

        {/* Fast Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 z-10">
          {(currentRole === 'principal' || currentRole === 'secretary') && (
            <button
              onClick={onOpenEnrollModal}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-teal-500 hover:bg-teal-400 text-brand-950 shadow-md transition-all active:scale-95"
            >
              <UserPlus className="w-4 h-4" />
              New Student
            </button>
          )}

          {(currentRole === 'principal' || currentRole === 'accountant') && (
            <button
              onClick={() => onOpenPaymentDesk()}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 shadow-md transition-all"
            >
              <Receipt className="w-4 h-4 text-emerald-300" />
              Fee Desk
            </button>
          )}

          {(currentRole === 'principal' || currentRole === 'teacher') && (
            <button
              onClick={() => onNavigateTab('grades')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 shadow-md transition-all"
            >
              <FileSpreadsheet className="w-4 h-4 text-teal-300" />
              Enter Grades
            </button>
          )}
        </div>
      </div>

      {/* Saturation Warning Banner */}
      {saturatedClasses.length > 0 && (
        <div className="p-4 bg-amber-50 border-2 border-amber-300 rounded-2xl flex items-start gap-3 text-amber-900">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1 text-xs">
            <h4 className="font-bold text-amber-950 text-sm">Classroom Capacity Saturation Notice</h4>
            <p className="mt-0.5">
              {saturatedClasses.length} classroom(s) have reached $\ge 95\%$ maximum capacity. Check classroom capacity in the School Growth module.
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('statistics')}
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-200 text-amber-900 hover:bg-amber-300"
          >
            Inspect
          </button>
        </div>
      )}

      {/* Top 4 KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Enrolled Students"
          value={totalEnrolled}
          subtitle={`Across ${classes.length} classroom cohorts`}
          icon={Users}
          color="brand"
          trend="up"
          trendValue="+5.4% YoY"
        />

        <StatCard
          title="Teaching Staff"
          value={teachers.length}
          subtitle="Homeroom & secondary faculty"
          icon={GraduationCap}
          color="purple"
        />

        <StatCard
          title="Fee Revenue Collected"
          value={`${(totalRevenue / 1000000).toFixed(2)}M FCFA`}
          subtitle={`${studentReceipts.length} payment receipts`}
          icon={Receipt}
          color="emerald"
        />

        <StatCard
          title="Exam Success Rate"
          value="97.8%"
          subtitle="Official CEP / BEPC / Bac mean"
          icon={TrendingUp}
          color="blue"
        />
      </div>

      {/* Main Content Grid: Recent Enrollments & Quick Desk Receipts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Recent Student Admissions */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Recent Student Admissions & Registrations</h3>
              <p className="text-xs text-slate-500">Latest enrolled learners for {schoolInfo.currentAcademicYear}</p>
            </div>
            <button
              onClick={() => onNavigateTab('students')}
              className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {recentStudents.map(s => {
              const cls = classes.find(c => c.id === s.classId);
              return (
                <div
                  key={s.id}
                  onClick={() => onOpenStudentDetail(s.id)}
                  className="py-3 flex items-center justify-between hover:bg-slate-50 px-2 rounded-xl transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-800 font-bold flex items-center justify-center text-xs">
                      {s.firstName.charAt(0)}{s.lastName.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-xs text-slate-900">{s.firstName} {s.lastName}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{s.id} • {cls?.name}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <Badge variant={s.feeStatus?.paymentStatus === 'Fully Paid' ? 'success' : 'warning'} size="sm">
                      {s.feeStatus?.paymentStatus || 'Unpaid'}
                    </Badge>
                    <span className="text-[10px] text-slate-400 block mt-0.5">{s.registrationDate}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 1 Col: Recent Desk Receipts & Actions */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-sm text-slate-900">Recent Desk Receipts</h3>
                <p className="text-xs text-slate-500">Instant cash collection ledger</p>
              </div>
              <Receipt className="w-4 h-4 text-teal-600" />
            </div>

            <div className="divide-y divide-slate-100 mt-2">
              {recentReceipts.map(r => (
                <div key={r.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-mono font-bold text-teal-700 block">{r.id}</span>
                    <span className="text-slate-800 font-semibold truncate block max-w-[140px]">{r.studentName}</span>
                    <span className="text-[10px] text-slate-400">{r.paymentMethod}</span>
                  </div>
                  <div className="text-right">
                    <strong className="text-slate-900 font-bold">{Number(r.amount).toLocaleString()} FCFA</strong>
                    <span className="text-[10px] text-slate-400 block">{r.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('accounting')}
            className="w-full py-2 rounded-xl text-xs font-bold text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-200 flex items-center justify-center gap-1.5 transition-colors"
          >
            Go to Fee Accounting Desk <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

    </div>
  );
};
