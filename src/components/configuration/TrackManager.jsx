import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { Modal } from '../common/Modal';
import { Plus, Edit, Trash2, Layers, BookOpen, Check } from 'lucide-react';

export const TrackManager = () => {
  const { tracks, subjects, addTrack, updateTrack, deleteTrack } = useSchool();
  const { showSuccess, showWarning } = useToast();
  const { user } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [trackToEdit, setTrackToEdit] = useState(null);

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    cycleId: 'upper_secondary',
    subjectWeights: {}
  });

  const handleOpenAdd = () => {
    setTrackToEdit(null);
    setFormData({
      code: 'Track D',
      name: 'Life & Earth Sciences / Natural Sciences (Série D)',
      description: 'Specialization focusing on biological and health sciences',
      cycleId: 'upper_secondary',
      subjectWeights: {
        'subj_svt': 5,
        'subj_math': 4,
        'subj_phys_sci': 4,
        'subj_french': 2,
        'subj_philo': 2,
        'subj_english': 2,
        'subj_hist_geo': 2,
        'subj_pe': 1
      }
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (trk) => {
    setTrackToEdit(trk);
    setFormData({
      code: trk.code,
      name: trk.name,
      description: trk.description || '',
      cycleId: trk.cycleId || 'upper_secondary',
      subjectWeights: trk.subjectWeights ? { ...trk.subjectWeights } : {}
    });
    setIsModalOpen(true);
  };

  const handleWeightChange = (subjId, weight) => {
    setFormData(prev => ({
      ...prev,
      subjectWeights: {
        ...prev.subjectWeights,
        [subjId]: Number(weight) || 1
      }
    }));
  };

  const handleToggleSubject = (subjId) => {
    setFormData(prev => {
      const weights = { ...prev.subjectWeights };
      if (weights[subjId] !== undefined) {
        delete weights[subjId];
      } else {
        const subj = subjects.find(s => s.id === subjId);
        weights[subjId] = subj?.defaultWeight || 2;
      }
      return { ...prev, subjectWeights: weights };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.code.trim() || !formData.name.trim()) {
      showWarning('Please enter both track code and name.');
      return;
    }

    if (trackToEdit) {
      updateTrack(trackToEdit.id, formData, user.name);
      showSuccess(`Track ${formData.code} updated successfully.`);
    } else {
      addTrack(formData, user.name);
      showSuccess(`New upper secondary track ${formData.code} created.`);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id, code) => {
    if (window.confirm(`Are you sure you want to delete ${code}?`)) {
      deleteTrack(id, user.name);
      showSuccess(`Track ${code} removed.`);
    }
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">Upper Secondary Specialization Tracks</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure Congolese high school tracks (A, C, D, E, G, etc.) and customized subject coefficient matrices
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-md transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Add Custom Track
        </button>
      </div>

      {/* Tracks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tracks.map(trk => (
          <div key={trk.id} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-mono font-black text-teal-800 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200">
                    {trk.code}
                  </span>
                  <h4 className="font-bold text-base text-slate-900 mt-2">{trk.name}</h4>
                  <p className="text-xs text-slate-500 mt-1">{trk.description}</p>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(trk)}
                    className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(trk.id, trk.code)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Subject Coefficients Table */}
              <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                <span className="text-[11px] uppercase font-bold text-slate-500 block">
                  Subject Coefficients Matrix:
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {Object.entries(trk.subjectWeights || {}).map(([subjId, weight]) => {
                    const s = subjects.find(sub => sub.id === subjId);
                    return (
                      <div key={subjId} className="flex items-center justify-between p-2 bg-slate-50 rounded-xl border border-slate-200/60">
                        <span className="font-medium text-slate-800 truncate pr-1">{s?.name || subjId}</span>
                        <span className="font-mono font-bold bg-teal-100 text-teal-900 px-2 py-0.5 rounded text-[11px]">
                          Coeff: {weight}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="text-[11px] text-slate-400 font-medium pt-2 border-t border-slate-100">
              Total Subjects: {Object.keys(trk.subjectWeights || {}).length} Disciplines
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Track Modal */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={trackToEdit ? 'Edit Specialization Track' : 'Create New Specialization Track'}
          subtitle="Define track title, code, and assign subject weights without hardcoding"
          maxWidth="max-w-2xl"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Track Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Track D"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="w-full text-xs font-bold border border-slate-300 rounded-xl px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Track Designation / Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Life & Earth Sciences (Série D)"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full text-xs font-semibold border border-slate-300 rounded-xl px-3 py-2"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
              <input
                type="text"
                placeholder="Description of academic focus..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2"
              />
            </div>

            <div className="pt-2 border-t border-slate-200">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Configure Included Subjects & Coefficients:
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
                {subjects.filter(s => s.applicableCycles?.includes('upper_secondary')).map(subj => {
                  const isIncluded = formData.subjectWeights[subj.id] !== undefined;
                  const currentWeight = formData.subjectWeights[subj.id] || subj.defaultWeight;

                  return (
                    <div
                      key={subj.id}
                      className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 text-xs transition-colors ${
                        isIncluded ? 'bg-teal-50 border-teal-300 text-teal-950' : 'bg-slate-50 border-slate-200 text-slate-500'
                      }`}
                    >
                      <label className="flex items-center gap-2 cursor-pointer flex-1 font-semibold truncate">
                        <input
                          type="checkbox"
                          checked={isIncluded}
                          onChange={() => handleToggleSubject(subj.id)}
                          className="rounded text-teal-600 focus:ring-teal-500"
                        />
                        <span className="truncate">{subj.name}</span>
                      </label>

                      {isIncluded && (
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] font-bold">Coeff:</span>
                          <input
                            type="number"
                            min="1"
                            max="10"
                            value={currentWeight}
                            onChange={(e) => handleWeightChange(subj.id, e.target.value)}
                            className="w-14 text-center font-bold border border-teal-300 rounded-lg p-1 bg-white"
                          />
                        </div>
                      )}
                    </div>
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
                {trackToEdit ? 'Save Track' : 'Create Track'}
              </button>
            </div>
          </form>
        </Modal>
      )}

    </div>
  );
};
