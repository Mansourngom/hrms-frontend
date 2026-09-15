import api from './api';

const normalizeDepartment = (dept) => ({
  ...dept,
  _id: dept.id?.toString() || dept._id,
  id: dept.id,
  name: dept.name,
  description: dept.description || '',
  budget: dept.budget ? parseFloat(dept.budget) : 0,
  manager: dept.manager,
  managerName: dept.manager_name || 'Non assigné',
  employeeCount: dept.employee_count || 0,
  createdAt: dept.created_at,
});

const departmentService = {
  async getDepartments(params = {}) {
    const response = await api.get('/departments/', { params });
    const rawList = Array.isArray(response.data) 
      ? response.data 
      : (response.data?.results || []);

    const data = rawList.map(normalizeDepartment);

    return {
      success: true,
      data,
      count: response.data?.count || data.length,
    };
  },

  async getDepartment(id) {
    const response = await api.get(`/departments/${id}/`);
    return {
      success: true,
      data: normalizeDepartment(response.data),
    };
  },

  async createDepartment(data) {
    const payload = {
      name: data.name,
      description: data.description || '',
      budget: data.budget ? data.budget.toString() : '0',
      manager: data.manager ? parseInt(data.manager, 10) : null,
    };

    const response = await api.post('/departments/', payload);
    return {
      success: true,
      message: 'Département créé avec succès',
      data: normalizeDepartment(response.data),
    };
  },

  async updateDepartment(id, data) {
    const payload = {};
    if (data.name !== undefined) payload.name = data.name;
    if (data.description !== undefined) payload.description = data.description;
    if (data.budget !== undefined) payload.budget = data.budget.toString();
    if (data.manager !== undefined) payload.manager = data.manager ? parseInt(data.manager, 10) : null;

    const response = await api.patch(`/departments/${id}/`, payload);
    return {
      success: true,
      message: 'Département mis à jour',
      data: normalizeDepartment(response.data),
    };
  },

  async deleteDepartment(id) {
    await api.delete(`/departments/${id}/`);
    return {
      success: true,
      message: 'Département supprimé',
    };
  },
};

export default departmentService;
