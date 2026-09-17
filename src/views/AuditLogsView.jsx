import React, { useState } from 'react';
import { useSchool } from '../context/SchoolContext';
import { History, ShieldCheck, Search, Filter, Calendar } from 'lucide-react';

export const AuditLogsView = () => {
  const { auditLogs } = useSchool();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLogs = (auditLogs || []).filter(log => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return log.action?.toLowerCase().includes(q) ||
           log.user?.toLowerCase().includes(q) ||
           log.details?.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Security & Activity Audit Trail</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Immutable log of sensitive operations (payments, fee receipts, grade entries, ID card issues, and backups)
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono font-bold bg-slate-100 text-slate-700 px-3 py-1.5 rounded-xl border border-slate-200">
          <ShieldCheck className="w-4 h-4 text-teal-600" />
          <span>{filteredLogs.length} Events Logged</span>
        </div>
      </div>

      {/* Search Filter */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search audit trail by operator, action or details..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs sm:text-sm pl-10 pr-4 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white"
          />
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200/80 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4 w-44">Timestamp</th>
                <th className="py-3 px-4 w-44">Operator / Role</th>
                <th className="py-3 px-4 w-52">Action Type</th>
                <th className="py-3 px-4">Event Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                    {new Date(log.timestamp).toLocaleString('en-GB')}
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-slate-900">{log.user}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-700 text-xs">
                    {log.details}
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
