import api from './api';

const reportService = {
  async getDashboardData() {
    try {
      const response = await api.get('/dashboard/stats/');
      const stats = response.data;

      return {
        success: true,
        data: {
          employees: stats.total_employees ?? stats.active_employees ?? 0,
          presentToday: stats.present_today ?? 0,
          absentToday: stats.absent_today ?? 0,
          onLeaveToday: stats.on_leave_today ?? 0,
          leavesPending: stats.pending_leave_requests ?? 0,
          departments: stats.total_departments ?? 0,
          recruitments: 0,
          candidates: 0,
          payrolls: 0,
        },
      };
    } catch (error) {
      console.warn('Failed to fetch stats from /dashboard/stats/, fallback to 0', error);
      return {
        success: true,
        data: {
          employees: 0,
          presentToday: 0,
          absentToday: 0,
          onLeaveToday: 0,
          leavesPending: 0,
          departments: 0,
          recruitments: 0,
          candidates: 0,
          payrolls: 0,
        },
      };
    }
  },
};

export default reportService;
