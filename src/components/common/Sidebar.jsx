import React from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  CreditCard,
  GraduationCap,
  FileSpreadsheet,
  CalendarDays,
  Receipt,
  TrendingUp,
  Settings,
  History,
  QrCode
} from 'lucide-react';

export const Sidebar = ({ activeTab, setActiveTab }) => {
  const { currentRole, hasPermission } = useAuth();

  const navigationItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      roles: ['principal', 'secretary', 'accountant', 'teacher']
    },
    {
      id: 'students',
      label: 'Students & Admissions',
      icon: Users,
      roles: ['principal', 'secretary', 'accountant']
    },
    {
      id: 'id_cards',
      label: 'School ID Cards & QR',
      icon: CreditCard,
      roles: ['principal', 'secretary']
    },
    {
      id: 'teachers',
      label: 'Teachers & Payroll',
      icon: GraduationCap,
      roles: ['principal', 'accountant', 'teacher']
    },
    {
      id: 'grades',
      label: 'Grades & Report Cards',
      icon: FileSpreadsheet,
      roles: ['principal', 'secretary', 'teacher']
    },
    {
      id: 'timetables',
      label: 'Class & Teacher Timetables',
      icon: CalendarDays,
      roles: ['principal', 'secretary', 'teacher']
    },
    {
      id: 'accounting',
      label: 'Accounting & Fee Desk',
      icon: Receipt,
      roles: ['principal', 'accountant']
    },
    {
      id: 'statistics',
      label: 'School Growth & Trends',
      icon: TrendingUp,
      roles: ['principal', 'accountant']
    },
    {
      id: 'configuration',
      label: 'Academic Configuration',
      icon: Settings,
      roles: ['principal']
    },
    {
      id: 'audit_logs',
      label: 'Action Audit Logs',
      icon: History,
      roles: ['principal']
    }
  ];

  // Filter items based on current active role
  const visibleItems = navigationItems.filter(item => item.roles.includes(currentRole));

  return (
    <aside className="w-64 bg-brand-900 text-slate-200 min-h-screen flex flex-col no-print border-r border-brand-950 flex-shrink-0">
      {/* Platform Title */}
      <div className="px-6 py-5 border-b border-brand-800/80">
        <div className="text-[11px] uppercase tracking-widest text-teal-400 font-extrabold">
          Republic of the Congo
        </div>
        <div className="text-xl font-black text-white tracking-wider flex items-center gap-2 mt-0.5">
          <span>SCOLARIS</span>
          <span className="text-[10px] font-bold bg-teal-500/30 text-teal-300 px-2 py-0.5 rounded border border-teal-400/30">
            v2.6
          </span>
        </div>
        <div className="text-[11px] text-slate-300/80 mt-1 font-medium">
          Comprehensive School Management
        </div>
      </div>

      {/* Navigation List */}
      <nav className="p-3 space-y-1 flex-1 overflow-y-auto">
        <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-teal-300/60">
          Core Modules
        </div>
        {visibleItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${
                isActive
                  ? 'bg-teal-600 text-white font-semibold shadow-lg shadow-teal-900/30'
                  : 'text-slate-300 hover:text-white hover:bg-brand-800/70'
              }`}
            >
              <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-white' : 'text-teal-400'}`} />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer Info & Operating Mode */}
      <div className="p-4 border-t border-brand-800/80 bg-brand-950/40 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-slate-300 font-medium">Local School Network Mode</span>
        </div>
        <p className="text-[11px] text-slate-400 mt-1">
          Zero internet dependency. Power & network outage resilient.
        </p>
      </div>
    </aside>
  );
};
