import React, { useState, useRef } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import {
  Download,
  Upload,
  RotateCcw,
  School,
  HardDrive,
  Save,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export const BackupRestoreManager = () => {
  const { schoolInfo, updateSchoolInfo, exportDataBackup, importDataBackup, resetToDemoData } = useSchool();
  const { showSuccess, showError, showWarning } = useToast();
  const { user } = useAuth();
  const fileInputRef = useRef(null);

  const [schoolForm, setSchoolForm] = useState(() => ({ ...schoolInfo }));

  const handleSaveInfo = (e) => {
    e.preventDefault();
    updateSchoolInfo(schoolForm, user.name);
    showSuccess('School institution details updated.');
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target.result);
        const ok = importDataBackup(json);
        if (ok) {
          showSuccess('Database restored successfully from local backup file.');
        } else {
          showError('Invalid SCOLARIS backup file structure.');
        }
      } catch (err) {
        showError('Failed to parse backup JSON file.');
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all data back to initial Congolese demo state? Any unsaved local edits will be reset.')) {
      resetToDemoData();
    }
  };

  return (
    <div className="space-y-6">
      
      {/* 1. School Information Form */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">Institution Identity & Header Parameters</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              These credentials appear on all official printed report cards, ID badges, and payment receipts
            </p>
          </div>
          <School className="w-5 h-5 text-teal-600" />
        </div>

        <form onSubmit={handleSaveInfo} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full School Name *</label>
              <input
                type="text"
                required
                value={schoolForm.name}
                onChange={(e) => setSchoolForm({ ...schoolForm, name: e.target.value })}
                className="w-full text-xs font-bold border border-slate-300 rounded-xl px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Short Name / Brand *</label>
              <input
                type="text"
                required
                value={schoolForm.shortName}
                onChange={(e) => setSchoolForm({ ...schoolForm, shortName: e.target.value })}
                className="w-full text-xs font-bold border border-slate-300 rounded-xl px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">City & District *</label>
              <input
                type="text"
                required
                value={schoolForm.city}
                onChange={(e) => setSchoolForm({ ...schoolForm, city: e.target.value })}
                className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Country *</label>
              <input
                type="text"
                required
                value={schoolForm.country}
                onChange={(e) => setSchoolForm({ ...schoolForm, country: e.target.value })}
                className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Physical Address *</label>
              <input
                type="text"
                required
                value={schoolForm.address}
                onChange={(e) => setSchoolForm({ ...schoolForm, address: e.target.value })}
                className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Phone Numbers *</label>
              <input
                type="text"
                required
                value={schoolForm.phone}
                onChange={(e) => setSchoolForm({ ...schoolForm, phone: e.target.value })}
                className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Motto</label>
              <input
                type="text"
                value={schoolForm.motto}
                onChange={(e) => setSchoolForm({ ...schoolForm, motto: e.target.value })}
                className="w-full text-xs italic border border-slate-300 rounded-xl px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Active Academic Year *</label>
              <input
                type="text"
                required
                value={schoolForm.currentAcademicYear}
                onChange={(e) => setSchoolForm({ ...schoolForm, currentAcademicYear: e.target.value })}
                className="w-full text-xs font-bold border border-slate-300 rounded-xl px-3 py-2 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Current Active Trimester/Term *</label>
              <select
                value={schoolForm.currentTerm}
                onChange={(e) => setSchoolForm({ ...schoolForm, currentTerm: e.target.value })}
                className="w-full text-xs font-bold border border-slate-300 rounded-xl px-3 py-2 bg-white"
              >
                <option value="Term 1">Term 1 (1er Trimestre)</option>
                <option value="Term 2">Term 2 (2ème Trimestre)</option>
                <option value="Term 3">Term 3 (3ème Trimestre)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-md"
            >
              <Save className="w-4 h-4" />
              Save Institution Profile
            </button>
          </div>
        </form>
      </div>

      {/* 2. USB Offline Backup & Restore Section */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <HardDrive className="w-5 h-5 text-teal-600" />
              Local Storage Backup & USB Key Storage (Offline Resilience)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Power and internet outages are frequent. Download daily local JSON database backups to USB keys or external media.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {/* Export */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col justify-between space-y-3">
            <div>
              <h4 className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                <Download className="w-4 h-4 text-teal-600" />
                Export Full Database Backup
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Downloads complete local records including students, teachers, grades, invoices, receipts, and configurations into a timestamped JSON file.
              </p>
            </div>
            <button
              type="button"
              onClick={exportDataBackup}
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 shadow-sm"
            >
              <Download className="w-4 h-4" />
              Download Local Backup (.json)
            </button>
          </div>

          {/* Import */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col justify-between space-y-3">
            <div>
              <h4 className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                <Upload className="w-4 h-4 text-blue-600" />
                Restore from Backup File
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Upload and import an existing SCOLARIS JSON backup file from an external USB drive to restore full database state.
              </p>
            </div>
            <div>
              <input
                type="file"
                ref={fileInputRef}
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 shadow-sm"
              >
                <Upload className="w-4 h-4" />
                Select Backup File to Restore
              </button>
            </div>
          </div>
        </div>

        {/* Reset Database to Initial Seed Demo Data */}
        <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            Reset all database tables back to clean Congolese school demo state.
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-rose-700 hover:bg-rose-50 rounded-xl border border-rose-200 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset to Initial Demo Data
          </button>
        </div>
      </div>

    </div>
  );
};
