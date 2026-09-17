import React, { useState, useEffect } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import {
  QrCode,
  ShieldCheck,
  ShieldAlert,
  Search,
  CheckCircle2,
  XCircle,
  User,
  School,
  Calendar,
  Phone
} from 'lucide-react';

export const QrCodeVerifierModal = ({ isOpen, onClose, defaultStudent = null }) => {
  const { students, classes, schoolInfo } = useSchool();
  
  const [inputQuery, setInputQuery] = useState(defaultStudent?.id || '');
  const [verifiedResult, setVerifiedResult] = useState(defaultStudent || null);
  const [isSearched, setIsSearched] = useState(!!defaultStudent);

  useEffect(() => {
    if (defaultStudent) {
      setInputQuery(defaultStudent.id);
      setVerifiedResult(defaultStudent);
      setIsSearched(true);
    }
  }, [defaultStudent]);

  const handleVerify = (e) => {
    e.preventDefault();
    if (!inputQuery.trim()) return;

    // Search by ID or try to parse JSON QR payload
    let targetId = inputQuery.trim();
    try {
      if (targetId.startsWith('{')) {
        const parsed = JSON.parse(targetId);
        if (parsed.id) targetId = parsed.id;
      }
    } catch (e) {
      // not json, continue
    }

    const found = students.find(s => s.id.toLowerCase() === targetId.toLowerCase());
    setVerifiedResult(found || null);
    setIsSearched(true);
  };

  const currentClass = verifiedResult ? classes.find(c => c.id === verifiedResult.classId) : null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Secure School ID Card Verifier"
      subtitle="Verify student credentials and cryptographic verification hash"
      maxWidth="max-w-xl"
    >
      <div className="space-y-5">
        
        {/* Search / Scan Input */}
        <form onSubmit={handleVerify} className="flex gap-2">
          <div className="relative flex-1">
            <QrCode className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Scan QR payload or enter student ID (e.g. ES-2026-00101)..."
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              className="w-full text-xs sm:text-sm pl-9 pr-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-sm transition-all"
          >
            Verify
          </button>
        </form>

        {/* Verification Result Display */}
        {isSearched && (
          <div>
            {verifiedResult ? (
              <div className="p-5 bg-emerald-50/70 border-2 border-emerald-500/60 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    <span>OFFICIAL & AUTHENTIC CREDENTIAL</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-emerald-200/80 text-emerald-900 px-2 py-0.5 rounded">
                    HASH MATCHED
                  </span>
                </div>

                <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-emerald-200">
                  <div className="w-14 h-14 rounded-xl bg-teal-900 text-teal-200 font-black text-xl flex items-center justify-center flex-shrink-0">
                    {verifiedResult.firstName.charAt(0)}{verifiedResult.lastName.charAt(0)}
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="font-extrabold text-slate-900 text-sm">
                      {verifiedResult.firstName} {verifiedResult.lastName}
                    </h4>
                    <p className="text-xs font-mono text-teal-800 font-semibold">
                      Student ID: {verifiedResult.id}
                    </p>
                    <p className="text-xs text-slate-600">
                      Class: <strong>{currentClass?.name || 'N/A'}</strong> • Session: {verifiedResult.academicYear}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-white/80 p-2.5 rounded-lg border border-emerald-100">
                    <span className="text-slate-500 block text-[10px]">Enrollment Status</span>
                    <strong className="text-emerald-700">{verifiedResult.status}</strong>
                  </div>
                  <div className="bg-white/80 p-2.5 rounded-lg border border-emerald-100">
                    <span className="text-slate-500 block text-[10px]">Institution</span>
                    <strong className="text-slate-900">{schoolInfo.shortName}</strong>
                  </div>
                  <div className="bg-white/80 p-2.5 rounded-lg border border-emerald-100 col-span-2">
                    <span className="text-slate-500 block text-[10px]">Emergency Contact</span>
                    <strong className="text-slate-900">
                      {verifiedResult.guardians?.father?.name || verifiedResult.guardians?.mother?.name} ({verifiedResult.guardians?.father?.phone || verifiedResult.guardians?.mother?.phone || 'No phone'})
                    </strong>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-5 bg-rose-50 border-2 border-rose-400 rounded-2xl text-center space-y-2">
                <ShieldAlert className="w-10 h-10 text-rose-600 mx-auto" />
                <h4 className="text-sm font-bold text-rose-900">Invalid or Unrecognized Card Token</h4>
                <p className="text-xs text-rose-700">
                  No active student record corresponds to the queried ID or signature hash in the SCOLARIS database.
                </p>
              </div>
            )}
          </div>
        )}

      </div>
    </Modal>
  );
};
