import { mockDb } from './mockDb';

const populateEmployee = (emp, depts, positions, allEmps) => {
  const department = depts.find((d) => d._id === emp.department) || emp.department;
  const position = positions.find((p) => p._id === emp.position) || emp.position;
  const manager = allEmps.find((e) => e._id === emp.manager) || emp.manager;
  
  return {
    ...emp,
    department,
    position,
    manager,
  };
};

const employeeService = {
  async getEmployees(params = {}) {
    await mockDb.delay();
    const emps = mockDb.getEmployees();
    const depts = mockDb.getDepartments();
    const positions = mockDb.getPositions();

    const populated = emps.map((emp) => populateEmployee(emp, depts, positions, emps));

    return {
      success: true,
      data: populated,
    };
  },

  async getEmployee(id) {
    await mockDb.delay();
    const emps = mockDb.getEmployees();
    const depts = mockDb.getDepartments();
    const positions = mockDb.getPositions();

    const emp = emps.find((e) => e._id === id);
    if (!emp) {
      throw {
        response: {
          data: { message: 'Collaborateur introuvable' }
        }
      };
    }

    const populated = populateEmployee(emp, depts, positions, emps);

    return {
      success: true,
      data: populated,
    };
  },

  async createEmployee(data) {
    await mockDb.delay();
    const emps = mockDb.getEmployees();

    // Check email unique
    if (emps.some((e) => e.email.toLowerCase() === data.email.toLowerCase())) {
      throw {
        response: {
          data: { message: 'Cette adresse e-mail est déjà attribuée à un collaborateur' }
        }
      };
    }

    const newEmp = {
      ...data,
      _id: mockDb.generateId('emp'),
      status: 'active',
      createdAt: new Date().toISOString(),
    };

    emps.push(newEmp);
    mockDb.saveEmployees(emps);

    return {
      success: true,
      message: 'Fiche collaborateur créée avec succès',
      data: newEmp,
    };
  },

  async updateEmployee(id, data) {
    await mockDb.delay();
    const emps = mockDb.getEmployees();
    const idx = emps.findIndex((e) => e._id === id);

    if (idx === -1) {
      throw {
        response: {
          data: { message: 'Collaborateur introuvable' }
        }
      };
    }

    const updated = {
      ...emps[idx],
      ...data,
      _id: id, // Keep original ID
    };

    emps[idx] = updated;
    mockDb.saveEmployees(emps);

    return {
      success: true,
      message: 'Fiche collaborateur mise à jour',
      data: updated,
    };
  },

  async deleteEmployee(id) {
    await mockDb.delay();
    const emps = mockDb.getEmployees();
    const filtered = emps.filter((e) => e._id !== id);

    if (emps.length === filtered.length) {
      throw {
        response: {
          data: { message: 'Collaborateur introuvable' }
        }
      };
    }

    mockDb.saveEmployees(filtered);

    return {
      success: true,
      message: 'Collaborateur supprimé avec succès',
    };
  },

  async archiveEmployee(id) {
    return this.updateEmployee(id, { status: 'archived' });
  },

  async reactivateEmployee(id) {
    return this.updateEmployee(id, { status: 'active' });
  },
};

export default employeeService;
