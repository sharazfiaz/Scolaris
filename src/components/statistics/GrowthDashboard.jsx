import React, { useMemo } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { StatCard } from '../common/StatCard';
import { Badge } from '../common/Badge';
import {
  TrendingUp,
  Users,
  AlertTriangle,
  Building,
  CheckCircle2,
  PieChart as PieIcon,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

export const GrowthDashboard = () => {
  const { classes, classrooms, students, enrollmentTrends, schoolInfo } = useSchool();

  // Classroom Capacity & Saturation Analysis
  const capacityAnalysis = useMemo(() => {
    return classes.map(cls => {
      const room = classrooms.find(r => r.id === cls.roomId);
      const maxCap = cls.capacity || room?.capacity || 40;
      const enrolled = students.filter(s => s.classId === cls.id && s.status === 'Enrolled').length;
      const occupancyRate = parseFloat(((enrolled / maxCap) * 100).toFixed(1));
      const isSaturated = occupancyRate >= 95;
      const isNearFull = occupancyRate >= 85 && occupancyRate < 95;

      return {
        className: cls.name,
        cycleId: cls.cycleId,
        enrolled,
        maxCap,
        available: Math.max(0, maxCap - enrolled),
        occupancyRate,
        isSaturated,
        isNearFull
      };
    });
  }, [classes, classrooms, students]);

  const totalCapacity = capacityAnalysis.reduce((sum, c) => sum + c.maxCap, 0);
  const totalEnrolled = capacityAnalysis.reduce((sum, c) => sum + c.enrolled, 0);
  const totalOccupancy = totalCapacity > 0 ? parseFloat(((totalEnrolled / totalCapacity) * 100).toFixed(1)) : 0;
  const saturatedClasses = capacityAnalysis.filter(c => c.isSaturated);

  return (
    <div className="space-y-6">
      
      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <StatCard
          title="Total Student Headcount"
          value={totalEnrolled}
          subtitle={`Across ${classes.length} active class cohorts`}
          icon={Users}
          color="brand"
          trend="up"
          trendValue="+5.4% YoY"
        />

        <StatCard
          title="Complex Room Capacity"
          value={totalCapacity}
          subtitle={`${totalCapacity - totalEnrolled} seats available in campus`}
          icon={Building}
          color="blue"
        />

        <StatCard
          title="Global Occupancy Rate"
          value={`${totalOccupancy}%`}
          subtitle="Capacity utilization across school"
          icon={TrendingUp}
          color={totalOccupancy >= 90 ? 'amber' : 'emerald'}
        />

        <StatCard
          title="Capacity Saturation Alerts"
          value={`${saturatedClasses.length} Classes`}
          subtitle={saturatedClasses.length > 0 ? 'High occupancy alert' : 'Optimal capacity'}
          icon={AlertTriangle}
          color={saturatedClasses.length > 0 ? 'rose' : 'emerald'}
        />
      </div>

      {/* Visual Saturation Alerts Banner (if any class is >=95% full) */}
      {saturatedClasses.length > 0 && (
        <div className="p-4 bg-amber-50 border-2 border-amber-300 rounded-2xl flex items-start gap-3 text-amber-900">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1 text-xs">
            <h4 className="font-bold text-amber-950 text-sm">Classroom Capacity Saturation Warning</h4>
            <p className="mt-0.5">
              The following cohorts have reached $\ge 95\%$ maximum physical capacity:
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              {saturatedClasses.map(c => (
                <span key={c.className} className="inline-flex items-center gap-1 font-bold bg-amber-200/80 text-amber-950 px-2.5 py-1 rounded-lg border border-amber-300">
                  {c.className}: {c.enrolled}/{c.maxCap} students ({c.occupancyRate}%)
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Multi-Year Growth Trend Area Chart */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Multi-Year Enrollment Evolution by Cycle</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Historical progression of student numbers across Preschool, Primary, Lower and Upper Secondary
            </p>
          </div>
          <span className="text-xs font-bold text-teal-700 bg-teal-50 px-3 py-1 rounded-lg border border-teal-200">
            2023 - 2027 Progression
          </span>
        </div>

        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={enrollmentTrends} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0d9488" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#0d9488" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorSec" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="year" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', color: '#fff', borderRadius: '12px', border: 'none', fontSize: '12px' }} />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Area type="monotone" dataKey="total" name="Total Complex Students" stroke="#0d9488" strokeWidth={2.5} fillOpacity={1} fill="url(#colorTotal)" />
              <Area type="monotone" dataKey="lowerSecondary" name="Lower Secondary (BEPC)" stroke="#3b82f6" strokeWidth={2} fillOpacity={0} fill="#3b82f6" />
              <Area type="monotone" dataKey="upperSecondary" name="Upper Secondary (Bac)" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#colorSec)" />
              <Area type="monotone" dataKey="primary" name="Primary (CEP)" stroke="#f59e0b" strokeWidth={2} fillOpacity={0} fill="#f59e0b" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Classroom Occupancy Breakdown Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Class-by-Class Headcount vs Maximum Room Capacity
          </h4>
          <span className="text-[11px] text-slate-500 font-medium">Session: {schoolInfo.currentAcademicYear}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200/80 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Classroom Cohort</th>
                <th className="py-3 px-4">Cycle</th>
                <th className="py-3 px-4 text-center">Headcount / Capacity</th>
                <th className="py-3 px-4 text-center">Available Seats</th>
                <th className="py-3 px-4 text-center">Occupancy Rate</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {capacityAnalysis.map(cls => (
                <tr key={cls.className} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900">{cls.className}</td>
                  <td className="py-3 px-4 text-slate-600 capitalize">{cls.cycleId.replace('_', ' ')}</td>
                  <td className="py-3 px-4 text-center font-mono font-bold text-slate-800">
                    {cls.enrolled} / {cls.maxCap}
                  </td>
                  <td className="py-3 px-4 text-center font-mono text-slate-600 font-semibold">
                    {cls.available} seats
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-24 bg-slate-200 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            cls.isSaturated ? 'bg-rose-500' :
                            cls.isNearFull ? 'bg-amber-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${Math.min(100, cls.occupancyRate)}%` }}
                        />
                      </div>
                      <span className="font-mono font-bold text-[11px] w-10 text-right">{cls.occupancyRate}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Badge
                      size="sm"
                      variant={cls.isSaturated ? 'danger' : cls.isNearFull ? 'warning' : 'success'}
                    >
                      {cls.isSaturated ? 'Saturated' : cls.isNearFull ? 'Filling Fast' : 'Available'}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
