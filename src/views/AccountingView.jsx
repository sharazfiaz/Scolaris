import React, { useState } from 'react';
import { FeeCollectionDesk } from '../components/accounting/FeeCollectionDesk';
import { PaymentArchives } from '../components/accounting/PaymentArchives';
import { OutstandingBalances } from '../components/accounting/OutstandingBalances';
import { FinancialSummary } from '../components/accounting/FinancialSummary';
import { StudentPaymentReceipt } from '../components/accounting/StudentPaymentReceipt';
import { TeacherPaySlip } from '../components/accounting/TeacherPaySlip';
import { Receipt, History, AlertCircle, TrendingUp } from 'lucide-react';

export const AccountingView = ({ initialTab = 'desk', preselectedStudentId = null }) => {
  const [activeTab, setActiveTab] = useState(initialTab); // 'desk', 'archives', 'balances', 'summary'
  const [activeReceiptId, setActiveReceiptId] = useState(null);
  const [activePaySlipId, setActivePaySlipId] = useState(null);
  const [deskStudentId, setDeskStudentId] = useState(preselectedStudentId);

  const handleOpenStudentReceipt = (rId) => {
    setActiveReceiptId(rId);
  };

  const handleOpenTeacherPaySlip = (pId) => {
    setActivePaySlipId(pId);
  };

  const handleDeskPaymentRecorded = (rId) => {
    setActiveReceiptId(rId);
  };

  const handleOpenPaymentDeskForStudent = (sId) => {
    setDeskStudentId(sId);
    setActiveTab('desk');
  };

  return (
    <div className="space-y-6">
      
      {/* Tab Switcher */}
      <div className="p-1.5 bg-slate-200/60 rounded-2xl flex flex-wrap items-center gap-2 max-w-2xl no-print">
        <button
          onClick={() => setActiveTab('desk')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'desk' ? 'bg-white text-teal-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Receipt className="w-4 h-4" />
          Fee Collection Desk
        </button>

        <button
          onClick={() => setActiveTab('archives')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'archives' ? 'bg-white text-teal-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <History className="w-4 h-4" />
          Payment Archives
        </button>

        <button
          onClick={() => setActiveTab('balances')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'balances' ? 'bg-white text-teal-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <AlertCircle className="w-4 h-4" />
          Outstanding Balances
        </button>

        <button
          onClick={() => setActiveTab('summary')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'summary' ? 'bg-white text-teal-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          Financial Cashflow
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'desk' && (
        <FeeCollectionDesk
          defaultStudentId={deskStudentId}
          onReceiptCreated={handleDeskPaymentRecorded}
        />
      )}

      {activeTab === 'archives' && (
        <PaymentArchives
          onOpenStudentReceipt={handleOpenStudentReceipt}
          onOpenTeacherPaySlip={handleOpenTeacherPaySlip}
        />
      )}

      {activeTab === 'balances' && (
        <OutstandingBalances
          onOpenPaymentDesk={handleOpenPaymentDeskForStudent}
        />
      )}

      {activeTab === 'summary' && (
        <FinancialSummary />
      )}

      {/* Student Receipt Modal */}
      {activeReceiptId && (
        <StudentPaymentReceipt
          isOpen={!!activeReceiptId}
          onClose={() => setActiveReceiptId(null)}
          receiptId={activeReceiptId}
        />
      )}

      {/* Teacher Pay Slip Modal */}
      {activePaySlipId && (
        <TeacherPaySlip
          isOpen={!!activePaySlipId}
          onClose={() => setActivePaySlipId(null)}
          paymentId={activePaySlipId}
        />
      )}

    </div>
  );
};
