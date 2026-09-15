import api from './api';

const normalizeLeave = (leave) => {
  if (!leave) return null;

  return {
    ...leave,
    _id: leave.id?.toString() || leave._id,
    id: leave.id,
    employee: typeof leave.employee === 'object' ? leave.employee : {
      _id: leave.employee?.toString(),
      id: leave.employee,
      firstName: leave.employee_name?.split(' ')[0] || 'Collaborateur',
      lastName: leave.employee_name?.split(' ').slice(1).join(' ') || '',
    },
    employeeName: leave.employee_name || 'Collaborateur',
    type: (leave.leave_type || leave.type || 'ANNUAL').toLowerCase(),
    leaveType: leave.leave_type || 'ANNUAL',
    startDate: leave.start_date || leave.startDate,
    endDate: leave.end_date || leave.endDate,
    reason: leave.reason || '',
    status: (leave.status || 'PENDING').toLowerCase(),
    comment: leave.comment || '',
    durationDays: leave.duration_days || 1,
    createdAt: leave.created_at,
  };
};

const leaveService = {
  async getLeaves(params = {}) {
    const apiParams = {};
    if (params.status) apiParams.status = params.status.toUpperCase();
    if (params.employee) apiParams.employee = params.employee;
    if (params.leaveType) apiParams.leave_type = params.leaveType.toUpperCase();
    if (params.page) apiParams.page = params.page;

    const response = await api.get('/leaves/', { params: apiParams });
    const rawList = Array.isArray(response.data) 
      ? response.data 
      : (response.data?.results || []);

    const data = rawList.map(normalizeLeave);

    return {
      success: true,
      data,
      count: response.data?.count || data.length,
    };
  },

  async getLeave(id) {
    const response = await api.get(`/leaves/${id}/`);
    return {
      success: true,
      data: normalizeLeave(response.data),
    };
  },

  async createLeave(data) {
    const payload = {
      employee: typeof data.employee === 'object' 
        ? parseInt(data.employee.id || data.employee._id, 10) 
        : parseInt(data.employee, 10),
      leave_type: (data.type || data.leaveType || data.leave_type || 'ANNUAL').toUpperCase(),
      start_date: data.startDate || data.start_date,
      end_date: data.endDate || data.end_date,
      reason: data.reason || '',
    };

    const response = await api.post('/leaves/', payload);
    return {
      success: true,
      message: 'Demande de congé soumise',
      data: normalizeLeave(response.data),
    };
  },

  async createLeaveRequest(data) {
    return this.createLeave(data);
  },

  async updateLeaveStatus(id, status, comment = '') {
    if (status?.toLowerCase() === 'approved') {
      return this.approveLeave(id, comment);
    } else if (status?.toLowerCase() === 'rejected') {
      return this.rejectLeave(id, comment);
    }
    const response = await api.patch(`/leaves/${id}/`, { status: status.toUpperCase(), comment });
    return {
      success: true,
      data: normalizeLeave(response.data),
    };
  },

  async approveLeave(id, comment = '') {
    const response = await api.post(`/leaves/${id}/approve/`, { comment });
    return {
      success: true,
      message: 'Demande de congé approuvée',
      data: normalizeLeave(response.data),
    };
  },

  async rejectLeave(id, comment = '') {
    const response = await api.post(`/leaves/${id}/reject/`, { comment });
    return {
      success: true,
      message: 'Demande de congé refusée',
      data: normalizeLeave(response.data),
    };
  },

  async deleteLeave(id) {
    await api.delete(`/leaves/${id}/`);
    return {
      success: true,
      message: 'Demande supprimée',
    };
  },
};

export default leaveService;
