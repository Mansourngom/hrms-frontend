import React, { useState, useEffect } from 'react';
import positionService from '../services/position.service';
import departmentService from '../services/department.service';
import { useLanguage } from '../contexts/LanguageContext';
import { Plus, Edit2, Trash2, Shield, DollarSign, Briefcase, X, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

const Positions = () => {
  const { t } = useLanguage();
  const [positions, setPositions] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentPos, setCurrentPos] = useState(null); // null for add, object for edit

  const [formData, setFormData] = useState({
    title: '',
    code: '',
    department: '',
    description: '',
    responsibilities: '',
    requirements: '',
    salaryRange: {
      min: 0,
      max: 0,
      currency: 'XOF',
    },
  });

  const fetchPositionsAndDepartments = async () => {
    setLoading(true);
    try {
      const [posRes, deptRes] = await Promise.all([
        positionService.getPositions(),
        departmentService.getDepartments()
      ]);
      setPositions(posRes.data || []);
      setDepartments(deptRes.data || []);
    } catch (error) {
      console.error(error);
      toast.error('Erreur de chargement des données');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPositionsAndDepartments();
  }, []);

  const handleOpenAdd = () => {
    setCurrentPos(null);
    setFormData({
      title: '',
      code: '',
      department: '',
      description: '',
      responsibilities: '',
      requirements: '',
      salaryRange: {
        min: 0,
        max: 0,
        currency: 'XOF',
      },
    });
    setShowModal(true);
  };

  const handleOpenEdit = (pos) => {
    setCurrentPos(pos);
    setFormData({
      title: pos.title || '',
      code: pos.code || '',
      department: pos.department?._id || pos.department || '',
      description: pos.description || '',
      responsibilities: Array.isArray(pos.responsibilities) ? pos.responsibilities.join('\n') : pos.responsibilities || '',
      requirements: Array.isArray(pos.requirements) ? pos.requirements.join('\n') : pos.requirements || '',
      salaryRange: {
        min: pos.salaryRange?.min || 0,
        max: pos.salaryRange?.max || 0,
        currency: pos.salaryRange?.currency || 'XOF',
      },
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Voulez-vous vraiment supprimer ce poste ?')) return;

    try {
      await positionService.deletePosition(id);
      toast.success('Poste supprimé avec succès');
      fetchPositionsAndDepartments();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Erreur lors de la suppression');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.code || !formData.department) {
      toast.error('Le titre, le code et le département sont obligatoires');
      return;
    }

    // Split textareas by newline to make arrays
    const formattedData = {
      ...formData,
      responsibilities: formData.responsibilities.split('\n').filter(r => r.trim() !== ''),
      requirements: formData.requirements.split('\n').filter(r => r.trim() !== ''),
    };

    try {
      if (currentPos) {
        await positionService.updatePosition(currentPos._id, formattedData);
        toast.success('Poste modifié avec succès');
      } else {
        await positionService.createPosition(formattedData);
        toast.success('Poste créé avec succès');
      }
      setShowModal(false);
      fetchPositionsAndDepartments();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Erreur lors de l'enregistrement");
    }
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-sm font-medium text-slate-500">{t('loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Postes & Fiches de Rôle</h2>
          <p className="text-sm text-slate-500 font-medium">Gérez la nomenclature des postes et grilles de salaires associés.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover transition-all shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Ajouter un poste
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm flex items-center gap-4">
          <div className="rounded-xl p-3 bg-blue-50 text-blue-600">
            <Briefcase className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">Postes uniques</p>
            <p className="text-2xl font-bold text-slate-900">{positions.length}</p>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm flex items-center gap-4">
          <div className="rounded-xl p-3 bg-emerald-50 text-emerald-600">
            <DollarSign className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">Salaire Moyen Proposé</p>
            <p className="text-2xl font-bold text-slate-900">
              {positions.length > 0 
                ? Math.round(positions.reduce((sum, p) => sum + ((p.salaryRange?.min || 0) + (p.salaryRange?.max || 0)) / 2, 0) / positions.length).toLocaleString('fr-FR')
                : 0} F CFA
            </p>
          </div>
        </div>
      </div>

      {/* Table Content */}
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm shadow-slate-100/40">
        {positions.length === 0 ? (
          <div className="text-center py-12">
            <AlertCircle className="h-10 w-10 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-500">{t('emptyList')}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-xs font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-4">Code</th>
                  <th className="py-4">Titre du Poste</th>
                  <th className="py-4">Département</th>
                  <th className="py-4">Fourchette de Salaire</th>
                  <th className="py-4">Missions / Exigences</th>
                  <th className="py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {positions.map((pos) => (
                  <tr key={pos._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 font-bold text-slate-700">{pos.code || '-'}</td>
                    <td className="py-4 font-bold text-slate-900">{pos.title}</td>
                    <td className="py-4">
                      {pos.department ? (
                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                          {pos.department.name || pos.department}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">Non spécifié</span>
                      )}
                    </td>
                    <td className="py-4 font-semibold text-slate-800">
                      {pos.salaryRange?.min?.toLocaleString('fr-FR')} - {pos.salaryRange?.max?.toLocaleString('fr-FR')} F CFA
                    </td>
                    <td className="py-4 text-slate-500 max-w-[220px] truncate" title={pos.description}>
                      {pos.description || '-'}
                    </td>
                    <td className="py-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(pos)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:border-primary/30 hover:text-primary transition-all"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(pos._id)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:border-rose-200 hover:text-rose-600 transition-all"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl border border-slate-100 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <h3 className="text-lg font-bold text-slate-900">
                {currentPos ? 'Modifier le poste' : 'Créer un poste'}
              </h3>
              <button onClick={() => setShowModal(false)} className="rounded-lg p-1 text-slate-400 hover:bg-slate-50">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Code Unique *
                  </label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    placeholder="ING-DEV"
                    className="w-full rounded-xl border border-slate-200 py-2.5 px-3.5 text-sm uppercase outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Titre du Poste *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Ingénieur d'études"
                    className="w-full rounded-xl border border-slate-200 py-2.5 px-3.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Département *
                  </label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 py-2.5 px-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-white"
                    required
                  >
                    <option value="">Sélectionner</option>
                    {departments.map((dept) => (
                      <option key={dept._id} value={dept._id}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                      Min (F CFA)
                    </label>
                    <input
                      type="number"
                      value={formData.salaryRange.min}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        salaryRange: { ...formData.salaryRange, min: parseInt(e.target.value) || 0 } 
                      })}
                      className="w-full rounded-xl border border-slate-200 py-2.5 px-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                      Max (F CFA)
                    </label>
                    <input
                      type="number"
                      value={formData.salaryRange.max}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        salaryRange: { ...formData.salaryRange, max: parseInt(e.target.value) || 0 } 
                      })}
                      className="w-full rounded-xl border border-slate-200 py-2.5 px-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Description générale
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="En charge du développement des applications..."
                  className="w-full rounded-xl border border-slate-200 py-2.5 px-3.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Missions (1 par ligne)
                  </label>
                  <textarea
                    value={formData.responsibilities}
                    onChange={(e) => setFormData({ ...formData, responsibilities: e.target.value })}
                    placeholder="Concevoir les bases de données&#10;Développer des APIs..."
                    rows="3"
                    className="w-full rounded-xl border border-slate-200 py-2.5 px-3.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  ></textarea>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Exigences (1 par ligne)
                  </label>
                  <textarea
                    value={formData.requirements}
                    onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                    placeholder="Bac+5 en informatique&#10;3 ans d'expérience..."
                    rows="3"
                    className="w-full rounded-xl border border-slate-200 py-2.5 px-3.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  ></textarea>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-650 hover:bg-slate-50 transition-all"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover shadow-sm transition-all"
                >
                  {t('save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Positions;
