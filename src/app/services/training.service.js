import { mockDb } from './mockDb';

const populateTraining = (train, enrollments) => {
  const enrolledCount = enrollments.filter(e => (typeof e.training === 'object' ? e.training._id : e.training) === train._id).length;
  return {
    ...train,
    enrolledCount,
  };
};

const populateEnrollment = (enr, emps, trainings) => {
  const emp = emps.find(e => e._id === enr.employee) || enr.employee;
  const train = trainings.find(t => t._id === enr.training) || enr.training;
  return {
    ...enr,
    employee: emp,
    training: train,
  };
};

const trainingService = {
  async getTrainings(params = {}) {
    await mockDb.delay();
    const trainings = mockDb.getTrainings();
    const enrollments = mockDb.getEnrollments();

    let filtered = [...trainings];
    if (params.category) {
      filtered = filtered.filter(t => t.category === params.category);
    }
    if (params.status) {
      filtered = filtered.filter(t => t.status === params.status);
    }

    const populated = filtered.map(t => populateTraining(t, enrollments));

    return {
      success: true,
      data: populated,
    };
  },

  async createTraining(data) {
    await mockDb.delay();
    const trainings = mockDb.getTrainings();

    const newTrain = {
      _id: mockDb.generateId('train'),
      title: data.title,
      category: data.category || 'Technique',
      provider: data.provider || 'Centre Interne',
      durationHours: Number(data.durationHours) || 10,
      startDate: data.startDate,
      endDate: data.endDate,
      budget: Number(data.budget) || 0,
      status: data.status || 'active',
      description: data.description || '',
      createdAt: new Date().toISOString(),
    };

    trainings.unshift(newTrain);
    mockDb.saveTrainings(trainings);

    return {
      success: true,
      message: 'Formation créée avec succès',
      data: newTrain,
    };
  },

  async deleteTraining(id) {
    await mockDb.delay();
    const trainings = mockDb.getTrainings();
    const filtered = trainings.filter(t => t._id !== id);

    mockDb.saveTrainings(filtered);

    return {
      success: true,
      message: 'Formation supprimée',
    };
  },

  // ENROLLMENTS METHODS
  async getEnrollments(params = {}) {
    await mockDb.delay();
    const enrollments = mockDb.getEnrollments();
    const emps = mockDb.getEmployees();
    const trainings = mockDb.getTrainings();

    let filtered = [...enrollments];
    if (params.employee) {
      filtered = filtered.filter(e => e.employee === params.employee);
    }

    const populated = filtered.map(e => populateEnrollment(e, emps, trainings));

    return {
      success: true,
      data: populated,
    };
  },

  async enrollEmployee(data) {
    await mockDb.delay();
    const enrollments = mockDb.getEnrollments();

    // Check if employee already enrolled
    const exists = enrollments.find(e => e.employee === data.employee && e.training === data.training);
    if (exists) {
      throw {
        response: {
          data: { message: 'Ce collaborateur est déjà inscrit à cette formation' }
        }
      };
    }

    const newEnr = {
      _id: mockDb.generateId('enr'),
      employee: data.employee,
      training: data.training,
      progressPercent: 0,
      status: 'in_progress',
      certificateIssued: false,
      enrolledAt: new Date().toISOString().split('T')[0],
    };

    enrollments.unshift(newEnr);
    mockDb.saveEnrollments(enrollments);

    return {
      success: true,
      message: 'Collaborateur inscrit à la formation avec succès',
      data: newEnr,
    };
  },

  async updateProgress(enrollmentId, progressPercent) {
    await mockDb.delay();
    const enrollments = mockDb.getEnrollments();
    const idx = enrollments.findIndex(e => e._id === enrollmentId);

    if (idx === -1) {
      throw {
        response: {
          data: { message: 'Inscription introuvable' }
        }
      };
    }

    const percent = Math.min(100, Math.max(0, Number(progressPercent)));
    enrollments[idx].progressPercent = percent;

    if (percent === 100) {
      enrollments[idx].status = 'completed';
      enrollments[idx].certificateIssued = true;
    }

    mockDb.saveEnrollments(enrollments);

    return {
      success: true,
      message: percent === 100 ? 'Formation terminée ! Attestation délivrée.' : 'Progression mise à jour',
      data: enrollments[idx],
    };
  },
};

export default trainingService;
