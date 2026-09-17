import React, { useMemo } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { StatCard } from '../common/StatCard';
import {
  DollarSign,
  TrendingUp,
  Receipt,
  GraduationCap,
  ArrowUpRight,
  ArrowDownRight,
  PieChart as PieIcon,
  Layers
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

export const FinancialSummary = () => {
  const { students, studentReceipts, teacherPayments, teachers, schoolInfo } = useSchool();

  // Aggregate Total School Fee Revenue Collected
  const totalRevenue = useMemo(() => {
    return studentReceipts.reduce((sum, r) => sum + (Number(r.amount) || 0), 0);
  }, [studentReceipts]);

  // Aggregate Total Teacher Payroll Disbursed
  const totalPayroll = useMemo(() => {
    return teacherPayments.reduce((sum, p) => sum + (Number(p.netPaid) || 0), 0);
  }, [teacherPayments]);

  const netOperatingMargin = totalRevenue - totalPayroll;

  // Monthly breakdown mockup based on current data
  const monthlyCashflowData = [
    { month: 'Sep 2026', revenue: 6500000, payroll: 2150000, net: 4350000 },
    { month: 'Oct 2026', revenue: 4200000, payroll: 2150000, net: 2050000 },
    { month: 'Nov 2026', revenue: 3100000, payroll: 2150000, net: 950000 },
    { month: 'Dec 2026', revenue: 5800000, payroll: 2200000, net: 3600000 },
    { month: 'Jan 2027', revenue: 4900000, payroll: 2200000, net: 2700000 },
    { month: 'Feb 2027', revenue: 3400000, payroll: 2200000, net: 1200000 },
  ];

  return (
    <div className="space-y-6">
      
      {/* Top 3 KPI Financial Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatCard
          title="Total Fee Revenue Collected"
          value={`${totalRevenue.toLocaleString()} FCFA`}
          subtitle="From student enrollment & tuition receipts"
          icon={Receipt}
          color="emerald"
          trend="up"
          trendValue="+14.8% vs last year"
        />

        <StatCard
          title="Teacher Payroll Disbursed"
          value={`${totalPayroll.toLocaleString()} FCFA`}
          subtitle="Fixed salaries & hourly secondary workload"
          icon={GraduationCap}
          color="purple"
        />

        <StatCard
          title="Net Cashflow Balance"
          value={`${netOperatingMargin.toLocaleString()} FCFA`}
          subtitle="Operational school complex margin"
          icon={TrendingUp}
          color={netOperatingMargin >= 0 ? 'brand' : 'rose'}
          trend={netOperatingMargin >= 0 ? 'up' : 'down'}
          trendValue="Healthy Margin"
        />
      </div>

      {/* Recharts Consolidated Monthly Bar Chart */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Monthly Revenue vs Payroll Comparison
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Consolidated cash receipts (Tuition/Enrollment) vs Total Teacher Remuneration
            </p>
          </div>
          <span className="text-xs font-mono font-bold px-2.5 py-1 bg-slate-100 rounded-lg text-slate-700">
            Currency: FCFA
          </span>
        </div>

        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyCashflowData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
                tickFormatter={(val) => `${(val / 1000000).toFixed(1)}M`}
              />
              <Tooltip
                formatter={(val) => [`${Number(val).toLocaleString()} FCFA`, '']}
                contentStyle={{ backgroundColor: '#0f172a', color: '#fff', borderRadius: '12px', border: 'none', fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Bar dataKey="revenue" name="Student Fee Revenue" fill="#0d9488" radius={[6, 6, 0, 0]} />
              <Bar dataKey="payroll" name="Teacher Payroll Expense" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};
