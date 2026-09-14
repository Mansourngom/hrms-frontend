// Mock Database helper using localStorage for the trial version

const getStorageItem = (key, defaultValue) => {
  const item = localStorage.getItem(key);
  if (!item) {
    localStorage.setItem(key, JSON.stringify(defaultValue));
    return defaultValue;
  }
  try {
    return JSON.parse(item);
  } catch (e) {
    return defaultValue;
  }
};

const saveStorageItem = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

// Initial Data Seeds
const seedUsers = [
  {
    _id: 'user_admin_1',
    firstName: 'Admin',
    lastName: 'NexusHR',
    email: 'admin@nexushr.com',
    password: 'admin',
    phone: '770000000',
    role: 'admin',
    status: 'active',
    emailVerifiedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  }
];

const seedDepartments = [
  {
    _id: 'dept_rd',
    name: 'Recherche & Dév.',
    code: 'RD',
    description: 'Recherche et Développement technologique',
    manager: 'emp_1',
    budget: 21900000,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'dept_sales',
    name: 'Ventes (Sales)',
    code: 'SALES',
    description: 'Pôle Commercial et Développement des Ventes',
    manager: null,
    budget: 20300000,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'dept_mktg',
    name: 'Marketing',
    code: 'MKTG',
    description: 'Pôle Communication et Marketing relationnel',
    manager: null,
    budget: 9300000,
    isActive: true,
    createdAt: new Date().toISOString(),
  }
];

const seedPositions = [
  {
    _id: 'pos_dev',
    title: 'Ingénieur Dév.',
    code: 'ING-DEV',
    department: 'dept_rd',
    description: 'Développement et conception des applications',
    salaryRange: { min: 450000, max: 950000, currency: 'XOF' },
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'pos_commercial',
    title: 'Commercial',
    code: 'COMMERCIAL',
    department: 'dept_sales',
    description: 'Acquisition client et ventes directes',
    salaryRange: { min: 250000, max: 600000, currency: 'XOF' },
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'pos_mktg_manager',
    title: 'Chargé de Marketing',
    code: 'MKTG-MGR',
    department: 'dept_mktg',
    description: 'Suivi des campagnes publicitaires et études de marché',
    salaryRange: { min: 300000, max: 750000, currency: 'XOF' },
    isActive: true,
    createdAt: new Date().toISOString(),
  }
];

const seedEmployees = [
  {
    _id: 'emp_1',
    employeeCode: 'EMP-001',
    firstName: 'Marie',
    lastName: 'Ndiaye',
    email: 'marie.ndiaye@nexushr.com',
    phone: '+221 77 123 45 67',
    gender: 'female',
    birthDate: '1992-05-14',
    hireDate: '2020-02-01',
    address: { street: 'Avenue Cheikh Anta Diop', city: 'Dakar', country: 'Sénégal', postalCode: '10000' },
    emergencyContact: { name: 'Moussa Ndiaye', relationship: 'Frère', phone: '+221 70 111 22 33' },
    photo: { url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80', publicId: 'mock_1' },
    department: 'dept_rd',
    position: 'pos_dev',
    manager: null,
    contract: { type: 'cdi', startDate: '2020-02-01', endDate: '', status: 'active' },
    salary: { base: 685000, currency: 'XOF' },
    leaveBalance: { annual: 24, sick: 10, other: 0 },
    status: 'active',
    notes: 'Excellente collaboratrice, chef du pôle R&D.',
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'emp_2',
    employeeCode: 'EMP-002',
    firstName: 'Cheikh',
    lastName: 'Diop',
    email: 'cheikh.diop@nexushr.com',
    phone: '+221 78 987 65 43',
    gender: 'male',
    birthDate: '1989-11-20',
    hireDate: '2021-06-15',
    address: { street: 'Rue 10 Medina', city: 'Dakar', country: 'Sénégal', postalCode: '12000' },
    emergencyContact: { name: 'Fatou Diop', relationship: 'Épouse', phone: '+221 76 444 55 66' },
    photo: { url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80', publicId: 'mock_2' },
    department: 'dept_sales',
    position: 'pos_commercial',
    manager: 'emp_1',
    contract: { type: 'cdi', startDate: '2021-06-15', endDate: '', status: 'active' },
    salary: { base: 452000, currency: 'XOF' },
    leaveBalance: { annual: 20, sick: 8, other: 2 },
    status: 'active',
    notes: 'Commercial senior.',
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'emp_3',
    employeeCode: 'EMP-003',
    firstName: 'Sophie',
    lastName: 'Leroy',
    email: 'sophie.leroy@nexushr.com',
    phone: '+221 70 555 66 77',
    gender: 'female',
    birthDate: '1995-03-08',
    hireDate: '2022-01-10',
    address: { street: 'Almadies', city: 'Dakar', country: 'Sénégal', postalCode: '16000' },
    emergencyContact: { name: 'Lucas Leroy', relationship: 'Père', phone: '+221 70 888 99 00' },
    photo: { url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&h=150&q=80', publicId: 'mock_3' },
    department: 'dept_mktg',
    position: 'pos_mktg_manager',
    manager: 'emp_1',
    contract: { type: 'cdd', startDate: '2022-01-10', endDate: '2024-01-10', status: 'active' },
    salary: { base: 520000, currency: 'XOF' },
    leaveBalance: { annual: 18, sick: 10, other: 0 },
    status: 'active',
    notes: 'En charge du marketing digital.',
    createdAt: new Date().toISOString(),
  }
];

const seedPayrolls = [
  {
    _id: 'pay_1',
    payrollCode: 'PAY-202608-001',
    employee: 'emp_1',
    month: 8,
    year: 2026,
    baseSalary: 685000,
    allowances: 50000,
    overtimeHours: 4,
    overtimeRate: 5000,
    deductions: 38500,
    netSalary: 716500,
    status: 'paid',
    paymentDate: '2026-08-30',
    paymentMethod: 'wire_transfer',
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'pay_2',
    payrollCode: 'PAY-202608-002',
    employee: 'emp_2',
    month: 8,
    year: 2026,
    baseSalary: 452000,
    allowances: 25000,
    overtimeHours: 0,
    overtimeRate: 0,
    deductions: 22600,
    netSalary: 454400,
    status: 'validated',
    paymentDate: null,
    paymentMethod: 'wire_transfer',
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'pay_3',
    payrollCode: 'PAY-202608-003',
    employee: 'emp_3',
    month: 8,
    year: 2026,
    baseSalary: 520000,
    allowances: 30000,
    overtimeHours: 2,
    overtimeRate: 4000,
    deductions: 28000,
    netSalary: 530000,
    status: 'pending',
    paymentDate: null,
    paymentMethod: 'wire_transfer',
    createdAt: new Date().toISOString(),
  }
];

const todayStr = new Date().toISOString().split('T')[0];

const seedAttendances = [
  {
    _id: 'att_1',
    employee: 'emp_1',
    date: todayStr,
    checkIn: '08:00',
    checkOut: '17:00',
    status: 'present',
    workHours: 8,
    notes: 'À l\'heure',
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'att_2',
    employee: 'emp_2',
    date: todayStr,
    checkIn: '09:15',
    checkOut: null,
    status: 'late',
    workHours: 0,
    notes: 'Retard signalés de 15 mn',
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'att_3',
    employee: 'emp_3',
    date: todayStr,
    checkIn: null,
    checkOut: null,
    status: 'on_leave',
    workHours: 0,
    notes: 'Congé annuel approuvé',
    createdAt: new Date().toISOString(),
  }
];

const seedLeaves = [
  {
    _id: 'leave_1',
    employee: 'emp_3',
    type: 'annual',
    startDate: '2026-09-01',
    endDate: '2026-09-10',
    daysCount: 7,
    reason: 'Congés annuels de fin d\'été',
    status: 'approved',
    managerComment: 'Bonnes vacances !',
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'leave_2',
    employee: 'emp_2',
    type: 'sick',
    startDate: '2026-09-15',
    endDate: '2026-09-17',
    daysCount: 2,
    reason: 'Repos médical prescrit par le médecin',
    status: 'pending',
    managerComment: '',
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'leave_3',
    employee: 'emp_1',
    type: 'special',
    startDate: '2026-09-22',
    endDate: '2026-09-23',
    daysCount: 1,
    reason: 'Événement familial',
    status: 'pending',
    managerComment: '',
    createdAt: new Date().toISOString(),
  }
];

const seedRecruitments = [
  {
    _id: 'job_1',
    title: 'Développeur Fullstack Senior',
    department: 'dept_rd',
    contractType: 'cdi',
    location: 'Dakar, Sénégal',
    status: 'published',
    description: 'Conception et implémentation d\'architectures web scalables.',
    openingsCount: 2,
    createdAt: new Date('2026-08-15').toISOString(),
  },
  {
    _id: 'job_2',
    title: 'Responsable Marketing Digital',
    department: 'dept_mktg',
    contractType: 'cdi',
    location: 'Dakar / Hybride',
    status: 'published',
    description: 'Pilotage de la stratégie d\'acquisition digitale et des campagnes.',
    openingsCount: 1,
    createdAt: new Date('2026-08-20').toISOString(),
  },
  {
    _id: 'job_3',
    title: 'Ingénieur Commercial B2B',
    department: 'dept_sales',
    contractType: 'cdd',
    location: 'Dakar, Sénégal',
    status: 'published',
    description: 'Prospection et développement du portefeuille clients grands comptes.',
    openingsCount: 3,
    createdAt: new Date('2026-08-25').toISOString(),
  }
];

const seedCandidates = [
  {
    _id: 'cand_1',
    firstName: 'Babacar',
    lastName: 'Sow',
    email: 'babacar.sow@gmail.com',
    phone: '+221 77 654 32 10',
    recruitment: 'job_1',
    stage: 'entretien',
    resumeUrl: '#',
    notes: 'Excellente expérience sur React et Node.js.',
    createdAt: new Date('2026-08-18').toISOString(),
  },
  {
    _id: 'cand_2',
    firstName: 'Aïssatou',
    lastName: 'Fall',
    email: 'aissatou.fall@yahoo.fr',
    phone: '+221 78 111 22 33',
    recruitment: 'job_2',
    stage: 'offre',
    resumeUrl: '#',
    notes: 'Profil très créatif, offre financière transmise.',
    createdAt: new Date('2026-08-22').toISOString(),
  },
  {
    _id: 'cand_3',
    firstName: 'Ousmane',
    lastName: 'Camara',
    email: 'ousmane.camara@outlook.com',
    phone: '+221 70 999 88 77',
    recruitment: 'job_1',
    stage: 'nouveau',
    resumeUrl: '#',
    notes: 'Candidature spontanée prometteuse.',
    createdAt: new Date('2026-08-28').toISOString(),
  },
  {
    _id: 'cand_4',
    firstName: 'Aminata',
    lastName: 'Ba',
    email: 'aminata.ba@gmail.com',
    phone: '+221 76 333 44 55',
    recruitment: 'job_3',
    stage: 'recrute',
    resumeUrl: '#',
    notes: 'Contrat signé, intégration en cours.',
    createdAt: new Date('2026-08-10').toISOString(),
  }
];

const seedTrainings = [
  {
    _id: 'train_1',
    title: 'Architecture Cloud & Microservices',
    category: 'Technique',
    provider: 'TechAcademy Dakar',
    durationHours: 35,
    startDate: '2026-09-10',
    endDate: '2026-09-25',
    budget: 1500000,
    status: 'active',
    description: 'Conception et déploiement d\'architectures distribuées sur Kubernetes et AWS.',
    createdAt: new Date('2026-08-01').toISOString(),
  },
  {
    _id: 'train_2',
    title: 'Leadership & Management d\'Équipe',
    category: 'Management',
    provider: 'Executive Institute Dakar',
    durationHours: 20,
    startDate: '2026-09-15',
    endDate: '2026-09-20',
    budget: 950000,
    status: 'active',
    description: 'Techniques de communication, coaching et conduite du changement.',
    createdAt: new Date('2026-08-05').toISOString(),
  },
  {
    _id: 'train_3',
    title: 'Stratégies Marketing Digital & Analytics',
    category: 'Marketing',
    provider: 'Digital Campus',
    durationHours: 15,
    startDate: '2026-10-01',
    endDate: '2026-10-05',
    budget: 650000,
    status: 'upcoming',
    description: 'Analyse comportementale et campagnes de publicité ciblées.',
    createdAt: new Date('2026-08-12').toISOString(),
  }
];

const seedEnrollments = [
  {
    _id: 'enr_1',
    employee: 'emp_1',
    training: 'train_1',
    progressPercent: 85,
    status: 'in_progress',
    certificateIssued: false,
    enrolledAt: '2026-09-01',
  },
  {
    _id: 'enr_2',
    employee: 'emp_2',
    training: 'train_2',
    progressPercent: 100,
    status: 'completed',
    certificateIssued: true,
    enrolledAt: '2026-08-15',
  },
  {
    _id: 'enr_3',
    employee: 'emp_3',
    training: 'train_3',
    progressPercent: 20,
    status: 'in_progress',
    certificateIssued: false,
    enrolledAt: '2026-09-02',
  }
];

const seedDocuments = [
  {
    _id: 'doc_1',
    title: 'Contrat de Travail CDI - Marie Ndiaye',
    category: 'contract',
    mimeType: 'application/pdf',
    fileExtension: 'PDF',
    sizeFormatted: '1.4 MB',
    sizeBytes: 1468006,
    employee: 'emp_1',
    confidentiality: 'restricted',
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    createdAt: new Date('2026-08-01').toISOString(),
  },
  {
    _id: 'doc_2',
    title: 'Règlement Intérieur & Politique RH 2026',
    category: 'policy',
    mimeType: 'application/pdf',
    fileExtension: 'PDF',
    sizeFormatted: '3.8 MB',
    sizeBytes: 3984588,
    employee: null,
    confidentiality: 'public',
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    createdAt: new Date('2026-08-10').toISOString(),
  },
  {
    _id: 'doc_3',
    title: 'Certificat Médical d\'Aptitude - Cheikh Diop',
    category: 'medical',
    mimeType: 'image/png',
    fileExtension: 'PNG',
    sizeFormatted: '850 KB',
    sizeBytes: 870400,
    employee: 'emp_2',
    confidentiality: 'confidential',
    url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80',
    createdAt: new Date('2026-08-15').toISOString(),
  },
  {
    _id: 'doc_4',
    title: 'Bulletin de Paie Août 2026 - Sophie Leroy',
    category: 'payroll',
    mimeType: 'application/pdf',
    fileExtension: 'PDF',
    sizeFormatted: '420 KB',
    sizeBytes: 430080,
    employee: 'emp_3',
    confidentiality: 'confidential',
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    createdAt: new Date('2026-08-30').toISOString(),
  }
];

const seedReviews = [
  {
    _id: 'rev_1',
    employee: 'emp_1',
    evaluator: 'Admin NexusHR',
    period: 'Annuel 2026',
    rating: 4.8,
    feedback: 'Excellentes capacités de leadership et d\'innovation sur les projets R&D. Objectifs dépassés.',
    status: 'completed',
    reviewDate: '2026-08-15',
  },
  {
    _id: 'rev_2',
    employee: 'emp_2',
    evaluator: 'Marie Ndiaye',
    period: 'Annuel 2026',
    rating: 4.2,
    feedback: 'Résultats commerciaux solides, très bonne autonomie et prospection grands comptes efficace.',
    status: 'completed',
    reviewDate: '2026-08-20',
  },
  {
    _id: 'rev_3',
    employee: 'emp_3',
    evaluator: 'Marie Ndiaye',
    period: 'Semestriel T2 2026',
    rating: 4.0,
    feedback: 'Créativité remarquable et réactivité constante sur les campagnes digitales.',
    status: 'completed',
    reviewDate: '2026-08-28',
  }
];

const seedGoals = [
  {
    _id: 'goal_1',
    employee: 'emp_1',
    title: 'Migrer les architectures microservices vers Kubernetes',
    period: 'T3 2026',
    progressPercent: 85,
    dueDate: '2026-09-30',
    status: 'in_progress',
    weight: 30,
  },
  {
    _id: 'goal_2',
    employee: 'emp_2',
    title: 'Développer le portefeuille grands comptes (+15% de CA)',
    period: 'T3 2026',
    progressPercent: 100,
    dueDate: '2026-09-15',
    status: 'achieved',
    weight: 40,
  },
  {
    _id: 'goal_3',
    employee: 'emp_3',
    title: 'Refondre l\'image de marque & piloter les campagnes RS',
    period: 'T4 2026',
    progressPercent: 40,
    dueDate: '2026-11-30',
    status: 'in_progress',
    weight: 30,
  }
];

const seedSettings = {
  company: {
    name: 'Nexus HR Enterprise',
    ninea: '009238472 2V3',
    siret: '489-201-992',
    email: 'contact@nexushr.com',
    phone: '+221 33 800 00 00',
    address: 'Avenue Cheikh Anta Diop, BP 11000',
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
  roles: [
    {
      role: 'admin',
      label: 'Administrateur Système',
      permissions: ['employees:manage', 'departments:manage', 'payroll:manage', 'attendance:manage', 'recruitment:manage', 'settings:manage'],
    },
    {
      role: 'hr_director',
      label: 'Directeur RH',
      permissions: ['employees:manage', 'departments:manage', 'payroll:manage', 'attendance:manage', 'recruitment:manage'],
    },
    {
      role: 'manager',
      label: 'Manager d\'Équipe',
      permissions: ['employees:read', 'attendance:read', 'leaves:approve'],
    },
    {
      role: 'employee',
      label: 'Collaborateur',
      permissions: ['profile:read', 'leaves:request', 'payslip:read'],
    },
  ],
  notifications: {
    emailOnLeaveRequest: true,
    emailOnLeaveApproval: true,
    emailOnPayslipGenerated: true,
    emailOnNewCandidate: true,
    weeklyReportDigest: true,
  },
};

export const mockDb = {
  getUsers: () => getStorageItem('mock_users', seedUsers),
  getDepartments: () => getStorageItem('mock_departments', seedDepartments),
  getPositions: () => getStorageItem('mock_positions', seedPositions),
  getEmployees: () => getStorageItem('mock_employees', seedEmployees),
  getLeaves: () => getStorageItem('mock_leaves', seedLeaves),
  getCandidates: () => getStorageItem('mock_candidates', seedCandidates),
  getRecruitments: () => getStorageItem('mock_recruitments', seedRecruitments),
  getPayrolls: () => getStorageItem('mock_payrolls', seedPayrolls),
  getAttendances: () => getStorageItem('mock_attendances', seedAttendances),
  getSettings: () => getStorageItem('mock_system_settings', seedSettings),
  getTrainings: () => getStorageItem('mock_trainings', seedTrainings),
  getEnrollments: () => getStorageItem('mock_enrollments', seedEnrollments),
  getDocuments: () => getStorageItem('mock_documents', seedDocuments),
  getReviews: () => getStorageItem('mock_reviews', seedReviews),
  getGoals: () => getStorageItem('mock_goals', seedGoals),

  saveUsers: (data) => saveStorageItem('mock_users', data),
  saveDepartments: (data) => saveStorageItem('mock_departments', data),
  savePositions: (data) => saveStorageItem('mock_positions', data),
  saveEmployees: (data) => saveStorageItem('mock_employees', data),
  saveLeaves: (data) => saveStorageItem('mock_leaves', data),
  saveCandidates: (data) => saveStorageItem('mock_candidates', data),
  saveRecruitments: (data) => saveStorageItem('mock_recruitments', data),
  savePayrolls: (data) => saveStorageItem('mock_payrolls', data),
  saveAttendances: (data) => saveStorageItem('mock_attendances', data),
  saveSettings: (data) => saveStorageItem('mock_system_settings', data),
  saveTrainings: (data) => saveStorageItem('mock_trainings', data),
  saveEnrollments: (data) => saveStorageItem('mock_enrollments', data),
  saveDocuments: (data) => saveStorageItem('mock_documents', data),
  saveReviews: (data) => saveStorageItem('mock_reviews', data),
  saveGoals: (data) => saveStorageItem('mock_goals', data),

  // Generic DB Helpers
  generateId: (prefix = 'id') => `${prefix}_${Math.random().toString(36).substr(2, 9)}`,

  delay: (ms = 300) => new Promise(resolve => setTimeout(resolve, ms))
};
