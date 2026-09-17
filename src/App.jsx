import React, { useState } from 'react';
import { SchoolProvider } from './context/SchoolContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';

import { DashboardView } from './views/DashboardView';
import { StudentsView } from './views/StudentsView';
import { IdCardsView } from './views/IdCardsView';
import { TeachersView } from './views/TeachersView';
import { GradesView } from './views/GradesView';
import { TimetablesView } from './views/TimetablesView';
import { AccountingView } from './views/AccountingView';
import { StatisticsView } from './views/StatisticsView';
import { ConfigurationView } from './views/ConfigurationView';
import { AuditLogsView } from './views/AuditLogsView';

import { EnrollmentFormModal } from './components/students/EnrollmentFormModal';
import { ReenrollmentModal } from './components/students/ReenrollmentModal';
import { StudentDetailModal } from './components/students/StudentDetailModal';
import { SchoolIdCard } from './components/idCards/SchoolIdCard';
import { ReportCardModal } from './components/grades/ReportCardModal';
import { StudentPaymentReceipt } from './components/accounting/StudentPaymentReceipt';
import { Modal } from './components/common/Modal';

function AppContent() {
  const [activeTab, setActiveTab] = useState('dashboard');

  // Global modal triggers
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [isReenrollModalOpen, setIsReenrollModalOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [isStudentDetailOpen, setIsStudentDetailOpen] = useState(false);
  
  // Quick View modals
  const [idCardStudentId, setIdCardStudentId] = useState(null);
  const [reportCardStudentId, setReportCardStudentId] = useState(null);
  const [receiptModalId, setReceiptModalId] = useState(null);

  const handleOpenStudentDetail = (id) => {
    setSelectedStudentId(id);
    setIsStudentDetailOpen(true);
  };

  const handleOpenPaymentDesk = (studentId = null) => {
    if (studentId) {
      setSelectedStudentId(studentId);
    }
    setActiveTab('accounting');
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar Navigation */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Layout Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-fade-in">
          {activeTab === 'dashboard' && (
            <DashboardView
              onNavigateTab={(tab) => setActiveTab(tab)}
              onOpenEnrollModal={() => setIsEnrollModalOpen(true)}
              onOpenReenrollModal={() => setIsReenrollModalOpen(true)}
              onOpenPaymentDesk={handleOpenPaymentDesk}
              onOpenStudentDetail={handleOpenStudentDetail}
            />
          )}

          {activeTab === 'students' && (
            <StudentsView onOpenPaymentDesk={handleOpenPaymentDesk} />
          )}

          {activeTab === 'id_cards' && (
            <IdCardsView />
          )}

          {activeTab === 'teachers' && (
            <TeachersView />
          )}

          {activeTab === 'grades' && (
            <GradesView />
          )}

          {activeTab === 'timetables' && (
            <TimetablesView />
          )}

          {activeTab === 'accounting' && (
            <AccountingView preselectedStudentId={selectedStudentId} />
          )}

          {activeTab === 'statistics' && (
            <StatisticsView />
          )}

          {activeTab === 'configuration' && (
            <ConfigurationView />
          )}

          {activeTab === 'audit_logs' && (
            <AuditLogsView />
          )}
        </main>
      </div>

      {/* Global Enrollment Modal */}
      {isEnrollModalOpen && (
        <EnrollmentFormModal
          isOpen={isEnrollModalOpen}
          onClose={() => setIsEnrollModalOpen(false)}
          onEnrollSuccess={(newStudent) => {
            setIdCardStudentId(newStudent.id);
          }}
        />
      )}

      {/* Global Re-enrollment Modal */}
      {isReenrollModalOpen && (
        <ReenrollmentModal
          isOpen={isReenrollModalOpen}
          onClose={() => setIsReenrollModalOpen(false)}
          defaultStudentId={selectedStudentId}
          onReenrollSuccess={(updated) => {
            setIdCardStudentId(updated.id);
          }}
        />
      )}

      {/* Global Student Detail Modal */}
      {isStudentDetailOpen && selectedStudentId && (
        <StudentDetailModal
          isOpen={isStudentDetailOpen}
          onClose={() => setIsStudentDetailOpen(false)}
          studentId={selectedStudentId}
          onOpenIdCard={(id) => setIdCardStudentId(id)}
          onOpenReportCard={(id) => setReportCardStudentId(id)}
          onOpenPaymentDesk={handleOpenPaymentDesk}
          onOpenReenrollment={() => {
            setIsStudentDetailOpen(false);
            setIsReenrollModalOpen(true);
          }}
        />
      )}

      {/* Global ID Card Modal */}
      {idCardStudentId && (
        <Modal
          isOpen={!!idCardStudentId}
          onClose={() => setIdCardStudentId(null)}
          title="Student Identification Badge"
          subtitle="Printable badge with embedded cryptographic security QR code"
          maxWidth="max-w-3xl"
        >
          <SchoolIdCard studentId={idCardStudentId} showControls={true} />
        </Modal>
      )}

      {/* Global Report Card Modal */}
      {reportCardStudentId && (
        <ReportCardModal
          isOpen={!!reportCardStudentId}
          onClose={() => setReportCardStudentId(null)}
          studentId={reportCardStudentId}
        />
      )}

      {/* Global Receipt Modal */}
      {receiptModalId && (
        <StudentPaymentReceipt
          isOpen={!!receiptModalId}
          onClose={() => setReceiptModalId(null)}
          receiptId={receiptModalId}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <SchoolProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </SchoolProvider>
    </ToastProvider>
  );
}
