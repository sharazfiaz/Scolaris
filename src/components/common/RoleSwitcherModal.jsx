import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSchool } from '../../context/SchoolContext';
import { Modal } from './Modal';
import { ShieldCheck, UserCheck, Check } from 'lucide-react';

export const RoleSwitcherModal = ({ isOpen, onClose }) => {
  const { currentRole, switchRole, roles, activeTeacherId, setActiveTeacherId } = useAuth();
  const { teachers } = useSchool();

  const handleSelectRole = (roleKey) => {
    switchRole(roleKey);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Switch User Role / Perspective"
      subtitle="Experience SCOLARIS from the perspective of different school complex staff"
      maxWidth="max-w-xl"
    >
      <div className="space-y-4">
        <p className="text-xs text-slate-500">
          SCOLARIS uses simplified Role-Based Access Control (RBAC) designed for Congolese school administrations.
        </p>

        <div className="grid grid-cols-1 gap-3">
          {Object.entries(roles).map(([key, r]) => {
            const isSelected = currentRole === r.id;
            return (
              <button
                key={r.id}
                onClick={() => handleSelectRole(key)}
                className={`flex items-center justify-between p-4 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'border-teal-500 bg-teal-50/50 shadow-sm ring-2 ring-teal-500/20'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-lg border ${r.badgeColor}`}>
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">{r.name}</span>
                      {isSelected && (
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-teal-600 text-white">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{r.description}</p>
                  </div>
                </div>
                {isSelected && <Check className="w-5 h-5 text-teal-600 flex-shrink-0" />}
              </button>
            );
          })}
        </div>

        {currentRole === 'teacher' && (
          <div className="mt-4 pt-4 border-t border-slate-200">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-teal-600" />
              Simulate Specific Teacher Profile:
            </label>
            <select
              value={activeTeacherId}
              onChange={(e) => setActiveTeacherId(e.target.value)}
              className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            >
              {teachers.map(t => (
                <option key={t.id} value={t.id}>
                  {t.firstName} {t.lastName} ({t.payType === 'fixed' ? 'Preschool/Primary Homeroom' : 'Secondary Hourly'})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </Modal>
  );
};
