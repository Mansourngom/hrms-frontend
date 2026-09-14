import { mockDb } from './mockDb';

const populateLeave = (leave, emps, depts, positions) => {
  const emp = emps.find((e) => e._id === leave.employee) || leave.employee;
  let populatedEmp = emp;
  if (typeof emp === 'object' && emp !== null) {
    const dept = depts.find((d) => d._id === emp.department) || emp.department;
    const pos = positions.find((p) => p._id === emp.position) || emp.position;
    populatedEmp = { ...emp, department: dept, position: pos };
  }

  return {
    ...leave,
    employee: populatedEmp,
  };
};

const leaveService = {
  async getLeaves(params = {}) {
    await mockDb.delay();
    const leaves = mockDb.getLeaves();
    const emps = mockDb.getEmployees();
    const depts = mockDb.getDepartments();
    const positions = mockDb.getPositions();

    let filtered = [...leaves];
    if (params.status) {
      filtered = filtered.filter(l => l.status === params.status);
    }
    if (params.type) {
      filtered = filtered.filter(l => l.type === params.type);
    }

    const populated = filtered.map((l) => populateLeave(l, emps, depts, positions));

    return {
      success: true,
      data: populated,
    };
  },

  async createLeaveRequest(data) {
    await mockDb.delay();
    const leaves = mockDb.getLeaves();
    const emps = mockDb.getEmployees();

    const emp = emps.find(e => e._id === data.employee);
    if (!emp) {
      throw {
        response: {
          data: { message: 'Collaborateur introuvable' }
        }
      };
    }

    // Calculate days between start and end date
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    const diffTime = Math.abs(end - start);
    const daysCount = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    const newLeave = {
      _id: mockDb.generateId('leave'),
      employee: data.employee,
      type: data.type || 'annual',
      startDate: data.startDate,
      endDate: data.endDate,
      daysCount: daysCount > 0 ? daysCount : 1,
      reason: data.reason || '',
      status: 'pending',
      managerComment: '',
      createdAt: new Date().toISOString(),
    };

    leaves.unshift(newLeave);
    mockDb.saveLeaves(leaves);

    return {
      success: true,
      message: 'Demande de congé soumise avec succès',
      data: newLeave,
    };
  },

  async updateLeaveStatus(id, status, managerComment = '') {
    await mockDb.delay();
    const leaves = mockDb.getLeaves();
    const emps = mockDb.getEmployees();
    const idx = leaves.findIndex((l) => l._id === id);

    if (idx === -1) {
      throw {
        response: {
          data: { message: 'Demande introuvable' }
        }
      };
    }

    const leave = leaves[idx];
    leave.status = status;
    if (managerComment) {
      leave.managerComment = managerComment;
    }

    // If approved, deduct leave balance from employee
    if (status === 'approved') {
      const empIdx = emps.findIndex(e => e._id === leave.employee);
      if (empIdx !== -1) {
        const emp = emps[empIdx];
        if (!emp.leaveBalance) emp.leaveBalance = { annual: 24, sick: 10, other: 0 };
        
        if (leave.type === 'annual') {
          emp.leaveBalance.annual = Math.max(0, emp.leaveBalance.annual - leave.daysCount);
        } else if (leave.type === 'sick') {
          emp.leaveBalance.sick = Math.max(0, emp.leaveBalance.sick - leave.daysCount);
        }
        emps[empIdx] = emp;
        mockDb.saveEmployees(emps);
      }
    }

    leaves[idx] = leave;
    mockDb.saveLeaves(leaves);

    return {
      success: true,
      message: `Demande de congé ${status === 'approved' ? 'approuvée' : 'refusée'}`,
      data: leave,
    };
  },
};

export default leaveService;
