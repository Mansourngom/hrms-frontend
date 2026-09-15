import api from './api';

const normalizeAttendance = (att) => {
  if (!att) return null;

  return {
    ...att,
    _id: att.id?.toString() || att._id,
    id: att.id,
    employee: typeof att.employee === 'object' ? att.employee : {
      _id: att.employee?.toString(),
      id: att.employee,
      firstName: att.employee_name?.split(' ')[0] || 'Employé',
      lastName: att.employee_name?.split(' ').slice(1).join(' ') || '',
    },
    employeeName: att.employee_name || 'Employé',
    date: att.date,
    checkIn: att.check_in || att.checkIn,
    checkOut: att.check_out || att.checkOut,
    status: (att.status || 'PRESENT').toLowerCase(),
    note: att.note || '',
    createdAt: att.created_at,
  };
};

const attendanceService = {
  async getAttendances(params = {}) {
    const apiParams = {};
    if (params.date) apiParams.date = params.date;
    if (params.employee) apiParams.employee = params.employee;
    if (params.status) apiParams.status = params.status.toUpperCase();
    if (params.page) apiParams.page = params.page;

    const response = await api.get('/attendance/', { params: apiParams });
    const rawList = Array.isArray(response.data) 
      ? response.data 
      : (response.data?.results || []);

    const data = rawList.map(normalizeAttendance);

    return {
      success: true,
      data,
      count: response.data?.count || data.length,
    };
  },

  async getAttendance(id) {
    const response = await api.get(`/attendance/${id}/`);
    return {
      success: true,
      data: normalizeAttendance(response.data),
    };
  },

  async createAttendance(data) {
    const payload = {
      employee: typeof data.employee === 'object' 
        ? parseInt(data.employee.id || data.employee._id, 10) 
        : parseInt(data.employee, 10),
      date: data.date || new Date().toISOString().split('T')[0],
      check_in: data.checkIn || data.check_in || '08:30:00',
      check_out: data.checkOut || data.check_out || null,
      status: (data.status || 'PRESENT').toUpperCase(),
      note: data.note || data.notes || '',
    };

    const response = await api.post('/attendance/', payload);
    return {
      success: true,
      message: 'Pointage enregistré',
      data: normalizeAttendance(response.data),
    };
  },

  async logAttendance(data) {
    return this.createAttendance(data);
  },

  async updateAttendance(id, data) {
    const payload = {};
    if (data.status) payload.status = data.status.toUpperCase();
    if (data.checkIn || data.check_in) payload.check_in = data.checkIn || data.check_in;
    if (data.checkOut || data.check_out) payload.check_out = data.checkOut || data.check_out;
    if (data.note !== undefined) payload.note = data.note;

    const response = await api.patch(`/attendance/${id}/`, payload);
    return {
      success: true,
      message: 'Pointage mis à jour',
      data: normalizeAttendance(response.data),
    };
  },

  async deleteAttendance(id) {
    await api.delete(`/attendance/${id}/`);
    return {
      success: true,
      message: 'Pointage supprimé',
    };
  },
};

export default attendanceService;
