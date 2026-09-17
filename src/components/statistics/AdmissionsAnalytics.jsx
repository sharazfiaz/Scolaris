import React, { useMemo } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { StatCard } from '../common/StatCard';
import {
  UserPlus,
  RotateCcw,
  TrendingUp,
  Percent,
  CheckCircle2,
  PieChart as PieIcon
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export const AdmissionsAnalytics = () => {
  const { students, enrollmentTrends, schoolInfo } = useSchool();

  const newCount = students.filter(s => s.enrollmentType === 'New Enrollment').length;
  const reenrollCount = students.filter(s => s.enrollmentType === 'Re-enrollment').length;
  const total = students.length || 1;

  const newRatio = parseFloat(((newCount / total) * 100).toFixed(1));
  const reenrollRatio = parseFloat(((reenrollCount / total) * 100).toFixed(1));

  const pieData = [
    { name: 'Returning (Re-enrollments)', value: reenrollCount, color: '#0d9488' },
    { name: 'New Admissions', value: newCount, color: '#3b82f6' }
  ];

  // 6th grade entry admissions analytics
  const sixthGradeStudents = students.filter(s => s.classId?.includes('6'));
  const sixthGradeNew = sixthGradeStudents.filter(s => s.enrollmentType === 'New Enrollment').length;

  return (
    <div className="space-y-6">
      
      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatCard
          title="New Student Admissions"
          value={`${newCount} Students`}
          subtitle={`${newRatio}% of total current cohort`}
          icon={UserPlus}
          color="blue"
        />

        <StatCard
          title="Returning Re-enrollments"
          value={`${reenrollCount} Students`}
          subtitle={`${reenrollRatio}% student retention base`}
          icon={RotateCcw}
          color="brand"
        />

        <StatCard
          title="Complex Retention Rate"
          value="95.2%"
          subtitle="Year-over-year cohort continuity"
          icon={TrendingUp}
          color="emerald"
          trend="up"
          trendValue="+0.6% vs 2025"
        />
      </div>

      {/* Grid: Admissions Bar Chart & Pie Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Multi-Year New vs Re-enrollment Bar Chart */}
        <div className="md:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              New Enrollees vs Re-enrollments Trend
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Comparison of new intake vs returning students over successive academic sessions
            </p>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={enrollmentTrends} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="year" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', color: '#fff', borderRadius: '12px', border: 'none', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="reEnrollees" name="Returning Students" fill="#0d9488" radius={[6, 6, 0, 0]} />
                <Bar dataKey="newEnrollees" name="New Admissions" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Breakdown */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Intake Composition</h3>
            <p className="text-xs text-slate-500 mt-0.5">Current Session: {schoolInfo.currentAcademicYear}</p>
          </div>

          <div className="h-44 w-full my-auto">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={65}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', color: '#fff', borderRadius: '12px', border: 'none', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 text-xs pt-3 border-t border-slate-100">
            {pieData.map(item => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-700 font-medium">{item.name}</span>
                </div>
                <strong className="text-slate-900 font-mono">{item.value} ({((item.value / total) * 100).toFixed(0)}%)</strong>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
