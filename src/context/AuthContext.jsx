import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const ROLES = {
  PRINCIPAL: {
    id: 'principal',
    name: 'Principal / Director',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
    description: 'Full administrative access and executive dashboard',
    permissions: ['all']
  },
  SECRETARY: {
    id: 'secretary',
    name: 'School Secretary',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
    description: 'Student records, admissions, ID cards, and registrations',
    permissions: ['students_view', 'students_edit', 'id_cards', 'timetables_view', 'reports_view']
  },
  ACCOUNTANT: {
    id: 'accountant',
    name: 'Chief Accountant',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    description: 'Fee collection, instant receipts, payroll, and financial archives',
    permissions: ['accounting_all', 'payroll_all', 'students_view', 'receipts_generate', 'financial_stats']
  },
  TEACHER: {
    id: 'teacher',
    name: 'Secondary/Primary Teacher',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    description: 'Grade records entry, personal timetable, and hours statement',
    permissions: ['grades_entry', 'teacher_timetable', 'teacher_hours', 'report_cards_view']
  }
};

export const AuthProvider = ({ children }) => {
  const [currentRole, setCurrentRole] = useState(() => {
    return localStorage.getItem('scolaris_role') || 'principal';
  });

  // If teacher role is selected, simulate an active logged-in teacher ID
  const [activeTeacherId, setActiveTeacherId] = useState(() => {
    return localStorage.getItem('scolaris_teacher_id') || 'tch_10'; // Dieudonné Kouassi (Math) by default
  });

  useEffect(() => {
    localStorage.setItem('scolaris_role', currentRole);
  }, [currentRole]);

  useEffect(() => {
    localStorage.setItem('scolaris_teacher_id', activeTeacherId);
  }, [activeTeacherId]);

  const switchRole = (roleKey) => {
    if (ROLES[roleKey.toUpperCase()]) {
      setCurrentRole(roleKey.toLowerCase());
    }
  };

  const hasPermission = (permission) => {
    if (currentRole === 'principal') return true;
    const roleDef = Object.values(ROLES).find(r => r.id === currentRole);
    if (!roleDef) return false;
    return roleDef.permissions.includes(permission) || roleDef.permissions.includes('all');
  };

  const user = {
    role: currentRole,
    roleDetails: ROLES[currentRole.toUpperCase()] || ROLES.PRINCIPAL,
    name: currentRole === 'principal' ? 'Dr. Cédric Mboutou' :
          currentRole === 'secretary' ? 'Mme Honorine Mabiala' :
          currentRole === 'accountant' ? 'Mme Cécile Bantsimba' :
          'M. Dieudonné Kouassi',
    email: `${currentRole}@cs-renaissance.cg`,
    activeTeacherId
  };

  return (
    <AuthContext.Provider value={{
      currentRole,
      switchRole,
      hasPermission,
      activeTeacherId,
      setActiveTeacherId,
      user,
      roles: ROLES
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
