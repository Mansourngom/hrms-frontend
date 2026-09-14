import React, { useEffect, useState } from 'react';
import trainingService from '../services/training.service';
import employeeService from '../services/employee.service';
import { useLanguage } from '../contexts/LanguageContext';
import {
  GraduationCap, Award, BookOpen, Clock, Plus, Search,
  Filter, CheckCircle, User, Calendar, DollarSign, X,
  Building2, ChevronRight, UserPlus, Check, Sparkles, AlertCircle
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const Training = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('catalog'); // 'catalog' | 'enrollments'

  // Data States
  const [trainings, setTrainings] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  // Modals
  const [isCreateCourseModalOpen, setIsCreateCourseModalOpen] = useState(false);
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);

  // Form States
  const [courseForm, setCourseForm] = useState({
    title: '',
    category: 'Technique',
    provider: 'TechAcademy Dakar',
    durationHours: 20,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 86400000 * 15).toISOString().split('T')[0],
    budget: 500000,
    status: 'active',
    description: '',
  });

  const [enrollForm, setEnrollForm] = useState({
    employee: '',
    training: '',
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [trainRes, enrRes, empRes] = await Promise.all([
        trainingService.getTrainings(),
        trainingService.getEnrollments(),
        employeeService.getEmployees(),
      ]);

      setTrainings(trainRes.data || []);
      setEnrollments(enrRes.data || []);
      setEmployees(empRes.data || []);
    } catch (error) {
      console.error(error);
      toast.error('Erreur lors du chargement des formations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Save Course
  const handleSaveCourse = async (e) => {
    e.preventDefault();
    if (!courseForm.title) {
      toast.error('Veuillez renseigner l\'intitulé de la formation');
      return;
    }
    try {
      await trainingService.createTraining(courseForm);
      toast.success('Formation ajoutée au catalogue');
      setIsCreateCourseModalOpen(false);
      setCourseForm({ title: '', category: 'Technique', provider: 'TechAcademy Dakar', durationHours: 20, startDate: new Date().toISOString().split('T')[0], endDate: new Date(Date.now() + 86400000 * 15).toISOString().split('T')[0], budget: 500000, status: 'active', description: '' });
      fetchData();
    } catch (error) {
      console.error(error);
      toast.error('Erreur lors de la création de la formation');
    }
  };

  // Save Enrollment
  const handleSaveEnrollment = async (e) => {
    e.preventDefault();
    if (!enrollForm.employee || !enrollForm.training) {
      toast.error('Veuillez sélectionner un collaborateur et une formation');
      return;
    }
    try {
      await trainingService.enrollEmployee(enrollForm);
      toast.success('Collaborateur inscrit avec succès');
      setIsEnrollModalOpen(false);
      setEnrollForm({ employee: '', training: '' });
      fetchData();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Erreur lors de l\'inscription');
    }
  };

  // Update Progress / Complete
  const handleUpdateProgress = async (enrollmentId, currentPercent) => {
    const nextPercent = currentPercent >= 100 ? 100 : currentPercent + 25;
    try {
      const res = await trainingService.updateProgress(enrollmentId, nextPercent);
      toast.success(res.message || 'Progression mise à jour');
      fetchData();
    } catch (error) {
      console.error(error);
      toast.error('Erreur lors de la mise à jour');
    }
  };

  // Filtered List
  const filteredTrainings = trainings.filter((t) => {
    const title = t.title.toLowerCase();
    const matchesSearch = title.includes(search.toLowerCase());
    const matchesCat = !categoryFilter || t.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  // Calculate Metrics
  const activeTrainingsCount = trainings.filter(t => t.status === 'active').length;
  const totalEnrollmentsCount = enrollments.length;
  const totalBudgetSum = trainings.reduce((sum, t) => sum + (t.budget || 0), 0);
  
  const avgCompletionRate = enrollments.length > 0
    ? Math.round(enrollments.reduce((sum, e) => sum + (e.progressPercent || 0), 0) / enrollments.length)
    : 85;

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <GraduationCap className="h-7 w-7 text-primary" />
            Learning & Development
          </h1>
          <p className="text-sm font-medium text-slate-500">
            Gérez les programmes de formation, les inscriptions et le suivi des compétences
          </p>
        </div>

        <div className="flex items-center gap-3">
          {activeTab === 'catalog' ? (
            <button
              onClick={() => setIsCreateCourseModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover transition-all shadow-sm"
            >
              <Plus className="h-4 w-4" />
              Créer une Formation
            </button>
          ) : (
            <button
              onClick={() => setIsEnrollModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover transition-all shadow-sm"
            >
              <UserPlus className="h-4 w-4" />
              Inscrire un Collaborateur
            </button>
          )}
        </div>
      </div>

      {/* KPI Cards Grid (Matching Mockup 5) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-400">Formations Actives</span>
            <div className="h-9 w-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <BookOpen className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold text-slate-900">{activeTrainingsCount}</p>
          <span className="mt-1 inline-flex items-center text-xs font-semibold text-blue-600">
            Programmes en cours de réalisation
          </span>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-400">Participants Inscrits</span>
            <div className="h-9 w-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <GraduationCap className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold text-slate-900">{totalEnrollmentsCount}</p>
          <span className="mt-1 inline-flex items-center text-xs font-medium text-slate-400">
            Collaborateurs engagés
          </span>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-400">Taux de Complétion</span>
            <div className="h-9 w-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Award className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold text-slate-900">{avgCompletionRate}%</p>
          <span className="mt-1 inline-flex items-center text-xs font-semibold text-emerald-600">
            Moyenne de réussite aux modules
          </span>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-400">Budget Investi</span>
            <div className="h-9 w-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold text-slate-900">
            {totalBudgetSum.toLocaleString('fr-FR')} <span className="text-xs font-semibold text-slate-500">F CFA</span>
          </p>
          <span className="mt-1 inline-flex items-center text-xs font-medium text-slate-400">
            Investissement annuel formation
          </span>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('catalog')}
          className={`flex items-center gap-2 px-6 py-3 text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'catalog'
              ? 'border-primary text-primary'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <BookOpen className="h-4 w-4" />
          Catalogue des Formations ({trainings.length})
        </button>
        <button
          onClick={() => setActiveTab('enrollments')}
          className={`flex items-center gap-2 px-6 py-3 text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'enrollments'
              ? 'border-primary text-primary'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Award className="h-4 w-4" />
          Suivi des Inscriptions & Certifications ({enrollments.length})
        </button>
      </div>

      {/* TAB 1: COURSE CATALOG */}
      {activeTab === 'catalog' && (
        <div className="space-y-4">
          {/* Toolbar */}
          <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:max-w-xs">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Search className="h-4 w-4" />
              </span>
              <input
                type="text"
                placeholder="Rechercher une formation..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-slate-200 py-2 pl-9 pr-4 text-xs outline-none transition-all focus:border-primary"
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="rounded-xl border border-slate-200 py-2 px-3 text-xs outline-none bg-white text-slate-700 focus:border-primary"
            >
              <option value="">Toutes les catégories</option>
              <option value="Technique">Technique</option>
              <option value="Management">Management</option>
              <option value="Marketing">Marketing</option>
              <option value="Soft Skills">Soft Skills</option>
            </select>
          </div>

          {/* Cards Grid */}
          {loading ? (
            <div className="flex h-48 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
          ) : filteredTrainings.length === 0 ? (
            <div className="py-12 text-center bg-white rounded-2xl border border-slate-100">
              <BookOpen className="h-10 w-10 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800">Aucune formation trouvée</h3>
              <p className="text-xs text-slate-400 mt-1">Créez une nouvelle formation pour enrichir votre catalogue.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredTrainings.map((t) => (
                <div key={t._id} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <span className="rounded-md bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary uppercase">
                        {t.category}
                      </span>
                      <span className={`rounded-lg px-2 py-0.5 text-[11px] font-semibold ${
                        t.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                      }`}>
                        {t.status === 'active' ? 'En cours' : 'À venir'}
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-base leading-snug pt-1">{t.title}</h3>
                    <p className="text-xs text-slate-500 line-clamp-2">{t.description}</p>

                    <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-50">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-3.5 w-3.5 text-slate-400" />
                        <span>Organisme: <strong>{t.provider}</strong></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-3.5 w-3.5 text-slate-400" />
                        <span>Durée: <strong>{t.durationHours} heures</strong></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                        <span>Du {new Date(t.startDate).toLocaleDateString('fr-FR')} au {new Date(t.endDate).toLocaleDateString('fr-FR')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-400">Budget</p>
                      <p className="font-bold text-slate-900 text-sm">
                        {t.budget?.toLocaleString('fr-FR')} F CFA
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setEnrollForm({ employee: '', training: t._id });
                        setIsEnrollModalOpen(true);
                      }}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 transition-all"
                    >
                      <UserPlus className="h-3.5 w-3.5" />
                      Inscrire
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: ENROLLMENTS & CERTIFICATIONS */}
      {activeTab === 'enrollments' && (
        <div className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex h-48 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
          ) : enrollments.length === 0 ? (
            <div className="py-12 text-center">
              <Award className="h-10 w-10 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800">Aucune inscription enregistrée</h3>
              <p className="text-xs text-slate-400 mt-1">Inscrivez des collaborateurs à une formation pour suivre leur progression.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-xs font-bold uppercase tracking-wider text-slate-400 bg-slate-50/50">
                    <th className="py-3.5 px-4">Collaborateur</th>
                    <th className="py-3.5 px-4">Formation</th>
                    <th className="py-3.5 px-4">Date Inscription</th>
                    <th className="py-3.5 px-4">Progression</th>
                    <th className="py-3.5 px-4">Attestation</th>
                    <th className="py-3.5 px-4">Statut</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {enrollments.map((e) => {
                    const emp = e.employee || {};
                    const train = e.training || {};
                    return (
                      <tr key={e._id} className="hover:bg-slate-50/60 transition-colors">
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
                        <td className="py-4 px-4">
                          <p className="font-bold text-slate-900 text-xs">{train.title}</p>
                          <span className="text-[10px] text-primary font-semibold uppercase">{train.category}</span>
                        </td>
                        <td className="py-4 px-4 text-xs font-medium text-slate-500">
                          {e.enrolledAt}
                        </td>
                        <td className="py-4 px-4 min-w-[160px]">
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs font-semibold text-slate-700">
                              <span>Avancement</span>
                              <span>{e.progressPercent}%</span>
                            </div>
                            <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                              <div
                                className={`h-full transition-all duration-300 ${
                                  e.progressPercent === 100 ? 'bg-emerald-500' : 'bg-primary'
                                }`}
                                style={{ width: `${e.progressPercent}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          {e.certificateIssued ? (
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                              <Award className="h-3.5 w-3.5" /> Certificate Issued
                            </span>
                          ) : (
                            <span className="text-xs text-slate-400 italic">En cours...</span>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-semibold ${
                            e.status === 'completed' ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'
                          }`}>
                            {e.status === 'completed' ? 'Terminé' : 'En cours'}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          {e.progressPercent < 100 && (
                            <button
                              onClick={() => handleUpdateProgress(e._id, e.progressPercent)}
                              className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:border-primary hover:text-primary transition-all"
                            >
                              + Avancer Progression
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

      {/* Modal: Create Training Course */}
      {isCreateCourseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <h3 className="text-lg font-bold text-slate-900">Créer une Formation</h3>
              <button
                onClick={() => setIsCreateCourseModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCourse} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Intitulé de la Formation *</label>
                <input
                  type="text"
                  placeholder="ex: Leadership, Kubernetes, Marketing..."
                  value={courseForm.title}
                  onChange={(e) => setCourseForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-primary"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Catégorie</label>
                  <select
                    value={courseForm.category}
                    onChange={(e) => setCourseForm(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-primary"
                  >
                    <option value="Technique">Technique</option>
                    <option value="Management">Management</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Soft Skills">Soft Skills</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Durée (Heures)</label>
                  <input
                    type="number"
                    value={courseForm.durationHours}
                    onChange={(e) => setCourseForm(prev => ({ ...prev, durationHours: Number(e.target.value) }))}
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Organisme / Formateur</label>
                  <input
                    type="text"
                    value={courseForm.provider}
                    onChange={(e) => setCourseForm(prev => ({ ...prev, provider: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Budget (F CFA)</label>
                  <input
                    type="number"
                    value={courseForm.budget}
                    onChange={(e) => setCourseForm(prev => ({ ...prev, budget: Number(e.target.value) }))}
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Date de début</label>
                  <input
                    type="date"
                    value={courseForm.startDate}
                    onChange={(e) => setCourseForm(prev => ({ ...prev, startDate: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Date de fin</label>
                  <input
                    type="date"
                    value={courseForm.endDate}
                    onChange={(e) => setCourseForm(prev => ({ ...prev, endDate: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description / Objectifs</label>
                <textarea
                  rows={2}
                  value={courseForm.description}
                  onChange={(e) => setCourseForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-primary"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateCourseModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white hover:bg-primary-hover"
                >
                  Enregistrer Formation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Enroll Employee */}
      {isEnrollModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <h3 className="text-lg font-bold text-slate-900">Inscrire un Collaborateur</h3>
              <button
                onClick={() => setIsEnrollModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEnrollment} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Collaborateur *</label>
                <select
                  value={enrollForm.employee}
                  onChange={(e) => setEnrollForm(prev => ({ ...prev, employee: e.target.value }))}
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

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Formation *</label>
                <select
                  value={enrollForm.training}
                  onChange={(e) => setEnrollForm(prev => ({ ...prev, training: e.target.value }))}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-primary"
                  required
                >
                  <option value="">Sélectionner une formation</option>
                  {trainings.map((t) => (
                    <option key={t._id} value={t._id}>{t.title} ({t.category})</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEnrollModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white hover:bg-primary-hover"
                >
                  Valider l'Inscription
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Training;
