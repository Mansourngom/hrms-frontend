import React, { useEffect, useState } from 'react';
import payrollService from '../services/payroll.service';
import employeeService from '../services/employee.service';
import { useLanguage } from '../contexts/LanguageContext';
import {
  DollarSign, FileText, Plus, Search, Printer, CheckCircle,
  Clock, User, Trash2, Eye, X, Calendar, Building2, CreditCard,
  Check, Sparkles, ShieldCheck, Download, AlertCircle, RefreshCw
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const Payroll = () => {
  const { t } = useLanguage();
  const [payrolls, setPayrolls] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [search, setSearch] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedStatus, setSelectedStatus] = useState('');

  // Modals state
  const [isGenerateBatchModalOpen, setIsGenerateBatchModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedPayslipForView, setSelectedPayslipForView] = useState(null);

  // Batch Generation Form
  const [batchMonth, setBatchMonth] = useState(new Date().getMonth() + 1);
  const [batchYear, setBatchYear] = useState(new Date().getFullYear());
  const [generating, setGenerating] = useState(false);

  // Single Payslip Form
  const [singleForm, setSingleForm] = useState({
    employee: '',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    baseSalary: 400000,
    allowances: 0,
    overtimeHours: 0,
    overtimeRate: 5000,
    deductions: 20000,
    status: 'pending',
    paymentMethod: 'wire_transfer',
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [payRes, empRes] = await Promise.all([
        payrollService.getPayrolls({ month: selectedMonth, year: selectedYear, status: selectedStatus }),
        employeeService.getEmployees()
      ]);
      setPayrolls(payRes.data || []);
      setEmployees(empRes.data || []);
    } catch (error) {
      console.error(error);
      toast.error('Erreur lors du chargement des données de la paie');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedMonth, selectedYear, selectedStatus]);

  // Handle Employee selection in single form to auto-fill base salary
  const handleEmployeeSelect = (empId) => {
    const emp = employees.find(e => e._id === empId);
    setSingleForm(prev => ({
      ...prev,
      employee: empId,
      baseSalary: emp?.salary?.base || 400000,
    }));
  };

  const handleGenerateBatch = async (e) => {
    e.preventDefault();
    try {
      setGenerating(true);
      const res = await payrollService.generateMonthlyPayroll(batchMonth, batchYear);
      toast.success(res.message || 'Bulletins de paie générés avec succès');
      setIsGenerateBatchModalOpen(false);
      fetchData();
    } catch (error) {
      console.error(error);
      toast.error('Erreur lors de la génération automatique');
    } finally {
      setGenerating(false);
    }
  };

  const handleCreateSingle = async (e) => {
    e.preventDefault();
    if (!singleForm.employee) {
      toast.error('Veuillez sélectionner un collaborateur');
      return;
    }
    try {
      await payrollService.createPayroll(singleForm);
      toast.success('Bulletin de paie créé avec succès');
      setIsCreateModalOpen(false);
      fetchData();
    } catch (error) {
      console.error(error);
      toast.error('Erreur lors de la création du bulletin');
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await payrollService.updatePayrollStatus(id, status);
      toast.success(`Statut mis à jour (${status === 'paid' ? 'Payé' : 'Validé'})`);
      fetchData();
    } catch (error) {
      console.error(error);
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce bulletin de paie ?')) return;
    try {
      await payrollService.deletePayroll(id);
      toast.success('Bulletin supprimé');
      fetchData();
    } catch (error) {
      console.error(error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const handlePrintPayslip = () => {
    window.print();
  };

  // Filtered Payrolls
  const filteredPayrolls = payrolls.filter((p) => {
    const empName = p.employee ? `${p.employee.firstName} ${p.employee.lastName}`.toLowerCase() : '';
    const code = p.payrollCode ? p.payrollCode.toLowerCase() : '';
    const q = search.toLowerCase();
    return empName.includes(q) || code.includes(q);
  });

  // Calculate Metrics
  const totalMasseSalariale = filteredPayrolls.reduce((sum, p) => sum + (p.netSalary || 0), 0);
  const avgSalary = filteredPayrolls.length > 0 ? Math.round(totalMasseSalariale / filteredPayrolls.length) : 0;
  const paidCount = filteredPayrolls.filter(p => p.status === 'paid').length;
  const totalOvertime = filteredPayrolls.reduce((sum, p) => sum + (p.overtimeHours || 0), 0);

  const monthsList = [
    { id: 1, name: 'Janvier' }, { id: 2, name: 'Février' }, { id: 3, name: 'Mars' },
    { id: 4, name: 'Avril' }, { id: 5, name: 'Mai' }, { id: 6, name: 'Juin' },
    { id: 7, name: 'Juillet' }, { id: 8, name: 'Août' }, { id: 9, name: 'Septembre' },
    { id: 10, name: 'Octobre' }, { id: 11, name: 'Novembre' }, { id: 12, name: 'Décembre' }
  ];

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <DollarSign className="h-7 w-7 text-primary" />
            Gestion de la Paie
          </h1>
          <p className="text-sm font-medium text-slate-500">
            Gestion des salaires, génération des bulletins de paie et paiements en F CFA
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsGenerateBatchModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all shadow-sm"
          >
            <Sparkles className="h-4 w-4 text-amber-500" />
            Générer Paie Mensuelle
          </button>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover transition-all shadow-sm"
          >
            <Plus className="h-4 w-4" />
            Créer un Bulletin
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-400">Masse Salariale Net</span>
            <div className="h-9 w-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold text-slate-900">
            {totalMasseSalariale.toLocaleString('fr-FR')} <span className="text-xs font-semibold text-slate-500">F CFA</span>
          </p>
          <span className="mt-1 inline-flex items-center text-xs font-semibold text-emerald-600">
            Cumul Période Sélectionnée
          </span>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-400">Salaire Moyen</span>
            <div className="h-9 w-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Building2 className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold text-slate-900">
            {avgSalary.toLocaleString('fr-FR')} <span className="text-xs font-semibold text-slate-500">F CFA</span>
          </p>
          <span className="mt-1 inline-flex items-center text-xs font-medium text-slate-400">
            Par collaborateur
          </span>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-400">Bulletins Payés</span>
            <div className="h-9 w-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <CheckCircle className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold text-slate-900">
            {paidCount} / {filteredPayrolls.length}
          </p>
          <span className="mt-1 inline-flex items-center text-xs font-semibold text-indigo-600">
            {filteredPayrolls.length > 0 ? Math.round((paidCount / filteredPayrolls.length) * 100) : 0}% Traités
          </span>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-400">Heures Supp. Total</span>
            <div className="h-9 w-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold text-slate-900">
            {totalOvertime} <span className="text-xs font-semibold text-slate-500">Heures</span>
          </p>
          <span className="mt-1 inline-flex items-center text-xs font-medium text-slate-400">
            Heures supplémentaires majorées
          </span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search Input */}
        <div className="relative w-full md:max-w-xs">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="text"
            placeholder="Rechercher par nom ou code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200 py-2 pl-9 pr-4 text-xs outline-none transition-all focus:border-primary"
          />
        </div>

        {/* Filter Selects */}
        <div className="flex flex-wrap gap-3 items-center w-full md:w-auto justify-end">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="rounded-xl border border-slate-200 py-2 px-3 text-xs outline-none bg-white text-slate-700 focus:border-primary"
          >
            {monthsList.map((m) => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>

          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="rounded-xl border border-slate-200 py-2 px-3 text-xs outline-none bg-white text-slate-700 focus:border-primary"
          >
            <option value={2025}>2025</option>
            <option value={2026}>2026</option>
            <option value={2027}>2027</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="rounded-xl border border-slate-200 py-2 px-3 text-xs outline-none bg-white text-slate-700 focus:border-primary"
          >
            <option value="">Tous les statuts</option>
            <option value="pending">En attente</option>
            <option value="validated">Validé</option>
            <option value="paid">Payé</option>
          </select>
        </div>
      </div>

      {/* Pay Slips Table */}
      <div className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex h-48 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        ) : filteredPayrolls.length === 0 ? (
          <div className="py-12 text-center">
            <FileText className="h-10 w-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">Aucun bulletin trouvé</h3>
            <p className="text-xs text-slate-400 mt-1">
              Aucun bulletin de paie ne correspond aux filtres de sélection.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-xs font-bold uppercase tracking-wider text-slate-400 bg-slate-50/50">
                  <th className="py-3.5 px-4">Code Bulletin</th>
                  <th className="py-3.5 px-4">Collaborateur</th>
                  <th className="py-3.5 px-4">Période</th>
                  <th className="py-3.5 px-4">Salaire de Base</th>
                  <th className="py-3.5 px-4">Primes / Extra</th>
                  <th className="py-3.5 px-4">Déductions</th>
                  <th className="py-3.5 px-4">Salaire Net</th>
                  <th className="py-3.5 px-4">Statut</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredPayrolls.map((pay) => {
                  const emp = pay.employee || {};
                  return (
                    <tr key={pay._id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-4 px-4 font-bold text-slate-800 text-xs">
                        {pay.payrollCode}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 shrink-0 rounded-full bg-slate-100 overflow-hidden border border-slate-100 flex items-center justify-center">
                            {emp.photo?.url ? (
                              <img src={emp.photo.url} alt="" className="h-full w-full object-cover" />
                            ) : (
                              <User className="h-4 w-4 text-slate-400" />
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 leading-tight">
                              {emp.firstName} {emp.lastName}
                            </p>
                            <p className="text-xs text-slate-400">{emp.position?.title || 'Collaborateur'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 font-medium text-slate-600 text-xs">
                        {monthsList.find(m => m.id === pay.month)?.name} {pay.year}
                      </td>
                      <td className="py-4 px-4 text-slate-700 font-semibold text-xs">
                        {pay.baseSalary?.toLocaleString('fr-FR')} F CFA
                      </td>
                      <td className="py-4 px-4 text-emerald-600 font-medium text-xs">
                        +{((pay.allowances || 0) + (pay.overtimeHours * pay.overtimeRate)).toLocaleString('fr-FR')} F CFA
                      </td>
                      <td className="py-4 px-4 text-rose-500 font-medium text-xs">
                        -{(pay.deductions || 0).toLocaleString('fr-FR')} F CFA
                      </td>
                      <td className="py-4 px-4 font-bold text-slate-900 text-sm">
                        {pay.netSalary?.toLocaleString('fr-FR')} F CFA
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold ${
                          pay.status === 'paid' ? 'bg-emerald-50 text-emerald-700' :
                          pay.status === 'validated' ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-700'
                        }`}>
                          {pay.status === 'paid' ? 'Payé' : pay.status === 'validated' ? 'Validé' : 'En attente'}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right space-x-1.5">
                        <button
                          onClick={() => setSelectedPayslipForView(pay)}
                          title="Voir le Bulletin"
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:border-primary hover:text-primary transition-all"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>

                        {pay.status !== 'paid' && (
                          <button
                            onClick={() => handleUpdateStatus(pay._id, 'paid')}
                            title="Marquer comme Payé"
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-all"
                          >
                            <Check className="h-3.5 w-3.5" />
                          </button>
                        )}

                        <button
                          onClick={() => handleDelete(pay._id)}
                          title="Supprimer"
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:border-rose-200 hover:text-rose-600 transition-all"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Batch Generation Modal */}
      {isGenerateBatchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-slate-100 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-amber-500" />
                Générer la paie mensuelle
              </h3>
              <button
                onClick={() => setIsGenerateBatchModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleGenerateBatch} className="space-y-4">
              <p className="text-xs text-slate-500 leading-relaxed">
                Cette action va générer automatiquement les bulletins de paie pour tous les collaborateurs actifs pour le mois et l'année sélectionnés.
              </p>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Mois</label>
                <select
                  value={batchMonth}
                  onChange={(e) => setBatchMonth(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-primary"
                >
                  {monthsList.map((m) => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Année</label>
                <select
                  value={batchYear}
                  onChange={(e) => setBatchYear(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-primary"
                >
                  <option value={2025}>2025</option>
                  <option value={2026}>2026</option>
                  <option value={2027}>2027</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsGenerateBatchModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={generating}
                  className="rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white hover:bg-primary-hover disabled:opacity-50"
                >
                  {generating ? 'Génération en cours...' : 'Lancer la génération'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Single Create Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <h3 className="text-lg font-bold text-slate-900">Créer un Bulletin de Paie</h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSingle} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Collaborateur *</label>
                <select
                  value={singleForm.employee}
                  onChange={(e) => handleEmployeeSelect(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-primary"
                  required
                >
                  <option value="">Sélectionner un collaborateur</option>
                  {employees.map((e) => (
                    <option key={e._id} value={e._id}>
                      {e.firstName} {e.lastName} ({e.employeeCode})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Mois</label>
                  <select
                    value={singleForm.month}
                    onChange={(e) => setSingleForm(prev => ({ ...prev, month: Number(e.target.value) }))}
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-primary"
                  >
                    {monthsList.map((m) => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Année</label>
                  <select
                    value={singleForm.year}
                    onChange={(e) => setSingleForm(prev => ({ ...prev, year: Number(e.target.value) }))}
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-primary"
                  >
                    <option value={2025}>2025</option>
                    <option value={2026}>2026</option>
                    <option value={2027}>2027</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Salaire de base (F CFA)</label>
                  <input
                    type="number"
                    value={singleForm.baseSalary}
                    onChange={(e) => setSingleForm(prev => ({ ...prev, baseSalary: Number(e.target.value) }))}
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Primes / Indemnités (F CFA)</label>
                  <input
                    type="number"
                    value={singleForm.allowances}
                    onChange={(e) => setSingleForm(prev => ({ ...prev, allowances: Number(e.target.value) }))}
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Heures Supplémentaires</label>
                  <input
                    type="number"
                    value={singleForm.overtimeHours}
                    onChange={(e) => setSingleForm(prev => ({ ...prev, overtimeHours: Number(e.target.value) }))}
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Taux Horaire (F CFA/h)</label>
                  <input
                    type="number"
                    value={singleForm.overtimeRate}
                    onChange={(e) => setSingleForm(prev => ({ ...prev, overtimeRate: Number(e.target.value) }))}
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Déductions / Cotisations (F CFA)</label>
                <input
                  type="number"
                  value={singleForm.deductions}
                  onChange={(e) => setSingleForm(prev => ({ ...prev, deductions: Number(e.target.value) }))}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-primary"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white hover:bg-primary-hover"
                >
                  Enregistrer le bulletin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ULTRA-MODERN PAYSLIP PREVIEW & PRINT MODAL */}
      {selectedPayslipForView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-3xl rounded-2xl bg-white shadow-2xl border border-slate-100 my-8 overflow-hidden">
            {/* Modal Control Action Bar */}
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-6 py-4 print:hidden">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-600" />
                <span className="text-sm font-bold text-slate-800">Aperçu du Bulletin de Paie</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handlePrintPayslip}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white hover:bg-primary-hover shadow-sm transition-all"
                >
                  <Printer className="h-4 w-4" />
                  Imprimer / Exporter PDF
                </button>
                <button
                  onClick={() => setSelectedPayslipForView(null)}
                  className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition-all"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Printable Payslip Card Body */}
            <div className="p-8 space-y-8 bg-white text-slate-800 font-sans leading-relaxed" id="printable-payslip">
              {/* Header Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b-2 border-slate-900 pb-6 gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-xl">
                      N
                    </div>
                    <div>
                      <h2 className="text-xl font-extrabold tracking-wider text-slate-900 uppercase">NEXUS HR ENTERPRISE</h2>
                      <p className="text-xs font-medium text-slate-500">Solutions de Gestion RH & Paie</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 mt-2">NINEA: 009238472 2V3 · BP 11000 Dakar, Sénégal</p>
                </div>

                <div className="text-left sm:text-right">
                  <span className="inline-block rounded-lg bg-slate-900 px-3 py-1 text-xs font-bold text-white uppercase tracking-widest mb-1">
                    BULLETIN DE PAIE
                  </span>
                  <p className="text-xs font-bold text-slate-700">Code: {selectedPayslipForView.payrollCode}</p>
                  <p className="text-xs text-slate-500">
                    Période: {monthsList.find(m => m.id === selectedPayslipForView.month)?.name} {selectedPayslipForView.year}
                  </p>
                </div>
              </div>

              {/* Employee & Company Metadata Card */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 rounded-xl border border-slate-200 bg-slate-50/50 p-5 text-xs">
                {/* Company Side */}
                <div className="space-y-1.5 border-r-0 sm:border-r border-slate-200 pr-0 sm:pr-4">
                  <p className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">EMPLOYEUR</p>
                  <p className="font-bold text-slate-900 text-sm">Nexus HR Sénégal S.A.</p>
                  <p className="text-slate-600">Avenue Cheikh Anta Diop, Dakar</p>
                  <p className="text-slate-600">SIRET / CNSS: 489-201-992</p>
                  <p className="text-slate-600">Convention: Commerce & Services</p>
                </div>

                {/* Employee Side */}
                <div className="space-y-1.5">
                  <p className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">SALARIÉ(E)</p>
                  <p className="font-bold text-slate-900 text-sm">
                    {selectedPayslipForView.employee?.firstName} {selectedPayslipForView.employee?.lastName}
                  </p>
                  <p className="text-slate-600">Matricule: {selectedPayslipForView.employee?.employeeCode}</p>
                  <p className="text-slate-600">Poste: {selectedPayslipForView.employee?.position?.title || 'Collaborateur'}</p>
                  <p className="text-slate-600">Département: {selectedPayslipForView.employee?.department?.name || 'Général'}</p>
                </div>
              </div>

              {/* Itemized Salary Breakdown Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-y-2 border-slate-900 bg-slate-100 text-slate-800 font-bold uppercase">
                      <th className="py-2.5 px-3">Rubrique</th>
                      <th className="py-2.5 px-3 text-right">Base / Taux</th>
                      <th className="py-2.5 px-3 text-right">Gains (F CFA)</th>
                      <th className="py-2.5 px-3 text-right">Retenues (F CFA)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {/* Base Salary */}
                    <tr>
                      <td className="py-3 px-3 font-semibold text-slate-800">Salaire de base mensuel</td>
                      <td className="py-3 px-3 text-right text-slate-500">100%</td>
                      <td className="py-3 px-3 text-right font-bold text-slate-900">
                        {selectedPayslipForView.baseSalary?.toLocaleString('fr-FR')}
                      </td>
                      <td className="py-3 px-3 text-right text-slate-400">-</td>
                    </tr>

                    {/* Allowances / Primes */}
                    {selectedPayslipForView.allowances > 0 && (
                      <tr>
                        <td className="py-3 px-3 font-semibold text-slate-800">Primes & Indemnités de transport</td>
                        <td className="py-3 px-3 text-right text-slate-500">Forfait</td>
                        <td className="py-3 px-3 text-right font-bold text-emerald-600">
                          +{selectedPayslipForView.allowances?.toLocaleString('fr-FR')}
                        </td>
                        <td className="py-3 px-3 text-right text-slate-400">-</td>
                      </tr>
                    )}

                    {/* Overtime */}
                    {selectedPayslipForView.overtimeHours > 0 && (
                      <tr>
                        <td className="py-3 px-3 font-semibold text-slate-800">
                          Heures supplémentaires ({selectedPayslipForView.overtimeHours}h)
                        </td>
                        <td className="py-3 px-3 text-right text-slate-500">
                          {selectedPayslipForView.overtimeRate?.toLocaleString('fr-FR')} F/h
                        </td>
                        <td className="py-3 px-3 text-right font-bold text-emerald-600">
                          +{(selectedPayslipForView.overtimeHours * selectedPayslipForView.overtimeRate)?.toLocaleString('fr-FR')}
                        </td>
                        <td className="py-3 px-3 text-right text-slate-400">-</td>
                      </tr>
                    )}

                    {/* Deductions */}
                    {selectedPayslipForView.deductions > 0 && (
                      <tr>
                        <td className="py-3 px-3 font-semibold text-slate-800">Cotisations sociales & Impôts (IPRES / IR)</td>
                        <td className="py-3 px-3 text-right text-slate-500">Barème officiel</td>
                        <td className="py-3 px-3 text-right text-slate-400">-</td>
                        <td className="py-3 px-3 text-right font-bold text-rose-600">
                          -{(selectedPayslipForView.deductions)?.toLocaleString('fr-FR')}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Total Banner */}
              <div className="rounded-xl bg-slate-900 p-5 text-white flex items-center justify-between shadow-lg">
                <div>
                  <p className="text-xs uppercase font-semibold text-slate-400 tracking-wider">NET À PAYER</p>
                  <p className="text-2xl font-extrabold tracking-tight mt-0.5">
                    {selectedPayslipForView.netSalary?.toLocaleString('fr-FR')} <span className="text-sm font-bold text-amber-400">F CFA</span>
                  </p>
                </div>
                <div className="text-right">
                  <span className={`inline-block rounded-lg px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                    selectedPayslipForView.status === 'paid' ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-slate-900'
                  }`}>
                    {selectedPayslipForView.status === 'paid' ? 'PAYÉ PAR VIREMENT' : 'EN ATTENTE DE RÈGLEMENT'}
                  </span>
                  {selectedPayslipForView.paymentDate && (
                    <p className="text-[11px] text-slate-400 mt-1">Date: {selectedPayslipForView.paymentDate}</p>
                  )}
                </div>
              </div>

              {/* Legal Footer & Signature */}
              <div className="grid grid-cols-2 gap-8 pt-4 border-t border-slate-200 text-[11px] text-slate-500">
                <div>
                  <p className="font-bold text-slate-700 mb-1">Mentions Légales</p>
                  <p className="leading-relaxed">
                    Pour vous aider à faire valoir vos droits, conservez ce bulletin de paie sans limitation de durée.
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-700 mb-6">Signature de l'Employeur</p>
                  <div className="inline-block border-b-2 border-slate-300 w-36 h-6"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payroll;
