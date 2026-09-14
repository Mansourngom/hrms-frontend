import { mockDb } from './mockDb';

const reportService = {
  async getDashboardData() {
    await mockDb.delay();
    const emps = mockDb.getEmployees();
    const depts = mockDb.getDepartments();
    const leaves = mockDb.getLeaves();
    const recruitments = mockDb.getRecruitments();
    const candidates = mockDb.getCandidates();
    const payrolls = mockDb.getPayrolls();
    const attendances = mockDb.getAttendances();

    // Dynamically calculate counts
    const activeEmployeesCount = emps.filter(e => e.status === 'active' || e.status === 'on_leave').length;
    const departmentsCount = depts.length;
    const leavesPendingCount = leaves.filter(l => l.status === 'pending').length;
    const recruitmentsCount = recruitments.filter(r => r.status === 'published').length;
    const candidatesCount = candidates.length;
    
    // Simulate present count: if no attendance records exist, simulate 90% of employees are present
    const presentTodayCount = attendances.length > 0
      ? attendances.filter(a => a.status === 'present').length
      : Math.round(activeEmployeesCount * 0.9);

    const payrollsCount = payrolls.length;

    return {
      success: true,
      data: {
        employees: activeEmployeesCount,
        departments: departmentsCount,
        leavesPending: leavesPendingCount || 2, // Hardcoded fallback for UI richness
        recruitments: recruitmentsCount || 4, // Hardcoded fallback for UI richness
        candidates: candidatesCount || 15,
        presentToday: presentTodayCount,
        payrolls: payrollsCount || 12,
      },
    };
  },

  async exportEmployeesExcel() {
    await mockDb.delay(500);
    // Return a mock Excel content blob
    const content = "Code,Prenom,Nom,Email,Telephone,Status\n" + 
      mockDb.getEmployees().map(e => `${e.employeeCode},${e.firstName},${e.lastName},${e.email},${e.phone},${e.status}`).join('\n');
    return new Blob([content], { type: 'text/csv;charset=utf-8;' });
  },

  async exportEmployeesPdf() {
    await mockDb.delay(500);
    // Return a mock PDF content blob
    const content = "RAPPORT DES EMPLOYES NEXUS HR\n\n" + 
      mockDb.getEmployees().map(e => `${e.employeeCode} - ${e.firstName} ${e.lastName} - ${e.email}`).join('\n');
    return new Blob([content], { type: 'text/plain;charset=utf-8;' });
  },
};

export default reportService;
