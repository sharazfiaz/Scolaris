import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { Modal } from '../common/Modal';
import { Plus, Edit, Trash2, BookOpen, Percent, Layers } from 'lucide-react';

export const SubjectManager = () => {
  const { subjects, cycles, addSubject, updateSubject, deleteSubject } = useSchool();
  const { showSuccess, showWarning } = useToast();
  const { user } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subjectToEdit, setSubjectToEdit] = useState(null);

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    defaultWeight: 3,
    caWeight: 40,
    examWeight: 60,
    applicableCycles: ['lower_secondary', 'upper_secondary']
  });

  const handleOpenAdd = () => {
    setSubjectToEdit(null);
    setFormData({
      code: '',
      name: '',
      defaultWeight: 3,
      caWeight: 40,
      examWeight: 60,
      applicableCycles: ['lower_secondary', 'upper_secondary']
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (subj) => {
    setSubjectToEdit(subj);
    setFormData({
      code: subj.code,
      name: subj.name,
      defaultWeight: subj.defaultWeight || 2,
      caWeight: subj.caWeight !== undefined ? subj.caWeight : 40,
      examWeight: subj.examWeight !== undefined ? subj.examWeight : 60,
      applicableCycles: subj.applicableCycles || ['lower_secondary', 'upper_secondary']
    });
    setIsModalOpen(true);
  };

  const handleCycleToggle = (cycleId) => {
    const exists = formData.applicableCycles.includes(cycleId);
    let updated;
    if (exists) {
      updated = formData.applicableCycles.filter(c => c !== cycleId);
    } else {
      updated = [...formData.applicableCycles, cycleId];
    }
    setFormData({ ...formData, applicableCycles: updated });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.code.trim()) {
      showWarning('Please enter subject name and code.');
      return;
    }
    if (Number(formData.caWeight) + Number(formData.examWeight) !== 100) {
      showWarning('Continuous Assessment (CA) and Exam weights must sum to 100%.');
      return;
    }

    if (subjectToEdit) {
      updateSubject(subjectToEdit.id, formData, user.name);
      showSuccess(`Subject ${formData.name} updated.`);
    } else {
      addSubject(formData, user.name);
      showSuccess(`New subject ${formData.name} created.`);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete subject ${name}?`)) {
      deleteSubject(id, user.name);
      showSuccess(`Subject ${name} removed.`);
    }
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">Academic Subjects & Grading Weights</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure subjects, cycle applicability, default coefficients, and CA vs Exam weighted ratios
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-md transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Add New Subject
        </button>
      </div>

      {/* Subjects Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {subjects.map(subj => (
          <div key={subj.id} className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                    {subj.code}
                  </span>
                  <h4 className="font-bold text-sm text-slate-900 mt-1.5">{subj.name}</h4>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(subj)}
                    className="p-1 text-slate-400 hover:text-slate-700 rounded"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(subj.id, subj.name)}
                    className="p-1 text-slate-400 hover:text-rose-600 rounded"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Weight & Formula */}
              <div className="mt-3 pt-2.5 border-t border-slate-100 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Default Base Coefficient:</span>
                  <strong className="font-mono text-slate-900 font-bold">{subj.defaultWeight || 1}</strong>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Grading Ratio:</span>
                  <strong className="font-mono text-teal-800 font-bold">
                    CA {subj.caWeight || 40}% / Exam {subj.examWeight || 60}%
                  </strong>
                </div>
              </div>
            </div>

            {/* Applicable Cycles */}
            <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-1">
              {(subj.applicableCycles || []).map(c => (
                <span key={c} className="text-[9px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600 capitalize">
                  {c.replace('_', ' ')}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={subjectToEdit ? 'Edit Subject' : 'Add New Subject'}
          subtitle="Configure subject code, title, evaluation weighting, and applicable cycles"
          maxWidth="max-w-xl"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Subject Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. PHIL"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="w-full text-xs font-bold border border-slate-300 rounded-xl px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Subject Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Philosophy"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full text-xs font-semibold border border-slate-300 rounded-xl px-3 py-2"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Base Coeff *</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={formData.defaultWeight}
                  onChange={(e) => setFormData({ ...formData, defaultWeight: Number(e.target.value) })}
                  className="w-full text-xs font-bold border border-slate-300 rounded-xl px-3 py-2 text-center"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">CA Weight % *</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.caWeight}
                  onChange={(e) => setFormData({ ...formData, caWeight: Number(e.target.value), examWeight: 100 - Number(e.target.value) })}
                  className="w-full text-xs font-bold border border-slate-300 rounded-xl px-3 py-2 text-center text-teal-800"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Exam Weight % *</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.examWeight}
                  onChange={(e) => setFormData({ ...formData, examWeight: Number(e.target.value), caWeight: 100 - Number(e.target.value) })}
                  className="w-full text-xs font-bold border border-slate-300 rounded-xl px-3 py-2 text-center text-blue-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Applicable Education Cycles:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {cycles.map(c => {
                  const isChecked = formData.applicableCycles.includes(c.id);
                  return (
                    <label
                      key={c.id}
                      className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-semibold cursor-pointer ${
                        isChecked ? 'bg-teal-50 border-teal-300 text-teal-900' : 'bg-slate-50 border-slate-200 text-slate-600'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleCycleToggle(c.id)}
                        className="rounded text-teal-600"
                      />
                      {c.name}
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold rounded-xl text-white bg-teal-600 hover:bg-teal-700 shadow-md"
              >
                {subjectToEdit ? 'Save Changes' : 'Create Subject'}
              </button>
            </div>
          </form>
        </Modal>
      )}

    </div>
  );
};
