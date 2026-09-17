import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { useSchool } from '../../context/SchoolContext';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import {
  Printer,
  Download,
  RotateCcw,
  CheckCircle2,
  ShieldCheck,
  Building,
  School,
  Sparkles,
  QrCode as QrIcon
} from 'lucide-react';

export const SchoolIdCard = ({ studentId, onOpenVerifier, showControls = true }) => {
  const { students, classes, tracks, schoolInfo, reissueIdCard, idCardReissues } = useSchool();
  const { showSuccess, showWarning } = useToast();
  const { user } = useAuth();

  const [qrDataUrl, setQrDataUrl] = useState('');
  const [printMode, setPrintMode] = useState('bw'); // 'color' or 'bw' (optimized for office printers)
  const [isReissuing, setIsReissuing] = useState(false);
  const [reissueReason, setReissueReason] = useState('Lost card replacement');

  const student = students.find(s => s.id === studentId);
  const currentClass = classes.find(c => c.id === student?.classId);
  const currentTrack = student?.trackId ? tracks.find(t => t.id === student.trackId) : null;

  // Generate QR Code data with verification cryptographic token simulation
  useEffect(() => {
    if (!student) return;

    const verificationPayload = JSON.stringify({
      id: student.id,
      name: `${student.firstName} ${student.lastName}`,
      class: currentClass?.name || 'N/A',
      year: student.academicYear,
      institution: schoolInfo.name,
      validUntil: '2027-06-30',
      vHash: `SC-${student.id.replace(/-/g, '')}-${student.firstName.charCodeAt(0)}${student.lastName.charCodeAt(0)}`
    });

    QRCode.toDataURL(verificationPayload, {
      width: 200,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    })
      .then(url => setQrDataUrl(url))
      .catch(err => console.error('Error generating QR code', err));
  }, [student, currentClass, schoolInfo]);

  if (!student) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleReissueSubmit = (e) => {
    e.preventDefault();
    if (!reissueReason.trim()) {
      showWarning('Please enter a reason for reissue.');
      return;
    }
    reissueIdCard(student.id, reissueReason, user.name);
    showSuccess(`School ID card successfully reissued for ${student.firstName} ${student.lastName}.`);
    setIsReissuing(false);
  };

  const studentReissues = (idCardReissues || []).filter(r => r.studentId === student.id);

  return (
    <div className="space-y-4">
      
      {/* Action Controls (Hidden in Print) */}
      {showControls && (
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl no-print">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-700">Printer Optimization:</span>
            <button
              onClick={() => setPrintMode('bw')}
              className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-all ${
                printMode === 'bw'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
            >
              Black & White (Crisp Laser)
            </button>
            <button
              onClick={() => setPrintMode('color')}
              className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-all ${
                printMode === 'color'
                  ? 'bg-teal-600 text-white border-teal-700 shadow-sm'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
            >
              Full Color Badge
            </button>
          </div>

          <div className="flex items-center gap-2">
            {onOpenVerifier && (
              <button
                onClick={() => onOpenVerifier(student)}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition-colors"
              >
                <QrIcon className="w-3.5 h-3.5" />
                Test QR Scanner
              </button>
            )}

            <button
              onClick={() => setIsReissuing(true)}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 border border-slate-300 hover:bg-slate-200 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reissue Card ({studentReissues.length})
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 text-xs font-bold px-4 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white shadow-md transition-all active:scale-95"
            >
              <Printer className="w-3.5 h-3.5" />
              Print ID Card
            </button>
          </div>
        </div>
      )}

      {/* ID Card Front & Back Preview Container */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-6 p-6 bg-slate-100/70 rounded-2xl border border-slate-200">
        
        {/* ================= CARD FRONT ================= */}
        <div
          className={`w-[85.6mm] h-[53.98mm] rounded-2xl border-2 p-3.5 flex flex-col justify-between shadow-lg relative overflow-hidden transition-all print:shadow-none print:border-black ${
            printMode === 'bw'
              ? 'bg-white text-black border-black'
              : 'bg-gradient-to-br from-brand-900 via-teal-900 to-slate-900 text-white border-teal-500/50 shadow-teal-900/20'
          }`}
          style={{ boxSizing: 'border-box' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b pb-1.5 print:border-black border-white/20">
            <div className="flex items-center gap-1.5">
              <div className={`w-5 h-5 rounded-md flex items-center justify-center font-black text-[10px] ${
                printMode === 'bw' ? 'bg-black text-white' : 'bg-teal-400 text-brand-950'
              }`}>
                SC
              </div>
              <div>
                <div className="text-[9px] font-black uppercase tracking-tight leading-none">
                  {schoolInfo.name}
                </div>
                <div className={`text-[7px] font-semibold leading-none mt-0.5 ${
                  printMode === 'bw' ? 'text-slate-700' : 'text-teal-300'
                }`}>
                  Republic of the Congo • Brazzaville
                </div>
              </div>
            </div>
            <div className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded border leading-none ${
              printMode === 'bw' ? 'border-black text-black bg-slate-100' : 'border-teal-400 text-teal-300 bg-teal-950/60'
            }`}>
              STUDENT ID CARD
            </div>
          </div>

          {/* Body with Photo & Information */}
          <div className="flex items-center gap-3 my-auto">
            {/* Student Photo */}
            <div className={`w-14 h-16 rounded-xl border-2 flex flex-col items-center justify-center font-bold text-base flex-shrink-0 relative overflow-hidden ${
              printMode === 'bw' ? 'border-black bg-slate-100 text-black' : 'border-teal-400 bg-slate-800 text-teal-200'
            }`}>
              <span>{student.firstName.charAt(0)}{student.lastName.charAt(0)}</span>
              <span className="text-[7px] font-normal uppercase tracking-wider absolute bottom-1">PHOTO</span>
            </div>

            {/* Identity Info */}
            <div className="flex-1 min-w-0 space-y-0.5">
              <div className="text-[11px] font-black leading-tight truncate">
                {student.lastName.toUpperCase()}, {student.firstName}
              </div>
              <div className={`font-mono text-[9px] font-bold ${
                printMode === 'bw' ? 'text-black' : 'text-teal-300'
              }`}>
                ID: {student.id}
              </div>
              <div className="text-[8px] font-semibold flex items-center gap-1.5">
                <span>Class: <strong className="underline">{currentClass?.name || 'N/A'}</strong></span>
                {currentTrack && <span>• ({currentTrack.code})</span>}
              </div>
              <div className="text-[7.5px] text-slate-500 print:text-black">
                DOB: {student.dateOfBirth} ({student.placeOfBirth})
              </div>
            </div>
          </div>

          {/* Footer Bar */}
          <div className="flex items-center justify-between pt-1.5 border-t border-dashed print:border-black border-white/20 text-[7px] font-bold">
            <span className={printMode === 'bw' ? 'text-black' : 'text-teal-300'}>
              ACADEMIC YEAR: {student.academicYear}
            </span>
            <span className="uppercase">VALID AT CS RENAISSANCE</span>
          </div>
        </div>

        {/* ================= CARD BACK (QR Code & Emergency) ================= */}
        <div
          className={`w-[85.6mm] h-[53.98mm] rounded-2xl border-2 p-3.5 flex flex-col justify-between shadow-lg relative overflow-hidden transition-all print:shadow-none print:border-black ${
            printMode === 'bw'
              ? 'bg-white text-black border-black'
              : 'bg-gradient-to-br from-slate-900 via-brand-950 to-teal-950 text-white border-teal-500/50 shadow-teal-900/20'
          }`}
          style={{ boxSizing: 'border-box' }}
        >
          {/* Back Header */}
          <div className="flex items-center justify-between border-b pb-1 print:border-black border-white/20 text-[7.5px] font-bold">
            <span>OFFICIAL STUDENT IDENTIFICATION</span>
            <span className={printMode === 'bw' ? 'text-black' : 'text-teal-400'}>MEPPSA CONGO</span>
          </div>

          {/* Middle with Secure QR Code */}
          <div className="flex items-center justify-between gap-2 my-auto">
            <div className="space-y-1 text-[7px] leading-tight flex-1">
              <p className="font-bold">Security Notice & Conditions:</p>
              <p className={printMode === 'bw' ? 'text-slate-700' : 'text-slate-300'}>
                This card remains the property of {schoolInfo.name}. Found cards must be returned to the secretariat.
              </p>
              <div className="pt-1 font-semibold">
                <div>Emergency Contact:</div>
                <div className="font-bold font-mono">
                  {student.guardians?.father?.phone || student.guardians?.mother?.phone || schoolInfo.phone}
                </div>
              </div>
            </div>

            {/* QR Code Canvas */}
            <div className="p-1 bg-white rounded-lg border border-black flex-shrink-0 text-center">
              {qrDataUrl ? (
                <img src={qrDataUrl} alt="Security QR Code" className="w-16 h-16 object-contain" />
              ) : (
                <div className="w-16 h-16 bg-slate-200 animate-pulse rounded" />
              )}
              <span className="text-[6px] font-mono font-bold text-black block mt-0.5">SCAN TO VERIFY</span>
            </div>
          </div>

          {/* Back Footer */}
          <div className="flex items-center justify-between pt-1 border-t print:border-black border-white/20 text-[6.5px] font-mono">
            <span>SIG: Le Chef d'Établissement</span>
            <span>VERIF HASH: SC-{student.id.slice(-4)}</span>
          </div>
        </div>

      </div>

      {/* Reissue Dialog */}
      {isReissuing && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-3 no-print">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
            <RotateCcw className="w-4 h-4 text-amber-700" />
            Process ID Card Reissue / Replacement
          </div>
          <form onSubmit={handleReissueSubmit} className="flex flex-col sm:flex-row items-center gap-3">
            <input
              type="text"
              required
              placeholder="Enter reason for reissue (e.g. Lost card, damaged, grade change)..."
              value={reissueReason}
              onChange={(e) => setReissueReason(e.target.value)}
              className="flex-1 text-xs border border-amber-300 rounded-xl px-3 py-2 bg-white"
            />
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setIsReissuing(false)}
                className="px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-amber-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold text-white bg-amber-700 hover:bg-amber-800 rounded-xl shadow-sm"
              >
                Confirm Reissue
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reissue History */}
      {studentReissues.length > 0 && (
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1.5 no-print">
          <span className="font-bold text-slate-700">Card Reissue Audit History:</span>
          {studentReissues.map(r => (
            <div key={r.id} className="text-[11px] text-slate-600 flex items-center justify-between border-b border-slate-200/60 pb-1">
              <span>Date: <strong>{r.date}</strong> • Reason: {r.reason}</span>
              <span className="text-slate-400">Issued by {r.issuedBy}</span>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
