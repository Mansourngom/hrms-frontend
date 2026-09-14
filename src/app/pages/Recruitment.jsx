import React, { useEffect, useState } from 'react';
import recruitmentService from '../services/recruitment.service';
import departmentService from '../services/department.service';
import { useLanguage } from '../contexts/LanguageContext';
import {
  Briefcase, Users, UserCheck, CheckCircle, Plus, Search,
  MapPin, Calendar, Building2, ChevronRight, X, UserPlus,
  FileText, Mail, Phone, ArrowRight, Check, AlertCircle, Trash2
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const Recruitment = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('jobs'); // 'jobs' | 'candidates'

  // Data States
  const [jobs, setJobs] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Job Filters
  const [jobSearch, setJobSearch] = useState('');
  const [jobDeptFilter, setJobDeptFilter] = useState('');

  // Candidate Filters
  const [selectedJobFilter, setSelectedJobFilter] = useState('');

  // Modals State
  const [isCreateJobModalOpen, setIsCreateJobModalOpen] = useState(false);
  const [isCreateCandModalOpen, setIsCreateCandModalOpen] = useState(false);

  // Forms State
  const [jobForm, setJobForm] = useState({
    title: '',
    department: '',
    contractType: 'cdi',
    location: 'Dakar, Sénégal',
    openingsCount: 1,
    description: '',
  });

  const [candForm, setCandForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    recruitment: '',
    notes: '',
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [jobRes, candRes, deptRes] = await Promise.all([
        recruitmentService.getRecruitments(),
        recruitmentService.getCandidates(),
        departmentService.getDepartments(),
      ]);

      setJobs(jobRes.data || []);
      setCandidates(candRes.data || []);
      setDepartments(deptRes.data || []);
    } catch (error) {
      console.error(error);
      toast.error('Erreur lors du chargement des recrutements');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Submit Job Offer
  const handleSaveJob = async (e) => {
    e.preventDefault();
    if (!jobForm.title || !jobForm.department) {
      toast.error('Veuillez remplir les champs obligatoires');
      return;
    }
    try {
      await recruitmentService.createRecruitment(jobForm);
      toast.success('Offre d\'emploi publiée avec succès');
      setIsCreateJobModalOpen(false);
      setJobForm({ title: '', department: '', contractType: 'cdi', location: 'Dakar, Sénégal', openingsCount: 1, description: '' });
      fetchData();
    } catch (error) {
      console.error(error);
      toast.error('Erreur lors de la publication de l\'offre');
    }
  };

  // Submit Candidate Application
  const handleSaveCandidate = async (e) => {
    e.preventDefault();
    if (!candForm.firstName || !candForm.lastName || !candForm.recruitment) {
      toast.error('Veuillez remplir les champs obligatoires');
      return;
    }
    try {
      await recruitmentService.createCandidate(candForm);
      toast.success('Candidature enregistrée');
      setIsCreateCandModalOpen(false);
      setCandForm({ firstName: '', lastName: '', email: '', phone: '', recruitment: '', notes: '' });
      fetchData();
    } catch (error) {
      console.error(error);
      toast.error('Erreur lors de l\'enregistrement de la candidature');
    }
  };

  // Toggle Job Offer Status
  const handleToggleJobStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'published' ? 'closed' : 'published';
    try {
      await recruitmentService.updateRecruitmentStatus(id, newStatus);
      toast.success(`Offre ${newStatus === 'published' ? 'publiée' : 'clôturée'}`);
      fetchData();
    } catch (error) {
      console.error(error);
      toast.error('Erreur lors du changement de statut');
    }
  };

  // Delete Job Offer
  const handleDeleteJob = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette offre ?')) return;
    try {
      await recruitmentService.deleteRecruitment(id);
      toast.success('Offre supprimée');
      fetchData();
    } catch (error) {
      console.error(error);
      toast.error('Erreur lors de la suppression');
    }
  };

  // Advance Candidate Pipeline Stage
  const handleMoveStage = async (candidateId, currentStage) => {
    const stagesOrder = ['nouveau', 'entretien', 'offre', 'recrute'];
    const currentIdx = stagesOrder.indexOf(currentStage);
    if (currentIdx === -1 || currentIdx === stagesOrder.length - 1) return;

    const nextStage = stagesOrder[currentIdx + 1];
    try {
      await recruitmentService.updateCandidateStage(candidateId, nextStage);
      toast.success(`Candidat déplacé vers: ${nextStage}`);
      fetchData();
    } catch (error) {
      console.error(error);
      toast.error('Erreur lors du changement de phase');
    }
  };

  // Convert Hired Candidate to Active Employee
  const handleConvertToEmployee = async (candId) => {
    try {
      const res = await recruitmentService.convertCandidateToEmployee(candId);
      toast.success(res.message || 'Candidat promu en Employé actif !');
      fetchData();
    } catch (error) {
      console.error(error);
      toast.error('Erreur lors de la promotion');
    }
  };

  // Filtered Lists
  const filteredJobs = jobs.filter((j) => {
    const title = j.title.toLowerCase();
    const deptId = typeof j.department === 'object' ? j.department?._id : j.department;
    const matchesSearch = title.includes(jobSearch.toLowerCase());
    const matchesDept = !jobDeptFilter || deptId === jobDeptFilter;
    return matchesSearch && matchesDept;
  });

  const filteredCandidates = candidates.filter((c) => {
    const jobId = typeof c.recruitment === 'object' ? c.recruitment?._id : c.recruitment;
    return !selectedJobFilter || jobId === selectedJobFilter;
  });

  // Calculate Metrics
  const activeJobsCount = jobs.filter(j => j.status === 'published').length;
  const totalCandidatesCount = candidates.length;
  const inInterviewCount = candidates.filter(c => c.stage === 'entretien').length;
  const hiredCount = candidates.filter(c => c.stage === 'recrute').length;

  const pipelineStages = [
    { id: 'nouveau', label: '📥 Nouveaux (Reçus)', color: 'border-blue-500 bg-blue-50/30' },
    { id: 'entretien', label: '📞 Entretiens', color: 'border-amber-500 bg-amber-50/30' },
    { id: 'offre', label: '📄 Offres Transmises', color: 'border-purple-500 bg-purple-50/30' },
    { id: 'recrute', label: '✅ Recrutés', color: 'border-emerald-500 bg-emerald-50/30' },
    { id: 'rejete', label: '❌ Refusés', color: 'border-rose-500 bg-rose-50/30' },
  ];

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Briefcase className="h-7 w-7 text-primary" />
            Recrutement & Candidatures
          </h1>
          <p className="text-sm font-medium text-slate-500">
            Gérez vos offres d'emploi actives et suivez l'avancement du pipeline de candidats
          </p>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-3">
          {activeTab === 'jobs' ? (
            <button
              onClick={() => setIsCreateJobModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover transition-all shadow-sm"
            >
              <Plus className="h-4 w-4" />
              Publier une Offre
            </button>
          ) : (
            <button
              onClick={() => setIsCreateCandModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover transition-all shadow-sm"
            >
              <UserPlus className="h-4 w-4" />
              Ajouter un Candidat
            </button>
          )}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-400">Offres Actives</span>
            <div className="h-9 w-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Briefcase className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold text-slate-900">{activeJobsCount}</p>
          <span className="mt-1 inline-flex items-center text-xs font-semibold text-blue-600">
            Postes ouverts au recrutement
          </span>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-400">Total Candidatures</span>
            <div className="h-9 w-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold text-slate-900">{totalCandidatesCount}</p>
          <span className="mt-1 inline-flex items-center text-xs font-medium text-slate-400">
            Dossiers de candidatures reçus
          </span>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-400">En Entretien</span>
            <div className="h-9 w-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <FileText className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold text-slate-900">{inInterviewCount}</p>
          <span className="mt-1 inline-flex items-center text-xs font-semibold text-amber-600">
            Phase d'évaluation RH & Technique
          </span>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-400">Recrutés ce Mois</span>
            <div className="h-9 w-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold text-slate-900">{hiredCount}</p>
          <span className="mt-1 inline-flex items-center text-xs font-semibold text-emerald-600">
            Candidats retenus avec succès
          </span>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('jobs')}
          className={`flex items-center gap-2 px-6 py-3 text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'jobs'
              ? 'border-primary text-primary'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Briefcase className="h-4 w-4" />
          Offres d'Emploi ({jobs.length})
        </button>
        <button
          onClick={() => setActiveTab('candidates')}
          className={`flex items-center gap-2 px-6 py-3 text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'candidates'
              ? 'border-primary text-primary'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="h-4 w-4" />
          Pipeline des Candidats ({candidates.length})
        </button>
      </div>

      {/* TAB 1: JOB OFFERS */}
      {activeTab === 'jobs' && (
        <div className="space-y-4">
          {/* Toolbar */}
          <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:max-w-xs">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Search className="h-4 w-4" />
              </span>
              <input
                type="text"
                placeholder="Rechercher intitulé du poste..."
                value={jobSearch}
                onChange={(e) => setJobSearch(e.target.value)}
                className="w-full rounded-xl border border-slate-200 py-2 pl-9 pr-4 text-xs outline-none transition-all focus:border-primary"
              />
            </div>

            <select
              value={jobDeptFilter}
              onChange={(e) => setJobDeptFilter(e.target.value)}
              className="rounded-xl border border-slate-200 py-2 px-3 text-xs outline-none bg-white text-slate-700 focus:border-primary"
            >
              <option value="">Tous les départements</option>
              {departments.map((d) => (
                <option key={d._id} value={d._id}>{d.name}</option>
              ))}
            </select>
          </div>

          {/* Cards Grid */}
          {loading ? (
            <div className="flex h-48 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="py-12 text-center bg-white rounded-2xl border border-slate-100">
              <Briefcase className="h-10 w-10 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800">Aucune offre d'emploi</h3>
              <p className="text-xs text-slate-400 mt-1">Publiez une nouvelle offre pour commencer le recrutement.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredJobs.map((j) => {
                const dept = j.department || {};
                return (
                  <div key={j._id} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-bold text-slate-900 text-base leading-snug">{j.title}</h3>
                        <span className={`shrink-0 rounded-lg px-2.5 py-0.5 text-xs font-semibold ${
                          j.status === 'published' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {j.status === 'published' ? 'Publiée' : 'Clôturée'}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium pt-1">
                        <span className="flex items-center gap-1">
                          <Building2 className="h-3.5 w-3.5 text-slate-400" />
                          {dept.name || 'Général'}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 text-slate-400" />
                          {j.location}
                        </span>
                        <span className="uppercase text-[11px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                          {j.contractType}
                        </span>
                      </div>

                      <p className="text-xs text-slate-500 line-clamp-2 pt-2 border-t border-slate-50">
                        {j.description || 'Aucune description disponible.'}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1 font-semibold text-slate-700">
                        <Users className="h-4 w-4 text-purple-600" />
                        <span>{j.applicantCount} candidature(s)</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleJobStatus(j._id, j.status)}
                          className="rounded-lg border border-slate-200 px-2.5 py-1 text-slate-600 hover:bg-slate-50 font-medium"
                        >
                          {j.status === 'published' ? 'Clôturer' : 'Publier'}
                        </button>
                        <button
                          onClick={() => handleDeleteJob(j._id)}
                          className="rounded-lg border border-slate-200 p-1 text-slate-400 hover:border-rose-200 hover:text-rose-600"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: CANDIDATE KANBAN PIPELINE */}
      {activeTab === 'candidates' && (
        <div className="space-y-4">
          {/* Toolbar */}
          <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-600">Filtrer par Offre:</span>
            </div>
            <select
              value={selectedJobFilter}
              onChange={(e) => setSelectedJobFilter(e.target.value)}
              className="rounded-xl border border-slate-200 py-1.5 px-3 text-xs outline-none bg-white text-slate-700 focus:border-primary max-w-xs"
            >
              <option value="">Toutes les offres</option>
              {jobs.map((j) => (
                <option key={j._id} value={j._id}>{j.title}</option>
              ))}
            </select>
          </div>

          {/* Kanban Board Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {pipelineStages.map((stage) => {
              const stageCandidates = filteredCandidates.filter(c => c.stage === stage.id);
              return (
                <div key={stage.id} className="rounded-2xl border border-slate-200 bg-slate-50/50 p-3 flex flex-col min-h-[500px]">
                  <div className={`border-b-2 ${stage.color} pb-2.5 mb-3 px-1 flex items-center justify-between`}>
                    <h4 className="font-bold text-slate-800 text-xs">{stage.label}</h4>
                    <span className="rounded-full bg-slate-200 text-slate-700 px-2 py-0.5 text-[11px] font-bold">
                      {stageCandidates.length}
                    </span>
                  </div>

                  <div className="space-y-3 flex-1 overflow-y-auto">
                    {stageCandidates.length === 0 ? (
                      <div className="text-center py-8 text-slate-400 text-xs italic">
                        Aucun candidat
                      </div>
                    ) : (
                      stageCandidates.map((cand) => {
                        const job = cand.recruitment || {};
                        return (
                          <div key={cand._id} className="rounded-xl border border-slate-100 bg-white p-3.5 shadow-sm space-y-2 hover:shadow transition-all">
                            <div className="flex items-center gap-2.5">
                              <div className="h-8 w-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-xs shrink-0">
                                {cand.firstName?.[0]}{cand.lastName?.[0]}
                              </div>
                              <div className="overflow-hidden">
                                <p className="font-bold text-slate-900 text-xs leading-tight truncate">
                                  {cand.firstName} {cand.lastName}
                                </p>
                                <p className="text-[10px] text-slate-400 truncate">{job.title || 'Candidat'}</p>
                              </div>
                            </div>

                            <div className="space-y-1 text-[11px] text-slate-500 pt-1 border-t border-slate-50">
                              <p className="flex items-center gap-1 truncate">
                                <Mail className="h-3 w-3 text-slate-400 shrink-0" />
                                {cand.email}
                              </p>
                              {cand.phone && (
                                <p className="flex items-center gap-1">
                                  <Phone className="h-3 w-3 text-slate-400 shrink-0" />
                                  {cand.phone}
                                </p>
                              )}
                            </div>

                            {/* Stage Move Controls */}
                            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                              {cand.stage !== 'recrute' && cand.stage !== 'rejete' ? (
                                <button
                                  onClick={() => handleMoveStage(cand._id, cand.stage)}
                                  className="w-full inline-flex items-center justify-center gap-1 rounded-lg bg-slate-900 text-white py-1 px-2 text-[10px] font-semibold hover:bg-slate-800 transition-all"
                                >
                                  Étape Suivante <ArrowRight className="h-3 w-3" />
                                </button>
                              ) : cand.stage === 'recrute' ? (
                                <button
                                  onClick={() => handleConvertToEmployee(cand._id)}
                                  className="w-full inline-flex items-center justify-center gap-1 rounded-lg bg-emerald-600 text-white py-1 px-2 text-[10px] font-semibold hover:bg-emerald-700 transition-all shadow-xs"
                                >
                                  <UserPlus className="h-3 w-3" /> Promouvoir en Employé
                                </button>
                              ) : (
                                <span className="text-[10px] font-semibold text-rose-500 italic">Candidature rejetée</span>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modal: Publish Job Offer */}
      {isCreateJobModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <h3 className="text-lg font-bold text-slate-900">Publier une Offre d'Emploi</h3>
              <button
                onClick={() => setIsCreateJobModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveJob} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Intitulé du Poste *</label>
                <input
                  type="text"
                  placeholder="ex: Développeur React / Chef de Projet"
                  value={jobForm.title}
                  onChange={(e) => setJobForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Département *</label>
                <select
                  value={jobForm.department}
                  onChange={(e) => setJobForm(prev => ({ ...prev, department: e.target.value }))}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-primary"
                  required
                >
                  <option value="">Sélectionner un département</option>
                  {departments.map((d) => (
                    <option key={d._id} value={d._id}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Type de Contrat</label>
                  <select
                    value={jobForm.contractType}
                    onChange={(e) => setJobForm(prev => ({ ...prev, contractType: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-primary"
                  >
                    <option value="cdi">CDI</option>
                    <option value="cdd">CDD</option>
                    <option value="stage">Stage</option>
                    <option value="freelance">Freelance</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Nombre de Postes</label>
                  <input
                    type="number"
                    min="1"
                    value={jobForm.openingsCount}
                    onChange={(e) => setJobForm(prev => ({ ...prev, openingsCount: Number(e.target.value) }))}
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Lieu</label>
                <input
                  type="text"
                  value={jobForm.location}
                  onChange={(e) => setJobForm(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description de la Mission</label>
                <textarea
                  rows={3}
                  value={jobForm.description}
                  onChange={(e) => setJobForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Détails du rôle, compétences recherchées..."
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-primary"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateJobModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white hover:bg-primary-hover"
                >
                  Publier l'Offre
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Submit Candidate Application */}
      {isCreateCandModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <h3 className="text-lg font-bold text-slate-900">Ajouter un Candidat</h3>
              <button
                onClick={() => setIsCreateCandModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCandidate} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Prénom *</label>
                  <input
                    type="text"
                    value={candForm.firstName}
                    onChange={(e) => setCandForm(prev => ({ ...prev, firstName: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Nom *</label>
                  <input
                    type="text"
                    value={candForm.lastName}
                    onChange={(e) => setCandForm(prev => ({ ...prev, lastName: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-primary"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email *</label>
                <input
                  type="email"
                  value={candForm.email}
                  onChange={(e) => setCandForm(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Téléphone</label>
                <input
                  type="text"
                  value={candForm.phone}
                  onChange={(e) => setCandForm(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Offre d'Emploi Visée *</label>
                <select
                  value={candForm.recruitment}
                  onChange={(e) => setCandForm(prev => ({ ...prev, recruitment: e.target.value }))}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-primary"
                  required
                >
                  <option value="">Sélectionner une offre</option>
                  {jobs.map((j) => (
                    <option key={j._id} value={j._id}>{j.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Notes / Impressions RH</label>
                <textarea
                  rows={2}
                  value={candForm.notes}
                  onChange={(e) => setCandForm(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Remarques lors de la réception..."
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-primary"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateCandModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white hover:bg-primary-hover"
                >
                  Enregistrer Candidature
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Recruitment;
