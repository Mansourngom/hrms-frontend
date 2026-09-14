import { mockDb } from './mockDb';

const populateDepartment = (dept, emps) => {
  const manager = emps.find((e) => e._id === dept.manager) || dept.manager;
  return {
    ...dept,
    manager,
  };
};

const departmentService = {
  async getDepartments(params = {}) {
    await mockDb.delay();
    const depts = mockDb.getDepartments();
    const emps = mockDb.getEmployees();

    const populated = depts.map((d) => populateDepartment(d, emps));

    return {
      success: true,
      data: populated,
    };
  },

  async getDepartment(id) {
    await mockDb.delay();
    const depts = mockDb.getDepartments();
    const emps = mockDb.getEmployees();

    const dept = depts.find((d) => d._id === id);
    if (!dept) {
      throw {
        response: {
          data: { message: 'Département introuvable' }
        }
      };
    }

    const populated = populateDepartment(dept, emps);

    return {
      success: true,
      data: populated,
    };
  },

  async createDepartment(data) {
    await mockDb.delay();
    const depts = mockDb.getDepartments();

    // Check code unique
    if (depts.some((d) => d.code.toUpperCase() === data.code.toUpperCase())) {
      throw {
        response: {
          data: { message: 'Ce code de département est déjà utilisé' }
        }
      };
    }

    const newDept = {
      ...data,
      _id: mockDb.generateId('dept'),
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    depts.push(newDept);
    mockDb.saveDepartments(depts);

    return {
      success: true,
      message: 'Département créé avec succès',
      data: newDept,
    };
  },

  async updateDepartment(id, data) {
    await mockDb.delay();
    const depts = mockDb.getDepartments();
    const idx = depts.findIndex((d) => d._id === id);

    if (idx === -1) {
      throw {
        response: {
          data: { message: 'Département introuvable' }
        }
      };
    }

    const updated = {
      ...depts[idx],
      ...data,
      _id: id,
    };

    depts[idx] = updated;
    mockDb.saveDepartments(depts);

    return {
      success: true,
      message: 'Département mis à jour',
      data: updated,
    };
  },

  async deleteDepartment(id) {
    await mockDb.delay();
    const depts = mockDb.getDepartments();
    const filtered = depts.filter((d) => d._id !== id);

    if (depts.length === filtered.length) {
      throw {
        response: {
          data: { message: 'Département introuvable' }
        }
      };
    }

    mockDb.saveDepartments(filtered);

    return {
      success: true,
      message: 'Département supprimé avec succès',
    };
  },
};

export default departmentService;
