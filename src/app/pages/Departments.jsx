import React, { useState, useEffect } from 'react';
import departmentService from '../services/department.service';
import employeeService from '../services/employee.service';
import { useLanguage } from '../contexts/LanguageContext';
import { Plus, Edit2, Trash2, Shield, DollarSign, Users, Award, X, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

const Departments = () => {
  const { t } = useLanguage();
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentDept, setCurrentDept] = useState(null); // null for add, object for edit

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    manager: '',
    budget: 0,
  });

  const fetchDepartmentsAndEmployees = async () => {
    setLoading(true);
    try {
      const [deptRes, empRes] = await Promise.all([
        departmentService.getDepartments(),
        employeeService.getEmployees()
      ]);
      setDepartments(deptRes.data || []);
      setEmployees(empRes.data || []);
    } catch (error) {
      console.error(error);
      toast.error('Erreur de chargement des données');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartmentsAndEmployees();
  }, []);

  const handleOpenAdd = () => {
    setCurrentDept(null);
    setFormData({
      name: '',
      code: '',
      description: '',
      manager: '',
      budget: 0,
    });
    setShowModal(true);
  };

  const handleOpenEdit = (dept) => {
    setCurrentDept(dept);
    setFormData({
      name: dept.name || '',
      code: dept.code || '',
      description: dept.description || '',
      manager: dept.manager?._id || dept.manager || '',
      budget: dept.budget || 0,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Voulez-vous vraiment supprimer ce département ?')) return;

    try {
      await departmentService.deleteDepartment(id);
      toast.success('Département supprimé avec succès');
      fetchDepartmentsAndEmployees();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Erreur lors de la suppression');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.code) {
      toast.error('Le nom et le code sont obligatoires');
      return;
    }

    try {
      if (currentDept) {
        await departmentService.updateDepartment(currentDept._id, formData);
        toast.success('Département modifié avec succès');
      } else {
        await departmentService.createDepartment(formData);
        toast.success('Département créé avec succès');
      }
      setShowModal(false);
      fetchDepartmentsAndEmployees();
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
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Départements</h2>
          <p className="text-sm text-slate-500 font-medium">Gérez la structure hiérarchique et les budgets de votre entreprise.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover transition-all shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Ajouter un département
        </button>
      </div>

      {/* Grid Summary */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm flex items-center gap-4">
          <div className="rounded-xl p-3 bg-blue-50 text-blue-600">
            <Shield className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">Départements</p>
            <p className="text-2xl font-bold text-slate-900">{departments.length}</p>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm flex items-center gap-4">
          <div className="rounded-xl p-3 bg-emerald-50 text-emerald-600">
            <DollarSign className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">Budget Global</p>
            <p className="text-2xl font-bold text-slate-900">
              {departments.reduce((sum, d) => sum + (d.budget || 0), 0).toLocaleString('fr-FR')} F CFA
            </p>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm flex items-center gap-4">
          <div className="rounded-xl p-3 bg-purple-50 text-purple-600">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">Salariés Actifs</p>
            <p className="text-2xl font-bold text-slate-900">{employees.length}</p>
          </div>
        </div>
      </div>

      {/* Table Content */}
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm shadow-slate-100/40">
        {departments.length === 0 ? (
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
                  <th className="py-4">Nom du Département</th>
                  <th className="py-4">Description</th>
                  <th className="py-4">Chef de Département</th>
                  <th className="py-4">Budget</th>
                  <th className="py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {departments.map((dept) => (
                  <tr key={dept._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 font-bold text-slate-700">{dept.code}</td>
                    <td className="py-4 font-bold text-slate-900">{dept.name}</td>
                    <td className="py-4 text-slate-500 max-w-[200px] truncate" title={dept.description}>
                      {dept.description || '-'}
                    </td>
                    <td className="py-4">
                      {dept.manager ? (
                        <div className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                          <span className="font-semibold text-slate-700">
                            {typeof dept.manager === 'object' ? `${dept.manager.firstName} ${dept.manager.lastName}` : dept.manager}
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Non assigné</span>
                      )}
                    </td>
                    <td className="py-4 font-bold text-slate-800">
                      {(dept.budget || 0).toLocaleString('fr-FR')} F CFA
                    </td>
                    <td className="py-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(dept)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:border-primary/30 hover:text-primary transition-all"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(dept._id)}
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
                {currentDept ? 'Modifier le département' : 'Créer un département'}
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
                    placeholder="MKTG"
                    className="w-full rounded-xl border border-slate-200 py-2.5 px-3.5 text-sm uppercase outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Nom du Département *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Marketing"
                    className="w-full rounded-xl border border-slate-200 py-2.5 px-3.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Chef de Département (Manager)
                </label>
                <select
                  value={formData.manager}
                  onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 py-2.5 px-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-white"
                >
                  <option value="">Sélectionnez un chef</option>
                  {employees.map((emp) => (
                    <option key={emp._id} value={emp._id}>
                      {emp.firstName} {emp.lastName} ({emp.employeeCode})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Budget (F CFA)
                </label>
                <input
                  type="number"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                  className="w-full rounded-xl border border-slate-200 py-2.5 px-3.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Objectifs et responsabilités du département..."
                  rows="3"
                  className="w-full rounded-xl border border-slate-200 py-2.5 px-3.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                ></textarea>
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

export default Departments;
