import { mockDb } from './mockDb';

const populatePosition = (pos, depts) => {
  const department = depts.find((d) => d._id === pos.department) || pos.department;
  return {
    ...pos,
    department,
  };
};

const positionService = {
  async getPositions(params = {}) {
    await mockDb.delay();
    const positions = mockDb.getPositions();
    const depts = mockDb.getDepartments();

    const populated = positions.map((p) => populatePosition(p, depts));

    return {
      success: true,
      data: populated,
    };
  },

  async getPosition(id) {
    await mockDb.delay();
    const positions = mockDb.getPositions();
    const depts = mockDb.getDepartments();

    const pos = positions.find((p) => p._id === id);
    if (!pos) {
      throw {
        response: {
          data: { message: 'Poste introuvable' }
        }
      };
    }

    const populated = populatePosition(pos, depts);

    return {
      success: true,
      data: populated,
    };
  },

  async createPosition(data) {
    await mockDb.delay();
    const positions = mockDb.getPositions();

    // Check code unique
    if (positions.some((p) => p.code.toUpperCase() === data.code.toUpperCase())) {
      throw {
        response: {
          data: { message: 'Ce code de poste est déjà utilisé' }
        }
      };
    }

    const newPos = {
      ...data,
      _id: mockDb.generateId('pos'),
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    positions.push(newPos);
    mockDb.savePositions(positions);

    return {
      success: true,
      message: 'Poste créé avec succès',
      data: newPos,
    };
  },

  async updatePosition(id, data) {
    await mockDb.delay();
    const positions = mockDb.getPositions();
    const idx = positions.findIndex((p) => p._id === id);

    if (idx === -1) {
      throw {
        response: {
          data: { message: 'Poste introuvable' }
        }
      };
    }

    const updated = {
      ...positions[idx],
      ...data,
      _id: id,
    };

    positions[idx] = updated;
    mockDb.savePositions(positions);

    return {
      success: true,
      message: 'Poste mis à jour',
      data: updated,
    };
  },

  async deletePosition(id) {
    await mockDb.delay();
    const positions = mockDb.getPositions();
    const filtered = positions.filter((p) => p._id !== id);

    if (positions.length === filtered.length) {
      throw {
        response: {
          data: { message: 'Poste introuvable' }
        }
      };
    }

    mockDb.savePositions(filtered);

    return {
      success: true,
      message: 'Poste supprimé avec succès',
    };
  },
};

export default positionService;
