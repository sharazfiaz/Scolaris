import React, { useState } from 'react';
import { StudentList } from '../components/students/StudentList';
import { StudentDetailModal } from '../components/students/StudentDetailModal';
import { EnrollmentFormModal } from '../components/students/EnrollmentFormModal';
import { ReenrollmentModal } from '../components/students/ReenrollmentModal';
import { SiblingLinkerModal } from '../components/students/SiblingLinkerModal';
import { SchoolIdCard } from '../components/idCards/SchoolIdCard';
import { ReportCardModal } from '../components/grades/ReportCardModal';
import { Modal } from '../components/common/Modal';

export const StudentsView = ({ onOpenPaymentDesk }) => {
  // Modal states
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [isReenrollModalOpen, setIsReenrollModalOpen] = useState(false);
  const [isSiblingModalOpen, setIsSiblingModalOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Quick ID Card Modal
  const [idCardStudentId, setIdCardStudentId] = useState(null);
  // Quick Report Card Modal
  const [reportCardStudentId, setReportCardStudentId] = useState(null);

  const handleSelectStudent = (id) => {
    setSelectedStudentId(id);
    setIsDetailModalOpen(true);
  };

  const handleOpenIdCard = (id) => {
    setIdCardStudentId(id);
  };

  const handleOpenReportCard = (id) => {
    setReportCardStudentId(id);
  };

  return (
    <div className="space-y-6">
      <StudentList
        onOpenEnrollModal={() => setIsEnrollModalOpen(true)}
        onOpenReenrollModal={() => setIsReenrollModalOpen(true)}
        onOpenSiblingModal={() => setIsSiblingModalOpen(true)}
        onSelectStudent={handleSelectStudent}
        onOpenIdCard={handleOpenIdCard}
        onOpenReportCard={handleOpenReportCard}
        onOpenPaymentDesk={onOpenPaymentDesk}
      />

      {/* Enrollment Modal */}
      {isEnrollModalOpen && (
        <EnrollmentFormModal
          isOpen={isEnrollModalOpen}
          onClose={() => setIsEnrollModalOpen(false)}
          onEnrollSuccess={(newStudent) => {
            setIdCardStudentId(newStudent.id);
          }}
        />
      )}

      {/* Re-enrollment Modal */}
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

      {/* Sibling Linker Modal */}
      {isSiblingModalOpen && (
        <SiblingLinkerModal
          isOpen={isSiblingModalOpen}
          onClose={() => setIsSiblingModalOpen(false)}
          primaryStudentId={selectedStudentId}
        />
      )}

      {/* Student Profile Detail Modal */}
      {isDetailModalOpen && selectedStudentId && (
        <StudentDetailModal
          isOpen={isDetailModalOpen}
          onClose={() => { setIsDetailModalOpen(false); }}
          studentId={selectedStudentId}
          onOpenIdCard={handleOpenIdCard}
          onOpenReportCard={handleOpenReportCard}
          onOpenPaymentDesk={onOpenPaymentDesk}
          onOpenReenrollment={() => {
            setIsDetailModalOpen(false);
            setIsReenrollModalOpen(true);
          }}
        />
      )}

      {/* ID Card Modal */}
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

      {/* Report Card Modal */}
      {reportCardStudentId && (
        <ReportCardModal
          isOpen={!!reportCardStudentId}
          onClose={() => setReportCardStudentId(null)}
          studentId={reportCardStudentId}
        />
      )}
    </div>
  );
};
