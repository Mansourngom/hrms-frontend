import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext(null);

const translations = {
  fr: {
    dashboard: 'Tableau de bord',
    employees: 'Employés',
    payroll: 'Paie',
    attendance: 'Présences & Congés',
    recruitment: 'Recrutement',
    performance: 'Performances',
    learning: 'Apprentissage',
    documents: 'Documents',
    reports: 'Rapports',
    settings: 'Paramètres',
    helpCenter: "Centre d'aide",
    logout: 'Déconnexion',
    switchView: 'Changer de vue',
    newRequest: 'Nouvelle demande',
    search: 'Rechercher...',
    profile: 'Mon Profil',
    welcome: 'Bonjour',
    welcomeBack: 'Bon retour !',
    welcomeSub: 'Voici un aperçu de l\'activité RH de votre entreprise.',
    activeEmployees: 'Total Employés',
    presentToday: 'Présents Aujourd\'hui',
    leavesPending: 'Congés en Attente',
    activeRecruitments: 'Recrutements Actifs',
    recentActivity: 'Activités Récentes',
    quickActions: 'Actions Rapides',
    currency: 'F CFA',
    save: 'Enregistrer',
    cancel: 'Annuler',
    add: 'Ajouter',
    edit: 'Modifier',
    delete: 'Supprimer',
    archive: 'Archiver',
    reactivate: 'Réactiver',
    firstName: 'Prénom',
    lastName: 'Nom',
    email: 'Adresse Email',
    phone: 'Téléphone',
    company: 'Entreprise',
    role: 'Rôle',
    status: 'Statut',
    department: 'Département',
    position: 'Poste',
    salary: 'Salaire',
    contract: 'Contrat',
    actions: 'Actions',
    emptyList: 'Aucun enregistrement trouvé.',
    loading: 'Chargement en cours...',
  },
  en: {
    dashboard: 'Dashboard',
    employees: 'Employees',
    payroll: 'Payroll',
    attendance: 'Time & Attendance',
    recruitment: 'Recruitment',
    performance: 'Performance',
    learning: 'Learning',
    documents: 'Documents',
    reports: 'Reports',
    settings: 'Settings',
    helpCenter: 'Help Center',
    logout: 'Logout',
    switchView: 'Switch View',
    newRequest: 'New Request',
    search: 'Search...',
    profile: 'My Profile',
    welcome: 'Hello',
    welcomeBack: 'Welcome Back!',
    welcomeSub: 'Here is a quick overview of your company\'s HR activity.',
    activeEmployees: 'Total Employees',
    presentToday: 'Present Today',
    leavesPending: 'Pending Leaves',
    activeRecruitments: 'Active Recruitments',
    recentActivity: 'Recent Activity',
    quickActions: 'Quick Actions',
    currency: 'F CFA',
    save: 'Save',
    cancel: 'Cancel',
    add: 'Add',
    edit: 'Edit',
    delete: 'Delete',
    archive: 'Archive',
    reactivate: 'Reactivate',
    firstName: 'First Name',
    lastName: 'Last Name',
    email: 'Email Address',
    phone: 'Phone',
    company: 'Company',
    role: 'Role',
    status: 'Status',
    department: 'Department',
    position: 'Position',
    salary: 'Salary',
    contract: 'Contract',
    actions: 'Actions',
    emptyList: 'No records found.',
    loading: 'Loading...',
  },
  es: {
    dashboard: 'Tablero',
    employees: 'Empleados',
    payroll: 'Nómina',
    attendance: 'Asistencia y Licencia',
    recruitment: 'Reclutamiento',
    performance: 'Rendimiento',
    learning: 'Aprendizaje',
    documents: 'Documentos',
    reports: 'Informes',
    settings: 'Configuración',
    helpCenter: 'Centro de ayuda',
    logout: 'Cerrar sesión',
    switchView: 'Cambiar vista',
    newRequest: 'Nueva solicitud',
    search: 'Buscar...',
    profile: 'Mi Perfil',
    welcome: 'Hola',
    welcomeBack: '¡Bienvenido de nuevo!',
    welcomeSub: 'Aquí hay un resumen rápido de la actividad de RR.HH. de su empresa.',
    activeEmployees: 'Total Empleados',
    presentToday: 'Presentes Hoy',
    leavesPending: 'Licencias Pendientes',
    activeRecruitments: 'Reclutamientos Activos',
    recentActivity: 'Actividad Reciente',
    quickActions: 'Acciones Rápidas',
    currency: 'F CFA',
    save: 'Guardar',
    cancel: 'Cancelar',
    add: 'Añadir',
    edit: 'Editar',
    delete: 'Eliminar',
    archive: 'Archivar',
    reactivate: 'Reactivar',
    firstName: 'Nombre',
    lastName: 'Apellido',
    email: 'Correo electrónico',
    phone: 'Teléfono',
    company: 'Empresa',
    role: 'Rol',
    status: 'Estado',
    department: 'Departamento',
    position: 'Puesto',
    salary: 'Salario',
    contract: 'Contrato',
    actions: 'Acciones',
    emptyList: 'No se encontraron registros.',
    loading: 'Cargando...',
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'fr';
  });

  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key) => {
    return translations[language]?.[key] || translations['fr']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
