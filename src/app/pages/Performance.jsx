import React, { useEffect, useState } from 'react';
import performanceService from '../services/performance.service';
import employeeService from '../services/employee.service';
import { useLanguage } from '../contexts/LanguageContext';
import {
  TrendingUp, Award, Target, Star, Plus, Search,
  Filter, CheckCircle, User, Calendar, X, Sparkles,
  MessageSquare, ChevronRight, Check, AlertCircle, Trash2
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const Performance = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('reviews'); // 'reviews' | 'goals'

  // Data States
  const [reviews, setReviews] = useState([]);
  const [goals, setGoals] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [periodFilter, setPeriodFilter] = useState('');

  // Modals
  const [isCreateReviewModalOpen, setIsCreateReviewModalOpen] = useState(false);
  const [isCreateGoalModalOpen, setIsCreateGoalModalOpen] = useState(false);

  // Forms State
  const [reviewForm, setReviewForm] = useState({
    employee: '',
    evaluator: 'Admin NexusHR',
    period: 'Annuel 2026',
    rating: 4.5,
    feedback: '',
  });

  const [goalForm, setGoalForm] = useState({
    employee: '',
    title: '',
    period: 'T3 2026',
    dueDate: new Date(Date.now() + 86400000 * 30).toISOString().split('T')[0],
    weight: 30,
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [revRes, goalRes, empRes] = await Promise.all([
        performanceService.getReviews(),
        performanceService.getGoals(),
        employeeService.getEmployees(),
      ]);

      setReviews(revRes.data || []);
      setGoals(goalRes.data || []);
      setEmployees(empRes.data || []);
    } catch (error) {
      console.error(error);
      toast.error('Erreur lors du chargement des performances');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Save Performance Review
  const handleSaveReview = async (e) => {
    e.preventDefault();
    if (!reviewForm.employee) {
      toast.error('Veuillez sélectionner un collaborateur');
      return;
    }
    try {
      await performanceService.createReview(reviewForm);
      toast.success('Évaluation de performance enregistrée');
      setIsCreateReviewModalOpen(false);
      setReviewForm({ employee: '', evaluator: 'Admin NexusHR', period: 'Annuel 2026', rating: 4.5, feedback: '' });
      fetchData();
    } catch (error) {
      console.error(error);
      toast.error('Erreur lors de la sauvegarde de l\'évaluation');
    }
  };

  // Save Goal / OKR
  const handleSaveGoal = async (e) => {
    e.preventDefault();
    if (!goalForm.employee || !goalForm.title) {
      toast.error('Veuillez renseigner les champs obligatoires');
      return;
    }
    try {
      await performanceService.createGoal(goalForm);
      toast.success('Objectif assigné au collaborateur');
      setIsCreateGoalModalOpen(false);
      setGoalForm({ employee: '', title: '', period: 'T3 2026', dueDate: new Date(Date.now() + 86400000 * 30).toISOString().split('T')[0], weight: 30 });
      fetchData();
    } catch (error) {
      console.error(error);
      toast.error('Erreur lors de l\'assignation de l\'objectif');
    }
  };

  // Delete Review
  const handleDeleteReview = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette évaluation ?')) return;
    try {
      await performanceService.deleteReview(id);
      toast.success('Évaluation supprimée');
      fetchData();
    } catch (error) {
      console.error(error);
      toast.error('Erreur lors de la suppression');
    }
  };

  // Update Goal Progress
  const handleUpdateGoalProgress = async (goalId, currentPercent) => {
    const nextPercent = currentPercent >= 100 ? 100 : currentPercent + 25;
    try {
      const res = await performanceService.updateGoalProgress(goalId, nextPercent);
      toast.success(res.message || 'Progression de l\'objectif mise à jour');
      fetchData();
    } catch (error) {
      console.error(error);
      toast.error('Erreur lors de la mise à jour');
    }
  };

  // Filtered List
  const filteredReviews = reviews.filter((r) => {
    const emp = r.employee || {};
    const name = `${emp.firstName || ''} ${emp.lastName || ''}`.toLowerCase();
    const matchesSearch = name.includes(search.toLowerCase());
    const matchesPeriod = !periodFilter || r.period === periodFilter;
    return matchesSearch && matchesPeriod;
  });

  // Calculate Metrics
  const totalReviewsCount = reviews.length;
  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length).toFixed(1)
    : '4.3';

  const achievedGoalsCount = goals.filter(g => g.status === 'achieved').length;
  const goalAchievedPercent = goals.length > 0 ? Math.round((achievedGoalsCount / goals.length) * 100) : 75;

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <TrendingUp className="h-7 w-7 text-primary" />
            Gestion des Performances & Évaluations
          </h1>
          <p className="text-sm font-medium text-slate-500">
            Suivez les objectifs de performance (OKRs), les évaluations annuelles et le développement des collaborateurs
          </p>
        </div>

        <div className="flex items-center gap-3">
          {activeTab === 'reviews' ? (
            <button
              onClick={() => setIsCreateReviewModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover transition-all shadow-sm"
            >
              <Plus className="h-4 w-4" />
              Planifier une Évaluation
            </button>
          ) : (
            <button
              onClick={() => setIsCreateGoalModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover transition-all shadow-sm"
            >
              <Plus className="h-4 w-4" />
              Ajouter un Objectif
            </button>
          )}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-400">Score Moyen Global</span>
            <div className="h-9 w-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Star className="h-5 w-5 fill-amber-400" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold text-slate-900">{avgRating} <span className="text-xs font-semibold text-slate-400">/ 5.0</span></p>
          <span className="mt-1 inline-flex items-center text-xs font-semibold text-amber-600">
            Moyenne des évaluations RH
          </span>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-400">Objectifs Atteints</span>
            <div className="h-9 w-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Target className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold text-slate-900">{goalAchievedPercent}%</p>
          <span className="mt-1 inline-flex items-center text-xs font-semibold text-emerald-600">
            {achievedGoalsCount} objectifs finalisés
          </span>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-400">Évaluations Réalisées</span>
            <div className="h-9 w-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Award className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold text-slate-900">{totalReviewsCount}</p>
          <span className="mt-1 inline-flex items-center text-xs font-medium text-slate-400">
            Entretiens clôturés ce trimestre
          </span>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-400">Objectifs Actifs</span>
            <div className="h-9 w-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold text-slate-900">{goals.length}</p>
          <span className="mt-1 inline-flex items-center text-xs font-medium text-slate-400">
            OKRs suivis dans le système
          </span>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('reviews')}
          className={`flex items-center gap-2 px-6 py-3 text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'reviews'
              ? 'border-primary text-primary'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Award className="h-4 w-4" />
          Évaluations & Entretiens ({reviews.length})
        </button>
        <button
          onClick={() => setActiveTab('goals')}
          className={`flex items-center gap-2 px-6 py-3 text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'goals'
              ? 'border-primary text-primary'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Target className="h-4 w-4" />
          Objectifs & KPIs / OKRs ({goals.length})
        </button>
      </div>

      {/* TAB 1: REVIEWS & EVALUATIONS */}
      {activeTab === 'reviews' && (
        <div className="space-y-4">
          {/* Toolbar */}
          <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:max-w-xs">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Search className="h-4 w-4" />
              </span>
              <input
                type="text"
                placeholder="Rechercher par nom..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-slate-200 py-2 pl-9 pr-4 text-xs outline-none transition-all focus:border-primary"
              />
            </div>

            <select
              value={periodFilter}
              onChange={(e) => setPeriodFilter(e.target.value)}
              className="rounded-xl border border-slate-200 py-2 px-3 text-xs outline-none bg-white text-slate-700 focus:border-primary"
            >
              <option value="">Toutes les périodes</option>
              <option value="Annuel 2026">Annuel 2026</option>
              <option value="Semestriel T2 2026">Semestriel T2 2026</option>
              <option value="Semestriel T1 2026">Semestriel T1 2026</option>
            </select>
          </div>

          {/* Cards Grid */}
          {loading ? (
            <div className="flex h-48 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
          ) : filteredReviews.length === 0 ? (
            <div className="py-12 text-center bg-white rounded-2xl border border-slate-100">
              <Award className="h-10 w-10 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800">Aucune évaluation trouvée</h3>
              <p className="text-xs text-slate-400 mt-1">Planifiez une évaluation pour enregistrer les entretiens individuels.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredReviews.map((r) => {
                const emp = r.employee || {};
                return (
                  <div key={r._id} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="rounded-md bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
                          {r.period}
                        </span>
                        <div className="flex items-center gap-1 text-amber-500 font-bold text-sm">
                          <Star className="h-4 w-4 fill-amber-400" />
                          <span>{r.rating?.toFixed(1)}</span>
                          <span className="text-slate-400 text-xs font-normal">/ 5</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 pt-1">
                        <div className="h-10 w-10 shrink-0 rounded-full bg-slate-100 overflow-hidden border border-slate-100 flex items-center justify-center">
                          {emp.photo?.url ? (
                            <img src={emp.photo.url} alt="" className="h-full w-full object-cover" />
                          ) : (
                            <User className="h-5 w-5 text-slate-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm leading-tight">
                            {emp.firstName} {emp.lastName}
                          </p>
                          <p className="text-xs text-slate-400">{emp.position?.title || 'Collaborateur'}</p>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl italic leading-relaxed">
                        "{r.feedback || 'Évaluation globale positive.'}"
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                      <span>Évaluateur: <strong className="text-slate-700">{r.evaluator}</strong></span>
                      <button
                        onClick={() => handleDeleteReview(r._id)}
                        className="rounded-lg p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                        title="Supprimer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: GOALS & OKRs */}
      {activeTab === 'goals' && (
        <div className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex h-48 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
          ) : goals.length === 0 ? (
            <div className="py-12 text-center">
              <Target className="h-10 w-10 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800">Aucun objectif enregistré</h3>
              <p className="text-xs text-slate-400 mt-1">Assignez des OKRs pour suivre les performances d'équipe.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-xs font-bold uppercase tracking-wider text-slate-400 bg-slate-50/50">
                    <th className="py-3.5 px-4">Collaborateur</th>
                    <th className="py-3.5 px-4">Intitulé de l'Objectif (OKR)</th>
                    <th className="py-3.5 px-4">Période</th>
                    <th className="py-3.5 px-4">Échéance</th>
                    <th className="py-3.5 px-4">Progression</th>
                    <th className="py-3.5 px-4">Statut</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {goals.map((g) => {
                    const emp = g.employee || {};
                    return (
                      <tr key={g._id} className="hover:bg-slate-50/60 transition-colors">
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
                              <p className="text-xs text-slate-400">{emp.department?.name || 'Département'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 font-bold text-slate-900 text-xs max-w-xs">
                          {g.title}
                        </td>
                        <td className="py-4 px-4 text-xs font-semibold text-primary">
                          {g.period}
                        </td>
                        <td className="py-4 px-4 text-xs text-slate-500">
                          {new Date(g.dueDate).toLocaleDateString('fr-FR')}
                        </td>
                        <td className="py-4 px-4 min-w-[160px]">
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs font-semibold text-slate-700">
                              <span>Réalisation</span>
                              <span>{g.progressPercent}%</span>
                            </div>
                            <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                              <div
                                className={`h-full transition-all duration-300 ${
                                  g.progressPercent === 100 ? 'bg-emerald-500' : 'bg-primary'
                                }`}
                                style={{ width: `${g.progressPercent}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-semibold ${
                            g.status === 'achieved' ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'
                          }`}>
                            {g.status === 'achieved' ? 'Atteint' : 'En cours'}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          {g.progressPercent < 100 && (
                            <button
                              onClick={() => handleUpdateGoalProgress(g._id, g.progressPercent)}
                              className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:border-primary hover:text-primary transition-all"
                            >
                              + Avancer
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Modal: Schedule Review */}
      {isCreateReviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <h3 className="text-lg font-bold text-slate-900">Planifier une Évaluation</h3>
              <button
                onClick={() => setIsCreateReviewModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveReview} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Collaborateur *</label>
                <select
                  value={reviewForm.employee}
                  onChange={(e) => setReviewForm(prev => ({ ...prev, employee: e.target.value }))}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-primary"
                  required
                >
                  <option value="">Sélectionner un collaborateur</option>
                  {employees.map((e) => (
                    <option key={e._id} value={e._id}>{e.firstName} {e.lastName} ({e.employeeCode})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Période</label>
                  <select
                    value={reviewForm.period}
                    onChange={(e) => setReviewForm(prev => ({ ...prev, period: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-primary"
                  >
                    <option value="Annuel 2026">Annuel 2026</option>
                    <option value="Semestriel T2 2026">Semestriel T2 2026</option>
                    <option value="Semestriel T1 2026">Semestriel T1 2026</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Note Globale (/5)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={reviewForm.rating}
                    onChange={(e) => setReviewForm(prev => ({ ...prev, rating: Number(e.target.value) }))}
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-primary"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Évaluateur</label>
                <input
                  type="text"
                  value={reviewForm.evaluator}
                  onChange={(e) => setReviewForm(prev => ({ ...prev, evaluator: e.target.value }))}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Remarques & Feedback RH</label>
                <textarea
                  rows={3}
                  value={reviewForm.feedback}
                  onChange={(e) => setReviewForm(prev => ({ ...prev, feedback: e.target.value }))}
                  placeholder="Points forts, axes d'amélioration..."
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-primary"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateReviewModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white hover:bg-primary-hover"
                >
                  Enregistrer l'Évaluation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Create Goal */}
      {isCreateGoalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <h3 className="text-lg font-bold text-slate-900">Ajouter un Objectif (OKR)</h3>
              <button
                onClick={() => setIsCreateGoalModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveGoal} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Collaborateur *</label>
                <select
                  value={goalForm.employee}
                  onChange={(e) => setGoalForm(prev => ({ ...prev, employee: e.target.value }))}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-primary"
                  required
                >
                  <option value="">Sélectionner un collaborateur</option>
                  {employees.map((e) => (
                    <option key={e._id} value={e._id}>{e.firstName} {e.lastName} ({e.employeeCode})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Intitulé de l'Objectif *</label>
                <input
                  type="text"
                  placeholder="ex: Augmenter les ventes de 15%..."
                  value={goalForm.title}
                  onChange={(e) => setGoalForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-primary"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Période</label>
                  <select
                    value={goalForm.period}
                    onChange={(e) => setGoalForm(prev => ({ ...prev, period: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-primary"
                  >
                    <option value="T3 2026">T3 2026</option>
                    <option value="T4 2026">T4 2026</option>
                    <option value="Annuel 2026">Annuel 2026</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Date d'échéance</label>
                  <input
                    type="date"
                    value={goalForm.dueDate}
                    onChange={(e) => setGoalForm(prev => ({ ...prev, dueDate: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateGoalModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white hover:bg-primary-hover"
                >
                  Assigner l'Objectif
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Performance;
