import React, { useEffect, useState } from 'react';
import settingService from '../services/setting.service';
import { useLanguage } from '../contexts/LanguageContext';
import {
  Settings as SettingsIcon, Building2, Shield, Users, Bell,
  Save, Check, Lock, Key, Mail, Globe, MapPin, Phone, RefreshCw,
  AlertCircle, ShieldCheck
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const Settings = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('company'); // 'company' | 'security' | 'roles' | 'notifications'
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Settings State
  const [settings, setSettings] = useState({
    company: {
      name: '',
      ninea: '',
      siret: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      country: '',
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

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await settingService.getSettings();
      if (res.data) {
        setSettings(res.data);
      }
    } catch (error) {
      console.error(error);
      toast.error('Erreur lors du chargement des paramètres');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSaveSettings = async (e) => {
    e?.preventDefault();
    try {
      setSaving(true);
      await settingService.updateSettings(settings);
      toast.success('Paramètres du système enregistrés avec succès !');
    } catch (error) {
      console.error(error);
      toast.error('Erreur lors de l\'enregistrement des paramètres');
    } finally {
      setSaving(false);
    }
  };

  // Toggle permission in role matrix
  const handleTogglePermission = (roleIndex, permissionKey) => {
    setSettings((prev) => {
      const updatedRoles = [...prev.roles];
      const targetRole = { ...updatedRoles[roleIndex] };
      const hasPerm = targetRole.permissions.includes(permissionKey);

      if (hasPerm) {
        targetRole.permissions = targetRole.permissions.filter((p) => p !== permissionKey);
      } else {
        targetRole.permissions = [...targetRole.permissions, permissionKey];
      }

      updatedRoles[roleIndex] = targetRole;
      return { ...prev, roles: updatedRoles };
    });
  };

  const modulesList = [
    { key: 'employees:manage', label: 'Gestion des Collaborateurs' },
    { key: 'departments:manage', label: 'Gestion des Départements' },
    { key: 'payroll:manage', label: 'Gestion de la Paie' },
    { key: 'attendance:manage', label: 'Pointages & Présences' },
    { key: 'leaves:approve', label: 'Validation des Congés' },
    { key: 'recruitment:manage', label: 'Gestion des Recrutements' },
    { key: 'settings:manage', label: 'Configuration du Système' },
  ];

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
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <SettingsIcon className="h-7 w-7 text-primary" />
            Paramètres du Système
          </h1>
          <p className="text-sm font-medium text-slate-500">
            Configurez les paramètres généraux de votre entreprise, la sécurité et la matrice des rôles
          </p>
        </div>

        <button
          onClick={handleSaveSettings}
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover shadow-sm transition-all disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
        </button>
      </div>

      {/* Tabs Navigation (Matching Mockup 4) */}
      <div className="flex border-b border-slate-200 overflow-x-auto">
        <button
          onClick={() => setActiveTab('company')}
          className={`flex items-center gap-2 px-6 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition-all ${
            activeTab === 'company'
              ? 'border-primary text-primary'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Building2 className="h-4 w-4" />
          Profil Entreprise
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`flex items-center gap-2 px-6 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition-all ${
            activeTab === 'security'
              ? 'border-primary text-primary'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Shield className="h-4 w-4" />
          Sécurité & Authentification
        </button>
        <button
          onClick={() => setActiveTab('roles')}
          className={`flex items-center gap-2 px-6 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition-all ${
            activeTab === 'roles'
              ? 'border-primary text-primary'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="h-4 w-4" />
          Rôles & Permissions
        </button>
        <button
          onClick={() => setActiveTab('notifications')}
          className={`flex items-center gap-2 px-6 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition-all ${
            activeTab === 'notifications'
              ? 'border-primary text-primary'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Bell className="h-4 w-4" />
          Notifications & Emails
        </button>
      </div>

      {/* TAB 1: COMPANY PROFILE */}
      {activeTab === 'company' && (
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-6">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            Informations Générales de l'Entreprise
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Raison Sociale / Nom de l'Entreprise</label>
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
              <label className="block text-xs font-semibold text-slate-700 mb-1">Immatriculation CNSS / SIRET</label>
              <input
                type="text"
                value={settings.company.siret}
                onChange={(e) => setSettings(prev => ({ ...prev, company: { ...prev.company, siret: e.target.value } }))}
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

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Devise Principale</label>
              <select
                value={settings.company.currency}
                onChange={(e) => setSettings(prev => ({ ...prev, company: { ...prev.company, currency: e.target.value } }))}
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-primary font-bold text-primary"
              >
                <option value="XOF">Franc CFA (F CFA / XOF)</option>
                <option value="EUR">Euro (€)</option>
                <option value="USD">US Dollar ($)</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Adresse Siège Social</label>
              <input
                type="text"
                value={settings.company.address}
                onChange={(e) => setSettings(prev => ({ ...prev, company: { ...prev.company, address: e.target.value } }))}
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-primary"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SECURITY & AUTH */}
      {activeTab === 'security' && (
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-6">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
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
                onChange={(e) => setSettings(prev => ({ ...prev, security: { ...prev.security, minPasswordLength: Number(e.target.value) } }))}
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Expiration mot de passe (Jours)</label>
              <input
                type="number"
                value={settings.security.passwordExpirationDays}
                onChange={(e) => setSettings(prev => ({ ...prev, security: { ...prev.security, passwordExpirationDays: Number(e.target.value) } }))}
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Délai d'inactivité de session (Minutes)</label>
              <input
                type="number"
                value={settings.security.sessionTimeoutMinutes}
                onChange={(e) => setSettings(prev => ({ ...prev, security: { ...prev.security, sessionTimeoutMinutes: Number(e.target.value) } }))}
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-primary"
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/50">
              <div>
                <p className="font-bold text-slate-900 text-xs">Authentification Double Facteur (2FA)</p>
                <p className="text-[11px] text-slate-500">Exiger un code OTP à la connexion</p>
              </div>
              <input
                type="checkbox"
                checked={settings.security.enable2FA}
                onChange={(e) => setSettings(prev => ({ ...prev, security: { ...prev.security, enable2FA: e.target.checked } }))}
                className="h-5 w-5 rounded text-primary focus:ring-primary"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ROLES & PERMISSIONS MATRIX */}
      {activeTab === 'roles' && (
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Matrice des Rôles & Autorisations
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Cochez les autorisations pour chaque rôle utilisateur</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase bg-slate-50/50">
                  <th className="py-3.5 px-4">Module / Action</th>
                  {settings.roles.map((r) => (
                    <th key={r.role} className="py-3.5 px-4 text-center">
                      {r.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {modulesList.map((m) => (
                  <tr key={m.key} className="hover:bg-slate-50/50">
                    <td className="py-3.5 px-4 font-semibold text-slate-800">{m.label}</td>
                    {settings.roles.map((r, roleIdx) => {
                      const isChecked = r.permissions.includes(m.key);
                      return (
                        <td key={r.role} className="py-3.5 px-4 text-center">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleTogglePermission(roleIdx, m.key)}
                            className="h-4 w-4 rounded text-primary focus:ring-primary"
                          />
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: NOTIFICATIONS & EMAILS */}
      {activeTab === 'notifications' && (
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-6">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Préférences de Notifications Email
          </h3>

          <div className="space-y-4 max-w-xl">
            <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/50">
              <div>
                <p className="font-bold text-slate-900 text-xs">Alertes Nouvelles Demandes de Congé</p>
                <p className="text-[11px] text-slate-500">Envoyer un email au manager lors de la soumission</p>
              </div>
              <input
                type="checkbox"
                checked={settings.notifications.emailOnLeaveRequest}
                onChange={(e) => setSettings(prev => ({ ...prev, notifications: { ...prev.notifications, emailOnLeaveRequest: e.target.checked } }))}
                className="h-5 w-5 rounded text-primary focus:ring-primary"
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/50">
              <div>
                <p className="font-bold text-slate-900 text-xs">Confirmation de Validation de Congé</p>
                <p className="text-[11px] text-slate-500">Notifier le collaborateur par email de la réponse</p>
              </div>
              <input
                type="checkbox"
                checked={settings.notifications.emailOnLeaveApproval}
                onChange={(e) => setSettings(prev => ({ ...prev, notifications: { ...prev.notifications, emailOnLeaveApproval: e.target.checked } }))}
                className="h-5 w-5 rounded text-primary focus:ring-primary"
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/50">
              <div>
                <p className="font-bold text-slate-900 text-xs">Bulletin de Paie Disponible</p>
                <p className="text-[11px] text-slate-500">Avertir le collaborateur dès la génération de son bulletin</p>
              </div>
              <input
                type="checkbox"
                checked={settings.notifications.emailOnPayslipGenerated}
                onChange={(e) => setSettings(prev => ({ ...prev, notifications: { ...prev.notifications, emailOnPayslipGenerated: e.target.checked } }))}
                className="h-5 w-5 rounded text-primary focus:ring-primary"
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/50">
              <div>
                <p className="font-bold text-slate-900 text-xs">Alerte Nouvelle Candidature</p>
                <p className="text-[11px] text-slate-500">Notifier les recruteurs lorsqu'un candidat postule</p>
              </div>
              <input
                type="checkbox"
                checked={settings.notifications.emailOnNewCandidate}
                onChange={(e) => setSettings(prev => ({ ...prev, notifications: { ...prev.notifications, emailOnNewCandidate: e.target.checked } }))}
                className="h-5 w-5 rounded text-primary focus:ring-primary"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
