import { mockDb } from './mockDb';

const populateReview = (rev, emps) => {
  const emp = emps.find(e => e._id === rev.employee) || rev.employee;
  return {
    ...rev,
    employee: emp,
  };
};

const populateGoal = (goal, emps) => {
  const emp = emps.find(e => e._id === goal.employee) || goal.employee;
  return {
    ...goal,
    employee: emp,
  };
};

const performanceService = {
  async getReviews(params = {}) {
    await mockDb.delay();
    const reviews = mockDb.getReviews();
    const emps = mockDb.getEmployees();

    let filtered = [...reviews];
    if (params.period) {
      filtered = filtered.filter(r => r.period === params.period);
    }

    const populated = filtered.map(r => populateReview(r, emps));

    return {
      success: true,
      data: populated,
    };
  },

  async createReview(data) {
    await mockDb.delay();
    const reviews = mockDb.getReviews();

    const newRev = {
      _id: mockDb.generateId('rev'),
      employee: data.employee,
      evaluator: data.evaluator || 'Direction RH',
      period: data.period || 'Annuel 2026',
      rating: Number(data.rating) || 4.0,
      feedback: data.feedback || '',
      status: 'completed',
      reviewDate: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
    };

    reviews.unshift(newRev);
    mockDb.saveReviews(reviews);

    return {
      success: true,
      message: 'Évaluation de performance enregistrée',
      data: newRev,
    };
  },

  async deleteReview(id) {
    await mockDb.delay();
    const reviews = mockDb.getReviews();
    const filtered = reviews.filter(r => r._id !== id);

    mockDb.saveReviews(filtered);

    return {
      success: true,
      message: 'Évaluation supprimée',
    };
  },

  // GOALS & OKRs METHODS
  async getGoals(params = {}) {
    await mockDb.delay();
    const goals = mockDb.getGoals();
    const emps = mockDb.getEmployees();

    let filtered = [...goals];
    if (params.employee) {
      filtered = filtered.filter(g => (typeof g.employee === 'object' ? g.employee._id : g.employee) === params.employee);
    }

    const populated = filtered.map(g => populateGoal(g, emps));

    return {
      success: true,
      data: populated,
    };
  },

  async createGoal(data) {
    await mockDb.delay();
    const goals = mockDb.getGoals();

    const newGoal = {
      _id: mockDb.generateId('goal'),
      employee: data.employee,
      title: data.title,
      period: data.period || 'T3 2026',
      progressPercent: 0,
      dueDate: data.dueDate || new Date(Date.now() + 86400000 * 30).toISOString().split('T')[0],
      status: 'in_progress',
      weight: Number(data.weight) || 20,
      createdAt: new Date().toISOString(),
    };

    goals.unshift(newGoal);
    mockDb.saveGoals(goals);

    return {
      success: true,
      message: 'Objectif assigné avec succès',
      data: newGoal,
    };
  },

  async updateGoalProgress(id, progressPercent) {
    await mockDb.delay();
    const goals = mockDb.getGoals();
    const idx = goals.findIndex(g => g._id === id);

    if (idx === -1) {
      throw {
        response: {
          data: { message: 'Objectif introuvable' }
        }
      };
    }

    const percent = Math.min(100, Math.max(0, Number(progressPercent)));
    goals[idx].progressPercent = percent;

    if (percent === 100) {
      goals[idx].status = 'achieved';
    }

    mockDb.saveGoals(goals);

    return {
      success: true,
      message: percent === 100 ? 'Félicitations ! Objectif atteint à 100%' : 'Progression mise à jour',
      data: goals[idx],
    };
  },
};

export default performanceService;
