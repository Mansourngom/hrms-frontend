import React, { useEffect, useState } from 'react';
import settingService from '../services/setting.service';
import departmentService from '../services/department.service';
import positionService from '../services/position.service';
import trainingService from '../services/training.service';
import employeeService from '../services/employee.service';
import { useLanguage } from '../contexts/LanguageContext';
import {
  Settings as SettingsIcon, Building2, Shield, Users, Bell,
  Save, Check, Lock, Key, Mail, Globe, MapPin, Phone, RefreshCw,
  AlertCircle, ShieldCheck, Plus, Edit2, Trash2, X, Briefcase,
  GraduationCap, Calendar, DollarSign, Award, BookOpen
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const Settings = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('departments'); // 'departments' | 'positions' | 'trainings' | 'company' | 'roles' | 'security'
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Entities state
  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);
  const [trainings, setTrainings] = useState([]);
  const [employees, setEmployees] = useState([]);

  // Modals state
  const [deptModalOpen, setDeptModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const [deptForm, setDeptForm] = useState({ name: '', description: '', budget: 0, manager: '' });

  const [posModalOpen, setPosModalOpen] = useState(false);
  const [editingPos, setEditingPos] = useState(null);
  const [posForm, setPosForm] = useState({ title: '', code: '', department: '', description: '', minSalary: 0, maxSalary: 0 });

  const [trainModalOpen, setTrainModalOpen] = useState(false);
  const [editingTrain, setEditingTrain] = useState(null);
  const [trainForm, setTrainForm] = useState({
    title: '', category: 'Technique', provider: 'Interne', durationHours: 20,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0],
    budget: 250000, description: '', status: 'active'
  });

  // General Settings State
  const [settings, setSettings] = useState({
    company: {
      name: 'HRNova Enterprise',
      ninea: '005423891',
      siret: '839201948',
      email: 'contact@hrnova.com',
      phone: '+221 33 800 00 00',
      address: 'Route des Almadies, Immeuble Horizon',
      city: 'Dakar',
      country: 'Sénégal',
      currency: 'XOF',
      fiscalYearStart: '01-01',
    },
    security: {
      minPasswordLength: 8,
      requireNumbers: true,
      requireSpecialChars: true,
      passwordExpirationDays: 90,
      enable2FA: false,
      sessionTimeoutMinutes: 30,
      maxLoginAttempts: 5,
    },
    roles: [],
    notifications: {
      emailOnLeaveRequest: true,
      emailOnLeaveApproval: true,
      emailOnPayslipGenerated: true,
      emailOnNewCandidate: true,
      weeklyReportDigest: true,
    },
  });

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [deptRes, posRes, trainRes, empRes, setRes] = await Promise.all([
        departmentService.getDepartments(),
        positionService.getPositions(),
        trainingService.getTrainings(),
        employeeService.getEmployees(),
        settingService.getSettings(),
      ]);

      setDepartments(deptRes.data || []);
      setPositions(posRes.data || []);
      setTrainings(trainRes.data || []);
      setEmployees(empRes.data || []);
      if (setRes.data) {
        setSettings(setRes.data);
      }
    } catch (error) {
      console.error(error);
      toast.error('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleSaveSettings = async (e) => {
    e?.preventDefault();
    try {
      setSaving(true);
      await settingService.updateSettings(settings);
      toast.success('Paramètres du système enregistrés avec succès !');
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de l'enregistrement des paramètres");
    } finally {
      setSaving(false);
    }
  };

  // ─── DEPARTMENT HANDLERS ─────────────────────────
  const handleOpenAddDept = () => {
    setEditingDept(null);
    setDeptForm({ name: '', description: '', budget: 0, manager: '' });
    setDeptModalOpen(true);
  };

  const handleOpenEditDept = (dept) => {
    setEditingDept(dept);
    setDeptForm({
      name: dept.name || '',
      description: dept.description || '',
      budget: dept.budget || 0,
      manager: dept.manager?._id || dept.manager || '',
    });
    setDeptModalOpen(true);
  };

  const handleSaveDept = async (e) => {
    e.preventDefault();
    if (!deptForm.name) {
      toast.error('Le nom du département est obligatoire');
      return;
    }
    try {
      if (editingDept) {
        await departmentService.updateDepartment(editingDept._id, deptForm);
        toast.success('Département mis à jour avec succès');
      } else {
        await departmentService.createDepartment(deptForm);
        toast.success('Département créé avec succès');
      }
      setDeptModalOpen(false);
      const res = await departmentService.getDepartments();
      setDepartments(res.data || []);
    } catch (error) {
      toast.error(error.message || "Erreur lors de l'enregistrement du département");
    }
  };

  const handleDeleteDept = async (id) => {
    if (!window.confirm('Voulez-vous vraiment supprimer ce département ?')) return;
    try {
      await departmentService.deleteDepartment(id);
      toast.success('Département supprimé avec succès');
      const res = await departmentService.getDepartments();
      setDepartments(res.data || []);
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  // ─── POSITION HANDLERS ───────────────────────────
  const handleOpenAddPos = () => {
    setEditingPos(null);
    setPosForm({ title: '', code: '', department: departments[0]?._id || '', description: '', minSalary: 300000, maxSalary: 800000 });
    setPosModalOpen(true);
  };

  const handleOpenEditPos = (pos) => {
    setEditingPos(pos);
    setPosForm({
      title: pos.title || '',
      code: pos.code || '',
      department: typeof pos.department === 'object' ? pos.department?._id : pos.department || '',
      description: pos.description || '',
      minSalary: pos.minSalary || 300000,
      maxSalary: pos.maxSalary || 800000,
    });
    setPosModalOpen(true);
  };

  const handleSavePos = async (e) => {
    e.preventDefault();
    if (!posForm.title) {
      toast.error('L\'intitulé du poste est obligatoire');
      return;
    }
    try {
      if (editingPos) {
        await positionService.updatePosition(editingPos._id, posForm);
        toast.success('Poste mis à jour avec succès');
      } else {
        await positionService.createPosition(posForm);
        toast.success('Nouveau poste créé avec succès');
      }
      setPosModalOpen(false);
      const res = await positionService.getPositions();
      setPositions(res.data || []);
    } catch (error) {
      toast.error(error.message || "Erreur lors de l'enregistrement du poste");
    }
  };

  const handleDeletePos = async (id) => {
    if (!window.confirm('Voulez-vous vraiment supprimer ce poste ?')) return;
    try {
      await positionService.deletePosition(id);
      toast.success('Poste supprimé');
      const res = await positionService.getPositions();
      setPositions(res.data || []);
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  // ─── TRAINING HANDLERS ───────────────────────────
  const handleOpenAddTrain = () => {
    setEditingTrain(null);
    setTrainForm({
      title: '', category: 'Technique', provider: 'Organisme Externe', durationHours: 25,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 86400000 * 14).toISOString().split('T')[0],
      budget: 500000, description: '', status: 'active'
    });
    setTrainModalOpen(true);
  };

  const handleOpenEditTrain = (train) => {
    setEditingTrain(train);
    setTrainForm({
      title: train.title || '',
      category: train.category || 'Technique',
      provider: train.provider || '',
      durationHours: train.durationHours || 20,
      startDate: train.startDate || '',
      endDate: train.endDate || '',
      budget: train.budget || 0,
      description: train.description || '',
      status: train.status || 'active',
    });
    setTrainModalOpen(true);
  };

  const handleSaveTrain = async (e) => {
    e.preventDefault();
    if (!trainForm.title) {
      toast.error('Le titre de la formation est obligatoire');
      return;
    }
    try {
      if (editingTrain) {
        await trainingService.updateTraining(editingTrain._id, trainForm);
        toast.success('Formation mise à jour avec succès');
      } else {
        await trainingService.createTraining(trainForm);
        toast.success('Formation planifiée avec succès');
      }
      setTrainModalOpen(false);
      const res = await trainingService.getTrainings();
      setTrainings(res.data || []);
    } catch (error) {
      toast.error(error.message || "Erreur lors de l'enregistrement de la formation");
    }
  };

  const handleDeleteTrain = async (id) => {
    if (!window.confirm('Voulez-vous vraiment supprimer cette formation ?')) return;
    try {
      await trainingService.deleteTraining(id);
      toast.success('Formation supprimée');
      const res = await trainingService.getTrainings();
      setTrainings(res.data || []);
    } catch (error) {
      toast.error('Erreur lors de la suppression');
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
    <div className="space-y-6 pb-12">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <SettingsIcon className="h-7 w-7 text-primary" />
            Paramètres d'Administration
          </h1>
          <p className="text-sm font-medium text-slate-500">
            Gérez vos départements, postes de travail, programmes de formation et configurations générales
          </p>
        </div>

        {['company', 'security', 'notifications'].includes(activeTab) && (
          <button
            onClick={handleSaveSettings}
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover shadow-sm transition-all disabled:opacity-50 cursor-pointer"
          >
            <Save className="h-4 w-4" />
            {saving ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        )}
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-200 overflow-x-auto gap-1 bg-white px-3 pt-2 rounded-2xl border">
        <button
          onClick={() => setActiveTab('departments')}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'departments'
              ? 'border-primary text-primary bg-primary/5 rounded-t-xl'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Building2 className="h-4 w-4" />
          Départements ({departments.length})
        </button>

        <button
          onClick={() => setActiveTab('positions')}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'positions'
              ? 'border-primary text-primary bg-primary/5 rounded-t-xl'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Briefcase className="h-4 w-4" />
          Postes & Fonctions ({positions.length})
        </button>

        <button
          onClick={() => setActiveTab('trainings')}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'trainings'
              ? 'border-primary text-primary bg-primary/5 rounded-t-xl'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <GraduationCap className="h-4 w-4" />
          Formations ({trainings.length})
        </button>

        <button
          onClick={() => setActiveTab('company')}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'company'
              ? 'border-primary text-primary bg-primary/5 rounded-t-xl'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Building2 className="h-4 w-4" />
          Profil Entreprise
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'security'
              ? 'border-primary text-primary bg-primary/5 rounded-t-xl'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Shield className="h-4 w-4" />
          Sécurité
        </button>
      </div>

      {/* ─── TAB 1: DÉPARTEMENTS ─────────────────────────── */}
      {activeTab === 'departments' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Structure des Départements</h2>
              <p className="text-xs text-slate-500">Ajoutez et administrez les départements de l'entreprise sur le backend</p>
            </div>
            <button
              onClick={handleOpenAddDept}
              className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover shadow-sm transition-all cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              Ajouter un Département
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {departments.map((dept) => (
              <div key={dept._id} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-1 rounded-lg">
                      {dept.code || 'DEPT'}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenEditDept(dept)}
                        className="h-8 w-8 rounded-lg border border-slate-200 text-slate-500 hover:border-primary/30 hover:text-primary flex items-center justify-center transition-all cursor-pointer"
                        title="Modifier"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteDept(dept._id)}
                        className="h-8 w-8 rounded-lg border border-slate-200 text-slate-500 hover:border-rose-200 hover:text-rose-600 flex items-center justify-center transition-all cursor-pointer"
                        title="Supprimer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 leading-tight">{dept.name}</h3>
                  <p className="text-xs text-slate-500 mt-1.5 line-clamp-2">{dept.description || 'Aucune description'}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Budget alloué :</span>
                  <span className="font-bold text-slate-900">{(dept.budget || 0).toLocaleString('fr-FR')} F CFA</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── TAB 2: POSTES & FONCTIONS ───────────────────── */}
      {activeTab === 'positions' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Postes & Intitulés de Poste</h2>
              <p className="text-xs text-slate-500">Définissez les postes disponibles et leur grille de rémunération</p>
            </div>
            <button
              onClick={handleOpenAddPos}
              className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover shadow-sm transition-all cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              Ajouter un Poste
            </button>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="p-4">Code</th>
                  <th className="p-4">Intitulé du Poste</th>
                  <th className="p-4">Département</th>
                  <th className="p-4">Fourchette Salariale</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {positions.map((pos) => (
                  <tr key={pos._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-4 font-bold text-slate-700">{pos.code || 'POS'}</td>
                    <td className="p-4 font-bold text-slate-900">{pos.title}</td>
                    <td className="p-4 text-slate-600">
                      {typeof pos.department === 'object' ? pos.department?.name : (departments.find(d => d._id === pos.department)?.name || 'Général')}
                    </td>
                    <td className="p-4 font-medium text-slate-700">
                      {(pos.minSalary || 0).toLocaleString('fr-FR')} - {(pos.maxSalary || 0).toLocaleString('fr-FR')} F CFA
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEditPos(pos)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:text-primary transition-all cursor-pointer"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeletePos(pos._id)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:text-rose-600 transition-all cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── TAB 3: FORMATIONS ───────────────────────────── */}
      {activeTab === 'trainings' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Programmes de Formation</h2>
              <p className="text-xs text-slate-500">Planifiez et pilotez le développement des compétences des équipes</p>
            </div>
            <button
              onClick={handleOpenAddTrain}
              className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover shadow-sm transition-all cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              Ajouter une Formation
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {trainings.map((train) => (
              <div key={train._id} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">
                      {train.category || 'Technique'}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenEditTrain(train)}
                        className="h-8 w-8 rounded-lg border border-slate-200 text-slate-500 hover:text-primary flex items-center justify-center transition-all cursor-pointer"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteTrain(train._id)}
                        className="h-8 w-8 rounded-lg border border-slate-200 text-slate-500 hover:text-rose-600 flex items-center justify-center transition-all cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 leading-tight">{train.title}</h3>
                  <p className="text-xs text-slate-500 mt-1">Organisme : <strong className="text-slate-700">{train.provider}</strong></p>
                  <p className="text-xs text-slate-500 mt-0.5">Durée : <strong className="text-slate-700">{train.durationHours} heures</strong></p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Budget prévu :</span>
                  <span className="font-bold text-slate-900">{(train.budget || 0).toLocaleString('fr-FR')} F CFA</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── TAB 4: COMPANY PROFILE ──────────────────────── */}
      {activeTab === 'company' && (
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-6">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            Informations Générales de l'Entreprise
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Raison Sociale / Nom</label>
              <input
                type="text"
                value={settings.company.name}
                onChange={(e) => setSettings(prev => ({ ...prev, company: { ...prev.company, name: e.target.value } }))}
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Numéro NINEA</label>
              <input
                type="text"
                value={settings.company.ninea}
                onChange={(e) => setSettings(prev => ({ ...prev, company: { ...prev.company, ninea: e.target.value } }))}
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Officiel</label>
              <input
                type="email"
                value={settings.company.email}
                onChange={(e) => setSettings(prev => ({ ...prev, company: { ...prev.company, email: e.target.value } }))}
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Téléphone Siège</label>
              <input
                type="text"
                value={settings.company.phone}
                onChange={(e) => setSettings(prev => ({ ...prev, company: { ...prev.company, phone: e.target.value } }))}
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-primary"
              />
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 5: SECURITY ─────────────────────────────── */}
      {activeTab === 'security' && (
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-6">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            Politique de Sécurité & Mots de Passe
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Longueur minimale du mot de passe</label>
              <input
                type="number"
                min="6"
                max="32"
                value={settings.security.minPasswordLength}
                onChange={(e) => setSettings(prev => ({ ...prev, security: { ...prev.security, minPasswordLength: parseInt(e.target.value, 10) } }))}
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Expiration de session (minutes)</label>
              <input
                type="number"
                min="5"
                max="1440"
                value={settings.security.sessionTimeoutMinutes}
                onChange={(e) => setSettings(prev => ({ ...prev, security: { ...prev.security, sessionTimeoutMinutes: parseInt(e.target.value, 10) } }))}
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-primary"
              />
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL DÉPARTEMENT ───────────────────────────── */}
      {deptModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-base font-bold text-slate-900">{editingDept ? 'Modifier le département' : 'Ajouter un Département'}</h3>
              <button onClick={() => setDeptModalOpen(false)} className="rounded-lg p-1 text-slate-400 hover:bg-slate-50 cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSaveDept} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nom du département *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Direction des Finances"
                  value={deptForm.name}
                  onChange={(e) => setDeptForm({ ...deptForm, name: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Missions et responsabilités..."
                  value={deptForm.description}
                  onChange={(e) => setDeptForm({ ...deptForm, description: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Budget alloué (F CFA)</label>
                <input
                  type="number"
                  min="0"
                  value={deptForm.budget}
                  onChange={(e) => setDeptForm({ ...deptForm, budget: parseFloat(e.target.value) || 0 })}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-primary"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-xl bg-primary py-2.5 text-xs font-bold text-white hover:bg-primary-hover shadow-sm transition-all cursor-pointer"
              >
                {editingDept ? 'Enregistrer les modifications' : 'Créer le Département'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL POSTE ─────────────────────────────────── */}
      {posModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-base font-bold text-slate-900">{editingPos ? 'Modifier le poste' : 'Ajouter un Poste'}</h3>
              <button onClick={() => setPosModalOpen(false)} className="rounded-lg p-1 text-slate-400 hover:bg-slate-50 cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSavePos} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Intitulé du poste *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Chef de Projet Digital"
                  value={posForm.title}
                  onChange={(e) => setPosForm({ ...posForm, title: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Code du poste</label>
                <input
                  type="text"
                  placeholder="Ex: PM-DIG"
                  value={posForm.code}
                  onChange={(e) => setPosForm({ ...posForm, code: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-primary uppercase"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Département de rattachement</label>
                <select
                  value={posForm.department}
                  onChange={(e) => setPosForm({ ...posForm, department: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-primary bg-white"
                >
                  <option value="">Sélectionner un département</option>
                  {departments.map((d) => (
                    <option key={d._id} value={d._id}>{d.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Salaire Min (F CFA)</label>
                  <input
                    type="number"
                    value={posForm.minSalary}
                    onChange={(e) => setPosForm({ ...posForm, minSalary: parseFloat(e.target.value) || 0 })}
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Salaire Max (F CFA)</label>
                  <input
                    type="number"
                    value={posForm.maxSalary}
                    onChange={(e) => setPosForm({ ...posForm, maxSalary: parseFloat(e.target.value) || 0 })}
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-primary"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full rounded-xl bg-primary py-2.5 text-xs font-bold text-white hover:bg-primary-hover shadow-sm transition-all cursor-pointer"
              >
                {editingPos ? 'Enregistrer' : 'Créer le Poste'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL FORMATION ─────────────────────────────── */}
      {trainModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-base font-bold text-slate-900">{editingTrain ? 'Modifier la formation' : 'Ajouter une Formation'}</h3>
              <button onClick={() => setTrainModalOpen(false)} className="rounded-lg p-1 text-slate-400 hover:bg-slate-50 cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSaveTrain} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Titre de la formation *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Certification AWS Cloud Architect"
                  value={trainForm.title}
                  onChange={(e) => setTrainForm({ ...trainForm, title: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-primary"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Catégorie</label>
                  <select
                    value={trainForm.category}
                    onChange={(e) => setTrainForm({ ...trainForm, category: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-primary bg-white"
                  >
                    <option value="Technique">Technique</option>
                    <option value="Management">Management</option>
                    <option value="Soft Skills">Soft Skills</option>
                    <option value="Sécurité">Sécurité & Qualité</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Durée (Heures)</label>
                  <input
                    type="number"
                    value={trainForm.durationHours}
                    onChange={(e) => setTrainForm({ ...trainForm, durationHours: parseInt(e.target.value, 10) || 1 })}
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-primary"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Organisme / Formateur</label>
                <input
                  type="text"
                  placeholder="Ex: Global Learning Institute"
                  value={trainForm.provider}
                  onChange={(e) => setTrainForm({ ...trainForm, provider: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-primary"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Date Début</label>
                  <input
                    type="date"
                    value={trainForm.startDate}
                    onChange={(e) => setTrainForm({ ...trainForm, startDate: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Budget (F CFA)</label>
                  <input
                    type="number"
                    value={trainForm.budget}
                    onChange={(e) => setTrainForm({ ...trainForm, budget: parseFloat(e.target.value) || 0 })}
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-primary"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full rounded-xl bg-primary py-2.5 text-xs font-bold text-white hover:bg-primary-hover shadow-sm transition-all cursor-pointer"
              >
                {editingTrain ? 'Enregistrer' : 'Planifier la Formation'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
