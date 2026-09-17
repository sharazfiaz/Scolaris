import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { useAuth } from '../../context/AuthContext';
import { RoleSwitcherModal } from './RoleSwitcherModal';
import {
  School,
  Calendar,
  UserCheck,
  Shield,
  Download,
  RotateCcw,
  Sparkles,
  Search,
  SlidersHorizontal,
  Bell
} from 'lucide-react';

export const Navbar = ({ onOpenGlobalSearch, onOpenBackupModal }) => {
  const { schoolInfo, exportDataBackup, resetToDemoData } = useSchool();
  const { user } = useAuth();
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);

  return (
    <>
      <header className="bg-white border-b border-slate-200/80 sticky top-0 z-30 px-4 sm:px-6 py-3 no-print">
        <div className="flex items-center justify-between gap-4">
          
          {/* Institution Info & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-900 text-white flex items-center justify-center shadow-md shadow-brand-900/10">
              <School className="w-5 h-5 text-teal-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-base sm:text-lg text-brand-900 tracking-tight leading-tight">
                  {schoolInfo.shortName || 'SCOLARIS'}
                </h1>
                <span className="hidden md:inline-flex text-[11px] font-semibold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                  Congo 2026 Framework
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                {schoolInfo.city}, {schoolInfo.country} • {schoolInfo.motto}
              </p>
            </div>
          </div>

          {/* Center: Academic Year & Term */}
          <div className="hidden lg:flex items-center gap-2 bg-slate-100/80 px-3 py-1.5 rounded-xl border border-slate-200/60 text-xs font-semibold text-slate-700">
            <Calendar className="w-4 h-4 text-teal-600" />
            <span>Academic Year: <strong className="text-slate-900">{schoolInfo.currentAcademicYear}</strong></span>
            <span className="text-slate-300">|</span>
            <span className="text-teal-700 font-bold">{schoolInfo.currentTerm}</span>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2.5">
            {/* USB Backup Button */}
            <button
              onClick={exportDataBackup}
              title="Download local offline backup (JSON) for USB drive storage"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-slate-700 hover:text-teal-700 bg-slate-100 hover:bg-teal-50 px-3 py-2 rounded-xl border border-slate-200/80 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Offline Backup</span>
            </button>

            {/* Role Switcher Pill */}
            <button
              onClick={() => setIsRoleModalOpen(true)}
              className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-slate-200 hover:border-teal-300 bg-white hover:bg-teal-50/40 text-left transition-all shadow-sm group"
            >
              <div className="w-7 h-7 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold text-xs">
                {user.name.charAt(0)}
              </div>
              <div className="hidden sm:block text-left">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-900 leading-none">{user.name.split(' ')[0]}</span>
                  <span className="text-[10px] font-bold text-teal-700 bg-teal-100/70 px-1.5 py-0.5 rounded leading-none">
                    {user.roleDetails.name.split('/')[0]}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 group-hover:text-teal-600 flex items-center gap-1 mt-0.5">
                  Switch Role <SlidersHorizontal className="w-2.5 h-2.5" />
                </span>
              </div>
            </button>
          </div>
        </div>
      </header>

      <RoleSwitcherModal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
      />
    </>
  );
};
