import { mockDb } from './mockDb';

const populateRecruitment = (job, depts, candidates) => {
  const dept = depts.find((d) => d._id === job.department) || job.department;
  const applicantCount = candidates.filter((c) => (typeof c.recruitment === 'object' ? c.recruitment._id : c.recruitment) === job._id).length;

  return {
    ...job,
    department: dept,
    applicantCount,
  };
};

const populateCandidate = (cand, jobs) => {
  const job = jobs.find((j) => j._id === cand.recruitment) || cand.recruitment;
  return {
    ...cand,
    recruitment: job,
  };
};

const recruitmentService = {
  async getRecruitments(params = {}) {
    await mockDb.delay();
    const jobs = mockDb.getRecruitments();
    const depts = mockDb.getDepartments();
    const candidates = mockDb.getCandidates();

    let filtered = [...jobs];
    if (params.status) {
      filtered = filtered.filter(j => j.status === params.status);
    }
    if (params.department) {
      filtered = filtered.filter(j => j.department === params.department);
    }

    const populated = filtered.map((j) => populateRecruitment(j, depts, candidates));

    return {
      success: true,
      data: populated,
    };
  },

  async createRecruitment(data) {
    await mockDb.delay();
    const jobs = mockDb.getRecruitments();

    const newJob = {
      _id: mockDb.generateId('job'),
      title: data.title,
      department: data.department,
      contractType: data.contractType || 'cdi',
      location: data.location || 'Dakar, Sénégal',
      status: 'published',
      description: data.description || '',
      openingsCount: Number(data.openingsCount) || 1,
      createdAt: new Date().toISOString(),
    };

    jobs.unshift(newJob);
    mockDb.saveRecruitments(jobs);

    return {
      success: true,
      message: 'Offre d\'emploi publiée avec succès',
      data: newJob,
    };
  },

  async updateRecruitmentStatus(id, status) {
    await mockDb.delay();
    const jobs = mockDb.getRecruitments();
    const idx = jobs.findIndex(j => j._id === id);

    if (idx === -1) {
      throw {
        response: {
          data: { message: 'Offre introuvable' }
        }
      };
    }

    jobs[idx].status = status;
    mockDb.saveRecruitments(jobs);

    return {
      success: true,
      message: 'Statut de l\'offre mis à jour',
      data: jobs[idx],
    };
  },

  async deleteRecruitment(id) {
    await mockDb.delay();
    const jobs = mockDb.getRecruitments();
    const filtered = jobs.filter(j => j._id !== id);

    mockDb.saveRecruitments(filtered);

    return {
      success: true,
      message: 'Offre supprimée avec succès',
    };
  },

  // CANDIDATES PIPELINE METHODS
  async getCandidates(params = {}) {
    await mockDb.delay();
    const candidates = mockDb.getCandidates();
    const jobs = mockDb.getRecruitments();

    let filtered = [...candidates];
    if (params.stage) {
      filtered = filtered.filter(c => c.stage === params.stage);
    }
    if (params.recruitment) {
      filtered = filtered.filter(c => (typeof c.recruitment === 'object' ? c.recruitment._id : c.recruitment) === params.recruitment);
    }

    const populated = filtered.map(c => populateCandidate(c, jobs));

    return {
      success: true,
      data: populated,
    };
  },

  async createCandidate(data) {
    await mockDb.delay();
    const candidates = mockDb.getCandidates();

    const newCand = {
      _id: mockDb.generateId('cand'),
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone || '',
      recruitment: data.recruitment,
      stage: 'nouveau',
      resumeUrl: '#',
      notes: data.notes || '',
      createdAt: new Date().toISOString(),
    };

    candidates.unshift(newCand);
    mockDb.saveCandidates(candidates);

    return {
      success: true,
      message: 'Candidature enregistrée avec succès',
      data: newCand,
    };
  },

  async updateCandidateStage(id, stage) {
    await mockDb.delay();
    const candidates = mockDb.getCandidates();
    const idx = candidates.findIndex(c => c._id === id);

    if (idx === -1) {
      throw {
        response: {
          data: { message: 'Candidat introuvable' }
        }
      };
    }

    candidates[idx].stage = stage;
    mockDb.saveCandidates(candidates);

    return {
      success: true,
      message: `Candidat déplacé vers la phase: ${stage}`,
      data: candidates[idx],
    };
  },

  async convertCandidateToEmployee(candidateId) {
    await mockDb.delay(500);
    const candidates = mockDb.getCandidates();
    const emps = mockDb.getEmployees();
    const jobs = mockDb.getRecruitments();

    const cand = candidates.find(c => c._id === candidateId);
    if (!cand) throw new Error('Candidat introuvable');

    const job = jobs.find(j => j._id === cand.recruitment);

    // Create new Employee profile
    const newEmp = {
      _id: mockDb.generateId('emp'),
      employeeCode: `EMP-00${emps.length + 1}`,
      firstName: cand.firstName,
      lastName: cand.lastName,
      email: cand.email,
      phone: cand.phone,
      gender: 'male',
      birthDate: '1995-01-01',
      hireDate: new Date().toISOString().split('T')[0],
      department: job?.department || 'dept_rd',
      position: null,
      contract: { type: job?.contractType || 'cdi', startDate: new Date().toISOString().split('T')[0], status: 'active' },
      salary: { base: 450000, currency: 'XOF' },
      leaveBalance: { annual: 24, sick: 10, other: 0 },
      status: 'active',
      notes: `Recruté le ${new Date().toLocaleDateString('fr-FR')} via l'offre ${job?.title || ''}.`,
      createdAt: new Date().toISOString(),
    };

    emps.push(newEmp);
    mockDb.saveEmployees(emps);

    // Update candidate stage to 'recrute'
    cand.stage = 'recrute';
    mockDb.saveCandidates(candidates);

    return {
      success: true,
      message: `Fiche employé créée avec succès pour ${cand.firstName} ${cand.lastName}`,
      data: newEmp,
    };
  },
};

export default recruitmentService;
